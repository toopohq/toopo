/**
 * What this repository states about itself in its manifest, declared where a guard can resolve it.
 * ADR-0048 is what the manifest states, and the order a publication takes. ADR-0106 is the unit that
 * filled the three fields below a first publication settles, and why two of them may never be tied.
 *
 *
 * `package.json` is JSON and cannot import, so every fact npm shows on a package page is a
 * transcription of something declared here or in `licence.ts` and `address.ts`, and
 * `publication.test.ts` resolves each one against its declaration. This file exists rather than a
 * fourth constant in one of those two because the source repository, the author and the runtime floor
 * are none of them a licence and none of them a contract address - and because a declaration a battery
 * cannot reach is an assertion nothing measures. `registry-storage` injects into this folder.
 *
 * **Every value here is frozen by a publication rather than by a major version, and that is a stronger
 * freeze than it looks.** A published npm version is immutable: the repository URL, the author and the
 * engine range of `toopo@1.0.0` are what they were the moment it was published, for as long as that
 * version is installable. Correcting one costs a version, exactly as correcting a contract's address
 * costs `name@2` - and a reader who installed the old one is never told.
 *
 * The one import is the null object identifier a stand-in mints, taken from where it is argued rather
 * than restated: `revision.ts` keeps forty zeros beside the function that asks git.
 */

import { THE_UNPUBLISHED_REVISION } from './revision.js'

/**
 * Where the source is, in the spelling npm's own documentation gives for `repository.url`.
 *
 * The `git+` prefix is npm's convention and not a second address: `https://github.com/toopohq/toopo.git`
 * survives inside it word for word. It is written this way because the rendering of this field on a
 * package page is npm's to decide and cannot be measured from here, and where a measurement is
 * unavailable the convention belongs to whoever owns the format.
 *
 * **It is the field whose absence costs the most, on this package above others.** Without it a package
 * page offers no link to the code, on a package whose entire argument is that you should go and check.
 * It is also what makes the README's relative links resolve there: npm rewrites them against this
 * repository, which is how `[CONTRIBUTING.md](CONTRIBUTING.md)` reaches a file the tarball does not
 * carry and does not need to.
 *
 * **What this field cannot do is make the address answer.** Nothing here creates a remote, and until
 * one exists and is public this names a page that does not resolve - harmless while `private: true`
 * holds, and a dead link frozen into every published version afterwards. That is the ordering
 * `CLAUDE.md` already records for the site, arriving on a second artefact.
 */
export const THE_SOURCE_REPOSITORY = 'git+https://github.com/toopohq/toopo.git'

/**
 * Who this is by, and the address that reaches the project rather than the person.
 *
 * **`hello@toopo.dev` is deliberate and the choice is not a preference.** An e-mail in a public
 * manifest is public for ever, is harvested within days of a first publication, and cannot be taken
 * back out of the versions that carried it. A project address survives whoever answers it; a personal
 * one is a fact about one person's inbox, published on their behalf by a build.
 *
 * **That argument was written about the manifest and it is not about the manifest.** A git history is
 * published the moment a remote exists, carries an author and a committer address on every commit, and
 * is cloned rather than fetched - so the one thing that cannot be undone is exactly what a manifest
 * cannot be undone in. The 391 commits of this repository carried a personal address and were reissued
 * under this one before any remote existed; the reissued history runs to `cf4d903`, and the tree of all
 * 391 is unchanged, which is what makes it a rename and not an edit. Nothing tracked keeps that: the
 * identity a future commit takes is `user.email` in a local config no clone carries, so this paragraph
 * is the whole of what a reader of a fresh checkout is told.
 *
 * The name is declared here and nowhere else: `THE_COPYRIGHT` composes the copyright line from it, so
 * the holder of the licence and the author of the package are one string rather than two that agree
 * today. What keeps that recomposition honest is not a new guard but an old one - every copied file is
 * compared against `licenceHeaderOf` byte for byte, so a composition that drifts by a character
 * reddens the marking guard.
 *
 * **The name reaches two things and only one of them is the copyright.** `THE_AUTHOR_FIELD` below
 * composes the manifest's `author` from it, and that is unconditional; `THE_COPYRIGHT` composes the
 * second line of the contracts that declare `a-copyright-beside-the-marking`, which is every published
 * one and no future one. ADR-0159.
 */
export const THE_AUTHOR = {
  name: 'Mathis Perron',
  email: 'hello@toopo.dev',
} as const

