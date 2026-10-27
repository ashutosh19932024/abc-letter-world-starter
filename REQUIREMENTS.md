# ABC Letter World: Advanced Learning and 3D Games Requirements

Date: 23 October 2026  
Status: Playable first release implemented; remaining rollout work is recorded below  
Target project: `ABC_LETTER_WORLD/abc-letter-world-starter`

## 1. Product goal

Expand ABC Letter World into an age-appropriate learning playground where children explore 3D worlds, solve reasoning puzzles, build inventions, and learn through short interactive missions. Preserve the existing games and add meaningful learning rather than only quiz screens or decorative 3D scenes.

This document defines the product direction. The implementation record at the end distinguishes delivered activities from future rollout work. The Parent area was removed at user request. New activities use visit-only memory, without profiles, persistent storage or a database.

## 2. Inspection of the current project

The inspection covered `package.json`, `README.md`, `Rule.md`, `src/main.jsx`, `src/games.js`, `src/AgeGames.jsx`, the game-file inventory, and the Little Chef game-state module. This is a source-level baseline, not a completed browser, accessibility, or performance audit of every game.

| Area | Observed state | Implication |
| --- | --- | --- |
| Application | React 19, Vite 6, React DOM and Lucide React | Extend the existing application; no framework replacement needed |
| Game hosting | Games under `public/games/`, launched in an iframe | Keep existing launch URLs working; define a shared interface for new games |
| Main library | Jungle Adventure, Alphabet Quest, Kite Fly, Rocket ABC Adventure and Little Chef Academy marked ready; Number Train coming soon | Preserve existing entries and behavior |
| Age collections | Toddler Play (10), Tiny Tinkers (10), Little Discoverers (9), Brain Explorers (7) | Build on the existing data-driven collections |
| Older children | Ages 10–13 has an empty game list | Add reasoning, coding, science and robotics challenges here |
| Existing thinking games | Matching, memory, maze, patterns, counting and time activities | Add deeper progression and new mechanics rather than duplicate cards |
| Progress | Some games save their own progress or best scores in localStorage | No unified learner profile or progress dashboard observed in the reviewed shell |
| 3D infrastructure | No dedicated 3D engine declared in package dependencies | A new renderer and performance fallback are required |
| Testing | Little Chef test and browser-check files exist; package scripts only expose dev/build/preview | Add focused checks as new shared systems are implemented |
| Documentation | README age labels and some availability descriptions differ from `src/games.js` | Reconcile documentation against the actual catalog during implementation |

Follow `Rule.md`: preserve existing behavior, keep changes focused, and check affected functionality after changes.

## 3. Audience and learning approach

| Age band | Experience | Guidance |
| --- | --- | --- |
| 1–3 | Existing sensory and simple matching play | Adult-supported use; no scored assessments or advanced subject lessons |
| 3–5 | Shapes, letters, counting, visual sequences and simple cause/effect | Spoken instructions, large controls, short untimed rounds |
| 5–7 | Introductory logic, maths, nature, general knowledge and robot commands | Concrete examples and guided exploration |
| 8–10 | Multi-step puzzles, experiments, fractions, coding and civic concepts | Optional hints and explanations after attempts |
| 10–13 | Planning, scientific reasoning, algorithms, AI literacy and civics | More open-ended challenges and evidence-based explanations |

The catalog currently uses overlapping age bands. Preserve existing labels initially and use recommended age metadata for new content. Any later relabeling should be deliberate and reflected consistently in the UI and README. Age suitability must be reviewed against the actual lesson, not inferred from the subject name.

## 4. Advanced 3D game collection

Every game must have a clear objective, an interactive mechanic, visible feedback, hints, a completion state, replay, and a working return-to-library action.

