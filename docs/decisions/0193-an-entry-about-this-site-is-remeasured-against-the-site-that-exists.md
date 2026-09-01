---
status: accepted
date: 2026-09-01
governs:
  - CLAUDE.md
confirmed-by: []
---

# An entry about this site is re-measured against the site that exists

## Context and Problem Statement

[ADR-0189](0189-the-site-is-what-a-reader-can-install-and-the-rest-is-served-as-data.md) took this
site from seventeen pages to seven and deleted seven page modules. `CLAUDE.md`'s open list is what
this repository reads to know what it has left to do, and its entries were written against the site
that stood before that.

**The trigger was one dead citation and the unit is not about it.** The entry *That a word this site
prints is a word a reader can read* measures fifteen hyphenations on `/method/`, says *all on that
page*, names `packages/site/methodology-page.ts` in its **Where this looked**, and closes on *17 pages
and 12 widths*. That module was deleted at `11e0f54`. An entry whose population a later unit removed
no longer says anything, and its green is not a green: it wears the shape of identified work waiting
to be done.

**A stale citation is the detectable half and it is the smaller one.** An entry can name a live file
and measure an object the redesign replaced — a population of three width conditions of which none
now exists, a closure declaring zero where a reader meets five. Nothing here reads an entry against
the thing it describes, and nothing can: an entry's population is a sentence.

## Decision Drivers

- **Rule 3 of the open list.** *An entry can be false without being stale.* The remedies written into
  that section are aimed at drift; an entry wrong on the day it was published looks no older for it.
- **A re-measurement is not a repair.** Mixing the two makes it impossible to say which of them moved
  a figure, so this unit measures and writes and changes no behaviour.
- **A dated figure in a record is not rewritten.** The treatment
  [ADR-0190](0190-the-name-comes-out-of-everywhere-a-digest-does-not-reach.md) gave ADR-0187's `185`
  and [ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) gave the
  head notes. `CLAUDE.md` is the current state and is updated.
- **A sweep that decides something declares the population it read and how.** ADR-0189's own lesson,
  applied here to a re-measurement rather than to a deletion.

## Considered Options

- **Re-read the entries that cite a deleted file.** One entry. It is the cheap half and it answers a
  fifteenth of the question.
- **Re-read every open entry.** Seventy entries, most of which have no connection to the site; a
  sweep whose answer is *unchanged* seventy times over is a reading nobody can check.
- **Re-read the entries whose population is the site, by a rule stated before the reading.** Taken.

## Decision Outcome

### The rule that defines the population

> **An entry belongs to this population when the population it declares cannot be enumerated without
> the site — a module under `packages/site/`, or the tree `packages/site/build.ts` emits.** The site
> being an entry's illustration, or its single instance, is not enough: the population sentence has to
> name a thing the site *is*.

The rule is written this way because the alternative — *does the entry mention the site* — returns
entries whose subject is a guard, a comment or a record and which the redesign cannot have touched.
Under it, `That the text of a guard is the text somebody wrote` is out although its found instance was
a site guard, and `That an address the emitted tree serves and no listing names goes on being written`
is in although its subject is a deployment, because its population is enumerated by walking what the
build wrote.

Applied over the open list — every list item of *What the repository declares and nothing keeps* from
the alias entry to the end of the section, which is **70 entries** at `ccc9fca` — it returns **15**.

### What the site is, at the coordinate everything below was read at

Measured at `ccc9fca`, tree clean, from `pnpm site:build`'s own count: **110 files — 7 pages, 7
markdown twins, 17 modules, 5 found by convention, 1 font, 73 answers**, and **8 files of HTML**,
the 404 being written by `thePublication` rather than by `theSite`. The live origin serves the same
commit: `contract-index` answers `servedFrom ccc9fcac36e8ca698ad7f43daa18fab07559561f` and its
sitemap names the same seven addresses this tree writes.

### The fifteen, and what each one is now

**Closed, on an empty population.** One.

