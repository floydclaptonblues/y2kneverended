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

  installDevelopmentNotice();

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
