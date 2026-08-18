/**
 * The battery over the generator: what a page says, and what it must never say.
 *
 * It is the eighteenth, and the first to inject into `packages/site/`. The three that measure `packages/cli/` ask what
 * happens to somebody's files; this one asks what happens to somebody's *understanding*, which fails
 * differently: a wrong page does not break a build, it is believed.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * **The projection that would blind this unit's own instrument, first.** Everything about this site
 * was decided by rendering a page in document order and reading it as a stranger, and W-03 is the
 * defect that makes that reading lie: a text projection quietly dropping what the HTML shows produces
 * a *shorter and tidier* reading, which is exactly what somebody skimming a measurement wants to see.
 * Two guards catch it, and they are the reason a page is a tree with two projections rather than a
 * string.
 *
 * **A value printed as a value that is not it.** A `-0` shown as `0`, a hole shown as `undefined`, an
 * invisible character shown as nothing, the same object shown twice - each of these publishes a claim
 * the contract does not make, on the page where the contract is supposed to be legible. W-06 is the
 * sharpest: without the escaping, `number/parse@1` publishes two cases that are the same eight glyphs
 * on screen and carry opposite answers, and its own source says in as many words that this must never
 * happen.
 *
 * **The address.** A case identifier was frozen ten units ago so a URL could anchor on it. W-11
 * anchors on an index instead, which works perfectly and breaks every link the day a case is inserted
 * - the failure that has no symptom until it is far too late to fix.
 *
 * **The number a reader compares against npm.** W-12 states the harness size instead of the installed
 * size. Both are true figures about the same contract and they differ by an order of magnitude, so
 * nothing about the page looks wrong.
 *
 * **The refusal.** W-14 offers `toopo add` for the contract the catalogue turned down, which is the
 * defect `toopo search` already carries a mutant for, arriving on the surface where somebody clicks.
 *
 * ---------------------------------------------------------------------------
 * What is not measured, and why the mutant is not written
 * ---------------------------------------------------------------------------
 *
 * **Whether the page is good.** Whether fifty cases in a row read as documentation or as a dump is a
 * judgement about prose, and no mutant can make it a fact. It was answered by printing the page and
 * reading it, and it is recorded as a judgement.
 *
 * **That `build.ts` writes what it renders.** It is the one file of the folder that touches a disk and
 * the only one no guard covers, deliberately: everything it decides is `theSite`, which is a value, and
 * what is left is `writeFileSync`. A guard over it would be a guard over node.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'W', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const documentFile = (find: string, replace: string) => ({ file: 'document.ts', find, replace })
const styleFile = (find: string, replace: string) => ({ file: 'style.ts', find, replace })
const literalFile = (find: string, replace: string) => ({ file: 'literal.ts', find, replace })
const contractPageFile = (find: string, replace: string) => ({ file: 'contract-page.ts', find, replace })
const cataloguePageFile = (find: string, replace: string) => ({ file: 'catalogue-page.ts', find, replace })
const catalogueFile = (find: string, replace: string) => ({ file: 'catalogue.ts', find, replace })
const localFile = (find: string, replace: string) => ({ file: 'local-source.ts', find, replace })
const sourceFile = (find: string, replace: string) => ({ file: 'source.ts', find, replace })
const pathsFile = (find: string, replace: string) => ({ file: 'paths.ts', find, replace })
const readLiteralFile = (find: string, replace: string) => ({ file: 'read-literal.ts', find, replace })
const domainPageFile = (find: string, replace: string) => ({ file: 'domain-page.ts', find, replace })
const playgroundFile = (find: string, replace: string) => ({ file: 'playground.ts', find, replace })
const browserFile = (find: string, replace: string) => ({ file: 'browser.ts', find, replace })
const methodFile = (find: string, replace: string) => ({
  file: 'methodology-page.ts',
  find,
  replace,
})
const indexingFile = (find: string, replace: string) => ({ file: 'indexing.ts', find, replace })
const siteFile = (find: string, replace: string) => ({ file: 'site.ts', find, replace })
const servedHeadersFile = (find: string, replace: string) => ({
  file: 'served-headers.ts',
  find,
  replace,
})

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const TEXT_IS_ESCAPED = `const escapeText = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')`

const AN_ATTRIBUTE_IS_ESCAPED_TOO = `const escapeAttribute = (value: string): string => escapeText(value).replaceAll('"', '&quot;')`

const CHROME_IS_NOT_READ_ALOUD = `  if (isChrome(node)) return ''`

const A_BLOCK_SEPARATES = `    h1: ends('\\n\\n'),`

/**
 * Two lines, because the reading and the Markdown decorate a paragraph identically.
 *
 * `p: ends('\\n\\n'),` is now written twice - once in each projection - and an edit must match exactly
 * once, so the anchor carries the line above it, which is the one the two tables disagree on. It is the
 * ordinary cost of a second total map over the same tags, and it is cheaper than naming the tables.
 */
const A_PARAGRAPH_SEPARATES = `    h4: ends('\\n\\n'),
    p: ends('\\n\\n'),`

const A_HEADING_IS_A_HEADING_IN_MARKDOWN = `    h2: wraps('## ', '\\n\\n'),`

const PROSE_IS_ESCAPED = `  prose: escapedForMarkdown,`

const CODE_IS_NOT_PROSE = `  verbatim: new Set(['code', 'pre']),`

const A_SPAN_IS_CLOSED_BY_WHAT_THE_CODE_CANNOT_WRITE = `  const fence = '\`'.repeat(longestFence(code) + 1)`

const THE_MARKDOWN_IS_A_SIBLING = `  page.replace(/index\\.html$/, THE_MARKDOWN_FILE)`

const THE_PAYLOAD_CANNOT_CLOSE_ITS_OWN_ELEMENT = `  \`<script type="application/ld+json">\${JSON.stringify(data).replaceAll('<', '\\\\u003c')}</script>\``

const WHAT_A_READER_TAKES_IS_WHAT_IS_DECLARED = `      license: THE_COPIED_LICENCE,`

const A_PROJECTION_CARRIES_WHAT_A_READER_MEETS = `    how.prose(document.description),
    '',
    ...document.body.map((node) => projected(node, how, false)),`

const THE_PAGE_DECLARES_ITS_LANGUAGE = `    '<html lang="en">',`

const THE_STYLE_IS_THE_ONLY_THING_LOADED = `    \`<style>\${STYLE}</style>\`,`

const THE_LIGHT_PALETTE = `  --paper: #fbfaf8; --wash: #f3f1ec; --card: #f6f4f0; --rule: #e2ded7; --edge: #d3cfc7;`

const THE_SHELL_IS_AS_WIDE_AS_WHAT_IT_HOLDS = `  max-width: calc(var(--rail) + var(--two-columns) + 3 * var(--s6));`

const THE_THREE_COLUMNS_ARE_DECLARED_LENGTHS = `    grid-template-columns: var(--rail) minmax(0, 1fr) var(--aside);`

const THE_INVISIBLE_IS_MADE_VISIBLE = `  \`'\${value.replaceAll('\\\\', '\\\\\\\\').replaceAll("'", "\\\\'").replace(INVISIBLE, escaped)}'\``

const THE_ORDINARY_SPACE_IS_KEPT = `const INVISIBLE = /[\\p{Cc}\\p{Cf}\\p{Cs}\\p{M}\\p{Zl}\\p{Zp}]|[^\\P{Zs} ]/gu`

const NEGATIVE_ZERO_KEEPS_ITS_SIGN = `  'negative-zero': '-0',`

/**
 * The two words with no JavaScript spelling, now read from `WITHOUT_A_SPELLING` rather than written
 * into the switch - because `read-literal.ts` has to refuse exactly these, and what one file prints
 * and the other turns down is one statement. The anchors moved with them; the defects are unchanged.
 */
const A_HOLE_IS_NAMED = `    case 'hole':
      return WITHOUT_A_SPELLING.hole`

const A_FUNCTION_IS_NAMED = `      return WITHOUT_A_SPELLING['not-data']`

const THE_SAME_OBJECT_IS_LABELLED = `const shared = (label: number | undefined, rendered: string): string =>
  label === undefined ? rendered : \`#\${label} = \${rendered}\``

const A_KEY_IS_QUOTED_WHEN_IT_MUST_BE = `const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/`

const A_SYMBOL_KEEPS_ITS_DESCRIPTION = `      return value.description === null ? 'Symbol()' : \`Symbol(\${quoted(value.description)})\``

const THE_ANCHOR_IS_THE_CASE_IDENTIFIER = `    { id: entry.id, class: 'case' },`

const THE_GROUPS_RENDER_IN_THEIR_DECLARED_ORDER = `  ...table.groups.flatMap((group) =>
    renderedGroup(group, table, answer, fields, alone ? 'h3' : 'h4'),
  ),`

const A_HEADING_CARRIES_ITS_OWN_ADDRESS = `  addressed(heading, group.id, group.title),`

const ONE_ANSWER_IS_WRITTEN_BARE = `    answered.length === 1`

const THE_COST_IS_WHAT_LANDS = `  const bytes = implementation.files.reduce((total, file) => total + file.bytes, 0)`

const THE_DESCRIPTION_IS_NOT_THE_SUMMARY = `      \`\${cases} named edge cases, settled and frozen. TypeScript source copied into your project: \` +`

const A_SNAPSHOT_IS_CHECKED = `  const faults = servedSnapshotFaults(answer)`

const ONLY_AN_INSTALLABLE_CONTRACT_HAS_A_PAGE = `    .entries.filter((entry) => entry.installable)`

const A_REFUSED_CONTRACT_IS_OFFERED_NOTHING = `                entry.installable
                  ? \`\${THE_INVOCATION} add \${entry.address.name}\``

/**
 * The generator's own restatement of the version the registry published. `cli-install.battery.ts`
 * carries the argument for why the edit below is no longer `'1.0.0'`: that string is now the truth.
 */
const THE_VERSION_IS_A_RESTATEMENT = `export const THE_PUBLISHED_VERSION = '1.0.0'`

const A_REFUSED_CONTRACT_IS_REFUSED = `    if (record.lifecycle.state === 'never-published') {`

const THE_INDEX_ENDPOINT = `  contractIndex: 'contract-index',`

