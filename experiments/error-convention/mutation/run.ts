/**
 * Experiment material. This folder exists only on `experiment/error-convention-round-3` and
 * disappears with it; nothing here is a contract, an implementation or a registry test.
 *
 * Carried over from round 2 unchanged, deliberately: an instrument edited between two rounds would
 * make the columns it produced in each of them incomparable, which is the whole point of measuring
 * the third form against the two already measured.
 *
 * The mutation instrument. A run is a triple:
 *
 *   arm     - which error convention the contract is written in. Arms are stored as git refs
 *             rather than as copies, so an arm is exactly what some commit says it is and cannot
 *             drift into a hand-edited approximation of itself.
 *   lens    - a setting of the measuring apparatus, not a defect: reading the suite blind to the
 *             failure reason, or reproducing the faulty property translation of round 1.
 *   mutant  - the defect injected into the reference implementation.
 *
 * The verdict of a run is the exit status of the contract's own suite: red means the contract
 * caught the defect, green means it did not.
 *
 * Every edit must match exactly once. A mutant whose text no longer matches the reference would
 * otherwise be applied as a no-op and counted as a survivor, which is the single most dangerous
 * failure mode this instrument has: it would report the contract as blind to a defect that was
 * never injected.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export type Edit = {
  /** Path relative to the contract folder, e.g. `reference.ts`. */
  readonly file: string
  readonly find: string
  readonly replace: string
}

export type Mutant = {
  readonly id: string
  readonly description: string
  /** Edits per arm id. An arm absent from this record cannot express the defect; it is reported. */
  readonly arms: Readonly<Record<string, readonly Edit[]>>
}

export type Arm = {
  readonly id: string
  /** The git ref holding this arm of the contract. */
  readonly ref: string
  readonly convention: string
}

export type Lens = {
  readonly id: string
  readonly description: string
  /** Arms this lens applies to. */
  readonly arms: readonly string[]
  readonly edits: readonly Edit[]
}

export type Battery = {
  readonly contractPath: string
  readonly arms: readonly Arm[]
  readonly lenses: readonly Lens[]
  readonly mutants: readonly Mutant[]
}

/**
 * `killed-by-typecheck` is separated from `killed` on purpose. A mutant that does not compile reddens
 * the suite without any guard having observed anything, and counting it as a kill would credit the
 * contract with a detection the compiler made - or, worse, hide a mutant that was written wrongly.
 * Measured: two cache mutants first landed here because an unannotated `const result` widened a
 * reason literal to `string`, and both looked like the union arm catching a defect that the null arm
 * missed.
 */
export type Verdict = 'killed' | 'killed-by-typecheck' | 'survived' | 'not-applicable'

export type RunResult = {
  readonly mutant: string
  readonly arm: string
  readonly lens: string
  readonly verdict: Verdict
  readonly failedTests: readonly string[]
}

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..', '..', '..')
const REPORT = join(HERE, '.vitest-report.json')

const git = (...args: readonly string[]): string =>
  execFileSync('git', args, { cwd: REPO, encoding: 'utf8' })

const assertCleanTree = (): void => {
  const dirty = git('status', '--porcelain', '--untracked-files=no').trim()
  if (dirty !== '') {
    throw new Error(
      `the working tree carries uncommitted changes, so a restore would destroy them:\n${dirty}`,
    )
  }
}

/** Materialise an arm into the contract folder, from the commit that holds it. */
const checkoutArm = (contractPath: string, ref: string): void => {
  git('checkout', ref, '--', contractPath)
}

const restore = (contractPath: string): void => {
  git('checkout', 'HEAD', '--', contractPath)
}

/**
 * `core.autocrlf` is true in this repository, so a file that git has just checked out carries CRLF
 * while every anchor below is written with LF. Normalising here rather than escaping line endings in
 * the battery keeps the anchors readable as the source they are quoting.
 */
const applyEdits = (contractPath: string, edits: readonly Edit[], label: string): void => {
  for (const edit of edits) {
    const path = join(REPO, contractPath, edit.file)
    const before = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
    const occurrences = before.split(edit.find).length - 1

    if (occurrences !== 1) {
      throw new Error(
        `${label}: the anchor below matches ${occurrences} times in ${edit.file}, and must match ` +
          `exactly once. An edit that does not apply would be measured as a defect the contract ` +
          `survived, when nothing was injected at all.\n---\n${edit.find}\n---`,
      )
    }

    writeFileSync(path, before.replace(edit.find, edit.replace))
  }
}

