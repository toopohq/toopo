---
status: accepted
date: 2026-09-02
governs:
  - mutation/registry-storage.battery.ts
  - mutation/mutants.ts
  - CLAUDE.md
confirmed-by: []
---

# A mechanism that predicts on a folder it was not drawn from is an instrument

## Context and Problem Statement

ADR-0203 isolated eleven of `packages/site`'s sixteen reciprocal-pair guards, refused to price the
judgement half of the 177, and named the reading that would let it be priced: **a slice in
`packages/registry` — 9.4 % already isolated, 262 guards declared unprobed — would say whether the
residue of a barely-probed folder is easier or harder.**

It also left two mechanisms behind, each stated as recognisable *before* a cell is written:

- **A total guard over a population shadows every guard whose subject is that population.**
- **A guard whose input population is a subset of a neighbour's, for a reason that is a different
  design decision, is shadowed by that neighbour.**

Those two were read off `packages/site` after the fact. **An observation read off the folder it was
drawn from is not yet an instrument**, and the difference is testable in one direction only: predict
with them on a folder they were not drawn from, write the prediction down first, and then measure.

So this unit does two things that are one thing. It takes the slice that record asked for, and it
commits a per-guard prediction before the first cell exists — which is why this record's own history
has the prediction in a commit of its own, on the discipline ADR-0192 established when it committed a
search's acceptance rule before its first probe.

## Decision Drivers

- **A mechanism that predicts is worth more than a mechanism that describes.** ADR-0203's two are
  stated as computable in advance; nothing has yet asked them to answer in advance.
- **A slice does not choose itself on its difficulty.** ADR-0203 wrote its rule down before looking at
  the guards it yielded, and that is the only thing that stops a rate being the easy half of one.
- **A cell must aim at one guard**, and **a guard is not rewritten to make a cell work.** Both are
  ADR-0203's and neither is relaxed here.
- **A bound extrapolated from one member of a population states the cost of that member.** ADR-0199.
  Two members are two members, and this record says so rather than averaging them.

## The 22, rebuilt before being used

`mutation/results/` is ignored, so ADR-0200's census and ADR-0203's re-reading of it are both
readings that have to be rebuilt to be used. They were, by ADR-0203's own stated rule, over the
artefacts on disk at `dea8ab3`.

**Everything reproduces, to the unit.** 1 608 collected, 304 alone, 943 never alone, 361 never red;
546 inseparable in 135 classes; 397 with a red pattern of their own; **166 one companion away**; and
`packages/site`'s row at 95/88/4 with its share of the one-companion-away population at 18. The three
checks that make it a reading rather than an assertion pass with nothing to report: the three classes
partition the collected population in every one of the thirteen folders, every guard that reddens is
one the attribution collected, and no column names a guard in two buckets.

`packages/registry` is **466 collected, 44 alone (9.4 %), 149 never alone, 273 never red, 22 one
companion away**, over the 104 cells of one battery.

## The slice, and why it is this one

**All 22.** Total over `packages/registry`'s one-companion-away population, so there is no selection
and therefore no possibility of having taken the easy half.

Three reasons, written before the guards were looked at:

1. **The reopening clause asks about the folder.** A sub-slice answers it about the sub-slice.
2. **ADR-0203's shape is a subset of this one.** Seven of the 22 sit in reciprocal pairs, so the
   like-for-like comparison with 11 of 16 is recoverable *inside* a total reading. The converse is not
   available: a reciprocal-only slice cannot be widened after the fact without choosing.
3. **The audit is one replay whatever the count.** `packages/registry` is injected into by exactly one
   battery, so totality costs search time and not audit time.

**The structure the rule was fixed against**, with the guards still anonymous: 22 guards, 12
components over 26 nodes, 7 reciprocal pairs, 3 guards whose only companion is already load-bearing,
5 guards in two wider components, 20 with one companion and 2 with two, and **16 two-red cells out of
104**.

### How it is not representative, stated rather than smoothed

| | `packages/site` | `packages/registry` |
| --- | --- | --- |
| cells per collected guard | 167 / 187 = **0.89** | 104 / 466 = **0.22** |
| never red | 4 of 187 | **273 of 466**, 262 of them declared `unprobedClaims` |
| already isolated | 45 % before ADR-0203 | **9.4 %** |

