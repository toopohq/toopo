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
const signatureFile = (find: string, replace: string) => ({ file: 'signature.ts', find, replace })
const serialiseFile = (find: string, replace: string) => ({ file: 'serialise.ts', find, replace })
const snapshotFile = (find: string, replace: string) => ({ file: 'snapshot.ts', find, replace })
const responseFile = (find: string, replace: string) => ({ file: 'response.ts', find, replace })

const THE_DIAGNOSTIC_TRAVELS_WITH_THE_ANSWER = `  ...exports.filter((entry) => entry.role === 'the-answer'),
  ...exports.filter((entry) => entry.role !== 'the-answer'),`

const THE_INDEX_CARRIES_WHAT_A_SEARCH_PAYS_FOR = `      exports: identity.exports,`
const implementationFile = (find: string, replace: string) => ({
  file: 'implementation-record.ts',
  find,
  replace,
})

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const READ_A_FILE = 'const bytes = servedBytes(readFileSync(join(directory, name)))'

// --- The reading of a declared signature, which is what makes a case a call ---

const A_COMMA_INSIDE_A_TYPE_SEPARATES_NOTHING = `    else if (character === ',' && brackets === 0 && angles === 0) {
      parts.push(list.slice(start, at))`

const A_MARK_ABOUT_ARITY_IS_NOT_A_NAME = `        .replace(/^\\.{3}/, '')
        .replace(/\\?$/, '')
        .trim()`

const A_SIGNATURE_THAT_CANNOT_BE_READ_IS_REFUSED = `  throw new UnreadableSignature(text, 'its parameter list is never closed')`

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

const SERVE_THE_CANONICAL_TEXT = `  canonicalText: canonical(snapshot, 'snapshot'),`

const A_BINDING_IS_ONLY_STANDING = `  readonly lifecycle: Lifecycle
}`

const A_BINDING_IS_BUILT_FROM_STANDING = `  lifecycle: entry.standing.lifecycle,
})`

const NORMALISE_THEN_HASH = `  const recomputed = digestOfBytes(servedBytes(response.bytes))`

const INSTALLABLE_MEANS_PUBLISHED = `      installable: published.has(renderContract(identity.address)),`

const WALK_BEFORE_PUSHING = `      const next = mustHold(holdings, edge)
      walk(next, [...open, what])
      seen.add(what)
      resolved.push(next)`

