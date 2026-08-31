---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/signature.ts
  - packages/site/playground.ts
confirmed-by:
  - battery: registry-storage
    guard: a-case-that-is-not-a-call-is-refused
  - battery: registry-storage
    guard: a-plain-signature-names-its-parameters
---

# A case of block 4.4 is a call

## Context and Problem Statement

The registry held the fields of a case as `data` it deliberately does not interpret. A contract page
therefore could not render `parseNumber('  42  ')` at all — it could only list `input`, `expected` and
`reason` as three fields of equal standing, which is a form of a table and not a call.

## Considered Options

- Declare the parameter names beside the signature.
- Read them off the declared type.

## Decision Outcome

What a caller writes between the parentheses, in order.

**The fields of a case begin with the parameter names of the answer's signature, in the signature's
order, and what remains is the answer.** Measured over the five, on all seven of their case tables:
seven of seven, in order, no exception — and the imagined sixth contract, written before the rule
existed, already obeys it. `serialise.ts` refuses a contract where it stops being true.

**Read off `text` rather than declared beside it**, by `packages/registry/signature.ts`, which says why
the derivation is what makes the field affordable. It is here because a case of block 4.4 is a *call*
and nothing in this record could say so: `data` holds the fields of a case and the schema deliberately
does not interpret them, so a contract page could list `input`, `expected` and `reason` as three fields
of equal standing and could not render `parseNumber('  42  ')`.

The site found it, by trying to render a call and having nothing to render one from: measured over the
five, the fields of every case of all seven tables begin with these names, in this order, and what
remains is the answer. `serialise.ts` refuses a contract where that stops being true. It is one of the
defects `CLAUDE.md` lists under rule 1, none of which was found by reading the schema.

### The type of a parameter

One parameter of a declared signature: what a caller names it, and what it is declared to be.

**The type is here because the site's playground needed it**, and it arrived free: the colon that ends
a name begins a type, so `signature.ts` reads both on one walk and neither is declared beside the
other. A `parameters` of bare names sent the site back to parsing `export.text` for itself - which is
the state this field was created to end.

**What the type is for, and the refusal that keeps it honest.** The site builds an argument out of what
a reader types, and what it builds depends on this: `string` is the text itself, `Date` is constructed
from it. A type the builder does not know stops the build and names itself, the shape
`packages/registry/value.ts` already takes for a value it does not model - no fallback, no empty field,
no page rendered with a playground quietly missing.

## Consequences

A value read off what it describes has no second statement to disagree with, which is the reason
`implementation-record.ts` refuses a declared depth and `serialise.ts` refuses a declared sample count.
What checks the reading is not a copy of it but a hundred and eighty-seven cases.

It is the first defect the site found in this schema, and the list of all of them is under rule 1
of `CLAUDE.md`. A second arrived in the same unit and is smaller: **no need in `needs.ts` covered listing the
catalogue.** Every `the-site` entry described rendering *one* contract, one refusal, one methodology,
or answering a query; the front page — the whole of the site's navigation at five contracts — had
nothing behind it, while the generator consumed `contract-index` anyway.

## Confirmation

`a-case-that-is-not-a-call-is-refused` in `packages/registry/against-the-catalogue.test.ts` holds the
refusal; `packages/registry/signature.test.ts` holds the reading, down to the cases that would break a
naive parse — a comma inside a generic, an arrow inside a type parameter, a trailing comma, an
optional or rest mark. `a-case-is-rendered-as-the-call-its-signature-declares` in
`packages/site/pages.test.ts` is the consumer that asked for the field.

## What would reopen this

A contract whose case fields stop beginning with the parameter names in the signature's order.
`serialise.ts` refuses it today, so the event is a contract that genuinely needs a different shape —
at which point the question is whether the rule was a measurement over five contracts or a property of
a case.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
