---
status: accepted
date: 2026-09-04
governs:
  - mutation/registry-storage.battery.ts
  - CLAUDE.md
confirmed-by: []
---

# A family is one sentence asked of seven contracts, and what breaks that is vacuity rather than disagreement

## Context and Problem Statement

ADR-0209 published an arithmetic and named its own weakest joint in the same paragraph. **145 of the
262 are parameterised over a contract, in 21 families**, 117 stand alone, and therefore *if a family
collapses to one cell, the 262 are at most 138 aiming decisions and never 262*. Beside it, in as many
words: **whether a family really collapses is measured once and assumed twenty times, and that is the
weakest joint in the arithmetic.** One family had collapsed — `a-record-survives-the-wire`, seven
members for one cell — and nothing had ever tested the claim on another.

**The standalone half is exhausted, so the 138 is now the whole of what is unpriced.** ADR-0210 took
the twenty standalone guards in wholly unprobed files and ADR-0211 took the seventy in probed ones;
between them they read **90 of 90** and witnessed 79, and `unprobedClaims` fell 262 → 228 → 201 → 129.
What is left is almost entirely the parameterised half, and its price rests entirely on a single
measurement taken once.

**The population moved while nobody was reading it, and it is rebuilt here rather than carried
forward.** Measured at `1238833` off the 215-cell artefact ADR-0211 replayed at `14bd274`: the 129
are **120 parameterised rows in 19 families and 9 standalone**, where ADR-0209 read 145 in 21 and 117.
Two families left the bucket entirely and eleven lost a row apiece — which is ADR-0211's own cell, the
one that stops a contract serialising and reddens that contract's row across eleven families at once.

## Decision Drivers

- **The definition does not move.** A1, A2 and the narrowest-defect discipline are committed at
  `68e466a`, including its family exception — *a defect may be the failure condition several guards
  name*. This is the population that most solicits a relaxation of that exception, and relaxing it
  here would make the number rather than measure it.
- **A1 and A2 apply row by row, and the shortcut is invisible in the count.** A cell that reddens
  seven rows without being the failure condition of seven has witnessed one and reddened six
  incidentally. The audit is therefore per member and not per cell, and the record publishes the
  member-by-member decomposition rather than a family's verdict alone.
- **The mechanism is worth more than the rate.** ADR-0209 says a family collapses when one defect is
  the failure condition all its members name, and that *nothing says the other twenty families have
  such a defect available*. Naming what actually decides it, in advance, is the finding this unit is
  for; the rate is what tests the naming.

## The structure, read mechanically before any sentence

Three readings, all off the artefact and the control report, none of which prints a guard's sentence
or opens a test file. The control is `pnpm run registry` at `1238833` — **466 collected assertions,
466 passed, 24 files, 10.53 s, exit 0** — joined to the attribution of the 215-cell artefact.

**The join is total in both directions.** 123 load-bearing + 204 never alone + 10 out of reach + 129
unprobed claims = **466**, with nought unaccounted for, nought wrongly declared silent, nought
disagreeing, 210 killed and 5 survived. That is ADR-0211's published row `123/204/139` reproduced
exactly, the 139 being the ten out of reach plus the 129.

**Every family carries exactly seven rows, and they are the seven distinct contract slugs — 19 of
19.** So a family is not a resemblance between separately written guards. It is **one guard title
parameterised over the whole catalogue**, expanded by the runner into one row per contract, which the
artefact addresses individually because `failedGuards` holds expanded names.

**Thirteen rows of the slice are already witnessed**: ten families stand at six silent rows of seven,
one at four of seven, and eight at seven of seven.

## The rule, fixed before a guard of the slice was read

**Every family of `unprobedClaims` in `packages/registry`.** All nineteen, total over the population
as it stands, with no selection and no easy half — which is the shape ADR-0211 reached for and the
only shape that can settle a claim about *the other twenty*.

**One aiming decision per family, and the measurement is how many of that family's silent rows the
resulting cell witnesses**, audited row by row against A1 and A2. A family *collapses* when one cell
witnesses every silent row it has. A family that does not collapse is recorded as not collapsing,
with the count of rows the cell does witness; this unit does not then buy a cell per remaining row,
because what is under test is the collapse and not the coverage.

**What was seen when this rule was fixed**: the counts above and nothing else. No guard address was
printed, no sentence was read, no test file was opened. The three scripts that produced the counts
emit sizes and never names, deliberately.

## The prediction, committed here

