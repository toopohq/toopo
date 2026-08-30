/**
 * The only module of this repository that runs in somebody else's browser, and it decides nothing.
 * ADR-0096 is why a field holds text, and why the answer names the call it was made from; ADR-0116 is
 * why the copy control is built here rather than served; ADR-0157 is why every word below arrives from
 * somewhere a guard can reach.
 *
 * ---------------------------------------------------------------------------
 * What it is allowed to be, which is nothing the page depends on
 * ---------------------------------------------------------------------------
 *
 * A contract page is complete and readable with no JavaScript at all - the position `document.ts`
 * takes and this file does not weaken. Everything a reader came for is in the served HTML: the
 * signature, the settled cases, the properties, the profiles, the digest. What this adds is the one
 * thing static HTML cannot do, which is answer a question nobody wrote down in advance.
 *
 * So the form is *built here* rather than served inert. A form in the HTML that does nothing without
 * JavaScript is a control that lies about being a control, and an empty section tells a reader
 * something is missing without telling them what - the rule the contract page already follows about
 * benchmark figures. Without this script the section is a paragraph saying what a playground would do,
 * which is complete prose rather than a hole.
 *
 * ---------------------------------------------------------------------------
 * Delivery and nothing else, and four names a guard can reach
 * ---------------------------------------------------------------------------
 *
 * This module used to export no name, so nothing could import it and a mutant injected here had
 * nothing able to kill it. That was true of two fifths of what it used to hold: measured at
 * `17cc9bf`, 40.2 % of its executable text was a decision about what a visitor reads, written as an
 * argument to `setAttribute`.
 *
 * Every one of those now lives in `what-a-control-says.ts` or, for the deferred half, in
 * `playground.ts` - both reachable, both guarded, both with mutants that have something to kill. What
 * is left here is what genuinely needs a document: finding an element, building one, writing a value
 * into it, and wiring an event. **That half is exported now**, one builder per control, so the wiring
 * is reached by a guard rather than only by a reader: `start.test.ts` runs each of them against a
 * document happy-dom builds, and `start()` stays the composition it always was. ADR-0165.
 *
 * **The rule for anybody adding to this file is therefore short.** A line that decides what a reader
 * is told does not belong here. If it cannot be written without asking one of those two modules for
 * the answer, the answer is missing from them.
 *
 * ---------------------------------------------------------------------------
 * `lib.dom` rather than hand-written declarations
 * ---------------------------------------------------------------------------
 *
 * The alternative was a dozen lines declaring exactly what this module touches, which reads well and
 * is a second statement about the browser - one this repository would then own and could get wrong.
 * `a value read off what it describes has no second statement to disagree with` is the rule
 * `signature.ts` and `implementation-record.ts` are both built on, and it decides this too.
 */

import type { AWayToRunIt } from '../registry/address.js'
import type { ParameterRecord } from '../registry/contract-record.js'
import type { PlaygroundField } from './playground.js'
import type { TheCatalogueAsItArrives, WhereTheCatalogueIs } from './searching.js'
import { answering, arrivingOnce, overHttp } from './searching.js'
import type { WhatThePanelShows } from './what-a-control-says.js'
import {
  THE_COPY_CONTROL_SAYS,
  THE_PANEL_IS_CLOSED,
  theAnswerIsStale,
  theArgumentsIn,
  theCommandWrittenFor,
  theCopyLabelFor,
  theOtherTheme,
  theRefusalShownFor,
  theThemeControlSays,
  theThemeLabelFor,
  theWayAlreadyChosen,
  whatThePanelShows,
} from './what-a-control-says.js'
import type { Theme } from './theme.js'
import { THE_THEME_ATTRIBUTE, THE_THEME_KEY, isATheme } from './theme.js'

/** What the page hands over in `data-playground`, written by `contract-page.ts`. */
type ThePlayground = {
  readonly calls: string
  readonly describes: string | null
  readonly module: string
  readonly fields: readonly PlaygroundField[]
}

