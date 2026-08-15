/**
 * What a client can establish alone, and what it has to take from us.
 * ADR-0054 is why a rule is looked for as a shape before it is written as a sentence.
 *
 *
 * This is the product of the unit. Every guarantee this project sells rests on an installation never
 * trusting a source but checking it, so the exact extent of "check it" is the sentence the methodology
 * page has to be able to say without hedging - and a list of what *cannot* be checked is worth more
 * than the other one, because it is the half a registry has every incentive to leave vague.
 *
 * ---------------------------------------------------------------------------
 * The rule §8 imposes, and why it is a type rather than a guard
 * ---------------------------------------------------------------------------
 *
 * §8 forbids withholding anything that *defines* a contract, on the grounds that the transparency of
 * the contracts is the product: re-seeded property testing and differential testing make bypassing the
 * verification equivalent to writing correct code, so there is nothing to protect by hiding. It
 * follows that no line of the believed column may have "we do not publish it" as its reason.
 *
 * That is not enforced by a guard below. `BelievedClaim.nature` has three members and none of them can
 * express it, so the forbidden reason cannot be written down at all - the same move `address.ts` makes
 * when it gives a guard no unpaired form to be addressed by. A guard can be deleted by whoever adds
 * the line it was written to refuse; a union member that does not exist cannot be reached for.
 *
 * ---------------------------------------------------------------------------
 * How the two columns count, said before anyone counts them
 * ---------------------------------------------------------------------------
 *
 * The believed column is longer, and that is the honest shape rather than a failure. What separates
 * the two is not length but kind: the verified column holds the *facts* - these are the bytes, this is
 * the file, this implementation passes this suite - and the believed column holds, almost entirely,
 * the registry's *opinions* - which one is the default, what a machine measured, what we called it.
 * The two entries that are not opinions are the two nothing can ever reach, and both were already
 * written down before this unit: no arithmetic tells a reader that a registry serves everyone the same
 * bytes, and nothing tells anyone that a contract is the right specification.
 *
 * ---------------------------------------------------------------------------
 * The field-level answer, which was already in the repository
 * ---------------------------------------------------------------------------
 *
 * `FIELD_MAP.verification` is this same axis one level down, field by field, and it has been since the
 * schema was written: `executable` is a claim a reader can re-run, `structural` one they can re-check
 * from the record alone, `one-directional` a guard that keeps one half of what it looks like it keeps,
 * and `documentary` a sentence nothing can contradict. It was served by nothing. The methodology page
 * is what needs it, and `WHAT_A_STRATUM_MEANS_TO_A_READER` below is the translation.
 */

import { WHAT_A_SIGNATURE_DOES_NOT_PROVE } from './attestation.js'
import { SEEDING_POLICY } from './evidence.js'
import type { VerificationStratum } from './field-map.js'
import { FIELD_MAP } from './field-map.js'
import type { NamedAnswer } from './response.js'

// ---------------------------------------------------------------------------
// The verified column
// ---------------------------------------------------------------------------

export type VerifiableClaim = {
  readonly id: string
  readonly claim: string
  /** What the reader runs. Named, because a check that is described is a check nobody runs. */
  readonly by: string
  /** The endpoints this is about. Empty when the check needs no answer from us at all. */
  readonly about: readonly string[]
  /** What it still does not establish, so that nobody reads it as more than it is. */
  readonly butNot: string
}