The residue here has survived a quarter of the site's probing, which biases the isolable fraction
**upwards** — the opposite direction from ADR-0203's own first bias, and that is what makes the pair
of readings worth having rather than two samples of one thing.

Against it: this is the folder where the catalogue's answers are serialised, and a shared
serialisation with many consumers is exactly the first mechanism's own condition, which biases
**downwards**. Neither bias is measured, for ADR-0203's reason.

**A third difference is not a bias but a fact about the population.** Two of the 22 are two rows of
one `it.each` — `a-commit-that-cannot-say-what-it-bound-is-refused-1` and `-2` — so they are one
written guard answering to two addresses. Nothing in `packages/site`'s slice had that shape.

## The prediction, written before the first cell

Committed before any cell of this unit existed. `M1` is the total-guard mechanism, `M2` the
subset-population mechanism, both ADR-0203's. `M3` is **this unit's own** and is therefore not a test
of that record: *an exact expectation over a value shadows every guard asserting a property of that
same value, for every arm whose effect the exact value shows.*

| | guard | prediction | why |
| --- | --- | --- | --- |
| R01 | `a-binding-that-names-no-commit-is-not-asked-about` | isolable | the `asked` counter is a claim no other guard of this folder reads |
| R02 | `a-commit-that-cannot-say-what-it-bound-is-refused-1` | isolable | the runner clause and the arity clause are two choices; dropping one leaves the other row refusing |
| R03 | `a-commit-that-cannot-say-what-it-bound-is-refused-2` | isolable | the same, from the other side |
| R04 | `a-content-addressed-answer-is-public-for-a-year-and-immutable` | isolable | aim at the value this class declares; the differential guard beside it reads the *named* base and never this one |
| R05 | `a-contract-not-yet-published-carries-the-current-banner` | resists — M3 | it and R21 read one constant, and the only registry-side defect available is in that constant, which reddens both |
| R06 | `a-learned-term-is-one-the-contract-was-not-already-found-by` | resists — M1 | the corpus of real queries is total over the matching rule its claim is a property of |
| R07 | `a-miss-names-the-words-no-contract-carries` | isolable | the *order* of `unknownWords` is read here and nowhere else |
| R08 | `a-named-answer-is-public-and-revalidated-before-every-use` | isolable | R04's argument on the other class |
| R09 | `a-query-the-catalogue-cannot-answer-answers-nothing` | resists — M1 | R16 is total over the 91 words the catalogue declares and sweeps the same floor these 28 queries are refused by |
| R10 | `a-query-with-no-words-answers-nothing` | isolable | its own comment says the zero-score arm is reachable by this input alone |
| R11 | `a-rendered-binding-is-what-a-past-commit-prints` | isolable | a format drift the lenient reader tolerates leaves the round trip green |
| R12 | `a-rendered-set-of-bindings-reads-back-as-itself` | isolable | R11 never calls the reader, so a reader defect is invisible to it |
| R13 | `a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers` | isolable | by its own comment it is the only guard holding the ceiling on the set-aside allowance |
| R14 | `a-shared-dependency-is-resolved-once` | isolable | dropping the dedup duplicates a name, and the order property survives a duplicate |
| R15 | `a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare` | resists — M1 | the profile guard is total over the same lifecycle map |
| R16 | `a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing` | isolable | the unknown-word penalty is a choice the 28-query list does not reach |
| R17 | `every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not` | isolable | deriving revalidation from the lifetime leaves both literal strings intact and breaks one arm of the perturbation |
| R18 | `every-file-a-published-contract-freezes-is-served` | resists — M1 | R20 is the total closure over every address a served answer names |
| R19 | `nothing-is-written-before-what-it-imports` | resists — M3 | R14 pins the exact ordered list, so every order defect reddens it too |
| R20 | `the-emitted-tree-is-closed` | isolable | an address a snapshot names and nothing serves, outside the harness R18 re-derives |
| R21 | `the-licence-file-shows-the-banner-a-reader-would-receive` | resists — M1 | the byte-for-byte header guard is total over what `licenceHeaderOf` composes |
| R22 | `the-revision-of-a-clean-tree-is-the-commit-git-names` | isolable | the clean branch is a choice, and the companion guard reads the dirty one |

**15 isolable, 7 resisting: five by M1, two by M3, and none by M2.** That last is a prediction in its
own right and the sharpest one here — ADR-0203's second mechanism is predicted to fire on nothing at
all in this folder, so a guard resisting by it would say the mechanism generalises further than this
prediction does.

