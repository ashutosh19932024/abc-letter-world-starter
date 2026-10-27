import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { activities, foods, colors, handSteps, tools, cleanSteps, createGame, ingredients, progress, reduceGame } from '../public/games/little-chef-academy/game.mjs';
import { games } from '../src/games.js';

const select=(s,id)=>reduceGame(s,{type:'select',id});
const place=(s,target)=>reduceGame(s,{type:'place',target});
function washHands(state) {
  for(const step of handSteps) state=reduceGame(state,{type:'hands',id:step.id});
  return state;
}

test('the library card launches the game with its correct age and activity count',()=>{
  const game=games.find(g=>g.id==='little-chef-academy');
  assert.equal(game.age,'3–8');
  assert.equal(game.badge,'4 ACTIVITIES');
  assert.equal(game.ready,true);
  assert.equal(activities.length,4);
  assert.ok(fs.existsSync(new URL('../public'+game.url,import.meta.url)));
});

test('all ingredients have a unique ID and a labeled color and food group',()=>{
  assert.equal(new Set(foods.map(f=>f.id)).size,foods.length);
  for(const food of foods) {
    assert.ok(colors.some(c=>c.id===food.color));
    assert.ok(['fruit','vegetable'].includes(food.group));
  }
});

test('food preparation waits for all four handwashing steps in order',()=>{
  const initial=createGame('salad');
  assert.deepEqual(select(initial,'apple'),initial);
  assert.equal(reduceGame(initial,{type:'hands',id:'dry'}).hands,0);
  const washed=washHands(initial);
  assert.equal(washed.hands,4);
  assert.equal(washed.phase,'play');
  assert.deepEqual(progress(washed),{value:4,total:8});
  assert.deepEqual(reduceGame(washed,{type:'hands',id:'soap'}),washed);
});

test('fruit salad rejects vegetables and asks for a rinse before adding fruit',()=>{
  let s=washHands(createGame('salad'));
  s=place(select(s,'carrot'),'bowl');
  assert.equal(s.correct,false);
  assert.equal(s.done.length,0);
  s=place(select(s,s.recipe[0]),'bowl');
  assert.equal(s.correct,false);
  assert.equal(s.done.length,0);
  s=place(s,'sink');
  assert.equal(s.rinsed.length,1);
  s=place(s,'sink');
  assert.equal(s.rinsed.length,1,'Repeated rinses do not add extra progress');
  s=place(s,'bowl');
  assert.equal(s.done.length,1);
  const added=s.done[0];
  s=select(s,added);
  assert.equal(s.selected,null,'An added fruit cannot be selected again');
  s=place(s,'bowl');
  assert.equal(s.done.length,1);
});

test('every fruit-salad recipe can be completed and a completed activity stays finished',()=>{
  for(let round=0;round<3;round++) {
    let s=washHands(createGame('salad',round));
    for(const id of s.recipe) s=place(place(select(s,id),'sink'),'bowl');
    assert.equal(s.complete,true);
    assert.deepEqual(progress(s),{value:8,total:8});
    assert.deepEqual(place(s,'bowl'),s);
    assert.deepEqual(select(s,'carrot'),s);
  }
});

test('wrong color matches allow retry without consuming ingredients',()=>{
  let s=createGame('colors');
  const food=ingredients(s)[0];
  s=place(select(s,food.id),'purple');
  assert.equal(s.correct,false);
  assert.equal(s.selected,food.id);
  assert.equal(s.done.length,0);
  s=place(s,food.color);
  assert.equal(s.correct,true);
  assert.equal(s.done.length,1);
});

test('every ingredient can be matched to its color and sorted into its food group',()=>{
  for(const activity of ['colors','sort']) {
    let s=createGame(activity);
    for(const food of ingredients(s)) s=place(select(s,food.id),activity==='colors'?food.color:food.group);
    assert.equal(s.complete,true);
    assert.equal(progress(s).value,progress(s).total);
    assert.equal(new Set(s.done).size,s.done.length);
  }
});

test('wrong food groups and empty selections do not advance the game',()=>{
  let s=createGame('sort');
  assert.equal(place(s,'fruit').done.length,0);
  s=place(select(s,'broccoli'),'fruit');
  assert.equal(s.correct,false);
  assert.equal(s.done.length,0);
  s=place(s,'vegetable');
  assert.equal(s.done.length,1);
});

test('cleanup requires the correct tool, destination and sequence',()=>{
  let s=createGame('cleanup');
  s=place(select(s,'towel'),'counter');
  assert.equal(s.cleanStep,0);
  s=place(select(s,'scraps'),'sink');
  assert.equal(s.cleanStep,0);
  assert.equal(s.correct,false);
  for(const step of cleanSteps) {
    assert.ok(tools.some(t=>t.id===step.tool));
    s=place(select(s,step.tool),step.target);
  }
  assert.equal(s.complete,true);
  assert.equal(s.cleanStep,6);
  assert.deepEqual(progress(s),{value:6,total:6});
});

test('restart is fresh and invalid item IDs cannot be placed',()=>{
  for(const activity of activities) {
    const s=createGame(activity.id);
    assert.deepEqual(select(s,'not-an-ingredient'),s);
    assert.equal(s.complete,false);
    assert.equal(progress(s).value,0);
  }
  assert.throws(()=>createGame('unknown'));
});

test('the standalone page links only to existing local assets',()=>{
  const root=new URL('../public/games/little-chef-academy/',import.meta.url);
  const html=fs.readFileSync(new URL('index.html',root),'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    assert.ok(!match[1].startsWith('http'));
    assert.ok(fs.existsSync(new URL(match[1],root)),path.basename(match[1])+' exists');
  }
});
