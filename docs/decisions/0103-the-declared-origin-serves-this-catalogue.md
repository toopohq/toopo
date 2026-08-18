---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - wrangler.jsonc
  - packages/site/served-headers.ts
confirmed-by: []
---

# The declared origin serves this catalogue

## Context and Problem Statement

`https://toopo.dev` was connected to the Pages project, outside this repository and in the one place a
custom domain can be attached. Nothing here can know that happened, and two records had already written
down what it would cost when it did.

[ADR-0097](0097-the-deployment-is-configured-in-this-repository.md) and
[ADR-0100](0100-the-site-moves-to-the-mechanism-that-serves-the-address.md) both end on the same
sentence: **whether a host pattern matches is not something this repository can assert**, and what
settles it is a request against the real deployment, reading the header back. That request had never
been made against this mechanism. Until it was, `_headers` was a file that looked correct.

And the repository's own account of where it lives had gone false in the meantime, in the ordinary way:
six clauses in the present tense, each true when written.

## Considered Options

- **Probe a sample**, as the sweep at `ed1abfd` did — one address of each class, thirty-four of them.
- **Probe every address the emitted tree writes.**
- **Build the probe into a suite**, so it runs on every push.

## Decision Outcome

Chosen: **probe every address the tree writes**, from outside the repository, and publish the result by
class rather than by row.

### Why not the sample, in the words of the sample itself

The sweep at `ed1abfd` was published as *thirty-four addresses*, and **that figure cannot be rebuilt
from its own decomposition.** What the commit lists is seven pages, seven Markdown twins, three files
found by convention, twelve named answers, both content-addressed endpoints and `_headers` — thirty-two.
Adding the redirect row's destination, which is the only address it names that is not already in the
list, gives thirty-three. Nothing written down accounts for the last one.

That is `CLAUDE.md`'s own rule about a rank, arriving on a total: **a list is checked line by line and a
count is checked only by rebuilding it**, which is what nobody did. It is not a large error and it is
not the reason for the decision. The reason is what the exercise showed: a sample is presented as
coverage and read as coverage, and the tree writes 76 addresses. Two of the four findings below sit in
classes the sample did not carry.

### Why not a guard

A probe in a suite reaches the network, and every other guard in the seven suites reads a disk. One
network-dependent cell makes every red in that suite ambiguous — a failure is then a defect here, or a
host, or a runner's egress, and reading it takes a second measurement. It is refused for this record
and it is **not** refused in general: the one guard worth that price is the end-to-end install
[ADR-0092](0092-the-catalogue-leaves-the-archive.md) named, and it belongs to its own unit.

## What the sweep found

Measured at `27d1dbb`, over the 76 addresses the emitted tree writes plus one address it does not.

**The deployment carries the same commit, and the reading is eleven of twelve rather than twelve.**
Every named answer that holds a record answers `servedFrom: 27d1dbb`; the twelfth,
`/typescript/array/group-by@1/implementation-bindings`, is the two-byte empty list of the refused
contract and has no field to carry one. That is not a gap in the sweep — an answer with no record has
nothing to stamp — and it is written here because *every named answer* was the first sentence, and it
was false by one.

| Class | Count | Status | `Cache-Control` | `Content-Type` |
| --- | --- | --- | --- | --- |
| pages | 7 | 200 | `public, max-age=0, must-revalidate` | `text/html` |
| Markdown twins | 7 | 200 | `public, max-age=0, must-revalidate` | `text/markdown` |
| named answers | 12 | 200 | `public, max-age=0, must-revalidate` | **`application/octet-stream`** |
| content-addressed | 36 | 200 | `public, max-age=31536000, immutable` | **`application/octet-stream`** |
| `llms.txt`, `sitemap.xml` | 2 | 200 | `public, max-age=0, must-revalidate` | `text/plain`, `application/xml` |
| modules, `robots.txt` | 10 | 200 | **`public, max-age=14400, must-revalidate`** | `application/javascript`, `text/plain` |
| `_headers` | 1 | **404** | `no-store` | — |
| `404.html` | 1 | **308** → `/404` | — | — |
| an address never served | — | **404** | `no-store` | `text/html` |

