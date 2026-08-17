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
 */

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
 * under this one before any remote existed; the reissued history runs to `c0d2ec6`, and the tree of all
 * 391 is unchanged, which is what makes it a rename and not an edit. Nothing tracked keeps that: the
 * identity a future commit takes is `user.email` in a local config no clone carries, so this paragraph
 * is the whole of what a reader of a fresh checkout is told.
 *
 * The name is declared here and nowhere else: `THE_COPYRIGHT` composes the copyright line from it, so
 * the holder of the licence and the author of the package are one string rather than two that agree
 * today. What keeps that recomposition honest is not a new guard but an old one - the five copied files
 * are compared against `licenceHeaderOf` byte for byte, so a composition that drifts by a character
 * reddens the marking guard.
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
 * **It is 1.0.3 because ADR-0110 moved where a feature lands on somebody's disk**, from
 * `lib/toopo/string/slugify/slugify.ts` to `lib/toopo/string/slugify.ts`, with a folder of the same
 * name sitting beside the entry if a second file ever exists. That decision was taken against `tsc`
 * under all three module resolutions and against four bundlers, and it was taken in the last unit that
 * could take it, because an installed path lives in every user's lockfile.
 *
 * **Measured against what npm is serving rather than against a rebuild of it**, which is the method
 * `1.0.2` established. `npm pack toopo@1.0.2` unpacked and its `dist/` compared against the one this
 * tree builds: 35 modules either side, 432 200 bytes against 434 251, and **5 of the 35 differ**:
 *
 *     packages/cli/ignored.js      8 396 ->  8 388   (-8)
 *     packages/cli/plan.js         9 005 ->  9 585   (+580)
 *     packages/cli/reconcile.js   31 947 -> 31 941   (-6)
 *     packages/cli/report.js      47 828 -> 48 537   (+709)
 *     packages/cli/rewrite.js      8 546 ->  9 322   (+776)
 *
 * **The five are exactly the five `8dab5d4` edited that reach the archive**, which is stated because it
 * was checked and not because it was expected: that commit touched six non-test modules of
 * `packages/cli/` - the five above and `imagined-source.ts`, which is a test double the walk prunes.
 * `relocate.js` is byte for byte what `1.0.2` shipped, and the commit that moved the installed path
 * changed only its test.
 *
 * **The comparison is by count, total and per-file digest, and publishes no tree digest**, for the
 * reason `1.0.2` withdrew `1.0.1`'s: nothing here computes one, so no reader could rebuild it. Counts
 * and a per-file table are what `npm pack` and any digest tool give back.
 *
 * **PATCH, and this is the first of the three releases where that is arguable rather than obvious.**
 * `1.0.1` changed nothing in `dist/` at all and `1.0.2` changed the text of six screens; this one
 * changes where files appear in somebody's repository, which is further than either. It is written
 * down rather than smoothed over, because a reader who finds the tension themselves is entitled to
 * think it was missed. What decides PATCH is that nothing gains a capability and nothing changes
 * shape - the six commands, their flags, their grammar and their answers are what they were - and
 * MINOR would promise a reader something to learn where there is nothing. What a user who already
 * installed a feature meets is `toopo update` writing the new copy beside the old one and keeping
 * anything they had edited, which is ADR-0110's one accepted cost.
 *
 * **It is not the version an implementation is bound at, and the separation is what makes that
 * readable.** The two were one string, tied by `the-archive-is-visibly-unpublished`, and the tie was
 * right for exactly as long as both were stand-ins saying *nothing here was published*; ADR-0106 cut
 * it at the publication, when they stopped answering the same question. This one moves on a patch of
 * the client. `THE_PUBLISHED_IMPLEMENTATION_VERSION` may never move at all, because a version is half
 * of an implementation's address and rebinding one is what permanent rule 6 refuses - so **a tie kept
 * across the publication would have rebound four addresses here**, on a release that moves no
 * implementation's bytes, and the freeze check is what would report it if somebody tied them again.
 *
 * **This line is now the thing that asks for a publication**, and it is the last release argued for in
 * a commit message and dispatched from a menu afterwards. ADR-0111: a push of `main` declaring a
 * version npm does not hold is what publishes, so editing this string is the deliberate act.
 */
export const THE_PACKAGE_VERSION = '1.0.3'

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
 * When this catalogue was published, to the day, and the reason it is not to the second.
 *
 * `publishedAt` says when somebody decided; `publishedFrom` says what they decided about, and only the
 * second is checkable. A clock reading is neither derivable nor falsifiable here, so what is written
 * is the coarsest true thing: the date the decision was taken, at midnight UTC. A time-of-day would
 * be a precision nobody measured, which is the rule ADR-0018 states about every other figure this
 * repository publishes.
 *
 * It is a constant and never `new Date()`. A publication instant read from a clock would differ on
 * every launch, so the ledger a reader rebuilds would never be the ledger they were served - and
 * `snapshot.ts` keeps it out of the frozen half for the neighbouring reason, so nothing here moves a
 * digest.
 *
 * **The three copies of the epoch this replaces were tied by nothing whatever** - not exported, not
 * asserted, not injected into - so the three stand-ins were free to disagree about when the catalogue
 * was published, on a field a client records. One declaration is the closure, and it is a shape rather
 * than a guard: there is no second statement left to drift.
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
 * Measured at `2b7aa5c`, which is the tree the suites ran from - the run that produced this widened
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
