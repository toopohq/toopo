---
status: accepted
date: 2026-09-01
governs:
  - packages/site/not-found-page.ts
  - packaging/what-the-origin-lists.ts
  - packaging/print-what-a-deployment-would-drop.ts
confirmed-by:
  - battery: packaging
    guard: a-deployment-may-retire-a-page-and-never-an-address-a-contract-was-published-at
---

# A promise is the one its own argument makes, and the gate narrows with it

## Context and Problem Statement

The 404 of this site carried two consecutive sentences. The first gave a reason:

> This registry withdraws nothing. A contract major is frozen for the life of the catalogue: what has
> been served once is served for ever, and an incompatible change becomes a new address beside the old
> one rather than a replacement of it.

The second drew a conclusion from it:

> So this page never means that something was taken down. It means nothing has ever been served at
> this address.

**The reason is about a contract major. The conclusion is about every address this site has ever
served** — which includes the pages the site invented for itself, and nothing freezes those. The
sentence had generalised past the thing it cited for itself, and it had done so quietly: both halves
read as one argument, and only setting the two side by side shows that the second covers a set the
first says nothing about.

`packaging/print-what-a-deployment-would-drop.ts` is that sentence made executable. It compares the
addresses the origin's `sitemap.xml` lists against the sitemap the tree is about to upload, and exits
1 on any address that would stop being written. Measured at `cc231bf` by reading the `<loc>` elements
of `packages/site/out/sitemap.xml`, the sitemap names **17 addresses — every page there is**, the
site's own five among them.

The next unit retires ten of those pages. The gate would refuse the deployment, correctly by its own
terms, and its message named the two doors: *serve them, or take the promise off the 404 first*.

## Considered Options

- **Serve the ten anyway**, as stubs or redirects. Keeps every word of both the promise and the gate,
  and defeats the unit: the pages come back in another form, and their layouts have to be maintained.
- **Lift ADR-0125 for the site's pages**, leaving the promise repaired and the gate gone.
- **Narrow both**: the promise to what its own argument covers, and the gate to the same set.

## Decision Outcome

**The third.** The promise is cut back to the contracts its reason is about, and the gate is cut back
to the same set in the same commit.

**A page this site invented may be retired. The address of a contract may not be dropped, ever, by
anybody.** That second half is permanent rule 6 arriving at the one place a deployment could break
it, and it is now the whole of what the gate refuses.

### It is a correction and not a concession

Nothing here is being traded away. The sentence claimed more than it could support, and what it could
support is exactly what survives. `ADR-0101` measured two stronger versions of this same sentence
false — one about what the registry *holds*, one about what the catalogue *publishes as questions* —
and struck both. **This is the third measurement to shrink it**, which makes it the established
pattern of this page rather than an exemption granted once because a unit wanted one.

### Lifting the gate was refused, and the reason is the shape rather than the risk

A promise narrowed with its guard removed is a declaration nothing keeps — the class this repository
spends its time closing, and the one `CLAUDE.md` keeps a list of. The remaining promise is the larger
half and the one the product is sold on: every lockfile in the world holds a digest, and the address
beside it has to answer for the life of the major. Removing the only mechanism that reads it, in the
commit that narrows it, would have left the strongest claim here guarded by prose.

So `whatNoDeploymentMayStopServing` is added beside `whatWouldStopBeingServed` rather than replacing
it. The set difference still says what would stop being served, both halves are printed, and only one
of them stops the deployment.

### The classification is read from the address and never from the catalogue

Telling a contract's address from a page of the site is a question about the **grammar** of an
address. It deliberately does not ask what the catalogue holds today, and the inversion that would
cause is the entire point: **a contract withdrawn from the catalogue is exactly the case this
refuses**, so a reading keyed to `theCatalogue` would stop recognising an address at the instant it
began to matter — green on the one deployment it exists to refuse.

`readContract` is therefore the inverse of `renderContract`, and it lives in
`packages/registry/address.ts` beside the rendering whose grammar it reads. A second opinion in
`packaging/` would be a parser written twice, which is the one thing a parser may never be — and it
reuses `contractAddressFaults` rather than restating what a well-formed address is.

