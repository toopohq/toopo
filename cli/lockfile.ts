/**
 * `toopo.lock` - what was installed, and the one check that needs nothing from us.
 *
 * The shape is the registry's `Lockfile`, imported rather than restated. Every part of it is already an
 * address or a digest the registry holds, which is what stops the installer from inventing a second
 * vocabulary and stops the two from drifting the first time either changes.
 *
 * **The comparison is over normalised bytes and never over the bytes on disk.** The registry serves
 * UTF-8 with LF and no byte-order mark; a user whose git rewrites checkouts to CRLF would otherwise see
 * every installed file differ from the digest recorded here, and `locallyModified` would be true for a
 * whole operating system without anybody having touched anything. `canonical.ts` imposed that on this
 * unit in writing before this unit existed; `servedBytes` is where it is honoured.
 *
 * It is plain JSON with no tagged encoding, deliberately. A person opens this file to decide whether to
 * accept a diff, and a lockfile that needed decoding to be read would be a lockfile nobody reads.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { LockedFeature, Lockfile } from '../registry/implementation-record.js'

export const LOCKFILE = 'toopo.lock'

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const fileFaults = (value: unknown, where: string): readonly string[] => {
  if (!isRecord(value)) return [`${where} is not an object`]

  const served = value['served']

  return [
    ...(typeof value['path'] === 'string' ? [] : [`${where} has no path`]),
    ...(typeof value['sha256'] === 'string' ? [] : [`${where} has no sha256`]),
    ...(typeof value['bytes'] === 'number' ? [] : [`${where} has no byte count`]),
    ...(isRecord(served) &&
    typeof served['path'] === 'string' &&
    typeof served['sha256'] === 'string' &&
    typeof served['bytes'] === 'number'
      ? []
      : [`${where} does not say what the registry served`]),
  ]
}

const featureFaults = (value: unknown, at: number): readonly string[] => {
  if (!isRecord(value)) return [`feature ${at} is not an object`]

  const contract = value['contract']
  const implementation = value['implementation']
  const files = value['files']
  const where = isRecord(contract) && typeof contract['name'] === 'string' ? contract['name'] : `feature ${at}`

  return [
    ...(isRecord(contract) &&
    typeof contract['language'] === 'string' &&
    typeof contract['name'] === 'string' &&
    typeof contract['major'] === 'number'
      ? []
      : [`${where} does not name a contract`]),
    ...(isRecord(implementation) &&
    typeof implementation['id'] === 'string' &&
    typeof implementation['version'] === 'string'
      ? []
      : [`${where} does not name an implementation`]),
    ...(typeof value['installedAt'] === 'string' ? [] : [`${where} does not say when it was installed`]),
    ...(typeof value['locallyModified'] === 'boolean'
      ? []
      : [`${where} does not say whether it was edited`]),
    ...(typeof value['askedFor'] === 'boolean'
      ? []
      : [`${where} does not say whether it was asked for or pulled in`]),
    ...(Array.isArray(files)
      ? files.flatMap((file, index) => fileFaults(file, `${where} file ${index}`))
      : [`${where} carries no file list`]),
  ]
}

/**
 * Why this is not a lockfile this `toopo` can act on. Empty when it is.
 *
 * Validated in full rather than trusted, because it is a file on the user's disk that anything may have
 * written - a merge, an editor, a hand. An installer that read a malformed entry as an absent one would
 * decide a file it did not write was safe to overwrite, which is exactly the decision permanent rule 4
 * exists to prevent.
 */
export const lockfileFaults = (value: unknown): readonly string[] => {
  if (!isRecord(value)) return [`${LOCKFILE} does not hold an object`]

  const features = value['features']

  return [
    ...(value['version'] === 1
      ? []
      : [`${LOCKFILE} carries version ${JSON.stringify(value['version'])}, and this \`toopo\` writes version 1`]),
    ...(Array.isArray(features)
      ? features.flatMap(featureFaults)
      : [`${LOCKFILE} carries no feature list`]),
  ]
}

export class UnusableLockfile extends Error {
  constructor(faults: readonly string[]) {
    super(
      `${LOCKFILE} cannot be read, so nothing can be established about what is already installed:\n` +
        faults.map((fault) => `  ${fault}`).join('\n'),
    )
    this.name = 'UnusableLockfile'
  }
}

export const readLockfile = (root: string): Lockfile | null => {
  const path = join(root, LOCKFILE)
  if (!existsSync(path)) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    throw new UnusableLockfile([`${LOCKFILE} is not JSON`])
  }

  const faults = lockfileFaults(parsed)
  if (faults.length > 0) throw new UnusableLockfile(faults)

  return parsed as Lockfile
}

/**
 * Written with a trailing newline, because it is a file a person opens.
 *
 * `to` is where the bytes go, and it defaults to the lockfile's own place. It is a parameter because
 * `write.ts` stages every file it commits under a temporary name first, and a lockfile that could only
 * be written in place would be the one file of a commit that had no staged form - which is to say the
 * one file whose write could still be half-done.
 */
export const writeLockfile = (root: string, lockfile: Lockfile, to = join(root, LOCKFILE)): void => {
  writeFileSync(to, `${JSON.stringify(lockfile, null, 2)}\n`, 'utf8')
}

/**
 * The lockfile with this feature in it, replacing any earlier install of the same contract.
 *
 * **`askedFor` is the one field that survives the replacement**, and it survives towards true. A
 * feature that was pulled in as a dependency and is later installed by name becomes a root; one that
 * was installed by name and later arrives as somebody else's dependency stays a root, because the user
 * asked for it and an upstream graph gaining an edge does not unask it. Everything else about the
 * entry is what was just installed and replaces what was there.
 */
export const withFeature = (lockfile: Lockfile, feature: LockedFeature): Lockfile => {
  const what = renderContract(feature.contract)
  const held = lockfile.features.find((entry) => renderContract(entry.contract) === what)
  const others = lockfile.features.filter((entry) => renderContract(entry.contract) !== what)
  const kept: LockedFeature = {
    ...feature,
    askedFor: feature.askedFor || (held?.askedFor ?? false),
  }

  return { version: 1, features: [...others, kept].sort((a, b) =>
    renderContract(a.contract) < renderContract(b.contract) ? -1 : 1,
  ) }
}

/** What a file on disk hashes to under the served form, or `null` when it is not there. */
export const digestOnDisk = (root: string, directory: string, path: string): string | null => {
  const full = join(root, directory, path)
  if (!existsSync(full)) return null

  return digestOfBytes(servedBytes(readFileSync(full)))
}
