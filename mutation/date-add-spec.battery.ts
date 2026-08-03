/**
 * The `date/add@1` specification battery.
 *
 * The reference battery injects into `reference.ts` and asks whether the contract catches a broken
 * implementation. This one injects into `contract.ts` and `edge-cases.ts` and asks whether it
 * catches a broken *specification*. Why it is a second battery rather than a second arm or lens, and
 * the two limits measured while writing the first one, are stated in `number-parse-spec.battery.ts`
 * and are not repeated here.
 *
 * DA-14 is the mutant this battery was worth writing for on its own. `leaves every duration field
 * optional` compares `Duration` against `Partial<Duration>` and reads both sides out of
 * `contract.ts`, so the reference battery declared it out of reach after S-12 to S-15 measured that
 * no edit to `reference.ts` can make it fail. Making one field required reddens it, which turns that
 * declaration from an argument into a measurement: the guard is reachable, and it is reachable from
 * exactly one side.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { contract, edgeCases, killed, killedByTypecheck, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'C', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const FAILURE_REASONS = `export const failureReasons = [
  'invalid-date',
  'unknown-field',
  'field-not-whole',
  'total-not-exact',
  'out-of-range',
] as const`

const NO_AMBIENT_OUTPUT = `    name: 'no ambient output',
    applicable: false,`

const OPTIONAL_DAYS = `  readonly days?: number | undefined`

const ELAPSED_FIELDS = `    fields: ['weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'],`

const GLOBAL_STATE_REASON = `    forbiddenMethods: [],
    reason:
      'A feature may not read or write anything outside its arguments and its own module scope. ' +
      'Unreachable by property: a test cannot observe a write that happened before it ran, and a ' +
      'correct cache is indistinguishable from a defect by behaviour alone.',`

const KATHMANDU_OFFSET = `    offsetMinutes: { january: -345, july: -345 },`

const ZONE_PROBES = `export const ambientTimeZoneProbes = [
  {
    timeZone: 'UTC',
    offsetMinutes: { january: 0, july: 0 },
    role: 'control - agrees with every other zone, and alone cannot see the defect',
  },
  {
    timeZone: 'Europe/Paris',
    offsetMinutes: { january: -60, july: -120 },
    role: 'changes offset twice a year, so a local civil day is sometimes 23 or 25 hours',
  },
  {
    timeZone: 'Asia/Kathmandu',
    offsetMinutes: { january: -345, july: -345 },
    role: 'offset that is not a whole number of hours, and never changes',
  },
  {
    timeZone: 'Pacific/Chatham',
    offsetMinutes: { january: -825, july: -765 },
    role: 'both at once - a quarter-hour offset that also shifts twice a year',
  },
] as const`

const ELAPSED_PROFILE_SAMPLES = `    samples: [
      { date: '2024-06-15T12:00:00.000Z', duration: { hours: 1 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { minutes: 30 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { days: 7 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { weeks: 2, days: 3 } },
      { date: '2024-06-15T12:00:00.000Z', duration: { milliseconds: 250 } },
    ],`

const ORDINARY_DAY_RATIONALE = `    rationale: 'An ordinary day is added, and the time of day is untouched.',`

const ORDINARY_DAY_CASE = `    date: '2024-01-15T10:30:00.000Z',
    duration: { days: 1 },
    expected: '2024-01-16T10:30:00.000Z',
    reason: null,
    provenance: 'specified',`

const EPOCH_EXPECTED = `    expected: '1970-01-01T00:00:00.000Z',`

const CLAMP_CASE = `    date: '2024-01-31T00:00:00.000Z',
    duration: { months: 1 },
    expected: '2024-02-29T00:00:00.000Z',`

const HALF_A_DAY = `    duration: { days: 0.5 },`

// ---------------------------------------------------------------------------
// Guards this battery pins by name
// ---------------------------------------------------------------------------

const REASONS_AGREE = 'names a case for every declared reason, and declares every reason it names'
const EVERY_CALL_ONCE = 'settles each call exactly once across both tables'
const EVERY_CASE_JUSTIFIED = 'publishes a rationale for every decision'
const INSTANTS_ROUND_TRIP = 'writes every expected instant in a form that survives a round trip'
const EVERY_PROFILE_POPULATED = 'declares a non-empty sample set for every profile'
const INAPPLICABLE_STAY_INAPPLICABLE = 'keeps the inapplicable universal properties declared as such'
const ORDER_COVERS_EVERY_FIELD = 'the declared application order covers every duration field exactly once'
const EVERY_REQUIREMENT_EXPLAINED = 'publishes a reason for every static analysis requirement'
const ZONES_TAKE_EFFECT = 'the declared time zones take effect in this runtime'
const ZONES_DISAGREE = 'the declared time zones do not all agree with each other'

const TYPE_IDENTITY = 'matches the type declared by the contract'
const ACCEPTS_A_DATE_AND_A_DURATION = 'accepts a Date and a Duration, and nothing else'
const EVERY_FIELD_OPTIONAL = 'leaves every duration field optional'
const DIAGNOSTIC_TYPE = 'publishes the diagnostic surface with the type the contract declares'

const EVERY_ID_UNIQUE = 'addresses each case with a unique identifier'
const CLAMP_CASE_ID = 'clamp-to-the-end-of-february'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'DA-1',
    'a case published with no justification. It is the calibration mutant of this battery, for the ' +
      'reason NP-1 is on the other contract: the guard it reddens is the catalogue\'s own, carried ' +
      'identically by all three contracts, so an apparatus blind to it is blind to the whole family',
    [edgeCases(ORDINARY_DAY_RATIONALE, `    rationale: '',`)],
    killed([EVERY_CASE_JUSTIFIED]),
  ),
  sameOnEveryLens(
    'DA-2',
    'an inapplicable universal property promoted to applicable. `no ambient output` is the one the ' +
      'catalogue measured cannot be reached by a property at all, and this contract answers it with ' +
      'a static analysis requirement instead - so the flag is the only place that decision is ' +
      'recorded as a decision rather than as an omission',
    [contract(NO_AMBIENT_OUTPUT, `    name: 'no ambient output',\n    applicable: true,`)],
    killed([INAPPLICABLE_STAY_INAPPLICABLE]),
  ),
  sameOnEveryLens(
    'DA-3',
    'a reason declared and never produced. `field-wrong-type` is the literal block 4.2 argues ' +
      'against by name: a string is not a whole number either, so `{ days: "1" }` and ' +
      '`{ days: 0.5 }` are told the same true sentence. Declaring it would freeze a branch into the ' +
      'major that no input reaches. Two guards see it, and one of them is the compiler - the ' +
      'declared reason set is the return type of the diagnostic',
    [
      contract(
        FAILURE_REASONS,
        FAILURE_REASONS.replace(`  'out-of-range',\n`, `  'out-of-range',\n  'field-wrong-type',\n`),
      ),
    ],
    killed([REASONS_AGREE, DIAGNOSTIC_TYPE]),
  ),
  sameOnEveryLens(
    'DA-4',
    'a reason produced and never declared - the same guard from the other side, and the mutant that ' +
      'measures how much of this contract the compiler holds. Removing `total-not-exact` is the ' +
      'revision block 4.2 argues against from the opposite direction: the literal covers both totals ' +
      'because a caller repairs both the same way. The entries typed against it stop compiling, and ' +
      'the run reports source errors no guard names',
    [contract(FAILURE_REASONS, FAILURE_REASONS.replace(`  'total-not-exact',\n`, ''))],
    killed([REASONS_AGREE, DIAGNOSTIC_TYPE]),
  ),
  sameOnEveryLens(
    'DA-5',
    'a provenance outside the vocabulary the catalogue declares - the part of the specification the ' +
      'compiler holds alone. The catalogue says in writing that no test can check a declared ' +
      'provenance; this measures the consequence instead of restating it',
    [edgeCases(ORDINARY_DAY_CASE, ORDINARY_DAY_CASE.replace(`'specified'`, `'assumed'`))],
    killedByTypecheck,
  ),
  sameOnEveryLens(
    'DA-6',
    'an expected instant written in a form a round trip does not survive: the epoch-crossing case ' +
      'with its milliseconds dropped. The case itself still passes - `new Date` parses it and it is ' +
      'the same instant - which is exactly why the guard beside it exists. An expectation the ' +
      'framework could not parse back would become NaN and compare equal to nothing, turning a real ' +
      'assertion into an unfalsifiable one, and only this guard would notice',
    [edgeCases(EPOCH_EXPECTED, `    expected: '1970-01-01T00:00:00Z',`)],
    killed([INSTANTS_ROUND_TRIP]),
  ),
  sameOnEveryLens(
    'DA-7',
    'the clamp settled as an overflow: 31 January plus a month specified as 2 March, which is what ' +
      'JavaScript\'s own `setUTCMonth` answers and what the contract rejects six libraries in favour ' +
      'of. It is the single most load-bearing decision in this table specified backwards. It used to ' +
      'be pinned on a title the unmutated contract does not contain, because this table rendered its ' +
      'titles from the data being mutated; the case identifier is what lets it name the guard it was ' +
      'written for',
    [
      edgeCases(
        CLAMP_CASE,
        `    date: '2024-01-31T00:00:00.000Z',\n    duration: { months: 1 },\n    expected: '2024-03-02T00:00:00.000Z',`,
      ),
    ],
    killed([CLAMP_CASE_ID]),
  ),
  sameOnEveryLens(
    'DA-8',
    'one call renamed onto another, so block 4.4 settles the same date and duration twice. Half a ' +
      'day and NaN days are two different refusals of the same rule and carry the same answer and ' +
      'the same reason, so both copies pass and the duplication guard is the only thing that sees ' +
      'it. Written as a rename rather than as an added case, because adding one grows the suite by ' +
      'four tests and the count check refuses the cell before any guard can speak',
    [edgeCases(HALF_A_DAY, `    duration: { days: Number.NaN },`)],
    killed([EVERY_CALL_ONCE]),
  ),
  sameOnEveryLens(
    'DA-9',
    'a benchmark profile emptied of its samples. The class assertion beside it passes on an empty ' +
      'list, which is why the emptiness guard is separate rather than a clause of it',
    [contract(ELAPSED_PROFILE_SAMPLES, `    samples: [],`)],
    killed([EVERY_PROFILE_POPULATED]),
  ),
  sameOnEveryLens(
    'DA-10',
    'a duration field dropped from the declared application order. `weeks` is the field to drop: it ' +
      'is the one a reader is most likely to think of as elapsed-time shorthand rather than as a ' +
      'unit the contract has to place, and an order that covers seven of eight fields declares half ' +
      'a rule while looking complete',
    [contract(ELAPSED_FIELDS, `    fields: ['days', 'hours', 'minutes', 'seconds', 'milliseconds'],`)],
    killed([ORDER_COVERS_EVERY_FIELD]),
  ),
  sameOnEveryLens(
    'DA-11',
    'a static analysis requirement published with no reason. These are the requirements no property ' +
      'can reach, declared in public precisely because a requirement that lives only inside a tool ' +
      'nobody can read is not part of a contract whose product is auditability - and an unexplained ' +
      'one is the same failure one step further along',
    [contract(GLOBAL_STATE_REASON, `    forbiddenMethods: [],\n    reason: '',`)],
    killed([EVERY_REQUIREMENT_EXPLAINED]),
  ),
  sameOnEveryLens(
    'DA-12',
    'a declared time-zone offset the runtime does not produce. The offsets are what makes the zone ' +
      'list a claim rather than four names: a zone whose declared offset is wrong is a zone nobody ' +
      'has checked is the zone they meant, and the property that runs under it would still be green',
    [contract(KATHMANDU_OFFSET, `    offsetMinutes: { january: -330, july: -330 },`)],
    killed([ZONES_TAKE_EFFECT]),
  ),
  sameOnEveryLens(
    'DA-13',
    'the zone list collapsed onto four zones that really are UTC all year - the simplification a ' +
      'reader proposes when a test is slow, and the one that makes the substantive property of this ' +
      'contract vacuous without making it fail. Every declared offset is still true of its zone, so ' +
      'the guard beside it stays green; what goes red is the one that requires the zones to ' +
      'disagree. Block 4.3 records the measurement this defends: a local-time implementation and a ' +
      'UTC one return the same instant on 100 cases out of 100 when the process runs in UTC',
    [
      contract(
        ZONE_PROBES,
        `export const ambientTimeZoneProbes = [
  {
    timeZone: 'UTC',
    offsetMinutes: { january: 0, july: 0 },
    role: 'control - agrees with every other zone, and alone cannot see the defect',
  },
  {
    timeZone: 'Africa/Abidjan',
    offsetMinutes: { january: 0, july: 0 },
    role: 'a second zone at the same offset, all year',
  },
  {
    timeZone: 'Atlantic/Reykjavik',
    offsetMinutes: { january: 0, july: 0 },
    role: 'a third zone at the same offset, all year',
  },
  {
    timeZone: 'Africa/Accra',
    offsetMinutes: { january: 0, july: 0 },
    role: 'a fourth zone at the same offset, all year',
  },
] as const`,
      ),
    ],
    killed([ZONES_DISAGREE]),
  ),
  sameOnEveryLens(
    'DA-14',
    'one duration field made required. It is the mutant the reference battery could not write: ' +
      '`leaves every duration field optional` compares `Duration` against `Partial<Duration>` and ' +
      'reads both sides out of `contract.ts`, so S-12 to S-15 measured that no edit to ' +
      '`reference.ts` reaches it and it was declared out of that battery\'s reach. It is reachable ' +
      'from here, and the defect is the plausible one: `{ days: form.days }` is ordinary TypeScript ' +
      'and a duration that must carry `days` makes `{ months: 1 }` a compile error. Four guards of ' +
      'block 4.2 go red together, because the declared type is the input of all four',
    [contract(OPTIONAL_DAYS, `  readonly days: number | undefined`)],
    killed([TYPE_IDENTITY, ACCEPTS_A_DATE_AND_A_DURATION, EVERY_FIELD_OPTIONAL, DIAGNOSTIC_TYPE]),
  ),
  sameOnEveryLens(
    'DA-15',
    'one case addressed by another case\'s identifier, so two rows of block 4.4 answer to one name. ' +
      'Half a day and a fractional month are two refusals of one rule and would read as one case ' +
      'under one address, which is what an identifier that is not unique costs. Both rows go on ' +
      'passing - each answers its own data - so the catalogue guard introduced with the identifier ' +
      'is the only thing that sees it. A rename rather than an added case, for the reason DA-8 is one',
    [edgeCases(`    id: 'half-a-day',`, `    id: 'a-fractional-month',`)],
    killed([EVERY_ID_UNIQUE]),
  ),
]

export const battery: Battery = {
  name: 'date-add-spec',
  contractPath: 'contracts/date/add',
  timeZone: 'UTC',
  calibrationMutant: 'DA-1',

  arms: [
    {
      id: 'C',
      ref: 'HEAD',
      convention: 'failure reported as null, with the reason published beside the return channel',
    },
  ],

  lenses: [
    {
      id: 'as-committed',
      description: 'the arm exactly as its commit left it',
      arms: ['C'],
      edits: [],
    },
  ],

  unreachableGuards: [
    {
      reason:
        'over the implementation rather than over the contract\'s declarations. This battery injects ' +
        'into `contract.ts` and `edge-cases.ts`, and these read neither: one compares the reference\'s ' +
        'own return type against a type written beside it, and the rest quantify over answers this ' +
        'battery does not change. The reference battery witnesses every one of them.',
      guards: [
        'returns a Date that may be absent, never an Invalid Date',
        'P1 - returns null or a valid Date, never an Invalid Date',
        'P2 - the empty duration is neutral: it always answers, with the same instant in a new object',
        'P3 - adding milliseconds shifts the instant by exactly that many',
        'P4 - an elapsed-time duration and its negation cancel exactly',
        'P5 - a calendar-only duration never changes the UTC time of day',
        'P6 - the day of the month never grows under a calendar-only duration',
        'P7 - a call fails exactly when it has a description',
        'never mutates its arguments',
      ],
    },
    {
      reason:
        'over the harness inside `properties.test.ts` rather than over the declarations. These two ' +
        'establish that the zone property puts the ambient zone back where it found it, and the ' +
        'restore they police is written in that file: no declaration decides their verdict. The ' +
        'reference battery cannot reach them either, for the mirror reason, so they are the two ' +
        'guards of this contract no battery in this repository can redden - which is stated here ' +
        'rather than left for a reader to notice.',
      guards: [
        'has left the ambient time zone exactly as it found it',
        'restores both a zone that was set and a zone that was absent',
      ],
    },
    {
      reason:
        'reads `ambientTimeZoneProbes`, so this battery decides what it runs under - and cannot make ' +
        'it fail. The property compares this implementation\'s answers with each other, and this ' +
        'implementation is zone-independent whatever list it is given; a wrong list makes it ' +
        'vacuous, not red. DA-13 is that list, and the guard that catches it is the one requiring ' +
        'the zones to disagree, which is why the two exist as a pair.',
      guards: ['has no ambient input - the answer does not depend on the process time zone'],
    },
  ],

  unprobedRegions: [
    {
      nature: 'claims detection',
      reason:
        'reachable from here only through `outputsAreEqual`, which lives in `contract.ts` and which ' +
        'this battery does not mutate. Both compare two answers with the contract\'s declared ' +
        'equality, so a mutant that broke that function would redden them - and a defect of the ' +
        'contract\'s own comparison is a fifth family, not one of the four written here. The ' +
        'reference battery witnesses both: D-18 and D-22.',
      guards: [
        'is deterministic - the same call yields the same answer every time',
        'has no ambient input - an answer does not depend on the calls made before it',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the four benchmark profiles DA-9 leaves alone. Each publishes a claim about what its ' +
        'samples do, and one mutant per profile would repeat one sentence five times.',
      guards: [
        'calendar-only - every sample is accepted',
        'clamping - every sample is accepted',
        'every-field - every sample is accepted',
        'rejected-inputs - every sample is rejected',
        'elapsed-time-only - every sample is accepted',
      ],
    },
    {
      nature: 'documents a decision',
      reason:
        'the cases of block 4.4 no mutant here rewrites, and this list is what the case identifier ' +
        'bought. The same declaration used to name all four suites whole, on the grounds that the ' +
        'silence was the instrument\'s: DA-7 did redden a guard in there, under a title the unmutated ' +
        'contract does not contain, so attribution could not see it and all eighty-six read as ' +
        'silent. They are now addressed by name, DA-7 reddens the case it was written for, and what ' +
        'is left is a measurement of this battery. The three whole suites are whole for reasons of ' +
        'their own: no mutant here changes a reason, DA-6 rewrites an expected instant into a form ' +
        'that still parses to the same one - which is exactly why the round-trip guard beside it ' +
        'exists - and nothing rewrites the untyped table at all.',
      suites: [
        'date/add@1 named edge cases, described',
        'date/add@1 edge cases outside the declared type',
        'date/add@1 edge cases outside the declared type, described',
      ],
      guards: [
        'an-ordinary-day',
        'minutes-carry-into-hours',
        'the-epoch-is-not-a-boundary',
        'clamp-in-a-common-year',
        'clamp-into-a-thirty-day-month',
        'clamp-going-backwards',
        'the-clamp-does-not-round-trip',
        'the-clamp-keeps-the-time-of-day',
        'a-leap-day-plus-one-year',
        'a-leap-day-plus-four-years',
        'the-century-rule',
        'a-two-digit-year',
        'year-zero',
        'two-months-aggregated',
        'years-and-months-are-one-total',
        'weeks-and-days-are-one-total',
        'a-week-never-clamps',
        'calendar-before-elapsed-hours',
        'calendar-before-elapsed-days',
        'a-negative-field-subtracts',
        'fields-of-opposite-sign',
        'the-empty-duration',
        'a-negative-zero-field',
        'a-field-set-to-undefined',
        'a-fractional-month',
        'half-a-day',
        'a-field-that-is-not-a-number',
        'an-infinite-field',
        'a-field-past-the-safe-range',
        'two-fields-whose-total-cancels',
        'a-month-total-that-is-not-exact',
        'an-elapsed-total-that-is-not-exact',
        'an-input-that-is-not-a-date',
        'an-input-that-is-not-a-date-with-the-empty-duration',
        'the-last-representable-instant',
        'one-millisecond-past-the-end-of-the-range',
        'one-millisecond-before-the-start-of-the-range',
        'an-intermediate-step-outside-the-range',
      ],
    },
  ],

  mutants,
}
