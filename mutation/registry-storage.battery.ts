/**
 * The immutable storage battery, and since ADR-0136 the matching rule as well.
 *
 * **Its name is narrower than its contents and that is deliberate.** A battery is scoped to a folder
 * and to the suite that folder collects, never to a theme, and `packages/registry/search.ts` arrived
 * in this folder when a second consumer needed the matching rule. The alternative was a twentieth
 * battery over the same folder, and it was refused on a duplication rather than on taste: a battery
 * accounts for every guard of its suite, witnessed or declared, and this one already carries that
 * accounting at 182 guard names. A second statement of what a folder holds is the thing that drifts.
 *
 * The cells that came with the module kept their `S-` identifiers rather than being renumbered into
 * this file's `I-` sequence. A mutant is addressed by the pair `(battery, id)`, so nothing collides;
 * renumbering would have moved every citation of them for no gain, and the prefix now says which of
 * the two subjects a cell is about.
 *
 * Immutability is a claim, and every other claim in this repository is measured. This is the one the
 * product is sold on - a published version is frozen for life, served for ever, and no installation
 * fetches from anywhere else - so a storage whose immutability were asserted and never contradicted
 * would be the decorative guard this repository exists to refuse, on the property that matters most.
 *
 * It injects into `packages/registry/`, not into a contract folder, and it collects under the registry's own
 * vitest configuration. That is the same door `mutation/fixture` already uses and it is closed for
 * the same reason: a registry guard collected by `npm test` would redden under a specification mutant
 * and be counted as a contract catching it. Nothing here can reach a contract battery, and no contract
 * battery can reach this one.
 *
 * **Two are corrections rather than injections.** I-01 and I-02 are defects this
 * repository actually had, found while reading it for this unit, and both are fixed. They are here
 * so that the fix is held rather than remembered.
 *
 * I-01 hashed the bytes in the working tree. `core.autocrlf` is true here and there is no
 * `.gitattributes`, so a checked-out source carries CRLF while the committed content carries LF:
 * measured on `contracts/typescript/string/slugify/contract.ts`, 25 115 bytes hashing to `bfcc6145...` against
 * 24 641 bytes hashing to `3c448a88...`. Every one of the 37 harness files differed from its blob;
 * after the fix none does.
 *
 * I-02 built the file list with a directory listing. A `tsc` invocation that emitted beside the
 * sources put two `.js` files into every contract folder, both entered the harness with their
 * digests, and the whole registry suite stayed green at 110 of 110 - the only guard over the list
 * asked whether the seven expected files were present, never whether anything else was. Reproduced
 * afterwards with a single stray file, same result. Those files would have been served to every
 * installation.
 *
 * There is one arm and one lens. The two fallible contracts carry a second arm because an error
 * convention was under measurement there; nothing here has a convention to compare, and a second
 * lens would be a question nobody is asking yet.
 *
 * The suite this battery runs is typechecked - vitest reports "Type Errors no errors" under the
 * instrument's own command line - so `killed-by-typecheck` is reachable here as it is anywhere else.
 * None produces it: every one is a defect of behaviour that typechecks.
 *
 * **Which of this folder's never-alone guards would resist isolation was predicted before any cell
 * aimed at one of them existed.** ADR-0204 carries that prediction, guard by guard, together with the
 * two mechanisms it was made with and a third this repository had not named; it was committed before
 * the first of those cells, so what says the prediction came first is the graph rather than an account
 * of it.
 *
 * **What a *first* witness is, as against a sole one, was written down before the first cell that
 * takes one.** ADR-0209 carries the definition - the defect a cell injects is the failure condition
 * the guard's own sentence names, and the search stops there rather than carrying on until nothing
 * else reddens - together with the slice it is measured on and the two directions that slice is
 * unrepresentative in. It too was committed before its cells, for the same reason.
 *
 * **And the second slice inverts exactly one clause of the rule that chose the first.** ADR-0210
 * carries it, committed before its own cells: the guards it takes are the ones no table wrote, in
 * files no cell reaches, so the only thing that moves between the two readings is whether a guard is
 * a row of a family. Which way that biases is written down there before the result was known, and so
 * are the three outcomes it could have - a bracket, a meeting, or a refusal to bracket at all.
 *
 * **The third slice takes the clause both the others held.** ADR-0211 carries it, committed before
 * its own cells: the guards no table wrote that sit in files this battery already reddens, which is
 * the reading ADR-0210 named in its own reopening section and the population that decides whether
 * the 94 % those two published speaks for a seventh of what is left or for most of it. Its trap is
 * peculiar to it and is written down there - the injection site is already present, so the cheapest
 * way to redden a silent guard is to widen a neighbouring cell, and a widened cell has stopped
 * aiming.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn, survived } from './mutants.ts'
import { trackedFiles } from './paths.ts'

const UNDER: ArmUnderTest = { arm: 'R', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

/**
 * A guard of this folder is written once with `it.each` over the catalogue and answers to one address
 * per contract. `the-catalogue.ts` says why the slug is there; here it is what lets a pin name the
 * contract a defect was caught on, which `I-06` needs - it reddens on one of them and on no other.
 *
 * **This was five names typed here, and the day the catalogue became six it went stale in silence.**
 * `number/round@1` entered at `50ff990` and brought eighteen guards into this suite that this battery
 * accounted for in neither direction; nothing was red anywhere - not the eight suites, not `meta`, not
 * the typecheck - and it was found by a replay taken for another reason. ADR-0145.
 *
 * **The repair is a subtraction rather than a sixth copy.** Sixteen guard addresses were written out
 * once per contract by hand, eighty strings, beside an `onEach` that existed to spell exactly that and
 * was used six times. Adding the sixth contract by hand would have made it ninety-six.
 *
 * **It is derived from the folders and never from `the-catalogue.ts`, and that is the whole of why it
 * reads the disk.** This battery injects into `packages/registry/`, so a list imported from a module of
 * that folder is one a mutant of this battery could move - the expectation and the subject would then
 * be the same object, and a defect that emptied the catalogue would empty what the battery expects to
 * find. `contracts/` is outside everything this battery edits, so what is read here cannot be perturbed
 * by what is measured.
 */
const THE_CONTRACTS: readonly string[] = [
  ...new Set(
    trackedFiles().flatMap((path) => {
      const hit = /^contracts\/typescript\/([^/]+)\/([^/]+)\//.exec(path)

      return hit === null ? [] : [`${hit[1]}-${hit[2]}`]
    }),
  ),
].sort()

/**
 * One address per contract, spelled by the caller because the slug is not always the last segment.
 *
 * Sorted, and that is safe rather than incidental: a pin's `by` is compared with
 * `every((id) => failedGuards.includes(id))` and a declaration's `guards` with `includes`, so neither
 * reads the order. ADR-0130 is why that is stated instead of assumed - a shared list reordered one
 * folder away had made a sort load-bearing with nothing saying so.
 */
const perContract = (spell: (slug: string) => string): readonly string[] => THE_CONTRACTS.map(spell)

/**
 * The common shape, where the slug is the address's last segment.
 *
 * **This is what a family is, and the shape decides what one costs.** A family is not a resemblance
 * between separately written guards: it is one title parameterised over the whole catalogue, expanded
 * by the runner into a row per contract, which the artefact addresses individually because
 * `failedGuards` holds expanded names. Measured at `1238833` over the nineteen families this battery
 * still leaves under `unprobedClaims`, **19 of 19 carry exactly the seven distinct contract slugs**.
 *
 * So the members of a family name one sentence and never seven, and an edit to the shared path is by
 * construction the failure condition each row names. What can still keep a family from collapsing to
 * one cell is that a row is **vacuous** for its own contract - the clause quantifies over something
 * that contract has none of - and never that the rows disagree. ADR-0212.
 */
const onEach = (guard: string): readonly string[] => perContract((slug) => `${guard}-${slug}`)

/**
 * The one contract whose serialisation ADR-0211's three widest cells stop.
 *
 * `I-125`, `I-126` and `I-127` break the reading of a signature shape only `array/group-by@1` writes -
 * a trailing comma, a type parameter list, a function-typed parameter - so that contract stops
 * serialising and every guard about it reddens whatever its own subject is. **Eleven declarations
 * became stale on that one fact**, one of them an `unreachableGuards` entry whose argument is still
 * true of the seam it names and was never about a contract ceasing to exist.
 *
 * It is ADR-0209's own sentence arriving on a second bucket: *the instrument's criterion for leaving
 * is reddening and not aiming*. A guard a cell reddens incidentally leaves its declaration, and the
 * declaration has to say so rather than go on claiming a silence that is no longer there.
 */
const WHOSE_SERIALISATION_THE_SIGNATURE_CELLS_STOP = 'array-group-by'

/** Every contract's row of a family but one, for the reason above. */
const onEachBut = (guard: string, slug: string): readonly string[] =>
  onEach(guard).filter((address) => !address.endsWith(`-${slug}`))

const canonicalFile = (find: string, replace: string) => ({ file: 'canonical.ts', find, replace })
const signatureFile = (find: string, replace: string) => ({ file: 'signature.ts', find, replace })
const serialiseFile = (find: string, replace: string) => ({ file: 'serialise.ts', find, replace })
const licenceFile = (find: string, replace: string) => ({ file: 'licence.ts', find, replace })
const snapshotFile = (find: string, replace: string) => ({ file: 'snapshot.ts', find, replace })
const responseFile = (find: string, replace: string) => ({ file: 'response.ts', find, replace })
const addressFile = (find: string, replace: string) => ({ file: 'address.ts', find, replace })
const imaginedAddressFile = (find: string, replace: string) => ({
  file: 'imagined-addresses.ts',
  find,
  replace,
})
const publicationFile = (find: string, replace: string) => ({ file: 'publication.ts', find, replace })
const emitFile = (find: string, replace: string) => ({ file: 'emit.ts', find, replace })
/**
 * The one helper here that edits registry *data* rather than registry code.
 *
 * Every other cell of this battery injects a defect into a function; this one injects it into what the
 * catalogue declares, because the guard it exercises is about a declaration and there is nowhere else
 * for the defect to live. `the-catalogue.ts` is a production source in the folder under measurement, so
 * it is inside this battery's reach - the unreachable-guard entry about a contract's address already
 * says so.
 */
const A_CORRECTION_QUOTES_WHAT_IS_FROZEN = `          'An implementation that memoises the pairs a failed candidate tried answers \`true\`, ' +`

const A_CORRECTION_IS_STAMPED = `          'Measured at \`3ec621c\` by injecting exactly that defect into this contract\\'s own ' +`

const catalogueFile = (find: string, replace: string) => ({
  file: 'the-catalogue.ts',
  find,
  replace,
})
const endpointsFile = (find: string, replace: string) => ({ file: 'endpoints.ts', find, replace })
const searchFile = (find: string, replace: string) => ({ file: 'search.ts', find, replace })
const readApiFile = (find: string, replace: string) => ({ file: 'read-api.ts', find, replace })
const revisionFile = (find: string, replace: string) => ({ file: 'revision.ts', find, replace })
const rebindingFile = (find: string, replace: string) => ({ file: 'rebinding.ts', find, replace })
const rebuildFile = (find: string, replace: string) => ({ file: 'rebuild.ts', find, replace })
const verifiabilityFile = (find: string, replace: string) => ({
  file: 'verifiability.ts',
  find,
  replace,
})

const THE_DIAGNOSTIC_TRAVELS_WITH_THE_ANSWER = `  ...exports.filter((entry) => entry.role === 'the-answer'),
  ...exports.filter((entry) => entry.role !== 'the-answer'),`

const THE_INDEX_CARRIES_WHAT_A_SEARCH_PAYS_FOR = `      exports: identity.exports,`
const implementationFile = (find: string, replace: string) => ({
  file: 'implementation-record.ts',
  find,
  replace,
})
const valueFile = (find: string, replace: string) => ({ file: 'value.ts', find, replace })
const attestationFile = (find: string, replace: string) => ({ file: 'attestation.ts', find, replace })
const needsFile = (find: string, replace: string) => ({ file: 'needs.ts', find, replace })
const fieldMapFile = (find: string, replace: string) => ({ file: 'field-map.ts', find, replace })
const imaginedGraphFile = (find: string, replace: string) => ({
  file: 'imagined-graph.ts',
  find,
  replace,
})

/**
 * One row of the table of values the encoding was written for, spelled once.
 *
 * The addresses are long and there are twenty-five of them, so composing the prefix keeps a pin
 * readable; the slug is what a reader of `round-trip.test.ts` sees in the table beside the value.
 */
const aValueJsonCannotHold = (row: string): string =>
  `a-value-json-cannot-hold-survives-the-wire-${row}`

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

/**
 * Both anchors below moved out of `harnessOf` and into `hashedFile`, which ADR-0105 factored so that
 * a shared file and a harness file are hashed by one reader. What each cell does is unchanged - the
 * two defects are still a working-tree read and a second read for the size - and the parameters they
 * name are now the base and the path rather than the directory and the name.
 */
const READ_A_FILE = 'const bytes = servedBytes(readFileSync(join(base, path)))'

/**
 * The encode side of `servedBytes`, and the one axis its three unit guards leave free.
 *
 * Measured at `8b6aa89`: all three assert an ASCII result - `'a\\nb\\n'` twice and `'const a = 1\\n'` -
 * so any edit agreeing with the reference on ASCII passes every one of them. Only
 * `a-byte-order-mark-is-not-content` carries a non-ASCII byte at all and it carries it on the
 * *input*, which is why it constrains the decode side and why nothing constrains this one. The
 * sibling edit on the decode side was measured and is caught: it reddens that guard. ADR-0148.
 */
const THE_SERVED_TEXT_IS_ENCODED_AS_IT_WAS_READ =
  `  return Buffer.from(withoutMark.replace(/\\r\\n/g, '\\n'), 'utf8')`

/** What a reader receives is the contract's own files *and* what those files import. ADR-0105. */
const WHAT_IS_SERVED_IS_THE_HARNESS_AND_WHAT_IT_REACHES = '  ...record.sharedHarness,'

// --- The freeze, and the seven places a check of it stops being one ---

const THE_DIGEST_IS_THE_ONE_IT_WAS_PUBLISHED_AS = '  if (held === entry.digest) return null'

const A_PAST_THAT_BINDS_NOTHING_IS_A_FAULT = '  if (held === undefined) {'

const A_STAND_IN_ANCHORS_NOTHING =
  '  entry.publishedFrom !== THE_UNPUBLISHED_REVISION && REVISION.test(entry.publishedFrom)'

const A_RENDERING_ADDRESSES_ONE_BINDING =
  '    if (bindings.has(what)) throw new RenderingsCollide(what)'

const A_PAST_COMMIT_ANSWERS_DIGESTS = '        if (!DIGEST.test(digest)) {'

// --- The other field of the pair a binding records: the date it carries. ADR-0177 ---

const THE_INSTANT_IS_THE_ONE_THE_COMMIT_HAPPENED_AT = '  if (served === commit) return null'

const AN_INSTANT_IS_A_MOMENT_AND_NOT_A_SPELLING =
  '  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString()'

const A_COMMIT_DATE_NOBODY_CAN_READ_IS_REFUSED = '  if (commit === null) {'

const A_SERVED_INSTANT_NOBODY_CAN_READ_IS_REFUSED = '  if (served === null) {'

const A_STAND_IN_IS_NOT_DATED_AGAINST_A_COMMIT =
  '  const anchored = everyBinding(ledger).filter(isAnchored)'

const A_COMMIT_IS_ASKED_ONCE =
  '    const when = authored.get(entry.publishedFrom) ?? dateOf(entry.publishedFrom)'

/** The separator the two processes agree on, on the writing side. `readBindings` splits on it. */
const A_BINDING_IS_SEPARATED_BY_ONE_TAB = '`${what}\\t${digest}\\n`'

const THE_COMMIT_A_BINDING_NAMES_IS_THE_ONE_CHECKED_OUT =
  `  git(root, 'worktree', 'add', '--detach', '--quiet', worktree, revision)`

const WHAT_IS_RE_RUN_IS_NODE_AND_ONE_PATH =
  `  if (runner !== 'node' || path === undefined || rest.length > 0) {`

const A_REBUILD_TIDIES_UP_AFTER_ITSELF = `    git(root, 'worktree', 'remove', '--force', worktree)`

const A_YEAR_LONG_ENTRY_SAYS_IT_IS_IMMUTABLE = `    ...(policy.immutable ? ['immutable'] : []),`

const A_NAMED_ANSWER_SAYS_IT_MUST_BE_REVALIDATED =
  `    ...(policy.mustRevalidate ? ['must-revalidate'] : []),`

const THE_LIFETIME_IS_READ_OFF_THE_POLICY = '    `max-age=${policy.maxAgeSeconds}`,'

const A_LINE_IS_ONE_ADDRESS_AND_ONE_DIGEST = `        const [what, digest, ...rest] = line.split('\\t')

        if (what === undefined || what === '' || digest === undefined || rest.length > 0) {
          throw new BindingsAreNotReadable(
            line,
            'a binding is an address and a digest separated by one tab',
          )
        }`

// --- The emission, and the three ways a walk of the questions stops being one ---

const A_SNAPSHOT_NAMES_EVERY_FILE_IT_FREEZES = '        ...blobsNamedBy(frozen),'

const AN_EDGE_NAMES_THE_CONTRACT_IT_DEPENDS_ON = `          : frozen.frozen.dependsOn.flatMap((edge) => [
              { method: 'snapshot', digest: edge.digest } as const,
              ...theQuestionsAbout(edge.implementation.contract),
            ])),`

const AN_ADDRESS_IS_A_PATH_AND_NOT_A_SEGMENT = '      return `/${address}/${endpoint.id}`'

const AN_UNANSWERED_ENDPOINT_IS_NAMED_AS_IT_IS_DECLARED = '  attestations: {'

const A_DEFERRAL_NAMES_THE_EVENT_THAT_CLOSES_IT = `    until:
      'one snapshot of this catalogue is signed and the bundle is held somewhere this registry can ' +
      'read, which is the publishing tool binding a digest to a signature rather than a decision here',`

const EVERY_QUESTION_THAT_NEEDS_NOTHING_IS_A_ROOT = `  { method: 'refusals' },
  { method: 'methodology' },`

const AN_ADDRESS_RENDERS_ITS_LANGUAGE = '  `${address.language}/${address.name}@${address.major}`'

const A_MUTANT_IS_RENDERED_ON_ITS_CONTRACT =
  '  `${renderContract(address.contract)}:${address.battery}/${address.mutant}`'

const A_COMPLEMENT_RATHER_THAN_A_SENTENCE = `    butNot:
      'that what was published is right - the contract\\'s verification says an implementation ' +
      'answers the contract, and neither that nor a signature says the contract is the right ' +
      'specification',`

// --- The reading of a declared signature, which is what makes a case a call ---

const A_COMMA_INSIDE_A_TYPE_SEPARATES_NOTHING = `    else if (character === ',' && brackets === 0 && angles === 0) {
      parts.push(list.slice(start, at))`

const A_MARK_ABOUT_ARITY_IS_NOT_A_NAME = `          .replace(/^\\.{3}/, '')
          .replace(/\\?$/, '')
          .trim(),`

const A_SIGNATURE_THAT_CANNOT_BE_READ_IS_REFUSED = `  throw new UnreadableSignature(text, 'its parameter list is never closed')`

const A_GROUPING_IS_A_PARTITION = `  if (faults.length > 0) throw new GroupingIsNotAPartition(where, faults.join('; '))

  return table.groups`

const AN_ADDRESS_IS_HELD_ONCE = `  const taken = takenAddresses(
    tables.flatMap((table) => [
      ...table.groups.map((group) => group.id),
      ...table.cases.map((entry) => entry['id'] as string),
    ]),
  )`

const REFUSE_A_DISAGREEMENT = `  if (undeclared.length > 0 || missing.length > 0) {
    throw new UndeclaredHarness(folder, undeclared, missing)
  }`

const PROJECT_THE_TAIL = `    ownDeclarations: record.ownDeclarations,
    harness: record.harness,`

const PROJECT_THE_SHARED_SURFACE = '    sharedHarness: record.sharedHarness,'

const REFUSE_A_SURFACE_THAT_IS_NOT_REACHED = `  if (undeclared.length > 0 || missing.length > 0) {
    throw new UndeclaredSharedSurface(folder, undeclared, missing)
  }`

const REFUSE_AN_IMAGINED_ADDRESS =
  '  if (isImagined(source.address.name)) throw new TheAddressIsImagined(source.address.name)'

const A_NAME_NO_CONTRACT_MAY_TAKE =
  "export const A_NAME_THE_CATALOGUE_DOES_NOT_HOLD = imagined('string/titlecase')"

const SORT_THE_KEYS = '  return `{${sortedKeys(record)'

const A_RECORD_IS_JSON = `  return \`{\${sortedKeys(record)
    .map((key) => \`\${JSON.stringify(key)}:\${canonicalAt(record[key], \`\${path}.\${key}\`)}\`)
    .join(',')}}\``

const SORT_THE_FILES = '  const served = [...files].sort()'

const ONE_READ = '  return { path, sha256: digestOfBytes(bytes), bytes: bytes.byteLength }'

const A_STRING_IS_ITSELF = `  if (typeof value === 'string') return JSON.stringify(value)`

const REFUSE_A_REBINDING = `  const held = entries[0]
  if (held !== undefined) throw new AlreadyPublished(what, held.digest, offered)`

const SERVE_THE_CANONICAL_TEXT = `  canonicalText: canonical(snapshot, 'snapshot'),`

/**
 * Both anchor on the last member of the binding rather than on `lifecycle`, which is where they were
 * until the standing gained a second field. The mutant adds one member to the type and one to the
 * builder, so what it has to attach to is the end of each - and `lifecycle` stopped being that.
 *
 * **They have now moved three times for one reason, which makes it a rate rather than a cost.** The
 * standing gained `useCases`, then `againstTheLanguage`, then `alsoFoundBy`, and each time the end of
 * the type and the end of the builder were somewhere else. Anchoring on the *last* member is what
 * makes this mutant mean what it says - it adds a member, so it has to attach where a member is
 * added - and the price of that is a move per field the standing ever gains. The alternative is
 * anchoring on the closing brace alone, which occurs everywhere and would attach the defect to
 * whichever one came first.
 *
 * **Three of three fields have charged it, and both halves were reported.** `npm run anchors` named
 * this cell and this file on the change that moved it, which is the tool doing its job rather than
 * the entry `CLAUDE.md` carries about a `replace` half nothing reads - here the `find` is what
 * stopped matching, so nothing was silent. ADR-0155.
 */
const A_BINDING_IS_ONLY_STANDING = `  readonly alsoFoundBy?: readonly LearnedTerm[]
}`

const A_BINDING_IS_BUILT_FROM_STANDING = `    : { alsoFoundBy: entry.standing.alsoFoundBy }),
})`

/**
 * The coordinate on the one re-examination the catalogue declares. ADR-0150.
 *
 * It quotes the sentence around the stamp rather than the stamp alone, so that the cell reads as the
 * defect it is - a re-examination written without a coordinate - instead of as a string edit that
 * happens to remove seven characters.
 */
const A_RE_EXAMINATION_IS_STAMPED =
  "'Block 4.4 was replayed against Temporal at `ee2d1c1` - all forty-three cases of both '"

// --- The licence perimeter, which is derived from what the installer copies ---

const THE_PERIMETER_IS_THE_ENTRY_FILE = `    (file) => file.path === 'reference.ts',`

const THE_SOURCE_CARRIES_NPM_S_PREFIX = `export const THE_SOURCE_REPOSITORY = 'git+https://github.com/toopohq/toopo.git'`

const THE_ADDRESS_IS_THE_PROJECT_S = `  email: 'hello@toopo.dev',`

const THE_NAME_IS_THE_PROJECT_S = `  name: 'Toopo',`

const AN_EDGE_READS_THE_DIGEST_OFF_THE_ARTEFACT =
  '    digest: digestOfSnapshot(implementationSnapshot(target)),'

const THE_FLOOR_IS_WHAT_THE_CODE_CALLS = `export const THE_MINIMUM_RUNTIME = '^22.15.0 || >=24.0.0'`

const WHAT_A_COPY_IS_UNDER = `export const THE_COPIED_LICENCE = 'MIT-0'`

const WHAT_THIS_REPOSITORY_IS_UNDER = `export const THE_REPOSITORY_LICENCE = 'MIT'`

const WHAT_A_NEW_CONTRACT_CARRIES = `export const THE_CURRENT_BANNER: Banner = 'the-marking-alone'`

const NORMALISE_THEN_HASH = `  const recomputed = digestOfBytes(servedBytes(response.bytes))`

const INSTALLABLE_MEANS_PUBLISHED = `      installable: published.has(renderContract(identity.address)),`

const WALK_BEFORE_PUSHING = `      const next = mustHold(holdings, edge.implementation)
      walk(next, [...open, what])
      seen.add(what)
      resolved.push(next)`

const WALKS_AFTER_PUSHING = `      const next = mustHold(holdings, edge.implementation)
      seen.add(what)
      resolved.push(next)
      walk(next, [...open, what])`

// --- The revision a named answer carries ---

const THE_REVISION_IS_NOT_AN_OPINION = `  addressing: 'the-question',
  servedFrom: 'the-registry-that-answered',
  address: 'the-question',
  digest: 'bound-for-life',
  publishedAt: 'bound-for-life',
  status: 'revisable',`

const THE_INDEX_CARRIES_THE_REVISION_IT_WAS_BUILT_WITH = `  return {
    addressing: 'named',
    servedFrom,`

const A_DIRTY_TREE_NAMES_NO_REVISION = `  if (dirty !== '') {`

const THE_UNPUBLISHED_REVISION_IS_THE_NULL_OID = `export const THE_UNPUBLISHED_REVISION = '0'.repeat(40)`

const GIT_REFUSING_IS_A_REFUSAL_OF_OURS = `  } catch (error) {
    throw new TheRevisionCannotBeNamed(
      \`git could not answer \\\`\${arguments_.join(' ')}\\\` here (\${
        error instanceof Error ? error.message.split('\\n')[0] : String(error)
      })\`,
    )
  }`

const THE_REVISION_IS_THE_COMMIT = `  const head = git(root, 'rev-parse', 'HEAD')`

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Anchors of the matching rule - moved here with the module, ADR-0136
// ---------------------------------------------------------------------------

const EVERY_WORD_MUST_BE_ANSWERED = `    !namedWellEnoughToSetAWordAside(fields, answered, spread)`
const A_FIELD_IS_NAMED_BY_WHAT_TELLS_THEM_APART = `      namedByWhatTellsThemApart(field, asked, spread) &&`
const A_SET_ASIDE_WORD_COSTS_A_SECOND_WORD_OF_THE_FIELD = `const A_SET_ASIDE_WORD_IS_PAID_FOR_WITH = 2`
const SOMETHING_THE_CONTRACT_CHOSE_MUST_HAVE_ANSWERED = `  if (!hits.some((hit) => hit !== null && DELIBERATE.has(hit.field.kind))) return null`
const A_WORD_TELLS_THEM_APART_BELOW_A_CEILING = `const TELLS_THE_CONTRACTS_APART = 2`
const A_FIELD_KEEPS_ONE_BACK_ONLY_WHEN_IT_HAS_THREE = `const A_FIELD_MAY_KEEP_ONE_BACK_FROM = 3`
const THE_SPREAD_COUNTS_THE_DELIBERATE_FIELDS = `    const declared = fieldsOf(entry).filter((field) => DELIBERATE.has(field.kind))`
const A_SHORTENING_GOES_ONE_WAY = `  (asked.length >= MINIMUM_PREFIX && held.startsWith(asked))`
const A_PLURAL_IS_ONE_TRAILING_S = `  singular(asked) === singular(held) ||`
const A_SHORT_WORD_IS_NOT_SHORTENED = `  word.length > MINIMUM_PREFIX && word.endsWith('s') ? word.slice(0, -1) : word`
const THE_MINIMUM = `const MINIMUM_PREFIX = 4`
const A_NAME_OUTRANKS_AN_ALIAS = `  name: 100,`
const BEST_FIRST = `        : second.score - first.score,`
const ONLY_A_DELIBERATE_FIELD_IS_NAMED_IN_FULL = `const DELIBERATE: ReadonlySet<MatchedField> = new Set<MatchedField>(['name', 'export', 'alias'])`
const THE_NAME_IS_THE_RENDERED_ADDRESS = `    { kind: 'name', text: rendered, words: wordsOf(rendered) },`
const THE_EXPORTS_ARE_A_FIELD = `    ...entry.exports.map((held) => ({`
const THE_ALIASES_ARE_A_FIELD = `    ...entry.searchAliases.map((alias) => ({`
const THE_LEARNED_TERMS_ARE_A_FIELD = `    ...(entry.alsoFoundBy ?? []).map((learned) => ({`
const THE_LEARNED_TERM = `        term: 'string to integer',`
/**
 * The one contract of the catalogue whose frozen half is still open, anchored at its folder.
 *
 * `S-30` teaches the registry a word about a contract that could have declared it as an alias, which
 * is where the review ADR-0023 does at publication is still available and is being walked past. The
 * anchor is the folder rather than the lifecycle above it, because the lifecycle is what makes the
 * cell mean something and a mutant may not edit its own premise.
 */
