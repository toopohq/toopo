/**
 * The shapes this site draws more than once, each owning its markup and the rules that paint it.
 * ADR-0183 is the layer and the mechanism under it; ADR-0182 is the artboard it draws from.
 *
 * ---------------------------------------------------------------------------
 * What this is for, which is a mechanism rather than a folder of helpers
 * ---------------------------------------------------------------------------
 *
 * The stylesheet declared ninety-two class names and eleven page modules composed them by hand, so
 * nothing stopped two pages drawing one thing differently - and four times, nothing did:
 *
 * 1. **The pill.** `ul.chips a` was written for the contract page's group bar; the front page reused
 *    the container name `chips`, and that rule - `(0,1,2)` against `a.chip`'s `(0,1,1)` - won. Measured
 *    at `f5bab84` in a browser: the four domain pills rendered at `16px` radius, `4px 12px`, `11px`,
 *    27.81px tall, where the artboard draws `6px`, `5px 11px`, `12px`, 28px. **`all` escaped only by
 *    being a `span`**, which no `a` selector reaches - so the one pill the owner could see was square
 *    was the only one that was right.
 * 2. **The copy control.** `start.ts` writes `button.className = 'copy'` once and puts it on every
 *    `pre.install`, so the markup was already one thing. The rules were two: `pre.install .copy`
 *    painted it with no ground, no border and a hairline on one side, and `.offers .install .copy`
 *    painted the artboard's bordered button. Measured live at `f5bab84`: radius `0px` against `5px`,
 *    `13px` against `11px`, 37.05px tall against 25.81px.
 * 3. **The section label**, at `.08em` on the front page and `.09em` on the contract page.
 * 4. **The card**, where `.card` already meant the contract page's card and the front page's card had
 *    to be reached as `.offers > li`.
 *
 * Every one of the four is the same fault: **a component was painted from its container** rather than
 * from itself, so its look belonged to whichever page it happened to stand in.
 *
 * ---------------------------------------------------------------------------
 * The mechanism, which is what separates this from a rename
 * ---------------------------------------------------------------------------
 *
 * A component is a member of a **closed union**, and its class name *is* its name - derived by
 * `classOf` and typed nowhere. So the string `pill` exists once, and a second drawing of a pill needs
 * a second member, which needs a second entry in a total `Record<Component, Drawing>` - and two
 * entries under one key do not compile. **Two drawings of one thing is now a type error rather than a
 * thing nobody noticed.**
 *
 * A drawing writes its selectors against `&`, which `paintedBy` replaces with the component's own
 * class. A component therefore *cannot* write a selector that paints something else: there is no way
 * to spell one. That is the shape ADR-0054 asks for and `document.ts` already uses for `Tag` - the
 * wrong thing is unwritable rather than forbidden.
 *
 * What no type reaches is the other direction: a rule elsewhere in the sheet reaching *in*, which is
 * what `ul.chips a` did without ever naming `.chip`. No reading of the selector text finds that - it
 * is a question about which elements a selector matches, and the answer is the matcher's.
 * `a-component-is-painted-by-its-own-rules-and-by-nothing-else` asks the matcher, over every element
 * of every page this site emits.
 *
 * ---------------------------------------------------------------------------
 * What a component is, and what is merely a page's own section
 * ---------------------------------------------------------------------------
 *
 * A shape earns a component when it is drawn in more than one place, or when the artboard draws it as
 * a repeated unit. A section that occurs once on one page is that page's, and putting it here would
 * make this module the place every class lives - which is the ninety-two class names again with an
 * import in front of them.
 *
 * **The search field is deliberately not here, and the reason is a reading rather than a scope.** Its
 * two rules do diverge - the masthead's paints `--paper` at `7px` in mono, the hero's `--wash` at
 * `8px` inheriting - but the artboard does not draw one control at two sizes: it draws a **button that
 * opens a command palette** in the masthead and a **search input** in the hero. Whether those are one
 * component is a question about whether this site grows a palette, and it is not settled by this unit.
 */

import type { Attributes, Node, Tag } from './document.js'
import { el, text } from './document.js'
import type { HighlightedRun } from './highlight.js'
import { THE_SYNTAX_INKS } from './highlight.js'

