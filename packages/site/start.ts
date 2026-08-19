/**
 * The only module of this repository that runs in somebody else's browser.
 * ADR-0096 is why a field holds text, and why the answer names the call it was made from; ADR-0116 is
 * why the copy control is built here rather than served.
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
 * `lib.dom` rather than hand-written declarations
 * ---------------------------------------------------------------------------
 *
 * The alternative was a dozen lines declaring exactly what this module touches, which reads well and
 * is a second statement about the browser - one this repository would then own and could get wrong.
 * `a value read off what it describes has no second statement to disagree with` is the rule
 * `signature.ts` and `implementation-record.ts` are both built on, and it decides this too.
 */

import { renderContract } from '../registry/address.js'
import type { ParameterRecord } from '../registry/contract-record.js'
import type { PlaygroundField } from './playground.js'
import type { WhereTheCatalogueIs } from './searching.js'
import { answering } from './searching.js'

/** What the page hands over in `data-playground`, written by `contract-page.ts`. */
type ThePlayground = {
  readonly calls: string
  readonly describes: string | null
  readonly module: string
  readonly fields: readonly PlaygroundField[]
}

const labelled = (field: ThePlayground['fields'][number], at: number): HTMLElement => {
  const row = document.createElement('p')
  const label = document.createElement('label')
  const input = document.createElement('input')

  input.id = `playground-argument-${at}`
  input.value = field.opensOn
  input.setAttribute('spellcheck', 'false')
  input.setAttribute('autocapitalize', 'off')
  label.htmlFor = input.id
  label.textContent = `${field.name}: ${field.type}`

  row.append(label, input)
  if (field.constructedBy !== null) {
    const note = document.createElement('span')
    note.className = 'why'
    note.textContent = field.constructedBy
    row.append(note)
  }

  return row
}

/**
 * The copy control beside the install command, built here for the reason the form below is.
 *
 * A button served in the HTML does nothing without this file, and
 * `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` is the rule that refuses
 * one. Without JavaScript a reader meets the command as text and selects it, which is what they would
 * have done anyway.
 *
 * The command is read *before* the button is appended, because afterwards the element's text is the
 * command plus the word `copy` - which is the kind of defect that only shows up in somebody else's
 * terminal.
 *
 * What it says after copying is a word and not a colour, which is the rule the stylesheet states for
 * this site's accent and which holds here for a second reason: a reader who cannot tell the two
 * colours apart still reads the word.
 */
