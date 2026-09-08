import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { trackedFiles } from '../../mutation/paths.js'
import { THE_ORIGIN, THE_PACKAGE_NAME, renderContract } from './address.js'
import { servedBytes } from './canonical.js'
import { THE_CURRENT_BANNER, THE_REPOSITORY_LICENCE, isMarked, licenceHeaderOf } from './licence.js'
import { theLocalLedger } from './local-read-api.js'
import { unanchoredBindings } from './rebinding.js'
import {
  THE_AUTHOR_FIELD,
  THE_MINIMUM_RUNTIME,
  THE_PACKAGE_VERSION,
  THE_PUBLICATIONS,
  THE_SOURCE_REPOSITORY,
} from './publication.js'
import { REPOSITORY_ROOT, referenceImplementationOf } from './serialise.js'
import { theCatalogue } from './the-catalogue.js'

/**
 * What this repository states about itself to the outside world, and the one rule all of it obeys.
 *
 * Three facts leave this project and are read by people who cannot check them against anything here:
 * where it is published, what licence covers what, and what npm shows on its page. Each one is
 * declared exactly once in code, transcribed wherever a format cannot import - `package.json` is JSON,
 * `LICENSE` is prose, and an installed file may import nothing at all - and every transcription is
 * resolved against its declaration below.
 *
 * That is `against-the-catalogue.test.ts`'s shape on a second subject, and it is here rather than beside
 * each transcription because the declarations are what the guards share. Splitting them would put four
 * one-guard files in four folders, each holding a copy of how to find the repository root.
 *
 * **The licence perimeter is the load-bearing half.** A wrong origin publishes a broken link, which is
 * repaired by a redirect. A wrong licence marking publishes a legal claim into somebody else's
 * repository, where it is frozen, silent, and ours to have caused.
 */

const textOf = (path: string): string =>
  servedBytes(readFileSync(join(REPOSITORY_ROOT, path))).toString('utf8')

/**
 * What `toopo add` copies, taken from the installer's own answer rather than from a list.
 *
 * `referenceImplementationOf` is what the registry serves as an implementation's files, and it is what
 * `packages/cli/plan.ts` turns into destinations. Reading it here is what makes the perimeter below a derivation
 * instead of a declaration nothing keeps - and the day a contract gains a second file, that file is in
 * this list before anybody has decided anything about it.
 */
const copiedFiles = (): readonly { readonly path: string; readonly header: string }[] =>
  theCatalogue.flatMap((source) =>
    referenceImplementationOf(REPOSITORY_ROOT, source).files.map((file) => ({
      path: `${source.folder}/${file.path}`,
      header: licenceHeaderOf(source.address, source.banner),
    })),
  )

