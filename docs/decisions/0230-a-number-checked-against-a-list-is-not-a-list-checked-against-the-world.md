---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A number checked against a list is not a list checked against the world

## Context and Problem Statement

ADR-0228 and ADR-0229 both close with the same declared gap: *every check here compares a number with a
count and none reads what is being counted.* It was written as a limit nothing had met.

**It had already been met, inside ADR-0228, by ADR-0228.** That record says *`aaf625f` falsified three
claims across two neighbouring entries*, lists three items beneath it, and twenty-six lines later says
*that commit is not what made `CLAUDE.md:4520` false*. The three was checked against a list of three
items; **nobody read whether `aaf625f` had done each of them**. ADR-0229's head note then corrected the
heading above that paragraph by ratifying the paragraph.

The owner found it, measured `4131c28` himself, and read it as two. It is one.

## Decision Drivers

* **A gap that receives a measured instance is worth more than a corrected figure.** The instance
  changes what the gap costs; the figure changes one sentence.
* **An attribution is the most checkable member of its class**, so a false one there bounds how much
  the rest can be trusted: if the easy case fails, the hard cases are not safer.
* **Whether the sweep is mechanisable is the answer, not a preamble to it.** A sample presented as a
  population is the defect three units here have already paid for.

## Considered Options

* **Correct the three to two, as the owner read it.** Refused on measurement: it is one.
* **Correct the number and leave the attribution.** Refused: the wrong commit is the finding, not the
  wrong count.
* **Measure the attribution item by item, sweep the class, and report what the sweep cannot reach.**
  Retained.

## Decision Outcome

### The owner's reading, confirmed on its measurement and corrected on its conclusion

**`4131c28`, 2026-08-27, took `mutation/workflows.test.ts` from nine guards to ten.** So
`CLAUDE.md:4520`'s *nine guards* was already false when `aaf625f` landed nine days later, and ten to
twelve falsified nothing. That is exactly his reading and it holds.

**His conclusion — that `aaf625f` falsified two — does not.** It falsified **one**.

| what ADR-0228 credits to `aaf625f` | true of that commit? | what it falsified |
| --- | --- | --- |
| *moved `workflows.test.ts` from ten guards to twelve* | **yes** | **nothing**, the claim being false since `4131c28` |
| *took the two ubuntu gates from 40 to 79* | **no** | — |
| *added a fifth bound* | **yes** | *the four `timeout-minutes` declarations* |

**`aaf625f` did not move a bound at all.** Its diff of `.github/workflows/suites.yml` is
`removed []`, `added [5]` — additions only, the job `every-job-answered` and its own bound.
**`74b1b75`, the same day, is the commit that shows `removed [40,40]`, `added [79,79]`**, and it is
ADR-0222's.

### The attribution, rebuilt

| commit | date | claims it falsified |
| --- | --- | --- |
| `4131c28` | 2026-08-27 | *nine guards* of `workflows.test.ts` |
| `aaf625f` | 2026-09-05 | *the four `timeout-minutes` declarations* |
| `74b1b75` | 2026-09-05 | *the job's forty minutes*, *two ubuntu gates at 40* |

**No commit falsified three.** And the heading ADR-0229 set out to correct — *one commit made two of
them* — **is true**, of `74b1b75`. **The heading had the right number and the wrong commit; the body
had the wrong number and the wrong commit; the head note ratified the body.** Three readings of one
paragraph and the only one that was numerically right was the one being corrected.

### What the gap costs, now that it has an instance

It was declared as a limit of the checking, phrased so that a reader could take it as theoretical.
**It is not.** It fired in the record that declared it, on the class where verification is cheapest —
an attribution to a commit, where `git show --name-status` settles it in one call — and it survived
two subsequent readings of the same paragraph, one of them written to correct that paragraph.

**So the cost is not *a number might be wrong about its noun*. It is that a number checked against a
list makes the list look checked.** The three items were written down, which is what made the three
verifiable and the three items not.

### The sweep, and how far it reaches

**23 attributions** in the tracked prose — a commit identifier followed in the same sentence by a verb
saying that commit *did* something, with coordinates (*measured at*, *swept at*) excluded.

