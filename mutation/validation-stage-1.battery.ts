/**
 * The battery over the validation pipeline's first stage.
 *
 * **This is the guard that this repository's own security filter was, until now, without.** Stage 1
 * decides what may enter the catalogue at all, and it was written across two units with a suite that
 * had never been shown able to fail. That is exactly the state this instrument exists to leave, and
 * on the one mechanism the whole supply-chain argument rests on it is the least defensible place to
 * be in.
 *
 * It injects into `validation/` and collects under that folder's own configuration, for the reason
 * `registry-storage` already records: a pipeline guard collected by `npm test` would redden under a
 * specification mutant and be counted as a contract catching it. `census.ts` had no entry for that
 * configuration when this battery was written, and refused to run at all until one was counted -
 * which is what that refusal was added for, firing on the first unit to reach it.
 *
 * One arm and one lens. The two fallible contracts carry a second arm because an error convention was
 * under measurement there; nothing here has a convention to compare, and a second lens would be a
 * question nobody is asking yet.
 *
 * **What the mutants are aimed at is the shape of the filter rather than its wording.** Each one
 * removes a decision: a rule that stops reading one of the six ways to name a module, a permitted list
 * that admits `globalThis`, a binder answering the same thing for every name in both directions, the
 * unwrapping that made a cast stop hiding a call. S-05 is the one worth naming twice - it makes every
 * identifier free, so a filter that refused the catalogue it protects is what it measures, and the
 * five reference implementations are what redden.
 */

import type { Battery, Mutant } from './run.ts'
import type { ArmUnderTest } from './mutants.ts'
import { killed, mutantsOn } from './mutants.ts'

const UNDER: ArmUnderTest = { arm: 'V', asCommitted: 'as-committed', blinded: [] }

const { sameOnEveryLens } = mutantsOn(UNDER)

const constructsFile = (find: string, replace: string) => ({
  file: 'forbidden-constructs.ts',
  find,
  replace,
})
const sourceFile = (find: string, replace: string) => ({ file: 'source.ts', find, replace })
const analyseFile = (find: string, replace: string) => ({ file: 'analyse.ts', find, replace })
const apiFile = (find: string, replace: string) => ({ file: 'typescript-api.ts', find, replace })

// ---------------------------------------------------------------------------
// Anchors - the exact source each edit rewrites
// ---------------------------------------------------------------------------

const ONLY_A_RELATIVE_PATH = `const isRelative = (specifier: string): boolean =>
  specifier.startsWith('./') || specifier.startsWith('../')`

const READ_AN_IMPORT_EQUALS = `  if (isImportEqualsDeclaration(node)) {
    const reference = node.moduleReference
    return isExternalModuleReference(reference) && isStringLiteral(reference.expression)
      ? { text: reference.expression.text, at: reference.expression }
      : null
  }

`

const THE_VALUE_PROPERTIES = `    names: ['undefined', 'NaN', 'Infinity'],`

const RANDOM_IS_FORBIDDEN =
  `  { holder: 'Math', member: 'random', reaches: 'the entropy source, so a call is not deterministic' },
`

const A_SHORTHAND_IS_A_READ = `  if (isShorthandPropertyAssignment(parent) && parent.name === node) return true

  if (isPropertyAccessExpression(parent) && parent.name === node) return false`

const A_TYPE_IS_ERASED = `    if (!isIdentifier(node) || !isReadAsAValue(node) || inATypePosition(node)) return []`

const WRAPPERS_ARE_SKIPPED = 'const under = (node: Node): Node => skipOuterExpressions(node)'

const A_FORBIDDEN_METHOD_IS_NAMED_EXACTLY =
  '    if (called === null || !forbidden.has(called.member)) return []'

const THE_FUNCTION_CONSTRUCTOR = `      isEvaluator(node.expression, 'Function')`

const WHERE_A_NAME_IS_BOUND = `  return brought ? 'the-submission' : 'free'`

const A_MISSING_FILE_IS_REFUSED = `    if (missing.length > 0) {
      throw new UnreadableSource(project, missing)
    }`

const WALK_EVERY_CHILD = '  for (const child of children) yield* everyNode(child)'

const A_POSITION_NAMES_A_FILE = '  return `${source.path}:${line + 1}`'

const THE_REQUIREMENTS_ARE_APPLIED = `  ...requirements.flatMap((requirement) =>
    contractForbiddenMethods(source, requirement.forbiddenMethods, requirement.reason),
  ),
`

const THE_TYPE_NODE_PREDICATE = '  isTypeNode: ast.isTypeNode,'

// ---------------------------------------------------------------------------
// The defects
// ---------------------------------------------------------------------------

