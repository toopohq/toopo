---
status: accepted
date: 2026-09-06
governs:
  - CLAUDE.md
confirmed-by: []
---

# The open list is eighty-three entries, and a third of it is takeable

## Context and Problem Statement

Nobody has ever sorted the open list. It was read once, at ADR-0167, by asking of each entry whether a
reader meets it; it has never been sorted by whether an entry **can** be taken.

**The population was wrong in both directions before it was measured.** The sweep in front of this unit
was *lines opening with `- **` between the section's two headings*, and it answers **92**. Measured, that
count holds **11 closures** — the list of entries that closed, each ending *— ADR-XXXX* — and misses
**2** entries that open with a backticked identifier. It also correctly holds the 2 open entries standing
above the *Still open* subheading. **92 − 11 + 2 = 83.**

That is the same defect ADR-0167 recorded on the same list — *the population was 56 and the marker count
said 50* — arriving on a different marker seven months later. **Nothing keeps a population read off a
marker**, and this is its second instance.

**Nothing is taken here.** No entry is closed, no repair is made, no guard is added or modified, the
ledger reads `18cc4e82…` on both sides.

## Decision Drivers

* **Takeable comes first, not last.** This repository has refused three entries in a row not on their
  value but on the witness: a guard no battery can redden is not a guard. Sorting by value first sorts a
  set half of which cannot be acted on.
* **A verdict read off a headline is wrong about one in six** until the block is read — measured at
  ADR-0228 over nineteen claims. So the depth of this reading is declared rather than implied.
* **A partition announced partial is worth more than a list announced closed**, which is this list's own
  standing lesson about itself.

## Considered Options

Not applicable: nothing is chosen here. What is decided is the **shape of the reading** — three filters
in the order the takeability question forces — and what it may be believed for.

## Decision Outcome

### 1. The population is 83, and how it was delimited

The section holds three different things, and the marker does not separate them. **Measured at
`5fa5de8`**, which is the tip this reading was taken on:

| region | lines at `5fa5de8` | top-level bullets |
| --- | --- | --- |
| the preamble | 1831–1925 | 0 |
| **the entries that CLOSED** | 1926–2297 | 28, of which 11 open bold and are closures |
| the 2 open entries above the subheading | within that region | 2 |
| **Still open** | 2298–5623 | 81 — 79 bold, 2 backticked |

**83 entries over 3 429 lines of prose**, the longest 281 lines and the shortest 3.

**The coordinate is not decoration here, and this unit is what proves it**: the paragraph this record
adds to `CLAUDE.md` sits at line 1871 and moves every boundary below it by **15**, so the four ranges
above are false of the commit that publishes them. The counts are not — 83, 28, 11, 81 — because they are
properties of the list rather than of the file's geometry. A first version of the probe held two of these
line numbers as literals and silently read fifteen extra lines into the first entry, which is the same
trap one level down.

### 2. Filter 1 — takeable, and the witness is what decides it

| verdict | count | what it means |
| --- | --- | --- |
| **TAKEABLE** | **27** | the repair lands where a battery already injects, or is an ordinary edit |
| tool | 29 | it needs a tool this repository has refused — a headless browser, a bundler apiece, a YAML parser, or the validation stage reading prose |
| shut | 14 | no mechanism can close it: permanent rule 6, or an unobservable population |
| witness | 9 | the repair would be a guard born in the meta suite, which no battery injects into |
| elsewhere | 4 | the act is not this repository's: an owner's ruling, a zone setting, npm's or GitHub's side |

**Two thirds of the list cannot be acted on today, and the largest single reason is one refused
design.** Twenty-nine entries wait on *a validation stage reading this repository's own strings* or on a
headless browser — both refused repeatedly and on measurements — so **the list's biggest lever is one
decision and not thirty units**.

**Nine entries are blocked by the witness alone**, which is the mechanism ADR-0230 and ADR-0240 both
refused a guard on. A battery able to redden a guard of the meta suite would move nine entries from
un-takeable to takeable in one act — more than any other single change available.

### 3. Filter 2 — the eighth contract retires almost nothing, and arms six

| verdict | count |
| --- | --- |
| untouched | 76 |
| **armed** — the event is what the entry is waiting for | **6** |
| premature — better taken after the event | 1 |
| moot — the event makes it pointless | **0** |

**Nought entries are made pointless**, which refutes the expectation this filter was written against.
Six are *armed*: an eighth contract or Node 26 on the matrix is the event they exist to catch — the
catalogue's alphabet, the unread frozen fields, a citation inside a frozen file, what a declaration may
name, the playground's bound, and the divergence replay. **Taking those before the event is what they
are for**, not waste. One is premature: the bound on what a client may read should be set after the
contract that may cross it, not before.

### 4. Filter 3 — who it reaches

By ADR-0167's own rule, unchanged so the two readings are comparable: a reader visits `toopo.dev`, runs
`npx toopo`, installs the archive npm serves, or fetches an answer from the declared origin — never
somebody who reads this repository.

| | count |
| --- | --- |
| a user | 34 |
| a contributor | 14 |
| repository hygiene only | 35 |

**Crossed with filter 1, the actionable set is 26**, of which **14 reach a user**, 5 a contributor and
7 nothing but hygiene.

### 5. The five worth most, each with a cost measured rather than estimated

**1. That the manifest declares no dependency the product could reach.** Measured: the published entry
point `packages/cli/published.ts` reaches **41 source modules** through `closureFrom` + `sourceNamedBy`,
which already exist; their only bare specifiers are `typescript/unstable/sync` and
`typescript/unstable/ast`, one package, and the manifest declares that one package. **The guard is born
green.** What it buys is that the day somebody moves a package from `devDependencies` to `dependencies`,
every consumer installs it — and `files: ["dist"]` does not bound that field. **The entry calls it *one
file, the cheapest entry on this list* and the measurement corrects that by half**: the walk is free and
the reader is not. An unanchored pattern for a bare specifier returns **four phantom packages**, matching
the word `from` inside prose; `specifiersIn` escapes this for free because all three of its patterns
require a leading dot, and a bare-specifier reader has no such anchor. Seen by: **a user**, on every
install.