const A_DEFERRED_NEED_IS_NAMED = `  'search-with-an-alias-thesaurus': {`

/**
 * The whole value, not its first line.
 *
 * W-52 emptied one line of three and survived, correctly: two lines of trigger were left and the
 * guard is about a trigger being absent. The battery caught a mutant that was not the defect it
 * claimed to be, which is the reading the pinned verdicts exist to produce.
 */
const A_DEFERRED_NEED_SAYS_WHAT_WOULD_CLOSE_IT = `    until:
      'the catalogue stops fitting on one screen - measured as the front page listing more contracts ' +
      'than a reader can take in without scrolling, which is where reading a list stops beating ' +
      'typing a word',`

/**
 * The lenses sentence, and not the score sentence, because W-47 has to be alone on its guard.
 *
 * Its first target was the count of defect cells, which two other guards read - so the mutant
 * reddened three at once and the guard about derived figures was never alone on anything. The
 * sentence about lenses is read by nothing else, so a literal there probes exactly one claim.
 *
 * **The literal it writes has moved twice, and the second time says something the first did not.**
 * It was `41`. The first collision was an address: `THE_REPLAY.measuredAt` then held a stamp whose
 * digit runs included `41`, and the repair was to take every address off both sides. The second
 * was not an address at all - `measured.unprobed.length` *became* 41, when three batteries declared
 * the transport they cannot reach - so the pool held `41` as a figure something really derived, and
 * the mutant stopped writing anything the page could not have said.
 *
 * **What that exposes is a limit of the guard rather than a bad literal, and it is wider than the one
 * already declared beside it.** That guard asks whether every figure a reader can see occurs
 * *somewhere* in the data; it cannot ask whether it is the figure *that sentence* derives. So a mutant
 * writing any other figure's value passes, and the pool grows with the catalogue - fifty-odd distinct
 * small integers today. Closing it would mean rendering each figure with its provenance and checking
 * the pair, which is a redesign of how this page emits numbers and is not bought here.
 *
 * So the literal is chosen to be one nothing can derive rather than one that merely does not collide
 * today: four digits, where every count on that page is a population of batteries, cells, guards or
 * fields and the only larger figure in the data is a millisecond reading.
 */
const A_FIGURE_IS_DERIVED = `        \`\${measured.lenses} such readings over the \${measured.batteries} batteries.\`,`

const THE_BREAKDOWN_IS_SHOWN_BESIDE_THE_TOTAL = `        kinds.map((why) => \`\${byKind[why]} \${why.replaceAll('-', ' ')}\`).join(', ') +`

const EVERY_SURVIVOR_IS_SHOWN = `    el('div', { class: 'cases' }, ...defects.map(renderSurvivor)),`

const THE_LIMIT_IS_READ_FIRST = `    line('h2', 'What this does not prove'),
    line(
      'p',
      'A high score does not say the code is correct. It says the tests notice the defects that ' +
        'were tried.',
      { class: 'lede' },
    ),
`

const A_PIN_IS_NOT_AN_OBSERVATION = `    paragraph(THE_PINS_ARE_AN_ASSERTION),`

/**
 * The two anchors of the defects this repository published, and the second is deliberately the
 * *opening* of the paragraph rather than the whole of it: what was wrong was the call, and the
 * sentence it carries goes on being read by `every-figure-on-the-method-page-comes-from-what-it-was-
 * built-from`, which would redden on any edit that touched the figures instead.
 */
const A_CONTRACT_NAME_IS_A_TITLE = `              el(
                'h3',
                { class: 'call' },
                el(
                  'a',
                  { href: linkTo(entry.installable ? pageOf(entry.address) : REFUSALS_PAGE) },
                  text(renderContract(entry.address)),
                ),
              ),`

const A_SILENCE_IS_PARSED_LIKE_EVERY_OTHER_SENTENCE = `        paragraph(silence.reason, { class: 'why' }),`

const A_PAGE_IS_WRITTEN_AT_THE_FILE_IT_IS =
  '    ...[...pages].map(([path, page]) => [path, toHtml(page)] as const),'

const THE_SIGNATURE_SECTION = `    line('h2', 'What a signature does not prove'),`

const NOTHING_ELSE_OF_THE_INSTRUMENT_IS_REACHED = `import { CATALOGUE_PAGE, METHOD_PAGE, REFUSALS_PAGE, domainPageOf, linkTo, pageOf } from './paths.js'`

const THE_KINDS_ARE_EXPLAINED_IN_THE_INSTRUMENTS_WORDS = `    paragraph(WHAT_A_SURVIVOR_MEANS_TO_A_READER[why]),`

const EVERYTHING_IS_READABLE = `  ['User-agent: *', 'Allow: /', '', \`Sitemap: \${THE_ORIGIN}/\${SITEMAP}\`, ''].join('\\n')`

const THE_SITEMAP_IS_THE_PAGES = `  return theCrawlerFiles(listed, root ?? { path: CATALOGUE_PAGE, title: '', description: '' })`

const A_LINK_IS_THE_FOLDER_AND_NOT_THE_FILE = `export const linkTo = (page: string): string => page.replace(/index\\.html$/, '')`

const A_URL_LINE_CARRIES_NO_DATE = `    ...pages.map((page) => \`  <url><loc>\${escaped(urlOf(page))}</loc></url>\`),`

const THE_ORIGIN_IS_WRITTEN_ONCE = `export const THE_ORIGIN = 'https://toopo.dev'`

const XML_IS_ESCAPED = `    .replaceAll('&', '&amp;')`

const THE_SITEMAP_IS_WHERE_A_CRAWLER_LOOKS = `export const SITEMAP = 'sitemap.xml'`

const A_PAGE_IS_ADDRESSED_BY_ITS_CONTRACT = `export const pageOf = (address: ContractAddress): string => \`\${renderContract(address)}/index.html\``

const A_USE_CASE_CARRIES_ITS_WARNING = `    paragraph(entry.caveat, { class: 'why' }),`

const A_USE_CASE_SHOWS_WHAT_CAME_BACK = `  const result = answered.map((field) => literal(field.value)).join(', ')`

const A_NUMBER_IS_READ_AS_ITSELF = `  if (number !== null) return Number(number)`

const A_WORD_WITH_NO_SPELLING_IS_REFUSED = `  for (const word of Object.values(WITHOUT_A_SPELLING)) {`

const A_CODE_POINT_ABOVE_THE_PLANE_IS_BRACED = `  return code > 0xffff`

const A_DATE_IS_CONSTRUCTED = `    build: (value) => new Date(value as string),`

const AN_ANSWER_IS_WRITTEN_AS_A_LITERAL = `const asALiteral = (value: unknown, path: string): string =>
  literal(encode(asADeclaredValue(value), path))`

const AN_UNKNOWN_TYPE_STOPS_THE_BUILD = `const theArgumentFor = (parameter: ParameterRecord, what: string): Argument => {
  const known = AS_AN_ARGUMENT[parameter.type]
  if (known === undefined) {`

const A_FIELD_SPELLS_ITS_DECLARED_TYPE = `      spelledBy: (declared) => typeof declared === 'object' && declared !== null && !Array.isArray(declared),`

const A_CALL_IS_WRITTEN_AS_A_LITERAL = `export const callWritten = (name: string, given: readonly unknown[]): string =>
  \`\${name}(\${given.map((argument, at) => asALiteral(argument, \`argument \${at + 1}\`)).join(', ')})\``

const A_TEXT_FIELD_LOSES_A_LINE_BREAK = `const STRIPPED_BY_A_TEXT_FIELD = /[\\r\\n]/`

const A_TEXT_FIELD_HANDS_OVER_WHAT_WAS_TYPED = `    if (known.readAs.kind === 'the-text-itself') return text`

const WHAT_RUNS_IN_YOUR_BROWSER_IS_SAID = `      line('p', whatRunsInYourBrowser(contract.address.name), { class: 'meta' }),`

const THE_GRAPH_LISTS_EVERY_MODULE = `  'packages/site/literal.ts',
`

const A_CODE_POINT_IS_HEXADECIMAL = `  const code = Number.parseInt(digits, 16)`

const A_FIELD_SET_TO_UNDEFINED_IS_STILL_A_FIELD = `    const value = readValue(scan)
    Object.defineProperty(record, name, {`

const NOTHING_MAY_FOLLOW_THE_VALUE = `  if (scan.at < text.length) fail(scan, 'there is more text after the value ends')`

const A_RECORD_IS_NAMED_BEFORE_IT_IS_FILLED = `  const record: Record<string, unknown> = {}
  if (label !== undefined) scan.shared.set(label, record)`

const THE_DIAGNOSTIC_IS_NAMED = `  return diagnostic.name
}`

const THE_DIAGNOSTIC_TAKES_THE_ANSWERS_ARGUMENTS = `  if (spelledCall(diagnostic.parameters) !== spelledCall(answer.parameters)) {`

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

const THE_CONTRACTS_OF_A_DOMAIN_ARE_LISTED = `...domain.held.map((held) => entry(held, own))`

