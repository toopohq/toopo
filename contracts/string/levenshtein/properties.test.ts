import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { expectUniversalPropertiesAnswered } from '../../../catalogue/every-contract.js'
import { metricAxioms, outputsAreEqual, propertyRuns, universalProperties } from './contract.js'
import { levenshtein } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * This is the first contract in the catalogue whose properties are strong by nature. The four axioms
 * of block 4.2 hold of every pair of strings, so they are not statements about a region the
 * generators have to be steered into - they are statements about all of it, and the generators have
 * one job instead: to draw strings that are *close together*. Two strings drawn independently from a
 * large alphabet are almost always as far apart as they can be, and at that distance the triangle
 * inequality is slack, a single edit is invisible and the bounds are trivially satisfied. The
 * alphabet below is fourteen symbols and the strings are at most eight of them long, so a random pair
 * shares most of its content and every property is tested where it can actually fail.
 *
 * Half of what follows is liveness rather than safety, for the reason measured on `number/parse@1`:
 * an implementation that answers nothing satisfies every safety property a contract can state. Here
 * that implementation answers zero for everything, and it satisfies three of the four axioms - a
 * constant zero is symmetric, it is zero on the diagonal, and no detour beats it. P2 is what forces
 * an answer out of it, and the mutation battery measures that rather than leaving it to argument.
 */

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/**
 * The alphabet, chosen so that a short random string reaches every region this contract settles: a
 * few letters that collide often, a case pair, a precomposed character and the combining mark that
 * decomposes it, the three code points of a joined emoji sequence, and an unpaired surrogate.
 *
 * No symbol here begins with a low surrogate, which is what makes the constructions below safe: an
 * edit at a code-point boundary can put the lone high surrogate next to any of them without the two
 * merging into one code point, so a string built from n symbols really is n code points long. The
 * precondition block at the end of this file measures that rather than trusting it.
 */
const COMBINING_ACUTE = String.fromCodePoint(0x0301)
const PRECOMPOSED_E_ACUTE = String.fromCodePoint(0x00e9)
const ZERO_WIDTH_JOINER = String.fromCodePoint(0x200d)
const LONE_HIGH_SURROGATE = String.fromCharCode(0xd83d)

const ALPHABET = [
  'a',
  'b',
  'c',
  'A',
  ' ',
  '1',
  'e',
  PRECOMPOSED_E_ACUTE,
  COMBINING_ACUTE,
  String.fromCodePoint(0x1f600),
  String.fromCodePoint(0x1f469),
  String.fromCodePoint(0x1f4bb),
  ZERO_WIDTH_JOINER,
  LONE_HIGH_SURROGATE,
] as const

const anySymbol = fc.constantFrom(...ALPHABET)

const anyText = fc.array(anySymbol, { maxLength: 8 }).map((symbols) => symbols.join(''))

const codePoints = (text: string): readonly string[] => [...text]

const lengthIn = (text: string): number => codePoints(text).length

/**
 * A pair built by applying exactly one edit, so that P7 can assert an exact answer rather than a
 * bound. The filter removes the substitution that replaced a symbol with itself, which is not an
 * edit; nothing else can make the two strings equal.
 */
const oneEditApart: fc.Arbitrary<readonly [string, string]> = fc
  .tuple(anyText, fc.nat(), anySymbol, fc.constantFrom('insert', 'delete', 'substitute'))
  .map(([text, offset, symbol, kind]) => {
    const units = codePoints(text)

    if (kind === 'insert' || units.length === 0) {
      const at = offset % (units.length + 1)

      return [text, [...units.slice(0, at), symbol, ...units.slice(at)].join('')] as const
    }

    const at = offset % units.length
    const rest = units.slice(at + 1)

    return kind === 'delete'
      ? ([text, [...units.slice(0, at), ...rest].join('')] as const)
      : ([text, [...units.slice(0, at), symbol, ...rest].join('')] as const)
  })
  .filter(([before, after]) => before !== after)

// ---------------------------------------------------------------------------
// The four axioms of block 4.2
// ---------------------------------------------------------------------------

/** The axioms this file answers, one property each, checked against block 4.2 below. */
const axiomsAnswered = ['identity', 'discernibility', 'symmetry', 'triangle inequality'] as const