**The mechanism first, because it is the claim under test.** ADR-0209 locates the risk in whether a
defect exists that all seven members name. Under the structure measured above that is the wrong
place to look: the seven members **are one sentence**, so any edit to the shared path is by
construction the failure condition each of them names, and A2 holds for each row because the row's
subject is that contract's instance of the very thing broken. The risk is therefore not disagreement
between members. It is **vacuity**: a row whose contract has no instance of what the clause
quantifies over is green whatever the shared code does, and no cell can witness it. So —

> **A family collapses iff its clause is non-vacuous for all seven contracts. Where a family fails to
> collapse, the missing rows are the contracts whose data does not instantiate the clause, and never
> contracts whose sentence names a different condition.**

**The rate: 17 of 19 families collapse to one cell.** The bias is declared **upwards** — the
prediction trusts the parameterised shape, so the way it is wrong is that vacuity is commoner than
one family in ten. The 120 silent rows are therefore predicted to be witnessed by **19 to 25 cells**.

**The family standing at four silent rows of seven is one of the two predicted to fail**, and it is
the only observable in the artefact that argues for a failure at all: three of its rows were
witnessed by cells that left the other four silent, which is direct evidence that its defect space is
per contract. The ten families at six lost their row to one contract-specific cell and that says
nothing against collapse.

**Three sub-predictions, each falsifiable on its own.** The price is at or below 1.3 candidate runs
per cell written, so about 25 runs and four minutes of machine at the 9.4 s the folder's suite takes.
No family is witnessed by a cell that reddens rows it does not witness — that is the A2 shortcut, and
predicting its absence is what makes the row-by-row audit worth publishing. And the verdict on
ADR-0209 comes back **held in form and corrected in figure**, the ceiling today being 9 + 19 = 28
aiming decisions for 129 guards rather than 138 for 262.

**Three outcomes are named in advance so that none can be read afterwards as a rescue.**

- **Seventeen or more of nineteen collapse.** The 138's form is held, the parameterised half is
  cheap, and this is the predicted and least informative result.
- **Ten to sixteen collapse.** The form holds and the factor is materially worse than one cell per
  family; the correction is publishable and the ceiling moves.
- **Nine or fewer collapse.** The 138 is refuted, the parameterised half is not cheap, and that is
  the more useful of the two because it corrects a published figure.

**Four forms of being wrong are named beside them.** A family failing to collapse because its rows
genuinely name different conditions refutes the mechanism outright and says *family* is the wrong
abstraction for this population. A cell reddening seven rows while satisfying A2 for fewer is the
shortcut this record refuses, and it is invisible in a count. Vacuity making a row **unreachable**
rather than merely unwitnessed would move it to `unreachableGuards`, which is ADR-0211's third
mechanism arriving on the parameterised half. And a price dominated by reading rather than by runs —
seven A1/A2 judgements per cell instead of one — would leave the runs-per-cell figure intact while
making the arithmetic wrong about what a family costs.

## Decision Outcome

**Fourteen of nineteen families collapse to one cell.** That is the middle of the three outcomes named
in advance — ten to sixteen — and not the one predicted. The prediction was seventeen, the bias was
declared upwards, and it was upwards by three.

**The count was fifteen until the instrument refused it, and the correction is the mechanism arriving
a second time.** `409ab48`'s message says fifteen. The replay reported one guard unaccounted for —
`every-export-is-carried-or-declared-uncarried-number-parse` — because `I-167` drops a contract's
first own declaration and `number/parse@1` has none: its entry in the catalogue says in as many words
that it is the one contract publishing nothing beyond the shared seven. So that family takes five of
its six silent rows and leaves one, which is not a collapse. **The commit message is left as it stands
and this is the correction**, on the rule this repository already applies to a stamped figure.

### The mechanism, named incompletely rather than wrongly

The prediction said a family collapses iff its clause is non-vacuous for all seven contracts, and that
where a family fails, the missing rows are the contracts whose data does not instantiate the clause.
**That is the per-row form of the real mechanism and it misses the whole-family form**, which is what
three of the five resisters are.

> **A family collapses when a shared derivation of this folder lies between all seven rows and the
> sentence. A row resists when, for its own contract, nothing of that derivation is exercised.**

Vacuity is that rule read one row at a time; the absence of a shared derivation is the same rule read
over the whole family. One mechanism at two scales, and the prediction named only the smaller.

**The five resisters, each measured rather than argued.**

