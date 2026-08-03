/**
 * What the user reads. The first surface of this product anybody will ever see.
 *
 * Three rules, and they are the whole file.
 *
 * **The cost is stated before the files are.** How many files, how many bytes, how deep - it is a
 * promise this project makes about what installing something costs, and a promise printed after the
 * list is a promise the reader has already stopped looking for.
 *
 * **Anything the installer did to a file is said on the line of that file.** A shared file written
 * once, an import repointed - both are things that happened to somebody's code, and a tool that
 * silently improved their code would be the tool permanent rule 4 exists to forbid.
 *
 * **A refusal says what was refused and that nothing was written.** The second half matters more than
 * it looks: the reader's next question is always whether their project is now half-changed.
 *
 * No colour, and it is not an omission. Colour needs either a dependency or an escape-code table of
 * our own, it is wrong in a pipe, wrong in a log and wrong for whoever cannot see it - and none of the
 * three lines above needs it to work.
 */

import { renderContract } from '../registry/address.js'
import type { Configuration } from './configuration.js'
import type { Installation } from './install.js'

/**
 * Bytes as a person reads them. Decimal thousands, because that is what a file manager shows and this
 * figure is a claim about size rather than about memory.
 */
export const readableBytes = (bytes: number): string =>
  bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} kB`

const INDENT = '  '

const paragraph = (text: string, width = 76): readonly string[] => {
  const lines: string[] = []
  let line = ''

  for (const word of text.split(/\s+/).filter((entry) => entry !== '')) {
    if (line === '') line = word
    else if (line.length + 1 + word.length <= width) line = `${line} ${word}`
    else {
      lines.push(line)
      line = word
    }
  }
  if (line !== '') lines.push(line)

  return lines
}

export const renderInit = (configuration: Configuration, existed: boolean): string =>
  [
    '',
    `${INDENT}toopo.json  ${existed ? 'updated' : 'written'}`,
    `${INDENT}features    ${configuration.directory}`,
    '',
    `${INDENT}Change the folder with  toopo init --dir <path>`,
    `${INDENT}Install something with  toopo add string/slugify`,
    '',
  ].join('\n')

export const renderInstallation = (
  installation: Installation,
  configuration: Configuration,
): string => {
  const { cost } = installation
  const notes = new Map<string, string>()
  for (const file of installation.shared) {
    notes.set(file.path, `shared with ${file.alsoCarriedBy.join(', ')}`)
  }
  for (const write of installation.writes) {
    if (write.repointed && !notes.has(write.path)) notes.set(write.path, 'import repointed')
  }

  // Wide enough to align the notes, and applied only to the lines that have one - a padded line with
  // nothing after it is trailing whitespace in the first output anybody sees.
  const width = Math.max(
    ...installation.writes
      .filter((write) => notes.has(write.path))
      .map((write) => `${configuration.directory}/${write.path}`.length),
    0,
  )

  return [
    '',
    `${INDENT}${renderContract(installation.contract)} · ` +
      `${installation.implementation.id}@${installation.implementation.version}`,
    '',
    ...paragraph(installation.summary).map((line) => `${INDENT}${line}`),
    '',
    `${INDENT}${cost.files} ${cost.files === 1 ? 'file' : 'files'} · ` +
      `${readableBytes(cost.bytes)} · depth ${cost.depth}`,
    '',
    ...installation.writes.map((write) => {
      const path = `${configuration.directory}/${write.path}`
      const note = notes.get(write.path)

      return note === undefined
        ? `${INDENT}  + ${path}`
        : `${INDENT}  + ${path.padEnd(width)}  ${note}`
    }),
    '',
    ...(installation.dependencies.length === 0
      ? []
      : [
          `${INDENT}  pulled in: ` +
            installation.dependencies.map((held) => renderContract(held.contract)).join(', '),
          '',
        ]),
    `${INDENT}Recorded in toopo.lock`,
    '',
  ].join('\n')
}

export const renderUnchanged = (what: string): string =>
  [
    '',
    `${INDENT}${what} is already installed, and every file is as it was written.`,
    '',
    `${INDENT}Nothing to do.`,
    '',
  ].join('\n')

export const renderRefusal = (faults: readonly string[]): string =>
  [
    '',
    `${INDENT}Refused, and nothing was written.`,
    '',
    ...faults.flatMap((fault) => [...paragraph(fault, 72).map((line) => `${INDENT}  ${line}`), '']),
  ].join('\n')

