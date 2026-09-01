---
status: accepted
date: 2026-08-28
governs:
  - packages/site/served-headers.ts
  - packages/site/paths.ts
confirmed-by:
  - battery: site
    guard: every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose
  - battery: site
    guard: every-address-is-told-each-thing-once
  - battery: site
    guard: every-endpoint-carries-a-rule-at-an-address-that-names-it
  - battery: site
    guard: every-other-answer-is-revalidated-before-it-is-used
---

# Every address this tree serves carries a policy this repository chose

## Context and Problem Statement

[ADR-0103](0103-the-declared-origin-serves-this-catalogue.md) swept the deployed origin and left an
entry open: **ten of the seventy-six addresses the tree wrote answered a cache policy written in no
file here.** `theHeaderRules` derived one rule per endpoint from `ENDPOINTS`, a module is not an
endpoint, and so the modules and `robots.txt` fell through to whatever the host does that morning.

The entry named the failure precisely and it was not the four hours: *today those ten land on a
default; the day the default moves, nothing here says so.*

**Re-measured at `7e3f64a`, both of its figures had moved and one of them was the wrong reading of its
own heading.**

| | `27d1dbb` | `7e3f64a` |
| --- | --- | --- |
| addresses the tree writes | 76 | **128** |
| covered by a rule | 48 | 73 |
| **carrying no rule at all** | **28** | **55** |
| answering a policy written in no file here | 10 | **17** |

The seventeen are sixteen browser modules and `robots.txt`. The fifty-five are those, plus seventeen
pages, seventeen Markdown twins and the five files found by convention.

**The two rows are two different questions and the entry answered the second while its heading asked
the first.** *Every address carries a cache policy this repository chose* is the fifty-five; *answers
something undeclared* is the seventeen, the other thirty-eight landing on a host default that happens
to coincide with the named policy. The entry's prescribed repair - the module map and three convention
constants - was written for the seventeen, so it would have left thirty-four pages and twins exactly
where they were. **The heading was right against the prescription**, and that is corrected in the open
list in the same change as this record.

## Considered Options

- **The prescription as written**: the browser modules and the files found by convention.
- **One rule per address the emission writes.**
- **A catch-all `/*` carrying the named policy**, with the two content-addressed prefixes as
  exceptions.
- **One rule per space**, a space being an address's first segment.

## Decision Outcome

Chosen: **one rule per space, declared rather than walked**, in a second family carrying
`Cache-Control` where the endpoint family carries `Content-Type`.

### Why not the prescription

A partial family cannot carry a total guard, and the totality is the whole value: what the repair buys
is that the host's default stops deciding anything. Sixteen modules covered and thirty-four pages left
on a default would give a guard that counts rules without being able to say they cover the tree -
which is the drift this entry is about, one floor down.

### Why not one rule per address

Cloudflare parses at most a hundred rules. Fifty-five plus the ten that exist is sixty-five today and
grows by three with every contract published, so the guard that keeps this file inside the host's
limits would redden at about eleven more contracts. A list that scales with the catalogue is also the
list somebody types, which the entry refused in as many words.

### Why not a catch-all, and this is the finding of the unit

**Two rules matching one address do not settle a header between them; they add up.** Cloudflare's
documentation for this file says *"An incoming request which matches multiple rules' URL patterns will
inherit all rules' headers"* and *"If a header is applied twice in the `_headers` file, the values are
joined with a comma separator"*, and it specifies no order within the file.

So a catch-all carrying the named policy collides with `/snapshot/*` on the one policy this file exists
to buy, and the `! ` prefix that detaches *"a header which has been added by a more pervasive rule"*
cannot answer it either, because *more pervasive* is not *earlier* and nothing here can measure which
Cloudflare means.

**The corollary is what makes this worth a record rather than a comment: agreeing on the value is not
enough.** Two rules that both say `public, max-age=0, must-revalidate` send it twice, joined - a
`Cache-Control` carrying `max-age` two times. Every rule reads correctly on its own and the defect is
in no line of the file.

### Why a space, and why it is disjoint by construction

A space is an address's first segment, which is a **total function of a path**: an address is in
exactly one, so two rules of that family cannot both match it. That is disjointness by construction
rather than by vigilance, and it is what lets the file mean something without anybody knowing
Cloudflare's precedence.

The two families are then disjoint by carrying different header names. An endpoint says what its
answers *are*; a space says how long they may be held.

### Why the rules are declared and never walked

`_headers` is written into the tree it describes, so a derivation reading the finished tree would be
circular - which the entry named as the one thing the repair had to answer. **It would also be worse
than circular.** A coverage guard over rules derived from that tree could not fail, being the
derivation compared with itself, which is [ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md)'s
rule arriving on a whole file rather than on an object.

So every space is read off a declaration - the pages the site has of its own, the files found by
convention, `THE_BROWSER_GRAPH`, `Language`, and `ENDPOINTS` - and the guard is a comparison between
two independent statements: what `served-headers.ts` declares and what `site.ts` writes.

