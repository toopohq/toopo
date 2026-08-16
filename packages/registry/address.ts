/**
 * How the registry addresses the things it will one day serve, cite and link to.
 *
 * An address is not a field among others. The site will make a case identifier a URL anchor, the API
 * will cite one in a response, and a validation report will put one in front of a submitter to name
 * the case their submission failed. An address that changes breaks links, so every address here is
 * frozen with the contract's major version, under the discipline ADR-0017 already states for a case
 * and `mutation/run.ts` for a guard.
 *
 * Nothing below is a string. That is the whole content of this file: a `ContractAddress` is a value
 * with three parts, and a guard is addressed by the *pair* `(contract, guard)` and by no other shape,
 * because there is no type here that carries a guard identifier on its own. ADR-0019 names that
 * cost in advance - "the registry schema must always carry the pair, never the identifier alone" -
 * and ADR-0099 is why the `@` stays although one host serves it behind a redirect,
 * and ADR-0031 is why `THE_ORIGIN` below is declared here rather than in the folder that renders it,
 * ADR-0049 is why every rendering carries the language, and ADR-0054 is the shape this file is the
 * first instance of -
 * and fifteen identifier strings are held by more than one contract today, so the cost is already
 * due. A rule that lives in a sentence is a rule the sixth contract's author never reads; making the
 * unpaired form unrepresentable is what turns it into something the compiler keeps.
 */

import { isFrozenIdentifier } from '../catalogue/identifier.js'

/**
 * The language a contract is written in.
 *
 * One value today, and every one of the five fills it. It is here rather than absent because it is a
 * coordinate of a *frozen address*, and adding a coordinate to an address later renames every address
 * that ever existed - which is exactly the cost the catalogue refused to pay a second time when it
 * settled that a guard travels as a pair. A field with one value now against a rename of the whole
 * catalogue later is the cheapest insurance in this schema.
 *
 * What it does not do is make the schema language-neutral, and ADR-0006 says where the
 * frontier actually falls: the *shape* of a record is neutral, its *content* is TypeScript, and
 * pretending otherwise would be an abstraction no contract fills.
 *
 * **The insurance was measured rather than trusted.** Widening this union to `'typescript' | 'python'`
 * and typechecking all six projects gives exactly one error - `THE_WORDS_FOR` in `packages/cli/search.ts`,
 * which is total over it by construction and says so. One site, in a repository of fifty-odd modules
 * that pass an address around, is what a coordinate written before it had a second value buys.
 */
export type Language = 'typescript'

/**
 * A contract's domain and name - `number/parse`, `array/group-by`. Two kebab-case segments, because
 * that is what the five carry and because the domain is what the site's navigation is built on.
 */
const CONTRACT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*$/

export type ContractAddress = {
  readonly language: Language
  /** `domain/name`, exactly as `identity.name` carries it. */
  readonly name: string
  /** The major version. An incompatible evolution creates `name@2` beside `name@1`, never in place. */
  readonly major: number
}

/**
 * One published version of one implementation of one contract.
 *
 * Three parts and not two, because an implementation competes under a contract and versions
 * independently of it: `reference@1.0.1` of `number/parse@1` is a different artefact from
 * `reference@1.0.0` of the same contract and neither replaces the other. It is the address the
 * lockfile already writes, split into the parts the registry keys on.
 */
export type ImplementationAddress = {
  readonly contract: ContractAddress
  /** Unique within the contract, frozen. */
  readonly id: string
  /** The implementation's own version, assigned by the publishing tool when it serves it. */
  readonly version: string
}

/** A case of block 4.4. The identifier is frozen with the major; renaming one costs `name@2`. */
export type CaseAddress = {
  readonly contract: ContractAddress
  readonly case: string
}

/**
 * A guard, addressed by the pair and only by the pair.
 *
 * **The first coordinate is a battery and not a contract, and that is a correction rather than a
 * preference.** Uniqueness is per *suite*: a battery injects into one folder, `calibrate()` refuses
 * two guards of that folder answering to one identifier, and attribution filters to it - so the scope
 * that can break is the folder a battery measures. For five of the twelve batteries that folder is a
 * contract and the two coordinates coincide; for `registry-storage` and `validation-stage-1` there is
 * no contract at all, and a pair built on one could not name their guards. `determinism` is held by
 * five of the five, which is what the pair absorbs either way.
 *
 * What it costs is that a guard measured by two batteries of one folder has two true addresses -
 * `date-add` and `date-add-spec` both name the guards of `contracts/typescript/date/add`. This is a citation
 * rather than a permalink, exactly as a `found-by-mutation` provenance is, and a citation naming the
 * measurement it comes from is right rather than ambiguous. A permalink to a guard, when the site
 * needs one, is the contract's page and the identifier - which is the pair `renderGuard` does not
 * print and nothing yet asks for.
 */
export type GuardAddress = {
  /** The battery whose suite carries this guard. */
  readonly battery: string
  readonly guard: string
}

/**
 * A cell of a mutation battery, which is what a case's `found-by-mutation:` provenance claims to
 * name. It is a three-part address because a mutant identifier is unique within a battery and a
 * battery belongs to a contract: `D-07` means nothing until both are supplied.
 */
export type MutantAddress = {
  readonly contract: ContractAddress
  readonly battery: string
  readonly mutant: string
}

