---
status: accepted
date: 2026-09-04
governs:
  - mutation/registry-storage.battery.ts
  - CLAUDE.md
confirmed-by: []
---

# The third slice takes the clause both the others held, and reads the mechanism inside itself

## Context and Problem Statement

ADR-0209 and ADR-0210 priced the first witness on two slices and published one count between them:
**51 of 54, 94 %, for a guard of `packages/registry` sitting in a wholly unprobed test file**. Both
records refused to say anything about the rest, and they refused it for the same reason, written in
both: *a wholly unprobed test file* is the clause both rules held, and holding it is what made the
two rates comparable.

**That clause is most of the population.** Of the 201 guards this folder still declares under
`unprobedClaims`, **173 sit in files some cell of this battery already reddens** and 28 do not. So
the published 94 % speaks for a seventh of what is left, and nothing measured says whether it speaks
for the other six.

ADR-0210 named the two directions that population could go in and refused to guess between them. **A
witness may arrive free from a cell that already exists**, which biases up. And **a guard still
silent in a probed file has already survived every cell aimed at its neighbours** — ADR-0209's own
central finding about isolation, *the expensive part of isolation is isolating a guard that has
already resisted every cell in the battery*, transposed to first witnesses — which biases down.

This is the reading that decides it, and it is not a reading this unit invented. ADR-0210's own
reopening section names it in as many words: *the two clauses are independent, so the readings not
taken are the two the rule refuses: **standalone guards in a partly probed file**, and parameterised
guards in one.* This is the first of those two.

## Decision Drivers

- **The definition does not move.** A1, A2 and the narrowest-defect discipline are committed at
  `68e466a` and are the same three sentences the two slices before this one were measured under. A
  third unit that relaxed them would make its own number and measure nothing.
- **A first witness is a cell of its own, aimed at one guard.** It is never an existing cell widened
  until it reaches one more. This is the trap peculiar to *this* population and it is written out
  below, because here the injection site is already there and the widening is within reach.
- **A guard is not rewritten to make a cell work.** ADR-0203.
- **A declaration is retired because a cell witnesses it**, never because the count looked better. A
  guard that resists keeps its declaration and the record says why.
- **The two counts are published apart** — what leaves `unprobedClaims`, and what a cell witnessed.
  ADR-0209 published them apart and ADR-0210 measured a gap of eight; the gap is what makes the rate
  believable rather than convenient, and this population is the one where it should be widest.
- **A bound extrapolated from one member of a population states the cost of that member.** ADR-0199.
- **One reading of a battery calibrates it no better than to about a sixth.** ADR-0200.

## The rule, fixed before a guard of the slice was read

**Every unprobed-claims guard of `packages/registry` that is not parameterised over a contract — the
address does not end in one of the seven contract slugs, which is ADR-0209's own test — and is
collected in a test file some cell of this battery already reddens.**

That is ADR-0210's rule with exactly one clause inverted and the other held, which is the shape both
earlier rules were fixed in. It is **70 guards over eleven files**.

| file | slice | file's unprobed | reddened / collected |
| --- | --- | --- | --- |
| `determinism.test.ts` | 14 | 14 | 6 / 20 |
| `signature.test.ts` | 13 | 13 | 3 / 16 |
| `the-sixth-contract.test.ts` | 11 | 11 | 4 / 15 |
| `verifiability.test.ts` | 11 | 11 | 2 / 13 |
| `response.test.ts` | 6 | 25 | 42 / 67 |
| `snapshot.test.ts` | 6 | 27 | 33 / 60 |
| `against-the-catalogue.test.ts` | 3 | 52 | 9 / 69 |
| `implementations.test.ts` | 3 | 10 | 14 / 24 |
| `publication.test.ts` | 1 | 1 | 7 / 9 |
| `round-trip.test.ts` | 1 | 1 | 33 / 34 |
| `visibility.test.ts` | 1 | 8 | 4 / 12 |

### The structure the rule was fixed against, and nothing else

A control run of this folder at `6d03933` — **466 collected assertions, none red, *Type Errors no
errors*, 10.15 s** — joined to the attribution of ADR-0210's replay on disk, which is the 163-cell
artefact taken at `709798c`. Nothing between those two commits touches `packages/registry` or the
battery: `6d03933` moves `CLAUDE.md` and one record.

The join is total in both directions. All 201 declared-unprobed addresses are carried by the report,
and all 466 the report carries fall in exactly one bucket — 86 load-bearing, 168 never alone, 11 out
of reach, 201 unprobed claims, **nought unaccounted for and nought wrongly declared silent**.

