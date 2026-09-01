---
status: accepted
date: 2026-09-01
governs:
  - CLAUDE.md
  - mutation/registry-storage.battery.ts
confirmed-by: []
---

# A demand signal decides what is measured and never what is refused

## Context and Problem Statement

[ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md) and
[ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) each close with the
same reopening entry: *A better demand signal than npm downloads.* ADR-0158 says two of its refusals
lean on install counts and that both should be re-taken if a better signal ever exists; ADR-0163 says
the entry is unchanged and has been leaned on twice more.

**The entry is waiting for an instrument, and what it needs is a rule.** This unit went to find the
instrument, measured that none of the three candidates available separates what this catalogue
published from what it refused, and found that the reason is structural rather than a gap in the
market. What replaces the entry is a criterion that needs no instrument at all.

**It also lives in the wrong place.** Swept at `3cec9a8`, `demand signal` occurs twice in the tracked
tree and both occurrences are inside these two dated records. `CLAUDE.md` — the file every session
reads before it writes a line, and the file that holds what this repository declares and nothing keeps
— has never carried it. So an entry that asks a future search to re-take two refusals is one no future
search meets.

## Decision Drivers

* **Permanent rule 7 is the bar, and it is not about demand.** A contract exists only where the
  language does not give the thing trivially. Whether anybody wants it is a different question, asked
  of a different object.
* **A refusal is for ever and a selection is not.** Publication freezes a contract for the life of its
  major, and a refusal removes a candidate from a search that has now happened twice. The two errors
  are not symmetric and nothing in either record says so.
* **A count that decides something is a count that has to reproduce.** ADR-0018's rule, applied to the
  entry itself: it publishes *two*, and two is not what the rule it states produces.
* **The failure this entry is really about is mute.** A candidate nobody looked at files no dossier,
  reddens nothing and appears in no table. It is the one shape this repository's open list exists for.

## Considered Options

* the criterion — a demand signal may decide what is measured and never what is refused
* **npm weekly downloads**, the incumbent, re-read rather than remembered
* **npm dependents**, named as the control because it separates *installed transitively* from *chosen*
* **GitHub code search**, the candidate, with a prediction written before the first probe
* **Stack Overflow**, named and refused
* leaving the entry where it is

## Decision Outcome

**Chosen: the criterion, and no instrument.** A demand signal may decide what is *measured*; it may
never decide what is *refused*.

**The asymmetry is what makes it derivable rather than a matter of taste.** A selection error
self-corrects: the candidate is measured, permanent rule 7 decides, and a false alarm costs one probe.
A refusal error is final and silent: the candidate leaves the field, no dossier is written, and nothing
downstream reports its absence. Two errors with the same cause and opposite costs are not to be
governed by one rule, and the cheap half is the half a signal is allowed to touch.

**ADR-0163 already practises the permitted half and never names it.** At its line 386,
`natural-compare@1.4.0` is 144.68 M weekly, *which is what made it worth measuring rather than
dismissing* — demand deciding what is measured, correctly, in as many words. The criterion is that
sentence promoted to a rule and its converse forbidden.

### Where ADR-0158 states half of it and contradicts itself, which is one line and not thirty

ADR-0158's *What the demand figures are worth* restricts the signal and then spends it, in consecutive
lines of one paragraph:

> **444** — `are quoted as orders and the only reading taken from them is a comparison against what this catalogue`
>
> **445** — `already sells — the levenshtein family at 244 M and the slugify family at 26 M. Two refusals above lean on that signal and both say so.`

If the only reading is a comparison, no refusal leans on it. If two refusals lean on it, the only
reading is not a comparison. **The true sentence and the false one are adjacent**, which is the shape
`CLAUDE.md` records this repository finding in its own prose, arriving here on the paragraph whose
subject is what the figures are worth.

## The population, reclassified

**The rule, written before it was applied:** a refusal *depends on demand* when striking every clause
that carries an install figure leaves no refusal standing.

**The population does not reproduce at 22, and three counting rules give three answers**, which is
ADR-0158's own *count this record went to check, and got wrong first* arriving on that record's
refusals. Measured at `3cec9a8` from a declaration a sweep refuses to disagree with — every declared
address is checked to occur at its declared line, and every install figure anywhere in either record
is classed:

| counting rule | reading |
| --- | --- |
| distinct candidate addresses refused | **27** |
| refusal events, one candidate in one record | 28 |
| the two records' own declared counts, 10 + 12 | 22 |

**27 is the defensible one**, because a refusal is something a candidate receives. 28 exceeds it by
`string/camel-case`, refused once in each record. 22 rests on ADR-0158's *ten refusals*, and that
record's own refusal section holds eight named subsections plus four bullets, naming thirteen
addresses — so *ten* reproduces under no rule stated anywhere.

