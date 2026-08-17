# Toopo

A registry of utility functions verified against public, executable contracts, distributed as
source code copied into the user's codebase.

A **contract** is the complete, executable behavioural specification of one function: identity,
TypeScript signature, property-based invariants, named and settled edge cases, and benchmark
profiles. The contract is owned by the registry; implementations compete underneath it and are
interchangeable.

The product of this project is the contract, not the utility code. **If the verification is
decorative, the project has no reason to exist.** That sentence is the acceptance criterion for
every change made here.

## Where the project is

**What exists.** The registry's data schema, its immutable storage and its read API, where every named
answer declares the revision that produced it. Stage 1 of the validation pipeline, and the conformance
controller beside it. The client, finished at six commands — `init`, `add`, `update`, `remove`,
`search`, `list` — with a two-phase write, a lockfile carrying two digests per file and the revision
each feature was resolved against, and a port whose four implementations are asynchronous. The
generator, seven static pages, four of them with a playground that runs this repository's own modules
with their types removed. The archive: compiled JavaScript and nothing else, whose size is no longer a
function of how many contracts exist. The emitted tree, which is every answer the read API can give,
written as files at the addresses a client asks. The instrument: nineteen batteries, their pinned
verdicts, and one command that replays them. And permanent rule 6, executable: a binding records the
commit it was published from, and the frozen half is rebuilt at that commit and compared rather than
transcribed anywhere. What this repository says about its own history now resolves against what git
holds rather than against what somebody checked: a commit identifier in the prose names a commit of
this graph, no object of it carries an address the project refuses to publish, and the only checkout
registered here is its root.

**And that freeze now covers what a contract's guards call, which until this unit it did not.** A
fingerprint covered the seven files of a folder and nothing they import, so emptying one shared guard
left all eight ledger digests identical to the byte while a contract the guard exists to refuse went
green — measured at `9176c9e`, with the same defect red once the shared file was put back. `sharedHarness`
is the closure: the files a contract reaches outside its folder are declared, derived independently by a
walk over what the seven really import, refused on any disagreement, frozen with the contract and served
beside it — so a reader who fetches every file a snapshot names can now resolve every import those files
carry, which is the auditor's half of the same hole. The bill is stated rather than discovered: editing
either shared file rebinds all five addresses at once. ADR-0105.

**The catalogue is marked published, and that is the act this repository was built to be able to take.**
Four contracts carry `published`, their reference implementations are bound at `1.0.0`, the manifest is
`toopo@1.0.0` and `private: true` is gone. **Publishing and anchoring are two acts and no commit can do
both**, which is a fact about the mechanism rather than about this unit: `implementationSnapshot`
carries the version, so the commit that mints `reference@1.0.0` creates an address no earlier commit
binds and cannot name itself as the commit it was published from. So the publication is a commit and the
anchoring is the commit after it. `contractSnapshot` omits the lifecycle - measured, the four contract
digests are identical either side of the marking - which is what makes the second commit's coordinate
honest for the first four addresses. ADR-0106.

**And something now reads that coordinate.** `packages/registry/against-what-was-published/` rebuilds
every binding at the commit it records and compares, so permanent rule 6 stops being the biggest
`one-directional` declaration here and becomes a red. It is a suite no battery replays, for the reason
the origin proof is: `registry-storage` would pay for a checkout and a child process sixty times per
replay, inside an instrument that manages worktrees of its own - and the reading that says *the verdicts
would hold anyway* is true only while that battery has no surviving cell. **The price is the origin
proof's and is stated in the same place**: no mutant reddens those two guards, so nothing measures what
they are worth, and what stands in for it is that they were seen red on three real conditions with the
reds published. ADR-0107.

**What does not exist.** The publishing tool. Stages 2 to 7 of the validation pipeline. A second
language.

**`toopo@1.0.0` is on npm, and the way it got there is what the unit before this one replaced.** It was
published from a keyboard, and the registry's record says so: `maintainers` and `_npmUser` name a personal
account, and `dist` carries the registry's own signature and **no attestation at all** — so the archive a
reader installs could not be tied to the commit or the run that built it, which is the tie every other proof
here is about. A job of `suites.yml` publishes on a dispatch of `main` carrying the word `publish`,
after `needs: site` has reached both matrix legs, the deployment and the proof against the origin; npm
exchanges an identity token GitHub mints and writes the attestation itself, so **nothing here stores a
credential** and there is no ninety-day secret to renew. ADR-0109.

**The manifest reads `1.0.1`, and the claim that release rests on is measured rather than argued.** What
`1.0.1` corrects is not in the program: it is an artefact published with no attestation and a personal
address frozen into it, which on a package sold on auditability is a defect of the artefact and not of the
code. So the code must not move, and it does not — `dist/` was built at `bb3dd78` and again with the line
reading `1.0.1`, and the 35 modules, the 428 161 bytes and every per-file digest are equal, under one tree
digest either side. `publication.ts` is not among those 35, because `packaging/reachable.ts` prunes what the
entry point cannot reach. `THE_PUBLISHED_IMPLEMENTATION_VERSION` stays at `1.0.0`: a version is half of an
implementation's address, nothing it addresses moved, and this release is the event ADR-0106 cut the tie
for. **Publishing is now a push and a dispatch**, and the last thing that was still a command somebody
typed has stopped being one.

**The declared origin serves this catalogue, and that is the half that changed.** `main` builds the
tree in CI and `wrangler` uploads it to Cloudflare Pages. Measured at `994374d` over **all 76 addresses
the tree writes** — not a sample of them: every one answers, the 36 addressed by content carry the
year-long `Cache-Control` `cachePolicyFor` declares, `_headers` answers 404, and an address nothing was
ever served at answers 404 with the page that says exactly that. **`@` is served directly, with no
redirect**, which is what the move to Pages bought and what settles the question the previous host
opened. `X-Robots-Tag: noindex` is absent here and present on `toopo.pages.dev`: the host rule retires
itself as designed, and both halves were read in one sweep because either alone proves nothing.
ADR-0103 carries the table, the two headers on served addresses that this repository does not decide,
and the one shape the sweep could not reach.

**And an installed `toopo` has now been seen asking it.** A tarball built here, installed into a project
holding nothing, downloads a feature from the declared origin, and the bytes that land hash to the
digest the registry announced — measured end to end, in the one suite of this repository that reaches a
live host, kept out of every battery so that nothing which replays depends on one. It is the eighth
suite and the last proof before a package is published. ADR-0104.