`That a word this site prints is a word a reader can read`. Read by the entry's own criterion — a
line change falling between two alphanumerics — over `h1, h2, h3, h4, p, li` with `code` and `pre`
descendants excluded, character by character with a `Range`, over the **8 files of HTML** at 320,
390 and 1440, in Chrome through same-origin iframes, the first full sweep discarded:
**0, 0 and 0**. What removed the population is `11e0f54`, which deleted
`packages/site/methodology-page.ts`, the module carrying the schema paths in unmarked prose.

**The zero is perturbed rather than believed.** Putting a 53-character identifier back into one prose
paragraph of each page reddens **8 of 8** — the first witness reads `sDescripti|onAndTheRe`. A
comparison that returns zero and cannot return anything else is the decorative guard one floor down.

**And the class is not closed by the page having gone.** `overflow-wrap: anywhere` is declared on
`body`, so every page of this site can still break a word mid-word; what left is the matter, which was
schema paths written as prose. The entry's own proposed repair is therefore still refused for the
reason it gave, and there is nothing to apply it to.

**Not closed, and not what it says.** One, and it is the finding of the unit.

`That two things a reader sees side by side are told apart, where one of them is not an element`
declares **the population is now zero**. Measured at `ccc9fca` over the seven documents `theSite`
yields, by the guard's own loop with its `left.child.kind !== 'element'` line removed: **22 pairs
where one side is a text node and neither reading separates**, against **0** element-against-element,
which is the guard passing correctly.

**Five of the 22 are the defect the entry is about and seventeen are correct by construction.** The
seventeen are an address split for highlighting (`number/|parse` in an `h1`) and a `code` followed by
its punctuation (`toFixed|, which answers a string`), where the author writes the spacing into the
prose and is right to. The five are the shelf's domain filter, and the served Markdown twin of the
front page is what settles them:

```
- all6
- number2
- date1
- string2
- object1
```

A name and its count, told apart by CSS in the HTML and by nothing in the projection — at
`https://toopo.dev/index.md`, which is one of the seven twins this tree serves.

**They predate the sweep the entry cites, so the closure was false when it was written and not
merely stale.** `A_COUNT` entered `pill` at `fc70d3c` on 2026-08-30; the entry's coordinate `dd0effe`
is 2026-09-01, two commits before `11e0f54`; and `git show dd0effe:packages/site/front-page.ts`
carries `pill('all', installable, null)` and `pill(domain.name, domain.held.length, …)` already. The
sweep is not reproducible either, because **the entry states its verdict and not its rule** — which
is ADR-0189's own discipline, written for a probe that decides a deletion and not applied to one that
declares an emptiness.

**Two more clauses of that entry have been overtaken.** Its refusal rests on `Tag` having no `span`;
`span` joined the union at `fc70d3c`, so one of the two prices it refused has already been paid for
another reason. And its neighbour guard's comment declares that *with text nodes admitted the
predicate holds 53 pairs across the seven pages and 48 of them are ordinary inline markup* — **53
reproduces under none of four rules** at `ccc9fca`: every kind of pair with `pre` skipped is 22, with
`pre` admitted 570, element-against-element 0, one-side-text 22. The five sit in the remainder that
reading does not name.

**Narrowed, with the new figure and its coordinate.** Twelve. Every figure below is at `ccc9fca`.

| entry | was | is |
| --- | --- | --- |
| a layout a script produces | four builders, over 17 pages | **six** builders, over **8** files of HTML |
| the type sizes this catalogue draws | `var(--a-point)` twelve times | **10** in `style.ts`, **22** in the served sheet |
| a class a page writes | 70 names, 148 sites, 11 modules | **52**, **63**, **4** |
| a module a browser loads | the guard cannot see an `await import` | it reads both spellings; a **computed** specifier it cannot |
| a value a guard looks for | one instance | **6 of 6** contract pages state the needle **twice** |
| a breakpoint is the arithmetic | `52rem`, `64rem`, `97rem`, none carrying its argument | **none of the three exists**; four conditions, **all four** carrying theirs |
| any layout this site declares | 30 geometry declarations | **60** |
| what a linked-to element clears | one unresolved term | **two**, the field's having joined the arithmetic |
| a browser does what a document says | 480 / 254 and 478 / 249 lines | **815 / 425** and **806 / 394** |
| a count of this site's own pages | emission 13, tree 14 | emission **7**, tree **8**; **9** false present-tense claims |
| the address a deployment keeps | 9 of 10 retired addresses answer 200 | **10 of 10** |
| the four hours | sixteen modules and `robots.txt` | **seventeen** modules and `robots.txt` — **18** |
| an address no listing names | sitemap 10 | sitemap **7**, tree 110, so **103** |

