import { activities, foods, colors, handSteps, tools, cleanSteps, createGame, ingredients, progress, reduceGame } from './game.mjs';

const $=id=>document.getElementById(id);
const workspace=$('workspace');
const stickerKey='little-chef-academy-stickers-v1';
let state=null,round=0,sound=false,audio=null,drag=null,ignoreClickUntil=0;
let stickers=[];
try {
  const saved=JSON.parse(localStorage.getItem(stickerKey)||'[]');
  if (Array.isArray(saved)) stickers=[...new Set(saved.filter(id=>activities.some(a=>a.id===id)))];
} catch { /* Play continues when browser storage is unavailable. */ }

function shuffled(items) {
  const copy=[...items];
  for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
  return copy;
}
let trayOrder=[];
const nameOf=id=>foods.find(f=>f.id===id)?.name||tools.find(t=>t.id===id)?.name||id;
const iconOf=id=>foods.find(f=>f.id===id)?.icon||tools.find(t=>t.id===id)?.icon||'✨';
const completedIcons=ids=>ids.map(id=>iconOf(id)).join(' ');

function renderMenu() {
  $('activity-menu').innerHTML=activities.map(activity=>`<button class="activity-card" data-activity="${activity.id}" style="background:${activity.color}">
    ${stickers.includes(activity.id)?'<span class="earned" aria-label="Sticker earned">⭐</span>':''}
    <span class="activity-icon" aria-hidden="true">${activity.icon}</span><span class="skill">${activity.skill}</span>
    <h3>${activity.name}</h3><p>${activity.description}</p><span class="card-play">Let’s play →</span>
  </button>`).join('');
  $('badge-count').textContent=`${stickers.length} / 4 chef stickers`;
}

function start(id) {
  stopDrag();
  window.speechSynthesis?.cancel();
  state=createGame(id,round++);
  trayOrder=shuffled(id==='cleanup'?tools:ingredients(state)).map(f=>f.id);
  $('menu-view').hidden=true;
  $('play-view').hidden=false;
  $('home').hidden=false;
  $('celebration').hidden=true;
  const activity=activities.find(a=>a.id===id);
  $('activity-title').textContent=activity.name;
  $('activity-kicker').textContent=activity.skill.toUpperCase();
  render();
  $('activity-title').focus({preventScroll:true});
  $('play-view').scrollIntoView({behavior:'instant',block:'start'});
  if(sound) speak(instruction());
}

function menu() {
  const previous=state?.activity;
  state=null;
  stopDrag();
  window.speechSynthesis?.cancel();
  $('play-view').hidden=true;
  $('menu-view').hidden=false;
  $('home').hidden=true;
  renderMenu();
  if(previous) $('activity-menu').querySelector(`[data-activity="${previous}"]`)?.focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'instant'});
}

function instruction() {
  if(!state) return 'Choose a kitchen adventure.';
  if(state.complete) return 'Wonderful work, chef! Play again or try the next adventure.';
  if(state.phase==='hands') return handSteps[state.hands].instruction;
  if(state.activity==='salad') return 'Choose a fruit from the recipe. Rinse it in the sink, then put it in the bowl.';
  if(state.activity==='colors') return 'Choose an ingredient, then choose the bowl with its matching color.';
  if(state.activity==='sort') return 'Choose a food, then put it in the fruit basket or the vegetable basket.';
  return cleanSteps[state.cleanStep].text;
}

function target(id,icon,title,note='',contents='',className='',extra='') {
  return `<button class="target ${className} ${state.selected?'has-selection':''}" data-target="${id}" ${state.complete?'disabled':''} ${extra}>
    <span class="target-icon" aria-hidden="true">${icon}</span><span>${title}</span>${note?`<span class="target-note">${note}</span>`:''}
    ${contents?`<span class="target-foods" aria-label="Already placed">${contents}</span>`:''}</button>`;
}

function foodButton(item) {
  const placed=state.done.includes(item.id),rinsed=state.rinsed.includes(item.id);
  return `<button class="food" data-food="${item.id}" aria-pressed="${state.selected===item.id}" aria-label="${item.name}${placed?', finished':rinsed?', rinsed':''}" ${placed||state.complete?'disabled':''}>
    <span class="food-icon" aria-hidden="true">${placed?'✓':item.icon}</span><span class="food-name">${item.name}</span>${rinsed&&!placed?'<span class="rinsed" aria-label="Rinsed">💧</span>':''}</button>`;
}