| family | silent rows | the cell witnesses | why the rest resist |
| --- | --- | --- | --- |
| `every-produced-profile-exists` | 6 | 1 | `producedBy` is declared by two contracts of seven |
| `every-export-is-carried-or-declared-uncarried` | 6 | 5 | `number/parse@1` declares no own declarations |
| `every-declared-type-occurs-in-the-contract` | 7 | 0 | no derivation between the two sides |
| `every-uncarried-export-exists` | 7 | 0 | no derivation between the two sides |
| `every-own-declaration-is-an-export` | 7 | 0 | no derivation between the two sides |

**The first two are vacuity and they are quantified.** `producedBy` is declared by `number/parse@1`
and `array/group-by@1` and by nobody else, so on five contracts that guard quantifies over an empty
set and is green whatever the serialiser does; `I-165` names a profile by its description, falsifying
every producing expression at once, and reddens exactly the two rows that can redden — one already
witnessed. **The first candidate was thrown away for measuring the same thing badly**: dropping the
first profile reddened `array/group-by@1` alone, the row already witnessed, so it took none of the
six.

**The other three read a contract's own declarations against each other**, and no module of
`packages/registry` stands between the input and the assertion. Measured, one edit to one contract's
entry in `the-catalogue.ts` reddens **one row**: 1 red for the first, 2 for the second of which one is
its own family's, and for the third the only edit found stops that contract serialising and reddens
**66 guards to witness one**. Each costs seven cells rather than one.

**The sibling that does collapse is what makes the reading a mechanism rather than a description.**
`every-uncarried-export-carries-a-reason` sits in the same file as two of the three and reads the same
`source.notCarried` — and it collapses, because the *reason* every contract gives is
`SERVED_AS_A_FILE`, one constant in `serialise.ts`. Emptying it reddens all seven rows and nothing
else. Three sibling guards over one declaration, one with a shared derivation behind it and two
without, and the rule separates them correctly.

### What A1 and A2 turn out to be, on this population

A family is one sentence asked of seven contracts, so **A2 is decided once per family and A1 once per
row**. Whether the defect's plainest description names the sentence does not vary by contract; whether
the claim is falsified there does. That is a property this population has and neither earlier slice
did, and it is why the family exception at `68e466a` is sound here rather than a licence.

**Two cells serve two families apiece, and both are that exception used as written.** `I-169` renames
the environments field inside the frozen half: the snapshot then serves a field nothing classifies —
`every-field-a-snapshot-serves-is-classified` — *and* carries a field the record does not,
`a-snapshot-invents-no-field`. Two clauses of one defect, one sentence each. `I-175` does the same for
`an-implementation-binding-carries-no-frozen-field` and
`the-frozen-half-and-the-standing-half-partition-an-implementation`. So **twelve cells witness the
fourteen collapsing families**.

**And the sub-prediction that no family is witnessed by a cell reddening rows it does not witness is
refuted.** `I-172` inverts the test for a well-formed contract name and reddens all seven rows of
`every-case-is-addressable-across-the-whole-contract` beside its own seven, because a case address
carries a contract address inside it. Those seven are bystanders and are witnessed by `I-164`, which
is aimed at the case identifier itself. The count cannot see the difference and the record can, which
is the notch a first witness is weaker by, stated again on an instance.

### The finding nobody predicted: a family witness can never be a sole witness

Across the replay, `alone` does not move — **123 before and 123 after** — and `never alone` goes
**204 to 297, which is exactly the 93 rows this slice witnessed**. It is true by construction: a cell
that reddens six or seven rows of one family leaves six or seven names in `failedGuards`, so not one
of them can be the only red on any mutant.

**So the two debts trade against each other, one for one.** ADR-0199's bucket of guards never seen red
alone grows by exactly what a family slice takes out of the decorative bucket. Paying the cheaper debt
at family scale is not neutral for the dearer one, and no record before this one had to say so because
no slice before this one witnessed a family at a time.

### A declaration refuted by measurement rather than made stale by one

The region covering `a-blob-answer-hashes-to-its-address` declared four contracts out of reach, and
its reason was specific: the guard compares two evaluations of one expression, so no edit to
`servedBytes` can separate them; what has teeth is `servedBlobFaults`, which reads idempotence; and a
Latin-1 re-encoding loses idempotence only on a code point in U+0080–U+00FF, which those four carry
none of. **Every clause of that is true and the conclusion is false.** `I-168` takes the first
character off every served file rather than off the ones carrying a byte-order mark, which loses
idempotence on every file there is, and it reddens all seven rows. The reason had characterised the
guard by the one defect anybody had tried. `REACHED_BY_A_LATIN_1_RE_ENCODING` died with it, and
`noUnusedLocals` is what said so.