/**
 * The words the install block carries right now, which is its own text node and never its
 * `textContent`.
 *
 * `textContent` is the command *plus every control appended to it* - the word `copy` today - so
 * reading it after the button lands offers a reader `npx toopo add string/slugifycopy`. That was
 * avoided by reading the command once, before appending, and reading once is exactly what stopped
 * being safe when the command became something a reader can change: a control that captured the
 * string at build time would go on offering the first spelling after somebody had chosen another.
 *
 * So it is read at the moment it is used, from the node that holds it.
 */
const theCommandIn = (install: Element): Text | null =>
  [...install.childNodes].find((node): node is Text => node.nodeType === 3) ?? null

/** Whatever that text node spells, trimmed, or nothing where the block holds no text at all. */
const theCommandSpelled = (install: Element): string => theCommandIn(install)?.nodeValue?.trim() ?? ''

/**
 * The copy control beside the install command, built here for the reason the form below is.
 *
 * A button served in the HTML does nothing without this file, and
 * `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` is the rule that refuses
 * one. Without JavaScript a reader meets the command as text and selects it, which is what they would
 * have done anyway.
 */
export const copyControl = (): void => {
  const install = document.querySelector('pre.install')
  if (install === null || !navigator.clipboard) return

  const button = document.createElement('button')

  button.type = 'button'
  button.className = 'copy'
  button.textContent = THE_COPY_CONTROL_SAYS.atRest
  button.setAttribute('aria-label', theCopyLabelFor(theCommandSpelled(install)))

  button.addEventListener('click', () => {
    void navigator.clipboard.writeText(theCommandSpelled(install)).then(
      () => {
        button.textContent = THE_COPY_CONTROL_SAYS.afterCopying
      },
      () => {
        button.textContent = THE_COPY_CONTROL_SAYS.whenTheClipboardRefuses
      },
    )
  })

  install.append(button)
}

/**
 * The choice of package manager, built into the block the page serves as prose.
 *
 * **This is the fourth thing on this site that needs JavaScript, and the argument for it is a
 * capability rather than a comfort.** `npx` requires Node, so a reader who has only Bun cannot run
 * the served spelling at all and `bunx` is the one form that works for them - which is the same kind
 * of thing the search and the playground are, and not the same kind of thing a preference is. What is
 * *not* claimed is the reverse: whether `npx` fails in an environment with no Node was not measured
 * here, so the argument rests on Bun being reachable rather than on npm being unreachable. ADR-0138.
 *
 * **The rule holds.** Without JavaScript the page carries one command, it is the one measured to work
 * whether or not anything is installed, and there is no control that does nothing.
 */
export const managerControl = (): void => {
  const block = document.querySelector('.get')
  const head = block?.querySelector('.get-head')
  const install = block?.querySelector('pre.install')
  const declared = block instanceof HTMLElement ? block.dataset['ways'] : undefined
  if (!(head instanceof HTMLElement) || install === null || install === undefined) return
  if (declared === undefined) return

  const ways = JSON.parse(declared) as readonly AWayToRunIt[]
  const command = theCommandIn(install)
  if (command === null) return

  const arguments_ = theArgumentsIn(command.nodeValue?.trim() ?? '')
  if (arguments_ === null) return

  const refusal = document.createElement('p')
  refusal.className = 'refusal'
  refusal.hidden = true

  const list = document.createElement('ul')
  list.className = 'managers'
  list.setAttribute('role', 'group')
  list.setAttribute('aria-label', 'Package manager')

  const buttons = ways.map((way) => {
    const item = document.createElement('li')
    const button = document.createElement('button')
    const refused = theRefusalShownFor(way)

    button.type = 'button'
    button.textContent = way.manager
    button.setAttribute('aria-pressed', String(theWayAlreadyChosen(way)))
    if (refused !== null) button.dataset['refused'] = ''

    button.addEventListener('click', () => {
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button))

      const written = theCommandWrittenFor(way, arguments_)
      command.nodeValue = written

      refusal.textContent = refused ?? ''
      refusal.hidden = refused === null

      const copy = install.querySelector('.copy')
      if (copy !== null) {
        copy.textContent = THE_COPY_CONTROL_SAYS.atRest
        copy.setAttribute('aria-label', theCopyLabelFor(written))
      }
    })

    item.append(button)
    list.append(item)

    return button
  })

  head.append(list)
  install.after(refusal)
}