**The catalogue is five contracts** — `number/parse@1`, `date/add@1`, `array/group-by@1`,
`string/levenshtein@1`, `string/slugify@1`. The third is a format prototype that will not be published,
because ES2024 shipped `Map.groupBy` and it answers what the contract specifies; the refusal and the
rule it establishes are recorded. The fourth is the first whose properties are strong by nature — the
axioms of a metric — and its table is a third the size of the first's as a result. The fifth is the
first with no oracle of any kind: measured over fifty-seven samples, the four most used slug libraries
agree on seven, so nothing about its answers is true and every one of them has to be argued for.

**Project name: Toopo.** CLI command `toopo`, lockfile `toopo.lock`.

**What decides the next unit** is the list of what is still open, below, with what each entry costs.

## Where the reasoning lives

**A decision that has been taken is a record in `docs/decisions/`**, in MADR format, addressed by
number and cited as `ADR-0007` — never as a path. ADR-0001 settles the format, the two fields it adds
and the one section, and nine guards resolve what a record names in both directions. There is no index
here: the directory listing is the index, because the filenames carry the titles, and a second
statement of what the folder already says is one that drifts.

**A record exists for what will not fit beside the line.** Where the argument does fit — where the
reason a constant holds the value it holds is a comment on that constant — a record is an address for
something that did not need addressing, and the cost is not the file: it is that two places then carry
one piece of reasoning, and they wait to diverge. The move to `1.0.1` is where this was applied rather
than merely stated: the whole of it is why one string reads what it reads, ADR-0109 had already argued
the release, and the argument now sits in `publication.ts` above the line it explains, with no record
of its own.

**What happened and when is `git log`.** The commit messages carry the measurements at length. This
file carried a second, shorter copy of them for a year; ADR-0062 is why it no longer does.

**What is below is what a session needs before it writes a line**: what is still open, the rules of
this stage, the permanent rules, the conventions, and the verification discipline.

## What the repository declares and nothing keeps — closes before the launch

One form, found four times in a single sweep and certain to be found again: **a thing that behaves
like a rule, with nothing making it hold.** The vocabulary for it already exists — `one-directional`
— and the list is kept here rather than scattered, because it is what the publishing tool has to
close. A published version is frozen for life, so a declaration that is decorative at launch is
decorative for ever.

**An entry is written in two halves, and the reason is that three times in one week a published
sentence of this repository was false — twice with the true sentence and the false one in the same
file.** That is not bad luck. It is a list in prose describing what the code does, and the code moves
while the list does not. The remedy costs two sentences, and this section is its own demonstration:
the record now at ADR-0017 named the pre-flight as the thing that would close
`benchmarks.profiles[].name`, the pre-flight was built, and nobody came back here.

1. **An entry names what would close it.** One that names no closing mechanism cannot be recognised on
   the day it closes, which is exactly how the entry below outlived its own closure.
2. **The change that builds such a mechanism sweeps this list for every entry naming it, and closes
   them in the same commit.** The mechanism and the entry are one event; separating them is what
   leaves the false half of a true sentence lying where somebody will read it.

**Entries that closed are recorded with the mechanism that closed them, in that mechanism's own
decision record.** Two closed by stage 1 of the validation pipeline and are in ADR-0005; three closed by
the two-phase write and are in ADR-0039; the class of a declared address nobody resolved closed in
ADR-0060; permanent rule 6 closed in ADR-0093, and it was never on this list; the three about what git
holds — a citation that resolves, an address no commit carries, a checkout nothing leaves behind —
closed together in ADR-0095, because all three are one walk over the same graph; the playground
reading what a reader types closed in ADR-0096; a replay that could not finish closed in ADR-0102,
which found a second entry for this list on its way out and put it there; the address a host serves
closed in ADR-0103; and an archive that really installs a feature closed in ADR-0104, on the event it
had named, leaving two entries behind it — one for the third guard it did not bring back, one for the
revision it reports without resolving.

**That last one is where rule 2 above was broken, by the commit that built the mechanism.** The entry
was closed in fact by `e4eca00`, the move to Pages, which changed eight files and none of them this
one — so for three commits this list carried a live entry about a redirect that no longer happened,
and the paragraph above it described the host that had been left behind. Nobody was misled only
because nobody read it in that window. **A mechanism and its entry are one event and the rule already
said so**; what this instance adds is that the sweep is owed even when the mechanism looks like a
one-field configuration change, because it is the *entry* that names the fact, not the diff.

**That last one is the only entry this list ever carried that no guard could have caught**, because it
was a decision taken in conversation and written nowhere — the repository held no half for the code to
disagree with. It is also the entry that paid for itself twice over on the way out: closing it found
*two* published sentences of this repository false, both in the record that had argued the opposite
position, and both of the class the entry was about. One clause asserted that a raw text field could
not express a lone surrogate, which a browser refuted. The other was worse and was invisible to every
reader for a year — the two rows ADR-0028 printed to *demonstrate* that a no-break space and an
ordinary space carry opposite answers were **identical, byte for byte**, having lost the no-break space
somewhere they were written. A block whose entire purpose was to show two things differing showed the
same string twice, with two different reasons beside it, and nothing could have caught that either.

**That last one is the finding this section has to keep, because it is about the section rather than
about the entry.** *A published version is frozen for life* is the biggest `one-directional`
declaration this repository has ever carried — it is the whole security argument, every lockfile in the
world would hold the digest it moved, and it is what the product is sold on. It has been in this file
since the first commit, 367 commits before `74904ef`. This list has existed for 271 of them, for exactly
this class of defect, and it never named it. Ten entries at that commit, none of them the one that
mattered most.

So the rule the list adds to itself is not another entry. **A list that believes itself exhaustive is
more dangerous than no list**, because it is read as coverage: every session that opened this file saw
ten entries and a section explaining what the form is, and concluded that the form had been swept for.
Nothing here says how many instances exist, and nothing can. What a reader may take from this section is
that each entry it names is real; that it is complete is a claim no version of it has ever been entitled
to make, and this paragraph is the correction that stays.

**It happened a second time, on the same declaration, and that is what makes the paragraph above a rule
rather than an apology.** ADR-0093 closed *a published version is frozen for life* and this section
recorded it as the biggest instance the list had ever missed. What ADR-0093 froze was the seven files a
contract declares. Four of those seven import `packages/catalogue/every-contract.ts`, no digest covered
it, and the verification of a frozen contract could therefore be emptied with no address moving — which
is the same declaration, unkept, one level in. Twelve commits and one whole record after the miss was
written up. **The list did not fail to be exhaustive here; the closure did.** A mechanism that closes an
entry is itself a declaration, and nothing swept it — so what this instance adds is that *closing* an
entry is the moment to ask what the closure does not reach, and to write that down beside it before the
entry is struck off.