Thirteen rows for twelve entries: *an address no listing names* and *the address a deployment keeps*
are two entries reading the same sitemap from opposite ends, and both moved.

**Six of those rows are worth more than their numbers.**

`a breakpoint is the arithmetic of the lengths it separates` names three lengths and **not one of them
is in the stylesheet**. Four conditions stand where they stood — `26rem`, `50rem`, `11rem`, `12.5rem`
— and the entry's central sentence, *not one of the three now carries the arithmetic it came from*, is
false of every one of the four: `26rem` states the measurement that produced 416px, `50rem` states the
arithmetic of both shell arrangements at 49.14rem and 47.40rem, and the two rem conditions state the
sweeps that found them. `--two-columns` is gone, and so is the document order `main, .where, .rail`
that the whole `97rem` argument rests on — which is the reopening **that entry wrote for itself**:
*what is taken again on the day that order changes is the measurement and never this argument.* The
day came at ADR-0187 and nobody took it. What is unchanged is the class: nothing evaluates a
condition against the tracks it separates, and CSS still cannot.

`a value a guard looks for appears once on the surface it looks at` recorded one instance. Measured on
the value `the-cost-a-page-states-is-what-lands-and-not-what-is-served` really searches for — the
installed total with a thin space and the word `bytes` — **every one of the six contract pages states
it twice**, and the harness total appears nowhere. So the mutant the entry describes, pointing the
card's figure at the harness, is survivable on all six.

`a module a browser loads is one this repository's guards can see` is **false in its central claim**.
The keeper guard now matches `from '…'` **and** `import('…')`, and its own comment says why: *both
spellings, because one of them arrived with a hole in this guard.* What survives is narrower and real:
`start.ts` carries two dynamic imports, one a literal the guard reads and one
`import(new URL(playground.module, document.baseURI))` whose specifier is computed and which no
pattern over source text can resolve — the templated-`import()` class ADR-0149 already published. The
graph is **11** modules, `LOADED_BEFORE_A_READER_ACTS` is 7, so **4** are reached only through an
`await import`. `served-modules.test.ts` collects four guards, which is what the entry says.

`a count of this site's own pages` is the entry whose population **grew**. Swept over every tracked
`.ts` and `.yml` with runs of whitespace collapsed — which a line-by-line sweep misses, because the
phrase straddles a line break in a comment — there are **20 statements of a page count across 14
files**, of which **11 are stamped or historical and 9 are present-tense and false**:
`packages/site/browser.ts`, `font.ts`, `playground.ts`, `playground.test.ts`, `start.ts` twice,
`start.test.ts`, and `mutation/site.battery.ts` twice, one of the last being a mutant's own
description. They say *nine of the thirteen pages never fetch this module* where it is **one of
seven**, *inlined into all seventeen pages* where it is **eight files of HTML**, and *the four
builders safe on all thirteen pages* where there are **six** builders.

`the address a deployment keeps is the address a reader gets` moved the wrong way. At `18c0b38` nine
of the ten addresses ADR-0189 retired answered 200 and `/typescript/array/group-by@1/` answered 404;
at `ccc9fca` it is **10 of 10**, and that address serves a **20 969 B page for a contract this
catalogue turned down**, `age` 181 708 s. The entry predicted *seventeen today and seven once the edge
expires*; fifty hours on it is seventeen, the four `s-maxage=604800` pages having some five days left.

`the four hours a returning reader holds a module for` is unchanged in every argument and larger by
one. **Eighteen** addresses answer `public, max-age=14400, must-revalidate` at the origin — the
seventeen modules and `robots.txt` — where the entry says sixteen and `robots.txt`. `llms.txt` is
still alone outside that layer at `max-age=0`, exactly as the entry records, and this repository still
declares `max-age=0` for `/packages/*`, so the split is still the zone's.

