---
status: accepted
date: 2026-09-02
governs:
  - packaging/what-the-origin-lists.ts
  - packaging/print-what-a-deployment-would-drop.ts
  - CLAUDE.md
confirmed-by: []
---

# An address the origin serves is not an address the origin lists

## Context and Problem Statement

`CLAUDE.md` has carried an entry since ADR-0188 — *that the address a deployment keeps is the address
a reader gets* — saying that the gate before the deployment compares **two sitemaps** and never asks
the origin for an address. It named a closure and it had no instance. It has one now, and the
instance refutes the closure.

`11e0f54` took this site from seventeen pages to seven. The deployment is correct: asked directly,
`toopo.pages.dev` answers 404 at all ten retired addresses. The declared origin answers **200** at all
ten, from a copy of a page the deployment no longer holds. Every suite was green throughout, the
sitemaps agreed on every push, and the gate printed *this may be deployed* fifteen times.

**The readings are recorded here because they are about to stop being reproducible.** The owner is
switching the responsible zone setting off. What follows was taken at `2ac6803` on 2026-09-02 with a
clean tree, before that happens; after it, none of it can be taken again.

### What the two hosts answer

One `GET` per address, redirects not followed, `curl 8.12.1`. `toopo.pages.dev` is the same
deployment asked without the zone in the way.

| address | `toopo.dev` | `Age` | `Cache-Control` | `X-Robots-Tag` | `toopo.pages.dev` |
| --- | --- | --- | --- | --- | --- |
| `/catalogue/` | 200, 32 489 B | 240 340 | `public, s-maxage=604800` | `noindex` | 404 |
| `/method/` | 200, 182 240 B | 240 340 | `public, s-maxage=604800` | `noindex` | 404 |
| `/what-a-contract-is/` | 200, 32 945 B | 240 323 | `public, s-maxage=604800` | `noindex` | 404 |
| `/refused/` | 200, 29 321 B | 240 339 | `public, s-maxage=604800` | `noindex` | 404 |
| `/typescript/number/` | 200, 20 231 B | 271 731 | `public, max-age=0, must-revalidate` | `noindex` | 404 |
| `/typescript/date/` | 200, 29 866 B | 240 232 | `public, max-age=0, must-revalidate` | `noindex` | 404 |
| `/typescript/string/` | 200, 30 309 B | 240 338 | `public, max-age=0, must-revalidate` | `noindex` | 404 |
| `/typescript/object/` | 200, 20 009 B | 271 731 | `public, max-age=0, must-revalidate` | `noindex` | 404 |
| `/typescript/array/` | 200, 19 898 B | 271 732 | `public, max-age=0, must-revalidate` | `noindex` | 404 |
| `/typescript/array/group-by@1/` | 200, 20 972 B | 271 732 | `public, max-age=0, must-revalidate` | `noindex` | 404 |

**Ten of ten, where the entry's own last reading recorded ten of ten and the one before it nine.** The
seven addresses the sitemap lists were swept in the same minute and are the exact complement: **7 of 7
answer 200 with no `Age` and no `X-Robots-Tag`**, `Cache-Control: public, max-age=0, must-revalidate`,
which is what this repository declares. `cf-cache-status` reads `DYNAMIC` on all seventeen.

**The control is what makes the partition an answer rather than a coincidence.**
`https://toopo.dev/never-served-at-all/` — an address this site has never written — answers **404 with
`no-store`, no `Age` and no `X-Robots-Tag`**. So the fall-through to the deployment works, and what
answers at the ten is something that holds only what was served.

### Three probes that bound what the copy covers

| probe | answer | what it establishes |
| --- | --- | --- |
| `/method/?cachebust=20260902a` | 404, `no-store` | the copy is keyed on the whole address, query string included |
| `/method/index.md` | 404, `no-store` | the Markdown twin of a held page is **not** held, though it was served beside it |
| `/typescript/array/group-by@1/contract-binding` | 404, `no-store` | a named answer of a held address is **not** held |

So what is held is the pages and nothing else — which is the population `sitemap.xml` enumerates and
the population this promise is about. `/contract-index` and `/refusals` answer 200 with no `Age`, but
that says only that the deployment serves them: the copy shows itself when the deployment fails, and
there they do not.

### What this repository writes, and what it does not

`X-Robots-Tag: noindex` is declared in `packages/site/served-headers.ts` for `NOT_THE_DECLARED_ORIGIN`
and for nothing else. The measurement agrees in both directions: on `toopo.pages.dev` it is on all
eleven addresses read, including the live one; on `toopo.dev` it is on the ten and on none of the
seven. **So the header on those ten is not this repository's.**

`s-maxage` occurs **zero times** in the tracked tree — swept over `.ts`, `.json`, `.jsonc` and `.yml`,
exit 1 on the search. Four of the ten carry it anyway.

### The age, across three readings and a purge

