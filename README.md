# MH370 Modeling System

This repository is now dedicated exclusively to the public-facing MH370 modeling project at `mh370modeling.y2kneverended.com`.

The first implementation is deliberately a visual/interface prototype. It establishes the design language before the scientific data layer is connected:

- Windows 98-era technical workstation chrome
- analog switchboard / instrumentation density
- schematic map and plotting surfaces
- explicit OBSERVED / DERIVED / MODELED / INFERRED provenance vocabulary
- SATCOM, solver, residual, drift, and run-log workspaces
- no modern dashboard/card aesthetic

## Current state

The numeric displays in this first visual pass are representative interface content and must not be treated as the canonical published model dataset unless explicitly marked otherwise in the interface. Scientific records will be wired to provenance-tagged source data in later passes.

## Structure

- `index.html` — application shell and instrument panels
- `styles.css` — Win98 / engineering-workstation visual system
- `app.js` — lightweight UI interactions
- `CNAME` — custom domain target

No framework or build step is required.
