import { describe, it, expect } from 'vitest'

import type { ContractAddress } from './address.js'
import { DIGEST } from './canonical.js'
import type { ContractRecord } from './contract-record.js'
import {
  AlreadyPublished,
  CONTRACT_STANDING_FIELDS,
  EMPTY_LEDGER,
  IMPLEMENTATION_STANDING_FIELDS,
  NotPublished,
  contractSnapshot,
  digestOfSnapshot,
  implementationSnapshot,
  publishContract,
  publishImplementation,
  snapshotFaults,
  withContractStanding,
} from './snapshot.js'
import { REPOSITORY_ROOT, referenceImplementationOf, serialiseContract } from './serialise.js'
import { eachContract, theCatalogue } from './the-catalogue.js'

/**
 * A snapshot is what an installation receives for ever, and its digest is the only thing anyone has
 * to compare against.
 *
 * Two questions run through every guard below, and they are not the same question. Does the digest
 * cover everything the snapshot carries - so that no field can change under a fixed digest. And does
 * the snapshot carry everything the record has - so that no field can be dropped on the way in. A
 * storage that answered only the first would hash a projection with a hole in it, faithfully.
 */

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * The fields of `whole` that `kept` does not have, named by the path where they part company.
 *
 * Used in both directions from one definition, because the two failures are exactly symmetrical: a
 * field of the record the snapshot drops, and a field of the snapshot the record never had.
 */
const missingFrom = (whole: unknown, kept: unknown, at: string): readonly string[] => {
  if (!isRecord(whole) || !isRecord(kept)) return []

  return Object.keys(whole).flatMap((key) => {
    const path = at === '' ? key : `${at}.${key}`

    return key in kept ? missingFrom(whole[key], kept[key], path) : [path]
  })
}

/**
 * Every field of a record the digest is supposed to cover, as dotted paths, driven by the standing
 * declaration rather than by a list written here.
 *
 * It descends only where a standing field is declared below, so today every top-level field stays
 * whole: no standing field sits under another object any more. It descended into `benchmarks` while
 * the contract-side measurements existed, and the machinery is kept rather than simplified away
 * because the next standing field to arrive may well sit inside something - which is exactly the case
 * a projection walking only the top level would freeze by accident.
 */
const frozenPathsOf = (
  record: Readonly<Record<string, unknown>>,
  standing: readonly { readonly field: string }[],
): readonly string[] => {
  const declared = standing.map((entry) => entry.field)

  const pathsUnder = (value: unknown, at: string): readonly string[] => {
    if (declared.includes(at)) return []
    if (!declared.some((field) => field.startsWith(`${at}.`)) || !isRecord(value)) return [at]

    return Object.keys(value).flatMap((key) => pathsUnder(value[key], `${at}.${key}`))
  }

  return Object.keys(record).flatMap((key) => pathsUnder(record[key], key))
}

/** The same record with one path replaced, so that the change is at the path and nowhere else. */
const perturbedAt = (value: unknown, path: readonly string[]): unknown => {
  const [head, ...rest] = path
  if (head === undefined) return 'perturbed'

  const record = value as Readonly<Record<string, unknown>>

  return { ...record, [head]: perturbedAt(record[head], rest) }
}

const NUMBER_PARSE = theCatalogue[0]
if (NUMBER_PARSE === undefined) throw new Error('the five are not five')

const anAddress = (name: string, major: number): ContractAddress => ({
  language: 'typescript',
  name,
  major,
})

const PUBLISHED_AT = '2026-08-03T00:00:00.000Z'

/** The commit these bindings are pretended to have been published from. Not this repository's. */
const PUBLISHED_FROM = 'a'.repeat(40)