**A guard is joined to a file by the address rather than by the whole title**, and that is not
cosmetic. ADR-0019 makes a guard's title its address, then ` :: `, then a sentence, and this folder
writes both forms — `round-trip.test.ts` writes the address alone. Joining on the whole title loses
27 of the 201 in silence, which is what the first attempt did.

The 201 decompose two ways, and the two decompositions are what the rule cuts on:

- **70 standalone and 131 parameterised** over a contract.
- **173 in partly probed files and 28 in one wholly unprobed file**, which is `coverage.test.ts`.

### The inverted clause selects nothing extra, and that is the second slice's doing

**There are no standalone unprobed-claims guards left in a wholly unprobed file.** `coverage.test.ts`
is the only wholly unprobed file this folder still has and all 28 of its unprobed guards are
parameterised over a contract. So the inverted clause excludes nothing the held clause did not
already exclude, and the slice is **total over the standalone population as it stands**.

That is a property of ADR-0210 rather than of this rule: that slice took all 20 standalone guards
there were in wholly unprobed files, so the set it drew from is empty behind it. It has a consequence
worth stating, because it is what the two units publish together rather than separately:

> **The union of ADR-0210's slice and this one is every standalone unprobed-claims guard this folder
> has ever declared — 20 + 70 = 90**, which is the 90 that record counted at the 228 state.

So the comparison between the two readings is exact. Same rule, disjoint populations, one clause
apart, and their union is a whole population rather than a sample of one.

### A figure of ADR-0210 does not reproduce, and it is noted rather than rewritten

That record publishes **174 of the 228** for the population both slices excluded. Its own rule
commit, `e91dd13`, publishes **173** for the same population. They cannot both be right.

Measured. The 228 state is rebuilt from the artefact on disk — ADR-0210's nineteen cells are `I-91`
to `I-109`, so a guard was silent at 228 exactly when every cell reddening it today is one of those
nineteen, and nothing else moved. The rebuild answers **228, of which 55 in wholly unprobed files and
173 in partly probed ones**, and it names those four files as `coverage.test.ts` 28,
`visibility.test.ts` 12, `attestation.test.ts` 3, `endpoints.test.ts` 12 — which is ADR-0210's own
description of its slice, from the other side. Re-read at the 262 state off the pre-slice artefact,
the same figure is **173**; re-read at 201 today it is **173** again.

**So it is 173 at every coordinate this population has had, the commit message carries the right
figure and the record carries the wrong one.** ADR-0210 is stamped, so this is a note against it and
never an edit of it: what changes is that a reader arriving at that line meets the correction here.

The three readings agreeing is what makes it a transcription slip rather than a fourth state. It has
not moved because the two effects that could move it cancelled exactly: ADR-0210's cells reddened
eight guards in partly probed files as bystanders, and the four files its slice emptied moved eight
guards the other way when they became partly probed.

### The trap peculiar to this population, and how it is refused

**The injection site is already there.** Every file in this slice has cells aimed into it — from 2
into `verifiability.test.ts` to 42 into `response.test.ts` — so the cheapest way to redden a silent
guard is to widen a neighbouring cell until it catches one more. **A widened cell has stopped
aiming**, which is ADR-0206's finding about battery surfaces one notch finer: there, a battery
widened until it could reach a guard goes green having changed subject; here, a cell does.

So a first witness is a cell of its own, aimed at that guard, and the count is over cells written
rather than over guards a cell happens to touch.

**And one form of the up-bias is refused by construction rather than by discipline.**
`unprobedClaims` is derived, not declared: `attributeColumn` computes it as the guards a
claims-detection region names **that no cell of this battery reddened**. A guard reddened by any
existing cell is therefore not in the population at all — it is in `loadBearing`, in `neverAlone`, or
in `wronglyDeclaredSilent`, and that last bucket is **nought** today. So *a witness arrives free from
a cell that already exists* cannot raise this rate, because a guard it would be true of is not one of
the 70.

What survives of the up-bias is two things, and neither of them is the rate:

- **The price.** The site is known, so the search for a candidate should be shorter.
- **The gap between the two counts.** A cell written into a well-trodden module reddens bystanders,
  and each one leaves `unprobedClaims` without being witnessed. ADR-0210 measured that gap at eight
  over nineteen witnessed in files nothing had ever touched; here it should be wider.

### Which way it biases, written before the result is known

**The bias is downwards, and it is the effect under test rather than a distortion of it.** That is
the distinction ADR-0210 did not have to make: its bias was a property of its rule, and here the
clause being inverted *is* the mechanism the unit exists to measure. So the honest question is a
different one — is the *standalone* subset unrepresentative of the 173 it is drawn from?

