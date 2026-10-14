# Full-year numerical comparison — 3-hour against 6-hour, all 365 days

## Why this had to be run

The previous numerical check compared 3 h and 6 h integrations over **182 days** and reported that every gate fraction agreed to within 3 objects in 481. The western gates were listed in that table as "0 and 0, difference 0".

**That agreement was vacuous.** In the 6 h year, the first westward crossing of 80° E occurred on **day 194**. The comparison ended twelve days before any western crossing existed. The thirteen western crossers — the central quantitative result of the experiment — were presented inside a table of agreements while being entirely untested. This report closes that gap.

## Checkpoint and resume, and its verification

The execution environment limits a single command to roughly 120 s and does not preserve background processes; the 3 h year requires about 135 s. A deterministic checkpoint/resume facility was added to the runner, preserving particle identities and release coordinates, current positions, statuses, cumulative path lengths, all extrema and their times, every gate first-crossing and return state, the accumulated event list, the completed day index, and the experiment configuration. Writes are atomic (temporary file, flush, fsync, rename) and occur at completed UTC day boundaries. Trajectory output is appended; a resumed run does not reseed, does not rewrite the header, and does not repeat events. A resume whose configuration differs from the checkpoint is refused rather than silently reconciled. The transport equations and numerical scheme are untouched.

Three verifications, all required before the long run:

| check | result |
|---|---|
| 20 days continuous versus the same 20 days as 12 + 8 resumed | **bit-identical** in all four output files: daily trajectories, particle summary, crossing events, group summary |
| duplicate and repeat integrity on the resumed run | 10,101 trajectory rows, 10,101 unique (date, object); 35 events, 35 unique |
| resumed 365-day run at its day-182 checkpoint versus the previously archived 182-day 3 h run | maximum position difference **0.000 m**, 0 status mismatches, maximum path-length difference 0.000 km |

Final integrity on the completed 3 h year: 176,046 trajectory rows, 176,046 unique; 1,592 events, 1,592 unique.

## Western access — the result that was untested

| gate | 6 h | 3 h | change | same objects? |
|---|---:|---:|---:|---|
| 80° E west | 13 | 11 | −2 | **4 shared**, 9 only at 6 h, 7 only at 3 h |
| 70° E west | 4 | 5 | +1 | 2 shared, 2 only at 6 h, 3 only at 3 h |
| 60° E west | 2 | 3 | +1 | 2 shared, 0 only at 6 h, 1 only at 3 h |
| 50° E west | 1 | 2 | +1 | 1 shared, 0 only at 6 h, 1 only at 3 h |
| 100° E east | 451 | 452 | +1 | 445 shared |
| 105° E east | 397 | 399 | +2 | 377 shared |
| 110° E east | 328 | 330 | +2 | 312 shared |

**The rate is stable; the identities are not.** Western access remains 2–3% of the ensemble at 80° E and a single-digit count at every gate beyond it, under a halved timestep. But only 4 of the 13 original western crossers cross again. Nine of them do not, and seven different objects do instead.

This is the expected behaviour of a rare event in a chaotic flow and it carries a firm methodological consequence: **the population rate of western access is a supportable quantity; the identity of any individual western crosser is not.** The earlier report named thirteen specific objects with their release cells and final positions. Those tables should be read as one realisation of a rate, never as thirteen objects that got west.

First-passage dates for the four objects crossing 80° E in both runs shift by a median of −50 days, up to 65 days. The timing of a western crossing is not resolved either.

Release-group origin of the 80° E crossers:

| | 33° S | 35.5° S | 37.5° S |
|---|---:|---:|---:|
| 6 h | 9 | 3 | 1 |
| 3 h | 5 | 6 | 0 |

**The northern-origin finding survives and is slightly strengthened.** In both runs every western crosser originates at 33° S or 35.5° S, save a single 37.5° S object at 6 h that does not reproduce. No object released at or south of 36.5° S reached a western gate in either integration.

## Cartwheel outcomes

Chronological classification of the 240 cartwheel-band objects (full detail in `CARTWHEEL_CHRONOLOGY.md`):

| | 6 h | 3 h |
|---|---:|---:|
| went south, then a westward episode | 57 | 68 |
| sustained westward run (≥ 60 d, ≥ 5°) | 29 | 24 |
| crossed any western gate | 4 | 6 |
| ever west of 85° E | 58 | 57 |

The conclusion is unchanged under refinement: the proposed motion is common, sustained westward runs occur, and conversion into transport reaching the western Indian Ocean does not. The gate-crossers in the band had zero southward excursion in both runs.

