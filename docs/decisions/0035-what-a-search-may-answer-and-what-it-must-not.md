---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/cli/search.ts
confirmed-by:
  - battery: cli-search
    guard: a-query-the-catalogue-cannot-answer-answers-nothing
  - battery: cli-search
    guard: a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not
  - battery: cli-search
    guard: a-corpus-of-real-queries-ranks-the-right-contract-first
  - battery: cli-search
    guard: a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias
  - battery: cli-search
    guard: a-miss-names-the-words-no-contract-carries
---

# What a search may answer, and what it must not

> **One clause of this record is no longer what the code does, and it is the words *in full*.**
> [ADR-0136](0136-a-rewording-answers-what-the-wording-it-rewords-answers.md) measured what requiring
> the whole of a field cost - `turn a string into a number` answered nothing while
> `convert a string to a number` answered - and replaced it with the words of a field that tell the
> contracts apart. It also found the opposite defect in the same line, which this record's own rule
> exists to refuse: with every word of the query answered there was no bound at all, and
> `toopo search a` returned the whole catalogue. Everything else below stands, including the refusal
> of a list of words to ignore, which ADR-0136 keeps and argues from again.
>
> **And the repair this record prescribes for a query only a description could have answered - a
> missing alias - cannot be carried out on the four published contracts.** `identity.searchAliases` is
> inside the frozen half. `CLAUDE.md` carries that as an open entry; a reader of the paragraph below
> should not leave believing the door is open.

## Context and Problem Statement

`toopo search` is the command that decides whether somebody finds anything in ten seconds. A search over
five contracts can be made to answer something for almost any query, and a search that always answers
something is the one nobody believes twice.

## Considered Options

- Rank every contract against every query and show the best.
- Refuse a query the catalogue cannot answer, and say which words no contract carries.

## Decision Outcome

**Every word of a query must be answered by something the contract carries.** It is the only rule
under which a search over this catalogue can answer *nothing*, and a search that always answers
something is the one nobody believes twice. Measured over twenty utilities the catalogue does not
hold — `debounce`, `deep clone`, `uuid`, `flatten nested array` — it answers nothing twenty times.
`sort array` is the case that decides the rule: `array` is half of a contract's own name.

**A word a contract cannot answer is set aside for that contract, and what remains must then name one
of its own names, exports or aliases in full.** Without it, `convert a string to a number in
javascript` answers nothing, because `in` occurs in one contract's summary and not in the one being
asked for. A list of words to ignore was refused: it decides invisibly which words carry meaning, and
`to`, `by` and `from` carry it here — twenty-seven of the sixty-two aliases hold one of them. That
figure used to read *fourteen*, and it was wrong: it was also the figure `packages/cli/arguments.ts` published
for a different claim, the aliases carrying a space, where the true number was fifty-six of seventy.
Both are measured now rather than restated, which is the only thing that stops a number from migrating
onto a claim it was never about.

**A query may shorten a word the catalogue carries and may never extend one.** A symmetric prefix reads
better and was measured: it answers `stringify` with all three contracts carrying `string`, and
`datepicker` and `dateline` with `date/add@1`. The English plural is bought back explicitly and nothing
else about English is claimed. There is no typo tolerance, and calling `string/levenshtein@1` from the
CLI was refused twice over — it would buy the behaviour the first rule exists to refuse, and it would
take `cli/` across the frontier `source.ts` holds.

**The description is not in the index, and the aliases are its searchable surface.** Measured: the five
index to 2 969 bytes and their descriptions alone to 6 187, so carrying them would more than triple the
one document
every search pays for. A query only a description could have answered is a **missing alias**, and the
repair belongs in `identity.searchAliases` where it is frozen, reviewed and served.

## Consequences

**And the ranking has almost nothing to rank, which is a fact about the matching rather than a gap.**
Nought of the eighty-nine aliases and corpus queries answers more than one contract, so inverting the
comparator broke no trial at all. Of 161 distinct words in the index, 25 answer more than one contract
and 7 carry a score that tells them apart — four of those seven are `a`, `by`, `from`, `to`. Two are
real queries. Two constants died of it: an exactness multiplier that moved nothing at 2 or at 100, and
a full-query bonus that could not change an order because no full query has one. **A number that
cannot change an answer at any value is not a rule**, and speculative insurance no guard can reach is
what `field-map.ts` calls a speculative field and deletes.

## Confirmation

`a-query-the-catalogue-cannot-answer-answers-nothing` is the load-bearing one and it is the guard the
whole rule exists for. `a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not` holds the
asymmetry in both directions, which is the only form it can be kept in.
`a-miss-names-the-words-no-contract-carries` is what makes a refusal a door rather than a wall.

The corpus trial ranks real queries, and it is named here with what it does not establish: an alias is
in the index, so it matches its own contract by construction — the trap
[ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md) is written for.

## What would reopen this

A catalogue large enough that two contracts answer one query, which is where the ranking starts having
something to rank. The measurements above are all of a five-contract catalogue and say so.

## More Information

- [ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md) — the searchable surface
  this rule matches against.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
