# Game search: evidence and implementation

Date: 23 October 2026

Current implementation update: search is now integrated into `src/Portal.jsx` as part of the full portal redesign. `src/search.mjs` still provides the catalog and matching functions; the earlier `GameSearch.jsx` component is no longer mounted. See `PORTAL_IMPLEMENTATION.md` for the current UI and verification record. The sections below also preserve the earlier search-only delivery history.

## Reference evidence

Target selected by the user: https://poki.com/ (supersedes the earlier Notes example).

Public page retrieval showed a search input with the prompt “What are you playing today?”, category navigation and game collections. This supports placing search near the beginning of discovery. Source: [Poki homepage](https://poki.com/), retrieved 23 October 2026.

Interactive observation was attempted through the browser tool. Creating an in-app browser tab failed with `Browser is not available: iab`; the subsequent surface inventory returned no apps or browsers. REA's skill is installed, but no REA analysis tools are advertised in this session. No REA Evidence ID or runtime capture is claimed.

Poki's matching rules, ranking, debounce interval, keyboard shortcuts, result highlighting and network implementation remain unverified. The following behavior is our design, not a reconstruction of verified Poki internals.

## Delivered behavior

- Live search across playable main games, age collections and all six learning worlds.
- Case/accent normalization and whitespace-separated terms; every term must match a title, description, skill, collection, category or age string.
- Exact title, title prefix and title substring matches precede metadata-only results. Ties preserve catalog order.
- Visible title/description matches highlighted with React text nodes; query text is never interpreted as HTML or as an unescaped regular expression.
- Category and age-collection filters combine with the query. An age collection means catalog membership, not a numeric suitability calculation. Games without membership are excluded when that collection is selected.
- Result count, empty state, clear action, filter reset, Escape-to-clear and keyboard-operable native controls.
- Unavailable entries cannot appear. Module worlds are deduplicated and use the existing LearningHub launch path; standalone games keep their original URLs.
- Search state stays in React memory while a game is open and resets on page reload. No new browser storage, database or external search requests.

## Source-level evidence

- `src/main.jsx`: retains the current application and supplies its existing `setActive` launch callback to the new search section.
- `src/search.mjs`: catalog adapters, readiness filtering, normalized matching and ranking.
- `src/GameSearch.jsx`: input, controls, highlighted results and launch actions.
- `tests/search.test.mjs`: query normalization, field coverage, combined filters, unavailable entries, unique IDs and ranking.

This change implements search only. Other phases in IMPLEMENTATION_PLAN.md remain future work. Interactive reference parity and physical mobile-device verification remain outstanding.

## Verification results

- `npm.cmd test`: 23 tests passed, including five new search tests.
- `npm.cmd run build`: passed; the existing large lazy Three.js chunk warning remains.
- `npm.cmd run test:browser`: passed outside the sandbox after the sandboxed browser timed out at initialization. New assertions verify live title search, highlighting, standalone launch, query restoration on return, empty results and clearing. The existing learning-game regression checks also passed.
- Combined filters are verified by unit tests; interactive filter layout and physical-device behavior have not been manually reviewed.
