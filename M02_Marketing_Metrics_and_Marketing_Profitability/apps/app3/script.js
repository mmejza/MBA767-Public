/*
M02 App 3 — Marketing ROS/ROI Benchmarking Calculator

Purpose:
Students calculate NMC, Marketing ROS, and Marketing ROI using the 75% MSE rule, then benchmark Vantage Fitness against competitors.

TAB A LOCKED VANTAGE INPUTS:
- Sales Revenue: $23.60M
- COGS: $12.98M
- SGA Expenses: $7.56M
- MSE rule: 75% of SGA

TAB A EXPECTED OUTPUTS:
- Gross Profit = $10.62M
- Gross Margin = 45.0%
- MSE = $5.67M
- NMC = $4.95M
- Marketing ROS = 21.0%
- Marketing ROI = 87.3%

TAB A FORMULAS:
- grossProfit = sales - cogs
- grossMargin = grossProfit / sales * 100
- mse = sga * 0.75
- nmc = grossProfit - mse
- mros = nmc / sales * 100
- mroi = nmc / mse * 100

BENCHMARKS:
- F500 Average MROS: 23.5%
- F500 Median MROS: 19.0%
- F500 Average MROI: 163.0%
- F500 Median MROI: 135.0%
- MROI floor: 100.0%

TAB B LOCKED COMPETITOR DATA:
1. Vantage Fitness:
   Sales 23.60; GP% 45.0; GP 10.62; MSE 5.67; NMC 4.95; MROS 21.0%; MROI 87.3%

2. CoreFit Studios:
   Sales 48.00; GP% 42.0; GP 20.16; MSE 10.08; NMC 10.08; MROS 21.0%; MROI 100.0%

3. Momentum Wellness:
   Sales 12.00; GP% 48.0; GP 5.76; MSE 2.40; NMC 3.36; MROS 28.0%; MROI 140.0%

4. BalancePoint Health:
   Sales 90.00; GP% 45.0; GP 40.50; MSE 14.50; NMC 26.00; MROS 28.9%; MROI 179.3%

DISPLAY RULES:
- Vantage MROI 87.3% must display in red with “BELOW 100% FLOOR — RED FLAG.”
- MROS below F500 average should show below-average warning.
- MROI below 100% must be stronger warning than merely below average.
- CoreFit at 100.0% should show “at floor,” not red failure.
- BalancePoint should be identified as highest NMC and highest MROI.
- Scatter plots must show MROS and MROI benchmark lines.
- F500 benchmarks are read-only.

NON-NEGOTIABLES:
- Do not change Vantage or competitor data.
- Do not change the 75% MSE rule.
- Do not change benchmark values.
- Do not round MROI in a way that hides 87.3%.
*/

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MSE_RULE = 0.75; // MSE = 75% of SGA

const BENCHMARKS = {
  avgMROS:   23.5,
  medMROS:   19.0,
  avgMROI:  163.0,
  medMROI:  135.0,
  floorMROI: 100.0,
};

const VANTAGE_DEFAULTS = {
  sales: 23.60,
  cogs:  12.98,
  sga:    7.56,
};

const COMPETITORS = [
  {
    name:    'Vantage Fitness',
    sales:   23.60,
    gpPct:   45.0,
    gp:      10.62,
    mse:      5.67,
    nmc:      4.95,
    mros:    21.0,
    mroi:    87.3,
  },
  {
    name:    'CoreFit Studios',
    sales:   48.00,
    gpPct:   42.0,
    gp:      20.16,
    mse:     10.08,
    nmc:     10.08,
    mros:    21.0,
    mroi:   100.0,
  },
  {
    name:    'Momentum Wellness',
    sales:   12.00,
    gpPct:   48.0,
    gp:       5.76,
    mse:      2.40,
    nmc:      3.36,
    mros:    28.0,
    mroi:   140.0,
  },
  {
    name:    'BalancePoint Health',
    sales:   90.00,
    gpPct:   45.0,
    gp:      40.50,
    mse:     14.50,
    nmc:     26.00,
    mros:    28.9,
    mroi:   179.3,
  },
];

// ─── FORMULAS ─────────────────────────────────────────────────────────────────

