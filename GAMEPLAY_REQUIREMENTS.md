# Learn by Playing: Revised Game Requirements

Date: 23 October 2026  
Status: Design requirements only; gameplay redesign not yet implemented  
Project: `abc-letter-world-starter`

## 1. What the user wants

Children should play enjoyable games and learn through their actions. They should move characters, explore places, build things, solve obstacles and see the results of their decisions.

The current objective-question and answer-button format does not meet this direction. A 3D scene above a question panel is also insufficient. The world itself must be the place where the child plays and learns.

This document supersedes question-and-answer-led features in `REQUIREMENTS.md` for the next redesign. The older document remains a record of previous requirements and implementation. This request creates the revised plan only; it does not change the application yet.

## 2. Main design rules

- Start with a playable situation and one short goal, such as “Help the robot reach its friend.”
- Teach through movement, construction, experimentation and visible consequences.
- Let the child act directly in the scene. Use touch/mouse selection, dragging, movement controls and keyboard alternatives.
- Make objects respond: a bridge carries the character, a circuit lights a lamp, a balanced vehicle moves safely.
- Show mistakes inside the game. A disconnected wire leaves the lamp dark; an incomplete bridge leaves a visible gap. Let the child repair the cause.
- Introduce new mechanics with a short demonstration or a friendly guide, then let the child try.
- Give several opportunities to use a skill in different situations. Repeating one answer is not progression.
- Keep instructions brief. Reading long paragraphs must not be necessary to play.
- Use encouragement, discovery and unlocked areas as rewards. Avoid punishment for experimenting.
- Keep pause, replay, sound controls and a clear return-to-games action available.

## 3. What to replace

| Current approach | Required gameplay approach |
| --- | --- |
| “What number comes next?” with answer buttons | Place missing track pieces in a repeating railway pattern; a train crosses when the track works |
| A maths question followed by a correct/incorrect message | Load physical cargo onto a vehicle and watch how its balance changes |
| Reading a science explanation and choosing an answer | Connect a battery, wires and a lamp; observe the circuit while changing parts |
| Robot command buttons below a decorative scene | Assemble a program on a workbench, press Run and watch the robot execute each step in the actual world |
| GK facts followed by a quiz | Travel through an interactive map, discover objects and help characters with tasks using those discoveries |
| Choosing the “right” moral response | Play an optional story where helping, sharing and caring visibly affect characters and the environment |
| A separate IQ-style question session | Optional logic adventures with observations about skills practiced; no IQ score or child ranking |

Do not replace answer buttons with labeled doors, collectible answer numbers or shooting the correct option while keeping the same quiz underneath. Learning must depend on meaningful game actions.

## 4. Proposed games

| Game | What the child actually does | What the child learns |
| --- | --- | --- |
| Bridge Builder Adventure | Walk to a river, inspect the gap, rotate and place bridge pieces, then guide a character across | Shapes, spatial reasoning, planning and revision |
| Robot Rescue Factory | Fit robot parts, build a visual program, run it step by step and repair a route when a sensor detects an obstacle | Sequencing, loops, conditions and debugging |
| Space Cargo Journey | Collect cargo, place it on a ship, balance both sides and prepare fuel for the route | Counting, addition, subtraction, measurement and fractions |
| Little Scientist Workshop | Snap circuit parts together, operate switches and experiment with light and simple mechanisms | Cause/effect, observation and changing one variable |
| World Explorer Expedition | Move across a map, meet animals, match discovered objects to habitats and complete delivery missions | Geography, animals, habitats and general knowledge |
| My Little Community | Build paths to shared services, deliver supplies, count fictional voting tokens and improve access for residents | Civic responsibility, counting, cooperation and public services |
| Computer Repair Garage | Connect input devices, place processor/memory parts and trace how a message reaches the screen | Computer components, input/output and basic data flow |
| AI Creature Garden | Label virtual creatures, train a local sorter, observe its predictions and improve the examples after mistakes | Training examples, classification limits and checking AI output |
| Kindness Garden — optional Geeta-inspired story | Help a character care for a garden, share tools, recover after a storm and continue a task thoughtfully | Reflection on effort, responsibility and compassion |
| Logic Maze Quest | Move blocks, redirect paths, remember landmarks and operate linked mechanisms to reach a destination | Memory, deduction, patterns and multi-step planning |

