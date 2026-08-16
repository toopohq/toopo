import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, it, expect } from 'vitest'

import { caseAddressFaults, contractAddressFaults, renderImplementation } from './address.js'
import { canonical, digestOf, digestOfBytes, servedBytes } from './canonical.js'
import type { ContractRecord, Lifecycle } from './contract-record.js'
import { FIELD_MAP, pathsIn, publicContract } from './field-map.js'
import {
  HOLDINGS,
  INDEPENDENT_CARRIERS,
  NEXT_HOLDINGS,
  ROUND,
  ROUND_SOURCE,
  clamp,
  pad,
  round,
  sign,
} from './imagined-graph.js'
import type { ImplementationRecord } from './implementation-record.js'
import {
  UnresolvedDependency,
  declarationFaults,
  dependencyDepthOf,
  resolveDependencies,
} from './implementation-record.js'
import { REPOSITORY_ROOT } from './serialise.js'
import { digestOfSnapshot, edgeTo, implementationSnapshot } from './snapshot.js'
import { decode, encode } from './value.js'
import { contractAnatomy } from '../catalogue/every-contract.js'

/**
 * A sixth contract enters this schema without a migration, measured rather than asserted.
 *
 * **What this file is.** A `ContractRecord` written by hand for a contract that does not exist, so
 * that the schema can be asked whether it would accept one. It is the concrete form of the design
 * criterion the decision to launch at five imposes: build the machine that serves exactly five
 * contracts and accepts a sixth, not one dimensioned for a catalogue nobody has.
 *
 * **What this file is not, and this matters more.** `number/round@1` **is not in the catalogue and
 * may never be.** There is no `contracts/typescript/number/round` folder, no reference implementation, no
 * property, no battery and no admission decision - and writing one would be about ninety-seven
 * decisions this unit has no business taking. Nothing here has been verified about rounding, the
 * answers below are plausible rather than settled, and no part of it should ever be copied into a
 * contract folder. It lives under `packages/registry/` for the same reason the instrument's fixture lives
 * under `mutation/`: `contracts/` is the catalogue and nothing else.
 *
 * **What it is chosen to stress.** Everything the five could not stress at once: a reason set no
 * contract carries, a *sixth* benchmark vocabulary - which is what `contractAnatomy` predicts, five
 * contracts having produced five with no overlap - own declarations with names this schema has never
 * seen, and a `found-in-the-wild` provenance, which is a member of the catalogue's own `Provenance`
 * type that none of the five fills. If a sixth contract needed a field, this is where it would show.
 */

const NOT_YET_PUBLISHED: Lifecycle = { state: 'not-yet-published' }

/**
 * A real digest over real bytes, so that nothing here is a fabricated measurement - and taken by the
 * same two functions a real file goes through, so that the hand-written record is not hashed by a
 * path no contract uses.
 *
 * The text is the graph's own, so that the contract and the implementation competing under it do not
 * describe two different files under one name.
 */
const REFERENCE_BYTES = servedBytes(Buffer.from(ROUND_SOURCE, 'utf8'))

/** The shared surface a sixth contract would reach, read off this working tree rather than invented. */
const SHARED_BYTES = servedBytes(
  readFileSync(join(REPOSITORY_ROOT, 'packages/catalogue/every-contract.ts')),
)

/** The values the `produced` arm below points at, so that its count and digest are read off them. */
const TIE_SAMPLES = [
  encode({ value: 1.005, places: 2 }, 'sixth'),
  encode({ value: 2.675, places: 2 }, 'sixth'),
]

