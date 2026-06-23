# helisa-frontapp

Vue 3 + TypeScript SPA. Spanish locale (`lang="es"`).

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | `vue-tsc -b && vite build` — typechecks both tsconfig references then bundles |
| `pnpm preview` | Vite preview of built output |

- `vue-tsc -b` (project references build mode) checks `tsconfig.app.json` + `tsconfig.node.json` both at once.
- There is no standalone `typecheck` or `lint` script. No linter or test framework is configured.

## Architecture

- **Entry**: `src/main.ts` — mounts Vue app with Pinia + vue-router
- **Router**: `src/router/index.ts` — `createWebHistory()`, has an auth guard that checks `localStorage.getItem('access_token')`. Routes: `/` → Home, `/productos` → Products, `/nosotros` → About, `/calificar` → Rating/CRM mock.
- **State**: Pinia store in `src/stores/user.ts` — persists `access_token` and `user_id` to localStorage
- **HTTP**: `src/services/httpBase.ts` — Axios wrapper, auto-appends `/api` to the base URL, injects `Bearer` token from localStorage, dispatches `auth:token-expired` custom event on 401. 15s default timeout. FormData strips Content-Type automatically.
- **Auth**: localStorage-based (`access_token`, `user_id`). No refresh token logic.
- **Components**: `NavBar`, `FooterSection`, `ScrollToTop` in `src/components/`. Views: `HomeView`, `ProductsView`, `AboutView`, `RatingView` in `src/views/`.
- **Animations**: GSAP + ScrollTrigger. Most views register their own ScrollTriggers and kill them on unmount to avoid leaks. `global.scss` includes `prefers-reduced-motion` support to disable animations for users who request it.
- **Accessibility**: Global `:focus-visible` outline, `aria-label` on icon-only controls, `aria-current="page"` for active nav links, and keyboard activation for hover-driven cards. All icons come from Font Awesome 6.5.1; no inline SVGs or emojis.

## SCSS / Styling

- Vite config injects `@use "@/styles/index.scss" as *;` into every component via `additionalData` — all vars/mixins from that file are available globally without manual imports.
- `index.scss` re-exports `colorVariables.module.scss` and `fonts.module.scss`, plus global reset and custom `lighten`/`darken` helpers (wrapping `sass:color`).
- Color variables and fonts use `.module.scss` (CSS Modules) — import as `@use './foo.module.scss' as *;` in component `<style>` blocks.
- Dark mode toggles via `[data-theme='dark']` on `<html>`, using CSS custom properties defined in `global.scss`.
- Font stack: Montserrat (primary), Inter (secondary), loaded from Google Fonts.

## Config / Tooling

- **pnpm** with `node-linker=hoisted` (`.npmrc`) — dependencies are hoisted to root `node_modules`, not symlinked.
- **TypeScript**: strict mode, `noUnusedLocals`, `noUnusedParameters` enforced. `@/` path alias → `src/`. Target ES2023.
- **Vite**: target `esnext`, `@vitejs/plugin-vue`.
- **Env**: `VITE_API_BASE_URL` (default `http://localhost:8100/api`) in `.env` / `.env.example`.
- **CRM mock**: `/calificar` saves ratings/leads to `localStorage` under key `helisa_crm_leads`.
- **Icons**: Font Awesome 6.5.1 loaded via CDN in `index.html`. No inline SVGs or emojis.
- **Build output**: `dist/` (gitignored).
