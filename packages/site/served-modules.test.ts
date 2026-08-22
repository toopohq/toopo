import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { everyNode, readSources } from '../validation/source.js'
import type { Node, SourceFile } from '../validation/typescript-api.js'
import { TYPESCRIPT_SURFACE } from '../validation/typescript-api.js'
import {
  THE_BROWSER_GRAPH,
  asABrowserModule,
  asAContractsReference,
  theReferenceModules,
} from './browser.js'
import { heldByTheRegistry } from './catalogue.js'
import { localSource } from './local-source.js'
import { THE_REFERENCE_MODULE } from './paths.js'
import { A_COMMENT_A_TOOL_READS, theCommentRangesIn } from './served-modules.js'

const { SyntaxKind } = TYPESCRIPT_SURFACE

/** The compiler is a process, and a process is slower than everything else in this suite. */
const READ_TIMEOUT_MS = 30_000

/** How much of a comment a fault reprints: enough to find it, never enough to be a second copy. */
const ENOUGH_TO_FIND_IT = 60

/**
 * Where this folder starts counting from, and how far up it goes.
 *
 * `packages/registry/serialise.ts` declares the same root and this file may not reach it:
 * `nothing-but-the-local-adapter-reaches-the-serialisation` keeps the serialisation behind one door,
 * and a guard is not a reason to open a second. `playground.test.ts` computes it the same way for the
 * same reason. ADR-0059.
 */
const ROOT = join(import.meta.dirname, '..', '..')

const sourceOf = (relative: string): string => readFileSync(join(ROOT, relative), 'utf8')

/**
 * The tree a parser builds, flattened: every node's kind, how many children it has, and the value at
 * it if it is a leaf.
 *
 * **Never the node's own source text**, which is the reading this guard was first written with and
 * which cannot fail: an enclosing node's text carries the comments inside it, so two modules differing
 * only in comments differ at every node that contains one, and the comparison reports a difference for
 * the very thing it is meant to permit. `cssText` - the CSS half of this argument, one door along - is
 * a re-serialisation and not a slice of the sheet, and this is the same move.
 *
 * **The child count is what makes it a comparison of trees rather than of a sequence.** Without it the
 * answer is a pre-order list of kinds, and a pre-order list of kinds is not injective over trees of
 * varying arity: two different shapes can flatten to one reading. It is one term and it buys the
 * difference between the guard's name and what the guard does.
 *
 * The file node is skipped because its own `text` is the whole file, which is the one thing that has
 * to differ.
 */
const LITERAL_KINDS: ReadonlySet<number> = new Set<number>([
  SyntaxKind.StringLiteral,
  SyntaxKind.NoSubstitutionTemplateLiteral,
  SyntaxKind.TemplateHead,
  SyntaxKind.TemplateMiddle,
  SyntaxKind.TemplateTail,
  SyntaxKind.RegularExpressionLiteral,
])

/**
 * Where a comment opens in a module, decided by the compiler and never by the reader under test.
 *
 * **`theCommentRangesIn` is deliberately not called here, and the first draft of this guard did call
 * it.** Asking the reader whether it left a comment behind is asking it to mark its own paper: a
 * reader that has stopped recognising a comment reports none remaining and the guard passes. It was
 * measured rather than reasoned about - with the template rescan removed, the reader misses whole
 * regions of `packages/registry/address.js` and this guard, written that way, stayed green.
 *
 * So the parser supplies the one thing that needs judgement - which regions are literals - and the
 * rest is a scan for two adjacent characters. Outside a literal, `//` and `/*` open a comment and
 * nothing else: a regular expression is itself a literal, so its slashes are already excluded.
 */
const commentOpenersIn = (file: SourceFile): readonly number[] => {
  const text = file.getFullText()
  const literals: (readonly [number, number])[] = []

  for (const node of everyNode(file)) {
    if (LITERAL_KINDS.has(node.kind)) literals.push([node.getStart(file), node.getEnd()])
  }

  const found: number[] = []
  for (let at = 0; at + 1 < text.length; at += 1) {
    if (text[at] !== '/') continue
    if (text[at + 1] !== '/' && text[at + 1] !== '*') continue
    if (literals.some(([from, to]) => at >= from && at < to)) continue
    found.push(at)
  }

  return found
}

const shapeOf = (file: SourceFile): readonly string[] => {
  const out: string[] = []

  for (const node of everyNode(file)) {
    if (node.kind === SyntaxKind.SourceFile) continue

    let children = 0
    node.forEachChild((_child: Node) => {
      children += 1
    })

    const value = (node as { readonly text?: unknown }).text
    out.push(`${node.kind}|${children}|${typeof value === 'string' ? value : ''}`)
  }

  return out
}

