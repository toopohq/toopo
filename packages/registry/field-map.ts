/**
 * What the registry may serve, and what refuses a wrong value for it, field by field.
 *
 * Two questions are answered here because both are properties of a *field* rather than of a record,
 * and answering them anywhere else would mean answering them once per contract.
 *
 * **Visibility.** §8 of the project specification puts the public/private frontier on endpoints
 * rather than on hidden files: the adversarial corpus, the seeds and volumes of official runs, and
 * the validation infrastructure are never served, and everything else is - including the executable
 * harness. A map that nothing enforces is the decorative guard this repository exists to refuse, so
 * `visibility.test.ts` requires the public projection and this map to agree in both directions.
 *
 * **Not one field of the contract record is private today, and that is a finding rather than a
 * gap.** The private things are separate records - a corpus, a run - and none of them is filled by
 * any of the five, so none of them is modelled. `private` stays in the vocabulary on the strength of
 * §8 alone, and the guard that refuses it is demonstrated by turning a field over rather than by an
 * instance. What the guard catches for real, and what it was written for, is the other failure: a
 * field the projection serves and nobody classified. That one is reachable by anybody who adds a
 * field, which is everybody who adds a field.
 *
 * **Verification.** GS-11 of `string-slugify-spec` is the reason this axis exists. It widens the
 * declared output alphabet to admit a character the implementation never emits, and survives: every
 * property asks whether an answer falls outside the declared alphabet, and nothing asks whether the
 * declaration is wider than the answers need. Calling that field "verified" would be false, and
 * calling it "documentary" would be false too - there *is* a guard, it just refuses one half. So
 * there are four strata and not three, and the fourth is the honest one.
 */

import type { ContractRecord } from './contract-record.js'

/**
 * What stands between a field and a wrong value.
 *
 * Measured on the five, and the strata are ordered by what they can refuse rather than by how much
 * work they are.
 */
export type VerificationStratum =
  /**
   * A guard of the contract's own suite reddens when an implementation contradicts it. The strongest,
   * and the only one that says anything about an implementation at all.
   */
  | 'executable'
  /**
   * The typechecker or a catalogue guard refuses a malformed value, without any implementation being
   * involved: a case identifier that is not kebab-case, a rationale that is empty, a universal
   * property that is missing from the list.
   */
  | 'structural'
  /**
   * A guard exists and refuses one direction only. The declared value may be wider than what the
   * guard keeps, and nothing sees it. GS-11 is the measurement; the field it lives on is named in
   * the contract's own declarations rather than here.
   */
  | 'one-directional'
  /**
   * Published prose. Nothing can contradict it, because it makes no claim a run could falsify - a
   * summary, an input domain, the reason a property is inapplicable. Recording it as such is what
   * stops it from being counted as verification.
   */
  | 'documentary'
  /**
   * Not a stratum but a deferral, and it is held by exactly one path: `ownDeclarations[].value`. What
   * refuses a wrong value there depends on which declaration it is - `metricAxioms` is structural,
   * `outputAlphabet` is one-directional, `ecosystem` is documentary - so the record carries the answer
   * per declaration and this map points at it.
   *
   * It exists because the visibility guard found its absence on its first run. The map had no entry
   * for that path at all, with a comment explaining why; a comment is not a classification, and a
   * field nobody classified is how a private one escapes. Deferring is a decision, omitting is a
   * silence, and this is the difference written down.
   */
  | 'stated-per-declaration'

export type FieldClassification = {
  readonly visibility: 'public' | 'private'
  readonly verification: VerificationStratum
  /**
   * The written requirement that authorises a field none of the five fills.
   *
   * The rule this unit was built under is that a field no real contract can fill is speculative and
   * is deleted unless an explicit written requirement keeps it. Three fields are kept, and this is
   * where each one names the sentence that keeps it - in the code, where the next reader is, rather
   * than in a report they will never see.
   *
   * It is guarded in both directions. A field nothing fills and nothing justifies is refused, and so
   * is a justification on a field that has since been filled: the second is how a list of exceptions
   * rots into a list of things nobody rechecked.
   */
  readonly unfilledBecause?: string
}

/**
 * Every field of a contract record, addressed by the path the projection emits it under. An array is
 * written `[]`, because a classification is a property of the field and not of the index.
 *
 * `ownDeclarations[].value` is classified `stated-per-declaration`, which is the one place where the
 * meaning of a field genuinely depends on the contract that holds it: `metricAxioms` is structural,
 * `outputAlphabet` is one-directional, `ecosystem` is documentary. An earlier version of this map
 * left that path out and explained the absence in this comment. The guard reddened on it, and it was
 * right to: whatever a comment says, an unclassified field has no visibility, and a field with no
 * visibility is how a private one escapes.
 */
