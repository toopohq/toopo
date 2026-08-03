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

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const THE_ENTRY_FILE_IS_RENAMED = `const destinationOf = (contractName: string, file: string): string =>
  file === THE_ENTRY_FILE
    ? \`\${contractName}/\${actionOf(contractName)}.ts\`
    : \`\${contractName}/\${file}\``

const A_SHARED_BLOB_IS_FOUND_BY_DIGEST = `      const shared = isEntry ? undefined : placedByDigest.get(served.sha256)`

const A_SECOND_VERSION_IS_SEEN = `    const already = seenContracts.get(contract)`

const A_DESTINATION_IS_REMEMBERED = `        placedByPath.set(path, served.sha256)`

const A_SPECIFIER_IS_JAVASCRIPT = `  const asJavaScript = relative.replace(/\\.ts$/, '.js')`

const A_SIBLING_IS_EXPLICIT = `  return asJavaScript.startsWith('.') ? asJavaScript : \`./\${asJavaScript}\``

const RELATIVE_MEANS_BOTH = `const isRelative = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')`

const THREE_SPELLINGS = `  const candidates = [target, target.replace(/\\.js$/, '.ts'), \`\${target}.ts\`]`

const A_BLOB_IS_CHECKED = `    const blobFaults = servedBlobFaults(answer)`

const A_SNAPSHOT_IS_CHECKED = `  const faults = servedSnapshotFaults(answer)`

const WHAT_WAS_WRITTEN_IS_HASHED = `      files.push({ path: file.path, served: file.served, sha256, bytes: bytes.byteLength })`

const A_FILE_WE_DID_NOT_WRITE = `      if (held === undefined) {
        return [\`\${where} is already there and toopo.lock does not claim it, so it is not ours to overwrite\`]
      }`

const AN_EDITED_FILE = `      if (held.sha256 !== onDisk) {`

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
    [installFile(A_BLOB_IS_CHECKED, `    const blobFaults: readonly string[] = []`)],
    killed(['a-blob-that-is-not-what-its-address-names-is-refused']),
  ),

  sameOnEveryLens(
    'C-12',
    'stops checking that a snapshot is what its digest was taken over, so a registry may answer any ' +
      'file list it likes under an address a lockfile pinned',
    [installFile(A_SNAPSHOT_IS_CHECKED, `  const faults: readonly string[] = []`)],
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
    'overwrites a file toopo did not write, which is somebody else\'s code replaced without a word',
    [installFile(A_FILE_WE_DID_NOT_WRITE, `      if (held === undefined) {
        return []
      }`)],
    killed(['a-file-we-did-not-write-is-never-overwritten', 'a-refusal-leaves-the-project-exactly-as-it-was']),
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

  unprobedRegions: [],

  mutants,
}
