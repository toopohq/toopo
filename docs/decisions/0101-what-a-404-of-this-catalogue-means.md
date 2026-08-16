---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - packages/site/not-found-page.ts
  - packages/site/document.ts
confirmed-by:
  - battery: site
    guard: the-file-for-an-address-nothing-is-served-at-is-not-a-page
  - battery: site
    guard: every-page-has-its-markdown-beside-it-at-the-same-address
---

# What a 404 of this catalogue means, and the two stronger sentences that were measured false

## Context and Problem Statement

The migration of [ADR-0100](0100-the-site-moves-to-the-mechanism-that-serves-the-address.md) restored
the address and broke absence. Measured on the deployment: `/does-not-exist` answered **200** with the
front page, byte for byte — 6 579 bytes, identical under `cmp` — and so did every other address the tree
holds nothing at. It is documented behaviour: *if your project does not include a top-level `404.html`
file, Pages assumes that you are deploying a single-page application*, and the fallback matches every
incoming path to the root.

**That falsified a published sentence of `emit.ts`**, which is how the emitted tree encodes absence:

> A question whose answer is `null` writes no file, which is how an emitted tree spells *this registry
> holds no such thing*: a static host answers 404 for a file that is not there, so the absence is the
> answer rather than something that has to be encoded.

So a file is needed, and it is the only page of this site that can say what a 404 here means — which
turned out to be the hard part.

## Considered Options

Three sentences, measured in order. The first two are recorded because **a reader who finds this page
modest should see that the stronger versions were tried and refuted, not forgotten.**

### Refused: *nothing is published at this address means nothing ever was*

The first draft, and it rested on permanent rule 6 — a published version is frozen for life. It is false,
and `emit.ts` says so itself:

> A refused contract has no binding, so nothing ever names the digest of its contract snapshot, so the
> closure does not reach it — and `array/group-by@1` is exactly that case. **Two snapshots this registry
> would answer are unreachable from every question a client can ask.** They are not emitted.

Two addresses exist where the registry **holds** the answer and the tree serves nothing. A 404 there does
not mean *this never existed*; it means *no question reaches it*.

### Refused: *a 404 means no question published by this catalogue leads here*

The repair for the first, and it is false in the other direction. Measured on the live deployment:

```
/contract-index  lists  typescript/array/group-by@1   installable=false
packages/site/out/typescript/array/group-by@1/  holds  implementation-bindings   and nothing else
```

`contract-index` is one of the three questions that need no address. It names `array/group-by@1`. And
`emit.ts`'s own `theQuestionsAbout` says a client holding a contract address may ask for its
`contract-binding` **and** its `implementation-bindings`, for every entry of the index. The emission
writes one of the two, because a refused contract has no binding to write.

**So a published question does lead to an address that serves nothing**, and it is the only way to
arrive there.

### Chosen: *nothing has ever been served at this address*

The two refused sentences characterise the served set by another set — what the registry holds, and
what the catalogue publishes as questions — and **each of those overspills the served set, on a
different side.** The registry holds two snapshots it never serves; the catalogue publishes a question
whose answer is never served. Only the served set is what a 404 is about, and it is the only set the
sentence now names.

What is kept from the first draft is the part that was never in doubt, and it is the guarantee rather
than an apology: **this registry withdraws nothing.** Permanent rule 6 freezes a published version for
life, so what has been served once is served for ever, and an incompatible change becomes a new address
beside the old one. That is what makes *nothing has ever been served here* the whole content of a 404 —
it can never be *this was taken down*.

## Consequences

**It is the fifth file found by convention**, beside `robots.txt`, `sitemap.xml`, `llms.txt` and
`_headers`. It is not a page: no address of its own, no Markdown twin, no entry in the sitemap, because
none of the three would be true of a document a reader arrives at by having been wrong.

**`Document` gained a field rather than the renderer gaining an exception.** `toHtml` emitted
`rel="alternate"` for everything it rendered — true of every page and false of this one, and a relative
`index.md` beside a file served at whatever address was mistyped would resolve somewhere different on
every error and to nothing on all of them. `servedBesideItsMarkdown` is required, so a document added
without an opinion does not compile: [ADR-0054](0054-make-the-omission-impossible.md)'s shape, on the
one declaration a reader's tooling follows.

**The link to the catalogue is absolute**, for the same reason: this document has no depth, so
`rootFrom` has nothing to compute from.

## Confirmation

`the-file-for-an-address-nothing-is-served-at-is-not-a-page`, seen red on a 404 that declares a twin —
the alternate link reappears and the guard names it. Its second assertion had to be repaired before it
measured anything: `markdownOf` swaps `index.html` alone and is the identity on every other path, so
asking it for this file's twin asked whether this file exists. It passed for the wrong reason first.

**What no guard here establishes is the status code**, which is the whole point of the file: a mechanism
answering 200 with an error page would be worse than the fallback it replaces, because it would look
repaired. That is a request against the real deployment, and
`/typescript/array/group-by@1/contract-binding` is the witness — the address the third measurement
found, which answered 200 before this file existed.

## What would reopen this

A fourth case where the site answers 404 on something a reader could reasonably expect. The sentence
covers what was measured; it does not claim the three cases are all of them.
