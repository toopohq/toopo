import { describe, it, expect } from 'vitest'

import type { Command } from './arguments.js'
import { run } from './command.js'
import { writeConfiguration } from './configuration.js'
import { deciding } from './fixpoint.js'
import { imaginedSource } from './imagined-source.js'
import { prepareInstallation } from './install.js'
import type { TemporaryProject } from './temporary-project.js'
import { A_PINNED_INSTANT, EMPTY_LOCKFILE, aProject, committing } from './temporary-project.js'

/**
 * Which commands reach the registry, produced by running them rather than claimed in a sentence.
 *
 * **The claim existed and was false from its first day.** `list.ts` published *this is the only one
 * that reads no registry*, and `init` has never read one either - checked at `eec8094`, where its
 * branch of `command.ts` carries no call to the thunk, exactly as it does now. Nothing kept the
 * sentence, so nothing could notice it was wrong.
 *
 * **It is a promise to somebody offline**, which is what makes it worth a mechanism rather than a
 * correction. *These commands work with no registry* is the kind of thing that dies quietly: somebody
 * adds a registry read to `list` for a good reason, every guard stays green, and the promise is gone
 * with nobody informed. The same gesture has now paid three times in this repository - a sentence
 * claiming *all of them are here* replaced by a guard publishing where each one is, a count of
 * untouched guards replaced by *no guard was touched*, and this.
 *
 * **The seam was already there.** `run` takes its registry as a thunk, written so that one build of
 * `command.ts` can be installed and `published.ts` can name the other source; *this command reads no
 * registry* is exactly *the thunk is never called*, and no new field was needed to observe it. That is
 * the fourth time a value written for one consumer turned out to answer another.
 *
 * The guard names the commands rather than counting them, so the prose it replaced has nothing left to
 * say: a list that is produced cannot disagree with itself.
 */

/** A project holding an installed feature, so that every command gets as far as it would in real use. */
const aProjectHoldingSomething = async (): Promise<TemporaryProject> => {
  const project = aProject()
  const { answer: outcome } = await deciding(imaginedSource(), (held) =>
    prepareInstallation(held, {
      root: project.root,
      configuration: project.configuration,
      lockfile: EMPTY_LOCKFILE,
      contract: 'imagined-number/round',
      implementation: null,
      at: A_PINNED_INSTANT,
    }),
  )

  if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))

  committing(project, outcome.installation)
  writeConfiguration(project.root, project.configuration)

  return project
}

/**
 * Whether one command reaches for the registry, observed through the seam `run` already takes it by.
 *
 * Everything the command would print is swallowed and everything it would change is under a temporary
 * project, so the only thing this reads out of the run is whether the thunk was called.
 *
 * **The error stream is collected rather than swallowed, and that is what keeps this honest across
 * ADR-0168.** `run` answers a code now instead of ending the process, so a bug inside a command comes
 * back as a printed stack and a `1` where it used to come back as a throw - which this guard would
 * pass straight through, reading the thunk and nothing else. Anything on that stream is therefore
 * raised here: it is the one thing a run of a command may not do quietly.
 */
const reachesTheRegistry = async (
  project: TemporaryProject,
  words: readonly string[],
): Promise<boolean> => {
  let reached = false
  let complained = ''

  const argv = process.argv
  const cwd = process.cwd()
  const write = process.stdout.write
  const complain = process.stderr.write

  process.argv = ['node', 'toopo', ...words]
  process.chdir(project.root)
  process.stdout.write = (() => true) as typeof process.stdout.write
  process.stderr.write = ((text: string) => {
    complained += text

    return true
  }) as typeof process.stderr.write

  try {
    // Awaited, and that is what keeps the observation honest: `run` is asynchronous now, so without it
    // the `finally` would put `process.argv` and the working directory back while the command was
    // still deciding, and `reached` would be read before the thunk was called.
    await run(() => {
      reached = true

      return imaginedSource()
    })
  } finally {
    process.argv = argv
    process.chdir(cwd)
    process.stdout.write = write
    process.stderr.write = complain
  }

  if (complained !== '') throw new Error(`\`toopo ${words.join(' ')}\` reported: ${complained}`)

  return reached
}

/**
 * What a person types to reach each command, keyed by the grammar's own union.
 *
 * **Total over `Command['name']`, so a command added to the grammar does not compile until somebody
 * has decided whether it may read a registry.** A hand-written list would answer only for the commands
 * whoever wrote it remembered, which is the shape this repository refuses everywhere else: the map is
 * the mechanism, and the guard below is a walk over it.
 *
 * `catalogue` is `search` with no words - the grammar decides which of the two acts was asked for, and
 * that is why it appears here under its own name with nothing after `search`.
 */
const INVOKED_BY: Readonly<Record<Command['name'], readonly string[]>> = {
  init: ['init'],
  list: ['list'],
  add: ['add', 'imagined-number/round'],
  remove: ['remove', 'imagined-number/round'],
  update: ['update'],
  search: ['search', 'round a number'],
  catalogue: ['search'],
}

describe('what a command reads', () => {
  /**
   * Two commands answer without a registry, and they are the two a person needs when there is none:
   * *where do features go* and *what have I got*. The map is the whole claim - `false` moving to `true`
   * is a promise being withdrawn, and a command that reaches nothing when it should is one that will
   * refuse in front of somebody instead.
   */
  it('the-commands-that-reach-the-registry-are-these-and-no-others', async () => {
    const project = await aProjectHoldingSomething()

    try {
      // One at a time, because each run replaces `process.argv` and the working directory for the
      // length of the command - two of them in flight would be two commands sharing one process.
      const reached: Record<string, boolean> = {}
      for (const [name, words] of Object.entries(INVOKED_BY)) {
        reached[name] = await reachesTheRegistry(project, words)
      }

      expect(reached).toEqual({
        init: false,
        list: false,
        add: true,
        remove: true,
        update: true,
        search: true,
        catalogue: true,
      })
    } finally {
      project.remove()
    }
  })
})
