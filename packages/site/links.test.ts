/**
 * How this site composes an address a reader follows.
 *
 * ---------------------------------------------------------------------------
 * The defect this was written for, and why nothing else could see it
 * ---------------------------------------------------------------------------
 *
 * `domain-page.ts` builds two lists of links from one page: the contracts a domain publishes, and the
 * ones it turned down. Both sit at `/typescript/<domain>/index.html`, both link to a contract, and
 * they were written differently - `turnedDownEntry` composed its root with `rootFrom(own)` and `entry`
 * wrote `../../` into the template. The two agree today, exactly: `rootFrom` counts the segments of
 * the page it is given, a domain page has three, and `'../'.repeat(2)` is what it returns.
 *
 * **So every guard this repository holds was green, correctly.** The page renders, the walk over the
 * page graph resolves both links because both are right, and the two spellings differ in nothing a
 * reader or a suite can observe. What separates them is what happens on the day a domain page moves:
 * one link follows and the other keeps pointing two folders up from wherever it lands.
 *
 * `CLAUDE.md` already carries the rule, from ADR-0059 - *a computed root states how far up it is
 * going, and what it is going up from* - and the unused parameter is what said it was not being kept:
 * `entry` took `own` and never read it. The rule was written; nothing held it.
 *
 * ---------------------------------------------------------------------------
 * Why the reading is of the source and not of the rendered page
 * ---------------------------------------------------------------------------
 *
 * A guard over the emitted tree cannot ask this question. `every-page-is-reachable-from-the-front-page`
 * walks the hrefs and resolves them, so a root that is *wrong* is already caught - and a root that is
 * typed and right is indistinguishable, in the rendering, from one that is composed. The difference
 * exists only in what was written, so that is what is read.
 *
 * ---------------------------------------------------------------------------
 * Why an import specifier is exempt, and why that is a distinction rather than a hole
 * ---------------------------------------------------------------------------
 *
 * `../` occurs 72 times in these sources as a module specifier and once as a link, measured when this
 * was written. A specifier is resolved by the module system against the file that writes it, and it
 * moves with that file because the compiler moves it; an href is resolved by a browser against the
 * page it was rendered onto, which is not the file that wrote it. Two different questions about the
 * same three characters, and only the second has a page in it. The syntax tree tells them apart
 * exactly, which is why this reads a tree rather than lines.
 */

import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { everyNode, readSources } from '../validation/source.js'
import type { Node } from '../validation/typescript-api.js'
import { TYPESCRIPT_SURFACE } from '../validation/typescript-api.js'

const { SyntaxKind } = TYPESCRIPT_SURFACE

/** The compiler is a process, and a process is slower than everything else in this suite. */
const READ_TIMEOUT_MS = 30_000

/** A relative segment, which is the whole of what a typed root is made of. */
const UPWARDS = '../'

/**
 * Where a root may be written down, because it is where one is composed.
 *
 * `paths.ts` holds `rootFrom`, and a function that builds `'../'.repeat(n)` has to name the thing it
 * repeats. Exempting the composer rather than the callers is what keeps the rule total: there is one
 * place, it is named here, and a second one cannot appear without this line changing.
 */
const WHERE_A_ROOT_IS_COMPOSED = 'paths.ts'

/**
 * What the site writes, which is its modules and never its tests.
 *
 * A test states an expectation, and an expectation about a link legitimately quotes one. The claim
 * here is about what is rendered onto a page, so the population is the code that renders.
 */
const theSiteModules = (): readonly string[] =>
  readdirSync(import.meta.dirname)
    .filter((file) => file.endsWith('.ts'))
    .filter((file) => !file.endsWith('.test.ts') && !file.endsWith('.test-d.ts'))
    .filter((file) => file !== WHERE_A_ROOT_IS_COMPOSED)
    .sort()

/** Every node whose own text a reader could receive as part of an address. */
const carriesText = (node: Node): boolean =>
  node.kind === SyntaxKind.StringLiteral ||
  node.kind === SyntaxKind.NoSubstitutionTemplateLiteral ||
  node.kind === SyntaxKind.TemplateHead ||
  node.kind === SyntaxKind.TemplateMiddle ||
  node.kind === SyntaxKind.TemplateTail

/**
 * Whether this literal is where a module system looks rather than where a browser does.
 *
 * Both spellings, because a static specifier and a deferred one are the same claim about resolution
 * and only one of them is an `ImportDeclaration`.
 */
const isAModuleSpecifier = (node: Node): boolean => {
  const parent = (node as { parent?: Node }).parent
  if (parent === undefined) return false

  if (
    parent.kind === SyntaxKind.ImportDeclaration ||
    parent.kind === SyntaxKind.ExportDeclaration ||
    parent.kind === SyntaxKind.ImportType
  ) {
    return true
  }

  return (
    parent.kind === SyntaxKind.CallExpression &&
    (parent as unknown as { expression: Node }).expression.kind === SyntaxKind.ImportKeyword
  )
}

describe('how this site composes an address a reader follows', () => {
  it(
    'every-address-a-page-links-to-is-composed-and-never-typed',
    () => {
      const modules = theSiteModules()
      expect(modules.length).toBeGreaterThan(0)

      const faults = readSources(
        {
          project: join(import.meta.dirname, 'tsconfig.json'),
          files: modules.map((file) => join(import.meta.dirname, file)),
        },
        (sources) =>
          sources.flatMap((source) =>
            [...everyNode(source.file)]
              .filter(carriesText)
              .filter((node) => (node as unknown as { text: string }).text.includes(UPWARDS))
              .filter((node) => !isAModuleSpecifier(node))
              .map(
                (node) =>
                  `${source.path.replaceAll('\\', '/').split('/').at(-1)}: ` +
                  `\`${(node as unknown as { text: string }).text}\` writes a root instead of ` +
                  `composing one - ${WHERE_A_ROOT_IS_COMPOSED} knows how far up the page it is on sits`,
              ),
          ),
      )

      expect(faults).toEqual([])
    },
    READ_TIMEOUT_MS,
  )
})
