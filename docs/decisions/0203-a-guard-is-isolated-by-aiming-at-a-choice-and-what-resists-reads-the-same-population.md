---
status: accepted
date: 2026-09-02
governs:
  - mutation/mutants.ts
  - mutation/site.battery.ts
  - CLAUDE.md
confirmed-by: []
---

# A guard is isolated by aiming at a choice, and what resists reads the same population

## Context and Problem Statement

ADR-0200 closed the census at thirteen folders and left a number standing: **954 guards redden and
have never carried a defect by themselves**, of which 548 sit in an inseparable class, 406 have a red
pattern of their own, and **177 are one companion away** — there is a cell on which they redden beside
exactly one other guard. That record calls the 177 *the cheapest of what is left to do* and prices
none of it. `attribution.ts` says what the work is, in as many words: *reading it produces mutants
instead of deletions*.

**What was missing is not the list but the rate.** Nobody had written one of those cells and measured
what it cost, so *cheapest* was a comparison between two unpriced things. ADR-0199 had also recorded
that `alone is not reachable for it by any plausible mutant` is a different state from `nobody has
written the cell`, and that **the two look identical in the bucket** — with one instance named and no
measurement of the proportion.

This unit pays part of the debt to price the rest of it.

## Decision Drivers

- **A bound extrapolated from one member of a population states the cost of that member.** ADR-0199,
  written after a replay priced at 1 h 45 came in at 60 min 14 s because the estimate was calibrated on
  the cheapest battery there is. Whatever this unit publishes has to say which member it measured.
- **One reading of a battery does not calibrate that battery better than to about a sixth.** ADR-0200,
  from four batteries timed twice on work that did not change.
- **A cell must aim at one guard.** A cell that takes a guard from *never alone* to *alone* by
  reddening six others has moved the problem and inflated the count.
- **A guard is not rewritten to make a cell work.** If a guard cannot be isolated as it is written,
  that is a fact about the guard and it is reported. Editing the guard is fitting the question to the
  answer.

## The 177, rebuilt before being used

ADR-0200's census lives outside the repository — `mutation/results/` is ignored, and CLAUDE.md rule 5
keeps working notes out of the tree — so it is a reading that has to be rebuilt to be used. It was,
from that record's own stated rule, over the artefacts its replay left.

**Everything reproduces.** 1 608 collected, 293 alone, 954 never alone, 361 never red; 548 inseparable
in 136 classes; 406 with a red pattern of their own; **177 one companion away**; and the three
per-folder counts, 40 in `packages/cli`, 29 in `packages/site`, 22 in `packages/registry`. The three
checks that make it a reading rather than an assertion pass with nothing to report: the three classes
partition the collected population, every guard that reddens was one the attribution collected, and no
column names a guard in two buckets.

**That is worth stating because the last time this was tried it did not.** ADR-0199's *152 one
companion away* came out 150 under the rule its own sentence gives, and that record's figure was left
where it was rather than corrected. This one is not that: the 177 is rebuildable, and a reader who
wants it can rebuild it.

## The slice, and why it is this one

**`packages/site`, the eight reciprocal pairs — sixteen guards, 9.0 % of the 177.**

A *reciprocal pair* is the sharpest form of one-companion-away: each guard's only two-guard companion
is the other, so nothing existing separates them **in either direction**. The folder's 29 split into
eight such pairs and thirteen guards with a wider companion set, and the sixteen were taken whole. The
rule was written down before their difficulty was looked at, which is the only thing that stops a slice
being the easy half of one.

**Why `packages/site` and not the largest share.** `packages/cli` carries 40 of the 177 but spreads
them over four batteries, so its machine cost is four runs and its authoring cost four contexts; the
site's 29 sit in one battery, so a single run measures the whole slice and the before-and-after is a
reading rather than a sum. On cost per cell the site battery is a middle member — 4.40 s against
`validation-stage-1`'s 2.65 and `registry-storage`'s 10.67, computed from ADR-0200's own timings — so
it is not the cheap member this repository has already been wrong by a factor of two on.

**How it is not representative, stated rather than smoothed.** `packages/site` has the second-highest
proportion of already-isolated guards of the thirteen folders — 84 of 187, 45 %, behind `packaging`'s
58 % and far ahead of `packages/registry`'s 9.4 %. Its never-alone residue has therefore survived more
probing than any other folder's, which biases the isolable fraction measured here **downwards**. In the
other direction, its guards are unusually unit-like — a pure function and a hand-written expectation —
where a contract battery's guards are properties over generated data, which biases it **upwards**.
Neither bias is measured, and that is why the extrapolation below stops where it does.

