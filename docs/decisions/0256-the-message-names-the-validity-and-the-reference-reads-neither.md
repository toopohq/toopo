---
status: accepted
date: 2026-09-08
governs:
  - contracts/typescript/temporal/add/contract.ts
  - contracts/typescript/temporal/add/reference.ts
  - contracts/typescript/temporal/add/edge-cases.ts
confirmed-by: []
---

# The message names the validity, and the reference reads neither

## Context and Problem Statement

ADR-0255 published a fourth failure reason on a draft engine and named the language's own reading as
owed. It has been taken — nine calls on Chrome 152, the eight that record asked for and one it did
not. **Every expectation held and the reopening clause did not fire**, including the one named as the
only line that could move a decision: `PlainTime.from('12:30:00').add({days: 1, seconds: -1})` throws,
so the language reads the sign before the carrier reads the unit and the derived order is the
language's order too.

**What did not hold is a sentence about a message.** ADR-0255 publishes
`RangeError: Invalid time value` as the language's refusal and builds a paragraph on it — *the
language calls a disagreement of signs a range error*, so an implementation reporting what it caught
inherits the misnomer. The language answers `RangeError: Temporal error: Duration was not valid.` The
class is the range and **the message names the validity of the duration**, which is exactly right.

**The alternative that record wrote for itself had two members and the answer is a third.** It named
what would weaken the paragraph — *if the message names the sign rather than the range* — and the
message names neither. A reopening clause is only as good as the answers it allowed for, and this one
allowed for two of three.

## Decision Drivers

* **A correction has to say which half of a sentence failed.** The class half holds: `RangeError` is
  what both a mixed-sign bag and an overflow throw, so no reading of the class separates them. Only
  the message half and the mechanism behind it are false.
* **The mechanism matters more than the message, because it decides whether the repair was right.**
  If the reference inherits the language's *word*, a narrower `catch` would have sufficed; if it
  inherits an assumption about the language's *refusals*, only the order does.
* **A message's text is engine-dependent and a verdict is not.** The two engines agree on every
  verdict of the sign group and part on the wording, which is a sharper form of this contract's own
  draft-against-language rule and is not written anywhere a test author would meet it.

## Considered Options

* Correct the message and leave the paragraph's mechanism standing.
* Correct both, and say what the reference actually reads.
* Rewrite ADR-0255 — refused: it is stamped, and a stamped record is repaired by a head note.

## Decision Outcome

**Both are corrected, the mechanism is named, and the rule about a message's text is written where
somebody writing a guard arrives.**

### What the reference reads is neither, and that is why the order was the repair

`describeAddFailure` ends in `try { carrier.add(duration) } catch { return { reason: 'out-of-range',
unit: null } }`. **The `catch` takes no binding.** It reads neither the class of what was thrown nor
its message: it classes on the *fact* that something threw.

So nothing the language said was inherited. What was inherited is an **assumption about the language's
refusal set** — that once the keys are units and the carrier applies every one of them, the range is
the only thing left to throw for. That held while the reason set was three and stopped holding the
moment a fourth refusal survived past the carrier check.

**That is what makes the order the repair rather than a narrower `catch`.** Narrowing it would have
meant reading something: the class does not separate the two, so it would have had to read the
message — and the message is the one thing that differs between the two engines, so a narrower
`catch` would have bound this contract's reference to one of them. With the sign decided ahead of the
arithmetic the assumption is true again, and the `catch` needs to read nothing.

### The ninth reading bought a row, and it is the hardest confirmation of the order

`PlainYearMonth.from('2026-01').add({hours: 1, seconds: -1})` was not among the eight. It **throws
`Duration was not valid.`** where the same carrier answers `Can only add years or months to
PlainYearMonth.` for a single inapplicable unit.

That is the sharpest form of the order there is. On `PlainTime` the carrier drops its refused units in
**silence**, so a throw can only be the sign by elimination; on `PlainYearMonth` the carrier has a loud
refusal ready and the language declines to give it. Two carriers, two mechanisms of proof, one answer.

