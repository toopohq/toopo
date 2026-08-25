import { describe, it, expect } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Battery, Calibration, Mutant, RunResult } from './run.ts'
import type { SuiteRun } from './run.ts'
import {
  calibrate,
  expectedHere,
  restoreAfterAnInterruption,
  restoringOnSignal,
  runBattery,
  verdictOf,
  whyARunMeasuredNothing,
} from './run.ts'
import { THE_REBUILD_FOLDER } from '../packages/registry/rebuild.ts'
import { THE_INSTRUMENT_FOLDER, THE_REPOSITORY, strayWorktrees } from './paths.ts'
import { withCanonicalDriveLetter } from '../vitest-entry-point.ts'
import { CENSUS, censusFor, THE_CONTRACTS_SUITE } from './census.ts'
import { attributionOf, disagreementsIn } from './attribution.ts'
import type { MeasuredBattery } from './score.ts'
import { renderScore, scoreFaults, theScore } from './score.ts'
import { killed, mutantsOn, onlyOn, reference, survived, survivesOnlyBlinded } from './mutants.ts'
import { battery, DOUBLED, DOUBLES_A_POSITIVE, DOUBLES_ZERO } from './fixture.battery.ts'
import { THE_BATTERIES, survivorFaults, theMeasurement } from './published.ts'

/**
 * The instrument, measured.
 *
 * Every number this repository publishes comes out of `mutation/`, and every guard in there is a
 * guard nothing was measuring. Each one exists because the instrument can produce a cell that reads
 * exactly like a result and is not one, and each is written below with its real failure condition:
 * an apparatus deliberately broken in that one way, and the requirement that the instrument refuse
 * it. A guard that has never been seen red is decorative, and that rule does not stop at the edge of
 * the catalogue.
 *
 * Three of the eight have been observed for real. The truncated suite and the partial run that
 * overwrote a complete one both happened by accident and are recorded in `run.ts` where they bit.
 * The third is the healthy case and the one worth citing: D-22 of `date/add@1` reddened five named
 * cases that battery had declared silent, and the instrument refused the stale declaration rather
 * than letting it stand. That is this file's subject catching something in production before this
 * file existed.
 *
 * Measured, and this is the whole claim: a meta-mutant per test below was applied one at a time,
 * each removing from `run.ts` or `attribution.ts` the single guard that test covers. Every time,
 * exactly one test went red, and every time it was the one that covers the guard that had been
 * removed. None of them is decorative and none of them stands in for another.
 *
 * A complete pass costs 11.1 seconds of wall clock at `47b93d1`. It read 6.9 seconds before the pair
 * of drive-letter guards at the foot of this file, the second of which spawns a battery of its own.
 *
 * The cheapest contract battery took 65 seconds when this file was written, and that ratio is the
 * fixture's entire justification: the price of running a guard is what decides whether it is ever
 * run.
 *
 * **Where the chain stops.** These meta-tests are themselves guards, and nothing measures them. The
 * regression is cut here, deliberately and not by oversight: each was shown red by the hand that
 * wrote it, and that hand is the last link this repository accepts. A meta-meta battery would need a
 * meta-fixture and would itself be unmeasured, one level further out, at the same cost and with the
 * same honest ending. What is *not* accepted is leaving a reader to assume the chain closes. It does
 * not.
 *
 * These run under their own configuration - `npm run meta`, not `npm test` - because a fixture
 * collected by the contracts' suite would appear to be one of them, and because each guard below
 * spawns real vitest processes. Like the batteries, they require a clean working tree: the
 * instrument checks out arms into the tree it is measuring, and a restore would destroy anything
 * uncommitted.
 */

/**
 * Every guard here spawns child processes, so its verdict can depend on elapsed time, so it declares
 * its own timeout - the catalogue's clock rule, applied to the instrument that enforces it. Measured,
 * the slowest of them takes about two seconds; a limit twenty times that is not a duration
 * assertion, and vitest's five-second default would have been one.
 */
const META_TIMEOUT_MS = 60_000

const { sameOnEveryLens } = mutantsOn({ arm: 'C', asCommitted: 'as-committed', blinded: [] })

/**
 * Calibrated once and shared, because calibration is two runs of the fixture suite and every guard
 * below would otherwise pay for them again. It is also the first assertion of this file: if the
 * fixture cannot be calibrated, nothing underneath is worth reading, and the failure arrives as a
 * collection error rather than as eight confusing ones.
 */
const calibration: Calibration = calibrate(battery)

const runOne = (mutant: Mutant, changes: Partial<Battery> = {}): readonly RunResult[] =>
  runBattery({ ...battery, ...changes, mutants: [mutant] }, calibration)

const disagreementsFrom = (variant: Battery): readonly string[] => {
  const results = runBattery(variant, calibration)

  return disagreementsIn(attributionOf(variant, calibration, results))
}

