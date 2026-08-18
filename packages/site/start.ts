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

import type { ParameterRecord } from '../registry/contract-record.js'
import type { PlaygroundField } from './playground.js'
import { answerWritten, argumentsOf, callWritten, declaredBy } from './playground.js'

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

const start = async (): Promise<void> => {
  copyControl()

  const container = document.getElementById('playground')
  const declared = container?.dataset['playground']
  if (container === null || declared === undefined) return

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
