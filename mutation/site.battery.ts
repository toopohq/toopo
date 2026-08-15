/**
 * The battery over the generator: what a page says, and what it must never say.
 *
 * It is the eighteenth, and the first to inject into `site/`. The three that measure `cli/` ask what
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
const literalFile = (find: string, replace: string) => ({ file: 'literal.ts', find, replace })
const contractPageFile = (find: string, replace: string) => ({ file: 'contract-page.ts', find, replace })
const cataloguePageFile = (find: string, replace: string) => ({ file: 'catalogue-page.ts', find, replace })
const catalogueFile = (find: string, replace: string) => ({ file: 'catalogue.ts', find, replace })
const localFile = (find: string, replace: string) => ({ file: 'local-source.ts', find, replace })
const sourceFile = (find: string, replace: string) => ({ file: 'source.ts', find, replace })
const pathsFile = (find: string, replace: string) => ({ file: 'paths.ts', find, replace })
const readLiteralFile = (find: string, replace: string) => ({ file: 'read-literal.ts', find, replace })
const playgroundFile = (find: string, replace: string) => ({ file: 'playground.ts', find, replace })
const browserFile = (find: string, replace: string) => ({ file: 'browser.ts', find, replace })
const methodFile = (find: string, replace: string) => ({
  file: 'methodology-page.ts',
  find,
  replace,
})
const indexingFile = (find: string, replace: string) => ({ file: 'indexing.ts', find, replace })
const siteFile = (find: string, replace: string) => ({ file: 'site.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const TEXT_IS_ESCAPED = `const escapeText = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')`

const AN_ATTRIBUTE_IS_ESCAPED_TOO = `const escapeAttribute = (value: string): string => escapeText(value).replaceAll('"', '&quot;')`

const CHROME_IS_NOT_READ_ALOUD = `  if (isChrome(node)) return ''`

const A_BLOCK_SEPARATES = `  h1: '\\n\\n',`

const A_PARAGRAPH_SEPARATES = `  p: '\\n\\n',`

const THE_PAGE_DECLARES_ITS_LANGUAGE = `    '<html lang="en">',`

const THE_STYLE_IS_THE_ONLY_THING_LOADED = `    \`<style>\${STYLE}</style>\`,`

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

const THE_ANCHOR_IS_THE_CASE_IDENTIFIER = `    { id: entry.id },`

const THE_GROUPS_RENDER_IN_THEIR_DECLARED_ORDER = `  ...table.groups.flatMap((group) => renderedGroup(group, table, answer, alone ? 'h3' : 'h4')),`

const A_HEADING_CARRIES_ITS_OWN_ADDRESS = `  addressed(heading, group.id, group.title),`

const ONE_ANSWER_IS_WRITTEN_BARE = `    answered.length === 1`

const THE_COST_IS_WHAT_LANDS = `  const bytes = implementation.files.reduce((total, file) => total + file.bytes, 0)`

const THE_DESCRIPTION_IS_NOT_THE_SUMMARY = `      \`\${cases} named edge cases, settled and frozen. TypeScript source copied into your project: \` +`

const A_SNAPSHOT_IS_CHECKED = `  const faults = servedSnapshotFaults(answer)`

const ONLY_AN_INSTALLABLE_CONTRACT_HAS_A_PAGE = `    .entries.filter((entry) => entry.installable)`

const A_REFUSED_CONTRACT_IS_OFFERED_NOTHING = `            entry.installable
              ? \`toopo add \${entry.address.name}\``

const THE_VERSION_IS_VISIBLY_FALSE = `export const THE_UNPUBLISHED_VERSION = '0.0.0-local'`

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
 * It was `41`. The first collision was an address: `THE_REPLAY.measuredAt` was stamped `0d8e41d`,
 * whose digit runs include `41`, and the repair was to take every address off both sides. The second
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
const A_CONTRACT_NAME_IS_A_TITLE = `          el(
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

const NOTHING_ELSE_OF_THE_INSTRUMENT_IS_REACHED = `import { METHOD_PAGE, REFUSALS_PAGE, linkTo, pageOf } from './paths.js'`

const THE_KINDS_ARE_EXPLAINED_IN_THE_INSTRUMENTS_WORDS = `    paragraph(WHAT_A_SURVIVOR_MEANS_TO_A_READER[why]),`

const EVERYTHING_IS_READABLE = `  ['User-agent: *', 'Allow: /', '', \`Sitemap: \${THE_ORIGIN}/\${SITEMAP}\`, ''].join('\\n')`

const THE_SITEMAP_IS_THE_PAGES = `  theCrawlerFiles([...pages.keys()])`

const A_LINK_IS_THE_FOLDER_AND_NOT_THE_FILE = `export const linkTo = (page: string): string => page.replace(/index\\.html$/, '')`

const A_URL_LINE_CARRIES_NO_DATE = `    ...pages.map((page) => \`  <url><loc>\${escaped(urlOf(page))}</loc></url>\`),`

const THE_ORIGIN_IS_WRITTEN_ONCE = `export const THE_ORIGIN = 'https://toopo.dev'`

const XML_IS_ESCAPED = `    .replaceAll('&', '&amp;')`

const THE_SITEMAP_IS_WHERE_A_CRAWLER_LOOKS = `export const SITEMAP = 'sitemap.xml'`

const A_PAGE_IS_ADDRESSED_BY_ITS_CONTRACT = `export const pageOf = (address: ContractAddress): string => \`\${renderContract(address)}/index.html\``

const A_NUMBER_IS_READ_AS_ITSELF = `  if (number !== null) return Number(number)`

const A_WORD_WITH_NO_SPELLING_IS_REFUSED = `  for (const word of Object.values(WITHOUT_A_SPELLING)) {`

const A_CODE_POINT_ABOVE_THE_PLANE_IS_BRACED = `  return code > 0xffff`

const A_DATE_IS_CONSTRUCTED = `    build: (declared) => new Date(declared as string),`

const AN_ANSWER_IS_WRITTEN_AS_A_LITERAL = `export const answerWritten = (answer: unknown): string =>
  literal(encode(asADeclaredValue(answer), 'the answer'))`

const AN_UNKNOWN_TYPE_STOPS_THE_BUILD = `const refuseAnUnknownType = (parameter: ParameterRecord, what: string): string | null => {
  const known = AS_AN_ARGUMENT[parameter.type]
  if (known === undefined) {`

const A_FIELD_SPELLS_ITS_DECLARED_TYPE = `  string: {
    spelledBy: (declared) => typeof declared === 'string',`

const WHAT_RUNS_IN_YOUR_BROWSER_IS_SAID = `      line('p', whatRunsInYourBrowser(contract.address.name), { class: 'meta' }),`

const THE_GRAPH_LISTS_EVERY_MODULE = `  'site/literal.ts',
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

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'W-01',
    'writes contract prose into the markup without escaping it, so an input holding a `<` opens a ' +
      'tag and a rationale holding an ampersand is read as an entity',
    [documentFile(TEXT_IS_ESCAPED, `const escapeText = (value: string): string => value`)],
    killed([
      'a-text-node-is-escaped-in-the-html',
      'an-attribute-value-is-escaped-including-its-quotes',
      'every-word-of-the-page-is-in-both-projections',
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
      'every-word-of-the-page-is-in-both-projections',
      'every-word-of-every-page-survives-both-projections',
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
    [documentFile(A_BLOCK_SEPARATES, `  h1: '',`)],
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
    [documentFile(A_PARAGRAPH_SEPARATES, `  p: '',`)],
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
      'every-word-of-every-page-survives-both-projections',
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
    [contractPageFile(THE_ANCHOR_IS_THE_CASE_IDENTIFIER, `    { id: \`case-\${entry.rationale.length}\` },`)],
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
        `            true
              ? \`toopo add \${entry.address.name}\``,
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
    'binds the five at a version that looks published, so the two stand-ins of this repository stop ' +
      'agreeing about the one thing that says nothing here was ever released',
    [localFile(THE_VERSION_IS_VISIBLY_FALSE, `export const THE_UNPUBLISHED_VERSION = '1.0.0'`)],
    killed(['both-stand-ins-bind-the-same-visibly-unpublished-version']),
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
        `  ...[...table.groups].reverse().flatMap((group) => renderedGroup(group, table, answer, alone ? 'h3' : 'h4')),`,
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
    [playgroundFile(A_DATE_IS_CONSTRUCTED, `    build: (declared) => declared,`)],
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
        `export const answerWritten = (answer: unknown): string => String(asADeclaredValue(answer))`,
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
        `const refuseAnUnknownType = (parameter: ParameterRecord, what: string): string | null => {
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
    'accepts whatever a field spells for a parameter declared `string`, so a number reaches the ' +
      'implementation and it is the contract that reports the mistake, in its own words',
    [playgroundFile(A_FIELD_SPELLS_ITS_DECLARED_TYPE, `  string: {\n    spelledBy: () => true,`)],
    killed(['a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called']),
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
        `import type { Battery } from '../mutation/run.js'\n` +
          `import { METHOD_PAGE, REFUSALS_PAGE, linkTo, pageOf } from './paths.js'`,
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
        `  theCrawlerFiles([...pages.keys()].filter((path) => !path.startsWith('method/')))`,
      ),
    ],
    killed(['every-page-is-in-the-sitemap-and-nothing-else-is']),
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
    killed(['the-two-crawler-files-are-at-the-addresses-a-crawler-looks-for']),
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
        `          el(\n` +
          `            'a',\n` +
          `            { href: linkTo(entry.installable ? pageOf(entry.address) : REFUSALS_PAGE) },\n` +
          `            text(renderContract(entry.address)),\n` +
          `          ),`,
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
]

export const battery: Battery = {
  name: 'site',
  contractPath: 'site',
  vitestConfig: 'site/vitest.config.ts',
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
   * the test file, and `encode` is in `packages/registry/`. An edit anywhere in `site/` leaves it green by
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
   * `nesting-does-not-widen-the-gap-between-two-blocks` is the collapsing rule, and W-05 removes the
   * separator it collapses rather than the collapsing. A mutant that removed the collapse would
   * produce a reading with wider gaps and identical words, which is a formatting difference and not a
   * defect a reader is misled by.
   */
  unprobedRegions: [
    {
      nature: 'documents a decision',
      reason:
        'a defect that adds a line rather than rewriting one, or that this battery measures more ' +
        'widely elsewhere',
      guards: [
        'a-quote-and-a-backslash-are-escaped-before-anything-else',
        'nesting-does-not-widen-the-gap-between-two-blocks',
        'nothing-but-the-local-adapter-reaches-the-serialisation',
      ],
    },
  ],
}
