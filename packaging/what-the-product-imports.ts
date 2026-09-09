/**
 * Which packages the published entry point really names, and what the manifest owes against them.
 *
 * ---------------------------------------------------------------------------
 * Why a second reader beside `specifiersIn`, and why that is not a copy
 * ---------------------------------------------------------------------------
 *
 * `reachable.ts` reads *relative* specifiers with a regular expression and walks them, and that is
 * sound for the walk by a property of the walk rather than by a property of the pattern: a specifier
 * a comment happens to contain leads to a file that does not exist, and `closureFrom` ends that
 * branch. **A phantom file is discarded by the filesystem; a phantom package has nothing to discard
 * it.** So the same pattern pointed at bare specifiers publishes packages that are not there.
 *
 * Measured over the forty-three files the entry point reaches, with the anchors `specifiersIn` itself
 * uses: the pattern answers **five packages and four of them do not exist** - `did the lockfile change
 * at all`, `we changed this underneath you`, `the registry lost it` and one spanning a line break -
 * every one a sentence of prose in which the word `from` precedes a quoted phrase. It also
 * over-counts the relative specifiers by two and the `node:` ones by two, from the same cause.
 *
 * So this is not `specifiersIn` written twice. It is the reading that pattern cannot make, and the
 * two are kept apart with the reason beside each: the cheap one where a wrong answer is discarded,
 * the exact one where it would be published. ADR-0026 forbids a second copy of a parser and this is
 * not one; ADR-0156 is the precedent for the choice, where a hand-rolled scan of the same sources
 * lost template parity and returned a plausible number rather than an error.
 *
 * ---------------------------------------------------------------------------
 * What the exact reading is, and what it costs
 * ---------------------------------------------------------------------------
 *
 * The scanner this repository already drives for the site's two readers, asked for the tokens of a
 * module and read three tokens at a time. A comment is a token the language names, so prose cannot
 * reach this reading at all - which is the whole difference from a pattern, and it is structural
 * rather than a matter of a better expression.
 *
 * It costs a lexing of forty-three files and no child process: `createScanner` runs in process, where
 * a parse would spawn the compiler. `packages/site/scanning.ts` is the drive and
 * `packages/validation/typescript-api.ts` is the one door onto the compiler, so nothing here reaches
 * for a second one.
 *
 * ---------------------------------------------------------------------------
 * Why it lives under `packaging/` and not beside the walk
 * ---------------------------------------------------------------------------
 *
 * The `packaging` battery injects into this folder, so a guard built on this module has a witness -
 * which is what four other entries of the open list are refused for, and what makes this one takeable.
 *
 * It is a module of its own rather than a function added to `reachable.ts` because that file is
 * imported by `packages/registry/serialise.ts` and by `mutation/selection.test.ts`, and a scanner
 * import added there would put the lexer on both their graphs to serve one guard. Measured: neither
 * `packaging/reachable.ts` nor `packages/site/scanning.ts` is inside what the published entry point
 * reaches, so nothing here changes what an install downloads.
 */

import { readFileSync } from 'node:fs'

import { TYPESCRIPT_SURFACE } from '../packages/validation/typescript-api.js'
import { everyTokenIn } from '../packages/site/scanning.js'
import { closureFrom, sourceNamedBy } from './reachable.js'

const { SyntaxKind } = TYPESCRIPT_SURFACE

/**
 * Whether a token is one the language runs rather than one it skips.
 *
 * Read off the enum's own trivia range rather than off a list of kinds kept here: a list would be a
 * second statement of what the compiler already declares, and it would go stale in the direction
 * nobody notices - a new trivia kind arriving as a token of substance.
 */
const ofSubstance = (kind: number): boolean =>
  kind < SyntaxKind.FirstTriviaToken || kind > SyntaxKind.LastTriviaToken

/**
 * Every specifier one module imports, whatever it names.
 *
 * Three shapes and no more, which is the same population `specifiersIn` recognises: `from '…'`, which
 * covers a value import, a type import and a re-export; a bare `import '…'`, which loads a module for
 * its effects; and `import('…')`, which is the deferred one. A string literal in any other position
 * is a string, and the token before it is what says so.
 */
export const specifiersImportedIn = (source: string): readonly string[] => {
  const tokens = everyTokenIn(source).filter((token) => ofSubstance(token.kind))
  const found: string[] = []

  for (let at = 0; at < tokens.length; at += 1) {
    const token = tokens[at] as { kind: number; from: number; to: number }
    if (token.kind !== SyntaxKind.StringLiteral) continue

    const before = tokens[at - 1]?.kind
    const twoBefore = tokens[at - 2]?.kind
    const isSpecifier =
      before === SyntaxKind.FromKeyword ||
      before === SyntaxKind.ImportKeyword ||
      (before === SyntaxKind.OpenParenToken && twoBefore === SyntaxKind.ImportKeyword)

    // The quotes are one character each on both sides, whichever of the two the author wrote.
    if (isSpecifier) found.push(source.slice(token.from + 1, token.to - 1))
  }

  return found
}

/**
 * The package a specifier names, or nothing where it names no package.
 *
 * A relative specifier names a file of this repository and a `node:` one names the runtime, so
 * neither is a dependency anybody declares. What is left is scoped or bare, and a scope is two
 * segments because `@types/node` is one package and `@types` is not.
 */
export const packageNamedBy = (specifier: string): string | null => {
  if (specifier.startsWith('.') || specifier.startsWith('node:')) return null

  const segments = specifier.split('/')
  const first = segments[0] as string

  return first.startsWith('@') ? `${first}/${segments[1] ?? ''}` : first
}

/**
 * Every package the published entry point reaches, walking this repository's own closure.
 *
 * The walk is `reachable.ts`'s and the resolution is `sourceNamedBy`, so this asks about *sources*
 * rather than about `dist/`. Both answer the same thing and the source walk needs no build, which is
 * what lets a guard run in a suite rather than after one.
 */
export const packagesTheProductReaches = (entry: string): ReadonlySet<string> => {
  const named = new Set<string>()

  for (const file of closureFrom(entry, sourceNamedBy)) {
    for (const specifier of specifiersImportedIn(readFileSync(file, 'utf8'))) {
      const name = packageNamedBy(specifier)
      if (name !== null) named.add(name)
    }
  }

  return named
}

/** What the two sides disagree about, in the two directions that fail differently. */
export type WhatTheManifestOwes = {
  /** Reached and undeclared: an install that resolves nothing, on every consumer's machine. */
  readonly reachedAndNotDeclared: readonly string[]
  /** Declared and unreached: a package every consumer downloads and no command loads. */
  readonly declaredAndNotReached: readonly string[]
}

/**
 * The manifest's runtime dependencies against what the product really names.
 *
 * Both directions, because either alone is satisfied by something wrong. A declaration that is a
 * superset installs a package into every consumer's project for nothing; a declaration that is a
 * subset is an install that fails to resolve. They are two defects and a guard asserting one of them
 * would be green on the other.
 */
export const whatTheManifestOwes = (
  declared: readonly string[],
  reached: ReadonlySet<string>,
): WhatTheManifestOwes => ({
  reachedAndNotDeclared: [...reached].filter((name) => !declared.includes(name)).sort(),
  declaredAndNotReached: declared.filter((name) => !reached.has(name)).sort(),
})