/**
 * Both readings of every module of the graph, parsed by the compiler and compared node by node.
 *
 * **The parser needs a disk, and that is a fact about this folder rather than an implementation
 * detail.** `typescript/unstable/sync` opens a *project*: `DocumentIdentifier` is a path or a URI and
 * carries no content, and no overlay accepts bytes, so a source that is not on a file system cannot be
 * parsed at all. `build.ts` has been the only file here that writes one, deliberately - and this is the
 * second. What separates them is where the writing lands: `packages/cli/rewrite.ts` writes into a
 * temporary project because it is about to hand those bytes to a user, and this writes into one
 * because a guard has no other way to reach a syntax tree. Neither the generator nor anything a reader
 * receives touches a disk because of this file. ADR-0156.
 */
const eachModuleAgainstItsSource = <T>(
  use: (pairs: readonly { readonly module: string; readonly served: SourceFile; readonly stripped: SourceFile }[]) => T,
): T => {
  const project = mkdtempSync(join(tmpdir(), 'toopo-served-modules-'))

  try {
    const written = THE_BROWSER_GRAPH.map((relative, index) => {
      const source = sourceOf(relative)
      const served = `served-${String(index).padStart(2, '0')}.js`
      const stripped = `stripped-${String(index).padStart(2, '0')}.js`

      writeFileSync(join(project, served), asAContractsReference(source), 'utf8')
      writeFileSync(join(project, stripped), asABrowserModule(source), 'utf8')

      return { module: relative, served, stripped }
    })

    writeFileSync(
      join(project, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          allowJs: true,
          checkJs: false,
          noEmit: true,
          module: 'esnext',
          target: 'esnext',
          moduleResolution: 'bundler',
        },
        include: ['*.js'],
      }),
      'utf8',
    )

    const files = written.flatMap((one) => [join(project, one.served), join(project, one.stripped)])

    return readSources({ project: join(project, 'tsconfig.json'), files }, (sources) => {
      const byName = new Map(
        sources.map((one) => [one.path.replaceAll('\\', '/').split('/').at(-1) as string, one.file]),
      )

      return use(
        written.map((one) => ({
          module: one.module,
          served: byName.get(one.served) as SourceFile,
          stripped: byName.get(one.stripped) as SourceFile,
        })),
      )
    })
  } finally {
    rmSync(project, { recursive: true, force: true })
  }
}

