/*
MKT 472 · Module 4 · App 1
Lifecycle Cost & Economic Value Calculator

Purpose:
This app helps students see that a higher-priced product can still create
positive customer value when lifecycle cost savings exceed the purchase-price
premium. The key instructional contrast is between purchase price and total
lifecycle cost.

Core calculations:
- Competitor LCC =
  competitor purchase price
  + competitor installation/acquisition
  + competitor usage/operating
  + competitor financing/insurance
  + competitor maintenance
  + competitor disposal

- Company LCC =
  company purchase price
  + company installation/acquisition
  + company usage/operating
  + company financing/insurance
  + company maintenance
  + company disposal

- Economic Value =
  Competitor LCC - Company LCC

- Price Premium % =
  ((Company Purchase Price - Competitor Purchase Price) / Competitor Purchase Price) * 100

- Company Non-Price Costs =
  company installation/acquisition
  + company usage/operating
  + company financing/insurance
  + company maintenance
  + company disposal

- Indifference Price =
  Competitor LCC - Company Non-Price Costs

- Headroom =
  Indifference Price - Company Purchase Price

- Customer Savings at Scale =
  Economic Value * selected quantity

Required presets:
1. Telecom Switch
   Competitor:
   - Purchase Price = 300
   - Installation / Acquisition = 200
   - Usage / Operating = 500
   - Financing / Insurance = 0
   - Maintenance = 0
   - Disposal = 0

   Company:
   - Purchase Price = 375
   - Installation / Acquisition = 100
   - Usage / Operating = 400
   - Financing / Insurance = 0
   - Maintenance = 0
   - Disposal = 0

   Expected outputs:
   - Competitor LCC = 1000
   - Company LCC = 875
   - Economic Value = 125
   - Indifference Price = 500
   - Headroom = 125

2. Indifference Zone
   Same as Telecom Switch except:
   - Company Purchase Price = 500

   Expected outputs:
   - Competitor LCC = 1000
   - Company LCC = 1000
   - Economic Value = 0
   - Indifference Price = 500
   - Headroom = 0

Display rules:
- Dollar amounts: nearest dollar with $ formatting.
- Percentages: one decimal place with sign.
- Economic Value:
  - Green state if positive.
  - Gold state if zero.
  - Red state if negative.
- If Company Purchase Price > Indifference Price, display above-ceiling warning.
- Quantity toggle must update total customer savings for 1, 10, and 100 units.

Chart:
- Stacked bar chart comparing Competitor LCC and Company LCC.
- Six stack components:
  purchase price, installation/acquisition, usage/operating,
  financing/insurance, maintenance, disposal.

Technical constraints:
- Vanilla JavaScript.
- No persistence.
- No server calls.
- No Canvas API.
- Canvas iframe-safe.
- Mobile responsive to 320px.
- ARIA labels and keyboard-accessible controls required.

Do not expose worksheet answer keys inside the app UI.
*/

/* ============================================================
   CONFIGURATION
   ============================================================ */

/** Slider definitions — order matches the stacked-bar chart series. */
const SLIDER_DEFS = [
  { key: 'purchase',     label: 'Purchase Price',        min: 100, max: 5000, step: 50  },
  { key: 'installation', label: 'Installation/Acq.',     min: 0,   max: 2000, step: 50  },
  { key: 'usage',        label: 'Usage/Operating',       min: 0,   max: 2000, step: 50  },
  { key: 'financing',    label: 'Financing/Insurance',   min: 0,   max: 1000, step: 25  },
  { key: 'maintenance',  label: 'Maintenance',           min: 0,   max: 1000, step: 25  },
  { key: 'disposal',     label: 'Disposal',              min: 0,   max: 500,  step: 25  },
];

/** Chart colors for the six cost categories. */
const CATEGORY_COLORS = [
  '#2563eb', // purchase        — blue
  '#0891b2', // installation    — cyan
  '#f97316', // usage           — orange
  '#7c3aed', // financing       — violet
  '#db2777', // maintenance     — pink
  '#64748b', // disposal        — slate
];

