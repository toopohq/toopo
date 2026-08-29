import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { edgeCases } from '../contracts/typescript/string/slugify/edge-cases.ts'
import { proposeDirectory } from '../packages/cli/configuration.ts'
import type { ContractRecord } from '../packages/registry/contract-record.ts'
import { THE_INVOCATION, renderContract } from '../packages/registry/address.ts'
import { THE_CURRENT_BANNER, licenceHeaderOf } from '../packages/registry/licence.ts'
import type { ContractSource } from '../packages/registry/serialise.ts'
import { THE_SUITES, guardsCollectedIn } from './decisions.ts'
import {
  installableContracts,
  rootDocument,
  theCatalogueRecordIn,
  theCatalogueRecords,
  theCatalogueSourceIn,
  theSectionOn,
} from './root-documents.ts'
import {
  CAUGHT_MEANS_WHERE_THE_DEFECT_EXISTS,
  THE_PINS_ARE_AN_ASSERTION,
  WHAT_A_SURVIVOR_MEANS_TO_A_READER,
  survivorsByKind,
  theMeasurement,
} from './published.ts'

/**
 * Everything the front of this repository shows of itself, resolved against what produced it.
 *
 * `README.md` is the first thing a stranger reads and the last thing anybody edits. It cannot compute
 * anything - it is Markdown, and generating it would put the project's opening sentence behind a
 * build step no reader can see - so every number in it is a transcription, and this is what stops a
 * transcription from becoming the false half of a true page.
 *
 * **It is the same guard the method page carries, aimed the other way.** There, every figure is
 * computed and a guard requires each run of digits a reader can see to occur in the data. Here the
 * figures are written and a guard requires each to equal what the data says. Both fail on the same
 * event - the thing measured moving while the prose does not - and this one is the cheaper half,
 * because a README carries a handful of figures and a page carries forty.
 *
 * **The two blocks below are two upstreams, and the second arrived with a false figure already on the
 * page.** The instrument produces the mutation figures; the catalogue produces the contract counts,
 * the answers the demonstration prints and the addresses it names. Nothing had ever aimed anything at
 * the second, so the page could publish a count of the whole catalogue as a count of what a reader can
 * install - which is what it did, for a year. ADR-0113.
 *
 * The limit is the method page's own, stated rather than discovered: **a literal equal to today's
 * value passes today.** It goes red on the day the measurement moves, which is the day it would
 * otherwise start lying, and that is the whole of what it promises.
 */

/**
 * The README as one line, because where a paragraph wraps is not a fact about anything asserted here.
 *
 * The claims below used to carry the break the file happened to hold - `are\nequivalent mutants` - so
 * a guard about the instrument went red on a re-flow and the expectation had to be re-transcribed to
 * match a layout. Collapsing runs of whitespace makes a claim the sentence rather than the sentence
 * plus its column width, and it is what makes a transcription longer than one line checkable at all.
 */
const readmeSource = (): string => rootDocument('README.md')

const README = (): string => readmeSource().replace(/\s+/g, ' ')

/**
 * Every line of every fenced block, which is where the page shows rather than describes.
 *
 * Two guards read it and they read it for different things - what a reader is told to type, and
 * what a contract's folder holds - so it is named for what it returns rather than for either.
 */
const everyFencedLine = (): readonly string[] =>
  [...readmeSource().matchAll(/```[a-z]*\n([\s\S]*?)```/g)].flatMap((block) =>
    (block[1] as string).split('\n'),
  )

/**
 * The section describing an install, named once so a retitling moves one line.
 *
 * The three guards keyed to it refuse an empty section, so retitling the heading reddens them rather
 * than quietly emptying their subject.
 */
const WHAT_LANDS = 'What lands in your project'

/** That section of this page, which is the paragraph those three read. */
const whatLands = (): string => theSectionOn('README.md', WHAT_LANDS)

