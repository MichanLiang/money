import { ICONS, THEME_COLORS, getState, save, resetState } from './state.js';
import { shake } from './utils.js';
import { renderRecord } from './record.js';

export function initSettings() {
  document.getElementById('settingsNameInput').addEventListener('change', (e) => {
    const state = getState();
    state.user.name = e.target.value.trim() || state.user.name;
    save();
    renderAll();
  });

  document.getElementById('addAcctBtn').addEventListener('click', showAddAcctModal);
  document.getElementById('closeAcctModal').addEventListener('click', hideAddAcctModal);
  document.getElementById('confirmAddAcctBtn').addEventListener('click', confirmAddAcct);

  document.getElementById('addCatBtn').addEventListener('click', addCategory);
  document.getElementById('resetDataBtn').addEventListener('click', resetData);
}

let newAcctIcon = ICONS[0];

function showAddAcctModal() {
  document.getElementById('newAcctName').value = '';
  document.getElementById('newAcctBalance').value = '';
  newAcctIcon = ICONS[0];
  const iw = document.getElementById('newAcctIconWrap');
  iw.innerHTML = ICONS.map(
    (ic) =>
      `<div class="icon-choice" data-ic="${ic}" data-active="${ic === newAcctIcon}">${ic}</div>`
  ).join('');
  iw.querySelectorAll('.icon-choice').forEach((el) => {
    el.addEventListener('click', () => {
      newAcctIcon = el.dataset.ic;
      iw.querySelectorAll('.icon-choice').forEach((x) =>
        x.setAttribute('data-active', x.dataset.ic === newAcctIcon ? 'true' : 'false')
      );
    });
  });
  document.getElementById('acctModal').classList.add('show');
}

function hideAddAcctModal() {
  document.getElementById('acctModal').classList.remove('show');
}

function confirmAddAcct() {
  const state = getState();
  const name = document.getElementById('newAcctName').value.trim();
  if (!name) {
    shake(document.getElementById('newAcctName'));
    return;
  }
  const bal = parseFloat(document.getElementById('newAcctBalance').value) || 0;
  state.accounts.push({ id: Date.now().toString(36), name, icon: newAcctIcon, startBalance: bal });
  save();
  hideAddAcctModal();
  renderAll();
}

function addCategory() {
  const state = getState();
  const accId = document.getElementById('catManageAcctSelect').value;
  state.categories.push({ id: Date.now().toString(36), accountId: accId, name: '新分項', budget: 0 });
  save();
  renderSettings();
}

async function resetData() {
  if (!confirm('確定要清空所有資料嗎？此動作無法復原。')) return;
  const state = getState();
  const name = state.user.name;
  await resetState(name);
  renderAll();
  renderSettings();
}

export function renderSettings() {
  const state = getState();
  document.getElementById('settingsNameInput').value = state.user.name;

  // 主題色
  const swatchWrap = document.getElementById('themeSwatches');
  swatchWrap.innerHTML = THEME_COLORS.map(
    (c) =>
      `<div class="swatch ${state.user.theme === c.name ? 'active' : ''}" data-name="${c.name}" style="background:${c.val}"></div>`
  ).join('');
  swatchWrap.querySelectorAll('.swatch').forEach((sw) => {
    sw.addEventListener('click', () => {
      state.user.theme = sw.dataset.name;
      save();
      applyTheme();
      renderSettings();
    });
  });

  // 存錢處管理
  const acctCard = document.getElementById('acctManageCard');
  acctCard.innerHTML = state.accounts
    .map(
      (a) => `
    <div class="acct-manage-row">
      <span style="font-size:20px;">${a.icon}</span>
      <input type="text" value="${a.name}" data-id="${a.id}" class="acct-name-edit" style="flex:1;">
      <span class="tx-del" data-del-acct="${a.id}">刪除</span>
    </div>
  `
    )
    .join('');
  acctCard.querySelectorAll('.acct-name-edit').forEach((inp) => {
    inp.addEventListener('change', () => {
      const a = state.accounts.find((x) => x.id === inp.dataset.id);
      if (a) {
        a.name = inp.value.trim() || a.name;
        save();
        renderAll();
      }
    });
  });
  acctCard.querySelectorAll('[data-del-acct]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-del-acct');
      if (state.accounts.length <= 1) {
        alert('至少要保留一個存錢處');
        return;
      }
      if (!confirm('刪除這個存錢處會一併移除其分項與相關紀錄，確定嗎？')) return;
      state.accounts = state.accounts.filter((a) => a.id !== id);
      state.categories = state.categories.filter((c) => c.accountId !== id);
      state.transactions = state.transactions.filter(
        (t) => t.accountId !== id && t.toAccountId !== id
      );
      save();
      renderAll();
      renderSettings();
    });
  });

  // 分項管理
  const catSel = document.getElementById('catManageAcctSelect');
  catSel.innerHTML = state.accounts
    .map((a) => `<option value="${a.id}">${a.icon} ${a.name}</option>`)
    .join('');
  if (!catSel.dataset.bound) {
    catSel.addEventListener('change', renderCatManageList);
    catSel.dataset.bound = '1';
  }
  renderCatManageList();
}

function renderCatManageList() {
  const state = getState();
  const accId = document.getElementById('catManageAcctSelect').value;
  const list = document.getElementById('catManageList');
  const cats = state.categories.filter((c) => c.accountId === accId);
  if (cats.length === 0) {
    list.innerHTML = '<div class="empty-hint" style="padding:10px 0;">這個存錢處還沒有分項</div>';
    return;
  }
  list.innerHTML = cats
    .map(
      (c) => `
    <div class="cat-manage-item">
      <input type="text" value="${c.name}" data-id="${c.id}" class="cat-name-edit" placeholder="分項名稱">
      <input type="number" value="${c.budget || 0}" data-id="${c.id}" class="budget-num cat-budget-edit" placeholder="月預算">
      <span class="tx-del" data-del-cat="${c.id}">刪除</span>
    </div>
  `
    )
    .join('');
  list.querySelectorAll('.cat-name-edit').forEach((inp) => {
    inp.addEventListener('change', () => {
      const c = state.categories.find((x) => x.id === inp.dataset.id);
      if (c) {
        c.name = inp.value.trim() || c.name;
        save();
      }
    });
  });
  list.querySelectorAll('.cat-budget-edit').forEach((inp) => {
    inp.addEventListener('change', () => {
      const c = state.categories.find((x) => x.id === inp.dataset.id);
      if (c) {
        c.budget = parseFloat(inp.value) || 0;
        save();
      }
    });
  });
  list.querySelectorAll('[data-del-cat]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-del-cat');
      state.categories = state.categories.filter((c) => c.id !== id);
      save();
      renderCatManageList();
    });
  });
}

import { applyTheme } from './state.js';

let renderAll;

export function setRenderAll(fn) {
  renderAll = fn;
}