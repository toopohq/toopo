import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  UNIVERSAL_PROPERTIES_ARE_ANSWERED,
  expectUniversalPropertiesAnswered,
} from '../../../../packages/catalogue/every-contract.js'
import {
  outputAlphabet,
  outputsAreEqual,
  propertyRuns,
  theRule,
  universalProperties,
} from './contract.js'
import { slugify } from './reference.js'

/**
 * Block 4.3 - behavioural properties.
 *
 * This contract has no axioms. `string/levenshtein@1` could rest on the four laws of a metric,
 * which are theorems about every pair of strings; every property below is a statement about the
 * *shape* of a slug instead - it is closed under an alphabet, it is a fixed point, it splits where
 * a boundary is.
 *
 * The expectation was that shape properties would leave the content of a slug to block 4.4, and the
 * battery measured otherwise: twenty-one of its twenty-two behaviour defects die with that whole
 * table blinded. P7 is why, and it is worth understanding before adding a symbol to its alphabet.
 * It pins an exact answer on every string the arbitrary can build, so each symbol admitted there
 * turns one curation decision into a property - a sharp s in that alphabet is what makes
 * `Straße -> straße` property-checkable. What no symbol represents is settled by a named case and
 * by nothing else: measured, an implementation that transliterates Cyrillic satisfies every
 * property in this file.
 *
 * Half of what follows is liveness rather than safety, for the reason measured on
 * `number/parse@1`: an implementation that answers nothing satisfies every safety property a
 * contract can state. Here that implementation answers the empty string for everything, and it
 * satisfies closure, shape and idempotence exactly. P6 and P7 are what force an answer out of it,
 * and the battery measures which of the two actually does rather than leaving it to argument.
 */

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const COMBINING_ACUTE = '́'
const ARABIC_FATHA = 'َ'
const DEVANAGARI_KA = 'क'
const DEVANAGARI_VIRAMA = '्'
const DEVANAGARI_NUKTA = '़'
const LONE_HIGH_SURROGATE = String.fromCharCode(0xd83d)
const ZERO_WIDTH_JOINER = '‍'

/**
 * A letter outside the basic plane. It is in both alphabets below because it is the only kind of
 * input that separates an implementation walking code points from one walking UTF-16 code units:
 * emoji cannot, since both conventions discard them.
 */
const GOTHIC_AHSA = String.fromCodePoint(0x10330)

/**
 * A second astral letter, and it is here for a **rate** rather than for coverage.
 *
 * The coverage was already had: one astral letter is enough to separate the two walks, which is what
 * the comment above says and what the case of block 4.4 demonstrates. What one was not enough for is
 * the *probability* that P6 meets the separation inside its declared number of draws. With a single
 * astral symbol a catching text — one whose only keepable content is astral — comes up on 0.87% of
 * draws, so P6 is silent on about one run in six thousand; `G-02` of `string-slugify` pins P6, and
 * that silence was observed on a replay. A pin met by a green teaches its reader to ignore the red,
 * which is the one way this instrument gets destroyed.
 *
 * A second symbol of the same kind roughly doubles the probability and squares the rarity: measured,
 * 1.60% of draws catch, and the silence goes below one run in a hundred thousand under any reading
 * of the measurement this repository can make. **The margin is the point rather than the figure** —
 * `mutants.ts` records that a rate reproduced this way is good to an order of magnitude, so a repair
 * is chosen for leaving that uncertainty no room, not for the digits it prints.
 *
 * Old Italic rather than a second Gothic letter, so that what the alphabet says is *astral letters*
 * rather than *this one script*. It carries the same kinds as the one above — a letter, astral,
 * NFKC-stable, no decomposition, no case — so it adds probability without adding a region, and the
 * partition guard at the end of this file is what holds that.
 */
const OLD_ITALIC_A = String.fromCodePoint(0x10300)

/**
 * Characters this contract discards. They are drawn as a set rather than as one representative
 * because P5 asserts that swapping one for another changes nothing, and a single representative
 * would make that assertion vacuous.
 */
const DISCARDED = [' ', '-', '_', '!', '.', '/', '&', '€', '🎉', LONE_HIGH_SURROGATE, ZERO_WIDTH_JOINER] as const

