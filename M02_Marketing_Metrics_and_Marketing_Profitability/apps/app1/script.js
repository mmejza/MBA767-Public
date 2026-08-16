/*
M02 App 1 — NMC Strategy Simulator

Purpose:
Students manipulate six NMC levers and discover that the "Price Cut 10%" preset reduces NMC despite appearing strategically attractive.

LOCKED BASE CASE DATA:
- Market Demand: 7,000,000
- Market Share: 9.0%
- Average Selling Price: $180
- Channel Discount: 50%
- Percent Margin: 40%
- Marketing Budget: $7,000,000
- Expected Base Case NMC: $15.68M

LOCKED PRESETS:
1. Base Case:
   Demand 7,000,000; Share 9.0%; Price 180; Channel Discount 50%; Margin 40%; Budget 7,000,000; NMC $15.68M

2. Price Cut 10%:
   Demand 7,000,000; Share 9.0%; Price 162; Channel Discount 50%; Margin 33.3%; Budget 7,000,000; NMC $9.99M

3. Advertising Increase:
   Demand 7,000,000; Share 10.0%; Price 180; Channel Discount 50%; Margin 40%; Budget 9,000,000; NMC $16.20M

4. Cost Reduction:
   Demand 7,000,000; Share 9.0%; Price 180; Channel Discount 50%; Margin 50.0%; Budget 8,000,000; NMC $20.35M

CORE FORMULAS:
- channelKeep = 1 - (channelDiscount / 100)
- netSales = (marketDemand * marketShare/100 * avgPrice * channelKeep) / 1_000_000
- grossProfit = netSales * (percentMargin / 100)
- nmc = grossProfit - (marketingBudget / 1_000_000)
- delta = nmc - baselineNMC

DISPLAY RULES:
- Show NMC in $M with 2 decimals.
- Show delta vs baseline with +/- sign.
- Show net sales and gross profit in $M with 2 decimals.
- Price Cut 10% must visibly show NMC decline to $9.99M.
- If NMC is below baseline, display as negative/red warning state.
- Reset returns all inputs to Base Case.

NON-NEGOTIABLES:
- Do not alter preset values.
- Do not auto-adjust margin when price changes in custom mode.
- Do not change formulas or rounding.
*/

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const BASELINE_NMC = 15.68;

const PRESETS = {
  base: {
    label: 'Base Case',
    marketDemand: 7000000,
    marketShare: 9.0,
    avgPrice: 180,
    channelDiscount: 50,
    percentMargin: 40,
    marketingBudget: 7000000,
  },
  priceCut: {
    label: 'Price Cut 10%',
    marketDemand: 7000000,
    marketShare: 9.0,
    avgPrice: 162,
    channelDiscount: 50,
    percentMargin: 33.3,
    marketingBudget: 7000000,
  },
  advertisingIncrease: {
    label: 'Advertising Increase',
    marketDemand: 7000000,
    marketShare: 10.0,
    avgPrice: 180,
    channelDiscount: 50,
    percentMargin: 40,
    marketingBudget: 9000000,
  },
  costReduction: {
    label: 'Cost Reduction',
    marketDemand: 7000000,
    marketShare: 9.0,
    avgPrice: 180,
    channelDiscount: 50,
    percentMargin: 50.0,
    marketingBudget: 8000000,
  },
};

const INPUT_CONFIG = [
  {
    id: 'marketDemand',
    label: 'Market Demand',
    min: 1000000,
    max: 20000000,
    step: 100000,
    displayFn: v => Number(v).toLocaleString(),
    suffix: '',
  },
  {
    id: 'marketShare',
    label: 'Market Share',
    min: 0,
    max: 30,
    step: 0.1,
    displayFn: v => Number(v).toFixed(1),
    suffix: '%',
  },
  {
    id: 'avgPrice',
    label: 'Avg Selling Price',
    min: 50,
    max: 500,
    step: 1,
    displayFn: v => '$' + Number(v).toFixed(0),
    suffix: '',
  },
  {
    id: 'channelDiscount',
    label: 'Channel Discount',
    min: 0,
    max: 80,
    step: 1,
    displayFn: v => Number(v).toFixed(0),
    suffix: '%',
  },
  {
    id: 'percentMargin',
    label: 'Percent Margin',
    min: 0,
    max: 80,
    step: 0.1,
    displayFn: v => Number(v).toFixed(1),
    suffix: '%',
  },
  {
    id: 'marketingBudget',
    label: 'Marketing Budget',
    min: 0,
    max: 20000000,
    step: 100000,
    displayFn: v => '$' + Number(v).toLocaleString(),
    suffix: '',
  },
];

// ─── FORMULAS ─────────────────────────────────────────────────────────────────

function calculate(inputs) {
  const { marketDemand, marketShare, avgPrice, channelDiscount, percentMargin, marketingBudget } = inputs;
  const channelKeep  = 1 - channelDiscount / 100;
  const netSales     = (marketDemand * (marketShare / 100) * avgPrice * channelKeep) / 1_000_000;
  const grossProfit  = netSales * (percentMargin / 100);
  const nmc          = grossProfit - marketingBudget / 1_000_000;
  const delta        = nmc - BASELINE_NMC;
  return { netSales, grossProfit, nmc, delta };
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
    if (typeof child === 'string') node.appendChild(document.createTextNode(child));
    else if (child) node.appendChild(child);
  });
  return node;
}

// ─── BUILD UI ────────────────────────────────────────────────────────────────

