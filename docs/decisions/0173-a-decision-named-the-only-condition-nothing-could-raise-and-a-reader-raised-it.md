---
status: accepted
date: 2026-08-28
decision-makers: Mathis Perron
governs:
  - mutation/root-documents.ts
confirmed-by:
  - battery: meta
    guard: every-command-the-readme-tells-a-reader-to-type-carries-the-invocation
  - battery: meta
    guard: the-readme-names-every-root-an-install-can-write-to
  - battery: meta
    guard: the-import-line-the-readme-shows-is-the-file-it-just-showed
  - battery: meta
    guard: the-readme-names-the-banner-form-it-does-not-show-and-a-contract-that-carries-it
  - battery: meta
    guard: every-figure-the-readme-gives-about-the-catalogue-is-one-the-contracts-declare
  - battery: meta
    guard: every-contract-the-catalogue-holds-is-named-on-the-readme
  - battery: registry-storage
    guard: the-readme-counts-the-catalogue-the-registry-declares
---

# A decision named the only condition nothing could raise, and a reader raised it

## Context and Problem Statement

[ADR-0114](0114-a-front-page-that-shows-the-registry-and-not-a-function.md) closed by listing what
would reopen it, and one of the four is unlike the others:

> **A real reader failing the thirty-second criterion.** It is the only condition here that nothing
> executable can raise, and it is the one this record was written to answer.

The owner read his own README as a stranger would and said this:

> Quand j'arrive sur un repo, il y a le readme qui explique globalement le projet pour comprendre à
> quoi il sert. Là on met l'accent sur une fonction, j'ai l'impression que ça montre que le projet
> fait juste cette fonction.

**A decision that predicted what would reopen it, reopened by exactly that, is the best outcome a
record here can produce**, and it is rarer than the repair. Nothing in this repository could have
raised it, no guard was wrong, and no figure had drifted.

### The count was right and the page still read as one function

ADR-0114's own repair was counted: it took `slugify` from **11 occurrences to 6**, and recorded that
*every one of the six is an address or a path… none is a call*. Measured at `1e85f9e`, all of that
still holds — six occurrences, none a call.

**What a count cannot see is an order.** Measured at `1e85f9e` in words rather than in lines — which
is ADR-0114's own refusal, *it measures an editor's setting and not a density*, and the reading that
opened this unit had been taken in lines before that refusal was read:

| | first occurrence, as a share of the page's words |
| --- | --- |
| the install command naming one contract | **3.8 %** |
| the word `catalogue` | **39.3 %** |

### Asserting a plural and showing one are two acts

The page's first sentence is already plural — *Utility functions you copy into your project, **each
one** verified against a public, executable contract… a registry rather than a collection*. So the
plural stands at 0 % and **everything concrete the page shows for the next 39 % is one contract**: an
install of `string/slugify`, its seven files, one of its rows, its installed file, its header, its
import line.

**A reader believes the evidence, not the thesis.** That is the whole defect, and it is why ADR-0114
could not see it: its test — *no competitor could print this block* — grades a block on what it shows
and never on **where it stands**. A page can pass that test block by block and still spend its opening
proving the wrong cardinality.

### The divergence nobody swept

ADR-0114, 18 August, exempts the command:

> An install command is exempt and the exemption is stated rather than smuggled — it is a coordinate
> and not a claim, and every README on earth has one.

[ADR-0140](0140-the-page-a-reader-arrives-at-is-a-door.md), 19 August, refuses precisely that on the
site's door:

> The resolution is that a command belongs to a *contract*, so it belongs on every contract's page and
> on none of the pages that are about the catalogue.

**Two doors, opposite answers, one day apart, and the README kept the older one for a year.** This is
the open list's rule 2 — *the change that builds such a mechanism sweeps this list for every entry
naming it* — arriving on a **decision** rather than on an entry. The rule is written for entries and
the population is wider: a decision that settles a question can leave a second surface holding the
answer it has just replaced, and nothing here sweeps for that.

## Considered Options

### Refused: the catalogue second, ahead of *What a contract is*

Refused on ADR-0114's own sentence, which this record does not contradict anywhere: *The answer lands
at the third block… nothing structural may be placed in front of it.* The table's **What it settles**
column reads like a library's index — *Turning text into a number without `Number`'s traps* — and what
answers *what does this do that `lodash` does not* is the seven files. Putting 294 words in front of
them breaks the criterion this unit exists to save.

