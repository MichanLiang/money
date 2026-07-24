import { getState, save, applyTheme, totalBalance } from './state.js';
import { initAuth } from './auth.js';
import { initRecord, renderRecord, renderTxList } from './record.js';
import { renderCharts } from './chart.js';
import { initSettings, renderSettings, setRenderAll } from './settings.js';

let renderAll;

function renderAllFn() {
  const state = getState();
  document.getElementById('userNameDisplay').textContent = state.user.name || '同學';
  document.getElementById('totalBalance').textContent = totalBalance().toLocaleString('en-US');
  renderRecord();
  if (document.getElementById('page-chart').classList.contains('active')) renderCharts();
}

renderAll = renderAllFn;
setRenderAll(renderAllFn);

function initNav() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((b) => b.setAttribute('data-active', 'false'));
      btn.setAttribute('data-active', 'true');
      document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
      document.getElementById(btn.dataset.page).classList.add('active');
      if (btn.dataset.page === 'page-chart') renderCharts();
      if (btn.dataset.page === 'page-settings') renderSettings();
    });
  });
}

function init() {
  applyTheme();
  initAuth(() => {
    renderAllFn();
  });
  initRecord();
  initSettings();
  initNav();
}

init();