const NOTHING = {} as const

/**
 * Every shape this site draws more than once.
 *
 * Closed, because the whole mechanism rests on it: a member is a class name, a total map over the
 * union is what makes a second drawing a duplicate key, and a union that could be widened by writing a
 * string would be a convention with a type annotation on it.
 */
export type Component =
  | 'pill'
  | 'badge'
  | 'copy'
  | 'offer'
  | 'eyebrow'
  | 'snippet'
  | 'prime'
  | 'callout'
  | 'crumbs'

/**
 * What paints one component: CSS whose every selector is rooted at `&`.
 *
 * `&` is the component's own class and nothing else, so a drawing has no way to name a second
 * component - which is why this is a string with one substitution rather than a list of selectors a
 * guard would have to check against the rules beside them. Two halves that can disagree are two halves
 * that will.
 */
export type Drawing = { readonly rules: string }

/** A component's class, which is its name. The one place either string exists. */
export const classOf = (component: Component): string => component

/** The mark `&` stands for inside a drawing, replaced by the component's own class when assembled. */
export const OWN = '&'

/**
 * A node that carries a component's class, and the only way this repository puts one on an element.
 *
 * A page hands data and a tag; it does not hand a class, and `class` is the one attribute this refuses
 * to take from a caller - written last so that an attributes record carrying one cannot win.
 */
export const drawn = (
  component: Component,
  tag: Tag,
  attributes: Attributes = NOTHING,
  ...children: readonly Node[]
): Node => el(tag, { ...attributes, class: classOf(component) }, ...children)

/**
 * The pill: a way into a part of the catalogue, and the mark of the part you are already in.
 *
 * Every length is the artboard's, and every *type* size is stated in `--a-point` or in a step of the
 * scale rather than in pixels - because a pixel ignores the reader's own font-size setting, and a
 * component whose text will not grow is a component somebody cannot read. `style.ts` declares the unit
 * and says what the fourteen-against-six conflict behind it is. ADR-0185.
 *
 * **`line-height` is `normal` rather than a number**, because the
 * artboard declares none and a button's initial value is what draws its 28px box; inheriting this
 * site's `--the-line` is what made the one correct pill 31.44px tall.
 *
 * The selected state is `[aria-current='true']` and never a second class. The page already wrote that
 * attribute - `chrome.ts` marks the page you are on the same way - so the look is keyed to the
 * declaration a screen reader reads rather than to a word invented for the stylesheet.
 */
const THE_PILL: Drawing = {
  rules: `
${OWN} {
  display: inline-block; font-family: var(--mono); font-size: calc(12 * var(--a-point)); line-height: normal;
  padding: 5px 11px; border-radius: 6px; text-decoration: none;
  border: 1px solid var(--rule); background: var(--wash); color: var(--body);
  transition: border-color .15s, color .15s;
}
${OWN}:hover { border-color: var(--edge); color: var(--ink); text-decoration: none }
${OWN} .count { opacity: .55; margin-left: var(--s) }
${OWN}[aria-current='true'] {
  border-color: color-mix(in srgb, var(--accent) 45%, transparent);
  background: var(--target); color: var(--accent);
}
`,
}

/** The part of a pill that says how many, named once so the markup and the rule cannot part. */
const A_COUNT = 'count'

/**
 * A way into a domain, or - with no address - the mark of the list already in front of the reader.
 *
 * A link to where you already are is a control that does nothing, so the one you are on is a `span`
 * carrying `aria-current`. That was true before this module and is kept; what changed is that both
 * spellings now take the same rule, where the `span` used to be the only one the container's selector
 * could not reach.
 *
 * The count is `null` where the pill stands somewhere a magnitude answers no question - the contract
 * page's aside names the one domain a reader is already inside, and a figure beside it would be the
 * bare digit `chrome.ts` already refuses in a column. The artboard draws that pill without one too.
 */
export const pill = (name: string, count: number | null, href: string | null): Node => {
  const says = [
    text(name),
    ...(count === null ? [] : [el('span', { class: A_COUNT }, text(String(count)))]),
  ]

  return href === null
    ? drawn('pill', 'span', { 'aria-current': 'true' }, ...says)
    : drawn('pill', 'a', { href }, ...says)
}

