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
 * ---------------------------------------------------------------------------
 * The register of a prose field, settled: a paragraph is a sentence
 * ---------------------------------------------------------------------------
 *
 * **A string this record carries that a page prints as a paragraph of its own opens like a sentence
 * and ends in a full stop.** It is not a style preference: a paragraph is a block, and a block that
 * reads as a fragment is a block the reader has to attach to the one above it - the class
 * `no-element-runs-into-the-one-beside-it` is written for, one level down, where the two things run
 * together inside one string instead of across two elements.
 *
 * The register was decided by a census rather than by taste. Over the four contracts the registry
 * serves, `summary`, `description` and `inputDomain` are sentences twelve times out of twelve; of the
 * four `relationToTheLanguage` values ever written, the one that is a sentence is `array/group-by@1`'s
 * and it agrees with all twelve, while the three clauses are the exception. The alternative - declare
 * the field a clause and let the page frame it, as the page already frames `couplingRule` and a
 * table's `purpose` - is refused by the same census: `array/group-by@1`'s value is *two* sentences, so
 * no frame fits it, and a frame that fitted would have to be re-decided for prose that is already
 * written.
 *
 * **What keeps it is two guards, and they are a partition rather than a pair.** A value is standing
 * alone or it is embedded, and nothing else. `a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence`
 * in `packages/site/pages.test.ts` takes every string this record carries and asks it of each one that is the
 * whole reading of a paragraph - 212 of them today, derived from the page and the record, so a prose
 * field added tomorrow is covered with nothing edited here.
 * `a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands` in
 * `packages/registry/against-the-five.test.ts` takes the other half: a value the catalogue shares between
 * contracts is composed into a longer string, so no field-shaped guard can see its seam.
 *
 * The limit is declared rather than discovered: **a contract the catalogue refused has no page**, so
 * nothing asks this of `array/group-by@1`'s prose. That is the limit every guard about a page already
 * has, and it is the right one here - a clause is not wrong in a record, it is wrong rendered as a
 * paragraph.
 */

/**
 * The register itself, as a predicate: it opens like a sentence and it ends like one.
 *
 * Shape and nothing else, which is what separates it from a lint over prose. *Is this well written* is
 * a judgement and would be the class `CLAUDE.md` prices and refuses; *does this begin with a capital
 * and end in a full stop* is decidable, is the whole of what a rendering needs, and cannot be wrong
 * about what it claims.
 *
 * The one refusal it can make wrongly is named rather than left to be met: a sentence that legitimately
 * opens on a lower-case identifier. Five exist in this catalogue's prose today - `parseFloat("1.2.3")
 * answers…`, `luxon…` - and all five are mid-string, where nothing asks. A paragraph that opened that
 * way would be refused and would have to be rewritten, which is the loud direction and the cheap one.
 */
export const isASentence = (value: string): boolean => /^[A-Z][\s\S]*[.!?]$/.test(value)

/**
 * Every string a record carries, at any depth.
 *
 * Both guards of the register need it and neither may own it, so it is here, beside the rule. It takes
 * `unknown` for the reason `pathsIn` does: a `ContractRecord` and the `FrozenContract` a page is built
 * from are two types over one shape, and the walk is about the shape. Nothing is skipped and no field
 * is named - a walk that knew which fields hold prose would be the list this rule exists without.
 */
export const stringsIn = (value: unknown, into: Set<string> = new Set()): ReadonlySet<string> => {
  if (typeof value === 'string') into.add(value)
  else if (Array.isArray(value)) for (const entry of value) stringsIn(entry, into)
  else if (typeof value === 'object' && value !== null) {
    for (const entry of Object.values(value)) stringsIn(entry, into)
  }

  return into
}

/**
 * The seven fields `contractAnatomy` measured present in five of five, and the eighth it measured at
 * three of five.
 *
 * `relationToTheLanguage` is optional here rather than required, and the optionality is a measurement
 * rather than a convenience: it is missing from exactly the two contracts that also owe the
 * divergence replay, and `CLAUDE.md` records that as one debt with two symptoms. A schema that
 * required it would force the debt closed by transcription, which is the one repair that proves
 * nothing.
 *
 * It is also the field the register above was written for. It had none: three of its four values were
 * clauses and one was a sentence, and the page printed a clause as a bare paragraph on two contract
 * pages for as long as the field has existed. Filling the two contracts that lack it is a separate
 * decision about content and is still owed.
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
   * **Read off `text` rather than declared beside it**, by `packages/registry/signature.ts`, which says why the
   * derivation is what makes the field affordable. It is here because a case of block 4.4 is a *call*
   * and nothing in this record could say so: `data` holds the fields of a case and the schema
   * deliberately does not interpret them, so a contract page could list `input`, `expected` and
   * `reason` as three fields of equal standing and could not render `parseNumber('  42  ')`.
   *
   * The site found it, by trying to render a call and having nothing to render one from: measured over
   * the five, the fields of every case of all seven tables begin with these names, in this order, and
   * what remains is the answer. `serialise.ts` refuses a contract where that stops being true. It is
   * one of the defects `CLAUDE.md` lists under rule 1, none of which was found by reading the schema.
   */
  readonly parameters: readonly ParameterRecord[]
}

