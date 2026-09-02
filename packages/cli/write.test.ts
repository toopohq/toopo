import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { LOCKFILE, readLockfile } from './lockfile.js'
import type { TemporaryProject } from './temporary-project.js'
import { EMPTY_LOCKFILE, aProject } from './temporary-project.js'
import { STAGED, commit } from './write.js'

/**
 * The two phases, and what each of them is allowed to leave behind.
 *
 * Everything here is about a failure rather than about a success, because the success was already
 * measured by every guard of `install.test.ts` - what those cannot show is that a commit which cannot
 * finish leaves a project nobody has to repair by hand.
 */

const A_FILE = (text: string) => ({ path: 'imagined-string/pad.ts', bytes: Buffer.from(text, 'utf8') })
const ANOTHER = (text: string) => ({ path: 'imagined-number/sign.ts', bytes: Buffer.from(text, 'utf8') })

/** Every file under the project, so that a guard can say "and nothing else" rather than "and this". */
const everythingUnder = (at: string): readonly string[] =>
  existsSync(at)
    ? readdirSync(at, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
          ? everythingUnder(join(at, entry.name)).map((held) => `${entry.name}/${held}`)
          : [entry.name],
      )
    : []

const inProject = <T>(use: (project: TemporaryProject) => T): T => {
  const project = aProject()
  try {
    return use(project)
  } finally {
    project.remove()
  }
}

