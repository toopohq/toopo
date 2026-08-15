/**
 * The submission that neutralises its own signature check.
 *
 * **This is a fixture, not a template**, and it is the one fixture worth reading twice: nothing here
 * is malicious, nothing here misbehaves, and it is exactly what somebody writes when they want the
 * compiler to help them. Annotating the export with the contract's own type makes conformance true by
 * construction, so `signature.test-d.ts` can no longer fail - the submission ships a green guard that
 * proves nothing. That is why the rule exists and why it is invisible at run time.
 *
 * The type-only import is deliberate: `verbatimModuleSyntax` erases it entirely, so there is nothing
 * left of this at run time to observe. Only a reader of the source can see it.
 */

import type { Doubles } from './contract.js'

export const doubles: Doubles = (value) => value * 2
