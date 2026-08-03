/**
 * The immutable storage battery.
 *
 * Immutability is a claim, and every other claim in this repository is measured. This is the one the
 * product is sold on - a published version is frozen for life, served for ever, and no installation
 * fetches from anywhere else - so a storage whose immutability were asserted and never contradicted
 * would be the decorative guard this repository exists to refuse, on the property that matters most.
 *
 * It injects into `registry/`, not into a contract folder, and it collects under the registry's own
 * vitest configuration. That is the same door `mutation/fixture` already uses and it is closed for
 * the same reason: a registry guard collected by `npm test` would redden under a specification mutant
 * and be counted as a contract catching it. Nothing here can reach a contract battery, and no contract
 * battery can reach this one.
 *
 * **Two of the ten are corrections rather than injections.** I-01 and I-02 are defects this
 * repository actually had, found while reading it for this unit, and both are fixed. They are here
 * so that the fix is held rather than remembered.
 *
 * I-01 hashed the bytes in the working tree. `core.autocrlf` is true here and there is no
 * `.gitattributes`, so a checked-out source carries CRLF while the committed content carries LF:
 * measured on `contracts/string/slugify/contract.ts`, 25 115 bytes hashing to `bfcc6145...` against
 * 24 641 bytes hashing to `3c448a88...`. Every one of the 37 harness files differed from its blob;
 * after the fix none does.
 *
 * I-02 built the file list with a directory listing. A `tsc` invocation that emitted beside the
 * sources put two `.js` files into every contract folder, both entered the harness with their
 * digests, and the whole registry suite stayed green at 110 of 110 - the only guard over the list
 * asked whether the seven expected files were present, never whether anything else was. Reproduced
 * afterwards with a single stray file, same result. Those files would have been served to every
 * installation.
 *
 * There is one arm and one lens. The two fallible contracts carry a second arm because an error
 * convention was under measurement there; nothing here has a convention to compare, and a second
 * lens would be a question nobody is asking yet.
 *
 * The suite this battery runs is typechecked - vitest reports "Type Errors no errors" under the
 * instrument's own command line - so `killed-by-typecheck` is reachable here as it is anywhere else.
 * None of the ten produces it: every one of them is a defect of behaviour that typechecks.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'R', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

/**
 * A guard of this folder is written once with `it.each` over the five and answers to five addresses.
 * `the-five.ts` says why the slug is there; here it is what lets a pin name the contract a defect was
 * caught on, which `I-06` needs - it reddens on one of the five and on no other.
 */
const THE_FIVE = ['number-parse', 'date-add', 'array-group-by', 'string-levenshtein', 'string-slugify']

const onEach = (guard: string): readonly string[] => THE_FIVE.map((slug) => `${guard}-${slug}`)

