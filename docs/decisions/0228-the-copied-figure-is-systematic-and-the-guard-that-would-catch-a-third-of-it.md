---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# The copied figure is systematic, and the guard that would catch a third of it

## Context and Problem Statement

ADR-0227 repaired one figure written in nine places and published the rest of its population unread:
*37 `Where this looked` blocks carrying 104 counted claims … the other ninety-four are unread here, and
that is stated so the count is not mistaken for a clean bill.*

The owner asked for them to be read, and named what it decides: **two instances leaves ADR-0226's entry
priced and not taken; one more of the same kind makes it a systematic fact, and that is the argument he
did not have for the guard he refused.** He also asked for one of ADR-0227's own figures to be
recounted, and flagged a date.

## Decision Drivers

* **A verdict on a population is worth nothing until the population is measured correctly.** ADR-0227
  counted its own twice and got it wrong both times, so this record measures the blocks before reading
  the claims and says how.
* **A claim is read as written, not as a pattern matches it.** Three of this record's first verdicts
  were wrong because a script measured something the sentence did not say; each was withdrawn on
  reading the block.
* **The guard is priced against what it would have caught, never against what it would cover.** A
  fraction of a population is an estimate; the six false claims already found are a test.

## Considered Options

* **Report the fraction of claims that resolve mechanically.** Refused as the headline: it measures the
  guard's reach and not its value.
* **Read every claim and publish a rate.** Attempted and abandoned — nineteen of twenty-four were read
  and the rest need a judgement per claim, which is stated rather than smoothed.
* **Read enough to decide the question the owner asked, price the guard on the instances, and say what
  is unread.** Retained.

## Decision Outcome

### The population, measured three times before it was right

| reading | blocks | claims |
| --- | --- | --- |
| ADR-0227's, published | 37 | 104 |
| matching the phrase anywhere on a line | 38 | 88 |
| **opening a paragraph, `:` or `,`** | **36** | **49**, or **24** without a bare *one* |

The phrase occurs **38** times; **two** are prose mentions and not blocks. The 104 came from matching
the digits of `ADR-0187` as a count and from swallowing a bullet list that carries no blank lines. A
second attempt demanded a colon and dropped the two blocks written with a comma. **The rule that holds
is that a block is a paragraph opening with the phrase followed by a colon or a comma.**

### The verdict: systematic, and not by a small margin

**Nineteen claims were read and six are false.**

| where | what it says | what the measure renders |
| --- | --- | --- |
| six blocks | *`mutation/decisions.ts` has nine fault functions* | **eight**, and eight since `ba78284` |
| `CLAUDE.md:2545` | *`pages.test.ts`, whose **35** guards* | **26**, and 26 since `521ebe7` |
| `CLAUDE.md:2710` | *the **eight** the component layer introduced* | its own entry says **twelve** three paragraphs below; **13** measured |
| `CLAUDE.md:2449` | *`attribution.ts` … **already records** that 69 identifiers collide* | that module records neither the figure nor the fact |
| `CLAUDE.md:4534` | *the job's **forty** minutes* | the two ubuntu gates are at **79** |
| `CLAUDE.md:4540` | *the **four** `timeout-minutes` declarations … two ubuntu gates at 40* | **five**, at 79, 79, 57, 20 and 5 |

**Two instances was the reading of a sample of one figure. Six of nineteen is a habit.** ADR-0226's
entry stays as the owner ruled — it is a different class, about a correction that fails to propagate —
and this is rule 3's class, which now has an entry of its own with the figure and the price.

### Both failures live in one form, and one commit made two of them

Three of the six were **never true**: the nine, the 35, and the 69 attribution. Three **drifted**: the
forty minutes, the four declarations, and `CLAUDE.md:4520`'s *nine guards* of `workflows.test.ts`,
repaired at ADR-0227.

**`aaf625f` falsified three claims across two neighbouring entries and swept neither.** It moved
`workflows.test.ts` from ten guards to twelve, took the two ubuntu gates from 40 to 79 and added a
fifth bound. That is rule 2 of the entry-writing section — *the change that builds such a mechanism
sweeps this list* — unapplied on the same day it was invoked elsewhere.

### Three verdicts this record withdrew before publishing them

Stated because they are the method's own failure rate, and because each was caught by reading the block
rather than by a better script.

* ***`local-read-api.ts`* three call sites** read as false — one call there. **It holds**: the sentence
  is *the three call sites in `local-read-api.ts` and the two stand-ins, all three of which*, so the
  three are one plus two, and its own *all three* says so.
* ***`readme.test.ts`, which is the one guard*** read as false — that file carries fourteen. **It
  holds** as written: *the one guard resolving a published figure against what produced it* names a
  role, and `every-figure-in-the-readme-is-the-one-the-instrument-declares` is it.
