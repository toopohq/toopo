/**
 * Reference implementation of `number/round@1`.
 *
 * It is one implementation of the contract and not the contract: `contract.ts` governs, this file
 * competes. `referenceImplementationRules` is the bar it is held to - it may not import its own
 * contract, and it may not delegate to a built-in that does the same job.
 *
 * ADR-0143 is why it rounds a decimal string rather than a number, and carries the sixteen
 * perturbations of this file that every property below was seen red on.
 *
 * ---------------------------------------------------------------------------
 * Why the decimal and not the double
 * ---------------------------------------------------------------------------
 *
 * A caller who writes `1.005` means the decimal one-and-five-thousandths. What they get is the
 * nearest double, which is 1.00499999999999989341858963598497211933135986328125 - below the tie. An
 * implementation that rounds *that* answers 1.00, which is what `toFixed` does and what makes it the
 * trap this contract corrects.
 *
 * So the rounding is done on the decimal, and the decimal is read off `String(value)`. That is not a
 * convenience: ECMA-262 requires `Number::toString` to produce the *shortest* decimal that reads
 * back as the same double, which is exactly "what the caller wrote" for any value a caller typed or
 * parsed. Measured over 199 914 random finite doubles, `Number(String(v)) === v` on every one.
 *
 * ---------------------------------------------------------------------------
 * Why no arithmetic on the value at all
 * ---------------------------------------------------------------------------
 *
 * Every spelling that multiplies, divides or adds introduces a second error on top of the first, and
 * moving an error is not removing it. Once the decimal is a digit string, rounding it is a
 * comparison against `'5'` and a carry, both exact at any length. The one arithmetic step left is
 * the final `Number(...)`, which is the caller's own conversion and not ours.
 */

import type { DescribeRoundFailure, Round, RoundFailureReason } from './contract.js'

/**
 * The refusal both exports consult, so that the coupling in block 4.2 holds by construction here.
 *
 * The contract does not require an implementation to be built this way - one that validates twice
 * can diverge, which is what property `p5-failure-coupling` exists to catch on somebody else's
 * module.
 */
const refusalFor = (value: number, places: number): RoundFailureReason | null => {
  if (!Number.isFinite(value)) return 'value-not-finite'
  // `Number.isInteger` answers false for NaN and for both infinities, so one test covers all three
  // shapes of a place count that is not a whole number.
  if (!Number.isInteger(places)) return 'places-not-whole'
  // `-0 < 0` is false, and that is the answer this contract wants: negative zero is a count of zero.
  if (places < 0) return 'places-negative'

  return null
}

/**
 * Add one to a decimal digit string, carrying left and growing by a digit when every digit is nine.
 *
 * String arithmetic rather than `Number(kept) + 1` because `kept` can be seventeen digits, and
 * seventeen digits is past the point where adding one to a double is exact. Measured: the shortest
 * decimal of a finite double carries at most seventeen significant digits, and `2 ** 53` is sixteen.
 */
const incremented = (digits: string): string => {
  const out = [...(digits === '' ? '0' : digits)]

  for (let at = out.length - 1; at >= 0; at--) {
    if (out[at] !== '9') {
      out[at] = String(Number(out[at]) + 1)

      return out.join('')
    }

    out[at] = '0'
  }

  return `1${out.join('')}`
}

/**
 * The shortest decimal of a non-negative finite double, as an integer digit string and a power of
 * ten: `digits * 10 ** scale` is the value.
 *
 * `String` writes three forms - `123`, `1.25` and `1e+21` - and this reads all three by splitting on
 * each separator in turn and defaulting what is absent. Leading zeros are dropped because
 * `String(0.001)` is `"0.001"`, whose digit string is `"0001"`; trailing zeros are left alone,
 * because they cost nothing and removing them would be a second thing that can be wrong.
 */
const shortestDecimalOf = (value: number): { readonly digits: string; readonly scale: number } => {
  const [mantissa = '', exponent = '0'] = String(value).split('e')
  const [whole = '', fraction = ''] = mantissa.split('.')

  return {
    digits: (whole + fraction).replace(/^0+(?=\d)/, ''),
    scale: Number(exponent) - fraction.length,
  }
}

/**
 * Round half away from zero, on the decimal rather than on the double.
 *
 * The sign is taken before anything else because `String(-0)` is `"0"`: the one place in this module
 * where a value's sign is not recoverable from its text.
 */
export const round: Round = (value, places) => {
  if (refusalFor(value, places) !== null) return null

  const negative = value < 0 || Object.is(value, -0)
  const { digits, scale } = shortestDecimalOf(Math.abs(value))

  // How many digits fall past the last place the caller asked to keep. Nothing to drop means the
  // value already *is* its own answer, and returning it carries the sign of zero for free.
  const toDrop = -places - scale
  if (toDrop <= 0) return value

  const kept = toDrop >= digits.length ? '' : digits.slice(0, digits.length - toDrop)
  // Past the left edge of the digit string the dropped part opens with a zero, so it is below the
  // half and never carries: `round(0.05, 0)` is 0 and not 1.
  const first = toDrop > digits.length ? '0' : (digits[digits.length - toDrop] as string)
  const carried = first >= '5' ? incremented(kept) : kept === '' ? '0' : kept

  // `Number('-0e-2')` is negative zero, so a refund that rounds to nothing keeps its direction.
  return Number(`${negative ? '-' : ''}${carried}e${-places}`)
}

export const describeRoundFailure: DescribeRoundFailure = (value, places) =>
  refusalFor(value, places)
