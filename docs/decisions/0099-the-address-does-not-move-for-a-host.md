---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - packages/registry/address.ts
  - packages/site/paths.ts
confirmed-by:
  - battery: registry-storage
    guard: a-rendered-address-is-the-spelling-frozen-with-the-major
  - battery: registry-storage
    guard: every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract
  - battery: site
    guard: the-url-a-licence-header-freezes-is-the-page-this-site-publishes
---

# The address does not move for a host

## Context and Problem Statement

The first real deployment served every contract address behind a redirect. Measured at `c764867` on
`https://toopo.mathis-perron.workers.dev`:

```
/typescript/date/add@1/       307   Location: /typescript/date/add%401/
/typescript/date/add%401/     200   text/html   public, max-age=0, must-revalidate
```

It reaches the pages, their Markdown twins and every named answer about a contract — nine of the
addresses probed, plus four pages and four twins.

**This is the last day the address can move.** `contractUrl` is written into the licence header of every
file the installer has ever written; a header is frozen into somebody else's repository for ever, and
nothing is published yet. So the question had to be asked now and had to be asked on data.

**What no guard here detected, and correctly.** `endpoints.ts` asserts that every character an address
can produce is *legal* in a path segment. It is, and that assertion is still true. Whether a host
*normalises* a legal character is a different question, and no guard here asks it — nor could one, since
it is a fact about somebody else's software.

**And one guard had already reasoned about this exact redirect, before it existed.**
`the-url-a-licence-header-freezes-is-the-page-this-site-publishes` holds `urlOf(pageOf(address))` and
`contractUrl(address)` to one string, and its own comment says why: *a redirect fixes the first for
everybody at once and fixes the second for nobody, because the second is already in somebody's
repository and frozen there.* It was written about a hypothetical and it is now describing a measurement.

## Considered Options

- Keep `name@major`.
- Replace `@` with a separator no host is known to normalise.
- Publish the percent-encoded form as the address.

## Decision Outcome

Chosen: **keep `name@major`. The address does not move.**

### The four measurements

Four hosts that serve `@` inside a path segment at scale, measured directly:

| address | status | server |
| --- | --- | --- |
| `cdn.jsdelivr.net/npm/lodash@4.17.21/package.json` | 200 | — |
| `unpkg.com/lodash@4.17.21/package.json` | 200 | `cloudflare`, CF-Ray |
| `esm.sh/lodash@4.17.21` | 200 | `cloudflare`, CF-Ray |
| `registry.npmjs.org/@types%2fnode` | 200 | `cloudflare`, CF-Ray |

None redirects. **Three of the four report `Server: cloudflare` with a CF-Ray**, which is what makes the
reading decisive rather than merely encouraging: the same edge that redirects this deployment serves `@`
unencoded for three others. The behaviour is not Cloudflare's, and it is not the internet's — it belongs
to one mechanism.

Two further readings place it inside that mechanism. A path carrying `@` that resolves to nothing answers
a plain **404**, not a redirect, so this is not a rewrite applied before lookup. And the `%40` form
answers **200 and never redirects back**, so it is the canonical key. **The encoding is at upload, not at
request** — Cloudflare's own direct-upload documentation shows a manifest keyed by literal
forward-slash-separated paths and says nothing about encoding any character, so the behaviour is
documented nowhere.

### The argument that decides, which is not the convention

`number/parse@1` is not a URL spelling. It is *the* rendering of an address, produced by
`renderContract`, and it is already three other things: the anchor of a case — `#ordinary-integer` hangs
off it — the identifier a `toopo.lock` keeps, and the string a developer types into `toopo add`. A
different separator in the URL would make **two renderings of one address**, which is exactly what
`packages/site/paths.ts` refuses for a page when it says a slug would be a second name for a thing that
already has one, and what `ADR-0019` refuses for a guard.

That `name@version` is also what npm, Go and OCI have installed is true and is the weaker half. It is
worth saying because familiarity is real, and worth ranking second because it would not have decided
anything on its own.

**What the trade actually is**: freezing, in the source code of every user for ever, a concession to one
tool's upload behaviour — a tool this project can leave, on a host this project has already priced
leaving. The file wall is at 1 427 contracts ([ADR-0052](0052-what-an-emitted-tree-is.md)); the migration
away was always coming, and it changes no URL. Paying a permanent price for a temporary mechanism is the
wrong side of that trade.

### What was not measured

**What a second host would store.** The four above serve `@` from origins whose storage this measurement
cannot see; none of them is a static-file host of the kind this tree needs, and no such host was
deployed to. So nothing here establishes that the encoding is unique to this mechanism — only that this
mechanism does it and that the edge in front of it does not.

That is the reading that would reopen this, and it is named here so a later reader can see the question
was asked against data rather than settled by preference.

## Consequences

**The deployment serves a redirect at the published address, and that is now a hosting problem rather
than an address problem.** It is on the open list of `CLAUDE.md` with what it costs: the sitemap
publishes the unencoded form, so a crawler indexes a redirect rather than a page — which is
`paths.ts`'s own sentence, arriving on this catalogue.

**Nothing is repaired by this record.** The address stays, the deployment stays as it is, and where the
site lives is the next question. Its criterion is single and measurable: the published address answers
200 with no redirect, and the declared cache headers are the ones served.

## What would reopen this

A measurement showing a static-file host that stores an encoded key without being asked — which would
make the encoding a property of the class of hosts rather than of one, and would change what the trade
above is between.