/**
 * A badge: a small, square-cornered mark that says what a thing is, beside the thing.
 *
 * **The two variants carry different padding and that is an intention rather than drift.** Measured on
 * the artboard at `f5bab84`: the frozen mark is `2px 6px` with no border and the language mark is
 * `1px 5px` with a `1px` one, and **both are 18px tall**. The padding is reduced by exactly the border
 * so the two align on the row where they stand side by side. Unifying them would put a 20px badge
 * beside an 18px one, which is why the rule below subtracts the border rather than declaring two
 * numbers that happen to differ by it.
 */
const A_BADGE_BORDER = '--a-badge-border'

const THE_BADGE: Drawing = {
  rules: `
${OWN} {
  ${A_BADGE_BORDER}: 0px;
  display: flex; align-items: center; gap: 4px; flex: none;
  font-size: calc(10.5 * var(--a-point)); border-radius: 4px;
  padding: calc(2px - var(${A_BADGE_BORDER})) calc(6px - var(${A_BADGE_BORDER}));
}
${OWN}[data-badge='frozen'] { font-weight: 500; color: var(--accent); background: var(--target) }
${OWN}[data-badge='language'] {
  ${A_BADGE_BORDER}: 1px;
  font-family: var(--mono); color: var(--body);
  border: var(${A_BADGE_BORDER}) solid var(--edge);
}
`,
}

/**
 * The padlock the frozen badge and the callout draw, `aria-hidden` because the claim is the word
 * beside it.
 *
 * A picture of the claim and the claim itself would be heard twice; this is the split `isChrome`
 * already makes for the wordmark's own mark. The size is the caller's because the artboard draws it
 * at two - nine on a badge, sixteen on the callout - and the path is one thing.
 */
