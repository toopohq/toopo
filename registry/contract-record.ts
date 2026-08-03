/**
 * What the registry holds about one contract at one major version.
 *
 * Every field below is filled from one of the five, and the two that are not say so in their own
 * comment together with the written requirement that authorises them. A schema that provides for what
 * might be needed is a schema nobody measured, and the five were written by hand precisely so that
 * this one could be measured instead of guessed.
 *
 * **The frontier this record is built on.** A contract's *declarative* content is modelled here; its
 * *executable* content is served as hashed files and never modelled. `outputsAreEqual`, the key
 * functions of `array/group-by@1`, the bodies of the properties and the arbitraries they draw from
 * are all of the second kind. That is not a limit of the schema, it is its shape: a record that
 * carried the source of a function would publish code the registry does not run, and therefore does
 * not verify, which is the opposite of what this catalogue sells. §6.2 of the project specification
 * had already separated the two endpoints - the definition and the harness - and this record arrives
 * at the same line from underneath.
 *
 * **What the frontier costs, named here because nothing else names it.** A contract of higher order
 * carries cases whose *input* is a function. `array/group-by@1` has thirty of them. The playground
 * the site is meant to pre-fill with a contract's edge cases cannot pre-fill those: a function is not
 * a value a browser form holds. So the playground of a higher-order contract covers part of its
 * table and never all of it, and that is a consequence of this frontier rather than of the site's
 * implementation. It is better known now than while building the site.
 *
 * **Where the language sits.** The *shape* of this record is language-neutral and its *content* is
 * TypeScript: a declared type is TypeScript source, `environments` is a vocabulary of JavaScript
 * runtimes, and the encoded values of block 4.4 are JavaScript values. Nothing here pretends
 * otherwise. What is neutral is the address, which carries a language coordinate so that a second
 * language never has to rename the first one's addresses.
 */

import type { ContractAddress } from './address.js'
import type { EncodedValue } from './value.js'
import type { CaseProvenance } from './evidence.js'
import type { HarnessFile } from './implementation-record.js'
import type { VerificationStratum } from './field-map.js'

// ---------------------------------------------------------------------------
// Lifecycle - two retirements, not one
// ---------------------------------------------------------------------------

/**
 * Where a contract stands with respect to publication.
 *
 * Four states, and the two retirements are deliberately not one. A contract that was decided against
 * before it ever shipped has no callers and no immutability obligation; a contract the language later
 * absorbed has both. Collapsing them would either strand the first in a catalogue it was refused
 * from, or let the second read as never having existed - and a published version is frozen for life
 * and served for ever, whatever the language does afterwards.
 */
export type Lifecycle =
  /** Written, verified, not yet published. Four of the five. */
  | { readonly state: 'not-yet-published' }
  /**
   * Written and decided against before publication. One of the five: `array/group-by@1`, whose
   * `catalogueAdmission` carries the decision, the measurement it rests on and what the contract is
   * kept for. Nothing was ever served, so nothing is frozen.
   */
  | {
      readonly state: 'never-published'
      readonly decidedAgainst: string
      readonly measurement: string
      readonly keptAs: string
    }
  /**
   * Published, immutable, served. None of the five today, and it is here because permanent rule 6 is
   * the reason this registry exists: "a published version is frozen for life". A schema with no state
   * for the normal case would not be a registry schema.
   */
  | { readonly state: 'published' }
  /**
   * Published, then answered by the language itself. Still immutable, still served for ever, and
   * flagged as such rather than left to rot in silence.
   *
   * **The one field in this record that no contract fills**, and it is authorised by a written rule
   * rather than by a measurement. The rule is the one `array/group-by@1` established and `CLAUDE.md`
   * records: "the language moves, so the catalogue re-examines itself against it. Clearing rule 7 is
   * not a property a contract acquires once and keeps." A contract that clears rule 7 today and is
   * absorbed tomorrow cannot be unpublished - permanent rule 6 forbids it - so the only honest thing
   * the catalogue can do is say so on its page. Without this state the rule has no consequence any
   * reader can see, which is the definition of a decorative rule.
   *
   * `array/group-by@1` is the shape of the thing without being an instance of it: it was refused
   * *before* publication for exactly this reason, on exactly this measurement. Had it shipped first,
   * it would be here.
   */
  | {
      readonly state: 'absorbed-by-the-language'
      /** What the language ships that answers this contract, and where. */
      readonly answeredBy: string
      /** The measurement that established it, replayable in the way `language.test.ts` is. */
      readonly measurement: string
    }

// ---------------------------------------------------------------------------
// Block 4.1 - identity
// ---------------------------------------------------------------------------

/**
 * The seven fields `contractAnatomy` measured present in five of five, and the eighth it measured at
 * three of five.
 *
 * `relationToTheLanguage` is optional here rather than required, and the optionality is a measurement
 * rather than a convenience: it is missing from exactly the two contracts that also owe the
 * divergence replay, and `CLAUDE.md` records that as one debt with two symptoms. A schema that
 * required it would force the debt closed by transcription, which is the one repair that proves
 * nothing.
 */
