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

import type { CaseGroup } from '../catalogue/identifier.js'
import type { ContractAddress, GuardAddress } from './address.js'
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
 * What an export is for. Two of the five publish a diagnostic beside the answer.
 *
 * Named rather than written inline, because a second consumer needs it: the index a client reads
 * before it can name what it installed carries the pair, and a union spelled out in two places is a
 * union that comes to disagree with itself the day a third role exists.
 */
export type ExportRole = 'the-answer' | 'the-diagnostic'

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
  readonly role: ExportRole
  /**
   * What a caller writes between the parentheses, in order.
   *
   * **Read off `text` rather than declared beside it**, by `registry/signature.ts`, which says why the
   * derivation is what makes the field affordable. It is here because a case of block 4.4 is a *call*
   * and nothing in this record could say so: `data` holds the fields of a case and the schema
   * deliberately does not interpret them, so a contract page could list `input`, `expected` and
   * `reason` as three fields of equal standing and could not render `parseNumber('  42  ')`.
   *
   * The fifth consumer found it, which is the fifth time a consumer has: measured over the five, the
   * fields of every case of all seven tables begin with these names, in this order, and what remains
   * is the answer. `serialise.ts` refuses a contract where that stops being true.
   */
  readonly parameters: readonly ParameterRecord[]
}

/**
 * One parameter of a declared signature: what a caller names it, and what it is declared to be.
 *
 * **The type is here because the ninth defect a consumer found needed it**, and it arrived free: the
 * colon that ends a name begins a type, so `signature.ts` reads both on one walk and neither is
 * declared beside the other. A `parameters` of bare names sent the site back to parsing
 * `export.text` for itself - which is the state this field was created to end.
 *
 * **What the type is for, and the refusal that keeps it honest.** The site builds an argument out of
 * what a reader types, and what it builds depends on this: `string` is the text itself, `Date` is
 * constructed from it. A type the builder does not know stops the build and names itself, the shape
 * `registry/value.ts` already takes for a value it does not model - no fallback, no empty field, no
 * page rendered with a playground quietly missing.
 */
