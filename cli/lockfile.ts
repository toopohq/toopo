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

export const writeLockfile = (root: string, lockfile: Lockfile): void => {
  writeFileSync(join(root, LOCKFILE), `${JSON.stringify(lockfile, null, 2)}\n`, 'utf8')
}

/** The lockfile with this feature in it, replacing any earlier install of the same contract. */
export const withFeature = (lockfile: Lockfile, feature: LockedFeature): Lockfile => {
  const what = renderContract(feature.contract)
  const others = lockfile.features.filter((held) => renderContract(held.contract) !== what)

  return { version: 1, features: [...others, feature].sort((a, b) =>
    renderContract(a.contract) < renderContract(b.contract) ? -1 : 1,
  ) }
}

/** What a file on disk hashes to under the served form, or `null` when it is not there. */
export const digestOnDisk = (root: string, directory: string, path: string): string | null => {
  const full = join(root, directory, path)
  if (!existsSync(full)) return null

  return digestOfBytes(servedBytes(readFileSync(full)))
}

/**
 * The files of this feature that no longer hash to what was written, and the ones that are gone.
 *
 * The whole value of this answer is that it needs nothing from the registry: the lockfile holds the
 * digest of what was written, the file on disk hashes to something, and a difference is a local
 * modification whether or not anything is reachable and whether or not it is honest.
 */
export const modifiedFiles = (
  root: string,
  directory: string,
  feature: LockedFeature,
): readonly string[] =>
  feature.files
    .filter((file) => digestOnDisk(root, directory, file.path) !== file.sha256)
    .map((file) => file.path)
