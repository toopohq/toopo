import { describe, it, expect } from 'vitest'

import { caseAddressFaults, contractAddressFaults } from './address.js'
import { canonical, digestOf, digestOfBytes, servedBytes } from './canonical.js'
import type { ContractRecord, Lifecycle } from './contract-record.js'
import { FIELD_MAP, pathsIn, publicContract } from './field-map.js'
import { decode, encode } from './value.js'

/**
 * A sixth contract enters this schema without a migration, measured rather than asserted.
 *
 * **What this file is.** A `ContractRecord` written by hand for a contract that does not exist, so
 * that the schema can be asked whether it would accept one. It is the concrete form of the design
 * criterion the decision to launch at five imposes: build the machine that serves exactly five
 * contracts and accepts a sixth, not one dimensioned for a catalogue nobody has.
 *
 * **What this file is not, and this matters more.** `number/round@1` **is not in the catalogue and
 * may never be.** There is no `contracts/number/round` folder, no reference implementation, no
 * property, no battery and no admission decision - and writing one would be about ninety-seven
 * decisions this unit has no business taking. Nothing here has been verified about rounding, the
 * answers below are plausible rather than settled, and no part of it should ever be copied into a
 * contract folder. It lives under `registry/` for the same reason the instrument's fixture lives
 * under `mutation/`: `contracts/` is the catalogue and nothing else.
 *
 * **What it is chosen to stress.** Everything the five could not stress at once: a reason set no
 * contract carries, a *sixth* benchmark vocabulary - which is what `contractAnatomy` predicts, five
 * contracts having produced five with no overlap - own declarations with names this schema has never
 * seen, and a `found-in-the-wild` provenance, which is a member of the catalogue's own `Provenance`
 * type that none of the five fills. If a sixth contract needed a field, this is where it would show.
 */

const CONTRACT = { language: 'typescript', name: 'number/round', major: 1 } as const

const NOT_YET_PUBLISHED: Lifecycle = { state: 'not-yet-published' }

/**
 * A real digest over real bytes, so that nothing here is a fabricated measurement - and taken by the
 * same two functions a real file goes through, so that the hand-written record is not hashed by a
 * path no contract uses.
 */
const REFERENCE_SOURCE = 'export const round = (value: number, places: number): number | null => null\n'
const REFERENCE_BYTES = servedBytes(Buffer.from(REFERENCE_SOURCE, 'utf8'))

/** The values the `produced` arm below points at, so that its count and digest are read off them. */
const TIE_SAMPLES = [
  encode({ value: 1.005, places: 2 }, 'sixth'),
  encode({ value: 2.675, places: 2 }, 'sixth'),
]

const theSixth: ContractRecord = {
  address: CONTRACT,
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
    relationToTheLanguage: 'the language ships `toFixed`, which answers a string and rounds by the ' +
      'double nearest the input rather than by the decimal the caller wrote',
  },
  surface: {
    exports: [
      {
        name: 'round',
        typeName: 'Round',
        text: '(value: number, places: number) => number | null',
        role: 'the-answer',
      },
      {
        name: 'describeRoundFailure',
        typeName: 'DescribeRoundFailure',
        text: '(value: number, places: number) => RoundFailureReason | null',
        role: 'the-diagnostic',
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
      cases: [
        {
          id: 'the-half-cent-that-toFixed-loses'.toLowerCase(),
          provenance: { kind: 'specified' },
          rationale:
            'The double nearest 1.005 is below it, so `toFixed(2)` answers "1.00" where a caller ' +
            'writing 1.005 means the decimal.',
          data: encode({ value: 1.005, places: 2, expected: 1.01, reason: null }, 'sixth'),
        },
        {
          id: 'a-negative-zero-survives',
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
    measurements: [],
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

  it('fills-two-fields-none-of-the-five-fills', () => {
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
