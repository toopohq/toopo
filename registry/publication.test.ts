import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { THE_ORIGIN, renderContract } from './address.js'
import { servedBytes } from './canonical.js'
import { THE_REPOSITORY_LICENCE, isMarked, licenceHeaderOf } from './licence.js'
import { REPOSITORY_ROOT, referenceImplementationOf } from './serialise.js'
import { theFive } from './the-five.js'

/**
 * What this repository states about itself to the outside world, and the one rule all of it obeys.
 *
 * Three facts leave this project and are read by people who cannot check them against anything here:
 * where it is published, what licence covers what, and what npm shows on its page. Each one is
 * declared exactly once in code, transcribed wherever a format cannot import - `package.json` is JSON,
 * `LICENSE` is prose, and an installed file may import nothing at all - and every transcription is
 * resolved against its declaration below.
 *
 * That is `against-the-five.test.ts`'s shape on a second subject, and it is here rather than beside
 * each transcription because the declarations are what the guards share. Splitting them would put four
 * one-guard files in four folders, each holding a copy of how to find the repository root.
 *
 * **The licence perimeter is the load-bearing half.** A wrong origin publishes a broken link, which is
 * repaired by a redirect. A wrong licence marking publishes a legal claim into somebody else's
 * repository, where it is frozen, silent, and ours to have caused.
 */

const trackedFiles = (): readonly string[] =>
  execFileSync('git', ['ls-files'], { cwd: REPOSITORY_ROOT, encoding: 'utf8', maxBuffer: 1 << 26 })
    .split('\n')
    .filter((path) => path !== '')

const textOf = (path: string): string =>
  servedBytes(readFileSync(join(REPOSITORY_ROOT, path))).toString('utf8')

/**
 * What `toopo add` copies, taken from the installer's own answer rather than from a list.
 *
 * `referenceImplementationOf` is what the registry serves as an implementation's files, and it is what
 * `cli/plan.ts` turns into destinations. Reading it here is what makes the perimeter below a derivation
 * instead of a declaration nothing keeps - and the day a contract gains a second file, that file is in
 * this list before anybody has decided anything about it.
 */
const copiedFiles = (): readonly { readonly path: string; readonly header: string }[] =>
  theFive.flatMap((source) =>
    referenceImplementationOf(REPOSITORY_ROOT, source).files.map((file) => ({
      path: `${source.folder}/${file.path}`,
      header: licenceHeaderOf(source.address),
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
    const allowed = new Set(['registry/address.ts', ...copiedFiles().map((file) => file.path)])
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
   * The npm page and the code agree, on the two fields that are facts rather than prose.
   *
   * `package.json` cannot import, so these are transcriptions and this is what resolves them. The
   * fields nobody can derive - a description, a keyword list - are not asserted here: a guard
   * comparing prose against prose would be a copy of the prose.
   */
  it('the-public-fields-npm-shows-are-the-ones-this-code-declares', () => {
    const manifest = JSON.parse(readFileSync(join(REPOSITORY_ROOT, 'package.json'), 'utf8')) as {
      readonly license?: unknown
      readonly homepage?: unknown
    }

    expect(manifest.license).toBe(THE_REPOSITORY_LICENCE)
    expect(manifest.homepage).toBe(THE_ORIGIN)
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
    const real = theFive.map((source) => ({
      address: renderContract(source.address),
      lines: licenceHeaderOf(source.address).split('\n').filter(Boolean),
    }))

    expect(quoted.length).toBeGreaterThan(0)
    expect(real.filter((entry) => entry.lines.every((line) => quoted.includes(line)))).toHaveLength(1)
  })
})
