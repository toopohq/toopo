/**
 * How this site writes a defect its own suite did not catch, and the one place it is written.
 * ADR-0130 is the second page that needed it; the method page is the first.
 *
 * **This is `quantity.ts`'s argument on a third subject, and it arrived the same way.** Both of those
 * lived beside the page that needed them first, which was right while one page needed them - and a
 * second copy of a rendering decision is two statements of one thing that drift until one lies. The
 * contract page is the second reader here, so the rendering moved before there were two of it rather
 * than after.
 *
 * ---------------------------------------------------------------------------
 * A survivor is a cell, and the same defect can be several
 * ---------------------------------------------------------------------------
 *
 * A defect is measured once per lens, so one mutant surviving on two lenses is two surviving cells.
 * Rendered one entry each, six of `number/parse@1`'s defects appeared as twelve identical paragraphs
 * two lines apart - nothing false and unreadable, which on a page whose subject is what got past is
 * the same failure: a reader who stops reading has not been told anything.
 *
 * **The count stays in cells and the list is gathered by defect.** A cell is what was measured and a
 * mutant is not, so the figure a page publishes is a count of cells; what a reader is handed is one
 * entry per defect, naming the cells it survived on.
 */

import type {
  PublishedPopulation,
  PublishedSurvivor,
  WhySurviving,
} from '../../mutation/published.js'
import { WHAT_A_SURVIVOR_MEANS_TO_A_READER } from '../../mutation/published.js'
import type { Node, Tag } from './document.js'
import { el, text } from './document.js'
import { paragraph } from './marks.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/**
 * One defect, as the cells it survived on and the sentence its battery already carries.
 *
 * **The description is the instrument's and is never rewritten here.** A page that reworded why a
 * defect got past would be a second opinion about a measurement, written where nobody would look for
 * one - which is the whole reason `published.ts` is a door rather than an import of whatever is
 * useful.
 */
export const renderSurvivor = (survivors: readonly PublishedSurvivor[]): Node => {
  const first = survivors[0]

  return el(
    'div',
    { class: 'stacked' },
    el(
      'div',
      { class: 'what' },
      el(
        'p',
        { class: 'call' },
        line('code', `${first?.battery ?? ''} · ${first?.mutant ?? ''}`),
        text(
          survivors.length === 1
            ? ` on ${first?.cell ?? ''}`
            : ` on ${survivors.map((one) => one.cell).join(' and ')}`,
        ),
      ),
    ),
    el('div', { class: 'argument' }, paragraph(first?.description ?? '')),
  )
}

/** Surviving cells gathered by the defect they are cells of, in the order they were declared. */
export const byMutant = (
  survivors: readonly PublishedSurvivor[],
): readonly (readonly PublishedSurvivor[])[] => {
  const gathered = new Map<string, PublishedSurvivor[]>()

  for (const survivor of survivors) {
    const key = `${survivor.battery} ${survivor.mutant}`
    gathered.set(key, [...(gathered.get(key) ?? []), survivor])
  }

  return [...gathered.values()]
}

/**
 * One kind of survivor, its meaning, how many there are, and every one of them.
 *
 * A kind with nothing in it is not rendered, for the reason the refusals page drops an empty section:
 * a heading over nothing tells a reader something is missing without telling them what.
 */
export const renderKind = (population: PublishedPopulation, why: WhySurviving): readonly Node[] => {
  const theirs = population.surviving.filter((survivor) => survivor.why === why)
  if (theirs.length === 0) return []

  const defects = byMutant(theirs)

  return [
    line(
      'h3',
      `${theirs.length} ${
        theirs.length === defects.length
          ? ''
          : `cells of ${defects.length} defect${defects.length === 1 ? '' : 's'} `
      }— ${why.replaceAll('-', ' ')}`,
    ),
    paragraph(WHAT_A_SURVIVOR_MEANS_TO_A_READER[why]),
    el('div', { class: 'cases' }, ...defects.map(renderSurvivor)),
  ]
}