/** Default slider values (Telecom Switch values — used by Reset). */
const DEFAULTS = {
  competitor: { purchase: 300, installation: 200, usage: 500, financing: 0, maintenance: 0, disposal: 0 },
  company:    { purchase: 375, installation: 100, usage: 400, financing: 0, maintenance: 0, disposal: 0 },
};

/** Named presets. */
const PRESETS = {
  telecom: {
    competitor: { purchase: 300, installation: 200, usage: 500, financing: 0, maintenance: 0, disposal: 0 },
    company:    { purchase: 375, installation: 100, usage: 400, financing: 0, maintenance: 0, disposal: 0 },
  },
  indiff: {
    competitor: { purchase: 300, installation: 200, usage: 500, financing: 0, maintenance: 0, disposal: 0 },
    company:    { purchase: 500, installation: 100, usage: 400, financing: 0, maintenance: 0, disposal: 0 },
  },
};

/* ============================================================
   STATE
   ============================================================ */

/** Live mutable state — mirrors slider values + selected quantity. */
const state = {
  competitor: { ...DEFAULTS.competitor },
  company:    { ...DEFAULTS.company    },
  quantity:   1,
  activePreset: 'telecom',  // 'telecom' | 'indiff' | null
};

/* ============================================================
   CALCULATIONS
   ============================================================ */

/**
 * Run all calculations from current state.
 * Returns a plain object with every derived value the UI needs.
 */
function calculate() {
  const c  = state.competitor;
  const co = state.company;

  const compLCC = c.purchase + c.installation + c.usage + c.financing + c.maintenance + c.disposal;
  const coNonPrice = co.installation + co.usage + co.financing + co.maintenance + co.disposal;
  const companyLCC = co.purchase + coNonPrice;
  const economicValue = compLCC - companyLCC;
  const pricePremiumPct = ((co.purchase - c.purchase) / c.purchase) * 100;
  const indiffPrice = compLCC - coNonPrice;
  const headroom = indiffPrice - co.purchase;
  const savings = economicValue * state.quantity;

  return {
    compLCC,
    companyLCC,
    economicValue,
    pricePremiumPct,
    indiffPrice,
    headroom,
    savings,
    aboveCeiling: co.purchase > indiffPrice,
  };
}

/* ============================================================
   FORMATTING HELPERS
   ============================================================ */

/** Format a dollar value to nearest integer, e.g. "$1,125" */
function fmtDollar(n) {
  const rounded = Math.round(n);
  return '$' + Math.abs(rounded).toLocaleString('en-US');
}

/** Format with explicit sign prefix: "+$125" or "-$75" or "$0" */
function fmtDollarSigned(n) {
  const rounded = Math.round(n);
  if (rounded > 0) return '+$' + rounded.toLocaleString('en-US');
  if (rounded < 0) return '-$' + Math.abs(rounded).toLocaleString('en-US');
  return '$0';
}

/** Format percentage to one decimal with explicit sign: "+25.0%" */
function fmtPctSigned(n) {
  const sign = n > 0 ? '+' : n < 0 ? '' : '';
  return sign + n.toFixed(1) + '%';
}

/* ============================================================
   DOM HELPERS
   ============================================================ */

/** Get element by id — throws if missing (catches wiring mistakes). */
function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error('Missing element: ' + id);
  return node;
}

/** Set text content of an element by id. */
function setText(id, text) { el(id).textContent = text; }

/* ============================================================
   RENDER
   ============================================================ */

/**
 * Sync every piece of UI to current state + calculation results.
 * Called after any slider move, preset load, or quantity change.
 */