**It is, downwards, and the size of that has been measured rather than argued.** ADR-0210 declared
that a standalone guard is dearer than a table's row, because a table exists as one guard per branch
of a rule and a defect removing a branch reddens exactly one row by construction, where a standalone
guard carries no such correspondence. That record then measured the difference at **95 % against
94 %** — under a point, and in the direction opposite to the one declared. So the residual bias of
taking the standalone half is at most about a point and its sign is not established.

**The one thing this reading cannot see is whether that difference is itself different in probed
files**, and it is named here rather than discovered: the parameterised 103 are what a fourth slice
would take.

### The prediction, committed before the first candidate

**The rate comes back below 95 %.** The reasoning is the asymmetry above and nothing else: of the two
directions ADR-0210 named, the up-bias cannot enter the numerator at all, because the bucket is
derived from what reddened. So only the down-bias is in a position to move the rate, and the question
is whether it bites rather than which of two forces wins.

Three more, each falsifiable on its own:

- **The price falls, at or below 1.21 runs per cell written.** That is where the known injection site
  goes, and it is the only place it can go.
- **The gap between the two counts is wider than ADR-0210's eight over nineteen**, because a cell
  written into a trodden module reddens bystanders that a cell written into an untouched file does
  not.
- **Within the slice, the rate falls as the file's reddened share rises.** This is the sharpest thing
  the unit can produce and no earlier slice could produce it: every file in both earlier slices had a
  reddened share of zero, and this one runs from 3 of 16 to 33 of 34. If the mechanism is real it is
  visible here without any comparison to another record at all.

### The three outcomes, and each is a result

- **Below 90 %.** The mechanism bites. The 94 % is a corner, what is publishable over the two
  populations is two counts named apart and never one fraction, and ADR-0210's headline gets a note
  saying what it covers.
- **At or above 94 %.** The mechanism is refuted at the population it was named for, and the
  publishable count becomes one over both — 51 + *n* of 124 — covering the majority of what is left.
- **Between 90 % and 94 %.** Nothing is decided by a gap smaller than the one already separating the
  two readings taken, and it is published as a refusal to decide, exactly as ADR-0210 refused to
  bracket rather than reporting a mean.

### The forms of being wrong, named in advance

- **The rate holds.** The down-bias is refuted, and the argument that made the prediction — that only
  one of the two directions can reach the numerator — was true and irrelevant, because the direction
  that could reach it does not push.
- **The price does not fall.** Then *the injection site is known* was a claim about an author's
  convenience and not about the search, and the up-bias has no measurable effect anywhere, having
  already been refused the numerator.
- **The gap does not widen.** Then a trodden module does not produce more bystanders than an
  untouched one, and the two counts are further apart in the earlier slices for a reason nobody has.
- **The within-slice reading is flat.** Then whatever moves the rate is not *how much* a file has
  been probed, and a mechanism stated as a dose would have to be restated as a threshold or given up.
- **A fourth resistance mechanism appears, and it is about being in a probed file.** That would be
  the largest finding available here and it would say the two populations differ in kind rather than
  in rate — at which point no fraction over their union is publishable at all.

### How this slice is unrepresentative, stated before it is measured

- **Downwards, by at most about a point**, for taking the standalone half of its population. Measured
  by ADR-0210 at 95 against 94, sign not established.
- **Upwards, if a file turns out to be a family that is not one over a contract.** The clause tests
  for a contract slug and for nothing else, so a guard parameterised over anything else reads as
  standalone. ADR-0209 walked into the mirror of this, and `signature.test.ts`, `determinism.test.ts`
  and `verifiability.test.ts` carry 38 of the 70 between them without a slug among them.
- **Unrepresentative of the 173 in the shape of its files, in both directions at once.** Four files
  supply 49 of the 70 and are barely probed — 2 to 6 cells each — while the six most trodden supply
  17. A single rate over the seventy is therefore an average over a spread the unit can read, which
  is why the within-slice reading is published beside it and not instead of it.

## Decision Outcome

**Sixty of the seventy are witnessed by fifty-two cells, `I-110` to `I-161`, and ten are not.**

> **60 of 70 — 86 % — is the first-witness rate for a standalone unprobed-claims guard of
> `packages/registry` sitting in a test file some cell of this battery already reddens.**

Against ADR-0209's 94 % and ADR-0210's 95 %, and the gap is larger than the difference between those
two by most of a factor of ten. It is also larger than one guard of either side: one more resister
here reads 84 %, one fewer reads 87 %, and one more resister there reads 93 %. **Two readings that
differ by eight points over denominators of 70 and 54 separate something, where two that differ by one
over 20 and 34 separated nothing.**

### The prediction, scored

The prediction committed at `73e1f20` was that **the rate comes back below 95 %**, on the ground that
of the two directions ADR-0210 named only the down-bias can reach the numerator. It is confirmed, and
so is the sharpest of the three outcomes named beside it — **below 90 %**, which is the reading that
says the 94 % is a corner.

