/**
 * What a published version *is*, and what makes it the same thing everywhere.
 * ADR-0050 is why a frozen edge carries the digest of what it names.
 *
 *
 * A published version is frozen for life, hashed, served for ever, and no installation ever fetches
 * from anywhere else. That is permanent rule 3 and it is the whole security argument of this project,
 * so it cannot rest on the registry behaving itself. What makes it checkable is that the thing served
 * is addressed by its own content: two registries answering one digest are provably answering the
 * same bytes, and a user's lockfile holds the digest, so a later resolution that returns something
 * else is caught on the user's machine with no call to us. The trust is in the arithmetic and not in
 * the server, which is the only place it can be.
 *
 * The shape is a Merkle tree of three levels, and it is OCI's rather than invented here because that
 * one is deployed at the scale of every container registry in the world and this one would be a
 * guess. A **blob** is a served byte string, addressed by its digest. A **manifest** is a snapshot,
 * which names its blobs by digest. The **snapshot digest** is taken over the canonical text of the
 * manifest, so it covers every blob transitively and one digest is enough to pin everything.
 *
 * ---------------------------------------------------------------------------
 * Two units, and they are not one
 * ---------------------------------------------------------------------------
 *
 * A contract snapshot and an implementation snapshot are frozen separately. A contract is owned by
 * the registry and evolves only by major version; an implementation lives underneath it, competes
 * with others, and carries its own version that moves while the contract's does not.
 *
 * Folding them would force one of two wrong things. Either an implementation could not publish
 * without republishing its contract - which freezes implementations to the contract and kills the
 * competition that is the reason an implementation list exists at all - or the contract's digest
 * would move every time an implementation shipped, and the thing this registry most needs to be
 * immutable would be the thing that changed most often.
 *
 * Coexistence follows for free: `name@1` and `name@2` are two snapshots with two addresses and two
 * digests, sharing no mutable object. There is nothing to make acrobatic.
 *
 * ---------------------------------------------------------------------------
 * What a snapshot may not contain, which is the finding of this unit
 * ---------------------------------------------------------------------------
 *
 * Checking the five against a snapshot turned up fields of the record that **cannot be frozen**,
 * because the schema that holds them says in as many words that they change after publication.
 *
 * `lifecycle` is the clearest. `absorbed-by-the-language` is *defined* as a state a contract enters
 * after it was published - "a contract that clears rule 7 today and is absorbed tomorrow cannot be
 * unpublished". If the digest covered it, then either absorbing a contract changes its digest, and
 * immutability is broken on the day the rule fires, or the state can never be reached, and it is the
 * decorative rule its own comment warns against. Both are refusals of something the repository has
 * already decided, so the field is not in the frozen half.
 *
 * On the implementation side: `status` moves from `listed` to `default` to `demoted` over an
 * artefact's life and the schema says demotion is deliberately not withdrawal; `minifiedBytes` is
 * null until a minifier exists; `benchmarks` is empty until a reference machine does; and `tags` are
 * the registry's curation rather than a fact about the code.
 *
 * So a snapshot is a **projection** of a record, and the rest is the registry's standing opinion
 * about a frozen artefact - held in the ledger below, changeable, and never inside a digest. That is
 * the same separation OCI makes between an immutable artefact and mutable metadata, arrived at here
 * from the contents of five contracts rather than from the analogy.
 *
 * The projection is written out field by field rather than derived by omission, for the reason
 * `publicContract` is: a projection derived from a list of exclusions could not disagree with that
 * list, and the guard would compare one statement with itself. `snapshot.test.ts` requires the two
 * statements to partition the record exactly, so a field added to a record and to neither half is
 * refused rather than silently frozen.
 *
 * ---------------------------------------------------------------------------
 * What is deliberately not here
 * ---------------------------------------------------------------------------
 *
 * No hosting, no object store, no database. Choosing one is an infrastructure decision that belongs
 * with a deployment, and taking it now would be guessing - the same discipline the schema was built
 * under. What is modelled is the format and the guarantees; where the bytes sit is not a property of
 * either.
 *
 * The timestamp of a publication is in the ledger and not in the snapshot, and that is load-bearing:
 * a digest that moved with the clock would make "the same content produces the same digest" false by
 * construction, and republishing identical content would mint a second identity for one artefact.
 */

