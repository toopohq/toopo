/**
 * How a contract folder becomes a registry record.
 * ADR-0059 is why the root here is two levels up rather than one.
 *
 *
 * There is one builder rather than five, and the bar is the catalogue's own: what the five repeat
 * *identically* is shared, and what they merely resemble stays apart. Identically shared, measured:
 * the seven identity fields, the four universal properties, the three runtimes, the way a case's
 * own data is what remains after `id`, `provenance` and `rationale`, and the hashing of the folder.
 * What is passed in per contract is what genuinely differs - the declared types, which tables exist
 * and what they are for, the profile vocabulary, and the declarations that belong to that contract
 * alone.
 *
 * Nothing here is committed to disk. An immutable snapshot of a record *is* the registry's storage,
 * and storage is the next unit; producing one now would be building it early. The record is derived
 * from the modules every time it is asked for, so it cannot drift from the contract it describes -
 * a stronger guarantee than a snapshot compared after the fact, and the reason the guards below
 * compare a record against the live modules rather than against a file.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { closureFrom, sourceNamedBy } from '../../packaging/reachable.js'

import type { ContractAddress, GuardAddress } from './address.js'
import { THE_IMAGINED_DOMAIN_PREFIX, isImagined } from './address.js'
import type {
  BenchmarksRecord,
  CaseRecord,
  CaseTableRecord,
  ContractRecord,
  ExportRecord,
  ExportRole,
  IdentityRecord,
  Lifecycle,
  OwnDeclaration,
  ProfileClassRecord,
  ProfileRecord,
  ProfileSamples,
  SupportingTypeRecord,
  UniversalPropertyRecord,
  LanguageReExamination,
  UseCaseRecord,
} from './contract-record.js'
import { canonical, digestOf, digestOfBytes, servedBytes } from './canonical.js'
import type { VerificationStratum } from './field-map.js'
import type { BatteryRecord, CaseProvenance } from './evidence.js'
import type { HarnessFile, ImplementationRecord } from './implementation-record.js'
import { resolveGuard, resolveProvenance } from './evidence.js'
import { parametersOf } from './signature.js'
import type { EncodedValue } from './value.js'
import { encode } from './value.js'
import type { CaseGroup } from '../catalogue/identifier.js'
import { groupingFaults, takenAddresses } from '../catalogue/identifier.js'

/** Anchored on this file rather than on the working directory, as `mutation/run.ts` anchors its own. */
export const REPOSITORY_ROOT = join(import.meta.dirname, '..', '..')

/** The four fields every table of every contract shares, and the only four. */
const SHARED_CASE_FIELDS = ['id', 'group', 'provenance', 'rationale'] as const

/** What a use case carries besides its call: its title, its situation, and its warning. ADR-0118. */
const SHARED_USE_CASE_FIELDS = ['name', 'situation', 'caveat'] as const

/** `samples` is here because five of five call it that, which is the catalogue's bar for naming. */
const PROFILE_FIELDS_THE_SCHEMA_NAMES = ['name', 'description', 'samples'] as const

/**
 * An export as the source declares it, which is everything but the parameter names.
 *
 * They are absent here because they are derived from the declared text rather than written beside it -
 * `signature.ts` argues it - and a source that could state them would be a second statement about one
 * fact, which is what this whole folder is written to avoid.
 */
export type ExportSource = {
  readonly name: string
  readonly typeName: string
  readonly text: string
  readonly role: ExportRole
}

export type CaseTableSource = {
  readonly name: string
  readonly purpose: string
  readonly groups: readonly CaseGroup[]
  readonly cases: readonly Readonly<Record<string, unknown>>[]
}

export type ProfileSource = {
  /** Which field of a profile carries its class. Five contracts, five names. */
  readonly classField: string
  readonly vocabulary: readonly ProfileClassRecord[]
  readonly profiles: readonly Readonly<Record<string, unknown>>[]
  /**
   * The profiles whose samples the record points at rather than carries, by name, each with the
   * expression in `contract.ts` that produces them.
   *
   * A profile absent from this map is carried. The choice is a judgement frozen with the major and
   * not a size policy - `ProfileSamples` says why - and the expression is the only transcribed thing
   * in the whole arm, guarded by occurrence in the contract's own source.
   */
  readonly producedBy?: Readonly<Record<string, string>>
}

