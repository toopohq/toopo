/**
 * The page the whole catalogue fits on, which at five contracts is the whole site's navigation.
 *
 * It is deliberately not a search, and there is one in the masthead since ADR-0137 - the two answer
 * different readers rather than the same one twice. What a catalogue of five needs is to be *read*,
 * and a list a reader can take in at once beats a box they have to guess a word for. **What the field
 * is for is the reader who knows what they need and not what it is called**, which no list answers at
 * any size.
 *
 * The clause that has gone from here is *search is a unit of its own and `packages/cli/search.ts`
 * holds the matching rule it will be built on*. It was right about where the rule was and wrong about
 * where it would stay: `packages/registry/search.ts` holds it, because two surfaces needed it.
 *
 * A contract the catalogue refused is listed and carries no install command, which is the rule
 * `toopo search` already follows on the terminal: it must be findable, because somebody who has heard
 * of it deserves to be told the catalogue considered it and why, and it must never be offered.
 *
 * ADR-0123 is the two columns: the content column is the catalogue, and the column beside it is
 * everything this page says that is not what the catalogue holds.
 */

import type { TheMeasurement } from '../../mutation/published.js'
import { THE_COMMANDS } from '../cli/arguments.js'
import { THE_INVOCATION, renderContract } from '../registry/address.js'
import type { ServedIndex, ServedRefusals } from '../registry/response.js'
import type { Document, Node, Tag } from './document.js'
import { el, text } from './document.js'
import { paragraph } from './marks.js'
import { figure, grouped } from './quantity.js'
import type { Domain } from './catalogue.js'
import type { MenuEntry } from './chrome.js'
import { masthead } from './chrome.js'
import {
  CATALOGUE_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
  WHAT_A_CONTRACT_IS_PAGE,
  domainPageOf,
  linkTo,
  pageOf,
} from './paths.js'

const NOTHING = {} as const

const line = (tag: Tag, value: string, attributes = NOTHING): Node =>
  el(tag, attributes, text(value))

/**
 * A block of the column: a heading the outline keeps, and then whatever the block is.
 *
 * The tag is the outline and the class is the look, which is the whole of why these are `h2` at all.
 * Moving three sections into a narrow column changed where they are on a screen and nothing else: the
 * reading, the Markdown twin and the sitemap see the same page they saw before. `.call` takes the
 * section rule and the standing margin off a heading that titles a block rather than opening a
 * section of prose, and `.rail-label` is the look every other label of a column already has.
 */
const block = (heading: string, ...body: readonly Node[]): Node =>
  el('section', NOTHING, line('h2', heading, { class: 'call rail-label' }), ...body)

