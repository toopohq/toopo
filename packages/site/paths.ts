/**
 * Where a page lives, and the one rule that fixes it: **a page's address is the contract's address.**
 * ADR-0031 is why the origin is an address rather than a setting; ADR-0094 is why a page's Markdown
 * twin is its sibling and why the index a retriever reads sits at the root; ADR-0099 is why the address
 * did not move when a host served it behind a redirect.
 *
 *
 * `packages/registry/address.ts` was written on the promise that the site would make a case identifier a URL
 * anchor - it says so in its own first paragraph - and `renderCase` has sat there unread ever since,
 * rendering `number/parse@1#ordinary-integer`. That string is now literally the URL of a case, which
 * is what turns the freeze of those identifiers from a discipline into a payment.
 *
 * So a contract page is `/number/parse@1/`, a case is `#ordinary-integer` inside it, and neither can
 * move without the address moving. Nothing here invents a slug: a slug would be a second name for a
 * thing that already has one, and the first time the two disagreed a link would break in silence.
 */

import type { ContractAddress } from '../registry/address.js'
import { THE_ORIGIN, renderContract } from '../registry/address.js'

/**
 * Where this site is published, re-exported rather than declared.
 *
 * It used to be declared here, and it moved to `packages/registry/address.ts` the day a second consumer
 * appeared: the licence header of an installed file carries the origin too, and a header is frozen
 * into somebody else's repository for ever. `the-origin-is-declared-once` grew with it — it used to
 * require the literal in this file and now requires it in no file of this folder at all, because the
 * declaration is one floor up and a re-export carries no spelling of its own.
 *
 * It is re-exported rather than imported at each use so that the pages go on naming their own folder's
 * vocabulary: everything about where this site lives is read from here, which is what makes this file
 * the one place to look.
 */
export { THE_ORIGIN }

/** The file a page is written to, relative to the root of the site. */
export const pageOf = (address: ContractAddress): string => `${renderContract(address)}/index.html`

/**
 * The page a domain has, which is the folder every contract of that domain already sits in.
 *
 * **Derived from `pageOf` and never composed from a language and a name**, which is the rule at the
 * head of this file arriving on a second kind of page: `renderContract` is the one spelling of
 * `language/domain/name@major`, and a second function assembling `${language}/${domain}` would be a
 * second statement of that shape - correct today and wrong the first time an address gains a segment.
 *
 * So a domain page is addressed by taking a contract of it and going up one level. It takes an
 * address rather than a string for the same reason: there is no such thing as the `string` domain
 * without a language, and a domain page of a language nothing is published in has nothing on it.
 */
export const domainPageOf = (address: ContractAddress): string =>
  `${pageOf(address).split('/').slice(0, -2).join('/')}/index.html`

/**
 * The name a page's Markdown twin takes, beside it and never anywhere else.
 *
 * It is a constant rather than two literals because two things have to agree on it and they are in
 * different folders: the tree writes the file, and every page's head declares it with
 * `rel="alternate"`. **The whole reason the link on a page can be the bare name is that the two are
 * siblings by construction** - `<contract>/index.html` and `<contract>/index.md` - so a page never has
 * to know where it is to point at its own Markdown, and
 * `every-page-has-its-markdown-beside-it-at-the-same-address` is what keeps that true rather than
 * likely.
 */
export const THE_MARKDOWN_FILE = 'index.md'

/**
 * The Markdown twin of a page, at the same address.
 *
 * It is the same replacement `linkTo` makes on the same suffix, for the same reason: the page's own
 * file name is the one part of its address that is a file rather than a place, and everything that has
 * to name the page differently changes exactly that.
 */
export const markdownOf = (page: string): string =>
  page.replace(/index\.html$/, THE_MARKDOWN_FILE)

/**
 * The index a retriever is pointed at, at the address the convention fixes.
 *
 * Like the two crawler files, it is found by convention and by nothing else - so it lives at the root
 * or it does not exist, and `SITEMAP` beside it carries the same sentence.
 */
export const LLMS_TXT = 'llms.txt'

export const REFUSALS_PAGE = 'refused/index.html'

/**
 * The page a reader arrives at, which is a door and no longer the catalogue.
 *
 * It holds the name and two ways in, and it is the one page of this site with no install command on
 * it at all: a command belongs to a contract, and this page is about none of them in particular. The
 * shape of every command at once used to stand here as `add domain/function`, which is a template and
 * reads as one.
 */
export const FRONT_PAGE = 'index.html'

