---
status: accepted
date: 2026-09-05
governs:
  - CLAUDE.md
confirmed-by: []
---

# A block names where somebody looked, and does not count what they found

> **The reopening trigger below cannot be read, and that is worse than the count beside it.** It says
> *a fifth extractor finding a number the fourth missed* — and **the fifth is the one in use**, the
> bold row of this record's own table. So the clause names the extractor that holds and the one that
> would replace it with the same word, and a reader cannot tell which the trigger is about. **A
> trigger that cannot be read freezes a decision exactly as a missing one does**, which is what
> ADR-0001 requires the section for. **It reads: *a sixth extractor finding a number the fifth
> missed. Five were written, four were each too narrow in a different way, and nothing says the fifth
> is not.***
>
> **The count is five extractors, of which four were too narrow**, and both figures carry: *five* is
> what was written, *four* is the defect landing on the unit's own tool. The heading *it took four
> extractors* stands over a table of **five rows** and undercounts by one; every other *four* in this
> record is a different quantity and is untouched.
>
> **And the correction was said and not posted**, which is the third time in this thread and is the
> class ADR-0226 names, arriving on a report rather than on a record: it was stated in conversation,
> the tree stayed at `045bdfe`, and no reader of this repository would ever have met it. Nothing here
> can keep what is said outside it; what keeps it is that a correction is posted in the same breath as
> it is spoken.
>
> **Two figures of the bare *one* are both right and describe different moments, which the record does
> not say.** The table reads *31 bare one* and the heading below reads *thirty-two of them*: 31 is the
> population before the thirteen removals and 32 after, and the extra one is this record's own repair —
> *the named policy for all seventeen* became *for every one of them*. Measured again after the commit:
> **32**.
>
> **One more figure of this record is withdrawn rather than corrected.** *Of the eight claims of
> resolvable form ADR-0228 priced, the boundary removes six* rests on ADR-0228's *8 of the 24*, and
> **neither was counted against a rule** — *resolvable form* was named by four examples and never
> defined, so the eight and the six are readings of a boundary nobody drew. Both go. What survives is
> the reading that needs no such rule and was verified: the guard **would have caught two of the six**
> false claims. The refusal is unaffected, resting on that two and on being born unwitnessed.
>
> **Everything else stands.** The boundary, the thirteen removed from ten blocks, the thirteen kept in
> eight and re-measured, and the twenty blocks that carried none.

## Context and Problem Statement

ADR-0228 found six false counted claims of nineteen read and priced a guard that would have caught two
of them. The owner refused the guard on that figure — **a green guard beside four false claims still
published is decorative by this repository's own thesis, and it would be born unwitnessed** — and asked
for the repair ADR-0227 applied to one figure to be applied to the population instead: *when a sentence
can be true without counting, it does not count.*

**The unit is the rule, not the thirty-seven blocks.** What must hold afterwards is that the next block
is written right, not that these are clean.

## Decision Drivers

* **The rule is this repository's first rule for a figure**, already written. What is new is the
  boundary — which counts survive it — and the boundary is a judgement that has to be stated before it
  is applied, entry by entry, rather than taken case by case.
* **Removing a count removes the obligation to verify it.** That is the whole gain, and it is why the
  rule and the guard are alternatives in practice rather than complements.
* **A count that carries the argument stays and is re-measured.** Carrying it over is what produced
  every instance ADR-0227 and ADR-0228 found.

## Considered Options

* **Correct all twenty-seven counts and keep them.** Refused: it re-creates the population that went
  wrong, one re-measurement later.
* **Remove every count from every block.** Refused: some blocks establish a total, and deleting it
  would take the finding with the decoration.
* **Apply the boundary and re-measure what survives.** Retained.

## Decision Outcome

### The rule, as it now stands in `CLAUDE.md`

> **A *Where this looked* block names where somebody looked, and it does not count what they found —
> unless the count is the finding.**

A number belongs there in three cases and no others: **a total enumerated on the spot**, so a reader
checks it without leaving the sentence; **the population the entry is about**, where *how many* is the
subject; and **a totality**, where *all of them* would be a different claim at *some*. Everywhere else
it decorates. **Where a count stays it is re-measured; where it goes, the question of verifying it goes
with it.**

### The population, and it took four extractors

Stated because three of them were published or nearly published, and because the failure is the unit's
own subject.

| extractor | blocks | numbers |
| --- | --- | --- |
| the phrase anywhere on a line | 38 | swallowed a bullet list |
| opening the paragraph, colon only | 34 | dropped the two blocks written with a comma |
| word list stopping at *fifteen* | 36 | missed *all seventeen* |
| number-and-noun | 36 | missed *for all seventeen;*, a count with nothing after it |
| **every number, complete word list, `:` or `,`** | **37** | **27** and 31 bare *one* |

**Each was too narrow in a different way, and each looked finished.** The 37th block is the one this
week's own entry added.

### The split: thirteen go, thirteen stay, twenty blocks never counted

**Ten blocks lose a count** — *the three guards ADR-0138 names*, *a file that gained two guards*, *whose
four strata class …*, *the three guards of `components.test.ts`*, *its four strata* and *five roots*,
*the ten refused … and the four in ADR-0158* and *the 34 addresses*, *whose four strata class the
fields*, *the eight fault functions* where nothing enumerates them, *the three guards ADR-0155 added*,
and *the named policy for all seventeen*.

**Each goes for the same reason and it is checkable by reading**: the sentence is exactly as true at a
different number. *The guards of `components.test.ts`, none of which reads a page module's source* does
not become less true at four; *the named policy for every one of them* is the claim, and the entry
already carries the seventeen with its date two paragraphs below.

