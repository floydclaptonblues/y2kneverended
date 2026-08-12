(() => {
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  const statusText = document.getElementById('statusText');
  const eventLog = document.getElementById('eventLog');
  const systemState = document.getElementById('systemState');
  const runButton = document.getElementById('runButton');
  const haltButton = document.getElementById('haltButton');
  const clock = document.getElementById('clock');
  const popup = document.getElementById('menuPopup');

  function installDevelopmentNotice() {
    const notice = document.createElement('section');
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-label', 'MH370 Modeling System development notice');
    notice.style.cssText = [
      'position:fixed',
      'right:18px',
      'bottom:34px',
      'z-index:10000',
      'width:min(540px,calc(100vw - 36px))',
      'background:#c0c0c0',
      'color:#000',
      'font-family:"MS Sans Serif",Tahoma,Arial,sans-serif',
      'font-size:12px',
      'border-top:2px solid #fff',
      'border-left:2px solid #fff',
      'border-right:2px solid #000',
      'border-bottom:2px solid #000',
      'box-shadow:2px 2px 0 #404040'
    ].join(';');

    notice.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;background:#000080;color:#fff;font-weight:bold;padding:3px 4px;letter-spacing:.2px;">
        <span>⚠ MH370 MODELING SYSTEM — DEVELOPMENT NOTICE</span>
        <button type="button" aria-label="Dismiss development notice" style="width:18px;height:18px;padding:0;line-height:14px;font-weight:bold;background:#c0c0c0;color:#000;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #000;border-bottom:2px solid #000;cursor:pointer;">×</button>
      </div>
      <div style="padding:11px 12px 10px 12px;line-height:1.45;">
        <div style="font-weight:bold;margin-bottom:7px;">PUBLIC FRONT-FACING UI / ACTIVE DEVELOPMENT</div>
        <div style="margin-bottom:9px;">This interface is actively ingesting, normalizing, validating, and deriving datasets for the MH370 Modeling System. Scientific readouts may remain provisional, incomplete, or inactive until source provenance and derivation checks are complete.</div>
        <div style="border-top:1px solid #808080;border-bottom:1px solid #fff;margin:7px 0 8px 0;"></div>
        <div><strong>EXPECTED OPERATIONAL STATUS:</strong> OCTOBER 2026 — APPROX. TWO MONTHS</div>
        <div style="margin-top:5px;"><strong>WEBMASTER:</strong> Ry2k</div>
      </div>`;

    notice.querySelector('button').addEventListener('click', () => notice.remove());
    document.body.appendChild(notice);
  }

  function installGeographicMap() {
    const svg = document.querySelector('#tab-map .map-screen svg');
    if (!svg) return;

    // Search-sector display. Coordinates are plotted on a WGS84 equirectangular
    // projection rather than the original hand-drawn schematic.
    const width = 900;
    const height = 500;
    const lonMin = 84;
    const lonMax = 118;
    const latNorth = -18;
    const latSouth = -42;

    const project = (lon, lat) => [
      ((lon - lonMin) / (lonMax - lonMin)) * width,
      ((latNorth - lat) / (latNorth - latSouth)) * height
    ];
    const points = coords => coords.map(([lon, lat]) => project(lon, lat).map(v => v.toFixed(1)).join(',')).join(' ');

    // The 7th-arc reference trace is digitized from the ATSB 5 June 2014
    // planning map. It is a display reference only; model-generated arc
    // geometry will replace it when the provenance-backed SATCOM layer lands.
    const seventhArc = [
      [98.6, -20.0], [97.7, -22.0], [96.7, -24.0], [95.6, -26.0],
      [94.4, -28.0], [93.1, -30.0], [91.7, -32.0], [90.1, -34.0],
      [88.4, -36.0], [86.5, -38.0], [84.4, -40.0]
    ];

    // Western Australia coastline: deliberately limited to the geographic
    // sector visible in the ATSB search-planning view. This removes the false
    // Africa/India silhouettes that were previously shown inside this extent.
    const westAustralia = [
      [118.0, -18.0], [116.2, -18.0], [115.2, -19.2], [114.6, -20.2],
      [114.0, -21.2], [113.7, -21.9], [113.9, -22.7], [113.5, -23.6],
      [113.6, -24.5], [113.0, -25.4], [113.8, -26.1], [114.1, -27.0],
      [114.3, -28.0], [114.7, -29.0], [115.0, -30.0], [115.4, -31.0],
      [115.8, -31.9], [115.7, -32.8], [115.4, -33.5], [115.1, -34.3],
      [116.0, -34.8], [117.0, -35.0], [118.0, -35.0]
    ];

    let grid = '';
    for (let lon = 84; lon <= 116; lon += 4) {
      const [x] = project(lon, latNorth);
      grid += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="500" class="grid-line"/>`;
      grid += `<text x="${(x + 4).toFixed(1)}" y="15" fill="#729889" font-size="10" font-family="monospace">${lon}°E</text>`;
    }
    for (let lat = -20; lat >= -40; lat -= 4) {
      const [, y] = project(lonMin, lat);
      grid += `<line x1="0" y1="${y.toFixed(1)}" x2="900" y2="${y.toFixed(1)}" class="grid-line"/>`;
      grid += `<text x="5" y="${(y - 4).toFixed(1)}" fill="#729889" font-size="10" font-family="monospace">${Math.abs(lat)}°S</text>`;
    }

    const [candidateX, candidateY] = project(90.403, -31.397);
    const [perthX, perthY] = project(115.8613, -31.9523);
    const [exmouthX, exmouthY] = project(114.127, -21.93);
    const [arcLabelX, arcLabelY] = project(93.0, -30.2);

    svg.setAttribute('viewBox', '0 0 900 500');
    svg.setAttribute('aria-label', 'Southern Indian Ocean search-sector map with geographically projected Western Australia and ATSB seventh arc reference');
    svg.innerHTML = `
      <rect width="900" height="500" class="ocean"/>
      <g>${grid}</g>
      <polygon points="${points(westAustralia)}" class="land"/>
      <text x="835" y="325" class="map-label" text-anchor="middle">WESTERN</text>
      <text x="835" y="341" class="map-label" text-anchor="middle">AUSTRALIA</text>

      <polyline points="${points(seventhArc)}" class="arc arc-bright" fill="none"/>
      <text x="${arcLabelX.toFixed(1)}" y="${arcLabelY.toFixed(1)}" class="range-label" transform="rotate(-43 ${arcLabelX.toFixed(1)} ${arcLabelY.toFixed(1)})">7TH ARC — ATSB REFERENCE</text>

      <circle cx="${perthX.toFixed(1)}" cy="${perthY.toFixed(1)}" r="3.5" fill="#d9d9d9" stroke="#111"/>
      <text x="${(perthX - 7).toFixed(1)}" y="${(perthY - 7).toFixed(1)}" class="fix-label" text-anchor="end">PERTH</text>
      <circle cx="${exmouthX.toFixed(1)}" cy="${exmouthY.toFixed(1)}" r="3.5" fill="#d9d9d9" stroke="#111"/>
      <text x="${(exmouthX - 7).toFixed(1)}" y="${(exmouthY - 7).toFixed(1)}" class="fix-label" text-anchor="end">EXMOUTH</text>

      <circle cx="${candidateX.toFixed(1)}" cy="${candidateY.toFixed(1)}" r="7" class="candidate"/>
      <g class="crosshair"><line x1="${(candidateX - 10).toFixed(1)}" y1="${candidateY.toFixed(1)}" x2="${(candidateX + 10).toFixed(1)}" y2="${candidateY.toFixed(1)}"/><line x1="${candidateX.toFixed(1)}" y1="${(candidateY - 10).toFixed(1)}" x2="${candidateX.toFixed(1)}" y2="${(candidateY + 10).toFixed(1)}"/></g>
      <text x="${(candidateX + 12).toFixed(1)}" y="${(candidateY - 7).toFixed(1)}" class="candidate-label">CANDIDATE / SAMPLE</text>

      <text x="450" y="245" class="map-label dim" text-anchor="middle">SOUTHERN INDIAN OCEAN</text>
    `;

    const topLeft = document.querySelector('#tab-map .map-overlay.top-left');
    const bottomLeft = document.querySelector('#tab-map .map-overlay.bottom-left');
    const bottomRight = document.querySelector('#tab-map .map-overlay.bottom-right');
    if (topLeft) topLeft.innerHTML = 'DISPLAY 01<br>WGS84 EQUIRECTANGULAR<br>84–118°E / 18–42°S<br>ARC: ATSB REFERENCE';
    if (bottomLeft) bottomLeft.innerHTML = 'CANDIDATE: 31°23\'49\"S&nbsp;&nbsp;090°24\'11\"E';
    if (bottomRight) bottomRight.innerHTML = 'GRID: 4° × 4°&nbsp;&nbsp; ZOOM 100%';
  }

  installDevelopmentNotice();
  installGeographicMap();

  const messages = {
    map: 'Plan display selected.',
    satcom: 'SATCOM observation console selected.',
    solver: 'Optimization control selected.',
    residuals: 'Residual monitor selected.',
    drift: 'Drift compatibility panel selected.',
    log: 'Run log selected.'
  };

  function log(source, message) {
    eventLog.innerHTML = `<span>${source}</span> ${message}`;
    statusText.textContent = message;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === `tab-${target}`));
      log('VIEW', messages[target] || 'Display changed.');
    });
  });

  runButton.addEventListener('click', () => {
    systemState.textContent = ' RUNNING';
    log('MODEL', 'Prototype run command accepted. No scientific computation is connected in this UI pass.');
    runButton.disabled = true;
    setTimeout(() => {
      systemState.textContent = ' READY';
      runButton.disabled = false;
      log('MODEL', 'Prototype cycle complete.');
    }, 1400);
  });

  haltButton.addEventListener('click', () => {
    systemState.textContent = ' HOLD';
    runButton.disabled = false;
    log('MODEL', 'Operator halt requested.');
  });

  const menuItems = {
    file: ['Open Run...', 'Export Snapshot...', 'Print...', 'Exit'],
    model: ['Initialize', 'Run', 'Halt', 'Model Settings...'],
    observations: ['SATCOM Table', 'Terminal Events', 'Provenance Register'],
    solver: ['Solver Control', 'Derivative Check', 'Curvature Diagnostics'],
    drift: ['Drift Gates', 'Debris Register', 'Compatibility View'],
    view: ['Map View', 'SATCOM', 'Solver', 'Residuals', 'Run Log'],
    help: ['Method Notes', 'Data Sources', 'About MH370 Modeling System']
  };

  document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();
      const name = button.dataset.menu;
      popup.innerHTML = menuItems[name].map(item => `<button type="button">${item}</button>`).join('');
      popup.style.left = `${button.offsetLeft + 4}px`;
      popup.hidden = false;
      [...popup.querySelectorAll('button')].forEach(item => item.addEventListener('click', () => {
        log('MENU', `${item.textContent} selected (prototype).`);
        popup.hidden = true;
      }));
    });
  });

  document.addEventListener('click', () => { popup.hidden = true; });

  document.querySelectorAll('input[type="checkbox"], input[type="radio"], select').forEach(control => {
    control.addEventListener('change', () => log('CFG', 'Operator configuration changed.'));
  });

  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  updateClock();
  setInterval(updateClock, 1000);
})();
