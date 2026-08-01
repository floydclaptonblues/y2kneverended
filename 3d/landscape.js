const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const controls = ['roughness', 'water', 'sunX', 'haze'];

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function terrainPoints(random, baseY, amplitude, roughness, count = 160) {
  const points = [];
  let y = baseY;
  let drift = 0;
  for (let i = 0; i <= count; i += 1) {
    drift = drift * 0.72 + (random() - 0.5) * amplitude * roughness;
    const ridge = Math.sin(i * 0.12) * amplitude * 0.18 + Math.sin(i * 0.037) * amplitude * 0.24;
    y = Math.max(baseY - amplitude, Math.min(baseY + amplitude * .55, baseY + ridge + drift));
    points.push([i / count * canvas.width, y]);
  }
  return points;
}

function fillTerrain(points, color, bottom = canvas.height) {
  ctx.beginPath();
  ctx.moveTo(0, bottom);
  points.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.lineTo(canvas.width, bottom);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function render() {
  const seed = Number(document.getElementById('seed').value) || 1;
  const roughness = Number(document.getElementById('roughness').value);
  const waterLevel = Number(document.getElementById('water').value) * canvas.height;
  const sunX = Number(document.getElementById('sunX').value) * canvas.width;
  const haze = Number(document.getElementById('haze').value);
  const random = seededRandom(seed);

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#476a80');
  sky.addColorStop(.48, '#d5ad83');
  sky.addColorStop(1, '#f0d9b7');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const sunY = canvas.height * .22;
  const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 135);
  glow.addColorStop(0, 'rgba(255,248,204,.96)');
  glow.addColorStop(.25, 'rgba(255,210,139,.52)');
  glow.addColorStop(1, 'rgba(255,210,139,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(sunX, sunY, 38, 0, Math.PI * 2);
  ctx.fillStyle = '#fff0b6';
  ctx.fill();

  const far = terrainPoints(random, canvas.height * .45, 105, roughness * .55);
  const middle = terrainPoints(random, canvas.height * .58, 160, roughness * .82);
  const near = terrainPoints(random, canvas.height * .73, 210, roughness);
  fillTerrain(far, `rgba(79,88,91,${.42 + haze * .35})`);
  fillTerrain(middle, '#4b5350');

  const waterGradient = ctx.createLinearGradient(0, waterLevel, 0, canvas.height);
  waterGradient.addColorStop(0, 'rgba(89,132,145,.82)');
  waterGradient.addColorStop(1, '#284b56');
  ctx.fillStyle = waterGradient;
  ctx.fillRect(0, waterLevel, canvas.width, canvas.height - waterLevel);

  ctx.save();
  ctx.globalAlpha = .22;
  ctx.fillStyle = '#fff1c2';
  const reflectionWidth = 95;
  for (let y = waterLevel; y < canvas.height; y += 11) {
    const spread = (y - waterLevel) * .18;
    ctx.fillRect(sunX - reflectionWidth / 2 - spread * .5 + (random()-.5)*18, y, reflectionWidth + spread, 3);
  }
  ctx.restore();

  fillTerrain(near, '#202f2c');

  ctx.save();
  ctx.globalAlpha = haze;
  const hazeGradient = ctx.createLinearGradient(0, canvas.height * .25, 0, waterLevel + 30);
  hazeGradient.addColorStop(0, 'rgba(248,225,195,0)');
  hazeGradient.addColorStop(1, 'rgba(248,225,195,.72)');
  ctx.fillStyle = hazeGradient;
  ctx.fillRect(0, canvas.height * .2, canvas.width, waterLevel);
  ctx.restore();

  ctx.font = '18px ui-monospace, monospace';
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fillText(`SEED ${seed}`, 24, canvas.height - 26);
  document.getElementById('sceneStatus').textContent = `Rendered seed ${seed} locally.`;
}

controls.forEach((id) => {
  const input = document.getElementById(id);
  const output = document.getElementById(`${id}Out`);
  input.addEventListener('input', () => { output.textContent = input.value; render(); });
});
document.getElementById('seed').addEventListener('change', render);
document.getElementById('render').addEventListener('click', render);
document.getElementById('randomize').addEventListener('click', () => {
  document.getElementById('seed').value = Math.floor(Math.random() * 999999) + 1;
  render();
});
document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `y2k-landscape-${document.getElementById('seed').value}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});
render();
