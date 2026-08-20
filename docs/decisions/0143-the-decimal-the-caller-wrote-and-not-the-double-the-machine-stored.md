---
status: accepted
date: 2026-08-20
decision-makers: Mathis Perron
governs:
  - contracts/typescript/number/round/contract.ts
  - contracts/typescript/number/round/reference.ts
confirmed-by: []
---

# The decimal the caller wrote, and not the double the machine stored

## Context and Problem Statement

`number/round@1` is the sixth contract. Permanent rule 7 is what it has to answer first: a contract
exists only if it provides something the language does not give trivially. Rounding a number to two
decimal places looks exactly like the thing a language gives trivially, and the whole admission turns
on whether that is true.

It is not, and this record carries the measurement rather than the impression. Every figure below was
taken on node v24.15.0, over a **total** population declared with it, so that anybody with this
checkout re-derives it rather than believing it.

### The population

Every value `k / 1000` for `k` from 1 to 1 000 000 — that is 0.001 to 1000.000, one million values, no
sampling and no seed. Thousandths because that is what a third decimal is in real code: a half-cent on
a price, a tax rate applied to an amount, a unit price multiplied by a quantity. It is the shape in
which these traps are met, and it is declared in `THE_SWEEP` so that the guard which recomputes the
figures and the sentence that quotes them cannot come apart.

### The first trap: `toFixed` rounds the stored double

`Number(value.toFixed(places))` is the first spelling a caller writes. It rounds the double the
machine stored, and a caller who typed `1.005` did not store one-and-five-thousandths — they stored
1.00499999999999989341858963598497211933135986328125, which is below the tie.

Over the population, at two places: **wrong on 48 000 values**. Every one of them is a value ending in
a half-cent, and there are 100 000 of those — so `toFixed` gets **48 % of the half-cents wrong**. It
never answers `NaN`, so nothing announces the loss.

### The second trap: multiplying moves the error rather than removing it

`Math.round(value * 10 ** places) / 10 ** places` is the spelling a caller writes after being told the
first one is unreliable. The multiplication introduces an error of its own, so the tie the caller
wrote is not the tie `Math.round` is shown.

Over the same population: **wrong on 4 588 values**, 4.6 % of the half-cents, and again silently. Its
misses are a subset of `toFixed`'s — measured, at least one of the two is wrong on exactly 48 000.

`Math.round` carries a second fault that has nothing to do with doubles at all: it breaks a tie
towards positive infinity rather than away from zero. Measured: `Math.round(-0.5)` is `-0`,
`Math.round(-1.5)` is `-1`, `Math.round(-2.5)` is `-2`, where this contract answers -1, -2 and -3. A
refund therefore rounds the opposite way from the charge it reverses, which is a fault a ledger
notices and a test written with positive amounts does not.

### The third trap: the correct answer comes back as text

The language *can* round a decimal correctly, and this is the half a reader is entitled to know
before believing anything else here. `Intl.NumberFormat` with `roundingMode: 'halfExpand'` agrees with
this contract on every value it was asked: all eighteen named traps, and **300 000 random calls with
zero disagreements, sign of zero included**.

What it hands back is locale-formatted text. Reading it back with `Number` is the third trap, and it
is the one that survives every test somebody wrote with small amounts:

    999.994  ->  "999.99"    ->  999.99
    999.995  ->  "1,000.00"  ->  NaN

Over the population, `Number(value.toLocaleString('en-US', { maximumFractionDigits: 2 }))` is right on
**999 994 values and NaN on the last six** — exactly the six at and above 999.995, which are exactly
the six whose answer reaches a grouping separator. A defect that appears at a thousand and nowhere
below is a defect that ships.

There is a fourth reading, kept because a reader weighing the three needs it:
`Number.prototype.toLocaleString` constructs a `NumberFormat` on every call. The same million answers
cost **18 278 ms** written as `value.toLocaleString(...)` and **583 ms** with one formatter hoisted out
of the loop — the same verdict on all six, thirty-one times the price.

### Why three traps and not one

They were nearly written as one, and that would have been the error worth avoiding. They fail in three
different ways: two answer a wrong *number* with nothing announcing it, and the third answers the
right number below a thousand and `NaN` above it. A reader told only about the first reaches for the
second. A reader told only about the first two reaches for the third and ships it. Each is stated
separately in `theTraps`, with its own spelling, its own sentence, and its own recomputed figure.

## Considered Options

- **Round half away from zero, on the shortest decimal of the value.** What a person, a school and an
  invoice mean by rounding.
- **Round half to even.** What IEEE 754 does by default and what several accounting standards
  require, because it removes the upward bias of half-away-from-zero over a long column.
- **Round half towards positive infinity.** What `Math.round` does, and therefore what a caller who
  has only ever used `Math.round` expects.
- **Round the stored double rather than the decimal.** What `toFixed` does.

## Decision Outcome

**Half away from zero, applied to the shortest decimal that reads back as the value.**

