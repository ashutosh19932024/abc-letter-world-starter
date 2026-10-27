# ABC Play portal implementation

Date: 23 October 2026

The user-authorized portal redesign replaces the old hero-led homepage with a dense illustrated game library, inspired by the public discovery patterns on [Poki](https://poki.com/). This is an original ABC Letter World interface, not a pixel-identical copy or a licensed Poki catalog. Interactive Poki matching, infrastructure and player implementation remain unverified as described in `SEARCH_EVIDENCE.md`.

## Delivered

- Desktop navigation rail, compact search header, category chips, featured tile and a responsive game grid.
- 47 playable catalog entries: five main-library games, 36 age-collection games and six learning worlds. These counts include short activities sharing standalone game engines; they are not 47 separate game engines. The unavailable Number Train entry cannot launch.
- Original inline SVG artwork, with seven illustrative themes; no external game thumbnails are required.
- Live search, title-match highlighting, category filtering and age-collection filtering. Existing game IDs and launch URLs remain intact.
- Visit-only saved and recently played lists; phone navigation exposes the same lists. Reload clears these lists. Standalone games retain their existing storage behavior.
- Unified player pages, related games, game-specific description/instructions, restart, fullscreen with rejection handling, loading/retry state, back-to-library navigation, and focus/scroll restoration.
- Stable hash game/category links (for example `/#/play/world-robot`); direct navigation works without taking over existing `/games/...` static paths. Browser Back/Forward follows hash navigation. Search and age filters currently stay in memory rather than shareable URL parameters.
- Existing age collections and all Discovery Club activities remain accessible below the grid and through player launch adapters.
- Reduced-motion support, keyboard-operable controls, visible focus, mobile layouts and no persistent account, database, tracking service or child profile.

## Verification

`npm.cmd test` passes 23 tests. The production build passes with the retained lazy Three.js chunk warning. Browser regression coverage includes search, highlighting, launching and returning, saved lists, responsive overflow, direct game URLs, unknown game links, learning-world missions and age-group launches.

Browser tests run against a production build in isolated Chromium with software WebGL. Physical mobile performance, fullscreen behavior on every device and a complete accessibility audit remain unverified. Screenshots are generated at `artifacts/portal-desktop.png` and `artifacts/portal-mobile.png`.

## Remaining scope

No Poki commercial games, multiplayer service, ad network, public submission portal, account system or backend have been added. Additional commercial games need licensed builds and integration. The existing educational games remain the playable content in this release.

Search ranking is a local deterministic implementation, not a recovered Poki algorithm. Artwork is representative rather than a unique screenshot for every game. The retained LearningHub and age detail screens continue using their existing gameplay UI. SEO prerendering, localization, offline installation and production hosting remain separate work.