The major is read digit by digit. `Number('1e2')` is `100`, `Number(' 1')` is `1` and `Number('0x1')`
is `1`, so a lenient reading would let three strings resolve to one address — which is what
`a-rendered-address-is-the-spelling-frozen-with-the-major` freezes one of.

### An address that cannot be read is refused rather than allowed

A `<loc>` that is not a URL cannot be classified, and the two ways to treat it are not symmetric:
allowing it makes a malformed listing a way past this gate, and refusing it makes a malformed listing
a red somebody reads. It is the direction `what-the-origin-lists.ts` already chose for a 404 — **a
reading whose failure mode is a green is not a reading** — applied to one entry instead of the whole
document.

## The amendment of 2026-09-01, and the reading that forced it

**Run against the live origin for the first time, this refused one address of the ten ADR-0189 was
retiring**: `https://toopo.dev/typescript/array/group-by@1/`, the page a contract the catalogue
*turned down* had. ADR-0127 put a refusal at `pageOf(refusal.address)`, so that page stands at an
address with a contract's own grammar — and `readContract` read it as one, correctly.

**Nothing was ever frozen there.** `array/group-by@1` has no digest, no binding, no row in
`THE_PUBLICATIONS`, and no lockfile in the world holds it. Permanent rule 6 says nothing about it, so
the gate was refusing to retire a page on the strength of a promise that did not cover it.

**This is a revision and not a reversal, and the distinction is which clause moved.** The rule above —
*never key this on what the catalogue holds today* — is untouched and is still the reason this is not
`theCatalogue`: a contract **withdrawn** from the catalogue is the case this exists to refuse, and such
a reading would go green on exactly that deployment. What the grammar could not tell apart is
*published once* from *never published*, and that is the cran the first version did not have.

**`THE_PUBLICATIONS` is a register and not a list, and that was measured rather than read.** It is
transcribed and it is not trusted: `packages/registry/against-what-was-published/` checks each commit
out, runs that commit's own ledger script and compares. So a row cannot leave quietly —

- removing `'typescript/number/round@1'` **does not compile**: its publication constant has exactly one
  use, so `tsc` reports `THE_SIXTH_CONTRACT` unused and the suite never runs;
- removing `'typescript/string/levenshtein@1'`, whose constant three other rows share, compiles and
  reddens `nothing-this-tree-binds-escapes-the-freeze-check`, which names **both** bindings that lose
  their anchor — `typescript/string/levenshtein@1` and `typescript/string/levenshtein@1/reference@1.0.0`.

Two mechanisms over one table, and the cheaper of them is the compiler.

**What the amendment costs is a parser and the guard over it.** `readContract` was written for the
grammar reading and has no other consumer, so it goes rather than being kept for a use it does not
have — with `THE_LANGUAGES`, its row in `RENDERINGS`,
`a-rendered-contract-address-reads-back-as-itself` and `registry-storage · I-81`. It was added the day
before and removed the day after, and keeping it to justify the day before is the shape this
repository refuses everywhere else.

The guard is `a-deployment-may-retire-a-page-and-never-an-address-a-contract-was-published-at` now, its
published half derived from `THE_PUBLICATIONS` so a seventh contract enters the population with nobody
editing it, and **the turned-down contract's address is a row of its retirable half** — which is the
row that would go green again if somebody keyed this back to what an address looks like. `packaging ·
A-28` is unchanged and still reddens it: the trailing-slash strip is what turns a listed URL into a key.

**And the promise took the same correction a second time.** Yesterday it covered contracts rather than
the site's pages; today it covers *published* contracts rather than everything with a contract's
grammar. With ADR-0101's two, that is **four shrinkings of one sentence, every one of them measured and
none of them chosen** — the 404 now names a turned-down contract's address explicitly, because somebody
may have bookmarked that one and the sentence above it would otherwise be false for them.

Seen red before it was believed: with the classification put back on the grammar — `path.includes('@')`
in place of the lookup — the guard names the one address that opened this,
`expected [ …(7) ] to deeply equal [ …(6) ]` with `typescript/array/group-by@1` back among the refused.