const THE_REFUSED_CONTRACT = `    folder: 'contracts/typescript/array/group-by',`
const CAMEL_CASE_IS_SPLIT = `    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')`
/**
 * The refusal moved into `displayed`, which is where the catalogue listing reads it too.
 *
 * Two screens show a contract now - a search result and the whole catalogue - and attaching a
 * refusal to the wrong one is a defect with no symptom, because every result would carry a
 * plausible-looking reason. One of the two would otherwise have to be trusted to have got it right
 * on its own, so the line lives once and this anchor follows it.
 */
const THE_REFUSAL_IS_ATTACHED_TO_ITS_OWN_CONTRACT = `  refusal: refusals.find((refusal) => sameContract(refusal.address, entry.address)) ?? null,`
const AN_UNKNOWN_WORD_IS_ONE_NO_ENTRY_ANSWERS = `    entries.every((entry) => bestHit(word, fieldsOf(entry)) === null),`

/**
 * The eight anchors ADR-0204's cells aim at, and every one of them is a **choice**.
 *
 * That is ADR-0203's rule rather than a coincidence of this folder: a shared mechanism has every
 * consumer's guards behind it, so a cell that edits one reddens all of them and isolates nothing.
 * The three cache cells one screen down are the demonstration - `cacheControlOf` is the mechanism and
 * carries three cells that redden two guards apiece, while the class's own declared lifetime is a
 * choice and carries one that reddens one.
 */
const WHETHER_A_BINDING_CAN_BE_ASKED_ABOUT_IS_DECIDED_FIRST = `    .filter(isAnchored)`
const A_FROZEN_ANSWER_IS_HELD_FOR_A_YEAR = `        maxAgeSeconds: A_YEAR,`
const ONE_FORMAT_WRITTEN_ONCE =
  "  [...bindings].map(([what, digest]) => `${what}\\t${digest}\\n`).join('')"
const A_DEPENDENCY_ALREADY_RESOLVED_IS_NOT_RESOLVED_AGAIN = `      if (seen.has(what)) continue`
const A_SNAPSHOT_NAMES_WHAT_ITS_GUARDS_CALL_AS_WELL =
  `    ? [...snapshot.frozen.harness, ...snapshot.frozen.sharedHarness]`
const EVERY_WORD_NOBODY_COULD_PLACE_IS_NAMED =
  `  return { query, results, unknownWords: [...new Set(unknown)] }`
const A_QUERY_NAMES_A_DELIBERATE_FIELD_OR_ANSWERS_NOTHING =
  `  if (!hits.some((hit) => hit !== null && DELIBERATE.has(hit.field.kind))) return null`
const THE_TWO_CLAUSES_ARE_ASKED_OF_ONE_FIELD = `  fields.some(
    (field) =>
      DELIBERATE.has(field.kind) &&
      namedByWhatTellsThemApart(field, asked, spread) &&
      carriedFrom(field, asked) >= A_SET_ASIDE_WORD_IS_PAID_FOR_WITH,
  )`

/**
 * The anchors the `E` cells aim at, which are the encoding that carries what JSON cannot.
 *
 * **Every one is a decode-side anchor wherever a decode-side anchor exists**, and that is measured
 * rather than stylistic. `serialiseContract` calls `encode` and nothing calls `decode` but the round
 * trip, so an edit to the encoder moves the bytes a digest is taken over and reddens the freeze, the
 * served bytes and every answer addressed by content - 40 guards on one candidate here, 66 on
 * another. The same defect expressed on the way back reddens the round trip alone. ADR-0209.
 */
const A_NEGATIVE_ZERO_COMES_BACK_SIGNED = `  'negative-zero': -0,`
const A_NAN_COMES_BACK_A_NAN = `  nan: Number.NaN,`
const AN_INFINITY_COMES_BACK_INFINITE = `  infinity: Number.POSITIVE_INFINITY,`
const A_NEGATIVE_INFINITY_COMES_BACK_INFINITE = `  'negative-infinity': Number.NEGATIVE_INFINITY,`
const AN_UNDEFINED_COMES_BACK_UNDEFINED = `    case 'undefined':
      return undefined`
const A_FIELD_IS_ASSIGNED_WHATEVER_IT_HOLDS =
  '      for (const field of encoded.fields) record[field.name] = decode(field.value, shared)'
const A_PATTERN_KEEPS_ITS_FLAGS = `    case 'pattern':
      return new RegExp(encoded.source, encoded.flags)`
const A_SET_COMES_BACK_IN_ITS_OWN_ORDER =
  '      for (const entry of encoded.entries) entries.add(decode(entry, shared))'
const A_HOLE_IS_LEFT_UNASSIGNED =
  "        if (entry.kind !== 'hole') entries[at] = decode(entry, shared)"
const AN_ELEMENT_THAT_IS_THERE_IS_ENCODED =
  "      at in value ? encodeAt(value[at], `${path}[${at}]`, walk) : { kind: 'hole' as const },"
const A_BIG_INTEGER_COMES_BACK_A_BIG_INTEGER = `    case 'big-integer':
      return BigInt(encoded.digits)`
const AN_INSTANT_IS_THE_MILLISECOND_IT_WAS =
  '      const instant = new Date(decode(encoded.epoch, shared) as number)'
const THE_EPOCH_IS_THE_TIME_THE_DATE_HOLDS =
  '    const epoch = encodeAt(value.getTime(), `${path}<epoch>`, walk)'
const A_MAP_KEEPS_KEY_AND_VALUE_APART =
  '        entries.set(decode(entry.key, shared), decode(entry.value, shared))'
const A_MAP_KEY_IS_ENCODED_LIKE_ANY_VALUE =
  '      key: encodeAt(key, `${path}<key ${at}>`, walk),'
const THE_MESSAGE_AND_THE_CAUSE_TRAVEL_TOGETHER = `        encoded.message,
        encoded.cause === undefined ? undefined : { cause: decode(encoded.cause, shared) },`
const THE_ERROR_IS_REBUILT_BY_ITS_OWN_KIND =
  '      const failure = new ERROR_CONSTRUCTORS[encoded.errorKind]('
const THE_CAUSE_IS_CARRIED_WHERE_THERE_IS_ONE =
  '        encoded.cause === undefined ? undefined : { cause: decode(encoded.cause, shared) },'
const A_BOX_COMES_BACK_A_BOX =
  '      const box = Object(decode(encoded.value, shared)) as Record<string, unknown>'
const WHAT_A_BOX_CARRIES_OF_ITS_OWN_IS_ITS_OWN =
  '      ...carrying(value, new Set(Object.keys(Object(held) as object))),'
const A_TYPED_ARRAY_IS_REBUILT_BY_ITS_OWN_KIND =
  '      const make = TYPED_ARRAY_CONSTRUCTORS[encoded.of] as {'
const A_TYPED_ARRAY_ELEMENT_IS_ENCODED_LIKE_ANY_VALUE =
  '    const elements = [...(value as unknown as Iterable<unknown>)].map((entry, at) =>\n' +
  '      encodeAt(entry, `${path}[${at}]`, walk),\n' +
  '    )'
const A_RECORD_WITH_NO_FIELDS_IS_STILL_A_RECORD =
  "      const record = Object.create(encoded.prototype === 'none' ? null : Object.prototype) as Record<string, unknown>"
const A_FIELD_IS_A_FIELD_WHATEVER_ITS_NAME_LOOKS_LIKE =
  "          typeof entry[0] === 'string' && !beside.has(entry[0]),"
const A_LABEL_ONCE_GIVEN_IS_THE_LABEL_REUSED =
  '  const existing = walk.labels.get(value)\n' + '  if (existing !== undefined) return existing\n\n'

/**
 * The anchors of ADR-0210's slice, in the order the cells below take them.
 *
 * They are the declared surface rather than the machinery underneath it: which answers exist, which
 * needs each one is for, what may be served, and what a signature proves. Nineteen of them, because
 * `the-strata-are-populated` has no cell - the record says what was measured against it.
 */
const AN_ATTESTATION_IS_ABOUT_ONE_SNAPSHOT = '    ...(attestation.subject === digest'
const A_BUNDLE_IS_ADDRESSED_LIKE_A_BLOB = '    ...(DIGEST.test(attestation.bundle.sha256)'
const THE_THIRD_CLAIM_IS_PUBLISHED_BESIDE_THE_OTHER_TWO = `  'verification says an implementation answers the contract; neither says the contract is the right ' +
  'specification'`
const THE_METHODOLOGY_ENDPOINT_ANSWERS_ITS_OWN_NEED = "    answers: ['render-the-methodology-page'],"
const THE_REFUSALS_ENDPOINT_ANSWERS_BOTH_ITS_NEEDS = `    answers: [
      'render-what-the-catalogue-refuses-and-why',
      'say-why-a-found-contract-cannot-be-installed',
    ],`
const A_NEED_IS_IDENTIFIED_BY_AN_ADDRESS = "    id: 'show-the-install-command',"
const A_DIGEST_IS_RECOMPUTED_FROM_WHAT_THE_API_SERVES = `    id: 'recompute-a-digest-offline',
    consumer: 'an-auditor',`
const THE_LIST_ENTRY_BECAME_AN_ENDPOINT_THAT_EXISTS = "    became: ['implementation-bindings'],"
const THE_ENDPOINTS_NO_ENTRY_ANTICIPATED_ARE_THREE = `  'attestations',
  'methodology',
  'refusals',
]`
const WHAT_THE_FIRST_ENTRY_BECAME_IS_ADDRESSED_BY_NAME = "    became: ['contract-index'],"
const ONE_ENTRY_OF_THE_LIST_IS_REFUSED = `    entry: 'GET /contracts/{...}/implementations - la liste, avec benchs et metadonnees.',
    verdict: 'held',`
const THAT_ENTRY_SAYS_WHY = `    reason:
      'the list, the benchmarks and the metadata are all standing - which is what makes this one ' +
      'body legitimate where the definition was not. What it must not do is carry the files: those ' +
      'are frozen, and they travel by digest.',`
const A_CONTENT_ADDRESSED_ANSWER_IS_NEVER_REVALIDATED = '        mustRevalidate: false,'
const A_NAMED_ANSWER_IS_FRESH_FOR_NOTHING = '        maxAgeSeconds: 0,'
const THE_SNAPSHOT_ENDPOINT_IS_ADDRESSED_BY_ITS_CONTENT = `    id: 'snapshot',
    about: 'the content that addresses it',
    addressing: 'content-addressed',`
const THE_SAMPLE_VALUES_ARE_PUBLIC =
  "  'benchmarks.profiles[].samples.values[]': { visibility: 'public', verification: 'executable' },"
const A_FIELD_NOBODY_FILLS_SAYS_WHY = `    unfilledBecause:
      '\`found-in-the-wild\` is one of the three members of the \`Provenance\` type the catalogue ' +
      'publishes in \`every-contract.ts\`, and no defect reported from real use has reached this ' +
      'catalogue yet - which the tables say in as many words rather than repainting their history. ' +
      'A schema that dropped the member would refuse the first such case.',`
const THAT_FIELD_IS_ONE_OF_THE_TWO_ARGUED_FOR = `    verification: 'documentary',
${A_FIELD_NOBODY_FILLS_SAYS_WHY}`
const A_MAJOR_IS_STRUCTURAL_RATHER_THAN_DEFERRED =
  "  'address.major': { visibility: 'public', verification: 'structural' },"

// ADR-0211's anchors. The two record ones are the same expression read twice, so they are written
// once each rather than spelled out at the cell.
const AN_ARRAY_IS_RENDERED_IN_ORDER = "    return `[${entries.join(',')}]`"
const A_RECORD_IS_WRITTEN_KEY_BY_KEY = '  return `{${sortedKeys(record)\n    .map('
const THE_UNDEFINED_FIELDS_ARE_SKIPPED =
  '  return `{${sortedKeys(record)\n' +
  '    .filter((key) => record[key] !== undefined)\n' +
  '    .map('
const THE_ARROW_DOES_NOT_CLOSE_A_TYPE_PARAMETER = "      if (text[at - 1] === '=') continue\n"
const A_COMMA_AT_DEPTH_ZERO_SEPARATES =
  "    else if (character === ',' && brackets === 0 && angles === 0) {"
const THE_SEPARATOR_IS_A_SEMICOLON =
  "    else if (character === ';' && brackets === 0 && angles === 0) {"
const A_COMMA_ANYWHERE_SEPARATES = "    else if (character === ',' && angles === 0) {"
const AN_EMPTY_PART_IS_NOT_A_PARAMETER = ".filter((part) => part !== '')"
const AN_EXPORT_CARRIES_ITS_OWN_PARAMETERS =
  '  const carried = exports.map((entry) => ({ ...entry, parameters: parametersOf(entry.text) }))'
const THE_LAST_PARAMETER_IS_DROPPED =
  '  const carried = exports.map((entry) => ({\n' +
  '    ...entry,\n' +
  '    parameters: parametersOf(entry.text).slice(0, -1),\n' +
  '  }))'
const THE_REFUSAL_NAMES_THE_EDGE =
  '      renderImplementation(address),\n' +
  "      'the registry holds no such published implementation',"
const THE_REFUSAL_NAMES_NOTHING =
  "      'a dependency',\n      'the registry holds no such published implementation',"
const AN_UNPUBLISHED_HOLDING_IS_REFUSED =
  '  if (held.version === null) {\n' +
  '    return [\n' +
  '      `it is unpublished, where ${asked} names a published version. A snapshot with no version was ` +\n' +
  '        `never served under any address.`,\n' +
  '    ]\n' +
  '  }'
const AN_UNPUBLISHED_HOLDING_IS_ACCEPTED = '  if (held.version === null) {\n    return []\n  }'
const A_CYCLE_IS_REFUSED =
  '      if (open.includes(what)) {\n' +
  "        throw new UnresolvedDependency(what, `it imports itself through ${[...open, what].join(' -> ')}`)\n" +
  '      }'
const A_CYCLE_IS_SKIPPED = '      if (open.includes(what)) continue'
const A_REPORTED_CASE_IS_CLASSIFIED = "  'caseTables[].cases[].provenance.report': {"
const A_REPORTED_CASE_IS_MISSPELLED = "  'caseTables[].cases[].provenance.reported': {"
const A_LIFECYCLE_IS_SERVED_WHOLE = '  lifecycle: record.lifecycle,'
const A_LIFECYCLE_IS_SERVED_AS_ITS_STATE = '  lifecycle: { state: record.lifecycle.state },'
const A_SNAPSHOT_BODY_IS_COMPARED_WITH_ITS_ADDRESS =
  '    ...(recomputed === response.addressedBy\n' +
  '      ? []\n' +
  '      : [`this body canonicalises to ${recomputed} and not to ${response.addressedBy}`]),'
const A_BLOB_IS_COMPARED_WITH_ITS_ADDRESS =
  '    ...(recomputed === response.addressedBy\n' +
  '      ? []\n' +
  '      : [`these bytes hash to ${recomputed} and not to ${response.addressedBy}`]),'
const NOTHING_IS_COMPARED = '    ...[],'
const A_FORMAT_VERSION_IS_CHECKED = '    ...(response.formatVersion === SNAPSHOT_FORMAT\n      ? []'
const A_FORMAT_VERSION_IS_NOT_CHECKED = '    ...(true\n      ? []'
const A_REFUSAL_CARRIES_ITS_OWN_MEASUREMENT =
  '    measurement: entry.measurement,\n    keptAs: entry.keptAs,'
const A_REFUSAL_CARRIES_ITS_DECISION_TWICE =
  '    measurement: entry.decidedAgainst,\n    keptAs: entry.keptAs,'
const AN_UPDATE_COMPARES_THE_ADDRESS_AND_THE_DIGEST =
  '  renderImplementation(response.address) === renderImplementation(recorded.address) &&\n' +
  '  response.digest !== recorded.digest'
const AN_UPDATE_COMPARES_THE_DIGEST_ALONE = '  response.digest !== recorded.digest'
const A_CASE_BEGINS_WITH_THE_CALL =
  "  if (fields.slice(0, call.length).join(',') !== call.join(',')) {\n" +
  '    throw new CaseIsNotACall(where, call, fields)\n' +
  '  }\n\n'
const A_MUTATION_CITATION_IS_ITS_OWN_KIND =
  "  if (kind === 'found-in-the-wild') return { kind: 'found-in-the-wild', report: rest }"
const A_MUTATION_CITATION_IS_A_REPORT =
  "  if (kind === 'found-in-the-wild' || kind === 'found-by-mutation') {\n" +
  "    return { kind: 'found-in-the-wild', report: rest }\n" +
  '  }'
const NOTHING_IS_MEASURED = '    minifiedBytes: null,\n    benchmarks: [],'
const A_SIZE_NOBODY_MEASURED = '    minifiedBytes: 0,\n    benchmarks: [],'
const A_CORRECTION_IS_CARRIED = '    ...(source.correctionsToFrozenProse === undefined\n      ? {}'
const A_CORRECTION_IS_DROPPED = '    ...(true\n      ? {}'
const A_REFERENCE_DECLARES_NO_EDGE = '    dependsOn: [],\n    minifiedBytes: null,'
const A_CLAIM_IS_ADDRESSED = "    id: 'a-blob-is-the-bytes-its-address-names',"
const A_CLAIM_IS_NAMED_IN_CAMEL_CASE = "    id: 'aBlobIsTheBytesItsAddressNames',"
const A_CLAIM_IS_ABOUT_A_BLOB = "    about: ['blob'],"
const A_CLAIM_IS_ABOUT_NOTHING_THAT_EXISTS = "    about: ['blobs'],"
const A_CHECK_NEEDS_NOTHING_FROM_THE_REGISTRY = '    about: [],'
const THAT_CHECK_NEEDS_A_SNAPSHOT = "    about: ['snapshot'],"
const A_CLAIM_SAYS_WHAT_IT_DOES_NOT_ESTABLISH =
  "    butNot: 'anything about what the file does',"
const A_CLAIM_SAYS_NOTHING_OF_THE_KIND = "    butNot: '',"
const THE_NATURES_ARE_THREE =
  '  /** No arithmetic reaches it, whatever anyone publishes. */\n' +
  "  | 'outside what any arithmetic can reach'"
const THE_NATURES_ARE_FOUR =
  '  /** No arithmetic reaches it, whatever anyone publishes. */\n' +
  "  | 'outside what any arithmetic can reach'\n" +
  "  | 'the registry declines to say'"
const A_SIZE_IS_A_MEASUREMENT =
  "    id: 'a-minified-size',\n" +
  "    claim: 'this implementation ships this many bytes',\n" +
  "    nature: 'a measurement on a machine nobody else has',"
const A_SIZE_IS_WITHHELD =
  "    id: 'a-minified-size',\n" +
  "    claim: 'this implementation ships this many bytes',\n" +
  "    nature: 'the registry declines to say',"
const A_SPECIFICATION_IS_BEYOND_ARITHMETIC =
  "    id: 'this-contract-is-the-right-specification',\n" +
  "    claim: 'what this contract requires is what a caller of this function should want',\n" +
  "    nature: 'outside what any arithmetic can reach',"
const A_SPECIFICATION_IS_AN_OPINION =
  "    id: 'this-contract-is-the-right-specification',\n" +
  "    claim: 'what this contract requires is what a caller of this function should want',\n" +
  "    nature: 'an opinion of the registry',"
const AN_INDEX_HAS_NO_MITIGATION =
  "    id: 'the-index-is-complete',\n" +
  "    claim: 'these are all the contracts the registry has',\n" +
  "    nature: 'an opinion of the registry',\n" +
  '    mitigation: null,'
const AN_INDEX_IS_GIVEN_ONE =
  "    id: 'the-index-is-complete',\n" +
  "    claim: 'these are all the contracts the registry has',\n" +
  "    nature: 'an opinion of the registry',\n" +
  "    mitigation: 'independent mirrors would make a short index visible',"
const A_STRATUM_IS_TRANSLATED =
  '  documentary:\n' +
  "    'published prose. Nothing can contradict it, because it makes no claim a run could falsify.',"
const A_STRATUM_IS_SILENT = "  documentary: '',"
const EVERY_FIELD_REACHES_THE_METHODOLOGY =
  '    Object.entries(FIELD_MAP).map(([path, entry]) => [path, entry.verification]),'
const ONE_FIELD_DOES_NOT =
  '    Object.entries(FIELD_MAP)\n' +
  '      .slice(1)\n' +
  '      .map(([path, entry]) => [path, entry.verification]),'
const THE_METHODOLOGY_IS_NAMED = "  addressing: 'named',\n  servedFrom,"
const THE_METHODOLOGY_IS_CONTENT_ADDRESSED = "  addressing: 'content',\n  servedFrom,"
const A_STANDING_FIELD_SAYS_WHY =
  "    field: 'minifiedBytes',\n" +
  "    reason: 'null until a minifier exists, and measured against code that was published without it.',"
const A_STANDING_FIELD_SAYS_NOTHING = "    field: 'minifiedBytes',\n    reason: '',"
const A_STANDING_IS_SET_ONLY_ON_SOMETHING_PUBLISHED =
  '  const held = ledger.contracts.find((entry) => renderContract(entry.address) === what)\n' +
  '  if (held === undefined) throw new NotPublished(what)\n'
const A_BINDING_IS_KEYED_ON_ITS_WHOLE_ADDRESS =
  '    ledger.contracts.filter((held) => renderContract(held.address) === what),'
const A_BINDING_IS_KEYED_ON_ITS_NAME =
  '    ledger.contracts.filter((held) => held.address.name === entry.address.name),'
const A_STANDING_IS_APPLIED =
  '      renderContract(entry.address) === what ? { ...entry, standing } : entry,'
const A_STANDING_IS_DISCARDED =
  '      renderContract(entry.address) === what ? { ...entry } : entry,'
const A_PUBLISHED_CONTRACT_CANNOT_BE_REFUSED =
  '  if (ledger.contracts.some((held) => renderContract(held.address) === what)) {\n' +
  "    throw new AlreadyDecided(what, 'published')\n" +
  '  }\n'
const A_FILE_IS_ADDRESSED_BY_ITS_CONTENT =
  "  return { path: path.slice(path.lastIndexOf('/') + 1), sha256: digestOfBytes(bytes), bytes: bytes.byteLength }"
const A_FILE_IS_ADDRESSED_BY_ITS_NAME =
  "  const name = path.slice(path.lastIndexOf('/') + 1)\n" +
  '\n' +
  "  return { path: name, sha256: digestOfBytes(Buffer.from(name, 'utf8')), bytes: bytes.byteLength }"
const A_DOMAIN_MAY_CARRY_A_HYPHEN =
  'const CONTRACT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*\\/[a-z0-9]+(?:-[a-z0-9]+)*$/'
const A_DOMAIN_MAY_NOT =
  'const CONTRACT_NAME = /^[a-z0-9]+\\/[a-z0-9]+(?:-[a-z0-9]+)*$/'
