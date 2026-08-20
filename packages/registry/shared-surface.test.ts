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
import { theCatalogue } from './the-catalogue.js'
import { specifiersIn } from '../../packaging/reachable.js'

/**
 * What a contract reaches that it does not own, and why it is inside the digest.
 *
 * A contract's fingerprint used to cover the seven files of its folder and nothing they call. Four of
 * those seven import `packages/catalogue/every-contract.ts`, so the guards a published contract runs
 * were decided by bytes no address named. Measured at `e8f68ca`: emptying
 * `expectUniversalPropertiesAnswered` left all eight ledger digests identical to the byte, while a
 * contract declaring `deterministic` inapplicable - which that guard exists to refuse - went green.
 * The freeze held to the letter and not in substance, on the one promise this project is sold on.
 * ADR-0105 carries the measurement, the closure and what it costs.
 *
 * **Each guard here is one guard over the five, where `served-files.test.ts` beside it is five**, and
 * the difference is in the subject rather than in the style. A contract declares its *own* file list
 * and the five do not agree - four carry seven names and `array/group-by@1` carries nine - so
 * `an-undeclared-file-is-refused` is five claims and takes five addresses. `THE_SHARED_FILES` is one
 * list for all five, and every defect these could catch is a defect in one shared reader, so five
 * addresses would be one claim asserted five times: the slug would be a rendering of the loop
 * variable rather than an address, which is what ADR-0017 refuses. The contract is named in the fault
 * instead, in the shape `groupingFaults` and `confirmationFaults` already use.
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
  it('the-shared-surface-is-what-the-harness-reaches', () => {
    const faults = theCatalogue.flatMap((source) => {
      const reached = sharedHarnessOf(REPOSITORY_ROOT, source.folder, source.files, source.shared)

      return [
        ...(refuses(() => sharedHarnessOf(REPOSITORY_ROOT, source.folder, source.files, []))
          ? []
          : [`${source.address.name}: a surface reached and declared nowhere is not refused`]),
        ...(refuses(() =>
          sharedHarnessOf(REPOSITORY_ROOT, source.folder, source.files, [
            ...source.shared,
            'packages/catalogue/reference-implementation.ts',
          ]),
        )
          ? []
          : [`${source.address.name}: a surface declared and never reached is not refused`]),
        ...(reached.map((file) => file.path).join(',') === [...source.shared].sort().join(',')
          ? []
          : [`${source.address.name}: the hashed surface is not the declared one`]),
      ]
    })

    expect(faults).toEqual([])
  })

  /**
   * The claim this unit exists to make true, in the shape `a-changed-harness-file-moves-the-digest`
   * already has one floor down: a shared file that changed under a fixed snapshot digest is the
   * attack, exactly as a harness file that did.
   *
   * The digest is appended to rather than substituted in, for the reason that guard records: a
   * substitution can be a no-op and leave this red for a reason it was not written for.
   */
  it('a-changed-shared-file-moves-the-digest', () => {
    const faults = theCatalogue.flatMap((source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const [first, ...rest] = record.sharedHarness
      if (first === undefined) {
        return [`${source.address.name}: reaches nothing shared, so its guards rest on its own bytes`]
      }

      const changed: ContractRecord = {
        ...record,
        sharedHarness: [{ ...first, sha256: `${first.sha256}0` }, ...rest],
      }

      return digestOfSnapshot(contractSnapshot(changed)) === digestOfSnapshot(contractSnapshot(record))
        ? [`${source.address.name}: ${first.path} moved and the digest did not`]
        : []
    })

    expect(faults).toEqual([])
  })

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
  it('a-fetched-harness-resolves-every-import-it-carries', () => {
    const faults = theCatalogue.flatMap((source) => {
      const served = servedFilesOf(source.folder, serialiseContract(REPOSITORY_ROOT, source))
      const held = new Set(served.map((file) => file.path))

      return served.flatMap((file) =>
        specifiersIn(servedFileOf(REPOSITORY_ROOT, file.path, file.sha256).toString('utf8'))
          .map((specifier) => resolvedFrom(file.path, specifier))
          .filter((path) => !held.has(path))
          .map((path) => `${file.path} imports ${path}, which the registry does not serve`),
      )
    })

    expect(faults).toEqual([])
  })

  /**
   * Every blob a snapshot names is one the registry can produce.
   *
   * `filesNamedBy` tells a client what to fetch and `servedFilesOf` tells a stand-in what to hand
   * over. They are written apart so that neither is derived from the other, and the day they come
   * apart a lockfile holds a digest that answers 404. It is the only guard whose subject is that pair,
   * and it is not merely aimed at a future event: it reddened under two of the four perturbations
   * ADR-0105 records, naming ten blobs the registry could not have served.
   */
  it('the-snapshot-names-no-blob-the-registry-cannot-serve', () => {
    const faults = theCatalogue.flatMap((source) => {
      const record = serialiseContract(REPOSITORY_ROOT, source)
      const servable = new Set(servedFilesOf(source.folder, record).map((file) => file.sha256))

      return filesNamedBy(contractSnapshot(record))
        .filter((file) => !servable.has(file.sha256))
        .map((file) => `${source.address.name}: ${file.path} is named and cannot be served`)
    })

    expect(faults).toEqual([])
  })
})

/** Whether a call refuses, without deciding here what it refuses with beyond the declared error. */
const refuses = (call: () => unknown): boolean => {
  try {
    call()

    return false
  } catch (error) {
    return error instanceof UndeclaredSharedSurface
  }
}

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
