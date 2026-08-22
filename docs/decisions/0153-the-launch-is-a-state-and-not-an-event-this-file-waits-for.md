---
status: accepted
date: 2026-08-22
decision-makers: Mathis Perron
governs:
  - CLAUDE.md
confirmed-by: []
---

# The launch is a state, and not an event this file waits for

## Context and Problem Statement

`CLAUDE.md` is the first thing every session reads, and the heading of its longest section read
`## What the repository declares and nothing keeps — closes before the launch`. Measured at
`f776a43`, over the top-level list items under that heading and excluding the fourteen recorded
closures: **forty-eight entries**, two of which the section marks as not of its own class and
forty-six of which stand under *Still open*. The clause after the dash gives every one of them a
deadline.

There is no event the deadline names. The manifest declares `toopo@1.0.4`, npm holds it, the origin
serves six contracts and the client installs from it. The owner's decision is that this is the
project's state rather than a milestone ahead of it: *the project is online and usable, it is already
launched; now it is maintained and what is missing is added.*

**The defect is not that a sentence is stale.** It is that the condition sits in a *heading*, so it
is read as a disposition for the whole list before a single entry is read. A list of shipping
blockers and a maintenance backlog are not the same object and are not prioritised the same way, and
every unit opened here inherited the first reading.

## Decision Drivers

- A heading is an address, and [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md)
  settles that an address may not render the data it addresses.
- `CLAUDE.md` is present tense by construction and a record is dated by construction —
  [ADR-0062](0062-the-opening-is-a-state-and-the-history-is-the-log.md).
- The triage is line by line, on
  [ADR-0142](0142-a-fixture-stands-where-the-catalogue-cannot-go.md)'s test: a rename may move a name,
  it may not move a reading.
- The entries are not this unit's business. Their content and their order are unchanged.

## Considered Options

- Leave the heading and repair the entries under it.
- Replace the condition with a truer one — `— closes as maintenance`, `— no deadline`.
- Drop the condition, and move the disposition into a paragraph where it can be argued.
- Sweep every occurrence of the word `launch` in the tracked tree.

## Decision Outcome

**Chosen: drop the condition.** The heading becomes `## What the repository declares and nothing
keeps`, and what the clause was doing moves into a paragraph under it.

### The clause is dropped because nothing was ever using it

`git grep -a 'declares and nothing keeps'` at `f776a43`, over the tracked tree, returns the heading
and **nineteen citations besides it**: sixteen lines across thirteen records, two in
`mutation/history.ts` and one in `mutation/workflows.test.ts`. **Every one of the nineteen names what
the list is; not one names when it closes.** The half that did a year of work was never the
conditional half, so removing it breaks no citation and costs nothing anybody wrote.

### Why the replacement is nothing rather than a better condition

A truer clause is the obvious repair and it repeats the mechanism. **Any condition written into a
heading can expire, and it expires silently**, because a heading is read as a label — nothing about
it looks old, which is exactly how this one survived the publication that falsified it. ADR-0017
states the rule about a case identifier: falsifying the name and reddening the guard are the same
event, or they are not. This is that rule one floor up, applied to prose for the first time here.

The disposition is now a paragraph, where it carries its argument and its coordinates. That is what
`CLAUDE.md` requires of every claim inside it, and what it had never required of its own headings.

### The population is wider than the word, and part of it is not prose

`git grep -ain launch` over the tracked tree at `f776a43` returns **50 lines**, six of them in
`CLAUDE.md`. A second sweep over thirteen further
phrasings — `ship`, `go live`, `day one`, `not yet public`, `no users`, `while nothing is published`,
`answerable in private`, `before anybody`, `until it is public`, `once we`, `the doors` among them —
added the *while nothing is published* family in three records and nothing else conditioned on this
event.