export type OwnDeclarationSource = {
  readonly name: string
  readonly verification: VerificationStratum
  /** The guard that makes this declaration executable. Required by exactly that stratum. */
  readonly executableBy?: GuardAddress
}

/**
 * Why an export of a contract is not carried by its record. One reason, referenced five times rather
 * than written five times: it is the same sentence about the same export in every contract of the
 * catalogue, which is the catalogue's own bar for sharing something.
 */
export const SERVED_AS_A_FILE =
  'the executable half of the contract: served as a hashed file by the harness endpoint, and ' +
  'never modelled, because a record carrying the source of a function would publish code the ' +
  'registry does not run and therefore does not verify'

export type UncarriedExport = {
  readonly name: string
  readonly reason: string
}

export type ContractSource = {
  readonly address: ContractAddress
  readonly lifecycle: Lifecycle
  /**
   * How the contract is used, declared here and never in `contract.ts`. ADR-0118.
   *
   * The rows are shaped like a case table's - the prose fields, then the call - and are read by
   * `useCaseOf` rather than typed, for the reason every other row of this file is read rather than
   * typed: a declared shape and an encoded value would be two statements of one thing.
   */
  readonly useCases?: readonly Readonly<Record<string, unknown>>[]
  /**
   * Where the contract stands against a language that moved under it. ADR-0150.
   *
   * Typed directly rather than read as a bag the way `useCases` is, and the difference is that a use
   * case carries an encoded call - a declared shape beside an encoded value would be two statements
   * of one thing. A re-examination is three sentences and nothing else, so it is declared the way its
   * sibling `lifecycle` is.
   */
  readonly againstTheLanguage?: readonly LanguageReExamination[]
  /** The folder, relative to the repository root, as the instrument already addresses one. */
  readonly folder: string
  /**
   * Every file of the folder the registry serves, named. A closed list, and a security requirement
   * rather than a design preference - `harnessOf` says why in full.
   */
  readonly files: readonly string[]
  /**
   * Every file outside the folder that the files above reach, named, as repository-relative paths.
   *
   * A closed list for the same reason `files` is one, one level out - `sharedHarnessOf` says why in
   * full - and the second of the two independent statements whose disagreement is the guard.
   */
  readonly shared: readonly string[]
  /** `contract.ts` as a namespace, so that every value below is read rather than transcribed. */
  readonly module: Readonly<Record<string, unknown>>
  /**
   * Every module whose exports the record must account for: the declarative half of the folder. The
   * executable half is hashed rather than read, so its own helpers - `outcome.ts` on
   * `array/group-by@1` - are not in this list and are not silences either.
   */
  readonly declares: readonly Readonly<Record<string, unknown>>[]
  /** Exports the record does not carry, each with the reason. A silence here is a coverage failure. */
  readonly notCarried: readonly UncarriedExport[]
  readonly exports: readonly ExportSource[]
  readonly supportingTypes: readonly SupportingTypeRecord[]
  readonly caseTables: readonly CaseTableSource[]
  readonly benchmarks: ProfileSource
  readonly ownDeclarations: readonly OwnDeclarationSource[]
  /** The batteries that measure this contract, so that a provenance can be resolved rather than read. */
  readonly batteries: readonly BatteryRecord[]
}

const read = <T>(module: Readonly<Record<string, unknown>>, name: string): T => {
  const value = module[name]
  if (value === undefined) {
    throw new Error(`the contract declares no \`${name}\`, which every contract in the catalogue does`)
  }

  return value as T
}

const identityOf = (module: Readonly<Record<string, unknown>>): IdentityRecord => {
  const identity = read<Readonly<Record<string, unknown>>>(module, 'identity')
  const relation = identity['relationToTheLanguage']

  return {
    exportName: identity['exportName'] as string,
    summary: identity['summary'] as string,
    description: identity['description'] as string,
    inputDomain: identity['inputDomain'] as string,
    searchAliases: identity['searchAliases'] as readonly string[],
    // Absent from two of the five, and ADR-0009 says why that is left as a debt of those
    // two rather than repaired by transcription here.
    ...(relation === undefined ? {} : { relationToTheLanguage: relation as string }),
  }
}