export const cataloguePage = (
  index: ServedIndex,
  refusals: ServedRefusals,
  domains: readonly Domain[],
  menu: readonly MenuEntry[],
  measured: TheMeasurement,
): Document => ({
  title: 'Toopo — utility functions with a public, executable contract',
  /** A list of contracts is not source code, and the only `@type` this site publishes is. */
  servedBesideItsMarkdown: true,
  structuredData: null,
  /**
   * Counted over the installable entries rather than over the index, because a refused contract has
   * no published contract behind it: `refuseContract` records an argument and binds no digest, so
   * `array/group-by@1` has no signature, no invariants and no frozen definition to have. Saying *each*
   * of five would have been the front page's first sentence contradicting its own refusals page.
   */
  description:
    `${index.entries.filter((entry) => entry.installable).length} utility functions with a ` +
    `published contract: a signature, property-based invariants, and every edge case named and ` +
    `settled. The source is copied into your project.`,
  body: [
    masthead(CATALOGUE_PAGE, menu),
    el(
      'div',
      { class: 'shell' },
      el(
        'main',
        NOTHING,
        line('h1', 'Toopo'),
        line(
          'p',
          'Utility functions you copy into your project, each verified against a public, executable ' +
            'contract. Not a dependency: the source lands in your repository and it is yours.',
          { class: 'lede' },
        ),

        /**
         * The shape of every command this catalogue answers, on the one page that is about all of them.
         *
         * **It is not `pre.install`, and the difference is that this one cannot be run.** That class is
         * what `start.ts` finds to put a copy control beside, and a control offering to copy a command
         * that answers *no such contract* is the class of defect `chrome.ts` refuses the search field
         * for: a control that lies about what it does. A reader is told the shape and sent to the page
         * that carries the real one.
         *
         * `THE_INVOCATION` rather than the bare word, and the guard over it reaches this line because an
         * install instruction is recognised by naming an address - which this does, in the only spelling
         * that names every address at once.
         */
        el('pre', { class: 'shape' }, el('code', NOTHING, text(`${THE_INVOCATION} add domain/function`))),
        /**
         * `.meta` and not `.why`, on two readings taken in a browser. That class ends at zero, because
         * every other thing it labels is followed by something it belongs to - so the note ran into the
         * paragraph after it. And it carries no size, so the note was set at the body's, competing with
         * the sentence it is a footnote to.
         */
        line(
          'p',
          'Every contract carries its own command, on its own page. This is the shape of all of them.',
          { class: 'meta' },
        ),

        line(
          'p',
          /**
           * It used to read *implementations compete underneath it and are interchangeable*, which
           * describes a catalogue this one is not: every contract here has exactly one implementation,
           * ours. A conditional is what survives - anything satisfying the contract can replace anything
           * else that does - because it is true of a catalogue with one implementation and of a catalogue
           * with twenty, and it is the claim the contract actually makes. No count is written, for the
           * reason this repository keeps rediscovering in its own prose: a number in a sentence outlives
           * the data it counted.
           */
          'A contract is the whole behavioural specification of one function — its signature, the ' +
            'invariants that must hold for every input, and every edge case named, settled and argued ' +
            'for. Anything that satisfies it can replace anything else that does, which is what makes ' +
            'an implementation a detail. The contract is what this project publishes; the code is what ' +
            'it hands you.',
        ),

        line('h2', `${index.entries.length} contracts`),
        /**
         * Two abreast where there is room for two and one where there is not, and the floor is what says
         * which. `--a-contract-in-a-list` is a measure, so the track resolves to two columns exactly
         * where the content column is two measures wide - no width is written here, and no breakpoint
         * exists to be wrong about. Whether an index of five reads better in one column or two is a
         * judgement that will be taken again, and it is taken on that one length.
         */
        el(
          'ul',
          { class: 'plain contracts' },
          ...index.entries.map((entry) =>
            el(
              'li',
              NOTHING,
              /**
               * A contract's name is a heading that happens to be a link, and it used to be a bare anchor.
               *
               * Read in document order it came out as `typescript/number/parse@1Convert a string to a
               * finite number` - an anchor is phrasing content and carries no separator, so the summary
               * began mid-line, on the first screen of the site. **The repair is here rather than in the
               * separator table, and the measurement is what says so:** across the seven pages there is not
               * one anchor written inside a sentence, and nine of the fourteen a reader can see are already
               * the sole child of an element that separates. Giving `a` a separator would state something
               * about a phrasing element that is false of every other phrasing element beside it, to repair
               * five places where the mistake is that a title was not written as one.
               *
               * The tag is the outline and the class is the look, which is what settles both halves at once.
               * The tag, because the refusals page already renders this exact pair - an address and the
               * summary under it - as a heading and a paragraph, and two renderings of one thing drift until
               * one lies: the front page's outline held its four sections and not one contract name, on the
               * page that *is* this site's navigation. The class, because 121 of the 126 list items here
               * open with `.call` and these five are the only departure.
               *
               * **The link does not branch.** Every entry goes to the address its contract has,
               * installable or not: it used to send a refused one to the refusals page, and that branch
               * went when a refusal became a state of a contract rather than a page of its own. What
               * still branches is the line under it, which is about a command and is a different
               * question. ADR-0127.
               */
              el(
                'h3',
                { class: 'call' },
                el(
                  'a',
                  { href: linkTo(pageOf(entry.address)) },
                  text(renderContract(entry.address)),
                ),
              ),
              line('p', entry.summary, { class: 'why' }),
              line(
                'p',
                entry.installable
                  ? `${THE_INVOCATION} add ${entry.address.name}`
                  : 'Considered and turned down — the measurement it was refused on is on its page.',
                { class: 'meta' },
              ),
            ),
          ),
        ),

      ),

      /**
       * Everything the front page says that is not what is in the catalogue.
       *
       * **Nothing here is new prose and nothing was written twice.** These are the page's own
       * secondary sections, moved out of the one column they used to queue in - a reader who had come
       * to see what the catalogue holds met a summary of the domains before the list, and three more
       * sections after it. What the column buys is that all of them are visible while the list is
       * being read, which is what a wide screen is for and what no amount of vertical order can give.
       *
       * **The order changed with the move, and on a narrow screen that is the whole of what a reader
       * gets.** Measured in a browser at 390: with the contribution section left in the content
       * column, the reading ran pitch, catalogue, contribution, measurement - which puts the claim
       * this project is sold on below a section addressed to the few people who will send something.
       * So the split is not *long prose stays, short prose moves*: it is that the content column is
       * the catalogue and the column beside it is everything else. The measurement comes first of
       * those, because it is the claim a visitor is deciding whether to believe.
       *
       * **The four figures are the only matter this unit adds to the site.** They are derived from
       * the batteries by `theMeasurement`, so they cannot go stale the way a number typed into a
       * sentence does - which is the failure this repository has caught in its own prose more than
       * once. There is no survivor total among them: a count of what got past is read as a count of
       * holes wherever its split is not beside it, which is the rule `mutation/readme.test.ts`
       * already keeps one surface over, and the sentence under the figures says where the split is.
       */
      el(
        'aside',
        { class: 'aside' },
        block(
          'How we verify',
          el(
            'div',
            { class: 'figures' },
            figure(grouped(measured.defects.cells), 'defect cells injected'),
            figure(grouped(measured.defects.killed), 'caught by the suite'),
            figure(grouped(measured.batteries), 'batteries, replayable'),
          ),
          /**
           * **The clause after the figures is owed to the reader who does not follow the link.**
           * `the-readme-never-gives-a-survivor-total-without-its-split` exists because a bare figure
           * misleads exactly the person who stops reading, and this block publishes two of them on the
           * surface a stranger meets first. The method page's *What this does not prove* is a section
           * and is not copied here; what is here is the one thing those two numbers do not say by
           * themselves. ADR-0131.
           */
          line(
            'p',
            'A test suite that has never failed proves nothing. Every contract here is measured by ' +
              'breaking the implementation on purpose and requiring the suite to notice — and what ' +
              'those measurements did not catch is published beside what they did. They measure what ' +
              'the tests notice, which is not the same as what the code does.',
          ),
          el(
            'p',
            NOTHING,
            el('a', { href: linkTo(METHOD_PAGE) }, text('How we verify, and what it does not prove')),
          ),
        ),

        /**
         * The domains, beside the contracts rather than above them.
         *
         * At five contracts the list is the navigation and this is a second way into the same five,
         * which is a cost. It is here because the shape that survives a thousand contracts is the one
         * worth building at five, and because a domain page is now the address a reader lands on from
         * a search for `slugify javascript` and climbs one level from.
         *
         * **Every domain the index files a contract under is here, including the one that publishes
         * nothing.** This paragraph said the opposite for three commits - *a domain with nothing
         * installable in it has no page and is not here* - and ADR-0126 had already given `array` a
         * page and this list a fourth chip. The list is `domains`, so the chip appeared and the
         * sentence above it did not, which is this repository's own recurring defect committed here by
         * the unit that fixed it one file over. ADR-0126.
         *
         * Chips and not a list, which is the existing look for *a short set of addresses* on this
         * site. As a list each domain took a rule, a heading and a line to carry one word, so three
         * domains filled as much of the front page as the five contracts under them - which is a
         * section shouting over the one it is a summary of.
         *
         * No count on a chip, and the mock-up this departs from draws one. It would read `number 1`
         * in every projection but the visual one, and applied to what is really here every line would
         * say `1`, `1`, `2` - which makes the catalogue look empty in the one place that summarises
         * it. The count of a domain is on that domain's page, in a sentence that says what it counts.
         */
        block(
          'Domains',
          el(
            'ul',
            { class: 'chips' },
            ...domains.map((domain) =>
              el(
                'li',
                NOTHING,
                el(
                  'a',
                  { href: linkTo(domainPageOf(domain.address)) },
                  text(domain.name),
                ),
              ),
            ),
          ),
        ),

        ...(refusals.refusals.length === 0
          ? []
          : [
              block(
                'What we refuse',
                line(
                  'p',
                  `${refusals.refusals.length} of these ${index.entries.length} ` +
                    `${refusals.refusals.length === 1 ? 'was' : 'were'} written in full and then ` +
                    `turned down. What they were turned down for, and the measurement each decision ` +
                    `rests on, is published beside them.`,
                ),
                el(
                  'p',
                  NOTHING,
                  el('a', { href: linkTo(REFUSALS_PAGE) }, text('What we refuse, and why')),
                ),
              ),
            ]),

        /**
         * The question every visitor arrives with, answered in one sentence and then handed on.
         *
         * **This block used to carry three arguments in one paragraph** - a contract is frozen for
         * life, an implementation freezes nothing, a contribution is never a contract - stacked in a
         * box beside a list, on the surface a stranger meets first. They are sections of their own
         * page now, and ADR-0119's cut is the same one: what they gain is room rather than words.
         *
         * **A sentence stays rather than only a link, and the reason is a click.** *Never a contract*
         * is the answer a visitor came for, and deferring five words by one click is friction where
         * deferring a paragraph is a gain. ADR-0129.
         *
         * **It carries no link, and that is the page's own guard rather than an omission.**
         * `every-page-is-reachable-from-the-front-page` compares every `href` here against the set of
         * pages, so an address outside the site cannot be written on this page at all - and there is
         * no address to write: this repository has no public remote, and inventing a URL to fill the
         * gap is the class the whole project spends its length removing. So the file is named and not
         * linked.
         *
         * **`CONTRIBUTING.md` moved with the argument it belongs to** and is named on the page that
         * now carries it. Restating the ratio that argument rests on was refused here and is refused
         * there for the same reason: a guard derives it from the five records in `CONTRIBUTING.md`
         * itself, and a sentence that is true without counting does not count.
         */
        /**
         * **The six commands, read from the rows the client prints and never described beside them.**
         * `THE_COMMANDS` is what `USAGE` renders for a terminal, so the help a user types and the
         * page a visitor reads are one value - which is ADR-0129's move on a second surface, and the
         * reason this section could be written at all: the data existed and the site said nothing.
         *
         * **The sentence above them is permanent rules 1 and 2 said to a visitor, and it was checked
         * rather than transcribed from the mock-up.** `command.ts` states that nothing this tool does
         * needs a package manager to have been used, `a-project-with-no-package-json-installs-normally`
         * is the guard, and `write.ts` writes the feature's files, the configuration and the lockfile
         * and nothing else. ADR-0131.
         */
        block(
          'What the command does',
          line(
            'p',
            'It copies files. Nothing is added to your package.json, nothing of ours runs in your ' +
              'build, and a lockfile records what was served and what was written — so a file you ' +
              'edited is never overwritten and one that moved is named.',
          ),
          el(
            'ul',
            { class: 'plain' },
            ...THE_COMMANDS.map((command) =>
              el(
                'li',
                NOTHING,
                paragraph(`\`${command.name}\` — ${command.does}.`),
              ),
            ),
          ),
        ),
        block(
          'What a contract is',
          line(
            'p',
            'The whole specification of one function: its signature, the invariants that must ' +
              'hold for every input, and every edge case named, settled and argued for. A ' +
              'contribution can be an implementation, or an input where ours is wrong — never a ' +
              'contract.',
          ),
          el(
            'p',
            NOTHING,
            el(
              'a',
              { href: linkTo(WHAT_A_CONTRACT_IS_PAGE) },
              text('A contract is the whole specification of one function'),
            ),
          ),
        ),
      ),
    ),
  ],
})