## What the origin answered, and what it says about the layer

Read with `curl` at `7e3f64a`, over one address of every class the tree writes plus every module and
every file found by convention - thirty-five addresses:

| class | count | `Cache-Control` | `cf-cache-status` |
| --- | --- | --- | --- |
| pages, Markdown twins | 4 | `public, max-age=0, must-revalidate` | `DYNAMIC` |
| named answers | 5 | `public, max-age=0, must-revalidate` | `DYNAMIC` |
| content-addressed | 2 | `public, max-age=31536000, immutable` | `DYNAMIC` |
| modules | 16 | **`public, max-age=14400, must-revalidate`** | **`REVALIDATED`** |
| `robots.txt` | 1 | **`public, max-age=14400, must-revalidate`** | **`REVALIDATED`** |
| `sitemap.xml`, `llms.txt` | 2 | `public, max-age=0, must-revalidate` | `DYNAMIC` |
| `_headers`, an address never served | 2 | `no-store` | `DYNAMIC` |

**`cf-cache-status: REVALIDATED` partitions those thirty-five exactly**: it is on the seventeen at four
hours and on nothing else.

**And the same tree at the other host shape answers differently.** Read twice, four seconds apart:

| | `toopo.dev` | `toopo.pages.dev` |
| --- | --- | --- |
| `/packages/site/start.js` | `max-age=14400` · `REVALIDATED` | `max-age=0` · no `cf-cache-status` |
| `/robots.txt` | `max-age=14400` · `REVALIDATED` | `max-age=0` |
| `/llms.txt` | `max-age=0` · `DYNAMIC` | `max-age=0` |

**So the four hours are the zone in front of `toopo.dev` and not the service that serves the tree.**
Pages already sends `public, max-age=0, must-revalidate` for `start.js`; something between that and a
reader replaces the age.

**No cause is named for the split itself.** `robots.txt` is in that layer and `llms.txt` is not, both
`text/plain`, both at the root, and nothing measured here says why. ADR-0103 declined to invent one and
so does this.

**What is established is where the decision is taken, and this repository already recorded that
frontier before it could measure it.** `wrangler.jsonc` says of the custom domain: *"it is attached in
the dashboard, not here... That is a gap in this file's own claim to hold every decision."* The four
hours are on the far side of that gap. The reading does not discover the frontier; it is the first
time anything has measured across it.

## How a splat matches, which two rules now rest on

`served-headers.ts` had said since it was written that whether Cloudflare's splat spans a slash was a
question nothing here could answer. Both halves are now measured against the deployment.

**A splat spans a slash.** `/typescript/number/parse@1/contract-binding` arrives
`Content-Type: application/json`, which only the contract-binding rule can produce - three segments
stand where its splat is - while the front page arrives `text/html` from the host's own guess, no rule
covering it. The documentation agrees and separates the spellings: a splat *"will greedily match all
characters"*, where a placeholder *"match[es] all characters apart from the delimiter"*.

**A splat takes an empty remainder.** `/blob/` and `/snapshot/` answer 404 carrying
`application/octet-stream` and `application/json`; the control is `/typescript/` and `/packages/site/`,
which answer 404 carrying the 404 page's own `text/html`. So one rule covers a space and the page at
its root, and **an exact rule written beside it would be the doubling above rather than a belt and
braces.**

That is what let `every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint` stop stating a
necessary condition and start stating the matching, with one spelling of it - `covers` - shared by the
three guards that ask.

The same reading says a rule reaches a 404's `Content-Type` and not its `Cache-Control`: an address
nothing is served at answers `no-store` whatever this file declares, which is what
[ADR-0101](0101-what-a-404-of-this-catalogue-means.md) wants.

## What the file became

Twenty-three rules where there were ten - twenty-one about a path, two about a host - against the
host's limit of a hundred. It grows with a language or a top-level page and **never with a contract**.

Measured at the tip over the 128 addresses the emission writes: **0 carry no `Cache-Control`, 0 are
told one header twice**, 71 are named and 57 are addressed by content.

**No new duration enters this repository.** The only two are `A_YEAR` and `0`, both already declared in
`response.ts` and both derived from `AddressingClass` - which matters because a generous `max-age` on a
mutable address is the one mistake here that no deployment can take back.

## Consequences

**The declaration half closes and the four-hour half does not, and that is written plainly rather than
softened.** Pages already sends the modules `public, max-age=0, must-revalidate`; declaring the same
value gives it a header it already has, and the zone in front of `toopo.dev` is what replaces the age.
So the seventeen will most likely go on answering four hours, and the reading taken after this is
deployed is what says whether they did. Either answer is worth publishing: an unexpected move is a
finding, and no move is the confirmation.

