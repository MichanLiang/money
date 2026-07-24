import { auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from './firebase.js';
import {
  signInWithRedirect,
  getRedirectResult,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getState, save, loadFromFirestore } from './state.js';

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');

export function initAuth(onEnter) {
  document.getElementById('googleLoginBtn').addEventListener('click', () => {
    doGoogleLogin(onEnter);
  });

  document.getElementById('loginNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = e.target.value.trim();
      if (name) doManualLogin(name, onEnter);
    }
  });

  getRedirectResult(auth).then(async (result) => {
    if (result) {
      const user = result.user;
      await loadFromFirestore(user.uid, user.displayName);
      enterApp();
      onEnter();
    }
  }).catch((error) => {
    console.error('Redirect 登入失敗:', error);
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await loadFromFirestore(user.uid, user.displayName);
      enterApp();
      onEnter();
    }
  });
}

async function doGoogleLogin(onEnter) {
  try {
    await signInWithRedirect(auth, new GoogleAuthProvider());
  } catch (error) {
    console.error('登入失敗:', error);
    alert('登入失敗：' + error.message);
  }
}

async function doManualLogin(name, onEnter) {
  await loadFromFirestore(name, name);
  enterApp();
  onEnter();
}

function enterApp() {
  loginScreen.style.display = 'none';
  appShell.style.display = 'flex';
}