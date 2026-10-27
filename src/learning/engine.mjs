export const commands = { E:[1,0], S:[0,1], W:[-1,0], N:[0,-1] };
export const robotLevels = [
  { start:[0,0], goal:[3,2], walls:[[1,1],[2,1]], limit:8 },
  { start:[0,3], goal:[3,0], walls:[[1,3],[1,2],[2,1]], limit:10 },
  { start:[0,0], goal:[3,3], walls:[[1,0],[1,1],[2,2]], limit:12 }
];
export function runProgram(level, program) {
  let position=[...level.start]; const path=[position];
  for (const command of program) {
    if (!commands[command]) return { path, success:false, reason:'Unknown command.' };
    const [dx,dy]=commands[command], next=[position[0]+dx,position[1]+dy];
    if (next.some(n=>n<0||n>3)||level.walls.some(([x,y])=>x===next[0]&&y===next[1]))
      return { path, success:false, reason:`Command ${path.length} meets a wall. Undo a step and try a different route.` };
    position=next; path.push(position);
  }
  return { path, success:position.every((v,i)=>v===level.goal[i]), reason:'The robot needs to finish on the star. Add or change a command.' };
}
export function bridgeValid(cells) {
  if (!cells.includes(0)||!cells.includes(8)||cells.length>5) return false;
  const seen=new Set([0]), queue=[0];
  while(queue.length) { const cell=queue.shift(); for(const next of cells) {
    if(!seen.has(next)&&Math.abs(next%3-cell%3)+Math.abs(Math.floor(next/3)-Math.floor(cell/3))===1) { seen.add(next); queue.push(next); }
  } }
  return seen.has(8);
}
export const puzzleKinds=['Pattern Detective','Memory Journey','Build the Bridge','Rule Machine','Balance Puzzle','Cause and Effect','Clue Quest','Number Trail'];
// Seeded variations keep puzzles reproducible and their answers provably valid.
function basePuzzle(kind, seed=0, age='8–10',difficulty=0) {
  const n=2+(seed%5)+difficulty, step=(age==='5–7'?1:2+(seed%3))+difficulty;
  const base={ id:`${kind}-${seed}-${age}-${difficulty}`, skill:kind, explanation:'', hint:'' };
  if(kind==='Pattern Detective') return {...base,prompt:`${n}, ${n+step}, ${n+step*2}, ?`,options:[n+step*3,n+step*3+1,n+step*2,n],answer:0,hint:`Add ${step} each time.`,explanation:`The same step, +${step}, gives ${n+step*3}.`};
  if(kind==='Memory Journey') { const symbols=['🌙','🌿','⭐','🌼']; const sequence=Array.from({length:age==='5–7'?3:4},(_,i)=>symbols[(i+seed)%4]); return {...base,prompt:'Remember the trail. What was the second picture?',memory:sequence,options:symbols,answer:(seed+1)%4,hint:'You may reveal the trail again. This counts as assistance.',explanation:`The second picture was ${sequence[1]}.`}; }
  if(kind==='Build the Bridge') return {...base,prompt:`A path goes ${n} squares east, then ${n+1} south. Which square is its destination from (0, 0)?`,options:[`(${n}, ${n+1})`,`(${n+1}, ${n})`,`(${n}, 0)`,`(0, ${n+1})`],answer:0,hint:'East changes the first number. South changes the second.',explanation:`${n} east adds ${n} to x; ${n+1} south adds ${n+1} to y.`};
  if(kind==='Rule Machine') return {...base,prompt:`The machine accepts ${n*2}, ${n*2+2}, ${n*2+4}. It accepts even numbers. Which belongs?`,options:[n*2+5,n*2+7,n*2+6,n*2+9],answer:2,hint:'Even numbers can be shared equally into two groups.',explanation:`${n*2+6} is divisible by two with nothing left over.`};
  if(kind==='Balance Puzzle') return {...base,prompt:`One blue block weighs ${n}. A red block weighs twice as much. What balances one red block?`,options:[`${n}`,`${n*2}`,`${n+1}`,`${n*3}`],answer:1,hint:`Twice as much means ${n} + ${n}.`,explanation:`Two blue blocks weigh ${n*2}, the same as one red block.`};
  if(kind==='Cause and Effect') return {...base,prompt:'Three touching gears are in a line. The first turns clockwise. How does the third turn?',options:['Clockwise','Counterclockwise','It cannot move','Both directions at once'],answer:0,hint:'Each touching gear turns opposite to its neighbor.',explanation:'The second reverses direction, and the third reverses it again.'};
  if(kind==='Clue Quest') return {...base,prompt:'A treasure is not in a red box. It is in a round box. Where is it?',options:['Red circle','Blue square','Blue circle','Red square'],answer:2,hint:'Use both clues. Cross out every red box and every square.',explanation:'Only the blue circle satisfies both clues.'};
  return {...base,prompt:`A robot takes ${n} steps, then ${step} more. How many altogether?`,options:[n+step+1,n,n+step,n+step-1],answer:2,hint:'Combine both groups of steps.',explanation:`${n} + ${step} = ${n+step}.`};
}
export function makePuzzle(kind,seed=0,age='8–10',difficulty=0) {
  const item=basePuzzle(kind,seed,age,difficulty),offset=seed%item.options.length;
  return {...item,options:[...item.options.slice(offset),...item.options.slice(0,offset)],answer:(item.answer-offset+item.options.length)%item.options.length};
}
export function makeAssessment(seed=0, age='8–10') {
  const skills=['Pattern Detective','Memory Journey','Build the Bridge','Balance Puzzle'];
  return Array.from({length:12},(_,i)=>makePuzzle(skills[i%4],seed+i,age));
}
export function summarize(items, records) {
  return [...new Set(items.map(i=>i.skill))].map(skill=>{
    const entries=records.filter(r=>r.skill===skill), independent=entries.filter(r=>!r.assisted&&!r.skipped);
    return {skill,completed:entries.filter(r=>!r.skipped).length,correct:entries.filter(r=>r.correct).length,
      independent:independent.length,independentCorrect:independent.filter(r=>r.correct).length,hints:entries.filter(r=>r.assisted).length,
      observation:independent.length<3?'Not enough evidence yet':`${independent.filter(r=>r.correct).length} of ${independent.length} independent attempts correct`};
  });
}
export function classify(examples, item) {
  if(!examples.length) return null;
  return examples.reduce((best,e)=>{
    const distance=(e.size-item.size)**2+(e.round-item.round)**2;
    return !best||distance<best.distance?{...e,distance}:best;
  },null).label;
}
export function circuitCurrent(volts,resistance,closed) { return closed?volts/resistance:0; }
export function ecoTotals(cells) {
  const costs={tree:1,solar:3,water:2,home:2,recycle:2};
  return {cost:cells.reduce((n,c)=>n+(costs[c]||0),0),energy:cells.filter(c=>c==='solar').length*2,
    homes:cells.filter(c=>c==='home').length,water:cells.filter(c=>c==='water').length,trees:cells.filter(c=>c==='tree').length,recycle:cells.filter(c=>c==='recycle').length};
}
