/**
 * The mutation instrument.
 *
 * ADR-0019 is why a guard carries an identifier at all, and it is the record `calibrate()` below
 * enforces: a title with no well-formed address, or two guards of one contract answering to one, are
 * refused there because no suite can see either. ADR-0057 is what one cell collects, and why the
 * census is selected from rather than redeclared. ADR-0060 is the line between what `calibrate()`
 * resolves and what a suite guard resolves.
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
 * alone under `--typecheck` collects 28 assertions, sixteen of its twenty-one files reporting
 * nothing at all.
 *
 * The denominator this sentence used to carry is gone rather than corrected, for the reason the
 * separator's paragraph below gives: it read *of the 467 this repository has*, in the present tense,
 * and 467 had stopped being that some time before anybody noticed. What the measurement is about is
 * *28, and sixteen files silent*, and neither of those drifts.
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
import { join } from 'node:path'

import { GUARD_SEPARATOR, guardIdOf, isFrozenIdentifier } from '../packages/catalogue/identifier.ts'
import { THE_VITEST_ENTRY_POINT } from '../vitest-entry-point.ts'

import type { CollectedFile, SuiteCensus } from './census.ts'
import { censusFaults, censusFor } from './census.ts'
import { THE_INSTRUMENT_FOLDER, THE_REPOSITORY, git, strayWorktrees } from './paths.ts'

export type Edit = {
  /** Path relative to the contract folder, e.g. `reference.ts`. */
  readonly file: string
  readonly find: string
  readonly replace: string
}

/**
 * What a cell produced, as this instrument is able to say it.
 *
 * **`not-measured` is the one that is not about the mutant**, and it is here because the alternative
 * was reporting a verdict nobody measured. A run that does not finish, one killed for printing past
 * the buffer, and one that writes no report are three ways of learning nothing, and all three used to
 * arrive as `killed-by-typecheck` - which is derived from an *absence*, red with no guard named. A
 * report that was never written looks exactly like a red run with nothing to attribute it to.
 *
 * It cannot be pinned: `Expectation` takes `PinnableVerdict`, so no battery may declare a cell
 * unmeasurable, and a cell that measures this therefore disagrees with whatever it was pinned at and
 * fails the run. That is the whole of how it is enforced - no second term in the exit code, because a
 * disagreement already is one. ADR-0162.
 */
export type Verdict =
  | 'killed'
  | 'killed-by-typecheck'
  | 'survived'
  | 'not-applicable'
  | 'not-measured'

/** What a battery may pin, which is every verdict but the one that says the instrument learned nothing. */
export type PinnableVerdict = Exclude<Verdict, 'not-measured'>

/**
 * Why a cell is expected to survive. `mutants.ts` owns the vocabulary and ADR-0078 the argument for
 * it; the type is here because `Expectation` is here.
 *
 * Absent on a killed cell, and absent on the one survivor the structure explains for itself - a cell
 * blinded by its lens, whose own mutant dies on the column that reads the contract as committed.
 */
export type SurvivalNature =
  /** No observation distinguishes it: the answer is the same on every input, so nothing could catch it. */
  | 'equivalent'
  /** Observable, and the contract deliberately makes no claim about it. */
  | 'outside-what-the-contract-specifies'
  /** The rule is real and no input this catalogue holds tells the two apart. */
  | 'unreachable-on-this-catalogue'
  /** A limit this repository has declared, with its price, in the list of what nothing keeps. */
  | 'a-declared-open-class'
  /**
   * A real defect with a real witness, where the file that would have to carry the witness is frozen.
   *
   * **It is neither of the two it looks like.** Not `equivalent` - an input tells the two apart, and
   * that input is measured rather than imagined. Not `unreachable-on-this-catalogue` - a larger
   * catalogue does not reach it, because what is missing is not a value somebody has yet to publish
   * but a row inside a contract that may no longer take one.
   *
   * **It is the only kind here that cannot be closed.** The other four end when somebody writes a
   * test, specifies a behaviour, publishes a contract or takes a lens away; this one ends at the next
   * major of the contract that owns the case, or never. ADR-0161.
   */
  | 'its-witness-is-frozen-out'

/**
 * The two families of platform an operating-system defect can belong to, as this instrument splits
 * them.
 *
 * Two and not `process.platform`'s whole list, because what a cell of this kind turns on is a rule of
 * the operating system rather than the name of a distribution: a file another process holds cannot be
 * removed on Windows and can be everywhere else. The split is therefore total by construction - a
 * platform is `windows` or it is not - and a third value would be a family nobody has a rule for.
 */