export type IdentityRecord = {
  readonly exportName: string
  readonly summary: string
  readonly description: string
  readonly inputDomain: string
  readonly searchAliases: readonly string[]
  readonly relationToTheLanguage?: string
}

// ---------------------------------------------------------------------------
// Block 4.2 - the declared surface
// ---------------------------------------------------------------------------

/**
 * One export of a contract, with the type it must expose.
 *
 * `text` is TypeScript source and it is transcribed rather than derived, because a type is not a
 * value and nothing at run time can read it. Transcription drifts, so it is guarded:
 * `against-the-five.test.ts` requires this exact declaration to occur in the contract's own
 * `contract.ts`, whitespace normalised. A signature is the first thing a reader of a contract page
 * looks at, so it has to be in the record; being in the record it has to be checkable, and it is.
 */
export type ExportRecord = {
  readonly name: string
  readonly typeName: string
  readonly text: string
  /** What this export is for. Two of the five publish a diagnostic beside the answer. */
  readonly role: 'the-answer' | 'the-diagnostic'
}

/** A type the signature refers to. One of the five needs one: `Duration` on `date/add@1`. */
export type SupportingTypeRecord = {
  readonly name: string
  readonly text: string
}

export type SurfaceRecord = {
  readonly exports: readonly ExportRecord[]
  readonly supportingTypes: readonly SupportingTypeRecord[]
  /**
   * The reason set, frozen with the major. Two of the five publish one; a total contract has none,
   * and declaring an empty one would declare a literal no caller can ever receive.
   */
  readonly failureReasons?: readonly string[]
  /** The promise that the two exports cannot drift. Present exactly when a diagnostic is. */
  readonly couplingRule?: string
}

// ---------------------------------------------------------------------------
// Block 4.3 - the universal properties
// ---------------------------------------------------------------------------

export type UniversalPropertyRecord = {
  readonly name: string
  readonly applicable: boolean
  readonly reason: string
}

export type PropertiesRecord = {
  /**
   * The number of draws every property of this contract is tested on. A floor, not a value: official
   * validation may draw more, nothing may draw fewer.
   *
   * The measurement that chose it - three draw counts and three durations - is required of every
   * contract by `contractAnatomy` and lives in a JSDoc comment in all five. It is not carried here,
   * and that is a debt of the contracts rather than a decision of this schema: a published figure
   * whose justification the registry cannot serve is a figure a reader has to take on trust.
   */
  readonly runs: number
  /** The catalogue's four names, in the catalogue's order, each answered. Five of five. */
  readonly universal: readonly UniversalPropertyRecord[]
}

// ---------------------------------------------------------------------------
// Block 4.4 - the named and settled edge cases
// ---------------------------------------------------------------------------

/**
 * One case. Three fields are the catalogue's and are the only three the five tables share - measured
 * by `every-contract.ts`, which says so in as many words - and the fourth is everything else the case
 * holds, encoded rather than modelled.
 *
 * `data` is where this schema stops understanding a contract, and saying so is more useful than
 * inventing a vocabulary that fits none of the five. The registry renders it; it does not interpret
 * it. What that costs is that no query can ever ask "which cases answer null", because the registry
 * does not know which field is the answer.
 */
export type CaseRecord = {
  readonly id: string
  readonly provenance: CaseProvenance
  readonly rationale: string
  readonly data: EncodedValue
}

/**
 * A table of block 4.4. Plural, because block 4.4 is not one table: `date/add@1` carries a typed and
 * an untyped one, and `array/group-by@1` carries a typed one and a table of inputs no TypeScript
 * caller can write. Flattening them into one array would lose the distinction those two contracts
 * went out of their way to make, and a case identifier is unique across a contract rather than across
 * a table, so nothing is gained by the flattening either.
 */
export type CaseTableRecord = {
  readonly name: string
  readonly purpose: string
  readonly cases: readonly CaseRecord[]
}

// ---------------------------------------------------------------------------
// Block 4.5 - the benchmark profiles
// ---------------------------------------------------------------------------

/**
 * One class of the contract's own profile vocabulary, with what it claims about a sample.
 *
 * Five contracts produced five vocabularies with no overlap, which `contractAnatomy` records as the
 * clearest thing in the catalogue that must never be mutualised. So the vocabulary is data of the
 * contract, and the registry stores the names without knowing what they mean.
 */
export type ProfileClassRecord = {
  readonly name: string
  readonly meaning: string
}

export type ProfileRecord = {
  readonly name: string
  readonly description: string
  /** The class every sample of this profile must belong to, from the vocabulary above. */
  readonly class: string
  /**
   * Everything else the profile declares, by the same rule `CaseRecord.data` follows: what is left
   * after the fields the schema names. Four of the five leave the samples; `array/group-by@1` leaves
   * the samples and the key function they are grouped under, because half of its behaviour arrives
   * as a function and a profile that named only its array would leave the expensive half of the call
   * to whoever runs the benchmark.
   */
  readonly data: EncodedValue
}

