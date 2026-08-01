# Y2K Never Ended .Net

**The Free, Helpful Worldwide Web**

A static collection of free browser tools.

## Working tools

- `audio/midi-generator.html` — creates downloadable Type 0 Standard MIDI Files from chord progressions.
- `tools/pdf/index.html` — merges PDFs, extracts selected pages, and rotates pages locally in the browser.
- `instruments/index.html` — playable polyphonic Web Audio synthesizer with keyboard, pointer, touch, and optional MIDI input.
- `audio/prompt-builder.html` — creates structured audio-production and MIDI requests from user-supplied details.
- `3d/index.html` — seeded procedural landscape generator with PNG export.

## Separate documentation

- `field-systems/index.html` — links to the aircraft-search technical record and adversarial review package.
- `lab/index.html` — problem-record template.
- `methods/index.html` — project rules and limitations.

These documentation pages are not presented as software tools.

## Technical notes

The site is static and dependency-light. The PDF desk loads `pdf-lib` from jsDelivr; selected documents remain in browser memory and are not uploaded by the site code.

To run locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The custom domain will not be configured until the working-tool set is ready for launch.
