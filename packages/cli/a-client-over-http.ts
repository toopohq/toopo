/**
 * The client on a socket, in a process of its own, so that how a command *ends* can be measured.
 * ADR-0168 is the defect this exists for and the readings that named its cause.
 *
 *   node packages/cli/a-client-over-http.ts add imagined-number/round
 *
 * **It is the guard's apparatus and not a design for a deployment**, exactly as `serving-over-http.ts`
 * and `serving-a-tree.ts` are, and it is the client's side of the same seam those two are the server's
 * side of. None of the three ships: `packaging/build.ts` prunes what `published.ts` cannot reach, and
 * `archive.test.ts` is what says so rather than this sentence.
 *
 * ---------------------------------------------------------------------------
 * Why a process, when every other guard in this folder needs none
 * ---------------------------------------------------------------------------
 *
 * `command.ts` is thin precisely so that everything it decides is reachable with no process, and every
 * guard here takes it up on that. **How a command ends is the one thing that offer does not cover.**
 * An exit code, an aborted process and a stack on the error stream are facts about a process, and a
 * suite that calls `run` in its own is measuring a function return - which is worth having, and is not
 * what a person types.
 *
 * It was the gap ADR-0168 was found in. `toopo add` of a name the registry does not hold refused
 * correctly, printed the right sentence, wrote nothing - and then aborted on a libuv assertion with an
 * exit code no shell reads as a refusal. Every guard over that refusal was green, because every one of
 * them stopped at the sentence.
 *
 * ---------------------------------------------------------------------------
 * The origin arrives in the environment, and that is not the knob rule 3 forbids
 * ---------------------------------------------------------------------------
 *
 * `published.ts` says there is no flag, no environment variable and no probe, because a knob there
 * would let an installation be served from somewhere this project does not control - and which digest
 * a name resolves to is the one thing a client cannot check by arithmetic. **That argument is about the
 * artefact somebody installs, and this file is not in it.** What makes that a mechanism rather than a
 * promise is the pruning: nothing `published.ts` imports reaches this module, so no build of the
 * archive can carry it, and a guard reads the tarball rather than taking my word.
 *
 * It arrives in the environment rather than in the arguments so that the grammar this runs against is
 * the product's own, word for word. An origin taken from `argv[2]` would mean shifting the arguments
 * underneath `parseArguments`, and a guard about how a command ends would be running a command nobody
 * can type.
 */

import '../../typescript-imports.ts'

import { appendFileSync } from 'node:fs'

/** Where to ask. Required, because an apparatus that guesses is one that measures something else. */
const THE_ORIGIN_UNDER_MEASUREMENT = process.env['THE_ORIGIN_UNDER_MEASUREMENT']

/**
 * Where to say the process was allowed to end.
 *
 * `beforeExit` runs when the loop has nothing left and is skipped by both of the endings ADR-0168 is
 * about - `process.exit` and an uncaught throw. So its mark is the portable half of that finding: the
 * abort is win32's, and *the process was killed rather than finished* is observable anywhere.
 *
 * Written with `appendFileSync` for the reason `the-archive.ts`'s recorder is: a handler that schedules
 * asynchronous work is a handler that arranges to be called again.
 */
const WHERE_TO_RECORD_THE_ENDING = process.env['WHERE_TO_RECORD_THE_ENDING']

if (THE_ORIGIN_UNDER_MEASUREMENT === undefined || WHERE_TO_RECORD_THE_ENDING === undefined) {
  throw new Error(
    'THE_ORIGIN_UNDER_MEASUREMENT and WHERE_TO_RECORD_THE_ENDING are both required: this is the ' +
      "guard's apparatus for ADR-0168 and it has nothing to fall back on.",
  )
}

// The file's existence is the whole observation, so there is no word here for a guard to agree with
// and no constant shared with one. A guard that imported anything from this module would run it.
process.on('beforeExit', () => {
  appendFileSync(WHERE_TO_RECORD_THE_ENDING, 'the process was allowed to end\n')
})

const { run } = await import('./command.ts')
const { httpSource } = await import('./http-source.ts')

process.exitCode = await run(() => httpSource(THE_ORIGIN_UNDER_MEASUREMENT))
