# Portfolio Project Context

This steering file preserves the history and decisions for Benedict John Lazo's QA Engineer
portfolio site so context carries across chat sessions.

## Project overview

A single-page personal portfolio website for a QA Automation Engineer, built from the owner's
CV. Static site (HTML/CSS/JS), deployed to GitHub Pages.

- Live URL: https://supcalli.github.io
- Repo: https://github.com/SupCalli/supcalli.github.io
- Local dev: `python -m http.server 8777` then open http://localhost:8777

## Owner details (used across the site)

- Name: Benedict John Lazo
- Role: QA Automation Engineer / Software Test Engineer
- Location: Manila, Philippines
- Email: benzrodrigo07@gmail.com
- Phone: 0966 997 8081 (intl tel: +639669978081)
- LinkedIn: https://www.linkedin.com/in/benedict-lazo-40b88422a/
- GitHub: https://github.com/SupCalli

## File structure

- `index.html` — all markup, single page
- `styles.css` — all styles; theming via CSS variables on :root and :root[data-theme="light"]
- `script.js` — all interactions
- `assets/benedict.jpg` — hero portrait (renamed from the original long filename)
- `assets/favicon.svg` — branded "BJL" favicon
- `Benedict_John_Lazo_QA_Engineer_CV.pdf` — downloadable CV (linked from hero)
- `robots.txt`, `sitemap.xml` — SEO
- `googled86b70c088913896.html` — Google Search Console verification file. DO NOT DELETE
  (Google re-checks it; removing it loses verification).

## Sections (in order)

1. Hero — photo in 3D tilt frame with glow/ring, floating badges, typing effect, particle canvas
2. Tech marquee — infinite scrolling band of technologies
3. About (01) — intro + count-up stat cards
4. Skills (02) — card grid (kept as a scannable grid on purpose; owner asked about a marquee
   but we decided scannability matters more here) + the Robot Framework test console
5. Experience (03) — timeline with animated dots, current role pulses
6. Projects (04) — academic projects (NOTE: still a gap — see "recommended next steps")
7. Education (05)
8. Interests (06) — "Beyond the code": 6 cards (Day Trading, Calisthenics, Reading,
   Continuous Learning, Adventure & Travel, Nature Therapy) in a right-to-left marquee that
   pauses on hover and collapses to a static grid for reduced motion
9. Contact (07) — two columns: contact details + working message form

## Key features implemented

- Animations: intro loader (BJL logo draws in), particle constellation hero canvas,
  typing effect, scroll-reveal (data-reveal / data-reveal-group), word-by-word heading reveal,
  marquees, magnetic buttons, cursor spotlight glow, scroll progress bar, count-up stats.
  All respect `prefers-reduced-motion`.
- Live test console (in Skills): animated Robot Framework output. Types
  `robot --outputdir results tests/`, streams an "E-Commerce" suite with `| PASS |` rows and a
  summary, loops. Starts on scroll into view. Test names are PLACEHOLDERS — owner may want to
  swap for real suite names.
- Light/dark theme toggle (nav): sun/moon icons, saved to localStorage, defaults to system
  preference, applied pre-paint via inline head script to avoid flash. Particle color adapts.
- Contact form: posts to Formspree endpoint https://formspree.io/f/maeepqea with fetch,
  validation, loading state, success/error messages. Falls back to mailto if endpoint missing.
  Tested working end-to-end.

## SEO / Search Console status

- Added: JSON-LD Person schema, meta description/keywords (name variations), canonical,
  Open Graph + Twitter tags with absolute image URLs, theme-color, robots.txt, sitemap.xml.
- Google Search Console: property verified (HTML file method), sitemap submitted.
- Realistic goal: rank for the owner's NAME ("Benedict Lazo", "Benedict John Lazo portfolio").
  "QA engineer" alone is not a realistic target (dominated by job boards).
