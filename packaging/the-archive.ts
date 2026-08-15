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
 * depends on `typescript` because `packages/cli/rewrite.ts` repoints an import by parsing it, and parsing
 * TypeScript with anything other than a TypeScript parser is what `packages/validation/` exists to refuse.
 * Nothing about *installing a feature* reaches a network - the catalogue travels in the archive - and
 * `the-archive-reaches-no-network` is the guard that says so.
 *
 * npm is reached as a JavaScript file run by this same node, never as `npm` on a path. The three shims
 * in `node_modules/.bin` are a shell script, a `.cmd` and a `.ps1`, and choosing between them is
 * choosing a shell - which would put a quoted path between this guard and what it measures.
 *
 * ---------------------------------------------------------------------------
 * npm here means npm, and this is the file where somebody would harmonise it away
 * ---------------------------------------------------------------------------
 *
 * This repository installs with pnpm. A user installs `toopo` with npm. **The repository changed
 * package manager; the product did not change consumer**, so a guard that packed and installed with
 * whatever the developer happens to run would measure the developer's life instead of the user's -
 * every figure in this folder moved onto a different product, with nothing anywhere to say so.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

import { aProject } from '../packages/cli/temporary-project.js'
import type { TemporaryProject } from '../packages/cli/temporary-project.js'

const REPOSITORY = join(import.meta.dirname, '..')

/** npm's own entry point, which is what tells it apart from whatever else set `npm_execpath`. */
const NPM_CLI = 'npm-cli.js'

/**
 * npm as a file this node can run.
 *
 * `npm_execpath` names **whichever package manager started the script**, and not npm. Measured:
 *
 *     npm run packaging    ->  ...\node_modules\npm\bin\npm-cli.js
 *     pnpm run packaging   ->  ...\node_modules\pnpm\bin\pnpm.cjs
 *
 * Taken as it stood, `pnpm run packaging` ran `pnpm pack --json`, which writes a progress line where
 * npm writes a JSON array: `SyntaxError: Unexpected token '>', "\n> toopo@0."... is not valid JSON`,
 * with the seven guards behind that `beforeAll` reported as skipped. **That it was loud is luck
 * rather than design** - a manager whose `--json` happened to parse would have left this folder green
 * and measuring something else, which is why the name is checked and not the exit status.
 *
 * So the variable is trusted only when it names npm, and the path beside `process.execPath` - where
 * every node distribution this repository is developed on keeps the same file - is what answers
 * otherwise. Neither is guessed at: both are checked, and the refusal says what is missing rather
 * than naming a command that no longer installs this repository.
 */
const npmCli = (): string => {
  const declared = process.env['npm_execpath']
  if (declared !== undefined && basename(declared) === NPM_CLI && existsSync(declared)) {
    return declared
  }

  const beside = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', NPM_CLI)
  if (existsSync(beside)) return beside

  throw new Error(
    'npm could not be found as a file this node can run, so no archive can be built. This suite ' +
      'packs and installs with npm because that is what a user of `toopo` runs, whatever this ' +
      'repository is developed with.',
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
  /**
   * The same tarball installed into a second, untouched project.
   *
   * It exists because the guards above share one project and the first of them runs `toopo init`, so
   * *a project that was never configured* is a state no guard could reach once any other had run. The
   * **tarball** is reused rather than packed again: what is being measured a second time is an install
   * into an empty folder, not npm's determinism.
   */
  readonly intoAFreshProject: () => InstalledArchive
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
 * Install a tarball that already exists into a new, empty project.
 *
 * The project carries a `package.json` because `npm install` needs one, and nothing else: `toopo.json`
 * is written by `toopo init` or by `toopo add`, both of which are things being measured. `aProject` is
 * where the folder comes from, so this suite disposes of a temporary project exactly as every other
 * suite in this repository does.
 */
const installedFrom = (tarball: string, carries: readonly string[]): InstalledArchive => {
  const project = aProject()

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
    carries,
    installedAt,
    entryPoint,
    intoAFreshProject: () => installedFrom(tarball, carries),
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

/**
 * Build the archive and install it, which is what every guard in this folder starts from.
 *
 * The tarball gets a folder of its own rather than living inside the project it is installed into, so
 * that a second project can be installed from the same bytes - and so that neither project has
 * anything in it that a user's would not. It is written outside this repository for the reason
 * `temporary-project.ts` gives about writing anywhere the instrument checks out.
 */
export const anInstalledArchive = (): InstalledArchive => {
  const held = aProject()
  const packed = npm(['pack', '--json', '--pack-destination', held.root], REPOSITORY)
  if (packed.status !== 0) throw new TheArchiveCouldNotBeBuilt('npm pack', packed)

  const report = JSON.parse(packed.stdout) as readonly {
    readonly filename: string
    readonly files: readonly { readonly path: string }[]
  }[]

  const first = report[0]
  if (first === undefined) throw new TheArchiveCouldNotBeBuilt('npm pack', packed)

  const archive = installedFrom(
    join(held.root, first.filename),
    first.files.map((file) => file.path),
  )

  return {
    ...archive,
    remove: () => {
      archive.remove()
      held.remove()
    },
  }
}