| taken at | reading |
| --- | --- |
| `18c0b38`, 2026-09-01 07:26 UTC | ≈132 700 s |
| `ccc9fca`, 2026-09-01 12:17 UTC | 150 267 s |
| `2ac6803`, 2026-09-02 13:49 UTC | 240 340 s |

The elapsed time between the first and third is ≈109 400 s and the `Age` moved by ≈107 600. **It has
counted second for second**, and the owner records that a zone-wide *Purge Everything* did not return
it to zero. A copy a purge does not clear is not the ordinary edge cache, and `cf-cache-status:
DYNAMIC` beside an `Age` of 2.8 days says the same thing from the other side.

## Decision Drivers

- **A reading whose failure mode is a green is not a reading.** `what-the-origin-lists.ts` states it
  about a 404 on the sitemap. It is what this record applies to the proposed closure, one level up.
- **A guard is justified by the event it would catch and by what that event would cost**, never by
  what it finds now — and where the cost is small, that is the argument for not writing it.
  `CLAUDE.md`, verification discipline.
- **A report may state what it observed and may not name a cause it did not measure.** ADR-0042.
- **An entry can be false without being stale.** Rule 3 of the open list. An entry written from an
  assumption about where the fault would arrive is wrong on the day it is published and looks no older
  for it.
- **A finding rather than a failure leaves a sentence and not a stack.**
  `print-what-a-deployment-would-drop.ts`, in its own words, about its own exit code.

## Considered Options

1. **One `GET` per listed address before the deployment, blocking.** The closure the entry names.
2. **One `GET` per listed address, printed and not blocking.**
3. **A register of retired addresses, checked at every push for as long as it exists.**
4. **Nothing executable: the record, and the two published sentences the instance made false.**

## Decision Outcome

**Option 4**, and the first three are refused on measurements rather than on price.

### Option 1 is green on this instance, which is the finding of the unit

The closure the entry proposes reads *one request per listed address*. **The origin lists seven**, and
those seven are the seven this tree writes, every one answered by the deployment with no `Age` and no
`noindex`. The ten that diverge are outside that population **by construction**: an address stops
being listed on the very push that stops writing it, which is the same push after which it starts
being wrong.

So the entry named a closure, waited a week for an instance, and the instance landed in the half the
closure does not reach. That is not a slip in the arithmetic — the entry states both directions
plainly, *the benign* (an unlisted address still answering) and *the dangerous mirror* (a listed
address that stops answering), and then names one closure, which covers the mirror. **The instance is
the other one.**

The mirror is real, and a reading over the seven would catch it. It is not written here, for two
reasons that are not price: it would land in a unit whose subject is the direction it does not cover,
and a reader meeting it beside this record would take it for the closure of this entry.

### Option 1 would also have blocked fifteen deployments, none of which was wrong

Blocking is what makes the difference between a gate and an alarm, and the figure is available.
`11e0f54` was deployed by the run of 2026-09-01 07:26 UTC; from that run to this reading, **`main` has
been pushed fifteen times, fourteen concluded green and one in flight**. Every one of those trees was
correct, and every one would have been refused by a gate reading a state no commit reaches.

**A red no commit repairs is not a fault of the commit that meets it.** The gate's exit code is
already reserved for the one condition a commit does repair — this tree ceasing to write an address a
contract was published at — and the file says why in its own words. An archived copy is a fact about
the zone. Putting it in the exit code would put the deployment of every future unit behind a dashboard
switch, and an alarm in the path of a deployment ends up routed around.

### Options 2 and 3 buy a line nobody can act on

Printing it is cheaper and is refused for a different reason: the reading would be **green**. The
seven listed addresses all answer. A per-address reading prints seven confirmations and says nothing
about the ten, so what it adds to the run log is the appearance of coverage.

A register of retired addresses would have the right population and nothing bounds it: it grows with
every page this site ever retires, every row of it is red until somebody changes a setting in a
dashboard, and no row of it is ever repaired by this repository. That is the git walk ADR-0125 priced
and refused, with a ledger in front of it.

### And the condition is not reachable once the switch is off

`CLAUDE.md`'s discipline is that a guard must be seen red on its real failure condition. The real
failure condition here is *the zone serves a copy of an address the deployment does not hold*, and it
ceases to exist the moment the setting is turned off. A guard written today could be seen red today
and never again — born into a state nobody can restore from this repository, aimed at an event only
somebody else's dashboard can produce. **That is a guard aimed at nothing wearing the shape of one
that fired.**

### What is repaired is two published sentences the instance made false

Both are corrections of prose against a measurement, and neither is a guard.

`print-what-a-deployment-would-drop.ts` ended its clean verdict on *and every address the origin
**serves** is still one of them*. The reading behind it is `theAddressesTheOriginLists`; the noun in
the verdict was the wrong one, and the two parted by ten. It reads *lists* now. **ADR-0125's
transcript of that line is left as it was taken**: it is a run somebody performed at a commit, and
editing a transcript to match today's program makes it the record of a run nobody performed.

