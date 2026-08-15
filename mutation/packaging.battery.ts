/**
 * The battery over the archive: what somebody receives, and what must never be in it.
 *
 * It is the nineteenth, and it is the only one whose guards measure something that does not exist in
 * the working tree. Every other battery injects a defect and asks what the suite says about the files
 * beside it; this one injects a defect and asks what `npm pack` produces, what `npm install` puts in
 * somebody else's `node_modules`, and what `toopo` does when it runs out of there. The unit that wrote
 * `packaging/` found three defects that all 999 guards of this repository were blind to for exactly
 * that reason - and then left those fifteen guards with no battery, which is the debt this closes.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * **The bytes somebody installs, first.** A-01 decodes a file's bytes as text before writing them into
 * the artefact, which is the one thing that cannot be caught by reading the archive: the tarball is
 * well formed, the tool starts, the command runs, and the source that lands in the user's project is
 * not the source the registry serves. It is the calibration mutant because it is the defect this whole
 * folder exists to make impossible.
 *
 * **The graph the archive carries.** A-05 to A-08 and A-14 are ways of getting the wrong set of files
 * into a tarball, and they fail in opposite directions on purpose: some ship modules nothing loads,
 * some drop modules the tool needs. `reachable.ts` says in as many words that the walk and the guard
 * are two mechanisms rather than one statement twice, and these are the cells that say so.
 *
 * **The catalogue a published `toopo` serves from.** A-02, A-03, A-09 and A-11 each leave the archive
 * carrying an artefact that answers something the registry does not - a snapshot missing, an index
 * trimmed to what can be installed, a binding under the wrong key, a list reordered. `freeze.ts` is a
 * transcript of the installer's own walk, and these are the cells that check the transcript.
 *
 * **The refusal that stops a build.** A-04 removes the one place this repository refuses to package a
 * registry that contradicts itself. An archive built around that hole would refuse at the moment
 * somebody installs something, which is the worst possible place to find out.
 *
 * ---------------------------------------------------------------------------
 * What this battery cannot reach, and it is most of what is left
 * ---------------------------------------------------------------------------
 *
 * A battery edits one folder. Five of the fifteen guards here are about files in three other places -
 * the repository's own `package.json`, `packages/cli/artefact.ts`, and the compiled closure of
 * `packages/cli/published.ts` - so no edit to `packaging/` can redden them whatever it does. That is a larger
 * share than any other battery declares, and it is a fact about this folder rather than about these
 * guards: `packaging/` is four modules, and what they are guarded against lives upstream of all four.
 * Each one is named below with the file its failure condition sits in.
 *
 * ---------------------------------------------------------------------------
 * Two survivors, both measured rather than argued
 * ---------------------------------------------------------------------------
 *
 * A-12 and A-13 are the cells that took the longest and are worth reading before the killers. Each
 * removes something `packaging/` documents as load-bearing, and in each case the measurement says the
 * claim is narrower than the comment. Neither is a hole; both are recorded with what was compared
 * against what, which is what `published.ts` requires of a survivor before a page may show it.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, survived } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'A', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const freezeFile = (find: string, replace: string) => ({ file: 'freeze.ts', find, replace })
const buildFile = (find: string, replace: string) => ({ file: 'build.ts', find, replace })
const reachableFile = (find: string, replace: string) => ({ file: 'reachable.ts', find, replace })
const distConfig = (find: string, replace: string) => ({ file: 'tsconfig.dist.json', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const A_FILE_TRAVELS_AS_BYTES = `  base64: blob.bytes.toString('base64'),`

const A_SNAPSHOT_IS_REMEMBERED = `        const answer = source.snapshot(digest)
        if (answer !== null) snapshots.set(digest, answer)`

const A_BINDING_IS_KEYED_BY_ITS_ADDRESS = `        bindings.set(renderContract(address), { contract: renderContract(address), bindings: answer })`

const THE_INDEX_IS_CARRIED_WHOLE = `  const index = source.contractIndex()`

/**
 * The refusal that stops a build, which moved when `freeze.ts` learnt to warm before it records.
 *
 * It used to throw from inside the loop over a holding's files. The walk is replayed by the fixpoint
 * now, so it answers `Found` instead - a round run against a cache holding nothing has to be able to
 * refuse harmlessly, where an exception would end the build on the first round of its own warming.
 * The anchor moved with it and the defect did not: `source.blob` is still called for every file, so
 * the recording is untouched and what the edit removes is only the refusal.
 */
