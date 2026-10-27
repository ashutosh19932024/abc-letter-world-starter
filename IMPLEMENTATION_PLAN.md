# Poki-style gaming platform — research and implementation plan

Date: 23 October 2026  
Status: Portal redesign implemented; remaining limits recorded in PORTAL_IMPLEMENTATION.md  
Target: `ABC_LETTER_WORLD/abc-letter-world-starter`

Implementation update (23 October 2026): the later user-authorized search feature is now implemented. See `SEARCH_EVIDENCE.md` for scope, reference limitations and verification. The original plan and its research baseline below remain historical; the full platform redesign has not been implemented.

Later implementation update (23 October 2026): the game-grid portal, player experience, category/age filters, visit-only saved/recent lists and original artwork are now implemented. See `PORTAL_IMPLEMENTATION.md` for the current delivery record. Statements below about future work describe the original plan, not the current implementation status.

## 1. Intended outcome

Evolve ABC Letter World into a fast, visually engaging browser-game platform inspired by Poki's discovery-to-play experience. Players should find a game through artwork, search, categories or age collections, start playing quickly, and return to browsing easily.

Planning assumption: extend the active ABC Letter World project as a child-friendly learning and casual-game platform. A separate general-audience portal would be a different product decision. Preserve the current audience, existing games, Discovery Club, and the requirements excluding accounts, a Parent area and a database. Use original branding and owned or licensed game content.

This document defines future work. It does not authorize or record implementation, deployment, installation of REA, or changes to the existing requirements.

## 2. Research sources and confidence

Public pages were researched on the date above. Page text establishes content and navigation patterns; it does not establish exact visual geometry, runtime behavior, source code, infrastructure or private algorithms.

