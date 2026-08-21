import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, sep } from 'node:path'

import { describe, expect, it } from 'vitest'

import { closureFrom, sourceNamedBy } from '../packaging/reachable.ts'

import { THE_REPOSITORY } from './paths.ts'
import { THE_BATTERIES } from './published.ts'
import {
  selectionFor,
  theFileOf,
  THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS,
  WHAT_A_RUN_OF_ANY_BATTERY_READS,
} from './selection.ts'

/**
 * What a push has to answer for, resolved against what each battery injects into and what each one is
 * built out of.
 *
 * ---------------------------------------------------------------------------
 * Three subjects, and they are deliberately not one guard
 * ---------------------------------------------------------------------------
 *
 * The **rule** is total over `THE_BATTERIES` and is checked by construction: every battery answers
 * for its folder and for its own declaration, and nothing else does. A battery added to that list
 * enters this population with nobody editing anything here, which is the property a typed list of
 * twenty-one names would not have.
 *
 * The **instrument** is the other half of what a push can move, and it is not total over anything: it
 * is a declaration, so its guard is a second, independent statement rather than a reading of the
 * first. The walk is what notices the instrument reaching somewhere new; the declaration is what
 * notices the walk going quiet - which is the pair `sharedHarnessOf` is built on, and the reason
 * neither half alone would do.
 *
 * The **entry point** is what the workflow runs, and none of the guards above reach it: reading a
 * range out of git, deciding that an unreadable one selects everything, and writing the two outputs a
 * matrix is built from are its own and are only exercised by starting it. So it is started, the way
 * `instrument.test.ts` starts `measure.ts fixture` - the neighbouring guard's argument said out loud,
 * because a reader who saw only the rule's guards would take its totality for coverage of the thing
 * the workflow actually invokes.
 */

/** A folder no battery injects into, so a change there selects nothing. It is not a hypothetical. */
const REACHED_BY_ALL_AND_INJECTED_INTO_BY_NONE = 'packages/catalogue/every-contract.ts'

describe('which batteries a change has to answer for', () => {
  /**
   * Seen red by narrowing the prefix test to equality, which leaves a battery answering for its
   * folder and for no file inside it - the state in which every push of a real change selects
   * nothing.
   */
  it('every-battery-answers-for-the-folder-it-injects-into', () => {
    const missed = THE_BATTERIES.filter(
      (battery) =>
        !selectionFor([`${battery.contractPath}/a-file-somebody-edited.ts`], THE_BATTERIES).batteries.includes(
          battery.name,
        ),
    ).map((battery) => battery.name)

    expect(missed).toEqual([])
  })

  /**
   * The neighbour of the guard above, and it is about the other half of what a battery is. Editing a
   * battery changes what this repository claims about a folder without changing the folder, so a rule
   * that watched only `contractPath` would let a claim move with nothing replaying it.
   *
   * Seen red by taking the `theFileOf` disjunct out of `answersFor`.
   */
  it('every-battery-answers-for-its-own-declaration', () => {
    const missed = THE_BATTERIES.filter(
      (battery) => !selectionFor([theFileOf(battery)], THE_BATTERIES).batteries.includes(battery.name),
    ).map((battery) => battery.name)

    expect(missed).toEqual([])
  })

  /**
   * A path that selects nothing leaves the selection through the other half rather than through the
   * floor. `packages/catalogue/` is the instance that makes this worth a guard rather than a
   * convenience: it is imported by every folder a battery injects into and injected into by none, so
   * the widest edit this repository can make is the one this rule answers *no battery* to, and a job
   * printing only what it chose would say nothing about it.
   */
  it('a-changed-file-no-battery-answers-for-is-reported-and-never-dropped', () => {
    const selection = selectionFor([REACHED_BY_ALL_AND_INJECTED_INTO_BY_NONE], THE_BATTERIES)

    expect(selection.batteries).toEqual([])
    expect(selection.unaccounted).toEqual([REACHED_BY_ALL_AND_INJECTED_INTO_BY_NONE])
  })

  /**
   * A folder beside one a battery injects into is not inside it. Without the separator the prefix test
   * makes `packages/registry-notes.ts` a change to `packages/registry`, which is a battery running on
   * a file it cannot see.
   */
  it('a-path-beside-a-folder-a-battery-injects-into-is-not-a-path-inside-it', () => {
    const beside = THE_BATTERIES.map((battery) => `${battery.contractPath}-notes.ts`)
    const selection = selectionFor(beside, THE_BATTERIES)

    expect(selection.batteries).toEqual([])
    expect(selection.unaccounted).toEqual(beside)
  })

  /**
   * The order is the declaration's, so that two runs of one commit build the same matrix and a job
   * name means the same thing twice. Seen red by selecting in the order the changed paths arrive.
   */
  it('a-selection-is-in-the-order-the-batteries-are-declared-in', () => {
    const declared = THE_BATTERIES.map((battery) => battery.name)
    const backwards = [...THE_BATTERIES].reverse().map((battery) => `${battery.contractPath}/x.ts`)

    expect(selectionFor(backwards, THE_BATTERIES).batteries).toEqual(declared)
  })
})

