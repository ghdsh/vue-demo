This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Type-check (vue-tsc) + production build → dist/
npm run preview   # Preview production build locally
```

No test or lint commands are configured.

## Architecture

Minimal **Vue 3 + TypeScript + Vite** single-page a/pplication.

- `src/main.ts` — entry point; creates and mounts the Vue app
- `src/App.vue` — root component
- `src/components/` — Vue components (Composition API, `<script setup>`)
- `src/style.css` — global styles (dark-first, 8px base unit)
- `DESIGN.md` — Apple-inspired design system reference (typography, color, spacing, components)

**TypeScript config** uses project references (`tsconfig.app.json` for src, `tsconfig.node.json` for build tooling), strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.

**Design system** (documented in `DESIGN.md`): minimalist black/white/gray palette, SF Pro font stack, Apple Blue (`#0071e3`) as sole accent, 980px max content width, glass morphism nav, cinematic full-viewport sections.
