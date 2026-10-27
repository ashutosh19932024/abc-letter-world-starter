import {worlds} from './learning/content.mjs';
// Add future games here. Put each playable game in public/games/<slug>/index.html.
export const games = [
  { id:'jungle-adventure', name:'Jungle Adventure World', category:'Adventure', age:'3–8', description:'Help Leo collect stars, cross the river and discover the mystery cave!', emoji:'🦁', color:'jungle', url:'/games/jungle-adventure/index.html', ready:true },
  { id:'alphabet-quest', name:'Alphabet Quest', category:'Learning', age:'3–6', description:'Match colorful letters and complete the alphabet, one level at a time.', emoji:'🔤', color:'alphabet', url:'/games/alphabet-quest/index.html', ready:true },
  { id:'kite-flying', name:'KITE FLY', category:'Adventure', description:'Tap, click or press Space to keep your kite flying through the sky!', emoji:'🪁', color:'kite', url:'/games/kite-flying/index.html', ready:true },
  { id:'rocket-abc-adventure', name:'Rocket ABC Adventure', category:'Learning', description:'Blast off to explore letters, letter friends, animals and colours across four learning worlds!', emoji:'🚀', color:'rocket', url:'/games/rocket-abc-adventure/index.html', ready:true },
  { id:'little-chef-academy', name:'Little Chef Academy', category:'Learning', age:'3–8', description:'Make a fruit salad, match colorful ingredients, sort foods and leave your pretend kitchen sparkling!', emoji:'👩‍🍳', color:'chef', badge:'4 ACTIVITIES', url:'/games/little-chef-academy/index.html', ready:true },
  { id:'number-train', name:'Number Train', category:'Learning', age:'3–7', description:'A future counting adventure.', emoji:'🚂', color:'numbers', ready:false }
];

// Each age group owns its game cards. Empty groups display "Coming soon".
const toddlerGames = [
  { id:'bubbles', name:'Bubbles', emoji:'🫧', background:'#bfe9ff', description:'Tap a bubble. Pop a little joy.' },
  { id:'animals', name:'Animals', emoji:'🐮', background:'#d8f3c4', description:'Meet friendly animals and their sounds.' },
  { id:'rain', name:'Rain', emoji:'🌧️', background:'#9ad0f5', description:'Make raindrops dance and splash.' },
  { id:'balloons', name:'Balloons', emoji:'🎈', background:'#ffe0e9', description:'Catch a floating splash of color.' },
  { id:'paint', name:'Paint', emoji:'🎨', background:'#f5d468', description:'Little fingers, big colorful splashes.' },
  { id:'peekaboo', name:'Peekaboo', emoji:'🙈', background:'#d6c9f2', description:'Who is hiding? Tap to say hello!' },
  { id:'drums', name:'Drums', emoji:'🥁', background:'#544452', ink:'#fff4e8', description:'Tap out your very own happy beat.' },
  { id:'fireflies', name:'Fireflies', emoji:'✨', background:'#343e59', ink:'#fff7ce', description:'Follow tiny lights through the night.' },
  { id:'pinwheel', name:'Pinwheel', emoji:'🎡', background:'#dfe6b6', description:'Swipe and watch the colors spin.' },
  { id:'lights', name:'Lights', emoji:'🌟', background:'#6b3cb0', ink:'#ffffff', description:'Fill the sky with sparkling surprises.' }
].map(game => ({ ...game, ready:true, url:`/games/toddler-play/index.html?game=${game.id}` }));

const tinkersGames = [
  { id:'shapes', name:'Shapes', emoji:'🔷', background:'#ffe7ac', skill:'Shapes', description:'Find a cozy home for every shape.' },
  { id:'match', name:'Match', emoji:'🐶', background:'#ffdce8', skill:'Matching', description:'Spot a friend and find its twin.' },
  { id:'feed-me', name:'Feed Me', emoji:'🥕', background:'#d7edb8', skill:'Discovery', description:'Pick a tasty treat for a hungry friend.' },
  { id:'big-and-small', name:'Big & Small', emoji:'🐘', background:'#c9e4fc', skill:'Comparing', description:'A big discovery. A tiny surprise.' },
  { id:'color-train', name:'Color Train', emoji:'🚂', background:'#ffd7af', skill:'Colors', description:'All aboard! Match each colorful wagon.' },
  { id:'count-mangoes', name:'Count Mangoes', emoji:'🥭', background:'#f6df86', skill:'Counting', description:'One, two, yum! Count a fruity feast.' },
  { id:'which-cup', name:'Which Cup?', emoji:'🥤', background:'#c8e9dc', skill:'Memory', description:'Watch closely. Where did the ball go?' },
  { id:'dress-teddy', name:'Dress Teddy', emoji:'🧸', background:'#f7d4bc', skill:'Matching', description:'Help teddy get ready for an adventure.' },
  { id:'puzzle', name:'Puzzle', emoji:'🧩', background:'#dcd3f7', skill:'Puzzles', description:'Piece by piece, a picture appears.' },
  { id:'bath-time', name:'Bath Time', emoji:'🛁', background:'#beeaf3', skill:'Sensory play', description:'Rub-a-dub-dub! Make duck sparkle.' }
].map(game => ({ ...game, ready:true, url:`/games/tiny-tinkers/index.html?game=${game.id}` }));

