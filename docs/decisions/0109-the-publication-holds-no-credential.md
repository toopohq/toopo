---
status: accepted
date: 2026-08-17
decision-makers: Mathis Perron
governs:
  - .github/workflows/suites.yml
confirmed-by:
  - battery: meta
    guard: exactly-one-job-of-this-repository-publishes-to-npm
  - battery: meta
    guard: the-job-that-publishes-to-npm-is-gated-by-the-suites-the-branch-and-the-environment
  - battery: meta
    guard: only-the-job-that-publishes-to-npm-can-mint-an-identity-token
  - battery: meta
    guard: no-workflow-authenticates-to-npm-with-a-long-lived-credential
---

# The publication holds no credential

## Context and Problem Statement

`toopo@1.0.0` was published by hand, from the machine it was written on. Measured at `5130fd5`, by reading
the registry's own record:

```
maintainers   mathis-perron <mathis.perron@hotmail.fr>
_npmUser      mathis-perron <mathis.perron@hotmail.fr>
gitHead       ee4e48531f8c58df6ed8d40eb7923b102327b6e6
dist.signatures  one, the registry's own
dist.attestations  absent
```

**The `gitHead` in that block and the coordinate above it were one commit and are now two.** Both named
`ee4e485…` when this was written. [ADR-0124](0124-the-co-signature-leaves-the-history.md) reissued every
commit of this history, so the coordinate moved with the repository and the transcript did not: npm holds
what npm holds, and this record may not correct another registry's record of its own past. The line is
kept as npm spells it, and it names a commit this repository no longer has.

The last line is the one that matters. A registry signature says *npm served these bytes*; it says nothing
about where they came from. **So the archive a reader installs cannot be tied to the commit or to the run
that built it**, and every other proof in this repository is about exactly that tie: a binding records the
commit it was published from, a contract freezes the files its guards call, and the eighth suite installs
the archive to watch a digest arrive. One floor up, at the point where the product actually reaches
somebody, the chain stopped.

**The second half of the problem is not ours and moved anyway.** npm revoked every classic token on
9 December 2025 and now caps a granular token that can write at ninety days. A secret in this repository's
settings is therefore not a thing one sets up once; it is a thing a person mints again four times a year
from an account, and forgets to on the fifth.

**A third fact was measured while answering a different question, and it belongs here because it bounds
what this decision can buy.** The package has exactly one owner and the organisation has exactly one
member, both the same personal account:

```
npm owner ls toopo                        mathis-perron <mathis.perron@hotmail.fr>
npm access list collaborators toopo       mathis-perron: read-write
npm org ls toopo                          mathis-perron - owner
npm access list packages toopo:developers toopo: read-write
```

The fourth line is the organisation's team holding write access to the package, and the second is the
package's own collaborator list not naming that team. Whichever of the two is the operative one, the set of
humans who can publish `toopo` is one, and it is a personal account. **This decision takes the credential
out of the publishing path; it does not take the account out of the ownership**, and nothing here can.

## Considered Options

- **Keep publishing by hand.** What 1.0.0 did.
- **A granular token in this repository's secrets**, with `--provenance` on the publish command.
- **Trusted publishing**: GitHub mints an identity token, npm exchanges it for a short-lived publishing
  credential and writes the attestation itself.

## Decision Outcome

Chosen: **trusted publishing, from a job of the workflow that already runs everything.**

It is the only one of the three where the bytes published are the bytes a green run built, and it is the
only one where there is nothing to steal. npm generates the provenance attestation without being asked,
which is worth stating plainly: the flag exists for the token route, and passing it here would be a second
statement of something the registry's own configuration decides.

The granular token was refused on the ninety days rather than on the theory. A credential that expires is
a credential somebody renews under time pressure, from the account this decision exists to depend on less,
and the renewal is the moment a secret gets pasted somewhere convenient.

### Why it is a job of `suites.yml` and not a workflow of its own

A publication must not happen from a tree whose suites are red. Inside one workflow that sentence is
`needs:` — a reference to the jobs that actually ran, on this commit, in this run. Across two workflows it
is not expressible at all: `needs` does not reach another file, so a second workflow would have to either
repeat the eight suites — the duplication this repository refuses everywhere — or ask the forge's API
whether some other run was green, which is a second statement of a fact `needs` states exactly.

A reusable workflow was the third shape and npm's own documentation warns against it here: the identity
token names the workflow it was minted in, and a trusted publisher configured for the caller does not match
a claim made by the callee.

**So the file is the one that already knows what green means**, and `needs: site` reaches both matrix legs,
the deployment, and the proof that reaches the origin — which also fixes the order. A client is published
to talk to an origin already serving the revision it was built against, and that is what
`packaging/against-the-origin/` turns into a red.

### The trigger is a word somebody types

The conventions of this repository forbid a tag, so the usual `on: push: tags:` is not available and no
argument had to be had about it. What replaced it is a dispatch carrying an input that must equal
`publish`.

**A checkbox was refused for a reason worth writing down.** A boolean input arrives in a condition as a
value this file has to compare, and a GitHub expression comparing a string to a boolean casts to a number:
`'false'` is a non-empty string, and the arm that reads a refusal as consent is one line away. A string
equality has no such arm, and it happens to be `THE_WRITE_DISCIPLINE` one floor up — a thing that cannot be
undone happens on a second word.

The concurrency group carries the event and a dispatched run is never cancelled, which is the class of
failure this repository already met on a deletion that reported failure: **a cancelled publication is
indistinguishable from one that never happened**, for anybody reading the run.

### The gate has three coordinates and this repository can only keep two

`needs: site`, `github.ref == 'refs/heads/main'` and `environment: npm`. The first two live in a file, and
a file is what a branch may rewrite — so a branch could delete them, and the guards below are what make
that a red before it is merged rather than after it is published.