Suggested ages: guided versions for 5–7, growing challenges for 8–10 and deeper planning for 10–13. Preserve the existing younger-child collections. These are game designs, not claims that all ten games are already available.

## 5. First game to build: Bridge Builder Adventure

Build one polished game completely before converting the remaining activities.

### Story and player goal

A small explorer needs to carry a seedling across a river and plant it in a garden. The child helps by exploring the riverbank and building a usable bridge.

### Core play loop

1. Move the explorer around a small island using keyboard or on-screen movement controls.
2. Approach the river; a guide briefly demonstrates picking up one bridge piece.
3. Inspect available pieces in a tray: straight sections, corners and short connectors.
4. Select a piece, rotate it and place it directly onto a visible construction grid in the scene.
5. Try crossing. The explorer follows connected pieces and stops safely before a gap or broken connection.
6. Observe the problem, recover the piece, change the construction and try again.
7. Cross the completed bridge, deliver the seedling and watch the garden grow.
8. Explore a new river crossing with a different constraint.

### Three complete levels

| Level | Situation | New learning |
| --- | --- | --- |
| 1 — First crossing | A short straight gap, generous piece supply and a guided placement | Connecting pieces and basic movement |
| 2 — Around the rock | A rock blocks the direct route; corners must be rotated | Orientation, turning and route planning |
| 3 — The careful builder | A longer crossing with a limited inventory and more than one possible route | Resource use, planning ahead and comparing solutions |

### Required mechanics

- A controllable character with visible position and a useful camera view.
- Ground, water, rocks, start point and destination that are easy to distinguish.
- Direct object selection, valid-placement previews, rotation and snapping.
- Placement rules based on piece entrances/exits; visually neighboring pieces alone are not enough.
- A connected-path check that respects orientation, blocked cells, inventory and the destination.
- Visible traversal of the resulting route, rather than only a success message.
- Undo, pick up, reset and replay without losing access to the current level.
- A safe retry when the bridge is incomplete; no falling, frightening death sequence or lost lives.
- Optional hints that highlight a useful area or demonstrate one action, rather than reveal an answer choice.
- Mouse/touch drag where useful, plus select-then-place and keyboard alternatives for the same actions.
- Completion when the explorer actually reaches the garden and delivers the seedling.

### Example experience

The child places a corner facing the wrong way. The explorer reaches it and stops because its exit points toward the river. The game highlights that exit. The child rotates the corner, reconnects the route and watches the explorer continue. The child learns orientation through the action and its result.

## 6. Subject-specific requirements

### Maths

Use countable objects, measurable distances, cargo weight, grouped resources and visible fractions. The child should need the mathematical relationship to make the game work. Avoid detached calculation screens between otherwise unrelated game sections.

### Science

Use manipulable virtual experiments with understandable rules. Let children change a variable, observe what happens and try again. Explain the limits of simplified models briefly. Keep hazardous experiments virtual.

### General knowledge

Introduce facts when children encounter relevant places, animals or objects. Let the child use a discovery in the next task. Keep facts sourced and age-appropriate; changing information needs review dates.

### Politics and civics

Focus on community services, fairness, rules, cooperation and fictional decision-making. Use a simulated town and fictional votes. Do not collect political preferences, promote parties or turn gameplay into political persuasion.

### Geeta

Keep this optional and clearly identify its Hindu religious and cultural context. Use original, respectful stories inspired by selected themes, with appropriate source review. Do not score beliefs or imply there is one correct personal reaction. Families can choose a different game without losing access to the rest of the platform.

### AI, computers and robotics

Show visible systems: data examples entering a sorter, commands moving a robot and devices passing information. Let the child find and fix errors. AI activities should use virtual examples and local computation, without camera uploads, personal data or unrestricted chat.