/** The `author` field of the manifest, in npm's `Name <email>` spelling. */
export const THE_AUTHOR_FIELD = `${THE_AUTHOR.name} <${THE_AUTHOR.email}>`

/**
 * The version npm publishes the command at, and the one field of this file that is meant to move.
 *
 * **It reached 1.0.0 because the client's interface is finished, not because the catalogue is old.**
 * Six commands, one lockfile, one configuration file: a `0.x` would promise less than this repository
 * already holds its contracts to, and the youth of the catalogue is a sentence the README owes a
 * reader rather than a digit nobody can read. ADR-0048 records the order a publication takes.
 *
 * **It reached 1.0.4 because the tie between an archive and a commit was broken here, by this repository.**
 * ADR-0124 reissued all 506 commits of this graph to take the assistant's co-signature out of them, and
 * an attestation is addressing like everything else: the four npm holds name commits of a history that
 * no longer exists. `npm view toopo@1.0.3 gitHead` prints one and nothing here resolves it. **The four
 * are reached by that command and never written down**, because a citation of a dead commit inside the
 * paragraph explaining why they are dead is the defect that paragraph describes - the rule that
 * withdrew `1.0.1`'s tree digest, applied to an address rather than to a figure. They cannot be
 * repaired either: npm does not republish a version, so the chain is reattached forwards and never
 * backwards, and it was the first of the four releases that corrected neither the program nor the
 * artefact.
 *
 * **It is 1.1.0 because a reader on Windows meets an abort, and because the client learned to read a
 * field the catalogue had already begun serving.** ADR-0168 is the abort - `process.exit` after a fetch
 * kills node on a libuv assertion on win32, over a refusal that was correct - and it is the reason the
 * release exists. It is not the reason for the rank: what moves the rank is `alsoFoundBy`, a field
 * `1.0.4` ignores for ever and this archive reads.
 *
 * **What decides a rank is what a command reaches, and this repository computes that rather than
 * judging it.** `reachable.ts` prunes `dist/` to what the published entry point can reach, and the same
 * walk answers the version question one floor up: a module the archive carries and no command calls is
 * compiled bytes that moved and behaviour that did not. **It is the method and not a finding** - the
 * walk was here long before anybody read it this way - and it is stated because the rank of the next
 * release turns on it exactly as this one does. Read at `1.0.4`: ADR-0118 gave `servedContractBinding`
 * a `useCases` field, its only callers are `local-read-api.ts` and `packages/site/local-source.ts`, and
 * the walk keeps neither. **Read here, the walk answers the other way**, which is the instructive case
 * and the one this rank turned on: `packages/registry/search.js` is in what the walk keeps, and
 * `command.js` calls it on every `toopo search`.
 *
 * **MINOR, and the rank turned on the confirmation rather than on the fact.** `1.0.4` argued *PATCH,
 * founded on one fact and confirmed by two*, and the fact still holds: the manifest declares a `bin`
 * and no `exports`, so nothing in this package is importable and the whole public surface is the
 * grammar of the six commands - which has not moved, measured at `0fd53e1` as 547 bytes of rendered
 * usage identical either side and three regions of `arguments.ts` byte for byte what they were at
 * `f95c4fa`. **An unmoved grammar refuses MAJOR; it does not establish PATCH.** What established PATCH
 * last time was the second clause - *the two modules carrying code carry functions no command reaches* -
 * and that clause is false here, because `toopo search` reaches what moved. Measured with the two
 * clients against the live origin, over 25 queries: 17 unchanged, **6 gained an answer**, 2 lost one.
 * `1.0.4` cannot acquire those six by waiting, because `alsoFoundBy` is a field it has never heard of.
 * **A reader who upgrades has something to learn, which is the whole of what MINOR promises.**
 *
 * **Two answers go the other way and the balance is not what decides**: `round robin` loses a wrong
 * answer, which ADR-0154's floor is right to take, and `slugify a blog post` loses a right one, which
 * it assumed. Neither is MAJOR - nothing here promises that a given query answers a given contract -
 * and the loss is an entry of the open list rather than a line in this argument.
 *
 * **Measured against what npm is serving rather than against a rebuild of it**, which is the method
 * `1.0.2` established: `npm pack toopo@1.0.4` unpacked and its `dist/` compared against the one this
 * tree builds, by count, total and per-file digest. **The source and the artefact disagree here and
 * the disagreement is the point** - git counts 16 shipped sources moved and the archive counts 13,
 * because `install.ts` and `report.ts` moved only inside text the compiler erases. **No tree digest
 * is published**, for the reason `1.0.2` withdrew `1.0.1`'s: nothing here computes one, so no reader
 * could rebuild it. The table is in the commit that argues the release, which is the one before the
 * commit that moves this line - a measurement is kept where it can still be corrected, and a commit
 * message cannot be.
 *
 * **It is not the version an implementation is bound at, and the separation is what makes that
 * readable.** The two were one string, tied by `the-archive-is-visibly-unpublished`, and the tie was
 * right for exactly as long as both were stand-ins saying *nothing here was published*; ADR-0106 cut
 * it at the publication, when they stopped answering the same question. This one moves on any release
 * of the client, patch or minor. `THE_PUBLISHED_IMPLEMENTATION_VERSION` may never move at all,
 * because a version is half of an implementation's address and rebinding one is what permanent rule 6
 * refuses - so **a tie kept across the publication would have rebound four addresses here**, on a
 * release that moves no implementation's bytes, and the freeze check is what would report it if
 * somebody tied them again.
 *
 * **This line is what asks for a publication, and nothing else does.** ADR-0111: a push of `main`
 * declaring a version npm does not hold is what publishes, so editing this string is the deliberate
 * act. `1.0.3` was the last release argued for in a commit message and dispatched from a menu
 * afterwards.
 */
