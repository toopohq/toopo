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
 * Three failures of the apparatus are dangerous in the same way - each produces a cell that reads
 * exactly like a result - and each has a guard.
 *
 * Every edit must match exactly once. A mutant whose text no longer matches the reference would
 * otherwise be applied as a no-op and counted as a survivor: the contract reported blind to a defect
 * that was never injected.
 *
 * Every cell must collect what its control collected. A cell that reports fewer tests than the
 * unmutated arm did has measured something other than this contract, and it reddens, so it would be
 * counted as a kill. That is not hypothetical: measured on vitest 4.1.10, naming the json reporter
 * alone under `--typecheck` collects 28 assertions of the 467 this repository has, sixteen of its
 * twenty-one files reporting nothing at all.
 *
 * Every control must collect what the repository says it has. The guard above compares a cell
 * against the control of its own cell, so it cannot see a door that is open for both - and measured,
 * such a door leaves the suite *green*, which is what makes it invisible to everything else here.
 * `census.ts` is the anchor that check never had, and carries the measurement.
 *
 * This folder is not a contract, not an implementation and not a registry test. It is the evidence
 * produced by running them, which is the one thing besides those three that belongs here.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { SuiteCensus } from './census.ts'
import { censusFaults, censusFor } from './census.ts'

export type Edit = {
  /** Path relative to the contract folder, e.g. `reference.ts`. */
  readonly file: string
  readonly find: string
  readonly replace: string
}

export type Verdict = 'killed' | 'killed-by-typecheck' | 'survived' | 'not-applicable'

/**
 * What a cell must produce. `by` names guard identifiers that must be among the reddened, which is
 * what makes a guard replayable rather than merely counted: a defect killed by a different guard
 * than the one that used to catch it is a silent loss of coverage, and naming the guard turns it
 * into a red battery.
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

/**
 * Guards no mutant of this battery reddens, named and explained.
 *
 * "Cannot be reached" and "nothing reaches it yet" look identical from the outside and are not the
 * same thing at all, so a battery declares which of the two each silent guard is, and
 * `attribution.ts` refuses a silence nobody accounts for. It also refuses a declaration a mutant
 * contradicts: a guard listed here that reddens means the list is stale, which has to be as loud as
 * anything else this instrument pins.
 */
export type SilentGuards = {
  /** Whole top-level `describe` blocks. */
  readonly suites?: readonly string[]
  /** Individual guards, named by identifier, for a block that is only partly silent. */
  readonly guards?: readonly string[]
  /**
   * The lenses this declaration applies to; absent means every lens. A lens that blinds part of the
   * suite removes a guard's sight on its column and on no other, so a silence that belongs to the
   * apparatus rather than to the contract has to be declared where it happens - and stay a
   * disagreement everywhere else.
   */
  readonly lenses?: readonly string[]
  readonly reason: string
}

/**
 * Two kinds of guard go silent, and they do not ask for the same thing.
 *
 * A guard that *claims detection* - a property, a type assertion - exists to fail on a defect. Never
 * having been red, it is decorative until a mutant reaches it, and the project rule about that has no
 * nuance. The region has to be probed.
 *
 * A guard that *documents a decision* - a named edge case of block 4.4 - has a first job that is
 * documentary: it publishes what the contract answers and why. A case no mutant violates is not
 * decorative, and deleting it would delete a published decision; what its silence says is that the
 * battery does not reach its region. The region should still be probed, and the case stands either
 * way.
 */
