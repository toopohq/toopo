// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest'

import { THE_INVOCATION, THE_WAYS_TO_RUN_IT } from '../registry/address.js'
import { toHtml } from './document.js'
import { localSource } from './local-source.js'
import { FRONT_PAGE, pageOf } from './paths.js'
import type { ReadOneAnswer, WhereTheCatalogueIs } from './searching.js'
import { arrivingOnce } from './searching.js'
import { theSite } from './site.js'
import { copyControl, managerControl, playgroundControl, searchControl, siftControl } from './start.js'
import { THE_COPY_CONTROL_SAYS } from './what-a-control-says.js'

/**
 * The wiring, run against a document rather than read.
 *
 * ---------------------------------------------------------------------------
 * The half `what-a-control-says.test.ts` says it does not keep
 * ---------------------------------------------------------------------------
 *
 * That file states its own residue in as many words: *they do not keep `start.ts` calling any of it. A
 * guard over `theSpellingShownFor` is green on the day the control stops asking for it.* This is the
 * other half. Every guard below runs a builder against a document and asks what reached an element -
 * so a control that stops asking, asks the wrong thing, or asks at the wrong moment reddens here.
 *
 * The two files are one claim each and neither restates the other's. A decision is checked there; that
 * the decision arrives is checked here. Where a guard below needs a value, it is written as a literal
 * rather than taken from the function under it, so the two sides cannot move together.
 *
 * ---------------------------------------------------------------------------
 * The document is happy-dom's, which is a second statement about the browser
 * ---------------------------------------------------------------------------
 *
 * `start.ts`'s own header refuses hand-written declarations of what a browser does, on the rule that *a
 * value read off what it describes has no second statement to disagree with* - and an emulated document
 * is exactly such a second statement. What limits that is only that this one is neither written nor
 * maintained here. ADR-0165 carries the whole of what it does not prove: a real clipboard, a secure
 * context, a layout, a hit test, a tab order, and that a browser fetches this module at all.
 *
 * ---------------------------------------------------------------------------
 * The page is the one the generator writes, and it is built inside each guard
 * ---------------------------------------------------------------------------
 *
 * A hand-written fixture would be a second statement about the page as well, and it would go green the
 * day `contract-page.ts` renamed a class. So each guard renders a real contract page through `theSite`
 * and hands the builders the same HTML a reader receives.
 *
 * It is rebuilt inside every guard rather than once at the top, for the reason `pages.test.ts` records:
 * a defect that makes `theSite` throw would otherwise stop this file from collecting, and the
 * instrument reads a file that collected nothing as a run that measured part of the suite.
 *
 * **The source is read once and the site is built twelve times**, which is the same split that file
 * makes and it is a measurement rather than a copy of its shape: at `d0c8fe6` `localSource()` costs
 * 268 ms against `theSite`'s 9 ms. Reading the catalogue inside each guard instead put 3.3 s on a
 * suite that runs once per injected defect - a reading taken on a draft of this file that no commit
 * holds, and ADR-0165 is where it is written down with what it was. What the argument above protects
 * is the call that can throw on a defect of this folder, and reading thirty-seven files off disk is
 * not it.
 */

const source = localSource()

const THE_PAGE_A_READER_LANDS_ON = { language: 'typescript', name: 'string/slugify', major: 1 } as const

/** The contract page as it is served, loaded into the document the builders will read. */
const aServedContractPage = (): void => {
  const path = pageOf(THE_PAGE_A_READER_LANDS_ON)
  const built = theSite(source).get(path)
  if (built === undefined) throw new Error(`the generator writes no ${path}`)

  document.open()
  document.write(toHtml(built))
  document.close()
}

/** A page of this repository's own making, for the states the generator never writes. */
const aPageOf = (body: string): void => {
  document.open()
  document.write(`<!doctype html><html><body>${body}</body></html>`)
  document.close()
}

/** Whatever the install block spells right now, which is its own text node and never its `textContent`. */
const theCommandOnThePage = (): string => {
  const install = document.querySelector('pre.install')
  if (install === null) throw new Error('the page carries no install block')

  return ([...install.childNodes].find((node) => node.nodeType === 3)?.nodeValue ?? '').trim()
}

