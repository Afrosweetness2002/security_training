# VU1 Handbook — project handover

## What this is

An English-language study handbook for **VU1 (Väktargrundutbildning del 1)**, the first
Swedish security-guard course, run through Väktarskolan. The user (AF) is taking the course
and building this as he goes, feeding in what the lecturer says session by session.

The deliverable is a static site (`index.html` + `assets/`) intended for GitHub Pages.

## The throughline

Every section ties back to one idea, and it should stay visible in anything added later:

> **A väktare has no police powers.** Authority = the rights any citizen (*envar*) already
> has, exercised with training, inside the assignment, under FAP 573-1.

## House style

- **Plain English, Swedish key terms kept alongside** — never drop the Swedish word; it's
  what the exam uses.
- Structure mirrors the 12 course subject areas, `01`–`12`. §02 is split: **02a** = the powers
  (nödvärn, nöd, envarsgripande), **02b** = the principles that govern using them.
- Callouts: 💡 key idea (`.cal.idea`) · ⚠️ warning (`.cal.warn`) · ✅ remember (`.cal.rem`).
  Each opens with `<span class="lab">Label</span> — `.
- Statute refs as inline code: `BrB 24:1`, `RB 24:7`, `RF 1:9`, `PL 19 §`. These auto-link to
  the Laws glossary (see below) — add a matching `id="law-..."` row there for any new code.
- Diagrams are **hand-written inline SVG** using CSS variables (`var(--accent)`, `var(--ink)`,
  `var(--warn)`…) so they work in light mode, dark mode and print. Do not introduce an image
  file or a charting library.
- Tone: direct, concrete, exam-focused. Worked examples beat abstract definitions. The
  lecturer's own examples are kept verbatim wherever possible — they're the ones that stick.

## Accuracy bar

Verify against sources: law → Brottsbalken / Rättegångsbalken / Regeringsformen; CPR →
Svenska HLR-rådet; fire → SS-EN3. It is a study aid — defer to the instructor's compendium
for anything examined, and say so where a point is contested or where a väktare's powers are
narrower than the police's.

## Where the content lives

- **Source of truth: this repo.** `index.html` is edited directly.
- A **Notion page** ("Documentation", id `3a3824d2dbd980e4a6a3c666347a6f67`, under parent
  "Security Training With Väktarskolan") holds an earlier copy. It is **several revisions
  behind** — it has §01–§12 including the five principles and the full §07 ethics section,
  but **not** the tvång material, the ändamål/PL 19 material, the cashier case study, or the
  02a/02b split. Decide whether to re-sync it or retire it.
- Notion quirk if you do sync: adjacent tables merge into one. Separate them with a heading.

## Current state

**Complete:** all 12 Learning sections + a Laws reference section. 14 inline SVG diagrams.
13-question self-test. Auto-generated nested sidebar with scrollspy, scoped to whichever
view is active. Section filter. Light/dark. Print stylesheet. Mobile drawer nav.

