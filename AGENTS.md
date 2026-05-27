# AGENTS.md

Orientation for AI coding agents working in this repo. Keep this file short — link out to the source instead of duplicating it.

## What this project is

Vidi is a Node.js web-GIS application and front-end for [GC2](https://github.com/mapcentia/geocloud2). It is both an end-user map viewer and a framework — most non-trivial functionality is added via **extensions** (server + browser) that plug into a small core.

- Server: Express app in `index.js` mounting routers from `controllers/` and `extensions/`.
- Browser: bundled with **esbuild** from `browser/index.js` into `public/js/bundle.js`. Mix of legacy jQuery/Backbone code and modern React (via `@rjsf/*` JSON-schema forms). Map stack is Leaflet + MapLibre.
- Real-time: `socket.io` (used for long-running server jobs like conflict reports & print).
- License: AGPL-3.0. Versioning is **CalVer** (`YYYY.MINOR.MICRO.MODIFIER`). User docs live in `docs/` (Sphinx, Danish source + English translation).

## Repo map (only the parts you usually touch)

```
index.js                  Express bootstrap (sessions, redis/file store, mounts controllers + extensions)
build.mjs                 esbuild-based build (replaces the old Gruntfile.js; Grunt is still present but legacy)
config/
  config.js               Live config (NOT committed in real deployments — has gc2.host, extension wiring, print templates)
  config.embed.dist.js    Template for embed mode
controllers/              Core Express routers (gc2/*, print, locale, css, df, template, ...)
  index.js                Mounts all core routers
extensions/
  <name>/browser/         Browser-side extension code (entry usually index.js)
  <name>/server/          Optional server-side router (must export an Express router)
  index.js                Auto-mounts everything listed under config.extensions.server
browser/
  index.js                Front-end entrypoint (requires geocloud.js, gc2table.js, vidi.js, jQuery, i18n)
  modules/                Core front-end modules (layerTree/, search/, api-bridge/, draw.js, sqlQuery.js, ...)
  i18n/                   Per-locale dicts loaded via require-globify
  service-worker/         PWA service worker (separately bundled by esbuild)
public/                   Static assets + build output (bundle.js, templates.js, css/build/, service-worker.bundle.js)
scss/main.scss            SCSS entry, compiled to scss/main.css then bundled to public/css/build/all.min.css
test/
  unit/                   Mocha + chai unit tests
  api/                    HTTP API tests
  puppeteer/              End-to-end browser tests (slow, require a running deployment — see test/README.md)
docker/                   Dockerfile + docker-compose for a base image that also pulls GC2
docs/                     Sphinx user documentation
```

## Build & dev

Build entrypoint is **`build.mjs`** (esbuild). The legacy `Gruntfile.js` is kept around but `package.json` scripts now call `build.mjs` directly.

```
npm install
npm run build              # dev build: bundles browser/index.js + service worker
npm run build:production   # full production build (bundles + minified libs + cache-bust + version hash)
npm run build:css          # only re-bundle CSS (SCSS → scss/main.css → public/css/build/all.min.css)
npm run build:libs         # only re-bundle vendor JS into public/js/build/{all,libs}.min.js
npm run watch              # dev server with livereload (port 35729), watches SCSS, templates, and JS
node index.js              # start the Express server (default :3000, requires gc2.host set)
```

The watch task does **not** also rebuild CSS on every change of source SCSS in a way that hot-swaps without page reload — SCSS edits trigger a CSS rebuild + full reload. Vendor `libs.min.js` is only rebuilt by `build:libs` / `build:production`.

Templates: any `*.tmpl` file under `public/templates/` or `extensions/**/templates/` is compiled to `public/js/templates.js` using Hogan. This file is **gitignored** and regenerated on build.

## Configuration

`config/config.js` is the single source of truth at runtime. Key sections:

- `gc2.host` — required. Set in the file or via `GC2_HOST` env var; the server `process.exit(0)`s without it (see `index.js:34-37`).
- `redis.host` — optional. If absent, sessions fall back to `session-file-store` in `/tmp/sessions`.
- `extensions.browser` / `extensions.server` — arrays of `{ name: ["index", ...] }` objects naming the modules to load. Commented-out entries are normal (many optional extensions ship in-tree). See `config/config.js` for the canonical example.
- `extensionConfig.<name>` — per-extension settings consumed by the extension code itself.
- `print.templates`, `urlsIgnoredForCaching`, `staticRoutes`, `puppeteerProcesses` — see existing keys.

`.env` is loaded by `dotenv` from the repo root (`build.mjs`/`index.js`). Never commit it.

## Extension model

To add an extension `foo`:

1. Create `extensions/foo/browser/index.js` (and optionally `server/index.js` that exports an Express router).
2. Register it in `config/config.js` under `extensions.browser` and/or `extensions.server`:
   ```js
   extensions: {
     browser: [ { foo: ["index"] } ],
     server:  [ { foo: ["index"] } ],
   }
   ```
3. Browser entries are loaded via `require-globify`; server entries are mounted by `extensions/index.js` as `./<name>/server/<file>.js`.
4. Browser-side, most modules expose a `set({ ... })` function that receives core singletons (`cloud`, `meta`, `backboneEvents`, `utils`, `layers`, `sqlQuery`, ...) and an `init()` that wires up DOM/events. Look at `extensions/conflictSearch/browser/index.js` or `extensions/editor/browser/index.js` for working patterns.
5. Cross-module communication is done via the global `backboneEvents` bus, not direct imports.

## Coding conventions

- **Match the file you're editing.** The codebase is bimodal: legacy modules use `var`, CommonJS `require`, jQuery, callbacks, and Backbone events; newer extensions use ES module `import`, React, async/await, and `@rjsf` forms. Don't modernize a legacy file unless that's the actual task.
- Every source file starts with an author / copyright / AGPL-3.0 header. Preserve it when editing; for genuinely new files copy the format from a neighbour.
- Don't reach into another extension's internals — go through `backboneEvents` or the core modules in `browser/modules/`.
- Bootstrap is **5.3**, React is **18**, Leaflet is **1.9**. Don't downgrade.
- Per `CONTRIBUTING.md`: bug fixes branch off the affected release line; new features branch off `master`. Update `CHANGELOG.md` and bump the CalVer in it as part of the PR.

## Testing

```
npm test                              # full suite: unit + api + puppeteer (slow, ~minutes)
npx mocha -t 100000 --recursive test/unit
npx mocha -t 100000 --recursive test/api
```

Puppeteer tests bootstrap via `test/puppeteer/bootstrap.js` and historically expected specific staging deployments (`vidi.alexshumilov.ru`); see `test/README.md` for the deployment expectations before relying on them. Don't assume they pass in a vanilla clone.

## Things that look broken but aren't

- Lots of untracked files under `public/` (e.g. `templates.<hash>.js`, `bundle.js.map`, `css/extensions/`, `mvt/`) — these are build artifacts and per-environment outputs. They're listed in `.gitignore` or are otherwise expected to be untracked.
- Many extension directories (`aau/`, `ejendom/`, `otp/`, `fkg_foto/`, `vidi-brevflet/`, `cowiplan_filter/`) show up as untracked in `git status` because they're maintained as separate concerns even though they live in-tree. Don't `git add` them blindly.
- `Gruntfile.js` exists but the build is driven by `build.mjs`. Don't add new tasks to Grunt.
- `config/config.js` in this working copy contains many commented-out `gc2.host` URLs for various deployments — that's intentional scratch state, not dead code to clean up.

## Quick checklist before declaring a change done

- [ ] Builds cleanly: `npm run build` (and `npm run build:css` if you touched SCSS).
- [ ] Existing file style preserved (legacy vs. modern — see above).
- [ ] If user-visible: `CHANGELOG.md` updated with a new CalVer entry.
- [ ] No secrets, `.env`, or per-deployment `config.js` committed.
- [ ] If you added an extension or a controller route: it's registered in `config/config.js` (extensions) or `controllers/index.js` (core routes) — otherwise it's dead code.
