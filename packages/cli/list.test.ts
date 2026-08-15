import { rmSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import type { Lockfile } from '../registry/implementation-record.js'
import { deciding } from './fixpoint.js'
import { imaginedSource } from './imagined-source.js'
import { prepareInstallation } from './install.js'
import { listProject } from './list.js'
import { renderList } from './report.js'
import type { TemporaryProject } from './temporary-project.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'

/**
 * `toopo list` - what this project holds, answered by the project and by nothing else.
 *
 * Which commands answer with no registry at all is `command.test.ts`'s, and it is a map that guard
 * produces rather than a sentence either file writes. This one used to call itself the only one, which
 * was false from its first day.
 *
 * What is worth guarding is the half that could have been written the lazy way. The lockfile carries
 * `locallyModified` and reading it would have been one field access; every file is hashed against the
 * `sha256` the lockfile recorded instead, so an edit made since the last command is visible and a
 * deleted file is named. A listing that reported our own bookkeeping back to us would be a command
 * whose answer is always that everything is fine.
 */

const installed = async (): Promise<{
  readonly project: TemporaryProject
  readonly lockfile: Lockfile
}> => {
  const project = aProject()
  const { answer: outcome } = await deciding(imaginedSource(), (held) =>
    prepareInstallation(held, {
      root: project.root,
      configuration: project.configuration,
      lockfile: EMPTY_LOCKFILE,
      contract: 'number/round',
      implementation: null,
      at: A_PINNED_INSTANT,
    }),
  )

  if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))

  return { project, lockfile: committing(project, outcome.installation) }
}

/** `return await`, because the `finally` would otherwise remove the project under an async callback. */
const inProject = async <T>(
  use: (project: TemporaryProject, lockfile: Lockfile) => T | Promise<T>,
): Promise<T> => {
  const { project, lockfile } = await installed()
  try {
    return await use(project, lockfile)
  } finally {
    project.remove()
  }
}

describe('what this project holds', () => {
  /**
   * Every feature, what it is, and whether the user asked for it - which is the fact `toopo remove`
   * refuses on and the one nobody could see before.
   */
  it('every-installed-feature-is-named-with-whether-it-was-asked-for', async () => {
    await inProject((project, lockfile) => {
      const listing = listProject(project.root, project.configuration, lockfile)

      expect(
        listing.features.map((feature) => [renderContract(feature.contract), feature.askedFor]),
      ).toEqual([
        ['typescript/number/clamp@1', false],
        ['typescript/number/round@1', true],
        ['typescript/number/sign@1', false],
        ['typescript/string/pad@1', false],
      ])
      expect(listing.files).toBe(5)
      expect(listing.bytes).toBeGreaterThan(0)

      const screen = renderList(listing, project.configuration)
      expect(screen).toContain('4 features · 5 files')
      expect(screen).toContain('typescript/number/round@1 · reference@1.0.0 · you asked for it')
      expect(screen).toContain('typescript/string/pad@1 · reference@1.0.0 · pulled in as a dependency')
      expect(screen).toContain('src/lib/toopo/number/round/round.ts')
    })
  })

  /**
   * The disk is what is read, and the lockfile's own opinion of itself is not.
   *
   * `locallyModified` is false on every entry here - it was written by an install that had just put
   * the files there - and the file has been edited since. A listing that trusted the field would
   * answer that nothing has changed, which is the one answer this command must never give wrongly.
   */
  it('the-listing-hashes-the-disk-rather-than-reading-what-we-recorded', async () => {
    await inProject((project, lockfile) => {
      expect(lockfile.features.every((feature) => !feature.locallyModified)).toBe(true)

      project.write('src/lib/toopo/number/round/round.ts', 'export const round = "mine"\n')
      const listing = listProject(project.root, project.configuration, lockfile)

      expect(
        listing.features
          .flatMap((feature) => feature.files)
          .filter((file) => file.standing !== 'as-written')
          .map((file) => [file.path, file.standing]),
      ).toEqual([['number/round/round.ts', 'edited']])
      expect(renderList(listing, project.configuration)).toContain('edited')
    })
  })

  /** A file that is gone is named as missing, with the command that puts it back. */
  it('a-file-that-is-gone-is-named-with-what-puts-it-back', async () => {
    await inProject((project, lockfile) => {
      rmSync(join(project.root, 'src/lib/toopo/string/pad/digits.ts'))

      const listing = listProject(project.root, project.configuration, lockfile)
      const screen = renderList(listing, project.configuration)

      expect(
        listing.features
          .flatMap((feature) => feature.files)
          .filter((file) => file.standing === 'missing')
          .map((file) => file.path),
      ).toEqual(['string/pad/digits.ts'])
      expect(screen).toContain('missing')
      // Not `toopo update --apply` and not *puts it back*: a missing file whose feature carries a
      // conflict elsewhere is held back whole and comes back on no run. What that command does first
      // is show, and that is what this may promise.
      expect(screen).toContain('`toopo update` shows what would be put back')
    })
  })

  /**
   * A project with a lockfile and nothing in it says so, and says what to type next.
   *
   * A command that printed a blank screen would leave the reader unsure whether it had run.
   */
  it('a-project-holding-nothing-says-so-rather-than-printing-a-blank-screen', () => {
    const project = aProject()
    try {
      const screen = renderList(
        listProject(project.root, project.configuration, EMPTY_LOCKFILE),
        project.configuration,
      )

      expect(screen).toContain('toopo.lock records nothing installed')
      expect(screen).toContain('toopo search')
    } finally {
      project.remove()
    }
  })
})