`a-year-month-refuses-two-signs-before-it-refuses-the-unit` is a case now. The table is **48 rows**,
and two of the eight beyond the matrix settle the precedence rather than a behaviour — one on each
carrier that can tell it apart. **Measured with the sign check moved below the carrier's: 3 of 117
redden**, and they are `p7` and the two precedence rows, with `p5` green throughout.

### The rule the two engines produced, and where it is written

**A check that filters on the text of an engine's message depends on the engine, and this repository
has two.** The verdict is stable and the wording is not: one bag, one class, one verdict, and
`Temporal error: Duration was not valid.` against `Invalid time value`.

It goes in the verification discipline of `CLAUDE.md`, beside *a check that depends on where a line
wraps depends on something nobody can see*, which is the same shape one axis over. It is not written
into the contract's own `liftedBy`, where ADR-0252 put the general rule, because the general rule
already covers this instance and a second statement of one rule is two places that drift — what is
new is that a *message* is where the rule bites hardest, and that is a fact about guards rather than
about this contract.

**Nothing in the table or the properties reads a message**, which is why the sign group could be
written from the draft and confirmed rather than corrected. The rule is written for the guard nobody
has yet written.

### The tag, recommended and not taken

`36e4bbb` is ADR-0169's two-runner reading, cited ten times across four files, and it is reachable
only from `the-windows-reading` — a **branch**, verified, locally and on origin. The second citation
population ADR-0254's entry costs — `main` and the tags, which is what a clone keeps and what this
repository declares it keeps — is red on those ten until that commit is reachable from a ref of that
kind.

**The recommendation is an annotated `evidence/the-windows-reading`**, on the precedent of the three
`evidence/*` tags this repository already carries and reissues across every history rewrite.

**What it commits**: one more permanent ref, reissued by any future rewrite, which adds to the cost of
a third — already a decision with a record. It does not make the commit undeletable, a tag being as
deletable as a branch.

**And it does not reinforce the standing instruction — it retires the instruction's load, which is
better.** Today ten citations depend on somebody remembering never to delete a branch. With the tag
they depend on a ref whose whole declared purpose is to be kept, the instruction stops being the only
thing between them and a dead coordinate, and the guard that would catch a future one stops depending
on the moment it is run. That is a rule a mechanism refuses rather than a rule somebody honours, which
is the trade this repository takes everywhere else. **Not taken here**: no tag is posted in this unit.

## Consequences

* The case table is **48 rows**, 40 of them the matrix; sixteen applied answers and thirty-two
  refusals, and **every refusal is now the language's** rather than the draft's.
* ADR-0255 carries a head note naming which half of its title failed and which did not.
* `contract.ts` and `reference.ts` name what the `catch` reads, which is nothing.
* The draft run is **117 of 117, exit 0**, and `tsc` against `ESNext.Temporal` exit 0 out of band.
* **The ledger is `18cc4e82…` at 1 206 bytes and `pnpm freeze` is 3 passed**, unmoved.
* No tag is posted, no `engines`, floor, bound or `suites.yml` line moves, and nothing enters
  `the-catalogue.ts`.

## What would reopen this

* **A third engine.** Every reading here is Chrome 152's or the draft's, and the rule about message
  text is stated over two engines. A third that agrees with neither wording would not move a verdict
  and would move what the rule is worth.
* **A guard anywhere in this repository that asserts on the text of a thrown message.** There is none
  today; the rule is written for the first one, and the day it is written is the day the rule is owed
  a mechanism rather than a line.
* **A reading in which `Temporal.Duration.from` and `carrier.add` refuse a mixed-sign bag
  differently.** They are identical on both engines today, which is what says the refusal is the
  bag's construction; were they to part, the claim that the refusal never reaches a carrier would be
  the one to retake.

## More Information

ADR-0255 is the decision this corrects and does not replace. ADR-0252 is where the
draft-against-language rule was first written, in the exclusion's own `liftedBy`. ADR-0169 is the
reading `36e4bbb` carries, and ADR-0095 is the argument that `--all` is the only spelling of this
repository a tag cannot fall out of, which is why the second population wants a tag rather than a
branch.
