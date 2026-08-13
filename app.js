(() => {
  const ARCHIVE_ROOT = 'archive/baseline/';
  const ARCHIVE_FILES = {
    manifest: `${ARCHIVE_ROOT}mh370_replication_manifest.json`,
    bfo: `${ARCHIVE_ROOT}mh370_bfo_timeseries.csv`,
    ring: `${ARCHIVE_ROOT}mh370_poi_31_4S_90_4E_radius20km.geojson`,
    readme: `${ARCHIVE_ROOT}README.md`
  };

  const fallbackManifest = {
    poi_center: { lat_deg: -31.4, lon_deg: 90.4 },
    search_radius_km: 20,
    credible_region_95: { lat_deg: [-31.7, -31.1], lon_deg: [89.8, 91.0] }
  };

  const fallbackBfo = [
    { utc: '2014-03-07T18:25:34.461Z', event: '18:25 log-on ACK', bfo_hz: 273 },
    { utc: '2014-03-08T00:10:59.928Z', event: '00:10:59 ACK', bfo_hz: 252 },
    { utc: '2014-03-08T00:19:29.416Z', event: '00:19:29 log-on request (R-channel)', bfo_hz: 182 },
    { utc: '2014-03-08T00:19:37.443Z', event: '00:19:37 acknowledge (last R-burst)', bfo_hz: -2 }
  ];

  function installArchiveStyles() {
    if (document.querySelector('link[data-archive-styles]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'archive.css';
    link.dataset.archiveStyles = 'true';
    document.head.appendChild(link);
  }

  function installArchivePanel() {
    const tabs = document.querySelector('.tabs');
    const mapPanel = document.getElementById('tab-map');
    if (!tabs || !mapPanel || document.querySelector('[data-tab="archive"]')) return;

    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.dataset.tab = 'archive';
    tab.setAttribute('role', 'tab');
    tab.textContent = 'Archive Baseline';
    tabs.insertBefore(tab, tabs.children[1] || null);

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = 'tab-archive';
    panel.innerHTML = `
      <div class="panel-caption">ARCHIVED BASELINE — ORIGINAL POI MODEL / PARTIAL REPLICATION PACK</div>
      <div class="archive-banner">
        <div>
          <strong>HISTORICAL MODEL — SUPERSEDED</strong>
          <small>This is the project's preserved original point-of-impact baseline. It is shown for scientific history, provenance, and comparison only. It is <b>not</b> the current search recommendation.</small>
        </div>
        <div class="archive-chip">ARCHIVED / NOT CURRENT</div>
      </div>
      <div class="archive-grid">
        <div class="archive-stack">
          <fieldset class="group-box archive-card">
            <legend>ARCHIVED POI / GEOMETRY</legend>
            <svg id="archiveMap" class="archive-map" viewBox="0 0 820 360" role="img" aria-label="Archived MH370 point of impact and 20 kilometer search ring"></svg>
            <div class="archive-note" id="archiveMapStatus">Loading preserved GeoJSON geometry…</div>
          </fieldset>

          <fieldset class="group-box archive-card">
            <legend>BFO OBSERVATIONS / PRESERVED SERIES</legend>
            <svg id="archiveBfoChart" class="archive-chart" viewBox="0 0 820 300" role="img" aria-label="Selected observed MH370 BFO values from the archived baseline"></svg>
            <div class="data-table-wrap sunken">
              <table class="archive-bfo-table">
                <thead><tr><th>UTC</th><th>EVENT</th><th>BFO (Hz)</th><th>PROVENANCE</th></tr></thead>
                <tbody id="archiveBfoRows"></tbody>
              </table>
            </div>
          </fieldset>
        </div>

        <div class="archive-stack">
          <fieldset class="group-box archive-card">
            <legend>MODEL RECORD</legend>
            <dl class="archive-kv">
              <dt>POI</dt><dd id="archivePoi">31.400° S, 090.400° E</dd>
              <dt>Search ring</dt><dd id="archiveRadius">20 km geodesic</dd>
              <dt>Reported 95% bounds</dt><dd id="archiveBounds">31.1–31.7° S / 89.8–91.0° E</dd>
              <dt>POI class</dt><dd><span class="archive-tag inf">INFERRED</span> HISTORICAL</dd>
              <dt>Geometry class</dt><dd><span class="archive-tag drv">DERIVED</span></dd>
              <dt>Replication</dt><dd><span class="archive-tag partial">PARTIAL</span></dd>
            </dl>
            <div class="archive-warning"><b>Replication boundary:</b> the original executable solver environment, dependency lockfile, complete solver state, optimizer history, dataset hashes, and intermediate numerical artifacts are not in this public pack. The archived result is therefore preserved as a historical model record, not represented as a newly reproduced solution.</div>
          </fieldset>

          <fieldset class="group-box archive-card">
            <legend>PROVENANCE REGISTER</legend>
            <table class="archive-provenance">
              <thead><tr><th>ARTIFACT</th><th>CLASS</th><th>PUBLIC STATUS</th></tr></thead>
              <tbody>
                <tr><td>Selected BFO values</td><td><span class="archive-tag obs">OBSERVED</span></td><td>Preserved CSV</td></tr>
                <tr><td>20 km search ring</td><td><span class="archive-tag drv">DERIVED</span></td><td>Preserved GeoJSON</td></tr>
                <tr><td>31.4° S, 90.4° E POI</td><td><span class="archive-tag inf">INFERRED</span></td><td>Historical / superseded</td></tr>
                <tr><td>Reported 95% bounds</td><td><span class="archive-tag inf">INFERRED</span></td><td>Historical / superseded</td></tr>
                <tr><td>Original complete execution state</td><td><span class="archive-tag partial">PARTIAL</span></td><td>Not present in public pack</td></tr>
              </tbody>
            </table>
          </fieldset>

          <fieldset class="group-box archive-card">
            <legend>HISTORICAL PIPELINE</legend>
            <div class="archive-pipeline">
              <span class="archive-step">SATCOM</span><span class="archive-arrow">→</span>
              <span class="archive-step">Terminal descent</span><span class="archive-arrow">→</span>
              <span class="archive-step">Impact / debris</span><span class="archive-arrow">→</span>
              <span class="archive-step">Drift</span><span class="archive-arrow">→</span>
              <span class="archive-step">Search / bathymetry</span><span class="archive-arrow">→</span>
              <span class="archive-step">POI convergence</span>
            </div>
            <p class="archive-note">Pipeline labels document the archived methodology. They do not imply that every historical computation can presently be replayed from this website.</p>
          </fieldset>

          <fieldset class="group-box archive-card">
            <legend>REPLICATION PACK</legend>
            <div class="archive-downloads">
              <a href="${ARCHIVE_FILES.bfo}" target="_blank" rel="noopener">BFO CSV</a>
              <a href="${ARCHIVE_FILES.ring}" target="_blank" rel="noopener">20 km GeoJSON</a>
              <a href="${ARCHIVE_FILES.manifest}" target="_blank" rel="noopener">Manifest JSON</a>
              <a href="${ARCHIVE_FILES.readme}" target="_blank" rel="noopener">Archive README</a>
            </div>
            <p class="archive-note" id="archiveLoadStatus">Loading repository artifacts…</p>
          </fieldset>
        </div>
      </div>`;
    mapPanel.insertAdjacentElement('afterend', panel);
  }

  function improvePublicState() {
    const flag = document.querySelector('.prototype-flag');
    if (flag) flag.textContent = 'PUBLIC PROTOTYPE / ARCHIVED BASELINE AVAILABLE';

    const runButton = document.getElementById('runButton');
    if (runButton) {
      runButton.textContent = 'Run Model (Offline)';
      runButton.title = 'The current scientific solver is not connected to the public UI.';
    }

    const statusCells = [...document.querySelectorAll('.statusbar .status-cell')];
    const modeCell = statusCells.find(el => el.textContent.includes('MODE:'));
    const srcCell = statusCells.find(el => el.textContent.includes('SRC:'));
    if (modeCell) modeCell.textContent = 'MODE: PUBLIC PROTOTYPE';
    if (srcCell) srcCell.textContent = 'SRC: ARCHIVE + DEV UI';

    const switchRows = [...document.querySelectorAll('.switch-row')];
    const setSwitch = (label, status) => {
      const row = switchRows.find(el => el.textContent.includes(label));
      if (row) {
        const strong = row.querySelector('strong');
        if (strong) strong.textContent = status;
      }
    };
    setSwitch('SATCOM', 'ARCHIVE');
    setSwitch('BTO', 'DEV');
    setSwitch('BFO', 'ARCHIVE');
    setSwitch('DRIFT', 'STANDBY');
    setSwitch('JACOBIAN', 'DEV CHECK');

    const bestLegend = [...document.querySelectorAll('.right-rack legend')].find(el => el.textContent.includes('BEST STATE'));
    if (bestLegend) bestLegend.textContent = 'ARCHIVED POI / BASELINE';
    const bestOutputs = document.querySelectorAll('.right-rack .digital-readouts.large output');
    if (bestOutputs[0]) bestOutputs[0].textContent = '31.400° S';
    if (bestOutputs[1]) bestOutputs[1].textContent = '090.400° E';

    const satcomTable = document.querySelector('#tab-satcom .data-table');
    if (satcomTable) {
      satcomTable.innerHTML = `
        <thead><tr><th>UTC</th><th>EVENT</th><th>BFO</th><th>USE</th><th>CLASS</th><th>SOURCE</th></tr></thead>
        <tbody>
          <tr><td>18:25:34.461</td><td>log-on ACK</td><td>273 Hz</td><td>ARCHIVE</td><td>OBSERVED</td><td>Inmarsat log</td></tr>
          <tr><td>00:10:59.928</td><td>ACK</td><td>252 Hz</td><td>ARCHIVE</td><td>OBSERVED</td><td>Inmarsat log</td></tr>
          <tr class="terminal-row"><td>00:19:29.416</td><td>log-on request (R-channel)</td><td>182 Hz</td><td>ARCHIVE</td><td>OBSERVED</td><td>Inmarsat log</td></tr>
          <tr class="terminal-row"><td>00:19:37.443</td><td>acknowledge (last R-burst)</td><td>−2 Hz</td><td>ARCHIVE</td><td>OBSERVED</td><td>Inmarsat log</td></tr>
        </tbody>`;
    }
    const satcomAnnotation = document.querySelector('#tab-satcom .annotation-box');
    if (satcomAnnotation) satcomAnnotation.innerHTML = '<b>Archived observational layer:</b> selected BFO values from the preserved baseline pack are now displayed. Current reconstruction outputs remain unpublished until their source provenance and validation gates are complete.';

    const solverLayout = document.querySelector('#tab-solver .solver-layout');
    if (solverLayout && !document.querySelector('#tab-solver .current-dev-note')) {
      const note = document.createElement('div');
      note.className = 'current-dev-note';
      note.innerHTML = '<b>CURRENT RECONSTRUCTION / DEVELOPMENT DIAGNOSTICS.</b> The controls and diagnostic readouts below represent the active development workspace; the public page does not execute the scientific solver. Use <b>Archive Baseline</b> for the inspectable historical POI package.';
      solverLayout.insertAdjacentElement('beforebegin', note);
    }
  }

  function installDevelopmentNotice() {
    const notice = document.createElement('section');
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-label', 'MH370 Modeling System development notice');
    notice.style.cssText = [
      'position:fixed','right:18px','bottom:34px','z-index:10000',
      'width:min(540px,calc(100vw - 36px))','background:#c0c0c0','color:#000',
      'font-family:"MS Sans Serif",Tahoma,Arial,sans-serif','font-size:12px',
      'border-top:2px solid #fff','border-left:2px solid #fff','border-right:2px solid #000','border-bottom:2px solid #000','box-shadow:2px 2px 0 #404040'
    ].join(';');

    notice.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;background:#000080;color:#fff;font-weight:bold;padding:3px 4px;letter-spacing:.2px;">
        <span>⚠ MH370 MODELING SYSTEM — DEVELOPMENT NOTICE</span>
        <button type="button" aria-label="Dismiss development notice" style="width:18px;height:18px;padding:0;line-height:14px;font-weight:bold;background:#c0c0c0;color:#000;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #000;border-bottom:2px solid #000;cursor:pointer;">×</button>
      </div>
      <div style="padding:11px 12px 10px 12px;line-height:1.45;">
        <div style="font-weight:bold;margin-bottom:7px;">PUBLIC FRONT-FACING UI / ACTIVE DEVELOPMENT</div>
        <div style="margin-bottom:8px;">The current SATCOM + trajectory + drift reconstruction is still being ingested, normalized, validated, and derived. The public interface does not currently execute that scientific solver.</div>
        <div style="margin-bottom:8px;"><strong>NOW AVAILABLE:</strong> the original POI model is preserved under <strong>Archive Baseline</strong> with observational BFO values, the 20 km GeoJSON search ring, manifest metadata, and explicit replication limits.</div>
        <div style="border-top:1px solid #808080;border-bottom:1px solid #fff;margin:7px 0 8px 0;"></div>
        <div><strong>EXPECTED CURRENT-MODEL OPERATIONAL STATUS:</strong> OCTOBER 2026 — APPROX. TWO MONTHS</div>
        <div style="margin-top:5px;"><strong>WEBMASTER:</strong> Ry2k</div>
      </div>`;

    notice.querySelector('button').addEventListener('click', () => notice.remove());
    document.body.appendChild(notice);
  }

  function installGeographicMap() {
    const svg = document.querySelector('#tab-map .map-screen svg');
    if (!svg) return;

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

    const seventhArc = [
      [98.6, -20.0], [97.7, -22.0], [96.7, -24.0], [95.6, -26.0],
      [94.4, -28.0], [93.1, -30.0], [91.7, -32.0], [90.1, -34.0],
      [88.4, -36.0], [86.5, -38.0], [84.4, -40.0]
    ];
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

    const [candidateX, candidateY] = project(90.4, -31.4);
    const [perthX, perthY] = project(115.8613, -31.9523);
    const [exmouthX, exmouthY] = project(114.127, -21.93);
    const [arcLabelX, arcLabelY] = project(93.0, -30.2);
    const [credibleX1, credibleY1] = project(89.8, -31.1);
    const [credibleX2, credibleY2] = project(91.0, -31.7);

    svg.setAttribute('viewBox', '0 0 900 500');
    svg.setAttribute('aria-label', 'Southern Indian Ocean development map with ATSB seventh arc display reference and archived baseline POI');
    svg.innerHTML = `
      <rect width="900" height="500" class="ocean"/>
      <g>${grid}</g>
      <polygon points="${points(westAustralia)}" class="land"/>
      <text x="835" y="325" class="map-label" text-anchor="middle">WESTERN</text>
      <text x="835" y="341" class="map-label" text-anchor="middle">AUSTRALIA</text>
      <polyline points="${points(seventhArc)}" class="arc arc-bright" fill="none"/>
      <text x="${arcLabelX.toFixed(1)}" y="${arcLabelY.toFixed(1)}" class="range-label" transform="rotate(-43 ${arcLabelX.toFixed(1)} ${arcLabelY.toFixed(1)})">7TH ARC — ATSB DISPLAY REFERENCE</text>
      <rect x="${Math.min(credibleX1, credibleX2).toFixed(1)}" y="${Math.min(credibleY1, credibleY2).toFixed(1)}" width="${Math.abs(credibleX2 - credibleX1).toFixed(1)}" height="${Math.abs(credibleY2 - credibleY1).toFixed(1)}" fill="none" stroke="#65b4ff" stroke-width="1.5" stroke-dasharray="5 4"/>
      <circle cx="${perthX.toFixed(1)}" cy="${perthY.toFixed(1)}" r="3.5" fill="#d9d9d9" stroke="#111"/>
      <text x="${(perthX - 7).toFixed(1)}" y="${(perthY - 7).toFixed(1)}" class="fix-label" text-anchor="end">PERTH</text>
      <circle cx="${exmouthX.toFixed(1)}" cy="${exmouthY.toFixed(1)}" r="3.5" fill="#d9d9d9" stroke="#111"/>
      <text x="${(exmouthX - 7).toFixed(1)}" y="${(exmouthY - 7).toFixed(1)}" class="fix-label" text-anchor="end">EXMOUTH</text>
      <circle cx="${candidateX.toFixed(1)}" cy="${candidateY.toFixed(1)}" r="7" class="candidate"/>
      <g class="crosshair"><line x1="${(candidateX - 10).toFixed(1)}" y1="${candidateY.toFixed(1)}" x2="${(candidateX + 10).toFixed(1)}" y2="${candidateY.toFixed(1)}"/><line x1="${candidateX.toFixed(1)}" y1="${(candidateY - 10).toFixed(1)}" x2="${candidateX.toFixed(1)}" y2="${(candidateY + 10).toFixed(1)}"/></g>
      <text x="${(candidateX + 12).toFixed(1)}" y="${(candidateY - 7).toFixed(1)}" class="candidate-label">ARCHIVED POI</text>
      <text x="450" y="245" class="map-label dim" text-anchor="middle">SOUTHERN INDIAN OCEAN</text>`;

    const topLeft = document.querySelector('#tab-map .map-overlay.top-left');
    const bottomLeft = document.querySelector('#tab-map .map-overlay.bottom-left');
    const bottomRight = document.querySelector('#tab-map .map-overlay.bottom-right');
    if (topLeft) topLeft.innerHTML = 'DISPLAY 01<br>WGS84 EQUIRECTANGULAR<br>84–118°E / 18–42°S<br>ARC: ATSB DISPLAY REF';
    if (bottomLeft) bottomLeft.innerHTML = 'ARCHIVED POI: 31°24\'00\"S&nbsp;&nbsp;090°24\'00\"E';
    if (bottomRight) bottomRight.innerHTML = 'CURRENT MODEL: DEVELOPMENT&nbsp;&nbsp; ZOOM 100%';
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
      const values = [];
      let cell = '';
      let quoted = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') quoted = !quoted;
        else if (ch === ',' && !quoted) { values.push(cell); cell = ''; }
        else cell += ch;
      }
      values.push(cell);
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
  }

  function fallbackRing(centerLat, centerLon, radiusKm) {
    const coords = [];
    const dLat = radiusKm / 111.32;
    const dLon = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      coords.push([centerLon + Math.sin(a) * dLon, centerLat + Math.cos(a) * dLat]);
    }
    return coords;
  }

  function renderArchiveMap(manifest, geojson) {
    const svg = document.getElementById('archiveMap');
    if (!svg) return;
    const width = 820;
    const height = 360;
    const pad = 42;
    const lonMin = 89.55;
    const lonMax = 91.25;
    const latNorth = -30.9;
    const latSouth = -31.9;
    const project = (lon, lat) => [
      pad + ((lon - lonMin) / (lonMax - lonMin)) * (width - pad * 2),
      pad + ((latNorth - lat) / (latNorth - latSouth)) * (height - pad * 2)
    ];

    const center = manifest.poi_center || fallbackManifest.poi_center;
    const bounds = manifest.credible_region_95 || fallbackManifest.credible_region_95;
    let ring = geojson?.features?.[0]?.geometry?.coordinates?.[0];
    if (!ring) ring = fallbackRing(center.lat_deg, center.lon_deg, manifest.search_radius_km || 20);

    let grid = '';
    [89.6, 90.0, 90.4, 90.8, 91.2].forEach(lon => {
      const [x] = project(lon, latNorth);
      grid += `<line x1="${x}" y1="${pad}" x2="${x}" y2="${height-pad}" class="axis"/><text x="${x+3}" y="${height-12}" class="dimlabel">${lon.toFixed(1)}°E</text>`;
    });
    [-31.0, -31.2, -31.4, -31.6, -31.8].forEach(lat => {
      const [, y] = project(lonMin, lat);
      grid += `<line x1="${pad}" y1="${y}" x2="${width-pad}" y2="${y}" class="axis"/><text x="4" y="${y+4}" class="dimlabel">${Math.abs(lat).toFixed(1)}°S</text>`;
    });

    const [cx, cy] = project(center.lon_deg, center.lat_deg);
    const [bx1, by1] = project(bounds.lon_deg[0], bounds.lat_deg[1]);
    const [bx2, by2] = project(bounds.lon_deg[1], bounds.lat_deg[0]);
    const ringPoints = ring.map(([lon, lat]) => project(lon, lat).map(v => v.toFixed(2)).join(',')).join(' ');

    svg.innerHTML = `
      <rect width="${width}" height="${height}" fill="#071d22"/>
      ${grid}
      <rect x="${Math.min(bx1,bx2)}" y="${Math.min(by1,by2)}" width="${Math.abs(bx2-bx1)}" height="${Math.abs(by2-by1)}" class="credible"/>
      <text x="${Math.min(bx1,bx2)+7}" y="${Math.min(by1,by2)+16}" class="label">HISTORICAL REPORTED 95% ENVELOPE</text>
      <polygon points="${ringPoints}" class="ring"/>
      <circle cx="${cx}" cy="${cy}" r="6" class="poi"/>
      <line x1="${cx-10}" y1="${cy}" x2="${cx+10}" y2="${cy}" stroke="#fff3a0"/><line x1="${cx}" y1="${cy-10}" x2="${cx}" y2="${cy+10}" stroke="#fff3a0"/>
      <text x="${cx+13}" y="${cy-8}" class="label">POI −31.4°, 90.4°</text>
      <text x="${cx+13}" y="${cy+8}" class="dimlabel">20 km GEODESIC RING / DERIVED</text>`;
  }

  function renderBfoChart(rows) {
    const svg = document.getElementById('archiveBfoChart');
    const body = document.getElementById('archiveBfoRows');
    if (!svg || !body) return;
    const data = rows.map(row => ({
      utc: row.utc,
      event: row.event,
      bfo_hz: Number(row.bfo_hz)
    })).filter(row => row.utc && Number.isFinite(row.bfo_hz));

    body.innerHTML = data.map(row => `<tr><td>${row.utc.replace('2014-03-','').replace('T',' ').replace('Z','')}</td><td>${row.event}</td><td>${row.bfo_hz}</td><td><span class="archive-tag obs">OBSERVED</span></td></tr>`).join('');

    const width = 820;
    const height = 300;
    const left = 58;
    const right = 28;
    const top = 26;
    const bottom = 46;
    const times = data.map(d => Date.parse(d.utc));
    const t0 = Math.min(...times);
    const t1 = Math.max(...times);
    const yMin = -10;
    const yMax = 290;
    const x = t => left + ((t - t0) / Math.max(1, t1 - t0)) * (width - left - right);
    const y = v => top + ((yMax - v) / (yMax - yMin)) * (height - top - bottom);

    let grid = '';
    [0,50,100,150,200,250].forEach(v => {
      const yy = y(v);
      grid += `<line x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}" class="grid"/><text x="8" y="${yy+4}" class="label">${v}</text>`;
    });
    const pts = data.map((d,i) => `${x(times[i]).toFixed(1)},${y(d.bfo_hz).toFixed(1)}`).join(' ');
    const pointMarkup = data.map((d,i) => {
      const xx = x(times[i]);
      const yy = y(d.bfo_hz);
      const anchor = i >= data.length - 2 ? 'end' : 'start';
      const dx = i >= data.length - 2 ? -7 : 7;
      const labelY = i === data.length - 1 ? yy - 8 : yy - 10;
      const shortTime = d.utc.slice(11,19);
      return `<circle cx="${xx}" cy="${yy}" r="5" class="point"/><text x="${xx+dx}" y="${labelY}" text-anchor="${anchor}" class="value">${shortTime} / ${d.bfo_hz} Hz</text>`;
    }).join('');

    svg.innerHTML = `
      <rect width="${width}" height="${height}" fill="#071d22"/>
      ${grid}
      <line x1="${left}" y1="${top}" x2="${left}" y2="${height-bottom}" class="axis"/>
      <line x1="${left}" y1="${height-bottom}" x2="${width-right}" y2="${height-bottom}" class="axis"/>
      <polyline points="${pts}" class="series"/>
      ${pointMarkup}
      <text x="12" y="18" class="label">BFO (Hz)</text>
      <text x="${width-168}" y="${height-12}" class="label">UTC / selected observations</text>`;
  }

  async function loadArchiveData() {
    const status = document.getElementById('archiveLoadStatus');
    const mapStatus = document.getElementById('archiveMapStatus');
    let manifest = fallbackManifest;
    let rows = fallbackBfo;
    let geojson = null;
    let loaded = [];

    try {
      const response = await fetch(ARCHIVE_FILES.manifest, { cache: 'no-store' });
      if (!response.ok) throw new Error(`manifest ${response.status}`);
      manifest = await response.json();
      loaded.push('manifest');
    } catch (err) { console.warn('Archive manifest fallback:', err); }

    try {
      const response = await fetch(ARCHIVE_FILES.bfo, { cache: 'no-store' });
      if (!response.ok) throw new Error(`BFO ${response.status}`);
      rows = parseCsv(await response.text());
      loaded.push('BFO CSV');
    } catch (err) { console.warn('Archive BFO fallback:', err); }

    try {
      const response = await fetch(ARCHIVE_FILES.ring, { cache: 'no-store' });
      if (!response.ok) throw new Error(`ring ${response.status}`);
      geojson = await response.json();
      loaded.push('GeoJSON');
    } catch (err) { console.warn('Archive ring fallback:', err); }

    const center = manifest.poi_center || fallbackManifest.poi_center;
    const bounds = manifest.credible_region_95 || fallbackManifest.credible_region_95;
    const radius = manifest.search_radius_km || 20;
    const poi = document.getElementById('archivePoi');
    const radiusEl = document.getElementById('archiveRadius');
    const boundsEl = document.getElementById('archiveBounds');
    if (poi) poi.textContent = `${Math.abs(center.lat_deg).toFixed(3)}° S, ${center.lon_deg.toFixed(3)}° E`;
    if (radiusEl) radiusEl.textContent = `${radius} km geodesic`;
    if (boundsEl) boundsEl.textContent = `${Math.abs(bounds.lat_deg[1]).toFixed(1)}–${Math.abs(bounds.lat_deg[0]).toFixed(1)}° S / ${bounds.lon_deg[0].toFixed(1)}–${bounds.lon_deg[1].toFixed(1)}° E`;

    renderArchiveMap(manifest, geojson);
    renderBfoChart(rows);
    if (mapStatus) mapStatus.textContent = geojson ? 'Preserved GeoJSON loaded from repository. The blue rectangle is the historical reported 95% bounding envelope; the gold polygon is the preserved 20 km ring.' : 'Repository GeoJSON unavailable; displaying a geometric fallback from the archived center/radius.';
    if (status) status.textContent = loaded.length === 3 ? 'Repository archive loaded: manifest + BFO CSV + GeoJSON.' : `Archive loaded with fallbacks (${loaded.join(', ') || 'embedded metadata only'}).`;
  }

  installArchiveStyles();
  installArchivePanel();
  improvePublicState();
  installDevelopmentNotice();
  installGeographicMap();
  loadArchiveData();

  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.tab-panel')];
  const statusText = document.getElementById('statusText');
  const eventLog = document.getElementById('eventLog');
  const systemState = document.getElementById('systemState');
  const runButton = document.getElementById('runButton');
  const haltButton = document.getElementById('haltButton');
  const clock = document.getElementById('clock');
  const popup = document.getElementById('menuPopup');

  const messages = {
    map: 'Development map selected. Archived POI is displayed only as a historical reference.',
    archive: 'Archived baseline selected. Historical POI and preserved public artifacts loaded.',
    satcom: 'SATCOM console selected. Archived observed BFO values are visible.',
    solver: 'Current reconstruction diagnostics selected. Public solver remains offline.',
    residuals: 'Development residual monitor selected.',
    drift: 'Drift compatibility panel selected.',
    log: 'Run log selected.'
  };

  function log(source, message) {
    if (eventLog) eventLog.innerHTML = `<span>${source}</span> ${message}`;
    if (statusText) statusText.textContent = message;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === `tab-${target}`));
      log('VIEW', messages[target] || 'Display changed.');
    });
  });

  if (runButton) runButton.addEventListener('click', () => {
    if (systemState) systemState.textContent = ' DEV / OFFLINE';
    log('MODEL', 'Public run blocked: the current scientific solver is not connected to this front-facing UI. Open Archive Baseline to inspect the preserved historical model package.');
    const archiveTab = document.querySelector('[data-tab="archive"]');
    if (archiveTab) setTimeout(() => archiveTab.click(), 450);
  });

  if (haltButton) haltButton.addEventListener('click', () => {
    if (systemState) systemState.textContent = ' HOLD';
    log('MODEL', 'Operator hold selected for the public development interface.');
  });

  const menuItems = {
    file: ['Open Archived Baseline', 'Export Snapshot...', 'Print...', 'Exit'],
    model: ['Archived Baseline', 'Current Reconstruction (Offline)', 'Model Settings...'],
    observations: ['SATCOM Table', 'Terminal Events', 'Provenance Register'],
    solver: ['Solver Control', 'Derivative Check', 'Curvature Diagnostics'],
    drift: ['Drift Gates', 'Debris Register', 'Compatibility View'],
    view: ['Map View', 'Archive Baseline', 'SATCOM', 'Solver', 'Residuals', 'Run Log'],
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
        const text = item.textContent;
        if (/archive/i.test(text)) {
          document.querySelector('[data-tab="archive"]')?.click();
        } else if (/satcom/i.test(text)) {
          document.querySelector('[data-tab="satcom"]')?.click();
        } else if (/solver control/i.test(text)) {
          document.querySelector('[data-tab="solver"]')?.click();
        } else {
          log('MENU', `${text} selected (development interface).`);
        }
        popup.hidden = true;
      }));
    });
  });

  document.addEventListener('click', () => { if (popup) popup.hidden = true; });
  document.querySelectorAll('input[type="checkbox"], input[type="radio"], select').forEach(control => {
    control.addEventListener('change', () => log('CFG', 'Operator configuration changed in the development interface.'));
  });

  function updateClock() {
    if (!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  updateClock();
  setInterval(updateClock, 1000);
})();