/**
 * A free string becomes an address, and a mutant that no battery of this contract declares stops the
 * serialisation rather than reaching a record.
 *
 * Which battery holds the mutant is looked up rather than declared, because a contract has two
 * batteries and the case does not say which one. A mutant identifier is unique across the project -
 * the `D-` prefix exists because an earlier battery used `M17` for two different defects - so the
 * lookup has exactly one answer or the citation is wrong.
 */
const provenanceOf = (
  where: string,
  raw: string,
  contract: ContractAddress,
  batteries: readonly BatteryRecord[],
): CaseProvenance => {
  if (raw === 'specified') return { kind: 'specified' }

  const at = raw.indexOf(':')
  const kind = at === -1 ? raw : raw.slice(0, at)
  const rest = raw.slice(at + 1)

  if (kind === 'found-in-the-wild') return { kind: 'found-in-the-wild', report: rest }

  if (kind !== 'found-by-mutation') {
    throw new Error(`${where} carries the provenance "${raw}", which the catalogue does not define`)
  }

  const holding = batteries.filter((battery) => battery.mutants.includes(rest))
  if (holding.length !== 1) {
    throw new Error(
      `${where} cites the mutant "${rest}", and ${holding.length} of this contract's batteries ` +
        `declare it. A citation resolves to exactly one cell or it is not an address.`,
    )
  }

  const provenance: CaseProvenance = {
    kind: 'found-by-mutation',
    mutant: { contract, battery: (holding[0] as BatteryRecord).name, mutant: rest },
  }

  resolveProvenance(where, provenance, batteries)

  return provenance
}

/**
 * A case does not begin with the call its contract's signature declares.
 *
 * The refusal names the repair rather than the rule, because the contract's author is the person who
 * reads it and what they have to do is reorder or rename a field.
 */
export class CaseIsNotACall extends Error {
  constructor(where: string, call: readonly string[], fields: readonly string[]) {
    super(
      `${where} holds [${fields.join(', ')}], and the contract's answer is called with ` +
        `(${call.join(', ')}). A row this page renders as a call is one: its first fields are the ` +
        `arguments, named as the signature names them and in the signature's order, and everything ` +
        `after them is the answer. Without that a contract page can only list the fields side by ` +
        `side, which is a table of a call rather than the call.`,
    )
    this.name = 'CaseIsNotACall'
  }
}

/**
 * The fields of a row that a page renders as a call, with the call checked and the rest encoded.
 *
 * Written once and reached twice - by a case of block 4.4, and by a use case beside it - because both
 * are read back by `theCallOf` and rendered by one function. A second spelling of this rule here
 * would be the copy ADR-0026 refuses: not a second opinion, the same statement written where nobody
 * will maintain it.
 */
const encodedCall = (
  entry: Readonly<Record<string, unknown>>,
  shared: readonly string[],
  where: string,
  call: readonly string[],
): EncodedValue => {
  const data = Object.fromEntries(Object.entries(entry).filter(([name]) => !shared.includes(name)))
  const fields = Object.keys(data)

  if (fields.slice(0, call.length).join(',') !== call.join(',')) {
    throw new CaseIsNotACall(where, call, fields)
  }

  return encode(data, where)
}

const caseOf = (
  entry: Readonly<Record<string, unknown>>,
  table: string,
  contract: ContractAddress,
  batteries: readonly BatteryRecord[],
  call: readonly string[],
): CaseRecord => {
  const id = entry['id'] as string
  const where = `${table}#${id}`

  return {
    id,
    group: entry['group'] as string,
    provenance: provenanceOf(where, entry['provenance'] as string, contract, batteries),
    rationale: entry['rationale'] as string,
    data: encodedCall(entry, SHARED_CASE_FIELDS, where, call),
  }
}

/**
 * One use case, read the way a case is read: prose off the front, and the call encoded.
 *
 * `where` is the title rather than an identifier, because a use case carries none - `UseCaseRecord`
 * says why - so a refusal names the card its author is looking at.
 */
