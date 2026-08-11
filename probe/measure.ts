/**
 * The three questions this maquette exists to answer, run against a registry that is really remote.
 *
 *   node probe/measure.ts
 *
 * Nothing here is a unit. Each measurement prints the command it is, the numbers it took, and the
 * comparison that says whether the remote answer is the local one - so that the trace, and not this
 * folder, is the deliverable.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

import '../typescript-imports.ts'

const { renderContract } = await import('../registry/address.ts')
const { digestOfBytes } = await import('../registry/canonical.ts')
const { LOCKFILE_VERSION } = await import('../registry/implementation-record.ts')
const { frozenArtefact } = await import('../packaging/freeze.ts')
const { localSource } = await import('../cli/local-source.ts')
const { imaginedSource, updatedImaginedSource, sourceWithIndependentCarriers } = await import(
  '../cli/imagined-source.ts'
)
const { prepareInstallation, filesToWrite, lockfileAfter } = await import('../cli/install.ts')
const { prepareUpdate } = await import('../cli/update.ts')
const { commit } = await import('../cli/write.ts')
const { run } = await import('../cli/command.ts')
const { writeConfiguration } = await import('../cli/configuration.ts')
const { aProject } = await import('../cli/temporary-project.ts')
const { servingOverHttp } = await import('./registry-over-http.ts')
const { decidingOverTheNetwork, overWhatIsHeld } = await import('./prefetching-source.ts')

type ServedArtefact = Awaited<ReturnType<typeof frozenArtefact>>
type RegistrySource = ReturnType<typeof imaginedSource>
type InstallOutcome = ReturnType<typeof prepareInstallation>
type Wanted = Parameters<typeof overWhatIsHeld>[1] extends Map<string, infer W> ? W : never
type Lockfile = Parameters<typeof lockfileAfter>[0]

const AT = '2026-08-11T00:00:00.000Z'
const EMPTY: Lockfile = { version: LOCKFILE_VERSION, features: [] }

const out = (text = ''): void => {
  process.stdout.write(`${text}\n`)
}

const heading = (text: string): void => {
  out()
  out(`=== ${text}`)
  out()
}

/** What an install would put on disk, as the only comparison that says two registries agreed. */
const shapeOf = (outcome: InstallOutcome): readonly string[] =>
  'installation' in outcome
    ? filesToWrite(outcome.installation).map(
        (file) => `${file.path} ${digestOfBytes(file.bytes).slice(0, 12)}`,
      )
    : 'faults' in outcome
      ? outcome.faults
      : [`unchanged ${renderContract(outcome.unchanged.contract)}`]

/**
 * Every file of a project with its digest, so that *the decision writes nothing* is measured rather
 * than asserted.
 *
 * The loop replays the decision from nothing on every round, so a decision that wrote would write once
 * per round. `prepareInstallation` and `reconcileProject` read a project and change none of it, and
 * this is the reading that says so.
 */
const theProjectAsItStands = (root: string): readonly string[] => {
  const walk = (folder: string): readonly string[] =>
    readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
      const full = join(folder, entry.name)

      return entry.isDirectory()
        ? walk(full)
        : [`${relative(root, full).replaceAll('\\', '/')} ${digestOfBytes(readFileSync(full)).slice(0, 12)}`]
    })

  return [...walk(root)].sort()
}

const installing = (source: RegistrySource, root: string, contract: string): InstallOutcome =>
  prepareInstallation(source, {
    root,
    configuration: { version: 1, directory: 'src/lib/toopo' },
    lockfile: EMPTY,
    contract,
    implementation: null,
    at: AT,
  })

const withServer = async <T>(
  held: ServedArtefact,
  body: (origin: string, requests: readonly Wanted[]) => Promise<T>,
): Promise<T> => {
  const server = await servingOverHttp(held)
  try {
    return await body(server.origin, server.requests)
  } finally {
    await server.close()
  }
}

// ---------------------------------------------------------------------------
// 1 and 2 - the round trips, on the catalogue and on the graph that has edges
// ---------------------------------------------------------------------------