const failedTestNames = (): readonly string[] => {
  let report: {
    testResults?: readonly { assertionResults?: readonly { status: string; title: string }[] }[]
  }

  try {
    report = JSON.parse(readFileSync(REPORT, 'utf8'))
  } catch {
    // A run that dies before writing a report - a type error, an import failure - is still a kill;
    // it simply has no per-test detail to attribute it to.
    return ['<suite did not report>']
  }

  return (report.testResults ?? []).flatMap((file) =>
    (file.assertionResults ?? []).filter((t) => t.status === 'failed').map((t) => t.title),
  )
}

const runSuite = (): { readonly green: boolean; readonly failedTests: readonly string[] } => {
  rmSync(REPORT, { force: true })

  try {
    // The vitest entry point is invoked directly rather than through npx, so that no shell parses
    // this command line and the report path cannot be reinterpreted by one.
    execFileSync(
      process.execPath,
      [
        join(REPO, 'node_modules', 'vitest', 'vitest.mjs'),
        'run',
        '--typecheck',
        '--reporter=json',
        `--outputFile=${REPORT}`,
      ],
      { cwd: REPO, encoding: 'utf8', stdio: 'pipe' },
    )

    return { green: true, failedTests: [] }
  } catch {
    return { green: false, failedTests: failedTestNames() }
  }
}

export const runBattery = (
  battery: Battery,
  only?: readonly string[],
  onlyArms?: readonly string[],
): readonly RunResult[] => {
  assertCleanTree()

  const results: RunResult[] = []
  const selected = battery.mutants.filter((m) => only === undefined || only.includes(m.id))
  const arms = battery.arms.filter((a) => onlyArms === undefined || onlyArms.includes(a.id))

  try {
    for (const arm of arms) {
      const lenses = battery.lenses.filter((l) => l.arms.includes(arm.id))

      for (const lens of lenses) {
        for (const mutant of selected) {
          const edits = mutant.arms[arm.id]

          if (edits === undefined) {
            results.push({
              mutant: mutant.id,
              arm: arm.id,
              lens: lens.id,
              verdict: 'not-applicable',
              failedTests: [],
            })
            continue
          }

          restore(battery.contractPath)
          checkoutArm(battery.contractPath, arm.ref)
          applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)
          applyEdits(battery.contractPath, edits, `mutant ${mutant.id} on arm ${arm.id}`)

          const { green, failedTests } = runSuite()
          const verdict: Verdict = green
            ? 'survived'
            : failedTests.length === 0
              ? 'killed-by-typecheck'
              : 'killed'

          results.push({ mutant: mutant.id, arm: arm.id, lens: lens.id, verdict, failedTests })

          process.stdout.write(
            `${mutant.id.padEnd(6)} ${arm.id.padEnd(4)} ${lens.id.padEnd(14)} ${verdict}\n`,
          )
        }
      }
    }
  } finally {
    restore(battery.contractPath)
    rmSync(REPORT, { force: true })
  }

  return results
}

/** A control run: the arm with no mutant at all must be green, or every verdict above is noise. */
export const runControls = (battery: Battery): void => {
  assertCleanTree()

  try {
    for (const arm of battery.arms) {
      for (const lens of battery.lenses.filter((l) => l.arms.includes(arm.id))) {
        restore(battery.contractPath)
        checkoutArm(battery.contractPath, arm.ref)
        applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)

        const { green, failedTests } = runSuite()

        process.stdout.write(
          `control ${arm.id.padEnd(4)} ${lens.id.padEnd(14)} ${green ? 'green' : 'RED'}\n`,
        )
        if (!green) process.stdout.write(`  ${failedTests.join('\n  ')}\n`)
      }
    }
  } finally {
    restore(battery.contractPath)
    rmSync(REPORT, { force: true })
  }
}

export const writeResults = (name: string, results: readonly RunResult[]): void => {
  const out = join(HERE, 'results')
  mkdirSync(out, { recursive: true })
  writeFileSync(join(out, `${name}.json`), `${JSON.stringify(results, null, 2)}\n`)
}
