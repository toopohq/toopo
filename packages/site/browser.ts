/**
 * What a browser loads, and the single translation between this repository's source and it.
 *
 * ---------------------------------------------------------------------------
 * The `.js` specifiers this repository already writes are what makes this free
 * ---------------------------------------------------------------------------
 *
 * Every relative import here is written `./literal.js` for `literal.ts`, because that is what
 * `verbatimModuleSyntax` asks of TypeScript. A browser resolves exactly that spelling, natively, with
 * no bundler and no rewriting - so a module graph written for a typechecker turns out to be a module
 * graph a browser can load, and the whole of the work is stripping the types. Measured: after
 * stripping, `playground.js` still names `../packages/registry/value.js`, `./literal.js` and `./read-literal.js`
 * and nothing else, because `import type` erases.
 *
 * ---------------------------------------------------------------------------
 * Node's own stripper rather than a compiler
 * ---------------------------------------------------------------------------
 *
 * `module.stripTypeScriptTypes` is the mechanism node itself uses to run the `.ts` files of this
 * repository, so the JavaScript a reader's browser executes is produced by the same thing that
 * executes our tests. It is also the only one available: `typescript@7.0.2` ships a native compiler
 * and no JavaScript API - `node_modules/typescript/lib/` holds `tsc.js` and a version string - so a
 * compiler here would mean a subprocess, and a subprocess would put a page's content behind something
 * no guard can reach.
 *
 * It refuses what it cannot erase rather than guessing: an `enum` or a `namespace` throws instead of
 * being dropped. That is the direction of failure this repository asks for, and it is why nothing
 * checks afterwards that the output still means what the input did.
 *
 * ---------------------------------------------------------------------------
 * What the reader is told, and where
 * ---------------------------------------------------------------------------
 *
 * The JavaScript that runs in a browser is neither the file the registry serves nor the file the
 * digest covers - it is that file with its types removed. `contract-page.ts` says so on the playground
 * itself and nowhere else, because that is the one place where somebody is looking at an answer this
 * transformation produced.
 */

import { stripTypeScriptTypes } from 'node:module'

import { renderContract } from '../registry/address.js'
import { servedBlobFaults } from '../registry/response.js'
import type { Held } from './catalogue.js'
import { ThePageCannotBeBuilt } from './catalogue.js'
import { THE_REFERENCE_MODULE } from './paths.js'
import type { RegistrySource } from './source.js'

/** One module of this repository, as a browser runs it. */
export const asABrowserModule = (typescript: string): string =>
  stripTypeScriptTypes(typescript, { mode: 'strip' })

/**
 * The modules of this repository a page loads, by repository-relative path, entry point first.
 *
 * Written here and derived nowhere, so it is two statements about one graph -
 * `every-import-a-browser-module-keeps-is-a-module-the-site-writes` is what keeps them together, and
 * it is the guard that would catch a fifth module arriving through an import nobody listed.
 */
export const THE_BROWSER_GRAPH: readonly string[] = [
  'packages/site/start.ts',
  'packages/site/playground.ts',
  'packages/site/read-literal.ts',
  'packages/site/literal.ts',
  'packages/registry/value.ts',
]

/**
 * The implementation of one contract, fetched by digest and stripped.
 *
 * The bytes are checked on arrival for the reason `catalogue.ts` checks a snapshot: this generator is
 * the consumer with the most to lose by skipping it, since what it publishes becomes the catalogue in
 * every reader's mind and nothing downstream ever asks again.
 */
const referenceOf = (source: RegistrySource, held: Held): string => {
  const what = renderContract(held.contract.address)
  const files = held.implementation.files

  if (files.length !== 1) {
    throw new ThePageCannotBeBuilt(
      what,
      `its implementation is ${files.length} files and a playground loads one - a feature of more ` +
        `than one file needs its own module graph beside the page, which nothing here writes yet`,
    )
  }

  const file = files[0] as (typeof files)[number]
  const blob = source.blob(file.sha256)
  if (blob === null) throw new ThePageCannotBeBuilt(what, `the registry holds no blob ${file.sha256}`)

  const faults = servedBlobFaults(blob)
  if (faults.length > 0) {
    throw new ThePageCannotBeBuilt(what, `its implementation does not check out: ${faults.join('; ')}`)
  }
  if (blob.addressedBy !== file.sha256) {
    throw new ThePageCannotBeBuilt(
      what,
      `it asked for ${file.sha256} and the registry answered ${blob.addressedBy}`,
    )
  }

  return asABrowserModule(blob.bytes.toString('utf8'))
}

/** Every contract's implementation, at the path its own page loads it from. */
export const theReferenceModules = (
  source: RegistrySource,
  held: readonly Held[],
): ReadonlyMap<string, string> =>
  new Map(
    held.map((one) => [
      `${renderContract(one.contract.address)}/${THE_REFERENCE_MODULE}`,
      referenceOf(source, one),
    ]),
  )
