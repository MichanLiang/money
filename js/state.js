import { uid } from './utils.js';
import { db, doc, getDoc, setDoc } from './firebase.js';

const STORAGE_KEY = 'budgetApp_v1';

export const ICONS = ['👛', '🏦', '🪪', '💰', '🐷', '💵', '🎒', '☕', '🚌', '🍜', '🧺', '📚', '🎮', '🏠', '💊', '🛍️'];

export const THEME_COLORS = [
  { name: 'seal', val: '#AE3B2E' },
  { name: 'navy', val: '#2A3F6B' },
  { name: 'gold', val: '#B08B1E' },
  { name: 'plum', val: '#6B3F5F' },
  { name: 'teal', val: '#2C6E68' },
];

function defaultState() {
  const bankId = uid();
  const walletId = uid();
  return {
    user: { name: '', theme: 'seal' },
    accounts: [
      { id: bankId, name: '銀行帳戶', icon: '🏦', startBalance: 0 },
      { id: walletId, name: '零用錢包', icon: '👛', startBalance: 0 },
    ],
    categories: [
      { id: uid(), accountId: walletId, name: '吃飯錢', budget: 6000 },
      { id: uid(), accountId: walletId, name: '車資', budget: 1000 },
      { id: uid(), accountId: walletId, name: '生活用品', budget: 1500 },
    ],
    transactions: [],
  };
}

let state = defaultState();
let userId = null;

export async function loadFromFirestore(uid, displayName) {
  if (!uid) return false;
  userId = uid;
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    state = docSnap.data();
  } else {
    state = defaultState();
    state.user.name = displayName || '';
    await saveToFirestore();
  }
  return true;
}

export async function saveToFirestore() {
  if (!userId) return;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, state);
  } catch (e) {
    console.error('儲存失敗:', e);
  }
}

export function getState() {
  return state;
}

export function setState(newState) {
  state = newState;
}

export function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveToFirestore();
}

export async function resetState(name) {
  state = defaultState();
  state.user.name = name;
  await saveToFirestore();
}

export function accountBalance(accId) {
  const acc = state.accounts.find((a) => a.id === accId);
  if (!acc) return 0;
  let bal = acc.startBalance || 0;
  state.transactions.forEach((t) => {
    if (t.type === 'income' && t.accountId === accId) bal += t.amount;
    else if (t.type === 'expense' && t.accountId === accId) bal -= t.amount;
    else if (t.type === 'transfer') {
      if (t.accountId === accId) bal -= t.amount;
      if (t.toAccountId === accId) bal += t.amount;
    }
  });
  return bal;
}

export function totalBalance() {
  return state.accounts.reduce((s, a) => s + accountBalance(a.id), 0);
}

export function categorySpentThisMonth(catId) {
  const mk = thisMonthKey();
  return state.transactions
    .filter((t) => t.type === 'expense' && t.categoryId === catId && t.date.slice(0, 7) === mk)
    .reduce((s, t) => s + t.amount, 0);
}

function thisMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function applyTheme() {
  const c = THEME_COLORS.find((t) => t.name === state.user.theme) || THEME_COLORS[0];
  document.documentElement.style.setProperty('--accent', c.val);
  document.documentElement.style.setProperty('--accent-soft', c.val + 'cc');
}