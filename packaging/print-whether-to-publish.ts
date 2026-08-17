/**
 * The file the continuous integration runs to decide whether this commit publishes.
 * ADR-0111 is the decision; `what-npm-holds.ts` is where the reading happens.
 *
 *
 *   node packaging/print-whether-to-publish.ts
 *
 * It prints what npm holds and what this tree declares, and appends `unpublished` to the file GitHub
 * names in `GITHUB_OUTPUT`. **The printing is not decoration**: the job that runs this is the only
 * place a reader can afterwards see why a run published or did not, and a verdict with neither of its
 * two sides beside it is a verdict nobody can check.
 *
 * **The manifest is read from disk and not from `THE_PACKAGE_VERSION`**, although a guard ties the
 * two. What npm accepts or refuses is the `version` field of the `package.json` it is handed, so this
 * asks the question of the string that will actually be sent - and the day the guard tying them ever
 * went red, this would be right about the publication and the constant would not.
 *
 * Nothing here is imported by anything: `packaging/what-npm-holds.test.ts` reaches the module, and this
 * is the entry point, on the split `reachable.ts` and `build.ts` already have in this folder.
 */

import { appendFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { overHttp, theVersionsNpmHolds } from './what-npm-holds.ts'

/** One folder up from `packaging/`, which is the repository root. ADR-0059. */
const REPOSITORY = join(import.meta.dirname, '..')

const declared = JSON.parse(readFileSync(join(REPOSITORY, 'package.json'), 'utf8')) as {
  readonly name?: unknown
  readonly version?: unknown
}

if (typeof declared.name !== 'string' || declared.name === '') {
  throw new Error('package.json declares no name, so there is no package to ask npm about')
}

if (typeof declared.version !== 'string' || declared.version === '') {
  throw new Error('package.json declares no version, so there is nothing a publication could be')
}

const held = await theVersionsNpmHolds(declared.name, overHttp)
const unpublished = !held.has(declared.version)

process.stdout.write(
  `npm holds ${held.size === 0 ? 'nothing' : [...held].join(', ')}\n` +
    `this tree declares ${declared.version}\n` +
    `${
      unpublished
        ? 'which npm does not hold, so this commit publishes it'
        : 'which npm already holds, so this commit publishes nothing'
    }\n`,
)

/**
 * Absent when this is run by a person, which is the case the job output is meaningless in. A file that
 * is not there is not a failure here: the reading above is the whole of what somebody at a keyboard
 * wanted, and there is nothing for them to hand it to.
 */
const output = process.env['GITHUB_OUTPUT']
if (output !== undefined && output !== '') appendFileSync(output, `unpublished=${unpublished}\n`)