const WALKS_AFTER_PUSHING = `      const next = mustHold(holdings, edge)
      seen.add(what)
      resolved.push(next)
      walk(next, [...open, what])`

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

  // -------------------------------------------------------------------------
  // The read API. Five defects of the projection, and one of the resolution.
  //
  // They are in this battery rather than in one of their own because they are the same subject one
  // step along: what a snapshot is, what may not travel beside it, and what a reader can recompute.
  // A separate battery would inject into the same folder under the same configuration and would
  // differ only in its name.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'I-11',
    'serves a snapshot as ordinary JSON rather than as the canonical text its digest was taken over, ' +
      'so the cheapest check anybody runs - sha256 over the response body - answers the wrong thing ' +
      'while every reader that re-canonicalises still agrees',
    [responseFile(SERVE_THE_CANONICAL_TEXT, `  canonicalText: JSON.stringify(snapshot),`)],
    killed(onEach('the-body-served-is-already-canonical')),
  ),

  sameOnEveryLens(
    'I-12',
    'puts a frozen field into the answer a name resolves to, so a reader can no longer recompute the ' +
      'digest without being told which fields to strip - and being told is the trust this unit exists ' +
      'to remove',
    [
      responseFile(
        A_BINDING_IS_ONLY_STANDING,
        // Written with a structural type rather than by naming `HarnessFile`, so that the defect is
        // caught by the guard that exists for it and not by an import this file does not have. A
        // mutant killed by the typechecker would measure the import and not the projection.
        `  readonly lifecycle: Lifecycle
  readonly harness: readonly { readonly path: string }[]
}`,
      ),
      responseFile(
        A_BINDING_IS_BUILT_FROM_STANDING,
        `  lifecycle: entry.standing.lifecycle,
  harness: [],
})`,
      ),
    ],
    killed(onEach('a-contract-binding-carries-only-the-address')),
  ),

  sameOnEveryLens(
    'I-13',
    'hashes a served file before normalising it, so a reader whose transport hands back CRLF is told ' +
      'their whole platform modified the file - the defect I-01 was, arriving on the reading side',
    [responseFile(NORMALISE_THEN_HASH, `  const recomputed = digestOfBytes(response.bytes)`)],
    killed(['a-blob-answer-that-arrived-with-crlf-still-verifies']),
  ),

  sameOnEveryLens(
    'I-14',
    'offers a contract the catalogue refused for installation, which is the search index contradicting ' +
      'the refusals page of the same site',
    [responseFile(INSTALLABLE_MEANS_PUBLISHED, `      installable: true,`)],
    killed(['a-refused-contract-is-findable-and-not-installable']),
  ),

  sameOnEveryLens(
    'I-15',
    'resolves a dependency graph in the order it walks rather than in the order it must be written, so ' +
      'an install leaves the project between two writes with a file importing something that is not ' +
      'there yet',
    [implementationFile(WALK_BEFORE_PUSHING, WALKS_AFTER_PUSHING)],
    killed(['a-shared-dependency-is-resolved-once', 'nothing-is-written-before-what-it-imports']),
  ),

  // -------------------------------------------------------------------------
  // Two defects of the row a client reads before it can name what it installed.
  //
  // `exports` was put on the index by a consumer that could not print an import line, and the two
  // guards that arrived with it would otherwise be silent under this battery - which is the state
  // `unprobedRegions` exists to refuse, and which this repository answers with a mutant rather than
  // with a declaration wherever a defect can be written.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'I-16',
    'serves only the answer of a contract that publishes a diagnostic beside it, so `toopo add` ' +
      'prints an import line naming half the surface and every caller writes their own error message',
    [responseFile(THE_DIAGNOSTIC_TRAVELS_WITH_THE_ANSWER, `  ...exports.filter((entry) => entry.role === 'the-answer'),`)],
    killed(['the-index-names-what-a-caller-imports', 'the-index-stays-the-smallest-thing-the-registry-serves']),
  ),

  sameOnEveryLens(
    'I-17',
    'puts the description into the row fetched before every search, which is the field this type ' +
      'says in as many words it does not carry - and the claim it makes about its own size stops ' +
      'being true without anybody noticing',
    [
      responseFile(
        THE_INDEX_CARRIES_WHAT_A_SEARCH_PAYS_FOR,
        `      exports: identity.exports,
      description: identity.summary.repeat(8),`,
      ),
    ],
    killed(['the-index-stays-the-smallest-thing-the-registry-serves']),
  ),

  /**
   * Three defects in the reading of a declared signature, which is where a case of block 4.4 becomes a
   * *call* rather than a row of fields.
   *
   * **Three of six, and the three that are missing were written, run and removed.** A signature reader
   * that misreads a shape one of the five actually writes stops that contract serialising, and a
   * contract that does not serialise reddens everything: measured, taking the type where the name is
   * turned eighty guards of this folder red at once, across every suite here. That is a true verdict
   * and a useless attribution - what caught the defect is not a guard anybody wrote about signatures,
   * it is the whole of `registry/` failing to start - and this repository already counts a kill of
   * that kind apart, under `killedByTypecheck`, for the same reason.
   *
   * So what stays is the three whose shape none of the five writes: a comma inside a generic type, a
   * mark about arity, and a signature this reader cannot follow at all. Each reddens the guard written
   * for it and nothing else. The eleven that are left are declared below, with the measurement rather
   * than with a shrug.
   */
  sameOnEveryLens(
    'I-20',
    'splits the parameter list on every comma no bracket encloses, so `Map<K, V>` as a parameter type ' +
      'is read as two parameters and half a type becomes a name',
    [signatureFile(A_COMMA_INSIDE_A_TYPE_SEPARATES_NOTHING, `    else if (character === ',' && brackets === 0) {
      parts.push(list.slice(start, at))`)],
    killed(['a-comma-inside-a-generic-type-separates-no-parameter']),
  ),

  sameOnEveryLens(
    'I-22',
    'keeps the marks that say how often a parameter may be passed, so a page would render `...rest` ' +
      'and `second?` as the names a caller writes',
    [signatureFile(A_MARK_ABOUT_ARITY_IS_NOT_A_NAME, `        .trim()`)],
    killed(['an-optional-or-rest-parameter-is-named-without-its-mark']),
  ),

  sameOnEveryLens(
    'I-23',
    'answers a call with no parameters where it cannot read one, so a declaration this reader does ' +
      'not understand reaches a record as a function that takes nothing',
    [signatureFile(A_SIGNATURE_THAT_CANNOT_BE_READ_IS_REFUSED, `  return ''`)],
    killed(['a-declaration-this-reader-cannot-follow-is-refused']),
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
   * The guards of `registry/` that no mutant of this battery reddens, declared as regions it does not
   * probe rather than as guards out of its reach.
   *
   * The difference is a claim about what is possible, and for the first two lists it has not been
   * measured. Those mutants aim at the storage - the canonical form, the served bytes, the projection,
   * the ledger - and most of what they leave silent belongs to the schema, which was an earlier unit
   * and has no battery of its own. Some of it is certainly out of reach of an edit to three files;
   * establishing which would take a mutant apiece, and asserting it without one is the kind of
   * sentence this instrument exists to replace. So the honest name is the loud one, and what it asks
   * for is mutants.
   *
   * **The last two lists are different, and they are the read API's.** Fifty guards arrived with it,
   * and twenty-eight of them are not a question: a perturbation was written for each one while the
   * unit was being built, applied one at a time against a calibrated control, and every one went red
   * on the guard written for it. They are reachable, demonstrated, and the mutant was not promoted
   * into this battery - which is a debt with a name rather than an open question. The other
   * twenty-two had no perturbation written at all.
   */
  unprobedRegions: [
    /**
     * The reading of a declared signature, on the shapes the five actually write.
     *
     * Every one of these was seen red while `signature.ts` was being written - dropping the
     * trailing-comma filter reddens three of them and thirty-two guards across nine files of this
     * folder - and none of the mutants is promoted here, because each one stops a real contract
     * serialising and therefore reddens most of `registry/` at once. A cell that reddens eighty guards
     * establishes that serialisation is load-bearing, which nobody doubted, and says nothing about the
     * reader.
     *
     * What would close it is a sixth contract whose signature carries one of these shapes, or a
     * fixture record for the reader alone. Both are real and neither is this unit's.
     */
    {
      nature: 'claims detection',
      reason:
        'the reading of a declared signature on a shape one of the five writes. Every mutant here ' +
        'stops a real contract serialising, so it reddens most of this folder and attributes the ' +
        'kill to the failure rather than to the guard; the three that are narrow enough to name one ' +
        'guard are I-20, I-22 and I-23 above.',
      guards: [
        'a-plain-signature-names-its-parameters',
        'a-signature-that-takes-nothing-has-no-parameters',
        'the-type-parameters-are-not-the-parameters',
        'the-parameters-of-a-parameter-are-not-parameters',
        'a-trailing-comma-leaves-no-parameter-behind-it',
        'an-arrow-inside-a-type-parameter-does-not-close-it',
        'the-call-of-number-parse-is-read-from-its-own-signature',
        'the-call-of-date-add-is-read-from-its-own-signature',
        'the-call-of-array-group-by-is-read-from-its-own-signature',
        'the-call-of-string-levenshtein-is-read-from-its-own-signature',
        'the-call-of-string-slugify-is-read-from-its-own-signature',
      ],
    },
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
        // The five schema suites plus this one. `the files a contract is made of` is deliberately
        // absent: it is a storage suite, every one of its guards is reddened by I-02, and declaring
        // it here is what the instrument refused when the two guards still sat in the file above.
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

    {
      nature: 'claims detection',
      reason:
        'read-API guards shown reachable and not promoted into this battery. A perturbation was ' +
        'written for each one while the unit was built - applied one at a time against a control ' +
        'calibrated at 268 assertions - and every one went red on the guard written for it. Five of ' +
        'that pass became I-11 to I-15; these twenty-eight did not, and the reason is cost rather ' +
        'than doubt. A debt with a name, which is what this list is for.',
      guards: [
        'a-content-addressed-answer-is-cached-for-ever',
        'a-contract-is-refused-or-published-and-never-both',
        'a-cycle-is-refused-rather-than-deduplicated-away',
        'a-named-answer-is-always-revalidated',
        'a-refused-entry-is-answered-by-endpoints-that-exist-for-other-reasons',
        'a-snapshot-answer-that-was-altered-is-refused',
        'a-snapshot-answer-under-another-format-version-means-nothing-here',
        'an-edge-the-registry-does-not-hold-is-refused',
        'an-unpublished-implementation-cannot-be-depended-on',
        'every-claim-is-about-an-endpoint-that-exists',
        'every-endpoint-answers-a-need-somebody-has',
        'every-field-a-snapshot-serves-is-classified-array-group-by',
        'every-field-a-snapshot-serves-is-classified-date-add',
        'every-field-a-snapshot-serves-is-classified-number-parse',
        'every-field-a-snapshot-serves-is-classified-string-levenshtein',
        'every-field-a-snapshot-serves-is-classified-string-slugify',
        'every-identifier-is-an-address',
        'every-need-is-answered-exactly-once',
        'every-stratum-is-translated-and-no-translation-is-orphaned',
        'nothing-that-held-is-content-addressed',
        'the-believed-claims-with-no-mitigation-are-named',
        'the-believed-column-is-longer-and-is-mostly-opinion',
        'the-depth-is-derived-from-the-edges',
        'the-endpoints-no-entry-anticipated',
        'the-endpoints-that-carry-the-bulk-are-the-cacheable-ones',
        'the-methodology-answer-carries-every-field-of-a-record',
        'the-needs-answered-without-the-api',
        'the-refusals-page-has-a-source',
        'update-compares-two-digests-and-nothing-else',
      ],
    },

    {
      nature: 'claims detection',
      reason:
        'read-API guards no perturbation was written for, so whether an edit to this folder can ' +
        'redden them is unmeasured rather than known. Two families sit here for a reason worth ' +
        'naming. The implementation binding is guarded on the same claim as the contract binding, ' +
        'which I-12 reddens, so that pair is half probed. And the private-field guards cannot redden ' +
        'until a private field exists: not one field of a contract record is private today, which is ' +
        'a finding `field-map.ts` already records rather than a gap a mutant here could close.',
      guards: [
        'a-blob-answer-with-one-byte-changed-is-refused',
        'a-shared-file-is-recognised-by-its-digest-and-never-by-its-path',
        'a-translation-is-addressed-to-a-reader',
        'an-implementation-binding-carries-no-frozen-field-array-group-by',
        'an-implementation-binding-carries-no-frozen-field-date-add',
        'an-implementation-binding-carries-no-frozen-field-number-parse',
        'an-implementation-binding-carries-no-frozen-field-string-levenshtein',
        'an-implementation-binding-carries-no-frozen-field-string-slugify',
        'every-claim-is-an-address',
        'every-entry-became-an-endpoint-that-exists',
        'every-entry-says-why',
        'every-verifiable-claim-says-what-it-does-not-establish',
        'no-private-field-reaches-a-snapshot-answer-array-group-by',
        'no-private-field-reaches-a-snapshot-answer-date-add',
        'no-private-field-reaches-a-snapshot-answer-number-parse',
        'no-private-field-reaches-a-snapshot-answer-string-levenshtein',
        'no-private-field-reaches-a-snapshot-answer-string-slugify',
        'the-believed-natures-are-the-declared-ones-and-none-is-withholding',
        'the-checks-that-need-nothing-from-the-registry',
        'the-methodology-answer-carries-both-columns-and-the-seeding-policy',
        'the-methodology-answer-is-named-and-therefore-revalidated',
      ],
    },
  ],

  mutants,
}
