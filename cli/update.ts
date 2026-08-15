/**
 * `toopo update` - the command permanent rule 4 is about.
 *
 * *Never update user code silently. Notification, readable diff, explicit acceptance.* The arithmetic
 * that answers it is `reconcile.ts`, shared with `remove`; what is here is the two things that make an
 * update an update - which features it calls roots, and that it goes to the registry to find out what
 * moved - and the two refusals that belong to nobody else.
 *
 * ---------------------------------------------------------------------------
 * Explicit acceptance is a second command, not a prompt
 * ---------------------------------------------------------------------------
 *
 * `toopo update` shows and writes nothing; `toopo update --apply` writes. It is one instance of
 * `THE_WRITE_DISCIPLINE` in `arguments.ts`, which now says in one sentence which commands ask twice and
 * why `add` does not. A prompt would need a terminal, a standard input and a moment in time, and this
 * tool has a property worth more than the convenience: **everything it decides is reachable from a
 * guard, with no process, no working directory and no clock**. That is what keeps `command.ts` thin,
 * and it is why `add` could be measured end to end without a sandbox. The first interactive prompt
 * written here would take it away without anybody noticing, so it is written down where the next person
 * to want one will read it.
 *
 * ---------------------------------------------------------------------------
 * The whole project is planned, every time
 * ---------------------------------------------------------------------------
 *
 * There is no `toopo update <feature>`, and its absence is a decision. Deduplication is a property of a
 * plan and not of a feature - which carrier of a shared file keeps it depends on what else is being
 * installed - so a plan built for one feature in a project holding four would move files the other
 * three own. Planning everything and applying part of it is the only shape that cannot do that, and
 * once everything is planned, "just this one" buys nothing a held-back feature does not already give.
 *
 * ---------------------------------------------------------------------------
 * The two refusals that are this command's and not the reconciliation's
 * ---------------------------------------------------------------------------
 *
 * A lockfile with no feature in it, and a lockfile whose every feature says it arrived as somebody
 * else's dependency. Both leave an update with nowhere to start, and both are refusals rather than
 * empty answers - an update that silently did nothing would look exactly like an update that found
 * nothing to do.
 *
 * They are here rather than in `reconcile.ts` because a **removal** meets the same two states
 * legitimately: taking out the last root of a project leaves no root and everything leaving, which is
 * the correct answer to what was asked rather than a state nobody can act on.
 */

import type { Lockfile } from '../packages/registry/implementation-record.js'
import type { Configuration } from './configuration.js'
import type { ReconcileOutcome } from './reconcile.js'
import { reconcileProject } from './reconcile.js'
import type { HeldRegistry } from './source.js'

export type UpdateRequest = {
  readonly root: string
  readonly configuration: Configuration
  readonly lockfile: Lockfile
  /** The instant recorded in the lockfile, supplied rather than read, so a guard is reproducible. */
  readonly at: string
}

export const prepareUpdate = (source: HeldRegistry, request: UpdateRequest): ReconcileOutcome => {
  if (request.lockfile.features.length === 0) {
    return { faults: ['toopo.lock records no installed feature, so there is nothing to update'] }
  }

  if (!request.lockfile.features.some((feature) => feature.askedFor)) {
    return {
      faults: [
        'toopo.lock records features and says every one of them was pulled in as a dependency, so ' +
          'nothing in it is a root and an update has nowhere to start.',
      ],
    }
  }

  return reconcileProject(source, {
    ...request,
    demoted: null,
    boundAs: 'as-the-registry-serves-it-today',
  })
}