const anInstallOverTheNetwork = async (
  what: string,
  source: RegistrySource,
  contract: string,
): Promise<void> => {
  const artefact = frozenArtefact(source)
  const project = aProject()

  try {
    await withServer(artefact, async (origin, requests) => {
      const rounds = await decidingOverTheNetwork(origin, (remote) =>
        installing(remote, project.root, contract),
      )

      out(`  ${what}: toopo add ${contract}`)
      out(`    decisions (pure, synchronous, replayed) : ${rounds.decisions}`)
      out(`    round trips (awaits)                    : ${rounds.roundTrips}`)
      out(`    fetched per round trip                  : [${rounds.fetchedPerRoundTrip.join(', ')}]`)
      out(`    HTTP requests the server answered       : ${requests.length}`)
      out(`    distinct answers held at the end        : ${rounds.held.size}`)

      const local = shapeOf(installing(source, project.root, contract))
      const remote = shapeOf(rounds.answer)
      out(`    files the local registry would write    : ${local.length}`)
      out(
        `    same bytes over the network             : ${
          JSON.stringify(local) === JSON.stringify(remote) ? 'yes' : `NO\n${local}\n${remote}`
        }`,
      )

      if ('installation' in rounds.answer) {
        const { installation } = rounds.answer
        out(`    features written                        : ${installation.features.length}`)
        out(
          `    deduplicated (written once, shared)     : ${
            installation.shared.length === 0
              ? 'none'
              : installation.shared
                  .map((file) => `${file.path} also carried by ${file.alsoCarriedBy.join(', ')}`)
                  .join('; ')
          }`,
        )
        out(
          `    imports repointed on the way in         : ${
            installation.writes.filter((file) => file.repointed).map((file) => file.path).join(', ') ||
            'none'
          }`,
        )
      }
    })
  } finally {
    project.remove()
  }
}

// ---------------------------------------------------------------------------
// The whole project re-planned, which is the walk with more than one root
// ---------------------------------------------------------------------------

const anUpdateOverTheNetwork = async (): Promise<void> => {
  const project = aProject()

  try {
    const first = installing(imaginedSource(), project.root, 'number/round')
    if (!('installation' in first)) throw new Error(JSON.stringify(first))

    const lockfile = lockfileAfter(EMPTY, first.installation.features)
    const written = commit(project.root, project.configuration.directory, {
      writes: filesToWrite(first.installation),
      removals: [],
      leaving: null,
      lockfile,
      configuration: project.configuration,
    })
    if ('faults' in written) throw new Error(written.faults.join('\n'))

    const next = updatedImaginedSource()

    await withServer(frozenArtefact(next), async (origin, requests) => {
      const before = theProjectAsItStands(project.root)
      const rounds = await decidingOverTheNetwork(origin, (remote) =>
        prepareUpdate(remote, {
          root: project.root,
          configuration: project.configuration,
          lockfile,
          at: AT,
        }),
      )
      const after = theProjectAsItStands(project.root)

      out('  the imagined graph, one publication later: toopo update')
      out(`    decisions (pure, synchronous, replayed) : ${rounds.decisions}`)
      out(`    round trips (awaits)                    : ${rounds.roundTrips}`)
      out(`    fetched per round trip                  : [${rounds.fetchedPerRoundTrip.join(', ')}]`)
      out(`    HTTP requests the server answered       : ${requests.length}`)
      out(
        `    ms per replay of the decision           : ` +
          `[${rounds.msPerDecision.map((ms) => ms.toFixed(1)).join(', ')}]`,
      )
      out(`    ms in all                               : ${rounds.totalMs.toFixed(1)}`)
      out(
        `    project files before / after the loop   : ${before.length} / ${after.length}, ` +
          `${JSON.stringify(before) === JSON.stringify(after) ? 'byte for byte identical' : 'CHANGED'}`,
      )

      const local = prepareUpdate(next, {
        root: project.root,
        configuration: project.configuration,
        lockfile,
        at: AT,
      })

      const verdicts = (outcome: typeof local): readonly string[] =>
        'reconciliation' in outcome
          ? outcome.reconciliation.features.flatMap((feature) =>
              feature.files.map((file) => `${file.path} ${file.verdict}`),
            )
          : outcome.faults

      out(`    verdicts                                : ${verdicts(rounds.answer).join(', ')}`)
      out(
        `    same verdicts as the local registry     : ${
          JSON.stringify(verdicts(local)) === JSON.stringify(verdicts(rounds.answer)) ? 'yes' : 'NO'
        }`,
      )
    })
  } finally {
    project.remove()
  }
}

/**
 * Two roots that depend on nothing and share one file, which is the shape that says whether the loop
 * batches a frontier or walks it one answer at a time.
 *
 * A round trip fetching two bindings at once is an outer loop around a decision that saw both; a round
 * trip fetching one is a decision that stopped at the first thing it could not answer.
 */