/**
 * Pairs of spellings the rule is required to unify: a rich form and the plain form it folds to.
 *
 * This is how P1 tests the `unify` and `fold` steps without holding a copy of the fold. Three kinds,
 * and the support guard at the end of this file partitions the table rather than counting it: a
 * compatibility form beside its ordinary spelling, a precomposed letter beside its base, and an
 * upper-case letter beside its lower one. The property is that a text built from the left column and
 * the same text built from the right column answer one slug.
 *
 * **A decomposed entry was proposed, measured, and refused**, and it is recorded here so that the
 * next reader does not repeat the detour. It was proposed to make this table catch `G-14` of
 * `string-slugify`, the mutant that stops keeping marks - against which these pairs are blind at
 * 0 of 200 000 draws. It cannot: `unify` is NFKC, which *composes*, so `e` followed by a combining
 * acute is already `é` before the `keep` step this mutant breaks ever runs. A mark only survives to
 * `keep` when it does not compose onto its base, and a mark that survives is a mark the rule *keeps*
 * rather than two spellings of one thing - so a table of equivalent spellings cannot reach that
 * mutant at all. `POLICED` below says the same thing in one line: P1 polices `unify` and `fold`, and
 * `keep` is P4 and P6.
 *
 * Measured with the entry added: 0 of 100 000 against `G-14`, unchanged, and *fewer* catches on the
 * mutants P1 does police - 35 487 against 38 142 for `unify -> NFKD`, 80 700 against 83 995 for
 * `unify -> NFC` - because a tenth entry dilutes the nine. The canonical-composition half of NFKC is
 * already exercised by the precomposed column, from the other direction, which is what those two
 * figures are. And the decomposed input itself is settled where it belongs, by the named case
 * `a-decomposed-diacritic-folds-alike` of block 4.4.
 */
const EQUIVALENT_SPELLINGS = [
  ['é', 'e'],
  ['ế', 'e'],
  ['Å', 'a'],
  ['İ', 'i'],
  ['Ａ', 'a'],
  ['ﬁ', 'fi'],
  ['Ⅷ', 'viii'],
  ['²', '2'],
  ['Σ', 'σ'],
] as const

/**
 * The alphabet the general-purpose texts are drawn from, chosen so that a short random string
 * reaches every region this contract settles: letters that fold and letters that do not, a case
 * pair, a digit, three scripts that keep their marks, a mark that composes onto a base and one that
 * does not, a discarded symbol of each kind, and an unpaired surrogate.
 */
const ALPHABET = [
  'a',
  'B',
  '1',
  'é',
  'e',
  COMBINING_ACUTE,
  'ß',
  'æ',
  'Σ',
  'ς',
  '日',
  DEVANAGARI_KA,
  DEVANAGARI_VIRAMA,
  DEVANAGARI_NUKTA,
  ARABIC_FATHA,
  'م',
  'Ａ',
  '²',
  GOTHIC_AHSA,
  OLD_ITALIC_A,
  ...DISCARDED,
] as const

const anySymbol = fc.constantFrom(...ALPHABET)

const anyText = fc.array(anySymbol, { maxLength: 10 }).map((symbols) => symbols.join(''))

const anyDiscarded = fc.constantFrom(...DISCARDED)

/**
 * A text and its plain spelling, built together so that the two differ only where a rich form was
 * chosen. The plain column is what the rule must fold the rich column to.
 */
const anyPairOfSpellings: fc.Arbitrary<readonly [string, string]> = fc
  .array(
    fc.oneof(
      fc.constantFrom(...EQUIVALENT_SPELLINGS),
      anySymbol.map((symbol) => [symbol, symbol] as const),
    ),
    { maxLength: 8 },
  )
  .map((parts) => [parts.map(([rich]) => rich).join(''), parts.map(([, plain]) => plain).join('')])

/**
 * A string that is already a well-formed slug, built rather than drawn, because P7 has to be given
 * one and asking the function under test to produce one would make the property circular.
 *
 * The run alphabet carries no mark that a neighbouring base could absorb, which is what makes these
 * strings fixed points by construction rather than by hope; the precondition block at the end of
 * this file measures that without calling `slugify`.
 */
const SLUG_SYMBOL = [
  'a',
  'b',
  'z',
  '0',
  '9',
  '日',
  'م',
  'ß',
  'æ',
  'ς',
  DEVANAGARI_KA,
  GOTHIC_AHSA,
] as const

