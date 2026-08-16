/*
M03 App 1 — Market Potential Estimator (CORRECTED)

Purpose:
Students learn that market share depends on market definition and that market potential is calculated from consuming units → annual units → dollars. App also produces MDI (when valid) and share-point value.

-----------------------------------------
NARROW PRESET — U.S. SOFT DRINKS (SLIDE 14)
-----------------------------------------

LOCKED INPUTS:
- maxConsumingUnits = 300        // millions of people
- buyingCeilingPct = 80
- annualPurchaseRate = 365       // units per year
- quantityPerPurchase = 1
- avgPrice = 1.00               // dollars per unit
- currentDemandDollars = 30_000_000_000  // $30B (Ch3 p.83)

CALCULATIONS:
- marketPotentialUnits = 300 * 0.80 * 365 * 1 = 87,600M units
- marketPotentialDollars = 87,600M * $1 = $87.6B
- MDI = (30B / 87.6B) * 100 = 34.2
- sharePointValue = 1% of $30B = $300M

-----------------------------------------
BROAD PRESET — WORLDWIDE NONALCOHOLIC BEVERAGES
-----------------------------------------

LOCKED VALUES:
- currentDemandDollars = 720_000_000_000  // $720B (Ch3 p.83)

RULES:
- Formula inputs (units, ceiling, rate, etc.) are DISABLED
- Market potential is NOT calculated (no valid source inputs)
- MDI is NOT shown → display "—"
- Share-point value = 1% of $720B = $7.2B

-----------------------------------------
CUSTOM PRESET
-----------------------------------------

USER CAN SET:
- maxConsumingUnits
- buyingCeilingPct
- annualPurchaseRate
- quantityPerPurchase
- avgPrice
- optional currentDemandDollars

CALCULATIONS:
- marketPotentialUnits = M * ceiling * rate * qty
- marketPotentialDollars = units * price
- MDI = (currentDemand / marketPotentialDollars) * 100 (only if demand entered)

NOTE:
Slide 13 PC example (MDI = 72.2) is ONLY reachable via custom inputs.
Do NOT hardcode or reference it in Narrow/Broad presets.

-----------------------------------------
DISPLAY RULES
-----------------------------------------

- Market potential units shown in millions (M) or billions (B)
- Market potential dollars formatted as $X.XB or $X,XXXM
- MDI:
  • Show numeric value only when valid
  • Show "—" when not available (Broad preset)
  • Include label: "Record this MDI for App 3"
- Share-point value must be visually prominent
- Switching Narrow → Broad must animate/pulse share-point display
- Include 3-year projection table with growth slider (0–30%)
- Footer: "Record your MDI — you will need it in App 3"

-----------------------------------------
WORKSHEET-ALIGNED VALUES
-----------------------------------------

Narrow:
- Market potential = 87,600M units
- Market potential = $87.6B
- MDI = 34.2
- Share-point = $300M

Broad:
- MDI = "—"
- Share-point = $7.2B

-----------------------------------------
NON-NEGOTIABLES
-----------------------------------------

- Do NOT use 240M or 325M demand values (these were incorrect)
- Do NOT compute MDI for Broad preset
- Do NOT mix PC example (72.2 MDI) into beverage presets
- Do NOT change formulas
- Do NOT auto-store MDI for App 3
- Do NOT add external libraries

-----------------------------------------
*/

const BROAD_CURRENT_DEMAND_DOLLARS = 720_000_000_000;

const PRESETS = {
  narrow: {
    label: "Narrow Definition - U.S. Soft Drinks",
    maxConsumingUnits: 300,
    buyingCeilingPct: 80,
    annualPurchaseRate: 365,
    quantityPerPurchase: 1,
    avgPrice: 1.0,
    currentDemandDollars: 30_000_000_000,
  },
  broad: {
    label: "Broad Definition - Worldwide Nonalcoholic Beverages",
    currentDemandDollars: BROAD_CURRENT_DEMAND_DOLLARS,
  },
  custom: {
    label: "Custom Inputs",
    maxConsumingUnits: 300,
    buyingCeilingPct: 80,
    annualPurchaseRate: 365,
    quantityPerPurchase: 1,
    avgPrice: 1.0,
    currentDemandDollars: 30_000_000_000,
  },
};

