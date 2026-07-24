import { getState, save } from './state.js';

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
    enterApp();
    onEnter();
  }
}

function doLogin(name, onEnter) {
  const state = getState();
  state.user.name = name || state.user.name || '同學';
  save();
  enterApp();
  onEnter();
}

function enterApp() {
  loginScreen.style.display = 'none';
  appShell.style.display = 'flex';
}