function recipeBoard() {
  let heading='',subtitle=instruction(),icons='';
  if(state.phase==='hands') {
    heading='Before we cook… clean hands!';
    icons='<span aria-hidden="true">🧼 💧</span>';
  } else if(state.activity==='salad') {
    heading='Our fruit salad recipe';
    icons=state.recipe.map(id=>`<span class="${state.done.includes(id)?'checked':''}" aria-label="${nameOf(id)}${state.done.includes(id)?', added':''}">${iconOf(id)}${state.done.includes(id)?'✓':''}</span>`).join('');
  } else if(state.activity==='colors') {
    heading='A little rainbow in every bowl';
    icons='<span aria-hidden="true">🌈</span>';
  } else if(state.activity==='sort') {
    heading='Everything has a little home';
    icons='<span aria-hidden="true">🧺</span>';
  } else {
    heading=state.complete?'Our kitchen is sparkling!':`Little helper task ${state.cleanStep+1} of ${cleanSteps.length}`;
    icons=`<span aria-hidden="true">${state.complete?'✨':iconOf(cleanSteps[state.cleanStep].tool)}</span>`;
  }
  return `<div class="recipe-board"><div><p class="eyebrow">${state.phase==='hands'?'GOOD HABITS START HERE':'TODAY’S LITTLE MISSION'}</p><h2>${heading}</h2><p>${subtitle}</p></div><div class="recipe-icons">${icons}</div></div>`;
}

function render() {
  const focused=document.activeElement;
  const focusFood=focused?.dataset.food,focusTarget=focused?.dataset.target,focusHand=focused?.dataset.hand;
  const p=progress(state);
  $('progress-text').textContent=state.complete?'All done! ⭐':`${p.value} / ${p.total} little steps`;
  $('progress').max=p.total;
  $('progress').value=p.value;
  if(state.phase==='hands') {
    workspace.innerHTML=recipeBoard()+`<div class="worktop"><div class="hand-scene"><span class="wash-bubble" aria-hidden="true">${['🤲','💦','🙌','💦'][state.hands]}</span><p>Let’s practice our handwashing steps.</p></div><div class="hand-steps">${handSteps.map((step,i)=>`<button class="hand-step ${i===state.hands?'is-next':''}" data-hand="${step.id}" ${i<state.hands?'disabled':''} ${i===state.hands?'aria-current="step"':''}><span aria-hidden="true">${i<state.hands?'✓':step.icon}</span>${i+1}. ${step.label}</button>`).join('')}</div></div>`;
  } else {
    let targets='';
    if(state.activity==='salad') {
      targets=target('sink','🚰','Rinse fruit','A splash of clean water')+target('bowl',state.complete?'🥗':'🥣','Salad bowl','Washed fruit goes here',completedIcons(state.done));
    } else if(state.activity==='colors') {
      targets=colors.map(c=>target(c.id,'🥣',c.name,'',completedIcons(state.done.filter(id=>foods.find(f=>f.id===id).color===c.id)),'color-target',`style="border-color:${c.hex}"`)
        .replace('<span class="target-icon"',`<span class="color-swatch" aria-hidden="true" style="--swatch:${c.hex}"></span><span class="target-icon"`)).join('');
    } else if(state.activity==='sort') {
      targets=['fruit','vegetable'].map(group=>target(group,'🧺',group==='fruit'?'Fruits':'Vegetables',group==='fruit'?'Sweet, fruity friends':'Our veggie patch',completedIcons(state.done.filter(id=>foods.find(f=>f.id===id).group===group)))).join('');
    } else {
      targets=target('bin',state.cleanStep>0?'🌱':'🗑️','Compost bin',state.cleanStep>0?'Scraps are sorted!':'Food scraps go here')
        +target('sink',state.cleanStep>=4?'✨':state.cleanStep>=2?'🍽️':'🚰','Kitchen sink',state.cleanStep>=4?'Dishes are clean!':state.cleanStep===3?'Rinse the bubbles away':'A home for dirty dishes')
        +target('counter',state.cleanStep>=6?'✨':state.cleanStep>=5?'💧':'🟤','Counter',state.cleanStep>=6?'Clean and dry!':state.cleanStep>=5?'Now dry with a towel':'A little spill to wipe');
    }
    const list=state.activity==='cleanup'?tools:ingredients(state);
    const sorted=trayOrder.map(id=>list.find(item=>item.id===id)).filter(Boolean);
    workspace.innerHTML=recipeBoard()+`<div class="worktop"><div class="targets">${targets}</div><p class="tray-label">${state.complete?'A WONDERFUL LITTLE JOB':'CHOOSE '+(state.activity==='cleanup'?'A HELPER':'AN INGREDIENT')+' · THEN TAP ITS HOME'}</p><div class="food-tray">${sorted.map(foodButton).join('')}</div></div>`;
  }
  $('feedback').textContent=state.message||instruction();
  $('feedback').style.color=state.correct===false?'#8a583e':'#476b51';
  if(focusFood) {
    const next=workspace.querySelector(`[data-food="${focusFood}"]:not(:disabled)`)||workspace.querySelector('[data-food]:not(:disabled)');
    next?.focus({preventScroll:true});
  } else if(focusTarget) {
    (workspace.querySelector(`[data-target="${focusTarget}"]:not(:disabled)`)||workspace.querySelector('[data-food]:not(:disabled)'))?.focus({preventScroll:true});
  } else if(focusHand) {
    (workspace.querySelector('.hand-step.is-next')||workspace.querySelector('[data-food]:not(:disabled)'))?.focus({preventScroll:true});
  }
}