**Seven refusal events carry an install figure**, and that figure does reproduce: `array/chunk`,
`array/binary-search`, `function/debounce` and `string/strip-ansi` in ADR-0158, `string/camel-case`,
`object/flatten` and `string/compare-natural` in ADR-0163.

**Strike the figure clauses and six of the seven refusals stand whole.** `array/chunk` keeps *iterator
chunking is stage 3*. `function/debounce` keeps *it is not a pure function*, and its 83 M is quoted as
a point in the candidate's favour. `string/strip-ansi` keeps *one implementation and no disagreement*.
`object/flatten` keeps three product choices, its demand being an aside placed after the verdict.
`string/compare-natural` keeps *ECMA-402 specifies it*, its figure being the permitted half.
`string/camel-case` keeps leg C, and ADR-0163 says in terms that its 442.55 M is *what the catalogue is
giving up* rather than why.

**One does not.** `array/binary-search` reads, whole: *2.8 M weekly installs across two packages,
against 26 M for the family standing in for `string/slugify@1`. The algorithm is real and the edge
cases — leftmost against rightmost duplicate, comparator contract, `NaN` — are real; nobody is asking.*
Strike the figures and what is left is *nobody is asking*, with nothing behind it, and everything else
in the bullet argues **for** the contract.

**So it is one where ADR-0158 says two — and today it is nought.** ADR-0163's line 292 gave
`array/binary-search` a second and independent motive: it takes a comparator, and a higher-order
contract publishes a case table nobody can read. **No refusal in this catalogue's history now depends
on a demand figure.**

### ADR-0158's count is noted where it stands rather than corrected

Its *Two refusals below lean partly on install counts* is wrong under the rule above and was wrong on
the day it was written. The record is stamped and is not edited, on the treatment
[ADR-0190](0190-the-name-comes-out-of-everywhere-a-digest-does-not-reach.md) gave ADR-0187's 185 and
for [ADR-0018](0018-a-published-count-carries-its-coordinates.md)'s reason. ADR-0163's restatement —
*now leaned on twice more* — carries the same defect: it added three figure-carrying refusals and no
leaning one. Both records gain a head note pointing here, because both advertise a reopening trigger
this unit has answered, and a reader arriving at either would otherwise wait for an instrument that
has been measured not to exist.

## The calibration

**Known answer, and the whole of it.** This catalogue has ruled on 34 addresses: 6 published and
installable, 1 published and turned down, 27 refused. If a demand signal is worth anything to this
decision, it separates those groups. **AUC is the statistic** — the probability that a randomly chosen
published address outranks a randomly chosen refused one, ties counting a half. 0.5 is a coin flip.
It is used rather than a threshold because the question is whether a signal separates the two groups at
all, not where a line would fall.

**The mapping is a declaration and not a derivation, and that is published rather than hidden.** npm's
own search cannot map a function description to its package — `parse number from string` returns
`acorn`, `levn` and `bytes` — so every package family here is named by hand, from the two records' own
enumerations where they gave one. A reader may dispute any row.

**The method reproduces ADR-0163's figures one week later**, which is what makes the null result a
reading about the signal rather than about this probe: the case family 442.55 → 450.43 M, deep-equal
293.58 → 296.14 M, levenshtein 101.43 → 103.64 M, slugify 23.62 → 24.19 M — **every one within 2.4 %.**

| signal | what it counts | AUC |
| --- | --- | --- |
| **D** npm weekly downloads | the incumbent, summed over the family | **0.296** |
| **A** manifests naming the package | the control: a human wrote it into a `package.json` | **0.414** |
| **H** `"function <name>"` in JavaScript | the candidate: how often it is written by hand | **0.475** |

**All three are below a coin flip, and nothing beats the incumbent's failure by being useful.** Under
downloads, 114 of the 162 published-against-refused pairs are inverted.

### The sub-0.5 reading is three contracts, and asking which is what makes it a finding

Refusing to ask this would be choosing the population that gives the wanted answer. Three of the six
published contracts are **language traps** — `number/parse@1`, `date/add@1`, `number/round@1` — where
the incumbent implementation is the language's own and no package family carries the function:

| population | D | A | H |
| --- | --- | --- | --- |
| all 6 published vs 27 refused | 0.296 | 0.414 | 0.475 |
| the 3 with a package family | 0.556 | **0.765** | 0.481 |
| the 3 language traps | **0.037** | 0.062 | 0.469 |

**Their families sum to 25, 117 and 130 562 weekly downloads, and they rank 33rd, 32nd and 31st of
34** — the bottom four of a field containing twenty-seven refusals. That is the whole of the anti-
correlation, and it is not noise.

**The cause is why no better signal is coming.** A demand signal measures where an ecosystem is busy.
Permanent rule 7 asks where the language is wrong. **Where the language is wrong there is no busy
ecosystem, because the incumbent is the language itself** — nobody publishes a package to compete with
`Number()`. The two are not weakly correlated; they are orthogonal by construction, and the three
contracts a demand signal is blindest to are published precisely for the property that blinds it.