The shortest decimal is not a convenience. ECMA-262 requires `Number::toString` to produce the
shortest decimal that round-trips, which is exactly "what the caller wrote" for any value somebody
typed or parsed. Measured over 199 914 random finite doubles: `Number(String(v)) === v` on every one.
Rounding that string is a comparison against `'5'` and a carry, both exact at any length, and no
arithmetic touches the value at all.

Half to even was refused for the domain rather than for the arithmetic. `inputDomain` says what this
contract is for — prices, totals, tax lines, measurements — and in that domain the answer a person
predicts is the answer they should get. A contract whose whole subject is *the language surprises you
here* cannot itself answer 2 for `round(2.5, 0)` and 2 for `round(3.5, 0)`. Half to even is the right
rule for a different contract, and this record is what a `number/round-half-even@1` would cite.

Half towards positive infinity was refused because it is not symmetric, and asymmetry in money is
where the money goes.

### `places` is a whole number, zero or greater

Three refusal reasons, each argued in `contract.ts` rather than restated here. Two of them are about
one parameter and earn the split on the caller's side: a non-whole place count is a bug upstream, and
a negative one is a caller asking for magnitude rounding, which `inputDomain` declines in as many
words.

There is deliberately **no `places-out-of-range`**. `toFixed` throws a `RangeError` above 100 places
and this contract does not, because a place count larger than the value carries is not an error — it
is a request that changes nothing. Measured: `round(1.5, 1e21)` answers 1.5, and `round(1.5, 400)`
answers 1.5, where `(1.5).toFixed(400)` throws.

### An oracle in integer arithmetic, and why it is not the reference read twice

`properties.test.ts` settles the central claim against a second implementation of the same rule,
written differently: the reference reads a decimal string and carries a digit, and the oracle divides
an integer. That is `GUARD_PERTURBATION_RULE` applied to an oracle — an implementation compared
against itself establishes that it is self-consistent, which is true of one with a hole in it.

Measured over every value of the population: **one million values, zero disagreements** between the
reference and the integer oracle.

## Every property was seen red, and one decision was seen to have no property at all

Sixteen perturbations of the reference were injected and the suite read after each. The result decided
two things in this contract that were written wrongly before it was taken.

**Two published reasons were false and are corrected.** The `deterministic` reason claimed a cache
keyed on one of the two arguments would be caught; measured, two such caches redden the specific
properties and leave determinism green, because the probe primes the cache itself — the same limit
`number/parse@1` records of its own. The witness that does redden it is an implementation hoisting the
carry out of the increment loop, which is the shape `string/levenshtein@1` and `string/slugify@1` both
use. The `no ambient input` reason was corrected the same way.

**One perturbation was absorbed by an overflow, and that finding is worth more than the mutant.** An
accumulator that appends rather than replaces drives the digit string past what a double holds, so
both calls of the determinism pair answer `Infinity` — and `outputsAreEqual` is `Object.is`, which
judges two infinities equal. On a numeric contract an overflow can absorb a determinism signal. It is
recorded in the reason itself, because the next numeric contract will reach for the same accumulator
mutant.

**One decision is settled by no property, and that is why block 4.4 exists.** A place count of
negative zero is a count of zero: `Number.isInteger(-0)` is true and `-0 < 0` is false, so
`round(1.5, -0)` answers 2. A perturbation that refuses it instead reddened **nothing at all** — not
one of the ten guards. That is ADR-0021's division arriving as a measurement rather than as a
principle: the decision is not in any property's alphabet, so it is owed a named case.

## Why `confirmed-by` is empty

The guards that keep this decision exist — the ten of `properties.test.ts`, every one of them seen
red below. They are not citable.

A `confirmed-by` entry is the pair `(battery, guard)`, and `THE_SUITES` resolves a battery's name to
the folder whose guards it collects. No battery names `contracts/typescript/number/round` yet, and
none can: `every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns` refuses a
battery injecting where no contract of the catalogue is, and this contract enters `theCatalogue` in
the publication unit rather than in this one.

So the field is empty rather than pointing at something that does not resolve, which is the failure
ADR-0001 already records of its own first batch. It is filled by the unit that writes the two
batteries, and that is the event this record reopens on.

## Consequences

The contract exists on disk, complete and measured by its own suite, and **nothing published says it
exists**. It is not in `theCatalogue`, not served, not on the site, not installable, and no digest
anywhere covers a byte of it. Everything here is reversible until the publication unit, which is the
whole reason the unit stopped where it did.

What this record costs, stated rather than discovered: the tie rule, the reason partition and the
signature are frozen with the major on the day the contract is published, and this record is the
argument a reader will be handed when they ask why `round(2.5, 0)` is 3.

## What would reopen this

- A battery names this contract's folder, at which point `confirmed-by` is owed and this record is
  amended rather than replaced.
- A runtime changes what `toFixed`, `Math.round` or `Intl.NumberFormat` answer, at which point every
  figure above is wrong. They are declared in `theTraps` so that the guard replaying them recomputes
  the number rather than reading a sentence, and that guard is what says so.
- Somebody asks the catalogue for half-to-even rounding, which is a second contract at its own
  address and not a field on this one.