export const VERIFIABLE: readonly VerifiableClaim[] = [
  {
    id: 'a-snapshot-is-the-bytes-its-address-names',
    claim: 'this frozen artefact is exactly what the digest I asked for names',
    by: 're-canonicalising the body and hashing it, then comparing with the address it was fetched by',
    about: ['snapshot'],
    butNot: 'that this digest is the one a contract name ought to resolve to',
  },
  {
    id: 'a-blob-is-the-bytes-its-address-names',
    claim: 'this file is exactly what the digest names',
    by: 'normalising to the served form - UTF-8, LF, no byte-order mark - and hashing',
    about: ['blob'],
    butNot: 'anything about what the file does',
  },
  {
    id: 'a-snapshot-covers-every-file-it-lists',
    claim: 'the set of files is the published set, and none of them was substituted',
    by: 'the harness digests being inside the snapshot digest, which the check above already covered',
    about: ['snapshot'],
    butNot: 'that the registry showed me the same set it shows everyone else',
  },
  {
    id: 'an-installed-file-is-what-was-served',
    claim: 'the file in my project is the one the registry gave me, or I changed it',
    by: 'hashing the file on disk against the digest the lockfile recorded',
    about: [],
    butNot: 'which of the two happened, if the lockfile itself was edited',
  },
  {
    id: 'a-published-artefact-never-changed',
    claim: 'what this digest names today is what it named when I installed it',
    by: 'fetching by digest and hashing; a registry that answered anything else would fail the check',
    about: ['snapshot', 'blob'],
    butNot: 'that the *name* still points at this digest, which is a different question and is below',
  },
  {
    id: 'a-dependency-graph-resolves-to-this-set',
    claim: 'installing this feature pulls in exactly these others, in this order',
    by: 'walking the edges in each implementation snapshot, every one of which is verified on arrival',
    about: ['snapshot'],
    butNot: 'nothing - this one is complete, which is why the registry does not serve a resolution',
  },
  {
    id: 'an-attestation-is-about-this-snapshot',
    claim: 'this signature is about the artefact I am holding and not another one',
    by: 'comparing the attestation subject with the digest of the snapshot',
    about: ['attestations'],
    butNot: 'that the set of attestations I was shown is complete',
  },
  {
    id: 'who-published-a-snapshot-and-from-what-build',
    claim: 'this artefact was published by a named identity from a named build',
    by: 'verifying the Sigstore bundle with `cosign`, against an issuer and identity the reader supplies',
    about: ['attestations'],
    /**
     * A complement, because the page writes `This does not establish ${butNot}.` and every other entry
     * supplies one. `WHAT_A_SIGNATURE_DOES_NOT_PROVE` stood here and is a whole sentence about three
     * things, so the page published *This does not establish a signature attests who published this
     * snapshot and from what build* - which denies the claim two lines above it. It goes on being
     * rendered whole under its own heading, which is the position it was written for.
     */
    butNot:
      'that what was published is right - the contract\'s verification says an implementation ' +
      'answers the contract, and neither that nor a signature says the contract is the right ' +
      'specification',
  },
  {
    id: 'an-implementation-answers-its-contract',
    claim: 'this code satisfies the properties, the edge cases and the signature the contract declares',
    by: 'fetching the harness and running it - the whole of it, on the reader\'s own machine',
    about: ['snapshot', 'blob'],
    butNot:
      'that it passes the draws the registry drew: properties are re-seeded every run, deliberately, ' +
      `so a reader's run is a different sample of the same properties - ${SEEDING_POLICY.whyNotFrozen}`,
  },
]

// ---------------------------------------------------------------------------
// The believed column
// ---------------------------------------------------------------------------

/**
 * Why a claim cannot be reached by arithmetic. Three members, and there is deliberately no fourth
 * meaning "the registry does not publish what would settle it" - §8 forbids that reason, so this type
 * gives nobody a place to write it.
 */
export type BelievedNature =
  /** The registry's own judgement about an artefact. Changeable, and never inside a digest. */
  | 'an opinion of the registry'
  /** A number produced on hardware the reader does not have. */
  | 'a measurement on a machine nobody else has'
  /** No arithmetic reaches it, whatever anyone publishes. */
  | 'outside what any arithmetic can reach'

export type BelievedClaim = {
  readonly id: string
  readonly claim: string
  readonly nature: BelievedNature
  /** What narrows it, or `null` when nothing does. A null here is a finding, not a gap. */
  readonly mitigation: string | null
  readonly about: readonly string[]
}