export type PlatformFamily = 'windows' | 'posix'

/**
 * That the defect a cell injects exists on one family of platforms and not on the other.
 *
 * **It is an applicability and never a nature.** A `SurvivalNature` explains why a survivor is not a
 * hole; a cell carrying this never survives anywhere - it is caught where its defect exists and is not
 * measured where the defect cannot occur. Classifying it as a survivor of any kind would publish a
 * hole this repository does not have, and classifying it as caught everywhere would publish a verdict
 * no run off that family can produce.
 *
 * `because` is required. A cell whose two verdicts differ and which does not say why is a pin nobody
 * can check, and it is the shape somebody reaches for to silence a red they have not understood.
 *
 * ADR-0147 is the decision, including why no fifth `SurvivalNature` was added and what the two-value
 * split claims about filesystems rather than about `process.platform`.
 */
export type OnlyOnePlatform = {
  readonly family: PlatformFamily
  readonly because: string
}

/**
 * What a cell must produce. `by` names guard identifiers that must be among the reddened, which is
 * what makes a guard replayable rather than merely counted: a defect killed by a different guard
 * than the one that used to catch it is a silent loss of coverage, and naming the guard turns it
 * into a red battery.
 *
 * `nature` is read by nothing this file does - a verdict is a verdict - and exists because a
 * surviving cell is published. `mutation/published.ts` says what a bare count of survivors costs.
 *
 * `onlyOn` is read by two things and they are deliberately not the same. **A run resolves it**: off
 * that family the cell is not injected at all and answers `not-applicable`, which is the word this
 * instrument already uses for a cell it did not measure and which `score.ts` already excludes.
 * **A published figure does not**: `mutation/published.ts` reads the verdict as written, so a count is
 * the same object on every machine and the platform is published as a term of it rather than as an
 * argument nobody can see in the answer.
 */
export type Expectation = {
  readonly verdict: PinnableVerdict
  readonly by?: readonly string[]
  readonly nature?: SurvivalNature
  readonly onlyOn?: OnlyOnePlatform
}

/** Which family this machine belongs to. Node spells exactly one of them `win32`. */
export const thePlatformFamily = (platform: string = process.platform): PlatformFamily =>
  platform === 'win32' ? 'windows' : 'posix'

/**
 * The verdict a cell must produce *here*, which is the pin unless the platform decides otherwise.
 *
 * Separate from the pin rather than replacing it, because the two are read by different things: this
 * is what a run has to agree with, and the pin is what a figure is derived from.
 */
export const expectedHere = (
  pinned: Expectation,
  family: PlatformFamily = thePlatformFamily(),
): Expectation =>
  pinned.onlyOn === undefined || pinned.onlyOn.family === family
    ? pinned
    : { verdict: 'not-applicable' }

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
   *
   * Absent is also the one value that has to be narrowed, because it is the one configuration more
   * than one contract collects under - see `theFilesToCollect`.
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
 * first non-ASCII code point in any title in the repository: measured over every `it(...)` in every
 * test file, none carries one, and `number/parse@1` is where the cost of a stray non-ASCII character
 * in a source file was paid once already.
 *
 * The figure this sentence used to carry is gone rather than corrected. It read *none of the 467*,
 * and 467 stopped being the number of guard titles some time before anybody noticed - a count in
 * prose survives the data it counted and becomes the one part of the sentence that is false. What
 * the claim is about is *none*, which does not drift.
 *
 * **The shape and the separator are imported rather than restated**, which closes the debt
 * `packages/catalogue/identifier.ts` recorded against this file. What forced it is that a second folder began
 * reading a guard title: `packages/cli/breakage.test.ts` resolves the guard each declared refusal names, and a
 * third copy of one rule is how the three come to disagree.
 */
/* The identifier shape and the separator are `packages/catalogue/identifier.ts`'s, imported above. */

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
 * `guardsPerCell` holds the guards of the contract under measurement, and since the run is narrowed to
 * that contract they are every guard the run collected. That sentence used to say *the run executes
 * the whole repository suite*, and it stopped being true the day `theFilesToCollect` was written: the
 * filtering this field once needed is now done one floor down, on the command line, where it also
 * makes the run flat in the size of the catalogue.
 */
