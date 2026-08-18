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
generator, ten static pages, four of them with a playground that runs this repository's own modules
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
green — measured at `e8f68ca`, with the same defect red once the shared file was put back. `sharedHarness`
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
here is about. A job of `suites.yml` publishes instead, after `needs: site` has reached both matrix
legs, the deployment and the proof against the origin; npm exchanges an identity token GitHub mints and
writes the attestation itself, so **nothing here stores a credential** and there is no ninety-day secret
to renew. ADR-0109. What that job used to wait for was a dispatch carrying a typed word, and ADR-0111 —
below, under its own heading — is why it no longer does.

**The manifest reads `1.0.4`, and it is the first release that corrects neither the program nor the
artefact.** `1.0.0` was published from a keyboard with no attestation and a personal address frozen into
it; `1.0.1` corrected that artefact and nothing else, its `dist/` byte for byte `1.0.0`'s; `1.0.2`
carried out a defect in the program and was the first whose compiled content differed; `1.0.3` carries
ADR-0110, a feature landing at `lib/toopo/string/slugify.ts` rather than at `…/slugify/slugify.ts`, and
was the first whose change a user meets on their own disk. **`1.0.4` repairs a chain of provenance this
repository broke itself**: ADR-0124 reissued all 506 commits of this graph, and an attestation is
addressing like everything else, so the four npm holds name commits of a history that no longer exists.
`npm view toopo@1.0.3 gitHead` prints one and nothing here resolves it. **The four are named by that
command and never written down**, because a citation of a dead commit inside the paragraph explaining
why they are dead is the defect that paragraph describes — the rule that withdrew `1.0.1`'s tree digest,
applied to an address rather than to a figure.

**What it leaves open cannot be closed, and that is the shape of the entry rather than a regret.** npm
does not republish a version, so those four attestations stay wrong for as long as npm holds them: the
chain is reattached forwards and never backwards. **The population is those four and nothing closes
it.** What *was* checkable was checked — **not one of the four commits they would name in this history
sits in a file a published contract freezes**, so the citation sweep reaches every one of them that is
written down rather than the rewrite's own pass being the only thing that ever held them. Three are
cited, in a record, in `packages/registry/address.ts` and in this file; the fourth is cited nowhere. The
frozen population carries two citations and both are the dead identifier this list already records.

**Measured before the rank was chosen, by the method `1.0.2` established** — `npm pack toopo@1.0.3`
unpacked and compared with what this tree builds — 35 modules either side, 434 251 bytes against
434 709, and **8 of the 35 differing**, which are exactly the eight sources that reach the archive and
moved since the publication. Six moved only inside documentation comments, four of them because the
rewrite replaced an identifier of seven characters by another of seven. **The two that carry code are
ADR-0118's `useCases`, and no command reaches them.** **PATCH is founded on one fact and confirmed by
the others**: the manifest declares a `bin` and no `exports`, so nothing here is importable and the
whole public surface is the grammar of the six commands, which has not moved.
`THE_PUBLISHED_IMPLEMENTATION_VERSION` stays at `1.0.0`: a version is half of an implementation's
address, nothing it addresses moved, and the publication is the event ADR-0106 cut that tie for.

**And the dispatch is gone: the number asks for the publication.** It was two gestures for one decision —
a version decided in a commit, a run asked for from a menu afterwards — and between them the tree was
corrected and the package was not, twice in two days, with nothing saying so. The third day it produced a
red: a dispatch of a tree declaring `1.0.2`, refused by npm because `1.0.2` was already published. A job
now reads the listing of versions npm holds, compares it with what this checkout declares, and the
publishing job fires on the difference. **The condition is deliberately not *did this commit move the
number***, which is a proxy: measured at `d8a25ae`, that comparison selects correctly on all five of the
440 commits `HEAD` reaches where the version differs from its parent's, and it would still miss a bump
pushed under a later commit, because GitHub runs a workflow once per push and on the tip. Asking the
registry has no such case, and it is asked as a **listing** rather than as `dist-tags.latest`, which is a
pointer that would go on looking right while meaning something else. **The finding worth carrying out of
this unit is elsewhere**: the line keeping a publication from being cancelled was keyed to
`github.event_name != 'workflow_dispatch'`, so moving the trigger onto a push would have quietly repealed
it — the sentence never became wrong, it stopped being attached to anything. Concurrency is evaluated
before any job runs and so cannot know whether a run will publish; `main` is therefore never cancelled.
ADR-0111.

**The tree digest `1.0.1` published here is withdrawn rather than carried forward.** It appeared twice,
both times in prose, and nothing in this repository computes it — so no reader could rebuild it and it
established nothing that the counts and the per-file digests beside it did not already establish. What
replaces it is the comparison any reader can take with `npm pack` and a digest tool.

**The declared origin serves this catalogue, and that is the half that changed.** `main` builds the
tree in CI and `wrangler` uploads it to Cloudflare Pages. Measured at `27d1dbb` over **all 76 addresses
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

**A feature now lands as a file, and this was the last unit that could take that decision.** The
installed path is `lib/toopo/string/slugify.ts` and no longer `…/slugify/slugify.ts`; a second file, if
one ever exists, lands in a folder of the same name **beside** the entry rather than around it. What
decided it is that the two layouts are identical while no feature has two files and this one is
strictly better on the day one does — so there was no trade to make. **The folder is a door and not a
feature**: `referenceImplementationOf` filters an implementation's files to `reference.ts`, so nothing
can put anything in that folder until a separate unit opens that filter. The window was closing because
an installed path lives in every user's lockfile, and today there is one. Measured against `tsc` 7.0.2
under all three module resolutions and against four bundlers covering three resolver implementations,
differentially — both layouts side by side, so that a failure of the probe's environment could not read
as a failure of the shape — with *resolved* meaning the helper's value found inside the produced bundle
rather than an exit code. Node's own standard library carries the shape 12 times in the 69 entries of
`lib/`. **One user-visible cost, accepted rather than smoothed:** a file the user has edited is kept
where it is and the new copy written beside it, so they hold two. ADR-0110.

