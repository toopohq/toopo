---
status: accepted
date: 2026-08-19
decision-makers: Mathis Perron
governs:
  - packages/registry/search.ts
confirmed-by:
  - battery: registry-storage
    guard: a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers
  - battery: registry-storage
    guard: a-word-only-a-summary-carries-answers-nothing-on-its-own
  - battery: registry-storage
    guard: a-query-the-catalogue-cannot-answer-answers-nothing
  - battery: registry-storage
    guard: a-corpus-of-real-queries-ranks-the-right-contract-first
---

# A rewording answers what the wording it rewords answers

## Context and Problem Statement

The site is to serve the same search the client serves, and the owner fixed the outcome rather than
the method: **somebody who describes what they need in ordinary language finds the function.** Before
anything was built, that promise was measured against nineteen ordinary descriptions of what these
five functions do. **Six were answered and thirteen were not**, and several of the thirteen were a
working query with one word changed - `convert a string to a number` answered and `turn a string into
a number` answered nothing, with not one word in it the catalogue had never heard.

The owner then fixed the criterion, and it is the whole of what this record was asked to satisfy: **a
rewording that introduces no unknown word must not answer differently from a wording that works.**

[ADR-0035](0035-what-a-search-may-answer-and-what-it-must-not.md) is where the rule being repaired was
decided, and its argument is not in question here. *Every word of a query must be answered by
something the contract carries* stands; so does the refusal of a list of words to ignore; so does the
setting-aside rule that makes a long sentence reachable. What moves is one clause of one sentence.

## The cliff had two sides, and the criterion named one of them

**Measuring the silence found the opposite defect in the same line, and a repair aimed only at the
silence would have shipped it.** The rule had exactly one bound, `namedInFull`, and it was reached
only when a word went unanswered. Where every word of the query happened to be answered there was no
bound at all - and a summary is a word list nobody chose, so:

    toopo search a      four contracts, which is the whole catalogue
    toopo search to     three
    toopo search in     two

Over eighteen bare function words, **seventeen answered and they returned 37 results between them**.
Measured differently and worse: **77 distinct words that appear in no name, no export and no alias of
this catalogue each returned something**, `the` returning all five entries.

That is the failure ADR-0035 exists to refuse, arriving through the branch that rule never bounded -
*a search that always answers something is the one nobody believes twice*. It matters more here than
it did on a terminal, because the surface being built is a palette that answers as somebody types:
the first character a reader enters would have returned the catalogue.

So the shape of the defect is one cliff with two sides. Too loose where every word is answered, too
tight the moment one is not, and nothing in between. **A repair of either side alone leaves the
other**, and both are measured below in the same trial.

## Considered Options

Eight candidate rules were built and run against every population at once. Only the four that decide
anything are kept here; the others lost the corpus, the aliases or the negative half outright.

- Require two deliberate words when something is unanswered, inside one field or anywhere.
- Require a deliberate word always, and keep `namedInFull` otherwise.
- Read a field's words for what they establish, and require only those.
- Require a hit carried by a name or an export, not merely by a deliberate field.

## Decision Outcome

**Two bounds replace the one, and each is bought by exactly one column of the trial.**

**A result must be carried by something the contract chose.** At least one word of the query has to
have been answered by a name, an export or an alias. A summary may add to the score and may never
carry a result on its own. This is ADR-0035's own sentence - *covering a summary is not a statement
about anything* - applied to the branch it was never applied to.

**A field is named when the query carries the words of it that tell the contracts apart.** How many
contracts declare each word is counted over the deliberate fields and read off the index. `to` is
declared by three of the five and separates none of them; `number` is declared by one and separates it
from everything. So a query carrying `string` and `number` has named `string to number` whether or not
it happened to spell the preposition, and a query carrying only `array` has not named
`array/group-by@1` - which is what keeps `sort array` answering nothing.

**Nothing here is a list of words to ignore.** That was refused when `search.ts` was written and it
stays refused, on the same argument: a list decides, once and invisibly, which words carry meaning.
This counts. The catalogue is what says which words separate it, and the day a sixth contract declares
`to` in its own name the count says so without anybody editing anything.