const A_REFERENCE_DEPENDS_ON_ITS_OWN_FILES =
  '    dependsOn: files.map((file) => ({\n' +
  "      implementation: { contract: source.address, id: 'reference', version: '1.0.0' },\n" +
  '      digest: file.sha256,\n' +
  '    })),\n' +
  '    minifiedBytes: null,'

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'I-01',
    'hashes the bytes in the working tree rather than the bytes the registry serves, so the digest ' +
      "depends on the reader's git configuration - the defect this repository had. **It was pinned " +
      'killed for two years and it is caught on no clone anybody makes.** `the-served-bytes-are-the-' +
      'committed-bytes` compares what would be published against what git holds, and on a checkout ' +
      'that agrees with its index there is nothing for this edit to differ on. Measured on one ' +
      'machine in both directions, control green at 407 tests either way: with the nine tracked files ' +
      'that carried CRLF where `.gitattributes` declares LF, killed; normalised, survived. Both ' +
      'hosted runners agree with the normalised reading and not with the machine that wrote this pin.',
    [serialiseFile(READ_A_FILE, 'const bytes = readFileSync(join(base, path))')],
    survived('a-declared-open-class'),
  ),

  sameOnEveryLens(
    'I-02',
    'lets the served file list be open, so anything sitting in a contract folder is hashed into the ' +
      'record and shipped to every installation - the other defect this repository had',
    [serialiseFile(REFUSE_A_DISAGREEMENT, '  void undeclared\n  void missing')],
    // Ten guards redden; the five named are the half about a file nobody declared, which is what
    // this mutant is written for. The other five are the same refusal from the other side.
    killed(onEach('an-undeclared-file-is-refused')),
  ),

  sameOnEveryLens(
    'I-03',
    'drops a frozen field from the projection the digest is taken over, so a contract can change ' +
      'its own declarations without its digest moving',
    [snapshotFile(PROJECT_THE_TAIL, '    harness: record.harness,')],
    killed(onEach('the-frozen-half-and-the-standing-half-partition-a-contract')),
  ),

  sameOnEveryLens(
    'I-04',
    'keeps the harness paths and blanks their digests, so a served file may change under a fixed ' +
      'snapshot digest - the failure the Merkle tree exists to make impossible',
    [
      snapshotFile(
        PROJECT_THE_TAIL,
        `    ownDeclarations: record.ownDeclarations,
    harness: record.harness.map((file) => ({ path: file.path, bytes: file.bytes, sha256: '' })),`,
      ),
    ],
    // Twelve guards redden; the five named are the ones written for this defect, and they are the
    // ones the weaker form of that guard let through.
    killed(onEach('a-changed-harness-file-moves-the-digest')),
  ),

  sameOnEveryLens(
    'I-05',
    'leaves the keys of a record in insertion order, so two constructions of one content hash ' +
      'differently',
    [canonicalFile(SORT_THE_KEYS, '  return `{${Object.keys(record)')],
    killed([
      'key-order-does-not-depend-on-construction',
      'integer-like-keys-are-sorted-with-every-other-key',
      'an-encoded-field-list-is-not-reordered',
    ]),
  ),

  sameOnEveryLens(
    'I-06',
    'stops sorting the served file list, so the order of the harness follows whatever order the ' +
      'source happened to declare',
    [serialiseFile(SORT_THE_FILES, '  const served = [...files]')],
    // All five, and it used to be one. `array/group-by@1` was the only contract whose declared list
    // was not already in sorted order, so the sort was load-bearing for it alone and the other four
    // instances of this guard were declared silent. ADR-0129 put `THE_SEVEN_FILES` in the order a
    // reader meets them rather than in alphabetical order, which makes the sort load-bearing for
    // every contract - so the declaration went stale and the guard got stronger. Five is the count
    // ADR-0076 says a pin names in full.
    killed([
      ...onEach('the-harness-is-in-one-order'),
    ]),
  ),

  sameOnEveryLens(
    'I-07',
    'concatenates keys and values with no separator and no quoting, so `{ a: 1, b: 2 }` and ' +
      '`{ a1b: 2 }` share a digest',
    [
      canonicalFile(
        A_RECORD_IS_JSON,
        `  return sortedKeys(record)
    .map((key) => \`\${key}\${canonicalAt(record[key], \`\${path}.\${key}\`)}\`)
    .join('')`,
      ),
    ],
    killed([
      'integer-like-keys-are-sorted-with-every-other-key',
      'an-encoded-field-list-is-not-reordered',
      'two-different-values-do-not-share-a-canonical-form',
    ]),
  ),

  sameOnEveryLens(
    'I-08',
    'reads the file a second time for its size, so the digest and the byte count of one record ' +
      'describe two different reads of one file. **`I-01` carries the story and this cell shares it**: ' +
      'the second read only differs from the first where the working tree differs from what is served, ' +
      'so on any checkout git produces the two reads agree and there is nothing to catch.',
    [
      serialiseFile(
        ONE_READ,
        `  return {
    path,
    sha256: digestOfBytes(bytes),
    bytes: readFileSync(join(base, path)).byteLength,
  }`,
      ),
    ],
    survived('a-declared-open-class'),
  ),

  sameOnEveryLens(
    'I-09',
    'normalises Unicode on the way into the digest, which changes what a contract settling cases on ' +
      'the difference between a composed and a decomposed spelling actually says',
    [
      canonicalFile(
        A_STRING_IS_ITSELF,
        `  if (typeof value === 'string') return JSON.stringify(value.normalize('NFC'))`,
      ),
    ],
    killed(['unicode-is-not-normalised']),
  ),

  sameOnEveryLens(
    'I-10',
    'lets a published address be rebound to other bytes, so every lockfile that ever recorded it ' +
      'silently starts resolving to something else',
    [snapshotFile(REFUSE_A_REBINDING, '  void entries\n  void what\n  void offered')],
    killed([
      'an-address-is-bound-once-and-for-ever',
      'rebinding-is-refused-even-to-the-same-digest',
      'an-implementation-versions-under-a-contract-that-does-not-move',
    ]),
  ),

  // -------------------------------------------------------------------------
  // The read API. Five defects of the projection, and one of the resolution.
  //
  // They are in this battery rather than in one of their own because they are the same subject one
  // step along: what a snapshot is, what may not travel beside it, and what a reader can recompute.
  // A separate battery would inject into the same folder under the same configuration and would
  // differ only in its name.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'I-11',
    'serves a snapshot as ordinary JSON rather than as the canonical text its digest was taken over, ' +
      'so the cheapest check anybody runs - sha256 over the response body - answers the wrong thing ' +
      'while every reader that re-canonicalises still agrees',
    [responseFile(SERVE_THE_CANONICAL_TEXT, `  canonicalText: JSON.stringify(snapshot),`)],
    killed(onEach('the-body-served-is-already-canonical')),
  ),

  sameOnEveryLens(
    'I-12',
    'puts a frozen field into the answer a name resolves to, so a reader can no longer recompute the ' +
      'digest without being told which fields to strip - and being told is the trust this unit exists ' +
      'to remove',
    [
      responseFile(
        A_BINDING_IS_ONLY_STANDING,
        // Written with a structural type rather than by naming `HarnessFile`, so that the defect is
        // caught by the guard that exists for it and not by an import this file does not have. A
        // mutant killed by the typechecker would measure the import and not the projection.
        `  readonly alsoFoundBy?: readonly LearnedTerm[]
  readonly harness: readonly { readonly path: string }[]
}`,
      ),
      responseFile(
        A_BINDING_IS_BUILT_FROM_STANDING,
        `    : { alsoFoundBy: entry.standing.alsoFoundBy }),
  harness: [],
})`,
      ),
    ],
    killed(onEach('a-contract-binding-carries-only-the-address')),
  ),

  sameOnEveryLens(
    'I-13',
    'hashes a served file before normalising it, so a reader whose transport hands back CRLF is told ' +
      'their whole platform modified the file - the defect I-01 was, arriving on the reading side',
    [responseFile(NORMALISE_THEN_HASH, `  const recomputed = digestOfBytes(response.bytes)`)],
    killed(['a-blob-answer-that-arrived-with-crlf-still-verifies']),
  ),

  sameOnEveryLens(
    'I-14',
    'offers a contract the catalogue refused for installation, which is the search index contradicting ' +
      'the refusals page of the same site',
    [responseFile(INSTALLABLE_MEANS_PUBLISHED, `      installable: true,`)],
    killed(['a-refused-contract-is-findable-and-not-installable']),
  ),

  sameOnEveryLens(
    'I-15',
    'resolves a dependency graph in the order it walks rather than in the order it must be written, so ' +
      'an install leaves the project between two writes with a file importing something that is not ' +
      'there yet',
    [implementationFile(WALK_BEFORE_PUSHING, WALKS_AFTER_PUSHING)],
    killed(['a-shared-dependency-is-resolved-once', 'nothing-is-written-before-what-it-imports']),
  ),

  // -------------------------------------------------------------------------
  // Two defects of the row a client reads before it can name what it installed.
  //
  // `exports` was put on the index by a consumer that could not print an import line, and the two
  // guards that arrived with it would otherwise be silent under this battery - which is the state
  // `unprobedRegions` exists to refuse, and which this repository answers with a mutant rather than
  // with a declaration wherever a defect can be written.
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'I-16',
    'serves only the answer of a contract that publishes a diagnostic beside it, so `toopo add` ' +
      'prints an import line naming half the surface and every caller writes their own error message',
    [responseFile(THE_DIAGNOSTIC_TRAVELS_WITH_THE_ANSWER, `  ...exports.filter((entry) => entry.role === 'the-answer'),`)],
    killed(['the-index-names-what-a-caller-imports', 'the-index-stays-the-smallest-thing-the-registry-serves']),
  ),

  sameOnEveryLens(
    'I-17',
    'puts the description into the row fetched before every search, which is the field this type ' +
      'says in as many words it does not carry - and the claim it makes about its own size stops ' +
      'being true without anybody noticing',
    [
      responseFile(
        THE_INDEX_CARRIES_WHAT_A_SEARCH_PAYS_FOR,
        `      exports: identity.exports,
      description: identity.summary.repeat(8),`,
      ),
    ],
    killed(['the-index-stays-the-smallest-thing-the-registry-serves']),
  ),

  /**
   * Three defects in the reading of a declared signature, which is where a case of block 4.4 becomes a
   * *call* rather than a row of fields.
   *
   * **Three of six, and the three that are missing were written, run and removed.** A signature reader
   * that misreads a shape one of the five actually writes stops that contract serialising, and a
   * contract that does not serialise reddens everything: measured, taking the type where the name is
   * turned eighty guards of this folder red at once, across every suite here. That is a true verdict
   * and a useless attribution - what caught the defect is not a guard anybody wrote about signatures,
   * it is the whole of `packages/registry/` failing to start - and this repository already counts a kill of
   * that kind apart, under `killedByTypecheck`, for the same reason.
   *
   * So what stays is the three whose shape none of the five writes: a comma inside a generic type, a
   * mark about arity, and a signature this reader cannot follow at all. Each reddens the guard written
   * for it and nothing else. The eleven that are left are declared below, with the measurement rather
   * than with a shrug.
   */
  sameOnEveryLens(
    'I-20',
    'splits the parameter list on every comma no bracket encloses, so `Map<K, V>` as a parameter type ' +
      'is read as two parameters and half a type becomes a name',
    [signatureFile(A_COMMA_INSIDE_A_TYPE_SEPARATES_NOTHING, `    else if (character === ',' && brackets === 0) {
      parts.push(list.slice(start, at))`)],
    killed(['a-comma-inside-a-generic-type-separates-no-parameter']),
  ),

  sameOnEveryLens(
    'I-22',
    'keeps the marks that say how often a parameter may be passed, so a page would render `...rest` ' +
      'and `second?` as the names a caller writes',
    [signatureFile(A_MARK_ABOUT_ARITY_IS_NOT_A_NAME, `          .trim(),`)],
    killed(['an-optional-or-rest-parameter-is-named-without-its-mark']),
  ),

  sameOnEveryLens(
    'I-23',
    'answers a call with no parameters where it cannot read one, so a declaration this reader does ' +
      'not understand reaches a record as a function that takes nothing',
    [signatureFile(A_SIGNATURE_THAT_CANNOT_BE_READ_IS_REFUSED, `  return ''`)],
    killed(['a-declaration-this-reader-cannot-follow-is-refused']),
  ),

  /**
   * The grouping refusal, removed wholesale.
   *
   * What survives it is a table whose headings and cases have come apart, and the page renders it
   * without complaint: a heading over nothing, a case under nothing, a group split in two under one
   * title. Every anchor still resolves and every word is still there, which is why the refusal is
   * where it is rather than left to a reader.
   */
  sameOnEveryLens(
    'I-24',
    'accepts any grouping at all, so a table reaches a record with a heading nothing sits under and ' +
      'a case belonging to a group the table never declared',
    [serialiseFile(A_GROUPING_IS_A_PARTITION, `  return table.groups`)],
    killed(['a-grouping-that-is-not-a-partition-is-refused']),
  ),

  /**
   * The address refusal, removed. A group and a case become one `#id` on one page and the link lands
   * on whichever the browser meets first - the defect that only appears once somebody has shared it.
   */
  sameOnEveryLens(
    'I-25',
    'lets a group take the address of a case, so two elements of one page answer to one anchor',
    [serialiseFile(AN_ADDRESS_IS_HELD_ONCE, `  const taken: readonly string[] = []`)],
    killed(['a-group-that-takes-a-case-address-is-refused']),
  ),

  /**
   * The licence perimeter widened, which is the mutant the whole derivation exists for.
   *
   * `referenceImplementationOf` is the single answer to *what does the installer copy*, and the licence
   * guards read it rather than a list of paths. This edit makes it answer the whole harness, so
   * `contract.ts` and six others enter the copied set carrying no MIT-0 header - the exact shape of the
   * failure a hand-written perimeter would produce silently on the day a contract gains a second file.
   *
   * **The file-list guards redden with it, and that is the point rather than a redundancy.** The list
   * is well guarded already; what none of those guards establishes is that the *licence* follows the
   * list. The red set is over the line the pin rule draws, so the pin names only the guard this was
   * written for.
   *
   * What no mutant here can produce is the case that matters most: a file entering the copied set
   * **legitimately**, which needs a contract to declare a second file. Every simulation of it also
   * contradicts a declared file list, so those fire too. That sub-case is unprobed by construction,
   * and it is the one where this guard is the only thing standing between a new contract and a
   * mislicensed file in somebody's repository.
   */
  sameOnEveryLens(
    'I-26',
    'copies the whole harness rather than the entry file, so seven files land in a user project and ' +
      'six of them carry no licence header at all',
    [serialiseFile(THE_PERIMETER_IS_THE_ENTRY_FILE, `    (file) => file.path.endsWith('.ts'),`)],
    killed(['every-file-the-installer-copies-is-marked-mit-0']),
  ),

  /**
   * The perimeter emptied, which is the same derivation read from the other end.
   *
   * With nothing copied, the marking guard passes vacuously - an empty set is all marked - and the five
   * files that really do carry a header become strays under a licence nobody chose. That asymmetry is
   * why the perimeter is guarded in both directions rather than once: the half that survives an empty
   * answer is not the half that catches it.
   *
   * It reddens the origin guard too, and honestly so. Those five headers are allowed to spell the
   * origin *because* they are copied; stop copying them and the allowance goes with it.
   */
  sameOnEveryLens(
    'I-27',
    'copies nothing, so the marking guard is satisfied by an empty set while five files carry a ' +
      'licence header the perimeter no longer accounts for',
    [serialiseFile(THE_PERIMETER_IS_THE_ENTRY_FILE, `    () => false,`)],
    killed([
      'nothing-the-installer-does-not-copy-is-marked',
      'the-origin-is-spelled-only-where-a-guard-resolves-it',
    ]),
  ),

  /**
   * The copied licence changed in the declaration and not in the files, which is the drift a
   * transcription exists to be caught by.
   *
   * All three guards it reddens read `licenceHeaderOf`, and they are three claims rather than one:
   * that the sources carry the header, that the example `LICENSE` shows a reader is a header those
   * sources carry, and that the example is of the form a reader would actually receive. An example is
   * the part of a licence a reader trusts most and the part nothing else checks.
   *
   * **It was two until ADR-0159 and the count is not the interesting part.** The third guard exists
   * because two banner forms do, and this edit reddens it for a reason of its own: with
   * `THE_COPIED_LICENCE` moved, no contract's composed header matches what `LICENSE` quotes, so the
   * set of contracts the example shows is empty and there is no form to be current.
   */
  sameOnEveryLens(
    'I-28',
    'declares copies to be MIT while every copied file says MIT-0, so the licence a user reads on the ' +
      'file and the licence the project believes it granted are different',
    [licenceFile(WHAT_A_COPY_IS_UNDER, `export const THE_COPIED_LICENCE = 'MIT'`)],
    killed([
      'every-file-the-installer-copies-is-marked-mit-0',
      'the-licence-file-quotes-a-header-a-contract-really-carries',
      'the-licence-file-shows-the-banner-a-reader-would-receive',
    ]),
  ),

  /**
   * The repository's own licence, changed where nothing but `package.json` would notice.
   *
   * It is the smallest mutant in this battery and it is here because the field it moves is the one a
   * licence scanner reads before a company allows an install - so a disagreement between the manifest
   * and this declaration is settled by whichever the tool happens to read.
   */
  sameOnEveryLens(
    'I-29',
    'declares this repository Apache-2.0 while `package.json` and `LICENSE` both say MIT, so the npm ' +
      'page and the code disagree about the terms',
    [licenceFile(WHAT_THIS_REPOSITORY_IS_UNDER, `export const THE_REPOSITORY_LICENCE = 'Apache-2.0'`)],
    killed(['the-public-fields-npm-shows-are-the-ones-this-code-declares']),
  ),

  /**
   * The banner a new contract takes goes back to the one with a copyright on it, which is ADR-0159
   * quietly undone.
   *
   * The edit is one word and it is the plausible one: somebody restoring what they take for the
   * catalogue's convention, on a constant whose two values are both spelled in the same union three
   * lines above it. What it costs is the whole of that decision - the next contract published would
   * freeze a copyright line into every repository that installs it, for the life of its major.
   *
   * **It cannot redden `a-contract-not-yet-published-carries-the-current-banner` alone, and the reason
   * is a property of today's catalogue rather than of this cell.** That guard's population is the
   * contracts the ledger binds nothing for, which is `array/group-by@1` and only that - and
   * `array/group-by@1` is also the contract `LICENSE` shows, because it is the only one carrying the
   * current form. So every state that makes the first guard red makes the second red too, and no edit
   * available today separates them. The two are genuinely different claims - measured, pointing
   * `LICENSE` at a real header of the superseded form reddens the example guard alone while this one
   * stays green - and the independence runs one way until a second unpublished contract exists.
   */
  sameOnEveryLens(
    'I-69',
    'restores the copyright to the banner a new contract takes, so the next contract published freezes ' +
      'an attribution line into every repository that installs it',
    [
      licenceFile(
        WHAT_A_NEW_CONTRACT_CARRIES,
        `export const THE_CURRENT_BANNER: Banner = 'a-copyright-beside-the-marking'`,
      ),
    ],
    killed([
      'a-contract-not-yet-published-carries-the-current-banner',
      'the-licence-file-shows-the-banner-a-reader-would-receive',
    ]),
  ),

  /**
   * The address stops rendering its language, which is the state this repository shipped in until the
   * rendering was repaired - so this cell is the defect put back rather than one invented for it.
   *
   * It is the whole of what made the omission survivable for so long: the coordinate was in the record,
   * in `sameContract` and in the lockfile, every consumer went on working, and the only thing that
   * changed was the strings a reader, a crawler and a foreign repository see. Nothing was in a position
   * to notice, because each consumer sees one rendering and the claim is about all of them.
   *
   * **Six guards and all six are named.** ADR-0076 requires a set of five or fewer to be named in
   * full and lets a wider one name only what the mutant was written to exercise; this one crossed to
   * six when ADR-0159 added a third licence guard, and it is named in full anyway because every one of
   * the six is a consequence a reader would want to see. **The sentence here said *five* and was false
   * for exactly as long as it took the battery to be replayed**, which is the drift a pin exists to
   * report and a comment does not.
   *
   * They are three different claims and that is the useful part: the two address guards say the
   * rendering lost a coordinate, the three licence guards say files in somebody else's repository now
   * carry a header that is not the one this code writes, and `a-shared-dependency-is-resolved-once`
   * says the resolution's own answer moved. A defect in an address is not local to the address.
   *
   * **The abbreviation was measured and is not a second cell.** Rendering `ts/` instead of the
   * language's own value reddens exactly these five, so it establishes nothing this one does not and
   * would be a cell whose only content is a second spelling of one edit. The refusal is recorded here
   * rather than left for somebody to propose again.
   */
  {
    ...sameOnEveryLens(
      'I-30',
      'renders an address without its language, so every URL, page path, case anchor and installed ' +
        'licence header goes back to a spelling a second language could never be added to',
      [addressFile(AN_ADDRESS_RENDERS_ITS_LANGUAGE, '  `${address.name}@${address.major}`')],
      killed([
        'every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract',
        'a-rendered-address-is-the-spelling-frozen-with-the-major',
        'every-file-the-installer-copies-is-marked-mit-0',
        'the-licence-file-quotes-a-header-a-contract-really-carries',
        'the-licence-file-shows-the-banner-a-reader-would-receive',
        'a-shared-dependency-is-resolved-once',
      ]),
    ),
    /**
     * **This is the only cell of this repository that produces the defect ADR-0166 was written for**,
     * and it produced it silently for as long as it has existed. Replayed over the six batteries whose
     * folder holds a test file that builds something in a setup or tears something down - this one at
     * 89/94, `packaging` at 18/19, `cli-install` at 72/72, `cli-update` at 35/35, `cli-search` at 3/3
     * and `cli-remove` at 21/21: **one cell of 224**. ADR-0166 carries the coordinates.
     *
     * `frozen-for-life.test.ts` builds its subject by cloning this repository at committed `HEAD` and
     * looking the published binding up under `WHAT = renderContract(SLUGIFY.address)`. The clone holds
     * the unmutated spelling and the process holds the mutated one, so the key misses, `rebuild()`
     * throws inside `beforeAll`, and the four guards below are reported `skipped` rather than run. The
     * assertion count does not move, so nothing before ADR-0166 could see it.
     *
     * **The defect is detected and it is detected by a throw rather than by a guard.** That is why the
     * silence is declared instead of repaired: making the `beforeAll` fail into its guards would have
     * them claim to have caught a defect in address rendering, when their subject is the freeze -
     * which is the misattribution this file already records against `array/group-by@1`'s
     * `language.test.ts`. Redesigning that fixture is an entry of `CLAUDE.md`'s open list, not a
     * change to make from here.
     *
     * The verdict is unaffected and that was measured rather than assumed: the six guards this cell
     * pins are in other files and all six really fail, so `killed` was never wrong. Only its silence
     * was.
     */
    leavesUnanswered: {
      guards: [
        'a-comment-reworded-in-a-published-contract-is-refused',
        'a-published-contract-nothing-touched-is-accepted',
        'a-standing-change-and-prose-outside-the-harness-are-accepted',
        'the-decision-to-publish-moves-no-digest',
      ],
      reason:
        'this mutant changes the address this process renders and not the address the clone at ' +
        'committed HEAD binds, so the subject of that file cannot be built and its `beforeAll` throws',
    },
  },

  /**
   * One rendering builds the address by hand instead of calling `renderContract`, and every other
   * rendering goes on being right.
   *
   * **This is the cell that makes the family guard load-bearing, and its width is the measurement.**
   * It reddens exactly one guard in this folder, against I-30's five - because everything that resolves
   * a rendering resolves it against `renderContract`, so a form that stops going through
   * `renderContract` stops being compared with anything. A guard aimed at `renderContract` alone would
   * be green here, and so would every consumer: `renderMutant` feeds a provenance citation that nothing
   * else reads back.
   *
   * The edit is deliberately the *plausible* one rather than a wrong one. Interpolating the parts is
   * what somebody writes who has the address in hand and does not think of it as a rendered thing, and
   * it is right about the parts it names - which is why nothing but a guard over the family catches it.
   */
  sameOnEveryLens(
    'I-31',
    'renders a mutant address out of the contract\'s parts rather than through `renderContract`, so ' +
      'one address in the family silently loses the language while the others keep it',
    [
      addressFile(
        A_MUTANT_IS_RENDERED_ON_ITS_CONTRACT,
        '  `${address.contract.name}@${address.contract.major}:${address.battery}/${address.mutant}`',
      ),
    ],
    killed(['every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract']),
  ),

  /**
   * A sentence written to stand alone, put back into the slot that takes a complement.
   *
   * It is the defect this repository shipped with, restored. The methodology page writes
   * `This does not establish ${butNot}.`, and `WHAT_A_SIGNATURE_DOES_NOT_PROVE` is a whole sentence
   * about three things, so the page published *This does not establish a signature attests who
   * published this snapshot and from what build* - denying, two lines under it, the claim the row
   * exists to make.
   *
   * **The composed sentence is well formed and false, which is why the guard cannot be a shape check
   * and the cell cannot be skipped.** Nothing about its punctuation is wrong; what is wrong is which
   * slot the value is in, and the only thing that can know is a guard that knows the value is rendered
   * whole somewhere else. A guard that claims detection and has never been red is decorative until a
   * mutant reaches it - `run.ts` says so and says the rule has no nuance - so this cell is what
   * `unprobedRegions` was briefly asked to excuse and correctly could not.
   */
  sameOnEveryLens(
    'I-32',
    'puts a sentence the methodology page renders whole back into the slot where the page writes ' +
      '`This does not establish ...`, so the page denies the claim it is published under',
    [
      verifiabilityFile(
        A_COMPLEMENT_RATHER_THAN_A_SENTENCE,
        '    butNot: WHAT_A_SIGNATURE_DOES_NOT_PROVE,',
      ),
    ],
    killed(['a-sentence-rendered-whole-is-not-also-a-complement']),
  ),

  /**
   * The repository URL loses npm's prefix, which is the edit somebody makes who reads it as noise.
   *
   * It is deliberately the plausible mutant rather than a wrong URL: `https://github.com/toopohq/toopo.git`
   * is the address Mathis gave and every character of it survives here - what moves is the one thing
   * npm's own documentation owns, and the one thing nothing in this repository can measure, since the
   * rendering of this field belongs to a page no test here reaches.
   *
   * **A dead or missing link in this field is silent in a way the other three are not.** A wrong licence
   * is read by a scanner, a wrong homepage is a redirect somebody notices; a `repository` npm cannot
   * resolve produces a page with no link to the code and nothing that says a link was intended - on a
   * package whose whole argument is that the reader should go and check.
   */
  sameOnEveryLens(
    'I-33',
    'drops the prefix npm documents for `repository.url`, so the manifest states the source repository ' +
      'in a spelling nothing here can measure the rendering of',
    [
      publicationFile(
        THE_SOURCE_CARRIES_NPM_S_PREFIX,
        `export const THE_SOURCE_REPOSITORY = 'https://github.com/toopohq/toopo.git'`,
      ),
    ],
    killed(['the-public-fields-npm-shows-are-the-ones-this-code-declares']),
  ),

  /**
   * The author's address becomes a personal one, which is what filling the field from `git config` does.
   *
   * The defect it restores is not a broken build and would pass every review that reads the manifest for
   * correctness: the field is well formed, it names the right person, and it works. What it does is
   * publish somebody's personal inbox into an immutable version, where it is harvested and cannot be
   * withdrawn from the copies that carried it.
   *
   * It edits the address and not the name, and what chose that has expired without changing the cell.
   * `THE_AUTHOR.name` fed `THE_COPYRIGHT` and therefore the five copied files, so a mutant on it would
   * have reddened the marking guards too and said nothing about which guard reads the manifest;
   * ADR-0190 parted the two, and the name here now reaches the manifest alone. The address is what the
   * cell is about either way - a personal inbox is the half that is harvested and cannot be withdrawn -
   * and it is in no licence header, so this cell reddens exactly the one assertion it was written for.
   */
  sameOnEveryLens(
    'I-34',
    'publishes a personal e-mail as the package author instead of the project address, in a manifest ' +
      'field that is immutable once a version exists',
    [publicationFile(THE_ADDRESS_IS_THE_PROJECT_S, `  email: 'mathis.perron@example.com',`)],
    killed(['the-public-fields-npm-shows-are-the-ones-this-code-declares']),
  ),

  /**
   * The author's name becomes a person's, which is what the field held until ADR-0190.
   *
   * **It is not I-34 with the other half of the field edited, and the pin is where the difference
   * is.** Until ADR-0190 one constant fed both this field and `THE_COPYRIGHT`, so this exact edit
   * reddened the manifest guard *and* the marking guards over the five copied files, and said nothing
   * about which of them reads a manifest. That record parted the two, and the name now reaches the
   * manifest alone. So the cell names one guard, and naming one is the assertion: re-couple the
   * holder to the author and this cell reddens two, disagreeing with what its battery pins for it.
   * The parting is otherwise kept by nothing that runs - ADR-0190 demonstrated it by hand, once.
   *
   * It closes that record's own declared absence, which said in as many words that the name was a
   * mutable point no cell aimed at. ADR-0190, ADR-0191.
   */
  sameOnEveryLens(
    'I-81',
    "publishes a person's name as the package author instead of the project's, in a manifest field " +
      'that is immutable once a version exists',
    [publicationFile(THE_NAME_IS_THE_PROJECT_S, `  name: 'Mathis Perron',`)],
    killed(['the-public-fields-npm-shows-are-the-ones-this-code-declares']),
  ),

  /**
   * `edgeTo` hashes the record instead of the snapshot of it, so every edge carries a digest nothing
   * publishes.
   *
   * **The plausible slip rather than a wrong one.** `digestOf(target, 'snapshot')` is what somebody
   * writes who has the record in hand and reads `digestOfSnapshot` as a name for the label rather than
   * for the projection - it canonicalises under the right label, it is deterministic, and every edge it
   * produces is a well-formed sha-256. What it is not is the address of anything the registry serves.
   *
   * It exists because `edgeTo` is the whole of what makes a lying edge unconstructible here: there is no
   * shape that lets a caller supply a digest, so the only way one can be wrong is for the derivation to
   * read the wrong value. A guard that resolves each edge against the graph's own snapshots is
   * `heldAt`'s rule with the registry's resolver instead of a wire, and this is the mutant that says it
   * is not a restatement of the function it checks.
   *
   * It reddens one guard of this folder and no other, because a wrong *digest* leaves every address
   * intact: `resolveDependencies` walks `edge.implementation`, so the order, the dedup and the depth are
   * all still right. The client half is out of reach here for the ordinary reason - a battery collects
   * its own configuration, and `cli-install` owns the guards that follow an edge over a wire.
   */
  sameOnEveryLens(
    'I-35',
    'derives an edge\'s digest from the record rather than from the snapshot of it, so every edge of ' +
      'the graph names an address the registry does not serve',
    [snapshotFile(AN_EDGE_READS_THE_DIGEST_OFF_THE_ARTEFACT, `    digest: digestOf(target, 'snapshot'),`)],
    killed(['every-edge-resolves-to-the-artefact-it-names']),
  ),

  /**
   * The runtime floor is lowered to the baseline every manifest carries, and nothing else moves.
   *
   * `engines` is the one field npm reads *before* installing, so it is the only place this project can
   * refuse a runtime rather than crash on it. Lowered, an install on the named version succeeds and
   * `toopo` fails at import on `node:util`'s `diff` - a stack trace naming a node internal, in front of
   * somebody who has just typed the line a contract page gave them and has no way to relate the two.
   *
   * The value is derived from two APIs the code calls, so the mutant is what a derivation looks like
   * when it is replaced by a habit: `>=18.0.0` is right about nothing here and is what most manifests
   * say.
   */
  sameOnEveryLens(
    'I-36',
    'lowers the declared runtime floor below the version the APIs this code calls were added in, so ' +
      'npm accepts an install that can only fail at import',
    [publicationFile(THE_FLOOR_IS_WHAT_THE_CODE_CALLS, `export const THE_MINIMUM_RUNTIME = '>=18.0.0'`)],
    killed(['the-public-fields-npm-shows-are-the-ones-this-code-declares']),
  ),

  /**
   * The emission serves what an *installation* fetches instead of what a *client* can ask for.
   *
   * It is the mutant the whole shape of `emit.ts` exists against, and it is the plausible one rather
   * than a wrong one: `packaging/freeze.ts` records the installer's walk and is right to, so somebody
   * reading both writes the same rule here. Under it every implementation snapshot still names its own
   * file, so `toopo add` installs correctly and the whole of `packages/cli/` stays green - what disappears is
   * the harness, twenty-four blobs whose digests a contract page publishes and whose absence permanent
   * rule 5 is about.
   *
   * That is why the closure guard reads the addresses back out of the served bytes rather than asking
   * the walk what it names: a walk that has stopped naming something agrees with itself.
   */
  sameOnEveryLens(
    'I-37',
    'emits only the files an installation fetches, so every harness digest a contract page publishes ' +
      'is served nowhere and the suite this catalogue sells is a page of 404s',
    [
      emitFile(
        A_SNAPSHOT_NAMES_EVERY_FILE_IT_FREEZES,
        '        ...(frozen.unit === \'contract\' ? [] : blobsNamedBy(frozen)),',
      ),
    ],
    killed(['the-emitted-tree-is-closed', 'every-file-a-published-contract-freezes-is-served']),
  ),

  /**
   * An edge names the artefact it points at and not the contract it belongs to, which is the emission
   * built from the index alone.
   *
   * The catalogue cannot express it - the five depend on nothing - so the cell reddens on the imagined
   * graph, where `pad` is reachable only through `clamp` and `sign`. A reader who fetches a snapshot
   * and sees it depend on `imagined-number/clamp@1` can ask that contract for its implementations, and a tree
   * that learned its contracts from the index answers 404 to a question the artefact itself invited.
   */
  sameOnEveryLens(
    'I-38',
    'follows an edge to the artefact it names and not to the contract that owns it, so a dependency ' +
      'a reader learned about from a snapshot has no answers in the tree',
    [
      emitFile(
        AN_EDGE_NAMES_THE_CONTRACT_IT_DEPENDS_ON,
        `          : frozen.frozen.dependsOn.map(
              (edge) => ({ method: 'snapshot', digest: edge.digest }) as const,
            )),`,
      ),
    ],
    killed(['an-edge-is-followed-to-the-artefact-it-names']),
  ),

  /**
   * The address goes back to being percent-encoded, which is the spelling this unit removed.
   *
   * `encodeURIComponent` on a rendered address is what somebody writes who is thinking about a URL and
   * not about a file: it is correct for a query parameter and it produces `typescript%2Fnumber%2Fparse@1`,
   * a name no filesystem holds and a segment many hosts rewrite before routing. The tree still builds,
   * every answer is still written, and every address inside it names something that is not there.
   */
  sameOnEveryLens(
    'I-39',
    'percent-encodes a rendered address into one path segment, so every answer about a contract is ' +
      'written at a name no filesystem can hold and no page shares',
    [
      endpointsFile(
        AN_ADDRESS_IS_A_PATH_AND_NOT_A_SEGMENT,
        '      return `/${encodeURIComponent(address)}/${endpoint.id}`',
      ),
    ],
    killed([
      'a-page-and-the-answers-about-that-contract-share-one-address',
      'a-url-is-a-file-path-with-its-leading-slash-taken-off',
      'an-edge-is-followed-to-the-artefact-it-names',
      'the-emitted-tree-is-closed',
      'where-an-answer-lives-reads-back-to-the-question-it-answers',
    ]),
  ),

  /**
   * The one endpoint nothing answers is declared under a name that is no endpoint.
   *
   * A mistyped key, which is the whole of what makes it worth a cell: the record still has an entry,
   * the reason and the trigger are still there, and the endpoint it was written about is now answered
   * by nothing and declared by nothing. **The port that is the whole read API is the only one where
   * that can be caught**, because it is the only one whose totality is an equality.
   */
  sameOnEveryLens(
    'I-40',
    'declares the unanswered endpoint under a name no endpoint carries, so `attestations` is answered ' +
      'by nothing and deferred by nothing at once',
    [readApiFile(AN_UNANSWERED_ENDPOINT_IS_NAMED_AS_IT_IS_DECLARED, '  attestation: {')],
    killed(['every-endpoint-is-answered-or-declared-unanswerable']),
  ),

  /**
   * The trigger is emptied and the reason is left, which is the state `DeferredNeed` was given a second
   * field to make impossible.
   *
   * A reason ages into a description of the past; a trigger stays checkable. The type requires both, so
   * what a type cannot catch is a field present and empty - which is what this writes.
   */
  sameOnEveryLens(
    'I-41',
    'leaves an unanswered endpoint its reason and empties the event that would close it, so a ' +
      'deferral becomes a description of the past that nobody revisits',
    [readApiFile(A_DEFERRAL_NAMES_THE_EVENT_THAT_CLOSES_IT, "    until: '',")],
    killed(['an-unanswered-endpoint-names-what-would-close-it']),
  ),

  /**
   * A root of the closure is dropped, and the tree it emits is still closed.
   *
   * That is the whole reason the roots are declared beside the walk and derived in the guard: nothing
   * names the methodology, so removing it writes one file fewer and every other guard here stays green.
   * A smaller tree that is internally consistent is exactly what a walk of the questions cannot notice
   * about itself.
   */
  sameOnEveryLens(
    'I-42',
    'drops one of the questions a client can ask having read nothing, so an answer nothing else names ' +
      'is never written and the tree is smaller and still closed',
    [emitFile(EVERY_QUESTION_THAT_NEEDS_NOTHING_IS_A_ROOT, "  { method: 'refusals' },")],
    killed(['the-questions-that-need-nothing-are-the-answers-about-the-catalogue']),
  ),

  // -------------------------------------------------------------------------
  // The revision a named answer carries
  // -------------------------------------------------------------------------

  /**
   * The revision filed as the registry's opinion, which is the mistake the fourth `FieldNature` exists
   * against.
   *
   * `revisableFieldsOf` is rendered into what `implementation-bindings` publishes as *the registry's
   * opinion, changeable without anything being wrong*, beside a sentence telling a reader not to take
   * an opinion for a fact about the code. The revision is the one field of a named answer that is a
   * fact, and the one a lockfile keeps in order to go back to it. ADR-0090.
   */
  sameOnEveryLens(
    'I-43',
    'files the revision among the fields a reader is told are the registry\'s opinion, so the one ' +
      'thing in a named answer that is a fact is published as something changeable without anything ' +
      'being wrong',
    [
      responseFile(
        THE_REVISION_IS_NOT_AN_OPINION,
        `  addressing: 'the-question',
  servedFrom: 'revisable',
  address: 'the-question',
  digest: 'bound-for-life',
  publishedAt: 'bound-for-life',
  status: 'revisable',`,
      ),
    ],
    killed(['the-revision-is-not-published-as-an-opinion']),
  ),

  /**
   * The index stops carrying the revision it was built with, so every named answer of one deployment
   * agrees on a value that came from nowhere.
   *
   * It is the wiring rather than the vocabulary: the field is still declared, still typed, still in the
   * nature map, and the answer still has one - it is simply not the one the registry was asked for.
   */
  sameOnEveryLens(
    'I-44',
    'builds the contract index with a revision of its own rather than the one the registry was ' +
      'asked for, so an index and a binding from one deployment name two states',
    [
      responseFile(
        THE_INDEX_CARRIES_THE_REVISION_IT_WAS_BUILT_WITH,
        `  return {
    addressing: 'named',
    servedFrom: 'e'.repeat(40),`,
      ),
    ],
    killed([
      'a-named-answer-moves-when-the-revision-does-and-the-policy-says-so',
      'every-named-answer-names-the-revision-it-was-served-from',
      // The control of the content-addressed guard, and it is the assertion that keeps that guard from
      // passing on a registry where the revision reaches nothing: the named half *must* differ.
      'a-content-addressed-answer-is-the-same-bytes-at-every-revision',
    ]),
  ),

  /**
   * A revision stamped on a working tree that does not agree with its own commit.
   *
   * **It is the check that makes the field worth carrying at all.** An answer stamped with a revision
   * it cannot be rebuilt from invites a reader to check something that will not come back, which is
   * worse than carrying no revision. `git status --porcelain` is empty exactly when the tree agrees
   * with its commit, and it covers untracked files - a contract added and not committed is precisely
   * the change that would be served and then be unfindable.
   */
  sameOnEveryLens(
    'I-45',
    'names a revision for a working tree that does not agree with its commit, so a publication ' +
      'carries a durability anchor that fails the first time somebody tries it',
    [revisionFile(A_DIRTY_TREE_NAMES_NO_REVISION, `  if (false) {`)],
    killed(['a-tree-that-does-not-agree-with-its-commit-names-no-revision']),
  ),

  /**
   * The stand-in's revision made to look like one somebody could resolve.
   *
   * It is the argument `THE_UNPUBLISHED_VERSION` makes about `0.0.0-local`, on the other constant: a
   * plausible value names a state that exists nowhere and leaves nobody able to tell it from one that
   * does. Forty ones is a well-formed commit and no repository has it.
   */
  sameOnEveryLens(
    'I-46',
    'gives the stand-in a revision shaped like a real commit, so a lockfile written against a ' +
      'publication that never happened is indistinguishable from one written against a registry',
    [revisionFile(THE_UNPUBLISHED_REVISION_IS_THE_NULL_OID, `export const THE_UNPUBLISHED_REVISION = '1'.repeat(40)`)],
    killed(['the-unpublished-revision-is-shaped-like-one-and-names-nothing']),
  ),

  /**
   * A refusal from git arriving as whatever git threw.
   *
   * The screen is the point: a folder that is no repository is a state somebody meets - a checkout
   * from a tarball, a `git init` that never happened - and `execFileSync`'s own error names a command
   * line rather than what it means. It is the same rule `command.ts` keeps for a lockfile and an
   * unreachable registry.
   */
  sameOnEveryLens(
    'I-47',
    'lets git\'s own failure out rather than saying what it means for a publication, so a folder ' +
      'that is no repository ends in a spawn error instead of a sentence',
    [revisionFile(GIT_REFUSING_IS_A_REFUSAL_OF_OURS, `  } catch (error) {
    throw error
  }`)],
    killed(['a-folder-that-is-no-repository-names-no-revision']),
  ),

  /**
   * A well-formed object identifier that is not the commit, which is the failure a shape check cannot
   * see.
   *
   * `HEAD^{tree}` is forty lower-case hexadecimal digits and passes every test `revision.ts` makes of
   * its own answer. It names the tree rather than the commit, so a reader handed it could not check
   * out what was published - which is the whole of what the field is for, failing while looking
   * exactly right.
   */
  sameOnEveryLens(
    'I-48',
    'publishes the identifier of the tree rather than of the commit, so the revision is well formed, ' +
      'passes its own shape check, and names an object nobody can check out',
    [revisionFile(THE_REVISION_IS_THE_COMMIT, `  const head = git(root, 'rev-parse', 'HEAD^{tree}')`)],
    killed([
      'the-revision-of-a-clean-tree-is-the-commit-git-names',
      // The dirty-tree guard asks for the commit again after restoring the file, so it reads the same
      // wrong answer. Named because the pin is under five and ADR-0076 asks for all of them.
      'a-tree-that-does-not-agree-with-its-commit-names-no-revision',
    ]),
  ),

  // --- The freeze: the one claim this product is sold on, and what refuses its opposite. ADR-0093 ---

  /**
   * The comparison, inverted. It is the cheapest possible defect on the rule and the one that matters:
   * a freeze check that accepts a moved digest is the decorative guard this repository exists to
   * refuse, arriving on permanent rule 6.
   */
  sameOnEveryLens(
    'I-49',
    'accepts a binding whose digest moved and refuses one that did not, so a published address can ' +
      'be rebound with the check green',
    [rebindingFile(THE_DIGEST_IS_THE_ONE_IT_WAS_PUBLISHED_AS, '  if (held !== entry.digest) return null')],
    killed([
      'a-binding-whose-digest-moved-since-its-publication-is-refused',
      'a-binding-that-still-hashes-to-what-it-was-published-as-is-accepted',
      'a-standing-change-rebinds-nothing',
      'the-past-is-read-once-per-commit-however-many-bindings-share-it',
      'an-artefact-edited-after-its-publication-is-refused-end-to-end',
    ]),
  ),

  /**
   * A coordinate naming a commit that bound nothing under this address, passed over in silence.
   *
   * It is the branch that decays rather than breaks: the binding goes on being listed, no fault is
   * ever raised about it, and the freeze it claims stops being checked with nothing on screen.
   */
  sameOnEveryLens(
    'I-50',
    'passes over a binding whose publication commit bound no such address, so a wrong coordinate ' +
      'silently exempts an artefact from the check for ever',
    [rebindingFile(A_PAST_THAT_BINDS_NOTHING_IS_A_FAULT, '  if (false) {')],
    killed(['a-binding-published-from-a-commit-that-binds-no-such-address-is-refused']),
  ),

  /**
   * Forty zeros read as a commit. The stand-ins mint it, so every binding of a working tree would be
   * checked against a revision git cannot resolve - and the refusal would arrive on all four at once,
   * which is a check that has to be turned off rather than one that found something.
   */
  sameOnEveryLens(
    'I-51',
    'treats the null object identifier as a commit to rebuild at, so a stand-in\'s binding is asked ' +
      'about a revision that names nothing',
    [rebindingFile(A_STAND_IN_ANCHORS_NOTHING, '  REVISION.test(entry.publishedFrom)')],
    /**
     * One guard rather than the two it used to name, and the publication is what took the second.
     *
     * `the-five-anchor-nothing-and-the-check-says-which` reddened here because every binding of this
     * tree carried forty zeros, so removing that half of `isAnchored` dragged all of them into the
     * comparison. Every binding now names a real commit, so the removed half decides nothing about
     * this catalogue and the guard that replaced it stays green. What still reddens is the guard over
     * a ledger built to hold a stand-in, which is the claim this mutant is actually about.
     */
    killed(['a-binding-that-names-no-commit-is-not-asked-about']),
  ),

  // --- The date a binding carries, which is the other half of the same coordinate. ADR-0177 ---

  /**
   * The comparison, inverted, on the field nothing was watching for ten days.
   *
   * It is the cheapest defect on the rule and it is the one that was live: the registry answered
   * *17 August* for two bindings minted on the 20th and the 24th, because the commit lived in a map
   * and the instant lived one file over as a constant. Every guard this repository held was green
   * through it - the field is in no digest, no lockfile and no page - so the only surface it was wrong
   * on was the one a reader audits.
   */
  sameOnEveryLens(
    'I-75',
    'accepts a binding dated by anything at all and refuses one dated by its own commit, so a ' +
      'published address can carry an instant nobody measured with the check green',
    [rebindingFile(THE_INSTANT_IS_THE_ONE_THE_COMMIT_HAPPENED_AT, '  if (true) return null')],
    killed(['a-binding-dated-by-something-other-than-its-own-commit-is-refused']),
  ),

  /**
   * Two spellings of one moment, compared as text.
   *
   * git renders a commit date in the offset it was made in and the registry serves UTC, so a rule that
   * compared strings would refuse every correct pair at once - which is the shape of a check that has
   * to be turned off rather than one that found something.
   */
  sameOnEveryLens(
    'I-76',
    'compares the two instants as they are written rather than as the moments they are, so a ' +
      'correctly dated binding is refused for being spelled in its own offset',
    [rebindingFile(AN_INSTANT_IS_A_MOMENT_AND_NOT_A_SPELLING, '  return Number.isNaN(parsed) ? null : written')],
    killed(['a-binding-dated-by-its-own-commit-is-accepted-whatever-the-offset']),
  ),

  /**
   * A commit date git cannot render, compared instead of refused.
   *
   * The event is a reader asking git for the wrong thing - `%aI` traded for a format that answers a
   * name - and without this arm every binding would disagree at once, so the report would be about six
   * mismatched instants instead of about the one reader that stopped working.
   */
  sameOnEveryLens(
    'I-77',
    'compares an unreadable commit date against a served instant rather than refusing it, so a ' +
      'broken reader reports itself as six wrong dates',
    [rebindingFile(A_COMMIT_DATE_NOBODY_CAN_READ_IS_REFUSED, '  if (false) {')],
    killed(['a-commit-whose-date-cannot-be-read-is-refused']),
  ),

  /**
   * And the same silence on the other side, which is what a reader would be receiving.
   *
   * An unreadable `publishedAt` is worse than an absent one, because it looks like an answer. The two
   * arms are one defect wearing each other's clothes: this one is what the registry serves, and the one
   * above is this repository failing to ask.
   */
  sameOnEveryLens(
    'I-78',
    'compares a served instant nobody can read rather than refusing it, so an unreadable date leaves ' +
      'the check with nothing to say about it',
    [rebindingFile(A_SERVED_INSTANT_NOBODY_CAN_READ_IS_REFUSED, '  if (false) {')],
    killed(['a-binding-serving-an-instant-nobody-can-read-is-refused']),
  ),

  /**
   * Forty zeros dated against. A stand-in anchors nothing, so there is no commit to ask - and asking
   * anyway would spawn git on the null object identifier on every run of the site's own build.
   */
  sameOnEveryLens(
    'I-79',
    'dates a binding that names no commit against one anyway, so every binding of a working tree is ' +
      'asked about a revision that names nothing',
    [rebindingFile(A_STAND_IN_IS_NOT_DATED_AGAINST_A_COMMIT, '  const anchored = everyBinding(ledger)')],
    killed(['a-binding-that-names-no-commit-is-not-dated-against-one']),
  ),

  /**
   * The memory dropped. A contract and its reference are published together, so every commit here
   * dates two addresses and asking git is a spawn - the same cost the rebuilding memo one screen up
   * exists for, on a reader that is cheaper and still a process.
   */
  sameOnEveryLens(
    'I-80',
    'asks git for a commit date once per binding rather than once per commit, so a publication that ' +
      'minted two addresses is asked about twice',
    [rebindingFile(A_COMMIT_IS_ASKED_ONCE, '    const when = dateOf(entry.publishedFrom)')],
    killed(['the-commit-is-asked-once-however-many-bindings-share-it']),
  ),

  /**
   * Two bindings under one address, the second overwriting the first. `renderImplementation` joins an
   * id and a version with `@` and nothing refuses an id carrying one, so the collision is reachable -
   * and the binding that is lost is the one whose freeze stops being checked.
   */
  sameOnEveryLens(
    'I-52',
    'lets a second binding overwrite the first under one rendered address, so one artefact\'s freeze ' +
      'goes unchecked with nothing saying which',
    [rebindingFile(A_RENDERING_ADDRESSES_ONE_BINDING, '    bindings.set(what, digest)')],
    killed(['two-bindings-that-render-alike-are-a-corrupt-ledger']),
  ),

  /**
   * What crosses a process boundary, believed. A past commit's output is the one input in this check
   * that another program produced, and a reader that accepted any second field would compare a digest
   * against a word.
   */
  sameOnEveryLens(
    'I-53',
    'accepts anything in a past commit\'s second field, so a line that is not a digest is compared ' +
      'against one as though it were',
    [rebindingFile(A_PAST_COMMIT_ANSWERS_DIGESTS, '        if (false) {')],
    killed(['a-line-that-is-not-a-binding-is-refused-1']),
  ),

  /**
   * The wrong commit, asked. It is the reader's own failure mode and the one a shape check cannot see:
   * every answer is well formed, every digest is a real digest of real bytes, and the comparison is
   * against the tree rather than against the past.
   */
  sameOnEveryLens(
    'I-54',
    'checks out the head of the repository rather than the commit a binding was published from, so ' +
      'the past is compared against itself and nothing can ever have moved',
    [rebuildFile(THE_COMMIT_A_BINDING_NAMES_IS_THE_ONE_CHECKED_OUT, `  git(root, 'worktree', 'add', '--detach', '--quiet', worktree, 'HEAD')`)],
    killed([
      'a-commit-is-asked-what-it-bound-rather-than-the-tree',
      'an-artefact-edited-after-its-publication-is-refused-end-to-end',
      'a-rebuild-leaves-no-checkout-behind-it',
    ]),
  ),

  /**
   * A command line half understood. The script is the one thing a past commit hands this module, and
   * running whatever it says would be the freeze check executing something it did not read.
   */
  sameOnEveryLens(
    'I-55',
    'runs a past commit\'s `ledger` script whatever its command line says, so a runner this module ' +
      'never read decides what gets executed',
    [rebuildFile(WHAT_IS_RE_RUN_IS_NODE_AND_ONE_PATH, '  if (path === undefined) {')],
    killed([
      'a-commit-that-cannot-say-what-it-bound-is-refused-1',
      'a-commit-that-cannot-say-what-it-bound-is-refused-2',
    ]),
  ),

  /**
   * A checkout that outlives its run. `theRevision` refuses a tree that does not agree with its commit,
   * so a worktree left registered turns the next publication into a refusal - and the cause would be a
   * check that ran a week earlier.
   */
  sameOnEveryLens(
    'I-56',
    'leaves the checkout it made registered when a rebuild refuses, so a repository that ran the ' +
      'freeze check once can never name a revision again',
    [rebuildFile(A_REBUILD_TIDIES_UP_AFTER_ITSELF, '    // the checkout stays registered')],
    killed(['a-rebuild-leaves-no-checkout-behind-it']),
  ),

  /**
   * The shape of a line, taken on trust. Filling the two fields in rather than refusing the line is
   * how a boundary check usually rots: nothing throws, every line parses, and an address that arrived
   * empty is compared against a digest that arrived from somewhere else on the line.
   *
   * Three of the four shape rows redden and the fourth does not, which is the division worth naming: a
   * line with no tab at all still fails the digest test one screen down, so it is refused for the wrong
   * reason rather than accepted. I-53 is what covers that screen.
   */
  sameOnEveryLens(
    'I-57',
    'fills in a missing address and a missing digest instead of refusing the line, so a past ' +
      'commit\'s output is interpreted wherever it is not readable',
    [rebindingFile(A_LINE_IS_ONE_ADDRESS_AND_ONE_DIGEST, `        const [what = '', digest = ''] = line.split('\\t')`)],
    killed([
      'a-line-that-is-not-a-binding-is-refused-0',
      'a-line-that-is-not-a-binding-is-refused-2',
      'a-line-that-is-not-a-binding-is-refused-3',
    ]),
  ),

  // --- The policy as a header, which is the half a host reads. ADR-0097 ---

  /**
   * The promise dropped from the promise. `immutable` is the whole of what a year-long entry is worth:
   * without it a cache may still revalidate whenever it likes, and the two endpoints carrying the bulk
   * pay a round trip each for a body whose address is the digest of itself.
   */
  sameOnEveryLens(
    'I-58',
    'serves a content-addressed answer for a year without saying it is immutable, so the entry that ' +
      'can never be wrong is revalidated anyway',
    [responseFile(A_YEAR_LONG_ENTRY_SAYS_IT_IS_IMMUTABLE, '    // served without `immutable`')],
    killed([
      'a-content-addressed-answer-is-public-for-a-year-and-immutable',
      'every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not',
    ]),
  ),

  /**
   * The dangerous direction of the same edit. A named answer that is not revalidated is a CDN free to
   * hand out a binding that has moved - which is the failure `response.ts` separates the two halves of
   * the registry to prevent, arriving one floor down in the header nobody was sending.
   */
  sameOnEveryLens(
    'I-59',
    'serves a named answer without `must-revalidate`, so a cache may hand out a binding that has moved',
    [responseFile(A_NAMED_ANSWER_SAYS_IT_MUST_BE_REVALIDATED, '    // served without revalidation')],
    killed([
      'a-named-answer-is-public-and-revalidated-before-every-use',
      'every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not',
    ]),
  ),

  /**
   * A figure transcribed where one was derived, which is ADR-0018's shape arriving inside a header.
   *
   * **The cell worth reading, because one guard stays green by coincidence**: a year is what the
   * content-addressed policy declares, so `a-content-addressed-answer-is-public-for-a-year-and-immutable`
   * cannot tell a derived year from a typed one and passes. What sees it is the guard that perturbs the
   * policy and watches the string, and this cell is why that guard exists.
   */
  sameOnEveryLens(
    'I-60',
    'writes the lifetime into the header instead of reading it off the policy, so every named answer ' +
      'is served with the year the frozen half was promised',
    [responseFile(THE_LIFETIME_IS_READ_OFF_THE_POLICY, "    'max-age=31536000',")],
    killed([
      'a-named-answer-is-public-and-revalidated-before-every-use',
      'every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not',
    ]),
  ),

  // -------------------------------------------------------------------------
  // What a contract calls, and whether the freeze reaches it - ADR-0105
  // -------------------------------------------------------------------------

  /**
   * The state this repository was in until ADR-0105, injected as a defect.
   *
   * It is the whole of what that unit closed: the frozen half carries the seven files a contract owns
   * and forgets the ones its guards call, so emptying a shared check moves no address. Measured before
   * the field existed - `expectUniversalPropertiesAnswered` emptied, all eight ledger digests identical
   * to the byte, and a contract the guard exists to refuse green.
   *
   * The projection is emptied rather than dropped, and the difference decides what the cell measures.
   * Dropping the line leaves `filesNamedBy` spreading `undefined`, so the kill arrives as a TypeError
   * from a third module - a red, and a red about a crash rather than about a freeze.
   */
  sameOnEveryLens(
    'I-61',
    'freezes the files a contract owns and forgets the ones its guards call, so a shared check can be ' +
      'emptied under a published address without a digest moving - the defect ADR-0105 closed',
    [snapshotFile(PROJECT_THE_SHARED_SURFACE, '    sharedHarness: [],')],
    killed(['a-changed-shared-file-moves-the-digest']),
  ),

  /**
   * The declaration kept and the walk made decorative, which is the other half of the same field.
   *
   * A contract could then reach a module nobody declared, and the record would freeze the declared list
   * while the guards ran on something wider. It is `I-02`'s shape one level out - a list that describes
   * a folder against a folder that has stopped matching it - and the reason `sharedHarnessOf` refuses
   * rather than reporting.
   */
  sameOnEveryLens(
    'I-62',
    'hashes the shared surface a contract declares without checking that it is the one the harness ' +
      'reaches, so a module nobody declared decides a frozen contract\'s verdicts',
    [serialiseFile(REFUSE_A_SURFACE_THAT_IS_NOT_REACHED, '  void undeclared\n  void missing')],
    killed(['the-shared-surface-is-what-the-harness-reaches']),
  ),

  sameOnEveryLens(
    'I-63',
    'puts a fixture back at an address the catalogue could publish, which is the state this ' +
      'repository was in for nine addresses - and the one that costs is met by somebody writing the ' +
      'contract, not by anything here',
    [
      imaginedAddressFile(
        A_NAME_NO_CONTRACT_MAY_TAKE,
        `export const A_NAME_THE_CATALOGUE_DOES_NOT_HOLD: ContractAddress = {
  language: 'typescript',
  name: 'string/titlecase',
  major: 1,
}`,
      ),
    ],
    killed(['every-address-a-fixture-stands-at-is-one-the-catalogue-refuses']),
  ),

  sameOnEveryLens(
    'I-64',
    'stops refusing a contract offered in the space reserved for fixtures, so the prefix every ' +
      'fixture stands behind is a convention with nothing keeping it',
    [serialiseFile(REFUSE_AN_IMAGINED_ADDRESS, '  void isImagined(source.address.name)')],
    killed(['the-catalogue-refuses-a-contract-offered-at-an-address-a-fixture-stands-at']),
  ),

  /**
   * **The mutant `I-01` and `I-08` stopped being.** Both were retired to survivors because they only
   * differ from the reference where the working tree differs from what is served, and no clone git
   * produces has such a tree. This one differs where the *contract* does, so it is caught on every
   * checkout - which is what gives the end-to-end claim a witness anybody can reproduce. ADR-0148.
   */
  sameOnEveryLens(
    'I-65',
    're-encodes a source in Latin-1 after reading it as UTF-8, so every code point above U+007F is ' +
      'served as bytes the contract does not carry - and the digest a lockfile would hold is a digest ' +
      'of something this repository never committed. **The three unit guards over `servedBytes` stay ' +
      'green and that is measured rather than expected**: all three assert an ASCII result, so an ' +
      'edit agreeing with the reference on ASCII passes every one of them, and the sibling edit one ' +
      'line up on the decode side is caught by `a-byte-order-mark-is-not-content`. Its teeth are the ' +
      'files carrying a code point in U+0080-U+00FF - `date/add@1` through the `±` of its summary, ' +
      '`string/slugify@1` through nine of its fifty-eight - where `string/levenshtein@1`\'s single ' +
      '`U+1F600` is already a `?` after one pass and survives the second unchanged.',
    [
      canonicalFile(
        THE_SERVED_TEXT_IS_ENCODED_AS_IT_WAS_READ,
        `  return Buffer.from(withoutMark.replace(/\\r\\n/g, '\\n'), 'latin1')`,
      ),
    ],
    killed([
      'the-served-bytes-are-the-committed-bytes',
      'a-blob-answer-hashes-to-its-address-date-add',
      'a-blob-answer-hashes-to-its-address-string-slugify',
    ]),
  ),

  sameOnEveryLens(
    'I-66',
    'writes a binding with a space where the format declares one tab, so what one process renders ' +
      'the next cannot read at all - and the freeze check crossing that boundary refuses every line ' +
      'instead of comparing a single digest. It is the round trip and not the parser: every guard ' +
      'over `readBindings` alone stays green, because each one hands it a line written by hand.',
    [rebindingFile(A_BINDING_IS_SEPARATED_BY_ONE_TAB, '`${what} ${digest}\\n`')],
    killed([
      'a-rendered-set-of-bindings-reads-back-as-itself',
      'a-rendered-binding-is-what-a-past-commit-prints',
    ]),
  ),

  sameOnEveryLens(
    'I-67',
    "serves a contract's own files and not the files they import, which is the state ADR-0105 closed: " +
      'an auditor who fetches everything a snapshot names receives a suite that cannot resolve its ' +
      'own imports, and a snapshot that names blobs the registry has no way to hand over',
    [serialiseFile(WHAT_IS_SERVED_IS_THE_HARNESS_AND_WHAT_IT_REACHES, '')],
    killed([
      'a-fetched-harness-resolves-every-import-it-carries',
      'the-snapshot-names-no-blob-the-registry-cannot-serve',
      'the-emitted-tree-is-closed',
    ]),
  ),

  sameOnEveryLens(
    'I-68',
    'writes a re-examination with no commit beside it, so the one claim this catalogue makes about a ' +
      'language it does not own becomes unfalsifiable: a reader is told what Temporal answered and ' +
      'given no state of this repository to replay it against. It is the defect ADR-0018 names, on ' +
      'the field ADR-0150 added - a reading published without the coordinate that makes it one.',
    [
      catalogueFile(
        A_RE_EXAMINATION_IS_STAMPED,
        "'Block 4.4 was replayed against Temporal - all forty-three cases of both '",
      ),
    ],
    killed(['every-re-examination-carries-the-commit-it-was-taken-at']),
  ),

  sameOnEveryLens(
    'S-01',
    'drops the rule that every word of the query must be answered, so a contract matches on the ' +
      'words it happens to share - `sort array` answers `array/group-by@1` to somebody looking for a ' +
      'sorter, and eighteen of the twenty-eight queries the catalogue cannot answer come back with ' +
      'something. **Its pin used to name two guards where four reddened**, and the two it left out ' +
      'were the alias property and the rewording - measured at `a705977` by injecting it there. ' +
      'ADR-0076 asks a pin naming five or fewer to name all of them, and this is what a pin that ' +
      'does not costs: a reader takes the two named for the whole account of what the rule holds up',
    [searchFile(EVERY_WORD_MUST_BE_ANSWERED, `    false`)],
    killed([
      'every-declared-alias-finds-its-own-contract-first',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
      'a-query-the-catalogue-cannot-answer-answers-nothing',
      'a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing',
      'a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers',
    ]),
  ),

  sameOnEveryLens(
    'S-02',
    'lets a word be set aside without the remainder naming what tells the contracts apart, keeping ' +
      'only the price ADR-0154 put on the setting-aside: any deliberate field will do, so long as ' +
      'two of its words were carried. **It is a different defect from `S-01` and it was the same one ' +
      'until ADR-0154 split the gate.** That gate is a conjunction, and either operand made false ' +
      'kills the whole branch - so `if (false)` and `if (answered.length !== words.length && false)` ' +
      'are one mutant written twice, which is what these two cells were. What makes them two now is ' +
      'that the test on the right has two clauses that can be taken away separately, and they catch ' +
      'different things: `a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing` ' +
      'is red under `S-01` and **green** under this one, because the price is still being charged',
    [searchFile(A_FIELD_IS_NAMED_BY_WHAT_TELLS_THEM_APART, `      true &&`)],
    killed([
      'every-declared-alias-finds-its-own-contract-first',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
      'a-query-the-catalogue-cannot-answer-answers-nothing',
      'a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers',
    ]),
  ),

  sameOnEveryLens(
    'S-03',
    'answers a query with no words in it, so `toopo search "   "` is the whole catalogue. **The ' +
      'guard it reddens was written because this mutant survived**: the check is unreachable through ' +
      'the ordinary path - a query whose words are all unanswered already fails the rule above it - ' +
      'and the empty query is the one input that reaches it. The line it takes away now carries a ' +
      'second bound as well, which is why it reddens two guards rather than one',
    [searchFile(SOMETHING_THE_CONTRACT_CHOSE_MUST_HAVE_ANSWERED, `  if (false) return null`)],
    killed([
      'a-query-with-no-words-answers-nothing',
      'a-word-only-a-summary-carries-answers-nothing-on-its-own',
    ]),
  ),

  sameOnEveryLens(
    'S-04',
    'lets a query *extend* a word the catalogue carries instead of only shortening it - the ' +
      'symmetric prefix this file was first written with, which answers `stringify` with all three ' +
      'contracts carrying `string` and `datepicker` with `date/add@1`',
    [
      searchFile(
        A_SHORTENING_GOES_ONE_WAY,
        `  (asked.length >= MINIMUM_PREFIX && held.startsWith(asked)) ||\n` +
          `  (held.length >= MINIMUM_PREFIX && asked.startsWith(held))`,
      ),
    ],
    killed(['a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not']),
  ),

  sameOnEveryLens(
    'S-05',
    'drops the minimum length, so a three-letter word reaches across the catalogue and `add`, `url` ' +
      'and `key` each answer whatever they happen to start',
    [searchFile(THE_MINIMUM, `const MINIMUM_PREFIX = 1`)],
    // Measured rather than predicted: this does *not* widen into the negative half. What it breaks is
    // the corpus, because a one-letter prefix makes some other contract answer first.
    killed([
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
      'every-declared-alias-finds-its-own-contract-first',
    ]),
  ),

  // -------------------------------------------------------------------------
  // The order, on the two queries there is any order to have
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-06',
    'sorts worst first, which is invisible to the alias trial and to the corpus - measured, nought ' +
      'of their eighty-nine queries answers more than one contract - and is the whole reason the ' +
      'ranking guard exists',
    [searchFile(BEST_FIRST, `        : first.score - second.score,`)],
    killed(['a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias']),
  ),

  sameOnEveryLens(
    'S-07',
    'puts an alias above a name, so a word a contract carries in passing outranks the same word in ' +
      'the name of the contract it belongs to',
    [searchFile(A_NAME_OUTRANKS_AN_ALIAS, `  name: 20,`)],
    killed(['a-word-carried-by-a-name-outranks-the-same-word-carried-by-an-alias']),
  ),

  // -------------------------------------------------------------------------
  // What is searched
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-09',
    'stops searching the aliases, which is the whole of what the catalogue declares about how it ' +
      'expects to be looked for - and the one field this unit exists to make executable. **Its pin ' +
      'named two guards and three redden**, which the replay found and no reading did: ADR-0155 gave ' +
      'the search a second source of aliases and a guard comparing what an answer offers with what ' +
      'the search reads, and emptying `searchAliases` separates those two as surely as emptying the ' +
      'new field does. A pin naming five or fewer names all of them, so this is the second instance ' +
      'of what `S-01` records: a subset passes, and a reader takes the named ones for the whole ' +
      'account',
    [searchFile(THE_ALIASES_ARE_A_FIELD, `    ...[].map((alias: string) => ({`)],
    killed([
      'every-declared-alias-finds-its-own-contract-first',
      'every-phrase-an-entry-offers-is-a-phrase-the-search-reads',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
    ]),
  ),

  sameOnEveryLens(
    'S-28',
    'stops searching what the registry learned, which is every phrase a published contract could ' +
      'not put in its own frozen half - so `string to integer` answers nothing again and the ' +
      'catalogue is back to the state ADR-0155 was written for. **It is `S-09` on the other half of ' +
      'one field**: an alias and a learned term are read as one kind, so a mutant that reaches only ' +
      'one of the two is what says the trial above sweeps both',
    [searchFile(THE_LEARNED_TERMS_ARE_A_FIELD, `    ...[].map((learned: string) => ({`)],
    killed([
      'every-declared-alias-finds-its-own-contract-first',
      'every-phrase-an-entry-offers-is-a-phrase-the-search-reads',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
    ]),
  ),

  sameOnEveryLens(
    'S-29',
    'learns a phrase the contract was already found by, so the index - the one document every query ' +
      'fetches - grows for a word the registry had. It is the cheapest way a curated field rots: ' +
      'nothing is wrong on the page, nothing is wrong in the answer, and the catalogue is paying ' +
      'bytes to say twice what it said once',
    [catalogueFile(THE_LEARNED_TERM, `        term: 'string to number',`)],
    killed([
      'a-learned-term-is-one-the-contract-was-not-already-found-by',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
    ]),
  ),

  sameOnEveryLens(
    'S-30',
    'teaches the registry a word about the one contract that could still have declared it as an ' +
      'alias, so a phrase enters the catalogue without ever passing the review ADR-0023 does at ' +
      'publication - and passes it up on the one contract where it was still on offer. The term is ' +
      'true and finds its contract; what is wrong is the door it came through. It reddens a second ' +
      'guard as well, and that was measured rather than predicted: `groupBy` already answers ' +
      '`group by key`, so the term this cell writes is one its contract was found by anyway',
    [
      catalogueFile(
        THE_REFUSED_CONTRACT,
        `    alsoFoundBy: [
      {
        term: 'group by key',
        howItIsAsked: 'People ask for grouping by a key.',
        whyThisContract: 'This contract groups by a key.',
      },
    ],
    folder: 'contracts/typescript/array/group-by',`,
      ),
    ],
    killed([
      'a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare',
      'a-learned-term-is-one-the-contract-was-not-already-found-by',
    ]),
  ),

  sameOnEveryLens(
    'S-10',
    'stops searching the export names, so somebody typing the symbol they already know - ' +
      '`parseNumber`, the name in their editor - is told the catalogue has nothing',
    [searchFile(THE_EXPORTS_ARE_A_FIELD, `    ...[].map((held: { name: string }) => ({`)],
    killed(['a-corpus-of-real-queries-ranks-the-right-contract-first']),
  ),

  sameOnEveryLens(
    'S-11',
    'searches the bare name instead of the rendered address, so `1` in `number/parse@1` is a word ' +
      'nothing carries. **It survives, and the reason is the other rule**: `1` is set aside, and what ' +
      'remains - `number`, `parse` - names the bare name in full, so the query answers anyway. The ' +
      'rendered address changes what the result scores and not whether it is one, and nothing in this ' +
      'catalogue can order it differently. Recorded rather than deleted: the address a tool prints is ' +
      'the address it should match, and the argument for that is not the score.',
    [
      searchFile(
        THE_NAME_IS_THE_RENDERED_ADDRESS,
        `    { kind: 'name', text: rendered, words: wordsOf(entry.address.name) },`,
      ),
    ],
    survived('unreachable-on-this-catalogue'),
  ),

  sameOnEveryLens(
    'S-12',
    'stops splitting camel case, so `groupBy` is one word wherever it appears. **It survived for ' +
      'three units and it does not any more, and what changed is not this line.** The reading was ' +
      'that the split is applied to both sides - one tokeniser reads the query and the field, so ' +
      'removing it removes it from both and they go on agreeing. That was true while the tokeniser ' +
      'had one consumer. The matching now counts how many contracts declare each word, over the same ' +
      'tokenised fields, so the split decides which words tell the contracts apart as well as which ' +
      'words match - and there its effect is not symmetric, because nothing on the query side is ' +
      'being counted. **It has gone silent a second time, and this time the cause is a decision.** ' +
      '`parse yaml` was the one query of the negative corpus that made this edit detectable; at six ' +
      'contracts that query answers `number/parse@1` unmutated, so ADR-0144 took it out - the control ' +
      'is red with it in - and this pin went with it. Measured: five contracts with it, killed; five ' +
      'without it, survives; six with it, the control is red; six as committed, survives on three ' +
      'environments. Restoring detection was tried against a list of fifteen real queries frozen ' +
      'before any was run, and none of the twelve the catalogue answers nothing to changes anything ' +
      'here - so at six contracts, removing this split changes nothing the registry suite observes. ' +
      'ADR-0145.',
    [searchFile(CAMEL_CASE_IS_SPLIT, `    .replace(/([a-z0-9])([A-Z])/g, '$1$2')`)],
    survived('unreachable-on-this-catalogue'),
  ),

  sameOnEveryLens(
    'S-13',
    'counts a summary among the fields a contract chose. **It survived because naming a summary in ' +
      'full means typing every word of a sentence**, and the shortest of the five is eighty-five ' +
      'characters - so the exclusion was a statement nothing could reach. It is reachable now, and ' +
      'by the cheapest input there is: this set decides a second thing, whether anything the ' +
      'contract chose answered a word at all, and under this edit one word of one summary is enough. ' +
      '`toopo search the` becomes the whole catalogue. **The guard that catches it is the only one ' +
      'that does**, which is what a statement being kept for its own sake looks like when it stops ' +
      'being unreachable.',
    [
      searchFile(
        ONLY_A_DELIBERATE_FIELD_IS_NAMED_IN_FULL,
        `const DELIBERATE: ReadonlySet<MatchedField> = new Set<MatchedField>([\n` +
          `  'name',\n  'export',\n  'alias',\n  'summary',\n])`,
      ),
    ],
    killed(['a-word-only-a-summary-carries-answers-nothing-on-its-own']),
  ),

  sameOnEveryLens(
    'S-14',
    'strips a trailing `s` from any word at all, so `is` becomes `i` and `as` becomes `a`. **It ' +
      'survives because neither `i` nor `a` is carried by anything those two queries would then ' +
      'reach**: `a` is a word four summaries hold, so `is` would answer them - and no negative query ' +
      'here contains `is` without another word that already fails. The bound is kept for the same ' +
      'reason a bound is always kept, and what this records is that the catalogue does not currently ' +
      'contain the input that would show it.',
    [
      searchFile(
        A_SHORT_WORD_IS_NOT_SHORTENED,
        `  word.endsWith('s') ? word.slice(0, -1) : word`,
      ),
    ],
    survived('unreachable-on-this-catalogue'),
  ),

  sameOnEveryLens(
    'S-15',
    'stops reading a plural as its singular, so `arrays`, `numbers` and `dates` answer nothing - a ' +
      'search that is right about every word it was written for and wrong about how people type',
    [searchFile(A_PLURAL_IS_ONE_TRAILING_S, `  false ||`)],
    killed(['a-shortening-or-a-plural-is-answered-and-a-longer-word-is-not']),
  ),

  // -------------------------------------------------------------------------
  // The refused contract, and the line the reader is handed
  // -------------------------------------------------------------------------

  sameOnEveryLens(
    'S-16',
    'attaches whatever refusal the registry holds to every result, so four installable contracts ' +
      'come back carrying an argument against a fifth',
    [searchFile(THE_REFUSAL_IS_ATTACHED_TO_ITS_OWN_CONTRACT, `  refusal: refusals[0] ?? null,`)],
    killed(['an-installable-contract-carries-no-refusal']),
  ),

  sameOnEveryLens(
    'S-17',
    'drops the refusal from every result, so `Map.groupBy` answers a contract marked not ' +
      'installable and says nothing about why - which tells the reader the catalogue has no opinion, ' +
      'where publishing the opinion is the point',
    [searchFile(THE_REFUSAL_IS_ATTACHED_TO_ITS_OWN_CONTRACT, `  refusal: null,`)],
    killed(['a-refused-contract-is-found-with-the-reason-it-was-refused']),
  ),

  sameOnEveryLens(
    'S-18',
    'names as unknown every word of the query rather than the ones no contract carries, so a miss ' +
      'that should point at one word points at all of them',
    // Two earlier spellings of this mutant measured nothing. The first dropped the parameter and left
    // the body reading it, which threw and reddened seven guards - a mutant that breaks the module
    // says nothing about the decision it was aimed at. The second filtered on `true` first, which is
    // the same function. This one keeps every word, which is the defect.
    [
      searchFile(
        AN_UNKNOWN_WORD_IS_ONE_NO_ENTRY_ANSWERS,
        `    entries.every((entry) => bestHit(word, fieldsOf(entry)) !== undefined),`,
      ),
    ],
    killed(['a-miss-names-the-words-no-contract-carries']),
  ),

  sameOnEveryLens(
    'S-22',
    'restores the rule this command shipped with, where every word being answered was enough on its ' +
      'own - so a summary carries a result and `toopo search a` is the whole catalogue. It is the ' +
      'defect rather than a weakening of the guard: 37 results over eighteen bare function words, on ' +
      'a command whose subject is that a search which always answers something is not believed twice',
    [
      searchFile(
        SOMETHING_THE_CONTRACT_CHOSE_MUST_HAVE_ANSWERED,
        `  if (answered.length === 0) return null`,
      ),
    ],
    killed(['a-word-only-a-summary-carries-answers-nothing-on-its-own']),
  ),

  sameOnEveryLens(
    'S-23',
    'puts the bound back on the phrasing the registry chose: every word counts as one that tells ' +
      'the contracts apart, and no field may keep any of them back. It is the rule this command ' +
      'shipped with, so `turn a string into a number` answers nothing again while every other trial ' +
      'here stays green. **Two edits and not one, because either alone is compensated by the other** ' +
      '- raise the ceiling and a three-word alias may still keep one word back, which is exactly the ' +
      'word a rewording drops. That was measured rather than reasoned about: each edit on its own is ' +
      'caught, and by the corpus rather than by the guard the pair is aimed at.',
    [
      searchFile(A_WORD_TELLS_THEM_APART_BELOW_A_CEILING, `const TELLS_THE_CONTRACTS_APART = 5`),
      searchFile(
        A_FIELD_KEEPS_ONE_BACK_ONLY_WHEN_IT_HAS_THREE,
        `const A_FIELD_MAY_KEEP_ONE_BACK_FROM = 99`,
      ),
    ],
    killed([
      'a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers',
    ]),
  ),

  sameOnEveryLens(
    'S-24',
    'lets a field of any size keep a telling word back rather than one of three or more, which is ' +
      'the allowance with nothing bounding it: `javascript sort an array` and `parse yaml` are ' +
      'admitted, and the query that names its own contract in a sentence stops resolving to it',
    [
      searchFile(
        A_FIELD_KEEPS_ONE_BACK_ONLY_WHEN_IT_HAS_THREE,
        `const A_FIELD_MAY_KEEP_ONE_BACK_FROM = 1`,
      ),
    ],
    killed([
      'a-query-the-catalogue-cannot-answer-answers-nothing',
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
    ]),
  ),

  sameOnEveryLens(
    'S-26',
    'takes the price off a word set aside, which is the rule exactly as it stood before ADR-0154: ' +
      'naming a field falls back to the words that tell the contracts apart, that set shrinks as the ' +
      'catalogue grows, and a field down to one of them opens its contract to anything typed beside ' +
      'it. Eight requests a person types come back with a function that holds nothing for them - ' +
      '`parse yaml` answers a string-to-number converter, `round robin` a rounder, `add to cart` a ' +
      'date - and eleven of the ninety-one words this catalogue declares open a contract that way',
    [
      searchFile(
        A_SET_ASIDE_WORD_COSTS_A_SECOND_WORD_OF_THE_FIELD,
        `const A_SET_ASIDE_WORD_IS_PAID_FOR_WITH = 1`,
      ),
    ],
    killed([
      'a-query-the-catalogue-cannot-answer-answers-nothing',
      'a-word-the-catalogue-declares-beside-one-it-has-never-heard-answers-nothing',
    ]),
  ),

  sameOnEveryLens(
    'S-27',
    'charges a third word of the field for a word set aside, which is the same bound overshot rather ' +
      'than removed - and it is the half that says the value is pinned instead of chosen. A reader ' +
      'who leaves a word out *and* brings one in is asked for more of the label than they typed: ' +
      '`turn a string into a number` and `string into number` stop resolving to the contract they ' +
      'name, which is ADR-0136 undone, and `how do I round a number` goes silent',
    [
      searchFile(
        A_SET_ASIDE_WORD_COSTS_A_SECOND_WORD_OF_THE_FIELD,
        `const A_SET_ASIDE_WORD_IS_PAID_FOR_WITH = 3`,
      ),
    ],
    killed([
      'a-corpus-of-real-queries-ranks-the-right-contract-first',
      'a-rewording-that-introduces-no-unknown-word-answers-what-the-first-wording-answers',
    ]),
  ),

  sameOnEveryLens(
    'S-25',
    'counts the spread over every field instead of the deliberate ones, so a word is measured by how ' +
      'many contracts happen to *describe* themselves with it - which puts the whole of English into ' +
      'the count and takes the meaning out of what is left',
    [
      searchFile(
        THE_SPREAD_COUNTS_THE_DELIBERATE_FIELDS,
        `    const declared = fieldsOf(entry)`,
      ),
    ],
    killed(['a-word-only-a-summary-carries-answers-nothing-on-its-own']),
  ),
  /**
   * **The correction that softens what it quotes**, which is the defect this guard caught on its own
   * author the first time it ran: the second correction of `object/deep-equal@1` was declared with a
   * paraphrase of the frozen sentence rather than the sentence.
   *
   * A quotation nobody checks is free to soften, to shorten, or to describe a sentence that was never
   * written - and a reader meeting the frozen half and the correction side by side is entitled to
   * believe the left-hand one is what the contract says. The comparison collapses runs of whitespace,
   * so this cell changes a word rather than a line break.
   */
  sameOnEveryLens(
    'I-70',
    'softens the sentence a correction quotes, so the page shows a frozen half the contract does not ' +
      'carry beside a correction of it - the one half of this field a reader has no way to check',
    [
      catalogueFile(
        A_CORRECTION_QUOTES_WHAT_IS_FROZEN,
        `          'An implementation that memoises the pairs a failed candidate tried may answer \`true\`, ' +`,
      ),
    ],
    killed(['a-correction-names-a-case-the-contract-settles-and-quotes-what-it-says']),
  ),

  /**
   * **A correction with no coordinate**, which is ADR-0018's rule arriving on the one field of this
   * catalogue whose whole subject is that a published sentence stopped being believed.
   *
   * The neighbour above is about *what* was measured and this is about *when*: a correction naming the
   * right case and quoting the right sentence with no commit beside it is a reading nobody can retake,
   * and it is true on the morning it is written and unfalsifiable afterwards.
   */
  sameOnEveryLens(
    'I-71',
    'takes the commit out of what a correction measured, so the catalogue publishes a reading of its ' +
      'own frozen prose that nobody can take again',
    [
      catalogueFile(
        A_CORRECTION_IS_STAMPED,
        `          'Measured by injecting exactly that defect into this contract\\'s own ' +`,
      ),
    ],
    killed(['a-correction-carries-the-commit-it-was-taken-at']),
  ),

  /**
   * The hole `the-catalogue.ts` published, injected.
   *
   * `few-large-groups` is given the text its two siblings genuinely share, so the transcription names
   * an expression that occurs in `contract.ts` - twice - and is not the one this profile writes. The
   * guard that searched the file for the text was green on exactly this; the guard that asks the
   * profile is red. It is the mutant that makes the difference between the two shapes a measurement
   * rather than an argument. ADR-0171.
   */
  sameOnEveryLens(
    'I-72',
    'points a profile at a sibling\'s producing expression, which the old occurrence guard could not ' +
      'see because the sibling keeps that text alive in the contract',
    [
      catalogueFile(
        `        'few-large-groups': '[range(1_000), range(50_000)]',`,
        `        'few-large-groups': '[range(10), range(1_000), range(50_000)]',`,
      ),
    ],
    killed(['every-produced-expression-is-the-one-its-own-profile-declares']),
  ),

  /**
   * What a profile declares beyond the fields the schema names, emptied.
   *
   * `array/group-by@1` separates its two `few-large-groups` profiles by `keyFunction`, and
   * `keyFunction` reaches the record through `data`. Emptying it makes the pair indistinguishable to
   * everything downstream, which is the state `PROFILE_SEPARATION_RULE` exists to keep an unpublished
   * contract out of. ADR-0171.
   */
  sameOnEveryLens(
    'I-73',
    'drops what a profile declares beside the fields the schema names, so two profiles a contract ' +
      'separated by its own field arrive at the record as one thing',
    [
      serialiseFile(
        `  const data = Object.fromEntries(Object.entries(entry).filter(([field]) => !named.includes(field)))`,
        `  void named
  const data = {}`,
      ),
    ],
    killed(['no-two-profiles-of-an-unpublished-contract-are-indistinguishable']),
  ),

  /**
   * The registry stops carrying what a case answers, and one guard in the whole suite notices.
   *
   * A case is a call: its fields begin with the parameters and what remains is the answer. Keeping
   * only the leading `call.length` fields leaves every case still *beginning* with its call, so
   * `CaseIsNotACall` is never thrown and the contract serialises - it simply arrives at the record
   * with nothing after the arguments. A page could not render an answer, and a declared alphabet
   * would be a promise about a set the registry no longer holds.
   *
   * **Measured at the commit that added the guard: 459 of 460 registry guards pass and this one is
   * the failure**, which is the *alone* the open list records most guards here as never having been
   * seen. It is what makes this cell worth more than its own subject - the reading below is that the
   * answers a case publishes were, until this guard, carried by the schema and read by nothing that
   * could tell they had gone.
   */
  sameOnEveryLens(
    'I-74',
    'keeps only a case\'s arguments, so every answer the catalogue publishes leaves the record while ' +
      'each case still begins with the call that serialisation checks',
    [
      serialiseFile(
        `  const data = Object.fromEntries(Object.entries(entry).filter(([name]) => !shared.includes(name)))`,
        `  const data = Object.fromEntries(
    Object.entries(entry)
      .filter(([name]) => !shared.includes(name))
      .slice(0, call.length),
  )`,
      ),
    ],
    killed(['every-class-a-declared-pattern-names-is-one-the-answers-witness']),
  ),

  // -------------------------------------------------------------------------
  // One cell per guard, aimed at that guard's own failure condition - ADR-0204
  // -------------------------------------------------------------------------

  /**
   * Fourteen cells for fourteen guards of this folder that reddened and had never done so alone.
   *
   * They are not here to catch new defects: every one of them is a defect this suite already caught,
   * beside a neighbour. What they buy is that the guard named in each pin has now been seen carrying
   * a defect **by itself**, which the open list of `CLAUDE.md` records 954 guards of this repository
   * as never having done.
   *
   * **Each was audited off `failedGuards` rather than off a green run**, because a pin is checked as a
   * subset: a cell reddening more guards than its pin names does not disagree with it, so *alone* is
   * a reading of the report and never of the exit code.
   *
   * The eight of the twenty-two that resisted are in ADR-0204 with the candidates that were tried and
   * the reason each search stopped. Three shapes account for all eight, and two of the three were
   * predicted before the first of these cells was written.
   */
  sameOnEveryLens(
    'I-82',
    'asks the registry at a past commit about every binding of the ledger, so one that names no ' +
      'commit is looked up under forty zeros instead of being left alone',
    [
      rebindingFile(
        WHETHER_A_BINDING_CAN_BE_ASKED_ABOUT_IS_DECIDED_FIRST,
        '    // asked about whether or not the coordinate names a commit',
      ),
    ],
    killed(['a-binding-that-names-no-commit-is-not-asked-about']),
  ),

  /**
   * The two halves of one line, and the reason they are two cells.
   *
   * `a-commit-that-cannot-say-what-it-bound-is-refused` is one `it.each` answering to four addresses,
   * of which two redden and never alone. Its own sentence is that *every branch of cannot is a
   * separate sentence*, and the line it reads asks two questions in one condition - which runner, and
   * how many arguments. Dropping one clause leaves the other row refusing, so each row is isolated by
   * the half of the condition it is about.
   */
  sameOnEveryLens(
    'I-83',
    "accepts whatever a past commit's `ledger` script names as its runner so long as it takes one " +
      'path, so the freeze check runs a program it never read',
    [rebuildFile(WHAT_IS_RE_RUN_IS_NODE_AND_ONE_PATH, '  if (path === undefined || rest.length > 0) {')],
    killed(['a-commit-that-cannot-say-what-it-bound-is-refused-1']),
  ),

  sameOnEveryLens(
    'I-84',
    "accepts a past commit's `ledger` script whatever follows the one path, so an argument this " +
      'reader never understood decides what gets printed',
    [rebuildFile(WHAT_IS_RE_RUN_IS_NODE_AND_ONE_PATH, "  if (runner !== 'node' || path === undefined) {")],
    killed(['a-commit-that-cannot-say-what-it-bound-is-refused-2']),
  ),

  /**
   * The lifetime as a choice rather than as the header that renders it.
   *
   * I-58, I-59 and I-60 all edit `cacheControlOf`, which both literal guards and the perturbation
   * read, so each of them reddens two. What this edits is the value the content-addressed class
   * declares, and the perturbation one screen away takes the **named** policy as its base - so it
   * never sees this at all.
   */
  sameOnEveryLens(
    'I-85',
    'holds a content-addressed answer for a month rather than for a year, so the entry that can ' +
      'never be wrong is revalidated twelve times a year',
    [responseFile(A_FROZEN_ANSWER_IS_HELD_FOR_A_YEAR, '        maxAgeSeconds: A_YEAR / 12,')],
    killed(['a-content-addressed-answer-is-public-for-a-year-and-immutable']),
  ),

  /**
   * The named answer's directive weakened rather than dropped, which is what makes it this guard's.
   *
   * `proxy-revalidate` asks a *shared* cache to revalidate and exempts a private one, so the reader's
   * own browser may hand back a binding that has moved while the CDN in front of it behaves. The
   * policy record is untouched, so the guard that pins all three of its fields stays green; the
   * content-addressed header is untouched, because that class does not ask for revalidation at all.
   */
  sameOnEveryLens(
    'I-86',
    'exempts a private cache from revalidating a named answer, so a browser may hand back a binding ' +
      'that has moved while the cache in front of it revalidates correctly',
    [
      responseFile(
        A_NAMED_ANSWER_SAYS_IT_MUST_BE_REVALIDATED,
        "    ...(policy.mustRevalidate ? ['proxy-revalidate'] : []),",
      ),
    ],
    killed(['a-named-answer-is-public-and-revalidated-before-every-use']),
  ),

  /**
   * A drift the reader forgives, which is the only kind this guard can be alone on.
   *
   * The renderer and the reader are a matched pair and `a-rendered-set-of-bindings-reads-back-as-
   * itself` round-trips them, so every defect that changes what a line *means* reddens both. What is
   * left to the guard whose subject is the text is a change the reader tolerates: a trailing blank
   * line parses back to the same bindings and is not the format this repository writes once.
   */
  sameOnEveryLens(
    'I-87',
    'ends the rendered ledger on a blank line, which the reader forgives - so the format the freeze ' +
      "check compares drifts and the reader's own leniency is what hides it",
    [
      rebindingFile(
        ONE_FORMAT_WRITTEN_ONCE,
        "  [...bindings].map(([what, digest]) => `${what}\\t${digest}\\n`).join('') + '\\n'",
      ),
    ],
    killed(['a-rendered-binding-is-what-a-past-commit-prints']),
  ),

  /**
   * The dedup dropped, which the order property survives.
   *
   * `nothing-is-written-before-what-it-imports` reads the resolved order and a duplicate leaves every
   * dependent still after everything it imports, so it stays green. The converse does not hold and is
   * why that guard is one of the eight ADR-0204 could not isolate: this guard pins the resolved list
   * **exactly**, order included, so every defect the order property could catch reddens it too.
   */
  sameOnEveryLens(
    'I-88',
    'resolves a shared dependency once per dependent rather than once, so an installer writes the ' +
      'same implementation twice',
    [
      implementationFile(
        A_DEPENDENCY_ALREADY_RESOLVED_IS_NOT_RESOLVED_AGAIN,
        '      // a dependency named twice is resolved twice',
      ),
    ],
    killed(['a-shared-dependency-is-resolved-once']),
  ),

  /**
   * The cell worth reading, because **both served headers come out byte for byte what they were**.
   *
   * A named answer declares a zero lifetime and asks for revalidation, so deriving the second from
   * the first renders `public, max-age=0, must-revalidate` exactly as before; a content-addressed
   * answer asks for neither, so its header does not move either. Nothing a host receives changes.
   * What changes is that the field has stopped being read, and the only thing that says so is the
   * guard that perturbs each field of the policy and watches the string - which is what that guard
   * was written for and had never been alone on.
   */
  sameOnEveryLens(
    'I-89',
    'derives revalidation from the lifetime rather than reading it off the policy, so both served ' +
      'headers are byte for byte what they were and the field has stopped being read',
    [
      responseFile(
        A_NAMED_ANSWER_SAYS_IT_MUST_BE_REVALIDATED,
        "    ...(policy.maxAgeSeconds === 0 ? ['must-revalidate'] : []),",
      ),
    ],
    killed(['every-directive-of-the-policy-reaches-the-header-and-the-prose-does-not']),
  ),

  /**
   * ADR-0105's defect at the emission rather than at the snapshot, which is what separates the two.
   *
   * `filesNamedBy` is outside every digest, so narrowing it leaves each snapshot naming the shared
   * files and the tree serving none of them - an address a client can ask for and a 404 at the moment
   * somebody installs something. `every-file-a-published-contract-freezes-is-served` re-serialises the
   * records itself and reads `harness` alone, so it does not see this; the closure, which reads the
   * addresses back out of the served bytes, is the only guard that can.
   */
  sameOnEveryLens(
    'I-90',
    "serves the seven files a contract owns and not the ones its guards call, so every snapshot " +
      'names blob addresses the tree answers nowhere',
    [snapshotFile(A_SNAPSHOT_NAMES_WHAT_ITS_GUARDS_CALL_AS_WELL, '    ? snapshot.frozen.harness')],
    killed(['the-emitted-tree-is-closed']),
  ),

  /**
   * S-29's defect beside the term that earns its place rather than in place of it.
   *
   * That cell replaces the learned term, so the corpus loses the phrase it depends on and reddens with
   * this guard. Added as a *second* term, the catalogue still answers `string to integer` and the only
   * thing wrong is that the index - the one document every query fetches - grew for a word the
   * registry already had.
   */
  sameOnEveryLens(
    'S-31',
    'learns a second phrase the contract was already found by, keeping the one that buys something - ' +
      'so the index grows for a word the registry had and the term that earns its place hides it',
    [
      catalogueFile(
        THE_LEARNED_TERM,
        `        term: 'string to number',
        howItIsAsked: 'People ask for a string turned into a number.',
        whyThisContract: 'This contract turns a string into a number.',
      },
      {
        term: 'string to integer',`,
      ),
    ],
    killed(['a-learned-term-is-one-the-contract-was-not-already-found-by']),
  ),

  /**
   * The plural, which is the half of this guard nothing else reads.
   *
   * Sorting the words was tried first and is **inert on this catalogue** - `clone` and `zzq` are
   * already in alphabetical order, so the mutant is wrong about the code and changes no answer.
   * Naming only the first is the same claim from the other side and it moves what a reader is shown.
   */
  sameOnEveryLens(
    'S-32',
    'names the first word of a query nobody could place rather than all of them, so a reader is told ' +
      'about one of their unheard words and left to guess the rest',
    [
      searchFile(
        EVERY_WORD_NOBODY_COULD_PLACE_IS_NAMED,
        '  return { query, results, unknownWords: [...new Set(unknown)].slice(0, 1) }',
      ),
    ],
    killed(['a-miss-names-the-words-no-contract-carries']),
  ),

  /**
   * The defect `search.ts` names in its own comment, injected: *a rule that took the two clauses from
   * different fields admits `add to cart`*.
   *
   * `add` and `to` sit together in one alias of `date/add@1`, and the field the query names is
   * another - so the conjunction has to be asked of one field or the allowance is granted by two
   * halves that never met. It is the arm of this guard that the twenty-eight requests exist for, and
   * the reason its neighbour over the ninety-one declared words is one of the eight not isolated:
   * every defect of the rule opens both, and this guard has an arm outside the rule where that one
   * has none.
   */
  sameOnEveryLens(
    'S-33',
    'takes the two clauses of the set-aside allowance from different fields, so a query naming one ' +
      'field and carrying two words of another is admitted',
    [
      searchFile(
        THE_TWO_CLAUSES_ARE_ASKED_OF_ONE_FIELD,
        `  fields.some(
    (field) => DELIBERATE.has(field.kind) && namedByWhatTellsThemApart(field, asked, spread),
  ) &&
  fields.some(
    (field) =>
      DELIBERATE.has(field.kind) &&
      carriedFrom(field, asked) >= A_SET_ASIDE_WORD_IS_PAID_FOR_WITH,
  )`,
      ),
    ],
    killed(['a-query-the-catalogue-cannot-answer-answers-nothing']),
  ),

  /**
   * The one input that reaches the check, guarded away.
   *
   * A query with no words in it is the only thing that reaches the deliberate-field test - every
   * other query that fails it has already failed the rule above - so a condition excusing the empty
   * case hands a reader who typed spaces the whole catalogue, and reaches nothing else at all.
   */
  sameOnEveryLens(
    'S-34',
    'skips the deliberate-field check for a query with no words in it, so a reader who types spaces ' +
      'is handed every contract the catalogue holds',
    [
      searchFile(
        A_QUERY_NAMES_A_DELIBERATE_FIELD_OR_ANSWERS_NOTHING,
        `  if (words.length > 0 && !hits.some((hit) => hit !== null && DELIBERATE.has(hit.field.kind)))
    return null`,
      ),
    ],
    killed(['a-query-with-no-words-answers-nothing']),
  ),

  /**
   * S-30's door with the second red taken out of it.
   *
   * That cell teaches the refused contract a phrase it was already found by, so it reddens the guard
   * about the door **and** the guard about what a term buys - which its own description records as
   * measured rather than predicted. A phrase built out of words this catalogue has never heard buys
   * something, so what is left is the door: a term arriving on the one contract that could still have
   * declared it as an alias, where ADR-0023's review was on offer and was walked past.
   */
  sameOnEveryLens(
    'S-35',
    'teaches the registry a true phrase about the one contract that could still have declared it as ' +
      'an alias, so a term enters the catalogue without the review ADR-0023 does at publication',
    [
      catalogueFile(
        THE_REFUSED_CONTRACT,
        `    alsoFoundBy: [
      {
        term: 'bucket rows',
        howItIsAsked: 'People ask for rows put into buckets.',
        whyThisContract: 'This contract puts rows into buckets.',
      },
    ],
    folder: 'contracts/typescript/array/group-by',`,
      ),
    ],
    killed(['a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare']),
  ),

  // ---------------------------------------------------------------------------
  // E - the wire, which every record and every value crosses on the way to a reader
  // ---------------------------------------------------------------------------
  //
  // A third series rather than more of `I`, because these share a subject neither of the other two
  // touches: `value.ts`, the encoding that carries what JSON would lose.
  //
  // Every cell here is a **first** witness in ADR-0209's sense - the defect it injects is the failure
  // condition its guard's own sentence names, and the search stopped as soon as that held rather than
  // carrying on until nothing else reddened. Seventeen of the twenty-six redden alone anyway, which is
  // that record's finding rather than its intention: aiming narrowly at a claim tends to isolate
  // without being asked to.

  sameOnEveryLens(
    'E-01',
    'reads a negative zero back as an ordinary zero, so the sign `number/parse@1` compares its own ' +
      'answers with `Object.is` for is lost between the endpoint and the reader',
    [valueFile(A_NEGATIVE_ZERO_COMES_BACK_SIGNED, "  'negative-zero': 0,")],
    killed([aValueJsonCannotHold('negative-zero')]),
  ),

  /**
   * The two neighbours are reddened and not witnessed, which is the distinction ADR-0209 turns on.
   *
   * A NaN that comes back as a zero is a defect describable without naming a Date or a typed array,
   * so `an-invalid-instant` and `a-typed-array-holding-nan` are bystanders here - each carries a NaN
   * and each has a cell of its own aimed at what its sentence is about.
   */
  sameOnEveryLens(
    'E-02',
    'reads a NaN back as a zero, so an answer that was not a number comes back as one',
    [valueFile(A_NAN_COMES_BACK_A_NAN, '  nan: 0,')],
    killed([
      aValueJsonCannotHold('nan'),
      aValueJsonCannotHold('an-invalid-instant'),
      aValueJsonCannotHold('a-typed-array-holding-nan'),
    ]),
  ),

  sameOnEveryLens(
    'E-03',
    'reads an infinity back as the largest finite number, which is the answer a plain JSON round ' +
      'trip would have given and the one this encoding exists to refuse',
    [valueFile(AN_INFINITY_COMES_BACK_INFINITE, '  infinity: Number.MAX_VALUE,')],
    killed([aValueJsonCannotHold('infinity')]),
  ),

  sameOnEveryLens(
    'E-04',
    'reads a negative infinity back as the smallest finite number, so a bound comes back as a value',
    [valueFile(A_NEGATIVE_INFINITY_COMES_BACK_INFINITE, "  'negative-infinity': -Number.MAX_VALUE,")],
    killed([aValueJsonCannotHold('negative-infinity')]),
  ),

  /**
   * `a-nested-undefined` and `a-hole-beside-an-undefined` are bystanders: both carry an undefined and
   * neither is what a decoded `undefined` becoming `null` is about. Each has its own cell below.
   */
  sameOnEveryLens(
    'E-05',
    'reads an undefined back as a null, so a field that was not answered comes back answered with ' +
      'nothing - which is a different value and one `array/group-by@1` settles a case on',
    [
      valueFile(
        AN_UNDEFINED_COMES_BACK_UNDEFINED,
        `    case 'undefined':
      return null`,
      ),
    ],
    killed([
      aValueJsonCannotHold('undefined'),
      aValueJsonCannotHold('a-nested-undefined'),
      aValueJsonCannotHold('a-hole-beside-an-undefined'),
    ]),
  ),

  /**
   * The same value one level in, and the two are separated by which side of the field the loss is on.
   *
   * E-05 loses the value; this loses the *field*, so a record that answered a question with nothing
   * comes back not having been asked. A bare undefined still survives, which is what makes this cell
   * about the nesting rather than about the value.
   */
  sameOnEveryLens(
    'E-06',
    'drops a field whose value came back undefined, so a record that carried an unanswered field ' +
      'comes back without the field at all',
    [
      valueFile(
        A_FIELD_IS_ASSIGNED_WHATEVER_IT_HOLDS,
        `      for (const field of encoded.fields) {
        const held = decode(field.value, shared)
        if (held !== undefined) record[field.name] = held
      }`,
      ),
    ],
    killed([aValueJsonCannotHold('a-nested-undefined')]),
  ),

  sameOnEveryLens(
    'E-07',
    'rebuilds a pattern without its flags, so the expression `string/slugify@1` declares its output ' +
      'alphabet with comes back matching something else',
    [
      valueFile(
        A_PATTERN_KEEPS_ITS_FLAGS,
        `    case 'pattern':
      return new RegExp(encoded.source)`,
      ),
    ],
    killed([aValueJsonCannotHold('a-pattern')]),
  ),

  sameOnEveryLens(
    'E-08',
    'rebuilds a Set in the reverse of the order it was iterated in, so the groups `array/group-by@1` ' +
      'pins in iteration order come back as a different answer',
    [
      valueFile(
        A_SET_COMES_BACK_IN_ITS_OWN_ORDER,
        '      for (const entry of [...encoded.entries].reverse()) entries.add(decode(entry, shared))',
      ),
    ],
    killed([aValueJsonCannotHold('a-set')]),
  ),

  /**
   * `a-hole-beside-an-undefined` reddens because it carries a hole; what it is about is the *pair*
   * staying apart, which E-10 is the cell for.
   */
  sameOnEveryLens(
    'E-09',
    'assigns a hole rather than leaving it, so a sparse array comes back dense with undefined ' +
      'elements where it had none',
    [
      valueFile(
        A_HOLE_IS_LEFT_UNASSIGNED,
        "        entries[at] = entry.kind === 'hole' ? undefined : decode(entry, shared)",
      ),
    ],
    killed([
      aValueJsonCannotHold('a-hole'),
      aValueJsonCannotHold('a-hole-beside-an-undefined'),
    ]),
  ),

  /**
   * The mirror of E-09 and the reason the table carries both rows: this one keeps every hole a hole
   * and turns every undefined *element* into one, so an array of four values comes back as an array
   * of two values and two holes. `a-hole` survives it, which is what says the two rows are two claims.
   */
  sameOnEveryLens(
    'E-10',
    'encodes an undefined element as a hole, so a value somebody wrote comes back as a gap',
    [
      valueFile(
        AN_ELEMENT_THAT_IS_THERE_IS_ENCODED,
        "      value[at] === undefined ? { kind: 'hole' as const } : encodeAt(value[at], `${path}[${at}]`, walk),",
      ),
    ],
    killed([aValueJsonCannotHold('a-hole-beside-an-undefined')]),
  ),

  sameOnEveryLens(
    'E-11',
    'reads a big integer back as a number, so a value JSON refuses outright comes back as the ' +
      'nearest double and the type is gone',
    [
      valueFile(
        A_BIG_INTEGER_COMES_BACK_A_BIG_INTEGER,
        `    case 'big-integer':
      return Number(encoded.digits)`,
      ),
    ],
    killed([aValueJsonCannotHold('a-big-integer')]),
  ),

  sameOnEveryLens(
    'E-12',
    'rebuilds an instant at the whole second, so the milliseconds `date/add@1` settles cases on are ' +
      'lost on the way back',
    [
      valueFile(
        AN_INSTANT_IS_THE_MILLISECOND_IT_WAS,
        '      const instant = new Date(Math.floor((decode(encoded.epoch, shared) as number) / 1000) * 1000)',
      ),
    ],
    killed([aValueJsonCannotHold('an-instant')]),
  ),

  /**
   * The one arm of the Date encoding a valid instant cannot show, and the reason it is on the encode
   * side where every other cell of this series is on the decode side: a date whose time is NaN is a
   * *reading* of the value rather than a rendering of it, so the mistake is made where the time is
   * read. No record of this catalogue holds one, which is why it reddens alone.
   */
  sameOnEveryLens(
    'E-13',
    'writes an invalid date as the epoch, so a Date nobody could read comes back as a Date somebody ' +
      'can - and the difference between "no time" and "the start of time" is gone',
    [
      valueFile(
        THE_EPOCH_IS_THE_TIME_THE_DATE_HOLDS,
        '    const epoch = encodeAt(Number.isNaN(value.getTime()) ? 0 : value.getTime(), `${path}<epoch>`, walk)',
      ),
    ],
    killed([aValueJsonCannotHold('an-invalid-instant')]),
  ),

  /**
   * `a-map-keyed-by-an-object` is a bystander: a swap is a defect about the pair and not about what a
   * key is made of, and E-15 is the cell aimed at the key.
   */
  sameOnEveryLens(
    'E-14',
    'rebuilds a Map with each entry the other way round, so what a key answered comes back answering ' +
      'the key - and no key walk would have seen either',
    [
      valueFile(
        A_MAP_KEEPS_KEY_AND_VALUE_APART,
        '        entries.set(decode(entry.value, shared), decode(entry.key, shared))',
      ),
    ],
    killed([aValueJsonCannotHold('a-map'), aValueJsonCannotHold('a-map-keyed-by-an-object')]),
  ),

  /**
   * A Map keyed by a string survives this untouched, which is what separates the two rows: rendering
   * a key rather than encoding it is invisible until the key is something a rendering flattens.
   */
  sameOnEveryLens(
    'E-15',
    "renders a Map's key as text rather than encoding it, so every object key comes back as the same " +
      'string and two entries that were apart are one',
    [
      valueFile(
        A_MAP_KEY_IS_ENCODED_LIKE_ANY_VALUE,
        "      key: { kind: 'primitive' as const, value: String(key) },",
      ),
    ],
    killed([aValueJsonCannotHold('a-map-keyed-by-an-object')]),
  ),

  /**
   * The row this is aimed at is *an Error, whose message is on its prototype* - so the message is what
   * its sentence names, and the kind and the cause redden as bystanders with their own cells below.
   */
  sameOnEveryLens(
    'E-16',
    'rebuilds an error with no message, so what went wrong comes back empty and only the kind ' +
      'survives',
    [
      valueFile(
        THE_MESSAGE_AND_THE_CAUSE_TRAVEL_TOGETHER,
        `        undefined,
        encoded.cause === undefined ? undefined : { cause: decode(encoded.cause, shared) },`,
      ),
    ],
    killed([
      aValueJsonCannotHold('an-error'),
      aValueJsonCannotHold('an-error-of-a-kind'),
      aValueJsonCannotHold('an-error-with-a-cause'),
    ]),
  ),

  sameOnEveryLens(
    'E-17',
    'rebuilds every error as an `Error`, so the kind a contract settles a case on comes back as the ' +
      'kind every error shares',
    [valueFile(THE_ERROR_IS_REBUILT_BY_ITS_OWN_KIND, '      const failure = new ERROR_CONSTRUCTORS.Error(')],
    killed([aValueJsonCannotHold('an-error-of-a-kind')]),
  ),

  sameOnEveryLens(
    'E-18',
    'rebuilds an error without its cause, so the error that explains the error is gone and the one ' +
      'a reader is left with says less than the one that was sent',
    [valueFile(THE_CAUSE_IS_CARRIED_WHERE_THERE_IS_ONE, '        undefined,')],
    killed([aValueJsonCannotHold('an-error-with-a-cause')]),
  ),

  /**
   * `a-boxed-primitive-with-a-field` reddens for a second reason: with no box to hang it on, writing
   * the field throws. It is a bystander all the same - the defect is describable as *a box comes back
   * unboxed*, which names no field - and E-20 is the cell about what a box carries.
   */
  sameOnEveryLens(
    'E-19',
    'unwraps a box on the way back, so a value that was an object comes back a primitive and ' +
      'anything hung on it has nowhere to go',
    [valueFile(A_BOX_COMES_BACK_A_BOX, '      const box = decode(encoded.value, shared) as Record<string, unknown>')],
    killed([
      aValueJsonCannotHold('a-boxed-number'),
      aValueJsonCannotHold('a-boxed-primitive-with-a-field'),
    ]),
  ),

  /**
   * The keys a box carries *because of* its slot are read off a fresh box of the same primitive, and
   * this reads them off the value instead - so anything the author hung on the box is taken for
   * intrinsic and dropped. A box with nothing of its own survives it, which is what separates the two
   * rows. It is the defect `value.ts`'s own comment argues the fresh box against, made concrete.
   */
  sameOnEveryLens(
    'E-20',
    'takes the fields a box carries of its own for the ones its slot carries, so a property somebody ' +
      'wrote is dropped as though the language had put it there',
    [valueFile(WHAT_A_BOX_CARRIES_OF_ITS_OWN_IS_ITS_OWN, '      ...carrying(value, new Set(Object.keys(value))),')],
    killed([aValueJsonCannotHold('a-boxed-primitive-with-a-field')]),
  ),

  sameOnEveryLens(
    'E-21',
    'rebuilds every typed array as a `Float64Array`, so the kind that is part of the value comes back ' +
      'as one kind for all of them',
    [valueFile(A_TYPED_ARRAY_IS_REBUILT_BY_ITS_OWN_KIND, '      const make = TYPED_ARRAY_CONSTRUCTORS.Float64Array as {')],
    killed([aValueJsonCannotHold('a-typed-array')]),
  ),

  /**
   * The first candidate for this row wrote every element as a plain JSON number and reddened **40
   * guards**: typed arrays are in the catalogue, so the encoded bytes moved and the freeze, the served
   * bytes and every content-addressed answer went with them. Narrowed to the one element no plain JSON
   * number can hold, it reddens alone - which is the whole of ADR-0209's decode-side rule arriving on
   * a cell that has to stay on the encode side. A NaN in a typed array is in no record here.
   */
  sameOnEveryLens(
    'E-22',
    'writes a NaN element of a typed array as a zero, so a float array that held no number comes ' +
      'back holding one',
    [
      valueFile(
        A_TYPED_ARRAY_ELEMENT_IS_ENCODED_LIKE_ANY_VALUE,
        '    const elements = [...(value as unknown as Iterable<unknown>)].map((entry, at) =>\n' +
          '      encodeAt(Number.isNaN(entry as number) ? 0 : entry, `${path}[${at}]`, walk),\n' +
          '    )',
      ),
    ],
    killed([aValueJsonCannotHold('a-typed-array-holding-nan')]),
  ),

  /**
   * **`two-distinct-objects-stay-two` is reddened here and is witnessed by nothing.** Two empty
   * records both come back as `null`, so the guard is false on this cell - and the defect is *a record
   * with no fields comes back as nothing*, which names no pair. It is the one guard of this file that
   * leaves `unprobedClaims` without a cell aimed at it, and ADR-0209 says so rather than counting it.
   */
  sameOnEveryLens(
    'E-23',
    'reads a record with no fields back as nothing at all, so an object somebody sent comes back ' +
      'absent - which is the confusion between an empty answer and no answer',
    [
      valueFile(
        A_RECORD_WITH_NO_FIELDS_IS_STILL_A_RECORD,
        "      const record = (encoded.fields.length === 0 ? null : Object.create(encoded.prototype === 'none' ? null : Object.prototype)) as Record<string, unknown>",
      ),
    ],
    killed([aValueJsonCannotHold('an-empty-record'), 'two-distinct-objects-stay-two']),
  ),

  /**
   * Reordering was tried first and is **inert on this row**: integer-like keys are reported in
   * ascending numeric order by the engine whatever order they are assigned in, so a decoded record
   * comes back with the same key order however it was built. What is left is not to encode the field
   * at all, which is the mistake of reading a numeric key as an array index.
   */
  sameOnEveryLens(
    'E-24',
    'takes a field whose name looks like a number for an index rather than a name, so a record keyed ' +
      "the way JSON keys one comes back without those fields",
    [
      valueFile(
        A_FIELD_IS_A_FIELD_WHATEVER_ITS_NAME_LOOKS_LIKE,
        "          typeof entry[0] === 'string' && Number.isNaN(Number(entry[0])) && !beside.has(entry[0]),",
      ),
    ],
    killed([aValueJsonCannotHold('a-numeric-looking-key')]),
  ),

  /**
   * One cell for seven guards, and it is the family exception ADR-0209 writes into its definition
   * rather than a licence taken afterwards: `a-record-survives-the-wire-%s` is one written guard over
   * seven contracts, the defect is the failure condition each of the seven names, and no contract is
   * privileged by it.
   *
   * **Why the field order and not something a record contains.** Every value kind the table beside it
   * carries is either absent from the catalogue or aimed at by a cell of its own; what every record
   * has and no row of the table has is more than one field. So this is the one defect that reddens the
   * seven and leaves the twenty-five alone - measured, the twenty-five stay green.
   *
   * `survives-the-wire` of `the-sixth-contract.test.ts` reddens with them, being the same claim about
   * a record the catalogue does not yet hold, and `a-shared-reference-is-still-shared` reddens because
   * a reordered record is a record whose sharing the comparison meets in a different order. Nine reds
   * puts this cell above ADR-0076's line, so the pin names the seven it was written to exercise.
   */
  sameOnEveryLens(
    'E-25',
    'rebuilds a record with its fields in the reverse order, so every serialised contract comes back ' +
      'a different value - the fields a reader is handed are the ones that were sent and not in the ' +
      'order they were sent in',
    [
      valueFile(
        A_FIELD_IS_ASSIGNED_WHATEVER_IT_HOLDS,
        '      for (const field of [...encoded.fields].reverse()) record[field.name] = decode(field.value, shared)',
      ),
    ],
    killed(onEach('a-record-survives-the-wire')),
  ),

  /**
   * Two records redden with it because two of the seven carry a shared reference; they are bystanders,
   * the defect being about the label and not about a contract.
   */
  sameOnEveryLens(
    'E-26',
    'mints a new label every time a shared value is met rather than reusing the one it was given, so ' +
      'the second occurrence points at a label the reader has never been told about and the whole ' +
      'answer fails to arrive',
    [valueFile(A_LABEL_ONCE_GIVEN_IS_THE_LABEL_REUSED, '')],
    killed([
      'a-record-survives-the-wire-date-add',
      'a-record-survives-the-wire-string-slugify',
      'a-shared-reference-is-still-shared',
    ]),
  ),

  // ---------------------------------------------------------------------------
  // I-91 to I-109 - the declared surface, which is what a reader is promised
  // ---------------------------------------------------------------------------
  //
  // ADR-0210's slice, and every cell is a **first** witness in ADR-0209's sense: the defect it injects
  // is the failure condition its guard's own sentence names, and the search stopped as soon as that
  // held. What the rule inverts is which guards are taken - not a row of any table, in a file no cell
  // of this battery reaches - so that the fraction ADR-0209 refused to extrapolate gets a second
  // reading with the opposite bias.
  //
  // **They stay in `I` rather than opening a fourth series, and that is a decision.** ADR-0209 opened
  // `E` because its cells shared a subject neither of the other two touched, `value.ts`. That test
  // fails here: `I` already injects into `endpoints.ts` and into `response.ts`. A series born on a
  // weaker test than the one that created the last one is a convention drifting, so these are
  // I-91 onwards.

  sameOnEveryLens(
    'I-91',
    'accepts an attestation for any subject the length of a digest, so a bundle about one snapshot ' +
      'is stapled to another - which is the cheapest way there is to make an unsigned thing look ' +
      'signed, and the one thing this registry can check about a signature without verifying it',
    [attestationFile(AN_ATTESTATION_IS_ABOUT_ONE_SNAPSHOT, '    ...(attestation.subject.length === digest.length')],
    killed(['an-attestation-about-another-snapshot-is-refused']),
  ),

  sameOnEveryLens(
    'I-92',
    "asks whether the bundle carries anything in its digest field rather than whether what it " +
      'carries is a digest, so an attestation whose bundle is addressed like nothing at all is ' +
      'accepted and the blob behind it can never be fetched',
    [attestationFile(A_BUNDLE_IS_ADDRESSED_LIKE_A_BLOB, '    ...(attestation.bundle.sha256.length > 0')],
    killed(['a-bundle-that-is-not-addressed-like-a-blob-is-refused']),
  ),

  /**
   * The methodology answer reddens with it and is a bystander: the defect is about the limit no longer
   * naming its third claim, and that guard is about which columns the answer carries.
   */
  sameOnEveryLens(
    'I-93',
    'publishes the limit of a signature with the third of its three claims removed, so a reader is ' +
      'told a signature does not say who published or that an implementation answers the contract, ' +
      'and is left believing it says the contract is the right specification',
    [attestationFile(THE_THIRD_CLAIM_IS_PUBLISHED_BESIDE_THE_OTHER_TWO, "  'verification says an implementation answers the contract'")],
    killed([
      'the-limit-of-a-signature-is-published',
      'the-methodology-answer-carries-both-columns-and-the-seeding-policy',
    ]),
  ),

  sameOnEveryLens(
    'I-94',
    'has an endpoint claim to answer a need nobody declared, which is what an endpoint copied from a ' +
      'list rather than derived from a need looks like from the outside',
    [endpointsFile(THE_METHODOLOGY_ENDPOINT_ANSWERS_ITS_OWN_NEED, "    answers: ['render-the-methodology-page', 'render-the-changelog-page'],")],
    killed(['every-endpoint-answers-a-need-somebody-has']),
  ),

  sameOnEveryLens(
    'I-95',
    'stops answering one of the two needs only the refusals endpoint answers, so a consumer has ' +
      'something to do and nothing tells it how - which is the half that would have shipped an API ' +
      'unable to install anything',
    [endpointsFile(THE_REFUSALS_ENDPOINT_ANSWERS_BOTH_ITS_NEEDS, "    answers: ['render-what-the-catalogue-refuses-and-why'],")],
    killed(['every-need-is-answered-exactly-once']),
  ),

  /**
   * `the-needs-answered-without-the-api` reddens with it and is a bystander: it pins which needs are
   * answered elsewhere, by identifier, and the defect moves an identifier rather than moving a need
   * off the API. I-97 is the cell aimed at that guard.
   */
  sameOnEveryLens(
    'I-96',
    'identifies a need by a camel-cased name, so the one rule that makes a need and an endpoint ' +
      'citable - frozen, kebab-case, unique - stops holding on the side nobody looks at',
    [needsFile(A_NEED_IS_IDENTIFIED_BY_AN_ADDRESS, "    id: 'showTheInstallCommand',")],
    killed(['every-identifier-is-an-address', 'the-needs-answered-without-the-api']),
  ),

  /**
   * A family of two rather than a bystander, and the guards say so themselves: a need answered both
   * ways is what `every-need-is-answered-exactly-once` names in its own failure message, and a fifth
   * need appearing in the list is what `the-needs-answered-without-the-api` was written to catch.
   */
  sameOnEveryLens(
    'I-97',
    'declares that something other than the API answers a need an endpoint already answers, so a ' +
      'capability moves off the API with nobody having said so - which is the silent change the ' +
      'pinned list of four exists to make loud',
    [
      needsFile(
        A_DIGEST_IS_RECOMPUTED_FROM_WHAT_THE_API_SERVES,
        `    id: 'recompute-a-digest-offline',
    consumer: 'an-auditor',
    answeredWithoutTheApi: 'the reader hashes the bytes themselves.',`,
      ),
    ],
    killed(['every-need-is-answered-exactly-once', 'the-needs-answered-without-the-api']),
  ),

  sameOnEveryLens(
    'I-98',
    'has an entry of the indicative list become an endpoint this registry does not serve, so the ' +
      'confrontation of section 6.2 with what was built resolves against nothing',
    [endpointsFile(THE_LIST_ENTRY_BECAME_AN_ENDPOINT_THAT_EXISTS, "    became: ['implementations'],")],
    killed(['every-entry-became-an-endpoint-that-exists']),
  ),

  sameOnEveryLens(
    'I-99',
    'drops one endpoint from the declared list of those no entry anticipated, so the derived half ' +
      'and the declared half stop being two statements - and a list that grew in silence would read ' +
      'as a list somebody checked',
    [
      endpointsFile(
        THE_ENDPOINTS_NO_ENTRY_ANTICIPATED_ARE_THREE,
        `  'methodology',
  'refusals',
]`,
      ),
    ],
    killed(['the-endpoints-no-entry-anticipated']),
  ),

  sameOnEveryLens(
    'I-100',
    'has an entry the list held also become a content-addressed endpoint, so a reader who fetched ' +
      'everything section 6.2 promised and checked everything checkable would have checked something',
    [endpointsFile(WHAT_THE_FIRST_ENTRY_BECAME_IS_ADDRESSED_BY_NAME, "    became: ['contract-index', 'snapshot'],")],
    killed(['nothing-that-held-is-content-addressed']),
  ),

  sameOnEveryLens(
    'I-101',
    'refuses a second entry of the indicative list, so the one refusal that was argued for becomes ' +
      'two and the second arrives with nobody having had to say it out loud',
    [
      endpointsFile(
        ONE_ENTRY_OF_THE_LIST_IS_REFUSED,
        `    entry: 'GET /contracts/{...}/implementations - la liste, avec benchs et metadonnees.',
    verdict: 'refused',`,
      ),
    ],
    killed(['a-refused-entry-is-answered-by-endpoints-that-exist-for-other-reasons']),
  ),

  sameOnEveryLens(
    'I-102',
    'leaves an entry of the indicative list carrying a verdict and no reason, which is a preference ' +
      'wearing the shape of a decision',
    [endpointsFile(THAT_ENTRY_SAYS_WHY, "    reason: '',")],
    killed(['every-entry-says-why']),
  ),

  /**
   * A family of two: the policy and the header it is rendered into are one claim about revalidation,
   * and `a-content-addressed-answer-is-public-for-a-year-and-immutable` names it on the wire where
   * its neighbour names it in the policy.
   */
  sameOnEveryLens(
    'I-103',
    'revalidates a content-addressed answer, so the one class of answer that can never be wrong - ' +
      'the address being the digest of the bytes - pays a round trip on every use',
    [responseFile(A_CONTENT_ADDRESSED_ANSWER_IS_NEVER_REVALIDATED, '        mustRevalidate: true,')],
    killed([
      'a-content-addressed-answer-is-cached-for-ever',
      'a-content-addressed-answer-is-public-for-a-year-and-immutable',
    ]),
  ),

  /** The same family on the other arm of the policy, and the same reason for its second red. */
  sameOnEveryLens(
    'I-104',
    'keeps a named answer fresh for a minute, so a CDN is free to serve a binding that has moved - ' +
      'which is the failure the separation between the frozen half and the current opinion exists to ' +
      'make impossible',
    [responseFile(A_NAMED_ANSWER_IS_FRESH_FOR_NOTHING, '        maxAgeSeconds: 60,')],
    killed([
      'a-named-answer-is-always-revalidated',
      'a-named-answer-is-public-and-revalidated-before-every-use',
    ]),
  ),

  /**
   * The revision guard reddens with it and is a bystander: it requires a named answer to say which
   * commit served it, and a snapshot answer carries no such field because it was never named.
   */
  sameOnEveryLens(
    'I-105',
    'addresses the snapshot endpoint by name, so the heavier of the two answers that carry the bulk ' +
      'is revalidated on every request - the traffic bill this guard exists to state in advance ' +
      'rather than discover',
    [
      endpointsFile(
        THE_SNAPSHOT_ENDPOINT_IS_ADDRESSED_BY_ITS_CONTENT,
        `    id: 'snapshot',
    about: 'the content that addresses it',
    addressing: 'named',`,
      ),
    ],
    killed([
      'the-endpoints-that-carry-the-bulk-are-the-cacheable-ones',
      'every-named-answer-names-the-revision-it-was-served-from',
    ]),
  ),

  /**
   * A family of eight, and the first instance this repository has of the private half of the frontier
   * being exercised at all. The seven per-contract guards and the one over the five together are one
   * written claim - a field the map marks private is on no public answer - and the defect is the
   * failure condition each of the eight names.
   *
   * It is also what the region's own declaration said could not happen: *the private-field guards
   * cannot redden until a private field exists*. That is true of the catalogue and not of the folder,
   * because the map is a source of it.
   */
  sameOnEveryLens(
    'I-106',
    'declares the sample values of a benchmark private while the public projection goes on serving ' +
      'them, so the frontier section 8 draws around a run is crossed by every contract answer at ' +
      'once',
    [
      fieldMapFile(
        THE_SAMPLE_VALUES_ARE_PUBLIC,
        "  'benchmarks.profiles[].samples.values[]': { visibility: 'private', verification: 'executable' },",
      ),
    ],
    killed([...onEach('no-private-field-reaches-a-snapshot-answer'), 'no-private-field-is-served']),
  ),

  sameOnEveryLens(
    'I-107',
    'leaves a field none of the seven fills carrying a blank justification, so a speculative field ' +
      'survives the rule this schema was built under - and it survives it while still looking ' +
      'accounted for',
    [fieldMapFile(A_FIELD_NOBODY_FILLS_SAYS_WHY, "    unfilledBecause: '',")],
    killed(['every-unfilled-field-is-justified']),
  ),

  /**
   * A family of two, and each guard names its own clause: one that every unfilled field is justified,
   * the other that the justified ones are exactly the two that were argued for. I-107 separates them
   * from the other side, by blanking the sentence rather than removing it.
   */
  sameOnEveryLens(
    'I-108',
    'takes the justification off one of the two fields that were argued for, so the set of ' +
      'exceptions this schema carries changes with nobody having argued for the change',
    [fieldMapFile(THAT_FIELD_IS_ONE_OF_THE_TWO_ARGUED_FOR, "    verification: 'documentary',")],
    killed(['every-unfilled-field-is-justified', 'the-unfilled-fields-are-the-ones-that-were-argued-for']),
  ),

  sameOnEveryLens(
    'I-109',
    "defers a contract's major to the declaration that carries it, so a second field claims a " +
      'stratum that exists for one - and the deferral starts being a fifth stratum in disguise',
    [fieldMapFile(A_MAJOR_IS_STRUCTURAL_RATHER_THAN_DEFERRED, "  'address.major': { visibility: 'public', verification: 'stated-per-declaration' },")],
    killed(['the-fields-that-defer-their-stratum']),
  ),

  // ---------------------------------------------------------------------------
  // I-110 to I-161 - the guards no table wrote, in files this battery already reaches
  // ---------------------------------------------------------------------------
  //
  // ADR-0211's slice, and every cell is a **first** witness in ADR-0209's sense, under the definition
  // committed at `68e466a` and unchanged. What the rule inverts is the clause the two slices before
  // it both held: these guards sit in files some cell of this battery already reddens, which is the
  // population those records excluded by construction and could say nothing about.
  //
  // **The trap peculiar to this slice is that the injection site is already there.** Every file it
  // touches has cells aimed into it, from two into `verifiability.test.ts` to forty-two into
  // `response.test.ts`, so the cheapest way to redden a silent guard is to widen a neighbouring cell
  // until it catches one more. A widened cell has stopped aiming. Every cell below is its own cell,
  // aimed at one guard, and the co-reds are published per cell rather than summarised.

  // `canonical.ts` - what a digest is taken over, and what JSON would lose on the way in.

  sameOnEveryLens(
    'I-110',
    'sorts the entries of an array on the way into the canonical form, so a value whose order is ' +
      'part of what it says arrives as a set - and two records that differ only in an order share a ' +
      'digest',
    [canonicalFile(AN_ARRAY_IS_RENDERED_IN_ORDER, "    return `[${[...entries].sort().join(',')}]`")],
    killed(['an-array-keeps-its-order', 'an-encoded-field-list-is-not-reordered']),
  ),

  /**
   * Ten values JSON answers something else for, one cell each, because each is a different loss and a
   * digest taken over any of them is a digest of a value the registry does not hold. Every replacement
   * below is JSON's own answer rather than a removal: deleting a refusal reaches the next one and the
   * guard stays green on a throw it was not written for, which is A1 failing while looking like a kill.
   */
  sameOnEveryLens(
    'I-111',
    'accepts a negative zero and writes it as a zero, which is what JSON does - so a case settled on ' +
      'the difference between the two is hashed as though it had been settled on neither',
    [
      canonicalFile(
        "  if (Object.is(value, -0)) throw new UncanonicalValue(path, 'a negative zero')",
        "  if (Object.is(value, -0)) return '0'",
      ),
    ],
    killed(['a-value-json-would-lose-is-refused-negative-zero']),
  ),

  sameOnEveryLens(
    'I-112',
    'writes a NaN as a null, so a record carrying one hashes to the record that carried nothing there',
    [
      canonicalFile(
        "  if (Number.isNaN(value)) throw new UncanonicalValue(path, 'a NaN')",
        "  if (Number.isNaN(value)) return 'null'",
      ),
    ],
    killed(['a-value-json-would-lose-is-refused-nan']),
  ),

  sameOnEveryLens(
    'I-113',
    'writes either infinity as a null, so the two ends of the number line and the absence of a number ' +
      'all reach a digest as one value',
    [
      canonicalFile(
        "  if (!Number.isFinite(value)) throw new UncanonicalValue(path, 'an infinity')",
        "  if (!Number.isFinite(value)) return 'null'",
      ),
    ],
    killed([
      'a-value-json-would-lose-is-refused-infinity',
      'a-value-json-would-lose-is-refused-negative-infinity',
    ]),
  ),

  sameOnEveryLens(
    'I-114',
    'writes an undefined as a null, so a value nobody set and a value somebody set to nothing become ' +
      'the same bytes',
    [
      canonicalFile(
        "  if (typeof value === 'undefined') throw new UncanonicalValue(path, 'an undefined')",
        "  if (typeof value === 'undefined') return 'null'",
      ),
    ],
    killed([
      'a-value-json-would-lose-is-refused-undefined',
      'a-value-json-would-lose-is-refused-an-undefined-field',
    ]),
  ),

  sameOnEveryLens(
    'I-115',
    'accepts a function and writes it as a null, so a record carrying code hashes as a record carrying ' +
      'nothing - and what the digest attests is no longer what the record holds',
    [
      canonicalFile(
        "  if (typeof value === 'function') throw new UncanonicalValue(path, 'a function')",
        "  if (typeof value === 'function') return 'null'",
      ),
    ],
    killed(['a-value-json-would-lose-is-refused-a-function']),
  ),

  sameOnEveryLens(
    'I-116',
    'accepts a symbol and writes it as a null, so the one value in the language that is equal to ' +
      'nothing but itself reaches a digest as the absence of a value',
    [
      canonicalFile(
        "  if (typeof value === 'symbol') throw new UncanonicalValue(path, 'a symbol')",
        "  if (typeof value === 'symbol') return 'null'",
      ),
    ],
    killed(['a-value-json-would-lose-is-refused-a-symbol']),
  ),

  sameOnEveryLens(
    'I-117',
    'accepts a bigint and writes it as a null, so an integer too large for a number is hashed as no ' +
      'integer at all rather than refused',
    [
      canonicalFile(
        "  if (typeof value === 'bigint') throw new UncanonicalValue(path, 'a bigint')",
        "  if (typeof value === 'bigint') return 'null'",
      ),
    ],
    killed(['a-value-json-would-lose-is-refused-a-bigint']),
  ),

  sameOnEveryLens(
    'I-118',
    'fills a hole in an array with a null, which is what JSON does - so an array with a gap in it and ' +
      'an array holding nothing at that index reach a digest as one value',
    [
      canonicalFile(
        "      if (!(at in value)) throw new UncanonicalValue(`${path}[${at}]`, 'a hole in an array')",
        "      if (!(at in value)) return 'null'",
      ),
    ],
    killed(['a-value-json-would-lose-is-refused-a-hole']),
  ),

  sameOnEveryLens(
    'I-119',
    'drops a field whose value is undefined, which is what JSON does - so a record that declares a ' +
      'field and a record that never had it hash to the same bytes',
    [canonicalFile(A_RECORD_IS_WRITTEN_KEY_BY_KEY, THE_UNDEFINED_FIELDS_ARE_SKIPPED)],
    killed(['a-value-json-would-lose-is-refused-an-undefined-field']),
  ),

  sameOnEveryLens(
    'I-120',
    'serves a source with its carriage returns still in it, so what the registry publishes is what ' +
      "one machine's git configuration produced rather than what the commit holds",
    [
      canonicalFile(
        "  return Buffer.from(withoutMark.replace(/\\r\\n/g, '\\n'), 'utf8')",
        "  return Buffer.from(withoutMark, 'utf8')",
      ),
    ],
    killed([
      'a-crlf-source-is-served-as-its-lf-form',
      'normalising-changes-the-digest',
      'a-blob-answer-that-arrived-with-crlf-still-verifies',
    ]),
  ),

  sameOnEveryLens(
    'I-121',
    'keeps a byte-order mark in the served bytes, so an editor that wrote one changes what a contract ' +
      'is - and the first character of a file becomes part of what a lockfile attests',
    [
      canonicalFile(
        '  const withoutMark = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text',
        '  const withoutMark = text',
      ),
    ],
    killed(['a-byte-order-mark-is-not-content']),
  ),

  /**
   * The rule beside the one above rather than the rule itself. I-120 stops the normalisation and
   * reddens this guard as a bystander; this one leaves the normalisation alone and takes the digest
   * over the normalised form, so normalising stops changing the digest while every served byte stays
   * what it was. That is this guard's own sentence - *so the rule is load-bearing rather than
   * cosmetic* - and the difference between the two cells is what says so.
   */
  sameOnEveryLens(
    'I-122',
    'hashes the normalised form of whatever bytes it is handed, so the normalisation stops being ' +
      'observable and a rule nothing can see the effect of is one nobody would notice losing',
    [
      canonicalFile(
        "  createHash('sha256').update(bytes).digest('hex')",
        "  createHash('sha256').update(servedBytes(bytes)).digest('hex')",
      ),
    ],
    killed(['normalising-changes-the-digest']),
  ),

  /**
   * `signature.ts` - reading a declared type without a compiler.
   *
   * **The region these six replace declared that no mutant here could name one guard**, because every
   * one stops a real contract serialising and reddens most of the folder. Two of the six refute that
   * flatly - `I-123` and `I-124` redden one and ten - and the other three confirm it exactly, at
   * sixty-six and sixty-seven. What changed is not the measurement but what is asked of a cell: a
   * first witness aims and does not isolate, so a cell whose distinctive red is the guard it names
   * witnesses it however many consequences follow. The co-red counts are published per cell so a
   * reader can weigh that for themselves.
   */
  sameOnEveryLens(
    'I-123',
    'lets an arrow close a type parameter list, so `<T extends () => void>` ends at the wrong ' +
      'character and a signature the catalogue could one day carry is refused as unreadable',
    [signatureFile(THE_ARROW_DOES_NOT_CLOSE_A_TYPE_PARAMETER, '')],
    killed(['an-arrow-inside-a-type-parameter-does-not-close-it']),
  ),

  sameOnEveryLens(
    'I-124',
    'separates parameters on a semicolon rather than on a comma, so the plainest signature there is ' +
      'names one parameter where it declares two - and a contract page renders a call with an ' +
      "argument list that is half a type",
    [signatureFile(A_COMMA_AT_DEPTH_ZERO_SEPARATES, THE_SEPARATOR_IS_A_SEMICOLON)],
    killed(['a-plain-signature-names-its-parameters']),
  ),

  sameOnEveryLens(
    'I-125',
    'keeps the empty part a comma leaves behind, so a signature that takes nothing declares one ' +
      'nameless parameter and a trailing comma declares a second - which is the same clause read ' +
      'from its two ends',
    [signatureFile(AN_EMPTY_PART_IS_NOT_A_PARAMETER, '')],
    killed([
      'a-signature-that-takes-nothing-has-no-parameters',
      'a-trailing-comma-leaves-no-parameter-behind-it',
    ]),
  ),

  sameOnEveryLens(
    'I-126',
    'stops skipping a type parameter list, so reading begins at the angle bracket and a generic ' +
      "signature's own `<T, K>` is looked at as though it were the call",
    [signatureFile('      if (depth === 0) return at + 1', '      if (depth === 0) return 0')],
    killed(['the-type-parameters-are-not-the-parameters']),
  ),

  sameOnEveryLens(
    'I-127',
    'splits on a comma inside a bracket, so the inner parameters of a function-typed parameter are ' +
      "read as the outer call's - which is the one shape `array/group-by@1` really writes",
    [signatureFile(A_COMMA_AT_DEPTH_ZERO_SEPARATES, A_COMMA_ANYWHERE_SEPARATES)],
    killed(['the-parameters-of-a-parameter-are-not-parameters']),
  ),

  /**
   * The family of seven, and it is one the rule that chose this slice could not see. ADR-0209's test
   * for a parameterised guard asks whether an address *ends* in a contract slug, and these seven put
   * the slug in the middle - so a table of seven read as seven standalone guards. It is the bias
   * ADR-0211 named in advance, measured: seven of the seventy, one family, all in one file.
   */
  sameOnEveryLens(
    'I-128',
    "drops the last parameter of every export's declared type, so the call a contract page renders " +
      'is one argument short of the call the signature declares - and the answer of a two-argument ' +
      'function is rendered as though it took one',
    [serialiseFile(AN_EXPORT_CARRIES_ITS_OWN_PARAMETERS, THE_LAST_PARAMETER_IS_DROPPED)],
    killed(perContract((slug) => `the-call-of-${slug}-is-read-from-its-own-signature`)),
  ),

  // `implementation-record.ts` - the dependency walk `toopo add` resolves an install with.

  sameOnEveryLens(
    'I-129',
    'stops counting the root\'s own edge in a depth, so a graph two deep reads as one - and a client ' +
      'sizing an install from the depth is told a number that is short by exactly the root',
    [
      implementationFile(
        '  return root.dependsOn.length === 0 ? 0 : 1 + Math.max(...root.dependsOn.map(depthBelow))',
        '  return root.dependsOn.length === 0 ? 0 : Math.max(...root.dependsOn.map(depthBelow))',
      ),
    ],
    killed(['the-depth-is-derived-from-the-edges']),
  ),

  sameOnEveryLens(
    'I-130',
    'refuses an unresolvable dependency without naming it, so a reader is told an install cannot be ' +
      'resolved and has to find out for themselves which of the edges was missing',
    [implementationFile(THE_REFUSAL_NAMES_THE_EDGE, THE_REFUSAL_NAMES_NOTHING)],
    killed(['an-edge-the-registry-does-not-hold-is-refused']),
  ),

  sameOnEveryLens(
    'I-131',
    'accepts an unpublished artefact as the target of an edge, so a walk resolves to a snapshot that ' +
      'was never served under any address and an install writes bytes no lockfile can name',
    [implementationFile(AN_UNPUBLISHED_HOLDING_IS_REFUSED, AN_UNPUBLISHED_HOLDING_IS_ACCEPTED)],
    killed(['an-unpublished-implementation-cannot-be-depended-on']),
  ),

  sameOnEveryLens(
    'I-132',
    'skips an edge that closes a cycle rather than refusing it, so a corrupt ledger resolves to a ' +
      'plausible set and an installer writes a project whose imports do not terminate',
    [implementationFile(A_CYCLE_IS_REFUSED, A_CYCLE_IS_SKIPPED)],
    killed(['a-cycle-is-refused-rather-than-deduplicated-away']),
  ),

  // `field-map.ts` - what the schema classifies, and what the projection serves.

  sameOnEveryLens(
    'I-133',
    'misspells the path a case\'s report is classified at, so a contract reaching that field arrives ' +
      'carrying a path the schema has never heard of - and a sixth contract is refused for a reason ' +
      'that is a typo',
    [fieldMapFile(A_REPORTED_CASE_IS_CLASSIFIED, A_REPORTED_CASE_IS_MISSPELLED)],
    killed([
      'needs-no-field-the-schema-does-not-have',
      'the-absorbed-state-is-constructible',
      'the-unfilled-fields-are-the-ones-that-were-argued-for',
    ]),
  ),

  sameOnEveryLens(
    'I-134',
    'serves a lifecycle as its state and nothing else, so a contract the language has absorbed can ' +
      'say that it was absorbed and not what absorbed it - which is the whole of what that state is ' +
      'for',
    [fieldMapFile(A_LIFECYCLE_IS_SERVED_WHOLE, A_LIFECYCLE_IS_SERVED_AS_ITS_STATE)],
    killed(['the-absorbed-state-is-constructible', 'every-unfilled-field-is-justified']),
  ),

  // `response.ts` - what a reader can check about an answer without taking our word for it.

  sameOnEveryLens(
    'I-135',
    'stops comparing a snapshot body with the digest it is addressed by, so an answer altered in ' +
      'transit passes the one check that exists to catch exactly that',
    [responseFile(A_SNAPSHOT_BODY_IS_COMPARED_WITH_ITS_ADDRESS, NOTHING_IS_COMPARED)],
    killed(['a-snapshot-answer-that-was-altered-is-refused']),
  ),

  sameOnEveryLens(
    'I-136',
    'accepts a snapshot written under another format version, so a digest computed by this reader is ' +
      'compared against one computed under rules it does not have - and agreement would mean nothing',
    [responseFile(A_FORMAT_VERSION_IS_CHECKED, A_FORMAT_VERSION_IS_NOT_CHECKED)],
    killed(['a-snapshot-answer-under-another-format-version-means-nothing-here']),
  ),

  sameOnEveryLens(
    'I-137',
    'stops comparing served bytes with the digest they are addressed by, so a file changed by one ' +
      'byte on the way to a reader arrives as the file they asked for',
    [responseFile(A_BLOB_IS_COMPARED_WITH_ITS_ADDRESS, NOTHING_IS_COMPARED)],
    killed(['a-blob-answer-with-one-byte-changed-is-refused']),
  ),

  sameOnEveryLens(
    'I-138',
    'publishes the decision in the slot the measurement belongs in, so the refusals page says what ' +
      'was decided where it promised what was measured - and the one page whose whole subject is a ' +
      'contract\'s own admission stops carrying it',
    [responseFile(A_REFUSAL_CARRIES_ITS_OWN_MEASUREMENT, A_REFUSAL_CARRIES_ITS_DECISION_TWICE)],
    killed([
      'the-refusals-page-has-a-source',
      'a-refused-contract-is-found-with-the-reason-it-was-refused',
    ]),
  ),

  sameOnEveryLens(
    'I-139',
    'compares two digests without asking whether they are digests of the same address, so installing ' +
      'a different implementation of a feature reads as that feature having moved',
    [
      responseFile(
        AN_UPDATE_COMPARES_THE_ADDRESS_AND_THE_DIGEST,
        AN_UPDATE_COMPARES_THE_DIGEST_ALONE,
      ),
    ],
    killed(['update-compares-two-digests-and-nothing-else']),
  ),

  // `serialise.ts` - what a contract becomes on its way into the registry.

  sameOnEveryLens(
    'I-140',
    'accepts a case whose fields do not begin with the call its contract declares, so a row a page ' +
      'renders as a call is a table of one - and the arguments a reader is shown are in whatever ' +
      'order somebody typed them',
    [serialiseFile(A_CASE_BEGINS_WITH_THE_CALL, '')],
    killed(['a-case-that-is-not-a-call-is-refused']),
  ),

  sameOnEveryLens(
    'I-141',
    'reads a case that cites a battery cell as one found in the wild, so a citation that resolves to ' +
      'exactly one mutant is stored as a report of a defect somebody sent in - and the evidence a ' +
      'case carries stops being an address',
    [serialiseFile(A_MUTATION_CITATION_IS_ITS_OWN_KIND, A_MUTATION_CITATION_IS_A_REPORT)],
    killed(['every-mutation-provenance-resolves', 'every-unfilled-field-is-justified']),
  ),

  sameOnEveryLens(
    'I-142',
    'fills a minified size nobody measured with a zero, so a figure this repository has no minifier ' +
      'to produce is published as though it had been produced',
    [serialiseFile(NOTHING_IS_MEASURED, A_SIZE_NOBODY_MEASURED)],
    killed(['nothing-is-measured-yet']),
  ),

  sameOnEveryLens(
    'I-143',
    'drops a contract\'s corrections from its record, so a field the registry declares standing is ' +
      'carried by no contract at all - and a standing field nothing fills is a mechanism with no ' +
      'instance',
    [serialiseFile(A_CORRECTION_IS_CARRIED, A_CORRECTION_IS_DROPPED)],
    killed([
      'every-standing-field-a-contract-declares-is-carried-by-one',
      'every-unfilled-field-is-justified',
    ]),
  ),

  sameOnEveryLens(
    'I-144',
    'declares an edge from a reference to each of its own files, so permanent rule 2 is broken by the ' +
      'artefact that exists to demonstrate it - and an install resolves a graph where there is none',
    [serialiseFile(A_REFERENCE_DECLARES_NO_EDGE, A_REFERENCE_DEPENDS_ON_ITS_OWN_FILES)],
    killed(['every-reference-has-no-dependencies']),
  ),

  /**
   * `verifiability.ts` - the two columns a reader is handed when they ask what they can check.
   *
   * Ten cells and ten sole reds, which is the sharpest thing in this slice and is a property of the
   * subject rather than of the work: this module is a table of declarations, so each guard sits
   * opposite one row and a defect in that row falsifies that guard and nothing else. It is the shape
   * ADR-0210 argued a *parameterised* table has, arriving on a file nobody parameterised.
   */
  sameOnEveryLens(
    'I-145',
    'names a verifiable claim in camel case, so a claim stops being an address - and a page or a ' +
      'record citing it has nothing frozen to cite',
    [verifiabilityFile(A_CLAIM_IS_ADDRESSED, A_CLAIM_IS_NAMED_IN_CAMEL_CASE)],
    killed(['every-claim-is-an-address']),
  ),

  sameOnEveryLens(
    'I-146',
    'points a claim at an endpoint that does not exist, so the methodology page promises something ' +
      'about an answer nobody can ask for - which is what a table of this kind rots into',
    [verifiabilityFile(A_CLAIM_IS_ABOUT_A_BLOB, A_CLAIM_IS_ABOUT_NOTHING_THAT_EXISTS)],
    killed(['every-claim-is-about-an-endpoint-that-exists']),
  ),

  sameOnEveryLens(
    'I-147',
    'gives the one check that needs nothing from the registry an endpoint to depend on, so the ' +
      'strongest row in the table - hash what landed against the lockfile - starts needing us',
    [verifiabilityFile(A_CHECK_NEEDS_NOTHING_FROM_THE_REGISTRY, THAT_CHECK_NEEDS_A_SNAPSHOT)],
    killed(['the-checks-that-need-nothing-from-the-registry']),
  ),

  sameOnEveryLens(
    'I-148',
    'leaves a verifiable claim without the sentence saying what it does not establish, so a reader ' +
      'is told what a check proves and never where it stops',
    [verifiabilityFile(A_CLAIM_SAYS_WHAT_IT_DOES_NOT_ESTABLISH, A_CLAIM_SAYS_NOTHING_OF_THE_KIND)],
    killed(['every-verifiable-claim-says-what-it-does-not-establish']),
  ),

  /**
   * The one cell of this slice with two edits, and it is one defect: a fourth nature is added to the
   * vocabulary and a claim is moved onto it. The guard's own comment says that is what it keeps -
   * *a fourth member added later would have to pass through this line* - so a single-edit cell could
   * not reach it, the type refusing a nature the union does not declare.
   */
  sameOnEveryLens(
    'I-149',
    'admits a fourth believed nature and moves a claim onto it, so the registry can say it declines ' +
      'to answer - which is the one thing permanent rule 5 forbids a believed claim from saying',
    [
      verifiabilityFile(THE_NATURES_ARE_THREE, THE_NATURES_ARE_FOUR),
      verifiabilityFile(A_SIZE_IS_A_MEASUREMENT, A_SIZE_IS_WITHHELD),
    ],
    killed(['the-believed-natures-are-the-declared-ones-and-none-is-withholding']),
  ),

  sameOnEveryLens(
    'I-150',
    'calls a claim no arithmetic can reach an opinion of the registry, so the two rows that are ' +
      'genuinely beyond reach stop being nameable - and the column reads as though all of it were ' +
      'ours to change',
    [verifiabilityFile(A_SPECIFICATION_IS_BEYOND_ARITHMETIC, A_SPECIFICATION_IS_AN_OPINION)],
    killed(['the-believed-column-is-longer-and-is-mostly-opinion']),
  ),

  sameOnEveryLens(
    'I-151',
    'invents a mitigation for a claim that has none, so a reader is offered a comfort where the ' +
      'honest answer was that nothing narrows it',
    [verifiabilityFile(AN_INDEX_HAS_NO_MITIGATION, AN_INDEX_IS_GIVEN_ONE)],
    killed(['the-believed-claims-with-no-mitigation-are-named']),
  ),

  sameOnEveryLens(
    'I-152',
    'leaves a stratum translated by an empty sentence, so a reader meeting a field verified that way ' +
      'is told the name of the stratum and nothing about what they can do with it',
    [verifiabilityFile(A_STRATUM_IS_TRANSLATED, A_STRATUM_IS_SILENT)],
    killed(['a-translation-is-addressed-to-a-reader']),
  ),

  sameOnEveryLens(
    'I-153',
    'drops one field from the methodology answer, so the endpoint that promises a stratum for every ' +
      'field of a record quietly stops carrying one of them',
    [verifiabilityFile(EVERY_FIELD_REACHES_THE_METHODOLOGY, ONE_FIELD_DOES_NOT)],
    killed(['the-methodology-answer-carries-every-field-of-a-record']),
  ),

  sameOnEveryLens(
    'I-154',
    'serves the methodology answer as content-addressed, so an answer that has to be revalidated as ' +
      'the catalogue moves is cached as though it never would',
    [verifiabilityFile(THE_METHODOLOGY_IS_NAMED, THE_METHODOLOGY_IS_CONTENT_ADDRESSED)],
    killed(['the-methodology-answer-is-named-and-therefore-revalidated']),
  ),

  // `snapshot.ts` - the standing, and the ledger where a name is bound to a digest.

  sameOnEveryLens(
    'I-155',
    'leaves a standing field with no reason why it cannot be frozen, so a field the registry may ' +
      'still change carries no argument for being outside the digest',
    [snapshotFile(A_STANDING_FIELD_SAYS_WHY, A_STANDING_FIELD_SAYS_NOTHING)],
    killed(['every-standing-field-says-why-it-cannot-be-frozen']),
  ),

  sameOnEveryLens(
    'I-156',
    'sets a standing on a contract the ledger does not hold, so a lifecycle can be recorded for an ' +
      'address nothing was ever published at - and the ledger acquires an opinion about nothing',
    [snapshotFile(A_STANDING_IS_SET_ONLY_ON_SOMETHING_PUBLISHED, '')],
    killed(['a-standing-cannot-be-set-on-something-unpublished']),
  ),

  sameOnEveryLens(
    'I-157',
    'keys a published binding on a contract name rather than on its whole address, so `name@2` reads ' +
      'as a rebinding of `name@1` and the one operation this storage exists to refuse refuses a ' +
      'second major instead',
    [snapshotFile(A_BINDING_IS_KEYED_ON_ITS_WHOLE_ADDRESS, A_BINDING_IS_KEYED_ON_ITS_NAME)],
    killed(['two-majors-of-one-name-coexist']),
  ),

  sameOnEveryLens(
    'I-158',
    'discards the standing it was handed, so the half of a contract the registry may still change ' +
      'cannot be changed - and a contract the language absorbs goes on saying it is published',
    [snapshotFile(A_STANDING_IS_APPLIED, A_STANDING_IS_DISCARDED)],
    killed(['a-standing-changes-and-the-digest-does-not']),
  ),

  sameOnEveryLens(
    'I-159',
    'refuses a contract that is already published, so one address can be both published and turned ' +
      'down - and the ledger carries two decisions about one contract with nothing saying which won',
    [snapshotFile(A_PUBLISHED_CONTRACT_CANNOT_BE_REFUSED, '')],
    killed(['a-contract-is-refused-or-published-and-never-both']),
  ),

  // `imagined-graph.ts` and `address.ts` - the fixture a dependency walk is measured on, and what an
  // address is allowed to be.

  sameOnEveryLens(
    'I-160',
    'addresses a file by its name rather than by its content, so four different `reference.ts` share ' +
      'one digest - and a client deduplicating a shared file by digest installs one of them for all ' +
      'four',
    [imaginedGraphFile(A_FILE_IS_ADDRESSED_BY_ITS_CONTENT, A_FILE_IS_ADDRESSED_BY_ITS_NAME)],
    killed(['a-shared-file-is-recognised-by-its-digest-and-never-by-its-path']),
  ),

  sameOnEveryLens(
    'I-161',
    'forbids a hyphen in a contract domain, so an address the catalogue can hold today stops being ' +
      'one - and a sixth contract is refused for carrying a spelling five published ones are allowed',
    [addressFile(A_DOMAIN_MAY_CARRY_A_HYPHEN, A_DOMAIN_MAY_NOT)],
    killed(['is-addressable', 'every-address-a-fixture-stands-at-is-one-the-catalogue-refuses']),
  ),

  // -------------------------------------------------------------------------
  // ADR-0212's slice: one aiming decision per family, over all nineteen
  // -------------------------------------------------------------------------
  //
  // A family is one title asked of seven contracts, so a cell aimed at the sentence reaches every row
  // whose contract instantiates the clause. Each pin below names the rows the cell was written to
  // exercise; what else reddened is in the record, cell by cell.

  sameOnEveryLens(
    'I-162',
    "reads the identity's export name from its input domain, so a contract announces a paragraph of " +
      'prose where it should announce the export a caller imports',
    [
      serialiseFile(
        "    exportName: identity['exportName'] as string,",
        "    exportName: identity['inputDomain'] as string,",
      ),
    ],
    killed(onEach('the-answer-is-the-export-the-identity-names')),
  ),

  sameOnEveryLens(
    'I-163',
    'drops the first entry of a benchmark vocabulary, so a class the profiles use is one the record ' +
      'no longer declares - and a reader of the served vocabulary meets a class with no meaning',
    [serialiseFile('  vocabulary: source.vocabulary,', '  vocabulary: source.vocabulary.slice(1),')],
    killed(onEach('the-profile-vocabulary-and-the-profiles-agree')),
  ),

  sameOnEveryLens(
    'I-164',
    'renders a case identifier in upper case, so it stops being a frozen identifier - and the anchor ' +
      'a page publishes for that case is not an address the registry can be asked for',
    [
      serialiseFile(
        "    id,\n    group: entry['group'] as string,",
        "    id: id.toUpperCase(),\n    group: entry['group'] as string,",
      ),
    ],
    killed(onEach('every-case-is-addressable-across-the-whole-contract')),
  ),

  /**
   * The one family of the nineteen that is vacuous for most of the catalogue. ADR-0212.
   *
   * `producedBy` is declared by `number/parse@1` and `array/group-by@1` and by nobody else, so the
   * guard quantifies over an empty set on five contracts and is green there whatever this serialiser
   * does. Two rows of seven can ever redden, which is why the pin names two and not seven.
   */
  sameOnEveryLens(
    'I-165',
    "names a profile by its description, so every producing expression a contract declares names a " +
      'profile the record does not hold - and the arithmetic behind a published figure cites nothing',
    [
      serialiseFile(
        "  const name = entry['name'] as string\n" +
          '  const named = [...PROFILE_FIELDS_THE_SCHEMA_NAMES, classField]',
        "  const name = entry['description'] as string\n" +
          '  const named = [...PROFILE_FIELDS_THE_SCHEMA_NAMES, classField]',
      ),
    ],
    killed([
      'every-produced-profile-exists-number-parse',
      'every-produced-profile-exists-array-group-by',
      'every-unfilled-field-is-justified',
    ]),
  ),

  sameOnEveryLens(
    'I-166',
    'records every harness file as zero bytes long, so a client sizing an install from the snapshot ' +
      'is told that fetching the whole harness costs nothing',
    [
      serialiseFile(
        '  return { path, sha256: digestOfBytes(bytes), bytes: bytes.byteLength }',
        '  return { path, sha256: digestOfBytes(bytes), bytes: 0 }',
      ),
    ],
    killed(onEach('every-harness-file-is-hashed')),
  ),

  /**
   * Vacuous on `number/parse@1` alone, and for the reason its own entry in the catalogue states: it is
   * the one contract that publishes nothing beyond the shared seven, so its `ownDeclarations` is empty
   * and dropping the first of none drops nothing. ADR-0212.
   */
  sameOnEveryLens(
    'I-167',
    "drops a contract's first own declaration, so an export the contract really publishes is carried " +
      'by no field of the record and excused by nothing either',
    [serialiseFile('  sources.map((source) => {', '  sources.slice(1).map((source) => {')],
    killed(onEachBut('every-export-is-carried-or-declared-uncarried', 'number-parse')),
  ),

  sameOnEveryLens(
    'I-168',
    'takes the first character off every served file rather than off the ones carrying a byte-order ' +
      'mark, so the served form stops being idempotent and the bytes hash to something other than ' +
      'the address they are served under',
    [
      canonicalFile(
        '  const withoutMark = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text',
        '  const withoutMark = text.slice(1)',
      ),
    ],
    killed(onEach('a-blob-answer-hashes-to-its-address')),
  ),

  sameOnEveryLens(
    'I-169',
    "renames the environments field inside the frozen half, so a snapshot serves a field no visibility " +
      'map classifies and which the record it was built from does not carry',
    [snapshotFile('    environments: record.environments,', '    targetEnvironments: record.environments,')],
    killed([
      ...onEach('every-field-a-snapshot-serves-is-classified'),
      ...onEach('a-snapshot-invents-no-field'),
    ]),
  ),

  sameOnEveryLens(
    'I-170',
    'puts the lifecycle inside the frozen half, so the one field the registry may still change its ' +
      'mind about moves the digest every lockfile in the world holds',
    [
      snapshotFile(
        '    identity: record.identity,',
        '    lifecycle: record.lifecycle,\n    identity: record.identity,',
      ),
    ],
    killed(onEach('a-standing-field-does-not-move-the-digest')),
  ),

  sameOnEveryLens(
    'I-171',
    'classifies a field the catalogue does not have in place of one it serves, so every contract is ' +
      'published with a summary no rule says is public - which is how a private field escapes',
    [
      fieldMapFile(
        "  'identity.summary': { visibility: 'public', verification: 'documentary' },",
        "  'identity.summaries': { visibility: 'public', verification: 'documentary' },",
      ),
    ],
    killed(onEach('every-served-field-is-classified')),
  ),

  sameOnEveryLens(
    'I-172',
    'inverts the test for a well-formed contract name, so every address this catalogue holds is ' +
      'reported as malformed and the only names the registry accepts are the ones it must refuse',
    [addressFile('  ...(CONTRACT_NAME.test(address.name)', '  ...(!CONTRACT_NAME.test(address.name)')],
    killed(onEach('the-address-is-well-formed')),
  ),

  sameOnEveryLens(
    'I-173',
    'empties the reason every contract gives for the one export it does not carry, so a record ' +
      'excuses an export and says nothing about why',
    [
      serialiseFile(
        "  'the executable half of the contract: served as a hashed file by the harness endpoint, and ' +\n" +
          "  'never modelled, because a record carrying the source of a function would publish code the ' +\n" +
          "  'registry does not run and therefore does not verify'",
        "  ''",
      ),
    ],
    killed(onEach('every-uncarried-export-carries-a-reason')),
  ),

  sameOnEveryLens(
    'I-174',
    "binds a reference implementation to the next major of its own contract, so what a lockfile " +
      'records as the implementation of `name@1` belongs to a `name@2` nobody has published',
    [
      serialiseFile(
        '    contract: source.address,',
        '    contract: { ...source.address, major: source.address.major + 1 },',
      ),
    ],
    killed(onEach('the-implementation-belongs-to-its-contract')),
  ),

  sameOnEveryLens(
    'I-175',
    "puts a digest inside an implementation's frozen half, so the half a binding may carry and the " +
      'half frozen for the life of the major overlap on the one field a binding always has',
    [
      snapshotFile(
        '    id: record.id,\n    contract: record.contract,',
        '    id: record.id,\n    digest: record.id,\n    contract: record.contract,',
      ),
    ],
    killed([
      ...onEach('an-implementation-binding-carries-no-frozen-field'),
      ...onEach('the-frozen-half-and-the-standing-half-partition-an-implementation'),
    ]),
  ),
]

