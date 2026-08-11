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
