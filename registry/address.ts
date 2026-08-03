/**
 * How the registry addresses the things it will one day serve, cite and link to.
 *
 * An address is not a field among others. The site will make a case identifier a URL anchor, the API
 * will cite one in a response, and a validation report will put one in front of a submitter to name
 * the case their submission failed. An address that changes breaks links, so every address here is
 * frozen with the contract's major version, under the discipline `catalogue/every-contract.ts`
 * already states for a case and `mutation/run.ts` for a guard.
 *
 * Nothing below is a string. That is the whole content of this file: a `ContractAddress` is a value
 * with three parts, and a guard is addressed by the *pair* `(contract, guard)` and by no other shape,
 * because there is no type here that carries a guard identifier on its own. `CLAUDE.md` names that
 * cost in advance - "the registry schema must always carry the pair, never the identifier alone" -
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
 * What it does not do is make the schema language-neutral, and `contract-record.ts` says where the
 * frontier actually falls: the *shape* of a record is neutral, its *content* is TypeScript, and
 * pretending otherwise would be an abstraction no contract fills.
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
 * `date-add` and `date-add-spec` both name the guards of `contracts/date/add`. This is a citation
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

export const renderContract = (address: ContractAddress): string =>
  `${address.name}@${address.major}`

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
