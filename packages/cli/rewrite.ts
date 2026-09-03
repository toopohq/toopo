/**
 * Pointing an import at where the file it names actually landed.
 * ADR-0033 is the one spelling every specifier here is repointed to.
 *
 *
 * This is the half of `toopo add` the registry can never help with, and `needs.ts` says so in as many
 * words: an import lives *inside* a file, the inside of a file is the executable half the registry
 * serves and never models, and where a shared copy lands is the installer's own decision taken against
 * a folder the registry does not know. So it happens here, and it happens on text.
 *
 * ---------------------------------------------------------------------------
 * One rule, two jobs
 * ---------------------------------------------------------------------------
 *
 * A specifier is repointed when the file it names did not land where the specifier says it would. That
 * single sentence covers both reasons a file moves: an entry file renamed from `reference.ts` to the
 * name of its feature, and a shared blob written once in somebody else's folder. There is no special
 * case for either, which is what stops the two from drifting apart.
 *
 * ---------------------------------------------------------------------------
 * Parsed rather than matched, and parsed away from the user's project
 * ---------------------------------------------------------------------------
 *
 * A regular expression over `from '...'` is defeated by a comment, a template literal, an `import
 * type`, an `export ... from`, an `import()` and an `import x = require()`. `packages/validation/` already reads
 * all six shapes with a syntax tree, for the same reason and under the same argument, so this reuses
 * `importSpecifiersIn` rather than writing a seventh reader that would be wrong differently.
 *
 * **TypeScript 7 has no standalone parser.** Measured on the version this repository pins,
 * `Object.keys(ts)` is `['version', 'versionMajorMinor']`: the classic compiler API is gone, and the
 * only way to a syntax tree is `typescript/unstable/sync`, which loads a *project*. So the bytes are
 * written into a temporary directory with a `tsconfig.json` of our own and parsed there.
 *
 * **The same removal reaches outside this repository, and a user of this product meets it.** Measured
 * while ADR-0110 was reading the installed layout against four bundlers: `@rollup/plugin-typescript`
 * dies on `ts.ScriptTarget.ES2015` and `ts-loader` on `ts.sys.fileExists`, both `undefined` under
 * 7.0.2, so neither loads at all. Their resolvers are fine - both trees resolved once the plugins were
 * given a TypeScript 5 - which is what makes this a fact about the plugin ecosystem rather than about
 * any layout. It is recorded here because this is where this repository already keeps what TypeScript
 * 7 took away, and because somebody installing a feature into a rollup or webpack project on 7.0.2
 * will meet it with nothing here to tell them what it is.
 *
 * That is not a workaround, it is the correct place for it. The alternative is parsing inside the
 * user's project, under the user's `tsconfig.json` - which would make an install depend on options we
 * did not choose, fail on a project whose configuration excludes the folder we just wrote into, and
 * make "a tsconfig that does not have our options" a way to break `toopo add`. Nothing in this
 * function reads anything the user owns.
 *
 * The files are never executed. They are written, parsed and deleted.
 */

import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, posix } from 'node:path'

import { importSpecifiersIn } from '../validation/forbidden-constructs.js'
import { readSources } from '../validation/source.js'
import { removeDirectory } from './remove-directory.js'
import { theRefusal, under } from './where-a-file-may-land.js'

/** One file to be rewritten, addressed by the path the catalogue serves it at. */
export type SourceToRewrite = {
  readonly servedAt: string
  readonly text: string
}

export type RewriteResult =
  | { readonly sources: ReadonlyMap<string, string> }
  | { readonly faults: readonly string[] }

/**
 * The project the temporary copy is parsed under.
 *
 * Deliberately permissive: nothing here is typechecked, and a strict configuration would only produce
 * diagnostics nobody reads on code that is about to be copied verbatim. What it must do is put every
 * file in the program, which is what `include` is for.
 */
