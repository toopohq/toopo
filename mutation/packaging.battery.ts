/**
 * The battery over the archive: what somebody receives, and what must never be in it.
 * ADR-0045 is what this battery can reach, and the share of the suite it cannot.
 *
 *
 * It is the nineteenth, and it is the only one whose guards measure something that does not exist in
 * the working tree. Every other battery injects a defect and asks what the suite says about the files
 * beside it; this one injects a defect and asks what `npm pack` produces, what `npm install` puts in
 * somebody else's `node_modules`, and what `toopo` does when it runs out of there. The unit that wrote
 * `packaging/` found three defects that every guard of this repository was blind to for exactly that
 * reason.
 *
 * ---------------------------------------------------------------------------
 * It halved, and the reason is a folder losing two of its four modules
 * ---------------------------------------------------------------------------
 *
 * **Eight of the fourteen cells were about a frozen artefact, and there is none.** ADR-0092 took the
 * catalogue out of the archive, so `freeze.ts`, `artefact.ts` and `packaged-source.ts` are gone and
 * with them every mutant that edited a transcript of the installer's walk - the bytes a file travels
 * as, the snapshot the walk remembers, the index carried whole, the binding keyed by its address, the
 * refusal that stops a build, and the sort over the artefact's own lists.
 *
 * They are not replaced. What they measured no longer happens: a published `toopo` asks a registry
 * rather than reading a file beside itself, and what the archive gets wrong now is a question about
 * *compilation and reachability* rather than about a transcript. That is what the six below are aimed
 * at, and the shrinking is recorded here rather than left to look like cells that were dropped.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * **The graph the archive carries**, which is now the whole subject. A-05, A-06, A-07, A-08 and A-14
 * are ways of getting the wrong set of files into a tarball, and they fail in opposite directions on
 * purpose: some ship modules nothing loads, some drop modules the tool needs. `reachable.ts` says in
 * as many words that the walk and the guard are two mechanisms rather than one statement twice, and
 * these are the cells that say so.
 *
 * **A-08 is now the calibration mutant**, and it is the right one for the folder this became: it
 * compiles the catalogue into the program and ships what the compiler emitted, which is the archive
 * growing with the catalogue again - the one property ADR-0092 exists to remove.
 *
 * ---------------------------------------------------------------------------
 * What this battery cannot reach, and it is more of the suite than before
 * ---------------------------------------------------------------------------
 *
 * A battery edits one folder, and **one guard of the eight is out of reach** - the one that reads the
 * repository's own `package.json`. Everything else is reddened by some cell here.
 *
 * **Three of those were declared out of reach and are not, which the measurement said and the author
 * did not.** The pins above were written from what each edit looked like it would do; running the
 * battery named two red guards they had missed and one guard declared silent that a mutant reddens
 * anyway. It is the shape ADR-0076 asks for on a pin of five or fewer - name all of them - working as
 * a correction rather than as a rule somebody remembered.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'A', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const buildFile = (find: string, replace: string) => ({ file: 'build.ts', find, replace })
const reachableFile = (find: string, replace: string) => ({ file: 'reachable.ts', find, replace })
const distConfig = (find: string, replace: string) => ({ file: 'tsconfig.dist.json', find, replace })
const npmFile = (find: string, replace: string) => ({ file: 'what-npm-holds.ts', find, replace })
const originFile = (find: string, replace: string) => ({
  file: 'what-the-origin-lists.ts',
  find,
  replace,
})

const THE_OUTPUT_IS_WALKED_TO_THE_BOTTOM = `    return statSync(full).isDirectory() ? every(full) : [full]`

const THE_WALK_STARTS_AT_THE_COMPILED_ENTRY_POINT = `const reachable = reachableFrom(join(DIST, 'packages', 'cli', 'published.js'))`

const A_SPECIFIER_THAT_LEAVES_THE_FOLDER_IS_SEEN = `  ...[...text.matchAll(/(?:^|[\\s,{;])from\\s*['"](\\.[^'"]*)['"]/g)].map((match) => match[1] as string),`

const ONLY_THE_ENTRY_POINT_IS_COMPILED = `  "include": [],`

const THE_OUTPUT_FOLDER_IS_REMOVED_FIRST = `rmSync(DIST, { recursive: true, force: true })`

const A_REGISTRY_THAT_DID_NOT_ANSWER_IS_REFUSED = `    throw new WhatNpmHoldsCannotBeRead(url, \`nothing answered (\${theFirstLineOf(error)})\`)`

const THE_LISTING_IS_WHAT_IS_READ = `      ? (listing as { readonly versions?: unknown }).versions`

const A_NAME_NPM_DOES_NOT_KNOW_HOLDS_NOTHING = `  if (answer.status === 404) return new Set()`

const ANYTHING_BUT_AN_ANSWER_IS_REFUSED = `  if (answer.status !== 200) throw new WhatNpmHoldsCannotBeRead(url, \`it answered \${answer.status}\`)`

const THE_NAME_IS_PART_OF_THE_ADDRESS = '  const url = `${origin}/${packageName}`'

const THE_AMPERSAND_IS_UNDONE_LAST = `    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&')`

const A_DOCUMENT_THAT_IS_NOT_A_SITEMAP_IS_REFUSED = `  if (!body.includes('<urlset')) {
    throw new WhatTheOriginListsCannotBeRead(url, 'it answered something that is not a sitemap')
  }`

const A_SITEMAP_NAMING_NOTHING_IS_REFUSED = `  if (listed.length === 0) {
    throw new WhatTheOriginListsCannotBeRead(url, 'it answered a sitemap that names no address')
  }`

const AN_ORIGIN_THAT_DID_NOT_ANSWER_IS_REFUSED = `    throw new WhatTheOriginListsCannotBeRead(url, \`nothing answered (\${theFirstLineOf(error)})\`)`

const ONLY_TWO_HUNDRED_IS_AN_ANSWER = `  if (answer.status !== 200) {`

const NOTHING_BUT_TWO_HUNDRED_IS_READ = `  if (answer.status !== 200) {
    throw new WhatTheOriginListsCannotBeRead(url, \`it answered \${answer.status}\`)
  }`

const THE_SITEMAP_IS_WHAT_IS_ASKED_FOR = '  const url = `${origin}/${SITEMAP}`'

const WHAT_THE_ORIGIN_KEEPS_AND_THIS_TREE_DROPS = `): readonly string[] => [...served].filter((address) => !written.has(address))`

const NOTHING_IS_DROPPED = buildFile(
  `const dropped = every(DIST).filter((file) => !reachable.has(file))`,
  `const dropped: readonly string[] = []`,
)

const mutants: readonly Mutant[] = [
  /**
   * The calibration mutant, and the property ADR-0092 exists to remove.
   *
   * The route is not the one the guard it reddens was written against, and that is said rather than
   * glossed: `archive.test.ts` argues that the day somebody widens `files` in `package.json` to ship
   * the contracts - which permanent rule 5 can be read as asking for - the reachability guard is the
   * one they would edit and the instrument guard is the one that would still be there. `files` is not
   * in this folder. What an edit here can do is reach the same tarball from the other side, by
   * compiling the contracts into the program and shipping what the compiler emitted.
   */
  sameOnEveryLens(
    'A-08',
    'compiles the catalogue into the archive and ships what the compiler emitted, so every contract ' +
      'and every one of its test files travels into somebody\'s `node_modules` - the whole suite, ' +
      'loaded by nothing, in a package whose size stopped being a function of the catalogue',
    [distConfig(ONLY_THE_ENTRY_POINT_IS_COMPILED, `  "include": ["../contracts/**/*.ts"],`), NOTHING_IS_DROPPED],
    killed([
      'nothing-the-archive-carries-is-produced-by-the-catalogue',
      'every-file-in-the-archive-is-loaded-by-a-command',
      'no-part-of-the-instrument-or-of-the-suite-is-in-the-archive',
      // Measured rather than predicted: shipping the contracts puts a second module carrying an
      // `https://` into the tarball, which is the origin guard's other half.
      'the-published-entry-point-names-one-origin-and-offers-no-way-to-change-it',
    ]),
  ),

  sameOnEveryLens(
    'A-05',
    'walks the compiler\'s output without descending into it, so every module under ' +
      '`dist/packages/cli/` and `dist/packages/registry/` is outside what the prune can consider and ' +
      'the five the compiler emits for a type nobody loads ship again',
    [buildFile(THE_OUTPUT_IS_WALKED_TO_THE_BOTTOM, `    return statSync(full).isDirectory() ? [] : [full]`)],
    killed(['every-file-in-the-archive-is-loaded-by-a-command']),
  ),

  sameOnEveryLens(
    'A-06',
    'prunes the compiled output against the graph of the *sources*, so no emitted file is ever ' +
      'reachable and the archive ships nothing at all - a tarball npm accepts, installs, and writes a ' +
      'shim for',
    [
      buildFile(
        THE_WALK_STARTS_AT_THE_COMPILED_ENTRY_POINT,
        `const reachable = reachableFrom(join(REPOSITORY, 'packages', 'cli', 'published.ts'))`,
      ),
    ],
    killed([
      'an-installed-toopo-runs-reads-a-project-and-writes-one',
      'the-published-entry-point-names-one-origin-and-offers-no-way-to-change-it',
      'npm-writes-a-shim-for-the-command-the-site-tells-people-to-run',
      // An archive with no code in it has no module opening a socket either, which is how a battery
      // that edits only `packaging/` reaches a guard about what `packages/cli/` imports.
      'the-archive-reaches-the-network-from-exactly-one-module',
    ]),
  ),

  sameOnEveryLens(
    'A-07',
    'sees a specifier that stays in its folder and not one that leaves it, so everything under ' +
      '`packages/registry/` is pruned as unreachable and the first command a user runs ends in ' +
      '`ERR_MODULE_NOT_FOUND` - which is the failure this folder was built to stop',
    [
      reachableFile(
        A_SPECIFIER_THAT_LEAVES_THE_FOLDER_IS_SEEN,
        `  ...[...text.matchAll(/(?:^|[\\s,{;])from\\s*['"](\\.\\/[^'"]*)['"]/g)].map((match) => match[1] as string),`,
      ),
    ],
    killed([
      'an-installed-toopo-runs-reads-a-project-and-writes-one',
      'the-published-entry-point-names-one-origin-and-offers-no-way-to-change-it',
      'every-file-in-the-archive-is-loaded-by-a-command',
    ]),
  ),

  /**
   * The generator inside the archive, and the cell that makes a repair to `archive.test.ts`
   * replayable rather than remembered.
   *
   * That guard reads six conditions, and two of them were once anchored at the start of the path.
   * `files` is `["dist"]`, so npm reports everything as `dist/...`, and `startsWith('packages/site/')`
   * could only see the generator shipping as *source* - while the route the build can take is the
   * compiled one. Measured before the repair: these same two edits reddened
   * `every-file-in-the-archive-is-loaded-by-a-command` and left the guard named for the instrument and
   * the suite green.
   *
   * **A-08 is not a substitute for it, and that is the whole reason this cell exists.** A-08 reaches
   * the same guard through a `.test.js` in the tarball, so anchoring those two conditions back at the
   * start of the path would leave A-08 red and every battery green. This is the only cell that reddens
   * on the folder condition alone, which makes it the only thing standing between the repair and a
   * silent revert.
   */
  sameOnEveryLens(
    'A-14',
    'compiles the generator into the archive and ships what the compiler emitted, so `packages/site/` ' +
      "travels into somebody's `node_modules` as `dist/packages/site/document.js` - a folder that " +
      'guard names, in the spelling it could not read until it was anchored at a path segment rather ' +
      'than at the start',
    [
      distConfig(
        ONLY_THE_ENTRY_POINT_IS_COMPILED,
        `  "include": ["../packages/site/document.ts", "../packages/site/paths.ts"],`,
      ),
      NOTHING_IS_DROPPED,
    ],
    killed([
      'every-file-in-the-archive-is-loaded-by-a-command',
      'no-part-of-the-instrument-or-of-the-suite-is-in-the-archive',
    ]),
  ),

  // -------------------------------------------------------------------------
  // What decides a publication
  // -------------------------------------------------------------------------

  /**
   * **The defect this module exists against**, and the reason ADR-0111 puts a network read in a
   * condition at all rather than comparing two commits.
   *
   * A registry that did not answer and a registry holding nothing are one value once a refusal becomes
   * an empty set, and they decide opposite things: the first must stop a run, the second is the state
   * every first publication is decided in. Swallowed, this answers *publish* to a registry that never
   * spoke - and what follows is either a red at `npm publish` or, if npm is answering by then, a
   * publication nobody's reading justified.
   */
  sameOnEveryLens(
    'A-15',
    'reads a registry that did not answer as a registry holding nothing, so a failed lookup and an ' +
      'unpublished package become the same answer and the gate opens on the one that means the ' +
      'opposite',
    [npmFile(A_REGISTRY_THAT_DID_NOT_ANSWER_IS_REFUSED, `    return new Set()`)],
    killed(['a-reader-that-could-not-read-is-refused-and-never-read-as-emptiness']),
  ),

  /**
   * The pointer read where the listing was meant, which is the shape ADR-0111 argues against by name and
   * the one that would look right for as long as this package has a single channel.
   */
  sameOnEveryLens(
    'A-16',
    'answers with the keys of `dist-tags` instead of the keys of `versions`, so what npm holds becomes ' +
      "the set of channel names - and every version but the one `latest` points at reads as unpublished",
    [npmFile(THE_LISTING_IS_WHAT_IS_READ, `      ? (listing as { readonly 'dist-tags'?: unknown })['dist-tags']`)],
    killed([
      'the-versions-npm-holds-are-every-key-of-the-listing',
      // Measured rather than predicted: a document with no `versions` still carries `dist-tags`, so the
      // fixture written to be refused is accepted instead.
      'an-answer-that-lists-no-versions-is-refused',
    ]),
  ),

  /**
   * The state every first publication is decided in, turned into a refusal.
   *
   * npm says *no such package* until a package exists, so a module that treated 404 as a failure could
   * never publish a first version of anything - and this repository is about to be one of several
   * packages rather than one, on the day a second exists.
   */
  sameOnEveryLens(
    'A-17',
    'refuses a name npm has never heard of instead of reading it as a package with nothing published, ' +
      'so the one answer every first publication meets becomes the one answer that stops a run',
    [npmFile(A_NAME_NPM_DOES_NOT_KNOW_HOLDS_NOTHING, '')],
    killed(['a-name-npm-has-never-heard-of-holds-no-versions']),
  ),

  /**
   * The other half of the same arm, and it fails in the opposite direction: a gateway error carrying a
   * body that happens to parse is read as an answer about what is published.
   */
  sameOnEveryLens(
    'A-18',
    'takes any status as an answer as long as the body parses, so a proxy, a rate limit or a gateway ' +
      'error decides a publication as confidently as the registry would',
    [npmFile(ANYTHING_BUT_AN_ANSWER_IS_REFUSED, '')],
    killed(['a-status-that-is-not-an-answer-is-refused']),
  ),

  sameOnEveryLens(
    'A-19',
    'asks the registry root instead of the package, so what comes back is about something other than ' +
      'this package and every version of it reads as unpublished',
    [npmFile(THE_NAME_IS_PART_OF_THE_ADDRESS, '  const url = `${origin}/`')],
    killed(['the-address-asked-is-the-name-under-the-origin']),
  ),

  // -------------------------------------------------------------------------
  // What decides a deployment
  // -------------------------------------------------------------------------

  /**
   * The one defect of this pair that no status and no refusal would catch: an address read back as a
   * *different* address, silently.
   *
   * `indexing.ts` escapes the ampersand first and this undoes it last, which is the same order read
   * from either end. Undone first, `&amp;lt;` - a sitemap naming an address that holds the four
   * characters `&lt;` - comes back holding `<`. Every count still reconciles and the comparison is
   * about a set that is not the one the origin published.
   */
  sameOnEveryLens(
    'A-20',
    'undoes the ampersand before the other four, so an address holding an escaped entity is read back ' +
      'as a different address and a page that is still served reads as one this tree has dropped',
    [
      originFile(
        THE_AMPERSAND_IS_UNDONE_LAST,
        `    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")`,
      ),
    ],
    killed(['every-address-a-sitemap-names-is-read-back-from-it']),
  ),

  /**
   * The root element unread, which matters for exactly one document and it is one of this protocol's
   * own: a `<sitemapindex>` whose every `<loc>` is the address of another sitemap rather than of a
   * page. Read as a page list it reports that every real address has been dropped.
   *
   * **Measured rather than predicted.** The three other documents this guard is handed - an error page,
   * a feed, a JSON body - carry no `<loc>` at all and stay refused by the count, so this edit reddens
   * on the sitemap index alone.
   */
  sameOnEveryLens(
    'A-21',
    'reads any document carrying a `<loc>` as a sitemap, so a sitemap index - which lists sitemaps and ' +
      'not pages - is taken for the page list and every address the origin serves reads as lost',
    [originFile(A_DOCUMENT_THAT_IS_NOT_A_SITEMAP_IS_REFUSED, '')],
    killed(['a-document-that-is-not-a-sitemap-is-refused']),
  ),

  sameOnEveryLens(
    'A-22',
    'reads a sitemap naming nothing as a site with no pages, so an origin serving an empty listing ' +
      'clears every deployment instead of stopping it',
    [originFile(A_SITEMAP_NAMING_NOTHING_IS_REFUSED, '')],
    killed(['a-sitemap-naming-no-address-is-refused']),
  ),

  /**
   * **The defect this module exists against, and it is A-15's arm pointing the other way.**
   *
   * `theVersionsNpmHolds` reads a 404 as *no such package*, and that is right there: a wrong reading
   * ends in npm refusing the publication, so the failure is a red. The same arm here fails into a
   * green. An origin answering 404 for its own sitemap lists nothing, nothing can then be found
   * missing from it, and the deployment that drops every page at once is cleared by the reading
   * written to refuse it.
   *
   * It is the one cell of this battery that is an *addition* rather than a removal, because the
   * plausible way to write this defect is to copy the arm from the module next door.
   */
  sameOnEveryLens(
    'A-23',
    'copies the neighbouring module\'s 404 arm, so an origin that has no sitemap reads as a site that ' +
      'serves no page - and the one deployment that would drop every address at once is the one this ' +
      'clears',
    [originFile(ONLY_TWO_HUNDRED_IS_AN_ANSWER, `  if (answer.status === 404) return new Set()\n${ONLY_TWO_HUNDRED_IS_AN_ANSWER}`)],
    killed(['a-404-for-a-sitemap-is-refused-and-never-read-as-an-empty-site']),
  ),

  sameOnEveryLens(
    'A-24',
    'takes any status as an answer as long as the body parses, so a gateway error carrying a cached ' +
      'sitemap decides a deployment as confidently as the origin would',
    [originFile(NOTHING_BUT_TWO_HUNDRED_IS_READ, '')],
    killed(['a-status-that-is-not-an-answer-refuses-the-reading']),
  ),

  /**
   * A-15's defect on the second reader of this folder, and the reason both modules are written with
   * the refusal rather than with a fallback: an origin that did not answer and an origin serving
   * nothing are one value once a refusal becomes an empty set, and they decide opposite things.
   */
  sameOnEveryLens(
    'A-25',
    'reads an origin that did not answer as an origin listing nothing, so a network that was down ' +
      'while this ran clears a deployment that drops every page a reader has ever linked to',
    [originFile(AN_ORIGIN_THAT_DID_NOT_ANSWER_IS_REFUSED, `    return new Set()`)],
    killed(['an-origin-that-could-not-be-read-establishes-nothing']),
  ),

  sameOnEveryLens(
    'A-26',
    'asks the origin for its front page instead of its sitemap, so what is parsed is a document that ' +
      'lists nothing and the reading refuses every run for a reason that is not the one it names',
    [originFile(THE_SITEMAP_IS_WHAT_IS_ASKED_FOR, '  const url = `${origin}/`')],
    killed(['the-address-asked-is-the-sitemap-under-the-origin']),
  ),

  /**
   * The comparison run the other way, which is the failure that looks like the guard working.
   *
   * Every ordinary unit of this repository adds a page, so the reversed difference is non-empty on
   * almost every deployment - and it names the addresses being *added*, under a sentence saying they
   * would stop being served. It refuses the runs it should clear and clears the one it should refuse.
   */
  sameOnEveryLens(
    'A-27',
    'reports the addresses this tree writes and the origin does not, so a unit adding a page is ' +
      'refused as one dropping it and a unit dropping a page goes through',
    [
      originFile(
        WHAT_THE_ORIGIN_KEEPS_AND_THIS_TREE_DROPS,
        `): readonly string[] => [...written].filter((address) => !served.has(address))`,
      ),
    ],
    killed(['only-an-address-the-origin-serves-and-this-tree-drops-is-reported']),
  ),

  // -------------------------------------------------------------------------
  // The survivor
  // -------------------------------------------------------------------------

  /**
   * A documented mechanism whose claim turns out to be covered by the mechanism beside it. It stays in
   * `build.ts` for the reason two mechanisms usually stay - they fail on opposite conditions - and this
   * cell is what says that on this repository only one of the two has ever had anything to do.
   */
  sameOnEveryLens(
    'A-13',
    'stops removing the output folder before writing it, which `build.ts` calls the whitelist ' +
      'failing in the one direction a whitelist cannot catch. Measured by planting a file no source ' +
      'produces and building twice: it is gone with the clean and gone without it, because a stale ' +
      'module is one nothing imports and the prune already drops whatever the entry point cannot ' +
      'reach. The two are not independent here - the second dominates the first',
    [buildFile(THE_OUTPUT_FOLDER_IS_REMOVED_FIRST, '')],
    survived('equivalent'),
  ),
]

