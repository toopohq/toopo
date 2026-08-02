/**
 * Experiment material. The four-link chain is exercised in all three forms and required to answer
 * identically, including on each of its four failure paths. A chain whose forms disagreed would
 * make the comparison of their sizes meaningless.
 */

import { describe, it, expect } from 'vitest'
import { renewalDate as chainA } from './chain-renewal.a.js'
import { renewalDate as chainB } from './chain-renewal.b.js'
import { renewalDate as chainC } from './chain-renewal.c.js'
import type { RenewalOutcome } from './renewal-outcome.js'

const signedUpAt = new Date('2024-01-15T10:30:00.000Z')

const renewsAt = (iso: string): RenewalOutcome => ({ kind: 'ok', renewsAt: new Date(iso) })

const cases: readonly [string, string, string, RenewalOutcome][] = [
  ['both stages answer', '30', '7', renewsAt('2024-02-21T10:30:00.000Z')],
  ['an empty grace field is no grace period', '30', '', renewsAt('2024-02-14T10:30:00.000Z')],
  ['a blank grace field is no grace period', '30', '   ', renewsAt('2024-02-14T10:30:00.000Z')],
  ['an unreadable trial length', 'thirty', '7', { kind: 'unreadable-trial' }],
  ['a trial length with no date', '1e21', '7', { kind: 'trial-out-of-range' }],
  ['an unreadable grace period', '30', 'seven', { kind: 'unreadable-grace' }],
  ['a grace period with no date', '30', '1e21', { kind: 'grace-out-of-range' }],
]

describe('the four-link chain answers identically in the three forms', () => {
  for (const [label, trial, grace, expected] of cases) {
    it(label, () => {
      expect(chainA(signedUpAt, trial, grace)).toEqual(expected)
      expect(chainB(signedUpAt, trial, grace)).toEqual(expected)
      expect(chainC(signedUpAt, trial, grace)).toEqual(expected)
    })
  }
})
