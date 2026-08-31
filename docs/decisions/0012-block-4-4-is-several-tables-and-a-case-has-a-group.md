---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/registry/contract-record.ts
  - packages/registry/serialise.ts
confirmed-by:
  - battery: registry-storage
    guard: a-grouping-that-is-not-a-partition-is-refused
  - battery: registry-storage
    guard: a-group-that-takes-a-case-address-is-refused
---

# Block 4.4 is several tables, and every case belongs to a declared group

## Context and Problem Statement

Block 4.4 was modelled flat. Two contracts had gone out of their way to separate their tables, and all
187 cases sat inside a comment banner — `--- Whitespace ---`, `--- Sign ---` — that the record threw
away. A page could therefore only render fifty rows in a row.

## Considered Options

- One flat array of cases per contract.
- Several tables, each declaring the groups its cases are partitioned into.

## Decision Outcome

A table of block 4.4. Plural, because block 4.4 is not one table: `date/add@1` carries a typed and an
untyped one, and `array/group-by@1` carries a typed one and a table of inputs no TypeScript caller can
write. Flattening them into one array would lose the distinction those two contracts went out of their
way to make, and a case identifier is unique across a contract rather than across a table, so nothing
is gained by the flattening either.

**Another of the defects a consumer found in this schema, and the second the site found.** The
contracts grouped their cases in comment banners - `--- Whitespace ---`, `--- Sign ---` - and all 187
cases sat inside one, between two and nine cases each. The record was flat, so a page could only render
fifty rows in a row: measured by printing both, fifty read as a dump and a reader still could not
*find* anything, while twelve sections are twelve short answers to twelve questions somebody arrives
with. The judgement existed in the source and its shape as data did not, which is the same defect as
`parameters` arriving one unit earlier - the source said something the record threw away.

The banners are gone with this field. Two statements of one grouping drift, and it is the second that
lies; one of the four banners carrying prose already said *five rows* over six cases. That prose now
sits on the group declaration it describes.

**A table declares its groups, every case names one, and the comment banners are gone.** Forty-eight
groups over seven tables and 187 cases: twelve on `number/parse@1`, twelve on `date/add@1`, ten on
`string/slugify@1`, eight on `array/group-by@1`, six on `string/levenshtein@1`. It is another of the
defects a consumer found in this schema — the judgement existed in the source and its shape as data did
not, which is the same failure as the parameter names one unit earlier.

**The partition was derived from the banners while they were still there, and read back before they
went.** Two of the seven tables carried no banner, and their groups were read off what their cases
already hold rather than invented: `reason` on `date/add@1`'s untyped table, `outcome.kind` on
`array/group-by@1`'s. The second corrected a guess — the distinction is *not iterable* against
*iterable but not an array*, not anything about the key function.

### A case names its group

Which group of the table this case sits under. Required, never optional: a case with no group would be
a silence about where it belongs, and `groups` is non-empty by the same refusal, so there is always a
value to give.

### A table declares its groups

The groups this table's cases are partitioned into, in the order the page renders them.

Non-empty, and the partition is refused in both directions by `serialise.ts`: a case naming a group
the table does not declare, and a declared group no case sits in. Both would put an address on the
page that leads nowhere.

### What a group carries beside its address

**`id` is frozen, `title` is prose and corrigible** — the separation a guard's identifier and sentence
already carry, for the same reason, which is why `CaseGroup` lives in `packages/catalogue/identifier.ts` beside
the shape of an address. Splitting a group, merging two or renaming an `id` costs `name@2`; adding a
case to an existing group costs nothing, and that is the common gesture.

**A group carries a `note`, required and `string | null`.** Having nothing to add is written rather
than omitted — the shape `ImplementationRecord.version` already takes — and 44 of the 48 are `null`.
The split is what the sentence is addressed to: prose for whoever reads the page goes in the field,
prose for whoever maintains the table stays a comment. Four exist, and one of them says in as many
words that its rows are there so a declaration has *a demonstration on the contract's own page* — a
sentence that had been moved into a comment, which was a loss of content and not a tidying.

