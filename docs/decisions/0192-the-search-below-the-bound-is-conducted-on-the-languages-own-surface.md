---
status: accepted
date: 2026-09-01
governs:
  - CLAUDE.md
confirmed-by: []
---

# The search below the bound is conducted on the language's own surface

> **This record is committed in two halves and the order is the evidence.** Everything under
> *The method, declared before the first probe* was written and committed before any candidate had
> been looked at; the findings were added afterwards. A criterion written after the results bends to
> them, and a record claiming otherwise is worth exactly what its own history says — so the history is
> the claim.
> [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) is the discipline this
> follows, where a condition written a year in advance is what decided a question nobody could have
> argued down on the day.

## Context and Problem Statement

[ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) settles that a
demand signal may decide what is **measured** and never what is **refused**, and its argument for
permitting the first half is that a selection error self-corrects: the candidate is measured,
permanent rule 7 decides, and a false alarm costs one probe.

**That clause has a premise, and one standing bound breaks it.**
[ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) declares at its line
447 that *what was left out is the ecosystem below about 20 M weekly downloads, which is where a
function with a real disagreement and no audience would sit.* Below that bound the candidate is never
measured at all, so the error is as final and as silent as a refusal error while wearing the shape of
no decision. Two searches have now run under it.

**`CLAUDE.md`'s open list says what would close it, in as many words**: *a search conducted below the
bound, whose result is publishable whether or not it finds anything.* This is that search, and it is
the third.

## Decision Drivers

* **A floor cannot be repaired by being lowered.** Any threshold recreates the defect at a new number.
  A bound at 1 M excludes below 1 M with exactly the silence a bound at 20 M excludes below 20 M. The
  entry is not about where the line is; it is about a line nothing revisits.
* **The previous two searches were lists and not sweeps.** `CLAUDE.md` records it: the ten refused
  briefly in ADR-0163 and the four in ADR-0158 are *every one of which names a candidate somebody
  proposed rather than one a sweep returned*. A list of proposals reproduces the proposer, and two
  proposers who read the same ecosystem propose from the same place.
* **A demand figure may not enter a refusal.** ADR-0191's criterion, applied to a search rather than
  argued about. What is stronger here and is free: the axis below is not demand at all, so no figure
  enters selection either.
* **A negative is a result.** ADR-0163 established it by titling itself *There is no eighth contract*.
  The window is therefore declared before it is looked through, so that finding nothing cannot be
  answered by widening it.

## Considered Options

* **Lower the floor** — the same search with a smaller number
* **Sweep npm's own ranking below the bound** — the ecosystem enumerated directly
* **Sweep the language's own surface**, which needs no floor because it is finite
* **Take no search and leave the entry** — refused by the brief and by the entry itself

## Decision Outcome

**Chosen: the language's own surface, swept whole, with no demand floor of any kind.** The search is
conducted under the method declared below, and its result — a candidate or none — is published either
way.

### The method, declared before the first probe

#### The window, and why it carries no floor

**The population is every operation the declared runtime's standard library exposes.** The standard
library is finite, so it is a population without a threshold to bound it. That is the whole reason for
choosing this axis over a smaller number: a floor is what the open entry is about, and an axis needing
none is the only thing that answers it rather than moving it.

**The axis is chosen from a measurement rather than from taste, and the measurement is ADR-0191's.**
Three of the six published contracts — `number/parse@1`, `date/add@1`, `number/round@1` — are language
traps whose package families sum to **25, 117 and 130 562 weekly downloads**, ranking **33rd, 32nd and
31st of 34**. All three sit far below ADR-0163's bound. So the band that bound excluded is not a
margin: it is where half of this catalogue's published work already lives, and the thing that reaches
it is a different question rather than a lower number.

**What the window excludes, stated before it is looked through**: a candidate that is neither a
language trap nor above ADR-0163's 20 M. For such a candidate the ecosystem is the only enumeration
available, and enumerating the ecosystem needs a floor. **So this search narrows the open entry and
cannot close it**, and that is written here rather than discovered at the end — an entry closed by a
search that never covered its population would be the defect this unit exists to repair, committed by
the repair.

#### How the population is enumerated

**A sweep, and the sweep is mechanical.** Every own property name of every standard built-in reachable
in the runtime, together with the own property names of each one's prototype, taken from a script's
output and rebuilt at a stated commit. Not a list of things anybody proposed.

**The residue is then read whole rather than sampled.** Members are excluded only by criteria declared
in advance and applied mechanically; whatever survives is read one at a time against the acceptance
rule. A total reading over a derived population is this repository's preferred shape — *a total map
over a union beats a pass over real data* — and it is what makes *nothing was found* mean something.

**What the reading inherits is published rather than hidden.** Two judgements are the assistant's: the
classification of a global as a standard built-in rather than a host facility, and the rule 7 reading
of each in-scope operation. Both are published so that a reader may dispute a row, on ADR-0191's
treatment of its own family mapping.

#### The acceptance rule, derived from the twenty-seven refusals rather than invented

A rule written for this search could be bent to admit a candidate the searcher liked. These are read
off what this catalogue has already refused, so they were fixed before the field was known. **A
candidate is refused where any one of them holds, and not one of them carries a figure.**

