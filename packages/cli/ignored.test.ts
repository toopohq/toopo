import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterAll, describe, it, expect } from 'vitest'

import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import { CONFIGURATION_FILE } from './configuration.js'
import { CHECK_IGNORE, gitIgnores } from './ignored.js'
import { LOCKFILE } from './lockfile.js'
import { removeDirectory } from './remove-directory.js'
import { THE_ENTRY_POINT, aProject } from './temporary-project.js'
import type { TemporaryProject } from './temporary-project.js'

/**
 * The one question this tool asks somebody else's git, and the promise that asking it changes nothing.
 *
 * `ignored.ts` carries the argument and the measurements. What is guarded here is the convention of an
 * external tool - which this repository pins rather than assumes, the treatment `node:util.diff`'s
 * operation codes already have - and the boundary that makes asking affordable at all.
 */

/** A project inside a real repository, because git is the only thing that can answer this. */
const inRepository = <T>(
  gitignore: string,
  use: (project: TemporaryProject) => T,
): T => {
  const project = aProject()
  try {
    project.write('.gitignore', gitignore)
    for (const argv of [
      ['init', '-q'],
      ['config', 'user.email', 'guard@toopo.dev'],
      ['config', 'user.name', 'guard'],
      ['add', '-A'],
      ['commit', '-qm', 'a project'],
    ]) {
      execFileSync('git', argv, { cwd: project.root, stdio: 'pipe' })
    }

    return use(project)
  } finally {
    project.remove()
  }
}

/**
 * The empty directory that stands in for a `PATH` with no git on it.
 *
 * Made once and removed with the file, rather than once per call. It used to be made per call and
 * removed never, which is a leak nothing would ever have reported: measured, one directory per run of
 * this suite, and 1 933 of them under the operating system's temporary directory on the machine where
 * this was found.
 */
const NO_GIT_PATH = mkdtempSync(join(tmpdir(), 'toopo-no-git-'))

afterAll(() => {
  removeDirectory(NO_GIT_PATH)
})

/** An environment in which `git` cannot be found, which is the third outcome and the commonest one. */
const withNoGit = (): NodeJS.ProcessEnv =>
  // Both spellings, because Windows resolves the variable case-insensitively and a JavaScript object
  // does not: setting only `PATH` beside an inherited `Path` leaves git perfectly reachable.
  ({ ...process.env, PATH: NO_GIT_PATH, Path: NO_GIT_PATH })

/**
 * A screen as one run of words, for asserting a sentence rather than a layout.
 *
 * `report.ts` wraps every paragraph at a fixed width, so a phrase long enough to be worth asserting is
 * a phrase that crosses a line break. Asserting the wrapped form would make every guard here a guard
 * about the wrapping width.
 */
const said = (screen: string): string => screen.replace(/\s+/g, ' ')

const installedDigests = (project: TemporaryProject): Readonly<Record<string, string>> => {
  const lockfile = JSON.parse(readFileSync(join(project.root, LOCKFILE), 'utf8')) as {
    readonly features: readonly { readonly files: readonly { readonly path: string }[] }[]
  }

  return Object.fromEntries(
    lockfile.features.flatMap((feature) =>
      feature.files.map((file) => [
        file.path,
        digestOfBytes(
          servedBytes(readFileSync(join(project.root, 'lib/toopo', file.path))),
        ),
      ]),
    ),
  )
}

/**
 * The lockfile without the one field two runs cannot agree on.
 *
 * `installedAt` is a clock, so it differs between any two runs and has nothing to do with git. It is
 * named and dropped rather than left to make the comparison fail, because a guard that compared it
 * would be a guard nobody could keep green and everybody would weaken.
 */
const lockfileWithoutTheClock = (project: TemporaryProject): unknown => {
  const held = JSON.parse(readFileSync(join(project.root, LOCKFILE), 'utf8')) as {
    readonly features: readonly Readonly<Record<string, unknown>>[]
  }

  return {
    ...held,
    features: held.features.map(({ installedAt, ...rest }) => rest),
  }
}

