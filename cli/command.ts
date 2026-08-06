/**
 * What every entry point runs, once it has said which registry it is talking to.
 *
 *   node cli/toopo.ts init
 *   node cli/toopo.ts add string/slugify
 *   node cli/toopo.ts add number/parse --implementation reference
 *   node cli/toopo.ts remove string/slugify --apply
 *   node cli/toopo.ts update --apply
 *   node cli/toopo.ts list
 *   node cli/toopo.ts search convert string to number
 *
 * It is thin on purpose, and the thinness is a property worth naming because it is the one this folder
 * would lose first. **Everything this tool decides is reachable from a guard, with no process, no
 * working directory and no clock.** Reading the arguments, reading the project, handing the two to
 * something that decides, and printing the answer is the whole of what happens here - which is why
 * `add` could be measured end to end without a sandbox, and why `update` and `remove` ask for their
 * acceptance as a second command rather than as a prompt. An interactive prompt written here would take
 * that away, and would take it away silently. `THE_WRITE_DISCIPLINE` in `arguments.ts` says which
 * commands ask twice and why `add` does not.
 *
 * **The registry is a parameter, and that is what makes one build of this file installable.** It used
 * to call `localSource()`, which serialises this working tree - and a published `toopo` has no working
 * tree, cannot reach the modules that serialisation imports, and must be served from a frozen artefact
 * instead. `artefact.ts` carries the three measurements. What matters here is the shape: two entry
 * points, `toopo.ts` and `published.ts`, each naming one registry, and *which registry an installation
 * came from is a static fact about which file was run* rather than something this file probes for. A
 * probe would be the second source of truth `source.ts` exists to prevent.
 *
 * It is a thunk rather than a source, because building one serialises five contracts and reads
 * thirty-seven files, and that is not worth paying to print a usage line.
 *
 * The project root is the working directory, and `toopo.json` is the marker of a project rather than a
 * `package.json`. Nothing this tool does needs a package manager to have been used: it copies source
 * files into a folder, and a repository that has no `package.json` at its root - a monorepo package, a
 * Deno project, a plain folder - is a project like any other.
 */

import { parseArguments, USAGE } from './arguments.js'
import type { Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION } from '../registry/implementation-record.js'
import type { Configuration } from './configuration.js'
import {
  CONFIGURATION_FILE,
  UnusableConfiguration,
  configurationToInstallUnder,
  proposeDirectory,
  readConfiguration,
  writeConfiguration,
} from './configuration.js'
import { gitIgnores } from './ignored.js'
import { filesToWrite, lockfileAfter, prepareInstallation } from './install.js'
import { listProject } from './list.js'
import { UnusableArtefact } from './artefact.js'
import { UnusableLockfile, readLockfile } from './lockfile.js'
import { nothingMoved } from './reconcile.js'
import type { Moving } from './relocate.js'
import { filesToMove, pathsLeftBehind, whatMoves } from './relocate.js'
import { prepareRemoval } from './remove.js'
import {
  renderCatalogue,
  renderInit,
  renderInstallation,
  renderList,
  renderRefusal,
  renderRemoval,
  renderSearch,
  renderUnchanged,
  renderUpToDate,
  renderUpdate,
} from './report.js'
import { displayed, search } from './search.js'
import type { RegistrySource } from './source.js'
import { prepareUpdate } from './update.js'
import { commit } from './write.js'
import { renderContract } from '../registry/address.js'

const out = (text: string): void => {
  process.stdout.write(`${text}\n`)
}

const EMPTY: Lockfile = { version: LOCKFILE_VERSION, features: [] }

