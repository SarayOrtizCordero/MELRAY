# Maintenance Mode 503 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sitewide maintenance mode to the Melray static site: when the `MAINTENANCE_MODE` environment variable is `"true"` on Vercel, every route responds with a brand-styled, standalone page and HTTP 503; otherwise the site behaves exactly as it does today.

**Architecture:** A single root-level `middleware.js` file implementing Vercel Routing Middleware (platform-level request interception, framework-agnostic). It checks `process.env.MAINTENANCE_MODE` on every request; if `"true"` it returns a `Response` with the embedded maintenance page and status 503, otherwise it returns nothing and the request proceeds untouched.

**Tech Stack:** Plain JavaScript (ESM `export`/`export default` syntax, per Vercel's documented Routing Middleware convention), Vercel Functions `nodejs` runtime. No npm dependencies, no `package.json`, no build step — matches the rest of the site (`docs/superpowers/specs/2026-08-18-melray-landing-design.md`).

## Global Constraints

- No build tools, frameworks, or npm dependencies — `middleware.js` must be plain JavaScript with zero imports (per `docs/superpowers/specs/2026-08-24-maintenance-mode-503-design.md` §3).
- The maintenance page must not reference `css/styles.css`, the self-hosted `.woff2` fonts, or any other external file — all CSS inline in the same `middleware.js` string, system font stack only (spec §4).
- Brand colors used verbatim: background `#faf1e7`, text `#2c1a12`, logo gradient `#fb7b15` → `#df3314` (spec §4).
- Exact copy: title `Melray — Volvemos enseguida`, heading `Estamos poniendo esto en orden.`, body `Volvemos enseguida.` (spec §4).
- No changes to any existing file (`index.html`, `css/styles.css`, `js/main.js`, or any other file already in the repo) — this plan only adds `middleware.js` (spec §5).
- No `matcher` config — Routing Middleware must run on every route by default (spec §3).
- Runtime `nodejs` (spec §3) — do not use `runtime: 'edge'`.
- Response headers when in maintenance mode: `Content-Type: text/html; charset=utf-8` and `Retry-After: 3600` (spec §3).
- Setting or changing the live `MAINTENANCE_MODE` environment variable on Vercel is a production-impacting action (it takes the real site offline) and is explicitly OUT OF SCOPE for both tasks below — it is documented as a manual runbook at the end of this plan for the human to run when they actually want to use the feature, never executed automatically as part of implementation.

---

### Task 1: Create `middleware.js`

**Files:**
- Create: `middleware.js` (repo root, same level as `index.html`)

**Interfaces:**
- Produces: default-exported function `middleware(request)` — returns a `Response` (status 503) when `process.env.MAINTENANCE_MODE === 'true'`, otherwise returns `undefined`. Exported `config = { runtime: 'nodejs' }`.

- [ ] **Step 1: Write `middleware.js`**

Create the file with this exact content:

```js
const MAINTENANCE_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Melray — Volvemos enseguida</title>
<style>
  :root {
    --color-orange-light: #fb7b15;
    --color-orange-dark: #df3314;
    --color-bg: #faf1e7;
    --color-text: #2c1a12;
    --color-text-muted: #6b5748;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-align: center;
    padding: 1.5rem;
  }
  .card { max-width: 420px; }
  .card svg { margin: 0 auto 1.5rem; display: block; }
  h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; }
  p { font-size: 1rem; line-height: 1.5; color: var(--color-text-muted); }
</style>
</head>
<body>
  <div class="card">
    <svg width="56" height="56" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fb7b15"/>
          <stop offset="1" stop-color="#df3314"/>
        </linearGradient>
      </defs>
      <path fill="url(#logoGrad)" d="M15 2.3C18.3 6.3 22.2 10.8 22.8 16.2C23.7 11.7 22.2 8.3 20.7 6.3C23.7 8.7 25.8 13.2 25.5 18.3C25.5 25.2 20.9 30.3 15 30.3C9.2 30.3 4.5 25.2 4.5 18.3C4.5 13.8 6.9 10.2 10.2 7.5C9 10.2 9.3 13.2 11.1 15C10.5 10.8 12.3 6.3 15 2.3Z"/>
      </svg>
    <h1>Estamos poniendo esto en orden.</h1>
    <p>Volvemos enseguida.</p>
  </div>
</body>
</html>`;

export const config = {
  runtime: 'nodejs',
};

export default function middleware(request) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return new Response(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Retry-After': '3600',
      },
    });
  }
}
```

- [ ] **Step 2: Verify the logic locally with plain Node**

No Vercel CLI is installed in this environment, so `vercel dev` is not
available. Verify the middleware's request-handling logic directly with
Node's built-in `Request`/`Response` globals (Node 24, already installed —
confirmed via `node -v`):

Run:

```bash
node --input-type=module -e "
import middleware from './middleware.js';
const off = middleware(new Request('https://example.com/'));
console.log('off:', off);
process.env.MAINTENANCE_MODE = 'true';
const on = middleware(new Request('https://example.com/'));
console.log('on status:', on.status);
console.log('on content-type:', on.headers.get('Content-Type'));
console.log('on retry-after:', on.headers.get('Retry-After'));
const body = await on.text();
console.log('on body includes heading:', body.includes('Estamos poniendo esto en orden.'));
console.log('on body includes css var:', body.includes('#fb7b15'));
"
```

Expected output:
```
off: undefined
on status: 503
on content-type: text/html; charset=utf-8
on retry-after: 3600
on body includes heading: true
on body includes css var: true
```

If `off` is not `undefined`, or any `on` line doesn't match, the
implementation has a bug — fix `middleware.js` and re-run this exact
command before moving on.

- [ ] **Step 3: Commit**

```bash
git add middleware.js
git commit -m "feat: add maintenance-mode 503 routing middleware"
git push origin master
```

---

### Task 2: Verify the deploy is safe (normal traffic unaffected)

**Files:**
- None (verification only, read-only against the already-connected Vercel
  project; no file changes).

**Interfaces:**
- Consumes: the `middleware.js` pushed in Task 1. Project ID
  `prj_f1NuGkMpLpW2ADxvCRhlkQHO7FuE`, team ID
  `team_YfbA4i0DKnCmHjGGZeV5Xtk5` (from `.vercel/project.json`; the
  project's GitHub integration auto-deploys pushes to `master`, confirmed
  working earlier this session).

This task's ONLY job is to confirm the new `middleware.js` deployed
successfully and does not break normal (non-maintenance) traffic. It must
NOT set, unset, or touch the `MAINTENANCE_MODE` environment variable on
Vercel under any circumstance — that is a separate, human-run step (see
"Manual runbook" below), because flipping it to `"true"` takes the real,
live production site offline for real visitors.

- [ ] **Step 1: Confirm the new deployment built and went READY**

Use the `list_deployments` tool (projectId
`prj_f1NuGkMpLpW2ADxvCRhlkQHO7FuE`, teamId
`team_YfbA4i0DKnCmHjGGZeV5Xtk5`) and find the deployment whose
`meta.githubCommitMessage` is `"feat: add maintenance-mode 503 routing
middleware"` (the commit from Task 1). Confirm its `state` is `"READY"`
and `target` is `"production"`. If it's still `"BUILDING"`, wait and check
again. If it's `"ERROR"`, go to Step 2 to see why before doing anything
else.