export const battery: Battery = {
  name: 'registry-storage',
  contractPath: 'packages/registry',
  vitestConfig: 'packages/registry/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'I-05',

  arms: [
    {
      id: 'R',
      ref: 'HEAD',
      convention: 'the storage as committed: canonical form, served bytes, snapshot, ledger',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['R'], edits: [] },
  ],

  /**
   * One guard, and it is out of reach by construction rather than unprobed.
   *
   * `every-export-that-renders-no-contract-says-why` reads the classification `address.test.ts`
   * declares about its own module - a record of literal reasons written in the test file. This battery
   * edits production sources and nothing else, as every cell of it does, so no edit it can make
   * reaches a string that guard looks at. Calling it unprobed would be asking for a mutant that
   * cannot exist.
   *
   * What *is* kept about that record is kept by the compiler and not by a cell: it is total over the
   * module's exports, so an export added to `address.ts` fails to typecheck until it is classified -
   * which this battery does see, as a `killed-by-typecheck`.
   */
  unreachableGuards: [
    /**
     * Half of what it compares is in `mutation/`, and a battery injects only into the folder under
     * measurement.
     *
     * It joins a battery's declared `contractPath` to a contract's composed folder, and the
     * composition is `theFolderOf` in `published.ts`. No edit this battery can make reaches it; the
     * half it *can* reach is a contract's address in `the-catalogue.ts`, and moving one of those is a
     * defect this battery has no cell for because it would redden dozens of guards at once and
     * measure none of them. ADR-0130.
     */
    {
      guards: ['every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns'],
      reason:
        'the composition it checks lives in `mutation/published.ts`, and a battery edits only the ' +
        'folder under measurement',
    },
    {
      guards: ['every-export-that-renders-no-contract-says-why'],
      reason:
        'it reads reason literals written in `address.test.ts`, and this battery edits production ' +
        'sources only - so no edit it can make reaches them',
    },
    /**
     * Out of reach by construction, and the construction is the direction a damaged string fails in.
     *
     * The guard asks where a sentence the catalogue shares sits inside a contract's prose, and that
     * seam is composed in `contracts/typescript/*\/contract.ts`. `serialise.ts` is the only module of
     * this folder the string passes through, and it copies it. To redden the guard an edit would have
     * to produce a *misplaced* occurrence; every edit that damages the string removes the occurrence
     * instead, and then there is nothing to be wrong about.
     *
     * Measured rather than argued: `reason: property.reason` replaced by `reason: ''` in `serialise.ts`
     * leaves the whole registry suite green, these five included. That is the strongest edit available
     * here and it reddens nothing, which is what separates this from a region awaiting a mutant.
     */
    /**
     * Out of reach because both of its answers are computed somewhere this battery cannot edit.
     *
     * `the-decision-to-publish-moves-no-digest` compares three commits of the subject clone against
     * each other, and every digest comes back from `print-ledger.ts` running in a child process over a
     * checkout of one of them. This battery edits the working tree, and a working tree is the one
     * thing none of those processes reads - so a mutant would have to reach into a checkout of a
     * commit it did not make.
     *
     * The three guards beside it in that file are reddened, and the difference is where the comparison
     * happens rather than where the subject does: those compare through `rebinding.ts`, which is
     * today's code and is exactly what I-49 and I-50 edit.
     */
    {
      guards: ['the-decision-to-publish-moves-no-digest'],
      reason:
        'both digests it compares are answered by a child process over a checkout of a commit, and ' +
        'this battery edits the working tree - which is the one thing neither process reads',
    },
    {
      guards: onEachBut(
        'a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands',
        WHOSE_SERIALISATION_THE_SIGNATURE_CELLS_STOP,
      ),
      reason:
        'the seam it reads is composed in a contract folder, and this battery edits `packages/registry/` only ' +
        '- measured, emptying the reason in `serialise.ts` removes the occurrence rather than ' +
        'misplacing it, and the whole suite stays green',
    },
    /**
     * Both halves of it are files this battery may not touch. `package.json` is the repository's own
     * manifest and `THE_PACKAGE_VERSION` is read from `publication.ts`, which is in this folder - but
     * the guard asserts the *absence* of a field in the manifest and the absence of a script naming
     * `npm publish`, and neither of those is a value `packages/registry/` decides. An edit here cannot
     * put `private: true` back.
     */
    {
      guards: ['the-manifest-carries-no-private-flag-and-the-catch-that-replaces-it-is-named'],
      reason:
        'it asserts what the repository\'s own `package.json` does not carry, and a battery may edit ' +
        'only the folder under measurement',
    },
  ],

  /**
   * The guards of `packages/registry/` that no mutant of this battery reddens, declared as regions it does not
   * probe rather than as guards out of its reach.
   *
   * The difference is a claim about what is possible, and for the first two lists it has not been
   * measured. Those mutants aim at the storage - the canonical form, the served bytes, the projection,
   * the ledger - and most of what they leave silent belongs to the schema, which was an earlier unit
   * and has no battery of its own. Some of it is certainly out of reach of an edit to three files;
   * establishing which would take a mutant apiece, and asserting it without one is the kind of
   * sentence this instrument exists to replace. So the honest name is the loud one, and what it asks
   * for is mutants.
   *
   * **The last two lists are different, and they are the read API's.** Fifty guards arrived with it,
   * and twenty-eight of them are not a question: a perturbation was written for each one while the
   * unit was being built, applied one at a time against a calibrated control, and every one went red
   * on the guard written for it. They are reachable, demonstrated, and the mutant was not promoted
   * into this battery - which is a debt with a name rather than an open question. The other
   * twenty-two had no perturbation written at all.
   */
  unprobedRegions: [
    /**
     * The sentence the README publishes about the size of this catalogue, against what `theCatalogue`
     * declares. It is reachable from here and no mutant reaches it.
     *
     * `the-catalogue.ts` is in this folder, so an edit that moved `array/group-by@1` out of
     * `never-published` would take the refused count to zero and redden it - which is the mutant this
     * region asks for. It is not written here because that edit reddens the refusals page, the index
     * and the installability of a contract the catalogue turned down, so the cell would attribute its
     * kill to any of a dozen guards; naming this one would need a narrower edit than the data allows.
     * A sixth contract, or a second refused one, makes the count movable without moving anything else.
     */
    {
      nature: 'claims detection',
      reason:
        'an edit to `the-catalogue.ts` that changed how many contracts are refused would redden it, and ' +
        'every such edit also reddens the refusals page and the index - so no mutant here names this ' +
        'guard rather than a dozen. ADR-0211 measured the edit this region asks for: marking the ' +
        'refused contract published reddens nine guards, and the two nearest descriptions of it are ' +
        '`what-is-served-and-cannot-be-asked-for-is-the-refused-contract` and ' +
        '`a-contract-not-yet-published-carries-the-current-banner`, so the prediction written here ' +
        'holds as a measurement rather than as a reading',
      guards: ['the-readme-counts-the-catalogue-the-registry-declares'],
    },
    {
      nature: 'claims detection',
      reason:
        'the schema, rather than the storage. These guards were written by the unit that built the ' +
        'contract record and have no battery of their own; the mutants here aim at the canonical ' +
        'form, the served bytes, the frozen projection, the ledger and the licence perimeter, and ' +
        'none of them reaches a ' +
        'statement about what a record contains.',
      suites: [
        // **This list is empty and it is the ninth time.** `the files a contract is made of` is
        // deliberately absent: it is a storage suite, every one of its guards is reddened by I-02, and
        // declaring it here is what the instrument refused when the two guards still sat in the file
        // above. `the implementations under the contracts of the catalogue` left this list for the
        // same reason, below. `the registry encoding` and `a sixth contract enters without a
        // migration` left it for that reason too, at the E series, and both are named guard by guard
        // below. `the public/private frontier` left it at I-106 to I-109, the fifth and sixth and
        // seventh and eighth time this has happened. **And `a record accounts for everything its
        // contract declares` left it at I-125 to I-127**, which stop `array/group-by@1` serialising
        // and reach one of its twenty-eight - so the last suite named as a suite is named guard by
        // guard below, and this key exists to say that nothing is declared this way any more.
        // ADR-0211.
      ],
      /**
       * `the five, read against their own source` is named guard by guard rather than as a suite,
       * because it is no longer wholly silent: I-24 and I-25 redden two of its refusals.
       *
       * **A suite-wide declaration absorbs a guard added to that suite, silently, and that is what
       * it did.** The two grouping refusals were written, the mutants that redden them were written,
       * and the region went on claiming they had never spoken - which the instrument caught on the
       * next run rather than a reader catching it never. Listing the guards costs forty-three lines
       * and buys the opposite behaviour: the next guard added here is *unaccounted for* and says so.
       *
       * **And it happened a second time, to `the implementations under the contracts of the catalogue`.** I-26 and
       * I-27 move the licence perimeter, which is `referenceImplementationOf` - the very function ten
       * of that suite's eighteen guards call - so ten went red under a declaration saying none of them
       * ever had. The instrument refused on the next run, as before. The eight that stay silent are
       * named below rather than absorbed, so the next guard added to that file is *unaccounted for*
       * instead of quietly covered.
       *
       * The suites still named as suites stay that way, and it is a bet rather than an oversight: none
       * of them is probed at all, so a guard added to one is as unprobed as its neighbours and the
       * declaration stays true. Two have now stopped being that, each the moment a mutant reached
       * inside it, and each was caught by the instrument rather than by a reader. **A suite name is
       * worth its brevity exactly until one mutant reaches into it, and there is no warning before
       * that day** - which is the argument for reading this refusal as maintenance rather than as
       * something going wrong.
       */
      guards: [
        ...onEach('every-declared-type-occurs-in-the-contract'),
        // A guard whose claim is that a derived identity is injective, and the only single edit that
        // makes two of them collide is one that damages the derivation - at which point the guards
        // pinning the derivation are the nearer description. Measured: dropping the name from a
        // rendered address reddens this and forty-five others, led by
        // `every-rendered-form-of-an-address-carries-every-coordinate-of-its-contract`. ADR-0211.
        'no-two-contracts-share-an-address',
        // `every-produced-expression-is-the-one-its-own-profile-declares` left this list when it
        // replaced the seven occurrence guards: I-72 reddens it, and a guard a mutant reaches is not
        // an unprobed region. Its neighbour below is still silent and stays named. ADR-0171.
        // Five of its seven rows are vacuous and one is witnessed: `producedBy` is declared by
        // `number/parse@1` and `array/group-by@1` alone, so the guard quantifies over an empty set
        // everywhere else and I-165 reddens the two that are not. ADR-0212.
        ...onEach('every-produced-profile-exists').filter(
          (address) => !address.endsWith('array-group-by') && !address.endsWith('number-parse'),
        ),
        // `a record accounts for everything its contract declares`, named guard by guard since I-125,
        // I-126 and I-127 stopped `array/group-by@1` serialising and reached one of its twenty-eight.
        // The one that left is that contract's row of the first family; ADR-0212's I-167 and I-173
        // took thirteen more, and what is left of that file is the two families below and the one row
        // beside them.
        //
        // The row is vacuous rather than unprobed, and `number/parse@1`'s own entry in the catalogue
        // says why in as many words: it is the one contract that publishes nothing beyond the shared
        // seven, so its `ownDeclarations` is empty and a defect in how the serialiser reads them has
        // nothing to read. What would redden it is a defect in that contract's own declarations,
        // which is one cell for one row - the price the three families below carry. ADR-0212.
        'every-export-is-carried-or-declared-uncarried-number-parse',
        ...onEach('every-uncarried-export-exists'),
        ...onEach('every-own-declaration-is-an-export'),
        // `the implementations under the contracts of the catalogue`, named guard by guard since I-26 and I-27
        // reached ten of its eighteen. These eight are what is left silent: the perimeter mutants move
        // which files an implementation carries, and none of these reads that.
        // The two of that eight ADR-0211 could not aim at. `every-reference-has-no-dependencies` is
        // witnessed by I-144 and gone; these two are not. A lockfile's claim is that nothing in it
        // is a tagged encoding, and the type system already refuses everything that would falsify
        // it - the one value that gets past, a NaN byte count, reddens a hundred and three guards
        // and is described by the digest family rather than by this one. ADR-0211.
        'a-lockfile-is-json',
        // `the registry encoding`, named guard by guard since the E series reached thirty-three of its
        // thirty-four. **One is left and it is the only one of the thirty-four with no cell aimed at
        // it**: every defect in what distinguishes an object with no prototype is either invisible to
        // the round trip - the comparison reads keys, kinds and classes and never a prototype,
        // measured green from both sides - or takes the whole serialisation of `object/deep-equal@1`
        // with it, that contract carrying such an object, which reddened sixty-six guards. ADR-0209.
        aValueJsonCannotHold('a-bare-object'),
        // `a sixth contract enters without a migration`, named guard by guard since E-25 reached
        // `survives-the-wire` - the same claim as the seven records, about a contract the catalogue
        // does not yet hold. These six are what is left silent there.
        // Three of those six are witnessed by ADR-0211 - I-133, I-161 and I-134 - and the three left
        // are the sharpest refusals of that slice, because two of them are not about difficulty at
        // all. `every-anatomy-requirement-is-triaged` reads `contractAnatomy`, which lives in
        // `packages/catalogue/`, and `brings-a-sixth-benchmark-vocabulary-and-a-new-reason-set` reads
        // nothing but a record this test file declares - so no edit inside `packages/registry` can
        // reach either, and the battery's own surface is what refuses them rather than a missing
        // idea. **They are declared here as claims no mutant reaches, and they are claims no mutant
        // of this battery *can* reach**, which is a different state this list has no vocabulary for.
        'every-anatomy-requirement-is-triaged',
        'brings-a-sixth-benchmark-vocabulary-and-a-new-reason-set',
        // The third is about difficulty. Its claim is that two paths are present in the projection,
        // and the projection is written by hand at a coarser grain than either path - so every single
        // edit that removes one of them also leaves some path unclassified, which is
        // `needs-no-field-the-schema-does-not-have`'s own sentence. Measured twice, at eighteen reds
        // and at three. ADR-0211.
        'fills-the-fields-no-published-contract-fills',
        // `the public/private frontier`, named guard by guard since I-106 to I-109 reached four of its
        // twelve. **The eight left silent are seven of one family and one guard that resisted**, and
        // the family is the reason the region's own sentence above needed correcting: it said the
        // private-field guards cannot redden until a private field exists, which is true of the
        // catalogue and false of this folder, the map being a source of it. These seven are the other
        // half of the frontier - that every field a snapshot serves is classified - and no mutant here
        // unclassifies one. ADR-0210.
        // The one guard of ADR-0210's slice with no cell aimed at it. Every stratum but one is held by
        // more than one declaration, so a single edit can empty only `stated-per-declaration` - and the
        // plainest description of that edit names the deferral rather than the population of strata,
        // which is A2 failing. Measured both ways: `one-directional` is held by the field map and by
        // `string/slugify@1`'s own declaration, and emptying either alone leaves this guard green.
        'the-strata-are-populated',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'storage guards no mutant of this battery reaches yet. What is left of this region is a ' +
        'standing field pulled into the digest, a snapshot inventing one, and two contracts ' +
        'colliding on one digest. The rest of it - every value JSON would lose, an array reordered, ' +
        'a byte-order mark, a normalisation, and the four standing guards - left at I-110 to I-122 ' +
        'and I-155 to I-158.',
      guards: [
        // `no-two-contracts-share-a-digest` left this list without a cell being aimed at it, which is
        // ADR-0209's own sentence firing again: the criterion for leaving is reddening and not aiming.
        // ADR-0211 searched for a cell for it and refused what it found - a digest taken over a
        // snapshot's format version alone makes all seven collide and reddens thirty-five guards, led
        // by the family that pins the hashing itself - and then I-125 to I-127 reddened it anyway, by
        // stopping one contract serialising. So it is out of this bucket and nothing witnessed it.
      ],
    },

    {
      nature: 'claims detection',
      reason:
        'read-API guards shown reachable and not promoted into this battery. A perturbation was ' +
        'written for each one while the unit was built - applied one at a time against a control ' +
        'calibrated at 268 assertions - and every one went red on the guard written for it. Five of ' +
        'that pass became I-11 to I-15 and thirteen more became ADR-0211\'s cells; what is left is ' +
        'the family below and one guard that resists.',
      guards: [
        // The one of these fifteen ADR-0211 could not aim at, and it resists for the reason
        // `the-strata-are-populated` does one region along - the two are neighbours on one fact.
        // Every stratum but one is held by more than one declaration, and the second holder of
        // `one-directional` is `string/slugify@1`'s own declaration, which is in `contracts/` and
        // outside anything this battery may edit. Measured: retiring the field map's only
        // `one-directional` entry leaves this guard green. ADR-0211.
        'every-stratum-is-translated-and-no-translation-is-orphaned',
      ],
    },
  ],

  mutants,
}
