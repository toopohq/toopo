/** What the registry holds about one contract at one major version. ADR-0002, ADR-0003, ADR-0006. */

import type { CaseGroup } from '../catalogue/identifier.js'
import type { ContractAddress, GuardAddress } from './address.js'
import type { EncodedValue } from './value.js'
import type { CaseProvenance } from './evidence.js'
import type { HarnessFile } from './implementation-record.js'
import type { VerificationStratum } from './field-map.js'

// --- Lifecycle - two retirements, not one ---

/** The two retirements are decided apart: only one of them has callers to keep. ADR-0007. */
export type Lifecycle =
  | { readonly state: 'not-yet-published' }
  | {
      readonly state: 'never-published'
      readonly decidedAgainst: string
      readonly measurement: string
      readonly keptAs: string
    }
  | { readonly state: 'published' }
  /** No contract fills this arm; a written rule authorises it rather than a measurement. ADR-0007. */
  | {
      readonly state: 'absorbed-by-the-language'
      readonly answeredBy: string
      readonly measurement: string
    }

// --- Block 4.1 - identity ---

/** Shape and never judgement, which is what keeps it out of being a lint over prose. ADR-0008. */
export const isASentence = (value: string): boolean => /^[A-Z][\s\S]*[.!?]$/.test(value)

/** `unknown` because a record and the frozen contract a page is built from are one shape. ADR-0008. */
export const stringsIn = (value: unknown, into: Set<string> = new Set()): ReadonlySet<string> => {
  if (typeof value === 'string') into.add(value)
  else if (Array.isArray(value)) for (const entry of value) stringsIn(entry, into)
  else if (typeof value === 'object' && value !== null) {
    for (const entry of Object.values(value)) stringsIn(entry, into)
  }

  return into
}

/** Seven fields at five of five, and one optional because two contracts owe it. ADR-0009. */
export type IdentityRecord = {
  readonly exportName: string
  readonly summary: string
  readonly description: string
  readonly inputDomain: string
  /** A query whose best answer is this contract, and the one field here that is not frozen. ADR-0023. */
  readonly searchAliases: readonly string[]
  /** Where a contract diverges, a guard replays the divergence rather than asserting it. ADR-0022. */
  readonly relationToTheLanguage?: string
}

// --- Block 4.2 - the declared surface ---

/** Named once because the served index reads the same union. ADR-0016. */
export type ExportRole = 'the-answer' | 'the-diagnostic'

export type ExportRecord = {
  readonly name: string
  readonly typeName: string
  /** Transcribed, and guarded by having to occur in the contract's own source. ADR-0010. */
  readonly text: string
  readonly role: ExportRole
  /** Read off `text`, never declared beside it: a case of block 4.4 is a call. ADR-0011. */
  readonly parameters: readonly ParameterRecord[]
}

export type ParameterRecord = {
  readonly name: string
  readonly type: string
}

export type SupportingTypeRecord = {
  readonly name: string
  readonly text: string
}

export type SurfaceRecord = {
  readonly exports: readonly ExportRecord[]
  readonly supportingTypes: readonly SupportingTypeRecord[]
  /** Absent on a total contract: an empty set declares a literal nobody can receive. ADR-0016. */
  readonly failureReasons?: readonly string[]
  /** Present exactly when a diagnostic is, and it is what stops the two exports drifting. ADR-0016, ADR-0020. */
  readonly couplingRule?: string
}

// --- Block 4.3 - the universal properties ---

export type UniversalPropertyRecord = {
  readonly name: string
  readonly applicable: boolean
  readonly reason: string
}

export type PropertiesRecord = {
  /** A floor and not a value, whose own justification the registry cannot serve. ADR-0015. */
  readonly runs: number
  readonly universal: readonly UniversalPropertyRecord[]
}

// --- Block 4.4 - the named and settled edge cases ---

export type CaseRecord = {
  /** A name, frozen with the major, never a rendering of the row it addresses. ADR-0017. */
  readonly id: string
  /** Required, because a case with no group would be a silence about where it belongs. ADR-0012. */
  readonly group: string
  readonly provenance: CaseProvenance
  readonly rationale: string
  /** Where the schema stops understanding a contract: rendered, never interpreted. ADR-0004. */
  readonly data: EncodedValue
}

/** Plural, because two contracts separate their tables and flattening loses that. ADR-0012. */
export type CaseTableRecord = {
  readonly name: string
  readonly purpose: string
  readonly groups: readonly CaseGroup[]
  readonly cases: readonly CaseRecord[]
}

// --- Block 4.5 - the benchmark profiles ---

/** One class of the contract's own vocabulary. Five contracts, five vocabularies. ADR-0004. */
export type ProfileClassRecord = {
  readonly name: string
  readonly meaning: string
}

/** Both arms ship before publication: adding one later is a breaking change. ADR-0013. */
export type ProfileSamples =
  | { readonly kind: 'carried'; readonly values: readonly EncodedValue[] }
  | {
      readonly kind: 'produced'
      /** The only transcribed value here, and the only one that can be wrong. ADR-0013. */
      readonly producedBy: string
      readonly count: number
      readonly encodedBytes: number
      readonly sha256: string
    }

export type ProfileRecord = {
  readonly name: string
  readonly description: string
  readonly class: string
  readonly samples: ProfileSamples
  /** What is left after the fields the schema names, by `CaseRecord.data`'s rule. ADR-0004. */
  readonly data: EncodedValue
}

/** A vocabulary and its profiles, and no list of timings: a figure needs a machine. ADR-0014. */
export type BenchmarksRecord = {
  readonly vocabulary: readonly ProfileClassRecord[]
  readonly profiles: readonly ProfileRecord[]
}

// --- What the schema does not interpret ---

/** The largest thing the five contain and the schema does not understand. ADR-0004. */
export type OwnDeclaration = {
  readonly name: string
  readonly value: EncodedValue
  readonly verification: VerificationStratum
  /** Carried only by `executable`, where a weaker stratum naming a guard would claim the opposite. ADR-0005. */
  readonly executableBy?: GuardAddress
}

// --- The record ---

export type ContractRecord = {
  readonly address: ContractAddress
  readonly lifecycle: Lifecycle
  readonly identity: IdentityRecord
  readonly surface: SurfaceRecord
  readonly environments: readonly string[]
  readonly properties: PropertiesRecord
  readonly caseTables: readonly CaseTableRecord[]
  readonly benchmarks: BenchmarksRecord
  readonly ownDeclarations: readonly OwnDeclaration[]
  /** The executable half, as files with their hashes: served, hashed, never modelled. ADR-0003. */
  readonly harness: readonly HarnessFile[]
  /**
   * What the harness imports and the contract does not own, hashed the same way. ADR-0105.
   *
   * Repository-relative, where `harness` is folder-relative, because these files are outside any one
   * contract and shared by all of them. Frozen for the reason the harness is: they decide what a
   * published contract's guards actually verify, and a check that is not in the digest is one that
   * can be emptied under a frozen address.
   */
  readonly sharedHarness: readonly HarnessFile[]
}
