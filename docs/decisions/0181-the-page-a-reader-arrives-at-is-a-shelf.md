---
status: accepted
date: 2026-08-30
decision-makers: Mathis Perron
governs:
  - packages/site/front-page.ts
  - packages/site/style.ts
confirmed-by:
  - battery: site
    guard: the-page-a-reader-arrives-at-is-every-contract-they-can-install
---

# The page a reader arrives at is a shelf, and two recorded decisions are overruled with their scope

## Context and Problem Statement

[ADR-0140](0140-the-page-a-reader-arrives-at-is-a-door.md) made the front page a name and two doors, on
an argument about who arrives: *somebody searching for a function does not arrive here — they arrive on
a contract page, from outside*.

The owner has redesigned the site and this page is the second unit of four. His position is that a
developer comes to find functions they can use, and that a page describing a catalogue without showing
one asks them for a second step before they have seen anything.

## Decision Outcome

**The page lists every contract a reader can install, each with its signature, its summary and the
command that installs it. Nothing on it needs JavaScript.**

### Two recorded decisions are overruled, and each is written with the scope that survives

**ADR-0140's conclusion falls and its argument does not.** That record refused `add domain/function`
here — the shape of every command at once, so that no contract was privileged on the page that stands
for them all — because *the constraint was right and its form was a template, which is a thing a reader
sees*. **A shelf privileges no contract by showing all of them**, so the reason to print a template is
gone; the refusal of the template is not. It is kept in the form that suits the page: every `toopo add`
on it names an address this catalogue holds, and the guard asserts it.

The sentence that falls is the generalisation — *a command belongs on no page that is about the
catalogue*. What is recorded as an **overruling** rather than as a discovery is the page's shape:
nothing measured here made ADR-0140 wrong, and the owner decided. It is the treatment ADR-0176 gave the
theme button.

**`catalogue-page.ts` carries a measured rule this page breaks**: *one field is added per level and
never two — this page names; a domain page names and summarises; a contract page is the contract*, with
the figure behind it, that one entry cost 443 bytes of the emitted tree and that a summary under every
name *is the page at five contracts and is the whole page at a hundred*.

**That rule is not wrong and this page is not an index.** A shelf is read; a catalogue is navigated. At
six contracts five fields fit on one screen. The arithmetic does not go away, so it is written as a
reopening condition rather than left as an objection nobody recorded.

### Six and not seven

`array/group-by@1` is refused, so it is not on the shelf: the owner's rule is that a showcase holds what
can be used. **It is still an answer in a search** — somebody who types its name asked for that thing —
and `npx toopo search` gives them the refusal with its reason.
[ADR-0179](0179-a-refused-contract-leaves-the-surfaces-somebody-browses.md) carries that split, and why
the contract stays in the repository at all.

**The site now shows six where `README.md` names seven.** That is deliberate and it is two surfaces with
two audiences: the repository carries the evidence, the site sells what can be used. **No guard asserted
the two were equal** — swept before the page was written: the README compares itself to the catalogue,
the site compares itself to the index, and both point at the registry rather than at each other.

### The heading names what the data carries

The artboard heads the list `Popular functions`. **Nothing in this repository ranks anything**:
permanent rule 1 forbids the runtime call that would produce a figure, and no download count, no
telemetry and no usage signal exists anywhere — swept over `packages/`, `mutation/` and `packaging/`.

So the heading is `What you can install`: exhaustive over the installable half, stating no order.

**A reader still sees an order, and this record says which one rather than pretending there is none.**
The cards are walked through the domains, so it is the registry's order grouped by domain - the
arrangement `catalogue-page.ts` already uses, where `number/parse` and `number/round` sit together and
the index has four contracts between them. *Stating no order* is a claim about what the page promises,
not about what it does; nothing ranks the list, and that is the whole of what the heading says.

**The guard asserts the count against the index**, and that is the arm a heading could quietly break: a
page showing four of six would have every card right, every command runnable and nothing refused on it
— and would read exactly as intended under a heading that promised a selection.

### The domains are links, not controls

The artboard's chips filter the grid in the browser. A domain already has a page listing exactly what a
filtered grid would show, so the chip is a link to it. A reader with no JavaScript gets the same answer
as a reader with it, and `every-page-is-reachable-from-the-front-page` now reaches every domain page
from here rather than through the catalogue.