export const THE_PACKAGE_VERSION = '1.1.0'

/**
 * The version every reference implementation of this catalogue is published at, and frozen at.
 *
 * **It had no home for as long as it named nothing.** `revision.ts` argued the string was written
 * three times because *a published registry mints real versions and has no notion of a stand-in, so
 * there is no home that would make it one* - and that argument was sound about a stand-in and dies
 * with it. A published registry does mint real versions; this is where it mints them, and the three
 * declarations that used to disagree about a fiction now redeclare one fact.
 *
 * The redeclaration is kept rather than collapsed, and the reason is that it is a mechanism and not an
 * accident: a client may not import another client, so the two stand-ins each state this and a guard
 * requires the three to coincide. What was missing is the third leg - the registry's own copy was tied
 * to nothing at all, while it is the one the emission reads, so a drift there would have announced a
 * version this repository never published inside somebody's `toopo.lock`.
 *
 * **1.0.0 and not 0.0.0-local, and a reader can see which by looking.** That was the whole job of the
 * old string, and it is still done: a version that names no publication is now impossible rather than
 * merely marked, because the ledger's binding is checked against the commit it was published from.
 */
export const THE_PUBLISHED_IMPLEMENTATION_VERSION = '1.0.0'

/**
 * One publication of this catalogue: the commit it was made at, and when it was made.
 *
 * **The two halves are one fact and they used to live in two files**, which is the whole of what
 * ADR-0177 repairs. `local-read-api.ts` held the commit, per address, because a second publication
 * anchors at a second commit; `publication.ts` held the date, as one constant, because the first
 * publication was the only one there had been. Nothing tied them, so the map grew a third row and the
 * constant did not move - and the registry went on answering *17 August* for a binding made on the
 * 24th, on a field `CONTRACT_BINDING_NATURES` classes `bound-for-life`.
 *
 * A pair rather than two maps, because the failure is exactly a row moving in one of them alone.
 */
export type Publication = {
  /** The commit that minted this binding, and the one a reader rebuilds it at. */
  readonly from: string
  /** When it was minted, read off that commit rather than declared beside it. */
  readonly at: string
}

/**
 * The commit that published the four founding contracts, and the first publication this catalogue had.
 *
 * It could not name itself: `implementationSnapshot` carries the version, so the commit that mints
 * `reference@1.0.0` creates addresses no earlier commit binds. The anchoring is therefore the commit
 * after it, which is why this coordinate is written down rather than computed. ADR-0106.
 */
const THE_FIRST_PUBLICATION: Publication = {
  from: 'd3a5166347cf334ee699097673ada179e8f06b60',
  at: '2026-08-17T10:57:32.000Z',
}