/**
 * Every file the imports say a run of a battery reads, repository-relative and forward-slashed.
 *
 * Two kinds of entry point, because `measure.ts` reaches no battery: it resolves one through a
 * templated `import()` that `specifiersIn` cannot see, so each declaration is walked from as well. The
 * battery files themselves are dropped from the answer - `theFileOf` already answers for those, one
 * battery each, and folding them in here would make every battery answer for every other.
 */
const whatTheImportsSay = (): readonly string[] => {
  const reached = new Set<string>()

  for (const entry of ['mutation/measure.ts', ...THE_BATTERIES.map(theFileOf)]) {
    for (const file of closureFrom(join(THE_REPOSITORY, entry), sourceNamedBy)) reached.add(file)
  }

  return [...reached]
    .map((file) => relative(THE_REPOSITORY, file).split(sep).join('/'))
    .filter((path) => !path.endsWith('.battery.ts'))
    .sort()
}

describe('what every battery is built out of', () => {
  /**
   * The declaration against the walk, in both directions and in one guard because one disagreement is
   * one event: a file the instrument started reading and a file it stopped reading are the same
   * failure of the pair to agree, and reporting them apart would say the second is a different kind of
   * thing than the first.
   *
   * Seen red both ways: with `mutation/attribution.ts` taken out of the declaration, and with
   * `mutation/replay.ts` - a real file no run reads - put into it.
   */
  it('every-file-a-run-of-a-battery-reads-is-declared', () => {
    expect([...WHAT_A_RUN_OF_ANY_BATTERY_READS].sort()).toEqual(whatTheImportsSay())
  })

  /**
   * The rule the declaration exists for. It is written over `THE_BATTERIES` rather than over a count,
   * so a battery added to the instrument enters this claim with nobody editing anything here.
   *
   * Seen red by leaving `theInstrumentMoved` out of the filter in `selectionFor`, which is the state
   * every push of this repository was in until this guard was written: `f465660` moved `run.ts`,
   * `paths.ts` and `mutants.ts` and replayed two batteries of twenty-one, and `8b6aa89` moved
   * `attribution.ts` and replayed none.
   */
  it('a-change-to-what-every-battery-is-built-out-of-selects-every-battery', () => {
    const selects = WHAT_A_RUN_OF_ANY_BATTERY_READS.filter(
      (path) => !THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS.includes(path),
    )
    const missed = selects.filter(
      (path) =>
        selectionFor([path], THE_BATTERIES).batteries.length !== THE_BATTERIES.length,
    )

    expect(missed).toEqual([])
    expect(selects.length).toBeGreaterThan(0)
  })

  /**
   * The neighbour of the guard above, and it is about the other half of the same declaration. That one
   * says a shared file selects everything; this one says the exception is real rather than a name
   * somebody left behind - a file that stopped being read by a run would sit here selecting nothing
   * for a reason that had expired, and nothing else in this file would notice.
   *
   * Seen red by naming `mutation/replay.ts`, which no run reads.
   */
  it('a-declaration-left-to-its-own-rows-is-one-a-run-really-reads', () => {
    const stale = THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS.filter(
      (path) => !WHAT_A_RUN_OF_ANY_BATTERY_READS.includes(path),
    )

    expect(stale).toEqual([])
  })

  /**
   * The residue, kept where a reader of the job's log meets it rather than in a paragraph. `census.ts`
   * is a table keyed by suite file, so a row of it moving is already addressed to a folder; the
   * argument is at `THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS` and the measurement with it.
   *
   * Seen red by taking the exception out of `everyBatteryAnswersFor`, which selects all twenty-one.
   */
  it('a-change-to-a-declaration-left-to-its-own-rows-selects-nothing-and-is-reported', () => {
    const selection = selectionFor([...THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS], THE_BATTERIES)

    expect(selection.batteries).toEqual([])
    expect(selection.unaccounted).toEqual([...THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS])
  })
})

/** What the entry point wrote for GitHub, parsed back out of the file it was handed. */
type Written = { readonly printed: string; readonly outputs: Readonly<Record<string, string>> }