**The site has a visual system, and the contract page is built on it — the page a stranger lands on
from a search, and 99 % of this site at a thousand entries.** Six type sizes and no seventh, one
spacing unit every length is a multiple of by construction, colour roles rather than colours, one
accent, dark by `prefers-color-scheme` with no button and nothing remembered. **The accent means *you
can act on this* or *you are here*, and never a verdict**: this catalogue publishes every mutant its
suite did not catch beside the ones it did, and a colour survives neither `toText` nor `toMarkdown`, so a page
that sorted its own evidence by colour would say what its reading does not. The page is a card — name,
sentence, command, four figures, signature — and then everything, with nothing behind a fold, which is
the shape a differential trial on `date/add@1` and its 50 cases settled. **Two greys and not three**:
the mock-ups' fourth answers 2.64:1 on light paper while carrying the case identifier, and the value
they draw `dim` at answers 4.24:1 on a case a reader has just followed a link to. Both readings are
arithmetic now rather than something somebody remembered to take. ADR-0115, ADR-0116.

**The web font is refused, and coverage is what refused it rather than weight.** Measured on
`@fontsource/ibm-plex-mono@5.3.0`: two weights of the Latin subset is 29 596 B and three is 45 216 B,
against an estimate of ~26 kB. What decides it is that Plex's `latin` range carries U+2191 and U+2193
and **not U+2192** — the arrow between every call and its answer, 157 times across the four pages — and
that `string/slugify@1` alone carries 59 distinct mono code points outside it, 57 outside `latin-ext`
too. Those are what that contract settles cases *about*. The system stack renders them because an
operating system composes fallbacks a page cannot ship. **What the refusal costs is named rather than
smoothed**: `ui-monospace` is a different face on every platform and no reading here covers more than
this machine; what survives is what was specified in units that travel, the case column in `ch` and
the scale in `rem`. ADR-0115.

**A contract page now says what the function is for in real life, and where that text lives was the
decision.** `string/slugify@1` carries four use cases — a call as somebody makes it, and the one thing
to know before relying on it. It is published, so both obvious homes were closed by permanent rule 6
and both were measured rather than reasoned about: a field in `identity` moves its digest from
`855107da…` to `bd256afd…`, and **one comment appended to `contract.ts` moves it to `84403f0c…`**,
because `contractSnapshot` freezes the seven files' digests too. So the field is **standing** — the
mechanism written for *may the registry change its mind about this after publication*, whose own
comment had named this field before it existed. Measured: the eight ledger digests are identical to
the byte with four use cases declared, and `npm run freeze` is green. The page's sentence *nothing here
is part of the contract* stops being an assertion. It carries no identifier, because nothing cites it
and an address on rewritable prose will one day name something else; the warning is a required field,
because that is what a use case is worth reading for. ADR-0118.

**And the page is read in two halves.** Measured at `f05951f`: 3 800 visible words over eight sections
of one weight, of which **2 482 — two thirds of everything under a heading — were the settled cases**.
The complaint was never the length. Above the line: what it does, a form, the jobs it is for — 754
words. Below: the signature, the cases, the properties, the profiles, what a reader can check — 3 262.
**Nothing is folded**, and the mock-up this cut came from proposed folding by group; ADR-0116 settled
that against a differential trial, and the line is written into the record so it does not return
through a later mock-up. `the-rail-of-a-page-names-every-section-of-it-and-only-those` needed no
change, which is what a derived table of contents buys. ADR-0119.

**A domain has a page, and every page now says where in the catalogue you are standing.** The level
between the catalogue and a contract was a 404: `/typescript/string/` is where a reader climbs to from
a search result, and it is the only unit a navigation can be built on at a thousand contracts. Three
pages and not four — `array` holds one entry, refused before publication, and a page carrying an empty
list answers nothing the refusals page answers less well. **Its opening sentence is composed and never
written**: the mock-up's hand-written line would have been a fifth statement of what is in a domain,
beside the list under it, the index, the sitemap and each contract's summary, and it is the one a
reader believes. Every term is read off the registry, so a fifth contract lands in that sentence with
nobody editing it. The column is a *sibling* of the rail rather than a part of it, because
`the-rail-of-a-page-names-every-section-of-it-and-only-those` requires every link inside `.rail` to be
a section of the page — and it is placed by the grid rather than reordered, so the document a screen
reader announces is the one a sighted reader sees. ADR-0121.

**The measure is written in characters and reaches every face, and the ceiling was never held before.**
Measured at `81bf9bc` over 688 prose elements, one Range per character grouped by line box: **255 lines
over 75 characters, worst 169**. The rule existed — `body` laid its content out in a 74ch column — and
`.shell` spanned the whole width by declaration with nothing under it re-establishing one. **The half
worth keeping is the other one**: `ch` is the advance of `0`, so a container capped in `ch`
under-constrains anything set smaller than it, and the 169-character line was small print in a wide
box. The measure is therefore declared on the element that carries the prose. The constant is a
measurement and not arithmetic, and it carries the method's own drift: density moves when the column
moves, 1.339 before and 1.393 after, so 1.04 is applied on ADR-0077's rule rather than noted.

**It was re-taken when the columns moved, and ADR-0122 holds that reading rather than this line.**
What is worth carrying here is that the two readings are not the same population: the second sweeps
every element the rule names — `h1, h2, h3, h4, p, li` — over every page of the tree, and groups
characters into line boxes by vertical overlap rather than by a rounded `top`, so a `code` span set
smaller stays on the line a reader sees it on. **The `910` above is not reproducible by it**, it is
four to five times short of what that method counts, and nothing here says which population it was.