### The verdict on ADR-0209's 138

**Corrected, and its form held.** That record's arithmetic is *117 standalone plus 21 families, if a
family collapses to one cell*. The conditional is the whole of it, and it is false five times in
nineteen.

Costed over the population as it stands, the nineteen families take **41 aiming decisions** to witness
in full — twelve cells for the fourteen that collapse, six for `every-produced-profile-exists`, two
for `every-export-is-carried-or-declared-uncarried`, and seven apiece for the three that resist —
against the **19** one cell per family would give. **The coefficient is 2.16 and not 1.**

So today's ceiling is **50 aiming decisions for 129 guards**, not the 28 the family form gives, and
the figure 138 is re-derivable at no coordinate because the population it was taken over no longer
exists. What survives is the shape of the claim: a ceiling well below one cell per guard, and far
enough below to be worth an afternoon rather than a fortnight.

**What is publishable is a rate over a population and never a projection.** Fourteen of nineteen
families, 74 %, for a family of `packages/registry`'s `unprobedClaims` as the population stands at
`1238833`. Nothing here says the rate holds for a folder whose guards read that folder's own
derivations in different proportions, and the mechanism says why it would not: what decides a collapse
is the presence of a shared derivation, which is a fact about how a suite is written rather than about
families.

### The price, and the half of the prediction that was not implemented

**Twenty candidate runs for fourteen cells and nineteen families decided.** That is **1.43 runs per
cell** against a predicted 1.3 — refuted, in the same direction ADR-0211's price prediction was
refuted, and the sixth reading of a figure that has now been 1.27, 1.21, 1.27, 1.21, 1.29 and 1.43.
**The figure this slice alone can produce is 1.05 runs per family decided**, because no earlier slice
had a unit larger than a guard.

**And a replay was predicted before it was paid for, incompletely.** The prediction named three ways
this unit could fail a run — a pin naming a guard that did not redden, a guard wrongly declared
silent, and a guard left silent that no region declares — and implemented the first two. It answered
nought faults; the run refused on the third. **A predictor that names three failure modes and checks
two reads exactly like one that checks three**, which is this repository's own recurring class
arriving on the tool built to avoid paying for a replay. The reader that would have caught it is four
lines long and is now the one used against the fresh artefact, where it answers nought unaccounted and
nought wrongly declared.

**The bound announced before paying it held once of twice, and the miss is worth more than the hit.**
229 cells at the 10.84 s ADR-0211 measured is 41 min 24 s, with 2.4 per cent either side giving 40 min
25 s to 42 min 24 s. Measured, the first replay ran **42 min 10 s**, inside and against the upper
edge; the second, on the same 229 cells at the next commit, ran **42 min 49 s** — 25 seconds outside
it, 11.22 s per cell against the predicted 10.84. The two readings of near-identical work are 2 530 s
and 2 569 s, a spread of 1.5 per cent, so the interval was too tight rather than the machine
surprising: **a per-cell figure carried from another commit's replay does not bound this one to 2.4
per cent**, which is ADR-0200's *one reading calibrates a battery no better than to about a sixth*
arriving on an interval narrow enough to be falsified.

### The state of the nineteen families, row by row

| family | rows | silent before | witnessed | still silent | cell |
| --- | --- | --- | --- | --- | --- |
| `the-answer-is-the-export-the-identity-names` | 7 | 6 | 6 | 0 | I-162 |
| `the-profile-vocabulary-and-the-profiles-agree` | 7 | 6 | 6 | 0 | I-163 |
| `every-case-is-addressable-across-the-whole-contract` | 7 | 6 | 6 | 0 | I-164 |
| `every-produced-profile-exists` | 7 | 6 | 1 | 5 | I-165 |
| `every-harness-file-is-hashed` | 7 | 6 | 6 | 0 | I-166 |
| `every-export-is-carried-or-declared-uncarried` | 7 | 6 | 5 | 1 | I-167 |
| `a-blob-answer-hashes-to-its-address` | 7 | 4 | 4 | 0 | I-168 |
| `every-field-a-snapshot-serves-is-classified` | 7 | 6 | 6 | 0 | I-169 |
| `a-snapshot-invents-no-field` | 7 | 6 | 6 | 0 | I-169 |
| `a-standing-field-does-not-move-the-digest` | 7 | 6 | 6 | 0 | I-170 |
| `every-served-field-is-classified` | 7 | 6 | 6 | 0 | I-171 |
| `every-declared-type-occurs-in-the-contract` | 7 | 7 | 0 | 7 | none |
| `the-address-is-well-formed` | 7 | 7 | 7 | 0 | I-172 |
| `every-uncarried-export-carries-a-reason` | 7 | 7 | 7 | 0 | I-173 |
| `every-uncarried-export-exists` | 7 | 7 | 0 | 7 | none |
| `every-own-declaration-is-an-export` | 7 | 7 | 0 | 7 | none |
| `the-implementation-belongs-to-its-contract` | 7 | 7 | 7 | 0 | I-174 |
| `an-implementation-binding-carries-no-frozen-field` | 7 | 7 | 7 | 0 | I-175 |
| `the-frozen-half-and-the-standing-half-partition-an-implementation` | 7 | 7 | 7 | 0 | I-175 |
| **total** | **133** | **120** | **93** | **27** | **14 cells** |

