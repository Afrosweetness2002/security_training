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

**Statute auto-linking + law lookup popover:** any `<code>BrB 24:1</code>`-style reference
anywhere in the handbook automatically links to its entry in the Laws glossary
(`linkStatutes()` in `assets/app.js`, matched by a slugified id, e.g. `#law-brb-24-1` —
`LAWRE` currently matches `BrB`, `RB`, `RF`, `PL`, `FAP`, `LUL` prefixes). Clicking one opens
`#lawcard`, a popover showing that entry in place — no navigation, nothing lost. It reads the
glossary `<tr>`'s content live (single source of truth, correctly bilingual for free); "Open
full Laws page →" inside the card is the explicit fallback to `showView('laws')` +
`scrollIntoView` for browsing the whole glossary. `linkStatutes()` re-runs after every
`setLang()` call, since Swedish translations in `i18n.sv.js` hardcode plain `<code>` markup
that would otherwise wipe a link wrapper applied only once at load. New glossary rows just
need a matching `id="law-..."` — no need to hand-link existing `<code>` refs sitewide, and no
need to touch `openLawCard()`/`closeLawCard()`.

**Recently added, in order:**
-5. **Days 2–5 lecture content** — AF fed in four days of raw personal notes (nödvärn/nöd/envarsgripande fundamentals and the five principles — already covered, so skipped; bevakningstyper, LAS employment law, alarm systems, radio protocol — all new) and asked for it folded into the handbook, bilingual. New: **§03** gained an "Employment terms" subsection (anställningsformer incl. behovsanställning's 9-month fixed-hours rule, uppsägning/avsked table with real LAS notice-period scaling, the kollektivavtal pay table Nyanställd→E); **§04** gained stationär-vs-ronderande, rond types (A/B/C/Y), the rapportering 5W1H table, full alarm-response classification (A/B-klassat) + the ten-step larmutryckning procedure (including the lecturer's fax-machine anecdote), radio protocol (Tänk·Tryck·Tala, KOM, Klart slut), uniform/ID, and the further-training table (butikskontrollant, värdetransportör, etc.); **§05** gained alarm-coverage types (skalskydd/volym/punkt/försåt), a full larmgivare/detektor table (magnetkontakt through kombinationsdetektor), centralapparat/larmöverföring, FBK/MAP, and a larmläggning symbol legend keyed off two lecture-slide photos AF shared; **§02a** gained a short `BrB 24:5` (hjälper annan) subsection; the **Laws page** gained an "Elements of a crime" table (stöld/skadegörelse/bedrägeri broken into ta/från/med uppsåt/utan lov, with the ringa-threshold caveat) and a PL 19 §-vs-RB 27:4 don't-mix-them-up callout. Three new glossary rows (42 total): `BrB 24:5`, `BrB 9:1` bedrägeri, `BrB 9:2` ringa bedrägeri — added to `data/laws.json` too; `node tools/check-law-sources.js` passes (42/42). BrB 24:5's substance and the LAS/bedrägeri penalty figures were corroborated via web search and secondary legal-summary sites (lawline.se, kollpalagen.se, straffbart.se) rather than a direct verified fetch of the primary lagen.nu/riksdagen.se paragraph text — flagged in each `laws.json` entry's `note` field for a follow-up primary-source pass. Fully translated to Swedish in the same pass (`node tools/verify-tranche.js` clean on all four touched sections, aside from expected false-positive flags on already-Swedish alarm-code labels like "A-rond").
-4. **lagen.nu verification pass + `data/laws.json` + per-row source links** — AF flagged that
    some glossary entries were inaccurate and asked for lagen.nu (which mirrors the official
    riksdagen.se text) as the source of record, the underlying Swedish law text captured in
    JSON, and every glossary row linked to its actual source document. Two parallel research
    passes (BrB rows vs. everything else) plus a manual follow-up for `BrB 3:5`/`3:6` (missed
    from the initial scope) fetched lagen.nu/riksdagen.se for all 39 rows. New file
    `data/laws.json` holds one entry per row (`id`, `code`, `act`/`sfs`, `ref`, `sv_lagtext`,
    `sources.lagen_nu`/`riksdagen`, `verified` date, `note`) — a verified source-of-record and
    seed for quiz/flashcards, not something the page fetches at runtime (this repo still
    renders from static HTML, per the `CONTENT_SCHEMA.md` deferral). Every glossary row's Code
    cell now carries a small `↗` link (`a.lawsrc`, styled in `styles.css`) straight to its
    lagen.nu chapter/paragraf anchor — additive markup only, so `openLawCard()`'s
    `td:nth-child(2/3)` reads needed no change. Real errors caught and fixed (English +
    Swedish): `BrB 25:3` penningböter was stated as 100–2 000 kr, actually 200–4 000 kr;
    `BrB 8:5` rån minimum was stated as 1 year, actually 1 y 6 m; `BrB 3:6` grov misshandel
    max was stated as 7 years, actually 6 (a separate reform proposes sharpening ~50 penalty
    scales, targeting 2026-08-01 — flagged, not assumed); `BrB 5:1`'s "grovt förtal" penalty
    actually belongs to `BrB 5:2`; `BrB 12:2` was labelled "Åverkan", an obsolete term — now
    "Ringa skadegörelse"; `PL 29 §` was described as extending to ordningsvakter — it actually
    covers Försvarsmakten guard posts, and ordningsvakter's real basis since 2024-01-01 is
    `Lag (2023:421) om ordningsvakter`; `HL 4:10`'s extension to a fresh `RB 24:7` arrest
    actually runs through `FAP 573-1` 9 kap. 1 §, not Häkteslagen's own text; laga självtäkt's
    24-hour callout now notes that reclaiming property past the window can itself be
    `BrB 8:8` egenmäktigt förfarande. The `BrB 23 kap.` liability-expansion reform, previously
    flagged as merely proposed, is confirmed in force (23:1 since 2026-04-01, 23:2/23:4 since
    2026-07-01) — wording updated from "verify" to "in force" throughout. New
    `tools/check-law-sources.js` (same throwaway-but-reusable spirit as `extract-keys.js`/
    `verify-tranche.js`) cross-checks every glossary row against `data/laws.json` — run
    `node tools/check-law-sources.js` after touching either.
