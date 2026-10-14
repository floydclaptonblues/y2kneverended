# Cartwheel chronology — does the motion occur, as distinct from ending west?

**This report corrects an error in the previous one.** The earlier result reported that `south_then_west_2deg` was zero for all 240 objects released between 35.5° S and 38.7° S, and presented that as showing the proposed motion never occurred. It does not show that. The quantity is an **endpoint condition**: it asks whether an object *finished* at least 2° west of its release longitude, having at some point been at least 0.5° south of its release latitude. An object could travel south, run west for two months, turn, and end east — and the flag would read zero.

The chronological question was therefore never asked. It is asked here, against the saved daily positions of the completed 365-day integrations at both 6 h and 3 h.

## Definitions, fixed before computing

Because the failure being corrected is precisely a definition read as something it was not, each term is stated operationally.

| term | definition |
|---|---|
| southward excursion | reaches ≥ 0.5° south of its own release latitude at any time (the same threshold the old flag used, so the comparison is like-for-like) |
| westward episode | a maximal interval over which longitude falls by ≥ 2.0°, tolerating reversals below 0.25° so eddy jitter does not fragment one episode |
| sustained westward | an episode lasting ≥ 60 days **and** covering ≥ 5° of longitude, or any crossing of 80/70/60/50° E |
| transient westward | an episode ≥ 2° that is not sustained |
| eddy residence | the fraction of days on which the object lies within 50 km of a position it held at least 30 days earlier — a recurrence test, i.e. it came back to where it had been |

**Temporal resolution is one sample per day.** The integrations advanced at 6 h and 3 h, so three (or seven) of every four (or eight) computed positions are absent from the saved file. Loops closing faster than about two days are invisible here. Nothing is inferred about what happened between saved samples.

### A metric artifact, found and corrected

The recurrence test was first computed over all 366 saved rows. Objects that terminate keep their final position in the file for every subsequent day, so a terminated object scores as perfectly recurrent — it is within 50 km of where it was a month ago because it has not moved. That inverted the result: it made recurrence appear to *rise* toward the south, where terminations are most common. Recomputed over each object's active days only, recurrence falls from north to south, which is consistent with every other stirring measure. The uncorrected figures are not used.

## The answer: the motion occurs, and it is common

Cartwheel band, 35.5°/36.5°/37.5°/38.7° S, n = 240:

| | 6 h year | 3 h year |
|---|---:|---:|
| reached ≥ 0.5° south of release latitude | 99 (41%) | 101 (42%) |
| had any westward episode ≥ 2° | 180 (75%) | 194 (81%) |
| **went south, then had a westward episode afterwards** | **57 (24%)** | **68 (28%)** |
| had a sustained westward run (≥ 60 d and ≥ 5°) | 29 | 24 |
| largest single westward run, any object | 36.4° | 35.4° |
| longest single westward run, any object | 172 days | 183 days |
| ever reached west of 85° E | 58 | 57 |
| **crossed any western gate (80/70/60/50° E)** | **4** | **6** |

**The old "0 of 240" was wrong as a statement about the mechanism.** Between a quarter and a near-third of the band performed the proposed sequence — south, then a substantial westward run — and about one in ten sustained a westward run for two months or more, in some cases across more than 30° of longitude. Genuine eddy residence is present too: 95 of 240 objects (40%) revisit a position they held a month or more earlier, which is a stronger statement than the high path-to-displacement ratio reported previously, because recurrence tests for actual return rather than for mere wandering.

## What fails is the last step, not the mechanism

| outcome, cartwheel band | 6 h | 3 h |
|---|---:|---:|
| A — sustained westward transport through a gate | 4 | 6 |
| B — sustained westward run, no gate reached | 25 | 20 |
| C — south → west temporarily → east again | 49 | 63 |
| D — east → west temporarily → east again | 89 | 94 |
| E — eastward throughout | 60 | 46 |
| F — net west, no qualifying episode or gate | 13 | 11 |

Classes C and D together — the transient westward excursions that reverse — account for 138 of 240 at 6 h and 157 at 3 h. Class B objects run west substantially and still do not reach the western Indian Ocean. **The proposed sequence happens; it does not complete.** Westward motion within this band is an oscillation of the eddy field, and the eastward mean flow reasserts itself.

The median object in the band reached a westernmost longitude of 88.5° E, against release longitudes of 85–98° E. Only 7 of 240 ever got west of 82° E.

## The decisive detail: the objects that got west did not go south

Of the 13 objects in the whole 481-object ensemble that crossed 80° E in the 6 h year, **nine never went 0.5° south of their release latitude at all**, and the four that did went south by 0.46° to 1.98°, within the first 37 days, before turning north. **All four of the gate-crossers released within the cartwheel band had a southward excursion of exactly zero.**

Their final latitudes run from 10.8° S to 29.3° S. The route west is equatorward into the subtropical gyre and then west along its northern limb as the South Equatorial Current.

So southward excursion and western access are not merely unrelated in this year — among the objects that reached the west, going south is **absent**. That is the sharpest available statement against the proposed mechanism, and it is a chronological one rather than an endpoint one.

## Representative objects

| id | release | southward excursion | largest westward run | westernmost | outcome |
|---|---|---:|---:|---:|---|
| 93 | 35.5° S 90° E | 0.00° | 36.39° over 172 d | 47.81° E | crossed all four western gates; ends 10.75° S |
| 94 | 35.5° S 90° E | 0.00° | 28.55° over 133 d | 63.45° E | crossed 80° and 70° E; ends 25.94° S |
| 65 | 35.5° S 85° E | 0.76° (day 61) | 12.15° after going south | 82.47° E | south → west → **east again**, ends 3.5° east of release |
| 132 | 36.5° S 88° E | 0.81° (day 30) | 11.28° after going south | 87.94° E | south → west → east again |
| 173 | 36.5° S 98° E | 0.00° | 14.53° over 76 d | 87.79° E | sustained westward run, no gate reached |
| 294 | 38.7° S 98° E | 0.00° | none | — | eastward throughout; terminated at the eastern data edge |

Objects 65 and 132 are the cartwheel as proposed, executed in full for two to four months, and then undone.

## G0

The G0 conditional control (38.70590° S, 90.41482° E) went 1.48° south by day 34 — more than most of the band — and then **never had a westward episode of 2° at all**, in either integration. Its westernmost longitude all year was 88.75° E at 6 h, under 2° west of release. It reached its furthest east on day 242 and left the eastern data boundary. Outcome class E in both runs.

This is a statement about where that coordinate sits in the 2014–15 circulation. It is not evidence about the aircraft, and no probability attaches to it.

## Does the original conclusion survive?

**The conclusion survives; the reasoning given for it did not.**

- Wrong as stated: "the specific motion the idea requires occurred zero times in 240." It occurred 57 times at 6 h and 68 at 3 h.
- Correct, and now properly supported: sustained southern-to-western transport delivering material to the western Indian Ocean did not occur from this band. Four objects of 240 at 6 h, six at 3 h, reached any western gate — and every one of those had no southward excursion whatever.

The distinction matters beyond bookkeeping. The first version implied the ocean does not produce this kind of motion in this region, which is false and would have been easy to falsify. What the data supports is narrower and more durable: **the motion is routine, and it does not convert into westward delivery.**
