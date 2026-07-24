import { uid, todayISO, fmt, shake, playStamp } from './utils.js';
import { getState, save, accountBalance } from './state.js';

let currentType = 'expense';
let selectedAccountId = null;
let selectedCategoryId = null;

export function initRecord() {
  initTypeButtons();
  document.getElementById('submitTxBtn').addEventListener('click', submitTx);
}

function initTypeButtons() {
  document.querySelectorAll('.type-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      document.querySelectorAll('.type-btn').forEach((b) =>
        b.setAttribute('data-active', b === btn ? 'true' : 'false')
      );
      document.getElementById('toAccountWrap').style.display =
        currentType === 'transfer' ? 'block' : 'none';
      document.getElementById('categoryWrap').style.display =
        currentType === 'expense' ? 'block' : 'none';
      document.getElementById('fromLabel').textContent =
        currentType === 'transfer' ? '從' : '存錢處';
      renderCategoryPills();
    });
  });
}

function initSelectedAccount() {
  const state = getState();
  if (!state.accounts.find((a) => a.id === selectedAccountId)) {
    selectedAccountId = state.accounts.length ? state.accounts[0].id : null;
  }
}

function fillAccountSelects() {
  const state = getState();
  const txAcc = document.getElementById('txAccount');
  const txTo = document.getElementById('txToAccount');
  txAcc.innerHTML = state.accounts
    .map((a) => `<option value="${a.id}">${a.icon} ${a.name}</option>`)
    .join('');
  txTo.innerHTML = state.accounts
    .map((a) => `<option value="${a.id}">${a.icon} ${a.name}</option>`)
    .join('');
  if (selectedAccountId) txAcc.value = selectedAccountId;
  if (!txAcc.dataset.bound) {
    txAcc.addEventListener('change', () => {
      selectedAccountId = txAcc.value;
      renderCategoryPills();
    });
    txAcc.dataset.bound = '1';
  }
}

function renderCategoryPills() {
  const state = getState();
  const wrap = document.getElementById('txCatWrap');
  wrap.innerHTML = '';
  const cats = state.categories.filter((c) => c.accountId === selectedAccountId);
  if (cats.length > 0 && !cats.find((c) => c.id === selectedCategoryId))
    selectedCategoryId = cats[0].id;
  if (cats.length === 0) selectedCategoryId = null;

  cats.forEach((c) => {
    const pill = document.createElement('div');
    pill.className = 'cat-pill';
    pill.textContent = c.name;
    pill.setAttribute('data-active', selectedCategoryId === c.id ? 'true' : 'false');
    pill.addEventListener('click', () => {
      selectedCategoryId = c.id;
      renderCategoryPills();
    });
    wrap.appendChild(pill);
  });

  const addPill = document.createElement('div');
  addPill.className = 'cat-pill cat-pill-add';
  addPill.textContent = '＋ 新增用途';
  addPill.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cat-pill-input';
    input.placeholder = '輸入新用途名稱';
    addPill.replaceWith(input);
    input.focus();
    function commit() {
      const name = input.value.trim();
      if (name) {
        const newCat = { id: uid(), accountId: selectedAccountId, name, budget: 0 };
        state.categories.push(newCat);
        selectedCategoryId = newCat.id;
        save();
      }
      renderCategoryPills();
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      }
      if (e.key === 'Escape') renderCategoryPills();
    });
    input.addEventListener('blur', commit);
  });
  wrap.appendChild(addPill);

  if (cats.length === 0) {
    const hint = document.createElement('div');
    hint.className = 'empty-hint';
    hint.style.cssText = 'padding:6px 0; width:100%;';
    hint.textContent = '這個存錢處還沒有用途，點「＋ 新增用途」立刻建立';
    wrap.insertBefore(hint, addPill);
  }
}

function submitTx() {
  const state = getState();
  const amount = parseFloat(document.getElementById('txAmount').value);
  if (!amount || amount <= 0) {
    shake(document.getElementById('txAmount'));
    return;
  }
  if (!selectedAccountId) return;
  const note = document.getElementById('txNote').value.trim();
  const tx = {
    id: uid(),
    type: currentType,
    date: todayISO(),
    accountId: selectedAccountId,
    amount: amount,
    note: note,
    categoryId: currentType === 'expense' ? selectedCategoryId : null,
    toAccountId:
      currentType === 'transfer' ? document.getElementById('txToAccount').value : null,
  };
  if (currentType === 'expense' && !tx.categoryId) {
    shake(document.getElementById('txCatWrap'));
    return;
  }
  if (currentType === 'transfer' && tx.toAccountId === tx.accountId) {
    shake(document.getElementById('txToAccount'));
    return;
  }
  state.transactions.unshift(tx);
  save();
  document.getElementById('txAmount').value = '';
  document.getElementById('txNote').value = '';
  playStamp();
  renderTxList();
}

export function renderTxList() {
  const state = getState();
  const list = document.getElementById('txList');
  if (state.transactions.length === 0) {
    list.innerHTML =
      '<div class="empty-hint">還沒有任何紀錄<br>記下第一筆，開始細分你的錢</div>';
    return;
  }
  list.innerHTML = '';
  state.transactions.slice(0, 30).forEach((t) => {
    const acc = state.accounts.find((a) => a.id === t.accountId);
    const toAcc = t.toAccountId ? state.accounts.find((a) => a.id === t.toAccountId) : null;
    const cat = t.categoryId ? state.categories.find((c) => c.id === t.categoryId) : null;
    const row = document.createElement('div');
    row.className = 'tx-item';
    const icon =
      t.type === 'transfer'
        ? '🔁'
        : cat
          ? '🏷️'
          : acc
            ? acc.icon
            : '💰';
    const title =
      t.type === 'transfer'
        ? `${acc ? acc.name : ''} → ${toAcc ? toAcc.name : ''}`
          : cat
            ? cat.name
            : t.type === 'income'
              ? '收入'
              : '支出';
    const sub = `${acc ? acc.name : ''}${t.note ? ' · ' + t.note : ''} · ${t.date}`;
    const sign = t.type === 'income' ? '+' : t.type === 'transfer' ? '' : '-';
    row.innerHTML = `
      <div class="tx-icon">${icon}</div>
      <div class="tx-mid">
        <div class="tx-cat">${title}</div>
        <div class="tx-sub">${sub}</div>
      </div>
      <div class="tx-amt ${t.type} mono">${sign}$${fmt(t.amount)}</div>
      <div class="tx-del" data-id="${t.id}">刪除</div>
    `;
    row.querySelector('.tx-del').addEventListener('click', () => {
      state.transactions = state.transactions.filter((x) => x.id !== t.id);
      save();
      renderTxList();
    });
    list.appendChild(row);
  });
}

export function renderRecord() {
  initSelectedAccount();
  fillAccountSelects();
  renderCategoryPills();
  renderTxList();
}