**A ceiling belongs to the block and never to the column, and the owner found that on his own screen
before any check here did.** Three container ceilings were in play and the smallest was the one named:
`main` at 45rem, `.shell` at 78rem — which named no question anywhere in this repository — and the
body's own grid track at a *measure*, which is a bound on a line applied to a box. Only the domain and
contract pages carry a `.shell`, so that third one bound the card, the code blocks and the lists of
the other four pages at every width. Measured at `456ee44` over all eleven files of HTML at four
widths: **17.5% of a 2 560px screen on the front page, 38.7% on a contract page**. Each block now says
what it is worth — a card and a code block as wide as their content, a case table one width for every
row — and the layout is derived from the widest of them, `2 * measure + gap`, which resolves within
3px of the 78rem it replaces. After: **46% on a contract page**, and the settled cases render their
157 calls in 223 lines instead of 325. **Three pages did not move at all, and that is the answer**:
every child of them is prose, prose is bounded on the line, and the container was never what bound
them. ADR-0122.

**A wide screen is now filled by a column, and the line did not move.** ADR-0122 named this unit in
its own reopening section — the front page's 19.8% was a page whose every element is prose, which is
evidence that no ceiling made it narrow and not evidence that the page was right. A contract page's
table of contents crosses to the right of the content, the front page gains a column carrying the
three sections it used to queue under the catalogue, and both lists of contracts go two abreast where
there is room. Measured over all eleven pages at 1440, 1920 and 2560, by ADR-0122's own definition of
the share: at 2 560 the front page **19.8% → 48.1%**, a contract page **45.9% → 55.9%**,
`/typescript/string/` **29.6% → 45.8%**. The measure held, which was the thing at risk: **0 of 11 964
prose lines over 75 characters, worst 70**, against 0 of 11 913, worst 70. **Not one word of the site
changed** — the three sections keep their `h2`, so the outline, the Markdown twin and the sitemap are
identical, and the only matter added is four figures derived from the batteries. **The domain page
keeps two columns**, because a third would have carried the four figures its opening sentence already
composes and ADR-0121 composed them precisely so they would not be stated a fifth time. ADR-0123.

**`--the-shortest-line: 45` is the shape to reach for, and it is worth more than the layout it
bought.** The column of secondary matter needed a width, and the stylesheet had declared the answer
for a year without deriving it: *45 to 75 characters is the span a line stays readable across*, of
which only the top was a length. **No number entered that file that was not already argued for in
it.** The same move settled the two-abreast list with no breakpoint at all — `auto-fit` over a floor
of one measure is two columns exactly where the column is two measures wide — so the value the owner
will flip is a length in the palette and never a grid to restructure.

**One width in that stylesheet is typed, and the language is why rather than the author.** `var()` is
not allowed in a media query's condition, in any browser, so the three-column threshold is the
arithmetic of its own tracks taken on one machine and rounded up. It is written beside that
arithmetic, it degrades by squeezing rather than overflowing, and it is on the list below as the thing
nothing keeps.

**Four defects came out of a browser and out of no static check**, which is the third time this
repository has paid for that class. Two rules 13px apart where a list item and the heading inside it
each drew one; and section gaps of 0, 8 and 16 where the system declares one — every instance a
`margin` shorthand on a class silently outranking `h2 + p` on specificity. Measured after: 100 section
headings at 12px and nothing touching.

**A guard of the site suite had been reddened by nothing since it was written, and the battery said so
to nobody.** `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` was reported
unaccounted for by `npm run battery site` at `81bf9bc` and at every commit before it — measured both
ways, by checking the base out and running the battery there. W-24 looks as though it covers it,
because it replaces the inline stylesheet with a link; it does not, because **with no style element the
guard finds no palette, its loop runs zero times and it passes**. A guard passing vacuously, in the one
folder whose subject is that a page can be read. W-24b closes it. **The finding to carry is that no
battery is replayed in CI**, so a battery's disagreement with itself waits for somebody to run it.

**And the catalogue's own prose is parsed by the function that already parsed the method page's.**
ADR-0026 scoped that guard to one page and named the event that would reopen it — a second page taking
prose written for a reader of source. 220 literal backticks were reaching readers across the four
contract pages, 110 of them on `string/slugify@1` beside 51 `code` elements produced correctly on the
same page. What settled the register ADR-0026 said nothing mechanical could settle is that **every one
of the 220 is paired**, so there is nothing to guess at. ADR-0117.

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
decision record.** They are a list and not a sentence, and that is a repair rather than a layout:
this paragraph was a chain of nine clauses joined by semicolons, one unit having added each, and it
carried five hands at `2385fc2` — the joint-highest in the repository. A closure is one line, so
adding one cannot lengthen anything a reader has already read. ADR-0112.

- two closed by stage 1 of the validation pipeline — ADR-0005;
- three closed by the two-phase write — ADR-0039;
- the class of a declared address nobody resolved — ADR-0060;
- permanent rule 6, which was never on this list — ADR-0093;
- the three about what git holds, a citation that resolves, an address no commit carries and a
  checkout nothing leaves behind — ADR-0095, all three together because they are one walk over the
  same graph;
- the playground reading what a reader types — ADR-0096;
- a replay that could not finish — ADR-0102, which found a second entry for this list on its way out
  and put it there;
- the address a host serves — ADR-0103;
- an archive that really installs a feature — ADR-0104, on the event it had named, leaving two
  entries behind it: one for the third guard it did not bring back, one for the revision it reports
  without resolving;
- the address the emitted tree never loses — ADR-0125, over the pages a listing names, leaving behind
  it the addresses no listing names and the chain of runs the reading is inductive over.

**The address a host serves is where rule 2 above was broken, by the commit that built the
mechanism.** The entry
was closed in fact by `45f702f`, the move to Pages, which changed eight files and none of them this
one — so for three commits this list carried a live entry about a redirect that no longer happened,
and the paragraph above it described the host that had been left behind. Nobody was misled only
because nobody read it in that window. **A mechanism and its entry are one event and the rule already
said so**; what this instance adds is that the sweep is owed even when the mechanism looks like a
one-field configuration change, because it is the *entry* that names the fact, not the diff.

