/**
 * The file the continuous integration runs to decide whether this tree may be deployed.
 * ADR-0125 is the decision; `what-the-origin-lists.ts` is where the reading happens.
 *
 *
 *   node packaging/print-what-a-deployment-would-drop.ts
 *
 * It prints what the origin lists, what this tree writes, and the difference in the one direction that
 * can be a fault — split into the pages this site may retire and the contract addresses it may not
 * drop, which is ADR-0188. **The printing is not decoration**: the job that runs this is the only place a reader can
 * afterwards see why a deployment went ahead, and a verdict with neither of its two sides beside it is
 * a verdict nobody can check. It is the argument `print-whether-to-publish.ts` makes, on the other
 * thing this repository does that cannot be undone.
 *
 * **The verdict says *lists* and not *serves*, and the two parted by ten.** Measured at `2ac6803`, the
 * origin listed seven addresses and answered 200 at ten more this tree had stopped writing, so the
 * sentence this file ended on was false of the origin while being true of the reading behind it. A
 * verdict claims what its reading establishes and no more; `what-the-origin-lists.ts` carries what a
 * per-address reading would and would not have caught. ADR-0202.
 *
 * ---------------------------------------------------------------------------
 * Before the deployment, and that is the whole of why it is a script
 * ---------------------------------------------------------------------------
 *
 * The comparison only says something while the origin is still serving the *previous* deployment.
 * `packaging/against-the-origin/` runs after `wrangler` has uploaded, where the origin serves this
 * commit and every address it lists is one this tree just wrote - a guard that cannot fail, which is
 * the thing this repository refuses to write. So the reading is taken at the one moment it is a
 * reading, between `build the site` and `deploy`.
 *
 * **The coverage is inductive and that is why it must run on every push of `main` rather than before a
 * publication.** Each run compares one deployment against the one before it; a chain of those covers
 * every address back to the first deployment. A push whose run is skipped is a link missing from that
 * chain, and nothing here can see one.
 *
 * ---------------------------------------------------------------------------
 * It reads the tree that is about to be uploaded, and never a rebuilding of it
 * ---------------------------------------------------------------------------
 *
 * `theSite` could be asked the same question in memory. What is deployed is a folder, so the folder is
 * what is asked - the argument `what-npm-holds.ts` already makes about reading the manifest from disk
 * rather than from the constant a guard ties to it. A build that wrote a tree without its sitemap
 * fails here instead of being compared against a re-derivation that has one.
 *
 * ---------------------------------------------------------------------------
 * The two imports below are dynamic, and the sibling's are not
 * ---------------------------------------------------------------------------
 *
 * `print-whether-to-publish.ts` reaches one module of this folder that imports nothing but node's own,
 * so node starts it as it is. This reaches the registry and the site, both of which write their
 * relative imports with a `.js` extension - so the hook that translates one has to be registered
 * before anything carrying one is resolved, and a static import list is hoisted past it. It is the
 * shape `packages/site/build.ts` already has, for the same reason.
 */

import '../typescript-imports.ts'

const { readFileSync } = await import('node:fs')
const { join } = await import('node:path')

const { THE_ORIGIN } = await import('../packages/registry/address.ts')
const { SITEMAP, THE_BUILT_TREE } = await import('../packages/site/paths.ts')
const {
  overHttp,
  theAddressesListedIn,
  theAddressesTheOriginLists,
  whatNoDeploymentMayStopServing,
  whatWouldStopBeingServed,
} = await import('./what-the-origin-lists.ts')

/** One folder up from `packaging/`, which is the repository root. ADR-0059. */
const REPOSITORY = join(import.meta.dirname, '..')

const built = join(REPOSITORY, 'packages', 'site', THE_BUILT_TREE, SITEMAP)

/**
 * Read with no arm of its own: a tree with no sitemap in it is a build that did not happen, and the
 * error node throws names the path, which is the whole of what a reader can act on.
 */
const written = theAddressesListedIn(built, readFileSync(built, 'utf8'))
const served = await theAddressesTheOriginLists(overHttp)
const dropped = whatWouldStopBeingServed(served, written)
const refused = whatNoDeploymentMayStopServing(dropped)

/**
 * Both halves are printed and only one of them stops the deployment.
 *
 * A page this site retires is worth a line on its own: it is a real change to what a reader can reach,
 * and a run log that mentioned it only when it was a fault would leave the ordinary case invisible.
 * The verdict is the last line, so what a reader checks is the list above it. ADR-0188.
 */
const retired = dropped.filter((address) => !refused.includes(address))
const listed = (addresses: readonly string[]): string =>
  addresses.map((address) => `  ${address}\n`).join('')

process.stdout.write(
  `${THE_ORIGIN} lists ${served.size} address${served.size === 1 ? '' : 'es'}\n` +
    `this tree writes ${written.size}\n` +
    `${
      dropped.length === 0
        ? 'and every address the origin lists is still one of them, so this may be deployed\n'
        : `and ${dropped.length} of the origin's would stop being written.\n\n` +
          `${
            retired.length === 0
              ? ''
              : `${retired.length} of them ${retired.length === 1 ? 'is a page' : 'are pages'} ` +
                `this site invented, which it may retire:\n${listed(retired)}\n`
          }` +
          `${
            refused.length === 0
              ? 'None is the address of a contract, so this may be deployed.\n'
              : `${refused.length} of them ${refused.length === 1 ? 'is the address' : 'are addresses'} ` +
                `of a contract:\n${listed(refused)}\n` +
                `A contract major is frozen for the life of the catalogue, so the address it stands ` +
                `at goes on being served — by permanent rule 6 and not by this script's opinion. A ` +
                `reader following one of the above would be told that nothing has ever been served ` +
                `at it, and the 404 of this catalogue promises exactly the opposite about a ` +
                `contract. Serve them.\n`
          }`
    }`,
)

/**
 * A finding rather than a failure, so it leaves a sentence and not a stack.
 *
 * The two ways this file can exit non-zero are worth telling apart by what a reader sees: an origin
 * that could not be read throws `WhatTheOriginListsCannotBeRead` and prints why, and a deployment that
 * would drop the address of a contract prints the addresses and stops here.
 */
if (refused.length > 0) process.exitCode = 1