import type { ContractAddress, ImplementationAddress } from './address.js'
import { renderContract, renderImplementation } from './address.js'
import { DIGEST, digestOf } from './canonical.js'
import type {
  BenchmarksRecord,
  CaseTableRecord,
  ContractRecord,
  IdentityRecord,
  Lifecycle,
  OwnDeclaration,
  PropertiesRecord,
  SurfaceRecord,
  UseCaseRecord,
} from './contract-record.js'
import type {
  DependencyEdge,
  HarnessFile,
  ImplementationRecord,
  ImplementationStatus,
} from './implementation-record.js'

/** The version of the canonicalisation and of the projection a digest was taken under. */
export const SNAPSHOT_FORMAT = 1

/**
 * The frozen half of a contract: everything a caller receives, and nothing the registry may change
 * its mind about.
 *
 * `benchmarks` is passed through whole. It used to be rebuilt here, because it was the one object of
 * the record whose frozen and standing halves sat together - the vocabulary and the profiles frozen,
 * the measurements not. The measurements are gone: they modelled the same fact as an implementation's
 * `BenchmarkFigure`, from the other side, and a benchmark belongs to the implementation it was
 * measured on.
 */
export type FrozenContract = {
  readonly address: ContractAddress
  readonly identity: IdentityRecord
  readonly surface: SurfaceRecord
  readonly environments: readonly string[]
  readonly properties: PropertiesRecord
  readonly caseTables: readonly CaseTableRecord[]
  readonly benchmarks: BenchmarksRecord
  readonly ownDeclarations: readonly OwnDeclaration[]
  readonly harness: readonly HarnessFile[]
  /**
   * Frozen, because what a published contract's own guards call is part of what it is. ADR-0105.
   *
   * It is the same argument `FrozenImplementation.dependsOn` makes one level down - an edge outside
   * the digest lets code under a fixed digest change what it pulls in - arriving on the half this
   * project actually sells. Measured before it existed: emptying one shared guard left every digest
   * here identical and made a contract that must be refused pass.
   */
  readonly sharedHarness: readonly HarnessFile[]
}

export type FrozenImplementation = {
  readonly id: string
  readonly contract: ContractAddress
  readonly author: string
  readonly version: string | null
  readonly files: readonly HarnessFile[]
  /**
   * Frozen, because what a published artefact imports is part of what it is. An edge outside the
   * digest would let the code installed under a fixed digest change what it pulls in.
   *
   * Each edge carries the digest of the snapshot it names, so this list is what makes the closure a
   * Merkle tree with one root rather than a list of names to go and resolve. `edgeTo` below is how one
   * is built, and `declarationFaults` is what a client checks when one arrives.
   */
  readonly dependsOn: readonly DependencyEdge[]
}

/**
 * A field of a record a snapshot may not carry, with the sentence that keeps it out.
 *
 * Declared as data so that `snapshot.test.ts` can require the two halves to partition a record
 * exactly. A field added to a record and to neither half is refused - which is `unaccountedFor` from
 * `mutation/attribution.ts` and `every-export-is-carried-or-declared-uncarried` from
 * `coverage.test.ts`, asked a third time about a third thing: silence is never an answer.
 */
export type StandingField = {
  readonly field: string
  readonly reason: string
}