export const FIELD_MAP: Readonly<Record<string, FieldClassification>> = {
  'address.language': { visibility: 'public', verification: 'structural' },
  'address.name': { visibility: 'public', verification: 'structural' },
  'address.major': { visibility: 'public', verification: 'structural' },

  'lifecycle.state': { visibility: 'public', verification: 'documentary' },
  'lifecycle.decidedAgainst': { visibility: 'public', verification: 'documentary' },
  'lifecycle.measurement': { visibility: 'public', verification: 'documentary' },
  'lifecycle.keptAs': { visibility: 'public', verification: 'documentary' },
  'lifecycle.answeredBy': {
    visibility: 'public',
    verification: 'documentary',
    unfilledBecause:
      'a contract published and then absorbed by the language. Permanent rule 6 forbids ' +
      'unpublishing it and the rule `array/group-by@1` established requires the catalogue to ' +
      're-examine itself against a moving language - so without this state that rule has no ' +
      'consequence a reader can see, which is the definition of a decorative rule. ' +
      '`array/group-by@1` is the shape of it without being an instance: it was refused before ' +
      'publication, on exactly this measurement.',
  },

  // Prose the registry curates, which is why none of the three is frozen and none is an address.
  'useCases[].name': { visibility: 'public', verification: 'documentary' },
  'useCases[].situation': { visibility: 'public', verification: 'documentary' },
  'useCases[].caveat': { visibility: 'public', verification: 'documentary' },
  /**
   * `executable` for the same reason a case's data is, and by the same guard.
   *
   * `every-use-case-replays-through-the-stripped-artefact-a-browser-runs` calls the shipped module
   * with these arguments and compares its answer with the one declared here, so a use case that
   * announces a result the function does not produce reddens. That is what keeps this field from
   * being what a demonstration on a page usually is - a transcription somebody took once.
   */
  'useCases[].data': { visibility: 'public', verification: 'executable' },

  'identity.exportName': { visibility: 'public', verification: 'executable' },
  'identity.summary': { visibility: 'public', verification: 'documentary' },
  'identity.description': { visibility: 'public', verification: 'documentary' },
  'identity.inputDomain': { visibility: 'public', verification: 'documentary' },
  'identity.searchAliases[]': { visibility: 'public', verification: 'documentary' },
  'identity.relationToTheLanguage': { visibility: 'public', verification: 'documentary' },

  // The declared type is checked with `toEqualTypeOf` in five of five, so an implementation that
  // merely satisfies its shape is refused rather than accepted.
  'surface.exports[].name': { visibility: 'public', verification: 'executable' },
  'surface.exports[].typeName': { visibility: 'public', verification: 'executable' },
  'surface.exports[].text': { visibility: 'public', verification: 'executable' },
  'surface.exports[].role': { visibility: 'public', verification: 'documentary' },
  /**
   * Read off the declared text rather than declared beside it, so there is one statement and nothing
   * to make disagree - the classification `samples.count` already carries for the same reason. What
   * the second statement would have been is supplied instead by a hundred and eighty-seven cases:
   * `serialise.ts` refuses a contract whose cases do not begin with this call, in this order.
   */
  'surface.exports[].parameters[].name': { visibility: 'public', verification: 'structural' },
  // What the playground builds an argument out of. A type it does not know stops the build by name.
  'surface.exports[].parameters[].type': { visibility: 'public', verification: 'structural' },
  'surface.supportingTypes[].name': { visibility: 'public', verification: 'executable' },
  'surface.supportingTypes[].text': { visibility: 'public', verification: 'executable' },
  // `edge-cases.test.ts` requires the reasons the tables produce to be exactly this set, which is
  // what stops a literal nobody names any more from surviving as documentation.
  'surface.failureReasons[]': { visibility: 'public', verification: 'structural' },
  'surface.couplingRule': { visibility: 'public', verification: 'documentary' },

  'environments[]': { visibility: 'public', verification: 'documentary' },

  'properties.runs': { visibility: 'public', verification: 'executable' },
  'properties.universal[].name': { visibility: 'public', verification: 'structural' },
  'properties.universal[].applicable': { visibility: 'public', verification: 'structural' },
  'properties.universal[].reason': { visibility: 'public', verification: 'structural' },

  'caseTables[].name': { visibility: 'public', verification: 'documentary' },
  'caseTables[].purpose': { visibility: 'public', verification: 'documentary' },
  // An address the site anchors a URL on, refused by `serialise.ts` unless it is well formed and
  // unique against every other group *and case* of the contract - the two share one `#id` space.
  'caseTables[].groups[].id': { visibility: 'public', verification: 'structural' },
  'caseTables[].groups[].title': { visibility: 'public', verification: 'documentary' },
  // Prose, and required so that having nothing to add is written rather than omitted. Not frozen:
  // `id` is the address, a title and a note are corrected the day they read badly.
  'caseTables[].groups[].note': { visibility: 'public', verification: 'documentary' },
  // The partition, refused in both directions: an undeclared group, and a group no case sits in.
  'caseTables[].cases[].group': { visibility: 'public', verification: 'structural' },
  'caseTables[].cases[].id': { visibility: 'public', verification: 'structural' },
  'caseTables[].cases[].provenance.kind': { visibility: 'public', verification: 'structural' },
  'caseTables[].cases[].provenance.mutant': { visibility: 'public', verification: 'structural' },
  'caseTables[].cases[].provenance.report': {
    visibility: 'public',
    verification: 'documentary',
    unfilledBecause:
      '`found-in-the-wild` is one of the three members of the `Provenance` type the catalogue ' +
      'publishes in `every-contract.ts`, and no defect reported from real use has reached this ' +
      'catalogue yet - which the tables say in as many words rather than repainting their history. ' +
      'A schema that dropped the member would refuse the first such case.',
  },
  'caseTables[].cases[].rationale': { visibility: 'public', verification: 'structural' },
  'caseTables[].cases[].data': { visibility: 'public', verification: 'executable' },

  'benchmarks.vocabulary[].name': { visibility: 'public', verification: 'executable' },
  'benchmarks.vocabulary[].meaning': { visibility: 'public', verification: 'documentary' },
  /**
   * The fourth `one-directional` field, and it arrived from the guard-identifier sweep rather than
   * from a mutant. A profile's name is frozen with the major - the registry cites it in a benchmark
   * figure, the site anchors on it, a validation report names the profile a submission failed - and
   * it was already an address in fact, since the five specification batteries pin `profile-<name>`
   * identifiers.
   *
   * **The address half is closed, and this comment used to end by saying it never would be.** Both
   * spellings it named as unguarded - a pin caught only by no longer matching, and a silence
   * declaration naming nothing - are what `assertEveryAddressResolves` refuses in `calibrate()`,
   * before a verdict exists. Measured at `bbbd0da`: the five declare 27 profiles and 27 of 27 are
   * named by a battery, so every one resolves. A mutant that renames a profile still renames the
   * guard built from it, which is why the resolution reads what a battery names and not what the
   * suite collects: `profiles.test.ts` builds the title from this very field, so the two can never
   * disagree.
   *
   * **What keeps the classification is the other half, and it is GS-11's shape on a second field: a
   * name makes a claim about its own samples that no guard reads.** Measured by leaving
   * `small-integers` named and classed `accepted` while its samples became `['1e308',
   * '0.000000000000001', '-1e-300']`, not one of them a small integer - 472 of 472 green in
   * `contracts/`, and the one red in this folder was `the-served-bytes-are-the-committed-bytes`
   * noticing that bytes had moved at all. The declared value may disagree with what the guards keep,
   * and nothing sees it. It closes with the validation pipeline or not at all.
   */
  'benchmarks.profiles[].name': { visibility: 'public', verification: 'one-directional' },
  'benchmarks.profiles[].description': { visibility: 'public', verification: 'documentary' },
  // `profiles.test.ts` runs the reference over every sample and refuses a profile whose name is not
  // true of them, which is the guard `number/parse@1` shipped without and paid for.
  'benchmarks.profiles[].class': { visibility: 'public', verification: 'executable' },
  'benchmarks.profiles[].data': { visibility: 'public', verification: 'executable' },

  // Which arm of `ProfileSamples` a profile uses. Not representable wrong: the serialiser derives it
  // from whether the source names a producing expression, and the union refuses anything else.
  'benchmarks.profiles[].samples.kind': { visibility: 'public', verification: 'structural' },
  // The samples themselves, which is where `profiles.test.ts` actually bites.
  'benchmarks.profiles[].samples.values[]': { visibility: 'public', verification: 'executable' },
  /**
   * The third `one-directional` field in the catalogue, and the same shape as GS-11 and as
   * `staticAnalysisRequirements`. The guard requires this text to occur in the contract's own
   * `contract.ts`; nothing establishes that it is the expression that produced *these* samples. The
   * concrete gap is named in `the-five.ts`: `one-group-per-element` and `single-group` transcribe the
   * same three ranges, so either could become literal while the other kept the text alive.
   */
  'benchmarks.profiles[].samples.producedBy': {
    visibility: 'public',
    verification: 'one-directional',
  },
  // Read off the values rather than declared, so there is one statement and nothing to make disagree.
  // What can still be wrong is the serialiser, and `registry-storage` is the battery that shows it.
  'benchmarks.profiles[].samples.count': { visibility: 'public', verification: 'structural' },
  'benchmarks.profiles[].samples.encodedBytes': { visibility: 'public', verification: 'structural' },
  'benchmarks.profiles[].samples.sha256': { visibility: 'public', verification: 'structural' },
  'ownDeclarations[].name': { visibility: 'public', verification: 'documentary' },
  'ownDeclarations[].verification': { visibility: 'public', verification: 'documentary' },
  'ownDeclarations[].value': { visibility: 'public', verification: 'stated-per-declaration' },
  // The address of the guard an `executable` declaration rests on. `serialise.ts` refuses a stratum
  // with no guard, a guard with no stratum, and an address naming a guard no battery holds - which is
  // the discipline `found-by-mutation` already carries, applied to the other claim a record makes
  // about its own verification.
  'ownDeclarations[].executableBy.battery': { visibility: 'public', verification: 'structural' },
  'ownDeclarations[].executableBy.guard': { visibility: 'public', verification: 'structural' },

  'harness[].path': { visibility: 'public', verification: 'structural' },
  'harness[].sha256': { visibility: 'public', verification: 'structural' },
  'harness[].bytes': { visibility: 'public', verification: 'structural' },

  /**
   * `structural` and not `documentary`, because the list is refused in both directions before a record
   * exists: `sharedHarnessOf` walks what the harness imports and refuses any disagreement with the
   * declaration. Public for the same reason the harness is - permanent rule 5 makes auditability the
   * product, and a file the harness calls that a reader cannot fetch is a suite they cannot run.
   */
  'sharedHarness[].path': { visibility: 'public', verification: 'structural' },
  'sharedHarness[].sha256': { visibility: 'public', verification: 'structural' },
  'sharedHarness[].bytes': { visibility: 'public', verification: 'structural' },
}

