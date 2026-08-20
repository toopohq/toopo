import { describe, it, expect } from 'vitest'

import { FIELD_MAP, pathsIn, publicContract } from './field-map.js'
import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { eachContract, theCatalogue } from './the-catalogue.js'

/**
 * A public projection may not carry a field the map marks private, and may not carry one the map
 * does not classify at all.
 *
 * The second half is the one that catches a real mistake today. Not one field of a contract record is
 * private - the private things are a corpus and a run, neither of which any of the five fills, so
 * neither is modelled - and a map nobody enforces would be the decorative guard this repository
 * exists to refuse. What is reachable by anyone who touches this schema is adding a field and not
 * saying whether it may be served, which is exactly how a private field escapes the day one exists.
 *
 * The two statements are independent on purpose. `publicContract` says what is served;
 * `FIELD_MAP` says what may be served. A projection derived from the map by omission could not
 * disagree with it, and the guard would be comparing the map against itself - the mistake
 * `expectUniversalPropertiesAnswered` documents when it insists the inapplicable list is passed in
 * rather than computed.
 */

const servedPaths = (): ReadonlySet<string> => {
  const paths = new Set<string>()
  for (const source of theCatalogue) {
    pathsIn(publicContract(serialiseContract(REPOSITORY_ROOT, source)), '', paths)
  }

  return paths
}

describe('the public/private frontier', () => {
  it.each(eachContract)(
    'every-served-field-is-classified-%s',
    (name, source) => {
      const paths = new Set<string>()
      pathsIn(publicContract(serialiseContract(REPOSITORY_ROOT, source)), '', paths)

      const unclassified = [...paths].filter((path) => FIELD_MAP[path] === undefined).sort()

      expect(
        unclassified,
        `${name} is served with fields nothing classifies. A field with no visibility is how a ` +
          `private one escapes: decide it in packages/registry/field-map.ts.`,
      ).toEqual([])
    },
  )

  it('no-private-field-is-served :: the frontier is an endpoint, not a hidden file', () => {
    const leaked = [...servedPaths()]
      .filter((path) => FIELD_MAP[path]?.visibility === 'private')
      .sort()

    expect(
      leaked,
      'the public projection carries a field the map marks private. §8 keeps the adversarial ' +
        'corpus, the seeds and volumes of official runs and the validation infrastructure off every ' +
        'public endpoint.',
    ).toEqual([])
  })

  /**
   * The other direction. A classification for a path nothing emits is a rule about a field that does
   * not exist, and it reads as coverage the schema does not have.
   *
   * Over the five together rather than one at a time, because two fields are legitimately absent from
   * some of them: `relationToTheLanguage` is carried by three of five, and `failureReasons` and
   * `couplingRule` by the two fallible ones.
   */
  it('every-unfilled-field-is-justified :: three are, and the code names the sentence', () => {
    const served = servedPaths()
    const unserved = Object.keys(FIELD_MAP).filter((path) => !served.has(path))

    const unjustified = unserved
      .filter((path) => (FIELD_MAP[path]?.unfilledBecause ?? '').trim() === '')
      .sort()

    expect(
      unjustified,
      'a field none of the five fills and nothing justifies is speculative, and the rule this ' +
        'schema was built under deletes it.',
    ).toEqual([])

    // The other direction, which is what stops the list of exceptions from rotting: a justification
    // on a field that has since been filled is a sentence nobody rechecked.
    const stale = Object.keys(FIELD_MAP)
      .filter((path) => FIELD_MAP[path]?.unfilledBecause !== undefined && served.has(path))
      .sort()

    expect(stale, 'these fields are filled now, so their justification is stale').toEqual([])
  })

  /**
   * **This guard was called `the-unfilled-fields-are-the-three-that-were-argued-for` and had to be
   * renamed**, because there are two now that the contract-side measurements are gone - and an
   * identifier that counts its own rows can be wrong about them. That is the failure the catalogue
   * already forbids for a case identifier, in as many words: a name, and not a rendering of the data
   * it addresses. It was written here anyway, and it took a subtraction to expose it.
   *
   * Renaming was the repair rather than updating the number, because a name that has to be edited
   * whenever the data moves is not an address.
   */
  it('the-unfilled-fields-are-the-ones-that-were-argued-for :: and no others', () => {
    const kept = Object.entries(FIELD_MAP)
      .filter(([, entry]) => entry.unfilledBecause !== undefined)
      .map(([path]) => path)
      .sort()

    expect(kept).toEqual(['caseTables[].cases[].provenance.report', 'lifecycle.answeredBy'])
  })

  /**
   * The verification stratum is not decoration either: every field says what refuses a wrong value
   * for it, and `one-directional` says a guard exists and keeps one half only. It is here because
   * GS-11 survives on exactly that, and a schema that called such a field verified would be making
   * the claim the mutant disproves.
   */
  it('the-strata-are-populated :: each one is held by a field of the five', () => {
    const held = new Set(Object.values(FIELD_MAP).map((entry) => entry.verification))
    for (const source of theCatalogue) {
      for (const declaration of source.ownDeclarations) held.add(declaration.verification)
    }

    expect([...held].sort()).toEqual([
      'documentary',
      'executable',
      'one-directional',
      'stated-per-declaration',
      'structural',
    ])
  })

  /**
   * The deferral is not a fifth stratum in disguise. Whichever fields defer, they defer to a value
   * the record actually carries - so a reader following one arrives somewhere rather than at another
   * pointer.
   */
  it('the-fields-that-defer-their-stratum :: and the record answers for each of them', () => {
    const deferring = Object.entries(FIELD_MAP)
      .filter(([, entry]) => entry.verification === 'stated-per-declaration')
      .map(([path]) => path)

    expect(deferring).toEqual(['ownDeclarations[].value'])

    const unanswered = theCatalogue.flatMap((source) =>
      source.ownDeclarations
        .filter((declaration) => declaration.verification === 'stated-per-declaration')
        .map((declaration) => `${source.address.name}:${declaration.name}`),
    )

    expect(unanswered).toEqual([])
  })
})