| Source | Finding supported by the page | Application to this project |
| --- | --- | --- |
| [Poki homepage](https://poki.com/) | Search, category links, a popular collection and a broad game catalog are visible in the public page | Prioritize discovery and a short path to play |
| [Poki puzzle category](https://poki.com/en/puzzle) | Dedicated genre listing with related categories and explanatory content | Provide reusable category pages and useful game metadata |
| [Stickman Hook game page](https://poki.com/en/g/stickman-hook) | Game-specific public content includes instructions and supporting media | Give each game a stable page with concise controls and context |
| [Poki for Developers](https://developers.poki.com/) | Developer support includes playtesting, analytics, QA and monetization | Treat content onboarding and quality review as platform work, beyond the homepage |
| [REA repository and README](https://github.com/morluto/rea) | REA connects agents to analysis tools; setup registers an MCP server and workflow instructions | Use evidence-driven investigation for uncertain behavior when tools become available |

Research limitations:

- No interactive Poki browser session or screenshot comparison was performed. Search matching, keyboard flows, responsive layout, loading states, game launch, fullscreen, consent behavior and navigation restoration need direct verification before claiming parity.
- No proprietary source, private API, ranking logic, advertising implementation or hosting architecture was inspected. The architecture below is a recommendation for ABC Letter World.
- REA tools are not connected in this session. Its skill was not found in the available skill catalog; attempts to retrieve the remote skill directory were unsuccessful. The README was accessible, but no REA skill or analysis command was executed. This does not prevent public-site research and planning.
- Live popularity, catalog size and commercial claims are unnecessary to this plan and should not become hardcoded product promises.

## 3. How to use the requested REA workflow

REA is an investigation toolkit, not a ready-made gaming platform or a source of licensed games. Its documented setup command is `npx rea-agents setup`; setup changes agent configuration and may require restarting the agent. Do not run it as part of this document-only task.

For a later implementation investigation:

1. Open the official repository, locate and read its current applicable skill instructions, verify runtime requirements, and review setup changes before installing.
2. Define a narrow observable question, such as how category selection affects a URL or how returning from play restores browsing position.
3. Observe the public interaction at desktop and mobile sizes. Record URL, viewport, action, result and evidence; use REA only where it adds relevant evidence.
4. Separate observed facts from hypotheses. Do not infer a backend from a visual interaction.
5. Reproduce the user-facing behavior in this project's architecture with original code and approved assets.
6. Compare the result with the recorded interaction and test failure paths.

Planning does not require native binary tools, access-control bypasses or third-party game extraction. Ordinary browser observation is sufficient for many platform interactions.

## 4. Existing application baseline

Reviewed: `Rule.md`, `REQUIREMENTS.md` including its implementation record, `package.json`, `src/main.jsx`, `src/games.js`, and learning/test file inventories. The requirements' early baseline is historical; its final implementation record describes newer delivered activities.

| Area | Current evidence | Planned treatment |
| --- | --- | --- |
| Stack | React 19, Vite 6, Lucide React, Three.js | Retain the stack and lazy-load heavy game code |
| Main shell | `src/main.jsx` uses active-game and category state; hero, collections and library share the homepage | Extract focused discovery and player components |
| Main catalog | Six entries; Number Train is marked unavailable | Preserve IDs, launch targets and readiness; unavailable cards cannot launch |
| Age collections | Five groups with overlapping age bands; entries live in `src/games.js` | Preserve labels and use a normalized adapter for search |
| Launch types | Static games use iframes; module entries launch `LearningHub` | Support both launch types without rewriting games |
| Discovery Club | Learning worlds and activities under `src/learning/` | Preserve access and visit-only progress |
| Storage | Existing standalone games may save locally; new learning activities use visit-only memory | Do not introduce persistent profiles, favorites or history |
| Checks | `test`, `build`, `test:browser`; existing learning and Little Chef tests | Extend meaningful checks for shared discovery and launch behavior |

Follow `Rule.md`: preserve existing behavior, keep scope focused, and check affected functionality. Browser behavior of every current game has not been audited for this plan.

## 5. Product scope

### First release

- A game-first homepage with a compact header, prominent search, category chips and a responsive artwork grid.
- Search across playable main games, age collections and suitable Discovery Club entries.
- Age and category filters with a visible clear action, result count and useful empty state.
- Curated Featured and Discover collections. Use editorial ordering; do not label it real-time popularity.
- Stable game/category URLs, shareable filter state, and useful browser Back/Forward behavior.
- A unified game page with title, age guidance, instructions, player, fullscreen where supported, replay/restart appropriate to the game, and related games.
- Visit-only recently played and favorites. Explain their temporary nature where needed.
- Working keyboard/touch navigation, reduced-motion support, loading/error states and mobile layouts.
- Existing learning activities and standalone game launch targets remain accessible.

### Later phases

Add more owned or licensed casual games, richer thumbnail artwork, localization, static prerendering, and optional editorial tooling after the initial platform works. Infrastructure for submissions, accounts, synchronized saves, multiplayer, payments, advertising or analytics collection needs separate scope decisions. Do not add these to the first release.

## 6. Experience and visual direction

The proposed visual design is inspired by the reference; its exact rendering has not yet been verified.

| Surface | Proposed behavior |
| --- | --- |
| Header | ABC Letter World identity, home action and search; clear focus and touch targets |
| Homepage | Artwork and playable choices near the top; a compact introduction instead of a large promotional hero |
| Game grid | Rounded cards, readable titles, stable image ratios and a few curated larger tiles on wide screens |
| Categories | Learning, Adventure, Puzzle, Creativity, Science, Robotics and other categories only where reviewed games support them |
| Age collections | Existing labels preserved; avoid silently excluding games with missing age metadata |
| Card interaction | Subtle hover/focus feedback; essential information always available without hover |
| Player page | Large player region, back action, title, controls, fallback/error messaging and related choices |
| Phone layout | Two columns where readable, one on very narrow screens; wrapped filters, no horizontal page overflow |
| Status | Explicit unavailable, loading, empty, error and unsupported-feature states |

Use a consistent original color palette, typography and illustration system. Avoid copying Poki branding, thumbnails, descriptions or game files. Maintain artwork aspect ratios to prevent layout jumps; cards need visible names even when artwork fails.

## 7. Technical design

### Catalog and routing

Create one normalized discovery catalog from the existing main games, age groups and learning metadata. Keep existing exports initially so their consumers continue working. Namespace IDs because short IDs such as `puzzle` may collide across collections.

Suggested record:

```js
{
  id: 'tiny-tinkers-shapes',
  slug: 'tiny-tinkers-shapes',
  title: 'Shapes',
  description: 'Match each shape to its home.',
  categories: ['learning', 'puzzle'],
  tags: ['matching', 'shapes'],
  ageGroupIds: ['ages-1-3'],
  thumbnail: '/images/games/tiny-tinkers-shapes.webp',
  thumbnailAlt: 'Colorful shapes and matching slots',
  launch: { type: 'iframe', url: '/games/tiny-tinkers/index.html?game=shapes' },
  status: 'ready',
  controls: ['touch', 'mouse'],
  instructions: 'Choose a shape, then its matching slot.',
  featuredOrder: null,
  rights: { source: 'project asset', license: 'verify before release' }
}
```

The example is a proposed schema, not verified metadata or a claim that the image already exists. Verify controls and instructions per game. Module entries use `{ type: 'module', moduleId: 'robot' }`; readiness and rights validation precede publication.

Proposed routes:

- `/` — discovery homepage.
- `/games` — complete catalog; query parameters hold `q`, `category` and `age`.
- `/category/:slug` — category landing page.
- `/play/:slug` — unified game detail/player page.
- Unknown routes and slugs — helpful not-found view with a library link.

Use a small routing library if its compatibility is confirmed during implementation. Keep existing `/games/<slug>/index.html` static URLs intact. Configure the eventual host so actual game assets resolve before SPA fallbacks; hard-refresh every route in preview and deployment checks.

### Player lifecycle

Adapt existing iframe and LearningHub launch paths. Launch only the selected game and unmount it on exit. Returning to the catalog restores filters, scroll position and focus to the originating card where possible.

An iframe `load` event means a document loaded; it does not prove gameplay is ready. Use a loading state and recovery action without inventing game readiness. A versioned `postMessage` protocol for `ready`, `pause`, `resume`, `complete` and `error` can be added incrementally to owned games. Validate sender window, expected origin and message shape; document exceptions for sandboxed opaque origins if those are introduced.

Do not promise global pause or mute for games without integration. Feature-detect fullscreen, handle rejected requests, and offer ordinary inline play. Treat restart as game-specific: reloading a game may retain its original local saves.

Existing trusted same-origin games need a compatibility review before changing iframe sandbox or permissions. Future third-party games should use a separate origin and explicit permissions after licensing and integration review.

### State, performance and content

- Store discovery state in URLs and temporary interaction state in React memory. No new localStorage, profile, database or exported child activity.
- Use deterministic title/tag search and reviewed related-game rules; no recommendation service is needed.
- Provide descriptive local artwork with a licensed-source inventory. Lazy-load below-the-fold thumbnails and reserve dimensions.
- Keep Three.js out of discovery's initial requests. Do not preload all game builds or run offscreen players.
- Maintain content through reviewed static files first. No admin service is required for the initial catalog.
- Provide page titles, descriptions and canonical route decisions. Evaluate static prerendering later; changing metadata in an SPA alone does not guarantee search indexing.

### Proposed file changes

```text
src/
  main.jsx                      # application entry and integration
  platform/
    App.jsx                     # routes and shared shell
    catalog.mjs                 # adapters, IDs and validation
    discovery.mjs               # pure search/filter/related functions
    session.jsx                 # visit-only favorites and recent games
    components/
      Header.jsx
      SearchBar.jsx
      CategoryChips.jsx
      GameCard.jsx
      GameGrid.jsx
      GamePlayer.jsx
    pages/
      HomePage.jsx
      CatalogPage.jsx
      CategoryPage.jsx
      GamePage.jsx
      NotFoundPage.jsx
    platform.css
public/images/games/            # reviewed artwork
tests/platform.test.mjs
tests/platform.browser.mjs
ASSET_LICENSES.md
```

These are proposed responsibilities; fit final names to existing conventions. Preserve `AgeGames.jsx`, `games.js`, `learning/` and `public/games/` behavior while integrating the new shell.

## 8. Implementation phases and completion gates

| Phase | Work | Completion gate |
| --- | --- | --- |
| 0. Baseline and reference capture | Record existing launches, inspect applicable REA instructions if available, observe reference interactions, capture desktop/mobile examples and inventory content rights | Evidence notes identify observed behavior, assumptions, regressions to guard against and unknowns |
| 1. Catalog and navigation | Normalize existing content, detect collisions, implement routes, search/filter functions and route fallbacks | Ready games resolve; unavailable games cannot launch; search and filter combinations return expected records |
| 2. Discovery interface | Build header, search, categories, grid, age entry points and curated shelves | Responsive, keyboard-usable discovery with readable artwork fallback, no overflow and clear empty states |
| 3. Unified game player | Integrate iframe and module launches, instructions, return behavior, fullscreen and recovery | Representative games of both types launch and exit correctly; back navigation restores discovery context |
| 4. Session features and artwork | Add temporary favorites/recent games, related suggestions and approved thumbnails | Session state deduplicates correctly, no persistent tracking is added, and artwork rights are documented |
| 5. Regression and release readiness | Run focused checks, existing suites, production build and device/browser review | Acceptance criteria below pass or remaining limits are explicitly recorded |

First vertical slice: homepage grid → find Jungle Adventure → game page → launch → return with search/filter/scroll preserved. Then add one LearningHub module and one age-collection game before expanding catalog coverage.

Estimate after Phase 0: time depends on actual game compatibility, artwork availability, browser support and reference observations. Do not equate a working platform shell with Poki's catalog breadth or operational scale.

## 9. Verification and measurable acceptance criteria

### Functional checks

- Search matches titles and tags regardless of case; blank and whitespace-only input restore the appropriate catalog. Clear controls reset the intended state.
- Combined category and age filters work, including missing metadata and no-results cases. Unknown query values fail gracefully.
- Catalog IDs/slugs are unique, ready launch targets exist, and module IDs are valid. Do not generate broken URLs for module entries.
- Direct navigation, hard refresh, Back/Forward and unknown slugs behave correctly.
- Main games, every age collection and Discovery Club remain reachable. Number Train remains unavailable.
- Leaving a game stops its audio/render activity. Existing Three.js disposal and 2D fallback still work.
- Failed loads and denied fullscreen requests keep navigation usable. Play controls never imply unsupported pause/mute integration.
- Temporary favorites/recent history reset on full reload; existing standalone save behavior is preserved.

### Accessibility, layout and performance

- Check layouts at 360, 768, 1280 and 1440 CSS pixels, with no horizontal page overflow. Check text zoom and long titles.
- Search, filters, cards and player navigation are usable by keyboard, with visible focus and sensible focus restoration. Avoid a keyboard trap in player transitions.
- Provide accessible labels, readable contrast and reduced-motion behavior. Use approximately 44 px primary touch targets.
- Discovery requests no game runtime or Three.js before selection; thumbnails reserve dimensions and load progressively.
- Proposed discovery targets: LCP ≤2.5 s, CLS ≤0.1 and INP ≤200 ms at the 75th percentile once enough field data exists. During development use a recorded mobile lab profile for provisional checks; lab results cannot establish field INP.
- Report game startup separately from homepage performance. Set individual startup budgets after measuring current games on agreed hardware.
- Automated responsive emulation is supplemented with physical Android Chrome and iOS Safari testing before claiming support. Desktop checks should include Chromium and another engine where available.

### Commands for implementation verification

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:browser
```

Inspect the existing browser runner's prerequisites before use. Add platform coverage to the browser command or document its separate invocation. Existing tests passing alone cannot verify the new shell. No application tests were run for this planning-only change.

## 10. Main risks and decisions

| Risk / decision | Planned handling |
| --- | --- |
| Learning project versus broad casual portal | Assume the existing child-friendly product; confirm broader genres before adding them |
| Reference behavior not interactively verified | Complete the observation pass before visual or behavioral parity claims |
| REA unavailable | Continue public observation; record tool availability and avoid claiming REA-generated evidence |
| Artwork gaps | Create or license original assets; use consistent fallbacks while assets are pending |
| Mixed standalone/module launches | Use adapters and exercise both paths early |
| Legacy storage and iframe compatibility | Preserve existing saves and permissions until reviewed per game |
| Routing breaks static game paths | Test host precedence and direct game assets before release |
| Catalog larger than current content | Grow through quality-reviewed games; do not fabricate playable cards or popularity |
| Accounts, ads or telemetry change product constraints | Keep outside this release and revisit explicitly if requested |

## 11. First implementation milestone

Deliver a local, reviewable discovery-to-play slice with the existing catalog, original ABC Letter World styling, search, category/age filtering, stable game pages and both launch types. Validate it against the existing learning requirements before expanding features or choosing hosting. Publishing is outside this planning task.