export type UnprobedRegion = SilentGuards & {
  readonly nature: 'claims detection' | 'documents a decision'
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
   * The vitest configuration a run of this battery collects under, relative to the repository root.
   * Absent means the repository's own, which collects the contracts and nothing else.
   *
   * It exists for the instrument's own fixture and for nothing else. A toy shaped like a contract has
   * to be executable to be useful and must not be collected by `npm test`, where it would appear in
   * the contracts' output as though it were one of them and would enter every cell of every contract
   * battery. Naming a configuration here is what lets `vitest.config.ts` keep saying "the contracts'
   * own suite, and nothing else" and mean it.
   */
  readonly vitestConfig?: string
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
  /**
   * Guards this battery cannot redden by construction. It injects into `reference.ts`, so a guard
   * over the contract's own declarations, or over the runtime, is out of its reach whatever it does.
   * Those guards are not decorative and not gaps; they police something this instrument does not
   * touch.
   */
  readonly unreachableGuards: readonly SilentGuards[]
  /**
   * Regions of the contract this battery does not probe: a mutant could redden these guards, and no
   * mutant here does.
   *
   * The name is the point. The same list called "unwitnessed guards" reads as an indictment of the
   * guards and invites deleting them; it is a measurement of the *battery*, and what it asks for is
   * mutants. `array/group-by@1` carries eight signature defects that redden its block 4.2 guards, and
   * the other two contracts carry none - so those guards are not weak, they are unprobed.
   */
  readonly unprobedRegions: readonly UnprobedRegion[]
}

export type RunResult = {
  readonly mutant: string
  readonly arm: string
  readonly lens: string
  readonly verdict: Verdict
  readonly failedGuards: readonly string[]
  readonly expected: Expectation
  readonly agrees: boolean
}

/**
 * How a guard is addressed: a name, unique within its contract, frozen with the contract's major -
 * the discipline block 4.4 already applies to a case, applied to the guard that asserts it.
 *
 * A guard needs two different things and they are not the same object. It needs an address, which a
 * battery pins, an attribution cites and a validation report will one day put in front of a
 * submitter; and it needs a sentence, for whoever reads the runner's output. A title that is only a
 * sentence makes every reword a broken pin, and a title rendered from the contract's own data makes
 * a specification mutant rename the guard it reddens.
 *
 * So the title carries both: the identifier, then ` :: `, then the sentence. A guard whose
 * identifier says everything carries no sentence and no separator, which is what every case of block
 * 4.4 already looked like before this rule existed.
 *
 * ` :: ` cannot occur inside an identifier, because an identifier has no spaces - so the split
 * cannot be wrong. It is ASCII rather than an em dash, which reads better and would have been the
 * first non-ASCII code point in any title in the catalogue: measured, none of the 467 guards carries
 * one, and `number/parse@1` is where the cost of a stray non-ASCII character in a source file was
 * paid once already.
 */
const GUARD_SEPARATOR = ' :: '

/** Kebab-case, exactly as a case of block 4.4 - the same shape for the same reason. */
const GUARD_IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const guardIdOf = (title: string): string => {
  const at = title.indexOf(GUARD_SEPARATOR)

  return at === -1 ? title : title.slice(0, at)
}

/** A guard as the report identifies it: its address, its title, the block it sits in, and its file. */
export type GuardIdentity = {
  readonly id: string
  readonly title: string
  readonly suite: string
  readonly file: string
}

/**
 * What calibration establishes and every later run of the battery is measured against.
 *
 * Both figures are per cell rather than per battery because an arm is a git ref: two arms of the same
 * contract may legitimately name a different number of cases, and a figure shared between them would
 * either be wrong for one or too loose for both.
 *
 * `guardsPerCell` holds only the guards of the contract under measurement. The run executes the whole
 * repository suite - which is what makes the count check possible - but a guard belonging to another
 * contract cannot be reddened by a defect injected into this one, so attributing it here would drown
 * the answer in three hundred irrelevant silences.
 */