/**
 * The commit that published `number/round@1`, and the second publication this catalogue has had.
 *
 * It is the same shape as the first and for the same reason: that commit minted two addresses no
 * earlier commit binds, so it could not name itself, and this is the commit that can. It moves no
 * digest of its own - measured, the ledger is byte-identical either side - which is what makes a
 * coordinate written afterwards a true statement rather than a convenient one.
 *
 * **One commit sits between the two and it is not this coordinate's business.** `35d7115` corrected
 * four pins the replay disagreed with, and a pin is not in `contractSnapshot`'s frozen half: the
 * ledger it prints is byte-identical to the ledger `50ff990` prints, so rebuilding there still
 * produces what this tree produces. ADR-0144.
 */
const THE_SIXTH_CONTRACT: Publication = {
  from: '50ff9906be9a00e033cb41b5443a3b5a08e96e8f',
  at: '2026-08-20T21:40:02.000Z',
}

/**
 * The commit that published `object/deep-equal@1`, and the third publication of this catalogue.
 *
 * The same shape a third time, and it is what `local-read-api.ts` predicted in as many words: a
 * coordinate per publication, because a commit that mints an address cannot name itself. What it
 * publishes is unlike the two before it - it is the first contract whose cases hold values the
 * registry had no model for, so the commit it names moves `packages/registry/value.ts` as well as the
 * catalogue.
 *
 * **`symbolFields` is absent where there is none, and that is what keeps this coordinate honest for
 * the five bindings above it**: every record published before this one is byte-identical across the
 * change, so rebuilding at their commits still produces what this tree produces. Measured -
 * `every-published-binding-still-hashes-to-what-it-was-published-as` is green either side. ADR-0160.
 */
const THE_SEVENTH_CONTRACT: Publication = {
  from: '3ec621cc6f8f3af1cfcb4116831f4e68cd7de4ce',
  at: '2026-08-24T20:39:38.000Z',
}

/**
 * What this catalogue has published, by rendered address.
 *
 * **The instant is the commit's own author date, in UTC, and the resolution changed with the
 * mechanism.** The constant this replaces was written to the day, at midnight, on a stated argument:
 * *a clock reading is neither derivable nor falsifiable here, so what is written is the coarsest true
 * thing.* Both halves of that are now false - the commit is where the reading comes from, and
 * `every-published-binding-is-dated-by-the-commit-it-names` is what falsifies it - so the coarse form
 * stopped being the honest one and became a rounding away from a fact in hand. Midnight is also a
 * moment at which the binding did not exist, which the day-resolution was quietly asserting.
 *
 * **The author date and not the committer date**, and the reason is this repository's own history: it
 * has been reissued twice under a record and reserves the right to be reissued again, and a rewrite
 * moves a committer date where it leaves an author date alone. The two already differ here - `d3a5166`
 * was authored at 12:57:32+02:00 and committed at 13:02:48+02:00 - so the choice is measured rather
 * than theoretical. It is also the one that answers the field's own question: `publishedAt` says *when
 * somebody decided*, and that is when the work was authored.
 *
 * **An address this map does not hold is not a publication**, which is a door rather than a default.
 * It is the state a contract stands in between the commit that publishes it and the commit that can
 * say where - the one window this repository cannot close, because no commit names itself - and
 * `nothing-this-tree-binds-escapes-the-freeze-check` is what refuses to let a tree be pushed while
 * standing in it.
 *
 * **They are transcribed and they are not trusted.** `packages/registry/against-what-was-published/`
 * checks each commit out, runs *its* `ledger` script and compares, so a coordinate naming the wrong
 * commit is a red rather than a note - and since ADR-0177 the same suite resolves the date against the
 * commit, so a row whose two halves part company is a red as well. ADR-0093 is why the past is rebuilt
 * rather than recorded, and ADR-0144 is the publication that made this a map.
 */
export const THE_PUBLICATIONS: Readonly<Record<string, Publication | undefined>> = {
  'typescript/number/parse@1': THE_FIRST_PUBLICATION,
  'typescript/date/add@1': THE_FIRST_PUBLICATION,
  'typescript/string/levenshtein@1': THE_FIRST_PUBLICATION,
  'typescript/string/slugify@1': THE_FIRST_PUBLICATION,
  'typescript/number/round@1': THE_SIXTH_CONTRACT,
  'typescript/object/deep-equal@1': THE_SEVENTH_CONTRACT,
}