const theSixth: ContractRecord = {
  address: ROUND,
  lifecycle: NOT_YET_PUBLISHED,
  identity: {
    exportName: 'round',
    summary:
      'Round a number to a given number of decimal places, or null when the request cannot be ' +
      'answered exactly.',
    description:
      'Rounds a number to a fixed number of decimal places without the two traps the built-ins ' +
      'carry. `toFixed` answers a string and rounds `1.005` to `1.00`, because the double nearest ' +
      'to 1.005 is below it; multiplying by a power of ten and calling `Math.round` moves the error ' +
      'somewhere else rather than removing it.',
    inputDomain:
      'Finite doubles in the range money and measurements are written in. It is not a decimal ' +
      'arithmetic library and not a formatter.',
    searchAliases: ['round to 2 decimals', 'toFixed', 'round number javascript'],
    relationToTheLanguage: 'The language ships `toFixed`, which answers a string and rounds by the ' +
      'double nearest the input rather than by the decimal the caller wrote.',
  },
  surface: {
    exports: [
      /**
       * The parameter names are written here rather than read from the text by `parametersOf`, and
       * the difference is the whole value of this file: a hand-written record is the second statement
       * a serialiser's answer is checked against, and one that called the serialiser's own reader
       * would be checking it against itself.
       */
      {
        name: 'round',
        typeName: 'Round',
        text: '(value: number, places: number) => number | null',
        role: 'the-answer',
        parameters: [
          { name: 'value', type: 'number' },
          { name: 'places', type: 'number' },
        ],
      },
      {
        name: 'describeRoundFailure',
        typeName: 'DescribeRoundFailure',
        text: '(value: number, places: number) => RoundFailureReason | null',
        role: 'the-diagnostic',
        parameters: [
          { name: 'value', type: 'number' },
          { name: 'places', type: 'number' },
        ],
      },
    ],
    supportingTypes: [],
    // A reason set no contract of the five carries, and the schema needs to know nothing about it.
    failureReasons: ['value-not-finite', 'places-not-whole', 'places-out-of-range'],
    couplingRule:
      'round(v, p) === null if and only if describeRoundFailure(v, p) !== null, for every v and p',
  },
  environments: ['node', 'browser', 'bun'],
  properties: {
    runs: 1000,
    universal: [
      {
        name: 'never mutates its arguments',
        applicable: false,
        reason: 'both arguments are numbers, primitives immutable by construction.',
      },
      { name: 'deterministic', applicable: true, reason: 'violable by a cache keyed on the value.' },
      { name: 'no ambient input', applicable: true, reason: 'the call history is the only ambient input available.' },
      {
        name: 'no ambient output',
        applicable: false,
        reason: 'not reachable by a property, as the catalogue records once for every contract.',
      },
    ],
  },
  caseTables: [
    {
      name: 'edge-cases',
      purpose: 'the answers this contract settles, none of which is settled in fact',
      groups: [
        { id: 'the-decimal-a-double-cannot-hold', title: 'The decimal a double cannot hold', note: null },
        { id: 'places-out-of-range', title: 'A place count no double can carry', note: null },
      ],
      cases: [
        {
          id: 'the-half-cent-that-toFixed-loses'.toLowerCase(),
          group: 'the-decimal-a-double-cannot-hold',
          provenance: { kind: 'specified' },
          rationale:
            'The double nearest 1.005 is below it, so `toFixed(2)` answers "1.00" where a caller ' +
            'writing 1.005 means the decimal.',
          data: encode({ value: 1.005, places: 2, expected: 1.01, reason: null }, 'sixth'),
        },
        {
          id: 'a-negative-zero-survives',
          group: 'the-decimal-a-double-cannot-hold',
          provenance: { kind: 'specified' },
          rationale:
            'Rounding -0.001 to two places answers -0 rather than 0, the same sign question ' +
            '`number/parse@1` settles and the reason both compare with `Object.is`.',
          data: encode({ value: -0.001, places: 2, expected: -0, reason: null }, 'sixth'),
        },
        {
          /**
           * The member of the catalogue's `Provenance` type that no case of the five fills. It is
           * here to show that the schema holds it, not to claim a defect was ever reported.
           */
          id: 'a-place-count-past-the-mantissa',
          group: 'places-out-of-range',
          provenance: { kind: 'found-in-the-wild', report: 'an imaginary report, filed by nobody' },
          rationale: 'Asking for more places than a double can carry cannot be answered exactly.',
          data: encode({ value: 1.5, places: 400, expected: null, reason: 'places-out-of-range' }, 'sixth'),
        },
      ],
    },
  ],
  benchmarks: {
    // The sixth vocabulary, with no member in common with any of the five, which is what
    // `contractAnatomy` records as the thing that must never be mutualised.
    vocabulary: [
      { name: 'already-rounded', meaning: 'the value is unchanged by the call' },
      { name: 'at-a-tie', meaning: 'the value sits exactly halfway, where the rule has to choose' },
      { name: 'ordinary', meaning: 'neither of the above' },
      { name: 'refused', meaning: 'the call cannot be answered exactly' },
    ],
    profiles: [
      {
        name: 'money',
        description: 'Two decimal places on ordinary amounts, the dominant shape.',
        class: 'ordinary',
        samples: { kind: 'carried', values: [encode({ value: 3.14159, places: 2 }, 'sixth')] },
        data: encode({}, 'sixth'),
      },
      {
        /**
         * The other arm of `ProfileSamples`, so that the sixth contract exercises both. Every figure
         * below is computed from the values rather than written, which is what the arm requires of a
         * real contract and what stops this file from fabricating a measurement.
         */
        name: 'ties',
        description: 'Values exactly halfway, where the rounding rule is the whole answer.',
        class: 'at-a-tie',
        samples: {
          kind: 'produced',
          producedBy: 'tiesBelow(3)',
          count: TIE_SAMPLES.length,
          encodedBytes: Buffer.byteLength(canonical(TIE_SAMPLES, 'sixth'), 'utf8'),
          sha256: digestOf(TIE_SAMPLES, 'sixth'),
        },
        data: encode({}, 'sixth'),
      },
    ],
  },
  ownDeclarations: [
    {
      name: 'tieBreaking',
      value: encode('half away from zero, which is what a person writing 1.005 expects', 'sixth'),
      verification: 'documentary',
    },
    {
      name: 'theTrap',
      value: encode(
        [{ name: 'toFixed', statement: 'answers a string, and rounds the double rather than the decimal' }],
        'sixth',
      ),
      verification: 'structural',
    },
  ],
  harness: [
    { path: 'reference.ts', sha256: digestOfBytes(REFERENCE_BYTES), bytes: REFERENCE_BYTES.byteLength },
  ],
  /**
   * A sixth contract shares what the five share, and the digest is the real one this working tree
   * holds rather than a fabricated string - the treatment `REFERENCE_BYTES` already gets.
   *
   * It is one file and not two on purpose. The five reach `identifier.ts` through `edge-cases.ts`, and
   * a sixth contract that carried no case table would reach only `every-contract.ts` - so the shared
   * surface is a property of what a contract imports and never a constant of the catalogue, and a
   * record that could only express the five's list would be the migration this file exists to refuse.
   */
  sharedHarness: [
    {
      path: 'packages/catalogue/every-contract.ts',
      sha256: digestOfBytes(SHARED_BYTES),
      bytes: SHARED_BYTES.byteLength,
    },
  ],
}

