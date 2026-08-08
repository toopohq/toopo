/**
 * How a reference implementation is written, and the one file of `catalogue/` a tool can import.
 *
 * A `reference.ts` is the oracle of the registry's differential test, and it is also the one file in
 * this repository that becomes somebody else's code. Its comments say what the function does and why
 * a non-obvious step is there. They do not explain the registry's rules of authorship to a reader who
 * has never heard of the registry, and they never point at a path that will not exist in the codebase
 * the file lands in - which is why the two rules below are stated here and not in the five files they
 * govern.
 *
 * **The two-line header above that documentation is the one exception, and it is not a comment about
 * the registry's rules.** It carries a licence marking and the address of the contract this file was
 * verified against, for a reader who has met neither - which is the opposite of the sentence above
 * rather than a breach of it, because that reader has the file and nothing else.
 * `registry/licence.ts` owns its text and `publication.test.ts` resolves what is written here against
 * it, in both directions. Do not edit those two lines in place: the perimeter is derived from what the
 * installer copies, so a header corrected by hand and not in the declaration reddens the guard rather
 * than the file.
 *
 * Declared as data, in the shape `date/add@1` already uses for its own static analysis requirements:
 * these are established by reading an implementation rather than by running it, so the validation
 * pipeline is what enforces them. A requirement that lived only inside that tool would not be part of
 * a catalogue whose whole product is auditability.
 *
 * ---------------------------------------------------------------------------
 * Why this is a file and not a section of `every-contract.ts`
 * ---------------------------------------------------------------------------
 *
 * It was a section of it, and stayed one of the three declarations `CLAUDE.md` listed as *declared,
 * cited in prose, imported by nothing executable*. What kept it there was mechanical rather than
 * deliberate: `every-contract.ts` imports `expect` from vitest, because three of its exports *are*
 * guards, and the validation pipeline is production code that must not import a test framework to
 * read a rule.
 *
 * So the split is along the line that was already there - a declaration on one side, a guard on the
 * other - and `validation/states-its-own-signature.ts` now builds its refusal out of the first rule's
 * own sentence rather than a transcription of it. The second rule stays a reader's, and
 * `contractAnatomy` records why: nothing decides whether an implementation delegates to a built-in
 * *that does the same job*.
 */

export const referenceImplementationRules = [
  {
    name: 'states its own signature and private types',
    reason:
      'A reference that annotated its export with the contract\'s own type would make the compiler ' +
      'enforce conformance at authoring time and leave `signature.test-d.ts` unable to fail - a ' +
      'guard that proves nothing. An implementation declares what it is; the contract checks it. The ' +
      'same holds for the private types it computes with, for the same reason.',
  },
  {
    name: 'does not delegate to a built-in that does the same job',
    reason:
      'The mutation battery injects its defects into `reference.ts`. A reference that forwards to the ' +
      'runtime has no lines left to inject them into, so the contract\'s verification could no longer ' +
      'be shown to catch anything. Measured on `array/group-by@1`, where `Map.groupBy` would have ' +
      'answered every case of block 4.4 and emptied the battery in the same move.',
  },
] as const

/** The rule stage 1 of the validation pipeline makes executable. */
export const STATES_ITS_OWN_SIGNATURE = referenceImplementationRules[0]
