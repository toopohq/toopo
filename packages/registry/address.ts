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
 * because there is no type here that carries a guard identifier on its own. ADR-0019 names that cost
 * in advance - "the registry schema must always carry the pair, never the identifier alone" - and the
 * cost is already due: identifiers are held by more than one contract today, `determinism` by all
 * five of them. A rule that lives in a sentence is a rule the sixth contract's author never reads;
 * making the unpaired form unrepresentable is what turns it into something the compiler keeps.
 *
 * The records the rest of this file answers to: ADR-0031 is why `THE_ORIGIN` is declared here rather
 * than in the folder that renders it; ADR-0049 is why every rendering carries the language; ADR-0054
 * is the shape this file is the first instance of; ADR-0099 is why the `@` survived a host that
 * served it behind a redirect.
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

/**
 * The domain prefix a contract may never carry, so that a fixture can hold an address for good.
 *
 * **A fixture standing at an admissible address stands in the catalogue's way.** Nine of them did,
 * and one was the address of the imagined graph's root, of the record a sixth contract was written
 * against, and of the contract the catalogue then decided to publish. Nothing reported the collision:
 * it is found by somebody setting out to write the contract, at which point the choice is between
 * renaming forty files and publishing at a name nobody chose.
 *
 * **A prefix on the domain rather than a reserved domain, and a measurement decides it.** The
 * imagined graph exists to exercise a specifier of the form `../../<domain>/<name>/reference.js`,
 * which is how a published feature names another one - relative to the folder every contract sits in.
 * Six fixtures inside one reserved domain would write `../<name>/reference.js` instead, and the
 * harder of the two shapes, the one `packages/cli/` exists to measure, would stop being written
 * anywhere. A prefix keeps three imagined domains and so keeps that edge.
 *
 * **A prefix on the domain rather than on the name**, because the domain is what the site's
 * navigation is built on: a reserved name inside `number` would put a fiction inside a domain a
 * reader browses, and a reserved domain is a folder nothing walks into.
 *
 * The prefix holds no slash, so asking this of the whole `domain/name` is asking it of the domain.
 *
 * ADR-0142.
 */
export const THE_IMAGINED_DOMAIN_PREFIX = 'imagined-'

/**
 * Whether `domain/name` stands in the imagined space, which is the space the catalogue refuses.
 *
 * It takes the name rather than the address because both sides need it: a record carries a
 * `ContractAddress`, and a client is handed `domain/name` as the user typed it.
 */
export const isImagined = (name: string): boolean => name.startsWith(THE_IMAGINED_DOMAIN_PREFIX)

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
 * **Why there is no second, language-less form, measured rather than preferred.** A short form for
 * local use reads as an economy: a screen line is not frozen, and every address inside
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
 * The name the package is published under, and the word inside the command a user types.
 *
 * **It is the most irreversible field of the manifest and it was declared in no code at all**, which
 * the inventory before the launch is what found. Every other field of `publication.ts` can be
 * corrected by publishing a later version; a name cannot. npm does not rename a package, and it does
 * not let a deleted name be taken again - so the first publication settles it for the life of the
 * registry.
 *
 * **It lived in `publication.ts` and moved here when a third consumer appeared**, which is the move
 * `THE_ORIGIN` above records and the reason is one this file decides rather than taste:
 * `packaging/reachable.ts` walks the published entry point, so a client rendering the command out of
 * `publication.ts` would pull that module into the archive and falsify the sentence it carries about
 * which modules the archive holds. The manifest resolves against this one import further along.
 *
 * It is an address in the sense this file means. It is the string npm resolves, and it is the key of
 * `bin` - which is what npm writes the shim from, so the two disagreeing is `npx toopo` reaching
 * nothing. `the-public-fields-npm-shows-are-the-ones-this-code-declares` resolves both against it.
 */
export const THE_PACKAGE_NAME = 'toopo'

/**
 * The words a reader types to run this, in the one spelling that works whether or not they have
 * installed anything.
 *
 * **Measured rather than reasoned about, because npm's resolution order is not a thing to be confident
 * about from memory.** Three situations at `84a6b7c`, each in an empty folder with the npx cache purged
 * first, on npm 11.12.1: with nothing installed, npx downloads the package and runs it; with the
 * package installed globally, npx runs the global binary and creates no cache entry; with it installed
 * as a project dependency and nothing global, npx runs `node_modules/.bin` and creates no cache entry.
 * All three exit 0 and write the file. **One spelling is correct in all three**, so no surface has to
 * ask a reader which one they are in - and the bare `toopo` that four published surfaces printed until
 * this constant existed is correct in exactly one of them. That was the first thing a visitor did, and
 * it answered `command not found`.
 *
 * **`npx` and never `npx --yes`.** On a first run npx names the package and its exact version and waits
 * for a word before anything executes. On a product whose thesis is that you verify what you receive,
 * that prompt is the first demonstration of the thesis, and `--yes` would delete it: it is not a
 * friction tolerated, it is a transparency kept. It is paid once - a second run is silent, measured the
 * same day.
 *
 * **What nothing keeps is that every surface renders this rather than the bare word.** The README and
 * the emitted pages are swept by a guard apiece; the client's own screens are not, because no shape
 * makes the bare form fail to compile and the sweep that would catch it is a lint over this
 * repository's own strings - already priced and already refused. ADR-0054 is the treatment that
 * applies, and `CLAUDE.md` carries the entry.
 */
export const THE_INVOCATION = `npx ${THE_PACKAGE_NAME}`