const useCaseOf = (
  entry: Readonly<Record<string, unknown>>,
  contract: string,
  call: readonly string[],
): UseCaseRecord => ({
  name: entry['name'] as string,
  situation: entry['situation'] as string,
  data: encodedCall(entry, SHARED_USE_CASE_FIELDS, `${contract}/useCases#${entry['name'] as string}`, call),
  caveat: entry['caveat'] as string,
})

/**
 * A table's grouping is not a partition of its cases.
 *
 * Four ways it can fail and one error for all four, because they are one question - whether every
 * heading the page renders has cases under it and every case has a heading over it - and a caller
 * needs to know which way it gave way rather than which class it belongs to.
 *
 * A case belongs to a group and a table declares its groups: ADR-0012.
 */
export class GroupingIsNotAPartition extends Error {
  constructor(where: string, fault: string) {
    super(
      `${where}: ${fault}. The groups of a table partition its cases: every case names a group the ` +
        `table declares, every declared group holds at least one case, and the cases of a group are ` +
        `contiguous because the source's order is the page's order. Without that the page renders a ` +
        `heading nothing sits under, or two headings with one title and nothing saying why.`,
    )
    this.name = 'GroupingIsNotAPartition'
  }
}

/**
 * A group identifier collides with another address of the same contract.
 *
 * Separate from the partition because the fault is not the table's: a group and a case become the
 * same `#id` on one page, so the collision is only visible from the contract, and what it produces
 * is a shared link that silently lands on the wrong element. Measured when the grouping was first
 * derived: two of the forty-eight collided with a case of their own table.
 */
export class GroupAddressIsTaken extends Error {
  constructor(contract: string, taken: readonly string[]) {
    super(
      `${contract} answers to [${taken.join(', ')}] as both a group and something else. A group and ` +
        `a case are both rendered as \`#id\` on one page, so they share one space of addresses and a ` +
        `duplicate is a link that lands on the wrong element.`,
    )
    this.name = 'GroupAddressIsTaken'
  }
}

/**
 * A contract is offered at an address reserved for a fixture.
 *
 * **It is what makes the reservation true by construction rather than by convention.** A prefix that
 * only a comment refuses is a prefix a submission can take; this is the one door a folder becomes a
 * served contract through, so refusing here is refusing everywhere - the client's local source, the
 * site's, the read API and the instrument all arrive at this function.
 *
 * It is born green and stays green until somebody addresses a contract at `imagined-…`, which is the
 * event it is written for: the fixtures of this repository hold nine such addresses, and what they
 * are worth is that nothing can ever be published on top of one. ADR-0142.
 */
export class TheAddressIsImagined extends Error {
  constructor(name: string) {
    super(
      `${name} stands in the space reserved for fixtures. A domain beginning with ` +
        `\`${THE_IMAGINED_DOMAIN_PREFIX}\` is one no contract may be published at, so that a fixture ` +
        `holding an address holds it against nothing.`,
    )
    this.name = 'TheAddressIsImagined'
  }
}

const partitionOf = (table: CaseTableSource, where: string): readonly CaseGroup[] => {
  const faults = groupingFaults(
    table.groups,
    table.cases.map((entry) => entry['group'] as string),
  )

  if (faults.length > 0) throw new GroupingIsNotAPartition(where, faults.join('; '))

  return table.groups
}

/**
 * Every address a contract page renders as `#id`, refused if two of them are the same string.
 *
 * Asked of the contract rather than of a table, because a page carries every table of a contract and
 * an anchor is unique to a document. It is the same reason a case identifier is unique per contract
 * rather than per table.
 */
const refuseTakenAddresses = (contract: string, tables: readonly CaseTableSource[]): void => {
  const taken = takenAddresses(
    tables.flatMap((table) => [
      ...table.groups.map((group) => group.id),
      ...table.cases.map((entry) => entry['id'] as string),
    ]),
  )

  if (taken.length > 0) throw new GroupAddressIsTaken(contract, taken)
}

