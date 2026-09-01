/**
 * What a browser loads, and the single translation between this repository's source and it.
 * ADR-0029 is how this reaches a browser, and what is measured about the transformation.
 *
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
 * executes our tests. **A compiler here would mean a subprocess, and a subprocess would put a page's
 * content behind something no guard can reach**, which is why the erasure is node's and not `tsc`'s.
 *
 * **That conclusion is true and used to rest on a proof that does not support it.** This paragraph
 * read *`typescript@7.0.2` ships a native compiler and no JavaScript API*, and offered
 * `node_modules/typescript/lib/` holding `tsc.js` and a version string as the evidence. The evidence
 * is true and establishes nothing: the package's API lives under `dist/` and is reached through its
 * `exports` map, which names eleven entries including `./unstable/ast` and `./unstable/ast/scanner`.
 * **There is an in-process JavaScript API.** What TypeScript 7 removed is a standalone *parser* - the
 * only way to a syntax tree is `typescript/unstable/sync`, which loads a project and spawns the
 * compiler. So the conclusion stands, and it stands on a reason narrower than the one written here:
 * not *no API*, but *no parser without a process*.
 *
 * `packages/validation/typescript-api.ts` has stated the same fact correctly since it was written.
 * Two files, one fact, one of them wrong - and the wrong one is the file somebody opens to ask
 * exactly this question.
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
 *
 * **That sentence is about a contract's reference, and it is why the two erasures below are two
 * functions.** This repository's own modules lose their argument as well as their types, because a
 * reader who cannot use the reasoning was downloading all of it. A contract's reference loses nothing
 * but its types, because the page makes a promise about that file and an auditor fetches it.
 *
 * ADR-0156 is the proof that the first of those two is safe, and why it is a guard here where the same
 * question about the stylesheet could only ever be a reading somebody took once.
 *
 * ADR-0157 is why the graph gained a tenth module and what it costs a reader - 1 072 B in brotli on
 * every page - and it is where the guard under `LOADED_BEFORE_A_READER_ACTS` came from, that constant
 * having cited one nothing collected for the whole of its life.
 */

import { stripTypeScriptTypes } from 'node:module'

import { renderContract } from '../registry/address.js'
import { servedBlobFaults } from '../registry/response.js'
import type { Held } from './catalogue.js'
import { ThePageCannotBeBuilt } from './catalogue.js'
import { THE_REFERENCE_MODULE } from './paths.js'
import { withoutItsArgument } from './served-modules.js'
import type { RegistrySource } from './source.js'

/**
 * One module of this repository, as a browser runs it: the types erased and the argument taken out.
 *
 * The two happen in this order because the artefact is the type-stripped module, and erasure blanks a
 * comment that lived inside a type annotation - so asking for the comments first would be asking about
 * a file nobody is served.
 */
export const asABrowserModule = (typescript: string): string =>
  withoutItsArgument(stripTypeScriptTypes(typescript, { mode: 'strip' }))

/**
 * One contract's reference implementation, as a browser runs it: the types erased and nothing else.
 *
 * **The argument stays**, and this is the one place in the folder where that is a rule rather than a
 * preference. `contract-page.ts` tells the reader, in as many words, that what runs is *that contract's
 * own `reference.ts` with its types stripped*; a second removal makes that sentence false on the one
 * page whose subject is that this catalogue can be checked. The file is also frozen for the life of the
 * major, and the further the served artefact drifts from the one the digest covers, the less an
 * auditor's fetch establishes.
 *
 * `a-contracts-reference-reaches-a-reader-with-its-argument-intact` is what makes it a mechanism, so
 * the distinction cannot be lost by somebody reaching for the shorter name.
 */
export const asAContractsReference = (typescript: string): string =>
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
  'packages/site/what-a-control-says.ts',
  'packages/site/searching.ts',
  'packages/site/theme.ts',
  'packages/registry/search.ts',
  'packages/registry/address.ts',
  'packages/catalogue/identifier.ts',
  'packages/site/playground.ts',
  'packages/site/read-literal.ts',
  'packages/site/literal.ts',
  'packages/registry/value.ts',
]

/**
 * The modules a page loads before a reader has done anything, as against the ones it waits for.
 *
 * Every page carries the search, and six of the seven carry a playground. `start.ts` reaches the
 * playground through `await import` for that reason, so the one page with no form on it fetches
 * none of it. A static import would have put both on every page the day the masthead gained a field,
 * and the playground is the larger half - `build.ts` prints what each module weighs.
 *
 * Those two counts said *four of the thirteen* and *nine pages* until ADR-0195 measured them; what
 * the argument needs is neither number, only that some page cannot use the module.
 *
 * It is declared rather than derived because it is a claim about *when*, and nothing in a module
 * graph carries that. `a-module-loaded-before-a-reader-acts-is-one-the-entry-point-imports-outright`
 * is what holds the two together, by separating the specifiers that survive stripping into the ones
 * written `from` and the ones written `import(`.
 *
 * **That sentence named a guard nothing collected for the whole of this constant's life.** It cited
 * `every-page-loads-the-search-and-only-a-contract-page-loads-the-playground`, measured at `17cc9bf`:
 * no suite anywhere in this repository collects that identifier, and no record cites it, so it was
 * outside the reach of `confirmationFaults` and `citationFaults` alike - which is the class ADR-0126
 * opened an entry for, found here by adding a row to the list and asking what would check it.
 */
export const LOADED_BEFORE_A_READER_ACTS: readonly string[] = [
  'packages/site/start.ts',
  'packages/site/what-a-control-says.ts',
  'packages/site/searching.ts',
  'packages/site/theme.ts',
  'packages/registry/search.ts',
  'packages/registry/address.ts',
  'packages/catalogue/identifier.ts',
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

  return asAContractsReference(blob.bytes.toString('utf8'))
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