`what-the-origin-lists.ts` argued that the sitemap is the only listing there is, on the ground that
*every other address answers about itself, so a 404 there says what is absent now and never what was
present before*. That sentence anticipated a per-address request **under-reporting**. The measured
failure is the other one — a 200 there is what was present before — and the module now carries it,
beside the reasoning it qualifies, so the next person to reach for the per-address closure meets the
measurement rather than reinventing it.

### The cause, and the half of it that is not established

**Established.** The response does not come from the deployment: the same tree answers 404 at all ten
addresses on `toopo.pages.dev`. It carries a header this repository writes only for hosts that are
*not* the declared origin, and which the seven live pages do not carry. Four of the ten carry a
directive that occurs nowhere in this tree. The copies are raw — nothing in the served body rewrites a
link or names an archive, and `/method/` still links to `../catalogue/`, a page retired in the same
commit — so they are copies of a real past deployment. Their `Age` counts continuously and survived a
zone purge. **Something between the deployment and the reader holds copies of pages that were served
and answers with them when the deployment 404s.**

**Not established: that the mechanism is the feature named Always Online.** The shape matches its
documented behaviour and it is the only Cloudflare feature I know with this shape, and neither of
those is a measurement. No response header names a feature. The Wayback Machine's availability API —
which would have identified the source, Always Online being served from the Internet Archive — refused
both requests with **429**, so that route was attempted and produced nothing. What would establish it
is a reading of the zone's own settings, which is the owner's and not this repository's. It is
recorded as a correlation, in the terms ADR-0042 sets.

**One consequence is named and unmeasured rather than claimed.** If the copy answers whenever the
deployment fails, then a deployment that broke on a *live* contract address would be answered from the
copy, and `packaging/against-the-origin/` — which runs after the upload against `THE_ORIGIN`, measured
as `https://toopo.dev` — would read a 200 where the deployment gives a 404. Testing it requires
breaking the deployment, which this unit may not do. It is written down as untested.

### The fourth instance of the gap `wrangler.jsonc` records

That file says of the custom domain that it is *a gap in this file's own claim to hold every
decision*. The instances, counted:

1. the custom domain itself, attached in a dashboard and in no file here;
2. the four hours a returning reader holds a module for — declared `max-age=0` by this repository and
   answered `max-age=14400` at the zone;
3. that reading an address one at a time means interpreting `Age` and `cf-cache-status`, which are
   facts about the zone;
4. **this** — the zone serving a copy of a page the deployment does not hold.

The fourth is not the third restated: the third is about what it costs to *read* the zone, and the
fourth is about what the zone *serves*. **It is the first of the four this repository met as a defect
rather than recorded as a limit**, and it is the first that a reader could meet, which is what
separates it from the other three.

### What a reader was actually served, which is the smallest part of this

For roughly thirty hours, somebody following an old link to one of ten retired pages met a stale page
marked `noindex` instead of the 404 this site writes. Nothing a contract is bound to moved: the named
answers, the bindings and the blobs are the deployment's, measured. `pnpm run freeze` is green either
side of this unit and no digest moves. **The promise was over-kept, not broken** — and the entry is
open because the mirror of that is what the mechanism exists to prevent.

## What would reopen this

- **A reading that shows the copy answering at a *listed* address.** That is the dangerous mirror with
  a witness, and it turns option 1 from a closure aimed at the wrong half into a repair with an
  instance. Nothing here can produce one without breaking the deployment.
- **A zone whose settings this repository can read.** The refusal above rests on the condition being
  unreachable from a commit; a declared, readable zone configuration makes it reachable and makes a
  guard over it a guard with a population.
- **A second site page retired while the setting is still on.** It would say whether the copy is taken
  at retirement or on a schedule, which no reading here separates: the two `Age` clusters, ≈240 300 and
  ≈271 730, are 8.7 hours apart and this record does not know why.
- **The owner turning the setting off.** It closes the instance and leaves the entry open, because
  nothing in this repository would notice it being turned back on.

## More Information

The readings were taken with `curl` against the live origin and against `toopo.pages.dev` in the same
minutes on 2026-09-02, at `2ac6803` with a clean tree. `git rev-list --count 11e0f54..2ac6803` answers
43, and the fifteen pushes are the runs `gh run list --branch main` names between the one whose head
is `18c0b38` and the one whose head is `2ac6803`, inclusive — a range rather than a count, because a
count of that listing grows with every push after this one.

ADR-0125 is the gate and the argument that a listing answers about existence where a request answers
about content. ADR-0188 narrowed what the gate refuses to the addresses a contract was published at.
ADR-0189 retired the ten pages. ADR-0103 carries what the declared origin serves and the two headers
this repository does not decide. ADR-0170 is the four hours, which is the third instance's neighbour
and the second instance itself.