describe('a reader receives the module and not the argument for it', () => {
  /**
   * The prose of this repository's own modules does not travel.
   *
   * Measured at `43db0c2`, on the built tree, by the compiler's parser read over the served bytes:
   * the fourteen served modules carry **107 979 B of comment out of 175 400 - 62 %**. What one reader
   * pays is the smaller and truer figure: the five modules every page loads go from **25 569 B to
   * 6 090 B in brotli**, which is 2.46 times what taking the prose out of the stylesheet bought.
   * ADR-0156 carries the reading.
   *
   * **The source is asserted to carry comments first**, because a sweep whose population has left is a
   * sweep that passes by having nothing to look at.
   */
  it(
    'every-module-a-reader-runs-carries-no-comment',
    () => {
      const faults = eachModuleAgainstItsSource((pairs) =>
        pairs.flatMap((pair) => {
          if (commentOpenersIn(pair.served).length === 0) {
            return [`${pair.module} carries no comment to remove`]
          }

          const left = commentOpenersIn(pair.stripped)
          if (left.length === 0) return []

          const text = pair.stripped.getFullText()

          return [
            `${pair.module} still carries ${left.length} comment(s), the first being ` +
              `${JSON.stringify(text.slice(left[0] as number, (left[0] as number) + ENOUGH_TO_FIND_IT))}`,
          ]
        }),
      )

      expect(faults).toEqual([])
    },
    READ_TIMEOUT_MS,
  )

  /**
   * What a reader downloads is the program its source declares, and a compiler is what says so.
   *
   * **This is the total check that stands where a rule-by-rule walk of `cssRules` stands for the
   * stylesheet, and it is not the same kind of thing.** For CSS the browser both parses and renders, so
   * the comparison was taken from the consumer. JavaScript's consumer exposes no normal form at all -
   * measured four ways in ADR-0156, of which the sharpest is that `Function.prototype.toString` returns
   * source text with the comments in it. So the comparison is a third party's, and the third party is
   * the compiler stage 1 already trusts to decide what enters the catalogue.
   *
   * It was checked against the consumer on the one point that matters. A `return` separated from its
   * value by a comment spanning a line: V8 answers `undefined`, `undefined` and `42` for the comment
   * kept, replaced by a line terminator, and deleted; the parser builds `ReturnStatement,
   * ExpressionStatement` for the first two and `ReturnStatement` for the third. Case for case, they
   * agree.
   *
   * Measured at `43db0c2` over 9 637 nodes: **zero differing**. Perturbed - a statement deleted gives
   * 375, an identifier renamed gives 4, and the hazard planted gives 3.
   */
  it(
    'a-module-a-reader-runs-is-the-program-its-source-declares',
    () => {
      const faults = eachModuleAgainstItsSource((pairs) =>
        pairs.flatMap((pair) => {
          const before = shapeOf(pair.served)
          const after = shapeOf(pair.stripped)

          if (before.length === 0) return [`${pair.module} parses to nothing`]

          const differing = Array.from(
            { length: Math.max(before.length, after.length) },
            (_unused, at) => at,
          ).filter((at) => before[at] !== after[at])

          return differing.length === 0
            ? []
            : [
                `${pair.module}: ${differing.length} node(s) differ, first at ${differing[0]} - ` +
                  `${before[differing[0] as number] ?? 'nothing'} became ` +
                  `${after[differing[0] as number] ?? 'nothing'}`,
              ]
        }),
      )

      expect(faults).toEqual([])
    },
    READ_TIMEOUT_MS,
  )

  /**
   * A contract's reference reaches a reader with its argument intact.
   *
   * `contract-page.ts` publishes *the JavaScript this runs is that contract's own `reference.ts` with
   * its types stripped*, and that sentence is on the one page whose subject is that this catalogue can
   * be checked. A second removal would make it false, and it would widen the gap between what an
   * auditor fetches and what the digest covers - on a file frozen for the life of the major.
   *
   * Measured at `43db0c2`: the five references carry **15 417 B of comment out of 23 644**, which is
   * 14 % of everything this unit could have taken and none of what a page loads before a reader acts.
   * So the refusal costs nothing a reader pays.
   */
  it('a-contracts-reference-reaches-a-reader-with-its-argument-intact', () => {
    const source = localSource()
    const held = heldByTheRegistry(source)
    const served = theReferenceModules(source, held)

    const faults = held.flatMap((one) => {
      const what = renderContract(one.contract.address)
      const files = one.implementation.files
      const blob = source.blob((files[0] as (typeof files)[number]).sha256)
      if (blob === null) return [`${what} has no blob to compare against`]

      const frozen = blob.bytes.toString('utf8')
      const carried = theCommentRangesIn(asAContractsReference(frozen)).length
      if (carried === 0) return [`${what} carries no comment, so this guard has nothing to keep`]

      const written = served.get(`${what}/${THE_REFERENCE_MODULE}`)
      if (written === undefined) return [`${what} writes no reference module`]

      return written === asAContractsReference(frozen)
        ? []
        : [
            `${what} is served something other than its own reference with the types stripped: ` +
              `${carried} comment(s) in the frozen file, ` +
              `${theCommentRangesIn(written).length} in what is written`,
          ]
    })

    expect(faults).toEqual([])
  })

  /**
   * No module a reader runs carries a comment something other than a reader reads.
   *
   * **This exists because of what the guard above it cannot see.** Removing a source-map directive or
   * a purity annotation leaves the syntax tree identical, so a total comparison of trees is blind in
   * exactly the place where the consequence is not syntactic. The answer is the one
   * `a-page-loads-nothing-and-runs-nothing` gives about `url(`: make the hazard impossible rather than
   * detect it.
   *
   * Born green - measured at `43db0c2`, the served modules carry none - and justified by the event.
   * The day somebody adds a source map to this build, this reddens rather than the map being silently
   * dropped from what a browser fetches.
   */
  it('no-module-a-reader-runs-carries-a-comment-a-tool-reads', () => {
    const faults = THE_BROWSER_GRAPH.flatMap((relative) => {
      const annotated = asAContractsReference(sourceOf(relative))

      return theCommentRangesIn(annotated).flatMap((comment) => {
        const body = annotated.slice(comment.from, comment.to)

        return A_COMMENT_A_TOOL_READS.filter((form) => body.includes(form)).map(
          (form) => `${relative} carries a comment holding ${form}`,
        )
      })
    })

    expect(faults).toEqual([])
  })
})