* ***`CONTRACT_STANDING_FIELDS` … five roots*** read as false at thirty-six. **It holds**: the
  extractor had swallowed the prose inside the constant. There are five.

### The recount the owner asked for, and the date

**His recount is right and ADR-0227's is wrong.** At `c62db7a` the wording splits **six** *nine fault
functions* and **three** *nine guards*, not seven and two. The total of nine holds.

**And `aaf625f` is dated 2026-09-05, which is today.** ADR-0227 calls it yesterday. The correction goes
further than the date: that commit is not what made `CLAUDE.md:4520` false — `workflows.test.ts` went
to ten at `4131c28` on **2026-08-27**, so *nine* had been wrong for nine days. The window is not hours.

### What the guard would cost, and what it would have caught

**The resolvable form is *N* + a noun + `of`/`in` + a file or a record**: *N guards of `<file>`*, *N
guards ADR-NNNN names*, *N fault functions of `<file>`*, *N call sites in `<file>`*, *N strata in
`<file>`*, *N test files*. Over the 24 claims that are not a bare article, **8 are of that form** — a
third.

**It is one file, no new dependency, and it resolves against what this repository already parses**:
guard titles by the reader `decisions.ts` uses, `confirmed-by` entries by the front-matter parse it
already performs, and a file's own declarations by a regular expression over its source. It belongs
beside the meta suite, which **no battery injects into**, so it would be born unwitnessed — the trade
this repository refuses without an argument, and the reason it is priced here rather than taken.

**What it would have caught is two of the six**, and that is the figure that matters more than the
third: *nine fault functions of `mutation/decisions.ts`* and *`pages.test.ts`, whose 35 guards*. The
other four name a quantity whose unit only a reader knows — a component layer's type sizes, a fact a
module is said to record, and a job's bound in a sentence about a different job's bound. **A guard over
the form would have halved this and closed nothing.**

### What is unread, stated rather than closed

**Five of the twenty-four remain unread**, and they are the ones needing a judgement per claim rather
than a lookup: *ten refused briefly in ADR-0163 and the four in ADR-0158* — the first reproduces in
that record's own words and the second has no such phrase to check against; *34 addresses this
catalogue has ruled on*; *three guards ADR-0155 added*, whose `confirmed-by` carries five, of which
three appear to be new and that was not established; and *two guards* twice, where the referent is the
previous clause.

**The twenty-five bare *one* claims are unread as a class.** Most are articles; some — *the one suite
that reaches a live host*, *the one door onto a parser* — are uniqueness claims that a sweep cannot
settle and a reader can.

## Consequences

**The copying is systematic**: six false claims of nineteen read, in a population of 49. ADR-0226's
entry is untouched and a new entry is opened for rule 3's class, carrying the figure, the two failure
modes and the price.

**Five claims are repaired in `CLAUDE.md`** by the branch ADR-0226 established — present tense, nothing
following that corrects them — and four figures of ADR-0227 take a head note, that record being stamped.

**The guard is priced and not built**, as the owner required: a third of the form, two of the six
instances, one file, born unwitnessed.

**Nothing is repaired in the product.** No contract is written, nothing under `contracts/`, `packages/`
or `mutation/` moved, no guard was added or changed, none of ADR-0218's three repairs was taken,
`THE_PACKAGE_VERSION` stays at `1.2.0`, `pnpm freeze` is green on 3 guards either side and the ledger is
byte-identical at `18cc4e82…`.

## What would reopen this

* **The five unread claims and the twenty-five bare *one* claims.** If any is false the rate rises and
  the entry's figure moves; if none is, the rate is six of forty-nine rather than six of nineteen, which
  is the same verdict with a smaller number.
* **The owner taking the guard.** The price is here; the decision is not this record's.
* **A block written after this reading that carries a copied figure**, which would say the convention
  cannot be kept by prose at all.
* **An entry whose figure is right and whose noun is wrong**, which neither this reading nor the guard
  would see: every check here compares a number with a count and none reads what is being counted.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `d6bb188`, node v24.15.0, Windows. Blocks are paragraphs
of `CLAUDE.md` opening with `**Where this looked**` followed by `:` or `,`; claims are number-and-noun
matches inside them after `ADR-\d{4}` and digit-bearing inline code are masked; guard counts are
`^\s*it\(` over a test file; record guard lists are the `guard:` lines of the front matter, with the
record resolved by its number rather than by a guessed filename. History is `git log --follow` reading
each blob at each commit.

Nothing outside `CLAUDE.md` and `docs/decisions/` was edited.

### Why `confirmed-by` is empty

For ADR-0227's reason, unchanged: the mechanism that would keep any of this is the one priced above and
refused.
