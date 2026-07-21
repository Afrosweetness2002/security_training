# VU1 Field Handbook

A plain-English study companion to **VU1 — Väktargrundutbildning del 1**, Sweden's basic
security-guard course (Väktarskolan). Static site, no build step, no dependencies.

**Live:** _add your GitHub Pages URL here_

## Run it

Open `index.html` in a browser. That's it — everything works from `file://` as well as
from a web server, so there is nothing to install and nothing to compile.

## Deploy to GitHub Pages

1. Push this folder to a repository.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/` (or `/docs`).
3. `.nojekyll` is already present so `assets/` is served untouched.

## Layout

```
index.html            all content — 12 course sections, tables, callouts, inline SVG diagrams
assets/styles.css     design system (CSS variables), light + dark, mobile drawer, print styles
assets/app.js         nav generation, scrollspy, EN/SV toggle, mobile drawer, filter
assets/i18n.sv.js     Swedish strings, keyed by English text content
data/quiz.json        (empty) planned multiple-choice bank
data/flashcards.json  (empty) planned term/definition pairs
```

## How the Swedish toggle works

`app.js` walks every "leaf" text element (`p`, `li`, `td`, `h2`, `summary`, SVG `text`, …),
caches its English `innerHTML`, and builds a key from its normalised text content. Pressing
**SVENSKA** swaps in `window.SV[key]` where one exists.

Anything without a translation stays English rather than breaking, so the file is always
shippable mid-translation. To translate more, add entries to `assets/i18n.sv.js` — the key
must be the element's exact visible text with whitespace collapsed.

## Conventions

- Structure mirrors the 12 course subject areas, numbered `01`–`12` (§02 is split into
  `02a` powers / `02b` principles).
- Statute references use inline `<code>`: `BrB 24:1`, `RB 24:7`, `RF 2:10`.
- Swedish terms sit alongside the English in `<span class="sv">`.
- Callouts: `.cal.idea` 💡 key idea · `.cal.warn` ⚠️ warning · `.cal.rem` ✅ remember.
- Diagrams are hand-written inline SVG using the CSS variables, so they theme and print correctly.
  No image files, no chart library.

## Accuracy

Study aid, not legal or medical advice. Law follows Brottsbalken and Rättegångsbalken,
CPR follows Svenska HLR-rådet, fire follows SS-EN3. **Always defer to the current Swedish
texts, FAP 573-1, and the instructor's official compendium** — that is the examined material.