**And the same shape arrived one level down, in a closure criterion rather than in this list.** Taking
the personal address out of the history was to be closed by *zero occurrences over the 374 commits* —
374 being what `git rev-list --count HEAD` answered. The rewrite had to reach **391**: three
`evidence/*` tags retain seventeen commits `main` does not reach, every one of them carrying the
address, and every one of them published by the first `push --tags`. The criterion would have gone
green over a branch
while the defect left by another door. What made 374 wrong is not a miscount but a population read off
whichever ref somebody was standing on, so: **a count that bounds a defect names the population it
swept**, and `--all` is the only spelling of *this repository* that a tag cannot fall out of.

**Still open, and what each one now costs.**

- **That the bound the origin proof waits is one somebody measured.** A deployment returns before it
  has propagated, and part-way through a rollout the origin answers the catalogue index from one commit
  and a contract's bindings from another — at which point `toopo add` refuses, correctly, and the proof
  against the origin reddens with the product working.

  **This entry predicted the wrong failure, and it was refuted by observation rather than by
  argument.** It read *the day propagation exceeds it, CI is red with nothing wrong, which is the exact
  failure the wait was written to remove*. Measured at `70bb31c`: the bound was **never consumed** —
  the waiting line the pre-flight prints appears in neither of that commit's two run logs — and CI was
  red anyway, once in two runs. The pre-flight read one revision and returned on its first attempt; the
  installed client, seconds later, read the index from `70bb31c` and the implementations from
  `1a8e562`. **An agreement observed on one reading says nothing about the next**, and no reading taken
  inside the suite can be the client's, because the client is another process. The cause is the alias
  and not a cache: Cloudflare Pages makes a hash-based deployment address atomic and updates a branch
  alias to point at it, `toopo.dev` is that alias, and `CF-Cache-Status: DYNAMIC` on all three
  addresses says nothing was served from an edge cache. ADR-0108 replaced the pre-flight with a bounded
  retry of the chain, driven by the client's own refusal. **A prediction that observation refutes is
  replaced by what was measured, never by a second prediction**, which is why nothing above says what
  will fail next.

  **What stays open is what this entry always meant, with the prediction removed.**
  `THE_PROPAGATION_BOUND` is two minutes chosen against the cost of the step and not against
  Cloudflare. **It now has one coordinate and needs a population**: measured at `92e6acd`, attempt 1,
  the retry fired on the real condition — the index from the old deployment, the bindings from the new
  — and the span from the client's first refusal to a finished chain was about **10.8 seconds**. One
  deployment. The population is every deployment this repository makes, so what would close this is the
  same span over enough of them to say whether 120 seconds is generous or lucky, and the retry now
  records both ends of it on every run that waits. Not built, because one run measures one deployment.

  **The same run refuted the repair nobody wrote, which is worth more than the figure.** Five seconds
  after the first refusal the origin answered *one* revision to this suite and the client refused
  again. A wait that ran the chain once as soon as the suite saw agreement would have been red there —
  and that is the shape the pre-flight had.
- **That the two things a publication depends on outside this repository are what this repository thinks
  they are.** ADR-0109 put `npm publish` in `suites.yml`, and four guards keep what a file can hold: one
  job publishes, it is gated by the suites, the branch and an environment, only it may mint an identity
  token, and no workflow hands npm a credential. **None of them can see the other side.** npm's trusted
  publisher holds four strings — organisation, repository, workflow filename, environment — and **three of
  them are things this repository can rename on its own**, at which point publication stops working with
  every guard green. Worse in kind: **npm's configuration carries no branch**, so the environment is doing
  work that looks, in the file, as though the condition were doing it. And the environment's own branch
  policy is a GitHub setting no file here states.

  **The population is those four strings and that policy**, and what would close the npm half is an
  authenticated read of npm's API compared against `ENDPOINTS`-style declarations of the two names this
  repository owns — the price being a credential on a runner for a question whose whole subject is not
  needing one, which is the same trade the entry below about `servedFrom` refuses and for the same reason.
  The GitHub half is cheaper and is not free either: whether a run can read its own repository's
  environment protection with the token this workflow carries has not been measured. Not built, and the
  first dispatch is what will say whether the two sides agree at all.

  **Both sides were configured on 2026-08-17, and this paragraph is the entire record of it.** The
  trusted publisher on npmjs.com names `toopohq`, `toopo`, `suites.yml` and the `npm` environment, with
  `npm publish` as the permitted command and publishing access at its strictest setting; the GitHub
  environment exists and is restricted to `main`. **None of that was read from here and none of it can
  be** — it is reported by the person who typed it, which is precisely the shape of the one entry this
  list ever carried that no guard could have caught: a decision taken in conversation, with no half in
  the repository for the code to disagree with. So it is written down where the next session will meet
  it, and it does not make the entry above any less open. What changes is only which sentence the first
  dispatch will falsify: not *whether they were set up*, but *whether the four strings and the policy
  are the ones this file just claimed*.
- **That a decision can name what confirms it, when what confirms it is a guard over the five.**
  ADR-0001 requires `confirmed-by` present and non-empty, and a guard is addressed by the pair
  `(suite, guard)`. `guardsCollectedIn` reads a guard's *written* title, so an `it.each` over the
  catalogue is collected as `…-%s`; `guardAddressFaults` requires a frozen identifier and `%s` is not
  one. **So a decision whose subject is per-contract has no citable guard at all**, and nothing says
  so — the author discovers it as nine faults from
  `every-guard-a-decision-names-is-one-its-suite-collects`, which reports that the suite collects no
  such identifier and not that the identifier could never have existed. Measured at `4001aa3`: zero of
  the 105 records cite a parameterised guard, so the rule has been kept by accident rather than by
  anything. ADR-0105 folded four guards into one apiece and that was right on its own merits, which is
  exactly what makes this worth writing down: the collision was paid around rather than found. **The
  population is every guard written with `it.each`**, and what would close it is `guardsCollectedIn`
  expanding a parameterised title the way the run does — it already knows the folder, and `eachContract`
  is the only table the catalogue parameterises over. The price is that it stops being a plain read of
  the source and starts needing to know what a suite's rows are. Not built.