export type Calibration = {
  readonly testsPerCell: Readonly<Record<string, number>>
  readonly guardsPerCell: Readonly<Record<string, readonly GuardIdentity[]>>
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
 * The signals that mean "this run is over" and can be caught. `SIGKILL` is not among them and cannot
 * be: it is delivered to the kernel, not to the process, and so is Windows' `TerminateProcess`.
 */
const INTERRUPTIONS = ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'] as const

/**
 * Put the tree back and drop the report. Everything it does is synchronous, because a signal handler
 * that yielded would be racing the exit it is about to cause.
 *
 * Exported so that the meta-suite can run it against a deliberately mutated fixture. What the
 * instrument does when it is interrupted is a behaviour, and a behaviour nothing exercises is the
 * decorative guard this folder exists to refuse.
 */
export const restoreAfterAnInterruption = (contractPath: string): void => {
  restore(contractPath)
  rmSync(REPORT, { force: true })
}

/**
 * Restore the tree if the run is interrupted, and hand the interruption on.
 *
 * **The hole this closes, and how narrow and how dangerous it is.** A battery materialises a mutant
 * into the working tree and puts it back in a `finally`. A `finally` does not run when the process is
 * signalled, so an operator who interrupts a run leaves a defect sitting in the tree. If that mutant
 * is one the contract *survives* - and a surviving mutant is by definition one no guard reddens - then
 * `npm test` is green, nothing in the repository protests, and the defect is committable. That is the
 * exact path by which a defect would enter the catalogue in silence, and it is the only one this
 * repository has that nothing else covers: the next battery run is already refused by
 * `assertCleanTree`, so the instrument protects itself and only the suite is fooled.
 *
 * **The signal is re-raised rather than swallowed**, after this listener has removed itself, so the
 * process still dies of what it was asked to die of. Exiting zero here would tell a shell script that
 * an interrupted measurement had completed.
 *
 * **What this does not close, measured on this platform rather than assumed.** On Windows a signal
 * sent programmatically to a child - `child.kill('SIGINT')`, `child.kill('SIGTERM')` - goes through
 * `TerminateProcess`, and no handler runs: measured, three signals, zero handlers reached. What Node
 * does deliver there is a real console Ctrl+C, which is the interruption an operator actually
 * performs. On POSIX every signal above is delivered. Nowhere is `SIGKILL` catchable, and neither is
 * a machine losing power - so a tree left dirty by a hard kill remains possible and remains, for a
 * surviving mutant, silent.
 */
export const restoringOnSignal = (contractPath: string): (() => void) => {
  const installed = INTERRUPTIONS.map((signal) => {
    const handler = (): void => {
      restoreAfterAnInterruption(contractPath)
      process.removeListener(signal, handler)
      process.kill(process.pid, signal)
    }

    process.on(signal, handler)

    return { signal, handler }
  })

  return () => {
    for (const { signal, handler } of installed) process.removeListener(signal, handler)
  }
}

/**
 * Anchors are written with LF, and what git checks out is whatever the reader's configuration asks
 * for. `.gitattributes` pins `* text=auto eol=lf` here, so on this repository the normalisation below
 * is a no-op today; it stays because an anchor must match the source it quotes under any git
 * configuration, and `core.autocrlf` is still true in this checkout.
 *
 * An earlier version of this comment said a checked-out file carries CRLF. That was measured before
 * `.gitattributes` existed and stopped being true when it was added.
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

type Assertion = {
  readonly status: string
  readonly title: string
  readonly ancestorTitles?: readonly string[]
}

type ReportedFile = {
  readonly name?: string
  readonly assertionResults?: readonly Assertion[]
}

type VitestReport = { readonly testResults?: readonly ReportedFile[] }

type SuiteRun = {
  readonly green: boolean
  readonly failedGuards: readonly string[]
  /**
   * Tests the run reported, or `null` when it died before writing a report at all - a type error or
   * an import failure. That is still a kill; it simply has no per-test detail to attribute it to.
   */
  readonly testsSeen: number | null
  readonly guards: readonly GuardIdentity[]
}

const reportedFiles = (): readonly ReportedFile[] | null => {
  try {
    return (JSON.parse(readFileSync(REPORT, 'utf8')) as VitestReport).testResults ?? []
  } catch {
    return null
  }
}

/** Reported paths are absolute and platform-shaped; the census and the attribution both want neither. */
const REPO_PREFIX = `${REPO.replaceAll('\\', '/')}/`

const relative = (name: string): string => name.replaceAll('\\', '/').replace(REPO_PREFIX, '')

const guardsIn = (files: readonly ReportedFile[]): readonly GuardIdentity[] =>
  files.flatMap((file) =>
    (file.assertionResults ?? []).map((assertion) => ({
      id: guardIdOf(assertion.title),
      title: assertion.title,
      suite: assertion.ancestorTitles?.[0] ?? '',
      file: relative(file.name ?? ''),
    })),
  )