const FORMULA_INPUT_IDS = [
  "maxConsumingUnits",
  "buyingCeilingPct",
  "annualPurchaseRate",
  "quantityPerPurchase",
  "avgPrice",
  "currentDemandDollars",
];

const state = {
  activePreset: "narrow",
  previousPreset: "narrow",
};

function calculateFromInputs(values, growthRatePct) {
  const marketPotentialUnits =
    values.maxConsumingUnits *
    (values.buyingCeilingPct / 100) *
    values.annualPurchaseRate *
    values.quantityPerPurchase;

  const marketPotentialDollars = marketPotentialUnits * values.avgPrice * 1_000_000;
  const mdi = values.currentDemandDollars
    ? (values.currentDemandDollars / marketPotentialDollars) * 100
    : null;
  const sharePointValue = values.currentDemandDollars * 0.01;

  return {
    marketPotentialUnits,
    marketPotentialDollars,
    mdi,
    sharePointValue,
    projectionY1: projectionYear(values.currentDemandDollars, growthRatePct, 1),
    projectionY2: projectionYear(values.currentDemandDollars, growthRatePct, 2),
    projectionY3: projectionYear(values.currentDemandDollars, growthRatePct, 3),
  };
}

function projectionYear(currentDemandDollars, growthRatePct, n) {
  return currentDemandDollars * Math.pow(1 + growthRatePct / 100, n);
}

function formatUnits(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}B units`;
  }
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}M units`;
}

function formatCurrency(value) {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  return `$${(value / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}M`;
}

function parseNumericInput(id) {
  const input = document.getElementById(id);
  if (!input || input.value.trim() === "") {
    return null;
  }
  return parseFloat(input.value);
}

function readInputs() {
  return {
    maxConsumingUnits: parseNumericInput("maxConsumingUnits") || 0,
    buyingCeilingPct: parseNumericInput("buyingCeilingPct") || 0,
    annualPurchaseRate: parseNumericInput("annualPurchaseRate") || 0,
    quantityPerPurchase: parseNumericInput("quantityPerPurchase") || 0,
    avgPrice: parseNumericInput("avgPrice") || 0,
    currentDemandDollars: parseNumericInput("currentDemandDollars") || 0,
    currentDemandBlank: (document.getElementById("currentDemandDollars").value || "").trim() === "",
  };
}

function setInputDisabledState(disabled) {
  FORMULA_INPUT_IDS.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.disabled = disabled;
      input.classList.toggle("is-disabled", disabled);
    }
  });
}

function applyPreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) {
    return;
  }

  state.previousPreset = state.activePreset;
  state.activePreset = presetKey;

  if (presetKey === "broad") {
    setInputDisabledState(true);
    document.getElementById("growthRate").disabled = true;

    document.getElementById("maxConsumingUnits").value = "";
    document.getElementById("buyingCeilingPct").value = "";
    document.getElementById("annualPurchaseRate").value = "";
    document.getElementById("quantityPerPurchase").value = "";
    document.getElementById("avgPrice").value = "";
    document.getElementById("currentDemandDollars").value = BROAD_CURRENT_DEMAND_DOLLARS;
  } else {
    setInputDisabledState(false);
    document.getElementById("growthRate").disabled = false;

    FORMULA_INPUT_IDS.forEach((id) => {
      const input = document.getElementById(id);
      if (input && Object.prototype.hasOwnProperty.call(preset, id)) {
        input.value = preset[id];
      }
    });
  }

  document.getElementById("growthRate").value = 0;
  document.getElementById("growthRateValue").textContent = "0%";

  updatePresetButtons();
  updatePresetInfo();
  updateOutputs();
  animateSharePointOnPresetSwitch();
}