describe('what a snapshot freezes, and what it may not', () => {
  /**
   * The whole finding of this unit, as a guard. Every field a record carries is either inside the
   * digest or declared as standing with the sentence that keeps it out - and nothing is neither.
   *
   * **It compares against the standing fields this record carries, and that is not a weakening.** The
   * standing gained an optional member with `useCases`, so a list of every declared standing field is
   * no longer what any one contract holds - four of the five declare no use case. What the guard is
   * for survives untouched: a field added to the record and to neither half appears on the left and
   * not on the right, and the equality reddens. What it stops asking is whether every declared
   * standing field is filled, which is a question about the catalogue rather than about a contract
   * and is asked once, below.
   */
  it.each(eachContract)(
    'the-frozen-half-and-the-standing-half-partition-a-contract-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const snapshot = contractSnapshot(record)
      const carried = CONTRACT_STANDING_FIELDS.map((entry) => entry.field).filter(
        (field) => field in record,
      )

      expect([...missingFrom(record, snapshot.frozen, '')].sort()).toEqual([...carried].sort())
    },
  )

  /**
   * And no standing field is declared that nothing fills.
   *
   * The half the guard above gave up when the standing gained an optional member, asked where it
   * belongs: a declaration nothing in the catalogue carries is the decorative rule this repository
   * refuses everywhere else, and it would be invisible to a per-contract check by construction -
   * every contract would simply not carry it.
   */
  it('every-standing-field-a-contract-declares-is-carried-by-one :: nothing is declared unfilled', () => {
    const records = theCatalogue.map((source) => serialiseContract(REPOSITORY_ROOT, source))
    const unfilled = CONTRACT_STANDING_FIELDS.map((entry) => entry.field).filter(
      (field) => !records.some((record) => field in record),
    )

    expect(unfilled).toEqual([])
  })

  it.each(eachContract)(
    'a-snapshot-invents-no-field-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)

      expect(missingFrom(contractSnapshot(record).frozen, record, '')).toEqual([])
    },
  )

  it.each(eachContract)(
    'the-frozen-half-and-the-standing-half-partition-an-implementation-%s',
    (_name, source) => {
      const record = referenceImplementationOf(REPOSITORY_ROOT, source)
      const snapshot = implementationSnapshot(record)

      expect([...missingFrom(record, snapshot.frozen, '')].sort()).toEqual(
        [...IMPLEMENTATION_STANDING_FIELDS.map((entry) => entry.field)].sort(),
      )
      expect(missingFrom(snapshot.frozen, record, '')).toEqual([])
    },
  )

  it('every-standing-field-says-why-it-cannot-be-frozen', () => {
    const unexplained = [...CONTRACT_STANDING_FIELDS, ...IMPLEMENTATION_STANDING_FIELDS].filter(
      (entry) => entry.reason.trim() === '',
    )

    expect(unexplained.map((entry) => entry.field)).toEqual([])
  })
})

