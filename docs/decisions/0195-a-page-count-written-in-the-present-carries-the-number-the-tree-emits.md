---
status: accepted
date: 2026-09-01
governs:
  - packages/site/browser.ts
  - packages/site/font.ts
  - packages/site/marks.ts
  - packages/site/playground.ts
  - packages/site/start.ts
  - mutation/site.battery.ts
confirmed-by: []
---

# A page count written in the present carries the number the tree emits

## Context and Problem Statement

[ADR-0193](0193-an-entry-about-this-site-is-remeasured-against-the-site-that-exists.md) re-measured
fifteen open entries against the site that exists, and closed by naming five things it had found and
deliberately not repaired. The second is *nine false present-tense page counts in seven files*, priced
at nine edits in prose and one in a mutant's description.

This unit is that entry, and the first thing it did was refuse to relay it. ADR-0193 published a rule
in words — *swept over every tracked `.ts` and `.yml` with runs of whitespace collapsed* — and a
result: 20 statements across 14 files, 11 stamped or historical and 9 present-tense and false. A
number taken from a record and written into a repair is a number relayed, which is the fault this
repository exists to refuse. So the sweep was rebuilt, and rebuilding it moved every part of the
answer: the rule, the population, the count, and which files hold a defect.

## Decision Drivers

- **[ADR-0018](0018-a-published-count-carries-its-coordinates.md) is the rule this repository invokes more
  than any other, and it had just been broken nine times in its own prose.** A count with no
  coordinate, in a present-tense clause, is the exact shape it names.
- **No mechanical replacement works.** The nine do not share one true number: seven pages and eight
  files of HTML are two quantities, *the nine pages with no form* asks how many pages have no form
  today, *the four builders* is six, and *nine of the thirteen pages fetch four modules* mixes two
  counts in one clause.
- **One of them is not prose.** A mutant's description is data the instrument carries, so correcting
  it is a change to the instrument unless something says otherwise.
- **A guard born on a population of nine does not cover the class**, which is ADR-0193's own lesson
  about the citation guard it declined to write.

## Considered Options

### For the population

- Take ADR-0193's nine and repair them.
- Rebuild the sweep, state the rule, and repair what it returns.

### For the repair of each sentence

- The measured number.
- The measured number with the commit it was measured at.
- No number, where the sentence's argument does not depend on one.

## Decision Outcome

### The rule the population is built by, stated so that it is replayable

1. The population is every tracked `.ts` and `.yml` file — 306 of them at `e80b5fc`.
2. Each file is normalised before it is read: the `*` that leads a continuation line of a block
   comment, and the `//` or `#` that leads a line comment, are removed, and then runs of whitespace
   collapse to one space.
3. A statement is a cardinal of two or more — an English number word or a digit — immediately
   quantifying a plural noun for this site's pages: `pages`, `files of HTML` or `HTML files`.

**Collapsing whitespace is not enough, and that is the correction to ADR-0193's rule rather than a
detail of it.** Where the phrase straddles a line break inside a block comment the leader sits between
the two words, so `the nine\n * pages` collapses to `the nine * pages` and no sweep for `nine pages`
can see it. **Two statements are visible only under the stronger normalisation**, and one of them —
`start.test.ts`'s *twelve pages of thirteen* — is false and was in none of the earlier readings.

**The plural is the discriminator, and it is a reading rather than a taste.** The unrestricted form of
this sweep returns 95 hits; every singular one of them — `one page`, `no page`, `a page` — was read,
and every one is a reference to some page and never a count of how many there are.

**The nouns are enumerated because this repository spells one quantity four ways.** A sweep for
`pages` alone misses `files of HTML`, which is where the stylesheet's own count lives.

### The population is 33 statements across 23 files, and fourteen of them were false

Against ADR-0193's 20 across 14. The difference is scope, declared rather than discovered: this rule
also takes counts of *subsets* of the site's pages, and the three spellings of `files of HTML`. A
subset count goes stale exactly as a total does, and the seven false ones among them are the reason
the wider rule was kept.

The counting is by **occurrence** and not by sentence, because an occurrence is what gets edited.
Where ADR-0193 and the brief that opened this unit read `mutation/site.battery.ts` as three statements
and `playground.test.ts` and `start.test.ts` as one each, this rule reads four, two and two — the
first because one comment names *nine pages* twice, the other two because each file holds two
separate comments that each make the claim.

### Every number is measured, and each carries what measured it