const explorerGames = [
  { id:'math-runner', name:'Math Runner', emoji:'🏃', background:'#c9e9ff', skill:'Mental maths', description:'Pick your lane. Race through the right answer!' },
  { id:'word-builder', name:'Word Builder', emoji:'🔤', background:'#f7df8c', skill:'Spelling', description:'A picture, a few letters, a word to discover.' },
  { id:'maze-escape', name:'Maze Escape', emoji:'🐭', background:'#ddcef6', skill:'Problem solving', description:'Find a clever path to a cheesy reward.' },
  { id:'color-lab', name:'Color Lab', emoji:'🧪', background:'#facfdf', skill:'Color science', description:'Mix, experiment and make a colorful discovery.' },
  { id:'animal-race', name:'Animal Race', emoji:'🏁', background:'#cfe8b9', skill:'Animal facts', description:'Know your animals? Outrun a very clever fox.' },
  { id:'pattern-puzzle', name:'Pattern Puzzle', emoji:'🔶', background:'#ffdbb1', skill:'Logic', description:'Spot the pattern. Discover what comes next.' },
  { id:'time-teller', name:'Time Teller', emoji:'🕒', background:'#bfe7e9', skill:'Telling time', description:'Read the hands and master the clock.' }
].map(game => ({ ...game, ready:true, url:`/games/brain-explorers/index.html?game=${game.id}` }));

const discovererGames = [
  { id:'abc-catch', name:'ABC Catch', emoji:'🔤', background:'#f7df8c', skill:'Letters', description:'Listen for a letter and catch it as it bobs by.' },
  { id:'number-trail', name:'Number Trail', emoji:'🔢', background:'#c9e9ff', skill:'Counting', description:'Connect the dots from one to ten. What a trail!' },
  { id:'months-match', name:'Months Match', emoji:'📅', background:'#ddcef6', skill:'Sequencing', description:'Put twelve colorful months in order for a happy year.' },
  { id:'weather-dress-up', name:'Weather Dress-Up', emoji:'🌦️', background:'#facfdf', skill:'Everyday skills', description:'Sunshine or snow? Choose an outfit for the weather.' },
  { id:'rhyme-match', name:'Rhyme Match', emoji:'🐱', background:'#ffdbb1', skill:'Rhyming', description:'Cat and hat! Bring words with matching sounds together.' },
  { id:'memory-flip', name:'Memory Flip', emoji:'🃏', background:'#bfe7e9', skill:'Memory', description:'Flip a card, find its friend and discover every pair.' },
  { id:'garden-grower', name:'Garden Grower', emoji:'🌱', background:'#cfe8b9', skill:'Discovery', description:'Give thirsty seeds a splash and grow a fruity garden.' },
  { id:'shape-builder', name:'Shape Builder', emoji:'🔷', background:'#ffd7af', skill:'Shapes', description:'Piece shapes together to build something wonderful.' },
  { id:'missing-piece', name:'Missing Piece', emoji:'🧩', background:'#dcd3f7', skill:'Observation', description:'Look carefully. Can you spot what disappeared?' }
].map(game => ({ ...game, ready:true, url:`/games/little-discoverers/index.html?game=${game.id}` }));

const advancedGames = worlds.filter(w=>['robot','science','eco','knowledge'].includes(w.id)).map(w=>({id:`discovery-${w.id}`,name:w.title,emoji:w.icon,background:w.color,skill:w.skills.join(' · '),description:w.description,ready:true,module:w.id}));
export const ageGroups = [
  { id:'ages-1-2', label:'Ages 1-2', title:'Toddler Play', description:'Tiny hands, curious minds. Pick something wonderful to explore.', emoji:'🧸', background:'#6b3cb0', ink:'#ffffff', games:toddlerGames },
  { id:'ages-1-3', label:'Ages 1-3', title:'Tiny Tinkers', description:'A little thinking, a lot of fun. Match, count and discover something new!', emoji:'🧩', background:'#dfe6b6', ink:'#4b5e29', games:tinkersGames, note:'Drag, match, count and explore at your own pace. A wrong try simply wiggles back. Parents can hold the home button to return to the Tiny Tinkers menu.' },
  { id:'ages-3-5', label:'Ages 3-5', title:'Little Discoverers', description:'Growing minds, playful discoveries. Catch letters, build shapes and explore the world!', emoji:'🌱', background:'#bfe7e9', ink:'#28595b', games:discovererGames, note:'Tap, drag and discover at your own pace. There are no penalties for trying again. Hold the home button inside a game to return to the Little Discoverers menu.' },
  { id:'ages-5-10', label:'Ages 5-10', title:'Brain Explorers', description:'Ready for a bright idea? Race through maths, crack a puzzle and make your next discovery.', emoji:'🚀', background:'#e6ad52', ink:'#4c300b', collectionClass:'explorer-collection', features:['Think it through', 'Learn by playing', 'Beat your best'], games:explorerGames, note:'Choose a challenge and build your skills at your own pace. Best scores are saved in this browser. Hold the home button inside a game to return to the Brain Explorers menu.' },
  { id:'ages-10-13', label:'Ages 10-13', title:'Discovery Club', emoji:'🧩', background:'#343e59', ink:'#ffffff', games:advancedGames, description:'Build robots, experiment with circuits and design a city. New ideas start here.' }
];
