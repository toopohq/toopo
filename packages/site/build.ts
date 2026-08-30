/**
 * The file you run to build the site.
 * ADR-0090 is why this asks git, and why a working tree that disagrees with its commit publishes
 * nothing.
 *
 *   node packages/site/build.ts
 *
 * ---------------------------------------------------------------------------
 * The only thing in this folder that touches a disk
 * ---------------------------------------------------------------------------
 *
 * Every page is a value and every guard builds one in memory. That is not an economy: it is the
 * property `packages/cli/command.ts` already keeps for the installer - *everything this tool decides is
 * reachable from a guard, with no process, no working directory and no clock* - and this file is where
 * it stops, deliberately and in one place.
 *
 * **The playground did not move that line, and it was the obvious place for it to.** What a browser
 * runs is produced by `browser.ts` as values - the references come through the port and are stripped
 * in memory, so `playground.test.ts` runs the very artefact this writes. The one thing that genuinely
 * needs a disk is reading this repository's own modules, and it is done here, in the six lines below,
 * rather than by a guard reaching for a working directory.
 *
 * The output is not committed. Generated HTML is not a contract, an implementation, a test, or the
 * evidence a run produced, so it does not belong in this repository; `.gitignore` keeps it out and
 * this sentence is why, rather than leaving the entry to look like an oversight.
 *
 * The two imports below are `.ts` and dynamic on purpose: the hook that translates a `.js` specifier
 * cannot be used before it has been registered.
 */

import '../../typescript-imports.ts'

const { mkdirSync, readFileSync, rmSync, writeFileSync } = await import('node:fs')
const { dirname, join } = await import('node:path')

const { theRevision } = await import('../registry/revision.ts')
const { THE_BROWSER_GRAPH, asABrowserModule } = await import('./browser.ts')
const { THE_FONT_ADDRESS } = await import('./font.ts')
const { THE_BUILT_TREE, THE_FILES_FOUND_BY_CONVENTION } = await import('./paths.ts')
const { thePublication } = await import('./site.ts')

/**
 * The files a machine looks for at addresses no link points at, taken from where they are declared.
 *
 * The breakdown below is read off the tree and the classification is not, so a file that joined this
 * set and not this line would be counted as an answer - which is how a summary starts describing a
 * tree it no longer matches. It happened once, to the line under it, and the sentence has since been
 * worth its keep twice: `_headers` was the fourth arrival and `404.html` the fifth.
 *
 * **The set itself moved to `paths.ts` when the cache rules became its second reader**, which is what
 * makes a sixth arrival one edit rather than two that can disagree.
 */
const FOUND_BY_CONVENTION = new Set<string>(THE_FILES_FOUND_BY_CONVENTION)

const OUT = join(import.meta.dirname, THE_BUILT_TREE)
const ROOT = join(import.meta.dirname, '..', '..')

/**
 * Which state of this repository the answers were produced from, asked once and for everything.
 *
 * **This is the only place in the repository that asks git what is being published**, and it is the
 * file that already owns the exception: everything else here is a value a guard builds in memory, and
 * this is where that stops. `theRevision` refuses a working tree that does not agree with its commit,
 * so a build is either reproducible from the revision it stamps or it does not happen - which is the
 * one thing a durability anchor has to be worth.
 */
const servedFrom = theRevision(ROOT)

/**
 * What a browser loads: this repository's own modules with their types removed, at the paths their own
 * `.js` specifiers already name.
 *
 * The one thing this file supplies rather than composes, because reading this repository's own modules
 * off a disk is the exception the header is about. Everything else - the pages, each contract's
 * implementation, the crawler files and every answer the registry can be asked for - is
 * `thePublication`, which `published-tree.test.ts` calls with the same arrangement and empty contents.
 */
const modules = new Map<string, string>(
  THE_BROWSER_GRAPH.map((relative) => [
    relative.replace(/\.ts$/, '.js'),
    asABrowserModule(readFileSync(join(ROOT, relative), 'utf8')),
  ]),
)

const tree = thePublication(servedFrom, modules)

rmSync(OUT, { recursive: true, force: true })

let total = 0

for (const [path, contents] of tree) {
  const destination = join(OUT, path)

  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, contents)

  const bytes = Buffer.isBuffer(contents) ? contents.byteLength : Buffer.byteLength(contents, 'utf8')
  total += bytes
  process.stdout.write(`${String(bytes).padStart(7)} B  ${path}\n`)
}

/**
 * The breakdown is read off the tree that was just written rather than off the maps that built it, so
 * that the line says what landed on the disk. A count taken from an input is a claim about an
 * intention.
 */
const written = [...tree.keys()]
const pages = written.filter((path) => path.endsWith('index.html')).length
const markdown = written.filter((path) => path.endsWith('.md')).length
const scripts = written.filter((path) => path.endsWith('.js')).length
const conventional = written.filter((path) => FOUND_BY_CONVENTION.has(path)).length
/**
 * The face is counted rather than left to fall through, and the comment above says why in advance:
 * the answers are what is left once everything classified is taken out, so a file nobody classified
 * is reported as an answer. It is the sixth arrival and the first that would have moved a figure
 * this repository publishes - 73 answers is what the origin serves and what a client asks for, and
 * a font is none of them.
 */
const fonts = written.filter((path) => path === THE_FONT_ADDRESS).length

process.stdout.write(
  `${String(total).padStart(7)} B  ${tree.size} files: ${pages} pages, ${markdown} markdown, ` +
    `${scripts} modules, ${conventional} found by convention, ${fonts} font, ` +
    `${tree.size - pages - markdown - scripts - conventional - fonts} answers\n` +
    `served from ${servedFrom}\n`,
)