/**
 * A measured figure for one profile, on one environment, for one implementation.
 *
 * **Empty for all five, and that is the state they will be published in.** Block 4.5 is declared as
 * data and nothing in this repository executes or measures it: there is no reference machine, and a
 * number produced on a developer laptop would be dishonest. The type makes "declared but never
 * measured" an empty list rather than a null figure, because that is what it is - no measurement has
 * been taken, as opposed to a measurement that came back empty.
 */
export type ProfileMeasurement = {
  readonly profile: string
  readonly environment: string
  readonly implementation: string
  readonly nanosecondsPerCall: number
  /** When and on what. A figure with no machine behind it is the thing this project sells against. */
  readonly referenceMachine: string
  readonly measuredOn: string
}

/**
 * Block 4.5, and the one place where the code/data frontier has a size you can measure.
 *
 * A benchmark sample is data, so the record carries it - and a contract may *generate* its samples.
 * Measured over the five: four of them write their samples as literals and their whole records come
 * to between 71 and 152 kilobytes. `array/group-by@1` writes `range(50_000)` three times, and its
 * record is **24.2 megabytes, of which 99.4 per cent is this block**. The encoding accounts for some
 * of it - between 1.6 and 4.4 times the raw JSON, since every leaf becomes a tagged record - but the
 * size is the samples, not the tagging.
 *
 * The frontier is why it cannot be helped here: `range` is a function, so the record can hold the
 * fifty thousand numbers or nothing, never the three lines that produced them. What that costs is a
 * real question for the read API and for the site, and it is a question about *transport* rather than
 * about this schema - so it is measured here and left for the unit that serves records. The contract
 * that provokes it will never be published, which makes it a warning rather than a bill.
 */
export type BenchmarksRecord = {
  readonly vocabulary: readonly ProfileClassRecord[]
  readonly profiles: readonly ProfileRecord[]
  readonly measurements: readonly ProfileMeasurement[]
}

// ---------------------------------------------------------------------------
// What the schema does not interpret
// ---------------------------------------------------------------------------

/**
 * A declaration that belongs to one contract and to no other.
 *
 * This is the largest single thing the five contain and the schema does not understand. Of the
 * exports the five publish, `contractAnatomy` measured that seven are shared by all of them and that
 * no other is carried by more than two - so most of what each contract says is its own:
 * `metricAxioms`, `theRule`, `keyFunctionRules`, `applicationOrder`, `ambientTimeZoneProbes`,
 * `staticAnalysisRequirements`, `ecosystem`, `composeInsteadOfConfiguring`, `lossiness`, `countedIn`,
 * `comparedAsWritten`, `outputAlphabet`, `keyEquality`, `inputIsReadBy`.
 *
 * They are carried as named encoded values, and the registry renders them without knowing what they
 * mean. The alternative was measured and refused: a vocabulary that fitted all fourteen would be a
 * vocabulary invented here rather than found in the contracts, and `BenchmarkProfile` is the
 * catalogue's own record of what that costs - it looked shared after two contracts and was not.
 *
 * The cost is stated rather than hidden. A contract page renders these generically, so the site
 * cannot lay `theRule` out as six numbered steps unless it learns what `theRule` is; and no search
 * can reach inside them. Whether the registry should learn a vocabulary for them is a question the
 * site will answer, not this unit.
 */
export type OwnDeclaration = {
  readonly name: string
  readonly value: EncodedValue
  /**
   * What refuses a wrong value here. It is on the declaration rather than in `field-map.ts` because
   * this is the one place in the schema where the meaning of a field genuinely depends on the
   * contract that holds it: `metricAxioms` is refused by a guard that requires every axiom to be
   * answered by a property, `outputAlphabet` is the one-directional case GS-11 measures, and
   * `ecosystem` is prose about four libraries this repository does not depend on.
   */
  readonly verification: VerificationStratum
}

// ---------------------------------------------------------------------------
// The record
// ---------------------------------------------------------------------------

export type ContractRecord = {
  readonly address: ContractAddress
  readonly lifecycle: Lifecycle
  readonly identity: IdentityRecord
  readonly surface: SurfaceRecord
  /** The runtimes the contract is written for. Five of five carry the same three. */
  readonly environments: readonly string[]
  readonly properties: PropertiesRecord
  readonly caseTables: readonly CaseTableRecord[]
  readonly benchmarks: BenchmarksRecord
  readonly ownDeclarations: readonly OwnDeclaration[]
  /**
   * The executable half, as files with their hashes. This is where `outputsAreEqual`, the key
   * functions, the properties and the arbitraries live: served, hashed, never modelled.
   */
  readonly harness: readonly HarnessFile[]
}