/**
 * The samples of one profile, carried or pointed at.
 *
 * Everything in the pointing arm except the expression is read from the module rather than declared,
 * and that is the whole reason the arm is safe. A count and a digest read off the values are facts,
 * so there are not two statements about them for a record to make disagree - and a guard that
 * compared a declared size against the samples it was declared from would be comparing the contract
 * against itself.
 */
const samplesOf = (
  entry: Readonly<Record<string, unknown>>,
  where: string,
  producedBy: string | undefined,
): ProfileSamples => {
  const samples = entry['samples'] as readonly unknown[]
  const values = samples.map((sample, at) => encode(sample, `${where}.samples[${at}]`))

  if (producedBy === undefined) return { kind: 'carried', values }

  return {
    kind: 'produced',
    producedBy,
    count: values.length,
    encodedBytes: Buffer.byteLength(canonical(values, `${where}.samples`), 'utf8'),
    sha256: digestOf(values, `${where}.samples`),
  }
}

const profileOf = (
  entry: Readonly<Record<string, unknown>>,
  classField: string,
  producedBy: Readonly<Record<string, string>>,
): ProfileRecord => {
  const name = entry['name'] as string
  const named = [...PROFILE_FIELDS_THE_SCHEMA_NAMES, classField]
  const data = Object.fromEntries(Object.entries(entry).filter(([field]) => !named.includes(field)))

  return {
    name,
    description: entry['description'] as string,
    class: entry[classField] as string,
    samples: samplesOf(entry, `profile ${name}`, producedBy[name]),
    data: encode(data, `profile ${name}`),
  }
}

const benchmarksOf = (source: ProfileSource): BenchmarksRecord => ({
  vocabulary: source.vocabulary,
  profiles: source.profiles.map((entry) =>
    profileOf(entry, source.classField, source.producedBy ?? {}),
  ),
})

/**
 * A folder holds a file the registry was not told to serve, or is missing one it was.
 *
 * Both halves in one refusal, because they are one question - is the contract made of exactly what it
 * says - and a failure has to say which half gave way.
 */
export class UndeclaredHarness extends Error {
  constructor(folder: string, undeclared: readonly string[], missing: readonly string[]) {
    super(
      `${folder} is not made of the files it declares.\n` +
        (undeclared.length === 0
          ? ''
          : `  present and not served: ${undeclared.join(', ')}\n` +
            `    A file in a contract folder is a file the registry would serve to every ` +
            `installation. Anything that lands here - a build artefact, an editor backup, a ` +
            `dropped file - would be hashed into the record and shipped, which is the attack the ` +
            `whole distribution model exists to refuse.\n`) +
        (missing.length === 0 ? '' : `  served and not present: ${missing.join(', ')}\n`),
    )
    this.name = 'UndeclaredHarness'
  }
}

/**
 * Every file the registry serves for a contract, hashed - and exactly those.
 *
 * **The list is closed, and that is a security requirement rather than a design preference.** These
 * files are what an installation receives, so a folder listing decides what gets shipped. Measured:
 * a `tsc` invocation that emitted beside the sources put two `.js` files into every contract folder,
 * both entered the harness with their digests, and the whole registry suite stayed green - 110 of
 * 110 - because the only guard over the list checked that the seven expected files were *present*.
 * Reproduced deliberately with a single stray file afterwards, same result. Permanent rule 3 says
 * installations are served only from the registry's immutable snapshot; a snapshot built from
 * whatever happens to be on the disk of the machine that built it is not that snapshot.
 *
 * So the source declares the files and this refuses any disagreement in either direction. Two
 * independent statements, as `publicContract` and `FIELD_MAP` are two - a list derived from the
 * folder could not disagree with the folder.
 *
 * The digest and the byte count come from one read of one buffer. Two reads would be two answers
 * about a file that could change between them, and a record whose size and digest describe different
 * bytes is not a record of anything.
 */
export const harnessOf = (
  root: string,
  folder: string,
  files: readonly string[],
): readonly HarnessFile[] => {
  const directory = join(root, folder)
  const present = readdirSync(directory)
    .filter((name) => statSync(join(directory, name)).isFile())
    .sort()
  const served = [...files].sort()

  const undeclared = present.filter((name) => !served.includes(name))
  const missing = served.filter((name) => !present.includes(name))
  if (undeclared.length > 0 || missing.length > 0) {
    throw new UndeclaredHarness(folder, undeclared, missing)
  }

  return served.map((name) => hashedFile(directory, name))
}

