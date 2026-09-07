---
status: accepted
date: 2026-09-07
governs:
  nothing: nothing is taken - no field is added, no contract is written, and what this settles is a price rather than a rule any file implements
confirmed-by: []
---

# What a word for a required runtime costs a published digest

## Context and Problem Statement

ADR-0247 established that what blocks the eighth contract is the schema rather than the runtime. A
reader who installed a Temporal contract on a runtime that has none would receive a file answering
`TS2304` under an ordinary `lib` and `ReferenceError` on the declared floor, with the install exiting
0 — and the catalogue has no word with which to warn them. `environments` is the only candidate
already in the record, and ADR-0220 measured that it refuses nothing: `readonly string[]`,
`documentary`, inside the digest, read by nothing outside the schema, and declared identically as
`['node', 'browser', 'bun']` by every contract — re-read at `fc0ef16`, seven of seven.

The expensive half of giving the catalogue that word is permanent rule 6. `contractSnapshot`, at
`packages/registry/snapshot.ts:299`, freezes ten fields — `address`, `identity`, `surface`,
`environments`, `properties`, `caseTables`, `benchmarks`, `ownDeclarations`, `harness` and
`sharedHarness` — and six contracts are bound to six digests that may not move for the life of those
majors. **So what is asked here is a price and never a repair**, and it is asked before anything is
decided rather than discovered by whoever decides it.

**Nothing is taken.** No field is added, no contract is written, nothing under `contracts/` is
touched, and the ledger reads `18cc4e821ceb806aa301d7c82f9ef463dae6386663385ed87b7a19dbf88b5d11` on
both sides — 1 206 bytes over twelve bindings, measured at `fc0ef16` before a line of the probe was
written.

**This section and the two below it were committed before the probe ran.** That is the discipline
ADR-0225 and ADR-0244 used, and it matters here more than it did there: the convenient outcome is the
one that preserves a published figure, and a criterion written after a reading is a criterion the
reading chose.

## Decision Drivers

* **The convenient answer is the one that preserves six digests.** Written afterwards, *it does not
  move* is unfalsifiable; written beforehand, it is a prediction that can fail.
* **The word *moves* runs two questions together.** Whether a digest changes and whether
  `the-freeze.test.ts` reddens are two readings taken through two mechanisms, and a unit reporting one
  figure for both cannot say which of them it took.
* **A zero is worth nothing without a control.** A field nothing reaches moves nothing, which is a
  tautology wearing a measurement's clothes — the trap ADR-0244 answered by re-aiming an arm by one
  character.
* **The first form may not be presumed.** A new field looks expensive and an existing one looks free,
  and that ordering is exactly what has to be measured rather than assumed.

## Considered Options

* **A — a field of its own inside `contractSnapshot`**, absent on every contract that declares no
  requirement.
* **B — `environments`, which is already frozen**, loaded with a meaning it was not given.

## Decision Outcome

### The two questions, separated before either is asked

**Q1, the digest.** Does the canonical text of a published contract's snapshot change, and therefore
its digest, and therefore the 1 206 bytes the ledger prints?

**Q2, the freeze.** Does `the-freeze.test.ts` redden?

They are not one question, and the mechanism is what says so. `bindingsAtRevision` adds a detached
worktree at the commit a binding records and runs *that commit's own* ledger script, so the past side
of the comparison is the published sources and never the working tree. A probe living in the working
tree therefore moves one side only, which couples the two readings — and that coupling is a
consequence of the mechanism rather than a property of the question.

**A third outcome is named here so that it cannot be read afterwards as a rescue.** The freeze ranges
over *anchored* bindings, and the ledger holds twelve: six contracts and six implementations.
`array/group-by@1` is in the catalogue and in no binding, having been refused rather than published.
So a probe reaching only its digest would move Q1 and leave Q2 green, which is precisely the
divergence this unit was asked to look for. It is written down before the reading rather than after
it.

### What would make me answer yes, and what would make me answer no

**Form A.** With an optional field on `ContractRecord` threaded into `contractSnapshot`, and no
contract declaring it:

* I conclude **it moves** if `node packages/registry/print-ledger.ts` produces bytes differing from
  the baseline — or produces none at all, a serialisation that throws being a stronger form of moving
  than a digest that merely changed.
* I conclude **it does not move** if the ledger is byte-identical to `18cc4e82…` at 1 206 bytes **and**
  the control below shows that the same plumbing could have moved it.

**Two spellings are measured and not one**, because the dichotomy this unit was handed — a missing
field omitted, or emitted as empty — has a third member that `canonical.ts` makes reachable.
`canonicalAt` builds a record out of `Object.keys`, which holds a key whose value is `undefined`, and
refuses that value **by name** at `canonical.ts:88` rather than dropping it. So the two spellings are:

* **A1**, the unconditional key: `requiresRuntime: record.requiresRuntime`.
* **A2**, the conditional spread: the idiom `serialiseContract` and `field-map.ts` already write four
  times over, for `useCases`, `againstTheLanguage`, `correctionsToFrozenProse` and `alsoFoundBy`.

**Form B.** Its structural cost is nil by construction while the field's value does not move, and
that is not the question — the question is what it costs the six published contracts' meaning.

* I conclude **B is free** if no published digest moves **and** no sentence the six already assert
  changes its truth value under the loaded reading.
* I conclude **B is not free** if the overload makes the six say something they did not say, or if it
  cannot carry the requirement at all — in which case the apparent economy is the false one this unit
  was told not to presume.

### The prediction, and the direction of its bias

I predict that **A1 throws** `UncanonicalValue`, that **A2 leaves the ledger byte-identical**, and
that **B cannot carry the requirement** for a reason ADR-0220 already measured: a field every contract
declares identically is a constant, and a constant cannot be contradicted.

**The bias is declared towards A2 being free**, and that is the uncomfortable direction. It is the
outcome under which the eighth contract's blocker is ordinary work rather than the owner's decision,
and it is the outcome preserving `18cc4e82…`. A prediction pointing at the convenient answer is the
one that most needs a control.

### The control

**A3 re-aims A2 by the value its absent case yields rather than by its shape**: where A2 omits the key
on a contract declaring nothing, A3 emits it as an empty list — the second horn of the dichotomy this
unit was handed, and the one that must move six digests. If A3 leaves the ledger at `18cc4e82…`, the
probe never reached the digest, A2's zero is a tautology, and nothing here is publishable.

The control runs on the same plumbing as A2 and differs from it in one expression, so a reading that
separates the two separates the two answers and nothing else.

## Consequences

**The measurement is owed, and this record is incomplete until it is taken.** What stands here is the
criteria, the prediction with its bias declared, and the control — committed first, so that the
two-commit history of this file rather than a sentence claiming it is what says the reading did not
choose them.

**Whatever it answers, nothing is taken.** A price is not a decision, the eighth contract is not
written here, and which of the two forms the catalogue gains — if it gains either — is the owner's.

## What would reopen this

* **A published contract declaring anything another does not**, which would end `environments` being
  a constant and reopen form B on the axis ADR-0220 measured it shut.
* **A change to `canonical.ts`'s treatment of an absent field.** The whole of form A's answer rests on
  `canonicalAt` reading `Object.keys` and refusing an `undefined` by name; an encoder dropping one
  silently would make A1 and A2 one reading, and would leave a field added without thought free to
  move a digest in silence.
* **A binding minted for a contract this catalogue refused**, which would close the third outcome
  above by bringing every catalogue digest inside the freeze's population.
* **Any reading of the ledger that is not 1 206 bytes hashing to `18cc4e82…`**, which would mean the
  baseline measured against here is no longer the one the six contracts are bound to.

## More Information

The baseline is the ledger script's own bytes rather than the runner's: npm prints a 64-byte banner to
standard output, so `npm run ledger` answers 1 270 bytes where `node packages/registry/print-ledger.ts`
answers 1 206. The figure ADR-0231 published is the second, and it is the second this record measures
against.