/**
 * Where the catalogue lives now that the front page is a door.
 *
 * **A new address, so a free one**, and nothing is lost by the move: `/` goes on being served and
 * goes on being written, which is what ADR-0125 requires of it - it changes role and not existence.
 *
 * `/catalogue/` rather than `/contracts/`, and the refused candidate had a real argument.
 * [ADR-0129](../../docs/decisions/0129-what-a-contract-is-has-a-page-and-its-address-is-the-question.md)
 * turned `/contracts/` down for the page explaining what a contract is, *because a reader looking for
 * what is a contract would land on what reads as a list of them* - and this is a list of them, so that
 * refusal points here. What decides against it is one floor up: this project already has a word for
 * this thing and uses it in `catalogue.ts`, in `catalogue-page.ts`, in every record and in the link
 * every page carries back here. A second spelling of one thing is the drift the head of this file
 * exists to refuse. ADR-0140.
 */
export const CATALOGUE_PAGE = 'catalogue/index.html'

/**
 * `/method/`, and the word is chosen against two better-looking ones.
 *
 * `/methodology/` is what the endpoint and the need are called, and it is the register of a document
 * nobody reads. `/verification/` names half the page - the half about this project's own tests - and
 * would make the other half, what a reader can check about the registry, look like an appendix.
 */
export const METHOD_PAGE = 'method/index.html'

/**
 * `/what-a-contract-is/`, and it is the first address this site has chosen since choosing one became
 * permanent.
 *
 * **The choice is paid in advance.** ADR-0125 made *an address this tree has served goes on being
 * written* executable, so changing our mind about this word costs keeping it for ever beside whatever
 * replaces it. It is worth saying because the two addresses above were chosen before that was true.
 *
 * **It says the reader's question and not the category.** `/contracts/` is the shorter word and is
 * refused: the registry uses it for the thing itself, so a reader looking for *what is a contract*
 * would land on what reads as a list of them. The one-word habit of `method` and `refused` is two
 * instances rather than a rule, and this site already addresses `typescript/string/slugify@1` without
 * keeping it. ADR-0129.
 */
export const WHAT_A_CONTRACT_IS_PAGE = 'what-a-contract-is/index.html'

/**
 * The module every page loads, and the implementation each one loads beside itself.
 *
 * They are paths, so they live here with the others rather than beside the code that strips them:
 * `contract-page.ts` needs the two strings and nothing else, and importing the stripper for them would
 * tie a rendering module to `node:module` to read two constants.
 *
 * `packages/site/start.js` keeps the repository's own folder in the URL on purpose. The graph a
 * browser loads is this repository's modules with their types removed, resolved by the very `.js`
 * specifiers the source already writes - so the site's layout *is* the source's layout, and a reader
 * who opens it sees the file it came from rather than a bundle that corresponds to nothing.
 *
 * **An open question, recorded rather than answered.** That paragraph was written when this folder
 * was `site/`, and the move to `packages/` is what made
 * it worth re-reading: the served address became `/packages/site/start.js`, and `packages` is a word
 * about how this repository is organised that means nothing to a visitor. Beside it, on the same
 * site, `/typescript/number/parse@1/` is an address that was *designed* - the language is a
 * coordinate of a contract's identity, and `registry/address.ts` renders it.
 *
 * So the two halves of this site are addressed on two different principles, and only one of them was
 * ever chosen. **Is the served layout the source's layout because that is right, or because it was
 * free?** The sentence above gives a real reason - a reader who opens a module sees the file it came
 * from - and that reason survives the move intact. What it does not establish is that an internal
 * organisation word belongs in a public URL.
 *
 * It is not settled here because nothing in that unit changed a behaviour, and the deadline it named
 * has passed. **`/packages/site/start.js` has been served at the declared origin since `27d1dbb`**,
 * measured, and the argument that freezes a case identifier applies to it now: an address a reader
 * can have linked is an address that moving costs something. It is no longer free and it is not yet
 * expensive - nothing installed cites it, no sitemap carries it, and the nine modules are the one
 * class of this tree that no published document points at - so what it costs today is whatever a
 * browser cache and somebody's bookmark hold. Whoever designs the public surface of this site decides
 * it, on that price rather than on none.
 */
export const THE_ENTRY_POINT = 'packages/site/start.js'

export const THE_REFERENCE_MODULE = 'reference.js'

/**
 * How to climb back to the root from a page.
 *
 * Derived from the path rather than written as `../../`, because the depth is a consequence of an
 * address having two segments and a constant would be wrong the day a domain gains one.
 */
export const rootFrom = (page: string): string => '../'.repeat(page.split('/').length - 1)