describe('the mutation instrument refuses an apparatus that would lie', () => {
  it(
    'refuses an edit that does not apply, which would be counted as a survivor',
    () => {
      // The dangerous half is that nothing looks wrong: the anchor stops matching after an
      // unrelated rewrite of the reference, no defect is injected, the suite is green, and the cell
      // reports that the contract failed to catch a defect it was never shown.
      const anchoredOnTextThatIsGone = sameOnEveryLens(
        'FX-M1',
        'anchored on a line the reference does not contain',
        [reference(`export const doubled = (value: number): number => value * 3`, DOUBLED)],
        survived('equivalent'),
      )

      expect(() => runOne(anchoredOnTextThatIsGone)).toThrow(/must match exactly once/)
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a cell that ran only part of the suite, which would be counted as a kill',
    () => {
      // The mirror of the one above, arriving from the other side: most of the suite never ran, the
      // run reddens because of that rather than because of the defect, and the cell reads as a
      // contract catching something. Measured for real on vitest 4.1.10, where naming the json
      // reporter alone under `--typecheck` collected 9 tests instead of 215 and every cell of every
      // battery read as a kill.
      const breaksOneFileAtImport = sameOnEveryLens(
        'FX-M2',
        'makes the second test file throw while it is being collected',
        [
          {
            file: 'second-file.test.ts',
            find: `import { doubled } from './reference.js'`,
            replace: `import { doubled } from './reference.js'\nthrow new Error('collection failed')`,
          },
        ],
        killed(),
      )

      expect(() => runOne(breaksOneFileAtImport)).toThrow(
        /reported 2 tests where the unmutated arm reported 3/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a suite that shrank, which nothing else in this apparatus can see',
    () => {
      /**
       * The door the other three refusals cannot see, injected through the instrument's own lens
       * mechanism: the fixture's configuration lives inside the fixture folder, so a lens can narrow
       * what it collects exactly as a real edit to `vitest.config.ts` would.
       *
       * Measured on the commit before `census.ts` existed, with this same lens: the control is
       * **green with 2 tests**, so the stuck-red refusal is silent; 2 is not 0, so the empty-suite
       * refusal is silent; calibration pins `testsPerCell` at 2, so `assertWholeSuiteRan` compares 2
       * against 2 on every cell and is silent too. The battery then ran and reported `FX-1
       * killed DISAGREES` - a third of the suite never collected, presented as a guard that stopped
       * catching a defect. That misattribution is what this refusal replaces.
       *
       * The same door on the real suite, measured: narrowing the glob in `vitest.config.ts` by one
       * character drops `string/slugify@1`, and the run reports `success: true`, 15 files, 347
       * guards instead of 467, zero failures.
       */
      const lensThatNarrowsTheCollection = {
        id: 'as-committed',
        description: 'a lens that stops the fixture collecting one of its two test files',
        arms: ['C'],
        edits: [
          {
            file: 'vitest.config.ts',
            find: `include: ['*.test.ts'],`,
            replace: `include: ['guards.test.ts'],`,
          },
        ],
      }

      // The message has to name the file, and not merely the total: naming it is what tells the
      // reader whether a guard was deliberately removed or a collection quietly broke.
      expect(() => calibrate({ ...battery, lenses: [lensThatNarrowsTheCollection] })).toThrow(
        /mutation\/fixture\/second-file\.test\.ts: declared 1, collected 0/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'says what the run said about a file that collected nothing',
    () => {
      /**
       * The refusal above names the files and used to stop there, and that silence cost two replays:
       * the fourth door of `census.ts` was a lower-case drive letter, the reason was sitting in
       * `testResults[].message` for every one of the sixteen empty files, and `runSuite` read past
       * it. Naming a file says *something is wrong*; quoting the run says *what*.
       *
       * A lens rather than a mutant, because the census only runs during calibration - and a file
       * that throws while being collected is the shape every door in that family takes.
       */
      const lensThatBreaksAFileAtImport = {
        id: 'as-committed',
        description: 'a lens that makes one fixture file throw while it is being collected',
        arms: ['C'],
        edits: [
          {
            file: 'second-file.test.ts',
            find: `import { doubled } from './reference.js'`,
            replace: `import { doubled } from './reference.js'\nthrow new Error('collection failed')`,
          },
        ],
      }

      expect(() => calibrate({ ...battery, lenses: [lensThatBreaksAFileAtImport] })).toThrow(
        /second-file\.test\.ts: declared 1, collected 0\n {4}the run said: collection failed/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a suite it has never counted, rather than skipping the count',
    () => {
      // A configuration nobody has counted would opt its whole suite out of the census, which is the
      // same failure one level up: an absent guard looks exactly like a guard that passed.
      expect(() =>
        calibrate({ ...battery, vitestConfig: 'mutation/fixture/nobody-counted-this.ts' }),
      ).toThrow(/no census declares what "mutation\/fixture\/nobody-counted-this.ts" collects/)
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a folder no counted file lies under, rather than comparing against nothing',
    () => {
      // The other half of the refusal above, arriving from the opposite side: there the configuration
      // was unknown, here it is known and the folder inside it is not. An empty census agrees with a
      // run that collected nothing, so nothing downstream would object on its own terms.
      //
      // Measured with the refusal taken out: calibration walks on and dies on `Command failed: git
      // checkout HEAD -- mutation/fixture-renamed` - a subprocess error that names no census, no
      // configuration and no count, in front of somebody who has just renamed a folder. That is what
      // this buys, and it buys it before any run has happened.
      expect(() => calibrate({ ...battery, contractPath: 'mutation/fixture-renamed' })).toThrow(
        /no file of "mutation\/fixture\/vitest\.config\.ts" lies under "mutation\/fixture-renamed"/,
      )
    },
    META_TIMEOUT_MS,
  )

  /**
   * The selection is what let a narrowed run keep the census it already had, so it is what would
   * silently stop narrowing.
   *
   * It is asserted as a *comparison* rather than against a written-out table, deliberately: the four
   * counts of a contract are hand-written in `census.ts` and copying them here would be a second
   * statement of the same integers, growing with the catalogue in a file that has no reason to. What
   * is checked is the shape - everything selected is under this contract, and there is strictly less
   * of it than the configuration declares - and both halves of that go red on the one edit that
   * matters, a selection that stops selecting.
   */
  it('a-contract-battery-is-compared-against-its-own-contract-alone', () => {
    const parse = THE_BATTERIES.find((one) => one.name === 'number-parse')
    if (parse === undefined) throw new Error('number-parse is not among the published batteries')

    const scoped = Object.keys(censusFor(parse.vitestConfig, parse.contractPath))
    const whole = Object.keys(CENSUS[THE_CONTRACTS_SUITE] ?? {})

    expect(scoped.filter((file) => !file.startsWith(`${parse.contractPath}/`))).toEqual([])
    expect(scoped.length).toBeLessThan(whole.length)
    expect(whole).toEqual(expect.arrayContaining(scoped))
  })

  it(
    'refuses an apparatus that is stuck red, which would call every mutant killed',
    () => {
      const lensThatReddensTheControl = {
        id: 'as-committed',
        description: 'a lens whose own edit makes the unmutated fixture fail',
        arms: ['C'],
        edits: [
          {
            file: 'guards.test.ts',
            find: 'expect(doubled(21)).toBe(42)',
            replace: 'expect(doubled(21)).toBe(43)',
          },
        ],
      }

      expect(() => calibrate({ ...battery, lenses: [lensThatReddensTheControl] })).toThrow(
        /is red, so every verdict from this battery would be noise/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses an apparatus that cannot be shown able to see anything, which would call every mutant a survivor',
    () => {
      // Half a calibration is not a calibration. A green control proves the apparatus is not stuck
      // red and proves nothing about whether it can see; FX-2 answers every call correctly, so an
      // apparatus calibrated on it has been shown nothing at all.
      expect(() => calibrate({ ...battery, calibrationMutant: 'FX-2' })).toThrow(
        /is not killed on C\/as-committed, so the apparatus cannot be shown able to see anything/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a cell nobody pinned, which would be a verdict nobody has to agree with',
    () => {
      const unpinned: Mutant = {
        id: 'FX-M5',
        kind: 'defect',
        description: 'a mutant that declares no expected verdict for the cell it runs on',
        arms: { C: [reference(DOUBLED, `export const doubled = (value: number): number => value`)] },
        expected: {},
      }

      expect(() => runOne(unpinned)).toThrow(/declares no expected verdict for C\/as-committed/)
    },
    META_TIMEOUT_MS,
  )

  it(
    'disagrees when the guard a cell names is not among the guards that reddened',
    () => {
      // A defect that migrates from one guard to another leaves the verdict and the score untouched,
      // so nothing else in this instrument can see it. This is the whole reason a pin names titles
      // rather than counting them.
      const pinnedOnAGuardItCannotRedden = sameOnEveryLens(
        'FX-M6',
        'the fixture defect, pinned on a guard that is green under it',
        [reference(DOUBLED, `export const doubled = (value: number): number => value`)],
        killed([DOUBLES_A_POSITIVE, DOUBLES_ZERO]),
      )

      const [cell] = runOne(pinnedOnAGuardItCannotRedden)

      expect({ verdict: cell?.verdict, agrees: cell?.agrees }).toEqual({
        verdict: 'killed',
        agrees: false,
      })
    },
    META_TIMEOUT_MS,
  )

  it(
    'disagrees when a guard nothing reddens is not accounted for',
    () => {
      const declaresNothing = { ...battery, unprobedRegions: [] }

      expect(disagreementsFrom(declaresNothing).join('\n')).toMatch(
        /nothing reddens "doubles-zero", and the battery does not say why/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'disagrees when a mutant reddens a guard the battery declared silent',
    () => {
      // The one of these eight the instrument has already caught in the wild: D-22 of `date/add@1`
      // reddened five cases that battery had declared unprobed, and this is what refused the stale
      // declaration. Half the refusal region of that contract was reclassified because of it.
      const reddensTheDeclaredSilentGuard = sameOnEveryLens(
        'FX-M8',
        'off by one on zero alone, so the guard nothing was supposed to reach goes red',
        [
          reference(
            DOUBLED,
            `export const doubled = (value: number): number => value * 2 + (value === 0 ? 1 : 0)`,
          ),
        ],
        killed([DOUBLES_ZERO]),
      )

      const staleDeclaration = { ...battery, mutants: [reddensTheDeclaredSilentGuard] }

      expect(disagreementsFrom(staleDeclaration).join('\n')).toMatch(
        /"doubles-zero" is declared silent and a mutant reddened it, so the declaration is stale/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses two guards of one contract that answer to one identifier',
    () => {
      // Attribution addresses a guard by its identifier alone, so two guards carrying one are read
      // as reddening each other. Measured for real on `array/group-by@1` before this refusal
      // existed: `language.test.ts` reused the titles block 4.4 had given its cases, and twenty-four
      // guards claimed defects they cannot see. The lens below is that collision, injected on
      // purpose - it renames the third guard onto the identifier of the first, leaving the sentence
      // after ` :: ` alone so that nothing but the address collides.
      const lensThatDuplicatesAnIdentifier = {
        id: 'as-committed',
        description: 'a lens that gives two guards of the fixture one identifier',
        arms: ['C'],
        edits: [
          {
            file: 'second-file.test.ts',
            find: `it('doubles-a-negative-number :: minus three doubles to minus six'`,
            replace: `it('doubles-a-positive-number :: minus three doubles to minus six'`,
          },
        ],
      }

      expect(() => calibrate({ ...battery, lenses: [lensThatDuplicatesAnIdentifier] })).toThrow(
        /identifier\(s\) address more than one guard/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a guard that carries no well-formed identifier',
    () => {
      // The other half of the same question, and it needs its own guard because it is a different
      // failure: a title that is only a sentence gives the instrument an address nobody can cite,
      // and every pin naming it breaks the day the sentence is reworded. Written as a lens that
      // replaces the identifier with the words it stands for - which is exactly what every guard in
      // this repository looked like before the rule existed.
      const lensThatDropsAnIdentifier = {
        id: 'as-committed',
        description: 'a lens that turns one fixture identifier back into a sentence',
        arms: ['C'],
        edits: [
          {
            file: 'guards.test.ts',
            find: `it('doubles-zero :: zero doubles to zero'`,
            replace: `it('doubles zero'`,
          },
        ],
      }

      expect(() => calibrate({ ...battery, lenses: [lensThatDropsAnIdentifier] })).toThrow(
        /carry no kebab-case identifier/,
      )
    },
    META_TIMEOUT_MS,
  )

  /**
   * The three below are one refusal, and they are three guards because they read three different
   * universes: a pin resolves against every guard the run collected, a declared silence against the
   * guards of the contract under measurement, and a declared silent *suite* against the describe
   * titles those guards sit under. One meta-test would have covered whichever universe it happened to
   * touch and left the other two able to break in silence.
   *
   * What they are for was measured on the real thing rather than imagined - `run.ts` carries the two
   * outputs. The half that reddens reddens under `no longer caught by`, which invents a regression;
   * the half that does not is not reported at all.
   *
   * And the refusal found one the moment it existed: `cli-search` declared
   * `a-feature-already-installed-is-not-installed-again` silent, a string that occurred nowhere else
   * in the repository, beside the `reinstalling-what-is-already-there-changes-nothing` that is the
   * guard it was once the name of. Nothing had ever said so.
   */
  it(
    'refuses a pin naming a guard the suite does not carry',
    () => {
      const pinnedOnAGuardThatIsGone = sameOnEveryLens(
        'FX-M9',
        'the fixture defect, pinned on an identifier no guard of the suite answers to',
        [reference(DOUBLED, `export const doubled = (value: number): number => value`)],
        killed(['doubles-a-positive-number-and-zero']),
      )

      expect(() =>
        calibrate({ ...battery, mutants: [...battery.mutants, pinnedOnAGuardThatIsGone] }),
      ).toThrow(/doubles-a-positive-number-and-zero\s+\(pinned by FX-M9\)/)
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a guard declared silent under a name no guard carries',
    () => {
      const declaresAGuardThatIsGone: Battery = {
        ...battery,
        unprobedRegions: [
          ...battery.unprobedRegions,
          {
            nature: 'claims detection',
            reason: 'a region named after a guard that has been renamed since',
            guards: ['doubles-zero-exactly'],
          },
        ],
      }

      expect(() => calibrate(declaresAGuardThatIsGone)).toThrow(
        /1 declared silent, which nothing reports at all:\s+doubles-zero-exactly/,
      )
    },
    META_TIMEOUT_MS,
  )

  it(
    'refuses a suite declared silent under a title no suite carries',
    () => {
      // A describe title is prose and is reworded, where a guard identifier is frozen - so this is
      // the half of the family most likely to break, and the one nothing would have said a word about.
      const declaresASuiteThatIsGone: Battery = {
        ...battery,
        unreachableGuards: [
          { suites: ['the fixture'], reason: 'a suite title as it read before it was reworded' },
        ],
      }

      expect(() => calibrate(declaresASuiteThatIsGone)).toThrow(
        /1 declared silent by suite, which nothing reports at all:\s+the fixture/,
      )
    },
    META_TIMEOUT_MS,
  )

  /**
   * The tally is a tool rather than a battery, and that files it somewhere else in this folder rather
   * than exempting it. It declares three refusals, and three refusals nothing has been seen to fire are
   * three declarations nothing keeps - the family `CLAUDE.md` keeps a list of.
   *
   * They are measured on described artefacts and not on a disk, so they cost no replay and cannot
   * quietly pass because `mutation/results/` happens to hold something today.
   */
  const measuredAt = (writtenAt: number): MeasuredBattery => ({
    battery: 'fixture',
    writtenAt,
    cells: [{ mutant: 'FX-1', cell: 'C/as-committed', verdict: 'killed', kind: 'defect' }],
  })

  const COMPLETE = [measuredAt(2_000)]
  const COMMITTED_AT = 1_000

  it('accepts the one set of artefacts that is a whole replay of this commit', () => {
    expect(scoreFaults(['fixture'], COMPLETE, [], COMMITTED_AT)).toEqual([])
  })

  it('refuses a total missing a battery, which would silently be a total of the others', () => {
    expect(scoreFaults(['fixture', 'site'], COMPLETE, [], COMMITTED_AT).join('\n')).toMatch(
      /site declares a battery and wrote no result/,
    )
  })

  /**
   * Both halves, because the rule was wrong in one direction on its first real run: it refused a whole
   * replay over six partials dated days earlier, from commits that had nothing to do with it.
   */
  it('refuses a total taken while a mutant of this same commit was being investigated', () => {
    const investigating = [{ name: 'site.partial.json', writtenAt: COMMITTED_AT + 1 }]
    const leftOver = [{ name: 'site.partial.json', writtenAt: COMMITTED_AT - 1 }]

    expect(scoreFaults(['fixture'], COMPLETE, investigating, COMMITTED_AT).join('\n')).toMatch(
      /site\.partial\.json is a filtered run measured against this same commit/,
    )
    expect(scoreFaults(['fixture'], COMPLETE, leftOver, COMMITTED_AT)).toEqual([])
  })

  it('refuses an artefact older than the commit it would describe', () => {
    expect(scoreFaults(['fixture'], [measuredAt(500)], [], COMMITTED_AT).join('\n')).toMatch(
      /fixture was measured before the commit it would describe/,
    )
  })

  /**
   * Both populations are printed together or the rendering is wrong, and that is the whole reason this
   * file exists: 556 and 582 collided because each was held by somebody who did not know the other
   * population was there. A rendering able to print one alone lets it happen again by the same route.
   */
  it('renders the probes beside the defects even when no probe survives', () => {
    const noProbeSurvives = theScore([
      {
        battery: 'fixture',
        writtenAt: 1,
        cells: [
          { mutant: 'FX-1', cell: 'C/as-committed', verdict: 'killed', kind: 'defect' },
          { mutant: 'FX-2', cell: 'C/as-committed', verdict: 'survived', kind: 'defect' },
          { mutant: 'FX-3', cell: 'C/as-committed', verdict: 'killed', kind: 'probe' },
        ],
      },
    ])

    expect(noProbeSurvives).toEqual({
      defects: {
        cells: 2,
        killed: 1,
        surviving: [{ battery: 'fixture', mutant: 'FX-2', cell: 'C/as-committed' }],
      },
      probes: { cells: 1, killed: 1, surviving: [] },
    })

    const rendered = renderScore(noProbeSurvives, 1, 'abc1234')

    expect(rendered).toMatch(/defects\s+2 cells\s+1 killed\s+1 surviving/)
    expect(rendered).toMatch(/probes\s+1 cells/)
    expect(rendered).toContain('FX-2 on C/as-committed')
    expect(rendered).toContain('surviving probes - none')
  })

  /**
   * A mutant read through two lenses is two cells, and the surviving list has to say which.
   *
   * A battery may carry a second lens, so this is not a corner: the first output this
   * tool produced printed `number-parse/P-02` twice on one line, which reads as a rendering fault
   * rather than as two results that could have disagreed and did not.
   */
  it('addresses a surviving cell by its lens and not by its mutant alone', () => {
    const bothLenses = theScore([
      {
        battery: 'number-parse',
        writtenAt: 1,
        cells: [
          { mutant: 'P-02', cell: 'B/as-committed', verdict: 'survived', kind: 'defect' },
          { mutant: 'P-02', cell: 'B/reason-blind', verdict: 'survived', kind: 'defect' },
        ],
      },
    ])

    expect(bothLenses.defects.surviving.map((one) => one.cell)).toEqual([
      'B/as-committed',
      'B/reason-blind',
    ])
    expect(renderScore(bothLenses, 1, 'abc1234')).toContain(
      'P-02 on B/as-committed, P-02 on B/reason-blind',
    )
  })

  /**
   * An interrupted run leaves a mutant in the tree, and that is the one way a defect enters this
   * catalogue in silence: a *surviving* mutant reddens nothing by definition, so `npm test` is green,
   * the tree is dirty, and the whole thing is committable with nothing protesting. The next battery
   * run would refuse the dirty tree - so the instrument protects itself, and only the suite is fooled.
   *
   * This is the restore half, exercised against a real edit to the fixture rather than described.
   */
  it(
    'puts the tree back when a run is interrupted',
    () => {
      const path = join(THE_INSTRUMENT_FOLDER, 'fixture', 'reference.ts')
      const before = readFileSync(path, 'utf8')

      try {
        writeFileSync(path, `${before}\nexport const leftBehindByAnInterruption = 1\n`)
        expect(readFileSync(path, 'utf8')).not.toBe(before)

        restoreAfterAnInterruption('mutation/fixture')

        expect(readFileSync(path, 'utf8')).toBe(before)
      } finally {
        execFileSync('git', ['checkout', 'HEAD', '--', 'mutation/fixture'], { cwd: THE_REPOSITORY })
      }
    },
    META_TIMEOUT_MS,
  )

  /**
   * The same restore, on the half of this repository's state that is not a file. ADR-0102.
   *
   * **A registration is invisible to every refusal the instrument had.** `git status --porcelain` stays
   * empty, `.rebuilt/` is ignored, and `git checkout HEAD -- <contract>` puts back no part of
   * `.git/worktrees/` - so a cell that left one walked past `assertCleanTree` and reddened
   * `assertNoStrayWorktree` on the *next* battery, where the cause was six batteries behind.
   *
   * Both spellings of it are exercised, because they arrive by different routes and only the first is
   * what a mutant of this repository really produces: `I-56` of `registry-storage` removes the
   * deregistration and leaves the `rmSync` beside it, so the directory goes and the entry survives;
   * a run killed between the two leaves the directory as well. What is perturbed is a checkout really
   * registered against this repository, never a list of them handed to the teardown.
   */
  it(
    'a-checkout-a-cell-left-behind-is-deregistered :: git is put back beside the files',
    () => {
      const registered: string[] = []

      const register = (name: string): string => {
        const at = join(THE_REPOSITORY, THE_REBUILD_FOLDER, name)

        mkdirSync(join(THE_REPOSITORY, THE_REBUILD_FOLDER), { recursive: true })
        execFileSync('git', ['worktree', 'add', '--detach', '--quiet', at, 'HEAD'], {
          cwd: THE_REPOSITORY,
        })
        registered.push(at)

        return at
      }

      try {
        rmSync(register('a-cell-that-did-not-deregister'), { recursive: true, force: true })
        register('a-cell-that-never-reached-its-finally')

        expect(strayWorktrees()).toHaveLength(2)

        restoreAfterAnInterruption('mutation/fixture')

        expect(strayWorktrees()).toEqual([])
      } finally {
        // Only what this guard registered, never the folder holding it: `rebuild.ts` says why.
        for (const at of registered) rmSync(at, { recursive: true, force: true })
        execFileSync('git', ['worktree', 'prune'], { cwd: THE_REPOSITORY })
      }
    },
    META_TIMEOUT_MS,
  )

  /**
   * The wiring half. The four signals are listened for while the tree is mutated and are let go
   * afterwards, so an instrument that ran twice in one process would not accumulate handlers - and one
   * that installed none would leave the hole above open while looking exactly the same from outside.
   *
   * What no guard here can establish is that the operating system delivers the signal. Measured on
   * this platform rather than assumed: on Windows a signal sent programmatically to a child goes
   * through `TerminateProcess` and no handler runs at all, on three signals out of three. What Node
   * does deliver there is a real console Ctrl+C. On POSIX all four arrive. The chain stops at the
   * kernel, and it is written down rather than left for a reader to assume it closes.
   */
  it('listens for every catchable interruption, and stops listening afterwards', () => {
    const counted = (): number =>
      ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'].reduce(
        (total, signal) => total + process.listenerCount(signal),
        0,
      )

    const before = counted()
    const stopListening = restoringOnSignal('mutation/fixture')

    expect(counted()).toBe(before + 4)

    stopListening()

    expect(counted()).toBe(before)
  })

  it(
    'refuses to measure a working tree that is not what git says it is',
    () => {
      // Arms are git refs and the instrument materialises them by checking out over the working
      // tree, so measuring a dirty tree would both destroy the operator's uncommitted work and
      // measure an arm that is not the commit it claims to be.
      const path = join(THE_INSTRUMENT_FOLDER, 'fixture', 'reference.ts')

      try {
        writeFileSync(path, `${readFileSync(path, 'utf8')}\nexport const dirt = 1\n`)

        expect(() => calibrate(battery)).toThrow(/the working tree carries uncommitted changes/)
      } finally {
        execFileSync('git', ['checkout', 'HEAD', '--', 'mutation/fixture'], { cwd: THE_REPOSITORY })
      }
    },
    META_TIMEOUT_MS,
  )
})

/**
 * What is pinned rather than inherited from whoever invoked it.
 *
 * `Battery.timeZone` is the oldest part of this and carries the argument: an ambient property of the
 * machine, pinned because a verdict measured under whatever the operator's carries is not a verdict
 * anybody can reproduce. `../vitest-entry-point.ts` is the second, written after the ambient property
 * in question collapsed two replays - it carries the door and the measurement.
 *
 * **There are two routes into this repository's suites and both are guarded here.** The instrument
 * builds its own child command; every npm script goes through `../run-vitest.ts`. They share the
 * rule and neither restates it, so the guards below are not one claim written twice.
 *
 * None of the three can substitute for another. The first pins a rule the other two cannot see,
 * because `C:\users\...` was measured to collect the whole suite: a function that upper-cased the
 * entire path would keep every replay green while making a claim about segments whose spelling lives
 * on the disk. The second and third are the real condition on their own route, and nothing short of
 * a child process reaches either - the paths are resolved when the modules are imported, so a guard
 * in this process is measuring the invocation it is already inside.
 *
 * All three redden together on one edit that makes `withCanonicalDriveLetter` the identity -
 * measured, 3 failed and 29 passed - because all three sit downstream of one rule. That is the
 * exception to the rule stated at the head of this file, and it is recorded rather than glossed.
 *
 * What the third adds was measured on its own: an edit that leaves the rule alone and has
 * `run-vitest.ts` build its own path reddens the third and nothing else - 1 failed and 31 passed -
 * and the assertion prints the door verbatim, `TypeError: Cannot read properties of undefined
 * (reading 'config')`, under both of the fixture's files. **No edit was found that reddens the
 * second alone**, and that is written down rather than left to be assumed from the symmetry.
 */
describe('a verdict this instrument did not measure', () => {
  /**
   * A run measured what a run measured, and the two ways of learning nothing are told from a red run.
   *
   * **This is the guard for the trap, and the trap is the order of the terms.** `verdictOf` reads
   * `killed-by-typecheck` off an *absence* - red, with no guard named - and a run that was cut short
   * before it could write a report is red with no guard named. So a bound added without a verdict to
   * carry it would have turned every hanging cell into one more `killed-by-typecheck`, and the repair
   * would have measured nothing while looking finished.
   *
   * The three inputs are node's own, measured at `505fddb` rather than assumed: `ETIMEDOUT` for a run
   * past its bound, `ENOBUFS` for one past its buffer, and no code at all for an ordinary non-zero
   * exit. ADR-0162.
   */
  it('a-run-cut-short-is-told-from-a-run-that-reddened', () => {
    expect(whyARunMeasuredNothing('ETIMEDOUT')).toContain('did not finish')
    expect(whyARunMeasuredNothing('ENOBUFS')).toContain('printed more than')

    // An ordinary red carries no `code`, and neither does a spawn that failed for a reason this
    // instrument has no name for - both are left to be read as what the report says.
    expect(whyARunMeasuredNothing(undefined)).toBeNull()
    expect(whyARunMeasuredNothing('EACCES')).toBeNull()
  })

  /**
   * The absence is asked about before anything reads it as evidence.
   *
   * A run that measured nothing carries exactly the shape `killed-by-typecheck` is derived from - not
   * green, and no failed guard - so the two rows below differ in one field and must not answer the
   * same. Written as a pair rather than as one assertion, because what is at stake is the *order* of
   * the terms and a single row cannot show an order.
   */
  it('a-verdict-is-asked-of-the-absence-before-the-evidence', () => {
    const nothingLearned: SuiteRun = {
      green: false,
      failedGuards: [],
      testsSeen: null,
      guards: [],
      reportedFiles: {},
      notMeasured: 'the run did not finish',
    }

    expect(verdictOf(nothingLearned)).toBe('not-measured')
    expect(verdictOf({ ...nothingLearned, notMeasured: null })).toBe('killed-by-typecheck')

    // And the other two terms are unmoved by it, so the repair costs no verdict it did not owe.
    expect(verdictOf({ ...nothingLearned, notMeasured: null, green: true })).toBe('survived')
    expect(
      verdictOf({ ...nothingLearned, notMeasured: null, failedGuards: ['a-guard'] }),
    ).toBe('killed')
  })
})

describe('what is pinned rather than inherited', () => {
  it('only-the-drive-letter-is-pinned :: the rest of a path is left alone', () => {
    expect(withCanonicalDriveLetter('c:\\Users\\x\\toopo')).toBe('C:\\Users\\x\\toopo')
    expect(withCanonicalDriveLetter('c:/Users/x/toopo')).toBe('C:/Users/x/toopo')
    expect(withCanonicalDriveLetter('C:\\Users\\x\\toopo')).toBe('C:\\Users\\x\\toopo')
    expect(withCanonicalDriveLetter('/home/x/toopo')).toBe('/home/x/toopo')
    expect(withCanonicalDriveLetter('c:\\users\\x')).toBe('C:\\users\\x')
  })

  it(
    'a-battery-invoked-under-a-lower-case-drive-letter-collects-its-suite',
    () => {
      /**
       * The instrument invoked exactly as a launcher that does not normalise invokes it: by an
       * absolute path whose drive letter is lower-case, from a shell whose own directory is not.
       * Before `paths.ts` this collapsed every time - the fixture's control reported `RED (0 tests)`
       * and calibration refused on the census, naming both of the fixture's files.
       *
       * It writes `mutation/results/fixture.json`. That is a complete measurement of this battery at
       * this commit, which is exactly what a replay writes there, so it can neither poison a total
       * nor stand in for one.
       *
       * On a platform with no drive letter the spelling below is unchanged and this reduces to
       * running the fixture battery. That is stated rather than guarded around: the door it is
       * written for cannot exist there.
       *
       * **This is the green direction and it is half of a pair.** `expect(done.status).toBe(0)` on a
       * battery pinned green cannot fail when the exit code stops carrying a failure, which is the
       * whole of what both gates read. The two guards below are the other half.
       */
      const asALauncherWould = join(THE_INSTRUMENT_FOLDER, 'measure.ts').replace(
        /^[A-Z]:/,
        (letter) => letter.toLowerCase(),
      )

      const done = spawnSync(process.execPath, [asALauncherWould, 'fixture'], {
        cwd: THE_REPOSITORY,
        encoding: 'utf8',
      })
      const output = `${done.stdout}${done.stderr}`

      expect(output).toContain('control green (3 tests)')
      expect(output).toContain('every cell agrees with the verdict this battery pins for it')
      expect(done.status).toBe(0)
    },
    META_TIMEOUT_MS,
  )

  /**
   * The fixture, with one thing about it made untrue, run through `measure.ts` as a battery of its own.
   *
   * **A battery declaration has to be on disk for this, and that is why the red direction was never
   * written.** `measure.ts` resolves its battery through `./<name>.battery.ts` and `calibrate` refuses
   * a working tree carrying uncommitted changes, so a disagreement cannot be arranged by editing
   * anything tracked. What it can be arranged by is a file git was never told about:
   * `assertCleanTree` reads `--untracked-files=no`, so an untracked declaration leaves the tree clean
   * to every check that matters and is gone before the guard returns.
   *
   * **A leftover announces itself rather than rotting.** If this process dies between the write and
   * the removal, `every-battery-of-this-folder-is-published` reads the directory and reddens on a name
   * beginning `throwaway-`. That is the direction to fail in, and it is why the names are spelled the
   * way they are.
   *
   * Running beside another reader of this folder would be a race; the meta suite sets
   * `fileParallelism: false` for a measured reason of its own, and the directory guard is in this
   * file, which runs its guards in order.
   */
  const theFixtureExcept = (name: string, override: string): string =>
    `import { battery as theFixture } from './fixture.battery.ts'\n\n` +
    `export const battery = { ...theFixture, name: '${name}', ${override} }\n`

  const measuring = (
    name: string,
    override: string,
    ...flags: readonly string[]
  ): { output: string; status: number | null } => {
    const declaration = join(THE_INSTRUMENT_FOLDER, `${name}.battery.ts`)
    const results = join(THE_INSTRUMENT_FOLDER, 'results')

    try {
      writeFileSync(declaration, theFixtureExcept(name, override))

      const done = spawnSync(
        process.execPath,
        [join(THE_INSTRUMENT_FOLDER, 'measure.ts'), name, ...flags],
        { cwd: THE_REPOSITORY, encoding: 'utf8' },
      )

      return { output: `${done.stdout}${done.stderr}`, status: done.status }
    } finally {
      rmSync(declaration, { force: true })
      // Both spellings, because a filtered run writes the second and a complete one the first.
      rmSync(join(results, `${name}.json`), { force: true })
      rmSync(join(results, `${name}.partial.json`), { force: true })
    }
  }

  /**
   * The first of the two terms the exit code is built from. `FX-2` is an equivalent mutant - it adds
   * the value to itself instead of doubling it - so it survives, and pinning it `killed` is a battery
   * claiming a catch that did not happen.
   *
   * Seen red by writing `process.exitCode = 0` in place of the line under measurement, which is what
   * both gates would then read on every battery of a push.
   */
  it(
    'a-cell-disagreeing-with-its-pin-reaches-the-exit-code',
    () => {
      const { output, status } = measuring(
        'throwaway-a-cell-that-disagrees',
        `mutants: theFixture.mutants.map((mutant) => mutant.id === 'FX-2' ? ` +
          `{ ...mutant, expected: { 'C/as-committed': { verdict: 'killed' } } } : mutant)`,
      )

      expect(output).toContain('cell(s) disagree with the battery')
      expect(status).not.toBe(0)
    },
    META_TIMEOUT_MS,
  )

  /**
   * The neighbour of the guard above, and it is the term that guard cannot reach. A run whose every
   * cell agrees still fails when a guard of the suite is silent and the battery accounts for it
   * nowhere - which is the half of `measure.ts` that only a complete run computes, and the half a
   * reading of `cellsDisagree` alone would leave unwatched.
   *
   * `DOUBLES_ZERO` is reddened by neither of the fixture's mutants and is declared under
   * `unprobedRegions` for exactly that reason. Taking the declaration away leaves the silence and
   * removes the account of it, so every cell agrees and the battery does not.
   *
   * Seen red by dropping `|| disagreements.length > 0` from the exit code, which leaves this guard's
   * sentence printed and the process exiting 0 - the defect this pair exists for, and one no battery
   * of the twenty-one can witness, because a battery cannot read its own exit code.
   */
  it(
    'a-guard-disagreeing-with-its-battery-reaches-the-exit-code',
    () => {
      const { output, status } = measuring(
        'throwaway-a-guard-nothing-accounts-for',
        'unprobedRegions: []',
      )

      expect(output).toContain('every cell agrees with the verdict this battery pins for it')
      expect(output).toContain('guard(s) disagree with the battery')
      expect(status).not.toBe(0)
    },
    META_TIMEOUT_MS,
  )

  /**
   * The third exit code, and it was found by the two guards above failing to redden a perturbation of
   * it. `measure.ts` sets its status in two places: a complete run reads both terms, and a filtered
   * one reads only the cells, because attribution over `--only` would report a coverage hole that is
   * an artefact of the command line.
   *
   * **Neither gate ever takes this branch** - `suites.yml` runs `npm run battery <name>` with no
   * filter - so this guard is written for the person at a keyboard, who is the reader most likely to
   * believe a green run of the one cell they were investigating.
   *
   * Seen red by writing `process.exitCode = 0` in the filtered branch, which leaves the two guards
   * above green: that is the measurement that says this is a third claim and not a restatement.
   */
  it(
    'a-filtered-run-carries-a-cell-disagreement-into-the-exit-code-too',
    () => {
      const { output, status } = measuring(
        'throwaway-a-filtered-run-that-disagrees',
        `mutants: theFixture.mutants.map((mutant) => mutant.id === 'FX-2' ? ` +
          `{ ...mutant, expected: { 'C/as-committed': { verdict: 'killed' } } } : mutant)`,
        '--only=FX-2',
      )

      expect(output).toContain('this run was filtered')
      expect(output).toContain('cell(s) disagree with the battery')
      expect(status).not.toBe(0)
    },
    META_TIMEOUT_MS,
  )

  /**
   * The reporter's own decoration, removed before its summary is read.
   *
   * The guard below reads a count out of vitest's human output, and that output is decorated on some
   * machines and not on others: it was green here and **red on a Linux runner**, where ANSI codes sit
   * between `Tests` and the count and `\s+` therefore matches nothing.
   *
   * **What turns the decoration on is not established, and this comment does not name a cause it did
   * not measure.** It is none of `CI`, `FORCE_COLOR`, `TERM`, `GITHUB_ACTIONS` or a `--color` argument:
   * each was set here in turn and the captured stream carried no escape at all, so no reproduction of
   * the runner's state exists on this platform. Configuring the child against a switch nobody has found
   * would be a repair aimed at a guess.
   *
   * So the guard is made independent of the decoration instead. What it is about is how many tests the
   * launcher collected, and that is the same number whichever colour it arrives in - which is also why
   * this is not a weakening: nothing the assertion establishes is carried by an escape code.
   *
   * Its neighbour above is deliberately left alone. That one reads strings the instrument itself
   * writes with `process.stdout.write`, it was green on the same runner, and widening a repair to a
   * place with no defect is how a mechanism stops being about anything.
   */
  const undecorated = (text: string): string => text.replaceAll(/\u001b\[[0-9;]*m/g, '')

  it(
    'the-launcher-invoked-under-a-lower-case-drive-letter-collects-its-suite',
    () => {
      /**
       * The route a stranger takes, invoked exactly as a launcher that does not normalise invokes
       * it. `npm run <suite>` used to reach vitest through `node_modules/.bin`, whose shim derives
       * the entry point from wherever PATH found it, and an ordinary `npm run site` was seen
       * collapsing that way. This is that invocation with the shim's spelling forced rather than
       * waited for.
       *
       * The fixture's configuration is what it collects, because it is the cheapest suite in the
       * repository - measured at 153 ms - and because the door is about collection rather than about
       * what is collected. How many guards that suite has is read off the census instead of written
       * here, so that a fixture gaining a test moves one number and does not redden a guard about
       * drive letters.
       *
       * On a platform with no drive letter the spelling below is unchanged and this reduces to
       * running the fixture suite, exactly as its neighbour does.
       */
      const asALauncherWould = join(THE_REPOSITORY, 'run-vitest.ts').replace(
        /^[A-Z]:/,
        (letter) => letter.toLowerCase(),
      )

      const config = battery.vitestConfig
      if (config === undefined) throw new Error('the fixture battery names no configuration')

      const collected = Object.values(censusFor(config, battery.contractPath)).reduce(
        (total, guards) => total + guards,
        0,
      )

      const done = spawnSync(process.execPath, [asALauncherWould, 'run', '--config', config], {
        cwd: THE_REPOSITORY,
        encoding: 'utf8',
      })
      const output = undecorated(`${done.stdout}${done.stderr}`)

      expect(output).toMatch(new RegExp(`Tests\\s+${collected} passed \\(${collected}\\)`))
      expect(done.status).toBe(0)
    },
    META_TIMEOUT_MS,
  )
})

/**
 * What the site publishes about this instrument, and the two ways it could publish it wrongly.
 *
 * `published.ts` is imported by a generator that must not touch a disk, so it lists the batteries
 * instead of reading the directory - a second statement of what `mutation/*.battery.ts` already says.
 * These guards are the first statement's answer to it, and they are here rather than in `packages/site/`
 * because what they keep is a property of this folder.
 */
describe('what this repository publishes about its own defect detection', () => {
  /**
   * A battery written and not listed makes every published figure smaller, with nothing anywhere
   * saying so - `scoreFaults`'s *silently be a total of the other batteries*, arriving through the
   * one door that check cannot see, because that one reads the directory and this list does not.
   */
  it('every-battery-of-this-folder-is-published', () => {
    const onDisk = readdirSync(THE_INSTRUMENT_FOLDER)
      .filter((file) => file.endsWith('.battery.ts'))
      .map((file) => file.replace(/\.battery\.ts$/, ''))
      .sort()

    expect([...THE_BATTERIES].map((one) => one.name).sort()).toEqual(onDisk)
  })

  /**
   * Two cells of one battery answering to one address, which `calibrate()` refuses for a guard and
   * nothing refused for a mutant.
   *
   * **It was found by writing a cell rather than by looking**: `registry-storage` carried `I-35` twice
   * - the edge that reads its digest off the artefact, and the runtime floor - and had done since the
   * publication unit. A mutant identifier is an address like any other: a pin cites it, a result file
   * is keyed by it, and an attribution report puts it in front of whoever is reading a disagreement.
   * Two cells under one name make a report that names a cell nobody can find, which is the class this
   * repository spends its length removing from its prose.
   *
   * Here rather than in `calibrate()` because it needs no run: it is a fact about the declarations, so
   * it is answered in the seconds a suite costs rather than in the minutes a battery does - the
   * division `every-clean-refusal-resolves-to-the-guard-it-names` already draws between a suite guard
   * over what a module declares and a pre-flight over what a run collected.
   */
  it('no-two-cells-of-one-battery-answer-to-one-address', () => {
    expect(
      THE_BATTERIES.flatMap((battery) => {
        const ids = battery.mutants.map((mutant) => mutant.id)

        return [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))].map(
          (id) => `${battery.name} declares ${id} more than once`,
        )
      }),
    ).toEqual([])
  })

  /**
   * A survivor with no nature and no lens to explain it is the cell that gets published as a hole
   * nobody argued about, which is the one reading of these figures that is both wrong and worse than
   * the truth.
   */
  it('every-survivor-is-accounted-for-by-a-nature-or-by-a-lens', () => {
    expect(survivorFaults(THE_BATTERIES)).toEqual([])
  })

  /**
   * A cell whose defect one family of platforms cannot have is not measured off that family.
   *
   * The resolution is asked of the same function a run asks, which is what makes this a guard over the
   * rule rather than over a second statement of it: `measureCell` skips exactly what `expectedHere`
   * calls `not-applicable`, so a cell can never be measured here and judged by another platform's pin.
   */
  it('a-cell-the-platform-decides-is-not-measured-off-its-family', () => {
    const pinned = onlyOn('windows', 'because a held file cannot be unlinked there', killed(['g']))

    expect(expectedHere(pinned, 'windows')).toEqual(pinned)
    expect(expectedHere(pinned, 'posix')).toEqual({ verdict: 'not-applicable' })
  })

  /**
   * Every such cell says why, and the sentence is the battery's own.
   *
   * **A cell whose two answers differ and which does not say why is a pin nobody can check**, and it
   * is the shape somebody reaches for to silence a red they have not understood. Total over the
   * batteries, so a second one entering the catalogue is held to the same thing with nobody editing
   * this.
   */
  it('every-cell-the-platform-decides-says-why-the-defect-is-not-there', () => {
    const mute = THE_BATTERIES.flatMap((one) =>
      one.mutants.flatMap((mutant) =>
        Object.entries(mutant.expected)
          .filter(([, pinned]) => pinned.onlyOn !== undefined && pinned.onlyOn.because.trim() === '')
          .map(([cell]) => `${one.name}: ${mutant.id} on ${cell} names a platform and no reason`),
      ),
    )

    expect(mute).toEqual([])
  })

  /**
   * A count may not claim such a cell as caught everywhere without publishing that it is not.
   *
   * **This is the figure's coordinate and not a footnote to it.** `populationOf` reads the pin as
   * written, so `C-64` is one of the 691 on every machine - which is right, because *caught* means
   * caught wherever the defect exists. What would make that reading false is the cell being counted
   * and named nowhere, and this is what forbids it.
   */
  it('every-cell-the-platform-decides-is-published-beside-the-count-it-enters', () => {
    const measured = theMeasurement()
    const named = new Set(measured.whereThePlatformDecides.map((one) => `${one.mutant} ${one.cell}`))

    const unpublished = THE_BATTERIES.flatMap((one) =>
      one.mutants.flatMap((mutant) =>
        Object.entries(mutant.expected)
          .filter(([cell, pinned]) => pinned.onlyOn !== undefined && !named.has(`${mutant.id} ${cell}`))
          .map(([cell]) => `${one.name}: ${mutant.id} on ${cell} is counted and named nowhere`),
      ),
    )

    expect(unpublished).toEqual([])
  })

  it('a-survivor-with-no-nature-and-no-blinded-lens-is-refused', () => {
    const { sameOnEveryLens } = mutantsOn({ arm: 'C', asCommitted: 'as-committed', blinded: [] })
    const unaccounted: Battery = {
      ...battery,
      mutants: [
        sameOnEveryLens(
          'FX-M9',
          'survives on the column that reads the contract as committed, and says nothing about why',
          [reference(DOUBLED, `export const doubled = (value: number): number => value + value`)],
          survivesOnlyBlinded,
        ),
      ],
    }

    expect(survivorFaults([unaccounted])).toEqual([
      'fixture: FX-M9 on C/as-committed survives, declares no nature, and is not explained by a ' +
        'lens - so it would be published as a hole nobody argued about',
    ])
  })

  /**
   * Every cell the page lists as surviving is a cell the batteries pin as surviving.
   *
   * **The obvious guard here was written first and could not fail, which is why this one is a second
   * walk rather than an arithmetic identity.** `killed + surviving === cells` is preserved by any
   * defect that moves a cell from one column to the other: measured, counting only `killed` as a kill
   * files every `killed-by-typecheck` cell as a survivor, and the sum stays right - so the page would
   * publish a longer list of survivors and the identity would agree. What cannot be preserved is the
   * verdict each listed cell actually carries, and reading it off the batteries again is the only
   * thing that checks it.
   *
   * The sum is kept beside it, because it catches the other half - a cell counted in neither column,
   * or in both - which the walk does not see.
   */
  it('every-cell-published-as-surviving-is-pinned-as-surviving', () => {
    const measured = theMeasurement()
    const pinned = new Set(
      THE_BATTERIES.flatMap((one) =>
        one.mutants.flatMap((mutant) =>
          Object.entries(mutant.expected)
            .filter(([, expectation]) => expectation.verdict === 'survived')
            .map(([cell]) => `${one.name} ${mutant.id} ${cell}`),
        ),
      ),
    )

    for (const population of [measured.defects, measured.probes]) {
      expect(
        population.surviving
          .map((one) => `${one.battery} ${one.mutant} ${one.cell}`)
          .filter((address) => !pinned.has(address)),
      ).toEqual([])
      expect(population.killed + population.surviving.length).toBe(population.cells)
    }

    expect(measured.defects.surviving.length + measured.probes.surviving.length).toBe(pinned.size)
  })
})