export const run = (theRegistry: () => RegistrySource): void => {
  /**
   * Annotated on the constant rather than on the arrow, which is not a style choice: TypeScript only
   * treats a call as never-returning - and therefore only narrows what follows it - when the callee is
   * an identifier declared with an explicit type.
   */
  const refuse: (faults: readonly string[]) => never = (faults) => {
    process.stdout.write(renderRefusal(faults))
    process.exit(1)
  }

  const root = process.cwd()
  const parsed = parseArguments(process.argv.slice(2))

  if ('faults' in parsed) {
    process.stdout.write(renderRefusal(parsed.faults))
    out(USAGE)
    process.exit(1)
  }

  /** The configuration, or the refusal that names the one command which writes it. */
  const theConfiguration = (): Configuration => {
    const held = readConfiguration(root)
    if (held === null) {
      refuse([
        `this folder has no ${CONFIGURATION_FILE}, so nothing knows where a feature should go. Run ` +
          `\`toopo init\` first - it takes no answer and writes one file.`,
      ])
    }

    return held
  }

  /**
   * `init` with nothing to move writes the one file it owns.
   *
   * Not through `commit`, and the reason is not economy: a commit writes a `toopo.lock`, and a project
   * that has none must not be given one by the command that only chooses a folder.
   */
  const theConfigurationAlone = (configuration: Configuration): string | null => {
    writeConfiguration(root, configuration)

    return null
  }

  /**
   * The installed tree moved into the folder that was just named, as one act.
   *
   * The lockfile goes through the commit unchanged - measured, a relocation leaves it identical byte
   * for byte, because its paths are relative to the configured directory and never name it. It is
   * written anyway because it is what `commit` renames **last**: the files land, the old copies go,
   * and only then does `toopo.json` start naming the new folder. A run killed anywhere in that order
   * leaves a project whose configuration still describes where its files are.
   */
  const theRelocation = (configuration: Configuration, moving: Moving): string | null => {
    const written = commit(root, configuration.directory, {
      writes: filesToMove(moving.relocation),
      removals: pathsLeftBehind(moving.relocation),
      leaving: moving.relocation.from,
      lockfile: moving.lockfile,
      configuration,
    })

    if ('faults' in written) refuse(written.faults)

    return written.leftBehind
  }

  /** The lockfile, or the refusal that says nothing is installed, in the words of what was asked. */
  const theLockfile = (verb: string): Lockfile => {
    const held = readLockfile(root)
    if (held === null) {
      refuse([
        `this folder has no toopo.lock, so nothing is installed and there is nothing to ${verb}. ` +
          `Install something with \`toopo add string/slugify\`.`,
      ])
    }

    return held
  }

  try {
    if (parsed.command.name === 'init') {
      const held = readConfiguration(root)
      const configuration: Configuration = {
        version: 1,
        directory: parsed.command.directory ?? held?.directory ?? proposeDirectory(root),
      }
      const change = whatMoves(root, held, configuration, readLockfile(root))

      if ('faults' in change) refuse(change.faults)

      const leftBehind =
        'moving' in change
          ? theRelocation(configuration, change.moving)
          : theConfigurationAlone(configuration)

      out(
        renderInit(
          configuration,
          held !== null,
          gitIgnores(root, configuration.directory),
          'moving' in change ? change.moving.relocation : null,
          leftBehind,
        ),
      )
    } else if (parsed.command.name === 'add') {
      const lockfile = readLockfile(root) ?? EMPTY
      // The one command that does not need a project to have been configured: `configuration.ts`
      // carries why, and the one project it still refuses.
      const chosen = configurationToInstallUnder(
        readConfiguration(root),
        lockfile.features.length > 0,
        proposeDirectory(root),
      )

      if ('faults' in chosen) refuse(chosen.faults)

      const { configuration } = chosen
      const configurationToWrite = chosen.write ? configuration : null
      const outcome = prepareInstallation(theRegistry(), {
        root,
        configuration,
        lockfile,
        contract: parsed.command.contract,
        implementation: parsed.command.implementation,
        at: new Date().toISOString(),
      })

      if ('faults' in outcome) refuse(outcome.faults)
      else if ('unchanged' in outcome) {
        // No file moves, and the lockfile may still: asking by name for something the project holds as
        // a dependency is the user making it a root, and that is recorded rather than answered away.
        const after = lockfileAfter(lockfile, outcome.features)
        const recorded = JSON.stringify(after) !== JSON.stringify(lockfile)

        if (recorded) {
          const written = commit(root, configuration.directory, {
            writes: [],
            removals: [],
            leaving: null,
            lockfile: after,
            configuration: configurationToWrite,
          })

          if ('faults' in written) refuse(written.faults)
        }

        out(
          renderUnchanged(
            renderContract(outcome.unchanged.contract),
            outcome.entry,
            configuration,
            outcome.promoted,
          ),
        )
      } else {
        const written = commit(root, configuration.directory, {
          writes: filesToWrite(outcome.installation),
          removals: [],
          leaving: null,
          lockfile: lockfileAfter(lockfile, outcome.installation.features),
          configuration: configurationToWrite,
        })

        if ('faults' in written) refuse(written.faults)
        // Asked after the write, because the question is about what has just landed rather than about
        // what might. `ignored.ts` carries why this is the one subprocess an install spawns.
        out(
          renderInstallation(
            outcome.installation,
            configuration,
            chosen.write,
            gitIgnores(root, configuration.directory),
          ),
        )
      }
    } else if (parsed.command.name === 'remove') {
      const configuration = theConfiguration()
      // Bound rather than passed inline, for the reason `update` binds its own: the closing line is a
      // claim about the difference between this file and the one the reconciliation leaves behind.
      const lockfile = theLockfile('remove')
      const outcome = prepareRemoval(theRegistry(), {
        root,
        configuration,
        lockfile,
        contract: parsed.command.contract,
        at: new Date().toISOString(),
      })

      if ('faults' in outcome) refuse(outcome.faults)

      const { removal } = outcome

      if (parsed.command.apply) {
        const written = commit(root, configuration.directory, {
          writes: removal.reconciliation.writes,
          removals: removal.reconciliation.removals,
          leaving: null,
          lockfile: removal.reconciliation.lockfile,
          configuration: null,
        })

        if ('faults' in written) refuse(written.faults)
      }

      out(renderRemoval(removal, lockfile, configuration, parsed.command.apply))
    } else if (parsed.command.name === 'list') {
      const configuration = theConfiguration()

      out(renderList(listProject(root, configuration, theLockfile('list')), configuration))
    } else if (parsed.command.name === 'search') {
      // The only two commands that read no project at all - no `toopo.json`, no lockfile, not even the
      // working directory. It is a property rather than an accident: looking for a feature comes
      // before having somewhere to put it, and `search` is the first command that says so.
      out(renderSearch(search(theRegistry(), parsed.command.query)))
    } else if (parsed.command.name === 'catalogue') {
      const source = theRegistry()
      const refusals = source.refusals().refusals

      out(renderCatalogue(source.contractIndex().entries.map((entry) => displayed(entry, refusals))))
    } else {
      const configuration = theConfiguration()
      // Bound rather than passed inline, because "nothing to do" is a claim about the difference
      // between this file and the one the reconciliation leaves behind.
      const lockfile = theLockfile('update')
      const outcome = prepareUpdate(theRegistry(), {
        root,
        configuration,
        lockfile,
        at: new Date().toISOString(),
      })

      if ('faults' in outcome) refuse(outcome.faults)

      const { reconciliation } = outcome

      if (nothingMoved(lockfile, reconciliation)) {
        out(renderUpToDate(reconciliation))
      } else if (!parsed.command.apply) {
        // Never asked on the showing half: the sentence is about what has just been written, and this
        // run wrote nothing. Saying it in the past tense about files that do not exist yet would be
        // the report describing something other than what happened.
        out(renderUpdate(reconciliation, lockfile, configuration, false, null))
      } else {
        const written = commit(root, configuration.directory, {
          writes: reconciliation.writes,
          removals: reconciliation.removals,
          leaving: null,
          lockfile: reconciliation.lockfile,
          configuration: null,
        })

        if ('faults' in written) refuse(written.faults)
        out(
          renderUpdate(
            reconciliation,
            lockfile,
            configuration,
            true,
            gitIgnores(root, configuration.directory),
          ),
        )
      }
    }
  } catch (error) {
    if (
      error instanceof UnusableConfiguration ||
      error instanceof UnusableLockfile ||
      error instanceof UnusableArtefact
    ) {
      refuse(error.message.split('\n'))
    }

    throw error
  }
}
