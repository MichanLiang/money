import { ICONS, THEME_COLORS, getState, save, resetState } from './state.js';
import { shake } from './utils.js';
import { renderRecord } from './record.js';

const iconSvgs = {
  '👛': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  '🏦': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 10v11"/><path d="M12 10v11"/><path d="M16 10v11"/></svg>',
  '🪪': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M7 14h2"/><path d="M14 14h4"/><path d="M14 10h4"/></svg>',
  '💰': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  '🐷': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="10" r="6"/><path d="M7.5 7.5v.01"/><path d="M10.5 7.5v.01"/><path d="M9 14a3.5 3.5 0 0 0 4 0"/><circle cx="9" cy="10" r="2"/></svg>',
  '💵': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="12" x="2" y="6" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M6 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>',
  '🎒': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
  '☕': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
  '🚌': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H6a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
  '🍜': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
  '🧺': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/><path d="M7 18v-8a5 5 0 0 1 10 0v8"/><path d="M2 8h16"/><path d="M5 8V6a4 4 0 0 1 8 0v2"/></svg>',
  '📚': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  '🎮': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><path d="M15.5 12l-3.5-1-1-3-3.5 1-1 3 3.5 1 1 3z"/><path d="M16 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/><path d="M19 12v2a2 2 0 0 1-2 2h-2"/></svg>',
  '🏠': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
  '💊': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
  '🛍️': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
};

function getIconSvg(emoji) {
  return iconSvgs[emoji] || '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
}

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
      `<div class="icon-choice" data-ic="${ic}" data-active="${ic === newAcctIcon}">${getIconSvg(ic)}</div>`
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
      <span style="color:var(--text-secondary);">${getIconSvg(a.icon)}</span>
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
    .map((a) => `<option value="${a.id}">${a.name}</option>`)
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