| Proposed game | Ages | Play mechanic | Learning outcome |
| --- | --- | --- | --- |
| Logic Island 3D | 5–10 | Rotate paths, open gates with patterns, sequence switches and deliver objects | Sequencing, spatial reasoning and planning |
| Robo Builder Lab | 7–13 | Assemble a virtual robot and program movement with command blocks | Algorithms, loops, debugging and sensors |
| Math Space Mission | 5–10 | Solve number tasks to route a spacecraft and balance cargo | Arithmetic, comparison, fractions and estimation |
| Science Discovery Lab | 7–13 | Predict, adjust variables and observe simulated light, force and circuits | Hypotheses, observation and cause/effect |
| Knowledge Explorer World | 6–13 | Explore a map and solve object-based discovery missions | Geography, animals, culture and general knowledge |
| Eco City Builder | 8–13 | Place water, energy, transport and recycling systems within constraints | Systems thinking, resources and civic responsibility |

Initial vertical slice: Logic Island 3D with three complete missions: a visual sequence gate, a route-planning bridge, and a switch-order puzzle. Each mission must teach a distinct skill and include at least one guided example. Other games follow in phases; do not show unfinished games as playable.

3D requirements:

- Use stylized, readable low-poly environments, gentle camera movement and clear object selection.
- Support touch, mouse and keyboard; provide buttons for actions otherwise requiring dragging.
- Keep essential instructions, answers and navigation in accessible HTML controls.
- Provide sound/mute, reduced motion, pause and replay controls.
- Handle unavailable WebGL or rendering failures with an equivalent 2D learning activity.
- Lazy-load 3D code and assets only after game selection; release render loops, audio and GPU resources on exit.
- Use locally bundled, licensed assets; record asset attribution and licenses.

## 5. Logic and thinking challenges

Create a dedicated Thinking Playground with graded difficulty and varied puzzle instances.

| Challenge | Example | Skill |
| --- | --- | --- |
| Pattern Detective | Choose the next shape, number or rotation | Pattern recognition |
| Memory Journey | Recall a short route or object sequence | Working memory practice |
| Build the Bridge | Connect a route using a limited set of pieces | Spatial planning |
| Rule Machine | Infer how input objects are sorted | Classification and deduction |
| Robot Rescue | Arrange commands, run them, then repair mistakes | Computational thinking |
| Balance Puzzle | Balance objects using visible weight clues | Quantitative reasoning |
| Cause and Effect | Predict which linked mechanism will move | Causal reasoning |
| Clue Quest | Combine a few clues to locate an object | Deduction and comprehension |

Requirements: visual tutorials, understandable constraints, undo/reset, optional step-by-step hints, untimed default play, and constructive retry feedback. Puzzle generators must produce solvable instances with checked answers. Do not increase reading demand merely to make a logic puzzle harder.

## 6. Child assessment: Learning and Thinking Check

The requested child IQ-test idea becomes an educational skill check. Do not produce IQ scores, intelligence rankings, diagnoses, percentile claims, or labels such as gifted/weak. A game score does not establish a validated IQ result. Any future formal assessment would require a separately validated instrument, qualified oversight and appropriate usage rights.

- Offer an optional 8–12 item, age-appropriate session for ages 5–13 covering patterns, memory, spatial reasoning and quantitative reasoning.
- Keep it low pressure, untimed by default, skippable and resumable. No assessment for toddlers.
- Separate guided practice from independent check items. Record hints and assistance so assisted answers are not presented as independent mastery.
- Report correct attempts, completed items, hints and skill observations. Show “not enough evidence yet” when there are too few independent attempts.
- Present results as “Skills practiced,” “What is getting easier” and “Try next.” Compare only with the child's own prior work on comparable tasks.
- Explain that language, familiarity, accessibility needs and assistance can affect results. Response time must not determine an intelligence label.
- Supply answer explanations and suggested practice. Adults may reset a check without penalizing the child.
- Define item-bank balance, difficulty rules and result wording before implementation. Reserve unseen variants for later checks rather than repeating identical questions.

## 7. Learning worlds and subject coverage

