// Browser check using an installed Chrome/Edge and Node 24; no browser package needed.
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../public/',import.meta.url));
const executable=process.env.CHEF_BROWSER||[
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(existsSync);
if(!executable) throw new Error('Set CHEF_BROWSER to an installed Chromium browser.');
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'little-chef-browser-'));
const server=http.createServer(async(req,res)=>{
  try {
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root)) throw new Error('Invalid path');
    if((await fs.stat(file)).isDirectory()) file=path.join(file,'index.html');
    res.setHeader('Content-Type',({'.html':'text/html','.mjs':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch {res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=`http://127.0.0.1:${server.address().port}/games/little-chef-academy/`;
const browser=spawn(executable,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
let browserLog='';
browser.stderr.on('data',chunk=>{browserLog=(browserLog+chunk).slice(-3000);});
let socket;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try {
  let port;
  for(let i=0;i<100;i++) {
    try {port=Number((await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;} catch {await delay(100);}
  }
  if(!port) throw new Error('The browser did not start.');
  const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`,{signal:AbortSignal.timeout(20000)})).json();
  socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  let sequence=0;
  const pending=new Map(),errors=[];
  socket.onmessage=event=>{
    const message=JSON.parse(event.data);
    if(message.id) {
      const call=pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(call.timer);
      if(message.error) call.reject(new Error(message.error.message)); else call.resolve(message.result);
    } else if(message.method==='Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  };
  const cdp=(method,params={})=>new Promise((resolve,reject)=>{
    const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(new Error('Browser timeout: '+method));},10000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));
  });
  async function evaluate(expression) {
    const result=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
    return result.result.value;
  }
  const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const complete=()=>evaluate(`!document.querySelector('#celebration').hidden`);
  await cdp('Runtime.enable');
  await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride',{width:1120,height:850,deviceScaleFactor:1,mobile:false});
  await cdp('Page.navigate',{url:address});
  for(let i=0;i<100;i++) {
    if(await evaluate(`document.querySelectorAll('[data-activity]').length===4`)) break;
    await delay(50);
  }
  assert.equal(await evaluate(`document.querySelectorAll('[data-activity]').length`),4);
  await fs.writeFile(path.join(profile,'desktop.png'),Buffer.from((await cdp('Page.captureScreenshot',{captureBeyondViewport:true})).data,'base64'));
  console.log('Desktop menu loaded with four activities.');

  await click('[data-activity="salad"]');
  assert.equal(await evaluate(`document.querySelectorAll('[data-food]').length`),0);
  for(const step of ['soap','rub','rinse','dry']) await click(`[data-hand="${step}"]`);
  const recipe=await evaluate(`Array.from(document.querySelectorAll('.recipe-icons [aria-label]'),e=>e.getAttribute('aria-label').toLowerCase())`);
  for(const food of recipe) {
    await click(`[data-food="${food}"]`);
    await click('[data-target="bowl"]');
    assert.equal(await evaluate(`document.querySelector('#celebration').hidden`),true);
    await click('[data-target="sink"]');
    await click('[data-target="bowl"]');
  }
  assert.equal(await complete(),true);
  console.log('Fruit salad: hygiene, rinse checks, and recipe completion passed.');
  await click('#home');

  await click('[data-activity="colors"]');
  const colorMap={apple:'red',banana:'yellow',grapes:'purple',strawberry:'red',orange:'orange',pear:'green',carrot:'orange',broccoli:'green',eggplant:'purple',corn:'yellow'};
  // A real pointer drag checks the shared drag-and-drop controls.
  await evaluate(`document.querySelector('[data-food="apple"]').scrollIntoView({block:'center'})`);
  const rectangles=await evaluate(`['[data-food="apple"]','[data-target="red"]'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})`);
  const [from,to]=rectangles;
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:from.x,y:from.y,button:'left',buttons:1,clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:from.x+15,y:from.y-15,button:'left',buttons:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:to.x,y:to.y,button:'left',buttons:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:to.x,y:to.y,button:'left',buttons:0,clickCount:1});
  assert.equal(await evaluate(`document.querySelector('[data-food="apple"]').disabled`),true);
  await delay(450);
  for(const [food,color] of Object.entries(colorMap).filter(([food])=>food!=='apple')) {
    await click(`[data-food="${food}"]`);await click(`[data-target="${color}"]`);
  }
  assert.equal(await complete(),true);
  console.log('Color matching: pointer drag and all ten ingredients passed.');
  await click('#home');
  await click('[data-activity="sort"]');
  const sortItems=await evaluate(`Array.from(document.querySelectorAll('[data-food]'),b=>b.dataset.food)`);
  for(const food of sortItems) {
    await click(`[data-food="${food}"]`);
    await click(`[data-target="${['apple','banana','grapes','strawberry'].includes(food)?'fruit':'vegetable'}"]`);
  }
  assert.equal(await complete(),true);
  console.log('Fruit and vegetable sorting passed.');
  await click('#home');
  await click('[data-activity="cleanup"]');
  for(const [tool,target] of [['scraps','bin'],['dishes','sink'],['soap','sink'],['water','sink'],['cloth','counter'],['towel','counter']]) {
    await click(`[data-food="${tool}"]`);await click(`[data-target="${target}"]`);
  }
  assert.equal(await complete(),true);
  await click('#home');
  assert.match(await evaluate(`document.querySelector('#badge-count').textContent`),/4 \/ 4/);
  console.log('Cleanup sequence and all four saved stickers passed.');

  await cdp('Page.reload');
  await delay(500);
  assert.match(await evaluate(`document.querySelector('#badge-count').textContent`),/4 \/ 4/);
  await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),true);
  await fs.writeFile(path.join(profile,'phone.png'),Buffer.from((await cdp('Page.captureScreenshot',{captureBeyondViewport:true})).data,'base64'));
  await click('[data-activity="colors"]');
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),true);
  await evaluate(`document.querySelector('[data-food="banana"]').scrollIntoView({block:'center'})`);
  const tap=await evaluate(`(()=>{let r=document.querySelector('[data-food="banana"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tap.x,y:tap.y}]});
  await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await evaluate(`document.querySelector('[data-food="banana"]').getAttribute('aria-pressed')`),'true');
  console.log('Phone layout has no horizontal overflow; touch selection passed.');
  await fs.writeFile(path.join(profile,'phone-game.png'),Buffer.from((await cdp('Page.captureScreenshot',{captureBeyondViewport:true})).data,'base64'));
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await cdp('Emulation.setDeviceMetricsOverride',{width:1120,height:850,deviceScaleFactor:1,mobile:false});
  await delay(500);
  await evaluate(`document.querySelector('[data-target="yellow"]').focus()`);
  assert.equal(await evaluate(`document.activeElement.dataset.target`),'yellow');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  assert.equal(await evaluate(`document.querySelector('[data-food="banana"]').disabled`),true,await evaluate(`document.querySelector('#feedback').textContent`));
  console.log('Keyboard Enter places selected food in its matching bowl.');
  assert.deepEqual(errors,[],'No browser runtime exceptions');
  console.log('Screenshots: '+profile);
} finally {
  socket?.close();
  browser.kill();
  server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
  if(browserLog.includes('ERROR')) console.log(browserLog);
}
