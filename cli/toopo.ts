/**
 * The file you run in this repository.
 *
 *   node cli/toopo.ts init
 *   node cli/toopo.ts add string/slugify
 *
 * It names one registry - the serialisation of this working tree - and hands it to `command.ts`.
 * `published.ts` is the same three lines naming the other one, and the pair is the whole of what
 * separates a development `toopo` from an installed one. Which registry served an installation is
 * therefore a fact about which file was run, not something anything probes for at run time.
 *
 * Before that it does one thing about the runtime rather than about installing anything: node does not
 * remap the `.js` specifier this repository writes for a `.ts` file, so the resolve hook at the root is
 * registered first. `../typescript-imports.ts` says why it exists, why it is not the runtime
 * indirection permanent rule 1 forbids, and why it lives at the root rather than in this folder. It has
 * no counterpart in `published.ts`, which is compiled JavaScript importing JavaScript - the divergence
 * that file recorded as a debt is closed by the archive being built rather than stripped.
 *
 * The imports are `.ts` and dynamic on purpose: the translation cannot be used before it is registered.
 */

import '../typescript-imports.ts'

const { run } = await import('./command.ts')
const { localSource } = await import('./local-source.ts')

run(localSource)
