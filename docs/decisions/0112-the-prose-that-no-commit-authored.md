---
status: accepted
date: 2026-08-18
governs:
  - mutation/hands.ts
confirmed-by:
  - battery: meta
    guard: every-source-that-holds-prose-yields-a-paragraph
  - battery: meta
    guard: every-paragraph-a-reading-reports-is-attributed-to-a-commit
---

# The prose that no commit authored, and why the reading reports rather than refuses

## Context and Problem Statement

This repository's prose carries its arguments, and the arguments are real and measured. What nothing
watched is a paragraph that has been edited by several units and read whole by none of them: it goes
on gaining clauses, each correct where it was added, until the paragraph says less than the sum of
its parts. Three instances were found by hand, which is not a method.

**The mechanism is insertion and not appending, and that was measured rather than assumed.** The
header of `packages/registry/address.ts` was the first instance. Its blame at `2385fc2`:

    f9d1b079  2026-08-03  10  Nothing below is a string. That is the whole content …
    f9d1b079  2026-08-03  13  cost in advance - "…the pair, never the identifier alone" -
    9053d18d  2026-08-16  14  and ADR-0099 is why the `@` stayed …
    ce98c449  2026-08-15  15  and ADR-0031 is why `THE_ORIGIN` …
    c1fa3b2e  2026-08-15  16  ADR-0049 is why every rendering carries the language …
    c1fa3b2e  2026-08-15  17  first instance of -
    f9d1b079  2026-08-03  18  and fifteen identifier strings are held by more than one contract …

Four commits spliced four clauses **between** line 13 and line 18. The closing clause is original, and
it reads as a non-sequitur because it used to follow line 13 directly. The dash opened at line 17 is
one commit opening an incise into another commit's sentence, and it never closes. Appending makes a
paragraph long; splicing orphans the clause that used to close it, which is worse and is what
happened.

That measurement decided the shape of everything below. A signature keyed to *growth at the end*
would have missed the instance it was built from, because these timestamps are not monotone.

## Considered Options

Five signatures were implemented and run over the three populations. A signature is worth having only
if it finds instances nobody had found, so each was scored on what it caught **besides** the three
known ones.

| signature | hits | true | why it fails |
| --- | ---: | ---: | --- |
| an incise dash that never closes | 7 | 1–2 | a lone dash legitimately introduces a final clause; `reconcile.ts`, `served-headers.ts` and `verifiability.ts` are correct parallel constructions |
| a repeated opening phrase within a section | 228 | 2 | cannot tell deliberate parallelism from collision — `The rule that…`, `What stays open…`, and 216 `Good, because` of the MADR format |
| three or more records named in one sentence | 6 | 1 | **it is a convention here**: `document.ts`, `paths.ts`, `every-contract.ts`, `report.ts` and `contract-record.ts` all list their records in parallel clauses, and they read well |
| a back-pointing opener on consecutive siblings | 7 | 1 | every entry of `CLAUDE.md`'s debts list opens `That the…`, which is a complementiser and not a demonstrative |
| **the count of commits over a paragraph** | 32 | — | chosen; see below |

The third is the most useful failure. Naming several records in one sentence looked like the defect
and is the house style; what separates `address.ts` from `document.ts` is not how many records are
named but that one of them grafts the names into a sentence whose subject was something else.

## Decision Outcome

**A paragraph has an author when one commit's blame covers every one of its lines, and the count of
distinct commits over it is its *hands*.** `mutation/hands.ts` reports them; `npm run hands` is the
command.

It is chosen because it is not a symptom. *The paragraph no longer has an author* is the definition of
the class, and `git blame` is the only thing that decides the author of a line, so the signature is
that sentence made executable rather than a typographic trace of it.

**Three hands is where the report starts listing, and the cut was measured rather than picked.** A
sample of seventeen two-hand paragraphs at `2385fc2` reads clean — contract headers, module headers,
well-built blocks — because two hands is ordinarily a correction. Three is the first count at which
two separate units have edited a paragraph without either touching what the other left.

### What is not decided by it

The count is diagnostic and never a verdict. It says where to read; whether the prose is damaged is a
reading, and the ratio below is what a reader needs in order to judge whether the reading is worth
taking again.

## Consequences

**Measured at `2385fc2`, over every tracked source: 8 046 paragraphs across 362 files, 32 at three
hands or more.**

| population | paragraphs | 1 | 2 | 3 | 4 | 5 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| production | 2 932 | 2 705 | 210 | 15 | 1 | 1 |
| records | 2 147 | 2 092 | 54 | 1 | — | — |
| prose | 226 | 196 | 24 | 5 | — | 1 |
| guards | 1 479 | 1 414 | 62 | 3 | — | — |
| instrument | 1 262 | 1 181 | 76 | 5 | — | — |

The three populations this unit swept for repair — production, the records, and `CLAUDE.md` — hold
**22** of the 32. **Nine needed rewriting and thirteen did not.**

That ratio is the finding a later reader needs. At 22 of 22 the signature would measure the defect
directly; at 9 of 22 it designates a zone, and roughly three paragraphs in five that it names are
sound. It is worth running again, and it is not worth acting on without reading.

**What the reading found that no signature was looking for.** Reading the nine is what produced the
rest, and it is the argument for correction over count:

- **Four false ranks.** `packages/validation/`, `packages/cli/`, `packages/site/` and `packaging/`
  each called themselves the *n*th configuration in this repository. Ten exist and none was ever
  deleted. Ordered by commit timestamp they are the 5th, 6th, 7th and 8th; excluding the two under
  `mutation/` they are the 3rd, 4th, 5th and 6th; excluding only `mutation/fixture/` they are the 4th,
  5th, 6th and 7th. **The two conventions that save two ranks save disjoint pairs**, so no reading
  makes more than half of them true, and a reader who verifies one correctly refutes two others. The
  ranks are gone rather than corrected, on the rule this file already applied to its own numbered
  series.
- **A stale sibling list.** `serving-over-http.ts` named `imagined-source.ts`, `temporary-project.ts`
  and `serving-a-tree.ts` as *the modules here that exist for guards*. `breakage.ts` is a fourth,
  imported by `breakage.test.ts` and nothing else. The enumeration is gone; the class and the guard
  that decides it remain.
- **A false count.** `packaging/vitest.config.ts` called its timeout *the larger of the two this
  repository declares*. Four are declared and three of them sit at the same value.
- **A dated figure with no coordinate.** `address.ts` published *fifteen identifier strings are held
  by more than one contract today*. The count is gone rather than stamped, because ADR-0018's first
  rule is that a sentence which can be true without counting does not count, and `determinism` being
  held by all five is stated in the same file.

**A second signature, cheap and precise, covers the second instance.** A heading inside a comment is
the house style, not a defect: at `2385fc2`, over production TypeScript alone, **317 rule lines in 64
files**. What deviates is the *position* rather than the heading — of the 66 comment blocks carrying
one, **61 are file headers and 5 are attached to a declaration**. All five are repaired: the rule and
the heading become the bolded lead sentence the same files already use one paragraph later.

The population is stated twice above because it had to be. The first draft of this paragraph read
*331 rule lines in 67 files* beside the 61 and the 5 — the first pair counted test files and the
second did not, which is two populations in one sentence, in the record about that.

### A repair can raise the count, and a later reader has to know that

Re-read after the nine repairs, the tree carries **25** at three hands or more against 32, and
production carries 10 against 17. Two of the movements are the wrong way round, and they are the most
useful thing this measurement produced.

`CLAUDE.md:232-238` stood at **two** hands. Its defect was one word - an opening *That last one is*
pointing at a third different antecedent - so the repair replaced the opening sentence and left the
rest, which was sound. It now stands at **three**. The same happened to the conventions entry, which
kept its rank of three across a repair that split it in two.

Nothing went wrong. The count asks whether one commit wrote a paragraph, not whether the paragraph is
sound, so a targeted repair adds a hand exactly as an accreted clause does. **The two are
indistinguishable to the metric and are opposites to a reader**, which is the whole of why this is a
report and not a check: a number that falls after a sweep would be read as prose getting better, and a
number that rises would be read as prose getting worse, and neither reading is available from the
number alone.

It also disposes of the one repair a check would have rewarded. Rewriting those paragraphs whole would
return them to one hand and change nothing a reader sees, which is the reflow objection arriving from
the other side: the cheapest way to satisfy the count is to touch prose that did not need touching.

**What is left undone, named rather than dropped.** Ten of the 32 fall outside the three swept
populations. Eight read clean. `README.md:31-37` is excluded by this unit's brief. `mutation/census.ts`
carries *A twelfth on the licence* and *A thirteenth on the narrowing* — the same ordinal defect as the
four ranks, in the instrument, and it is recorded in `CLAUDE.md` rather than repaired here.
`packages/registry/local-read-api.ts` carries *The third reader of one source*, which is a rank, is
currently true, and states its own population in the paragraph below it.

## Confirmation

Two guards, and neither reads what the other derives.

`every-source-that-holds-prose-yields-a-paragraph` compares the extractor's answer against a statement
of *does this file hold prose at all* that shares no code with it. Seen red by inverting the test that
separates prose from an indented sample: 343 of 362 sources yielded nothing, and the command printed a
distribution and a clean list rather than an error — which is the failure this guard exists in front
of, because a reading that silently saw nothing prints what a clean tree prints.

`every-paragraph-a-reading-reports-is-attributed-to-a-commit` reads one file and asks whether blame
parses at all. Seen red by widening the porcelain pattern to a 64-digit identifier: `handsOn` refuses a
paragraph attributed to nobody rather than counting it at zero, so the red arrives as that refusal.

**Neither guard reads `HandsReading.visited`.** That field is the list of paths the reading was handed,
so comparing it against `trackedSources()` would establish that the derivation is self-consistent,
which is true of a derivation with a hole in it. ADR-0087.

## What would reopen this

**A guard over hands is refused, and the argument is the reflow.** `git blame` attributes a line to the
commit that last changed it, so a commit that rewraps a paragraph returns it to one hand with the prose
untouched. A check whose cheapest satisfaction is a whitespace change converts a signal into a ritual,
and it is worse than no check because it is read as coverage. Its red event is also the wrong one:
*somebody edited prose twice* rather than *prose is defective*.

**A sweep that ran once and was written up in prose was refused too, and by this repository's own
precedent.** The tree digest of `1.0.1` was withdrawn because nothing here computed it and no reader
could rebuild it. Publishing the table above from a script in a temporary directory would repeat that
exactly. So the reading is committed as a command that holds nothing, on the precedent of
`npm run anchors` and `npm run tally`.

What would reopen the guard question is a later reading whose repaired-to-healthy ratio approaches
*n* of *n*. At that point the count would be measuring the defect rather than designating a zone, and a
check that refuses would be arguable — against the reflow objection, which does not go away.

The entry in `CLAUDE.md` carries what stays open: the population is every paragraph of prose this
repository holds, and nothing keeps it between readings.
