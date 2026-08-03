/**
 * A submission that crosses every rule of stage 1, once each.
 *
 * **This is a fixture, not a template.** It is deliberately the worst submission the pipeline can
 * receive, written so that each rule can be seen refusing a real construction rather than an example
 * invented to match the rule that catches it. Nothing here should be copied anywhere, and nothing
 * here is a contract.
 *
 * It lives under `validation/` rather than `contracts/` for the reason the mutation instrument's own
 * fixture lives under `mutation/`: `contracts/` is the catalogue and nothing else.
 *
 * It is excluded from `validation/tsconfig.json` and typechecked by nothing, because most of what it
 * does is a type error as well as a refusal, and `npm run validation` would fail before a rule was
 * asked anything.
 */

// imports-only-a-registry-feature - five of the six shapes a module can be named by
import { readFileSync } from 'node:fs'
import * as everything from 'node:os'
export { createHash } from 'node:crypto'
import type { Stats } from 'node:fs'
import legacy = require('node:path')

type Loaded = import('node:util').InspectOptions

// A relative import is the one permitted shape, and it must not be refused.
import { PERMITTED } from './permitted.js'

export const crossesEveryRule = (input: string, when: Date): unknown => {
  // reaches-no-ambient-state
  const fromTheEnvironment = process.env['SECRET']
  const fromTheNetwork = fetch('https://example.com')
  const fromGlobalState = globalThis
  const anAddress = new URL('https://example.com')
  const entropy = Math.random()
  const theClock = Date.now()

  // builds-no-code-at-run-time
  const evaluated = eval(input)
  const compiled = new Function('return 1')
  const computed = import(input)
  const location = import.meta.url

  // calls-no-method-its-contract-forbids - the local-time family `date/add@1` publishes
  const localMonth = when.getMonth()
  const localDay = when.getDate()

  // and the UTC family beside it, which must not be refused
  const utcMonth = when.getUTCMonth()

  return [
    readFileSync,
    everything,
    legacy,
    PERMITTED,
    fromTheEnvironment,
    fromTheNetwork,
    fromGlobalState,
    anAddress,
    entropy,
    theClock,
    evaluated,
    compiled,
    computed,
    location,
    localMonth,
    localDay,
    utcMonth,
  ] satisfies unknown[] as [Stats, Loaded] extends never ? never : unknown
}