const A_FILE_THE_REGISTRY_DOES_NOT_SERVE_STOPS_THE_BUILD = `  if (unserved.length > 0) return { faults: unserved }`

const A_LIST_IS_WRITTEN_IN_ITS_OWN_ORDER = `  [...entries].sort((a, b) => (keyOf(a) < keyOf(b) ? -1 : 1))`

const THE_OUTPUT_IS_WALKED_TO_THE_BOTTOM = `    return statSync(full).isDirectory() ? every(full) : [full]`

const THE_WALK_STARTS_AT_THE_COMPILED_ENTRY_POINT = `const reachable = reachableFrom(join(DIST, 'packages', 'cli', 'published.js'))`

const WHAT_THE_ENTRY_POINT_CANNOT_REACH_IS_DROPPED = `const dropped = every(DIST).filter((file) => !reachable.has(file))`

const THE_CATALOGUE_IS_WRITTEN_BESIDE_THE_CODE = `writeFileSync(join(DIST, ARTEFACT_FILE), text, 'utf8')`

const THE_OUTPUT_FOLDER_IS_REMOVED_FIRST = `rmSync(DIST, { recursive: true, force: true })`

const A_SPECIFIER_THAT_LEAVES_THE_FOLDER_IS_SEEN = `  ...[...text.matchAll(/(?:^|[\\s,{;])from\\s*['"](\\.[^'"]*)['"]/g)].map((match) => match[1] as string),`

const ONLY_THE_ENTRY_POINT_IS_COMPILED = `  "include": [],`

/**
 * The prune disabled, which the two mutants that widen the compiler's program need beside it.
 *
 * It is here rather than a cell of its own because A-05 already reddens the guard it would redden, by
 * the more likely route: a walk that does not descend is a slip, and removing the decision to prune is
 * not. What A-08 and A-14 are about is the pair - a build that compiles more than the entry point
 * *and* ships whatever the compiler emitted - so the edit belongs to those mutants.
 */
const NOTHING_IS_DROPPED = buildFile(
  WHAT_THE_ENTRY_POINT_CANNOT_REACH_IS_DROPPED,
  `const dropped = every(DIST).filter(() => false)`,
)

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