### Refused: a compact roster line at the top, the table left where it was

`every-contract-the-catalogue-holds-is-named-on-the-readme` seeks each address **anywhere** on the
page, so two rosters would leave one guard covering both: the table could lose a row and the guard
would answer from the line above. That is the open entry ADR-0130 records, and creating a fresh
instance of a known open defect is not an option.

### Refused: no command at all, on ADR-0140's shape

`every-command-the-readme-tells-a-reader-to-type-carries-the-invocation` requires at least one fenced
line opening with `THE_INVOCATION` — the expectation written precisely to stop the first being
vacuous. The guard is right against the precedent: the site's door has the catalogue one click away,
and this page is the only one an npm reader receives.

### Refused: a wordless `npx toopo search` at the top, with its output

The strongest candidate, and it is refused on measurement. `npx toopo@1.1.0 search` against the live
origin answers **45 lines and 230 words**, where the whole catalogue section is 214.

- It names all seven addresses, which is the roster refusal above at eight times the size.
- It carries `The catalogue holds 7 contracts.`, and **both guards that resolve that count seek the
  bolded literal** `**7 contracts, 6 of them installable and 1 refused.**` — so a `7` inside a fence is
  invisible to them. **That is worse than ADR-0130's shape**: there a duplicate *satisfies* the guard,
  here it escapes it, and an eighth contract would leave the page carrying a stale `7` with all fifteen
  guards green. It is the exact failure `readme.test.ts`'s own header exists against — *what stops a
  transcription from becoming the false half of a true page*.
- Its line 43 is `Install one with  npx toopo add <domain>/<name>`, the template form ADR-0140 records
  the owner rejecting by name. It would return through a command's output, where nobody would look.

### Refused: the same command without its output

The client argues for this one and the argument is real. `arguments.ts` carries a `catalogue` command
distinct from `search`, and `report.ts` says why: *it used to be a refusal… which is the tool answering
"you must already know what you want" to somebody who has just arrived*. ADR-0140's rule **permits** it
— a wordless search belongs to the catalogue and not to a contract.

What refuses it is ADR-0114's exemption read closely. *Every README on earth has one* says the install
command is tolerated because it is unavoidable, never that it earns its place. **Spending the page's
first position on a second exempted block, ahead of every block that passes the test, gives the opening
to the one category that earns nothing** — a competitor prints `npx <tool> search`; none prints the
seven files of a contract.

**And it repairs the half that was not broken.** The plural is already asserted at 0 %; what was
missing at 4 % was plural *evidence*. A search command is a third assertion, and it would send a reader
to a terminal to learn what the page gives away eighteen points further down.

### Refused: the catalogue third, between the seven files and the quoted row

Reachable without contradicting ADR-0114 — the seven files stay first — and it puts the catalogue at
**13.0 %** instead of 22.5 %. It costs the adjacency ADR-0114 argues for in as many words: *The first
two read as one movement rather than as two blocks: the listing names seven files and the row opens one
of them.* Nine and a half points against a written argument, on a target already met, and a figure
moved for its own sake is what builds a treadmill.

## Decision Outcome

**Two moves and one sentence.** *What is in the catalogue* rises above *What lands in your project*;
the opening command descends into the section whose subject is what that command landed.

| | at `1e85f9e` | this record's commit |
| --- | --- | --- |
| What a contract is | 5.1 % | 4.0 % |
| What a settled input looks like | 14.4 % | 13.2 % |
| **What is in the catalogue** | **39.4 %** | **22.5 %** |
| What lands in your project | 23.7 % | 35.7 % |
| first `catalogue` | 39.3 % | **22.3 %** |
| first `slugify` | **3.8 %** | 28.4 % |

**The plural now precedes the singular**, by 6.1 points where it trailed by 35.5 in the wrong
direction. That inversion is the repair, and nothing else about the page changed.

The reordering is a **pure permutation**, proved rather than asserted: the multiset of whitespace-
separated tokens is identical across it, so no byte of prose was retyped. The page goes **1 643 → 1 657
words**, and every one of the fourteen is the bridge:

> Any row of that table installs the same way, and this one takes `string/slugify@1`:

It earns them. Without it the section opens on a bare fence, and the command reads as *the* install
again rather than as one row of the table a reader has just been shown — which is the whole object of
the move.

## Consequences

- **No guard's text moved, and that is the design working rather than luck.** Every one is written
  against content, and `theSectionOn` addresses a section by its heading precisely so that a guard does
  not depend on where a section sits. Two sections changed places and all fifteen resolve. That is why
  this record governs `mutation/root-documents.ts` rather than the page.
- The npm reader's install line moves from 3.8 % to 35.7 %. **Stated as a cost rather than smoothed**:
  somebody who came only for *how do I run this* now scrolls for it, and the first command they meet is
  the one that installs a contract they have already seen listed.
- 1 657 words against ADR-0114's measured floor of 1 203 and its reading of 1 398. The distance that
  record left as *about 200 words of argument* is unchanged by this unit, which added no argument.
- `# Toopo` is untouched, and deliberately: `packages/registry/frozen-for-life.test.ts` anchors a
  rewrite on that literal, and a `beforeAll` that throws reports its four guards `skipped` rather than
  failed — the defect this repository spent two units closing.

## Confirmation

Seven guards, each seen **red on the text that replaced the old**, with the reds in this unit's commit
message. Five had their subject moved by this change and two more read the table that moved:

| guard | the condition it was seen red on |
| --- | --- |
| `every-command-the-readme-tells-a-reader-to-type-carries-the-invocation` | the fenced command written bare |
| `the-readme-names-every-root-an-install-can-write-to` | the section naming one root of two |
| `the-import-line-the-readme-shows-is-the-file-it-just-showed` | the import naming a root the section did not show |
| `the-readme-names-the-banner-form-it-does-not-show-and-a-contract-that-carries-it` | the section naming no contract carrying the other form |
| `every-figure-the-readme-gives-about-the-catalogue-is-one-the-contracts-declare` | the case count drifting from what the contracts declare |
| `every-contract-the-catalogue-holds-is-named-on-the-readme` | a row leaving the table with the count beside it still right |
| `the-readme-counts-the-catalogue-the-registry-declares` | the count drifting, in its new section |

**A guard green on rewritten prose establishes nothing**, which is not a general caution here but a
measured event: ADR-0172's `the-import-line-the-readme-shows-is-the-file-it-just-showed` was written,
run against a half-finished repair, and **passed** — because the prose named two paths and *the file
above* had become ambiguous. It entered the repository unable to fail, and prose rather than the guard
is what repaired it. This unit rewrote that guard's subject, so it was put back on its real condition
before its green was believed.

**What no guard here establishes** is the thing this record is about. Nothing reads where a section
sits, nothing compares what a page asserts against what it shows, and no mechanism could have raised
the complaint that opened this unit. The criterion is inherited from ADR-0114 unchanged: it is a
reading, and only a reader can refute it.

## What would reopen this

- **A reader failing the thirty-second criterion again**, which this record inherits from ADR-0114 and
  does not weaken. It has now fired once, which is evidence that it works rather than that it is spent.
- **A reader reporting they could not find how to install anything.** The command's descent is the one
  clause of this decision taken against an npm reader's convenience, and it is the first thing to
  reconsider if that reader appears.
- **An eighth contract.** The table grows, the catalogue section's weight with it, and the shares above
  move without anybody deciding anything.
- **A second implementation of any contract, or a second language**, both of which ADR-0114 already
  lists and neither of which has happened.

## More Information

- [ADR-0114](0114-a-front-page-that-shows-the-registry-and-not-a-function.md) — the decision reopened
  here, its block-by-block test and its floor reading, all kept.
- [ADR-0140](0140-the-page-a-reader-arrives-at-is-a-door.md) — the other door, and the answer this page
  had not been swept with.
- [ADR-0130](0130-a-contract-page-publishes-what-its-own-suite-did-not-catch.md) — the duplicated-value
  shape that refuses two of the options above.
- [ADR-0172](0172-the-front-page-showed-one-install-as-though-it-were-the-install.md) — the guard that
  passed on a half-done repair, and why every red above was taken again.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) — why the readings here are in words
  and carry a commit.
