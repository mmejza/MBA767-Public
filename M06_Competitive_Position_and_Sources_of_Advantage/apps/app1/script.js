/*
M06 APP 1 SOURCE OF TRUTH — COMPETITIVE ADVANTAGE PROFILER

Build this app exactly from the M06 App Specifications document.

CORE PURPOSE:
Students determine which source of competitive advantage is genuinely available based on measurable cost, differentiation, and marketing metrics.

FORMULAS:
- VCAI = Firm COGS% / Competitor Avg COGS% * 100
- RMS = Firm Share / (Competitor 1 Share + Competitor 2 Share + Competitor 3 Share) * 100
- DI direct entry = user-entered DI
- DI benefit mode:
  - If Firm Rating - Competitor Rating >= +2.0: add full importance weight
  - If Firm Rating - Competitor Rating <= -2.0: subtract full importance weight
  - If difference is between -2.0 and +2.0: add 0

CLASSIFICATION RULES:
- VCAI < 100 = COST ADVANTAGE
- VCAI 95–105 = PARITY
- VCAI > 105 = COST DISADVANTAGE
NOTE: Exact 100 is PARITY.

- DI > 20 = DIFFERENTIATION ADVANTAGE
- DI 0–20 = PARITY
- DI < 0 = DIFFERENTIATION DISADVANTAGE
NOTE: DI = 0 is PARITY, not advantage.

- RMS >= 100 = MARKET DOMINANT
- RMS 50–99 = COMPETITIVE
- RMS < 50 = FOLLOWER

CRITICAL PROFIT LOGIC:
- If all three sources are parity / no genuine advantage, display:
  "No Clear Advantage — Vulnerable"
- Do NOT display "Moderate Profit Potential" when no source clears an advantage threshold.
- A single genuine advantage in cost, differentiation, or market dominance produces:
  "Strong Profit Potential"

REQUIRED PRESET VALIDATION:
- Vantage Industrial preset must use:
  Firm COGS = 52
  Competitor Avg COGS = 58
  DI = 0
  Firm Share = 18
  Competitor 1 Share = 24
  Competitor 2 Share = 19
  Competitor 3 Share = 14
- It must output:
  VCAI = 89.7
  DI = 0.0
  RMS = 31.6
  Cost Advantage, Differentiation Parity, Follower

SENSITIVITY PANEL:
- Scenario A: Firm COGS - 5 points
- Scenario B: DI + 20 points
- Scenario C: RMS fixed to 70
- Show before/after values, statuses, and profit implication change.

GLOBAL:
- All numeric outputs display to 1 decimal place.
- All outputs update live on input change.
- All calculations are client-side only.
- No external API calls.
- If app behavior conflicts with the spec, the spec wins.
*/