**A deferral in this repository can be data rather than prose, and a sweep over text would not have
reached one.** `DeferredEndpoint.until` in `packages/registry/read-api.ts` and `DeferredNeed.until`
in `packages/site/source.ts` each carry an observable event, declared precisely so that a thing left
unbuilt names what would change that. Read at `f776a43`: `NOT_THIS_UNIT` is **empty**, and
`NOT_ANSWERED` carries one entry, `attestations`, waiting on *one snapshot of this catalogue is
signed*. **Neither waits on the launch.** That is a negative, and it is published because nothing in
a reading of the prose could have established it.

### Three senses of the word, and only one of them conditions anything

1. **A launcher.** `run-vitest.ts`, `vitest-entry-point.ts`, `mutation/instrument.test.ts`,
   ADR-0053 and ADR-0056 — and `publication.ts`'s *a publication instant read from a clock would
   differ on every launch*, which is every run of a process. Not this word.
2. **The closed launch**, meaning the phase in which the founder writes everything and no contract
   has a second implementation. `implementation-record.ts`, `implementations.test.ts`,
   `the-sixth-contract.test.ts`, and ADR-0063's own title. **That state holds today**, so those
   sentences describe the present and are kept. `contract-page.ts`, `source.ts` and `style.ts` use
   *the launch* the same way, as the name of the catalogue's current configuration rather than as a
   moment.
3. **Before the launch, after the launch.** A gate or a deferral on a moment. **This is the whole of
   what is repaired**, and in the working tree it is **five lines across four clauses, all of them in
   `CLAUDE.md`** — five of the six that file carried. The sixth names *the decision to launch at
   five*, which is a decision that was taken and reads as one.

The false positive worth naming is `CONTRIBUTING.md`: *it is worth knowing before you launch rather
than after* is about launching a replay, and a sweep would have taken it.

### The four clauses

| Where | What it read | What it became |
| --- | --- | --- |
| the heading | `— closes before the launch` | removed |
| the paragraph under it | a declaration *decorative at launch* | *decorative on the day a version is published* |
| rule 1 | `number/round@1` … *published … before the launch it names* | removed, and it was false — below |
| rule 1 | *the showcase domain moves to after the launch* … *the known debts close before the launch, not after* | the condition is met, and the passage says so |

**One of the four was false about its own order, and nobody had checked.** Rule 1 read that
`number/round@1` was *published after that line was written and before the launch it names*.
`number/round@1` was published on 2026-08-20
([ADR-0143](0143-the-decimal-the-caller-wrote-and-not-the-double-the-machine-stored.md)); `toopo@1.0.0`
reached npm on 2026-08-17 ([ADR-0109](0109-the-publication-holds-no-credential.md)). **The contract
that sentence placed before the launch arrived three days after it.** It was written as a clause about
an announcement nobody had scheduled, and read against the launch as a state it is simply wrong —
which is `CLAUDE.md`'s own rule 3 for this list, arriving on the region that carries the list's
heading: an entry can be false without being stale, and nothing about it looks old.

That paragraph carried **two hands** before this unit, so a patched clause would have made it three
and crossed the threshold [ADR-0112](0112-the-prose-that-no-commit-authored.md) watches. It is
rewritten whole, which is what that record asks for and not a reflow performed to satisfy a counter:
the passage's entire conditioning changed.

### Every record keeps, and the reason is not that it is a record

Seven lines in the records are conditioned on this event: ADR-0013's *It does not close before the
launch*, ADR-0062's *a dozen units remain before the launch* and *the last thing before the launch
that is design work*, ADR-0091's *That is the whole reason this is done now rather than after the
launch*, and the *while nothing is published* clauses of ADR-0044, ADR-0048 and ADR-0125.

**Each was triaged on ADR-0142's test — would replaying this produce this text? — and each is a
statement true on the day it was written.** ADR-0091's is the clearest, because it is a measurement
and not a plan: *`private: true` holds, the package is not on npm, and nothing is published*. Every
clause of it was read rather than assumed, and editing it would turn it into a transcript of a state
nobody observed.

