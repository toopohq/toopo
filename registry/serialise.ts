/**
 * How a contract folder becomes a registry record.
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
import { join } from 'node:path'

import type { ContractAddress } from './address.js'
import type {
  BenchmarksRecord,
  CaseRecord,
  CaseTableRecord,
  ContractRecord,
  ExportRecord,
  IdentityRecord,
  Lifecycle,
  OwnDeclaration,
  ProfileClassRecord,
  ProfileRecord,
  ProfileSamples,
  SupportingTypeRecord,
  UniversalPropertyRecord,
} from './contract-record.js'
import { canonical, digestOf, digestOfBytes, servedBytes } from './canonical.js'
import type { VerificationStratum } from './field-map.js'
import type { BatteryRecord, CaseProvenance } from './evidence.js'
import type { HarnessFile, ImplementationRecord } from './implementation-record.js'
import { resolveProvenance } from './evidence.js'
import { encode } from './value.js'

/** Anchored on this file rather than on the working directory, as `mutation/run.ts` anchors its own. */
export const REPOSITORY_ROOT = join(import.meta.dirname, '..')

/** The three fields every table of every contract shares, and the only three. */
const SHARED_CASE_FIELDS = ['id', 'provenance', 'rationale'] as const

/** `samples` is here because five of five call it that, which is the catalogue's bar for naming. */
const PROFILE_FIELDS_THE_SCHEMA_NAMES = ['name', 'description', 'samples'] as const

export type CaseTableSource = {
  readonly name: string
  readonly purpose: string
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
  /** The folder, relative to the repository root, as the instrument already addresses one. */
  readonly folder: string
  /**
   * Every file of the folder the registry serves, named. A closed list, and a security requirement
   * rather than a design preference - `harnessOf` says why in full.
   */
  readonly files: readonly string[]
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
  readonly exports: readonly ExportRecord[]
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
    // Absent from two of the five, and `contract-record.ts` says why that is left as a debt of those
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

const caseOf = (
  entry: Readonly<Record<string, unknown>>,
  table: string,
  contract: ContractAddress,
  batteries: readonly BatteryRecord[],
): CaseRecord => {
  const id = entry['id'] as string
  const where = `${table}#${id}`
  const data = Object.fromEntries(
    Object.entries(entry).filter(([name]) => !SHARED_CASE_FIELDS.includes(name as 'id')),
  )

  return {
    id,
    provenance: provenanceOf(where, entry['provenance'] as string, contract, batteries),
    rationale: entry['rationale'] as string,
    data: encode(data, where),
  }
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

  return served.map((name) => {
    const bytes = servedBytes(readFileSync(join(directory, name)))

    return { path: name, sha256: digestOfBytes(bytes), bytes: bytes.byteLength }
  })
}

const ownDeclarationsOf = (
  module: Readonly<Record<string, unknown>>,
  sources: readonly OwnDeclarationSource[],
): readonly OwnDeclaration[] =>
  sources.map((source) => ({
    name: source.name,
    value: encode(read(module, source.name), source.name),
    verification: source.verification,
  }))

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

export const serialiseContract = (root: string, source: ContractSource): ContractRecord => ({
  address: source.address,
  lifecycle: source.lifecycle,
  identity: identityOf(source.module),
  surface: {
    exports: source.exports,
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
      cases: table.cases.map((entry) =>
        caseOf(entry, `${source.address.name}/${table.name}`, source.address, source.batteries),
      ),
    }),
  ),
  benchmarks: benchmarksOf(source.benchmarks),
  ownDeclarations: ownDeclarationsOf(source.module, source.ownDeclarations),
  harness: harnessOf(root, source.folder, source.files),
})
