# CLAUDE.md

Guidance for Claude Code in this repository. Folder map, prerendering and the rules every change must follow are in `ARCHITECTURE.md`. Commands, the API contract workflow and deploy are in `CONTRIBUTING.md`.

## Verify

Before finishing, run `npm run lint`, `npm run type-check` and `npm run test`. If the change touches routes or prerendering, also run `npm run build`.

## Code rules

- Public routes in `src/App.tsx` load with `route.lazy`. Passing a `React.lazy` component there breaks vite-react-ssg prerendering; only private pages (editor, settings, drafts) use `React.lazy`.
- Read and write `localStorage` only through the keys in `STORAGE_KEYS` (`src/lib/constants.ts`).
- Call the API through the objects re-exported from `src/lib/api/index.ts`. They go through `request()` in `src/lib/api/client.ts`, which refreshes the token on 401.
- Import markdown functions from `src/features/markdown` (its `index.ts`), not from individual files.
- For colors in new CSS, use the custom properties in `src/index.css` (`:root` for light, `[data-theme="dark"]` for dark) so both themes follow.
- Tests sit in a `__tests__/` folder next to the code they cover.
- Unused-variable lint ignores names matching `^[A-Z_]`; any other unused variable fails `npm run lint`.

## Deploy

The workflow ends at the GHCR push. Do not add an SSH deploy step back: port 22 is closed to the outside and deploy is GitOps (see `751ca51`).
