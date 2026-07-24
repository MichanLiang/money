import { auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from './firebase.js';
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

export function initAuth(onEnter) {
  pendingOnEnter = onEnter;

  document.getElementById('googleLoginBtn').addEventListener('click', () => {
    doGoogleLogin();
  });

  confirmNameBtn.addEventListener('click', confirmName);
  nameModalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmName();
  });

  getRedirectResult(auth).catch((error) => {
    console.error('Redirect error:', error);
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
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
    } catch (error) {
      console.error('載入資料失敗:', error);
      alert('載入資料失敗：' + error.message);
    }
  });
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

function enterApp() {
  loginScreen.style.display = 'none';
  appShell.style.display = 'flex';
}