| Subject | Suggested content | Interactive feature |
| --- | --- | --- |
| General knowledge | Animals, continents, landmarks, everyday inventions, Indian and world culture | Explore a map, identify objects and complete a discovery passport |
| Politics and civics | Community helpers, public services, rules, democracy, institutions and respectful discussion | Run a fictional classroom vote and plan a town service |
| Bhagavad Gita / Geeta | Optional stories and themes such as responsibility, compassion, self-control and thoughtful action | Illustrated stories followed by reflection choices |
| Science | Plants, habitats, matter, light, motion, space and simple circuits | Predict, experiment, observe and explain |
| Mathematics | Counting, operations, shapes, measurement, time, fractions and introductory logic | Manipulate objects, build structures and solve mission problems |
| AI literacy | Examples versus rules, training data, classification, mistakes, bias and verification | Train a small local toy classifier and test its mistakes |
| Computer literacy | Hardware, input/output, files, keyboard skills, algorithms and digital privacy | Assemble a virtual computer and solve safe-use scenarios |
| Robotics | Commands, loops, conditions, sensors and debugging | Program a virtual robot through increasingly complex courses |

Content requirements:

- Organize each lesson as a learning objective, short explanation, guided activity, independent challenge and reflection.
- Offer English first with an architecture for Hindi text and narration. Do not mix partial translations in a released lesson.
- Make civics nonpartisan; distinguish facts from viewpoints. Use fictional elections without collecting a child's political preferences.
- Date and source changing facts such as current officeholders. Prefer stable civic concepts in the first release.
- Make Geeta content parent-selectable and skippable, explain its cultural and religious context respectfully, and distinguish quotations, translations and interpretations. Use licensed or public-domain source material and editorial review.
- Keep AI learning bounded and educational. The first release needs no unrestricted AI chatbot or external child-data submission.
- Keep science and robotics activities virtual; do not ask children to handle mains electricity, heat or chemicals.
- Store factual sources, reviewer and review date with content. Verify sources during lesson authoring before release; this requirements file does not supply a verified curriculum.

## 8. Distinctive features

1. **Build, Predict, Explain:** children predict an outcome, test their construction, then choose or give a short explanation. Reward revision and learning from mistakes.
2. **Learning Passport:** a visual map of skills explored across subjects, with earned discoveries and clear next activities.
3. **Explain My Mistake:** authored, task-specific hints show why an attempt failed, followed by a smaller practice step.
4. **Cross-subject missions:** for example, program a rover, calculate its route, and inspect a simulated habitat in one adventure.
5. **Parent-child co-play:** optional discussion cards and turn-taking activities that work on one device.
6. **Creative sandbox:** after guided missions, build a bridge, robot or city and save it locally for replay.
7. **Gentle adaptive practice:** adjust task complexity using independent attempts and hints, with an adult override and no hidden intelligence score.

Prioritize the first three features after the initial playable slice. Cross-subject missions and the creative sandbox depend on stable underlying games.

## 9. Proposed technical design

Keep the React/Vite shell and existing static games. Evaluate Three.js with React Three Fiber for new React-based 3D modules during the first prototype; confirm compatibility and production dependency size before adoption. A physics engine is optional and should only be introduced when a game needs it.

Suggested structure for new work:

```text
src/
  learning/       # Reviewed lessons and question banks
  progress/       # Reserved; no profiles or persistent storage in this release
  assessment/     # Skill-check flow and result wording
  games3d/        # Lazy-loaded 3D games and shared controls
  components/    # Shared instructions and hints
public/games/    # Existing standalone games remain available
```

Shared contracts:

- Catalog entries: stable ID, title, subject, recommended ages, skill IDs, readiness, game type and launch target. Support both current iframe URLs and future lazy-loaded modules.
- Lesson/item entries: stable ID, locale, difficulty, objective, prompt, valid answers, explanation, source metadata and content version.
- Visit-only discoveries: game/mission ID, skill and assistance used. Deduplicate completed discoveries during the visit. No profile IDs or personal information.
- New activities use memory only. Reloading clears discoveries. Existing games retain their previous independent storage behavior.
- Iframe events, if needed: validate origin, source window and event schema before accepting `ready`, `progress`, `complete` or `exit` messages. Legacy games must continue working without this interface.
- Assessment difficulty rules should be deterministic, documented and independently testable. Do not train or infer an intelligence model from child play data.

Offline installation is later scope: first define which lessons and assets are cached, how updates invalidate old content, and what the UI says when a resource is unavailable.

## 10. Quality targets and acceptance criteria

These are proposed release targets to measure during implementation, not verified performance claims.

| Area | Acceptance criteria |
| --- | --- |
| Existing behavior | Existing game URLs, category filters, age collections, return navigation and fullscreen controls still work |
| First 3D game | All three Logic Island missions can be completed, retried and exited with touch, mouse and keyboard |
| Learning value | Each released mission has a stated objective, useful feedback, a hint and an explanation of its solution |
| Assessment | No IQ/diagnostic claims; skips, partial runs and assisted answers are represented accurately |
| Content | Every released factual lesson has source/review metadata; changing facts have a review date |
| Rendering | WebGL failure offers usable 2D play; renderer and audio stop when leaving the game |
| Performance | Target at least 30 FPS on an agreed representative Android device in low-quality mode; document device/browser and measured results |
| Loading | Existing homepage does not download the 3D engine or game assets before selection; game loading shows progress and recovery options |
| Accessibility | Keyboard access, visible focus, readable contrast, text alternatives, reduced motion, mute and non-drag controls; target WCAG 2.2 AA for shell and essential learning controls |
| Responsive UI | Core flows work at 360 px width and desktop sizes, including orientation changes without lost progress |
| Visit-only state | No new persistent storage or database; clearly state that reloading clears new discoveries |
| Privacy | No required child account, unrestricted chat, advertising tracker or unnecessary collection in the initial release |

Verification includes production build, regression smoke checks of existing collections, unit checks for puzzle validity/progress/assessment logic, and browser checks of the new completion and fallback flows. Test supported browsers on real representative devices before claiming cross-device readiness.

## 11. Phased delivery

| Phase | Deliverable | Exit condition |
| --- | --- | --- |
| 0 — Baseline | Browser audit, catalog/documentation reconciliation, content outline and agreed test-device list | Existing flows recorded and the first three missions specified |
| 1 — Playable foundation | Logic Island 3D, three missions, accessible 2D fallback, shared instructions and visit-only discoveries | First-game criteria above pass and existing games remain functional |
| 2 — Thinking Playground | Six puzzle types, optional Learning and Thinking Check, visit-only learning passport | Solvable age-appropriate puzzles and honest partial/assisted results |
| 3 — STEM expansion | Maths/science activities, Robo Builder and bounded AI/computer lessons | At least one complete lesson path per released subject |
| 4 — Knowledge and values | GK exploration, nonpartisan civics and optional Geeta stories | Reviewed, sourced, age-appropriate content and an explicit optional-topic choice |
| 5 — Advanced experience | Cross-subject missions, sandbox, Hindi rollout and selected offline support | End-to-end testing, content parity and measured device performance |

No fixed timeline is implied. Estimate each phase after the first prototype establishes asset, content and device-testing costs.

## 12. Scope boundaries and planning assumptions

- Implementation is now authorized. The Parent area and any database remain outside this release.
- Proposed initial audience for new advanced games is ages 5–13, with existing younger-child play preserved.
- Use a colorful, calm, child-friendly visual direction and short missions of roughly 3–8 minutes with pause/exit at any time.
- Prefer local-first play, optional family-selected topics and curated explanations over online accounts or generative tutoring.
- Physical robot connections, multiplayer/public chat, formal IQ testing, cloud accounts and teacher administration are outside the first release.
- Before implementation estimates, choose target devices, confirm English/Hindi release order, agree the lesson-review process and set an asset budget. These planning choices do not block this requirements deliverable.

