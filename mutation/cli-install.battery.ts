/**
 * The battery over `toopo init` and `toopo add`.
 *
 * **This is the first thing in the repository that writes into somebody else's project**, which makes
 * it the worst possible place to have a suite that has never been shown able to fail. Everything above
 * it - a contract, a record, a snapshot, a rule - is read by somebody who chose to read it; this copies
 * files onto a disk and edits a lockfile, and a defect here is a defect in the one part of the product
 * a user cannot inspect before it runs.
 *
 * It injects into `cli/` and collects under that folder's own configuration, for the reasons
 * `registry-storage` and `validation-stage-1` already record and one of its own: every guard here
 * writes files, and a suite that writes at all, collected by the suite the instrument runs a hundred
 * times, would be a hundred rounds of file system activity attached to measurements about parsing
 * numbers.
 *
 * One arm and one lens. The two fallible contracts carry a second arm because an error convention was
 * under measurement there; nothing here has a convention to compare, and a second lens would be a
 * question nobody is asking yet.
 *
 * ---------------------------------------------------------------------------
 * What the mutants are aimed at
 * ---------------------------------------------------------------------------
 *
 * The three mechanisms that make this unit worth building, and each of them is a decision an installer
 * could get quietly wrong. **Where a file lands** - the entry file named after its feature, the shared
 * blob written once, two versions of one feature refused. **What an import points at afterwards** -
 * the one rule that covers both reasons a file moves, and the three spellings that name one file.
 * **What is checked on arrival** - the two functions `response.ts` refused to describe rather than
 * provide, and the two digests a rewritten file makes necessary.
 *
 * Beside them, three refusals that protect somebody's project rather than the arithmetic: a file we did
 * not write, a file the user edited, and a contract the catalogue publicly turned down.
 *
 * ---------------------------------------------------------------------------
 * The blind spot, named rather than left to be found
 * ---------------------------------------------------------------------------
 *
 * **The order files are written in is not measured.** `commitInstallation` walks the plan, and the plan
 * is dependencies-first so that a project caught between two writes never holds a file importing
 * something that is not there yet. A mutant reversing that loop survives every guard here: the order of
 * the *plan* is asserted, and the order of the *writes* is observable only by interrupting the process
 * between two of them. It is the same window `breakage.ts` declares as breaking badly, and the repair
 * is the same one - write through a temporary file and rename - so the mutant is not written until
 * there is something for it to redden.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const planFile = (find: string, replace: string) => ({ file: 'plan.ts', find, replace })
const rewriteFile = (find: string, replace: string) => ({ file: 'rewrite.ts', find, replace })
const installFile = (find: string, replace: string) => ({ file: 'install.ts', find, replace })
const localFile = (find: string, replace: string) => ({ file: 'local-source.ts', find, replace })
const relocateFile = (find: string, replace: string) => ({ file: 'relocate.ts', find, replace })
const removalFile = (find: string, replace: string) => ({
  file: 'remove-directory.ts',
  find,
  replace,
})

/**
 * What an install asks a registry for, and how each answer is checked.
 *
 * It was inside `install.ts` when this battery was written and moved to `resolve.ts` when `toopo
 * update` turned out to need every one of those steps unchanged. Four edits moved with it and not one
 * verdict did - which is the shape a refactor should have, and which the instrument established rather
 * than the diff: it refused the whole run on the first anchor that no longer matched, exactly as it
 * exists to.
 */
const resolveFile = (find: string, replace: string) => ({ file: 'resolve.ts', find, replace })

/**
 * The implementation of the port that talks to something this process does not own.
 *
 * It is measured from this battery rather than from a fifth one because what its defects break is an
 * *install*: every cell below is a way for the wrong bytes, or no bytes, to reach somebody's folder,
 * which is the subject this battery already has.
 */
