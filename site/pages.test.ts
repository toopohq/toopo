import { describe, it, expect } from 'vitest'

import {
  THE_PINS_ARE_AN_ASSERTION,
  THE_REPLAY,
  WHAT_A_SURVIVOR_MEANS_TO_A_READER,
  survivorsByKind,
  theMeasurement,
} from '../mutation/published.js'
import { renderCase, renderContract } from '../registry/address.js'
import { ThePageCannotBeBuilt, heldByTheRegistry } from './catalogue.js'
import { whatRunsInYourBrowser } from './contract-page.js'
import { toHtml, toText, wordsOf } from './document.js'
import { localSource } from './local-source.js'
import { CATALOGUE_PAGE, METHOD_PAGE, REFUSALS_PAGE, linkTo, pageOf } from './paths.js'
import { theSite } from './site.js'

/**
 * The pages themselves, built from the five contracts of this working tree.
 *
 * They are built in memory. Nothing here writes a file, which is what keeps everything the generator
 * decides reachable from a guard - the property `cli/command.ts` states for the installer, and the one
 * `build.ts` is the single exception to.
 */

const source = localSource()
const index = source.contractIndex()

/**
 * Built inside each guard rather than once at the top of the file, and that is the apparatus talking
 * rather than taste: a defect that makes `theSite` throw would otherwise stop the whole file from
 * collecting, and the mutation instrument reads a file that collected nothing as a run that measured
 * part of the suite. W-20 is the mutant that found it - it builds a page for the contract that has no
 * binding - and one guard failing is the answer, not nine disappearing.
 */
const pages = (): ReturnType<typeof theSite> => theSite(source)

const page = (path: string): Parameters<typeof toHtml>[0] =>
  pages().get(path) as NonNullable<ReturnType<ReturnType<typeof theSite>['get']>>

const html = (path: string): string => toHtml(page(path))