/**
 * The href a page is linked by, which is its folder rather than its file.
 *
 * `/number/parse@1/` and not `/number/parse@1/index.html`, because the second is a link that breaks
 * the day the server is configured differently and the first is one every static host already serves.
 */
export const linkTo = (page: string): string => page.replace(/index\.html$/, '')

/**
 * The absolute URL of a page, which is the only spelling of it a crawler is ever given.
 *
 * Built on `linkTo` rather than beside it, so the trailing slash a reader follows and the one a
 * sitemap publishes cannot come apart. **A sitemap URL that differs from the served URL by one
 * character gets a redirect indexed instead of the page**, and the character it always differs by is
 * this one.
 */
export const urlOf = (page: string): string => `${THE_ORIGIN}/${linkTo(page)}`

export const SITEMAP = 'sitemap.xml'

export const ROBOTS = 'robots.txt'

/**
 * What the host reads to learn how to serve the rest, at the name the host looks for.
 *
 * The fourth file here found by convention and the only one nobody is served: the three above are
 * fetched by a crawler, and this one is consumed by the deployment and never leaves it. It is a name
 * Cloudflare fixes rather than one this repository chose, which is why it sits with the others - a
 * constant whose value is somebody else's decision belongs where the other such constants are, not
 * inside the module that happens to write it.
 */
export const THE_HEADERS_FILE = '_headers'

/**
 * What a reader is given at an address nothing is served at, at the name the host looks for.
 *
 * The fifth found by convention, and the second nobody navigates to. Its presence is a *statement to
 * the host* as much as a document: a top-level `404.html` is how a static host is told that this tree
 * is not a single-page application, and without it the deployment answered 200 and the front page at
 * every address holding nothing. ADR-0101.
 */
export const THE_NOT_FOUND_FILE = '404.html'

/**
 * The five above as one set, for anything that has to classify an address rather than write one.
 *
 * Three are fetched by a crawler, one is read by the host and served to nobody, and one is served to a
 * reader who arrived by being wrong. They are one set anyway: what they share is that no link points
 * at them and their names are somebody else's convention, which is exactly what a classification needs
 * to know about a file.
 *
 * **It is here rather than beside either of its readers, because there are two.** `build.ts` counts
 * them to say what it wrote and `served-headers.ts` gives each one a cache rule, and a set written out
 * in both would be one arrival away from disagreeing - which has happened twice already, `_headers`
 * being the fourth arrival and `404.html` the fifth. ADR-0170.
 */
export const THE_FILES_FOUND_BY_CONVENTION: readonly string[] = [
  SITEMAP,
  ROBOTS,
  LLMS_TXT,
  THE_HEADERS_FILE,
  THE_NOT_FOUND_FILE,
]

/**
 * The pages this site has of its own, as against the ones an address produces.
 *
 * A domain page and a contract page are `pageOf` and `domainPageOf` of something the registry holds;
 * these five exist because the site has them. It is the same distinction `theSite` already makes by
 * listing them apart from the two it walks the catalogue for, and it is declared here because a
 * second reader appeared - the cache rules have to know which spaces the tree writes.
 *
 * **`REFUSALS_PAGE` is among them and is written only when something has been refused**, which is
 * deliberate rather than an oversight: a rule covering an address nothing is served at costs a reader
 * nothing, and a rule missing on the day the catalogue refuses something would cost one. It is the
 * argument `served-headers.ts` already makes for `attestations`.
 *
 * Nothing holds this list to `theSite`'s, and nothing needs to: the two are statements about
 * different things - which pages exist, and how each is built - and
 * `every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` reddens the day they
 * disagree.
 */
export const THE_PAGES_THE_SITE_HAS_OF_ITS_OWN: readonly string[] = [
  FRONT_PAGE,
  CATALOGUE_PAGE,
  METHOD_PAGE,
  REFUSALS_PAGE,
  WHAT_A_CONTRACT_IS_PAGE,
]

/**
 * The folder the build writes the tree into, beside this one.
 *
 * It is the one name here that is not an address a reader is served: everything above says where a
 * thing lives *in* the tree, and this says where the tree lands on a disk. It is here anyway, and for
 * the reason `THE_ORIGIN` moved one floor up - **a second consumer appeared.** `build.ts` spelled it
 * as a literal while it was the only module in this repository that touched a disk;
 * `packaging/print-what-a-deployment-would-drop.ts` now reads the same folder, because the question it
 * asks is about the bytes that are uploaded rather than about a rebuilding of them. Two spellings of
 * one folder make a comparison that can quietly start being about nothing. ADR-0125.
 */
export const THE_BUILT_TREE = 'out'