const httpSourceFile = (find: string, replace: string) => ({ file: 'http-source.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const THE_ENTRY_FILE_IS_RENAMED = `const destinationOf = (contractName: string, file: string): string =>
  file === THE_ENTRY_FILE
    ? \`\${contractName}/\${actionOf(contractName)}.ts\`
    : \`\${contractName}/\${file}\``

const A_SHARED_BLOB_IS_FOUND_BY_DIGEST = `      const shared = isEntry ? undefined : placedByDigest.get(served.sha256)`

// ---------------------------------------------------------------------------
// The folder moving, which is the other half of `toopo init`
// ---------------------------------------------------------------------------

const WHAT_IS_CARRIED_ACROSS = `    .filter((move) => move.bytes !== null)`

const THE_LOCKFILE_TRAVELS_UNCHANGED = `    ? { moving: { relocation: planned.relocation, lockfile } }`

const EVERY_CLAIMED_FILE_IS_CONSIDERED = `      moves.push({
        path: file.path,`

const OUR_OWN_BYTES_AT_THE_DESTINATION = `  if (destination === source) return 'already-moved'`

const A_FREE_DESTINATION = `  if (destination === null) return 'moved'`

const ONLY_WHAT_EXISTS_ELSEWHERE_IS_TAKEN = `  relocation.moves.filter((move) => move.verdict !== 'not-on-disk').map((move) => move.path)`

const THE_FOLDER_IS_ACTUALLY_CHANGING = `  if (held === null || lockfile === null || held.directory === to.directory) {`

const A_FOLDER_IS_ABANDONED_OR_NOT = `  if (leaving === null) return null`

const AN_ABANDONED_FOLDER_GOES_ONLY_IF_EMPTY = `    rmdirSync(join(root, leaving))`

const THE_REFUSAL_COMES_FIRST = `      if ('faults' in change) refuse(change.faults)`

const EVERY_FILE_THAT_MOVED_IS_NAMED = `    ...moved.map((move) => \`\${INDENT}  ~ \${move.path}\`),`

const THE_IMPORTS_ARE_THE_USERS = `      \`Imports in your own code naming \${relocation.from}/ have to be changed to \` +`

const A_FOLDER_LEFT_BEHIND_IS_NAMED = `    ...(leftBehind === null
      ? []`

const A_SECOND_VERSION_IS_SEEN = `    const already = seenContracts.get(contract)`

const A_DESTINATION_IS_REMEMBERED = `        placedByPath.set(path, served.sha256)`

const A_SPECIFIER_IS_JAVASCRIPT = `  const asJavaScript = relative.replace(/\\.ts$/, '.js')`

const A_SIBLING_IS_EXPLICIT = `  return asJavaScript.startsWith('.') ? asJavaScript : \`./\${asJavaScript}\``

const RELATIVE_MEANS_BOTH = `const isRelative = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')`

const THREE_SPELLINGS = `  const candidates = [target, target.replace(/\\.js$/, '.ts'), \`\${target}.ts\`]`

const A_BLOB_IS_CHECKED = `    const blobFaults = servedBlobFaults(answer)`

const A_SNAPSHOT_IS_CHECKED = `  const faults = servedSnapshotFaults(answer)`

const A_SNAPSHOT_DECLARES_WHAT_WAS_ASKED_FOR = `  const misdeclared = declarationFaults(parsed.frozen, address)`

const TWO_EDGES_ON_ONE_ADDRESS_AGREE = `      if (already.digest !== edge.digest && !disagreed.has(what)) {`

const A_FAILURE_IS_NOT_AN_ABSENCE = `    if (!response.ok) throw new TheRegistryDidNotAnswer(origin, question, String(response.status))`

const A_BLOB_IS_ADDRESSED_BY_THE_QUESTION = `      return { addressing: 'content-addressed', addressedBy: sha256, bytes }`

const AN_ADDRESS_IS_ASKED_FOR_AS_IT_IS_RENDERED =
  '  pathTo(endpointOf(THE_ENDPOINT_BEHIND[question.method]), addressAsked(question))'

/**
 * The import block of `http-source.ts`, so that a cell can give it something it deliberately lacks.
 *
 * Addressing a file by what arrived means hashing what arrived, and this module imports no hash on
 * purpose - the digest it uses is the one it asked with. So the mutant needs two edits, and needing
 * them is itself a fact about the design worth leaving visible here.
 */
const WHAT_THIS_MODULE_MAY_HASH = `import type {
  ServedImplementationBinding,`

const WHAT_WAS_WRITTEN_IS_HASHED = `      files.push({ path: file.path, served: file.served, sha256, bytes: bytes.byteLength })`

const A_FILE_WE_DID_NOT_WRITE = `      if (onDisk === wouldWrite.get(file.path)) alreadyOnDisk.add(file.path)`

const AN_OLD_LOCKFILE_NAMES_WHAT_TO_TYPE = `      (names.length === 0 ? '' : \`\\n\${names.map((name) => \`  toopo add \${name}\`).join('\\n')}\`),`

const A_FILE_HOLDING_OUR_BYTES_IS_CLAIMED = `    if (held === undefined) {`

const AN_EDITED_FILE = `    if (held.sha256 !== onDisk) {`

const A_FEATURE_CLAIMS_ITS_FILES = `      files,
      installedAt: request.at,`

const A_REFUSED_CONTRACT_IS_REFUSED = `      ledger = refuseContract(ledger, {
        address: record.address,
        decidedAgainst: record.lifecycle.decidedAgainst,
        measurement: record.lifecycle.measurement,
        keptAs: record.lifecycle.keptAs,
        decidedOn: THE_UNPUBLISHED_INSTANT,
      })`

const THE_VERSION_IS_VISIBLY_FALSE = `export const THE_UNPUBLISHED_VERSION = '0.0.0-local'`

const THE_LAST_IMPORT_OF_THE_PLAN = `import type { FrozenImplementation } from '../registry/snapshot.js'`

const AN_UNKNOWN_SETTING_IS_REFUSED = `    ...Object.keys(held)
      .filter((key) => key !== 'version' && key !== 'directory')`

const A_FLAG_NEEDS_A_VALUE = `    const given = value !== undefined && !value.startsWith('--')`

const THE_INDEX_ENDPOINT = `  contractIndex: 'contract-index',`

const THE_SNAPSHOT_ENDPOINT = `  snapshot: 'snapshot',`

const AN_UNKNOWN_COMMAND = '  return { faults: [`\\`${command}\\` is not a command this \\`toopo\\` has`] }'

const A_STRAY_WORD_IS_REFUSED = `    if (!word.startsWith('--')) {
      faults.push(\`\\\`\${word}\\\` is not a flag, and this command takes no further argument\`)
      continue
    }`

/**
 * The two refusals moved into `contractThenFlags` when `remove` arrived, and they are now written
 * once for both commands with the verb interpolated.
 *
 * A defect here is therefore twice the defect it was - it reaches `toopo add` and `toopo remove`
 * alike - and C-25 reddens both guards for it. Repointed rather than rewritten: the sentence is the
 * same sentence and the mistake it refuses is the same mistake.
 */
const A_CONTRACT_COMES_FIRST = `  if (contract === undefined) return { faults: [\`\\\`\${verb}\\\` needs the name of a contract\`] }
  if (contract.startsWith('--')) {
    return { faults: [\`\\\`\${verb}\\\` needs the name of a contract before any flag\`] }
  }`

const NOTHING_IS_A_COMMAND = `  if (command === undefined) return { faults: ['no command was given'] }`

const A_FLAG_KEEPS_ITS_VALUE = `    values[name] = value as string`

const INIT_TAKES_NO_DIRECTORY_BY_DEFAULT = `    return { command: { name: 'init', directory: flags.values['dir'] ?? null } }`

const THE_VERSION_IS_ONE = `    ...(held['version'] === 1`

const A_DIRECTORY_TRAVELS = `const DIRECTORY = /^[A-Za-z0-9._-]+(?:\\/[A-Za-z0-9._-]+)*$/`

const NO_FILE_MEANS_NO_CONFIGURATION = `  if (!existsSync(path)) return null`

const A_BROKEN_FILE_IS_REFUSED = `  } catch {
    throw new UnusableConfiguration([\`\${CONFIGURATION_FILE} is not JSON\`])
  }`

const THE_PROPOSAL_READS_THE_PROJECT = `export const proposeDirectory = (root: string): string =>
  existsSync(join(root, 'src')) ? 'src/lib/toopo' : 'lib/toopo'`

// The anchor moved when `writeConfiguration` gained the staging destination `write.ts` needs, and it
// follows the line rather than the argument list, which is what a `find` of one statement is for.
const THE_WHOLE_CONFIGURATION_IS_WRITTEN =
  "  writeFileSync(to, `${JSON.stringify(configuration, null, 2)}\\n`, 'utf8')"

const THE_ORPHAN_LOCKFILE_IS_REFUSED = `  if (anythingInstalled) {`

const A_CONFIGURATION_THAT_EXISTS_IS_KEPT =
  `  if (held !== null) return { configuration: held, write: false }`

const NOT_IGNORED_IS_AN_ANSWER = `  if (done.status === CHECK_IGNORE.NOT_IGNORED) return false`

const THE_FEATURES_ARE_VALIDATED = `    ? features.flatMap(featureFaults)`

const A_CLEAN_REFUSAL_NAMES_ITS_GUARD = `    verdict: 'refused-cleanly',
    guard: 'a-file-we-did-not-write-is-never-overwritten',`

const A_NAME_THE_INDEX_DOES_NOT_HOLD =
  '  if (first === undefined) return { faults: [`the registry holds no contract called \\`${typed}\\``] }'

/**
 * The walk's refusal, which moved a line when edges began carrying a digest.
 *
 * It used to be a sentence of its own, built where the binding lookup failed - and that lookup is the
 * round trip an edge's digest removes. What is left is the one place the walk can refuse at all: what
 * `heldAt` answered about the address it was sent to.
 */
const A_MISSING_EDGE_IS_NAMED = `      faults.push(...answer.faults)
      continue`

const WHAT_IS_WRITTEN_IS_WHAT_ARRIVED = `        Buffer.from(rewritten.sources.get(file.servedAt) as string, 'utf8'),`

const THE_ORDER_IS_THE_RESOLUTIONS = `  for (const held of order) {`

const THE_CARRIERS_ARE_NAMED = `  return [...carriers].map(([path, alsoCarriedBy]) => ({ path, alsoCarriedBy }))`

const A_KILOBYTE_IS_A_THOUSAND = '  bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} kB`'

/**
 * The two lines whose *order* is the claim, rather than the whole function.
 *
 * It used to anchor on all of `renderRefusal`, and `toopo search` moved that body: a fault carrying
 * its own newlines is laid out rather than reflowed, so the refusal that names a command to type
 * hands the reader a line they can copy. Anchoring on the sentence and the flatMap that follows it
 * survives that, and it is what C-43 is actually about.
 */
const A_REFUSAL_ANSWERS_FIRST = `    \`\${INDENT}Refused, and nothing was written.\`,
    '',
    ...faults.flatMap((fault) => [`

const A_SPECIFIER_THAT_NAMES_NOTHING = `            if (servedAt === null) {
              faults.push(
                \`\${source.servedAt} imports \\\`\${written}\\\`, and no file of this install is served at \` +
                  \`that path - so it would land pointing at nothing.\`,
              )
              continue
            }`

// Guards several mutants name, written once because a string repeated is a rename away from being
// wrong twice.
const THE_TREE = 'the-graph-lands-as-a-tree-of-features'
const THE_IMPORTS = 'an-installed-file-imports-what-was-installed'
const THE_TWO_DIGESTS = 'the-lockfile-holds-what-was-served-and-what-was-written'
const THE_FIVE_LAND = 'each-of-the-five-installs-one-file-named-after-itself'

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'C-01',
    'leaves the entry file called `reference.ts`, so every feature a user installs opens a tab with ' +
      'the same name and none of them says what it holds',
    [
      planFile(
        THE_ENTRY_FILE_IS_RENAMED,
        `const destinationOf = (contractName: string, file: string): string =>
  \`\${contractName}/\${file}\``,
      ),
    ],
    // Nine guards redden; the four named are the ones written for the layout, and they are what a
    // single edit to this function takes away.
    killed(['an-entry-file-is-named-after-its-feature', THE_TREE, THE_IMPORTS, THE_FIVE_LAND]),
  ),

  sameOnEveryLens(
    'C-02',
    'copies a shared file into every folder that carries it, so a feature two others depend on is ' +
      'written twice and the user maintains two copies of one file',
    [planFile(A_SHARED_BLOB_IS_FOUND_BY_DIGEST, `      const shared = undefined`)],
    killed(['a-shared-file-is-written-once-and-still-appears-in-the-plan', THE_TREE]),
  ),

  sameOnEveryLens(
    'C-03',
    'deduplicates the entry file too, so two features that answered byte for byte would leave one ' +
      'folder with no file named after it and an import pointing into somebody else\'s',
    [planFile(A_SHARED_BLOB_IS_FOUND_BY_DIGEST, `      const shared = placedByDigest.get(served.sha256)`)],
    killed(['an-entry-file-is-never-deduplicated']),
  ),

  sameOnEveryLens(
    'C-04',
    'stops noticing that one contract is asked for twice, so two versions of one feature both land ' +
      'and whichever dependent asked for the first silently gets the second',
    [planFile(A_SECOND_VERSION_IS_SEEN, `    const already = seenContracts.get('nothing is ever called this')`)],
    killed(['two-versions-of-one-feature-are-refused', 'two-versions-of-one-feature-are-refused-before-anything-is-written']),
  ),

  sameOnEveryLens(
    'C-05',
    'forgets which destinations are taken, so two different files land on one path and the project ' +
      'holds code no lockfile describes',
    [planFile(A_DESTINATION_IS_REMEMBERED, `        void path`)],
    killed(['two-different-files-on-one-destination-are-refused']),
  ),

  sameOnEveryLens(
    'C-06',
    'writes a repointed specifier with the `.ts` extension the catalogue compiles from rather than ' +
      'the `.js` a published source resolves, so the installed file imports something node cannot find',
    [rewriteFile(A_SPECIFIER_IS_JAVASCRIPT, `  const asJavaScript = relative`)],
    killed(['a-renamed-entry-file-is-repointed', 'a-shared-blob-is-repointed-across-features', 'the-three-spellings-of-one-file-all-resolve', THE_IMPORTS]),
  ),

  sameOnEveryLens(
    'C-07',
    'drops the `./` from a sibling specifier, which is a bare specifier and therefore a package',
    [rewriteFile(A_SIBLING_IS_EXPLICIT, `  return asJavaScript`)],
    killed(['an-unchanged-specifier-is-left-alone']),
  ),

  sameOnEveryLens(
    'C-08',
    'reads only `./` as relative, so every import of another feature - which is always `../../` - is ' +
      'refused as though it were a package',
    [rewriteFile(RELATIVE_MEANS_BOTH, `const isRelative = (specifier: string): boolean =>
  specifier.startsWith('./')`)],
    // Six guards redden; the two named are the ones about an import between features, which is the
    // whole of what this reader is for.
    killed(['a-renamed-entry-file-is-repointed', THE_IMPORTS]),
  ),

  sameOnEveryLens(
    'C-09',
    'reads every specifier as relative, so a package import is answered "no file of this install is ' +
      'served there" instead of by the rule that actually forbids it',
    [rewriteFile(RELATIVE_MEANS_BOTH, `const isRelative = (specifier: string): boolean => {
  void specifier

  return true
}`)],
    killed(['an-import-of-something-outside-the-registry-is-refused']),
  ),

  sameOnEveryLens(
    'C-10',
    'stops resolving the extensionless spelling of a file, so an author who wrote `./digits` has ' +
      'their submission refused for a spelling a bundler resolves',
    [rewriteFile(THREE_SPELLINGS, `  const candidates = [target, target.replace(/\\.js$/, '.ts')]`)],
    killed(['the-three-spellings-of-one-file-all-resolve']),
  ),

  sameOnEveryLens(
    'C-11',
    'stops checking that a file is the bytes its digest names, which is the check content addressing ' +
      'exists for and the one a consumer skips when it is described rather than provided',
    [resolveFile(A_BLOB_IS_CHECKED, `    const blobFaults: readonly string[] = []`)],
    killed(['a-blob-that-is-not-what-its-address-names-is-refused']),
  ),

  sameOnEveryLens(
    'C-12',
    'stops checking that a snapshot is what its digest was taken over, so a registry may answer any ' +
      'file list it likes under an address a lockfile pinned',
    [resolveFile(A_SNAPSHOT_IS_CHECKED, `  const faults: readonly string[] = []`)],
    killed(['a-snapshot-that-is-not-what-its-digest-names-is-refused']),
  ),

  sameOnEveryLens(
    'C-13',
    'records the served digest as the digest of what was written, so every file whose import was ' +
      'repointed reads as locally modified from the instant it was installed',
    [
      installFile(
        WHAT_WAS_WRITTEN_IS_HASHED,
        `      files.push({ path: file.path, served: file.served, sha256: file.served.sha256, bytes: bytes.byteLength })`,
      ),
    ],
    killed([THE_TWO_DIGESTS]),
  ),

  sameOnEveryLens(
    'C-14',
    'claims every file nothing claims, whatever is in it - so somebody else\'s code is overwritten ' +
      'without a word, on the reading that the absence of a claim is what decides rather than the bytes',
    [installFile(A_FILE_WE_DID_NOT_WRITE, `      if (true) alreadyOnDisk.add(file.path)`)],
    killed(['a-file-we-did-not-write-is-never-overwritten', 'a-refusal-leaves-the-project-exactly-as-it-was']),
  ),

  sameOnEveryLens(
    // C-46 and C-47 are numbered last and written here, beside the mutants they belong with: the
    // identifiers are addresses and are appended, the reading order is the argument.
    'C-46',
    'refuses a file already holding exactly the bytes this install would write, which is the other ' +
      'half of the rule above: a project whose lockfile was deleted meets an installer refusing its ' +
      'own files, and the only way out is deleting files that were perfectly good',
    [installFile(A_FILE_HOLDING_OUR_BYTES_IS_CLAIMED, `    if (held === undefined && false) {`)],
    killed(['a-file-already-holding-our-bytes-is-claimed-and-not-rewritten']),
  ),

  sameOnEveryLens(
    'C-47',
    'refuses a lockfile written before `askedFor` existed without naming a single feature it holds, ' +
      'so the remedy is a sentence the reader has to work out for themselves from a file the tool ' +
      'has just refused to read',
    [
      {
        file: 'lockfile.ts',
        find: AN_OLD_LOCKFILE_NAMES_WHAT_TO_TYPE,
        replace: `      '',`,
      },
    ],
    killed(['a-lockfile-from-before-asked-for-is-refused-with-the-command-to-run']),
  ),

  sameOnEveryLens(
    'C-15',
    'refuses an untouched file and replaces an edited one - permanent rule 4 exactly inverted',
    [installFile(AN_EDITED_FILE, `      if (held.sha256 === onDisk) {`)],
    killed(['an-edited-file-is-never-replaced', 'reinstalling-what-is-already-there-changes-nothing']),
  ),

  sameOnEveryLens(
    'C-16',
    'records a feature with no file, so the next install of it meets files nothing claims and refuses ' +
      'them as somebody else\'s',
    [installFile(A_FEATURE_CLAIMS_ITS_FILES, `      files: [],
      installedAt: request.at,`)],
    killed(['every-feature-the-install-writes-gets-its-own-lockfile-entry', THE_TWO_DIGESTS]),
  ),

  sameOnEveryLens(
    'C-17',
    'publishes the contract the catalogue decided against, so the index of the very registry whose ' +
      'refusals page exists to say it was turned down offers it for installation',
    [
      localFile(
        A_REFUSED_CONTRACT_IS_REFUSED,
        `      ledger = publishContract(ledger, {
        address: record.address,
        digest: contractDigest,
        publishedAt: THE_UNPUBLISHED_INSTANT,
        standing: { lifecycle: record.lifecycle },
      })`,
      ),
    ],
    killed([
      'a-refused-contract-is-in-the-index-and-is-not-installable',
      'a-contract-the-catalogue-refused-is-not-installable',
    ]),
  ),

  sameOnEveryLens(
    'C-18',
    'binds the five at a version that looks published, so a lockfile names a release that exists ' +
      'nowhere and a reader has no way to tell it from one that does',
    [localFile(THE_VERSION_IS_VISIBLY_FALSE, `export const THE_UNPUBLISHED_VERSION = '1.0.0'`)],
    killed(['the-local-source-binds-a-visibly-unpublished-version']),
  ),

  sameOnEveryLens(
    'C-19',
    'reaches the serialisation of this working tree from a second module, which is the frontier ' +
      'between a stand-in and a source of distribution becoming a sentence in a header',
    [
      planFile(
        THE_LAST_IMPORT_OF_THE_PLAN,
        `import type { FrozenImplementation } from '../registry/snapshot.js'
import { theFive } from '../registry/the-five.js'

void theFive`,
      ),
    ],
    killed(['nothing-but-the-local-adapter-reaches-the-serialisation']),
  ),

  sameOnEveryLens(
    'C-20',
    'accepts a setting this `toopo` does not honour, so a user writes `imports: alias`, sees it ' +
      'accepted, and gets relative imports',
    [
      {
        file: 'configuration.ts',
        find: AN_UNKNOWN_SETTING_IS_REFUSED,
        replace: `    ...Object.keys(held)
      .filter(() => false)`,
      },
    ],
    killed(['a-field-this-toopo-does-not-honour-is-refused']),
  ),

  sameOnEveryLens(
    'C-21',
    'reads the flag that follows a flag as its value, so `toopo init --dir --dir` configures a ' +
      'folder called `--dir`',
    [{ file: 'arguments.ts', find: A_FLAG_NEEDS_A_VALUE, replace: `    const given = value !== undefined` }],
    killed(['a-flag-with-no-value-is-refused']),
  ),

  sameOnEveryLens(
    'C-22',
    'points a method of the port at an endpoint the read API does not have, which is an installer ' +
      'depending on an answer nobody publishes',
    [{ file: 'source.ts', find: THE_INDEX_ENDPOINT, replace: `  contractIndex: 'contracts',` }],
    killed(['every-method-of-the-port-answers-an-endpoint-that-exists']),
  ),

  // -------------------------------------------------------------------------
  // Twenty defects written for twenty-one silences.
  //
  // The first complete run killed twenty-two of twenty-two and left twenty-one guards red on nothing.
  // Every one of them named a defect that could be written, so writing it is what the instrument asks
  // for rather than a declaration that the region is out of reach - which is the same answer
  // `validation-stage-1` gave to the same question, and the reason `unprobedRegions` is empty here.
  //
  // They are grouped by what they are about rather than by which guard they redden, because a mutant
  // is a defect somebody could ship and not a lever for a test.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'C-23',
    'reads an unknown command as `add`, so a typo installs something instead of saying it is a typo',
    [
      {
        file: 'arguments.ts',
        find: AN_UNKNOWN_COMMAND,
        replace: `  return { command: { name: 'add', contract: command, implementation: null } }`,
      },
    ],
    killed(['an-unknown-command-and-an-unknown-flag-are-refused']),
  ),

  sameOnEveryLens(
    'C-24',
    'ignores a word that is not a flag, so `toopo add a b` installs `a` and never mentions `b`',
    [
      {
        file: 'arguments.ts',
        find: A_STRAY_WORD_IS_REFUSED,
        replace: `    if (!word.startsWith('--')) {
      continue
    }`,
      },
    ],
    killed(['a-repeated-flag-and-a-stray-word-are-refused']),
  ),

  sameOnEveryLens(
    'C-25',
    'takes the first flag as the name of a contract, so `toopo add --implementation reference` looks ' +
      'for a contract called `--implementation`',
    [
      {
        file: 'arguments.ts',
        find: A_CONTRACT_COMES_FIRST,
        replace: `  if (contract === undefined) return { faults: [\`\\\`\${verb}\\\` needs the name of a contract\`] }`,
      },
    ],
    killed(['add-without-a-contract-is-refused']),
  ),

  sameOnEveryLens(
    'C-26',
    'reads a bare `toopo` as `toopo init`, so a user asking what the tool does gets a file written',
    [
      {
        file: 'arguments.ts',
        find: NOTHING_IS_A_COMMAND,
        replace: `  if (command === undefined) return { command: { name: 'init', directory: null } }`,
      },
    ],
    killed(['nothing-at-all-is-refused']),
  ),

  sameOnEveryLens(
    'C-27',
    'stores the name of a flag as its own value, so `--dir app/toopo` configures a folder called `dir`',
    [{ file: 'arguments.ts', find: A_FLAG_KEEPS_ITS_VALUE, replace: `      values[name] = name` }],
    killed(['a-flag-and-its-value-are-read']),
  ),

  sameOnEveryLens(
    'C-28',
    'answers a directory for `init` when none was given, so the detection that follows never runs and ' +
      'a project without `src` is configured as though it had one',
    [
      {
        file: 'arguments.ts',
        find: INIT_TAKES_NO_DIRECTORY_BY_DEFAULT,
        replace: `    return { command: { name: 'init', directory: flags.values['dir'] ?? 'src/lib/toopo' } }`,
      },
    ],
    killed(['a-command-with-no-flag-is-read']),
  ),

  sameOnEveryLens(
    'C-29',
    'accepts any version in `toopo.json`, so a file written by a later `toopo` is read under rules it ' +
      'was not written under',
    [{ file: 'configuration.ts', find: THE_VERSION_IS_ONE, replace: `    ...(held['version'] !== undefined` }],
    killed(['a-version-this-toopo-does-not-write-is-refused']),
  ),

  sameOnEveryLens(
    'C-30',
    'accepts any string as a directory, so a configuration committed from Windows names a folder no ' +
      'other machine can resolve and an absolute path names the machine that ran `init`',
    [{ file: 'configuration.ts', find: A_DIRECTORY_TRAVELS, replace: `const DIRECTORY = /^.+$/` }],
    killed(['a-directory-that-does-not-travel-is-refused']),
  ),

  sameOnEveryLens(
    'C-31',
    'invents a configuration for a project that has none, so `toopo add` writes into a folder the user ' +
      'never chose instead of saying to run `toopo init`',
    [
      {
        file: 'configuration.ts',
        find: NO_FILE_MEANS_NO_CONFIGURATION,
        replace: `  if (!existsSync(path)) return { version: 1, directory: 'src/lib/toopo' }`,
      },
    ],
    killed(['a-project-that-was-never-initialised-answers-nothing', 'add-with-no-configuration-writes-one-and-says-so']),
  ),

  sameOnEveryLens(
    'C-32',
    'reads a broken `toopo.json` as an absent one, so a file the user is editing is silently replaced',
    [{ file: 'configuration.ts', find: A_BROKEN_FILE_IS_REFUSED, replace: `  } catch {
    return null
  }` }],
    killed(['a-file-that-is-not-json-is-refused-by-name']),
  ),

  sameOnEveryLens(
    'C-33',
    'proposes the same folder whatever the project looks like, so a project with no `src` gets one',
    [
      {
        file: 'configuration.ts',
        find: THE_PROPOSAL_READS_THE_PROJECT,
        replace: `export const proposeDirectory = (root: string): string => {
  void root

  return 'src/lib/toopo'
}`,
      },
    ],
    killed(['the-proposed-directory-follows-the-shape-of-the-project']),
  ),

  sameOnEveryLens(
    'C-34',
    'writes the version and not the directory, so the file `init` produces is one `add` refuses',
    [
      {
        file: 'configuration.ts',
        find: THE_WHOLE_CONFIGURATION_IS_WRITTEN,
        replace:
          "  writeFileSync(to, `${JSON.stringify({ version: configuration.version }, null, 2)}\\n`, 'utf8')",
      },
    ],
    killed(['a-configuration-round-trips-through-the-file']),
  ),

  sameOnEveryLens(
    'C-35',
    'stops reading the features of a lockfile, so a malformed entry is read as an absent one and a ' +
      'file toopo did not write is decided to be safe to overwrite',
    [{ file: 'lockfile.ts', find: THE_FEATURES_ARE_VALIDATED, replace: `    ? []` }],
    killed(['an-unreadable-lockfile-stops-the-install']),
  ),

  sameOnEveryLens(
    'C-36',
    'leaves a clean refusal without the guard that keeps it, which is how a list of situations somebody ' +
      'checked becomes a list somebody wrote',
    [{ file: 'breakage.ts', find: A_CLEAN_REFUSAL_NAMES_ITS_GUARD, replace: `    verdict: 'refused-cleanly',` }],
    killed([
      'every-breakage-is-classified',
      'every-clean-refusal-resolves-to-the-guard-it-names',
    ]),
  ),

  sameOnEveryLens(
    'C-37',
    'invents an address for a name the registry does not hold, so a typo is answered by a failure ' +
      'three steps later instead of by the sentence that says the catalogue has no such contract',
    [
      resolveFile(
        A_NAME_THE_INDEX_DOES_NOT_HOLD,
        `  if (first === undefined) {
    return { found: { address: { language: 'typescript', name: wanted.name, major: 1 }, summary: '' } }
  }`,
      ),
    ],
    killed(['a-name-the-catalogue-does-not-hold-is-refused']),
  ),

  sameOnEveryLens(
    'C-38',
    'swallows whatever the walk found wrong about an edge, so a feature the registry does not serve ' +
      'and one it serves under another name are both passed over in silence',
    [resolveFile(A_MISSING_EDGE_IS_NAMED, `      continue`)],
    killed([
      'an-edge-the-registry-does-not-hold-is-refused',
      // Both, because the walk has one place left to refuse from: this cell drops every fault `heldAt`
      // answered, and a misdeclared snapshot is one of them. C-65 is where that guard is alone, on the
      // narrower edit that leaves the walk's own refusal intact.
      'an-edge-whose-digest-names-another-artefact-is-refused',
    ]),
  ),

  sameOnEveryLens(
    'C-39',
    'adds a newline to every file it writes - the installer tidying somebody else\'s code, which is ' +
      'the one thing it may never do',
    [
      installFile(
        WHAT_IS_WRITTEN_IS_WHAT_ARRIVED,
        `        Buffer.from((rewritten.sources.get(file.servedAt) as string) + '\\n', 'utf8'),`,
      ),
    ],
    // Four guards redden; the one named is the one written for a file that has nothing to repoint,
    // where "what landed is what was served" is the whole claim.
    killed(['a-feature-with-no-dependency-lands-exactly-as-it-was-served']),
  ),

  sameOnEveryLens(
    'C-40',
    'sorts the plan by name, so the order the resolution answered - dependencies first - is replaced ' +
      'by one that decides which carrier of a shared blob keeps it for a different reason',
    [
      planFile(
        THE_ORDER_IS_THE_RESOLUTIONS,
        `  for (const held of [...order].sort((a, b) => (a.contract.name < b.contract.name ? -1 : 1))) {`,
      ),
    ],
    killed(['the-plan-is-in-the-resolutions-order']),
  ),

  sameOnEveryLens(
    'C-41',
    'leaves a specifier that names nothing exactly as it was, so the file lands importing something ' +
      'the project does not have',
    [rewriteFile(A_SPECIFIER_THAT_NAMES_NOTHING, `            if (servedAt === null) continue`)],
    killed(['an-import-of-a-file-this-install-does-not-carry-is-refused']),
  ),

  sameOnEveryLens(
    'C-42',
    'points the snapshot method at the index, so three of the needs `toopo add` has are answered by ' +
      'no endpoint the port carries and nobody says so',
    [{ file: 'source.ts', find: THE_SNAPSHOT_ENDPOINT, replace: `  snapshot: 'contract-index',` }],
    killed(['the-port-answers-every-need-behind-it-and-nothing-else']),
  ),

  // -------------------------------------------------------------------------
  // Three defects of the surface the user reads, which the first forty-two did not reach.
  //
  // Everything above measures a value. These measure the sentence a person gets, and they exist
  // because the report was the one module of this folder whose nominal path no guard ran through -
  // only its refusal did. The first surface of a product is a poor place to find that out later.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'C-43',
    'never says that nothing was written, so the reader is handed a reason while still wondering ' +
      'whether their project is now half-changed - which is the reader\'s first question and the ' +
      'half of a refusal that matters more than the why. It reordered the two before `toopo search` ' +
      'moved that body; removing the sentence is the same claim, on an anchor a layout change cannot ' +
      'invalidate',
    [
      {
        file: 'report.ts',
        find: A_REFUSAL_ANSWERS_FIRST,
        replace: `    ...faults.flatMap((fault) => [`,
      },
    ],
    killed(['a-refusal-says-nothing-was-written-before-it-says-why']),
  ),

  sameOnEveryLens(
    'C-44',
    'reads a kilobyte as 1024 bytes, so the size printed beside a file disagrees with the one the ' +
      'user\'s file manager shows for the same file',
    [
      {
        file: 'report.ts',
        find: A_KILOBYTE_IS_A_THOUSAND,
        replace: `  bytes < 1024 ? \`\${bytes} B\` : \`\${(bytes / 1024).toFixed(1)} kB\``,
      },
    ],
    killed(['a-size-is-read-the-way-a-file-manager-shows-it']),
  ),

  sameOnEveryLens(
    'C-45',
    'deduplicates a shared file and does not say so, which is the installer doing something to ' +
      'somebody\'s project and leaving them to find out',
    [installFile(THE_CARRIERS_ARE_NAMED, `  return []`)],
    killed(['a-line-says-what-was-done-to-that-file']),
  ),

  /**
   * The three defects of the unit that let `toopo add` run without `toopo init`.
   *
   * They were written because the battery said so. Its first run after that unit reported three guards
   * *unaccounted for*, and the two answers on offer - declare them out of reach, or probe them - are
   * not equal here: the decision they keep is which configuration an **install** runs under, and this
   * is the battery about installing. A region declaring them unreachable would have been the tool
   * being arranged to suit the measurement.
   */
  sameOnEveryLens(
    'C-48',
    'proposes a folder for a project whose lockfile records features and whose `toopo.json` is gone, ' +
      'so an install lands beside the files that are already there instead of over them - and the ' +
      'folder they are in is recoverable from nothing on disk',
    [
      {
        file: 'configuration.ts',
        find: THE_ORPHAN_LOCKFILE_IS_REFUSED,
        replace: `  if (false as boolean) {`,
      },
    ],
    killed([
      'a-lockfile-with-no-configuration-is-refused-with-the-folder-to-name',
      'add-with-a-lockfile-and-no-configuration-writes-nothing',
    ]),
  ),

  sameOnEveryLens(
    'C-49',
    'writes a configuration over one the project already has, so a folder the user chose with ' +
      '`toopo init --dir` is replaced by the proposed one on the next `toopo add`',
    [
      {
        file: 'configuration.ts',
        find: A_CONFIGURATION_THAT_EXISTS_IS_KEPT,
        replace: `  if (held !== null) return { configuration: held, write: true }`,
      },
    ],
    killed(['a-project-with-nothing-in-it-is-configured-rather-than-refused']),
  ),

  /**
   * The defect `CHECK_IGNORE` is pinned against, and `ignored.ts` names it in as many words: confusing
   * *not ignored* with *git could not say* produces exactly the silence that module exists to end.
   */
  sameOnEveryLens(
    'C-50',
    'reads git answering `not ignored` as git failing to answer, so a folder that will be committed ' +
      'and a folder nobody could ask about are the same answer',
    [
      {
        file: 'ignored.ts',
        find: NOT_IGNORED_IS_AN_ANSWER,
        replace: `  if (false as boolean) return false`,
      },
    ],
    killed(['git-answers-whether-the-folder-is-ignored-and-says-nothing-when-it-cannot']),
  ),

  // -------------------------------------------------------------------------
  // The folder moving with what is installed in it
  //
  // `toopo init --dir` on a project that holds something used to leave the installed copy behind,
  // claimed by nobody, inside the folder the advice above had just told the user to leave. Thirteen
  // defects, and what they are aimed at is the three things that make the move safe rather than the
  // arithmetic of it: **that every claimed file is carried across unchanged**, **that a destination
  // is never overwritten and never wrongly refused**, and **that the screen says what happened** -
  // including the one part of the work the tool cannot do, which is the user's own imports.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'C-51',
    'carries nothing across, so a folder change moves the configuration and leaves every file where ' +
      'it was - which is the orphan this unit exists to stop, with the report saying it did not happen',
    [relocateFile(WHAT_IS_CARRIED_ACROSS, `    .filter(() => false)`)],
    killed(['every-installed-file-moves-and-not-one-byte-changes']),
  ),

  sameOnEveryLens(
    'C-52',
    'puts the configured folder into the lockfile\'s own paths, so a record whose whole property is ' +
      'that it names no folder starts naming one and the next command looks in the wrong place twice',
    [
      relocateFile(
        THE_LOCKFILE_TRAVELS_UNCHANGED,
        `    ? { moving: { relocation: planned.relocation, lockfile: { ...lockfile, features: ` +
          `lockfile.features.map((f) => ({ ...f, files: f.files.map((x) => ({ ...x, path: ` +
          `\`\${to.directory}/\${x.path}\` })) })) } } }`,
      ),
    ],
    killed(['a-relocation-leaves-the-lockfile-exactly-as-it-was']),
  ),

  sameOnEveryLens(
    'C-53',
    'leaves a file the user edited behind rather than carrying it across, which is the tool losing ' +
      'somebody\'s work in the folder it has just stopped naming - and the defect the whole design ' +
      'was chosen to make impossible',
    [
      relocateFile(
        EVERY_CLAIMED_FILE_IS_CONSIDERED,
        `      if (verdict === 'moved' && digestOnDisk(root, from, file.path) !== file.sha256) continue
      moves.push({
        path: file.path,`,
      ),
    ],
    killed(['a-file-the-user-edited-moves-with-the-edit-in-it']),
  ),

  sameOnEveryLens(
    'C-54',
    'refuses a destination that already holds exactly our bytes, so a run killed between the renames ' +
      'and the removals leaves a project the retry cannot repair - stuck by the rule written to ' +
      'protect it, on a state this tool produced itself',
    [relocateFile(OUR_OWN_BYTES_AT_THE_DESTINATION, `  if (destination === source && false) return 'already-moved'`)],
    killed(['a-destination-already-holding-our-bytes-is-a-move-that-happened']),
  ),

  sameOnEveryLens(
    'C-55',
    'writes over whatever sits at the destination, which is the first entry of `WHAT_BREAKS` failing ' +
      'through a door that entry does not watch: a file toopo did not write, replaced by a command ' +
      'that only claimed to be choosing a folder',
    [relocateFile(A_FREE_DESTINATION, `  if (destination === null || true) return 'moved'`)],
    killed([
      'a-destination-holding-something-else-refuses-the-whole-move',
      'a-refused-folder-change-leaves-the-configuration-naming-the-old-folder',
    ]),
  ),

  sameOnEveryLens(
    'C-56',
    'deletes a path under the folder being left for a file that was never on disk there, so a claimed ' +
      'file that is merely missing is reported as having moved',
    [relocateFile(ONLY_WHAT_EXISTS_ELSEWHERE_IS_TAKEN, `  relocation.moves.map((move) => move.path)`)],
    killed(['a-file-the-lockfile-claims-and-the-disk-has-not-got-moves-nothing']),
  ),

  sameOnEveryLens(
    'C-57',
    'moves a folder onto itself, so `toopo init` run twice with the same folder reads every file, ' +
      'rewrites every file and then removes the folder it has just written into',
    [relocateFile(THE_FOLDER_IS_ACTUALLY_CHANGING, `  if (held === null || lockfile === null) {`)],
    killed(['a-folder-that-is-not-moving-and-a-project-with-nothing-to-move-both-move-nothing']),
  ),

  sameOnEveryLens(
    'C-58',
    'never takes the folder it left, so the screen says the files moved and a folder carrying this ' +
      'tool\'s name is still sitting there - the sentence and the disk disagreeing on the one screen ' +
      'written to settle where things are',
    [{ file: 'write.ts', find: A_FOLDER_IS_ABANDONED_OR_NOT, replace: `  if (leaving === null || true) return null` }],
    killed([
      'the-folder-that-was-left-goes-when-it-is-empty',
      'the-folder-that-was-left-stays-when-it-holds-something-else',
    ]),
  ),

  sameOnEveryLens(
    'C-59',
    'takes the folder it left whatever it still holds, so a file the user put there themselves is ' +
      'deleted by a command that was told to change a setting',
    [
      {
        file: 'write.ts',
        find: AN_ABANDONED_FOLDER_GOES_ONLY_IF_EMPTY,
        replace: `    rmSync(join(root, leaving), { recursive: true })`,
      },
    ],
    killed(['the-folder-that-was-left-stays-when-it-holds-something-else']),
  ),

  sameOnEveryLens(
    'C-60',
    'writes the configuration before the refusal can stop it, which leaves `toopo.json` naming a ' +
      'folder nothing is in - the exact defect this unit closes, arriving through the repair for it',
    [
      {
        file: 'command.ts',
        find: THE_REFUSAL_COMES_FIRST,
        replace: `      writeConfiguration(root, configuration)\n      if ('faults' in change) refuse(change.faults)`,
      },
    ],
    killed(['a-refused-folder-change-leaves-the-configuration-naming-the-old-folder']),
  ),

  sameOnEveryLens(
    'C-61',
    'stops naming the files that moved, so the tool moves things inside somebody else\'s repository ' +
      'and hands them a count instead of a list - a number they have no way to check against their ' +
      'own project',
    [{ file: 'report.ts', find: EVERY_FILE_THAT_MOVED_IS_NAMED, replace: `    ...[],` }],
    killed(['a-folder-change-names-every-file-that-moved']),
  ),

  sameOnEveryLens(
    'C-62',
    'says nothing about the imports in the user\'s own code, so the one part of the move this tool ' +
      'cannot make is the one part nobody mentions - and their build fails on an import with nothing ' +
      'anywhere saying why, which is the trap `whatToCommit` exists for, one floor up',
    [{ file: 'report.ts', find: THE_IMPORTS_ARE_THE_USERS, replace: '      `` + `` +' }],
    killed(['a-folder-change-says-the-imports-are-the-users-to-change']),
  ),

  sameOnEveryLens(
    'C-63',
    'leaves the folder it could not take unnamed, which is the orphan defect with the roles reversed: ' +
      'a folder this tool has stopped naming, still holding somebody\'s file, mentioned by nothing ever ' +
      'again',
    [{ file: 'report.ts', find: A_FOLDER_LEFT_BEHIND_IS_NAMED, replace: `    ...(leftBehind === null || true\n      ? []` }],
    killed(['a-folder-that-could-not-be-taken-is-named']),
  ),

  /**
   * The one defect here that was found by the apparatus failing rather than by anybody writing it.
   *
   * `rewrite.ts` removes the folder it parsed a submission's imports in from a `finally`, and a
   * `finally` that throws replaces what was being returned - so a directory the operating system
   * refuses for an instant turns a rewrite that worked into an install that failed. The same call
   * reddened a calibration control of this battery with nothing injected, at three runs in 139, which
   * is how it was found: a teardown that throws reddens whichever guard is running, and this
   * instrument reads a red guard as a verdict.
   */
  sameOnEveryLens(
    'C-64',
    'stops asking again when the operating system refuses a removal, so a folder held for an instant ' +
      'throws out of a `finally` and an install fails on a rewrite that had already succeeded',
    [removalFile('const REMOVAL_ATTEMPTS = 10', 'const REMOVAL_ATTEMPTS = 0')],
    killed(['a-project-is-removed-while-another-process-still-holds-it']),
  ),

  /**
   * A snapshot stops being checked against the address it was fetched for, so a whole self-consistent
   * answer about another artefact passes every remaining check.
   *
   * **The defect this cell restores is the one the digest on an edge created.** Before edges carried
   * one, `gatherHoldings` learned an edge's digest by looking its `id` and `version` up in the bindings,
   * and the identity of what arrived fell out of that lookup - the very round trip the digest removes.
   * Taking the check out therefore does not restore an older, safer state; it restores a state that has
   * never existed, in which the belief has moved onto the edge and nothing checks it.
   *
   * **What it does is not what it was written believing, and that was measured.** Over the six
   * substitutions the imagined graph can express, five are refused anyway - downstream, by `entryOf` and
   * by the walk, under *cannot be resolved, and the registry holds no such published implementation* and
   * *publishes no reference.ts*, of contracts this registry publishes and serves. So this cell's subject
   * is a refusal that names the fact against one that names a cause no measurement establishes, which is
   * the class `CLAUDE.md` calls the worst this product can carry.
   */
  sameOnEveryLens(
    'C-65',
    'stops checking that a snapshot is the artefact the address it was fetched for names, so an edge ' +
      'carrying another artefact\'s digest is answered honestly and refused, if at all, under a cause ' +
      'nothing measured',
    [resolveFile(A_SNAPSHOT_DECLARES_WHAT_WAS_ASKED_FOR, `  const misdeclared: readonly string[] = []`)],
    killed(['an-edge-whose-digest-names-another-artefact-is-refused']),
  ),

  /**
   * Two edges naming one address stop being compared, so whichever the walk reaches first wins.
   *
   * **It is the one substitution the cell above does not reach, and it was found by running all six
   * rather than by reading the loop.** An address already resolved needs no fetch, and skipping it threw
   * the second edge's digest away with it. Measured: with `number/sign@1` published naming
   * `string/pad@1` at `number/clamp@1`'s digest, the honest edge arrives first, the lying one is
   * skipped, and the install answers five correct files - the right artefact landing because of the
   * order the walk happened to take, on a registry that had published a combination nobody can build.
   *
   * The two cells are a partition rather than a pair: this one is green under C-65's edit and C-65 is
   * green under this one, because the first is about an answer that was fetched and the second about an
   * edge that never was.
   */
  sameOnEveryLens(
    'C-66',
    'stops comparing the digests of two edges naming one address, so a feature published against one ' +
      'artefact silently gets another - and which one depends on the order the walk took',
    [resolveFile(TWO_EDGES_ON_ONE_ADDRESS_AGREE, `      if (false) {`)],
    killed(['two-edges-naming-one-address-at-two-digests-are-refused']),
  ),

  /**
   * A registry that is merely broken becomes a registry that holds nothing.
   *
   * `null` is the port's word for *this registry holds no such thing*, and an installer told it by a
   * registry that answered 500 reports the file as one nobody publishes - a diagnostic naming a cause no
   * measurement establishes, arriving through the transport rather than through a screen. It is the
   * failure `validation/source.ts` records one folder along: a thing that was not read passes every
   * check for the wrong reason.
   */
  sameOnEveryLens(
    'C-67',
    'turns every status that is not the answer into `null`, so a registry having a bad day is ' +
      'indistinguishable from one that never published the file',
    [httpSourceFile(A_FAILURE_IS_NOT_AN_ABSENCE, `    if (!response.ok) return null`)],
    killed(['a-status-that-is-neither-the-answer-nor-a-404-is-an-error-and-not-an-absence']),
  ),

  /**
   * A blob stops being addressed by the digest it was asked for and is addressed by what arrived.
   *
   * **This is the cell the whole remote port exists to keep honest, and the spelling it restores is the
   * one a client falls into rather than an exotic one.** `servedBlob(bytes)` computes `addressedBy` from
   * the bytes it is handed and `servedBlobFaults` compares `addressedBy` against a recompute of those
   * same bytes, so the check becomes *these bytes hash to their own hash* and passes on anything at all.
   *
   * Measured by writing it before the guard existed: against a registry answering one blob address with
   * another file's bytes, the install is **accepted** - `'faults' in outcome` is false, five files land,
   * and one of them is not the file its digest names. `localSource` and `packagedSource` cannot have
   * that defect, because both look an answer up *by* its digest in a map keyed on it; the pairing is
   * held by a data structure there and by whatever the server chooses to send here.
   */
  sameOnEveryLens(
    'C-68',
    'addresses a fetched file by the digest of what arrived rather than by the digest it asked for, ' +
      'so the verification becomes a tautology and corrupted bytes install',
    [
      httpSourceFile(
        WHAT_THIS_MODULE_MAY_HASH,
        `import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type {
  ServedImplementationBinding,`,
      ),
      httpSourceFile(
        A_BLOB_IS_ADDRESSED_BY_THE_QUESTION,
        `      return { addressing: 'content-addressed', addressedBy: digestOfBytes(servedBytes(bytes)), bytes }`,
      ),
    ],
    killed(['bytes-served-at-the-address-that-was-asked-for-are-refused-when-they-are-not-that']),
  ),

  /**
   * The client percent-encodes the address it asks about, which is the spelling this repository shipped
   * until an emitted tree made it impossible.
   *
   * `encodeURIComponent` on a rendered address is what somebody writes who is thinking about a URL and
   * not about a file: it is right for a query parameter, and it turns `typescript/number/parse@1` into
   * one segment no filesystem can hold and many hosts rewrite before routing. Nothing about the client
   * looks wrong afterwards - the request is well formed and the registry simply has nothing there.
   *
   * **What it measures is that the address belongs to the registry**: `pathTo` is where an answer lives
   * and the client's job is to ask at it, so a client that decorates the address on the way out is a
   * second statement of where an answer lives. The four guards it reddens are the ones that put this
   * client in front of a real socket.
   */
  sameOnEveryLens(
    'C-69',
    'percent-encodes the address a question names, so every request is well formed and asks at a path ' +
      'the registry does not answer',
    [
      httpSourceFile(
        AN_ADDRESS_IS_ASKED_FOR_AS_IT_IS_RENDERED,
        `  pathTo(
    endpointOf(THE_ENDPOINT_BEHIND[question.method]),
    encodeURIComponent(addressAsked(question)),
  )`,
      ),
    ],
    killed([
      'an-install-over-http-plans-exactly-what-the-same-registry-plans-in-process',
      'bytes-served-at-the-address-that-was-asked-for-are-refused-when-they-are-not-that',
      'the-same-decision-against-a-warm-cache-and-no-network-is-the-same-plan',
      'the-walk-costs-one-round-trip-per-level-and-fetches-each-frontier-at-once',
    ]),
  ),
]

