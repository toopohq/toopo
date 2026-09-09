/**
 * The manifest's runtime dependencies, against the packages the published entry point really names.
 *
 * ---------------------------------------------------------------------------
 * Why this is a guard and not hygiene
 * ---------------------------------------------------------------------------
 *
 * `dependencies` is the field `npm install` walks, and `files: ["dist"]` does not bound it: a package
 * moved from the dev list to the runtime one is installed into every consumer's project, and the two
 * mechanisms stage rule 3 names are about *files* - one asks what the tarball holds, the other asks
 * whether a command loads it, and neither reads either dependency list. So the reader this guard
 * protects is somebody who typed `npx toopo add …`, not somebody who works here.
 *
 * ---------------------------------------------------------------------------
 * It is born green, and what it is worth is the day it is not
 * ---------------------------------------------------------------------------
 *
 * Measured while it was written: the entry point reaches **43 source files** and names **one package**,
 * `typescript`, through `typescript/unstable/sync` and `typescript/unstable/ast`; the manifest declares
 * that one and nothing else. So it finds nothing today, which the verification discipline admits for a
 * guard whose event is named and whose cost is stated - and both are: the event is a package moving
 * between the two lists, and what it costs unwatched is a download on every install of a package the
 * product never loads, or an install that resolves nothing at all.
 *
 * **Both were seen red before this was believed**, each on its own direction and each restored:
 * `wrangler` declared gives `declaredAndNotReached: ['wrangler']`, and an `import 'happy-dom'` written
 * into a module the entry point reaches gives `reachedAndNotDeclared: ['happy-dom']`.
 *
 * ---------------------------------------------------------------------------
 * What it does not cover, written rather than smoothed
 * ---------------------------------------------------------------------------
 *
 * **It reads sources and not `dist/`.** Compilation adds no import, so the two agree by construction
 * today; a build step that injected one would be outside this reading, and `build.ts` is where such a
 * step would go.
 *
 * **It reads one entry point.** `bin.toopo` is the whole of what npm installs a shim for, so a second
 * `bin` entry would be a second closure and this guard would not know.
 *
 * **It says nothing about a version.** `typescript: '7.0.2'` could be any range and this reading is
 * silent; ADR-0097 is where the pinning is argued.
 *
 * **It says nothing about what a dependency depends on.** One package declared and reached can carry a
 * tree, and none of it is read here.
 *
 * **`optionalDependencies` and `peerDependencies` are not read**, and neither exists in this manifest
 * today - so the guard would be silent about one added tomorrow rather than refusing it.
 *
 * **A specifier composed at run time is invisible.** `import(new URL(…))` names no literal, which is
 * ADR-0149's own published blind spot arriving on a second reader; nothing in the closure writes one.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  packagesTheProductReaches,
  whatTheManifestOwes,
} from './what-the-product-imports.js'

const REPOSITORY = join(import.meta.dirname, '..')

/** What npm installs a shim for, read off the manifest rather than typed here. */
const theEntryPoint = (): string => {
  const manifest = JSON.parse(readFileSync(join(REPOSITORY, 'package.json'), 'utf8')) as {
    readonly bin: Readonly<Record<string, string>>
  }
  const compiled = manifest.bin['toopo'] as string

  // `dist/packages/cli/published.js` is built from `packages/cli/published.ts`, and the walk here is
  // over sources: the build is a compilation and never a rewrite of what a module imports.
  return join(REPOSITORY, compiled.replace(/^dist\//, '').replace(/\.js$/, '.ts'))
}

const theDeclaredDependencies = (): readonly string[] =>
  Object.keys(
    (
      JSON.parse(readFileSync(join(REPOSITORY, 'package.json'), 'utf8')) as {
        readonly dependencies?: Readonly<Record<string, string>>
      }
    ).dependencies ?? {},
  )

describe('the manifest, against what the product reaches', () => {
  /**
   * The two lists are asserted whole rather than counted, for the reason the freeze's faults are:
   * they are different defects wearing each other's clothes, and a count would be satisfied by either.
   */
  it('the-runtime-dependencies-are-the-packages-the-product-reaches', () => {
    expect(
      whatTheManifestOwes(theDeclaredDependencies(), packagesTheProductReaches(theEntryPoint())),
    ).toEqual({ reachedAndNotDeclared: [], declaredAndNotReached: [] })
  })
})