## Eastern censoring, with the categories kept apart

| | 6 h | 3 h |
|---|---:|---:|
| still active at day 365 | 246 | 259 |
| `DOMAIN_EXIT` | 91 | 105 |
| `MASK_OR_INTERPOLATION_EXIT` | 144 | 117 |
| total terminated | 235 (48.9%) | 222 (46.2%) |

Where terminations occurred:

| | 6 h | 3 h |
|---|---:|---:|
| beyond 119.5° E — at the eastern edge of the downloaded domain | 196 | 192 |
| 113–119.5° E — inside the domain, consistent with the Australian shelf and coast | 39 | 28 |
| west of 113° E | 0 | 2 |

**These are different things and must not be merged.** Terminations beyond 119.5° E are censoring by the boundary of the data subset: the object left the experiment and its later behaviour is unknown. Terminations between 113° E and 119.5° E occur inside the domain, where the velocity field is masked — consistent with the Australian coast near Cape Leeuwin, but not demonstrated to be land contact without a coastline product. Two objects at 3 h terminated west of 113° E; these are isolated masked cells in open water and are the only candidates for a genuine numerical or data defect. No true integration failure was identified.

The total terminated changes by 13 objects and the split between the two exit categories moves by 27, which is the least stable classification in the comparison. The physical statement — roughly half the ensemble leaves eastward — holds; the label attached to any individual departure does not.

## Ensemble diagnostics

| quantity | 6 h | 3 h | change |
|---|---:|---:|---:|
| median furthest south | −38.681° | −38.686° | −0.005° |
| median furthest east | 114.942° E | 114.974° E | +0.032° |
| median net displacement | 2,141.5 km | 2,133.6 km | −8.0 km (−0.4%) |
| **median path length** | **5,193.8 km** | **5,473.5 km** | **+279.7 km (+5.4%)** |
| **median tortuosity** | **2.270** | **2.463** | **+0.192 (+8.5%)** |
| east-then-west reversal flag | 222 | 235 | +13 |

Furthest south, furthest east and net displacement are stable. **Path length and tortuosity are not, and they move in the direction that says they are resolution-limited rather than converged**: a shorter step resolves more of the real meandering, so measured path length grows. Tortuosity therefore sets a *lower bound* on stirring, not an estimate of it, and the earlier figures (median 3.01 in the cartwheel band, 4.84 at 33° S) should be read that way. The recurrence-based eddy-residence measure in the chronology report is preferable precisely because it depends on positions rather than on accumulated arc length.

## Individual trajectories

Among the 225 objects active at day 365 in both runs, corresponding positions differ by a median of **846 km**, a 90th percentile of 1,807 km and a maximum of 4,230 km.

At 182 days the same comparison gave a median of 54 km. Separation has grown roughly sixteenfold over the second half of the year, which is the expected signature of chaotic advection in an eddy-rich flow.

## Verdict

**The central transport findings are stable under this timestep refinement.** Stated in the language the evidence supports:

- Western access remains rare — 2–3% at 80° E, single digits beyond — and remains confined to release latitudes of 33° S and 35.5° S.
- Eastward transport remains overwhelming: 93–94% past 100° E.
- The cartwheel's constituent motions remain common and continue not to convert into westward delivery.
- Roughly half the ensemble continues to terminate against the eastern side of the domain.

Three things this comparison does **not** establish, and that no single refinement could:

1. **It is a sensitivity test, not a proof of convergence.** One halving of the step shows the aggregate results are insensitive to it. It does not demonstrate that they have converged to a limit, and that claim is not made. Chaotic advection amplifies small numerical differences but does not abolish finite-time convergence for a sufficiently regular prescribed flow; establishing it would require a sequence of refinements, which was not run and is not proposed, because the aggregate quantities are already stable at the level the conclusions use.
2. **Path length and tortuosity are not stable** and are reported as bounds.
3. **Individual identity and timing are not resolved at all** — not which objects go west, and not when.

### Smallest relevant follow-up

If a further check is wanted, the minimum useful one is a **1.5 h run of a reduced subset** — the 120 objects released at 33° S and 35.5° S, the only latitudes that produced western access — to test whether the western-access *rate* holds at a third refinement and whether path length is approaching a limit. That is roughly 70 s of compute in two segments. A full-ensemble 1.5 h year, a diffusivity sweep or a slip sweep are **not** warranted by anything in this comparison.
