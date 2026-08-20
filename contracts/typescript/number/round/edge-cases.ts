/**
 * Block 4.4 of contract `number/round@1` - the named and settled edge cases.
 *
 * What this block is for, the `Provenance` vocabulary every case carries and the shape of the `id`
 * each one is addressed by belong to the catalogue and are stated once in
 * `packages/catalogue/every-contract.ts`. What is here is this contract's own table.
 *
 * Every case is `specified`: this contract has no battery yet, so no case here can have been added
 * because a mutant survived, and none is claimed to have been. What the table *is* built from is a
 * reading rather than an intuition - sixteen perturbations of `reference.ts` were injected and the
 * suite read after each, and the one that reddened nothing at all is the reason
 * `a-place-count-of-negative-zero` is a row here rather than a clause of a property. ADR-0143.
 *
 * Every answer below was written by hand first and then asked of two independent judges: the
 * reference, and `Intl.NumberFormat` with `roundingMode: 'halfExpand'`, which is the language's own
 * correct decimal rounder. `language.test.ts` is where the second judge runs, so the agreement is
 * replayed on every commit rather than reported once here.
 */

import type { CaseGroup } from '../../../../packages/catalogue/identifier.js'
import type { Provenance } from '../../../../packages/catalogue/every-contract.js'
import type { RoundFailureReason } from './contract.js'

/**
 * The seven questions this table answers, in the order it answers them.
 *
 * The partition is this contract's own and is frozen with its major - see `CaseGroup`. It divides by
 * *what a reader arrived with*, not by which branch of the reference runs: somebody who has just
 * watched a total come out a penny short reads the first group and stops.
 */
export const edgeCaseGroups: readonly CaseGroup[] = [
  {
    id: 'the-decimal-a-double-cannot-hold',
    title: 'The decimal a double cannot hold',
    note:
      'The reason this contract exists. Each value below is one a caller typed and the machine ' +
      'stored as something slightly smaller, so a built-in that rounds what was stored answers a ' +
      'penny short.',
  },
  { id: 'which-way-a-tie-goes', title: 'Which way a tie goes', note: null },
  {
    id: 'the-sign-of-zero',
    title: 'The sign of zero',
    note:
      'A refund that rounds away to nothing keeps the mark saying which way the money went. It is ' +
      'why the contract compares answers with `Object.is` rather than with `===`.',
  },
  { id: 'a-carry-that-runs', title: 'A carry that runs', note: null },
  {
    id: 'a-magnitude-no-fixed-notation-holds',
    title: 'A magnitude no fixed notation holds',
    note:
      'Values whose shortest decimal is written in exponent notation, at both ends of the double ' +
      'range. `toFixed` refuses some of these outright.',
  },
  { id: 'the-place-count-at-its-edges', title: 'The place count at its edges', note: null },
  { id: 'what-is-refused', title: 'What is refused', note: null },
]

export type EdgeCase = {
  readonly id: string
  /** Which of `edgeCaseGroups` this case sits under. */
  readonly group: string
  readonly value: number
  readonly places: number
  readonly expected: number | null
  /** What the diagnostic surface must report, and `null` exactly when the call is answered. */
  readonly reason: RoundFailureReason | null
  readonly provenance: Provenance
  readonly rationale: string
}