| | ground | established by |
| --- | --- | --- |
| **R1** | the language gives it, or a live proposal is giving it | `array/chunk`, `array/zip`, `array/unique`, `number/clamp`, `string/dedent`, `object/size`, `object/deep-clone`, `url/join` |
| **R2** | a written normative specification outside this catalogue is the contract | `semver/compare`, `string/compare-natural`, `string/pluralise` |
| **R3** | it is one expression over built-ins | `string/truncate`, `array/unique` |
| **R4** | the disagreement is a product choice, with nothing to be wrong against | `number/parse-duration`, `object/flatten`, `object/deep-merge`, `string/parse-query-string` |
| **R5** | there is no ecosystem to disagree | `string/strip-ansi`, `number/is-close` |
| **R6** | it is not a pure deterministic function of its arguments | `function/debounce`, `array/shuffle` |
| **R7** | the signature cannot carry the answer | `string/escape-html` |
| **R8** | it is one algorithm behind several renderings, so it is not one contract | `string/camel-case`, `string/word-wrap` |
| **R9** | its case table cannot be served readably | `array/binary-search`, `function/debounce` |
| **R10** | the residue is one decision | `semver/compare`, `string/compare-natural`, `object/flatten` |
| **R11** | nothing is at stake | `number/format-bytes` |
| **R12** | it collides with a question a frozen contract already settles | `string/camel-case` against `string/slugify@1` |

**A candidate is retained where permanent rule 7 is met positively and none of R1 to R12 fires**: the
language's own answer is wrong or surprising on inputs a competent developer meets, and the correct
answer is decidable — which is the trap clause of rule 7, and the clause `number/parse@1`,
`date/add@1` and `number/round@1` were each published under.

**Demand's role in this search is none.** ADR-0191 permits a figure to decide what is measured; the
axis here is not demand, so no figure decides even that. No refusal written below quotes one.

#### The prediction, written before the first probe

**The most probable outcome is that the sweep returns a small number of real traps and that every one
of them dies on R1 or R3**, because the standard library is the most-read surface in the language and
a trap that survives reading is usually one the committee is already repairing. I predict **at most
one candidate survives**, and that if one does it is in numeric formatting or precision, where the
language's answers are surprising for reasons no proposal removes.

**I may be wrong, and the shape of being wrong is worth naming in advance**: the sweep could return a
trap that is real, unrepaired and unproposed, in which case this search publishes an eighth candidate
and the next unit writes it. It could equally return nothing at all, which ADR-0163 established is a
result.

**What I predict the calibration will show** — the window run against the 34 addresses this catalogue
has ruled on, which is the known answer: the demand axis reaches the three package-backed published
contracts and misses the three traps; this axis reaches the traps. I predict the two together reach
more of the six than either alone, and I do not predict either reaches all six.

## What would reopen this

* **A candidate below the bound that is not a language trap.** This window does not reach one, which
  is stated above rather than found at the end. The open entry survives this search narrowed to
  exactly that band, and what would reach it is an enumeration of the ecosystem that does not need a
  floor — which nothing available provides.
* **The standard library growing.** The population is a snapshot of one runtime at one version. Every
  proposal that reaches stage 4 adds operations to it, and each addition is a row this sweep did not
  read. The sweep is cheap to re-run and names the commit and runtime it was taken on so that it can
  be.
* **A refusal ground being wrong.** R1 to R12 are read off twenty-seven refusals, and a refusal can be
  wrong — ADR-0163 found that one of the two legs ADR-0158 gave `string/camel-case` was refuted. A
  ground that falls reopens every candidate this search refused under it.
* **The registry gaining a readable spelling for a function argument.** R9 refuses higher-order
  candidates on the catalogue rather than on themselves, which is ADR-0163's own reopening trigger
  arriving here as a rule.

## More Information

* [ADR-0191](0191-a-demand-signal-decides-what-is-measured-and-never-what-is-refused.md) is the
  criterion this search is conducted under, and the record whose surviving entry it answers.
* [ADR-0163](0163-there-is-no-eighth-contract-and-the-case-family-came-closest.md) is the second
  search, the record that declared the bound, and the source of R1, R4, R9 and R10.
* [ADR-0158](0158-the-seventh-contract-is-object-deep-equal-and-ten-refusals-say-why.md) is the first
  search and the source of R2, R3, R5, R6, R7, R8, R11 and R12.
* [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) is why the method is
  committed before the search rather than written up beside its result.
* [ADR-0018](0018-a-published-count-carries-its-coordinates.md) is why every figure below carries the
  commit it was measured at and the population it counted.

### Why `confirmed-by` is empty

The subject of this record is which evidence may enter a search, and a search is argued in prose in a
record. Nothing here reads a record's reasoning — the closure four entries of `CLAUDE.md`'s open list
already name, price and refuse as a lint over prose. It is declared rather than left blank, on
[ADR-0186](0186-a-decision-that-rules-no-code-declares-that-absence-with-its-reason.md)'s rule for the
neighbouring field.

### Coordinates

The method above was written against this repository at **`ea00a08`**, on **2026-09-01**, with the
working tree clean and `pnpm meta` green at **10 files and 115 tests**. The runtime the sweep is taken
on is **Node v24.15.0**. No probe had run when this half was committed.