/**
 * What an address `THE_PUBLICATIONS` does not hold is bound at, which is nothing, said twice.
 *
 * Forty zeros is git's own spelling of *no object*, and the epoch is the same gesture on a clock -
 * `imagined-source.ts` already dates its imagined graph that way, and the resemblance is named rather
 * than shared, because that one is a fixture's date and this one is the absence of a publication.
 * Neither half is a plausible-looking value: the whole argument `THE_UNPUBLISHED_REVISION` carries is
 * that a reader who meets it knows at once that nothing was published, and a date that looked ordinary
 * would undo it on the field beside it.
 *
 * **The stand-ins take the `from` and never the `at`, and the split is the one `snapshot.ts` draws.**
 * `publishedAt` is a fact about the catalogue and is true wherever it is served; `publishedFrom` is a
 * claim that *this* tree can be rebuilt at that commit, which a working tree serving a stand-in cannot
 * make. So a stand-in anchors nothing and still dates its bindings correctly, which is what lets a page
 * built from one say when a contract arrived.
 */
export const THE_UNPUBLISHED_PUBLICATION: Publication = {
  from: THE_UNPUBLISHED_REVISION,
  at: '1970-01-01T00:00:00.000Z',
}

/**
 * When this catalogue itself was published, which is the day the ledger a reader fetches first existed.
 *
 * **It is no longer what any binding is dated by**, and that is the repair rather than a narrowing:
 * one publication instant answered for every binding, which was true while there had been one
 * publication and false from the second onwards. `THE_PUBLICATIONS` above is what a binding reads now.
 *
 * What is left is the refusal. `refuseContract` records that this catalogue decided against a
 * contract, and a refusal mints no binding, names no commit and can be rebuilt at nothing - so there
 * is no coordinate to read a date off, and what it carries is the moment the refusal entered a
 * published ledger. **Whether that is the date the decision was taken is a question this repository
 * has not answered**, and it is deliberately not answered here: it is a second field with a second
 * meaning, and repairing it inside a unit about `publishedAt` would be two decisions in one commit.
 *
 * It is a constant and never `new Date()`. A reading from a clock would differ on every launch, so the
 * ledger a reader rebuilds would never be the ledger they were served - and `snapshot.ts` keeps it out
 * of the frozen half for the neighbouring reason, so nothing here moves a digest.
 */
export const THE_PUBLICATION_INSTANT = '2026-08-17T00:00:00.000Z'

/**
 * The runtimes the published command runs on, derived from what it calls rather than chosen.
 *
 * Two APIs set it and they agree. `packages/cli/diff.ts` imports `diff` from `node:util`, which
 * `@types/node@26.1.2` declares `@since v22.15.0`; `typescript-imports.ts` calls `registerHooks` from
 * `node:module`, declared `@since v22.15.0` by the same types. Neither is in the range's gift: they are
 * read off the types this repository installs, and a module needing more is what moves this line.
 *
 * **The 23 line is refused rather than assumed.** Nothing readable here establishes either API anywhere
 * in 23.x, and a range is a claim about runtimes nobody here has run. Refusing a line that cannot be
 * established is the closed direction `packages/validation/forbidden-constructs.ts` already takes for a name it
 * has not heard of, and 23.x is not a long-term line, so the cost is a runtime nobody should be on.
 *
 * **What this range does not cover, stated because the field is one and the populations are two.** A
 * consumer installs compiled JavaScript and 22.15 is enough for them. A contributor runs
 * `node run-vitest.ts`, which needs a runtime that strips types with no flag - a later version than
 * this one, and for a year this comment said that number was not named here because the only machine
 * that could measure it ran v24.15.0. **It is named now, and the run this asked for is what named it:
 * the contributor floor is 22.18.0.**
 *
 * Measured at `660610f`, which is the tree the suites ran from - the run that produced this widened
 * the matrix and changed nothing else, and a matrix list is in no suite. Every 22.x release from this
 * range's own floor upward was a leg: 22.15.0, 22.15.1, 22.16.0, 22.17.0 and 22.17.1 all fail at the
 * first suite with `ERR_UNKNOWN_FILE_EXTENSION` on `run-vitest.ts` - one cause, fifteen occurrences -
 * and 22.18.0 is the first that runs all seven green.
 *
 * **That number is not written into this range, and the reason is the sentence above it.** These two
 * floors are about two populations: raising `engines` to the contributor's floor would refuse an
 * install to consumers whose runtime is enough for the compiled archive, which is a claim about them
 * that no measurement here supports. What keeps 22.18.0 honest is the matrix leg that runs on it, which
 * reddens the day it stops being enough.
 */
export const THE_MINIMUM_RUNTIME = '^22.15.0 || >=24.0.0'
