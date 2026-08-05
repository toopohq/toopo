/**
 * The file you run to build the site.
 *
 *   node site/build.ts
 *
 * ---------------------------------------------------------------------------
 * The only thing in this folder that touches a disk
 * ---------------------------------------------------------------------------
 *
 * Every page is a value and every guard builds one in memory. That is not an economy: it is the
 * property `cli/command.ts` already keeps for the installer - *everything this tool decides is
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

import '../typescript-imports.ts'

const { mkdirSync, readFileSync, rmSync, writeFileSync } = await import('node:fs')
const { dirname, join } = await import('node:path')

const { THE_BROWSER_GRAPH, asABrowserModule, theReferenceModules } = await import('./browser.ts')
const { heldByTheRegistry } = await import('./catalogue.ts')
const { toHtml } = await import('./document.ts')
const { localSource } = await import('./local-source.ts')
const { theCrawlerFilesOf, theSite } = await import('./site.ts')

const OUT = join(import.meta.dirname, 'out')
const ROOT = join(import.meta.dirname, '..')

const source = localSource()
const pages = theSite(source)

/**
 * What a browser loads: this repository's own modules with their types removed, at the paths their
 * own `.js` specifiers already name, and each contract's implementation beside its page.
 */
const modules = new Map<string, string>([
  ...THE_BROWSER_GRAPH.map(
    (relative) =>
      [
        relative.replace(/\.ts$/, '.js'),
        asABrowserModule(readFileSync(join(ROOT, relative), 'utf8')),
      ] as const,
  ),
  ...theReferenceModules(source, heldByTheRegistry(source)),
])

rmSync(OUT, { recursive: true, force: true })

let total = 0

const write = (path: string, contents: string): void => {
  const destination = join(OUT, path)

  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, contents, 'utf8')

  const bytes = Buffer.byteLength(contents, 'utf8')
  total += bytes
  process.stdout.write(`${String(bytes).padStart(7)} B  ${path}\n`)
}

const crawlerFiles = theCrawlerFilesOf(pages)

for (const [path, page] of pages) write(path, toHtml(page))
for (const [path, module] of modules) write(path, module)
for (const [path, contents] of crawlerFiles) write(path, contents)

process.stdout.write(
  `${String(total).padStart(7)} B  ${pages.size} pages, ${modules.size} modules, ` +
    `${crawlerFiles.size} for crawlers\n`,
)
