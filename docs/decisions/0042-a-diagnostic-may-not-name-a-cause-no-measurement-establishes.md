---
status: accepted
date: 2026-08-15
governs:
  - packages/cli/report.ts
confirmed-by:
  - battery: cli-update
    guard: every-file-missing-at-once-says-the-folder-is-not-committed
  - battery: cli-update
    guard: one-file-missing-is-not-a-folder-nobody-committed
---

# A report may not name a cause no measurement establishes

## Context and Problem Statement

It is the worst class this repository has found in its own product, and the reason is not severity but
asymmetry: a false comment is read by somebody who can open the file beside it, and a false diagnostic
is read by somebody who has never seen this code, believes it on our word, and acts on it.

## Considered Options

- Offer the likely causes, so the reader has somewhere to start.
- State what was observed, and name a cause only where the run establishes it.

## Decision Outcome

**A report may state what it observed; it may not name a cause it did not measure.** It is the worst
class this repository has found in its own product, and the reason is not severity but asymmetry: a
false comment is read by somebody who can open the file beside it, and a false diagnostic is read by
somebody who has never seen this code, believes it on our word, and acts on it. An invented cause sends
them hunting for a problem that does not exist — which is exactly what the pre-flight measured on
`no longer caught by: <a name nothing carries>`, transposed onto the only screen a client ever sees.

**The corollary is as binding as the rule: an invented cause is not repaired by a list of candidates.**
*If this is a fresh checkout … Otherwise something removed it* was already that shape, and it is worse
than a single wrong cause rather than better — it looks like a diagnosis, it cannot be acted on, and it
launders a guess as completeness. Where the cause is not known, the report says what was seen and what
is worth looking at.

**The sweep is the deliverable, not the two instances that raised it.** Every string this tool can print
was read against one question — does this assert something the run established, or something it
inferred? The population is the 48 refusal sites across thirteen modules, the eleven renderers of
`report.ts`, and the held-back reasons `reconcile.ts` builds. **Nine assert.** Two were the filed
instances; seven were found by reading, which is the argument for sweeping a surface rather than fixing
what somebody tripped over.

**What separates a named cause from a stated inference, and it is the line the sweep was decided on.**
`bindingAt` says *a published version is served for life, so this is a registry that cannot answer right
now rather than an artefact that went away* — a cause, and it stays. It publishes its premise, that
premise is permanent rule 6, and a reader can check it. **An inference offered with its premise is
argument; a conclusion offered alone is assertion.** None of the nine published anything of the kind.

**Three of the nine were one word.** *You edited*, *your version*, *your changes*, *rather than anything
you did* — the measurement is that the bytes differ from what was written, and the hand that moved them
is not in that comparison. A formatter running on save, a merge, a colleague. Telling somebody whose
Prettier reindented a file that they edited it is naming an agent nothing designates, on the shortest
word in the sentence. `conflict` had been carrying the honest form since the day it was written:
*changed on both sides*.

**One was repaired by measuring instead, and it is the only one where that was the cheaper half.**
*what was just written will not be committed — and toopo.lock will be* is two claims about the user's
repository, and git had been consulted about one of them while the whole warning rests on the other: the
trap is a committed lockfile naming files that were not committed. `whatGitIgnores` asks, on the one
branch that mentions the lockfile. Measured on two real repositories at `07c4de7` — `lib/` ignored gives
`0` for the folder and `1` for the lockfile and the trap sentence prints; `toopo.lock` ignored as well
gives `0` for both and the screen says nothing toopo wrote will be committed at all, which is the more
valuable sentence of the two because ignoring `toopo.lock` is the mistake this product argues against.

## Consequences

The class has no guard and this record says so rather than implying one. A guard over the class would
have to ask whether a sentence names a cause the run established, and that is a judgement about prose;
there is no choke point to hang it on either, since the sentences are authored in fourteen modules and
only their presentation is shared. It is the price the alias rule was refused at, and it is refused here
on the same argument.

What is affordable is one sentence at a time —
[ADR-0043](0043-derive-the-sentence-from-the-fact.md) — and the discipline of sweeping a whole surface
at once rather than repairing what somebody tripped over. `CLAUDE.md` keeps the class in its list of
what this repository declares and nothing keeps.

## Confirmation

The pair named above is one sentence taken out of prose and computed instead: every file of a feature
missing at once is evidence the folder was never committed, and one file missing is not. They fail on
opposite conditions, which is what makes them a pair rather than one guard written twice.

The other eight repairs are prose and nothing keeps them. That is stated here rather than left for a
reader to assume a mechanism exists.

## What would reopen this

A validation stage that reads this repository's own strings the way stage 1 reads a submission's. It is
named so it can be recognised, and it is not built.

## More Information

- [ADR-0043](0043-derive-the-sentence-from-the-fact.md) — the mechanism that closes this one sentence
  at a time.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