## Decision Outcome

**Fourteen of the twenty-two are isolated, I-82 to I-90 and S-31 to S-35, one cell apiece, each red
alone in a real battery run.** Eight are not, and each carries the reason it resisted.

### What the prediction scored

**Fifteen of twenty-two outcomes right, which is 68 %.** The seven wrong are R06, R09, R12, R13, R15,
R16 and R22 — three predicted to resist and isolated, four predicted isolable and resisting.

**The mechanisms score better than the outcomes, and that is the finding.** Of the four guards
predicted to resist *by a named mechanism* and which did resist, three carry the mechanism named —
R18 and R21 by the total-guard shadowing, R19 by the exact-value shadowing. The fourth, R05, resists
for a reason that is not the one predicted: the label was M3 and the reason written beside it was the
shared constant, which is a different shape and is named below.

**So M1 predicts where it fires and not where it does not.** It was named on five guards and fired on
two of them, and it also fired on R12 where nothing was predicted. Every guard it was named on that
isolated — R06, R09, R15 — isolated on the **first** candidate, so those three were not close calls.

**And the sharpest prediction was wrong.** *None by M2* was written down as the most falsifiable claim
here, and R22 resists by M2 exactly: `the-revision-of-a-clean-tree-is-the-commit-git-names` asserts
`theRevision(repository) === git('rev-parse', 'HEAD')`, and its companion asserts that same equality
in the middle of its own case, between a dirty tree and an untracked file. Its population is a subset
of the companion's for the reason ADR-0203 gives — the companion's subject is the refusal, which is a
different design decision — and it has no arm outside it, because the shape assertion beside it tests
the very value the equality already pins. **M2 generalises, and what says so is a prediction that it
would not.**

### What was isolated

| guard | the defect the cell injects |
| --- | --- |
| `a-binding-that-names-no-commit-is-not-asked-about` | asks the past about every binding, anchored or not |
| `a-commit-that-cannot-say-what-it-bound-is-refused-1` | accepts any runner so long as it takes one path |
| `a-commit-that-cannot-say-what-it-bound-is-refused-2` | accepts anything after the one path |
| `a-content-addressed-answer-is-public-for-a-year-and-immutable` | holds a frozen answer for a month |
| `a-learned-term-is-one-the-contract-was-not-already-found-by` | learns a second phrase beside the one that buys something |
| `a-miss-names-the-words-no-contract-carries` | names the first unplaceable word rather than all of them |
| `a-named-answer-is-public-and-revalidated-before-every-use` | exempts a private cache from revalidating |
| `a-query-the-catalogue-cannot-answer-answers-nothing` | takes the allowance's two clauses from different fields |
| `a-query-with-no-words-answers-nothing` | excuses a wordless query from the deliberate-field check |
| `a-rendered-binding-is-what-a-past-commit-prints` | ends the ledger on a blank line the reader forgives |
| `a-shared-dependency-is-resolved-once` | resolves a shared dependency once per dependent |
| `a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare` | teaches a true phrase to the contract that could still declare it |
| `every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not` | derives revalidation from the lifetime |
| `the-emitted-tree-is-closed` | serves a contract's own files and not the ones its guards call |

**Two of the fourteen are worth more than their own guard.**

`every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not` is isolated by a defect
under which **both served headers come out byte for byte what they were**. A named answer declares a
zero lifetime and asks to be revalidated, so deriving the second from the first renders
`public, max-age=0, must-revalidate` exactly as before, and a content-addressed answer asks for
neither. Nothing a host receives changes; what changes is that the field has stopped being read.

`a-rendered-binding-is-what-a-past-commit-prints` is isolated by a drift **the reader forgives**, and
it is the only kind available: the renderer and the reader are a matched pair with a round trip over
them, so every defect that changes what a line means reddens both. A trailing blank line parses back
to the same bindings and is not the format this repository writes once.

### What resisted, with what was looked for

**By the total-guard mechanism — three.**

- **`every-file-a-published-contract-freezes-is-served`.** `the-emitted-tree-is-closed` reads every
  64-hex digest back out of the served bytes, so any blob a snapshot names and the tree does not serve
  reddens it. Measured in both directions: narrowing `filesNamedBy` to the harness reddens the closure
  alone, and narrowing it to the shared harness reddens **both**. The way out would be a snapshot that
  stops naming the file as well, which is inside the digest and reddens the freeze.
