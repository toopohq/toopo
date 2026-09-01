---
status: accepted
date: 2026-09-01
governs:
  - packages/registry/licence.ts
  - packages/registry/publication.ts
confirmed-by:
  - battery: registry-storage
    guard: every-file-the-installer-copies-is-marked-mit-0
  - battery: registry-storage
    guard: the-public-fields-npm-shows-are-the-ones-this-code-declares
  - battery: freeze
    guard: every-published-binding-still-hashes-to-what-it-was-published-as
---

# The name comes out of everywhere a digest does not reach

## Context and Problem Statement

Measured at `e4377b1` over the tracked tree, `Mathis Perron` occurred **203 times across 199 files**:

| Class | Occurrences |
| --- | --- |
| `decision-makers:` in a record's front matter | 189 |
| the second line of five `contracts/*/reference.ts` | 5 |
| `LICENSE`, twice, one per licence block | 2 |
| record prose quoting that second line — ADR-0159, ADR-0167, ADR-0172 | 3 |
| `package.json`, the `author` field | 1 |
| `THE_AUTHOR.name` in `publication.ts`, which composes the two above | 1 |
| `rebinding.test.ts`, a fixture standing for what `%an` returns | 1 |
| `README.md`, quoting `string/slugify@1`'s installed header | 1 |

**The interesting number is not 203, it is 5.** Every other occurrence is a string this repository may
edit this afternoon. Those five are inside `contractSnapshot` and `implementationSnapshot` for the
contracts published while `a-copyright-beside-the-marking` was the current banner, and permanent rule 6
forbids the edit for the life of those majors.

**What separates the two groups is not importance.** The `decision-makers` line was in the front matter
of every decision this project has ever taken, which is a more prominent place than the second line of
a file most readers delete. It came out in one `sed`. The five did not, and could not, and the only
thing that distinguishes them is that somebody once ran a command that hashed their bytes.

**The claim was measured rather than trusted.** Removing the copyright from
`contracts/typescript/string/slugify/reference.ts` and running the freeze reports **two** faults and
not one:

```
typescript/string/slugify@1 was published from d3a5166 bound to 855107da…,
  and this tree now produces f18a4dfc…
typescript/string/slugify@1/reference@1.0.0 was published from d3a5166 bound to 8c4af2c7…,
  and this tree now produces f0250a6e…
```

The contract digest and the implementation digest both cover that byte, so the line is sealed twice
over. There is no spelling of the removal that leaves
`every-published-binding-still-hashes-to-what-it-was-published-as` green, because the digest is not a
constant to be updated — [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) has it
rebuilt from the commit each binding records.

### What ADR-0159 had no occasion to say

[ADR-0159](0159-the-copyright-comes-out-of-the-file-that-lands-in-somebody-elses-project.md) took the
copyright out of the file that lands. It was written looking forward: `THE_CURRENT_BANNER` became
`the-marking-alone`, `array/group-by@1` moved because the ledger bound it nothing, and the five already
published stayed as they were. That record explains why the old form *survives*. It does not say the
thing a reader arriving at it a week later wants to know, because on the day it was written there was
nothing to compare it against: **that decision could not have been retroactive, and that is the
mechanism working rather than a limitation of it.**

A registry whose whole argument is *what you installed is what we served* cannot also be a registry
that improves what it served. The five headers are not stuck because nobody got round to them. They are
stuck because the alternative is a catalogue that rewrites its own past, which is the one thing every
lockfile in the world is relying on it not to do.

**And the bill is the cheapest one that could have come due.** What is frozen is a copyright line under
MIT-0, a licence that requires nothing of the reader and that they may delete. Had the frozen byte been
harmful rather than merely unwanted, the freeze would have held exactly as hard — which is the argument
for acting on the day a contract is published rather than the day somebody notices, and it is why
`CLAUDE.md` carries a list of what a contract must carry *before* it is frozen rather than a list of
things to tidy afterwards.

## Decision Outcome

**Every occurrence a digest does not reach is removed, and the ones that remain are named with the
reason each one remains.**

The 189 `decision-makers:` lines are gone. Nothing read the field: `mutation/decisions.ts` parses
`governs` and `confirmed-by` out of the front matter and nothing else,
[ADR-0001](0001-record-decisions-in-madr-format.md) adds those two and no third, `decision-makers` is
MADR's own and optional, and no template exists that would reintroduce it on the next record. It is
removed rather than given a project-wide value: a field naming the project on every record is a column
that distinguishes nothing, which is what the field already was.

`THE_AUTHOR.name` is `Toopo`, so `package.json` reads `"Toopo <hello@toopo.dev>"`. The name it used to
hold is now `THE_COPYRIGHT_HOLDER`, declared in `licence.ts` beside the line it composes.

The fixture in `rebinding.test.ts` reads `An Author Name`, which is what a mistyped `%an` returns and
is nobody.

### One constant fed a frozen value and a free one