The third is different in kind. `npm` is a GitHub environment whose branch policy is enforced by the forge
and not by this file, and it is named in npm's trusted publisher — so a run from anywhere but `main` cannot
obtain the token at all. **It is the only half of the branch gate that survives this file being rewritten**,
and it is also the half this repository cannot read.

### What nothing here keeps, stated rather than discovered later

npm's trusted publisher configuration is a declaration of this repository's shape held on somebody else's
server: the organisation, the repository, the workflow filename, and the environment. **Three of those four
are strings that this repository can change on its own** — renaming the workflow file, or the environment,
silently breaks publication — and **npm's configuration carries no branch**, so the environment is doing
work that looks like it is being done by the condition in the file.

**And the environment fails in the invisible direction, which is the worst of the four.** GitHub creates an
environment a job names but that does not exist, *with no protection rules on it* — so a run whose
`environment: npm` was never configured succeeds, npm's claim carries the environment it was told to expect,
and the branch gate that the file leans on is absent while everything reads as configured. There is no
error anywhere in that sequence. It is the same shape as a request that answers about content being asked
about existence: the only thing that settles it is looking at the listing.

Nothing here can read any of it. It is on the list in `CLAUDE.md` of what this repository declares and
nothing keeps, with the price of closing it: an authenticated read of npm's own API, which is a credential
on a runner for a question about not needing one.

### The next version is 1.0.1, and the two versions stay apart

`THE_PACKAGE_VERSION` is *the one field of that file meant to move*, and
`THE_PUBLISHED_IMPLEMENTATION_VERSION` *may never move at all, because a version is half of an
implementation's address*. ADR-0106 cut the tie between them at the publication precisely so that a patch
of the client would not rebind four addresses, and `publication.ts` names this unit as the event it was cut
for — *the correction from CI that is already planned*.

So the next publication is **1.0.1**: the same product, published a different way. Nothing in `dist/`
changes — the workflow, the guards and the records do not ship — and neither MAJOR nor MINOR would be true
of an archive whose code is byte for byte the previous one. What 1.0.1 corrects is not in the code: it is a
publication with no attestation and with a personal address frozen into it, which for a repository selling
auditability is a defect of the artefact rather than of the program. The registry-side fields follow the
account at the moment of sending, so the corrected address arrives with the same publication.

### What has not been measured

**No trusted publication has been made from this repository, at the time of writing, at `5130fd5`.** The
job is written from npm's documented example and its shape is argued above; whether the exchange succeeds
on a first run is not something a green suite here can say, and it is not claimed. The first dispatch is
the measurement, and what it will produce is either a published 1.0.1 carrying an attestation or a red job
naming which of the two configurations disagrees.

## Consequences

- The bytes on npm become the bytes a green run built, from a commit anybody can name.
- No npm credential exists anywhere in this repository's settings, and none needs renewing.
- Publishing gains a prerequisite outside this repository: a trusted publisher on npm and an environment on
  GitHub, both configured by hand, both invisible to every guard here.
- A person who can push to `main` can publish, once those two exist. That is a widening — publishing used
  to need a password and a second factor — and it is deliberate: the gate that replaces them is a green
  matrix, a branch policy, and a typed word.
- The manifest's version and an implementation's version are now visibly separate things, and the first is
  about to move for the first time.

## Confirmation

Four guards in `mutation/workflows.test.ts`, all under `meta`, which by ADR-0001's own division makes them
*guards that run* rather than *guards shown to catch something* — no battery injects into `mutation/`.

`exactly-one-job-of-this-repository-publishes-to-npm` is the one that matters, and it is written first for
that reason: the two guards after it sweep a population found by looking for a publishing job, so deleting
the job would leave both green on a repository that publishes nothing.
`the-job-that-publishes-to-npm-is-gated-by-the-suites-the-branch-and-the-environment` reports the three
coordinates separately. `only-the-job-that-publishes-to-npm-can-mint-an-identity-token` sweeps whole files
rather than jobs, because the line that would do the damage — `id-token: write` at the top of a workflow —
belongs to no job at all and would reach every pull request.
`no-workflow-authenticates-to-npm-with-a-long-lived-credential` makes executable a sentence `CLAUDE.md`
asserted in prose for as long as it happened to be true.

**What they do not establish** is that the publication works, that npm's configuration matches what they
read, or that the environment has a branch policy. All three are on the other side of a boundary this
repository has no way to look across.

## What would reopen this

- npm changing the contract: a fourth required field, a branch condition worth naming, or provenance
  ceasing to be automatic under trusted publishing.
- A second maintainer, at which point the environment's reviewer gate stops being a screen with nobody in
  it and becomes the thing that makes a publication need two people.
- This repository becoming private again. Provenance is not published for private repositories, so the
  attestation would silently stop being written.
- A publication that has to be made from somewhere GitHub Actions cannot reach, which is what would send
  this back to a token and to the argument about ninety days.

## More Information

- [ADR-0098](0098-github-builds-and-uploads-and-what-that-buys-a-secret-with.md) — why this side builds,
  and why every action is pinned to a digest.
- [ADR-0104](0104-the-proof-against-the-origin-lives-where-nothing-replays-it.md) — the proof the
  publication now waits for.
- [ADR-0106](0106-publishing-and-anchoring-are-two-acts.md) — where the two versions were separated, and
  why.
- [Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers) — the supported
  providers, the required fields, and the example this job is written from.
- [Generating provenance statements](https://docs.npmjs.com/generating-provenance-statements) — why no
  `--provenance` flag is passed, and what the repository field has to match.
- [npm classic tokens revoked](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)
  — the ninety days, and the date the alternative stopped being stable.