describe('what this repository publishes about itself', () => {
  /**
   * Every file that lands in somebody else's project says, in its own first two lines, what they may
   * do with it and what it is.
   *
   * Byte for byte against `licenceHeaderOf` rather than by matching a pattern: a header that merely
   * *looks* like a licence marking is what a scanner reads and a court does not, and the address on the
   * first line is only worth printing if it is the address that resolves.
   */
  it('every-file-the-installer-copies-is-marked-mit-0', () => {
    const unmarked = copiedFiles()
      .filter((file) => !textOf(file.path).startsWith(file.header))
      .map((file) => file.path)

    expect(unmarked).toEqual([])
  })

  /**
   * And nothing else carries the marking, which is the half that matters when the catalogue grows.
   *
   * The failure this exists for is not a file missing its header - that one is loud, because the
   * guard above names it. It is a file gaining one it should not have: a module of this repository
   * marked MIT-0 by somebody tidying, published under a licence the project did not choose, with
   * nothing anywhere to say so.
   *
   * Over every tracked file rather than over `contracts/`, because the mistake has no reason to
   * respect a folder.
   */
  it('nothing-the-installer-does-not-copy-is-marked', () => {
    const copied = new Set(copiedFiles().map((file) => file.path))
    const strays = trackedFiles().filter((path) => !copied.has(path) && isMarked(textOf(path)))

    expect(strays).toEqual([])
  })

  /**
   * The origin is spelled in one production module, and in the headers a guard has already resolved.
   *
   * **Production TypeScript is the population, and the exclusions are principled rather than
   * convenient.** A battery holds the source text of the defects it injects, so `mutation/` spells
   * whatever it mutates - W-59 of the site battery exists precisely to write a second origin into a
   * file and watch a guard redden. A test may quote what it asserts about. Neither is published. What
   * is published is this list, and a wrong URL in it is a link that is dead in every artefact that
   * ever carried it.
   */
  it('the-origin-is-spelled-only-where-a-guard-resolves-it', () => {
    const allowed = new Set(['packages/registry/address.ts', ...copiedFiles().map((file) => file.path)])
    const production = trackedFiles().filter(
      (path) =>
        path.endsWith('.ts') &&
        !path.endsWith('.test.ts') &&
        !path.endsWith('.test-d.ts') &&
        !path.startsWith('mutation/'),
    )

    expect(production.filter((path) => !allowed.has(path) && textOf(path).includes(THE_ORIGIN))).toEqual(
      [],
    )
  })

  /**
   * The npm page and the code agree, on every field of the manifest that is a fact rather than prose.
   *
   * **No count is carried, and the reason is that the one that used to be here was wrong.** It read
   * *the four fields* while asserting five, because `engines` was added and the sentence was not. The
   * population is what the paragraph below states - every field that resolves to something declared in
   * code - and that is true without counting.
   *
   * `package.json` cannot import, so these are transcriptions and this is what resolves them. The
   * fields nobody can derive - a description, a keyword list - are not asserted here: a guard
   * comparing prose against prose would be a copy of the prose.
   *
   * **It read two of them for as long as it existed, and the two it did not read were the two that
   * were missing.** `repository` was absent and `author` carried a name with no address, so the guard
   * whose subject is *what npm shows* was green over a page offering no link to the code. A guard that
   * names a population and enumerates part of it is the shape this repository keeps finding, and the
   * repair is the population rather than the two entries: these are every field of the manifest that
   * resolves to something declared in code, and the day a fifth is declared it belongs here.
   *
   * `type: 'git'` is npm's schema rather than our fact, so it is spelled here beside the manifest it
   * describes and not in `publication.ts`, which holds the address.
   */
  it('the-public-fields-npm-shows-are-the-ones-this-code-declares', () => {
    const manifest = JSON.parse(readFileSync(join(REPOSITORY_ROOT, 'package.json'), 'utf8')) as {
      readonly name?: unknown
      readonly license?: unknown
      readonly homepage?: unknown
      readonly repository?: unknown
      readonly author?: unknown
      readonly engines?: unknown
      readonly version?: unknown
      readonly bin?: Readonly<Record<string, unknown>>
    }

    expect(manifest.name).toBe(THE_PACKAGE_NAME)
    // The key and not the path: npm writes the shim from the key, so a `bin` naming another command
    // is `npx toopo` reaching nothing, on the one field a first publication settles for ever.
    expect(Object.keys(manifest.bin ?? {})).toEqual([THE_PACKAGE_NAME])
    expect(manifest.license).toBe(THE_REPOSITORY_LICENCE)
    expect(manifest.homepage).toBe(THE_ORIGIN)
    expect(manifest.repository).toEqual({ type: 'git', url: THE_SOURCE_REPOSITORY })
    expect(manifest.author).toBe(THE_AUTHOR_FIELD)
    expect(manifest.engines).toEqual({ node: THE_MINIMUM_RUNTIME })
    expect(manifest.version).toBe(THE_PACKAGE_VERSION)
  })

  /**
   * The catch that stopped an accidental publication is gone, and this is what says so out loud.
   *
   * `private: true` was stage rule 4 for the whole of this repository's private life, and removing it
   * is the deliberate act this unit exists to take rather than an omission. It is asserted here, on the
   * field's *absence*, because a guard over a value that must not be present is the only shape that
   * reddens the day somebody puts it back - and putting it back is now a change that would make every
   * publication fail with `npm ERR! This package has been marked as private`.
   *
   * **What stops a publication nobody decided is no longer this field.** Nothing in this repository
   * runs `npm publish`: the workflow's token is `contents: read`, there is no npm credential on any
   * runner, and `prepack` builds rather than publishes. That is the whole of the answer, and it is
   * written here because this is where a reader will come looking for the catch that used to be.
   */
  it('the-manifest-carries-no-private-flag-and-the-catch-that-replaces-it-is-named', () => {
    const manifest = JSON.parse(readFileSync(join(REPOSITORY_ROOT, 'package.json'), 'utf8')) as {
      readonly private?: unknown
      readonly scripts?: Readonly<Record<string, string>>
    }

    expect(manifest.private).toBeUndefined()
    expect(Object.values(manifest.scripts ?? {}).filter((line) => line.includes('npm publish'))).toEqual(
      [],
    )
  })

  /**
   * What the front page says the catalogue is, resolved against what the registry declares it is.
   *
   * **The sentence read *Five contracts, four of them installable* and nothing kept it.** Spelled out,
   * it could not be resolved against anything without a table mapping words to integers - which is a
   * second statement of the arithmetic, free to be wrong in its own way - so it was written in digits
   * and pointed at `theCatalogue`. That is the same repair `mutation/readme.test.ts` already applies to
   * every figure the README publishes about the instrument, arriving on the one figure it publishes
   * about the catalogue.
   *
   * It is here rather than beside those, because `mutation/` may not import the registry: the
   * dependency runs the other way, and `publication.test.ts` is already where what this repository
   * states about itself is resolved.
   */
  it('the-readme-counts-the-catalogue-the-registry-declares', () => {
    const refused = theCatalogue.filter((source) => source.lifecycle.state === 'never-published')
    const readme = readFileSync(join(REPOSITORY_ROOT, 'README.md'), 'utf8').replace(/\s+/g, ' ')

    expect(refused.length).toBeGreaterThan(0)
    expect(readme).toContain(
      `**${theCatalogue.length} contracts, ${theCatalogue.length - refused.length} of them installable and ` +
        `${refused.length} refused.**`,
    )
  })

  /**
   * The header `LICENSE` shows a reader is a header this repository really writes.
   *
   * An example is the part of a licence a reader trusts most and the part nothing checks: it is quoted,
   * so it cannot be reached by the marking guards above, and it is the only place somebody meets the
   * two lines before deciding what they are allowed to do. So the quoted lines are read back out and
   * required to be exactly some contract's own header.
   */
  it('the-licence-file-quotes-a-header-a-contract-really-carries', () => {
    const quoted = [...textOf('LICENSE').matchAll(/^\s+(\/\/ .*)$/gm)].map((match) => match[1])
    const real = theCatalogue.map((source) => ({
      address: renderContract(source.address),
      lines: licenceHeaderOf(source.address, source.banner).split('\n').filter(Boolean),
    }))

    expect(quoted.length).toBeGreaterThan(0)
    expect(real.filter((entry) => entry.lines.every((line) => quoted.includes(line)))).toHaveLength(1)
  })

  /**
   * And it is an example of the form a reader will actually receive.
   *
   * Two banner forms exist and `LICENSE` can show one, so which one is a decision rather than a
   * detail: the example is what somebody takes for the rule, and a reader who installs a contract
   * written this year and finds a copyright line in the example has been taught the wrong rule about
   * the file in front of them.
   *
   * **The rule is derived and not a convention.** The example must be of the current banner, and the
   * current banner is what a contract not yet published carries - so on the day a form is superseded
   * this reddens by itself rather than waiting for somebody to remember `LICENSE` exists. It is
   * satisfiable today only because `array/group-by@1` is bound by nothing and could move; had the
   * catalogue held six published contracts and no refused one, the example would have had to stay on
   * the old form and this guard could not have been written. ADR-0159.
   */
  it('the-licence-file-shows-the-banner-a-reader-would-receive', () => {
    const quoted = [...textOf('LICENSE').matchAll(/^\s+(\/\/ .*)$/gm)].map((match) => match[1])
    const shown = theCatalogue.filter((source) =>
      licenceHeaderOf(source.address, source.banner)
        .split('\n')
        .filter(Boolean)
        .every((line) => quoted.includes(line)),
    )

    expect(shown.map((source) => source.banner)).toEqual([THE_CURRENT_BANNER])
  })

  /**
   * A contract whose bytes are still free carries the banner this repository writes today.
   *
   * The condition is about the bytes and not about the calendar. A published contract's
   * `reference.ts` is frozen by a digest somebody else's lockfile holds, so it keeps whatever header
   * it was published with and permanent rule 6 is why. A contract that has never been published is
   * bound by nothing, so it has no reason to carry a superseded header and every reason not to ship
   * one - which is what makes this a rule rather than an exception written for the one contract that
   * happens to satisfy it.
   *
   * `array/group-by@1` is that contract today, and it is the only instance either branch of
   * `licenceHeaderOf` has outside the published five.
   *
   * **It reports addresses and never the sources themselves, and that is not a nicety.** A
   * `ContractSource` carries `module` - the contract's whole namespace - so an expectation holding one
   * renders the entire contract when it fails. Measured: the first version of this guard printed
   * 1 177 066 bytes on a red run, against the 1 048 576 that `execFileSync` buffers by default, so the
   * mutation instrument's child was killed before vitest wrote its report and the cell that reddens
   * this guard was measured `killed-by-typecheck` - a mutant that ran and was caught, reported as one
   * that did not compile. ADR-0159 carries the instrument's half of that.
   */
  it('a-contract-not-yet-published-carries-the-current-banner', () => {
    const free = theCatalogue.filter((source) => source.lifecycle.state === 'never-published')
    const wrong = free
      .filter((source) => source.banner !== THE_CURRENT_BANNER)
      .map((source) => `${renderContract(source.address)}: ${source.banner}`)

    expect(free.length).toBeGreaterThan(0)
    expect(wrong).toEqual([])
  })

  /**
   * Every address this catalogue published is one the ledger still binds. ADR-0260.
   *
   * **The freeze cannot ask this, and that is what the guard is for.** `the-freeze.test.ts` rebuilds
   * every binding `bindingsOf(ledger)` returns, so its population *is* the ledger — and a binding
   * that stops being in the ledger leaves the population rather than failing in it. Measured: with
   * `object/deep-equal@1` set to `not-yet-published`, the printed ledger goes from 1 206 bytes to
   * **998** and the freeze answers **3 passed**. A contract published and frozen for life left the
   * ledger and nothing said so.
   *
   * **`THE_PUBLICATIONS` is the population that does not shrink**, because it is the record of what
   * was published and from which commit rather than a reading of what the catalogue holds today. So
   * it is the expectation and the ledger is the answer, which is the way round the freeze has not
   * got.
   *
   * It is here and not beside the freeze for a reason of witness: that suite is replayed by no
   * battery — ADR-0107 says why — so a guard written there could never be seen red by the instrument.
   * `registry-storage` injects into this folder.
   */
  it('every-address-this-catalogue-published-is-one-the-ledger-still-binds', () => {
    const bound = new Set(theLocalLedger().contracts.map((entry) => renderContract(entry.address)))
    const published = Object.keys(THE_PUBLICATIONS)

    expect(published.length).toBeGreaterThan(0)
    expect(
      published.filter((what) => !bound.has(what)),
      'an address this repository published that this tree no longer binds. The freeze cannot see ' +
        'this: its population is the ledger, so a binding that leaves it leaves the check.',
    ).toEqual([])
  })

  /**
   * Every contract this catalogue holds is one the ledger binds or refuses. ADR-0261.
   *
   * **This is the guard whose absence let a lifecycle state mint nothing.** `bindingsAtRevision` runs
   * the ledger script *of the commit it rebuilds*, so an artefact is reconstructible at a revision
   * exactly when that revision's ledger holds an entry for it — and ADR-0106's coordinate for a
   * contract binding is the commit *before* the publication, at which the contract is not yet
   * published. A state that answers neither list therefore costs nothing today and costs the rebuild
   * of the freeze at the next publication, which is a failure with no event until somebody publishes.
   *
   * **It is total over the catalogue rather than filtered by state**, which is what lets it be
   * non-empty today and what makes it fire on a state nobody has written yet: a fifth arm, or a
   * fourth that stops minting, leaves a contract answered by nothing.
   *
   * It says nothing about *which* list, deliberately. Refusing and binding are two different acts and
   * the guard beside this one is where the published half is held; what is claimed here is only that
   * a contract of this catalogue is somewhere the ledger can be asked about.
   */
  it('every-contract-this-catalogue-holds-is-one-the-ledger-binds-or-refuses', () => {
    const ledger = theLocalLedger()
    const answered = new Set([
      ...ledger.contracts.map((entry) => renderContract(entry.address)),
      ...ledger.refusals.map((entry) => renderContract(entry.address)),
    ])
    const held = theCatalogue.map((source) => renderContract(source.address))

    expect(held.length).toBeGreaterThan(0)
    expect(
      held.filter((what) => !answered.has(what)),
      'a contract this catalogue holds that the ledger neither binds nor refuses. Nothing can be ' +
        'rebuilt at a commit whose ledger has no entry for it, so a publication naming a commit at ' +
        'which it stood here would name a commit that binds nothing.',
    ).toEqual([])
  })

  /**
   * A contract binding is anchored exactly where this repository published it. ADR-0261.
   *
   * **Anchoring is what freezes for life, and it is carried by the coordinate rather than by the
   * existence of the binding.** `isAnchored` partitions on `publishedFrom !== THE_UNPUBLISHED_REVISION`,
   * `rebindingFaults` rebuilds only the anchored half, and `THE_PUBLICATIONS[…] ?? THE_UNPUBLISHED_PUBLICATION`
   * is the lookup that decides which side a contract lands on. So the three things the ledger used to
   * confound are separable: a binding makes an artefact rebuildable, an anchor freezes it, and
   * `installable` is what a reader may take.
   *
   * **Both directions are faults and the guard says `exactly` for that reason.** Published and
   * unanchored is permanent rule 6 stopping without a word — which is what an unconditional stand-in
   * for the unpublished state would have produced, and why that option was refused before the probe.
   * Unpublished and anchored is a coordinate claiming a publication that never happened, which the
   * freeze would then try to rebuild.
   *
   * Contracts only: `THE_PUBLICATIONS` is keyed by a contract's rendering, and an implementation
   * renders as something else. The lifecycle decides a contract's binding and the reference travels
   * with it.
   */
  it('a-contract-binding-is-anchored-exactly-where-this-repository-published-it', () => {
    const ledger = theLocalLedger()
    const unanchored = new Set(unanchoredBindings(ledger))
    const published = new Set(Object.keys(THE_PUBLICATIONS))
    const bound = ledger.contracts.map((entry) => renderContract(entry.address))

    expect(bound.length).toBeGreaterThan(0)
    expect(
      bound.filter((what) => published.has(what) === unanchored.has(what)),
      'a contract binding whose anchor and whose publication disagree. Anchored where nothing was ' +
        'published is a coordinate for a publication that never happened; unanchored where ' +
        'something was is a published version quietly leaving the freeze.',
    ).toEqual([])
  })
})
