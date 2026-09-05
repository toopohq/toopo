# Toopo

A registry of utility functions verified against public, executable contracts, distributed as
source code copied into the user's codebase.

A **contract** is the complete, executable behavioural specification of one function: identity,
TypeScript signature, property-based invariants, named and settled edge cases, and benchmark
profiles. The contract is owned by the registry; implementations compete underneath it and are
interchangeable.

The product of this project is the contract, not the utility code. **If the verification is
decorative, the project has no reason to exist.** That sentence is the acceptance criterion for
every change made here.

## Where the project is

**What exists.** The registry's data schema, its immutable storage and its read API, where every named
answer declares the revision that produced it. Stage 1 of the validation pipeline, and the conformance
controller beside it. The client, finished at six commands — `init`, `add`, `update`, `remove`,
`search`, `list` — with a two-phase write, a lockfile carrying two digests per file and the revision
each feature was resolved against, and a port whose four implementations are asynchronous. The
generator, seven static pages — a shelf and one per installable contract — six of them with a
playground that runs this repository's own modules with their types removed. The archive: compiled JavaScript and nothing else, whose size is no longer a
function of how many contracts exist. The emitted tree, which is every answer the read API can give,
written as files at the addresses a client asks. The instrument: a battery per folder anything injects into, their pinned
verdicts, one command that replays them, and two gates that replay them without being asked - the
batteries a push can be answered by on every push, and all of them before anything reaches npm. And permanent rule 6, executable: a binding records the
commit it was published from, and the frozen half is rebuilt at that commit and compared rather than
transcribed anywhere. What this repository says about its own history now resolves against what git
holds rather than against what somebody checked: a commit identifier in the prose names a commit of
this graph, no object of it carries an address the project refuses to publish, and the only checkout
registered here is its root.

**The outgoing path was reviewed against a threat model committed before the first reading, and what
it found is repaired and published.** `toopo@1.1.1`. Every destination this client writes, reads or
removes is composed by one function: six places joined the project root, the configured directory and a
path that arrived from somewhere else - a served answer, or a `toopo.lock` a repository carries - and
none of them asked anything of the third part. **The digest chain could not reach it and never could**:
a path is a field *inside* the content a digest attests, so an answer naming any path passes every check
there is. `diskStanding` closed replacing a file that exists; creating one that does not was open.

**The model was committed at `9942756` before a line of `packages/cli/` was read**, declaring the
hostile set, the trusted set, the out-of-scope set, what counts as a finding and - the half that makes a
negative believable - that a class is answered negatively only by naming the code that refuses it.
**Nothing about the population was believed**: a walk from the published entry point reaches 40 modules
where the brief named seven, correcting it in both directions.

**The end-to-end probe inverted the prediction and the second one decided the severity.** A hostile
registry drove the real client over a real socket: the install *refused*, exit 1, and left a 3 332-byte
file outside the project anyway, because `rewrite.ts` stages before any install decision and its
`finally` removes the directory it made rather than what escaped it. Then a `toopo.lock` of the shape a
cloned repository carries, with no network at all: **exit 0, the success screen, `1 file moved`** - a
file of the user's read, written elsewhere, and the original removed.

**Three things the measurement caught that reading did not, and one of them is the lesson.** Comparing
against a resolved base accepts a linked directory, which a junction proved. A guard refused the first
shape for asking the alphabet of the configured directory as well as of the path. And **the first
refusal could answer nothing** - written as the faults *about* a path it re-derived the verdict, so a
path refused for its directory came back silent: a silent confinement, committed inside the repair that
exists to prevent one.

**What the release cost is a finding of its own.** Ten new guards move `mutation/census.ts` and owe
every battery that collects them an answer, and **no suite reads either**: `pnpm run cli` was green on
191 tests while nine CI jobs stopped at calibration, and repairing the first mechanism revealed the
second because it had hidden it. Four replays of `cli-install` were needed for one correct pin, each
refusing something different and not one found by reading a diff. The local calibration reproduces a
runner's refusal line for line in **twenty seconds** against an hour of CI. ADR-0206.

**And a project this tool installs into is now a project it reads its own configuration for, which took
three repairs where the list had recorded one.** `breakage.ts` declared that a folder with a space
installs normally and `configurationFaults` refused that same folder, so the two halves contradicted
each other inside one package. **The reason for leaving it open was refuted by measuring it**: the claim
was that a space at either edge of a segment is lost or refused depending on the platform, and over nine
spellings at `a2495c3` — NTFS under node v24.15.0, ext4 under v24.20.0 — **nine of nine come back under
the name they were asked for on both**, `under` composes the place that was asked for, and
`git check-ignore -q --` answers normally. **The reading that cuts the other way is that
`staysInside('src/code./toopo')` is true today**, so a rule about where a character sits would have been
narrower than the published alphabet for a hazard neither platform shows. So the directory has an
alphabet of its own, `A_PATH_INSIDE` and a space, and **the confinement did not move**: `staysInside`
has five callers and only the configuration's changed, which is the one not on the path from a served
string to the filesystem. **Reading the entry found two defects sharper than the one it named.**
`toopo init --dir` copied what was typed into a committed file unexamined — `C:\toopo`, `../outside`
and `src/my code/toopo` each exit **0**, leave a `toopo.json` on disk and are refused by every command
after them, one of them naming a folder *above* the project, written by the tool whose whole rule is
that it writes inside it. And the refusal was **false of the string it was shown for**: `src/my
code/toopo` is a relative path, inside the project, written with forward slashes, which is the whole of
what the sentence named. It names its cause now, in five arms ordered so each is true of what it
accompanies. **Four cells were written from four readings rather than the readings being thrown away** —
each new guard was seen red *alone* on the whole suite before it was written down — and `C-30`'s pin
went from one guard to three, re-measured rather than re-reasoned. **What it does not buy is stated
rather than smoothed**: nothing outside ASCII is admitted, and that is an absence with a date on it
rather than a decision, because macOS normalises a name to NFD where Linux keeps its bytes and no macOS
reading was taken. ADR-0208.

**The instrument reports a red no pin claimed, which is the mirror of the silence it already refused,
and the shape was chosen on a measurement rather than on the sentence that proposed it.** A pin is
verified as a *subset* - every guard it names must have reddened, and never the reverse - so a cell
reddening beyond its pin agrees with its battery and exits 0. That is how one guard crossing a timeout
under load rewrote ADR-0204's census with every gate green, and a person with an argument from
causality is what caught it. **The reading the brief proposed was over guards and is measurably blind
to that case**: `the-served-bytes-are-the-committed-bytes` is named by `I-65`'s pin, so it is
accounted for and `I-38` reports nothing - and 46 of the 47 guards it does report reddened only on
cells above the line, where ADR-0076 says a pin names the exercised guards and deliberately not the
rest. **A pin is a per-cell object and the convention is a per-cell rule**, so the reading is per cell
and stops at that line: 634 becomes **155 cells**, and `I-38` is among the 13 in its folder.
**It reports and refuses nothing**, because an unclaimed red is a load flake or a detection nobody
pinned and one run separates neither - so refusing would redden twenty-one of twenty-three batteries
on a debt. There is no threshold and its absence is the decision: the count is zero when every pin at
or below the line names its reds. **The other half of the arbitration is held by the shape** -
`disagreementsIn` takes columns where the reading takes cells, so refusing would need a second
argument and does not compile. Demonstrated deterministically rather than waited for: a throwaway
battery drops one name from `S-03`'s pin, the report prints *every cell agrees*, the attribution
prints *every guard is witnessed or accounted for*, the process exits **0**, and the new line goes
**3 to 4**. ADR-0205.

**And the bound that let one in is measured, in the condition a cell really runs.**
`packages/registry` declared no `testTimeout`, so it ran at vitest's 5 000 ms default. The file alone
takes 1 124 ms; the same guard inside the whole folder under `--typecheck` takes **2 820 ms**, which
is **56 % of the default on an idle machine** - so the file-alone reading understated it by a factor
of two and a half. Across four load levels at `d9f62b8`: idle 2 672/2 818/2 820 green, four
concurrent processes 3 403/3 450/3 636 green, eight **4 971/4 993/5 606 with one red of three**,
sixteen on sixteen logical cores **12 514/12 664/13 670/15 015, red every time** - and at saturation
**six guards of four files** redden, not one. The bound is **60 060 ms**, four times the worst
reading, **and the base is measured where the multiple is a convention** said out loud so the number
does not read as derived; it carries its own base in its digits. **`packages/cli`'s 60 s was not
copied** - that folder's contention factor is 1.31 against this one's 5.32, so its two multiples give
62 s and 256 s here and cannot both be right, which is ADR-0199 arriving on a timeout. Verified with a
control on both sides: the same saturation gives **466 of 466**. **`hookTimeout` is left alone and
that is a refusal**: the 8 226 ms that looked like the heaviest hook is the whole file with its import
and collection, the same file was then seen at 27 519 ms under saturation without the hook expiring,
and a bound on a quantity nobody has measured is what this repair exists not to be. ADR-0205.

**And the other half of that debt is priced, where nothing had ever been tried.** ADR-0203 and
ADR-0204 measured the sole witness on the *residue* — guards that already redden and that every cell
written so far had failed to separate. The 262 of `packages/registry` declared `unprobedClaims` are
the other bucket, and *decorative* is the instrument's own word for them. **The slice rule was fixed
before a guard of it was read** — every unprobed guard of the wholly unprobed test file carrying the
most of them, which is `round-trip.test.ts` at 34 — and **32 are witnessed by 26 cells over 33
candidate runs**, 24 of the 26 landing on their first candidate. **Seventeen of the twenty-six redden
alone with nothing asking them to**: the protocol was to write the defect that most directly falsifies
the guard's own sentence, run once, and stop. So **the expensive part of isolation is not isolating —
it is isolating a guard that has already resisted every cell in the battery**, which is a property of
the population rather than of the work. Per guard taken out of its bucket the two prices are **2.36
runs against 1.03**, and **1.9 times cheaper with the one seven-for-one family removed**; per *cell*
they are identical — **1.27 here against 1.27 and 1.21** — so a first witness is not a cheaper search
and is a cheaper landing. **Where to aim is a rule this folder answers for itself**: `serialiseContract`
calls `encode` and nothing but the round trip calls `decode`, so an edit to the encoder moves the bytes
every digest is taken over — measured, **40 reds** on one such candidate and **66** on another, against
**1** for the same defect expressed on the way back. **Two guards resist and keep their declaration**,
and one is a pincer: the comparison reads keys, kinds and classes and **never a prototype**, so
`a-bare-object` is green from both sides of the only thing that distinguishes it, while the one visible
defect takes `object/deep-equal@1`'s whole serialisation with it. **A third leaves the bucket with
nothing aimed at it**, because the instrument's criterion for leaving is reddening and not aiming —
which is the trap the definition was written to refuse, arriving as a measurement rather than as a
warning. **The verdict is that the count can be priced and the fraction cannot**: 145 of the 262 are
parameterised over a contract in 21 families and 117 stand alone, so the bucket is **at most 138 aiming
decisions**, about 27 minutes of searching and some 25 more on every replay — while the 94 % witnessed
here was measured on a file **32 of whose 34 guards are rows of an `it.each`**, and *the file with the
most guards* is a rule that selects for exactly that. ADR-0209.

**And the replay that measured it retired a column ADR-0204 had to publish in double, for free.** That
record found `the-served-bytes-are-the-committed-bytes` crossing vitest's 5 000 ms default under load
and reddening on `I-38`, which has no causal path to it — *a load flake un-isolated a load-bearing
guard* — so it published the census twice, as the run left it and corrected. Measured at `6888853`,
the first replay of this folder under the 60 060 ms bound ADR-0205 declared: **`I-38` reddens one
guard**, `an-edge-is-followed-to-the-artefact-it-names`, and `the-served-bytes-are-the-committed-bytes`
is reddened by `I-65` and by nothing else. **The corrected column is the measured one now**, and the
arithmetic says so twice — 58 + 17 = 75 and 135 + 17 = 152 from the corrected reading, where the raw
one needs 57 + 18 and 136 + 16 with the extra unit unexplained. It is ADR-0204's own reopening clause
firing on the mechanism it named. ADR-0209.

**The second slice was taken to bracket that fraction and it refuted the reason for expecting a
bracket.** ADR-0209 refused to extrapolate its 94 % because the rule that chose its file selected for a
parameterised table, and it named the correcting reading: a slice over the standalone guards, under a
rule with the opposite bias. **That rule was committed at `e91dd13` before a guard of it was read**,
inverting exactly one clause — not parameterised over a contract — and holding the other — collected in
a wholly unprobed file — so the only thing moving between the two readings is whether a guard is a row
of a family. **Its bias was written down as *downwards*, with three outcomes named in advance so that
none could be read afterwards as a rescue.** It came back **19 of 20**, 95 % against 94 %: **parameterisation
is refuted as the factor**, the two do not bracket, and the difference is smaller than one guard of
either slice — one more resister here reads 90 %, one fewer there reads 97 %. **What is publishable is a
count over a population and never a mean of two fractions**: **51 of 54, 94 %**, for a guard in a wholly
unprobed file whether or not it is a row of a family. **What no rule of this shape can reach is the 174
in probed files**, because excluding them is the clause both slices held and the clause that made them
comparable — and both directions are arguable there, a witness arriving free from an existing cell
against ADR-0209's own finding that a guard still silent in a probed file has already survived every
cell aimed at its neighbours. **Two reds were thrown away for failing A2**, which is the whole of what
the definition is for: a candidate that reddens the guard it names and whose plainest description names
a neighbour has witnessed the neighbour, and nothing but reading can see that. The one guard that
resists is a third mechanism beside ADR-0209's two — a claim about a *set* another guard pins member by
member, so the nearer description always names the other guard — and **what the three resisters have in
common is not what either slice rule separates them by**: it is the absence of a single edit whose
plainest description is the guard's own claim. **The price holds the prediction it was made against**:
1.21 runs per guard witnessed against the sole witness's 2.36, which is 1.95 times less, where ADR-0209
predicted 1.9 for the factor with its family removed — and this slice has no family in it to remove.
**And a declaration the battery carried was falsified by one edit**: *the private-field guards cannot
redden until a private field exists* is true of the catalogue and false of the folder, `field-map.ts`
being a source of it, so declaring one served field private reddens eight guards at once.
`unprobedClaims` goes **228 to 201** against nineteen witnessed, and the gap is seven family members and
one bystander. ADR-0210.

**The third slice took the clause both the others held, and the fraction they published turns out to be
a corner.** ADR-0210 named the two directions that population could go in and refused to guess between
them; **the first was refused by construction before a candidate was written.** `unprobedClaims` is
*derived* — the guards a claims-detection region names that no cell reddened — so a guard an existing
cell already reddens is not in the population at all, and *a witness arriving free* cannot enter the
numerator. **Zero of the seventy.** So the prediction committed at `73e1f20` had one force in it, and
it was that the rate falls below 95 %. It came back **60 of 70, 86 %**, the sharpest of three outcomes
named in advance and eight points below the 94 %. **The mechanism proposed for the fall is refuted by
the slice itself**: read as a dose it is flat — the most probed file, `response.test.ts` at 42 of 67,
witnesses **6 of 6**, and the least probed, `against-the-catalogue.test.ts` at 9 of 69, witnesses **2 of
3**. **What the eight points are is compositional, and the ten resisters say so.** Three mechanisms are
new, and the sharpest is that **three guards resist because their subject is outside the battery's own
surface**: `applyEdits` joins the root, the battery's `contractPath` and the file, so every edit is
inside `packages/registry`, and one of the three reads `packages/catalogue`, one reads nothing but a
record its own test file declares, and one's second stratum-holder is in `contracts/`. **They are
declared as claims no mutant reaches and they are claims no mutant of this battery *can* reach** —
`unreachableGuards` is the bucket for that and held none of them, because until a slice went looking
nobody had asked. Two more resist because their claim is that a derived identity is injective, and the
only single edit making two collide damages the derivation, which has guards of its own; one because
its claim is an absence the type system already forbids the falsifier of. **A file this battery already
reaches is one whose easy claims already have cells**, so what stays silent in it is disproportionately
of those kinds — which is why the fall is invisible inside the slice and visible between slices. **What
is publishable over a whole population is 79 of 90, 88 %**: every standalone unprobed-claims guard this
folder has ever declared, ADR-0210's twenty and this seventy exhausting it between them. **The price
prediction was refuted** — 1.29 runs per cell against a predicted 1.21, the fifth reading of a figure
that has now been 1.27, 1.21, 1.27, 1.21 and 1.29 — so *the injection site is known* was a claim about
an author's convenience and not about the search. **Five candidates reddened the guard they were aimed
at and were thrown away on A2**, more than both earlier slices together, and a slice that kept them
reports 65 of 70. **Twelve declarations went stale on three cells and a reading caught them before a
replay was paid for**, one of them an `unreachableGuards` entry and one a guard this unit had recorded
as resisting — which leaves its bucket with nothing aimed at it, ADR-0209's *the criterion for leaving
is reddening and not aiming* arriving on a second bucket. Measured at `14bd274` off a replay of **215
cells in 38 min 50 s**, 210 killed, the same five survivors, nothing disagreeing, nought unaccounted for
and nought wrongly declared silent, exit 0: `unprobedClaims` goes **201 to 129**, 72 leaving against 60
witnessed, and the gap of **12** is the one sub-prediction that held. ADR-0211.

**And the joint ADR-0209 named in its own arithmetic gave way five times in nineteen.** That record
priced the parameterised half at *at most 138 aiming decisions* on the strength of one family
collapsing to one cell, and wrote beside it that whether a family really collapses is **measured once
and assumed twenty times**. The rule for the reading was committed at `a853805` before a guard of it
was read, over **every** family the bucket still holds, with the mechanism named in advance and three
outcomes fixed so that none could be read afterwards as a rescue. **The structure was read
mechanically first and it is what makes the question sharp**: 19 of 19 families carry exactly the
seven distinct contract slugs, so **a family is one title asked of seven contracts** rather than a
resemblance between separately written guards — and an edit to a shared path is by construction the
failure condition every row names. **Fourteen of nineteen collapse**, the middle outcome, against a
predicted seventeen with the bias declared upwards. **The mechanism was named incompletely rather than
wrongly, and the correction is the finding**: the prediction said a family fails on *vacuity*, and
that is the rule read one row at a time — `every-produced-profile-exists` is exactly it, `producedBy`
being declared by `number/parse@1` and `array/group-by@1` and by nobody else, so five rows of seven
quantify over an empty set, and `every-export-is-carried-or-declared-uncarried` is the second of two,
`number/parse@1` declaring no own declarations at all. **The three others resist at a scale the
prediction did not reach**:
they read a contract's own declarations against each other and **no derivation of this folder stands
between the input and the assertion**, so one edit reddens one row — measured at 1, 2 and 66 reds for
one row apiece, the last stopping a contract serialising to witness a single guard. So the rule is
that **a family collapses when a shared derivation lies between all seven rows and the sentence, and a
row resists when its own contract exercises none of it** — one mechanism at two scales. **The sibling
that collapses is what makes it a mechanism rather than a description**: `every-uncarried-export-carries-a-reason`
sits in the same file and reads the same field, and it collapses because the *reason* every contract
gives is one constant in `serialise.ts`. **A declaration was refuted rather than made stale**: the
region holding four blob rows out of reach gave a true reason for a false conclusion, having
characterised the guard by the one defect anybody had tried, and `I-168` reddens all seven —
`REACHED_BY_A_LATIN_1_RE_ENCODING` dying with it, caught by `noUnusedLocals`. **A1 and A2 turn out to
sit at different scales here**, A2 per family and A1 per row, which is what makes `68e466a`'s family
exception sound on this population and is a shape neither earlier slice had. **The verdict on the 138
is corrected with its form held**: the nineteen families cost **41 aiming decisions and not 19**, a
coefficient of **2.16**, so today's ceiling is **50 for 129 guards** rather than 28 — a ceiling far
below one cell per guard, and the figure 138 is re-derivable at no coordinate because its population
is gone. The price prediction was refuted again — **1.43 candidate runs per cell** against a predicted
1.3, the sixth reading of a figure that has been 1.27, 1.21, 1.27, 1.21, 1.29 and 1.43 — and the
figure this slice alone can produce is **1.05 runs per family decided**. ADR-0212.

**And a figure of ADR-0210 does not reproduce.** It publishes *174 of the 228* for the population both
slices excluded and its own rule commit publishes **173**; rebuilt from the artefact on disk the 228
state is 55 in wholly unprobed files and **173** in partly probed ones, naming the four files that
slice emptied, and the same figure is 173 at the 262 state and 173 today. The record is stamped, so the
note is here rather than in it. ADR-0211.

**The client stopped killing the process it was refusing in, and the ending was a half nothing here
watched.** `toopo add` of a name the registry does not hold refused correctly, printed the right
sentence, wrote nothing — and then aborted: `process.exit` after a `fetch` races libuv's teardown, and
on win32 node dies on an assertion in `src/win/async.c`. **The exit code became `0xC0000409`, which
git-bash reports as `127`** — the code a POSIX shell keeps for *command not found*, so a mistyped
contract name told a CI script that `toopo` was not installed. Every guard over that refusal was green
through all of it, because every one stopped at the sentence. **The count was the wrong reading and the
product refuted it**: one fetch aborts and two do not against `toopo.dev`, and on loopback the two swap
over — it is a race, and *one fetch then 10 ms* aborts three times in five, which is what says so.
**The class is wider than `process.exit` and that is what widened the repair**: a bare `throw` after a
fetch aborts identically, and `command.ts` deliberately let unexpected errors out as a crash. So `run`
answers `HowItEnded`, nothing under it ends the process, and the two entry points assign the code.
Three guards watch a real process through a socket and a fourth is total over the tarball's own
modules; the first is red only where the race is lost, and **no leg of `suites.yml` ran on Windows**,
which is why the `beforeExit` one exists — the paragraph below is that half closing. **CI answered the reading this record was written owing**:
on ubuntu the restored defect reddens the `beforeExit` guard *alone*, and on win32 it reddens both — so
`process.exit` after a fetch leaves the code at 1 and stderr empty on Linux, and had this unit shipped
only the guard that reads the exit code, **every gate would have been green on the defect**. Measured:
at `88bfb54`, **seven `runs-on:` in `suites.yml` and every one `ubuntu-latest`**, no Windows runner
anywhere in `.github/` — so **this CI could not have caught the defect it just repaired**, and the
guard reading the exit code was green on every runner this project owned while the defect was live. **And the
accounting is per suite rather than per folder**, which has a price worth knowing before writing a
guard: **one battery file per battery that collects the folder, plus the census** — `packages/cli` is
four, each contract is two, everything else is one, so three guards there cost five files. The push
failed naming 3, 2 and 2 unaccounted guards; **the 3 is that price and the 2s were a defect**, the
control having run `add`, which every defect of the plan, the rewrite, the lockfile, the configuration
and the git question reaches — and one cell reddening it, `cli-remove`'s R-20, **edits a module an
install cannot reach at all**. A guard reddening on a mutant with no causal path to it is invisible to
a green suite; what made it visible was a battery having no business witnessing it. ADR-0168.

**The gate can now redden on a defect only Windows has, and what it cost was read rather than
argued.** Two legs, two prices, and neither buys the other — which is the finding, because the brief
this unit started from treated them as one. **The three guards of ADR-0168 are ordinary guards of
`packages/cli/`**, so the `cli` step runs them and no mutant is needed: with the defect put back in the
one line it lived on, measured at `36e4bbb` in one run on node v24.19.0 both sides, `ubuntu-latest`
reddens **2 of 3 with the exit-code guard green** and `windows-latest` reddens **3 of 3**. So the
first leg is the eight suites on Windows, 257 s against 125 s, and it is a *sibling job* rather than a
leg of the matrix: `site` and `batteries` both wait for `suites`, and `needs` waits for every leg, so
the matrix would have put 132 s on the critical path of every push. `publish → site →
suites-on-windows` is the path that keeps the irreversible act behind it. **`meta` and `freeze` had
never run on `windows-latest` in their lives** — no battery replays either — and both are green, 56 s
and 7 s. **The second leg is `C-64`'s**, whose `killed` half was exercised by nothing: the battery on
Windows prints `killed as expected`, `a-project-is-removed-…` goes `red on C-64, alone on C-64`, and
the *not measured on this platform* bucket goes **1 → 0**. Its matrix is derived from
`whereThePlatformDecides` rather than naming a folder, so a second such cell brings its battery with
it and the last one leaving empties the leg. **The bound is where the method earned its keep**: the
extrapolation published before the run said 2 029 s and the job measured **2 122 s, 4.4 % low** — and
the same run refuted the premise that one reading characterises a job at all, two readings of
identical work at one commit coming back **1 541 s and 1 319 s**. **What the unit turned out to be about
is the derivation beside it, which was wrong twice, and the property that would have caught both.** The
clause shipped as *a reading outside what has been seen reopens this*, fired on the next run, and is the
wrong shape: **a sample's range grows with the sample**, so it fires `2/(n+1)` of the time — 22 % at
eight — on an event that establishes nothing. Keyed to the answer instead, it was **silent on 1 515 s
and fired on 1 632 s**, which is the difference between a condition and a treadmill. **Then the form
itself failed**: the tenth reading, 1 233 s, was the *fastest* ever recorded, the maximum did not move,
and `max/min` would have taken the bound **64 → 69** — a timeout loosening five minutes because a job
ran faster, at 1.95 times the only Windows reading there is. **The finding is the property and not the
formula: a derivation that moves in response to a faster run is broken.** `max/median` asks what a
timeout is about — how far the slow tail runs above the typical — and passes by construction: append a
1 100 s reading and it answers **57** where `max/min` answers 77. So the bound is **57 minutes**, 1.61×
the measured job, 41 cells of margin, and it can tighten as well as loosen where the old form could only
rise. **What that exposed is the bound beside it**: the two ubuntu gates are typed at 40 and their
margin fell **42 → 41 → 38 cells** across the same ten readings with nobody deciding anything. **And the
figure for leg (a) was published the same wrong way twice**: 257 s alone, then *all of the spread is the
tooling and none of it is the work* on three readings — 167, 164, 158 — which a fourth at 139 refuted.
What survives is the comparison and not the total: the tooling spreads 105 s where the suites spread 28. **A second Windows tirage was
priced at 2 122 s and refused** — n = 2 bounds a tail no better than n = 1. What the reading cost is
stated rather than smoothed: **10 819 runner-seconds, of which 6 690 was a full replay of all 23
batteries nobody wanted**, because the first push of a branch hands `0000…0000` as the commit before
it and the selection answers *every battery* rather than *none* — written in the module whose comment
says so. ADR-0169.

**The gate now answers for the instrument as well as for what the instrument measures, and the exit
code it reads has a failing direction that is exercised.** A battery *measures* a folder and is *built
out of* the runner; the second half selected nothing, and ADR-0146 refused it on the price of a walk it
was not going to take - following what a *suite* imports selects everything, following what a *run*
reads closes on eight files and costs 5.2 % of wall clock. **The four names that entry gave were one
too many and three short**, `published.ts` being on no battery's execution path and `census.ts`,
`measure.ts` and `paths.ts` being read by every run: nothing had derived that list. What replaces it is
a declaration a walk refuses to disagree with, and a blind spot published rather than discovered - a
templated `import()` is invisible to the walk, so the declaration is what notices the walk going quiet.
`8b6aa89` goes from 0 batteries to 21 and `f465660` from 2 to 21. **And the foundation under all of it
was unproven**: both gates read an exit code whose only assertion was `toBe(0)` on a battery pinned
green, so dropping the guard-disagreement term printed every disagreement and exited 0 across
twenty-one batteries at once. Three exit codes, three guards, each seen red alone. ADR-0149.

**The site has a search, and it is the one the client has rather than a second one.** A page fetches
`contract-index` and `refusals` — the two answers it already serves — and runs `packages/registry/search.ts`
against them, so a reader typing into the masthead and a reader typing into a terminal get one answer by
construction. The site's own port had deferred it for three units, *until the catalogue stops fitting on
one screen*; **that condition is not met and the deferral is lifted anyway**, because the promise is that
somebody describes what they need, and a promise is not kept by a page a reader has to know how to read.
A deferral can be lifted by a promise rather than by a threshold, and the record says which of the two
did it. What is served is a slot and never a control: a reader without JavaScript meets a masthead with
nothing extra in it. The two answers cost 1 262 B more on the first query, and the playground — the
larger half — stays behind an `await import` that nine pages never make. **This line read *every page
loads 19 789 B in brotli before a reader acts* and that was ADR-0137's figure at `62f2474` restated
here with no coordinate**, which is ADR-0018's defect exactly: a dated number and a present-tense
clause, and it is the clause a reader believes. Measured at `018a2da`, neither reading of its
population reproduces it — 34 167 B for the page and the five modules a search needs, 22 443 B for
those modules alone. It is not restated with today's number, because the number moves whenever the
tree does; ADR-0137 holds the reading it was, with the commit it was taken at. Three examples are offered before anybody types and a guard runs the
catalogue's own search over each of them, because an example that finds nothing is the defect a visitor
met on the install command. ADR-0137.

**And that search stopped spending on a word a reader adds the allowance written for a word they
omit.** A query that sets a word aside now has to carry more than one word of the field it names,
because one word is not a name — which is `sort array` one floor down. **It was twelve requests and
not the one the corpus happened to hold**: a deliberate field whose telling words fall to one opens
its contract to anything typed beside it, and measured at `a705977` over this catalogue's six
publications those fields ran **0, 0, 0, 2, 15, 21**. **Eight of the twelve are requests this
catalogue holds nothing for** — `parse json`, `round robin`, `add to cart`, `float left`,
`fixed header` among them, answered **0, 1, 1, 1, 2, 8** — **and four are requests it could have
answered**, `slugify a blog post` among them, answered **0, 0, 0, 1, 4, 4**. Only the eight are in
the negative half of the trial, because that list says *the catalogue cannot answer this*: **the four
were written into it first and taken out**, which is the corpus rule holding against the person
applying it rather than a distinction the rule can make. **The rate is not monotone and this file said it
was**: the negative half had one query answered at one, two, three and four contracts, **none at
five**, and one again at six, because growth took `string` to three contracts, so it stopped telling
them apart and `remove accents from string` lost the field it had been naming. **The repair that
looked obvious is dead on a measurement**: refusing any query carrying a word the catalogue has never
heard breaks four of the thirty-two corpus queries, since `do`, `i` and `what` are as unheard-of here
as `yaml` and nothing derived from the catalogue separates a function word from a subject. What it
costs is stated rather than smoothed — over 198 queries, every alias with one word replaced by one the
catalogue does not know, **151 were answered before and 125 after with zero wrong answers either
side**, and the twenty-six lost are the same shape as the twelve closed. **And the reading nearly
published was the wrong population**: a second sweep of 198 queries with one word *left out* showed no
change at all, and **nought of them reach the branch the unit changed**. ADR-0154.

**And the registry can now learn a word about a contract it may no longer edit, which is the first
standing field a *mechanism* reads rather than a reader.** This line read *the first thing this
catalogue has ever been able to say about a published contract that the contract itself could not*,
and that was false on two counts already in the schema: `useCases` and `againstTheLanguage` are both
exactly that. What is true of this one and of neither of those is that it changes **what a query
reaches** rather than what a page says. `number/parse@1` declares `int` and not `integer`, `answers` lets a query shorten a word
and never extend one, and measured at `91b7314` over eight ordinary ways of asking for that
function - `read an integer from a string`, `how do I convert a string to an integer` - **written
with `int`, nought of the eight are silent; written with `integer`, all eight are.** One alias would
answer them and `contractSnapshot` freezes `identity` whole, so nobody may declare it. `alsoFoundBy`
is standing: three fields per phrase, the term read by the search as an alias, and **the six contract
digests identical to the byte** with `npm run freeze` green beside them. **The argument that was
given for freezing it was reversed by this repository's own week**: ADR-0154 measured
`slugify a blog post` at **0, 0, 0, 1, 4, 4** over six publications with no contract moving, so what
a query reaches is a fact about the whole catalogue and the frozen half was never the complete
account of what a contract answers. What the registry measures is not what the contract is held to,
which is `againstTheLanguage`'s argument arriving on retrieval. ADR-0155.

**The guard whose population it would have halved was repaired before it could, and the shrink was
seen green.** `every-declared-alias-finds-its-own-contract-first` swept `entry.searchAliases`, which
was every phrase there was; a second place to put one takes half its subject with nothing saying so,
hours after ADR-0152 closed that class - `f776a43`, the same day. The population is a declaration keyed by
`keyof ServedIndexEntry` now, so a field added to the answer does not compile until somebody classes
it - and **the compiler forces a row and cannot judge it**, so a second guard compares that
declaration with what `search.ts` really reads. Marking the new field `null` reddens the second guard
alone: **411 of 412 green, and the guard whose whole subject is the aliases reported nothing.** ADR-0155.

**What it does not buy is written where somebody reaching for it arrives.** Correcting or removing a
declared alias is still impossible - the eight aliases of the published contracts are inside four
digests - so ADR-0023's entry below closes by half and stays open. And the alias review is
ADR-0023's, it happens at publication, it caught eight liars, and a learned term arrives at a moment
nothing marks: two of the three fields exist to write that review down, a guard computes the half
that can be computed, and a third refuses a learned term on a contract whose `identity` is still
open. **The judgement itself is recovered by nothing**, and it is on the list below. ADR-0155.

**A reader receives the rules and not the argument for them, and the reason to link a stylesheet went
with the prose.** `style.ts` keeps its reasoning beside the declaration it explains and every word of it
was being downloaded by every visitor: 75 comments, 25 007 B of a 41 540 B sheet, inlined into fifteen
files of HTML. **The raw figure overstates by 3.1 and the decision survives it** — in brotli the sheet
is 11 236 B and 3 267 B stripped, and across the change the front page goes 11 724 → 3 805 and the tree
236 960 → 119 086, which is half the HTML weight of this site. The linked file was measured and
refused: it buys 3 264 B per page after the first, against a round trip, an address no listing names,
and a `.css` falling through to the host's four-hour default where pages are served `max-age=0` — a
stale script is a control that does nothing, a stale stylesheet is the page. **The argument for a file
was that the sheet is heavy; it is 3 267 B.** Not a pixel moved, and a browser is what says so, twice:
both sheets through `CSSStyleSheet.replaceSync` give **169 rules each and zero differing**, and the
heaviest page rendered at 1440 with the `style` element swapped between them gives **627 elements,
520 computed properties each, zero differing, 13 128px tall either way** — each probe perturbed twice
before it was believed. That is a
verification taken once and never a guard, and ADR-0141 says which of the two it is so nobody promotes
it. **The blind spot is published**: a removal taking one declaration out of the middle of a rule,
braces balanced, is invisible to all three guards, and the total form is the parser the browser lent.
ADR-0141.

**And it named a class this repository had not carried: a false-only region — a part of a guard's
population where no true verdict is reachable and a false one is.** `a-page-loads-nothing-and-runs-nothing`
— renamed at ADR-0176, when both halves of that name went false in one unit —
refused `url(` anywhere in a served page, comments included, so on the 25 007 B of comment it swept
**a true positive was impossible and a false positive was possible**: a `url(` inside a CSS comment
fetches nothing, so the guard could never have been right to fire there, and had anybody written one it
would have fired and been wrong. Measured over the seventy-five comments: zero `url(` and zero `http`.
**It never reddened because nobody wrote one, not because it had reason not to.** It is neither shape
already named here — a guard passing vacuously has *no* population, and a population that shrinks in
silence loses coverage; this one was carrying a region where only a false verdict was reachable, and
most of it was doing real work. **The repair removed it by accident**, for reasons about bytes, so the
repository is one region better off and no decision bought that — which is the shape that recurs
somewhere else unnoticed, nothing looking wrong on either side of it. ADR-0141.

**The debt one door along is paid, and the refusal named the wrong obstacle.** ADR-0141 wrote that
*the verification does not transfer* — `CSSStyleSheet.replaceSync` and a rule-by-rule comparison have no
JavaScript equivalent — and that is true of the form and inverted as a conclusion. **The CSS comparison
could never be a guard**, because it needs a browser, refused three times on the list below. **This one
needs a parser**, which is already a runtime dependency and which a suite here already spawns: seven
project loads in 0.645 s, against the 4.02 s the site suite took. So the second half is not the first
half without its check — it is the first half with a better one, and ADR-0141's own published blind spot
does not recur.

**What stands where `cssRules` stood is both syntax trees walked and compared on kind, child count and
leaf value.** Measured at `43db0c2` over **9 637 nodes: zero differing** — perturbed to 375 by a deleted
statement, 4 by a renamed identifier and 3 by the hazard planted. **The price is that the parser is not
the consumer**, which CSS did not pay: V8 exposes no tree, and no normal form at all — `Function.prototype.toString`
returns source text with the comments in it, `name` and `length` are equal for different bodies, a module
namespace carries no body and the code cache is not canonical. What makes a third party's reading
acceptable is that stage 1 already trusts this parser to decide what enters the catalogue; and it was
checked against V8 on automatic semicolon insertion, case for case.

**What a reader stops paying is 19 475 B in brotli on every page and 28 683 B on a contract page** —
2.46 and 3.62 times what taking the prose out of the stylesheet bought. The tree figure is 34 194 B and
**no reader pays it**, because nobody loads fourteen modules. **The five `reference.js` keep their
argument**, by a guard rather than by care: a contract page promises *that contract's own `reference.ts`
with its types stripped*, so the real seam was 92 562 B and not 107 979, and the refusal costs a reader
nothing because no reference is among the five modules a page loads.

**The reader is the compiler's scanner driven, and a measurement is why.** A bare scan loop finds **10
comments and 9 644 bytes in `address.js` where the parser finds 25 and 16 358** — it loses template
parity at line 204 and never resynchronises, because this prose is full of backticks. **It raised no
error and returned a plausible number.** A reader written from scratch is worse: one written for this
unit agreed with the parser on the six files it finished and looped for ever on the seventh. **And the
premise the old refusal rested on was false** — `browser.ts` claimed `typescript@7.0.2` ships no
JavaScript API, offering `lib/` as evidence; the API is under `dist/`, and `typescript-api.ts` had said so
correctly the whole time. Two files, one fact, and the wrong one was the file somebody opens to ask this
exact question. ADR-0156.

**Three things this unit could not buy are written down rather than smoothed.** The cell it most wanted
survives: on the fourteen real modules all three replacement rules leave every tree identical, because
no module here separates a `return` from its value with a comment spanning a line — so W-101 states an
intent and carries no behaviour, which is `number/round@1`'s shape three times over. A coverage reading
was attempted and failed — 1 027 scripts captured under `NODE_V8_COVERAGE`, two of them this
repository's, **none of the nine modules**, and a probe reporting *100 % executed* that was the absence
of data. And the figures in the commit are the simulated ones where the record's are the shipped ones,
which is ADR-0141's own lesson arriving one unit later: 6 090 predicted, 6 094 served.

**Two things it broke are worth more than what it built.** A stylesheet can be green and broken: the
first repair of the sticky bar used a spacing step the scale does not declare, which makes the whole
`calc()` invalid, so `--the-sticky-bar` resolved to **nothing at all** and the site suite stayed green
through it — found by reading the computed value in a browser. And moving the playground behind a
dynamic import took its edge out of `every-import-a-browser-module-keeps-is-a-module-the-site-writes`,
which matched `from '...'` and cannot see an `import()`: **an edit that changes how a dependency is
expressed can leave a guard's population without touching the guard**, and nothing reports a population
that has quietly shrunk.

**The only part of this product a visitor touches with a mouse stopped being the only part nothing
verified.** `start.ts` builds the copy control, the choice of package manager, the search field and the
playground's form; it exports no name, so nothing could import it and no mutant in it could be killed,
and `site.battery.ts` had declared `contractPath: 'packages/site'` since it was written without anybody
ever putting a cell there — an absence and never a refusal. **What was in the way was not the
document.** Measured at `17cc9bf` over its executable text, by the rule that a line is delivery as soon
as it names the document, the navigator or something that came from one: **50.8 % delivery, 40.2 %
decision, 9.0 % brackets** — where the decision half counts the eighteen lines written straight into an
element, a spelling at a time, as well as those standing free. Two fifths of that file was a claim about
what a visitor reads, expressed as an argument to `setAttribute`. It is `what-a-control-says.ts` now,
and the playground's own four claims went to `playground.ts` because nine of thirteen pages never fetch
that module. **`searching.ts` came with it and was in a worse state in one direction** — four exports,
no test importing it, reachable the whole time and simply not reached, with *a rejected promise is not
kept* declared in its own comment and nothing behind it. Twenty-four guards, the site suite 139 → 163,
the battery 746 → 765. **What a reader pays is stated rather than smoothed**: every page is **1 072 B
heavier in brotli**, 5.5 % given back of what ADR-0156 removed one unit before, and `start.ts` itself
*grew* by 286 served bytes. ADR-0157.

**The instrument refused a run in which every declared cell had done what it declared, which is the
finding of this unit.** Fourteen cells were written for twenty-four new guards on a judgement about
which defects were plausible; all fourteen killed exactly what they named, and the battery exited 1
anyway, because **five guards had nothing reddening them at all** and it named them one by one rather
than printing a total that looked healthy. Nothing beside it could have said so - the guards were
green, the cells were green, the suite was green, and the count was the count, which is what a guard
that cannot fail looks like to whoever reads it. One is instructive on its own:
`what-follows-the-invocation-is-what-the-page-already-asked-for` was believed covered by W-104, and is
not, because a typed word count and a derived one **agree on every input the function accepts** - so
that cell reddens the refusal and leaves the ordinary answer untouched. W-116 to W-120 are the five,
and a judgement about which defects are plausible is a judgement the accounting is what makes
answerable.

**The cell worth more than the nineteen is the one no reading of the output could have caught.** W-115
calls a contract's diagnostic before deciding whether to show it: **both printed lines are byte for byte
what the correct version prints**, and the only difference is that a diagnostic now runs on every
keystroke of every *successful* call, on somebody else's machine, invisibly. It dies because
`theAnswerShown` is handed something to call rather than something already called — **not calling it is
an observable, and calling it early is not**. Three smaller findings are in the record: a typed word
count that answers `toopo add x` for `yarn dlx toopo add x` and is derived now, with the derivation
itself published as unobservable; `LOADED_BEFORE_A_READER_ACTS` citing a guard **no suite collected for
the whole of its life**, which is ADR-0126's class found by adding a row and asking what would check it;
and ADR-0156's `7 532` and `42 530` reproducing under **none of four readings** of *executable text*
over files that did not move — both stamped, both left, and what replaces them carries its rule as well
as its commit. ADR-0157.

**The wiring runs against a document now, and the first thing it found is that Escape closed nothing.**
`start.ts` exports four builders, `start.test.ts` runs each against a page `theSite` really renders, and
W-122 to W-133 inject into a file no cell had ever reached. The panel's dismissal read
`paint(THE_PANEL_IS_CLOSED)` then `field.focus()`, and closing first **detaches the example that holds
the focus** — so the focus event that follows arrives from a node no longer in the slot, reads as a
reader arriving, and runs the query again. Measured at `2ae8b50` on a contract page: with the field
empty the invitation came back within the tick, with a query typed the panel emptied and **repopulated
once the answer settled**, and it closed only when the field already had the focus, which is the one
case the refocus was not written for. The repair is two lines and adds no state — move the focus first,
and treat a focus arriving from inside the slot as what it is, which is the distinction the `focusout`
beside it already makes. **Four perturbations came back green and three were holes in the guards**: a
slot that declares nothing is a different page from a page with no slot, a refusal read by `textContent`
is one nobody is shown, and Escape on a panel of answers is a different claim from Escape on an
invitation — the fourth being a clause `TS18047` holds. **A thirteenth guard was written, passed, and
was struck out**, its subject enforced by the type system. What a reader pays is **43 B in brotli on
every page**, `start.js` going 9 842 to 10 074 served bytes and 2 276 to 2 319 compressed; what the
suite pays is **0.16 s**, after a first version cost 3.3 s because `localSource()` is 268 ms against
`theSite`'s 9 and was being called twice per guard; what the instrument pays is read off the two runs
themselves, `batteries (site)` going **19 min 07 s at `1a1b0f8` to 22 min 07 s at `d0c8fe6`** — 47.8 %
of its bound to 55.3 %, with 46 s of the three minutes unaccounted for — and the run after it, which
changed prose and nothing else, took **23 min 35 s on the same 134 cells**, so the spread between two
runs of identical work is nearly twice that residue. **The commit carries 28 B and it was measured
before the Escape repair was written** - the method was sound and the moment was not, which is
ADR-0141's lesson arriving on a second unit. ADR-0165.

**The site is being redesigned in four units and this is the first, the chassis — and what decided its
hardest question was a condition somebody wrote down a year in advance.** ADR-0115 refused a web font
*on coverage rather than on weight*, and named what would reopen it: *a monospace face that renders
U+2192 and the scripts this catalogue settles cases on*. The owner's design asks for Geist and Geist
Mono. **Measured, Geist Mono is served in no subset that carries U+2192** — it has the same `latin`
block Plex had, U+2191 and U+2193 and not the arrow between them — and the emitted tree serves
**241 of that arrow, over 51 distinct uncovered code points and 373 occurrences**. So the prose is set
in Geist, self-hosted, one variable file of 29 400 B addressed by its own digest; the monospace is the
system's, as it was. **The reading that settled the shape is that the two populations agree**: swept
over all text and over `<code>` and `<pre>` alone, the uncovered count is the same, so every character
the face cannot draw is already inside a monospace element and none is in prose. The archive is
untouched — `files: ["dist"]` keeps `packages/site/` out of it — and the 73 answers do not move.

**The property that fell is named, and the half that was load-bearing never was approached.**
`a-page-loads-nothing-and-runs-nothing` made three assertions; ADR-0115 had recorded, in advance, that
a face would have to reopen it *while keeping W-24 refused* — W-24 being the stylesheet moved out into
a file. **W-24 dies on the link list and not on the `url(`**, so admitting the face went nowhere near
it, which is why the font is declared inside the sheet and why there is deliberately no
`<link rel="preload">`. Both halves of that name went false in one unit, so it is two guards now, and
its `url(` arm got *stronger* in the trade: it said *no url() anywhere* and says *exactly this one*.
The theme button ships — ADR-0115 refused one and named no reopening condition for it, so that half is
recorded as an **overruling** rather than a discovery — and nothing is needed to read: the palette is
dark by declaration and light under `prefers-color-scheme`, both in CSS. `light-dark()` would have
written each colour once and was refused on a measurement, because it moves the Chrome and Safari floor
to May 2024 where this sheet's own `:has()` already needs Firefox 121; the duplication it would have
removed is compared by a guard instead. ADR-0176.

**And the repository caught the redesign putting back a role it had removed for the same reason, at
the same number.** ADR-0115 deleted a grey called `faint` because it measured 2.64:1 on light paper.
The artboard reintroduces it and it measures **2.64:1 on light wash** — the same figure eight months
later, in a repository that exists so that figures do not drift, found by running the arithmetic and
by nobody remembering. **Eleven pairs of the owner's palette are below 4.5:1**, seven of them that one
ink, and three are the accent missing by a twentieth. They are not corrected: the design is the
owner's and he has not ruled. What *is* corrected is the focus ring, which measured **1.76:1** against
light paper where WCAG owes a non-text indicator 3:1 — keyboard focus invisible on a light system —
repaired to 4.76:1 with the artboard's own darkened accent, so no colour was invented.
`every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` could not survive that and became
`every-pair-below-the-legible-floor-is-one-this-repository-declared`: eleven rows, exact in both
directions, so a twelfth cannot arrive in silence and a row cannot outlive the failure it names. **It
gave up refusing an illegible ink and bought refusing a new one and a stale exemption**, and that trade
is the one thing in the unit taken on the assistant's judgement rather than the owner's. ADR-0176.

**The trade lasted one unit, and what ended it was an asymmetry rather than a number.** The owner ruled
that every ink clears the floor. `--dim` took the values ADR-0176's own reopening clause had already
named, and **the reading that matters is that the binding ground is the card in both themes** — the one
neither record had measured against, where the ink sits 0.4 to 0.6 below its headline figure. They
clear anyway, which is luck rather than method: **a reopening clause that names a value names it
against the ground it was written from, and that is not necessarily the ground that decides.** A walk
along the owner's own hue at one part in a thousand found the nearest clearing values sit *on* the
floor — 4.51 and 4.50 — so his are taken for their margin, because **a design seated on a threshold is
one a re-measurement moves off**. `--accent` moved 3.6 % to `#0c7a64`, and the assistant's refusal to
move it was overruled with the argument that decides: leaving three rows cost a **mechanism** — the
guard stays a declaration for ever and protects no future change — where moving cost a green nobody can
pick out of a line-up. **`--tk-c` was named in the instruction and does not exist**: ADR-0176 left the
six syntax tokens undeclared because nothing paints with them, and the artboard's card uses `--body`
for its signature; they arrive with the contract page, and the floor applies the moment they do. The
guard has its old name back and is seen red on an illegible ink in each theme — **and on the accent put
back where ADR-0176 left it**, which is the mechanism the trade bought, made concrete. ADR-0178.

**A binding was dated by a constant beside it rather than by the commit it names, and the registry
served that for ten days with every guard green.** `publishedAt` says *when a binding was made* and
`CONTRACT_BINDING_NATURES` classes it `bound-for-life`. Measured on the live origin at `22ccd46`, all
**twelve** named answers carrying it — six contract bindings and six implementation bindings —
answered `2026-08-17T00:00:00.000Z`, while `PUBLISHED_FROM` said `number/round@1` was minted at
`50ff990` and `object/deep-equal@1` at `3ec621c`. **Four of the twelve were wrong, two by three days
and two by seven.** **The cause is where the halves lived and not a typo**: the commit was a map in
`local-read-api.ts`, the instant was one constant in `publication.ts`, and nothing tied them — so the
seventh contract added a row to the map and the constant went on answering for the first publication.
Each half was edited correctly and the pair went wrong. **Nothing was red because the field is in no
digest, no lockfile and no page** — measured rather than recalled: `npm run ledger` is byte-identical
across the repair, a real `npx toopo@1.1.0 add number/round` writes `installedAt` and `servedFrom` and
never this, and `npm pack toopo@1.1.0` holds no such value. The only surface it was wrong on is the
audit surface. `THE_PUBLICATIONS` is the two halves written once, `{ from, at }` per address;
`every-published-binding-is-dated-by-the-commit-it-names` reads the instant back off the commit.
**The author date and not the committer date**, because a rewrite moves one and leaves the other, and
this history has been reissued twice — the two part on `d3a5166` by five minutes, and swapping `%aI`
for `%cI` reddens the guard, so the choice is read rather than asserted. **The day resolution went
with the repair**: the old constant's own argument was *a clock reading is neither derivable nor
falsifiable here*, and both halves of that died the moment the commit became the source. The defect
put back reddens the new guard **alone**, and the two guards already watching that ledger stay green —
which is what says they were never its subject. ADR-0177.

**And that freeze now covers what a contract's guards call, which until this unit it did not.** A
fingerprint covered the seven files of a folder and nothing they import, so emptying one shared guard
left all eight ledger digests identical to the byte while a contract the guard exists to refuse went
green — measured at `e8f68ca`, with the same defect red once the shared file was put back. `sharedHarness`
is the closure: the files a contract reaches outside its folder are declared, derived independently by a
walk over what the seven really import, refused on any disagreement, frozen with the contract and served
beside it — so a reader who fetches every file a snapshot names can now resolve every import those files
carry, which is the auditor's half of the same hole. The bill is stated rather than discovered: editing
either shared file rebinds every published address at once. ADR-0105.

**The catalogue is marked published, and that is the act this repository was built to be able to take.**
Four contracts carry `published`, their reference implementations are bound at `1.0.0`, the manifest is
`toopo@1.0.0` and `private: true` is gone. **Publishing and anchoring are two acts and no commit can do
both**, which is a fact about the mechanism rather than about this unit: `implementationSnapshot`
carries the version, so the commit that mints `reference@1.0.0` creates an address no earlier commit
binds and cannot name itself as the commit it was published from. So the publication is a commit and the
anchoring is the commit after it. `contractSnapshot` omits the lifecycle - measured, the four contract
digests are identical either side of the marking - which is what makes the second commit's coordinate
honest for the first four addresses. ADR-0106.

**And something now reads that coordinate.** `packages/registry/against-what-was-published/` rebuilds
every binding at the commit it records and compares, so permanent rule 6 stops being the biggest
`one-directional` declaration here and becomes a red. It is a suite no battery replays, for the reason
the origin proof is: `registry-storage` would pay for a checkout and a child process sixty times per
replay, inside an instrument that manages worktrees of its own - and the reading that says *the verdicts
would hold anyway* is true only while that battery has no surviving cell. **The price is the origin
proof's and is stated in the same place**: no mutant reddens those two guards, so nothing measures what
they are worth, and what stands in for it is that they were seen red on three real conditions with the
reds published. ADR-0107.

**The fixtures stood on nine addresses the catalogue could publish, and one of them is the sixth
contract.** `number/round`, `string/pad`, `number/clamp`, `number/sign`, `text/left`, `text/right`,
`string/titlecase`, `number/rond`, `toy/thing` — every one two kebab-case segments, which is exactly
what `CONTRACT_NAME` accepts. **The failure has no event**: nothing reddens, nothing drifts, and the
collision is met by whoever sets out to write the contract, at which point the choice is between
renaming forty files and publishing at a name nobody chose. `number/round@1` was decided while three
fixtures stood on it — the imagined graph's root, the record `the-sixth-contract.test.ts` writes to ask
whether the schema takes a sixth, and the address every guard of `packages/cli/` installs from. A domain
beginning with `imagined-` is now one no contract may be published at: `serialiseContract` refuses it,
`imaginedSource()` refuses anything else, and a pair of guards holds both halves — either alone would be
a convention with a test in front of it. **The prefix rather than a reserved domain is a measurement**:
the graph exists to exercise `../../<domain>/<name>/reference.js`, six fixtures in one domain would
write `../<name>/reference.js`, and the harder shape would stop being written anywhere. It shows in the
bytes — an install goes 794 → 821 B, and the 27 are three specifiers × nine characters. ADR-0142.

**The count is the argument, not the repair.** Three successive sweeps of this repository counted
**six, then eight, then nine**, and nothing about the three that were missed looked different from the
six that were found. A sweep over the text cannot replace the declaration, measured rather than
assumed: matching `CONTRACT_NAME`'s shape against every quoted literal returns `lib/toopo`,
`packages/cli`, `application/json` and `vitest/config` beside the real answers, because the shape of an
address and the shape of a path are one shape. So the guard is total over a **declaration** and the
population is `imagined-addresses.ts`'s own exports. **What it does not reach is a bare literal typed
into a future test**, which is on the list below. `Math.clamp` at TC39 stage 2 is what made it urgent:
the language is coming for `number/clamp`, and a fixture in the way of a *decision* is worse than one
in the way of a contract.

**And the rename produced a rule this repository did not have.** Ten records name one of the nine.
Nine were renamed on the precedent of ADR-0095 and ADR-0124 — *both moved every identifier and neither
moved a single tree, which is what made the stamped measurements survive as renames*. One passage was
not, and applying the test is what showed the two directions: for text this repository's own fixture
produced, **renaming is what restores reproducibility**; for a probe taken outside it, on files the
probe itself named, renaming would make it a transcript of a run nobody performed. ADR-0110's reading of
node's resolver is left as taken, with the date beside it and what the address became. ADR-0142.

**The sixth contract is published, and it is the first time this repository grew a catalogue rather
than founded one.** `number/round@1` carries `published`, its reference is bound at `1.0.0`, and
`contracts/typescript/number/round/` is frozen whole — the seven files, `language.test.ts`, comments
and blank lines included. Two batteries name its folder: `number-round` injects into `reference.ts`
and `number-round-spec` into `contract.ts` and `edge-cases.ts`. **There was no intermediate state and
that is a mechanism rather than a preference**: `every-contract-battery-injects-into-a-folder-a-contract-of-the-catalogue-owns`
is bidirectional, so a battery cannot name the folder until the contract is in the catalogue, and
`local-read-api.ts` sends anything that is not `never-published` through `publishContract`, so
entering the catalogue *is* publishing. Two commits rather than one, for ADR-0106's reason arriving a
second time: `PUBLISHED_FROM` is now a map keyed by address, and the commit that mints a digest can
never name itself. ADR-0143, ADR-0144.

**Writing the batteries found two defects in `reference.ts` hours before it was frozen for life.** It
carried no licence marking. And it annotated its exports with the contract's own types, which
`states-its-own-signature` refuses in as many words: the compiler then enforces conformance at
authoring time and `signature.test-d.ts` becomes **unable to fail** — a guard that cannot fail, in the
file whose subject is proving things. The repair is measured rather than asserted: RS-03 widens
`failureReasons` and was accepted by the compiler before it and is rejected after. **Neither was found
by reading**; both were found by a guard that had never had an instance to fire on.

**Three cells of `number-round` survive, and each is inert for every input rather than unreached.**
They remove the `Object.is(value, -0)` disjunct from the sign, the leading-zero strip from the digit
string, and the explicit zero past its left edge — measured differentially over 2 000 001 values at
four place counts and twenty-five traps at twenty-one, zero disagreements, each with a structural
argument beside the measurement. They state an intent and carry no behaviour, in a file nothing may
edit again.

**The language moved under a published contract for the first time, and the catalogue can now say so.**
Temporal reached stage 4 in March 2026 and Node 26 ships it unflagged; `date/add@1` is frozen for life.
**The field a contract says this with is shut**: `identity.relationToTheLanguage` is inside the digest,
and so is the divergence replay, because a declared file enters `harness` — measured at `ee2d1c1`, both
move `date/add@1` off `94c5acc7…`. So the answer goes in the standing, as `againstTheLanguage`, which is
the **second of two candidates `CONTRACT_STANDING_FIELDS` named on paper before either existed** —
*anything a later measurement attaches to an artefact published without it*. Somebody wrote that sentence
in advance and what filled it was an event nobody here controls. **The contract stands, and a replay says
so rather than a reading of the news**: block 4.4 against Temporal, all forty-three cases of both tables,
**thirty-eight agree and five part for three causes** — and Temporal parts before it can be asked, since
the declared signature takes a `Date` and Temporal offers a replacement type instead. Every figure carries
its limit: the reading is V8 13.6's, which predates stage 4 and still exposes the `TimeZone` and `Calendar`
the specification removed, so the `NaN` cause is published as a suspicion. **`number/parse@1` owes the same
debt and does not get the field**, because ADR-0128 refuses a standing field that restates the frozen half
and its description already enumerates what `Number` and `parseFloat` do — so the test for the next contract
is *does its frozen half already say so*, never *has its language moved*. What the unit could not buy is on
the list below: the debt is unpayable by either symptom, in a sentence frozen with the contracts it
describes. ADR-0150.

**That answer is a section of its own now, and what put it in the wrong place was a reading of the code
rather than of the page.** ADR-0150 rendered the three statements at the tail of *What it does*, so a
reader met `ZonedDateTime.add` under `constrain`, V8 13.6 and a forty-three-case comparison before
*What it is for, and what it is not* — **2 584px of it at 320 and 713 at 1440**, measured. It is
`#against-the-language` now, last above the line, and the distance to the job falls by more than half at
every width: 2 584 → 1 099 at 320, 713 → 321 at 1440, for a page 1.2 % longer at all four. **The order
is what was noticed and the mixture is what was wrong**: `identity.description` is inside the digest and
a re-examination is standing, and one heading carried both as consecutive paragraphs of one weight with
nothing telling a reader which of the two is frozen for the life of the major — the sentence `In
practice` has carried since ADR-0118, missing from the second standing field. A guard refuses that now
over every contract page, seen red on `57afaa7`'s own shape, and
`a-re-examination-reaches-the-reader` stayed green through the red, which is the neighbour measured
rather than asserted. **Two sentences of ADR-0150 were false and one rendering found both**: it declared
the page had never been looked at, and it argued the placement from an adjacency to
`identity.relationToTheLanguage` that `date/add@1` does not declare — true of the code's shape, false of
every rendering of it. Six contract digests unmoved to the byte. ADR-0151.

**And the last known instance of the class this week was spent closing is closed: a guard that could
not see its own population shrink.** `every-source-that-holds-prose-yields-a-paragraph` built its
population by calling `trackedProse()`, the very function a defect would narrow - measured at
`879ac08`, reducing that filter to `.ts` takes the population **from 438 files to 284** and leaves the
guard green, with `tsc` green beside it. Thirty-five per cent gone and nothing said. **The comment
above it defends the other axis in as many words** and is right about it: the two byte-readers are
independent, and that sentence is about what they read rather than about what they are run over.
**The three obvious repairs are refused on measurement rather than on taste**, including the one that
looked strongest: sweeping every tracked file with the guard's own prose test answers true on
`LICENSE`, `wrangler.jsonc` and a `tsconfig.json`, and misses `suites.yml` whose comments are in `#` -
red on its first day for a reason that is not the defect. What replaces it is the reading's own five
**populations** as the expectation, with `trackedProse()` as the answer judged against them, which is
the way round the old guard has not got. **The pair is the evidence and not the red**: on `.md`
removed, the new guard names `records` and `prose` and the old one passes through it, which is what
says they are two claims. The compiler holds the other direction - a population returned and not
declared is `TS2322`. **Its own thinness is published**: it is total over five populations and never
over files, and the thinnest is `prose` at **three**. ADR-0152.

**The seventh contract is published, and the instrument caught its author and its reviewer in the same
sentence.** `object/deep-equal@1` publishes two rows as the witness of what a memoising comparison
does, with a rationale saying such an implementation answers `true` on them. **It answers `false`.**
Measured at `3ec621c` by injecting exactly that defect into the contract's own reference: over the four
forms of the witness the memoising walk parts from the sound one **once**, and only where the keys are
transposed *and* the right-hand `also` holds the very Set member the failed candidate tried - the
published witness holds a fresh object there, and the path is keyed by identity. The rows are right,
the specification is intact, nobody holds code that behaves wrongly; what a reader holds is a false
explanation, in a file inside the digest every lockfile carries.

**What found it was not a review.** That sentence was written by the assistant, read and approved by
the owner, and published - by two people who both knew the danger, on a row that exists *because* one of
them had got it wrong an hour earlier. Neither asked whether the witness witnessed. A mutant did, and a
battery that refuses to call a run healthy when nothing reddens. **That is this project's thesis tested
on the two people who hold it**, and it is better evidence than any argument either could write in its
place.

**No second major, and the price is why rather than the sentiment.** A second major costs a duplicate
the search does not tell apart, the install command on every page of the first ceasing to work, no
folder to live in, and two majors wanting one installed path. The freeze exists to protect what somebody
installed. So the frozen half keeps its sentence as a photograph and `correctionsToFrozenProse` - the
fifth standing field - says what the measurement found, rendered inside the case it corrects because a
reader who meets a correction three screens later has already believed the rationale. **It is not
`againstTheLanguage`**: that field's first term is `whatMoved`, and nothing moved. Two of its four
fields are `executable`, and the guard requiring the quotation to occur in the case's own rationale
**caught its own author on its first run**. `DE-01` survives under a class that did not exist -
`its-witness-is-frozen-out`, a real defect whose witness the contract may no longer carry, the one
survivor kind nothing closes short of a second major. ADR-0160, ADR-0161.

**The gate on the instrument's own reading closed, and it was the trap rather than the bound that
mattered.** `site · W-97` stopped being a wrong answer and became non-termination - measured at
`505fddb`, the mutated comment reader never finishes on `playground.ts`, `literal.ts` and `value.ts`,
the three modules the seventh contract grew - and `runSuite` declared neither a `timeout` nor a
`maxBuffer` and threw its error away with `catch {}`. **A bound alone would have bought nothing**:
`killed-by-typecheck` is derived from an absence, red with no guard named, which is exactly the shape
of a report that was never written, so every hanging cell would have become one more of those and the
repair would have measured nothing while looking finished. Node separates them on `code` and on
nothing else - `ETIMEDOUT`, `ENOBUFS`, and no code at all for an ordinary red; `signal` is `SIGTERM`
for both bounded cases and **`killed` is `undefined` in all six**, so the field that looks like the
answer is not one. `not-measured` cannot be pinned, so a cell that measures it fails the run by
construction. **One addition sufficed and that is measured**: with the unmeasured cases out of it,
`killed-by-typecheck` is a positive reading - a mutant the compiler refuses reddens *with* a report
and with fewer assertions in it. ADR-0162.

**This repository has no dead-code mechanism, and what the unit that went looking produced is a
criterion rather than a purge.** No `knip`, no `ts-prune`, no `depcheck`, and `strict: true` without
`noUnusedLocals` or `noUnusedParameters`; the only pruning that existed is `packaging/reachable.ts`,
which decides what leaves in the archive and not what lives in the tree. **The trap is that
*reachable only from a test* is the normal state of almost everything here** - the manifest declares
a `bin` and no `exports` - so a tool run without a criterion returns a list that is enormous and
almost entirely wrong. What is written down is that **a disappearance nothing noticed is a question
and not a verdict**, with three answers of which one is *delete*: dead, unwatched, or declared
silent. **Zero files are dead out of 302**: the walk does not reach nine and all nine are alive, by
`node <path>` in `suites.yml`, by a child process a guard spawns, or by a path handed to the
analyser - which is where *reached has three spellings and one is walkable* came from. **The rule
proposed for unused exports was refused on its own measurement**: over the 109 non-frozen names their
own file uses, it spares 86 and reaches 23, and the 86 are **every type but one** while the 23 are 22
values - so it separates nothing that *is this a type?* does not, which is a justification wearing
the shape of a rule. **Two defects came out of the reading and neither is tidying**: a fixtures
`tsconfig.json` whose `extends` resolved to a file that does not exist, so the analyser read
submissions under a compiler configured by nobody for the whole life of the file; and one of two
sibling link builders on the domain page typing `../../` where the other composed `rootFrom(own)` -
identical to the character today, so every rendering was right and every guard was green, and they
part the day a domain page changes depth. **The unused parameter is what said so**, which is the
whole argument for the flags. **Both flags are on now**, in the root configuration all six projects
extend, seen biting on a planted local before they were believed; **eighteen names are gone over two
commits**, and the second six exist because turning the flags on refuted the argument for keeping
five of them. Those five were guard addresses no cell pins, read as *unwatched* on a git measurement
and corrected by an argument from the gate: an undeclared never-red guard fails a run, every battery
was green before `1.1.0` reached npm, so those guards are red and merely unpinned. **What the
constants never recorded is the gap that is real** - two of those guards have never been seen red
alone - and that is an entry now rather than five inert names. ADR-0174.

**What does not exist.** The publishing tool. Stages 2 to 7 of the validation pipeline. A second
language.

**Four of those words are an ordinal ADR-0171 measured to name nothing, and they are left standing on
purpose.** Nothing anywhere says what stage 2, 3, 4, 5, 6 or 7 would be, so *stages 2 to 7* lends the
pipeline a shape it does not have — six identifiable stages that happen to be unbuilt — and so does
`README.md`'s *the validation pipeline that judges a third-party implementation exists at its first
stage only*. Those two are the whole population, swept at `5e1e2a9`. **Neither is an entry of the open
list and neither names a closing mechanism**, so rule 1 does not bite on either, which is what
separates them from the `contractAnatomy` entry that was corrected. **What stops them being repaired
is that a true replacement has to say what the pipeline will become**, and that is the question
ADR-0171 opened and deliberately did not close; writing one now would be the guess this whole
discipline refuses. They are recorded rather than corrected because two mentions somebody knows about
are worth more than two somebody rediscovers — and because a reader meeting ADR-0171 would otherwise
find them false by omission. ADR-0171.

**What is broken is one thing, in the published package and not on the site: `yarn dlx toopo` does
not run.** Re-measured on 2026-09-04 against `toopo@1.2.0` as npm serves it, in an empty project with
a `packageManager` of `yarn@4.6.0` obtained through corepack: `yarn dlx toopo@1.2.0 add
string/slugify` exits 1 with nothing written but its own `package.json`, and Yarn names its own cause
— it applies its builtin compatibility patch to `typescript`,
`typescript@patch:…#optional!builtin<compat/typescript>`, and the patch fails with `ENOENT … lstat
'/node_modules/typescript/lib/_tsc.js'` because TypeScript 7 does not hold that file.
**`typescript@7.0.2` is this package's one runtime dependency**, which is what puts it in the way.
The readings it replaces were taken on 2026-08-19 against `1.0.4` and on 2026-08-27 against `1.1.0`,
and each is retaken rather than carried because a release is exactly the event that would have made
it false. **The five manager versions are the first reading's to the digit** — npm 11.12.1, pnpm
10.24.0, bun 1.3.8, yarn 4.6.0 through corepack 0.34.6, on node v24.15.0 — so no row of this table
can be attributed to a manager having changed its mind, which is what a coordinate is for.

**The control is what makes the cause believable rather than plausible.** `yarn dlx cowsay` in the
same shell, the same minute, exits 0 and prints its cow — so Yarn works on this machine and fails on
this package. Without that reading the failure could have been Yarn's, and a cause named without it
would be the thing ADR-0042 refuses.

**Re-reading the population found a fifth form nobody had separated from a fourth, and it is red.**
`npx`, `pnpm dlx` and `bunx` each exit 0 against `1.2.0` and write `lib/toopo/string/slugify.ts`
hashing to `1a8ae9d1…` at 3 332 bytes, which is the blob the catalogue announces — read from the
origin's own snapshot rather than from the client that wrote the file. **`bunx --bun` does not**: it exits
1 on `SyntaxError: Export named 'diff' not found in module 'node:util'`, because that flag runs the
client under Bun's runtime instead of node, and Bun's `node:util` has no `diff`. **It is not a defect
of this package and it is worth writing down anyway.** `packages/cli/diff.ts` imports `diff` from
`node:util`, which arrived in Node 22.15, and the manifest declares `"node": "^22.15.0 || >=24.0.0"` —
so the package says which runtime it needs and Bun's is not it. What a reader meets is a raw
`SyntaxError` where every other refusal here is a sentence. **The population of forms is five and two
of them are red**, and the fourth was only ever measured in one of its two spellings. `deno` is still
not measured, because it is not on this machine, and so it is not published anywhere either.

**And the six commands behind the invocation have now been run from npm, which nothing here had ever
done.** `against-the-origin` installs a tarball this repository builds, and a tarball merely unpacked
dies on `ERR_MODULE_NOT_FOUND: typescript` — only a real installation carries the client and the one
runtime dependency that puts it on disk. Measured at `1.2.0`: `init`, `add`, `list`, `search`,
`update` and both phases of `remove` each exit 0, a non-default folder and a folder holding a space
both land `1a8ae9d1…`, and a directory above the project is refused at `init` with nothing written.
**What moved since 19 August is that last one and only that one** — `toopo@1.0.4 init --dir
../outside` exits **0**, writes a `toopo.json` naming a folder above the project and tells the reader
to commit it, and every command after it exits 1; that is ADR-0208's repair confirmed from npm rather
than from the tree. **And one apparent change was not one**: `add` in a bare project writes
`toopo.json` and says so, which ADR-0138 never recorded, and `1.0.4` does exactly the same — a
behaviour a record did not record reads exactly like a behaviour that moved, and only running the old
version tells them apart. Three findings are published unrepaired, the sharpest being that the
refusal on the `init --dir` path opens *`toopo.json` carries "…"* where no such file exists and the
string came from the command line — the same sentence being exactly true on the reading path.
ADR-0213.

**The three are repaired, and the guard that record priced and refused is built — the first entry of
the open list ever closed by half rather than whole.** A reading taken by hand goes stale at a
publication and at nothing else, so `THE_WAYS_TO_RUN_IT` carries `THE_WAYS_WERE_READ_FOR` and a guard
compares it with `THE_PACKAGE_VERSION`, offline. **It is seen red on the state this repository really
lived in for sixteen days**: the stamp put back to `1.0.4` gives 1 failed of 467, the new guard alone.
**The form was decided by an argument and confirmed by a price, in that order.** A per-form field can
only be reduced to one verdict by taking the oldest, so four values would compute one and a stale row
beside a fresh one would be *silent* — and it costs **912 B raw, 161 B in brotli** across the six
contract pages that serialise the table into `data-ways`, for a value nothing on the page reads. **The
comparison could not sit beside the table and a measurement says so rather than a comment**: the build
writes 36 modules, `address.js` is one and `publication.js` is not, so the import would put the
publication module in every install. **ADR-0213's own spelling of the stamp was refuted by building
it** — *the version its readings were taken against* is red for the whole of every release unit,
because npm does not hold what this tree declares until the push declaring it has published, which is
the one push every verdict must precede. **The refusal names where its folder came from now, on both
paths**, `--dir names "../outside" …` against `toopo.json names "../outside" …`, and a reader who typed
`C:\toopo` is shown `C:\toopo`. **The three doors are three cells and a measurement says so**: the
sentence's own source and the call site's are separable, and the entry point's choice reddens
`the-folder-init-is-given-is-one-this-toopo-can-read` **alone**, with both cheap guards green through
it — so the arm that keeps it can only live where a real process runs. **And the replay named the one
new guard those cells leave un-isolated, which is how it left the bucket the same day**: the sentence
`a-refused-directory-is-named-by-where-it-came-from` and the init guard both read is one function, so
what separates them is a branch `init` does not take — the committed one — and `C-87` reddens the
declaration alone, 195 green beside it. ADR-0214.

It is not repaired here and it is not this list's class - nothing is unkept, something is broken -
so it is written where a session reads first rather than filed as a declaration nobody keeps. What
would close the first is a decision about that runtime dependency, which is a unit of its own and
touches the archive rather than the site; what would close the second is not this repository's to
take, and what it could do instead is refuse a runtime the manifest does not declare with a sentence
rather than a stack.

**What used to stand second here closed on 2026-08-27, and it is written up rather than struck out
because the entry had named its own closing condition and that is the rare half of this file.** `npx
toopo add <a name that does not exist>` aborted on Windows with `0xC0000409`, which git-bash reports
as `127` — the code a POSIX shell keeps for *command not found*. ADR-0168 is the defect, the cause and
the guards; the entry said what would close it, *the number appearing in npm's own listing*, and
`1.1.0` is that number.

**What closed it is the reader and not the release.** Measured on `MINGW64_NT-10.0-22631`, from npm,
both versions in the same shell in the same minute:

| | run 1 | run 2 | run 3 |
| --- | --- | --- | --- |
| `npx toopo@1.0.4 add string/does-not-exist` | 127 | 127 | 127 |
| `npx toopo@1.1.0 add string/does-not-exist` | 1 | 1 | 1 |

The refusal prints and nothing is written — after six refusals the project held `.` and `..` and
nothing else. **The control is what makes that a repair rather than a coincidence**: the two rows are
one command against two archives, and the only thing that differs between them is the change ADR-0168
made.

**The two were never the same shape, and the closure is what proved it rather than the argument
that said so.** The one that closed was repaired everywhere this repository controls and wanted only
a number; the one that remains is unrepaired anywhere and wants a decision about a runtime
dependency, which no release reaches.

**`toopo@1.0.0` is on npm, and the way it got there is what the unit before this one replaced.** It was
published from a keyboard, and the registry's record says so: `maintainers` and `_npmUser` name a personal
account, and `dist` carries the registry's own signature and **no attestation at all** — so the archive a
reader installs could not be tied to the commit or the run that built it, which is the tie every other proof
here is about. A job of `suites.yml` publishes instead, after `needs: site` has reached both matrix
legs, the deployment and the proof against the origin; npm exchanges an identity token GitHub mints and
writes the attestation itself, so **nothing here stores a credential** and there is no ninety-day secret
to renew. ADR-0109. What that job used to wait for was a dispatch carrying a typed word, and ADR-0111 —
below, under its own heading — is why it no longer does.

**The manifest reads `1.1.0`, and it is the first release that is not a correction.** `1.0.0` was
published from a keyboard with no attestation and a personal address frozen into
it; `1.0.1` corrected that artefact and nothing else, its `dist/` byte for byte `1.0.0`'s; `1.0.2`
carried out a defect in the program and was the first whose compiled content differed; `1.0.3` carries
ADR-0110, a feature landing at `lib/toopo/string/slugify.ts` rather than at `…/slugify/slugify.ts`, and
was the first whose change a user meets on their own disk; `1.0.4` corrected neither the program nor
the artefact and **repairs a chain of provenance this
repository broke itself**: ADR-0124 reissued all 506 commits of this graph, and an attestation is
addressing like everything else, so the four published before it name commits of a history that no
longer exists.
`npm view toopo@1.0.3 gitHead` prints one and nothing here resolves it. **The four are named by that
command and never written down**, because a citation of a dead commit inside the paragraph explaining
why they are dead is the defect that paragraph describes — the rule that withdrew `1.0.1`'s tree digest,
applied to an address rather than to a figure.

**What it leaves open cannot be closed, and that is the shape of the entry rather than a regret.** npm
does not republish a version, so those four attestations stay wrong for as long as npm holds them: the
chain is reattached forwards and never backwards. **The population is those four and nothing closes
it.** What *was* checkable was checked — **not one of the four commits they would name in this history
sits in a file a published contract freezes**, so the citation sweep reaches every one of them that is
written down rather than the rewrite's own pass being the only thing that ever held them. Three are
cited, in a record, in `packages/registry/address.ts` and in this file; the fourth is cited nowhere. The
frozen population carries two citations and both are the dead identifier this list already records.

**Measured before the rank was chosen, by the method `1.0.2` established** — `npm pack toopo@1.0.3`
unpacked and compared with what this tree builds — 35 modules either side, 434 251 bytes against
434 709, and **8 of the 35 differing**, which are exactly the eight sources that reach the archive and
moved since the publication. Six moved only inside documentation comments, four of them because the
rewrite replaced an identifier of seven characters by another of seven. **The two that carry code are
ADR-0118's `useCases`, and no command reaches them.** **PATCH is founded on one fact and confirmed by
the others**: the manifest declares a `bin` and no `exports`, so nothing here is importable and the
whole public surface is the grammar of the six commands, which has not moved.
`THE_PUBLISHED_IMPLEMENTATION_VERSION` stays at `1.0.0`: a version is half of an implementation's
address, nothing it addresses moved, and the publication is the event ADR-0106 cut that tie for.

**`1.1.0` is the first MINOR, and what decided it is the half of `1.0.4`'s own rule that nobody had
read.** That rule is *founded on one fact and confirmed by two*, and the fact is intact: measured at
`0fd53e1`, the rendered usage is **547 bytes either side and identical**, and the `Command` union,
everything from `ParsedArguments` to the end of `arguments.ts`, and `THE_WRITE_DISCIPLINE` are byte for
byte what they were at `f95c4fa` — with the one reader of `argv` the archive holds, `command.ts`'s call
to `parseArguments`, untouched across 175 commits. No flag moved and no command was added. **What is
false here is the confirmation**, which is the clause that was doing the work: *the two modules carrying
code carry functions no command reaches*. `toopo search` reaches what moved.

**Measured against the two clients rather than against the diff.** `toopo@1.0.4` as npm serves it and
the archive this tree builds, both asked of the live origin in the same minute, over 25 queries taken
from the records that name them: **17 unchanged, 6 gained an answer, 2 lost one, 0 answered a different
contract first.** `string to integer` is the shape of the six — silent at `1.0.4`, `number/parse@1` at
the candidate — and the mechanism is `alsoFoundBy`, whose own comment in `response.ts` says why the gain
can never reach the older client: *a field added is ignored by a client that has never heard of it*. A
capability the new archive has and the old one cannot acquire by waiting is MINOR by definition, and
PATCH would promise a reader nothing to learn where there are six things.

**Two answers are lost and one of them was right, which is written beside the balance rather than
inside it.** `round robin` answered `number/round@1` at `1.0.4` and the candidate is silent, which is
ADR-0154's floor removing a wrong answer. **`slugify a blog post` answered `string/slugify@1` and the
candidate is silent**, which is a right answer withdrawn — ADR-0154 assumed that cost and this release
is what carries it to a reader. It is not MAJOR, because nothing this catalogue publishes promises that
a given query answers a given contract, and the grammar is what a reader is entitled to. It is an entry
of the open list below.

**The method is `1.0.2`'s, and the two figures it produces disagree, which is what it exists to show.**
`npm pack toopo@1.0.4` unpacked and compared with what this tree builds, at `0fd53e1`: **35 modules
either side, 434 709 bytes against 469 558, and 15 of 36 addresses differing** — 13 whose content moved,
plus `packages/cli/search.js` gone and `packages/registry/search.js` arrived, which is one module that
changed folder. **Git says 16 sources moved and the archive says 13**, and the two that separate them
are `install.ts` and `report.ts`: both moved only inside text the compiler erases — a comment within
`export type Installation`, and an `import type` specifier — so their JavaScript is identical to the
byte, `13 123` against `13 123`. **It is not that comments are stripped**: they reach the archive, and
these two happened to sit inside an erased type alias and an erased import. A reading of the diff counts
them; only the artefact says they ship nothing.

**No anchoring commit follows, and that is ADR-0106 read rather than assumed.** It asks for one because
`implementationSnapshot` carries `version`, so the commit minting `reference@1.0.0` creates four
addresses no earlier commit binds and cannot name itself as where they were minted. This release mints
nothing: no contract is published and `THE_PUBLISHED_IMPLEMENTATION_VERSION` does not move.
`THE_PACKAGE_VERSION` is imported by no module of the product — `publication.test.ts` and
`packaging/archive.test.ts` are its only readers and both equate it with the manifest — so it enters no
snapshot by construction rather than by luck, and the ledger's twelve bindings are identical to the byte
across this release.

**It landed, and the reading is npm's rather than this repository's.** Run `33078125142` on `1cf8ecd`,
**30 jobs and 30 green** — the 23 batteries of `every-battery`, both matrix legs of `suites`, `site`,
`version` and `publish` — in 28 min 40. npm holds six versions and `latest` answers `1.1.0`. The
attestation's `gitHead` is `1cf8ecd`, **the commit that moves the version and not the one that argues
it**, which is what the two-commit order was chosen for; its provenance names `.github/workflows/suites.yml`,
`refs/heads/main`, event `push`, and the two numeric identifiers a rename does not move, `1319617655`
and `280416883`. `_npmUser` is `GitHub Actions`, so no keyboard touched it.

**And a listing read 52 seconds after the publishing job printed `+ toopo@1.1.0` did not hold it**, with
`dist-tags.latest` still answering `1.0.4` and the version itself answering 404 — a green job beside a
registry saying the thing does not exist, which is the shape in which a cause gets invented. npm's own
publishing output says it is processing. The lesson is in `packaging/what-npm-holds.ts` beside the one
about a request and a listing, because that is the module whose whole subject is asking npm what it
has.

**And the dispatch is gone: the number asks for the publication.** It was two gestures for one decision —
a version decided in a commit, a run asked for from a menu afterwards — and between them the tree was
corrected and the package was not, twice in two days, with nothing saying so. The third day it produced a
red: a dispatch of a tree declaring `1.0.2`, refused by npm because `1.0.2` was already published. A job
now reads the listing of versions npm holds, compares it with what this checkout declares, and the
publishing job fires on the difference. **The condition is deliberately not *did this commit move the
number***, which is a proxy: measured at `d8a25ae`, that comparison selects correctly on all five of the
440 commits `HEAD` reaches where the version differs from its parent's, and it would still miss a bump
pushed under a later commit, because GitHub runs a workflow once per push and on the tip. Asking the
registry has no such case, and it is asked as a **listing** rather than as `dist-tags.latest`, which is a
pointer that would go on looking right while meaning something else. **The finding worth carrying out of
this unit is elsewhere**: the line keeping a publication from being cancelled was keyed to
`github.event_name != 'workflow_dispatch'`, so moving the trigger onto a push would have quietly repealed
it — the sentence never became wrong, it stopped being attached to anything. Concurrency is evaluated
before any job runs and so cannot know whether a run will publish; `main` is therefore never cancelled.
ADR-0111.

**The tree digest `1.0.1` published here is withdrawn rather than carried forward.** It appeared twice,
both times in prose, and nothing in this repository computes it — so no reader could rebuild it and it
established nothing that the counts and the per-file digests beside it did not already establish. What
replaces it is the comparison any reader can take with `npm pack` and a digest tool.

**The declared origin serves this catalogue, and that is the half that changed.** `main` builds the
tree in CI and `wrangler` uploads it to Cloudflare Pages. Measured at `27d1dbb` over **all 76 addresses
the tree writes** — not a sample of them: every one answers, the 36 addressed by content carry the
year-long `Cache-Control` `cachePolicyFor` declares, `_headers` answers 404, and an address nothing was
ever served at answers 404 with the page that says exactly that. **`@` is served directly, with no
redirect**, which is what the move to Pages bought and what settles the question the previous host
opened. `X-Robots-Tag: noindex` is absent here and present on `toopo.pages.dev`: the host rule retires
itself as designed, and both halves were read in one sweep because either alone proves nothing.
ADR-0103 carries the table, the two headers on served addresses that this repository does not decide,
and the one shape the sweep could not reach.

**And an installed `toopo` has now been seen asking it.** A tarball built here, installed into a project
holding nothing, downloads a feature from the declared origin, and the bytes that land hash to the
digest the registry announced — measured end to end, in the one suite of this repository that reaches a
live host, kept out of every battery so that nothing which replays depends on one. It is the eighth
suite and the last proof before a package is published. ADR-0104.

**A feature now lands as a file, and this was the last unit that could take that decision.** The
installed path is `lib/toopo/string/slugify.ts` and no longer `…/slugify/slugify.ts`; a second file, if
one ever exists, lands in a folder of the same name **beside** the entry rather than around it. What
decided it is that the two layouts are identical while no feature has two files and this one is
strictly better on the day one does — so there was no trade to make. **The folder is a door and not a
feature**: `referenceImplementationOf` filters an implementation's files to `reference.ts`, so nothing
can put anything in that folder until a separate unit opens that filter. The window was closing because
an installed path lives in every user's lockfile, and today there is one. Measured against `tsc` 7.0.2
under all three module resolutions and against four bundlers covering three resolver implementations,
differentially — both layouts side by side, so that a failure of the probe's environment could not read
as a failure of the shape — with *resolved* meaning the helper's value found inside the produced bundle
rather than an exit code. Node's own standard library carries the shape 12 times in the 69 entries of
`lib/`. **One user-visible cost, accepted rather than smoothed:** a file the user has edited is kept
where it is and the new copy written beside it, so they hold two. ADR-0110.

**The site has a visual system, and the contract page is built on it — the page a stranger lands on
from a search, and 99 % of this site at a thousand entries.** Six type sizes and no seventh, one
spacing unit every length is a multiple of by construction, colour roles rather than colours, one
accent, dark by `prefers-color-scheme` with no button and nothing remembered. **The accent means *you
can act on this* or *you are here*, and never a verdict**: this catalogue publishes every mutant its
suite did not catch beside the ones it did, and a colour survives neither `toText` nor `toMarkdown`, so a page
that sorted its own evidence by colour would say what its reading does not. The page is a card — name,
sentence, command, four figures, signature — and then everything, with nothing behind a fold, which is
the shape a differential trial on `date/add@1` and its 50 cases settled. **Two greys and not three**:
the mock-ups' fourth answers 2.64:1 on light paper while carrying the case identifier, and the value
they draw `dim` at answers 4.24:1 on a case a reader has just followed a link to. Both readings are
arithmetic now rather than something somebody remembered to take. ADR-0115, ADR-0116.

**The web font is refused, and coverage is what refused it rather than weight.** Measured on
`@fontsource/ibm-plex-mono@5.3.0`: two weights of the Latin subset is 29 596 B and three is 45 216 B,
against an estimate of ~26 kB. What decides it is that Plex's `latin` range carries U+2191 and U+2193
and **not U+2192** — the arrow between every call and its answer, 157 times across the four pages — and
that `string/slugify@1` alone carries 59 distinct mono code points outside it, 57 outside `latin-ext`
too. Those are what that contract settles cases *about*. The system stack renders them because an
operating system composes fallbacks a page cannot ship. **What the refusal costs is named rather than
smoothed**: `ui-monospace` is a different face on every platform and no reading here covers more than
this machine; what survives is what was specified in units that travel, the case column in `ch` and
the scale in `rem`. ADR-0115.

**A contract page now says what the function is for in real life, and where that text lives was the
decision.** `string/slugify@1` carries four use cases — a call as somebody makes it, and the one thing
to know before relying on it. It is published, so both obvious homes were closed by permanent rule 6
and both were measured rather than reasoned about: a field in `identity` moves its digest from
`855107da…` to `bd256afd…`, and **one comment appended to `contract.ts` moves it to `84403f0c…`**,
because `contractSnapshot` freezes the seven files' digests too. So the field is **standing** — the
mechanism written for *may the registry change its mind about this after publication*, whose own
comment had named this field before it existed. Measured: the eight ledger digests are identical to
the byte with four use cases declared, and `npm run freeze` is green. The page's sentence *nothing here
is part of the contract* stops being an assertion. It carries no identifier, because nothing cites it
and an address on rewritable prose will one day name something else; the warning is a required field,
because that is what a use case is worth reading for. ADR-0118.

**And the page is read in two halves.** Measured at `f05951f`: 3 800 visible words over eight sections
of one weight, of which **2 482 — two thirds of everything under a heading — were the settled cases**.
The complaint was never the length. Above the line: what it does, a form, the jobs it is for — 754
words. Below: the signature, the cases, the properties, the profiles, what a reader can check — 3 262.
**Nothing is folded**, and the mock-up this cut came from proposed folding by group; ADR-0116 settled
that against a differential trial, and the line is written into the record so it does not return
through a later mock-up. `the-rail-of-a-page-names-every-section-of-it-and-only-those` needed no
change, which is what a derived table of contents buys. ADR-0119.

**A domain has a page, and every page now says where in the catalogue you are standing.** The level
between the catalogue and a contract was a 404: `/typescript/string/` is where a reader climbs to from
a search result, and it is the only unit a navigation can be built on at a thousand contracts. Three
pages and not four **on the day ADR-0121 landed** — `array` held one entry, refused before publication,
and a page carrying an empty list answered nothing the refusals page answered less well. **There are
four now**: ADR-0127 gave the refused contract an address, so `/typescript/array/` has something to
list and the tree writes 13 pages plus a 404, measured at `ab2765c` off the emission's own count. **Its
opening sentence is composed and never
written**: the mock-up's hand-written line would have been a fifth statement of what is in a domain,
beside the list under it, the index, the sitemap and each contract's summary, and it is the one a
reader believes. Every term is read off the registry, so a fifth contract lands in that sentence with
nobody editing it. The column is a *sibling* of the rail rather than a part of it, because
`the-rail-of-a-page-names-every-section-of-it-and-only-those` requires every link inside `.rail` to be
a section of the page — and it is placed by the grid rather than reordered, so the document a screen
reader announces is the one a sighted reader sees. ADR-0121.

**The measure was written in characters and reached every face, and the ceiling had never been held
before.** Measured at `81bf9bc` over 688 prose elements, one Range per character grouped by line box:
**255 lines over 75 characters, worst 169**. The rule existed — `body` laid its content out in a 74ch
column — and `.shell` spanned the whole width by declaration with nothing under it re-establishing one.
**The half worth keeping is the other one, and it survives the ceiling's removal**: `ch` is the advance
of `0`, so a container capped in `ch` under-constrains anything set smaller than it, and the
169-character line was small print in a wide box. The measure was therefore declared on the element
that carries the prose, and that declaration is gone — ADR-0134, below. The constant is a measurement
and not arithmetic, and it carries the method's own drift: density moves when the column moves, 1.339
before and 1.393 after, so 1.04 is applied on ADR-0077's rule rather than noted.

**It was re-taken when the columns moved, and ADR-0122 holds that reading rather than this line.**
What is worth carrying here is that the two readings are not the same population: the second sweeps
every element the rule names — `h1, h2, h3, h4, p, li` — over every page of the tree, and groups
characters into line boxes by vertical overlap rather than by a rounded `top`, so a `code` span set
smaller stays on the line a reader sees it on. **The `910` above is not reproducible by it**, it is
four to five times short of what that method counts, and nothing here says which population it was.

**A ceiling belongs to the block and never to the column, and the owner found that on his own screen
before any check here did.** Three container ceilings were in play and the smallest was the one named:
`main` at 45rem, `.shell` at 78rem — which named no question anywhere in this repository — and the
body's own grid track at a *measure*, which is a bound on a line applied to a box. Only the domain and
contract pages carry a `.shell`, so that third one bound the card, the code blocks and the lists of
the other four pages at every width. Measured at `456ee44` over all eleven files of HTML at four
widths: **17.5% of a 2 560px screen on the front page, 38.7% on a contract page**. Each block now says
what it is worth — a card and a code block as wide as their content, a case table one width for every
row — and the layout is derived from the widest of them, `2 * measure + gap`, which resolves within
3px of the 78rem it replaces. After: **46% on a contract page**, and the settled cases render their
157 calls in 223 lines instead of 325. **Three pages did not move at all, and that is the answer**:
every child of them is prose, prose is bounded on the line, and the container was never what bound
them. ADR-0122.

**A wide screen is now filled by a column, and the line did not move.** ADR-0122 named this unit in
its own reopening section — the front page's 19.8% was a page whose every element is prose, which is
evidence that no ceiling made it narrow and not evidence that the page was right. A contract page's
table of contents crosses to the right of the content, the front page gains a column carrying the
three sections it used to queue under the catalogue, and both lists of contracts go two abreast where
there is room. Measured over all eleven pages at 1440, 1920 and 2560, by ADR-0122's own definition of
the share: at 2 560 the front page **19.8% → 48.1%**, a contract page **45.9% → 55.9%**,
`/typescript/string/` **29.6% → 45.8%**. The measure held, which was the thing at risk: **0 of 11 964
prose lines over 75 characters, worst 70**, against 0 of 11 913, worst 70. **Not one word of the site
changed** — the three sections keep their `h2`, so the outline, the Markdown twin and the sitemap are
identical, and the only matter added is four figures derived from the batteries. **The domain page
keeps two columns**, because a third would have carried the four figures its opening sentence already
composes and ADR-0121 composed them precisely so they would not be stated a fifth time. ADR-0123.

**`--the-shortest-line: 45` is the shape to reach for, and it is worth more than the layout it
bought.** The column of secondary matter needed a width, and the stylesheet had declared the answer
for a year without deriving it: *45 to 75 characters is the span a line stays readable across*, of
which only the top was a length. **No number entered that file that was not already argued for in
it.** The same move settled the two-abreast list with no breakpoint at all — `auto-fit` over a floor
of one measure was two columns exactly where the column was two measures wide — so the value the owner
will flip is a length in the palette and never a grid to restructure. **The floor is untouched and that
arithmetic is not**: ADR-0134 took the column's width away, so the list now folds at five widths
instead of one and the floor keeps its value without keeping its reason.

**Three widths in that stylesheet are typed, and the language is why rather than the author.** `var()`
is not allowed in a media query's condition, in any browser. The three-column threshold is the
arithmetic of its own tracks taken on one machine and rounded up; it is written beside that arithmetic
and degrades by squeezing rather than overflowing. **This line read *one width* until ADR-0132, and so
did the comment above that threshold** — both of them saying, of the one condition that carries its
argument, that it was the only one. `52rem` and `64rem` carry no comment at all. All three are on the
list below as the thing nothing keeps.

**Four defects came out of a browser and out of no static check**, which is the third time this
repository has paid for that class. Two rules 13px apart where a list item and the heading inside it
each drew one; and section gaps of 0, 8 and 16 where the system declares one — every instance a
`margin` shorthand on a class silently outranking `h2 + p` on specificity. Measured after: 100 section
headings at 12px and nothing touching.

**A void is matter that is missing and never a ceiling to remove, and that sentence cost two refuted
repairs to reach.** The owner read a contract page at 1440 and saw the centre column half empty. His
three figures were exact and his sentence was not — `main` holds twelve case tables at 905 — and the
measurement that replaces it is worse: at 1440 **the median block of `number/parse@1` reaches 46% of
its column**, 12 of 71 blocks reach 90%, and on a refused contract and the one-contract family pages
**no block reaches 90% at all**. Nothing moved between 1280 and 2560. Both repairs he proposed were
built in a browser and both failed: tightening the column with `fit-content` **breaks the two-abreast
list**, because under an indefinite constraint `repeat(auto-fit, …)` repeats *once* and a track that
asks a list how wide it wants to be is told *one contract*; widening the card moves the void inside it,
which is ADR-0122's own recorded objection one floor down. What filled it instead was the page's own
matter — the card is the column's width and read across, the opening was its sections two abreast where
there was room. **The table of contents was measured for that job and refused**: a sticky rail and a
905px case row cannot share a column, so it would accompany 13.7% of a page instead of all of it. The
measure held at nine widths, 0 of 4 429 lines over 75, worst 69, and a contract page's prose was 447 in
933. **Every clause of that state has since been withdrawn by ADR-0134** — the ceiling, the two-abreast
opening and the column that did not move between 1280 and 2560 — and the card being the column's width
is the one that survives, now at every screen. ADR-0132.

**The divisor did not move, and the record says why instead of leaving it to look like an oversight.**
Re-measured over every file of HTML in the tree, the densest line at the measure was 1.3342 characters
per ch against the 1.393 declared, so the page rendered 69 where it allowed 75 — an 8.6% gap, not the
15% a one-page reading suggested. It could not be spent: at the density re-measured the worst line went
to 72 and the void beside the card *grew* from 353 to 368, and at the density with no margin at all one
line reached 77. **Density is not stationary and a column is two lines wide**, so widening prose to fill
a column widens the column by more than it fills. **The whole of that argument was about a ceiling and
ADR-0134 removed the ceiling**; the divisor still divides, and what it now sizes is a call column and
half a card.

**A page is long in lines, and the line count is the reading this repository had never taken.** The
owner read a contract page, judged *What lands in your project* useless two days after it was proposed,
and asked whether the length is the matter at all or *just the line breaks*. Cutting prose is not
available — 90% of the page is the frozen half of a contract — so the question was answered by
measurement instead. Every earlier reading counted lines to police a ceiling and answered with a worst
and a median; **none asked how many lines a reader is handed.** Measured at `00be46c` over the four
contract pages at 1440, by ADR-0122's own method: `number/parse@1` renders **594 lines of prose and 630
of every kind**, median 56, worst 69, 0 over 75. The removal is worth **9 lines of 594**. At the widest
column the declared 75 allows — measured in a browser rather than projected — it is **572, which is
3.7%**, and at a packing no line-breaker performs, `ceil(characters / 75)` block by block, **511, which
is 14%**. So the wrapping is not what makes the page long, and that is a negative worth as much as a
positive: it says the next unit is not a cut. **The two populations are declared in the record** because
one of them is new here — *prose* is `h1, h2, h3, h4, p, li`, the set the stylesheet bounded, and *every
rendered line* is what a reader scrolls past. They differ by 5 to 7%: a settled case renders as three
`p`s, so the case tables were already inside the measure's own population. **The next unit was not a cut
and was not a wrapping either**: ADR-0134 took the ceiling out instead of widening toward it, and the
same page fell from 580 rendered prose lines at 1440 to 397. The 3.7% is exact for a question that had
a ceiling in it. ADR-0133.

**And what a section costs in height is a row of a grid, never its own height.** The block removed was
**468px on all four pages and stood beside a taller sibling on all four**, so it occupied no height at
all: what the removal buys is whichever row the two-column opening drops when it re-packs. Three pages
lost 676 to 869px; **`string/slugify@1` lost exactly zero**, its rows re-packing without losing one.
That is ADR-0132's void one floor down — the block was not in the way — and it was measured because the
zero looked like a broken probe. **The figure worth more than either the cut or the wrapping is
elsewhere and is not acted on**: by union of vertical extents over `main`, **a quarter of a contract
page is the gap between one block and the next** — 4 161px of 16 461 on `number/parse@1`, stable within
1.7 points across four pages — against 707px for the section and 485px for reaching the declared line
length. The spacing scale is ADR-0115's and this unit was forbidden the layout, so it is written down
rather than spent.

**A width stated in characters and a layout that follows the screen are contradictory, and the owner
chose the screen.** He read the site in an inspector and decided twice, with the measurement in front
of him: no defined size, the size changes with the screen. `h1, h2, h3, h4, p, li { max-width:
var(--measure) }` is the rule that named it. **What the decision actually reached was four times
larger, and nobody had ever read it as the same limit**: `--two-columns` was `2 * --measure + gap` —
the same ceiling stated in characters, one floor up — and it bounded the body's middle track, all
three shell arrangements and the use-case grid. **A limit derived from a limit that is being removed is
an orphan**, and this one had survived three units that each added a consumer to it. The two-abreast
opening ADR-0132 built is gone with it, and the `div` and `section`s that existed only so a grid had
something to place are gone with that.

**Measured at nine widths over all fourteen files of HTML, in a browser, light and dark.** Before, the
tree rendered **4 188 prose lines, median 56, worst 69, at 1280 and at 1440 and at 1600 and at 1920 and
at 2560 and at 3840** — six widths, one reading, because the column was capped and the screen was not.
After, every width answers differently: at 3840 the tree renders **1 471 lines** and the method page
falls from 56 665px of height to **16 698**, its ink from 13.8% of the screen to **98.9%**. **Nothing
breaks**: zero pages scroll sideways and zero blocks overlap at any of the nine widths, and the single
element painted outside the viewport — the copy control at 390 — reads identically before and after and
is older than this unit. **What it costs is the line**: the method page's worst goes from 69 characters
to **663** at 3840 and its median from 57 to 226, and `45 to 75 characters is the span a line stays
readable across` is still declared in the stylesheet, still true, and now enforced by nothing. Whether
that wants a ceiling is the owner's to decide and the figures are in the record. ADR-0134.

**A box on a phone now gives up its content, and the rule that decides it is about the text rather
than about the element.** Four defects, one shape: the install command was cut off on three of the
four published contracts at 390 and on all four at 320, taking the copy control off the screen with
it; four to six code blocks per contract page scrolled sideways, worst **2.11× its own window**, so a
reader saw under half of a signature; every one of the nineteen destinations of two contract pages'
tables of contents landed **25px behind the sticky bar**; and the site introduced itself as `toop`
over `o` on every page below about 479. Measured warm on both sides over 14 pages × 21 widths × 2
themes: **2 541px of hidden command, 197 scrolling blocks, 142 broken wordmarks and 12 pages painting
outside the viewport, all to zero.** Above 736 the geometry does not move at all; below it the cost is
**+0.05% of page length at 390** and a bar shorter at every width.

**What the rule separates is what the argument here had never been tested against.** *A code block
scrolls rather than wraps* was written about a block wider than its content, never about a screen
narrower than a type declaration — so a `pre` now folds where the language allows and scrolls only
where it does not, which keeps the old sentence for the case it was right about. **And repairing the
wordmark made the sticky bar worse before anything made it better**: the bar's height is the menu's
and never the wordmark's, so giving the name its width back took it from the menu, which wrapped one
row further and paid the height straight back — 89.1px to 130.1px at 320, measured, which is why the
menu's own row gap is in that unit. ADR-0135.

**The page a reader arrives at is a shelf now, and two recorded decisions were overruled with their
scope written down.** It lists every contract a reader can install — six, each with the signature its
record froze, its summary and the command that installs it — and nothing on it needs JavaScript.
**ADR-0140's conclusion falls and its argument does not**: it refused `add domain/function` here
because *the constraint was right and its form was a template*, and a shelf privileges no contract by
showing all of them, so the template refusal is kept in the form that suits the page — every `toopo
add` names an address this catalogue holds, asserted. **The first draft of the rewritten guard would
have left W-91 green**, because the new claim was about coverage and said nothing about templates; the
half of ADR-0140 that was *argued* would have been enforced by nothing, and it was found by reading the
cell rather than by running it. **`catalogue-page.ts`'s measured rule is suspended rather than
refuted** — *one field per level and never two*, with the figure that one entry cost 443 bytes and that
a summary under every name *is the whole page at a hundred* — so *the day the shelf stops fitting on a
screen* is a reopening condition rather than an objection nobody recorded. **The heading names what the
data carries**: the artboard's is `Popular functions`, nothing here ranks anything, permanent rule 1
forbids the call that would produce a figure, and no usage signal exists in the tree — so it reads
*What you can install*, and the guard asserts the count against the index, which is the arm a heading
could quietly break. **The site shows six where `README.md` names seven**, deliberately: two surfaces,
two audiences, and **no guard asserted the two were equal** — swept before the page was written, the
README compares itself to the catalogue and the site to the index, both pointing at the registry rather
than at each other. The domains are links to domain pages rather than controls, which is what keeps
them working with nothing running and what keeps `/catalogue/` reachable. Three perturbations, three
reds, each alone. **One arm has no cheap mutant and is named**: *nothing turned down appears here*
cannot be reddened by a one-line edit, because `Domain.held` holds only what is installable.
ADR-0179, ADR-0180, ADR-0181.

**The site has a component layer, and the owner's eye found the defect that argues for it — with the
victim inverted.** He saw the `all` pill drawn squarer than its neighbours. Measured at `f5bab84` in a
browser, `all` rendered at the artboard's **6px, `5px 11px`, 12px** and its four neighbours at **16px,
`4px 12px`, 11px** — so the one pill that looked wrong was the only one that was right, and the four
that looked right were the four that were wrong. `ul.chips a`, written for the contract page's group
bar, beat `a.chip` by one type of specificity; `all` escaped only by being a `span`, which no `a`
selector reaches. **Three more instances were found by reading and a fourth by the new guard on its
first run**: the copy control, whose markup `start.ts` already single-sourced and whose paint was two —
radius `0px`, 13px, 37.05px tall against radius `5px`, 11px, 25.81px, both measured live; the section
label at `.08em` against `.09em`; the card, reached as `.offers > li` because `.card` meant something
else already; and `.recent h2`, which nobody had read. Every one is one fault: **a component painted
from its container**, so its look belonged to whichever page it stood in. Five components now derive
their class from a closed union and carry their rules beside their markup, so a second drawing of one
thing is a duplicate key rather than a thing nobody noticed, and a drawing writes its selectors against
`&` so it cannot spell one aimed elsewhere. **The half no type reaches is the half the defect came
through** — `ul.chips a` never names `.chip` — so a guard asks happy-dom's matcher over every component
element of every page instead of sweeping selector text, and restoring the defect reddens it alone.
**The badge keeps two paddings and that is an intention**: measured on the artboard, `2px 6px` with no
border and `1px 5px` with a `1px` one are **both 18px tall**, so the rule subtracts the border rather
than declaring two numbers that differ by it. The addresses do not move, 130 files and 73 answers
either side. **What it does not buy is written where somebody reaching for it arrives**: a page can
still write a class by hand, the compiler refusing one is an entry of the list below, and that entry
carries a number that descends — 80 hand-written class names before, 70 after. ADR-0183.

**And the site is written from the narrow width up, with every type size following the reader.** The
owner read the front page at 320 and found the masthead unreadable — `How we verify` in four vertical
pieces, `GitHub` a letter to a line, the field truncated to `Sea`, a bar rendering about 180px where it
declares 56. **Two faults were tangled and they are separate**: measured at `f2ea3a1`, `style.ts` held
46 pixel lengths and **no pixel type size** before the redesign and 99 of which **13 were type sizes**
after it, and a pixel type size ignores a reader's own font-size setting — but the breaking at 320 is
not caused by the pixels, because five flex children do not fit in 272px at any unit. **Twenty-one
pixel type sizes are now none**, eight on the scale's own steps and twelve in `--a-point`, and every
one is byte-identical at the default while doubling at a 200 % root. **Three of the five techniques
proposed were already in use** — a container query, `auto-fill`/`minmax`/`min()` at seven and fifteen
occurrences, `:has()` at ten — and two more were refused on measurements rather than on effort: a
container query on the offer card, because the card is **342.7px at 1440 and 342px at 390** and a query
on a box whose width does not move buys nothing; and a fluid headline, because a clamp needs a floor
and nothing derives one, the longest word being 180px inside a 272px column. **Two of the three repairs
needed no width condition at all** — the bar fits once the menu carries a mark, and the row's name took
a basis where it took a floor. The three that were added are derived: **26rem** where the field first
shows its placeholder, **11rem** where the bar stops breaking, **12.5rem** where the row does. **The
last two are in rem and that is the point**: a condition in rem asks whether the window is narrow *for
the text in it*, 320px being 20rem at the default and 10rem at 200 %. Swept over 17 pages and 12
widths from 320 to 2560, and the front page at every 2px from 320 to 520: **zero faults**. What the
reading could not reach is published — in a media query `rem` resolves against the *initial* font size,
so a scripted root override moves every length and no condition, and whether a real 200 % setting fires
those two is the one part of the acceptance this repository cannot take for itself. ADR-0184, ADR-0185.

**A separator only a stylesheet carried was a separator for nobody, and the guard that could not see it
now can.** The shelf's domain filter drew a name and a count told apart by `margin-left: var(--s)`, so
`https://toopo.dev/index.md` served `- all6`, `- number2`, `- date1`, `- string2`, `- object1` — the one
shape a page can be wrong in that only a projection shows. **The repair was searched for before it was
invented and this repository had already answered twice**: `quantity.ts`'s `figure` writes the separator
into the second fragment's own text node, and its header records *this very defect met once already*, a
column that left the space out publishing `**672**defect cells injected`. So the mechanism is settled
and only the character was chosen — ` · ` rather than a space, because a space repairs `all6` and
produces `- number 2`, `- date 1` and `- object 1`, which read as ordinals. `margin-left` went with it,
the gap being stated once now. **The projection table was the shape to reach for and one fact refuses
it**: `span` is the tag the count uses *and* the tag an address split for highlighting uses, so making
it separate renders `number/ parse` on every page; and no inline tag separates in the reading at all.
**The guard is widened rather than left**, on a rule and never a list — between two elements only white
space can make a boundary visible, and between an element and prose the character the author typed can,
so what remains is a seam between two word characters. Over ADR-0193's 22 pairs it reports **5 and
allows 17**, exactly. `W-162` is the cell the arm was owing — the entry's own witness `W-64` had been
deleted by ADR-0189 — and it is **red alone, 183 guards green beside it**. **And the second defect's
witness was misnamed in both records that carry it**: `W-12` is *killed*, because the description and
the card read one derivation and it moves them together. What the duplication shielded is the card's
cost figure being removed — **green on six of six before, red on six of six after**. `/index.md` goes
3 592 → **3 612 B**, twenty bytes of arithmetic. ADR-0194.

**A rule this stylesheet paints is a rule a page writes, and the population is what decided there
would be a guard at all.** ADR-0195 found `ul.contracts` painting markup no page emits and left it,
because deleting a rule changes what a reader is served. Swept at `42cb81d` over the eight documents
this site writes: the served sheet declares **263 selectors, 212 distinct once states and
pseudo-elements are stripped** — **135 painted by a page as served, 21 by what the module every page
runs builds, 9 only when a reader acts, and 47 by nothing at all.** The nine are why the sweep drives
controls rather than reading markup: both themes are a click, the invitation and its examples are the
field taking focus, and an answer's name, summary and mark are a query the catalogue answers with a
contract it turned down. **The reading rule was written before the sweep and the sweep was refused an
exemption list**, because a list of selectors excused from having a subject grows by one every time
somebody writes a rule nothing paints. The 47 are one class in eleven spellings and every one is a
page that no longer exists — 25 of shell and navigation column, 6 of the retired catalogue and domain
lists, and `h4` on a site emitting none. **Confirmed by a second path that shares nothing with the
first**: the tree on disk holds 8 files of HTML carrying 68 distinct classes, not one of the
seventeen names among them, no `<h4>`, and `.call` on `a` and `p` and never on a heading. The sheet
goes **27 036 → 23 609 B** and the geometry declarations **60 → 48**. **Seen red 47 times out of 47**,
each naming its own selector and each alone. ADR-0197.

**And the unit found a defect it was not looking for: what the stylesheet contains depends on the
order of a guard's import list.** `document.ts` imports the served sheet, which imports `style.ts`,
which imports `components.ts`, which imports `document.ts`. Node's own loader throws on the loser of
that cycle; the transform the test runner applies answers `undefined`, silently. Measured over two
files differing only in their import order: entered through `document.js` the sheet is **27 036 B**,
entered through `components.js` **21 096 B** — the 5 949 B of component rules replaced by the nine
characters of `undefined`, with `THE_COMPONENT_RULES` measuring 5 949 either way. **One file was
already in that state**: `components.test.ts` names `./components.js` first, so
`a-component-is-painted-by-its-own-rules-and-by-nothing-else` was sweeping a sheet with no component
rules in it, and **a rule one component writes about another was outside its population** — measured
with `& .badge { color: red }` added to the offer's drawing, which is that exact fault: **green**.
**The built tree is not affected and that was checked**: the front page on disk carries the whole
sheet. The blast radius is guards. **The cycle is not broken here and the price is written down**: the
only break is `components.ts` giving up `el` and `text` to a leaf module — an import line in each of
the nine modules that take them from `document.js` — or `toHtml` giving up the stylesheet, and both
are a decision about how the folder is arranged rather than about what the sheet paints. What stands
in its place is a precondition guard refusing a served sheet that holds a value which failed to
resolve, and the compiler: deleting the interpolation is `TS6133`, which ADR-0174's flags turned on.
**And the instrument refused the unit's first run**: that guard was declared under the battery's
`unprobedRegions` on the grounds that no rewritten line could reach it, and W-24 - which serves the
stylesheet as a link rather than carrying it - reddens it along with eight others. The declaration was
a reading of the defect and not of the battery, which is this file's own recurring class arriving on
the unit that was written to close one. ADR-0197.

**The cycle is cut, and what decided between the two ways out is a property the file declares rather
than a count.** ADR-0197 named both: the node vocabulary leaving `document.ts`, or `toHtml` giving up
the stylesheet. Measured, **both leave 0 cycles** — 9 modules and import lines against 6 modules and
**23 call sites** — so the graph chose neither. `document.ts`'s own header does: *a page is a value,
and `toHtml`, `toText` and `toMarkdown` are projections of it*, and the second cut gives `toHtml` two
arguments where its siblings take one, so the three projections stop being three statements about one
tree. **A cut that costs a property the file declares is not a cheaper cut.** `tree.ts` imports
nothing and takes its name from the section heading `document.ts` has carried since it was written;
what moved is **ten files and twelve import lines and no call site**, the tenth being `pages.test.ts`,
whose import is type-only and was never on the cycle — so ADR-0197's *nine* and this *ten* are two
populations and both are right. **No entry order truncates any more, over every entry there is**: one
child process per module of the folder, **32 of 33 answering 23 609 B** where 29 of 32 did before, and
the two that changed are the two that were on the cycle. `start.ts` throws on both sides because it
reads the global `document`, which is what says the sweep reads a cycle rather than an environment.
Under the loader that matters, a file naming `./components.js` first now gets **23 609 B and no
`undefined`** where it got 17 669 B and one — the same 5 940 B arithmetic ADR-0197 measured against a
sheet 3 427 B larger, so that record is extended rather than corrected and carries no head note.
ADR-0198.

**The precondition guard ADR-0197 was waiting for is refused, and not on its price.** Asking that the
sheet contain `THE_COMPONENT_RULES` compares a value with itself: both sides come out of one graph.
Measured with `paintedBy` leaving `&` unresolved — **fifty selectors no element matches, served** —
**the strong form passes**. It is `GUARD_PERTURBATION_RULE`, and its only red in this repository's
history came from the load order the cut removed. The two mutants were searched for and both are the
compiler's: `TS2305` for the one-line way back to the cycle, `TS6133` for deleting the interpolation.
**What replaces it is the sweep, published in the record rather than summarised.** `THE_UNRESOLVED`
died with the cycle — the sheet's three interpolations are all `const` of leaves now — and removing it
would have left the guard's name over-claiming, so what stands there is the guard's own name and a
comparison nothing here was making: the sheet a page carries against the sheet this site composes.
**Red on eight pages and red alone**, 1 of 187, on the stylesheet sent through the escaper — the one
string `document.ts`'s header says must never pass through it. That is a first: the guard's three
witnesses each take 67, 74 and 9 guards with them, and all three were re-measured and still redden it.
**The replay agreed with the hand audit**, which is what makes the pin believable rather than
plausible — `155/156`, every cell agreeing with its pin, **0 unaccounted for**, and the attribution
reading `red on W-19, W-20, W-24, W-167 / alone on W-167`. The guard leaves the *never alone* bucket,
which is one row of an entry below closed by a cell aimed at one guard's own failure condition.
**Two probes were wrong before one was right, and the second is the finding**: it checked itself with
the pattern it was testing, so its control could not fail — the class this repository had spent the
week closing, committed inside the instrument hunting it, and caught only by giving the check a needle
that shares nothing with the parse. ADR-0198.

**The page a reader arrives at is a door, and the catalogue took an address of its own.** `/` holds the
name, one line and two ways in - the catalogue, and what a contract is - and **no command at all**. The
shape of every command at once stood there as `add domain/function` so that no contract was privileged
on the page that stands for all of them; the constraint was right and the form is a template, which a
reader sees. A command belongs to a contract, so it is on every contract's page and on none of the pages
about the catalogue. The catalogue is at `/catalogue/` with all thirteen of its links; `/` goes on being
written and served, changing role and not existence, and the packaging suite is green on ADR-0125's eight
guards. `/contracts/` was refused because this project already spells the thing `catalogue` in five
places. **What the page does not say is recorded as a cost**: nothing on it is about how this catalogue
is verified, which is what the whole project rests on, and it is one link away in the masthead.
ADR-0140.

**Both halves of that paragraph are gone and the argument inside it is not.** ADR-0181 made `/` a shelf
rather than a door, and ADR-0189 retired `/catalogue/` along with the four other pages this site had of
its own — so the catalogue is what a reader arrives at, and there is nowhere further in. What survives
untouched is why the door carried no command: *a command belongs to a contract*, which is still why
every install command on this site is on a contract's own page. The cost recorded at the end is paid
rather than moved: nothing a visitor meets is about how this catalogue is verified, and it is now no
links away rather than one, because the methodology is served as data at `/methodology` and rendered by
nothing. ADR-0189.

**The move broke every link on the catalogue and a rewritten guard is what said so.** Its six links were
`linkTo(page)` - correct at the root, broken one folder down.
`every-page-is-reachable-from-the-front-page` was one hop, which is right for a flat site and false of a
door, and rewriting it as a walk over the page graph reddened ten pages at once. **The walk also keeps a
claim the one-hop form kept by accident**: comparing the front page's hrefs against the list of pages
refused an address that left the site, and a walk that skipped what it could not resolve would have
dropped that silently - so it is now stated in its own right, over every page rather than over one.

**And two defects came out of a browser and out of no static check, in one unit.** `body` is a grid, and
a grid with vertical free space stretches its auto rows into it, so on any page shorter than the window
the masthead grows - **247px instead of 56 at 1440**, growing with the screen because a wider screen
makes a shorter page. Every page of this site had been taller than the window, so nothing had ever been
short enough to show it. Then the door, wrapped in a `.shell`, ran **edge to edge at 320, 390 and 768**:
a shell spans the body's gutters and re-establishes an inset out of its own tracks, and with one child
it has none to re-establish. It has no navigation column, so it has no shell - which is what the three
other pages without one already do. Both found by rendering the emitted tree; the eight suites were green
either side of both.

**A guard's regular expression had been silently narrowed, and a mutant is what said so.** The guard
written for the door refused a command on the front page and stayed green with
`npx toopo add string/slugify` printed on it: a `\b` edited into a source through a shell heredoc lands
as a literal backspace, `0x08`. The file compiles, the guard collects, it runs green for ever, and it
refuses less than it says. Swept over the tracked tree: **three, in one file, two of them committed** -
`/\bof\b|\//` in `every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown` had
been refusing a slash and nothing else for the whole of its life. Repaired and seen red with ` of ` in a
figure's own rendering. **What found it was the mutant and not the sweep**, and the sweep exists only
because a perturbation failed to redden something.

**Two figures this repository has published cannot be rebuilt, and both were found by trying.**
ADR-0133's prose-line counts reproduce to neither of the two populations its own table declares — 601
with navigation, 580 without, against 585 — while every one of its eight heights reproduces **to the
pixel** and its nine-line delta exactly, so the rendering agrees and the counting does not. And the
layout debt's *38 geometry declarations* counts three `@media` conditions as declarations. Neither is
corrected, both being stamped; what replaces them is that the new counts carry the rule they were taken
by, which is the thing neither of those two had.

**A guard of the site suite had been reddened by nothing since it was written, and the battery said so
to nobody.** `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` was reported
unaccounted for by `npm run battery site` at `81bf9bc` and at every commit before it — measured both
ways, by checking the base out and running the battery there. W-24 looks as though it covers it,
because it replaces the inline stylesheet with a link; it does not, because **with no style element the
guard finds no palette, its loop runs zero times and it passes**. A guard passing vacuously, in the one
folder whose subject is that a page can be read. W-24b closes it. **The finding to carry was that no
battery was replayed in CI**, so a battery's disagreement with itself waited for somebody to run it -
which is what ADR-0146 closed, on the push that touches the folder and on everything before a
publication.

**And the catalogue's own prose is parsed by the function that already parsed the method page's.**
ADR-0026 scoped that guard to one page and named the event that would reopen it — a second page taking
prose written for a reader of source. 220 literal backticks were reaching readers across the four
contract pages, 110 of them on `string/slugify@1` beside 51 `code` elements produced correctly on the
same page. What settled the register ADR-0026 said nothing mechanical could settle is that **every one
of the 220 is paired**, so there is nothing to guess at. ADR-0117.

**The catalogue is seven contracts** — `number/parse@1`, `date/add@1`, `array/group-by@1`,
`string/levenshtein@1`, `string/slugify@1`, `number/round@1`, `object/deep-equal@1`. **This line read
*six* for two days after the seventh was published**, four hundred lines below a sentence of this file
saying it had been, which is the class this file keeps finding: a present-tense claim that expired with
nothing noticing. The sixth is the first published after
the founding four, the first whose call takes a number, and the first whose reference was caught
annotating itself with the contract's own types. The third is a format prototype that will not be published,
because ES2024 shipped `Map.groupBy` and it answers what the contract specifies; the refusal and the
rule it establishes are recorded. The fourth is the first whose properties are strong by nature — the
axioms of a metric — and its table is a third the size of the first's as a result. The fifth is the
first with no oracle of any kind: measured over fifty-seven samples, the four most used slug libraries
agree on seven, so nothing about its answers is true and every one of them has to be argued for. The
seventh is the first whose case table the registry had to be widened to carry, and the first to publish
a witness its own rationale described wrongly.

**The seventh was chosen by a record rather than by a conversation, and that record is what made the
eighth search cheap.** `object/deep-equal@1` was carried by a disagreement that is a wrong answer rather
than a taste: `Object.keys` of a `Set` is `[]`, so an implementation walking own properties sees two
empty objects, and `fast-deep-equal@3.1.3` and `dequal/lite` both answer `true`
for `new Set([1])` against `new Set([2])` — while the entry point you are told to use for collections
answers `false` for a `Set` of objects against its own `structuredClone`. **Ten refused candidates were
written down with the measurement that refused each**, because the research that chose the sixth cost
a session and survives nowhere: `string/truncate` is refused not for its four definitions of length —
a question `string/levenshtein@1` had already settled — but because with code points chosen the whole
function is `Array.from(text).slice(0, limit).join('')`, one expression over two built-ins. ADR-0158.

**And the eighth search returned nothing, which is a result rather than a gap.** The ten hold, not one
proposal load-bearing on a refusal has moved — Composites, Array Equality and Comparisons carry the
same last pushes two days on — and the registry's widening reopens none of them, because not one was
refused on what its cases contain. **`string/camel-case` is refused a third time and for the first
time on a leg that was measured rather than regretted.** Its decomposition is real: over twenty-nine
inputs the disagreement is **17 in the word split against 3 in the rendering**, so `string/split-words`
would be one function — and ADR-0023 forbids it every phrase anybody would type to reach it, because
`camel case` promises a string and a splitter answers an array, which is the criterion that killed
`string similarity`. What refuses the caser itself is the digit fork: measured at `3daae2f` over twenty
digit-bearing inputs, **7 are disputed and 5 split exactly two against two** — `foo2bar` against
`foo2Bar`, `sha256sum` against `sha256Sum` — where neither answer is wrong and the use, unlike
`string/slugify@1`'s URL, constrains nothing. **It is the most expensive refusal this catalogue has
taken**: read on 2026-08-25, the case family is **442.55 M weekly installs**, 1.5 times the family
behind the contract published two days before it. **And a rule for families of one algorithm is not
what would open it**, which that record first said and then measured: the fork is in the *shared word
split*, disputed **5 of 5**, and no rendering escapes it — so a families rule moves the fork from four
contracts to one rather than dissolving it. The format refusal and the candidate's refusal are two
refusals, and the second survives the first.

**One measurement of that search is about this repository rather than about a candidate, and nothing
else would have found it.** A higher-order contract publishes a case table nobody can read: measured at
`3daae2f`, **all 30 of `array/group-by@1`'s cases** render as
`groupBy([1, 2, 3, 4, 5], <a function, served as a file>)`, the key function being half of what the case
settles and absent from the record — against 5 of 49 on `object/deep-equal@1` and **0 on the five
others**. Nobody had seen it, because a turned-down contract's page renders no case table at all. It
refuses `array/binary-search` and `function/debounce` a second time, on the catalogue rather than on
themselves. ADR-0163.

**That 5 of 49 counted rows and this sentence read it as functions.** ADR-0163's table is headed *with
an argument that has no spelling* and is correct; the clause above puts the figure straight after the
key function, where a reader takes the five to be five of them. Decomposed at `045709b`, they are **1
function, 2 values whose contents cannot be read, and 2 instances of a class** — a figure true of its
own population, read into a sentence about another, which is the class this file traces arriving on
this file. ADR-0164.

**And the instance half was a defect a reader met, on a published contract, with no digest in the way.**
`literal.ts` printed `<an instance of a class>` and dropped the `className` and the fields the record
holds, so `a-class-instance-is-not-its-fields` published `{ left: <an instance of a class>, right:
{ x: 1 }, expected: false }` — *two different things are different*, which is not the claim — and its
neighbour, whose instance holds `x: 2`, was printed in the same words on the left. It now reads
`<an instance of ASmallClass, holding { x: 1 }>`, so each row shows the same field on both sides and
the answer still `false`. **0 of 7 digests moved and `npm run freeze` is green**, because a rendering
is in no digest. The brackets stay: `ASmallClass { x: 1 }` is what a reader would paste and the class
is not in the record. `WITHOUT_A_SPELLING` holds what a phrase *opens with* now, so `read-literal.ts`
refuses it by `startsWith` with nothing about the refusal changed. **The arm had no guard in
`literal.test.ts` at all**, which is how it survived being written; what found it was a probe printing
the record beside the rendering for another question entirely. **Three headers said *two* and each was
made false by a unit that did not come back** — `read-literal.ts` claiming `literal` prints `<hole>`,
which has had a spelling since ADR-0160, `literal.ts` over a record of three, and `site.battery.ts`
calling a hole a word with no spelling. ADR-0164.

**The file that lands in somebody else's project no longer says it belongs to somebody else.** The
front page promises *the source lands in your repository and it is yours* and the second line of the
file that lands said `Copyright (c) 2026 <the author>`; MIT-0 required nothing of the reader, but
nobody reads a licence and everybody reads the first two lines of what they have just pasted. The
five published contracts keep theirs — their `reference.ts` is frozen by a digest other people's
lockfiles hold — so **two banner forms are permanent**, and the discriminator is a date, which
nothing in this repository's data derives. It is therefore a required declaration on
`ContractSource`, so a seventh contract that does not say which form it carries **does not compile**,
and the argument for setting aside `licence.ts`'s refusal of a hand-written perimeter is written
beside that refusal rather than only in the record: a wrong list of *paths* mislicenses a file, and a
wrong banner form cannot, because both forms are MIT-0 and a byte-for-byte guard already reads them.
**`array/group-by@1` moves to the new form today**, because the ledger binds it nothing — measured,
the ledger is byte-identical across the change — which is what gives the second branch an instance
instead of leaving it a branch nothing reaches. ADR-0159.

**`README.md` still shows a copyright line and no longer teaches it as the rule, which is a different
state from the one that clause described.** It read *what it does not buy is on the list below:
`README.md` goes on showing a copyright line, correctly, because it demonstrates a published
contract* — true of the exhibit and false of the page, because the two lines stood under *all it asks
of you*, which is read as the deal and not as a fact about `string/slugify@1`. Measured from npm
against the live origin: `toopo add object/deep-equal` lands `// SPDX-License-Identifier: MIT-0` with
no copyright line, so a reader installing the seventh contract received a second line the front page
had never shown. The exhibit is unchanged and frozen; what moved is that the page now attributes it,
says the form it does not show is the one written today, and names the contract a reader can check
that on. ADR-0172.

**And the page stopped proving the opposite of what it says.** ADR-0114 closed by naming four things
that would reopen it, one of which nothing here could raise — *a real reader failing the thirty-second
criterion* — and the owner raised it, reading his own README as a stranger and saying it makes the
project look like one function. **It is the record's own trigger firing, and
`every-decision-says-what-would-reopen-it` is what forced it to carry one**: a record with no trigger
is *a decision frozen by accident rather than on purpose*, and this is the first time one of those
triggers has been pulled by the only thing that could pull it. **The count could not have seen it.**
ADR-0114 took `slugify` from 11 mentions to 6 and recorded that none of the six is a call; measured at
`1e85f9e` every word of that still held. What a count cannot see is an order — measured in words rather
than in lines, which is ADR-0114's own refusal of a line reading, the install naming one contract stood
at **3.8 %** of the page and the word `catalogue` first occurred at **39.3 %**. **The page asserted the
plural at 0 % and proved the singular for 39 %**, its opening sentence being *Utility functions … each
one verified against a public, executable contract* and everything concrete after it being one
contract's install, files, row, header and import; a reader believes the evidence. The catalogue now
opens at **22.5 %** and `slugify` at 28.4 %, so the plural precedes the singular by 6.1 points where it
trailed by 35.5 the wrong way. The reordering is a **pure permutation** — proved rather than asserted,
the multiset of whitespace-separated tokens being identical across it — and the fourteen words added
are the one sentence that makes the command read as a row of the table above. **What it cost is stated
rather than smoothed**: an npm reader's install line moves from 3.8 % to 35.7 %. ADR-0173.

**A wordless `npx toopo search` at the top was the strongest refused candidate, and what refused it was
a measurement.** Against the live origin it answers **45 lines and 230 words** where the whole catalogue
section is 214; it names all seven addresses, which is the compact-roster refusal at eight times the
size; its line 43 is the `npx toopo add <domain>/<name>` template ADR-0140 records being rejected by
name, returning through a command's output where nobody would look; and it carries `The catalogue holds
7 contracts.` where **both guards that resolve that count seek the bolded literal**, so a `7` inside a
fence escapes them — worse than ADR-0130's shape, where a duplicate at least *satisfies* the guard, and
an eighth contract would have left the page carrying a stale `7` with all fifteen green. Without its
output it is refused on ADR-0114's exemption read closely, *every README on earth has one* being a
toleration rather than a claim to the opening position — **and because it repairs the half that was not
broken**: the plural is already asserted at 0 %, what was missing at 4 % was plural *evidence*, and a
command is a third assertion. ADR-0173.

**Project name: Toopo.** CLI command `toopo`, lockfile `toopo.lock`.

**What decides the next unit** is the list of what is still open, below, with what each entry costs.

## Where the reasoning lives

**A decision that has been taken is a record in `docs/decisions/`**, in MADR format, addressed by
number and cited as `ADR-0007` — never as a path. ADR-0001 settles the format, the two fields it adds
and the one section, and its guards resolve what a record names in both directions. There is no index
here: the directory listing is the index, because the filenames carry the titles, and a second
statement of what the folder already says is one that drifts.

**A record exists for what will not fit beside the line.** Where the argument does fit — where the
reason a constant holds the value it holds is a comment on that constant — a record is an address for
something that did not need addressing, and the cost is not the file: it is that two places then carry
one piece of reasoning, and they wait to diverge. The move to `1.0.1` is where this was applied rather
than merely stated: the whole of it is why one string reads what it reads, ADR-0109 had already argued
the release, and the argument now sits in `publication.ts` above the line it explains, with no record
of its own.

**What happened and when is `git log`.** The commit messages carry the measurements at length. This
file carried a second, shorter copy of them for a year; ADR-0062 is why it no longer does.

**What is below is what a session needs before it writes a line**: what is still open, the rules of
this stage, the permanent rules, the conventions, and the verification discipline.

## What the repository declares and nothing keeps

One form, found four times in a single sweep and certain to be found again: **a thing that behaves
like a rule, with nothing making it hold.** The vocabulary for it already exists — `one-directional`
— and the list is kept here rather than scattered, because it is what the publishing tool has to
close. A published version is frozen for life, so a declaration that is decorative on the day a
version is published is decorative for ever.

**This heading read ` — closes before the launch` until ADR-0153, and the deadline in it passed
rather than being met.** There is no event left to wait for: the manifest declares a version npm
holds, the origin serves the catalogue and the client installs from it. So what is below is the
maintenance backlog of a running product and never a list of things blocking a release — the same
entries, read at a different urgency, in an order that still says nothing about which one is taken
next. **What replaces the deadline is no deadline**, and that is the decision rather than an
omission: ADR-0017's rule is that an address may not render the data it addresses, and a heading is
an address. A condition written into one expires with nothing noticing, which is what happened here,
in the first words of the section every session reads before it writes a line. Measured at `f776a43`
over the tracked tree: **nineteen citations of this list, in thirteen records and two sources, and
every one of them names what the list is; not one names when it closes.** The half that was doing
the work was never the conditional half. ADR-0153.

**And *an order that says nothing about which one is taken next* was read once, at `0986b70`, by
asking of each entry whether a reader meets it.** A reader is somebody who visits `toopo.dev`, runs
`npx toopo`, installs the archive npm serves or fetches an answer from the declared origin — never
somebody who reads this repository — and an entry was counted as met when the artefact whose
declaration is unkept is itself something a reader receives or acts on, the artefact and never the
consequence. **The population was 56 and the marker count said 50**, four entries opening with a
backticked identifier and two standing above the *Still open* subheading. That reading answered **27
met and 29 not, and of the 27, five realised** — a reader receives something wrong today — **and 22
latent**. The five: three citations that resolve nowhere inside the shared harness every snapshot
serves; a README whose banner example disagrees with what installing `object/deep-equal@1` lands; a
frozen benchmark-profile name rendered on a page and answerable by no query; two cache policies of
which one is written in no file here; and two levels of verifiability across the published contracts,
six serving seven harness files and one serving eight. Each carries its command in the record.

**It is a reading and not a rule, which is the whole of what could be decided.** An entry has no
address, ADR-0118 refuses one on rewritable prose, and a guard keyed to an entry's text would redden
when somebody rewrites an entry — ADR-0112's refusal exactly. So nothing holds this reading to the
list: entries will be rewritten, closed and opened, and no mechanism will notice that it has stopped
describing them. It says what was true at one commit by a rule written down before it was applied,
and nothing about tomorrow. ADR-0167.

**An entry is written in two halves, and the reason is that three times in one week a published
sentence of this repository was false — twice with the true sentence and the false one in the same
file.** That is not bad luck. It is a list in prose describing what the code does, and the code moves
while the list does not. The remedy costs two sentences, and this section is its own demonstration:
the record now at ADR-0017 named the pre-flight as the thing that would close
`benchmarks.profiles[].name`, the pre-flight was built, and nobody came back here.

1. **An entry names what would close it.** One that names no closing mechanism cannot be recognised on
   the day it closes, which is exactly how the entry below outlived its own closure.
2. **The change that builds such a mechanism sweeps this list for every entry naming it, and closes
   them in the same commit.** The mechanism and the entry are one event; separating them is what
   leaves the false half of a true sentence lying where somebody will read it.
3. **An entry can be false without being stale, and that is the failure neither half above catches.**
   The two rules are written against *drift* — the code moves and the list does not. An entry written
   from an assumption about what the code holds, rather than from a reading of it, is wrong on the day
   it is published and stays exactly as wrong: nothing about it looks old, its mechanism is still
   unbuilt, and every remedy here is aimed at the version of it that used to be true. The alias entry
   above asked for a field that had existed since the first contract was written, and it was found by
   somebody setting out to build the field. **So an entry that describes what the code does not have
   names where it looked**, the way a count names its population — because the cheapest way to be wrong
   here is to describe a schema nobody opened. ADR-0128.

   **And that remedy is copiable, which is how it failed.** A *Where this looked* block is prose, so
   the cheapest way to write one is to take the block from a neighbouring entry — and **a copy is
   indistinguishable from a reading**. Measured at `c62db7a`: *`mutation/decisions.ts` has nine fault
   functions* stood in **nine** places, six of them entries of this list, one the prose above it, one
   `CONTRIBUTING.md` and one a stamped record — and that file has declared **eight** since its first
   commit, `ba78284`, unmoved across the ten commits touching it. **The true figure was already
   written thirty-five lines above one of the copies, enumerated.** What made the wrong one
   reproducible is that it counts what the file *mentions* rather than what it *declares*:
   `guardAddressFaults` is imported and called there, and is the ninth name. **The two failures this
   section separates were living in one form** — the same sweep found *`mutation/workflows.test.ts`,
   whose nine guards*, and that one **was** true when it was written, nine on 2026-08-21 and twelve at
   `aaf625f`. Rule 3's failure and rules 1 and 2's sit in neighbouring blocks and read identically;
   only counting tells them apart. **And reading the whole population turned two instances into a
   habit**: of nineteen claims examined, **six are false** — 35 guards where a file has had 26 since
   its first commit, a count of type sizes its own entry contradicts three paragraphs below, a fact
   attributed to a module that does not record it, and two bounds ADR-0222 moved this morning without
   sweeping the entry that names them. ADR-0227, ADR-0228.

   **So the block names where somebody looked, and it does not count what they found — unless the
   count is the finding.** A number belongs there when it *is* what was established: a total
   enumerated on the spot, so a reader checks it without leaving the sentence; the population the
   entry is about, where *how many* is the subject; or a totality, where *all of them* would be a
   different claim at *some*. Everywhere else it decorates — *the three guards of `x.test.ts`, none of
   which reads a page module's source* is exactly as true at four — and **a decorated count is one
   nobody re-reads and everybody copies**, which is the whole of how six of them went wrong.
   **Where a count stays it is re-measured and never carried over**, and where it goes the question of
   verifying it goes with it. Applied over the population: **thirteen counts removed from ten blocks,
   thirteen kept in eight and re-measured**, and twenty blocks carried none to begin with. **This
   removes what a guard would have watched rather than watching it** — which is why the guard priced
   in the entry below is refused and not deferred. ADR-0229.

**Entries that closed are recorded with the mechanism that closed them, in that mechanism's own
decision record.** They are a list and not a sentence, and that is a repair rather than a layout:
this paragraph was a chain of nine clauses joined by semicolons, one unit having added each, and it
carried five hands at `2385fc2` — the joint-highest in the repository. A closure is one line, so
adding one cannot lengthen anything a reader has already read. ADR-0112.

- two closed by stage 1 of the validation pipeline — ADR-0005;
- three closed by the two-phase write — ADR-0039;
- the class of a declared address nobody resolved — ADR-0060;
- permanent rule 6, which was never on this list — ADR-0093;
- the three about what git holds, a citation that resolves, an address no commit carries and a
  checkout nothing leaves behind — ADR-0095, all three together because they are one walk over the
  same graph;
- the playground reading what a reader types — ADR-0096;
- a replay that could not finish — ADR-0102, which found a second entry for this list on its way out
  and put it there;
- the address a host serves — ADR-0103;
- an archive that really installs a feature — ADR-0104, on the event it had named, leaving two
  entries behind it: one for the third guard it did not bring back, one for the revision it reports
  without resolving;
- the address the emitted tree never loses — ADR-0125, over the pages a listing names, leaving behind
  it the addresses no listing names and the chain of runs the reading is inductive over.
- a battery's disagreement with itself, read on every push and before every publication — ADR-0146,
  leaving behind it the change no cheap selection answers for;
- the declaration of what an answer *is*, which no deployment read — ADR-0137, closed where the cache
  policy closed and for the reason a search gave it: the document every query fetches was the one
  paying for it;
- the end-to-end reading of what would be published against what git holds — ADR-0148, leaving behind
  it a witness that rests on three code points the catalogue happens to spell, and the half of a
  fourth guard that its own name is about;
- a guard that could not see its own population shrink — ADR-0152, leaving behind it a guard total
  over populations and never over files, and the reading half of the entry it closed;
- the allowance written for a word a query omits being spent on a word it adds — ADR-0154, leaving
  behind it the point at which a second word starts to be evidence;
- **a control that counted a suite without seeing the suite it counted** — ADR-0166, and the entry it
  closed is the second one this list has recorded where **the closure was the false half**: what it
  named — the census, read on every mutant cell — is a comparison of counts, and its own published
  figures are four guards leaving a suite with the count unmoved. What closed it is two readings of
  the report's statuses, each seen red on a condition the other is green on. It leaves behind the
  refusal of the per-cell census, which is an entry below rather than a line here, because a reader
  arriving at *ignored is not failed* has to meet the argument and not the verdict;
- **a verdict the instrument did not measure, both halves of it, at one `execFileSync`** — ADR-0162.
  The buffer that killed a red run before vitest could report and the bound that was never there are
  one fault: `catch {}` threw the error away, so a run cut short and a run that reddened were one
  fact. **The entry priced a full replay and predicted verdicts would move; measured, none did** -
  zero cells disagreed across the twenty-two batteries that ran, and `I-69`, the only one it named,
  reads `killed` exactly as pinned. It was wrong for a reason worth keeping: **the guard that
  overflowed had already been repaired when the entry was written**, so what was left was the path
  and never a cell on it. An entry can describe a real path and be wrong about what travels it, which
  is a nuance of *false without being stale* this list had not carried. What it leaves behind is a
  number — 600 seconds, chosen against seven readings taken on one machine, and a runner slow enough
  to cross it turns a real reading into `not-measured`.
- **the cache policy every address the tree serves carries** — ADR-0170, and it is the third time this
  list records that what failed was an entry's own half rather than the code. The entry's heading asked
  that *every* address carry a chosen policy and its prescription named the browser modules and three
  convention constants: re-measured at `7e3f64a` the tree writes **128** addresses of which **55**
  carried no rule, and the prescription reaches **17** of them, leaving thirty-four pages and Markdown
  twins on a host default. **The heading was right against the prescription**, which is ADR-0128's rule
  3 arriving on the half of an entry nobody re-reads — a repair written from an assumption about what
  the code holds, wrong on the day it was written and looking no older for it. What it leaves behind is
  the four hours, which is an entry of the open list rather than a line here, because they are decided
  on the far side of a gap `wrangler.jsonc` records and no push reaches them.
- **the producing expression a profile's record transcribes** — ADR-0171, and it is the fourth time
  this list records that what failed was an entry's own half. The entry swept `producedBy` in with
  `benchmarks.profiles[].name` *for the reason the entry above closes there*, and ADR-0013 reached for
  the same sentence — *the only thing that will ever read a **declared name** against what it
  describes*. **`producedBy` is not a name**: it is a transcribed expression, what was unread about it
  was arithmetic rather than prose, and it closed with a guard rather than with a pipeline. What
  closed it is that the text is asked of the profile instead of searched for in the file, so the twin
  that kept it alive cannot answer for it — seen red at `286ca34` with `one-group-per-element`'s
  samples made literal, and the control is that the old guard was **green** on the same perturbation,
  the twin still holding the text once. It leaves behind the derivation this entry asked for and did
  not get: `serialiseContract` has dozens of callers and one of them is the client, so a parser there
  would put a 138 ms compiler spawn inside `npx toopo add`. The field is a declaration still, and it
  is `structural` rather than derived.
- **the banner a reader is shown against the banner a reader would receive** — ADR-0172, and it is the
  fifth time this list records that an entry's own half was what failed. **The closure it named would
  have inverted the defect rather than repaired it**: *the demonstration moving to a contract published
  after ADR-0159* puts on the page the form **1 of 6** installable contracts carries in place of the
  form **5 of 6** carry, and the defect was never which particular was shown — it was showing one under
  a sentence that reads as the deal. The comparison with `LICENSE` is what misled it: that file claims
  *each one says so in its own first two lines*, a claim about the marking, which both forms satisfy, so
  one example is adequate to it; the README claimed *all it asks of you*, which is a claim about the
  whole header. **Two surfaces, two claims, and the entry treated them as one problem with one
  closure.** What closed it is that the page now attributes its exhibit, names the form it does not
  show, and names an installable contract a reader can refute it on. **The paragraph held a second
  particular nobody had separated from the first** — the install root, which is `src/lib/toopo` only
  where the project has a `src` folder — and it was caught in the repair's own draft rather than by the
  reading that opened the entry. What the closure leaves behind is that **no guard here installs
  anything**: the three that now keep the page read the catalogue and the page against each other, and
  both defects were found by `npx toopo@1.1.0` against the live origin in two project shapes, which is a
  measurement somebody took and not a mechanism.
- **the alphabet a contract declares against the answers that witness it** — ADR-0175, and it is the
  first entry this list has closed by *taking the measurement the entry named*. It read *that one
  measurement decides it, and it is the whole of what this entry is waiting for* — whether `\p{M}` had
  a real witness among `string/slugify@1`'s answers — and it had been priced and refused on that
  unmeasured trigger for three units. Measured at `df5b367` over the forty-one settled cases: `\p{L}`
  is witnessed by `日本語テキスト`, `\p{M}` by **three** answers — `हिन्दी`, `eَ` and `x́` — and
  `\p{Nd}` by `٤٢`. **The route that looked obvious was refused on its own arithmetic**: deriving the
  population from `THE_FROZEN_HALF_IS_STILL_OPEN`, as ADR-0171's profile guard does, scopes the guard
  to unpublished contracts, and `string/slugify@1` is the only contract declaring a pattern at all —
  so that guard would have been born on an empty population and could not have failed. It leaves
  behind the reading's published limit, which is that a character outside a bracket expression is not
  read, and `outputAlphabet`'s own frozen stratum, which is an entry below.
- **two things a reader sees side by side, where one of them is not an element** — ADR-0194, and it
  is the first entry this list has closed by **widening the guard whose blindness it was about**. The
  entry priced that widening as *a population that moves across every page of the tree, whose green has
  to be re-earned everywhere at once*, and the price was not paid, because the population separates by a
  rule: between two elements only white space can make a boundary visible, and between an element and
  prose the character the author typed can — so what is left is a seam falling between two word
  characters, which is one word broken in half. Measured at `aff4bdd` over the 22 pairs, **5 reported
  and 17 allowed**, with no exemption list. The five are repaired at the same time, the separator being
  prose rather than a margin, and `W-162` is the cell — **red alone, 183 guards green beside it**. What
  it leaves behind is written where somebody reaching for it arrives: the entry's own witness, `W-64`,
  had been deleted by ADR-0189, so it cited a cell nobody could replay; and the widened arm is exact
  over the seventeen that exist and has no exemption for a pair whose seam is two word characters and
  which is right — `1<span>st</span>` is that shape, and this site writes none.
- **a word broken in half at 320** — ADR-0193, and it is the first entry this list has closed because
  **a later unit deleted the thing it measured**. It read fifteen breaks on `/method/`, *all on that
  page*, and named `packages/site/methodology-page.ts` in its **Where this looked**; `11e0f54` deleted
  that module. Re-read by the entry's own criterion — a line change between two alphanumerics, over
  `h1, h2, h3, h4, p, li` with `code` and `pre` descendants excluded, character by character with a
  `Range` — over the eight files of HTML at 320, 390 and 1440: **0, 0 and 0**, the first full sweep
  discarded. **The zero is perturbed rather than believed**: a 53-character identifier put back into
  one prose paragraph of each page reddens **8 of 8**. What it leaves behind is that the class did not
  close with the page — `overflow-wrap: anywhere` is on `body`, so every page can still break a word,
  and what left is the matter rather than the property.
- **the directories this tool supports against the directories it accepts** — ADR-0208, and it is the
  first entry this list has closed by **taking the measurement that refuted the reason for leaving it
  open**. The entry offered two ways out and the argument for the wider one rested on a claim about
  the space: that in front of or behind a segment it is *lost or refused depending on the platform*.
  Measured at `a2495c3` over nine spellings, on NTFS under node v24.15.0 and on ext4 under v24.20.0,
  **nine of nine are rendered back under the name they were asked for on both** — libuv does not go
  through the Win32 normalisation that drops one — and on Windows `code ` and `code` are two
  directories rather than one. **What cut the other way is that `staysInside('src/code./toopo')` is
  true today**, so refusing a space for its position would refuse a character for a reason the
  published alphabet does not apply to itself. So the directory gained an alphabet of its own, wider
  by that one character, and `A_PATH_INSIDE`, `staysInside` and `under` were not touched: of
  `staysInside`'s five callers the configuration's is the only one that moved, and it is not on the
  path from a served string to the filesystem. **Reading the entry found two defects worse than the
  one it named** — `init --dir` wrote a committed `toopo.json` this tool then refused to read, exit 0,
  once naming a folder *above* the project; and the refusal was false of the string it was shown for,
  naming three properties `src/my code/toopo` satisfies. **What it leaves behind is the ASCII bound,
  declared rather than decided**: macOS normalises to NFD where Linux keeps its bytes, no macOS
  reading was taken, and the record names that as the absence that reopens it.
- **a control that reddens with no failed guard naming what reddened it** — ADR-0201, and it is the
  first entry this list has closed by **taking the repair ADR-0200 priced and refused**. That refusal
  was about the witness: `mutation/` is injected into by no battery, so the branch arrives unwatched.
  It is taken anyway, on the ground that the fault is *an instrument that cannot say what happened* and
  that preferring a certain silence to a possible one is the wrong way round. **What it leaves behind
  is the silence itself, declared rather than closed**: five guards with no cell, `confirmed-by: []`
  because a `(battery, guard)` pair cannot be formed here at all, and two reds a person produced by
  hand - one at `938ded8`, where the witness is red and prints the colon with nothing after it, one
  under a perturbation nobody keeps. **And the closure it named was the wrong shape**: ADR-0200 asked
  for the output on a `RunResult`, and a control produces none - it belongs on `SuiteRun`, which is
  where a run is described. The wider repair the entry implied was refused on a measurement rather
  than on its price: a type-only error in a source file leaves the report green and the process red,
  which is what five batteries pin as `killed-by-typecheck`, so refusing on that disagreement would
  have turned five pinned cells into cells nobody measured.
- **a reading that decides whether to pay for a replay checking every way a replay can refuse** —
  ADR-0221, and it is the first entry this list has closed by **a tool that refuses where it cannot
  answer rather than by one that checks more**. The entry named its own closure — the reading living
  in `mutation/` as a command, with the three buckets one import away instead of retyped — and
  building it found that the third bucket needs something no measurement written before it carried:
  the guards each column collected. `attributionOf` answers *no silence* for a column it has no guard
  list for, so the obvious build reports **nought faults on all twenty-three batteries**, which is
  byte for byte what ADR-0212's predictor reported on the day it was wrong. So a measurement carries
  `guards` and `platform` now, three absences are refused separately rather than defaulted, and the
  exit code is three-valued — a reading that agreed, a fault, and a question that could not be asked.
  **The control is two commits and one measurement**: `409ab48` and `90e6f1b` touch exactly one file
  each and it is the same file, so the code under measurement is identical at both and only a
  declaration moves — **exit 1 naming
  `every-export-is-carried-or-declared-uncarried-number-parse` on the first and exit 0 on the second**,
  in **158 to 185 ms over six readings** against the 42 minutes that refusal took to arrive by replay.
  **What it leaves behind
  is a debt with a price and a remedy**: twenty-two measurements predate the guard identities and
  cannot answer the two silences until each battery is measured once, and the command names that per
  battery rather than counting it as agreement. The twelve guards are collected by `npm run meta` and
  witnessed by no battery, which is `mutation/`'s standing trade rather than a new debt.

**The address a host serves is where rule 2 above was broken, by the commit that built the
mechanism.** The entry
was closed in fact by `45f702f`, the move to Pages, which changed eight files and none of them this
one — so for three commits this list carried a live entry about a redirect that no longer happened,
and the paragraph above it described the host that had been left behind. Nobody was misled only
because nobody read it in that window. **A mechanism and its entry are one event and the rule already
said so**; what this instance adds is that the sweep is owed even when the mechanism looks like a
one-field configuration change, because it is the *entry* that names the fact, not the diff.

**The playground reading what a reader types is the only entry this list ever carried that no guard
could have caught**, because it was a decision taken in conversation and written nowhere — the repository held no half for the code to
disagree with. It is also the entry that paid for itself twice over on the way out: closing it found
*two* published sentences of this repository false, both in the record that had argued the opposite
position, and both of the class the entry was about. One clause asserted that a raw text field could
not express a lone surrogate, which a browser refuted. The other was worse and was invisible to every
reader for a year — the two rows ADR-0028 printed to *demonstrate* that a no-break space and an
ordinary space carry opposite answers were **identical, byte for byte**, having lost the no-break space
somewhere they were written. A block whose entire purpose was to show two things differing showed the
same string twice, with two different reasons beside it, and nothing could have caught that either.

**The finding this section has to keep is the one above, because it is about the section rather than
about any entry.** *A published version is frozen for life* is the biggest `one-directional`
declaration this repository has ever carried — it is the whole security argument, every lockfile in the
world would hold the digest it moved, and it is what the product is sold on. It has been in this file
since the first commit, 367 commits before `d75ac8f`. This list has existed for 271 of them, for exactly
this class of defect, and it never named it. Ten entries at that commit, none of them the one that
mattered most.

So the rule the list adds to itself is not another entry. **A list that believes itself exhaustive is
more dangerous than no list**, because it is read as coverage: every session that opened this file saw
ten entries and a section explaining what the form is, and concluded that the form had been swept for.
Nothing here says how many instances exist, and nothing can. What a reader may take from this section is
that each entry it names is real; that it is complete is a claim no version of it has ever been entitled
to make, and this paragraph is the correction that stays.

**It happened a second time, on the same declaration, and that is what makes the paragraph above a rule
rather than an apology.** ADR-0093 closed *a published version is frozen for life* and this section
recorded it as the biggest instance the list had ever missed. What ADR-0093 froze was the seven files a
contract declares. Four of those seven import `packages/catalogue/every-contract.ts`, no digest covered
it, and the verification of a frozen contract could therefore be emptied with no address moving — which
is the same declaration, unkept, one level in. Twelve commits and one whole record after the miss was
written up. **The list did not fail to be exhaustive here; the closure did.** A mechanism that closes an
entry is itself a declaration, and nothing swept it — so what this instance adds is that *closing* an
entry is the moment to ask what the closure does not reach, and to write that down beside it before the
entry is struck off.

**And the same shape arrived one level down, in a closure criterion rather than in this list.** Taking
the personal address out of the history was to be closed by *zero occurrences over the 374 commits* —
374 being what `git rev-list --count HEAD` answered. The rewrite had to reach **391**: three
`evidence/*` tags retain seventeen commits `main` does not reach, every one of them carrying the
address, and every one of them published by the first `push --tags`. The criterion would have gone
green over a branch
while the defect left by another door. What made 374 wrong is not a miscount but a population read off
whichever ref somebody was standing on, so: **a count that bounds a defect names the population it
swept**, and `--all` is the only spelling of *this repository* that a tag cannot fall out of.

**One entry of this list is not of this list's class, and it is first because of that.** Every other
entry says *nothing keeps this rule*. This one says **the mechanism does the opposite of what the
record declares**, which is a worse thing and has never been named here before.

- **That an alias is not frozen with the major.** ADR-0023 decides it in as many words — *nobody links
  to an alias, no answer cites one, and correcting one breaks nobody's code; being wrong about an
  alias costs a revision* and not a major. `searchAliases` is a field of `identity`,
  `contractSnapshot` freezes `identity` whole, and since ADR-0106 the four contracts are bound at
  `d3a5166`. Measured at `f05951f`: adding one alias to `string/slugify@1` moves its contract digest
  from `855107da…` to `5fe0ecfa…`, which `every-published-binding-still-hashes-to-what-it-was-published-as`
  refuses. **So the cheapest of the three contributions this project invites is the one that cannot be
  accepted**, and a reader of ADR-0023 leaves believing they can make it.

  **It was harmless for the whole of this repository's private life and became live at a publication**,
  which is why no sweep found it: nothing was anchored, so nothing could be broken. It is the same
  event as the two ADR-0093 misses recorded above, arriving on a record that had *argued* the field was
  unfrozen rather than on one that had forgotten to say so.

  **ADR-0118 built the mechanism and deliberately did not use it here.** A field of the standing is of
  a contract and outside the digest, which is exactly what ADR-0023 describes; moving `searchAliases`
  there would move four published digests, which is the change permanent rule 6 forbids. **The
  population is measured rather than remembered: at `62bdcc2` the six contracts declare 13, 13, 12,
  12, 12 and 10 aliases — 72 in all, of which the 60 on the five published contracts are frozen.**
  This sentence read *the eight aliases of the four published contracts* until ADR-0155 went and
  counted: *four* was true on the day it was written and *eight* reproduces under no rule this
  repository can state. What would close it is not a
  guard: it is a way for the registry to bind a *second* contract digest under one address — a
  revision, which is the word ADR-0023 already uses and which nothing implements. Priced as a unit of
  the publishing tool and not built. What is done instead is that both places a reader meets the claim
  now say it is not kept: the head of ADR-0023, and this entry.

  **Half of it closed, and the half that closed is the one ADR-0023 invites.** ADR-0155 gives the
  registry `alsoFoundBy`, a standing field carrying a phrase learned after a contract's aliases were
  frozen, so *here is a phrase you are missing* is a contribution the catalogue can accept on a
  published contract — measured, the six digests are identical to the byte with one declared.
  **Adding is not unfreezing**, and the entry is unchanged for everything else: correcting a declared
  alias still reddens `every-published-binding-still-hashes-to-what-it-was-published-as`, and removing
  one still cannot be done at all. The revision is still what would close it.

  **What the open half now costs is worse than it was, and that is worth reading twice.** Before
  ADR-0155 a lying alias was unfixable and so was everything else, so the entry read as one debt. Now
  the registry can add a phrase and cannot withdraw one, which means the only repair available for
  `remove accents from string` — the liar ADR-0023 removed before publication — would be to add a
  second phrase beside it. **A field that grows and never shrinks is a field whose defects
  accumulate**, and nothing here bounds that. It is the same closure, priced against a population
  that is now unbounded rather than eight.

**A second entry is not of this list's class either, and it is the same shape one floor down: a debt
this repository recorded, in a file it may no longer edit, naming two repairs it may no longer make.**

- **That the divergence debt `contractAnatomy` records can ever be paid.** It cannot, by either of the
  two symptoms it names, and the day it became unpayable is the day the catalogue was published.
  `packages/catalogue/every-contract.ts` calls it *one debt with two symptoms* — a missing
  `relationToTheLanguage`, and a missing divergence replay — on `date/add@1` and `number/parse@1`.
  Measured at `ee2d1c1`: the field is inside `identity` and moves `date/add@1` from `94c5acc7…` to
  `043afd7d…`; the replay is a file, a declared file enters `harness`, and `harness` is inside the
  snapshot, so declaring `language.test.ts` moves `date/add@1` to `ed7f8eeb…` and `number/parse@1`
  from `d5071a58…` to `c8ca3819…`. Both are permanent rule 6 firing correctly.

  **And the sentence describing the debt is frozen with the contracts it describes.**
  `every-contract.ts` is one of `THE_SHARED_FILES`, so a byte in it moves every contract digest at
  once — measured, all six. What saves it from being false is that it is stamped, at
  `THE_ANATOMY_WAS_MEASURED_AT`; what nothing can do is correct it. **This entry read *four of six*
  and it is five of seven** — measured at `0986b70`, `relationToTheLanguage` is declared by
  `array/group-by`, `number/round`, `object/deep-equal`, `string/levenshtein` and `string/slugify`
  and missing from `date/add` and `number/parse`, where the frozen sentence says three of five. The
  set of contracts still owing it has not moved. ADR-0167.

  **This entry read *the population is the four founding contracts, and it will not grow*, and the
  seventh contract refutes both halves.** `number/round@1` carries its `language.test.ts` because it
  declared it *before* it was published, and every contract published after it *can* do the same —
  which is the part that holds. What does not is that any of them did: measured at `0986b70` by
  fetching each installable contract's binding and then its snapshot, **six serve seven harness files
  with no `language.test.ts` and `number/round@1` serves eight with one**, and `object/deep-equal@1`
  was published after `number/round@1` and is frozen without one. So the population is **five
  published contracts that can never carry a replay**, not four, and it grows by one with every
  contract published without one — the window does not shut, it is re-opened and re-shut at each
  publication. That is what makes this an entry to read and not one to act on, and what makes the
  reading worth taking again. ADR-0167.

  **What it costs is stated rather than smoothed: two published contracts, two levels of
  verifiability, for a reason of calendar.** An auditor fetching the snapshot of `number/round@1`
  receives a replay of what it claims about the language; one fetching `date/add@1` receives seven
  files and no replay.

  **What is done instead is the half that was reachable.** ADR-0150 puts the re-examination in the
  standing, where no digest moves, so the catalogue can at least say it looked — and the rule
  `array/group-by@1` established stops being one whose only expressible outcome is the rare one.
  What that does not buy is the executable replay, which is blocked on a runtime rather than on a
  decision: the matrix is `['22.18.0', '24']`, neither has Temporal, and a replay following
  `array/group-by@1`'s own rule — *a runtime without the function fails loudly instead of skipping* —
  reddens both legs today. It reopens the day the matrix reaches Node 26, and it will have to live
  outside the frozen folder. ADR-0150.

  **That day has arrived and the wait has become a decision, which is a different state from the one
  the clause above describes.** ADR-0150 published *Node 26 ships it unflagged* at its line 24 and
  *Node 26 was not available to measure* at its line 101, and the second is what made the first a
  reading of the news. Measured at `a0bbf86` on **Node 26.8.1**, V8 14.6.202.34, released 2026-08-26:
  it serves **the language** and not V8 13.6's draft, passing ADR-0215's own guard exactly — the
  specification's nine own property names, `TimeZone` and `Calendar` absent, nothing beyond them —
  where node v24.15.0 under `--harmony-temporal` still carries both. **And the whole repository
  already runs there**: all eight suites of a `suites` leg are green on it, 115 files and 1 748 tests
  with `--typecheck`, `meta` and `freeze` included, neither of which had ever run on a runtime outside
  the matrix. So a third leg costs one matrix entry, no repair and no critical path. **What it does
  not buy is the replay**, because the contract's own `reference.ts` names a global that is
  `undefined` on both existing legs — so the eighth contract is a decision about this repository's
  contributor floor rather than about a leg, and `22.18.0` is the leg that exists to redden the day
  that floor rises. ADR-0220.

**Still open, and what each one now costs.**

- **That the four forms a contract page offers still run, and still land the bytes the catalogue
  announces.** `THE_WAYS_TO_RUN_IT` publishes four invocations with the measurement that admitted or
  refused each, and its own opening sentence is *a form displayed and not measured is the defect a
  visitor already met, on the first thing they tried.* **The measurement is the one thing about that
  table nothing keeps.**

  **It is measured rather than feared, and the number is three.** The first reading was taken on
  2026-08-19 against `toopo@1.0.4`; npm has served `1.1.0`, `1.1.1` and `1.2.0` since, two of them on
  one day, and eight modules of the install path moved across them. Nothing re-read the table across
  any of it. Re-taken at `1.2.0` the four rows all hold, so the cost of those three releases was
  nought — **which is luck and not a mechanism**, and is exactly why the entry is worth more than the
  reading.

  **The entry that was to keep it had never been written, and a record said it had.** ADR-0138 closes
  its own account with *a guard implying otherwise would be one this repository could not keep, and
  `CLAUDE.md` carries the entry rather than this record pretending to cover it.* Read at `21279f6`,
  that record's own commit: this file carried one passage on the subject, about `yarn dlx` being
  **broken**, and its closing sentence declines the job in as many words — *it is not this list's
  class … rather than filed as a declaration nobody keeps.* So the description was sound, the filing
  claim beside it was false, and it is the filing claim a reader believes. It is the shape the
  `stage's requirements` entry closed on, arriving on a record rather than on an entry. **Both halves
  are answered now**: this entry is the filing, and ADR-0138 carries a head note saying which of its
  two clauses was false and which was not.

  **Half of it closed, and the half that closed is *whether anybody looked*.** ADR-0214 gives the
  table `THE_WAYS_WERE_READ_FOR`, and
  `the-ways-to-run-it-were-read-for-the-version-this-package-declares` compares it with
  `THE_PACKAGE_VERSION` — offline, no network, no package manager. Seen red on the state this
  repository really lived in for sixteen days: the stamp put back to `1.0.4` gives **1 failed, 466
  passed**, the new guard alone. It would have been red at `1.1.0`, at `1.1.1` and at `1.2.0`.

  **What it does not buy is the half the entry is named for**, and no offline guard reaches it: that
  the four spellings *run*. So the population below is unchanged, the cadence below is unchanged, and
  what moved is that a release which forgets the cadence is now a red rather than a silence.

  **Where this looked**: `THE_WAYS_TO_RUN_IT` in `packages/registry/address.ts`, which carries the
  readings in its own comment and is where a rewrite of them lands; the guards ADR-0138 names
  in `packages/site/pages.test.ts`, every one of which reads what the page *hands over* and not what
  a spelling *does*; and `packaging/against-the-origin/the-whole-chain.test.ts`, the one suite here
  that reaches a live host, which installs a tarball this repository builds and never one npm serves.

  **The population is the four rows, the fifth form `bunx --bun` that is published and not tabled,
  and the six commands behind the invocation**, and it grows by a row the day a manager is added or
  `deno` becomes measurable. **A guard is refused rather than unbuilt.** One that installs from npm
  reddens on three things and this repository owns one of them — npm, a manager, or this package —
  so two of its three reds are a notification nobody here can repair; and the only placement where
  the claim and the artefact coincide is *after* `publish`, which is a verdict arriving behind the
  irreversible act ADR-0109's ordering exists to keep every reading in front of.

  **What replaces it is a cadence, and it is attached to the only event that can falsify the reading
  from this side**: between publications nothing in this tree moves what npm serves, so the table is
  re-read in the unit that moves `THE_PACKAGE_VERSION`. **The cadence has a mechanism under it now**,
  and the shape of the stamp was decided on two measurements rather than on taste: a per-form field
  costs a reader 912 B raw and 161 B in brotli across the six contract pages that serialise the table
  into `data-ways`, and — the argument that actually decides it — a guard over per-form stamps can only
  reduce them by taking the oldest, so four values would be carried to compute one and a row going
  stale beside a fresh one would be silent. **ADR-0213's own spelling of the stamp was corrected by
  building it**: *the version its readings were taken against* can never be green, because npm does not
  hold the version this tree declares until the push declaring it has published, so that spelling is
  red for the whole of every release unit — on the one push ADR-0109's ordering exists to put every
  verdict in front of. What is stamped is the version this package declares when the table was last
  read. ADR-0138, ADR-0213, ADR-0214.

- **That every path this catalogue serves is a path the confinement admits.** ADR-0206 states one
  alphabet for a path this tool writes, reads or removes, and the catalogue states another for what a
  contract folder may be called - and the second is `readdirSync`. They agree today by a literal:
  `referenceImplementationOf` filters an implementation's files to `'reference.ts'`, so the only
  spelling that reaches an install is that one, and `CONTRACT_NAME` is a strict subset of the alphabet
  whose segments cannot begin with a dot. **Nothing keeps the agreement.**

  **The failure has no event and it is the expensive direction.** A contract whose folder holds
  `edge cases.ts`, `réference.ts` or `x+1.ts` is served correctly, hashes correctly, and is refused at
  the moment somebody installs it - with a sentence about a path being outside a directory, which is
  true and is not the cause. It arrives the day the filter opens, which `plan.ts` already names as a
  unit of its own: *a folder arrives beside the entry rather than around it*.

  **Where this looked**: `referenceImplementationOf` in `packages/registry/serialise.ts`, which is the
  literal; `harnessOf` beside it, which derives a path from a directory listing and constrains nothing
  about its spelling; and `A_PATH_INSIDE` in `packages/cli/where-a-file-may-land.ts`, whose comment
  says it is the alphabet `configuration.ts` always required and says nothing about the catalogue.

  **The population is every file name a contract folder may hold**, which is unbounded, and the part of
  it that reaches an install is one spelling today. What would close it is a guard total over the
  catalogue - *every path this catalogue serves is one the confinement admits* - which is one
  expression over `theCatalogue` and would be **born green on today's six**, on the rule this
  repository states for a guard that finds nothing on the day it is written: the event it would catch
  is the eighth contract, or the unit that opens the filter, and what that event costs is an install
  that refuses a contract nobody can see is wrong. Priced as its own unit and not taken, because a
  security release is not where one decides what the catalogue's own alphabet is. ADR-0206.

- **That a link standing where the file itself goes is answered.** ADR-0206 measured the directory half
  of that class and left the other half unmeasured, and it says so rather than deducing it: a
  **junction** at the configured directory made a write land outside the project, and `symlink` for a
  file answers `EPERM` on Windows without the privilege, so the probe could not be built. The reading
  says `renameSync` replaces a link rather than writing through it - the staged file is written at
  `<destination>.toopo-part` and renamed onto the destination - and **a reading is not a measurement**,
  which is this repository's own rule arriving on its own review.

  **It is not the same shape as the half that was measured.** That one is about the *directory* leading
  out of the project and is closed by comparing what the directory really is. This one is about a link
  at the *leaf*, where the question is whether the rename replaces the link or follows it, and no part
  of the confinement decides that - it is what the operating system does with `rename`.

  **Where this looked**: `commit` in `packages/cli/write.ts`, whose staging suffix and rename are the
  whole of what decides it; `a-directory-that-leads-out-of-the-project-is-not-a-place-a-file-may-land`
  in `packages/cli/where-a-file-may-land.test.ts`, which builds a real junction and fails rather than
  passing where the platform will not make one; and ADR-0206's own classes, where it is declared
  unmeasured.

  **The population is one question on two operating systems.** What would close it is a probe on any
  POSIX machine, or on a Windows runner with the privilege - and `suites-on-windows` is a job this
  repository already owns, which is where it would go. Priced at one guard and not taken here, because
  a release is not where a platform matrix gains a case. ADR-0206.

- **That somebody adding a guard reads the one thing that says what else has to move.** Two mechanisms
  answer for a new guard and **no suite reaches either**: `mutation/census.ts` declares how many guards
  each file collects, and a battery declares a cell or a region for every guard. Both are read at a
  battery's *calibration*, and a suite never reaches one.

  **It is measured rather than argued, and the figure is what makes the step defensible.** At
  `f64fe7f`, `pnpm run cli` was green on 191 tests and said nothing; `pnpm battery cli-install`
  reproduced the runner's refusal **line for line in twenty seconds**. The run that had to be paid
  instead took **thirty-seven minutes and reddened nine jobs**, and repairing what it named revealed
  the second mechanism, which cost four more replays. **Twenty seconds against an hour, twice.**

  **It is not new and that is the point.** `census.ts` carries the price in its own words - *the
  maintenance cost, stated plainly rather than discovered. Adding a test breaks this pin* - and
  measures three earlier instances, one of which it says *fired on the first unit to reach it, which is
  what it was written for*. **The mechanism has never failed.** What is missing is that nothing routes
  anybody to the cheap reading before they pay for the expensive one.

  **Where this looked**: `assertTheCensusHolds` in `mutation/run.ts`, which is where both refusals
  live; `CENSUS` in `mutation/census.ts`, whose own comment states the price; and the `scripts` block
  of `package.json`, where `battery` sits beside `cli` with nothing saying that one answers a question
  the other cannot.

  **The population is every unit that adds or removes a guard.** What would close it is a convention
  with something under it - the eight suites cannot read a census without becoming the instrument, so
  what is available is a line where somebody adding a guard arrives, and that is prose. Priced and not
  taken. ADR-0206.

- **That a figure corrected inside a unit reaches every surface that unit writes.** A record is dated
  and an entry of this list is the present tense, so when a measurement moves *during* a unit the
  record is rewritten and the entry is whatever was drafted before the correction. Nothing rereads it.

  **It is measured rather than feared, and the cost is this list's own.** ADR-0212's count moved from
  fifteen to fourteen when the replay refused, and the record took the correction. The two passages of
  this file had been drafted before it and were spliced in unread: **eleven figures across them were
  the pre-correction state**, internally consistent with each other and with a world that had stopped
  existing - a collapse count, a row count, a coefficient, a ceiling, a bucket total, and the
  classification of the resisters, in both passages. **Not one carried a coordinate that would have
  warned a reader**, which is what separates this from a stamped reading. Two more sat outside this
  file, in a battery comment and in the record's own Consequences.

  **All thirteen were found by the owner reading, and by nothing else.** Every suite was green, the
  meta suite included, and the figures resolve against no mechanism at all.

  **It is the shape ADR-0211 published one unit earlier**, where ADR-0210's *174* is contradicted by
  its own rule commit's *173* - and this is that shape arriving on the same author, in the same week,
  on thirteen figures rather than one. Rules 1 to 3 of this section are written against an entry going
  stale over *units*; this one goes stale inside a single one, between a draft and a commit an hour
  apart.

  **Where this looked**: the fault functions of `mutation/decisions.ts`, which resolve what a
  record *names* and read no figure in it; `mutation/readme.test.ts`, which is the one guard resolving
  a published figure against what produced it and which reads one page; and `mutation/history.ts`,
  whose sweep over this file is for commit identifiers and refused addresses rather than for the
  numbers beside them.

  **The population is every figure a unit publishes on more than one surface.** What would close it is
  the thing several entries here already name, price and refuse - a validation stage reading this
  repository's own strings - and this is the first of them whose subject is *one unit's own two
  surfaces disagreeing*, which is narrower and might be reachable where the general lint is not: a
  figure in an entry and a figure in the record that entry cites are two strings a machine could be
  asked to compare. Priced as its own unit and not taken. **What is cheap and is done instead is a
  convention**: the entry is written from the record after the record is final, and never beside it.
  ADR-0212.

- **That a new guard is answered for as many times as it is collected.** A battery accounts for guards
  per *battery* and never globally, so a guard added to a suite four batteries collect is owed four
  answers - a cell in each, or a declared region in each. Nothing says so anywhere, and the arithmetic
  is invisible until a replay prints it.

  **Measured on the unit that found it**: ten guards added to `packages/cli` were owed **thirty-eight**
  answers, not ten - `cli-install` and `cli-update` account for theirs with seven cells between them,
  and `cli-remove` and `cli-search` with a declared region each. The declarations are honest and were
  not free: each rests on a search over its own surface, by what the guards' test files import.

  **The trap it opens is worse than the arithmetic.** The cheapest way to satisfy a battery that cannot
  reach a guard is to widen its surface until it can, and the count then goes green on a battery that
  has changed subject rather than found a witness. `cli-search` injects into one file by design; adding
  the confinement to it would have bought a green and no evidence.

  **Where this looked**: `unprobedRegions` and `unreachableGuards` on `Battery` in `mutation/run.ts`,
  which are per battery by construction; `mutation/attribution.ts`, whose census is over `(folder,
  identifier)` pairs rather than over identifiers alone, which is what makes a collision across folders
  visible at all; and
  `CLAUDE.md`'s own note that adding a guard moves the census, which names one mechanism and not this
  one.

  **The population is every guard of a suite more than one battery collects**, which is `packages/cli`
  at four and every contract folder at two. What would close it is not a guard: the shape is right and
  what is missing is that nobody knows the multiplier before they pay it. Written down rather than
  priced, because the remedy is the same prose the entry above it needs. ADR-0206.

- **That a request this client makes stays on the origin it was given.** `fetch(url)` in
  `packages/cli/http-source.ts` takes no options, so node follows a redirect to any host at all, and
  the two answers a client cannot check - the index and the implementation bindings - are exactly the
  two that would then come from somewhere nobody named. Everything downstream of a digest is
  content-addressed and survives it.

  **Half of the class is closed by construction and that is why this is narrow.** The authority of a
  request cannot be steered by an address: `pathTo` always leads with `/`, and `chooseContract` matches
  what a user typed against the index before any address reaches a URL. What is left needs the origin
  itself to issue the redirect, and the origin is the declared root of trust for those two answers - so
  this is defence in depth rather than a hole, and it is written down as such.

  **Where this looked**: `answering` in `packages/cli/http-source.ts`, which catches a throw and reads
  a status and has no opinion about where the response came from; `endpointOf` in
  `packages/registry/endpoints.ts`, which decides an address and never a host; and
  `packages/cli/http-source.test.ts`, whose guards run against a server this repository starts, so the
  origin and the answer are the same host by construction and no guard there could see one part.

  **The population is the five methods of the port.** What would close it is `redirect: 'error'`, or
  following one and refusing an answer whose final URL left the origin - a decision about which, plus a
  sentence for the refusal, plus a guard that needs a second server. Priced as a small unit and not
  taken: it is not a path frontier, and ADR-0206 was one repair. ADR-0206.

- **That an answer this client reads is one it could hold.** `insisted` and the snapshot reader call
  `response.json()` with no bound on what arrives and no question about the content type, so what a
  registry answers is what this process allocates. A body that is not JSON throws where every other
  refusal of this tool is a sentence.

  **It is out of scope by a model committed before the reading, and it is on this list rather than in
  that record for the reason the model itself gives.** Denial of service was declared out of scope at
  `9942756`, before a line was read - and a client that hangs or dies wrote nothing, which is why. What
  a model excludes is not thereby uninteresting; it is unbudgeted, and this is where the unbudgeted
  goes.

  **Where this looked**: `answering` and `insisted` in `packages/cli/http-source.ts`;
  `TheRegistryDidNotAnswer` beside them, which is the screen a failed fetch gets and which no JSON
  parse failure reaches; and `packages/cli/source.test.ts`, whose port guards answer about what a
  source returns and never about how much of it there is.

  **The population is the five methods of the port.** What would close it is a bound and a sentence -
  read the body as bytes with a ceiling, refuse above it, and name the ceiling - and the number is the
  part nobody can derive: the largest answer this catalogue serves is a contract snapshot, and a
  ceiling set from today's catalogue is one the eighth contract may cross. Priced as its own unit and
  not taken. ADR-0206.

- **That a layout a script produces is one somebody has looked at.** Every sweep this repository has
  ever taken over its own pages reads the *emitted* tree - the HTML `build.ts` writes. A control
  `start.ts` adds in the reader's browser is in none of them, so **a sweep over emitted pages cannot
  see what a script adds**, and the geometry a reader actually meets is the geometry of a document
  this repository has never rendered.

  **It is not hypothetical and the instance is what opened the entry.** ADR-0135 swept 14 pages × 21
  widths × 2 themes and repaired a wordmark that broke below 479. The masthead search field is built
  by `start.ts`, so it was in none of those 294 renderings. Measured at `6dadac2` in a browser, at 390
  with the module running: the wordmark is squeezed to **38.05px wide and 129.53px tall** - this site
  introducing itself as five lines of one letter - and removing the field returns it to 69.39px.
  Every suite was green, and `every-page-is-reachable-from-the-front-page` and its neighbours were
  looking at a document in which the defect cannot occur.

  **Half the machinery to close it exists and half does not, and the half that exists cost more than
  this entry said.** The clause that fell is *reaching the enriched DOM is solved and costs nothing
  new*: `start.test.ts` does run `start.ts`'s builders against a happy-dom document, and for the copy
  control, the manager row and the search panel that is the whole of it. **For the playground it is
  not.** ADR-0187 wrote the first two guards over that form and the reason nobody had is measured: the
  builder resolves its module against `document.baseURI`, which under that suite is `http:`, a scheme
  node's loader refuses. Reaching it took handing the reference over as a `data:` URL - the route
  `playground.test.ts` already takes to run the shipped module - **and that substitution establishes
  nothing about whether the relative address resolves in a browser**, which is a second thing this
  entry's population is not covered for.

  **Measuring it is still not solved**: probed at `6dadac2`, happy-dom's `getBoundingClientRect()`
  answers `{width: 0, height: 0}` for an element declared `width: 200px; height: 40px`, and
  `getComputedStyle(el).width` answers `200px` by echoing the declaration back. It parses and cascades;
  it does not lay out. So a guard over the enriched *layout* needs the thing that lays text out, which
  is the headless browser this list already prices and refuses in four other entries - and this is the
  first of them whose subject is a page *after a script has run* rather than the page as served.

  **What ADR-0187 narrowed is a different claim, and the distinction is the point.** The playground's
  form was named in the population below and was read by **nothing at all** - not its layout, not its
  structure. It has two guards now, and they read what it *built*: a field per argument, a label that
  names its own field, an answer in the block the registry paints code in. That closes *nobody has
  looked at this markup* and closes none of *nobody has looked at this geometry*. The old panel it
  replaced is what says so: it wore the previous site's language through the whole redesign, and no
  guard here had an opinion about how it looked either before or after.

  **Where this looked**: `pages.test.ts`, whose guards build documents and read their text;
  `published-tree.test.ts`, which reads what `build.ts` wrote; and `start.test.ts`, which runs the
  builders and asserts what they put in the DOM and never where it lands. That last sentence is the
  one that survives ADR-0187 unchanged, over a file that gained guards under it.

  **The population is every control `start.ts` adds, on every page that carries one, and the
  enumeration this entry gave was short by two.** Measured at `ccc9fca`: `start.ts` exports **six**
  builders — `copyControl`, `managerControl`, `themeControl`, `searchControl`, `playgroundControl`,
  `siftControl` — where this entry named the copy controls, the theme button, the search field with
  its answers panel and the playground's form, and left out the manager row and the shelf's domain
  filter. The pages are **8 files of HTML** rather than seventeen: all eight name a copy control, a
  search and a theme, and **six** carry a playground. ADR-0193. What would close
  it is one browser and a sweep at the widths ADR-0135 used, and it would be **red on its first run**,
  which is the rare shape on this list: a guard that is not born green. Priced there and not taken
  here, because a unit repairing a wordmark is not where one decides to add a tool to the repository.
  ADR-0184.

- **That a contract this catalogue could publish is one its own playground can build a form for.**
  `playgroundOf` refuses a parameter whose declared type is not a key of `AS_AN_ARGUMENT`, and
  `contract-page.ts` calls it with no `try` — deliberately, because *rendering the page without it
  would publish a contract page that silently lacks the one thing on it a reader can try*. So the
  set of contracts this catalogue can publish is bounded by a table in the site, and nothing says so
  where a contract is written.

  **The bound was attributed to the wrong thing until it was measured, and the control is what says
  so.** Substituting signatures onto `string/slugify@1`'s record at `7c1cf96`: `<T>(text: string) => T`
  and `<T extends string>(text: string) => T` **build**, exactly as the concrete signature does — a
  type parameter list is invisible to the playground — while `<T>(text: T) => T` is refused, and
  **`(carrier: PlainDate, duration: Bag) => PlainDate`, which carries no type parameter at all, is
  refused identically**, naming the same parameter in the same sentence. The obstacle is an unmodelled
  parameter type and never a generic.

  **The failure has an event and it is the wrong one.** It arrives at the build, after the contract is
  written, its seven files are in place and its cases are settled — which is the most expensive moment
  there is to learn that the shape cannot be served. Behind the field lies a second floor: `value.ts`
  encodes a class instance by its **own fields**, so a carrier keeping its state in internal slots
  encodes to `{"kind":"instance","className":"…","fields":[]}`, `hasASpelling` answers false, and the
  case table renders `<an instance of …>` — ADR-0163's defect, met on a contract the catalogue would
  publish rather than on one it turned down.

  **Where this looked**: `AS_AN_ARGUMENT` in `packages/site/playground.ts`, which is the table and
  which names its own extension in its refusal; `whatKeepsARowFromTheForm` beside it, which is the
  second branch and is about a case rather than a type; and `packages/registry/field-map.ts`, whose
  strata class `surface.exports[].parameters[].type` `structural` and say nothing about whether
  anything can build one.

  **The population is every parameter type a future contract may declare**, which is unbounded, and
  the part of it that is buildable today is the handful of keys that table holds. What would close it
  is not a guard over the table — a guard total over `theCatalogue` would be born green on seven
  contracts that already build. What would close it is the reading moving to where a contract is
  decided rather than where a page is emitted, which is a unit of its own. Priced and not taken.
  ADR-0218.

  **The cheap way round it was measured and there is not one, which is what makes this entry a
  price rather than an oversight.** The route that would avoid touching the encoder is a carrier
  expressed as a value this catalogue already spells — measured at `58ab1a8`, nineteen subjects and
  fifteen kinds, **thirteen spelled and two not**, the unspelled two being `instance` and `not-data`.
  **`date/add@1` is the precedent and it points the other way**: a `Date` keeps its state in an
  internal slot exactly as a Temporal carrier does, and it is spelled `new Date(1768435200000)`
  *because `value.ts` models it as a kind of its own*. So the precedent establishes that a carrier is
  spelled by being given a kind, which is the repair rather than a way around it.

  **Both string transpositions fail, and they fail differently.** Inferring the carrier from the ISO
  string dissolves the disagreement: an ISO string does not determine its carrier, so two honest
  parsers of one contract answer *ignored* and *refused* on the same row with nothing in the language
  separating them — and `Temporal.from` does
  not exist, so the question such a contract would have to settle is one no API asks. Naming the
  carrier as data preserves the disagreement exactly, round-trips losslessly on seven carriers of
  seven, and is not the same function: it is not generic, its caller holds a string rather than a
  carrier, and it grows ADR-0216's residue by a decision the language does not pose. ADR-0219.

  **The counts that argument was illustrated with are each short by one, and one carrier is the whole
  cause.** Rebuilt on Chrome 152 — the engine ADR-0219 names — over every carrier `Temporal` offers:
  `2026-01-15` is **4** where that record publishes 3, `2026-01-15T12:30:00` is **5** where it
  publishes 4, and the zoned string is **7** where it publishes 6; the four rows reading `1 each`
  agree. **Every gap is `PlainMonthDay`.** `Temporal` offers **eight** carriers and **seven have
  `add`**, `PlainMonthDay` having none — so seven is exactly right for every question ADR-0216,
  ADR-0223, ADR-0224 and ADR-0225 ask, all of which are arithmetic, and that table asks a *parsing*
  question, whose population is the eight that have `from`. It inherited the arithmetic one, which is
  ADR-0233's rule one level up: **a population is faithful on the question that selects it, or it
  counts something else.** The conclusion is untouched, resting on an ISO string not determining its
  carrier, which holds at 4, 5 and 7 as it held at 3, 4 and 6.

  **And the reading beside it was wrong the same way, in the unit that names the class.** Asked over
  the three carriers ADR-0225 admits, the first sweep reported *one spelling of seven* on a population
  of seven nobody stated, which left out the zoned form ADR-0219's table names and the seconds-less
  form its head note names; the owner counted two and was short for the same reason; that head note
  counts three over its own twelve. **Three readings, three numbers, each right of the population it
  swept.** What replaces them is the rule they are samples of, total over a stated twelve and agreed
  by Chrome 152 and V8 13.6.233.17 row for row: **a string is ambiguous over the three retained
  carriers exactly when it carries a date and a time and no `Z`** — `PlainTime.from` takes the time
  out of it and `PlainYearMonth.from` takes the year-month out of the same one. Four such strings, all
  ambiguous; one with `Z`, taken by **none**, the arity holding no exact-time carrier; and seven
  without a date or without a time, each taken by exactly one. **The pair never moved** — every
  collision in every reading is `PlainTime` against `PlainYearMonth`, which are the two carriers whose
  verdicts differ — so *not mutually exclusive* stops being a count and becomes a property of the
  format, which strengthens ADR-0219's conclusion rather than weakening it. ADR-0236.

  **The arity is four, the first price is one kind at five sites, and the rule that produced both was
  committed before the count.** ADR-0220 left item 1 unsized in as many words — *whether that is one
  kind, four or five is undetermined* — and the two records naming a five name **different sets**:
  ADR-0220's is `Duration`, `PlainDate`, **`PlainDateTime`**, `PlainTime`, `PlainYearMonth`, and
  ADR-0219's control table is `PlainDate`, `PlainTime`, `PlainYearMonth`, **`Instant`**, `Duration`.
  They share four, and those four are exactly the four ADR-0216's R13 clause names — **which is a
  coincidence and not a confirmation**: that clause asserts zone-freeness, six of the seven carriers
  are zone-free, and it is a rebuttal rather than an enumeration. **The rule admits a carrier of which
  the question can be asked** — at least one of the ten duration units is inapplicable to it — and the
  narrow rule *the language answers otherwise* was refused before it was applied, because it keeps only
  the carriers that swallow and renders **two**, against ADR-0150's forty-three rows of which
  thirty-eight agree. Measured at `d7f4e56` on Chrome 152.0.7977.77, the matrix reproducing ADR-0216
  row for row: `PlainDate`, `PlainTime`, `PlainYearMonth` and `Duration` are in; `PlainDateTime` and
  `ZonedDateTime` apply all ten units, so **the question cannot be asked of them at all**; and
  `Instant` is out on **R12 read per carrier** — `date/add@1` declares eight duration units and applies
  every one to an absolute instant, `Temporal.Instant` refuses four, and all four are among the eight.
  **R13 removes nobody**, the one carrier that follows the zone being already out on posability, so
  posability implies zone-freeness on this population and `Instant` is zone-free — measured against a
  positive control, `{days: 1}` moving a `ZonedDateTime` by 23 hours where `{hours: 24}` moves it by
  24. **The arity does not multiply either price**: one encoding shape is lossless on seven carriers of
  seven and its spelling re-evaluates on seven of seven, so item 1 is **one** kind, and `parametersOf`
  reads the generic form as `carrier: T` **identically at arity four and five**, so item 3 is one key
  and one choice rather than four entries. What one kind costs is **five sites of which the compiler
  names two** — `literal.ts`, which returns `string`, and `read-literal.test.ts`'s `EVERY_ARM` — while
  `decode`, the walk and the encode recogniser are silent, so a kind added by following the compiler
  alone decodes to `undefined` with every page still rendering. ADR-0223.

  **What `inapplicable` means in that rule is settled by measurement, and it took one row of the matrix
  down with it.** It is behaviour **quantified over a carrier's values** — neither one base nor the
  components the carrier carries. The structural reading was refused on **four of six** carriers rather
  than on the one line it was handed over broken on: `PlainDate` has no `week` component and applies
  `weeks`, and `Instant` carries **no component of the ten at all** while applying six. The arity is
  **four and unchanged**, against a failing direction — `years`, `months` and `weeks` apply to **0 of
  11** `Duration` bases, and had one applied the set would have been empty and the arity three. **What
  moves is that `Duration`'s row is bimodal and no other row is**: a receiver whose largest unit is a
  calendar unit refuses all ten, `nanoseconds` included, where one whose largest unit is `days` or
  smaller refuses three — so `P1Y` refuses to have a nanosecond added to it. **The matrix reads one base
  per carrier**, the method ADR-0216 established and ADR-0223 reproduced, and for one row of seven that
  is not enough; the other five are stable across their bases. **The case table is 50 rows and not 40**,
  because a contract must settle both receiver modes. Both prices are unmoved, which is what made the
  question worth settling slowly. ADR-0224.

  **The residue that record sharpened is answered, the owner's sentence survives the test he asked for,
  and the arity moved anyway — for a reason nobody had written down.** The criterion was committed at
  `0c0f8c0` before a probe was written: the sentence is one rule exactly if, for every carrier value and
  every unit, the verdict of `add` is a function of that pair alone, so anything the verdict depends on
  that the pair does not name is a second clause whatever it is called. **The clause he feared has no
  instance** — over **520** pairs of units that each apply alone, **7** bags do not apply and all seven
  are the range rather than a refusal, and over **19** `Duration` bases the mode predicts the
  inapplicable set with **nought exceptions**. So *…or that the pair does not permit* is not owed, and
  `Duration` is the same subject. **His counter-argument falls, and on the axis he set aside**: the
  inapplicable set is one set for each of the other carriers and **two** for `Duration`, and *the cause
  is the receiver rather than the unit* — the predicate he discounted as being about reasons — **is that
  same reading taken observationally**, because a cause that is the receiver shows up as a verdict that
  moves when the receiver moves. The heterogeneity he points to is real and sits on an axis that
  separates nobody. **What fell instead is the matrix.** `PlainDate.add({hours: 24})` answers
  `2026-01-16`; `{minutes: 1440}`, `{seconds: 86400}` and the same count of milli-, micro- and
  nanoseconds all answer it too — **all six time units act as soon as they reach a whole day**, so
  `PlainDate` truncates rather than swallowing, its inapplicable set is **nought and not six**, and it
  leaves on posability exactly as `PlainDateTime` does. **The arity is three — `PlainTime`,
  `PlainYearMonth`, `Duration`** — and neither outcome named in advance had `PlainDate` as the carrier
  that goes. ADR-0216 measured each unit **alone with the value 1**, ADR-0223 reproduced the method and
  ADR-0224 corrected it along the other axis; **the matrix reads one value per unit, which is ADR-0224's
  own sentence one axis over**, and two engines agree — Chrome 152 and V8 13.6 under node v24.15.0.
  **ADR-0224's *arity four* and *50 rows* both fall**: the table is **40 rows**, three carriers of which
  one is bimodal, which returns to ADR-0223's figure by a different route. Both of ADR-0218's prices are
  unmoved, as the owner said they would be. **And a real defect is now outside the rule's reach**:
  `PlainDate.add({hours: 5})` answers the same day and loses five hours in silence, which is
  `date/add@1`'s own frozen phrase, and the committed rule cannot see it because the rule is written
  over the unit and the phenomenon is over the value. Reopening it is the owner's. ADR-0225.

  **And the lock under the first price is being measured, which nothing had done.** `value.ts` is the
  encoder whose output the freeze fixes and six published contracts are bound to digests taken over what
  it produces, so *one kind at five sites* is a cost in edits only if adding a kind leaves those digests
  where they are. **Two questions the word *moves* runs together are separated before the probe**: does
  the ledger's digest change, which is a property of the encoder; and does `the-freeze.test.ts` redden,
  which is a property of a comparison whose past is rebuilt by spawning a worktree at the published
  commit and running **that commit's own** entry point. **Four outcomes, both criteria and the
  prediction with its bias are committed at ADR-0231 before a figure of them is read** — the bias
  declared towards *neither moves*, which is the outcome under which item 1 stays work rather than
  becoming the owner's decision.

  **Neither moves, and the control is what makes that worth anything.** With the kind present the
  registry typechecks clean on two edits, the ledger is **`18cc4e82…` byte for byte, 1 206 either
  side**, and `pnpm freeze` is **3 passed**. Re-aiming the same arm by one character of its predicate,
  so that it catches the plain objects the catalogue is full of, takes the ledger to
  **`2dbce1f3…`** and reddens
  `every-published-binding-still-hashes-to-what-it-was-published-as` **alone**. **So the probe could
  return the other answer and did not.** The two questions turn out to be **coupled, and the mechanism
  says why**: `bindingsAtRevision` spawns a worktree at the published commit and runs *that commit's
  own* entry point, so an encoder that changes its output makes the local ledger and the rebuilt one
  disagree by construction — a silent divergence has no instance. **`value.ts` is in no digest by its
  content and in every digest by its output**, `THE_SHARED_FILES` being two files of
  `packages/catalogue/` and naming it nowhere. **So item 1 is ordinary work under a condition the
  freeze already keeps**, and not permanent rule 6; and **items 2 and 3 are outside the perimeter
  altogether**, `literal.ts` and `AS_AN_ARGUMENT` being `packages/site`, which no digest reaches by
  content or by output. Nothing was taken and the tree is clean. ADR-0231.

  **The first price is paid, and the arm nobody listed is where the work was.** The owner ruled that the
  three prices bind before the contract, so they are taken now. **Written guard first**: five guards
  against a double — an object matching a carrier on every property the encoder reads, each measured on
  Chrome 152 — fail on the old tree with a message that is not *the wrong kind* but
  `UnencodableValue: probe holds a Temporal.PlainTime, which the registry does not model`. **That
  corrects ADR-0218**, which says a carrier encodes to an instance holding nothing: `unmodelled`
  refuses any tag that is not `Object`, so a contract carrying one could not be serialised at all.
  **And it corrects ADR-0223 twice.** `unmodelled` is a site that record does not name and is the one
  that decides whether the rest runs — the refusal fires at line 567 and the `Date` precedent is at
  638, so **ADR-0231's throwaway arm was dead where it stood**, which only writing the guard could
  find. And `read-literal.ts`, measured there as costing nothing, reddens
  `every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` the moment a spelling it cannot parse
  exists — so the carrier joins `WITHOUT_A_SPELLING` as `<a carrier `, which is ADR-0218's own line
  between its item 1 and its item 2. **The compiler named exactly the two sites ADR-0223 measured, at
  the same two line numbers.** Ledger `18cc4e82…` unmoved, `pnpm freeze` 3 passed, registry 472, site
  187, cli 196, packaging 24, census 34 → 39, cell `E-27` reddening the five together. **What the double
  does not prove is declared in the code and in the record**: that a real carrier presents that tag, and
  that `from(rendered)` returns the value — both measured on Chrome 152, neither exercised by anything
  that runs here, and a runtime carrying `Temporal` is what lifts them. ADR-0232.

  **And why ADR-0218's figure was wrong is worth more than the figure, because it is a rule.** Its
  stand-in was an ordinary class: **no own fields, which is the property it was reasoning about, and
  `[object Object]`, which is the property that decides**. Measured side by side in one process, the
  two doubles agree on the first and part on the second — the ordinary class reaches the instance arm
  and encodes to exactly what that record published, where a carrier is thrown out **149 lines earlier**
  at `7c1cf96`. **So: a stand-in is faithful on the axis that decides the path, or it measures something
  else** — and the tell is that **the red looks right**, a double missing the tag failing with
  `'instance'` where `'temporal'` was expected, which names the guard, the arm and the expectation and
  carries no sign that the value never travelled the road under test. **ADR-0232's double holds against
  that rule on the strength of its own first red** — `UnencodableValue … a Temporal.PlainTime`, the
  refusal a real carrier meets at the point it meets it — with the five axes of `encodeAt` read on
  Chrome 152 before it was written, and **one of them credited to `Object.create` rather than to
  method**. **Item 2 is re-costed and not taken**: ten lines in `read-literal.ts` on `readDate`'s shape,
  and then a decision item 1 never met — `readDate` ends in `new Date(epoch)` where `readCarrier` must
  end in `Temporal[name].from(...)`, so **an encoder reads a value somebody else built and a reader has
  to build one**, with nothing to build it from. It is a browser module and the guards run on node, so
  the three ways out — throw, double by runtime, or wait — are a rule about the product rather than an
  edit, and they are the owner's. ADR-0233.

  **The owner ruled that it refuses loudly by name, and one of his three reasons was refuted by
  measuring it.** The two that stand are the catalogue's own — *a runtime without the function fails
  loudly instead of skipping* — and that a stand-in would make every guard exercise the substitute on
  the very axis ADR-0233 had just recorded. **The third was that
  `every-arm-of-an-encoded-value-is-read-back-or-refused-by-name` carries both issues in its name. It
  does not**: its two ways out are *read back* and *refused by the word `WITHOUT_A_SPELLING` holds*, so
  a refusal naming the carrier satisfies neither, and the guard reddens on exactly the message the
  ruling asks for. **The ruling stands on its other two and the guard gained a category.**
  `READ_ONLY_WHERE_THE_RUNTIME_CARRIES_IT` asks a refusal for **two** fragments on one message — which
  carrier, and why this runtime cannot build it — so it **costs its arm more than the two beside it**
  and a message saying merely *unreadable* passes the old shape and fails this one. Two guards keep it
  honest: the declarations are held disjoint, and
  `a-carrier-is-recognised-by-the-reader-and-refused-by-the-runtime` separates the two refusals, which
  the fragment test cannot — without the reader's arm the refusal still throws and still carries the
  type name, that name being in the text somebody typed. **`W-179` neuters the pattern rather than
  removing the dispatch**, so `noUnusedLocals` does not turn it into a `killed-by-typecheck`, and
  injecting it reddens **2 of 12**, exactly its pin. The table prints
  `Temporal.PlainTime.from('12:30:00')` and `hasASpelling` answers **true**, which is the whole of what
  item 2 buys. Ledger `18cc4e82…` unmoved, freeze 3 passed either side, site 187 → 189, 935 anchors,
  census 10 → 12. **The refusal is exercised and the construction is not** — written in `readCarrier`,
  in the declaration and in `literal.ts`'s arm, and lifted by a runtime carrying `Temporal`. ADR-0234.

  **The third price is costed and not taken, and it turns out to be two prices counted as one.**
  `AS_AN_ARGUMENT` is keyed by declared type text and holds **five** entries where its own header says
  four; the catalogue declares seven distinct parameter types and **`T` is not among them**, so the key
  would land on an empty slot rather than on an occupied one. **The collision is between a global key
  and a per-signature name, and `parametersOf` is what makes it unavoidable**: the four-carrier bound,
  the three-carrier bound and no bound at all all render `carrier: T`, so nothing in the key could tell
  one contract's `T` from another's — and the bound is one field away, `ExportRecord.text` transcribing
  the whole signature that `parameters` is read off. **What ignoring it costs has a witness that exists
  today and it is silent**: retyping `number/parse@1`'s `input` to `Duration` **builds a form** with
  `date/add@1`'s entry, no refusal fires, and the one guard over the table stays green — it is total
  over a type the table does not hold and blind to a key the table holds meaning the wrong thing, which
  is `W-37` made permanent with no cell able to redden on it. **The site count is two by ADR-0223's rule
  and five by behaviour**, and the compiler names **nothing outside the entry**, because
  `Readonly<Record<string, Argument>>` is an index signature where `EncodedValue` is a union — the
  hand-written refusal at `playground.ts:451` being the evidence rather than the reading. **The site
  nobody lists is `spelledFields` in `contract-page.ts`**, which composes a sentence a reader meets out
  of the entry's own `because`; it speaks on two of the seven pages today and nothing reads what it
  says, the third unit running in which the unlisted site was the one a reader receives. **Three counts
  in that file's own prose are false already** — *Four types* at five entries, and two beside it — and
  they are recorded rather than repaired, this unit having been forbidden the file. **And one of the two
  build-time refusals was removed by item 1 with nobody costing it**: a carrier used to encode as
  `instance`, which `WITHOUT_A_SPELLING` holds, so every carrier row was refused and `playgroundOf`
  would have thrown *the contract settles no case a form can hold* before ever reaching the type.

  **It is a prerequisite, and the reason is two lines anybody can check.** `contract-page.ts:180` calls
  `playgroundOf` with no `try` and `site.ts:78` maps it over every held contract; measured,
  `contractPage` on a contract retyped to `T` throws and nothing between there and `theSite` catches,
  against a control of seven pages. **So there is no publishable state in which a playground refuses to
  open its cases**, both refusals — an unmodelled type, and a contract settling no case a form can
  hold — being build-time throws out of that one call, and the hoped-for finding does not hold. **What
  splits instead is the price.** The key is a prerequisite and is **payable today**, runtime-independent:
  a literal field opens on the *written literal*, so the build never calls `read`, and `decode` rebuilds
  a carrier's surface without `Temporal`. A reader who can press the button is **not this price at
  all** — `read` refuses by name on both legs of the matrix, which is ADR-0234's ruling firing as
  written, and a stripped reference naming `Temporal` throws `ReferenceError` when called, so the replay
  reddens on an eighth contract whether or not the key exists. That half is ADR-0220's contributor floor.
  ADR-0235.

- **That the type sizes this catalogue draws are the scale it declares.** ADR-0115 settles the visual
  system at **six type sizes and no seventh**. The artboard draws **fourteen distinct sizes across
  eighty-one declarations**, of which **four land on the scale** - 11, 13, 15 and 16, which are `--t6`,
  `--t5`, `--t4` and `--t3` - and ten do not: 10.5, 11.5, 12, 12.5, 13.5, 14, 14.5, 15.5, 25 and 40.
  The design and a recorded decision are in direct conflict.

  **It was being settled silently, by writing pixels.** Measured at `f2ea3a1` inside the `STYLE`
  literal with comments stripped, `style.ts` held 46 pixel lengths and **no pixel type size** at
  `a9236dd` before the redesign, and 99 of which **13 were type sizes** after it, with eight more in
  the component layer. Nobody decided that; it is what *reproduce the artboard* comes to when the
  artboard and the scale disagree and nothing names the disagreement.

  **The distribution is the argument and it is why this is a real question rather than a tidy-up.**
  Twelve of the fourteen sit between **10.5 and 16**, separated by half-pixels. That is not a scale; it
  is the residue of adjustment by eye, and *reproduce it exactly* would mean reproducing the
  adjustments. Landing them on six moves the design. Widening the scale to fourteen is not a scale.

  **What is done rather than deferred is the half that is not a design question.** ADR-0185 puts every
  type size in `rem` - eight on the scale's own steps, twelve in `--a-point`, a sixteenth of the root
  multiplied by the artboard's number - so the sizes follow the reader's font setting and none moves at
  the default. **The count of call sites that are not on the scale is therefore greppable**, which is
  the number this entry descends by: `var(--a-point)` occurs twelve times today.

  **Where this looked**: `--t1` to `--t6` in `packages/site/style.ts`, which is the whole declared
  scale; ADR-0115, which settles it and gives the reason; and `packages/site/components.ts`, where the
  ones the component layer introduced now live.

  **The number this entry descends by went down by its own rule and up by the one that matters.**
  Measured at `ccc9fca`: `var(--a-point)` occurs **10** times in `style.ts`, against the twelve
  recorded here, and **22** times in the sheet a reader is served — `style.ts` interpolates
  `THE_COMPONENT_RULES` at its line 1055, and the component layer's own count is 12 where ADR-0185
  read eight. Pixel type sizes in the served sheet: **0**. Forty-four declarations sit on the six
  declared steps. So the greppable figure is a reading of one file and the sheet is composed of two.
  ADR-0193.

  The population is every type size this site draws. What would close it is a ruling on which of the
  three it is - the artboard lands on the scale, the scale grows, or the two are held apart on purpose
  with the reason written down - and that is the owner's. Priced as its own unit and not taken.
  ADR-0115, ADR-0185.

- **That a class a page writes is one a component owns.** ADR-0183 gives this site a component layer:
  five shapes whose class is derived from a closed union, whose rules sit beside their markup, and
  which nothing outside may paint. Two of the three properties are the compiler's. **The third is not
  yet**: a page can still write `class:` by hand, and until it cannot, the layer is a place components
  live rather than the only place they can.

  **What would close it is measured rather than estimated.** `Attributes` losing `class` — spelled
  `Readonly<Partial<Record<AttributeName, string>>>` over a closed set of about twenty-three attribute
  names — makes `el('span', { class: 'chip' }, …)` a `TS2353` at the call site. Probed at `f5bab84`
  before the layer was written, with the ordinary attribute still compiling beside it. Every remaining
  site has to move in the same commit, because a legacy channel for the unconverted pages is the
  convention this layer exists to replace.

  **The number is what keeps it from becoming an oversight, and it descends.** Distinct class names
  still written by hand outside `components.ts` and `style.ts`: **80 across 11 modules before ADR-0183,
  70 after**, over 163 sites and then 148. `contract-page.ts` holds 31 of the 70 and `chrome.ts` 18, so
  the two units that would move it most are the contract page's redesign and the masthead's.

  **The published limit is that the compiler would not close it alone.** Probed at `f5bab84` under both
  candidate shapes, a page building a `Record<string, string>` and passing it compiles either way — the
  index signature satisfies the specific keys. So the direct spelling dies at the compiler and the
  indirect one dies at `a-component-is-painted-by-its-own-rules-and-by-nothing-else`, and the pair is
  total where neither half is. An entry naming only the type would be describing half a mechanism.

  **Where this looked**: `Attributes` in `packages/site/document.ts`, which is
  `Readonly<Record<string, string>>` and takes any key; `drawn` in `packages/site/components.ts`, which
  is the only thing that puts a component's class on an element and writes it last so a caller's cannot
  win; and the guards of `packages/site/components.test.ts`, none of which reads a page module's
  source for what it writes.

  **The two units this entry named as what would move it most have both happened, and it moved.**
  Measured at `ccc9fca` by the same rule — every `class: '…'` literal in a `packages/site` module
  other than `components.ts`, `style.ts` and the test files, counted as distinct names: **52 names
  over 63 call sites in 4 modules**, against 70 over 148 in 11. `contract-page.ts` holds 20 of the 52
  where it held 31 of the 70, `front-page.ts` 17, `chrome.ts` 15 where it held 18, and `quantity.ts`
  1. ADR-0193.

  The population is every `class:` a page module writes. Priced as its own unit — **63** mechanical
  edits moving no behaviour — and not taken, because landing it beside a page's reconstruction would
  make every change in the diff unrecoverable. ADR-0183.

- **That a field the digest freezes is one something reads.** Measured at `df5b367` by walking
  `contractSnapshot`'s own output with `pathsIn` and classing each path by `FIELD_MAP`: **58 paths
  are inside the digest, and 17 of them are read by nothing** — 16 `documentary`, plus
  `benchmarks.profiles[].name`, whose stratum says a guard refuses one direction and not the other.
  Every one is frozen for the life of the major the day its contract is published.

  **The population is derivable and that is the whole reason this is an entry of its own rather than
  a clause of the one about a contract's prose.** That entry names five kinds of sentence — a
  `rationale`, a group note, a `reason`, a `purpose`, a comment in the seven files — and a named list
  shrinks in silence. This one is *the paths of the frozen half that `FIELD_MAP` gives no reader*,
  which is a set anybody can recompute and which grows the day a field is added to the digest unread.
  The two overlap and neither contains the other: `rationale` and `properties.universal[].reason` are
  `structural`, so they are that entry's and not this one's.

  **Ten of the seventeen are named by no entry of this list**, and one of them is the sharpest:
  `benchmarks.profiles[].description` is the exact twin of the `name` beside it that ADR-0171 measured,
  argued and wrote `PROFILE_SEPARATION_RULE` for, and it has never been mentioned anywhere. The others
  are `identity.summary`, `identity.description`, `benchmarks.vocabulary[].meaning`, `caseTables[].name`,
  `caseTables[].groups[].title`, `environments[]`, `surface.couplingRule`, `surface.exports[].role`
  and `ownDeclarations[].name`.

  **One of the ten has now been asked to do something, and it cannot — which is the first consequence
  anybody has attached to this entry.** `environments[]` was put forward as the thing that would
  refuse ADR-0216's candidate: a Temporal contract declaring three runtimes of which two are false,
  for life. Measured at `a0bbf86`, it refuses nothing, and the reason is worse than the objection.
  `contract-record.ts:475` is `readonly string[]` with **no union and no vocabulary type**; nothing
  reads it — nought occurrences in `packages/validation/`, in `packages/site/` and in
  `packages/cli/`; **all seven contracts declare the same three**, so the field is a constant; and no
  comment anywhere in the tree says what it means, ADR-0006 being the only place — *a vocabulary of
  JavaScript runtimes*, *the runtimes the contract is written for*. **A constant cannot be
  contradicted**, and a version is not in the vocabulary, so nothing a Temporal contract could write
  there would be false. The type admits `'node>=26'` and ADR-0006 refuses it and nothing executes
  either. So the cost is not a falsehood but a silence: an auditor fetching an eighth snapshot would
  receive the same three runtimes as the first seven, with nothing in the structured half saying it
  needs a runtime the others do not. **A fourteenth refusal ground was proposed on that and is
  refused** — the requirement is declarable as prose in `identity.inputDomain`, where every other
  statement of what a contract refuses already lives, and a ground biting on
  undeclarable-by-mechanism would refuse all seven published contracts. ADR-0220.

  **The live instance was created by the unit that opened this entry, which is what makes it worth
  reading twice.** `string/slugify@1` publishes `ownDeclarations[].verification` of `one-directional`
  for `outputAlphabet`, on the strength of GS-11 surviving. ADR-0175 wrote the guard that reads the
  missing direction, so the stratum now understates what verifies the field — and `ownDeclarations` is
  inside `contractSnapshot`, so it says `one-directional` for the life of the major. Measured: `npm run
  freeze` is green across that unit, which is the freeze keeping its promise rather than failing.
  `correctionsToFrozenProse` does not reach it either, resolving its `about` against case identifiers.

  **Where this looked**: `FIELD_MAP` and its strata in `packages/registry/field-map.ts`;
  `CONTRACT_STANDING_FIELDS` in `packages/registry/snapshot.ts`, which is the list of fields the
  registry may change its mind about and which answers for roots and never for a leaf; and
  `packages/registry/against-the-catalogue.test.ts`, whose guards over the catalogue's prose are about
  presence and about stamps.

  **What would close the class is nothing**, and that is not a defect: permanent rule 5 makes a
  contract public in full, prose has to live somewhere, and a sentence explaining a correct answer is
  green everywhere. **What is reachable and is not taken here** is smaller and real — the intersection
  above, declared and compared, so that a field entering the digest with no reader is an event instead
  of a silence. It costs one guard and one declaration, it would be born green on today's seventeen,
  and the event it would catch is the eighth contract's schema gaining a field nobody classed. Priced
  and not taken. ADR-0175.

- **That the date a refusal carries is the date the refusal was taken.** `refuseContract` records
  `decidedOn`, `/refusals` serves it, and it is fed by `THE_PUBLICATION_INSTANT` — so
  `array/group-by@1` is published as decided against on **2026-08-17**, which is the day the
  *catalogue* was published and not a day anybody established for that decision. The contract was
  refused before publication, so the true date is earlier and this repository has never written it
  down.

  **It is the entry ADR-0177 did not close, and the reason is that it is a different field.** That
  unit repaired `publishedAt` by reading it off the commit a binding names; a refusal mints no
  binding, names no commit and can be rebuilt at nothing, so there is no coordinate to read a date
  off and the same mechanism does not reach it. Repairing it inside a unit about `publishedAt` would
  have been two decisions in one commit, which is the move this list exists to refuse.

  **Where this looked**: `refuseContract` in `snapshot.ts`, whose `RefusedContract` carries
  `decidedOn` and nothing else about when; the three call sites in `local-read-api.ts` and the two
  stand-ins, all three of which hand it the same constant; and `THE_PUBLICATION_INSTANT` in
  `publication.ts`, which now has this one use and says so.

  **The population is every refusal the catalogue publishes, which is one**, and it grows with each
  contract turned down. What would close it is a decision about what a refusal's date *is* — the
  commit that recorded the lifecycle is one candidate and is not obviously right, because a refusal
  is argued in a record before it is written into a source. Priced as its own unit and not taken.
  ADR-0177.

- **That the ecosystem a search looked at is the ecosystem the rule decides over.** ADR-0191 settles
  that a demand signal may decide what is *measured* and never what is refused, and the argument for
  permitting the first half is that a selection error self-corrects — the candidate is measured, rule 7
  decides, a false alarm costs a probe. **That clause has a premise, and one standing bound breaks
  it**: below the bound the candidate is never measured at all, so the error is as final and as silent
  as a refusal error while wearing the shape of no decision.

  **It is not hypothetical and it is declared rather than discovered.** ADR-0163 states, at its line
  447, that *what was left out is the ecosystem below about 20 M weekly downloads, which is where a
  function with a real disagreement and no audience would sit*, and calls it a deliberate narrowing.
  Two searches have now run under it. **The failure has no event**: a candidate nobody looked at files
  no dossier, reddens nothing, and appears in no table of refusals — so a later search reads twenty-
  seven refusals and cannot tell which questions were never asked. **The eighth search confirmed that
  half rather than removing it**: it could name what its own window excluded and could name nothing
  about what the two before it had.

  **The sweep that classed every install figure in both records found it before it was classed**, as
  the one figure clause in either record attached to no refusal. That is the reading that separates it
  from the entry it survives: the demand dependence was never in a refusal, it was in the bound.

  **Where this looked**: the candidates refused briefly in ADR-0163 and in ADR-0158, every one of
  which names a candidate somebody proposed rather than one a sweep returned; `theCatalogue` in
  `packages/registry/the-catalogue.ts`, which knows what was published and nothing about what was
  considered; and ADR-0191's own calibration, which is over the addresses this catalogue has ruled
  on and therefore inherits the narrowing whole — a signal shown to fail above the bound is not shown
  to fail below it.

  **The population was every candidate the two searches did not reach**, and nothing here bounded it,
  because the set of functions somebody might want is not enumerable from this repository. What would
  close it is not a guard: it is a search conducted below the bound, whose result is publishable
  whether or not it finds anything — ADR-0163 having established that a negative is a result. The
  paragraph below is what that search returned, and what it left.

  **That search has been conducted and the entry narrows rather than closing.** ADR-0192 committed its
  window, its enumeration and its acceptance rule *before its first probe*, on ADR-0176's discipline,
  so that finding nothing could not be answered by widening anything — and the record's own two-commit
  history is what says so rather than a sentence claiming it. **Its axis is not a lower floor**: a
  threshold recreates this entry at a new number, so the axis is the language's own surface, which is
  finite and needs none. Swept at `998b6f7` on Node v24.15.0: 135 globals partitioned totally into 84
  excluded and 51 in scope, **443 operations, 443 assigned a ground**, the reading stopping on 40 and
  **no eighth contract surviving**. The strongest candidate was `Number.prototype.toFixed`, refused
  because `toFixed` and `number/round@1` differ on 10 of 27 cases and `Number(v.toFixed(p))` differs
  from `round(v, p)` **on the same 10** — so the whole disagreement is a frozen contract's subject.

  **What the search buys this entry is a measurement of what the bound was costing.** The window was
  calibrated on the known answer, which neither previous search did: five of the six published
  contracts have their incumbent operation in this population and four are yielded by reading it,
  where ADR-0163's demand axis reaches three. **Neither axis reaches this catalogue alone and the two
  together reach all six.** So the bound was not trimming a margin — it was excluding half the
  published catalogue, and the half it excluded is the half the language-surface axis was built for.

  **What stays open is the band named in advance rather than discovered at the end**: a candidate that
  is neither a language trap nor above ADR-0163's bound. Nothing reaches one, because enumerating the
  ecosystem needs a floor and a floor is what this entry is about — so the population is no longer
  *every candidate the two searches did not reach* but that band alone, and **nothing here bounds it
  either**, a figure for its size being an estimate wearing a count's clothes. ADR-0163, ADR-0191,
  ADR-0192.

  **A fourth search was conducted on the exclusion nobody had named, and what it returned is a
  candidate whose unit is unsettled rather than a negative.** It read as a negative for one commit;
  the ground that made it one was refuted by measurement the same day, which is why the two halves of
  this paragraph are dated differently and why the sentence a reader believes is this one. It is not
  aimed at the band above, and which exclusion it repairs is the whole of why it is a separate
  paragraph: ADR-0192's axis was the language's own surface and its population was **one
  runtime at one version**, so what it missed is not a candidate below a demand floor but a surface
  that **did not exist when the sweep ran**. That record refuses `Date.parse` on **R1** *because*
  Temporal is the language's answer, and **a surface that decides a row and is never itself read is a
  motive doing a subject's work**. Its method was committed at `1786e99` before a probe ran — verified
  rather than claimed, the section being **12 618 bytes identical** across the two commits. **142
  operations, every one given a verdict**: R1 65, R13 32, R2 15, R6 6, and **24 retained** once
  ADR-0216 withdrew the ground the sweep had refused them on. ADR-0215, ADR-0216.

  **The general argument this search existed to test is refuted by measurement rather than upheld.**
  The fear was that R2 closes `date` because the language delivered the API, and that the same
  sentence then closes every family whose API the language delivers — every stage-4 proposal still to
  come. **R2 is 15 of 142.** `Temporal.Instant.prototype.add` **refuses every date unit** — days,
  weeks, months and years all throw — so adding a month to an absolute instant requires choosing a
  zone, and inside a zone a day is a civil day: `add({days: 1})` across the 2026 US transition answers
  `16:00:00Z` where `add({hours: 24})` answers `17:00:00Z`. **The language shipped an API for date
  arithmetic and did not ship `date/add@1`'s function**, whose declared domain excludes exactly that
  and gives R13's reasoning as its reason a year before R13 was named. So what is closed is **this
  surface and not the family**, and a `date` candidate Temporal has no operation for — business days,
  a date a human wrote — is invisible to this axis by construction.

  **R13 gained its first sole instances, thirty-two of them, and the witness is measured.** ADR-0207
  published it as a ground refusing nothing and named its first instance as a reopening trigger. The
  obvious probe returned nothing — Chrome 152 against node v24.15.0, **3 762 comparisons, 0
  disagreements** — because two engines shipping one table say nothing about whether the answer moves
  when the table moves. Four tzdata versions on this machine do: against **2026a**, **2024a disagrees
  on 12 offsets and 2025a on one**, the sharpest being **`America/Tijuana` at `1970-06-15T12:00:00Z`,
  `GMT−07:00` against `GMT−08:00`**. **A first reading reported 221 and was wrong** — 209 were `GMT`
  against `GMT+00:00`, CLDR rendering drift, and publishing them as tzdata would have named a cause no
  measurement establishes.

  **The near miss was published as the row to dispute first, it was disputed, and the ground fell.**
  Temporal silently ignores an unknown field in a bag whenever one field it knows is present:
  `PlainDate.prototype.add({days: 1, dayz: 9})` answers `2026-01-16`, and so do **24 of 24 probed**,
  across seven zone-free types — permanent rule 7's trap clause met positively, and `date/add@1`'s own
  frozen rationale names the shape: *a plausible value that silently drops what the caller asked for*.
  ADR-0215 refused them on **R10**, the residue being one decision. **The owner refuted that with a
  measurement and it reproduces**: a *known* unit a carrier cannot apply is a second decision, and the
  language answers it two ways. `PlainTime` ignores **all four** date units silently, while
  `PlainYearMonth` refuses **eight**, `Instant` **four** and `Duration` **three** —
  `PlainDate.add({hours: 5})` answers the input unchanged where `PlainYearMonth.add({hours: 5})`
  throws. **One API, one question, opposite answers.** **This line read *`PlainDate` ignores all six
  time units* until ADR-0225 measured the same units at other magnitudes**: `add({hours: 24})` answers
  `2026-01-16`, so that carrier truncates into whole days rather than swallowing, and it is out of the
  arity — the observation at `{hours: 5}` is exact and the classification built on it was not. A third
  decision sits beside them: the bag is read through the prototype chain and through getters, and
  `{DAYS: 1}` throws alone and is dropped beside a valid field.

  **So R10 is withdrawn and the twenty-four are retained** — R1 65, R13 32, R2 15, R6 6, **24
  retained**, over the same population and window. **Read one at a time, no ground of R1 to R13 fires
  cleanly**: R4 is the strongest near miss and dies because `number/parse@1` publishes this
  catalogue's position that silently dropping what the caller asked for is wrong rather than
  different, with `PlainYearMonth` and `Instant` on that side; **R8 is refused rather than leaned on**,
  its precedent being several output renderings of one input type where this is one rule over several
  carrier types; and **R5 is the one ground that cannot be ruled out**, because whether any package
  wraps Temporal and disagrees was not measured. **What is unsettled is the unit and not a ground** —
  ADR-0207's **P3** — and the three shapes each carry a real problem: one thin contract per carrier,
  one polymorphic `add` whose case table crosses carrier types, or a validator that dies on ADR-0158's
  criterion because nobody types *validate a duration bag*. **A type-level repair is measured
  unavailable**: `Temporal.DurationLike` declares every unit optional by design. **No contract is
  written**, and choosing between the three is the owner's. ADR-0216.

  **R5 is being paid before any shape is chosen, and its method was committed before the first
  package was installed.** ADR-0216 named it as the one ground it could not rule out, and it is
  binary: choosing between three shapes before knowing whether the candidate survives would settle the
  form of something that may not exist. **ADR-0191 decides how it may be paid** — a demand signal
  decides what is measured and never what is refused, so an install count may *find* a package and may
  not enter the verdict, and what is read is what each package **does** when executed rather than what
  its README claims. The population is declared against its own bias: *packages that wrap Temporal*
  would be near-empty because the proposal is months old, so R5 would fire on Temporal's age rather
  than on the question's contestedness — the reading that decides is every library that takes an
  object-shaped duration and applies it to a date-like value, which is a job older than Temporal. **A
  polyfill is excluded by construction**, implementing the specification being agreement with it by
  definition. **R5 fires only if every such package answers as Temporal does**, which is a deliberately
  low bar because `string/strip-ansi`'s was.

  **It was paid and it does not fire: the candidate is alive.** Ten packages installed and executed,
  no figure entering the verdict. **`luxon@3.7.2` answers `InvalidUnitError: Invalid unit dayz`** where
  `date-fns@4.4.0`, `moment@2.30.1` and `@internationalized/date@3.12.4` drop it in silence as Temporal
  does. **Four packages do the job and one of the four disagrees**, so the question is contested.
  `dayjs` and `date-arithmetic` are excluded by a control rather than by reading — they throw on a
  **well-formed** bag too, their API being `add(n, unit)` — which is the method's own outcome 3
  arriving as predicted. **The narrow reading is empty for a reason the bias was not declared against**:
  `temporal-zod` validates durations as **ISO 8601 strings** and refuses an object bag outright,
  `temporal-fun` exports no addition and `temporal-utils` only differences, boundaries and rounding —
  **the packages built on Temporal so far take durations as text**.

  **And the two decisions separate, which no earlier reading could see.** The disagreement is about the
  **unknown key** alone: on the **inapplicable unit**, `@internationalized/date` — the only library
  read that carries partial types as Temporal does — answers exactly as Temporal answers, `Time.add({days:
  1})` and `CalendarDate.add({hours: 5})` both returning the input unchanged, while `@js-joda/core`
  makes the question unrepresentable, `LocalTime.prototype.plusDays` being `undefined`. The language
  still contests that second decision with itself; the ecosystem does not contest it.

  **P4 was re-taken against the precedent and ADR-0216's objection to the polymorphic form is
  withdrawn.** That objection was that its case table crosses carrier types — and
  `object/deep-equal@1` publishes **58 cases in 10 groups** crossing the whole language, frozen. The
  polymorphic `add` over the zone-free carriers holds ¬R6, ¬R7, ¬R9, ¬R12 and ¬R13; the one difference
  from the precedent is named rather than smoothed, `deepEqual` being `(a: unknown, b: unknown)` where
  this needs a generic, which touches neither clause. **So one of the three shapes survives** — the
  per-carrier form is what would make R8 true, and the validator dies on ADR-0158's criterion, which
  the narrow reading sharpens since a bag validator has no ecosystem either. **That is a narrowing and
  not a choice: no contract is written**, and whether this catalogue publishes one is the owner's.
  ADR-0217.

  **Three debts leave the unit for other records.** ADR-0192's `Date.parse` refusal rests on a claim
  the stage-4 engine refutes — Temporal parses **only** ISO 8601, throwing on `01/15/2026`, on
  `15 January 2026` and on RFC 2822 — which is that record's *a refusal ground being wrong* arriving on
  a refusal. Its first reopening trigger has **fired five times and four are unread**: the engine diff
  names twelve operations of four other proposals, derived rather than listed. And **ADR-0150's
  suspicion is resolved in the direction it predicted**: replayed over all 43 cases on the engine it
  could not get, the `NaN` cause **agrees** and its five typed partings become four, exactly as it said
  they could only do. **A defect in this unit's own probe nearly published the opposite** — JSON has no
  spelling for `NaN`, so the first replay handed Temporal `{days: null}`, which it read as an absent
  field and answered, reporting eight partings of which two were the probe's. ADR-0150, ADR-0192,
  ADR-0207, ADR-0215.

- **That the criterion deciding what enters this catalogue is one anything applies.** ADR-0207 writes
  it — four clauses, each the complement of a group of the twelve refusal grounds — and **no mechanism
  can hold it, which is a stronger statement than that none does.**

  **The reason is the shape of the population and not a price.** A guard needs something to range over,
  and the population here is *candidates somebody considered*. A candidate nobody writes leaves no
  artefact: no folder, no digest, no row, no red. It is ADR-0191's *the failure has no event* arriving
  one floor up — that record says a candidate below the bound is never measured and so its exclusion is
  as final and as silent as a refusal, and this entry says the same of a candidate the criterion would
  have admitted. **The catalogue records what was published and what was refused, and both are things
  somebody wrote down.**

  **It has already failed once, silently, and that is what opened it.** ADR-0192's line 130 is the only
  positive sentence this repository has ever carried, it requires the language's own answer to be wrong,
  and two of the six installable contracts have no language answer at all — measured off that record's
  own calibration table, where `string/levenshtein@1`'s incumbent is `none` and `string/slugify@1`'s
  yields nothing. Nothing was red for the whole of its life, because nothing reads it.

  **Where this looked**: the fault functions of `mutation/decisions.ts`, which resolve what a record
  *names* — a path, a guard, a record, a link — and not one of which reads what a record *says*;
  `theCatalogue` in `packages/registry/the-catalogue.ts`, which holds what was published and nothing
  about what was considered; and `packages/registry/field-map.ts`, whose strata class the fields of
  a contract that exists.

  **The population is every candidate anybody weighs against this catalogue**, and it is unbounded and
  unobservable in the same breath. What stands in place of a mechanism is the known-answer test: the
  criterion is checked against the thirty-six addresses this catalogue has ruled on, that reading is
  rebuildable, and it moves the day a contract is published or refused. That is a reading somebody takes
  and never a red, which is the entry. ADR-0191, ADR-0192, ADR-0207.

- **That an address a frozen file cites is one that resolves where the file is frozen.** A citation
  whose target is frozen beside it can never rot: the two move together or not at all. A citation
  whose target is an ordinary source of this repository rots the day that source is renamed, and
  permanent rule 6 forbids repairing the citation.

  **Measured at `df5b367` over the 52 files of `contracts/`**: 31 backticked kebab-case addresses of
  four words or more, **27 declared inside the frozen perimeter** — the contract's own folder, or one
  of the two shared files every harness declares — and four not. Two of the four are deliberate
  negatives, `number/round@1` saying in as many words that *there is no `places-out-of-range`*; one is
  `found-in-the-wild`, a member of a union the compiler protects in its data position. **The fourth is
  live**: `contracts/typescript/object/deep-equal/reference.ts:9` cites `states-its-own-signature`,
  whose only declaration is `packages/validation/states-its-own-signature.ts` — a file this repository
  may rename tomorrow, in a comment frozen for the life of that major.

  **It is not the entry about a comment naming a guard.** That one's population is comments naming
  *guards*, and this is a stage-1 rule identifier; more to the point, that entry is about a citation
  nothing resolves, where this one is about a citation nothing may repair. Its fifty instances are in
  files somebody can still edit.

  **Where this looked**: `citationFaults` and `confirmationFaults` in `mutation/decisions.ts`, which
  resolve what a *record* names in both directions and read nothing in `contracts/`; `theEditableSources`
  in `mutation/history.ts`, which is the honest half already saying the citation sweep covers only what
  this repository may still edit; and `THE_SHARED_FILES`, which is the perimeter's other half.

  **The population is every backticked address in a file a published contract freezes**, and it grows
  by seven files with each contract published. Nothing closes the existing instance — the file is
  frozen. What stops the next is a sweep of three lines, and it is in the eighth contract's list rather
  than here, because a guard over `contracts/` would be red on the instance it cannot repair.
  ADR-0175.

- **That an `extends` a configuration declares is one that resolves.**
  `packages/validation/fixtures/tsconfig.json` declared `"extends": "../../tsconfig.json"`, which from
  that folder is `packages/tsconfig.json` and does not exist. `tsc` answered TS5083 and fell back to
  its own defaults, so the analyser read those submissions under options nobody chose - **for the whole
  life of the file, with nothing red anywhere.** No npm script typechecks that project; the file exists,
  so `readSources` gets a program; stage 1's rules are syntactic, so a wrong `target` and a missing
  `strict` cost no finding.

  **Where this looked**: `mutation/workflows.test.ts`, which is the one suite that reads a repository
  configuration file and reads `suites.yml`; the fault functions of `mutation/decisions.ts`, which
  resolve what a *record* names; and `packaging/`, whose readers are the manifest and the archive and
  never a compiler configuration.

  **The population is the eight tracked `tsconfig` files**, and it grows with each project. The instance
  is repaired. **What would close the class is one of the cheapest guards this repository could hold** -
  resolve each `extends` and refuse one that names no file - and the price is where it would live: the
  subject is every configuration and so is nobody's folder, and the natural home is the meta suite,
  which **no battery injects into**, so the guard would be born unwitnessed. That is the trade this
  repository refuses without an argument, and taking it inside a unit about dead code would be deciding
  what the meta suite is worth as a side effect. Priced and not taken. ADR-0174.

- **That an exported name is one something outside its file could want.** Measured at `b1fcff6` over
  the 1 065 names this repository exports: **135 are mentioned by no other tracked file**, of which 14
  are frozen and 13 occur once in their own file - the declaration and nothing else. The remaining
  **109 are used at home and exported for nobody**, and the `export` keyword on each is a declaration
  with nothing behind it.

  **The rule that looked like the closure is refused, and the refusal is the entry's most useful half.**
  *A name mentioned by the signature of an exported declaration stays exported* is derivable, so a guard
  could hold it - and measured, it spares **86 of the 109 and reaches 23**, where the 86 are every type
  but one and the 23 are twenty-two values and one type. It separates nothing that *is this a type?*
  does not already separate. A rule that exempts four fifths of its population on a distinction it did
  not invent is a justification, and adopting it would buy a guard that cannot redden.

  **Where this looked**: `packaging/reachable.ts`, which walks files and has no opinion about a name;
  `packages/validation/typescript-api.ts`, which is the one door onto a parser and is what any such
  guard would be built on; and `tsconfig.json`, whose `noUnusedLocals` reaches a local and never an
  export.

  **What is available and not taken is the other issue**: removing all 109 `export` keywords, which
  makes the claim total and guardable - *no exported name is unused outside its file*. Nothing outside
  can import them anyway, the manifest declaring a `bin` and no `exports`, so the affordance being
  given up is a name a reader of *this* repository might want to write. It is 109 edits across six
  packages moving no behaviour, and landing it beside eighteen deletions would make every change in the
  diff unrecoverable. Priced as its own unit. ADR-0174.

- **That a guard declared applicable has been seen red on its own failure condition, alone.** The
  verification discipline above asks for *at least one plausible mutant*, and `mutation/attribution.ts`
  records what that leaves open: **`determinism` and `no-ambient-input-from-history` on
  `number/round@1` are red only on mutants that also redden everything else**, so neither has ever
  carried a defect by itself. A guard that never reddens alone is not decorative - it would catch its
  defect if its neighbour went away - and nothing here shows that it would.

  **It was found by looking for dead code, which is the only reason it is written down.** Five
  constants of three batteries held four such guard addresses and one mutant find text and were used
  by nothing. The reading that settled them cost no replay - git says each occurs once at the commit
  that introduced it and once today, where used siblings occur 2, 3 and 6 - and it said they were
  never used, from which *unwatched* was the wrong verdict to draw. **What corrects it is an argument
  from the gate.** Every battery ran green before `toopo@1.1.0` reached npm; an undeclared never-red
  guard fails a run as *unaccounted for*; and neither guard is declared under `unreachableGuards` or
  `unprobedRegions`, `number-round`'s being empty. So they are red and merely unpinned, the constants
  were names prepared for pins the five-or-fewer convention made unnecessary, and they are gone.
  **What the constants never recorded is the gap itself**, which is this entry.

  **Where this looked**: `mutation/attribution.ts`, whose three buckets are *load-bearing*, *never
  alone* and *never red*, and whose header names these two guards; `mutation/number-round.battery.ts`,
  whose `unprobedRegions` is empty and whose `unreachableGuards` name neither; and `mutation/run.ts`,
  where a pin declares what a cell must produce and never what a guard has been alone on.

  **The population is every guard the batteries leave in the *never alone* bucket**, and it has been
  read over ten folders rather than over one. The first figure it carried was `site`'s alone, measured
  at `9e41d44`: **191 guards carry an attribution, 88 have been seen red alone, and 103 have not.**

  **Measured at `05a193c` off a full replay** - `pnpm run mutation`, 23 batteries, 60 min 14 s - **over
  the ten folders read whole: 1 379 guards collected, 1 060 carrying an attribution, 259 seen red
  alone, 801 never alone, 319 never red, and nought unaccounted for.** So **801 of the 1 060 guards
  that redden at all have never carried a defect by themselves.**

  **The perimeter is declared rather than sampled.** 20 of the 23 artefacts describe that commit and
  **699 of the 873 cells** were measured, because `array-group-by`, `string-levenshtein` and
  `string-slugify` threw during calibration - three controls red since `9158603`, which is the other
  half of ADR-0199 and the reason this reading was available at all. Those three folders keep only
  their `-spec` battery, so they publish `alone` as a **floor** - ≥ 8 on `array/group-by`, ≥ 8 on
  `string/slugify`, ≥ 9 on `string/levenshtein` - and `never red` as a **ceiling** - ≤ 84, ≤ 64 and
  ≤ 41. Across all thirteen folders, perimeter mixed: 1 608, 284, 816 and 508.

  **Re-measured at `257425c` off a full replay** - `pnpm run mutation`, 23 batteries, 63 min 4 s,
  exit 0, nothing disagreeing - **over thirteen folders read whole: 1 608 guards collected, 1 247
  carrying an attribution, 293 seen red alone, 954 never alone, 361 never red, and nought unaccounted
  for.** So **954 of the 1 247 guards that redden at all have never carried a defect by themselves**,
  and the perimeter is 23 of 23 artefacts and **873 of 873 cells** where it was 20 and 699. Against
  the mixed thirteen above, the collected population does not move at all - whether a battery runs
  does not change how many guards it collects - while `alone` goes **+9**, `never alone` **+138** and
  `never red` **−147**, which is exactly the three ceilings falling: `array/group-by` 84 → 36,
  `string/slugify` 64 → 4, `string/levenshtein` 41 → 2. Every floor held, 11 and 11 and 12 against
  ≥ 8, ≥ 8 and ≥ 9. **The ten folders read whole in both come back identical row for row**, which is
  what says a reader written from scratch at another commit reproduces the earlier reading rather
  than agreeing with it - `number/parse` included, unmoved at 122/12/110/0 across `N-4`'s repair.
  ADR-0200.

  **A guard is addressed by the pair `(folder, identifier)`, and the size of the alternative is why
  that is worth a sentence**: 1 608 pairs against **1 539 bare identifiers**, so **69 collide across
  folders**. `determinism` exists on several contracts and is not one guard there, and a union over
  identifiers alone publishes a total wrong by that much with a method that looks clean.

  **What the total does not say, and what two measurements do.** Of the 801 never alone, **501 sit in
  an inseparable class** - 113 classes of guards reddening on exactly the same cells everywhere they
  are collected, so **no existing cell tells them apart**. That is where *alone is unreachable* lives
  and it names the pairs, and that every guard in a class is never alone is a tautology rather than a
  finding. The other **300** have a red pattern of their own, and **152 are one companion away** -
  there is a cell on which they redden beside exactly one other guard - 40 in `packages/cli`, 29 in
  `packages/site`, 22 in `packages/registry`. Those 152 are the cheapest of what is left to do, and
  neither a total nor a distance alone would have named them.

  **Re-measured at `257425c` over thirteen folders: 548 inseparable in 136 classes, 406 with a red
  pattern of their own, and 177 one companion away.** The whole of the growth is the three folders
  that had not run - 47 members in 23 classes. **One of ADR-0199's figures does not reproduce and is
  named rather than corrected**: its *152* comes out **150** under the rule its own sentence gives,
  swept over the same ten folders, while 501 in 113 classes, the 300, and the three per-folder counts
  it names all reproduce exactly. Those three match only when the rule is read over *every* never-alone
  guard; read over the 300 alone they are 28, 27 and 20. The two guards between 150 and 152 are not
  recoverable, the reader that produced the first figure no longer existing. ADR-0200.

  **The never-red half carries a proportion nobody had ever taken.** Of `packages/registry`'s 466
  guards, **262 are declared `unprobedClaims`** - *claims detection, so decorative until a mutant
  reaches it*. Every one of those declarations was written deliberately and none is silent; what had
  never been done is to read them together, and more than half of that suite is a region its battery
  does not probe. **The meta suite is outside all of it**: no battery injects into `mutation/`, so its
  **115 guards over 10 files** are out of this population by construction. ADR-0199.

  **And that half has now been priced, on the same folder the other half was.** ADR-0209 takes the 34
  guards of `round-trip.test.ts` - the wholly unprobed file carrying the most of them, by a rule fixed
  before one of them was read - and witnesses **32 with 26 cells over 33 candidate runs**. Per guard
  taken out of the bucket that is **1.03 runs against ADR-0204's 2.36**, and 1.9 times cheaper with the
  one seven-for-one family removed; per cell written it is **1.27 against 1.27 and 1.21**, so a first
  witness is not a cheaper search and is a cheaper landing. **Seventeen of the twenty-six redden alone
  with nothing asking them to.** Measured at `6888853`, this folder's row goes 58/135/273 corrected to
  **75/152/239**, and its `unprobedClaims` **262 to 228**. What is published is the count and not the
  fraction: **145 of the 262 are parameterised over a contract in 21 families and 117 stand alone, so
  the whole bucket is at most 138 aiming decisions** - where the 94 % witnessed here was measured on a
  file 32 of whose 34 guards are rows of an `it.each`, and the slice rule selects for that. **One guard
  left the bucket with nothing aimed at it**, the instrument's criterion for leaving being reddening
  rather than aiming, which is the distinction that whole reading depends on. ADR-0209.

  **And the second slice priced the same thing under the opposite rule, which is what says the first
  price was not a property of a table.** ADR-0210 takes the 20 unprobed-claims guards that are not
  parameterised over a contract and sit in a wholly unprobed file — 12 of `endpoints.test.ts`, 5 of
  `visibility.test.ts`, 3 of `attestation.test.ts` — by a rule committed before one of them was read,
  with its bias declared *downwards* and three outcomes named in advance. **Nineteen are witnessed by
  nineteen cells over 23 candidate runs**, 1.21 runs per cell and 1.21 per guard, and **eleven redden
  alone**. So the two readings are 94 % and 95 % and they **meet rather than bracket**: what is
  publishable over the two together is **51 of 54**, a count over the union and never a mean, holding
  for a guard in a wholly unprobed file *whether or not it is a row of a family*. **The 174 in probed
  files are what neither slice can reach**, that exclusion being the clause both rules held. **One guard
  resists** — `the-strata-are-populated`, whose claim is about a set that
  `the-fields-that-defer-their-stratum` pins member by member, so the only single edit reaching it is
  described more plainly by its neighbour. Measured at `709798c` off a replay of 163 cells in 28 min
  46 s, exit 0, nothing disagreeing: this folder's row goes 75/152/239 to **86/168/212**, and its
  `unprobedClaims` **228 to 201**. ADR-0210.

  **And the third slice took the clause the other two held, which is the population rather than a
  sample of it.** ADR-0211 takes the **70** standalone unprobed-claims guards in files some cell
  already reddens — 100 % of what the standalone population still holds, ADR-0210 having emptied the
  wholly unprobed half — and witnesses **60 with 52 cells over 67 candidate runs**. **86 % against
  94 % and 95 %**, and the gap is larger than one guard of either side where ADR-0210's one point was
  not, so **the two readings separate and the 94 % is a corner**. Per cell the price is **1.29**, which
  refutes this unit's own prediction of 1.21 and makes the fifth reading of a figure that has been
  1.27, 1.21, 1.27, 1.21 and 1.29 — a first witness is still not a cheaper search. **The mechanism
  proposed for the fall was refuted by the slice's own internal reading**, flat against how probed a
  file is, and what replaces it is compositional: three new resistance mechanisms, of which the
  sharpest is **a guard whose subject is outside the battery's injection surface**, three instances,
  every one declared under `unprobedClaims` where the honest bucket is `unreachableGuards`. **Twelve
  declarations went stale on three cells and a reading caught them before a replay was paid for**,
  eleven being one contract's row of a family that stops serialising and one being a guard this unit
  had recorded as resisting — ADR-0209's *the criterion for leaving is reddening and not aiming*,
  arriving on a second bucket. Measured at `14bd274` off a replay of 215 cells in 38 min 50 s, 210
  killed, five survivors, nothing disagreeing, nought unaccounted for, exit 0: this folder's row goes
  86/168/212 to **123/204/139**, and its `unprobedClaims` **201 to 129**. ADR-0211.

  **And the family half of that bucket is priced, which is the half ADR-0209 could only assume.**
  ADR-0212 takes every family `unprobedClaims` still holds — 19 of them, 120 rows, total over the
  population — and witnesses **93 rows with 14 cells across 16 families**, two cells serving two
  families apiece by falsifying two clauses of one defect. **Fourteen of nineteen collapse to one cell
  and five do not**, so ADR-0209's *at most 138* is corrected rather than kept: one cell per family
  understates by **2.16**. **Of the five that resist, three do so because no derivation of this folder
  lies between a contract's own declarations and the assertion** — a fact about how a guard is written,
  answerable by reading it rather than by spending a cell — and two carry rows their own contract
  leaves vacuous. **And a family witness can never be a sole one**, which is the finding a reader of
  this entry needs before choosing which of its two buckets to pay: `alone` does not move across that
  replay, **123 either side**, while `never alone` goes **204 to 297**, exactly the 93 rows witnessed.
  A cell reddening six or seven rows of one family leaves six or seven names in `failedGuards`, so not
  one of them can be the only red on any mutant — **the two debts trade one for one**, and pricing the
  rest at family scale buys first witnesses by spending sole ones. `unprobedClaims` goes **129 to 36**.
  **And ADR-0212's own Consequences reads *it separated fourteen from three*** where the question it
  names — whether a shared derivation lies between the rows and the sentence — separates **sixteen from
  three**, the two vacuous families having one. That record is stamped, so this is the note.
  ADR-0212.

  **One instance is now named with the reason it is not closeable, which the entry had never had
  either.** `every-component-class-the-browser-writes-is-one-this-registry-paints` compares a
  literal in `start.ts` with a member of the component union, and **both of its inputs have rendering
  consequences**: W-153 renames the literal and reddens eight guards, seven of which query `.copy` and
  find nothing, while renaming the union member does not compile. So *alone* is not reachable for it by
  any plausible mutant - which is a different state from *nobody has written the cell*, and the two look
  identical in the bucket. ADR-0183. **It is one of the 501 measured above**, which is what the
  shadowing reading buys: the state it names is no longer read one guard at a time.

  What would close it is a cell per guard, aimed at that guard's own failure condition and at nothing
  else, which is what `attribution.ts` asks for in as many words: *reading it produces mutants instead
  of deletions*. **The replay half of the price has been paid and the population is 954**; what remains
  is a cell apiece, and the 177 one companion away are where it is cheapest. ADR-0174, ADR-0199,
  ADR-0200.

  **A slice of the 177 is paid, and what it priced is not the half anybody would have guessed.**
  `packages/site`'s eight **reciprocal pairs** - sixteen guards whose only two-guard companion is each
  other, so nothing existing separates them in either direction - taken whole by a rule written down
  before their difficulty was read. **Eleven are isolated, W-168 to W-178, one cell apiece and each
  audited red *alone* off `failedGuards` rather than off its own pin**; one is isolable and dear; four
  have no plausible mutant. Re-read at `9929f0d`, `packages/site` from this unit's replay and the other
  twelve folders carried from ADR-0200's at `257425c` - a mixed perimeter, named as one: **alone 293 →
  304, never alone 954 → 943, inseparable 548 → 546 in 135 classes, and the 177 → 166**, with the
  site's own row 84/99/4 → 95/88/4. The collected total does not move, because **a cell is not a
  guard**. **One class of two dissolved and it is named**: the two cache guards reddened on exactly the
  same cells, so they sat in the inseparable bucket *and* one companion away from each other - the two
  are not exclusive - and W-168 and W-169 separate them in both directions.

  **The two things that resisted are mechanisms rather than accidents, and both are recognisable before
  a candidate is spent.** A guard whose subject is a property of a population some *total* guard already
  sweeps - `every-address-the-tree-writes-carries-a-cache-policy-this-repository-chose` is total over
  `paths()`, so any defect moving an address reddens it too, which is what shadows three of the four.
  And a guard whose input population is a subset of a neighbour's *for a reason that is a different
  design decision* - the refusal guard's one distinctive input is a spelling its twin can never pass,
  because a refused way is shown the invocation instead. **The rule the three retried cells produced is
  in `mutation/mutants.ts`**: aim at a choice and never at a shared mechanism.

  **The machine half of the whole debt is priced and the judgement half is refused.** About **1 455 s**
  of searching, computed per folder from each configuration's own suite time rather than from the
  convenient member - ADR-0199's own lesson applied to this reading - plus a full replay of about **76
  minutes**, 63 to 88 under ADR-0200's floor. So **under two hours of machine time for all 177**, which
  says the debt is not expensive to *run*. No figure is published for authoring them: this folder is the
  second most probed of the thirteen, which biases its 11-of-16 down, and its guards are the most
  unit-like, which biases it up, and neither bias is measured. **What a slice in `packages/registry`
  would buy - 9.4 % already isolated against this folder's 45 % - is exactly that missing calibration.**
  ADR-0203.

  **The second slice is paid, in the folder that clause named, and the two rates agree.**
  `packages/registry`'s **twenty-two** one-companion-away guards taken whole - total over the
  population, so no selection and no easy half - **fourteen isolated, I-82 to I-90 and S-31 to S-35,
  one cell apiece and each audited red *alone* off `failedGuards`, 14 of 14**; eight resisted, and they
  are exactly the eight the census still reads as one companion away. **The finding is that the
  residue's difficulty does not track how probed the folder is**: 14 of 22 here against the site's 11
  of 16, on a folder probed at **0.22 cells per collected guard against 0.89** and **9.4 % already
  isolated against 45 %**. So the two biases named above are worth less than five points between the
  two folders, and **113 to 122 of the 177 are cells somebody can write** - two folders and never a
  sample. **What the table above under-costed is the refusals**: its 1.27 counts only runs that
  produced a cell, and 33 candidate runs over 22 guards is **1.5 per guard**, which takes its registry
  row 416 → 492 s and the total to about 1 719 s, still under two hours with the replay. **What stays
  refused is the authoring cost, for a new reason**: the biases are measured and small, and what is
  missing is that nothing in either record measures authoring at all - so a third slice would land
  inside 64 to 69 % and buy nothing.

  **The prediction was committed before the first cell and scored 15 of 22 on the outcomes**, and its
  sharpest claim was the wrong one: *none by the subset-population mechanism* is falsified by
  `the-revision-of-a-clean-tree-is-the-commit-git-names`, whose companion re-asserts its whole clause
  in the middle of its own case. **Three mechanisms carry all eight refusals** - a total guard, a
  subset population, and an exact expectation shadowing a property of the value it pins - and **a
  fourth came out of the search and is named as unpredicted**: two guards whose subject is one
  declaration are separable only by an arm one of them has outside it, which is why the negative corpus
  isolates and the sweep over every declared word beside it does not. All three are in
  `mutation/mutants.ts` where somebody writing the next cell arrives.

  **And one guard of this folder reddens under load, which costs the census rather than a run.**
  `the-served-bytes-are-the-committed-bytes` hashes seven contracts' files against their git blobs
  under vitest's default 5 000 ms and finishes in 1.66 s alone; it reddened on `I-38`, which edits
  `emit.ts` and has no causal path to it. **A pin is checked as a subset, so nothing reported it** -
  the cell read `killed`, agreed, and the battery exited 0. What it did was take
  `an-edge-is-followed-to-the-artefact-it-names` **out of the isolated bucket**, `I-38` being its only
  sole-red cell, and manufacture a reciprocal pair out of two guards with no relationship to each
  other. So a rebuild of this census on a loaded machine has more one-companion-away guards than one on
  an idle machine - 154 against 152, 317 alone against 318 - and no published figure says which kind of
  machine it was taken on. ADR-0204.

  **Both halves of that last sentence were acted on and neither is closed by the other.** The folder
  declares a bound now, derived from ten readings rather than chosen - 60 060 ms, four times the worst
  of them - and the same saturation that reddened six guards of four files gives 466 of 466. That makes
  the crossing unlikely and cannot make it impossible. What removes the *silence* is a reading, because
  the census figures were never the thing at fault: `unclaimedRedsIn` reports every red no pin of its
  own cell claimed, and on the run this entry describes it names `I-38` among thirteen. And the missing
  coordinate is a rule now, in the section on how a figure is published. ADR-0205.

- **That a pin at or below ADR-0076's line names every red.** That record says it in as many words -
  *five or fewer red guards: name all of them* - and `array-group-by.battery.ts` carries one instance
  found by hand, in its own words, *this pin named one where it owed four*. Nothing kept it, because a
  pin is verified as a subset: `agreesWith` asks that every named guard reddened and never the reverse,
  so a pin naming one of four agrees with its run and the battery exits 0.

  **It is measured now rather than merely stated.** Over the twenty-three artefacts on disk at
  `b0372b3` - a mixed perimeter, `registry-storage` from ADR-0204's own replay and most of the rest
  from ADR-0200's at `257425c`, named as one because what is counted is the shape of pins rather than a
  state of the tree - **898 cells, 653 of them at or below the line, and 155 of those name some of
  their reds and not all.** `packages/site` holds 40, `cli-install` 19, `packages/registry` 13.
  **Nought of the 653 carry an empty pin**, so the weaker convention - a killed cell names at least one
  guard - is kept everywhere.

  **What is done rather than declared is that the debt stopped being invisible.** `unclaimedRedsIn`
  prints those cells and the guards under them on every complete battery, with the count in its header,
  and it is at zero on the day the entry closes. It reports and refuses nothing: an unclaimed red is a
  load flake or a detection nobody pinned, one run does not separate them, and a refusal would redden
  twenty-one of twenty-three batteries and both gates on a debt rather than on a fault.

  **Where this looked**: `agreesWith` in `mutation/run.ts`, which is the subset rule and is deliberately
  unchanged; `THE_MOST_REDS_A_PIN_NAMES_IN_FULL` beside it, which is ADR-0076's line moved out of prose
  so that something reads it at all; and `killed` in `mutation/mutants.ts`, which is where a pin is
  written and which cites that record without holding it.

  **The population is every killed cell at or below the line**, and it grows with each mutant written.
  What would close it is 155 causes established one at a time and then named - never the reverse, since
  widening a pin to absorb a red whose cause is unread turns a flake into a published fact. Priced as a
  sweep across twenty-three batteries, each cause needing a replay to establish, and not taken.
  ADR-0076, ADR-0205.

- **That a contract's prose is true of the contract's own behaviour.** A case is data and a guard
  reads it; a rationale is prose beside that data and nothing reads it at all. `object/deep-equal@1`
  published *An implementation that memoises the pairs a failed candidate tried answers `true`* about
  two rows on which such an implementation answers `false` - measured at `3ec621c` by injecting the
  defect into the contract's own reference and watching nothing redden.

  **It is not the class of a stale sentence.** It was false on the day it was written, it passed a
  review by the two people who most knew the danger, and every check this repository holds was green
  through it: the rows are correct rows, so `every-case-is-justified` sees a rationale, the suite sees
  the right answers, and the freeze sees a digest that does not move.

  **Where this looked**: `serialise.ts`'s reading of a case, which carries `rationale` as a string and
  asks nothing of it; `field-map.ts`, where `caseTables[].cases[].rationale` is `structural` - a guard
  refuses an empty one and no guard reads what it says; and `against-the-catalogue.test.ts`, whose
  guards over the catalogue's prose are about presence and about stamps. **This entry read
  `documentary`, and `git log -S` over the whole graph finds no commit where the map spelled it that
  way** - it has read `structural` since `2905e08`. It changes nothing the entry claims, both strata
  meaning that nothing reads the sentence; what it was is a citation of the code that the code
  refutes, in the paragraph whose whole job is to name where somebody should look. ADR-0175.

  **A second instance came out of the same replay, and it is a comment on a guard rather than on a
  case.** `every-class-the-vocabulary-declares-is-sampled` re-declares the profile vocabulary by hand -
  three strings in an array beside the union - and its comment says *both directions*: a profile
  declaring a class outside the union does not compile, and a class inside it that no profile carries
  reddens here. **The second direction is dead.** `DS-05` adds a fourth member to the union and the
  guard's list stays at three, so it passes; measured on the same run. Totality would need the union
  derived from a runtime list rather than transcribed from the type, and `profiles.test.ts` is one of
  the seven frozen files. The correction cannot be declared either, because
  `correctionsToFrozenProse` resolves its address against case identifiers and this address is a
  guard - which is the field's first known limit and is written here rather than in it.

  **The population is every sentence of prose inside a published contract**, which is every
  `rationale`, every group note, every `reason` of a universal property, every `purpose` of a table
  and every comment inside the seven files - and the failure is silent by construction, because a
  sentence explaining a correct answer is green everywhere. **The only path that has ever found one is
  a replay**, and a replay finds it only where somebody wrote a cell aimed at the very defect the
  sentence names. Two of the three found this week were found that way; the third was found by the
  instrument refusing a *declaration a mutant contradicted*, which is the same accounting read the
  other way round.

  **What would close it is not a guard over prose** - three entries here already price that and refuse
  it. What it needs is the discipline the finding produced: a rationale claiming *an implementation
  that does X answers Y* is a claim a cell can be written for, and the cell belongs in the same unit as
  the sentence. That is a convention with nothing under it, which is what this list is for. **What is
  cheap and is done instead** is `correctionsToFrozenProse`, which does not close the entry: it lets
  the catalogue say a sentence is wrong after the fact, and says nothing about finding the next one.
  ADR-0161.

- **That a second word of a query is one the contract has any business answering.** The entry this
  replaces was about a word the query *adds* being free, and it is closed: a query that sets a word
  aside now carries more than one word of the field it names, so a contract cannot be reached through
  a single word. What is not closed is where that line was drawn. **Two words the reader carried out
  of one field are two things the contract chose and the query spelled, and no reading here separates
  a second word that belongs from a second word that does not** — `edit distance zzq` answers
  `string/levenshtein@1`, deliberately.

  **The population is every query carrying two words of one field and something the catalogue cannot
  place**, and nothing keeps it. It is not the closed entry read again at a higher number: that one
  was about an allowance being spent on the wrong thing, and this is about the point at which the
  catalogue's own evidence starts. **No instance is recorded**, which is the honest state — the twelve
  requests that motivated ADR-0154 are all one-word, and a two-word one has not been met.

  **What would close it is a way to read what a contract is *not* for**, which the catalogue publishes
  and cannot use: `identity.inputDomain` says in as many words that `number/parse@1` is *not a
  locale-aware parser*, it is prose, it is inside the frozen half of five published contracts, and
  ADR-0128 is why it is not restated as a field. So the closure is the same one three entries here
  already name — something that reads this repository's own strings — and this is the first of them
  whose subject is a *contract's* prose rather than a source's or a record's. Priced and not taken.
  ADR-0154.

- **That a query this catalogue can answer is one it does answer.** ADR-0154 raised the floor a query
  must clear and published what that cost: over 198 queries, each an alias with one word replaced by one
  the catalogue does not know, **151 were answered before and 125 after**, so twenty-six that had an
  answer have none. That record calls them *the same shape as the twelve closed* and does not say which
  of the twenty-six the catalogue could have answered, so the count is a loss and never a defect count.

  **One instance is measured rather than left inside that arithmetic, and a reader meets it now rather
  than one day.** Against the live origin, both clients from npm: `toopo@1.0.4` answers
  `string/slugify@1` to `slugify a blog post` and **`toopo@1.1.0` answers `Nothing in the catalogue
  answers "slugify a blog post"`** — measured on 2026-08-27, after the release that carried it out of
  this tree. It is a right answer withdrawn — ADR-0154's own sweep puts that query among the four
  requests this catalogue *could* have answered — and it is a different event from `round robin` losing
  `number/round@1` in the same corpus, which was a wrong answer the floor was correct to take. **The two
  refusals are indistinguishable to a reader**, and that is what the entry is about rather than a
  figure: `1.1.0` answers both with the same sentence, naming `blog, post` in one and `robin` in the
  other. **Nothing here tells the two apart**, and that is the entry: the
  floor is a rule about how many words a query carries, and the distinction is about whether the
  catalogue holds the thing asked for.

  **Where this looked**: the floor itself in `packages/registry/search.ts`; `packages/registry/search.test.ts`,
  whose corpus is queries somebody chose and which therefore cannot report a query nobody thought of;
  and ADR-0154's own sweep, which counts the loss and names none of it.

  **The population is every query the catalogue could answer and does not**, and it is unbounded the way
  the alias population one entry up is unbounded. **Closing one instance is reachable and is not taken
  here**: `alsoFoundBy` is standing since ADR-0155, so a phrase can be declared on a published contract
  with no digest moving — but declaring one is an alias review under ADR-0023, and making that judgement
  inside a unit whose subject is a release is the move this list exists to refuse. What would close the
  *class* is the thing four entries here already name, price and refuse: something that reads a
  contract's own prose against a query. ADR-0154, ADR-0155.

- **That a module a browser loads is one this repository's guards can see.** ADR-0156 takes the
  argument out of every module of `THE_BROWSER_GRAPH` and keeps the removal with four guards whose
  population is that list. The list is a declaration, and its keeper —
  `every-import-a-browser-module-keeps-is-a-module-the-site-writes` — once matched `from '...'` alone,
  which is how it lost the playground's edges in silence the day `start.ts` was written to defer them.

  **That clause was the entry and it is false**, and the correction was three lines below it in this
  same paragraph the whole time — a true sentence and a false one in one entry, which is the class
  this list keeps finding. Read at `ccc9fca`: the guard matches `from '…'` **and** `import('…')`, and
  its own comment says *both spellings, because one of them arrived with a hole in this guard.*
  ADR-0193.

  **What survives is narrower and real: a specifier the guard cannot resolve because it is computed.**
  `start.ts` carries two dynamic imports — `import('./playground.js')`, which the guard reads, and
  `import(new URL(playground.module, document.baseURI))`, which no pattern over source text can
  resolve. That is ADR-0149's templated-`import()` class, on the one module every page runs. Measured
  at `ccc9fca`: the graph is **11** modules, `LOADED_BEFORE_A_READER_ACTS` is **7**, so **4** are
  reached only through an `await import`. So a module arriving through a computed specifier is served
  with its argument still in it and with none of the four guards looking at it, and nothing reports
  either half. The failure is quiet by construction: the page works, the module works, and what is
  wrong is that a file a reader downloads left the population of every guard that has an opinion about
  it.

  **Where this looked**, because an entry describing what the code does not have names it: the guard
  itself, which already carries a comment saying it reads both spellings and was written after that
  hole was found; `THE_BROWSER_GRAPH` and `LOADED_BEFORE_A_READER_ACTS` in `packages/site/browser.ts`;
  and `packages/site/served-modules.test.ts`, whose four guards read the first of those two.

  **The population is one declaration and the guards that read it**, which is four today and grows with
  each guard written over the served modules. What would close it is a walk that follows what a page
  really fetches rather than what a list says — which is the emitted tree read as a graph, priced
  nowhere and not taken here. What is cheap and is done instead is that the guards derive their
  population from the declaration rather than restating it, so the day the declaration is repaired they
  are repaired with it. ADR-0156.

- **That the repair a record prescribes is one somebody can carry out.** ADR-0035 decides what a
  search may answer, and it names the repair for the case it cannot: *a query only a description could
  have answered is a **missing alias**, and the repair belongs in `identity.searchAliases`, where it is
  frozen, reviewed and served.* `contractSnapshot` freezes `identity` whole and every published contract of the
  contracts are published, so **that repair is available on `array/group-by@1` and on nothing else** —
  and `array/group-by@1` is the contract the catalogue refused. A prescription no published contract
  can follow is not a prescription.

  **It is the alias entry above arriving one level up, and that is why it is a separate entry rather
  than a clause of it.** That one says the *mechanism* contradicts ADR-0023. This one says a *second*
  record tells a reader to do something the mechanism forbids, and the two records were written
  eighteen apart by somebody who knew about the freeze in between. So the population is not
  `searchAliases`: it is **every repair any record prescribes**, and nothing resolves a prescription
  against what the freeze allows. `confirmationFaults` resolves the guards a record names and
  `citationFaults` resolves the records a file names; neither reads a sentence telling somebody what to
  edit.

  **It is measured rather than hypothetical, and the measurement is what made it visible.** ADR-0136
  repaired the matching rule and left four descriptions of these five functions answering nothing —
  `typo tolerance`, `spelling suggestion`, `date maths`, `validate a numeric input`. Every one of them
  is ADR-0035's own diagnosis.

  **They stopped being unfixable at ADR-0155 and they are not fixed**, and the two are worth keeping
  apart. `alsoFoundBy` is a standing field, so the phrase can be declared on a published contract with
  no digest moving — the prescription is carryable now, which is what this entry asked for. What it is
  not is carried out: each of the four needs an alias review of its own, and **one of them probably
  fails it**. Somebody typing `spelling suggestion` would be handed an edit-distance function, which
  is the shape of `remove accents from string` on `string/slugify@1` — the liar ADR-0023 removed
  because the result did not keep the promise. Making four judgements inside a unit whose subject was
  the mechanism is the move this list exists to refuse, so they are named here as **reachable and not
  taken** rather than struck off. ADR-0155.

  **A fifth instance was a family rather than a phrase, it was on the contract this catalogue is most
  asked for, and it is closed.** `number/parse@1` declares `int` and not `integer`, `answers` lets a
  query shorten a word and never extend one, so `integer` reached nothing. Measured at `643bf7e` over
  eight ordinary ways of asking for that function: written with `integer`, **five were silent before
  ADR-0154 and all eight were after**; written with `int`, **nought of the eight are silent**. It was
  separated from ADR-0154's own costs deliberately — that record silences four requests this catalogue
  could have answered and this was not one of them, the floor having moved three of these eight and
  *revealed* the other five. **`string to integer` is declared now**, as the first learned term this
  registry holds, and re-measured at `91b7314` the eight `integer` forms all answer `number/parse@1`
  first. They are in the corpus, so the claim is a guard rather than a reading. ADR-0154, ADR-0155.

  **What is cheap and is done instead is that both records now say so** — the head of ADR-0035, and
  this entry. What would close it is the validation stage reading this repository's own strings, named
  by several entries of this list already, already priced and already refused as a lint over prose —
  and this is the first of them whose subject is a *record* rather than a source, which is a widening
  of that stage rather than one more customer for it. ADR-0136.

- **That a decision's answer reaches every surface the decision settles.** ADR-0140 settled *a command
  belongs to a contract, so it belongs on every contract's page and on none of the pages that are about
  the catalogue*, and took every command off the site's door. **The README is the other door and kept
  the answer ADR-0140 had just replaced.** Measured: ADR-0114 is dated 2026-08-18 and ADR-0140
  2026-08-19, and the exemption ADR-0114 wrote — *an install command is exempt … it is a coordinate and
  not a claim, and every README on earth has one* — is the clause ADR-0140 refuses in as many words. It
  stood for a year, and what ended it was a reader's complaint rather than any sweep.

  **It is not the class of a stale entry and nothing drifted.** Both records are true of the surface
  each was written about, both are still cited, both resolve, and no guard was wrong at any point. What
  is missing is that **a decision answering a question does not sweep the other surfaces holding the
  answer it replaced**. This is rule 2 of this section — *the change that builds such a mechanism sweeps
  this list for every entry naming it* — arriving on a **decision** rather than on an entry, where the
  rule does not reach: it is written about entries of this list, and a record is not one.

  **Where this looked**: the eight fault functions of `mutation/decisions.ts` — `declarationFaults`,
  `guardFileFaults`, `pathFaults`, `backCitationFaults`, `confirmationFaults`, `citationFaults`,
  `linkFaults` and `reopeningFaults`. Every one resolves what a record **names** — a path, a guard, a
  record, a link's target, the presence of a section — and **not one reads what a record says**.
  `reopeningFaults` comes closest and asks only that a trigger section exist, never that anything
  answer it.

  **The population is every clause of a record that decides something true of more than one surface**,
  and no sweep here can bound it: telling such a clause from an ordinary sentence is the judgement this
  list refuses to hand to a shape, which is why three entries above already refuse a lint over prose.
  **One instance is recorded and no rank is published** — a count over this population would be a count
  of somebody's readings, which is ADR-0018's first rule.

  What would close it is the thing five entries here already name, price and refuse: a validation stage
  reading this repository's own strings, and this is the **second** of them whose subject is a *record*
  rather than a source. **What is cheap and is done instead** is that both records now carry a note
  where the divergence is, so a reader arriving at either meets the other rather than the half that was
  replaced. ADR-0173.

- **That a record announcing a correction posts one on the record it corrects.** A stamped record is
  repaired by a head note and by nothing else, so *ADR-XXXX is corrected and is not rewritten* is a
  promise whose keeping lives in a different file from the sentence making it. **Nothing reads the two
  against each other.**

  **It is a recurrence rather than a lapse, which is what took it off a commit message and onto this
  list.** ADR-0223 closed with *ADR-0220's classification of `Instant` is refuted … the correction is
  here* and posted no note; ADR-0220 went on publishing *`Instant` and `ZonedDateTime` are the two that
  are not zone-free* for two days. ADR-0225 closed with *ADR-0216, ADR-0223 and ADR-0224 are corrected*
  and posted none of the three. **Two records in two days, and the second was written by whoever had
  just read the first.** Both were found by the owner reading, and neither by any check.

  **And the announcement is not the population**, which is the half a repair scoped to it would miss:
  ADR-0225 named three and the sweep found **five**, ADR-0217 and ADR-0219 carrying a claim that had
  stopped being true and being named nowhere.

  **Where this looked**: the fault functions of `mutation/decisions.ts`, every one of which
  resolves what a record *names* — a path, a guard, a record, a link, the presence of a section — and
  not one of which reads what a record *says*; `backCitationFaults` beside them, which resolves
  `governs` in both directions and has no opinion about a correction; and
  `every-decision-says-what-would-reopen-it`, which asks that a trigger section exist and never that a
  trigger fired be answered.

  **The population is every sentence of a record announcing that another record is corrected**, and it
  grows with each unit that corrects one. **What would close it is narrower than the lint over prose
  four entries here already refuse**: the announcing sentence is formulaic, its object is an *address*,
  and the check is whether that address's record cites this one back — which is `citationFaults`'
  machinery pointed at a different population. What it cannot see is a superseded **figure**, which
  carries no address. Priced as its own unit and not taken, because building it inside the unit that
  repairs its instances would make the instances the argument for it. ADR-0226.

- **That a figure written in a *Where this looked* block was read rather than copied.** Rule 3 of the
  section above prescribes that an entry names where it looked, *the way a count names its population*.
  **Nothing keeps that the count was taken**, and a block is prose, so lifting a neighbour's is cheaper
  than opening the file — and a copy reads exactly like a reading.

  **It is systematic rather than occasional, and that is measured rather than feared.** Swept at
  `d6bb188`: **36** blocks carrying **49** number-and-noun claims, **24** once a bare *one* used as an
  article is set aside. **Nineteen were read and six are false** — *`mutation/decisions.ts` has nine
  fault functions* in nine places against eight since its first commit; *`pages.test.ts`, whose 35
  guards* against **26**, also unmoved since its first commit; *the eight the component layer
  introduced*, which its own entry contradicts with **twelve** three paragraphs below and which measures
  **13** today; *`attribution.ts` … already records that 69 identifiers collide*, which that module does
  not record at all; and **two** in one entry that ADR-0222 moved this morning, *the job's forty
  minutes* and *the four `timeout-minutes` declarations*, now 79 and **five**.

  **Both failures this list separates live in this one form.** Three were never true — rule 3 — and
  three drifted — rules 1 and 2 — and they read identically; `CLAUDE.md:4520` and `CLAUDE.md:4540` were
  falsified by one commit, `aaf625f`, which swept neither.

  **Where this looked**: rule 3 itself, whose remedy this is; the fault functions of
  `mutation/decisions.ts`, which resolve what a record names and read no prose of this file; and
  `mutation/readme.test.ts`, which resolves a published figure against what produced it and does so for
  one page and not for this one.

  **The population is every counted claim in every such block**, **14** since ADR-0229 removed the
  decorative ones, and it grows with each entry written. **What would close part of it is cheap and is
  priced rather than taken**: a guard over the resolvable form alone — *N guards of `<file>`*, *N guards
  ADR-NNNN names*, *N fault functions of `<file>`*, *N call sites in `<file>`* — one file to write and
  no new dependency. **How much of the population that is carries no figure**, because *resolvable form*
  was never given a rule tight enough to count against: ADR-0228's *8 of the 24* and ADR-0229's *the
  boundary removes six* are both readings of a boundary nobody drew, and they are withdrawn rather than
  restated. **What survives is the reading that does not need one**: it would have caught **two of the
  six** false claims, the two whose noun is a guard count; the other
  four name a thing whose unit only a reader knows — a component layer's type sizes, a fact a module is
  said to record, a job's bound. **The rest needs what four entries here already refuse**, a validation
  stage reading this repository's own strings. ADR-0228.

  **The guard is not priced-and-not-taken any more; it is blocked on a witness that does not exist, and
  the reason is better than the rate.** It was first refused on catching two of six. What refuses it now
  is that **it would live in the meta suite, which no battery injects into, so nothing could ever redden
  it** — and a guard no battery can redden is not a guard here. **This unit's own instrument
  demonstrated the cost**: the attribution sweep read *commit* where ADR-0149 says *push*, and returned
  two false positives while looking finished. A guard built on that reading would have been green and
  carried the same defect, with nothing able to say so. **So what would reopen it is not a better
  capture rate — it is a battery able to redden a guard of the meta suite.** ADR-0230.

  **And the limit these readings kept declaring — *every check compares a number with a count and none
  reads what is being counted* — has its instance, in the record that declared it.** ADR-0228 credits
  `aaf625f` with falsifying three claims and lists three items; **it falsified one**. That commit's diff
  of `suites.yml` is additions only, so it did not move a bound — `74b1b75` did, the same day — and
  *nine guards* had been false since `4131c28`, nine days earlier. **The three was checked against a
  list of three items and nobody read whether the commit had done each of them**, and two later
  readings of that paragraph, one written to correct it, passed over the same thing. So the cost is not
  *a number might be wrong about its noun*: **a number checked against a list makes the list look
  checked**. Swept over the class: **23 attributions, 8 mechanically checkable, 1 false** — and the
  other 15 unreachable, two because they name *pushes* and git carries no push boundary, thirteen
  because their object is a claim rather than a diff. **A third of the class is checkable and the
  un-checkable two thirds contain the shape that produced the instance.** ADR-0230.

- **That every phrase a contract is found by has been read against what the contract does.** ADR-0023's
  alias review happens at publication: somebody reads each phrase against the contract's own
  description and asks whether it promises something the contract refuses to do, and it caught eight
  that did. A learned term arrives at a moment **nothing marks** — no publication, no digest, no
  ceremony — so there is no occasion at which that review runs, and the field is where the cheapest
  contribution this project invites now lands.

  **No guard can stand in for it and this is not a gap somebody could close by writing one.**
  `search.test.ts` has said since it was written that `every-declared-alias-finds-its-own-contract-first`
  *reviews the search and never the aliases* — an alias is in the index, so it retrieves the contract
  that declares it by construction, and a phrase promising something the contract refuses passes as
  comfortably as a true one. That sentence is now true of a wider population by exactly one field.

  **Where this looked**, because an entry describing what the code does not have names it: the
  guards ADR-0155 added, `identity.searchAliases`'s own review in ADR-0023, and `field-map.ts`, where
  `alsoFoundBy[].term` is `executable` and the two sentences beside it are `documentary` — which is the
  classification saying in the schema's own vocabulary that nothing reads them.

  **The population is every learned term the catalogue holds, which is one**, and it grows with each
  contribution accepted. What is done rather than declared is the half that is computable:
  `a-learned-term-is-one-the-contract-was-not-already-found-by` refuses a term the contract was already
  found by, and `a-term-the-registry-learned-is-one-its-contract-can-no-longer-declare` refuses one on a
  contract whose `identity` is still open — so the cost is confined to where it is unavoidable rather
  than being a shorter route past a review that was on offer. **What would close it is a convention with
  a mechanism under it**: the next publication's alias review sweeping the learned terms of every
  contract as well as the frozen ones, which needs something marking when each was last read — and that
  is the validation stage reading this repository's own strings, which other entries here already
  name, already price and already refuse as a lint over prose. ADR-0155.

- **That a name the catalogue freezes is one a reader can ask for.** `ServedIndexEntry` carries the
  address, the summary, the aliases, the learned terms, the domain, whether it is installable and the
  export names — and `contract-index` is the only document a search reads. **Every other address the
  catalogue declares is invisible to it.** `small-integers` is `benchmarks.profiles[0].name` of
  `number/parse@1`, it is inside the frozen half, it is rendered on that contract's page, and
  `toopo search small-integers` answers nothing.

  **Measured at `91b7314`, by the rule that a name is counted once however many contracts declare it,
  over the six serialised records, each asked as its own words**:

  | what the catalogue declares | total | distinct | answered |
  | --- | --- | --- | --- |
  | settled case | 218 | 217 | 9 |
  | case group | 55 | 53 | 2 |
  | benchmark profile | 32 | 31 | 3 |
  | universal property | 24 | 4 | 0 |
  | own declaration | 22 | 22 | 0 |
  | profile class | 21 | 19 | 1 |
  | case table | 8 | 2 | 0 |
  | **all seven** | **380** | **348** | **15** |

  **The fifteen are coincidence and not coverage**, which is why the column is there rather than a
  round zero: a case identifier answers when its words happen to be words some contract's name or
  alias already carries, so what is answered is the *word* and never the address. Distinct rather than
  total, because two contracts naming a group the same way is one thing a reader can ask for.

  **It is true whether or not anything else on this list is done**, and it is not this list's usual
  class: nothing is unkept, something is unserved. **It is not taken here**, and the reason is one
  entry away — `benchmarks.profiles[].name` is on this list precisely because *no guard reads a
  declared name against what it describes*, so serving those names would put 348 addresses into the
  one document every query fetches on the strength of a field nothing verifies. What it would cost is
  measurable and is not measured: `contract-index` is 3 586 canonical bytes today, and the population
  above is larger than everything now in it. Priced as its own unit and not taken. ADR-0155.

  **The deferral was waiting on something that is now known not to be coming, and it holds anyway.**
  It reads as *not yet*, on the strength of the entry above closing one day at the validation pipeline.
  ADR-0171 measured that it closes nowhere: seventeen of thirty-six profile names are frozen inside
  digests six contracts are bound by, so the field this deferral is conditioned on stays unverified for
  the life of those majors. The arithmetic is unchanged and the tense is: it is not *held back until*,
  it is **held back**, and what would lift it is a decision to serve 348 addresses knowing what backs
  them rather than a mechanism to make them verifiable. ADR-0171.

- **That a comment naming a guard is naming one that exists.** A record may not: `confirmationFaults`
  resolves every pair a `confirmed-by` declares against the guards its suite collects, and
  `citationFaults` resolves the other direction. **A comment is resolved by nothing.** So citing a guard
  in a record is an act of *verification* and citing one in a comment is an assertion nothing holds —
  and the two look identical to a reader, because both are an identifier in backticks beside a sentence
  saying what it keeps.

  **It is not hypothetical.** `packages/site/catalogue.ts` published *what keeps them from disagreeing is
  that `a-domain-page-lists-every-contract-the-index-files-under-it` compares the two sides* for three
  units, and no suite collected any such guard. It came out when ADR-0126 put the name in a
  `confirmed-by`, where the meta suite does look. The guard is written now; the class is this entry.

  **The population is measured and it is not the defect count.** At `948678d`, over every tracked `.ts`,
  `.md` and `.yml`, matching a backticked kebab-case token of four words or more: 279 tokens, of which
  226 are guards some suite collects, and **50 of those are named in a comment and cited by no record**.
  That is the set where the mechanism above is not running. The remaining 53 are tokens no suite
  collects, and **counting them as defects would be false**: read one by one they are mostly case
  identifiers, `NEEDS` identifiers, a lifecycle state, sample names and one npm package — the form
  cannot tell a guard's address from a case's, because ADR-0017 gives them the same shape on purpose.

  **What would close it is not a wider sweep.** A guard over comments would have to decide which
  kebab-case token is meant as a guard, which is the judgement the shape deliberately does not carry. The
  executable form is the one three entries here already name — a validation stage reading this
  repository's own strings — and what it would need beyond those is a way for a comment to *declare* that
  it is citing a guard, which is a convention nothing here has. Priced and not taken. **What is cheap and
  is done instead is the convention**: a comment that says a guard keeps something is worth a record's
  `confirmed-by`, and the record is where the citation is resolved. ADR-0126.

- **That an address written as a bare literal is one the catalogue cannot publish.** ADR-0142 moved
  every fixture of this repository behind a reserved domain prefix and holds it there with two guards,
  and the guards read a **declaration** — the exports of `packages/registry/imagined-addresses.ts` — so
  an address added there enters their population with nobody editing them. **What nothing reaches is an
  address typed straight into a test**: a future expectation written as `'string/titlecase'` rather than
  taken from the constant is a fixture standing at an admissible address again, silently, and the
  failure has no event — it is met by whoever sets out to write that contract.

  **A wider sweep is refused and the refusal is a measurement rather than a price.** Matching
  `CONTRACT_NAME`'s own shape against every quoted literal of every tracked `.ts` file at `db2d236`
  returns `lib/toopo`, `packages/cli`, `application/json`, `vitest/config`, `app/toopo`, `arm/lens` and
  `refs/tags` beside the real answers. **The shape of an address and the shape of a path are one shape**,
  so no reading of the text separates them, and a guard that tried would need a list of exceptions —
  which is the convention this whole unit replaced.

  **The population is every user-facing and test-facing string of this repository that could hold an
  address**, and it is the same population three other entries here already name. What would close it is
  the validation stage reading this repository's own strings, already priced and already refused as a
  lint over prose; what is cheap and is done instead is that both never-held addresses are now taken
  from the declaration rather than typed, so writing a bare one is a deviation rather than the path of
  least resistance. ADR-0142.

  **It now has a measured instance, and it was found by looking for dead code rather than for
  addresses.** `packages/cli/imagined-source.ts` exports `THE_IMAGINED_ROOT`, whose own comment says it
  exists *so that a caller does not transcribe the name* - and measured at `b1fcff6`, **no caller reads
  it and eleven sites transcribe exactly what it holds**, `'typescript/imagined-number/round@1'`,
  across `install.test.ts`, `remove.test.ts`, `update.test.ts`, `emit.test.ts` and `list.test.ts`. So
  the declaration exists, the path of least resistance goes around it, and the thing that noticed was
  an export nothing imports. **It is the entry's own class arriving on the entry's own remedy**: what
  was *done instead* is a declaration, and nothing keeps a declaration being used. ADR-0174.

- **That the text of a guard is the text somebody wrote.** A `\b` edited into a source through a shell
  heredoc lands in the file as a literal backspace, `0x08`. Nothing here reads a source for a control
  character: it compiles, the suite collects it, and the guard refuses less than its text says while
  looking exactly like a guard. **Measured at `ccc9cb3` over every tracked file: six control characters
  in three files.** Three were the collapse - two of them committed, in
  `every-figure-of-the-card-is-a-quantity-and-a-proportion-sits-with-its-breakdown`, whose
  `/\bof\b|\//` had been refusing a slash and nothing else since it was written - and are repaired.
  The other three are `0x00` in `mutation/history.ts` and `packages/registry/round-trip.test.ts`, which
  are deliberate separators whose behaviour is exactly what `'\0'` means; they are named rather than
  changed, because changing them is what the closure below would require and this unit did not take it.

  **The population is every tracked source**, and the failure is quiet by construction - a narrowed
  guard is green, and the only thing that says otherwise is a mutant aimed at exactly what it stopped
  refusing. This one was found that way and not by anybody reading.

  **What would close it is one of the cheapest guards this repository could hold** - no tracked source
  carries a control character but tab and newline - and the price is where it would live. The subject is
  every source and so is nobody's folder; the natural home is the meta suite, which is `mutation/`, which
  **no battery injects into and the census does not count**. So the guard would be born unwitnessed by
  construction, which is the shape this repository refuses without an argument. Writing the three `0x00`
  as `'\0'` first makes the rule total, with no declared exception. Priced and not taken here, because a
  unit building a page is not where one decides what the meta suite is worth. ADR-0140.

- **That a value a guard looks for appears once on the surface it looks at.** A guard that asks
  whether a figure is *somewhere* on a page is satisfied by any occurrence of it, and a page that
  states one value twice hands it the copy. Measured at `8038113`:
  `the-cost-a-page-states-is-what-lands-and-not-what-is-served` requires the installed byte total to
  appear in a contract page's reading; a new section listed each installed file with its weight, and
  with one implementation file that weight *is* the total. **W-12 survived** - the cell that points
  the card's figure at the harness instead of at what lands - while the page read perfectly well.

  **The guard is not too broad and the page is not wrong; what is wrong is that they met.** The
  defect arrives from a change that does not touch the guard, does not touch what the guard is
  about, and adds a second true statement of one number somewhere else on the same surface. Nothing
  reads a page for repeated values, and nothing could sensibly forbid one.

  **It is not the class `assertWholeSuiteRan` is in**, which is a total blind to a composition: there
  the check is too coarse to see what changed, here the check is exact and a duplicate answers it.
  **The population is every guard that looks for a value anywhere on a surface where that value can
  appear more than once**, which today is the two figure guards of `pages.test.ts`. **The condition
  is not one page's any more, it is every page's.** Measured at `ccc9fca` on the needle
  `the-cost-a-page-states-is-what-lands-and-not-what-is-served` really searches for — the installed
  total with a thin space and the word `bytes` — **all six contract pages state it twice**, and the
  harness total appears on none of them. So the mutant this entry records as having survived once is
  survivable on six of six. ADR-0193. What would close it
  is asking those guards *where* rather than *whether* - the card, not the page - and the price is
  that a guard about a claim starts naming a block, which is the coupling to a layout that
  `no-element-runs-into-the-one-beside-it` and its neighbours were written to avoid. Priced and not
  taken. ADR-0130.

  **The instance is gone and the class is untouched, and what the repair found is that neither record
  had named the right mutant.** Measured at `aff4bdd`: **W-12 is killed**, not survived. It injects
  into `whatItCosts`, which is the one derivation the description *and* the card read, so it moves them
  together and the page states `60 371 bytes` twice - which is why *pointing the card's figure at the
  harness* was never the mutant this duplication shielded. What it shielded is a mutant at the call
  site, and it is worse: with the card's cost figure removed the guard was **green on all six pages**,
  so a reader could lose the one figure that says what installing costs and nothing would say. After
  the repair the same perturbation is **red on all six**. So the paragraph above is right about the
  class and wrong about its own witness, in both records that carry it. ADR-0194.

  **What closed the instance is not what this entry proposes.** The price of *where* rather than
  *whether* is real and is still refused; the duplicate was removed instead, which the entry's own
  sentence allows for - *the guard is not too broad and the page is not wrong; what is wrong is that
  they met*. The description states the shape of what lands and the card states its magnitude, so the
  number is made once. **The population is unchanged at the two figure guards of `pages.test.ts`**,
  nothing reads a page for repeated values, and the instance count is **0 of 6** where it was six of
  six. ADR-0194.

- **That a citation inside a file a published contract freezes ever resolves again.** The two shared
  files carry three identifiers of a history that no longer exists — `3ec99c5…` twice in prose, and
  `THE_ANATOMY_WAS_MEASURED_AT` in `every-contract.ts`, which is a constant and not a comment. They
  cannot be repaired: the digest covers those files byte for byte, so the edit that would fix them
  rebinds four published addresses, and permanent rule 6 forbids it. **The population is every file a
  published contract freezes**, which today is `packages/catalogue/every-contract.ts` and
  `packages/catalogue/identifier.ts`, and it grows by seven files with each contract published.

  **The fact that makes this an entry rather than an internal untidiness is that those files are
  served.** An auditor who fetches a contract's snapshot receives the shared harness with it, so what
  arrives on their disk carries three identifiers that resolve nowhere — in the one artefact whose
  whole claim is that it can be checked without taking our word for anything.

  `theEditableSources` is the honest half: the citation guard sweeps what this repository may still
  edit, and says so rather than claiming a sweep one part of which is out of reach. **What nothing
  keeps is that the next frozen file carries a fourth.** What would close it is a validation stage
  refusing a commit identifier in a file a submission freezes — which is the same stage three entries
  below already name, priced there and refused there as a lint over prose.

  **This entry closed on *written into that stage's requirements rather than built*, and there are no
  such requirements.** Swept at `5e1e2a9`: `stage's requirements` occurs nowhere in the tree, ADR-0124
  does not carry the word `requirements` once, and the only `requirementsOf` this repository holds
  reads what a *contract's* own module publishes — which is stage 1's subject and not a future stage's
  filing cabinet. The clause named an act that was never performed and a place that does not hold it.

  **It is worth separating from the ordinal ADR-0171 refuted, because the two look alike and only one
  is a defect.** Naming a mechanism by what it does — *a validation stage reading this repository's own
  strings* — satisfies rule 1: the day somebody writes that lint, every entry naming it is
  recognisable. Naming one by its number does not, which is why the `contractAnatomy` entry was
  corrected and this one is not. What was wrong here was smaller and in a different place: a filing
  claim beside a sound description, invisible to any sweep for an ordinal. What is written down is this
  entry. ADR-0124, ADR-0171.

- **That an identifier this repository writes bare is one somebody can follow.** `A_CITATION` matches
  seven hexadecimal digits closed by a backtick, and that form was measured rather than chosen — it
  separated 58 of 68 citations from all 29 benign runs on the day it was written. **What it does not
  match is an identifier written bare**, and `history.ts` claimed for three records that the ones it
  misses are quoted elsewhere in their own file and reached anyway. That claim is false: a `git log`
  excerpt in ADR-0111, the `npm run hands` table in ADR-0112, and two ordinary comments in `style.ts`
  write identifiers no backtick in those files repeats.

  **It was found by this rewrite and not by a guard**, which is the whole of why it is here: every one
  of those had to be translated by hand, and the guard would have been green with all of them dead —
  the exact morning ADR-0095 says this module exists to be red on. **No rank is published**, on the
  rule that a sentence which can be true without counting does not count, and the shape is what a
  reader needs: an identifier inside a fenced block or a comment.
  `git grep -nE '\b[0-9a-f]{7,40}\b' -- '*.ts' '*.md'` names the population at any commit.

  **What would close it is widening the form to every run that resolves**, and the reason that is a
  decision rather than a one-line change is what the narrow form was bought for: a truncated digest, a
  decimal constant and a deliberately fake identifier all have to stay benign, and resolution rather
  than shape would have to be shown to separate them. Priced as its own unit and not taken here,
  because a rewrite is the wrong place to widen the guard that reads it. ADR-0124.

- **That a breakpoint is the arithmetic of the lengths it separates.** Two guards now keep that every
  ceiling and every track of this site's layout is derived — `every-ceiling-on-a-box-is-derived-and-never-typed`
  and `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` — and **neither can read
  the one place a width is still typed**, because `var()` is not allowed in a media query's condition
  in any browser and never has been. **The population this entry names is `52rem`, `64rem` and
  `97rem`, and not one of the three is in the stylesheet.** Measured at `ccc9fca`: four conditions,
  `26rem`, `50rem`, `11rem` and `12.5rem`, and `--two-columns` is gone with them. **The sentence that
  was the entry — *not one of the three now carries the arithmetic it came from* — is false of every
  one of the four**: `26rem` states the measurement that produced 416px, `50rem` states the arithmetic
  of both shell arrangements at 49.14rem and 47.40rem and takes the wider, and the two rem conditions
  state the sweeps that found them. So the population was replaced rather than repaired, and the
  replacement is argued where the thing it replaced was not. ADR-0193.

  **And one of the four has since lost the argument it was praised for having.** ADR-0197 deleted the
  two shell arrangements, so `50rem` no longer separates the lengths it was derived from: what is left
  under that condition is `main`'s padding, which is real, and a number whose derivation is gone. It
  keeps its value because moving it would move what a reader is served for a reason no measurement
  supports, and the comment above it says so rather than restating the dead arithmetic. **So the entry
  is back to what it was named for on one of its four**: a typed width with nothing keeping it.
  ADR-0197.

  **What is unchanged is the class and it is the whole entry now**: nothing evaluates a condition
  against the tracks it separates, and CSS still cannot, so four comments carry four arguments that
  four readers have to trust. The paragraphs below are the old population's and are kept as taken —
  each was true of the arrangement it was measured on, and rule 3 of this section is why they are
  marked rather than deleted. **The document order they rest on is gone**: `main, .where, .rail` is
  now `.shell:has(.beside)` and `.shell:has(.aside)`, two-element shells placed by a grid. That is the
  reopening **this entry wrote for itself** — *what is taken again on the day that order changes is
  the measurement and never this argument* — and the day came at ADR-0187 with nobody taking it.

  **What would close it is not a lint and the price is a browser.** Every one of those lengths
  resolves against `ch`, which is a property of the face the reader's own system supplies, so the
  arithmetic cannot be evaluated by anything that does not lay text out — the guard would be the
  eleven-page sweep this repository already takes by hand, made into a suite with a browser as a dev
  dependency. That is the trade stage rule 3 admits only where the mechanism keeping a tool out of the
  product is executable, and it would buy a check on three integers. **Refused knowingly, and it is
  the whole of what ADR-0123's third reopening trigger is about.**

  **That paragraph was the whole entry and it was incomplete in a way that changes what the entry is.**
  It announces a price, and a debt that announces a price invites somebody to pay it. Two of these three
  thresholds are not waiting on a browser: **no arrangement of today's CSS reaches them**, and that is a
  demonstration rather than an estimate.

  **`97rem` is closed to the language by counting.** The three-column shell wants `.where | main |
  .rail`; the document is `main, .where, .rail`, because ADR-0121 put the content first so a reader at
  390 does not meet sixteen lines of navigation before a word. Read in a browser at `7e9438c`, flexbox
  reaches exactly two orders from that document — `row` gives `main, .where, .rail` and `row-reverse`
  gives `.rail, .where, main`. **Three elements have six orders, a flex container reaches two, and
  neither is the one wanted.** `order` reaches it and is refused for a measured reason rather than a
  stylistic one: it applies at every width, so it restores at 390 exactly the defect ADR-0121 removed. A
  grid reaches it by placement, and placement is what needs the condition.

  **The corollary is why the third one is not closed to the language**, and it is the same count read
  the other way: a two-element shell has two orders and a flex container reaches **both**. So
  `flex-direction: row-reverse` derives the `64rem` threshold, measured on `/typescript/string/` at
  `7e9438c` — identical geometry at and above 1024, the fold moving down to about 760, and the document
  untouched, since a container's direction is not `order`. **It is available and it is not taken**: it
  would change what a reader sees between 760 and 1024 on five pages, for a layout the redesign is about
  to replace, and an entry that read *impossible* without reading *except here* would be false in the
  other direction.

  **`52rem` is closed by ADR-0122 rather than by the language.** A case row two abreast is a grid, and
  `minmax(0, var(--measure))` sizes the call column **on its content up to a ceiling** while a flex basis
  imposes that width even where the call is short — which takes the room from the argument beside it.
  Measured over the settled cases of `string/slugify@1`, as the height the rows occupy: the flex form
  wins at 1024, where the grid squeezes the argument to 211px and pays **11 853** against **9 412** — and
  loses where it matters, **8 548 against the grid's 6 897 at 1240**, which is the ordinary width. That
  is what ADR-0122 chose the grid for, one level down.

  **And the candidate before it was refused on its own principle.** Folding on two measures put the
  threshold at `2 * measure + gap`, which is what `--two-columns` *was* by definition — so the fold
  landed exactly on the container's own ceiling and sub-pixel rounding decided it. **A switch at the
  micron is not a derived threshold, it is a threshold nobody controls**, and it would have read as the
  closure of this entry. ADR-0134 deleted `--two-columns`, so that candidate no longer exists to be
  refused; the refusal is kept because the shape it names — a threshold landing on the length it is
  derived from — is what the next candidate will be.

  **It reopens on the structure and not on a better use of flexbox.** What blocks `97rem` is a property
  of *this* document order, not of CSS: the seven mock-ups of the redesign carry no width condition at
  all and fold on bases, because their pages are not built out of `main, .where, .rail`. **What is
  taken again on the day that order changes is the measurement and never this argument**, which is
  about one arrangement and expires with it.

  **That paragraph ended *which is planned*, and the event it was waiting for has happened otherwise.**
  ADR-0125 to ADR-0131 are the redesign; they remade the front page, the families, the refused contract
  and what a contract is, and not one of them touched `main, .where, .rail` — the unit that was to do
  it was abandoned once two of the three thresholds turned out to close by no flexbox arrangement at
  all. So the clause announced a future for an event that had already passed, which is precisely the
  form rule 3 of this section names: **an entry that is false without being stale**, because nothing
  about it looks old.

  **ADR-0132 then went at the third threshold from the other side and refused it with a measurement.**
  What would let `97rem` go is the rail standing beside the content column rather than in the shell;
  the rail is sticky over the whole page and a settled-case table is 905px wide, and the two cannot
  share a column, so the rail can only accompany the region holding no wide block. Measured by building
  that arrangement in a browser at `0cec957`: **13.7% of `number/parse@1` and 23.2% of
  `string/slugify@1`**, against 100% today. So the population is unchanged at three, and what this
  entry now knows that it did not is what the closure costs.

- **That any layout this site declares is one somebody looked at.** `pages.test.ts` builds documents
  and reads their text; **nothing in this repository lays a page out.** So every rule of
  `packages/site/style.ts` that decides a width, a track, a fold or a placement is kept by nothing that
  runs. The two guards that do read this stylesheet —
  `every-ceiling-on-a-box-is-derived-and-never-typed` and
  `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` — read its *text* and ask whether
  a length is derived from a declared one. Neither asks what it renders, and a rule that is derived and
  wrong satisfies both.

  **The population is measured, and the rule it was counted by is written down because the last count
  is not reproducible without it.** Inside the `STYLE` literal, CSS comments stripped, `@media`
  conditions excluded because a condition is not a declaration: **`ab2765c` had 40 and `7c15c69` has
  30** — 10 `grid-template-columns`, 4 `max-width`, 4 `min-width`, 6 `grid-area`, 2 `grid-column` and 4
  `width`. Every one of them is `one-directional`. The entry read **38 at `0cec957`** under a rule it did
  not state; that figure counts the three `@media (min-width: …)` conditions, which is why it cannot be
  rebuilt by the sweep above, and it is left where it is rather than corrected, being stamped.

  **ADR-0134 shrank the population by a quarter and did not touch the debt**, which is the thing to
  read twice: ten declarations went because a ceiling stated in characters went with them, and the
  thirty that remain are as unread as the forty were.

  **The redesign doubled it back and did not touch the debt either.** Re-read at `ccc9fca` by the rule
  above: **60** — 10 `grid-template-columns`, 19 `max-width`, 14 `min-width`, 4 `grid-area`, 2
  `grid-column` and 11 `width`. **The rule names one literal and the site now composes the sheet out of
  two**: `THE_COMPONENT_RULES` contributes 10 of the 60 and is interpolated at `style.ts:1055`, so the
  count reaches it by where the sheet is assembled rather than by anything the rule says — a second
  literal placed anywhere else would fall out of it in silence. Every one of the 60 is still
  `one-directional`. ADR-0193.

  **A deletion took it to 48 and the debt did not move.** Re-read at ADR-0197 by the same rule over the
  served sheet: **48** — 5 `grid-template-columns`, 18 `max-width`, 13 `min-width`, 0 `grid-area`, 2
  `grid-column` and 10 `width`, against 60. Twelve went with the shell and the navigation column, and
  the forty-eight that remain are as unread as the sixty were. **What did change is the entry's own
  opening**: *two guards read this stylesheet, and they read its text*. There are three now, and the
  third asks a matcher over a real document — `every-rule-this-sheet-paints-is-one-a-page-writes`
  establishes that every rule has something to paint. It still reads nothing about how anything is
  laid out, which is the entry. ADR-0197.

  **It is the class this repository has now paid for six times**, and ADR-0135 is the sixth: four
  defects a phone reader met on every visit, found by a sweep and repaired against readings taken by
  hand, with the eight suites green on both sides of the change. ADR-0134 was the fifth: the whole
  of it was decided in an inspector by the owner and settled by a browser sweep at nine widths, and the
  eight suites were green before the change, after the change, and would have been green had it broken
  every page in the tree. ADR-0132 was the fourth: five candidate arrangements were built in a browser
  and three were refused on readings no suite here could have taken — a `fit-content` column that
  answers *one contract* to a two-abreast list, a card whose void moves inside it, and a rail that would
  accompany 13.7% of a page. None of those is visible to a check that reads a string.

  **What would close it is a headless browser as a dev dependency**, which stage rule 3 admits only
  where the mechanism keeping a tool out of the product is executable — and both halves of that
  mechanism already exist, `files: ["dist"]` and `packaging/reachable.ts`. It is priced twice above, at
  the breakpoint entry and at the `start.ts` entry, and it is refused a third time here for a reason
  about *where* rather than about the price: **a unit repairing a layout is not where one decides to add
  a tool to the repository**, because the decision would be taken by whoever most wants the layout to
  land. ADR-0132.

  **It is demonstrated rather than predicted since `6aa90db`, and the demonstration corrected the
  claim.** Collapsing every page of the site to a twenty-pixel column *was* caught -
  `every-track-of-a-layout-is-a-fraction-a-floor-or-a-declared-length` reddened, because the collapse
  was typed as a length. Rebuilt out of declared lengths, which that guard admits, the same collapse
  passed **122 of 122** with every page rendering one character per line. So the entry is not that
  nothing reads the stylesheet: two guards do, and they read its *text*. What nothing reads is what it
  renders.

- **That what a linked-to element clears is the bar that is really above it.** The masthead is
  sticky, so an element scrolled to under it is one a reader followed a link to and cannot see -
  which is what nineteen destinations of two contract pages did at every width a phone has until
  ADR-0135. The repair ties the clearance to the bar by sharing its terms: the padding the masthead
  declares, and its content at the tallest that content gets. **One term of that arithmetic is data
  and not a length.** `--the-menu-at-its-tallest` is the most rows the menu wraps to between 280 and
  479, measured, and the menu's entry count lives in `theMenu` of `packages/site/chrome.ts` where
  nothing resolves it against the stylesheet. **This entry has now been wrong twice in the same
  place, and each time it was the count rather than the mechanism.** It read *3* and *a fourth
  destination* until ADR-0140 took the catalogue out of the masthead; it then read *the declaration is
  `1` and `theMenu` returns one entry, `How we verify`*, measured at `0986b70` — and at `cc231bf`
  `theMenu` is `(): readonly MenuEntry[] => []`, so the masthead offers **nothing** but the wordmark
  and the repository mark. Neither reading was stale prose about a mechanism that had moved; both were
  a number somebody transcribed, in an entry whose whole subject is that nothing resolves that number.
  **A second destination in the masthead still makes the clearance too short with no check saying
  so**, and the gap is now the whole declaration rather than one row. The failure is quiet by
  construction: the page is
  not broken, it is one row of navigation taller than the offset that was written for it, and only
  somebody following a link at a phone width would find out.

  **Re-read at `ccc9fca` this entry is unchanged, which is also a result**: `theMenu()` returns **0**
  entries and `--the-menu-at-its-tallest` is declared **1**, which is the reading above to the
  character — the first of the fifteen site entries re-measured by ADR-0193 to come back exactly as
  written. **What is worth adding rather than correcting is that the arithmetic gained a term.**
  `--the-sticky-bar` is now summed from `--the-field-at-its-tallest` as well as from the menu, so the
  declaration nothing resolves has **two** unresolved terms where this entry describes one, and the
  second arrived with the masthead's search field. ADR-0193.

  **The population is that one declaration**, and what would close it is not a lint: CSS cannot read a
  rendered height, so the two can only be compared by laying a page out. It is the ninth suite, priced
  four times on this list already, and this is the first entry whose closure that suite would make
  *cheap* rather than merely possible - the check is one line, *every address a page publishes clears
  the bar above it*, with no number in it. ADR-0135.

- **That a paragraph of prose has been read whole by somebody.** ADR-0112 makes it measurable: a
  paragraph has an author when one commit's blame covers every one of its lines, `npm run hands`
  counts them, and at `2385fc2`, over all 362 tracked sources, **32 paragraphs of 8 046 carry three
  hands or more**. Of the 22 in the three populations that unit swept, **nine needed rewriting and
  thirteen did not** — so the reading designates a zone rather than measuring a defect, and it is
  worth taking again but never worth acting on unread. **The population is every paragraph of prose
  this repository holds**, and nothing keeps it between readings.

  **A guard is refused rather than unbuilt, and the argument is the reflow.** `git blame` attributes a
  line to the commit that last changed it, so a commit that rewraps a paragraph returns it to one hand
  with the prose untouched — a check whose cheapest satisfaction is a whitespace change, which is a
  ritual and would be read as coverage. Its red event is the wrong one too: *somebody edited prose
  twice*, not *prose is defective*. What stands in a guard's place is that the reading is a **command
  and not a number in prose**, which is the treatment the `1.0.1` tree digest was withdrawn for
  lacking. It closes the day a reading's repaired-to-healthy ratio approaches *n* of *n*, at which
  point a refusal becomes arguable — against the reflow, which does not go away.

  **Two instances are left standing and named rather than swept up.** `mutation/census.ts` carries *A
  twelfth on the licence* and *A thirteenth on the narrowing*; `packages/registry/local-read-api.ts`
  carries *The third reader of one source*, which is true today and states its own population one
  paragraph below. Both are the rank defect the four vitest configurations were repaired for, and
  neither is in a population that unit swept.

- **That the spelling this product prints resolves wherever it says it does.** `renderImportLine` ended
  *the one spelling TypeScript and every bundler resolve* until ADR-0110, and that clause was wider
  than anything ever measured. It now claims only the TypeScript half, which is settled by a **total**
  reading — TypeScript offers three module resolutions and all three were read at `tsc` 7.0.2 — so the
  surface a user meets at every install no longer over-claims. That is the cheap half and it is done.

  **What stays open is the half that was taken off the surface rather than closed.** ADR-0110 read the
  layout against four bundlers — esbuild, vite, rollup and webpack, three distinct resolver
  implementations, chosen on weekly npm downloads rather than on convenience — and all four resolved
  it. **Four is not every.** Unread: rspack, Parcel, Bun, Deno, and every version of the four but the
  one measured. **The population is every bundler and every version of one**, which is unbounded, and
  that is the whole shape of this entry: it is a claim no amount of measuring can keep, which is why
  the repair was to stop making it rather than to measure further.

  What would close the part that *can* be closed is a suite that bundles the emitted layout with each
  resolver the way `packaging/against-the-origin/` performs a real install — a guard that reddens the
  day a bundler changes its mind, rather than a reading somebody took once. The price is named: a
  bundler apiece as a dev dependency, which stage rule 3 admits only where the mechanism keeping it out
  of the product is executable, plus a ninth suite that no battery replays and that no other suite's
  verdicts may depend on. Not built, and not urgent while nothing published says more than was
  measured.

- **That the bound the origin proof waits is one somebody measured.** A deployment returns before it
  has propagated, and part-way through a rollout the origin answers the catalogue index from one commit
  and a contract's bindings from another — at which point `toopo add` refuses, correctly, and the proof
  against the origin reddens with the product working.

  **This entry predicted the wrong failure, and it was refuted by observation rather than by
  argument.** It read *the day propagation exceeds it, CI is red with nothing wrong, which is the exact
  failure the wait was written to remove*. Measured at `d739337`: the bound was **never consumed** —
  the waiting line the pre-flight prints appears in neither of that commit's two run logs — and CI was
  red anyway, once in two runs. The pre-flight read one revision and returned on its first attempt; the
  installed client, seconds later, read the index from `d739337` and the implementations from
  `013f688`. **An agreement observed on one reading says nothing about the next**, and no reading taken
  inside the suite can be the client's, because the client is another process. The cause is the alias
  and not a cache: Cloudflare Pages makes a hash-based deployment address atomic and updates a branch
  alias to point at it, `toopo.dev` is that alias, and `CF-Cache-Status: DYNAMIC` on all three
  addresses says nothing was served from an edge cache. ADR-0108 replaced the pre-flight with a bounded
  retry of the chain, driven by the client's own refusal. **A prediction that observation refutes is
  replaced by what was measured, never by a second prediction**, which is why nothing above says what
  will fail next.

  **What stays open is what this entry always meant, with the prediction removed.**
  `THE_PROPAGATION_BOUND` is two minutes chosen against the cost of the step and not against
  Cloudflare. **It has readings and it has no population**, and the two are not the same thing. Both
  readings so far are of the retry firing on the real condition — the index from the old deployment,
  the bindings from the new — and both are the span from the client's first refusal to a finished
  chain: about **10.8 seconds** at `206190d`, and about **5.5 seconds** at `1048d89`. Neither is within
  an order of magnitude of the 120 seconds the bound allows.

  **Two readings do not become a population by being written down, which is why they are written as
  the pair they are.** A line per deployment would be a list nobody rebuilds and a figure nobody can
  check; what would close this is the same span over enough deployments to say whether 120 seconds is
  generous or lucky, and the retry records both ends of it on every run that waits, so the runs hold
  what a later reading would be built from. Not built, and the next reading is worth adding here only
  if it approaches the bound — which is the event this entry is actually about.

  **The same run refuted the repair nobody wrote, which is worth more than the figure.** Five seconds
  after the first refusal the origin answered *one* revision to this suite and the client refused
  again. A wait that ran the chain once as soon as the suite saw agreement would have been red there —
  and that is the shape the pre-flight had.
- **That the two things a publication depends on outside this repository are what this repository thinks
  they are.** ADR-0109 put `npm publish` in `suites.yml`, and four guards keep what a file can hold: one
  job publishes, it is gated by the suites, the branch and an environment, only it may mint an identity
  token, and no workflow hands npm a credential. **None of them can see the other side.** npm's trusted
  publisher holds four strings — organisation, repository, workflow filename, environment — and **three of
  them are things this repository can rename on its own**, at which point publication stops working with
  every guard green. Worse in kind: **npm's configuration carries no branch**, so the environment is doing
  work that looks, in the file, as though the condition were doing it. And the environment's own branch
  policy is a GitHub setting no file here states.

  **The population is those four strings and that policy**, and what would close the npm half is an
  authenticated read of npm's API compared against `ENDPOINTS`-style declarations of the two names this
  repository owns — the price being a credential on a runner for a question whose whole subject is not
  needing one, which is the same trade the entry below about `servedFrom` refuses and for the same reason.
  The GitHub half is cheaper and is not free either: whether a run can read its own repository's
  environment protection with the token this workflow carries has not been measured. Not built.

  **The two sides do agree, and that half is now measured rather than awaited.** This entry read *the
  first dispatch is what will say whether the two sides agree at all*; the dispatch was made and it
  published. Read at `2efc482` off npm's own record: `_npmUser` is
  `GitHub Actions <npm-oidc-no-reply@github.com>`, `dist.attestations` carries a
  `https://slsa.dev/provenance/v1` provenance, and `gitHead` names the commit. An identity token was
  minted, npm exchanged it, and the attestation was written — so the four strings and the environment
  policy were the ones this file claimed, on that day. **What is not closed is anything about tomorrow**:
  three of the four are still strings this repository can rename on its own, npm's configuration still
  carries no branch, and one successful exchange is not a mechanism. ADR-0111 did not touch any of the
  four, which is worth stating because it moved the trigger and could have.

  **A second reading exists, it was taken across the event most likely to have broken it, and it is
  stronger than the first in one specific way.** ADR-0124 reissued all 506 commits of this graph. Read at
  `f95c4fa` off npm's own record and off the attestation behind it, for `1.0.4` — the first release
  published after the rewrite: `_npmUser` is unchanged, `gitHead` is `f95c4fa` and `git cat-file -t`
  resolves it here, and the provenance names `refs/heads/main`, `https://github.com/toopohq/toopo` and
  `.github/workflows/suites.yml`. So the four strings and the environment policy survived a rewrite of
  every identifier in the history, and `event_name` reads `push` — ADR-0111's trigger, confirmed from the
  side this repository does not write.

  **What is stronger is that the provenance carries two identifiers and not only names.**
  `repository_id: 1319617655` and `repository_owner_id: 280416883` are stamped by GitHub and a rename
  does not move them, so an attestation already published goes on naming the right repository whatever
  this side is called afterwards. **That is true of the attestation and false of the configuration**: npm's
  trusted publisher is keyed on the four strings, three of which this repository can still rename on its
  own, and a rename would stop the *next* publication with every guard here green. Both halves are written
  because the entry read blacker than it is with only the first.

  **A third reading was taken at `1cf8ecd` for `1.1.0` and it is recorded in one sentence on purpose:
  the four strings and the policy held again, and that closes nothing.** This entry's own argument is
  that a successful exchange is evidence about a day and never a mechanism, so a fourth reading written
  out at length would be this file accumulating identical paragraphs against its own rule. **The one
  thing worth carrying forward is the instruction not to add a fourth**: what would change this entry is
  a way to read npm's side, not one more day on which npm's side was right.

  **Both sides were configured on 2026-08-17, and this paragraph is the entire record of it.** The
  trusted publisher on npmjs.com names `toopohq`, `toopo`, `suites.yml` and the `npm` environment, with
  `npm publish` as the permitted command and publishing access at its strictest setting; the GitHub
  environment exists and is restricted to `main`. **None of that was read from here and none of it can
  be** — it is reported by the person who typed it, which is precisely the shape of the one entry this
  list ever carried that no guard could have caught: a decision taken in conversation, with no half in
  the repository for the code to disagree with. So it is written down where the next session will meet
  it, and it does not make the entry above any less open. **The publication that followed is what turned
  that from a report into a reading**, and it is recorded one paragraph up rather than restated here —
  what a successful exchange establishes is that the four strings and the policy were the ones this
  paragraph claims, on the day it was written, which is exactly as much as one reading ever establishes.
- **That the gate on the publishing job is a conjunction.**
  `the-job-that-publishes-to-npm-is-gated-by-a-job-that-read-the-version` resolves both ends of the
  reference the gate makes — the `if` names a job's output, that job is waited for, and it exists — and
  it reads the condition's *content* and never its *shape*. **An `||` added to that expression leaves
  every guard green**, which is the plausible spelling of somebody widening the gate rather than of
  somebody attacking it. The population is the publishing job's condition. **It is priced low and
  refused on the price, not overlooked**: bypassing the version clause makes every push of `main` reach
  `npm publish` and be refused on a version that already exists, so the failure announces itself on the
  next push instead of publishing something wrong — which is the argument `CLAUDE.md` states for not
  writing a guard whose event is cheap. What would close it is reading the structure of the expression,
  and that means this file's YAML sweep learning what an operator is, on a repository that has no YAML
  parser and will not gain a dependency to hold one guard. ADR-0111.
- **That a browser does what a document says it does.** The entry this replaces was about the wiring
  and it is closed: `start.ts` exports four builders, `start.test.ts` runs each of them against a
  document, and W-122 to W-133 inject into a file that had never carried a cell. **What replaces it is
  narrower and cannot be closed by the same move**: the document is happy-dom's, and a second statement
  about the browser is what `start.ts`'s own header refuses for type declarations.

  **The population is six claims, each named rather than summarised.** That a real browser exposes
  `navigator.clipboard` at all — it wants a secure context and, in some browsers, a user gesture, where
  happy-dom's is unconditional. That anything reaches the operating system's clipboard. That a control
  is visible, laid out, or can be hit. That a browser fetches and executes this module at all. That the
  focus order a reader tabs through is this one — `focus()` succeeds here on an element a browser
  refuses. And that happy-dom agrees with a browser about any of the rest.

  **It is not the entry it replaces read again at a lower level.** That one said *nothing executes this
  file*; this one says *something executes it, and the something is not a browser*. The failure is quiet
  in a new way: a guard here is green because an emulator agreed with itself, and the only thing that
  would disagree is the engine nobody runs.

  **Where this looked**: `packages/site/start.test.ts`, whose header carries the same six; the
  `environmentOptions` of `packages/site/vitest.config.ts`, which is the whole of what this repository
  says to that emulator; and `THE_BROWSER_GRAPH` in `packages/site/browser.ts`, which declares what a
  page loads and has no opinion about what runs it.

  **What would close it is the headless browser three entries of this list already price and refuse**,
  and this is the first of them whose subject is behaviour rather than layout — so the day one arrives
  for a layout, it closes this too, and the trade should be taken knowing that. Priced there and not
  taken here.

  **The entry it replaces was false on four counts and its figures are corrected rather than carried
  forward.** It called the file *457 lines, of which 229 executable*, stamped at `17cc9bf`. Measured at
  `d0c8fe6` by a rule written down beside the answer — a line counts when, with block comments removed,
  what is left is neither empty nor a `//` comment — `start.ts` is **480 lines, 254 of them
  executable**, and `start.test.ts` is 478 and 249. The rule is stated because ADR-0157 published four
  readings of *executable text* over files that had not moved and none of them rebuilt the figure it
  was correcting. ADR-0157, ADR-0165.

  **Both files roughly doubled and the population did not move.** Re-read at `ccc9fca` by that same
  rule: `start.ts` is **815 lines, 425 executable**, and `start.test.ts` is **806 and 394**, over 18
  guards. The six claims are all still in the wiring suite's own header, named there as *a real
  clipboard, a secure context, a layout, a hit test, a tab order, and that a browser fetches this
  module at all* — so the entry is unchanged in what it is about. **What is wrong in it is a count**:
  `start.ts` exports **six** builders, not four — `copyControl`, `managerControl`, `themeControl`,
  `searchControl`, `playgroundControl`, `siftControl`. ADR-0193.
- **That every surface renders the invocation rather than the bare command name.** This one was met by
  a visitor rather than found by a sweep: the README and the four contract pages published
  `toopo add string/slugify`, which answers `command not found` for anybody who has installed nothing —
  the first thing a visitor does, and it failed. `THE_INVOCATION` is the one spelling measured to work
  in all three situations — nothing installed, installed globally, installed as a project dependency —
  and the README and the emitted pages now carry a guard apiece over their own surface.

  **The client's own screens carry none, and that is the open half.** Every one of those strings is
  converted in this tree; nothing stops the next one being written bare, and the reader it would fail
  is the one the `npx` path just made canonical. **The population is every user-facing string of
  `packages/cli/`.**

  **The half about the artefact closed, and the sentence that recorded it was false for four commits.**
  It read, measured at `f065a7f`, that `npx toopo list` answers `Take one out with toopo remove
  <domain>/<name>` because *npm serves `1.0.1`, which predates the conversion* — and it went on saying so
  after `2efc482` published `1.0.2`, which carries the conversion. That is this list's own recurring
  failure arriving on this list: a dated measurement with a present-tense clause beside it, where it is
  the clause a reader believes. **What made it a four-commit lie rather than a permanent one is that a
  publication now happens on a number rather than when somebody remembers**, which is the same event
  ADR-0111 was written for.

  What stays open is the population and nothing else: **every user-facing string of `packages/cli/`**.
  Every one is converted in this tree; nothing stops the next being written bare. What would close it is
  not a shape — no spelling of a string literal makes the bare form fail to compile, which is ADR-0054's
  other branch — but the validation stage reading this repository's own strings, already named twice on
  this list, already priced and already refused as a lint over prose.

  **What the two guards that do exist cost is worth recording, because both were narrowed by
  measurement rather than by taste.** Sweeping every occurrence of a command on the site went red on
  nine mentions, and sweeping every line beginning with one went red on four more — all thirteen mutant
  descriptions the method page publishes, where the command is the subject of a sentence and nobody is
  being told to run anything. So the site's guard is over the install command and recognises one by the
  fact that **it names a contract of this catalogue**, and the README's is over what sits inside a shell
  fence. Neither is a sweep for the word, and a rule that swept for the word would be wrong.

- **That a decision can name what confirms it, when what confirms it is a guard over every contract.**
  ADR-0001 requires `confirmed-by` present, and a guard is addressed by the pair `(suite, guard)`.
  **This entry read *present and non-empty* until ADR-0143 went and read the code**, which is rule 3
  of this section on the entry's own text: `declarationFaults` tests `governs` for emptiness and
  `confirmedBy` only for absence, ADR-0001 discusses an empty one as a legitimate state rather than
  forbidding it, and records carry `confirmed-by: []` legitimately. **The rank that stood here is
  gone rather than restated**: `nineteen` reproduces under no rule, and ADR-0158 read 21, 22 and 23
  depending on whether the literal is counted as a declaration in the front matter, as text anywhere
  in a record, or by occurrence — the loose readings counting ADR-0001, which discusses the empty
  form because it is the record that defines it. A number that moves whenever a record is added is
  one this sentence never needed, which is ADR-0018's first rule. Nothing about the sentence looked
  old; it was wrong on the day it was written, in the file whose subject is declarations that hold. `guardsCollectedIn` reads a guard's *written* title, so an `it.each` over the
  catalogue is collected as `…-%s`; `guardAddressFaults` requires a frozen identifier and `%s` is not
  one. **So a decision whose subject is per-contract has no citable guard at all**, and nothing says
  so — the author discovers it as nine faults from
  `every-guard-a-decision-names-is-one-its-suite-collects`, which reports that the suite collects no
  such identifier and not that the identifier could never have existed. Measured at `10abc40`: zero of
  the 105 records cite a parameterised guard, so the rule has been kept by accident rather than by
  anything. ADR-0105 folded four guards into one apiece and that was right on its own merits, which is
  exactly what makes this worth writing down: the collision was paid around rather than found. **The
  population is every guard written with `it.each`**, and what would close it is `guardsCollectedIn`
  expanding a parameterised title the way the run does — it already knows the folder, and `eachContract`
  is the only table the catalogue parameterises over. The price is that it stops being a plain read of
  the source and starts needing to know what a suite's rows are. Not built.
- **That a mutant a battery injects is the defect it describes, and not a compile error.**
  `mutation/check-anchors.ts` reads a cell's `find` text and requires it to occur once in its file; it
  never reads the `replace`. Found by ADR-0105 rather than reasoned about: `hashedFile` renamed two
  parameters, both affected anchors were updated, `npm run anchors` went to 0 loose — and I-01's
  replacement still read `readFileSync(join(directory, name))`, naming two identifiers that no longer
  exist. Injected, that cell does not typecheck, so it measures nothing and the anchor check says it is
  fine. **The population is every cell of every battery**, 586 anchors across 82 files at `e8f68ca`, and
  what makes it worth an entry rather than a note is that the failure is silent in exactly the tool
  built to prevent it. What would close it is not a second lint over the text: it is injecting each
  mutant and typechecking the tree, which the replay already does one cell at a time — so the cheap form
  is `check-anchors` learning to apply the replacement and refuse a result the compiler rejects, and the
  price is that it stops being a pure read of the working tree. Not built.

  **It is paid at every passage rather than one day, and two units in a row are what turned that from
  a prediction into a rate.** ADR-0127 moved a branching link expression out of `catalogue-page.ts`
  and `W-64`'s `replace` went on quoting it; ADR-0129 reformatted an import in the same file and
  `W-53`'s `replace` went on quoting the single line. Both were moved by hand, and in both cases what
  reported anything at all was the *other* half — the `find` — so neither would have been seen had
  the quoted text alone still matched.

  **What that changes is what a reader does with the entry and not whether it closes.** It was
  written as a possibility with a price beside it, which is the shape of an entry somebody acts on
  the day it fires. Two instances in two units make it a **cost every unit touching anchored prose
  pays**, and an entry that charges at each passage is treated before one that would charge once.
  The rate is two of two units and the population is unchanged: every cell of every battery.

  **A third unit paid the neighbouring cost and not this one, and the two are worth telling apart.**
  ADR-0130 moved two renderings into a module of their own and `W-49` and `W-54` stopped applying -
  reported by `npm run anchors`, because it was their `find` that no longer matched. Their `replace`
  halves were untouched and still apply. So four anchor failures in three units, of which **two are
  this entry** and two are the tool doing its job. A count that folded all four together would make
  this read as twice the rate it has, on an entry whose whole subject is a failure nothing reports.

  **The third instance arrived from the other direction and it is the sharpest, because nothing moved
  at all.** `number/parse@1`'s `N-4` drops the second look that tells a separator mistake from text
  that is not a number, and `withoutSeparators` is read on that line and nowhere else; the mutant was
  correct until `9158603` turned `noUnusedLocals` on, and became a tree that does not compile without
  a character of it changing. **It read `killed-by-typecheck` where it is pinned `survived`**, which
  is a detection nobody made: measured at `00b8cbd`, the blinded column is **122 passed, 0 failed** and
  one `TypeCheckError` either way. So the failure is not only silent, it can be *loud in the wrong
  direction* - a cell that looks caught. The battery's own header had recorded the same hazard for its
  three cache mutants, in as many words, and nothing generalised it. ADR-0200.

- **That a change is answered by every battery that could say something about it.** The gates of
  ADR-0146 answer it for the folder a change touches and for the battery file it edits, and that is
  the only cheap rule there is. Measured at `66cdb3f` over every tracked `.ts`, folder by folder,
  source edges and test edges together: `packages/cli`, `packages/registry`, `packages/site`,
  `packages/validation`, `packaging` and `mutation` are **one strongly connected component**, each
  reaching every other transitively in both directions. **The transitive closure of any one of them is
  all of them**, so an import-following selection selects everything on every push, which is not a
  selection.

  **Two populations now, and they fail differently.** A guard reddened from a neighbouring folder is
  bounded by the second gate, which is to say by the cadence of publication rather than by *never*.
  And `packages/catalogue/every-contract.ts` is reached by every injection folder and injected into by
  none, so it is at once where the rule answers *no battery* and where an edit reaches furthest.

  **That sentence has fired, and what the cadence was worth is five days.** `9158603` turned on
  `noUnusedLocals`, which reddens the **unmutated** control of two blinding lenses: a lens removes a
  declaration and the flag then makes what it orphaned a `TS6133`. Measured at `05a193c`, the first
  full replay since - `array-group-by`, `string-levenshtein` and `string-slugify` throw during
  calibration and `number-parse` disagrees on one cell, so **four batteries of twenty-three could not
  be measured at all**. Every gate was green throughout: the push gate selected **ten** batteries on
  `9158603` and all ten passed, because the selection follows folders and `tsconfig.json` is in
  nobody's; `every-battery` was `skipped` there and on every run since, there having been no
  publication since `1.1.0`; and `git merge-base --is-ancestor 9158603 1cf8ecd` answers 1, so the last
  all-green matrix predates the flags. **It is not a guard that cannot fail - it is the instrument
  unable to run**, which is the same blind spot one level up, and nothing but a full replay could
  report it. ADR-0199.

  **The four are repaired and this entry is not closed by that**, which is the distinction to keep:
  ADR-0200 removed the breakage, and the selection, the matrix and their cadence are untouched, so a
  change to a root file still selects no battery and the full matrix still fires only before a
  publication. What five days bought is a repair; what would close the entry is a decision about what
  a battery matrix runs on, and that decision is nobody's to take as a side effect. ADR-0200.

  **The third closed, and what it was is worth more than that it closed.** It read *the shared modules
  of `mutation/` - `run.ts`, `published.ts`, `mutants.ts`, `attribution.ts`*. One name too many and
  three missing: `published.ts` is on no battery's execution path, because `measure.ts` resolves its
  battery through a templated `import()` and never reads `THE_BATTERIES`; `census.ts`, `measure.ts` and
  `paths.ts` are read by every run and were named nowhere. **Nothing had derived that list** - it was
  written from a reading of what the instrument looked like, which is rule 3 of this section arriving
  on an entry of it. What replaces it is a declaration a walk refuses to disagree with. ADR-0149.

  **`packages/catalogue/` narrowed by one file at the same time.** `identifier.ts` is read by every run
  and is answered for; `every-contract.ts` is read by the contract suites and by no run, which is why
  the entry above names the file rather than the folder now.

  **It is not hypothetical and it arrived inside the closure's own demonstration**: replaying the push
  `bc88230..7c9906c`, seven of its twenty changed files selected no battery, and two of them are
  `mutation/census.ts` and `mutation/published.ts`.

  **What is done rather than declared is that the selection prints what it passed over**, and a guard
  keeps it printing - so the gap is in a reader's face on every run instead of being a paragraph here.
  What would close what remains is a selection that follows what a folder is *reached by* rather than
  what it contains, which `sharedHarnessOf` already does for one contract's harness and which is a unit
  of its own. Priced there and not taken.

  **One residue is declared rather than closed, with its measurement.** `mutation/census.ts` is read by
  every run and selects nothing, because it is a table keyed by suite file: a row of it moving is
  already addressed to a folder, and repairing that in the selection would put the correction in the
  mechanism beside the one that has the defect. Measured over the 43 pushes from `694a7a6` to
  `341f86c`: 13 touched it, 12 needed nothing, and `7c9906c` left `validation-stage-1` unselected. Its
  cause recurs - a guard written with `it.each` over the catalogue changes count when a contract is
  published, in files nobody edited - so it belongs to the entry above about a parameterised guard
  having no citable address. ADR-0149.

  **A cost rather than a hole, and it is new.** `seedsAreFrozen` is false by decision, so a pin is
  checked against one draw wherever it runs; twenty replays a day is twenty times the draws, and a thin
  pin will redden a healthy tree more often than it does today. **The asymmetry is what to plan for**:
  a draw on the first gate is a red somebody re-runs, and a draw on the second is a publication that
  waits. ADR-0146 carries the criterion that classifies one. **It is now two pushes in forty-three that
  pay a full replay rather than none**, which is where that cost first arrives in fact.

- **That the deployment waits for what the instrument says about the commit it deploys.** It does
  not. Measured at `92d0d5b` on run `33309448227`, watched while it ran: `site` reported success
  while `batteries (site)` was still in progress. Read in the file: `site` declares
  `needs: [suites, suites-on-windows]` and `batteries` declares `needs: [suites, which-batteries]`,
  so the two are siblings — **a red battery does not un-deploy anything**, and nothing rolls a
  deployment back.

  **The asymmetry is with npm and it is deliberate there**: `publish` declares
  `needs: [site, version, every-battery, every-battery-on-windows]`, so an irreversible act waits for
  every battery and a revertible one does not. That may be exactly right — a page can be redeployed
  from the next commit and a published version cannot — but **it is a reading of two `needs` lines
  rather than a decision anybody took.**

  **Where this looked**: ADR-0146, which decides *which* batteries run when — *on every push, the
  batteries that can say something about the change; before a publication, all of them* — and says
  nothing about what the deployment waits for; the comment above `site:` in `suites.yml`, which
  argues at length why that job waits for the Windows suites and does not mention batteries at all;
  and ADR-0109, which puts `publish` behind `site` and is about the publication.

  **The population is the four `needs:` lines of `suites.yml`**, and it grows with each job. What
  would close it is one sentence in the record that decides it, either way — and if the answer is
  that a battery should gate the deployment, it is a `needs` edit and a minute of critical path per
  push. Priced and not taken, because deciding what a deployment is worth is not a unit about a page.
  ADR-0146.

- **That a push of `main` whose run was superseded is answered by any battery.** `cancel-in-progress:
  false` protects the run *in progress*; the pending half is `queue`, absent here and therefore
  `single`, so a queued run of `main` is cancelled and replaced by the next push. Measured: run
  `33970943153` sat pending with **nought jobs**, `33972213437` was created at `14:34:25Z`, and the
  first was cancelled at `14:34:26Z`, while the run actually executing was untouched by both.

  **It reaches no irreversible act, and the reason is not the concurrency line.**
  `print-whether-to-publish.ts` computes `!held.has(declared.version)` — npm's listing against the
  manifest on disk — so a superseding push carries the same unpublished version forward and publishes
  it. The publication is deferred by one run and never lost, which is ADR-0111's own argument for
  refusing the proxy *did this commit move the number*, arriving on a cause that record did not name.

  **What it does reach is the battery selection, and that half is silent.** `which-batteries` is a
  diff from the push's base, so the batteries owed to a superseded push are chosen by no run. The
  instance is this entry's own unit: `12c9fee` moved `packages/site/`, `mutation/site.battery.ts` and
  `mutation/census.ts`, the diff to `4674b09` is `docs/` and `CLAUDE.md`, and cell `W-179` has been
  replayed by nothing. **`every-job-answered` cannot see it**: a superseded run has no jobs, so that
  guard is not among them — it is total over the jobs of its own run and blind by construction to a
  run that never had one.

  **Where this looked**: the `concurrency` block of `.github/workflows/suites.yml`, whose paragraph
  claimed the protection covered every run of `main` and now says which half it covers;
  `mutation/selection.ts`, which takes the base from the push and has no way to know a push was
  skipped; and `mutation/every-job-answered.ts`, whose population is the jobs of the run it runs in.

  **The population is every push of `main` that arrives while a run of `main` is queued.** What would
  close it is `queue: max`, which GitHub offers for exactly this and refuses beside
  `cancel-in-progress: true` — the value the expression here takes on every branch — and whether that
  refusal reads the expression or its value cannot be measured without moving the configuration and
  pushing. Priced and not taken. **What is done instead is a convention with nothing under it**: do
  not push to `main` while a run of `main` is queued. It is bounded by `every-battery`, which a
  publication waits for whatever the per-push selection did. ADR-0111, ADR-0146, ADR-0222, ADR-0236.

- **That the bound a battery runs under is one anybody compared with what a battery costs.** The two
  ubuntu gates declare `timeout-minutes: 40`, and the share the slowest job consumes is written beside
  them by hand: 1 649 s against 2 400 is 68 %, computed by a reader and by nothing else. It is a dated
  number in a present-tense sentence, which is the class the section above this list refuses in as many
  words - and this instance is inside `.github/workflows/suites.yml`, which is the file a suite exists
  to keep.

  **The failure is loud and uninformative rather than quiet, and that is what makes it an entry rather
  than a note.** A battery that grows past the bound is not wrong, it is killed: the job reports a
  timeout, every cell it had measured is thrown away with the process, and on the second gate that is a
  publication that stops with no verdict at all.

  **This entry read *nothing before that moment says the margin was thinning*, and ADR-0169 says it -
  for one battery, in prose, kept by nothing.** `mutation/cli-install.battery.ts` now carries what a
  cell there costs on each of the two runners it is measured on, 20.3 s and 27.1 s, with the margin in
  cells beside it; and the Windows bound is derived in `suites.yml` from six readings rather than
  chosen. So the clause is corrected rather than struck: what is said is said in the one place a reader
  adding a cell to *that* battery arrives at, and the twenty-two other batteries are exactly where they
  were. **The asymmetry it exposed is the thing to carry**: a cell is 1.33 times dearer on the Windows
  leg, so two bounds that run out together today do not stay level, and nothing recomputes either.

  **Where this looked**: `mutation/workflows.test.ts`, whose guards read what that file may *hold*
  - a pinned digest, the publishing gate, the identity token - and not one of which reads a duration;
  `THE_LONGEST_A_RUN_MAY_TAKE` in `mutation/run.ts`, which bounds one cell at 600 s and is related to
  the job's own bound by nothing; and `mutation/selection.ts`, which decides which batteries a push
  answers for and never how long they may take.

  **The population is the `timeout-minutes` declarations of `suites.yml` and the cell bound beside
  them** - measured at `d6bb188`, the two ubuntu gates at 79, the Windows suites leg at 20, the Windows
  battery leg at 57 and the answering job at 5 - and it grows by one with each gate. **Three of the five
  are derived and two are typed**, which is a narrowing rather than a closure: each derivation was
  performed by a person, and re-running it is as unkept as reading the typed ones. **ADR-0222 moved the
  two ubuntu gates from 40 to 79 and added the fifth**, so the paragraphs below describing them as typed
  at 40 are ADR-0169's reading and not this one.

  **The derived one now measures the cost of the typed ones, which is the sharpest form this entry has
  ever had.** Over ten readings of `cli-install` the Windows bound re-derived itself three times and had
  its *form* replaced once, holding about 41 cells of margin, while the ubuntu gates stayed at 40 and
  their margin fell **42 to 41 to 38 cells**. Nobody decided that. It is the same battery, the same
  window, and the only difference is that one number is computed from a reading and three are typed. What would close it is a job that reads the battery matrix's own
  durations through the Actions API and refuses a share of the bound. **Its price is three things and
  the third is the one worth reading twice**: the workflow's token would gain `actions: read`, against a
  file whose whole argument is that permission is `contents: read` with exactly one job widening it; a
  job cannot read its own duration, so it is one more job after every matrix; and it needs a share to
  refuse at, which is a hand-written number - this entry, one floor down. Priced and not taken.

  **What is cheap and is done instead is that the arithmetic now sits beside the number.** The second
  gate's comment carries what a contract adds - 36 guards to the registry suite, 56 s, 3.3 cells - and
  what actually spends the bound, which is cells and not contracts. A reader who re-reads the 68 % has
  the law rather than a memory. It still does not compute it. **And a second cheap half arrived with
  the Windows legs**: one bound now shows its own derivation, and the battery it bounds says what a
  cell costs where somebody adding one reads it. Neither is computed either. ADR-0162, ADR-0169.

  **The entry stopped being a prediction and became six occurrences, and what let them stand is not the
  number.** Measured over the last twenty-two runs of `main`: `batteries (registry-storage)` was killed
  by the 40-minute bound on `1238833`, `cc7b64b`, `870354a`, `94458f4`, `46a8a9f` and `3078f81`, each at
  40 min 16 s to 40 min 20 s, and its last completion is `6d03933` at **39 min 49 s** — eleven seconds
  under. **The five pushes in between are the prose commits of ADR-0215 to ADR-0220**, where the
  selection chose no battery at all and the runs carry ten jobs, so `batteries (registry-storage)` was
  *not launched*: the record is not six cancellations among greens, it is that **the battery has not
  completed once since `6d03933`**. **Nothing reddened because `cancelled` is not `failure`** — a job
  killed by its own bound reports `cancelled`, the run concludes `cancelled`, and a reader looking for a
  red finds none. That half is closed: `every-job-answered` waits for every job of the workflow, runs
  `if: always()` rather than `failure()` because a cancelled job produces no failure, and refuses any
  result that is neither `success` nor `skipped`. Seen green on a runner where twenty-three batteries
  answered and **red on one where a one-minute bound killed a battery**, printing `batteries:
  cancelled` — the matrix parent, because that is what `needs` aggregates. **The limit is the host's
  and is stated rather than smoothed**: that run concluded `cancelled` and not `failure`, one job
  having failed and one having been cancelled, so **the gate makes a red job and cannot make a red
  run** — a reading over job conclusions sees it and a reading over the run's own conclusion does not.

  **And the bound is derived, which took a throwaway branch because every reading of it was censored.**
  A killed job says *at least forty minutes* and nothing more, so taking an uncensored one needs the
  bound raised and raising it is what the reading is for. Measured at `6203758`, a commit `main` does
  not reach and the annotated tag `evidence/the-bound-and-the-silence` retains, under a provisional 75:
  **`registry-storage` is 3 887 s**, 64 min 47 s against a bound of forty — and what crossed it is
  measured, `6d03933` having completed at 2 389 s with the **163** cells ADR-0210's replay left where
  the battery now holds **230**. **`max/median` over its own readings answers 1.809 and is a trap**,
  its median being a reading of a battery two thirds today's size, so the ratio measures the growth
  rather than the runner; the short batteries are that trap inverted, `string-levenshtein-spec`
  answering 1.529 over a job of 34 s. So the spread is taken where the work did not move, and **that is
  one battery**: `mutation/site.battery.ts` and `packages/site` both have **zero commits** over the
  twenty-two runs read, so its five readings are five readings of identical work and answer **1.042**.
  The bound is **3 887 × 1.042 + 41 cells × 16.9 s = 4 743 s, which is 79 minutes** — one term measured
  and one a convention said out loud, 1.22× the measured job with fifty cells of margin, and 79 rather
  than 80 so that it carries its own arithmetic in its digits.

  **What stays open is what this entry has always been
  about** — the bound is still a number a person derives on the day they think to, and the job that
  would read the matrix's own durations and refuse a share of them is still priced above and still not
  taken. ADR-0222.

- **That the reading of who has read this repository's prose is one anything executes.** `npm run
  hands` is in no workflow, and this is the half of the entry ADR-0152 did not close. It is not the
  guard's half: `hands.test.ts` is collected by `mutation/vitest.config.ts` and `npm run meta` is a
  step of `suites.yml`, so the guard over the reading runs on every push. **The two were one entry
  until the closure separated them**, and the sentence that joined them - *the narrowing is seen by no
  suite, no gate and no battery* - was a true measurement with a conclusion about another population
  beside it, which is exactly what this section's rule 3 is for.

  **What nothing executes is `readHands` and `renderHands`.** The guards reach `proseOf` and `handsOn`;
  `every-paragraph-a-reading-reports-is-attributed-to-a-commit` reads one file, so a blame that failed
  to parse on a different file would surface only in the command. **The population is those two
  exports.**

  **It is priced and refused rather than unbuilt.** ADR-0112 refuses a guard over hands, its cheapest
  satisfaction being a reflow, so a job running the reading is either a step nobody reads or the guard
  that record refused - for 438 `git blame` child processes per run. What would close it is a decision
  about whether a reading nobody runs is worth a job, which is the question the entry about `npm run
  hands` being a command and not a number already asks one floor up. ADR-0152.

- **That a guard total over a declaration is total over what the declaration is about.** The guard
  that closed the entry above it is total over the reading's five **populations** and never over its
  files, so a narrowing of `trackedProse` that keeps one file in each of the five passes. **The
  thinnest is `prose` at three** - `CLAUDE.md`, `CONTRIBUTING.md`, `README.md` - measured at
  `879ac08`, so dropping the other 151 Markdown files while keeping those three is invisible to it.
  The number is here rather than *it does not see everything*, because the second is not a
  measurement.

  **The failure is quiet by construction and the shape recurs**: a declaration is a good expectation
  exactly insofar as its rows are hard to satisfy by accident, and nothing here reads how thin a row
  has become. `THE_DECLARATION_LEFT_TO_ITS_OWN_ROWS` one folder over has the same property and has
  never been asked it either.

  **What would close it is a claim about files rather than about populations**, which is the thing
  this repository has no second statement for - the three candidates ADR-0152 refused are refused for
  the same reason at any granularity, and a fourth is not in sight. Written down rather than priced,
  because there is nothing yet to price. ADR-0152.

- **That the witness the end-to-end claim now has is one the code earns rather than the catalogue.**
  The entry this replaces asked for a mutant and ADR-0148 wrote it: `I-65` re-encodes a source in
  Latin-1 after reading it as UTF-8, `the-served-bytes-are-the-committed-bytes` reddens on seven
  files, and the three unit guards stay green - measured at `8b6aa89` on a checkout `git ls-files
  --eol` reports as 454 files `i/lf w/lf`, with the control green at 407 tests. **What nothing keeps
  is the ground it stands on.** Its teeth are the files carrying a code point in **U+0080-U+00FF**,
  and this catalogue has three of them across two contracts: the `±` of `date/add@1`'s summary and
  nine of `string/slugify@1`'s fifty-eight. `string/levenshtein@1`'s single `U+1F600` is above U+00FF
  and is already a `?` after one pass, so it survives the second unchanged and witnesses nothing.

  **The population is those three code points**, and the failure is quiet by construction: a contract
  whose harness lost its last Latin-1 supplement character would take a pin with it, nothing would
  look wrong, and only a replay would say so. **If the catalogue were pure ASCII the mutant survives
  and the guard is back where ADR-0145 left it** - so what was bought is a witness resting on what the
  catalogue happens to contain rather than on a property of `servedBytes`.

  **A second half, narrower and named rather than folded in.** `a-blob-answer-hashes-to-its-address`
  has two halves and the guard is named after the dead one: `addressedBy === file.sha256` compares two
  evaluations of one expression on one file, so **no edit to `servedBytes` can separate them** - 0 of
  47 files, measured. What has teeth is `servedBlobFaults` beside it, which applies that expression
  twice and therefore reads idempotence. Whether the named half is dead under *everything* reachable
  is a different sentence and it is open: it can only differ if the record's path-to-digest
  association is wrong, and **I looked at `harnessOf`'s single `map` and found no plausible mutant,
  which is not the same as none existing.** Four blob addresses stay in the region for the same
  arithmetic - the four contracts carrying no code point in that range.

  **What would close the first half is not a guard**: nothing can require a catalogue to keep a
  character. What would close it is a mutant whose teeth are independent of what the contracts spell,
  and the search that produced `I-65` says where it is not - the three unit guards constrain
  `servedBytes` completely on ASCII, so any such mutant must break something other than the bytes.
  Priced as its own unit and not taken. ADR-0148.

- **That a published count carries its coordinates.** ADR-0018 is the rule this file invokes more than
  any other, in three clauses: a sentence that can be true without counting does not count; a count
  that survives carries the commit it was measured at and the population it counted; and a dated
  number followed by a present-tense claim publishes a truth and a lie in one sentence. **Its
  `confirmed-by` is `[]` since ADR-0189**, its only guard having been a method-page guard that went
  with the page.

  **One clause is held mechanically and it is not the main one.**
  `every-figure-in-the-readme-is-the-one-the-instrument-declares`, in the meta battery, resolves the
  figures that page publishes against `theMeasurement()` — so a **derived** figure is at its
  coordinate by construction and never needs stamping, which is the third clause with no prose in it.
  It fired twice in one day at ADR-0188 and ADR-0189, naming all three README figures both times
  rather than the one somebody would have remembered.

  **What nothing holds is the main clause: a transcribed figure carrying its commit.** That is every
  stamped number in every record, every count in this file, and every figure in a comment — and the
  failure is silent by construction, because a number that has gone stale reads exactly like one that
  has not. ADR-0018's own Context says its four instances were *found by rereading rather than by any
  guard*, so the record never claimed otherwise; what changed is that it no longer names a guard that
  suggests it did.

  **Where this looked**: `mutation/readme.test.ts`, which is the one guard resolving a published
  figure against what produced it, and which reads one page; the fault functions of
  `mutation/decisions.ts`, none of which reads a figure in a record; and `mutation/history.ts`, whose
  sweep over this file is for commit identifiers and refused addresses rather than for the numbers
  beside them.

  **The population is every count this repository publishes in prose**, and it grows with every
  measurement anybody writes down. What would close it is the thing several entries here already name,
  price and refuse — a validation stage reading this repository's own strings — and this is the first
  of them whose subject is a *figure* rather than a name, which is the half of that stage nobody has
  costed. ADR-0018, ADR-0189.

- **That a count of this site's own pages is one somebody took.** The stylesheet's header said *seven
  pages served once each*; at `81bf9bc` the generator wrote **ten** and the tree held **eleven** files
  of HTML with the 404. It had been wrong since ADR-0121 added three domain pages, and it did real
  work: it is where the figure that opened that unit came from, and the session that read it planned
  against eleven and then twelve before counting. **It has drifted again since, in the same direction**
  — at `ab2765c` the emission reports **13 pages** and the tree holds **14** files of HTML — which is
  what an entry about a number nobody keeps is for. **The population is every statement of a page count in this
  repository**, and it is not small — `seven pages` occurs fourteen times across ten files, `eight
  pages` once in the stylesheet's own measure paragraph, `ten pages` once here. Most are stamped
  measurements inside records, which do not drift by rule; the two that made a present-tense claim
  are repaired, and the rest are named here rather than swept, because sweeping a record's dated
  reading would falsify it. **What closes it is the form and not a number**: a sentence that can be
  true without counting does not count, which is what the stylesheet's header now does. What nothing
  keeps is that the next one written will reach for a number again, and the executable form is the
  validation stage reading this repository's own strings — already on this list, already priced,
  already refused as a lint over prose.

  **It has drifted a third time, the other way, and the population is bigger than any reading of it
  has been.** At `ccc9fca` the emission reports **7 pages** and the tree holds **8** files of HTML,
  the 404 being written by `thePublication` rather than by `theSite`. Swept over every tracked `.ts`
  and `.yml` **with runs of whitespace collapsed** — which is the rule, and which the line-by-line
  form misses, because the phrase straddles a line break inside a comment: **20 statements of a page
  count across 14 files**, of which **11 are stamped or historical and 9 are present-tense and false**
  — `packages/site/browser.ts`, `font.ts`, `playground.ts`, `playground.test.ts`, `start.ts` twice,
  `start.test.ts`, and `mutation/site.battery.ts` twice, the last of those being a mutant's own
  description text. They say *nine of the thirteen pages never fetch this module* where it is **one of
  seven**, *inlined into all seventeen pages* where it is **eight files of HTML**, and *the four
  builders safe on all thirteen pages* where `start.ts` exports **six**. They are measured and not
  repaired: a re-measurement that also repairs cannot say which of the two moved the figure.
  ADR-0193.

  **They are repaired, and rebuilding the sweep moved every part of the answer above.** The rule was
  restated rather than relayed — the `*` leading a continuation line is removed *before* the
  whitespace collapses, because otherwise `the nine\n * pages` collapses to `the nine * pages` and no
  sweep for the phrase can see it. Measured at `e80b5fc` over 306 tracked `.ts` and `.yml`: **33
  statements across 23 files**, of which **14 were present-tense and false**, against 20 and 9. The
  difference is scope, declared rather than discovered: this rule also takes counts of *subsets* of
  the site's pages and the three spellings of `files of HTML`. **Two of the fourteen are in files the
  earlier reading did not name** — `pages.test.ts`, which opened on *five, four and three* pages and
  said **The one page that is not about a contract is named here** four paragraphs below, in the same
  comment; and `marks.ts`, which said *Two pages take it now* and named the method page ADR-0189
  retired. **The premise about the mutant was refused by measurement**: nothing reads W-116's
  description, because `killed()` carries no `onlyOn` and `published.ts` reaches the field only for a
  survivor or a platform cell, so correcting it changed nothing the instrument prints. **The entry
  does not close**, because nothing keeps the class and the fourteen repaired sentences are present-
  tense counts of a tree the next redesign moves. What is named and deliberately not written is the
  rule that would close it: *a count in a present-tense sentence is deleted where the argument
  survives its removal, and carries its commit where it does not*. The deferral argument in
  `browser.ts`, `playground.ts`, `playground.test.ts` and `start.ts` is the first shape and
  `font.ts`'s eight-and-seven is the second; **no rank is published over the two**, because which of
  them a sentence is is a reading rather than a measurement. Stamping the first shape instead of
  deleting it would publish ADR-0018's own dated-number-beside-a-present-clause in new places.
  ADR-0195.

- **That the catalogue this file names is the catalogue the registry holds.** `theCatalogue` knows how
  many contracts there are; the sentence above naming them is prose, and nothing compares the two.
  Measured: this file read **The catalogue is six contracts** for the two days between
  `object/deep-equal@1`'s publication and `474d453`, four hundred lines below a sentence of its own
  saying the seventh was published, with every suite, the typecheck and the whole meta suite green
  throughout.

  **It is the neighbouring entry's class over a different population and it does not close where that
  one closes.** A page count can be written out of existence — *a sentence that can be true without
  counting does not count* — and a roster cannot: naming the contracts is the paragraph's job, and
  the count is the part of it a reader believes.

  **The obvious guard is dead and that was measured rather than assumed.** *Every contract of the
  catalogue is named in `CLAUDE.md`* is total over the catalogue, which is the direction this
  repository prefers, and at `3daae2f` all seven were named — `object/deep-equal@1` twice — so it
  would have been **green on the day the roster said six**. What it would take is a guard that finds
  the roster *sentence*, which couples a check to where a paragraph sits, and this file has refused
  that coupling every time it has been priced.

  **Where this looked**: `theCatalogue` and `eachContract` in `packages/registry/the-catalogue.ts`;
  the guards of `mutation/decisions.ts`, which resolve what a record names in both directions and
  read no prose of this file; and `mutation/history.ts`, whose sweep over this file is for commit
  identifiers and refused addresses.

  **The population is every statement in this repository of how many contracts exist**, and what would
  close it is the same thing four entries here already name, price and refuse: a validation stage
  reading this repository's own strings. ADR-0163.

- **That a set of examples is not narrower than what the contract it illustrates settles.** ADR-0120
  states the rule and refuses the guard in the same breath, and the refusal is the part worth
  re-reading before somebody writes the guard anyway: the proposal was to sweep Unicode ranges, which
  is mechanical and cheap, and **it would have been green on the defect that motivated it**. Two of
  `string/slugify@1`'s four use cases were French; the set already carried `日本語テキスト`, so a sweep
  over writing systems sees three Latins and one Han and has no opinion. Three languages in one script
  are three languages. The stronger form — one example per language — is the heuristic the script
  proposal existed to avoid.

  **The population is every set of examples the catalogue publishes**, which today is four use cases on
  one contract and is four per contract on five when the other three are written. Each example on its
  own is verified: `every-use-case-replays-through-the-stripped-artefact-a-browser-runs` executes the
  call and compares the answer. **What nothing reads is the set as a set.** It closes where two entries
  above it close, in a validation stage reading a submission's own strings, already priced and already
  refused as a lint over prose.

- **That the revision an installed client records is a commit this repository holds.** A lockfile
  carries `servedFrom`, and the proof against the origin asserts its *shape* — forty hexadecimal
  digits — and reports its value without resolving it. That is deliberate and it is the cheaper half of
  a real trade: a clone legitimately behind the deployment does not hold a commit the origin already
  serves, so resolving against the local graph would be red on an ordinary state. **What it leaves open
  is that an invented revision passes** — an origin serving `0000…0000`, or a commit of somebody else's
  repository, is indistinguishable here from one serving the truth. The population is every revision a
  served answer declares. **What would close it is a resolution against the remote rather than against
  the clone** — `git ls-remote`, or the forge's API — and the price is named rather than waved at: one
  more network dependency inside the single guard whose whole difficulty is already that it has one, and
  a private repository, which means a credential on a runner for a question that stops being private the
  day the repository is public. That is the event to write it against, and it is why it is not written
  now. ADR-0104.

  **That event has happened and this paragraph did not notice, which is rule 3 of this section on an
  entry that names its own trigger.** `gh repo view --json visibility` answers `PUBLIC`, read at
  `341f86c`. So the half of the price that was a credential is gone, and what remains of the refusal is
  the network dependency alone. It is written here rather than acted on - the entry is somebody's to
  take with the reading in front of them, and this is not that unit. **It also moves an argument two
  entries up**, where the npm trusted-publisher entry refuses its own reading *for the same reason*:
  that reason is now one reason rather than two, in both places.
- **That the bytes an archive installs are the catalogue's own bytes**, which is the third of the three
  guards ADR-0092 lost and the one ADR-0104 did not bring back. The other two returned, one of them
  stronger; this one was refused rather than approximated, because comparing what a real install wrote
  against `contracts/` on disk would be red with nothing wrong — the origin serves the last *deployed*
  commit and the working tree is HEAD, and the two differ on every unit that touches a contract. What
  stands in its place is the arithmetic half: the installed bytes are compared against the digest the
  registry announces, read independently of the client that installed them. **So what nothing keeps is
  that the digest names the catalogue's own bytes**, which is the registry's single believed step
  arriving one floor down. **It closes by rebuilding `contracts/` at the commit `servedFrom` declares**
  and hashing the file the announcement names — the shape `packages/registry/rebuild.ts` already has for
  a binding, applied to one file instead of a ledger. **Priced as an order and not as a figure**, which
  is all the method supports: that module checks a commit out under `.rebuilt/` and runs that commit's
  own `ledger` script, so it is minutes where the whole proof beside it is seconds. It is the one entry
  here whose closure would cost more than everything it sits next to, and it is not built.
- **That no file of the tracked tree names the machine it was written on.** The sweep before the first
  push established it and nothing keeps it. **The population is the tracked tree and never the graph**,
  and that is the whole shape of this entry rather than a detail of it: measured at `efb26d1` over
  `git rev-list --objects --all`, seventeen blobs and one commit message carry a developer's home path —
  fourteen of the blobs `CLAUDE.md`, two `mutation/paths.ts`, one `vitest-entry-point.ts` — while HEAD
  carries none, every occurrence having been elided by hand as it was noticed. So a reading over the
  graph would be red the day it was written, and **those seventeen are what this entry will never
  cover.** Taking them out costs a second `filter-repo` over four hundred commits, and that was priced
  and refused knowingly: a folder path is not harvestable the way the address ADR-0095 removed is, and
  the given name it reveals is already published by `LICENSE` and by the second line of every file the
  five contracts published under `a-copyright-beside-the-marking` install. **ADR-0190 took two surfaces
  off that list and the argument came out stronger rather than thinner**: the manifest and the
  `decision-makers` of 189 records were the two that a release or an edit could withdraw, and the two
  that remain are the two nothing can — `LICENSE` is where the owner has decided the name belongs, and
  the five headers are inside digests other people's lockfiles hold. A name published by what cannot be
  withdrawn is not made private by rewriting what can. **What is worth keeping is the recurrence and
  not the frozen seventeen** — a stack trace pasted into a comment, a path copied out of an error
  message — and that arrives in the working tree, where a reading is green today and red on
  the day it happens. **It closes on that reading**, beside `refusedAddressFaults` in
  `mutation/history.ts`, whose halves are already this shape: a declaration of what is refused, a sweep
  over a named population, and a fault that reports where without reprinting what.
- **That nothing this repository publishes names the machine or the account it was built on — on the
  fourth surface, which no sweep has ever covered.** The sweep before the first push, and the one
  ADR-0095 built, read the tracked tree, the reachable objects, the commit messages and the tags. **A
  run log is none of those.** It is written by a workflow, kept by the forge, and published with the
  repository the day it becomes public — measured: a failed `wrangler delete` printed the account
  identifier into an Actions log, in an error message nobody wrote. That run was deleted by hand; the
  class stays open, and its population is *every log of every run ever kept*, which is the one
  population none of the existing sweeps can reach because it is not in git. What would close it is not
  a sweep at all — a log cannot be edited, only deleted — but a rule about what a step may print, and
  the mechanism for that is the same validation stage over this repository's own strings that three
  entries here already name.
- **That a deletion that reports failure has failed.** Measured on the throwaway of ADR-0099:
  `wrangler delete` removed the Worker's script, then asked for a KV namespace list its token had no
  permission for, and exited non-zero. **A partial deletion that exits non-zero is indistinguishable
  from one that did nothing, for anybody reading the exit code** — and the check written to tell them
  apart could not either: it asked the deployment for a page, read 404, and concluded absence. The
  Worker was still there. *A request answers about content; only a listing answers about existence.*
  The repair is in the probe that followed — it ends by listing what exists and fails if the name is
  still among them — and what is **not** closed is the general case: nothing in this repository requires
  a deletion to be proved by a listing, and the next one written will be as free to ask a question that
  cannot answer.
- **That the address a deployment keeps is the address a reader gets.** ADR-0188's gate is what stops
  this tree dropping an address a contract was published at, and it decides by comparing **two
  sitemaps** — the one the origin publishes against the one the build just wrote. It asks the origin
  for a document. It never asks the origin for an address.

  **Measured on the live origin at `18c0b38`, over the ten addresses ADR-0189 retired: nine still
  answer 200**, in two groups that fail for different reasons.

  | | answers | `Cache-Control` | `Age` |
  | --- | --- | --- | --- |
  | `/catalogue/`, `/method/`, `/what-a-contract-is/`, `/refused/` | 200 | `public, s-maxage=604800` | ≈132 700 s |
  | the five domain pages | 200 | `public, max-age=0, must-revalidate` | 132 599–164 099 s |
  | `/typescript/array/group-by@1/` | 404 | `no-store` | — |

  **`s-maxage` is written nowhere in this repository** — zero occurrences under `packages/` and
  `packaging/` — so four of them are held for seven days at the edge under a rule nobody here chose,
  and the other five are being served stale under the rule this repository does write. Roughly
  thirty-seven to forty-six hours old at the reading.

  **What happened is benign and the class is not.** The promise was over-kept by accident: a reader
  meets a stale page instead of a false 404. **The dangerous direction is the mirror** — an address
  the sitemap still lists and the edge stops answering. The gate would compare two documents, find
  the address in both, and say nothing, while a reader meets a 404 at an address frozen for the life
  of a major. That is the one event this whole mechanism exists to prevent, and the reading it is
  built on cannot see it.

  **It is the same class as everything else this week, arriving on the mechanism that keeps the
  promise: the thing measured is not the thing promised.** The promise is about what a reader
  receives; the measurement is about what a file declares. It was found by the owner reading the
  deployed origin, which is the one place the gate does not look.

  **Where this looked**: `theAddressesTheOriginLists` in `packaging/what-the-origin-lists.ts`, which
  does reach the network and still fetches a document; `print-what-a-deployment-would-drop.ts`, which
  runs before the deployment and so is the only reading that *could* ask about the previous one; and
  `packaging/against-the-origin/`, which runs after the upload and therefore sees this commit at every
  address, which is the guard that cannot fail ADR-0125 already refuses to write.

  **The population is every address the origin lists**, seventeen today and seven once the edge
  expires. What would close it is asking the origin for each address rather than for its sitemap — one
  request per listed address, before the deployment. **The price is not the requests**: a 200 from a
  cache and a 200 from the origin are the same answer, so such a reading has to interpret `Age` and
  `cf-cache-status`, which are facts about the zone rather than about this tree. That is **the third
  instance of the gap `wrangler.jsonc` records in its own words** — *a gap in this file's own claim to
  hold every decision* — after the custom domain and the four hours below. The real repair is three
  zone settings on the far side of it, and they are the owner's. Priced and not taken. ADR-0188,
  ADR-0189.

  **Re-read at `ccc9fca`, fifty hours on, it is seventeen and it went the wrong way.** One `GET` per
  address, redirects not followed: **10 of 10** retired addresses answer 200 where the table above
  records nine — `/typescript/array/group-by@1/` was 404 with `no-store` at `18c0b38` and now answers
  **200 with a 20 969 B page for the contract this catalogue turned down**, `age` 181 708 s. The four
  `s-maxage=604800` pages carry `age` 150 267 s, so some five days remain of the seven, and *seven
  once the edge expires* has not happened. The origin serves this commit — `contract-index` answers
  `servedFrom ccc9fca…` and its sitemap names the same seven addresses this tree writes — so the
  divergence is the edge's alone. ADR-0193.

  **The instance arrived, and the closure named above is green on it.** Measured at `2ac6803` on
  2026-09-02, one `GET` per address on both hosts: the ten retired addresses answer **200 on
  `toopo.dev` and 404 on `toopo.pages.dev`**, which is the same deployment asked without the zone in
  the way, and an address never served answers 404 with `no-store` on both. So the deployment is right,
  and something between it and a reader holds copies of pages it stopped writing — under
  `X-Robots-Tag: noindex`, a header this repository writes only for a host that is *not* the declared
  origin, and which the **7 of 7** live pages do not carry. **The closure this entry proposes would
  have seen none of it**: its population is what the origin lists, the origin lists **seven**, and those
  seven all answer from the deployment. The ten are outside it by construction, an address ceasing to
  be listed on the very push that stops writing it.

  **So the paragraph above conflates the two nouns this entry is about.** *The population is every
  address the origin lists, seventeen today* is false in its own terms — the origin **lists** seven and
  **serves** at least seventeen — and the same conflation stood in the gate's own verdict, which said
  *every address the origin serves is still one of them* and now says *lists*. **The entry states two
  directions and names one closure, and the instance landed on the other**: the closure covers the
  dangerous mirror, a listed address that stops answering, and what happened is the benign half.

  **What is refused is refused on measurement.** A blocking reading over the seven would have stopped
  **fifteen pushes of `main` in thirty hours** — fourteen green and the fifteenth in flight at the
  reading — on a state no commit reaches and a dashboard switch repairs. A printing one prints seven confirmations and says nothing about the
  ten. A register of retired addresses has the right population, no bound, and is red until somebody
  changes a setting. And the condition ends the day the owner turns that setting off, so a guard for it
  could be seen red once and never again. **It is the fourth instance of the `wrangler.jsonc` gap** —
  after the custom domain, the four hours, and the third named above — and the first of the four this
  repository met as a defect rather than recorded as a limit. **The cause is established only as far as
  *not the deployment*: that the mechanism is the feature named Always Online is not established**, the
  Wayback availability API that would have identified the source having answered 429 twice. ADR-0202.

- **That the four hours a returning reader holds a module for are decided by anything in this
  repository.** The entry this replaces had two halves and only one of them was ever this repository's
  to close. The declaration half is closed and is recorded below with ADR-0170; **this is the half
  that is not**, and it is the reason the entry was taken up at all.

  **Measured on 2026-08-28 at `7e3f64a`, by `curl` on both host shapes**: sixteen browser modules and
  `robots.txt` answer `public, max-age=14400, must-revalidate` at `toopo.dev`, and the *same tree at
  the same deployment* answers `public, max-age=0, must-revalidate` at `toopo.pages.dev`.
  `cf-cache-status: REVALIDATED` is on those seventeen and on nothing else of the thirty-five
  addresses read. So **Pages already sends the policy this repository declares, and something between
  Pages and a reader replaces the age.**

  **ADR-0170 declared that policy for all seventeen and the reading after the deployment is
  unchanged**, at `ec3dda9`, the origin's own `contract-index` confirming the revision: the same
  seventeen, the same four hours, the same `REVALIDATED`. The prediction was published before the
  deployment that tested it, which is the only thing that makes this reading worth more than the one
  above it.

  **What it costs a reader**: returning inside four hours they are served the repaired HTML and the
  old script, and `must-revalidate` does not save them - it forces revalidation once the freshness
  lifetime has run out, never during it. The mixture was met rather than predicted, a browser holding
  the module from an earlier session going on running it while `curl` showed the origin serving the
  new one. **And it costs more than a visitor**: this site is judged by looking at it just after a
  deployment, which is exactly the window in which its two halves disagree, so a reviewer can see a
  mixture of two commits with neither the page nor the module saying which. A defect read there is
  attributed to the change that was just made, and a defect repaired there can go on being visible.

  **No cause is named for the split, and one is now excluded.** `robots.txt` is in that layer and
  `llms.txt` is not - both `text/plain`, both at the root - and nothing measured says why. What is
  excluded is that it is anything the emission does: the two host shapes serve one tree.

  **Where this looked**: `theHeaderRules` in `packages/site/served-headers.ts`, which now declares the
  named policy for every one of them; `cachePolicyFor` in `packages/registry/response.ts`, which is the
  only place a duration is decided here; and `wrangler.jsonc`, which is where a deployment decision
  would live and which says in its own words that this one does not - *it is attached in the
  dashboard, not here... That is a gap in this file's own claim to hold every decision.*

  **The population is every address the zone edge-caches**, which is seventeen today and which nothing
  here bounds: a module added to the browser graph joins it, and no guard can see that happen.

  **It grew by one and every argument above is unchanged.** Re-read at `ccc9fca`, one `GET` per
  address: **18** answer `public, max-age=14400, must-revalidate` — the **seventeen** modules the tree
  emits, which is eleven of the browser graph and six references, and `robots.txt`. `llms.txt` is
  still alone outside that layer at `max-age=0`, and this repository still declares `max-age=0` for
  `/packages/*`, so the split is still the zone's and no cause for it is named. The population moved
  because the browser graph did, which is the sentence above happening. ADR-0193.

  **Two things would close it and neither is a guard.** The zone's own setting, which is on the far
  side of the gap `wrangler.jsonc` records and is the owner's act rather than this repository's. Or
  **modules addressed by their content** - `start.<digest>.js` - which would make a year correct and
  staleness impossible, and which is a unit of its own: it moves an address a reader may have linked,
  a price `paths.ts` already states for `THE_ENTRY_POINT`, and it needs every page's `script` and
  every kept import rewritten to carry the digest. Priced and not taken. ADR-0103, ADR-0170.
- **That an address the emitted tree serves and no listing names goes on being written.** The pages are
  kept, by a mechanism and at a price the closed entry never considered: it costed a rebuild of the tree
  at every commit an address was first served from, and what does the work is one fetch of the origin's
  own `sitemap.xml`, compared against the sitemap the deployment is about to upload. **What that reaches
  is what a sitemap carries**, and this entry is the rest: the named answers, the nine modules and the
  five files found by convention are served at addresses no listing names, so nothing would say if one
  of them stopped being written.

  **The population is the emitted tree minus its sitemap**, and it is the larger half by count: the
  sitemap names **10** addresses, measured at `15f4edf` off the origin and off this tree, both. The 76
  beside it is `27d1dbb`'s and the two are not subtracted here, because a difference taken across two
  coordinates is a figure nobody can rebuild. What makes it an entry rather than the same entry again is
  that the two halves fail differently: a page is what a reader arrives at from a
  search and can have linked, and an answer is what a client fetches under a digest it holds. The second
  is covered for the frozen ones by permanent rule 6 and by nothing at all for the rest.

  **Both halves are re-read at one coordinate, which is what the paragraph above says nobody could
  do.** At `ccc9fca` the sitemap names **7** addresses and the emitted tree holds **110** files, so
  the half no listing names is **103** — a subtraction taken at one commit rather than across two, and
  the reason the older figures were left unsubtracted. ADR-0193.

  **A second thing nothing keeps, and it is about the mechanism rather than about the population.** The
  coverage is inductive — each run compares one deployment against the one before it — so it holds only
  while every push of `main` runs. A push whose workflow never ran, or a job made non-required, is a link
  missing from that chain, and nothing in a later run can see one. What would close *that* is a reading
  over more than one predecessor, which needs a listing this repository does not keep. ADR-0125.
- **That a declared absence carries the date it was true**, which nothing keeps and which was found on
  this repository's own prose one day after it was written. ADR-0098 published *whether a runner's
  checkout satisfies that has not been measured* in the present tense; the job ran on the next commit
  and the sentence was false. **The class is a sentence asserting, with no stamp, that a specific thing
  has not been measured, where measuring it is possible and would falsify the sentence.** It is
  ADR-0018's rule about a dated number arriving on a declared absence, and it is harder to see there
  because there is no figure to date — nothing looks like a count, so nothing invites a coordinate.
  Swept over the ninety-eight records at `ed1abfd`, and **written as a list rather than as a number,
  because a rank is checked only by rebuilding the whole list**:
  - ADR-0001, *the cause is not established*, of a 126-line gap between two classifiers;
  - ADR-0055, *nobody has ever checked which* arms real cases reach;
  - ADR-0058, *the cheapest contribution is the one nobody has ever made*;
  - ADR-0092, *a surface nobody has seen*;
  - ADR-0094, *presents no measurements at all*, about a page somebody else can change;
  - ADR-0095, *what it cost is not measured and is not claimed*;
  - and ADR-0094 again, *was opened and carries no measurement of any kind* — counted as borderline
    and not as a seventh, because its verb is past and only its claim is present.

  Six become false the day somebody does the thing; the fifth can become false with nobody here acting
  at all, which is the one worth reading twice. **What is deliberately not claimed is that the list is
  complete** — the sweep matched thirteen phrasings and a declared absence has no fixed spelling, so
  what a reader may take is that each entry is real. **It closes on a convention rather than a guard**:
  a declared absence carries the commit at which it was true, exactly as a count does. The executable
  form is the validation stage reading this repository's own strings, which is already on this list,
  already priced, and already refused as a lint over prose.
- **That a test file of this repository goes on answering when the code under it is wrong.** One does
  not, and it was found by a mutant rather than by reading.
  `packages/registry/frozen-for-life.test.ts` builds its subject inside a `beforeAll` — a clone of this
  repository at committed `HEAD`, and a lookup of the published binding under the address *this
  process* renders. `registry-storage · I-30` renders an address without its language, so the clone
  holds one spelling and the process holds another, the lookup misses, and the `beforeAll` throws.
  **Its four guards are then reported `skipped` rather than run**, and the defect that was detected is
  detected by a throw instead of by a guard.

  **The silence is declared rather than repaired, deliberately.** `I-30`'s `leavesUnanswered` names the
  four addresses, ADR-0166 carries why, and the reason it is not repaired here is that making the
  `beforeAll` fail into its guards would have them claim to have caught a defect in *address
  rendering* when their subject is the freeze — the misattribution `run.ts` already records against
  `array/group-by@1`'s `language.test.ts`. Redesigning a registry fixture inside a unit whose subject
  is the instrument is the move this list exists to refuse, so it is named here and not made.

  **Where this looked**: the seven test files of this repository that declare a setup or a teardown,
  swept at `3eeaaae` — `frozen-for-life.test.ts`, `rebuild.test.ts` and `revision.test.ts` under
  `packages/registry/`, `archive.test.ts` and `against-the-origin/the-whole-chain.test.ts` under
  `packaging/`, `packages/cli/ignored.test.ts`, and `mutation/instrument.test.ts`. **The population is
  those seven**, and it grows with every fixture built outside a guard.

  **What would close it is a rule rather than a repair**: that a test file does only work in its setup
  which cannot fail on a defect in the code under test, everything fallible being a guard. That is a
  constraint on seven files and it needs something to keep it, and nothing here reads a `beforeAll` for
  what it can throw on. Priced as its own unit and not taken. ADR-0166.

- **That the composition of a mutant cell's run is compared against what the repository declares.** It
  is not, deliberately, and this entry is the refused half of the one that used to stand here. It is
  written at length rather than as a line because **the fact worth keeping is the one a rature would
  lose**: the repair named here for three years was green on the very instance that motivated it, and
  the next session to read *ignored is not failed* will propose it again unless something says so.

  **What the entry used to say, which was true and is closed.** `assertWholeSuiteRan` compares a total
  against a total, so a guard that stops answering is invisible to it as long as something else answers
  in its place. Measured at `c21865e`: with a checkout left registered,
  `packages/registry/frozen-for-life.test.ts` cannot start and the report reads **351 assertions, 347
  passed, 4 skipped, 0 failed** — 351 against the control's 351. Every word of that holds. ADR-0166
  closed it, and not with what this entry asked for.

  **What it asked for, and why that was false on the day it was written.** It named the comparison
  `assertTheCensusHolds` already makes, read where `assertWholeSuiteRan` runs. `censusFaults` filters on
  `(collected[file]?.guards ?? 0) !== guards`, where `guards` is a `number` — the census is a
  comparison of counts, and **the four guards that left the suite are counted**. The entry's own figures
  refute it with nobody re-running anything, and its own sentence one clause earlier says why: *ignored
  is not failed, and the two are indistinguishable to anything that counts.* Nothing about it ever
  looked old. That is rule 3 of this section arriving on the entry naming the largest blind spot in the
  instrument, and it is the second time this list has had to record that a *closure* was what failed.

  **Why the census still does not move**, which is what is now standing here. `run.ts` already states
  the rule for this shape: *two mechanisms over one fault have nothing to say on the day they
  disagree*. On a mutant cell the census's only catch that `assertWholeSuiteRan` has not got is a guard
  moving between files at constant total, and that has **zero reachable instances** — swept at
  `3eeaaae`, 685 mutant-arm pairs, **two** editing more than one file, and neither of those two files
  is a test file. **The price is published so nobody re-refuses it on that ground**: over the largest
  real report here, 54–102 µs per cell against the status reading's 4.4 µs, which over the 837 cells
  the instrument declares is 45–85 ms against a replay of some forty minutes. It is refused on the
  argument, and the price is there so the argument is the thing anybody has to answer.

  **The population is every mutant cell**, and what would reopen it is a mutant that edits two test
  files — which would give the per-cell census the reachable instance it has not got. Priced and
  refused. ADR-0166.
- **That the manifest declares no dependency the product could reach**, which stage rule 3 now states
  as a criterion and nothing reads. The two mechanisms that rule names are real and are about *files*:
  `no-part-of-the-instrument-or-of-the-suite-is-in-the-archive` and
  `every-file-in-the-archive-is-loaded-by-a-command` ask what the tarball holds. Measured at the commit
  that added `wrangler`: no module of `packaging/` reads `dependencies` or `devDependencies` at all, so
  **a package moved from the dev list to the runtime one would be installed by every consumer and no
  guard would notice** — `dependencies` is the field `npm install` walks, and `files: ["dist"]` does not
  bound it. It closes on a guard over the manifest: the runtime `dependencies` are exactly the packages
  the published entry point imports, which `reachable.ts` already computes and nothing compares against
  the manifest. One file, and it is the cheapest entry on this list.

  **That guard would be green the day it is written, and it was measured rather than assumed.** At
  `27d1dbb` the manifest declares one runtime dependency, `typescript`, and
  `dist/packages/validation/typescript-api.js` imports `typescript/unstable/sync` — so the declaration
  and the walk already agree, and the guard finds nothing. It is written anyway on the rule below about
  a guard born green: what it buys is not today's defect but the day somebody moves a package from one
  list to the other, and on that day the package is installed into every consumer's project.
- `contractAnatomy` — triaged entry by entry against stage 1's own constraint, *readable in the source
  alone, without evaluating the module*: **three of the eleven are settled by the source alone, four
  need the module, four are a reader's and no stage will ever take them.** So the conformance
  controller is not "`contractAnatomy` made executable"; it is three entries, and a fourth stage that
  evaluates a vetted module takes four more. The triage is data on each entry and one guard keeps the
  half that can be kept — a new entry with no verdict is refused.

  **The four entries this defers close on an ordinal, and ADR-0171 measured that the ordinal names
  nothing.** Swept over the tree, no file says what stage 2, 3, 4, 5, 6 or 7 would be, so *a fourth
  stage* is a mechanism named by its number — which is rule 1 of this section unmet, on an entry that
  looks as though it meets it. What the four actually need is not in doubt and is written in the
  triage itself: the *value* of a declaration, which stage 1 already reads for the contract it checks
  against. So the deferral is real and its address is not. ADR-0171.
- `CLOCK_DEPENDENCE_RULE` — declared, cited in prose, imported by nothing executable. It is one of the
  four a reader keeps: which guards *can* depend on elapsed time is a judgement about what a defect
  could do to a guard.
- **That a profile's name is true of its own samples — which nothing will ever establish for six of
  the seven contracts, and this entry is that fact rather than a debt anybody can pay.** Re-measured
  at `286ca34` by leaving `small-integers` named and classed `accepted` while its samples became
  `['1e308', '0.000000000000001', '-1e-300']`: **718 of 718 green** in `contracts/`, and the only red
  was `npm run freeze`, on a digest — `d5071a58…` becoming `4992b93f…`.

  **The three entries this replaces all closed on the validation pipeline and none of them closed
  there.** The pipeline is not a mechanism: `analyseImplementation` has no caller outside its own
  folder's tests, and **`stages 2 to 7` is a rank with no list** — swept over the tree, nothing
  anywhere says what stage 2, 3, 4, 5, 6 or 7 would be, and ADR-0082's *fourth stage* has nothing
  behind it either. That is this file's own rule about a rank arriving on the list that wrote it.
  **And evaluation was never the obstacle**, which is what inverts the reasoning: stage 1 never
  imports what it *analyses* and already imports what it *checks against* — `requirementsOf`
  receives the evaluated contract module — so a profile's samples are within its reach today. What
  is missing is not a stage but a machine-readable statement of what the name claims, and neither
  reading source nor evaluating a module produces one.

  **Where this looked**: `analyse.ts`, whose own paragraph distinguishes reading a declaration from
  reading an implementation; `packages/validation/source.ts`, which states the constraint the triage
  is built on; and ADR-0058, which decides that a contribution is *never a contract*.

  **The population is measured and it is the price of the freeze rather than a defect.** Over the
  catalogue's thirty-six profiles: **nineteen share their class with a sibling of the same contract,
  and seventeen are indistinguishable from a sibling in everything a guard reads.** The two differ by
  `array/group-by@1`, which separates its two `few-large-groups` profiles by `keyFunction` and
  *executes* it — the only contract here where no two profiles are one thing, 0 of 6, and the only
  one that has never been published. The repair is a field of `contract.ts`, every byte of that file
  is inside a digest six contracts are bound by, so **the seventeen cannot be repaired by anybody,
  ever, for the life of those majors.**

  **What is done instead is that the debt stops growing.** `PROFILE_SEPARATION_RULE` is declared in
  `contract-record.ts` beside `ProfileRecord`, and
  `no-two-profiles-of-an-unpublished-contract-are-indistinguishable` holds every contract whose frozen
  half is still open — a population *derived from the lifecycle*, so the exemption is granted only
  by publishing, which is the moment the rule has already been met. Nobody can add a name to it.
  ADR-0171.
- **The rule that an alias must not name what its contract refuses to be**, argued in ADR-0023, which
  also carries the criterion. The eight liars are gone and nothing keeps it.

  **This entry used to ask for something and the thing it asked for already existed.** It read *the
  executable form needs each contract to publish its exclusions as data, which is a new frozen field on
  five contracts.* Measured at `5f152b1`: every contract publishes its exclusions in
  `identity.inputDomain` — *not a locale-aware parser*, *not a similarity ratio, not a phonetic match*,
  *not written for a DNS label* — `identity` is inside the frozen half, and a contract page renders it
  under a heading called **What it is for, and what it is not**. There is no field to add, and adding
  one would be a second statement of a frozen half that permanent rule 6 makes unremovable for the life
  of the majors. ADR-0128.

  **So the entry asks for nothing, and what it now says is why.** The exclusions are published and they
  are **prose**, so a check over them is the word-matching this entry already refused — its own
  conclusion, which was more true than its premise. What would close it is a way to read that prose that
  is not word-matching, and nothing here has one. Declared rather than dressed as a mechanism, which is
  the treatment this list exists to give.
- **The rule that a report may not name a cause no measurement establishes**, whose nine instances are
  repaired and whose class nothing keeps. It closes **one sentence at a time**, and what closes a
  sentence is naming it in *Derive the sentence from the fact* above: three are there, so those three
  cannot drift and the rest are prose that can. That is the recognisable event this list asks an entry
  to carry — a sentence leaves this rule's reach on the day it is computed from what it claims, not on
  the day somebody rereads it. The class-wide form is the one that is refused: the sentences are
  authored in fourteen modules and only their presentation is shared, so a guard would be a lint over
  thirteen files judging prose, at the price the alias rule above was refused at. What would close
  *that* is a validation stage reading this repository's own strings the way stage 1 reads a
  submission's — named so it can be recognised, and not built.
- **What files a contract's declaration may name**, which is narrower than it first looked and is
  recorded with the measurement that closed the wider reading. *A contract is the folder and not a
  file* is kept, in both directions: `harnessOf` refuses any disagreement between a contract's
  declared `files` and what is on disk, and a stray file dropped into `contracts/typescript/date/add`
  reddens **50 guards** under `UndeclaredHarness: … present and not served: stray.ts`. They are not
  all the same list — most carry the seven, `array/group-by@1` carries nine and `number/round@1`
  eight — and that is declared rather than drifted: `THE_SEVEN_FILES` is spread into every entry, the
  extras are written beside it as `[...THE_SEVEN_FILES, 'language.test.ts']`, and the constant's own
  comment says they are its own. What nothing keeps is one level up: **the declaration is checked against the
  folder, and nothing checks the declaration.** A sixth contract may name a tenth file and put it
  there, and both halves will agree. Closed by the same thing the entry above it closes by — a
  validation stage reading a submission's folder against what `contractAnatomy` requires of one —
  because the judgement is whether an extra file is a contract's own or somebody's leftover, and that
  is not a shape.
- **The rule that a pin names what is red on every run**, argued in ADR-0076, whose *instance* closed
  and whose *class* stays open. The instance was `G-14` of `string-slugify` pinning
  `p1-two-spellings-one-slug`; that pin is gone, and `G-02`’s was repaired by widening an alphabet
  rather than raising a draw count, with the new rate published as an order and not as a figure — both
  arguments are in ADR-0053. What no mechanism keeps is the general case: a battery sees one draw, so
  any pin is still checked against the run that wrote it, and closing that would mean four runs of
  every cell — the 23-minute replay taken four times. Priced, declared, and not built.
- **A reproduced miss rate that disagrees with what the runs show, by a factor nothing accounts for.**
  It is a fact about the *method* rather than about the cell that revealed it, which is why it does not
  close with that cell’s pin: the same reproduce-and-predict method justifies every pin on a
  property-based guard. Both cheap explanations were eliminated in situ and the model was thereby
  *confirmed*, predicting one silent run in about 6 200 where direct observation gave one in 500;
  pooled over roughly 1 093 trials the model carries a likelihood near 1.3 %. **Unlikely, not excluded,
  and unexplained.** Settling it needs about 5 000 real passes of one cell, roughly an hour and a half.
  **Priced and not spent, on the rule this gap itself produced: a measurement that enters no decision
  is not bought at any price.** ADR-0077 carries the method’s limit and the rule that a repair is
  chosen for its margin rather than its precision; it will enter a decision the day a repair is close
  enough that the factor decides between two candidates.

## Rules for this stage

1. **The registry is being designed one piece at a time, and the order changed once, deliberately.**
   It was data schema, then immutable storage, then the read API, then the publishing tool, with the
   CLI and the website after all four. The first three are written. **The CLI then moved ahead of the
   publishing tool and of stages 2 to 7 of the validation pipeline**, and the argument is the one the
   decision to launch at five rests on: every remaining uncertainty is on the user's side, and none of
   them is answerable in private. Continuing the pipeline first would have been acting against the
   reason that decision was taken — the pipeline judges submissions, in a closed phase there are none,
   and every contract of the catalogue is already measured by its own batteries.

   A second argument decided it, and it is a lesson from this repository rather than a preference:
   **a defect in this schema has never once been found by looking at the schema.** Every one was found
   by a consumer trying to use it. The list is here, named, and it is the whole of it — see below for
   why it is a list and not a number:

   - `dependencyDepth`, reduced to a summary no caller could walk — the read API
   - `ProfileSamples`, summarised where a caller needs them whole — the read API
   - `DependencyNode`, because the walk demanded a record no client holds — `toopo add`
   - the two digests of an installed file, `served` and `sha256` — `toopo add`
   - `LockedFeature.askedFor`, so an update could know what had been asked for — `toopo update`
   - the export names in the served index, so a client could say what it installed — `toopo update`
   - `ExportRecord.parameters`, because a case of block 4.4 is a call — the site
   - `CaseTableRecord.groups`, because a case belongs to a group — the site
   - `ParameterRecord.type`, because a form field has to know what it is — the site
   - `list-the-whole-catalogue`, a page with no need behind it — the site
   - `run-the-implementation-on-what-a-reader-types` — the playground

   **This was a numbered series, and the numbers had stopped being true.** Two things were called *the
   seventh*, two *the eighth*, two *the ninth*, and one field was published as both the fifth and the
   seventh in two files. The cause is recoverable and worth recording, because it is the argument: two
   places re-derived the rank from a list they wrote out from memory, both dropped `DependencyNode`,
   and both compensated by counting the lockfile's two digests as two findings instead of one. Each
   list was internally consistent and neither matched the other.

   So the ordinals are gone rather than corrected, by the rule 467 established. **A list is checked
   line by line; a rank is checked only by rebuilding the whole list, which is what nobody did.** What
   the series is about — a schema defect is never found by reading the schema — does not drift, and it
   is the sentence that survives.

   Only the piece currently under way exists; the others do not, because each one constrains the next.
   Everything lives in this one repository, in folders — releases are independent, the history is not.

   **The catalogue ships at five contracts, and it holds six.** The fifth installable one is
   `number/round@1`, published after that line was written, and what the line settles is that the
   *showcase domain* waits rather than that the catalogue is closed. **What it was waiting for is
   behind it and not ahead.** The deferral was to *after the launch*, on the argument that the
   uncertainties left are the user's — whether `toopo add` feels good, whether search finds something
   in ten seconds, whether a contract page convinces — and that none of them is answerable in
   private. The product is in front of users, so all three are answerable now. **The clause was wrong
   about its own order as well**: `number/round@1` was published on 2026-08-20 and `toopo@1.0.0`
   reached npm on 2026-08-17, so the contract it placed before the launch arrived three days after
   it. Whether the showcase domain is built is a decision nobody has taken, and what is settled is
   only that nothing stands in front of it. ADR-0153.
2. **The no-abstraction suspension has ended**, having done its job: three contracts were written by
   hand with no shared code, and what they turned out to repeat *identically* now lives in
   `packages/catalogue/`, under the freeze discipline stated at the top of that file. The bar for adding
   anything there is not "the contracts repeat it" but "the contracts repeat it identically, and
   what it says belongs to the registry rather than to any one feature". Resemblance is not
   duplication: three functions that answer the same question about different data stay apart.
3. **A dev dependency is admitted when it cannot reach the product, and when the mechanism that stops
   it is executable.** Six today, and **the field each is declared in is what decides what the
   criterion asks of it** — a list that does not say so reads as six tools held to one test, and one of
   them is not. `typescript` is a `dependency` and it **does** reach the product: measured at
   `1a1b0f8`, the archive's own specifiers run
   `published.js → command.js → install.js → rewrite.js → forbidden-constructs.js → typescript-api.js`,
   so every install downloads a compiler, and what it buys is the client reading what it is about to
   write into somebody's project. The other five are `devDependencies` — `vitest`, `fast-check`,
   `@types/node`, `wrangler`, `happy-dom` — and it is the criterion that decides the seventh, not the
   list: a rule written as names plus an exception grows an exception per tool, where a rule that
   states its test survives its first case.
   Two mechanisms answer it and both are measured: `files: ["dist"]` decides what `npm pack` ships,
   and `packaging/reachable.ts` prunes `dist` to what the published entry point can reach — so a tool
   no published module imports is absent from the archive twice over, by a declaration and by a walk.
   `happy-dom` executes a module against a document, which is what nothing here could do and what no
   earlier refusal had priced: ADR-0157 refused a headless browser for the fourth time and wrote that
   *this wants a module executed against a document, which is a different tool at a different price*.
   Measured across the commit that added it: the archive is **35 modules and 466 308 bytes either
   side**, and `grep -rl happy-dom dist/` answers nothing.
   `@types/node` is types-only and has no runtime footprint at all; without it the mutation instrument
   would either sit outside the typechecker or be written in plain JavaScript, and an unchecked `.ts`
   file would claim a guarantee the repository does not give it. `wrangler` deploys and is imported by
   nothing. ADR-0097 carries the argument, including why a floating `npx wrangler` was refused: a
   repository whose product is that a published version is frozen for life cannot deploy with whatever
   was newest that morning. Feature code still has zero runtime dependencies of any kind.
4. **The root `package.json` no longer carries `"private": true`, and what replaced it is not a second
   flag.** That rule held for this repository's whole private life and removing it is the deliberate act
   of the unit that published the catalogue. `prepack` builds, and one job now runs `npm publish` — the
   workflow's token is still `contents: read`, exactly one job widens it by `id-token: write`, and **no
   runner holds an npm credential**, which is a guard rather than this sentence. A guard asserts the
   field's *absence* rather than its value, so putting it back reddens - and putting it back would make
   every publication fail. ADR-0106, ADR-0109.
5. Working notes, planning documents and status reports do not belong in this repository. Only
   contracts, implementations, tests, the evidence produced by running them, the instrument that
   produces that evidence — including its own fixtures — and the decision records under
   `docs/decisions/`, whose format, address and required sections ADR-0001 settles. A decision record
   is none of the three things this rule refuses: it is not a note, it carries no status, and it is
   what a line of code cites when the reason it exists will not fit beside it.
6. **Fixtures for the instrument live under `mutation/`, never under `contracts/`.** `contracts/` is
   the catalogue and nothing else. A fixture is a toy shaped like a contract so that the instrument
   can be mutation-tested in seconds rather than minutes; a meta-test nobody runs is a decorative
   guard, and the cost of running one is what decides whether it gets run. A fixture is deliberately
   minimal, is never a template for a real contract, and says so in its own header.

## Permanent rules

These outlive the current stage and are not open to trade-off.

1. **No runtime indirection.** No dynamic resolution, no wrapper component, no network call at
   execution time. The only indirection is the user's import path, resolved at install time.
2. **No external npm dependency inside a feature.** A feature depends only on other registry
   features and on native language and runtime APIs. Wrapping an existing library is rejected on
   principle.
3. **No distribution from an external source.** Installations are served only from the registry's
   immutable snapshot, never from a third-party repository.
4. **Never update user code silently.** Notification, readable diff, explicit acceptance.
5. **Never hide a contract's tests.** Contracts are public in full; security by obscurity on them
   is forbidden. Auditability is the product.
6. **No breaking change to a published contract major.** A published version is frozen for life;
   an incompatible evolution creates `name@2` alongside `name@1`.
7. **Nothing trivial in the catalogue.** A contract exists only if it provides something the
   language does not give trivially — non-obvious behaviour, real edge cases, an algorithm, or the
   correction of a language trap.
8. **No validation bypass**, including for the founder's own submissions.

## Conventions

- English everywhere: code, identifiers, comments, tests, commit messages, documentation.
- Conventional commits, atomic. **`main` is pushed at the end of a unit, and a unit is not finished
  until the run it triggers is green** — every suite on two runtimes, the deployment behind them,
  and the one proof that reaches it. Nothing else: no force and no rewriting of history.

  **And the push waits while a run of `main` is queued**, which is a convention with nothing under it
  and is written here because it is where somebody about to push arrives. `cancel-in-progress: false`
  protects the run in progress and not the one behind it: a queued run is cancelled and replaced by
  the next push, measured to the second, so a push made then destroys a verdict rather than adding
  one. The publication survives it — the entry below says why — and the battery selection does not.
  `gh api repos/toopohq/toopo/actions/runs?branch=main` answers whether anything is `queued` or
  `pending` before a push, and it is one request. ADR-0236.

  **That clause has been broken twice, both times deliberately, both times by the owner's decision,
  and it is written here rather than kept as a rule nobody honours.** The history was reissued on
  2026-08-16 to take a personal address out of every commit, and on 2026-08-18 to take the assistant's
  co-signature out of every commit. Both moved every identifier and neither moved a single tree, which
  is what made the stamped measurements survive as renames. **What stays forbidden is a rewrite that
  is not one of these**: an amendment to tidy a message, a rebase to linearise, a force-push that
  repairs a mistake. Those buy nothing that a new commit does not buy, and they cost every citation in
  the tree at once. A third rewrite is a decision with a record, not a convenience. ADR-0095, ADR-0124.

  Three clauses this line used to carry are gone. It counted the suites, struck by the rule 467
  established one section up — a rank is checked only by rebuilding the whole list, and what the
  sentence is about does not need one. It read *never push and never create a remote*, which held
  until the CI existed, at which point keeping the two apart stopped protecting anything and only
  delayed the reading that says the unit worked. And it read *no tag*, which the two rewrites both
  refuted: the three `evidence/*` tags are annotated, they are reissued with the commits they name,
  and a convention forbidding what the mechanism requires is one that reads as false the first time
  somebody checks it.
- **A commit is signed by whoever wrote it, and the assistant is not a whoever.** `.claude/settings.json`
  turns the co-signature off for anybody who clones this repository, so the convention is a mechanism
  rather than a sentence a contributor has to read. **It is a default and not a prohibition**: crediting
  a person who worked on a change is what a trailer is for, and anybody may write one by hand. What it
  refuses is a trailer nobody decided to add. ADR-0124.
- **Nothing publishes to npm from a keyboard, and nothing asks for a publication either.** This line read
  *nothing to npm ever* until `1.0.0` was published by hand, and then named a dispatch carrying a typed
  word until that turned one decision into two gestures. A publication is a **push of `main` declaring a
  version npm does not hold**, after the run it depends on is green. The deliberate act did not disappear;
  it moved onto the number, which nobody writes by accident, and no credential exists here to make a
  publication any other way. ADR-0109, ADR-0111.
- TypeScript `strict: true`.

**How the catalogue is written.** Each rule below is stated once here and argued once in the record
beside it. Where the two ever disagree, the record holds the measurement and this line holds nothing.

- An address — a case, a guard, a group, a reason literal, a benchmark profile — is a name in
  kebab-case, unique within its contract, frozen with the contract's major, and **never a rendering of
  the data it addresses**. The test that decides the next one: falsifying the name and reddening the
  guard are the same event, or they are not. ADR-0017.
- A guard's title is that address, then ` :: `, then a sentence. The registry addresses a guard by the
  pair `(contract, identifier)` and never by the identifier alone. ADR-0019.
- A fallible function answers `T | null` and publishes `describe<X>Failure(...)` beside it, with a
  coupling property tying the two. The reason set is frozen with the major. ADR-0020.
- A contract that answers differently from the language or the ecosystem carries a guard that
  **replays** the divergence on the rows where it happens. ADR-0022.
- An alias is a query whose best answer is this contract, never a phrase that relates to it. It is the
  one field of `identity` that is not frozen. ADR-0023.
- On a page, **the tag is the outline and the class is the look**. A separator belongs to a block; a
  phrasing element gets none. ADR-0025.
- A parser is written once and reached, never copied. **A copy of a parser is not a second opinion, it
  is the same statement written where nobody will maintain it.** ADR-0026.
- A command that can destroy or overwrite shows first and writes on a second word; a command that can
  only refuse writes at once. `THE_WRITE_DISCIPLINE`. ADR-0036.
- **A refusal that explains is a door, one that reports is a wall.** ADR-0039.
- Before writing a rule in prose, look for the shape that makes breaking it not compile — a total map
  over a type, or a union with no way to spell the absence. Where no such shape exists, the rule is
  written in prose *and* recorded below among what nothing keeps. ADR-0054.
- A computed root states how far up it is going, and what it is going up from. A walk over the source
  tree and a walk over the emitted tree look identical and only one moves when a folder does. ADR-0059.
- A pin naming five or fewer red guards names all of them; above five it names only the guards the
  mutant was written to exercise. **Five is a convention and reads as though it were derived**, so the
  distribution it was cut from is published beside it and remeasured when a contract moves it. ADR-0076.
- **An example is chosen for what it shows.** Where two examples in one set would show the same thing,
  they do not show it in the same language. The test that decides the next one: could this example make
  its point in another language? If it could, and something else in the set is already in this one, it
  changes. ADR-0120.
- **No two benchmark profiles of one contract are indistinguishable to the guards that read them.**
  Where two share a class, some further declared field separates them and the contract's own
  `profiles.test.ts` executes it. A profile's *name* is prose and is read by nothing, so a distinction
  that lives only in the name is one the catalogue cannot make — and the field that would carry it is
  inside `contract.ts`, which is inside the digest, so **this is settled before publication or never**.
  Measured over the seven: seventeen of thirty-six profiles fail it and only `array/group-by@1` passes,
  0 of 6, because it is the only one that was never published.
  `no-two-profiles-of-an-unpublished-contract-are-indistinguishable` holds every contract that can
  still act on it. ADR-0171.
- **A demand signal decides what is measured and never what is refused.** The asymmetry is what makes
  it derivable rather than a taste: a selection error self-corrects — the candidate is measured, rule 7
  decides, and a false alarm costs one probe — where a refusal error is final and silent. So a figure
  may say *this is worth measuring* and may never appear in the sentence that turns a candidate down.
  **No refusal in this catalogue's history now depends on one**: seven of the twenty-seven carry an
  install figure, six stand whole once it is struck, and `array/binary-search` — the one that did not —
  took a second and independent motive at ADR-0163. **No signal available separates the published from
  the refused**: measured at `3cec9a8` over all 34 addresses, npm downloads reach an AUC of 0.296,
  manifest adoption 0.414 and hand-rolled implementations 0.475, where 0.5 is a coin flip. The cause is
  why no better one is coming — a demand signal measures where an ecosystem is busy, rule 7 asks where
  the language is wrong, and where the language is wrong there is no busy ecosystem, because the
  incumbent is the language itself. `number/parse@1`, `date/add@1` and `number/round@1` rank 33rd, 32nd
  and 31st of 34. ADR-0191.
- **A candidate is a contract when four clauses hold, each the complement of a group of the twelve
  refusal grounds.** **P1, the vacancy** — the language does not answer it and no live proposal is
  about to, no normative specification outside this catalogue fixes the answer, and the correct answer
  is not one expression over built-ins. **P2, the stake** — a wrong answer is in circulation, the
  disagreement has a right side rather than being a product choice, and being on the wrong side costs
  the reader something. **P3, the unit** — one function rather than one algorithm behind several
  renderings, and more than one decision left to settle. **P4, the form** — pure in its arguments, a
  signature that can carry the answer, a case table that serves, no collision with a frozen contract,
  and an answer that does not follow the runtime. **The trap and the vacancy are two sources of P2 and
  never two criteria**: the wrong answer in circulation is the language's own or the ecosystem's, and
  those are exactly the two axes the two searches ran on — reaching 4 and 3 of the six installable
  contracts, overlapping on `object/deep-equal@1` alone and covering all six between them. Writing two
  criteria would write the search method into the acceptance rule, and a candidate is not better for
  the axis that found it. Tested against the known answer at `1907df5`: **28 of 28 refused addresses
  fail at least one clause, 23 of the 27 fail exactly one, and the six installable fail none.**
  ADR-0207.
- **A contract answers the same thing on every runtime.** This is the thirteenth refusal ground and it
  is under P4: a function whose answer follows the runtime's Unicode tables settles its question
  differently on two machines, which is not a contract. **It is not R6 read widely, and a measurement
  is what says so** — the two guards this catalogue operationalises R6 by, `determinism` and
  `no-ambient-input-from-history`, are **green** over a grapheme-length function built on
  `Intl.Segmenter` and **red** on a stateful control, so R6 as it is executed here cannot see the
  difference. It refuses no address of the thirty-six on its own, and it eliminated graphemes as a unit
  for `string/truncate` without refusing that candidate. ADR-0158, ADR-0207.

**What the next contract has to carry before it is frozen, and what it does not.** Every line below
is on this list for one reason and states it: after the digest is minted, permanent rule 6 forbids the
repair for the life of the major. A line that cannot say that does not belong here — closing it after
publication closes it just as well, and the second half of this section is what was taken out when it
could not. ADR-0175.

1. **The alias review of ADR-0023, carried out before the contract enters the catalogue.**
   `searchAliases` is a field of `identity` and `identity` is inside the digest. Afterwards the
   registry may *add* a phrase through `alsoFoundBy` and may never correct or withdraw one, so a
   phrase promising something the contract refuses is permanent. That review has caught eight liars.
2. **The divergence replay, if the contract diverges from the language or the ecosystem.** A declared
   file enters `harness` and `harness` is inside the digest, so `language.test.ts` is declarable on
   the first day and on no day after it. Five published contracts can never carry one.
3. **A name true of its own samples, for every benchmark profile.**
   `no-two-profiles-of-an-unpublished-contract-are-indistinguishable` holds only while the frozen half
   is open, and the *name* is read by nothing at all — `benchmarks.profiles[].name` is
   `one-directional` and inside the digest.
4. **An output alphabet no wider than the answers witness.**
   `every-class-a-declared-pattern-names-is-one-the-answers-witness` reads the classes a bracket
   expression names and refuses one no published answer carries; a character *outside* a bracket
   expression it does not read, and the declaration is inside `contract.ts`.
5. **A declared file list that is the list the contract meant.** `harnessOf` checks the declaration
   against the folder and nothing checks the declaration, so a contract may name a tenth file, put it
   there, and have both halves agree for ever.
6. **Every sentence of the contract's own prose, read against what the contract does.** Seventeen
   paths of the digest are read by nothing, and so is every comment in the declared files. Afterwards
   `correctionsToFrozenProse` can say a sentence is wrong and nothing can make it right.
7. **Every backticked address in those files resolving inside the contract's own folder or the shared
   harness.** Measured over today's catalogue, 27 of 31 do; the four exceptions are two deliberate
   negatives, one union member the compiler protects, and one live citation of a file this repository
   may rename. The sweep is three lines and it is the whole of what stops the eighth adding a fifth.
8. **The four entries of `contractAnatomy` that no stage will ever check**, which are a reader's
   judgement made once, on a folder that is then frozen.
9. **No guard that depends on elapsed time.** `CLOCK_DEPENDENCE_RULE` is declared, cited in prose and
   imported by nothing executable, and the contract's guards are frozen with it.
10. **No control character but tab and newline, no developer path, no undated declared absence, and no
    setup hook that can throw on a defect in the code under test.** Measured at `210bc7c` over the 52
    files of `contracts/`: zero of each. That is a reading of what seven contracts happen to hold and
    never a property anything keeps, which is why it carries its coordinate; what makes it a line here
    is that one written in is permanent.

**And what was taken off this list after measuring it, which is the half that stops somebody putting
it back.** The contract's **address**, because a fixture standing in the way can still be renamed
afterwards — the collision is met at authoring time and the repair is outside the freeze. Its **use
cases**, because `useCases` is standing since ADR-0118 and is rewritten the day it reads badly. Its
**battery cells and pins**, because they live in `mutation/` and no digest covers them. Its **learned
terms**, for the reason the aliases are on the list and these are not: `alsoFoundBy` is the standing
field written precisely so that this one arrives late.

## Verification discipline

This project sells verification. A decorative guard here is not a technical defect, it is a defect
of the thesis.

- A test that cannot fail is not a test. Before claiming a suite is green, break the implementation
  on its real failure condition and show the red output.
- A guard that is structurally incapable of failing must be recorded as inapplicable, with the
  reason — never written as a passing test that proves nothing.
- Every universal property carries a status — applicable or not applicable — together with its
  reason. One declared applicable must have been seen red on at least one plausible mutant.
- **A guard that can find no defect on the day it is written is justified by the event it would catch
  and by what that event would cost**, never by what it finds now. Born green is not the same as
  decorative: the decorative guard is the one that *cannot* fail, and this one fails the day a named
  thing happens. So the entry that proposes it says which event, and what that event costs if nothing
  is watching — and where the cost is small, that is the argument for not writing it. This is the other
  side of *a test that cannot fail is not a test*, and it is easy to invoke as an excuse: a guard whose
  event nobody can name is not born green, it is aimed at nothing.
- **A check that depends on where a line wraps depends on something nobody can see.** Read the text
  with runs of whitespace collapsed, so an expectation is the sentence rather than the sentence plus
  its column width. The alternative is a guard about the instrument going red on a re-flow, repaired by
  transcribing a layout into an expectation, which is one more place the layout is now declared.
- **A guard perturbs the claim, never the object derived from it.** Perturbing the derived object
  establishes that the derivation is self-consistent, which is true of a derivation with a hole in it —
  measured twice, ten units apart, on subjects sharing nothing. It is the cheapest test for a guard
  that cannot fail: ask whether what the guard perturbs is the claim or something computed from it.
  ADR-0087.
- **A sweep that decides a change is a sweep nothing checks, and this one survived being hunted.**
  ADR-0189 deleted ten battery cells, and which of them could go was decided by a probe: for each
  doomed cell, does it pin a guard that survives? It built the set of surviving guards by matching
  `it('…')` across the site's test files — and `links.test.ts` puts its title on the line below
  `it(`. So one guard was invisible to the probe, the probe reported that it had gone with its cell,
  the cell was deleted, and `every-address-a-page-links-to-is-composed-and-never-typed` was left with
  nothing reddening it.

  **What makes it worth a line is not the regular expression.** It is the same defect this repository
  had spent that day finding in four published sentences — *a population narrower than the claim* —
  committed in the tool that was doing the finding. A sweep aimed at somebody else's blind spot has
  one of its own, and being the thing currently hunting the class is no protection at all.

  **Nothing but the replay could have said so.** Every suite was green, the typecheck was green, the
  anchors all applied, and the guard went on passing — because a guard with no mutant aimed at it
  passes. `npm run battery site` refused the run under `UNACCOUNTED FOR`, with the sentence that
  exists for exactly this: *nothing reddens it, and the battery does not say why. Either it is out of
  this battery's reach, or it is a debt — both are declared, neither is silence.*

  **The rule it produces is cheap**: a probe whose answer decides a deletion states the population it
  read and how, in the commit that deletes. The two disagreeing cells found in the same run make the
  same point from the other side — W-56 filtered a page that no longer exists and W-65 was re-aimed at
  prose carrying no marks, so both edited a file and changed no answer. **A mutant can be inert on the
  data rather than wrong about the code, and that is what a replay says and a reading does not.**
  ADR-0189.
- **Checking that a change does not move what you feared says nothing about what it moves.**
  ADR-0129 reordered a shared list of seven filenames and checked `npm run freeze`, because the
  order could have entered a published digest. It had not. What the order *was* load-bearing for was
  a pin one folder away - `array/group-by@1` had been the only contract whose list was not already
  sorted, and the reorder made a sort load-bearing for all five - and that declaration went stale
  with nothing saying so. **What would have caught it is a replay and not a closer reading**, and
  the replay that did catch it was run a unit later for another reason. So a change that moves a
  shared declaration replays the batteries of every folder that reads it, and the check that was
  taken is named beside the one that was not. ADR-0130.
- **Write the guard beside it.** After ADR-0087's test, this is the cheapest way to find a guard that
  cannot fail, and it is a gesture rather than a rule: naming a *neighbouring* guard forces the first
  one's claim to be said out loud — *this one is about the order, so that one is about something else* —
  and the gap shows in that sentence. A reread asks whether a guard looks right, which it does; the
  neighbour asks what it establishes that the neighbour does not, which is the question a decorative
  guard cannot answer. **Four were found this way in one day**, three of them on guards written the same
  hour: a round-trip fixture whose five characters could not disagree, a document check its own
  counter-examples were refused by for another reason, and a page check the column already satisfied.
  ADR-0125, ADR-0126.
- **Write the sentence that explains the decision, for somebody who may disagree with it.** The same
  gesture on a second axis: the neighbour makes a guard's claim explicit by naming what it is *not*
  about, and this makes it explicit by owing a reader an argument. It is what found the false-only
  region of ADR-0141 — *this population shrank and the loss is nil* had to be defended, and defending
  it forced *could the guard ever have been right there?*, where a reread of the guard answers **yes,
  it looks correct**, which it does. **No count is published**, on the rule below that a sentence which
  can be true without counting does not count: what is claimed is that the gesture works and that it
  has fired here. ADR-0141.
- **A guard that is green while its subject is broken is not one form, and the five instances this
  repository has found are five mechanisms.** The list was rebuilt rather than remembered, because it
  reads at a glance like one shape and is not:
  - `every-ink-the-palette-can-put-on-every-ground-it-paints-is-legible` derives its population from the
    served `<style>`, so **no style element means no iterations**. Still true of the guard today; what
    closes it is the battery cell W-24b and not the guard's shape.
  - `a-first-push-selects-every-battery-rather-than-none` asserted an **outcome two causes reach**.
    Repaired by asserting the cause.
  - a `\b` written through a shell heredoc landed as `0x08`, so the **predicate matched less than its
    text said**. Re-swept at `9b48c5a` over every tracked file: two carry a control character other than
    tab and newline, both the deliberate `0x00` separators this file already names, and no backspace.
  - `expect(done.status).toBe(0)` on a battery pinned green: **the failing input class was never
    supplied**. ADR-0149.
  - and its neighbour, found by the first two of that pair not reddening a perturbation of the filtered
    exit code: **a third claim mistaken for a restatement of one already guarded**.

  **No rank is published and no entry is opened**, because there is no form here to sweep for: an empty
  population, a weak assertion, a narrowed predicate, a missing direction and an unnoticed third branch
  are five different defects. What they share is not a mechanism but a discovery: **a reread of every
  one of them says it looks correct**, and not one was found by rereading - they were found by a mutant,
  by a neighbouring guard naming its own cause, by a character sweep, and twice by perturbing a module
  to see what noticed. That is evidence for the two gestures above rather than a sixth rule.
- Distinguish what you **measured** (quote the command and its output) from what you **assume**.
  A coherent explanation is not a measurement.
- **Read the exit code of the thing being asked about, never the last one of the wrapper around it.**
  A replay launched as a background command whose last statement was a timestamp reported success while
  the replay itself had exited 1 with four batteries disagreeing - and the wrapper's nought is what a
  reader is shown. The existing rule covers a code masked by a pipe and does not reach this: the code
  has to be captured from the command that produced it, at the point it produced it. ADR-0199.
- Report what you left out. Never narrow the scope silently.

**How a figure is published.** The same discipline, on prose rather than on guards. Each is argued in
the record beside it.

- When a sentence can be true without counting, it does not count. That is the form to reach for
  first. ADR-0018.
- A count that survives carries its coordinates: the commit it was measured at, and the population
  counted. ADR-0018.
- A dated number followed by a present-tense claim about the same quantity publishes a truth and a lie
  in one sentence, and it is the lie the reader believes. The clause carries the stamp, or it is
  stated at the commit, or it is not written. ADR-0018.
- **Two figures taken at two commits are not one state.** Each can carry its own coordinate and be
  true of it, and the sentence that puts them side by side describes a repository that never existed —
  *61 mutants against 427 guards*, where 61 is `7c9906c` and 427 is `03ac68c` and the pair holds at
  neither. It is the rule above applied between two figures rather than between a figure and the clause
  beside it, so the same remedy answers it: the pair is rebuilt at one commit, never checked half by
  half, because each half passes. ADR-0018.
- A property settles exactly the decisions its alphabet represents, and no others. A named case is not
  bookkeeping beside it, and a battery mutant is what says which of the two settles a decision.
  ADR-0021.
- **An address is not a figure**, and it leaves a comparison by both sides or by neither. A run of
  digits is not evidence of a figure; what decides is the rendering. ADR-0030.
- **A rename may move a name; it may not move a reading.** The test is not *is this a record?* but
  **would replaying this produce this text?** It points in two directions, which is what makes it a
  test rather than a preference: for text this repository's own fixture produced, renaming is what
  restores reproducibility; for a probe taken outside it, on inputs the probe itself named and stamped,
  renaming makes it a transcript of a run nobody performed. ADR-0142.
- **A static check passing does not mean the interface works.** A whole class of defect is only visible
  in a real browser, and this repository has paid for that class twice. ADR-0028.
- **A report may state what it observed; it may not name a cause it did not measure**, and an invented
  cause is not repaired by a list of candidates. **An inference offered with its premise is argument; a
  conclusion offered alone is assertion.** ADR-0042.
- Where a sentence claims something happened, compute it from the thing that happened rather than
  asserting it beside. **A sentence that cannot be false is worth more than a sentence somebody
  checked.** ADR-0043.
- A total map over a union beats a pass over real data: the first cannot fail to be complete, the
  second covers what the data happens to reach. **A guard that fires at the right future moment is
  worth more than one that covers the past.** ADR-0055.
- Before measuring a rate, ask whether the guard polices the step the mutant breaks, and whether the
  thing is stochastic at all. **Vary one input at a time and look for a cell that is 0 of *n* or *n* of
  *n*.** ADR-0053.
- **A run of zero over *n* trials bounds nothing until *n* is put beside the rate being looked for.**
  ADR-0056.
- **No rate obtained by reproducing a generator is trustworthy to better than an order of magnitude.**
  The miss rate is a per-draw probability raised to the draw count, so a 25 % error on the input is a
  factor of seven on the answer. Quote the order, name the draw count it was raised to, and let real
  runs decide anything finer. ADR-0077.
- **A repair is chosen for its margin, never for its precision**: take the one whose margin swallows
  the known uncertainty of the method. A repair improving a rate by the factor that method may be wrong
  by has bought nothing that survives its own error bar. ADR-0077.
- **A bound extrapolated from one member of a population states the cost of that member.** A replay was
  priced at 1 h 45 to 2 h 30 and took 60 min 14 s, the estimate having been calibrated on
  `validation-stage-1` - the cheapest battery there is, at 0.92 of the runner's time - and that ratio
  applied to all twenty-three. Measured at `05a193c`, the ratio runs **0.48 on `cli-install` and on
  `site`, 0.92 on `validation-stage-1`, 1.00 on `registry-storage`**, because what throttles a cell is
  not the same thing in each. **A light battery does not calibrate a heavy one**, and the remedy is the
  one ADR-0169 already took for the Windows bound: derive it from readings across the population rather
  than from the convenient one. ADR-0199.
- **And one reading of a battery does not calibrate that battery better than to about a sixth.** The
  four timed twice on this machine, at `05a193c` and at `257425c`, on work that did not change:
  `validation-stage-1` 55.4 s then 55.6 s, `registry-storage` 1 141.5 s then 1 109.7 s, `site` 635.4 s
  then 686.4 s, `cli-install` 729.4 s then **622.6 s, which is −14.6 %**. So two runs of one battery
  on one machine differ by up to 15 %, and the spread is on the heavy ones where the light one is
  stable to a half of one per cent. It is the floor under every bound derived from a reading, it comes
  before any question of extrapolating to a second battery, and it was written nowhere. ADR-0200.
- **A figure a busy machine can move carries the machine as well as the commit.** ADR-0018 asks a
  count for its coordinates and a coordinate is a commit, which is right for almost everything counted
  here - guards, cells, bytes, addresses, selectors are functions of the tree. **The trap is between a
  count and a duration.** That a duration is not fixed by its commit has been measured twice and
  written down neither time: two runs of identical work at one commit came back 1 541 s and 1 319 s,
  and one reading of a battery calibrates it no better than to about a sixth. What ADR-0204 met is
  sharper and is why the clause exists: **a count derived from a run looks like a function of the tree
  and is not.** `alone`, `never alone` and `one companion away` are counts rebuilt by a stated rule,
  and one of them moved because a machine was busy - a reader meeting `317 alone` has no reason to ask
  what else was running. So the rule reaches durations *and* counts of what a run observed, which is
  every figure the attribution and the census produce. **It does not make such a figure stable**: a
  bound makes a crossing unlikely and never impossible, a reading makes it visible, and the coordinate
  is what lets a reader tell two honest figures apart afterwards. ADR-0169, ADR-0200, ADR-0205.

## Asking questions

On a genuine ambiguity, blocker, or trade-off: stop and ask directly in the conversation, in prose.
Never use the `AskUserQuestion` tool. Resolve trivia yourself.
