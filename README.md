# ABC Letter World — Localhost Starter

## ABC Play — game portal

The homepage now opens as a Poki-inspired game-grid portal with 47 playable entries, original illustrations, search, category/age filters, visit-only saved/recent lists, mobile navigation and unified game pages. Existing standalone games and Discovery Club activities remain available. See [PORTAL_IMPLEMENTATION.md](PORTAL_IMPLEMENTATION.md) for scope and verification; this does not include Poki's proprietary games or assets.

Run `npm.cmd run dev` and open the local URL printed by Vite. The existing server at `http://127.0.0.1:5173/` should update automatically; refresh it if an old tab is still visible.

## Discovery Club — advanced learning activities

The homepage now includes a Discovery Club for ages 5–13:

- Logic Island 3D: pattern gate, bridge planning and switch sequencing.
- Robo Builder Lab: assemble virtual parts and program three obstacle courses.
- Math Space Mission: cargo-balancing missions with whole and half units.
- Science Discovery Lab: predict and test a simplified circuit.
- Eco City Builder: budget-based city planning and a creative sandbox.
- Knowledge Explorer / Learning Studio: introductory GK, civics, computers, AI and an optional Geeta reflection.
- Thinking Playground: eight categories with age choices, hints and gentle numeric difficulty adjustment.
- Learning & Thinking Check: twelve optional questions with skip, pause, partial results and clear assistance reporting. This is not an IQ test.
- Greenhouse rover: a combined maths, programming and model-testing mission.

Use the Discovery Club tabs on the homepage. Ages 10–13 also launches four worlds directly. Existing younger-child games and the original library remain available.

There is **no database, login, learner profile or Parent area**. New discoveries and check state are held in memory for this page visit; refreshing clears them. Existing standalone games retain their original storage behavior.