/**
 * **One entry, and it is a category rather than an exception.** This list held two until the
 * contract-side measurements were deleted as a duplicate of the implementation's, and a list of one
 * reads like a special case somebody carved out - so the next reader flattens it into the projection
 * and the question stops being asked.
 *
 * The question is: *may the registry change its mind about this field after publication?* Every field
 * a contract record grows has to answer it, and an answer of yes puts the field here whatever else it
 * is. `snapshot.test.ts` requires the two halves to partition a record exactly, so a field added to
 * neither is refused - which only works while this list is a place a field can be added to.
 *
 * **The list stopped holding one entry, and the entry that arrived is one this comment had named.**
 * It read *two candidates already exist on paper and neither is filled today: anything the registry
 * curates about a contract, as `tags` are one level down, and anything a later measurement attaches
 * to an artefact published without it.* `useCases` is the first of the two, and it arrived because
 * the alternative was impossible rather than merely worse: `string/slugify@1` is published, so a
 * field in `identity` moves its digest and a byte in `contract.ts` moves it too - both measured, and
 * both permanent rule 6 firing correctly. The second candidate is still on paper. ADR-0118.
 *
 * **A third was proposed, measured and refused, and it is written here because this is where somebody
 * reaching for it arrives.** *What a contract refuses to be* looked like `useCases`' twin - a redesign
 * wanted it, and `CLAUDE.md` asked for it by name. It is already published: `identity.inputDomain`
 * carries the `it is not…` clauses of all four contracts, inside the frozen half. Adding it here would
 * be a second statement **one half of which permanent rule 6 makes unremovable for the life of the
 * majors** - which is not the duplication this repository accepts as a test, because neither side could
 * ever be repaired. ADR-0128.
 */
export const CONTRACT_STANDING_FIELDS: readonly StandingField[] = [
  {
    field: 'lifecycle',
    reason:
      '`absorbed-by-the-language` is defined as a state a contract enters after publication, and ' +
      'permanent rule 6 forbids unpublishing it. Inside the digest, either the rule firing breaks ' +
      'immutability or the state is unreachable - and an unreachable state is the decorative rule ' +
      'its own comment warns against.',
  },
  {
    field: 'useCases',
    reason:
      'how a function gets used is the registry\'s curation and not a fact about the artefact: ' +
      'nothing links to a use case, no answer cites one, and rewriting one the day it reads badly ' +
      'breaks nobody\'s code. Inside the digest it would freeze prose for the life of a major, ' +
      'which is what ADR-0023 refuses for an alias and for the same three reasons.',
  },
]

export const IMPLEMENTATION_STANDING_FIELDS: readonly StandingField[] = [
  {
    field: 'status',
    reason:
      'an implementation moves from `listed` to `default` to `demoted` over its life, and the ' +
      'schema records that demotion is deliberately not withdrawal: the bytes go on being served ' +
      'while the registry stops recommending them.',
  },
  {
    field: 'minifiedBytes',
    reason: 'null until a minifier exists, and measured against code that was published without it.',
  },
  {
    field: 'benchmarks',
    reason:
      'the same as the contract\'s measurements, one level down: no reference machine, no figure yet.',
  },
  {
    field: 'tags',
    reason:
      'the registry\'s own curation of an artefact rather than a fact about it, so it may be ' +
      'changed without the code changing.',
  },
]

export type Snapshot =
  | { readonly formatVersion: number; readonly unit: 'contract'; readonly frozen: FrozenContract }
  | {
      readonly formatVersion: number
      readonly unit: 'implementation'
      readonly frozen: FrozenImplementation
    }

export const contractSnapshot = (record: ContractRecord): Snapshot => ({
  formatVersion: SNAPSHOT_FORMAT,
  unit: 'contract',
  frozen: {
    address: record.address,
    identity: record.identity,
    surface: record.surface,
    environments: record.environments,
    properties: record.properties,
    caseTables: record.caseTables,
    benchmarks: record.benchmarks,
    ownDeclarations: record.ownDeclarations,
    harness: record.harness,
    sharedHarness: record.sharedHarness,
  },
})

export const implementationSnapshot = (record: ImplementationRecord): Snapshot => ({
  formatVersion: SNAPSHOT_FORMAT,
  unit: 'implementation',
  frozen: {
    id: record.id,
    contract: record.contract,
    author: record.author,
    version: record.version,
    files: record.files,
    dependsOn: record.dependsOn,
  },
})