**Eight blocks keep thirteen, and every one is re-measured:**

| block | count | why it stays | measured |
| --- | --- | --- | --- |
| refusal dates | *three call sites … and the two stand-ins, all three of which hand it the same constant* | a totality: at *some* it is a different claim | 1 in `local-read-api.ts` + 2 stand-ins = 3 |
| never alone | *three buckets are load-bearing, never alone and never red* | enumerated on the spot | 3 |
| never alone | *whose header names these two guards* | the entry's own subject | `attribution.ts:7` names 2 |
| the browser graph | *whose four guards read the first of those two* | the entry's population, which it says grows | `served-modules.test.ts` = 4 |
| the browser graph | *those two* | enumerated immediately before | 2 |
| a decision's answer | *the eight fault functions — `declarationFaults`, …* | enumerated on the spot | 8 |
| the alias review | *the two sentences beside it are `documentary`* | the contrast is the finding | `howItIsAsked`, `whyThisContract` |
| a browser's behaviour | *whose header carries the same six* | the entry's population | `start.test.ts:49-50` lists 6 |
| a battery's bound | *bounds one cell at 600 s* | a value identifying the constant, not a count of a population | `600_000` |
| a setup that can throw | *the seven test files … — [enumerated]* and *the population is those seven* | enumerated and dated | 7 |

**Thirteen of thirteen hold.** That is the strongest thing this reading returns, and it is not a
coincidence: **a count that carries an argument gets re-read because the argument is re-read.**

### The counter-example, which is why the rule is not a guarantee

**One of ADR-0228's six false claims was a count that carries.** *The population is the four
`timeout-minutes` declarations* is the entry's own population — the case the rule protects — and it was
wrong in both the number and the values. **It was not in a block**; it was in the body. So the rule
removes the decorative half and leaves the load-bearing half exactly as exposed as it was, and this
record says so rather than claiming a closure it does not have.

### The bare *one*, thirty-two of them

**An article is not a count and the rule does not reach it** — *one of which*, *not one of*, *one at a
time*. **A uniqueness claim is a totality and stays**, by the rule's own third case. Two of the three
strongest were re-measured: `packaging/against-the-origin/the-whole-chain.test.ts` is **the only test
file in the repository that calls `fetch`**, and `packages/validation/typescript-api.ts` is **the only
module that imports `typescript`**. The third — `readme.test.ts` as *the one guard resolving a
published figure against what produced it* — names a role, and the file carries fourteen guards; it is
left as written and named here so a reader is not surprised by the fourteen.

### Why this and the guard are alternatives, said before the repair rather than after

The owner put it as *alternatives, not complements*, and the conclusion holds with one correction to
the path. **The rule does not make the guard impossible; it takes away most of what the guard could
resolve.** Of the eight claims of resolvable form ADR-0228 priced, the boundary removes six. What
survives is what a guard cannot judge anyway — whether the six claims in a header are the six meant,
whether a bucket list is complete — because a count that carries an argument is a count whose unit only
a reader knows. **So the refusal stands on its own figure — two of six, and unwitnessed — and this
record adds that the population it would have watched is now smaller than the reach it was priced at.**

## Consequences

**Thirteen counts are removed from ten blocks and thirteen are kept in eight and re-measured**; twenty
blocks carried none. The population goes **27 → 14** numbers, of which one is *rule 3* and not a count.

**The rule is written where the next block is written**, in rule 3 of the entry-writing section, as a
rule and not as a repair.

**The guard is refused rather than deferred**, and the reason is recorded here so it is not re-proposed
as the population shrinks.

**What is not closed is named**: a count that carries the entry's argument is still unverified by
anything, and one of the six false claims was exactly that.

**Nothing is repaired in the product.** No contract is written, nothing under `contracts/`, `packages/`,
`mutation/` or `.github/` moved, no guard was added or changed, none of ADR-0218's three repairs was
taken, `THE_PACKAGE_VERSION` stays at `1.2.0`, `pnpm freeze` is green on 3 guards either side and the
ledger is byte-identical at `18cc4e82…`.

## What would reopen this

* **A block written after this that carries a decorative count**, which would say the rule cannot be
  kept by prose either — and that is the reading that would revive the guard, on a different argument
  from the one refused here.
* **A count that carries an argument and is wrong**, in a block rather than in a body. There is one
  such instance today and it is outside the blocks; a second inside them would say the boundary is
  drawn in the wrong place.
* **A fifth extractor finding a number the fourth missed.** Four were each too narrow in a different
  way, and nothing says the fifth is not.
* **An entry whose count is right and whose noun is wrong**, unchanged from ADR-0228: every check here
  compares a number with a count and none reads what is being counted.

## More Information

### Coordinates

Measured on **2026-09-05** against the tree at `f9607d6`, node v24.15.0, Windows. Blocks are paragraphs
of `CLAUDE.md` opening with `**Where this looked**` followed by `:` or `,`; numbers are every English
number word from *one* to *ninety-nine* plus *hundred* and *thousand*, and every digit run, after
`ADR-\d{4}` and digit-bearing inline code are masked. Guard counts are `^\s*it\(` over a test file;
`fetch` callers and `typescript` importers are `git grep` over the tracked tree.

Nothing outside `CLAUDE.md` and `docs/decisions/` was edited.

### Why `confirmed-by` is empty

For ADR-0228's reason, unchanged, and now deliberately: the mechanism that would keep this was priced,
refused, and is refused again above.
