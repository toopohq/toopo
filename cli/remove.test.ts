import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import type { LockedFeature, Lockfile } from '../registry/implementation-record.js'
import {
  imaginedSource,
  sourceServingBothPublications,
  sourceWithIndependentCarriers,
  updatedImaginedSource,
} from './imagined-source.js'
import { lockfileAfter, prepareInstallation } from './install.js'
import { prepareUpdate } from './update.js'
import type { Removal } from './remove.js'
import { prepareRemoval } from './remove.js'
import { renderRemoval } from './report.js'
import type { RegistrySource } from './source.js'
import type { TemporaryProject } from './temporary-project.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'
import { commit } from './write.js'

/**
 * `toopo remove` - the way out, measured on the only graph that has edges.
 *
 * What is worth guarding here is not that files disappear. It is the four answers that are *not* "the
 * files disappeared": what only this feature pulled in goes with it and nothing else does, a feature
 * another root still imports stays, a feature the user never asked for is refused, and a file they
 * edited is never deleted. Every one of those is a way of getting a removal wrong that leaves the
 * project looking fine.
 *
 * **A green suite is worth less here than anywhere else in this repository**, because this is the one
 * command that deletes somebody's files. Every guard below was seen red on the defect it names before
 * it was trusted, and `mutation/cli-remove.battery.ts` is what keeps that true.
 */

const AT = '2026-08-04T00:00:00.000Z'

/** A project holding these features as roots, installed one after another as `toopo add` would. */
const holding = (
  source: RegistrySource,
  names: readonly string[],
): { readonly project: TemporaryProject; readonly lockfile: Lockfile } => {
  const project = aProject()
  let lockfile = EMPTY_LOCKFILE

  for (const contract of names) {
    const outcome = prepareInstallation(source, {
      root: project.root,
      configuration: project.configuration,
      lockfile,
      contract,
      implementation: null,
      at: A_PINNED_INSTANT,
    })

    if ('faults' in outcome) throw new Error(outcome.faults.join('\n'))

    /**
     * The `unchanged` branch is recorded and not skipped, exactly as `command.ts` records it.
     *
     * Asking by name for something the project already holds as a dependency writes no file and still
     * moves the lockfile: it is the user making that feature a root. A fixture that dropped it would
     * be setting up a project no sequence of real commands produces - which is what this helper did
     * first, and every guard about a second root then measured a project with one.
     */
    const features = 'unchanged' in outcome ? outcome.features : outcome.installation.features
    lockfile =
      'unchanged' in outcome
        ? recording(project, features, lockfile)
        : committing(project, outcome.installation, lockfile)
  }

  return { project, lockfile }
}

/** The lockfile a run that writes no file still leaves behind. */
const recording = (
  project: TemporaryProject,
  features: readonly LockedFeature[],
  lockfile: Lockfile,
): Lockfile => {
  const after = lockfileAfter(lockfile, features)
  const written = commit(project.root, project.configuration.directory, {
    writes: [],
    removals: [],
    lockfile: after,
  })

  if ('faults' in written) throw new Error(written.faults.join('\n'))

  return after
}

const removing = (
  source: RegistrySource,
  project: TemporaryProject,
  lockfile: Lockfile,
  contract: string,
): Removal => {
  const outcome = prepareRemoval(source, {
    root: project.root,
    configuration: project.configuration,
    lockfile,
    contract,
    at: AT,
  })

  if (!('removal' in outcome)) throw new Error(outcome.faults.join('\n'))

  return outcome.removal
}

const refusalOf = (
  source: RegistrySource,
  project: TemporaryProject,
  lockfile: Lockfile,
  contract: string,
): readonly string[] => {
  const outcome = prepareRemoval(source, {
    root: project.root,
    configuration: project.configuration,
    lockfile,
    contract,
    at: AT,
  })

  if (!('faults' in outcome)) throw new Error('the removal was not refused')

  return outcome.faults
}

const applying = (project: TemporaryProject, removal: Removal): void => {
  const written = commit(project.root, project.configuration.directory, {
    writes: removal.reconciliation.writes,
    removals: removal.reconciliation.removals,
    lockfile: removal.reconciliation.lockfile,
  })

  if ('faults' in written) throw new Error(written.faults.join('\n'))
}

