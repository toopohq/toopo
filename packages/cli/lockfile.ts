/**
 * `toopo.lock` - what was installed, and the one check that needs nothing from us.
 * ADR-0037 is what this file supports and what it cannot describe; ADR-0054 is why the version below
 * cannot go stale, which is the shape rather than a sentence asking somebody to remember.
 *
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
 *
 * ---------------------------------------------------------------------------
 * It records what was written, and never what was planned
 * ---------------------------------------------------------------------------
 *
 * Two claims about this file sound alike and only one of them is true. **It lets anybody check, with
 * nothing from us, that the bytes on disk are the bytes that were served** - the supply-chain argument
 * of the whole project, and it holds entirely. **It does not describe the installed graph**, and no
 * reasoning about what imports what may be built on it.
 *
 * That is its nature rather than a gap, and it is written here because the mistake is one anybody makes
 * on the way past: a shared file is written once and the other carrier is repointed at it, so the
 * second carrier's entry does not name the file it imports. `reconcile.ts` carries the measurement and
 * the consequence - it is why a removal has to re-plan the project rather than read this file, and why
 * recording the edges would not be enough either.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderContract } from '../registry/address.js'
import { digestOfBytes, servedBytes } from '../registry/canonical.js'
import type { InstalledFile, LockedFeature, Lockfile } from '../registry/implementation-record.js'
import { LOCKFILE_VERSION } from '../registry/implementation-record.js'

export const LOCKFILE = 'toopo.lock'

const isRecord = (value: unknown): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * One field of the shape, and what a reader is told when it is not there.
 *
 * The sentence is about the *feature* rather than about the field, because a person opening a
 * refusal wants to know which entry of their lockfile is unusable before they want to know which
 * key of it is.
 */
type Check = {
  readonly holds: (value: unknown) => boolean
  readonly missing: string
}

/**
 * Every field of `InstalledFile`, total by construction.
 *
 * `served` is checked here as a shape rather than delegated further: it is `HarnessFile`, which the
 * registry owns and this file does not get to redefine, so the check is one statement about the
 * three parts a comparison with the registry needs.
 */
const FILE_FIELDS_OF: Readonly<Record<keyof InstalledFile, Check>> = {
  path: { holds: (value) => typeof value === 'string', missing: 'has no path' },
  sha256: { holds: (value) => typeof value === 'string', missing: 'has no sha256' },
  bytes: { holds: (value) => typeof value === 'number', missing: 'has no byte count' },
  served: {
    holds: (value) =>
      isRecord(value) &&
      typeof value['path'] === 'string' &&
      typeof value['sha256'] === 'string' &&
      typeof value['bytes'] === 'number',
    missing: 'does not say what the registry served',
  },
}

/**
 * Every field of `LockedFeature`, total by construction.
 *
 * `files` is checked as a list here and its elements are checked by `FILE_FIELDS_OF` below. That is
 * the one place this record does not carry the whole answer, and it is said rather than glossed: what
 * the totality guarantees is that no field of the type goes *unconsidered*, not that every check is
 * written in one expression.
 */
const FIELDS_OF: Readonly<Record<keyof LockedFeature, Check>> = {
  contract: {
    holds: (value) =>
      isRecord(value) &&
      typeof value['language'] === 'string' &&
      typeof value['name'] === 'string' &&
      typeof value['major'] === 'number',
    missing: 'does not name a contract',
  },
  implementation: {
    holds: (value) =>
      isRecord(value) && typeof value['id'] === 'string' && typeof value['version'] === 'string',
    missing: 'does not name an implementation',
  },
  files: { holds: (value) => Array.isArray(value), missing: 'carries no file list' },
  installedAt: {
    holds: (value) => typeof value === 'string',
    missing: 'does not say when it was installed',
  },
  locallyModified: {
    holds: (value) => typeof value === 'boolean',
    missing: 'does not say whether it was edited',
  },
  askedFor: {
    holds: (value) => typeof value === 'boolean',
    missing: 'does not say whether it was asked for or pulled in',
  },
  servedFrom: {
    holds: (value) => typeof value === 'string',
    missing: 'does not say which revision of the registry served it',
  },
}

const faultsAgainst = (
  fields: Readonly<Record<string, Check>>,
  value: Readonly<Record<string, unknown>>,
  where: string,
): readonly string[] =>
  Object.entries(fields)
    .filter(([name, check]) => !check.holds(value[name]))
    .map(([, check]) => `${where} ${check.missing}`)

const featureFaults = (value: unknown, at: number): readonly string[] => {
  if (!isRecord(value)) return [`feature ${at} is not an object`]

  const contract = value['contract']
  const files = value['files']
  const where =
    isRecord(contract) && typeof contract['name'] === 'string' ? contract['name'] : `feature ${at}`

  return [
    ...faultsAgainst(FIELDS_OF, value, where),
    ...(Array.isArray(files)
      ? files.flatMap((file, index) =>
          isRecord(file)
            ? faultsAgainst(FILE_FIELDS_OF, file, `${where} file ${index}`)
            : [`${where} file ${index} is not an object`],
        )
      : []),
  ]
}