/**
 * One parameter of a declared signature: what a caller names it, and what it is declared to be.
 *
 * **The type is here because the site's playground needed it**, and it arrived free: the
 * colon that ends a name begins a type, so `signature.ts` reads both on one walk and neither is
 * declared beside the other. A `parameters` of bare names sent the site back to parsing
 * `export.text` for itself - which is the state this field was created to end.
 *
 * **What the type is for, and the refusal that keeps it honest.** The site builds an argument out of
 * what a reader types, and what it builds depends on this: `string` is the text itself, `Date` is
 * constructed from it. A type the builder does not know stops the build and names itself, the shape
 * `packages/registry/value.ts` already takes for a value it does not model - no fallback, no empty field, no
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
 * **Another of the defects a consumer found in this schema, and the second the site found.** The
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
 * **A published size here names three coordinates, and each one was bought by a figure that went
 * wrong without it.** The serialisation, because there are three of them and they differ by a factor
 * of six. The divisor, because a kibibyte and a kilobyte are the same word in any comment that does
 * not say which. The commit, because a record grows, and without it a reader who re-measures and gets
 * something else cannot tell *this figure was wrong* from *the tree has moved*. So what follows is
 * **the canonical text of a whole record in bytes, divided by 1000, measured at `da0c3ca`** - the
 * canonical text because that is the form a digest is taken over, and 1000 because `packages/cli/report.ts`
 * prints a kilobyte that way and one repository holds one kilobyte.
 *
 * The five records are 35.7, 53.7, 47.5, 34.6 and 45.0 kB, in the order `theFive` holds them, and
 * block 4.5 is between 6.9 and 34.0 per cent of each. `array/group-by@1` writes `range(50_000)` three
 * times, and carrying its six profiles rather than pointing at them takes its record to 5479.9 kB, of
 * which 99.2 per cent is this block. The one that would otherwise be a hundred times the size of the
 * others is the second largest of the five.
 *
 * What the six omit: 7.1, 1772.2, 1772.2, 1771.8, 102.9 and 14.1 kB. Two of those digests are equal -
 * `one-group-per-element` and `single-group` really do draw the same three ranges - which is the same
 * fact from underneath as the transcription gap `the-five.ts` names beside them.
 *
 * **This paragraph has been wrong twice, and the two failures are why the coordinates are listed
 * rather than left to be assumed.**
 *
 * Its first version published 71-152 kB, 24.2 MB and 99.4 per cent, and none of the three reproduces.
 * Measured three ways on the records those figures described: flat gave 32.2-49.7 kB, 5.22 MB and 99.2
 * per cent; two-space indent 52.5-113.6 kB, 19.92 MB and 93.4 per cent; four-space indent 70.8-172.1
 * kB, 33.72 MB and 92.4 per cent. No serialisation produces that triple, and the share and the sizes
 * cannot have come from one measurement. Those numbers are left in the unit that measurement used
 * rather than restated here: the divisor it used is the subject of the next paragraph, and re-deriving
 * them would need the tree they described. That failure is where *a published size names the
 * serialisation it was taken under* came from.
 *
 * Its second version named the serialisation and not the divisor, **and every figure it published was
 * a kibibyte called a kilobyte**. Re-measured at `c6592a2`, the commit that published them: the
 * records come to 32.9, 50.8, 45.7, 32.9 and 42.7 kB against a published 32.1, 49.6, 44.6, 32.1 and
 * 41.7, and the omissions to 1772.2 kB against a published 1730.6. The ratio is 1.024 throughout,
 * and the *share* reproduced exactly - a ratio cancels the divisor, which is how the error survived
 * beside a figure that checked out. `packages/cli/report.ts` divides by 1000 and C-44 of `cli-install` exists
 * to kill an implementation that does not, so the repository already executed the decimal kilobyte
 * one folder from a comment publishing the binary one.
 *
 * It also called that record the third largest when it was the second, at `c6592a2` as at `da0c3ca`.
 * That one needed no divisor to be wrong.
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