export type ParameterRecord = {
  readonly name: string
  readonly type: string
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
  /**
   * Which group of the table this case sits under. Required, never optional: a case with no group
   * would be a silence about where it belongs, and `groups` is non-empty by the same refusal, so
   * there is always a value to give.
   */
  readonly group: string
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
 *
 * **The eighth defect a consumer has found in this schema, and the second the site found.** The
 * contracts grouped their cases in comment banners - `--- Whitespace ---`, `--- Sign ---` - and all
 * 187 cases sat inside one, between two and nine cases each. The record was flat, so a page could
 * only render fifty rows in a row: measured by printing both, fifty read as a dump and a reader
 * still could not *find* anything, while twelve sections are twelve short answers to twelve
 * questions somebody arrives with. The judgement existed in the source and its shape as data did
 * not, which is the same defect as `parameters` arriving one unit earlier - the source said
 * something the record threw away.
 *
 * The banners are gone with this field. Two statements of one grouping drift, and it is the second
 * that lies; one of the four banners carrying prose already said *five rows* over six cases.
 */
export type CaseTableRecord = {
  readonly name: string
  readonly purpose: string
  /**
   * The groups this table's cases are partitioned into, in the order the page renders them.
   *
   * Non-empty, and the partition is refused in both directions by `serialise.ts`: a case naming a
   * group the table does not declare, and a declared group no case sits in. Both would put an
   * address on the page that leads nowhere.
   */
  readonly groups: readonly CaseGroup[]
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

/**
 * The samples of one profile, carried or pointed at.
 *
 * **Why the schema names `samples` at all.** It is the one field of a profile beyond the three
 * already named that all five contracts call by the same name, with the same role - measured, five of
 * five, over five vocabularies that share nothing else. That is the catalogue's own bar for naming
 * something, and letting it fall into `data` would throw away a measurement.
 *
 * **Why there are two arms.** A contract may write its samples or produce them, and four of the five
 * produce at least one - `.repeat`, `range`, `wordOfLength`, `repeated`; only `date/add@1` is
 * entirely written. The frontier this record is built on is why the second arm cannot be avoided:
 * `range` is a function, so by the time the registry reads a module the fifty thousand numbers are
 * there and the three lines that made them are not. A record can hold the numbers or nothing.
 *
 * So the second arm holds neither, and holds instead what makes the omission checkable: the
 * expression, the count, the size of what was left out, and the digest of the canonical encoding the
 * first arm would have carried. A reader fetches `contract.ts` - already served, already hashed -
 * evaluates it, re-encodes, and compares. Nothing has to be taken on trust.
 *
 * **The union is written before anything is published, and that is the whole reason it is written
 * now.** Adding an arm to a union a caller switches on is a breaking change, so a record that shipped
 * with one arm would cost `name@2` across the catalogue the first time a contract needed the other.
 *
 * **Which arm a profile uses is a judgement, made once, and frozen with the major.** It is not a size
 * policy: a threshold would let a contract's record change shape because it gained an argument, and
 * the shape of a record is exactly what publication freezes. The judgement is stated instead - a
 * sample is carried when a reader is better served by the value than by the expression that produced
 * it - and measured, that flips between 3.1 kB and 7.3 kB of encoded samples. Six profiles of the
 * five sit above it and twenty-two below, and the six are the six whose values are repetition.
 */
export type ProfileSamples =
  /** Carried. Twenty-two of the twenty-eight profiles of the five. */
  | { readonly kind: 'carried'; readonly values: readonly EncodedValue[] }
  /**
   * Pointed at. Six of the twenty-eight: the five generated profiles of `array/group-by@1`, whose
   * samples encode to 1.73 MB each for three of them, and `long-inputs` of `number/parse@1`, whose
   * value is five thousand zeros and whose expression says so in eleven characters.
   */
  | {
      readonly kind: 'produced'
      /**
       * The expression in the contract's own `contract.ts` that produces them, transcribed.
       *
       * The one transcribed thing in this arm, and therefore the only one that can be wrong.
       * `against-the-five.test.ts` requires it to occur in that file, whitespace normalised - the
       * discipline a declared type already carries - so a contract that replaced `range(50_000)` with
       * fifty thousand literals would take the text with it and redden the guard. What that does not
       * catch is a text that survives for another reason: the same expression written twice, or left
       * behind in a comment. Recorded as `one-directional` in `field-map.ts` for exactly that gap.
       *
       * **It does not close before the launch, and it is the assumed price of this arm.** Tying an
       * expression to the samples of one particular profile would mean evaluating it, and the
       * frontier this record is built on is precisely that a generator is a function the registry
       * cannot hold - so any stronger guard would have to re-run the contract's own module and
       * compare it with itself. Requiring the transcribed texts to be distinct within a contract
       * would close it and would force a lie, because the instance in the five is two profiles that
       * genuinely draw the same three ranges.
       */
      readonly producedBy: string
      /** Read from the module. How many samples the expression produced. */
      readonly count: number
      /** Read from the module. The size of the omission, in bytes of canonical encoding. */
      readonly encodedBytes: number
      /** Read from the module. The digest of the canonical encoding of the carried arm. */
      readonly sha256: string
    }

export type ProfileRecord = {
  readonly name: string
  readonly description: string
  /** The class every sample of this profile must belong to, from the vocabulary above. */
  readonly class: string
  readonly samples: ProfileSamples
  /**
   * Everything else the profile declares, by the same rule `CaseRecord.data` follows: what is left
   * after the fields the schema names. Empty for four of the five; `array/group-by@1` leaves the key
   * function its samples are grouped under, because half of its behaviour arrives as a function and a
   * profile that named only its array would leave the expensive half of the call to whoever runs the
   * benchmark.
   */
  readonly data: EncodedValue
}

/**
 * Block 4.5, and the one place where the code/data frontier has a size you can measure.
 *
 * Measured over the five, as the canonical text of a whole record in bytes - which is the form a
 * digest is taken over, and therefore the only size worth publishing. `array/group-by@1` writes
 * `range(50_000)` three times, and its record was **5.22 MB, of which 99.2 per cent was this
 * block**, before `ProfileSamples` gained its second arm. With the six large profiles pointed at
 * rather than carried, the five records are 32.1, 49.6, 44.6, 32.1 and 41.7 kB and block 4.5 is
 * between 7.5 and 35.8 per cent of each. The one that used to be a hundred times the size of the
 * others is now the third largest.
 *
 * What the six omit, measured: 1730.6, 1730.6, 1730.3, 100.4, 13.7 and 6.9 kB. Two of those digests
 * are equal - `one-group-per-element` and `single-group` really do draw the same three ranges - which
 * is the same fact from underneath as the transcription gap `the-five.ts` names beside them.
 *
 * **An earlier version of this comment published 71-152 kB, 24.2 MB and 99.4 per cent, and none of
 * the three reproduces.** Measured again three ways on the records those figures described: flat
 * gives 32.2-49.7 kB, 5.22 MB and 99.2 per cent; two-space indent gives 52.5-113.6 kB, 19.92 MB and
 * 93.4 per cent; four-space indent gives 70.8-172.1 kB, 33.72 MB and 92.4 per cent. No serialisation
 * produces that triple, and the share and the sizes cannot have come from one measurement - 99.4 per
 * cent belongs to the flat family and 71-152 kB does not. Which figure was intended is not
 * recoverable and is not worth guessing; what is recoverable is the rule it breaks, so it is written
 * here rather than quietly replaced: **a published size names the serialisation it was taken under**,
 * because there are three and they differ by a factor of six.
 */
/**
 * **This record carried a `measurements` list and no longer does.** It held the same fact as
 * `BenchmarkFigure` on the implementation - a profile, an environment, a figure, the machine and the
 * date - keyed from the contract instead of from the implementation, with an implementation id beside
 * it. Two models of one measurement, both empty on all five, and only one of them ever served: a
 * benchmark figure belongs to the implementation it was measured on, which is where the comparison
 * that justifies an implementation list happens.
 *
 * It went for a second reason as well. That id was the last place in this folder where a type named
 * something by its identifier alone, and an identifier here is unique *within its contract* - the rule
 * the catalogue has now learned three times, on cases, on guards, and on the read API's
 * `/implementations/{id}@{version}`.
 */
export type BenchmarksRecord = {
  readonly vocabulary: readonly ProfileClassRecord[]
  readonly profiles: readonly ProfileRecord[]
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
  /**
   * The guard that makes an `executable` declaration executable, resolvable rather than asserted.
   *
   * Optional because only `executable` carries one: the weaker strata name what *cannot* be
   * established, and pointing at a guard would be claiming the opposite. `serialise.ts` refuses the
   * two ways that could go wrong - an `executable` declaration with no guard, and an address naming a
   * guard no battery holds.
   */
  readonly executableBy?: GuardAddress
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
