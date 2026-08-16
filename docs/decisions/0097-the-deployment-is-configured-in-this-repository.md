---
status: accepted
date: 2026-08-16
decision-makers: Mathis Perron
governs:
  - wrangler.jsonc
  - packages/site/served-headers.ts
  - packages/registry/response.ts
confirmed-by:
  - battery: registry-storage
    guard: a-content-addressed-answer-is-public-for-a-year-and-immutable
  - battery: registry-storage
    guard: a-named-answer-is-public-and-revalidated-before-every-use
  - battery: registry-storage
    guard: every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not
  - battery: site
    guard: every-endpoint-carries-a-cache-rule-at-an-address-that-names-it
  - battery: site
    guard: only-the-two-content-addressed-endpoints-are-cached-for-a-year
  - battery: site
    guard: every-other-answer-is-revalidated-before-it-is-used
  - battery: site
    guard: the-deployment-is-closed-to-robots-and-the-declared-origin-is-not
  - battery: site
    guard: the-file-stays-inside-the-limits-the-host-parses-it-under
  - battery: site
    guard: the-rendering-carries-every-rule-with-its-headers-indented-beneath-it
  - battery: site
    guard: the-tree-carries-the-file-the-host-reads-to-serve-it
  - battery: site
    guard: every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint
---

# The deployment is configured in this repository, and the declared cache policy is what is served

## Context and Problem Statement

A Cloudflare project was connected to this repository and its first build failed. The diagnosis is
that this is not a Pages project serving a folder: it is a Worker serving static assets. The dashboard
offers *Cron Triggers* and *Queues*, which are concepts of a program, and it offers **no output
directory field at all** — so there is nowhere in it to say where the built site lives. Cloudflare's
own attempt named the cause: its application detection logic "has been run in the root of a workspace
instead of targeting a specific project", which is what a monorepo with no configuration file looks
like from outside.

So the configuration has to live here. That is no longer a preference about where settings belong; it
is the only place with a field for it.

**And underneath the deployment sat a declaration that had never been served.** `cachePolicyFor` has
said since the storage unit that a content-addressed answer may be cached for a year and a named one
must be revalidated before every use. Every guard behind it asked whether the function returned the
right record. No guard, and no host, ever turned one into a header. It is the form this repository
keeps finding and keeps naming `one-directional`: a thing that behaves like a rule, with nothing making
it hold.

It is not a decorative one. That policy is the reason a revision may not travel in a content-addressed
envelope — [ADR-0090](0090-a-revision-belongs-to-the-named-half.md) argues it at length, on the grounds
that a cache promising *never stale* would serve a year-old body under a sentence saying it cannot be
wrong. The promise was in a record nobody sent.

**Measured, on the platform this is deployed to:** Cloudflare serves a static asset
`public, max-age=0, must-revalidate` by default. That is `cachePolicyFor('named')` exactly. So the
default was already right for the twelve named answers this catalogue emits, and wrong for the
thirty-six addressed by content — which are the two endpoints `the-endpoints-that-carry-the-bulk-are-the-cacheable-ones`
singles out as carrying the volume, at 32 to 50 kB a snapshot. The whole of what this decision buys is
those thirty-six, and it would have been bought by nothing else: a default that is right about the
cheap half and wrong about the expensive one is invisible until a bill arrives.

**And it is now or never.** Bytes cached for a year in somebody's browser do not recall.

## Considered Options

- Leave the build and deploy commands in the dashboard and add no file.
- A `_headers` file written by hand beside the built tree.
- A `_headers` file derived from the endpoints and written by the build.

## Decision Outcome

Chosen: **the third**, with `wrangler.jsonc` at the root of the workspace.

The first is not available: there is no output directory field to fill.

The second was refused for a reason `build.ts` makes mechanical rather than tasteful — **it wipes its
output folder before writing the tree.** A file placed beside the tree by hand is deleted on the next
build, or, if it is placed somewhere that survives, it is a second statement of a policy that has moved.
What tells a host how to serve the tree is part of the tree.

### A rule is an endpoint's own address with the address left open

`pathTo(endpoint, '*')` is the same function that decides where an answer lives, called with a splat
where a real address goes — the shape `pathShapeOf` already takes with `{...}` for a reader. Its three
arms give the right pattern for free, and the rule set is total over `ENDPOINTS`, so an endpoint added
without a cache rule does not compile into a complete file.

**Which endpoint a rule names is asked of `askedAt`, and that is the half that carries the guard.** It
is `pathTo`'s own inverse, held to that in `endpoints.test.ts`. A pattern this repository gets wrong
resolves to no endpoint and reddens, where a comparison against patterns rebuilt from `pathTo` would
have agreed with itself whatever either side said — the fault
[ADR-0087](0087-a-guard-perturbs-the-claim-never-the-object-derived-from-it.md) names. The same rule
decided where the two literal `Cache-Control` strings are written: in the guard, not read back from the
declaration.

Measured against a single-character mutant — `/blob/*` written `/blobs/*` — three guards redden, and
the one that sweeps the emitted tree names all **28** blobs that would have been served revalidating.

