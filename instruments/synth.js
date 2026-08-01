const keyMap = [
  ['a', 0, 'C'], ['w', 1, 'C♯'], ['s', 2, 'D'], ['e', 3, 'D♯'], ['d', 4, 'E'],
  ['f', 5, 'F'], ['t', 6, 'F♯'], ['g', 7, 'G'], ['y', 8, 'G♯'], ['h', 9, 'A'],
  ['u', 10, 'A♯'], ['j', 11, 'B'], ['k', 12, 'C']
];

let audioContext;
let master;
let filter;
const voices = new Map();
const keyboard = document.getElementById('keyboard');
const status = document.getElementById('status');

function ensureAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    master = audioContext.createGain();
    master.gain.value = 0.22;
    filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Number(document.getElementById('cutoff').value);
    filter.connect(master).connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') audioContext.resume();
}

function midiNumberFor(semitone) {
  const octave = Number(document.getElementById('octave').value);
  return 12 * (octave + 1) + semitone;
}

function frequencyFor(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function noteOn(id, midi) {
  ensureAudio();
  if (voices.has(id)) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = document.getElementById('waveform').value;
  oscillator.frequency.value = frequencyFor(midi);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(1, now + Number(document.getElementById('attack').value));
  oscillator.connect(gain).connect(filter);
  oscillator.start(now);
  voices.set(id, { oscillator, gain });
  document.querySelector(`[data-note-id="${CSS.escape(String(id))}"]`)?.classList.add('active');
}

function noteOff(id) {
  const voice = voices.get(id);
  if (!voice || !audioContext) return;
  const now = audioContext.currentTime;
  const release = Number(document.getElementById('release').value);
  voice.gain.gain.cancelScheduledValues(now);
  voice.gain.gain.setTargetAtTime(0.0001, now, Math.max(0.01, release / 4));
  voice.oscillator.stop(now + release + 0.1);
  voices.delete(id);
  document.querySelector(`[data-note-id="${CSS.escape(String(id))}"]`)?.classList.remove('active');
}

function stopAll() {
  [...voices.keys()].forEach(noteOff);
  status.textContent = 'All notes stopped.';
}

keyMap.forEach(([key, semitone, label]) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `key ${label.includes('♯') ? 'sharp' : ''}`;
  button.dataset.noteId = key;
  button.innerHTML = `<span>${label}</span><small>${key.toUpperCase()}</small>`;
  const start = (event) => { event.preventDefault(); noteOn(key, midiNumberFor(semitone)); };
  const stop = (event) => { event.preventDefault(); noteOff(key); };
  button.addEventListener('pointerdown', start);
  button.addEventListener('pointerup', stop);
  button.addEventListener('pointercancel', stop);
  button.addEventListener('pointerleave', (event) => { if (event.buttons) stop(event); });
  keyboard.appendChild(button);
});

window.addEventListener('keydown', (event) => {
  if (event.repeat || event.target.matches('input, select, textarea')) return;
  const found = keyMap.find(([key]) => key === event.key.toLowerCase());
  if (found) noteOn(found[0], midiNumberFor(found[1]));
});
window.addEventListener('keyup', (event) => noteOff(event.key.toLowerCase()));
window.addEventListener('blur', stopAll);
document.getElementById('panic').addEventListener('click', stopAll);

[['octave','octaveOut',''], ['attack','attackOut','s'], ['release','releaseOut','s'], ['cutoff','cutoffOut','Hz']].forEach(([id,out,suffix]) => {
  document.getElementById(id).addEventListener('input', (event) => {
    document.getElementById(out).textContent = `${event.target.value}${suffix}`;
    if (id === 'cutoff' && filter) filter.frequency.setTargetAtTime(Number(event.target.value), audioContext.currentTime, .02);
  });
});

document.getElementById('midiButton').addEventListener('click', async () => {
  if (!navigator.requestMIDIAccess) {
    status.textContent = 'Web MIDI is not available in this browser.';
    return;
  }
  try {
    const access = await navigator.requestMIDIAccess();
    access.inputs.forEach((input) => {
      input.onmidimessage = ({ data }) => {
        const command = data[0] & 0xf0;
        const note = data[1];
        const velocity = data[2];
        const id = `midi-${note}`;
        if (command === 0x90 && velocity > 0) noteOn(id, note);
        if (command === 0x80 || (command === 0x90 && velocity === 0)) noteOff(id);
      };
    });
    status.textContent = `MIDI enabled. ${access.inputs.size} input(s) detected.`;
  } catch (error) {
    status.textContent = `MIDI permission failed: ${error.message}`;
  }
});