const mutants: readonly Mutant[] = [
  /**
   * A domain page that lists all but one of its contracts, which is the defect
   * `a-domain-page-lists-every-contract-the-index-files-under-it` was written for and the one its first
   * draft was **green** on.
   *
   * That draft required each contract to be *named* on the page, and the column beside the content
   * names every contract of the domain - so a page with an entry missing still carried the name. What
   * only the main list carries is the install command, and that is what the guard reads now.
   */
  sameOnEveryLens(
    'W-87',
    'lists every contract of a domain but the first, so a reader climbing to a family from a search ' +
      'is shown a catalogue with a hole in it and the column beside it goes on naming what the list ' +
      'dropped',
    [domainPageFile(THE_CONTRACTS_OF_A_DOMAIN_ARE_LISTED, '...domain.held.slice(1).map((held) => entry(held, own))')],
    killed(['a-domain-page-lists-every-contract-the-index-files-under-it']),
  ),


  sameOnEveryLens(
    'W-01',
    'writes contract prose into the markup without escaping it, so an input holding a `<` opens a ' +
      'tag and a rationale holding an ampersand is read as an entity',
    [documentFile(TEXT_IS_ESCAPED, `const escapeText = (value: string): string => value`)],
    killed([
      'a-text-node-is-escaped-in-the-html',
      'an-attribute-value-is-escaped-including-its-quotes',
      'every-word-of-the-page-is-in-every-projection',
    ]),
  ),

  sameOnEveryLens(
    'W-02',
    'escapes an attribute as though it were text, so a case identifier carrying a quote would close ' +
      'the attribute it is written into',
    [
      documentFile(
        AN_ATTRIBUTE_IS_ESCAPED_TOO,
        `const escapeAttribute = (value: string): string => escapeText(value)`,
      ),
    ],
    killed(['an-attribute-value-is-escaped-including-its-quotes']),
  ),

  /**
   * The one defect in this folder that could blind the instrument the whole unit was steered by. It
   * produces a *shorter* reading, which is what somebody skimming a measurement is hoping for.
   */
  sameOnEveryLens(
    'W-03',
    'drops the code from the reading order, so every rendered call disappears from the projection ' +
      'this unit measures the page with and the reading looks tidier for it',
    [documentFile(CHROME_IS_NOT_READ_ALOUD, `  if (isChrome(node) || node.tag === 'code') return ''`)],
    killed([
      'every-word-of-the-page-is-in-every-projection',
      'every-word-of-every-page-survives-every-projection',
      'a-case-is-rendered-as-the-call-its-signature-declares',
    ]),
  ),

  sameOnEveryLens(
    'W-04',
    'reads the navigation chrome aloud, so every case in the reading order is preceded by a `#` that ' +
      'means nothing at all',
    [documentFile(CHROME_IS_NOT_READ_ALOUD, `  if (false) return ''`)],
    killed(['chrome-marked-as-hidden-is-in-the-html-and-not-in-the-reading']),
  ),

  sameOnEveryLens(
    'W-05',
    'runs every block into the next in the reading order, so the projection is a wall and the ' +
      'structure a screen reader announces is gone',
    [documentFile(A_BLOCK_SEPARATES, `    h1: ends(''),`)],
    killed(['the-text-projection-keeps-the-words-and-drops-the-markup']),
  ),

  /**
   * The defect reading a page in document order caught and no guard about presence could: two blocks
   * that become one sentence. Every word is still there, so a projection guard stays green, and a
   * person reads `not applicableThe signature takes a single string`.
   */
  sameOnEveryLens(
    'W-29',
    'runs a label into the sentence under it, so every property and every profile of every contract ' +
      'is published as one run-on line with every word still present',
    [
      documentFile(
        A_PARAGRAPH_SEPARATES,
        `    h4: ends('\\n\\n'),
    p: ends(''),`,
      ),
    ],
    killed(['a-label-and-the-sentence-under-it-are-two-lines']),
  ),

  sameOnEveryLens(
    'W-06',
    'prints an invisible character as itself, so `number/parse@1` publishes two cases that are the ' +
      'same eight glyphs on screen and carry opposite answers',
    [
      literalFile(
        THE_INVISIBLE_IS_MADE_VISIBLE,
        `  \`'\${value.replaceAll('\\\\', '\\\\\\\\').replaceAll("'", "\\\\'")}'\``,
      ),
    ],
    killed([
      'two-inputs-that-look-alike-are-written-apart',
      'an-invisible-character-is-written-as-its-code-point',
      'a-combining-mark-is-written-apart-from-its-base',
      'a-case-is-rendered-as-the-call-its-signature-declares',
      'every-word-of-every-page-survives-every-projection',
    ]),
  ),

  sameOnEveryLens(
    'W-07',
    'escapes the ordinary space along with the unusual ones, so every sentence of every rationale in ' +
      'a rendered value becomes a run of code points',
    [
      literalFile(
        THE_ORDINARY_SPACE_IS_KEPT,
        `const INVISIBLE = /[\\p{Cc}\\p{Cf}\\p{Cs}\\p{M}\\p{Zl}\\p{Zp}\\p{Zs}]/gu`,
      ),
    ],
    killed([
      'two-inputs-that-look-alike-are-written-apart',
      'an-invisible-character-is-written-as-its-code-point',
      'a-combining-mark-is-written-apart-from-its-base',
      'a-case-is-rendered-as-the-call-its-signature-declares',
    ]),
  ),

  /**
   * The other direction of the same rule, and it needs its own mutant because over-escaping is not a
   * weaker version of under-escaping: it is what a cautious reading of the same requirement produces.
   * `string/slugify@1`'s whole table is Cyrillic, Arabic, Greek and emoji, and a page that printed
   * them as code points would publish the contract about scripts as a contract about numbers.
   */
  sameOnEveryLens(
    'W-28',
    'escapes everything outside ASCII, so the contract whose table is about Cyrillic, Arabic and ' +
      'emoji publishes them as code points',
    [literalFile(THE_ORDINARY_SPACE_IS_KEPT, `const INVISIBLE = /[^\\x20-\\x7E]/gu`)],
    killed(['a-visible-character-is-printed-as-itself']),
  ),

  sameOnEveryLens(
    'W-08',
    'prints a negative zero as a zero, which is the one thing `outputsAreEqual` uses `Object.is` ' +
      'rather than `===` to preserve, published as though the contract did not settle it',
    [literalFile(NEGATIVE_ZERO_KEEPS_ITS_SIGN, `  'negative-zero': '0',`)],
    killed(['the-four-numbers-json-cannot-carry-are-written-as-themselves']),
  ),

  sameOnEveryLens(
    'W-09',
    'prints a hole as an undefined element, which is the distinction `array/group-by@1` settles a ' +
      'case on and the difference between iteration and a counting loop',
    [literalFile(A_HOLE_IS_NAMED, `    case 'hole':
      return 'undefined'`)],
    killed(['a-hole-is-named-rather-than-left-as-a-gap']),
  ),

  sameOnEveryLens(
    'W-10',
    'prints a shared object twice instead of naming it once, so nine cases that pin object identity ' +
      'are published as claims about equality',
    [
      literalFile(
        THE_SAME_OBJECT_IS_LABELLED,
        `const shared = (label: number | undefined, rendered: string): string => rendered`,
      ),
    ],
    killed(['the-same-object-is-shown-as-the-same-object']),
  ),

  sameOnEveryLens(
    'W-11',
    'anchors a case on its position instead of its identifier, so every link into a contract page ' +
      'works today and points at a different case the day one is inserted',
    [
      contractPageFile(
        THE_ANCHOR_IS_THE_CASE_IDENTIFIER,
        `    { id: \`case-\${entry.rationale.length}\`, class: 'case' },`,
      ),
    ],
    killed(['every-case-is-anchored-by-the-identifier-its-address-is-made-of']),
  ),

  sameOnEveryLens(
    'W-12',
    'states the size of the test harness where the page promises the size of what lands, two true ' +
      'figures about one contract that differ by an order of magnitude',
    [
      contractPageFile(
        THE_COST_IS_WHAT_LANDS,
        `  const bytes = contract.harness.reduce((total, file) => total + file.bytes, 0)`,
      ),
    ],
    killed(['the-cost-a-page-states-is-what-lands-and-not-what-is-served']),
  ),

  sameOnEveryLens(
    'W-13',
    'renders a snapshot without checking that it hashes to the address it was fetched by, which is ' +
      'the step the whole distribution argument rests on and the one a consumer skips',
    [catalogueFile(A_SNAPSHOT_IS_CHECKED, `  const faults: readonly string[] = []`)],
    killed(['a-snapshot-that-does-not-hash-to-its-own-address-stops-the-build']),
  ),

  sameOnEveryLens(
    'W-14',
    'offers an install command for the contract the catalogue turned down, on the page somebody ' +
      'clicks from',
    [
      cataloguePageFile(
        A_REFUSED_CONTRACT_IS_OFFERED_NOTHING,
        `                true
                  ? \`\${THE_INVOCATION} add \${entry.address.name}\``,
      ),
    ],
    killed(['nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed']),
  ),

  sameOnEveryLens(
    'W-15',
    'drops the major version from a page address, so `number/parse@2` would one day overwrite the ' +
      'page of `number/parse@1` and every link to the first would resolve to the second',
    [
      pathsFile(
        A_PAGE_IS_ADDRESSED_BY_ITS_CONTRACT,
        `export const pageOf = (address: ContractAddress): string => \`\${address.name}/index.html\``,
      ),
    ],
    killed(['a-page-is-addressed-by-the-contract-it-is-about']),
  ),

  /**
   * The warning is what a use case is worth reading for, and dropping it leaves the page *tidier*.
   *
   * Four confident cards, each with a call and an answer that are both true, and nothing telling
   * anybody that `C++` and `C#` answer the same slug. That is the shape this battery was written for
   * in the first place: a wrong page does not break a build, it is believed.
   */
  sameOnEveryLens(
    'W-83',
    'drops the warning from every use case, leaving four demonstrations that are each true and ' +
      'together tell a reader to key a tag store on a lossy answer',
    [contractPageFile(A_USE_CASE_CARRIES_ITS_WARNING, '')],
    killed(['a-use-case-shows-its-call-its-answer-and-its-caveat']),
  ),

  /**
   * The card prints what was passed in where what came back belongs.
   *
   * **`every-use-case-replays-through-the-stripped-artefact-a-browser-runs` is green under this
   * mutant**, and that is the point of writing it: that guard asks the record whether the declared
   * answer is real, and this defect leaves the record alone and lies on the page. Measured while
   * writing it - three of the four cards redden and the fourth does not, because `slugify` answers
   * `日本語テキスト` for `日本語テキスト` and the two halves of that call are the same string.
   */
  sameOnEveryLens(
    'W-84',
    'shows a use case answering its own argument, so the card demonstrates a function that does ' +
      'nothing while the replay that checks the declared answer stays green',
    [
      contractPageFile(
        A_USE_CASE_SHOWS_WHAT_CAME_BACK,
        `  const result = written.join(', ')`,
      ),
    ],
    killed(['a-use-case-shows-its-call-its-answer-and-its-caveat']),
  ),

  sameOnEveryLens(
    'W-16',
    'repeats the summary as the page description, so the first three things a search engine reads ' +
      'are one sentence three times and the differentiator is never said',
    [contractPageFile(THE_DESCRIPTION_IS_NOT_THE_SUMMARY, `      \`\${contract.identity.summary} \` +`)],
    killed(['the-opening-of-a-page-says-three-different-things']),
  ),

  sameOnEveryLens(
    'W-17',
    'names an endpoint the read API does not declare, so the port claims to answer something no ' +
      'registry publishes',
    [sourceFile(THE_INDEX_ENDPOINT, `  contractIndex: 'contracts',`)],
    killed(['every-method-of-the-port-answers-an-endpoint-that-exists']),
  ),

  sameOnEveryLens(
    'W-18',
    'binds the five at a version the registry never published, so the two stand-ins of this ' +
      'repository stop agreeing about the version every lockfile they produce records',
    [localFile(THE_VERSION_IS_A_RESTATEMENT, `export const THE_PUBLISHED_VERSION = '1.0.1'`)],
    killed(['both-stand-ins-bind-the-version-the-registry-published']),
  ),

  sameOnEveryLens(
    'W-19',
    'publishes the contract the catalogue decided against, so it gains a page of its own and the ' +
      'refusals page and the catalogue contradict each other',
    [localFile(A_REFUSED_CONTRACT_IS_REFUSED, `    if (false) {`)],
    killed([
      'a-refused-contract-is-in-the-index-and-resolves-to-no-binding',
      'every-installable-contract-has-a-page-and-a-refused-one-does-not',
      'nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed',
    ]),
  ),

  sameOnEveryLens(
    'W-20',
    'builds a page for every contract the index holds, including the refused one, which has no ' +
      'binding and therefore no frozen definition to render',
    [catalogueFile(ONLY_AN_INSTALLABLE_CONTRACT_HAS_A_PAGE, `    .entries.filter(() => true)`)],
    killed(['every-installable-contract-has-a-page-and-a-refused-one-does-not']),
  ),

  sameOnEveryLens(
    'W-21',
    'names every answer field even when there is only one, so `levenshtein(a, b) → 3` is published ' +
      'as `expected 3` and the page reads like a fixture instead of a call',
    [contractPageFile(ONE_ANSWER_IS_WRITTEN_BARE, `    answered.length === 0`)],
    killed(['a-case-is-rendered-as-the-call-its-signature-declares']),
  ),

  sameOnEveryLens(
    'W-22',
    'stops declaring which of the site\'s needs this site builds no page for, so a scope decision ' +
      'becomes indistinguishable from a page somebody forgot',
    [sourceFile(A_DEFERRED_NEED_IS_NAMED, `  'search-with-an-alias-thesaurus-not': {`)],
    killed(['the-needs-of-the-site-are-answered-or-deferred-with-a-reason']),
  ),

  sameOnEveryLens(
    'W-23',
    'serves the page without declaring its language, so a screen reader reads English prose with ' +
      'whatever voice the reader last used and a search engine has to guess',
    [documentFile(THE_PAGE_DECLARES_ITS_LANGUAGE, `    '<html>',`)],
    killed(['the-page-declares-its-language-its-charset-and-its-description']),
  ),

  sameOnEveryLens(
    'W-24',
    'fetches the stylesheet instead of carrying it, which is a request, a round trip and a host this ' +
      'project would then depend on to render its own argument about cost',
    [
      documentFile(
        THE_STYLE_IS_THE_ONLY_THING_LOADED,
        `    '<link rel="stylesheet" href="/site.css">',`,
      ),
    ],
    killed(['a-page-loads-nothing-and-runs-nothing']),
  ),

  /**
   * **The one cell of this battery written against a guard rather than against a defect somebody
   * would plausibly commit**, and the reason it exists is that nothing reddened that guard at all.
   * `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` was reported unaccounted for
   * by this battery at `81bf9bc` and at every commit since it was written, measured both ways - and
   * W-24 looked as though it covered it, because it takes the stylesheet out of the page. It does
   * not: with no style element the guard's loop runs zero times and it passes on an empty palette.
   *
   * A guard that passes vacuously is the shape this repository is built against, and it was sitting
   * inside the one folder whose subject is that a page can be read.
   */
  sameOnEveryLens(
    'W-24b',
    'lifts the paper a shade, which is the plausible half of a palette edit - a ground that moves is ' +
      'a taste somebody has, where an ink that moves is a decision. It carries `dim` under 4.5:1 on ' +
      'every surface at once, and nothing on the rendered page looks wrong: the text is there, the ' +
      'colours are roles, and the contrast is a number nobody reads off a screen',
    [
      styleFile(
        THE_LIGHT_PALETTE,
        '  --paper: #d8d5cf; --wash: #f3f1ec; --card: #f6f4f0; --rule: #e2ded7; --edge: #d3cfc7;',
      ),
    ],
    killed(['every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible']),
  ),

  sameOnEveryLens(
    'W-85',
    'types the layout ceiling as a round number instead of deriving it, which is the edit that put ' +
      'the content of a contract page on 38.7% of a 2 560px screen and every page with no rail on ' +
      '17.5% of one. Nothing on the rendered page looks wrong: the pages are there, the lines are ' +
      'inside the measure, and a width nobody derived reads exactly like a width somebody chose',
    [styleFile(THE_SHELL_IS_AS_WIDE_AS_WHAT_IT_HOLDS, '  max-width: 78rem;')],
    killed(['every-ceiling-on-a-box-is-derived-and-never-typed']),
  ),

  /**
   * W-85 one door along. That cell types the ceiling; this one types the tracks under it, which is
   * where the layout moved when it stopped being one column and became three - and the guard W-85
   * belongs to says in its own comment that it reads `max-width` and nothing else.
   *
   * The two lengths it writes are the ones this stylesheet derives, to the pixel on the machine the
   * arithmetic was taken on. That is what makes it the plausible edit rather than a vandalism: the
   * pages render identically here and stop being derived everywhere else.
   */
  sameOnEveryLens(
    'W-86',
    'types the two columns beside the content instead of deriving them, on the arrangement that ' +
      'carries a table of contents. Nothing on the rendered page looks wrong on the machine the ' +
      'numbers were read on - the three columns are there, the measure holds, and the layout is ' +
      'exactly as wide as it was - and on any face whose zero is a different width the rail and the ' +
      'column beside it stop being what they were derived from',
    [
      styleFile(
        THE_THREE_COLUMNS_ARE_DECLARED_LENGTHS,
        '    grid-template-columns: 240px minmax(0, 1fr) 268px;',
      ),
    ],
    killed(['every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length']),
  ),

  sameOnEveryLens(
    'W-25',
    'prints a function as nothing at all, so a higher-order contract publishes a call with an ' +
      'argument missing rather than one the registry serves as a file',
    [literalFile(A_FUNCTION_IS_NAMED, `      return ''`)],
    killed(['a-function-is-named-as-what-the-registry-does-with-it']),
  ),

  sameOnEveryLens(
    'W-26',
    'writes every key bare, so `__proto__` and a key with a space in it are published as though they ' +
      'were identifiers a caller could type',
    [literalFile(A_KEY_IS_QUOTED_WHEN_IT_MUST_BE, `const IDENTIFIER = /^[\\s\\S]*$/`)],
    killed(['a-key-that-is-not-an-identifier-is-quoted']),
  ),

  sameOnEveryLens(
    'W-27',
    'drops a symbol description, so two group keys `array/group-by@1` settles apart are published as ' +
      'the same anonymous symbol',
    [literalFile(A_SYMBOL_KEEPS_ITS_DESCRIPTION, `      return 'Symbol()'`)],
    killed(['a-symbol-a-pattern-and-a-set-are-written-as-a-caller-writes-them']),
  ),

  /**
   * The grouping arrived to make fifty cases findable, and this is the defect that takes that back
   * while leaving every check about presence green.
   *
   * Every heading is on the page, every case is on the page, every anchor resolves, and the order
   * the contract argued for is gone - `string/slugify@1` puts `the-surprise-in-front` first on a
   * written argument about what a reader arriving from "slugify javascript" meets, and this reverses
   * it. Only a guard that reads the page in document order can see it, which is why one exists.
   */
  sameOnEveryLens(
    'W-30',
    'renders a table\'s groups in reverse, so the order a contract argued for is inverted and every ' +
      'case reads under the wrong heading',
    [
      contractPageFile(
        THE_GROUPS_RENDER_IN_THEIR_DECLARED_ORDER,
        `  ...[...table.groups].reverse().flatMap((group) =>
    renderedGroup(group, table, answer, fields, alone ? 'h3' : 'h4'),
  ),`,
      ),
    ],
    killed(['every-group-is-a-heading-and-its-cases-follow-it']),
  ),

  /**
   * A heading anchored on a case rather than on itself.
   *
   * The page still shows the right title, and `#ordinary-integer` now lands on the *IEEE-754 limits*
   * heading instead of on the case it names. It is W-11's defect one level up - an address that is
   * not the thing's own - and it is the reason the serialiser refuses the collision in the data as
   * well: the two failures meet on one page and only one of them is visible from the record.
   */
  sameOnEveryLens(
    'W-31',
    'anchors a group heading on the first case of its table, so two elements answer to one address ' +
      'and a shared link lands on the wrong one',
    [
      contractPageFile(
        A_HEADING_CARRIES_ITS_OWN_ADDRESS,
        `  addressed(heading, (table.cases[0] as { readonly id: string }).id, group.title),`,
      ),
    ],
    killed([
      'every-group-is-a-heading-and-its-cases-follow-it',
      'every-anchor-on-a-page-is-held-by-one-element',
    ]),
  ),

  // -------------------------------------------------------------------------
  // The playground: reading a literal back, and running what a browser runs
  // -------------------------------------------------------------------------

  /**
   * The two defects that decide whether reading a literal back is worth anything, and they are killed
   * by different guards on purpose. The negative zero is caught by real cases of the catalogue; the
   * hole is caught only by the arm table, because every case printing a word with no spelling belongs
   * to the one contract that has no page. That asymmetry is the argument for the table existing.
   */
  sameOnEveryLens(
    'W-32',
    'reads a negative zero back as a zero, so a field pre-filled from `number/parse@1`\'s own case ' +
      'holds a value the contract settles as a different one',
    [readLiteralFile(A_NUMBER_IS_READ_AS_ITSELF, `  if (number !== null) return Number(number) + 0`)],
    killed([
      'every-arm-of-an-encoded-value-is-read-back-or-refused-by-name',
      'every-case-the-registry-serves-is-read-back-from-the-literal-its-page-publishes',
      'the-numbers-json-cannot-carry-are-read-as-themselves',
    ]),
  ),

  sameOnEveryLens(
    'W-33',
    'builds `undefined` where a page printed a word with no JavaScript spelling, so a hole becomes an ' +
      'element and a function the registry serves as a file becomes a missing argument',
    [
      readLiteralFile(
        A_WORD_WITH_NO_SPELLING_IS_REFUSED,
        `  for (const word of Object.values(WITHOUT_A_SPELLING)) {
    if (scan.text.startsWith(word, scan.at)) { scan.at += word.length; return undefined }`,
      ),
    ],
    killed(['every-arm-of-an-encoded-value-is-read-back-or-refused-by-name']),
  ),

  /**
   * A code point above the basic plane written with four digits runs into whatever follows it, so the
   * literal spells a different string - and it is a real class rather than a theoretical one, because
   * the tag characters of a regional flag are format characters.
   */
  sameOnEveryLens(
    'W-34',
    'escapes every invisible code point with four digits, so one above the basic plane runs into the ' +
      'character after it and the literal spells something else',
    [literalFile(A_CODE_POINT_ABOVE_THE_PLANE_IS_BRACED, `  return code > 0x10ffff`)],
    killed(['a-code-point-above-the-basic-plane-survives-the-round-trip']),
  ),

  sameOnEveryLens(
    'W-35',
    'hands the declared value straight to a parameter declared `Date`, so every call of `date/add@1` ' +
      'is made with a string where the contract requires an instant',
    [playgroundFile(A_DATE_IS_CONSTRUCTED, `    build: (value) => value,`)],
    killed([
      'every-case-replays-through-the-stripped-artefact-a-browser-runs',
      'a-date-is-the-one-argument-this-site-constructs',
    ]),
  ),

  /**
   * The answer printed with `String`, which is the defect the whole rendering path exists to prevent:
   * `parseNumber('-0')` answers a negative zero and `String` prints it `0`, on the page where that
   * contract settles a case on the two being different.
   */
  sameOnEveryLens(
    'W-36',
    'prints the answer with `String`, so a negative zero reads as a zero and every escaped character ' +
      'of a slug is printed as itself',
    [
      playgroundFile(
        AN_ANSWER_IS_WRITTEN_AS_A_LITERAL,
        `const asALiteral = (value: unknown, path: string): string => String(asADeclaredValue(value))`,
      ),
    ],
    killed([
      'every-case-replays-through-the-stripped-artefact-a-browser-runs',
      'an-answer-is-written-the-way-the-case-table-writes-one',
    ]),
  ),

  sameOnEveryLens(
    'W-37',
    'falls back to a string field for a parameter type it does not know, so a contract whose ' +
      'playground cannot be built gets a page carrying one that lies about what it sends',
    [
      playgroundFile(
        AN_UNKNOWN_TYPE_STOPS_THE_BUILD,
        `const theArgumentFor = (parameter: ParameterRecord, what: string): Argument => {
  const known = AS_AN_ARGUMENT[parameter.type] ?? AS_AN_ARGUMENT['string']
  if (known === undefined) {`,
      ),
    ],
    killed(['a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself']),
  ),

  /**
   * The defect a real browser found and no static check could: without it, typing `42` into a field
   * declared `string` answers `input.trim is not a function` - the contract's own source reporting a
   * failure in its own words to somebody who has never seen it.
   */
  sameOnEveryLens(
    'W-38',
    'accepts whatever a field spells for a parameter declared `Duration`, so a string reaches the ' +
      'implementation and it is the contract that reports the mistake, in its own words',
    [playgroundFile(A_FIELD_SPELLS_ITS_DECLARED_TYPE, `      spelledBy: () => true,`)],
    killed(['a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called']),
  ),

  /**
   * The line that names what was received, which is the whole of the repair ADR-0096 makes.
   *
   * `(…)` said nothing at all, so the two spellings of `1 000` printed alike on the page whose
   * contract settles them apart. Printing with `String` restores exactly that silence.
   */
  sameOnEveryLens(
    'W-75',
    'prints the call with `String`, so a no-break space a reader typed reads as an ordinary one and ' +
      'the page says nothing about which of the two it received',
    [
      playgroundFile(
        A_CALL_IS_WRITTEN_AS_A_LITERAL,
        `export const callWritten = (name: string, given: readonly unknown[]): string =>
  \`\${name}(\${given.map((argument) => String(argument)).join(', ')})\``,
      ),
    ],
    killed(['an-invisible-code-point-a-reader-typed-is-named-in-the-output']),
  ),

  sameOnEveryLens(
    'W-76',
    'narrows what a text field is said to drop to the carriage return alone, so the one case a reader ' +
      'cannot retype under-reports what would be lost from it',
    [playgroundFile(A_TEXT_FIELD_LOSES_A_LINE_BREAK, `const STRIPPED_BY_A_TEXT_FIELD = /[\\r]/`)],
    killed(['a-case-a-text-field-cannot-carry-is-the-one-that-carries-a-line-break']),
  ),

  sameOnEveryLens(
    'W-77',
    'reads a text field as a literal, so a reader who types `hello` is refused for not writing it in ' +
      'quotes - the notation this site stopped teaching',
    [playgroundFile(A_TEXT_FIELD_HANDS_OVER_WHAT_WAS_TYPED, '')],
    killed([
      'a-text-field-hands-over-what-was-typed',
      'every-case-replays-through-the-stripped-artefact-a-browser-runs',
    ]),
  ),

  sameOnEveryLens(
    'W-39',
    'stops saying that what runs in a browser is the stripped source, so a page publishes an answer ' +
      'produced by a transformation it never mentions',
    [contractPageFile(WHAT_RUNS_IN_YOUR_BROWSER_IS_SAID, '')],
    killed(['what-runs-in-your-browser-is-said-once-and-beside-the-playground']),
  ),

  sameOnEveryLens(
    'W-40',
    'drops a module from the graph a browser loads, so every page fetches an import the site never ' +
      'writes and the playground never starts',
    [browserFile(THE_GRAPH_LISTS_EVERY_MODULE, '')],
    killed(['every-import-a-browser-module-keeps-is-a-module-the-site-writes']),
  ),

  /**
   * The four the first replay asked for. Attribution reported them as guards nothing reddens, which
   * is the instrument saying a region is unprobed rather than that a guard is weak - so the answer is
   * mutants, and each of these is a defect somebody could plausibly write.
   */
  sameOnEveryLens(
    'W-41',
    'reads an escaped code point as decimal, so `\\u00A0` becomes U+0000 and the no-break space ' +
      '`number/parse@1` settles a case on is read back as a different character entirely',
    [readLiteralFile(A_CODE_POINT_IS_HEXADECIMAL, `  const code = Number.parseInt(digits, 10)`)],
    killed([
      'two-inputs-that-look-alike-are-read-apart',
      'a-code-point-above-the-basic-plane-survives-the-round-trip',
      'every-case-the-registry-serves-is-read-back-from-the-literal-its-page-publishes',
    ]),
  ),

  sameOnEveryLens(
    'W-42',
    'drops a field whose value is `undefined`, so `{ days: undefined }` is read back as `{}` - the ' +
      'distinction `date/add@1` declares equivalent on purpose and `array/group-by@1` does not',
    [
      readLiteralFile(
        A_FIELD_SET_TO_UNDEFINED_IS_STILL_A_FIELD,
        `    const value = readValue(scan)
    if (value === undefined) return
    Object.defineProperty(record, name, {`,
      ),
    ],
    killed([
      'a-field-set-to-undefined-is-not-a-field-that-is-absent',
      'every-arm-of-an-encoded-value-is-read-back-or-refused-by-name',
      'every-case-the-registry-serves-is-read-back-from-the-literal-its-page-publishes',
    ]),
  ),

  sameOnEveryLens(
    'W-43',
    'stops at the first value and ignores whatever follows it, so a field holding `{ days: 1 } and ' +
      'more` is answered as though the reader had written only the part that parsed',
    [readLiteralFile(NOTHING_MAY_FOLLOW_THE_VALUE, '')],
    killed(['spacing-is-forgiven-and-a-second-spelling-is-not']),
  ),

  sameOnEveryLens(
    'W-44',
    'names a record only after filling it, so `#1` refers to something that does not exist yet and ' +
      'the nine cases pinning object identity cannot be read back at all',
    [
      readLiteralFile(
        A_RECORD_IS_NAMED_BEFORE_IT_IS_FILLED,
        `  const record: Record<string, unknown> = {}`,
      ),
    ],
    killed([
      'a-shared-object-is-read-back-as-one-object',
      'every-arm-of-an-encoded-value-is-read-back-or-refused-by-name',
    ]),
  ),

  /**
   * The two the diagnostic brought with it. A playground that answers only `calls` prints `null` for
   * every refused input on the two contracts where the reason *is* the answer, and it does so while
   * satisfying every other guard on the page - which is why the first of these exists.
   */
  sameOnEveryLens(
    'W-45',
    'builds a playground that names no diagnostic, so `number/parse@1` and `date/add@1` publish a ' +
      'form answering `null` to every input they turn down and nothing that tells one refusal from ' +
      'another',
    [playgroundFile(THE_DIAGNOSTIC_IS_NAMED, `  return null\n}`)],
    killed(['a-playground-names-the-diagnostic-of-a-contract-that-publishes-one']),
  ),

  sameOnEveryLens(
    'W-46',
    'compares the diagnostic against the answer by parameter count rather than by signature, so a ' +
      'diagnostic taking the same number of differently declared arguments is called with the ' +
      "answer's",
    [
      playgroundFile(
        THE_DIAGNOSTIC_TAKES_THE_ANSWERS_ARGUMENTS,
        `  if (diagnostic.parameters.length !== answer.parameters.length) {`,
      ),
    ],
    killed(['a-diagnostic-the-form-cannot-call-stops-the-site-and-names-itself']),
  ),

  // -------------------------------------------------------------------------
  // W-47 to W-53 - the method page, where a project like this one overstates
  // -------------------------------------------------------------------------
  //
  // Every defect here leaves a page that is well formed, complete, and reads better than the real
  // one. That is what makes this section different from the rest of the battery: a wrong contract
  // page publishes something a reader can check against the contract, and a wrong method page
  // publishes a claim about the checking itself, which nothing on the site contradicts.

  sameOnEveryLens(
    'W-47',
    'writes a figure into the sentence instead of deriving it. It is right on the day it is typed ' +
      'and goes false in silence the first time a battery gains a mutant - which is the failure this ' +
      'repository has caught in its own prose four times and never once in code, on the page whose ' +
      'whole argument is that a published number carries its derivation',
    [methodFile(A_FIGURE_IS_DERIVED, '        `7919 such readings over the ${measured.batteries} batteries.`,')],
    killed(['every-figure-on-the-method-page-comes-from-what-it-was-built-from']),
  ),

  sameOnEveryLens(
    'W-48',
    'prints the number of surviving cells and drops the split, so every defect nothing caught reads ' +
      'as a known hole when exactly one of them is a debt. The tidier sentence is the more ' +
      'frightening claim, which is why nobody would notice it was made',
    [methodFile(THE_BREAKDOWN_IS_SHOWN_BESIDE_THE_TOTAL, `        'various kinds' +`)],
    killed(['a-count-of-survivors-is-never-shown-without-its-breakdown']),
  ),

  sameOnEveryLens(
    'W-49',
    'shows the first two defects of each kind and stops, which is indistinguishable from a ' +
      'catalogue that has only two - the page goes on stating the true total above a list that ' +
      'quietly does not reach it',
    [
      methodFile(
        EVERY_SURVIVOR_IS_SHOWN,
        `    el('div', { class: 'cases' }, ...defects.slice(0, 2).map(renderSurvivor)),`,
      ),
    ],
    killed(['every-surviving-cell-is-published-with-its-own-battery-sentence']),
  ),

  sameOnEveryLens(
    'W-50',
    'moves the sentence about what a score does not prove to the end of the page, where a page like ' +
      'this one puts it: after the impressive number, as a footnote. Nothing is removed and the ' +
      'reading is changed completely, because a reader who meets the figure first has already read ' +
      'it as a claim about correctness',
    [
      methodFile(THE_LIMIT_IS_READ_FIRST, `    line('h2', 'What this does not prove'),\n`),
      methodFile(
        THE_SIGNATURE_SECTION,
        `    line(\n      'p',\n` +
          `      'A high score does not say the code is correct. It says the tests notice the defects that ' +\n` +
          `        'were tried.',\n      { class: 'lede' },\n    ),\n\n` +
          `    line('h2', 'What a signature does not prove'),`,
      ),
    ],
    killed(['what-the-score-does-not-prove-is-read-before-the-score']),
  ),

  sameOnEveryLens(
    'W-51',
    'tells the reader the figures were measured rather than that they are what this repository ' +
      'pins. The two coincide, so nothing on the page becomes false - what is lost is the one ' +
      'sentence that distinguishes a reader holding an assertion from a reader who has watched ' +
      'something happen, on the page that exists to make that distinction',
    [methodFile(A_PIN_IS_NOT_AN_OBSERVATION, `    line('p', 'Every figure here has been measured.'),`)],
    killed(['the-page-separates-what-is-asserted-from-what-a-run-would-observe']),
  ),

  sameOnEveryLens(
    'W-52',
    'empties the trigger on the one need this site builds no page for, leaving a reason with no ' +
      'event behind it - which ages into a description of the past and is how a scope decision ' +
      'becomes something nobody revisits',
    [sourceFile(A_DEFERRED_NEED_SAYS_WHAT_WOULD_CLOSE_IT, `    until: '',`)],
    killed(['every-deferred-need-names-what-would-close-it']),
  ),

  sameOnEveryLens(
    'W-53',
    'reaches into the instrument from a second module of this folder. `published.ts` is a door ' +
      'because exactly one module goes through it; a folder that imports whatever it finds useful ' +
      'in another folder has no frontier at all, which is the sentence `source.ts` already carries ' +
      'about the serialisation arriving on the second upstream',
    [
      cataloguePageFile(
        NOTHING_ELSE_OF_THE_INSTRUMENT_IS_REACHED,
        `import type { Battery } from '../../mutation/run.js'\n` +
          `import { CATALOGUE_PAGE, METHOD_PAGE, REFUSALS_PAGE, domainPageOf, linkTo, pageOf } from './paths.js'`,
      ),
    ],
    killed(['nothing-of-the-instrument-reaches-this-folder-but-the-published-derivation']),
  ),

  sameOnEveryLens(
    'W-54',
    'explains each kind of survivor in a sentence of the page\'s own rather than the one the ' +
      'instrument holds. It reads better, it is shorter, and it is a second statement of one ' +
      'judgement sitting in the file most likely to drift from the data it describes - which is what ' +
      'the whole page is written against',
    [methodFile(THE_KINDS_ARE_EXPLAINED_IN_THE_INSTRUMENTS_WORDS, `    paragraph('Some of these are not holes.'),`)],
    killed(['every-kind-of-survivor-shown-is-explained-in-the-instruments-own-words']),
  ),

  // -------------------------------------------------------------------------
  // W-55 to W-63 - the two files nobody reads
  // -------------------------------------------------------------------------
  //
  // Every defect below leaves a site that builds, renders, reads and links correctly. What it changes
  // is whether any of it is ever found, which is a failure with no symptom at all until somebody
  // notices, weeks later, that the catalogue is nowhere.

  sameOnEveryLens(
    'W-55',
    'closes the site to every crawler. **It is the launch failure of this whole folder**: one word, ' +
      'nothing breaks, every page still serves, every link still resolves, and the catalogue is ' +
      'simply never indexed. It costs nothing to write by accident and everything to find late, and ' +
      'the only thing standing between it and production is a guard that reads the file',
    [indexingFile(EVERYTHING_IS_READABLE, `  ['User-agent: *', 'Disallow: /', '', \`Sitemap: \${THE_ORIGIN}/\${SITEMAP}\`, ''].join('\\n')`)],
    killed(['robots-txt-lets-a-crawler-read-everything-and-names-the-sitemap']),
  ),

  sameOnEveryLens(
    'W-56',
    'leaves the method page out of the sitemap. The page is written, linked and served; it is only ' +
      'invisible to whoever would have found it by searching - which is the half of the site that ' +
      'has no reader coming to it from anywhere else',
    [
      siteFile(
        THE_SITEMAP_IS_THE_PAGES,
        `  return theCrawlerFiles(\n` +
          `    listed.filter((page) => !page.path.startsWith('method/')),\n` +
          `    root ?? { path: CATALOGUE_PAGE, title: '', description: '' },\n` +
          `  )`,
      ),
    ],
    killed([
      'every-page-is-in-the-sitemap-and-nothing-else-is',
      'every-page-is-listed-for-a-retriever-as-the-markdown-beside-it',
    ]),
  ),

  sameOnEveryLens(
    'W-57',
    'stops turning a page path into the folder it is served from, so every published URL names the ' +
      'file instead. **It is the mutant that separates the two sitemap guards**: the set comparison ' +
      'rebuilds what it expects with the very function this breaks, so it moves with the defect and ' +
      'stays green, and only reading the URL back finds that it now names nothing a server has',
    [pathsFile(A_LINK_IS_THE_FOLDER_AND_NOT_THE_FILE, `export const linkTo = (page: string): string => page`)],
    killed(['every-url-in-the-sitemap-decodes-to-a-page-this-site-writes']),
  ),

  sameOnEveryLens(
    'W-58',
    'stamps every URL with the day the build ran. The protocol makes the field optional and this is ' +
      'why: there is no date here that is not a fact about the machine, so a published file starts ' +
      'carrying a machine-dependent value - and a crawler told a page changed today refetches it for ' +
      'ever, while one told it changed a year ago may not come back at all',
    [
      indexingFile(
        A_URL_LINE_CARRIES_NO_DATE,
        `    ...pages.map(\n` +
          `      (page) =>\n` +
          `        \`  <url><loc>\${escaped(urlOf(page))}</loc><lastmod>\${new Date()\n` +
          `          .toISOString()\n` +
          `          .slice(0, 10)}</lastmod></url>\`,\n` +
          `    ),`,
      ),
    ],
    killed(['the-sitemap-carries-no-date-this-repository-cannot-derive']),
  ),

  sameOnEveryLens(
    'W-59',
    'writes the origin a second time, inside the one line that assembles a URL. It agrees with the ' +
      'declaration on the day it is written, which is the whole difficulty: the two part company on ' +
      'the day the address moves, and the copy that lies is the one in a published file',
    [
      indexingFile(
        EVERYTHING_IS_READABLE,
        `  ['User-agent: *', 'Allow: /', '', \`Sitemap: https://toopo.dev/\${SITEMAP}\`, ''].join('\\n')`,
      ),
    ],
    killed(['no-file-of-this-folder-spells-the-origin']),
  ),

  sameOnEveryLens(
    'W-60',
    'publishes each location relative to the origin rather than absolute. It reads perfectly and the ' +
      'protocol requires otherwise, so a crawler is entitled to ignore the file entirely - which is ' +
      'the same outcome as W-55 reached by a route that looks like tidying',
    [
      indexingFile(
        A_URL_LINE_CARRIES_NO_DATE,
        `    ...pages.map(\n` +
          `      (page) => \`  <url><loc>\${escaped(urlOf(page).slice(THE_ORIGIN.length))}</loc></url>\`,\n` +
          `    ),`,
      ),
    ],
    killed(['every-page-is-in-the-sitemap-and-nothing-else-is']),
  ),

  sameOnEveryLens(
    'W-61',
    'stops escaping the ampersand, which no address in this catalogue holds today - and that is what ' +
      'makes it worth a mutant rather than a comment: the escape is there for data that does not ' +
      'exist yet, so nothing about the current output can tell whether it was dropped. The failure ' +
      'it prevents is not a wrong character but a document a parser rejects whole',
    [indexingFile(XML_IS_ESCAPED, `    .replaceAll('&', '&')`)],
    killed(['a-path-that-would-break-the-xml-is-escaped']),
  ),

  sameOnEveryLens(
    'W-62',
    'names the second domain in a comment. It is a fact about DNS and not about this site, and the ' +
      'moment it is written here it is a second statement of where the catalogue lives - kept in the ' +
      'one place nobody edits when the first one changes',
    [
      indexingFile(
        `export const robotsOf = (): string =>`,
        `/** The second name redirects here: https://toopo.io */\nexport const robotsOf = (): string =>`,
      ),
    ],
    killed(['the-generator-knows-of-no-domain-but-the-one-it-publishes-on']),
  ),

  sameOnEveryLens(
    'W-63',
    'serves the sitemap from a folder of its own, which is a perfectly good URL that no crawler ' +
      'looks at. Both files are found by convention and by nothing else, so moving one is the same ' +
      'as not writing it - and the robots line goes on naming it correctly, so nothing disagrees',
    [pathsFile(THE_SITEMAP_IS_WHERE_A_CRAWLER_LOOKS, `export const SITEMAP = 'sitemap/index.xml'`)],
    killed(['every-file-found-by-convention-is-at-the-address-that-convention-fixes']),
  ),

  /**
   * The two defects below are the two this repository actually published, put back verbatim.
   *
   * Neither was found by a guard - the first by reading the front page in document order, the second
   * by re-reading the other six afterwards - so what each one pins is a guard that exists because
   * somebody read a page, and the mutant is the reading made repeatable.
   */
  sameOnEveryLens(
    'W-64',
    'writes a contract name as a bare anchor rather than as the title it is. An anchor is phrasing ' +
      'content and carries no separator, so every summary on the front page begins mid-line - ' +
      '`typescript/number/parse@1Convert a string to a finite number` - and the outline of the page ' +
      'that is this whole site\'s navigation holds not one contract name. Every word is still ' +
      'present, so the projection guard stays green: two blocks have become one sentence, which a ' +
      'person reads and a guard about presence cannot',
    [
      cataloguePageFile(
        A_CONTRACT_NAME_IS_A_TITLE,
        `              el(\n` +
          `                'a',\n` +
          `                { href: linkTo(entry.installable ? pageOf(entry.address) : REFUSALS_PAGE) },\n` +
          `                text(renderContract(entry.address)),\n` +
          `              ),`,
      ),
    ],
    killed(['no-element-runs-into-the-one-beside-it']),
  ),

  /**
   * The published defect was this edit on the paragraph carrying `THE_REPLAY`, and the cell is written
   * at the silences instead, on two measurements.
   *
   * **It is the one call site of this class no other guard covers.** Every other sentence the page
   * takes from `mutation/` is also required by name somewhere - the survivors' descriptions, the
   * vocabulary of kinds, `THE_PINS_ARE_AN_ASSERTION` and each value of `THE_REPLAY` - so the same edit
   * there reddens two guards and says nothing about which of them was needed. Measured: at the
   * silences this guard is the only red in the whole folder, and at `THE_REPLAY` it is never alone.
   *
   * And it is the more robust of the two. `THE_REPLAY.spread` carries one asterisk pair, so the cell
   * would quietly stop being a defect the day that sentence is reworded; the page renders 64 silence
   * reasons and 48 of them carry a mark.
   */
  sameOnEveryLens(
    'W-65',
    'renders a battery\'s own sentence without parsing the two marks it is written with, so the ' +
      'asterisks and the backticks reach the reader as themselves - on the page whose whole subject ' +
      'is rigour. `inline` goes on existing and goes on being right: what the edit removes is a ' +
      'paragraph going through it, which is the shape every failure of this rule has taken, including ' +
      'the one this repository published',
    [
      methodFile(
        A_SILENCE_IS_PARSED_LIKE_EVERY_OTHER_SENTENCE,
        `        line('p', silence.reason, { class: 'why' }),`,
      ),
    ],
    killed(['no-mark-a-sentence-carries-reaches-the-reader-as-itself']),
  ),

  /**
   * A page is written at the address it is linked by, which is the edit that reopens the one collision
   * a static tree cannot survive.
   *
   * `linkTo` strips `index.html` because `/typescript/number/parse@1/` is what a reader follows, and
   * writing the page *there* reads like tidying: one address, no file name. It puts a file exactly
   * where the answers about that contract need a directory, and no filesystem holds both - so the
   * build dies on an `EISDIR` naming one path, with nothing saying which two things wanted it.
   *
   * It reddens one guard of this folder and no other, measured: the sitemap, the licence header and
   * the page address are all built from `pageOf`, which this leaves alone. That is the whole argument
   * for the tree being one value - the collision is a question about the *set* of paths, and nothing
   * that renders a single address can be asked it.
   */
  sameOnEveryLens(
    'W-66',
    'writes each page at the address it is linked by rather than at the file it is, so the page of a ' +
      'contract lands on the folder the answers about that contract live in',
    [
      siteFile(
        A_PAGE_IS_WRITTEN_AT_THE_FILE_IT_IS,
        "    ...[...pages].map(([path, page]) => [path.replace(/\\/index\\.html$/, ''), toHtml(page)] as const),",
      ),
    ],
    killed(['no-path-is-both-a-file-and-a-directory']),
  ),

  // -------------------------------------------------------------------------
  // W-67 to W-72 - the projection a machine reads, and what a page says to one
  // -------------------------------------------------------------------------
  //
  // Every defect below leaves a site that renders, reads and links exactly as it does today. What each
  // one changes is what a retriever gets, which nobody looking at the site can see - the same shape as
  // the two crawler files above, on a projection and on a payload rather than on two small documents.

  /**
   * The defect the third projection exists to prevent, written as the tidier of the two outputs.
   *
   * A Markdown page whose headings are paragraphs loses no word, reads identically, and is the same
   * document as the reading `toText` already produces - which makes the file pure cost. It is W-05's
   * defect on the projection whose whole subject is the structure `toText` throws away.
   */
  sameOnEveryLens(
    'W-67',
    'emits a heading as prose in the Markdown, so the projection that exists to carry a document\'s ' +
      'outline publishes a wall of paragraphs with every word still in it',
    [documentFile(A_HEADING_IS_A_HEADING_IN_MARKDOWN, `    h2: ends('\\n\\n'),`)],
    killed([
      'the-markdown-projection-keeps-the-structure-and-changes-the-markup',
      'every-heading-of-a-page-is-a-heading-in-its-markdown',
    ]),
  ),

  /**
   * The escaping in the direction a page is read as syntax, and it is reachable on real data.
   *
   * Measured over the seven pages: 53 of 790 prose nodes carry a backtick, so a contract's own
   * rationale opens a code span and the sentence after it is published as code. Four more open on a
   * block marker and become list items.
   */
  sameOnEveryLens(
    'W-68',
    'writes contract prose into the Markdown without escaping it, so a rationale holding a backtick ' +
      'opens a code span over the sentence beside it and a line opening on a dash becomes a list',
    [documentFile(PROSE_IS_ESCAPED, `  prose: (value) => value,`)],
    killed(['a-mark-in-prose-is-escaped-and-a-mark-in-code-is-not']),
  ),

  /**
   * The other direction, which is not a weaker version of the first: it is what a cautious reading of
   * the same requirement produces, and it corrupts the one thing on the page that is the contract's own
   * answer. `slugify('a*b')` published as `slugify('a\\*b')` is a claim the contract does not make.
   */
  sameOnEveryLens(
    'W-69',
    'escapes a rendered call as though it were prose, so every answer this catalogue settles is ' +
      'published to a machine with backslashes the contract never wrote',
    [documentFile(CODE_IS_NOT_PROSE, `  verbatim: new Set(),`)],
    killed([
      'a-mark-in-prose-is-escaped-and-a-mark-in-code-is-not',
      'a-code-span-is-delimited-by-a-run-the-code-cannot-close',
    ]),
  ),

  /**
   * The delimiter assumed rather than derived, which no current output can tell apart.
   *
   * No value in this catalogue holds a backtick, so the mutant changes not one byte of what is
   * published today - and the day a contract settles a case on a template literal, the span closes
   * early and the rest of the answer is published as prose. It is W-61's argument about an escape for
   * data that does not exist yet, on a delimiter.
   */
  sameOnEveryLens(
    'W-70',
    'closes a code span with a single backtick instead of a run the code cannot write, which is ' +
      'identical on every page today and truncates the first answer that holds one',
    [documentFile(A_SPAN_IS_CLOSED_BY_WHAT_THE_CODE_CANNOT_WRITE, `  const fence = '\`'`)],
    killed(['a-code-span-is-delimited-by-a-run-the-code-cannot-close']),
  ),

  /**
   * The twin written at the address of the page it is a twin of.
   *
   * It is W-66 one file along and with the opposite symptom: that one puts a page where a directory has
   * to be and the build dies, this one silently writes Markdown over every `index.html` in the tree.
   * The site still deploys, every URL still answers, and every page a reader opens is a text file.
   */
  sameOnEveryLens(
    'W-71',
    'writes a page\'s Markdown at the page\'s own address, so the twin overwrites the page it is a ' +
      'projection of and the `rel="alternate"` link on every page points at nothing',
    [pathsFile(THE_MARKDOWN_IS_A_SIBLING, `  page`)],
    killed(['every-page-has-its-markdown-beside-it-at-the-same-address']),
  ),

  /**
   * The one escape a payload in a `script` element needs, and the reason it is a JSON escape.
   *
   * The content of a `script` is raw text, so nothing in it is decoded and nothing in it may spell the
   * closing tag. A value carrying `</script>` ends the element early: the structured data is truncated
   * and the rest of it is written into the page as markup.
   */
  sameOnEveryLens(
    'W-72',
    'serialises the structured data without escaping the one character that can close the element it ' +
      'sits in, so a value holding `</script>` truncates the payload and spills into the document',
    [
      documentFile(
        THE_PAYLOAD_CANNOT_CLOSE_ITS_OWN_ELEMENT,
        '  `<script type="application/ld+json">${JSON.stringify(data)}</script>`',
      ),
    ],
    killed(['the-structured-data-is-json-a-consumer-reads-back-as-what-the-page-shows']),
  ),

  /**
   * The licence a machine reads, set to the one this repository is under rather than the one a reader
   * takes.
   *
   * Both are true sentences about this project and only one is true of the file in front of the
   * consumer: the repository is MIT and what `toopo add` copies is MIT-0. ADR-0047 names getting a
   * licence wrong inside somebody else's repository as the most expensive defect this project can
   * produce and the only one invisible from here - and this publishes it in the one field written to be
   * believed without being read.
   */
  sameOnEveryLens(
    'W-73',
    'publishes the repository\'s licence as the licence of the source a reader takes, which is a true ' +
      'sentence about this project and a false one about the file the page is offering',
    [contractPageFile(WHAT_A_READER_TAKES_IS_WHAT_IS_DECLARED, `      license: 'MIT',`)],
    killed(['the-structured-data-a-page-publishes-is-the-record-it-renders']),
  ),

  /**
   * The payload carried into the projections, which is the shape of the repair somebody would reach
   * for.
   *
   * A Markdown twin that wanted its metadata in front matter is a reasonable thing to want, and this is
   * how it gets written: widen the assembly to carry the field the document gained. What it does is put
   * the payload into *every* projection - so the reading, which is the instrument this whole folder is
   * steered by, gains a JSON blob between the description and the first block, and a stranger reading
   * the page in document order meets it.
   *
   * It is the defect the field's placement was chosen against, and the attribution asked for it: the
   * guard held both halves of the measurement and nothing reddened it, which the instrument reads as a
   * decorative guard until a mutant says otherwise.
   */
  sameOnEveryLens(
    'W-74',
    'carries the structured data into every projection, so the payload written for a machine lands in ' +
      'the reading a stranger and a screen reader get - between the description and the first block ' +
      'of every page on the site',
    [
      documentFile(
        A_PROJECTION_CARRIES_WHAT_A_READER_MEETS,
        `    how.prose(document.description),\n` +
          `    '',\n` +
          `    JSON.stringify(document.structuredData),\n` +
          `    '',\n` +
          `    ...document.body.map((node) => projected(node, how, false)),`,
      ),
    ],
    killed(['the-structured-data-is-in-no-projection-a-reader-meets']),
  ),

  // --- What the host is told about the tree it serves. ADR-0097 ---

  /**
   * A pattern written by hand where one was derived, misspelled by a single letter.
   *
   * It is the defect the derivation exists to make impossible, so producing it takes writing the
   * derivation out again - which is the point: a rule set assembled by hand is one letter away from an
   * endpoint served under no policy at all. The guard that sees it asks `askedAt`, `pathTo`'s own
   * inverse, so a pattern naming no endpoint is caught rather than compared against a twin rebuilt from
   * the same function.
   */
  sameOnEveryLens(
    'W-78',
    'writes a rule pattern by hand instead of deriving it, so one endpoint is described at an ' +
      'address the emission never writes and its answers are served under no rule',
    [
      servedHeadersFile(
        '    url: pathTo(endpoint, EVERY_ADDRESS),',
        "    url: endpoint.id === 'blob' ? '/blobs/*' : pathTo(endpoint, EVERY_ADDRESS),",
      ),
    ],
    killed([
      'every-endpoint-carries-a-cache-rule-at-an-address-that-names-it',
      'only-the-two-content-addressed-endpoints-are-cached-for-a-year',
      'every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint',
    ]),
  ),

  /**
   * Every answer promised for a year, which is the direction that cannot be taken back.
   *
   * A named answer cached immutably is a browser that will not ask again for a year about a binding
   * that moves - and unlike a missing header, nothing on the server can repair it once the entry is in
   * somebody's cache. It is why `cachePolicyFor` reads the addressing class and why nothing else may.
   */
  sameOnEveryLens(
    'W-79',
    'gives every rule the content-addressed policy, so a name whose binding moves is promised never ' +
      'to go stale',
    [
      servedHeadersFile(
        'cacheControlOf(cachePolicyFor(endpoint.addressing))',
        "cacheControlOf(cachePolicyFor('content-addressed'))",
      ),
    ],
    killed([
      'only-the-two-content-addressed-endpoints-are-cached-for-a-year',
      'every-other-answer-is-revalidated-before-it-is-used',
    ]),
  ),

  /**
   * The `noindex` aimed at the declared origin instead of at the deployment.
   *
   * The realistic spelling of it: a preview host under the real domain rather than the temporary one,
   * which reads correctly and would publish the catalogue's own pages as unindexable for ever while
   * leaving the address that needed closing open. It is the one mistake in that rule a guard can still
   * see, because whether the pattern *matches* is Cloudflare's answer and not this repository's.
   */
  sameOnEveryLens(
    'W-80',
    'closes a host under the declared origin rather than the deployment, so the pages the catalogue ' +
      'is published at are the ones told not to be indexed',
    [
      servedHeadersFile(
        '  `https://:project.pages.dev/${EVERY_ADDRESS}`,',
        '  `https://:project.toopo.dev/${EVERY_ADDRESS}`,',
      ),
    ],
    killed(['the-deployment-is-closed-to-robots-and-the-declared-origin-is-not']),
  ),

  /**
   * The preview shape dropped, which is the half of a host rule nobody would notice missing.
   *
   * A production deployment is one label in front of the vendor's domain and a preview is two, and a
   * placeholder in a host stops at a period - so one pattern closes one shape. The one left open would
   * be the preview, which is the address nobody visits and therefore the one that stays open for
   * months while the address a person checks reads correctly.
   */
  sameOnEveryLens(
    'W-82',
    'closes only the shape a person visits, leaving every preview deployment open to indexing under ' +
      'a rule that reads correctly at the address anybody would check',
    [servedHeadersFile('  `https://:version.:project.pages.dev/${EVERY_ADDRESS}`,\n', '')],
    killed(['both-the-published-shape-and-the-preview-shape-are-closed']),
  ),

  /**
   * The indent dropped from the rendering, which is the failure that leaves every other guard green.
   *
   * The rules are right, the policy is right, and the file the host parses carries a header at the
   * margin where a URL is expected - so the parser reads eight rules and applies none of them. Nothing
   * about the declaration is wrong, and nothing is served.
   */
  sameOnEveryLens(
    'W-81',
    'renders a header at the margin rather than indented under its URL, so a host reads a rule where ' +
      'a pattern should be and applies none of them',
    [servedHeadersFile('`  ${name}: ${value}`', '`${name}: ${value}`')],
    killed(['the-rendering-carries-every-rule-with-its-headers-indented-beneath-it']),
  ),
]