/** The contract names a lockfile of any version carries, for a refusal that can name them. */
const featureNamesIn = (value: Readonly<Record<string, unknown>>): readonly string[] => {
  const features = value['features']
  if (!Array.isArray(features)) return []

  return features.flatMap((feature: unknown) => {
    const contract = isRecord(feature) ? feature['contract'] : undefined

    return isRecord(contract) && typeof contract['name'] === 'string' ? [contract['name']] : []
  })
}

/**
 * What each shape this tool no longer reads was missing, and why it cannot be worked out.
 *
 * **Both entries are refusals rather than migrations, and both for the same reason: the missing field
 * is not derivable from what the file holds.** ADR-0073 carries the first - `askedFor` says which
 * features the user typed, and both ways of guessing it are wrong. ADR-0091 carries the second: the
 * revision that served an install is a fact about a moment that has passed, and the only values
 * available to invent are today's, which would record that an old install came from a registry state
 * it never saw. A lockfile whose whole value is that it can be checked against a published fact must
 * not be filled in with a plausible one.
 *
 * Data rather than a chain of `if`s, so that a fourth shape is a row here and the sentence around it
 * is written once.
 */
const WHAT_AN_OLDER_SHAPE_LACKED: Readonly<Record<number, string>> = {
  1: 'record which features you asked for and which arrived as dependencies, and that cannot be ' +
    'worked out from the file - guessing it would either move a dependency to a version nothing was ' +
    'published against, or drop something you had asked for',
  2: 'record which revision of the registry each feature was resolved against, and that cannot be ' +
    'worked out from the file - it is a fact about the moment the install happened, and stamping ' +
    "today's revision on it would record that an old install came from a state it never saw",
}

/**
 * Why a lockfile written under an older version cannot be read, and what to do about it.
 *
 * **What makes the refusal usable is that `toopo add` recognises a file whose bytes are already the
 * ones it would write.** Re-adding a feature therefore writes nothing, keeps every file exactly where
 * it is, and records the one fact that was missing. Without that the only way out would be deleting
 * the folder, which would destroy files that were perfectly good.
 */
const migrationFaults = (
  version: unknown,
  value: Readonly<Record<string, unknown>>,
): readonly string[] => {
  const lacked = typeof version === 'number' ? WHAT_AN_OLDER_SHAPE_LACKED[version] : undefined

  if (lacked === undefined) {
    return [
      `${LOCKFILE} carries version ${JSON.stringify(version)}, and this \`toopo\` reads version ` +
        `${LOCKFILE_VERSION}`,
    ]
  }

  const names = featureNamesIn(value)

  // *Was written by an earlier `toopo`* names an author where a version number was read. The number
  // is the fact, it is what decides the refusal, and it is what the reader can check.
  return [
    `${LOCKFILE} carries version ${version}. That version did not ${lacked}.`,
    `Delete ${LOCKFILE} and add back the features you want, by name. Nothing on disk is rewritten: ` +
      `a file whose bytes are already the ones toopo would write is recognised and recorded rather ` +
      `than replaced.` +
      (names.length === 0 ? '' : `\n${names.map((name) => `  toopo add ${name}`).join('\n')}`),
  ]
}

/**
 * Why this is not a lockfile this `toopo` can act on. Empty when it is.
 *
 * Validated in full rather than trusted, because it is a file on the user's disk that anything may have
 * written - a merge, an editor, a hand. An installer that read a malformed entry as an absent one would
 * decide a file it did not write was safe to overwrite, which is exactly the decision permanent rule 4
 * exists to prevent.
 *
 * A version this `toopo` does not read is answered *instead of* the field checks rather than beside
 * them: the fields of another version are another version's business, and reporting them would bury
 * the one sentence that says what to do under a list about a shape nobody is being asked to fix.
 */
export const lockfileFaults = (value: unknown): readonly string[] => {
  if (!isRecord(value)) return [`${LOCKFILE} does not hold an object`]

  if (value['version'] !== LOCKFILE_VERSION) return migrationFaults(value['version'], value)

  const features = value['features']

  return Array.isArray(features)
    ? features.flatMap(featureFaults)
    : [`${LOCKFILE} carries no feature list`]
}

export class UnusableLockfile extends Error {
  constructor(faults: readonly string[]) {
    // Not indented here: `renderRefusal` lays a fault out and preserves whatever indentation the
    // fault itself carries, so indenting again would indent twice and would bury the one line of
    // this message a reader is meant to copy.
    super(
      `${LOCKFILE} cannot be read, so nothing can be established about what is already installed:\n` +
        faults.join('\n'),
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

  return {
    version: LOCKFILE_VERSION,
    features: [...others, kept].sort((a, b) =>
      renderContract(a.contract) < renderContract(b.contract) ? -1 : 1,
    ),
  }
}

/** What a file on disk hashes to under the served form, or `null` when it is not there. */
export const digestOnDisk = (root: string, directory: string, path: string): string | null => {
  const full = join(root, directory, path)
  if (!existsSync(full)) return null

  return digestOfBytes(servedBytes(readFileSync(full)))
}