**2. That the deployment waits for what the instrument says.** Measured on run `34018431616`: `site`
deployed at `07:15:11` and `batteries (site)` finished at `07:45:01`. **The deployment landed 29 min
50 s before the battery that answers for the commit it deployed.** The entry prices its own closure at
*a `needs` edit and a minute of critical path per push*, and that is **refuted**: `every-job-answered`
already ends the run at `07:45:08`, so adding `batteries` to `site`'s `needs` costs the run **nothing**
and costs the deployment **the whole of the slowest selected battery** — half an hour here, and up to the
79-minute bound on a push that selects `registry-storage`. So the price is deployment latency and never
critical path, and the trade is legible for the first time. Seen by: **a user**, who meets a page from a
commit whose battery is red.

**3. That every path this catalogue serves is a path the confinement admits.** Measured: the catalogue
serves **11 distinct paths** — 9 declared file names and 2 shared — and `A_PATH_INSIDE` admits all
eleven. **Born green**, one expression over `theCatalogue`, in a folder batteries inject into. Its event
is the eighth contract or the day `referenceImplementationOf`'s filter opens, and what that event costs
is an install that refuses a contract nobody can see is wrong. Seen by: **a user**, at install.

**4. That the revision an installed client records is a commit this repository holds.** Measured:
`git ls-remote origin HEAD` answers in **473 ms**, inside the one suite here that already reaches the
network. The entry's price was *a network dependency **and** a private repository, which means a
credential*; the repository is public, so **half the price has already lapsed** and the entry says so
without acting on it. What it buys: an origin serving `0000…0000` is indistinguishable from one serving
the truth today. Seen by: **a user**, in their own lockfile.

**5. That a request this client makes stays on the origin it was given.** Measured: **one** `fetch(` in
`packages/cli/http-source.ts`, at line 154, with no options — so `redirect: 'error'` is one line. The
rest of the price is a sentence for the refusal and a guard needing a second server, in a folder four
batteries inject into. Seen by: **a user**, and it is defence in depth rather than a hole, which the
entry already says.

### 6. What should never be taken

Four entries are true, will stay true, and buying them buys nothing. Each is named by its own text.

* **The composition of a mutant cell's run.** Refused on the argument with the price published *so the
  argument is the thing anybody has to answer*, and measured at **zero reachable instances** over 685
  mutant-arm pairs. The entry exists to stop the next session re-proposing it, which it has already
  failed to prevent once.
* **A reproduced miss rate that disagrees with what the runs show.** *A measurement that enters no
  decision is not bought at any price* — its own rule, and it costs about an hour and a half. It becomes
  takeable the day the factor decides between two repairs, and not before.
* **The gate on the publishing job is a conjunction.** Refused on the price rather than overlooked: a
  widened gate makes every push reach `npm publish` and be refused on a version npm already holds, so
  **the failure announces itself on the next push**. A guard whose event is that cheap is one this
  repository states the argument against writing.
* **The reading of who has read this repository's prose.** ADR-0112 refuses the guard because its
  cheapest satisfaction is a whitespace reflow, and the residue is 438 `git blame` child processes for a
  step nobody reads.

**And four more are facts filed as entries rather than debts**, which is a different thing and worth
separating: the divergence debt `contractAnatomy` records, a profile's name being true of its own
samples, `CLOCK_DEPENDENCE_RULE`, and the alias rule whose own text says *the entry asks for nothing*.
Each is unclosable by permanent rule 6 or by being a reader's judgement. **They are not occupying a place
wrongly — they are the list doing what it says it is for**, recording a declaration nothing keeps. What
would be wrong is reading them as work.

## Consequences

* **The list is 83 and was believed to be 92**, and the eleven-entry error is a closure list read as open
  work.
* **27 entries are takeable and 26 of those are not premature**, so a third of the list can be acted on
  and two thirds cannot.
* **One decision moves 29 entries and one mechanism moves 9**: the validation stage over this
  repository's own strings, and a battery able to redden a guard of the meta suite. Nothing else on the
  list has that leverage.
* **The eighth contract retires nothing and arms six**, which is the opposite of what the filter expected.
* **Five entries have a measured cost**, and two of those measurements corrected the entry they were
  taken on — the manifest guard's *cheapest on this list*, and the deployment gate's *a minute of
  critical path*.

## What would reopen this

* **A full reading.** This partition is built on each entry's own closure sentence — **416 lines of the
  3 429 the list holds** — and on the five entries read whole to cost them. ADR-0228 measured that a
  first verdict is wrong about one in six until the block is read, so **about a dozen of these 83
  verdicts should be expected to move**, and the entries in §5 and §6 are the ones read closely enough to
  stand.
* **A battery that can redden a guard of the meta suite**, which moves nine entries at once and is the
  single highest-leverage change the list contains.
* **A ruling on the validation stage over this repository's own strings**, which moves twenty-nine.
* **An entry added or closed.** The partition is a reading at one commit and nothing holds it to the
  list, exactly as ADR-0167 recorded of its own.

## More Information

* ADR-0167 is the first reading of this list and the source of filter 3's rule; its population error is
  the same shape as this one's.
* ADR-0230 and ADR-0240 are the two refusals on the witness that make filter 1 first rather than last.
* ADR-0228 measured the one-in-six rate this record's limit is stated against.
