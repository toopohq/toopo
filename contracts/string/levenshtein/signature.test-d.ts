import { describe, it, expectTypeOf } from 'vitest'
import type { Levenshtein } from './contract.js'
import { levenshtein } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, makes an argument optional, or
 * loosens its return type fails the suite before any behavioural test runs.
 *
 * The signature is monomorphic, so the identity assertion carries all of it - unlike
 * `array/group-by@1`, where a generic signature is also a promise about inference and the identity
 * assertion had to be followed by call-site checks. The three directives below are the negative half,
 * and `array/group-by@1` measured that a negative half nothing exercises never fires at all, which is
 * why the battery carries a mutant for each of them.
 */
describe('string/levenshtein@1 signature', () => {
  it('matches the type declared by the contract', () => {
    expectTypeOf(levenshtein).toEqualTypeOf<Levenshtein>()
  })

  it('accepts two strings and nothing else', () => {
    expectTypeOf(levenshtein).parameter(0).toEqualTypeOf<string>()
    expectTypeOf(levenshtein).parameter(1).toEqualTypeOf<string>()

    // @ts-expect-error the domain is text. A number reaching this function has not been through the
    // formatter it needed, and accepting it would make the signature the place where a value is
    // rendered - which is a decision about locale and precision that belongs to the caller.
    levenshtein(1, 2)
  })

  it('always returns a number', () => {
    // Never `number | null`, and that is the shape of the contract rather than an accident: this
    // function is total, so an implementation declaring an absent answer would be promising a
    // refusal it can never deliver, and every caller would unwrap something that is always there.
    expectTypeOf(levenshtein).returns.toEqualTypeOf<number>()
  })

  it('refuses a call with one string', () => {
    // @ts-expect-error neither argument has a default: this contract has no opinion about what a
    // caller meant to compare a single string against.
    levenshtein('kitten')
  })

  it('refuses a call carrying options', () => {
    // @ts-expect-error every option a caller might reach for changes what is computed rather than
    // how, so it belongs to another contract rather than to a third parameter here.
    levenshtein('kitten', 'sitting', { caseSensitive: false })
  })
})
