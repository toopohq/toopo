import { describe, it, expect } from 'vitest'

import { TYPESCRIPT_SURFACE, missingFromTheSurface } from './typescript-api.js'

/**
 * The dependency assumption this stage rests on, checked rather than assumed.
 *
 * An exact version pin in `package.json` protects against a deliberate upgrade and against nothing
 * else. A reinstall that resolves differently, a refreshed lockfile, or a package whose `exports` map
 * moves `unstable/ast` would all leave the pin intact and the analyser reaching for `undefined` - and
 * the way that failure would surface is a rule quietly finding nothing, which is indistinguishable
 * from a submission that is clean.
 *
 * The security filter of this project is built on this import path. A guard is what stops it from
 * being a hope.
 */
describe('the TypeScript entry point the analyser depends on', () => {
  it('the-typescript-surface-is-intact :: every part the analyser reads is exported and is what it is used as', () => {
    expect(missingFromTheSurface()).toEqual([])
  })

  /**
   * The surface is an object rather than a list precisely so that it cannot be empty and pass. A list
   * of required names could be emptied and the guard above would go green over nothing; emptying this
   * one would break every rule that reads it, at the typechecker.
   */
  it('the-surface-is-not-empty', () => {
    expect(Object.keys(TYPESCRIPT_SURFACE).length).toBeGreaterThan(0)
  })
})
