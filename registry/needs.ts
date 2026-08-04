/**
 * What the consumers of this registry have to be able to do, written before any endpoint is.
 *
 * The project specification gives a list of endpoints and calls it indicative. This file is what that
 * word is worth: the endpoints in `endpoints.ts` are derived from the list below, and then the
 * indicative list is checked against the result rather than copied into it. It is the same discipline
 * the schema was built under - filled from five real contracts instead of from an anticipation - moved
 * one unit along, where the real things are four tools that do not exist yet and one reader who does.
 *
 * **Nothing here names an endpoint, and that is the whole design.** `endpoints.ts` declares which
 * needs each endpoint answers; this file declares the needs. Two independent statements, and
 * `endpoints.test.ts` is their disagreement - a need nothing answers, and an endpoint answering a need
 * nobody has, are both refusals. A `Need` that carried its own answer could not disagree with
 * anything, which is the mistake `publicContract` and `FIELD_MAP` are written apart to avoid.
 *
 * **A need the API does not answer says so.** A few of them are answered on the user's own machine,
 * from what they already hold, and one - detecting that a file was edited locally - is answered
 * offline *on purpose*: it is the need whose whole value is that it needs nothing from us. Leaving
 * them out would have made the list agree with the endpoints by omission; carrying them with the
 * reason is what makes `answeredWithoutTheApi` the second half of the guard rather than an escape
 * from it. Which ones they are is pinned by a guard and named there rather than counted here, for
 * the reason that guard's own comment records: a count written beside the data it counts is a second
 * statement nobody makes answer for the first, and this one had already drifted.
 *
 * ---------------------------------------------------------------------------
 * The fifth consumer, which the indicative list does not have
 * ---------------------------------------------------------------------------
 *
 * Four consumers are named in the plan for this unit: `add`, `update`, `search` and the site. The
 * fifth is in §8 and is the reason the other four exist in this shape - *the transparency of the
 * contracts IS the product (auditability)*. A reader who audits is not a tool that will be written; it
 * is somebody with a browser, `curl` and a checkout, and every guarantee this registry sells is
 * addressed to them. Leaving them off the list would have left the verification endpoints answering
 * nobody, which is exactly how a decorative endpoint gets written.
 */

/**
 * Who needs something. Not a role in a permission system - every one of these reads the same public
 * API, and §8 puts the public/private frontier on endpoints rather than on who is asking.
 */
export type Consumer =
  | 'cli-add'
  | 'cli-update'
  | 'cli-search'
  | 'the-site'
  /** §8's reader. Has no client to write and is the one the guarantees are addressed to. */
  | 'an-auditor'

export type Need = {
  /** Frozen, kebab-case, and an address like every other identifier here. */
  readonly id: string
  readonly consumer: Consumer
  /** What the consumer is trying to do, in the words the specification uses for it. */
  readonly what: string
  /** What it has to obtain to do it. This is the sentence an endpoint is derived from. */
  readonly requires: string
  /**
   * Set when no endpoint answers this need, naming what does instead. Absent when the API answers it.
   *
   * A need answered nowhere and unexplained is refused, and so is a need that carries this *and* is
   * answered by an endpoint - the second is how a list of exceptions rots into a list of things
   * nobody rechecked, which is the failure `FIELD_MAP.unfilledBecause` already guards in both
   * directions.
   */
  readonly answeredWithoutTheApi?: string
}