(function initCompetitiveAdvantageProfiler() {
  const PRESETS = {
    "strong-differentiator": {
      mode: "direct",
      firmCogs: 55,
      compCogs: 55,
      directDi: 46,
      benefits: [
        { name: "Reliability", weight: 35, firm: 8, comp: 6 },
        { name: "Service", weight: 35, firm: 9, comp: 6.5 },
        { name: "Innovation", weight: 30, firm: 8.5, comp: 6 }
      ],
      firmShare: 21,
      comp1Share: 18,
      comp2Share: 17,
      comp3Share: 16
    },
    "cost-leader": {
      mode: "direct",
      firmCogs: 45,
      compCogs: 55,
      directDi: 5,
      benefits: [
        { name: "Reliability", weight: 35, firm: 6.5, comp: 6.5 },
        { name: "Service", weight: 35, firm: 6, comp: 6.2 },
        { name: "Innovation", weight: 30, firm: 6, comp: 6 }
      ],
      firmShare: 19,
      comp1Share: 18,
      comp2Share: 17,
      comp3Share: 16
    },
    "market-dominant": {
      mode: "direct",
      firmCogs: 54,
      compCogs: 54,
      directDi: 9,
      benefits: [
        { name: "Reliability", weight: 34, firm: 7, comp: 6.8 },
        { name: "Service", weight: 33, firm: 7, comp: 6.7 },
        { name: "Innovation", weight: 33, firm: 7.2, comp: 6.9 }
      ],
      firmShare: 35,
      comp1Share: 12,
      comp2Share: 11,
      comp3Share: 10
    },
    "no-advantage": {
      mode: "direct",
      firmCogs: 52,
      compCogs: 52,
      directDi: 0,
      benefits: [
        { name: "Reliability", weight: 34, firm: 7, comp: 7 },
        { name: "Service", weight: 33, firm: 7, comp: 7 },
        { name: "Innovation", weight: 33, firm: 7, comp: 7 }
      ],
      firmShare: 19,
      comp1Share: 13,
      comp2Share: 13,
      comp3Share: 12
    },
    "vantage-industrial": {
      mode: "direct",
      firmCogs: 52,
      compCogs: 58,
      directDi: 0,
      benefits: [
        { name: "Reliability", weight: 34, firm: 7, comp: 7 },
        { name: "Service", weight: 33, firm: 7, comp: 7 },
        { name: "Innovation", weight: 33, firm: 7, comp: 7 }
      ],
      firmShare: 18,
      comp1Share: 24,
      comp2Share: 19,
      comp3Share: 14
    }
  };

  const els = {
    focusModeBtn: document.querySelector("#focusModeBtn"),
    presetSelect: document.querySelector("#preset-select"),
    diMode: document.querySelectorAll("input[name='di-mode']"),
    directDiWrap: document.querySelector("#direct-di-wrap"),
    benefitToolWrap: document.querySelector("#benefit-tool-wrap"),
    weightValidation: document.querySelector("#weight-validation"),
    rmsValidation: document.querySelector("#rms-validation"),
    caGrid: document.querySelector("#ca-grid"),
    profitBand: document.querySelector("#profit-band"),
    profitLabel: document.querySelector("#profit-label"),
    profitRoi: document.querySelector("#profit-roi"),
    recommendationText: document.querySelector("#recommendation-text"),
    sensitivityGrid: document.querySelector("#sensitivity-grid"),
    firmCogs: document.querySelector("#firm-cogs"),
    compCogs: document.querySelector("#comp-cogs"),
    directDi: document.querySelector("#direct-di"),
    firmShare: document.querySelector("#firm-share"),
    comp1Share: document.querySelector("#comp1-share"),
    comp2Share: document.querySelector("#comp2-share"),
    comp3Share: document.querySelector("#comp3-share")
  };

  const benefitInputs = [1, 2, 3].map(function mapBenefit(index) {
    return {
      name: document.querySelector("#b" + index + "-name"),
      weight: document.querySelector("#b" + index + "-weight"),
      firm: document.querySelector("#b" + index + "-firm"),
      comp: document.querySelector("#b" + index + "-comp")
    };
  });

  function toNumber(input, fallback) {
    const value = Number(input.value);
    return Number.isFinite(value) ? value : fallback;
  }

  function round1(value) {
    return Math.round(value * 10) / 10;
  }

  function fmt(value) {
    return round1(value).toFixed(1);
  }

  function selectedDiMode() {
    const current = Array.from(els.diMode).find(function findChecked(node) {
      return node.checked;
    });
    return current ? current.value : "direct";
  }

  function readBenefits() {
    return benefitInputs.map(function mapInputs(row) {
      return {
        name: row.name.value.trim() || "Benefit",
        weight: toNumber(row.weight, 0),
        firm: toNumber(row.firm, 1),
        comp: toNumber(row.comp, 1)
      };
    });
  }

  function computeDiFromBenefits(benefits) {
    let di = 0;
    benefits.forEach(function calcBenefit(benefit) {
      const diff = benefit.firm - benefit.comp;
      if (diff >= 2.0) {
        di += benefit.weight;
      } else if (diff <= -2.0) {
        di -= benefit.weight;
      }
    });
    return di;
  }

  function classifyVCAI(vcai) {
    if (vcai < 95) {
      return "COST ADVANTAGE";
    }
    if (vcai <= 105) {
      return "PARITY";
    }
    return "COST DISADVANTAGE";
  }

  function classifyDI(di) {
    if (di > 20) {
      return "DIFFERENTIATION ADVANTAGE";
    }
    if (di >= 0) {
      return "PARITY";
    }
    return "DIFFERENTIATION DISADVANTAGE";
  }

  function classifyRMS(rms) {
    if (rms >= 100) {
      return "MARKET DOMINANT";
    }
    if (rms >= 50) {
      return "COMPETITIVE";
    }
    return "FOLLOWER";
  }

  function cardClassFromStatus(status) {
    if (status.includes("ADVANTAGE")) {
      return "status-advantage";
    }
    if (status.includes("DISADVANTAGE")) {
      return "status-disadvantage";
    }
    if (status === "PARITY") {
      return "status-parity";
    }
    if (status === "MARKET DOMINANT") {
      return "status-dominant";
    }
    if (status === "COMPETITIVE") {
      return "status-competitive";
    }
    if (status === "FOLLOWER") {
      return "status-follower";
    }
    return "status-disabled";
  }

  function interpretationFor(type, status) {
    const lookup = {
      cost: {
        "COST ADVANTAGE": "Lower relative cost supports margin resilience and price flexibility.",
        PARITY: "Cost position does not create a threshold advantage.",
        "COST DISADVANTAGE": "Higher relative cost weakens margin and strategic flexibility.",
        DISABLED: "Cost index cannot be evaluated until valid values are provided."
      },
      di: {
        "DIFFERENTIATION ADVANTAGE": "Perceived value clears the differentiation threshold.",
        PARITY: "Value differences are below threshold and do not create advantage.",
        "DIFFERENTIATION DISADVANTAGE": "Perceived value is below competitors on critical benefits.",
        DISABLED: "Differentiation index is disabled until benefit weights sum to 100."
      },
      rms: {
        "MARKET DOMINANT": "Relative share is high enough to influence competitive outcomes.",
        COMPETITIVE: "Position is viable but not dominant.",
        FOLLOWER: "Relative share suggests limited competitive power.",
        DISABLED: "RMS is disabled because competitor shares sum to zero."
      }
    };

    return lookup[type][status] || "No interpretation available.";
  }

  function evaluateProfit(statuses, disabledFlags) {
    if (disabledFlags.diDisabled || disabledFlags.rmsDisabled) {
      return {
        label: "Inputs Required",
        roi: "ROI Band: unavailable until all required indices are valid",
        className: "profit-pending"
      };
    }

    const hasCostAdv = statuses.cost === "COST ADVANTAGE";
    const hasDiAdv = statuses.di === "DIFFERENTIATION ADVANTAGE";
    const hasRmsAdv = statuses.rms === "MARKET DOMINANT";
    const hasAnyAdv = hasCostAdv || hasDiAdv || hasRmsAdv;

    if (hasAnyAdv) {
      return {
        label: "Strong Profit Potential",
        roi: "ROI Band: 8.0% to 15.0%+",
        className: "profit-strong"
      };
    }

    return {
      label: "No Clear Advantage - Vulnerable",
      roi: "ROI Band: 0.0% to 4.0%",
      className: "profit-vulnerable"
    };
  }

  function getAdvantageList(statuses) {
    const list = [];
    if (statuses.cost === "COST ADVANTAGE") {
      list.push("cost");
    }
    if (statuses.di === "DIFFERENTIATION ADVANTAGE") {
      list.push("di");
    }
    if (statuses.rms === "MARKET DOMINANT") {
      list.push("rms");
    }
    return list;
  }

  function recommendationFrom(data) {
    if (data.disabledFlags.diDisabled || data.disabledFlags.rmsDisabled) {
      return "Resolve disabled metrics, then use the panel to identify one primary advantage to commit behind.";
    }

    const adv = getAdvantageList(data.statuses);
    if (adv.length === 0) {
      return "No source crosses an advantage threshold. Use the Sensitivity Panel to test what change could create a true edge.";
    }

    if (adv.length === 1) {
      const map = {
        cost: "Commit to cost leadership execution and defend that single threshold advantage.",
        di: "Commit to differentiation strategy and invest in reinforcing value drivers customers notice.",
        rms: "Commit to scale leverage from market dominance while protecting share stability."
      };
      return map[adv[0]];
    }

    if (adv.length === 3) {
      return "All three indices signal advantage. Prioritize proof over broad claims and avoid over-claiming an unbeatable position.";
    }

    const strengths = {
      cost: Math.max(0, 95 - data.values.vcai),
      di: Math.max(0, data.values.di - 20),
      rms: Math.max(0, data.values.rms - 100)
    };
    const sorted = adv.sort(function sortAdv(a, b) {
      return strengths[b] - strengths[a];
    });
    const nameMap = {
      cost: "cost",
      di: "differentiation",
      rms: "market"
    };

    return "Two advantages detected. Compare strength and resource fit: " +
      nameMap[sorted[0]] + " appears stronger than " + nameMap[sorted[1]] + ".";
  }

  function buildState() {
    const firmCogs = toNumber(els.firmCogs, 52);
    const compCogs = toNumber(els.compCogs, 58);
    const firmShare = toNumber(els.firmShare, 18);
    const comp1Share = toNumber(els.comp1Share, 24);
    const comp2Share = toNumber(els.comp2Share, 19);
    const comp3Share = toNumber(els.comp3Share, 14);

    const benefits = readBenefits();
    const weightTotal = benefits.reduce(function reduceWeight(sum, benefit) {
      return sum + benefit.weight;
    }, 0);
    const weightsValid = Math.abs(weightTotal - 100) < 0.000001;

    const diMode = selectedDiMode();
    const directDi = toNumber(els.directDi, 0);
    const diDisabled = diMode === "benefits" && !weightsValid;
    const diValue = diMode === "benefits" ? computeDiFromBenefits(benefits) : directDi;

    const competitorSum = comp1Share + comp2Share + comp3Share;
    const rmsDisabled = competitorSum <= 0;

    const vcai = (firmCogs / compCogs) * 100;
    const rms = rmsDisabled ? NaN : (firmShare / competitorSum) * 100;

    const statuses = {
      cost: classifyVCAI(vcai),
      di: diDisabled ? "DISABLED" : classifyDI(diValue),
      rms: rmsDisabled ? "DISABLED" : classifyRMS(rms)
    };

    const values = {
      vcai: round1(vcai),
      di: round1(diValue),
      rms: rmsDisabled ? NaN : round1(rms)
    };

    const disabledFlags = {
      diDisabled,
      rmsDisabled
    };

    return {
      values,
      statuses,
      disabledFlags,
      diMode,
      weightTotal,
      firmCogs,
      compCogs,
      competitorSum
    };
  }

  function renderValidation(state) {
    if (state.diMode === "benefits") {
      els.weightValidation.classList.toggle("error", state.disabledFlags.diDisabled);
      els.weightValidation.textContent = state.disabledFlags.diDisabled
        ? "Weights total " + fmt(state.weightTotal) + ". DI disabled until total is exactly 100.0"
        : "Weights total 100.0. DI is active.";
    } else {
      els.weightValidation.classList.remove("error");
      els.weightValidation.textContent = "Benefit weights are used only in 3-benefit mode.";
    }

    els.rmsValidation.classList.toggle("error", state.disabledFlags.rmsDisabled);
    els.rmsValidation.textContent = state.disabledFlags.rmsDisabled
      ? "Competitor shares sum to 0.0. RMS disabled."
      : "Competitor shares sum: " + fmt(state.competitorSum);
  }

  function renderCards(state) {
    const cards = [
      {
        title: "Cost",
        valueLabel: fmt(state.values.vcai),
        status: state.statuses.cost,
        interpretation: interpretationFor("cost", state.statuses.cost)
      },
      {
        title: "Differentiation",
        valueLabel: state.disabledFlags.diDisabled ? "N/A" : fmt(state.values.di),
        status: state.statuses.di,
        interpretation: interpretationFor("di", state.statuses.di)
      },
      {
        title: "Marketing",
        valueLabel: state.disabledFlags.rmsDisabled ? "N/A" : fmt(state.values.rms),
        status: state.statuses.rms,
        interpretation: interpretationFor("rms", state.statuses.rms)
      }
    ];

    const html = cards.map(function buildCard(card) {
      return (
        '<article class="ca-card">' +
          "<h3>" + card.title + "</h3>" +
          '<div class="metric-value">' + card.valueLabel + "</div>" +
          '<span class="status-badge ' + cardClassFromStatus(card.status) + '">' + card.status + "</span>" +
          '<p class="interpretation">' + card.interpretation + "</p>" +
        "</article>"
      );
    }).join("");

    els.caGrid.innerHTML = html;
  }

  function renderProfit(state) {
    const profit = evaluateProfit(state.statuses, state.disabledFlags);
    els.profitBand.className = "profit-band " + profit.className;
    els.profitLabel.textContent = profit.label;
    els.profitRoi.textContent = profit.roi;
    els.recommendationText.textContent = recommendationFrom(state);
    return profit;
  }

  function cloneState(baseState, overrides) {
    const mergedValues = {
      vcai: baseState.values.vcai,
      di: baseState.values.di,
      rms: baseState.values.rms
    };
    if (typeof overrides.vcai === "number") {
      mergedValues.vcai = round1(overrides.vcai);
    }
    if (typeof overrides.di === "number") {
      mergedValues.di = round1(overrides.di);
    }
    if (typeof overrides.rms === "number") {
      mergedValues.rms = round1(overrides.rms);
    }

    const mergedDisabled = {
      diDisabled: baseState.disabledFlags.diDisabled,
      rmsDisabled: baseState.disabledFlags.rmsDisabled
    };
    if (typeof overrides.diDisabled === "boolean") {
      mergedDisabled.diDisabled = overrides.diDisabled;
    }
    if (typeof overrides.rmsDisabled === "boolean") {
      mergedDisabled.rmsDisabled = overrides.rmsDisabled;
    }

    const statuses = {
      cost: classifyVCAI(mergedValues.vcai),
      di: mergedDisabled.diDisabled ? "DISABLED" : classifyDI(mergedValues.di),
      rms: mergedDisabled.rmsDisabled ? "DISABLED" : classifyRMS(mergedValues.rms)
    };

    return {
      values: mergedValues,
      statuses,
      disabledFlags: mergedDisabled
    };
  }

  function renderSensitivity(baseState, baseProfit) {
    const scenarios = [];

    const vcaiAfter = ((baseState.firmCogs - 5) / baseState.compCogs) * 100;
    const stateA = cloneState(baseState, { vcai: vcaiAfter });
    const profitA = evaluateProfit(stateA.statuses, stateA.disabledFlags);
    scenarios.push({
      title: "Scenario A: COGS -5",
      metricLine: "VCAI: " + fmt(baseState.values.vcai) + " -> " + fmt(stateA.values.vcai),
      statusLine: "Cost status: " + baseState.statuses.cost + " -> " + stateA.statuses.cost,
      profitLine: "Profit: " + baseProfit.label + " -> " + profitA.label
    });

    const stateB = cloneState(baseState, {
      di: baseState.values.di + 20,
      diDisabled: false
    });
    const profitB = evaluateProfit(stateB.statuses, stateB.disabledFlags);
    scenarios.push({
      title: "Scenario B: DI +20",
      metricLine: "DI: " + (baseState.disabledFlags.diDisabled ? "N/A" : fmt(baseState.values.di)) +
        " -> " + fmt(stateB.values.di),
      statusLine: "DI status: " + baseState.statuses.di + " -> " + stateB.statuses.di,
      profitLine: "Profit: " + baseProfit.label + " -> " + profitB.label
    });

    const stateC = cloneState(baseState, {
      rms: 70,
      rmsDisabled: false
    });
    const profitC = evaluateProfit(stateC.statuses, stateC.disabledFlags);
    scenarios.push({
      title: "Scenario C: RMS fixed to 70",
      metricLine: "RMS: " + (baseState.disabledFlags.rmsDisabled ? "N/A" : fmt(baseState.values.rms)) + " -> 70.0",
      statusLine: "Marketing status: " + baseState.statuses.rms + " -> " + stateC.statuses.rms,
      profitLine: "Profit: " + baseProfit.label + " -> " + profitC.label
    });

    els.sensitivityGrid.innerHTML = scenarios.map(function mapScenario(scenario) {
      return (
        '<article class="scenario-card">' +
          "<h3>" + scenario.title + "</h3>" +
          '<p class="scenario-line">' + scenario.metricLine + "</p>" +
          '<p class="scenario-line">' + scenario.statusLine + "</p>" +
          '<p class="scenario-line">' + scenario.profitLine + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function toggleDiModeView() {
    const mode = selectedDiMode();
    const direct = mode === "direct";
    els.directDiWrap.hidden = !direct;
    els.benefitToolWrap.hidden = direct;
  }

  function applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) {
      return;
    }

    els.firmCogs.value = preset.firmCogs;
    els.compCogs.value = preset.compCogs;
    els.directDi.value = preset.directDi;
    els.firmShare.value = preset.firmShare;
    els.comp1Share.value = preset.comp1Share;
    els.comp2Share.value = preset.comp2Share;
    els.comp3Share.value = preset.comp3Share;

    benefitInputs.forEach(function setBenefit(row, idx) {
      row.name.value = preset.benefits[idx].name;
      row.weight.value = preset.benefits[idx].weight;
      row.firm.value = preset.benefits[idx].firm;
      row.comp.value = preset.benefits[idx].comp;
    });

    Array.from(els.diMode).forEach(function setMode(radio) {
      radio.checked = radio.value === preset.mode;
    });
    toggleDiModeView();
    updateAll();
  }

  function updateAll() {
    toggleDiModeView();
    const state = buildState();
    renderValidation(state);
    renderCards(state);
    const profit = renderProfit(state);
    renderSensitivity(state, profit);
  }

  function wireEvents() {
    document.querySelectorAll("input, select").forEach(function wire(node) {
      node.addEventListener("input", updateAll);
      node.addEventListener("change", updateAll);
    });

    els.presetSelect.addEventListener("change", function onPresetChange(event) {
      applyPreset(event.target.value);
    });

    if (els.focusModeBtn) {
      els.focusModeBtn.addEventListener("click", function onFocusToggle() {
        const enabled = document.body.classList.toggle("focus-mode");
        els.focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
        els.focusModeBtn.setAttribute("aria-pressed", String(enabled));
      });
    }
  }

  wireEvents();
  updateAll();
})();