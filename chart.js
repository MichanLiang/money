import { fmt, thisMonthKey } from './utils.js';
import { getState, accountBalance, categorySpentThisMonth } from './state.js';

let pieChartInstance = null;

export function renderCharts() {
  const state = getState();

  // 餘額卡片
  const grid = document.getElementById('balanceGrid');
  grid.innerHTML = state.accounts
    .map(
      (a) => `
    <div class="bal-card">
      <div class="acct-icon">${a.icon}</div>
      <div class="acct-name">${a.name}</div>
      <div class="val mono">$${fmt(accountBalance(a.id))}</div>
    </div>
  `
    )
    .join('');

  // 圓餅圖
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
    const palette = ['#AE3B2E', '#2A3F6B', '#C9A227', '#6B3F5F', '#2C6E68', '#8A8F5C', '#B8763F'];
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
            labels: { font: { family: "'Noto Sans TC'" }, boxWidth: 12 },
          },
        },
        cutout: '58%',
      },
    });
  }

  // 預算進度
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
              <span>${c.name} <span style="color:var(--ink-text-soft);font-size:11px;">（${acc ? acc.name : ''}）</span></span>
              <span class="mono">$${fmt(spent)} / $${fmt(budget)}</span>
            </div>
            <div class="budget-bar-bg"><div class="budget-bar-fill ${over ? 'over' : ''}" style="width:${pct}%"></div></div>
          </div>
        `;
      })
      .join('');
  }
}