- **That a mutant a battery injects is the defect it describes, and not a compile error.**
  `mutation/check-anchors.ts` reads a cell's `find` text and requires it to occur once in its file; it
  never reads the `replace`. Found by ADR-0105 rather than reasoned about: `hashedFile` renamed two
  parameters, both affected anchors were updated, `npm run anchors` went to 0 loose — and I-01's
  replacement still read `readFileSync(join(directory, name))`, naming two identifiers that no longer
  exist. Injected, that cell does not typecheck, so it measures nothing and the anchor check says it is
  fine. **The population is every cell of every battery**, 586 anchors across 82 files at `9176c9e`, and
  what makes it worth an entry rather than a note is that the failure is silent in exactly the tool
  built to prevent it. What would close it is not a second lint over the text: it is injecting each
  mutant and typechecking the tree, which the replay already does one cell at a time — so the cheap form
  is `check-anchors` learning to apply the replacement and refuse a result the compiler rejects, and the
  price is that it stops being a pure read of the working tree. Not built.

- **That the revision an installed client records is a commit this repository holds.** A lockfile
  carries `servedFrom`, and the proof against the origin asserts its *shape* — forty hexadecimal
  digits — and reports its value without resolving it. That is deliberate and it is the cheaper half of
  a real trade: a clone legitimately behind the deployment does not hold a commit the origin already
  serves, so resolving against the local graph would be red on an ordinary state. **What it leaves open
  is that an invented revision passes** — an origin serving `0000…0000`, or a commit of somebody else's
  repository, is indistinguishable here from one serving the truth. The population is every revision a
  served answer declares. **What would close it is a resolution against the remote rather than against
  the clone** — `git ls-remote`, or the forge's API — and the price is named rather than waved at: one
  more network dependency inside the single guard whose whole difficulty is already that it has one, and
  a private repository, which means a credential on a runner for a question that stops being private the
  day the repository is public. That is the event to write it against, and it is why it is not written
  now. ADR-0104.
- **That the bytes an archive installs are the catalogue's own bytes**, which is the third of the three
  guards ADR-0092 lost and the one ADR-0104 did not bring back. The other two returned, one of them
  stronger; this one was refused rather than approximated, because comparing what a real install wrote
  against `contracts/` on disk would be red with nothing wrong — the origin serves the last *deployed*
  commit and the working tree is HEAD, and the two differ on every unit that touches a contract. What
  stands in its place is the arithmetic half: the installed bytes are compared against the digest the
  registry announces, read independently of the client that installed them. **So what nothing keeps is
  that the digest names the catalogue's own bytes**, which is the registry's single believed step
  arriving one floor down. **It closes by rebuilding `contracts/` at the commit `servedFrom` declares**
  and hashing the file the announcement names — the shape `packages/registry/rebuild.ts` already has for
  a binding, applied to one file instead of a ledger. **Priced as an order and not as a figure**, which
  is all the method supports: that module checks a commit out under `.rebuilt/` and runs that commit's
  own `ledger` script, so it is minutes where the whole proof beside it is seconds. It is the one entry
  here whose closure would cost more than everything it sits next to, and it is not built.
- **That no file of the tracked tree names the machine it was written on.** The sweep before the first
  push established it and nothing keeps it. **The population is the tracked tree and never the graph**,
  and that is the whole shape of this entry rather than a detail of it: measured at `2640b5d` over
  `git rev-list --objects --all`, seventeen blobs and one commit message carry a developer's home path —
  fourteen of the blobs `CLAUDE.md`, two `mutation/paths.ts`, one `vitest-entry-point.ts` — while HEAD
  carries none, every occurrence having been elided by hand as it was noticed. So a reading over the
  graph would be red the day it was written, and **those seventeen are what this entry will never
  cover.** Taking them out costs a second `filter-repo` over four hundred commits, and that was priced
  and refused knowingly: a folder path is not harvestable the way the address ADR-0095 removed is, and
  the given name it reveals is already published by the manifest, by `LICENSE`, by every installed
  header and by the `decision-makers` of every record in `docs/decisions/`. **What is worth keeping is
  the recurrence and not the frozen seventeen** — a stack trace pasted into a comment, a path copied out
  of an error message — and that arrives in the working tree, where a reading is green today and red on
  the day it happens. **It closes on that reading**, beside `refusedAddressFaults` in
  `mutation/history.ts`, whose halves are already this shape: a declaration of what is refused, a sweep
  over a named population, and a fault that reports where without reprinting what.
- **That nothing this repository publishes names the machine or the account it was built on — on the
  fourth surface, which no sweep has ever covered.** The sweep before the first push, and the one
  ADR-0095 built, read the tracked tree, the reachable objects, the commit messages and the tags. **A
  run log is none of those.** It is written by a workflow, kept by the forge, and published with the
  repository the day it becomes public — measured: a failed `wrangler delete` printed the account
  identifier into an Actions log, in an error message nobody wrote. That run was deleted by hand; the
  class stays open, and its population is *every log of every run ever kept*, which is the one
  population none of the existing sweeps can reach because it is not in git. What would close it is not
  a sweep at all — a log cannot be edited, only deleted — but a rule about what a step may print, and
  the mechanism for that is the same validation stage over this repository's own strings that three
  entries here already name.
- **That a deletion that reports failure has failed.** Measured on the throwaway of ADR-0099:
  `wrangler delete` removed the Worker's script, then asked for a KV namespace list its token had no
  permission for, and exited non-zero. **A partial deletion that exits non-zero is indistinguishable
  from one that did nothing, for anybody reading the exit code** — and the check written to tell them
  apart could not either: it asked the deployment for a page, read 404, and concluded absence. The
  Worker was still there. *A request answers about content; only a listing answers about existence.*
  The repair is in the probe that followed — it ends by listing what exists and fails if the name is
  still among them — and what is **not** closed is the general case: nothing in this repository requires
  a deletion to be proved by a listing, and the next one written will be as free to ask a question that
  cannot answer.
- **`contentTypeOf` — declared in `endpoints.ts`, read by the local server and by no deployment**, and
  the two readings of it are worth keeping side by side because between them the defect **changed
  nature rather than improved**. Measured at `c764867` on Workers static assets: every named and every
  content-addressed answer arrived with **no `Content-Type` at all**, because they are files with no
  extension and nothing told the host what they are. Measured at `994374d` on Pages, over all 76
  addresses: the pages, the twins and the modules now carry a right one, and the same **48 answers** —
  12 named and 36 addressed by content — carry `application/octet-stream`. From no header to a wrong
  header is more visible and no better: a header that is absent is a host with no opinion, and one that
  says *these are arbitrary bytes* about a JSON document is this repository's declaration contradicted
  by its own deployment. **It closes where the cache policy closed**, in
  `packages/site/served-headers.ts`, by the same derivation from `ENDPOINTS`: one more header per rule,
  read from `contentTypeOf` instead of `cacheControlOf`.