export const NEEDS: readonly Need[] = [
  // -------------------------------------------------------------------------
  // toopo add
  // -------------------------------------------------------------------------
  {
    id: 'fetch-a-named-or-default-implementation',
    consumer: 'cli-add',
    what: 'install the default implementation of a contract, or a named one',
    requires:
      'which implementation is the default today, and the address of the one that was chosen - so ' +
      'the answer is a binding from a name to a published version, not a document',
  },
  {
    id: 'resolve-internal-dependencies',
    consumer: 'cli-add',
    what: 'resolve the registry features an implementation imports, recursively',
    requires:
      'the edges an implementation declares, and the same for everything they reach. A depth cannot ' +
      'answer this, which is why the schema carries the edges and derives the depth.',
  },
  {
    id: 'install-a-shared-feature-once',
    consumer: 'cli-add',
    what: 'write a feature two others depend on exactly once',
    requires:
      'the resolved set rather than the walk, so that a feature named twice appears once, and an ' +
      'order in which nothing is written before what it imports',
  },
  {
    id: 'point-an-import-at-the-shared-copy',
    consumer: 'cli-add',
    what: 'rewrite an import inside an installed file so it points at the shared copy',
    requires: 'the text of the import statement, and where the shared copy was written',
    answeredWithoutTheApi:
      'the CLI, from the bytes it has already fetched. An import lives inside a file, and the inside ' +
      'of a file is the executable half this registry serves and never models - so an endpoint that ' +
      'answered this would be publishing an opinion about code the registry does not parse. Where ' +
      'the shared copy lands is the CLI\'s own decision, taken against the user\'s configured folder, ' +
      'and the registry does not know that folder.',
  },
  {
    id: 'write-the-files-into-the-project',
    consumer: 'cli-add',
    what: 'write the source of each installed feature into the configured folder',
    requires: 'the bytes of each file, addressed so that what was written can be checked afterwards',
  },
  {
    id: 'record-the-install-in-the-lockfile',
    consumer: 'cli-add',
    what: 'write what was installed into `toopo.lock`',
    requires:
      'the contract address, the implementation id and version, and every file with the digest the ' +
      'registry served - all of which the install already received, because the lockfile is a ' +
      'projection of the registry rather than a second vocabulary',
  },

  // -------------------------------------------------------------------------
  // toopo update
  // -------------------------------------------------------------------------
  {
    id: 'compare-the-lockfile-with-the-registry',
    consumer: 'cli-update',
    what: 'find out whether what is installed is still what the registry serves',
    requires:
      'the binding each locked contract resolves to today, and its digest - so that a comparison is ' +
      'one string against one string and not a document against a document',
  },
  {
    id: 'show-a-readable-diff-per-feature',
    consumer: 'cli-update',
    what: 'present the change as a diff a person decides on, feature by feature',
    requires: 'the bytes of the new files, to diff against the ones on disk',
  },
  {
    id: 'detect-a-local-modification-by-hash',
    consumer: 'cli-update',
    what: 'tell "you edited this" from "we changed this underneath you"',
    requires: 'the digest the registry served for each installed file',
    answeredWithoutTheApi:
      'the lockfile, with no call to us at all, and that is the point rather than an economy. The ' +
      'lockfile already holds the digest that was served; the file on disk hashes to something; a ' +
      'difference is a local modification whether or not the registry is reachable and whether or ' +
      'not it is honest. An endpoint here would move a check the user can make alone onto a server ' +
      'they would have to trust.',
  },
  {
    id: 'report-a-conflict-instead-of-overwriting',
    consumer: 'cli-update',
    what: 'refuse to overwrite a file the user changed, and say so',
    requires: 'that a local modification and a registry change be distinguishable',
    answeredWithoutTheApi:
      'the CLI, from the two facts above. Permanent rule 4 - never update user code silently - is a ' +
      'decision taken on the user\'s machine with what it already holds, and a registry that had to ' +
      'be asked would be a registry that could answer wrongly.',
  },

  // -------------------------------------------------------------------------
  // toopo search, and the site's search
  // -------------------------------------------------------------------------
  {
    id: 'search-on-names-and-aliases',
    consumer: 'cli-search',
    what: 'find a contract from what the user typed',
    requires:
      'the canonical name, the domain and the search aliases of every contract, in one answer small ' +
      'enough to be worth fetching before a query is answered',
  },
  {
    id: 'say-why-a-found-contract-cannot-be-installed',
    consumer: 'cli-search',
    what: 'answer a search with a contract the catalogue turned down, and the reason it did',
    requires:
      'the refusal beside the index. `installable` already says *no*, and a result saying no and ' +
      'nothing else tells somebody the catalogue has no opinion - when publishing the opinion is the ' +
      'point. Somebody typing `Map.groupBy` is best answered by *the language ships this now*, which ' +
      'is a sentence only this answer carries.',
  },
  {
    id: 'search-with-an-alias-thesaurus',
    consumer: 'the-site',
    what: 'find a contract from a phrase somebody would type into a search box',
    requires:
      'the same index as the CLI. It is a second need rather than the same one because a second ' +
      'consumer asking for the same thing is what establishes that the thing is worth serving once.',
  },

  // -------------------------------------------------------------------------
  // The site
  // -------------------------------------------------------------------------
  /**
   * **The seventh defect a consumer has found in this schema, and the first found by the site.**
   *
   * The list above was derived page by page and missed the page that lists the pages: every `the-site`
   * entry describes rendering *one* contract, one refusal, one methodology, or answering a query - and
   * the catalogue's own front page, which is the whole of its navigation at five contracts, had no
   * need behind it at all. The generator consumed `contract-index` anyway, which is exactly how an
   * endpoint comes to answer something nobody wrote down.
   *
   * It is a distinct need from searching and not a restatement of it. A search starts from a word the
   * reader supplies; this one starts from nothing, and a reader who has not typed anything still has
   * to be able to see what there is. Measured on this catalogue: a search box over five entries asks
   * somebody to guess a word for a list they could have read.
   */
  {
    id: 'list-the-whole-catalogue',
    consumer: 'the-site',
    what: 'show every contract the registry knows, on one page, before anybody has typed anything',
    requires:
      'the name, the domain, the summary and the installability of every contract at once, in one ' +
      'answer - including the ones the catalogue refused, which must be listed and must never be ' +
      'offered',
  },

  // -------------------------------------------------------------------------
  // The site
  // -------------------------------------------------------------------------
  {
    id: 'render-a-contract-page',
    consumer: 'the-site',
    what: 'show a contract: description, signature, and the edge cases it settles',
    requires:
      'the frozen definition of the contract, whole - block 4.2, block 4.3, block 4.4, block 4.5 and ' +
      'the declarations that belong to that contract alone',
  },
  {
    id: 'list-the-implementations-with-their-standing',
    consumer: 'the-site',
    what: 'show the implementations competing under a contract, with benchmarks, size and tags',
    requires:
      'the registry\'s current opinion about each one - which is the default, which was demoted, ' +
      'what has been measured on it - and none of that is frozen',
  },
  {
    id: 'pre-fill-the-playground',
    consumer: 'the-site',
    what: 'open a playground on a contract with its own edge cases already in it',
    requires:
      'the encoded value of each case, including the values JSON cannot carry - a negative zero, a ' +
      'NaN, a hole in an array - and a marker on the ones that are functions, which a browser form ' +
      'cannot hold. A higher-order contract is pre-filled in part and never whole: `array/group-by@1` ' +
      'has thirty such cases, and that is a consequence of the code/data frontier rather than of the ' +
      'site.',
  },
  {
    id: 'show-the-install-command',
    consumer: 'the-site',
    what: 'show `toopo add <name>` on a contract page',
    requires: 'the contract address',
    answeredWithoutTheApi:
      'the address the page was fetched by. An endpoint that returned the command would be serving a ' +
      'string the client already holds, and it would be a second place for the command to change.',
  },
  {
    id: 'render-the-methodology-page',
    consumer: 'the-site',
    what: 'say what "you can check this yourself" means, exactly',
    requires:
      'the list of what a client can verify alone and what it has to take from the registry, the ' +
      'stratum each field of a record is verified at, the seeding policy, and the sentence about ' +
      'what a signature does not prove',
  },
  {
    id: 'render-what-the-catalogue-refuses-and-why',
    consumer: 'the-site',
    what: 'show what was decided against, and on what measurement',
    requires:
      'the lifecycle of every contract the registry knows, including the ones that were never ' +
      'published and the ones the language has since absorbed, each with its measurement',
  },

  // -------------------------------------------------------------------------
  // An auditor
  // -------------------------------------------------------------------------
  {
    id: 'fetch-and-run-the-executable-harness',
    consumer: 'an-auditor',
    what: 'run a contract\'s own suite against an implementation, without asking anyone',
    requires:
      'every file of the harness, as bytes, each addressed by its digest - and the list of which ' +
      'files those are, inside something that cannot have been edited since it was published',
  },
  {
    id: 'recompute-a-digest-offline',
    consumer: 'an-auditor',
    what: 'check that the bytes received are the bytes the address names',
    requires:
      'the canonical text a digest was taken over, verbatim, and the version of the rule it was ' +
      'taken under - a projection applied by the server and described rather than served would make ' +
      'the recomputation a second implementation of our opinion',
  },
  {
    id: 'check-an-attestation-against-a-snapshot',
    consumer: 'an-auditor',
    what: 'find out who published a snapshot and from what build',
    requires:
      'the attestations held for a digest, each carrying the bundle as a blob rather than a ' +
      'transcription of who signed - the identity a verifier gets must be the one it verified',
  },
]
