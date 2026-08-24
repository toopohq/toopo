---
status: accepted
date: 2026-08-23
decision-makers: Mathis Perron
governs:
  - packages/registry/licence.ts
  - packages/registry/serialise.ts
  - packages/registry/the-catalogue.ts
  - packages/registry/publication.ts
confirmed-by:
  - battery: registry-storage
    guard: every-file-the-installer-copies-is-marked-mit-0
  - battery: registry-storage
    guard: the-licence-file-shows-the-banner-a-reader-would-receive
  - battery: registry-storage
    guard: a-contract-not-yet-published-carries-the-current-banner
---

# The copyright comes out of the file that lands in somebody else's project

## Context and Problem Statement

The front page of this site promises, in as many words:

> Not a dependency: the source lands in your repository and it is yours.

The second line of the file that lands said `Copyright (c) 2026 Mathis Perron`.

**Legally there is nothing here.** What the installer copies is MIT-0 — the MIT licence with its
attribution clause removed — so nobody is obliged to keep the line, to reproduce it, or to credit
anybody. `licence.ts` argues that choice at length and it is not reopened.

**What is wrong is what a reader sees.** Nobody reads a licence. Everybody reads the first two lines
of the file they have just pasted into their own repository, and those two lines said the file
belongs to somebody else. The product's central promise was contradicted by the artefact that
carries it.

**And the price only rises.** Six contracts today, twenty later, and every published one freezes its
`reference.ts` for the life of its major. If this is to be done at all, today is the cheapest day it
will ever have.

## Decision Drivers

* **Permanent rule 6.** A published version is frozen for life. The five published contracts'
  `reference.ts` files are bound by digests that lockfiles in other people's projects already hold,
  so their bytes cannot move and the old banner cannot be removed from them.
* **`licence.ts` refuses a hand-written perimeter**, in as many words, and this change needs a
  per-contract declaration. A module that refuses a list and then holds one owes the distinction
  where the refusal is written, not in a record nobody opens beside the code.
* **A declaration that can be forgotten is not a mechanism.** A seventh contract that does not say
  which banner it carries must not compile.
* **A branch nothing reaches is a guard that cannot fail.** Two banner forms with an instance of one
  is a mechanism half of which is never exercised.

## Considered Options

* Take the copyright out of `licenceHeaderOf` for everybody — **refused, measured**. It reddens
  `every-file-the-installer-copies-is-marked-mit-0` on six reference files and
  `the-licence-file-quotes-a-header-a-contract-really-carries` on the example `LICENSE` shows, and
  five of those six files may not be edited.
* Keep one banner and drop the copyright at `name@2` — refused: permanent rule 6 makes that a
  decision about majors, taken for a header.
* Discriminate the two forms by something derived — **refused after six candidates**, below.
* **A required per-contract declaration** — chosen.

### Why no derived discriminator exists

Six were examined and each fails, and the reason they all fail is the same one:

* a list of addresses in `licence.ts` — refused by the module in as many words;
* a field on the contract — **impossible**, not merely unwanted: `contractSnapshot` freezes
  `identity` whole, so the published five can never gain one;
* `PUBLISHED_FROM`, publication as the discriminator — available and cheap, and a **proxy**:
  publication is not why the banner differs. ADR-0111 refused a proxy of exactly this shape;
* the ledger binding the file's digest — the same proxy with more machinery, and it makes a legal
  statement depend on a publication record;
* accepting either second line — weakens the byte-for-byte comparison, which `licence.ts` says is
  the whole point: *a header that merely looks like a licence marking is what a scanner reads and a
  court does not*;
* a field per entry in `the-catalogue.ts` derived from something else — there is nothing to derive
  it from.

**The discriminator is a date.** The published contracts carry the old banner because they were
written before this decision, and nothing in this repository's data derives a date in history. The
only faithful encoding of *written before* is a record of what was written before. So the
declaration is a declaration, and the question is whether `licence.ts`'s refusal forbids it.

### Why that refusal does not reach this declaration

**It is a safety property, and this declaration cannot violate it.** A wrong entry in a list of
*paths* ships a file under a licence the project did not choose, silently, into somebody else's
repository — which is the failure `licence.ts` describes and the reason it refuses one.

A wrong entry here ships an MIT-0 file under the other MIT-0 header. Both forms carry
`SPDX-License-Identifier: MIT-0`. Both are the same licence. **Being wrong mislicenses nothing**: it
prints a copyright line on a file that should not carry one, or leaves one off a file that does, and
`every-file-the-installer-copies-is-marked-mit-0` compares every copied file against the composition
byte for byte, so it is red before it is anything else.

The boundary the refusal protects is enforced by a guard that already exists. The declaration sits
inside it. That argument is written into `licence.ts` beside the refusal, rather than only here.

## Decision Outcome

**`licenceHeaderOf` takes a banner**, and `ContractSource` declares one.

`Banner` is `'a-copyright-beside-the-marking' | 'the-marking-alone'`. The vocabulary names what the
second line *is* rather than which era it belongs to, because an era is a fact about this
repository's calendar and the line is a fact about the file.

