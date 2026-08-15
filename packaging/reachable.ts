/**
 * Which of the compiled modules the entry point can actually reach.
 *
 * ---------------------------------------------------------------------------
 * Why the compiler's output is wider than the program
 * ---------------------------------------------------------------------------
 *
 * `tsc` emits every file in the program, and a file enters the program by being *typed* against, not
 * by being loaded. Six modules of this repository reach the archive that way and nothing imports them
 * at run time: `cli/source.ts` is where `RegistrySource` is declared, `packages/registry/field-map.ts` is where
 * `VerificationStratum` is, and four more arrive behind them. Measured: 44 kB of 362 kB unpacked, all
 * of it modules with real exports that no command ever loads.
 *
 * `verbatimModuleSyntax` is what makes this decidable rather than a guess. A type-only import is
 * written `import type` and is erased, so the emitted JavaScript carries an import exactly when
 * something is loaded - which means reading the *output* answers a question about the output that
 * reading the input could not.
 *
 * ---------------------------------------------------------------------------
 * What this is not
 * ---------------------------------------------------------------------------
 *
 * It is a build step, and it is deliberately not the guard. `archive.test.ts` establishes the same
 * property by running the installed commands under a loader that records what node really loads - two
 * mechanisms rather than one statement twice, and they fail on opposite conditions. A walk that
 * dropped a needed module makes the tool refuse to start; a walk that kept an unused one leaves a file
 * no command loads. Neither can hide behind the other.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Every relative specifier a compiled module imports.
 *
 * Both forms, because a side-effect import loads a module exactly as a named one does and is the
 * spelling a regular expression over `from` would miss.
 */
const specifiersIn = (text: string): readonly string[] => [
  ...[...text.matchAll(/(?:^|[\s,{;])from\s*['"](\.[^'"]*)['"]/g)].map((match) => match[1] as string),
  ...[...text.matchAll(/(?:^|[\s;])import\s*['"](\.[^'"]*)['"]/g)].map((match) => match[1] as string),
  ...[...text.matchAll(/\bimport\s*\(\s*['"](\.[^'"]*)['"]\s*\)/g)].map((match) => match[1] as string),
]

/** The compiled files the entry point reaches, as absolute paths, including the entry point. */
export const reachableFrom = (entry: string): ReadonlySet<string> => {
  const seen = new Set<string>()
  const pending = [entry]

  while (pending.length > 0) {
    const file = pending.pop() as string
    if (seen.has(file) || !existsSync(file)) continue
    seen.add(file)

    for (const specifier of specifiersIn(readFileSync(file, 'utf8'))) {
      pending.push(join(dirname(file), specifier))
    }
  }

  return seen
}