/**
 * The theme button, built into the slot the masthead serves.
 *
 * **It is an override and never a way in.** The palette is dark by declaration and light under
 * `prefers-color-scheme: light`, both in CSS, so a reader who never receives this file still gets
 * their own system's theme and every word of the page. What this adds is the case the media query
 * cannot answer: a reader whose system says one thing and who wants the other. ADR-0176.
 *
 * **What the button shows is derived and never remembered.** The theme in force is the attribute if
 * the head script found one stored, and otherwise whatever the media query says - the same two
 * conditions, in the same order, as the stylesheet. A copy of the answer kept in a variable here
 * would be a third statement of it, and the first thing it would do is disagree with the page after
 * a reader changed their system setting in another window.
 *
 * That last case is why the listener exists rather than for tidiness: with nothing stored, changing
 * the system preference repaints the page through the media query and the button would go on naming
 * the destination it was built with. It would be a control lying about what pressing it does.
 */
export const themeControl = (): void => {
  const slot = document.querySelector('.masthead .theme')
  if (!(slot instanceof HTMLElement)) return

  const asked = window.matchMedia('(prefers-color-scheme: light)')

  const inForce = (): Theme => {
    const overridden = document.documentElement.getAttribute(THE_THEME_ATTRIBUTE)

    return isATheme(overridden) ? overridden : asked.matches ? 'light' : 'dark'
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'theme-button'

  const show = (): void => {
    const goingTo = theOtherTheme(inForce())

    button.textContent = theThemeControlSays(goingTo)
    button.setAttribute('aria-label', theThemeLabelFor(goingTo))
  }

  button.addEventListener('click', () => {
    const goingTo = theOtherTheme(inForce())

    document.documentElement.setAttribute(THE_THEME_ATTRIBUTE, goingTo)
    try {
      localStorage.setItem(THE_THEME_KEY, goingTo)
    } catch {
      // A browser with storage disabled still gets the theme for this page, and not for the next.
    }
    show()
  })

  asked.addEventListener('change', show)

  show()
  slot.append(button)
}

/**
 * The search field, built into the slot the masthead serves.
 *
 * **What a reader without JavaScript meets is a masthead with nothing extra in it**, which is the
 * arrangement `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` asks for and
 * the reason the served element is empty. There is no fallback prose here because there is nothing to
 * fall back to: a catalogue of five is on the front page, and the wordmark goes there.
 *
 * The results are built from the same `Search` value `toopo search` renders on a terminal, so a page
 * and a terminal disagree about presentation and about nothing else.
 */
export const searchControl = (arriving: TheCatalogueAsItArrives): void => {
  const slot = document.querySelector('.masthead .search')
  const declared = slot instanceof HTMLElement ? slot.dataset['search'] : undefined
  if (!(slot instanceof HTMLElement) || declared === undefined) return

  const where = JSON.parse(declared) as WhereTheCatalogueIs
  const field = document.createElement('input')
  const label = document.createElement('label')
  const answers = document.createElement('div')

  field.type = 'search'
  field.id = 'search-query'
  field.placeholder = 'describe what you need…'
  field.setAttribute('spellcheck', 'false')
  field.setAttribute('autocapitalize', 'off')
  field.setAttribute('autocomplete', 'off')
  label.htmlFor = field.id
  label.className = 'visually-hidden'
  label.textContent = 'Search the catalogue'
  answers.className = 'answers'
  answers.setAttribute('role', 'region')
  answers.setAttribute('aria-live', 'polite')

  const line = (tag: string, className: string, words: string): HTMLElement => {
    const node = document.createElement(tag)
    node.className = className
    node.textContent = words

    return node
  }

  const anExample = (example: string): HTMLElement => {
    const item = document.createElement('li')
    const tryIt = document.createElement('button')

    tryIt.type = 'button'
    tryIt.textContent = example
    tryIt.addEventListener('click', () => {
      field.value = example
      void run()
    })
    item.append(tryIt)

    return item
  }

  const anAnswer = (answer: {
    readonly href: string
    readonly name: string
    readonly summary: string
    readonly mark: string | null
  }): HTMLElement => {
    const item = document.createElement('a')

    item.className = 'answer'
    item.href = answer.href
    item.append(
      line('span', 'name', answer.name),
      line('span', 'summary', answer.summary),
      ...(answer.mark === null ? [] : [line('span', 'mark', answer.mark)]),
    )

    return item
  }

  /**
   * The panel, from what it was decided to show. Total over the union, so a shape added there arrives
   * here as a type error rather than as a branch nobody wrote.
   *
   * `.answers:empty { display: none }` is what closes it, which is the state the stylesheet has
   * described since the first day and which nothing ever entered until `nothing` became something the
   * decision could name.
   */
  const paint = (shows: WhatThePanelShows): void => {
    if (shows.kind === 'nothing') return answers.replaceChildren()

    if (shows.kind === 'an-invitation') {
      const list = document.createElement('ul')
      list.className = 'examples'
      list.append(...shows.examples.map(anExample))

      return answers.replaceChildren(line('p', 'why', shows.said), list)
    }

    if (shows.kind === 'no-answer') {
      return answers.replaceChildren(...shows.said.map((said) => line('p', 'why', said)))
    }

    if (shows.kind === 'a-failure') {
      return answers.replaceChildren(line('p', 'why', shows.said))
    }

    return answers.replaceChildren(...shows.answers.map(anAnswer))
  }

  const run = async (): Promise<void> => {
    const query = field.value.trim()
    if (query === '') return paint(whatThePanelShows(where, { kind: 'was-not-asked' }))

    try {
      const found = await answering(arriving, where, query)
      if (theAnswerIsStale(field.value, query)) return

      paint(whatThePanelShows(where, { kind: 'answered', found }))
    } catch (thrown) {
      paint(whatThePanelShows(where, { kind: 'could-not-be-read', thrown }))
    }
  }

  field.addEventListener('input', () => void run())
  /**
   * The examples are offered when the field is engaged rather than when the page loads.
   *
   * ADR-0137 offers three queries before anybody types, and that is kept whole: a reader who reaches
   * the field with nothing in it still meets them, and each is still measured to answer. What moves
   * is that reaching the field is something the reader does. **A panel answering a question nobody
   * asked, drawn over the name of the page they have just landed on, is not an answer.**
   *
   * `run` and not the invitation directly, so that a reader who leaves the field and comes back to a
   * query they had typed finds its results rather than the examples.
   *
   * **Coming back is a focus arriving from outside this slot**, which is the same distinction the
   * `focusout` below already makes and the reason it is made here rather than left implicit. Focus
   * moving *within* the slot - from an example back to the field - is not a reader engaging the field,
   * and treating it as one is what made Escape unable to close anything. ADR-0165.
   */
  field.addEventListener('focus', (event) => {
    const from = event.relatedTarget

    if (from instanceof Node && slot.contains(from)) return

    void run()
  })
  slot.addEventListener('focusout', (event) => {
    const moved = event.relatedTarget

    if (!(moved instanceof Node) || !slot.contains(moved)) paint(THE_PANEL_IS_CLOSED)
  })
  /**
   * Escape closes without leaving the field, which is the only dismissal a keyboard has.
   *
   * The focus is put back deliberately: an example is a button inside the panel, so closing while one
   * of them is focused would drop the reader on the document body, a page away from what they were
   * doing.
   *
   * **The order is load-bearing and was measured rather than reasoned about.** Closing first detaches
   * the example that holds the focus, so the focus event that follows arrives from a node no longer in
   * the slot, reads as a reader engaging the field, and paints the panel straight back. Measured at
   * `2ae8b50`: with an empty field the invitation reappeared within the same tick, and with a query
   * typed the panel emptied and then repopulated once the answer settled. Moving the focus first
   * leaves the example attached at the moment the event is read, so the focus is recognised as
   * internal, no query is run, and the close is the last thing to happen. ADR-0165.
   */
  slot.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return

    field.focus()
    paint(THE_PANEL_IS_CLOSED)
  })

  slot.append(label, field, answers)
}

