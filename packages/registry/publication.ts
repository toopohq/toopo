/**
 * What this repository states about itself in its manifest, declared where a guard can resolve it.
 * ADR-0048 is what the manifest states, and the order a publication takes.
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
