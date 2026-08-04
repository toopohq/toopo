/**
 * The one translation node does not make, registered once for every entry point in this repository.
 *
 * ---------------------------------------------------------------------------
 * Why it exists at all, measured rather than assumed
 * ---------------------------------------------------------------------------
 *
 * This repository writes its relative imports with the `.js` extension - `./canonical.js` for
 * `canonical.ts` - which is what TypeScript's `verbatimModuleSyntax` asks for and what every file
 * under `registry/`, `validation/`, `catalogue/`, `cli/` and `site/` carries. Node strips types from a
 * `.ts` file and does **not** remap that extension. Measured on node v24.15.0:
 *
 *     Error [ERR_MODULE_NOT_FOUND]: Cannot find module '...\cli\arguments.js'
 *       imported from ...\cli\toopo.ts
 *
 * So a program that imports the registry cannot be started by node without something making that one
 * translation. `mutation/` avoids the question by writing `.ts` specifiers throughout, which works
 * because nothing it imports leaves that folder; the installer and the generator both import the
 * registry, the registry imports the catalogue, and rewriting four folders to suit two entry points
 * would be the tail wagging the dog.
 *
 * The hook takes no dependency and translates exactly one thing: a *relative* specifier ending in
 * `.js` whose `.ts` sibling exists. Anything else is passed straight through, so a real `.js` file
 * still resolves to itself and a package specifier is never touched.
 *
 * **This is not runtime indirection in the sense permanent rule 1 forbids.** That rule is about what
 * an installed feature does in somebody else's project: no dynamic resolution, no network call, no
 * wrapper. Nothing here is installed anywhere - it is how this repository's own commands start, and it
 * disappears the day they are compiled or the day node remaps the extension.
 *
 * **It is at the root because two entry points need it and neither may import the other.** `cli/` and
 * `site/` are two clients of the registry, and a client that reached into another client would be a
 * dependency nobody meant to create. The debt this does not close is recorded rather than hidden: a
 * mechanism present in development and absent from whatever is eventually published is a divergence,
 * and one copy of it is better than two.
 */

import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'

registerHooks({
  resolve(specifier, context, nextResolve) {
    const relative = specifier.startsWith('./') || specifier.startsWith('../')

    if (relative && specifier.endsWith('.js') && context.parentURL !== undefined) {
      const sibling = new URL(specifier.slice(0, -3) + '.ts', context.parentURL)
      if (existsSync(sibling)) return { url: sibling.href, shortCircuit: true }
    }

    return nextResolve(specifier, context)
  },
})