const runSuite = (battery: Battery): SuiteRun => {
  rmSync(REPORT, { force: true })

  let green: boolean
  try {
    // The vitest entry point is invoked directly rather than through npx, so that no shell parses
    // this command line and the report path cannot be reinterpreted by one.
    //
    // `--reporter=default` is not decoration and must not be dropped. Measured on vitest 4.1.10:
    // with the json reporter as the only reporter, `--typecheck` makes all six runtime test files
    // fail to collect with "Cannot read properties of undefined (reading 'config')", and the run
    // reports 9 tests instead of 215. Naming the default reporter as well collects all 215. A
    // truncated run reddens, so under the old command line every cell of every battery read as a
    // kill - which is why the count below is now checked rather than trusted.
    execFileSync(
      process.execPath,
      [
        join(REPO, 'node_modules', 'vitest', 'vitest.mjs'),
        'run',
        '--typecheck',
        '--reporter=default',
        '--reporter=json',
        `--outputFile.json=${REPORT}`,
        ...(battery.vitestConfig === undefined ? [] : ['--config', battery.vitestConfig]),
      ],
      { cwd: REPO, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, TZ: battery.timeZone } },
    )
    green = true
  } catch {
    green = false
  }

  const files = reportedFiles()
  if (files === null) return { green, failedGuards: [], testsSeen: null, guards: [] }

  const assertions = files.flatMap((file) => file.assertionResults ?? [])

  return {
    green,
    failedGuards: assertions.filter((t) => t.status === 'failed').map((t) => guardIdOf(t.title)),
    testsSeen: assertions.length,
    guards: guardsIn(files),
  }
}

const verdictOf = (green: boolean, failedGuards: readonly string[]): Verdict => {
  if (green) return 'survived'

  return failedGuards.length === 0 ? 'killed-by-typecheck' : 'killed'
}

const agreesWith = (
  expectation: Expectation,
  verdict: Verdict,
  failedGuards: readonly string[],
): boolean => {
  if (expectation.verdict !== verdict) return false

  return (expectation.by ?? []).every((id) => failedGuards.includes(id))
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

/**
 * A run that wrote a report but collected fewer tests than the unmutated arm did has not measured
 * this contract, and its red is not a verdict. This is the same failure as an edit that does not
 * apply, arriving from the other side: there, nothing was injected and the cell read as a survivor;
 * here, most of the suite never ran and the cell reads as a kill. Both have to be louder than a
 * result, because neither looks any different from one.
 *
 * **What it cannot see, and what does.** The expectation is the control of this same cell, so a door
 * open for the control as well as for the mutant leaves this guard agreeing with itself.
 * `assertTheCensusHolds` is what anchors the control to something outside the run - and that
 * separation is `GUARD_PERTURBATION_RULE`: this one perturbs a derived object, so it needs the
 * claim pinned somewhere else.
 */
const assertWholeSuiteRan = (label: string, run: SuiteRun, expectedTests: number): void => {
  if (run.testsSeen === null || run.testsSeen === expectedTests) return

  throw new Error(
    `${label}: the suite reported ${run.testsSeen} tests where the unmutated arm reported ` +
      `${expectedTests}. Part of the suite did not run, so this cell measured something other than ` +
      `the contract and its verdict would be indistinguishable from a real one.`,
  )
}

/** Materialise one cell - arm, lens, mutant - and read the suite's verdict on it. */
const measureCell = (
  battery: Battery,
  arm: Arm,
  lens: Lens,
  mutant: Mutant,
  expectedTests: number,
): { readonly verdict: Verdict; readonly failedGuards: readonly string[] } => {
  const edits = mutant.arms[arm.id]
  if (edits === undefined) return { verdict: 'not-applicable', failedGuards: [] }

  restore(battery.contractPath)
  checkoutArm(battery.contractPath, arm.ref)
  applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)
  applyEdits(battery.contractPath, edits, `mutant ${mutant.id} on arm ${arm.id}`)

  const run = runSuite(battery)
  assertWholeSuiteRan(`${mutant.id} on ${cellKey(arm, lens)}`, run, expectedTests)

  return { verdict: verdictOf(run.green, run.failedGuards), failedGuards: run.failedGuards }
}