| what | value | measured by |
| --- | --- | --- |
| pages the tree writes | **7** | `pnpm site:build`, which prints its own census |
| files of HTML | **8** | `find . -name '*.html'` over `packages/site/out` |
| files of HTML that load `start.js` | **7** | `grep -l start.js` over the eight |
| pages carrying a playground container | **6** | `grep -l data-playground` over the eight |
| pages with no form | **1** | the front page, by difference |
| files of HTML carrying the inlined sheet | **8** | `grep -l '<style>'` over the eight |
| distinct folders those eight sit in | **7** | `dirname` over the eight, deduplicated |
| `THE_BROWSER_GRAPH` | **11** | the declaration, resolved through the repository's own hook |
| `LOADED_BEFORE_A_READER_ACTS` | **7** | the same |
| modules reached only by `await import` | **4** | the difference of the two |
| builders `start.ts` exports | **6** | `grep -c '^export const'` |
| installable contracts | **6** | the served `contract-index`, 7 entries and 1 refused |
| pages carrying an install command | **7** | `grep -l 'toopo add'` over the eight |

**Seven pages and eight files of HTML are the trap the brief named, and the measurement is what
separates them.** `404.html` is a file of HTML and is not a page — and the reading that settles which
word a sentence wanted is that **it does not load `start.js`**, so the seven are exactly the set that
runs the entry point. A sentence about what a page fetches means seven; a sentence about what the
build writes as HTML means eight.

### Two numbers turned out to be two quantities that were never equal

`font.ts` said the stylesheet is *inlined into all seventeen pages* and that one relative spelling
*would mean seventeen different addresses*. The sheet is inlined into **8 files of HTML**, and those
eight sit in **7 folders** — the front page and the 404 share one, so they would share the address a
relative `url()` produced, and the other six sit one per contract. One stale figure had been standing
for two quantities, and correcting it to a single new figure would have preserved the error.

The `data:` arithmetic in the same paragraph is recomputed rather than left: 39 200 B per page across
17 pages was 666 kB, and across 8 files of HTML it is **314 kB**, which is twelve times what ADR-0141
removed from the sheet rather than twenty-six. **A count repaired without the arithmetic that depends
on it publishes a fresh contradiction three lines down.**

### Two defects sit outside the seven files ADR-0193 named

**`pages.test.ts` contradicted itself, in the file whose guard counts this site's pages.** It opened on
*Five pages for five contracts, four for the domains the index files them under, and three that are
about no contract at all* — twelve pages — and four paragraphs below, in the same comment, wrote **The
one page that is not about a contract is named here**. Measured, it is six pages for the six
installable contracts, none for the domains since ADR-0189, and one about no contract. Nothing reads a
comment, so both halves stood.

**`marks.ts` named a page that no longer exists.** It said *Two pages take it now — the method page
from `mutation/`, and every contract page*. ADR-0189 retired the method page and serves the
methodology as data; `marks.ts` is imported by `contract-page.ts` and by `pages.test.ts` and by
nothing else, so six pages take it and the second is gone.

### The mutant is W-116, and the premise about it was refused by measurement

The brief for this unit stated that correcting the description changes what the instrument prints.
**It does not**, and four readings say so rather than one argument:

- `killed()` returns `{ verdict: 'killed', by }` and carries no `onlyOn`, so W-116 is neither a
  survivor nor a platform cell — the two shapes whose descriptions `published.ts` copies.
- `published.ts` reaches `mutant.description` only after `expectation.verdict === 'survived'` or after
  an `onlyOn` is found; W-116 satisfies neither.
- The description text occurs in no address the tree serves, in `README.md`, `CONTRIBUTING.md`,
  `docs/` or `mutation/results/`.
- `measure.ts` reports a cell as `${cell.mutant} on ${cell.arm}/${cell.lens}` — the identifier, never
  the description.

`W-116` itself is cited in `CLAUDE.md`, in ADR-0157 and twice in the battery; its words are cited
nowhere. So the correction is an ordinary prose repair, and it was still checked against
`pnpm anchors` because it edits a battery file.

**What the correction costs the mutant is worth stating rather than smoothing.** The defect it injects
is unchanged — the playground imported at the top of the entry point — and its reach is not: it was
nine of thirteen pages fetching four modules they cannot use, and it is **one of seven**. That one is
the front page, which is the door.

### A coverage gap found by repairing a count

`a-page-with-no-slots-on-it-has-nothing-built-into-it` said it made *the four builders safe on all
thirteen pages*. ADR-0193 read *four* as false against the six `start.ts` exports. **Both are right
about different things**: the guard calls exactly four builders — `copyControl`, `managerControl`,
`searchControl`, `playgroundControl` — so *the four* is true of the guard and reads as a claim about
the module. Measured over the whole file, `themeControl` is called by **no guard of
`start.test.ts` at all**, and `siftControl` only where a shelf is served.

