import { defineConfig } from 'vitest/config'

/**
 * `npm run site` means the generator's own guards, and nothing else.
 *
 * The reasons `packages/registry/vitest.config.ts` records apply here unchanged: a guard collected by
 * `npm test` enters every cell of every contract battery, and a type error anywhere in the root
 * `tsconfig.json`'s `include` makes `npm test` exit non-zero with no failed guard, which the
 * instrument reads as every cell killed by typecheck.
 *
 * This folder adds one of its own: the guards here serialise all five contracts, which reads
 * thirty-seven files and would be paid once per injected defect on every battery in the repository.
 *
 * Nothing here writes a file. The pages are built in memory and compared in memory - `build.ts` is the
 * only thing that writes, and it is not a guard. That is deliberate rather than incidental: what the
 * generator decides has to be reachable without a working directory, for the reason `packages/cli/command.ts`
 * already states about the installer.
 */
export default defineConfig({
  // Anchored on this file's own directory rather than left to the working directory, because the
  // script is typed from anywhere.
  root: import.meta.dirname,
  test: {
    include: ['*.test.ts'],
    /**
     * The files of this suite that run against a document say so themselves.
     *
     * `start.test.ts`, `components.test.ts` and `painting.test.ts` open with
     * `@vitest-environment happy-dom`; every other file here is node, which is what keeps the cost to
     * the guards that need it. **This paragraph read *one file* while two carried the line**, which is
     * ADR-0195's class on the comment of the setting the third one made false. What cannot be declared
     * in a file is the setting below - measured at `2ae8b50`, an `@vitest-environment-options` comment
     * is not read by vitest 4.1.10 and the option never reaches the window.
     *
     * A served contract page carries `<script type="module" src="…/start.js">`, which is how a browser
     * runs the very module the guards drive themselves. happy-dom will not fetch it, correctly, and
     * announces that as an error on every page it parses. Treating the refusal as a load makes it
     * silent - and silence is what a suite the instrument reads has to have, because a line of noise
     * per guard is indistinguishable from a line of noise that means something. ADR-0165.
     */
    environmentOptions: { happyDOM: { settings: { handleDisabledFileLoadingAsSuccess: true } } },
  },
})
