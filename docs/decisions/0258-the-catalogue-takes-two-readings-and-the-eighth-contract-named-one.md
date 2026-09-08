---
status: accepted
date: 2026-09-08
governs:
  - contracts/typescript/temporal/add/contract.ts
confirmed-by: []
---

# The catalogue takes two readings for a draw count, and the eighth contract named one

## Context and Problem Statement

`temporal/add@1` adopted `propertyRuns = 1000` and declared the debt in as many words: *the
catalogue's other contracts choose this figure by timing three runs at 100, 1 000 and 10 000 draws;
no runtime in this repository carries `Temporal`, so that reading cannot be taken here*. The
measurement was owed the day a leg carried the runtime.

**The question that decides whether the debt is payable at all is not what the figure is.** It is
whether the reading the seven took is takeable anywhere else, and whether a reading taken on a runner
is the same reading. A timing reading on a developer machine and a timing reading on a shared runner
are two readings of two machines, and this repository has measured three times that a duration is not
a function of its commit.

## Decision Drivers

* **A reading has coordinates, and a duration has two: a machine and an engine.** For this contract
  they cannot both be held. This machine gives the seven's machine and an engine they never had; a
  runner at Node 26 gives the published engine and a machine the seven were never taken on.
* **A measurement that enters no decision is not bought at any price.** This contract is excluded from
  every suite, so nothing runs it on any leg and a runner timing would price a cost nobody pays.
* **What the catalogue's most explicit contract says decided the figure is not the clock.**

## Considered Options

* Time it on a throwaway branch at Node 26 and compare with the seven.
* Take the reading where the seven took theirs, on a developer machine, on the draft engine.
* Declare the debt unpayable and put the arbitration to the owner.

## Decision Outcome

**Both halves are taken here, they agree, and the first outcome holds: 1 000 stands. What does not
stand is the reason this contract gave for it, and two sentences beside that reason.**

### It is not one reading, and the contract's own sentence is false of two of the seven

| contract | what was read |
| --- | --- |
| `number/parse@1` | time: 16-19 / 40-45 / 185-239 ms |
| `array/group-by@1` | time: 16-17 / 51-53 / 300-327 ms |
| `string/levenshtein@1` | time: 14-18 / 47-51 / 297-318 ms |
| `string/slugify@1` | time: 18-19 / 57-62 / 385-386 ms |
| `number/round@1` | time: 11-11 / 34-43 / 184-185 ms |
| `date/add@1` | **not a time**: the mutant diverges on 411 draws of 1 000, first caught on draw 1 |
| `object/deep-equal@1` | **both — and *the clock is not what chose it*** |

*The catalogue's other contracts choose this figure by timing three runs* is true of five of seven.
`date/add@1` read a divergence rate. `object/deep-equal@1` took both and wrote that what decided was
the count at which every declared shape is reached, not the count at which the clock is comfortable.

**And *that reading cannot be taken here* was true of what had been built and not of what was
buildable.** ADR-0252 wrote it; ADR-0253 built the launcher that makes this contract's suite run under
`--harmony-temporal` a day later, and nobody came back. It is this repository's own recurring shape —
a true sentence about a state, read afterwards as a sentence about a possibility.

### The reaching reading has no coordinates, which is what makes it the one that transfers

The declared shapes of this generator are the pairs of a carrier and an outcome, and there are **22**.
Over ten seeds at each count:

| draws | declared shapes missed, per seed | the rarest one reached |
| --- | --- | --- |
| 100 | 2, 1, 1, 1, 3, 1, 2, 1, 0, 1 | 1 to 2 |
| 1 000 | 0 on all ten | 5 to 11 |
| 10 000 | 0 on all ten | 78 to 110 |

**100 misses a declared shape on nine seeds of ten.** 1 000 reaches all twenty-two on ten of ten.
10 000 reaches the same twenty-two, ten times deeper. That is the seven's conclusion arrived at
independently: the order above the default buys the coverage, and the order above that buys the same
shapes again.

