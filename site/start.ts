/**
 * The only module of this repository that runs in somebody else's browser.
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
import { answerWritten, argumentsOf } from './playground.js'

/** What the page hands over in `data-playground`, written by `contract-page.ts`. */
type ThePlayground = {
  readonly calls: string
  readonly module: string
  readonly fields: readonly {
    readonly name: string
    readonly type: string
    readonly opensOn: string
    readonly constructedBy: string | null
  }[]
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

const start = async (): Promise<void> => {
  const container = document.getElementById('playground')
  const declared = container?.dataset['playground']
  if (container === null || declared === undefined) return

  const playground = JSON.parse(declared) as ThePlayground
  const parameters: readonly ParameterRecord[] = playground.fields
  const module = (await import(new URL(playground.module, document.baseURI).href)) as Readonly<
    Record<string, (...args: readonly unknown[]) => unknown>
  >
  const call = module[playground.calls]
  if (call === undefined) return

  const form = document.createElement('div')
  const rows = playground.fields.map(labelled)
  const answer = document.createElement('pre')

  const run = (): void => {
    try {
      const given = argumentsOf(parameters, [...form.querySelectorAll('input')].map((one) => one.value))

      answer.textContent = `${playground.calls}(…) → ${answerWritten(call(...given))}`
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