That is the defect this unit found, and it was not the count. `THE_COPYRIGHT` was composed from
`THE_AUTHOR.name` on an argument written in `licence.ts` and worth quoting because it is a good one:

> Two literals of one person's name agree on the day they are written and are two things to correct
> afterwards, and the second is always the one nobody remembers.

It is right about two free literals. It is wrong across this particular boundary, and the reason is
one-directional: **the manifest's author is rewritten by any release and the copyright line can never
be rewritten at all.** A shared literal between the two does not keep them equal. It holds the free one
at whatever the frozen one says — so the manifest published a personal name for as long as five files
of the catalogue did, and the coupling was what made that look like a single fact instead of two.

Splitting it is not a duplication of the kind the old comment feared, because the two strings are no
longer the same string: one is a person and one is a project.

### Where each remaining occurrence lives, and why

Twelve remain outside this record, and each is here for a stated reason rather than by omission:

| Where | Count | Why it stays |
| --- | --- | --- |
| `contracts/*/reference.ts`, second line | 5 | inside two published digests apiece; no edit is available |
| `licence.ts`, `THE_COPYRIGHT_HOLDER` | 1 | the source those five are composed from, and sealed by the same digests |
| `LICENSE` | 2 | where the owner has decided the name belongs, once per licence block |
| record prose — ADR-0159, ADR-0167, ADR-0172 | 3 | a dated record quoting the byte that existed that day stays true |
| `README.md` | 1 | a quotation of one of those five headers, argued below |

**The constant is as sealed as the five bytes it feeds**, which is worth reading twice because it looks
like ordinary code. Changing it compiles; it then reddens
`every-file-the-installer-copies-is-marked-mit-0` on all five contracts at once, because that guard
compares each copied file against `licenceHeaderOf` byte for byte. So the count of *unremovable*
occurrences is six and not five, and the sixth is the one a reader would assume is free.

### The README is not changed, and that is a judgement

The owner asked for the page to show the current banner form and name the older one, and left the call
here. **It is refused, on the measurement.**

Read off `installableContracts()` — the guard's own population — the catalogue serves 6 installable
contracts, of which **5 carry `a-copyright-beside-the-marking` and 1 carries `the-marking-alone`**. The
sentence the exhibit sits under is *its first two lines are all it asks of you*, which is a claim about
what a reader receives. A reader receives the copyright form five times in six. Putting the 1-of-6 form
there would make the page describe what this project would prefer to be handing over.

`CLAUDE.md` already records this proposal and refuses it by name, as the closure
[ADR-0172](0172-the-front-page-showed-one-install-as-though-it-were-the-install.md) considered and did
not take: *the demonstration moving to a contract published after ADR-0159 puts on the page the form 1
of 6 installable contracts carries in place of the form 5 of 6 carry, and the defect was never which
particular was shown.* That entry reproduces at today's catalogue, and nothing about this unit is a
reason to overturn it — a unit whose subject is removing the name is the worst possible place to decide
what the page demonstrates, because the person deciding wants one answer.

**And the occurrence is not a fourth surface publishing the name.** It is a quotation of one of the
five frozen headers, which puts it in the same class as the three record citations rather than in the
class this unit clears. It is more tightly held than they are:
`the-header-the-readme-shows-is-the-one-the-installer-writes` composes the expected header from the
demonstrated contract, so deleting the name from that block would put a header on the page that no
contract writes.

The page is already honest about it, since ADR-0172: it attributes the exhibit to `string/slugify@1`,
says the shown form is the older of two, and names `object/deep-equal` as an installable contract
carrying the other. `carryingTheOther` stays asymmetric, because the asymmetry is the catalogue's.

### ADR-0187 ruled the other way and is overruled

[ADR-0187](0187-the-contract-page-is-the-artboard-and-two-fields-stop-reaching-a-reader.md) records an
owner's ruling in as many words: *the 185 `decision-makers:` stay, because in a repository whose thesis
is traceability, removing them makes 185 decisions anonymous.* That is a decision, it was taken
yesterday, and this record reverses it. It is written as an **overruling** rather than as a discovery,
on the treatment [ADR-0176](0176-a-condition-written-in-advance-is-what-decided-the-font.md) gave the
theme button.

**The argument it was made on does not survive being measured.** Every one of the 189 lines held the
same value — swept for distinct forms, there is exactly one. A column with one value in 189 rows
distinguishes no row from any other, so what was removed is not attribution but the *appearance* of it.
What attributes a record is `git log`, which this repository already names as the place where what
happened and when is kept, and which carries an author for every one of those files. Two statements of
one fact drift, and ADR-0001 refuses the second statement for `governs` on exactly that ground.

**Its figure was also wrong**, which is worth recording without correcting the record, because the
record is stamped. At `ba75658`, the commit that carries ADR-0187, `docs/decisions/` held **187**
records and **187** `decision-makers:` lines, where the record says 185. Whether 185 was true at some
earlier moment of that unit cannot be established from here, and the direction of the ruling does not
depend on it.