**`note` is not frozen, and it is the only field of a group that is not.** `id` is the address and
freezes with the major; a title and a note are prose, corrected the day they read badly, exactly as a
`rationale` is. And a declared note is rendered: there is no state between carried and shown, which is
the class `coverage.test.ts` already refuses on the record.

## Consequences

**The space it is asked over is the contract's cases *and* its groups**, because a page renders both as
`#id` and a duplicate is a link that silently lands on the wrong element. Widening the question was the
repair rather than writing a second guard: it was always *can these strings address something*, and the
grouping only added strings. It found two the day it was widened - `exponent` on `number/parse@1` and
`normalisation-is-not-applied` on `string/levenshtein@1`, each a group named after a case of its own
table.

The group is what moved, because the case identifier is the older statement.

**`every-case-is-grouped` is the fourth guard the catalogue owns.** `groupingFaults` has one
implementation and two callers, and the reason is not symmetry: `npm test` collects `contracts/` and
nothing else, so the serialiser's refusal is never reached by what a specification battery runs, and a
mutant moving a case between groups would have been a defect nothing probes. Five cells now probe it.

**The order of two cases inside one group is not an address either, and it is the cheapest thing on a
contract page to get right.** The order of the *groups* is frozen and declared; an `id` is an address
and a group membership is a partition; what is left — which of a group's rows comes first — is neither,
and moving one costs nothing. It matters because the playground opens on the first case of the first
table: `string/levenshtein@1` opened on two empty fields answering `0`, where a reader has nothing to
edit and has watched nothing happen. `identical-text` is the same claim with something in it, one
keystroke from moving the answer, and it is now first. Checked before moving rather than after: nothing
in this repository pins which case comes first, and the two cases whose own rationales are about being
a pair stayed adjacent.

### What the grouping costs the page

**A table's purpose is a heading only when it separates two tables.** On the three contracts carrying
one, the purpose is a sentence in the lower case a sentence is written in, and a heading that is not a
title is a defect rather than an untidiness — it enters the document outline and a screen reader
announces it as a section, with nothing on the other side of it. So it is a paragraph there and the
groups take `h3`; where two tables separate typed callers from callers no type reaches, it keeps its
heading and the groups sit at `h4`. **The tag is the outline and the class is the look**, so a group
reads the same at either depth — `.group` and `.table`, never `h3` and `h4`.

**The page cost 8.2 per cent, in two steps.** Measured over the six pages: 120 181 bytes before the
grouping, 127 289 after it, 130 042 after the notes and the heading change. The 159 bytes the front
page and the refusals page each gained at the first step are the stylesheet, which is the whole of
their share. `h4` was added to the text projection's separator map in the same change — without it a
group title runs into the case beneath it, which is the exact shape of `not applicableThe signature
takes a single string`, caught before it existed.

What the partition check cannot see is declared rather than closed: a case moved into the group *next
to* it leaves a partition that is still well formed, so nothing objects and the page publishes the row
under its neighbour's heading. Closing that class would need a guard claiming to check that a case
*belongs* where it is filed, which is a judgement about prose. LS-14 was written that way by accident
and survived; it now moves a case to a group that is not its neighbour.

## Confirmation

`a-grouping-that-is-not-a-partition-is-refused` and `a-group-that-takes-a-case-address-is-refused` in
`packages/registry/against-the-catalogue.test.ts` hold the two refusals;
`every-group-is-a-heading-and-its-cases-follow-it` in `packages/site/pages.test.ts` holds the rendering
the grouping exists for. `every-case-is-grouped` is one of the four guards the catalogue owns, in
`packages/catalogue/every-contract.ts`.

## What would reopen this

A sixth contract whose cases do not partition — overlapping groups, or a case that genuinely belongs to
two. The partition is the load-bearing half, and a contract that cannot express itself under it is the
event that reopens the shape rather than the refusal.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
