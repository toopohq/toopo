/**
 * `toopo list` - what this project holds, answered by the project and by nothing else.
 *
 * It is the mirror of `search`, and the pair is worth naming: `search` is the only command that reads
 * no project, and this is the only one that reads no registry. Between them they answer the two
 * questions somebody has before they have anything else - *what is there* and *what have I got* - and
 * neither can be blocked by the other side being unavailable.
 *
 * **It existed as a gap rather than as an idea.** Before this, the only way to see what was installed
 * was to open `toopo.lock`, and `toopo update` on a project with nothing to do answered *Nothing to do*
 * without naming a single feature. A lockfile is readable, and a tool whose answer to "what have I
 * installed" is "open this file yourself" has decided that its own record is the interface.
 *
 * ---------------------------------------------------------------------------
 * The disk is asked rather than the record, and that is the whole reason it is useful
 * ---------------------------------------------------------------------------
 *
 * `LockedFeature.locallyModified` is a field the lockfile carries, and reading it would be reading what
 * was true when the last command ran. Every file is hashed here instead, against the `sha256` the
 * lockfile recorded - the offline half of the two digests, which exists for exactly this - so an edit
 * made a minute ago is visible and a file somebody deleted is named as missing rather than counted as
 * present. It costs one read per installed file and it is the difference between a report about the
 * project and a report about our own bookkeeping.
 */

import type { ContractAddress } from '../registry/address.js'
import type { LockedFeature, Lockfile } from '../registry/implementation-record.js'
import type { Configuration } from './configuration.js'
import { digestOnDisk } from './lockfile.js'

/** What a file on disk turned out to be, against what the lockfile says was written there. */
export type FileStanding = 'as-written' | 'edited' | 'missing'

export type ListedFile = {
  /** Relative to the configured directory, with forward slashes. */
  readonly path: string
  readonly bytes: number
  readonly standing: FileStanding
}

export type ListedFeature = {
  readonly contract: ContractAddress
  readonly implementation: { readonly id: string; readonly version: string }
  /** True when the user typed this feature's name, false when it arrived through an edge. */
  readonly askedFor: boolean
  readonly installedAt: string
  readonly files: readonly ListedFile[]
}

export type Listing = {
  readonly features: readonly ListedFeature[]
  readonly files: number
  readonly bytes: number
}

const standingOf = (
  root: string,
  configuration: Configuration,
  file: LockedFeature['files'][number],
): FileStanding => {
  const onDisk = digestOnDisk(root, configuration.directory, file.path)

  if (onDisk === null) return 'missing'

  return onDisk === file.sha256 ? 'as-written' : 'edited'
}

/**
 * Everything the project holds, in the order the lockfile keeps - which is by rendered address, so two
 * runs answer alike and a person looking for a name reads down one column.
 */
export const listProject = (
  root: string,
  configuration: Configuration,
  lockfile: Lockfile,
): Listing => {
  const features = lockfile.features.map((feature) => ({
    contract: feature.contract,
    implementation: feature.implementation,
    askedFor: feature.askedFor,
    installedAt: feature.installedAt,
    files: feature.files.map((file) => ({
      path: file.path,
      bytes: file.bytes,
      standing: standingOf(root, configuration, file),
    })),
  }))

  const files = features.flatMap((feature) => feature.files)

  return {
    features,
    files: files.length,
    bytes: files.reduce((total, file) => total + file.bytes, 0),
  }
}