describe('what the readme publishes about the measurement', () => {
  /**
   * Every figure, against the value the instrument declares for it.
   *
   * Written as a table of claim and value rather than as five assertions, so that the guard names
   * which figure drifted instead of failing on the first one.
   */
  it('every-figure-in-the-readme-is-the-one-the-instrument-declares', () => {
    const measured = theMeasurement()
    const byKind = survivorsByKind(measured.defects)
    const text = README()

    const claims = [
      `${measured.batteries} mutation batteries`,
      `**${measured.defects.cells} deliberate defects**`,
      `**${measured.defects.killed} are caught.**`,
      `The ${measured.defects.surviving.length} that survive`,
      `all ${measured.defects.cells} cells`,
      `${byKind.equivalent} are equivalent mutants`,
      `${byKind['outside-what-the-contract-specifies']} are behaviour the contract declines to specify`,
      `${byKind['unreachable-on-this-catalogue']} are unreachable on this`,
      `${byKind['only-where-a-lens-blinded-the-suite']} exist only where a lens`,
      // The ninth, and it used to be the one figure of this paragraph nobody derived: the split's last
      // term was asserted as the literal `exactly one is a debt` while the eight beside it were read
      // off the instrument. It went from one to three with nothing saying so. ADR-0145.
      `${byKind['a-declared-open-class']} are a limit this repository declares`,
      // The tenth, and the only one of the split that is a hole and stays one. It carries no line
      // break, for the reason the ninth stopped carrying one: where a sentence wraps is not a fact
      // about the measurement. ADR-0161.
      `${byKind['its-witness-is-frozen-out']} are a real defect whose witness is frozen out`,
    ]

    expect(claims.filter((claim) => !text.includes(claim))).toEqual([])
  })

  /**
   * And the count says what *caught* means where a defect does not exist on every machine.
   *
   * **`691 are caught` is a figure with a coordinate, and this is the coordinate.** Every number above
   * is derived from the pins as written, so it is the same object on any platform - but one of those
   * cells is caught only where its defect can occur, and a count that did not say so would be a
   * platform's number published bare. That is ADR-0018 arriving on the measurement this whole project
   * rests on, which is where it costs most.
   *
   * Two halves, and neither carries the other. The sentence is transcribed rather than reworded, on
   * the treatment `THE_PINS_ARE_AN_ASSERTION` already gets one guard below. And **every such cell is
   * named**, so the page cannot go on carrying one sentence while the instrument grows a second cell -
   * which would be a rank nobody rebuilds, refused here the way it is refused everywhere else.
   */
  it('the-readme-says-what-caught-means-where-a-defect-is-not-everywhere', () => {
    const text = README()

    expect(text).toContain(CAUGHT_MEANS_WHERE_THE_DEFECT_EXISTS)

    const unnamed = theMeasurement()
      .whereThePlatformDecides.filter((one) => !text.includes(`${one.battery} · ${one.mutant}`))
      .map((one) => `${one.battery} · ${one.mutant}`)

    expect(unnamed).toEqual([])
  })

  /**
   * And the page says what kind of thing those figures are, in the instrument's own words.
   *
   * **The guard above establishes that the numbers are right and nothing establishes what they are.**
   * A reader who has run nothing holds an assertion; the figures and an observation of them coincide,
   * because a replay disagreeing with a pin fails the run, and coinciding is not being the same
   * object. The methodology page has carried that distinction since it existed. The README - the
   * surface a stranger meets first, and the one that says *verify it yourself* - carried the drift
   * guarantee and stopped there, which reads as a report of what was run.
   *
   * So it transcribes `THE_PINS_ARE_AN_ASSERTION` rather than a second wording of it: the sentence is
   * already exported for the page to render, and two spellings of one admission are two things that
   * can come apart, on the one claim where being caught overstating would cost most.
   */
  it('the-readme-says-its-figures-are-an-assertion-and-not-an-observation', () => {
    expect(README()).toContain(THE_PINS_ARE_AN_ASSERTION)
  })

  /**
   * The aggregate is never published without the split, which is `published.ts`'s own rule arriving
   * on the one surface it cannot reach by construction.
   *
   * That module refuses to export a survivor total alone, so no page can accidentally render one.
   * Markdown is outside that reach: a README can write any number it likes. What it may not do is
   * write the total and stop, because a count of survivors read alone is a count of holes - and four
   * of the five kinds are not holes at all.
   */
  /**
   * Every command this page tells a reader to type carries the invocation the code declares.
   *
   * **The defect it exists against was published and was met by a reader rather than by a guard.**
   * The page printed `toopo add string/slugify`, which answers `command not found` for anybody who has
   * installed nothing - the first thing a visitor does, and it failed. `THE_INVOCATION` is the one
   * spelling measured to work in all three situations, and nothing here kept the page rendering it.
   *
   * **A shell fence is what makes a line an instruction, and that is the whole of the rule.** Inside
   * one, a word is something a reader pastes into a terminal. In prose it names the command instead -
   * the licence section says what `toopo add` copies, and prefixing that would be describing a shell
   * where the sentence is about a licence. So the sweep is over the fenced blocks and deliberately not
   * over the page, which is the same division `packages/cli/breakage.ts` gets for the same reason.
   *
   * The second expectation is what stops the first being vacuous: a negative alone is satisfied by a
   * page with no commands on it at all.
   */
  it('every-command-the-readme-tells-a-reader-to-type-carries-the-invocation', () => {
    const typed = everyFencedLine()

    expect(typed.filter((line) => /^\s*toopo\b/.test(line))).toEqual([])
    expect(typed.filter((line) => line.trim().startsWith(THE_INVOCATION))).not.toEqual([])
  })

  it('the-readme-never-gives-a-survivor-total-without-its-split', () => {
    const text = README()
    // Total over the five, where it used to except `a-declared-open-class` so that the README could
    // spell that one in words. It is a count like the other four now, and the exception went with the
    // sentence that needed it. ADR-0145.
    const named = Object.keys(WHAT_A_SURVIVOR_MEANS_TO_A_READER)
    const counted = survivorsByKind(theMeasurement().defects)

    expect(named.filter((why) => !text.includes(String(counted[why as keyof typeof counted])))).toEqual(
      [],
    )
  })
})