**The three sub-predictions did worse than the main one, and two of them are refuted.**

- **The price falls, at or below 1.21 runs per cell written.** **Refuted.** It is **1.29**, dearer than
  ADR-0210's 1.21 and dearer than ADR-0209's 1.27. *The injection site is known* turns out to be a
  claim about an author's convenience rather than about the search, which is the second form of being
  wrong this record named.
- **Within the slice, the rate falls as the file's reddened share rises.** **Refuted, and it is the
  finding.** It is flat. The table is below and it is not monotone in either direction: the most probed
  file in the slice, `response.test.ts` at 42 of 67, witnesses **six of six**, and the least probed,
  `against-the-catalogue.test.ts` at 9 of 69, witnesses **two of three**.
- **The gap between the two counts is wider than ADR-0210's eight over nineteen.** Measured below.

### What was witnessed, and what reddened with it

Per guard, with the cell that witnesses it and how many guards reddened beside it, because a first
witness is a claim a reader has to believe and the co-red count is the measure of how much belief it
is asking for.

**`determinism.test.ts` — 14 of 14.** `an-array-keeps-its-order` `I-110` (2);
`a-value-json-would-lose-is-refused-negative-zero` `I-111` (1); `-nan` `I-112` (1); `-infinity` and
`-negative-infinity` `I-113` (2, a family of two, each naming its own end of the number line);
`-undefined` `I-114` (2); `-a-function` `I-115` (1); `-a-symbol` `I-116` (1); `-a-bigint` `I-117` (1);
`-a-hole` `I-118` (1); `-an-undefined-field` `I-119` (1); `a-crlf-source-is-served-as-its-lf-form`
`I-120` (3); `a-byte-order-mark-is-not-content` `I-121` (1); `normalising-changes-the-digest` `I-122`
(1).

**`signature.test.ts` — 13 of 13.** `an-arrow-inside-a-type-parameter-does-not-close-it` `I-123` (1);
`a-plain-signature-names-its-parameters` `I-124` (10);
`a-signature-that-takes-nothing-has-no-parameters` and `a-trailing-comma-leaves-no-parameter-behind-it`
`I-125` (66, a family of two, each naming one end of the clause that drops an empty part);
`the-type-parameters-are-not-the-parameters` `I-126` (67);
`the-parameters-of-a-parameter-are-not-parameters` `I-127` (66); the seven
`the-call-of-<contract>-is-read-from-its-own-signature` `I-128` (8, a family of seven).

**`the-sixth-contract.test.ts` — 8 of 11.** `needs-no-field-the-schema-does-not-have` `I-133` (3);
`is-addressable` `I-161` (2); `the-absorbed-state-is-constructible` `I-134` (2);
`the-depth-is-derived-from-the-edges` `I-129` (1);
`a-shared-file-is-recognised-by-its-digest-and-never-by-its-path` `I-160` (1);
`an-edge-the-registry-does-not-hold-is-refused` `I-130` (1);
`an-unpublished-implementation-cannot-be-depended-on` `I-131` (1);
`a-cycle-is-refused-rather-than-deduplicated-away` `I-132` (1).

**`verifiability.test.ts` — 10 of 11, and every one of the ten is a sole red.** `every-claim-is-an-address`
`I-145`; `every-claim-is-about-an-endpoint-that-exists` `I-146`;
`the-checks-that-need-nothing-from-the-registry` `I-147`;
`every-verifiable-claim-says-what-it-does-not-establish` `I-148`;
`the-believed-natures-are-the-declared-ones-and-none-is-withholding` `I-149`;
`the-believed-column-is-longer-and-is-mostly-opinion` `I-150`;
`the-believed-claims-with-no-mitigation-are-named` `I-151`; `a-translation-is-addressed-to-a-reader`
`I-152`; `the-methodology-answer-carries-every-field-of-a-record` `I-153`;
`the-methodology-answer-is-named-and-therefore-revalidated` `I-154`.

**`response.test.ts` — 6 of 6.** `a-snapshot-answer-that-was-altered-is-refused` `I-135` (1);
`a-snapshot-answer-under-another-format-version-means-nothing-here` `I-136` (1);
`a-blob-answer-with-one-byte-changed-is-refused` `I-137` (1); `the-refusals-page-has-a-source` `I-138`
(2); `update-compares-two-digests-and-nothing-else` `I-139` (1);
`a-contract-is-refused-or-published-and-never-both` `I-159` (1).

**`snapshot.test.ts` — 5 of 6.** `every-standing-field-a-contract-declares-is-carried-by-one` `I-143`
(2); `every-standing-field-says-why-it-cannot-be-frozen` `I-155` (1);
`a-standing-changes-and-the-digest-does-not` `I-158` (1);
`a-standing-cannot-be-set-on-something-unpublished` `I-156` (1); `two-majors-of-one-name-coexist`
`I-157` (1).

