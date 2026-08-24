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

/** The common shape, where the slug is the address's last segment. */
const onEach = (guard: string): readonly string[] => perContract((slug) => `${guard}-${slug}`)

/**
 * The contracts whose harness carries a code point in U+0080-U+00FF, which is the region a Latin-1
 * re-encoding stops being idempotent on. Measured at `8b6aa89` over all 47 files of the harness and
 * the shared surface: `date/add@1` carries one such point and `string/slugify@1` carries nine.
 *
 * **It names the reason rather than the answer, so a seventh contract lands outside it by default** -
 * which is the correct default, a guard being unwitnessed until something measures it. ADR-0148.
 */
const REACHED_BY_A_LATIN_1_RE_ENCODING = ['date-add', 'string-slugify']

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
  sameOnEveryLens(
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
   * It edits the address and not the name on purpose. The name reaches `THE_COPYRIGHT` and therefore the
   * five copied files, so a mutant on it would redden the marking guards too and say nothing about which
   * guard reads the manifest. The address is in no licence header, so this cell reddens exactly the one
   * assertion it was written for.
   */
  sameOnEveryLens(
    'I-34',
    'publishes a personal e-mail as the package author instead of the project address, in a manifest ' +
      'field that is immutable once a version exists',
    [publicationFile(THE_ADDRESS_IS_THE_PROJECT_S, `  email: 'mathis.perron@example.com',`)],
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
      guards: onEach('a-sentence-the-catalogue-shares-is-a-whole-sentence-where-it-lands'),
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
     * **Nine guards that had a witness for two years and never had one anybody could reproduce.**
     * ADR-0145.
     *
     * They were reddened by `I-01` and `I-08`, and both of those cells only differ from the reference
     * where the working tree differs from what the registry serves. `.gitattributes` declares
     * `eol=lf` and it does not renormalise a working directory that is already there, so the machine
     * those pins were written on kept nine files carrying CRLF and the cells were seen red - one
     * hundred and four seconds after the commit that abolished the condition for every clone made
     * afterwards. Measured on that machine in both directions with the control green at 407 tests
     * either way, and on two hosted runners of different platforms: on any checkout git produces,
     * both cells survive.
     *
     * So the pins are honest now and this region is what that cost. **What lost its witness is the
     * assembly and not the promise**: `a-crlf-source-is-served-as-its-lf-form`,
     * `a-byte-order-mark-is-not-content` and `normalising-changes-the-digest` call `servedBytes` on
     * constructed buffers, so they have teeth on every platform and cannot go quiet. What had none
     * was the end-to-end claim - and `the-served-bytes-are-the-committed-bytes` says where its own
     * teeth are, in its own comment, under a heading that reads *Where this guard has teeth, said out
     * loud*. What nobody had declared is that its pins inherited that limit.
     *
     * **That paragraph asked for a mutant and named the wrong place to look for one. ADR-0148.** It
     * read *an edit inside `canonical.ts` rather than one that chooses which bytes to read*, and that
     * sentence is true of the first guard and false of the other three: the bindings round trip never
     * touches a served byte, and no edit to `canonical.ts` of any kind can redden it. Five of the nine
     * are witnessed now - `I-65`, `I-66` and `I-67` - and what is left is the four below.
     */
    {
      guards: onEach('a-blob-answer-hashes-to-its-address').filter(
        (address) => !REACHED_BY_A_LATIN_1_RE_ENCODING.some((slug) => address.endsWith(slug)),
      ),
      nature: 'claims detection',
      reason:
        'the four contracts `I-65` does not move. The guard compares two evaluations of one ' +
        'expression on one file, so no edit to `servedBytes` can separate them; what has teeth is ' +
        '`servedBlobFaults` beside it, which applies that expression twice and therefore reads ' +
        'idempotence. A Latin-1 re-encoding loses idempotence only on a code point in U+0080-U+00FF, ' +
        'and these four carry none. ADR-0148',
    },
    /**
     * **Unaccounted for since the day it was written, and found by a replay rather than by a
     * reader.** It arrived at `70cfb22` with the standing, and its name has never appeared in this
     * file - so from that commit until this one the battery measured a suite one guard larger than
     * it accounted for, and said so to nobody, because nothing replays a battery but a person
     * typing the command. `CLAUDE.md` carries that as an open entry and this is its second
     * recorded instance, on a second battery.
     *
     * It is reachable and no mutant reaches it. `CONTRACT_STANDING_FIELDS` is in this folder, so a
     * field declared there and carried by no contract reddens it - and that cell is not written
     * here because it is the same edit as the one that would test the partition, which several
     * mutants already make: the kill would attribute to whichever of them ran, and naming this one
     * needs an edit that adds a standing field without moving the partition. Declared as the debt
     * it is rather than left as silence. ADR-0130.
     */
    {
      guards: ['every-standing-field-a-contract-declares-is-carried-by-one'],
      nature: 'claims detection',
      reason:
        'a field declared standing and carried by no contract would redden it, and no cell here ' +
        'writes that edit without also moving the partition several mutants already measure',
    },
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
        'guard rather than a dozen',
      guards: ['the-readme-counts-the-catalogue-the-registry-declares'],
    },
    /**
     * The reading of a declared signature, on the shapes the five actually write.
     *
     * Every one of these was seen red while `signature.ts` was being written - dropping the
     * trailing-comma filter reddens three of them and thirty-two guards across nine files of this
     * folder - and none of the mutants is promoted here, because each one stops a real contract
     * serialising and therefore reddens most of `packages/registry/` at once. A cell that reddens eighty guards
     * establishes that serialisation is load-bearing, which nobody doubted, and says nothing about the
     * reader.
     *
     * What would close it is a sixth contract whose signature carries one of these shapes, or a
     * fixture record for the reader alone. Both are real and neither is this unit's.
     */
    {
      nature: 'claims detection',
      reason:
        'the reading of a declared signature on a shape one of the five writes. Every mutant here ' +
        'stops a real contract serialising, so it reddens most of this folder and attributes the ' +
        'kill to the failure rather than to the guard; the three that are narrow enough to name one ' +
        'guard are I-20, I-22 and I-23 above.',
      guards: [
        'a-plain-signature-names-its-parameters',
        'a-signature-that-takes-nothing-has-no-parameters',
        'the-type-parameters-are-not-the-parameters',
        'the-parameters-of-a-parameter-are-not-parameters',
        'a-trailing-comma-leaves-no-parameter-behind-it',
        'an-arrow-inside-a-type-parameter-does-not-close-it',
        ...perContract((slug) => `the-call-of-${slug}-is-read-from-its-own-signature`),
      ],
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
        'a record accounts for everything its contract declares',
        // The schema suites still wholly silent. `the files a contract is made of` is deliberately
        // absent: it is a storage suite, every one of its guards is reddened by I-02, and declaring
        // it here is what the instrument refused when the two guards still sat in the file above.
        // `the implementations under the contracts of the catalogue` left this list for the same reason, below.
        'the registry encoding',
        'the public/private frontier',
        'a sixth contract enters without a migration',
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
        ...onEach('the-answer-is-the-export-the-identity-names'),
        ...onEach('the-profile-vocabulary-and-the-profiles-agree'),
        'every-mutation-provenance-resolves',
        ...onEach('every-case-is-addressable-across-the-whole-contract'),
        ...onEach('the-address-is-well-formed'),
        'no-two-contracts-share-an-address',
        ...onEach('every-produced-expression-occurs-in-the-contract'),
        ...onEach('every-produced-profile-exists'),
        'a-case-that-is-not-a-call-is-refused',
        ...onEach('every-harness-file-is-hashed'),
        // `the implementations under the contracts of the catalogue`, named guard by guard since I-26 and I-27
        // reached ten of its eighteen. These eight are what is left silent: the perimeter mutants move
        // which files an implementation carries, and none of these reads that.
        ...onEach('the-implementation-belongs-to-its-contract'),
        'every-reference-has-no-dependencies',
        'nothing-is-measured-yet',
        'a-lockfile-is-json',
      ],
    },
    {
      nature: 'claims detection',
      reason:
        'storage guards no mutant of this battery reaches yet. Each one names a defect that could be ' +
        'written and has not been: a byte-order mark left in the served bytes, a value JSON would ' +
        'lose reaching a digest, an array reordered, a standing field pulled into the digest, an ' +
        'attestation accepted for the wrong snapshot, two contracts colliding on one digest.',
      guards: [
        'a-bundle-that-is-not-addressed-like-a-blob-is-refused',
        'a-byte-order-mark-is-not-content',
        'a-crlf-source-is-served-as-its-lf-form',
        ...onEach('a-snapshot-invents-no-field'),
        'a-standing-cannot-be-set-on-something-unpublished',
        'a-standing-changes-and-the-digest-does-not',
        ...onEach('a-standing-field-does-not-move-the-digest'),
        'a-value-json-would-lose-is-refused-a-bigint',
        'a-value-json-would-lose-is-refused-a-function',
        'a-value-json-would-lose-is-refused-a-hole',
        'a-value-json-would-lose-is-refused-a-symbol',
        'a-value-json-would-lose-is-refused-an-undefined-field',
        'a-value-json-would-lose-is-refused-infinity',
        'a-value-json-would-lose-is-refused-nan',
        'a-value-json-would-lose-is-refused-negative-infinity',
        'a-value-json-would-lose-is-refused-negative-zero',
        'a-value-json-would-lose-is-refused-undefined',
        'an-array-keeps-its-order',
        'an-attestation-about-another-snapshot-is-refused',
        'every-standing-field-says-why-it-cannot-be-frozen',
        'no-two-contracts-share-a-digest',
        'normalising-changes-the-digest',
        ...onEach('the-frozen-half-and-the-standing-half-partition-an-implementation'),
        'the-limit-of-a-signature-is-published',
        'two-majors-of-one-name-coexist',
      ],
    },

    {
      nature: 'claims detection',
      reason:
        'read-API guards shown reachable and not promoted into this battery. A perturbation was ' +
        'written for each one while the unit was built - applied one at a time against a control ' +
        'calibrated at 268 assertions - and every one went red on the guard written for it. Five of ' +
        'that pass became I-11 to I-15; these twenty-eight did not, and the reason is cost rather ' +
        'than doubt. A debt with a name, which is what this list is for.',
      guards: [
        'a-content-addressed-answer-is-cached-for-ever',
        'a-contract-is-refused-or-published-and-never-both',
        'a-cycle-is-refused-rather-than-deduplicated-away',
        'a-named-answer-is-always-revalidated',
        'a-refused-entry-is-answered-by-endpoints-that-exist-for-other-reasons',
        'a-snapshot-answer-that-was-altered-is-refused',
        'a-snapshot-answer-under-another-format-version-means-nothing-here',
        'an-edge-the-registry-does-not-hold-is-refused',
        'an-unpublished-implementation-cannot-be-depended-on',
        'every-claim-is-about-an-endpoint-that-exists',
        'every-endpoint-answers-a-need-somebody-has',
        ...onEach('every-field-a-snapshot-serves-is-classified'),
        'every-identifier-is-an-address',
        'every-need-is-answered-exactly-once',
        'every-stratum-is-translated-and-no-translation-is-orphaned',
        'nothing-that-held-is-content-addressed',
        'the-believed-claims-with-no-mitigation-are-named',
        'the-believed-column-is-longer-and-is-mostly-opinion',
        'the-depth-is-derived-from-the-edges',
        'the-endpoints-no-entry-anticipated',
        'the-endpoints-that-carry-the-bulk-are-the-cacheable-ones',
        'the-methodology-answer-carries-every-field-of-a-record',
        'the-needs-answered-without-the-api',
        'the-refusals-page-has-a-source',
        'update-compares-two-digests-and-nothing-else',
      ],
    },

    {
      nature: 'claims detection',
      reason:
        'read-API guards no perturbation was written for, so whether an edit to this folder can ' +
        'redden them is unmeasured rather than known. Two families sit here for a reason worth ' +
        'naming. The implementation binding is guarded on the same claim as the contract binding, ' +
        'which I-12 reddens, so that pair is half probed. And the private-field guards cannot redden ' +
        'until a private field exists: not one field of a contract record is private today, which is ' +
        'a finding `field-map.ts` already records rather than a gap a mutant here could close.',
      guards: [
        'a-blob-answer-with-one-byte-changed-is-refused',
        'a-shared-file-is-recognised-by-its-digest-and-never-by-its-path',
        'a-translation-is-addressed-to-a-reader',
        ...onEach('an-implementation-binding-carries-no-frozen-field'),
        'every-claim-is-an-address',
        'every-entry-became-an-endpoint-that-exists',
        'every-entry-says-why',
        'every-verifiable-claim-says-what-it-does-not-establish',
        ...onEach('no-private-field-reaches-a-snapshot-answer'),
        'the-believed-natures-are-the-declared-ones-and-none-is-withholding',
        'the-checks-that-need-nothing-from-the-registry',
        'the-methodology-answer-carries-both-columns-and-the-seeding-policy',
        'the-methodology-answer-is-named-and-therefore-revalidated',
      ],
    },
  ],

  mutants,
}