/**
 * The one spelling of a contract's address: `typescript/number/parse@1`.
 *
 * Every address here that contains a contract is this string with something after it, and so are the
 * page path, the published URL and the licence header of an installed file. The language is a
 * coordinate of the address, so it is in the rendering - a coordinate the record carries, `sameContract`
 * compares and the lockfile writes, dropped by the one function that turns the address into something a
 * reader, a crawler and a foreign repository see.
 *
 * The spelling is the record's own value and not an abbreviation of it. `ts/` saves sixteen bytes per
 * copied file - 0.68 per cent of the smallest one - and buys a correspondence table between two
 * spellings of one value, which is the drift this file exists to prevent. `licence.ts` refused the
 * literal MIT notice at +52 per cent on that same figure; there is no arbitration at 0.68.
 *
 * ---------------------------------------------------------------------------
 * Why there is no second, language-less form - measured rather than preferred
 * ---------------------------------------------------------------------------
 *
 * A short form for local use reads as an economy: a screen line is not frozen, and every address inside
 * one client carries one language, so the coordinate is constant there. It is refused because that form
 * has already produced a defect, and the defect is in a *key* rather than on a screen. `planInstall`
 * keys the features of one plan by this string. With the language dropped, two contracts of two
 * languages carrying one name collide there, and the refusal that comes out is false:
 *
 *     number/parse@1 is asked for at two versions in one install -
 *     number/parse@1/reference@1.0.0 and number/parse@1/reference@1.0.0.
 *
 * It names a cause no measurement establishes - *two versions* - and prints one string twice as the
 * evidence that two things differ. With the language in place the same call answers the true refusal,
 * naming the one file path both would be written to. Both measured by widening `Language` and passing
 * two implementations of one name to `planInstall`.
 *
 * So a short form is not a cheaper spelling of this one; it is the spelling that made a report lie. And
 * a form that lives on a screen reaches a bug report, then an issue, then a key.
 *
 * **The cost is real and is the only one here paid continuously**: eleven characters on every line of
 * `toopo list` and `toopo search`, carrying a value that is the same on all of them. The way out, the
 * day it is worth taking, is a *layout* - a column states a value once for a whole screen and is still
 * one spelling - and never a second string.
 *
 * **The disk path is the one rendered thing that does not carry it.** That is argued in `packages/cli/plan.ts`
 * where the path is built, because that is where somebody would go to make the two agree.
 */
export const renderContract = (address: ContractAddress): string =>
  `${address.language}/${address.name}@${address.major}`

export const renderImplementation = (address: ImplementationAddress): string =>
  `${renderContract(address.contract)}/${address.id}@${address.version}`

export const renderCase = (address: CaseAddress): string =>
  `${renderContract(address.contract)}#${address.case}`

export const renderGuard = (address: GuardAddress): string =>
  `${address.battery}/${address.guard}`

export const renderMutant = (address: MutantAddress): string =>
  `${renderContract(address.contract)}:${address.battery}/${address.mutant}`

export const sameContract = (a: ContractAddress, b: ContractAddress): boolean =>
  a.language === b.language && a.name === b.name && a.major === b.major

/**
 * Where this registry is published, declared once for the whole repository.
 *
 * **It is an address and not a setting**, which is why it sits here with the other addresses rather
 * than in a configuration file where it would read as a knob. Changing it changes every URL this
 * project has ever published - every page a search engine has indexed, every link anybody has saved,
 * every anchor a case identifier was frozen to make possible. A case identifier moving breaks the
 * links into one page; this moving breaks all of them at once.
 *
 * **It lived in `packages/site/paths.ts` and moved here when a second consumer appeared**, which is the shape
 * this repository keeps arriving at: one declaration, N transcriptions, a guard resolving them. The
 * generator was the only consumer while the site was the only thing publishing a URL, and
 * `the-origin-is-declared-once` held it inside that folder. The licence header of an installed file
 * carries this origin too, and a header is frozen into somebody else's repository for ever - so the
 * guard is now repository-wide and the declaration had to move above both readers.
 *
 * Nothing in this repository knows about any other domain. A second name that redirects is a fact
 * about DNS, and a module that knew about it would be publishing an opinion about infrastructure it
 * does not own.
 */
export const THE_ORIGIN = 'https://toopo.dev'

/**
 * The page a contract is published at, absolute, and the one spelling of it anything may write.
 *
 * `packages/site/paths.ts` builds the same string out of a file path and a trailing-slash rule, and
 * `the-contract-url-is-the-page-the-site-publishes` holds the two together. Two derivations of one URL
 * would be the defect this whole family exists to prevent, and this one is the copy that cannot be
 * corrected: it is frozen into the header of every file the installer has ever written.
 */
export const contractUrl = (address: ContractAddress): string =>
  `${THE_ORIGIN}/${renderContract(address)}/`

/**
 * Why an address is malformed, one reason per part, so that a refusal names the part rather than the
 * whole. Empty when the address is well formed.
 */
export const contractAddressFaults = (address: ContractAddress): readonly string[] => [
  ...(CONTRACT_NAME.test(address.name)
    ? []
    : [`"${address.name}" is not a domain and a name in kebab-case`]),
  ...(Number.isInteger(address.major) && address.major >= 1
    ? []
    : [`${address.major} is not a major version, which is a whole number from 1 upwards`]),
]

export const caseAddressFaults = (address: CaseAddress): readonly string[] => [
  ...contractAddressFaults(address.contract),
  ...(isFrozenIdentifier(address.case) ? [] : [`"${address.case}" is not a frozen identifier`]),
]

export const guardAddressFaults = (address: GuardAddress): readonly string[] => [
  ...(address.battery.trim() === '' ? ['the battery is unnamed'] : []),
  ...(isFrozenIdentifier(address.guard) ? [] : [`"${address.guard}" is not a frozen identifier`]),
]