const THE_PARSING_PROJECT = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["."]
}
`

const isRelative = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')

/**
 * The served path a relative specifier names, or `null` when the install set holds no such file.
 *
 * Three spellings are tried because three are legitimate: `./digits.js`, which is what a published
 * source writes and what resolves under every module system; `./digits.ts`, which this repository's own
 * `allowImportingTsExtensions` permits; and `./digits`, which a bundler resolves. Trying them in that
 * order costs nothing and means the installer is not the thing that decides which one an author may
 * use.
 */
const servedPathOf = (
  from: string,
  specifier: string,
  known: ReadonlySet<string>,
): string | null => {
  const target = posix.normalize(posix.join(posix.dirname(from), specifier))
  const candidates = [target, target.replace(/\.js$/, '.ts'), `${target}.ts`]

  return candidates.find((candidate) => known.has(candidate)) ?? null
}

/** A destination as a specifier written from another destination: forward slashes, `.js`, `./` kept. */
const specifierFor = (fromDestination: string, toDestination: string): string => {
  const relative = posix.relative(posix.dirname(fromDestination), toDestination)
  const asJavaScript = relative.replace(/\.ts$/, '.js')

  return asJavaScript.startsWith('.') ? asJavaScript : `./${asJavaScript}`
}

/**
 * The text of each file, with every import pointing at where the file it names was written.
 *
 * Files whose text is unchanged are in the answer too. A caller that had to know which ones moved
 * would be a caller reimplementing this, and the installer hashes every file it writes anyway.
 */
export const rewrittenSources = (
  sources: readonly SourceToRewrite[],
  relocation: Readonly<Record<string, string>>,
): RewriteResult => {
  if (sources.length === 0) return { sources: new Map() }

  const known = new Set(Object.keys(relocation))
  const root = mkdtempSync(join(tmpdir(), 'toopo-rewrite-'))

  try {
    const staged: string[] = []
    for (const source of sources) {
      // The first write an install makes, and the served address is the registry's. ADR-0206.
      const path = under(root, '', source.servedAt)
      if (path === null) return { faults: [theRefusal('the registry', source.servedAt)] }

      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, source.text, 'utf8')
      staged.push(path)
    }

    const project = join(root, 'tsconfig.json')
    writeFileSync(project, THE_PARSING_PROJECT, 'utf8')

    return readSources(
      { project, files: staged },
      (parsed): RewriteResult => {
        const faults: string[] = []
        const rewritten = new Map<string, string>()

        parsed.forEach((file, at) => {
          const source = sources[at] as SourceToRewrite
          const destination = relocation[source.servedAt]
          if (destination === undefined) {
            faults.push(`${source.servedAt} is not in the plan, so nothing knows where it went`)
            return
          }

          // Later first, so that an earlier edit cannot move the offsets of a later one.
          const edits = importSpecifiersIn(file)
            .map((specifier) => ({
              specifier,
              start: specifier.at.getStart(file.file),
              quoted: specifier.at.getText(file.file),
            }))
            .sort((a, b) => b.start - a.start)

          let text = source.text
          for (const edit of edits) {
            const written = edit.specifier.text

            if (!isRelative(written)) {
              faults.push(
                `${source.servedAt} imports \`${written}\`, which is not a registry feature. ` +
                  `Permanent rule 2 forbids a feature from depending on anything else, so there is ` +
                  `nowhere for this installer to point it.`,
              )
              continue
            }

            const servedAt = servedPathOf(source.servedAt, written, known)
            if (servedAt === null) {
              faults.push(
                `${source.servedAt} imports \`${written}\`, and no file of this install is served at ` +
                  `that path - so it would land pointing at nothing.`,
              )
              continue
            }

            const target = relocation[servedAt] as string
            const wanted = specifierFor(destination, target)
            if (wanted === written) continue

            const quote = edit.quoted.slice(0, 1)
            text =
              text.slice(0, edit.start) +
              `${quote}${wanted}${quote}` +
              text.slice(edit.start + edit.quoted.length)
          }

          rewritten.set(source.servedAt, text)
        })

        return faults.length > 0 ? { faults } : { sources: rewritten }
      },
    )
  } finally {
    // Through `removeDirectory` rather than `rmSync`, because this `finally` would otherwise replace a
    // rewrite that worked with an install that failed. `remove-directory.ts` carries the measurement.
    removeDirectory(root)
  }
}
