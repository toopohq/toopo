/**
 * What a contract is made of, file by file, and the one place the seven names are written.
 * ADR-0129 is the page this exists for and why the meanings live beside the names.
 *
 * ---------------------------------------------------------------------------
 * The list and its meanings are one constant, because they were about to be two
 * ---------------------------------------------------------------------------
 *
 * `the-five.ts` held these seven names as a private list and nothing said what any of them was. The
 * page that explains a contract needs both halves, and writing the meanings on the page would have put
 * the list of files a reader **receives** and the list a page **describes** in two folders, free to
 * disagree the day a contract's anatomy changes. So the meaning is a field, `the-five.ts` reads the
 * names off it, and there is nothing for the page to restate.
 *
 * ---------------------------------------------------------------------------
 * The seven are the seven files and never seven roles
 * ---------------------------------------------------------------------------
 *
 * The mock-up this page comes from lists seven *roles* - the signature, the invariants, the settled
 * cases, the divergences, the profiles, the harness manifest, the reference implementation - and two of
 * them are not files at all. The divergence replay lives in a contract's own suite where it exists, and
 * a harness manifest is the snapshot rather than anything on disk.
 *
 * What a reader is served, and what an installation is checked against, is these seven names. Writing
 * the page from roles would describe a shape the registry does not have, on the page whose subject is
 * exactly that shape.
 *
 * ---------------------------------------------------------------------------
 * `edge-cases` is two files and that is the point rather than an accident
 * ---------------------------------------------------------------------------
 *
 * A contract declares its settled cases as data and replays them in a suite, and both are served. It is
 * the independent redeclaration this repository runs on everywhere else - the declaration is what a
 * client reads and the replay is what makes it true of the shipped module - so the two entries below
 * say different things rather than one thing twice.
 */

/** One file of a contract's folder: what it is called, and what a reader gets from opening it. */
export type ContractFile = {
  readonly name: string
  /**
   * What it holds, for somebody who has installed nothing.
   *
   * Prose, and prose that no address depends on: nothing links to one of these and no answer cites
   * one, so rewriting a sentence the day it reads badly breaks nothing. It is not a standing field of
   * a contract for the reason ADR-0128 gives about a different one - this is a fact about *every*
   * contract and about no contract in particular, so it belongs to the registry and not to a record.
   */
  readonly what: string
}

/**
 * The seven files with fixed names, in the order they are served.
 *
 * `contractAnatomy` measured them shared at five of five and requires them of a sixth contract;
 * `array/group-by@1` carries nine, and the two extras are its own and are listed with it.
 *
 * **This is the list of what an installation receives**, so it is written out rather than read off a
 * disk - `harnessOf` refuses any disagreement between the two.
 */
export const THE_SEVEN_FILES: readonly ContractFile[] = [
  {
    name: 'contract.ts',
    what:
      'The declaration itself: what the function is for and what it is not for, the four universal ' +
      'properties answered one by one with a reason each, how many draws a property test takes and ' +
      'the measurement that chose that number, and the shapes an implementation is timed on.',
  },
  {
    name: 'signature.test-d.ts',
    what:
      'The signature, checked as types rather than read as prose. It is compiled against assertions ' +
      'written beside it, so a widened parameter or a lost generic is a failing build and not a line ' +
      'in a changelog.',
  },
  {
    name: 'properties.test.ts',
    what:
      'The invariants that must hold for every input, generated and re-seeded on every run rather ' +
      'than fixed. Where a universal property does not apply, the contract says so and says why, ' +
      'instead of shipping a test that cannot fail.',
  },
  {
    name: 'edge-cases.ts',
    what:
      'Every settled case as data: the input, the answer, a frozen identifier a reader can link to, ' +
      'and the argument for why that answer and not another. A grammar has no axioms to rest on, so ' +
      'this table is what the contract rests on instead.',
  },
  {
    name: 'edge-cases.test.ts',
    what:
      'The replay of that table against the implementation shipped beside it. The declaration above ' +
      'is what a client reads; this is what makes it true of the code, and neither stands in for the ' +
      'other.',
  },
  {
    name: 'profiles.test.ts',
    what:
      'The benchmark profiles, run to prove the samples are the shapes they claim to be. There are ' +
      'no timings until there is a reference machine, and the profiles exist so that two ' +
      'implementations are compared on the same work when there is.',
  },
  {
    name: 'reference.ts',
    what:
      'The implementation, and the only one of the seven that is a detail. It is the file the ' +
      'command copies into your project, and anything that satisfies the other six can replace it.',
  },
]

/**
 * The names alone, which is what a contract's `files` list is and what an installation is checked
 * against.
 *
 * Derived rather than written a second time: the day an eighth file is required, one list changes.
 */
export const THE_SEVEN_FILE_NAMES: readonly string[] = THE_SEVEN_FILES.map((file) => file.name)