const onDisk = (project: TemporaryProject, path: string): boolean =>
  existsSync(join(project.root, project.configuration.directory, path))

const inProject = <T>(
  source: RegistrySource,
  names: readonly string[],
  use: (project: TemporaryProject, lockfile: Lockfile) => T,
): T => {
  const { project, lockfile } = holding(source, names)
  try {
    return use(project, lockfile)
  } finally {
    project.remove()
  }
}

const leaving = (removal: Removal): readonly string[] =>
  removal.reconciliation.features
    .filter((feature) => feature.now === null)
    .map((feature) => renderContract(feature.contract))
    .sort()

const staying = (removal: Removal): readonly string[] =>
  removal.reconciliation.features
    .filter((feature) => feature.now !== null)
    .map((feature) => renderContract(feature.contract))
    .sort()

describe('taking a feature out of a project', () => {
  /**
   * The whole shape of a nominal removal: the root goes, and so does everything it alone pulled in.
   *
   * `number/round@1` is the only root, so its three dependencies have nothing else holding them. What
   * the assertion is careful about is the folder as well as the lockfile - a removal that emptied the
   * record and left the files would be the mirror of the defect this command exists to fix.
   */
  it('a-feature-nothing-else-holds-leaves-with-everything-it-pulled-in', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      const removal = removing(imaginedSource(), project, lockfile, 'number/round')

      expect(removal.departure).toBe('leaves')
      expect(leaving(removal)).toEqual([
        'number/clamp@1',
        'number/round@1',
        'number/sign@1',
        'string/pad@1',
      ])
      expect(staying(removal)).toEqual([])
      expect(removal.reconciliation.writes).toEqual([])

      applying(project, removal)

      expect(removal.reconciliation.lockfile.features).toEqual([])
      expect(onDisk(project, 'number/round/round.ts')).toBe(false)
      expect(onDisk(project, 'string/pad/pad.ts')).toBe(false)
      expect(onDisk(project, 'string/pad/digits.ts')).toBe(false)
    })
  })

  /**
   * Only what the removed feature alone pulled in goes with it, and this is the guard that separates a
   * removal from a `rm -rf`.
   *
   * `number/sign@1` is a root as well as one of `number/round@1`'s dependencies, so removing the round
   * takes `number/clamp@1` - which nothing else reaches - and must leave `number/sign@1` and the
   * `string/pad@1` underneath it exactly where they are.
   */
  it('only-what-the-removed-feature-alone-pulled-in-goes-with-it', () => {
    inProject(imaginedSource(), ['number/round', 'number/sign'], (project, lockfile) => {
      const removal = removing(imaginedSource(), project, lockfile, 'number/round')

      expect(leaving(removal)).toEqual(['number/clamp@1', 'number/round@1'])
      expect(staying(removal)).toEqual(['number/sign@1', 'string/pad@1'])

      applying(project, removal)

      expect(onDisk(project, 'number/round/round.ts')).toBe(false)
      expect(onDisk(project, 'number/clamp/clamp.ts')).toBe(false)
      expect(onDisk(project, 'number/sign/sign.ts')).toBe(true)
      expect(onDisk(project, 'string/pad/pad.ts')).toBe(true)
      expect(onDisk(project, 'string/pad/digits.ts')).toBe(true)
    })
  })

  /**
   * A feature another root still imports stays, stops being a root, and the screen says both.
   *
   * This is the answer that decides whether somebody goes on trusting the tool, because from outside it
   * looks exactly like nothing happened. What did happen is in the lockfile - `askedFor` is false, so
   * it leaves on its own the day nothing reaches it - and it is on the screen in the same breath as the
   * feature that keeps it here.
   */
  it('a-feature-another-root-still-imports-stays-and-stops-being-a-root', () => {
    inProject(imaginedSource(), ['number/round', 'string/pad'], (project, lockfile) => {
      const removal = removing(imaginedSource(), project, lockfile, 'string/pad')

      expect(removal.departure).toBe('stays-as-a-dependency')
      expect(removal.stillReachedBy.map(renderContract)).toEqual(['number/round@1'])
      expect(removal.reconciliation.writes).toEqual([])
      expect(removal.reconciliation.removals).toEqual([])

      const pad = removal.reconciliation.lockfile.features.find(
        (feature) => feature.contract.name === 'string/pad',
      )
      expect(pad?.askedFor).toBe(false)

      const screen = renderRemoval(removal, project.configuration, false)
      expect(screen).toContain('string/pad@1 stays where it is: number/round@1 imports it')
      expect(screen).toContain('no longer something you asked for')

      applying(project, removal)
      expect(onDisk(project, 'string/pad/pad.ts')).toBe(true)
    })
  })

  /**
   * A feature the user never asked for is refused, and the refusal names what imports it.
   *
   * "It is a dependency" is a sentence nobody can act on. The name of the feature that holds it is one
   * they can, and it comes out of the reconciliation's own resolution rather than from a second walk.
   */
  it('a-feature-that-was-never-asked-for-is-refused-with-what-imports-it', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      expect(refusalOf(imaginedSource(), project, lockfile, 'string/pad')).toEqual([
        'string/pad@1 is in this project because number/round@1 imports it, and you never asked for ' +
          'it yourself - so there is nothing of yours to take back. Removing that feature is what ' +
          'would take this one with it.',
      ])
    })

    /**
     * Two of them, and this half is why the sentence is built rather than joined.
     *
     * One dependent makes every way of writing the list identical, so the assertion above passes on a
     * report that names the first of them, or the last, or one at random. `string/pad@1` is reached by
     * both roots here, and a reader told about one of two removes the wrong feature and finds it still
     * there.
     */
    inProject(imaginedSource(), ['number/sign', 'number/clamp'], (project, lockfile) => {
      expect(refusalOf(imaginedSource(), project, lockfile, 'string/pad')).toEqual([
        'string/pad@1 is in this project because number/clamp@1 and number/sign@1 import it, and you ' +
          'never asked for it yourself - so there is nothing of yours to take back. Removing those ' +
          'features is what would take this one with it.',
      ])
    })
  })

  /**
   * A shared file whose carrier leaves is written into the folder of whoever still holds it, and the
   * import inside that folder is repointed at it.
   *
   * **The defect this refuses leaves a project that looks installed and fails at build.** `trim.ts` is
   * carried by `text/left@1` and by `text/right@1`, byte for byte and with no edge between them, so a
   * plan over both writes it once in the left folder and points the right one at
   * `../left/trim.js`. Take the left out and that file has to move - a removal that only deleted would
   * leave `right.ts` importing something that is gone, in a file nobody edited.
   *
   * The main graph cannot express this: there the carrier is always a dependency of its borrower, so it
   * can never leave while the borrower stays, and this whole case sat unreachable behind that accident.
   */
  it('a-shared-file-moves-into-the-folder-of-a-carrier-that-stays', () => {
    const source = sourceWithIndependentCarriers()

    inProject(source, ['text/left', 'text/right'], (project, installed) => {
      // Two `add` calls are two plans, so each writes its own copy; the first plan that sees both is
      // an update, and that is where the deduplication - and therefore this whole case - begins.
      const deduplicated = prepareUpdate(source, {
        root: project.root,
        configuration: project.configuration,
        lockfile: installed,
        at: AT,
      })
      if (!('reconciliation' in deduplicated)) throw new Error(deduplicated.faults.join('\n'))

      const written = commit(project.root, project.configuration.directory, {
        writes: deduplicated.reconciliation.writes,
        removals: deduplicated.reconciliation.removals,
        lockfile: deduplicated.reconciliation.lockfile,
      })
      if ('faults' in written) throw new Error(written.faults.join('\n'))

      const lockfile = deduplicated.reconciliation.lockfile
      expect(project.installed('text/right/right.ts')).toContain("from '../left/trim.js'")
      expect(onDisk(project, 'text/right/trim.ts')).toBe(false)

      const removal = removing(source, project, lockfile, 'text/left')

      expect(leaving(removal)).toEqual(['text/left@1'])
      expect(staying(removal)).toEqual(['text/right@1'])
      expect(removal.reconciliation.writes.map((write) => write.path).sort()).toEqual([
        'text/right/right.ts',
        'text/right/trim.ts',
      ])

      applying(project, removal)

      expect(onDisk(project, 'text/left/trim.ts')).toBe(false)
      expect(onDisk(project, 'text/right/trim.ts')).toBe(true)
      expect(project.installed('text/right/right.ts')).toContain("from './trim.js'")
    })
  })

  /**
   * The features that stay are planned at the version the lockfile records, and never at the one the
   * registry serves today.
   *
   * The registry here has published twice and still serves both, which is what permanent rule 6
   * requires of a real one; a binding by name resolves to the second. A removal that followed it would
   * plan the project against a graph the files on disk are not - and would then decide which files
   * leave from that graph, which is how a blob a dependent still imports gets planned away.
   *
   * So the assertion is that a removal writes **nothing** for the features it keeps, on a registry
   * where an update would rewrite two of them.
   */
  it('the-features-that-stay-are-planned-at-the-version-the-lockfile-records', () => {
    inProject(imaginedSource(), ['number/round', 'number/sign'], (project, lockfile) => {
      const removal = removing(
        sourceServingBothPublications(),
        project,
        lockfile,
        'number/round',
      )

      expect(removal.reconciliation.writes).toEqual([])
      expect(
        removal.reconciliation.features
          .filter((feature) => feature.now !== null)
          .map((feature) => `${renderContract(feature.contract)} ${feature.now?.version}`)
          .sort(),
      ).toEqual(['number/sign@1 1.0.0', 'string/pad@1 1.0.0'])
    })
  })

  /**
   * A file the user edited is never deleted, and it holds its feature back whole.
   *
   * The rule is `update`'s and it is the same rule: this tool does not destroy work. What a removal
   * adds is that the report has to be unmistakable about it, because somebody who asked for a feature
   * to go and finds it still there needs to know in one line that it was their own edit that kept it.
   */
  it('a-file-the-user-edited-is-not-deleted-by-a-removal', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      project.write(
        `${project.configuration.directory}/number/round/round.ts`,
        'export const round = 1\n',
      )

      const removal = removing(imaginedSource(), project, lockfile, 'number/round')
      const round = removal.reconciliation.features.find(
        (feature) => feature.contract.name === 'number/round',
      )

      expect(round?.heldBack).toBe('you edited a file of it, so it stays where it is')
      expect(round?.files.map((file) => file.verdict)).toEqual(['kept-orphan'])

      /**
       * The way out is the removal's and not the update's, which the walk through a real project is
       * what caught: the screen offered *put your change back on top of the new one* to somebody who
       * had asked for the feature to be deleted, about a file that is not going to exist.
       */
      const screen = renderRemoval(removal, project.configuration, false)
      expect(screen).toContain('Or let it go: delete the file')
      expect(screen).not.toContain('everything else still updates')

      applying(project, removal)
      expect(onDisk(project, 'number/round/round.ts')).toBe(true)
      expect(project.installed('number/round/round.ts')).toBe('export const round = 1\n')
    })
  })

  /**
   * The edited file that stays holds the whole removal back, dependencies included.
   *
   * **Found by this suite rather than by reading.** `round.ts` is kept because the user changed it, and
   * the first version of this took its three dependencies out anyway - leaving a file nobody had
   * touched importing `../clamp/clamp.js` with nothing there. *Nothing is removed while a feature is
   * held back, because a held-back feature runs its old code and that code may still import this* was
   * already written, and was asked of the features still in the plan; a feature held back while leaving
   * is in nobody's plan.
   */
  it('an-edit-that-keeps-a-leaving-feature-keeps-what-it-imports-too', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      project.write(
        `${project.configuration.directory}/number/round/round.ts`,
        'export const round = 1\n',
      )

      const removal = removing(imaginedSource(), project, lockfile, 'number/round')

      expect(removal.reconciliation.removals).toEqual([])
      expect(
        removal.reconciliation.features
          .filter((feature) => feature.contract.name !== 'number/round')
          .map((feature) => feature.heldBack),
      ).toEqual([
        'nothing is removed while a feature is held back, because a held-back feature runs its old ' +
          'code and that code may still import this',
        'nothing is removed while a feature is held back, because a held-back feature runs its old ' +
          'code and that code may still import this',
        'nothing is removed while a feature is held back, because a held-back feature runs its old ' +
          'code and that code may still import this',
      ])

      applying(project, removal)
      expect(onDisk(project, 'number/clamp/clamp.ts')).toBe(true)
      expect(onDisk(project, 'string/pad/digits.ts')).toBe(true)
      expect(removal.reconciliation.lockfile.features).toHaveLength(4)
    })
  })

  /**
   * Nothing is written until the second command, which is `THE_WRITE_DISCIPLINE` on the one command
   * that deletes.
   *
   * Asserted against the disk rather than against a flag: what makes the discipline real is that
   * planning a removal touches nothing, so the guard removes, checks the project is untouched, and only
   * then applies.
   */
  it('a-removal-shows-and-writes-nothing-until-it-is-applied', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      const removal = removing(imaginedSource(), project, lockfile, 'number/round')

      expect(removal.reconciliation.removals.length).toBeGreaterThan(0)
      expect(onDisk(project, 'number/round/round.ts')).toBe(true)
      expect(renderRemoval(removal, project.configuration, false)).toContain(
        'Apply it with  toopo remove number/round --apply',
      )

      applying(project, removal)
      expect(onDisk(project, 'number/round/round.ts')).toBe(false)
    })
  })

  /**
   * A registry that cannot answer for a recorded version refuses, and the refusal explains.
   *
   * The registry here serves the second publication and not the first, which permanent rule 6 forbids
   * a real one from doing - so what it stands in for is a registry that cannot answer *right now*
   * rather than an artefact that went away, and the sentence says exactly that. What it must not do is
   * report a failure: the reason a removal needs the registry is that the lockfile does not describe
   * what the remaining features import, and *that* is what somebody has to be told.
   *
   * It degrades without destroying, which is the half worth guarding: the files stay, nothing breaks,
   * and the same command works when the registry answers.
   */
  it('a-removal-that-cannot-reach-the-registry-refuses-and-explains', () => {
    inProject(imaginedSource(), ['number/round', 'number/sign'], (project, lockfile) => {
      const faults = refusalOf(updatedImaginedSource(), project, lockfile, 'number/round')

      expect(faults).toHaveLength(1)
      expect(faults[0]).toContain('the registry is not serving number/sign@1/reference@1.0.0')
      expect(faults[0]).toContain('A published version is served for life')
      expect(faults[0]).toContain('Nothing was changed.')

      expect(onDisk(project, 'number/round/round.ts')).toBe(true)
      expect(onDisk(project, 'number/sign/sign.ts')).toBe(true)
    })
  })

  /**
   * Taking out the last root of a project asks the registry nothing at all.
   *
   * **The measurement, made replayable.** Over every non-empty set of roots on the catalogue and on the
   * fixture graph - 64 removals - eight reach the registry not at all, and they are exactly the eight
   * that leave no root behind. That is the whole of the limit `breakage.ts` declares, and a sentence
   * about it in prose would be a claim nobody can check; this counts the calls.
   */
  it('taking-out-the-last-root-asks-the-registry-nothing', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      const asked: string[] = []
      const counted = Object.fromEntries(
        Object.entries(imaginedSource()).map(([method, answer]) => [
          method,
          (...args: readonly never[]) => {
            asked.push(method)

            return (answer as (...given: readonly never[]) => unknown)(...args)
          },
        ]),
      ) as RegistrySource

      const removal = removing(counted, project, lockfile, 'number/round')

      expect(asked).toEqual([])
      expect(leaving(removal)).toHaveLength(4)
    })
  })

  /**
   * A name the project does not hold is refused with what it does hold.
   *
   * The list is the useful half: somebody typing a name that is not there has misremembered it, and the
   * answer they want is the one they meant to type.
   */
  it('a-name-the-project-does-not-hold-is-refused-with-what-it-does', () => {
    inProject(imaginedSource(), ['number/round'], (project, lockfile) => {
      const faults = refusalOf(imaginedSource(), project, lockfile, 'number/rond')

      expect(faults).toHaveLength(1)
      expect(faults[0]).toContain('toopo.lock does not record `number/rond`')
      expect(faults[0]).toContain('number/round@1')
      expect(faults[0]).toContain('string/pad@1')
    })
  })
})