## 13. Implementation record — first playable release

The following is implemented in `src/learning/` and integrated into the existing homepage. This record supersedes the baseline observations above where features have since changed.

| Requirement | Delivered behavior |
| --- | --- |
| Discovery Club | Six selectable learning worlds, Thinking Playground, Learning Studio, Thinking Check, a cross-subject rover mission and visit-only Passport |
| Logic Island | Three complete missions: pattern gate, five-tile connected bridge and ordered switches; hints, reset, completion and next-mission navigation |
| Robotics | Fit virtual chassis/sensor parts; construct absolute-direction programs, repeat a sequence twice, undo, run and debug three obstacle courses |
| Mathematics | Manipulate cargo mass across three missions, including half-unit containers; check totals, undo and replay |
| Science | Change voltage/resistance, operate a switch, predict the effect of doubling resistance, test and explain a simplified circuit |
| Eco City | Place homes, solar power, water, trees and recycling on a nine-plot grid; check needs against a budget; undo and creative sandbox |
| Thinking practice | Eight challenge categories with seeded variations, three selectable age bands, hints and transparent gentle adaptation of number complexity |
| Thinking Check | Twelve questions across four skills; age choice, practice example, memory reveal/hide, hints, skip, pause, partial finish and assisted/independent observations; no IQ score |
| Subject learning | English introductory GK, civics, computer and AI lessons; optional Geeta reflection; mathematics/science/robotics in their game worlds |
| Interactive extras | Fictional vote-counting desk, virtual input/process/output computer assembly and a local nearest-example toy classifier |
| Cross-subject mission | Calculate rover energy, program a route and test a fictional habitat rule |
| Discovery Passport | Deduplicated skill stamps and assistance counts in memory; no accounts, profile editor, database, new localStorage or export/import |
| Rendering | Locally generated low-poly Three.js scenes; lazy engine loading; HTML gameplay controls; explicit 2D mode; WebGL/context-loss fallback and resource disposal |
| Controls | Native keyboard/touch buttons, non-drag alternatives, reduced-motion styles, pause for worlds, optional short synthesized completion sound |
| Existing library | Existing static game files retained; ages 10–13 now offers four direct Discovery Club launches |

Current limitations and follow-up scope:

- These are compact playable activities, not a full curriculum or an open-world exploration game. Knowledge Explorer currently uses topic-based lessons, not a geographical map.
- 3D scenes visualize game state; movement and construction use the accessible HTML controls. Free camera navigation, terrain rotation puzzles and in-scene drag building are not implemented.
- Robot programs support directions and repeating a sequence twice. General nested loops, conditional sensor blocks and physical robotics are not implemented.
- The city has a visit-only sandbox. General-purpose saved robot/bridge projects, dedicated co-play cards and cross-session comparisons remain future work.
- English is complete for these introductory activities. Hindi localization, narration and offline installation remain later rollout scope; they are not exposed as available features.
- Assessment variants are seeded practice questions. Some reasoning templates repeat, and there is no validated or normed assessment instrument.
- Lesson links and source-check dates are included where applicable. Specialist pedagogical, religious-content and accessibility review remain outstanding; no qualified curriculum reviewer is claimed.
- Automated browser checks cover a desktop Chromium browser, a software WebGL renderer and simulated 360 px layouts. Physical Android/iOS testing, the 30 FPS target and a full WCAG audit remain unverified.
- Three.js is a separate lazy chunk of roughly 523 kB minified / 132 kB gzip in the current build. Vite reports its standard large-chunk warning; this payload is not requested on the homepage before game launch.
- The Parent area remains removed. Existing standalone games may still use their original browser storage; this implementation does not change that behavior.

Verification: `npm.cmd test`, `npm.cmd run build`, and `npm.cmd run test:browser`. See `README.md` for running instructions and browser-test prerequisites.