At the amendment: `npm run registry` 466 passed, one fewer than the day before because the round-trip
guard went with the parser; `npm run packaging` 24, `npm run site` 184. The instrument declares **835
cells and 793 caught** where it declared 836 and 794, the survivor count unmoved at 42.

## Consequences

**What a reader meets.** The 404 now says which of the two kinds of address they are standing at: a
contract's address is served for ever, and a page this site writes about itself is the site's own and
may be retired. It also points at the two documents that carry what the retiring pages carried — the
methodology and the refusals, served as data — through `pathTo`, so the addresses are the registry's
own and not literals typed onto a page.

**The sentence is written as what the site *may* do and never as what it *has* done.** A 404 reading
*some pages have been retired* would be false on the day it was written and true a week later, which
is the drift this repository exists to close. What a reader needs is which kind of address they are
at, and that does not change.

**The gate goes on being inductive.** ADR-0125's coverage argument is untouched: each run compares one
deployment against the one before it, and a push whose run is skipped is still a link missing from
that chain. What changed is which differences are faults, not how the reading is taken.

**What it does not buy.** Nothing here reads the *site's* own pages for whether retiring one was a
good idea — that is a judgement, and the gate now says nothing about it. The record of which pages
were retired, and why, is the unit that retires them.

## Confirmation

`a-rendered-contract-address-reads-back-as-itself` holds both directions of the inverse, and the
negative half is the one with a consumer: `catalogue`, `method`, `what-a-contract-is`, `refused` and
`typescript/number` are the shapes the site really writes beside a contract, and reading any of them
as an address would put the site's own pages under a promise made about contracts.

Seen red on both halves before it was believed, at `cc231bf` with the guard in place:

- `before.indexOf('/')` written as `before.lastIndexOf('/')` — the language read back from the wrong
  side of a name that carries its own slash. All four addresses answer `null`;
  `expected [ null, null, null, null ] to deeply equal [ …(4) ]`.
- the digit test written as `Number.isFinite(Number(major))` — `expected [
  'typescript/number/parse@1e2', …(2) ] to deeply equal []`, naming exactly the three spellings the
  comment beside it names.

`a-deployment-may-retire-a-page-of-the-site-and-never-an-address-of-a-contract` holds the narrowing,
with its addresses built by `urlOf` rather than typed — what is being classified is the string the
sitemap really carries, including the trailing slash `urlOf` exists to get right.

Seen red on the dangerous direction: with the trailing-slash strip removed, `expected [] to deeply
equal [ 'https://toopo.dev/typescript/number/parse@1/', 'https://toopo.dev/typescript/array/group-by@1/' ]`.
That is the defect worth the cell — every contract address classifies as a page of the site, the
deployment that drops all seven at once prints them under *pages this site may retire*, and goes
through. `packaging · A-28` is that mutant, and `registry-storage · I-81` is the first one above.

Suites at the commit this record lands on: `npm run registry` 467 passed, `npm run packaging` 24
passed, `npm run site` 193 passed, `npm run anchors` 779 anchors across 107 files with none loose.

## What would reopen this

- **A second kind of address that is frozen for life.** The classification is *is this a contract's
  address*, and it is total over what this registry freezes today. An implementation address, or
  anything else the catalogue binds for the life of a major, would have to enter it — and the guard's
  negative half is where it would be added, because that is the half that decides.
- **A page of this site becoming something a reader is entitled to for ever.** Nothing here is one
  today; the argument is precisely that the site's pages carry no freeze. A page that acquires one —
  an address a published artefact cites, say — stops being the site's to retire.
- **The gate learning about redirects.** An address that is answered by a redirect rather than by a
  document is neither served nor dropped, and the reading has no vocabulary for it. Nothing here
  redirects today, and the day something does, this comparison is reading the wrong thing.

## More Information

ADR-0101 is the two earlier sentences this page lost and what refuted each. ADR-0125 is why an
address this tree has served goes on being written, and why the reading is taken before a deployment
rather than after one — its mechanism is narrowed here and its argument is not touched.
