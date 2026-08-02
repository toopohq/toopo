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
import { readTimeoutMs as timeoutA } from './site-1-default-value.a.js'
import { readTimeoutMs as timeoutB } from './site-1-default-value.b.js'
import { readTimeoutMs as timeoutC } from './site-1-default-value.c.js'
import { priceFieldError as priceA } from './site-2-form-message.a.js'
import { priceFieldError as priceB } from './site-2-form-message.b.js'
import { priceFieldError as priceC } from './site-2-form-message.c.js'
import { readColumn as columnA } from './site-3-csv-import.a.js'
import { readColumn as columnB } from './site-3-csv-import.b.js'
import { readColumn as columnC } from './site-3-csv-import.c.js'
import { resolvePort as portA } from './site-4-environment-variable.a.js'
import { resolvePort as portB } from './site-4-environment-variable.b.js'
import { resolvePort as portC } from './site-4-environment-variable.c.js'
import { expiryFrom as expiryA } from './site-5-composition.a.js'
import { expiryFrom as expiryB } from './site-5-composition.b.js'
import { expiryFrom as expiryC } from './site-5-composition.c.js'

describe('site 1 - a default value on failure', () => {
  const cases: readonly [string, number][] = [
    ['500', 500],
    ['', 30_000],
    ['abc', 30_000],
    ['0', 0],
  ]

  for (const [raw, expected] of cases) {
    it(`${JSON.stringify(raw)} -> ${expected}, in all three forms`, () => {
      expect([timeoutA(raw), timeoutB(raw), timeoutC(raw)]).toEqual([expected, expected, expected])
    })
  }
})

describe('site 2 - a differentiated message under a form field', () => {
  const cases: readonly [string, string | null][] = [
    ['12.50', null],
    ['', 'Enter a price.'],
    ['   ', 'Enter a price.'],
    ['abc', 'Enter a price like 12.50.'],
    ['1e400', 'That price is too large.'],
  ]

  for (const [raw, expected] of cases) {
    it(`${JSON.stringify(raw)} -> ${expected ?? 'no error'}, in all three forms`, () => {
      expect([priceA(raw), priceB(raw), priceC(raw)]).toEqual([expected, expected, expected])
    })
  }
})

describe('site 3 - a CSV column telling a blank cell from an invalid one', () => {
  it('classifies every cell identically in all three forms', () => {
    const cells = ['1', '', '   ', 'x', '2.5', '0']
    const expected = [
      { kind: 'value', value: 1 },
      { kind: 'blank' },
      { kind: 'blank' },
      { kind: 'invalid' },
      { kind: 'value', value: 2.5 },
      { kind: 'value', value: 0 },
    ]

    expect(columnA(cells)).toEqual(expected)
    expect(columnB(cells)).toEqual(expected)
    expect(columnC(cells)).toEqual(expected)
  })
})

describe('site 4 - an environment variable where absence and invalidity diverge', () => {
  const accepted: readonly [string | undefined, number][] = [
    [undefined, 3000],
    ['', 3000],
    ['   ', 3000],
    ['8080', 8080],
  ]

  for (const [raw, expected] of accepted) {
    it(`${JSON.stringify(raw)} -> ${expected}, in all three forms`, () => {
      expect([portA(raw), portB(raw), portC(raw)]).toEqual([expected, expected, expected])
    })
  }

  it('stops the process on a value that is present and wrong, in all three forms', () => {
    expect(() => portA('http://localhost')).toThrow('PORT must be a number')
    expect(() => portB('http://localhost')).toThrow('PORT must be a number')
    expect(() => portC('http://localhost')).toThrow('PORT must be a number')
  })
})

describe('site 5 - number/parse feeding date/add', () => {
  const issued = new Date('2024-01-15T10:30:00.000Z')

  it('reaches the expiry when both stages answer, in all three forms', () => {
    const expected = { kind: 'ok', date: new Date('2024-02-14T10:30:00.000Z') }

    expect(expiryA(issued, '30')).toEqual(expected)
    expect(expiryB(issued, '30')).toEqual(expected)
    expect(expiryC(issued, '30')).toEqual(expected)
  })

  it('names the first stage when the retention cannot be read, in all three forms', () => {
    expect(expiryA(issued, 'thirty')).toEqual({ kind: 'unreadable-retention' })
    expect(expiryB(issued, 'thirty')).toEqual({ kind: 'unreadable-retention' })
    expect(expiryC(issued, 'thirty')).toEqual({ kind: 'unreadable-retention' })
  })

  it('names the second stage when the expiry has no date, in all three forms', () => {
    expect(expiryA(issued, '1e21')).toEqual({ kind: 'out-of-range' })
    expect(expiryB(issued, '1e21')).toEqual({ kind: 'out-of-range' })
    expect(expiryC(issued, '1e21')).toEqual({ kind: 'out-of-range' })
  })
})
