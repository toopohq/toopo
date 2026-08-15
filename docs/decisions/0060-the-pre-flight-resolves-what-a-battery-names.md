---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - mutation/run.ts
  - packages/cli/breakage.ts
confirmed-by:
  - battery: cli-update
    guard: every-clean-refusal-resolves-to-the-guard-it-names
---

# The pre-flight resolves what a battery names, and a suite guard resolves what a module declares

## Context and Problem Statement

Four declarations claimed `executable` and named a guard, and nothing resolved the names. The class was
found by building the address rather than by looking for it, which is the argument for building
mechanisms rather than lists.

## Considered Options

- One mechanism resolving every address anything in this repository declares.
- Two, each beside the declaration it keeps.

## Decision Outcome

**Four more instances were found by building the address rather than by looking for them, and that is
the argument for building mechanisms rather than lists.** Ten entries of `TYPESCRIPT_SURFACE` were
guarded and read by nothing, so the guard covered a dependency the analyser did not have.
`GuardAddress`, `renderGuard` and `guardAddressFaults` were declared in `address.ts` and used by
nothing — the address this unit needed already existed, unused. Four `ownDeclarations` claimed
`executable` and named no guard; one of them, `keyFunctionRules`, turned out to be `structural` — no
guard runs an implementation against it. And M-08 of `array/group-by@1` pinned one of the four guards
it reddens where the repository's own rule says name all of a set of five or fewer, which is how
`profileKeyFunctions` had no citable guard to point at.

**The class is closed. An address a battery names is resolved in `calibrate()`, against the guards the
run really collected, before a single verdict exists.** It costs the seconds a control run costs rather
than the twenty-odd minutes a battery does.

**And it closed a listed entry, which is the first application of the rule at the head of the list of
what this repository declares and nothing keeps — applied late, which is how the rule was found.**
`benchmarks.profiles[].name` sat in the list reading *frozen by the section above, enforced by nothing*
while a paragraph two screens down said the class was closed: two statements of one fact in one file,
and it is always the list that lies. Measured at `277a637`: the five contracts declare **27** profiles,
the suite collects **27** guard titles `profile-<name>`, and **27 of 27** are named by a battery — so
the address half resolves for every one of them. The content half stayed in the list and now says what
it is.

**Nothing was built on top of it, and the measurement is what refused it rather than a preference.**
The obvious guard — resolve a record's profile names against the guard titles the suite carries — is
structurally incapable of failing, because all five `profiles.test.ts` build the title in a loop over
`benchmarkProfiles`: renaming `long-inputs` in the record produced `profile-long-inputs-RENAMED` and
six green tests, with nothing left behind to catch. A second guard resolving what the **batteries**
name, at the suite's cadence instead of the pre-flight's, genuinely would fail — and it would catch
the same fault twenty-three minutes earlier, which is the one costume this repository cannot argue
with: two guards over one fault have no answer to *which of us is right* on the day they disagree. It
is the class this repository spent months removing from its prose, and putting it into executable code
would be worse, because a comment that contradicts another is read by a person and two guards that
contradict each other are read by nobody until one goes red.

**Both halves were measured before the mechanism was written**, at `82d09a7`, by putting back the two
mistakes this repository had already made and corrected before measuring — and neither outcome is the
one the debt was filed expecting. A **pin** naming a guard no guard carries does redden, and the red
says the wrong thing:

```
1 cell(s) disagree with the battery:
  W-41 on W/as-committed: expected killed, measured killed
    no longer caught by: an-invisible-character-is-read-back-as-the-character-it-names
```

`expected killed, measured killed` is two verdicts agreeing on a line announcing that they do not, and
`no longer caught by` sends its reader into `read-literal.test.ts` after a guard that stopped catching
a defect it never caught. **A red that manufactures a regression costs more than a silence, because
somebody goes and looks for it.** A **guard declared silent** under a name nothing carries was not
reported at all: the name occurred zero times in that run's output, and the run finished on *every
guard of this contract is either witnessed or accounted for*.