**A field of three telling words or more may have one of them missing.** Counting what a word
establishes is not enough on its own, and one query is what says so: `by` is declared by
`array/group-by@1` alone, so it separates that contract from every other and is as telling as a word
gets - and in the alias `group array by key` it is doing the work of `with`. `group an array with a
key` brings in no unknown word, asks for exactly what that contract does, and was answered by nothing.

### The trial

Five populations, run against every candidate. The corpus is twenty-seven queries with the contract
that must rank first; the aliases are every phrase the five contracts declare; the negative half is
twenty-one utilities this catalogue does not hold; the function words are eighteen bare English
connectives; the descriptions are nineteen ordinary sentences about what these functions do.

| rule | corpus | aliases | silent on noise | function words | descriptions |
| --- | --- | --- | --- | --- | --- |
| as it shipped | 27/27 | 62/62 | 21/21 | 17/18, **37 results** | 6/19 |
| first bound only | 27/27 | 62/62 | 21/21 | 5/18, 9 results | 6/19 |
| second bound only | 27/27 | 62/62 | 21/21 | 17/18, 37 results | 12/19 |
| **both** | **27/27** | **62/62** | **21/21** | **5/18, 9 results** | **13/19** |

**Neither bound buys the other's half, and together they cost nothing.** That is what says both are
load-bearing rather than one being decoration, and it is why the two are decided in one record
instead of one being deferred.

**The corpus is unmoved, which is the claim about scope.** Ranking - which contract wins when several
answer - was placed out of scope, and 27/27 is the executable form of having stayed out of it: no
order of the corpus moved. Two earlier candidates did move one, by admitting `string/slugify@1` to
`string to int` above the contract that declares it, and both were refused for that reason rather than
on their descriptions column, which was the better one.

### The two constants, and how they were fixed

Both are pinned by a trial on either side rather than chosen.

**A word tells the contracts apart when at most two declare it.** At one, `parse yaml` is admitted,
which the negative half exists to refuse. At three and above, the silence this constant was introduced
to remove comes straight back - 6 of 19 descriptions instead of 13. Two is the only value the
measurement leaves.

**A field may keep one word back from three telling words upward.** Let a field of any size keep one
back and the same trial breaks in three places at once: `javascript sort an array` and `parse yaml`
are admitted, and `convert a string to a number in javascript` stops resolving to the contract it
names.

**The first of those two carried a false justification for the length of one draft, and that is worth
more than the constant.** It was written up as sitting *in a hole of the distribution rather than on a
gradient*. The distribution is 68 words declared by one contract, three by two - `describe`,
`failure`, `safe` - three by three - `from`, `string`, `to` - and two by all five. The empty class is
four. **The cut falls between two adjacent classes and the hole is nowhere near it.** The sentence was
caught by rereading the counts that had just been published beside it.

What makes that worth recording is not the error, it is which kind of justification it was. **A
justification by the shape of the counts would have survived any number of rereads without being
true** - it reads as evidence, it cites real numbers, and nothing about it invites checking. The
justification that replaces it names an event on either side: raise the ceiling and this query fails,
lower it and that one is admitted. That one is checkable by running it, which is the only difference
that matters. The counts are published anyway, because they are what a later reading is taken against;
they are not what justifies the value.

## Consequences

**What it does not repair is a word the catalogue declares nowhere.** `typo tolerance`, `spelling
suggestion`, `date maths`, `validate a numeric input` still answer nothing, and under ADR-0035's own
rule that is a missing alias rather than a missing rule. **That repair is closed by the freeze**:
`identity.searchAliases` sits inside `identity`, `contractSnapshot` freezes `identity` whole, and four
of the five contracts are published. A prescription no published contract can follow has stopped being
a prescription, and `CLAUDE.md` carries it as an entry rather than leaving ADR-0035 to read as though
the door were open.