describe('writing into somebody else project', () => {
  it('a-commit-writes-the-files-and-the-lockfile-together', () => {
    inProject((project) => {
      const written = commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 1\n'), ANOTHER('export const sign = 1\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect(written).toEqual({
        written: ['src/lib/toopo/imagined-string/pad.ts', 'src/lib/toopo/imagined-number/sign.ts'],
        leftBehind: null,
      })
      expect(project.installed('imagined-string/pad.ts')).toBe('export const pad = 1\n')
      expect(readLockfile(project.root)).toEqual(EMPTY_LOCKFILE)
    })
  })

  /**
   * Nothing staged survives a commit. A `.toopo-part` left behind is inert - it is not a `.ts` file,
   * so no compiler meets it - but it is litter in somebody's repository, and litter this tool made.
   */
  it('a-commit-leaves-no-staged-file-behind', () => {
    inProject((project) => {
      commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 1\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect(everythingUnder(project.root).filter((path) => path.includes(STAGED))).toEqual([])
    })
  })

  /**
   * The first of the two failures that used to be an unhandled error, and the reason the phases exist.
   *
   * What is arranged here is a file sitting where one of our folders has to go. A permission denial is
   * the same failure through the same catch on the same line, and `breakage.ts` says in as many words
   * that it is not what this measures - a guard cannot arrange one on every platform this runs on.
   */
  it('a-file-where-a-folder-must-go-is-refused-with-nothing-staged', () => {
    inProject((project) => {
      project.write('src/lib/toopo/imagined-string', 'this is a file, not a folder\n')

      const written = commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 1\n'), ANOTHER('export const sign = 1\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect('faults' in written && written.faults).toHaveLength(1)
      expect('faults' in written && written.faults[0]).toContain('src/lib/toopo/imagined-string/pad.ts')

      // The other file of the same commit was staged and abandoned, the lockfile was never written,
      // and the project holds exactly what it held.
      expect(everythingUnder(project.root)).toEqual(['src/lib/toopo/imagined-string'])
      expect(existsSync(join(project.root, LOCKFILE))).toBe(false)
    })
  })

  /**
   * What the two phases are actually worth, and the guard above could not see it.
   *
   * Measured by U-09, which writes each file straight to its destination: the project ends in the
   * same state either way, because the cleanup that removes a staged file removes a directly written
   * one too. What only staging protects is a file that was **already there** - written straight, it is
   * truncated before anybody knows whether the commit can finish, and a refusal three files later
   * leaves the user with neither their version nor ours.
   */
  it('a-refused-commit-does-not-touch-the-file-it-would-replace', () => {
    inProject((project) => {
      project.write('src/lib/toopo/imagined-string/pad.ts', 'export const pad = "what was there"\n')
      mkdirSync(join(project.root, project.configuration.directory, 'imagined-number/sign.ts'), {
        recursive: true,
      })

      const written = commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 2\n'), ANOTHER('export const sign = 2\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect('faults' in written).toBe(true)
      expect(project.installed('imagined-string/pad.ts')).toBe('export const pad = "what was there"\n')
    })
  })

  /**
   * The second one. Measured on Windows, renaming onto a directory is EPERM and says nothing a caller
   * can act on, so the kind of what sits at the destination is asked before anything is staged.
   */
  it('a-directory-where-a-file-goes-is-refused-by-name', () => {
    inProject((project) => {
      mkdirSync(join(project.root, project.configuration.directory, 'imagined-string/pad.ts'), {
        recursive: true,
      })

      const written = commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 1\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect('faults' in written && written.faults).toEqual([
        'src/lib/toopo/imagined-string/pad.ts is a directory in your project, and a file has to go where ' +
          'it is. Toopo will not remove a directory: move it aside and run this again.',
      ])
      expect(existsSync(join(project.root, LOCKFILE))).toBe(false)
    })
  })

  /** A refusal abandons what it staged, including the lockfile it had already written. */
  it('a-refusal-leaves-no-staged-file-behind', () => {
    inProject((project) => {
      mkdirSync(join(project.root, project.configuration.directory, 'imagined-string/pad.ts'), {
        recursive: true,
      })

      commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 1\n'), ANOTHER('export const sign = 1\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect(everythingUnder(project.root).filter((path) => path.includes(STAGED))).toEqual([])
    })
  })

  /**
   * A path that leaves the directory is refused where every other bad destination is, which is in the
   * phase whose whole property is that abandoning it costs nothing.
   */
  it('a-write-that-leaves-the-directory-is-refused-with-nothing-staged', () =>
    inProject((project) => {
      const outcome = commit(project.root, 'src/lib/toopo', {
        writes: [{ path: '../../../elsewhere.ts', bytes: Buffer.from('not ours to write\n', 'utf8') }],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect('faults' in outcome && outcome.faults.length).toBe(1)
      expect('faults' in outcome && outcome.faults[0]).toContain('"../../../elsewhere.ts"')
      expect(everythingUnder(project.root)).toEqual([])
    }))

  /**
   * And a removal is refused in that same phase rather than in its own, which is the half that needed
   * moving: removals happen after the renames, where there is no refusal left to make.
   */
  it('a-removal-that-leaves-the-directory-is-refused-before-anything-is-written', () =>
    inProject((project) => {
      const outcome = commit(project.root, 'src/lib/toopo', {
        writes: [A_FILE('export const pad = 1\n')],
        removals: ['../../../elsewhere.ts'],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect('faults' in outcome && outcome.faults[0]).toContain('"../../../elsewhere.ts"')
      expect(everythingUnder(project.root)).toEqual([])
    }))

  it('a-removal-tidies-the-folder-it-emptied', () => {
    inProject((project) => {
      commit(project.root, project.configuration.directory, {
        writes: [A_FILE('export const pad = 1\n'), ANOTHER('export const sign = 1\n')],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      commit(project.root, project.configuration.directory, {
        writes: [],
        removals: ['imagined-string/pad.ts'],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      // The folder and not only the files: an emptied directory holds nothing, so a walk that lists
      // files alone cannot tell one that was tidied away from one that was left behind. Measured by
      // U-13, which this assertion did not see until it asked about the folder itself.
      expect(everythingUnder(join(project.root, project.configuration.directory))).toEqual([
        'imagined-number/sign.ts',
      ])
      expect(existsSync(join(project.root, project.configuration.directory, 'imagined-string/pad'))).toBe(false)
      expect(existsSync(join(project.root, project.configuration.directory, 'imagined-string'))).toBe(false)
    })
  })

  /** And stops at the first folder that still holds something, rather than at the configured root. */
  it('a-removal-leaves-a-folder-that-still-holds-something', () => {
    inProject((project) => {
      commit(project.root, project.configuration.directory, {
        writes: [
          A_FILE('export const pad = 1\n'),
          { path: 'imagined-string/pad/digits.ts', bytes: Buffer.from('export const DIGITS = 1\n', 'utf8') },
        ],
        removals: [],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      commit(project.root, project.configuration.directory, {
        writes: [],
        removals: ['imagined-string/pad.ts'],
        leaving: null,
        lockfile: EMPTY_LOCKFILE,
        configuration: null,
      })

      expect(everythingUnder(join(project.root, project.configuration.directory))).toEqual([
        'imagined-string/pad/digits.ts',
      ])
    })
  })
})