## Consequences

**191 occurrences are gone and one moved.** Twelve remain in the tree this record describes, and the
tree that ships it carries **15 across 12 files**, because this record names the person three times
itself: once as the subject of the census, and twice quoting a perturbation and the assertion it
failed on. They are kept rather than paraphrased, on the same ground as the three citations in
ADR-0159, ADR-0167 and ADR-0172 — a record that cannot name what it removed is not a record of the
removal, and an assertion's output quoted verbatim is worth more than a description of it. **The
count is stated here because the table above would otherwise be a census that excludes the page it is
printed on**, which is the shape this repository keeps finding in its own prose.

The name is no longer in the manifest npm
serves, no longer in the front matter of any record, and no longer in a test fixture. It is in the
licence, in five frozen headers, in the constant that composes them, in three records quoting one of
them, and in a README block quoting the same.

**The manifest changes what npm shows on the next publication and not before.** `toopo@1.1.0` is
published and its `author` is immutable, so the six versions npm holds keep the name for as long as npm
holds them. That is the same asymmetry one level up, on an artefact this repository does not own, and it
is why `THE_PACKAGE_VERSION` does not move here: this is not a release.

**No digest moves.** `pnpm freeze` is green either side, and the twelve bindings of the ledger are what
they were — `THE_COPYRIGHT` composes the same string it composed before, from a constant with a
different name.

**A record gains a line rather than losing one.** The front matter is three fields where it was four,
and the two that carry meaning are the two something resolves.

## Confirmation

`pnpm registry` reports **466 passed (466)** before and after.

Each of the two guards that keep the split was seen red **alone**, and the pair is the whole point of
the split:

- `THE_AUTHOR.name` set back to `Mathis Perron` with the manifest untouched:
  `the-public-fields-npm-shows-are-the-ones-this-code-declares` fails with *expected `Toopo
  <hello@toopo.dev>` to be `Mathis Perron <hello@toopo.dev>`*, **1 failed | 465 passed**, and
  `every-file-the-installer-copies-is-marked-mit-0` is green. **Before this unit that same edit would
  have reddened both**, which is the coupling, demonstrated by its absence.
- `THE_COPYRIGHT_HOLDER` set to another string: `every-file-the-installer-copies-is-marked-mit-0` fails
  naming all five contracts, **1 failed | 465 passed**, and the manifest guard is green.

`every-published-binding-still-hashes-to-what-it-was-published-as` was seen red on the real condition
this record is about — the copyright removed from a published `reference.ts` — reporting the contract
and the implementation binding of `string/slugify@1`, and green on the tree this record ships.

**What was not measured is stated rather than implied.** No mutant cell was added for the split. The
one cell that touches this code, `registry-storage · I-34`, edits the author's *address* and not the
name, and its rationale said the name was avoided because it reached `THE_COPYRIGHT` and would have
reddened the marking guards too. That sentence expired with this change and is corrected in place; the
cell is unchanged, because the address is what it is about. The name is now a mutable point that no
cell aims at, and that is an absence rather than a coverage claim.

## What would reopen this

- **A sixth contract published under the old banner.** It cannot happen while `THE_CURRENT_BANNER` is
  `the-marking-alone` and `a-contract-not-yet-published-carries-the-current-banner` holds, but the day
  the banner is a per-contract choice again, the sealed population grows and the table above is stale.
- **The catalogue reaching a majority of contracts on the current form.** The README refusal is
  arithmetic and not taste: it turns the day `the-marking-alone` is what most installable contracts
  carry, and the page should then show what most readers receive. Today that is 1 of 6.
- **A revision mechanism.** `CLAUDE.md` records that what would let a published contract's frozen half
  be corrected is a way for the registry to bind a second contract digest under one address. If that is
  ever built, the five headers stop being permanent and this record's central asymmetry stops being
  one.
- **Anything reading `decision-makers`.** Nothing did when it was removed. A tool that wants
  per-record authorship should read `git log`, and if it cannot, the question is why the graph does not
  answer it rather than whether the front matter should.

## More Information

- [ADR-0159](0159-the-copyright-comes-out-of-the-file-that-lands-in-somebody-elses-project.md) is the
  decision this one is the other half of: it took the copyright out going forward, and this says what
  going forward cost and why the cost is correct.
- [ADR-0093](0093-a-binding-records-the-commit-it-was-published-from.md) is why the seal is real — a
  binding is rebuilt at the commit it names rather than compared against a constant somebody could
  update.
- [ADR-0047](0047-what-licence-covers-what.md) is which licence covers what, and why the perimeter of
  MIT-0 files is derived rather than listed.
- [ADR-0172](0172-the-front-page-showed-one-install-as-though-it-were-the-install.md) is the README's
  own history, and the record whose refused closure this unit was asked to take and did not.
- [ADR-0018](0018-a-published-count-carries-its-coordinates.md) is why the census above carries
  `e4377b1` and why ADR-0187's 185 is noted where it stands rather than corrected.
