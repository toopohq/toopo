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

/**
 * What every contract of the catalogue carries, and one field that not all of them do yet.
 *
 * **The measurement is `contractAnatomy`'s and is not restated here.** That one names the commit it
 * was taken at; a second copy in this comment is a count with no coordinate, which is what ADR-0018
 * refuses - and this one had already gone ambiguous before anybody looked. It read *one optional
 * because two contracts owe it*, where *owe* means *still lack*, and it was read as *two contracts
 * carry it* by the next person to open the file. Both readings cannot be checked here, because
 * neither number is here. ADR-0009, ADR-0018.
 */
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

/**
 * A row of a contract that is written as a call, which is the only thing `theCallOf` reads.
 *
 * Two records satisfy it - a settled case, and a use case beside it - and it exists so that the
 * functions which slice a call apart say so in their signature. They took a `CaseRecord` and read one
 * field of it, which is a type claiming a coupling the code does not have: the day a second record
 * needed the same slice, the honest change was to widen the parameter rather than to copy the slice.
 */
export type WrittenAsACall = {
  /** Where the schema stops understanding a contract: rendered, never interpreted. ADR-0004. */
  readonly data: EncodedValue
}

export type CaseRecord = WrittenAsACall & {
  /** A name, frozen with the major, never a rendering of the row it addresses. ADR-0017. */
  readonly id: string
  /** Required, because a case with no group would be a silence about where it belongs. ADR-0012. */
  readonly group: string
  readonly provenance: CaseProvenance
  readonly rationale: string
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

/**
 * What a contract has to settle about its benchmark profiles before it is published.
 *
 * **A profile's name is a claim about its own samples, and nothing reads a name.** Measured at
 * `286ca34` over the catalogue's thirty-six profiles: nineteen share their class with a sibling of
 * the same contract, and seventeen are indistinguishable from a sibling in *everything* a guard
 * reads - same class, same declared fields, and only the name and the samples differ. For those
 * seventeen the name is the only thing that tells two profiles apart and it is checked by nothing:
 * `number/parse@1` was measured with `small-integers` naming `['1e308', '0.000000000000015',
 * '-1e-300']` and the whole of `contracts/` stayed green.
 *
 * **The repair belongs to `contract.ts` and is therefore only available before publication.** A
 * profile's class is decided by running the contract's own reference, so a class fine enough to
 * separate two profiles is a claim a guard settles; a name is prose and no stage of anything will
 * read one. `array/group-by@1` is the worked example and it is the only contract here that passes:
 * `few-large-groups` and `string-keys` share a shape and are separated by `keyFunction`, which
 * `profiles.test.ts` *executes* through `profileKeyFunctions`. Its own comment names the defect
 * better than the schema did - *without it, a profile called `many-small-groups` could quietly be
 * measuring sixteen groups over fifty thousand elements*.
 *
 * **The six published contracts can never satisfy it**, because satisfying it means editing
 * `contract.ts` and every byte of that file is inside a digest other people's lockfiles hold. That
 * is permanent rule 6 working, not failing, and this constant exists so the next contract does not
 * buy the same debt. ADR-0171.
 */
export const PROFILE_SEPARATION_RULE =
  'no two benchmark profiles of one contract are indistinguishable to the guards that read them: ' +
  'where two profiles share a class, some further declared field separates them and the ' +
  "contract's own `profiles.test.ts` executes it"

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

// --- What the registry says about a contract without binding it ---

/**
 * One job a contract is written for: the call as somebody would make it, and the one thing to know
 * before relying on it.
 *
 * ---------------------------------------------------------------------------
 * It carries no identifier, and the reason is the same one that keeps it out of the digest
 * ---------------------------------------------------------------------------
 *
 * Every other row of this schema that a page renders has a frozen kebab-case address - a case, a
 * group, a reason literal, a benchmark profile - because something cites it: a URL anchors on one, a
 * validation report names one, a battery pins one. Nothing cites a use case. It is curation in
 * ADR-0023's sense, which is exactly why it may be rewritten the day it reads badly, and an address
 * on a thing that may be rewritten is an address that will one day name something else.
 *
 * ---------------------------------------------------------------------------
 * The call is a value and never a snippet
 * ---------------------------------------------------------------------------
 *
 * `data` is written the way a case of block 4.4 is written - the arguments first, named as the
 * signature names them and in its order, then the answer - so `theCallOf` reads it and the same
 * replay that checks the settled cases against the shipped module checks these. A code sample with
 * lines around the call would put unverified text beside verified text on the one page whose whole
 * argument is that everything on it was checked, which is the defect ADR-0114 took out of the README.
 */
export type UseCaseRecord = WrittenAsACall & {
  /** The card's title. Prose, because nothing addresses it. */
  readonly name: string
  /** What somebody is doing when they reach for this, in one sentence. */
  readonly situation: string
  /**
   * What to know before relying on it, and the field that makes the rest worth reading.
   *
   * Required rather than optional, and a field rather than a second paragraph of `situation`: the
   * warnings are what a use case is *for* - a slug is lossy, two headings collide, an edited title
   * moves a page - and prose merged into the description leaves nothing refusing a use case written
   * without one. `CaseRecord.rationale`, `UniversalPropertyRecord.reason` and `CaseGroup.note` are
   * the same shape for the same reason.
   */
  readonly caveat: string
}

// --- The language moving under a contract that cannot answer ---

/**
 * One re-examination of a published contract against a language that moved under it.
 *
 * `array/group-by@1` established the rule and `CLAUDE.md` records it: *the language moves, so the
 * catalogue re-examines itself against it. Clearing rule 7 is not a property a contract acquires once
 * and keeps.* That rule has an outcome the schema already carries - `absorbed-by-the-language`, for
 * the day the language answers a published contract outright. **What it had no shape for at all is
 * the other outcome**, which is the ordinary one: the language moved, the catalogue looked, and the
 * contract stands. A rule whose only expressible result is the rare one is a rule a reader meets as
 * silence in every case but that one.
 *
 * ---------------------------------------------------------------------------
 * Why it is here and not in `identity`
 * ---------------------------------------------------------------------------
 *
 * `identity.relationToTheLanguage` is where a contract says where it stands, and `contractSnapshot`
 * freezes `identity` whole - measured, adding that field to `date/add@1` moves its digest from
 * `94c5acc7…` to `043afd7d…`, which permanent rule 6 forbids. So the field a contract would use to
 * answer is shut on exactly the contracts that need to: the ones published before their language
 * moved. This is the second of the two candidates `CONTRACT_STANDING_FIELDS` named on paper -
 * *anything a later measurement attaches to an artefact published without it* - and a re-examination
 * is that, literally.
 *
 * ---------------------------------------------------------------------------
 * The three fields are three different kinds of statement, and that is ADR-0042
 * ---------------------------------------------------------------------------
 *
 * What moved is a fact about somebody else's specification. The measurement is a reading, with its
 * coordinates and its limits. What it establishes is a conclusion, and a conclusion offered without
 * its premise is assertion. Folding the last two together is how a report comes to name a cause no
 * measurement carries.
 */
export type LanguageReExamination = {
  /** What moved, named precisely enough that a reader can go and check it themselves. */
  readonly whatMoved: string
  /**
   * The reading, with the commit it was taken at and what it does not cover.
   *
   * The commit is written into the prose in backticks rather than carried in a field of its own,
   * because that is the spelling `mutation/history.ts` already sweeps: a stamp in a field nothing
   * resolves is a coordinate that stops naming anything the day the history moves.
   */
  readonly measurement: string
  /** What the reading establishes, which is never the reading itself. ADR-0042. */
  readonly whatItEstablishes: string
}

/**
 * A sentence inside a published contract that a later measurement found false. ADR-0161.
 *
 * ---------------------------------------------------------------------------
 * Why it is not `againstTheLanguage`, measured rather than argued from the shape
 * ---------------------------------------------------------------------------
 *
 * The two carry the same three statements and they are about different things. A re-examination is a
 * reading against **a specification this repository does not own**, and its first field is `whatMoved`
 * - the language changed under an artefact that could not answer back. Here nothing moved: the prose
 * was false on the day it was published, and what changed is that somebody measured it. `whatMoved`
 * would have to be filled with a non-event, which is the shape of a field being borrowed rather than
 * fitted.
 *
 * The test `CONTRACT_STANDING_FIELDS` actually asks is *may the registry change its mind about this
 * after publication?* - and about a rationale it must, because the alternative is a reader holding a
 * false explanation for the life of a major with the catalogue knowing better and unable to say so.
 *
 * ---------------------------------------------------------------------------
 * What it does not do, which is the half worth reading
 * ---------------------------------------------------------------------------
 *
 * **It does not correct the frozen half and must not read as though it did.** The sentence stays where
 * it is, byte for byte, in every published digest and in every snapshot an auditor fetches: it is a
 * photograph of what this catalogue believed. What this carries is what was measured afterwards, and a
 * page renders the two together so a reader meets the correction where they meet the claim.
 *
 * **It is not for a case whose answer is wrong.** A wrong answer is a defect of the specification and
 * costs a second major; this is for prose *beside* a correct answer - the explanation, the provenance,
 * the sentence saying what an implementation would do. `object/deep-equal@1` published a rationale
 * claiming a memoising implementation answers `true` on a row where it answers `false`, and the row
 * itself is right.
 */
export type PublishedProseCorrection = {
  /**
   * What the correction is about, by the address the catalogue already gives it.
   *
   * A case identifier here, and the shape allows any address the contract publishes - which is what
   * keeps this from becoming a field per kind of prose. ADR-0017 is why an address is what a
   * correction cites rather than a quotation of what it corrects.
   */
  readonly about: string
  /** What the frozen prose says, quoted, so a reader meets both halves at once and judges for themselves. */
  readonly published: string
  /**
   * The reading that refuses it, with the commit it was taken at and what it does not cover.
   *
   * The commit goes in the prose in backticks for the reason a re-examination puts it there: that is
   * the spelling `mutation/history.ts` sweeps, and a stamp in a field nothing resolves stops naming
   * anything the day the history moves.
   */
  readonly measurement: string
  /** What the reading establishes, which is never the reading itself. ADR-0042. */
  readonly whatItEstablishes: string
}

// --- A word the registry learned about a contract it may no longer edit ---

/**
 * One phrase the registry found people ask by, on a contract whose own aliases are frozen. ADR-0155.
 *
 * `identity.searchAliases` is what a contract says people look for, and ADR-0023 decides in as many
 * words that it is the one field of `identity` that is not frozen - *nobody links to an alias, no
 * answer cites one, and correcting one breaks nobody's code*. `contractSnapshot` freezes `identity`
 * whole, so on a published contract that decision is unkept: measured, adding one alias to
 * `string/slugify@1` moves its digest from `855107da…` to `5fe0ecfa…`. Five of the six contracts are
 * published, so the cheapest contribution this project invites is the one it cannot accept.
 *
 * ---------------------------------------------------------------------------
 * Why this is curation and not a second statement of the frozen half
 * ---------------------------------------------------------------------------
 *
 * ADR-0128 refuses a standing field that restates something the frozen half already publishes, and it
 * refuses it on the content: `identity.inputDomain` carries the *it is not…* clauses in prose, so a
 * field for them would be one half of a duplicate that permanent rule 6 makes unremovable. Nothing
 * here restates anything. A frozen alias is a phrase the contract's author wrote at publication; a
 * phrase nobody wrote is in no field at all, and there is no half of the contract that could be
 * pointed at instead.
 *
 * The genus is the other one. **What the registry measures is not what the contract is held to**, and
 * how somebody finds a function is not part of what the function is obliged to do. That is why
 * `againstTheLanguage` is standing rather than frozen, and it is why this is - the family is
 * `useCases`, and `tags` one level down.
 *
 * **What a query reaches is a fact about the catalogue and never about one contract, which is what
 * settles it.** ADR-0154 measured `slugify a blog post` against this catalogue's own six
 * publications and it answered **0, 0, 0, 1, 4, 4** while no contract moved at all, because a word
 * stops telling the contracts apart as contracts arrive. A field inside the digest would be
 * promising, for the life of a major, something no contract has ever been able to promise.
 *
 * ---------------------------------------------------------------------------
 * Three fields, because this is standing in for a review
 * ---------------------------------------------------------------------------
 *
 * An alias is reviewed once, at publication, against the contract's own description - ADR-0023 is
 * that review, and it caught eight phrases naming something their contract refuses to do. A term
 * added under a frozen address arrives at a moment nothing marks, so the review has no occasion. What
 * stands in its place is that the two questions the review asks are written down separately and kept.
 *
 * A false alias answers `howItIsAsked` truthfully and `whyThisContract` falsely - somebody does type
 * `remove accents from string`, and `string/slugify@1` leaves `Straße` as `straße`. A term nobody
 * types answers the second and fails the first, and costs the bytes of the one document every search
 * fetches. Folded into one paragraph, it is the failing half that goes unwritten.
 *
 * The reading that the catalogue does not already answer the term is **not** a field, and that is
 * ADR-0043 rather than an omission: `a-learned-term-is-one-the-contract-was-not-already-found-by`
 * re-takes it on every run against the catalogue as it stands today, where a sentence would be true
 * on the morning it was written. It is the one half of this record a guard can compute.
 */
export type LearnedTerm = {
  /** The phrase, as somebody types it. `wordsOf` reads it exactly as it reads an alias. */
  readonly term: string
  /** That people ask this way, with the reading that says so. */
  readonly howItIsAsked: string
  /** That this contract is their best answer - the half a false alias passes over. ADR-0023. */
  readonly whyThisContract: string
}

// --- The record ---

export type ContractRecord = {
  readonly address: ContractAddress
  readonly lifecycle: Lifecycle
  /**
   * How the contract is used, which the registry may rewrite under a frozen address. ADR-0118.
   *
   * Beside `lifecycle` and not inside `identity`, and that placement is the whole decision rather
   * than a tidiness: `contractSnapshot` freezes `identity` whole, so a field there would move a
   * published contract's digest and break permanent rule 6. Both halves of the standing are declared
   * outside the contract's own folder for the same reason - the seven files are hashed into the
   * digest too, so a published contract cannot gain a byte.
   *
   * Absent on a contract that declares none, never an empty list: `canonical.ts` refuses an
   * `undefined` inside a value, and an empty array would be a section a page renders with nothing in
   * it. The same treatment `surface.failureReasons` gets, one block along.
   */
  readonly useCases?: readonly UseCaseRecord[]
  /**
   * Where the contract stands against a language that moved after it was published. ADR-0150.
   *
   * Beside `useCases` and outside `identity` for the same measured reason, and absent rather than
   * empty on a contract whose language has not moved under it - which is every contract of the
   * catalogue but one.
   */
  readonly againstTheLanguage?: readonly LanguageReExamination[]
  /**
   * Phrases the registry learned people ask by, after the contract's own aliases were frozen.
   *
   * Beside its two siblings and outside `identity` for the reason they are, and absent rather than
   * empty on a contract nobody has had to teach the registry a word for.
   */
  readonly alsoFoundBy?: readonly LearnedTerm[]
  /**
   * Sentences of the frozen half this catalogue has since measured to be false. ADR-0161.
   *
   * Beside its three siblings and outside `identity` for the reason they are, and absent rather than
   * empty on a contract nothing has been found wrong about - which is every contract but one.
   */
  readonly correctionsToFrozenProse?: readonly PublishedProseCorrection[]
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
