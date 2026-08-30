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
import { killed, mutantsOn, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'W', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const documentFile = (find: string, replace: string) => ({ file: 'document.ts', find, replace })
const styleFile = (find: string, replace: string) => ({ file: 'style.ts', find, replace })
const servedModulesFile = (find: string, replace: string) => ({
  file: 'served-modules.ts',
  find,
  replace,
})
const servedStylesheetFile = (find: string, replace: string) => ({
  file: 'served-stylesheet.ts',
  find,
  replace,
})
const literalFile = (find: string, replace: string) => ({ file: 'literal.ts', find, replace })
const contractPageFile = (find: string, replace: string) => ({ file: 'contract-page.ts', find, replace })
const cataloguePageFile = (find: string, replace: string) => ({ file: 'catalogue-page.ts', find, replace })
const catalogueFile = (find: string, replace: string) => ({ file: 'catalogue.ts', find, replace })
const localFile = (find: string, replace: string) => ({ file: 'local-source.ts', find, replace })
const sourceFile = (find: string, replace: string) => ({ file: 'source.ts', find, replace })
const chromeFile = (find: string, replace: string) => ({ file: 'chrome.ts', find, replace })
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
const survivorsFile = (find: string, replace: string) => ({ file: 'survivors.ts', find, replace })
const siteFile = (find: string, replace: string) => ({ file: 'site.ts', find, replace })
const frontPageFile = (find: string, replace: string) => ({ file: 'front-page.ts', find, replace })
const componentsFile = (find: string, replace: string) => ({ file: 'components.ts', find, replace })
const servedHeadersFile = (find: string, replace: string) => ({
  file: 'served-headers.ts',
  find,
  replace,
})
const controlFile = (find: string, replace: string) => ({
  file: 'what-a-control-says.ts',
  find,
  replace,
})
const searchingFile = (find: string, replace: string) => ({ file: 'searching.ts', find, replace })
const startFile = (find: string, replace: string) => ({ file: 'start.ts', find, replace })
const themeFile = (find: string, replace: string) => ({ file: 'theme.ts', find, replace })
const cardFile = (find: string, replace: string) => ({ file: 'what-a-card-says.ts', find, replace })

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

const THE_STYLE_IS_THE_ONLY_THING_LOADED = `    \`<style>\${THE_SERVED_STYLESHEET}</style>\`,`

const THE_THEME_IS_CARRIED_AND_NOT_FETCHED = `    \`<script>\${THE_THEME_SCRIPT}</script>\`,`

const THE_SCRIPT_WRITES_WHAT_THE_SHEET_READS = `document.documentElement.setAttribute('data-theme',t)`

const THE_BUTTON_HANDS_OUT_THE_SYSTEMS_PALETTE = `:root[data-theme='light'] {
  --paper: #fafbfb;`

const THE_MODULES_ARE_STRIPPED_BEFORE_THEY_ARE_SERVED = `  withoutItsArgument(stripTypeScriptTypes(typescript, { mode: 'strip' }))`
const THE_TEMPLATE_IS_RESUMED = `        token = scanner.reScanTemplateToken(false)`
const A_COMMENT_ENDS_WHERE_IT_ENDS = `to: scanner.getTokenEnd()`
const A_REFERENCE_KEEPS_ITS_ARGUMENT = `  return asAContractsReference(blob.bytes.toString('utf8'))`
const A_MODULE_CARRIES_NO_DIRECTIVE = `export const escaped = (character: string): string => {`
const A_COMMENT_THAT_SPANNED_A_LINE_STILL_DOES = `A_LINE_TERMINATOR.test(body)`
const THE_SHEET_IS_STRIPPED_BEFORE_IT_IS_SERVED = `export const THE_SERVED_STYLESHEET = withoutComments(STYLE)`

const NOTHING_ELSE_IS_TAKEN_OUT_WITH_THEM = `  return kept + css.slice(keptFrom)`

// The controls a visitor touches, whose decisions were unreachable until ADR-0157.

const THE_COPY_LABEL_NAMES_THE_COMMAND = `export const theCopyLabelFor = (command: string): string => \`Copy \${command} to the clipboard\``
const A_REFUSED_CLIPBOARD_SAYS_SOMETHING_ELSE = `  whenTheClipboardRefuses: 'press ⌘C',`
const WHAT_FOLLOWS_THE_INVOCATION_IS_DERIVED = `  command.startsWith(THE_INVOCATION) ? command.slice(THE_INVOCATION.length).trim() : null`
const THE_WAY_ALREADY_CHOSEN_IS_A_SPELLING = `export const theWayAlreadyChosen = (way: AWayToRunIt): boolean => way.spelling === THE_INVOCATION`
const A_WAY_THAT_RUNS_CARRIES_NO_REFUSAL = `export const theRefusalShownFor = (way: AWayToRunIt): string | null => way.refusedBecause ?? null`
const A_REFUSED_WAY_SHOWS_WHAT_WORKS = `  theRefusalShownFor(way) === null ? way.spelling : THE_INVOCATION`
const A_QUERY_NOTHING_ANSWERS_STILL_SAYS_SOMETHING = `    return {
      kind: 'no-answer',
      said: [\`Nothing in the catalogue answers "\${found.query}".\`, whyNothingAnswered(found)],
    }`
const A_WORD_LIST_IS_SHOWN_ONLY_WHERE_THERE_IS_ONE = `  found.unknownWords.length === 0
    ? NO_CONTRACT_CARRIES_THEM_ALL
    : \`No contract mentions: \${found.unknownWords.join(', ')}\``
const A_RESULT_LINKS_UNDER_THE_ROOT = `    href: \`\${root}\${rendered}/\`,`
const AN_ANSWER_IS_COMPARED_AGAINST_THE_TRIMMED_FIELD = `export const theAnswerIsStale = (typed: string, asked: string): boolean => typed.trim() !== asked`

const A_FAILED_CATALOGUE_IS_NOT_KEPT = `        .catch((thrown: unknown) => {
          arriving = null
          throw thrown
        })`
const BOTH_ANSWERS_ARE_KEPT_ONCE_THEY_ARRIVE = `    if (arriving === null) {`
const A_HOST_THAT_ANSWERED_SOMETHING_ELSE_IS_REFUSED = `  if (answer.status !== 200) {`
const A_DIAGNOSTIC_IS_CALLED_ONLY_WHERE_THE_ANSWER_IS_NULL = `  const lines = [\`\${callWritten(call.name, spelled)} → \${answerWritten(call.answered)}\`]

  if (call.answered === null && diagnostic !== null) {
    lines.push(\`\${callWritten(diagnostic.name, spelled)} → \${answerWritten(diagnostic.describes())}\`)
  }`

// The five the battery itself asked for: guards no cell reddened, found by its own accounting.

const THE_PLAYGROUND_IS_NOT_IMPORTED_AT_THE_TOP = `import type { PlaygroundField } from './playground.js'`
const THE_PLAYGROUND_IS_WAITED_FOR = `  const { theAnswerShown, theFieldLabelFor, theWhatWentWrong, argumentsOf, declaredBy } =
    await import('./playground.js')`

// The wiring itself, reachable since ADR-0165 exported the four builders. Every one of these was seen
// to redden a named guard before it was written down here.
const THE_REFUSAL_SITS_BESIDE_THE_COMMAND = `  install.after(refusal)`
const EVERY_WAY_THE_PAGE_DECLARED_IS_OFFERED = `  const buttons = ways.map((way) => {`
const THE_SEARCH_NEEDS_A_SLOT_THAT_DECLARED_ONE = `  if (!(slot instanceof HTMLElement) || declared === undefined) return null`
/**
 * The one refusal `copyControl` still makes.
 *
 * It used to read `install === null || !navigator.clipboard`, and the block half of that condition is
 * gone rather than moved: the control walks every install block on the page, so a page holding none
 * walks nothing and the defect W-127 was written for stopped being expressible. What remains is the
 * clipboard, and W-127 is aimed at it. ADR-0182.
 */
const THE_COPY_CONTROL_NEEDS_A_CLIPBOARD = `  if (!navigator.clipboard) return`
const THE_COMMAND_IS_READ_WHEN_THE_BUTTON_IS_PRESSED = `  button.addEventListener('click', () => {
    void navigator.clipboard.writeText(theCommandSpelled(install)).then(`
const THE_COPY_CONTROL_IS_RELABELLED = `      const copy = install.querySelector('.copy')
      if (copy !== null) {`
const A_REFUSAL_IS_SHOWN_WHEN_THERE_IS_ONE = `      refusal.hidden = refused === null`
const A_CLIPBOARD_THAT_REFUSES_IS_SAID_SO = `        button.textContent = THE_COPY_CONTROL_SAYS.whenTheClipboardRefuses`
const TYPING_ASKS_THE_CATALOGUE = `  field.addEventListener('input', () => void run())
  /**
   * The examples are offered when the field is engaged rather than when the page loads.`
const A_FOCUS_FROM_INSIDE_THE_SLOT_IS_NOT_A_READER_ARRIVING = `    if (from instanceof Node && slot.contains(from)) return`
const LEAVING_THE_SLOT_CLOSES_THE_PANEL = `    if (!(moved instanceof Node) || !slot.contains(moved)) paint(THE_PANEL_IS_CLOSED)`
const ESCAPE_MOVES_THE_FOCUS_BEFORE_IT_CLOSES = `    field.focus()
    paint(THE_PANEL_IS_CLOSED)`
const WHAT_THE_FORM_PRINTS_IS_WHAT_THE_CALL_THREW = `export const theWhatWentWrong = (thrown: unknown): string =>
  thrown instanceof Error ? thrown.message : String(thrown)`
const A_READER_WHO_HAS_NOT_TYPED_MEETS_THE_EXAMPLES = `    return { kind: 'an-invitation', said: THE_INVITATION, examples: where.examples }`
const A_FAILURE_SPEAKS_IN_ITS_OWN_WORDS = `      said:
        did.thrown instanceof Error ? did.thrown.message : THE_CATALOGUE_COULD_NOT_BE_READ,`

const A_STRING_IS_NOT_READ_FOR_COMMENTS = `    if (character === '"' || character === "'") {
      at = pastTheString(css, at)
      continue
    }`

const THE_DARK_PALETTE = `  --paper: #0b0d0e; --wash: #101314; --card: #171b1d; --rule: #1f2426; --edge: #2d3336;`

const THE_SHELL_HAS_NO_CEILING = `.shell { display: grid; grid-template-columns: minmax(0, 1fr); width: 100% }`

const THE_THREE_COLUMNS_ARE_DECLARED_LENGTHS = `  .shell:has(.rail) { grid-template-columns: var(--rail) minmax(0, 1fr) var(--aside) }`

const THE_INVISIBLE_IS_MADE_VISIBLE = `  \`'\${value.replaceAll('\\\\', '\\\\\\\\').replaceAll("'", "\\\\'").replace(INVISIBLE, escaped)}'\``

const THE_ORDINARY_SPACE_IS_KEPT = `const INVISIBLE = /[\\p{Cc}\\p{Cf}\\p{Cs}\\p{M}\\p{Zl}\\p{Zp}]|[^\\P{Zs} ]/gu`

const NEGATIVE_ZERO_KEEPS_ITS_SIGN = `  'negative-zero': '-0',`

/**
 * What a page prints where the switch cannot write a spelling.
 *
 * The second and third are read from `WITHOUT_A_SPELLING` rather than written into the switch,
 * because `read-literal.ts` has to refuse exactly those and what one file prints and the other turns
 * down is one statement. **A hole is not one of them and has not been since ADR-0160** - it spells as
 * nothing at all, which is the language's own notation, and the reader builds a real one. This comment
 * called the pair below *the two words with no JavaScript spelling* while one of the two had a
 * spelling and the arms that did not had grown to three. ADR-0164.
 */
const A_HOLE_SPELLS_AS_NOTHING = `    case 'hole':
      return ''`

const A_FUNCTION_IS_NAMED = `      return WITHOUT_A_SPELLING['not-data']`

const AN_INSTANCE_SHOWS_WHAT_IT_HOLDS = `          : \`, holding \${record(value.fields, value.symbolFields)}\``

const THE_SAME_OBJECT_IS_LABELLED = `const shared = (label: number | undefined, rendered: string): string =>
  label === undefined ? rendered : \`#\${label} = \${rendered}\``

const A_KEY_IS_QUOTED_WHEN_IT_MUST_BE = `const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/`

const A_SYMBOL_KEEPS_ITS_DESCRIPTION = `        value.description === null ? 'Symbol()' : \`Symbol(\${quoted(value.description)})\`,`

const THE_ANCHOR_IS_THE_CASE_IDENTIFIER = `    { id: entry.id, class: 'case' },`

const THE_GROUPS_RENDER_IN_THEIR_DECLARED_ORDER = `  ...table.groups.flatMap((group) =>
    renderedGroup(group, table, answer, fields, corrections, alone ? 'h3' : 'h4'),
  ),`

const A_HEADING_CARRIES_ITS_OWN_ADDRESS = `  addressed(heading, group.id, group.title),`

const ONE_ANSWER_IS_WRITTEN_BARE = `    answered.length === 1`

const THE_COST_IS_WHAT_LANDS = `  bytes: held.implementation.files.reduce((total, file) => total + file.bytes, 0),`

const THE_DESCRIPTION_IS_NOT_THE_SUMMARY = `      \`\${cases} named edge cases, settled and frozen. TypeScript source copied into your project: \` +`

const A_SNAPSHOT_IS_CHECKED = `  const faults = servedSnapshotFaults(answer)`

const ONLY_AN_INSTALLABLE_CONTRACT_HAS_A_PAGE = `    .entries.filter((entry) => entry.installable)`

const A_REFUSED_CONTRACT_IS_OFFERED_NOTHING = `                text(' — turned down'),`

/**
 * The generator's own restatement of the version the registry published. `cli-install.battery.ts`
 * carries the argument for why the edit below is no longer `'1.0.0'`: that string is now the truth.
 */
const THE_VERSION_IS_A_RESTATEMENT = `export const THE_PUBLISHED_VERSION = '1.0.0'`

const A_REFUSED_CONTRACT_IS_REFUSED = `    if (record.lifecycle.state === 'never-published') {`

const THE_INDEX_ENDPOINT = `  contractIndex: 'contract-index',`

/**
 * The empty map itself, because nothing is deferred any more.
 *
 * These two anchors quoted the one entry `NOT_THIS_UNIT` used to carry, and ADR-0137 lifted it - so a
 * mutant that *perturbs* a deferral has nothing to perturb. Both now **add** one, which is the same
 * claim reached from the other side and the only side that is left: a key naming no need, and a
 * deferral with no event behind it. What that keeps is the two guards being reachable at all, where a
 * sweep over an empty map passes by having nothing to look at.
 */
const NOTHING_IS_DEFERRED = `export const NOT_THIS_UNIT: Readonly<Record<string, DeferredNeed>> = {}`

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
const A_CONTRACT_NAME_IS_A_TITLE = `    line('p', says.summary, { class: 'why' }),`

const A_SILENCE_IS_PARSED_LIKE_EVERY_OTHER_SENTENCE = `paragraph(silence.reason)`

const A_PAGE_IS_WRITTEN_AT_THE_FILE_IT_IS =
  '    ...[...pages].map(([path, page]) => [path, toHtml(page)] as const),'

const THE_SIGNATURE_SECTION = `    line('h2', 'What a signature does not prove'),`

const NOTHING_ELSE_OF_THE_INSTRUMENT_IS_REACHED = `import {
  CATALOGUE_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
  WHAT_A_CONTRACT_IS_PAGE,
  domainPageOf,
  linkTo,
  pageOf,
  rootFrom,
} from './paths.js'`

const THE_KINDS_ARE_EXPLAINED_IN_THE_INSTRUMENTS_WORDS = `    paragraph(WHAT_A_SURVIVOR_MEANS_TO_A_READER[why]),`

const EVERYTHING_IS_READABLE = `  ['User-agent: *', 'Allow: /', '', \`Sitemap: \${THE_ORIGIN}/\${SITEMAP}\`, ''].join('\\n')`

const THE_SITEMAP_IS_THE_PAGES = `  return theCrawlerFiles(listed, root ?? { path: FRONT_PAGE, title: '', description: '' })`

const A_LINK_IS_THE_FOLDER_AND_NOT_THE_FILE = `export const linkTo = (page: string): string => page.replace(/index\\.html$/, '')`

const A_URL_LINE_CARRIES_NO_DATE = `    ...pages.map((page) => \`  <url><loc>\${escaped(urlOf(page))}</loc></url>\`),`

const XML_IS_ESCAPED = `    .replaceAll('&', '&amp;')`

const THE_SITEMAP_IS_WHERE_A_CRAWLER_LOOKS = `export const SITEMAP = 'sitemap.xml'`

const A_PAGE_IS_ADDRESSED_BY_ITS_CONTRACT = `export const pageOf = (address: ContractAddress): string => \`\${renderContract(address)}/index.html\``

const A_USE_CASE_CARRIES_ITS_WARNING = `    paragraph(entry.caveat, { class: 'why' }),`

const A_USE_CASE_SHOWS_WHAT_CAME_BACK = `  const result = answered.map((field) => literal(field.value)).join(', ')`

const WHAT_THE_CONTRACT_SAYS_IS_ON_ITS_OWN = `        marked('h3', 'What it is for, and what it is not', { id: 'what-it-is-for' }),`

const A_NUMBER_IS_READ_AS_ITSELF = `  if (number !== null) return Number(number)`

const A_WORD_WITH_NO_SPELLING_IS_REFUSED = `  for (const word of Object.values(WITHOUT_A_SPELLING)) {`

const A_CODE_POINT_ABOVE_THE_PLANE_IS_BRACED = `  return code > 0xffff`

const A_DATE_IS_CONSTRUCTED = `    build: (value) => new Date(value as string),`

const AN_ANSWER_IS_WRITTEN_AS_A_LITERAL = `const asALiteral = (value: unknown, path: string): string => literal(encode(value, path))`

const AN_UNKNOWN_TYPE_STOPS_THE_BUILD = `const theArgumentFor = (parameter: ParameterRecord, what: string): Argument => {
  const known = AS_AN_ARGUMENT[parameter.type]
  if (known === undefined) {`

const A_FIELD_SPELLS_ITS_DECLARED_TYPE = `      spelledBy: (declared) => typeof declared === 'object' && declared !== null && !Array.isArray(declared),`

const A_CALL_IS_WRITTEN_AS_A_LITERAL = `export const callWritten = (name: string, given: readonly unknown[]): string =>
  \`\${name}(\${encodeTogether(given, 'the arguments').map(literal).join(', ')})\``

const A_TEXT_FIELD_LOSES_A_LINE_BREAK = `const STRIPPED_BY_A_TEXT_FIELD = /[\\r\\n]/`

const A_TEXT_FIELD_HANDS_OVER_WHAT_WAS_TYPED = `    if (known.readAs.kind === 'the-text-itself') return known.readAs.declares(text)`

const WHAT_RUNS_IN_YOUR_BROWSER_IS_SAID = `      line('p', whatRunsInYourBrowser(contract.address.name), { class: 'meta' }),`

const THE_GRAPH_LISTS_EVERY_MODULE = `  'packages/site/literal.ts',
`

const A_CODE_POINT_IS_HEXADECIMAL = `  const code = Number.parseInt(digits, 16)`

const A_FIELD_SET_TO_UNDEFINED_IS_STILL_A_FIELD = `    const value = readValue(scan)
    Object.defineProperty(record, key, {`

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
    [literalFile(A_HOLE_SPELLS_AS_NOTHING, `    case 'hole':
      return 'undefined'`)],
    killed(['a-hole-and-an-undefined-are-two-spellings']),
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
      cardFile(
        THE_COST_IS_WHAT_LANDS,
        `  bytes: held.contract.harness.reduce((total, file) => total + file.bytes, 0),`,
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
        `                text(\` — \${THE_INVOCATION} add \${one.refusal.address.name}\`),`,
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

  /**
   * The registry's own prose put back beside the contract's, which is where it was until ADR-0151.
   *
   * **It is the plausible edit and not an attack**: somebody with a re-examination to render reaches
   * for the section that already answers *what does this function do*, and the page that comes out is
   * not broken - it reads well, every sentence on it is true, and the block simply arrives before the
   * one nobody skips. What is lost is that a reader can no longer tell which half of that heading is
   * frozen for the life of the major and which half the registry may rewrite tomorrow.
   *
   * **`a-re-examination-reaches-the-reader` is green under it**, and that is the reason this cell is
   * worth its line: the three statements still arrive on the page, twice over. A guard about arrival
   * cannot see a defect about company.
   */
  sameOnEveryLens(
    'W-95',
    'renders the re-examination beside the frozen description again, so one heading carries a ' +
      'sentence a reader may rely on for the life of the major and one the registry may rewrite, ' +
      'with nothing on the page telling them apart',
    [
      contractPageFile(
        WHAT_THE_CONTRACT_SAYS_IS_ON_ITS_OWN,
        `        ...reExaminations.flatMap((entry) => [
          paragraph(entry.whatMoved),
          paragraph(entry.measurement),
          paragraph(entry.whatItEstablishes),
        ]),
${WHAT_THE_CONTRACT_SAYS_IS_ON_ITS_OWN}`,
      ),
    ],
    killed(['what-is-frozen-and-what-the-registry-may-rewrite-are-never-one-section']),
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
      'every-contract-the-index-lists-has-a-page-at-its-own-address',
      'nothing-offers-an-install-command-for-a-contract-that-cannot-be-installed',
    ]),
  ),

  sameOnEveryLens(
    'W-20',
    'builds a page for every contract the index holds, including the refused one, which has no ' +
      'binding and therefore no frozen definition to render',
    [catalogueFile(ONLY_AN_INSTALLABLE_CONTRACT_HAS_A_PAGE, `    .entries.filter(() => true)`)],
    killed(['every-contract-the-index-lists-has-a-page-at-its-own-address']),
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
    'defers a need this site does not have, so the map stops being a statement about what was ' +
      'decided and becomes a place anything may be written - the same defect as a page somebody ' +
      'forgot, arriving from the side that is left now that nothing is deferred',
    [
      sourceFile(
        NOTHING_IS_DEFERRED,
        `export const NOT_THIS_UNIT: Readonly<Record<string, DeferredNeed>> = {\n` +
          `  'no-such-need': { because: 'a scope decision', until: 'somebody asks' },\n}`,
      ),
    ],
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
    killed(['a-page-fetches-nothing-but-the-face-this-repository-serves']),
  ),

  /**
   * The other half of the claim W-24 is about, and the reason the guard it kills is a second guard.
   *
   * A page's behaviour is in the page. Fetching the theme instead of carrying it puts the way round
   * a reader sees the site behind a request that can fail, on a host that can change what it
   * answers - and it does it to the one script this site runs before anything is painted, so the
   * failure a reader meets is the page arriving in the wrong theme and turning. ADR-0176.
   */
  sameOnEveryLens(
    'W-137',
    'fetches the theme script instead of carrying it, which puts the way round a reader sees the ' +
      'page behind a request, before the first paint, on a host this project would then depend on',
    [documentFile(THE_THEME_IS_CARRIED_AND_NOT_FETCHED, `    '<script src="/theme.js"></script>',`)],
    killed(['nothing-a-page-runs-was-fetched-to-run-it']),
  ),

  /**
   * **The plausible defect here is a rename and not a mistake**, which is what makes it worth a cell.
   *
   * The script is written out as text because a script element must never be assembled, and the price
   * of that is a key and an attribute spelled twice in files that do not import each other. Somebody
   * tidying one spelling leaves the other, and what a reader gets is a button that stores a
   * preference no palette answers to: no error, no console, nothing on the page - the button simply
   * does nothing, on every page, for as long as nobody notices. ADR-0176.
   */
  sameOnEveryLens(
    'W-138',
    'has the head script write an attribute the stylesheet does not select on, so the button stores ' +
      'a preference nothing reads and a reader who presses it sees the page not change',
    [
      themeFile(
        THE_SCRIPT_WRITES_WHAT_THE_SHEET_READS,
        `document.documentElement.setAttribute('data-scheme',t)`,
      ),
    ],
    killed(['the-script-that-sets-the-theme-agrees-with-the-stylesheet-that-reads-it']),
  ),

  /**
   * The defect the duplication exists to make possible, which is why the duplication is guarded.
   *
   * ADR-0176 refused `light-dark()` on a browser floor and accepted writing the light palette twice.
   * This is what that costs if nothing compares them: one value edited in one copy, and a reader who
   * pressed the button gets a page a shade away from the one their own system would have painted.
   * Both pages are legible, both palettes are roles, and no other guard here has an opinion.
   */
  sameOnEveryLens(
    'W-139',
    'edits one value of the light palette in the copy the button reaches and not in the copy the ' +
      'system reaches, so which of the two a reader arrives by decides what they see',
    [
      styleFile(
        THE_BUTTON_HANDS_OUT_THE_SYSTEMS_PALETTE,
        `:root[data-theme='light'] {
  --paper: #fafbfc;`,
      ),
    ],
    killed([
      'the-palette-a-reader-gets-from-the-button-is-the-palette-their-system-would-have-given-them',
    ]),
  ),

  /**
   * **The two cells below exist so that two guards are red alone, and nothing else about them is
   * new.** W-24 and W-137 already redden them - by removing the style element and by replacing the
   * script line - and both of those take neighbours with them, so the run could say only that each
   * guard *would* catch its defect if the guard beside it went away. `attribution.ts` keeps a bucket
   * for exactly that and this repository holds an open entry about it. These are narrow enough to
   * land on one guard apiece, and they are the two guards this unit is about.
   *
   * A second thing fetched by the sheet is also the plausible edit: a background, a texture, an icon.
   * The guard's `url(` arm is an equality since ADR-0176 precisely so that the *second* one reddens
   * rather than only the class of them, and this is what says that equality does its work.
   */
  sameOnEveryLens(
    'W-140',
    'paints the body with an image, which is a second thing every page goes and fetches - and the ' +
      'one this site has never had, so nothing about the page looks wrong while it loads',
    [
      styleFile(
        `* { box-sizing: border-box }`,
        `* { box-sizing: border-box }\nbody { background-image: url(/paper.png) }`,
      ),
    ],
    killed(['a-page-fetches-nothing-but-the-face-this-repository-serves']),
  ),

  /**
   * The theme kept where it is and a second script fetched beside it, so that what reddens is the
   * fetching and not the theme going missing.
   *
   * It is the plausible shape of the defect too: nobody replaces the theme script with a request,
   * they add an analytics tag or a widget under it. The page still works, the theme still arrives
   * before the paint, and what a reader has gained is a third party who can change what this site
   * does after it is served.
   */
  sameOnEveryLens(
    'W-141',
    'adds a fetched script beside the theme, so the page goes on working and a host this project ' +
      'does not control decides what else runs on it',
    [
      documentFile(
        THE_THEME_IS_CARRIED_AND_NOT_FETCHED,
        `    \`<script>\${THE_THEME_SCRIPT}</script>\`,\n    '<script src="/measure.js"></script>',`,
      ),
    ],
    killed(['nothing-a-page-runs-was-fetched-to-run-it']),
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
      'a taste somebody has, where an ink that moves is a decision. **What it produces has changed ' +
      'twice and it is measured each time rather than assumed.** At ADR-0176 `dim` was declared below ' +
      'the floor, so this edit reached both of the guard\'s directions at once: it carried `body` ' +
      'under and moved every declared `dim` reading off the figure beside it. ADR-0178 raised `dim` ' +
      'to the floor and took those eight rows out, so it reaches one direction now - measured, the ' +
      'injected palette puts `body on paper` at 3.94:1 and `dim on paper` at 2.75:1, and both are ' +
      'pairs the declaration does not name. The reach is narrower and the cell is not weaker: the ' +
      'dark half clears everywhere unperturbed, so those two readings exist only because of the edit. ' +
      'Nothing on the rendered page looks wrong: the text is there, the colours are roles, and the ' +
      'contrast is a number nobody reads off a screen',
    [
      styleFile(
        THE_DARK_PALETTE,
        '  --paper: #3a4245; --wash: #101314; --card: #171b1d; --rule: #1f2426; --edge: #2d3336;',
      ),
    ],
    killed(['every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible']),
  ),

  /**
   * **The most plausible edit anybody makes after ADR-0134**, which is why this cell reads better now
   * than it did when it was written. It used to retype a ceiling the shell already had; the shell has
   * none, so it puts one back - and `78rem` is the exact number ADR-0122 took out, arriving a third
   * time on the same element.
   *
   * The guard's population is every `max-width` this stylesheet declares. **This paragraph read
   * *since ADR-0134 all of them are `100%`* and the sweep contradicts it**: measured at `018a2da`,
   * the six are `100%` four times, `var(--aside)` and `var(--measure)` once each. It was true when
   * ADR-0134 landed and two ceilings have arrived since, which is a sentence going stale rather than
   * one written wrong - and nothing said so, because a cell's prose is read by nobody.
   *
   * What it was reaching for survives the correction and is the half worth keeping: **every one of
   * the six is derived**, `100%` being the containing block and the other two names this stylesheet
   * declares. So no box on this site carries a ceiling nobody argued for, and any length typed
   * anywhere reddens the guard.
   */
  sameOnEveryLens(
    'W-85',
    'gives the shell back the round ceiling ADR-0122 took off it, which is the edit that put the ' +
      'content of a contract page on 38.7% of a 2 560px screen and every page with no rail on 17.5% ' +
      'of one. Nothing on the rendered page looks wrong: the pages are there, every line is where it ' +
      'was on this machine, and a width nobody derived reads exactly like a width somebody chose',
    [
      styleFile(
        THE_SHELL_HAS_NO_CEILING,
        '.shell { display: grid; grid-template-columns: minmax(0, 1fr); width: 100%; max-width: 78rem; margin: 0 auto }',
      ),
    ],
    killed(['every-ceiling-on-a-box-is-derived-and-never-typed']),
  ),

  /**
   * W-85 one door along. That cell gives the shell a ceiling it no longer has; this one types the
   * tracks under it, which is where the layout moved when it stopped being one column and became
   * three - and the guard W-85 belongs to says in its own comment that it reads `max-width` and
   * nothing else.
   *
   * The two lengths it writes are the ones this stylesheet derives, to the pixel on the machine the
   * arithmetic was taken on. That is what makes it the plausible edit rather than a vandalism: the
   * pages render identically here and stop being derived everywhere else.
   */
  sameOnEveryLens(
    'W-86',
    'types the two columns beside the content instead of deriving them, on the arrangement that ' +
      'carries a table of contents. Nothing on the rendered page looks wrong on the machine the ' +
      'numbers were read on - the three columns are there and the content column between them is ' +
      'exactly as wide as it was - and on any face whose zero is a different width the rail and the ' +
      'column beside it stop being what they were derived from',
    [
      styleFile(
        THE_THREE_COLUMNS_ARE_DECLARED_LENGTHS,
        '  .shell:has(.rail) { grid-template-columns: 240px minmax(0, 1fr) 268px }',
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
    'W-121',
    'prints an instance as its class alone, so the two rows where `object/deep-equal@1` settles that ' +
      'an instance is not a plain object carrying the same fields publish the class and hide the ' +
      'fields the rows turn on',
    [literalFile(AN_INSTANCE_SHOWS_WHAT_IT_HOLDS, `          : ''`)],
    killed(['an-instance-shows-the-class-it-is-of-and-what-it-holds']),
  ),

  // -------------------------------------------------------------------------
  // W-122 to W-133 - the wiring, which nothing could reach until ADR-0165
  // -------------------------------------------------------------------------
  //
  // The twenty-fifth arrival at `mutation/census.ts` recorded that no cell here injected into
  // `start.ts` and that nothing had refused one: the file exported no name, so a mutant in it had
  // nothing able to kill it. These are the cells that column was empty of.
  //
  // Every one of the twelve was applied to the working tree and run before it was written down, and
  // every one named a guard. **Four were applied and left the suite green, which is the half worth
  // recording**: three were holes in the guards and were repaired - a slot that declares nothing is a
  // different page from a page with no slot, a refusal read by `textContent` is one nobody is shown,
  // and Escape on a panel of answers reopens where Escape on an invitation does not - and the fourth
  // is a clause the compiler holds rather than a defect a run can see. ADR-0165 carries all four.
  //
  // What separates these from W-102 to W-121 is what a defect reaches. Those are decisions: a wrong
  // word, a wrong label, a wrong spelling. These are delivery: the right word, arriving at the wrong
  // element, at the wrong moment, or not at all.

  /**
   * **The defect the copy control's own header was written against.** `textContent` on the install
   * block is the command plus every control appended to it, so the command is read from its text node
   * instead - and reading it *once*, when the button is built, stopped being safe the day the command
   * became something a reader can change. A reader who chooses Bun and then copies is handed `npx`,
   * and every word on the page is the word they asked for.
   */
  sameOnEveryLens(
    'W-122',
    'reads the command when the copy control is built rather than when it is pressed, so a reader ' +
      'who chooses another package manager and then copies is handed the spelling they moved away ' +
      'from - on a page showing them the one they chose',
    [
      startFile(
        THE_COMMAND_IS_READ_WHEN_THE_BUTTON_IS_PRESSED,
        `  const captured = theCommandSpelled(install)
  button.addEventListener('click', () => {
    void navigator.clipboard.writeText(captured).then(`,
      ),
    ],
    killed(['the-command-copied-is-the-one-the-block-spells-at-the-moment-it-is-pressed']),
  ),

  /**
   * **The order this unit repaired, put back.** Closing before moving the focus detaches the example
   * that holds it, so the focus event that follows arrives from a node no longer in the slot, reads as
   * a reader engaging the field, and paints the panel straight back.
   */
  sameOnEveryLens(
    'W-123',
    'closes the search panel before it moves the focus, so Escape pressed on an example paints the ' +
      'panel straight back - the dismissal a keyboard has, doing nothing, on a page where every ' +
      'other way out still works',
    [
      startFile(
        ESCAPE_MOVES_THE_FOCUS_BEFORE_IT_CLOSES,
        `    paint(THE_PANEL_IS_CLOSED)
    field.focus()`,
      ),
    ],
    killed([
      'escape-closes-the-panel-and-brings-the-reader-back-to-the-field',
      'escape-closes-a-panel-of-answers-and-it-stays-closed',
    ]),
  ),

  /**
   * The same defect one floor down, and it is the cell that makes the focus condition load-bearing:
   * with the ordering kept and this inverted, a panel of *answers* reopens after the close because the
   * re-run is awaited, while the invitation is repainted synchronously and the close still wins.
   */
  sameOnEveryLens(
    'W-124',
    'treats a focus arriving from inside the search panel as a reader engaging the field, so ' +
      'dismissing a panel of answers runs the query again and puts them back a tick later',
    [
      startFile(
        A_FOCUS_FROM_INSIDE_THE_SLOT_IS_NOT_A_READER_ARRIVING,
        `    if (from instanceof Node && !slot.contains(from)) return`,
      ),
    ],
    killed(['escape-closes-a-panel-of-answers-and-it-stays-closed']),
  ),

  /**
   * **A refusal composed and never revealed.** `yarn dlx toopo` does not run - measured against npm's
   * own artefact - and the paragraph saying so is built, filled and left hidden. The reader chooses
   * Yarn, is shown a command, and finds out from Yarn.
   */
  sameOnEveryLens(
    'W-125',
    'keeps the refusal hidden whichever way is chosen, so the one package manager measured not to ' +
      'work offers its command with nothing beside it',
    [startFile(A_REFUSAL_IS_SHOWN_WHEN_THERE_IS_ONE, `      refusal.hidden = true`)],
    killed(['a-way-that-was-measured-to-fail-says-so-and-one-that-runs-says-nothing']),
  ),

  sameOnEveryLens(
    'W-126',
    'builds the search on a slot that declared no catalogue, so a page serving the masthead and ' +
      'nothing else gets a field that throws on the first keystroke',
    [
      startFile(
        THE_SEARCH_NEEDS_A_SLOT_THAT_DECLARED_ONE,
        `  if (!(slot instanceof HTMLElement)) return null`,
      ),
    ],
    killed(['a-slot-that-declares-nothing-is-left-alone']),
  ),

  sameOnEveryLens(
    'W-127',
    'builds a copy control where the browser offers no clipboard, so a reader is given a button that ' +
      'throws on the one thing it is for',
    [startFile(THE_COPY_CONTROL_NEEDS_A_CLIPBOARD, `  if (false) return`)],
    killed(['a-clipboard-that-refuses-is-said-so-and-one-that-is-not-there-builds-no-control']),
  ),

  /**
   * The page declares which ways there are; a control that decides for itself is a control that goes
   * on offering four after the catalogue has been changed to serve three, and every rendering of it
   * looks correct.
   */
  sameOnEveryLens(
    'W-128',
    'offers the first way the page declared and drops the rest, so a reader with Bun or pnpm is left ' +
      'with the one spelling that needs Node',
    [
      startFile(
        EVERY_WAY_THE_PAGE_DECLARED_IS_OFFERED,
        `  const buttons = ways.slice(0, 1).map((way) => {`,
      ),
    ],
    killed([
      'the-ways-a-control-offers-are-the-ways-the-page-declared',
      'the-command-copied-is-the-one-the-block-spells-at-the-moment-it-is-pressed',
      'choosing-a-way-rewrites-the-command-marks-it-and-relabels-the-copy-control',
      'a-way-that-was-measured-to-fail-says-so-and-one-that-runs-says-nothing',
    ]),
  ),

  /**
   * **The label a sighted reader never sees, one unit on.** W-102 builds it from the wrong string;
   * this one stops rebuilding it when the command changes, so a screen reader is offered the spelling
   * the reader moved away from while the page shows the one they chose.
   */
  sameOnEveryLens(
    'W-129',
    'leaves the copy control labelled for the way chosen before it, so the one reader who depends on ' +
      'that label is told a command the page no longer carries',
    [
      startFile(
        THE_COPY_CONTROL_IS_RELABELLED,
        `      const copy = null
      if (copy !== null) {`,
      ),
    ],
    killed(['choosing-a-way-rewrites-the-command-marks-it-and-relabels-the-copy-control']),
  ),

  sameOnEveryLens(
    'W-130',
    'reports a clipboard that refused as a copy that happened, so a reader who denied the permission ' +
      'walks away with an empty clipboard and a control saying otherwise',
    [
      startFile(
        A_CLIPBOARD_THAT_REFUSES_IS_SAID_SO,
        `        button.textContent = THE_COPY_CONTROL_SAYS.afterCopying`,
      ),
    ],
    killed(['a-clipboard-that-refuses-is-said-so-and-one-that-is-not-there-builds-no-control']),
  ),

  sameOnEveryLens(
    'W-131',
    'wires typing to nothing, so the search field a reader types into answers only when it is ' +
      'focused - a control that works the first time and never again',
    [
      startFile(
        TYPING_ASKS_THE_CATALOGUE,
        `  field.addEventListener('input', () => void 0)
  /**
   * The examples are offered when the field is engaged rather than when the page loads.`,
      ),
    ],
    killed([
      'typing-answers-from-the-catalogue-the-masthead-declared',
      'escape-closes-a-panel-of-answers-and-it-stays-closed',
    ]),
  ),

  sameOnEveryLens(
    'W-132',
    'closes the panel when the focus moves inside it and keeps it when the focus leaves, so reaching ' +
      'for an example with the keyboard dismisses the thing being reached for',
    [
      startFile(
        LEAVING_THE_SLOT_CLOSES_THE_PANEL,
        `    if (!(moved instanceof Node) || slot.contains(moved)) paint(THE_PANEL_IS_CLOSED)`,
      ),
    ],
    killed([
      'leaving-the-slot-closes-the-panel-and-moving-inside-it-does-not',
      'escape-closes-the-panel-and-brings-the-reader-back-to-the-field',
      'escape-closes-a-panel-of-answers-and-it-stays-closed',
    ]),
  ),

  sameOnEveryLens(
    'W-133',
    'builds the refusal and never puts it on the page, so the paragraph that would tell a reader ' +
      'their package manager is broken exists in memory and nowhere else',
    [startFile(THE_REFUSAL_SITS_BESIDE_THE_COMMAND, `  void refusal`)],
    killed([
      'every-control-lands-in-the-slot-the-page-serves-for-it',
      'a-way-that-was-measured-to-fail-says-so-and-one-that-runs-says-nothing',
    ]),
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
    [literalFile(A_SYMBOL_KEEPS_ITS_DESCRIPTION, `        'Symbol()',`)],
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
    renderedGroup(group, table, answer, fields, corrections, alone ? 'h3' : 'h4'),
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
        `const asALiteral = (value: unknown, path: string): string => String(value)`,
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
    Object.defineProperty(record, key, {`,
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
      survivorsFile(
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
    'defers a need with no event behind it, leaving a reason that ages into a description of the ' +
      'past - which is how a scope decision becomes something nobody revisits. It adds the entry ' +
      'rather than emptying one, because ADR-0137 lifted the last deferral this site had',
    [
      sourceFile(
        NOTHING_IS_DEFERRED,
        `export const NOT_THIS_UNIT: Readonly<Record<string, DeferredNeed>> = {\n` +
          `  'search-with-an-alias-thesaurus': { because: 'a box asks for a guess', until: '' },\n}`,
      ),
    ],
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
          `import {
  CATALOGUE_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
  WHAT_A_CONTRACT_IS_PAGE,
  domainPageOf,
  linkTo,
  pageOf,
  rootFrom,
} from './paths.js'`,
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
    [survivorsFile(THE_KINDS_ARE_EXPLAINED_IN_THE_INSTRUMENTS_WORDS, `    paragraph('Some of these are not holes.'),`)],
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
          `    root ?? { path: FRONT_PAGE, title: '', description: '' },\n` +
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
    'takes the separator off the mark beside a turned-down contract. An anchor is phrasing content ' +
      'and carries none of its own, so the front page reads `group-byturned down` - the name of a ' +
      'contract and the one word about it run into each other, on the page that is this site\'s own ' +
      'navigation. Every word is still present, so the projection guard stays green: a person reads ' +
      'two things as one and a guard about presence cannot',
    [
      domainPageFile(
        A_CONTRACT_NAME_IS_A_TITLE,
        `    line('code', says.summary, { class: 'why' }),`,
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
        `line('p', silence.reason)`,
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
      'every-endpoint-carries-a-rule-at-an-address-that-names-it',
      'every-endpoint-tells-the-host-what-its-answers-are',
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
        'cacheControlOf(cachePolicyFor(addressing))',
        "cacheControlOf(cachePolicyFor('content-addressed'))",
      ),
    ],
    killed([
      'only-what-is-addressed-by-its-content-is-cached-for-a-year',
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
   * A space dropped from the derivation, which is the defect the open entry recorded for months.
   *
   * Until ADR-0170 the rules were derived from `ENDPOINTS` alone, so every page, every Markdown twin,
   * every browser module and every file found by convention fell through to whatever the host does
   * that morning - 55 of the 128 addresses the tree writes, of which seventeen answered a four-hour
   * policy written in no file here. This is that state restored for one family, and it is the shape
   * the next one will have: a kind of address arrives, nobody declares its space, and nothing about
   * the file looks wrong.
   */
  sameOnEveryLens(
    'W-134',
    'stops declaring the space the browser modules live in, so every module a page loads is served ' +
      'under whatever policy the host reaches for',
    [servedHeadersFile('    ...THE_BROWSER_GRAPH.map(named),\n', '')],
    killed(['every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose']),
  ),

  /**
   * The cache rule given back to the endpoints, which is this file as it stood one commit ago.
   *
   * **It is the most plausible defect in the whole area and it reads as a correction.** Every endpoint
   * rule carrying both headers is symmetrical, agrees with the space rule on every value, and would be
   * approved by anybody reading the file - and Cloudflare joins two matching rules' headers with a
   * comma rather than choosing between them, so a contract's binding would be served a `Cache-Control`
   * carrying `max-age` twice.
   *
   * Nothing that reads the *rules* can see it: the values agree, so the two guards about which policy
   * goes where stay green. What sees it is the guard that asks what an *address* is told.
   */
  sameOnEveryLens(
    'W-135',
    'gives every endpoint its cache rule back beside its type, so an address matched by both families ' +
      'is served one header twice and no guard over the rules disagrees',
    [
      servedHeadersFile(
        "    headers: [['Content-Type', contentTypeOf(endpoint)]] as const,",
        '    headers: [\n' +
          "      ['Content-Type', contentTypeOf(endpoint)],\n" +
          "      ['Cache-Control', cacheControlOf(cachePolicyFor(endpoint.addressing))],\n" +
          '    ] as const,',
      ),
    ],
    killed(['every-address-is-told-each-thing-once']),
  ),

  /**
   * The root typed back into the contract list of a domain page, which is this file as it stood
   * before the unit that purged the tree.
   *
   * **It is the rarest shape this battery carries: a defect that changes no byte of the emitted
   * site.** `rootFrom` counts the segments of the page it is handed, a domain page has three, and
   * `'../'.repeat(2)` is the string this replaces it with - so every page renders identically, the
   * walk over the page graph resolves every link, and the fourteen files of HTML are the same to the
   * byte. Nothing that reads a rendering can disagree with it, because there is nothing to disagree
   * with until a domain page changes depth.
   *
   * Its sister four declarations below composes its root and always did. What made the difference
   * visible was neither a reading nor a rendering but an unused parameter: `entry` took `own` and
   * never read it, and `noUnusedParameters` is what asked why.
   */
  sameOnEveryLens(
    'W-136',
    'types the root of a domain page back into its contract list, so one of two sibling link builders ' +
      'stops following the page it is rendered onto and every rendered byte stays identical',
    [
      domainPageFile(
        '{ href: `${rootFrom(own)}${linkTo(pageOf(held.contract.address))}` },',
        '{ href: `../../${linkTo(pageOf(held.contract.address))}` },',
      ),
    ],
    killed(['every-address-a-page-links-to-is-composed-and-never-typed']),
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

  /**
   * **This cell exists because the battery asked for it and a reader had not.** The guard it reddens
   * was written with ADR-0137 and seen red by hand on this very edit; nothing in this file reddened
   * it, so the run refused itself - *nothing reddens it, and the battery does not say why*. Seeing a
   * guard red once is a reader's observation, and a cell is what makes it a measurement taken on
   * every replay.
   *
   * The query is one this catalogue genuinely cannot answer, and that is what makes the mutant the
   * defect rather than a broken string: `tolerance` appears in no name, export or alias, so the
   * example offered before a reader has typed anything would find nothing.
   */
  sameOnEveryLens(
    'W-88',
    'offers a query the catalogue cannot answer as the invitation to search, so the first thing a ' +
      'reader is shown they might try is the thing that disproves the claim it was put there to make',
    [chromeFile(`  'add days to a date',`, `  'typo tolerance',`)],
    killed(['every-example-the-masthead-offers-is-answered-by-the-catalogue']),
  ),

  /**
   * The state the card was actually in, injected back.
   *
   * The command and the signature were two `pre`s of the same size in matching frames, and the owner
   * could not tell which of them to run on a page he had just been shown. Taking the label off the
   * command is the smallest edit that returns the page to that, and it is the edit somebody makes
   * while tidying markup they think is decorative.
   *
   * **It reddens the structural half and nothing else, which is what the guard claims.** The accent,
   * the ground and the larger face survive this mutant untouched - a stylesheet is not what this cell
   * perturbs - and the guard it kills says so in as many words rather than implying a coverage it
   * does not have.
   */
  sameOnEveryLens(
    'W-89',
    'takes the label off the install command, so the card offers a visitor two monospaced blocks of ' +
      'the same shape and nothing saying which of them is the one to run',
    [
      contractPageFile(
        `el('div', { class: 'get-head' }, eyebrow('field', 'p', 'Install')),`,
        `el('div', { class: 'get-head' }),`,
      ),
    ],
    killed(['the-command-and-the-signature-of-a-card-are-two-labelled-blocks']),
  ),

  /**
   * A fifth way to run it, typed into the page instead of measured.
   *
   * This is the defect a visitor already met, arriving on the surface that multiplies it by four: a
   * command that does not run, printed where somebody is being told to run it. The edit is the
   * plausible one - a manager somebody knows about, added to the page because the other four are
   * there - and it is exactly what the table exists to make impossible.
   *
   * It reddens the half about provenance. The half about the printed command is reddened by the
   * page printing a refused spelling, which `every-command-the-site-tells-a-reader-to-run-carries-
   * the-invocation` also catches - so that edit measures two guards and this one measures one.
   */
  sameOnEveryLens(
    'W-90',
    'hands a reader a fifth way to run this that nobody measured, typed into the page beside the ' +
      'four the registry declares',
    [
      contractPageFile(
        `{ class: 'get', 'data-ways': JSON.stringify(THE_WAYS_TO_RUN_IT) },`,
        `{ class: 'get', 'data-ways': JSON.stringify([...THE_WAYS_TO_RUN_IT, { manager: 'deno', spelling: 'deno run -A npm:toopo' }]) },`,
      ),
    ],
    killed(['the-ways-a-page-hands-over-are-the-declared-ways-and-the-one-it-prints-runs']),
  ),

  /**
   * The page a reader arrives at, given something to run again.
   *
   * **It is the version the owner rejected, put back.** The first door printed the shape of every
   * command at once so that no contract was privileged on the page that stands for all of them; the
   * constraint was right and a reader sees a template. This edit is that decision reversed in the one
   * place it was taken, and it is written as a sentence rather than as a block so that it reddens the
   * half about commands and leaves the half about shape alone - a mutant that broke both would say
   * which of them is load-bearing for neither.
   *
   * `every-command-the-site-tells-a-reader-to-run-carries-the-invocation` has no opinion on it: the
   * spelling carries the invocation and runs, which is exactly the point - the defect is not that the
   * command is broken, it is that a command is here at all.
   */
  sameOnEveryLens(
    'W-91',
    'puts the shape of every command at once back on the page a reader arrives at, where no contract ' +
      'is named and nothing but a template can be printed',
    [
      frontPageFile(
        `  'contract — its signature and behaviour never change.'`,
        `  'contract — its signature and behaviour never change. Start with npx toopo add domain/function.'`,
      ),
    ],
    killed(['the-page-a-reader-arrives-at-is-every-contract-they-can-install']),
  ),

  /**
   * The sift hides a card it was told to show, which is the wiring half of the shelf's property.
   *
   * The decision answers addresses; this is what happens to them. Inverting the test leaves a reader
   * who typed a word looking at every card the query did *not* answer - and the count above them still
   * says how many matched, so the sentence and the shelf disagree with nothing saying so.
   */
  sameOnEveryLens(
    'W-144',
    'hides the cards a query named and shows the rest, so a reader who typed `slugify` is left looking ' +
      'at every function except the one they asked for',
    [
      startFile(
        `        ;(card as HTMLElement).hidden = !wanted.has((card as HTMLElement).dataset['contract'] ?? '')`,
        `        ;(card as HTMLElement).hidden = wanted.has((card as HTMLElement).dataset['contract'] ?? '')`,
      ),
    ],
    killed(['a-query-hides-the-cards-it-does-not-name-and-leaves-the-others-as-served']),
  ),


  /**
   * The shelf narrows to something other than an address, which is the property this unit rests on.
   *
   * A card is served with the page and a query decides which of them a reader is looking at. Answering
   * with anything but an address is how that stops being true: the caller would have something it has
   * to interpret rather than a key it can match, and the card it showed would stop being the card the
   * page served.
   */
  sameOnEveryLens(
    'W-145',
    'narrows the shelf to the summaries of the contracts that answered rather than to their ' +
      'addresses, so the caller matches cards against prose and shows none of them',
    [
      controlFile(
        `    addresses: installable.map((result) => result.address.name),`,
        `    addresses: installable.map((result) => result.summary),`,
      ),
    ],
    killed(['what-a-query-narrows-the-shelf-to-is-addresses-and-never-cards']),
  ),

  /**
   * A refusal counted among what the shelf shows, which makes the sentence above it wrong by one.
   *
   * ADR-0179 keeps a refused contract answerable in a search and off every browsing surface, so the
   * shelf has no card for one. The count is a claim about *this shelf*, so a result it can never show
   * has to leave before it is counted rather than be lost by having no card.
   */
  sameOnEveryLens(
    'W-142',
    'counts a refused contract among what the shelf narrowed to, so a query reaching the refusal is ' +
      'answered `showing 2 of` beside one card',
    [controlFile(`  const installable = found.results.filter((result) => result.installable)`, `  const installable = found.results`)],
    killed(['a-refusal-is-not-among-what-the-shelf-narrows-to']),
  ),

  /**
   * The shelf empties when nobody asked, which is the failure the matching rule exists to avoid
   * arriving in the surface instead of in the rule.
   *
   * An empty field is not a query. A reader who cleared the box and met an empty page would conclude
   * the catalogue was empty, on a page whose whole job is to show them it is not.
   */
  sameOnEveryLens(
    'W-143',
    'treats an empty field as a query that matched nothing, so a reader who clears the box is shown ' +
      'a shelf with no functions on it',
    [
      controlFile(
        `  if (did.kind === 'was-not-asked') return { kind: 'everything' }`,
        `  if (did.kind === 'was-not-asked') return { kind: 'these', addresses: [], said: theyAre(0) }`,
      ),
    ],
    killed(['an-empty-field-and-a-catalogue-that-cannot-be-read-both-keep-the-whole-shelf']),
  ),

  /**
   * The shelf starts choosing, which is the defect the artboard's own heading invited.
   *
   * **It is the arm W-91 does not reach.** That cell puts a command back where none belongs; this one
   * leaves every card correct and shows four of the six. Each card that survives is right, every
   * command runs, nothing refused appears - and a visitor is told the catalogue holds four functions.
   *
   * The artboard headed this list `Popular functions`, and nothing in this repository ranks anything:
   * permanent rule 1 forbids the call that would produce a figure, and no usage signal exists in the
   * tree. So a page that had quietly become a selection would read exactly as intended under that
   * heading, which is why the guard asserts the count against the index rather than asserting that
   * each card is well formed.
   */
  sameOnEveryLens(
    'W-146',
    'shows four of the six installable contracts on the shelf, so every card is right, every command ' +
      'runs, and a reader is told this catalogue holds four functions',
    [frontPageFile(`...held.map(offerFor)`, `...held.slice(0, 4).map(offerFor)`)],
    killed(['the-page-a-reader-arrives-at-is-every-contract-they-can-install']),
  ),

  /**
   * **The defect that shipped**, put back exactly as it was written.
   *
   * `copyControl` read `querySelector`, which is right for every page that had ever carried one
   * install line and wrong the day one carried six: the shelf offered a control on six cards and gave
   * it to one. Nothing was red, because the suite counted guards and never controls against commands -
   * and five cards missing a button read as cards whose design has none.
   *
   * It is the argument for a guard that compares two populations rather than asserting a number: the
   * page grows a card with every contract published, and a count would have to be edited each time by
   * whoever is least likely to notice it has become wrong. ADR-0182.
   */
  sameOnEveryLens(
    'W-147',
    'builds the copy control for the first command on the page and none of the others, so a shelf of ' +
      'six cards offers six and delivers one',
    [
      startFile(
        `  for (const install of document.querySelectorAll('pre.install')) copyControlOn(install)`,
        `  const only = document.querySelector('pre.install')
  if (only !== null) copyControlOn(only)`,
      ),
    ],
    killed(['every-command-a-page-shows-carries-its-own-copy-control']),
  ),

  /**
   * **Two cells over the shortcut, and each reddens what the other does not.**
   *
   * The badge beside the search field is drawn because the chord exists, so the two halves fail
   * differently: the predicate can take a press it has no business taking, and the badge can name a key
   * the reader's own keyboard does not have. The first is a control doing more than it says, the second
   * is a control saying more than it does.
   *
   * The letter arm is what makes the first one worth writing: a listener keyed on `k` alone takes every
   * `k` a reader types anywhere on the page, and the page goes on looking exactly right to whoever is
   * not typing. ADR-0182.
   */
  sameOnEveryLens(
    'W-148',
    'lets the bare letter reach the search, so every k a reader types anywhere on the page pulls the ' +
      'cursor into the masthead',
    [
      controlFile(
        `  key.toLowerCase() === THE_SEARCH_KEY && (withMeta || withControl)`,
        `  key.toLowerCase() === THE_SEARCH_KEY || withMeta || withControl`,
      ),
    ],
    killed([
      'the-chord-the-badge-names-is-the-one-that-reaches-the-search',
      'the-press-that-reaches-the-search-is-the-letter-and-a-modifier',
    ]),
  ),

  /**
   * A component reaching outside itself, which is the direction the compiler does not hold.
   *
   * A drawing writes `&` and `paintedBy` is the only thing that turns it into a class, so a component
   * has no way to spell a selector aimed elsewhere - but `&` is a string and a string can be left out.
   * This is the edit that leaves it out: the pill's hover written against the container it happens to
   * stand in, which is the shape every one of ADR-0183's four instances had.
   *
   * **It reddens the declaration guard and not the matcher beside it**, which is what says the two are
   * about opposite directions. The rule still paints the pill correctly, so nothing outside the
   * component has started painting it; what has changed is that the component has started painting
   * something addressed by where it sits. ADR-0183.
   */
  sameOnEveryLens(
    'W-152',
    "writes the pill's hover against the container it stands in rather than against itself, so a " +
      'component paints by where it happens to sit',
    [
      componentsFile(
        '${OWN}:hover { border-color: var(--edge); color: var(--ink); text-decoration: none }',
        'ul.pills a:hover { border-color: var(--edge); color: var(--ink); text-decoration: none }',
      ),
    ],
    killed(['every-selector-a-component-declares-is-rooted-at-its-own-class']),
  ),

  /**
   * The two halves of the one component this repository draws in two places drifting apart.
   *
   * `copy` is the only component whose markup is not built by `components.ts`: `start.ts` creates the
   * button in the reader's browser. So the class is a literal over there and a union member over here,
   * and this is the edit that parts them - a rename nobody thinks twice about, in the module that does
   * not hold the registry.
   *
   * **What a reader would meet is a control with no paint at all**, on every install line of every
   * page, because the rule is keyed to a class nothing now writes. It is the shape the copy control
   * already had once, with the one half that usually prevents it - single-sourced markup - already in
   * place. ADR-0183.
   */
  sameOnEveryLens(
    'W-153',
    'renames the class the browser writes on the copy control, so every install line on the site ' +
      'offers a button the stylesheet has no rule for',
    [startFile(`button.className = 'copy'`, `button.className = 'copy-button'`)],
    killed(['the-class-the-browser-writes-on-a-copy-control-is-the-one-this-registry-paints']),
  ),

  /**
   * **The defect ADR-0183 was written for, put back in the one line it needs.**
   *
   * A page section painting a component from outside, addressed by neither the component's name nor
   * anything the component declares. It is `.recent h2` exactly - the instance the matcher guard found
   * on its own first run - and it is `ul.chips a` in miniature: the selector never names `.pill`, so no
   * sweep of selector text can see it and only a matcher can.
   *
   * **It is the cell that guard was owing.** The three that reddened it before this were W-19, W-20 and
   * W-92, none of which is about painting: each makes `theSite` throw, so the guard fell with every
   * other guard that builds a page. A guard red only where its neighbours are red has not been shown to
   * catch anything, which is what `attribution.ts` calls *never alone*. This one reddens it with the
   * pages building perfectly. ADR-0183.
   */
  sameOnEveryLens(
    'W-154',
    'lets a section paint the pill inside it, so what a component looks like goes back to depending ' +
      'on which page it stands on',
    [
      styleFile(
        `ul.pills li { padding: 0; border: 0 }`,
        `ul.pills li { padding: 0; border: 0 }
.hero ul.pills .pill { border-radius: 1rem }`,
      ),
    ],
    killed(['a-component-is-painted-by-its-own-rules-and-by-nothing-else']),
  ),

  sameOnEveryLens(
    'W-149',
    'spells the shortcut the same way for every keyboard, so a reader on Windows is told to press a ' +
      'key their machine does not have',
    [
      controlFile(
        `  /mac/i.test(platform) ? '⌘K' : 'Ctrl K'`,
        `  platform === platform ? '⌘K' : 'Ctrl K'`,
      ),
    ],
    killed(['the-shortcut-is-spelled-the-way-the-readers-own-keyboard-spells-it']),
  ),

  /**
   * A control that presumes the page serves its slot, silencing the compiler rather than answering it.
   *
   * **It exists because the battery refused a run.** W-127 used to redden
   * `a-page-with-no-slots-on-it-has-nothing-built-into-it` by making `copyControl` assume an install
   * block; ADR-0182 gave that control a walk over every block, so a page holding none walks nothing and
   * that defect stopped being expressible. The guard was left with nothing reddening it and the
   * instrument said so by name rather than printing a total that looked healthy - which is the whole
   * argument for an accounting that refuses a run where every declared cell did what it declared.
   *
   * The shape is the one a compiler invites: told the answer can be null, reach for a cast instead of a
   * branch. Measured at the commit this lands on, it reddens the guard **and its neighbour** - both are
   * about a control meeting a page that does not serve it, and neither is red alone here. ADR-0182.
   */
  sameOnEveryLens(
    'W-150',
    'casts the masthead away rather than reading it, so the search builds itself on a page that ' +
      'serves no slot for it and the page fails where it should have done nothing',
    [
      startFile(
        `  const declared = theCatalogueDeclaredIn('.masthead .search')
  if (declared === null) return`,
        `  const declared = theCatalogueDeclaredIn('.masthead .search') as NonNullable<
    ReturnType<typeof theCatalogueDeclaredIn>
  >`,
      ),
    ],
    killed([
      'a-page-with-no-slots-on-it-has-nothing-built-into-it',
      'a-slot-that-declares-nothing-is-left-alone',
    ]),
  ),

  /**
   * **Three cells over one removal, and each reddens exactly one of its three guards** - which was
   * measured rather than arranged, and is the whole reason the three guards are not one.
   *
   * The removal is the only thing on this site that stands between what a maintainer reads and what a
   * reader downloads, and it fails in three unrelated ways: it can not happen, it can take something
   * with it, or it can be wrong about what a comment is. A single cell would have said the removal is
   * watched and left two of those unwitnessed. ADR-0141.
   */
  sameOnEveryLens(
    'W-92',
    'serves the stylesheet with its argument still in it, which is 25 007 B of prose about lengths ' +
      'and contrast written into every page of the tree - three times what the front page is worth ' +
      'without them, once both are compressed, and nothing ' +
      'on the rendered page looks wrong because nothing on it is',
    [
      servedStylesheetFile(
        THE_SHEET_IS_STRIPPED_BEFORE_IT_IS_SERVED,
        `export const THE_SERVED_STYLESHEET = STYLE`,
      ),
    ],
    killed(['the-stylesheet-a-reader-receives-carries-no-comment']),
  ),

  /**
   * **The plausible edit, because this unit built it and refused it on a measurement.** Sweeping the
   * blank line a comment leaves behind buys 21 B in brotli - and it takes a newline no comment
   * covers, which is a removal nobody declared arriving through the door marked tidiness.
   *
   * It is the one cell here that reddens `what-is-taken-out-of-the-stylesheet-is-comments-and-nothing-else`
   * alone: no comment survives, so the guard above stays green, and the four crafted rows of the guard
   * below are each one line, so none of them has a blank to sweep.
   */
  sameOnEveryLens(
    'W-93',
    'tidies the served stylesheet as well as stripping it, taking blank lines nothing declared out ' +
      'along with the comments that left them - a removal that is right about every comment and ' +
      'still not a removal of comments',
    [
      servedStylesheetFile(
        NOTHING_ELSE_IS_TAKEN_OUT_WITH_THEM,
        `  return (kept + css.slice(keptFrom))\n` +
          `    .split('\\n')\n` +
          `    .filter((line, index, all) => line.trim() !== '' || (all[index - 1] ?? '').trim() !== '')\n` +
          `    .join('\\n')`,
      ),
    ],
    killed(['what-is-taken-out-of-the-stylesheet-is-comments-and-nothing-else']),
  ),

  /**
   * **The reader anybody writes first, and the two guards beside it are green on it.** With the string
   * arm gone, a delimiter is a comment wherever it stands - which is what a regular expression over
   * `/*` and `*` `/` does, and it is correct on this stylesheet to the byte, because the sheet declares
   * exactly one string and that string carries no delimiter.
   *
   * So the cell measures the guard rather than today's sheet: the defect it injects arrives the day
   * somebody writes `content: "/* … *` `/"`, and on that day the page loses a rule with every static
   * check in this repository green. That is the shape ADR-0055 prefers - a guard aimed at the right
   * future moment rather than at what the data happens to hold.
   */
  sameOnEveryLens(
    'W-94',
    'reads a comment delimiter as a comment wherever it stands, including inside a value - which is ' +
      'right about every comment this stylesheet holds today and eats the declaration after the ' +
      'first one anybody writes into a string',
    [servedStylesheetFile(A_STRING_IS_NOT_READ_FOR_COMMENTS, ``)],
    killed(['what-this-reads-as-a-comment-is-what-a-browser-reads-as-one']),
  ),

  /**
   * **Taking the argument out of a module fails in the same three ways taking it out of the
   * stylesheet does**, and W-96 to W-98 are those three: it can not happen, it can be wrong about
   * what a comment is, and it can take something with it. What differs is that the third is not the
   * cheap one here - a CSS comment is whitespace and a JavaScript comment is not, so a removal that
   * is right about every comment and wrong about one byte beside it changes what a browser runs.
   * ADR-0156.
   */
  sameOnEveryLens(
    'W-96',
    'serves the modules of this repository with their argument still in them, which is 92 562 B of ' +
      'prose a reader cannot use - 19 475 B in brotli on every page of the tree, two and a half ' +
      'times what taking the prose out of the stylesheet bought, and nothing a browser runs is any ' +
      'different for it',
    [
      browserFile(
        THE_MODULES_ARE_STRIPPED_BEFORE_THEY_ARE_SERVED,
        `  stripTypeScriptTypes(typescript, { mode: 'strip' })`,
      ),
    ],
    killed(['every-module-a-reader-runs-carries-no-comment']),
  ),

  /**
   * **The defect this whole unit exists because of, measured before a line of it was written.** A
   * scan loop that never asks the scanner to resume a template reads the closing backtick of a
   * substitution as an opening one, and from there reads prose as code and code as prose. On
   * `packages/registry/address.js` it finds 10 comments and 9 644 bytes where the parser finds 25 and
   * 16 358, and the prose of this repository is full of backticks, so it never resynchronises.
   *
   * **It raises no error and returns a plausible number**, which is why the guard it reddens reads
   * the compiler instead of asking the reader how much it left behind. Written the other way first,
   * that guard was green on exactly this cell.
   */
  sameOnEveryLens(
    'W-97',
    'stops resuming a template literal after a substitution, so the reader loses its place at the ' +
      'first substitution in a module and reads the code that follows as prose - leaving comments ' +
      'in what is served while reporting that it removed them all',
    [servedModulesFile(THE_TEMPLATE_IS_RESUMED, `        braces -= 1`)],
    // Three rather than one since ADR-0162, and the reason is that this mutant stopped answering
    // wrongly and started not answering: the reader lost its place and spun, so the guard written for
    // it hung with it and the cell measured nothing at all. `theCommentRangesIn` refuses to spin now -
    // a correct reading of n characters takes at most n + 1 steps - and every guard that reads a
    // served module reddens on the refusal. Measured: 2.1 s where it used to run for ever.
    killed([
      'every-module-a-reader-runs-carries-no-comment',
      'a-module-a-reader-runs-is-the-program-its-source-declares',
      'no-module-a-reader-runs-carries-a-comment-a-tool-reads',
    ]),
  ),

  /**
   * **A removal that is right about every comment and takes one byte too many with it.** It is the
   * off-by-one anybody writes, and it is the cell that reddens the total comparison alone: no comment
   * survives, so the guard above stays green, and what changes is the program.
   */
  sameOnEveryLens(
    'W-98',
    'takes two bytes past the end of every comment, which is right about where each one starts and ' +
      'wrong about where it stops - a removal no reading of the served bytes would call a comment, ' +
      'in a language where a byte beside a comment decides where a statement ends',
    [servedModulesFile(A_COMMENT_ENDS_WHERE_IT_ENDS, `to: scanner.getTokenEnd() + 2`)],
    killed(['a-module-a-reader-runs-is-the-program-its-source-declares']),
  ),

  /**
   * **The shorter name, reached for.** The two erasures differ by one removal, and a contract page
   * publishes a sentence about the second: *the JavaScript this runs is that contract own
   * reference.ts with its types stripped*. Taking the comments out of a reference makes that sentence
   * false on the one page whose subject is that this catalogue can be checked, and widens the gap
   * between what an auditor fetches and what the digest covers.
   */
  sameOnEveryLens(
    'W-99',
    'strips the reference of a contract of its argument as well as its types, so the page promises ' +
      'a reader one artefact and hands them another - on a file frozen for the life of the major, ' +
      'and with 15 417 B of the reasoning this catalogue publishes gone from what an auditor receives',
    [
      browserFile(
        A_REFERENCE_KEEPS_ITS_ARGUMENT,
        `  return asABrowserModule(blob.bytes.toString('utf8'))`,
      ),
    ],
    killed(['a-contracts-reference-reaches-a-reader-with-its-argument-intact']),
  ),

  /**
   * **The comment a comparison of syntax trees cannot see removed.** A source-map directive or a
   * purity annotation leaves the tree identical, so the total guard is blind exactly where the
   * consequence is not syntactic. The answer is the one `a-page-fetches-nothing-but-the-face-this-repository-serves` gives
   * about an address in a stylesheet: refuse the shape rather than detect the loss.
   *
   * The cell writes one into a module, which is the event that guard is born green waiting for.
   */
  sameOnEveryLens(
    'W-100',
    'writes a directive comment into a browser module, which the removal takes out like any other ' +
      'and whose absence no comparison of syntax trees can see - the one comment on this site whose ' +
      'meaning is not for a reader',
    [
      literalFile(
        A_MODULE_CARRIES_NO_DIRECTIVE,
        `//# sourceURL=probe
export const escaped = (character: string): string => {`,
      ),
    ],
    killed(['no-module-a-reader-runs-carries-a-comment-a-tool-reads']),
  ),

  /**
   * **The cell this unit most wanted and cannot have, published rather than dressed up.** A comment
   * carrying a line terminator is a line terminator for automatic semicolon insertion, so replacing
   * one with a space can change what a program answers - measured, a `return` separated from its
   * value by such a comment answers `undefined`, and answers 42 once that comment is a space.
   *
   * **No module of this catalogue carries that shape.** Measured over 9 637 nodes at `43db0c2`: all
   * three candidate rules - a line terminator, a space always, nothing at all - leave every tree
   * identical. So this states an intent and carries no behaviour, which is exactly why the rule it
   * perturbs is argued from the specification and not from the corpus.
   *
   * It is the shape `number/round@1` already carries three of: a defect that is real, inert for every
   * input this catalogue holds, and worth naming so that the day one arrives it is already named.
   */
  sameOnEveryLens(
    'W-101',
    'replaces every comment with a space, never with the line terminator the comment it removed was ' +
      'carrying - which is what a reader of CSS writes, and which moves where a statement ends in a ' +
      'language that ends statements at a line',
    [servedModulesFile(A_COMMENT_THAT_SPANNED_A_LINE_STILL_DOES, `false`)],
    survived('unreachable-on-this-catalogue'),
  ),

  // -------------------------------------------------------------------------
  // W-102 to W-115 - the controls a visitor touches with a mouse
  // -------------------------------------------------------------------------
  //
  // The first cells this battery has ever injected into `start.ts`'s half of the folder, and the
  // reason there were none is not that anything refused them: nothing did. `contractPath` has been
  // `packages/site` since the battery was written, so a cell here was always possible - and it would
  // have been a guaranteed survivor, because `start.ts` exports no name and `searching.ts` was
  // imported by no test. A mutant with nothing able to kill it is what an absence looks like from the
  // inside, and it is why the absence was never written down as a decision.
  //
  // What separates this section from the rest of the battery is the direction of the failure. A wrong
  // page publishes a claim a reader can check against the contract; a wrong control publishes nothing
  // at all - it hands somebody a command that fails, or an empty box, or a label only a screen reader
  // hears. Every cell below leaves the site looking exactly as it does now.

  /**
   * **The label a sighted reader never sees.** `textContent` on the install block is the command plus
   * every control appended to it, so a label built from the button rather than from the command reads
   * `Copy copy to the clipboard` to a screen reader and is invisible to everybody else - including to
   * whoever made the edit.
   */
  sameOnEveryLens(
    'W-102',
    'names the button in the copy control label instead of the command it copies, so the one reader ' +
      'who depends on that label is told the word on the button - a defect nothing on the rendered ' +
      'page can show, on the control this site added for the people it is hardest to serve',
    [
      controlFile(
        THE_COPY_LABEL_NAMES_THE_COMMAND,
        `export const theCopyLabelFor = (): string => \`Copy \${THE_COPY_CONTROL_SAYS.atRest} to the clipboard\``,
      ),
    ],
    killed(['the-copy-control-names-the-command-and-never-itself']),
  ),

  /**
   * **A control that answers a refusal by doing nothing.** A clipboard write can be refused - a page
   * without focus, a permission withheld - and a button that returns to its resting word tells the
   * reader it worked. It is the exact shape
   * `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing` refuses one floor up.
   */
  sameOnEveryLens(
    'W-103',
    'answers a refused clipboard with the word the button already carried, so a reader whose browser ' +
      'declined the write is told nothing went wrong and walks away without the command',
    [controlFile(A_REFUSED_CLIPBOARD_SAYS_SOMETHING_ELSE, `  whenTheClipboardRefuses: 'copy',`)],
    killed(['every-word-the-copy-control-carries-says-something-the-others-do-not']),
  ),

  /**
   * **The spelling this unit removed, put back.** `.split(' ').slice(2)` is right for `npx toopo` and
   * silently wrong for every other invocation: on `yarn dlx toopo add x` it answers `toopo add x`, so
   * the arguments a reader is handed carry a package name where a command should be. It is the typed
   * constant this repository refuses in a stylesheet, arriving in a word count.
   */
  sameOnEveryLens(
    'W-104',
    'counts the words of the invocation instead of deriving them from it, which is exactly right ' +
      'today and answers a mangled command the day the invocation gains a word - with nothing on the ' +
      'page, and no guard anywhere, able to notice the number was ever typed',
    [
      controlFile(
        WHAT_FOLLOWS_THE_INVOCATION_IS_DERIVED,
        `  command.trim().split(' ').slice(2).join(' ')`,
      ),
    ],
    killed(['a-command-this-control-cannot-take-apart-is-one-it-refuses-to-rewrite']),
  ),

  /**
   * **The comparison that marked nothing at all.** Written against the manager rather than against the
   * spelling, the control opens with no way marked as chosen - and a group of four buttons where none
   * is pressed reads as a control that has not loaded yet rather than as one that has.
   */
  sameOnEveryLens(
    'W-105',
    'decides which way is already chosen by the manager rather than by the spelling the page serves, ' +
      'so the control opens with nothing marked and a reader cannot tell which command they are ' +
      'already looking at',
    [
      controlFile(
        THE_WAY_ALREADY_CHOSEN_IS_A_SPELLING,
        `export const theWayAlreadyChosen = (way: AWayToRunIt): boolean => way.manager === THE_INVOCATION`,
      ),
    ],
    killed(['the-way-the-page-serves-is-the-one-the-control-opens-marked']),
  ),

  /**
   * **A command measured not to work, handed over on request.** `yarn dlx toopo` is refused on a
   * reading taken against npm's own registry: Yarn patches `typescript`, the patch does not apply to
   * TypeScript 7, and the install fails before a file is written. Showing it is the site offering a
   * reader the one form this catalogue has measured to be broken.
   */
  sameOnEveryLens(
    'W-106',
    'shows a refused way its own spelling, so a reader who says they use Yarn is handed the command ' +
      'this catalogue measured failing - beside the paragraph explaining that it fails, which is a ' +
      'page contradicting itself in two adjacent elements',
    [controlFile(A_REFUSED_WAY_SHOWS_WHAT_WORKS, `  way.spelling`)],
    killed(['a-refused-way-shows-the-spelling-that-works']),
  ),

  /**
   * **The empty string where a `null` belongs.** The control writes the refusal into a paragraph it
   * also has to hide, and it decides to hide it by asking whether there is one - so a refusal read as
   * `''` is a paragraph shown empty rather than a paragraph not shown, on every way that runs.
   */
  sameOnEveryLens(
    'W-107',
    'answers the empty string where a way carries no refusal, so the paragraph that explains a ' +
      'refusal is shown blank under every manager that works - a gap in the page whose cause is a ' +
      'value that reads perfectly well at the call site',
    [
      controlFile(
        A_WAY_THAT_RUNS_CARRIES_NO_REFUSAL,
        `export const theRefusalShownFor = (way: AWayToRunIt): string => way.refusedBecause ?? ''`,
      ),
    ],
    killed(['a-refused-way-carries-its-measurement-and-a-way-that-runs-carries-nothing']),
  ),

  /**
   * **The blank box, which is the failure the whole matching rule exists to avoid.** A search that
   * answers nothing by showing nothing tells a reader the page is broken rather than that the
   * catalogue does not hold what they asked for - and the stylesheet already hides an empty panel, so
   * the edit looks like it is agreeing with the stylesheet.
   */
  sameOnEveryLens(
    'W-108',
    'closes the panel on a query the catalogue cannot answer, so a reader who described a need reads ' +
      'a box that vanished rather than which of their words no contract carries - the one failure ' +
      'ADR-0035 is written to make impossible, arriving in the surface instead of in the rule',
    [controlFile(A_QUERY_NOTHING_ANSWERS_STILL_SAYS_SOMETHING, `    return THE_PANEL_IS_CLOSED`)],
    killed(['a-reader-who-is-searching-is-never-shown-nothing']),
  ),

  /**
   * **A list rendered where there is nothing to list.** Every word of the query is known and no one
   * contract carries them all - a real answer about this catalogue - and printing the unknown words
   * unconditionally answers `No contract mentions: ` with nothing after the colon.
   */
  sameOnEveryLens(
    'W-109',
    'prints the unknown words of a query whether or not there are any, so a reader whose every word ' +
      'this catalogue knows is answered with a colon and nothing after it - which reads as a defect ' +
      'in the page rather than as what it is, an answer about the catalogue',
    [
      controlFile(
        A_WORD_LIST_IS_SHOWN_ONLY_WHERE_THERE_IS_ONE,
        `  \`No contract mentions: \${found.unknownWords.join(', ')}\``,
      ),
    ],
    killed(['a-query-whose-every-word-is-known-is-told-that-and-not-an-empty-list']),
  ),

  /**
   * **The link that works on exactly one page.** The root is resolved by the page that hands the
   * search its addresses, so a link built without it resolves against wherever the reader happens to
   * be standing: correct on the front page, broken on every domain and contract page - which is
   * twelve of the thirteen.
   */
  sameOnEveryLens(
    'W-110',
    'builds a result link without the root the page resolved for itself, so every answer on every ' +
      'page below the front page points at an address that does not exist - and the front page, ' +
      'which is where anybody testing the search would try it, keeps working',
    [controlFile(A_RESULT_LINKS_UNDER_THE_ROOT, `    href: \`\${rendered}/\`,`)],
    killed(['a-result-links-to-the-contracts-own-address-under-the-root-of-the-site']),
  ),

  /**
   * **Every answer dropped from a reader who types a trailing space.** The query is trimmed before it
   * is asked, so comparing the untrimmed field against it is a comparison that can never hold once a
   * space is involved - and the panel then stays on whatever it last showed, for ever.
   */
  sameOnEveryLens(
    'W-111',
    'compares an arriving answer against the untrimmed field, so a reader whose query ends in a ' +
      'space has every answer discarded as stale and watches a panel that never updates - on a ' +
      'control whose whole subject is answering while somebody types',
    [
      controlFile(
        AN_ANSWER_IS_COMPARED_AGAINST_THE_TRIMMED_FIELD,
        `export const theAnswerIsStale = (typed: string, asked: string): boolean => typed !== asked`,
      ),
    ],
    killed(['an-answer-about-a-query-the-reader-has-left-is-not-shown']),
  ),

  /**
   * **A page that stays broken after the network came back.** The failure a reader meets most is a
   * connection that recovered a second later; a rejected promise left in the cache answers *the
   * catalogue could not be read* for the rest of the session, with a reload as the only repair.
   */
  sameOnEveryLens(
    'W-112',
    'keeps the rejected promise, so one lost request retires the search for the life of the page - ' +
      'and it retires it silently, because the panel goes on rendering a failure that was true once ' +
      'and has not been true since',
    [
      searchingFile(
        A_FAILED_CATALOGUE_IS_NOT_KEPT,
        `        .catch((thrown: unknown) => {
          throw thrown
        })`,
      ),
    ],
    killed(['a-catalogue-that-failed-is-asked-again-on-the-next-keystroke']),
  ),

  /**
   * **The whole catalogue, per keystroke.** `null` against `undefined` is the slip that never looks
   * like one, and the page it produces is indistinguishable from the correct one on any machine near
   * the origin - the reader who pays is the one on a slow connection typing a long query.
   */
  sameOnEveryLens(
    'W-113',
    'never finds the answers it already holds, so both documents are fetched again for every ' +
      'character a reader types - a page that behaves identically on a fast connection and asks a ' +
      'host for the same two files fifteen times on a slow one',
    [searchingFile(BOTH_ANSWERS_ARE_KEPT_ONCE_THEY_ARRIVE, `    if (arriving === undefined) {`)],
    killed(['both-answers-are-fetched-once-however-often-a-reader-types']),
  ),

  /**
   * **A status that is not an answer, taken as one.** A host answering 503 with a page of its own, or
   * a portal answering 200 with a login screen, is not a catalogue - and a search that reported
   * *nothing found* having read one of those would be the failure ADR-0035 is written against, with
   * the reader given no way at all to know they had not been asked about.
   */
  sameOnEveryLens(
    'W-114',
    'stops telling a host that answered something else from a host that answered the catalogue, so ' +
      'what a reader is shown for a 503 depends on whether that error page happens to parse as JSON - ' +
      'and the three ways of not knowing collapse into one message that names the wrong cause',
    [searchingFile(A_HOST_THAT_ANSWERED_SOMETHING_ELSE_IS_REFUSED, `  if (answer.status >= 600) {`)],
    killed(['nothing-answering-is-told-apart-from-a-host-that-answered-something-else']),
  ),

  /**
   * **The cell this section exists for, and the one no reading of the output could catch.** Both lines
   * are byte for byte what the correct version prints. The only difference is that a contract's
   * diagnostic now runs on every keystroke of every *successful* call - on a browser, on somebody
   * else's machine, invisibly. It is what handing a thunk buys, said as a mutant.
   */
  sameOnEveryLens(
    'W-115',
    'calls the diagnostic before deciding whether to show it, so every contract that publishes one ' +
      'runs it on every keystroke of every call that succeeded - and prints exactly the same two ' +
      'lines, so nothing a reader sees and no comparison of the output could ever say so',
    [
      playgroundFile(
        A_DIAGNOSTIC_IS_CALLED_ONLY_WHERE_THE_ANSWER_IS_NULL,
        `  const described = diagnostic === null ? null : answerWritten(diagnostic.describes())
  const lines = [\`\${callWritten(call.name, spelled)} → \${answerWritten(call.answered)}\`]

  if (call.answered === null && described !== null && diagnostic !== null) {
    lines.push(\`\${callWritten(diagnostic.name, spelled)} → \${described}\`)
  }`,
      ),
    ],
    killed(['a-diagnostic-is-called-where-the-answer-is-null-and-nowhere-else']),
  ),

  // -------------------------------------------------------------------------
  // W-116 to W-120 - the five the battery asked for and no reading did
  // -------------------------------------------------------------------------
  //
  // Fourteen cells were written for twenty-four new guards, on a judgement about which defects were
  // plausible. Every one of the fourteen killed what it declared, and the battery refused the run
  // anyway: five guards had nothing reddening them at all, and it named them rather than reporting a
  // total that looked healthy. These are those five. **No reading of the battery beside the suite
  // would have found them** - the guards were green, the cells were green, and the count was the
  // count. What said so is that this instrument declines to be silent about a guard it never saw red.

  /**
   * **The playground on nine pages that cannot use it.** `start.ts` waits for that module so the nine
   * pages with no form fetch none of it - the larger half of the graph. Reaching for it at the top is
   * the tidying anybody does, it changes nothing a reader sees, and it puts four modules on every page
   * of this site.
   */
  sameOnEveryLens(
    'W-116',
    'imports the playground at the top of the entry point instead of waiting for it, so nine of the ' +
      'thirteen pages fetch four modules for a section that is not on them - a page that renders ' +
      'identically, loads identically as far as anybody looks, and costs every reader the larger ' +
      'half of the module graph',
    [
      startFile(
        THE_PLAYGROUND_IS_NOT_IMPORTED_AT_THE_TOP,
        `import type { PlaygroundField } from './playground.js'
import {
  argumentsOf,
  declaredBy,
  theAnswerShown,
  theFieldLabelFor,
  theWhatWentWrong,
} from './playground.js'`,
      ),
      startFile(THE_PLAYGROUND_IS_WAITED_FOR, `  void 0`),
    ],
    killed(['a-module-loaded-before-a-reader-acts-is-one-the-entry-point-imports-outright']),
  ),

  /**
   * **Our wording in place of the contract's.** A playground exists to show what a contract does with
   * what somebody typed; a sentence of ours where its own words belong is the one edit here that makes
   * the page lie about its subject, and it reads more politely than the truth.
   */
  sameOnEveryLens(
    'W-117',
    'answers a sentence of this site where the contract threw one of its own, so a reader who typed ' +
      'something the implementation refused is told nothing about why - on the one part of a contract ' +
      'page whose whole purpose is that the contract speaks for itself',
    [
      playgroundFile(
        WHAT_THE_FORM_PRINTS_IS_WHAT_THE_CALL_THREW,
        `export const theWhatWentWrong = (): string => 'that input could not be used'`,
      ),
    ],
    killed(['what-the-form-prints-when-a-call-throws-is-what-the-call-threw']),
  ),

  /**
   * **The whole command where its arguments belong.** W-104 is about the invocation being counted
   * rather than derived, and it leaves the ordinary case right; this leaves the ordinary case wrong,
   * and it is the other half of the same function - a reader clicking `bun` is handed
   * `bunx npx toopo add string/slugify`.
   */
  sameOnEveryLens(
    'W-118',
    'keeps the invocation in what follows it, so choosing any manager writes the new spelling in ' +
      'front of the old one - a command with two invocations in it, offered on the page whose ' +
      'subject is the one form measured to work',
    [
      controlFile(
        WHAT_FOLLOWS_THE_INVOCATION_IS_DERIVED,
        `  command.startsWith(THE_INVOCATION) ? command.trim() : null`,
      ),
    ],
    killed(['what-follows-the-invocation-is-what-the-page-already-asked-for']),
  ),

  /**
   * **An invitation with nothing behind it.** ADR-0137 offers three queries before anybody types, each
   * measured to answer, because the promise this site makes is that describing a need gets you
   * somewhere. The sentence without them asks a reader to trust that promise on nothing.
   */
  sameOnEveryLens(
    'W-119',
    'offers the invitation with no examples under it, so a reader meeting the search for the first ' +
      'time is told to describe what they need and shown nothing that this works - which is the ' +
      'defect a visitor met on the install command, arriving on the control built to answer it',
    [
      controlFile(
        A_READER_WHO_HAS_NOT_TYPED_MEETS_THE_EXAMPLES,
        `    return { kind: 'an-invitation', said: THE_INVITATION, examples: [] }`,
      ),
    ],
    killed(['a-reader-who-has-not-typed-meets-the-queries-this-catalogue-answers']),
  ),

  /**
   * **The one thing the page knows, dropped.** `TheCatalogueCouldNotBeReached` carries the address and
   * the reason - a 503, a body that is not JSON, a request nothing answered - and those are what a
   * reader or whoever they report it to can act on. Replaced by our own sentence, three different
   * failures become one and none of them is nameable.
   */
  sameOnEveryLens(
    'W-120',
    'answers a fixed sentence for every way of failing to read the catalogue, so the address and the ' +
      'status the refusal carried never reach the page - and a host serving a login screen, a host ' +
      'answering 503 and a request nothing answered are one message a reader cannot tell apart',
    [controlFile(A_FAILURE_SPEAKS_IN_ITS_OWN_WORDS, `      said: THE_CATALOGUE_COULD_NOT_BE_READ,`)],
    killed(['a-catalogue-that-could-not-be-read-says-so-in-the-failures-own-words']),
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
