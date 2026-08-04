/**
 * The entry point.
 *
 *   node cli/toopo.ts init
 *   node cli/toopo.ts add string/slugify
 *   node cli/toopo.ts add number/parse --implementation reference
 *   node cli/toopo.ts update
 *   node cli/toopo.ts update --apply
 *   node cli/toopo.ts search convert string to number
 *
 * It is thin on purpose, and the thinness is a property worth naming because it is the one this folder
 * would lose first. **Everything this tool decides is reachable from a guard, with no process, no
 * working directory and no clock.** Reading the arguments, reading the project, handing the two to
 * something that decides, and printing the answer is the whole of what happens here - which is why
 * `add` could be measured end to end without a sandbox, and why `update` asks for its acceptance as a
 * second command rather than as a prompt. An interactive prompt written here would take that away, and
 * would take it away silently.
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
  proposeDirectory,
  readConfiguration,
  writeConfiguration,
} from './configuration.js'
import { filesToWrite, lockfileAfter, prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import { UnusableLockfile, readLockfile } from './lockfile.js'
import {
  renderInit,
  renderInstallation,
  renderRefusal,
  renderSearch,
  renderUnchanged,
  renderUpToDate,
  renderUpdate,
} from './report.js'
import { search } from './search.js'
import { prepareUpdate } from './update.js'
import { commit } from './write.js'
import { renderContract } from '../registry/address.js'

const out = (text: string): void => {
  process.stdout.write(`${text}\n`)
}

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

const EMPTY: Lockfile = { version: LOCKFILE_VERSION, features: [] }

try {
  if (parsed.command.name === 'init') {
    const held = readConfiguration(root)
    const configuration: Configuration = {
      version: 1,
      directory: parsed.command.directory ?? held?.directory ?? proposeDirectory(root),
    }

    writeConfiguration(root, configuration)
    out(renderInit(configuration, held !== null))
  } else if (parsed.command.name === 'add') {
    const configuration = theConfiguration()
    const lockfile = readLockfile(root) ?? EMPTY
    const outcome = prepareInstallation(localSource(), {
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
          lockfile: after,
        })

        if ('faults' in written) refuse(written.faults)
      }

      out(
        renderUnchanged(
          renderContract(outcome.unchanged.contract),
          outcome.entry,
          configuration,
          recorded,
        ),
      )
    } else {
      const written = commit(root, configuration.directory, {
        writes: filesToWrite(outcome.installation),
        removals: [],
        lockfile: lockfileAfter(lockfile, outcome.installation.features),
      })

      if ('faults' in written) refuse(written.faults)
      out(renderInstallation(outcome.installation, configuration))
    }
  } else if (parsed.command.name === 'search') {
    // The only command that reads no project at all - no `toopo.json`, no lockfile, not even the
    // working directory. It is a property rather than an accident: looking for a feature comes
    // before having somewhere to put it, and `search` is the first command that says so.
    out(renderSearch(search(localSource(), parsed.command.query)))
  } else {
    const configuration = theConfiguration()
    const lockfile = readLockfile(root)
    if (lockfile === null) {
      refuse([
        `this folder has no toopo.lock, so nothing is installed and there is nothing to update. ` +
          `Install something with \`toopo add string/slugify\`.`,
      ])
    }

    const outcome = prepareUpdate(localSource(), {
      root,
      configuration,
      lockfile,
      at: new Date().toISOString(),
    })

    if ('faults' in outcome) refuse(outcome.faults)

    const { update } = outcome
    const touched = update.writes.length + update.removals.length

    if (touched === 0 && update.features.every((feature) => feature.heldBack === null)) {
      out(
        renderUpToDate(
          update.features
            .filter((feature) => feature.files.some((file) => file.verdict === 'kept'))
            .map((feature) => renderContract(feature.contract)),
        ),
      )
    } else if (!parsed.command.apply) {
      out(renderUpdate(update, configuration, false))
    } else {
      const written = commit(root, configuration.directory, {
        writes: update.writes,
        removals: update.removals,
        lockfile: update.lockfile,
      })

      if ('faults' in written) refuse(written.faults)
      out(renderUpdate(update, configuration, true))
    }
  }
} catch (error) {
  if (error instanceof UnusableConfiguration || error instanceof UnusableLockfile) {
    refuse(error.message.split('\n'))
  }

  throw error
}