export const edgeCases: readonly EdgeCase[] = [
  {
    id: 'the-half-cent-to-fixed-loses',
    group: 'the-decimal-a-double-cannot-hold',
    value: 1.005,
    places: 2,
    expected: 1.01,
    reason: null,
    provenance: 'specified',
    rationale:
      'The canonical instance. The double nearest 1.005 is 1.00499999999999989..., so ' +
      '`(1.005).toFixed(2)` answers "1.00" and the multiply answers 1. A caller who wrote 1.005 ' +
      'wrote the decimal, and the decimal is what is rounded.',
  },
  {
    id: 'the-smallest-half-cent-to-fixed-loses',
    group: 'the-decimal-a-double-cannot-hold',
    value: 0.015,
    places: 2,
    expected: 0.02,
    reason: null,
    provenance: 'specified',
    rationale:
      'The first value of the declared sweep that `toFixed` gets wrong, so the table carries the ' +
      'boundary the figure in `theTraps` starts counting from rather than only a memorable middle.',
  },
  {
    id: 'the-half-cent-the-multiply-loses',
    group: 'the-decimal-a-double-cannot-hold',
    value: 0.145,
    places: 2,
    expected: 0.15,
    reason: null,
    provenance: 'specified',
    rationale:
      'The first value the multiply gets wrong, and it is not the first `toFixed` gets wrong. The ' +
      'two spellings fail on different values, which is why the contract names two traps and not ' +
      'one told twice.',
  },
  {
    id: 'a-price-with-three-decimals',
    group: 'the-decimal-a-double-cannot-hold',
    value: 2.675,
    places: 2,
    expected: 2.68,
    reason: null,
    provenance: 'specified',
    rationale:
      'The instance every article about floating point uses, kept because a reader arriving from ' +
      'one of them looks for it and has to find this contract answering 2.68.',
  },
  {
    id: 'a-sum-that-is-not-its-parts',
    group: 'the-decimal-a-double-cannot-hold',
    value: 0.30000000000000004,
    places: 2,
    expected: 0.3,
    reason: null,
    provenance: 'specified',
    rationale:
      'What `0.1 + 0.2` really is. Rounding is the usual repair for it, and this row says the ' +
      'repair works: seventeen significant digits in, two out, with nothing left of the error.',
  },
  {
    id: 'a-positive-half',
    group: 'which-way-a-tie-goes',
    value: 0.5,
    places: 0,
    expected: 1,
    reason: null,
    provenance: 'specified',
    rationale: 'Away from zero, which on a positive value is the direction everybody agrees on.',
  },
  {
    id: 'a-negative-half',
    group: 'which-way-a-tie-goes',
    value: -0.5,
    places: 0,
    expected: -1,
    reason: null,
    provenance: 'specified',
    rationale:
      'Where `Math.round` parts company: it answers `-0`, because it breaks a tie towards positive ' +
      'infinity. This contract is symmetric, so a refund of half a unit rounds to the same ' +
      'magnitude as the charge it reverses.',
  },
  {
    id: 'a-negative-one-and-a-half',
    group: 'which-way-a-tie-goes',
    value: -1.5,
    places: 0,
    expected: -2,
    reason: null,
    provenance: 'specified',
    rationale:
      'The same parting one unit along, where `Math.round` answers -1. Two rows rather than one ' +
      'because -0 could be read as a sign question and this one cannot.',
  },
  {
    id: 'a-negative-two-and-a-half',
    group: 'which-way-a-tie-goes',
    value: -2.5,
    places: 0,
    expected: -3,
    reason: null,
    provenance: 'specified',
    rationale:
      'The row that separates this contract from half-to-even as well as from `Math.round`. ' +
      'Banker\'s rounding answers -2 here and -2 for -1.5; this contract answers -3 and -2, and ' +
      '`inputDomain` says which of the two jobs it is for.',
  },
  {
    id: 'just-below-a-tie',
    group: 'which-way-a-tie-goes',
    value: 0.4999,
    places: 0,
    expected: 0,
    reason: null,
    provenance: 'specified',
    rationale:
      'The other side of the boundary, so that the group settles where the tie *is* and not only ' +
      'what happens on it. Without it a contract that rounded everything up would satisfy the ' +
      'four rows above.',
  },
  {
    id: 'an-amount-that-rounds-away-to-nothing',
    group: 'the-sign-of-zero',
    value: -0.001,
    places: 2,
    expected: -0,
    reason: null,
    provenance: 'specified',
    rationale:
      'A tenth of a penny off an account, rounded to the penny. The answer is negative zero: the ' +
      'amount is gone and the direction is not, which is what a ledger line needs.',
  },
  {
    id: 'a-negative-zero-stays-negative',
    group: 'the-sign-of-zero',
    value: -0,
    places: 2,
    expected: -0,
    reason: null,
    provenance: 'specified',
    rationale:
      'Nothing is dropped, so the value is answered back - and `String(-0)` is "0", so an ' +
      'implementation reading the sign off the text loses it here and nowhere else.',
  },
  {
    id: 'a-positive-amount-that-rounds-away-to-nothing',
    group: 'the-sign-of-zero',
    value: 0.001,
    places: 2,
    expected: 0,
    reason: null,
    provenance: 'specified',
    rationale:
      'The row that makes the one above mean something. An implementation answering `-0` to ' +
      'everything would pass both rows before it, and fails here.',
  },
  {
    id: 'a-carry-through-every-digit',
    group: 'a-carry-that-runs',
    value: 0.9999999999999999,
    places: 15,
    expected: 1,
    reason: null,
    provenance: 'specified',
    rationale:
      'Sixteen nines, every one of which carries. The answer is one digit longer than the digits ' +
      'kept, which is the case an increment written as an arithmetic add gets wrong at the ' +
      'seventeenth digit.',
  },
  {
    id: 'a-carry-that-crosses-ten',
    group: 'a-carry-that-runs',
    value: 9.995,
    places: 2,
    expected: 10,
    reason: null,
    provenance: 'specified',
    rationale:
      'A tie whose carry changes the number of digits before the point as well as after it, so an ' +
      'implementation splitting the string on the decimal point has to put it back somewhere else.',
  },
  {
    id: 'a-carry-that-crosses-a-hundred',
    group: 'a-carry-that-runs',
    value: 99.995,
    places: 2,
    expected: 100,
    reason: null,
    provenance: 'specified',
    rationale:
      'The same crossing one order up, where the carry runs through two nines rather than one. ' +
      'Both rows are here because a carry that stops after one digit passes the first and fails ' +
      'this.',
  },
  {
    id: 'a-value-written-in-exponent-notation',
    group: 'a-magnitude-no-fixed-notation-holds',
    value: 1e21,
    places: 2,
    expected: 1e21,
    reason: null,
    provenance: 'specified',
    rationale:
      'The threshold where `String` stops writing digits and starts writing `1e+21`. An ' +
      'implementation reading the shortest decimal has to read that form, and one that splits on ' +
      'the decimal point alone reads the exponent as a fraction.',
  },
  {
    id: 'the-largest-double',
    group: 'a-magnitude-no-fixed-notation-holds',
    value: 1.7976931348623157e308,
    places: 0,
    expected: 1.7976931348623157e308,
    reason: null,
    provenance: 'specified',
    rationale:
      'Nothing to drop at any non-negative place count, so the value is answered back. It is here ' +
      'because an implementation that reassembles unconditionally can overflow to Infinity, which ' +
      'the contract forbids.',
  },
  {
    id: 'the-smallest-double-carried-up',
    group: 'a-magnitude-no-fixed-notation-holds',
    value: 5e-324,
    places: 323,
    expected: 1e-323,
    reason: null,
    provenance: 'specified',
    rationale:
      'The smallest positive double, rounded one place above itself. The answer is the next ' +
      'denormal up, so the row settles that the rule keeps working where the doubles stop being ' +
      'evenly spaced.',
  },
  {
    id: 'the-smallest-double-dropped',
    group: 'a-magnitude-no-fixed-notation-holds',
    value: 5e-324,
    places: 0,
    expected: 0,
    reason: null,
    provenance: 'specified',
    rationale:
      'The same value with every digit dropped. The dropped part opens with a zero rather than ' +
      'the five, because the five sits 324 places down - so it rounds to nothing, and an ' +
      'implementation looking at the first significant digit instead of the first dropped one ' +
      'answers 1.',
  },
  {
    id: 'a-place-count-of-negative-zero',
    group: 'the-place-count-at-its-edges',
    value: 1.5,
    places: -0,
    expected: 2,
    reason: null,
    provenance: 'specified',
    rationale:
      'Negative zero is a count of zero, not a negative count: `Number.isInteger(-0)` is true and ' +
      '`-0 < 0` is false. This row exists because it is settled by no property of this contract - ' +
      'measured, a perturbation refusing it reddened none of the ten guards, so the decision would ' +
      'otherwise be kept by nothing.',
  },
  {
    id: 'a-place-count-past-what-to-fixed-accepts',
    group: 'the-place-count-at-its-edges',
    value: 1.5,
    places: 400,
    expected: 1.5,
    reason: null,
    provenance: 'specified',
    rationale:
      'Where this contract and `toFixed` disagree about whether there is a question. ' +
      '`(1.5).toFixed(400)` throws a RangeError; asking for more places than the value carries is ' +
      'a request that changes nothing, and the answer is the value.',
  },
  {
    id: 'a-place-count-larger-than-any-decimal',
    group: 'the-place-count-at-its-edges',
    value: 1.5,
    places: 1e21,
    expected: 1.5,
    reason: null,
    provenance: 'specified',
    rationale:
      'The same question with a place count no string could ever be built to. It is answered ' +
      'without building one, which is why there is no `places-out-of-range` in the reason set.',
  },
  {
    id: 'every-place-already-there',
    group: 'the-place-count-at-its-edges',
    value: 19.99,
    places: 2,
    expected: 19.99,
    reason: null,
    provenance: 'specified',
    rationale:
      'The ordinary shape of the same thing, and most of the calls a real caller makes: a column ' +
      'of amounts normalised to two places, of which nearly all are already at two places.',
  },
  {
    id: 'not-a-number',
    group: 'what-is-refused',
    value: NaN,
    places: 2,
    expected: null,
    reason: 'value-not-finite',
    provenance: 'specified',
    rationale:
      'There is no decimal to round. Answering NaN would let the value keep travelling, which is ' +
      'the whole reason `number/parse@1` refuses to produce one.',
  },
  {
    id: 'positive-infinity',
    group: 'what-is-refused',
    value: Infinity,
    places: 2,
    expected: null,
    reason: 'value-not-finite',
    provenance: 'specified',
    rationale: 'The same refusal for the same reason, and one message covers both without lying.',
  },
  {
    id: 'negative-infinity',
    group: 'what-is-refused',
    value: -Infinity,
    places: 2,
    expected: null,
    reason: 'value-not-finite',
    provenance: 'specified',
    rationale:
      'Both infinities rather than one, because an implementation testing `value === Infinity` ' +
      'passes the row above and fails this.',
  },
  {
    id: 'a-fractional-place-count',
    group: 'what-is-refused',
    value: 1.5,
    places: 1.5,
    expected: null,
    reason: 'places-not-whole',
    provenance: 'specified',
    rationale:
      'A place count is a count. Half a decimal place is a bug in the calling code, and the ' +
      'reason says so rather than guessing at one or two.',
  },
  {
    id: 'a-place-count-that-is-not-a-number',
    group: 'what-is-refused',
    value: 1.5,
    places: NaN,
    expected: null,
    reason: 'places-not-whole',
    provenance: 'specified',
    rationale:
      'The shape a place count reaches when it is computed from something absent. ' +
      '`Number.isInteger(NaN)` is false, so one test covers it with the row above.',
  },
  {
    id: 'an-infinite-place-count',
    group: 'what-is-refused',
    value: 1.5,
    places: Infinity,
    expected: null,
    reason: 'places-not-whole',
    provenance: 'specified',
    rationale:
      'The third shape the same test covers, and the one that separates this reason from a range ' +
      'check: a finite place count of 1e21 is answered and an infinite one is refused.',
  },
  {
    id: 'a-negative-place-count',
    group: 'what-is-refused',
    value: 1.5,
    places: -1,
    expected: null,
    reason: 'places-negative',
    provenance: 'specified',
    rationale:
      'A caller asking to round to tens. It is a real job and it is not this one - `inputDomain` ' +
      'refuses it in as many words - so the reason is its own rather than folded into the one ' +
      'above: that repair is upstream in the calling code, and this one is to reach for a ' +
      'different tool.',
  },
]
