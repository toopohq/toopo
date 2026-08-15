import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import type { Lockfile } from '../packages/registry/implementation-record.js'
import { readConfiguration, writeConfiguration } from './configuration.js'
import { deciding } from './fixpoint.js'
import { imaginedSource } from './imagined-source.js'
import { prepareInstallation } from './install.js'
import { filesToMove, pathsLeftBehind, planRelocation, whatMoves } from './relocate.js'
import type { TemporaryProject } from './temporary-project.js'
import {
  A_PINNED_INSTANT,
  EMPTY_LOCKFILE,
  THE_ENTRY_POINT,
  aProject,
  committing,
} from './temporary-project.js'
import { commit } from './write.js'

/**
 * The folder moving, and what the project holds afterwards.
 *
 * The hole this closes was found by following this tool's own advice: a user whose folder git ignores
 * is told to pick one that is committed, obeys, and used to be left with a copy claimed by nobody
 * inside the folder git ignores - where nothing would ever mention it again.
 *
 * What every guard here is really asking is whether the project is **coherent** afterwards: exactly one
 * copy of every file, in the folder the configuration names, with the lockfile still describing it. The
 * two designs this one replaced fail that by construction rather than by accident.
 */

const FROM = 'src/lib/toopo'
const TO = 'app/toopo'