**The playground reading what a reader types is the only entry this list ever carried that no guard
could have caught**, because it was a decision taken in conversation and written nowhere — the repository held no half for the code to
disagree with. It is also the entry that paid for itself twice over on the way out: closing it found
*two* published sentences of this repository false, both in the record that had argued the opposite
position, and both of the class the entry was about. One clause asserted that a raw text field could
not express a lone surrogate, which a browser refuted. The other was worse and was invisible to every
reader for a year — the two rows ADR-0028 printed to *demonstrate* that a no-break space and an
ordinary space carry opposite answers were **identical, byte for byte**, having lost the no-break space
somewhere they were written. A block whose entire purpose was to show two things differing showed the
same string twice, with two different reasons beside it, and nothing could have caught that either.

**The finding this section has to keep is the one above, because it is about the section rather than
about any entry.** *A published version is frozen for life* is the biggest `one-directional`
declaration this repository has ever carried — it is the whole security argument, every lockfile in the
world would hold the digest it moved, and it is what the product is sold on. It has been in this file
since the first commit, 367 commits before `d75ac8f`. This list has existed for 271 of them, for exactly
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

**One entry of this list is not of this list's class, and it is first because of that.** Every other
entry says *nothing keeps this rule*. This one says **the mechanism does the opposite of what the
record declares**, which is a worse thing and has never been named here before.

- **That an alias is not frozen with the major.** ADR-0023 decides it in as many words — *nobody links
  to an alias, no answer cites one, and correcting one breaks nobody's code; being wrong about an
  alias costs a revision* and not a major. `searchAliases` is a field of `identity`,
  `contractSnapshot` freezes `identity` whole, and since ADR-0106 the four contracts are bound at
  `d3a5166`. Measured at `f05951f`: adding one alias to `string/slugify@1` moves its contract digest
  from `855107da…` to `5fe0ecfa…`, which `every-published-binding-still-hashes-to-what-it-was-published-as`
  refuses. **So the cheapest of the three contributions this project invites is the one that cannot be
  accepted**, and a reader of ADR-0023 leaves believing they can make it.

  **It was harmless for the whole of this repository's private life and became live at a publication**,
  which is why no sweep found it: nothing was anchored, so nothing could be broken. It is the same
  event as the two ADR-0093 misses recorded above, arriving on a record that had *argued* the field was
  unfrozen rather than on one that had forgotten to say so.

  **ADR-0118 built the mechanism and deliberately did not use it here.** A field of the standing is of
  a contract and outside the digest, which is exactly what ADR-0023 describes; moving `searchAliases`
  there would move four published digests, which is the change permanent rule 6 forbids. **The
  population is the eight aliases of the four published contracts.** What would close it is not a
  guard: it is a way for the registry to bind a *second* contract digest under one address — a
  revision, which is the word ADR-0023 already uses and which nothing implements. Priced as a unit of
  the publishing tool and not built. What is done instead is that both places a reader meets the claim
  now say it is not kept: the head of ADR-0023, and this entry.

**Still open, and what each one now costs.**

- **That a citation inside a file a published contract freezes ever resolves again.** The two shared
  files carry three identifiers of a history that no longer exists — `3ec99c5…` twice in prose, and
  `THE_ANATOMY_WAS_MEASURED_AT` in `every-contract.ts`, which is a constant and not a comment. They
  cannot be repaired: the digest covers those files byte for byte, so the edit that would fix them
  rebinds four published addresses, and permanent rule 6 forbids it. **The population is every file a
  published contract freezes**, which today is `packages/catalogue/every-contract.ts` and
  `packages/catalogue/identifier.ts`, and it grows by seven files with each contract published.

  **The fact that makes this an entry rather than an internal untidiness is that those files are
  served.** An auditor who fetches a contract's snapshot receives the shared harness with it, so what
  arrives on their disk carries three identifiers that resolve nowhere — in the one artefact whose
  whole claim is that it can be checked without taking our word for anything.

  `theEditableSources` is the honest half: the citation guard sweeps what this repository may still
  edit, and says so rather than claiming a sweep one part of which is out of reach. **What nothing
  keeps is that the next frozen file carries a fourth.** What would close it is a validation stage
  refusing a commit identifier in a file a submission freezes — which is the same stage three entries
  below already name, priced there and refused there as a lint over prose. Written into that stage's
  requirements rather than built. ADR-0124.

- **That an identifier this repository writes bare is one somebody can follow.** `A_CITATION` matches
  seven hexadecimal digits closed by a backtick, and that form was measured rather than chosen — it
  separated 58 of 68 citations from all 29 benign runs on the day it was written. **What it does not
  match is an identifier written bare**, and `history.ts` claimed for three records that the ones it
  misses are quoted elsewhere in their own file and reached anyway. That claim is false: a `git log`
  excerpt in ADR-0111, the `npm run hands` table in ADR-0112, and two ordinary comments in `style.ts`
  write identifiers no backtick in those files repeats.

  **It was found by this rewrite and not by a guard**, which is the whole of why it is here: every one
  of those had to be translated by hand, and the guard would have been green with all of them dead —
  the exact morning ADR-0095 says this module exists to be red on. **No rank is published**, on the
  rule that a sentence which can be true without counting does not count, and the shape is what a
  reader needs: an identifier inside a fenced block or a comment.
  `git grep -nE '\b[0-9a-f]{7,40}\b' -- '*.ts' '*.md'` names the population at any commit.

  **What would close it is widening the form to every run that resolves**, and the reason that is a
  decision rather than a one-line change is what the narrow form was bought for: a truncated digest, a
  decimal constant and a deliberately fake identifier all have to stay benign, and resolution rather
  than shape would have to be shown to separate them. Priced as its own unit and not taken here,
  because a rewrite is the wrong place to widen the guard that reads it. ADR-0124.

