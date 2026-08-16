/*
M08 APP 1 — VALUE-IN-USE / ECONOMIC VALUE CALCULATOR
SOURCE OF TRUTH FOR COPILOT BUILD

Build App 1 only. This app helps students compare purchase price vs. total cost of ownership and determine whether a higher firm price is economically justified.

TECHNICAL REQUIREMENTS
- Vanilla HTML/CSS/JS preferred.
- Single-page app, client-side only.
- No backend, no persistence, no login, no external API calls.
- Designed for Canvas iframe desktop use.
- All outputs update in real time on input changes.
- Include preset buttons and Reset.
- Reset returns to Base Case defaults.
- Format dollars with $ and 2 decimals.
- Format percentages with 1 decimal.
- Use accessible labels and verdict text; do not rely only on color.

LAYOUT
Three-column layout:
1. Left column: input panel, preset buttons, reset.
2. Center column: ownership cost comparison table and summary metrics.
3. Right column: total cost of ownership chart.

DEFAULT / BASE CASE INPUTS
Competitor Purchase Price = 2.00
Firm Purchase Price = 2.20
Shipping Cost — Competitor = 0.07
Shipping Cost — Firm = 0.05
Handling Cost — Competitor = 0.10
Handling Cost — Firm = 0.13
Inventory Cost — Competitor = 0.05
Inventory Cost — Firm = 0.01
Usage Cost — Competitor = 3.50
Usage Cost — Firm = 2.80
Quality Control Cost — Competitor = 0.03
Quality Control Cost — Firm = 0.01
Waste/Disposal Cost — Competitor = 0.10
Waste/Disposal Cost — Firm = 0.02
Product Life = 5 years
Discount Rate = 15%
Annual Usage Volume = 10000 units

CORE CALCULATIONS
Price Premium = Firm Purchase Price - Competitor Purchase Price

Competitor Annual Ownership Cost =
competitor purchase price + competitor shipping + competitor handling +
competitor inventory + competitor usage + competitor quality control +
competitor waste/disposal

Firm Annual Ownership Cost =
firm purchase price + firm shipping + firm handling +
firm inventory + firm usage + firm quality control +
firm waste/disposal

Annual Ownership Savings per Unit =
Competitor Annual Ownership Cost - Firm Annual Ownership Cost

PV Annuity Factor =
[1 - (1 + r)^(-n)] / r
where r = discount rate as decimal and n = product life in years

NPV of Savings =
Annual Ownership Savings per Unit * PV Annuity Factor

Maximum Justified Price Premium =
NPV of Savings

Net Economic Value to Customer =
NPV of Savings - Price Premium

Annual Savings at Volume =
Annual Ownership Savings per Unit * Annual Usage Volume

VERDICT LOGIC
If Price Premium <= NPV of Savings:
  verdict = JUSTIFIED
  badge = green
Else:
  verdict = NOT JUSTIFIED
  badge = red
  message = "Price premium exceeds economic value."

OUTPUT TABLE
Rows:
- Purchase Price
- Shipping
- Handling
- Inventory
- Usage
- Quality Control
- Waste/Disposal
- TOTAL per unit/year

Columns:
- Competitor
- Firm
- Savings, where positive means firm advantage

SUMMARY METRICS
Display:
- Price Premium
- Annual Ownership Savings per Unit
- PV Annuity Factor
- NPV of Savings
- Maximum Justified Price Premium
- Net Economic Value to Customer
- Annual Savings at Volume
- EV Price Premium Verdict

PRESETS
1. Base Case
Use default values above.
Expected pedagogical result:
- Firm has higher purchase price but lower total ownership cost.
- Annual ownership savings should display about $0.75/unit.
- Price premium is justified.

2. Medical Devices
Competitor Price = 50000
Firm Price = 60000
Life = 5
Discount Rate = 20%
Set annual ownership savings so NPV savings is approximately $10930.
Premium = $10000
Verdict = JUSTIFIED
Maximum justified premium ≈ $10930

3. Unjustified Premium
Construct scenario where firm price premium = $5000
NPV of ownership savings = about $3200
Verdict = NOT JUSTIFIED

4. Reset
Return to Base Case.

CHART REQUIREMENT
Create a horizontal stacked bar chart comparing Competitor vs Firm total ownership cost.
Segments:
- Purchase Price
- Shipping
- Handling
- Inventory
- Usage
- Quality Control
- Waste/Disposal

Chart title:
"Total Cost of Ownership Comparison"

Include labels/tooltips if using Chart.js. If not using a chart library, create a clear accessible visual using CSS bars.

ACCEPTANCE TESTS
- Base Case: firm price $2.20 vs competitor $2.00; firm should still save customer about $0.75/unit.
- Medical Devices: NPV ≈ $10930; premium $10000; verdict JUSTIFIED.
- Unjustified Premium: premium exceeds NPV; verdict NOT JUSTIFIED.
- No Vantara case numbers may appear in presets.
*/