The comment now says which four it calls and names the two it does not reach. **No guard is written
for them here**, because a guard is a unit of its own and this one is about prose.

## The judgement on the coordinate

Mathis asked whether a page count written in the present in a comment should carry its coordinate, or
not be written at all. **Neither, and the test that decides it is already ADR-0018's first rule**:
*when a sentence can be true without counting, it does not count.*

**The operative question is whether the sentence's argument changes when the number does.**

- Where it does not, the number is decoration and the repair is to delete it, not to date it. *So the
  nine pages with no form fetch none of it* argues that a module is deferred because some pages cannot
  use it, and that is true at every ratio. Seven of the fourteen repaired here are this shape.
- Where it does, the number is load-bearing and must carry its coordinate. `font.ts`'s eight-and-seven
  **is** the argument, `pages.test.ts`'s enumeration is the guard's subject, and W-116's *one of
  seven* sizes a defect.

**Stamping is the worst of the three for the first group**, and ADR-0018's own third rule says why: a
dated number followed by a present-tense claim about the same quantity publishes a truth and a lie in
one sentence. *Six of the seven carry a playground, measured at `e80b5fc`* is that hybrid exactly.

**The fourteen were repaired with a measured number and no stamp, as the unit asked**, and this
paragraph records that the assistant's judgement is that seven of them should have lost the number
instead. It is not applied here for two reasons: the unit asked for the number, and a rule about how
this repository writes its own prose belongs on the open list rather than inside a repair. **It is
named and left**: *a count in a present-tense sentence is deleted where the argument survives its
removal, and carries its commit where it does not.*

**A guard is not proposed.** ADR-0193 declined one over dead citations because it would have been born
red with six exemptions and would have reported fourteen of fifteen entries as healthy. A guard here
is worse: it would have to tell a load-bearing count from a decorative one, which is the judgement
above and not a shape. What is cheap is the sweep, which is in *The commands* below and can be re-run
at any commit.

## What would reopen this

- **A unit that changes what the site emits.** Every figure here is at `e80b5fc`, and all fourteen
  repaired sentences are present-tense counts of a tree that a redesign moves. This is the reopening
  condition the repaired sentences do not carry, which is the judgement above stated as a risk.
- **A ruling on the rule named and not written**, which would either delete the seven decorative
  counts or decide that they stay.
- **A statement of a page count spelled a fifth way.** The sweep enumerates four nouns; a sentence
  writing *documents* or *addresses* for the same quantity leaves the population in silence.

## More Information

### What was found and deliberately not repaired

1. **`ul.contracts` is a dead rule in the stylesheet**, and its comment carries a false present-tense
   page count: *A list of contracts, on the two pages that publish one*. Measured, **no file of HTML
   carries `class="contracts"`** — the front page's list is `class="offers"` — and no module writes
   that class. The count cannot be repaired without deciding the rule's fate, and deleting a rule
   changes what every reader is served, which this unit does not do.
2. **Historical measurements with no coordinate.** `pages.test.ts` holds *24 occurrences of `toopo
   add` across the eleven pages of the tree* (measured, it is 13 across 7) and *Measured over the four
   pages: 212 paragraphs*; `style.ts` holds *the 688 prose elements of the eight pages*. All are
   past-tense readings, and re-measuring them would falsify what they record about a state that
   existed. They are named because they carry no commit, which is the half ADR-0018 asks for.
3. **`components.test.ts` says *17 pages at the time of writing*.** This is a stamp in words with no
   coordinate. It disclaims currency, so it is not the present-tense class this unit repairs, and it
   is the weakest form of stamp this repository holds.
4. **`start.test.ts` says the site is built twelve times** where the file collects 18 guards, and
   `source.ts` says *five contracts still fit* where the catalogue holds seven. Neither is a page
   count. They are the same class over a different population, and sweeping them is a unit of its own.
5. **`themeControl` is exercised by no guard of `start.test.ts`.** Named above, not closed.

### The commands

The sweep is `mutation`-free and stands outside the tree: it takes the repository root and the
extensions, runs `git ls-files`, normalises as *The rule* describes and reports every statement with
its context. The site was built at `e80b5fc` with `pnpm site:build` and every figure in the table
above was read off `packages/site/out` or off the declarations, never off a record.

`pnpm site` is 17 files and 184 tests green; `pnpm anchors` is 770 anchors across 103 files with none
loose; `pnpm freeze` is green and `pnpm ledger` is byte-identical across the change. Nothing under
`contracts/` is touched, no digest moves, and `THE_PACKAGE_VERSION` stays at `1.1.0`: this unit writes
prose.
