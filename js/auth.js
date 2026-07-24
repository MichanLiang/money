import { auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from './firebase.js';
import {
  signInWithRedirect,
  getRedirectResult,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getState, save, loadFromFirestore } from './state.js';

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const nameModal = document.getElementById('nameModal');
const nameModalInput = document.getElementById('nameModalInput');
const confirmNameBtn = document.getElementById('confirmNameBtn');

let pendingOnEnter = null;
let authResolved = false;

export function initAuth(onEnter) {
  pendingOnEnter = onEnter;

  document.getElementById('googleLoginBtn').addEventListener('click', () => {
    doGoogleLogin();
  });

  confirmNameBtn.addEventListener('click', confirmName);
  nameModalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmName();
  });

  document.getElementById('logoutBtn').addEventListener('click', doLogout);

  getRedirectResult(auth).catch((error) => {
    console.error('Redirect error:', error);
  });

  onAuthStateChanged(auth, async (user) => {
    if (authResolved) return;
    if (!user) {
      authResolved = true;
      showLogin();
      return;
    }
    try {
      await loadFromFirestore(user.uid, user.displayName);
      const state = getState();
      if (!state.user.name) {
        enterApp();
        showNameModal();
      } else {
        enterApp();
        if (pendingOnEnter) pendingOnEnter();
      }
      authResolved = true;
    } catch (error) {
      console.error('載入資料失敗:', error);
      authResolved = true;
      showLogin();
    }
  });
}

function showLogin() {
  loginScreen.style.display = 'flex';
  appShell.style.display = 'none';
}

function showNameModal() {
  nameModalInput.value = '';
  nameModal.classList.add('show');
  nameModalInput.focus();
}

async function confirmName() {
  const name = nameModalInput.value.trim();
  if (!name) return;
  const state = getState();
  state.user.name = name;
  save();
  nameModal.classList.remove('show');
  if (pendingOnEnter) pendingOnEnter();
}

async function doGoogleLogin() {
  try {
    await signInWithRedirect(auth, new GoogleAuthProvider());
  } catch (error) {
    console.error('登入失敗:', error);
    alert('登入失敗：' + error.message);
  }
}

async function doLogout() {
  if (!confirm('確定要登出嗎？')) return;
  await signOut(auth);
  authResolved = false;
  showLogin();
}

function enterApp() {
  loginScreen.style.display = 'none';
  appShell.style.display = 'flex';
}