3D scenes use locally generated Three.js geometry and load only after a game opens. The same tasks work through HTML controls in 2D mode. Audio is off by default; enabling it plays brief locally synthesized completion tones. English is available; Hindi, narration, offline installation and a larger reviewed curriculum remain future work. See [REQUIREMENTS.md](REQUIREMENTS.md#13-implementation-record--first-playable-release) for delivery details and limitations.

### Verify changes

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:browser
```

The browser check needs Node.js 24 and an installed Chrome or Edge. Set `CHEF_BROWSER` to an alternative Chromium executable if needed. It serves `dist` locally, uses an isolated temporary browser profile and software WebGL, checks main completion flows, WebGL recovery, age-collection launches and narrow layouts, and prints the screenshot directory. It does not test physical mobile-device performance.

### Assets and dependencies

New scene geometry and lesson wording are authored in this project. No downloaded 3D models or textures are included. Three.js uses the MIT license; its license is distributed with the dependency at `node_modules/three/LICENSE`. Lesson source links are kept in `src/learning/content.mjs`; specialist curriculum review is pending.

## Requirements
Install Node.js LTS from https://nodejs.org/.

## Run locally
Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Visit http://localhost:5173/ on your computer.

## Add a game
1. Create `public/games/my-new-game/index.html` (and place its images/audio in that folder).
2. Add an entry in `src/games.js` with `ready:true` and `url:'/games/my-new-game/index.html'`.
3. Reload the website. Your game appears in the library automatically.

## Publish later
Run `npm run build`. Deploy the `dist` directory to a static hosting provider such as Netlify, Cloudflare Pages, or Vercel. Use the hosting provider's current deployment instructions. The site uses no server-side code.

## Notes
- The bundled Jungle Adventure game is your earlier three-level HTML prototype, embedded in the website.
- Its progress uses localStorage in the browser; it will not sync across devices.
- Number Train is marked Coming soon. Other ready library cards and the Discovery Club are playable.
- Emoji graphics and a Google Fonts web font are placeholders; the font falls back gracefully offline.
- Before a public launch, review privacy, accessibility, mobile performance, child safety and platform policies.

## Games by age — expandable sections

The homepage includes a separate age-group collection above the original game library. Only the age boxes appear initially; clicking an age box reveals Toddler Play (ten games), Tiny Tinkers (ten games), Little Discoverers (nine games), Brain Explorers (seven games), or Discovery Club (four direct launches). Existing games and category filters are preserved.

| Section | Current contents |
| --- | --- |
| Ages 1-2 | Toddler Play: Bubbles, Animals, Rain, Balloons, Paint, Peekaboo, Drums, Fireflies, Pinwheel, Lights |
| Ages 1-3 | Tiny Tinkers: Shapes, Match, Feed Me, Big & Small, Color Train, Count Mangoes, Which Cup?, Dress Teddy, Puzzle, Bath Time |
| Ages 3-5 | Little Discoverers: ABC Catch, Number Trail, Months Match, Weather Dress-Up, Rhyme Match, Memory Flip, Garden Grower, Shape Builder, Missing Piece |
| Ages 5-10 | Brain Explorers: Math Runner, Word Builder, Maze Escape, Color Lab, Animal Race, Pattern Puzzle, Time Teller |
| Ages 10-13 | Robo Builder Lab, Science Discovery Lab, Eco City Builder, Knowledge Explorer |

All ten toddler cards launch their own activity directly. The reference was `C:\ABC_LETTER_WORLD\New Games\Toddler Play.html`; the website keeps its own copy at `public/games/toddler-play/index.html`, so it works without that external folder. Links use `?game=bubbles` (or the other lowercase activity names). Opening the HTML without a valid game parameter shows the full Toddler Play menu.

Inside an activity, hold the home button for 0.9 seconds to open the toddler menu. The website's All games button returns to the homepage. Fullscreen opens the current activity. Audio begins after interaction; games use touch or mouse controls and have no scores or losing state.

### Add games to an existing age section

Edit `ageGroups` in `src/games.js`. A group with an empty `games: []` automatically shows Coming soon and stays disabled. Adding game entries makes the section selectable and displays its cards. `src/AgeGames.jsx` renders every group from this data; no new component is needed.

Use this sample game card in any group's `games` array, replacing example values with the real game:

```js
{
  id: 'my-new-game',
  name: 'My New Game',
  emoji: '🚀',
  background: '#dfe6b6',
  ink: '#3a2c1c',
  description: 'A short, friendly description.',
  ready: true,
  url: '/games/my-new-game/index.html'
}
```

Put the playable HTML and any images/audio under `public/games/my-new-game/` before adding the card. Only add playable games to these arrays; leave a future section's array empty until games are available.

### Add another section later

Append a group to `ageGroups` using this sample box. Choose a unique ID and an age label, category, or other section name:

```js
{
  id: 'my-next-section',
  label: 'My next section',
  title: 'More adventures',
  description: 'Discover something new to play.',
  emoji: '🎮',
  background: '#d6c9f2',
  ink: '#3a2c1c',
  games: [] // Shows Coming soon; add game objects here when ready.
}
```

The same card layout is reused for every section and adjusts for mobile screens. Toddler games use the shared HTML file and individual query parameters; other games can use independent HTML folders.

### Local commands in Windows PowerShell

Use `npm.cmd install`, `npm.cmd run dev`, and `npm.cmd run build` if PowerShell blocks `npm.ps1`. No execution-policy change is required. After building, the `dist` folder includes the toddler game copy and can be hosted independently of the reference file.

## Tiny Tinkers — Ages 1-3

Click the Ages 1-3 box to reveal Tiny Tinkers. Its ten colorful cards include skill badges, descriptions and play buttons. Selecting another available age box switches the collection; no games appear before an age box is clicked. Ages 10-13 now opens four Discovery Club activities.

Source: `C:\ABC_LETTER_WORLD\New Games\Tiny Tinkers.html`. The site bundles its own copy in `public/games/tiny-tinkers/index.html`. Each card opens its activity directly with a `?game=` parameter: `shapes`, `match`, `feed-me`, `big-and-small`, `color-train`, `count-mangoes`, `which-cup`, `dress-teddy`, `puzzle`, or `bath-time`. Missing or unknown parameters open the complete Tiny Tinkers menu.

The supplied prototype describes itself as Ages 2–3 internally; the current catalog lists it under Ages 1-3. Its activities and original instructions are preserved. Drag games use touch or mouse; matching, counting and memory games use taps. Audio and spoken prompts depend on browser support. Hold the home button for 0.9 seconds to return to the Tiny Tinkers menu.

Future additions use the existing sample game and section objects above. Add entries to `tinkersGames` in `src/games.js` for this collection. Optional `skill` text displays a badge on a card; optional section `note` supplies collection-specific help. Files stay inside `public/games/` so production builds do not depend on the external reference folder.

## Brain Explorers — Ages 5-10

Click Ages 5-10 to reveal Brain Explorers and its seven games. The collection starts hidden like the other age sections. A space-themed banner, skill badges and colorful challenge cards introduce maths, spelling, navigation, color mixing, animal facts, patterns and telling time. Ages 10-13 now opens four Discovery Club activities.

Source: `C:\ABC_LETTER_WORLD\New Games\brain-explorers.html`. The website bundles its own copy at `public/games/brain-explorers/index.html`, with a responsive collection menu styled by `menu.css` in the same folder. The original canvas game mechanics and instructions are preserved.

| Game | Direct launch parameter | Skill |
| --- | --- | --- |
| Math Runner | `?game=math-runner` | Mental maths |
| Word Builder | `?game=word-builder` | Spelling |
| Maze Escape | `?game=maze-escape` | Problem solving |
| Color Lab | `?game=color-lab` | Color science |
| Animal Race | `?game=animal-race` | Animal facts |
| Pattern Puzzle | `?game=pattern-puzzle` | Logic |
| Time Teller | `?game=time-teller` | Telling time |

Every card launches its activity directly. Missing or unknown game parameters show the full Brain Explorers menu. Hold the in-game home button for 0.9 seconds to return to that menu. Best scores use the `bxBest` localStorage key and stay in the current browser; they do not sync across devices. The site's All games and Fullscreen controls also work with this collection.

To extend this collection, edit `explorerGames` in `src/games.js` and add the corresponding playable activity. Use the sample game and section objects above for future collections. The optional `features` array adds introduction badges; `collectionClass` allows collection-specific styling. Builds include the bundled HTML and CSS and do not need the external source folder.