function buildPresets() {
  const section = el('div', { className: 'presets-section' });
  const heading = el('p', { className: 'presets-label', textContent: 'Select a scenario:' });
  const btnRow  = el('div', { className: 'preset-buttons' });

  Object.entries(PRESETS).forEach(([key, preset]) => {
    const btn = el('button', { className: 'preset-btn', 'data-preset': key, textContent: preset.label });
    btn.addEventListener('click', () => applyPreset(key));
    btnRow.appendChild(btn);
  });

  section.appendChild(heading);
  section.appendChild(btnRow);
  return section;
}

function buildInputs() {
  const container = document.getElementById('inputs');
  container.innerHTML = '';

  INPUT_CONFIG.forEach(cfg => {
    const row = el('div', { className: 'input-row', id: `row-${cfg.id}` });

    const labelEl = el('label', { 'for': `slider-${cfg.id}`, textContent: cfg.label });

    const slider = el('input', {
      type: 'range',
      id: `slider-${cfg.id}`,
      'data-field': cfg.id,
      min: cfg.min,
      max: cfg.max,
      step: cfg.step,
    });

    const valueDisplay = el('span', { className: 'input-value', id: `val-${cfg.id}` });

    slider.addEventListener('input', () => {
      updateValueDisplay(cfg, slider.value);
      recalculate();
    });

    row.appendChild(labelEl);
    row.appendChild(slider);
    row.appendChild(valueDisplay);
    container.appendChild(row);
  });
}

function buildOutputs() {
  const container = document.getElementById('outputs');
  container.innerHTML = '';

  const outputFields = [
    { id: 'out-netSales',    label: 'Net Sales' },
    { id: 'out-grossProfit', label: 'Gross Profit' },
    { id: 'out-nmc',         label: 'Net Marketing Contribution (NMC)' },
    { id: 'out-delta',       label: 'vs. Base Case' },
  ];

  outputFields.forEach(field => {
    const row = el('div', { className: 'output-row', id: `row-${field.id}` });
    const labelEl = el('span', { className: 'output-label', textContent: field.label });
    const valueEl = el('span', { className: 'output-value', id: field.id });
    row.appendChild(labelEl);
    row.appendChild(valueEl);
    container.appendChild(row);
  });
}

// ─── STATE & UPDATE ───────────────────────────────────────────────────────────

function readInputs() {
  const inputs = {};
  INPUT_CONFIG.forEach(cfg => {
    inputs[cfg.id] = parseFloat(document.getElementById(`slider-${cfg.id}`).value);
  });
  return inputs;
}

function updateValueDisplay(cfg, rawValue) {
  const span = document.getElementById(`val-${cfg.id}`);
  if (span) span.textContent = cfg.displayFn(rawValue) + cfg.suffix;
}

function setSliderValues(preset) {
  INPUT_CONFIG.forEach(cfg => {
    const slider = document.getElementById(`slider-${cfg.id}`);
    if (slider) {
      slider.value = preset[cfg.id];
      updateValueDisplay(cfg, preset[cfg.id]);
    }
  });
}

function recalculate() {
  const inputs  = readInputs();
  const results = calculate(inputs);

  document.getElementById('out-netSales').textContent    = `$${results.netSales.toFixed(2)}M`;
  document.getElementById('out-grossProfit').textContent = `$${results.grossProfit.toFixed(2)}M`;

  const nmcEl   = document.getElementById('out-nmc');
  nmcEl.textContent = `$${results.nmc.toFixed(2)}M`;

  const deltaEl = document.getElementById('out-delta');
  const sign    = results.delta >= 0 ? '+' : '';
  deltaEl.textContent = `${sign}$${results.delta.toFixed(2)}M`;

  // Warning state: NMC below baseline
  const nmcRow   = document.getElementById('row-out-nmc');
  const deltaRow = document.getElementById('row-out-delta');

  if (results.nmc < BASELINE_NMC) {
    nmcEl.classList.add('warn');
    deltaEl.classList.add('warn');
    if (nmcRow)   nmcRow.classList.add('warn');
    if (deltaRow) deltaRow.classList.add('warn');
  } else {
    nmcEl.classList.remove('warn');
    deltaEl.classList.remove('warn');
    if (nmcRow)   nmcRow.classList.remove('warn');
    if (deltaRow) deltaRow.classList.remove('warn');
  }

  // Highlight active preset button (or none if custom)
  highlightActivePreset(inputs);
}

function applyPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;
  setSliderValues(preset);
  recalculate();
  setActivePresetBtn(key);
}

function setActivePresetBtn(activeKey) {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === activeKey);
  });
}

function highlightActivePreset(currentInputs) {
  let matchedKey = null;
  outer: for (const [key, preset] of Object.entries(PRESETS)) {
    for (const cfg of INPUT_CONFIG) {
      if (parseFloat(preset[cfg.id]) !== parseFloat(currentInputs[cfg.id])) {
        continue outer;
      }
    }
    matchedKey = key;
    break;
  }
  setActivePresetBtn(matchedKey);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('appTitle').textContent = 'NMC Strategy Simulator';
  document.getElementById('instructions').textContent =
    'Adjust the six levers below or choose a preset scenario. ' +
    'Observe how each change affects Net Marketing Contribution relative to the Base Case.';

  // Inject preset buttons before inputs
  const presetsSection = buildPresets();
  const appContainer   = document.getElementById('appContainer');
  appContainer.insertBefore(presetsSection, document.getElementById('inputs'));

  buildInputs();
  buildOutputs();

  document.getElementById('resetBtn').addEventListener('click', () => applyPreset('base'));

  const focusModeBtn = document.getElementById('focusModeBtn');
  if (focusModeBtn) {
    focusModeBtn.addEventListener('click', () => {
      const enabled = document.body.classList.toggle('focus-mode');
      focusModeBtn.textContent = enabled ? 'Exit Focus Mode' : 'Focus Mode';
      focusModeBtn.setAttribute('aria-pressed', String(enabled));
    });
  }

  applyPreset('base');
});