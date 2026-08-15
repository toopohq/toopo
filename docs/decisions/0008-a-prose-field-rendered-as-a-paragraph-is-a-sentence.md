---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/site/pages.test.ts
  - packages/registry/against-the-five.test.ts
confirmed-by:
  - a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence
  - a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands
---

# A carried string a page prints as a paragraph is a sentence

The register of a prose field, settled: a paragraph is a sentence.

## Context and Problem Statement

`identity.relationToTheLanguage` had no register: three of its four written values were clauses and
one was a sentence, and the page prints the value bare. Two contract pages therefore published a
fragment as a standalone paragraph for as long as the field had existed.

## Considered Options

- Declare the field a clause and let the page frame it, as the page already frames `couplingRule` and
  a table's `purpose`.
- Declare that a value printed as a paragraph of its own is a sentence.

## Decision Outcome

**A string this record carries that a page prints as a paragraph of its own opens like a sentence and
ends in a full stop.** It is not a style preference: a paragraph is a block, and a block that reads as
a fragment is a block the reader has to attach to the one above it - the class
`no-element-runs-into-the-one-beside-it` is written for, one level down, where the two things run
together inside one string instead of across two elements.

The register was decided by a census rather than by taste. Over the four contracts the registry
serves, `summary`, `description` and `inputDomain` are sentences twelve times out of twelve; of the
four `relationToTheLanguage` values ever written, the one that is a sentence is `array/group-by@1`'s
and it agrees with all twelve, while the three clauses are the exception. The alternative - declare
the field a clause and let the page frame it, as the page already frames `couplingRule` and a table's
`purpose` - is refused by the same census: `array/group-by@1`'s value is *two* sentences, so no frame
fits it, and a frame that fitted would have to be re-decided for prose that is already written.

### The predicate

The register itself, as a predicate: it opens like a sentence and it ends like one.

Shape and nothing else, which is what separates it from a lint over prose. *Is this well written* is a
judgement and would be the class `CLAUDE.md` prices and refuses; *does this begin with a capital and
end in a full stop* is decidable, is the whole of what a rendering needs, and cannot be wrong about
what it claims.

The one refusal it can make wrongly is named rather than left to be met: a sentence that legitimately
opens on a lower-case identifier. Five exist in this catalogue's prose today - `parseFloat("1.2.3")
answers…`, `luxon…` - and all five are mid-string, where nothing asks. A paragraph that opened that
way would be refused and would have to be rewritten, which is the loud direction and the cheap one.

### The walk

Every string a record carries, at any depth.

Both guards of the register need it and neither may own it, so it is here, beside the rule. It takes
`unknown` for the reason `pathsIn` does: a `ContractRecord` and the `FrozenContract` a page is built
from are two types over one shape, and the walk is about the shape. Nothing is skipped and no field is
named - a walk that knew which fields hold prose would be the list this rule exists without.

## Consequences

The limit is declared rather than discovered: **a contract the catalogue refused has no page**, so
nothing asks this of `array/group-by@1`'s prose. That is the limit every guard about a page already
has, and it is the right one here - a clause is not wrong in a record, it is wrong rendered as a
paragraph.

Two neighbours stay outside the rule and are named so they are not read as oversights. A table's
`purpose` and `couplingRule` are punctuated *by the page*, so their paragraph is not the carried
string and they fall out of the derivation on their own.

## Confirmation

**What keeps it is two guards, and they are a partition rather than a pair.** A value is standing
alone or it is embedded, and nothing else. `a-value-rendered-as-a-paragraph-of-its-own-is-a-sentence`
in `packages/site/pages.test.ts` takes every string this record carries and asks it of each one that is
the whole reading of a paragraph - 212 of them today, derived from the page and the record, so a prose
field added tomorrow is covered with nothing edited here.
`a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands` in
`packages/registry/against-the-five.test.ts` takes the other half: a value the catalogue shares between
contracts is composed into a longer string, so no field-shaped guard can see its seam.

## What would reopen this

A page that frames a carried string rather than printing it bare. The rule is about what a *rendering*
does with a value, so a second rendering of the same field is what would put it back in question —
which is why `couplingRule` and a table's `purpose` are outside it rather than exceptions to it.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
The two contracts that carry no `relationToTheLanguage` at all are
[ADR-0009](0009-relation-to-the-language-is-optional.md).