function dispatch(action) {
  if(!state) return;
  const wasComplete=state.complete,oldPhase=state.phase;
  state=reduceGame(state,action);
  render();
  if(state.correct&&action.type!=='select') chime();
  if(state.complete&&!wasComplete) celebrate();
  else if(oldPhase!==state.phase&&sound) speak(instruction());
}

function celebrate() {
  if(!stickers.includes(state.activity)) {
    stickers.push(state.activity);
    try {localStorage.setItem(stickerKey,JSON.stringify(stickers));} catch { /* Stickers stay for this visit. */ }
  }
  const messages={salad:'Clean hands, fresh fruit, and a colorful bowl to share. You earned your salad chef sticker!',colors:'You found the rainbow in your ingredients. You earned your color chef sticker!',sort:'Fruit and vegetables all have a home. You earned your market helper sticker!',cleanup:'Scraps sorted, dishes washed, counter clean and dry. You earned your kitchen helper sticker!'};
  $('celebration-copy').textContent=messages[state.activity];
  $('celebration-title').textContent=stickers.length===4?'Your chef sticker collection is complete!':'Wonderful work, chef!';
  $('celebration').hidden=false;
  $('celebration').focus({preventScroll:true});
  $('celebration').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  if(sound) speak('Wonderful work, chef! '+messages[state.activity]);
}

function speak(text) {
  if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)) {
    $('feedback').textContent='The voice is taking a break. Follow the pictures and words to keep playing.';
    return;
  }
  try {
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='en-US';
    utterance.rate=.85;
    speechSynthesis.speak(utterance);
  } catch { $('feedback').textContent='Follow the pictures and words. You can keep playing!'; }
}

function chime() {
  if(!sound) return;
  try {
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio) return;
    audio=audio||new Audio();
    if(audio.state==='suspended') audio.resume().catch(()=>{});
    const oscillator=audio.createOscillator(),gain=audio.createGain();
    oscillator.connect(gain);gain.connect(audio.destination);
    oscillator.frequency.setValueAtTime(660,audio.currentTime);
    oscillator.frequency.setValueAtTime(880,audio.currentTime+.1);
    gain.gain.setValueAtTime(.06,audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.24);
    oscillator.start();oscillator.stop(audio.currentTime+.25);
  } catch { /* Audio is optional. */ }
}

function stopDrag() {
  document.querySelector('.ghost')?.remove();
  document.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
  drag=null;
}

$('activity-menu').addEventListener('click',event=>{
  const card=event.target.closest('[data-activity]');
  if(card) start(card.dataset.activity);
});
workspace.addEventListener('click',event=>{
  if(performance.now()<ignoreClickUntil) return;
  const button=event.target.closest('button');
  if(!button||button.disabled) return;
  if(button.dataset.hand) dispatch({type:'hands',id:button.dataset.hand});
  if(button.dataset.food) dispatch({type:'select',id:button.dataset.food});
  if(button.dataset.target) dispatch({type:'place',target:button.dataset.target});
});
workspace.addEventListener('pointerdown',event=>{
  const food=event.target.closest('[data-food]');
  if(!food||food.disabled||event.button!==0) return;
  drag={id:food.dataset.food,x:event.clientX,y:event.clientY,active:false,pointerId:event.pointerId};
});
document.addEventListener('pointermove',event=>{
  if(!drag||drag.pointerId!==event.pointerId) return;
  if(!drag.active&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>9) {
    drag.active=true;
    dispatch({type:'select',id:drag.id});
    const ghost=document.createElement('div');
    ghost.className='ghost';ghost.setAttribute('aria-hidden','true');ghost.textContent=iconOf(drag.id);document.body.append(ghost);
  }
  if(!drag.active) return;
  event.preventDefault();
  const ghost=document.querySelector('.ghost');
  ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';
  document.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
  document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-target]')?.classList.add('drag-over');
},{passive:false});
document.addEventListener('pointerup',event=>{
  if(!drag||drag.pointerId!==event.pointerId) return;
  if(drag.active) {
    ignoreClickUntil=performance.now()+400;
    const target=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-target]');
    if(target) dispatch({type:'place',target:target.dataset.target});
  }
  stopDrag();
});
document.addEventListener('pointercancel',stopDrag);
window.addEventListener('blur',stopDrag);
$('home').onclick=menu;
$('restart').onclick=()=>start(state.activity);
$('again').onclick=()=>start(state.activity);
$('next').onclick=()=>start(activities[(activities.findIndex(a=>a.id===state.activity)+1)%activities.length].id);
$('listen').onclick=()=>speak(instruction());
$('sound').onclick=()=>{
  sound=!sound;
  $('sound').textContent=sound?'🔊 Sound on':'🔇 Sound off';
  $('sound').setAttribute('aria-pressed',String(sound));
  if(sound) speak(state?instruction():'Welcome to Little Chef Academy. Choose your kitchen adventure.');
  else window.speechSynthesis?.cancel();
};
renderMenu();
const requested=new URLSearchParams(location.search).get('activity');
if(activities.some(a=>a.id===requested)) start(requested);
