---
status: accepted
date: 2026-08-22
governs:
  - packages/registry/search.ts
confirmed-by:
  - battery: registry-storage
    guard: a-query-the-catalogue-cannot-answer-answers-nothing
  - battery: registry-storage
    guard: a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing
  - battery: registry-storage
    guard: a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers
  - battery: registry-storage
    guard: a-corpus-of-real-queries-ranks-the-right-contract-first
  - battery: registry-storage
    guard: every-declared-alias-finds-its-own-contract-first
---

# A word left out and a word brought in are charged separately

## Context and Problem Statement

`toopo search parse yaml` answered `number/parse@1` — *Convert a string to a finite number, or null
when the string is not a decimal number* — to somebody looking for a YAML parser. ADR-0144 measured
that at the sixth contract, named the cause, and refused the one repair the code admitted: moving
`TELLS_THE_CONTRACTS_APART` fixes `parse yaml` and breaks `remove accents from string`, which is a
worse query to be wrong about. It left the debt in `CLAUDE.md` in one sentence.

> The allowance exists for a word a query *leaves out* — a preposition it did not spell — and it is
> being spent on a word the query *adds* that the catalogue has never heard.

That sentence is exact and it is about one line:

```ts
if (answered.length !== words.length && !namedByWhatTellsThemApart(fields, answered, spread)) {
  return null
}
```

The condition on the left is *the query brought in a word this contract cannot answer*. The test on
the right is *the query named a field, allowing for the words it left out*. **One gate, two
questions, and the second one was never asked** — an addition cost nothing at all.

### It is twelve requests and not one query, and the count was the argument

`parse yaml` was the entry of the negative corpus that happened to break. Measured at `a705977`, the
mechanism had eleven more doors open. A door is a deliberate field whose set of words that still tell
the contracts apart has come down to one: any query carrying that one word names the field, and
whatever else the reader typed is set aside for free.

Over this catalogue's own six publications, in the order they happened:

| after | deliberate fields with one telling word | distinct words that open one | of eight requests, answered | of four beside them |
| --- | --- | --- | --- | --- |
| `number/parse@1` | 0 | 0 | 0 | 0 |
| `date/add@1` | 0 | 0 | 1 | 0 |
| `array/group-by@1` | 0 | 0 | 1 | 0 |
| `string/levenshtein@1` | 2 | 1 | 1 | 1 |
| `string/slugify@1` | 15 | 7 | 2 | 4 |
| `number/round@1` | 21 | 11 | 8 | 4 |

The eleven words at the sixth contract are `add`, `distance`, `fixed`, `float`, `int`, `levenshtein`,
`number`, `parse`, `round`, `slug` and `slugify`.

**The requests split in two and the split is the honest part of this record.** Eight are things
somebody types that this catalogue holds nothing for: `parse yaml`, `parse json`, `round robin`,
`add to cart`, `add an event listener`, `float left`, `fixed header`, `distance between two cities`.
Four more are the same one-word doors and this catalogue **could** have answered them:
`number formatting`, `levenshtein automaton`, `slugify a blog post`, `slug from an object id`.

The four were written into the negative half of the trial first, and taking them out is the corpus
rule holding against the person applying it: that list says *the catalogue cannot answer this*, and
somebody typing `slugify a blog post` wants the function this catalogue holds. A query belongs there
because a person would type it **and** because there is nothing here for them — never because it
happens to fire the mechanism under repair.

### The rate does not improve by growing, and it does not only get worse either

`CLAUDE.md` recorded that the mechanism *is monotone in the size of the catalogue*. **The word count
is monotone and the precision is not**, and this catalogue's own history moved it both ways: the
negative half of the trial had one query answered at one, two, three and four contracts, **none at
five**, and one again at six. What silenced it at the fifth was growth — `string/slugify@1` took
`string` to three contracts, so it stopped telling them apart, and `remove accents from string` lost
the field it had been naming.

So a field's telling words falling away can close a door as well as open one, and what nothing here
can say is which happens at the tenth contract. That is stated rather than modelled: there are no ten
contracts to measure, and the words a seventh declares are not predictable from the six.

## Decision Drivers

- A wrong answer is worse than a silence. It is the reasoning ADR-0035 rests on and the reason the
  whole catalogue came off `toopo search`.
- ADR-0136's repair may not be undone. A rewording that brings in no unknown word must answer what
  the wording it rewords answers.
- The repair may not be a list of words to ignore, refused when this file was written: a list decides
  which words carry meaning, a count observes it.