- **That every address this tree serves carries a cache policy this repository chose.** Measured at
  `994374d` over the 76 addresses: **ten of them do not.** The nine modules and `robots.txt` answer
  `public, max-age=14400, must-revalidate`, a policy written in no file here. `theHeaderRules` derives
  one rule per endpoint from `ENDPOINTS`, and a module is not an endpoint, so those ten match nothing
  and fall through to whatever the host does that morning.

  **What the ten do not share is the whole of what makes this an entry rather than a curiosity.** Not an
  extension — nine are `.js` and one is `.txt`. Not a content type, not a depth, not a folder. And
  `llms.txt`, a root-level `text/plain` file beside `robots.txt`, answers `max-age=0`: two files of the
  same format, in the same place, with different answers. **No cause is named, because none was
  measured** — three passes say only that it is stable, and a plausible explanation written here would
  be worth less than the gap it filled.

  **It closes by declaration and not by explanation**, which is why the missing cause does not block it:
  a second family of rules in `packages/site/served-headers.ts`, covering the addresses the emission
  writes that no endpoint names, derived the way the first family is — from `browser.ts`'s module map
  and the three convention constants in `paths.ts`, never from a list somebody types. The one thing that
  repair has to answer is ordering: `_headers` is itself written into the tree it describes, so a
  derivation reading the finished tree is circular and the rules have to come from the same declarations
  the emission does. **Declaring it does not explain the split and does not need to** — it makes the
  split stop deciding anything. Today those ten land on a default; the day the default moves, nothing
  here says so, and that is the failure, not the four hours. ADR-0103.
- **That the emitted tree never loses an address it once served**, which the 404 page now promises to
  every reader and which nothing keeps. ADR-0101 publishes *nothing has ever been served at this
  address*, derived from permanent rule 6 — and **rule 6 freezes a published version, not the emission**.
  Nothing stops somebody changing the walk tomorrow so that an address served yesterday stops being
  written; the 404 would then tell a reader that nothing was ever served there, which would be false, on
  the page whose whole content is that claim. The closure guard is not it: `the-emitted-tree-is-closed`
  asks that every address the tree *names* is one it *holds*, which is a statement about one tree and
  says nothing about the tree before it. **The population is the set of addresses of the emitted tree**,
  and what would close it is a comparison against the same set at the commit each address was first
  served from — which is the shape `packages/registry/rebuild.ts` already has for a binding, applied to
  a tree instead of an artefact. **The clause that dated this entry has expired**: it read *not urgent
  while nothing is published, a broken promise the day after*, and 76 addresses are served at the
  declared origin as of `994374d`. The promise is live now — a reader who follows a link that stops
  being written is told nothing was ever there — and what has not changed is the price.
- **That a declared absence carries the date it was true**, which nothing keeps and which was found on
  this repository's own prose one day after it was written. ADR-0098 published *whether a runner's
  checkout satisfies that has not been measured* in the present tense; the job ran on the next commit
  and the sentence was false. **The class is a sentence asserting, with no stamp, that a specific thing
  has not been measured, where measuring it is possible and would falsify the sentence.** It is
  ADR-0018's rule about a dated number arriving on a declared absence, and it is harder to see there
  because there is no figure to date — nothing looks like a count, so nothing invites a coordinate.
  Swept over the ninety-eight records at `c764867`, and **written as a list rather than as a number,
  because a rank is checked only by rebuilding the whole list**:
  - ADR-0001, *the cause is not established*, of a 126-line gap between two classifiers;
  - ADR-0055, *nobody has ever checked which* arms real cases reach;
  - ADR-0058, *the cheapest contribution is the one nobody has ever made*;
  - ADR-0092, *a surface nobody has seen*;
  - ADR-0094, *presents no measurements at all*, about a page somebody else can change;
  - ADR-0095, *what it cost is not measured and is not claimed*;
  - and ADR-0094 again, *was opened and carries no measurement of any kind* — counted as borderline
    and not as a seventh, because its verb is past and only its claim is present.

  Six become false the day somebody does the thing; the fifth can become false with nobody here acting
  at all, which is the one worth reading twice. **What is deliberately not claimed is that the list is
  complete** — the sweep matched thirteen phrasings and a declared absence has no fixed spelling, so
  what a reader may take is that each entry is real. **It closes on a convention rather than a guard**:
  a declared absence carries the commit at which it was true, exactly as a count does. The executable
  form is the validation stage reading this repository's own strings, which is already on this list,
  already priced, and already refused as a lint over prose.
- **That a control which counts a suite has seen the suite it counted.** `assertWholeSuiteRan` compares
  a total against a total and never looks at the composition, so a guard that stops answering is
  invisible to it as long as something else answers in its place. Measured at `0671e6e`, on the state
  ADR-0102 was closing: with a checkout left registered, `packages/registry/frozen-for-life.test.ts`
  cannot start, and the report reads **351 assertions, 347 passed, 4 skipped, 0 failed** — 351 against
  the control's 351, so the check is silent while four guards of the contract under measurement have
  quietly left the suite. **What makes it possible is that ignored is not failed**, and the two are
  indistinguishable to anything that counts. The class is not that cell and not that mutant: it is
  anything that makes a test file unstartable — a `beforeAll` that throws, an import that dies, a
  fixture that cannot be built — and every one of them leaves a cell that reads exactly like a result.
  **The population is the files one cell's run reports**, and what would close it is the comparison
  `assertTheCensusHolds` already makes, read where `assertWholeSuiteRan` runs instead of only during
  calibration. It is not built with ADR-0102 because two controls over one reading have nothing to say
  on the day they disagree, and which of them owns the question is undecided.
- **That the manifest declares no dependency the product could reach**, which stage rule 3 now states
  as a criterion and nothing reads. The two mechanisms that rule names are real and are about *files*:
  `no-part-of-the-instrument-or-of-the-suite-is-in-the-archive` and
  `every-file-in-the-archive-is-loaded-by-a-command` ask what the tarball holds. Measured at the commit
  that added `wrangler`: no module of `packaging/` reads `dependencies` or `devDependencies` at all, so
  **a package moved from the dev list to the runtime one would be installed by every consumer and no
  guard would notice** — `dependencies` is the field `npm install` walks, and `files: ["dist"]` does not
  bound it. It closes on a guard over the manifest: the runtime `dependencies` are exactly the packages
  the published entry point imports, which `reachable.ts` already computes and nothing compares against
  the manifest. One file, and it is the cheapest entry on this list.

  **That guard would be green the day it is written, and it was measured rather than assumed.** At
  `994374d` the manifest declares one runtime dependency, `typescript`, and
  `dist/packages/validation/typescript-api.js` imports `typescript/unstable/sync` — so the declaration
  and the walk already agree, and the guard finds nothing. It is written anyway on the rule below about
  a guard born green: what it buys is not today's defect but the day somebody moves a package from one
  list to the other, and on that day the package is installed into every consumer's project.