/**
 * The contract the README demonstrates, and the row it quotes to say what a contract is. ADR-0113.
 *
 * `string/slugify@1` is named here and nowhere else in this file, so the day the page demonstrates a
 * different one this is the single line that moves.
 */
const DEMONSTRATED = 'string-slugify'


/**
 * A file of a contract's folder, as the page lists one: a bare name at the head of a line.
 *
 * The token is taken up to the first space rather than by a whitespace class, and the dot is a class
 * rather than an escape, so that the shape a reader has to check is the shape written here.
 */
const A_FILE_OF_A_CONTRACT = /^[a-z0-9-]+[.][a-z0-9.-]*ts$/

const whatTheReadmeSaysAContractHolds = (): readonly string[] =>
  everyFencedLine()
    .map((line) => line.trim().split(' ')[0] ?? '')
    .filter((token) => A_FILE_OF_A_CONTRACT.test(token))

/** The record of the contract the page opens, through the folder its battery already names. */
const theContractShown = (): ContractRecord | undefined =>
  theCatalogueRecordIn(THE_SUITES[DEMONSTRATED] as string)

/** The row the page quotes whole, and the two guards below that read it are why it is named once. */
const QUOTED = 'cyrillic-is-kept'

/**
 * As much of a rationale as the page shows before its ellipsis.
 *
 * A README quoting three hundred characters of argument would be quoting the contract instead of
 * pointing at it, and truncating without a mechanism is how a quotation becomes a paraphrase nobody
 * checked. So the page shows one sentence and this is what says which sentence that is.
 */