/** One way of running this, with what running it was measured to do. */
export type AWayToRunIt = {
  /** The package manager a reader recognises, which is what a choice between these is labelled by. */
  readonly manager: string
  /** The words, whether or not they work. */
  readonly spelling: string
  /**
   * Absent when it runs, and the measurement that refused it when it does not.
   *
   * A refusal rather than an omission, because a manager quietly missing from a list of four reads as
   * an oversight and sends a reader to try it. This catalogue publishes what it turned down with the
   * measurement each decision rests on; the same treatment applies to itself.
   */
  readonly refusedBecause?: string
}

/**
 * Every way a reader can run this, each measured against the published package rather than
 * transcribed from another site.
 *
 * **A form displayed and not measured is the defect a visitor already met**, on the first thing they
 * tried: four published surfaces printed the bare `toopo`, which answers `command not found` for
 * anybody who has installed nothing. Copying `yarn dlx` off another registry's page would have been
 * the same defect with a different spelling, and it would have shipped - `yarn dlx` is the one of the
 * four that does not work.
 *
 * **Measured on 2026-09-04 against `toopo@1.2.0` as npm serves it**, each in its own empty project
 * holding nothing but a `package.json`. `npx`, `pnpm dlx` and `bunx` each exit 0, and the file each
 * writes hashes to `1a8ae9d1…` at 3 332 bytes, which is the blob this catalogue announces - so the
 * three do not merely run, they land the same bytes. `yarn dlx` exits 1 with nothing written, on the
 * cause below. The announced digest is read from the origin's own snapshot rather than from the
 * client that wrote the file, which is what separates *it runs* from *it lands the right thing*.
 *
 * **`deno` is not here because it was not measured**, not because it fails. It is not on the machine
 * the readings were taken on, and a fifth entry asserted from the shape of the other four is exactly
 * what this table exists against.
 *
 * The versions the readings were taken at, because a manager's behaviour is its own to change:
 * node v24.15.0, npm 11.12.1, pnpm 10.24.0, bun 1.3.8, yarn 4.6.0 through corepack 0.34.6. The five
 * manager versions are the ones the first reading was taken at, to the digit, so no row here can be
 * attributed to a manager having changed its mind.
 *
 * **A reading here goes stale at a publication and at nothing else**, because between publications
 * no change in this tree moves what npm serves. So it is re-taken in the unit that moves
 * `THE_PACKAGE_VERSION`, and `THE_WAYS_WERE_READ_FOR` below is what keeps that: the first reading
 * survived `1.1.0`, `1.1.1` and `1.2.0` unread, and a stamp would have been red at all three.
 * ADR-0213 carries the re-reading and the journey behind the invocation, ADR-0214 the stamp, and
 * ADR-0138 the argument, the refusals and what was not measured.
 */
export const THE_WAYS_TO_RUN_IT: readonly AWayToRunIt[] = [
  { manager: 'npm', spelling: THE_INVOCATION },
  { manager: 'pnpm', spelling: `pnpm dlx ${THE_PACKAGE_NAME}` },
  { manager: 'bun', spelling: `bunx ${THE_PACKAGE_NAME}` },
  {
    manager: 'yarn',
    spelling: `yarn dlx ${THE_PACKAGE_NAME}`,
    refusedBecause:
      `Yarn 4 applies its builtin compatibility patch to typescript, which ${THE_PACKAGE_NAME} ` +
      'depends on, and the patch does not apply to TypeScript 7 — the install fails before a file ' +
      `is written. Use the npm form above: npx ships with Node, so it runs inside a Yarn project.`,
  },
]

/**
 * The version of this package the table above was last read for.
 *
 * **It is the whole of what an offline guard can keep about a measurement taken by hand.**
 * `the-ways-to-run-it-were-read-for-the-version-this-package-declares` compares this with
 * `THE_PACKAGE_VERSION`, with no network and no package manager, so it does not establish that `npx`
 * runs - nothing here can - and it does establish that somebody read the table in the unit that
 * declared this version. The first reading survived `1.1.0`, `1.1.1` and `1.2.0` with nothing looking
 * at it, and this would have been red at all three.
 *
 * **A constant beside the table rather than a field on `AWayToRunIt`, and what decides that is the
 * claim rather than the price.** What the guard keeps is *this table is current*, and over per-form
 * stamps the only sound reduction to one verdict is the oldest - a table with one fresh row and three
 * stale ones is stale - so four values would be carried to compute one, and a row going stale beside a
 * fresh one would be silent, each stamp being true of its own row. The coordinate is a fact about the
 * reading, and the reading is one sitting. The price agrees rather than deciding: measured at
 * `94458f4`, `contract-page.ts` serialises this table into `data-ways` on all six contract pages, so a
 * field costs a reader **912 B raw and 161 B in brotli** - 152 and 26.8 per page - for a value nothing
 * on the page reads.
 *
 * **It is a literal rather than a comparison, because this module is in the archive and
 * `publication.ts` is not.** Measured at `94458f4`: the build writes 36 modules, `address.js` is one
 * of them and `publication.js` is not, so importing `THE_PACKAGE_VERSION` here would put the whole
 * publication module into every install - which is the trap `THE_PACKAGE_NAME` above records having
 * been moved out of that file to avoid. The comparison lives in `address.test.ts`, which nothing packs.
 *
 * **What it cannot see is the release it is stamped in**, and that is the guard's limit rather than an
 * oversight. A reading is taken against what npm serves, and npm does not hold the version this tree
 * declares until the push declaring it has published - so the unit that moves `THE_PACKAGE_VERSION`
 * reads the outgoing release and stamps the incoming one. ADR-0213 proposed this as *the version its
 * readings were taken against*, which is the one spelling that can never be green: it would be red for
 * the whole of every release unit, on the push whose job ordering exists to put every verdict in front
 * of the irreversible act. ADR-0214.
 */
export const THE_WAYS_WERE_READ_FOR = '1.2.0'

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
