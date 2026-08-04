/**
 * The file you run.
 *
 *   node cli/toopo.ts init
 *   node cli/toopo.ts add string/slugify
 *
 * It does one thing before handing over to `command.ts`, and that one thing is about the runtime
 * rather than about installing anything: node does not remap the `.js` specifier this repository
 * writes for a `.ts` file, so the resolve hook at the root is registered first.
 * `../typescript-imports.ts` says why it exists, why it is not the runtime indirection permanent rule
 * 1 forbids, and why it lives at the root rather than in this folder.
 *
 * Both imports are `.ts` on purpose: the translation cannot be used before it is registered.
 */

import '../typescript-imports.ts'

await import('./command.ts')
