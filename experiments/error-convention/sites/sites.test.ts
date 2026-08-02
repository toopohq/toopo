/**
 * Experiment material. Every call site is exercised in all three forms and required to answer
 * identically, so that the counts of the site measurement are counts of working code rather than
 * counts of a sketch. A trio that disagreed would mean the forms are not doing the same job, and
 * comparing their size would mean nothing.
 *
 * Run by `npm run test:experiment`, never by `npm test`: these files are not part of any contract's
 * verification, and collecting them into the contracts' suite would put them inside every mutation
 * run.
 */

import { describe, it, expect } from 'vitest'
import type { Duration } from '../../../contracts/date/add/contract.js'
import type { ScheduleRow } from './batch-report.js'
import { LAST_REPRESENTABLE } from './backoff-outcome.js'
import { schedule as scheduleA } from './site-7-schedule-form.a.js'
import { schedule as scheduleB } from './site-7-schedule-form.b.js'
import { schedule as scheduleC } from './site-7-schedule-form.c.js'
import { reportOn as reportA } from './site-8-batch-report.a.js'
import { reportOn as reportB } from './site-8-batch-report.b.js'
import { reportOn as reportC } from './site-8-batch-report.c.js'
import { nextAttempt as attemptA } from './site-9-backoff-cap.a.js'
import { nextAttempt as attemptB } from './site-9-backoff-cap.b.js'
import { nextAttempt as attemptC } from './site-9-backoff-cap.c.js'

const START = new Date('2024-01-15T00:00:00.000Z')
const NOT_A_DATE = new Date('not a date')

describe('site 7 - a form that names what to correct', () => {
  /**
   * One case per reason, because a site that told two of them apart and collapsed the other four
   * would be a site that does not need the reason and would flatter every form equally.
   */
  const cases: readonly [string, Date, Duration, string][] = [
    ['a duration that adds', START, { days: 7 }, 'scheduled'],
    ['a start that is not a date', NOT_A_DATE, { days: 1 }, 'That start time is not a date.'],
    [
      'a field the contract does not declare',
      START,
      { day: 1 } as Duration,
      'That duration names a field this calendar does not have.',
    ],
    ['a field that is not whole', START, { days: 0.5 }, 'Durations must be written in whole units.'],
    [
      'a month total that is not exact',
      START,
      { years: Number.MAX_SAFE_INTEGER },
      'That duration is too large to add exactly.',
    ],
    [
      'an elapsed total that is not exact',
      START,
      { seconds: Number.MAX_SAFE_INTEGER, milliseconds: Number.MAX_SAFE_INTEGER },
      'That duration is too large to add exactly.',
    ],
    [
      'a result outside the representable range',
      LAST_REPRESENTABLE,
      { months: 1 },
      'That lands outside the range a date can hold.',
    ],
  ]

  for (const [name, start, duration, expected] of cases) {
    it(`${name}, in all three forms`, () => {
      const answers = [scheduleA, scheduleB, scheduleC].map((form) => {
        const outcome = form(start, duration)

        return outcome.kind === 'scheduled' ? 'scheduled' : outcome.message
      })

      expect(answers).toEqual([expected, expected, expected])
    })
  }

  it('schedules to the same instant in all three forms', () => {
    const answers = [scheduleA, scheduleB, scheduleC].map((form) => {
      const outcome = form(START, { days: 7 })

      return outcome.kind === 'scheduled' ? outcome.runsAt.toISOString() : outcome.kind
    })

    expect(answers).toEqual(Array(3).fill('2024-01-22T00:00:00.000Z'))
  })
})

describe('site 8 - a batch tallying its refusals by reason', () => {
  const rows: readonly ScheduleRow[] = [
    { start: START, duration: { days: 7 } },
    { start: NOT_A_DATE, duration: { days: 1 } },
    { start: START, duration: { days: 0.5 } },
    { start: START, duration: { months: 1 } },
    { start: START, duration: { day: 1 } as Duration },
    { start: LAST_REPRESENTABLE, duration: { months: 1 } },
    { start: START, duration: { hours: 12 } },
    { start: NOT_A_DATE, duration: {} },
  ]

  const expected = {
    scheduled: ['2024-01-22T00:00:00.000Z', '2024-02-15T00:00:00.000Z', '2024-01-15T12:00:00.000Z'],
    refusedByReason: [
      ['invalid-date', 2],
      ['field-not-whole', 1],
      ['unknown-field', 1],
      ['out-of-range', 1],
    ],
  }

  for (const [name, form] of [
    ['A', reportA],
    ['B', reportB],
    ['C', reportC],
  ] as const) {
    it(`reports the same batch in form ${name}`, () => {
      const report = form(rows)

      expect({
        scheduled: report.scheduled.map((date) => date.toISOString()),
        refusedByReason: [...report.refusedByReason].sort(),
      }).toEqual({
        scheduled: expected.scheduled,
        refusedByReason: [...expected.refusedByReason].sort(),
      })
    })
  }
})

describe('site 9 - a retry schedule that caps rather than fails', () => {
  it('answers the ordinary case identically in all three forms', () => {
    const answers = [attemptA, attemptB, attemptC].map((form) => {
      const outcome = form(START, { minutes: 5 })

      return `${outcome.kind} ${outcome.at.toISOString()}`
    })

    expect(answers).toEqual(Array(3).fill('retry-at 2024-01-15T00:05:00.000Z'))
  })

  it('caps at the last representable instant in all three forms', () => {
    // The month shift is what puts this call out of range, so it is also the case where asking for
    // the reason afterwards repeats the whole computation rather than the first check of it.
    const answers = [attemptA, attemptB, attemptC].map((form) => {
      const outcome = form(LAST_REPRESENTABLE, { months: 1 })

      return `${outcome.kind} ${outcome.at.toISOString()}`
    })

    expect(answers).toEqual(Array(3).fill(`capped ${LAST_REPRESENTABLE.toISOString()}`))
  })

  it('refuses to cap a backoff that was never a duration, in all three forms', () => {
    for (const form of [attemptA, attemptB, attemptC]) {
      expect(() => form(START, { days: 0.5 })).toThrow('backoff cannot be applied: field-not-whole')
    }
  })
})
