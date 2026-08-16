import { describe, it, expect } from 'vitest'

import { contractSnapshot, digestOfSnapshot, filesNamedBy } from './snapshot.js'
import type { ContractRecord } from './contract-record.js'
import {
  REPOSITORY_ROOT,
  UndeclaredSharedSurface,
  serialiseContract,
  servedFileOf,
  servedFilesOf,
  sharedHarnessOf,
} from './serialise.js'
import { eachContract } from './the-five.js'
import { specifiersIn } from '../../packaging/reachable.js'

/**
 * What a contract reaches that it does not own, and why it is inside the digest.
 *
 * A contract's fingerprint used to cover the seven files of its folder and nothing they call. Four of
 * those seven import `packages/catalogue/every-contract.ts`, so the guards a published contract runs
 * were decided by bytes no address named. Measured before this field existed, at `9176c9e`: emptying
 * `expectUniversalPropertiesAnswered` left all eight ledger digests identical to the byte, while a
 * contract declaring `deterministic` inapplicable - which that guard exists to refuse - went green.
 * The freeze held to the letter and not in substance, on the one promise this project is sold on.
 *
 * ADR-0105 carries the measurement, the closure and what it costs. The three guards below are the
 * three halves of it: the surface is what the harness really reaches, it is inside the digest, and a
 * reader who fetches what the registry serves can run it.
 */
describe('the shared surface a contract reaches', () => {
  /**
   * The declaration and the walk are two independent statements, and this is their disagreement.
   *
   * Both directions, because both are real failures and they are not the same one. A surface the walk
   * finds and the declaration misses is the defect this whole field exists against - unfrozen code
   * deciding a frozen contract's verdicts. A surface declared and never reached freezes bytes the
   * contract does not depend on, so an edit somewhere it never reads rebinds its address for nothing.
   */
  it.each(eachContract)(
    'the-shared-surface-is-what-the-harness-reaches-%s',
    (_name, source) => {
      expect(() => sharedHarnessOf(REPOSITORY_ROOT, source.folder, source.files, [])).toThrow(
        UndeclaredSharedSurface,
      )

      expect(() =>
        sharedHarnessOf(REPOSITORY_ROOT, source.folder, source.files, [
          ...source.shared,
          'packages/catalogue/reference-implementation.ts',
        ]),
      ).toThrow(UndeclaredSharedSurface)

      expect(
        sharedHarnessOf(REPOSITORY_ROOT, source.folder, source.files, source.shared).map(
          (file) => file.path,
        ),
      ).toEqual([...source.shared].sort())
    },
  )

  /**
   * The claim this unit exists to make true, in the shape the harness guard beside it already has:
   * a shared file that changed under a fixed snapshot digest is the attack, one floor up from the
   * file that changed under a fixed harness digest.
   *
   * The digest is appended to rather than substituted in, for the reason
   * `a-changed-harness-file-moves-the-digest` records: a substitution can be a no-op and leave the
   * guard red for a reason it was not written for.
   */
  it.each(eachContract)(
    'a-changed-shared-file-moves-the-digest-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const [first, ...rest] = record.sharedHarness
      if (first === undefined) {
        throw new Error('a contract that reaches nothing shared would not need this field')
      }

      const changed: ContractRecord = {
        ...record,
        sharedHarness: [{ ...first, sha256: `${first.sha256}0` }, ...rest],
      }

      expect(digestOfSnapshot(contractSnapshot(changed))).not.toBe(
        digestOfSnapshot(contractSnapshot(record)),
      )
    },
  )

  /**
   * `fetch-and-run-the-executable-harness` asks for *every file of the harness*, so that an auditor
   * can run a contract's own suite without asking anyone. Before this field they could not: four of
   * the seven files import a module the registry served at no address, so a reader who fetched
   * everything the snapshot named held a suite that could not resolve its own imports.
   *
   * This is `endpoints.ts`'s claim that the harness digests *cover every file transitively*, asked of
   * the bytes rather than believed. It walks what is served instead of what is on disk, because the
   * question is about what a reader receives - a file this repository holds and does not serve is
   * exactly the hole, and a walk over the working tree could not see it.
   */
  it.each(eachContract)(
    'a-fetched-harness-resolves-every-import-it-carries-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const served = servedFilesOf(source.folder, record)
      const held = new Set(served.map((file) => file.path))

      const unresolved = served.flatMap((file) => {
        const text = servedFileOf(REPOSITORY_ROOT, file.path, file.sha256).toString('utf8')

        return specifiersIn(text)
          .map((specifier) => resolvedFrom(file.path, specifier))
          .filter((path) => !held.has(path))
          .map((path) => `${file.path} imports ${path}, which the registry does not serve`)
      })

      expect(unresolved).toEqual([])
    },
  )

  /** Every blob the snapshot names is one of the files this repository can actually serve. */
  it.each(eachContract)(
    'the-snapshot-names-no-blob-the-registry-cannot-serve-%s',
    (_name, source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const servable = new Set(servedFilesOf(source.folder, record).map((file) => file.sha256))
      const named = filesNamedBy(contractSnapshot(record)).map((file) => file.sha256)

      expect(named.filter((sha256) => !servable.has(sha256))).toEqual([])
    },
  )
})

/**
 * Where a specifier written in a served file leads, as a path addressed the way the served list is.
 *
 * Repository-relative throughout, because that is the one addressing under which a harness file and a
 * shared file can be compared at all - which is what `servedFilesOf` exists to produce.
 */
const resolvedFrom = (from: string, specifier: string): string => {
  const segments = from.split('/').slice(0, -1)

  for (const step of specifier.split('/')) {
    if (step === '.') continue
    else if (step === '..') segments.pop()
    else segments.push(step)
  }

  const path = segments.join('/')

  return path.endsWith('.js') ? `${path.slice(0, -3)}.ts` : path
}
