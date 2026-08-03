/**
 * The file you run.
 *
 *   node cli/toopo.ts init
 *   node cli/toopo.ts add string/slugify
 *
 * It does one thing before handing over to `command.ts`, and that one thing is here rather than
 * anywhere else because it is about the runtime and not about installing anything.
 *
 * ---------------------------------------------------------------------------
 * Why a resolve hook exists at all, measured rather than assumed
 * ---------------------------------------------------------------------------
 *
 * This repository writes its relative imports with the `.js` extension - `./canonical.js` for
 * `canonical.ts` - which is what TypeScript's `verbatimModuleSyntax` asks for and what every file
 * under `registry/`, `validation/` and `catalogue/` carries. Node strips types from a `.ts` file and
 * does **not** remap that extension. Measured on node v24.15.0:
 *
 *     Error [ERR_MODULE_NOT_FOUND]: Cannot find module '...\cli\arguments.js'
 *       imported from ...\cli\toopo.ts
 *
 * So a command that imports the registry cannot be started by Node without something making that one
 * translation. `mutation/` avoids the question by writing `.ts` specifiers throughout, which works
 * because nothing it imports leaves that folder; the installer imports the registry, the registry
 * imports the catalogue, and rewriting three folders to suit one entry point would be the tail wagging
 * the dog.
 *
 * The hook is fifteen lines of `node:module`, takes no dependency, and translates exactly one thing: a
 * *relative* specifier ending in `.js` whose `.ts` sibling exists. Anything else is passed straight
 * through, so a real `.js` file still resolves to itself and a package specifier is never touched.
 *
 * **This is not runtime indirection in the sense permanent rule 1 forbids.** That rule is about what
 * an installed feature does in somebody else's project: no dynamic resolution, no network call, no
 * wrapper. Nothing here is installed anywhere - it is how this repository's own development command
 * starts, and it disappears the day the CLI is compiled or the day Node remaps the extension.
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

await import('./command.ts')