/**
 * A guard with no well-formed identifier, and two guards of one contract answering to one.
 *
 * Both halves in one refusal, because they are one question - whether these strings can be used as
 * addresses - and a failure has to say which half gave way. It is the same pair
 * `expectEveryCaseIsAddressed` asks of block 4.4, asked of the guards instead of the cases.
 *
 * Attribution addresses a guard by its identifier and by nothing else, so two guards carrying one
 * are read as reddening each other. That is not hypothetical: measured on `array/group-by@1`, where
 * `language.test.ts` reused the titles block 4.4 had given its cases and made twenty-four guards
 * claim defects they cannot see.
 *
 * The scope is the contract under measurement, which is the scope that can break: a battery injects
 * into one contract folder, so two contracts may legitimately choose the same identifier and the
 * pair `(contract, identifier)` is what the registry will address a guard by.
 *
 * **What this does not cover, said out loud.** `npm test` will not see a duplicate. A guard cannot
 * enumerate the tests vitest collected, so the refusal has to live where the identities are already
 * gathered - here, once per cell, before any verdict is worth reading. A contributor who writes a
 * duplicate learns it from the first battery they run, not from the suite.
 */
const assertGuardsAreAddressed = (label: string, guards: readonly GuardIdentity[]): void => {
  const ids = guards.map((guard) => guard.id)
  const malformed = guards.filter((guard) => !GUARD_IDENTIFIER.test(guard.id))
  const duplicated = [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))]

  if (malformed.length === 0 && duplicated.length === 0) return

  const where = (id: string): string =>
    guards
      .filter((guard) => guard.id === id)
      .map((guard) => `      ${guard.file} > ${guard.suite}`)
      .join('\n')

  throw new Error(
    `${label}: this contract's guards cannot all be used as addresses.\n` +
      (malformed.length === 0
        ? ''
        : `  ${malformed.length} guard(s) carry no kebab-case identifier before ` +
          `"${GUARD_SEPARATOR.trim()}":\n` +
          malformed.map((guard) => `    ${JSON.stringify(guard.title)}`).join('\n') +
          '\n') +
      (duplicated.length === 0
        ? ''
        : `  ${duplicated.length} identifier(s) address more than one guard, so attribution would ` +
          `read each of them as reddening the others:\n` +
          duplicated.map((id) => `    ${id}\n${where(id)}`).join('\n')),
  )
}

/**
 * The run collected the suite the repository says it has - and not the suite the run itself says.
 *
 * This is the anchor `assertWholeSuiteRan` never had. That guard compares a cell against the control
 * of its own cell, so a door open for both leaves it agreeing with itself: measured, narrowing the
 * collection glob by one character drops a whole contract, the suite reports `success: true` with 347
 * guards instead of 467, and every cell then matches 347. `census.ts` carries the measurement, the
 * two other doors, and the reason the number is redeclared rather than derived.
 *
 * It runs before the control is even read for redness, because a door open during calibration must be
 * refused before a single verdict exists - and because the refusal it produces says what happened,
 * where a red control with no failed guard says only that something did.
 */
