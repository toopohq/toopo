/**
 * The mutation instrument.
 *
 * It exists because a verdict that cannot be replayed is an opinion. Two sessions were spent
 * rebuilding an instrument that should have been a file, and the batteries it produced lived only
 * in a conversation. This folder is the correction: the defects, the command that injects them, and
 * the verdict each one must produce are all committed, so a claim about what a contract catches can
 * be checked instead of trusted.
 *
 * A run is a triple:
 *
 *   arm     - the form of the contract under measurement. Arms are stored as git refs rather than
 *             as copies, so an arm is exactly what some commit says it is and cannot drift into a
 *             hand-edited approximation of itself.
 *   lens    - a setting of the measuring apparatus, not a defect: reading the suite blind to the
 *             failure reason, for instance.
 *   mutant  - the defect injected into the reference implementation.
 *
 * The verdict of a run is the exit status of the contract's own suite: red means the contract
 * caught the defect, green means it did not. Every cell carries the verdict it is expected to
 * produce, and a run that disagrees with its expectation is a failure of the battery, not a new
 * result to write down.
 *
 * Every edit must match exactly once. A mutant whose text no longer matches the reference would
 * otherwise be applied as a no-op and counted as a survivor, which is the single most dangerous
 * failure mode this instrument has: it would report the contract as blind to a defect that was
 * never injected.
 *
 * This folder is not a contract, not an implementation and not a registry test. It is the evidence
 * produced by running them, which is the one thing besides those three that belongs here.
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

export type Verdict = 'killed' | 'killed-by-typecheck' | 'survived' | 'not-applicable'

/**
 * What a cell must produce. `by` names test titles that must be among the failures, which is what
 * makes a guard replayable rather than merely counted: a defect killed by a different test than the
 * one that used to catch it is a silent loss of coverage, and naming the test turns it into a red
 * battery.
 */
export type Expectation = {
  readonly verdict: Verdict
  readonly by?: readonly string[]
}

/**
 * `defect` counts towards the mutation score; `probe` does not. Probes ask questions about the
 * shape of the contract - whether a property can reach the region it claims to guard, whether two
 * exports can drift - and folding them into a score would measure the question rather than the
 * contract.
 */
export type MutantKind = 'defect' | 'probe'

export type Mutant = {
  readonly id: string
  readonly kind: MutantKind
  readonly description: string
  /** Edits per arm id. An arm absent from this record cannot express the defect. */
  readonly arms: Readonly<Record<string, readonly Edit[]>>
  /** Expected verdict per `arm/lens`. Every cell the battery runs must be pinned here. */
  readonly expected: Readonly<Record<string, Expectation>>
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
  readonly name: string
  readonly contractPath: string
  /**
   * The process time zone every run of this battery is measured under. Pinned rather than inherited:
   * `date/add@1` has a defect that is invisible in one zone and obvious in another, so a verdict
   * measured under whatever zone the operator's machine happens to carry is not a verdict anyone
   * else can reproduce.
   */
  readonly timeZone: string
  /**
   * The mutant used to calibrate the instrument before the battery runs. It must be an obvious
   * defect that every arm expresses and every lens catches: an unmutated arm that is green proves
   * the apparatus is not stuck red, and an obvious mutant that is red proves it is not stuck green.
   * Neither half alone is a calibration.
   */
  readonly calibrationMutant: string
  readonly arms: readonly Arm[]
  readonly lenses: readonly Lens[]
  readonly mutants: readonly Mutant[]
}

export type RunResult = {
  readonly mutant: string
  readonly arm: string
  readonly lens: string
  readonly verdict: Verdict
  readonly failedTests: readonly string[]
  readonly expected: Expectation
  readonly agrees: boolean
}

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = join(HERE, '..')
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
 * `core.autocrlf` is true in this repository - measured - so a file git has just checked out carries
 * CRLF while every anchor in a battery is written with LF. Normalising here rather than escaping
 * line endings in the batteries keeps the anchors readable as the source they are quoting.
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

type VitestReport = {
  readonly testResults?: readonly {
    readonly assertionResults?: readonly { readonly status: string; readonly title: string }[]
  }[]
}

const failedTestNames = (): readonly string[] => {
  let report: VitestReport

  try {
    report = JSON.parse(readFileSync(REPORT, 'utf8')) as VitestReport
  } catch {
    // A run that dies before writing a report - a type error, an import failure - is still a kill;
    // it simply has no per-test detail to attribute it to.
    return []
  }

  return (report.testResults ?? []).flatMap((file) =>
    (file.assertionResults ?? []).filter((t) => t.status === 'failed').map((t) => t.title),
  )
}

const runSuite = (
  timeZone: string,
): { readonly green: boolean; readonly failedTests: readonly string[] } => {
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
      { cwd: REPO, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, TZ: timeZone } },
    )

    return { green: true, failedTests: [] }
  } catch {
    return { green: false, failedTests: failedTestNames() }
  }
}