- Indexing takes days to ~2 weeks. Check progress with `site:supcalli.github.io` on Google.

## Deployment workflow

Any change goes live via:
```
git add .
git commit -m "message"
git push
```
GitHub Pages redeploys in 1-2 minutes. Git identity is set to
Benedict John Lazo <benzrodrigo07@gmail.com> for this repo.

## Design conventions

- Dark theme default palette: bg #0b0f14, accent teal #4fd1c5, secondary blue #6ea8fe.
- Light theme uses deeper teal #0d9488 / blue #2563eb so the accent stays readable.
- Fonts: Inter (body), JetBrains Mono (code/mono accents).
- Keep motion tasteful; avoid piling on more effects — the owner and assistant agreed the site
  is visually "done."

## Recommended next steps (not yet done)

These are the high-value items that matter more than more features/animation:

1. Add a REAL automation project — a public GitHub repo with a Playwright or Robot Framework
   suite, linked from the Projects section. Biggest remaining gap for a QA role.
2. Add impact/metrics to experience bullets (e.g. "migrated X pipelines", "automated Y test
   cases", "cut regression runtime by ~Z%").
3. Add portfolio link to LinkedIn (Contact info + Featured) and GitHub profile — also helps
   Google discover/rank the site faster.
4. Create a proper OG preview image (1200×630) instead of using the tall portrait.
5. Optional polish: copy-to-clipboard on email, smooth color fade on theme switch, Lighthouse pass.

## Portfolio projects to build (globally marketable QA automation)

Goal: replace the academic projects in the Projects section with real, public GitHub repos
that prove in-demand QA automation skills. Three focused repos with great READMEs beat many
half-finished ones. Each repo must have: a clear README (what it tests, how to run, a results
screenshot, CI badge), clean structure (Page Object Model, no hard-coded waits, reusable
fixtures), CI running and visibly green, and a short "what I learned / would improve" note.

### Tier 1 — build these first (cover ~80% of what recruiters check)
1. UI E2E framework — Playwright + TypeScript. Test a public demo site (saucedemo.com or
   automationexercise.com): login, cart, checkout, negative cases. Show Page Object Model,
   fixtures, multi-browser config, screenshots/trace on failure. HIGHEST-DEMAND sample.
2. API testing suite — test a public API (restful-booker, reqres.in): CRUD, status/schema
   validation, auth, data-driven tests. Playwright API testing OR Python + pytest + requests.
3. CI/CD pipeline — add GitHub Actions to the above repos: run tests on push, publish HTML
   report, show green badge in README. Leverages owner's Jenkins/GitLab experience.

### Tier 2 — make you stand out
4. BDD framework — Robot Framework or Cucumber/Gherkin, readable Given/When/Then. Plays to
   owner's current Robot Framework experience at Infor.
5. Performance testing starter — k6 or JMeter load test against a public API + short write-up.
6. Visual regression or accessibility testing — Playwright screenshot comparison, or axe-core.

### Tier 3 — advanced / senior signal (only after Tier 1-2 solid)
7. Contract testing (Pact), Docker-containerized test runs, or a test-data generation utility.

### Recommended starting point for Benedict
Start with #1 (Playwright + TypeScript E2E) + #3 (GitHub Actions), then add #2 (API) as a
second repo. This combo is the most universally recognized proof for a mid-level QA automation
role and complements the Robot Framework work experience (framework variety reads well).
Alternatively lead with Robot Framework (#4) since it's closest to the day job at Infor.

Kiro can scaffold any of these on request (e.g. a Playwright + TS framework testing
saucedemo.com with POM, a GitHub Actions workflow, and a recruiter-ready README), then link it
from the Projects section of the portfolio.

## Working notes

- Shell is PowerShell on Windows (even though labeled bash). Use `;` not `&&`.
- Verified changes in-browser via Playwright + a local `python -m http.server` during the build.
- pypdf was installed to extract the CV text originally.