## One cell cannot isolate two guards

A cell has at most one sole red, because *alone* means the only red on that cell. So a reciprocal pair
costs **two** mutants and never one, and isolating *n* guards needs at least *n* new cells.

That is arithmetic rather than a measurement, it holds for the whole of the 177, and it is the one
number in this record that cannot move: **the 177 are at least 177 new cells.**

## Decision Outcome

**Eleven of the sixteen are isolated, W-168 to W-178, one cell apiece, each red alone in a real battery
run.** Five are not, and each carries the reason it resisted.

### What was isolated

| guard | the defect the cell injects |
| --- | --- |
| `only-what-is-addressed-by-its-content-is-cached-for-a-year` | promises a year to every browser module |
| `every-other-answer-is-revalidated-before-it-is-used` | writes the revalidating policy by hand and loses `must-revalidate` |
| `the-press-that-reaches-the-search-is-the-letter-and-a-modifier` | any modifier reaches the search, whatever letter is under it |
| `the-chord-the-badge-names-is-the-one-that-reaches-the-search` | listens on the field rather than on the document |
| `every-heading-of-a-page-is-a-heading-in-its-markdown` | projects a third- and fourth-level heading as prose |
| `the-markdown-projection-keeps-the-structure-and-changes-the-markup` | projects a list item without its marker |
| `every-file-found-by-convention-is-at-the-address-that-convention-fixes` | serves a `robots.txt` that is not the one composed |
| `every-case-replays-through-the-stripped-artefact-a-browser-runs` | reads a date field as a calendar day |
| `the-playground-writes-a-call-the-way-the-case-table-writes-one` | encodes each argument of a call on its own |
| `the-command-a-reader-is-handed-is-the-spelling-shown-then-what-they-asked-for` | hands the reader the spelling they chose rather than the one that runs |
| `every-page-has-its-markdown-beside-it-at-the-same-address` | appends the twin's extension rather than swapping it, and declares the rule for the appended name |

### Aim at a choice, not at a mechanism

**Eight of the eleven isolated on the first candidate. The three that did not are the finding.**

`the-command-a-reader-is-handed-is-the-spelling-shown-then-what-they-asked-for` took three. Two
candidates broke *how* the command is composed — the separator dropped, the slice left untrimmed — and
both reddened three guards or four, because the copy control reads that composition and its own guards
read the rewritten block. The third broke *which* spelling is composed, and reddened one. **A shared
mechanism has every consumer's guards behind it; a choice has only the guard that is about the
choice.** That is the rule this unit would give somebody writing the next hundred cells, and it is
worth more than the eleven.

### A total guard over a population shadows every guard whose subject is that population

`every-page-has-its-markdown-beside-it-at-the-same-address` took two, and the second edits two files.

`every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` is total over `paths()`:
every address the emission writes must be covered by a declared rule. The twin guard's subject is a
property of that same set of addresses — that a page and its Markdown are siblings — so **any defect
that moves an address reddens both**. Measured: the twin written at `${path}.md` in `site.ts` alone
reddens the twin guard and the cache guard together.

What lifts the shadowing is moving the declaration with the address, which is also how somebody would
really make the mistake — both places name it, and a careful person edits both. `_headers` is then
consistent, the tree is covered, and what is broken is that every page's `rel="alternate"` points at a
file nothing writes. One cell, two files, red alone.

### What resisted, with what was looked for

**Five guards are not isolated, and none of the five is *nobody wrote the cell*.**

- **`a-command-this-control-cannot-take-apart-is-one-it-refuses-to-rewrite`.** Its whole claim is a
  restriction of its twin's: the twin asserts, for every way the page serves, that the arguments come
  back exactly when the spelling is the invocation. The three inputs the refusal guard adds are the
  empty string, a bare `add string/slugify`, and `yarn dlx toopo add string/slugify` — and the twin
  never passes the third, because `theSpellingShownFor` substitutes the invocation for a **refused**
  way. So every permissiveness a plausible mutant can introduce is seen by the twin, and the one input
  outside its range is reachable only by a mutant keyed to that literal spelling, which is not a defect
  anybody makes. **Its input population is a subset of its neighbour's for a reason that is a different
  design decision**, and that is the second shadowing mechanism this unit names.
