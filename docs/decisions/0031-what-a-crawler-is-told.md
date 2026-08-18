---
status: accepted
date: 2026-08-15
decision-makers: Mathis Perron
governs:
  - packages/site/indexing.ts
  - packages/site/paths.ts
  - packages/registry/address.ts
confirmed-by:
  - battery: site
    guard: every-page-is-in-the-sitemap-and-nothing-else-is
  - battery: site
    guard: every-url-in-the-sitemap-decodes-to-a-page-this-site-writes
  - battery: site
    guard: the-sitemap-carries-no-date-this-repository-cannot-derive
  - battery: site
    guard: robots-txt-lets-a-crawler-read-everything-and-names-the-sitemap
  - battery: site
    guard: no-file-of-this-folder-spells-the-origin
  - battery: site
    guard: the-generator-knows-of-no-domain-but-the-one-it-publishes-on
---

# What a crawler is told

## Context and Problem Statement

A sitemap is two small files nobody reads, and they are the difference between a site that exists and a
site that is found. Both invite a value this repository cannot honestly produce: an absolute origin
written by hand in several places, and a last-modified date.

## Considered Options

- Carry the origin as a setting, and fill `lastmod` from the file's mtime or from the build clock.
- Declare the origin once as an address, and omit `lastmod`.

## Decision Outcome

**The origin is an address, not a setting.** `THE_ORIGIN` is `https://toopo.dev`, declared once in
`packages/registry/address.ts` beside the other addresses, and everything derives from it. Its cost is the cost every
frozen identifier here carries, one order of magnitude up: a case identifier moving breaks the links
into one page, and this moving breaks every URL the site has ever published. A guard refuses a second
spelling anywhere in the folder — including inside a comment, and including the second domain that
redirects, which is a fact about DNS that no module here has any business knowing.

**No `lastmod`, and it is omitted rather than filled.** The protocol makes it optional and it is the
field that invites a fabricated date: a file's mtime is a fact about a checkout and a clock is a fact
about the machine the build ran on, and **a published file carrying a machine-dependent value is the
immutability defect this repository has already found twice**. A `lastmod` that lies is worse than
none — a crawler told a page changed a year ago may not come back. The day a published snapshot carries
the instant it was published, that is a real and re-derivable date and the decision is worth taking
again.

**The URL a crawler is given and the URL a reader follows are one function.** `urlOf` is `linkTo` with
the origin in front, because a sitemap URL that differs from the served URL by one character gets a
redirect indexed instead of the page. Two guards over it, and the second exists because the first
cannot be independent: the set comparison rebuilds what it expects with the very function the sitemap
is built from, so a URL is also read **back** and required to name a page in the map. W-57 is what
separates them — `linkTo` stops stripping the file name, every reconstruction moves with the defect and
stays green, and only the decoding finds that every published URL now names nothing.

## Consequences

**Verified over HTTP rather than assumed**, which is the third unit running where a browser found what
no static check could. Measured at `912d1fc`: the XML parses with no parser error, root `urlset` in
the sitemaps namespace, seven `loc`, zero `lastmod`, and all seven URLs answered 200 with no
redirect — the `@` addresses included.

**That sentence stood in the present tense and went false, which is the fifth instance of this
repository's own class and the first found by measuring rather than by rereading.** Measured at `b79a364`:
`toopo.dev` resolves to `216.24.57.7` and **every path answers 403**, with an identical 8 096-byte
body on `/`, `/number/parse@1/`, `/method/` and `/sitemap.xml`. Nothing is served. So the verification
above is stamped and stays true of its commit for ever, and the live state is a separate sentence with
its own — because *what a browser answered on the day somebody looked* and *what a browser answers*
are two claims, and only the first is ever settled. It is
[ADR-0018](0018-a-published-count-carries-its-coordinates.md) arriving on this
repository's oldest habit: a dated number followed by a present-tense clause about the same quantity
publishes a truth and a lie in one sentence, and it is the lie the reader believes.

**And a guard that could not be the only red on anything was deleted rather than kept.**
`every-url-a-crawler-is-given-is-absolute-and-on-the-published-origin` fired only where the set
comparison already fires, because that one pins each location as an exact string with the origin in
it. The attribution reported it alone on nothing, which is this repository's own criterion; its one
genuinely unguarded half — the `Sitemap:` line, which no comparison over the sitemap can see — moved
into the guard over the file it is about.

## Confirmation

The set comparison and the decoding are a pair whose second half exists because the first cannot be
independent, and W-57 above is the cell that separates them. `no-file-of-this-folder-spells-the-origin`
is a guard whose assertion is over an empty set by construction — the origin moved out of `site/` when a
licence header started freezing it into repositories nobody here will see again — and it is kept for
that reason rather than in spite of it: a name rendering a count outlives the data it counted, so the
guard says *no file spells it* rather than publishing how many did.

## What would reopen this

A published snapshot carrying the instant it was published, which is the one date this repository could
derive rather than fabricate. That is what the `lastmod` paragraph above names as the event.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — the discipline the origin
  inherits, one order of magnitude up.
- Moved out of `CLAUDE.md` by [ADR-0001](0001-record-decisions-in-madr-format.md).
