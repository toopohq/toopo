---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - wrangler.jsonc
  - packages/site/served-headers.ts
confirmed-by:
  - battery: site
    guard: the-deployment-is-closed-to-robots-and-the-declared-origin-is-not
  - battery: site
    guard: both-the-published-shape-and-the-preview-shape-are-closed
  - battery: site
    guard: only-the-two-content-addressed-endpoints-are-cached-for-a-year
---

# The site moves to the mechanism that serves the address it is given

## Context and Problem Statement

[ADR-0099](0099-the-address-does-not-move-for-a-host.md) kept `name@major` and said the redirect was a
hosting problem rather than an address problem. This is that problem, answered.

Two throwaway projects, deployed one variable apart — same account, same token, same edge, the same
three files, each deleted in the run that made it:

| | Workers static assets | Cloudflare Pages |
| --- | --- | --- |
| `/at@1/` | **307** → `/at%401/` | **200** |
| `/at@1/answer`, no extension | **307** → `/at%401/answer` | **200** |
| `/at@1/index.html` | 307 → `/at%401/` | 308 → `/at@1/`, the trailing slash, `@` kept |
| the declared `Cache-Control`, at the address that serves the bytes | **no** — the rule matched the redirect and its destination fell through to the platform default | **`public, max-age=31536000, immutable`** |

The criterion was set before either was measured and it has two halves, because the first probe showed
they fall together: **the published address answers 200 with no redirect, and the declared header is the
one served at the address that serves the bytes.** One mechanism fails both. The other meets both.

## Considered Options

- Stay on Workers static assets and accept the redirect.
- Move to Cloudflare Pages.
- Move to an object store, or to another vendor.

## Decision Outcome

Chosen: **Cloudflare Pages**, by changing one field — `assets.directory` becomes
`pages_build_output_dir` — and one command.

### The trade, in the terms it was actually taken on

**What the refused option had for it, and it is not nothing.** Workers static assets is where this
vendor is putting its effort and where it is steering people from Pages. Choosing Pages is choosing the
mechanism with the stated direction away from it, and a reader arriving later should find that written
here rather than discovering it.

**What decides is that the two costs are not the same kind.** Being on a mechanism that may be retired
is a *future* risk, and it is the risk this architecture was built to absorb: the address is designed
rather than derived, the bytes are addressed by their digest, and [ADR-0052](0052-what-an-emitted-tree-is.md)
publishes that the migration off this class of host changes no URL. If Pages is withdrawn, the site
moves and **not one installed file becomes false.**

Staying costs every day and costs it permanently: every contract page, every Markdown twin and every
named answer about a contract behind a redirect; the declared header never served at the address that
serves the bytes; and a sitemap publishing addresses that redirect, which is
`packages/site/paths.ts`'s own sentence about getting a redirect indexed instead of a page.

**A future risk this architecture absorbs, against a present cost it cannot.** An object store and
another vendor were not measured and were not needed: one mechanism meeting the criterion answers the
question, and the object store remains where ADR-0052 put it — the migration that removes the file wall,
whenever that wall matters.

### The host rule had to change, and it is the part that looks safe

`X-Robots-Tag: noindex` was matched on `workers.dev`. **A pattern naming the old mechanism's domain
matches nothing on the new one**, and a pattern that matches nothing is a file that looks correct and a
deployment that is open — this record's own words about the last one. So it moves, and it becomes two
patterns rather than one: a production deployment is one label in front of the vendor's domain and a
preview is two, a placeholder in a host stops at a period, and the shape left out would be the preview,
which is the one nobody looks at.

`both-the-published-shape-and-the-preview-shape-are-closed` counts label depth rather than comparing
against the two strings, so what it says is *both shapes are closed* and not *these two lines are
present*.

## Confirmation

The three guards named above, plus the measurement that no guard can make: a request against the real
deployment, reading back status, `Cache-Control` and `X-Robots-Tag` at every address the tree writes.
**Whether a host pattern matches is not something this repository can assert**, and the previous
mechanism is the reason that sentence is here twice.

## What would reopen this

Pages being withdrawn, which moves the site and changes no URL — the property the trade above was taken
on. Or a measurement showing this mechanism failing either half of the criterion at an address the
throwaway did not carry.