- **`a-date-is-the-one-argument-this-site-constructs`.** The shadowing here is **one-directional and
  measured**: W-175 truncates a date field to its calendar day, the replay over every case of
  `date/add@1` reddens, and this guard does not — its own sample is midnight UTC, so the truncation
  answers the same instant. The converse did not hold for anything tried: every defect in how a field's
  text becomes an argument is replayed against the shipped module over real cases.
- **`an-invisible-code-point-a-reader-typed-is-named-in-the-output`.** Every defect in the escaping is
  read by `literal.ts`'s own guards *and* by the comparison against every case table, because that
  comparison's two sides are the site's rendering and the registry's, which do not share the code.
  Every defect in the composition around it is read by the same comparison.
- **`the-tree-carries-pages-modules-crawler-files-and-answers`.** A conjunction of five existence
  facts — pages, twins, modules, crawler files, answers — each of which has a specialist guard, plus
  the total cache guard over any address that moves. It is a smoke test, and a smoke test is shadowed
  by construction.
- **`no-path-is-both-a-file-and-a-directory`.** The same total-guard shadowing as the twin, without the
  two-file way out: every collision that can be constructed here is a collision *of* something whose
  own guard owns it — a twin, a module, a page — so the cell would have to introduce an address nothing
  else is about, which is an addition rather than a mistake. **This one is classed *isolable but
  expensive* rather than *not isolable***: the shape that would do it is a two-file cell like W-178's,
  and the cost is that somebody has to find a plausible defect whose colliding address belongs to no
  other guard.

**So the slice ends at eleven isolated, one isolable but expensive, and four with no plausible mutant
found.** The four are not claimed to be impossible: what is claimed is that the search described above
was exhausted in a stated direction, which is the honest form of ADR-0199's own sentence.

### What the census says afterwards

Re-read at `9929f0d` — **`packages/site` from this unit's own replay and the other twelve folders
carried from ADR-0200's at `257425c`**, which is a mixed perimeter and is named as one:

| | ADR-0200 | here |
| --- | --- | --- |
| collected | 1 608 | 1 608 |
| alone | 293 | **304** |
| never alone | 954 | **943** |
| never red | 361 | 361 |
| inseparable | 548 in 136 classes | **546 in 135** |
| own red pattern | 406 | **397** |
| one companion away | 177 | **166** |

`packages/site`'s own row goes 84/99/4 to **95/88/4**, and its share of the one-companion-away
population 29 to 18. The collected total does not move, because a cell is not a guard.

**A class of two dissolved, and it is named.** ADR-0200 wrote that *a class of two dissolves the moment
one mutant reddens one of its members without the other*; here both members went at once.
`only-what-is-addressed-by-its-content-is-cached-for-a-year` and
`every-other-answer-is-revalidated-before-it-is-used` reddened on exactly the same cells, so they were
in the inseparable bucket **and** one companion away from each other — the two buckets are not
exclusive, because the distance is read over every never-alone guard. W-168 and W-169 separate them in
both directions, so the class is gone rather than reduced.

## What this prices, and what it refuses to price

### The machine half, per folder rather than from one member

The search costs one suite run per candidate. Those run times are published per configuration rather
than extrapolated from one — ADR-0162 measured them all at `505fddb`: contracts 1.4 s, validation
2.5 s, site 5.4 s, cli 10.8 s, registry 14.9 s, packaging 14.9 s, meta 39.4 s. **The site is the one of
the seven this unit re-took, and it came back lower**: 4.0 to 4.4 s over the twelve candidate runs that
printed a duration, against 5.4 s. The table below keeps 5.4 s rather than the reading taken here,
because six of its seven rows are that record's and mixing a fresh figure into one row of six stale
ones would publish a total taken at no commit at all.

At this slice's rate of **1.27 candidates per isolated guard**, and taking each folder's own suite
time, the search over the whole 177 is:

| folder | of the 177 | suite run | search |
| --- | --- | --- | --- |
| `packages/cli` | 40 | 10.8 s | 549 s |
| `packages/site` | 29 | 5.4 s | 199 s |
| `packages/registry` | 22 | 14.9 s | 416 s |
| the seven contracts | 77 | 1.4 s | 137 s |
| `packages/validation` | 5 | 2.5 s | 16 s |
| `packaging` | 2 | 14.9 s | 38 s |
| `mutation/fixture` | 2 | 39.4 s | 100 s |
| | **177** | | **≈ 1 455 s** |