- `identity.searchAliases` is inside the frozen half and five of six contracts are published, so the
  repair ADR-0035 prescribes for this shape — *a missing alias* — is available on the one contract the
  catalogue refused and on nothing else. Repairing the rule was the only road open.

## Considered Options

### Refuse any query carrying a word no contract answers at all

The most attractive option, and it is dead on a measurement. `unknownWords` already exists, it is
already what the reader is shown, and `a-rewording-that-introduces-no-unknown-word-…` is named after
the same distinction — so the line looked ready to be made load-bearing.

**It breaks four of the thirty-two corpus queries.** Measured at `a705977`: `how do I convert a string
to a number` brings in `do` and `i`, `what is the edit distance between two strings` brings in `what`,
`I need to slugify a title for a url` brings in `i`, and `how do I round a number` brings in `do` and
`i`. Every one of those words is as unheard-of in this catalogue as `yaml` is.

**So no reading of a single word separates the two**, and that is the finding that shaped everything
after it: `yaml` is a subject and `do` is a function word, the catalogue has no evidence about either,
and a rule that tried to tell them apart would be a list of words to ignore wearing a different hat.

### Ask the contract to have answered more of the query than it set aside

A rule about the query rather than about the word, which is where the previous option said to look.

**It leaves four of the twelve and breaks one corpus query.** `add to cart` reaches a majority on
`add` and `to`, `distance between two cities` on three words of four, and `how do I round a number`
falls the other way — three answered against three set aside. The function words of a longer request
pad the count on both sides.

### Ask for two of the field's *telling* words

**It breaks two of the three rewordings.** `string to number` has one telling word left — `string` is
declared by three contracts and `to` by four — so `turn a string into a number` and `string into
number` stop resolving to the contract they name. That is ADR-0136 undone by the repair for ADR-0144.

### Move `TELLS_THE_CONTRACTS_APART`

Refused with its measurement by ADR-0144, and not re-opened here. Both values break exactly one query
of the negative half and three breaks the better one.

## Decision Outcome

**A query that sets a word aside must have carried more than one word of the field it names.**

The old gate is split into the two questions it was conflating. `namedByWhatTellsThemApart` decides
**which** of a field's words may be missing — the connecting ones, and one telling one when there are
three or more. `carriedFrom` counts **how many** were there. `namedWellEnoughToSetAWordAside` is the
conjunction, and it is per field rather than over the union of them, because `add to cart` names no
field it also carries two words of while `add` and `to` do sit together in one alias of `date/add@1`.

The count is over every word of the field and not only the telling ones, which is what keeps
`string into number` working: two of the three words of `string to number`, one of which no longer
tells anything apart.

### One word is not a name

That is the whole argument, and it is `sort array` one floor down: `array` does not name
`array/group-by@1` because a word a field *contains* is not a word that names it. A query reaching a
contract through a single word of a single field is in exactly that position, and until now the
setting-aside rule was the one place that was allowed.

### The value is pinned on both sides and each side was seen red

Measured at `a705977` over the alias property, the corpus, the negative half and the rewordings:

| words of the field required | what breaks |
| --- | --- |
| 1 — no floor, the rule as it stood | eight requests answered by a contract that holds nothing for them |
| **2** | nothing in the trial; four requests it could have answered go silent |
| 3 | `how do I round a number`, and `turn a string into a number` and `string into number` |
| 4 | three corpus queries, and all three rewordings |

At 1, `a-query-the-catalogue-cannot-answer-answers-nothing` and
`a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing` were seen red. At 3,
`a-corpus-of-real-queries-ranks-the-right-contract-first` and
`a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers` were seen red.
Counting only the telling words was seen red on the same two rewordings. `S-26` and `S-27` are the two
cells that hold those sides.

### What it costs, measured over a population and not by anecdote

Over 198 queries — every alias of two or more words, each word in turn replaced by one the catalogue
does not know — the search answered the alias's own contract **151 times before and 125 after**, and
**named another contract zero times either side**. So twenty-six queries that used to be answered are
silent.

**The twenty-six and the twelve are one population read twice.** `parse zzq` is `parse yaml`; the only
thing that makes the first look like a loss is that the trial built it by mutating an alias of
`number/parse@1`. The machine cannot tell a second word that belongs from a second word that does not
— that is the first option's finding — so the choice was never which of the two to keep. It was which
way both go, and this product sends both to silence with the word it could not place named in
`unknownWords`.