**`against-the-catalogue.test.ts` — 2 of 3.** `every-mutation-provenance-resolves` `I-141` (2);
`a-case-that-is-not-a-call-is-refused` `I-140` (1).

**`implementations.test.ts` — 2 of 3.** `every-reference-has-no-dependencies` `I-144` (1);
`nothing-is-measured-yet` `I-142` (1).

**Thirty-seven of the fifty-two cells redden their guard alone**, with nothing asking them to — neither
this slice nor either before it searched for isolation.

### A2 was applied against a red five times, which is more than both slices before it together

Five candidates reddened the guard they were aimed at and were thrown away, because what they break
has a plainest description in which that guard's subject does not appear. **A slice that kept them
would have reported 65 of 70, which is 93 %** — one point off ADR-0209's headline and the wrong answer.

- Giving a record with no edges a depth of one reddens `every-reference-has-no-dependencies` and
  `the-depth-is-derived-from-the-edges`, and *a record with no edges is given a depth of one* is the
  second guard's sentence.
- Dropping the name from a rendered address reddens `no-two-contracts-share-an-address` and forty-five
  others, led by `every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract`.
- Hashing a snapshot over its format version alone reddens `no-two-contracts-share-a-digest` and
  thirty-four others, led by the family that pins the hashing itself.
- Marking the refused contract published reddens `the-readme-counts-the-catalogue-the-registry-declares`
  and eight others, led by two whose subject is the refusal.
- Treating a case's provenance as a leaf reddens `fills-the-fields-no-published-contract-fills` and
  seventeen others, led by `every-field-a-snapshot-serves-is-classified`.

### What resisted, and the mechanisms are the answer to why the rate fell

Ten guards resist, and **three of the mechanisms are new to this repository**. Two of the ten are
inherited: `a-value-json-cannot-hold-survives-the-wire-a-bare-object` is ADR-0209's pincer and
`the-strata-are-populated` is ADR-0210's claim about a set a neighbour pins member by member. Both
re-enter this population because the files that carry them became partly probed at the slices that
established them, and both keep their published mechanism, which is not about being in a probed file.

**A guard whose subject is outside the battery's own surface — three instances, and it is new.**
`applyEdits` joins the repository root, the battery's `contractPath` and the file, so every edit this
battery can make is inside `packages/registry`. `every-anatomy-requirement-is-triaged` reads
`contractAnatomy`, which lives in `packages/catalogue/`.
`brings-a-sixth-benchmark-vocabulary-and-a-new-reason-set` reads nothing at all but a record its own
test file declares, so it calls no module of the folder. And
`every-stratum-is-translated-and-no-translation-is-orphaned` is the interesting one: its stratum
population is held twice, once by `field-map.ts` and once by `string/slugify@1`'s own declaration,
and the second holder is in `contracts/`. Measured — retiring the field map's only `one-directional`
entry leaves it green.

**These three are declared as claims no mutant reaches and they are claims no mutant of this battery
*can* reach**, which is a different state and one the instrument has no bucket for:
`unreachableGuards` is the bucket for it and nothing put them there, because until a slice went
looking nobody had asked.

**A guard whose claim is that a derived identity is injective — two instances, and it is new.**
`no-two-contracts-share-a-digest` and `no-two-contracts-share-an-address`. The only single edit that
makes two identities collide is one that damages the derivation, and the derivation has its own guards
whose sentences name it — so the aim always lands on the neighbour. It is ADR-0203's total-guard
shadow one floor up: there a total guard sweeps the same population, here a *family* of guards pins
the very function whose output the injectivity is a property of.

**One of those two leaves its declaration anyway, and that is not a witness.**
`no-two-contracts-share-a-digest` is reddened by `I-125`, `I-126` and `I-127`, which stop one
contract serialising — so it is out of `unprobedClaims` with nothing aimed at it, which is
ADR-0209's own sentence arriving on this slice: *the criterion for leaving is reddening and not
aiming*. It counts as a refusal in the rate and its declaration is removed, and the two facts are
not in tension.

**A guard whose claim is the absence of something no code produces — one instance, and it is new.**
`a-lockfile-is-json` says a lockfile carries no tagged encoding. The type system already refuses
almost everything that would falsify it, and the one value that gets past — a NaN byte count — reddens
**103** guards and is described by the digest family rather than by this one.

**And two by a mechanism ADR-0210 named.** `fills-the-fields-no-published-contract-fills` and
`the-readme-counts-the-catalogue-the-registry-declares` are both spoken for by a neighbouring guard,
which is that record's third mechanism arriving twice.