describe('the site', () => {
  /**
   * Four pages for four contracts, and the fifth contract has none.
   *
   * `array/group-by@1` was decided against *before* publication, so `refuseContract` records the
   * argument and binds no digest: there is no frozen definition to render and nothing about it a
   * reader could check. What the catalogue publishes about it is the refusal, and the refusals page is
   * where that goes. A contract page with no digest behind it would be a contract page missing the
   * only half that makes this registry worth anything.
   *
   * The three pages that are not about one contract are named here, so that a page appearing or
   * disappearing is this guard's business rather than nobody's.
   */
  it('every-installable-contract-has-a-page-and-a-refused-one-does-not', () => {
    const installable = index.entries.filter((entry) => entry.installable)
    const refused = index.entries.filter((entry) => !entry.installable)

    expect([...pages().keys()].sort()).toEqual(
      [
        CATALOGUE_PAGE,
        METHOD_PAGE,
        REFUSALS_PAGE,
        ...installable.map((entry) => pageOf(entry.address)),
      ].sort(),
    )
    expect(refused.map((entry) => pages().has(pageOf(entry.address)))).toEqual([false])
    expect(refused.length).toBe(1)
  })

  /**
   * **The payment of a decision taken ten units ago.** A case identifier was frozen with the major
   * version so that a URL could anchor on it, and `renderCase` has rendered
   * `number/parse@1#ordinary-integer` since `registry/address.ts` was written, read by nothing. That
   * string is now the address of a case on the web: the page is the part before the `#` and the anchor
   * is the part after it.
   *
   * A page that anchored on anything else - a slug, an index, a rendering of the case's own data -
   * would be a second name for a thing that already has one, and the two would come apart.
   */
  it('every-case-is-anchored-by-the-identifier-its-address-is-made-of', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))

      for (const table of held.contract.caseTables) {
        for (const entry of table.cases) {
          const address = renderCase({ contract: held.contract.address, case: entry.id })

          expect(address).toBe(`${renderContract(held.contract.address)}#${entry.id}`)
          expect(rendered).toContain(`<div id="${entry.id}">`)
          expect(rendered).toContain(`href="#${entry.id}"`)
        }
      }
    }
  })

  /**
   * A group is a heading with its own address, and a case sits under the heading it names.
   *
   * The reading is the measurement, not the markup: `toText` is what a stranger, a crawler and a
   * screen reader get, so the guard asks that every group title appears there, in the order the
   * record declares, and that the cases following a title are exactly that group's - which is the
   * one thing a reader can check at a glance and a presence guard cannot.
   *
   * The mutant it exists for renders every case under the first heading. Every title is still on the
   * page, every case is still on the page, every anchor still resolves, and the reading is a lie.
   */
  it('every-group-is-a-heading-and-its-cases-follow-it', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))
      const reading = toText(page(pageOf(held.contract.address)))

      for (const table of held.contract.caseTables) {
        for (const group of table.groups) {
          expect(rendered).toContain(` id="${group.id}" class="group">`)
          expect(rendered).toContain(`href="#${group.id}"`)
        }

        // Where each title sits in the reading, and where each of its cases sits after it.
        const titles = table.groups.map((group) => ({
          group,
          at: reading.indexOf(`\n${group.title}\n`),
        }))

        expect(titles.filter(({ at }) => at < 0).map(({ group }) => group.id)).toEqual([])
        expect(titles.map(({ at }) => at)).toEqual([...titles.map(({ at }) => at)].sort((a, b) => a - b))

        for (const entry of table.cases) {
          const own = titles.findIndex(({ group }) => group.id === entry.group)
          const after = titles[own + 1]?.at ?? reading.length
          const sits = reading.indexOf(entry.rationale)

          expect(
            sits > (titles[own] as (typeof titles)[number]).at && sits < after,
            `${entry.id} does not read under ${entry.group}`,
          ).toBe(true)
        }
      }
    }
  })

  /**
   * A group's note reaches the reading, between its heading and its first case.
   *
   * The field exists because putting that prose in a comment took it off the page it asked to be on,
   * so a guard that only checked the field was carried would be checking the thing that was already
   * true. What has to hold is that a reader sees it, and where.
   *
   * Four of the forty-eight carry one, and the count is not asserted: it is a number that grows
   * whenever somebody has something to say, which is exactly the shape a guard must not pin.
   */
  it('a-group-note-is-read-between-the-heading-and-the-first-case', () => {
    for (const held of heldByTheRegistry(source)) {
      const reading = toText(page(pageOf(held.contract.address)))

      for (const table of held.contract.caseTables) {
        for (const group of table.groups) {
          if (group.note === null) continue

          const first = table.cases.find((entry) => entry.group === group.id)
          const title = reading.indexOf(`\n${group.title}\n`)
          const note = reading.indexOf(group.note)

          expect(note, `${group.id}: the note is not in the reading`).toBeGreaterThan(-1)
          expect(note, `${group.id}: the note reads before its heading`).toBeGreaterThan(title)
          expect(
            note,
            `${group.id}: the note reads after its first case`,
          ).toBeLessThan(reading.indexOf((first as NonNullable<typeof first>).rationale))
        }
      }
    }
  })

  /**
   * A heading is a title, and a table's purpose is only a title when it separates two tables.
   *
   * On the three contracts carrying one table the purpose is a sentence in the lower case a sentence
   * is written in, and a heading that is not a title enters the document outline and is announced as
   * a section by a screen reader - with nothing on the other side of it, because there is no second
   * table. So it is a paragraph there, and the groups take `h3`; where two tables genuinely separate
   * something, the purpose keeps its heading and the groups sit at `h4`.
   */
  it('a-table-purpose-is-a-heading-only-when-it-separates-two-tables', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))
      const alone = held.contract.caseTables.length === 1
      const level = alone ? 'h3' : 'h4'

      for (const table of held.contract.caseTables) {
        expect(rendered.includes(`<h3 class="table">${table.purpose}</h3>`)).toBe(!alone)

        for (const group of table.groups) {
          expect(rendered).toContain(`<${level} id="${group.id}" class="group">`)
        }
      }
    }
  })

  /**
   * No two things on one page answer to one `#id`.
   *
   * A group and a case are anchored in the same space, so a duplicate is a link that silently lands
   * on the wrong element - the failure that only shows up once somebody has shared the link.
   * `every-case-is-addressed` asks this of a contract's data; this asks it of the document, which is
   * where the collision would actually happen and which carries every table at once.
   */
  it('every-anchor-on-a-page-is-held-by-one-element', () => {
    for (const [path, document] of pages()) {
      const ids = [...toHtml(document).matchAll(/ id="([^"]+)"/g)].map((found) => found[1] as string)
      const twice = [...new Set(ids.filter((id, at) => ids.indexOf(id) !== at))]

      expect(twice, `${path} anchors the same address twice`).toEqual([])
    }
  })

  /**
   * A case is rendered as the call it is, which is what the parameter names were carried into the
   * record for. The arguments come from the signature, in the signature's order, and what is left is
   * the answer.
   */
  it('a-case-is-rendered-as-the-call-its-signature-declares', () => {
    const parse = toText(
      page(pageOf({ language: 'typescript', name: 'number/parse', major: 1 })),
    )
    const distance = toText(
      page(pageOf({ language: 'typescript', name: 'string/levenshtein', major: 1 })),
    )

    // Two answer fields, so both are named; one answer field, so it is written bare.
    expect(parse).toContain("parseNumber('42') → expected 42, reason null")
    expect(distance).toContain("levenshtein('kitten', 'sitting') → 3")

    // The two arguments of a two-parameter signature, in the signature's order and not the table's.
    expect(distance).toContain("levenshtein('abc', '') → 3")
    expect(distance).toContain("levenshtein('', 'abc') → 3")

    // And an input a page must never print as it is, because another case prints the same glyphs.
    expect(parse).toContain("parseNumber('1\\u00A0000') → expected null, reason 'separator'")
    expect(parse).toContain("parseNumber('1 000') → expected null, reason 'not-decimal'")
  })

  /**
   * A contract the catalogue refused must be findable and must never be offered - the rule
   * `toopo search` already follows on the terminal, arriving on the page where somebody would click.
   */
  it('nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed', () => {
    const refused = index.entries.find((entry) => !entry.installable)
    const everyPage = [...pages().values()].map(toText).join('\n')

    expect(refused).toBeDefined()
    expect(everyPage).not.toContain(`toopo add ${refused?.address.name}`)
    expect(html(CATALOGUE_PAGE)).toContain(renderContract(refused?.address as never))
    expect(toText(page(REFUSALS_PAGE))).toContain(
      renderContract(refused?.address as never),
    )
  })

  /**
   * The cost on the page is the cost of running the command, which is the implementation's own file
   * and not the harness. The two differ by an order of magnitude - `number/parse@1` serves 57 684
   * bytes of harness and installs 4 154 - so a page that stated the wrong one would publish the
   * project's most immediate comparative claim as a number ten times too large.
   */
  it('the-cost-a-page-states-is-what-lands-and-not-what-is-served', () => {
    for (const held of heldByTheRegistry(source)) {
      const installed = held.implementation.files.reduce((total, file) => total + file.bytes, 0)
      const served = held.contract.harness.reduce((total, file) => total + file.bytes, 0)
      const reading = toText(page(pageOf(held.contract.address)))

      expect(installed).toBeLessThan(served)
      expect(reading).toContain(`${installed.toLocaleString('en-US').replaceAll(',', ' ')} bytes`)
      expect(held.implementation.files.map((file) => file.path)).toEqual(['reference.ts'])
    }
  })

  /**
   * A page that renders an answer nobody checked undoes the argument the whole registry rests on. The
   * generator is the consumer with the most to lose by skipping the check: it publishes the definition
   * to everybody, and nothing downstream ever asks again.
   */
  it('a-snapshot-that-does-not-hash-to-its-own-address-stops-the-build', () => {
    const tampered = {
      ...source,
      snapshot: (digest: string) => {
        const answer = source.snapshot(digest)

        return answer === null ? null : { ...answer, canonicalText: answer.canonicalText.replace('a', 'b') }
      },
    }

    expect(() => heldByTheRegistry(tampered)).toThrow(ThePageCannotBeBuilt)
  })

  /**
   * The sentence about what a browser actually runs is on the playground, once, and nowhere else.
   *
   * `browser.ts` strips the types off a contract's `reference.ts`, so the JavaScript that answers a
   * reader is neither the file the registry serves nor the file the digest covers. That is worth
   * exactly one sentence, in the one place somebody is looking at an answer it produced - saying it
   * again under *What you can check yourself* would blur the section that is about the frozen
   * definition, where nothing has changed at all.
   */
  it('what-runs-in-your-browser-is-said-once-and-beside-the-playground', () => {
    for (const path of pages().keys()) {
      const reading = toText(page(path))
      const entry = index.entries.find((one) => pageOf(one.address) === path)

      if (entry === undefined) {
        expect(reading).not.toContain('types stripped')
        continue
      }

      const said = whatRunsInYourBrowser(entry.address.name)

      expect(reading.split(said)).toHaveLength(2)
      expect(reading.indexOf(said)).toBeGreaterThan(reading.indexOf('Try it on your own input'))
      expect(reading.indexOf(said)).toBeLessThan(reading.indexOf('\nProperties\n'))
    }
  })

  /**
   * With no JavaScript a page is prose, never a control that does nothing.
   *
   * The form is built by `start.ts` rather than served inert, so what a reader without JavaScript
   * meets is two paragraphs saying what the playground would do. A served `<input>` nobody can use is
   * the same defect as an empty section - it tells a reader something is there and it is not - and it
   * is the one this arrangement exists to avoid.
   *
   * The `script` node carries attributes and no children, which is what keeps `document.ts`'s rule
   * that no node holds raw markup true with a script on the page.
   */
  it('a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing', () => {
    for (const held of heldByTheRegistry(source)) {
      const rendered = html(pageOf(held.contract.address))
      const reading = toText(page(pageOf(held.contract.address)))

      expect(rendered).not.toContain('<input')
      expect(rendered).not.toContain('<form')
      expect(rendered).toMatch(/<div id="playground" data-playground="[^"]+"><\/div>/)
      expect(rendered).toMatch(/<script type="module" src="[^"]+"><\/script>/)

      // What a reader without JavaScript meets where the form would be: a sentence, not a gap.
      expect(
        reading.slice(reading.indexOf('Try it on your own input')).split('\n\n')[1],
      ).toContain('Each field holds a literal')
    }
  })

  /** Every page the site holds is reachable from the front page, in one click or two. */
  it('every-page-is-reachable-from-the-front-page', () => {
    const front = html(CATALOGUE_PAGE)
    const linked = [...front.matchAll(/href="([^"]+)"/g)].map((match) => match[1])

    expect([...pages().keys()].filter((path) => path !== CATALOGUE_PAGE).map(linkTo).sort()).toEqual(
      [...new Set(linked)].sort(),
    )
  })

  /**
   * The reading order is what a search engine indexes and what a screen reader announces, and it is the
   * measurement this unit was steered by. A page whose first three lines say the same sentence three
   * times wastes the only part a stranger reads - which is what the first draft did, and this is what
   * stops it coming back.
   */
  it('the-opening-of-a-page-says-three-different-things', () => {
    for (const path of pages().keys()) {
      const document = page(path)
      const [title, description, first] = toText(document).split('\n\n')

      // Distinct is not enough, and neither is containment: a title of `<name> — <summary>` and a
      // description that merely *begins* with the summary are two strings saying one thing twice,
      // which is what the first draft did and what reading the page in document order caught. So the
      // summary itself is what must not appear a second time.
      expect([title, description, first].every((part) => part !== undefined)).toBe(true)
      expect(new Set([title, description, first]).size).toBe(3)

      for (const entry of index.entries) {
        if (path !== pageOf(entry.address)) continue

        expect(title).toContain(entry.summary)
        expect(description).not.toContain(entry.summary)
      }
    }
  })

  /**
   * A page is addressed by the contract it is about, major version and all.
   *
   * Two independent statements: the path this generator writes, and the address the registry renders.
   * A page path that dropped the major would still be internally consistent - every link would be
   * built from the same wrong function, so a link check cannot see it - and `number/parse@2` would one
   * day be published over the page of `number/parse@1`. That is the mutant W-15 is, and it is why this
   * guard compares the path against `renderContract` rather than against another page.
   */
  it('a-page-is-addressed-by-the-contract-it-is-about', () => {
    for (const entry of index.entries) {
      expect(pageOf(entry.address)).toBe(`${renderContract(entry.address)}/index.html`)
      expect(pageOf(entry.address)).toContain(`@${entry.address.major}/`)
    }
  })

  /** Nothing a reader can see is lost between the two projections, on every real page. */
  it('every-word-of-every-page-survives-both-projections', () => {
    for (const path of pages().keys()) {
      const held = page(path)
      const reading = toText(held)

      expect(wordsOf(held).filter((word) => !reading.includes(word))).toEqual([])
    }
  })

  /**
   * A label and the sentence under it are two lines, not one.
   *
   * Found by reading a page in document order and by nothing else: every property of every contract
   * came out as `never mutates its arguments — not applicableThe signature takes a single string…`,
   * because a `code` is inline and the paragraph after it had nothing to separate them. Every word was
   * present, so the projection guard was green; what was wrong was that two blocks had become one
   * sentence, which a person reads and a guard about presence cannot.
   */
  it('a-label-and-the-sentence-under-it-are-two-lines', () => {
    for (const held of heldByTheRegistry(source)) {
      const reading = toText(page(pageOf(held.contract.address)))

      for (const property of held.contract.properties.universal) {
        expect(reading).toContain(
          `${property.name} — ${property.applicable ? 'checked' : 'not applicable'}\n`,
        )
      }
      for (const profile of held.contract.benchmarks.profiles) {
        expect(reading).toContain(`${profile.name} — ${profile.class}\n`)
      }
    }
  })
})

