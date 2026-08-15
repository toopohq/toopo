/**
 * Who published a snapshot, and the three things that are not the same claim.
 *
 * ---------------------------------------------------------------------------
 * The sentence this file exists to put in front of an implementer
 * ---------------------------------------------------------------------------
 *
 * A signature attests **who published** a snapshot and **from what build**. The contract's
 * verification says an implementation **answers the contract**. Neither says the contract is the
 * **right specification**.
 *
 * Three claims, three different things, and the word "verified" invites collapsing them into one.
 * npm publishes the same warning about its own provenance in its own words - it "does not guarantee
 * the package has no malicious code" - and it is worth more here, because this registry's product is
 * the verification and a reader who reads a signature as a statement about correctness has been
 * misled by the thing we sell.
 *
 * ---------------------------------------------------------------------------
 * Keyless, and why that is a design decision rather than a convenience
 * ---------------------------------------------------------------------------
 *
 * The recommendation, from what the ecosystem actually ships as of August 2026 rather than from
 * first principles:
 *
 * Sigstore's keyless model has Fulcio issue a short-lived certificate binding an ephemeral key to an
 * OIDC identity, and records the signature in the Rekor transparency log. npm's Trusted Publishing
 * went GA in July 2025 and publishing over OIDC attaches a Sigstore provenance attestation without
 * anybody holding a key. JSR generates a Rekor entry linking a package to the commit and the CI run
 * that produced it - **though only for publication from GitHub Actions over OIDC; a token-based
 * publication gets none, and JSR signing the uploaded manifest is announced and not yet shipped.**
 * The subject of such an attestation is an artefact identified by its digest, and a consumer verifies
 * a bundle offline with `cosign`.
 *
 * Three reasons to take it, in order. The ecosystem already knows how to verify it, with a tool that
 * exists, which matters more than any property of a scheme nobody runs. It puts no secret inside a
 * repository whose product is auditability - and a key that must be held is a key that must be
 * rotated, escrowed and recovered, none of which this project has anywhere to do. And signing the
 * digest of a manifest is precisely the step JSR has not shipped, so it costs nothing to be ahead on.
 *
 * **Nothing is generated here and nothing is signed here.** Signing needs a key, or an identity
 * provider, and both belong to a publishing pipeline that does not exist. What this file settles is
 * where a signature attaches and what it covers, so that the pipeline has nothing left to invent.
 *
 * ---------------------------------------------------------------------------
 * Where it attaches, and what it covers
 * ---------------------------------------------------------------------------
 *
 * The subject is the **snapshot digest** and nothing smaller. The digest already covers every served
 * blob transitively, so signing per file would be many signatures making one claim, and each of them
 * would leave the question of whether the *set* of files was the published one. One subject, and the
 * Merkle tree does the rest.
 *
 * An attestation sits **beside** a snapshot and never inside it. Two reasons and both are real. A
 * document that contained its own signature could not be the document that was signed. And a snapshot
 * may legitimately gain a second attestation later - a mirror counter-signing what it serves is the
 * ordinary case in a distribution model built on mirrors - which must not change the digest every
 * lockfile in the world already holds.
 *
 * So attestations are held by digest, in an index of their own: not in the snapshot, whose identity
 * they would change, and not in the ledger, whose entry is the frozen binding of a name to a digest.
 */

import { DIGEST } from './canonical.js'
import type { HarnessFile } from './implementation-record.js'
import type { Snapshot } from './snapshot.js'
import { digestOfSnapshot } from './snapshot.js'

/**
 * The sentence above, as a value, so that an API response and a contract page can carry it rather
 * than paraphrase it. A limit that lives only in a comment is a limit the reader never sees.
 */
export const WHAT_A_SIGNATURE_DOES_NOT_PROVE =
  'a signature attests who published this snapshot and from what build; the contract\'s ' +
  'verification says an implementation answers the contract; neither says the contract is the right ' +
  'specification'

/**
 * How to read the bundle. One member, and it is a member rather than a bare field because the format
 * is somebody else's and will move: a reader that assumed the shape would have no way to refuse a
 * bundle it does not understand.
 */
export type AttestationFormat = 'sigstore-bundle'

export type Attestation = {
  /** The snapshot this is about, by digest. The only thing a signature is ever taken over here. */
  readonly subject: string
  readonly format: AttestationFormat
  /**
   * The bundle, served and addressed exactly like every other blob. It is carried opaquely on
   * purpose: what it contains is Sigstore's business, verifying it is `cosign`'s, and a registry that
   * transcribed the identity out of it would be publishing a second statement about who signed - one
   * a reader would believe and no guard here could check. The identity a verifier gets is the one it
   * verified, never the one we printed.
   */
  readonly bundle: HarnessFile
}

/**
 * What a verifier must require of an attestation before believing it: which OIDC issuer, and which
 * identity from that issuer.
 *
 * **No instance exists and that is not an omission.** Both values are properties of a publishing
 * pipeline - which workflow, in which repository, on which provider - and that pipeline is the fourth
 * unit. Writing a plausible issuer here would be inventing the tool, and a verification policy that
 * names an identity nobody publishes under is worse than none: it reads as though it had been
 * checked.
 *
 * What the type does establish, before the tool exists, is that verification is *policy-bound*. A
 * bundle that verifies cryptographically and was signed by an identity nobody authorised proves that
 * somebody signed something. Any consumer written without this pair would accept it.
 */
export type VerificationPolicy = {
  readonly issuer: string
  readonly identity: string
}

/** Attestations held by the digest they are about. Not in the snapshot, not in the ledger. */
export type AttestationIndex = Readonly<Record<string, readonly Attestation[]>>

export const EMPTY_ATTESTATIONS: AttestationIndex = {}

/**
 * Why an attestation cannot be accepted for this snapshot. Empty when it can.
 *
 * The check that matters is the first: an attestation naming a different digest is an attestation
 * about a different artefact, and stapling one to the wrong snapshot is the cheapest possible way to
 * make an unsigned thing look signed. It costs nothing to refuse and everything to omit.
 *
 * What this does *not* do is verify the bundle. That needs Sigstore's own verification and a policy
 * this registry cannot fill yet, and a function that returned "no faults" for an unverified bundle
 * under a name like `verify` would be the decorative guard this repository exists to refuse. It is
 * called `faults` because that is all it finds.
 */
export const attestationFaults = (
  attestation: Attestation,
  snapshot: Snapshot,
): readonly string[] => {
  const digest = digestOfSnapshot(snapshot)

  return [
    ...(attestation.subject === digest
      ? []
      : [`this attestation is about ${attestation.subject}, and this snapshot is ${digest}`]),
    ...(DIGEST.test(attestation.bundle.sha256)
      ? []
      : [`the bundle carries "${attestation.bundle.sha256}", which is not a sha-256 digest`]),
    ...(attestation.bundle.bytes > 0 ? [] : ['the bundle is empty']),
  ]
}

export const attestationsFor = (index: AttestationIndex, digest: string): readonly Attestation[] =>
  index[digest] ?? []
