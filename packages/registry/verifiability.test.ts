import { describe, it, expect } from 'vitest'

import { isFrozenIdentifier } from '../catalogue/identifier.js'
import { WHAT_A_SIGNATURE_DOES_NOT_PROVE } from './attestation.js'
import { ENDPOINTS } from './endpoints.js'
import { FIELD_MAP } from './field-map.js'
import { THE_UNPUBLISHED_REVISION } from './revision.js'
import { theCatalogue } from './the-catalogue.js'
import {
  MUST_BE_BELIEVED,
  VERIFIABLE,
  WHAT_A_STRATUM_MEANS_TO_A_READER,
  servedMethodology,
} from './verifiability.js'

/**
 * The two columns, and the one thing that would make them dishonest.
 *
 * A verifiability table is the easiest document in this project to write and the easiest to be wrong
 * about, because nothing in it fails at run time: a claim listed as checkable that nobody can check
 * reads exactly like one that works. So every entry names the endpoint it is about, every endpoint is
 * real, and the two lists have to account between them for every stratum the schema declares.
 */

const ENDPOINT_IDS = new Set(ENDPOINTS.map((endpoint) => endpoint.id))
const ALL_CLAIMS = [...VERIFIABLE, ...MUST_BE_BELIEVED]

describe('the two columns', () => {
  it('every-claim-is-an-address :: frozen, kebab-case, unique across both columns', () => {
    const ids = ALL_CLAIMS.map((claim) => claim.id)

    expect(ids.filter((id) => !isFrozenIdentifier(id))).toEqual([])
    expect(new Set(ids).size).toBe(ids.length)
  })

  /**
   * A claim about an endpoint that does not exist is a claim nobody can act on, and it is exactly what
   * a table of this kind rots into: an endpoint is renamed, and the row that promised something about
   * it goes on promising it.
   */
  it('every-claim-is-about-an-endpoint-that-exists', () => {
    const dangling = ALL_CLAIMS.flatMap((claim) =>
      claim.about.filter((id) => !ENDPOINT_IDS.has(id)).map((id) => `${claim.id} -> ${id}`),
    )

    expect(dangling).toEqual([])
  })

  /**
   * One verifiable claim is about no endpoint, and it is the most important one in the table: hashing
   * an installed file against the lockfile needs no answer from the registry at all. Pinned, because a
   * second such row appearing would mean something moved offline without anyone saying so - and a row
   * losing its emptiness would mean a check that needed nobody now needs us.
   */
  it('the-checks-that-need-nothing-from-the-registry', () => {
    const offline = VERIFIABLE.filter((claim) => claim.about.length === 0)

    expect(offline.map((claim) => claim.id)).toEqual(['an-installed-file-is-what-was-served'])
  })

  it('every-verifiable-claim-says-what-it-does-not-establish', () => {
    const overclaiming = VERIFIABLE.filter(
      (claim) => claim.butNot.trim() === '' || claim.by.trim() === '',
    )

    expect(overclaiming.map((claim) => claim.id)).toEqual([])
  })

  /**
   * A sentence written to stand alone is not a complement, and this is where that cost a false one.
   *
   * The page writes `This does not establish ${butNot}.`, so a `butNot` is the tail of a sentence
   * somebody else began. `WHAT_A_SIGNATURE_DOES_NOT_PROVE` sat in that slot and is a whole sentence
   * about three separate things, so the method page published *This does not establish a signature
   * attests who published this snapshot and from what build* - denying, two lines under it, the claim
   * the row exists to make. No shape check could have seen it: the composed sentence is well formed and
   * false, which is the half of this class that register cannot reach.
   *
   * It is the one string this can be asked of, because it is the one the methodology answer renders
   * whole and also offers to this table. A second such value would need naming beside it, and that is
   * the price this repository pays per sentence rather than per class.
   */
  it('a-sentence-rendered-whole-is-not-also-a-complement', () => {
    const reused = VERIFIABLE.filter((claim) => claim.butNot === WHAT_A_SIGNATURE_DOES_NOT_PROVE)

    expect(reused.map((claim) => claim.id)).toEqual([])
  })

  /**
   * §8 forbids withholding anything that defines a contract, so no believed claim may rest on
   * non-publication. It is not asserted here: `BelievedNature` has three members and none of them can
   * say it, so the reason is unrepresentable rather than refused. What this guard keeps is the
   * vocabulary itself - a fourth member added later would have to pass through this line.
   */
  it('the-believed-natures-are-the-declared-ones-and-none-is-withholding', () => {
    const natures = [...new Set(MUST_BE_BELIEVED.map((claim) => claim.nature))].sort()

    expect(natures).toEqual([
      'a measurement on a machine nobody else has',
      'an opinion of the registry',
      'outside what any arithmetic can reach',
    ])
  })

  /**
   * The shape of the answer, pinned as a number so that it cannot drift into a comfortable one. The
   * believed column is longer, and almost all of it is the registry's own opinion - the two entries
   * that are not opinions are the two nothing can reach, and both were written down before this unit.
   */
  it('the-believed-column-is-longer-and-is-mostly-opinion', () => {
    expect(MUST_BE_BELIEVED.length).toBeGreaterThan(VERIFIABLE.length)

    const unreachable = MUST_BE_BELIEVED.filter(
      (claim) => claim.nature === 'outside what any arithmetic can reach',
    )

    expect(unreachable.map((claim) => claim.id).sort()).toEqual([
      'the-registry-serves-everyone-the-same-bytes',
      'this-contract-is-the-right-specification',
    ])
  })

  /**
   * Some believed claims have nothing that narrows them, and saying *which* is the point. A
   * mitigation invented to fill the column would be the worst line in this file.
   */
  it('the-believed-claims-with-no-mitigation-are-named', () => {
    const bare = MUST_BE_BELIEVED.filter((claim) => claim.mitigation === null)

    expect(bare.map((claim) => claim.id).sort()).toEqual([
      'the-index-is-complete',
      'the-set-of-attestations-is-complete',
      'this-contract-is-the-right-specification',
    ])

    const empty = MUST_BE_BELIEVED.filter((claim) => claim.mitigation?.trim() === '')

    expect(
      empty.map((claim) => claim.id),
      'an empty string is not a mitigation, it is a null that got past the type',
    ).toEqual([])
  })
})