const thePadlock = (size = '9'): Node =>
  el(
    'svg',
    { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': 'true' },
    el('rect', { x: '3', y: '7', width: '10', height: '7', rx: '1.5', fill: 'currentColor' }),
    el('path', {
      d: 'M5 7 V5 a3 3 0 0 1 6 0 V7',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '1.6',
    }),
  )

/** That a contract's definition is settled for the life of its major. */
export const frozenBadge = (says: string): Node =>
  drawn('badge', 'span', { 'data-badge': 'frozen' }, thePadlock(), text(says))

/** What language the source that lands is written in. */
export const languageBadge = (says: string): Node =>
  drawn('badge', 'span', { 'data-badge': 'language' }, text(says))

/**
 * The control that puts a command on the clipboard, which this module paints and does not build.
 *
 * `start.ts` builds it, in the browser, on every `pre.install` of every page - so the markup was
 * already one thing and only the paint was two. It has no builder here because a page does not write
 * it; what it has is the one rule, and
 * `the-class-the-browser-writes-on-a-copy-control-is-the-one-this-registry-paints` is what keeps the
 * literal over there equal to the name over here.
 *
 * The values are the artboard's quiet copy button, at the card's size. **The install bar's button is
 * not this component**: the artboard draws that one on the accent with `accent-ink` on it, which is a
 * primary button and a different shape. It arrives with the contract page.
 */
const THE_COPY: Drawing = {
  rules: `
${OWN} {
  margin-left: auto; flex: none;
  font-family: var(--mono); font-size: var(--t6); line-height: normal;
  background: var(--card); border: 1px solid var(--rule); border-radius: 5px;
  padding: 3px 8px; color: var(--body); cursor: pointer;
  transition: color .15s, border-color .15s;
}
${OWN}:hover { color: var(--ink); border-color: var(--edge) }
`,
}

/** The class `start.ts` writes on the control it builds, exported so that guard has one side to read. */
export const THE_COPY_CONTROL_CLASS = classOf('copy')

/**
 * One contract as the shelf draws it: the name, what it is frozen as, its shape, what it does, and the
 * command that takes it.
 *
 * It is `offer` rather than `card` because `.card` is the contract page's card - a different thing
 * that had the better name first, which is exactly the collision this union now makes impossible to
 * repeat.
 *
 * The parts are blocks rather than a run of phrasing elements:
 * `no-element-runs-into-the-one-beside-it` refused three spans side by side, correctly, because the
 * reading ran `number/parse` into `stable` into `TS` as one word.
 */
const AN_OFFER_HEAD = 'head'
const AN_OFFER_NAMED = 'named'
const AN_OFFER_CALL = 'call'
const AN_OFFER_DOMAIN = 'of'
const AN_OFFER_MARKS = 'marks'
const AN_OFFER_SIGNATURE = 'signature'
const AN_OFFER_SAYS = 'says'
const AN_OFFER_INSTALL = 'install'

const THE_OFFER: Drawing = {
  rules: `
${OWN} {
  display: flex; flex-direction: column; gap: 8px;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 8px;
  padding: 14px 16px 12px; min-width: 0;
  transition: border-color .15s;
}
${OWN}:hover { border-color: var(--edge) }
${OWN} .${AN_OFFER_HEAD} { display: flex; align-items: center; gap: 8px; min-width: 0 }
${OWN} .${AN_OFFER_NAMED} { margin: 0; flex: 1; min-width: 0 }
${OWN} ul.${AN_OFFER_MARKS} {
  display: flex; align-items: center; gap: 8px; list-style: none; margin: 0; padding: 0; flex: none;
}
${OWN} ul.${AN_OFFER_MARKS} li { padding: 0; border: 0 }
${OWN} a.${AN_OFFER_CALL} {
  font-family: var(--mono); font-size: calc(13.5 * var(--a-point)); font-weight: 500;
  flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--ink); text-decoration: none;
}
${OWN} a.${AN_OFFER_CALL}:hover { text-decoration: underline }
${OWN} a.${AN_OFFER_CALL} .${AN_OFFER_DOMAIN} { color: var(--body) }
${OWN} .${AN_OFFER_SIGNATURE} {
  display: block; font-family: var(--mono); font-size: calc(12 * var(--a-point)); color: var(--body);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
  margin: 0; padding: 0; border: 0; border-radius: 0; background: none;
}
${OWN} .${AN_OFFER_SAYS} {
  margin: 0; font-size: calc(12.5 * var(--a-point)); color: var(--body); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
${OWN} .${AN_OFFER_INSTALL} {
  display: flex; align-items: center; gap: 8px;
  margin: 2px 0 0; padding: 9px 0 0;
  border: 0; border-top: 1px solid var(--rule); border-radius: 0;
  background: none; color: var(--dim); max-width: 100%;
  font-family: var(--mono); font-size: var(--t6); overflow-wrap: anywhere; min-width: 0;
}
`,
}

/** What one card of the shelf is told, which is data and never a registry record. */
export type WhatAnOfferShows = {
  readonly domain: string
  readonly name: string
  readonly href: string
  readonly address: string
  readonly signature: string
  readonly summary: string
  readonly command: string
  readonly language: string
}

export const offer = (shows: WhatAnOfferShows): Node =>
  drawn(
    'offer',
    'li',
    { 'data-contract': shows.address },
    el(
      'div',
      { class: AN_OFFER_HEAD },
      el(
        'p',
        { class: AN_OFFER_NAMED },
        el(
          'a',
          { class: AN_OFFER_CALL, href: shows.href },
          el('span', { class: AN_OFFER_DOMAIN }, text(`${shows.domain}/`)),
          text(shows.name),
        ),
      ),
      el(
        'ul',
        { class: AN_OFFER_MARKS },
        el('li', NOTHING, frozenBadge('stable')),
        el('li', NOTHING, languageBadge(shows.language)),
      ),
    ),
    el('pre', { class: AN_OFFER_SIGNATURE }, text(shows.signature)),
    el('p', { class: AN_OFFER_SAYS }, text(shows.summary)),
    el('pre', { class: AN_OFFER_INSTALL }, text(shows.command)),
  )

/**
 * The small uppercase label the artboard puts over a list and beside a field.
 *
 * Two sizes, one letter-spacing. The contract page's was written at `.09em` against the front page's
 * `.08em`; the artboard sets `.08em` on both of its sizes, so the third value was drift and is gone.
 *
 * The `section` variant is a heading a reader navigates by and the `field` variant names the block
 * under it inside a card - which is why the caller chooses the tag and this chooses neither.
 */
const THE_EYEBROW: Drawing = {
  rules: `
${OWN} {
  margin: 0; padding: 0; border: 0;
  font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--dim);
}
${OWN}[data-eyebrow='section'] { font-size: calc(12.5 * var(--a-point)) }
${OWN}[data-eyebrow='field'] { font-size: var(--t6) }
`,
}

export type EyebrowSize = 'section' | 'field'

/**
 * The attributes are the caller's because a section heading carries the address a reader links -
 * `#signature` on the contract page - and an address is the page's to give, not the look's.
 */
export const eyebrow = (
  size: EyebrowSize,
  tag: Tag,
  says: string,
  attributes: Attributes = NOTHING,
): Node => drawn('eyebrow', tag, { ...attributes, 'data-eyebrow': size }, text(says))

/**
 * A block of code, set in the six syntax inks and readable with nothing running.
 *
 * The runs are `highlight.ts`'s - decided at emission, so the colour is in the served HTML - and the
 * folding is this site's rather than the artboard's `overflow-x`: ADR-0135 decided that a `pre`
 * folds where the language allows and scrolls only where it does not, and a recorded decision
 * outranks the mock-up. `width: auto` restates the element default because the site's own `pre`
 * rule says `fit-content`, and the artboard draws this block the full width of its column.
 */
const THE_SNIPPET: Drawing = {
  rules: `
${OWN} {
  margin: 0; padding: 14px 16px; width: auto; max-width: 100%; overflow-x: auto;
  background: var(--wash); border: 1px solid var(--rule); border-radius: 8px; color: var(--ink);
  font-family: var(--mono); font-size: calc(13 * var(--a-point)); line-height: 1.65;
  white-space: pre-wrap; overflow-wrap: normal;
}
${Object.values(THE_SYNTAX_INKS)
  .map((token) => `${OWN} .${token} { color: var(--${token}) }`)
  .join('\n')}
`,
}

/**
 * A highlighted source as an element: plain runs are bare text and inked runs are spans, so what a
 * projection reads is the source and nothing else.
 */
export const snippet = (runs: readonly HighlightedRun[], attributes: Attributes = NOTHING): Node =>
  drawn(
    'snippet',
    'pre',
    attributes,
    ...runs.map((run) =>
      run.ink === null
        ? text(run.text)
        : el('span', { class: THE_SYNTAX_INKS[run.ink] }, text(run.text)),
    ),
  )

/**
 * The control that copies the install command, on the accent: the one primary action a contract page
 * has. `start.ts` builds it the way it builds the quiet copy control, so this module paints it and
 * does not build it - a reader with no JavaScript meets the command with nothing beside it.
 *
 * The ink on the accent is `--paper`, not a token of its own. The artboard declares `--accent-ink`
 * and the palette does not, because the legibility guard's model is every ink against every ground
 * and an ink that exists for one ground would fail everywhere else by construction. Measured at
 * `acdd14c`: paper on the accent is 10.68:1 dark and 5.09:1 light, against the artboard's own
 * accent-ink at 9.27 - so the pair clears with margin in both themes and no token was added. The
 * reading is by hand because the guard cannot model a bound pair, and that limit is written here
 * rather than smoothed.
 */
const THE_PRIME: Drawing = {
  rules: `
${OWN} {
  flex: none; font-family: var(--mono); font-size: calc(12 * var(--a-point)); font-weight: 500;
  background: var(--accent); color: var(--paper); border: 0; border-radius: 6px;
  padding: 6px 12px; cursor: pointer; transition: opacity .15s; line-height: normal;
}
${OWN}:hover { opacity: .88 }
`,
}

/** The class `start.ts` writes on the primary control, exported so the guard has one side to read. */
export const THE_PRIME_CONTROL_CLASS = classOf('prime')

/** The parts of a callout, named once so the markup and the rules cannot part. */
const A_CALLOUT_TITLE = 'title'
const A_CALLOUT_SAYS = 'says'

/**
 * The claim a page sets apart on the accent's own ground: a title, a sentence, and the padlock at
 * the artboard's sixteen pixels. The border is the accent at the artboard's 28 %, which is a
 * distinction and not text, so the floor it owes is 1.4.11's and the ground behind the words is
 * `--target` - the same composed ground every `:target` highlight already reads on.
 */
const THE_CALLOUT: Drawing = {
  rules: `
${OWN} {
  display: flex; gap: 12px; margin: 0;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
  background: var(--target); border-radius: 8px; padding: 14px 16px;
}
${OWN} > svg { color: var(--accent); flex: none; margin-top: 2px }
${OWN} .${A_CALLOUT_TITLE} { margin: 0 0 3px; font-weight: 600; font-size: calc(13.5 * var(--a-point)); color: var(--ink) }
${OWN} .${A_CALLOUT_SAYS} { margin: 0; font-size: calc(13 * var(--a-point)); color: var(--body); line-height: 1.6 }
${OWN} .${A_CALLOUT_SAYS} code { color: var(--ink) }
`,
}

export const callout = (title: string, ...says: readonly Node[]): Node =>
  drawn(
    'callout',
    'div',
    NOTHING,
    thePadlock('16'),
    el(
      'div',
      NOTHING,
      el('p', { class: A_CALLOUT_TITLE }, text(title)),
      el('p', { class: A_CALLOUT_SAYS }, ...says),
    ),
  )

/**
 * Where a page stands, as the steps down to it. A list rather than a run of anchors - three links
 * side by side are one word to a screen reader - and the separator is the rule's and not the
 * document's, so no projection carries a bare slash as if it were a word.
 */
const THE_CRUMBS: Drawing = {
  rules: `
${OWN} { margin: 0 0 20px; font-family: var(--mono); font-size: calc(12.5 * var(--a-point)); color: var(--dim) }
${OWN} ol { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; list-style: none; margin: 0; padding: 0 }
${OWN} li { padding: 0; border: 0 }
${OWN} li + li::before { content: '/'; margin-right: 7px }
${OWN} a { color: var(--body); text-decoration: none }
${OWN} a:hover { color: var(--ink) }
${OWN} [aria-current='page'] { color: var(--ink) }
`,
}

/** One step of the path: where it goes, or - as the last one - the page already under the cursor. */
export type CrumbStep = {
  readonly label: string
  readonly href: string | null
}

export const crumbs = (steps: readonly CrumbStep[]): Node =>
  drawn(
    'crumbs',
    'nav',
    { 'aria-label': 'Breadcrumb' },
    el(
      'ol',
      NOTHING,
      ...steps.map((step) =>
        step.href === null
          ? el('li', { 'aria-current': 'page' }, text(step.label))
          : el('li', NOTHING, el('a', { href: step.href }, text(step.label))),
      ),
    ),
  )

/**
 * Every component, which the compiler will not let be partial and will not let hold one name twice.
 *
 * This is the whole of the mechanism's first half: a sixth shape does not exist until it is a member
 * of `Component`, and a member does not compile until it has a drawing here.
 */
export const THE_COMPONENTS: Record<Component, Drawing> = {
  pill: THE_PILL,
  badge: THE_BADGE,
  copy: THE_COPY,
  offer: THE_OFFER,
  eyebrow: THE_EYEBROW,
  snippet: THE_SNIPPET,
  prime: THE_PRIME,
  callout: THE_CALLOUT,
  crumbs: THE_CRUMBS,
}

/** One component's rules with `&` resolved to the class it stands for. */
export const paintedBy = (component: Component): string =>
  THE_COMPONENTS[component].rules.split(OWN).join(`.${classOf(component)}`)

/**
 * Every component's rules, in the order the union declares them, for the stylesheet to carry.
 *
 * They are assembled rather than written into `style.ts` so that the rule painting a thing sits beside
 * the markup drawing it. That adjacency is not tidiness: it is what makes the second drawing of one
 * shape a thing somebody has to add a union member for.
 */
export const THE_COMPONENT_RULES: string = (
  Object.keys(THE_COMPONENTS) as readonly Component[]
)
  .map(paintedBy)
  .join('')