const anySlug: fc.Arbitrary<string> = fc
  .array(fc.array(fc.constantFrom(...SLUG_SYMBOL), { minLength: 1, maxLength: 5 }), {
    minLength: 1,
    maxLength: 4,
  })
  .map((runs) => runs.map((run) => run.join('')).join('-'))

/**
 * Both halves of what block 4.2 declares an alphabet to be. The pattern carries the characters and
 * the description carries the case, and a check that read only the pattern would be weaker than the
 * sentence the contract publishes - measured: an implementation that never lower-cases satisfies
 * the pattern exactly, because an upper-case letter is a letter.
 */
/**
 * Text that stacks marks on a base, which is the region P2 and P3 can only fail in.
 *
 * They need their own generator and the reason was measured rather than assumed, on the same
 * question `string/levenshtein@1` asked of its triangle inequality: is the property sound, or is
 * its support starved? A defect that mistakes the base of a run for the code point to its left is
 * only visible when a mark the base absorbs sits behind a mark it does not, and three symbols drawn
 * independently from an alphabet of thirty almost never produce that. Measured against G-07 of the
 * battery, `anyText` reddens P2 on some runs and not others - it was red on one column and green on
 * the other in the same run - while the generator below reddens it on every run measured. The
 * reference survives the same generator, which is what says the widening sharpened the support
 * rather than hardening the property.
 *
 * The other properties keep `anyText`, for the reason `date/add@1` kept `anyDate` on five of its
 * six: widening a generator that does not need it buys nothing and costs the reader a second thing
 * to understand.
 */
const anyMark = fc.constantFrom(
  COMBINING_ACUTE,
  ARABIC_FATHA,
  DEVANAGARI_VIRAMA,
  DEVANAGARI_NUKTA,
)

const anyBase = fc.constantFrom('e', 'a', 'x', 'é', 'Å', DEVANAGARI_KA, 'م', '日')

const anyStackedText: fc.Arbitrary<string> = fc
  .array(fc.tuple(anyBase, fc.array(anyMark, { minLength: 1, maxLength: 3 })), {
    minLength: 1,
    maxLength: 3,
  })
  .map((groups) => groups.map(([base, marks]) => `${base}${marks.join('')}`).join(''))

const anyTextOrStack = fc.oneof(anyText, anyStackedText)

/**
 * A pair of texts to put a discarded character between, with a cased letter on each side of the
 * gap. It is the region P5 can only fail in, and it needed building for the same reason P2 and P3
 * did.
 *
 * P5 exists to state that an answer must not depend on a character the function discards, and the
 * only way that dependency arises in JavaScript is the final sigma: `toLowerCase` reads whether a
 * cased letter follows, through characters it considers case-ignorable. So the property can only
 * fail on a draw where a sigma is preceded by a cased letter, followed by the swapped character,
 * and then by another cased letter - and independently drawn text produces that on well under one
 * per cent of draws. Measured against G-12 of the battery, `anyText` left P5 green on one run out
 * of four; the generator below fixes both ends of the gap to cased letters and draws a sigma as one
 * pivot in three. The reference survives it, which is what says the widening sharpened the support
 * rather than hardening the property.
 */
const CAPITAL_SIGMA = 'Σ'

const anyCasedSymbol = fc.constantFrom('a', 'B', 'e', CAPITAL_SIGMA)

const aroundACasedGap: fc.Arbitrary<readonly [string, string]> = fc
  .tuple(
    fc.array(anySymbol, { maxLength: 4 }),
    anyCasedSymbol,
    fc.constantFrom(CAPITAL_SIGMA, 'a', 'B'),
    anyCasedSymbol,
    fc.array(anySymbol, { maxLength: 4 }),
  )
  .map(
    ([prefix, lead, pivot, trail, suffix]) =>
      [`${prefix.join('')}${lead}${pivot}`, `${trail}${suffix.join('')}`] as const,
  )

const looksLikeASlug = (text: string): boolean =>
  (text === '' || outputAlphabet.pattern.test(text)) &&
  text === [...text].map((point) => point.toLowerCase()).join('')

const hasSomethingToKeep = (text: string): boolean => /[\p{L}\p{Nd}]/u.test(text)

