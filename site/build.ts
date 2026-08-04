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
 * The output is not committed. Generated HTML is not a contract, an implementation, a test, or the
 * evidence a run produced, so it does not belong in this repository; `.gitignore` keeps it out and
 * this sentence is why, rather than leaving the entry to look like an oversight.
 *
 * The two imports below are `.ts` and dynamic on purpose: the hook that translates a `.js` specifier
 * cannot be used before it has been registered.
 */

import '../typescript-imports.ts'

const { mkdirSync, rmSync, writeFileSync } = await import('node:fs')
const { dirname, join } = await import('node:path')

const { toHtml } = await import('./document.ts')
const { localSource } = await import('./local-source.ts')
const { theSite } = await import('./site.ts')

const OUT = join(import.meta.dirname, 'out')

const pages = theSite(localSource())

rmSync(OUT, { recursive: true, force: true })

let total = 0
for (const [path, page] of pages) {
  const html = toHtml(page)
  const bytes = Buffer.byteLength(html, 'utf8')
  const destination = join(OUT, path)

  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, html, 'utf8')

  total += bytes
  process.stdout.write(`${String(bytes).padStart(7)} B  ${path}\n`)
}

process.stdout.write(`${String(total).padStart(7)} B  ${pages.size} pages\n`)
