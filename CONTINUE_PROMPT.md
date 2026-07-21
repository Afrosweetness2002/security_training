# Prompts for Claude Code

## 1 · Kickoff — paste this first, once

I'm continuing an English-language study handbook for VU1 (Väktargrundutbildning del 1),
Sweden's basic security-guard course, run through Väktarskolan. I'm taking the course right
now, so this is a living document — I'll be feeding you lecture content as it happens, week
by week, and we'll fold it into the site as we go.

Read these before anything else:
- `HANDOVER.md` — context, house style, accuracy bar, current state, what's planned
- `CONTENT_SCHEMA.md` — a proposed migration to a single `content.json`
- skim `index.html` for the conventions in practice

Key constraints:
- Vanilla HTML/CSS/JS. No build step, no framework, no dependencies. Deployed to GitHub Pages.
- **It must keep working from `file://`** — I read this offline on my phone during the course.
  Never introduce anything that requires a dev server.
- Diagrams are hand-written inline SVG using the CSS variables so they work in light mode,
  dark mode and print. No image files, no chart library.
- Plain English with the Swedish terms kept alongside. Throughline: *a väktare has no police
  powers — authority = ordinary citizen rights, exercised with training, under FAP 573-1.*

Two things I want from you before any editing:

1. Your honest read on `CONTENT_SCHEMA.md`. Is the `content.json` migration worth doing at
   this size, or is it over-engineering? I want the real answer, not agreement. Bear in mind
   I'll be adding lecture material continuously, and a quiz and flashcards are planned.
2. Given that, what you'd tackle first: the migration, finishing the Swedish translation
   (§02b, then §03–06, then §07–12), the quiz, or the flashcards.

Don't start editing until I've picked.

---

## 2 · Lecture intake — paste this each time I bring new material

Here are my raw notes from today's lesson. They're rough, partly in Swedish, and may include
the lecturer's own examples and asides.

<paste notes here>

Work through this in order, and stop at step 3 for my input:

1. **Read it back to me** — tell me what you understand the concepts to be, in plain English,
   with the Swedish terms. If anything is ambiguous or looks garbled, ask. Don't guess at
   Swedish legal terminology; if you're unsure whether I meant *behovsprincipen* or
   *bevisprincipen*, ask.

2. **Check it against what's already in the handbook.** Say explicitly whether this material:
   - adds to something already covered,
   - *contradicts or corrects* something already written, or
   - is genuinely new.
   The contradiction case matters most. It has happened before — the handbook originally
   modelled the five principles as a linear sequence, and a lecturer correction revealed
   objektivitet actually runs before, during and after. That required reworking the model and
   the diagram, not appending a caveat. If new material breaks an existing explanation, say
   so plainly and propose the rework.

3. **Propose placement and format, then wait.** Which section, which subsection, and what
   shape: prose, definition table, callout (💡 key idea / ⚠️ warning / ✅ remember), a new SVG
   diagram, or a worked case study. Tell me what you'd cut or restructure to fit it in.
   Don't write yet.

4. Once I've approved, **write it** — and in the same pass:
   - keep the lecturer's own examples verbatim wherever possible; they're what I'll actually
     recall in the exam hall, and they're worth more than a cleaner generic example
   - add the Swedish alongside, not just the English
   - add any new statute refs as inline `<code>`
   - add a self-test Q&A for the new material
   - add any new term/definition pairs to the flashcard source
   - cross-link it to the sections it touches

5. **Verify before you tell me you're done**: tags balanced, every translation key matches a
   real element, no duplicate question numbers, the page still renders from `file://`, and the
   new diagram (if any) is readable in dark mode and doesn't overflow its box in Swedish —
   Swedish runs about 10% longer than English and SVG text is absolutely positioned.

Keep responses concise. Don't restate my notes back at length or explain what you're about
to do before doing it.

---

## 3 · One-off tasks

**Set up the repo and deploy:**
> Initialise this as a git repo, commit everything, create a public GitHub repo called
> `vu1-handbook`, push it, and enable GitHub Pages from the main branch root. Then give me
> the live URL.

**Migrate to content.json:**
> Do the migration described in CONTENT_SCHEMA.md. Write the extractor first and commit the
> generated JSON so I can review it before the renderer exists. Keep the site working from
> `file://` throughout — `window.CONTENT` wrapper, not `fetch()`.

**Continue the Swedish translation:**
> Continue with the next tranche (§02b). Add entries to the Swedish source, then verify every
> key matches a real element and report the hit rate — a mistyped key silently leaves the
> element in English. Update the `#svnote` banner to list the newly covered sections.

**Build the quiz:**
> Build the multiple-choice quiz. Distractors should be the mistakes a student would actually
> make — "Brottsbalken" for where envarsgripande lives, "uppenbart oförsvarlig" swapped onto
> nöd. Let me retry only the ones I got wrong. Questions should come from the same source as
> the section content, not a duplicate file.

**Build the flashcards:**
> Build flashcards from the definition tables — term on the front, plain-English meaning on
> the back, Swedish term always visible. Shuffle, touch-friendly flip, known/unknown marking
> kept in localStorage.