/**
 * One file, read once, as the registry addresses it.
 *
 * `path` is what the record carries and `base` is where this reader found it. The two are separate
 * because a harness file is addressed inside its contract folder and a shared one from the repository
 * root, and hashing is not where those two differ.
 *
 * The digest and the byte count come from one read of one buffer. Two reads would be two answers
 * about a file that could change between them, and a record whose size and digest describe different
 * bytes is not a record of anything.
 */
const hashedFile = (base: string, path: string): HarnessFile => {
  const bytes = servedBytes(readFileSync(join(base, path)))

  return { path, sha256: digestOfBytes(bytes), bytes: bytes.byteLength }
}

export class UndeclaredSharedSurface extends Error {
  constructor(folder: string, undeclared: readonly string[], missing: readonly string[]) {
    super(
      `${folder} does not reach the shared files it declares.\n` +
        (undeclared.length === 0
          ? ''
          : `  reached and not declared: ${undeclared.join(', ')}\n` +
            `    A file a contract's own files import decides what its guards verify, so it is part ` +
            `of what the contract is. Outside the declaration it is outside the digest, which means ` +
            `it can be changed on a published contract with no address moving - the freeze holding ` +
            `to the letter and not in substance.\n`) +
        (missing.length === 0
          ? ''
          : `  declared and not reached: ${missing.join(', ')}\n` +
            `    A declaration wider than the walk freezes bytes this contract does not depend on, ` +
            `so an edit somewhere it never reads would rebind its address for nothing.\n`),
    )
    this.name = 'UndeclaredSharedSurface'
  }
}

/**
 * Everything a contract's own files import from outside its folder, transitively, hashed - and
 * exactly what it declares.
 *
 * **The walk reads sources rather than the compiler's output, and that is a decision about
 * contracts.** `packaging/reachable.ts` reads the output for the opposite reason and owns both
 * resolutions; `sourceNamedBy` is the one this asks for. A type-only import is erased from the output
 * and is *not* erased from what a contract's guards check: thirteen `@ts-expect-error` directives sit
 * in the five `signature.test-d.ts`, `npm test` runs with `--typecheck`, and a type this repository
 * could widen is one that decides those verdicts. So the closure is taken over what is written, not
 * over what survives compilation.
 *
 * **The freeze was letter-only without this, and it was measured rather than argued.** Emptying
 * `expectUniversalPropertiesAnswered` in `packages/catalogue/every-contract.ts` left all eight ledger
 * digests identical to the byte while a contract that declares `deterministic` inapplicable, which
 * that guard exists to refuse, went green. Four of the seven declared files of every contract import
 * that module, `harness` covers the seven, and nothing covered what the seven call. So a published
 * contract's verification could be disarmed with no address moving, which is the one failure permanent
 * rule 6 is sold on preventing. ADR-0105.
 *
 * **Shared data was already covered and shared code was not**, which is why this hashes files rather
 * than widening some existing check: a constant interpolated into a declaration reaches the record and
 * moves the digest - one letter changed in `NO_AMBIENT_OUTPUT_FINDING` moved all four contract digests
 * - while the functions the test files *call* reach nothing the record carries.
 *
 * The declaration and the walk are two independent statements, as `files` and the folder listing are:
 * a list derived from the walk could not disagree with the walk. The walk is what notices a contract
 * reaching somewhere new; the declaration is what notices the walk going quiet.
 */
