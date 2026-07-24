import { auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from './firebase.js';
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
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = result.user;
    await loadFromFirestore(user.uid, user.displayName);
    enterApp();
    onEnter();
  } catch (error) {
    console.error('登入失敗:', error);
    alert('登入失敗，請稍後再試');
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