/**
 * The address of a snapshot, and the only one that can be checked without asking us.
 *
 * A name resolves through the registry; a digest resolves through arithmetic. Both exist, and the
 * *binding* between them is what the registry publishes and freezes - see `Ledger`.
 */
export const digestOfSnapshot = (snapshot: Snapshot): string => digestOf(snapshot, 'snapshot')

/**
 * An edge to a published implementation, with its digest read off the artefact rather than written
 * beside it.
 *
 * **This is the only way to build one, and that is the whole mechanism.** A digest transcribed next to
 * an address is a second statement of one fact, free to be wrong - and an edge that is wrong installs
 * another feature under the right name, which is the most expensive defect this schema can carry. So
 * the omission is made impossible rather than forbidden: there is no shape here that lets a caller
 * supply a digest, exactly as `parametersOf` refuses a declared parameter list and `harnessOf` refuses
 * a declared size.
 *
 * It takes the record it points at, so the digest and the address are read from one value. A caller
 * that passed the wrong record would name that record - and would name it in both halves, which is a
 * consistent edge to the wrong feature rather than a lying one.
 *
 * An unpublished target is refused rather than encoded, because `ImplementationAddress` carries a
 * `string` version: an edge to something no address names is not an edge.
 */
export const edgeTo = (target: ImplementationRecord): DependencyEdge => {
  if (target.version === null) {
    throw new Error(
      `${renderContract(target.contract)}/${target.id} has no version, so nothing can depend on it. ` +
        `A version is assigned when an artefact is published, and an edge names a published one.`,
    )
  }

  return {
    implementation: { contract: target.contract, id: target.id, version: target.version },
    digest: digestOfSnapshot(implementationSnapshot(target)),
  }
}

// ---------------------------------------------------------------------------
// The standing - what the registry may still change about a frozen artefact
// ---------------------------------------------------------------------------

export type ContractStanding = {
  readonly lifecycle: Lifecycle
  /** Absent on a contract that declares none, for the reason the record states. ADR-0118. */
  readonly useCases?: readonly UseCaseRecord[]
}

export type ImplementationStanding = { readonly status: ImplementationStatus }

// ---------------------------------------------------------------------------
// The ledger - the binding, and the refusal that makes immutability real
// ---------------------------------------------------------------------------

/**
 * When a binding was made, and from which state of this repository. ADR-0093 is the second field.
 *
 * `publishedAt` is a clock and `publishedFrom` is a commit, and they answer two different questions
 * about one event. The clock says when somebody decided; the commit says what they decided *about*,
 * and it is the only one of the two a later reader can act on: the frozen half at that commit is
 * recomputable, so the digest below is checkable rather than merely recorded.
 *
 * Neither may enter a snapshot, and the module header above says why in the clock's words: a digest
 * that moved with either would make "the same content produces the same digest" false by
 * construction. A commit is a clock with better resolution, which is the argument
 * [ADR-0090] makes about the revision a named answer carries.
 *
 * It is required rather than optional, and that is the whole reason it lives here rather than on
 * `Lifecycle`. These two types exist only for what is published, so there is no shape in which a
 * binding can omit the coordinate that makes its own freeze checkable.
 */
export type PublishedContract = {
  readonly address: ContractAddress
  readonly digest: string
  readonly publishedAt: string
  readonly publishedFrom: string
  readonly standing: ContractStanding
}

export type PublishedImplementation = {
  readonly address: ImplementationAddress
  readonly digest: string
  readonly publishedAt: string
  readonly publishedFrom: string
  readonly standing: ImplementationStanding
}

/**
 * A contract the catalogue considered and decided against, with the measurement it decided on.
 *
 * **Found by the read API, and it is a hole rather than an omission.** Everything else in this ledger
 * is a binding of a name to a digest, and a refusal binds nothing: `array/group-by@1` was decided
 * against *before* publication, so it has no snapshot, no digest and no entry - which meant that the
 * site's "what we refuse and why" page, and the whole of what that page is for, had no source in the
 * registry at all. The catalogue's most-cited act of honesty was the one thing it could not serve.
 *
 * It sits in the ledger and not beside a snapshot because that is what it is: the registry's standing
 * opinion, changeable, inside no digest. And it is a third list rather than a fourth `Lifecycle` state
 * in `contracts`, because `publishContract` is the only way into that list and a refusal must not be
 * able to enter through a function whose whole job is to bind an address for ever.
 */
