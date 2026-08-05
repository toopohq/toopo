/**
 * The page that says what "you can check this yourself" means, and what it does not mean.
 *
 * ---------------------------------------------------------------------------
 * The page where a project like this one destroys itself
 * ---------------------------------------------------------------------------
 *
 * The thesis is that if the verification is decorative, this project has no reason to exist. A
 * methodology page is exactly where that claim gets overstated, because it is the page whose whole
 * subject is rigour and the one nobody can check at a glance. So the rule this file is written under
 * is narrower than "be honest": **no sentence here may assert more than this repository measures**,
 * and for every figure a reader can ask where it came from and go and re-derive it.
 *
 * What that forbids in practice is prose carrying numbers. Every figure below is computed at build
 * time from two values - `servedMethodology()` through the port, and `theMeasurement()` over the
 * batteries - and nothing is transcribed. A figure typed into a paragraph is true on the day
 * it is typed and goes false silently, which is the failure this repository has caught in its own
 * documentation four times.
 *
 * ---------------------------------------------------------------------------
 * Three things this page says that a page like it usually will not
 * ---------------------------------------------------------------------------
 *
 * **The limit of the method, early and not in a footnote.** A mutation score does not say the code is
 * correct; it says the tests notice the defects that were tried. Published near the calibration rather
 * than at the end, because a reader who meets the number first has already read it as a correctness
 * claim. What makes the admission affordable rather than damaging is the corollary, which almost
 * nobody else can offer: the defects that were tried are written down, named, and readable.
 *
 * **The difference between what is asserted and what was observed.** Every figure is read off pins in
 * committed code. A replay agrees with them or fails, so the two coincide - and a reader who has run
 * nothing still holds an assertion rather than an observation. The page says which it is showing, and
 * gives the command and its cost. That is `THE_PINS_ARE_AN_ASSERTION` and `THE_REPLAY`, rendered from
 * `mutation/published.ts` rather than restated here.
 *
 * **The survivors, split by kind and never aggregated.** A count of surviving cells published as one
 * number reads as that many known holes, and that is a worse misreport than a flattering one because
 * it is believed. Exactly one of them is a debt. The others are mutants nothing could catch, behaviour
 * the contract declines to specify, rules no input in this catalogue exercises, and cells that live
 * only where a lens took the suite's sight away.
 *
 * ---------------------------------------------------------------------------
 * Why a battery's own sentence is what a reader is shown
 * ---------------------------------------------------------------------------
 *
 * Each surviving cell is rendered with the description its mutant already carries. Writing a second,
 * friendlier sentence for the page would put two statements of one judgement in two files, and the
 * page's would be the one that stopped being true - which is the failure this whole file is written
 * against. The descriptions were written for somebody reading a battery; they are argued, specific,
 * and they name what was measured, which is more than a rewrite would keep.
 */

import type {
  PublishedPopulation,
  PublishedSilence,
  PublishedSurvivor,
  TheMeasurement,
  WhySurviving,
} from '../mutation/published.js'
import {
  THE_PINS_ARE_AN_ASSERTION,
  THE_REPLAY,
  WHAT_A_SURVIVOR_MEANS_TO_A_READER,
  survivorsByKind,
} from '../mutation/published.js'
import type { VerificationStratum } from '../registry/field-map.js'
import type { ServedMethodology } from '../registry/verifiability.js'
import type { Document, Node } from './document.js'
import { el, text } from './document.js'
import { CATALOGUE_PAGE, METHOD_PAGE, linkTo, rootFrom } from './paths.js'

const NOTHING = {} as const