**Site structure — view switcher (added for the Laws section, reused by Quiz/Flashcards
later):** the page is no longer one continuous scroll. `index.html`'s `<main>` holds two
sibling `<div class="view">` containers — `#view-learning` (the original §top + 12 sections)
and `#view-laws` (new) — toggled via `#viewbar` buttons in the sidebar (`showView()` in
`assets/app.js`). Only one is visible (`hidden` attribute) at a time; switching doesn't
require scrolling past the other. `buildTOC()`, the search filter, and scrollspy are all
scoped to `activeView()` rather than the whole `<main>`. When Quiz (#2) and Flashcards (#3)
get built, they become additional `.view` containers + viewbar buttons — no rework of this
plumbing needed.

**Statute auto-linking:** any `<code>BrB 24:1</code>`-style reference anywhere in the
handbook automatically links to its entry in the Laws glossary (`linkStatutes()` in
`assets/app.js`, matched by a slugified id, e.g. `#law-brb-24-1`). Clicking one switches to
the Laws view and scrolls to the entry. This re-runs after every `setLang()` call, since
Swedish translations in `i18n.sv.js` hardcode plain `<code>` markup that would otherwise wipe
a link wrapper applied only once at load. New glossary rows just need a matching `id="law-..."`
— no need to hand-link existing `<code>` refs sitewide.

**Recently added, in order:**
0. **Laws reference section** (§ below the 12 numbered sections, own view) — brott/straff,
   uppsåt vs oaktsamhet, the förberedelse → försök → fullbordan crime stages, and a statute
   glossary seeded from every code already referenced elsewhere in the handbook. Flags a
   pending 2026 legislative change to försök/förberedelse/stämpling liability as unverified —
   check the current `BrB 23 kap.` text and the instructor's compendium. The crime-by-crime
   list of what's punishable at each stage is still pending (AF is compiling it) — tracked at
   [issue #4](https://github.com/Afrosweetness2002/security_training/issues/4), left open.
1. §07 professional ethics expanded — etik/moral/socialt styrda regler, three kinds of rules,
   the three etiska modeller (sinnelagsetik / konsekvensetik / pliktetik) with the lecturer's
   apple and speed-camera examples, six-question dilemma walkthrough.
2. §02b five principles — legalitet, ändamål, behov, proportionalitet, objektivitet.
3. "Does the order matter?" — the lecturer's correction that **objektivitet is not step five**;
   it runs before, during and after (the officer was being objective when deciding whether to
   pull the car over at all). Diagram reflects this: four sequential gates over a continuous
   objectivity band.
4. Legalitetsprincipen in depth + **tvång** — direkt vs indirekt coercion, the three things
   that are *not* a legal basis (client's wishes, bevakningsinstruktion, analogy).
5. Ändamålsprincipen in depth — `PL 19 §` skyddsvisitation, the stolen-pen example
   (searching for evidence under a safety power = wrong purpose).
6. Case study — "the cashier who was sure": witness certainty ≠ objective knowledge; questioning
   as indirekt tvång; and why the guard still cannot seize the man when he returns
   (identification is police work, and `RB 24:7` needs bar gärning/flyende fot).

## Swedish translation — complete

Toggle machinery is done and working. **All 12 sections translated** (453 strings), tracked
as [GitHub issue #1](https://github.com/Afrosweetness2002/security_training/issues/1) — now
closed. `#svnote` no longer needs a per-tranche list.

`div.ans` (the self-test answer text) was missing from `app.js`'s translatable-node selector
until this pass — the 13 `<summary>` questions were already covered, but the answers weren't.
Fixed by adding `div.ans` to `SEL` in `assets/app.js`.

If more lecture content gets added later and needs translating: add entries to
`assets/i18n.sv.js`. The key is the element's visible text with
whitespace collapsed and tags stripped; the value is the Swedish `innerHTML` (keep
`<span class="lab">`, `<strong>`, `<code>` markup). Verify hit-rate before committing —
a mistyped key silently leaves the element in English.

Two throwaway (but reusable) Node scripts in `tools/` help with this: `extract-keys.js s0Xx`
prints every leaf-element key and diagram `data-t` label for a section, straight off
`index.html`, so you're translating exact text rather than hand-transcribing it (HTML
entities included — easy to get wrong by hand). `verify-tranche.js s0Xx` then checks the
opposite direction: every prose/diagram key in that section has a matching `assets/i18n.sv.js`
entry, and flags orphaned `dN.*` keys that don't match any element in the section. Run both
from the repo root (`node tools/extract-keys.js s02b`). Not every English string needs an
entry — skip ones already fully in Swedish (e.g. "Legalitetsprincipen", "Direkt tvång"); the
scripts don't know that distinction, so a few false positives on already-Swedish diagram
labels are expected and fine.

## Architecture — pending decision

`CONTENT_SCHEMA.md` designs a migration from "HTML + keyed translation overlay" to a single
`content.json` where English and Swedish sit side by side, and the quiz and flashcards are
generated from the same data rather than duplicating it. **Read that file before adding new
features** — building the quiz against the current HTML would mean migrating it twice.

Partially done already: SVG diagram labels now use stable `data-t="dN.i"` keys instead of
being keyed by their English text, so they survive an English rewrite. 26 labels re-keyed.

## Planned next

Tracked as GitHub issues on the repo now — Swedish translation (#1) is done and closed.

0. **[Laws — crime-by-crime list](https://github.com/Afrosweetness2002/security_training/issues/4)**
   — the framework, general concepts, and glossary are done; still open pending AF's specific
   list of which crimes punish förberedelse/försök and at what penalty.
1. **[Quiz](https://github.com/Afrosweetness2002/security_training/issues/2)** —
   **fully Swedish** (not the bilingual toggle pattern), multiple choice + typed-answer modes.
   The 13 existing self-test Q&As in §12 convert directly; need plausible Swedish distractors.
   Store in `data/quiz.json`.
2. **[Flashcards](https://github.com/Afrosweetness2002/security_training/issues/3)** —
   **fully Swedish** term/definition pairs for memorisation. The definition tables in §01,
   §02a, §03 and §04 contain these pairs; `assets/i18n.sv.js` is effectively an EN↔SV term
   database to seed from. Store in `data/flashcards.json`.
3. **content.json migration** (see `CONTENT_SCHEMA.md`) — considered and deliberately
   deferred. At current size the real problems it solves (translation drift, quiz/flashcards
   duplicating section content) have cheaper fixes: `tools/extract-keys.js` +
   `tools/verify-tranche.js` catch drift already, and scoped extraction scripts can seed the
   quiz/flashcards from `index.html` without a full render-pipeline rewrite. The migration
   would also mean the page renders nothing without JS, a regression for a handbook read
   offline on a phone. Revisit only if drift or duplication actually becomes painful.
4. Deploy to GitHub Pages.

## Working notes

- AF prefers concise, direct responses — minimal preamble, no restating what he just said.
- He is feeding in lecture content as it happens; expect raw, partly-Swedish notes to be
  turned into handbook sections. Ask what the lecturer's own examples were; keep them.
- He pushes back well and corrects errors (see item 3 above) — take the correction seriously
  and rework the model, don't just append a caveat.