**Five bare function words still answer, and killing them was refused on a measurement.** `a`, `to`,
`by`, `from` and `two` are declared by the catalogue itself, and the candidate that removed them
required the carrying hit to come from a name or an export. It works, and it costs a legitimate
answer: `string` stops returning `number/parse@1`, which
`a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias` asserts and which is a good
answer to that query. Nine results over eighteen function words, down from 37, is what is taken.

**Two mutants stopped surviving, and neither was aimed at.** `cli-search` pinned S-12 and S-13 as
unreachable on this catalogue. S-13 adds `summary` to the set of deliberate fields; it survived
because naming a summary in full means typing every word of a sentence, and the shortest of the five
is eighty-five characters. That set now decides a second thing - whether anything the contract chose
answered a word at all - so one word of one summary is enough, and the mutant is caught. S-12 stops
splitting camel case; it survived because one tokeniser reads the query and the field, so removing the
split removed it from both. The spread is counted over those same tokenised fields and nothing on the
query side is counted, so the effect is no longer symmetric. **The battery's surviving cells go from
four to two**, and the catalogue's published total from 35 to 33.

## Confirmation

`a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers` is the criterion
as data: pairs of a query this catalogue answers and a rewording of it, with the rewording required to
answer the same contract **and** required to bring in no word the catalogue has never heard.

**The second assertion refused three of the guard's own first nine pairs, and that is what makes the
remaining three worth anything.** `read a number from text`, `strict number parsing` and `number from
user input` all answer under the repaired rule, and all three bring in a word this catalogue declares
nowhere - `read`, `strict`, `parsing`, `user`. They would have passed as evidence for a criterion they
do not satisfy. **The criterion was applied against the person applying it, mechanically, and it threw
out a third of the sample.** A reader may take the three that survived as instances of the rule rather
than as three sentences somebody found agreeable; that is the whole value of the assertion, and it
costs a shorter guard.

`a-word-only-a-summary-carries-answers-nothing-on-its-own` reads its population off the index rather
than listing it: every word some contract's summary holds and no contract's name, export or alias
answers. It asserts that population non-empty, because a guard that swept nothing would pass exactly
as loudly as one that swept everything.

**Both were seen red on their real condition before being believed.** With the first bound taken away
the summary guard names 77 words that answer, `the` among them at five results. With the second put
back on the registry's phrasing, all three rewordings answer nothing, each named beside the wording it
rewords.

**The battery says both are load-bearing rather than this record saying it.** Replayed at `4ff0216`:
every cell agrees with the verdict pinned for it, 22 of 24 killed, and in the attribution
`a-word-only-a-summary-carries-answers-nothing-on-its-own` is the only red on S-13, S-22 and S-25,
while `a-rewording-...` is the only red on S-23. **S-23 makes two edits and not one**, because either
alone is compensated by the other: raise the ceiling and a three-word alias may still keep one word
back, which is exactly the word a rewording drops. That was measured rather than reasoned about - each
edit on its own is caught, and by the corpus rather than by the guard the pair is aimed at.

## What would reopen this

A catalogue where the count stops separating anything. Every figure here is of five contracts, and the
spread it rests on is a property of the catalogue rather than of the rule: at a thousand contracts,
almost every word is declared by more than two, and *tells the contracts apart* would name almost
nothing. The reopening event is the one ADR-0035 already names from the other side - a catalogue large
enough that two contracts answer one query - and it arrives here as a ceiling that has to become a
share rather than an integer.

A sixth contract declaring one of `describe`, `failure` or `safe` also reopens it, and cheaply: those
three sit one contract below the ceiling, so the next contract to declare any of them takes it out of
what tells the contracts apart, and the trial is worth taking again on the day it lands.

## More Information

- [ADR-0035](0035-what-a-search-may-answer-and-what-it-must-not.md) — the rule this repairs one clause
  of, and every part of it that is unchanged.
- [ADR-0023](0023-an-alias-is-a-query-whose-best-answer-is-this-contract.md) — the searchable surface
  this matches against, and why a missing alias is the repair for a word the catalogue does not hold.
- [ADR-0039](0039-what-the-first-contact-is.md) — why a miss
  names the words no contract carries rather than reporting that it found nothing.
