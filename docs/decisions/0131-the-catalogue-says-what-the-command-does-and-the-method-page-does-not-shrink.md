---
status: accepted
date: 2026-08-19
governs:
  - packages/cli/arguments.ts
confirmed-by:
  - battery: site
    guard: every-command-the-site-tells-a-reader-to-run-carries-the-invocation
  - battery: site
    guard: every-page-is-reachable-from-the-front-page
  - battery: cli-search
    guard: the-commands-that-reach-the-registry-are-these-and-no-others
---

# The catalogue says what the command does, and the method page does not shrink

## Context and Problem Statement

The last unit of the redesign. Its two mock-ups propose three sections for the front page and seven for
the method page, and read against what the pages carry:

**Two of the three front-page sections exist.** *What the tests catch* is the `How we verify` block,
same figures and same link; *What a contract is* was written by
[ADR-0129](0129-what-a-contract-is-has-a-page-and-its-address-is-the-question.md).

**The third is new and has data behind it.** `packages/cli/arguments.ts` declares `USAGE` — six
commands with a clause each, printed to anybody who types the command wrong — and the site said nothing
about what any of them does.

**The method page mock-up removes four sections.** The page carries eleven and the mock-up draws seven.

## Decision Outcome

### The six commands are rows, and the terminal and the page render the same value

`THE_COMMANDS` carries the name, what it takes and what it does; `USAGE` composes the printed block
from it and the front page composes a list. It is ADR-0129's move on a second surface, and it is the
same shape as `THE_SEVEN_FILES`: a page describing a help text drifts from it, and a page rendering the
same rows cannot.

**The printed usage is byte for byte what it was**, checked rather than assumed — the alignment column
was hand-typed and is now a declared width, and a refactor of how a string is built must not move a
string a user sees.

**The sentence above the list is permanent rules 1 and 2 said to a visitor, and it was checked rather
than transcribed.** `command.ts` states that nothing this tool does needs a package manager to have
been used, `a-project-with-no-package-json-installs-normally` is the guard, and `write.ts` writes the
feature's files, the configuration and the lockfile and nothing else.

### The figures keep the batteries, and gain a clause

The mock-up puts *35 survivors, each published and classified* in the third slot.
`a-count-of-survivors-is-never-shown-without-its-breakdown` requires the split beside the total, and the
card has no room for it — so the survivors stay where their breakdown holds and the third figure stays
the batteries.

**But two bare figures on the surface a stranger meets first owe a clause**, which is
`the-readme-never-gives-a-survivor-total-without-its-split`'s own argument: a figure misleads exactly
the reader who stops. So the paragraph gains one sentence — *they measure what the tests notice, which
is not the same as what the code does* — and the method page's *What this does not prove* is a section
that is linked and not copied.

### The method page does not shrink, and this is the one proposal of the redesign that is refused outright

The four sections the mock-up drops are *Questions rather than defects*, *Guards no defect here
reddens*, *Field by field* and *What a signature does not prove* — **the four that say where the
measurement stops, on the page whose subject is what this project does not prove.** A mock-up that
shortens the page of limits is wrong, and [ADR-0119](0119-the-page-is-read-in-two-halves.md) settled the
premise it rests on: *the complaint was never the length.*

**Both halves of the record, because the ask and the delivery differ.** The owner judged this page
useless before the redesign began and has not returned to the question since. What is delivered does
not follow that judgement, and the reason is above rather than in a note: the sections a reader would
drop are the ones that make every other figure on the site readable as a claim rather than as a score.
If the page is to be cut, it is cut on a reading of what a visitor does with it — which is a
measurement nobody has taken — and not on a mock-up that removed the limits and kept the results.

## Consequences

**`packages/site/` reaches `packages/cli/` for the first time in a page.** The frontier guards of that
folder name `mutation/` and the serialisation; the client is neither, and `source.test.ts` already
imports a constant from it. What the page takes is a declaration and never behaviour.

**The redesign is applied and three of its proposals are not.** They are recorded where each was
refused: the family exclusions in [ADR-0128](0128-what-a-contract-refuses-to-be-is-published-and-frozen-already.md),
the field table in ADR-0129, and the method page here.

## Confirmation

`every-command-the-site-tells-a-reader-to-run-carries-the-invocation` covers the new list without being
widened: it sweeps what the site tells a reader to run, and these six are named rather than offered as
commands to type — the install command on a contract page is what that guard is about, and it is
unchanged.

`the-commands-that-reach-the-registry-are-these-and-no-others` is what keeps `THE_COMMANDS` from
drifting from the client: a row added here that the grammar does not parse is a row the client would
refuse, and that guard is the one that already holds the set.

## What would reopen this

A reading of what a visitor does with the method page. The refusal above is argued from what the four
sections carry and not from anybody's use of them, which is the half nobody has measured.

## More Information

- [ADR-0129](0129-what-a-contract-is-has-a-page-and-its-address-is-the-question.md) — the same move,
  one surface earlier.
- [ADR-0119](0119-the-page-is-read-in-two-halves.md) — why length was never the complaint.
