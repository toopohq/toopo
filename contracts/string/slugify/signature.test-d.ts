import { describe, it, expectTypeOf } from 'vitest'
import type { Slugify } from './contract.js'
import { slugify } from './reference.js'

/**
 * Block 4.2, executable. An implementation that widens its input, adds an optional parameter, or
 * loosens its return type fails the suite before any behavioural test runs.
 *
 * The signature is monomorphic, so the identity assertion carries all of it, as it did on
 * `string/levenshtein@1`. The three directives below are the negative half, and `array/group-by@1`
 * measured that a negative half nothing exercises never fires at all, which is why the battery
 * carries a mutant for each of them.
 */
describe('string/slugify@1 signature', () => {
  it('matches the type declared by the contract', () => {
    expectTypeOf(slugify).toEqualTypeOf<Slugify>()
  })

  it('accepts one string and nothing else', () => {
    expectTypeOf(slugify).parameter(0).toEqualTypeOf<string>()

    // @ts-expect-error the domain is text. A number reaching this function has not been through the
    // formatter it needed, and accepting it would make the signature the place where a value is
    // rendered - a decision about locale and precision that belongs to the caller.
    slugify(1)
  })

  it('always returns a string', () => {
    // Never `string | null`, and that is the shape of the contract rather than an accident: this
    // function is total, and the empty slug is an answer rather than a refusal. An implementation
    // declaring an absent answer would promise a refusal it can never deliver, and every caller
    // would unwrap something that is always there.
    expectTypeOf(slugify).returns.toEqualTypeOf<string>()
  })

  it('refuses a call with no argument', () => {
    // @ts-expect-error the parameter has no default: this contract has no opinion about what a
    // caller meant to slugify when they passed nothing.
    slugify()
  })

  it('refuses a call carrying options', () => {
    // @ts-expect-error every option a caller might reach for - a separator, a length bound, ASCII
    // output - changes what is computed rather than how, so it belongs to another contract rather
    // than to a second parameter here. `composeInsteadOfConfiguring` names where each one goes.
    slugify('Crème Brûlée', { separator: '_' })
  })
})
