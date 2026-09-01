---
status: accepted
date: 2026-08-18
governs:
  - .github/workflows/suites.yml
  - packaging/what-the-origin-lists.ts
  - packaging/print-what-a-deployment-would-drop.ts
  - packages/site/paths.ts
confirmed-by:
  - battery: packaging
    guard: every-address-a-sitemap-names-is-read-back-from-it
  - battery: packaging
    guard: a-document-that-is-not-a-sitemap-is-refused
  - battery: packaging
    guard: a-sitemap-naming-no-address-is-refused
  - battery: packaging
    guard: a-404-for-a-sitemap-is-refused-and-never-read-as-an-empty-site
  - battery: packaging
    guard: a-status-that-is-not-an-answer-refuses-the-reading
  - battery: packaging
    guard: an-origin-that-could-not-be-read-establishes-nothing
  - battery: packaging
    guard: the-address-asked-is-the-sitemap-under-the-origin
  - battery: packaging
    guard: only-an-address-the-origin-serves-and-this-tree-drops-is-reported
---

# An address this tree has served goes on being written, and what it says is free to change

## Context and Problem Statement

A redesign of this site proposes a different structure, and the first thing it does is stop writing
`/refused/` — a refusal becomes the state of a contract, at that contract's own address.

Measured before anything else, at `f95c4fa`:

```
curl -s -o /dev/null -w "%{http_code}" https://toopo.dev/refused/   →  200
sitemap.xml   →  <loc>https://toopo.dev/refused/</loc>
llms.txt      →  - [What Toopo refuses, and why](https://toopo.dev/refused/index.md)
```

The address is served, it is published twice to machines, and `not-found-page.ts` promises anybody who
follows it:

> It means nothing has ever been served at this address.

So the redesign, as drawn, makes a published sentence of this catalogue false — on the one page whose
entire content is that sentence. [ADR-0101](0101-what-a-404-of-this-catalogue-means.md) records two
stronger versions of it that were **measured** false before this one survived, and names its own
reopening event: *a fourth case where the site answers 404 on something a reader could reasonably
expect*. This would be that fourth case, arriving by our own hand.

`CLAUDE.md` has carried the entry for this since before anything was deployed — *that the emitted tree
never loses an address it once served* — with the clause *not urgent while nothing is published*. Seventy-six
addresses are served. The clause has expired.

## Considered Options

### Refused: accept the loss and weaken what the 404 says

The highest price and higher than it looks. The value of that page is not *nothing is here*; it is
**this was not taken down**, which is permanent rule 6 made legible to somebody who has just followed a
dead link. Weaken it and the page says what every 404 on the web says.

It is also unrecoverable. A counter-example is permanent, so the sentence could never be earned back —
and this repository would have done to a reader the exact thing its product promises never to do.

### Refused: answer at that address by something other than the generic 404

Two shapes, and both fall.

**A redirect** spends what two records bought. [ADR-0099](0099-the-address-does-not-move-for-a-host.md)
and [ADR-0100](0100-the-site-moves-to-the-mechanism-that-serves-the-address.md) moved this site between
hosts to stop serving its own address behind one, and ADR-0103 records *`@` is served directly, with no
redirect* as the result. It also has no correct destination: `/refused/` was about the *set*, and
pointing it at `array/group-by@1` is right at one refusal and wrong at two.

**A page saying the refusals live elsewhere, and here they are** is a list of refusals. It is the option
below, wearing an apology.

### Chosen: the address stays and changes its job

**The promise is about the address and never about the content, and three rebuilds demonstrate it.**
The front page was rewritten at [ADR-0114](0114-a-front-page-that-shows-the-registry-and-not-a-function.md),
the contract page at [ADR-0116](0116-a-card-and-then-everything-with-nothing-folded-away.md), the method
page more than once. Every time the address went on answering and the words changed, and nothing was
broken, because permanent rule 6 freezes a published *contract version* and has never frozen a page.

So *`/refused/` disappears as a page* was two claims in one. The refusals list leaving the navigation,
and the explanation of a refusal moving to the contract's own address, cost nothing and are what the
redesign is about. Only the address ceasing to be written breaks anything, and it is not required by the
other two.

`/refused/` therefore keeps its address and becomes the **index** of refusals — one line each, its
reason, linking to the contract's own page. The same relation a domain page has to a contract page,
applied to refusals.

## Decision Outcome

**An address this tree has served goes on being written. What it says is free to change.**

The mechanism is a reading, and where it is taken is the whole of the design.

### The listing is the sitemap, because a listing is the only thing that answers about existence

`what-npm-holds.ts` bought that rule on a deletion that reported failure and had removed half of what it
was asked to: **a request answers about content, only a listing answers about existence.** The origin
publishes exactly one listing, and it is derived from the page map rather than written beside it.

**So the population is the pages**, and that is a scope rather than an oversight. The named answers, the
nine modules and the five files found by convention sit at addresses no sitemap names. What a reader can
have followed from a search is what a sitemap carries.

### It runs before the deployment, and after it there is nothing to read

The obvious home was `packaging/against-the-origin/`, the one suite that reaches a live host. **It would
have been a guard that cannot fail.** That suite runs after `wrangler` has uploaded, so the origin
serves this commit and every address it lists is one this tree has just written — a comparison of a tree
against itself.

The reading is therefore taken between `build the site` and `deploy`, which is the one moment the two
sides are two different trees.