### Nothing is deployed until the deployment is closed to robots

A Cloudflare deployment is publicly reachable, and this one publishes pages whose canonical links,
sitemap and `robots.txt` all name the declared origin — which answers 403. A search engine that found
the temporary address would index an address whose every link is dead, and indexing does not come back
on request.

The generated `robots.txt` is not weakened, and that is the distinction the repair turns on: it tells
the truth about the origin this site declares. It is the *deployment* that is closed, by the rule
Cloudflare documents for exactly this case, matching on the host:

```
https://:worker.:subdomain.workers.dev/*
  X-Robots-Tag: noindex
```

**It matches on a host, so it cannot apply at the declared origin** — which is why it is written this
way rather than as a dashboard flag somebody turns off on the day the domain is connected. A `noindex`
left behind is the failure this shape removes, and a flag to remember is the shape that produces it.

No guard can establish that the pattern *matches*; a host pattern matching nothing is a file that looks
correct and a deployment that is open. What a guard does keep is the mistake that would be silent and
permanent — a `noindex` written against the declared origin — and the proof of the rest is a request
against the real deployment, reading the header back.

### A dev dependency is admitted when it cannot reach the product

This adds `wrangler`, which the stage rules of `CLAUDE.md` did not allow: they named four dev
dependencies and no criterion. The rule is amended rather than excepted, because **an exception
multiplies and a criterion survives its first case**:

> A dev dependency is admitted when it cannot reach the product, and when the mechanism that stops it is
> executable.

Two such mechanisms are already here and both are measured. `files: ["dist"]` in the manifest is what
`npm pack` ships, and `packaging/reachable.ts` prunes `dist` to what the published entry point can
reach — so a tool that no published module imports is absent from the archive twice over, by a
declaration and by a walk. `archive.test.ts` is what says so.

**The alternative was `npx wrangler deploy` with nothing installed, and it was refused on this
repository's own thesis.** Workers Builds uses the wrangler version set in the manifest; with none set,
it takes the latest at build time. A repository whose product is that a published version is frozen for
life cannot deploy with *whatever was newest that morning* — and a deployment has to be reproducible,
so that the same commit redeployed in six months can be told apart from the tool having moved. Pinning
the version inside the dashboard's deploy command was refused too: it puts a version back into the one
field this decision exists to empty.

What is left in the dashboard is two constants carrying no version and no path: `pnpm run site:build`
and `npx wrangler deploy`.

## Confirmation

**Ten of the eleven guards in the front matter are reddened by a named cell. The eleventh has never
been red and cannot be, and this paragraph is the correction of the sentence that said otherwise.**

It first read *the eleven guards in the front matter, each seen red on a mutant written for it*, and
that was false when it was written: `the-file-stays-inside-the-limits-the-host-parses-it-under` is in
`unprobedRegions` with its reason, because one rule per endpoint and eight endpoints means no edit to a
file of that folder reaches a hundred and first rule. The claim was made before the batteries had been
asked, and the batteries are what refused it — `site` reported six of the eight new guards as guards
nothing reddens, which is how the gap was found rather than by rereading this section.

Read off `npm run battery`, at `02ebe46`:

| guard | red on |
| --- | --- |
| `a-content-addressed-answer-is-public-for-a-year-and-immutable` | I-58 |
| `a-named-answer-is-public-and-revalidated-before-every-use` | I-59, I-60 |
| `every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not` | I-58, I-59, I-60 |
| `every-endpoint-carries-a-cache-rule-at-an-address-that-names-it` | W-78 |
| `only-the-two-content-addressed-endpoints-are-cached-for-a-year` | W-78, W-79 |
| `every-other-answer-is-revalidated-before-it-is-used` | W-79 |
| `the-deployment-is-closed-to-robots-and-the-declared-origin-is-not` | W-80 |
| `the-rendering-carries-every-rule-with-its-headers-indented-beneath-it` | W-81 |
| `the-tree-carries-the-file-the-host-reads-to-serve-it` | W-19, W-20 |
| `every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint` | W-19, W-20, W-78 |
| `the-file-stays-inside-the-limits-the-host-parses-it-under` | **never — declared unprobed** |

The last two rows are the two that needed no new cell: an existing pair already reddens them, which is
what says the file joined the tree rather than sitting beside it.

**What no guard here reaches** is whether Cloudflare's splat spans a slash, whether an `@` in a path is
served, and whether the host pattern matches — three facts about somebody else's matcher. A second
implementation of it was refused under [ADR-0026](0026-a-mark-a-sentence-carries-is-parsed-once.md): a copy
of a parser is not a second opinion. What settles them is a request against the real deployment, and
`every-answer-in-the-tree-falls-under-the-rule-for-its-own-endpoint` states only the necessary
condition — if it is red the host certainly does not match; that it is green is not proof the host does.

## What would reopen this

A host that reads a different file, or reads this one differently. A second addressing class, which
would make `cacheControlOf` render something no guard here pins. The declared origin being connected,
which retires nothing — the host rule stops applying by itself — but which makes the deployment worth
indexing and therefore makes `robots.txt` load-bearing for the first time.