- **That a breakpoint is the arithmetic of the lengths it separates.** Two guards now keep that every
  ceiling and every track of this site's layout is derived — `every-ceiling-on-a-box-is-derived-and-never-typed`
  and `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` — and **neither can read
  the one place a width is still typed**, because `var()` is not allowed in a media query's condition
  in any browser and never has been. **The population is the three conditions of `style.ts`**: `52rem`,
  `64rem` and `97rem`. Each is computed from the same declared lengths the rules under it use, each
  carries that arithmetic in the comment above it, and nothing compares the two. The failure is quiet
  by construction: a threshold that no longer matches its own tracks does not break a page, it moves
  the width at which the page changes shape, and only a reading at exactly that width would say so.

  **What would close it is not a lint and the price is a browser.** Every one of those lengths
  resolves against `ch`, which is a property of the face the reader's own system supplies, so the
  arithmetic cannot be evaluated by anything that does not lay text out — the guard would be the
  eleven-page sweep this repository already takes by hand, made into a suite with a browser as a dev
  dependency. That is the trade stage rule 3 admits only where the mechanism keeping a tool out of the
  product is executable, and it would buy a check on three integers. **Refused knowingly, and it is
  the whole of what ADR-0123's third reopening trigger is about.**

- **That a paragraph of prose has been read whole by somebody.** ADR-0112 makes it measurable: a
  paragraph has an author when one commit's blame covers every one of its lines, `npm run hands`
  counts them, and at `2385fc2`, over all 362 tracked sources, **32 paragraphs of 8 046 carry three
  hands or more**. Of the 22 in the three populations that unit swept, **nine needed rewriting and
  thirteen did not** — so the reading designates a zone rather than measuring a defect, and it is
  worth taking again but never worth acting on unread. **The population is every paragraph of prose
  this repository holds**, and nothing keeps it between readings.

  **A guard is refused rather than unbuilt, and the argument is the reflow.** `git blame` attributes a
  line to the commit that last changed it, so a commit that rewraps a paragraph returns it to one hand
  with the prose untouched — a check whose cheapest satisfaction is a whitespace change, which is a
  ritual and would be read as coverage. Its red event is the wrong one too: *somebody edited prose
  twice*, not *prose is defective*. What stands in a guard's place is that the reading is a **command
  and not a number in prose**, which is the treatment the `1.0.1` tree digest was withdrawn for
  lacking. It closes the day a reading's repaired-to-healthy ratio approaches *n* of *n*, at which
  point a refusal becomes arguable — against the reflow, which does not go away.

  **Two instances are left standing and named rather than swept up.** `mutation/census.ts` carries *A
  twelfth on the licence* and *A thirteenth on the narrowing*; `packages/registry/local-read-api.ts`
  carries *The third reader of one source*, which is true today and states its own population one
  paragraph below. Both are the rank defect the four vitest configurations were repaired for, and
  neither is in a population that unit swept.

- **That the spelling this product prints resolves wherever it says it does.** `renderImportLine` ended
  *the one spelling TypeScript and every bundler resolve* until ADR-0110, and that clause was wider
  than anything ever measured. It now claims only the TypeScript half, which is settled by a **total**
  reading — TypeScript offers three module resolutions and all three were read at `tsc` 7.0.2 — so the
  surface a user meets at every install no longer over-claims. That is the cheap half and it is done.

  **What stays open is the half that was taken off the surface rather than closed.** ADR-0110 read the
  layout against four bundlers — esbuild, vite, rollup and webpack, three distinct resolver
  implementations, chosen on weekly npm downloads rather than on convenience — and all four resolved
  it. **Four is not every.** Unread: rspack, Parcel, Bun, Deno, and every version of the four but the
  one measured. **The population is every bundler and every version of one**, which is unbounded, and
  that is the whole shape of this entry: it is a claim no amount of measuring can keep, which is why
  the repair was to stop making it rather than to measure further.

  What would close the part that *can* be closed is a suite that bundles the emitted layout with each
  resolver the way `packaging/against-the-origin/` performs a real install — a guard that reddens the
  day a bundler changes its mind, rather than a reading somebody took once. The price is named: a
  bundler apiece as a dev dependency, which stage rule 3 admits only where the mechanism keeping it out
  of the product is executable, plus a ninth suite that no battery replays and that no other suite's
  verdicts may depend on. Not built, and not urgent while nothing published says more than was
  measured.