const verdictOf = (green: boolean, failedTests: readonly string[]): Verdict => {
  if (green) return 'survived'

  return failedTests.length === 0 ? 'killed-by-typecheck' : 'killed'
}

const agreesWith = (
  expectation: Expectation,
  verdict: Verdict,
  failedTests: readonly string[],
): boolean => {
  if (expectation.verdict !== verdict) return false

  return (expectation.by ?? []).every((title) => failedTests.includes(title))
}

const cellKey = (arm: Arm, lens: Lens): string => `${arm.id}/${lens.id}`

const expectationFor = (mutant: Mutant, arm: Arm, lens: Lens): Expectation => {
  const pinned = mutant.expected[cellKey(arm, lens)]

  if (pinned === undefined) {
    throw new Error(
      `${mutant.id} declares no expected verdict for ${cellKey(arm, lens)}. An unpinned cell is a ` +
        `verdict nobody has to agree with, which is the state this instrument exists to leave.`,
    )
  }

  return pinned
}

/** Materialise one cell - arm, lens, mutant - and read the suite's verdict on it. */
const measureCell = (
  battery: Battery,
  arm: Arm,
  lens: Lens,
  mutant: Mutant,
): { readonly verdict: Verdict; readonly failedTests: readonly string[] } => {
  const edits = mutant.arms[arm.id]
  if (edits === undefined) return { verdict: 'not-applicable', failedTests: [] }

  restore(battery.contractPath)
  checkoutArm(battery.contractPath, arm.ref)
  applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)
  applyEdits(battery.contractPath, edits, `mutant ${mutant.id} on arm ${arm.id}`)

  const { green, failedTests } = runSuite(battery.timeZone)

  return { verdict: verdictOf(green, failedTests), failedTests }
}

const cellsOf = (battery: Battery): readonly { arm: Arm; lens: Lens }[] =>
  battery.arms.flatMap((arm) =>
    battery.lenses.filter((lens) => lens.arms.includes(arm.id)).map((lens) => ({ arm, lens })),
  )

/**
 * The calibration. An unmutated arm must be green and an obvious defect must be red, on every cell,
 * before any verdict below is worth reading. A lens that reddened the suite on its own would report
 * every mutant as killed, and an apparatus stuck green would report every mutant as survived.
 */
export const calibrate = (battery: Battery): void => {
  assertCleanTree()

  const obvious = battery.mutants.find((m) => m.id === battery.calibrationMutant)
  if (obvious === undefined) {
    throw new Error(`${battery.name}: calibration mutant ${battery.calibrationMutant} is not here`)
  }

  try {
    for (const { arm, lens } of cellsOf(battery)) {
      restore(battery.contractPath)
      checkoutArm(battery.contractPath, arm.ref)
      applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)

      const control = runSuite(battery.timeZone)
      process.stdout.write(
        `calibration ${cellKey(arm, lens).padEnd(20)} control ${control.green ? 'green' : 'RED'}\n`,
      )
      if (!control.green) {
        throw new Error(
          `the unmutated ${cellKey(arm, lens)} is red, so every verdict from this battery would be ` +
            `noise:\n  ${control.failedTests.join('\n  ')}`,
        )
      }

      const injected = measureCell(battery, arm, lens, obvious)
      process.stdout.write(
        `calibration ${cellKey(arm, lens).padEnd(20)} ${obvious.id} ${injected.verdict}\n`,
      )
      if (injected.verdict !== 'killed') {
        throw new Error(
          `the obvious defect ${obvious.id} is not killed on ${cellKey(arm, lens)}, so the ` +
            `apparatus cannot be shown able to see anything at all`,
        )
      }
    }
  } finally {
    restore(battery.contractPath)
    rmSync(REPORT, { force: true })
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
  const cells = cellsOf(battery).filter(
    ({ arm }) => onlyArms === undefined || onlyArms.includes(arm.id),
  )

  try {
    for (const { arm, lens } of cells) {
      for (const mutant of selected) {
        const expected = expectationFor(mutant, arm, lens)
        const { verdict, failedTests } = measureCell(battery, arm, lens, mutant)
        const agrees = agreesWith(expected, verdict, failedTests)

        results.push({
          mutant: mutant.id,
          arm: arm.id,
          lens: lens.id,
          verdict,
          failedTests,
          expected,
          agrees,
        })

        process.stdout.write(
          `${mutant.id.padEnd(6)} ${cellKey(arm, lens).padEnd(20)} ${verdict.padEnd(20)} ` +
            `${agrees ? 'as expected' : 'DISAGREES'}\n`,
        )
      }
    }
  } finally {
    restore(battery.contractPath)
    rmSync(REPORT, { force: true })
  }

  return results
}

export const writeResults = (name: string, results: readonly RunResult[]): void => {
  const out = join(HERE, 'results')
  mkdirSync(out, { recursive: true })
  writeFileSync(join(out, `${name}.json`), `${JSON.stringify(results, null, 2)}\n`)
}
