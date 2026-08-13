# MH370 archived baseline model

This directory preserves the public artifacts currently available for the project's original point-of-impact baseline.

## Status

- Historical POI: **31.4° S, 90.4° E**
- Historical operational search radius: **20 km**
- Historical reported 95% bounds: **31.1–31.7° S, 89.8–91.0° E**
- Classification: **ARCHIVED / SUPERSEDED**
- Replication status: **PARTIAL**

The archived POI is retained for comparison with the current SATCOM + trajectory + drift reconstruction. It is **not** the project's current search recommendation.

The original executable environment, complete solver state, dependency lockfile, dataset hashes, optimizer history, and all intermediate numerical artifacts are not present in this public replication pack. For that reason, the interface distinguishes preserved observations and geometry from historical model claims instead of presenting the archived result as a newly reproduced solution.

## Included artifacts

- `mh370_bfo_timeseries.csv` — selected BFO observations from the public Inmarsat log used in the historical write-up.
- `mh370_poi_31_4S_90_4E_radius20km.geojson` — 20 km geodesic search ring around the archived POI.
- `mh370_poi_31_4S_90_4E_radius20km.csv` — search-ring vertices in CSV form.
- `mh370_replication_manifest.json` — metadata accompanying the historical export.

## Provenance classes used by the public interface

- **OBSERVED** — source measurement or record.
- **DERIVED** — deterministic transformation or geometry generated from stated inputs.
- **MODELED** — output of a model or numerical procedure.
- **INFERRED** — interpretation or candidate conclusion.

For this archive, the BFO points are displayed as **OBSERVED**, the 20 km ring as **DERIVED**, and the POI / reported credible bounds as **INFERRED — HISTORICAL**.