**The rule that generalises, and it is worth more than the placement it decided.** That folder was
chosen twice — proposed in a plan and approved on reading it — on the strength of resembling the
question: it is the suite about the live origin, and this is a reading of the live origin. Neither pass
asked *when does it run*. So: **the right home for a guard is not the suite it most resembles, it is the
only moment its two sides differ.** Resemblance picks a folder; the comparison picks an instant, and
where the two disagree the folder is what has to move.

It is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)'s question asked
about a schedule rather than about a value. That rule asks whether a guard perturbs the claim or
something derived from it; this asks whether the two things a guard compares are still two things by the
time it runs. Both fail the same way — the guard passes, and the passing means nothing.

**The coverage is inductive.** Each run compares one deployment against the one before it, and a chain
of those reaches back to the first. That is why it must run on every push of `main` and not only before
a publication, and it is why a push whose run never happened is a link missing from the chain that
nothing here can see.

**`main` only, because a branch is not a deployment.** A branch forked before `main` added a page does
not write that page while the origin lists it, so a branch would be red on an address nobody dropped —
the ordinary state this repository refuses to write a guard for, and the reason
`the-lockfile-an-archive-writes-records-the-digest-the-registry-served` reports `servedFrom` instead of
resolving it.

### The reader is split from the reading, which is what put it inside a battery

[ADR-0111](0111-the-number-asks-for-the-publication.md)'s shape, and this unit is what showed the second
thing it buys. A module that opened a socket would live in the folder no battery replays and that
`census.ts` therefore never counts. Splitting the parsing from the fetch put **eight guards inside the
census** rather than none, and left the socket in a script the workflow runs.

**A 404 is refused here and is an answer next door, and the direction is the whole reason.**
`theVersionsNpmHolds` reads a 404 as *no such package*; a wrong reading there ends in npm refusing the
publication, so it fails into a red. The same arm here fails into a green: an origin answering 404 for
its own sitemap lists nothing, nothing can be found missing from it, and the deployment that drops every
page at once is cleared by the reading written to refuse it. **A reading whose failure mode is a green
is not a reading.**

## Consequences

**`packages/site/paths.ts` gained `THE_BUILT_TREE`**, on the reason `THE_ORIGIN` moved one floor up: a
second consumer appeared. The comparison reads the folder that is about to be uploaded rather than a
rebuilding of it — `what-npm-holds.ts`'s own argument for reading the manifest from disk instead of from
the constant a guard ties to it.

**The debt list loses an entry and does not gain a claim of completeness.** What closes is the *pages*,
by a mechanism, at a price the entry did not consider: the entry priced a rebuild of the tree at every
past commit, and this is one fetch. What that mechanism does not reach is written into the entry it
replaces rather than left to be discovered — the addresses no sitemap names, and a push whose run never
happened.

## Confirmation

Eight guards over the reader, every one of them seen red on its real condition before this was
committed, and one of them repaired because it was not.

**`every-address-a-sitemap-names-is-read-back-from-it` was decorative when it was written, and a
measurement is what said so.** Its fixture was an address holding all five escaped characters side by
side — and the ampersand undone first still returns that address unchanged, because no `&lt;` the writer
produced sits inside an `&amp;` it produced. Seen **green** with the order reversed. What separates the
two orders is an address holding the four characters `&lt;`: it escapes to `&amp;lt;`, and undoing the
ampersand first turns it into `<`. With that in the fixture the guard is red, and the read-back address
is printed beside the written one.

That is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)'s test arriving
on a fixture rather than on a guard: what was being perturbed was the pair of functions and not the
condition that makes their order matter.

**How both were found is the part to keep, because neither was found by rereading.** Each surfaced while
the *next* guard was being written. Naming a neighbour forces the first one's claim to be said out loud
— *this one is about the order, so that one must be about something else* — and it is in that sentence
that the gap shows. A reread asks whether a guard looks right, which it does; writing the guard beside
it asks what it establishes that the neighbour does not, which is a question a decorative guard cannot
answer.

So the cheapest test for a guard that cannot fail, after ADR-0087's, is: **write its neighbour.** It
costs one guard and it is paid for twice here — the ordering fixture and the root element — against a
reread that had already passed over both.

**`a-document-that-is-not-a-sitemap-is-refused` needed a fifth fixture for the same reason.** An error
page, a feed, a JSON body and an empty string carry no `<loc>` at all, so all four stay refused by the
count with the root element unread. A **sitemap index** is what makes `<urlset` load-bearing: it is a
document of the same protocol, every `<loc>` in it addresses another sitemap rather than a page, and read
as a page list it reports that every real address has been dropped. Measured — the check removed, the
four stay red and the sitemap index goes green.

**The whole chain was run against the live origin**, before and after removing `/refused/` from the
built sitemap by hand:

```
https://toopo.dev lists 10 addresses
this tree writes 10
and every address the origin serves is still one of them, so this may be deployed      exit 0

https://toopo.dev lists 10 addresses
this tree writes 9
and 1 of the origin's would stop being written:
  https://toopo.dev/refused/                                                           exit 1
```

## What would reopen this

An address served at a place no listing names, which somebody has linked. The sitemap is what a reader
arrives from; the day something else is, this covers less than it looks like it covers.

## More Information

- [ADR-0101](0101-what-a-404-of-this-catalogue-means.md) — the sentence this protects, and the two
  stronger ones that were measured false.
- [ADR-0111](0111-the-number-asks-for-the-publication.md) — the reader-and-reading split, and the
  listing rule this is the second consumer of.