**It found one the moment it existed.** `cli-search` declared
`a-feature-already-installed-is-not-installed-again` unprobed — a string occurring nowhere else in this
repository, sitting in the same list as `reinstalling-what-is-already-there-changes-nothing`, which is
the guard it was once the name of. Nothing had ever said so. Checked against the guards all six
configurations really collect: no other battery names an address that resolves to nothing.

**Each half resolves against the universe its own mechanism reads, which is why neither can refuse
wrongly.** `agreesWith` looks a pin up among every guard that reddened anywhere in the run;
`attributeColumn` only ever sees the guards of the contract under measurement. There are three guards
in `instrument.test.ts` and not one, because a declared *suite* is a third universe — a describe title
is prose and gets reworded, where a guard identifier is frozen, which makes it the half most likely to
break. All three were seen red together on one meta-mutant, each under its own claim.

## Consequences

**What it did not close was `Breakage.guard`, and the reason turned out to be the rule rather than the
gap.** This was once said to close "with the same mechanism as the others". That sentence was written
before anybody looked at what names `WHAT_BREAKS`, and the answer is *no battery*: the pre-flight
resolves the addresses a **battery** declares, against the guards a run really collected, and the four
batteries that collect the `cli` suite declare none of these twenty. Closing it here would have meant
picking one of the four arbitrarily to name them, or repeating the list in all four — a battery
declaring something it does not declare, in order to fit a mechanism. That is arranging the data to
suit the tool, which is the shape this repository refuses everywhere else.

**So the line is drawn instead, and it is a rule about where a resolution lives: the pre-flight resolves
what a battery names; a suite guard resolves what a module declares.** Two universes, two mechanisms,
each beside the declaration it keeps. `every-clean-refusal-resolves-to-the-guard-it-names` in
`packages/cli/breakage.test.ts` is the second one's first instance — it reads this folder's test sources, resolves
all twenty addresses, and **publishes the file each one is in** rather than asserting anything about
where they are.

What it reads is the source rather than what vitest collected, so a guard inside a skipped block would
still resolve — and that hole is already closed at another cadence, by `mutation/census.ts` declaring how
many guards each file of this suite collects. The division is deliberate: the suite guard catches the
frequent fault in seconds, an address renamed by somebody refactoring; the census catches the rare one, a
file that stops running. Neither repeats the other, which is what makes both affordable.

Both reds were seen. An address left behind by a rename resolves to `null` under its own name; and an
identifier carried by two files reads as `"list.test.ts, write.test.ts"`, which is a defect the first
draft of that guard could not see — written as a plain record it kept whichever file sorted last, so a
duplicate looked exactly like a resolution. A mechanism that silently picks one of two answers, inside
the guard written to refuse exactly that.

**And the sentence it replaced is gone rather than corrected.** `breakage.test.ts` opened by saying every
clean refusal was guarded *in that file*; eleven of the twenty were in five other files by the time
anybody checked. A sentence claiming they are all here and a guard publishing where each one is are two
statements of one fact, and it is always the sentence that ends up lying. The eleven did not move: a
refusal about the lockfile is tested where the lockfile is written, and gathering them to make a sentence
true would be the same error in the other direction.

## Confirmation

`every-clean-refusal-resolves-to-the-guard-it-names` is the suite-guard half, and it publishes where
each address lives rather than asserting where it should. The pre-flight half is `calibrate()` itself,
which refuses before a verdict exists and is therefore not addressable by a guard of any suite — the
same limit [ADR-0019](0019-a-guard-is-addressed-by-a-pair-and-its-title-is-a-sentence.md) records.

## What would reopen this

A third universe of declarations — something that is neither a battery's nor a module's. The two
mechanisms exist because there are two, and a third would have to be given its own rather than folded
into either.

## More Information

- [ADR-0019](0019-a-guard-is-addressed-by-a-pair-and-its-title-is-a-sentence.md) — the addresses both
  mechanisms resolve.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