const absorbs = (base: string, mark: string): boolean =>
  [...`${base}${mark}`.normalize('NFC')].length === 1

/**
 * Whether a slug carries a mark that the base of its own run would absorb - the invariant that
 * makes this function a fixed point, read off an answer rather than off the fold that produced it.
 *
 * It asks about the base of the run and never about the code point to the left, and the first
 * version of this helper made exactly the mistake it exists to catch: measured, it stayed green on
 * G-07 of the battery, which is the mutant that tests the left-hand neighbour. Unicode lets a mark
 * of high combining class compose onto the starter across a mark of lower class, so a neighbour
 * test cannot see an acute reaching an `e` from behind an Arabic fatha.
 */
const carriesAnAbsorbableMark = (slug: string): boolean => {
  let runBase: string | null = null

  for (const point of slug) {
    if (point === '-') {
      runBase = null
      continue
    }

    if (/\p{M}/u.test(point)) {
      if (runBase !== null && absorbs(runBase, point)) return true
      continue
    }

    runBase = point
  }

  return false
}

// ---------------------------------------------------------------------------
// The six steps of the rule
// ---------------------------------------------------------------------------

/**
 * Which property polices which step of `theRule`. Both directions are checked at the end of this
 * file: a step published with nothing behind it is a claim the contract does not keep, and a
 * property policing a step nobody declared is a guard nobody asked for.
 */
const POLICED: Readonly<Record<string, readonly string[]>> = {
  unify: ['P1'],
  fold: ['P1'],
  absorb: ['P2', 'P3'],
  keep: ['P4', 'P6'],
  lower: ['P4', 'P5'],
  join: ['P4', 'P8'],
}