function calcTabA(sales, cogs, sga) {
  const grossProfit  = sales - cogs;
  const grossMargin  = grossProfit / sales * 100;
  const mse          = sga * MSE_RULE;
  const nmc          = grossProfit - mse;
  const mros         = nmc / sales * 100;
  const mroi         = nmc / mse * 100;
  return { grossProfit, grossMargin, mse, nmc, mros, mroi };
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

function fmtM(v) {
  return `$${Math.abs(v).toFixed(2)}M`;
}

function fmtPct(v, decimals = 1) {
  return `${v.toFixed(decimals)}%`;
}

// ─── TAB A — VANTAGE CALCULATOR ───────────────────────────────────────────────

const INPUT_FIELDS = [
  { id: 'sales', label: 'Sales Revenue ($M)', min: 1, max: 200, step: 0.01, default: VANTAGE_DEFAULTS.sales },
  { id: 'cogs',  label: 'COGS ($M)',          min: 0, max: 200, step: 0.01, default: VANTAGE_DEFAULTS.cogs  },
  { id: 'sga',   label: 'SG&A Expenses ($M)', min: 0, max: 100, step: 0.01, default: VANTAGE_DEFAULTS.sga   },
];

function buildTabA() {
  const container = document.getElementById('tabA');
  container.innerHTML = '';

  // Inputs
  const inputSection = el('div', { className: 'ta-inputs' });
  inputSection.appendChild(el('h2', { textContent: 'Inputs' }));

  const inputNote = el('p', { className: 'ta-note', textContent: `MSE is calculated as ${MSE_RULE * 100}% of SG&A (read-only).` });
  inputSection.appendChild(inputNote);

  const grid = el('div', { className: 'ta-input-grid' });
  INPUT_FIELDS.forEach(f => {
    const row = el('div', { className: 'ta-input-row' });
    const lbl = el('label', { 'for': `ta-${f.id}`, textContent: f.label });
    const input = el('input', {
      type:  'number',
      id:    `ta-${f.id}`,
      min:   f.min,
      max:   f.max,
      step:  f.step,
      value: f.default,
    });
    input.addEventListener('input', updateTabA);
    row.appendChild(lbl);
    row.appendChild(input);
    grid.appendChild(row);
  });
  inputSection.appendChild(grid);
  container.appendChild(inputSection);

  // Outputs
  const outputSection = el('div', { className: 'ta-outputs' });
  outputSection.appendChild(el('h2', { textContent: 'Calculated Outputs' }));

  const outFields = [
    { id: 'ta-out-gp',   label: 'Gross Profit' },
    { id: 'ta-out-gm',   label: 'Gross Margin' },
    { id: 'ta-out-mse',  label: 'MSE (75% of SG&A)' },
    { id: 'ta-out-nmc',  label: 'NMC' },
    { id: 'ta-out-mros', label: 'Marketing ROS', isBenchmark: true },
    { id: 'ta-out-mroi', label: 'Marketing ROI', isBenchmark: true },
  ];

  const outGrid = el('div', { className: 'ta-output-grid' });
  outFields.forEach(f => {
    const row = el('div', { className: 'ta-output-row', id: `row-${f.id}` });
    row.appendChild(el('span', { className: 'ta-output-label', textContent: f.label }));
    const valueWrap = el('div', { className: 'ta-output-value-wrap' });
    valueWrap.appendChild(el('span', { className: 'ta-output-value', id: f.id }));
    if (f.isBenchmark) {
      valueWrap.appendChild(el('span', { className: 'ta-output-badge', id: `badge-${f.id}` }));
    }
    row.appendChild(valueWrap);
    outGrid.appendChild(row);
  });
  outputSection.appendChild(outGrid);
  container.appendChild(outputSection);
}

function updateTabA() {
  const sales = parseFloat(document.getElementById('ta-sales').value) || 0;
  const cogs  = parseFloat(document.getElementById('ta-cogs').value)  || 0;
  const sga   = parseFloat(document.getElementById('ta-sga').value)   || 0;

  const r = calcTabA(sales, cogs, sga);

  document.getElementById('ta-out-gp').textContent   = fmtM(r.grossProfit);
  document.getElementById('ta-out-gm').textContent   = fmtPct(r.grossMargin);
  document.getElementById('ta-out-mse').textContent  = fmtM(r.mse);
  document.getElementById('ta-out-nmc').textContent  = fmtM(r.nmc);
  document.getElementById('ta-out-mros').textContent = fmtPct(r.mros);
  document.getElementById('ta-out-mroi').textContent = fmtPct(r.mroi);

  // MROS benchmark badge
  applyMROSBadge('badge-ta-out-mros', 'row-ta-out-mros', r.mros);

  // MROI benchmark badge
  applyMROIBadge('badge-ta-out-mroi', 'row-ta-out-mroi', r.mroi);
}

function applyMROSBadge(badgeId, rowId, mros) {
  const badge = document.getElementById(badgeId);
  const row   = document.getElementById(rowId);
  if (!badge || !row) return;

  if (mros >= BENCHMARKS.avgMROS) {
    badge.textContent = `Above F500 Average (${BENCHMARKS.avgMROS}%)`;
    badge.className = 'ta-output-badge badge-good';
    row.className = 'ta-output-row';
  } else if (mros >= BENCHMARKS.medMROS) {
    badge.textContent = `Below F500 Average — Above Median`;
    badge.className = 'ta-output-badge badge-warn';
    row.className = 'ta-output-row row-warn';
  } else {
    badge.textContent = `Below F500 Median (${BENCHMARKS.medMROS}%)`;
    badge.className = 'ta-output-badge badge-bad';
    row.className = 'ta-output-row row-warn';
  }
}

function applyMROIBadge(badgeId, rowId, mroi) {
  const badge = document.getElementById(badgeId);
  const row   = document.getElementById(rowId);
  if (!badge || !row) return;

  if (mroi < BENCHMARKS.floorMROI) {
    badge.textContent = `BELOW ${BENCHMARKS.floorMROI}% FLOOR — RED FLAG`;
    badge.className = 'ta-output-badge badge-redflag';
    row.className = 'ta-output-row row-redflag';
  } else if (mroi === BENCHMARKS.floorMROI) {
    badge.textContent = `At ${BENCHMARKS.floorMROI}% Floor`;
    badge.className = 'ta-output-badge badge-warn';
    row.className = 'ta-output-row row-warn';
  } else if (mroi >= BENCHMARKS.avgMROI) {
    badge.textContent = `Above F500 Average (${BENCHMARKS.avgMROI}%)`;
    badge.className = 'ta-output-badge badge-good';
    row.className = 'ta-output-row';
  } else if (mroi >= BENCHMARKS.medMROI) {
    badge.textContent = `Above F500 Median — Below Average`;
    badge.className = 'ta-output-badge badge-warn';
    row.className = 'ta-output-row row-warn';
  } else {
    badge.textContent = `Below F500 Median (${BENCHMARKS.medMROI}%)`;
    badge.className = 'ta-output-badge badge-bad';
    row.className = 'ta-output-row row-warn';
  }
}

// ─── TAB B — COMPETITOR BENCHMARKING TABLE ────────────────────────────────────

const maxNMC  = Math.max(...COMPETITORS.map(c => c.nmc));
const maxMROI = Math.max(...COMPETITORS.map(c => c.mroi));

function buildTabB() {
  const container = document.getElementById('tabB');
  container.innerHTML = '';

  container.appendChild(el('h2', { textContent: 'Competitor Benchmarking' }));
  container.appendChild(buildBenchmarkLegend());
  container.appendChild(buildCompetitorTable());
  container.appendChild(buildScatterSection());
}

function buildBenchmarkLegend() {
  const wrap = el('div', { className: 'bench-legend' });
  const items = [
    { label: `F500 Avg MROS: ${BENCHMARKS.avgMROS}%`,  cls: 'leg-avg' },
    { label: `F500 Med MROS: ${BENCHMARKS.medMROS}%`,  cls: 'leg-med' },
    { label: `F500 Avg MROI: ${BENCHMARKS.avgMROI}%`,  cls: 'leg-avg' },
    { label: `F500 Med MROI: ${BENCHMARKS.medMROI}%`,  cls: 'leg-med' },
    { label: `MROI Floor: ${BENCHMARKS.floorMROI}%`,   cls: 'leg-floor' },
  ];
  items.forEach(item => {
    const span = el('span', { className: `bench-tag ${item.cls}`, textContent: item.label });
    wrap.appendChild(span);
  });
  return wrap;
}

function buildCompetitorTable() {
  const wrap  = el('div', { className: 'comp-table-wrap' });
  const table = el('table', { className: 'comp-table' });

  const headers = ['Company', 'Sales ($M)', 'GP%', 'GP ($M)', 'MSE ($M)', 'NMC ($M)', 'MROS', 'MROI'];
  const thead   = el('thead');
  const hRow    = el('tr');
  headers.forEach(h => hRow.appendChild(el('th', { textContent: h })));
  thead.appendChild(hRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  COMPETITORS.forEach(c => {
    const isHighestNMC  = c.nmc  === maxNMC;
    const isHighestMROI = c.mroi === maxMROI;
    const isVantage     = c.name === 'Vantage Fitness';
    const isAtFloor     = c.mroi === BENCHMARKS.floorMROI;

    const tr = el('tr', { className: isVantage ? 'row-vantage' : '' });

    tr.appendChild(el('td', {
      className: 'comp-name' + (isHighestNMC || isHighestMROI ? ' comp-leader' : ''),
      textContent: c.name + (isHighestNMC && isHighestMROI ? ' ★' : isHighestNMC ? ' (Highest NMC)' : isHighestMROI ? ' (Highest MROI)' : ''),
    }));

    tr.appendChild(el('td', { textContent: fmtM(c.sales) }));
    tr.appendChild(el('td', { textContent: fmtPct(c.gpPct) }));
    tr.appendChild(el('td', { textContent: fmtM(c.gp) }));
    tr.appendChild(el('td', { textContent: fmtM(c.mse) }));

    // NMC cell
    const nmcTd = el('td', {
      className: isHighestNMC ? 'cell-leader' : '',
      textContent: fmtM(c.nmc),
    });
    tr.appendChild(nmcTd);

    // MROS cell
    const mrosCls = c.mros >= BENCHMARKS.avgMROS ? 'cell-good'
                  : c.mros >= BENCHMARKS.medMROS ? 'cell-warn' : 'cell-bad';
    tr.appendChild(el('td', { className: mrosCls, textContent: fmtPct(c.mros) }));

    // MROI cell
    let mroiCls, mroiNote;
    if (c.mroi < BENCHMARKS.floorMROI) {
      mroiCls  = 'cell-redflag';
      mroiNote = ' ⚑';
    } else if (isAtFloor) {
      mroiCls  = 'cell-atfloor';
      mroiNote = ' (at floor)';
    } else if (c.mroi === maxMROI) {
      mroiCls  = 'cell-leader';
      mroiNote = ' ★';
    } else if (c.mroi >= BENCHMARKS.avgMROI) {
      mroiCls  = 'cell-good';
      mroiNote = '';
    } else {
      mroiCls  = 'cell-warn';
      mroiNote = '';
    }
    const mroiTd = el('td', { className: mroiCls });
    mroiTd.textContent = fmtPct(c.mroi) + mroiNote;
    tr.appendChild(mroiTd);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);

  // Red-flag note
  const note = el('p', { className: 'redflag-note', textContent: '⚑ MROI below 100% floor — Vantage Fitness marketing spend is not generating sufficient return.' });
  wrap.appendChild(note);

  return wrap;
}

// ─── SCATTER PLOTS ────────────────────────────────────────────────────────────

function buildScatterSection() {
  const section = el('div', { className: 'scatter-section' });
  section.appendChild(el('h3', { textContent: 'Benchmarking Charts' }));

  const charts = el('div', { className: 'scatter-charts' });
  charts.appendChild(buildScatterPlot('mros'));
  charts.appendChild(buildScatterPlot('mroi'));
  section.appendChild(charts);
  return section;
}

function buildScatterPlot(metric) {
  const isMROI = metric === 'mroi';
  const title  = isMROI ? 'Marketing ROI (%)' : 'Marketing ROS (%)';

  const wrap   = el('div', { className: 'scatter-wrap' });
  wrap.appendChild(el('h4', { className: 'scatter-title', textContent: title }));

  const chartArea = el('div', { className: 'scatter-chart' });
  chartArea.style.maxHeight = '300px';
  chartArea.style.overflow = 'auto';

  const values = COMPETITORS.map(c => c[metric]);
  const maxVal = Math.max(...values) * 1.2;

  COMPETITORS.forEach(c => {
    const val     = c[metric];
    const pct     = (val / maxVal) * 100;
    const isVantage = c.name === 'Vantage Fitness';

    let barCls = 'scatter-bar';
    if (isMROI) {
      if (val < BENCHMARKS.floorMROI)     barCls += ' bar-redflag';
      else if (val === BENCHMARKS.floorMROI) barCls += ' bar-atfloor';
      else if (val >= BENCHMARKS.avgMROI)    barCls += ' bar-good';
      else barCls += ' bar-warn';
    } else {
      if (val >= BENCHMARKS.avgMROS)      barCls += ' bar-good';
      else if (val >= BENCHMARKS.medMROS) barCls += ' bar-warn';
      else                                barCls += ' bar-bad';
    }

    const row = el('div', { className: 'scatter-row' + (isVantage ? ' scatter-vantage' : '') });
    row.appendChild(el('span', { className: 'scatter-label', textContent: c.name }));

    const barWrap = el('div', { className: 'scatter-bar-wrap' });
    const bar = el('div', { className: barCls });
    bar.style.width = `${pct.toFixed(1)}%`;

    const valLabel = el('span', { className: 'scatter-val', textContent: fmtPct(val) });
    barWrap.appendChild(bar);
    barWrap.appendChild(valLabel);
    row.appendChild(barWrap);
    chartArea.appendChild(row);
  });

  // Benchmark reference lines
  const benchLines = isMROI
    ? [
        { val: BENCHMARKS.floorMROI, label: `Floor ${BENCHMARKS.floorMROI}%`, cls: 'bench-line-floor' },
        { val: BENCHMARKS.medMROI,   label: `Med ${BENCHMARKS.medMROI}%`,     cls: 'bench-line-med' },
        { val: BENCHMARKS.avgMROI,   label: `Avg ${BENCHMARKS.avgMROI}%`,     cls: 'bench-line-avg' },
      ]
    : [
        { val: BENCHMARKS.medMROS,   label: `Med ${BENCHMARKS.medMROS}%`,     cls: 'bench-line-med' },
        { val: BENCHMARKS.avgMROS,   label: `Avg ${BENCHMARKS.avgMROS}%`,     cls: 'bench-line-avg' },
      ];

  benchLines.forEach(b => {
    const linePct = (b.val / maxVal) * 100;
    const line = el('div', { className: `bench-line ${b.cls}` });
    line.style.left = `calc(${linePct.toFixed(1)}% + 160px)`;
    line.setAttribute('title', b.label);
    const lineLbl = el('span', { className: 'bench-line-label', textContent: b.label });
    line.appendChild(lineLbl);
    chartArea.appendChild(line);
  });

  wrap.appendChild(chartArea);
  return wrap;
}

// ─── RESET ────────────────────────────────────────────────────────────────────

function reset() {
  document.getElementById('ta-sales').value = VANTAGE_DEFAULTS.sales;
  document.getElementById('ta-cogs').value  = VANTAGE_DEFAULTS.cogs;
  document.getElementById('ta-sga').value   = VANTAGE_DEFAULTS.sga;
  updateTabA();
}

// ─── TAB SWITCHING ────────────────────────────────────────────────────────────

function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === tabId));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('appTitle').textContent = 'Marketing ROS/ROI Benchmarking Calculator';
  document.getElementById('instructions').textContent =
    'Tab A: enter Vantage Fitness financials to calculate Marketing ROS and ROI versus F500 benchmarks. ' +
    'Tab B: compare Vantage against four competitors across NMC, MROS, and MROI.';

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  buildTabA();
  updateTabA();
  buildTabB();

  document.getElementById('resetBtn').addEventListener('click', reset);

  const focusModeBtn = document.getElementById('focusModeBtn');
  if (focusModeBtn) {
    focusModeBtn.addEventListener('click', () => {
      const enabled = document.body.classList.toggle('focus-mode');
      focusModeBtn.textContent = enabled ? 'Exit Focus Mode' : 'Focus Mode';
      focusModeBtn.setAttribute('aria-pressed', String(enabled));
    });
  }

  switchTab('tabA');
});