/**
 * The page a reader arrives at, which is a door and nothing else.
 * ADR-0140 is why it holds three things, where each door leads, and why the catalogue moved.
 *
 * ---------------------------------------------------------------------------
 * Three things, and the two that are not here
 * ---------------------------------------------------------------------------
 *
 * The name, a way into the catalogue, and a way to understand what is in there. That is the whole
 * page.
 *
 * **There is no install command on it, and that is the repair rather than an omission.** The shape of
 * every command at once stood here as `add domain/function` so that no contract was privileged on the
 * page that represents them all - the constraint was right and the form was a template, which is a
 * thing a reader sees. A command belongs to a contract, so it is on every contract's page and on none
 * of the pages that are about the catalogue.
 *
 * **And there is nothing here about how this catalogue is verified**, which is what the whole project
 * rests on. It is one link away, in the masthead of this and every other page. The absence is the
 * shape the owner asked for and it is recorded rather than smoothed over: ADR-0140 carries it as the
 * one cost this page pays.
 */

import type { ServedIndex } from '../registry/response.js'
import type { Document, Node } from './document.js'
import { el, text } from './document.js'
import type { MenuEntry } from './chrome.js'
import { masthead } from './chrome.js'
import { CATALOGUE_PAGE, FRONT_PAGE, WHAT_A_CONTRACT_IS_PAGE, linkTo } from './paths.js'

const NOTHING = {} as const

/** A count and the word it counts, so that a sixth contract does not need a sentence rewritten. */
const said = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`

/**
 * What is behind the catalogue door, composed from the catalogue and never written out.
 *
 * Every term is read off the index: the contracts, the domains they are filed under, and how many of
 * them were turned down. A sixth contract lands in this sentence with nobody editing it, which is the
 * treatment a domain page's own opening already gets. ADR-0121.
 */
const whatIsInThere = (index: ServedIndex): string => {
  const contracts = index.entries.length
  const domains = new Set(index.entries.map((entry) => entry.domain)).size
  const turnedDown = index.entries.filter((entry) => !entry.installable).length

  return (
    `${said(contracts, 'contract', 'contracts')} over ${said(domains, 'domain', 'domains')}` +
    `${turnedDown === 0 ? '' : `, ${turnedDown} turned down`}.`
  )
}

/**
 * One door: where it goes, what it is called, and one line saying what is behind it.
 *
 * A block link rather than a heading with a link in it, because the whole of it is the target - a
 * reader aiming at a door should not have to hit the words. Its two parts are paragraphs and not a
 * heading with a line under it: the outline of this page is its `h1` and nothing else, which is what
 * a page holding one heading and two doors should read as, and two blocks are what keeps the name
 * and the line under it from running into each other in every projection.
 */
const door = (to: string, name: string, what: string): Node =>
  el(
    'a',
    { class: 'door-to', href: linkTo(to) },
    el('p', { class: 'name' }, text(name)),
    el('p', { class: 'what' }, text(what)),
  )

export const frontPage = (index: ServedIndex, menu: readonly MenuEntry[]): Document => ({
  title: 'Toopo — utility functions with a public, executable contract',
  servedBesideItsMarkdown: true,
  structuredData: null,
  description:
    `${index.entries.filter((entry) => entry.installable).length} utility functions with a ` +
    `published contract: a signature, property-based invariants, and every edge case named and ` +
    `settled. The source is copied into your project.`,
  body: [
    masthead(FRONT_PAGE, menu),
    el(
      'div',
      { class: 'shell' },
      el(
        'main',
        { class: 'door' },
        el('h1', NOTHING, text('Toopo')),
        el(
          'p',
          { class: 'lede' },
          text(
            'Utility functions you copy into your project, each verified against a public, ' +
              'executable contract. Not a dependency: the source lands in your repository and it ' +
              'is yours.',
          ),
        ),
        el(
          'div',
          { class: 'doors' },
          door(CATALOGUE_PAGE, 'The catalogue', whatIsInThere(index)),
          door(
            WHAT_A_CONTRACT_IS_PAGE,
            'What a contract is',
            'The specification every one of them carries, and what it guarantees for the life of ' +
              'its major version.',
          ),
        ),
      ),
    ),
  ],
})
