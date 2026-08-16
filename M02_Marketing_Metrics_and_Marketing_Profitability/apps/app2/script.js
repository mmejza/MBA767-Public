/*
M02 App 2 — Product-Line Profitability Analyzer

Purpose:
Students experience the product-line drop paradox: Studio Equipment Rental has negative net profit but positive NMC. Dropping it reduces total company profit.

LOCKED VANTAGE FITNESS DATA:
Product Lines:
1. Group Fitness
   Sales $13.80M; GP% 46.0%; GP $6.35M; MSE $2.90M; NMC $3.45M; AllocOH $1.40M; Net Profit +$2.05M

2. Personal Training
   Sales $7.80M; GP% 45.3%; GP $3.53M; MSE $2.25M; NMC $1.28M; AllocOH $1.00M; Net Profit +$0.28M

3. Studio Equipment Rental
   Sales $2.00M; GP% 37.0%; GP $0.74M; MSE $0.52M; NMC +$0.22M; AllocOH $0.40M; Net Profit -$0.18M

LOCKED TOTALS:
- Sales: $23.60M
- Gross Profit: $10.62M
- MSE: $5.67M
- NMC: $4.95M
- Allocated OH: $2.80M
- Net Profit: +$2.15M
- Total fixed deduction for operating income: $4.69M
- Baseline Operating Income: $0.26M

DROP-LINE RESULTS:
- Drop Group Fitness: Total NMC $1.50M; Operating Income -$2.95M
- Drop Personal Training: Total NMC $3.67M; Operating Income -$1.02M
- Drop Studio Equipment Rental: Total NMC $4.73M; Operating Income $0.04M
- Drop all three: Total NMC $0.00M; Operating Income -$4.69M

CORE FORMULAS:
- gp = sales * grossMargin / 100
- nmc = gp - mse
- netProfit = nmc - allocatedFixedOverhead
- totalNMC = sum(nmc for active lines)
- operatingIncome = totalNMC - 4.69

CRITICAL LOGIC:
When a line is dropped, allocated overhead does NOT disappear. Only the line's NMC is removed.

ADD-LINE WORKSHEET TEST:
Line name: Premium Recovery
Sales $8.00M; Gross Margin 45%; MSE $2.00M; AllocOH $4.00M
Expected GP $3.60M; NMC +$1.60M; Net Profit -$2.40M

DISPLAY RULES:
- Studio Equipment Rental NMC cell must appear positive/green.
- Studio Equipment Rental Net Profit cell must appear negative/red.
- Financial View emphasizes Net Profit.
- Marketing View emphasizes NMC.
- Restore Line button must re-add dropped lines.

NON-NEGOTIABLES:
- Do not change locked Vantage values.
- Do not remove overhead when dropping a line.
- Do not change worksheet output values.
*/

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const FIXED_OVERHEAD = 4.69; // Total fixed deduction for operating income ($M)

const PRODUCT_LINES = [
  {
    key: 'groupFitness',
    name: 'Group Fitness',
    sales: 13.80,
    gpPct: 46.0,
    gp: 6.35,
    mse: 2.90,
    nmc: 3.45,
    allocOH: 1.40,
    netProfit: 2.05,
  },
  {
    key: 'personalTraining',
    name: 'Personal Training',
    sales: 7.80,
    gpPct: 45.3,
    gp: 3.53,
    mse: 2.25,
    nmc: 1.28,
    allocOH: 1.00,
    netProfit: 0.28,
  },
  {
    key: 'studioRental',
    name: 'Studio Equipment Rental',
    sales: 2.00,
    gpPct: 37.0,
    gp: 0.74,
    mse: 0.52,
    nmc: 0.22,
    allocOH: 0.40,
    netProfit: -0.18,
  },
];

// ─── STATE ────────────────────────────────────────────────────────────────────

const state = {
  dropped: new Set(),      // keys of dropped product lines
  view: 'financial',       // 'financial' | 'marketing'
};

// ─── FORMULAS ─────────────────────────────────────────────────────────────────

function calcWorksheet(sales, gpPct, mse, allocOH) {
  const gp = sales * (gpPct / 100);
  const nmc = gp - mse;
  const netProfit = nmc - allocOH;
  return { gp, nmc, netProfit };
}

