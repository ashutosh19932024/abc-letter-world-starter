import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {games,ageGroups} from '../src/games.js';
import {bridgeValid,robotLevels,runProgram,makePuzzle,puzzleKinds,makeAssessment,summarize,classify,circuitCurrent,ecoTotals} from '../src/learning/engine.mjs';
test('bridge requires a continuous edge-connected route within the piece budget',()=>{
 assert.equal(bridgeValid([0,1,2,5,8]),true);assert.equal(bridgeValid([0,4,8]),false);assert.equal(bridgeValid([0,1,2,3,5,8]),false);assert.equal(bridgeValid([1,2,5,8]),false);
});
test('all robot courses have a route within command budget',()=>{
 for(const level of robotLevels){const queue=[[]];let solution;while(queue.length){const program=queue.shift(),result=runProgram(level,program);if(result.success){solution=program;break;}if(program.length<level.limit&&result.path.length===program.length+1)for(const c of ['E','S','W','N'])queue.push([...program,c]);}assert.ok(solution);assert.equal(runProgram(level,solution).success,true);}
 assert.match(runProgram(robotLevels[0],['W']).reason,/wall/);assert.equal(runProgram(robotLevels[0],['E','E','E','S','S','N']).success,false);
});
test('generated puzzle answers are valid and numeric patterns obey their rule',()=>{
 for(const age of ['5–7','8–10','10–13'])for(let seed=0;seed<40;seed++)for(const kind of puzzleKinds){const p=makePuzzle(kind,seed,age);assert.ok(p.answer>=0&&p.answer<p.options.length);assert.ok(p.hint&&p.explanation);if(kind==='Pattern Detective'){const nums=p.prompt.match(/\d+/g).map(Number);assert.equal(p.options[p.answer],nums[2]+nums[1]-nums[0]);}}
});
test('check balances skill coverage and does not count hints or skips as independent evidence',()=>{
 const items=makeAssessment();assert.equal(items.length,12);for(const s of new Set(items.map(i=>i.skill)))assert.equal(items.filter(i=>i.skill===s).length,3);
 const skill=items[0].skill,rows=summarize(items,[{skill,correct:true,assisted:true},{skill,correct:false,skipped:true},{skill,correct:true,assisted:false}]);const row=rows.find(r=>r.skill===skill);assert.equal(row.completed,2);assert.equal(row.independent,1);assert.equal(row.observation,'Not enough evidence yet');
 assert.ok(summarize(items,[]).every(r=>r.completed===0));
});
test('toy classifier uses nearest training example; open circuits have no current',()=>{
 assert.equal(classify([],{size:0,round:1}),null);assert.equal(classify([{size:0,round:1,label:'fruit'},{size:1,round:0,label:'block'}],{size:.1,round:1}),'fruit');assert.equal(circuitCurrent(3,3,false),0);assert.equal(circuitCurrent(3,6,true),.5);
});
test('city targets can be met without exceeding the budget',()=>{
 const totals=ecoTotals(['home','home','solar','water','tree','tree','recycle',null,null]);assert.equal(totals.cost,13);assert.equal(totals.homes,2);assert.equal(totals.energy,2);assert.equal(totals.trees,2);assert.equal(totals.water,1);assert.equal(totals.recycle,1);
});
test('catalog preserves playable static targets and enables older-child modules',()=>{
 for(const game of [...games,...ageGroups.flatMap(g=>g.games)])if(game.ready&&!game.module)assert.ok(existsSync(new URL('../public'+game.url.split('?')[0],import.meta.url)),game.id);
 assert.equal(ageGroups.find(g=>g.id==='ages-10-13').games.length,4);
});