**The four this catalogue could have answered are the same trade with a face on it**, and they are
named rather than folded into the twenty-six. `slugify a blog post` was a right answer and is a
silence; the reader is told `blog` and `post` are words no contract carries, and `slugify`,
`slugify a title` and `url slug` all still reach `string/slugify@1`, so what it costs them is a
retype rather than a dead end. `slug from an object id` is the odd one: it brings in **no unknown
word at all** — `object` is declared by `array/group-by@1` and `id` by `string/slugify@1` — so it is
the one case here where the word set aside is one the catalogue can place and the bound refuses it
anyway. **Whether that trade is right is the owner's and it is not settled here**; what this record
claims is only that no reading available to the rule separates those four from the eight.

**`parse a string into an integer` is silent now and it is not this bound's cost**, which is worth
separating rather than folding in. Its cause is that `integer` does not reach `int` — a shortening
goes one way only, decided long before this — and that the repair for a word the catalogue does not
carry is an alias, inside a frozen `identity`, on a published contract. Measured at `643bf7e` over
eight ordinary phrasings of what `number/parse@1` does, written with `integer` rather than `int`:
**five were already silent before this unit and eight are now**, while **nought of the same eight
written with `int` are silent**. One declared alias would answer seven of the eight, and nothing may
declare it.

So the floor moved three of those eight and revealed the other five, which the setting-aside
allowance had been masking. It belongs to the debt `CLAUDE.md` carries as *the repair a record
prescribes is one somebody can carry out* — ADR-0136 — and it is written there rather than counted
here, because attributing it to this bound would hide one defect behind another decision.

### The reading that was nearly published, and was the wrong population

A second sweep of 198 queries — every alias with one word *left out* — showed 198 answered and 189
ranking their own contract first, identical before and after, and it was about to be written down as
*the omission axis is untouched*.

**Nought of those 198 reach the branch this record changes.** A query built by dropping a word from an
alias has every remaining word answered by that contract, so `scoreOf` never consults the gate at all.
The sweep measured the rule it was not aimed at. What does reach the branch, and what therefore holds
the ceiling, is the three rewordings — each leaves a word out *and* brings one in — and the 198
replaced-word queries above.

## What would reopen this

- **A seventh contract does not reopen it**, and that is the point of the guard being total over the
  words the catalogue declares rather than over a list of requests. A field whose telling words fall
  to one enters the guard's population by being published.
- **A word a query adds becoming separable from a word it omits.** Nothing available today does it.
  A field the catalogue holds about a contract's *input domain* would — `identity.inputDomain` says
  in prose that `number/parse@1` is *not a locale-aware parser* — and it is prose, inside the frozen
  half, on five published contracts. ADR-0128 is why that is not a new field.
- **The line at one word rather than two words.** It is where the catalogue's own evidence starts:
  two words the reader carried out of one field are two things the contract chose and the query
  spelled. `edit distance zzq` answers `string/levenshtein@1` and no reading here says whether it
  should. If a request of that shape is ever met and is wrong, this is the paragraph that was
  written before it.
- **A field that spells its one telling word twice.** `carriedFrom` deduplicates, nothing in this
  catalogue distinguishes that from counting the repeats — measured, all twelve guards of the trial
  stay green with the deduplication removed — and it is kept because such a field would be a one-word
  door and nothing would report it.

## More Information

**Two battery cells were one mutant, and splitting the gate is what made them two.** `S-01` replaced
the whole condition with `if (false)` and `S-02` replaced it with
`if (answered.length !== words.length && false)`. A conjunction with either operand false kills the
branch, so those are the same defect written twice. They are distinct now because the test on the
right has two clauses that can be taken away separately, and they catch different things:
`a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing` is red under `S-01` and
green under `S-02`, where the price is still being charged.

**`S-01`'s pin named two guards where four reddened**, measured at `a705977` by injecting it there.
ADR-0076 asks a pin naming five or fewer red guards to name all of them; the two it left out were the
alias property and the rewording. Nothing was red, because a pin is a subset requirement — `by` names
guards that must be *among* the reddened — so the convention is kept by whoever writes the cell and by
nothing else. It names all five now.

**The census moved by one integer and no paragraph was added to it.** `packages/registry/search.test.ts`
goes from 11 guards to 12, which is the nineteenth measurement's shape exactly — no new file, one count
moved — and that file's own header says an entry is worth writing when it says something new about what
a unit costs. This one does not.

ADR-0035 is what a search may answer. ADR-0136 is the two bounds that replaced its single one.
ADR-0144 is the reading that found this, with the ceiling measured on both sides and left alone.
