---
status: accepted
date: 2026-08-24
governs:
  - packages/registry/value.ts
  - packages/registry/search.ts
  - packages/site/literal.ts
  - packages/site/read-literal.ts
  - packages/site/playground.ts
confirmed-by:
  - battery: registry-storage
    guard: a-query-the-catalogue-cannot-answer-answers-nothing
  - battery: registry-storage
    guard: a-miss-names-the-words-no-contract-carries
  - battery: site
    guard: a-case-printed-as-a-word-is-a-case-the-form-declines-to-open
  - battery: site
    guard: every-case-the-registry-serves-is-read-back-from-the-literal-its-page-publishes
  - battery: site
    guard: a-hole-and-an-undefined-are-two-spellings
  - battery: site
    guard: the-playground-writes-a-call-the-way-the-case-table-writes-one
---

# A value with no spelling, and a word a catalogue has never heard

## Context and Problem Statement

The seventh contract arrived and two surfaces disagreed with it at once.

**The search answered a query the negative corpus says it cannot answer.** `a deep clone of an object`
returns `object/deep-equal@1`. The words `deep` and `object` are declared by one contract and by two,
both at or under `TELLS_THE_CONTRACTS_APART`, so they tell the contracts apart exactly as that
constant asks; `clone` is a word this catalogue has never heard, and ADR-0154's rule lets a query set
one such word aside. The rule worked as written on the one query where the word set aside *was the
whole request*.

**And seven of the contract's forty-nine cases hold values with no JavaScript spelling** - a function,
a promise, a weak collection, an instance of a class, a hole in an array. The page prints a word for
each, and a word cannot be typed into a form or read back.

## Decision Drivers

* A silence and a wrong answer are not the same cost, and which is worse depends on whether the
  catalogue can serve the request at all.
* A perimeter written by hand is right on the day it is written and silently wrong afterwards.
* A criterion that measures refusals is not a criterion for fidelity.

## Considered Options

* Tighten `TELLS_THE_CONTRACTS_APART` to one, closing the query.
* Take the query out of the negative corpus.
* Accept the answer and record it.

## Decision Outcome

**Chosen: accept the answer and record it, with the ceiling unchanged at two.**

### The answer labels itself, which is the fact the decision turns on

A query that answers still reports the words it could not place. Measured: `string to slug for a blog`
answers `string/slugify@1` naming `blog`, `parse a number safely` answers `number/parse@1` naming
`safely`, `turn a title into a url quickly` answers `string/slugify@1` naming `quickly`. So
`a deep clone of an object` answers `object/deep-equal@1` **while saying that `clone` is a word no
contract carries**. It is not a wrong answer offered as a right one.

### The arbitration taken for `parse yaml` does not transfer, and the reason is a reversal

ADR-0154 silenced a query this catalogue cannot serve. Tightening the ceiling here would silence
`turn a string into a number` and `string into number` - the plainest English there is for
`number/parse@1` - to close one query for a function this catalogue does not hold.
**That is breaking the product for people it serves in order to protect people it does not serve
either way.** The meaning of silence inverts with whether the catalogue can answer, so an arbitration
taken on one side of that line says nothing about the other.

Taking the query off the negative list was refused separately: the list says *the catalogue cannot
answer this*, and it still cannot - a deep-equality function is not a clone. Removing it would be
correcting the trial to fit the mechanism.

What is written instead is a declaration of one row, `a deep clone of an object` paired with `clone`,
kept honest in three directions: a query on the list that answers and is not declared reddens, a
declared query that stops answering reddens as a row nothing needs, and a declared query answering
without naming its word reddens because the answer stopped saying so. Each was seen red on its own
condition; the third needed a separate perturbation, because a query that answers nothing reaches the
second direction first.

### The ceiling's lower pin was dead and is rebuilt

`TELLS_THE_CONTRACTS_APART` justified itself with *at one, `parse yaml` is admitted, which the
negative half exists to refuse*. That is ADR-0136's reading over five contracts, restated by ADR-0144,
and restated again by ADR-0154 - which says in as many words that it *did not re-open it*.

Measured at `03ac68c`, over the catalogue as committed and over the same tree carrying the seventh
alike: at a ceiling of one, `parse yaml` answers nothing, and **so does every other query of the
negative half - zero of twenty-eight, both populations**. Re-taken with
`A_FIELD_MAY_KEEP_ONE_BACK_FROM` at one as well as at three. Which change retired that pin is not
established here and is not guessed at.

What really refuses a ceiling of one is two rewordings. Over the whole trial - 40 corpus queries, 28
of the negative half, 88 aliases and 3 rewordings, **159 items** - tightening loses
`turn a string into a number` and `string into number` and nothing else: **two items of 159, and the
same two of the 144 at six contracts.**

**The price of tightening did not move when the catalogue grew; what it buys did.** At six it bought
nothing - the negative half was already whole at two. At seven it closes one query of twenty-eight.
That is the half worth reading, because it says which side moves as the catalogue grows.

The distribution published beside the constant was stamped to five contracts and had not been re-taken
either: **85 words by one contract, 10 by two, 4 by three, 1 by four and 2 by all seven - 102 words**,
against 92 over the catalogue as committed. **The class the ceiling admits went from three words to
ten**, so it lets through three times what it did when it was pinned, and nothing said so.

### A hole spells as the language spells it

`[, 1]` is a list of two whose first element is absent and `[1, 2, ,]` is a list of three whose last
is. The printer said `<hole>`, on the argument that two commas in a row are a gap nobody sees - an
argument that weighed readability against nothing, because there was no reader then. There is one now,
and a word cannot be read back where the language's own notation can. Measured: all five spellings
round-trip, and `[1, 2, ,]` comes back with length 3 and no element at index 2.