const assertTheCensusHolds = (label: string, run: SuiteRun, census: SuiteCensus): void => {
  const collected: Record<string, number> = {}
  for (const guard of run.guards) collected[guard.file] = (collected[guard.file] ?? 0) + 1

  const faults = censusFaults(collected, census)
  if (faults.length === 0) return

  throw new Error(
    `${label}: this run did not collect the suite this repository declares.\n${faults.join('\n')}\n` +
      `  A run that collects a fraction of the suite produces verdicts that look exactly like ` +
      `verdicts. If a guard was deliberately added or removed, update mutation/census.ts; if not, ` +
      `something about the collection is wrong and no measurement below it means anything.`,
  )
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
export const calibrate = (battery: Battery): Calibration => {
  assertCleanTree()

  const obvious = battery.mutants.find((m) => m.id === battery.calibrationMutant)
  if (obvious === undefined) {
    throw new Error(`${battery.name}: calibration mutant ${battery.calibrationMutant} is not here`)
  }

  const testsPerCell: Record<string, number> = {}
  const guardsPerCell: Record<string, readonly GuardIdentity[]> = {}
  const census = censusFor(battery.vitestConfig)
  const stopListening = restoringOnSignal(battery.contractPath)

  try {
    for (const { arm, lens } of cellsOf(battery)) {
      restore(battery.contractPath)
      checkoutArm(battery.contractPath, arm.ref)
      applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)

      const control = runSuite(battery)
      process.stdout.write(
        `calibration ${cellKey(arm, lens).padEnd(20)} control ${control.green ? 'green' : 'RED'} ` +
          `(${control.testsSeen ?? 'no'} tests)\n`,
      )
      assertTheCensusHolds(cellKey(arm, lens), control, census)
      if (!control.green) {
        throw new Error(
          `the unmutated ${cellKey(arm, lens)} is red, so every verdict from this battery would be ` +
            `noise:\n  ${control.failedGuards.join('\n  ')}`,
        )
      }
      // A green control that ran nothing is the third way this apparatus can be stuck, beside stuck
      // red and stuck green: it would agree with every expectation of `survived` for free.
      if (control.testsSeen === null || control.testsSeen === 0) {
        throw new Error(
          `the unmutated ${cellKey(arm, lens)} is green but reported no test at all, so this ` +
            `battery would be measuring an empty suite`,
        )
      }
      testsPerCell[cellKey(arm, lens)] = control.testsSeen
      const ownGuards = control.guards.filter((guard) =>
        guard.file.includes(`${battery.contractPath}/`),
      )
      assertGuardsAreAddressed(cellKey(arm, lens), ownGuards)
      guardsPerCell[cellKey(arm, lens)] = ownGuards

      const injected = measureCell(battery, arm, lens, obvious, control.testsSeen)
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
    stopListening()
    restoreAfterAnInterruption(battery.contractPath)
  }

  return { testsPerCell, guardsPerCell }
}

export const runBattery = (
  battery: Battery,
  calibration: Calibration,
  only?: readonly string[],
  onlyArms?: readonly string[],
): readonly RunResult[] => {
  assertCleanTree()

  const results: RunResult[] = []
  const selected = battery.mutants.filter((m) => only === undefined || only.includes(m.id))
  const cells = cellsOf(battery).filter(
    ({ arm }) => onlyArms === undefined || onlyArms.includes(arm.id),
  )
  const stopListening = restoringOnSignal(battery.contractPath)

  try {
    for (const { arm, lens } of cells) {
      const expectedTests = calibration.testsPerCell[cellKey(arm, lens)]
      if (expectedTests === undefined) {
        throw new Error(`${cellKey(arm, lens)} was never calibrated, so it has nothing to trust`)
      }

      for (const mutant of selected) {
        const expected = expectationFor(mutant, arm, lens)
        const { verdict, failedGuards } = measureCell(battery, arm, lens, mutant, expectedTests)
        const agrees = agreesWith(expected, verdict, failedGuards)

        results.push({
          mutant: mutant.id,
          arm: arm.id,
          lens: lens.id,
          verdict,
          failedGuards,
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
    stopListening()
    restoreAfterAnInterruption(battery.contractPath)
  }

  return results
}

/**
 * A partial run writes somewhere else, and says so.
 *
 * Measured the hard way: `--only=M-15` overwrote a complete measurement of sixty-two cells with two,
 * and nothing said anything. The results folder is the output of one run rather than a durable
 * record - what a cell must produce is pinned in its battery - but silently replacing a complete
 * measurement with a fragment of one is the same family of defect as an edit that does not apply. It
 * leaves behind something that looks exactly like a result.
 */
export const writeResults = (name: string, payload: unknown, complete: boolean): string => {
  const out = join(HERE, 'results')
  mkdirSync(out, { recursive: true })

  const file = join(out, complete ? `${name}.json` : `${name}.partial.json`)
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`)

  return file
}
