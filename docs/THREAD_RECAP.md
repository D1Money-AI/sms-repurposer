# SMS Repurposer — Thread recap & setup notes

This document summarizes the main work and setup steps from the development thread. Keep it in the repo so it travels with GitHub and your local clone.

---

## What we built

- **Mobile-first PWA dashboard** for “SMS Repurposer”: dark premium-style UI (Tailwind CSS), **Lucide React** icons.
- **Sections:** hero header with “System Online” status, latest incoming SMS card (mock text + timestamp), large “Generate Social Content” button, **interactive output tabs** (Instagram/Facebook vs Google Business) with copy-to-clipboard.
- **PWA:** `public/manifest.webmanifest`, `public/sw.js` (offline-friendly caching), client registration in `app/pwa-register.tsx`, manifest link in `app/layout.tsx`, `viewport.themeColor` for Next.js 16.

---

## Key project paths

| Item | Location |
|------|----------|
| Home / dashboard UI | `app/page.tsx` |
| Root layout, manifest link | `app/layout.tsx` |
| Service worker registration | `app/pwa-register.tsx` |
| PWA manifest | `public/manifest.webmanifest` |
| Service worker script | `public/sw.js` |
| Styles | `app/globals.css` |

---

## Local development

```bash
cd C:\Users\DA\sms-repurposer   # use your machine’s path if different
npm install
npm run dev                    # http://localhost:3000
```

**Production-like local run:**

```bash
npm run build
npm run start -- --port 3001   # or 3000 if free
```

**Quality checks:**

```bash
npm run lint
npm run build
```

---

## Git & GitHub (lessons from setup)

1. **Install Git for Windows** if `git` is not recognized: [https://git-scm.com/download/win](https://git-scm.com/download/win) — choose “Git from the command line and also from 3rd-party software” for PATH. Restart the terminal after install.

2. **Create the empty repository on GitHub first** (no README / .gitignore / license if you already have local files). Without that, `git push` fails with `Repository not found` / 404 for the URL.

3. **Commit identity** (required before first commit):

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

   Use **two dashes**: `--global`, not `global`.

4. **Push upstream** (no space between `-` and `u`):

   ```bash
   git push -u origin main
   ```

5. **Remote URL** must match your real GitHub username and repo name. Verify in browser: `https://github.com/YOURUSER/YOURREPO` should load (not 404).

---

## Vercel deployment

1. Push the repo to GitHub.
2. [vercel.com](https://vercel.com) → sign up with GitHub → **Import** the project.
3. **Install** the GitHub app when prompted so Vercel can list repositories.
4. Framework: **Next.js**; root directory: repo root (where `package.json` is).
5. Build: `npm run build` (default). Deploy.

No end-user accounts are required for deploy — only your GitHub + Vercel logins.

---

## PWA verification (Chrome)

- **DevTools** → right-click page → **Inspect**, or menu → More tools → **Developer tools**.
- **Application** → **Manifest** — confirm `manifest.webmanifest` loads.
- **Application** → **Service workers** — confirm `sw.js` is registered and active after a normal load.
- **Network** → **Offline** → reload — page should still load after the SW has cached the shell/assets.

**Console noise:** If you see `runtime.lastError` / extension-related messages in a normal window but **not** in **Incognito**, they are often from **browser extensions**, not this app.

**Stale build / chunk 500:** If `/_next/static/chunks/...` returns 500, stop the server, run `npm run build`, restart `next start`, clear site data for that origin, hard refresh (`Ctrl+Shift+R`).

---

## TypeScript / React note

- If you see: `'React' refers to a UMD global...` — often from using `React.ReactNode` without importing `React`. Prefer:

  ```ts
  import type { ReactNode } from "react";
  // children: ReactNode
  ```

---

## Planned next steps (product)

To make the app **fully functional** beyond the mock UI:

1. **Persistence** — database (e.g. Vercel Postgres, Supabase) for messages and generated drafts.
2. **API routes** — e.g. SMS webhook (`POST`) when a provider is chosen; `GET` for dashboard data.
3. **Generation** — server-side call to chosen LLM or rules; never expose API keys in the browser.
4. **Multi-tenant** — subdomain or path; per-tenant branding (name, colors, logo, optional tone) in DB.
5. **Simple admin UI** — edit tenant settings; add real auth when ready.

**SMS provider and LLM/privacy** were TBD in the thread; they can follow after the data model and API exist.

---

## Preserving chat / context

Cursor usually keeps chat history per project, but **do not rely on it** after crashes. Keep this file and a short `DECISIONS.md` or session log in the repo for anything you need long-term.

---

*Generated as a recap of the SMS Repurposer development thread. Update this file as the project evolves.*