const firstSentenceOf = (rationale: string): string =>
  rationale.slice(0, rationale.indexOf('. ') + 1)

describe('what the readme shows of the catalogue', () => {
  /**
   * The two figures the page gives about the catalogue, against the records the registry would serve.
   *
   * **They were wrong when this guard was written, which is the whole argument for it.** The page said
   * *the four installable contracts settle 187 named edge cases*; 187 is the total over all five, and
   * the four settle 157 - a figure `packages/site/read-literal.test.ts` had already published in as many
   * words, one folder away, for a year. Nothing connected the two, because the guard above this one
   * resolves the instrument's figures and the catalogue is a second upstream nobody had aimed anything
   * at.
   *
   * The counts are derived and never transcribed, so `1 refused` is arithmetic over the lifecycles
   * rather than a word: a sixth contract, or a fifth published, reddens this without anybody counting.
   */
  it('every-figure-the-readme-gives-about-the-catalogue-is-one-the-contracts-declare', () => {
    const held = theCatalogueRecords()
    const installable = held.filter((record) => record.lifecycle.state === 'published')
    const refused = held.filter((record) => record.lifecycle.state !== 'published')
    const cases = installable.reduce(
      (total, record) => total + record.caseTables.reduce((count, table) => count + table.cases.length, 0),
      0,
    )
    const text = README()

    const claims = [
      `**${held.length} contracts, ${installable.length} of them installable and ${refused.length} refused.**`,
      /**
       * The count and the total in one claim, because they were two statements and only one of them
       * was derived.
       *
       * The page read *the **six** installable contracts settle **237 named edge cases***: a word
       * beside a figure, the figure guarded here and the word typed. A publication makes the word
       * false and leaves every guard green, which is the half-false sentence this file exists to
       * refuse. It is a digit now, for the reason `countOf` renders one - this repository has no
       * spelling of a number anywhere, and adding one would be a second statement free to drift.
       */
      `the ${installable.length} installable contracts settle **${cases} named edge cases**`,
    ]

    expect(claims.filter((claim) => !text.includes(claim))).toEqual([])
  })

  /**
   * And the table beside those figures names every contract there is.
   *
   * A count and a list are two claims, and the count is the one that stays true while the list rots: a
   * sixth contract admitted tomorrow reddens the guard above by arithmetic, and this is what stops the
   * repair being to edit the number and leave the table at five.
   */
  it('every-contract-the-catalogue-holds-is-named-on-the-readme', () => {
    const text = README()
    const named = theCatalogueRecords().map((record) => renderContract(record.address))

    expect(named.filter((address) => !text.includes(`\`${address}\``))).toEqual([])
  })

  /**
   * Every file the page says a contract's folder holds, against the files the contract declares.
   *
   * **This is the block a reader learns the product from**, and it is the one claim on the page that no
   * competitor can make: seven files arrive, one of them is the implementation and six are the
   * verification, and all seven are readable before anything is installed. A page that got the list
   * wrong would be miscounting the thing it exists to sell.
   *
   * Both directions, because each fails on a different edit. A file renamed in the contract reddens the
   * first; a file dropped from the page reddens the second - and the second is the one that matters,
   * since the cheapest way to keep a list true is to stop listing. The names are read off `harness`
   * rather than off the source's declaration, on `theCatalogueRecords`' own rule: what a document shows
   * of a contract is what the registry would serve of it.
   *
   * `expect(held)` is what stops both filters being vacuous on a catalogue this could not resolve.
   */
  it('every-file-the-readme-says-a-contract-holds-is-one-the-contract-declares', () => {
    const held = (theContractShown()?.harness ?? []).map((file) => file.path)
    const shown = whatTheReadmeSaysAContractHolds()

    expect(held).not.toEqual([])
    expect(shown.filter((name) => !held.includes(name))).toEqual([])
    expect(held.filter((name) => !shown.includes(name))).toEqual([])
  })

  /**
   * And the row the page quotes to show what a contract is carries the fields the contract gives it.
   *
   * Every field is read off the row rather than written here, so the block on the page is a quotation
   * and not a drawing of one. What it cannot establish is that the *shape* is right - a field the
   * contract carries and the page leaves out is invisible here - and that fails in the safe direction:
   * the page under-quotes rather than inventing.
   */
  it('every-field-the-readme-quotes-from-a-case-is-the-one-the-contract-declares', () => {
    const row = edgeCases.find((entry) => entry.id === QUOTED)
    const text = README()

    expect(row).toBeDefined()

    const claims = [
      `id: '${row?.id}'`,
      `group: '${row?.group}'`,
      `text: '${row?.text}'`,
      `expected: '${row?.expected}'`,
      `provenance: '${row?.provenance}'`,
      firstSentenceOf(row?.rationale ?? ''),
    ]

    expect(claims.filter((claim) => !text.includes(claim))).toEqual([])
  })

  /**
   * Every property the page names by its identifier is one the contract's suite collects.
   *
   * An address printed on the front page and resolving nowhere is this repository's own recurring
   * defect, and the README had never carried an address before this unit. Both directions are asked:
   * a guard renamed in the contract reddens the first expectation, and a property dropped from the page
   * reddens the second - which is what keeps this list about the page rather than about itself.
   */
  it('every-property-the-readme-names-is-one-the-contracts-suite-collects', () => {
    const named = ['p2-idempotence', 'p8-one-separator-per-gap']
    const collected = guardsCollectedIn(THE_SUITES[DEMONSTRATED] as string)
    const text = README()

    expect(named.filter((guard) => !collected.has(guard))).toEqual([])
    expect(named.filter((guard) => !text.includes(`\`${guard}\``))).toEqual([])
  })

  /**
   * The two lines the page shows at the head of an installed file are the two the installer writes.
   *
   * Byte for byte against `licenceHeaderOf`, which is the same comparison
   * `every-file-the-installer-copies-is-marked-mit-0` already makes over the five copied files - so the
   * page is held to the mechanism rather than to a transcription somebody checked once. A header is
   * frozen into other people's repositories for ever, and a front page showing a different one would be
   * advertising an address that no installed file carries.
   *
   * Read off the raw source and not the collapsed text: the header is two lines, and what makes the
   * quotation worth anything is that the break between them is where the installer puts it.
   */
  it('the-header-the-readme-shows-is-the-one-the-installer-writes', () => {
    const shown = theCatalogueSourceIn(THE_SUITES[DEMONSTRATED] as string)

    expect(shown).toBeDefined()
    expect(readmeSource()).toContain(
      licenceHeaderOf((shown as ContractSource).address, (shown as ContractSource).banner),
    )
  })

  /**
   * And the page says that the header it shows is one of two forms, on a contract a reader can check.
   *
   * **The guard above is satisfied by a true quotation of a particular, and that is what went wrong.**
   * The page showed `string/slugify@1`'s two lines under *all it asks of you* - true of that file,
   * and read as the deal on offer. Measured from npm against the live origin: `toopo add
   * object/deep-equal` writes `// SPDX-License-Identifier: MIT-0` with no copyright line at all, so a
   * reader installing the seventh contract received a second line the front page had never shown.
   *
   * **What is asked here is not that the page shows both forms.** It is that the page says a second
   * form exists, that the form it does not show is the one written today, and that it names a contract
   * carrying that form which a reader can actually install - so the claim is one they can refute in a
   * terminal rather than one they take from us. The count of forms is asked too, because the sentence
   * says *the older of two* and a third would leave it describing a catalogue this repository no
   * longer has.
   *
   * Scoped to the section: the catalogue table names every contract of the catalogue, so a guard
   * asking whether the page names one carrying the other form is answered by that table with this
   * sentence deleted - the shape ADR-0130 records. ADR-0159, ADR-0167, ADR-0172.
   */
  it('the-readme-names-the-banner-form-it-does-not-show-and-a-contract-that-carries-it', () => {
    const shown = theCatalogueSourceIn(THE_SUITES[DEMONSTRATED] as string) as ContractSource
    const section = whatLands()
    const installable = installableContracts()
    const carryingTheOther = installable.filter(
      (source) => source.banner === THE_CURRENT_BANNER && source.banner !== shown.banner,
    )

    expect(section).not.toBe('')
    // Total over what a reader can receive rather than a count of two: the page shows one form and
    // names one, so a third on any installable contract is a header nothing on the page accounts for.
    expect(
      [...new Set(installable.map((source) => source.banner))].filter(
        (banner) => banner !== shown.banner && banner !== THE_CURRENT_BANNER,
      ),
    ).toEqual([])
    expect(carryingTheOther.map((source) => source.address.name)).not.toEqual([])
    expect(
      carryingTheOther.filter((source) => section.includes(`\`${source.address.name}\``)),
    ).not.toEqual([])
  })

  /**
   * Every folder an install can write to is one the page names.
   *
   * `proposeDirectory` answers `src/lib/toopo` where the project has a `src` folder and `lib/toopo`
   * where it has not, and the page had named only the first - so a reader whose project has no `src`
   * was told their file is somewhere it is not. Measured from npm against the live origin, the same
   * `toopo add string/slugify` in two projects differing only by that folder.
   *
   * **One directory read twice rather than two directories**, so that what separates the two answers
   * is the thing the function tests and nothing else about either path. The temporary folder is
   * removed here rather than in a teardown: this repository has been bitten by a removal that throws
   * outside a guard, and a removal inside one fails the guard that made the folder.
   *
   * **The backtick is load-bearing.** `src/lib/toopo` contains `lib/toopo`, so a guard asking for both
   * by containment is answered by a page naming only the first - which is why each root is sought as
   * the page opens a code span with it.
   *
   * What it does not reach is a third project shape: `proposeDirectory` is a ternary, so two readings
   * are total over it today, and a chain would answer a shape neither of these two dirs has.
   */
  it('the-readme-names-every-root-an-install-can-write-to', () => {
    const project = mkdtempSync(join(tmpdir(), 'toopo-readme-'))
    const section = whatLands()

    const bare = proposeDirectory(project)
    mkdirSync(join(project, 'src'))
    const held = proposeDirectory(project)
    rmSync(project, { recursive: true })

    expect(section).not.toBe('')
    expect(new Set([bare, held]).size).toBe(2)
    expect([bare, held].filter((root) => !section.includes(`\`${root}/`))).toEqual([])
  })

  /**
   * And the line the page tells a reader to write imports the file the page has just shown them.
   *
   * The two are one paragraph apart and they moved independently once: the section named the file
   * under one root and the import under the other would be a page telling a reader to import
   * something it has just told them is elsewhere. **It is the shape a half-done repair of this very
   * paragraph produces** - the landed path corrected, the import line left - which is the event this
   * guard is written for rather than anything it finds today.
   *
   * It asks agreement within the section and never that either is what the installer writes, which is
   * `renderImportLine`'s own guard one folder over. `install.ts` says why: the path is read off the
   * plan rather than rebuilt from the naming rule, because applying that rule twice is how two answers
   * to one question come to disagree - and a second rebuild here would be a third.
   */
  it('the-import-line-the-readme-shows-is-the-file-it-just-showed', () => {
    const section = whatLands()
    const landed = [...section.matchAll(/`([^`]+)\.ts`/g)].map((match) => match[1] as string)
    const imported = [...section.matchAll(/`\.\/([^`]+)\.js`/g)].map((match) => match[1] as string)

    expect(section).not.toBe('')
    expect(imported).not.toEqual([])
    expect(imported.filter((path) => !landed.includes(path))).toEqual([])
  })
})
