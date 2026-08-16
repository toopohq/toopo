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

### What a second mechanism stores, measured after this record was written

The clause here read *what a second host would store has not been measured*, in the present tense. It
was measured two throwaway deployments later, and the sentence is replaced rather than left standing —
which is the class this repository versed on its own prose the same day.

**Two throwaway projects, one variable apart.** Both on the same account, the same token, the same edge,
the same three files, each deleted in the run that made it.

| | Workers static assets | Cloudflare Pages |
| --- | --- | --- |
| `/at@1/` | **307** → `/at%401/` | **200** |
| `/at@1/answer` | **307** → `/at%401/answer` | **200** |
| `Cache-Control` from `_headers` at the address that serves the bytes | **no** — the rule matched the redirect, the destination fell through to the platform default | **yes** — `public, max-age=31536000, immutable` |
| `/at%401/` | 200, the canonical key | 200, a different address, default headers |

**So the encoding is not a property of static hosting, of Cloudflare, or of the address. It belongs to
one mechanism**, and the other mechanism of the same vendor, behind the same edge, answers the published
address with 200 and the declared header. The tree carried none of this site: a directory with an `@`, a
file with an `@`, an extensionless file, four rules.

**And the probe found the half nobody had thought to ask.** On Workers assets a rule whose pattern spells
`@` applies to the *redirect* and not to its destination, so an address there loses its address and its
headers together. `packages/site/served-headers.ts` escapes it only because every rule is
`pathTo(endpoint, EVERY_ADDRESS)` and the splat stands where a rendered address would go — by the shape
of the splat and not by intention.

**Still not measured**: what a host of a different vendor stores. Nothing here needed it, because one
mechanism that meets the criterion answers the question this record was blocked on.

## Consequences

**The deployment served a redirect at the published address, and that was a hosting problem rather
than an address problem.** It went on the open list of `CLAUDE.md` with what it cost: the sitemap
publishes the unencoded form, so a crawler indexes a redirect rather than a page — which is
`paths.ts`'s own sentence, arriving on this catalogue.

**That paragraph stood in the present tense for three commits after it stopped being true**, and it is
the same fault this repository keeps paying for. [ADR-0100](0100-the-site-moves-to-the-mechanism-that-serves-the-address.md)
moved the site one commit later, on the criterion this record set; measured at `994374d`, every
contract address at the declared origin answers 200 with no redirect, and
[ADR-0103](0103-the-declared-origin-serves-this-catalogue.md) carries the sweep and the entry it
closed. **The decision this record took is untouched by that** — the address never moved, which was the
whole point.

**Nothing is repaired by this record.** The address stays, the deployment stays as it is, and where the
site lives is the next question. Its criterion is single and measurable: the published address answers
200 with no redirect, and the declared cache headers are the ones served.

## What would reopen this

A measurement showing a static-file host that stores an encoded key without being asked — which would
make the encoding a property of the class of hosts rather than of one, and would change what the trade
above is between.