export const battery: Battery = {
  name: 'packaging',
  contractPath: 'packaging',
  vitestConfig: 'packaging/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'A-08',

  arms: [
    {
      id: 'A',
      ref: 'HEAD',
      convention:
        'the archive as committed: what `npm pack` produces is compiled JavaScript and nothing else, ' +
        'the entry point names one origin, and nothing the compiler emitted that the entry point ' +
        'cannot reach travels with it',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['A'], edits: [] },
  ],

  mutants,

  /**
   * One guard of this folder is about a file in another, so no edit here can redden it.
   *
   * **It was three until the battery was run, and the two that left are the entry it is worth reading
   * this list for.** Both were declared out of reach on an argument about what an edit to `packaging/`
   * can and cannot do, and both were wrong: an archive with no code in it has no module opening a
   * socket, and one compiled with the contracts in it carries a second `https://`. A declaration of
   * unreachability is a claim about a measurement, and this list now holds the one that survived it.
   */
  unreachableGuards: [
    {
      guards: ['the-installed-archive-carries-the-version-this-code-declares'],
      reason:
        'both halves of what it compares are outside this folder - the manifest npm wrote into the ' +
        'installed package, and `THE_PACKAGE_VERSION` in `packages/registry/publication.ts` - and a ' +
        'battery may edit only the folder under measurement',
    },
  ],

  /**
   * Empty, and it is a statement rather than a default.
   *
   * It held one entry until this unit: A-12 reached `two-freezes-of-one-working-tree-are-one-byte-string`
   * and left it green, which turned an unwritten mutant into a measurement about what two freezes of one
   * tree can disagree about. Both the mutant and the guard were about a frozen artefact, and ADR-0092
   * removed them together. Every guard this battery reaches is now one some mutant reddens, and the four
   * it does not reach are declared above with the file each one's failure condition lives in.
   */
  unprobedRegions: [],
}