/** Five files across four features, which is the only graph in this repository with a shared file. */
const installed = async (): Promise<{
  readonly project: TemporaryProject
  readonly lockfile: Lockfile
}> => {
  const project = aProject(FROM)
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

const HERE = { version: 1, directory: FROM } as const
const THERE = { version: 1, directory: TO } as const

/** Move the folder the way `toopo init --dir` does, through the one function that writes. */
const moveIt = (project: TemporaryProject, lockfile: Lockfile): string | null => {
  const change = whatMoves(project.root, HERE, THERE, lockfile)
  if (!('moving' in change)) throw new Error(JSON.stringify(change))

  const written = commit(project.root, TO, {
    writes: filesToMove(change.moving.relocation),
    removals: pathsLeftBehind(change.moving.relocation),
    leaving: FROM,
    lockfile: change.moving.lockfile,
    configuration: THERE,
  })

  if ('faults' in written) throw new Error(written.faults.join('\n'))

  return written.leftBehind
}

describe('the configured folder moving', () => {
  /**
   * Every file lands under the new folder, none is left under the old, and no byte changes.
   *
   * The bytes matter more than the paths: nothing that decides a byte in this folder can see the
   * configured directory, so a relocation that rewrote anything would be a defect rather than a
   * feature. Measured over the shared blob too - `string/pad/digits.ts` is the file two carriers name.
   */
  it('every-installed-file-moves-and-not-one-byte-changes', async () => {
    await inProject((project, lockfile) => {
      const before = new Map(
        lockfile.features.flatMap((feature) =>
          feature.files.map(
            (file) => [file.path, readFileSync(join(project.root, FROM, file.path))] as const,
          ),
        ),
      )

      expect(before.size).toBe(5)
      moveIt(project, lockfile)

      for (const [path, bytes] of before) {
        expect(readFileSync(join(project.root, TO, path))).toEqual(bytes)
        expect(existsSync(join(project.root, FROM, path))).toBe(false)
      }
    })
  })

  /**
   * The lockfile comes out exactly as it went in, and that is what makes a relocation a renaming.
   *
   * Its paths are relative to the configured directory and never name it, so there is nothing in it for
   * a folder change to touch - no digest recomputed, no import repointed, and nothing asked of a
   * registry. A guard rather than a remark, because the day one of those becomes false this is what
   * says so.
   */
  it('a-relocation-leaves-the-lockfile-exactly-as-it-was', async () => {
    await inProject((project, lockfile) => {
      moveIt(project, lockfile)

      expect(readFileSync(join(project.root, 'toopo.lock'), 'utf8')).toBe(
        `${JSON.stringify(lockfile, null, 2)}\n`,
      )
    })
  })

  /**
   * A file the user edited is carried across with the edit in it.
   *
   * **This is the property that decided the design.** Refusing the folder change would have named a way
   * out - take everything out and put it back - that permanent rule 4 stops on exactly this project:
   * `toopo remove` holds an edited feature back, correctly, and the only way through it costs the user
   * their own work. A move has nothing to re-fetch, so it has nothing to lose.
   */
  it('a-file-the-user-edited-moves-with-the-edit-in-it', async () => {
    await inProject((project, lockfile) => {
      project.write(`${FROM}/number/round/round.ts`, 'export const round = "mine"\n')
      moveIt(project, lockfile)

      expect(readFileSync(join(project.root, TO, 'number/round/round.ts'), 'utf8')).toBe(
        'export const round = "mine"\n',
      )
    })
  })

  /**
   * A destination already holding exactly these bytes is a move that happened, not a file to refuse.
   *
   * `commit` renames every staged file into place and only then removes the old copies, so a run killed
   * between the two leaves the files at both paths with `toopo.json` still naming the old folder.
   * Without this answer the retry would meet an occupied destination and refuse - the project stuck by
   * the rule that exists to protect it, on a state this tool produced itself.
   */
  it('a-destination-already-holding-our-bytes-is-a-move-that-happened', async () => {
    await inProject((project, lockfile) => {
      const path = 'string/pad/digits.ts'
      project.write(`${TO}/${path}`, readFileSync(join(project.root, FROM, path), 'utf8'))

      const change = whatMoves(project.root, HERE, THERE, lockfile)
      if (!('moving' in change)) throw new Error(JSON.stringify(change))

      const { moves } = change.moving.relocation
      expect(moves.find((move) => move.path === path)?.verdict).toBe('already-moved')
      // Not rewritten, and still taken out of the folder being left: the copy exists elsewhere now.
      expect(filesToMove(change.moving.relocation).map((file) => file.path)).not.toContain(path)
      expect(pathsLeftBehind(change.moving.relocation)).toContain(path)

      moveIt(project, lockfile)
      expect(existsSync(join(project.root, FROM, path))).toBe(false)
    })
  })

  /**
   * A destination holding something else refuses the whole move, and the refusal names the path.
   *
   * The whole relocation rather than the offending file: a project half in one folder and half in
   * another is a state no command afterwards could describe, and nothing has been written at the point
   * this answers.
   */
  it('a-destination-holding-something-else-refuses-the-whole-move', async () => {
    await inProject((project, lockfile) => {
      project.write(`${TO}/number/sign/sign.ts`, 'export const sign = "not ours"\n')

      const change = whatMoves(project.root, HERE, THERE, lockfile)

      expect('faults' in change && change.faults).toHaveLength(1)
      expect('faults' in change && change.faults[0]).toContain(`${TO}/number/sign/sign.ts`)
      expect('faults' in change && change.faults[0]).toContain('holds different bytes')
      // Nothing moved, and the file that was there is the one that is there.
      expect(readFileSync(join(project.root, FROM, 'number/round/round.ts'), 'utf8')).toContain('round')
    })
  })

  /**
   * A file the lockfile claims and the disk has not got moves nothing and refuses nothing.
   *
   * There is nothing to carry across, so nothing is written and nothing is overwritten - whatever sits
   * at the destination becomes the project's business under the ordinary rules, where `toopo update`
   * calls it a conflict if it is the user's own. Comparing it here would need bytes this module does
   * not have: an edited file hashes to neither of the lockfile's two digests.
   */
  it('a-file-the-lockfile-claims-and-the-disk-has-not-got-moves-nothing', async () => {
    await inProject((project, lockfile) => {
      rmSync(join(project.root, FROM, 'number/sign/sign.ts'))

      const planned = planRelocation(project.root, FROM, TO, lockfile)
      if (!('relocation' in planned)) throw new Error(JSON.stringify(planned))

      expect(
        planned.relocation.moves
          .filter((move) => move.verdict === 'not-on-disk')
          .map((move) => move.path),
      ).toEqual(['number/sign/sign.ts'])
      expect(pathsLeftBehind(planned.relocation)).not.toContain('number/sign/sign.ts')
      expect(filesToMove(planned.relocation)).toHaveLength(4)
    })
  })

  /**
   * The folder that was left goes, because the screen says the files moved.
   *
   * A folder carrying this tool's name and still sitting there contradicts that sentence, and it would
   * take a second sentence to explain the remnant - which costs more than not leaving one. It is not
   * the rule `emptiedFolders` carries: `remove` must not delete the configured folder because it goes
   * on being the configured folder, and here it stops being one.
   */
  it('the-folder-that-was-left-goes-when-it-is-empty', async () => {
    await inProject((project, lockfile) => {
      expect(moveIt(project, lockfile)).toBe(null)
      expect(existsSync(join(project.root, FROM))).toBe(false)
    })
  })

  /**
   * And stays when the user had put something of their own in it, which is what makes taking it safe.
   *
   * The caller is told which folder it was, because a file of theirs quietly left behind in a folder
   * this tool has stopped naming is the orphan defect again with the roles reversed.
   */
  it('the-folder-that-was-left-stays-when-it-holds-something-else', async () => {
    await inProject((project, lockfile) => {
      project.write(`${FROM}/notes.md`, 'mine\n')

      expect(moveIt(project, lockfile)).toBe(FROM)
      expect(readFileSync(join(project.root, FROM, 'notes.md'), 'utf8')).toBe('mine\n')
    })
  })

  /**
   * Three preconditions, and each of them answers *nothing to move* rather than moving nothing.
   *
   * The middle one is the state `configurationToInstallUnder` refuses for `add`: a lockfile with no
   * configuration beside it. `toopo init --dir` is what repairs it, and there is no old folder to move
   * from - which is exactly why only the user can name the new one.
   */
  it('a-folder-that-is-not-moving-and-a-project-with-nothing-to-move-both-move-nothing', async () => {
    await inProject((project, lockfile) => {
      expect(whatMoves(project.root, HERE, HERE, lockfile)).toEqual({ nothingToMove: true })
      expect(whatMoves(project.root, null, THERE, lockfile)).toEqual({ nothingToMove: true })
      expect(whatMoves(project.root, HERE, THERE, null)).toEqual({ nothingToMove: true })
      expect(whatMoves(project.root, HERE, THERE, EMPTY_LOCKFILE)).toEqual({ nothingToMove: true })
    })
  })

  /**
   * A refused folder change leaves `toopo.json` naming the folder the files are actually in.
   *
   * End to end, because what it guards is an order inside the entry point rather than a value: the
   * refusal has to come before the configuration is written, and a run that had written it first would
   * leave a project whose configuration names a folder nothing is in - which is the very defect this
   * unit exists to close, arriving through the repair for it.
   */
  it('a-refused-folder-change-leaves-the-configuration-naming-the-old-folder', async () => {
    await inProject((project) => {
      writeConfiguration(project.root, HERE)
      project.write(`${TO}/number/sign/sign.ts`, 'export const sign = "not ours"\n')

      expect(() =>
        execFileSync(process.execPath, [THE_ENTRY_POINT, 'init', '--dir', TO], {
          cwd: project.root,
          encoding: 'utf8',
          stdio: 'pipe',
        }),
      ).toThrow()

      expect(readConfiguration(project.root)?.directory).toBe(FROM)
    })
  })
})