describe('string/levenshtein@1 specific properties', () => {
  it('P1 - identity: a string is at distance zero from itself', () => {
    fc.assert(
      fc.property(anyText, (text) => levenshtein(text, text) === 0),
      { numRuns: propertyRuns },
    )
  })

  it('P2 - discernibility: two different strings are at a distance of at least one', () => {
    // The liveness property of this contract, and the only one of the four axioms that forces an
    // answer out. An implementation returning zero for every pair satisfies P1, P3 and P4 exactly,
    // and satisfies P6 as well, because forbidding wrong answers is free for a function that gives
    // none.
    fc.assert(
      fc.property(anyText, anyText, (a, b) => a === b || levenshtein(a, b) >= 1),
      { numRuns: propertyRuns },
    )
  })

  it('P3 - symmetry: the distance does not depend on which string comes first', () => {
    fc.assert(
      fc.property(anyText, anyText, (a, b) => outputsAreEqual(levenshtein(a, b), levenshtein(b, a))),
      { numRuns: propertyRuns },
    )
  })

  it('P4 - the triangle inequality: no detour through a third string is shorter', () => {
    // The axiom that catches an implementation whose notion of two code points being equal is not
    // transitive - a tolerance, a fuzzy comparison, one unit applied to one side and another to the
    // other. None of those answers an obviously wrong number on any single pair, so no named case
    // sees them; this is the only guard in the contract that compares three strings at once.
    fc.assert(
      fc.property(anyText, anyText, anyText, (a, b, c) => {
        return levenshtein(a, c) <= levenshtein(a, b) + levenshtein(b, c)
      }),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// What the axioms do not say
// ---------------------------------------------------------------------------

describe('string/levenshtein@1 specific properties beyond the axioms', () => {
  it('P5 - the distance sits between the difference of the lengths and the longer length', () => {
    // The lower bound is the second liveness property, and it is not implied by P2: the discrete
    // metric - zero on equal strings, one on everything else - satisfies all four axioms and is not
    // this function. It answers one where the empty string meets a string of three code points, and
    // this bound answers three.
    fc.assert(
      fc.property(anyText, anyText, (a, b) => {
        const distance = levenshtein(a, b)
        const gap = Math.abs(lengthIn(a) - lengthIn(b))

        return distance >= gap && distance <= Math.max(lengthIn(a), lengthIn(b))
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P6 - the answer is a whole number and never negative', () => {
    // `Number.isInteger` is false for NaN and for both infinities, so one call covers the three
    // values a broken arithmetic produces. It is a safety property and its support is everywhere,
    // which is why it draws the same texts as the rest rather than a region of its own.
    fc.assert(
      fc.property(anyText, anyText, (a, b) => {
        const distance = levenshtein(a, b)

        return Number.isInteger(distance) && distance >= 0 && !Object.is(distance, -0)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('P7 - one edit apart is a distance of exactly one', () => {
    // P5 gives the lower bound on the pairs whose lengths differ and says nothing about a
    // substitution; P2 gives one in every direction. What this adds is the upper bound: an
    // implementation that prices an edit at two, or that offers no substitution at all, satisfies
    // every axiom and answers two here.
    fc.assert(
      fc.property(oneEditApart, ([before, after]) => levenshtein(before, after) === 1),
      { numRuns: propertyRuns },
    )
  })

  it('P8 - a shared prefix and a shared suffix cost nothing', () => {
    // The strongest statement in this block, and the one that pins the recurrence rather than its
    // boundary: wrapping two strings in text they both carry leaves the answer alone. It is what an
    // implementation that trims common affixes relies on, and it is the property that catches an
    // implementation whose matrix edges are right and whose interior is not.
    fc.assert(
      fc.property(anyText, anyText, anyText, anyText, (prefix, a, b, suffix) =>
        outputsAreEqual(levenshtein(prefix + a + suffix, prefix + b + suffix), levenshtein(a, b)),
      ),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// Universal properties
// ---------------------------------------------------------------------------

describe('string/levenshtein@1 universal properties', () => {
  it('keeps the inapplicable universal properties declared as such', () => {
    expectUniversalPropertiesAnswered(universalProperties, [
      'never mutates its arguments',
      'no ambient output',
    ])
  })

  it('is deterministic - the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(anyText, anyText, (a, b) =>
        outputsAreEqual(levenshtein(a, b), levenshtein(a, b)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('has no ambient input - an answer does not depend on the calls made before it', () => {
    fc.assert(
      fc.property(
        anyText,
        anyText,
        fc.array(fc.tuple(anyText, anyText), { maxLength: 12 }),
        (a, b, history) => {
          const first = levenshtein(a, b)
          for (const [earlierA, earlierB] of history) levenshtein(earlierA, earlierB)

          return outputsAreEqual(levenshtein(a, b), first)
        },
      ),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// The declarations the properties above rest on
// ---------------------------------------------------------------------------

describe('string/levenshtein@1 property preconditions', () => {
  it('answers every declared metric axiom with a property, and declares every axiom it answers', () => {
    // An axiom published in block 4.2 with no property behind it would be a claim this contract
    // makes and does not check, which is the one thing it sells against. Both directions, one guard.
    expect([...metricAxioms].map((axiom) => axiom.name).sort()).toEqual([...axiomsAnswered].sort())
  })

  it('publishes a statement for every metric axiom', () => {
    const unexplained = metricAxioms.filter((axiom) => axiom.statement.trim() === '')

    expect(unexplained.map((axiom) => axiom.name)).toEqual([])
  })

  it('draws pairs that really are one code point apart', () => {
    // P7 asserts an exact answer, so it is only sound if the generator really applies one edit. The
    // risk is not hypothetical: an alphabet gaining an unpaired *low* surrogate would let an
    // insertion merge with its neighbour into a single code point, and P7 would fail on a correct
    // implementation. This is the sensor for that, and it is not circular - it measures the lengths
    // the contract's own unit reports, without asking the function under test anything.
    fc.assert(
      fc.property(oneEditApart, ([before, after]) => {
        return before !== after && Math.abs(lengthIn(before) - lengthIn(after)) <= 1
      }),
      { numRuns: propertyRuns },
    )
  })

  it('draws texts that reach every region the properties police', () => {
    // Without this the properties above are guards whose support is a matter of hope. Each entry is
    // a region some property can only fail in, and the assertion is that the alphabet reaches it at
    // all; the battery's probes then ask whether the arbitraries reach it under the declared number
    // of runs.
    const astral = ALPHABET.filter((symbol) => symbol.length === 2 && lengthIn(symbol) === 1)
    const loneSurrogates = ALPHABET.filter((symbol) => symbol === LONE_HIGH_SURROGATE)
    const combining = ALPHABET.filter((symbol) => symbol === COMBINING_ACUTE)
    const caseVariants = ALPHABET.filter((symbol) => symbol.toLowerCase() !== symbol)

    expect({
      astralCharacters: astral.length,
      loneSurrogates: loneSurrogates.length,
      combiningMarks: combining.length,
      caseVariants: caseVariants.length,
    }).toEqual({
      astralCharacters: 3,
      loneSurrogates: 1,
      combiningMarks: 1,
      caseVariants: 1,
    })
  })
})