const twoRootsOverTheNetwork = async (): Promise<void> => {
  const source = sourceWithIndependentCarriers()
  const project = aProject()

  try {
    let lockfile = EMPTY
    for (const contract of ['text/left', 'text/right']) {
      const outcome = prepareInstallation(source, {
        root: project.root,
        configuration: project.configuration,
        lockfile,
        contract,
        implementation: null,
        at: AT,
      })
      if (!('installation' in outcome)) throw new Error(JSON.stringify(outcome))

      lockfile = lockfileAfter(lockfile, outcome.installation.features)
      const written = commit(project.root, project.configuration.directory, {
        writes: filesToWrite(outcome.installation),
        removals: [],
        leaving: null,
        lockfile,
        configuration: project.configuration,
      })
      if ('faults' in written) throw new Error(written.faults.join('\n'))
    }

    const held = lockfile

    await withServer(frozenArtefact(source), async (origin, requests) => {
      const rounds = await decidingOverTheNetwork(origin, (remote) =>
        prepareUpdate(remote, {
          root: project.root,
          configuration: project.configuration,
          lockfile: held,
          at: AT,
        }),
      )

      out('  two independent roots sharing one file: toopo update')
      out(
        `    roots in the lockfile                   : ${held.features.filter((feature) => feature.askedFor).length}`,
      )
      out(`    decisions (pure, synchronous, replayed) : ${rounds.decisions}`)
      out(`    round trips (awaits)                    : ${rounds.roundTrips}`)
      out(`    fetched per round trip                  : [${rounds.fetchedPerRoundTrip.join(', ')}]`)
      out(`    HTTP requests the server answered       : ${requests.length}`)
      out(
        `    verdicts                                : ${
          'reconciliation' in rounds.answer
            ? rounds.answer.reconciliation.features
                .flatMap((feature) => feature.files.map((file) => `${file.path} ${file.verdict}`))
                .join(', ')
            : rounds.answer.faults.join(' / ')
        }`,
      )
    })
  } finally {
    project.remove()
  }
}

// ---------------------------------------------------------------------------
// 2b - what a wire adds that no local source has: an answer that is not the answer
// ---------------------------------------------------------------------------

const aCorruptedFile = async (): Promise<void> => {
  const artefact = frozenArtefact(imaginedSource())
  const first = artefact.blobs[0]
  if (first === undefined) throw new Error('the imagined artefact carries no file')

  const bytes = Buffer.from(first.base64, 'base64')
  const flipped = Buffer.concat([Buffer.from('/* moved */\n', 'utf8'), bytes])
  const corrupted: ServedArtefact = {
    ...artefact,
    // The digest is left exactly as it was: this is a registry answering the right address with the
    // wrong bytes, which is the one failure a local map keyed on the digest cannot have.
    blobs: artefact.blobs.map((blob, at) =>
      at === 0 ? { ...blob, base64: flipped.toString('base64') } : blob,
    ),
  }

  const project = aProject()

  try {
    await withServer(corrupted, async (origin) => {
      for (const addressedBy of ['by-the-question', 'by-what-arrived'] as const) {
        const rounds = await decidingOverTheNetwork(
          origin,
          (remote) => installing(remote, project.root, 'number/round'),
          addressedBy,
        )

        out(`  a blob served under the right digest with the wrong bytes, addressed ${addressedBy}:`)
        out(
          '    ' +
            ('faults' in rounds.answer
              ? `refused - ${rounds.answer.faults.join(' / ')}`
              : `INSTALLED, ${shapeOf(rounds.answer).length} files, nothing objected`),
        )
      }
    })
  } finally {
    project.remove()
  }
}

// ---------------------------------------------------------------------------
// The real entry point, in a real project, against the network
// ---------------------------------------------------------------------------

const theRealCommand = async (): Promise<void> => {
  const project = aProject()
  writeConfiguration(project.root, project.configuration)

  try {
    await withServer(frozenArtefact(imaginedSource()), async (origin, requests) => {
      const warm = await decidingOverTheNetwork(origin, (remote) =>
        installing(remote, project.root, 'number/round'),
      )

      const missingDuringTheCommand = new Map<string, Wanted>()
      const argv = process.argv
      const cwd = process.cwd()
      const lines: string[] = []
      const write = process.stdout.write

      process.argv = ['node', 'toopo', 'add', 'number/round']
      process.chdir(project.root)
      process.stdout.write = ((text: string) => {
        lines.push(String(text))

        return true
      }) as typeof process.stdout.write

      try {
        run(() => overWhatIsHeld(warm.held, missingDuringTheCommand))
      } finally {
        process.argv = argv
        process.chdir(cwd)
        process.stdout.write = write
      }

      out('  node cli/toopo.ts add number/round, served over HTTP:')
      out(`    round trips before the command ran      : ${warm.roundTrips}`)
      out(`    HTTP requests in all                    : ${requests.length}`)
      out(`    asked for during the command itself     : ${missingDuringTheCommand.size}`)
      out()
      for (const line of lines.join('').split('\n')) out(`    | ${line}`)

      const installed = project.installed('number/round/round.ts')
      out(`    number/round/round.ts on disk           : ${installed.length} bytes`)
      out(
        `    its import of clamp                     : ${
          installed.split('\n').find((line) => line.includes('clamp')) ?? 'none'
        }`,
      )
    })
  } finally {
    project.remove()
  }
}

heading('1 and 2 - round trips, and deduplication over a wire')
await anInstallOverTheNetwork('the five, which depend on nothing', localSource(), 'string/slugify')
out()
await anInstallOverTheNetwork('the imagined graph, depth 2', imaginedSource(), 'number/round')
out()
await anUpdateOverTheNetwork()
out()
await twoRootsOverTheNetwork()

heading('2b - the check that is a tautology until the client addresses the answer by the question')
await aCorruptedFile()

heading('the real command, in a real project, against the network')
await theRealCommand()
out()
