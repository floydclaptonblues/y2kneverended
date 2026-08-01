const PPQ = 480;
const ROOTS = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const INTERVALS = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7]
};

const status = document.getElementById('midiStatus');
const preview = document.getElementById('notePreview');

function parseProgression() {
  const raw = document.getElementById('progression').value.trim();
  if (!raw) throw new Error('Enter at least one chord.');
  const octave = Number(document.getElementById('octave').value);
  return raw.split(/[\s,|]+/).filter(Boolean).map((symbol) => parseChord(symbol, octave));
}

function parseChord(symbol, octave) {
  const match = symbol.match(/^([A-Ga-g])([#b]?)(maj7|m7|sus2|sus4|dim|aug|m|7)?$/);
  if (!match) throw new Error(`Unsupported chord: ${symbol}`);
  const rootName = match[1].toUpperCase() + match[2];
  const quality = match[3] || '';
  const root = ROOTS[rootName];
  if (root === undefined || !INTERVALS[quality]) throw new Error(`Unsupported chord: ${symbol}`);
  const rootMidi = 12 * (octave + 1) + root;
  const notes = INTERVALS[quality].map((interval) => rootMidi + interval);
  return { symbol, notes };
}

function noteName(midi) {
  const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function variableLength(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= ((value & 0x7f) | 0x80);
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

function u16(value) {
  return [(value >> 8) & 0xff, value & 0xff];
}

function u32(value) {
  return [(value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

function textBytes(text) {
  return [...new TextEncoder().encode(text)];
}

function makeEvents(chords) {
  const tempo = Math.max(30, Math.min(260, Number(document.getElementById('tempo').value) || 100));
  const beats = Number(document.getElementById('beats').value);
  const velocity = Number(document.getElementById('velocity').value);
  const program = Number(document.getElementById('program').value);
  const pattern = document.getElementById('pattern').value;
  const chordTicks = beats * PPQ;
  const events = [];
  const micros = Math.round(60000000 / tempo);

  events.push({ tick: 0, order: 0, bytes: [0xff, 0x51, 0x03, (micros >> 16) & 0xff, (micros >> 8) & 0xff, micros & 0xff] });
  events.push({ tick: 0, order: 1, bytes: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08] });
  events.push({ tick: 0, order: 2, bytes: [0xc0, program] });

  chords.forEach((chord, index) => {
    const start = index * chordTicks;
    if (pattern === 'block') {
      chord.notes.forEach((note) => events.push({ tick: start, order: 4, bytes: [0x90, note, velocity] }));
      chord.notes.forEach((note) => events.push({ tick: start + chordTicks - 1, order: 3, bytes: [0x80, note, 0] }));
      return;
    }

    const sequence = pattern === 'broken'
      ? [chord.notes[0], chord.notes[Math.min(2, chord.notes.length - 1)], chord.notes[Math.min(1, chord.notes.length - 1)], chord.notes[Math.min(2, chord.notes.length - 1)]]
      : chord.notes;
    const step = Math.max(1, Math.floor(chordTicks / sequence.length));
    sequence.forEach((note, seqIndex) => {
      const on = start + seqIndex * step;
      const off = Math.min(start + chordTicks - 1, on + Math.floor(step * 0.82));
      events.push({ tick: on, order: 4, bytes: [0x90, note, velocity] });
      events.push({ tick: off, order: 3, bytes: [0x80, note, 0] });
    });
  });

  events.sort((a, b) => a.tick - b.tick || a.order - b.order);
  return events;
}

function buildMidi(chords) {
  const events = makeEvents(chords);
  const track = [];
  let previousTick = 0;
  events.forEach((event) => {
    track.push(...variableLength(event.tick - previousTick), ...event.bytes);
    previousTick = event.tick;
  });
  track.push(0x00, 0xff, 0x2f, 0x00);

  const header = [...textBytes('MThd'), ...u32(6), ...u16(0), ...u16(1), ...u16(PPQ)];
  const trackChunk = [...textBytes('MTrk'), ...u32(track.length), ...track];
  return new Uint8Array([...header, ...trackChunk]);
}

function showPreview() {
  try {
    const chords = parseProgression();
    preview.value = chords.map((chord) => `${chord.symbol}: ${chord.notes.map(noteName).join(', ')}`).join('\n');
    status.textContent = `${chords.length} chord(s) parsed successfully.`;
    return chords;
  } catch (error) {
    preview.value = '';
    status.textContent = error.message;
    return null;
  }
}

document.getElementById('preview').addEventListener('click', showPreview);
document.getElementById('downloadMidi').addEventListener('click', () => {
  const chords = showPreview();
  if (!chords) return;
  try {
    const bytes = buildMidi(chords);
    const blob = new Blob([bytes], { type: 'audio/midi' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'y2k-chord-progression.mid';
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    status.textContent = `Downloaded a ${bytes.length}-byte Standard MIDI File.`;
  } catch (error) {
    status.textContent = `MIDI generation failed: ${error.message}`;
  }
});

showPreview();