`ContractSource.banner` is **required**. A seventh contract that does not declare one does not
compile, which is what the option list above means by a mechanism rather than a list somebody
remembers to extend. `licence.ts` itself holds no list at all: the form is a parameter, so every
caller has had to find out which form it is asking about.

**`array/group-by@1` moves to the current banner today, and that is measured rather than assumed.**
`npm run ledger` prints five contract digests and five implementation digests — the published five.
The refused contract binds nothing, so its `reference.ts` is frozen by nothing and may be edited.
After the change, `npm run ledger` is **byte-identical** to before it.

That is not a special case made for one contract. The rule is
`a-contract-not-yet-published-carries-the-current-banner`, and its condition is about the bytes and
not about the calendar: a contract bound by no digest has no reason to keep a superseded header and
every reason not to ship one. What it buys is that the second branch of `licenceHeaderOf` has an
instance from the day it exists, so the marking guard is exercised on both forms rather than on one
and a branch nothing reaches.

### What `LICENSE` shows, which is a decision and not a detail

`LICENSE` quotes one banner as an example, and an example is what a reader takes for the rule. A
reader who installs a contract written this year and finds a copyright line in the example has been
taught the wrong rule about the file in front of them.

So `LICENSE` shows `array/group-by@1`'s header — the current form — and
`the-licence-file-shows-the-banner-a-reader-would-receive` holds it there. **The rule is derived
rather than a convention**: the example must be of `THE_CURRENT_BANNER`, so the day a form is
superseded the guard reddens by itself instead of waiting for somebody to remember `LICENSE` exists.

**It is satisfiable only because the refused contract could move.** Had the catalogue held six
published contracts and no refused one, no contract would carry the current form, the example would
have had to stay on the old one, and this guard could not have been written at all. That is recorded
because it is luck rather than design, and the next repository to try this will not have it.

### Consequences

* **`THE_COPYRIGHT` reaches fewer files and is not dead code.** Only contracts declaring
  `a-copyright-beside-the-marking` compose from it — the published five, whose bytes carry that exact
  string — so the marking guard holds it as tightly as it ever did. `THE_AUTHOR.name` is unaffected:
  `THE_AUTHOR_FIELD` composes the manifest's `author` from it, unconditionally.
* **`readme.test.ts` reads the catalogue's source rather than a served record**, because the banner
  is registry data and is deliberately not serialised: the form is already visible in the bytes a
  snapshot serves, and serialising it would be a second statement of what those bytes say.
* **Two banner forms are now permanent.** The published five keep theirs for the life of their
  majors, so this repository carries two shapes of one header for as long as those contracts exist.
  That is the cost of permanent rule 6 being real, and it is paid rather than avoided.
* **`README.md` still shows a copyright line, and it is right to.** It demonstrates
  `string/slugify@1`, whose header carries one and always will, and
  `the-header-the-readme-shows-is-the-one-the-installer-writes` holds the page to that contract's
  real header rather than to the current form. So the surface a stranger reads first goes on showing
  the shape this decision removed, for as long as the demonstration is of a published contract —
  which is the cost of permanent rule 6 arriving where it is most visible. It is not repaired by
  pointing the demonstration at `array/group-by@1`: that contract is refused and nobody can install
  it, and a front page demonstrating an uninstallable contract would trade one wrong lesson for a
  worse one. It corrects itself the day the demonstration moves to a contract published after this
  decision, and nothing forces that day.

### How this was verified

Each of the three guards was seen red on its own failure condition, one at a time, and the reds are
distinct rather than one claim restated:

* declaring the old form on `array/group-by@1` reddens **four** guards at once;
* pointing `LICENSE` at a real header of the *old* form reddens
  `the-licence-file-shows-the-banner-a-reader-would-receive` **alone**, 1 of 9, while
  `the-licence-file-quotes-a-header-a-contract-really-carries` stays green — which is what says they
  are two claims;
* declaring the current form on the published `string/slugify@1` reddens
  `every-file-the-installer-copies-is-marked-mit-0` **alone**, 1 of 9.

`npm run freeze` is green and `npm run ledger` is byte-identical across the change. The registry,
cli, validation, site and packaging suites are green.

## What would reopen this

* **A third banner form.** The vocabulary is a union of two and a third would have to argue why the
  second could not be edited into it — which, for any contract not yet published, it can.
* **The published five reaching `name@2`.** A major bump rewrites `reference.ts` from nothing, and a
  catalogue in which every contract carries the current banner is one where `Banner` has a dead
  member and the declaration can go.
* **A derived discriminator becoming possible.** It would need something in the data that separates
  the two eras without being a proxy for publication, and the six candidates above are the search
  that found none.

## More Information

The measurement that made the front page's promise concrete is not in this repository: it is the
line on the front page and the second line of `contracts/typescript/array/group-by/reference.ts` as
it stood at `7122f1b`. Both are quoted above, and the second one no longer reads that way.