- **That the bound the origin proof waits is one somebody measured.** A deployment returns before it
  has propagated, and part-way through a rollout the origin answers the catalogue index from one commit
  and a contract's bindings from another — at which point `toopo add` refuses, correctly, and the proof
  against the origin reddens with the product working.

  **This entry predicted the wrong failure, and it was refuted by observation rather than by
  argument.** It read *the day propagation exceeds it, CI is red with nothing wrong, which is the exact
  failure the wait was written to remove*. Measured at `d739337`: the bound was **never consumed** —
  the waiting line the pre-flight prints appears in neither of that commit's two run logs — and CI was
  red anyway, once in two runs. The pre-flight read one revision and returned on its first attempt; the
  installed client, seconds later, read the index from `d739337` and the implementations from
  `013f688`. **An agreement observed on one reading says nothing about the next**, and no reading taken
  inside the suite can be the client's, because the client is another process. The cause is the alias
  and not a cache: Cloudflare Pages makes a hash-based deployment address atomic and updates a branch
  alias to point at it, `toopo.dev` is that alias, and `CF-Cache-Status: DYNAMIC` on all three
  addresses says nothing was served from an edge cache. ADR-0108 replaced the pre-flight with a bounded
  retry of the chain, driven by the client's own refusal. **A prediction that observation refutes is
  replaced by what was measured, never by a second prediction**, which is why nothing above says what
  will fail next.

  **What stays open is what this entry always meant, with the prediction removed.**
  `THE_PROPAGATION_BOUND` is two minutes chosen against the cost of the step and not against
  Cloudflare. **It has readings and it has no population**, and the two are not the same thing. Both
  readings so far are of the retry firing on the real condition — the index from the old deployment,
  the bindings from the new — and both are the span from the client's first refusal to a finished
  chain: about **10.8 seconds** at `206190d`, and about **5.5 seconds** at `1048d89`. Neither is within
  an order of magnitude of the 120 seconds the bound allows.

  **Two readings do not become a population by being written down, which is why they are written as
  the pair they are.** A line per deployment would be a list nobody rebuilds and a figure nobody can
  check; what would close this is the same span over enough deployments to say whether 120 seconds is
  generous or lucky, and the retry records both ends of it on every run that waits, so the runs hold
  what a later reading would be built from. Not built, and the next reading is worth adding here only
  if it approaches the bound — which is the event this entry is actually about.

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
  environment protection with the token this workflow carries has not been measured. Not built.

  **The two sides do agree, and that half is now measured rather than awaited.** This entry read *the
  first dispatch is what will say whether the two sides agree at all*; the dispatch was made and it
  published. Read at `2efc482` off npm's own record: `_npmUser` is
  `GitHub Actions <npm-oidc-no-reply@github.com>`, `dist.attestations` carries a
  `https://slsa.dev/provenance/v1` provenance, and `gitHead` names the commit. An identity token was
  minted, npm exchanged it, and the attestation was written — so the four strings and the environment
  policy were the ones this file claimed, on that day. **What is not closed is anything about tomorrow**:
  three of the four are still strings this repository can rename on its own, npm's configuration still
  carries no branch, and one successful exchange is not a mechanism. ADR-0111 did not touch any of the
  four, which is worth stating because it moved the trigger and could have.

  **A second reading exists, it was taken across the event most likely to have broken it, and it is
  stronger than the first in one specific way.** ADR-0124 reissued all 506 commits of this graph. Read at
  `f95c4fa` off npm's own record and off the attestation behind it, for `1.0.4` — the first release
  published after the rewrite: `_npmUser` is unchanged, `gitHead` is `f95c4fa` and `git cat-file -t`
  resolves it here, and the provenance names `refs/heads/main`, `https://github.com/toopohq/toopo` and
  `.github/workflows/suites.yml`. So the four strings and the environment policy survived a rewrite of
  every identifier in the history, and `event_name` reads `push` — ADR-0111's trigger, confirmed from the
  side this repository does not write.

  **What is stronger is that the provenance carries two identifiers and not only names.**
  `repository_id: 1319617655` and `repository_owner_id: 280416883` are stamped by GitHub and a rename
  does not move them, so an attestation already published goes on naming the right repository whatever
  this side is called afterwards. **That is true of the attestation and false of the configuration**: npm's
  trusted publisher is keyed on the four strings, three of which this repository can still rename on its
  own, and a rename would stop the *next* publication with every guard here green. Both halves are written
  because the entry read blacker than it is with only the first.

  **Both sides were configured on 2026-08-17, and this paragraph is the entire record of it.** The
  trusted publisher on npmjs.com names `toopohq`, `toopo`, `suites.yml` and the `npm` environment, with
  `npm publish` as the permitted command and publishing access at its strictest setting; the GitHub
  environment exists and is restricted to `main`. **None of that was read from here and none of it can
  be** — it is reported by the person who typed it, which is precisely the shape of the one entry this
  list ever carried that no guard could have caught: a decision taken in conversation, with no half in
  the repository for the code to disagree with. So it is written down where the next session will meet
  it, and it does not make the entry above any less open. **The publication that followed is what turned
  that from a report into a reading**, and it is recorded one paragraph up rather than restated here —
  what a successful exchange establishes is that the four strings and the policy were the ones this
  paragraph claims, on the day it was written, which is exactly as much as one reading ever establishes.
- **That the gate on the publishing job is a conjunction.**
  `the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version` resolves both ends of the
  reference the gate makes — the `if` names a job's output, that job is waited for, and it exists — and
  it reads the condition's *content* and never its *shape*. **An `||` added to that expression leaves
  every guard green**, which is the plausible spelling of somebody widening the gate rather than of
  somebody attacking it. The population is the publishing job's condition. **It is priced low and
  refused on the price, not overlooked**: bypassing the version clause makes every push of `main` reach
  `npm publish` and be refused on a version that already exists, so the failure announces itself on the
  next push instead of publishing something wrong — which is the argument `CLAUDE.md` states for not
  writing a guard whose event is cheap. What would close it is reading the structure of the expression,
  and that means this file's YAML sweep learning what an operator is, on a repository that has no YAML
  parser and will not gain a dependency to hold one guard. ADR-0111.
- **That the one module of this repository which runs in a browser does what it says.**
  `packages/site/start.ts` builds the playground form and, since ADR-0116, the copy control beside the
  install command. **Nothing executes it.** `playground.test.ts` imports the functions it calls and
  runs the stripped reference through a `data:` URL, which is the hard half and is measured; what is
  not is the file that touches a document. `a-page-with-no-javascript-is-prose-and-never-a-control-that-does-nothing`
  asserts the *absence* of a served control and says nothing about the built one.

  **The population is `packages/site/start.ts`**, and the event is worth stating because it is not the
  obvious one: `copyControl` runs first in `start`, so an edit that throws there takes the playground
  with it — and the section does not look broken, because the prose that stands in for a missing form
  is exactly what a reader sees when the form was never built. What would close it is a document in
  the site suite, which means a DOM environment, which means a sixth dev dependency for one file of
  fifty lines. Priced and not spent; the entry exists so that the next unit adding to that file knows
  it is writing into the one place here nothing measures.
