(() => {
  'use strict';

  const CURRENT_STATE_FILE = 'data/current-program-state.json';
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
    { utc: '2014-03-08T00:19:29.416Z', event: '00:19:29 log-on request', bfo_hz: 182 },
    { utc: '2014-03-08T00:19:37.443Z', event: '00:19:37 acknowledge', bfo_hz: -2 }
  ];

  const currentFallback = {
    checkpoint_id: 'MH370_PUBLIC_CURRENT_STATE_2026-09-04_V1',
    public_status: 'NO_PREDICTIVE_EXECUTION_AUTHORIZED',
    updated_utc: '2026-09-04',
    clean_target: {
      id: 'SATCOM_POST_ANCHOR_TARGET_V1',
      status: 'CLEAN_TARGET_SCIENTIFICALLY_VALID',
      finite_evaluations: 26952
    },
    source_gate: {
      status: 'TIER2_B777_OPEN_PERFORMANCE_SOURCE_CANDIDATE_QUALIFICATION_V1_BLOCKED',
      exact_lookup: 'GO_NONPREDICTIVE_ONLY',
      dependency_acquisition: 'V4_PREPARED_OUTCOME_NOT_RECORDED'
    }
  };

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
          <small>The original point-of-impact baseline is retained for scientific history, provenance and comparison. It is not the current inference state.</small>
        </div>
        <div class="archive-chip">ARCHIVED / NOT CURRENT</div>
      </div>
      <div class="archive-current-boundary"><b>Current/Archive boundary:</b> current solver status, source gates and mathematical contracts are shown in the main tabs. The material below is a preserved historical package and is not fed into the current clean target.</div>
      <div class="archive-grid">
        <div class="archive-stack">
          <fieldset class="group-box archive-card">
            <legend>ARCHIVED POI / GEOMETRY</legend>
            <svg id="archiveMap" class="archive-map" viewBox="0 0 820 360" role="img" aria-label="Archived MH370 point and 20 kilometer ring"></svg>
            <div class="archive-note" id="archiveMapStatus">Loading preserved GeoJSON geometry…</div>
          </fieldset>
          <fieldset class="group-box archive-card">
            <legend>BFO OBSERVATIONS / PRESERVED SERIES</legend>
            <svg id="archiveBfoChart" class="archive-chart" viewBox="0 0 820 300" role="img" aria-label="Selected BFO observations from the archived baseline"></svg>
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
            <div class="archive-warning"><b>Replication boundary:</b> the original executable environment, complete state, optimizer history, dataset hashes and intermediate numerical artifacts are not contained in this public pack. The archived result is preserved as a model record, not represented as a newly reproduced solution.</div>
          </fieldset>
          <fieldset class="group-box archive-card">
            <legend>PROVENANCE REGISTER</legend>
            <table class="archive-provenance">
              <thead><tr><th>ARTIFACT</th><th>CLASS</th><th>PUBLIC STATUS</th></tr></thead>
              <tbody>
                <tr><td>Selected BFO values</td><td><span class="archive-tag obs">OBSERVED</span></td><td>Preserved CSV</td></tr>
                <tr><td>20 km ring</td><td><span class="archive-tag drv">DERIVED</span></td><td>Preserved GeoJSON</td></tr>
                <tr><td>31.4° S, 90.4° E</td><td><span class="archive-tag inf">INFERRED</span></td><td>Historical / superseded</td></tr>
                <tr><td>Reported 95% bounds</td><td><span class="archive-tag inf">INFERRED</span></td><td>Historical / superseded</td></tr>
                <tr><td>Original complete execution state</td><td><span class="archive-tag partial">PARTIAL</span></td><td>Not present in public pack</td></tr>
              </tbody>
            </table>
          </fieldset>
          <fieldset class="group-box archive-card">
            <legend>HISTORICAL PIPELINE</legend>
            <div class="archive-pipeline">
              <span class="archive-step">SATCOM</span><span class="archive-arrow">→</span>
              <span class="archive-step">Terminal state</span><span class="archive-arrow">→</span>
              <span class="archive-step">Impact / debris</span><span class="archive-arrow">→</span>
              <span class="archive-step">Drift</span><span class="archive-arrow">→</span>
              <span class="archive-step">Search / bathymetry</span><span class="archive-arrow">→</span>
              <span class="archive-step">POI convergence</span>
            </div>
            <p class="archive-note">These labels document the historical methodology. They do not imply that every historical computation can be replayed from this website.</p>
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

  function currentMapProjection() {
    const width = 900;
    const height = 500;
    const lonMin = 76;
    const lonMax = 104;
    const latNorth = -27;
    const latSouth = -43;
    return {
      width,
      height,
      lonMin,
      lonMax,
      latNorth,
      latSouth,
      point(lon, lat) {
        return [
          ((lon - lonMin) / (lonMax - lonMin)) * width,
          ((latNorth - lat) / (latNorth - latSouth)) * height
        ];
      }
    };
  }

  function installCurrentMap() {
    const svg = document.querySelector('#tab-map .map-screen svg');
    if (!svg) return;
    const P = currentMapProjection();
    const pointList = coords => coords.map(([lon, lat]) => P.point(lon, lat).map(v => v.toFixed(1)).join(',')).join(' ');

    const seventhArc = [
      [99.5, -28.6], [98.6, -29.4], [97.3, -30.6], [95.8, -32.0],
      [94.2, -33.7], [92.4, -35.5], [90.5, -37.3], [88.5, -39.2],
      [86.3, -41.1], [84.7, -42.5]
    ];

    const bands = {
      ten: { lat: [-41.9678004433056, -28.62785816464285], lon: [78.70387180146327, 99.41448031570644] },
      five: { lat: [-41.36822343717634, -31.6529502146714], lon: [80.75659741028682, 96.73378700330852] },
      one: { lat: [-38.907954539086646, -35.375673062432234], lon: [86.72461824009372, 92.423549009917] }
    };

    function rectForBand(band, cssClass, label) {
      const [x1, y1] = P.point(band.lon[0], band.lat[1]);
      const [x2, y2] = P.point(band.lon[1], band.lat[0]);
      const x = Math.min(x1, x2);
      const y = Math.min(y1, y2);
      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);
      return `<rect class="${cssClass}" data-layer="bands" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/><text class="map-bound-label" data-layer="bands" x="${(x + 7).toFixed(1)}" y="${(y + 15).toFixed(1)}">${label}</text>`;
    }

    let grid = '';
    for (let lon = 76; lon <= 104; lon += 4) {
      const [x] = P.point(lon, P.latNorth);
      grid += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="500" class="grid-line"/>`;
      grid += `<text x="${(x + 3).toFixed(1)}" y="15" fill="#729889" font-size="10" font-family="monospace">${lon}°E</text>`;
    }
    for (let lat = -28; lat >= -42; lat -= 2) {
      const [, y] = P.point(P.lonMin, lat);
      grid += `<line x1="0" y1="${y.toFixed(1)}" x2="900" y2="${y.toFixed(1)}" class="grid-line"/>`;
      grid += `<text x="5" y="${(y - 4).toFixed(1)}" fill="#729889" font-size="10" font-family="monospace">${Math.abs(lat)}°S</text>`;
    }

    const coarse = P.point(93.22757921497498, -34.536712283823114);
    const competitor = P.point(86.7411348869789, -38.907954539086646);
    const arcLabel = P.point(94.0, -34.0);

    svg.setAttribute('viewBox', '0 0 900 500');
    svg.innerHTML = `
      <rect width="900" height="500" class="ocean"/>
      <g>${grid}</g>
      ${rectForBand(bands.ten, 'map-band-10', 'WITHIN 10 LOG UNITS · 62 MODES')}
      ${rectForBand(bands.five, 'map-band-5', 'WITHIN 5 LOG UNITS · 53 MODES')}
      ${rectForBand(bands.one, 'map-band-1', 'WITHIN 1 LOG UNIT · 12 MODES')}
      <polyline points="${pointList(seventhArc)}" class="arc arc-bright" data-layer="arc" fill="none"/>
      <text x="${arcLabel[0].toFixed(1)}" y="${arcLabel[1].toFixed(1)}" class="map-arc-label" data-layer="arc" transform="rotate(-42 ${arcLabel[0].toFixed(1)} ${arcLabel[1].toFixed(1)})">7TH ARC — DISPLAY REFERENCE</text>
      <g data-layer="points">
        <circle cx="${coarse[0].toFixed(1)}" cy="${coarse[1].toFixed(1)}" r="7" class="map-point-coarse"/>
        <line x1="${(coarse[0]-10).toFixed(1)}" y1="${coarse[1].toFixed(1)}" x2="${(coarse[0]+10).toFixed(1)}" y2="${coarse[1].toFixed(1)}" class="crosshair"/>
        <line x1="${coarse[0].toFixed(1)}" y1="${(coarse[1]-10).toFixed(1)}" x2="${coarse[0].toFixed(1)}" y2="${(coarse[1]+10).toFixed(1)}" class="crosshair"/>
        <text x="${(coarse[0]+13).toFixed(1)}" y="${(coarse[1]-7).toFixed(1)}" class="map-point-label">CLEAN COARSE CONSISTENCY MAXIMUM</text>
        <text x="${(coarse[0]+13).toFixed(1)}" y="${(coarse[1]+7).toFixed(1)}" class="map-point-label">34.5367°S / 93.2276°E · PROVISIONAL</text>
        <circle cx="${competitor[0].toFixed(1)}" cy="${competitor[1].toFixed(1)}" r="6" class="map-point-mode"/>
        <text x="${(competitor[0]+12).toFixed(1)}" y="${(competitor[1]-5).toFixed(1)}" class="map-point-label">CONDITIONED 240/240 COMPETITOR</text>
        <text x="${(competitor[0]+12).toFixed(1)}" y="${(competitor[1]+9).toFixed(1)}" class="map-point-label">38.9080°S / 86.7411°E · DESCRIPTIVE</text>
      </g>
      <rect x="610" y="28" width="262" height="93" class="map-legend-box"/>
      <text x="624" y="49" class="map-warning">NO POSTERIOR / NO CURRENT POI</text>
      <text x="624" y="69" class="map-legend-text">Score-distance rectangles are not probability.</text>
      <text x="624" y="85" class="map-legend-text">Points are audit outputs, not recommendations.</text>
      <text x="624" y="101" class="map-legend-text">Whole-arc S50 exploration remains pending.</text>`;
  }

  function setMapLayer(layer) {
    const svg = document.querySelector('#tab-map .map-screen svg');
    if (!svg) return;
    const all = ['arc', 'bands', 'points'];
    all.forEach(name => {
      svg.querySelectorAll(`[data-layer="${name}"]`).forEach(el => {
        el.style.opacity = layer === 'wide' || layer === name ? '1' : '0.16';
      });
    });
    if (layer === 'wide') {
      all.forEach(name => svg.querySelectorAll(`[data-layer="${name}"]`).forEach(el => { el.style.opacity = '1'; }));
    }
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift().split(',');
    return lines.map(line => {
      const values = [];
      let cell = '';
      let quoted = false;
      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') quoted = !quoted;
        else if (ch === ',' && !quoted) { values.push(cell); cell = ''; }
        else cell += ch;
      }
      values.push(cell);
      return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
    });
  }

  function fallbackRing(centerLat, centerLon, radiusKm) {
    const coords = [];
    const dLat = radiusKm / 111.32;
    const dLon = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));
    for (let i = 0; i <= 120; i += 1) {
      const angle = (i / 120) * Math.PI * 2;
      coords.push([centerLon + Math.sin(angle) * dLon, centerLat + Math.cos(angle) * dLat]);
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
    let ring = geojson && geojson.features && geojson.features[0] && geojson.features[0].geometry && geojson.features[0].geometry.coordinates && geojson.features[0].geometry.coordinates[0];
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
    const data = rows.map(row => ({ utc: row.utc, event: row.event, bfo_hz: Number(row.bfo_hz) })).filter(row => row.utc && Number.isFinite(row.bfo_hz));
    body.innerHTML = data.map(row => `<tr><td>${row.utc.replace('2014-03-','').replace('T',' ').replace('Z','')}</td><td>${row.event}</td><td>${row.bfo_hz}</td><td><span class="archive-tag obs">OBSERVED</span></td></tr>`).join('');

    const width = 820;
    const height = 300;
    const left = 58;
    const right = 28;
    const top = 26;
    const bottom = 46;
    const times = data.map(item => Date.parse(item.utc));
    const t0 = Math.min(...times);
    const t1 = Math.max(...times);
    const yMin = -10;
    const yMax = 290;
    const x = time => left + ((time - t0) / Math.max(1, t1 - t0)) * (width - left - right);
    const y = value => top + ((yMax - value) / (yMax - yMin)) * (height - top - bottom);

    let grid = '';
    [0,50,100,150,200,250].forEach(value => {
      const yy = y(value);
      grid += `<line x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}" class="grid"/><text x="8" y="${yy+4}" class="label">${value}</text>`;
    });
    const pts = data.map((item,index) => `${x(times[index]).toFixed(1)},${y(item.bfo_hz).toFixed(1)}`).join(' ');
    const pointMarkup = data.map((item,index) => {
      const xx = x(times[index]);
      const yy = y(item.bfo_hz);
      const anchor = index >= data.length - 2 ? 'end' : 'start';
      const dx = index >= data.length - 2 ? -7 : 7;
      const labelY = index === data.length - 1 ? yy - 8 : yy - 10;
      return `<circle cx="${xx}" cy="${yy}" r="5" class="point"/><text x="${xx+dx}" y="${labelY}" text-anchor="${anchor}" class="value">${item.utc.slice(11,19)} / ${item.bfo_hz} Hz</text>`;
    }).join('');

    svg.innerHTML = `<rect width="${width}" height="${height}" fill="#071d22"/>${grid}<line x1="${left}" y1="${top}" x2="${left}" y2="${height-bottom}" class="axis"/><line x1="${left}" y1="${height-bottom}" x2="${width-right}" y2="${height-bottom}" class="axis"/><polyline points="${pts}" class="series"/>${pointMarkup}<text x="12" y="18" class="label">BFO (Hz)</text><text x="${width-168}" y="${height-12}" class="label">UTC / selected observations</text>`;
  }

  async function loadArchiveData() {
    const status = document.getElementById('archiveLoadStatus');
    const mapStatus = document.getElementById('archiveMapStatus');
    let manifest = fallbackManifest;
    let rows = fallbackBfo;
    let geojson = null;
    const loaded = [];

    try {
      const response = await fetch(ARCHIVE_FILES.manifest, { cache: 'no-store' });
      if (!response.ok) throw new Error(`manifest ${response.status}`);
      manifest = await response.json();
      loaded.push('manifest');
    } catch (error) { console.warn('Archive manifest fallback:', error); }

    try {
      const response = await fetch(ARCHIVE_FILES.bfo, { cache: 'no-store' });
      if (!response.ok) throw new Error(`BFO ${response.status}`);
      rows = parseCsv(await response.text());
      loaded.push('BFO CSV');
    } catch (error) { console.warn('Archive BFO fallback:', error); }

    try {
      const response = await fetch(ARCHIVE_FILES.ring, { cache: 'no-store' });
      if (!response.ok) throw new Error(`ring ${response.status}`);
      geojson = await response.json();
      loaded.push('GeoJSON');
    } catch (error) { console.warn('Archive ring fallback:', error); }

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
    if (mapStatus) mapStatus.textContent = geojson ? 'Preserved GeoJSON loaded from the repository.' : 'Repository GeoJSON unavailable; a geometric fallback is displayed.';
    if (status) status.textContent = loaded.length === 3 ? 'Repository archive loaded: manifest + BFO CSV + GeoJSON.' : `Archive loaded with fallbacks (${loaded.join(', ') || 'embedded metadata only'}).`;
  }

  async function loadCurrentState() {
    let state = currentFallback;
    try {
      const response = await fetch(CURRENT_STATE_FILE, { cache: 'no-store' });
      if (!response.ok) throw new Error(`current state ${response.status}`);
      state = await response.json();
    } catch (error) {
      console.warn('Current-state JSON fallback:', error);
    }
    document.documentElement.dataset.checkpoint = state.checkpoint_id || currentFallback.checkpoint_id;
    const eventLog = document.getElementById('eventLog');
    if (eventLog) eventLog.innerHTML = `<span>SYS</span> ${state.clean_target && state.clean_target.status ? state.clean_target.status : currentFallback.clean_target.status}; ${state.public_status || currentFallback.public_status}.`;
  }

  function installTabsAndMenus() {
    const statusText = document.getElementById('statusText');
    const eventLog = document.getElementById('eventLog');
    const systemState = document.getElementById('systemState');
    const runButton = document.getElementById('runButton');
    const haltButton = document.getElementById('haltButton');
    const clock = document.getElementById('clock');
    const popup = document.getElementById('menuPopup');

    const messages = {
      map: 'Current conditioned diagnostic map selected. No posterior or endpoint is claimed.',
      archive: 'Archived baseline selected. Historical POI package loaded separately from the clean target.',
      satcom: 'Clean SATCOM ownership and terminal message policy selected.',
      solver: 'Numerical checkpoint and planned S50 architecture selected.',
      residuals: 'Mathematical contracts and fail-closed gates selected.',
      drift: 'Ocean-forcing readiness selected. Current trajectory-to-drift coupling is deferred.',
      log: 'Current public checkpoint log selected.'
    };

    function log(source, message) {
      if (eventLog) eventLog.innerHTML = `<span>${source}</span> ${message}`;
      if (statusText) statusText.textContent = message;
    }

    function bindTabs() {
      const tabs = [...document.querySelectorAll('.tab')];
      const panels = [...document.querySelectorAll('.tab-panel')];
      tabs.forEach(tab => {
        if (tab.dataset.bound === 'true') return;
        tab.dataset.bound = 'true';
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          tabs.forEach(item => item.classList.toggle('active', item === tab));
          panels.forEach(panel => panel.classList.toggle('active', panel.id === `tab-${target}`));
          log('VIEW', messages[target] || 'Display changed.');
        });
      });
    }

    bindTabs();

    if (runButton) runButton.addEventListener('click', () => {
      if (systemState) systemState.textContent = ' PREDICTIVE LOCK';
      log('GATE', 'Predictive run blocked: the occurrence-mapped aircraft-performance source is not yet qualified.');
    });

    if (haltButton) haltButton.addEventListener('click', () => {
      if (systemState) systemState.textContent = ' HOLD';
      log('MODEL', 'Public interface hold selected. No scientific process is connected to this control.');
    });

    document.querySelectorAll('[data-map-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.mapAction;
        setMapLayer(action === 'whole' ? 'wide' : action);
        log('MAP', action === 'wide' ? 'All current diagnostic layers displayed.' : `${action} layer emphasized.`);
      });
    });

    const menuItems = {
      file: ['Open Current Checkpoint', 'Open Archive Baseline', 'Export Snapshot...', 'Print...'],
      model: ['Clean SATCOM Target', 'S50 Architecture', 'Aircraft Performance Gate'],
      observations: ['SATCOM Ownership', 'Terminal Events', 'Provenance Register'],
      solver: ['Numerical Checkpoint', 'Math / Gates', 'Current Run Log'],
      drift: ['Forcing Asset', 'Debris-Date Bound', 'Coupling Status'],
      view: ['Current Map', 'Archive Baseline', 'SATCOM', 'Solver', 'Math / Gates', 'Drift', 'Run Log'],
      help: ['Current State README', 'Data Sources', 'About MH370 Modeling System']
    };

    document.querySelectorAll('.menu-button').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const name = button.dataset.menu;
        popup.innerHTML = menuItems[name].map(item => `<button type="button">${item}</button>`).join('');
        popup.style.left = `${button.offsetLeft + 4}px`;
        popup.hidden = false;
        [...popup.querySelectorAll('button')].forEach(item => item.addEventListener('click', () => {
          const text = item.textContent.toLowerCase();
          const mapping = [
            ['archive', 'archive'], ['satcom', 'satcom'], ['numerical', 'solver'], ['s50', 'solver'],
            ['math', 'residuals'], ['gate', 'residuals'], ['drift', 'drift'], ['forcing', 'drift'],
            ['run log', 'log'], ['current map', 'map'], ['checkpoint', 'map']
          ];
          const found = mapping.find(([needle]) => text.includes(needle));
          if (found) document.querySelector(`[data-tab="${found[1]}"]`)?.click();
          else log('MENU', `${item.textContent} selected.`);
          popup.hidden = true;
        }));
      });
    });

    document.addEventListener('click', () => { if (popup) popup.hidden = true; });
    document.querySelectorAll('select').forEach(control => control.addEventListener('change', () => log('CFG', 'Display profile changed; no scientific state was altered.')));

    function updateClock() {
      if (!clock) return;
      clock.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  installArchiveStyles();
  installArchivePanel();
  installCurrentMap();
  installTabsAndMenus();
  loadCurrentState();
  loadArchiveData();
})();
