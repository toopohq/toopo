/**
 * The file you run to build the archive.
 * ADR-0044 is what an archive is, and what may not be in it.
 *
 *
 *   node packaging/build.ts
 *
 * It does three things in one place, and the first of them is why it is one place: **it removes
 * `dist/` before writing it.** `tsc` does not clean, so a source file deleted today leaves its
 * JavaScript in the output directory, and that file ships. A stale module in an archive is the
 * `files` whitelist failing in the one direction a whitelist cannot catch - the archive carries
 * something no source produces any more - so the removal is not tidiness and it is not left to a
 * separate command somebody might not run.
 *
 * Then the compiler, and then nothing. `prepack` is this file, so `npm pack` cannot produce an archive
 * whose code is older than its sources.
 *
 * **It used to write the catalogue beside the code, and ADR-0092 is why it no longer does.** The
 * archive carried every contract the registry serves, base64 and all, so its size was a function of
 * how many contracts existed; a published `toopo` asks the registry instead.
 *
 * **The only thing in this folder that touches a disk**, which is the line `packages/site/build.ts`
 * already draws for the generator and `packages/cli/command.ts` for the installer.
 *
 * The output is not committed: `.gitignore` keeps it out and this sentence is why, rather than leaving
 * the entry to look like an oversight.
 *
 * The compiler is reached at `typescript/lib/tsc.js` and run by this same node, rather than through
 * `node_modules/.bin/tsc`. The shim in `.bin` is three files - a shell script, a `.cmd` and a
 * `.ps1` - and choosing between them is choosing a shell; `tsc.js` is the one entry point that is the
 * same on every platform this repository is developed on.
 *
 * The imports are `.ts` and dynamic on purpose: the hook that translates a `.js` specifier cannot be
 * used before it has been registered.
 */

import '../typescript-imports.ts'

const { spawnSync } = await import('node:child_process')
const { readdirSync, rmSync, statSync } = await import('node:fs')
const { join, relative } = await import('node:path')

const { reachableFrom } = await import('./reachable.ts')

const HERE = import.meta.dirname
const REPOSITORY = join(HERE, '..')
const DIST = join(REPOSITORY, 'dist')
const TSC = join(REPOSITORY, 'node_modules', 'typescript', 'lib', 'tsc.js')

rmSync(DIST, { recursive: true, force: true })

const compiled = spawnSync(process.execPath, [TSC, '-p', join(HERE, 'tsconfig.dist.json')], {
  stdio: 'inherit',
})

if (compiled.status !== 0) {
  process.stderr.write('the archive was not built: the compiler refused what it was given\n')
  process.exit(compiled.status ?? 1)
}

/**
 * Everything the compiler emitted that the entry point cannot reach is removed.
 *
 * `reachable.ts` says why the output is wider than the program and what the six extra modules are.
 * They are dropped rather than shipped because an archive is what somebody receives: a module nothing
 * loads is 44 kB of somebody else's disk and a page of somebody else's `node_modules` to read past.
 */
const every = (folder: string): readonly string[] =>
  readdirSync(folder).flatMap((name) => {
    const full = join(folder, name)

    return statSync(full).isDirectory() ? every(full) : [full]
  })

const reachable = reachableFrom(join(DIST, 'packages', 'cli', 'published.js'))
const dropped = every(DIST).filter((file) => !reachable.has(file))

for (const file of dropped) rmSync(file)

/**
 * On stderr, because this runs as `prepack` and `npm pack --json` answers on stdout.
 *
 * A progress line is not a program's output, and a build script that wrote one to stdout would put it
 * inside the JSON document npm hands to whoever asked for the archive. Measured by doing it: the guard
 * in `archive.test.ts` failed on `Unexpected token 'r', "registry.j"... is not valid JSON`.
 */
process.stderr.write(
  `${reachable.size} modules, ${[...reachable].reduce((total, file) => total + statSync(file).size, 0)} ` +
    `bytes, ${dropped.length} dropped as unreachable` +
    `${dropped.length === 0 ? '' : ` (${dropped.map((file) => relative(DIST, file)).join(', ')})`}\n`,
)
