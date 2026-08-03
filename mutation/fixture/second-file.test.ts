import { describe, it, expect } from 'vitest'
import { doubled } from './reference.js'

/**
 * The fixture's third guard, and it is in a second file on purpose.
 *
 * One of the ways the instrument can lie is a cell that ran only part of the suite, and part of a
 * suite is a file that failed to collect. A fixture with one test file could only express "nothing
 * ran", which the count check treats differently from "some of it ran".
 */
describe('fixture, in a second file', () => {
  it('doubles-a-negative-number :: minus three doubles to minus six', () => {
    expect(doubled(-3)).toBe(-6)
  })
})
