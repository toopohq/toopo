import { describe, it, expect } from 'vitest'
import { dirname, join } from 'node:path'

import { UnreadableSource, everyNode, positionOf, readSources } from './source.js'

/**
 * The reader, on the catalogue's own files.
 *
 * Every guard here spawns a compiler process, so its verdict can depend on elapsed time and it
 * declares its own timeout - the catalogue's clock rule, applied to the folder that will enforce the
 * catalogue's rules. Measured, a reading of one contract folder takes about 100 ms; a limit a hundred
 * times that is not a duration assertion, and vitest's five-second default would have been one on a
 * loaded machine.
 */
const REPOSITORY_ROOT = dirname(import.meta.dirname)
const PROJECT = join(REPOSITORY_ROOT, 'tsconfig.json')
const REFERENCE = join(REPOSITORY_ROOT, 'contracts', 'typescript', 'date', 'add', 'reference.ts')

const READ_TIMEOUT_MS = 10_000

describe('reading a submission without running it', () => {
  it(
    'a-contract-file-is-parsed-and-walkable',
    () => {
      const nodes = readSources({ project: PROJECT, files: [REFERENCE] }, (sources) => {
        expect(sources).toHaveLength(1)

        return [...everyNode(sources[0]!.file)].length
      })

      // The figure is not pinned. What is asserted is that a real file produced a real tree rather
      // than an empty one, which is the failure a reader can have and still look like it worked.
      expect(nodes).toBeGreaterThan(100)
    },
    READ_TIMEOUT_MS,
  )

  /**
   * A file the program does not hold is refused, never returned as an empty analysis. An analysis of
   * nothing satisfies every rule, so it would read exactly like a clean submission - the same family
   * as an anchor that matches nothing in the mutation instrument.
   */
  it(
    'a-file-outside-the-program-is-refused',
    () => {
      expect(() =>
        readSources({ project: PROJECT, files: [join(REPOSITORY_ROOT, 'nowhere.ts')] }, () => null),
      ).toThrow(UnreadableSource)
    },
    READ_TIMEOUT_MS,
  )

  it(
    'a-refusal-can-be-opened :: a position names a file and a line',
    () => {
      const where = readSources({ project: PROJECT, files: [REFERENCE] }, (sources) => {
        const source = sources[0]!

        return positionOf(source.file.statements[0]!, source)
      })

      expect(where).toMatch(/reference\.ts:\d+$/)
    },
    READ_TIMEOUT_MS,
  )
})