export type Calibration = {
  readonly testsPerCell: Readonly<Record<string, number>>
  readonly guardsPerCell: Readonly<Record<string, readonly GuardIdentity[]>>
}

const REPORT = join(THE_INSTRUMENT_FOLDER, '.vitest-report.json')

const assertCleanTree = (): void => {
  const dirty = git('status', '--porcelain', '--untracked-files=no').trim()
  if (dirty !== '') {
    throw new Error(
      `the working tree carries uncommitted changes, so a restore would destroy them:\n${dirty}`,
    )
  }
}

/**
 * The state the refusal above cannot see, because a leftover checkout leaves the tree clean. ADR-0095.
 *
 * It is refused here rather than only reported by `history.test.ts` for the reason `assertCleanTree`
 * is: a run that starts from a repository in this state produces verdicts nobody can attribute, and
 * the cause would be a checkout some earlier run never finished putting away.
 */
const assertNoStrayWorktree = (): void => {
  const stray = strayWorktrees()
  if (stray.length > 0) {
    throw new Error(
      `a checkout of this repository is registered besides its root, so git answers for a tree no ` +
        `run here put there:\n${stray.join('\n')}`,
    )
  }
}

/** Materialise an arm into the contract folder, from the commit that holds it. */
const checkoutArm = (contractPath: string, ref: string): void => {
  git('checkout', ref, '--', contractPath)
}

/**
 * Deregister every checkout a cell left behind, and refuse the one it cannot remove. ADR-0102.
 *
 * **A cell that leaves one is not an accident of a single mutant.** This instrument injects defects
 * into the modules that manage git's own state, so a defect whose whole content is *do not deregister*
 * is a cell that leaves a registration by construction - and making the subject tidy up regardless
 * would mean the subject could no longer express the defect. Measured: `I-56` of `registry-storage`
 * replaces the `git worktree remove` of `packages/registry/rebuild.ts` with a comment, the `rmSync`
 * below it still runs, and `.rebuilt/<HEAD>` survives as an administrative entry whose directory has
 * gone. The removal answers that state as well as the one a hard kill leaves - measured, exit 0 on an
 * entry git reports as `prunable`.
 *
 * **What is left is refused rather than reported**, because a teardown that swallows what it could not
 * undo hands the next cell a repository nobody put in that state - which is the sentence
 * `assertNoStrayWorktree` exists against, arriving one cell later and blamed on the wrong run.
 *
 * The confirmation is read only where something was removed. Every cell pays for the first reading,
 * and a cell that left nothing has nothing to confirm.
 */
const deregisterStrayWorktrees = (): void => {
  const stray = strayWorktrees()
  if (stray.length === 0) return

  for (const worktree of stray) git('worktree', 'remove', '--force', worktree)

  const left = strayWorktrees()
  if (left.length === 0) return

  throw new Error(
    `a checkout of this repository is registered besides its root and could not be removed, so the ` +
      `next cell would measure a repository nobody put in this state:\n${left.join('\n')}`,
  )
}

/**
 * Put this repository back: the contract under measurement, and git's own state beside it. ADR-0102.
 *
 * **The two halves are here together because the two refusals above are.** This instrument asserts a
 * clean tree *and* no stray checkout before it starts, and for as long as it restored only the first,
 * a cell could leave the second in exactly the state its own preconditions refuse. Restoring here
 * rather than once per battery is what keeps the cells independent: measured, a registration surviving
 * one cell makes `packages/registry/frozen-for-life.test.ts` unstartable for every cell after it, and
 * its four guards are then reported `skipped` rather than `failed` - a composition `assertWholeSuiteRan`
 * cannot see, because it compares a total against a total.
 */