function calcTotals(activeLines) {
  return {
    sales:     activeLines.reduce((s, l) => s + l.sales, 0),
    gp:        activeLines.reduce((s, l) => s + l.gp, 0),
    mse:       activeLines.reduce((s, l) => s + l.mse, 0),
    nmc:       activeLines.reduce((s, l) => s + l.nmc, 0),
    allocOH:   activeLines.reduce((s, l) => s + l.allocOH, 0),
    netProfit: activeLines.reduce((s, l) => s + l.netProfit, 0),
  };
}

function calcOperatingIncome(totalNMC) {
  return totalNMC - FIXED_OVERHEAD;
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────

function fmtM(v, sign = false) {
  const abs = Math.abs(v);
  const formatted = `$${abs.toFixed(2)}M`;
  if (sign || v < 0) return v < 0 ? `-${formatted}` : `+${formatted}`;
  return formatted;
}

function fmtPct(v) {
  return `${v.toFixed(1)}%`;
}

// ─── DOM HELPERS ──────────────────────────────────────────────────────────────

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') node.className = v;
    else if (k === 'textContent') node.textContent = v;
    else node.setAttribute(k, v);
  });
  children.forEach(child => {
    if (!child && child !== 0) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

// ─── BUILD TABLE ──────────────────────────────────────────────────────────────

const ROW_DEFS = [
  { key: 'dropBtn',   label: '',             isControl: true },
  { key: 'sales',     label: 'Sales ($M)',   fmt: v => fmtM(v) },
  { key: 'gpPct',     label: 'Gross Margin', fmt: v => fmtPct(v) },
  { key: 'gp',        label: 'Gross Profit', fmt: v => fmtM(v) },
  { key: 'mse',       label: 'Mktg & Sales Expense', fmt: v => fmtM(v) },
  { key: 'nmc',       label: 'NMC',          fmt: v => fmtM(v, true), emphasis: 'marketing' },
  { key: 'allocOH',   label: 'Allocated OH', fmt: v => fmtM(v) },
  { key: 'netProfit', label: 'Net Profit',   fmt: v => fmtM(v, true), emphasis: 'financial' },
];

function buildTable() {
  const wrap = document.getElementById('tableWrapper');
  wrap.innerHTML = '';

  const table = el('table', { className: 'pl-table' });

  // Header row
  const thead = el('thead');
  const hRow  = el('tr');
  hRow.appendChild(el('th', { className: 'metric-col' }));
  PRODUCT_LINES.forEach(line => {
    const dropped = state.dropped.has(line.key);
    hRow.appendChild(el('th', {
      className: `line-col${dropped ? ' dropped' : ''}`,
      'data-line': line.key,
      textContent: line.name,
    }));
  });
  hRow.appendChild(el('th', { className: 'total-col', textContent: 'Active Total' }));
  thead.appendChild(hRow);
  table.appendChild(thead);

  // Body rows
  const tbody = el('tbody');
  const activeLines = PRODUCT_LINES.filter(l => !state.dropped.has(l.key));
  const totals = calcTotals(activeLines);

  ROW_DEFS.forEach(row => {
    const tr = el('tr', { className: `row-${row.key}` });

    // Metric label cell
    tr.appendChild(el('td', { className: `metric-label${row.emphasis ? ` emph-${row.emphasis}` : ''}`, textContent: row.label }));

    // Per-line cells
    PRODUCT_LINES.forEach(line => {
      const dropped = state.dropped.has(line.key);
      if (row.isControl) {
        // Drop / Restore button cell
        const btn = el('button', {
          className: `drop-btn${dropped ? ' restore' : ''}`,
          'data-line': line.key,
          textContent: dropped ? 'Restore' : 'Drop Line',
        });
        btn.addEventListener('click', () => toggleLine(line.key));
        tr.appendChild(el('td', { className: `line-col ctrl-cell${dropped ? ' dropped' : ''}`, 'data-line': line.key }, btn));
      } else {
        const raw = line[row.key];
        const text = dropped ? '—' : row.fmt(raw);
        const td = el('td', {
          className: buildCellClass(line.key, row.key, dropped),
          'data-line': line.key,
          'data-metric': row.key,
          textContent: text,
        });
        tr.appendChild(td);
      }
    });

    // Totals cell (control row shows nothing)
    if (row.isControl) {
      tr.appendChild(el('td', { className: 'total-col' }));
    } else {
      const totalVal = totals[row.key];
      const totalText = (row.key === 'gpPct') ? '—' : row.fmt(totalVal);
      const totalTd = el('td', {
        className: `total-col${row.emphasis ? ` emph-${row.emphasis}` : ''}${row.key === 'nmc' || row.key === 'netProfit' ? ' total-highlight' : ''}`,
        textContent: totalText,
      });
      tr.appendChild(totalTd);
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);

  // Apply view emphasis
  applyViewEmphasis();
}

function buildCellClass(lineKey, metricKey, dropped) {
  let cls = `line-col`;
  if (dropped) cls += ' dropped';

  // Special color rules for Studio Equipment Rental
  if (lineKey === 'studioRental' && !dropped) {
    if (metricKey === 'nmc') cls += ' cell-positive';
    if (metricKey === 'netProfit') cls += ' cell-negative';
  }

  // General positive/negative for net profit column
  if (metricKey === 'netProfit' && !dropped) {
    const line = PRODUCT_LINES.find(l => l.key === lineKey);
    if (line && lineKey !== 'studioRental') {
      cls += line.netProfit >= 0 ? ' cell-positive' : ' cell-negative';
    }
  }

  return cls;
}

// ─── OPERATING INCOME PANEL ───────────────────────────────────────────────────

function updateOperatingIncome() {
  const activeLines = PRODUCT_LINES.filter(l => !state.dropped.has(l.key));
  const totalNMC = activeLines.reduce((s, l) => s + l.nmc, 0);
  const oi = calcOperatingIncome(totalNMC);

  document.getElementById('oi-totalNMC').textContent = fmtM(totalNMC, true);
  document.getElementById('oi-fixed').textContent = `$${FIXED_OVERHEAD.toFixed(2)}M`;

  const oiEl = document.getElementById('oi-value');
  oiEl.textContent = fmtM(oi, true);
  oiEl.className = 'oi-value' + (oi < 0 ? ' warn' : ' positive');

  const oiRow = document.getElementById('oi-row');
  oiRow.className = 'oi-row' + (oi < 0 ? ' warn' : '');
}

// ─── VIEW TOGGLE ─────────────────────────────────────────────────────────────

function applyViewEmphasis() {
  const table = document.querySelector('.pl-table');
  if (!table) return;
  table.classList.toggle('view-financial', state.view === 'financial');
  table.classList.toggle('view-marketing', state.view === 'marketing');

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === state.view);
  });
}

function setView(view) {
  state.view = view;
  applyViewEmphasis();
}

// ─── DROP / RESTORE ───────────────────────────────────────────────────────────

function toggleLine(key) {
  if (state.dropped.has(key)) {
    state.dropped.delete(key);
  } else {
    state.dropped.add(key);
  }
  buildTable();
  updateOperatingIncome();
}

// ─── ADD-LINE WORKSHEET ───────────────────────────────────────────────────────

function buildWorksheet() {
  const section = document.getElementById('worksheetSection');

  const fields = [
    { id: 'ws-sales',    label: 'Sales ($M)',          min: 0, max: 50, step: 0.1, default: 8.00 },
    { id: 'ws-gpPct',    label: 'Gross Margin (%)',     min: 0, max: 80, step: 0.1, default: 45 },
    { id: 'ws-mse',      label: 'Mktg & Sales Expense ($M)', min: 0, max: 20, step: 0.1, default: 2.00 },
    { id: 'ws-allocOH',  label: 'Allocated Overhead ($M)',   min: 0, max: 20, step: 0.1, default: 4.00 },
  ];

  const inputGrid = el('div', { className: 'ws-inputs' });

  fields.forEach(f => {
    const row = el('div', { className: 'ws-input-row' });
    const lbl = el('label', { 'for': f.id, textContent: f.label });
    const input = el('input', {
      type: 'number',
      id: f.id,
      min: f.min,
      max: f.max,
      step: f.step,
      value: f.default,
    });
    input.addEventListener('input', updateWorksheet);
    row.appendChild(lbl);
    row.appendChild(input);
    inputGrid.appendChild(row);
  });

  const outputGrid = el('div', { className: 'ws-outputs' });
  const outputFields = [
    { id: 'ws-out-gp',        label: 'Gross Profit' },
    { id: 'ws-out-nmc',       label: 'NMC' },
    { id: 'ws-out-netProfit', label: 'Net Profit' },
  ];
  outputFields.forEach(f => {
    const row = el('div', { className: 'ws-output-row', id: `row-${f.id}` });
    row.appendChild(el('span', { className: 'ws-output-label', textContent: f.label }));
    row.appendChild(el('span', { className: 'ws-output-value', id: f.id }));
    outputGrid.appendChild(row);
  });

  section.appendChild(el('h2', { textContent: 'Add-Line Worksheet' }));
  section.appendChild(el('p', { className: 'ws-note', textContent: 'Enter a potential new product line to evaluate its profitability.' }));
  section.appendChild(inputGrid);
  section.appendChild(outputGrid);
}

function updateWorksheet() {
  const sales   = parseFloat(document.getElementById('ws-sales').value)   || 0;
  const gpPct   = parseFloat(document.getElementById('ws-gpPct').value)   || 0;
  const mse     = parseFloat(document.getElementById('ws-mse').value)     || 0;
  const allocOH = parseFloat(document.getElementById('ws-allocOH').value) || 0;

  const { gp, nmc, netProfit } = calcWorksheet(sales, gpPct, mse, allocOH);

  document.getElementById('ws-out-gp').textContent        = fmtM(gp, true);
  document.getElementById('ws-out-nmc').textContent       = fmtM(nmc, true);
  document.getElementById('ws-out-netProfit').textContent = fmtM(netProfit, true);

  // Color coding
  const nmcEl = document.getElementById('ws-out-nmc');
  nmcEl.className = 'ws-output-value ' + (nmc >= 0 ? 'cell-positive' : 'cell-negative');

  const npEl = document.getElementById('ws-out-netProfit');
  npEl.className = 'ws-output-value ' + (netProfit >= 0 ? 'cell-positive' : 'cell-negative');

  document.getElementById('row-ws-out-nmc').className       = 'ws-output-row' + (nmc < 0 ? ' warn' : '');
  document.getElementById('row-ws-out-netProfit').className = 'ws-output-row' + (netProfit < 0 ? ' warn' : '');
}

// ─── BUILD OPERATING INCOME PANEL ────────────────────────────────────────────

function buildOIPanel() {
  const panel = document.getElementById('oiPanel');
  panel.innerHTML = '';

  panel.appendChild(el('h2', { textContent: 'Operating Income' }));

  const table = el('table', { className: 'oi-table' });
  const rows = [
    { label: 'Total Active NMC',        id: 'oi-totalNMC' },
    { label: 'Fixed OH Deduction',       id: 'oi-fixed',  note: '(Overhead does not disappear when lines are dropped)' },
  ];
  rows.forEach(r => {
    const tr = el('tr');
    tr.appendChild(el('td', { className: 'oi-label', textContent: r.label + (r.note ? '' : '') }));
    if (r.note) {
      const td = el('td', { className: 'oi-label' });
      td.innerHTML = `${r.label} <span class="oi-note">${r.note}</span>`;
      tr.replaceChild(td, tr.firstChild);
    }
    tr.appendChild(el('td', { className: 'oi-cell', id: r.id }));
    table.appendChild(tr);
  });

  // Operating Income result row
  const oiRow = el('tr', { id: 'oi-row', className: 'oi-row' });
  oiRow.appendChild(el('td', { className: 'oi-label oi-result-label', textContent: 'Operating Income' }));
  oiRow.appendChild(el('td', { className: 'oi-cell', id: 'oi-value' }));
  table.appendChild(oiRow);

  panel.appendChild(table);
}

// ─── RESET ────────────────────────────────────────────────────────────────────

function reset() {
  state.dropped.clear();
  buildTable();
  updateOperatingIncome();

  // Reset worksheet to test values
  document.getElementById('ws-sales').value   = 8.00;
  document.getElementById('ws-gpPct').value   = 45;
  document.getElementById('ws-mse').value     = 2.00;
  document.getElementById('ws-allocOH').value = 4.00;
  updateWorksheet();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('appTitle').textContent = 'Product-Line Profitability Analyzer';
  document.getElementById('instructions').textContent =
    'Toggle product lines on/off to see how dropping a line affects company Operating Income. ' +
    'Notice that Studio Equipment Rental has a negative Net Profit but a positive NMC — dropping it reduces total profitability.';

  // View toggle buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  buildOIPanel();
  buildTable();
  updateOperatingIncome();
  buildWorksheet();
  updateWorksheet();

  document.getElementById('resetBtn').addEventListener('click', reset);

  const focusModeBtn = document.getElementById('focusModeBtn');
  if (focusModeBtn) {
    focusModeBtn.addEventListener('click', () => {
      const enabled = document.body.classList.toggle('focus-mode');
      focusModeBtn.textContent = enabled ? 'Exit Focus Mode' : 'Focus Mode';
      focusModeBtn.setAttribute('aria-pressed', String(enabled));
    });
  }
});