/**
 * The paths the projection below emits, so that the guard can compare two independent statements
 * rather than one statement with itself.
 *
 * An encoded value is a leaf. Walking into it would produce a path per case of block 4.4 - one
 * hundred and eighty-seven of them, each unique - and classify data the schema deliberately does not
 * interpret. The field is `caseTables[].cases[].data`, and what it carries is the contract's.
 */
const LEAF_FIELDS = new Set([
  'caseTables[].cases[].data',
  // The same value one section along, and a leaf for the same reason: it is the contract's, not the
  // schema's, and walking in would classify one path per use case.
  'useCases[].data',
  'benchmarks.profiles[].data',
  'benchmarks.profiles[].samples.values[]',
  'ownDeclarations[].value',
  'caseTables[].cases[].provenance.mutant',
])

export const pathsIn = (value: unknown, path: string, into: Set<string>): void => {
  if (path !== '' && LEAF_FIELDS.has(path)) {
    into.add(path)
    return
  }

  if (Array.isArray(value)) {
    for (const entry of value) pathsIn(entry, `${path}[]`, into)
    return
  }

  if (typeof value !== 'object' || value === null) {
    if (path !== '') into.add(path)
    return
  }

  for (const [key, entry] of Object.entries(value)) {
    pathsIn(entry, path === '' ? key : `${path}.${key}`, into)
  }
}

/**
 * What an endpoint serves for a contract.
 *
 * Written out field by field rather than derived from `FIELD_MAP` by omission, and that is the whole
 * design. A projection derived from the map could not disagree with it, so the guard would compare
 * the map against itself and could never fail - the exact mistake
 * `expectUniversalPropertiesAnswered` documents when it insists the inapplicable list is passed in
 * rather than computed. Two independent statements, and the guard is their disagreement.
 */
export const publicContract = (record: ContractRecord): unknown => ({
  address: record.address,
  lifecycle: record.lifecycle,
  /**
   * Omitted rather than served as an `undefined`, which is what an optional field costs here.
   * `pathsIn` treats anything that is not an object as a leaf, so writing the key unconditionally
   * emits the bare path `useCases` on the four contracts that declare none - a path no
   * classification can sensibly carry, since what would be classified is the absence.
   */
  ...(record.useCases === undefined ? {} : { useCases: record.useCases }),
  identity: record.identity,
  surface: record.surface,
  environments: record.environments,
  properties: record.properties,
  caseTables: record.caseTables,
  benchmarks: record.benchmarks,
  ownDeclarations: record.ownDeclarations,
  harness: record.harness,
  sharedHarness: record.sharedHarness,
})