const restore = (contractPath: string): void => {
  git('checkout', 'HEAD', '--', contractPath)
  deregisterStrayWorktrees()
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
export const anchoredText = (path: string): string =>
  readFileSync(path, 'utf8').replace(/\r\n/g, '\n')

/**
 * Where an anchor lands in the file it quotes, or the fact that it does not apply.
 *
 * A union rather than a position beside a count, because a position that means nothing unless the
 * count is one is a value every reader has to remember not to use.
 */
export type AnchorSite =
  | { readonly applies: true; readonly from: number; readonly to: number }
  | { readonly applies: false; readonly occurrences: number }

/**
 * An anchor applies when it matches exactly once.
 *
 * `anchors.ts` asks this of a whole repository before somebody moves a line; this file asks it of one
 * edit before a run. One rule, two readers - a second statement of it would be free to disagree on
 * the day one of them was corrected.
 */
export const locateAnchor = (source: string, find: string): AnchorSite => {
  const occurrences = source.split(find).length - 1
  if (occurrences !== 1) return { applies: false, occurrences }

  const lineAt = (index: number): number => source.slice(0, index).split('\n').length
  const at = source.indexOf(find)

  return { applies: true, from: lineAt(at), to: lineAt(at + find.length - 1) }
}

const applyEdits = (contractPath: string, edits: readonly Edit[], label: string): void => {
  for (const edit of edits) {
    const path = join(THE_REPOSITORY, contractPath, edit.file)
    const before = anchoredText(path)
    const site = locateAnchor(before, edit.find)

    if (!site.applies) {
      throw new Error(
        `${label}: the anchor below matches ${site.occurrences} times in ${edit.file}, and must ` +
          `match exactly once. An edit that does not apply would be measured as a defect the ` +
          `contract survived, when nothing was injected at all.\n---\n${edit.find}\n---`,
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
  /** `file.result.errors[0].message`, and `''` when the file had no error of its own. */
  readonly message?: string
  readonly assertionResults?: readonly Assertion[]
}

type VitestReport = { readonly testResults?: readonly ReportedFile[] }

export type SuiteRun = {
  readonly green: boolean
  readonly failedGuards: readonly string[]
  /**
   * Tests the run reported, or `null` when there is no report to read.
   *
   * **This used to say that a run with no report is still a kill, and it is not.** Measured at
   * `505fddb`: a mutant that fails to compile reddens *with* a report - the syntax error probe
   * reported 17 assertions of the 29 the census declares and none failed - where a run stopped by its
   * bound writes nothing at all. A null here now means the instrument learned nothing, and
   * `notMeasured` says why. ADR-0162.
   */
  readonly testsSeen: number | null
  /**
   * Why this run measured nothing about the mutant, or `null` where it measured something.
   *
   * A sentence rather than a code, because the only thing anybody does with it is read it: it reaches
   * a person through the cell's verdict and through the calibration's refusal, and both are places
   * where the next question is *what happened*.
   */
  readonly notMeasured: string | null
  readonly guards: readonly GuardIdentity[]
  /**
   * Every file the run reported on, against what it said about it - empty where it said nothing.
   *
   * `guards` cannot answer for a file that collected nothing, because a file with no assertion
   * contributes no guard and so disappears from it. This is the list the census needs: a file that
   * is silent is exactly the one worth asking about.
   */
  readonly reportedFiles: Readonly<Record<string, string>>
}

const reportedFiles = (): readonly ReportedFile[] | null => {
  try {
    return (JSON.parse(readFileSync(REPORT, 'utf8')) as VitestReport).testResults ?? []
  } catch {
    return null
  }
}

/** Reported paths are absolute and platform-shaped; the census and the attribution both want neither. */
const REPO_PREFIX = `${THE_REPOSITORY.replaceAll('\\', '/')}/`

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

/**
 * The file filters one run of this battery is given, and why exactly one configuration takes any.
 *
 * ---------------------------------------------------------------------------
 * What it buys, which is a slope and not a saving
 * ---------------------------------------------------------------------------
 *
 * A contract battery used to collect all five contracts on every one of its cells, so the cost of a
 * replay grew with the *product* of the catalogue's cells and the catalogue's suite. Measured over one
 * to five contracts, three runs of each, a suite run costs `705 + 78 x N` ms; the 74 cells a contract
 * carries turn that into `52 x N + 5.8 x N^2` seconds. Narrowed, a run costs 743 ms whatever N is, and
 * the same cells cost `55 x N`.
 *
 * **At five contracts this is worth two or three minutes and the number invites the wrong reading.**
 * Measured on the ten contract batteries alone: 10 min 9 s before, and what the same ten cost after is
 * the honest comparison, because two full replays differ by more than this change does. The whole of
 * the value is that a term which grew is now flat.
 *
 * ---------------------------------------------------------------------------
 * Where a replay's cost actually sits, measured at `4dc8a69` and not repaired
 * ---------------------------------------------------------------------------
 *
 * **It is not the number of cells.** `registry-storage` runs 59 cells in 511.6 s and `date-add` runs
 * 66 in 66.6 s - more cells, one eighth of the time. Divided by the number of suite runs each battery
 * makes, the whole replay is 712 runs in 42 min 16 s, an average of 3.56 s, and the spread across the
 * nineteen is nearly tenfold:
 *
 *     registry-storage   60 runs   8.53 s each        number-parse      66 runs   0.88 s each
 *     cli-search         21 runs   8.29 s each        string-levenshtein 54 runs  0.91 s each
 *     cli-install        73 runs   8.02 s each        date-add          68 runs   0.98 s each
 *
 * The split is exactly the narrowing above. A contract battery hands its run a filter and pays 0.9 s;
 * the client's and the registry's batteries collect their whole folder on every cell and pay eight.
 * **So the term that makes a replay long is the one that does not grow with the catalogue**, which is
 * the opposite of what the paragraph above was written about - and the batteries that already narrowed
 * are the cheap ones, which is the same finding read from the other end.
 *
 * If every battery ran at the contract batteries' rate, 712 runs would cost about eleven minutes
 * rather than forty-two. **Nothing here acts on that**: whether those five can be narrowed is a
 * measurement nobody has taken - a cell of `cli-install` edits a file the whole client suite reaches,
 * where a contract battery's edits reach one contract - and it is written down so that the unit which
 * takes it starts from a figure rather than from an intuition.
 *
 * ---------------------------------------------------------------------------
 * Which configuration can be narrowed is a measurement, not a choice
 * ---------------------------------------------------------------------------
 *
 * A filter ending in `/` is resolved against the configuration's own root; a filter without one is a
 * substring of the whole path. The six configurations of this repository set `root` to their own
 * folder, so a filter naming that folder resolves under it and names nothing. Measured on vitest
 * 4.1.10:
 *
 *     --config packages/registry/vitest.config.ts   packages/registry/                 0 files, exit 1
 *     --config packages/registry/vitest.config.ts   registry                 16 files - a no-op
 *     (the contracts' configuration)       contracts/typescript/number/parse/   4 files, 122 assertions
 *
 * So the narrowing is expressible under the contracts' configuration, whose root is the repository,
 * and under no other. The six need none: their own `root` and `include` already collect exactly the
 * folder their battery injects into. Nobody can generalise this to them, because vitest does not allow
 * it.
 *
 * The trailing slash is also what makes the filter precise. Without it `contracts/typescript/number/parse` is a
 * substring match and would collect a future `contracts/typescript/number/parse-int` as well.
 *
 * ---------------------------------------------------------------------------
 * Neither direction of this needs a guard of its own, and that was measured
 * ---------------------------------------------------------------------------
 *
 * A filter dropped makes the run collect the whole configuration, and `assertTheCensusHolds` refuses
 * it by naming every file the census does not declare. A filter added to one of the six collapses the
 * run to nothing, and the same refusal names every file that collected nothing. **The mechanism that
 * saves the time is held by the mechanism that was already there**, which is why no second guard is
 * written over it - two mechanisms over one fault have nothing to say on the day they disagree.
 */
export const theFilesToCollect = (battery: Battery): readonly string[] =>
  battery.vitestConfig === undefined ? [`${battery.contractPath}/`] : []

/**
 * The longest one run of the suite may take before the instrument stops waiting for it.
 *
 * **A mutant whose defect is non-termination is a real defect and the instrument could not report
 * one.** `site · W-97` takes the template-token rescan out of the comment reader, and measured at
 * `505fddb` over the ten modules a browser fetches, the reader then never finishes on three of them -
 * `playground.ts`, `literal.ts` and `value.ts`. With no bound the battery waits for ever: the owner
 * watched sixty-five minutes of it, and `measure.ts` sat at zero seconds of processor time while its
 * child spun.
 *
 * **The value is chosen against the slowest legitimate run rather than picked.** Measured at
 * `505fddb`, one run of each configuration this instrument spawns: contracts 1.4 s, validation 2.5 s,
 * site 5.4 s, cli 10.8 s, registry 14.9 s, packaging 14.9 s, meta 39.4 s. Ten minutes is fifteen times
 * the slowest of those, and it sits under the forty minutes `suites.yml` allows a job - so a bounded
 * cell reports rather than being cut off with everything else.
 *
 * **The margin over a runner is smaller than that fifteen and is now measured rather than waved at.**
 * Run 32842887678 took 1.8 to 2.6 times as long as this machine on the three heaviest batteries, so
 * the slowest legitimate *run* there is nearer 100 s than 40 - which leaves about six times rather
 * than fifteen. Still a bound a correct run does not approach, and the reading to retake if one ever
 * reports `not-measured` without a defect to explain it.
 */
const THE_LONGEST_A_RUN_MAY_TAKE = 600_000

/**
 * The most one run may print before node kills it.
 *
 * Node's default is 1 048 576 bytes, and a red run that prints past it is killed before vitest writes
 * its report - so the cell read `killed-by-typecheck`, a mutant that ran and was caught reported as
 * one that did not compile. It was measured rather than imagined:
 * `a-contract-not-yet-published-carries-the-current-banner` held whole `ContractSource` values in an
 * expectation, and its red run printed **1 177 066 bytes**, 12 % over.
 *
 * `1 << 28` is `packages/registry/determinism.test.ts`'s value, reached for rather than invented. It
 * does not make an overflow impossible, which is why one is still reported by name below.
 */
const THE_MOST_A_RUN_MAY_PRINT = 1 << 28

/**
 * Why a spawn that threw measured nothing, or `null` where what it threw was a red run.
 *
 * **Read off `code` and off nothing else**, measured at `505fddb` on this platform: an ordinary
 * non-zero exit carries `status: 1` and no `code`; a run past its bound carries `ETIMEDOUT`; one past
 * its buffer carries `ENOBUFS`; both of those also carry `signal: 'SIGTERM'`, which is why the signal
 * separates neither from the other. `killed` is `undefined` in every case here and is not the
 * discriminator it looks like. A run both over its buffer and hanging reports `ENOBUFS` - the buffer
 * fires first.
 *
 * Exported so the meta suite can put all three past it without spawning anything. ADR-0162.
 */
export const whyARunMeasuredNothing = (code: string | undefined): string | null => {
  if (code === 'ETIMEDOUT') {
    return (
      `the run did not finish within ${THE_LONGEST_A_RUN_MAY_TAKE / 1000} seconds, so nothing ` +
      `about this mutant was measured`
    )
  }
  if (code === 'ENOBUFS') {
    return (
      `the run printed more than ${THE_MOST_A_RUN_MAY_PRINT} bytes and was killed before it could ` +
      `report, so nothing about this mutant was measured`
    )
  }

  return null
}

const runSuite = (battery: Battery): SuiteRun => {
  rmSync(REPORT, { force: true })

  const nothingMeasured = (because: string): SuiteRun => ({
    green: false,
    failedGuards: [],
    testsSeen: null,
    guards: [],
    reportedFiles: {},
    notMeasured: because,
  })

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
        THE_VITEST_ENTRY_POINT,
        'run',
        '--typecheck',
        '--reporter=default',
        '--reporter=json',
        `--outputFile.json=${REPORT}`,
        ...(battery.vitestConfig === undefined ? [] : ['--config', battery.vitestConfig]),
        ...theFilesToCollect(battery),
      ],
      {
        cwd: THE_REPOSITORY,
        encoding: 'utf8',
        stdio: 'pipe',
        env: { ...process.env, TZ: battery.timeZone },
        timeout: THE_LONGEST_A_RUN_MAY_TAKE,
        maxBuffer: THE_MOST_A_RUN_MAY_PRINT,
      },
    )
    green = true
  } catch (thrown) {
    /**
     * **The error is read rather than discarded, and that is the whole repair.** This was `catch {}`,
     * so a run cut short and a run that reddened were one fact - and the second is a verdict where the
     * first is the absence of one.
     *
     * Node separates them on `code` and on nothing else, measured at `505fddb` on this platform: an
     * ordinary non-zero exit carries `status: 1` and no `code`; a run past its bound carries
     * `code: 'ETIMEDOUT'`; one past its buffer carries `code: 'ENOBUFS'`; and both carry
     * `signal: 'SIGTERM'`, which is why the signal cannot tell them apart. **`killed` is `undefined`
     * in all six cases here**, so it is not the discriminator either. A run that is both over its
     * buffer and hanging reports `ENOBUFS` - the buffer fires first.
     */
    const because = whyARunMeasuredNothing((thrown as { readonly code?: string }).code)
    if (because !== null) return nothingMeasured(because)

    green = false
  }

  const files = reportedFiles()
  if (files === null) {
    // Measured at `505fddb`: a run stopped by its bound writes no report at all, so this is reached
    // by anything that ends the child before vitest can write - not by a mutant that fails to compile,
    // which reddens *with* a report and with fewer assertions in it.
    return nothingMeasured('the run wrote no report this instrument could read')
  }

  const assertions = files.flatMap((file) => file.assertionResults ?? [])

  return {
    green,
    failedGuards: assertions.filter((t) => t.status === 'failed').map((t) => guardIdOf(t.title)),
    testsSeen: assertions.length,
    guards: guardsIn(files),
    notMeasured: null,
    reportedFiles: Object.fromEntries(
      files.map((file) => [relative(file.name ?? ''), file.message ?? '']),
    ),
  }
}

/**
 * What a run says about the mutant that was in the tree while it ran.
 *
 * The order is the argument: **a run that measured nothing is asked about first**, because every term
 * below it reads an absence as evidence. `killed-by-typecheck` is *red with no guard named*, which is
 * indistinguishable from *red because the report was never written* - so until the unmeasured cases
 * are taken out of it, that verdict is an absence wearing a name. With them out, it is a positive
 * reading: the child exited non-zero, a report exists, and nothing in it failed. ADR-0162.
 */
export const verdictOf = (run: SuiteRun): Verdict => {
  if (run.notMeasured !== null) return 'not-measured'
  if (run.green) return 'survived'

  return run.failedGuards.length === 0 ? 'killed-by-typecheck' : 'killed'
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

  // A cell whose defect this family of platforms cannot have is not injected here. It is the same
  // refusal as the line above arriving from the operating system instead of from the arm: there the
  // mutant cannot express the defect, here the platform cannot exhibit it, and in both cases running
  // the suite would produce a verdict about something other than the defect.
  //
  // It asks `expectedHere` rather than comparing the family itself, so that what a run skips and what
  // a run is held to are one decision. Two statements of it would be free to disagree, and the shape
  // of that disagreement is a cell measured here and judged by another platform's pin.
  if (expectedHere(expectationFor(mutant, arm, lens)).verdict === 'not-applicable') {
    return { verdict: 'not-applicable', failedGuards: [] }
  }

  restore(battery.contractPath)
  checkoutArm(battery.contractPath, arm.ref)
  applyEdits(battery.contractPath, lens.edits, `lens ${lens.id}`)
  applyEdits(battery.contractPath, edits, `mutant ${mutant.id} on arm ${arm.id}`)

  const run = runSuite(battery)
  assertWholeSuiteRan(`${mutant.id} on ${cellKey(arm, lens)}`, run, expectedTests)

  return { verdict: verdictOf(run), failedGuards: run.failedGuards }
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
  const malformed = guards.filter((guard) => !isFrozenIdentifier(guard.id))
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
 * Every guard this battery names is a guard the run carries - checked before a single verdict exists.
 *
 * **Both halves of this were measured rather than argued**, on `site` at `4344a72`, by putting back the
 * two mistakes this repository has already made once and corrected before measuring. Neither outcome is
 * the one the debt was filed expecting.
 *
 * A **pin** naming a guard no guard carries does redden, and the red says the wrong thing:
 *
 *     1 cell(s) disagree with the battery:
 *       W-41 on W/as-committed: expected killed, measured killed
 *         no longer caught by: an-invisible-character-is-read-back-as-the-character-it-names
 *
 * `expected killed, measured killed` is the two verdicts agreeing, on a line announcing that they do
 * not. `no longer caught by` then sends its reader into `read-literal.test.ts` after a guard that
 * stopped catching a defect - and there is no such guard, and there never was. A red that manufactures
 * a regression costs more than a silence, because somebody goes and looks for it.
 *
 * A guard declared silent under a name nothing carries is not reported **at all**: the name occurred
 * zero times in that run's output, the list printed the three real entries, and the run finished on
 * `every guard of this contract is either witnessed or accounted for`.
 *
 * So the addresses are resolved here, where the identities are already gathered, in the seconds
 * calibration costs rather than in the minutes a battery does. It is what turns a case identifier, a
 * guard identifier or a benchmark profile name that has stopped resolving from a silence into an error,
 * with no renaming anywhere - the class `CLAUDE.md` has been carrying against five kinds of address.
 *
 * **The two universes this read are one, and narrowing the run is what made them one.** A pin used to
 * resolve against every guard that reddened anywhere in the run and a declared silence against the
 * guards of the contract under measurement, because the run collected all five contracts and the two
 * sets genuinely differed. `theFilesToCollect` collapsed that difference, so the parameter that
 * expressed it went with it rather than staying as a second name for one set - two mechanisms over one
 * scope have nothing to say on the day they disagree.
 *
 * What the collapse costs is that a pin may no longer name a guard outside its own contract, and that
 * is a tightening rather than a loss: a battery injects into one folder, so such a pin was already
 * meaningless. Measured over the ten contract batteries before the narrowing was written - 220 pins,
 * 409 declared silent guards and 8 declared silent suites - **not one needed the wider universe.**
 */
const assertEveryAddressResolves = (
  battery: Battery,
  cell: string,
  lens: string,
  collected: readonly GuardIdentity[],
): void => {
  const here = new Set(collected.map((guard) => guard.id))
  const suitesHere = new Set(collected.map((guard) => guard.suite))

  const pinned = battery.mutants
    .flatMap((mutant) => (mutant.expected[cell]?.by ?? []).map((guard) => ({ mutant, guard })))
    .filter(({ guard }) => !here.has(guard))

  const declared = [...battery.unreachableGuards, ...battery.unprobedRegions].filter(
    (group) => group.lenses === undefined || group.lenses.includes(lens),
  )
  const guards = declared.flatMap((group) => (group.guards ?? []).filter((id) => !here.has(id)))
  const suites = declared.flatMap((group) => (group.suites ?? []).filter((id) => !suitesHere.has(id)))

  if (pinned.length === 0 && guards.length === 0 && suites.length === 0) return

  const listed = (what: string, consequence: string, names: readonly string[]): string =>
    names.length === 0
      ? ''
      : `  ${names.length} ${what}, ${consequence}:\n${names.map((name) => `    ${name}`).join('\n')}\n`

  throw new Error(
    `${cell}: this battery names guards that no guard of this run carries, so those addresses ` +
      `resolve to nothing.\n` +
      listed(
        'pinned by a cell',
        'which disagrees under "no longer caught by" and sends a reader after a regression that ' +
          'never happened',
        pinned.map(({ mutant, guard }) => `${guard}  (pinned by ${mutant.id})`),
      ) +
      listed('declared silent', 'which nothing reports at all', guards) +
      listed('declared silent by suite', 'which nothing reports at all', suites) +
      `  A guard identifier is frozen with its contract's major version. Repoint the address if the ` +
      `guard was renamed, and drop it if the guard is gone.`,
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
  const collected: Record<string, CollectedFile> = Object.fromEntries(
    Object.entries(run.reportedFiles).map(([file, said]) => [
      file,
      {
        guards: run.guards.filter((guard) => guard.file === file).length,
        reported: said === '' ? null : (said.split('\n')[0] ?? null),
      },
    ]),
  )

  const faults = censusFaults(collected, census)
  if (faults.length === 0) return

  throw new Error(
    `${label}: this run did not collect the suite this repository declares.\n${faults.join('\n')}\n` +
      `  It ran ${THE_VITEST_ENTRY_POINT}; mutation/paths.ts says why that spelling is printed here. ` +
      `A run that collects a fraction of the suite produces verdicts that look exactly like ` +
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
  assertNoStrayWorktree()

  const obvious = battery.mutants.find((m) => m.id === battery.calibrationMutant)
  if (obvious === undefined) {
    throw new Error(`${battery.name}: calibration mutant ${battery.calibrationMutant} is not here`)
  }

  const testsPerCell: Record<string, number> = {}
  const guardsPerCell: Record<string, readonly GuardIdentity[]> = {}
  const census = censusFor(battery.vitestConfig, battery.contractPath)
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
      if (control.notMeasured !== null) {
        throw new Error(
          `the unmutated ${cellKey(arm, lens)} could not be measured: ${control.notMeasured}. ` +
            `Nothing this battery reported below it would be a reading.`,
        )
      }
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
      assertGuardsAreAddressed(cellKey(arm, lens), control.guards)
      assertEveryAddressResolves(battery, cellKey(arm, lens), lens.id, control.guards)
      guardsPerCell[cellKey(arm, lens)] = control.guards

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
  assertNoStrayWorktree()

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
        const expected = expectedHere(expectationFor(mutant, arm, lens))
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
  const out = join(THE_INSTRUMENT_FOLDER, 'results')
  mkdirSync(out, { recursive: true })

  const file = join(out, complete ? `${name}.json` : `${name}.partial.json`)
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`)

  return file
}