### The declarations this unit falsified, counted apart from the witnesses

**The class this slice was told to watch for is empty by construction, and that is a measurement
rather than a stroke of luck.** A witness arriving free — an existing cell that already reddens a
silent guard, once somebody looks — would be a false `unprobedClaims` declaration and never a witness
bought. It cannot happen here: `attributeColumn` computes the bucket as the guards a claims-detection
region names **that no cell of this battery reddened**, so a guard an existing cell reddens is in
`loadBearing`, in `neverAlone` or in `wronglyDeclaredSilent`, and that last was **nought** on the
artefact this slice was drawn from. **Zero of the seventy.**

**What was falsified instead is twelve declarations, and this unit's own cells falsified them.** They
are counted apart from the sixty because none of them is a witness: no cell aimed at any of them.

- **Eleven are one contract.** `I-125`, `I-126` and `I-127` break the reading of a signature shape only
  `array/group-by@1` writes, so that contract stops serialising and every guard about it reddens
  whatever its own subject is. Ten parameterised families give up that one row.
- **One of those eleven is an `unreachableGuards` entry**, which is a stronger declaration than an
  unprobed one and the first this repository has seen falsified.
  `a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands` is declared unreachable because
  the seam it reads is composed in a contract folder — an argument still true of the seam, and never
  about a contract ceasing to exist.
- **The twelfth is worth more than the other eleven.** `no-two-contracts-share-a-digest` is one of the
  seventy. A cell was searched for and refused on A2; it was written down as resisting; and the three
  signature cells redden it anyway. **So it leaves `unprobedClaims` with nothing aimed at it**, which
  is ADR-0209's own sentence arriving on this slice — *the instrument's criterion for leaving is
  reddening and not aiming*. It counts as a refusal in the rate and not as a witness.

**And three declarations are in the wrong bucket, which is a false `unprobedClaims` of a kind nobody
had named.** `every-anatomy-requirement-is-triaged`,
`brings-a-sixth-benchmark-vocabulary-and-a-new-reason-set` and
`every-stratum-is-translated-and-no-translation-is-orphaned` are declared as claims *no mutant reaches
yet*, and each is a claim no mutant of this battery *can* reach. The bucket for that exists —
`unreachableGuards` — and held none of them. They are left where they are with the mechanism written
into the declaration rather than moved, because moving a guard between buckets on a reading rather
than on a run is the move this discipline refuses; what the record can do is say which of the two they
are, and it does.

**The two counts, as ADR-0209 and ADR-0210 published them.** `unprobedClaims` goes **201 to 129**,
which is 72 guards leaving, against **60 witnessed**. The gap is **12** where ADR-0210 measured 8 over
19 — so the third sub-prediction is confirmed, and the reason is the one it named: a cell written into
a trodden module reddens bystanders that a cell written into an untouched file does not.

### The within-slice reading, which is what refutes the dose

| file | slice | witnessed | file reddened / collected | share |
| --- | --- | --- | --- | --- |
| `determinism.test.ts` | 14 | 14 | 6 / 20 | 30 % |
| `signature.test.ts` | 13 | 13 | 3 / 16 | 19 % |
| `the-sixth-contract.test.ts` | 11 | 8 | 4 / 15 | 27 % |
| `verifiability.test.ts` | 11 | 10 | 2 / 13 | 15 % |
| `response.test.ts` | 6 | 6 | 42 / 67 | 63 % |
| `snapshot.test.ts` | 6 | 5 | 33 / 60 | 55 % |
| `against-the-catalogue.test.ts` | 3 | 2 | 9 / 69 | 13 % |
| `implementations.test.ts` | 3 | 2 | 14 / 24 | 58 % |
| `publication.test.ts` | 1 | 0 | 7 / 9 | 78 % |
| `round-trip.test.ts` | 1 | 0 | 33 / 34 | 97 % |
| `visibility.test.ts` | 1 | 0 | 4 / 12 | 33 % |

**Read as a dose it says nothing.** Over the nine files that do not consist of a single inherited
resister, the rate against the share runs 13 % → 67 %, 15 % → 91 %, 19 % → 100 %, 27 % → 73 %,
30 % → 100 %, 55 % → 83 %, 58 % → 67 %, 63 % → 100 %, 78 % → 0 %. Split at 35 % it is 47 of 52 below
and 13 of 16 above, and the second bucket is sixteen guards over four files, three of whose four
failures are a file with one guard in it.

**So the eight points are not a dose and the mechanisms say what they are.** A file this battery
already reaches is one whose easy claims already have cells, so what stays silent in it is
disproportionately of the three kinds above — a subject outside the folder, an injectivity, an
absence. **The fall is compositional and not gradual**, which is why it is invisible inside the slice
and visible between slices, and it is the opposite of what a mechanism stated as *has already survived
every cell aimed at its neighbours* would predict.