### A symbol key is written the way a shared object is

The label mechanism already exists for objects and a shared symbol is the same need, which is why the
notation is `{ [#1 = Symbol('shared')]: 1 }` beside `{ [#1]: 2 }`. **Identity is what a symbol is**:
two objects keyed by one symbol and two objects keyed by two symbols of one description are different
values, and this contract settles a case on the difference.

### Five kinds are declined by the form, derived from the kind and never listed

`whatKeepsARowFromTheForm` reads the encoded row and answers two questions, both derived. A value
carrying a kind `WITHOUT_A_SPELLING` names cannot be opened - there is no expression that builds
*that* function, which is what `two-functions-are-not-compared` is about. And a value sharing a label
with the argument beside it cannot be opened either: a row is one value and numbers its labels once,
where a form is two independent boxes and `#1` typed into the second means nothing there.

**A list of case identifiers was refused**, on the same ground `packages/registry/licence.ts` refuses
a hand-written perimeter: it is right on the day it is written and silently wrong afterwards. The case
still renders in the table above, where a word is the honest rendering.

## Consequences

* Good: what the printer prints a word for and what the form declines are now the same set by a guard,
  rather than by a claim that no such case is served - which had stopped being true.
* Good: two defects of this repository's own making are closed, and both were found by a check rather
  than by a reading.
* Bad: seven cases of `object/deep-equal@1` cannot be tried in the playground, and no work closes that
  - a rewritten function is a different function.
* Bad: the record of a value grew a field. `symbolFields` is absent rather than empty where there is
  none, so no record published before it moves, but a consumer reading `fields` alone now loses data
  that exists - the same shape as the defect it repairs, one level out.

## Confirmation

Three guards for the search, seen red each on its own condition. For the notation, the catalogue's own
round trip: every case the registry serves, printed and read back and compared against what the
registry decodes, with an arm per kind so that the comparison does not commit the defect the contract
publishes.

## What would reopen this

**The search half reopens on a second query of the negative list answering.** One is a rule working as
written on the query where the word set aside was the whole request; two is a rule too generous, and
the declaration is what makes the second one visible - it has to be written down deliberately, beside
the first, by whoever meets it.

**The notation half reopens on a value that has a spelling this repository has not written.** Five of
the seven declined rows are declined because no expression builds the value: a rewritten function is a
different function. That does not go away. `instance` is the one that could: a class the record carried
would be buildable, and nothing here carries one.

**And the ceiling reopens on a reading rather than on an event.** Its lower pin is now two rewordings
measured at `03ac68c`; the population it was taken over grows with every publication, and the reading
is a command away. What must not happen again is the pin being restated by a record that did not
re-take it.

## More Information

### The criterion that let the defect through measured the wrong thing

The acceptance criterion for the unit that widened `packages/registry/value.ts` was *the forty-nine
cases encode: ninety-eight sides, zero refusals*. It was met and it was true. `Object.entries` of an
object keyed by a symbol is `[]` where `Reflect.ownKeys` reports the symbol, so the key was dropped
**without anything refusing** - both sides of `data-under-a-symbol-key-is-data` encoded as `{}`, the
page would have published `deepEqual({}, {})` answering `false`, and the replay answered `true` where
the row declares `false`.

**Encoding without refusing is not encoding faithfully.** The criterion counted refusals and was
called fidelity, and it was written by whoever was checking rather than by whoever was building -
which is the same shape as everything else this week, a control that can only see one direction. It is
recorded here because the criterion was the owner's.

### Two defects of this repository's own making, one commit apart

A boxed string carries its characters as own enumerable properties that are neither writable nor
configurable, so a rendering that reported them as fields printed
`Object.assign(new String('a'), { '0': 'a' })` - which **throws `TypeError` when it is run**, and
which this catalogue's own reader could not read. The first repair read configurability and was too
broad: a property written with a bare `Object.defineProperty` has the same descriptor, and
`literal.test.ts` declares its `__proto__` fixture exactly that way. The rule is derived from
`Object(held)` instead, a fresh box of the same primitive, which knows what a box carries and nothing
else.

And `asADeclaredValue` converted a live `Date` to its ISO string on the stated premise that `encode`
does not carry a `Date`. `03ac68c` gave it an instant, so that premise was false one commit later and
nothing noticed - the same class as the ceiling's dead pin, at a hundredth of the distance. The
conversion was not dead, it was **misplaced**: `date/add@1` declares its rows' answers as ISO strings
because that is what could be written when it was published, so the conversion belongs to the answer.
Applied to the arguments it printed `deepEqual('1970-01-01T00:00:00.000Z', ...)` against a row
spelling a date.

### A guard predicted its own reopening, and the question it would ask

`no-case-the-registry-serves-is-printed-as-a-word-with-no-spelling` carried this sentence from the day
it was written:

> It reddens the day a higher-order contract gains a page - which is exactly the day somebody has to
> decide what that contract's playground does with a case whose input is a function.

That is the mechanism at its best and it is worth saying, because the entries of this repository's
open list close by surprise far more often than they close on the event they named. The guard named
the day and the question, reddened on the day, and asked the question.

### What is not repaired

A comment in `packages/site/read-literal.test.ts` had lost three phrases to a shell that expanded
backticks inside a heredoc, and had been published saying *the kinds whose whole value lives where
cannot see it*. It is repaired, and what it was duplicating is on `beyondJson` itself. Nothing here
reads a source for a comment that lost its words; that is the class already on the open list under a
control character reaching a guard's text.