describe('the field-level axis the schema already carried', () => {
  /**
   * Every stratum the schema uses is translated for a reader, and no translation exists for a stratum
   * nothing uses. `visibility.test.ts` asks whether each stratum is held by a field; this asks whether
   * each one has been explained. A methodology page fails on the second, not the first.
   */
  it('every-stratum-is-translated-and-no-translation-is-orphaned', () => {
    const used = new Set(Object.values(FIELD_MAP).map((entry) => entry.verification))
    for (const source of theCatalogue) {
      for (const declaration of source.ownDeclarations) used.add(declaration.verification)
    }

    expect([...used].sort()).toEqual(Object.keys(WHAT_A_STRATUM_MEANS_TO_A_READER).sort())
  })

  it('a-translation-is-addressed-to-a-reader :: it says what they can do', () => {
    const silent = Object.entries(WHAT_A_STRATUM_MEANS_TO_A_READER).filter(
      ([, sentence]) => sentence.trim() === '',
    )

    expect(silent.map(([stratum]) => stratum)).toEqual([])
  })
})

describe('the methodology answer', () => {
  /**
   * The endpoint the needs made appear. It carries every field of a contract record with the stratum
   * it is verified at - which is what "you can check this yourself" has to be able to mean, field by
   * field, and what nothing served before this unit.
   */
  it('the-methodology-answer-carries-every-field-of-a-record', () => {
    const methodology = servedMethodology(THE_UNPUBLISHED_REVISION)

    expect(Object.keys(methodology.fields).sort()).toEqual(Object.keys(FIELD_MAP).sort())
    expect(methodology.fields['caseTables[].cases[].data']).toBe('executable')
    expect(methodology.fields['benchmarks.profiles[].samples.producedBy']).toBe('one-directional')
  })

  it('the-methodology-answer-carries-both-columns-and-the-seeding-policy', () => {
    const methodology = servedMethodology(THE_UNPUBLISHED_REVISION)

    expect(methodology.verifiable).toHaveLength(VERIFIABLE.length)
    expect(methodology.mustBeBelieved).toHaveLength(MUST_BE_BELIEVED.length)
    expect(methodology.seeding.seedsAreFrozen).toBe(false)
    expect(methodology.seeding.attributionRuns).toBe(3)
    expect(methodology.whatASignatureDoesNotProve).toMatch(/neither says the contract is the right/)
  })

  it('the-methodology-answer-is-named-and-therefore-revalidated', () => {
    expect(servedMethodology(THE_UNPUBLISHED_REVISION).addressing).toBe('named')
    expect(servedMethodology(THE_UNPUBLISHED_REVISION).servedFrom).toBe(THE_UNPUBLISHED_REVISION)
  })
})
