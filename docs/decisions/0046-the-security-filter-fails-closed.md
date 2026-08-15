---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/validation/forbidden-constructs.ts
confirmed-by:
  - battery: validation-stage-1
    guard: every-permitted-name-is-admitted-by-one-family
  - battery: validation-stage-1
    guard: nothing-is-both-permitted-and-a-known-reach
  - battery: validation-stage-1
    guard: the-ambient-reaches-are-named-one-by-one
  - battery: validation-stage-1
    guard: the-evaluators-and-global-state-are-not-permitted
  - battery: validation-stage-1
    guard: the-boundary-is-a-measurement-and-not-a-claim
---

# The security filter fails closed

## Context and Problem Statement

Stage 1 decides whether a submitted implementation may enter a catalogue whose whole argument is that
what lands in somebody's repository is safe to read and safe to run. The first form was a list of
twenty-three forbidden globals.

## Considered Options

- A list of what a submission may not name.
- A list of what a pure function may name, and everything else refused.

## Decision Outcome

**A name a submission has not declared is refused unless it is permitted.** The rule that replaced a
list of twenty-three forbidden globals is a list of what a pure function may name, and everything
else — `fetch`, `document`, `crypto`, `require`, and the one nobody has thought of — is refused with
no entry anywhere. A list of the bad names fails open on the global nobody anticipated, and *nobody
anticipated it* is the failure mode that matters. On the mechanism the whole supply-chain argument
rests on, failing closed is the only defensible direction.

**What makes the closed form affordable is the catalogue's perimeter, and it was measured rather than
assumed.** The five reference implementations between them read seven free identifiers — `Array`,
`Date`, `Map`, `Math`, `Number`, `Object`, `undefined` — and every `.ts` file of `contracts/` adds
only seven more. The permitted list is drawn at the ECMAScript standard library minus what reaches
beyond the call, which a reader can check; `eval`, `Function`, `globalThis`, `Intl`, `WeakRef`,
`FinalizationRegistry`, `SharedArrayBuffer` and `Atomics` are the language's own names that stay out,
each with its reason. **`Intl` is the one I decided against the brief on**: every one of its
constructors falls back to the host's default locale when none is supplied, which is ambient input of
exactly the family `Date.now` is.

**The false-refusal cost is zero on the catalogue, and one existing false refusal was closed.** The
rule asks the compiler's binder where a name is bound rather than reading names, so a parameter
called `process` is a parameter. That is what makes the closed list strictly stronger than the open
one in both directions at once — without it, the same lexical reading either refuses the parameter or
lets a shadowed global through, and there is no third answer. The measured boundary moved from six
refused lines to eight: one evasion closed (`const evaluate = eval`, a capture with no call to read),
two new spellings caught (`{ fetch }`, and a free read of a name another scope binds), and the
over-refusal gone.

## Consequences

**Types are out of scope on purpose.** A type is erased and reaches nothing, so refusing one would buy
nothing and would cost the whole of `lib.*.d.ts` in the permitted list.

## Confirmation

`every-permitted-name-is-admitted-by-one-family` and `nothing-is-both-permitted-and-a-known-reach` are
the two halves of the list's own shape — nothing is permitted twice, and nothing is permitted and
refused at once. `the-ambient-reaches-are-named-one-by-one` and
`the-evaluators-and-global-state-are-not-permitted` hold the exclusions this record argues for by name,
including `Intl`. `the-boundary-is-a-measurement-and-not-a-claim` is what keeps the six-to-eight figure
above from being prose.

## What would reopen this

A contract that genuinely needs a name this list refuses. `Intl` is the candidate — a locale-aware
contract is a thing the catalogue could want — and the shape it would take is a contract declaring its
locale rather than a filter admitting an ambient default.

## More Information

- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
