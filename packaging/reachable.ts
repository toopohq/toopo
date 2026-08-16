/**
 * Which of the compiled modules the entry point can actually reach.
 *
 * ---------------------------------------------------------------------------
 * Why the compiler's output is wider than the program
 * ---------------------------------------------------------------------------
 *
 * `tsc` emits every file in the program, and a file enters the program by being *typed* against, not
 * by being loaded. Six modules of this repository reach the archive that way and nothing imports them
 * at run time: `packages/cli/source.ts` is where `RegistrySource` is declared, `packages/registry/field-map.ts` is where
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
 *
 * ---------------------------------------------------------------------------
 * Why a second folder reads this one, and why it is not moved
 * ---------------------------------------------------------------------------
 *
 * `packages/registry/serialise.ts` asks the same question of a contract folder - *what does this reach
 * that it does not own* - and ADR-0026 forbids the second copy of a parser. So the parser and the walk
 * are exported and reached rather than restated, and what differs between the two callers is supplied
 * as an argument: this one walks compiled output, where a specifier is already a file, and the
 * registry walks sources, where a `.js` specifier names a `.ts` file.
 *
 * **It stays under `packaging/` although two folders read it, and that is a choice rather than an
 * oversight.** The layering would read better one folder up; what decides against moving it is the
 * instrument. A-07 of the `packaging` battery edits this file by name to measure that the parser sees
 * a specifier leaving its folder, and a battery may edit only the folder under measurement - so moving
 * the file makes that cell unreachable from the battery whose subject it is. A measured cell is worth
 * more than a tidier import, and ADR-0105 carries the trade.
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

/**
 * Every relative specifier a compiled module imports.
 *
 * Both forms, because a side-effect import loads a module exactly as a named one does and is the
 * spelling a regular expression over `from` would miss.
 */
export const specifiersIn = (text: string): readonly string[] => [
  ...[...text.matchAll(/(?:^|[\s,{;])from\s*['"](\.[^'"]*)['"]/g)].map((match) => match[1] as string),
  ...[...text.matchAll(/(?:^|[\s;])import\s*['"](\.[^'"]*)['"]/g)].map((match) => match[1] as string),
  ...[...text.matchAll(/\bimport\s*\(\s*['"](\.[^'"]*)['"]\s*\)/g)].map((match) => match[1] as string),
]

/**
 * Where a specifier written in one file leads, as an absolute path.
 *
 * The only thing that differs between a walk over compiled output and a walk over sources, which is
 * why it is the only thing a caller supplies.
 */
export type ResolveSpecifier = (from: string, specifier: string) => string

/**
 * Every file an entry point reaches, as absolute paths, including the entry point.
 *
 * A file that does not exist ends that branch rather than stopping the walk: a specifier can name a
 * package rather than a file, and the closure of what is *here* is what both callers are asking for.
 */
export const closureFrom = (entry: string, resolve: ResolveSpecifier): ReadonlySet<string> => {
  const seen = new Set<string>()
  const pending = [entry]

  while (pending.length > 0) {
    const file = pending.pop() as string
    if (seen.has(file) || !existsSync(file)) continue
    seen.add(file)

    for (const specifier of specifiersIn(readFileSync(file, 'utf8'))) {
      pending.push(resolve(file, specifier))
    }
  }

  return seen
}

/** The compiled files the entry point reaches, where a specifier is already the name of a file. */
export const reachableFrom = (entry: string): ReadonlySet<string> =>
  closureFrom(entry, (file, specifier) => join(dirname(file), specifier))
