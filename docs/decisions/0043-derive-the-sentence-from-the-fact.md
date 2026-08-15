---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/report.ts
  - packages/cli/reconcile.ts
confirmed-by:
  - battery: cli-update
    guard: a-count-is-read-off-the-lines-it-summarises
  - battery: cli-update
    guard: nothing-to-do-is-said-only-when-the-lockfile-does-not-move
  - battery: cli-update
    guard: the-lockfile-standing-is-asked-and-not-predicted
---

# Derive the sentence from the fact

## Context and Problem Statement

[ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) forbids a class and
prices its guard out of reach. What is left is a mechanism that works one sentence at a time, and the
question is whether that mechanism is anything more than *be careful*.

## Considered Options

- Write the sentence carefully and check it by reading.
- Compute the sentence from the thing it claims.

## Decision Outcome

**The mechanism this class has, and it is not "no mechanism".** Where a sentence claims something
happened, it is computed from the thing that happened rather than asserted beside it. That is
*Make the omission impossible rather than forbidding it* applied to an assertion instead of to a field,
and it is the same move as `note` being required, as `INVOKED_BY` being total over the grammar, and as
the census.

Three instances, and the third is what proved the shape rather than illustrating it:

- **`theClosing`.** *Written, and recorded in toopo.lock* was printed whenever `--apply` had been typed,
  which is a fact about the command line. It is now `commitChangesSomething` and the two counts, so a
  run that changed nothing says so, and a run that only re-recorded stops announcing a write.
- **The demotion sentence.** *It is no longer something you asked for* is a claim about `toopo.lock`,
  and it is read off `askedFor` in the lockfile before and the lockfile after. The first draft branched
  on `heldBack`, which is a guess at *why* the entry did not move; the two lockfiles are the fact.
- **`promoted`,** which arrived before the rule had a name and is recorded in
  [ADR-0034](0034-what-an-update-is-and-what-it-will-not-do.md): one boolean was answering for two
  claims, and the repair was a second value rather than a better sentence.

**A sentence that cannot be false is worth more than a sentence somebody checked.** The nine repairs
of ADR-0042 are prose, and prose drifts; the three derivations cannot drift, because falsifying them and
reddening a guard are the same event — which is the rule this repository already applies to a count in an
identifier.

## Consequences

**What has no mechanism, priced rather than dressed as one.** A guard over the *class* would have to ask
whether a sentence names a cause the run established, and that is a judgement about prose. There is no
choke point to hang it on either: the sentences are authored in fourteen modules and only their
*presentation* is shared, so even a lint over string literals would be a lint over thirteen files with a
list of allowed verbs. It is the price the alias rule was refused at, and it is refused here on the same
argument. **What is affordable is the per-sentence derivation above, and the discipline of sweeping a
whole surface at once rather than repairing what somebody tripped over.**

A sentence leaves ADR-0042's reach on the day it is computed from what it claims, not on the day
somebody rereads it. That is the recognisable event, and it is why this record exists separately: three
sentences are here, and the rest are prose that can drift.

## Confirmation

`a-count-is-read-off-the-lines-it-summarises` is the shape at its smallest — a total that cannot
disagree with the list above it. `nothing-to-do-is-said-only-when-the-lockfile-does-not-move` is
`theClosing` as a guard, and `the-lockfile-standing-is-asked-and-not-predicted` is the demotion
sentence: the two lockfiles are the fact, and predicting from `heldBack` is what it refuses.

## What would reopen this

A fourth sentence worth deriving, which is the only way this record grows. It is a list by construction
and the list is the mechanism.

## More Information

- [ADR-0042](0042-a-diagnostic-may-not-name-a-cause-no-measurement-establishes.md) — the class this
  closes one sentence at a time.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