**Unchanged, which is also a result.** One.

`That what a linked-to element clears is the bar that is really above it`. `theMenu()` returns **0**
entries and `--the-menu-at-its-tallest` is declared **1**, which is the entry's latest reading to the
character. What is worth adding rather than correcting is that the arithmetic gained a term: the
sticky bar is now summed from `--the-field-at-its-tallest` as well, so the declaration nothing
resolves has **two** unresolved terms where the entry describes one.

### What was found and deliberately not repaired

Five things, each of which is a unit somebody has to decide:

1. **Five pairs on the front page whose count runs into its name in every projection**, served at
   `/index.md`. Repairing it is a separator in `pill`, or the mark becoming a block — which is the
   layout decision the entry itself prices and refuses.
2. **Nine false present-tense page counts** in seven files. Correcting them is nine edits in prose and
   one in a mutant's description text, which moves what the instrument prints.
3. **A contract page stating its installed total twice**, on six of six pages.
4. **An address the origin serves for a contract this catalogue refused.** Nothing in this tree writes
   it; the edge holds it. The repair is on the far side of the gap `wrangler.jsonc` records.
5. **`start.ts` exporting six builders where two entries say four.** The entries are corrected; no
   guard counts them.

## What would reopen this

- **A unit that changes what the site emits.** Every figure here is at `ccc9fca` and the shape of the
  tree is what produced all fifteen readings.
- **A repair of any of the five above**, which is what turns a written finding into a moved number.
- **A ruling on whether this class deserves a guard.** The judgement is recorded in *More Information*
  and the guard is deliberately not written, because a guard over the open list is a subject of its
  own.

## More Information

### The judgement on a guard, which this unit does not write

**A guard over dead citations is cheap, and I recommend against it in that form.**

The probe exists and its reading is the argument. Over the open list, matching a backticked token
ending in a source extension and asking git whether it resolves: **108 cited file tokens, 101
resolving, 7 not**. Of the seven, **one is the live defect** —
`packages/site/methodology-page.ts` — and six are benign in four distinct ways: a build artefact
under `dist/` that is untracked by design; three emitted addresses (`robots.txt`, `llms.txt`,
`sitemap.xml`) that are answers rather than files; a deliberate negative (`packages/tsconfig.json`,
which an entry cites precisely to say it does not resolve); and a stamped historical citation
(`catalogue-page.ts`, inside a sentence about what ADR-0127 did to a file that then existed). So the
guard would be born red on one true instance with six exemptions, which is the convention-with-a-list
this repository refuses without an argument.

**The stronger reason is what the unit measured.** One of the fifteen entries carried a dead file
name. The other fourteen named live files and measured objects the redesign had replaced. A guard
over citations would have flagged **1 of 15** and reported the other fourteen as healthy — and its
green would be read as coverage of a class it reaches a fifteenth of, which is the failure mode
`CLAUDE.md` names in as many words: *a list that believes itself exhaustive is more dangerous than no
list.*

**What would have caught the one that mattered is not a guard but a sentence.** `no-element-runs-into-the-one-beside-it`'s
entry could not be replayed by anybody, because it published a verdict — *the population is now zero* —
and not the rule it was swept by. ADR-0189 wrote that discipline for a probe deciding a deletion. The
proposal, which is Mathis's to take or refuse, is that **an entry declaring its population empty carries
the rule the sweep read it by**, so the next session runs a command instead of trusting a sentence. It
is a rule about how an entry is written, this list is where such rules live, and it is a unit of its own.

### The commands

The site was built at `ccc9fca` with `pnpm site:build` and served over HTTP from
`packages/site/out`; the browser reading was taken through same-origin iframes at 320, 390 and 1440,
the first full sweep discarded, and perturbed before the zero was believed. The origin readings are
one `GET` per address against `https://toopo.dev`, redirects not followed. `pnpm freeze` is green
before and after, and no digest moves: this unit writes prose.