describe('what the digest covers', () => {
  /**
   * Field by field, mechanically: change a field **of the record** and the snapshot digest must move.
   *
   * The perturbation is on the record and not on the projection, and that is the whole strength of
   * this guard. Perturbing the projection would only establish that the digest covers what the
   * projection already holds - which is true of any projection, including one with a hole in it.
   * Perturbing the record asks the question that matters: is there a way to change this contract
   * without changing its digest? Written first the weak way, and measured: the mutant that drops the
   * harness digests from the projection passed it.
   *
   * A loop rather than a list, so that a field added to a record is covered the day it arrives.
   */
  it.each(eachContract)(
    'every-frozen-field-of-a-record-moves-the-digest-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const digest = digestOfSnapshot(contractSnapshot(record))

      const unnoticed = frozenPathsOf(record, CONTRACT_STANDING_FIELDS).filter(
        (path) =>
          digestOfSnapshot(contractSnapshot(perturbedAt(record, path.split('.')) as ContractRecord)) ===
          digest,
      )

      expect(unnoticed).toEqual([])
    },
  )

  /**
   * The other direction, and the finding of this unit made executable: a field the registry may still
   * change must be outside the digest, or `absorbed-by-the-language` could never be reached without
   * breaking every lockfile that holds the contract.
   */
  it.each(eachContract)(
    'a-standing-field-does-not-move-the-digest-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const digest = digestOfSnapshot(contractSnapshot(record))

      // One standing field now, where there were two: the contract-side measurements duplicated the
      // implementation's and were deleted. The claim is unchanged and narrower - the single field the
      // registry may still change its mind about must not be inside the digest.
      const absorbed: ContractRecord = {
        ...record,
        lifecycle: {
          state: 'absorbed-by-the-language',
          answeredBy: 'a future proposal, named here by nothing',
          measurement: 'none: this is the shape of the operation, not a claim about the language',
        },
      }

      expect(digestOfSnapshot(contractSnapshot(absorbed))).toBe(digest)
    },
  )

  /**
   * One level down, because a harness digest is what makes the snapshot a Merkle tree at all: a file
   * that changed under a fixed snapshot digest is the whole attack this storage exists to refuse.
   *
   * The digest is appended to rather than substituted in, because a substitution can be a no-op -
   * written first as `replace(/^./, 'f')`, which changes nothing when the digest already begins with
   * `f`, and measured reddening under a mutant for that reason instead of for the one it exists to
   * catch. A guard red for the wrong reason is a wrong attribution.
   */
  it.each(eachContract)(
    'a-changed-harness-file-moves-the-digest-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const [first, ...rest] = record.harness
      if (first === undefined) throw new Error('a contract with no harness is not a contract')

      const changed: ContractRecord = {
        ...record,
        harness: [{ ...first, sha256: `${first.sha256}0` }, ...rest],
      }

      expect(digestOfSnapshot(contractSnapshot(changed))).not.toBe(
        digestOfSnapshot(contractSnapshot(record)),
      )
    },
  )

  it('the-format-version-is-inside-the-digest :: a digest needs the rule that made it', () => {
    const snapshot = contractSnapshot(serialiseContract(REPOSITORY_ROOT, NUMBER_PARSE))
    const later = { ...snapshot, formatVersion: snapshot.formatVersion + 1 }

    expect(digestOfSnapshot(later)).not.toBe(digestOfSnapshot(snapshot))
    expect(snapshotFaults(later, digestOfSnapshot(later))).toHaveLength(1)
  })

  /**
   * The harness is in one order, and it is the sorted one. Two serialisations that listed the same
   * files differently would be two digests for one contract, and nothing else in this suite compares
   * two orders within a single process.
   */
  it.each(eachContract)(
    'the-harness-is-in-one-order-%s',
    (_name, source) => {
      const paths = serialiseContract(REPOSITORY_ROOT, source).harness.map((file) => file.path)

      expect(paths).toEqual([...paths].sort())
    },
  )

  it('no-two-contracts-share-a-digest :: a digest is an identity', () => {
    const digests = theCatalogue.map((source) =>
      digestOfSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, source))),
    )

    expect(new Set(digests).size).toBe(digests.length)
    expect(digests.filter((digest) => !DIGEST.test(digest))).toEqual([])
  })

  it('a-snapshot-that-does-not-hash-to-its-claim-is-refused', () => {
    const snapshot = contractSnapshot(serialiseContract(REPOSITORY_ROOT, NUMBER_PARSE))

    expect(snapshotFaults(snapshot, digestOfSnapshot(snapshot))).toEqual([])
    expect(snapshotFaults(snapshot, 'f'.repeat(64))).toHaveLength(1)
    expect(snapshotFaults(snapshot, 'not-a-digest')).toHaveLength(2)
  })
})

