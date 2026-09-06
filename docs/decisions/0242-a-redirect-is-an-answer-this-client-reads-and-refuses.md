---
status: accepted
date: 2026-09-06
governs:
  - packages/cli/http-source.ts
  - packages/cli/serving-over-http.ts
  - mutation/cli-install.battery.ts
  - CLAUDE.md
confirmed-by:
  - battery: cli-install
    guard: a-registry-that-sends-the-client-elsewhere-is-refused-by-name-rather-than-followed
---

# A redirect is an answer this client reads and refuses

## Context and Problem Statement

`fetch` follows a redirect by default. An origin answering 302 sends this client to any host at all, and
the two answers a client cannot check for itself — the catalogue index and the implementation
bindings — are exactly the two that would then come from somewhere nobody named.

It is the robustness note ADR-0206's review left open, because the threat model was committed at
`9942756` before a line of `packages/cli/` was read and declared this out of the hostile set. **ADR-0241
picked it out of eighty-three as one of five worth taking**, and it is takeable where nine others are not
for one reason: four batteries inject into `packages/cli`, so a guard here has a witness.

## Decision Drivers

* **The red first, with its message, and red for the right reason** — because the redirect is followed,
  never because a test server is misconfigured.
* **A refusal is a door and not a wall.** It has to say which origin was asked, where it was being sent,
  and why the client does not follow. `theRefusal` in `where-a-file-may-land.ts` is the precedent.
* **A guard without a witness does not count here**, which this thread has paid for twice.

## Considered Options

* **`redirect: 'error'`**, which the entry names first.
* **Follow, then refuse an answer whose final URL left the origin**, which the entry names second.
* **`redirect: 'manual'`**, which neither named.

## Decision Outcome

### 1. The entry's own one-liner is refuted by the refusal it owes

Measured on node v24.15.0 over two servers, the first answering 302 to the second:

| mode | status | `response.url` | `Location` | body |
| --- | --- | --- | --- | --- |
| default, follow | 200 | **the other origin** | — | `{"from":"somewhere else"}` |
| `redirect: 'error'` | — | — | — | throws `TypeError: fetch failed`, cause `unexpected redirect` |
| `redirect: 'manual'` | 302 | the origin asked | **the destination** | empty |

**Both candidates are one line and only one can say where it was being sent.** `redirect: 'error'`
carries no `Location`, and it throws — so it lands in the `catch` that already exists and the client
would say *did not answer* about a registry that answered. `redirect: 'manual'` leaves all three things
the refusal owes in hand **and never makes the second request**. So the entry's price was right and its
spelling was not.

**Following and reading the final URL is refused for the same reason one floor down**: by the time
`response.url` names another host, the request to it has been made.

### 2. The red, with its message

The guard was written before the repair and run on the unrepaired tree:

    AssertionError: expected [ { method: 'contractIndex', …(1) } ] to deeply equal []

    - []
    + [ { "address": "", "method": "contractIndex" } ]

**That is the defect and not a broken fixture.** The array is the *second* origin's own record of what it
was asked, taken at the wire by `Serving.asked`, and it holds a request the client made to a host nobody
named. The call itself **succeeded**: both servers serve the same imagined source, so a valid index came
back — which is exactly why a guard reading the answer could not have seen this and why the guard is
written on the request instead.

After the repair: **7 of 7** in the file, **197 of 197** in `packages/cli`, `tsc` clean.

### 3. What a person is shown

    http://127.0.0.1:55823/contract-index answered with a redirect to http://127.0.0.1:55822/contract-index
    Nothing in your project was read or changed.
    toopo reads the origin it was given and does not follow a redirect away from it. Two of the answers a
    client cannot check for itself - the catalogue index and the implementation bindings - are the two a
    redirect would fetch from a host nobody named, so the address you gave is the address it reads. Point
    toopo at the origin you meant, or ask that origin to answer this address itself.

Three clauses on `theRefusal`'s shape: what was asked and where it was being sent, that nothing was
touched, and why the tool will not — with the two things a reader can act on at the end. The destination
is named because `manual` is what keeps it, which is the whole of §1.

### 4. The second server was needed, and it cost nothing

