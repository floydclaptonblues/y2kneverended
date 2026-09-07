# MH370 Modeling System — Current Public State

**Checkpoint:** 2026-09-07
**Top-level status:** `NO_PREDICTIVE_EXECUTION_AUTHORIZED`

This directory documents the current public state of the active reconstruction. It is separate from `archive/baseline/`, which preserves the historical 31.4°S, 90.4°E model and partial replication pack.

## Latest validated gate — G1F_PASS

**Result date:** September 6, 2026. **Run:** `20260906T195934Z_faee8e08`.
**Gate:** `G1F_SYNTHETIC_LIGHT_TIME_AND_FROZEN_APPROXIMATION`.

- Four distinct light-time legs were implemented.
- Forward and backward anchors recovered the same journey within the declared tolerance.
- Independent validation passed **68/68 checks across 17 synthetic journeys**, including analytic controls and independent Decimal-80 roots.
- Frozen comparisons use the signed convention **SnapshotMoving − frozen**, measured in microseconds. The largest-magnitude signed differences across the finite fixtures came from the synthetic stress case.

These are synthetic implementation checks. The stress-case differences do not establish a real-flight timing correction or endpoint displacement. G1F does not qualify the aircraft-performance model or establish a trajectory posterior.

Provenance: the completed G1F checkpoint summary supplied in the project conversation. The underlying `GATE_RESULT.json` is not included in this public repository and was not independently inspected for this website update. Exact per-fixture differences and numeric tolerances are therefore not reproduced. No validation or solver run was executed by this website update.

The remaining SATCOM, numerical, performance, catalog and drift records below are carried forward from the September 4 public checkpoint. Their inclusion does not claim a new execution or requalification under G1F.

## What is established

- The post-18:22 SATCOM target is `SATCOM_POST_ANCHOR_TARGET_V1` and is classified `CLEAN_TARGET_SCIENTIFICALLY_VALID`.
- The earlier temporal-ownership defect was repaired: pre-anchor BTO and BFO observations no longer inherit post-anchor trajectory parameters.
- The clean coarse target contains 26,952 finite evaluations.
- The conditioned mode catalog contains 128 modes.
- The limited-envelope numerical checkpoint used 16 underlying branches over five continuation levels, producing 80 continuation cases.
- The assembled Jacobian is 83 × 74 with effective rank 74, and its derivative checks passed.
- The fixed BTO timing bias and R600 Log-on Request timing-reference correction are source-locked and message-specific.
- The ocean-forcing asset is available: 85 Copernicus NetCDF files totaling approximately 8.44 GB.

## What is not established

- No current endpoint is claimed.
- The full event-sequential S50 posterior has not run.
- The score-distance endpoint bands are not confidence regions, credible regions or endpoint uncertainty.
- The 16 branches and 80 continuation cases do not constitute global posterior exploration.
- No current drift-origin ranking or search recommendation is authorized.
- Confirmed stationary convergence was not established by the historical nonlinear-programming checkpoint.

## Active hard stop

The current aircraft-performance source classification is:

`TIER2_B777_OPEN_PERFORMANCE_SOURCE_CANDIDATE_QUALIFICATION_V1_BLOCKED`

The exact Boeing Appendix 1.6E source-row lookup is available only as `GO_NONPREDICTIVE_ONLY`. It does not authorize interpolation, extrapolation, mode mapping, route scoring, fuel prediction or trajectory execution.

The target configuration remains:

- Boeing 777-2H6ER
- 9M-MRO
- MSN 28420
- WB175
- two RB211 Trent 892B-17 engines

No acquired public source yet supplies usable joint support over mass × altitude × Mach/TAS × temperature × aerodynamic configuration × engine state. An occurrence-applicable AFM/FCOM speed-limit chain, installed-engine cruise thrust/fuel representation and finite-maneuver evidence remain unresolved.

A version-4 dependency-acquisition launcher has been prepared to re-verify required package wheels. Its completed outcome was not recorded in the public checkpoint at the time of this update. It does not itself install, import, build or execute the candidate packages.

## Planned S50 architecture

The next inference engine is designed as event-sequential Sequential Monte Carlo:

1. begin from a broad, defensible radar-anchor prior;
2. propagate physically continuous trajectories to each SATCOM event;
3. assimilate BTO and BFO only at events that own those observations;
4. use adaptive tempering for sharp updates;
5. monitor ESS, unique ancestors and genealogical ESS;
6. resample under predeclared rules;
7. correct exactly for guided proposal densities;
8. rejuvenate path segments and nuisance parameters;
9. preserve complete ancestry and eventwise likelihood contributions;
10. smooth complete trajectories after the forward pass;
11. require multimodal retention and independent-seed agreement;
12. begin with a coarse whole-admissible-arc sweep before targeted refinement.

The intended output is a weighted posterior over complete trajectories and terminal states, not a favorite point.

## SATCOM constants currently shown by the public UI

- Residual convention: observed minus predicted.
- Fixed BTO bias: `−8,426,548 / 17 = −495,679.29411764705 µs`.
- R600 Request correction: `BTO_corrected = BTO_raw − 4,600 µs`.
- 18:25 Request: `17,120 → 12,520 µs`.
- 00:19:29 Request: `23,000 → 18,400 µs`; terminal BFO 182 Hz.
- 00:19:37 Acknowledge: raw BTO 49,660 µs; excluded from ordinary route likelihood; terminal BFO −2 Hz.

## Public files

- `../data/current-program-state.json` — machine-readable current checkpoint.
- `../index.html` — public interface shell.
- `../app.js` — current-map, archive and interface logic.
- `../current-state.css` — additions that retain the existing workstation design.
- `../archive/baseline/` — historical baseline package, kept separate and unchanged.