describe('string/slugify@1 specific properties', () => {
  it('p1-two-spellings-one-slug :: two spellings of one text answer one slug', () => {
    // The `unify` and `fold` steps together, tested without a copy of the fold: the two strings are
    // built side by side from a table of equivalent spellings, so the property knows what should be
    // equal without knowing how the function gets there.
    fc.assert(
      fc.property(anyPairOfSpellings, ([rich, plain]) =>
        outputsAreEqual(slugify(rich), slugify(plain)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('p2-idempotence :: slugging a slug changes nothing', () => {
    // Idempotence. It is a safety property and the constant-empty implementation satisfies it, so
    // it is not what makes this contract live - but it is the property two successive formulations
    // of the `absorb` step failed, and the two counterexamples are named in block 4.4.
    fc.assert(
      fc.property(anyTextOrStack, (text) => {
        const once = slugify(text)

        return outputsAreEqual(slugify(once), once)
      }),
      { numRuns: propertyRuns },
    )
  })

  it('p3-no-absorbable-mark :: no mark in the answer composes onto the base of its run', () => {
    // The invariant idempotence rests on, asserted directly rather than inferred from it. A slug
    // carrying a mark its run's base would absorb is a slug the next call would shorten, and this
    // guard names that as the defect instead of waiting for P2 to notice the symptom.
    fc.assert(
      fc.property(anyTextOrStack, (text) => !carriesAnAbsorbableMark(slugify(text))),
      { numRuns: propertyRuns },
    )
  })

  it('p4-the-declared-alphabet :: the answer belongs to the declared alphabet', () => {
    // The `keep`, `lower` and `join` steps read off the result at once. It is a safety property,
    // free for a function that answers nothing, and its support is everywhere.
    fc.assert(
      fc.property(anyText, (text) => looksLikeASlug(slugify(text))),
      { numRuns: propertyRuns },
    )
  })

  it('p5-discarded-characters-are-interchangeable :: swapping one discarded character for another changes nothing', () => {
    // The `lower` step, stated as what it protects: an answer must not depend on a character that
    // does not survive it. It is the property that fails on an implementation lower-casing the
    // whole text at once, because JavaScript's lower-casing reads the character after a Greek sigma
    // to decide whether it is final - including a character this function is about to discard.
    fc.assert(
      fc.property(aroundACasedGap, anyDiscarded, anyDiscarded, ([before, after], one, other) =>
        outputsAreEqual(slugify(before + one + after), slugify(before + other + after)),
      ),
      { numRuns: propertyRuns },
    )
  })

  it('p6-a-letter-or-a-digit-answers :: a text with a letter or a digit answers a non-empty slug', () => {
    // Liveness. The constant-empty implementation dies here, and so does one that drops a whole
    // script. The condition is deliberately weaker than the rule - it asks about letters and digits
    // only, never about marks - so that it cannot be satisfied by copying the implementation.
    fc.assert(
      fc.property(anyText, (text) => !hasSomethingToKeep(text) || slugify(text) !== ''),
      { numRuns: propertyRuns },
    )
  })

  it('p7-a-slug-is-a-fixed-point :: a well-formed slug is returned unchanged', () => {
    // The second liveness property, and the strongest single statement in this block: it pins the
    // answer exactly on a whole family of inputs rather than constraining its shape. An
    // implementation that answers the empty string, that drops the last run, or that folds a letter
    // it should keep dies here. The slugs are built by the arbitrary above rather than produced by
    // the function, which is what keeps the assertion from comparing the function against itself.
    fc.assert(
      fc.property(anySlug, (slug) => outputsAreEqual(slugify(slug), slug)),
      { numRuns: propertyRuns },
    )
  })

  it('p8-one-separator-per-gap :: a separator appears exactly between two runs', () => {
    // The `join` step. P4 already refuses a leading, trailing or doubled separator through the
    // alphabet pattern; what this adds is that the count is right - a slug of n runs carries n - 1
    // separators - which is what catches an implementation that emits one per boundary rather than
    // one per gap.
    fc.assert(
      fc.property(anyText, (text) => {
        const slug = slugify(text)
        if (slug === '') return true

        const runs = slug.split('-')

        return (
          runs.every((run) => run !== '') &&
          [...slug].filter((point) => point === '-').length === runs.length - 1
        )
      }),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// Universal properties
// ---------------------------------------------------------------------------

describe('string/slugify@1 universal properties', () => {
  it(UNIVERSAL_PROPERTIES_ARE_ANSWERED, () => {
    expectUniversalPropertiesAnswered(universalProperties, [
      'never mutates its arguments',
      'no ambient output',
    ])
  })

  it('determinism :: the same call yields the same answer every time', () => {
    fc.assert(
      fc.property(anyText, (text) => outputsAreEqual(slugify(text), slugify(text))),
      { numRuns: propertyRuns },
    )
  })

  it('no-ambient-input-from-history :: an answer does not depend on the calls made before it', () => {
    fc.assert(
      fc.property(anyText, fc.array(anyText, { maxLength: 12 }), (text, history) => {
        const first = slugify(text)
        for (const earlier of history) slugify(earlier)

        return outputsAreEqual(slugify(text), first)
      }),
      { numRuns: propertyRuns },
    )
  })
})

// ---------------------------------------------------------------------------
// The declarations the properties above rest on
// ---------------------------------------------------------------------------

describe('string/slugify@1 property preconditions', () => {
  it('declares-a-property-for-every-step :: and declares every step it answers', () => {
    // A step published in block 4.2 with no property behind it would be a claim this contract makes
    // and does not check, which is the one thing it sells against. Both directions, one guard.
    expect(Object.keys(POLICED).sort()).toEqual([...theRule].map((step) => step.name).sort())
  })

  it('declares-a-statement-for-every-step', () => {
    const unexplained = theRule.filter((step) => step.statement.trim() === '')

    expect(unexplained.map((step) => step.name)).toEqual([])
  })

  it('support-the-slugs-are-well-formed :: measured without asking the function under test', () => {
    // P7 asserts an exact answer, so it is only sound if the arbitrary really produces slugs. The
    // risk is not hypothetical: a run alphabet gaining a mark that its neighbour absorbs would make
    // P7 fail on a correct implementation. This measures the three things that make a string a
    // fixed point - the alphabet, the shape, and the absence of an absorbable adjacency - and it
    // calls nothing from `reference.ts`.
    fc.assert(
      fc.property(anySlug, (slug) => {
        const points = [...slug]

        return (
          outputAlphabet.pattern.test(slug) &&
          slug === points.map((point) => point.toLowerCase()).join('') &&
          !carriesAnAbsorbableMark(slug)
        )
      }),
      { numRuns: propertyRuns },
    )
  })

  it('support-the-stacks-reach-the-hidden-base :: a mark the base absorbs sits behind one it does not', () => {
    // The support P2 and P3 rest on, measured rather than hoped for. A defect that mistakes the
    // base of a run for the code point to its left is invisible unless a mark that composes onto
    // the base sits behind a mark that does not, and this counts how often the generator produces
    // that shape under the declared number of draws. It asks nothing of `reference.ts`.
    const drawn = fc.sample(anyStackedText, propertyRuns)

    const reaching = drawn.filter((text) => {
      const points = [...text]

      return points.some(
        (point, at) =>
          at >= 2 &&
          absorbs(points[at - 2] ?? '', point) &&
          !absorbs(points[at - 1] ?? '', point),
      )
    })

    expect(reaching.length).toBeGreaterThan(propertyRuns / 20)
  })

  it('support-the-gaps-carry-a-sigma :: a sigma before the gap and a cased letter after it', () => {
    // The support P5 rests on. A swap of one discarded character for another can only change an
    // answer where a sigma's lower case is context sensitive, and this counts how often the
    // generator produces that shape under the declared number of draws. It asks nothing of
    // `reference.ts`.
    const drawn = fc.sample(aroundACasedGap, propertyRuns)

    const reaching = drawn.filter(
      ([before, after]) => before.endsWith(CAPITAL_SIGMA) && /^[\p{Lu}\p{Ll}]/u.test(after),
    )

    expect(reaching.length).toBeGreaterThan(propertyRuns / 5)
  })

  it('support-the-texts-reach-every-region', () => {
    // Without this the properties above are guards whose support is a matter of hope. Each entry is
    // a region some property can only fail in, and the assertion is that the alphabet reaches it at
    // all; the battery's probes then ask whether the arbitraries reach it under the declared number
    // of runs.
    const marksThatCompose = ALPHABET.filter(
      (symbol) => /\p{M}/u.test(symbol) && absorbs('e', symbol),
    )
    const marksThatDoNot = ALPHABET.filter(
      (symbol) => /\p{M}/u.test(symbol) && !absorbs('e', symbol),
    )
    const lettersThatFold = ALPHABET.filter(
      (symbol) => /\p{L}/u.test(symbol) && [...symbol.normalize('NFD')].length > 1,
    )
    const lettersThatDoNot = ALPHABET.filter(
      (symbol) =>
        /\p{L}/u.test(symbol) &&
        [...symbol.normalize('NFD')].length === 1 &&
        symbol.normalize('NFKC') === symbol,
    )
    const astralLetters = ALPHABET.filter(
      (symbol) => /\p{L}/u.test(symbol) && symbol.length === 2 && [...symbol].length === 1,
    )

    // The spelling table is partitioned rather than sized. `equivalentSpellings` was the one entry
    // here that was a total where every other is a region, and four regions counted can be the four
    // wrong ones where a partition cannot: a size stays 9 while every kind in the table changes. No
    // battery mutant produces that change - a battery injects into `reference.ts` and cannot reach a
    // generator's coverage - and a person editing this table produces it in one line. An unforeseen
    // kind lands under `unclassified`, which no expectation names, so the assertion fails naming it.
    const spellingKind = (rich: string, plain: string): string => {
      if (/\p{M}/u.test(rich)) return 'decomposed'
      if (rich.normalize('NFKC') !== rich.normalize('NFC')) return 'compatibility'
      if ([...rich.normalize('NFD')].length > 1) return 'precomposed'
      if (rich.toLowerCase() === plain) return 'caseOnly'

      return 'unclassified'
    }

    const spellings: Record<string, number> = {}
    for (const [rich, plain] of EQUIVALENT_SPELLINGS) {
      const kind = spellingKind(rich, plain)
      spellings[kind] = (spellings[kind] ?? 0) + 1
    }

    expect({
      marksThatCompose: marksThatCompose.length,
      marksThatDoNot: marksThatDoNot.length,
      lettersThatFold: lettersThatFold.length,
      lettersThatDoNot: lettersThatDoNot.length,
      astralLetters: astralLetters.length,
      discarded: DISCARDED.length,
      spellings,
    }).toEqual({
      marksThatCompose: 1,
      marksThatDoNot: 3,
      lettersThatFold: 1,
      lettersThatDoNot: 12,
      astralLetters: 2,
      discarded: 11,
      spellings: { precomposed: 4, compatibility: 4, caseOnly: 1 },
    })
  })
})