- [ ] **Step 2: Check the build logs for middleware-related errors**

Use the `get_deployment_build_logs` tool with that deployment's `idOrUrl`
and `teamId`, `errorsOnly: true`. Confirm there are no errors mentioning
`middleware.js` (e.g. a module syntax error, or "Routing Middleware failed
to build"). If there is such an error, the ESM `export`/`export default`
syntax in `middleware.js` may need adjusting — report this as a concern
rather than guessing at a fix blind; this is the one part of the plan
flagged in the design spec as unverified until a real deploy happens
(spec §3, §6).

- [ ] **Step 3: Confirm normal (non-maintenance) traffic is unaffected**

Fetch the live production site and confirm it still returns the normal
page, not the maintenance page — this proves `middleware.js` correctly
does nothing when `MAINTENANCE_MODE` is unset. Use the Browser pane:
`navigate` to `https://melray.vercel.app`, then `get_page_text`. Confirm
the output contains `"Gestión simple para negocios que no paran de
moverse"` (the hero heading) and does NOT contain `"Estamos poniendo esto
en orden."` (the maintenance heading).

- [ ] **Step 4: Report**

Summarize: deployment state, whether build logs were clean, and whether
normal traffic was confirmed unaffected. If all three are clean, this
plan's implementation is done — the feature is deployed and inert until a
human deliberately flips the environment variable (see the manual runbook
below).

---

## Manual runbook: testing and using maintenance mode

This is not an automated task — flipping `MAINTENANCE_MODE` to `"true"` on
Vercel takes the real production site offline for anyone visiting it. Run
this yourself (or ask the agent to do it in a live conversation, with your
explicit go-ahead at that moment) when you actually want to use the
feature:

1. Vercel dashboard → project `melray` → Settings → Environment Variables
   → add `MAINTENANCE_MODE` = `true` (scope: Production).
2. Check whether the site immediately serves the 503 page at
   `https://melray.vercel.app`, or whether a redeploy is needed for the
   Function to pick up the new value (this was flagged as unverified in
   the design spec — Task 2 above does not resolve it, since resolving it
   requires actually turning maintenance mode on). If a redeploy is
   needed, trigger one from the dashboard (no code changes required).
3. Confirm: visiting any URL on the site shows the "Estamos poniendo esto
   en orden." page, and the HTTP status is 503 (check via browser dev
   tools Network tab, or `curl -I https://melray.vercel.app`).
4. When done, delete the `MAINTENANCE_MODE` environment variable (or set
   it to `false`) and confirm the site returns to normal.

## Self-Review Notes

- **Spec coverage:** Mechanism (env var + Routing Middleware, spec §3) →
  Task 1 Step 1 + config. No-npm-deps/no-package.json constraint (spec §3)
  → enforced in Global Constraints and Task 1's plain-JS content. Standalone
  page content (logo, copy, colors, system fonts, spec §4) → Task 1 Step 1,
  verified in Task 1 Step 2's body-content assertions. No changes to
  existing files (spec §5) → Global Constraints, and Task 1 only creates
  one new file. Redeploy-timing unknown (spec §3.1, §6) → explicitly
  surfaced in Task 2 Step 2 and the manual runbook, not silently assumed
  either way.
- **Placeholder scan:** No TBD/TODO. The one open question from the spec
  (does the env var apply instantly or need a redeploy) is carried forward
  explicitly as a documented unknown in the manual runbook, not hidden or
  guessed at — it cannot be resolved without actually enabling maintenance
  mode, which this plan deliberately keeps out of the automated tasks.
- **Type/consistency check:** `middleware.js`'s default export signature
  (`middleware(request)` → `Response | undefined`) is used consistently in
  Task 1 Step 2's test script and nowhere contradicted elsewhere in the
  plan. Header names/values (`Content-Type`, `Retry-After: 3600`) match
  between Task 1's code and the Global Constraints list.
