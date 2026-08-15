# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Consultório Control — a single-tenant client/agenda/finance management PWA for a private practice (Portuguese-language UI). No build step: the frontend is plain HTML/CSS/JS deployed as static files to GitHub Pages, with Firebase used only for Firestore (data sync) and Cloud Functions (WhatsApp receipt sending). There is no test suite, linter, or bundler in this repo.

## Commands

- **Run locally**: `npx serve -l 8080 .` from the repo root, then open `http://localhost:8080` (this is exactly what the VS Code default build task — `.vscode/tasks.json`, runs on folder open — does). Alternatively just open `index.html` directly in a browser.
- **Deploy frontend**: push to the `main` branch on the `upstream` remote (`Gomes-Muller2026/Deplloy`) — GitHub Pages serves directly from the repo, there is no separate hosting build/deploy step and `firebase.json` intentionally has no `hosting` key.
- **Deploy Cloud Functions**: `firebase deploy --only functions` (from repo root, requires `firebase-tools`, installed as a devDependency at the repo root — not in `functions/`). Functions live in `functions/` with their own `package.json`/`node_modules`; they are not part of the frontend bundle.
- **Deploy Firestore rules**: `firebase deploy --only firestore:rules`. See "Firestore rules" below before touching `rules/`.
- No test runner, linter, or type checker is configured anywhere in this repo (root or `functions/`).

## Architecture

### Entry point and cache-busting

`index.html` is the live entry point (per `README.md`). The root-level `Consultório Control - Gestão de Clientes, Agenda e Finanças.html` is an older/legacy standalone build (older script set: `loader.js` partial pattern, no agenda/financeiro modules, no PDF/flatpickr) — not linked from anywhere active; don't assume it's kept in sync with `index.html`.

Since there's no bundler, every `<script src="...">` in `index.html` carries a manual `?v=YYYYMMDD-N` query string for cache-busting (the service worker also does network-first for HTML navigations). When you change a JS file that's referenced this way, bump its version query string, and bump `CACHE_NAME` in `sw.js` (`consultorio-app-v###`) if `ASSETS_TO_CACHE` behavior needs a hard refresh for existing installed PWA users.

### Script load order and module pattern

`index.html` loads, in order: `src/modules/clientes/clientModule.js`, `src/modules/agenda/agendaModule.js`, `src/modules/financeiro/financeiroModule.js`, then `js/app.js`. These are classic (non-ES-module) scripts — each domain module file declares a top-level `const xModule = { ... }` object of plain functions that becomes `window.xModule`.

The bulk of the application (~14k lines) lives in a single `class ConsultorioApp` in `js/app.js`, instantiated once as `window.app` on `DOMContentLoaded`. `ConsultorioApp` methods delegate specific domain operations (save/delete client, save/delete appointment, WhatsApp confirmation sends, expense CRUD, recurring-appointment bulk updates) out to `window.agendaModule` / `window.clientModule` / `window.financeiroModule`, always passing the app instance as the first argument (e.g. `window.agendaModule.saveAppointment(this, payload, id)`) so the module functions can read/mutate app state without owning it. When adding a new domain feature, prefer extending the relevant `*Module.js` file rather than growing `app.js` further, and remember the module script tag order in `index.html` matters (modules must load before `app.js`).

### State and Firebase sync

App state (`clients`, `appointments`, `expenses`, `packages`, settings, etc.) lives in memory on the `ConsultorioApp` instance and is mirrored to `localStorage` (see the `*_STORAGE_KEY` constants at the top of `app.js`) as the offline-first source of truth. Firestore sync is a custom push/pull layer on top of that, not a live-binding: writes go through `requestFirebasePushSync()` → `pushAllDataToFirebase()`, guarded by a watchdog/retry mechanism, a dirty flag (`FIREBASE_SYNC_DIRTY_STORAGE_KEY`), and quota-pause detection; pulls run on a polling loop that gets "boosted" (shorter interval) right after a local change. Concurrent-device conflicts are handled via a per-device "push shadow" snapshot (`firebasePushShadowState`, `FIREBASE_PUSH_SHADOW_STORAGE_KEY`) and delete "tombstones" (`APPOINTMENT_DELETE_TOMBSTONES_STORAGE_KEY`), since the sync model exchanges full collections rather than diffing individual documents server-side. If you touch sync code, preserve this dirty/shadow/tombstone bookkeeping — it's what prevents one device's push from silently overwriting another device's concurrent edits or resurrecting a deleted appointment.

A JSON snapshot at `data/backup_consultorio_2026-07-26 (1).json` is loaded as local fallback/seed data (`LOCAL_BACKUP_DATA_URL`) when Firebase isn't configured yet.

### Firestore rules

`rules/firestore.rules` (currently `allow read, write: if true` — fully open) is the ruleset actually referenced for deploys; `rules/firestore.secure.rules` is an auth-gated version (`allow read, write: if isSignedIn()` per collection) that is not currently deployed. Don't assume the secure rules are live — check which file is actually being deployed before reasoning about data access security.

### Cloud Functions

`functions/index.js` exposes a single HTTPS function, `sendReceiptWhatsApp` (region `southamerica-east1`), which verifies a Firebase Auth ID token, checks the caller's UID against a comma-separated allowlist secret (`WHATSAPP_ALLOWED_UIDS`), validates the PDF payload (base64, size cap, `%PDF-` magic bytes, phone digits), and forwards it to the WhatsApp Graph API using secrets defined via `defineSecret` (`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`). CORS is manually set to `*` with OPTIONS preflight handled inline.

### Auth model

There is no Firebase Authentication-based user system for the app's own login — login is local, against credentials stored in `localStorage` (`LOGIN_*_STORAGE_KEY`) with a hardcoded default/required account seeded in `app.js`. Firebase Auth (via `getAuth().verifyIdToken`) is used only inside the Cloud Function, gated separately, for authorizing the WhatsApp send endpoint — the two auth mechanisms are unrelated. Google Calendar import uses read-only OAuth scopes (`calendar.events.readonly`, `calendar.calendarlist.readonly`) and only ever reads (imports) events, never writes to the user's calendar.

### Google integrations

Google Sign-In (`accounts.google.com/gsi/client`) and the Calendar API are loaded directly via `<script>` tags (no npm packages). `GOOGLE_CALENDAR_ALLOWED_ORIGINS` in `app.js` hardcodes which origins the OAuth flow is expected to run from (localhost dev ports + the GitHub Pages origin) — update this list if the Pages URL or local dev port changes.
