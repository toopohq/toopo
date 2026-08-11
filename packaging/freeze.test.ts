import { describe, expect, it } from 'vitest'

import { canonical } from '../registry/canonical.js'
import type { Snapshot } from '../registry/snapshot.js'
import { ARTEFACT_FORMAT, artefactFaults, readArtefact } from '../cli/artefact.js'
import { localSource } from '../cli/local-source.js'
import { packagedSource } from '../cli/packaged-source.js'
import type { RegistrySource } from '../cli/source.js'
import { TheRegistryContradictsItself, frozenArtefact } from './freeze.js'

/**
 * The artefact, measured without a disk, a build or an archive.
 *
 * `archive.test.ts` proves the whole thing works by installing it, and pays tens of seconds for that.
 * What it cannot do is say *which* half was wrong when it goes red. These guards are the halves: the
 * two sources agree, the walk carries what an installation needs, and the reader refuses what it
 * cannot serve from.
 *
 * The one worth reading is `the-packaged-source-answers-what-the-local-source-answers`. `source.ts`
 * argues that the port exists so that *the day a server exists it implements this same type and
 * nothing above it changes*, and until this unit that was one implementation and a claim. It is now
 * two implementations and a comparison.
 */

const local = localSource()
const artefact = await frozenArtefact(local)
const packaged = packagedSource(artefact)

/** Every contract the registry knows, refused ones included. */
const everyAddress = (await local.contractIndex()).entries.map((entry) => entry.address)

describe('the catalogue an archive carries', () => {
  /**
   * The two implementations of one port, asked everything a command asks, and required to answer the
   * same thing. A missing map, a key rendered one way here and another there, a blob that did not
   * survive base64 - each of them is this guard going red rather than an installation going wrong in
   * somebody else's project.
   */
  it('the-packaged-source-answers-what-the-local-source-answers', async () => {
    expect(await packaged.contractIndex()).toEqual(await local.contractIndex())
    expect(await packaged.refusals()).toEqual(await local.refusals())

    for (const address of everyAddress) {
      const bindings = await local.implementationBindings(address)

      expect(await packaged.implementationBindings(address)).toEqual(bindings)

      for (const binding of bindings) {
        expect(await packaged.snapshot(binding.digest)).toEqual(await local.snapshot(binding.digest))
      }
    }
  })

  /**
   * The bytes, asked for as an installation asks for them: by the digest a snapshot names.
   *
   * Separate from the answer comparison above because it is the one that travels through base64, and
   * because a blob is the only answer of this port whose body is not JSON. `string/slugify@1` settles
   * a case on a lone surrogate, which is exactly the thing a round trip through a JSON string would
   * quietly replace.
   */
  it('every-file-an-installation-needs-is-served-as-the-bytes-it-was-frozen-from', async () => {
    const files = artefact.snapshots.flatMap((served) => {
      const parsed = JSON.parse(served.canonicalText) as Snapshot

      return parsed.unit === 'implementation' ? parsed.frozen.files : []
    })

    expect(files.length).toBeGreaterThan(0)

    for (const file of files) {
      expect(await packaged.blob(file.sha256)).toEqual(await local.blob(file.sha256))
      expect((await packaged.blob(file.sha256))?.bytes.length).toBe(file.bytes)
    }
  })

  /**
   * A refused contract is in the index, is not installable, and has nothing frozen behind it.
   *
   * `local-source.ts` records that it measured the opposite once - the loop published all five, and
   * `array/group-by@1` came back installable from the very registry whose refusals page exists to say
   * it was turned down. The walk here inherits that shape rather than restating it, so this guard is
   * what says the inheritance held.
   */
  it('a-refused-contract-is-carried-as-a-refusal-and-never-as-something-to-install', async () => {
    const refused = artefact.index.entries.filter((entry) => !entry.installable)

    expect(refused.map((entry) => entry.address.name)).toEqual(['array/group-by'])
    expect(artefact.refusals.refusals.map((entry) => entry.address.name)).toEqual([
      'array/group-by',
    ])

    for (const entry of refused) {
      expect(await packaged.implementationBindings(entry.address)).toEqual([])
    }
  })

  /**
   * Two builds of one working tree write one byte string, so that an archive's digest is a fact about
   * the catalogue and not about the order a walk happened to take.
   */
  it('two-freezes-of-one-working-tree-are-one-byte-string', async () => {
    expect(canonical(await frozenArtefact(localSource()), 'artefact')).toBe(
      canonical(artefact, 'artefact'),
    )
  })

  /**
   * A registry that cannot answer stops the build rather than producing an archive around the hole.
   * A `toopo` that refused at the moment somebody installed something would be the worst possible
   * place to find this out.
   */
  it('a-registry-that-serves-no-bytes-stops-the-build', async () => {
    const silent: RegistrySource = { ...local, blob: async () => null }

    await expect(frozenArtefact(silent)).rejects.toThrow(TheRegistryContradictsItself)
  })
})

describe('what a published toopo refuses to read', () => {
  it('an-artefact-of-a-format-this-toopo-does-not-read-is-refused', () => {
    // The two format numbers, and no third sentence about what produced the archive: a truncated or
    // hand-edited file carries a number too, so *built by a different version of this tool* named a
    // cause the comparison does not establish and said nothing the numbers do not.
    expect(artefactFaults({ ...artefact, formatVersion: ARTEFACT_FORMAT + 1 })).toEqual([
      `registry.json is written under format ${ARTEFACT_FORMAT + 1} and this \`toopo\` reads format ` +
        `${ARTEFACT_FORMAT}.`,
    ])
  })

  /**
   * Field by field, because the record that lists them is total over the type: a field added to
   * `ServedArtefact` does not compile until a check for it is written, and this is what says the
   * checks are reachable rather than merely present.
   */
  it('an-artefact-missing-any-field-is-refused-naming-what-is-missing', () => {
    const missing = (field: string): readonly string[] => {
      const { [field]: _dropped, ...rest } = artefact as unknown as Record<string, unknown>

      return artefactFaults({ ...rest, formatVersion: ARTEFACT_FORMAT })
    }

    expect(missing('index')).toEqual(['registry.json carries no contract index'])
    expect(missing('refusals')).toEqual(['registry.json carries no refusals'])
    expect(missing('bindings')).toEqual(['registry.json carries no implementation bindings'])
    expect(missing('snapshots')).toEqual(['registry.json carries no snapshots'])
    expect(missing('blobs')).toEqual(['registry.json carries no files'])
  })

  /**
   * It says the path holds nothing, and stops there.
   *
   * It used to add *which is a defect in the archive rather than anything you did* - absolution this
   * tool cannot hand out, since a `rm` under `node_modules` produces exactly the state it is reading.
   * The header above says why this refusal is not filed in `WHAT_BREAKS`; that argument is ours and
   * belongs in a comment, not on the user's screen as a claim about their machine.
   */
  it('an-artefact-that-is-not-there-is-refused-with-the-sentence-a-user-can-act-on', () => {
    expect(() => readArtefact('nowhere/registry.json')).toThrow(
      /nowhere[/\\]registry\.json is not there, so this `toopo` has no catalogue to install from/,
    )
  })
})
