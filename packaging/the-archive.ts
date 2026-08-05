/**
 * A real archive, really installed, for a guard to run `toopo` out of. Test support, and nothing else
 * imports it.
 *
 * ---------------------------------------------------------------------------
 * Why it packs instead of reading `dist/`
 * ---------------------------------------------------------------------------
 *
 * The whole point of this folder is that the working tree is not the product. `npm pack` applies the
 * `files` whitelist, runs `prepack`, and produces the exact bytes a user would receive - so a module
 * left out of the whitelist, a path that only exists in development, or an import that stops resolving
 * once the file sits under `node_modules` is caught here and nowhere else in this repository. Reading
 * `dist/` directly would measure something adjacent to what ships, which is the mistake
 * `site/playground.test.ts` already refuses by importing the stripped artefact rather than the module
 * it came from.
 *
 * ---------------------------------------------------------------------------
 * What it costs, said rather than discovered
 * ---------------------------------------------------------------------------
 *
 * `npm install` of the archive resolves its one dependency, so this needs a populated npm cache or a
 * network. That is the same thing a user needs and it is why the dependency is worth naming: `toopo`
 * depends on `typescript` because `cli/rewrite.ts` repoints an import by parsing it, and parsing
 * TypeScript with anything other than a TypeScript parser is what `validation/` exists to refuse.
 * Nothing about *installing a feature* reaches a network - the catalogue travels in the archive - and
 * `the-archive-reaches-no-network` is the guard that says so.
 *
 * npm is reached as a JavaScript file run by this same node, never as `npm` on a path. The three shims
 * in `node_modules/.bin` are a shell script, a `.cmd` and a `.ps1`, and choosing between them is
 * choosing a shell - which would put a quoted path between this guard and what it measures.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

import { aProject } from '../cli/temporary-project.js'
import type { TemporaryProject } from '../cli/temporary-project.js'

const REPOSITORY = join(import.meta.dirname, '..')

/**
 * npm as a file this node can run.
 *
 * `npm_execpath` is set by npm itself when a script is running under it, which is how this suite is
 * meant to be started; the path beside `process.execPath` is where every node distribution this
 * repository is developed on keeps the same file. Neither is guessed at: both are checked, and the
 * refusal names the command that sets the first.
 */
const npmCli = (): string => {
  const declared = process.env['npm_execpath']
  if (declared !== undefined && existsSync(declared)) return declared

  const beside = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
  if (existsSync(beside)) return beside

  throw new Error(
    'npm could not be found as a file this node can run, so no archive can be built. Start this ' +
      'suite with `npm run packaging`, which sets npm_execpath.',
  )
}

export type Ran = {
  readonly status: number
  readonly stdout: string
  readonly stderr: string
}

const ran = (command: string, args: readonly string[], cwd: string): Ran => {
  const done = spawnSync(command, [...args], { cwd, encoding: 'utf8' })

  return { status: done.status ?? 1, stdout: done.stdout ?? '', stderr: done.stderr ?? '' }
}

const npm = (args: readonly string[], cwd: string): Ran => ran(process.execPath, [npmCli(), ...args], cwd)

export type InstalledArchive = {
  /** The project the archive was installed into. */
  readonly project: TemporaryProject
  /** Every path the tarball carries, as npm reports them. */
  readonly carries: readonly string[]
  /** The installed package's own folder. */
  readonly installedAt: string
  /** What `bin.toopo` resolves to inside the installed package. */
  readonly entryPoint: string
  /** Run the installed `toopo` in the project. */
  readonly toopo: (...args: readonly string[]) => Ran
  /** Run it again under a loader, and answer which files of the archive node really loaded. */
  readonly loadedBy: (...args: readonly string[]) => readonly string[]
  readonly remove: () => void
}

/**
 * A loader that writes down every file node loads, run before the entry point with `--import`.
 *
 * It is written into the project rather than kept in this repository because it has to sit beside the
 * thing it measures and must not be mistaken for part of the archive. `registerHooks` is the same
 * synchronous hook `typescript-imports.ts` uses, and it is registered before the entry point is
 * evaluated, which is what makes the record complete rather than partial.
 */
const THE_RECORDER = `import { appendFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath } from 'node:url'

const out = process.env.TOOPO_LOADED

registerHooks({
  load(url, context, nextLoad) {
    if (url.startsWith('file:')) appendFileSync(out, \`\${fileURLToPath(url)}\\n\`)

    return nextLoad(url, context)
  },
})
`

class TheArchiveCouldNotBeBuilt extends Error {
  constructor(step: string, done: Ran) {
    super(`${step} failed with status ${done.status}:\n${done.stdout}\n${done.stderr}`)
    this.name = 'TheArchiveCouldNotBeBuilt'
  }
}

/**
 * Build the archive, install it into an empty project, and answer what a guard needs to run it.
 *
 * The project carries a `package.json` because `npm install` needs one, and nothing else: `toopo.json`
 * is written by `toopo init`, which is one of the things being measured. `aProject` is where the
 * folder comes from, so this suite disposes of a temporary project exactly as every other suite in
 * this repository does.
 */
export const anInstalledArchive = (): InstalledArchive => {
  const project = aProject()

  // The tarball is written beside the project rather than into this repository, for the reason
  // `temporary-project.ts` gives about writing anywhere the instrument checks out - and so that one
  // removal disposes of everything this made.
  const packed = npm(['pack', '--json', '--pack-destination', project.root], REPOSITORY)
  if (packed.status !== 0) throw new TheArchiveCouldNotBeBuilt('npm pack', packed)

  const report = JSON.parse(packed.stdout) as readonly {
    readonly filename: string
    readonly files: readonly { readonly path: string }[]
  }[]

  const first = report[0]
  if (first === undefined) throw new TheArchiveCouldNotBeBuilt('npm pack', packed)

  const tarball = join(project.root, first.filename)

  project.write(
    'package.json',
    `${JSON.stringify({ name: 'a-project', version: '1.0.0', type: 'module' })}\n`,
  )

  const installed = npm(['install', tarball, '--no-audit', '--no-fund'], project.root)
  if (installed.status !== 0) throw new TheArchiveCouldNotBeBuilt('npm install', installed)

  const installedAt = join(project.root, 'node_modules', 'toopo')
  const manifest = JSON.parse(readFileSync(join(installedAt, 'package.json'), 'utf8')) as {
    readonly bin: Readonly<Record<string, string>>
  }
  const entryPoint = join(installedAt, manifest.bin['toopo'] ?? '')

  project.write('recorder.mjs', THE_RECORDER)

  const recorder = pathToFileURL(join(project.root, 'recorder.mjs')).href
  const loaded = join(project.root, 'loaded.txt')

  return {
    project,
    carries: first.files.map((file) => file.path),
    installedAt,
    entryPoint,
    toopo: (...args) => ran(process.execPath, [entryPoint, ...args], project.root),

    loadedBy: (...args) => {
      rmSync(loaded, { force: true })

      spawnSync(process.execPath, ['--import', recorder, entryPoint, ...args], {
        cwd: project.root,
        encoding: 'utf8',
        env: { ...process.env, TOOPO_LOADED: loaded },
      })

      if (!existsSync(loaded)) return []

      return [
        ...new Set(
          readFileSync(loaded, 'utf8')
            .split('\n')
            .filter((line) => line !== '')
            .filter((line) => !relative(installedAt, line).startsWith('..'))
            .map((line) => relative(installedAt, line).replaceAll('\\', '/')),
        ),
      ]
    },

    remove: project.remove,
  }
}