const mutants: readonly Mutant[] = [
  sameOnEveryLens(
    'S-01',
    'accepts every module specifier, so a submission may import anything the machine can resolve - ' +
      'the failure permanent rules 1 and 2 both exist to prevent',
    [
      constructsFile(
        ONLY_A_RELATIVE_PATH,
        `const isRelative = (specifier: string): boolean => {
  void specifier

  return true
}`,
      ),
    ],
    killed(),
  ),

  sameOnEveryLens(
    'S-02',
    'stops reading one of the six ways a module can be named, so `import legacy = require(\'node:path\')` ' +
      'passes a rule that refuses the other five',
    [constructsFile(READ_AN_IMPORT_EQUALS, '')],
    killed(),
  ),

  sameOnEveryLens(
    'S-03',
    'recognises a contract module only when it is named without an extension, so the import a ' +
      'submission actually writes - `./contract.js` - neutralises its own signature check unseen',
    [
      {
        file: 'states-its-own-signature.ts',
        find: '  return last === CONTRACT_MODULE || last.startsWith(`${CONTRACT_MODULE}.`)',
        replace: '  return last === CONTRACT_MODULE',
      },
    ],
    killed(),
  ),

  sameOnEveryLens(
    'S-04',
    'answers that every name is bound in the submission, so no identifier is ever free and the ' +
      'permitted list decides nothing at all',
    [sourceFile(WHERE_A_NAME_IS_BOUND, `  void brought

  return 'the-submission'`)],
    killed(),
  ),

  sameOnEveryLens(
    'S-05',
    'answers that every name is free, which is the filter refusing the catalogue it protects: every ' +
      'local and every parameter of the five references becomes a reach',
    [sourceFile(WHERE_A_NAME_IS_BOUND, `  void brought

  return 'free'`)],
    killed(),
  ),

  sameOnEveryLens(
    'S-06',
    'admits `globalThis` into the permitted list, so the one name that reaches all of global state ' +
      'is read as a language API',
    [constructsFile(THE_VALUE_PROPERTIES, `    names: ['undefined', 'NaN', 'Infinity', 'globalThis'],`)],
    killed(),
  ),

  sameOnEveryLens(
    'S-07',
    'refuses names in type position as well, which buys nothing and refuses every library type a ' +
      'submission mentions',
    [
      constructsFile(
        A_TYPE_IS_ERASED,
        '    if (!isIdentifier(node) || !isReadAsAValue(node)) return []',
      ),
    ],
    killed(),
  ),

  sameOnEveryLens(
    'S-08',
    'stops reading a shorthand property as a value, so `{ fetch }` is a declaration and the global ' +
      'beside it is not seen',
    [
      constructsFile(
        A_SHORTHAND_IS_A_READ,
        '  if (isPropertyAccessExpression(parent) && parent.name === node) return false',
      ),
    ],
    killed(),
  ),

  sameOnEveryLens(
    'S-09',
    'drops `Math.random` from the members that turn a permitted holder impure, so the entropy source ' +
      'is reached through an object the rule admits',
    [constructsFile(RANDOM_IS_FORBIDDEN, '')],
    killed(),
  ),

  sameOnEveryLens(
    'S-10',
    'stops reading the `Function` constructor as a construction, leaving `builds-no-code-at-run-time` ' +
      'naming three ways of building code where it claims four',
    [constructsFile(THE_FUNCTION_CONSTRUCTOR, `      isEvaluator(node.expression, 'NotTheConstructor')`)],
    killed(),
  ),

  sameOnEveryLens(
    'S-11',
    'stops unwrapping parentheses and casts, so a forbidden method behind an `as` is unreachable ' +
      'again - the evasion this rule was measured closing',
    [constructsFile(WRAPPERS_ARE_SKIPPED, 'const under = (node: Node): Node => node')],
    killed(),
  ),

  sameOnEveryLens(
    'S-12',
    'matches a forbidden method by substring rather than by name, so the `getUTC*` family a contract ' +
      'requires its implementations to use is refused along with the family it forbids',
    [
      constructsFile(
        A_FORBIDDEN_METHOD_IS_NAMED_EXACTLY,
        `    const forbiddenBySubstring = [...forbidden].some((name) =>
      called !== null && called.member.includes(name.slice(3)),
    )
    if (called === null || !forbiddenBySubstring) return []`,
      ),
    ],
    killed(),
  ),

  sameOnEveryLens(
    'S-13',
    'stops applying the requirements a contract publishes, so `staticAnalysisRequirements` goes back ' +
      'to being a declaration nothing keeps - the debt this unit closed',
    [analyseFile(THE_REQUIREMENTS_ARE_APPLIED, '')],
    // The guard `date/add@1`'s record cites as what makes `staticAnalysisRequirements` executable. A
    // stratum that named a guard no mutant reddens would be the same claim one level up.
    killed(['an-implementation-that-calls-a-forbidden-method-is-refused']),
  ),

  sameOnEveryLens(
    'S-14',
    'answers an empty analysis for a file the program does not hold, so a submission passes every ' +
      'rule by not being read',
    [sourceFile(A_MISSING_FILE_IS_REFUSED, '    void missing')],
    killed(),
  ),

  sameOnEveryLens(
    'S-15',
    'stops walking past the file itself, so every rule reads one node and finds nothing - the ' +
      'failure that looks exactly like a clean submission',
    [sourceFile(WALK_EVERY_CHILD, '  void children')],
    killed(),
  ),

  sameOnEveryLens(
    'S-16',
    'drops the file from a refusal, leaving a position a submitter cannot open',
    [sourceFile(A_POSITION_NAMES_A_FILE, '  return `${line + 1}`')],
    killed(),
  ),

  sameOnEveryLens(
    'S-17',
    'takes a predicate out of the declared TypeScript surface, which is the package moving under the ' +
      'analyser rather than a defect anybody wrote',
    [
      apiFile(
        THE_TYPE_NODE_PREDICATE,
        '  isTypeNode: undefined as unknown as typeof ast.isTypeNode,',
      ),
    ],
    killed(),
  ),
]

export const battery: Battery = {
  name: 'validation-stage-1',
  contractPath: 'validation',
  vitestConfig: 'validation/vitest.config.ts',
  timeZone: 'UTC',
  calibrationMutant: 'S-01',

  arms: [
    {
      id: 'V',
      ref: 'HEAD',
      convention: 'stage 1 as committed: the reader, the four rules and the permitted-name list',
    },
  ],

  lenses: [
    { id: 'as-committed', description: 'the arm exactly as its commit left it', arms: ['V'], edits: [] },
  ],

  unreachableGuards: [],

  unprobedRegions: [],

  mutants,
}