/**
 * A clipboard that records what it was handed and answers as it is told to.
 *
 * `navigator.clipboard` is a property of a live navigator rather than a port anything passes in, so a
 * guard has to put one there. What is asserted is what the wiring handed it, which is the claim; that a
 * browser would have accepted it is not, and is written down as unproven rather than assumed.
 */
const aClipboardThat = (answers: () => Promise<void>): readonly string[] => {
  const written: string[] = []

  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: (text: string) => {
        written.push(text)

        return answers()
      },
    },
  })

  return written
}

/** Every pending microtask, so a guard reads what a handler settled on rather than what it started. */
const settled = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0))

/**
 * The two answers the origin serves, read from this working tree instead of from a socket.
 *
 * The addresses are the page's own, so a page that declared others would not be answered - which is the
 * point of reading them off the document rather than writing them here.
 */
const theCatalogueAsThisPageDeclaresIt = (): { readonly where: WhereTheCatalogueIs } => {
  const slot = document.querySelector('.masthead .search')
  const declared = slot instanceof HTMLElement ? slot.dataset['search'] : undefined
  if (declared === undefined) throw new Error('the masthead declares no catalogue')

  return { where: JSON.parse(declared) as WhereTheCatalogueIs }
}

const servedFromThisTree =
  (where: WhereTheCatalogueIs): ReadOneAnswer =>
  (at) =>
    Promise.resolve(
      at === where.index
        ? { status: 200, body: JSON.stringify(source.contractIndex()) }
        : at === where.refusals
          ? { status: 200, body: JSON.stringify(source.refusals()) }
          : { status: 404, body: '' },
    )

/** The front page as it is served, which is the one page of this site that carries a shelf. */
const aServedFrontPage = (): void => {
  const built = theSite(source).get(FRONT_PAGE)
  if (built === undefined) throw new Error(`the generator writes no ${FRONT_PAGE}`)

  document.open()
  document.write(toHtml(built))
  document.close()
}

/** The shelf's field, built into the slot the front page serves. */
const aSiftOnThePage = (): HTMLInputElement => {
  const slot = document.querySelector('.find')
  const declared = slot instanceof HTMLElement ? slot.dataset['search'] : undefined
  if (declared === undefined) throw new Error('the shelf declares no catalogue')

  siftControl(arrivingOnce(servedFromThisTree(JSON.parse(declared) as WhereTheCatalogueIs)))

  const field = document.querySelector('.find input')
  if (!(field instanceof HTMLInputElement)) throw new Error('the sift built no field')

  return field
}

/** The search, built and answered by this tree's own catalogue. */
const aSearchOnThePage = (): HTMLInputElement => {
  const { where } = theCatalogueAsThisPageDeclaresIt()
  searchControl(arrivingOnce(servedFromThisTree(where)))

  const field = document.querySelector('.masthead .search input')
  if (!(field instanceof HTMLInputElement)) throw new Error('the search built no field')

  return field
}

const theAnswersShown = (): Element | null => document.querySelector('.masthead .search .answers')