- `contractAnatomy` — triaged entry by entry against stage 1's own constraint, *readable in the source
  alone, without evaluating the module*: **three of the eleven are settled by the source alone, four
  need the module, four are a reader's and no stage will ever take them.** So the conformance
  controller is not "`contractAnatomy` made executable"; it is three entries, and a fourth stage that
  evaluates a vetted module takes four more. The triage is data on each entry and one guard keeps the
  half that can be kept — a new entry with no verdict is refused.
- `CLOCK_DEPENDENCE_RULE` — declared, cited in prose, imported by nothing executable. It is one of the
  four a reader keeps: which guards *can* depend on elapsed time is a judgement about what a defect
  could do to a guard.
- `benchmarks.profiles[].name`, **the content half of it and no longer the address half.** The
  address is closed and is recorded below with the mechanism that closed it. What stays open is that a
  profile's name makes a claim about its own samples that no guard reads: measured by leaving
  `small-integers` named `small-integers` and classed `accepted` while its samples became
  `['1e308', '0.000000000000001', '-1e-300']`, not one of them a small integer — 472 of 472 green in
  `contracts/`, and the one red in `registry/` was `the-served-bytes-are-the-committed-bytes` noticing
  that bytes had moved at all. It is GS-11's shape on a second field, so it closes where the two below
  close: the validation pipeline, the only thing that will ever read a declared name against what it
  describes.
- `outputAlphabet` of `string/slugify@1` and `benchmarks.profiles[].samples.producedBy`, the two
  `one-directional` fields the schema already carried, with GS-11 as the measurement. Closed by the
  validation pipeline, for the reason the entry above closes there.
- **The rule that an alias must not name what its contract refuses to be**, argued in ADR-0023, which
  also carries the criterion. The eight liars are gone, but nothing keeps it: the executable form
  needs each contract to publish its exclusions as data, which is a new frozen field on five contracts
  to buy a check that would still be matching words against prose. Looked for, priced, and declared
  rather than dressed as a mechanism — which is the treatment this list exists to give.
- **The rule that a report may not name a cause no measurement establishes**, whose nine instances are
  repaired and whose class nothing keeps. It closes **one sentence at a time**, and what closes a
  sentence is naming it in *Derive the sentence from the fact* above: three are there, so those three
  cannot drift and the rest are prose that can. That is the recognisable event this list asks an entry
  to carry — a sentence leaves this rule's reach on the day it is computed from what it claims, not on
  the day somebody rereads it. The class-wide form is the one that is refused: the sentences are
  authored in fourteen modules and only their presentation is shared, so a guard would be a lint over
  thirteen files judging prose, at the price the alias rule above was refused at. What would close
  *that* is a validation stage reading this repository's own strings the way stage 1 reads a
  submission's — named so it can be recognised, and not built.
- **What files a contract's declaration may name**, which is narrower than it first looked and is
  recorded with the measurement that closed the wider reading. *A contract is the folder and not a
  file* is kept, in both directions: `harnessOf` refuses any disagreement between a contract's
  declared `files` and what is on disk, and a stray file dropped into `contracts/typescript/date/add`
  reddens **50 guards** under `UndeclaredHarness: … present and not served: stray.ts`. The five are
  not the same list — four carry seven files and `array/group-by@1` carries nine — and that is
  declared rather than drifted: `THE_SEVEN_FILES` is spread into all five, the two extras are written
  beside it as `[...THE_SEVEN_FILES, 'language.test.ts', 'outcome.ts']`, and the constant's own comment
  says they are its own. What nothing keeps is one level up: **the declaration is checked against the
  folder, and nothing checks the declaration.** A sixth contract may name a tenth file and put it
  there, and both halves will agree. Closed by the same thing the entry above it closes by — a
  validation stage reading a submission's folder against what `contractAnatomy` requires of one —
  because the judgement is whether an extra file is a contract's own or somebody's leftover, and that
  is not a shape.
- **The rule that a pin names what is red on every run**, argued in ADR-0076, whose *instance* closed
  and whose *class* stays open. The instance was `G-14` of `string-slugify` pinning
  `p1-two-spellings-one-slug`; that pin is gone, and `G-02`’s was repaired by widening an alphabet
  rather than raising a draw count, with the new rate published as an order and not as a figure — both
  arguments are in ADR-0053. What no mechanism keeps is the general case: a battery sees one draw, so
  any pin is still checked against the run that wrote it, and closing that would mean four runs of
  every cell — the 23-minute replay taken four times. Priced, declared, and not built.
- **A reproduced miss rate that disagrees with what the runs show, by a factor nothing accounts for.**
  It is a fact about the *method* rather than about the cell that revealed it, which is why it does not
  close with that cell’s pin: the same reproduce-and-predict method justifies every pin on a
  property-based guard. Both cheap explanations were eliminated in situ and the model was thereby
  *confirmed*, predicting one silent run in about 6 200 where direct observation gave one in 500;
  pooled over roughly 1 093 trials the model carries a likelihood near 1.3 %. **Unlikely, not excluded,
  and unexplained.** Settling it needs about 5 000 real passes of one cell, roughly an hour and a half.
  **Priced and not spent, on the rule this gap itself produced: a measurement that enters no decision
  is not bought at any price.** ADR-0077 carries the method’s limit and the rule that a repair is
  chosen for its margin rather than its precision; it will enter a decision the day a repair is close
  enough that the factor decides between two candidates.

## Rules for this stage

