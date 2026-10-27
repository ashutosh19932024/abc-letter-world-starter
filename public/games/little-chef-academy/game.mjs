export const activities = [
  { id:'salad', name:'Fruit Salad', icon:'🥗', color:'#f7d4b7', skill:'Wash · choose · mix', description:'A rainbow recipe for your pretend café.' },
  { id:'colors', name:'Color Kitchen', icon:'🌈', color:'#ead9f7', skill:'Look · match · learn', description:'Give every ingredient a colorful home.' },
  { id:'sort', name:'Market Baskets', icon:'🧺', color:'#dce9b5', skill:'Notice · sort · discover', description:'Fruits here, vegetables over there!' },
  { id:'cleanup', name:'Kitchen Sparkle', icon:'🧽', color:'#cce7ef', skill:'Tidy · wash · care', description:'A happy kitchen is a clean kitchen.' }
];

export const foods = [
  { id:'apple', name:'Apple', icon:'🍎', group:'fruit', color:'red' },
  { id:'banana', name:'Banana', icon:'🍌', group:'fruit', color:'yellow' },
  { id:'grapes', name:'Grapes', icon:'🍇', group:'fruit', color:'purple' },
  { id:'strawberry', name:'Strawberry', icon:'🍓', group:'fruit', color:'red' },
  { id:'orange', name:'Orange', icon:'🍊', group:'fruit', color:'orange' },
  { id:'pear', name:'Pear', icon:'🍐', group:'fruit', color:'green' },
  { id:'carrot', name:'Carrot', icon:'🥕', group:'vegetable', color:'orange' },
  { id:'broccoli', name:'Broccoli', icon:'🥦', group:'vegetable', color:'green' },
  { id:'eggplant', name:'Eggplant', icon:'🍆', group:'vegetable', color:'purple' },
  { id:'corn', name:'Sweetcorn', icon:'🌽', group:'vegetable', color:'yellow' }
];
export const colors = [
  { id:'red', name:'Red', hex:'#d94749' }, { id:'yellow', name:'Yellow', hex:'#f4c742' },
  { id:'purple', name:'Purple', hex:'#9370bd' }, { id:'orange', name:'Orange', hex:'#e58b35' },
  { id:'green', name:'Green', hex:'#619b67' }
];
export const handSteps = [
  { id:'soap', label:'Soap up', icon:'🧼', instruction:'First, put soap on your wet hands.' },
  { id:'rub', label:'Rub hands', icon:'🙌', instruction:'Rub your palms, fingers and the backs of your hands. In a real kitchen, take your time!' },
  { id:'rinse', label:'Rinse', icon:'🚿', instruction:'Now rinse the bubbles off with clean water.' },
  { id:'dry', label:'Dry hands', icon:'🧻', instruction:'Dry your hands with a clean towel.' }
];
export const tools = [
  { id:'scraps', name:'Food scraps', icon:'🍌' }, { id:'dishes', name:'Dirty dishes', icon:'🍽️' },
  { id:'soap', name:'Dish soap', icon:'🧼' }, { id:'water', name:'Clean water', icon:'🚿' },
  { id:'cloth', name:'Damp cloth', icon:'🧽' }, { id:'towel', name:'Clean towel', icon:'🧻' }
];
export const cleanSteps = [
  { tool:'scraps', target:'bin', text:'Put the food scraps in the compost bin.' },
  { tool:'dishes', target:'sink', text:'Take the dirty dishes to the sink.' },
  { tool:'soap', target:'sink', text:'Wash the dishes with soap.' },
  { tool:'water', target:'sink', text:'Rinse the soapy dishes with clean water.' },
  { tool:'cloth', target:'counter', text:'Wipe the messy counter with a damp cloth.' },
  { tool:'towel', target:'counter', text:'Dry the counter with a clean towel.' }
];
const recipes = [['apple','banana','grapes','strawberry'], ['pear','orange','banana','apple'], ['grapes','pear','orange','strawberry']];

export function createGame(activity, round=0) {
  if (!activities.some(a=>a.id===activity)) throw new Error('Unknown kitchen activity');
  return { activity, phase:activity==='salad'?'hands':'play', hands:0, selected:null, rinsed:[], done:[], cleanStep:0,
    recipe:recipes[round%recipes.length], complete:false, message:'', correct:null };
}
export function ingredients(state) {
  if (state.activity==='salad') return [...state.recipe.map(id=>foods.find(f=>f.id===id)), foods[6], foods[7]];
  return state.activity==='sort'?foods.filter(f=>['apple','banana','grapes','strawberry','carrot','broccoli','eggplant','corn'].includes(f.id)):foods;
}
export function progress(state) {
  if (state.activity==='salad') return { value:state.hands+state.done.length, total:8 };
  if (state.activity==='cleanup') return { value:state.cleanStep, total:cleanSteps.length };
  return { value:state.done.length, total:ingredients(state).length };
}
function retry(state,message) { return { ...state, message, correct:false }; }

export function reduceGame(state, action) {
  if (state.complete) return state;
  if (action.type==='hands') {
    if (state.phase!=='hands') return state;
    if (action.id!==handSteps[state.hands].id) return retry(state,'Follow the glowing step. We will do them one at a time.');
    const hands=state.hands+1;
    return { ...state, hands, phase:hands===4?'play':'hands', correct:true, message:hands===4?'Clean hands! Now let’s wash our fruit.':'Lovely! What comes next?' };
  }
  if (state.phase!=='play') return state;
  if (action.type==='select') {
    const list=state.activity==='cleanup'?tools:ingredients(state);
    if (!list.some(item=>item.id===action.id)||state.done.includes(action.id)) return state;
    return { ...state, selected:action.id, correct:null, message:'Now choose where it goes. You can tap or drag.' };
  }
  if (action.type!=='place') return state;
  if (!state.selected) return retry(state,'Choose an ingredient or a tool first.');
  if (state.activity==='cleanup') {
    const step=cleanSteps[state.cleanStep];
    if (state.selected!==step.tool||action.target!==step.target) return retry(state,'Let’s try the task on the recipe board. You’ve got this!');
    const cleanStep=state.cleanStep+1,complete=cleanStep===cleanSteps.length;
    return { ...state, cleanStep, done:[...state.done,state.selected], selected:null, complete, correct:true, message:complete?'Sparkle, sparkle! Everything is tidy.':'That’s a helpful kitchen habit!' };
  }
  const food=ingredients(state).find(f=>f.id===state.selected);
  if (!food) return state;
  if (state.activity==='salad') {
    if (!state.recipe.includes(food.id)) return retry(state,'That’s a vegetable. Find a fruit on our recipe card.');
    if (action.target==='sink') return { ...state, rinsed:[...new Set([...state.rinsed,food.id])], correct:true, message:'Fresh and rinsed! Put it in the salad bowl.' };
    if (action.target!=='bowl') return state;
    if (!state.rinsed.includes(food.id)) return retry(state,'A little rinse first! Take your fruit to the sink.');
  } else {
    const expected=state.activity==='colors'?food.color:food.group;
    if (action.target!==expected) return retry(state,state.activity==='colors'?`Look at the ${food.color} color. Try its matching bowl.`:`${food.name} belongs in the ${food.group==='fruit'?'fruit':'vegetable'} basket. Try again!`);
  }
  const done=[...state.done,food.id],total=state.activity==='salad'?state.recipe.length:ingredients(state).length,complete=done.length===total;
  return { ...state, done, selected:null, complete, correct:true, message:complete?'You did it, little chef! A delicious discovery.':'A perfect match! What shall we choose next?' };
}