export type RefusedContract = {
  readonly address: ContractAddress
  readonly decidedAgainst: string
  readonly measurement: string
  readonly keptAs: string
  readonly decidedOn: string
}

export type Ledger = {
  readonly contracts: readonly PublishedContract[]
  readonly implementations: readonly PublishedImplementation[]
  readonly refusals: readonly RefusedContract[]
}

export const EMPTY_LEDGER: Ledger = { contracts: [], implementations: [], refusals: [] }

export class AlreadyDecided extends Error {
  constructor(what: string, how: string) {
    super(
      `${what} has already been ${how}, so the catalogue cannot decide about it a second time. A ` +
        `contract is refused or it is published, once, and a registry that could do both would be ` +
        `offering an installation of something its own page says it turned down.`,
    )
    this.name = 'AlreadyDecided'
  }
}

/**
 * Record a refusal. It is refused here and refusable nowhere else, and the two directions are both
 * closed: a published contract cannot be refused afterwards, and a refused one cannot be published.
 *
 * The second direction is the one that matters. Permanent rule 6 freezes a published version for life,
 * so "publish it anyway" is not a repair - it is two contradictory public statements about one
 * address, one of which every lockfile in the world would be holding.
 */
export const refuseContract = (ledger: Ledger, entry: RefusedContract): Ledger => {
  const what = renderContract(entry.address)

  if (ledger.contracts.some((held) => renderContract(held.address) === what)) {
    throw new AlreadyDecided(what, 'published')
  }
  if (ledger.refusals.some((held) => renderContract(held.address) === what)) {
    throw new AlreadyDecided(what, 'refused')
  }

  return { ...ledger, refusals: [...ledger.refusals, entry] }
}

export class AlreadyPublished extends Error {
  constructor(what: string, held: string, offered: string) {
    super(
      `${what} is already published at ${held} and cannot be published again at ${offered}. A ` +
        `published version is frozen for life: an incompatible evolution creates a new major beside ` +
        `it, never in place of it, and a compatible one is a new implementation version. Rebinding ` +
        `an address is the one operation this storage exists to refuse - every lockfile that ever ` +
        `recorded ${held} would silently start resolving to other bytes.`,
    )
    this.name = 'AlreadyPublished'
  }
}

export class NotPublished extends Error {
  constructor(what: string) {
    super(`${what} has never been published, so it has no standing to change`)
    this.name = 'NotPublished'
  }
}

/**
 * The rule both units obey, written once: an address is bound to a digest exactly once, for ever.
 *
 * It is shared rather than written twice because it is one rule about one thing - the two units
 * differ in what they address and not in how binding works - and a second copy is a rule that can
 * come to disagree with itself.
 */
const refuseRebinding = (
  entries: readonly { readonly digest: string }[],
  what: string,
  offered: string,
): void => {
  const held = entries[0]
  if (held !== undefined) throw new AlreadyPublished(what, held.digest, offered)
}

/**
 * Bind an address to a digest, once and for ever. **Read this before calling it.**
 *
 * What is frozen by this call is **every byte of every file the contract declares** - all seven of
 * them, `reference.ts` and the four test files included, comments and blank lines included. `harness`
 * carries each file's sha-256 and the snapshot digest covers it, so a typo repaired in a comment of
 * `properties.test.ts` is a different artefact under the same name. Measured: one citation reworded in
 * one comment moved `string/slugify@1` from `8bea4012…` to `8753bb97…`, in a commit whose whole subject
 * was documentation.
 *
 * That is deliberate rather than an over-reach. A comment in a contract folder is not inert: thirteen
 * `@ts-expect-error` directives sit in the five contracts' `signature.test-d.ts`, and a freeze that
 * skipped comments would let a signature guard be weakened on a published contract with the digest
 * standing still.
 *
 * **So a contract is published when it is finished, and never before.** Afterwards the only repair is
 * `name@2` beside it - permanent rule 6 - and `rebinding.ts` is what refuses the alternative: it
 * rebuilds this contract at `entry.publishedFrom` and compares. ADR-0093.
 */
