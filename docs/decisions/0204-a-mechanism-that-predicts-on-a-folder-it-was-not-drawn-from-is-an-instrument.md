---
status: accepted
date: 2026-09-02
governs:
  - mutation/registry-storage.battery.ts
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

To be measured against the table above, in the commits that follow it.

## Consequences

To be measured.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense
for that reason.

**A third slice reopens the two rates**, and this record says in advance what that would have to
answer: whether a third point bounds the error of an extrapolation to 177, or whether the method
cannot produce that figure at all.

**A guard resisting by M2 reopens the prediction above**, which names no such guard in this folder.

**A mechanism found while searching, and not named above, reopens both records.** Predicting it
afterwards does not count, and this paragraph is what makes that checkable.

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