describe('the controls a visitor touches, run against a document', () => {
  it('every-control-lands-in-the-slot-the-page-serves-for-it', () => {
    aServedContractPage()
    aClipboardThat(() => Promise.resolve())

    copyControl()
    managerControl()
    aSearchOnThePage()

    expect({
      copy: document.querySelector('pre.install > button.copy') !== null,
      ways: document.querySelector('.get .get-head > ul.managers') !== null,
      refusal: document.querySelector('pre.install + p.refusal') !== null,
      field: document.querySelector('.masthead .search > input') !== null,
      label: document.querySelector('.masthead .search > label') !== null,
      answers: document.querySelector('.masthead .search > .answers') !== null,
    }).toEqual({ copy: true, ways: true, refusal: true, field: true, label: true, answers: true })
  })

  /**
   * The page's declaration is what a control offers, and never a list this module carries.
   *
   * `data-ways` is written by `contract-page.ts` out of `THE_WAYS_TO_RUN_IT`; a builder that reached for
   * that constant itself would go on offering four managers after the page had been changed to serve
   * three, and every rendering of it would look correct.
   */
  it('the-ways-a-control-offers-are-the-ways-the-page-declared', () => {
    aServedContractPage()
    managerControl()

    const offered = [...document.querySelectorAll('.managers button')].map((one) => one.textContent)
    const declared = THE_WAYS_TO_RUN_IT.map((way) => way.manager)

    expect(offered).toEqual(declared)
    expect(offered.length).toBeGreaterThan(1)
  })

  /**
   * A page with none of the slots is left alone, which is what makes the four builders safe on all
   * thirteen pages rather than on the four that carry a command.
   */
  it('a-page-with-no-slots-on-it-has-nothing-built-into-it', async () => {
    aPageOf('<p>a page about a contract, and no controls at all</p>')
    aClipboardThat(() => Promise.resolve())

    copyControl()
    managerControl()
    searchControl(arrivingOnce(() => Promise.resolve({ status: 404, body: '' })))
    await playgroundControl()

    expect(document.querySelectorAll('button, input, ul, .answers').length).toBe(0)
  })

  /**
   * **A slot that declares nothing is a different page from a page with no slot**, and a guard that only
   * ever meets the second cannot see the first. Dropping the check on `data-search` altogether left the
   * guard above green, because the page it builds carries no masthead for the check to have mattered
   * on - a reading of that guard as first drafted, which no commit holds and which ADR-0165 records.
   *
   * The declaration is what a builder reads, so a page serving the slot and declaring nothing is the
   * state where a builder either asks the page or invents an answer of its own.
   */
  it('a-slot-that-declares-nothing-is-left-alone', async () => {
    aPageOf(
      `<header class="masthead"><div class="search"></div></header>
       <div class="get"><p class="get-head">Get it</p><pre class="install">npx toopo add string/slugify</pre></div>
       <div id="playground"></div>`,
    )

    managerControl()
    searchControl(arrivingOnce(() => Promise.resolve({ status: 404, body: '' })))
    await playgroundControl()

    expect({
      ways: document.querySelector('.managers'),
      field: document.querySelector('.masthead .search input'),
      answers: document.querySelector('.answers'),
      form: document.querySelector('#playground div'),
    }).toEqual({ ways: null, field: null, answers: null, form: null })
  })

  /**
   * **A page carrying no container at all has no guard here, and that is a refusal rather than an
   * omission.** One was written, it passed, and nothing could make it fail.
   *
   * `playgroundControl` opens `if (container === null || declared === undefined)`. The first clause
   * carries no behaviour of its own: `declared` is read through `container?.dataset`, so a null
   * container already makes it `undefined` - measured at `d0c8fe6`, dropping that clause changes no
   * answer and every guard here stays green. What it does is narrow the type for `container.append`
   * further down, and dropping it is `TS18047: 'container' is possibly 'null'`, so the compiler holds
   * it and the run never sees it.
   *
   * Two plausible defects were written for the guard and both left it green: taking the first `div` on
   * the page for the container, and removing the clause outright. The path where a container is null
   * and the builder carries on cannot be reached at runtime at all, because reaching it does not
   * compile. A guard whose subject is enforced by the type system is a guard that cannot fail, and
   * this repository refuses to keep one of those where it reads as coverage.
   */

  /**
   * **The defect this file was written for.** The install block is a text node a reader can change, so
   * a control that captured the command when it was built goes on offering `npx` after somebody has
   * chosen Bun - and the page reads perfectly, because the words on it are the words they asked for.
   *
   * The literals are written out rather than composed, so that a mutant moving both the command and the
   * expectation cannot pass.
   */
  it('the-command-copied-is-the-one-the-block-spells-at-the-moment-it-is-pressed', async () => {
    aServedContractPage()
    const written = aClipboardThat(() => Promise.resolve())

    copyControl()
    managerControl()

    expect(theCommandOnThePage()).toBe(`${THE_INVOCATION} add string/slugify`)

    const copy = document.querySelector('pre.install button.copy')
    if (!(copy instanceof HTMLElement)) throw new Error('no copy control')
    copy.click()
    await settled()

    const bun = [...document.querySelectorAll('.managers button')].find(
      (one) => one.textContent === 'bun',
    )
    if (!(bun instanceof HTMLElement)) throw new Error('no way to choose bun')
    bun.click()
    copy.click()
    await settled()

    expect(theCommandOnThePage()).toBe('bunx toopo add string/slugify')
    expect(written).toEqual(['npx toopo add string/slugify', 'bunx toopo add string/slugify'])
  })

  /**
   * Choosing a way rewrites what the page carries, marks the one chosen, and re-labels the control a
   * sighted reader never sees - three things one click has to do, and the third is the one no rendering
   * of the page would show.
   */
  it('choosing-a-way-rewrites-the-command-marks-it-and-relabels-the-copy-control', () => {
    aServedContractPage()
    aClipboardThat(() => Promise.resolve())

    copyControl()
    managerControl()

    const buttons = [...document.querySelectorAll('.managers button')]
    const pnpm = buttons.find((one) => one.textContent === 'pnpm')
    if (!(pnpm instanceof HTMLElement)) throw new Error('no way to choose pnpm')
    pnpm.click()

    expect(theCommandOnThePage()).toBe('pnpm dlx toopo add string/slugify')
    expect(buttons.map((one) => one.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ])
    expect(document.querySelector('button.copy')?.getAttribute('aria-label')).toContain(
      'pnpm dlx toopo add string/slugify',
    )
  })

  /**
   * A way the catalogue measured as broken says so when it is chosen, and one that runs says nothing -
   * the refusal being hidden rather than absent, so the block does not move under the reader.
   */
  it('a-way-that-was-measured-to-fail-says-so-and-one-that-runs-says-nothing', () => {
    aServedContractPage()
    managerControl()

    const refusal = document.querySelector('p.refusal')
    const buttons = [...document.querySelectorAll('.managers button')]
    const yarn = buttons.find((one) => one.textContent === 'yarn')
    const npm = buttons.find((one) => one.textContent === 'npm')
    if (!(yarn instanceof HTMLElement) || !(npm instanceof HTMLElement)) throw new Error('no ways')

    expect(refusal instanceof HTMLElement && refusal.hidden).toBe(true)

    yarn.click()
    const said = refusal?.textContent ?? ''
    /**
     * Read as well as written, and that is the half a guard forgets.
     *
     * A control that sets the words and never reveals the paragraph left this guard green, because it
     * was reading `textContent` on an element the reader cannot see. A refusal nobody is shown is the
     * defect, not a refusal nobody composed. That reading is of this guard as first drafted, which no
     * commit holds; ADR-0165 records it.
     */
    const shown = refusal instanceof HTMLElement && !refusal.hidden

    npm.click()

    expect({
      composedForYarn: said.length > 0,
      shownForYarn: shown,
      hiddenAfterNpm: refusal instanceof HTMLElement && refusal.hidden,
      marked: yarn.dataset['refused'] === '' && npm.dataset['refused'] === undefined,
    }).toEqual({ composedForYarn: true, shownForYarn: true, hiddenAfterNpm: true, marked: true })
  })

  it('a-clipboard-that-refuses-is-said-so-and-one-that-is-not-there-builds-no-control', async () => {
    aServedContractPage()
    aClipboardThat(() => Promise.reject(new Error('the reader refused permission')))

    copyControl()
    const copy = document.querySelector('pre.install button.copy')
    if (!(copy instanceof HTMLElement)) throw new Error('no copy control')

    expect(copy.textContent).toBe(THE_COPY_CONTROL_SAYS.atRest)

    copy.click()
    await settled()

    expect(copy.textContent).toBe(THE_COPY_CONTROL_SAYS.whenTheClipboardRefuses)

    aServedContractPage()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    copyControl()

    expect(document.querySelector('pre.install button.copy')).toBeNull()
  })

  /**
   * A query narrows the shelf to the cards it names, and every card it leaves is the one served.
   *
   * **This is the property unit 2 was built on, asked of a document rather than of a type.**
   * `what-a-query-narrows-the-shelf-to-is-addresses-and-never-cards` establishes that the decision
   * answers addresses; this establishes that the wiring hides the rest and touches nothing else. The
   * two together are what makes *a searched card cannot show less than a static one* a fact: the card
   * a reader is left looking at is the same element the generator wrote, with its signature and its
   * command still in it.
   *
   * The signature is read back off the surviving card for exactly that reason - a control that rebuilt
   * a card would pass a guard that only counted them. ADR-0181.
   */
  it('a-query-hides-the-cards-it-does-not-name-and-leaves-the-others-as-served', async () => {
    aServedFrontPage()
    const field = aSiftOnThePage()

    const before = [...document.querySelectorAll('[data-contract]')]
    expect(before.length).toBeGreaterThan(1)

    field.value = 'slugify'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    await settled()

    const shown = before.filter((card) => !(card as HTMLElement).hidden)

    expect(shown).toHaveLength(1)
    expect((shown[0] as HTMLElement).dataset['contract']).toBe('string/slugify')

    // The card left standing is the one the generator wrote, not one this control built.
    expect(shown[0]?.querySelector('.signature')?.textContent).toContain('type Slugify =')
    expect(shown[0]?.querySelector('.install')?.textContent).toContain(
      `${THE_INVOCATION} add string/slugify`,
    )

    // And clearing the field brings every one of them back.
    field.value = ''
    field.dispatchEvent(new Event('input', { bubbles: true }))
    await settled()

    expect(before.filter((card) => (card as HTMLElement).hidden)).toEqual([])
  })

  /**
   * A page that serves no shelf gets no field, and the control does nothing at all.
   *
   * Every page of this site carries the masthead's search and only one carries the shelf, so this is
   * the ordinary case rather than an exotic one: a control that assumed its slot would throw on twelve
   * pages of thirteen.
   *
   * **It is never red alone, and the road to knowing that is worth more than the fact.** A cell was
   * written against it - the slot reader falling back to the masthead's - and it *survived*: three
   * independent early returns each refuse to build here, so defeating one leaves the other two
   * refusing. That measurement was then generalised into a declaration saying no mutant reaches this
   * guard at all, and the first full replay refuted it: it is red on **W-02, W-19 and W-20**, and
   * alone on none of them.
   *
   * Those three reach it by doors the reasoning never considered - an attribute escaped as text, and
   * two that give the refused contract a page - so what they break is the document this guard builds
   * on rather than the control it is about. **A negative over every possible edit was asserted from
   * one attempted edit**, which is the sweep rule one level up: a reading that does not reach the
   * branch it argues about says nothing about it.
   *
   * So the guard is accounted for and it sits in `attribution.ts`'s *never alone* bucket, which
   * `CLAUDE.md` already carries an open entry about. ADR-0181.
   */
  it('a-page-that-serves-no-shelf-is-left-alone', () => {
    aServedContractPage()

    /**
     * **Every field on the page and not the shelf's own, which is what the instrument corrected.**
     *
     * This asked whether `.sift input` was null, and `W-145` survived: the mutant falls back to the
     * masthead's slot when there is no shelf, so it builds a field *somewhere else* and the shelf's
     * selector goes on answering nothing. A guard asking about the place a control was supposed to
     * build in cannot see one that built in the wrong place.
     *
     * So it counts inputs across the document, before and after. `searchControl` is not called here,
     * so a served contract page carries none - and the claim is that this builder added nothing at
     * all rather than that one selector stayed empty.
     */
    expect(document.querySelectorAll('input')).toHaveLength(0)

    siftControl(arrivingOnce(servedFromThisTree(theCatalogueAsThisPageDeclaresIt().where)))

    expect(document.querySelectorAll('input')).toHaveLength(0)
    expect(document.querySelector('.find input')).toBeNull()
  })

  it('typing-answers-from-the-catalogue-the-masthead-declared', async () => {
    aServedContractPage()
    const field = aSearchOnThePage()

    field.value = 'slugify'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    await settled()

    const answers = [...document.querySelectorAll('.answers a.answer')].map(
      (one) => one.querySelector('.name')?.textContent,
    )

    expect(answers.length).toBeGreaterThan(0)
    expect(answers[0]).toContain('string/slugify')
  })

  /**
   * **Escape is the only dismissal a keyboard has**, and the focus is put back deliberately: an example
   * is a button inside the panel, so closing while one of them is focused would drop the reader on the
   * document body, a page away from what they were doing.
   *
   * The example is focused first for a reason the instrument found: a guard that presses Escape while
   * the field already holds the focus is green with the whole restoration removed.
   */
  it('escape-closes-the-panel-and-brings-the-reader-back-to-the-field', async () => {
    aServedContractPage()
    const field = aSearchOnThePage()

    field.focus()
    await settled()

    const example = document.querySelector('.answers .examples button')
    if (!(example instanceof HTMLElement)) throw new Error('the panel offered no example')

    example.focus()
    expect(document.activeElement).toBe(example)

    example.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(theAnswersShown()?.childNodes.length).toBe(0)
    expect(document.activeElement).toBe(field)
  })

  /**
   * **Escape closes a panel of answers too, and it is the harder half.**
   *
   * With the field empty the panel is repainted synchronously, so a close that happens last wins
   * whatever else ran. With a query typed, the answer is awaited - so a query re-run by the refocus
   * lands *after* the close and puts the panel back with nothing to say it did. Measured at `2ae8b50`
   * on the state before this unit: the panel emptied and then repopulated once settled.
   *
   * This is the guard that makes the focus condition load-bearing rather than decorative: the ordering
   * alone repairs the empty field and leaves this one broken.
   */
  it('escape-closes-a-panel-of-answers-and-it-stays-closed', async () => {
    aServedContractPage()
    const field = aSearchOnThePage()

    field.value = 'slugify'
    field.dispatchEvent(new Event('input', { bubbles: true }))
    await settled()

    const answer = document.querySelector('.answers a.answer')
    if (!(answer instanceof HTMLElement)) throw new Error('the catalogue answered nothing')

    answer.focus()
    answer.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(theAnswersShown()?.childNodes.length).toBe(0)

    await settled()

    expect(theAnswersShown()?.childNodes.length).toBe(0)
    expect(document.activeElement).toBe(field)
  })

  /**
   * Leaving the slot closes the panel and moving inside it does not, which is what lets a reader reach
   * an example with the keyboard at all.
   */
  it('leaving-the-slot-closes-the-panel-and-moving-inside-it-does-not', async () => {
    aServedContractPage()
    const field = aSearchOnThePage()
    const slot = document.querySelector('.masthead .search')

    field.focus()
    await settled()
    expect(theAnswersShown()?.childNodes.length).toBeGreaterThan(0)

    const example = document.querySelector('.answers .examples button')
    field.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: example }))

    expect(theAnswersShown()?.childNodes.length).toBeGreaterThan(0)

    const away = document.createElement('button')
    document.body.append(away)
    field.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: away }))

    expect(theAnswersShown()?.childNodes.length).toBe(0)
    expect(slot?.contains(away)).toBe(false)
  })

  /**
   * Every command a page shows carries its own control, and the front page is why this exists.
   *
   * **The defect it was written for shipped and was found in a browser.** `copyControl` read
   * `querySelector`, which is exactly right for every page that had ever carried an install line and
   * exactly wrong the day one carried six: the shelf offered a control on six cards and delivered it on
   * one. Nothing was red. The suite counted guards and never controls against commands, the page read
   * perfectly, and the five cards that were missing one looked like cards whose design had no button.
   *
   * So the guard compares the two populations rather than asserting a number, which is what makes it
   * hold when a seventh contract is published. ADR-0182.
   */
  it('every-command-a-page-shows-carries-its-own-copy-control', () => {
    aServedFrontPage()
    aClipboardThat(() => Promise.resolve())

    const commands = [...document.querySelectorAll('pre.install')]
    expect(commands.length).toBeGreaterThan(1)

    copyControl()

    expect(commands.map((one) => one.querySelectorAll('button.copy').length)).toEqual(
      commands.map(() => 1),
    )
  })

  /**
   * The chord the badge names is the chord that reaches the field, and nothing else does.
   *
   * The badge is drawn because the shortcut exists, so a guard reading one without the other would
   * establish half of what a reader is promised. The bare key is asserted too: a listener keyed on the
   * letter alone would steal every `k` a reader types anywhere on the page. ADR-0182.
   */
  it('the-chord-the-badge-names-is-the-one-that-reaches-the-search', async () => {
    aServedFrontPage()
    const field = aSearchOnThePage()
    const away = document.createElement('input')
    document.body.append(away)
    away.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true }))
    expect(document.activeElement).toBe(away)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
    await settled()
    expect(document.activeElement).toBe(field)

    away.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'K', metaKey: true, bubbles: true }))
    await settled()
    expect(document.activeElement).toBe(field)
  })
})
