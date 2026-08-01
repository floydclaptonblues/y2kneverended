const form = document.getElementById('promptForm');
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');

function value(id, fallback = 'Not provided') {
  const text = document.getElementById(id).value.trim();
  return text || fallback;
}

function buildPrompt() {
  return `You are reviewing a real audio-production task. Do not jump directly to plugin settings or generic advice. Separate observations, hypotheses, tests, and recommendations.

TASK
${value('task')}

WORKING ENVIRONMENT
DAW or system: ${value('daw')}
Tempo and meter: ${value('tempo')}
Key or tonal center: ${value('key')}

OBSERVED PROBLEM
${value('problem')}

RELEVANT TRACKS OR SOURCES
${value('tracks')}

AVAILABLE TECHNICAL EVIDENCE
${value('evidence')}

CHANGES ALREADY TESTED
${value('tried')}

DESIRED RESULT
${value('goal')}

CONSTRAINTS
${value('constraints')}

REQUIRED DELIVERABLE
${value('deliverable')}

RESPONSE RULES
1. Restate the problem in technical terms without changing the musical intent.
2. Rank plausible causes by likelihood and explain the evidence for each.
3. Provide a minimal test that can confirm or reject each cause before recommending a permanent change.
4. Distinguish phase cancellation, frequency masking, arrangement density, dynamics, tuning, timing, and monitoring problems rather than treating them as interchangeable.
5. Preserve any stated constraints.
6. State what cannot be determined from the supplied information.
7. Identify the next measurement, isolated stem, screenshot, or audio export that would most reduce uncertainty.
8. For MIDI work, specify tempo, meter, PPQ assumptions, track/channel assignments, measure boundaries, note ranges, velocity behavior, controller data, and file format. Do not claim to have created a valid MIDI file unless an actual file is attached or generated.`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  output.value = buildPrompt();
  feedback.textContent = 'Structured prompt generated locally.';
});

form.addEventListener('reset', () => {
  setTimeout(() => {
    output.value = '';
    feedback.textContent = '';
  }, 0);
});

document.getElementById('copyButton').addEventListener('click', async () => {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    feedback.textContent = 'Prompt copied.';
  } catch {
    output.select();
    document.execCommand('copy');
    feedback.textContent = 'Prompt copied using browser fallback.';
  }
});

document.getElementById('downloadButton').addEventListener('click', () => {
  if (!output.value) return;
  const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'audio-midi-ai-prompt.txt';
  link.click();
  URL.revokeObjectURL(link.href);
  feedback.textContent = 'Prompt downloaded.';
});
