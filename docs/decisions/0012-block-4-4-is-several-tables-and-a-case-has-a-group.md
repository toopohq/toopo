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
  - battery: site
    guard: every-group-is-a-heading-and-its-cases-follow-it
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
lies; one of the four banners carrying prose already said *five rows* over six cases.

### A case names its group

Which group of the table this case sits under. Required, never optional: a case with no group would be
a silence about where it belongs, and `groups` is non-empty by the same refusal, so there is always a
value to give.

### A table declares its groups

The groups this table's cases are partitioned into, in the order the page renders them.

Non-empty, and the partition is refused in both directions by `serialise.ts`: a case naming a group
the table does not declare, and a declared group no case sits in. Both would put an address on the
page that leads nowhere.

## Consequences

A group and a case share one space of addresses, because a page renders both as `#id` and a duplicate
is a link that silently lands on the wrong element. Splitting a group, merging two or renaming an `id`
costs `name@2`; adding a case to an existing group costs nothing, and that is the common gesture.

What the partition check cannot see is declared rather than closed: a case moved into the group *next
to* it leaves a partition that is still well formed, so nothing objects and the page publishes the row
under its neighbour's heading. Closing that class would need a guard claiming to check that a case
*belongs* where it is filed, which is a judgement about prose.

## Confirmation

`a-grouping-that-is-not-a-partition-is-refused` and `a-group-that-takes-a-case-address-is-refused` in
`packages/registry/against-the-five.test.ts` hold the two refusals;
`every-group-is-a-heading-and-its-cases-follow-it` in `packages/site/pages.test.ts` holds the rendering
the grouping exists for. `every-case-is-grouped` is one of the four guards the catalogue owns, in
`packages/catalogue/every-contract.ts`.

## What would reopen this

A sixth contract whose cases do not partition — overlapping groups, or a case that genuinely belongs to
two. The partition is the load-bearing half, and a contract that cannot express itself under it is the
event that reopens the shape rather than the refusal.

## More Information

Moved out of `packages/registry/contract-record.ts` by [ADR-0001](0001-record-decisions-in-madr-format.md).