function updatePresetButtons() {
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.preset === state.activePreset);
  });
}

function updatePresetInfo() {
  const presetInfo = document.getElementById("presetInfo");
  if (!presetInfo) {
    return;
  }
  const suffix = state.activePreset === "narrow" ? " (default)" : "";
  presetInfo.textContent = `${PRESETS[state.activePreset].label}${suffix}`;
}

function animateSharePointOnPresetSwitch() {
  if (state.previousPreset !== "narrow" || state.activePreset !== "broad") {
    return;
  }

  const callout = document.getElementById("sharePointCallout");
  if (!callout) {
    return;
  }

  callout.classList.remove("pulse");
  void callout.offsetWidth;
  callout.classList.add("pulse");
}

function renderBroadOutputs() {
  document.getElementById("potentialUnitsPrimary").textContent = "—";
  document.getElementById("potentialDollarsPrimary").textContent = "—";
  document.getElementById("potentialUnitsSub").textContent = "Market potential not calculated in Broad preset";
  document.getElementById("potentialDollarsSub").textContent = "Source formula inputs are intentionally disabled";

  document.getElementById("mdiValue").textContent = "—";
  document.getElementById("sharePointValue").textContent = formatCurrency(BROAD_CURRENT_DEMAND_DOLLARS * 0.01);

  document.getElementById("projectionY1").textContent = "—";
  document.getElementById("projectionY2").textContent = "—";
  document.getElementById("projectionY3").textContent = "—";
}

function updateOutputs() {
  if (state.activePreset === "broad") {
    renderBroadOutputs();
    return;
  }

  const values = readInputs();
  const growthRate = parseFloat(document.getElementById("growthRate").value) || 0;
  const result = calculateFromInputs(values, growthRate);

  document.getElementById("potentialUnitsPrimary").textContent = formatUnits(result.marketPotentialUnits);
  document.getElementById("potentialDollarsPrimary").textContent = formatCurrency(result.marketPotentialDollars);

  document.getElementById("potentialUnitsSub").textContent = formatUnits(result.marketPotentialUnits);
  document.getElementById("potentialDollarsSub").textContent = formatCurrency(result.marketPotentialDollars);

  const mdiValue = document.getElementById("mdiValue");
  mdiValue.textContent = values.currentDemandBlank ? "—" : result.mdi.toFixed(1);

  const sharePointValueEl = document.getElementById("sharePointValue");
  sharePointValueEl.textContent = values.currentDemandBlank ? "—" : formatCurrency(result.sharePointValue);

  document.getElementById("projectionY1").textContent = values.currentDemandBlank ? "—" : formatCurrency(result.projectionY1);
  document.getElementById("projectionY2").textContent = values.currentDemandBlank ? "—" : formatCurrency(result.projectionY2);
  document.getElementById("projectionY3").textContent = values.currentDemandBlank ? "—" : formatCurrency(result.projectionY3);
}

function resetToDefault() {
  state.previousPreset = state.activePreset;
  applyPreset("narrow");
}

function bindEvents() {
  document.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyPreset(btn.dataset.preset);
    });
  });

  FORMULA_INPUT_IDS.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", updateOutputs);
    }
  });

  const growthInput = document.getElementById("growthRate");
  growthInput.addEventListener("input", () => {
    document.getElementById("growthRateValue").textContent = `${growthInput.value}%`;
    updateOutputs();
  });

  document.getElementById("resetBtn").addEventListener("click", resetToDefault);

  const focusModeBtn = document.getElementById("focusModeBtn");
  if (focusModeBtn) {
    focusModeBtn.addEventListener("click", () => {
      const enabled = document.body.classList.toggle("focus-mode");
      focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
      focusModeBtn.setAttribute("aria-pressed", String(enabled));
    });
  }
}

function init() {
  bindEvents();
  applyPreset("narrow");
}

document.addEventListener("DOMContentLoaded", init);