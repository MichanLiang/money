import { fmt, thisMonthKey } from './utils.js';
import { getState, accountBalance, categorySpentThisMonth } from './state.js';

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

let pieChartInstance = null;

export function renderCharts() {
  const state = getState();

  const grid = document.getElementById('balanceGrid');
  grid.innerHTML = state.accounts
    .map(
      (a) => `
    <div class="bal-card">
      <div class="acct-icon">${getIconSvg(a.icon)}</div>
      <div class="acct-name">${a.name}</div>
      <div class="val mono">$${fmt(accountBalance(a.id))}</div>
    </div>
  `
    )
    .join('');

  const mk = thisMonthKey();
  const expenseByCat = {};
  state.transactions
    .filter((t) => t.type === 'expense' && t.date.slice(0, 7) === mk)
    .forEach((t) => {
      const cat = state.categories.find((c) => c.id === t.categoryId);
      const name = cat ? cat.name : '其他';
      expenseByCat[name] = (expenseByCat[name] || 0) + t.amount;
    });
  const labels = Object.keys(expenseByCat);
  const data = Object.values(expenseByCat);
  const canvas = document.getElementById('pieChart');
  const hint = document.getElementById('pieEmptyHint');
  if (labels.length === 0) {
    canvas.style.display = 'none';
    hint.style.display = 'block';
  } else {
    canvas.style.display = 'block';
    hint.style.display = 'none';
    const palette = ['#C8553D', '#1E293B', '#D4A843', '#6B3F5F', '#2C6E68', '#8A8F5C', '#B8763F'];
    if (pieChartInstance) pieChartInstance.destroy();
    pieChartInstance = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data, backgroundColor: palette, borderWidth: 2, borderColor: '#fff' }],
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: "'Inter', sans-serif", size: 12 }, boxWidth: 10, padding: 12 },
          },
        },
        cutout: '65%',
      },
    });
  }

  const bwrap = document.getElementById('budgetProgressWrap');
  if (state.categories.length === 0) {
    bwrap.innerHTML = '<div class="empty-hint">還沒有設定分項預算</div>';
  } else {
    bwrap.innerHTML = state.categories
      .map((c) => {
        const acc = state.accounts.find((a) => a.id === c.accountId);
        const spent = categorySpentThisMonth(c.id);
        const budget = c.budget || 0;
        const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
        const over = budget > 0 && spent > budget;
        return `
          <div class="budget-row">
            <div class="budget-top">
              <span class="budget-name">${c.name} <span style="color:var(--text-muted);font-size:11px;">${acc ? acc.name : ''}</span></span>
              <span class="budget-val mono">$${fmt(spent)} / $${fmt(budget)}</span>
            </div>
            <div class="budget-bar-bg"><div class="budget-bar-fill ${over ? 'over' : ''}" style="width:${pct}%"></div></div>
          </div>
        `;
      })
      .join('');
  }
}