function render() {
  const results = calculate();

  // ── Slider output labels & ARIA ──────────────────────────
  SLIDER_DEFS.forEach(({ key }) => {
    const cSlider  = el('c-'  + key);
    const coSlider = el('co-' + key);

    // Update display labels
    el('c-'  + key + '-val').textContent = fmtDollar(+cSlider.value);
    el('co-' + key + '-val').textContent = fmtDollar(+coSlider.value);

    // Keep aria-valuenow in sync
    cSlider.setAttribute('aria-valuenow',  cSlider.value);
    coSlider.setAttribute('aria-valuenow', coSlider.value);
  });

  // ── Panel LCC totals ─────────────────────────────────────
  el('c-lcc-inline').textContent  = fmtDollar(results.compLCC);
  el('co-lcc-inline').textContent = fmtDollar(results.companyLCC);

  // ── Metric cards ─────────────────────────────────────────
  setText('out-comp-lcc',    fmtDollar(results.compLCC));
  setText('out-comp-lcc-co', fmtDollar(results.companyLCC));
  setText('out-ev',          fmtDollarSigned(results.economicValue));
  setText('out-premium',     fmtPctSigned(results.pricePremiumPct));
  setText('out-indiff',      fmtDollar(results.indiffPrice));
  setText('out-headroom',    fmtDollarSigned(results.headroom));

  // EV card color state
  const evCard = el('metric-ev');
  evCard.classList.remove('ev-positive', 'ev-zero', 'ev-negative');
  if (results.economicValue > 0)      evCard.classList.add('ev-positive');
  else if (results.economicValue < 0) evCard.classList.add('ev-negative');
  else                                evCard.classList.add('ev-zero');

  // ── EV Badge ─────────────────────────────────────────────
  const badge = el('ev-badge');
  const ev    = Math.round(results.economicValue);
  badge.classList.remove('ev-badge--positive', 'ev-badge--zero', 'ev-badge--negative');

  let badgeIcon, badgeMsg;

  if (ev > 0) {
    badge.classList.add('ev-badge--positive');
    badgeIcon = '▲';
    badgeMsg  = 'Economic value: +$' + ev.toLocaleString('en-US') +
                ' — this product creates value for the buyer.';
  } else if (ev < 0) {
    badge.classList.add('ev-badge--negative');
    badgeIcon = '▼';
    badgeMsg  = 'Economic value: -$' + Math.abs(ev).toLocaleString('en-US') +
                ' — this product destroys value for the buyer. The competitor\'s total cost is lower.';
  } else {
    badge.classList.add('ev-badge--zero');
    badgeIcon = '=';
    badgeMsg  = 'Economic value: $0 — buyer is indifferent. You are at the pricing ceiling.';
  }

  el('ev-badge').querySelector('.ev-badge__icon').textContent = badgeIcon;
  el('ev-badge-text').textContent = badgeMsg;

  // ── Above-ceiling warning ─────────────────────────────────
  const warning = el('ceiling-warning');
  warning.hidden = !results.aboveCeiling;

  // ── Savings banner ────────────────────────────────────────
  const savingsBanner = el('savings-banner');
  const qtyLabel = state.quantity === 1 ? '1 unit' : state.quantity.toLocaleString('en-US') + ' units';

  el('savings-qty-label').innerHTML = 'At <strong>' + qtyLabel + '</strong>,';
  setText('out-savings', fmtDollarSigned(results.savings));
  el('savings-formula').textContent =
    'Economic Value (' + fmtDollarSigned(results.economicValue) + ') × ' + state.quantity.toLocaleString('en-US') + (state.quantity === 1 ? ' unit' : ' units');

  // Prominent display at 100 units
  savingsBanner.classList.toggle('savings-banner--prominent', state.quantity === 100);

  // ── Chart ─────────────────────────────────────────────────
  updateChart(results);
}

/* ============================================================
   CHART
   ============================================================ */

let lccChart = null;

function buildChartData() {
  const c  = state.competitor;
  const co = state.company;

  return {
    labels: ['Competitor', 'Company'],
    datasets: SLIDER_DEFS.map((def, i) => ({
      label: def.label,
      data:  [c[def.key], co[def.key]],
      backgroundColor: CATEGORY_COLORS[i],
      borderColor:     '#ffffff',
      borderWidth:     1,
    })),
  };
}