1. **The registry is being designed one piece at a time, and the order changed once, deliberately.**
   It was data schema, then immutable storage, then the read API, then the publishing tool, with the
   CLI and the website after all four. The first three are written. **The CLI then moved ahead of the
   publishing tool and of stages 2 to 7 of the validation pipeline**, and the argument is the one the
   decision to launch at five rests on: every remaining uncertainty is on the user's side, and none of
   them is answerable in private. Continuing the pipeline first would have been acting against the
   reason that decision was taken — the pipeline judges submissions, in a closed phase there are none,
   and the five contracts are already measured by their own batteries.

   A second argument decided it, and it is a lesson from this repository rather than a preference:
   **a defect in this schema has never once been found by looking at the schema.** Every one was found
   by a consumer trying to use it. The list is here, named, and it is the whole of it — see below for
   why it is a list and not a number:

   - `dependencyDepth`, reduced to a summary no caller could walk — the read API
   - `ProfileSamples`, summarised where a caller needs them whole — the read API
   - `DependencyNode`, because the walk demanded a record no client holds — `toopo add`
   - the two digests of an installed file, `served` and `sha256` — `toopo add`
   - `LockedFeature.askedFor`, so an update could know what had been asked for — `toopo update`
   - the export names in the served index, so a client could say what it installed — `toopo update`
   - `ExportRecord.parameters`, because a case of block 4.4 is a call — the site
   - `CaseTableRecord.groups`, because a case belongs to a group — the site
   - `ParameterRecord.type`, because a form field has to know what it is — the site
   - `list-the-whole-catalogue`, a page with no need behind it — the site
   - `run-the-implementation-on-what-a-reader-types` — the playground

   **This was a numbered series, and the numbers had stopped being true.** Two things were called *the
   seventh*, two *the eighth*, two *the ninth*, and one field was published as both the fifth and the
   seventh in two files. The cause is recoverable and worth recording, because it is the argument: two
   places re-derived the rank from a list they wrote out from memory, both dropped `DependencyNode`,
   and both compensated by counting the lockfile's two digests as two findings instead of one. Each
   list was internally consistent and neither matched the other.

   So the ordinals are gone rather than corrected, by the rule 467 established. **A list is checked
   line by line; a rank is checked only by rebuilding the whole list, which is what nobody did.** What
   the series is about — a schema defect is never found by reading the schema — does not drift, and it
   is the sentence that survives.

   Only the piece currently under way exists; the others do not, because each one constrains the next.
   Everything lives in this one repository, in folders — releases are independent, the history is not.

   **The catalogue ships at five contracts.** The showcase domain moves to after the launch: every
   remaining uncertainty is on the user's side — whether `toopo add` feels good, whether search
   finds something in ten seconds, whether a contract page convinces — and none of them is
   answerable in private. Anything published freezes for life, so the known debts close before the
   launch, not after.
2. **The no-abstraction suspension has ended**, having done its job: three contracts were written by
   hand with no shared code, and what they turned out to repeat *identically* now lives in
   `packages/catalogue/`, under the freeze discipline stated at the top of that file. The bar for adding
   anything there is not "the contracts repeat it" but "the contracts repeat it identically, and
   what it says belongs to the registry rather than to any one feature". Resemblance is not
   duplication: three functions that answer the same question about different data stay apart.
3. **A dev dependency is admitted when it cannot reach the product, and when the mechanism that stops
   it is executable.** Five today — `typescript`, `vitest`, `fast-check`, `@types/node`, `wrangler` —
   and it is the criterion that decides the sixth, not the list: a rule written as four names plus an
   exception grows an exception per tool, where a rule that states its test survives its first case.
   Two mechanisms answer it and both are measured: `files: ["dist"]` decides what `npm pack` ships,
   and `packaging/reachable.ts` prunes `dist` to what the published entry point can reach — so a tool
   no published module imports is absent from the archive twice over, by a declaration and by a walk.
   `@types/node` is types-only and has no runtime footprint at all; without it the mutation instrument
   would either sit outside the typechecker or be written in plain JavaScript, and an unchecked `.ts`
   file would claim a guarantee the repository does not give it. `wrangler` deploys and is imported by
   nothing. ADR-0097 carries the argument, including why a floating `npx wrangler` was refused: a
   repository whose product is that a published version is frozen for life cannot deploy with whatever
   was newest that morning. Feature code still has zero runtime dependencies of any kind.
4. **The root `package.json` no longer carries `"private": true`, and what replaced it is not a second
   flag.** That rule held for this repository's whole private life and removing it is the deliberate act
   of the unit that published the catalogue. `prepack` builds, and one job now runs `npm publish` — the
   workflow's token is still `contents: read`, exactly one job widens it by `id-token: write`, and **no
   runner holds an npm credential**, which is a guard rather than this sentence. A guard asserts the
   field's *absence* rather than its value, so putting it back reddens - and putting it back would make
   every publication fail. ADR-0106, ADR-0109.
5. Working notes, planning documents and status reports do not belong in this repository. Only
   contracts, implementations, tests, the evidence produced by running them, the instrument that
   produces that evidence — including its own fixtures — and the decision records under
   `docs/decisions/`, whose format, address and required sections ADR-0001 settles. A decision record
   is none of the three things this rule refuses: it is not a note, it carries no status, and it is
   what a line of code cites when the reason it exists will not fit beside it.
6. **Fixtures for the instrument live under `mutation/`, never under `contracts/`.** `contracts/` is
   the catalogue and nothing else. A fixture is a toy shaped like a contract so that the instrument
   can be mutation-tested in seconds rather than minutes; a meta-test nobody runs is a decorative
   guard, and the cost of running one is what decides whether it gets run. A fixture is deliberately
   minimal, is never a template for a real contract, and says so in its own header.

## Permanent rules

These outlive the current stage and are not open to trade-off.

1. **No runtime indirection.** No dynamic resolution, no wrapper component, no network call at
   execution time. The only indirection is the user's import path, resolved at install time.
2. **No external npm dependency inside a feature.** A feature depends only on other registry
   features and on native language and runtime APIs. Wrapping an existing library is rejected on
   principle.
3. **No distribution from an external source.** Installations are served only from the registry's
   immutable snapshot, never from a third-party repository.
4. **Never update user code silently.** Notification, readable diff, explicit acceptance.
5. **Never hide a contract's tests.** Contracts are public in full; security by obscurity on them
   is forbidden. Auditability is the product.
6. **No breaking change to a published contract major.** A published version is frozen for life;
   an incompatible evolution creates `name@2` alongside `name@1`.
7. **Nothing trivial in the catalogue.** A contract exists only if it provides something the
   language does not give trivially — non-obvious behaviour, real edge cases, an algorithm, or the
   correction of a language trap.
8. **No validation bypass**, including for the founder's own submissions.

## Conventions

- English everywhere: code, identifiers, comments, tests, commit messages, documentation.
- Conventional commits, atomic. **`main` is pushed at the end of a unit, and a unit is not finished
  until the run it triggers is green** — every suite on two runtimes, the deployment behind them,
  and the one proof that reaches it. The count this line used to carry is gone rather than raised, by
  the rule 467 established one section up: a rank is checked only by rebuilding the whole list, and
  what the sentence is about does not need one. Nothing else: no force, no tag, no rewriting of history. This line read
  *never push and never create a remote* until the CI existed, at which point holding the two apart
  stopped protecting anything and only delayed the reading that says the unit worked.
- **Nothing publishes to npm from a keyboard.** This line read *nothing to npm ever* until `1.0.0` was
  published by hand, which is what made the sentence false and the practice worth replacing rather than
  repeating: a publication is a dispatch of `main` carrying the word `publish`, after the run it depends on
  is green, and no credential exists here to make one any other way. ADR-0109.
