import { describe, it, expect } from 'vitest'

import { renderContract } from '../registry/address.js'
import { displayed, search } from '../registry/search.js'
import type { Search } from '../registry/search.js'
import { deciding, withoutAsking } from './fixpoint.js'
import { localSource } from './local-source.js'
import { renderCatalogue, renderSearch } from './report.js'
import type { HeldRegistry } from './source.js'

/**
 * What `toopo search` puts on a terminal, which is the half of this command that is a screen.
 *
 * **The other half moved out and this file is what stayed.** The matching rule - what a query
 * answers, what it must not, and the order - is a function of `contract-index` and `refusals` and of
 * nothing a client holds, so it lives in `packages/registry/search.ts` and is measured beside itself
 * there. ADR-0136 is why it moved; what is left here is the three questions that are genuinely about
 * a terminal: what the whole catalogue looks like, what a reader is offered under a contract they
 * cannot install, and what happens to a summary too long for the width.
 *
 * The registry is read through the installer's own stand-in rather than through the registry's,
 * because what these guards are about is the screen a reader of *this command* gets, and the command
 * reads the port. A trial that reached past the port to measure the screen would be measuring a
 * rendering of answers this command never asks for.
 */

/**
 * Built once for the whole file. `localSource()` serialises five contracts and reads their files
 * every time it is called.
 */
const SOURCE = localSource()

/**
 * The answers a search needs, fetched once, so that every trial below is a synchronous decision.
 *
 * `search` reads two answers and both arrive in the first round, so warming it with one query warms
 * it for all of them - and `answering` refuses rather than fabricating if that ever stops being true,
 * because a view that quietly answered *the catalogue is empty* would turn every trial in this file
 * green at once.
 */
const { arrived: ANSWERS } = await deciding(SOURCE, (held) =>
  search(held.contractIndex(), held.refusals(), 'warm'),
)

const answering = <T>(decide: (held: HeldRegistry) => T): T => {
  const { answer, wanted } = withoutAsking(ANSWERS, decide)
  if (wanted.length > 0) throw new Error(`the warmed registry does not hold ${wanted.join(', ')}`)

  return answer
}

const searching = (query: string): Search =>
  answering((held) => search(held.contractIndex(), held.refusals(), query))

const INDEX = answering((held) => held.contractIndex()).entries

describe('what a search puts on a terminal', () => {
  /**
   * The catalogue, which is what `toopo search` with no words answers now.
   *
   * It used to be refused - *`search` needs something to look for* - which answers "you must already
   * know what you want" to the first question anybody asks. **Listing is not searching**, and the two
   * are kept apart in the grammar rather than in the matching: the guard one folder along still
   * requires a query with no words in it to answer nothing, and it would be the first casualty of
   * making an empty query mean everything.
   *
   * The refused contract is listed and marked. A catalogue that showed only what it sells would be
   * publishing its own decisions nowhere, and *the language ships this now* is the most useful thing
   * this screen has to say to somebody about to write their own grouper.
   */
  it('the-catalogue-lists-every-contract-and-marks-the-one-it-refuses', () => {
    const screen = renderCatalogue(
      INDEX.map((entry) => displayed(entry, answering((held) => held.refusals()).refusals)),
    )

    expect(screen).toContain(`The catalogue holds ${INDEX.length} contracts.`)
    expect(INDEX.filter((entry) => !screen.includes(renderContract(entry.address)))).toEqual([])
    expect(screen).toContain('typescript/array/group-by@1   not installable')
    expect(screen).toContain('toopo add <domain>/<name>')
  })

  /**
   * The screen for a contract that cannot be installed offers no command that would refuse.
   *
   * **This is the defect reading the first draft of this output caught by eye**, and it is a guard
   * rather than a memory: the draft printed `toopo add array/group-by` directly under a result it had
   * just labelled `not installable`. A reader who copies it gets a refusal, which is the product
   * contradicting itself on the first screen a stranger sees.
   */
  it('a-refused-contract-is-offered-no-install-line', () => {
    const refused = renderSearch(searching('Map.groupBy'))

    expect(refused).toContain('not installable')
    expect(refused).not.toContain('toopo add')

    expect(renderSearch(searching('slugify'))).toContain('toopo add string/slugify')
  })

  /**
   * A summary too long for the screen says that it was cut.
   *
   * `date/add@1` is the one that reaches the limit - its summary carries the error convention as well
   * as the answer - and a sentence that stopped mid-thought with no mark would read as the whole of
   * what the contract claims.
   */
  it('a-cut-summary-says-that-it-was-cut', () => {
    expect(renderSearch(searching('add days to date'))).toContain('...')
    expect(renderSearch(searching('slugify'))).not.toContain('...')
  })
})