**It was priced before it was built.** `servingOverHttp` already argues against a second server for
`misrouted`: *two servers differing in one answer is a copy waiting to drift.* **That argument does not
reach this case and the module now says so**: what a redirect models is *somewhere else*, so the place it
names has to be a different origin rather than a different answer from this one.

**The cost is one more call to a helper that already exists** — no new apparatus, no new file, and the
witness was already there: `asked` is recorded at the wire precisely so that round trips are counted by
the server and not by a client counting its intentions. The first server gained one parameter,
`redirectingTo`, which records the request before answering 302 — so a guard can see that this origin was
asked and the other was not.

### 5. The cell, and what it pins

**`C-88` removes the option rather than the refusal**: `fetch(url, { redirect: 'manual' })` becomes
`fetch(url)`. That restores the state the repair left behind, and it is chosen over deleting the throw
because `TheRegistrySentItElsewhere` would then be an export with no reader — a cell that measures
`noUnusedLocals` on some runs and the defect on others, which is the trap this battery's own header
records for its cache mutants. It pins
`a-registry-that-sends-the-client-elsewhere-is-refused-by-name-rather-than-followed` and nothing else.

**And a cell that already existed had to be moved by hand, which is the third instance of a cost this
list charges at every passage.** `C-72`'s anchor quotes the whole `try` block, so the option landing
inside it took the quoted text to *occurs 0 times, and must occur once* — reported by `npm run anchors`
because it was the `find` half. **Its `replace` half carries the option through** rather than dropping
it, so that cell goes on measuring the transport arm alone instead of reddening the guard `C-88` is for.
Anchors: **939 → 940**, exit 0.

### 6. What one guard cost in accounting

**Four answers for one guard**, which is the entry above it made concrete: `cli-install` injects into
`http-source.ts` and carries the cell; `cli-remove`, `cli-update` and `cli-search` each declare the
folder's HTTP guards out of reach and name them one by one, so each gained a row. The census goes
`packages/cli/http-source.test.ts` **6 → 7** and the README **1001 → 1002** defects and **959 → 960**
caught.

### 7. The limit, declared

**Every redirect is refused, not only one that leaves the origin.** The narrower rule would match the
entry's sentence exactly and would need a same-origin arm with a second message; the destination is named
either way, and refusing all of them is the claim that can be kept. **What it costs is measured rather
than assumed**: the live origin answers `/contract-index`, `/refusals` and `/` with **200 and no
`Location`**, which is ADR-0103's reading of all 76 addresses holding today. The day this catalogue is
served from a host that redirects, this is the line that has to move, and the refusal names the
destination so that whoever meets it knows which.

## Consequences

* **An origin cannot send this client anywhere**, and the two answers no digest covers are the two that
  were exposed.
* **The entry closes**, and it is the first of ADR-0241's five to be taken.
* **`redirect: 'error'` is refused with a measurement**, so the next reader of that entry meets the
  reason rather than the option.
* **A second server exists in this suite for the first time**, with the argument for why `misrouted`'s
  refusal of one does not reach it.
* **Nothing about the archive moves**: `serving-over-http.ts` is apparatus and `packaging/build.ts`
  prunes what the published entry point cannot reach.

## What would reopen this

* **An origin that legitimately redirects.** The refusal is total over 3xx, so a catalogue served from a
  host that answers 301 on a canonical path needs the narrow rule instead — refuse only what leaves the
  origin — and the destination is already named for it.
* **A fifth battery over `packages/cli`, or a fourth that reaches `http-source.ts`.** The declared
  regions name guards one by one, so a battery added owes this guard a row or a cell.
* **`fetch` changing what `manual` gives.** The whole of §1 rests on the `Location` header being readable
  on a 302 under that mode; a runtime that returns an opaque redirect instead would take the destination
  out of the message and leave only the refusal.

## More Information

* ADR-0206 is the review that left this open and the threat model that put it out of scope.
* ADR-0241 is where it was picked out of the open list, with the cost this unit paid measured in advance.
* ADR-0039 is the door-and-wall rule the message is written against; ADR-0208 and ADR-0214 are where
  `theRefusal` took the shape §3 follows.