describe('what git is asked, and what asking may not change', () => {
  /**
   * The convention of an external tool, pinned because this repository depends on it.
   *
   * All four outcomes together rather than four guards, because they are one partition and what is
   * worth catching is an answer moving between arms. The fourth is the one that would have been got
   * wrong by reading a flag's name: `git check-ignore` consults the index, so a folder holding a
   * tracked file is **not** ignored however well the pattern matches - which is why `--no-index` is not
   * passed, and passing it would turn a project that force-added its folder into a false warning.
   */
  it('git-answers-whether-the-folder-is-ignored-and-says-nothing-when-it-cannot', () => {
    expect(CHECK_IGNORE).toEqual({ IGNORED: 0, NOT_IGNORED: 1 })

    inRepository('node_modules/\nlib/\n', (project) => {
      expect(gitIgnores(project.root, 'lib/toopo')).toBe(true)
      expect(gitIgnores(project.root, 'app/toopo')).toBe(false)

      // `lib/` with no leading slash matches a directory of that name at any depth, which is what
      // exposes both branches of `proposeDirectory` rather than only the one without `src`.
      expect(gitIgnores(project.root, 'src/lib/toopo')).toBe(true)

      project.write('lib/toopo/kept.ts', 'export const kept = 1\n')
      execFileSync('git', ['add', '-f', 'lib/toopo/kept.ts'], { cwd: project.root, stdio: 'pipe' })
      execFileSync('git', ['commit', '-qm', 'forced'], { cwd: project.root, stdio: 'pipe' })

      expect(gitIgnores(project.root, 'lib/toopo')).toBe(false)
    })

    // Not a repository at all: git answers 128, and this says nothing rather than guessing.
    const outside = aProject()
    try {
      expect(gitIgnores(outside.root, 'lib/toopo')).toBeNull()
    } finally {
      outside.remove()
    }
  })

  /**
   * **The boundary, measured rather than read off a sentence.**
   *
   * `command.ts` says everything this tool *decides* is reachable from a guard with no process. Asking
   * git is not a decision, and this is what turns that reading into a fact: the same install is run in
   * two identical projects, one where git answers and one where `git` cannot be found at all, and every
   * installed byte, the lockfile and `toopo.json` are compared. Only the advice differs.
   *
   * If the answer ever reached a file, a digest or a lockfile entry, this is what would say so.
   */
  it('an-installation-is-the-same-with-git-and-without', () => {
    const IGNORING = 'node_modules/\nlib/\n'

    const withGit = inRepository(IGNORING, (project) => {
      const screen = execFileSync(process.execPath, [THE_ENTRY_POINT, 'add', 'string/slugify'], {
        cwd: project.root,
        encoding: 'utf8',
      })

      return {
        screen,
        digests: installedDigests(project),
        lockfile: lockfileWithoutTheClock(project),
        configuration: readFileSync(join(project.root, CONFIGURATION_FILE), 'utf8'),
      }
    })

    const blind = inRepository(IGNORING, (project) => {
      const screen = execFileSync(process.execPath, [THE_ENTRY_POINT, 'add', 'string/slugify'], {
        cwd: project.root,
        encoding: 'utf8',
        env: withNoGit(),
      })

      return {
        screen,
        digests: installedDigests(project),
        lockfile: lockfileWithoutTheClock(project),
        configuration: readFileSync(join(project.root, CONFIGURATION_FILE), 'utf8'),
      }
    })

    expect(blind.digests).toEqual(withGit.digests)
    expect(Object.keys(blind.digests).length).toBeGreaterThan(0)
    expect(blind.lockfile).toEqual(withGit.lockfile)
    expect(blind.configuration).toBe(withGit.configuration)

    // And the one thing that does differ, so that the comparison above is not two identical silences.
    expect(said(withGit.screen)).toContain('git ignores lib/toopo/')
    expect(said(blind.screen)).not.toContain('git ignores')
    expect(said(blind.screen)).toContain('Commit toopo.json, toopo.lock and lib/toopo/')
  })

  /**
   * The sentence a reader in an ignored project gets instead of one their project makes impossible.
   *
   * It replaces the advice rather than sitting beside it: *commit this folder* and *git will not let
   * you* on one screen is a tool arguing with itself, and the reader believes neither.
   */
  it('an-ignored-folder-is-told-about-instead-of-being-told-to-commit-it', () => {
    inRepository('node_modules/\nlib/\n', (project) => {
      const screen = execFileSync(process.execPath, [THE_ENTRY_POINT, 'add', 'string/slugify'], {
        cwd: project.root,
        encoding: 'utf8',
      })

      expect(said(screen)).toContain('git ignores lib/toopo/')
      expect(said(screen)).toContain('a lockfile naming files that are not there')
      expect(said(screen)).not.toContain('Commit toopo.json, toopo.lock and')
    })
  })
})