export const sharedHarnessOf = (
  root: string,
  folder: string,
  files: readonly string[],
  shared: readonly string[],
): readonly HarnessFile[] => {
  const directory = join(root, folder)
  const outside = (file: string): string | null => {
    const path = relative(root, file).replaceAll('\\', '/')

    return path.startsWith(`${folder}/`) ? null : path
  }

  const reached = [
    ...new Set(
      files.flatMap((name) =>
        [...closureFrom(join(directory, name), sourceNamedBy)].flatMap((file) => {
          const path = outside(file)

          return path === null ? [] : [path]
        }),
      ),
    ),
  ].sort()
  const declared = [...shared].sort()

  const undeclared = reached.filter((path) => !declared.includes(path))
  const missing = declared.filter((path) => !reached.includes(path))
  if (undeclared.length > 0 || missing.length > 0) {
    throw new UndeclaredSharedSurface(folder, undeclared, missing)
  }

  return declared.map((path) => hashedFile(root, path))
}

export class ServedBytesDisagree extends Error {
  constructor(where: string, hashed: string, read: string) {
    super(
      `${where} hashed to ${hashed} when its record was built and to ${read} when it was read to be ` +
        `served. A file that changes between the two reads is a working tree being edited underneath ` +
        `an install, and serving it would hand the user bytes no digest covers.`,
    )
    this.name = 'ServedBytesDisagree'
  }
}

/**
 * The bytes of a file this repository has already hashed, read again to be served and refused if they
 * moved in between.
 *
 * `harnessOf` above takes one read to answer a digest and a size; anything that *serves* a file takes
 * a second read, and the two can disagree. It lives here rather than in whichever stand-in noticed
 * first, because it is one rule about this working tree and there are three readers of it - the
 * installer's stand-in, the generator's, and the emission that writes every file the registry serves.
 */
export const servedFileOf = (root: string, path: string, sha256: string): Buffer => {
  const bytes = servedBytes(readFileSync(join(root, path)))
  const read = digestOfBytes(bytes)
  if (read !== sha256) throw new ServedBytesDisagree(path, sha256, read)

  return bytes
}

/**
 * Every file a contract serves, addressed from the repository root.
 *
 * One function because two stand-ins and one emission ask it, and because the two lists it joins are
 * addressed differently: a harness file is named inside its contract folder and a shared one from the
 * root. A caller that joined them itself would be the place the second convention is forgotten.
 */
export const servedFilesOf = (
  folder: string,
  record: {
    readonly harness: readonly HarnessFile[]
    readonly sharedHarness: readonly HarnessFile[]
  },
): readonly HarnessFile[] => [
  ...record.harness.map((file) => ({ ...file, path: `${folder}/${file.path}` })),
  ...record.sharedHarness,
]

/**
 * The strongest stratum is the one that has to point at something.
 *
 * Both directions are refused, because both have happened in this repository under other names. A
 * declaration claiming `executable` and naming no guard is the decorative claim; an address naming a
 * guard no battery holds is the same claim after the guard was renamed. And a guard named beside a
 * *weaker* stratum would be a record saying two things at once - `one-directional` exists precisely
 * to say that a guard keeps one half - so it is refused rather than ignored.
 */
const ownDeclarationsOf = (
  module: Readonly<Record<string, unknown>>,
  sources: readonly OwnDeclarationSource[],
  where: string,
  batteries: readonly BatteryRecord[],
): readonly OwnDeclaration[] =>
  sources.map((source) => {
    const cited = `${where}.${source.name}`

    if (source.verification === 'executable') {
      if (source.executableBy === undefined) {
        throw new Error(
          `${cited} is declared executable and names no guard, so the strongest stratum in this ` +
            `schema would rest on a word. Name the guard that reddens when an implementation ` +
            `contradicts it, or classify the declaration by what actually keeps it.`,
        )
      }

      resolveGuard(cited, source.executableBy, batteries)
    } else if (source.executableBy !== undefined) {
      throw new Error(
        `${cited} is classified ${source.verification} and names a guard, which are two different ` +
          `claims about the same declaration. Only \`executable\` says a guard refuses an ` +
          `implementation that contradicts it.`,
      )
    }

    return {
      name: source.name,
      value: encode(read(module, source.name), source.name),
      verification: source.verification,
      ...(source.executableBy === undefined ? {} : { executableBy: source.executableBy }),
    }
  })