/**
 * The playground, on the four pages of thirteen that serve a container for one.
 *
 * It answers nothing on the other nine, and that is the whole of its guard: the container is the
 * page's declaration that this contract has a form, so a page without one is left alone rather than
 * asked about.
 */
export const playgroundControl = async (): Promise<void> => {
  const container = document.getElementById('playground')
  const declared = container?.dataset['playground']
  if (container === null || declared === undefined) return

  /**
   * The playground arrives here rather than at the top of this file, and nine pages are why.
   *
   * Every page runs this module since the masthead gained a field, and four of the thirteen carry a
   * form. A static import would put `playground.js`, `read-literal.js`, `literal.js` and `value.js` on
   * every one of them, for a section that is not there - the larger half of the graph, fetched by the
   * pages that cannot use it. `browser.ts` declares which half loads before a reader acts.
   */
  const { theAnswerShown, theFieldLabelFor, theWhatWentWrong, argumentsOf, declaredBy } =
    await import('./playground.js')

  const playground = JSON.parse(declared) as ThePlayground
  const parameters: readonly ParameterRecord[] = playground.fields
  const module = (await import(new URL(playground.module, document.baseURI).href)) as Readonly<
    Record<string, (...args: readonly unknown[]) => unknown>
  >
  const call = module[playground.calls]
  const describe = playground.describes === null ? null : module[playground.describes]
  if (call === undefined || describe === undefined) return

  const form = document.createElement('div')
  const answer = document.createElement('pre')

  const labelled = (field: PlaygroundField, at: number): HTMLElement => {
    const row = document.createElement('p')
    const label = document.createElement('label')
    const input = document.createElement('input')

    input.id = `playground-argument-${at}`
    input.value = field.opensOn
    input.setAttribute('spellcheck', 'false')
    input.setAttribute('autocapitalize', 'off')
    label.htmlFor = input.id
    label.textContent = theFieldLabelFor(field)

    row.append(label, input)
    if (field.constructedBy !== null) {
      const note = document.createElement('span')
      note.className = 'why'
      note.textContent = field.constructedBy
      row.append(note)
    }

    return row
  }

  const run = (): void => {
    try {
      const typed = [...form.querySelectorAll('input')].map((one) => one.value)

      /**
       * Printed from what the fields spell and called with what those spellings build, which are one
       * step apart. A call printed from its built arguments prints `date/add@1`'s own settled case
       * `an-input-that-is-not-a-date` as the registry refusing to model an invalid Date.
       */
      const spelled = declaredBy(parameters, typed)
      const given = argumentsOf(parameters, typed)

      answer.textContent = theAnswerShown(
        spelled,
        { name: playground.calls, answered: call(...given) },
        playground.describes === null || describe === null
          ? null
          : { name: playground.describes, describes: () => describe(...given) },
      ).join('\n')
    } catch (thrown) {
      answer.textContent = theWhatWentWrong(thrown)
    }
  }

  form.append(...playground.fields.map(labelled))
  form.addEventListener('input', run)
  container.append(form, answer)
  run()
}

/**
 * Every control this page carries, in the order a reader meets them.
 *
 * It is the one name here a guard does not import: what it composes is four builders each reached on
 * its own, and a guard over the composition would be a guard over four calls in a row.
 */
const start = async (): Promise<void> => {
  copyControl()
  managerControl()
  themeControl()
  searchControl(arrivingOnce(overHttp))

  await playgroundControl()
}

void start()
