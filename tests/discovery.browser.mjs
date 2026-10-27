// Browser check using an installed Chrome/Edge and Node 24; no browser package needed.
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const executable=process.env.CHEF_BROWSER||[
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
].find(existsSync);
if(!executable) throw new Error('Set CHEF_BROWSER to an installed Chromium browser.');
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'discovery-browser-'));
const server=http.createServer(async(req,res)=>{
  try {
    let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(file!==root&&!file.startsWith(root+path.sep)) throw new Error('Invalid path');
    if((await fs.stat(file)).isDirectory()) file=path.join(file,'index.html');
    res.setHeader('Content-Type',({'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch {res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const address=`http://127.0.0.1:${server.address().port}/`;
const browser=spawn(executable,['--headless=new','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
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
  await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable');
  const requests=[]; const originalMessage=socket.onmessage;
  socket.onmessage=event=>{const m=JSON.parse(event.data);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);originalMessage(event);};
  async function waitFor(expression){for(let i=0;i<80;i++){if(await evaluate(`Boolean(${expression})`))return;await delay(100);}throw new Error('Timed out waiting for '+expression);}
  async function button(text,scope='#discovery'){await evaluate(`(()=>{const b=[...document.querySelectorAll(${JSON.stringify(scope)}+' button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!b)throw Error('Missing button: '+${JSON.stringify(text)});b.click();})()`);await delay(50);}
  await cdp('Page.navigate',{url:address});
  await waitFor(`document.querySelector('#game-search-input')`);
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await delay(150);
  assert.ok(await evaluate(`document.querySelectorAll('.portal-tile').length>40`),'Full playable catalog is visible');
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),true,'Desktop portal fits viewport');
  const artifactDir=path.resolve(root,'../artifacts');
  await fs.mkdir(artifactDir,{recursive:true});
  await fs.writeFile(path.join(artifactDir,'portal-desktop.png'),Buffer.from((await cdp('Page.captureScreenshot')).data,'base64'));
  await click('.tile-save');
  await click('[aria-label="Saved"]');
  await waitFor(`document.querySelectorAll('.portal-tile').length===1`);
  assert.match(await evaluate(`document.querySelector('.browse-heading').textContent`),/favorites/);
  await click('.tile-save');
  await waitFor(`document.querySelector('.portal-empty')`);
  await click('.portal-empty button');
  await waitFor(`document.querySelectorAll('.portal-tile').length>40`);
  await cdp('Emulation.setDeviceMetricsOverride',{width:360,height:800,deviceScaleFactor:1,mobile:true});
  await delay(150);
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),true,'Mobile portal fits viewport');
  await fs.writeFile(path.join(artifactDir,'portal-mobile.png'),Buffer.from((await cdp('Page.captureScreenshot')).data,'base64'));
  await cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});
  await evaluate(`document.querySelector('.genre-bar button:nth-child(4)').click()`);
  await waitFor(`document.querySelector('.genre-bar button:nth-child(4)').getAttribute('aria-pressed')==='true'`);
  assert.ok(await evaluate(`document.querySelectorAll('.portal-tile').length>0&&document.querySelectorAll('.portal-tile').length<47`),'Puzzle category filters games');
  await evaluate(`document.querySelector('.age-select select').value='ages-1-3';document.querySelector('.age-select select').dispatchEvent(new Event('change',{bubbles:true}))`);
  await waitFor(`document.querySelector('.age-select select').value==='ages-1-3'`);
  assert.ok(await evaluate(`document.querySelectorAll('.portal-tile').length>0`),'Age and category combine');
  await click('.browse-meta button');
  await waitFor(`document.querySelectorAll('.portal-tile').length>40`);
  async function searchFor(value) {
    await evaluate(`(()=>{const input=document.querySelector('#game-search-input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  }
  await searchFor('JUNGLE');
  await waitFor(`document.querySelectorAll('.search-card').length===1`);
  assert.equal(await evaluate(`document.querySelector('.search-card h3').textContent`),'Jungle Adventure World');
  assert.equal(await evaluate(`!!document.querySelector('.search-card mark')`),true);
  await click('.search-card button');
  await waitFor(`document.querySelector('iframe#game-frame')`);
  assert.ok((await evaluate(`document.querySelector('#game-frame').getAttribute('src')`)).includes('jungle-adventure'));
  await click('.playhead .back');
  await waitFor(`document.querySelector('#game-search-input')`);
  assert.equal(await evaluate(`document.querySelector('#game-search-input').value`),'JUNGLE');
  await click('[aria-label="Recent"]');
  await waitFor(`document.querySelectorAll('.portal-tile').length===1`);
  assert.match(await evaluate(`document.querySelector('.portal-tile h3').textContent`),/Jungle/);
  await click('[aria-label="Discover"]');
  await searchFor('nothingmatcheszz');
  await waitFor(`document.querySelector('.search-empty')`);
  await click('[aria-label="Clear search"]');
  await waitFor(`document.querySelector('#game-search-input').value===''`);
  await waitFor(`document.querySelectorAll('[data-world]').length===6`);
  assert.equal(requests.some(u=>/Scene-.*\.js/.test(u)),false,'3D chunk is not requested on homepage');
  await click('[data-world="island"]');
  await waitFor(`document.querySelector('.pattern-strip')`);
  await waitFor(`document.querySelector('.discovery-scene canvas')||document.querySelector('.scene-toolbar button').textContent==='Try 3D view'`);
  assert.equal(await evaluate(`!!document.querySelector('.discovery-scene canvas')`),true,'Software WebGL renders the island');
  if(await evaluate(`!!document.querySelector('.discovery-scene canvas')`)){
    await evaluate(`document.querySelector('.discovery-scene').scrollIntoView({block:'center'})`);await delay(100);
    await fs.writeFile(path.join(profile,'logic-island-3d.png'),Buffer.from((await cdp('Page.captureScreenshot')).data,'base64'));
    await evaluate(`document.querySelector('.discovery-scene canvas').dispatchEvent(new Event('webglcontextlost',{cancelable:true}))`);
    await waitFor(`document.querySelector('.scene-toolbar button').textContent==='Try 3D view'`);
  }
  await button('☀️ Sun');
  assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/repeating pair/);
  await button('Next mission →');
  for(const label of ['Tile 2','Tile 3','Tile 6','Tile 9, finish'])await click(`.bridge-grid button[aria-label="${label}"]`);
  await button('Test my bridge');
  assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/connects/);
  await button('Next mission →');
  for(const text of ['💧 water','🌱 seed','☀️ sunlight'])await button(text);
  await button('Run switches');
  assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/combined/);
  await button('Pause');assert.equal(await evaluate(`document.querySelector('.activity-body').hidden`),true);await button('Continue exploring');
  await button('← All worlds');await click('[data-world="robot"]');await waitFor(`document.querySelector('.robot-grid')`);
  await button('🛞 Chassis fit');await button('📡 Sensor fit');
  for(const direction of ['right','right','right','down','down'])await click(`button[aria-label="Add ${direction} command"]`);
  await button('Run program');assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/Star reached/);
  await button('← All worlds');await click('[data-world="math"]');await waitFor(`document.querySelector('.cargo-meter')`);
  await button('📦 +5');await button('📦 +3');await button('Check cargo');assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/Balanced/);
  await button('← All worlds');await click('[data-world="science"]');await waitFor(`document.querySelector('.lab-controls')`);
  await button('It halves');await button('Test doubling resistance');await button('Explain my prediction');assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/prediction with evidence/);
  await button('← All worlds');await click('[data-world="eco"]');await waitFor(`document.querySelector('.city-grid')`);
  for(const [tool,plots] of [['🏠 home · 2',[0,1]],['☀️ solar · 3',[2]],['💧 water · 2',[3]],['🌳 tree · 1',[4,5]],['♻️ recycle · 2',[6]]]){await button(tool);for(const i of plots)await evaluate(`document.querySelectorAll('.city-grid button')[${i}].click()`);await delay(50);}
  await button('Test city');assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/every need/);
  await button('📚 Learning studio');await button('🧠 Train a toy AI');await button('🍒 Small round fruit · fruit');await button('⚽ A round toy ball');await button('Why can it make a mistake?');assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/insufficient/);
  await button('🖥️ Computers');
  for(const name of ['Keyboard','Processor','Monitor'])await button(name,'.mini-experiment');
  await button('Send a message');assert.match(await evaluate(`document.querySelector('.mini-experiment .game-feedback').textContent`),/Connected/);
  await button('🏛️ Politics & civics');
  for(let i=0;i<5;i++)await click('button[aria-label="Add Garden vote"]');
  for(let i=0;i<3;i++)await click('button[aria-label="Add Mural vote"]');
  await button('Check the count');assert.match(await evaluate(`document.querySelector('.mini-experiment .game-feedback').textContent`),/eight votes/);
  await button('🛰️ Rover mission');
  for(let i=0;i<3;i++)await button('＋2 energy');await button('Check supply');
  for(const arrow of ['→','→','→','↓','↓','↓'])await button(arrow);
  await button('Run rover');
  await evaluate(`(()=>{const el=document.querySelector('input[aria-label="Habitat water setting"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'3');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`);await delay(50);
  await button('Test habitat');assert.match(await evaluate(`document.querySelector('.game-feedback').textContent`),/Balanced/);
  await button('🔎 Thinking check');await button('Start when ready →');await button('Hint');await button('8');await button('Next challenge →');
  await button('I’m ready · hide the trail');await button('Skip this challenge');await button('Next challenge →');await button('Finish for now');
  assert.match(await evaluate(`document.querySelector('.skill-results').textContent`),/Not enough evidence yet/);
  assert.match(await evaluate(`document.querySelector('.discovery-content').textContent`),/1 assisted/);
  await button('🌎 Play worlds');
  await cdp('Emulation.setDeviceMetricsOverride',{width:360,height:800,deviceScaleFactor:1,mobile:true});await delay(300);
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),true,'360px homepage has no horizontal overflow');
  await click('[data-world="island"]');await waitFor(`document.querySelector('.bridge-grid')||document.querySelector('.pattern-strip')`);
  assert.equal(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth`),true,'360px game has no horizontal overflow');
  await button('← All worlds');
  await cdp('Emulation.setDeviceMetricsOverride',{width:1280,height:1000,deviceScaleFactor:1,mobile:false});await delay(150);
  await evaluate(`document.querySelector('#discovery').scrollIntoView()`);await delay(100);
  await fs.writeFile(path.join(profile,'discovery-desktop.png'),Buffer.from((await cdp('Page.captureScreenshot')).data,'base64'));
  for(let group=0;group<4;group++){
    await evaluate(`document.querySelectorAll('.age-tile')[${group}].click()`);await delay(50);
    await evaluate(`document.querySelector('#age-game-list .toddler-tile').click()`);await waitFor(`document.querySelector('iframe#game-frame')`);
    assert.match(await evaluate(`document.querySelector('iframe').getAttribute('src')`),/^\/games\//);
    await click('.playhead .back');await waitFor(`document.querySelectorAll('.age-tile').length===5`);
  }
  await evaluate(`document.querySelectorAll('.age-tile')[4].click()`);await delay(100);
  assert.equal(await evaluate(`document.querySelectorAll('#age-game-list .toddler-tile').length`),4);
  await evaluate(`document.querySelector('#age-game-list .toddler-tile').click()`);await waitFor(`document.querySelector('.robot-grid')`);
  assert.equal(await evaluate(`document.querySelector('.playhead')!==null`),true);
  await button('🔎 Thinking check');
  assert.match(await evaluate(`document.querySelector('.skill-results').textContent`),/Not enough evidence yet/,'Check state survives old-game navigation during this visit');
  await button('Start a fresh check');await button('Start when ready →');
  for(let i=0;i<12;i++){await button('Skip this challenge');await button(i===11?'See my observations':'Next challenge →');}
  assert.match(await evaluate(`document.querySelector('.discovery-content').textContent`),/0 attempted · 12 skipped/);
  await cdp('Page.navigate',{url:address});await waitFor(`document.querySelectorAll('[data-world]').length===6`);
  assert.match(await evaluate(`document.querySelector('.discovery-nav button:last-child').textContent`),/Passport 0/,'Reload clears visit-only discoveries');
  await cdp('Page.navigate',{url:address+'#/play/world-robot'});
  await waitFor(`document.querySelector('.robot-grid')`);
  assert.match(await evaluate(`document.title`),/Robo Builder/,'Direct game URL opens the selected game');
  await cdp('Page.navigate',{url:address+'#/play/not-a-real-game'});
  await waitFor(`document.querySelector('.portal-empty')`);
  assert.match(await evaluate(`document.querySelector('h1').textContent`),/wandered off/);
  assert.deepEqual(errors,[],'No browser runtime exceptions');
  console.log('PASS: portal desktop/mobile layout, favorites, direct game URLs, search/launch/return, lazy 3D loading, all three island missions, robot, maths, science, city, AI, assisted/skipped assessment, mobile layout and ages 10–13 launch.');
  console.log('Screenshot: '+path.join(profile,'discovery-desktop.png'));
} finally {socket?.close();browser.kill();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
