# Proposed: content as JSON

Status: **designed, not yet migrated.** This document is the plan. `index.html` is still
the source of truth today.

## Why move

The current model is *English HTML is the truth, Swedish is an overlay keyed by English text*.
It works, and it degrades gracefully — an unmatched key just stays English. But it has three
real problems that get worse as the handbook grows:

1. **Silent drift.** Fix a typo in an English sentence and its Swedish translation orphans
   itself. Nothing errors; the paragraph just quietly stops translating. With ~500 strings
   across 12 sections, you will not notice.
2. **Context collision.** The key *is* the text, so `"Why?"` in the ethics diagram and
   `"Why?"` in the five-principles diagram are forced to share one translation. Today there
   are 5 duplicated labels; that number only grows. (Diagram labels are now exempt — see below.)
3. **One source, three consumers.** The quiz and the flashcards both want the same
   term/definition pairs that are currently locked inside `<table>` markup in `index.html`.
   Parsing HTML to build a flashcard deck is the wrong direction of travel.

## Already fixed: diagram labels

SVG `<text>` nodes now carry a stable `data-t="dN.i"` id, and `app.js` prefers that over the
text key. Diagram labels therefore survive an English rewrite, and identical words in
different diagrams can take different Swedish. 26 labels were re-keyed. This is the same
principle the full migration applies to everything else.

**Note for whoever does the migration:** Swedish runs roughly 10% longer than English and SVG
text is absolutely positioned, so translated labels can overflow their boxes. JSON does not
fix this. Either budget the box widths for the longer language, or add
`textLength`/`lengthAdjust` on tight labels.

## Schema

```jsonc
{
  "meta": { "title": { "en": "VU1 Field Handbook", "sv": "VU1 Fälthandbok" } },
  "sections": [
    {
      "id": "s02b",
      "num": "02b",
      "title":  { "en": "Principles of intervention", "sv": "Principer för ingripande" },
      "lede":   { "en": "…", "sv": "…" },
      "hours":  "~16 h",
      "blocks": [
        { "type": "p", "id": "b1", "text": { "en": "…", "sv": "…" } },

        { "type": "callout", "id": "b2", "variant": "idea",
          "label": { "en": "Say it as five short questions", "sv": "Säg det som fem korta frågor" },
          "text":  { "en": "…", "sv": "…" } },

        { "type": "table", "id": "b3",
          "head": [ { "en": "Princip", "sv": "Princip" }, { "en": "The question", "sv": "Frågan" } ],
          "rows": [ [ { "en": "Legalitetsprincipen", "sv": "Legalitetsprincipen" },
                      { "en": "May I?", "sv": "Får jag?" } ] ] },

        { "type": "list", "id": "b4", "ordered": false,
          "items": [ { "en": "…", "sv": "…" } ] },

        { "type": "figure", "id": "d7", "svg": "diagrams/five-principles.svg",
          "caption": { "en": "…", "sv": "…" },
          "labels": { "d7.1": { "en": "May I?", "sv": "Får jag?" } } },

        { "type": "qa", "id": "q1",
          "q": { "en": "Which law contains envarsgripande?", "sv": "Vilken lag innehåller envarsgripande?" },
          "a": { "en": "…", "sv": "…" },
          "choices": [ "Rättegångsbalken", "Brottsbalken", "Polislagen", "Regeringsformen" ],
          "correct": 0,
          "tags": ["s02a", "envarsgripande", "high-yield"] }
      ]
    }
  ]
}
```

Notes on the design:

- **Every translatable value is an object keyed by language.** English and Swedish sit
  together, so editing one without the other is visible in the diff. Adding a third language
  later costs nothing structurally.
- **Stable `id` per block.** Never derived from content. This is the whole point.
- **`qa` blocks live inside their section**, tagged, not in a separate quiz file. The quiz
  then *queries* the content (`blocks.filter(b => b.type === 'qa')`) rather than duplicating it,
  so a question can never drift out of sync with the section that teaches it. Same for
  flashcards: generate them from `table` blocks tagged `"glossary"`.
- **Diagrams stay as real SVG files**, not JSON-described geometry. Only their labels are
  data. Describing bespoke diagram geometry in JSON is a trap — it is harder to author than
  SVG and produces worse diagrams.

## Migration plan

1. Write `tools/extract.js` (Node, no deps) that parses the current `index.html` and emits
   `content.json` with `en` filled and `sv` pulled across from `assets/i18n.sv.js` where a
   key matches. Assign block ids sequentially per section.
2. **Check in the generated JSON and eyeball it.** Expect the extractor to get tables and
   callouts right and to need hand-fixing on the figure blocks.
3. Write `assets/render.js` — a small template function per block type. This is roughly
   150 lines; there is no need for a framework.
4. `index.html` becomes a shell: `<head>`, sidebar, empty `<main>`, script tags.
5. Delete `assets/i18n.sv.js` once `content.json` is authoritative.

## The one real cost

**A JSON-driven page renders nothing without JavaScript**, where today the HTML is readable
even if scripts fail. For a study aid you will read on a phone on a train, that matters.

Mitigations, in order of preference:

- Keep `content.json` loaded via a `.js` wrapper (`window.CONTENT = {…}`) rather than
  `fetch()`, so the site still works from `file://` — no web server needed, works offline.
- Add a build step later that pre-renders `content.json` to static HTML for GitHub Pages,
  giving you both. Only worth it if the site grows.
- Do **not** switch to `fetch()` + a dev server. It breaks the "open the file on my phone
  and read it" property, which is the main way this handbook actually gets used.
