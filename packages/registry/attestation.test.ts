import { describe, it, expect } from 'vitest'

import type { Attestation } from './attestation.js'
import { WHAT_A_SIGNATURE_DOES_NOT_PROVE, attestationFaults } from './attestation.js'
import { REPOSITORY_ROOT, serialiseContract } from './serialise.js'
import { contractSnapshot, digestOfSnapshot } from './snapshot.js'
import { theFive } from './the-five.js'

/**
 * An attestation is about one snapshot, and about nothing else.
 *
 * Nothing here verifies a bundle: that needs Sigstore's own verification and a policy no publishing
 * pipeline has filled yet, and a guard that reported an unverified bundle as sound would be worse
 * than no guard. What is checkable today is that an attestation cannot be stapled to a snapshot it is
 * not about, which is the cheapest possible way to make an unsigned artefact look signed.
 */

const NUMBER_PARSE = theFive[0]
if (NUMBER_PARSE === undefined) throw new Error('the five are not five')

const bundleOf = (subject: string): Attestation => ({
  subject,
  format: 'sigstore-bundle',
  bundle: { path: 'attestation.sigstore.json', sha256: 'e'.repeat(64), bytes: 1 },
})

const aSnapshot = () => contractSnapshot(serialiseContract(REPOSITORY_ROOT, NUMBER_PARSE))

describe('an attestation, which is beside a snapshot and never inside it', () => {
  it('an-attestation-about-another-snapshot-is-refused', () => {
    const snapshot = aSnapshot()

    expect(attestationFaults(bundleOf(digestOfSnapshot(snapshot)), snapshot)).toEqual([])
    expect(attestationFaults(bundleOf('a'.repeat(64)), snapshot)).toHaveLength(1)
  })

  it('a-bundle-that-is-not-addressed-like-a-blob-is-refused', () => {
    const snapshot = aSnapshot()
    const sound = bundleOf(digestOfSnapshot(snapshot))
    const withBundle = (bundle: Partial<Attestation['bundle']>): Attestation => ({
      ...sound,
      bundle: { ...sound.bundle, ...bundle },
    })

    expect(attestationFaults(withBundle({ sha256: 'no' }), snapshot)).toHaveLength(1)
    expect(attestationFaults(withBundle({ bytes: 0 }), snapshot)).toHaveLength(1)
  })

  /**
   * The limit is published as a value rather than left in a comment, so that an API response and a
   * contract page can carry it instead of paraphrasing it. This guard exists because a sentence
   * nothing reads is a sentence that drifts: it names the three claims the word "verified" invites
   * collapsing into one.
   */
  it('the-limit-of-a-signature-is-published :: three claims, and they are not one', () => {
    expect(WHAT_A_SIGNATURE_DOES_NOT_PROVE).toContain('who published')
    expect(WHAT_A_SIGNATURE_DOES_NOT_PROVE).toContain('answers the contract')
    expect(WHAT_A_SIGNATURE_DOES_NOT_PROVE).toContain('the right specification')
  })

  /**
   * That a snapshot cannot carry its own attestation is not asserted here, and it is not an omission:
   * `a-snapshot-invents-no-field` already refuses any field of a snapshot the record does not have,
   * and a runtime guard restating a shape the type forbids would be one that cannot fail.
   */
})