**The one positive reading is stated rather than flattened.** On the package-backed subset the control
reaches **0.765**, the best figure in this study, and it does beat downloads' 0.556 there. It does not
rescue the entry: the subset it works on excludes half the catalogue by exactly the property that made
those contracts worth publishing, and over the whole population it is 0.414.

### The prediction, written before the first probe, held

It was recorded in advance that GitHub code search would fail the same test **structurally** — demand
measures what people want, rule 7 measures whether the language already gives it, orthogonal by
construction. Measured: **0.475, 0.481 and 0.469** over the three populations. It does not move
whichever way the population is cut, which is what a coin flip looks like when it is the right answer
rather than a thin one.

### The inversion, which had to be in the record either way, is confirmed

A much hand-rolled function may be hand-rolled *because it is trivial*, and rule 7 refuses the trivial
— so a high count is evidence **against** a contract. `array/chunk` was named in advance as the case
that would score high. Measured, **the nine most hand-rolled functions of the 34 are all refused**, and
the tenth is the first published one:

| `"function <name>"` | verdict | address | why it was refused |
| --- | --- | --- | --- |
| 415 232 | refused | `number/clamp` | `Math.clamp` is stage 2 |
| 401 408 | refused | `string/escape-html` | the signature cannot carry the context |
| 353 280 | refused | `string/camel-case` | the digit fork against a use that does not constrain |
| 280 064 | refused | `function/debounce` | not a pure function |
| 180 224 | refused | `array/unique` | `[...new Set(x)]`, one expression |
| 171 264 | refused | `array/shuffle` | not deterministic |
| 119 040 | refused | `string/truncate` | one expression over two built-ins |
| 96 768 | refused | `array/chunk` | iterator chunking is stage 3 |
| 77 824 | refused | `string/dedent` | `String.dedent` is stage 2 |
| 73 216 | **published** | `string/slugify@1` | — |

`array/chunk` scored high as predicted. **A signal whose top of ranking is a list of things this
catalogue has already refused for triviality is not a signal about whether to publish.**

### The two signals refused before they were ranked

**npm dependents is unavailable to a probe, not merely unhelpful.** It was the named control because it
separates installed-transitively from chosen. The registry search endpoint's `depends:` qualifier
answers `total: 0` for `slugify`, which has thousands of dependents, and npmjs.com answers **HTTP 403**
behind a challenge. So the count exists and cannot be read from here. **A** stands in its place and is a
closer control anyway: a package named in a `package.json` was written there by a person.

**Stack Overflow is refused on a measurement rather than on a memory.** It was named and set aside on
the post-2023 collapse in volume; that collapse is measured here rather than recalled, because what the
refusal turns on is whether a reading taken today is comparable to one taken when these refusals were
argued. Questions per calendar year, from `api.stackexchange.com`:

| tag | 2016 | 2018 | 2020 | 2022 | 2023 | 2024 | 2025 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `javascript` | 261 760 | 206 649 | 212 360 | 149 130 | 71 998 | 29 291 | **6 111** |
| `typescript` | 13 581 | 25 508 | 33 721 | 34 111 | 22 383 | 11 029 | **2 932** |

**2025 is 2.3 % of JavaScript's peak year and 8.6 % of TypeScript's.** A corpus whose annual volume has
fallen by a factor of forty cannot be read for what people ask today, and a count over its whole history
is a reading of 2016 wearing a present tense.

### Consequences

* **The reopening entry closes**, in both records, and closes on a rule rather than on an instrument.
  What it asked for has been measured not to exist, and the criterion it is replaced by makes the
  question it was asking the wrong one.
* **The criterion enters `CLAUDE.md`** under *How the catalogue is written*, where the rules a search is
  conducted by are stated once and argued once here.
* **What survives the closure is narrower and is a new entry of the open list**: the population bound.
  ADR-0163 declares, at its line 447, that *what was left out is the ecosystem below about 20 M weekly
  downloads, which is where a function with a real disagreement and no audience would sit.* That is
  demand deciding what is measured, which the criterion permits — and the criterion's own argument for
  permitting it is that a selection error self-corrects **because the candidate is eventually measured**.
  A standing bound nothing revisits breaks that clause: below it, a selection error is as final and as
  silent as a refusal error, and it wears the shape of no decision at all. The sweep that classed every
  install figure in both records found that line **before it was classed**, as the one figure clause
  attached to no refusal.
* **`confirmed-by` is empty and that is declared rather than left blank.** The criterion governs which
  evidence may decide a refusal, and a refusal is argued in prose in a record. Nothing here reads a
  record's reasoning — which is the closure four entries of the open list already name, price and
  refuse as a lint over prose. A guard asserting that no refusal quotes an install figure would be
  refusing ADR-0163's line 386, which the criterion permits.