-3. **Law-lookup popover fix + 5 new glossary rows (39 total)** — `openLawCard()` only ever
    rendered one table column (`td:nth-child(2)`, "What it covers"); the Example column was
    never read at all, which is what looked like "only shows an example" / "still English"
    to a user, since a field that's never rendered can't show a translation either. Now
    renders both, each under a label (`.lawcard-label`) tracked through a new `curLang`
    module var since `#lawcard` sits outside `<main>` and isn't covered by the generic
    translation pass. Also: `slugify()` stripped no diacritics, so a Swedish phrase like
    `Laga självtäkt` could never resolve to its own `id="law-laga-sjalvtakt"` — fixed via
    NFD-normalize + strip combining marks (`String.fromCharCode` range, not a literal
    regex range, to dodge shell/JS re-escaping of `̀`); `LAWRE` extended to allow it as
    a linkable phrase alongside the statute-prefix codes. Found (via a script diffing every
    `<code>` ref's slug against every glossary id) five more dead refs with no glossary
    row at all — `BrB 26 kap.`, `BrB 25:2`, `BrB 25:3`, `BrB 23 kap.`, `PL 29 §` — added as
    rows 35–39, fully translated. Added a source-check line above the glossary linking to
    riksdagen.se/lagen.nu. Verified end-to-end with a jsdom harness that actually loads
    `index.html` + `app.js` + `i18n.sv.js` and drives clicks/lang-toggle, since no
    chromium-cli/Playwright browser was available in this environment — `tools/` doesn't
    have this harness checked in; recreate ad hoc if verifying similar changes again.
-2. **Straff detail + three new powers** — a straff-minimum explainer (general fängelse
    minimum raised 14 days → 1 month on 2026-01-01, the biggest penalty-system reform since
    Brottsbalken; böter minimums: 750 kr dagsböter floor, ~100–2 000 kr penningböter); the
    crimes-relevant-to-the-job table split into Straff/Minimum/Maximum columns; two new
    subsections — `PL 10 §` use-of-force (passivt vs aktivt motstånd, only aktivt justifies
    force) plus `HL 4:10` handfängsel (extends Häkteslagen's cuffing rule to a fresh `RB 24:7`
    arrest), and **laga självtäkt** (reclaiming stolen goods within 24 h of the theft — a
    separate power from nödvärn/envarsgripande, tied back into the cashier/CCTV case study in
    §02b). An Example column added across both the crimes table and the full statute glossary
    (33 rows now, up from 30); `Uppenbar`/`Försvarlig` word-definitions added next to nödvärn
    in §02a. Sourced from AF's lecture notes plus web research (`riksdagen.se`, `lagen.nu`,
    `regeringen.se`) for the 2026 penalty-reform figures and the PL 10/HL 4:10/laga självtäkt
    detail — flagged for compendium verification, especially the 2026 böter figures and the
    PL 10 väktare-vs-ordningsvakt scope distinction. Fully translated to Swedish in the same
    pass. `HL` added to `app.js`'s statute auto-link prefix list. Adding the Example column
    broke the law-lookup popover (`openLawCard()` read `td:last-child`, which the Example
    column now is instead of "What it covers") — fixed to `td:nth-child(2)`; caught via a
    Playwright pass through the rendered page, not just the translation-coverage script.
    Also fixed two long-standing dead statute refs found the same way: `BrB Ch. 17` (§02a,
    guard-on-duty protection) didn't match the glossary's `BrB 17 kap.` slug, and `BrB Ch. 4`
    (§02a "get it wrong" callout + §12 Q13) wasn't even wrapped in `<code>` so it was never
    clickable — retitled to the actual provision, `BrB 4:2` (olaga frihetsberövande, fängelse
    1–10 years / mindre grovt böter or ≤ 2 years), and added as glossary row 34.
-1. **Laws content expansion** — participation in a crime (`BrB 23:4`: gärningsman,
    medgärningsman, anstiftare, medhjälpare); a penalty-range table for violence and
    theft/robbery (misshandel → grovt rån) framed explicitly around `RB 24:7`'s gate 1
    ("fängelse i straffskalan?" — is prison even possible for this crime); the six crimes
    taught as citizen's-arrest exceptions despite sometimes meeting the two gates on paper
    (åverkan, olaga intrång, hemfridsbrott, förtal, förolämpning, förargelseväckande
    beteende), flagged since the reasoning isn't a clean "no fängelse" rule and hemfridsbrott/
    olaga intrång's penalty scale changed in 2022; `LUL 35 §` for apprehending an offender
    under 15 (no handcuffs — no legal basis for coercion against a child that age); `RB 27:4`
    beslag. 15 new glossary rows (30 total, now 33 — see the newer entry above). Sourced from AF's lecture notes plus web research
    against `riksdagen.se`/`lagen.nu`-adjacent sources for the specific penalty ranges — still
    flagged for compendium verification per the accuracy bar, especially the six-exception
    reasoning and exactly which crimes carry a förberedelse clause.
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

Toggle machinery is done and working. **All 12 sections + the Laws view translated** (638
strings and growing as Laws content is added), tracked
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