**Eight are mechanically checkable and were checked. One is false**, the `aaf625f` one above. The
seven that hold: `11e0f54` deleted `methodology-page.ts`; `45f702f` changed eight files; `9158603`
turned `noUnusedLocals` on; `fc41c4e` added the guard it names; `aaf625f` added a fifth bound and moved
`workflows.test.ts`; `74b1b75` moved the two gates.

**Two more read as false and are not, and that is the sweep's own failure**, reported rather than
smoothed. ADR-0149 says *`f465660` moved `run.ts`, `paths.ts` and `mutants.ts`* and *`8b6aa89` moved
`attribution.ts`*, and neither commit touches those files. **The sentence above them reads *It bit the
two **pushes** that followed***, and the identifiers name push tips. My check read *commit* where the
record says *push* — which is this record's own subject, arriving on its own instrument.

### Why it does not mechanise, and what that leaves

**Three kinds, and only the first is reachable.**

* **An attribution to a commit whose object is a file or a value.** `git show --name-status` and a diff
  settle it. Eight of the twenty-three, one of them false.
* **An attribution to a push.** Git does not carry push boundaries, so *which commits were in that
  push* is unrecoverable from the repository. Nothing here can check these, and it is why two of them
  read as false above.
* **An attribution whose object is a claim** — *falsified three claims*. Checking it means knowing
  which claims, evaluating each before and after the commit, and deciding what *falsified* means for
  each. That is the reading this record performed by hand, and it is the reading no shape reduces.

**So the honest answer is that a third of the class is checkable and the rest is not**, and the
un-checkable two thirds include the shape that produced the instance. A guard over the checkable third
would have caught the `aaf625f` line, because its object is a diff — which is a stronger result than the
guard ADR-0228 priced, and it is **still refused**: it lives in the meta suite, which no battery injects
into, so it would be born unwitnessed, and the owner has refused that trade twice on the same ground.

## Consequences

**ADR-0228's *three* is one, and the commit is wrong as well as the count.** The record takes a head
note; it is stamped and is not rewritten. ADR-0229's head note is corrected by that same note rather
than by an edit, for the same reason.

**The declared gap has a measured instance**, in the record that declares it, on the cheapest member of
its class, surviving two later readings. It stays declared and it is no longer theoretical.

**The sweep is reported with its reach**: 23 attributions, 8 checkable, 1 false, 2 unreachable because
they name pushes, 13 unreachable because their object is a claim.

**Nothing is repaired in the product.** No contract is written, nothing under `contracts/`, `packages/`,
`mutation/` or `.github/` moved, no guard was added or changed, none of ADR-0218's three repairs was
taken, `THE_PACKAGE_VERSION` stays at `1.2.0`, `pnpm freeze` is green on 3 guards either side and the
ledger is byte-identical at `18cc4e82…`.

## What would reopen this

* **A second false attribution in the checkable third.** One of eight is a rate nobody should trust;
  a second would make the guard's refusal a decision to re-take rather than one to inherit.
* **Push boundaries becoming recoverable.** The forge holds them and this repository does not read the
  forge; a job that recorded the tip and the base of each push would move a third of the un-checkable
  into the checkable.
* **An attribution whose object is a claim, checked by something other than a person.** Nothing here
  suggests how, and that is the honest state.
* **A commit that falsifies a claim in a record that names a different commit for it**, which is this
  instance exactly and would say it is a habit rather than one paragraph.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `5b52d68`, node v24.15.0, Windows. Guard counts are
`^\s*it\('` over `git show <sha>:mutation/workflows.test.ts`; bound changes are
`^[-+]\s*timeout-minutes:` over `git show <sha> -- .github/workflows/suites.yml`; the attribution sweep
is a commit identifier in backticks followed within the sentence by a verb of action, over `CLAUDE.md`,
`README.md`, `CONTRIBUTING.md` and every record.

Nothing outside `docs/decisions/` and `CLAUDE.md` was edited.

### Why `confirmed-by` is empty

For ADR-0229's reason, unchanged: what would keep this is refused above, on the ground the owner has
now given twice.