* **No digest moves and nothing under `contracts/` is touched.** `pnpm freeze` is green before and
  after, and `pnpm ledger` is byte-identical across this unit.

### The second thing this unit closed, which is the same shape one floor down

ADR-0190 records, in as many words, that `THE_AUTHOR.name` is *a mutable point that no cell aims at,
and that is an absence rather than a coverage claim.* That declaration lived only in a dated record —
the defect this unit is otherwise about — and it is closed rather than listed, because a cell that
closes a hole leaves nothing to list.

`registry-storage · I-81` sets the author's name back to a person's. **It is not `I-34` with the other
half of the field edited**, and the pin is where the difference is: until ADR-0190 one constant fed both
the manifest and `THE_COPYRIGHT`, so that edit reddened the marking guards over the five copied files
too. The two are parted now, so the cell names one guard — and naming one is the assertion. Re-couple
the holder to the author and the cell reddens two, disagreeing with what its battery pins for it. The
parting was otherwise kept by nothing that runs; ADR-0190 demonstrated it by hand, once.

**The README figures moved with it and the arithmetic was predicted before the guard ruled**: 836 → 837
cells and 794 → 795 caught, with the survivors unmoved, and
`every-figure-in-the-readme-is-the-one-the-instrument-declares` green on the prediction rather than on a
figure read off the guard's own complaint.

## What would reopen this

* **A signal that is not about an ecosystem.** Every candidate here counts packages, manifests or
  source files, and all three are blind to a function whose incumbent is the language. What would
  reopen the calibration is a signal read off something other than published code — and the criterion
  survives it either way, because the criterion is about which decisions a signal may enter and not
  about which signal is best.
* **A published contract that a demand signal ranks correctly and this catalogue refused.** The AUC
  above is over 34 addresses and six published ones; six is thin, and the entries below the bound were
  never candidates at all. A search that lifts the bound and finds a candidate the signal had ranked
  well would be evidence the orthogonality argument is too strong.
* **npm dependents becoming readable.** It was the named control, it is the closest thing to a
  measure of *chosen* rather than *installed*, and it is refused here on an HTTP status rather than on
  an argument. If it becomes readable it is worth one run of this calibration, which is a probe.
* **The population bound being lifted.** It is an entry of the open list rather than a trigger here,
  because lifting it is a search and not a decision about signals.

## More Information

* [ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md) is where the
  entry was opened and where the count it carries is wrong.
* [ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) restates the entry,
  practises the criterion's permitted half without naming it, and declares the population bound this
  record leaves open.
* [ADR-0018](0018-a-published-count-carries-its-coordinates.md) is why ADR-0158's figure is noted here
  rather than corrected there, and why every count above carries its rule and its commit.
* [ADR-0190](0190-the-name-comes-out-of-everywhere-a-digest-does-not-reach.md) is the treatment that
  precedent follows, and the record whose declared absence `I-81` closes.
* [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) is why the
  orthogonality is argued from the language's own position rather than asserted as an explanation of a
  null result.
* [ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md) is why the
  criterion is a rule rather than a new declared field.
* [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) is the treatment an
  overruling gets, which this is not: ADR-0158's entry named a reopening condition and this unit
  answered it.

### Coordinates

Every figure above was measured on **2026-09-01**, on **Node v24.15.0**, against this repository at
**`3cec9a8`**. The population sweep runs over the two records as committed there. Download figures are
npm weekly point readings for the window ending 2026-08-29; code-search counts are GitHub's
`search/code` `total_count`, which is quantised at scale and is used as a rank rather than as a count.
No probe ran inside the tree, and `git status` was clean before the first of them.

### What this could not settle

**Six published contracts is a thin positive class**, and no AUC over six is worth more than an order.
What carries the conclusion is not the statistic but the structural reading beside it — three of the six
have no package family at all — and that one does not depend on the sample size.

**The mapping is this unit's judgement.** Twenty-seven of the thirty-four package families were named
here rather than by either record, and a reader who disputes a row changes a figure. The families are
published for that reason, and the four ADR-0163 enumerated reproduce its own sums within 2.4 %.

**Nothing was measured below the bound.** This calibration is over the addresses this catalogue has
ruled on, so it inherits ADR-0163's narrowing whole. A signal that only fails above 20 M weekly is not
shown to fail below it — which is the open entry, stated here so the entry is not read as smaller than
it is.

### Where the probes live

The four probes and their raw output are not in this repository — stage rule 5 keeps working material
out — and every figure above names the population it was taken over so that it can be rebuilt. The
population sweep is a declaration checked against the two records at `3cec9a8`, and it reads them by
line: the head notes this unit added to both shift those lines, so it is rebuilt at its own commit
rather than against the tree that carries this record.
