---
status: accepted
date: 2026-08-31
decision-makers: Mathis Perron
governs:
  - mutation/decisions.ts
confirmed-by:
  - battery: meta
    guard: every-decision-declares-what-it-governs-and-what-keeps-it
  - battery: meta
    guard: every-path-a-decision-governs-exists
  - battery: meta
    guard: every-file-a-decision-governs-cites-it-back
---

# A decision that rules no code declares that absence with its reason

## Context and Problem Statement

[ADR-0001](0001-record-decisions-in-madr-format.md) requires `governs` to be
present **and non-empty**, and wrote down, in the same paragraph, what the day would take when a
record was owed one:

> **Required, and never empty.** After the sweep that built the guards, no decision here governs
> nothing, so a member for declaring that absence would be a shape with no instance — which is what
> `field-map.ts` calls a speculative field and deletes. **The day a decision genuinely rules no code,
> what it takes is an absence declared with its reason** — never a field left out, which reads exactly
> like a field forgotten.

That day arrived. Rebuilding the contract page from the owner's artboard took the two halves and the
length reading out of it, and two records were left ruling no code at all:
[ADR-0119](0119-the-page-is-read-in-two-halves.md), whose subject was the divider and the two lists of
sections, and [ADR-0133](0133-what-a-page-is-long-in-is-measured-and-it-is-not-the-wrapping.md), whose
decision was a removal and a measurement. Both were entirely about that page. Neither rules a line
today.

`declarationFaults` refused them, correctly, with *governs declares nothing* — which is the state
ADR-0001 named as indistinguishable from a field somebody forgot.

## Decision Outcome

**`governs` holds either the files a decision rules or a declared absence carrying its reason**, and
the two are told apart by the compiler rather than by a convention:

```ts
export type TheCodeADecisionRules =
  | { readonly kind: 'these-files'; readonly files: readonly string[] }
  | { readonly kind: 'no-code'; readonly because: string }
```

In the front matter it is a mapping where a list of paths is a sequence, so no path can be spelled to
look like one:

```yaml
governs:
  nothing: the two halves it settled were rebuilt out of the contract page, and no file implements it
```

**This is not a new decision.** It is ADR-0001's, executed on its first instance. Nothing here weighs
whether an absence should be declarable — that was argued and settled with no instance to argue it on,
and what this record adds is the shape and the day.

### A union rather than a sentinel

The cheaper form is a literal `nothing` among the paths, and it is refused on
[ADR-0054](0054-make-the-omission-impossible.md): a sentinel is a
convention with a comment in front of it, and each of the three readers of `governs` would have had to
remember it. A union makes a reader **say which of the two it has**, and the compiler is what asks.

**The three readers do collapse the two, and that is where the distinction is kept once rather than
three times.** `pathFaults`, `guardFileFaults` and `backCitationFaults` ask about paths, and a record
that names none has nothing for them to be wrong about — so `theFilesOf` answers them with an empty
list either way. `declarationFaults` is the one guard that narrows, because it is the one whose subject
is the difference: `null` is a field nobody wrote, an empty list is a field that says nothing, and
`no-code` is a field that says *no code, and here is why*.

### The reason is prose and is required by the shape

`because` is a string and not a flag, because *what it takes is an absence declared with its reason*. A
record may rule nothing for reasons that are not the same and are not derivable: it was superseded, or
what it decided was a removal, or it settled a question about the project rather than about its code.
A reader arriving at such a record has to be able to ask **why**, and nothing but the record can answer.

**Nothing checks what the reason says**, which is the honest state: this repository has refused a lint
over prose four times, at the same price, and the argument does not change because the prose is short.
The empty case cannot be written — the pattern requires a non-space after the key, so an absence
declared with no reason parses as malformed and `declarationFaults` reports the field as absent.

### What is deliberately not done

**`status` is untouched.** MADR offers `superseded by`, and a record ruling no code is often a record
that was superseded — but not always: ADR-0133's decision was a removal that still holds, and calling
it superseded would be false. Whether this repository wants a supersession status is a second question
with a second answer, and it is not forced by the day that arrived.

## Consequences

Two records carry a declared absence today. The shape has two instances rather than none, which is the
condition ADR-0001 set for it existing at all.

**The population grows the way records do**, and the reason each one carries is the only thing that
will tell them apart. A reader sweeping for records that rule no code gets them from one key; a reader
asking why gets a sentence somebody wrote.

## Confirmation

`every-decision-declares-what-it-governs-and-what-keeps-it` is what refused the two records and is what
accepts them now. **Both ways of writing the absence wrongly were injected into ADR-0119 and the suite
read**, rather than reasoned about:

- **the sequence spelling**, `- nothing: …` instead of the mapping: the entry parses as a path and
  `every-path-a-decision-governs-exists` reports *ADR-0119: governs nothing: the two halves it settled
  …, and no file is there*. The shape is refused from the other side, and no path can be spelled to
  look like an absence.
- **an absence with no reason**, `nothing:` with nothing after it: the pattern requires a non-space
  after the key, so it does not parse and `every-decision-declares-what-it-governs-and-what-keeps-it`
  reports *ADR-0119: governs is absent or malformed*. **A reason cannot be omitted**, which is what
  makes *declared with its reason* a shape rather than a convention.

Restored, both are green.

`npm run meta` reports **68 passed (68)** over the 187 records.

## What would reopen this

- **A third instance whose reason is neither of the two here.** The shape holds a sentence and asks
  nothing of it; the day the sentences fall into kinds, a kind is what they should be.
- **A supersession status.** If a record ever needs to say *replaced by ADR-NNNN* in a form something
  resolves, that is a second field and a second decision, and the reason string is not where it should
  quietly live.
- **A record that rules no code and should not exist at all.** Nothing here asks whether a decision
  that rules nothing is still a decision. Both instances plainly are — they were true, they were acted
  on, and their prose is the history of a page. A record that was never acted on is a different
  question.

## More Information

- [ADR-0001](0001-record-decisions-in-madr-format.md) is the format, the two fields
  and the sentence this executes.
- [ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md) is the way this
  record could have been wrong and was checked against: it is the day a plan was written *without
  reading `identity`*, and asked for a field that had existed since the first contract. The schema this
  one changes was opened before it was described - every reader of `governs` is named above because
  each was read, and the count is three because three is what the module holds.

**A sentence of this record was false while its link resolved.** The line above read *ADR-0128 is the
discipline this is an instance of - a mechanism named on paper before it has an instance*, which is not
what that record says. `every-decision-a-record-links-to-is-the-one-it-names` checks that the number and
the file agree, and it was green: a citation can resolve perfectly and describe the wrong decision. It
is the gap `CLAUDE.md` carries about a comment naming a guard, arriving on a record's own prose, and it
was found by opening the record rather than by any guard.