**The audit is the larger half and it is one replay.** All 23 batteries took 63 min 4 s at `257425c`
over 873 cells; 177 more cells at that replay's own average of 4.33 s a cell is 766 s, so a full audit
of the finished work is about **76 minutes**, and ADR-0200's floor says one reading of that is worth
about a sixth either way — **63 to 88 minutes**.

**So the machine half of the 177 is under two hours.** That is the finding this table exists for: the
debt is not expensive to *run*.

### The judgement half, refused

**No figure is published for what authoring 177 cells costs, and the reason is that two biases of
unknown size point in opposite directions.** The slice's isolable fraction is 11 of 16, and its
candidate rate is 1.27 per isolated guard; both were measured on the folder with the second-highest
proportion of already-isolated guards in the repository, whose residue is therefore the hardest, and
whose guards are the most unit-like, and therefore the easiest. Multiplying either figure by 177 would
publish a number whose error bar nobody has measured — which is what ADR-0199 was written about, one
axis along.

**What can be said instead is which guards will resist, and that is computable rather than estimated.**
Both mechanisms found here are properties a reader can check before writing anything: a guard whose
subject is a property of a population some *total* guard already sweeps, and a guard whose input
population is a subset of a neighbour's. Neither needs a probe to recognise.

## Consequences

- **Eleven cells, W-168 to W-178, in `mutation/site.battery.ts`.** The site battery goes from 156 to
  167 cells, and one run of it takes **764 s** with nothing disagreeing.
- **The rule the three retried cells produced is written where somebody writing the next one arrives**,
  in `mutation/mutants.ts` beside the helpers a battery declares a cell with, rather than only here.
- **The README's three figures move and are derived rather than transcribed**: 843 defect cells to
  854, 801 caught to 812, survivors unmoved at 42.
- **ADR-0200's census is not rewritten.** It is stamped at `257425c` and stays there; CLAUDE.md's entry
  carries the new figure with its own coordinate and says which folder moved.
- **The site battery's share of its gate grows.** Eleven cells is about three minutes on the runner,
  which is the entry about a bound nobody compares with what a battery costs, arriving as an ordinary
  consequence of ordinary work.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense for
that reason.

**A slice in another folder reopens the two rates.** 11 of 16 isolable and 1.27 candidates per guard
are `packages/site`'s, and the two biases named above are why they are not the repository's. A slice in
`packages/registry` — 9.4 % already isolated, 262 guards declared unprobed — would say whether the
residue of a barely-probed folder is easier or harder, and it is the reading that would let the
judgement half be priced.

**Any of the four unfound cells reopens its own line.** *No plausible mutant found* is a statement
about a search, and a cell that reddens one of them alone retires the sentence rather than contradicting
it.

**The two shadowing mechanisms reopen if either is found not to predict.** They are stated as
recognisable in advance; a guard that resists for neither reason, or one that both predict will resist
and which isolates on the first candidate, is what would say the prediction is worth less than it looks.

## More Information

The 177 were rebuilt from ADR-0200's own stated rule over the artefacts of its replay: a guard is
*collected* when any attribution bucket of any column of the folder names it, *alone* when some cell's
`failedGuards` holds it and nothing else, *never alone* when it reddens and never by itself, and *one
companion away* when some cell reddens it beside exactly one other guard, read over every never-alone
guard. A cell is addressed by `(battery, mutant, arm, lens)`.

Candidates were searched for by mutating `packages/site` and running that folder's suite exactly as
`run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` — and reading the
failed guards out of the JSON report. That is a search tool and never the measurement: **every pin here
comes from a real battery run**, and because a pin is checked as a *subset* — a cell reddening more
guards than its pin names does not disagree with it — *alone* was audited by reading `failedGuards`
back off the battery's own artefact rather than by trusting a green run.

**The battery is spelled the way the runner takes an argument.** `pnpm run battery -- site` resolves
`mutation/--.battery.ts` and measures nothing; the usage block in `measure.ts` documents the npm
spelling, and that is what was run.

```sh
npx tsc -p tsconfig.json --noEmit   # exit 0
pnpm run anchors                    # 791 anchors across 104 files, 0 loose
pnpm run site                       # 187 passed
npm run battery -- site             # 167 cells, 0 disagreeing, exit 0, 764 s
pnpm run meta                       # 10 files, 120 passed
pnpm run freeze                     # 3 passed - no published binding moved
```

**No digest could have moved and it is measured rather than argued**: `git diff --name-only
43062b6..HEAD -- contracts packages/catalogue` names nothing, so neither a contract's seven files nor
either of the two shared ones was touched, and the freeze is green beside that reading rather than in
place of it.