- **`the-licence-file-shows-the-banner-a-reader-would-receive`.** Its two injectable inputs are
  `THE_CURRENT_BANNER`, which R05 reads too, and `licenceHeaderOf`, which
  `every-file-the-installer-copies-is-marked-mit-0` compares byte for byte against seven contracts'
  own files. Measured: collapsing the banner branch reddens **that guard alone** and leaves this one
  green, LICENSE's quoted example still being one of the forms composed.
- **`a-rendered-set-of-bindings-reads-back-as-itself`.** The reader is on the freeze check's critical
  path, so every defect in it reaches the end-to-end guards: swapping the pair reddens six, and
  testing the address for being a digest reddens seven. Its own region — a round trip that fails while
  a past commit's output still parses — needs a defect keyed to something that output has and the
  local rendering does not, and the two texts are the same shape.

**By the subset-population mechanism — one, where none was predicted.** R22, above.

**By one declaration read by two guards — three, and this is the shape nobody had named.**

- **`a-contract-not-yet-published-carries-the-current-banner`.** Both its injectable inputs are shared
  with R21: the constant, and the refused contract's own declared banner. Measured in both directions —
  flipping the constant reddens two, and giving the one contract bound by nothing the superseded header
  reddens four.
- **`a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers`** and
  **`a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing`.** Both are
  populations over the matching rule, and so are their neighbours. Five candidates and three: two were
  **inert** — requiring a field's word to be spelled in full, and charging a point for a word the
  contract cannot answer, change no answer this catalogue gives — and the rest reddened the corpus, the
  negative half or the declared aliases beside the guard aimed at.

**The eight that resisted are exactly the eight the census still reads as one companion away**, which
is the coherence check that says the reading and the search are about the same thing.

### A fourth mechanism, and it was not predicted

**Two guards whose subject is one declaration — a rule or a constant — are separable only by an arm
one of them has outside it.** A population, however differently chosen, is not such an arm.

It is not M1: neither guard is total over the other's population. The twenty-eight requests of
`a-query-the-catalogue-cannot-answer-answers-nothing` are a hand-written list and the ninety-one words
of its neighbour are a declaration; neither contains the other, and yet every plausible defect of the
allowance opens both, because the twenty-eight hold queries of the ninety-one's own shape.

**What separates the two is which of them has an arm outside the rule.** The list of requests carries
a second assertion — that the one query answered while naming what it could not place still answers —
so it reddens on a *tightening* as well as on a loosening, and that is the arm its cell aims at. Its
neighbour's three assertions are all the rule. So the one with the extra arm is isolated and the one
without it is not, which is something a reader can apply before spending a candidate.

**Naming it afterwards is worth less than naming M1 and M2 in advance, and this record says so
rather than presenting four mechanisms as one finding.**

## What this prices, and the verdict on the 177

### Two rates, side by side

| | `packages/site`, ADR-0203 | `packages/registry`, here |
| --- | --- | --- |
| the slice | 8 reciprocal pairs, 16 guards | **all 22**, total over the folder |
| isolated | 11 of 16 = **69 %** | 14 of 22 = **64 %** |
| candidate runs per cell | 1.27 | **1.21** |
| candidate runs per refusal established | not spent — argued from structure | **2.0** |
| already isolated before the slice | 45 % | **9.4 %** |
| cells per collected guard | 0.89 | **0.22** |

**The two isolable fractions agree within five points on the two folders this repository can make most
different.** `packages/registry` had been probed at a quarter of the site's density and had a fifth of
its already-isolated proportion; ADR-0203 named that as the axis along which the residue would be
easier or harder. **It is neither.** So whatever the two biases that record named are worth, they are
worth less than five points between these folders, or they cancel.

### What ADR-0203's table under-costed, and by how much

That table prices the search at 1.27 candidates per **isolated** guard, which counts the runs that
produced a cell and none of the runs that established a refusal. Measured here: **33 candidate runs
over 22 guards**, 17 aimed at guards that isolated and 16 at the eight that did not. So the multiplier
is **1.5 runs per guard of the 177** and not 1.27 per cell.

Rebuilt at 1.5, keeping each folder's own suite time as that record did — and its registry row goes
416 s to **492 s**:

| folder | of the 177 | suite run | search |
| --- | --- | --- | --- |
| `packages/cli` | 40 | 10.8 s | 648 s |
| `packages/site` | 29 | 5.4 s | 235 s |
| `packages/registry` | 22 | 14.9 s | 492 s |
| the seven contracts | 77 | 1.4 s | 162 s |
| `packages/validation` | 5 | 2.5 s | 19 s |
| `packaging` | 2 | 14.9 s | 45 s |
| `mutation/fixture` | 2 | 39.4 s | 118 s |
| | **177** | | **≈ 1 719 s** |

**The conclusion does not move**: the machine half of the whole debt is still under two hours, search
plus one full replay. What moves is which half was priced, and the correction is 18 % — inside the
sixth ADR-0200's floor puts on any one reading of a battery anyway.

### The verdict

**The isolable fraction is publishable and the authoring cost is not.**

Publishable, with its rule: two folders, chosen for maximal difference on the axis that was supposed
to decide it, isolate **64 % and 69 %** of their one-companion-away residue. Over the 177 that is
**113 to 122 cells**, and the sentence carrying it has to say *two folders* and never *a sample* —
with n = 2 there is no interval, and what makes the pair worth reading is the agreement rather than
the arithmetic.

**What is still refused is a figure for what authoring 177 cells costs, and the reason has changed.**
ADR-0203 refused it because two biases of unknown size pointed in opposite directions; this unit
measured that those biases are small, so that reason is gone. What replaces it is that **nothing in
either record measures authoring at all** — every figure in both is a count of runs, which is the
machine's half. The judgement half was never the biases; it is that nobody has timed a person writing
one of these cells.

**So a third slice would not close it, and that is the answer this unit owes.** A third folder would
produce a third isolable fraction near two thirds and a third candidate rate near 1.3, and neither is
the number that is missing. What would close it is a different measurement — the wall-clock cost of
authoring, recorded by whoever does it — and that is not a measurement this method produces at any n.

## Consequences

- **Fourteen cells, I-82 to I-90 and S-31 to S-35, in `mutation/registry-storage.battery.ts`.** The
  battery goes from 104 to **118 cells** — 113 killed, 5 survivors, nothing disagreeing. **The runner
  prints no duration of its own**, so what is stated is a bound: 24 min 20 s separate the commit it
  measured from the artefact it wrote, and it was launched inside that.
- **The README's three figures move and are derived rather than transcribed**: 854 defect cells to
  868, 812 caught to 826, survivors unmoved at 42.
- **The census is untouched.** No guard was added, so `mutation/census.ts` is byte-identical, and the
  folder still collects 466 guards over 24 files.
- **ADR-0200's and ADR-0203's censuses are not rewritten.** Both are stamped and stay there; CLAUDE.md's
  entry carries the new figures with their own coordinate and says which folder moved.
- **The registry battery's share of its gate grows** by about three minutes, which is the entry about a
  bound nobody compares with what a battery costs, arriving for the second unit in a row.

### What the census says afterwards, and why it is published twice

Re-read at `32e31ec` — **`packages/registry` from this unit's own replay and the other twelve folders
carried from ADR-0200's at `257425c`**, which is a mixed perimeter and is named as one:

| | ADR-0203 | here, as the run left it | here, corrected |
| --- | --- | --- | --- |
| collected | 1 608 | 1 608 | 1 608 |
| alone | 304 | 317 | **318** |
| never alone | 943 | 930 | **929** |
| never red | 361 | 361 | 361 |
| inseparable | 546 in 135 classes | 543 in 134 | **544 in 134** |
| own red pattern | 397 | 387 | **385** |
| one companion away | 166 | 154 | **152** |

`packages/registry`'s own row goes 44/149/273 to **58/135/273** corrected, and its share of the
one-companion-away population 22 to **8**. The collected total does not move, because a cell is not a
guard.

**There are two columns because one guard of this folder reddens under load**, and the correction is
not a rounding. `the-served-bytes-are-the-committed-bytes` hashes every harness file of seven
contracts against its own git blob — a child process per file — and this folder's configuration
declares no `testTimeout`, so it runs under vitest's default 5 000 ms. It reddened on `I-38`, which
edits `emit.ts` and has **no causal path** to a comparison between `serialiseContract`'s output and
what git holds; ADR-0200's replay has it green there, and run alone its file finishes its twenty
guards in 1.66 s.