/**
 * The method page, which is the one page here that can destroy the thing it argues for.
 *
 * Its subject is rigour and nobody can check it at a glance, so it is where a project overstates. Each
 * guard below is a way of overstating that this repository has either already committed somewhere else
 * or would not be able to see.
 */
describe('the page that says how we verify', () => {
  const reading = (): string => toText(page(METHOD_PAGE))

  /**
   * **No figure on this page is typed into a sentence.**
   *
   * The defect is not a wrong number, it is a *right* number that goes wrong later: somebody writes
   * "34 survive", a battery gains a mutant, and the page keeps saying 34 while the catalogue says 35.
   * That is the failure this repository has caught in its own prose four times and never in code.
   *
   * So every run of digits a reader can see must occur in what the page was built from - the two
   * answers and the constants beside them - or be a count derived from them. A literal that happens to
   * match today is still refused tomorrow, which is the whole point: the day the data moves, the
   * literal stops being in the set and this goes red.
   */
  it('every-figure-on-the-method-page-comes-from-what-it-was-built-from', () => {
    const measured = theMeasurement()
    const methodology = source.methodology()
    const counts = [
      measured.batteries,
      measured.lenses,
      measured.outOfReach.length,
      measured.unprobed.length,
      Object.keys(methodology.fields).length,
      ...[measured.defects, measured.probes].flatMap((population) => [
        population.cells,
        population.killed,
        population.surviving.length,
        ...Object.values(survivorsByKind(population)),
        ...[...new Set(population.surviving.map((one) => `${one.battery} ${one.mutant}`))].map(
          (_, at) => at + 1,
        ),
      ]),
      ...Object.values(methodology.strata).map(
        (_, at) =>
          Object.values(methodology.fields).filter(
            (stratum) => stratum === Object.keys(methodology.strata)[at],
          ).length,
      ),
    ].map(String)

    const fromTheData = new Set([
      ...counts,
      ...(JSON.stringify([methodology, measured, THE_REPLAY, THE_PINS_ARE_AN_ASSERTION]).match(
        /\d+/g,
      ) ?? []),
    ])

    expect((reading().match(/\d+/g) ?? []).filter((figure) => !fromTheData.has(figure))).toEqual([])
  })

  /**
   * The aggregate never appears without the split.
   *
   * Thirty-four surviving cells published as one number is read as thirty-four known holes, and
   * exactly one of them is a debt. A page that prints the total and drops the breakdown is not
   * shorter, it is a different and worse claim - and it is the shape a page takes when somebody tidies
   * it.
   */
  it('a-count-of-survivors-is-never-shown-without-its-breakdown', () => {
    const measured = theMeasurement()

    for (const population of [measured.defects, measured.probes]) {
      const byKind = survivorsByKind(population)
      const sentence = reading()
        .split('\n\n')
        .find((block) => block.includes(`${population.cells}`) && block.includes('cells,'))

      expect(sentence).toBeDefined()
      expect(sentence).toContain(`${population.surviving.length}`)

      for (const [why, many] of Object.entries(byKind)) {
        if (many === 0) continue
        expect(sentence).toContain(`${many} ${why.replaceAll('-', ' ')}`)
      }
    }
  })

  /** Every survivor is on the page. A list that silently stops short reads exactly like a short list. */
  it('every-surviving-cell-is-published-with-its-own-battery-sentence', () => {
    const measured = theMeasurement()
    const shown = reading()

    for (const population of [measured.defects, measured.probes]) {
      for (const survivor of population.surviving) {
        expect(shown).toContain(`${survivor.battery} · ${survivor.mutant}`)
        expect(shown).toContain(survivor.cell)
        expect(shown).toContain(survivor.description.replaceAll('**', '').replaceAll('`', ''))
      }
    }
  })

  /**
   * Every kind the vocabulary declares and this page uses is explained on it, in the words
   * `mutation/published.ts` holds - never in words invented here, which would be a second statement of
   * one judgement, in the file most likely to drift from the data.
   */
  it('every-kind-of-survivor-shown-is-explained-in-the-instruments-own-words', () => {
    const measured = theMeasurement()
    const shown = reading()
    const used = new Set(
      [measured.defects, measured.probes].flatMap((population) =>
        population.surviving.map((one) => one.why),
      ),
    )

    for (const why of used) expect(shown).toContain(WHAT_A_SURVIVOR_MEANS_TO_A_READER[why])
  })

  /**
   * A reader is told which of an assertion and an observation they are holding, and what the second
   * one costs.
   *
   * The two coincide, so nothing here is false without it - and a page that publishes pins as though
   * somebody had watched them happen is doing the exact thing it spends the rest of its length arguing
   * against.
   */
  it('the-page-separates-what-is-asserted-from-what-a-run-would-observe', () => {
    const shown = reading()

    expect(shown).toContain(THE_PINS_ARE_AN_ASSERTION)
    expect(shown).toContain(THE_REPLAY.command)
    expect(shown).toContain(THE_REPLAY.duration)
    expect(shown).toContain(THE_REPLAY.measuredAt)
  })

  /**
   * The limit of the method is read before the figure it limits, and this is a guard about *order*
   * rather than presence.
   *
   * A mutation score reads as a correctness claim to somebody meeting it cold, and the sentence that
   * says it is not one is worth nothing after the number - which is exactly where a page like this
   * puts it, as a footnote, having said the impressive part first.
   */
  it('what-the-score-does-not-prove-is-read-before-the-score', () => {
    const shown = reading()
    const limit = shown.indexOf('It says the tests notice the defects that were tried')
    const figure = shown.indexOf(`${theMeasurement().defects.cells} defect cells`)

    expect(limit).toBeGreaterThan(-1)
    expect(figure).toBeGreaterThan(-1)
    expect(limit).toBeLessThan(figure)
  })
})
