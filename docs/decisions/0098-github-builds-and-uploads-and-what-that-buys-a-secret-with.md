---
status: accepted
date: 2026-08-16
governs:
  - .github/workflows/suites.yml
confirmed-by:
  - battery: meta
    guard: every-action-a-workflow-uses-is-pinned-to-a-digest
  - battery: meta
    guard: every-pinned-action-says-which-version-it-was-pinned-at
  - battery: meta
    guard: there-is-a-workflow-to-sweep-and-it-uses-something
---

# GitHub builds and uploads, and the secret that buys

## Context and Problem Statement

[ADR-0097](0097-the-deployment-is-configured-in-this-repository.md) put the deployment's configuration
into this repository and said nothing about who runs the build. A Cloudflare project was connected to
the repository, its first build failed, and it was then deleted — nothing had ever been served, so
nothing was lost, but the question of which side builds was still open and had never been decided on
evidence.

Two ways:

- **Cloudflare builds.** The service clones the repository, runs `pnpm run site:build`, deploys.
- **GitHub builds and uploads.** The workflow that already runs the seven suites gains a job that
  builds the site and sends it to Cloudflare. An API token enters this repository's secrets.

**The thing that decides it is a risk this repository named before either was chosen.**
`packages/site/build.ts` calls `theRevision`, which refuses a working tree disagreeing with its commit
and asks git for the head. A build is therefore either reproducible from the revision it stamps or it
does not happen — which is the whole of what makes a durability anchor worth carrying.

**When this decision was taken, whether a runner's checkout satisfies that had not been measured on
either side, and the seven green suites did not measure it.** That was checked rather than assumed:

```ts
// packages/registry/revision.test.ts:26
repository = mkdtempSync(join(tmpdir(), 'toopo-revision-'))
```

Every guard over `theRevision` runs against a temporary repository built for it, deliberately — *asking
this working tree would answer whatever the run happens to be at*, and the claim worth keeping is that a
dirty tree is refused, which needs a tree that can be dirtied. So the suites say nothing about the tree
they ran in, and neither option is proven.

## Considered Options

- Cloudflare clones and builds.
- GitHub builds and uploads with `cloudflare/wrangler-action`.
- GitHub builds and uploads by calling `wrangler` directly.

## Decision Outcome

Chosen: **the third**, as a second job of the existing workflow, gated on the suites passing.

Neither environment is proven, and the asymmetry is what decides: **only this one can be measured
before anything is served.** Cloudflare's build image documentation says nothing about whether `.git`
survives into the container; a failure there is a failed deployment. Here the environment is declared
in a file of this repository, a failure is a red branch, and the first thing the job does is print
`git status --porcelain` — so the unmeasured risk becomes a line in a log with nothing served.

The same argument answers a second unknown at no extra cost. Whether a deleted Worker frees its name is
not documented — Cloudflare's API covers deleting a subdomain route and deleting an account subdomain,
not name reuse — so it is not asserted here. It will be answered by the first real `wrangler deploy`,
in a log that is read, rather than by a state that is discovered.

`cloudflare/wrangler-action` was refused for one reason: it is a fourth third-party action in the chain
that deploys, and `wrangler` is already a dev dependency pinned by the lockfile. Calling it directly is
one dependency fewer between a commit and what gets served, and it needs nothing the action provides —
the two credentials are environment variables wrangler reads on its own.

### What the refused option offered, which this one gives up

**Cloudflare building stores no secret in this repository at all.** The service pulls; nothing is
pushed, so there is no long-lived credential anywhere in the repository or its settings. That is a real
advantage and it is the only dimension on which the refused option is better. It is written here rather
than left out, because a reader arriving later must be able to find what was traded, not only what was
chosen.

It also gave up per-branch preview deployments, which that service provides without anything being
written, and build logs attached to the deployment in its own interface.

What is bought with the secret is the thing above: a risk that can be measured with nothing served.
The trade is *one stored credential against one measurable failure*, and it was taken on the second
because a deployment is what freezes an address, and this catalogue's addresses are frozen for life.

### The cost of the secret is paid in the same change

A token in this repository's secrets is readable by whatever the workflow runs, and the workflow ran
three third-party actions by mutable tag — `actions/checkout@v7` and two others. A tag is a pointer the
other side can move, after which this repository runs code nobody here has seen on a runner holding
that token. **It is the defect this catalogue refuses one floor down and sells the refusal of**: a name
resolves to whatever the other side currently says it resolves to, and only a digest is an address. The
lockfile pins every npm dependency by integrity hash; the workflow pinned nothing.

So all six references are digests now, and `every-action-a-workflow-uses-is-pinned-to-a-digest` sweeps
the folder rather than a list — a workflow added is swept by existing. **The guard and the thing it
guards are one change**, which is the rule `CLAUDE.md` states about a declaration and the mechanism that
keeps it, and it is why this is not an entry on the open list: an entry that is born closed is noise.

A digest with no version beside it is unreadable, and an unreadable pin is one nobody raises, so a
trailing `# v7` is required too. It is checked for being present and never for agreeing with the digest:
agreement is a question only the other repository can answer, and a guard comparing them would be
reading a comment as though it were data.

## Confirmation

The three guards in the front matter. **They were red on the repository itself before anything was
changed**, which is stronger than a mutant: `every-action-a-workflow-uses-is-pinned-to-a-digest` named
all three unpinned references at `suites.yml:104`, `:110` and `:112`, and the second guard named the
same three as saying nothing about their version. No defect had to be injected, because the defect was
committed.

`there-is-a-workflow-to-sweep-and-it-uses-something` is what stops the other two passing over an empty
set: a folder that stopped being read, or a pattern that stopped matching, would make both green while
sweeping nothing.

### And the unknown this decision was taken over is now measured

The job ran on `d20f7f1`. Between the `git status --porcelain` step and the build that follows it the
log carries **nothing at all** — the tree was clean after `actions/checkout` and
`pnpm install --frozen-lockfile`, so `.git` reaches the runner, git answers there, and `theRevision`
names the commit rather than refusing:

```
served from d20f7f1fb55e625d7cc51234e120a1bb7f0c7a38
1055466 B  75 files: 7 pages, 7 markdown, 9 modules, 4 found by convention, 48 answers
```

The revision stamped is the commit that was pushed, and the tree written on the runner is the tree
written locally, `_headers` included. **The risk this decision was taken over is closed for this side
and remains open for the other**, which is exactly the asymmetry it was taken on: the answer arrived in
a log, on a branch, with nothing served.

What it does **not** establish is anything about Cloudflare's container. That option was not tried and
its environment is still undocumented, so nothing here says it would have failed — only that it could
not have been asked before deploying.

## What would reopen this

A build environment that can be measured on the other side — Cloudflare documenting what its container
holds, or answering it in a log this repository can read — which would remove the whole argument and
leave the stored secret as a cost with nothing bought.

A second consumer of the token, which would widen what a moved action could reach and make the pinning
guard the only thing standing between a tag and a credential rather than one of two.
