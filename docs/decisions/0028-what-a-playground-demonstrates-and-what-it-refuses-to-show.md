---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/playground.ts
confirmed-by:
  - battery: site
    guard: a-playground-names-the-diagnostic-of-a-contract-that-publishes-one
  - battery: site
    guard: a-field-refuses-a-value-of-the-wrong-type-before-the-contract-is-called
  - battery: site
    guard: a-parameter-type-the-form-cannot-build-stops-the-site-and-names-itself
  - battery: site
    guard: a-diagnostic-the-form-cannot-call-stops-the-site-and-names-itself
  - battery: site
    guard: a-date-is-the-one-argument-this-site-constructs
  - battery: site
    guard: every-playground-opens-on-a-case-of-its-own-contract
---

# What a playground demonstrates, and what it refuses to show

## Context and Problem Statement

A contract page can already print every settled answer: the case table is two centimetres above. The
question is what a running playground adds that the page does not already have, and the obvious answer
— *show that our implementation agrees with our expectation* — is a comparison between two things that
are both ours.

## Considered Options

- Expected against actual, on the cases the contract publishes.
- Answer the input the reader typed, and nothing else.

## Decision Outcome

**It is not "expected against actual".** Both halves of that comparison would be ours, and the expected
half is already two centimetres higher, on the case's own line. What a static page cannot do is answer
**the input the reader typed**, so that is the whole of what a playground computes, and the settled
answer is deliberately not repeated beside it.

**It calls both exports, and the reason appears exactly when the answer is `null`.** A playground
calling only the answer shows half of any contract written to this repository's error convention — and
worse, it takes back the measurement the field's whole design rests on. `'1 000'` with a no-break space
and `'1 000'` with an ordinary one are the two rows that settled the literal, and against the answer
alone **both print `null`** and the distinction a reader came to see is invisible. Measured in a
browser, which is the only place it could be:

```
'1 000'        parseNumber(…) → null    describeParseFailure(…) → 'not-decimal'
'1\u00A0000'   parseNumber(…) → null    describeParseFailure(…) → 'separator'
```

Only when the answer is `null`, because the coupling property of both fallible contracts is that a call
fails exactly when it has a description — a `→ null` printed under every answered call would be a line
that is always the same. That coupling is
[ADR-0020](0020-a-fallible-function-answers-null-with-its-diagnostic-beside-it.md).

**The diagnostic is called with the answer's own arguments, and the build refuses a contract where that
is not possible.** The form has one field per parameter of the answer, and nothing in the schema
requires the diagnostic to declare the same ones. Measured: they agree on two of two. A measurement is
not a rule, so it is checked.

**And the replay guard grew with it, which closed a real blindness rather than a supposed one.**
Measured by making the reference answer `'not-decimal'` where it answers `'separator'`: the guard as it
stood sees **0 of the 9 rows** that breaks, because every one of them still answers `null`, and the
reason comparison sees all nine.

**The order of the two refusals is written down, because leaving it implicit cost a regression.** W-37
of the site battery neuters the parameter-type refusal, and it went from killed to survived the moment
the diagnostic's signature was compared first: the second refusal fired in the first one's place, the
guard was green either way, and the battery is what caught it. A contract tripping both is told about
the parameter it declared, which is the more basic fact.

### The field holds a literal — superseded by ADR-0096

**This section is kept as the argument it was, and it no longer describes the code.**
[ADR-0096](0096-a-field-is-typed-or-spelled-and-the-type-decides.md) replaces it: how a field is read
is a property of the type the signature declares, a `string` field takes the text itself, and
`Duration` is the one type that still spells a value.

What it argued, and what survives of it: `contracts/typescript/number/parse/edge-cases.ts` settles
`'1\u00A0000'` and `'1 000'` to opposite answers, and the two are the same eight glyphs on screen —
which is why that file names the character instead of pasting it. That ambiguity is real. What this
record got wrong is where it had to be answered: it is answered in the **output**, which now names the
call it made, and not in the input by making the reader spell it. The output this record itself
published twice as `parseNumber(…) → null` was the defect, and nobody read those two identical lines as
one.

**One clause here was measured and is false.** It read *`'\uD83D'` is a lone surrogate a reader can
type, and a raw field could not have expressed it at all.* Measured in Chrome, with the code point
constructed in the page: an `<input type=text>` carries a lone surrogate whole, and so does a
`<textarea>`. A reader cannot **type** one, which is the half that survives. The two were written as
one sentence, and only one of them had been measured.

The other argument stands unchanged and is why the type table has two readings rather than one:
`date/add@1` publishes four cases whose caller is untyped, `{ day: 1 }` among them, and a form derived
from the declared type cannot express one of them.

**One table of types, whose only non-identity entry is `Date`.** Reading a literal gives the *declared*
value, which is what the registry models; turning that into an argument is a second step and exactly
one type of this catalogue needs it, because `packages/registry/value.ts` refuses to model a Date and
`date/add@1` writes its instants as ISO strings. So `new Date(...)` in `packages/site/playground.ts` is the only
place on the whole site where a Date comes into existence, and it is written on the line beside the
field. It falls *inside* the contract: a text that does not parse gives `invalid-date`, which is a
published case, so the added layer is not a hidden one.

**A parameter type the table does not know stops the build and names itself** — no fallback, no empty
field, no page rendered with a playground quietly missing. The shape `packages/registry/value.ts` already takes
one floor down for a value it does not model.

## Consequences

**A field says what it is declared as before anything is called, and that was found in a real browser.**
Typing `42` into a field declared `string` used to answer `input.trim is not a function` — the
contract's own source reporting a failure in its own words to somebody who has never seen it. Every
type was satisfied and every guard was green; only opening the page and typing found it. It is the
measurement behind a rule this repository already states and had never paid for: **a static check
passing does not mean the interface works.**

**The answer is written by `literal(encode(…))`, never by `String`.** `parseNumber('-0')` answers a
negative zero and `String` prints it `0`, on the page where that contract settles a case on the two
being different. Measured: printing with `String` reddens 69 of the 157 served cases.

## Confirmation

The six guards named above are a partition of what can go wrong here: the diagnostic is called when
there is one, a field refuses a wrong type before the contract sees it, both build-time refusals fire
and name themselves, the one constructed argument is the one this catalogue needs, and every playground
opens on a case its own contract published.

What none of them establishes is that the JavaScript a reader runs answers what the TypeScript does —
that is [ADR-0029](0029-what-runs-in-a-readers-browser.md), and it is measured by replaying every case
through the stripped artefact rather than through the module it came from.

## What would reopen this

A higher-order contract gaining a page: its cases take a function, and a form derived from a declared
type cannot express one. `no-case-the-registry-serves-is-printed-as-a-word-with-no-spelling` is the
guard that reddens on that day, which is what makes the event visible rather than something somebody
has to remember.

## More Information

- [ADR-0011](0011-a-case-of-block-4-4-is-a-call.md) — the parameters this form is built from.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