export const battery: Battery = {
  name: 'cli-install',
  contractPath: 'cli',
  vitestConfig: 'cli/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'C-01',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention:
        'the installer as committed: the port, the local stand-in, the plan, the rewrite and the lockfile',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['C'], edits: [] },
  ],

  unreachableGuards: [],

  /**
   * `cli/` is one folder measured by two batteries, and this is the half the other one holds.
   *
   * Everything else `toopo update` added is silent here only in the sense that nothing was written for
   * it: measured, every guard of `update.test.ts` reddens under defects injected into the plan, the
   * rewrite and the install path, because an update reuses every one of those. What no
   * defect of this battery can reach is the two things an install does not do - render a diff, and
   * fail part-way through a write.
   */
  unprobedRegions: [
    /**
     * The three guards of the emitted tree's acceptance this battery does not reach, and each is
     * unreached for its own measured reason rather than for a shared one.
     *
     * The other three redden here, and reading *which* mutants do it is what corrected this entry: it
     * is C-17, C-18, C-22 and C-42 - every one of them an edit to `local-source.ts`. **The two sides of
     * each comparison differ in exactly one thing, which registry they read**, so a defect in a
     * *decision* changes both identically and only a defect in the installer's stand-in separates them.
     *
     * `remove-decides-…` is out of reach because this battery installs into a project that has nothing
     * and never takes anything out of one, which is the reason the region below already gives for the
     * rest of `toopo remove`.
     *
     * `every-byte-…` is unprobed by the *data*: measured, `response.text()` in place of
     * `response.arrayBuffer()` leaves this whole suite green, because every file this registry serves
     * is valid UTF-8 and the round trip is the identity on this catalogue.
     *
     * `a-refused-contract-…` reads the emitted tree and the served answer, and C-17 - the one mutant
     * about the refused contract - publishes it in the *stand-in*, which that guard does not read.
     */
    {
      nature: 'claims detection',
      reason:
        'three guards of the emitted tree, each unreached for its own reason. A removal is out of ' +
        'reach here for the reason the region below gives for the rest of `toopo remove`. The byte ' +
        'comparison is unprobed by the data: `response.text()` in place of `response.arrayBuffer()` ' +
        'leaves this suite green, because every file this registry serves is valid UTF-8 and the ' +
        'round trip is the identity on this catalogue. And the refused contract is read off the ' +
        'emitted tree, where C-17 does not reach - it publishes it in the stand-in instead.',
      guards: [
        'a-refused-contract-answers-no-binding-and-an-empty-list-of-implementations',
        'every-byte-the-registry-serves-arrives-unchanged',
        'remove-decides-the-same-thing-against-the-emitted-tree',
      ],
    },

    /**
     * `toopo remove` and `toopo list`, and it is four guards out of the twenty-five that unit added.
     *
     * Everything else it added reddens here, which is the same measurement `cli-update` makes from its
     * own side: a removal parses its name through the function `add` parses its name through, and
     * plans through the arithmetic an install plans through. What is left is a command that writes
     * nothing this battery can reach - `--apply`, an empty project, the catalogue with no query, and
     * the sentence `init` prints about committing the folder.
     */
    {
      nature: 'claims detection',
      reason:
        '`toopo remove` and `toopo list`, which `cli-remove` carries with twenty defects. This ' +
        'battery installs into a project that has nothing and never takes anything out of one, so ' +
        'the acceptance a removal asks for, an empty project, a query with no words and the line ' +
        '`init` prints are out of its reach - and the rest of that unit reddens on it.',
      guards: [
        'a-command-that-takes-nothing-is-read-and-refuses-an-argument',
        'a-project-holding-nothing-says-so-rather-than-printing-a-blank-screen',
        'an-init-says-what-has-to-be-committed',
        'remove-writes-only-when-it-is-asked-to',
        'the-lockfile-standing-is-asked-and-not-predicted',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        '`toopo search`, which is the third battery of this folder and shares nothing with either of ' +
        'the other two: it writes no file, reads no project, and touches neither the plan nor the ' +
        'lockfile. `cli-search` carries twenty-one defects over what a query matches, what it must ' +
        'not, the order and the screen the reader gets.',
      guards: [
        'a-corpus-of-real-queries-ranks-the-right-contract-first',
        'a-cut-summary-says-that-it-was-cut',
        'a-miss-names-the-words-no-contract-carries',
        'a-query-the-catalogue-cannot-answer-answers-nothing',
        'a-query-with-no-words-answers-nothing',
        'a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not',
        'a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias',
        'an-installable-contract-carries-no-refusal',
        'every-declared-alias-finds-its-own-contract-first',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'the diff and the two-phase write, which arrived with `toopo update`. An install renders no ' +
        'diff at all, and it reaches `write.ts` only through the one call every guard here already ' +
        'makes succeed - so a defect in either is out of reach of an edit to the plan, the rewrite, ' +
        'the port or the install path. `cli-update` carries seventeen defects over exactly these, ' +
        'including the one that matters most: node\'s own documentation reads its diff op codes ' +
        'backwards, and every guard about shape passes on an inverted diff.',
      guards: [
        'a-commit-leaves-no-staged-file-behind',
        'a-commit-writes-the-files-and-the-lockfile-together',
        'a-count-is-read-off-the-lines-it-summarises',
        'a-directory-where-a-file-goes-is-refused-by-name',
        'a-file-where-a-folder-must-go-is-refused-with-nothing-staged',
        'a-hunk-header-counts-the-lines-it-covers',
        'a-line-only-the-first-text-has-is-a-minus',
        'a-line-only-the-second-text-has-is-a-plus',
        'a-missing-final-newline-is-said-rather-than-lost',
        'a-refusal-leaves-no-staged-file-behind',
        'a-refused-commit-does-not-touch-the-file-it-would-replace',
        'a-removal-leaves-a-folder-that-still-holds-something',
        'a-removal-tidies-the-folder-it-emptied',
        'each-side-says-for-itself-that-it-has-no-final-newline',
        'only-the-lines-around-a-change-are-shown',
        'the-diff-op-codes-are-what-node-answers',
        'two-changes-far-apart-are-two-hunks',
        'two-identical-texts-have-nothing-to-show',
        // The one guard here that is not about those two. `--apply` is `update`'s own acceptance, and
        // this battery's grammar defects reach the flags `init` and `add` take; U-34 probes it.
        'update-writes-only-when-it-is-asked-to',
      ],
    },
  ],

  mutants,
}