- **That every surface renders the invocation rather than the bare command name.** This one was met by
  a visitor rather than found by a sweep: the README and the four contract pages published
  `toopo add string/slugify`, which answers `command not found` for anybody who has installed nothing —
  the first thing a visitor does, and it failed. `THE_INVOCATION` is the one spelling measured to work
  in all three situations — nothing installed, installed globally, installed as a project dependency —
  and the README and the emitted pages now carry a guard apiece over their own surface.

  **The client's own screens carry none, and that is the open half.** Every one of those strings is
  converted in this tree; nothing stops the next one being written bare, and the reader it would fail
  is the one the `npx` path just made canonical. **The population is every user-facing string of
  `packages/cli/`.**

  **The half about the artefact closed, and the sentence that recorded it was false for four commits.**
  It read, measured at `f065a7f`, that `npx toopo list` answers `Take one out with toopo remove
  <domain>/<name>` because *npm serves `1.0.1`, which predates the conversion* — and it went on saying so
  after `2efc482` published `1.0.2`, which carries the conversion. That is this list's own recurring
  failure arriving on this list: a dated measurement with a present-tense clause beside it, where it is
  the clause a reader believes. **What made it a four-commit lie rather than a permanent one is that a
  publication now happens on a number rather than when somebody remembers**, which is the same event
  ADR-0111 was written for.

  What stays open is the population and nothing else: **every user-facing string of `packages/cli/`**.
  Every one is converted in this tree; nothing stops the next being written bare. What would close it is
  not a shape — no spelling of a string literal makes the bare form fail to compile, which is ADR-0054's
  other branch — but the validation stage reading this repository's own strings, already named twice on
  this list, already priced and already refused as a lint over prose.

  **What the two guards that do exist cost is worth recording, because both were narrowed by
  measurement rather than by taste.** Sweeping every occurrence of a command on the site went red on
  nine mentions, and sweeping every line beginning with one went red on four more — all thirteen mutant
  descriptions the method page publishes, where the command is the subject of a sentence and nobody is
  being told to run anything. So the site's guard is over the install command and recognises one by the
  fact that **it names a contract of this catalogue**, and the README's is over what sits inside a shell
  fence. Neither is a sweep for the word, and a rule that swept for the word would be wrong.

- **That a decision can name what confirms it, when what confirms it is a guard over the five.**
  ADR-0001 requires `confirmed-by` present and non-empty, and a guard is addressed by the pair
  `(suite, guard)`. `guardsCollectedIn` reads a guard's *written* title, so an `it.each` over the
  catalogue is collected as `…-%s`; `guardAddressFaults` requires a frozen identifier and `%s` is not
  one. **So a decision whose subject is per-contract has no citable guard at all**, and nothing says
  so — the author discovers it as nine faults from
  `every-guard-a-decision-names-is-one-its-suite-collects`, which reports that the suite collects no
  such identifier and not that the identifier could never have existed. Measured at `10abc40`: zero of
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
  fine. **The population is every cell of every battery**, 586 anchors across 82 files at `e8f68ca`, and
  what makes it worth an entry rather than a note is that the failure is silent in exactly the tool
  built to prevent it. What would close it is not a second lint over the text: it is injecting each
  mutant and typechecking the tree, which the replay already does one cell at a time — so the cheap form
  is `check-anchors` learning to apply the replacement and refuse a result the compiler rejects, and the
  price is that it stops being a pure read of the working tree. Not built.

- **That a battery's disagreement with itself is ever read.** `npm run battery <name>` ends by pairing
  every guard of its suite against the mutants that redden it, and refuses a run where a guard is
  neither witnessed nor declared unreachable. **No workflow runs it.** `suites.yml` runs the eight
  suites, the deployment, the proof against the origin and the publication, and not one battery - so
  that check fires when somebody happens to type it.

  **It is not hypothetical and the population is not zero**:
  `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` was unaccounted for by the site
  battery from the commit that wrote it until `916b9f4`, measured at `81bf9bc` and at HEAD by running
  the battery at both. Nothing was red anywhere, and the guard passed vacuously the whole time. What
  closes it is not a guard but a job, and the price is what stage rule 1 says about the replay: the
  full instrument is tens of minutes, one battery is minutes, and nineteen of them in a matrix leg is
  the whole run again. **The population is every battery of this repository.**

- **That a count of this site's own pages is one somebody took.** The stylesheet's header said *seven
  pages served once each*; the generator writes **ten**, and the tree holds **eleven** files of HTML
  with the 404. It has been wrong since ADR-0121 added three domain pages, and it did real work: it
  is where the figure that opened this unit came from, and the session that read it planned against
  eleven and then twelve before counting. **The population is every statement of a page count in this
  repository**, and it is not small — `seven pages` occurs fourteen times across ten files, `eight
  pages` once in the stylesheet's own measure paragraph, `ten pages` once here. Most are stamped
  measurements inside records, which do not drift by rule; the two that made a present-tense claim
  are repaired, and the rest are named here rather than swept, because sweeping a record's dated
  reading would falsify it. **What closes it is the form and not a number**: a sentence that can be
  true without counting does not count, which is what the stylesheet's header now does. What nothing
  keeps is that the next one written will reach for a number again, and the executable form is the
  validation stage reading this repository's own strings — already on this list, already priced,
  already refused as a lint over prose.

