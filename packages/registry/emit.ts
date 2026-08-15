/**
 * Every answer this registry can give, written down at the address it is asked at.
 * ADR-0052 is why this walks the questions rather than the catalogue.
 *
 *
 * ---------------------------------------------------------------------------
 * A walk of the questions, and not a walk of the catalogue
 * ---------------------------------------------------------------------------
 *
 * The obvious way to write this is to go through the catalogue and emit two files per contract. That
 * produces a tree nobody can prove anything about: a walk of the *catalogue* is a list of what somebody
 * remembered, and **an answer a client can ask for and the emission did not write is a 404 at the
 * moment somebody installs something**. What is needed is a walk of the **questions**.
 *
 * So the closure below starts from the questions that take no address - the ones a client can ask
 * having read nothing - and follows what each answer *names*. An index names contract addresses; a
 * binding names a digest; a contract snapshot names the digests of its harness; an implementation
 * snapshot names its own files and the edges it depends on. Every question a client can construct is a
 * question it learned from an answer or typed as a name, and every name is in the index. That is why
 * the closure is total and a list would not be.
 *
 * `WHAT_AN_ANSWER_NAMES` is the mechanism rather than the discipline: it is keyed by `keyof ReadApi`,
 * so a method added to the port does not compile until somebody has said what its answer names. It is
 * the shape `THE_ENDPOINT_BEHIND`, `FIELD_MAP` and `EVERY_ARM` already carry, on the one question this
 * unit turns on.
 *
 * **And the property that needs no list at all: the tree is closed.** Every answer it holds names only
 * addresses it holds, which `emit.test.ts` asks of the emitted tree itself rather than of this walk.
 * A closure that forgot an arm produces a tree that is not closed, and nothing has to enumerate
 * anything for that to be visible.
 *
 * ---------------------------------------------------------------------------
 * It is not the installer's walk, and the difference is the harness
 * ---------------------------------------------------------------------------
 *
 * `packaging/freeze.ts` records what an *installation* asks for, by running the installer's own walk;
 * that is the right shape for an archive, which carries what `toopo` needs. This answers a different
 * question - what a *client* can ask - and the two part company at the harness: a contract snapshot
 * names every file of its test suite, no command of `packages/cli/` ever fetches one, and permanent rule 5 says
 * they are public in full. A tree built from the installer's walk would serve a contract page's own
 * digests as 404s.
 *
 * ---------------------------------------------------------------------------
 * What is served and cannot be asked for
 * ---------------------------------------------------------------------------
 *
 * A refused contract has no binding, so nothing ever names the digest of its contract snapshot, so the
 * closure does not reach it - and `array/group-by@1` is exactly that case. Two snapshots this registry
 * would answer are unreachable from every question a client can ask. They are not emitted, and that is
 * said here and asserted in the guard rather than left to be discovered: silently emitting them would
 * publish artefacts nothing can find, and silently omitting them would look like the closure having a
 * hole.
 */

import type { ContractAddress } from './address.js'
import type { Endpoint } from './endpoints.js'
import { endpointOf, pathTo } from './endpoints.js'
import type { Question, QuestionFor, ReadApi } from './read-api.js'
import { THE_ENDPOINT_BEHIND, addressAsked } from './read-api.js'
import type { Snapshot } from './snapshot.js'
import { filesNamedBy } from './snapshot.js'

/** One answer, as the bytes served at its address and the questions it lets a client ask next. */
type Answered = {
  readonly bytes: Buffer
  readonly names: readonly Question[]
}

const asJson = (value: unknown): Buffer => Buffer.from(JSON.stringify(value), 'utf8')

const snapshotIn = (canonicalText: string): Snapshot => JSON.parse(canonicalText) as Snapshot

const blobsNamedBy = (snapshot: Snapshot): readonly Question[] =>
  filesNamedBy(snapshot).map((file) => ({ method: 'blob', sha256: file.sha256 }) as const)

/**
 * Everything a client can ask once it holds a contract's address, wherever it read that address.
 *
 * One function because there are two doors onto the same pair - the index, and the edges inside an
 * implementation snapshot - and the second was missing until a graph with edges was put through this
 * walk. A reader who fetches `number/round@1` and sees it depend on `number/clamp@1` can ask for that
 * contract's implementations, and a tree built from the index alone answers 404.
 */
const theQuestionsAbout = (address: ContractAddress): readonly Question[] => [
  { method: 'contractBinding', address },
  { method: 'implementationBindings', address },
]

/**
 * What each answer is, and what it lets a client ask next. Total over the port by the compiler.
 *
 * The bytes and the onward questions are one record and not two, because they are one fact about an
 * answer and a walk reads them together: two records keyed the same way would be two places to forget
 * the same arm.
 */
