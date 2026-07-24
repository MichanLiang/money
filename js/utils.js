export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function thisMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function fmt(n) {
  return Math.round(n).toLocaleString('en-US');
}

export function shake(el) {
  el.style.transition = 'transform .08s';
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 260 }
  );
}

export function playStamp() {
  const fx = document.getElementById('stampFx');
  fx.classList.remove('go');
  void fx.offsetWidth;
  fx.classList.add('go');
}