const canonicalFile = (find: string, replace: string) => ({ file: 'canonical.ts', find, replace })
const serialiseFile = (find: string, replace: string) => ({ file: 'serialise.ts', find, replace })
const snapshotFile = (find: string, replace: string) => ({ file: 'snapshot.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const READ_A_FILE = 'const bytes = servedBytes(readFileSync(join(directory, name)))'

const REFUSE_A_DISAGREEMENT = `  if (undeclared.length > 0 || missing.length > 0) {
    throw new UndeclaredHarness(folder, undeclared, missing)
  }`

const PROJECT_THE_TAIL = `    ownDeclarations: record.ownDeclarations,
    harness: record.harness,`

const SORT_THE_KEYS = '  return `{${sortedKeys(record)'

const A_RECORD_IS_JSON = `  return \`{\${sortedKeys(record)
    .map((key) => \`\${JSON.stringify(key)}:\${canonicalAt(record[key], \`\${path}.\${key}\`)}\`)
    .join(',')}}\``

const SORT_THE_FILES = '  const served = [...files].sort()'

const ONE_READ = '    return { path: name, sha256: digestOfBytes(bytes), bytes: bytes.byteLength }'

const A_STRING_IS_ITSELF = `  if (typeof value === 'string') return JSON.stringify(value)`

const REFUSE_A_REBINDING = `  const held = entries[0]
  if (held !== undefined) throw new AlreadyPublished(what, held.digest, offered)`

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'I-01',
    'hashes the bytes in the working tree rather than the bytes the registry serves, so the digest ' +
      'depends on the reader\'s git configuration - the defect this repository had',
    [serialiseFile(READ_A_FILE, 'const bytes = readFileSync(join(directory, name))')],
    killed(['the-served-bytes-are-the-committed-bytes']),
  ),

  sameOnEveryLens(
    'I-02',
    'lets the served file list be open, so anything sitting in a contract folder is hashed into the ' +
      'record and shipped to every installation - the other defect this repository had',
    [serialiseFile(REFUSE_A_DISAGREEMENT, '  void undeclared\n  void missing')],
    // Ten guards redden; the five named are the half about a file nobody declared, which is what
    // this mutant is written for. The other five are the same refusal from the other side.
    killed(onEach('an-undeclared-file-is-refused')),
  ),

  sameOnEveryLens(
    'I-03',
    'drops a frozen field from the projection the digest is taken over, so a contract can change ' +
      'its own declarations without its digest moving',
    [snapshotFile(PROJECT_THE_TAIL, '    harness: record.harness,')],
    killed(onEach('the-frozen-half-and-the-standing-half-partition-a-contract')),
  ),

  sameOnEveryLens(
    'I-04',
    'keeps the harness paths and blanks their digests, so a served file may change under a fixed ' +
      'snapshot digest - the failure the Merkle tree exists to make impossible',
    [
      snapshotFile(
        PROJECT_THE_TAIL,
        `    ownDeclarations: record.ownDeclarations,
    harness: record.harness.map((file) => ({ path: file.path, bytes: file.bytes, sha256: '' })),`,
      ),
    ],
    // Twelve guards redden; the five named are the ones written for this defect, and they are the
    // ones the weaker form of that guard let through.
    killed(onEach('a-changed-harness-file-moves-the-digest')),
  ),

  sameOnEveryLens(
    'I-05',
    'leaves the keys of a record in insertion order, so two constructions of one content hash ' +
      'differently',
    [canonicalFile(SORT_THE_KEYS, '  return `{${Object.keys(record)')],
    killed([
      'key-order-does-not-depend-on-construction',
      'integer-like-keys-are-sorted-with-every-other-key',
      'an-encoded-field-list-is-not-reordered',
    ]),
  ),

  sameOnEveryLens(
    'I-06',
    'stops sorting the served file list, so the order of the harness follows whatever order the ' +
      'source happened to declare',
    [serialiseFile(SORT_THE_FILES, '  const served = [...files]')],
    // One of the five, and only one: `array/group-by@1` is the contract whose declared list is not
    // already in sorted order, so it is the only one the sort was load-bearing for. The other four
    // instances of this guard are silent under it, and are declared below rather than left implied.
    killed(['the-harness-is-in-one-order-array-group-by']),
  ),

  sameOnEveryLens(
    'I-07',
    'concatenates keys and values with no separator and no quoting, so `{ a: 1, b: 2 }` and ' +
      '`{ a1b: 2 }` share a digest',
    [
      canonicalFile(
        A_RECORD_IS_JSON,
        `  return sortedKeys(record)
    .map((key) => \`\${key}\${canonicalAt(record[key], \`\${path}.\${key}\`)}\`)
    .join('')`,
      ),
    ],
    killed([
      'integer-like-keys-are-sorted-with-every-other-key',
      'an-encoded-field-list-is-not-reordered',
      'two-different-values-do-not-share-a-canonical-form',
    ]),
  ),

  sameOnEveryLens(
    'I-08',
    'reads the file a second time for its size, so the digest and the byte count of one record ' +
      'describe two different reads of one file',
    [
      serialiseFile(
        ONE_READ,
        `    return {
      path: name,
      sha256: digestOfBytes(bytes),
      bytes: readFileSync(join(directory, name)).byteLength,
    }`,
      ),
    ],
    killed(['the-served-bytes-are-the-committed-bytes']),
  ),

  sameOnEveryLens(
    'I-09',
    'normalises Unicode on the way into the digest, which changes what a contract settling cases on ' +
      'the difference between a composed and a decomposed spelling actually says',
    [
      canonicalFile(
        A_STRING_IS_ITSELF,
        `  if (typeof value === 'string') return JSON.stringify(value.normalize('NFC'))`,
      ),
    ],
    killed(['unicode-is-not-normalised']),
  ),

  sameOnEveryLens(
    'I-10',
    'lets a published address be rebound to other bytes, so every lockfile that ever recorded it ' +
      'silently starts resolving to something else',
    [snapshotFile(REFUSE_A_REBINDING, '  void entries\n  void what\n  void offered')],
    killed([
      'an-address-is-bound-once-and-for-ever',
      'rebinding-is-refused-even-to-the-same-digest',
      'an-implementation-versions-under-a-contract-that-does-not-move',
    ]),
  ),
]