What that leaves is a reader who returns inside four hours being served the repaired HTML and the old
script - and a reviewer looking at the site just after a deployment seeing a mixture of two commits.
The entry stays open on exactly that, with what would close it: the zone setting, which is the owner's
and not this repository's, or modules addressed by their content, which would make a year correct and
staleness impossible and is a unit of its own.

**`every-endpoint-carries-a-cache-rule-at-an-address-that-names-it` is renamed** to
`every-endpoint-carries-a-rule-at-an-address-that-names-it`. It has the claim, the population and the
mutant it always had; what it no longer has is a cache rule to be about. ADR-0097 carries the note and
its table carries the new name.

**`THE_FILES_FOUND_BY_CONVENTION` and `THE_PAGES_THE_SITE_HAS_OF_ITS_OWN` moved into `paths.ts`.** The
first existed in `build.ts` and needed a second reader; the second is new. Nothing holds the second to
`theSite`'s own list and nothing needs to - the two are statements about different things, and the
coverage guard reddens the day they disagree.

## Confirmation

`every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` and
`every-address-is-told-each-thing-once`, seen red on their real conditions before either was trusted
green.

Dropping `THE_BROWSER_GRAPH` from the derivation reddens the first alone, naming the ten modules the
guard's own tree carries. Adding a catch-all `/*` at the named policy - a rule that **agrees with every
rule it collides with** - reddens the second alone, on all 128 addresses.

**The second red is the one worth reading twice: `served-headers.test.ts` stayed green through it.**
Every guard that reads the rules saw a file whose policies were right, because they are; what saw the
defect was the guard that asks what an *address* is told. That is the shape W-135 pins - the endpoint
rules given their cache header back, which is this file as it stood one commit before this record and
would be approved by anybody reading it.

Read off `npm run battery -- site --only=W-78,W-79,W-134,W-135` at `6a73bc4`, four cells and four
`killed as expected`; the complete red set of each was then read off the suite by hand, because a
filtered run computes no attribution and `agreesWith` checks only that every pinned guard is among the
failed ones:

| mutant | red on, and on nothing else |
| --- | --- |
| W-78 | `every-endpoint-carries-a-rule-at-an-address-that-names-it`, `every-endpoint-tells-the-host-what-its-answers-are`, `every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint` |
| W-79 | `only-what-is-addressed-by-its-content-is-cached-for-a-year`, `every-other-answer-is-revalidated-before-it-is-used` |
| W-134 | `every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` |
| W-135 | `every-address-is-told-each-thing-once` |

**W-78 lost a guard and gained one, and both halves are the shape of this change.** It used to redden
`only-what-is-addressed-by-its-content-is-cached-for-a-year`, because misspelling an endpoint's
pattern took its cache rule with it; the cache rule is a space's now, so `/blob/*` keeps its year while
`/blobs/*` carries the type. What it reddens instead is
`every-endpoint-tells-the-host-what-its-answers-are`, which had never been pinned to it at all.
**Neither of the two new guards moves on W-78 or W-79**, which is what says they are about something
the four older ones were not.

## What the deployment answered, which is the prediction above tested

Read with `curl` on both host shapes at `ec3dda9`, the origin's own `contract-index` confirming it
serves that revision, over the same thirty-five addresses as before.

**The prediction held and is therefore worth as little as predictions are: the seventeen did not
move.** Sixteen modules and `robots.txt` answer `public, max-age=14400, must-revalidate` with
`cf-cache-status: REVALIDATED` at `toopo.dev` and `public, max-age=0, must-revalidate` at
`toopo.pages.dev` - the value this repository now declares, arriving intact at one host and replaced at
the other. What that adds to the reading taken before the change is only that declaring the policy did
not disturb it, which is the half a reader would otherwise have to take on trust.

**One address moved and nothing here predicted it.** `/404.html` answered `308` with **no
`Cache-Control` at all** before this change and answers `308` with `public, max-age=0, must-revalidate`
after it, on **both** hosts. So a rule reaches a redirect, which is this file's own note about the `@`
trap read in the one direction it had never been read - the rule applies to the redirect rather than to
its destination, and here that is what was wanted. **It is the only one of the fifty-five where the
declaration changed what a reader receives**, and it was found by taking the reading rather than by
reasoning about it.

The rest of the fifty-five were already being answered the declared value by a host default: the
thirty-four pages and Markdown twins, `sitemap.xml` and `llms.txt`. `_headers` and an address nothing
is served at answer `no-store` whatever is declared, as the measurement before the change said they
would. **What changed for them is not the header but who decides it**, which is the whole entry: today
they land on a default that agrees, and the day it stops agreeing something here says so.

## What would reopen this

- **A reading of the origin in which the seventeen stop answering four hours**, which would mean the
  zone setting moved or that this record's account of where it is decided is wrong.
- **A cause for the split** between `robots.txt` and `llms.txt`, which nothing here has.
- **A host that reads this file differently**, at which point the disjointness argument is about
  somebody else's matcher and has to be measured again.
- **A second addressing class**, which would put a third policy in a file whose guard says there are
  two.
