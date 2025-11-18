# Repository Guidelines

## Project Structure & Module Organization
Primary app code lives under `src/`, with key modules: `pages/` for route views, `components/` for shared UI, `stores/` (Pinia), `services/` for API clients, `domain/` + `models/` for typed entities, and `core/` for utilities/boot logic. Layout styling is in `src/css` and `src/assets`. Public static files go in `public/`. End-to-end-friendly fixtures sit in `json-server/db.json`. Unit tests live in `tests/`, compiled to `.test-dist/` during runs. Additional setup helpers are stored in `scripts/`.

## Build, Test & Development Commands
`npm run dev` launches Quasar + Vite with hot reload. `npm run dev:api` starts the local json-server on port 3333; run it alongside the dev server whenever mocks are needed. `npm run build` generates the production bundle via `quasar build`. `npm run lint` enforces ESLint on TypeScript/Vue sources, and `npm run format` applies Prettier across code and docs. `npm run test` (alias for `test:unit`) compiles specs with `tsc -p tsconfig.test.json`, prepares stubs via `scripts/setup-test-stubs.cjs`, and executes Node’s built-in test runner.

## Coding Style & Naming Conventions
Stick to TypeScript + Vue SFCs with `<script setup>` whenever possible. Use 2-space indentation and single quotes inside scripts. Components should be `PascalCase.vue`, composables `useX.ts`, and stores `*Store.ts`. Modules under `domain/` should export typed classes or DTOs. Run `npm run format && npm run lint` before committing; the repo expects zero warnings.

## Testing Guidelines
Specs belong in `tests/*.spec.ts` or deeper feature folders mirroring `src` paths. Prefer describing stores/services over components, and mock HTTP calls via json-server fixtures. Node’s test runner already handles isolation; add `t.mock` tables when covering edge cases. Keep new features backed by at least one spec exercising the Pinia store or service contract touched.

## Commit & Pull Request Guidelines
Follow the conventional prefix style found in history (`feat:`, `chore:`, `docs:`, etc.) and keep subjects under 72 characters. Each PR should include: purpose summary, screenshots for UI updates (from `npm run dev`), linked issue or ticket id, and a checklist of commands run (`lint`, `test`). Rebase before opening the PR to keep the log linear.