describe('the ledger, where a name is bound to a digest', () => {
  const entryFor = (source: (typeof theCatalogue)[number], digest: string) => ({
    address: source.address,
    digest,
    publishedAt: PUBLISHED_AT,
    publishedFrom: PUBLISHED_FROM,
    standing: { lifecycle: { state: 'published' as const } },
  })

  it('an-address-is-bound-once-and-for-ever', () => {
    const digest = digestOfSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, NUMBER_PARSE)))
    const ledger = publishContract(EMPTY_LEDGER, entryFor(NUMBER_PARSE, digest))

    expect(ledger.contracts).toHaveLength(1)
    expect(() =>
      publishContract(ledger, { ...entryFor(NUMBER_PARSE, 'a'.repeat(64)) }),
    ).toThrow(AlreadyPublished)
  })

  /**
   * Republishing the *same* digest is refused too, and that is deliberate. It would leave one
   * address with two publication records and nothing to say which one a lockfile from last year
   * meant; the operation a registry needs is changing the standing, and that is the next guard.
   */
  it('rebinding-is-refused-even-to-the-same-digest', () => {
    const digest = digestOfSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, NUMBER_PARSE)))
    const ledger = publishContract(EMPTY_LEDGER, entryFor(NUMBER_PARSE, digest))

    expect(() => publishContract(ledger, entryFor(NUMBER_PARSE, digest))).toThrow(AlreadyPublished)
  })

  /**
   * The operation the whole separation exists for: a contract the language absorbs keeps its digest
   * and changes what the registry says about it. If this moved the digest, permanent rule 6 and the
   * rule `array/group-by@1` established could not both hold.
   */
  it('a-standing-changes-and-the-digest-does-not', () => {
    const digest = digestOfSnapshot(contractSnapshot(serialiseContract(REPOSITORY_ROOT, NUMBER_PARSE)))
    const published = publishContract(EMPTY_LEDGER, entryFor(NUMBER_PARSE, digest))
    const absorbed = withContractStanding(published, NUMBER_PARSE.address, {
      lifecycle: {
        state: 'absorbed-by-the-language',
        answeredBy: 'a future proposal, named here by nothing',
        measurement: 'none: this is the shape of the operation, not a claim about the language',
      },
    })

    expect(absorbed.contracts[0]?.digest).toBe(digest)
    expect(absorbed.contracts[0]?.standing.lifecycle.state).toBe('absorbed-by-the-language')
  })

  it('a-standing-cannot-be-set-on-something-unpublished', () => {
    expect(() =>
      withContractStanding(EMPTY_LEDGER, NUMBER_PARSE.address, {
        lifecycle: { state: 'published' },
      }),
    ).toThrow(NotPublished)
  })

  /**
   * `name@1` and `name@2` coexist for life, and the storage must not make that acrobatic. It does not:
   * they are two addresses, so there is nothing to arrange.
   */
  it('two-majors-of-one-name-coexist', () => {
    const first = publishContract(EMPTY_LEDGER, {
      address: anAddress('number/parse', 1),
      digest: 'a'.repeat(64),
      publishedAt: PUBLISHED_AT,
      publishedFrom: PUBLISHED_FROM,
      standing: { lifecycle: { state: 'published' } },
    })
    const both = publishContract(first, {
      address: anAddress('number/parse', 2),
      digest: 'b'.repeat(64),
      publishedAt: PUBLISHED_AT,
      publishedFrom: PUBLISHED_FROM,
      standing: { lifecycle: { state: 'published' } },
    })

    expect(both.contracts.map((entry) => entry.address.major)).toEqual([1, 2])
  })

  /**
   * An implementation versions under a contract that does not move, which is the reason the two units
   * are separate. Two versions of one implementation are two entries and neither replaces the other.
   */
  it('an-implementation-versions-under-a-contract-that-does-not-move', () => {
    const record = referenceImplementationOf(REPOSITORY_ROOT, NUMBER_PARSE)
    const digest = digestOfSnapshot(implementationSnapshot(record))
    const address = { contract: NUMBER_PARSE.address, id: record.id, version: '1.0.0' }

    const first = publishImplementation(EMPTY_LEDGER, {
      address,
      digest,
      publishedAt: PUBLISHED_AT,
      publishedFrom: PUBLISHED_FROM,
      standing: { status: 'default' },
    })
    const both = publishImplementation(first, {
      address: { ...address, version: '1.0.1' },
      digest: 'c'.repeat(64),
      publishedAt: PUBLISHED_AT,
      publishedFrom: PUBLISHED_FROM,
      standing: { status: 'default' },
    })

    expect(both.implementations.map((entry) => entry.address.version)).toEqual(['1.0.0', '1.0.1'])
    expect(() =>
      publishImplementation(both, {
        address,
        digest: 'd'.repeat(64),
        publishedAt: PUBLISHED_AT,
      publishedFrom: PUBLISHED_FROM,
        standing: { status: 'demoted' },
      }),
    ).toThrow(AlreadyPublished)
  })
})
