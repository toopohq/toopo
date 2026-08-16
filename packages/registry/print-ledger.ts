/**
 * What this working tree binds every address to, one line each.
 *
 *     npm run ledger
 *
 * The entry point is separate from `rebinding.ts` for the reason `check-anchors.ts` is separate from
 * `anchors.ts`: a module a guard can import must not print a report when it is imported.
 *
 * ---------------------------------------------------------------------------
 * This is the coordinate a past commit is reached through, and that is why it is a script
 * ---------------------------------------------------------------------------
 *
 * `rebuild.ts` checks out the commit a binding was published from and asks *that* commit what it bound,
 * because the digest to compare against is the one the registry produced then. Reaching into a checkout
 * by file path is what cannot be relied on: measured, `packages/registry/serialise.ts` does not exist
 * sixty commits back - the folder was `registry/` until it moved - so a path written today addresses
 * nothing in a tree from before the move.
 *
 * A script name in `package.json` is the coordinate that survives, because the commit answers for
 * itself: wherever it keeps its registry, `npm run ledger` finds it. The debt this leaves is that it
 * only reaches back to the commit that introduces it, and that costs nothing here - nothing is
 * published, so no publication can predate the mechanism that checks it.
 *
 * ---------------------------------------------------------------------------
 * It prints the ledger and not the answers about it
 * ---------------------------------------------------------------------------
 *
 * A binding's digest travels in a named answer too, so this could have walked the read API. It asks the
 * ledger because the ledger is what the rule is about: `refuseRebinding` binds an address there, and a
 * check that went through the projection would be measuring the projection as well - two claims in one
 * guard, with nothing to say for itself the day they disagree.
 *
 * The imports are `.ts` and dynamic for the reason `packages/cli/toopo.ts` states: node does not remap
 * the `.js` specifier this folder writes, so the resolve hook at the root is registered first and the
 * translation cannot be used before it exists.
 */

import '../../typescript-imports.ts'

const { theLocalLedger } = await import('./local-read-api.ts')
const { bindingsOf, renderBindings } = await import('./rebinding.ts')

process.stdout.write(renderBindings(bindingsOf(theLocalLedger())))