(function initEconomicValueCalculator() {
  const COST_ROWS = [
    { key: "purchase", label: "Purchase Price" },
    { key: "shipping", label: "Shipping" },
    { key: "handling", label: "Handling" },
    { key: "inventory", label: "Inventory" },
    { key: "usage", label: "Usage" },
    { key: "quality", label: "Quality Control" },
    { key: "waste", label: "Waste/Disposal" }
  ];

  const BASE_CASE = {
    comp: {
      purchase: 2.0,
      shipping: 0.07,
      handling: 0.1,
      inventory: 0.05,
      usage: 3.5,
      quality: 0.03,
      waste: 0.1
    },
    firm: {
      purchase: 2.2,
      shipping: 0.05,
      handling: 0.13,
      inventory: 0.01,
      usage: 2.8,
      quality: 0.01,
      waste: 0.02
    },
    life: 5,
    discountPct: 15,
    volume: 10000
  };

  const PRESETS = {
    base: BASE_CASE,
    medical: {
      comp: {
        purchase: 50000,
        shipping: 500,
        handling: 1500,
        inventory: 2000,
        usage: 12000,
        quality: 300,
        waste: 400
      },
      firm: {
        purchase: 60000,
        shipping: 200,
        handling: 300,
        inventory: 200,
        usage: 2000,
        quality: 200,
        waste: 145
      },
      life: 5,
      discountPct: 20,
      volume: 1000
    },
    unjustified: {
      comp: {
        purchase: 20000,
        shipping: 600,
        handling: 1200,
        inventory: 1600,
        usage: 5000,
        quality: 800,
        waste: 800
      },
      firm: {
        purchase: 25000,
        shipping: 450,
        handling: 700,
        inventory: 700,
        usage: 1200,
        quality: 600,
        waste: 506
      },
      life: 5,
      discountPct: 10,
      volume: 600
    }
  };

  const SEGMENT_COLORS = {
    purchase: "#0d9b87",
    shipping: "#1ba891",
    handling: "#2db3a0",
    inventory: "#49bdb0",
    usage: "#6dc7bf",
    quality: "#8bd0cc",
    waste: "#a9dad9"
  };

  const els = {
    focusModeBtn: document.querySelector("#focusModeBtn"),
    formMessage: document.querySelector("#form-message"),
    tableBody: document.querySelector("#cost-table-body"),
    metricsList: document.querySelector("#metrics-list"),
    verdictBadge: document.querySelector("#verdict-badge"),
    verdictText: document.querySelector("#verdict-text"),
    chart: document.querySelector("#tco-chart"),
    legend: document.querySelector("#chart-legend"),
    presetButtons: document.querySelectorAll("button[data-preset]"),
    resetBtn: document.querySelector("#reset-btn"),
    inputs: {
      comp: {
        purchase: document.querySelector("#comp-price"),
        shipping: document.querySelector("#comp-shipping"),
        handling: document.querySelector("#comp-handling"),
        inventory: document.querySelector("#comp-inventory"),
        usage: document.querySelector("#comp-usage"),
        quality: document.querySelector("#comp-qc"),
        waste: document.querySelector("#comp-waste")
      },
      firm: {
        purchase: document.querySelector("#firm-price"),
        shipping: document.querySelector("#firm-shipping"),
        handling: document.querySelector("#firm-handling"),
        inventory: document.querySelector("#firm-inventory"),
        usage: document.querySelector("#firm-usage"),
        quality: document.querySelector("#firm-qc"),
        waste: document.querySelector("#firm-waste")
      },
      life: document.querySelector("#product-life"),
      discountPct: document.querySelector("#discount-rate"),
      volume: document.querySelector("#annual-volume")
    }
  };

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function money(value) {
    return "$" + value.toFixed(2);
  }

  function pct1(value) {
    return value.toFixed(1) + "%";
  }

  function loadPreset(key) {
    const preset = PRESETS[key];
    if (!preset) {
      return;
    }

    COST_ROWS.forEach(function each(row) {
      els.inputs.comp[row.key].value = String(preset.comp[row.key]);
      els.inputs.firm[row.key].value = String(preset.firm[row.key]);
    });
    els.inputs.life.value = String(preset.life);
    els.inputs.discountPct.value = String(preset.discountPct);
    els.inputs.volume.value = String(preset.volume);

    renderAll();

    if (key === "base") {
      els.formMessage.textContent = "Base Case loaded.";
    } else if (key === "medical") {
      els.formMessage.textContent = "Medical Devices preset loaded (target: NPV about $10930, premium justified).";
    } else if (key === "unjustified") {
      els.formMessage.textContent = "Unjustified Premium preset loaded (premium should exceed NPV).";
    }
  }

  function readInputState() {
    const state = {
      comp: {},
      firm: {},
      life: Math.max(1, toNumber(els.inputs.life.value)),
      discountPct: Math.max(0, toNumber(els.inputs.discountPct.value)),
      volume: Math.max(0, toNumber(els.inputs.volume.value))
    };

    COST_ROWS.forEach(function each(row) {
      state.comp[row.key] = Math.max(0, toNumber(els.inputs.comp[row.key].value));
      state.firm[row.key] = Math.max(0, toNumber(els.inputs.firm[row.key].value));
    });

    return state;
  }

  function computeValues(state) {
    const compTotal = COST_ROWS.reduce(function sum(total, row) {
      return total + state.comp[row.key];
    }, 0);
    const firmTotal = COST_ROWS.reduce(function sum(total, row) {
      return total + state.firm[row.key];
    }, 0);

    const pricePremium = state.firm.purchase - state.comp.purchase;
    const annualSavingsPerUnit = compTotal - firmTotal;
    const r = state.discountPct / 100;
    const n = state.life;
    const pvFactor = r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r;
    const npvSavings = annualSavingsPerUnit * pvFactor;
    const maxJustifiedPremium = npvSavings;
    const netEconomicValue = npvSavings - pricePremium;
    const annualSavingsAtVolume = annualSavingsPerUnit * state.volume;
    const justified = pricePremium <= npvSavings;

    return {
      compTotal,
      firmTotal,
      pricePremium,
      annualSavingsPerUnit,
      pvFactor,
      npvSavings,
      maxJustifiedPremium,
      netEconomicValue,
      annualSavingsAtVolume,
      justified
    };
  }

  function renderTable(state, calc) {
    els.tableBody.innerHTML = "";
    COST_ROWS.forEach(function each(row) {
      const savings = state.comp[row.key] - state.firm[row.key];
      const tr = document.createElement("tr");
      tr.innerHTML = [
        "<td>" + row.label + "</td>",
        "<td>" + money(state.comp[row.key]) + "</td>",
        "<td>" + money(state.firm[row.key]) + "</td>",
        "<td>" + money(savings) + "</td>"
      ].join("");
      els.tableBody.appendChild(tr);
    });

    const totalRow = document.createElement("tr");
    totalRow.innerHTML = [
      "<td><strong>TOTAL per unit/year</strong></td>",
      "<td><strong>" + money(calc.compTotal) + "</strong></td>",
      "<td><strong>" + money(calc.firmTotal) + "</strong></td>",
      "<td><strong>" + money(calc.annualSavingsPerUnit) + "</strong></td>"
    ].join("");
    els.tableBody.appendChild(totalRow);
  }

  function renderMetrics(calc) {
    const rows = [
      ["Price Premium", money(calc.pricePremium)],
      ["Annual Ownership Savings per Unit", money(calc.annualSavingsPerUnit)],
      ["PV Annuity Factor", calc.pvFactor.toFixed(4)],
      ["NPV of Savings", money(calc.npvSavings)],
      ["Maximum Justified Price Premium", money(calc.maxJustifiedPremium)],
      ["Net Economic Value to Customer", money(calc.netEconomicValue)],
      ["Annual Savings at Volume", money(calc.annualSavingsAtVolume)]
    ];

    els.metricsList.innerHTML = "";
    rows.forEach(function each(row) {
      const dt = document.createElement("dt");
      dt.textContent = row[0];
      const dd = document.createElement("dd");
      dd.textContent = row[1];
      els.metricsList.appendChild(dt);
      els.metricsList.appendChild(dd);
    });
  }

  function renderVerdict(calc) {
    if (calc.justified) {
      els.verdictBadge.textContent = "JUSTIFIED";
      els.verdictBadge.className = "badge good";
      els.verdictText.textContent = "Price premium is within the economic value created for the customer.";
    } else {
      els.verdictBadge.textContent = "NOT JUSTIFIED";
      els.verdictBadge.className = "badge bad";
      els.verdictText.textContent = "Price premium exceeds economic value.";
    }
  }

  function renderChart(state, calc) {
    els.chart.innerHTML = "";
    const maxTotal = Math.max(calc.compTotal, calc.firmTotal, 0.000001);

    [
      { label: "Competitor Total", values: state.comp },
      { label: "Firm Total", values: state.firm }
    ].forEach(function each(rowDef) {
      const row = document.createElement("div");
      row.className = "stack-row";
      const label = document.createElement("div");
      label.className = "stack-label";
      const total = COST_ROWS.reduce(function sum(t, item) {
        return t + rowDef.values[item.key];
      }, 0);
      label.textContent = rowDef.label + " - " + money(total);

      const track = document.createElement("div");
      track.className = "stack-track";

      COST_ROWS.forEach(function eachSegment(segment) {
        const seg = document.createElement("span");
        seg.className = "seg";
        const widthPct = (rowDef.values[segment.key] / maxTotal) * 100;
        seg.style.width = widthPct + "%";
        seg.style.background = SEGMENT_COLORS[segment.key];
        seg.title = segment.label + ": " + money(rowDef.values[segment.key]);
        track.appendChild(seg);
      });

      row.appendChild(label);
      row.appendChild(track);
      els.chart.appendChild(row);
    });

    if (!els.legend.childNodes.length) {
      els.legend.innerHTML = "";
      COST_ROWS.forEach(function each(segment) {
        const li = document.createElement("div");
        li.className = "legend-item";
        li.innerHTML =
          '<span class="swatch" style="background:' + SEGMENT_COLORS[segment.key] + '"></span>' +
          '<span>' + segment.label + "</span>";
        els.legend.appendChild(li);
      });
    }
  }

  function renderAll() {
    try {
      const state = readInputState();
      const calc = computeValues(state);
      renderTable(state, calc);
      renderMetrics(calc);
      renderVerdict(calc);
      renderChart(state, calc);
    } catch (_error) {
      els.formMessage.textContent = "A calculation issue occurred. Please review input values.";
    }
  }

  function wireInputs() {
    const allInputs = [];
    COST_ROWS.forEach(function each(row) {
      allInputs.push(els.inputs.comp[row.key], els.inputs.firm[row.key]);
    });
    allInputs.push(els.inputs.life, els.inputs.discountPct, els.inputs.volume);

    allInputs.forEach(function each(input) {
      input.addEventListener("input", renderAll);
      input.addEventListener("change", renderAll);
    });

    els.presetButtons.forEach(function each(btn) {
      btn.addEventListener("click", function onClick() {
        loadPreset(btn.dataset.preset);
      });
    });

    els.resetBtn.addEventListener("click", function onReset() {
      loadPreset("base");
      els.formMessage.textContent = "Reset to Base Case defaults.";
    });

    if (els.focusModeBtn) {
      els.focusModeBtn.addEventListener("click", function onFocusToggle() {
        const enabled = document.body.classList.toggle("focus-mode");
        els.focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
        els.focusModeBtn.setAttribute("aria-pressed", String(enabled));
      });
    }
  }

  wireInputs();
  loadPreset("base");
})();