const runTheEntryPoint = (...arguments_: readonly string[]): Written => {
  const folder = mkdtempSync(join(tmpdir(), 'toopo-selection-'))
  const output = join(folder, 'github-output')

  try {
    const printed = execFileSync(
      process.execPath,
      [join(THE_REPOSITORY, 'mutation', 'print-which-batteries-to-replay.ts'), ...arguments_],
      { cwd: THE_REPOSITORY, encoding: 'utf8', env: { ...process.env, GITHUB_OUTPUT: output } },
    )

    const outputs = Object.fromEntries(
      readFileSync(output, 'utf8')
        .split('\n')
        .filter((line) => line !== '')
        .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
    )

    return { printed, outputs }
  } finally {
    rmSync(folder, { recursive: true, force: true })
  }
}

const everyBattery = THE_BATTERIES.map((battery) => battery.name)

describe('the entry point the continuous integration runs', () => {
  /**
   * GitHub fails a job whose matrix is an empty list rather than skipping it, so the gate reads the
   * boolean. `HEAD..HEAD` is the range with nothing in it, and it is used rather than a pair of
   * commits because a pair would make this guard a reading of one history.
   *
   * Seen red by gating on `batteries.length >= 0`, which is the shape somebody reaches for when the
   * empty matrix has just failed a run.
   */
  it('a-push-that-changed-nothing-a-battery-answers-for-selects-none-and-says-so', () => {
    const { outputs } = runTheEntryPoint('HEAD', 'HEAD')

    expect(outputs['batteries']).toBe('[]')
    expect(outputs['any']).toBe('false')
  })

  /**
   * The first push of a branch, which GitHub describes by handing forty zeroes as the commit before
   * it. **The direction is the whole guard**: a range this cannot read means it cannot tell what
   * changed, and a gate that answered *nothing* there would be green on a push it never looked at.
   *
   * **It asserts the cause and not only the outcome, and that is a repair rather than a flourish.**
   * Written against *every battery is selected rather than none* it could not fail: taking the
   * sentinel out leaves the sentinel's own range failing in git, which reaches the same outcome down
   * the other branch and prints the same sentence. Nine perturbations of this module reddened eight
   * guards and this was the ninth - found by the neighbour below already naming its own cause, which
   * made the gap visible as a sentence rather than as a reread.
   */
  it('a-first-push-selects-every-battery-rather-than-none', () => {
    const { outputs, printed } = runTheEntryPoint('0'.repeat(40), 'HEAD')

    expect(JSON.parse(outputs['batteries'] as string)).toEqual(everyBattery)
    expect(outputs['any']).toBe('true')
    expect(printed).toContain('no commit was named before this one')
  })

  /**
   * The neighbour of the guard above, and it is a different cause with the same right answer: a
   * force-push names a commit this checkout may never have held, and git answers with an error rather
   * than with an empty diff. The two are told apart in what is printed, because a reader deciding
   * whether a full replay was warranted needs to know which of them happened.
   */
  it('a-base-this-checkout-does-not-hold-selects-every-battery-rather-than-none', () => {
    const { outputs, printed } = runTheEntryPoint('a'.repeat(40), 'HEAD')

    expect(JSON.parse(outputs['batteries'] as string)).toEqual(everyBattery)
    expect(outputs['any']).toBe('true')
    expect(printed).toContain('a commit this checkout does not hold')
  })

  /**
   * Both sides of the selection reach the log. A job that printed only what it chose would leave a
   * reader unable to tell a push that touched nothing from one whose every file this rule passed over
   * - and `packages/catalogue/` is exactly the second shape.
   */
  it('the-log-carries-what-was-passed-over-and-not-only-what-was-chosen', () => {
    const { printed } = runTheEntryPoint('HEAD', 'HEAD')

    expect(printed).toContain('batteries answer for them')
    expect(printed).toContain('no battery answers for')
  })

  /**
   * The second gate's matrix comes from the same job as the first's.
   *
   * It replays everything, and taking that list from a second reading of `THE_BATTERIES` in the
   * workflow would be the declaration this repository refuses one floor down: two statements of what
   * the instrument holds, free to disagree, in the file where a disagreement means a battery silently
   * not replaying before a publication.
   */
  it('the-entry-point-answers-for-the-whole-instrument-as-well-as-for-the-selection', () => {
    const { outputs } = runTheEntryPoint('HEAD', 'HEAD')

    expect(JSON.parse(outputs['everything'] as string)).toEqual(everyBattery)
    expect(outputs['batteries']).toBe('[]')
  })
})