**The declaration is served where it was written to be served.** The 36 addressed by content carry the
year-long policy `cachePolicyFor` declares, which is not any platform default — so `_headers` is read
and applied, and the thirty-six `served-headers.ts` was written for are the thirty-six it moves.

**`@` is served directly, with no redirect**, at every contract address. That is the criterion
ADR-0100 set, met on the real deployment rather than on a throwaway.

**The 404 page is served at an address nothing was ever served at**, with the body
[ADR-0101](0101-what-a-404-of-this-catalogue-means.md) argues for, and `no-store` so that a reader is
never shown a cached absence.

### Both host patterns, read in one sweep

| | `X-Robots-Tag` |
| --- | --- |
| `toopo.dev`, one address of each class | absent |
| `toopo.pages.dev`, one address of each class | `noindex`, including on both 404s |

**Either half alone proves nothing, and that is why they are one measurement.** An absent header at the
declared origin is what a correct rule produces and equally what a rule matching nothing produces; a
`noindex` at the temporary address is what says the pattern still matches after the move that changed
its domain. The rule retires itself at the origin by matching on the host, as designed, and it is still
armed where it should be.

### What was not measured, and what would establish it

**The two-label shape.** `NOT_THE_DECLARED_ORIGIN` carries a second pattern for
`<branch-or-hash>.<project>.pages.dev`, and no live deployment answers at that shape: the workflow
deploys with `--branch=main`, so no preview exists, and `main.toopo.pages.dev` answers Cloudflare's own
404 with none of the project's headers — a request that does not exercise the pattern rather than one
that refutes it. Reaching a deployment's own alias needs the API token, and putting a credential on a
command line to buy one reading is a worse trade than the reading is worth. **What would establish it
is any preview deployment**, which the first pull request produces for free.

**Why those ten addresses carry `max-age=14400`.** It is stable over three passes and it is not
explained. The ten share no extension, no content type and no depth: nine are `.js`, one is
`robots.txt`, and `llms.txt` beside it answers `max-age=0`. What is established is that ten served
addresses carry a cache policy this repository never wrote. No cause is named, because none was
measured.

## Consequences

**The `@` entry on the open list closes**, and the reserve is the half that matters. What is
established is the behaviour of **two mechanisms**: Workers static assets stores the percent-encoded
key and redirects to it; Pages stores and serves the unencoded one. So the address this repository
publishes is the address served, `contractUrl` writing `@1` into a frozen licence header is right, and
the sitemap names pages rather than redirects. **What is not established is a law about servers.** A
third host may normalise `@` as the first did, and nothing here has measured one; an entry closed in a
way that reads as a general rule is worse than an entry left open, because the next host is chosen by
somebody who believes the question is settled.

**Six clauses of this repository went false when the domain was connected, and three more had been
false since `45f702f`.** They are repaired in this unit and counted in its commit. The second group is
the one worth reading: the move to Pages closed an entry of the open list in fact and swept nothing, so
`CLAUDE.md` described a redirect that no longer happened for three commits. That list's own rule
already says a mechanism and its entry are one event; what this adds is that the sweep is owed even
when the mechanism is one field of a configuration file.

**ADR-0092's entry woke on its own.** It named its closing event — *the first deployment that answers on
`https://toopo.dev`* — and this sweep met it without anybody remembering the debt. That is what a debt
naming its event buys over one written *later*, and it is the clearest instance this repository has
produced.

**`contentTypeOf` is not closer to being served.** It went from a header that was absent to one that is
wrong on 48 answers, which is more visible and no better.

## Confirmation

**None, and that is the record's subject rather than a gap in it.** No guard here can assert what a
host answers; `served-headers.test.ts` keeps the shape of the file — that both deployment shapes are
closed, that the declared origin is not among them, and that only the two content-addressed endpoints
are cached for a year — and ADR-0100 names those three. What this record adds is the reading that
cannot be a guard, published with its date and its population so that the next one is a comparison
rather than a fresh assertion.

## What would reopen this

- **A preview deployment**, which measures the one pattern this sweep could not reach.
- **A cause for the ten addresses**, or a change in which addresses carry an undeclared policy.
- **A second host storing an encoded key**, which would make the encoding a property of a class of
  hosts and reopen the entry this record closes.
- **The origin ceasing to answer**, at which point every clause repaired in this unit is false again in
  the other direction, and the repair is another sweep rather than a revert.