export const MUST_BE_BELIEVED: readonly BelievedClaim[] = [
  {
    id: 'this-name-resolves-to-this-digest',
    claim: '`number/parse@1` is the artefact behind this digest and not another',
    nature: 'an opinion of the registry',
    mitigation:
      'a lockfile pins it after the first install, so the binding is believed once and checked for ' +
      'ever afterwards; and a transparency log makes a later change auditable by a third party. ' +
      'Neither makes the first resolution checkable offline, and no scheme does.',
    about: ['contract-binding', 'implementation-bindings'],
  },
  {
    id: 'the-standing-of-an-implementation',
    claim: 'this implementation is the default, that one was demoted, these are its tags',
    nature: 'an opinion of the registry',
    mitigation:
      'a demoted implementation goes on being served, so the opinion changes what is recommended and ' +
      'never what is reachable - a project that installed it keeps resolving its digest',
    about: ['implementation-bindings'],
  },
  {
    id: 'the-lifecycle-of-a-contract',
    claim: 'this contract is published, or the language has since absorbed it',
    nature: 'an opinion of the registry',
    mitigation:
      'the absorbed state carries the measurement that established it, replayable by anyone against ' +
      'the language - so the claim is arguable even though it is not computable',
    about: ['contract-binding', 'refusals'],
  },
  {
    id: 'a-benchmark-figure',
    claim: 'this implementation takes this long per call on this profile',
    nature: 'a measurement on a machine nobody else has',
    mitigation:
      'the figure names the machine and the date it was taken on, and the profiles and their samples ' +
      'are frozen inside the snapshot - so anyone can run the same profile on their own hardware and ' +
      'publish a number that disagrees',
    about: ['implementation-bindings'],
  },
  {
    id: 'a-minified-size',
    claim: 'this implementation ships this many bytes',
    nature: 'a measurement on a machine nobody else has',
    mitigation:
      'the source is served and hashed, so anyone with a minifier can produce the figure themselves ' +
      'and see whether it agrees. It is null on everything the catalogue holds today.',
    about: ['implementation-bindings'],
  },
  {
    id: 'the-index-is-complete',
    claim: 'these are all the contracts the registry has',
    nature: 'an opinion of the registry',
    mitigation: null,
    about: ['contract-index'],
  },
  {
    id: 'the-set-of-attestations-is-complete',
    claim: 'these are all the signatures held for this digest',
    nature: 'an opinion of the registry',
    mitigation: null,
    about: ['attestations'],
  },
  {
    id: 'a-case-was-found-by-the-mutant-it-cites',
    claim: 'this edge case exists because that mutant survived until it was written',
    nature: 'an opinion of the registry',
    mitigation:
      'nothing is withheld: the batteries are in the repository, public and replayable, and the ' +
      'citation is resolved against them at serialisation rather than transcribed - a provenance ' +
      'naming a mutant no battery declares stops the publication. What a reader cannot do is resolve ' +
      'it *from a response*, because the instrument measures the catalogue and is not part of it.',
    about: ['snapshot'],
  },
  {
    id: 'the-prose-of-a-record',
    claim: 'the summary, the input domain, and the rationale of each case say what is true',
    nature: 'an opinion of the registry',
    mitigation:
      'each field carries the stratum it is verified at, so a reader is told which sentences no run ' +
      'could falsify rather than left to assume they were all checked',
    about: ['snapshot', 'methodology'],
  },
  {
    id: 'the-registry-serves-everyone-the-same-bytes',
    claim: 'the digest this name resolved to for me is the one it resolves to for everyone',
    nature: 'outside what any arithmetic can reach',
    mitigation:
      'a transparency log and independent mirrors would make a split view detectable after the fact. ' +
      'Neither exists yet, and until one does a registry that answered one reader differently would ' +
      'leave no trace either reader could find.',
    about: ['contract-binding', 'implementation-bindings', 'contract-index'],
  },
  {
    id: 'this-contract-is-the-right-specification',
    claim: 'what this contract requires is what a caller of this function should want',
    nature: 'outside what any arithmetic can reach',
    mitigation: null,
    about: ['snapshot'],
  },
]

// ---------------------------------------------------------------------------
// The field-level axis, which the schema already carried
// ---------------------------------------------------------------------------

/**
 * What each stratum of `FIELD_MAP` means to somebody deciding whether to believe a field.
 *
 * `visibility.test.ts` already requires every stratum to be held by a field of the five; this requires
 * every stratum to have been translated for a reader. Two questions about one vocabulary, and the
 * second is the one a methodology page fails without.
 */
export const WHAT_A_STRATUM_MEANS_TO_A_READER: Readonly<Record<VerificationStratum, string>> = {
  executable:
    'a guard in the contract\'s own suite fails when an implementation contradicts this. You can run ' +
    'that suite yourself, on the harness we serve, and see it.',
  structural:
    'a malformed value here is refused without any implementation being involved. You can re-check ' +
    'it from the record alone.',
  'one-directional':
    'a guard exists and keeps one half of what it appears to keep: the declared value may be wider ' +
    'than what the guard requires, and nothing notices. Read it as a claim, not as a check.',
  documentary:
    'published prose. Nothing can contradict it, because it makes no claim a run could falsify.',
  'stated-per-declaration':
    'what refuses a wrong value here depends on which declaration it is, and the record carries the ' +
    'answer beside each one.',
}

// ---------------------------------------------------------------------------
// The methodology answer
// ---------------------------------------------------------------------------

export type ServedMethodology = NamedAnswer & {
  readonly verifiable: readonly VerifiableClaim[]
  readonly mustBeBelieved: readonly BelievedClaim[]
  readonly strata: Readonly<Record<VerificationStratum, string>>
  /** Every field of a contract record, with the stratum it is verified at. */
  readonly fields: Readonly<Record<string, VerificationStratum>>
  readonly seeding: typeof SEEDING_POLICY
  readonly whatASignatureDoesNotProve: string
}

export const servedMethodology = (servedFrom: string): ServedMethodology => ({
  addressing: 'named',
  servedFrom,
  verifiable: VERIFIABLE,
  mustBeBelieved: MUST_BE_BELIEVED,
  strata: WHAT_A_STRATUM_MEANS_TO_A_READER,
  fields: Object.fromEntries(
    Object.entries(FIELD_MAP).map(([path, entry]) => [path, entry.verification]),
  ),
  seeding: SEEDING_POLICY,
  whatASignatureDoesNotProve: WHAT_A_SIGNATURE_DOES_NOT_PROVE,
})