**It asks the engine nothing**, which is why it is sound on the draft: a shape is counted from a
carrier's `Symbol.toStringTag` and, for a `Duration`, its own calendar fields — the same property that
made the case replay sound. Same arbitrary, same seed, same answer anywhere.

### The timing reading is a reading of wherever it is taken, so it was taken where the seven were

Three runs of this contract's property file at each count, node v24.15.0 under `--harmony-temporal`:
**21-24 ms, 108-112 ms, 770-781 ms** of test time. An order over the default is bought for about
87 ms; the next order costs **7.7 times** that. It is the dearest of the eight at every count, about
twice `string/slugify@1`.

**A runner would have swapped one coordinate for the other rather than holding both**, and it would
have priced a cost nobody pays: this contract is in no suite on any leg. That is the other half of the
refusal and it is the stronger half — a measurement entering no decision is not bought at any price.
**The runner reading is a different debt with a different owner**: the day a leg really carries this
contract, what matters is that leg's bound, which is a job's figure and not a contract's field.

### A control came back close, which is worse than coming back wrong

The reaching probe transcribes the generator rather than importing it, so it carries a control: at
seed 1 over 1 000 draws it must reproduce a figure already measured on the real arbitrary — **308 bags
of two signs**. It answered **315**.

**Seven apart is close enough to read as agreement**, and the cause is not the transcription: a
property taking two arbitraries consumes the random stream differently at one seed from a property
taking one, and the figure it had to reproduce was taken over `aBag` alone. The control was isolating
the property's shape rather than the arbitrary. Re-taken on the arbitrary alone it answers **308, and
345/369/286 bags of one, two and three units** — four figures, all exact.

### Two of the five outcomes are unreachable, and that is the properties' limit

`duration-not-read` and `out-of-range` are reached **0 times at every count and every seed**: every key
drawn is a unit and at least one is always named, and the counts are drawn in [-3, 3]. Four rows of
block 4.4 settle them and no property does. It is declared where the count is argued, because a reader
choosing what to trust needs to know which of the five reasons a property quantifies over.

## Consequences

* `propertyRuns` stays **1 000**, measured rather than adopted, with both readings and their protocols
  in the contract's own comment.
* Three sentences of that comment are replaced: the claim about how the other seven choose, the claim
  that the reading could not be taken here, and the reason given for adopting the figure — *the
  population is small and enumerable, so an order above the default already re-draws the region*,
  which the reaching reading refutes. The population is twenty-two shapes and the default misses some
  of them nine times in ten.
* **No branch was pushed and no runner time was spent.**
* The draft run is **117 of 117, exit 0**, `tsc` against `ESNext.Temporal` exit 0 out of band, and
  `propertyRuns` is back at 1 000 after the three edits the timing needed.
* **The ledger is `18cc4e82…` at 1 206 bytes and `pnpm freeze` is 3 passed**, unmoved: no digest is
  minted here.

## What would reopen this

* **A leg that really runs this contract.** The timing here is a developer machine's; the figure that
  would decide a bound is the runner's, and it is owed then rather than now.
* **A generator that grows a shape.** The twenty-two are a property of today's arbitraries; a carrier
  or a magnitude added moves the population, and the count that covers it has to be re-read rather
  than assumed to still cover it.
* **A published contract adopting a figure from another again.** This one did, and the adoption was
  right while its argument was wrong — which is the case for taking the reading rather than the
  number, and the next contract to adopt one is where that is tested.

## More Information

ADR-0252 is where the debt was declared and ADR-0253 is where the engine to pay it was built, a day
apart. `object/deep-equal@1`'s own comment is the method the reaching half follows. ADR-0199 and
ADR-0200 are why a duration carries its machine, and CLAUDE.md's rule that a figure a busy machine can
move carries the machine as well as the commit is the same statement one floor up.