export const battery: Battery = {
  name: 'site',
  contractPath: 'packages/site',
  vitestConfig: 'packages/site/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'W-01',

  arms: [
    {
      id: 'W',
      ref: 'HEAD',
      convention:
        'the generator as committed: a page is a value, two projections of it must agree, and every ' +
        'value the registry encodes is written as the literal a reader recognises',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['W'], edits: [] },
  ],

  mutants,

  /**
   * The one guard in this folder no edit to this folder can reach, and it is a guard about the test's
   * own apparatus rather than about the generator.
   *
   * `EVERY_ARM` claims to hold a value the registry encodes to each arm of `EncodedValue`, and this
   * checks the claim. Both halves of it live outside what this battery may edit: the samples are in
   * the test file, and `encode` is in `packages/registry/`. An edit anywhere in `packages/site/` leaves it green by
   * construction, so it is unreachable here rather than unprobed - the distinction the instrument
   * insists on, because *cannot be reached* and *nothing reaches it yet* look identical from outside.
   */
  unreachableGuards: [
    {
      guards: ['the-sample-really-produces-the-arm-it-is-filed-under'],
      reason:
        'it compares the samples of a test-local table against `encode`, and a battery injects only ' +
        'into the folder under measurement - so neither side of what it checks is editable from here',
    },
  ],

  /**
   * Four guards no mutant of this battery probes, and each one is a region rather than a gap.
   *
   * `nothing-but-the-local-adapter-reaches-the-serialisation` cannot be probed by an edit to a body:
   * the defect it exists for is a *second module gaining an import*, which is a line added to a file
   * rather than a line rewritten in one, and every edit here must match exactly once. It is the same
   * shape as `cli-install`'s C-19, which reaches it by adding the import to a file that has nothing
   * else to say - and this folder has no such file, because `paths.ts` and `document.ts` both hold
   * anchors of their own.
   *
   * `a-quote-and-a-backslash-are-escaped-before-anything-else` is reachable and is left alone
   * deliberately: reordering the two `replaceAll` calls is a mutant whose effect is a doubled
   * backslash in one string, and it is already the thing W-06 removes wholesale. It is declared here
   * rather than written as a twenty-eighth cell that measures a narrower version of an existing one.
   *
   * **`nesting-does-not-widen-the-gap-between-two-blocks` was here and is not, and the instrument is
   * what took it out.** The declaration read that W-05 removes the separator rather than the
   * collapsing, and that a mutant removing the collapse would produce wider gaps and identical words -
   * a formatting difference rather than a defect a reader is misled by. Both sentences are still true
   * of the collapsing. What made the declaration stale is a mutant nobody wrote for it: W-74 widens the
   * assembly by two entries, and that guard pins the whole reading of a nested page as one exact
   * string, so it reddens. The attribution refused the run under *declared silent and reddened anyway*,
   * which is the half of this field that costs nothing to get wrong and is never noticed - a region
   * that has stopped being unprobed reads exactly like one that never was.
   */
  unprobedRegions: [
    {
      nature: 'documents a decision',
      reason:
        'a defect that adds a line rather than rewriting one, or that this battery measures more ' +
        'widely elsewhere',
      guards: [
        'a-quote-and-a-backslash-are-escaped-before-anything-else',
        'nothing-but-the-local-adapter-reaches-the-serialisation',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'a limit somebody else publishes, which only a catalogue growing past it can violate. The ' +
        'rule count is one per endpoint and the endpoints are eight, so no edit to a file of this ' +
        'folder produces a hundred and first rule or a two-thousandth character - what would is a ' +
        'registry with ninety-three more endpoints, and that is not a mutant.',
      guards: ['the-file-stays-inside-the-limits-the-host-parses-it-under'],
    },
  ],
}