- **That a set of examples is not narrower than what the contract it illustrates settles.** ADR-0120
  states the rule and refuses the guard in the same breath, and the refusal is the part worth
  re-reading before somebody writes the guard anyway: the proposal was to sweep Unicode ranges, which
  is mechanical and cheap, and **it would have been green on the defect that motivated it**. Two of
  `string/slugify@1`'s four use cases were French; the set already carried `日本語テキスト`, so a sweep
  over writing systems sees three Latins and one Han and has no opinion. Three languages in one script
  are three languages. The stronger form — one example per language — is the heuristic the script
  proposal existed to avoid.

  **The population is every set of examples the catalogue publishes**, which today is four use cases on
  one contract and is four per contract on five when the other three are written. Each example on its
  own is verified: `every-use-case-replays-through-the-stripped-artefact-a-browser-runs` executes the
  call and compares the answer. **What nothing reads is the set as a set.** It closes where two entries
  above it close, in a validation stage reading a submission's own strings, already priced and already
  refused as a lint over prose.

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
  and that is the whole shape of this entry rather than a detail of it: measured at `efb26d1` over
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
  nature rather than improved**. Measured at `ed1abfd` on Workers static assets: every named and every
  content-addressed answer arrived with **no `Content-Type` at all**, because they are files with no
  extension and nothing told the host what they are. Measured at `27d1dbb` on Pages, over all 76
  addresses: the pages, the twins and the modules now carry a right one, and the same **48 answers** —
  12 named and 36 addressed by content — carry `application/octet-stream`. From no header to a wrong
  header is more visible and no better: a header that is absent is a host with no opinion, and one that
  says *these are arbitrary bytes* about a JSON document is this repository's declaration contradicted
  by its own deployment. **It closes where the cache policy closed**, in
  `packages/site/served-headers.ts`, by the same derivation from `ENDPOINTS`: one more header per rule,
  read from `contentTypeOf` instead of `cacheControlOf`.

- **That every address this tree serves carries a cache policy this repository chose.** Measured at
  `27d1dbb` over the 76 addresses: **ten of them do not.** The nine modules and `robots.txt` answer
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
- **That an address the emitted tree serves and no listing names goes on being written.** The pages are
  kept, by a mechanism and at a price the closed entry never considered: it costed a rebuild of the tree
  at every commit an address was first served from, and what does the work is one fetch of the origin's
  own `sitemap.xml`, compared against the sitemap the deployment is about to upload. **What that reaches
  is what a sitemap carries**, and this entry is the rest: the named answers, the nine modules and the
  five files found by convention are served at addresses no listing names, so nothing would say if one
  of them stopped being written.

  **The population is the emitted tree minus its sitemap**, and it is the larger half by count: the
  sitemap names **10** addresses, measured at `15f4edf` off the origin and off this tree, both. The 76
  beside it is `27d1dbb`'s and the two are not subtracted here, because a difference taken across two
  coordinates is a figure nobody can rebuild. What makes it an entry rather than the same entry again is
  that the two halves fail differently: a page is what a reader arrives at from a
  search and can have linked, and an answer is what a client fetches under a digest it holds. The second
  is covered for the frozen ones by permanent rule 6 and by nothing at all for the rest.

  **A second thing nothing keeps, and it is about the mechanism rather than about the population.** The
  coverage is inductive — each run compares one deployment against the one before it — so it holds only
  while every push of `main` runs. A push whose workflow never ran, or a job made non-required, is a link
  missing from that chain, and nothing in a later run can see one. What would close *that* is a reading
  over more than one predecessor, which needs a listing this repository does not keep. ADR-0125.
- **That a declared absence carries the date it was true**, which nothing keeps and which was found on
  this repository's own prose one day after it was written. ADR-0098 published *whether a runner's
  checkout satisfies that has not been measured* in the present tense; the job ran on the next commit
  and the sentence was false. **The class is a sentence asserting, with no stamp, that a specific thing
  has not been measured, where measuring it is possible and would falsify the sentence.** It is
  ADR-0018's rule about a dated number arriving on a declared absence, and it is harder to see there
  because there is no figure to date — nothing looks like a count, so nothing invites a coordinate.
  Swept over the ninety-eight records at `ed1abfd`, and **written as a list rather than as a number,
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
  invisible to it as long as something else answers in its place. Measured at `c21865e`, on the state
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
  `27d1dbb` the manifest declares one runtime dependency, `typescript`, and
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
  and the one proof that reaches it. Nothing else: no force and no rewriting of history.

  **That clause has been broken twice, both times deliberately, both times by the owner's decision,
  and it is written here rather than kept as a rule nobody honours.** The history was reissued on
  2026-08-16 to take a personal address out of every commit, and on 2026-08-18 to take the assistant's
  co-signature out of every commit. Both moved every identifier and neither moved a single tree, which
  is what made the stamped measurements survive as renames. **What stays forbidden is a rewrite that
  is not one of these**: an amendment to tidy a message, a rebase to linearise, a force-push that
  repairs a mistake. Those buy nothing that a new commit does not buy, and they cost every citation in
  the tree at once. A third rewrite is a decision with a record, not a convenience. ADR-0095, ADR-0124.

  Three clauses this line used to carry are gone. It counted the suites, struck by the rule 467
  established one section up — a rank is checked only by rebuilding the whole list, and what the
  sentence is about does not need one. It read *never push and never create a remote*, which held
  until the CI existed, at which point keeping the two apart stopped protecting anything and only
  delayed the reading that says the unit worked. And it read *no tag*, which the two rewrites both
  refuted: the three `evidence/*` tags are annotated, they are reissued with the commits they name,
  and a convention forbidding what the mechanism requires is one that reads as false the first time
  somebody checks it.
- **A commit is signed by whoever wrote it, and the assistant is not a whoever.** `.claude/settings.json`
  turns the co-signature off for anybody who clones this repository, so the convention is a mechanism
  rather than a sentence a contributor has to read. **It is a default and not a prohibition**: crediting
  a person who worked on a change is what a trailer is for, and anybody may write one by hand. What it
  refuses is a trailer nobody decided to add. ADR-0124.
- **Nothing publishes to npm from a keyboard, and nothing asks for a publication either.** This line read
  *nothing to npm ever* until `1.0.0` was published by hand, and then named a dispatch carrying a typed
  word until that turned one decision into two gestures. A publication is a **push of `main` declaring a
  version npm does not hold**, after the run it depends on is green. The deliberate act did not disappear;
  it moved onto the number, which nobody writes by accident, and no credential exists here to make a
  publication any other way. ADR-0109, ADR-0111.
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
- **An example is chosen for what it shows.** Where two examples in one set would show the same thing,
  they do not show it in the same language. The test that decides the next one: could this example make
  its point in another language? If it could, and something else in the set is already in this one, it
  changes. ADR-0120.

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