**What that one spurious red did is worth more than the figures it moved.** A pin is checked as a
subset, so the cell still reads `killed`, still agrees, and the battery still exits 0 — nothing this
instrument holds reports it. What it did to the census is:

- it took `an-edge-is-followed-to-the-artefact-it-names` **out of the isolated bucket**, `I-38` being
  its only sole-red cell, so a load flake un-isolated a load-bearing guard;
- and it manufactured a **reciprocal pair** out of that guard and the noisy one — two guards with no
  relationship to each other, reading as the sharpest form of one-companion-away.

So a rebuild of ADR-0200's census on a loaded machine has more one-companion-away guards than one on
an idle machine, and no published figure anywhere says which kind of machine it was taken on. It is
recorded rather than repaired: raising a timeout is a decision about what a guard may cost, and this
unit's subject is what a guard can be seen alone on.

## What would reopen this

**Two of the four triggers this section was committed with fired inside the unit that wrote them**,
and they are kept as they were rather than tidied, because a trigger that fires is the only kind that
has been shown to work.

**A guard resisting by M2 reopens the prediction above**, which names no such guard in this folder.
**Fired**: R22, and it is the finding of the prediction half.

**A mechanism found while searching, and not named above, reopens both records.** Predicting it
afterwards does not count, and this paragraph is what makes that checkable. **Fired**: the fourth
mechanism, one declaration read by two guards, which is named as unpredicted for exactly that reason.

**A replay at a later commit reopens every figure here**, and none is written in the present tense for
that reason.

**A third slice reopens the two rates** — and this record has already answered what it would buy, so
what would reopen *that* answer is a slice whose isolable fraction falls outside 64 to 69 %. A third
reading inside that band settles nothing and the verdict above says so.

**A reading of this folder's census on an idle machine reopens the corrected column**, which is one
run with one spurious red removed by an argument about causality rather than by a second measurement.
The cheap form is `I-38` re-run alone; it is not taken here, because what the correction establishes
is a hazard of the method and not a figure this unit depends on.

**And a `testTimeout` for `packages/registry` retires the column entirely**, which is a decision about
what a guard may cost that nobody has taken.

## More Information

The 22 were rebuilt from ADR-0200's own stated rule over the artefacts of the replays on disk at
`dea8ab3`: a guard is *collected* when any attribution bucket of any column of the folder names it,
*alone* when some cell's `failedGuards` holds it and nothing else, *never alone* when it reddens and
never by itself, and *one companion away* when some cell reddens it beside exactly one other guard,
read over every never-alone guard. A cell is addressed by `(battery, mutant, arm, lens)`.

A *reciprocal pair* is ADR-0203's shape: each guard's only two-guard companion is the other. Three of
the 22 have a single companion that is **already load-bearing**, which reads like a reciprocal pair to
a sweep that does not check the companion's own bucket and is not one — the pair is already separated
in one direction.

Candidates were searched for by mutating `packages/registry` and running that folder's suite exactly
as `run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` and the folder's
own configuration — and reading the failed guards out of the JSON report. That is a search tool and
never the measurement: **every pin here comes from a real battery run**, and because a pin is checked
as a subset, *alone* was audited by reading `failedGuards` back off the battery's own artefact — 14 of
14, one red apiece, every cell `killed` and agreeing.

**The search tool was given a type-error check part way through, and it is why all fourteen were
re-run.** A mutant that fails to typecheck still runs: vitest reports the type errors separately and
executes the JavaScript anyway, so a candidate can read *red alone* while being a cell the compiler
refuses — which is `killed-by-typecheck` under a pin that says `killed`, the state ADR-0200 found
`number/parse@1`'s `N-4` in. All fourteen report `Type Errors  no errors` beside their single red.

```sh
npx tsc -p tsconfig.json --noEmit     # exit 0
pnpm run anchors                      # 805 anchors across 104 files, 0 loose
pnpm run registry                     # 466 passed
npm run battery -- registry-storage   # 118 cells, 0 disagreeing, exit 0
pnpm run meta                         # 10 files, 120 passed
pnpm run freeze                       # 3 passed - no published binding moved
```

**No digest could have moved and it is measured rather than argued**: `git diff --name-only
dea8ab3..HEAD -- contracts packages/catalogue` names nothing, so neither a contract's own files nor
either of the two shared ones was touched, and the freeze is green beside that reading rather than in
place of it.