describe('a sixth contract enters without a migration', () => {
  /**
   * The load-bearing assertion of this file. Every path the sixth record serves is already
   * classified, so accepting it costs no entry in `FIELD_MAP`, no new member of any union, and no
   * change to the projection - which is what "without a migration" means in a schema whose fields
   * are frozen with the majors they describe.
   */
  it('needs-no-field-the-schema-does-not-have', () => {
    const paths = new Set<string>()
    pathsIn(publicContract(theSixth), '', paths)

    const unclassified = [...paths].filter((path) => FIELD_MAP[path] === undefined).sort()

    expect(unclassified).toEqual([])
  })

  /**
   * The checklist a sixth contract is measured against says, per entry, where it can be settled
   * from - and the one half of that claim a guard can keep is that a new entry carries the verdict.
   *
   * It is here rather than beside `contractAnatomy` because `packages/catalogue/` has no suite of its own and
   * a sixth contract is what that checklist exists for. What it cannot establish is that a verdict is
   * *right*: whether a syntax tree really settles a requirement is decided by writing the check, and
   * three of the eleven are what the pipeline owes.
   */
  it('every-anatomy-requirement-is-triaged', () => {
    const untriaged = contractAnatomy.required.filter(
      (entry) => (entry.checkableFrom as string).trim() === '',
    )

    expect(untriaged.map((entry) => entry.requirement)).toEqual([])
  })

  it('fills-the-fields-none-of-the-five-fills', () => {
    const paths = new Set<string>()
    pathsIn(publicContract(theSixth), '', paths)

    // `provenance.report` is one of the three the field map keeps unfilled with a written reason.
    // A sixth contract reaching it is the evidence that keeping it was right.
    expect(paths.has('caseTables[].cases[].provenance.report')).toBe(true)
    expect(paths.has('identity.relationToTheLanguage')).toBe(true)
  })

  it('brings-a-sixth-benchmark-vocabulary-and-a-new-reason-set', () => {
    const classes = theSixth.benchmarks.vocabulary.map((entry) => entry.name)
    const used = theSixth.benchmarks.profiles.map((profile) => profile.class)

    expect(used.every((entry) => classes.includes(entry))).toBe(true)
    expect(theSixth.surface.failureReasons).toEqual([
      'value-not-finite',
      'places-not-whole',
      'places-out-of-range',
    ])
  })

  it('is-addressable :: the contract, and every case of it', () => {
    expect(contractAddressFaults(theSixth.address)).toEqual([])

    const faults = theSixth.caseTables
      .flatMap((table) => table.cases)
      .flatMap((entry) => caseAddressFaults({ contract: theSixth.address, case: entry.id }))

    expect(faults).toEqual([])
  })

  it('survives-the-wire :: including the negative zero it settles a case on', () => {
    const roundTripped = decode(
      JSON.parse(JSON.stringify(encode(theSixth, 'the-sixth'))) as ReturnType<typeof encode>,
    ) as ContractRecord

    expect(roundTripped.address).toEqual(theSixth.address)
    expect(JSON.stringify(roundTripped)).toBe(JSON.stringify(theSixth))
  })

  /**
   * The other state no contract fills, constructed here rather than argued for. A contract published
   * and then answered by the language stays immutable and stays served; what changes is that its
   * page can say so. `array/group-by@1` is the shape of it and not an instance, having been refused
   * before publication on exactly this measurement.
   */
  it('the-absorbed-state-is-constructible :: the retirement that is not a withdrawal', () => {
    const absorbed: Lifecycle = {
      state: 'absorbed-by-the-language',
      answeredBy: 'Map.groupBy, ES2024',
      measurement: 'answers what this contract requires on all thirty cases of block 4.4',
    }
    const record: ContractRecord = { ...theSixth, lifecycle: absorbed }
    const paths = new Set<string>()
    pathsIn(publicContract(record), '', paths)

    expect([...paths].filter((path) => FIELD_MAP[path] === undefined)).toEqual([])
    expect(paths.has('lifecycle.answeredBy')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// The dependency graph, which the five cannot exercise at all
// ---------------------------------------------------------------------------

/**
 * `dependsOn` is filled by none of the five, and this is where a field nobody fills gets exercised.
 *
 * It is the same device as the record above and for the same reason: the five were written to be a
 * catalogue, not a test fixture, and every one of them has an empty dependency list because permanent
 * rule 2 means the only edges that can ever exist are between registry features and the catalogue has
 * five features that need none. A field whose walk had never been run would be a walk that fails the
 * day the sixth contract imports the fifth - which is exactly what `toopo add` would be doing.
 *
 * **None of these three contracts exists either.** They are addresses and digests over real bytes,
 * shaped like a graph a registry will one day hold, and nothing about rounding, padding or clamping
 * is claimed here.
 *
 * **The shape of the graph is chosen, and the first shape was wrong.** It was written as
 * `round -> pad, clamp, sign` with `clamp -> pad`, and measured: an implementation that pushed each
 * dependency *before* walking into it - a pre-order walk, which writes a dependent before what it
 * imports - produced the identical order and the guard stayed green. `pad` was a direct edge of
 * `round` and the first one, so it came out first either way, and the ordering claim was untestable
 * against the only mutant that can violate it.
 *
 * So `pad` is reached only through its two dependents. Three implementations are reachable, the depth
 * is two, and the two walks now disagree - which is what makes the order an assertion rather than a
 * coincidence.
 *
 *     round -> clamp, sign
 *     clamp -> pad
 *     sign  -> pad
 *
 * **The graph itself is `imagined-graph.ts` and not this file**, because a second consumer arrived for
 * it: `toopo add` resolves the same edges and deduplicates the same shared file, and a fixture copied
 * into two folders is two fixtures that can come to disagree. What moved with it is the whole of the
 * reasoning above, which belongs beside the data rather than beside one of its readers.
 */
const rendered = (records: readonly ImplementationRecord[]): readonly string[] =>
  records.map((record) =>
    renderImplementation({ contract: record.contract, id: record.id, version: record.version ?? '' }),
  )

describe('what `toopo add` has to be told, and a depth could not tell it', () => {
  /**
   * The dedup that matters, and the one a depth cannot express: `pad` is named by two dependents and
   * is installed once. A resolution that returned the walk rather than the set would write it twice.
   */
  it('a-shared-dependency-is-resolved-once :: dependencies before dependents', () => {
    expect(rendered(resolveDependencies(round, HOLDINGS))).toEqual([
      'typescript/string/pad@1/reference@1.0.0',
      'typescript/number/clamp@1/reference@1.0.0',
      'typescript/number/sign@1/reference@1.0.0',
    ])
  })

  /**
   * The order is the answer, not a by-product. Every implementation appears after everything it
   * imports, so an installer writing the list in order never leaves the project between two writes
   * with a file importing something that is not there yet.
   */
  it('nothing-is-written-before-what-it-imports', () => {
    const order = rendered(resolveDependencies(round, HOLDINGS))
    const tooLate = resolveDependencies(round, HOLDINGS).flatMap((record, at) =>
      record.dependsOn
        .map((edge) => renderImplementation(edge.implementation))
        .filter((edge) => order.indexOf(edge) > at),
    )

    expect(tooLate).toEqual([])
  })

  /**
   * The number the field used to carry, now derived from the edges it used to sit beside. Three
   * implementations are reachable and the depth is two, so a derivation that counted the set instead
   * of measuring the longest chain would answer three and redden here.
   */
  it('the-depth-is-derived-from-the-edges :: three reachable, two deep', () => {
    expect(dependencyDepthOf(round, HOLDINGS)).toBe(2)
    expect(dependencyDepthOf(clamp, HOLDINGS)).toBe(1)
    expect(dependencyDepthOf(pad, HOLDINGS)).toBe(0)
  })

  /**
   * A file two features share is recognisable from what a caller already has, by comparing digests -
   * so the registry states nothing extra and the CLI needs no endpoint for it. What the CLI must not
   * do is guess it from the path: `reference.ts` is carried by all four and is four different files.
   */
  it('a-shared-file-is-recognised-by-its-digest-and-never-by-its-path', () => {
    const files = [pad, clamp].flatMap((record) => record.files)
    const digests = new Set(files.map((file) => file.sha256))

    expect(files).toHaveLength(4)
    expect(digests.size).toBe(3)

    const references = HOLDINGS.flatMap((record) =>
      record.files.filter((file) => file.path === 'reference.ts'),
    )

    expect(new Set(references.map((file) => file.sha256)).size).toBe(references.length)
  })

  /**
   * The refusal names the edge, because "a dependency is missing" leaves whoever reads it to find
   * out which - and an install that resolved partially and stopped would already have written files.
   */
  it('an-edge-the-registry-does-not-hold-is-refused', () => {
    expect(() => resolveDependencies(round, [pad, sign])).toThrow(
      /number\/clamp@1\/reference@1\.0\.0 cannot be resolved/,
    )
    expect(() => resolveDependencies(round, [clamp, sign])).toThrow(
      /string\/pad@1\/reference@1\.0\.0 cannot be resolved/,
    )
    expect(() => resolveDependencies(round, [pad, sign])).toThrow(UnresolvedDependency)
  })

  /**
   * An unpublished implementation can never be an edge's target, and it is refused at both ends. The
   * walk cannot resolve one, because `declarationFaults` answers *it is unpublished* before it compares
   * anything; and `edgeTo` cannot mint one at all, because an edge names a published version and a
   * record carries `null` until the publishing tool assigns it. Asserted because "cannot happen" is the
   * claim most worth a guard.
   */
  it('an-unpublished-implementation-cannot-be-depended-on', () => {
    const unpublished = { ...pad, version: null }

    expect(() => resolveDependencies(round, [unpublished, clamp, sign])).toThrow(UnresolvedDependency)
    expect(() => edgeTo(unpublished)).toThrow(/has no version, so nothing can depend on it/)
  })

  /**
   * Every edge resolves, by its own digest, to a snapshot declaring the artefact it names.
   *
   * **The same rule the client applies, with the registry's resolver instead of a wire.** `heldAt`
   * fetches at an edge's digest and asks `declarationFaults` whether what arrived is what was named;
   * here the digest is looked up among the graph's own snapshots and the same question is asked. One
   * fact, one function, two ways of obtaining the thing it is asked about - which is why there is no
   * second comparison written anywhere.
   *
   * It is not a restatement of `edgeTo`. That function reads a digest off one record; this resolves a
   * digest against every snapshot the graph publishes, so an `edgeTo` that derived from the wrong
   * value - the dependent, a file hash, a constant - resolves to nothing or to another artefact and
   * reddens here.
   *
   * All three graphs, because a fixture that was right in the one everybody reads and wrong in the two
   * that are only reached by a removal or an update is a fixture that measures the wrong thing twice.
   */
  it('every-edge-resolves-to-the-artefact-it-names', () => {
    const everyGraph = [HOLDINGS, NEXT_HOLDINGS, INDEPENDENT_CARRIERS]
    const edges = everyGraph.flatMap((graph) => graph.flatMap((record) => record.dependsOn))

    const unresolved = everyGraph.flatMap((graph) => {
      const byDigest = new Map(
        graph.map((record) => [digestOfSnapshot(implementationSnapshot(record)), record]),
      )

      return graph.flatMap((record) =>
        record.dependsOn.flatMap((edge) => {
          const at = byDigest.get(edge.digest)
          if (at === undefined) {
            return [`${renderImplementation(edge.implementation)} carries a digest nothing publishes`]
          }

          return declarationFaults(at, edge.implementation)
        }),
      )
    })

    // Five: the four of the first graph, three of the second - `number/round@1` drops `number/sign@1`
    // there - and none at all between the two independent carriers, which share a file and no edge.
    expect(edges).toHaveLength(7)
    expect(unresolved).toEqual([])
  })

  /**
   * Two artefacts that import each other cannot both have been published second, so a cycle is a
   * corrupt ledger. It is refused rather than deduplicated away, because an installer that survived
   * one would write a project whose imports do not terminate.
   */
  it('a-cycle-is-refused-rather-than-deduplicated-away', () => {
    const padThroughClamp = { ...pad, dependsOn: [edgeTo(clamp)] }

    expect(() => resolveDependencies(round, [padThroughClamp, clamp, sign])).toThrow(
      /imports itself through/,
    )
    expect(() => dependencyDepthOf(round, [padThroughClamp, clamp, sign])).toThrow(
      UnresolvedDependency,
    )
  })
})
