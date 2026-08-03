/**
 * The entry point.
 *
 *   node cli/toopo.ts init
 *   node cli/toopo.ts add string/slugify
 *   node cli/toopo.ts add number/parse --implementation reference
 *
 * It is thin on purpose. Everything it does is read the arguments, read the project, hand the two to
 * something that decides, and print the answer - so that every decision this tool takes is reachable
 * from a guard without a process, a working directory or a clock being involved.
 *
 * The project root is the working directory, and `toopo.json` is the marker of a project rather than a
 * `package.json`. Nothing this tool does needs a package manager to have been used: it copies source
 * files into a folder, and a repository that has no `package.json` at its root - a monorepo package, a
 * Deno project, a plain folder - is a project like any other.
 */

import { parseArguments, USAGE } from './arguments.js'
import type { Configuration } from './configuration.js'
import {
  CONFIGURATION_FILE,
  UnusableConfiguration,
  proposeDirectory,
  readConfiguration,
  writeConfiguration,
} from './configuration.js'
import { commitInstallation, prepareInstallation } from './install.js'
import { localSource } from './local-source.js'
import { UnusableLockfile, readLockfile, withFeature, writeLockfile } from './lockfile.js'
import { renderInit, renderInstallation, renderRefusal, renderUnchanged } from './report.js'
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

try {
  if (parsed.command.name === 'init') {
    const held = readConfiguration(root)
    const configuration: Configuration = {
      version: 1,
      directory: parsed.command.directory ?? held?.directory ?? proposeDirectory(root),
    }

    writeConfiguration(root, configuration)
    out(renderInit(configuration, held !== null))
  } else {
    const configuration = readConfiguration(root)
    if (configuration === null) {
      refuse([
        `this folder has no ${CONFIGURATION_FILE}, so nothing knows where a feature should go. Run ` +
          `\`toopo init\` first - it takes no answer and writes one file.`,
      ])
    }

    const lockfile = readLockfile(root) ?? { version: 1 as const, features: [] }
    const outcome = prepareInstallation(localSource(), {
      root,
      configuration,
      lockfile,
      contract: parsed.command.contract,
      implementation: parsed.command.implementation,
      at: new Date().toISOString(),
    })

    if ('faults' in outcome) refuse(outcome.faults)
    else if ('unchanged' in outcome) out(renderUnchanged(renderContract(outcome.unchanged.contract)))
    else {
      commitInstallation(root, configuration.directory, outcome.installation)
      writeLockfile(root, outcome.installation.features.reduce(withFeature, lockfile))
      out(renderInstallation(outcome.installation, configuration))
    }
  }
} catch (error) {
  if (error instanceof UnusableConfiguration || error instanceof UnusableLockfile) {
    refuse(error.message.split('\n'))
  }

  throw error
}
