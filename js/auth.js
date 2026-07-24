import { getState, save, loadFromFirestore } from './state.js';

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');

export function initAuth(onEnter) {
  document.getElementById('googleLoginBtn').addEventListener('click', () => {
    const nameInput = document.getElementById('loginNameInput').value.trim();
    doLogin(nameInput || '同學', onEnter);
  });

  document.getElementById('loginNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin(e.target.value.trim(), onEnter);
  });

  const state = getState();
  if (state.user.name) {
    loadFromFirestore(state.user.name).then(() => {
      enterApp();
      onEnter();
    });
  }
}

async function doLogin(name, onEnter) {
  const displayName = name || '同學';
  await loadFromFirestore(displayName);
  enterApp();
  onEnter();
}

function enterApp() {
  loginScreen.style.display = 'none';
  appShell.style.display = 'flex';
}