export const publishContract = (ledger: Ledger, entry: PublishedContract): Ledger => {
  const what = renderContract(entry.address)
  refuseRebinding(
    ledger.contracts.filter((held) => renderContract(held.address) === what),
    what,
    entry.digest,
  )

  return { ...ledger, contracts: [...ledger.contracts, entry] }
}

export const publishImplementation = (
  ledger: Ledger,
  entry: PublishedImplementation,
): Ledger => {
  const what = renderImplementation(entry.address)
  refuseRebinding(
    ledger.implementations.filter((held) => renderImplementation(held.address) === what),
    what,
    entry.digest,
  )

  return { ...ledger, implementations: [...ledger.implementations, entry] }
}

/**
 * The standing changes and the digest does not. This is the operation that makes
 * `absorbed-by-the-language` reachable without breaking anything, and the reason the lifecycle is
 * outside the snapshot at all.
 */
export const withContractStanding = (
  ledger: Ledger,
  address: ContractAddress,
  standing: ContractStanding,
): Ledger => {
  const what = renderContract(address)
  const held = ledger.contracts.find((entry) => renderContract(entry.address) === what)
  if (held === undefined) throw new NotPublished(what)

  return {
    ...ledger,
    contracts: ledger.contracts.map((entry) =>
      renderContract(entry.address) === what ? { ...entry, standing } : entry,
    ),
  }
}

export const withImplementationStanding = (
  ledger: Ledger,
  address: ImplementationAddress,
  standing: ImplementationStanding,
): Ledger => {
  const what = renderImplementation(address)
  const held = ledger.implementations.find((entry) => renderImplementation(entry.address) === what)
  if (held === undefined) throw new NotPublished(what)

  return {
    ...ledger,
    implementations: ledger.implementations.map((entry) =>
      renderImplementation(entry.address) === what ? { ...entry, standing } : entry,
    ),
  }
}

/**
 * What a reader has to check to accept a snapshot as the one an address names: the digest is
 * well formed, it is the digest of these bytes, and every blob it names is addressed the same way.
 *
 * One function rather than a comment, because "verify the digest" is exactly the step a consumer
 * skips when it is described rather than provided.
 */
/**
 * The files a snapshot names, whichever half it froze.
 *
 * One function because it is one question - *which bytes does this artefact hash* - asked by the check
 * below and by the emission that has to serve every one of them. Two readings of a two-armed union
 * would be two places to add the third arm.
 */
export const filesNamedBy = (snapshot: Snapshot): readonly HarnessFile[] =>
  snapshot.unit === 'contract'
    ? [...snapshot.frozen.harness, ...snapshot.frozen.sharedHarness]
    : snapshot.frozen.files

export const snapshotFaults = (snapshot: Snapshot, claimed: string): readonly string[] => {
  const computed = digestOfSnapshot(snapshot)
  const blobs = filesNamedBy(snapshot)

  return [
    ...(DIGEST.test(claimed) ? [] : [`"${claimed}" is not a sha-256 digest in lower-case hex`]),
    ...(computed === claimed ? [] : [`these bytes hash to ${computed} and not to ${claimed}`]),
    ...blobs
      .filter((blob) => !DIGEST.test(blob.sha256))
      .map((blob) => `${blob.path} carries "${blob.sha256}", which is not a sha-256 digest`),
    ...(snapshot.formatVersion === SNAPSHOT_FORMAT
      ? []
      : [
          `this snapshot was written under format ${snapshot.formatVersion} and this reader ` +
            `canonicalises under ${SNAPSHOT_FORMAT}, so a digest computed here means nothing`,
        ]),
  ]
}
