import { describe, it, expect } from 'vitest'
import { doubled } from './reference.js'

/**
 * Two of the fixture's three guards. See `reference.ts` for what a fixture is and is not.
 *
 * `doubles zero` is here because it cannot be reddened by the fixture's own defect - zero doubled
 * and zero returned unchanged are the same value - which is what gives the meta-tests a guard that
 * is silent by construction, and therefore something for the silence declarations to be measured on.
 */
describe('fixture', () => {
  it('doubles a positive number', () => {
    expect(doubled(21)).toBe(42)
  })

  it('doubles zero', () => {
    expect(doubled(0)).toBe(0)
  })
})