const line = (tag: string, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/**
 * A battery's description, with its two inline marks turned into elements.
 *
 * The sentences come from `mutation/`, where `**this**` and `` `that` `` are read by a person in an
 * editor. Printed as they are, a reader of the page sees the asterisks; parsed, they become the
 * elements they already mean. Nothing here holds raw markup - `strong` and `code` are nodes, so
 * `document.ts`'s rule that there is nowhere for an escape to be forgotten survives untouched.
 *
 * It is deliberately two marks and not a Markdown renderer. A third mark would be a feature nobody
 * asked for, and an unpaired one is left as the character it is rather than guessed at.
 *
 * **The two nest, and only the reading found that they had to.** The first version split on both
 * marks at once, so a code mark inside a bold span was swallowed by it - and P-20 of `number-parse`
 * writes exactly that, publishing the backticks around `\s` on the page. Every type was satisfied and
 * every projection guard was green; the sentence was simply wrong on screen.
 */
const asCode = (prose: string): readonly Node[] =>
  prose
    .split(/(`[^`]+`)/g)
    .filter((piece) => piece !== '')
    .map((piece) =>
      piece.startsWith('`') && piece.endsWith('`') && piece.length > 1
        ? el('code', NOTHING, text(piece.slice(1, -1)))
        : text(piece),
    )

const inline = (prose: string): readonly Node[] =>
  prose
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((piece) => piece !== '')
    .flatMap((piece) =>
      piece.startsWith('**') && piece.endsWith('**')
        ? [el('strong', NOTHING, ...asCode(piece.slice(2, -2)))]
        : asCode(piece),
    )

const paragraph = (prose: string, attributes = NOTHING): Node =>
  el('p', attributes, ...inline(prose))

/**
 * One defect, the cells of it that survive, and the battery's own account of it — once.
 *
 * **Grouped by mutant rather than listed by cell, and the reading is what decided it.** A defect
 * measured through two lenses is two cells, and the first draft printed the same paragraph twice,
 * two lines apart, for every one of them. Six of `number/parse@1`'s defects appeared as twelve
 * identical entries. Nothing was false and it was unreadable, which on this page is the same
 * failure: a reader who stops reading has not been told anything.
 *
 * The count above stays in cells, because a cell is what was measured and a mutant is not.
 */
const renderSurvivor = (survivors: readonly PublishedSurvivor[]): Node => {
  const first = survivors[0]

  return el(
    'div',
    NOTHING,
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
    paragraph(first?.description ?? '', { class: 'why' }),
  )
}

/** The survivors of one kind, gathered by the defect they are cells of, in the order they were declared. */
const byMutant = (
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
const renderKind = (population: PublishedPopulation, why: WhySurviving): readonly Node[] => {
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

/**
 * The count, and the split, in one sentence that cannot be read without the other half.
 *
 * The aggregate never appears on its own. `published.ts` refuses to export it alone and this refuses
 * to render it alone, which is one decision kept in the two places it could be broken.
 */
const renderPopulation = (population: PublishedPopulation, what: string): readonly Node[] => {
  const byKind = survivorsByKind(population)
  const kinds = (Object.keys(WHAT_A_SURVIVOR_MEANS_TO_A_READER) as readonly WhySurviving[]).filter(
    (why) => byKind[why] > 0,
  )

  return [
    paragraph(
      `${population.cells} ${what} cells, ${population.killed} caught. The other ` +
        `${population.surviving.length} are ` +
        kinds.map((why) => `${byKind[why]} ${why.replaceAll('-', ' ')}`).join(', ') +
        `. Each one is below, with the sentence its own battery carries about it.`,
    ),
    ...kinds.flatMap((why) => renderKind(population, why)),
  ]
}

const renderSilences = (silences: readonly PublishedSilence[], heading: string): readonly Node[] => [
  line('h3', `${silences.length} — ${heading}`),
  el(
    'ul',
    { class: 'plain' },
    ...silences.map((silence) =>
      el(
        'li',
        NOTHING,
        el('p', { class: 'call' }, line('code', `${silence.battery} · ${silence.what.join(', ')}`)),
        paragraph(silence.reason, { class: 'why' }),
      ),
    ),
  ),
]

const renderStratum = (
  methodology: ServedMethodology,
  stratum: VerificationStratum,
): readonly Node[] => {
  const fields = Object.entries(methodology.fields)
    .filter(([, held]) => held === stratum)
    .map(([path]) => path)

  return [
    line('h3', `${fields.length} — ${stratum.replaceAll('-', ' ')}`),
    paragraph(methodology.strata[stratum]),
    line('p', fields.join(', '), { class: 'meta' }),
  ]
}

export const methodologyPage = (
  methodology: ServedMethodology,
  measured: TheMeasurement,
): Document => ({
  title: 'How Toopo verifies, and what that does not prove',
  description:
    `Every contract here is measured by breaking the code on purpose and requiring the tests to go ` +
    `red. ${measured.defects.cells} defects, what they caught, and every one they did not.`,
  body: [
    el('nav', NOTHING, el('a', { href: rootFrom(METHOD_PAGE) }, text('Toopo'))),

    line('h1', 'How we verify'),
    line(
      'p',
      'A test suite that has never failed proves nothing at all. So every contract in this ' +
        'catalogue is measured the only way a test can be: by breaking the implementation on ' +
        'purpose, one defect at a time, and requiring the suite to notice.',
      { class: 'lede' },
    ),

    line('h2', 'The apparatus is calibrated before anything is measured'),
    line(
      'p',
      'A run that is stuck red catches everything and means nothing; a run that is stuck green ' +
        'catches nothing and looks like a clean bill of health. So each battery names one obvious ' +
        'defect and refuses to measure anything until two things have happened in front of it: the ' +
        'unmutated code passes, and that obvious defect fails. Neither half alone is a calibration.',
    ),
    line(
      'p',
      'A run also counts the tests it collected and compares them with a figure declared per file, ' +
        'because a configuration that quietly collects a fraction of the suite leaves every result ' +
        'agreeing with itself. That has happened here three times, all three by accident.',
    ),

    line('h2', 'What this does not prove'),
    line(
      'p',
      'A high score does not say the code is correct. It says the tests notice the defects that ' +
        'were tried.',
      { class: 'lede' },
    ),
    line(
      'p',
      'That is the whole limit of the method, and it is worth stating plainly because the number ' +
        'below reads like a correctness claim and is not one. What makes it worth publishing anyway ' +
        'is the part almost nobody else can offer: the defects that were tried are not a summary or ' +
        'a percentage. They are written down, named, and readable — every one of them is a committed ' +
        'file in this repository, with the exact edit it makes and the verdict it must produce.',
    ),

    line('h2', 'What the tests catch'),
    line('p', THE_PINS_ARE_AN_ASSERTION),
    line(
      'p',
      `${THE_REPLAY.command} is what turns it into something you have watched happen: it ` +
        `${THE_REPLAY.what} Then ${THE_REPLAY.thenTotalledBy} adds it up. One run of it over the ` +
        `${measured.batteries} batteries took ${THE_REPLAY.duration}, measured at ` +
        `${THE_REPLAY.measuredAt}; ${THE_REPLAY.spread}.`,
    ),
    ...renderPopulation(measured.defects, 'defect'),

    line('h2', 'Questions rather than defects'),
    line(
      'p',
      'A probe asks whether a region of a contract can be reached at all, rather than whether a ' +
        'defect in it is caught. It never enters the score, because a probe that survives is that ' +
        'question answered no — and folding it in would measure the question instead of the contract.',
    ),
    ...renderPopulation(measured.probes, 'probe'),

    line('h2', 'Guards no defect here reddens'),
    line(
      'p',
      'Publishing these is the same decision as publishing the survivors. A guard that never goes ' +
        'red is either out of a battery\'s reach by construction, or it marks a region no defect has ' +
        'been written for yet — and those are different things, so each battery says which of the ' +
        'two each of its silent guards is. The second list is a measurement of the battery, not of ' +
        'the guards: what it asks for is more defects.',
    ),
    ...renderSilences(measured.outOfReach, 'out of a battery\'s reach by construction'),
    ...renderSilences(measured.unprobed, 'regions no defect here probes'),

    line('h2', 'Reading a contract with one eye shut'),
    line(
      'p',
      `Some contracts are measured twice: once as they are, and once through a lens that takes part ` +
        `of the suite's sight away — the failure reason unread, the declared type unchecked, the ` +
        `table of settled cases blind. The difference between the two columns is what that half of ` +
        `the contract is worth, stated as a number instead of asserted. There are ` +
        `${measured.lenses} such readings over the ${measured.batteries} batteries.`,
    ),

    line('h2', 'What you can check yourself'),
    line(
      'p',
      'None of the following needs us to be honest, and none of it needs the registry to be ' +
        'reachable when you check. Each says what it establishes and, beside it, what it still does ' +
        'not.',
    ),
    el(
      'ul',
      { class: 'plain' },
      ...methodology.verifiable.map((claim) =>
        el(
          'li',
          NOTHING,
          el('p', { class: 'call' }, ...inline(claim.claim)),
          paragraph(`By ${claim.by}.`, { class: 'why' }),
          paragraph(`This does not establish ${claim.butNot}.`, { class: 'meta' }),
        ),
      ),
    ),

    line('h2', 'What you have to take from us'),
    line(
      'p',
      'The longer list, and that is the honest shape rather than a failure. Nearly all of it is the ' +
        'registry\'s own opinion — which implementation is recommended, what a machine measured, ' +
        'what we chose to call something. Two entries are outside what any arithmetic reaches, ' +
        'whatever anybody publishes. Where something narrows a claim, it is named; where nothing ' +
        'does, that is said rather than left blank.',
    ),
    el(
      'ul',
      { class: 'plain' },
      ...methodology.mustBeBelieved.map((claim) =>
        el(
          'li',
          NOTHING,
          el('p', { class: 'call' }, ...inline(claim.claim)),
          line('p', claim.nature, { class: 'meta' }),
          paragraph(
            claim.mitigation === null
              ? 'Nothing narrows this.'
              : `What narrows it: ${claim.mitigation}`,
            { class: 'why' },
          ),
        ),
      ),
    ),

    line('h2', 'Field by field'),
    line(
      'p',
      `A contract is a record, and not every field of it is checked the same way. Each of the ` +
        `${Object.keys(methodology.fields).length} fields carries the stratum it is verified at, so ` +
        `you are told which sentences no run could falsify instead of being left to assume they were ` +
        `all checked.`,
    ),
    ...(Object.keys(methodology.strata) as readonly VerificationStratum[]).flatMap((stratum) =>
      renderStratum(methodology, stratum),
    ),

    line('h2', 'The draws are re-seeded every run'),
    paragraph(
      `The property tests are not run against a frozen sample. ${methodology.seeding.whyNotFrozen}. ` +
        `So your run is a different sample of the same properties, and a run of ours passing is not ` +
        `a promise that yours will draw what ours drew.`,
    ),
    paragraph(
      `A verdict is taken from ${methodology.seeding.verdictRuns} run and an attribution — which ` +
        `guard caught which defect — from the intersection of ${methodology.seeding.attributionRuns}. ` +
        `Measured: ${methodology.seeding.measurement}`,
    ),

    line('h2', 'What a signature does not prove'),
    paragraph(methodology.whatASignatureDoesNotProve),

    el(
      'p',
      NOTHING,
      el('a', { href: linkTo(rootFrom(METHOD_PAGE) + CATALOGUE_PAGE) }, text('Back to the catalogue')),
    ),
  ],
})