export const battery: Battery = {
  name: 'registry-storage',
  contractPath: 'registry',
  vitestConfig: 'registry/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'I-05',

  arms: [
    {
      id: 'R',
      ref: 'HEAD',
      convention: 'the storage as committed: canonical form, served bytes, snapshot, ledger',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['R'], edits: [] },
  ],

  unreachableGuards: [],

  /**
   * Fifty-one of the sixty-eight guards of `registry/` are not reddened by any of the ten, and they
   * are declared as a region this battery does not probe rather than as guards out of its reach.
   *
   * The difference is a claim about what is possible, and it has not been measured. These ten aim at
   * the storage - the canonical form, the served bytes, the projection, the ledger - and most of what
   * is listed below belongs to the schema, which was the previous unit and has no battery of its own
   * yet. Some of these are certainly out of reach of an edit to three files; establishing which would
   * take a mutant apiece, and asserting it without one is the kind of sentence this instrument exists
   * to replace. So the honest name is the loud one, and what it asks for is mutants.
   */
  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'the schema, rather than the storage. These guards were written by the unit that built the ' +
        'contract record and have no battery of their own; the ten mutants here aim at the canonical ' +
        'form, the served bytes, the frozen projection and the ledger, and none of them reaches a ' +
        'statement about what a record contains.',
      suites: [
        'the five, read against their own source',
        'a record accounts for everything its contract declares',
        'the registry encoding',
        'the public/private frontier',
        'the implementations under the five contracts',
        'a sixth contract enters without a migration',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'storage guards no mutant of this battery reaches yet. Each one names a defect that could be ' +
        'written and has not been: a byte-order mark left in the served bytes, a value JSON would ' +
        'lose reaching a digest, an array reordered, a standing field pulled into the digest, an ' +
        'attestation accepted for the wrong snapshot, two contracts colliding on one digest.',
      guards: [
        'a-bundle-that-is-not-addressed-like-a-blob-is-refused',
        'a-byte-order-mark-is-not-content',
        'a-crlf-source-is-served-as-its-lf-form',
        'a-snapshot-invents-no-field-array-group-by',
        'a-snapshot-invents-no-field-date-add',
        'a-snapshot-invents-no-field-number-parse',
        'a-snapshot-invents-no-field-string-levenshtein',
        'a-snapshot-invents-no-field-string-slugify',
        'a-standing-cannot-be-set-on-something-unpublished',
        'a-standing-changes-and-the-digest-does-not',
        'a-standing-field-does-not-move-the-digest-array-group-by',
        'a-standing-field-does-not-move-the-digest-date-add',
        'a-standing-field-does-not-move-the-digest-number-parse',
        'a-standing-field-does-not-move-the-digest-string-levenshtein',
        'a-standing-field-does-not-move-the-digest-string-slugify',
        'a-value-json-would-lose-is-refused-a-bigint',
        'a-value-json-would-lose-is-refused-a-function',
        'a-value-json-would-lose-is-refused-a-hole',
        'a-value-json-would-lose-is-refused-a-symbol',
        'a-value-json-would-lose-is-refused-an-undefined-field',
        'a-value-json-would-lose-is-refused-infinity',
        'a-value-json-would-lose-is-refused-nan',
        'a-value-json-would-lose-is-refused-negative-infinity',
        'a-value-json-would-lose-is-refused-negative-zero',
        'a-value-json-would-lose-is-refused-undefined',
        'an-array-keeps-its-order',
        'an-attestation-about-another-snapshot-is-refused',
        'every-standing-field-says-why-it-cannot-be-frozen',
        'no-two-contracts-share-a-digest',
        'normalising-changes-the-digest',
        'the-frozen-half-and-the-standing-half-partition-an-implementation-array-group-by',
        'the-frozen-half-and-the-standing-half-partition-an-implementation-date-add',
        'the-frozen-half-and-the-standing-half-partition-an-implementation-number-parse',
        'the-frozen-half-and-the-standing-half-partition-an-implementation-string-levenshtein',
        'the-frozen-half-and-the-standing-half-partition-an-implementation-string-slugify',
        'the-harness-is-in-one-order-date-add',
        'the-harness-is-in-one-order-number-parse',
        'the-harness-is-in-one-order-string-levenshtein',
        'the-harness-is-in-one-order-string-slugify',
        'the-limit-of-a-signature-is-published',
        'two-majors-of-one-name-coexist',
      ],
    },
  ],

  mutants,
}