## 7. Logic development without an IQ quiz

- Embed memory, patterns, spatial reasoning and deduction into game obstacles.
- Use behavior such as trying different routes, repairing a program and completing a construction to describe practiced skills.
- Avoid IQ scores, diagnostic labels, percentile claims and rankings against other children.
- If an optional challenge journey is added, make it a sequence of playable levels with pause and retry, not objective questions.
- Report only observable activity: “Completed two route puzzles” or “Used a hint to rotate a bridge piece.” Do not infer general intelligence from game actions.

## 8. Presentation and controls

- Make the playable scene the main area; small HUD elements show the goal, tools and available resources.
- Keep text panels secondary and short. Optional spoken guidance can be added later.
- Use readable low-poly art, friendly characters and clear interaction highlights.
- Avoid constant camera movement. Provide reduced-motion behavior and comfortable transitions.
- Support touch, mouse and keyboard without requiring precise dragging or fast reaction times.
- Preserve the full learning task in 2D fallback mode: interactive pieces, movement and construction, rather than a static picture or a quiz replacement.
- Pause game simulation and audio when paused or when the browser tab is hidden.
- Give specific feedback such as “These ends do not connect” through visual cues and short accessible text.

## 9. Technical direction

- Keep the existing React/Vite shell and the working older games.
- Use the existing Three.js dependency for scene-based play. Load each advanced game when selected.
- Separate game rules from rendering: level data, player movement, piece orientation, inventory, path validation and completion state must be testable independently.
- Use one authoritative game state for both the 3D world and accessible controls. A button and an in-scene action must produce the same result.
- Maintain a game update loop only while needed; use elapsed time for movement and stop it on pause/exit.
- Dispose of geometry, materials, event handlers and audio on exit. Handle unavailable/lost WebGL with the interactive fallback.
- Use local, licensed assets and retain attribution where needed.
- No database, login, Parent area or learner profiles. Keep new state in memory for the visit and clearly explain that refreshing resets it.
- Leave existing standalone games and their original storage behavior unchanged unless a later request explicitly changes them.

## 10. Migration plan

1. Implement and verify the three Bridge Builder levels as the reference for gameplay quality.
2. Convert Robot Lab from command submission plus a final-position update into visible step-by-step robot execution in the scene.
3. Convert maths and science activities into directly manipulated cargo and circuit objects with visible consequences.
4. Replace the question-led Learning Studio with expedition, repair, community and garden gameplay, one complete game at a time.
5. Replace the separate objective Thinking Check with optional logic-adventure levels; preserve the distinction between educational practice and formal assessment.
6. Expand learning depth with additional level layouts, new combinations of mechanics and optional creative play.

Do not remove working older collections during this conversion. Only mark a redesigned game ready once its complete play loop works.

## 11. Definition of done

The first redesigned game is ready when:

- A child can start, move, pick up, rotate, place, test, repair and finish using game actions.
- All three levels are playable from start to completion and teach different constraints.
- Gameplay never requires selecting a correct answer from an objective-question panel.
- The scene changes in response to actions and the character visibly traverses the constructed route.
- Incorrect construction produces understandable feedback and allows immediate repair.
- At least one alternative valid solution works where the level allows it; completion is based on rules rather than one hard-coded answer sequence.
- Touch, mouse, keyboard and non-drag alternatives support the same learning task.
- Pause, replay, reset, sound controls and return navigation work without stuck states.
- Interactive 2D fallback remains playable when WebGL is unavailable or lost.
- Existing age collections, library filters and game launches still work.
- Rule tests cover orientation, disconnected routes, obstacles, limited inventory and successful traversal. Browser checks cover completion, repair, pause and fallback.
- Performance is measured on representative devices before claiming mobile readiness.

## 12. Scope of this change

This change creates the revised requirements file only. Application changes should follow this gameplay-first direction when implementation is requested. The priority is a small number of complete, enjoyable games with clear learning mechanics, then expansion to more subjects.