const mutants: readonly Mutant[] = [
  /**
   * The calibration mutant, and the defect the folder exists for.
   *
   * `artefact.ts` says a blob travels as base64 because the catalogue holds a lone surrogate on
   * purpose. Reading those bytes as text instead produces an archive that packs, installs, starts and
   * answers - and writes something into the user's project that is not what the registry serves.
   */
  sameOnEveryLens(
    'A-01',
    'writes a file into the artefact as text rather than as bytes, so the archive installs, the ' +
      'command succeeds, and what lands in somebody else\'s project is not the source the registry ' +
      'serves',
    [freezeFile(A_FILE_TRAVELS_AS_BYTES, `  base64: blob.bytes.toString('utf8'),`)],
    killed([
      'an-archive-installs-a-feature-whose-bytes-are-the-catalogues',
      'the-lockfile-an-archive-writes-records-the-digest-the-registry-served',
      'every-file-an-installation-needs-is-served-as-the-bytes-it-was-frozen-from',
    ]),
  ),

  sameOnEveryLens(
    'A-02',
    'fetches every snapshot the walk asks for and remembers none of them, so the archive carries the ' +
      'files an installation needs and nothing that says which contract they belong to',
    [freezeFile(A_SNAPSHOT_IS_REMEMBERED, `        const answer = source.snapshot(digest)`)],
    killed([
      'an-archive-installs-a-feature-whose-bytes-are-the-catalogues',
      'the-lockfile-an-archive-writes-records-the-digest-the-registry-served',
      'the-packaged-source-answers-what-the-local-source-answers',
      'every-file-an-installation-needs-is-served-as-the-bytes-it-was-frozen-from',
    ]),
  ),

  /**
   * The index trimmed to what can be installed, which is the shape somebody reaches for when they
   * notice the artefact carries an entry with no binding behind it. What it takes away is the whole of
   * what a published `toopo` can say about a contract this catalogue turned down.
   */
  sameOnEveryLens(
    'A-03',
    'carries only the installable half of the index, so a published `toopo` cannot say that a ' +
      'contract was refused - it can only fail to find it, which is what it answers for a name that ' +
      'was never submitted',
    [
      freezeFile(
        THE_INDEX_IS_CARRIED_WHOLE,
        `  const index = {
    ...source.contractIndex(),
    entries: source.contractIndex().entries.filter((entry) => entry.installable),
  }`,
      ),
    ],
    killed([
      'the-packaged-source-answers-what-the-local-source-answers',
      'a-refused-contract-is-carried-as-a-refusal-and-never-as-something-to-install',
    ]),
  ),

  sameOnEveryLens(
    'A-04',
    'builds the archive around a registry that does not serve a file it says it holds, so the refusal ' +
      'moves from the person building the archive to the person installing out of it',
    [freezeFile(A_FILE_THE_REGISTRY_DOES_NOT_SERVE_STOPS_THE_BUILD, `  if (false) return { faults: unserved }`)],
    killed(['a-registry-that-serves-no-bytes-stops-the-build']),
  ),

  /**
   * The four ways the archive carries the wrong set of files. A-05 and A-08 ship what nothing loads;
   * A-06 and A-07 drop what the tool needs. Both directions matter, and `reachable.ts` says why: a
   * walk wrong in either direction has to be caught here rather than confirmed by the other mechanism.
   */
  sameOnEveryLens(
    'A-05',
    'walks the compiler\'s output without descending into it, so every module under `dist/cli/` and ' +
      '`dist/registry/` is outside what the prune can consider and the six the compiler emits for a ' +
      'type nobody loads ship again',
    [buildFile(THE_OUTPUT_IS_WALKED_TO_THE_BOTTOM, `    return statSync(full).isDirectory() ? [] : [full]`)],
    killed(['every-file-in-the-archive-is-loaded-by-a-command']),
  ),

  sameOnEveryLens(
    'A-06',
    'prunes the compiled output against the graph of the *sources*, so no emitted file is ever ' +
      'reachable and the archive ships the catalogue with no code at all - a tarball npm accepts, ' +
      'installs, and writes a shim for',
    [
      buildFile(
        THE_WALK_STARTS_AT_THE_COMPILED_ENTRY_POINT,
        `const reachable = reachableFrom(join(REPOSITORY, 'packages', 'cli', 'published.ts'))`,
      ),
    ],
    killed([
      'an-archive-installs-a-feature-whose-bytes-are-the-catalogues',
      'the-lockfile-an-archive-writes-records-the-digest-the-registry-served',
      'npm-writes-a-shim-for-the-command-the-site-tells-people-to-run',
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
      'an-archive-installs-a-feature-whose-bytes-are-the-catalogues',
      'the-lockfile-an-archive-writes-records-the-digest-the-registry-served',
      'every-file-in-the-archive-is-loaded-by-a-command',
    ]),
  ),

  /**
   * The archive carrying the catalogue and its suite, which is what the guard it reddens is named for.
   *
   * The route is not the one the guard was written against, and that is said rather than glossed:
   * `archive.test.ts` argues that the day somebody widens `files` in `package.json` to ship the
   * contracts - which permanent rule 5 can be read as asking for - the reachability guard is the one
   * they would edit and this is the one that would still be there. `files` is not in this folder. What
   * an edit here can do is reach the same tarball from the other side, by compiling the contracts into
   * the program and shipping what the compiler emitted, so that is what this does.
   */
  sameOnEveryLens(
    'A-08',
    'compiles the catalogue into the archive and ships what the compiler emitted, so every contract ' +
      'and every one of its test files travels into somebody\'s `node_modules` - the whole suite, ' +
      'loaded by nothing, in a package whose reason for existing is that it is small',
    [distConfig(ONLY_THE_ENTRY_POINT_IS_COMPILED, `  "include": ["../contracts/**/*.ts"],`), NOTHING_IS_DROPPED],
    killed([
      'every-file-in-the-archive-is-loaded-by-a-command',
      'no-part-of-the-instrument-or-of-the-suite-is-in-the-archive',
    ]),
  ),

  sameOnEveryLens(
    'A-09',
    'keys a contract\'s bindings by its name rather than by its address, so `number/parse@2` would ' +
      'one day answer for `number/parse@1` and today nothing answers at all',
    [
      freezeFile(
        A_BINDING_IS_KEYED_BY_ITS_ADDRESS,
        `        bindings.set(address.name, { contract: address.name, bindings: answer })`,
      ),
    ],
    killed([
      'an-archive-installs-a-feature-whose-bytes-are-the-catalogues',
      'the-lockfile-an-archive-writes-records-the-digest-the-registry-served',
      'the-packaged-source-answers-what-the-local-source-answers',
    ]),
  ),

  sameOnEveryLens(
    'A-10',
    'compiles the code and never writes the catalogue beside it, so the archive is a `toopo` that ' +
      'starts, prints its usage, and can install nothing - the state `readArtefact` calls a defect in ' +
      'the archive rather than anything the user did',
    [buildFile(THE_CATALOGUE_IS_WRITTEN_BESIDE_THE_CODE, '')],
    killed([
      'an-archive-installs-a-feature-whose-bytes-are-the-catalogues',
      'the-lockfile-an-archive-writes-records-the-digest-the-registry-served',
    ]),
  ),

  /**
   * The sort applied one level too far, which is the mutant that separates the two claims `byKey`
   * makes. Sorting the artefact's *own* lists is invisible to a consumer, because every one of them is
   * turned back into a map; sorting the index is not, because the index is a list a consumer reads in
   * order. It is the only defect here that reddens one guard and nothing else.
   */
  sameOnEveryLens(
    'A-11',
    'sorts the index the archive carries, so a published `toopo` lists the catalogue in an order the ' +
      'registry that served it never used - the argument for sorting the walk\'s own output, applied ' +
      'to a list whose order is somebody\'s decision',
    [
      freezeFile(
        THE_INDEX_IS_CARRIED_WHOLE,
        `  const index = {
    ...source.contractIndex(),
    entries: byKey(source.contractIndex().entries, (entry) => entry.address.name),
  }`,
      ),
    ],
    killed(['the-packaged-source-answers-what-the-local-source-answers']),
  ),

  /**
   * The generator inside the archive, and the cell that makes a repair to `archive.test.ts`
   * replayable rather than remembered.
   *
   * That guard reads six conditions, and until this unit two of them were anchored at the start of the
   * path. `files` is `["dist"]`, so npm reports everything as `dist/...`, and `startsWith('packages/site/')`
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
  // The two survivors
  // -------------------------------------------------------------------------

  /**
   * `freeze.ts` says the sort exists so that two builds of one working tree produce one byte string,
   * and that a digest which moves for no reason is an immutability defect this repository has already
   * found twice. Measured, the second half of that sentence is the load-bearing one and the first is
   * not: the walk is deterministic without any sorting at all.
   */
  sameOnEveryLens(
    'A-12',
    'writes the artefact\'s three lists in the order the walk happened to take. Measured by building ' +
      'twice: the archive is 29 606 bytes either way and the two byte strings differ, so what the ' +
      'sort changes is which order that one string is in - and nothing published promises it. The ' +
      'guard that compares two freezes stays green because both take the same walk, and what the sort ' +
      'insures against is an order that is a fact about the walk rather than about the catalogue',
    [freezeFile(A_LIST_IS_WRITTEN_IN_ITS_OWN_ORDER, `  [...entries]`)],
    survived('outside-what-the-contract-specifies'),
  ),

  /**
   * The other half of the same shape: a documented mechanism whose claim turns out to be covered by
   * the mechanism beside it. It stays in `build.ts` for the reason two mechanisms usually stay - they
   * fail on opposite conditions - and this cell is what says that on this repository only one of the
   * two has ever had anything to do.
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
  calibrationMutant: 'A-01',

  arms: [
    {
      id: 'A',
      ref: 'HEAD',
      convention:
        'the archive as committed: what `npm pack` produces is compiled JavaScript and one frozen ' +
        'artefact, the walk that freezes it is the installer\'s own, and nothing the compiler emitted ' +
        'that the entry point cannot reach travels with it',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['A'], edits: [] },
  ],

  mutants,

  /**
   * Five guards of this folder are about files in three others, so no edit here can redden them.
   *
   * It is a third of the suite, which is more than any other battery declares out of reach, and the
   * reason is structural rather than a gap in these mutants: `packaging/` is four modules, and what
   * this suite is written to catch happens upstream of all four. A guard is filed here only when the
   * *file its failure condition lives in* is outside `packaging/` - never because a mutant for it was
   * hard to write.
   */
  unreachableGuards: [
    {
      guards: ['the-archive-is-visibly-unpublished'],
      reason:
        'it reads the repository\'s own `package.json` against `THE_UNPUBLISHED_VERSION` in ' +
        '`packages/cli/local-source.ts`, and a battery may edit only the folder under measurement',
    },
    {
      guards: [
        'an-artefact-of-a-format-this-toopo-does-not-read-is-refused',
        'an-artefact-missing-any-field-is-refused-naming-what-is-missing',
        'an-artefact-that-is-not-there-is-refused-with-the-sentence-a-user-can-act-on',
      ],
      reason:
        'each asks what `packages/cli/artefact.ts` refuses, and that file is what a published `toopo` reads ' +
        'the catalogue with rather than anything this folder writes it with',
    },
    {
      guards: ['the-archive-reaches-no-network'],
      reason:
        'the archive\'s JavaScript is the compiled closure of `packages/cli/published.ts`, and no module of ' +
        'this repository that any program compiles reaches a socket - measured, the one `fetch(` ' +
        'here is in `packages/validation/fixtures/refused.ts`, which is excluded from every program because ' +
        'most of what it does is a type error as well as a refusal. So widening what the build ' +
        'compiles cannot put a networked module in the archive, and what would redden this is an ' +
        'import `packages/cli/` would have to gain',
    },
  ],

  /**
   * One region, and it is the only guard here a mutant reached without reddening.
   *
   * A-12 removes the sort and this guard stays green, which is what turns it from an unwritten mutant
   * into a measurement. What it compares is two freezes of one working tree, and both take the same
   * walk in the same order whether anything sorts or not - so the comparison is blind to which order
   * that is. What would redden it is a freeze whose order depends on something outside the tree: a
   * clock, or a random source. Those are the two names `packages/validation/` refuses to let a submission read,
   * and writing one into `packaging/` to reach a guard would be arranging the defect to suit the
   * instrument.
   */
  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'A-12 reaches it and leaves it green: two freezes of one tree take one walk, so nothing that ' +
        'reorders the walk\'s output can make them disagree, and only a non-deterministic freeze could',
      guards: ['two-freezes-of-one-working-tree-are-one-byte-string'],
    },
  ],
}