**Measured at `90e6f1b` off a replay of 229 cells in 42 min 49 s**: 224 killed, the same five
survivors, every cell agreeing with its pin, nought unaccounted for, nought wrongly declared silent,
exit 0. `unprobedClaims` goes **129 to 36**, and the attribution reads 123 alone, 297 never alone, 10
out of reach.

## Consequences

- The slice is total over the parameterised population, so a rate obtained from it is a count over a
  population and never a sample of one — which is the form ADR-0210 established for publishing a
  figure of this kind.
- A family that does not collapse leaves rows without a witness and this unit does not buy them, so
  `unprobedClaims` falls by less than 120 whatever happens. The record publishes what is left rather
  than emptying the bucket.
- **The mechanism replaces ADR-0209's framing of the joint and is cheaper than it.** What has to be
  asked of a family before pricing it is whether a derivation of the folder lies between its rows and
  its sentence — answerable by reading the guard, and it separated fourteen from three here with no
  cell spent. Whether each contract instantiates the clause is the second question and is answerable
  by reading the catalogue.
- **A family witness enlarges the never-alone bucket by exactly what it takes out of the decorative
  one.** Measured across this replay, `alone` does not move and `never alone` goes 204 → 297. Anybody
  pricing the rest of `unprobedClaims` at family scale is buying first witnesses and spending sole
  ones, and the exchange rate is one for one.
- **Five rows of `every-produced-profile-exists` and one of
  `every-export-is-carried-or-declared-uncarried` stay declared `unprobedClaims` and are arguably
  `unreachableGuards`.** They are not: a defect in that contract's own entry in `the-catalogue.ts`
  reddens each of them, at one cell per row. So they are dear rather than out of reach, which is the
  distinction ADR-0211 had to make in the other direction.

## What would reopen this

- **A family whose rows are not one parameterised title.** The structure is measured over nineteen
  families at one commit; a guard written as seven separate assertions sharing a stem would be a
  family by address and not by construction, and the mechanism says nothing about it.
- **A contract published or refused.** Every family here is parameterised over the catalogue, so an
  eighth contract adds a row to all nineteen at once, and each new row is silent until something
  reaches it. The rate is a property of a seven-contract catalogue.
- **The definition moving.** A1, A2 and the narrowest-defect discipline are `68e466a`'s, and a
  measurement taken under a relaxed family exception would not be comparable with the three slices
  before it.
- **A reading of the same population on another folder.** `packages/cli` and the contract batteries
  have parameterised guards of their own, and nothing here says the vacuity rate is a property of
  anything but this catalogue's own data.
- **A cell aimed at any of the twenty-seven rows still silent.** Three families cost seven cells
  apiece and two carry vacuous rows a per-contract defect would reach; none of that is bought here,
  and the 2.16 coefficient is a costing rather than a measurement of work performed.
- **A per-cell duration carried from another commit bounding a replay to a few per cent.** The
  interval announced here was 40 min 25 s to 42 min 24 s and the second reading came in at 42 min
  49 s. A wider interval, or one derived from more than one replay, would not have been falsified —
  and the figure that would replace it is a spread rather than a point.

## More Information

- ADR-0209 — the first witness, the 21 families, the 138, and the joint this unit tests.
- ADR-0210 and ADR-0211 — the two standalone slices, 90 of 90 read and 79 witnessed.
- `68e466a` — A1, A2, the narrowest-defect discipline and the family exception.
- The control is `pnpm run registry` at `1238833`; the artefact is `mutation/results/registry-storage.json`,
  215 cells taken at `14bd274`.
