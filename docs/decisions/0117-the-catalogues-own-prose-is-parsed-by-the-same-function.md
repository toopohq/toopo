---
status: accepted
date: 2026-08-18
decision-makers: Mathis Perron
governs:
  - packages/site/marks.ts
confirmed-by:
  - battery: site
    guard: no-mark-a-sentence-carries-reaches-the-reader-as-itself
---

# The catalogue's own prose is parsed by the same function

## Context and Problem Statement

[ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) settled that a sentence written for a
reader of source is parsed once, by one function, and scoped the guard to the method page. It said
why, in as many words: *what a contract's own prose does with a backtick is a question about the
register of the catalogue's text, and nothing mechanical settles it.* Its **What would reopen this**
named the event — a second page taking prose written for a reader of source.

That page is the contract page, and it has been taking that prose all along. Measured at `21df25d`
over the built tree: **220 literal backticks across the four contract pages** — 110 on
`string/slugify@1`, 86 on `date/add@1`, 18 on `string/levenshtein@1`, 6 on `number/parse@1` — beside
51 `code` elements produced correctly on that same slugify page from its own calls. A visitor reading
the page a stranger lands on met the punctuation.

## Considered Options

- Leave the register open and take the backticks out of the catalogue's prose by hand.
- Parse the catalogue's prose with the function that already parses the method page's.
- Write a second parser beside the contract page, narrower.

## Decision Outcome

**The same function, moved to a module both pages reach.**

What settles the register — the thing ADR-0026 said nothing mechanical could settle — is that there is
nothing to guess at. Every one of the 220 is paired: 55 spans on slugify, 43 on date/add, 9 on
levenshtein, 3 on number/parse, and **zero unpaired backticks on any page**. A mechanical conversion
is total here, with no case where a reader's judgement would be needed. Measured over the same pages,
there are **zero asterisk pairs**, so the second mark costs nothing today and the rule is complete on
the day it is written rather than half of one.

The third option is refused by ADR-0026's own sentence: *a copy of a parser is not a second opinion,
it is the same statement written where nobody will maintain it.* `asCode`, `inline` and `paragraph`
move out of `methodology-page.ts` into `marks.ts`, and the method page reaches them from there.

### Prose and content, which is the one line a caller has to get right

A backtick in a rationale is syntax; the same backtick inside a rendered call is the contract's own
answer and a character of it. So ten prose fields are routed through the parser — a contract's
description, its relation to the language, its input domain, a table's purpose, a group's title and
note, a case's rationale, a property's reason, a profile's description, the coupling rule — and no
value `literal` produced is. That is the line `document.ts` already draws with `THE_MARKDOWN.verbatim`,
arriving one floor up where the tree is built rather than where it is projected.

## Consequences

Measured after: **zero backticks on every page**, and the `code` elements rise by exactly the number of
paired spans — slugify 51 → 106, date/add 52 → 95, levenshtein 32 → 41, number/parse 59 → 62. The
Markdown projection stops escaping those backticks as `` \` `` and publishes real code spans, which is
why the four `index.md` twins grow 13 % to 18 %.

**Two guards over a contract page were looking a value up in the reading by its literal**, and
`separators-the-family-does-not-cover` is the row that found it: that group's title holds a mark, so
the search was for a string no reader is shown. `asRead` already existed for exactly that, one
describe block along, and moves to the file's own scope rather than being spelled a second time. It is
the same defect this rule is about, arriving in the guards that check it.

## Confirmation

`no-mark-a-sentence-carries-reaches-the-reader-as-itself` stops being asked of the method page alone
and sweeps every page `theSite` builds. Seen red on its real condition before being believed: with a
case's rationale reverted to a plain text node, it reports ``unparsed code on
typescript/number/parse@1/index.html: [ '`empty`' ]``, and the two guards above redden with it.

The population is every page of the site, so this is a sweep rather than four more call sites somebody
has to remember. It does not reach the 404, which takes no prose from a record and is not a page
`theSite` builds.

## What would reopen this

A contract whose prose means a literal backtick or a literal asterisk pair. The whole argument here is
that there is nothing to guess at, and one unpaired mark in a rationale is the counter-example: the
parser would leave it as the character it is, which is correct, while a *paired* pair meant literally
would silently become a code span. The catalogue would then owe a way to write one — an escape, which
is a third mark and a feature nobody has asked for.

## More Information

- [ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md) — the rule this extends, and the record
  whose reopening condition named this unit.
- [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md) — the page that took the
  prose, rebuilt in the same unit.
