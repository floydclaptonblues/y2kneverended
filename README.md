# MH370 Modeling System

This repository hosts the public-facing MH370 modeling project at `mh370modeling.y2kneverended.net`.

The interface retains its Windows 98-era engineering-workstation design, but its scientific content now distinguishes three things explicitly:

1. the **current clean reconstruction state**;
2. the **active aircraft-performance and execution gates**;
3. the **archived historical baseline**, preserved separately for provenance and comparison.

## Current state

Public checkpoint updated September 7, 2026: **G1F_PASS**, completed September 6, with **68/68 synthetic light-time checks across 17 journeys**. The main page includes the summary and Math / Gates details. Earlier numerical and aircraft-performance records are explicitly carried forward from September 4. G1F does not establish a trajectory posterior or clear the performance gate.

Top-level public status:

`NO_PREDICTIVE_EXECUTION_AUTHORIZED`

The clean post-anchor SATCOM target, observation-ownership repair, source-locked terminal message policy, limited-envelope Jacobian/optimizer checkpoint, conditioned mode catalog and ocean-forcing asset are represented in the main interface.

The full event-sequential S50 posterior has not run. No current endpoint, credible region, drift-origin ranking or search recommendation is claimed. The blocking dependency is an occurrence-mapped Boeing 777-2H6ER / Trent 892B-17 performance source and its authorized runtime qualification.

See [`current/README.md`](current/README.md) for the human-readable checkpoint and [`data/current-program-state.json`](data/current-program-state.json) for the machine-readable state.

## Archived baseline

The original 31.4°S, 90.4°E model remains under `archive/baseline/` and is displayed in the **Archive Baseline** tab. It is historical and superseded for current scientific inference, but retained rather than deleted.

## Structure

- `index.html` — application shell and current scientific panels
- `styles.css` — original Win98 / engineering-workstation visual system
- `current-state.css` — current-state additions without redesigning the base UI
- `app.js` — current diagnostic map, tabs, archive loading and interface interactions
- `data/current-program-state.json` — structured public checkpoint
- `current/README.md` — current-state methodology and status
- `archive.css` — archived-baseline presentation
- `archive/baseline/` — preserved historical model package
- `CNAME` — custom domain target

No framework or build step is required.