const copyControl = (): void => {
  const install = document.querySelector('pre.install')
  if (install === null || !navigator.clipboard) return

  const command = install.textContent ?? ''
  const button = document.createElement('button')

  button.type = 'button'
  button.className = 'copy'
  button.textContent = 'copy'
  button.setAttribute('aria-label', `Copy ${command} to the clipboard`)

  button.addEventListener('click', () => {
    void navigator.clipboard.writeText(command).then(
      () => {
        button.textContent = 'copied'
      },
      () => {
        button.textContent = 'press ⌘C'
      },
    )
  })

  install.append(button)
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
const searchControl = (): void => {
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

  /**
   * What the reader is shown while they are searching, and it is never nothing.
   *
   * An empty query offers the examples, a query the catalogue cannot answer says which words no
   * contract carries, and a query that reaches nobody at all says so - the three shapes
   * `packages/cli/report.ts` prints on a terminal, rendered for a page. **A box that goes blank when
   * a search fails is the failure the whole matching rule is built to avoid**, arriving in the
   * surface instead of in the rule.
   *
   * **A reader who is not searching is a different case, and it is `close` below.** This rule is
   * about a search that answered badly; it was read as being about the panel, and the panel was
   * therefore never allowed to be empty at all.
   */
  const show = (nodes: readonly Node[]): void => {
    answers.replaceChildren(...nodes)
  }

  /**
   * What closes the panel, and it is the state the stylesheet has described since the first day.
   *
   * `.answers:empty { display: none }` was written for a panel that fills when somebody asks and
   * empties when they stop, and **nothing ever emptied it**: the control offered the examples as it
   * was built, so that rule could not apply on any page of this site. Measured at `fccfcc1`, on the
   * origin and on a local build: a panel of 268 x 157 stood open at rest over the first block of
   * **ten of the thirteen addresses served** - the title of the front page, of every domain page and
   * of every contract page, plus the contract's own address - at 390, 768, 1440 and 1920 alike.
   *
   * So the repair is the script agreeing with the stylesheet, rather than a second way to hide a box
   * written beside a first way that was already correct.
   */
  const close = (): void => show([])

  const line = (tag: string, className: string, words: string): HTMLElement => {
    const node = document.createElement(tag)
    node.className = className
    node.textContent = words

    return node
  }

  const offerTheExamples = (): void => {
    const list = document.createElement('ul')
    list.className = 'examples'

    for (const example of where.examples) {
      const item = document.createElement('li')
      const tryIt = document.createElement('button')

      tryIt.type = 'button'
      tryIt.textContent = example
      tryIt.addEventListener('click', () => {
        field.value = example
        void run()
      })
      item.append(tryIt)
      list.append(item)
    }

    show([line('p', 'why', 'Describe what you need, in your own words.'), list])
  }

  const run = async (): Promise<void> => {
    const query = field.value.trim()
    if (query === '') return offerTheExamples()

    try {
      const found = await answering(where, query)
      if (field.value.trim() !== query) return

      if (found.results.length === 0) {
        return show([
          line('p', 'why', `Nothing in the catalogue answers "${found.query}".`),
          line(
            'p',
            'why',
            found.unknownWords.length === 0
              ? 'Every word is known, and no one contract carries them all.'
              : `No contract mentions: ${found.unknownWords.join(', ')}`,
          ),
        ])
      }

      show(
        found.results.map((result) => {
          const item = document.createElement('a')
          const rendered = renderContract(result.address)

          item.className = 'answer'
          item.href = `${where.root}${rendered}/`
          item.append(
            line('span', 'name', rendered),
            line('span', 'summary', result.summary),
            ...(result.installable ? [] : [line('span', 'mark', 'not installable')]),
          )

          return item
        }),
      )
    } catch (thrown) {
      show([
        line(
          'p',
          'why',
          thrown instanceof Error ? thrown.message : 'the catalogue could not be read',
        ),
      ])
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
   * `run` and not `offerTheExamples`, so that a reader who leaves the field and comes back to a query
   * they had typed finds its results rather than the examples.
   */
  field.addEventListener('focus', () => void run())
  slot.addEventListener('focusout', (event) => {
    const moved = event.relatedTarget

    if (!(moved instanceof Node) || !slot.contains(moved)) close()
  })
  /**
   * Escape closes without leaving the field, which is the only dismissal a keyboard has.
   *
   * The focus is put back deliberately: an example is a button inside the panel, so closing while one
   * of them is focused would drop the reader on the document body, a page away from what they were
   * doing.
   */
  slot.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return

    close()
    field.focus()
  })

  slot.append(label, field, answers)
}

const start = async (): Promise<void> => {
  copyControl()
  searchControl()

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
  const { answerWritten, argumentsOf, callWritten, declaredBy } = await import('./playground.js')

  const playground = JSON.parse(declared) as ThePlayground
  const parameters: readonly ParameterRecord[] = playground.fields
  const module = (await import(new URL(playground.module, document.baseURI).href)) as Readonly<
    Record<string, (...args: readonly unknown[]) => unknown>
  >
  const call = module[playground.calls]
  const describe = playground.describes === null ? null : module[playground.describes]
  if (call === undefined || describe === undefined) return

  const form = document.createElement('div')
  const rows = playground.fields.map(labelled)
  const answer = document.createElement('pre')

  /**
   * Both halves of the surface, and the second only when there is one to show.
   *
   * A contract answers `T | null` and publishes its reason beside it, so on a refused input `call`
   * alone prints `null` and everything that tells one refusal from another is in the other export.
   * The coupling property is that a call fails exactly when it has a description, which is why the
   * second line appears exactly when the first is `null` rather than always.
   */
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
      const answered = call(...given)
      const lines = [`${callWritten(playground.calls, spelled)} → ${answerWritten(answered)}`]

      if (answered === null && describe !== null && playground.describes !== null) {
        lines.push(
          `${callWritten(playground.describes, spelled)} → ${answerWritten(describe(...given))}`,
        )
      }

      answer.textContent = lines.join('\n')
    } catch (thrown) {
      answer.textContent = thrown instanceof Error ? thrown.message : String(thrown)
    }
  }

  form.append(...rows)
  form.addEventListener('input', run)
  container.append(form, answer)
  run()
}

void start()