**They are kept as a conclusion reached seven times and never as a rule that records are exempt**,
because the same test runs the other way elsewhere: ADR-0142 renamed nine fixtures across ten records
and left one passage alone, on this exact test. Here it points at *keep* seven times out of seven.

**What that costs is stated rather than smoothed.** A reader landing on ADR-0013 today meets *It does
not close before the launch* with nothing beside it saying the launch has happened. That is the price
of a record being a photograph, and this repository has already paid it by design: `CLAUDE.md` holds
the state, a record holds the measurement, and where the two disagree the record holds the
measurement and `CLAUDE.md` holds nothing. What this record adds is that the seven are **named**, so
a reader who follows a citation into one of them has somewhere to resolve it.

### Nothing keeps this, and the guard is refused rather than unbuilt

**There is no guard in this unit and there is no red to show.** The class — a sentence conditioned on
an event that has since happened — is the one `CLAUDE.md` already prices under five separate entries
as *the validation stage reading this repository's own strings*, and refuses each time as a lint over
prose. A guard for *the word `launch` inside a heading* is word-matching, which is the form ADR-0023's
alias rule was refused at, and this unit's own sweep is the argument: of the 50 lines carrying the
word, five were the defect.

**What is done instead is a shape rather than a guard**, which is the treatment `publication.ts` gives
the publication epoch: the repair removes the claim instead of restating it truly. A heading carrying
no condition has nothing left to expire. The paragraph that replaced it makes one claim — that the
product is running — and it is written against the manifest, npm and the origin rather than against an
event, so falsifying it would mean unpublishing a version, which permanent rule 6 and npm both refuse.

**No entry is opened on the list.** The class is on it five times over, and a sixth statement of one
debt is the drift that section exists to refuse.

## Consequences

- Good: a session opening `CLAUDE.md` meets a backlog rather than forty-eight blockers, and the false
  urgency every unit inherited is gone.
- Good: the heading is an address again, so there is nothing in it left to go false.
- Good: nineteen citations across fifteen files go on resolving, untouched.
- Bad: nothing keeps this. The next condition written into a heading here is as free as this one was,
  and the failure is as quiet.
- Neutral: not one entry moved, in content or in order. Which one is taken next is unchanged, and it
  is the owner's to decide.

## What would reopen this

- **The showcase domain being decided on.** Its deferral's condition is met and the decision is not
  taken, so that is a unit somebody opens rather than a state that reopens this one.
- **A second heading of `CLAUDE.md` acquiring a condition.** This record settles one heading by
  argument; the rule it applies is ADR-0017's, it is kept by nothing here, and the next instance is met
  by whoever happens to read it.
- **A validation stage over this repository's own strings ever being built**, at which point the seven
  record lines named above are the population to try it on first: they are known, they are triaged, and
  the correct verdict for each is written down here rather than left to that stage to guess.

## More Information

- [ADR-0017](0017-an-address-is-a-name-never-a-rendering-of-its-data.md) — an address is a name, never
  a rendering of its data. The rule this heading is repaired by.
- [ADR-0062](0062-the-opening-is-a-state-and-the-history-is-the-log.md) — why the opening of
  `CLAUDE.md` is a state and the history is the commit log.
- [ADR-0142](0142-a-fixture-stands-where-the-catalogue-cannot-go.md) — a rename may move a name; it may
  not move a reading. The test the triage was run with.
- [ADR-0112](0112-the-prose-that-no-commit-authored.md) — the hands reading, and why the rule 1
  paragraph was rewritten whole.
- [ADR-0013](0013-samples-are-carried-or-pointed-at.md),
  [ADR-0044](0044-what-an-archive-is-and-what-it-may-not-be.md),
  [ADR-0048](0048-what-the-manifest-states.md),
  [ADR-0091](0091-the-lockfile-records-the-revision-it-was-resolved-against.md) and
  [ADR-0125](0125-an-address-this-tree-has-served-goes-on-being-written.md) — the records left exactly
  as they stand, with the reason above.