**`/catalogue/` stays reachable**, which is a constraint rather than a courtesy: no page is removed in
this unit, and a page nothing links to is one that guard refuses. The line that says what the shelf does
*not* hold is where the link lives, and it is composed from the index rather than written — so a second
refusal lands in that sentence with nobody editing it.

### The card's sentence is shared and its markup is not

[ADR-0180](0180-what-a-card-says-is-shared-and-what-it-looks-like-is-not.md) is the module. What matters
here is the consequence: **the signature comes from `Held`, so `contract-index` gained no field**, and a
card the search filters is the static card rather than one rebuilt from the wire — which is what makes
*a searched card cannot show less than a static one* true by construction.

The door's own rules are gone from the stylesheet with the door. `main.door`, `.doors` and `a.door-to`
were rendered by this page and by nothing else, measured before they were removed.

## Consequences

The site suite is **unchanged at 183** — one guard renamed and rewritten, none added. The `site` battery
gains one cell, so the instrument goes **827 to 828** and the README's totals with it.

`front-page.ts` takes the domains as a parameter; `site.ts` hands them over, which it already held.

**No served answer moves and no digest moves**: this is a page.

## Confirmation

Control: **183 passed**. Verdicts read from vitest's JSON reporter, tree restored between each.

| the defect | what reddened |
| --- | --- |
| the shelf shows four of six — every card right, every command runnable | `the-page-a-reader-arrives-at-is-every-contract-they-can-install`, **alone** |
| a template command comes back in the lede — W-91's defect, put back | the same, **alone** |
| a card drops its signature | the same, **alone** |

**The second row is the finding of this unit, and it is a shape rather than an incident.**

A guard was replaced because its subject changed. The replacement was about coverage — every installable
contract is here, nothing refused is, the count is exhaustive — and it was a better claim than the one
it replaced. **It would also have carried off its neighbour's claim in silence.** ADR-0140's guard had
two halves, and only the first was about the page's shape; the second refused a *template* command, and
the record argued that half at length. The new claim said nothing about templates, `W-91` — ADR-0140's
own cell, whose whole defect is a template put back — would have gone on passing, and the half that was
argued would have been enforced by nothing at all.

**Nothing would have been red.** The suite was green on the first draft: 183 passed. The cell was green.
The census was unmoved. A replacement that is strictly better about its own subject, and quietly weaker
about the one next to it, is invisible to every mechanism this repository has — because each mechanism
asks whether *this* guard holds and none asks what left with the one it replaced.

**It was caught by reading the cell rather than by running it**, which is the part worth keeping: the
question that found it is *what was the guard I am deleting also doing*, asked of a cell rather than of
a name. It is the session's own class — a guard going quiet in a way that looks like success — arriving
on the one act where the usual answer, *run it and see*, returns green by construction.

The assertion that keeps it was added before the suite was believed, and `W-91` reddens the new guard.

**One arm has no cheap mutant and it is named rather than left implied.** *Nothing the catalogue turned
down appears here* cannot be reddened by a one-line edit, because `Domain.held` holds only what is
installable — a refusal would have to be rendered from `turnedDown`, which is a different shape and a
larger change. The arm is a claim about a future edit rather than a claim a mutant reaches today.

## What would reopen this

**The day the shelf stops fitting on a screen.** That is the arithmetic `catalogue-page.ts` measured and
this page suspends rather than refutes: a summary under every name is the page at five contracts and the
whole page at a hundred. What this page becomes then is a question this record declines to guess at,
because guessing a threshold nothing can check is what that record already refuses.

**The search that filters it.** This unit leaves the shelf static; the query that hides cards by address
is the commit after it, and the property it must keep is written here — the card it shows is the card
already served.

**A second refusal.** The line about what the shelf does not hold is composed, so it takes a second one
without an edit. What it does not do is say *which*, and at some count a reader will want that.

## More Information

- [ADR-0140](0140-the-page-a-reader-arrives-at-is-a-door.md) — the door this replaces, and the template
  refusal that survives it.
- [ADR-0179](0179-a-refused-contract-leaves-the-surfaces-somebody-browses.md) — why six and not seven,
  and where the seventh is still an answer.
- [ADR-0180](0180-what-a-card-says-is-shared-and-what-it-looks-like-is-not.md) — the card's sentence,
  and why the front page needed no new field on `contract-index`.
- [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) — the chassis this page is
  the second unit of, and the treatment an overruling gets.