function initChart() {
  const ctx = el('lccChart').getContext('2d');

  lccChart = new Chart(ctx, {
    type: 'bar',
    data: buildChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font:       { size: 12 },
            boxWidth:   14,
            padding:    16,
            color:      '#1a1f2e',
          },
        },
        tooltip: {
          callbacks: {
            label(ctx) {
              return ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString('en-US');
            },
            footer(items) {
              const total = items.reduce((sum, i) => sum + i.parsed.y, 0);
              return 'Total LCC: $' + Math.round(total).toLocaleString('en-US');
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid:    { display: false },
          ticks:   { font: { size: 13, weight: '700' }, color: '#1a1f2e' },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid:   { color: 'rgba(0,0,0,.07)' },
          ticks:  {
            callback: v => '$' + v.toLocaleString('en-US'),
            font:     { size: 11 },
            color:    '#5a6478',
          },
        },
      },
    },
  });
}

/** Toggle focus mode to hide support cards while keeping interactive work area visible. */
function wireFocusToggle() {
  const btn = document.getElementById('focus-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('focus-mode');
    btn.textContent = enabled ? 'Exit Focus Mode' : 'Focus Mode';
    btn.setAttribute('aria-pressed', String(enabled));
  });
}

function updateChart() {
  if (!lccChart) return;
  const c  = state.competitor;
  const co = state.company;

  lccChart.data.datasets.forEach((ds, i) => {
    const key  = SLIDER_DEFS[i].key;
    ds.data = [c[key], co[key]];
  });

  lccChart.update('none'); // skip animation for responsive feel
}

/* ============================================================
   EVENT WIRING
   ============================================================ */

/** Wire all sliders so they update state + re-render on input. */
function wireSliders() {
  SLIDER_DEFS.forEach(({ key }) => {
    // Competitor slider
    el('c-' + key).addEventListener('input', function () {
      state.competitor[key] = +this.value;
      state.activePreset = null;
      syncPresetButtons();
      render();
    });

    // Company slider
    el('co-' + key).addEventListener('input', function () {
      state.company[key] = +this.value;
      state.activePreset = null;
      syncPresetButtons();
      render();
    });
  });
}

/** Wire the three preset buttons. */
function wirePresetButtons() {
  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', function () {
      const key = this.dataset.preset;
      const preset = PRESETS[key];
      if (!preset) return;

      // Deep-copy preset values into state
      state.competitor = { ...preset.competitor };
      state.company    = { ...preset.company    };
      state.activePreset = key;

      // Sync slider DOM values
      SLIDER_DEFS.forEach(({ key: sliderKey }) => {
        el('c-'  + sliderKey).value = state.competitor[sliderKey];
        el('co-' + sliderKey).value = state.company[sliderKey];
      });

      syncPresetButtons();
      render();
    });
  });

  // Reset button
  el('btn-reset').addEventListener('click', () => {
    state.competitor   = { ...DEFAULTS.competitor };
    state.company      = { ...DEFAULTS.company    };
    state.activePreset = null;

    SLIDER_DEFS.forEach(({ key }) => {
      el('c-'  + key).value = state.competitor[key];
      el('co-' + key).value = state.company[key];
    });

    syncPresetButtons();
    render();
  });
}

/** Reflect which preset (if any) is currently active in aria-pressed. */
function syncPresetButtons() {
  document.querySelectorAll('[data-preset]').forEach(btn => {
    const isActive = btn.dataset.preset === state.activePreset;
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/** Wire the three quantity toggle buttons. */
function wireQuantityButtons() {
  document.querySelectorAll('[data-qty]').forEach(btn => {
    btn.addEventListener('click', function () {
      state.quantity = +this.dataset.qty;
      syncQuantityButtons();
      render();
    });
  });
}

/** Reflect which quantity button is active. */
function syncQuantityButtons() {
  document.querySelectorAll('[data-qty]').forEach(btn => {
    const isActive = +btn.dataset.qty === state.quantity;
    btn.setAttribute('aria-pressed', String(isActive));
    btn.classList.toggle('btn--qty-active', isActive);
  });
}

/* ============================================================
   INIT
   ============================================================ */

function init() {
  wireSliders();
  wirePresetButtons();
  wireQuantityButtons();
  wireFocusToggle();
  syncPresetButtons();
  syncQuantityButtons();
  initChart();
  render();
}

document.addEventListener('DOMContentLoaded', init);