/**
 * The one implementation every contract of the catalogue has today: its own reference.
 *
 * A list of one, and the fields are an open registry's rather than this repository's, because
 * retrofitting a one-to-many relation into a published schema costs more than carrying it. What is
 * filled is what exists - the author, the file and its digest, a dependency depth that permanent rule
 * 2 fixes at zero - and what is not filled says why in its own type.
 *
 * The file list is `reference.ts` alone. It is the only file of a contract folder that becomes
 * somebody else's code; everything else is the harness, which the registry serves and the user's
 * project does not receive.
 */
export const referenceImplementationOf = (
  root: string,
  source: ContractSource,
): ImplementationRecord => {
  const files = harnessOf(root, source.folder, source.files).filter(
    (file) => file.path === 'reference.ts',
  )

  return {
    id: 'reference',
    contract: source.address,
    author: 'toopo',
    version: null,
    status: 'default',
    files,
    // Permanent rule 2: a feature depends only on other registry features and on the language. None
    // of the five imports another feature, so the list is empty and the derived depth is zero.
    dependsOn: [],
    minifiedBytes: null,
    benchmarks: [],
    tags: ['reference'],
  }
}

/**
 * The exports, each gaining the parameter names its own declared type carries.
 *
 * The answer's are what a case of block 4.4 is checked against, so they are read once here rather than
 * per table: a contract has one answer, and the call every case makes is that answer's.
 */
const surfaceOf = (
  exports: readonly ExportSource[],
): { readonly exports: readonly ExportRecord[]; readonly call: readonly string[] } => {
  const carried = exports.map((entry) => ({ ...entry, parameters: parametersOf(entry.text) }))
  const answer = carried.find((entry) => entry.role === 'the-answer')

  if (answer === undefined) {
    throw new Error(
      'the contract publishes no export in the role `the-answer`, so nothing says what its cases ' +
        'are calls to',
    )
  }

  return { exports: carried, call: answer.parameters.map((entry) => entry.name) }
}

export const serialiseContract = (root: string, source: ContractSource): ContractRecord => {
  const surface = surfaceOf(source.exports)

  if (isImagined(source.address.name)) throw new TheAddressIsImagined(source.address.name)

  refuseTakenAddresses(source.address.name, source.caseTables)

  return {
    address: source.address,
    lifecycle: source.lifecycle,
    // Absent rather than empty on a contract that declares none, which `ContractRecord` argues.
    ...(source.useCases === undefined
      ? {}
      : {
          useCases: source.useCases.map((entry) =>
            useCaseOf(entry, source.address.name, surface.call),
          ),
        }),
    // The same treatment one field along, and absent for the same reason.
    ...(source.againstTheLanguage === undefined
      ? {}
      : { againstTheLanguage: source.againstTheLanguage }),
    identity: identityOf(source.module),
    surface: {
      exports: surface.exports,
      supportingTypes: source.supportingTypes,
      ...(source.module['failureReasons'] === undefined
        ? {}
        : { failureReasons: source.module['failureReasons'] as readonly string[] }),
      ...(source.module['couplingRule'] === undefined
        ? {}
        : { couplingRule: source.module['couplingRule'] as string }),
    },
    environments: read<readonly string[]>(source.module, 'targetEnvironments'),
    properties: {
      runs: read<number>(source.module, 'propertyRuns'),
      universal: read<readonly UniversalPropertyRecord[]>(source.module, 'universalProperties').map(
        (property) => ({
          name: property.name,
          applicable: property.applicable,
          reason: property.reason,
        }),
      ),
    },
    caseTables: source.caseTables.map(
      (table): CaseTableRecord => ({
        name: table.name,
        purpose: table.purpose,
        groups: partitionOf(table, `${source.address.name}/${table.name}`),
        cases: table.cases.map((entry) =>
          caseOf(
            entry,
            `${source.address.name}/${table.name}`,
            source.address,
            source.batteries,
            surface.call,
          ),
        ),
      }),
    ),
    benchmarks: benchmarksOf(source.benchmarks),
    ownDeclarations: ownDeclarationsOf(
      source.module,
      source.ownDeclarations,
      source.address.name,
      source.batteries,
    ),
    harness: harnessOf(root, source.folder, source.files),
    sharedHarness: sharedHarnessOf(root, source.folder, source.files, source.shared),
  }
}