const WHAT_AN_ANSWER_NAMES: {
  readonly [Method in keyof ReadApi]: (
    api: ReadApi,
    question: QuestionFor<Method>,
  ) => Answered | null
} = {
  contractIndex: (api) => {
    const answer = api.contractIndex()

    return {
      bytes: asJson(answer),
      names: answer.entries.flatMap((entry) => theQuestionsAbout(entry.address)),
    }
  },

  // The refusals name the contracts a page links to and, for a contract the language later answered,
  // the binding it is still served at - which is a digest, and therefore a snapshot somebody can fetch.
  refusals: (api) => {
    const answer = api.refusals()

    return {
      bytes: asJson(answer),
      names: answer.absorbed.map((binding) => ({ method: 'snapshot', digest: binding.digest }) as const),
    }
  },

  methodology: (api) => ({ bytes: asJson(api.methodology()), names: [] }),

  contractBinding: (api, question) => {
    const answer = api.contractBinding(question.address)

    return answer === null
      ? null
      : { bytes: asJson(answer), names: [{ method: 'snapshot', digest: answer.digest }] }
  },

  implementationBindings: (api, question) => {
    const answer = api.implementationBindings(question.address)

    return {
      bytes: asJson(answer),
      names: answer.map((binding) => ({ method: 'snapshot', digest: binding.digest }) as const),
    }
  },

  snapshot: (api, question) => {
    const answer = api.snapshot(question.digest)
    if (answer === null) return null

    const frozen = snapshotIn(answer.canonicalText)

    return {
      bytes: asJson(answer),
      names: [
        ...blobsNamedBy(frozen),
        ...(frozen.unit === 'contract'
          ? []
          : frozen.frozen.dependsOn.flatMap((edge) => [
              { method: 'snapshot', digest: edge.digest } as const,
              ...theQuestionsAbout(edge.implementation.contract),
            ])),
      ],
    }
  },

  // The bytes are the answer and they name nothing: what a file imports is in the snapshot that froze
  // it, which is where a client reads it and where a digest covers it.
  blob: (api, question) => {
    const answer = api.blob(question.sha256)

    return answer === null ? null : { bytes: answer.bytes, names: [] }
  },
}

/**
 * The one cast here, and what stands behind it.
 *
 * `WHAT_AN_ANSWER_NAMES` is keyed by method and its arm for a method takes that method's own question;
 * a `Question` carries its method in the field this indexes by, so the arm reached is always the one
 * written for the question handed to it. The compiler cannot see that a mapped type's arm and a
 * discriminated union's member line up, and the alternative is a second total switch beside the record
 * - the copy this repository refuses everywhere else.
 */
const answerTo = (api: ReadApi, question: Question): Answered | null =>
  (WHAT_AN_ANSWER_NAMES[question.method] as (api: ReadApi, asked: Question) => Answered | null)(
    api,
    question,
  )

/**
 * The questions a client can ask having read nothing.
 *
 * Declared here and derived in the guard from the endpoints that are about the catalogue: two
 * statements that must coincide, because a root quietly dropped emits a smaller tree that is still
 * closed and therefore still passes every other check here.
 */
export const THE_QUESTIONS_THAT_NEED_NOTHING: readonly Question[] = [
  { method: 'contractIndex' },
  { method: 'refusals' },
  { method: 'methodology' },
]

/** The endpoint behind a question, resolved through the one statement of which answers what. */
export const endpointBehind = (question: Question): Endpoint =>
  endpointOf(THE_ENDPOINT_BEHIND[question.method])

/** Where a question's answer is asked for, as a URL. */
export const urlAsked = (question: Question): string =>
  pathTo(endpointBehind(question), addressAsked(question))

/**
 * The file a URL is served by: the path with its leading slash taken off, and nothing else.
 *
 * A tree whose file names need translating from the addresses a client asks is a tree with a router in
 * front of it, and there is none - so the translation is this, and `emit.test.ts` requires it to stay
 * this.
 */
export const theFileAt = (url: string): string => url.slice(1)

/**
 * Every answer this registry can be asked for, by the file it is served at.
 *
 * A question whose answer is `null` writes no file, which is how an emitted tree spells *this registry
 * holds no such thing*: a static host answers 404 for a file that is not there, so the absence is the
 * answer rather than something that has to be encoded.
 */
export const emitted = (api: ReadApi): ReadonlyMap<string, Buffer> => {
  const written = new Map<string, Buffer>()
  const asked = new Set<string>()
  const pending: Question[] = [...THE_QUESTIONS_THAT_NEED_NOTHING]

  while (pending.length > 0) {
    const question = pending.shift() as Question
    const url = urlAsked(question)
    if (asked.has(url)) continue
    asked.add(url)

    const answered = answerTo(api, question)
    if (answered === null) continue

    written.set(theFileAt(url), answered.bytes)
    pending.push(...answered.names)
  }

  return written
}