### The verdict on what the 94 % covers

**It covers wholly unprobed files and it does not cover the population.** ADR-0210's headline stands
for what it says and it is a seventh of what is left; on the other six sevenths the rate is eight
points lower and the difference is larger than one guard of either reading.

**What is publishable over a whole population is the standalone half of this folder**, because
ADR-0210's slice and this one exhaust it between them:

> **79 of 90 — 88 % — is the first-witness rate for every standalone unprobed-claims guard
> `packages/registry` has ever declared**, in a wholly unprobed file or in a probed one.

That is 19 + 60 of 20 + 70, a count over the union and never a mean, and it is the largest complete
population any of the four slices has reported.

**ADR-0210 line 271 is a transcription slip and is noted rather than rewritten**: it publishes 174 for
the population both slices excluded and the figure is 173, at the 262 state, at the 228 state and
today. Its own rule commit `e91dd13` carries the right one.

### The price, beside the four already published

| | `packages/site`, ADR-0203 | `packages/registry`, ADR-0204 | ADR-0209 | ADR-0210 | here |
| --- | --- | --- | --- | --- | --- |
| what a cell buys | a sole witness | a sole witness | a first witness | a first witness | a first witness |
| the slice | 16 reciprocal-pair guards | all 22 one-companion-away | all 34 of one unprobed file | all 20 standalone in wholly unprobed files | **all 70 standalone in probed files** |
| candidate runs | 14, refusals not counted | 33 | 33 | 23 | **67** |
| guards witnessed | 11 of 16 = 69 % | 14 of 22 = 64 % | 32 of 34 = 94 % | 19 of 20 = 95 % | **60 of 70 = 86 %** |
| runs per cell written | 1.27 | 1.21 | 1.27 | 1.21 | **1.29** |
| runs per guard witnessed | 1.27 | 2.36 | 1.03 | 1.21 | **1.12** |
| runs per refusal established | not spent | 2.0 | 2.5 | 3.0 | **1.33** |

**The runs-per-cell figure is the fifth reading of one number.** 1.27, 1.21, 1.27, 1.21 and 1.29, over
four populations chosen by four different rules on two folders. A first witness is not a cheaper
search and never was; what it is cheaper at is landing, and the fifth reading says so as plainly as
the third and fourth.

**The refusals were the cheapest of the five and the reason is the mechanisms.** Eight runs over the
six refusals a run was spent on, which is 1.33 against 2.0, 2.5 and 3.0 — and four of the ten needed
no run at all, two being inherited and two being settled by reading which module a guard calls. **A
refusal is cheap exactly when its mechanism is structural**, and three of this slice's mechanisms are.

## Consequences

- **Fifty-two cells, `I-110` to `I-161`, in `mutation/registry-storage.battery.ts`**, and they stay in
  the `I` series on ADR-0210's own test: a fourth series would need a subject no other touches, and
  these inject into eleven modules `I` already reaches. The battery goes from **163 to 215 cells**.
- **`packages/registry`'s `unprobedClaims` goes 201 to 129** — 72 guards leaving against 60
  witnessed — and nine of the ten that resist keep their declaration with the mechanism written
  into it rather than only here. The tenth, `no-two-contracts-share-a-digest`, leaves with nothing
  aimed at it.
- **Two regions are deleted whole and four are named guard by guard**, which is this battery's own
  recorded phenomenon firing again — *a suite name is worth its brevity exactly until one mutant
  reaches into it*. The signature region's own sentence, that no mutant there can name one guard, was
  true of isolation and is false of aiming: `I-123` reddens one guard and `I-124` reddens ten.
- **`mutation/census.ts` is untouched.** No guard was added, so the folder still collects 466 guards
  over 24 files.
- **The README's three figures move and are derived rather than transcribed**: 924 defect cells to
  976, 882 caught to 934, survivors unmoved at 42.
- **ADR-0200's, ADR-0203's, ADR-0204's, ADR-0209's and ADR-0210's censuses are not rewritten.** Each is
  stamped at its own commit and stays there.
- **The battery's share of its gate grows again**, which is the entry about a bound nobody compares
  with what a battery costs, arriving for the fifth unit in a row and for the first time on a battery
  that has grown by a third.

## What would reopen this

**A replay at a later commit reopens every figure here**, and none is written in the present tense
for that reason.

**A fourth slice reopens the fraction, and there is exactly one left of this shape.** The two clauses
are independent and three of their four combinations are now read, so what remains is the
parameterised guards in a partly probed file — the 103, and `coverage.test.ts`'s 28 beside them as
the last wholly unprobed file there is. **What it would decide is whether the 86 % is a property of
being in a probed file or of being standalone in one**, and this record cannot separate those: its
own clause held the standalone half, and the 88 % published over the union of the two standalone
slices is a rate for standalone guards and for nothing else.