- TypeScript `strict: true`.

**How the catalogue is written.** Each rule below is stated once here and argued once in the record
beside it. Where the two ever disagree, the record holds the measurement and this line holds nothing.

- An address — a case, a guard, a group, a reason literal, a benchmark profile — is a name in
  kebab-case, unique within its contract, frozen with the contract's major, and **never a rendering of
  the data it addresses**. The test that decides the next one: falsifying the name and reddening the
  guard are the same event, or they are not. ADR-0017.
- A guard's title is that address, then ` :: `, then a sentence. The registry addresses a guard by the
  pair `(contract, identifier)` and never by the identifier alone. ADR-0019.
- A fallible function answers `T | null` and publishes `describe<X>Failure(...)` beside it, with a
  coupling property tying the two. The reason set is frozen with the major. ADR-0020.
- A contract that answers differently from the language or the ecosystem carries a guard that
  **replays** the divergence on the rows where it happens. ADR-0022.
- An alias is a query whose best answer is this contract, never a phrase that relates to it. It is the
  one field of `identity` that is not frozen. ADR-0023.
- On a page, **the tag is the outline and the class is the look**. A separator belongs to a block; a
  phrasing element gets none. ADR-0025.
- A parser is written once and reached, never copied. **A copy of a parser is not a second opinion, it
  is the same statement written where nobody will maintain it.** ADR-0026.
- A command that can destroy or overwrite shows first and writes on a second word; a command that can
  only refuse writes at once. `THE_WRITE_DISCIPLINE`. ADR-0036.
- **A refusal that explains is a door, one that reports is a wall.** ADR-0039.
- Before writing a rule in prose, look for the shape that makes breaking it not compile — a total map
  over a type, or a union with no way to spell the absence. Where no such shape exists, the rule is
  written in prose *and* recorded below among what nothing keeps. ADR-0054.
- A computed root states how far up it is going, and what it is going up from. A walk over the source
  tree and a walk over the emitted tree look identical and only one moves when a folder does. ADR-0059.
- A pin naming five or fewer red guards names all of them; above five it names only the guards the
  mutant was written to exercise. **Five is a convention and reads as though it were derived**, so the
  distribution it was cut from is published beside it and remeasured when a contract moves it. ADR-0076.

## Verification discipline

This project sells verification. A decorative guard here is not a technical defect, it is a defect
of the thesis.

- A test that cannot fail is not a test. Before claiming a suite is green, break the implementation
  on its real failure condition and show the red output.
- A guard that is structurally incapable of failing must be recorded as inapplicable, with the
  reason — never written as a passing test that proves nothing.
- Every universal property carries a status — applicable or not applicable — together with its
  reason. One declared applicable must have been seen red on at least one plausible mutant.
- **A guard that can find no defect on the day it is written is justified by the event it would catch
  and by what that event would cost**, never by what it finds now. Born green is not the same as
  decorative: the decorative guard is the one that *cannot* fail, and this one fails the day a named
  thing happens. So the entry that proposes it says which event, and what that event costs if nothing
  is watching — and where the cost is small, that is the argument for not writing it. This is the other
  side of *a test that cannot fail is not a test*, and it is easy to invoke as an excuse: a guard whose
  event nobody can name is not born green, it is aimed at nothing.
- **A check that depends on where a line wraps depends on something nobody can see.** Read the text
  with runs of whitespace collapsed, so an expectation is the sentence rather than the sentence plus
  its column width. The alternative is a guard about the instrument going red on a re-flow, repaired by
  transcribing a layout into an expectation, which is one more place the layout is now declared.
- **A guard perturbs the claim, never the object derived from it.** Perturbing the derived object
  establishes that the derivation is self-consistent, which is true of a derivation with a hole in it —
  measured twice, ten units apart, on subjects sharing nothing. It is the cheapest test for a guard
  that cannot fail: ask whether what the guard perturbs is the claim or something computed from it.
  ADR-0087.
- Distinguish what you **measured** (quote the command and its output) from what you **assume**.
  A coherent explanation is not a measurement.
- Report what you left out. Never narrow the scope silently.

**How a figure is published.** The same discipline, on prose rather than on guards. Each is argued in
the record beside it.

- When a sentence can be true without counting, it does not count. That is the form to reach for
  first. ADR-0018.
- A count that survives carries its coordinates: the commit it was measured at, and the population
  counted. ADR-0018.
- A dated number followed by a present-tense claim about the same quantity publishes a truth and a lie
  in one sentence, and it is the lie the reader believes. The clause carries the stamp, or it is
  stated at the commit, or it is not written. ADR-0018.
- A property settles exactly the decisions its alphabet represents, and no others. A named case is not
  bookkeeping beside it, and a battery mutant is what says which of the two settles a decision.
  ADR-0021.
- **An address is not a figure**, and it leaves a comparison by both sides or by neither. A run of
  digits is not evidence of a figure; what decides is the rendering. ADR-0030.
- **A static check passing does not mean the interface works.** A whole class of defect is only visible
  in a real browser, and this repository has paid for that class twice. ADR-0028.
- **A report may state what it observed; it may not name a cause it did not measure**, and an invented
  cause is not repaired by a list of candidates. **An inference offered with its premise is argument; a
  conclusion offered alone is assertion.** ADR-0042.
- Where a sentence claims something happened, compute it from the thing that happened rather than
  asserting it beside. **A sentence that cannot be false is worth more than a sentence somebody
  checked.** ADR-0043.
- A total map over a union beats a pass over real data: the first cannot fail to be complete, the
  second covers what the data happens to reach. **A guard that fires at the right future moment is
  worth more than one that covers the past.** ADR-0055.
- Before measuring a rate, ask whether the guard polices the step the mutant breaks, and whether the
  thing is stochastic at all. **Vary one input at a time and look for a cell that is 0 of *n* or *n* of
  *n*.** ADR-0053.
- **A run of zero over *n* trials bounds nothing until *n* is put beside the rate being looked for.**
  ADR-0056.
- **No rate obtained by reproducing a generator is trustworthy to better than an order of magnitude.**
  The miss rate is a per-draw probability raised to the draw count, so a 25 % error on the input is a
  factor of seven on the answer. Quote the order, name the draw count it was raised to, and let real
  runs decide anything finer. ADR-0077.
- **A repair is chosen for its margin, never for its precision**: take the one whose margin swallows
  the known uncertainty of the method. A repair improving a rate by the factor that method may be wrong
  by has bought nothing that survives its own error bar. ADR-0077.

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