**A guard moved out of `unreachableGuards` reopens the three structural refusals.** They are declared
here as claims no mutant of this battery reaches, and what they really are is claims no mutant of this
battery *can* reach — the bucket for that exists and none of them is in it. Widening the battery's
`contractPath` would put two of them in reach and is exactly the widening this slice's own discipline
refuses, so what would move them is a second battery over `packages/catalogue/`, which no unit has
priced.

**A cell that reddens one of the two injectivity guards while its plainest description is that guard's
own claim retires that mechanism.** The direction is named: what is needed is an edit that makes two
identities collide without damaging the derivation, and nothing in either function offers one.

**A guard witnessed by a cell that fails A2 reopens the definition**, which is ADR-0209's own
reopening clause inherited whole: *aimed* is checked by reading, so the way it fails is a reader
disagreeing with an aim published here — which the per-guard co-red lists exist to make possible.

**A family over something other than a contract reopens the clause that is held.** The test is a
suffix against seven slugs and it cannot see a table parameterised over anything else.

**And a cell that widens a neighbour rather than aiming reopens the count.** That is the trap this
population carries, it is refused above by a discipline rather than by a mechanism, and the anchors
of every cell written here are what a reader checks it against.

## More Information

The 201 were read from the attribution of ADR-0210's replay, on disk, by ADR-0200's stated rule: a
guard is *collected* when any attribution bucket of any column of the folder names it, and *unprobed*
when it never reddened and the battery accounts for it under a region whose nature is `claims
detection`. The join to a file is a control run of the folder's own suite, read out of the same JSON
report the instrument reads, on the address rather than the whole title. The family count is that
artefact asked whether each address ends in one of the seven contract slugs, which is ADR-0209's own
question.

Candidates are searched for by mutating `packages/registry` and running that folder's suite exactly
as `run.ts` runs it — the same entry point, `--typecheck`, both reporters, `TZ=UTC` and the folder's
own configuration, with no file filter, which is what that battery's `vitestConfig` means. That is a
search tool and never the measurement: every figure published here comes from a real battery run,
and because a pin is checked as a *subset*, co-red counts are read back off the battery's own
artefact rather than off the search.

**Seventy runs in all: 67 candidate runs and three that re-measured a replacement reformatted after
its own search.** The price figures use the 67; the three are named rather than folded in, because a
run that re-measures a decision already taken is not part of a search. All seventy report **466
collected assertions and *Type Errors no errors***, which is what says a candidate was measured rather
than refused by the compiler.

**The replay is the measurement and it was taken after the cells were committed.** At `14bd274`:
**215 cells, 210 killed and 5 survivors** — `I-01`, `I-08`, `S-11`, `S-12`, `S-14`, the same five —
nothing disagreeing, **nought unaccounted for and nought wrongly declared silent**, exit 0. The
runner prints no duration of its own, so what is stated is a bound: **38 min 50 s** separate the
two clock readings the replay was launched between, which is **10.8 s a cell** against ADR-0210's
10.6 s over 163 — the per-cell cost reproducing to 2.4 %.

**The attribution moves in four places and closes.** Load-bearing **86 to 123**, never alone
**168 to 204**, out of reach **11 to 10**, unprobed claims **201 to 129** — and 123 + 204 + 10 + 129
is 466. The 37 guards that become load-bearing are the 37 cells that redden alone, exactly.

**And the reds no pin claimed are twelve, none of them this unit's.** `unclaimedRedsIn` names the
same twelve ADR-0209 and ADR-0210 read, unmoved, and every one of the fifty-two new cells at or
below ADR-0076's line names all of its reds.

**Both disagreements were predicted at nought before the replay was launched**, from the search
transcripts and the battery module rather than from a run, and both came back nought. That reading
is what found the twelve stale declarations, and it cost seconds where the run costs forty minutes.

```sh
npx tsc -p tsconfig.json --noEmit     # exit 0
pnpm run anchors                      # 914 anchors across 110 files, exit 0
pnpm run registry                     # 24 files, 466 passed
pnpm run battery registry-storage     # 215 cells, 210/215, 0 disagreeing, exit 0
pnpm run meta                         # 11 files
pnpm run freeze                       # 3 passed - no published binding moved
```

**No digest could have moved and it is measured rather than argued**: `git diff --name-only
6d03933..HEAD -- contracts packages/catalogue` names nothing, so neither a contract's own seven files
nor either of the two shared ones was touched, and the freeze is green beside that reading rather than
in place of it.
