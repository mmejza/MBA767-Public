/*
M08 APP 2 — PERFORMANCE VALUE PRICING SIMULATOR
SOURCE OF TRUTH FOR COPILOT BUILD

Build App 2 only. This app helps students compute weighted value scores from attribute weights and preference scores, then compare value advantage across customer segments.

TECHNICAL REQUIREMENTS
- Vanilla HTML/CSS/JS preferred.
- Single-page app, client-side only.
- No backend, no persistence, no login, no external API calls.
- Designed for Canvas iframe desktop use.
- Real-time recalculation on every input change.
- Include segment preset buttons and Reset.
- Reset returns to Quality-Conscious default.
- Weight sliders must always sum to 100%.
- Use accessible labels and verdict text; do not rely only on color.

LAYOUT
Two-panel layout:
1. Left panel: input panel with segment presets, attribute labels, weight sliders, preference score inputs, price fields.
2. Right panel: value score summary, VP1–VP5 strategy table, value map visualization, verdict badge.

DEFAULT / QUALITY-CONSCIOUS INPUTS
Attribute 1 Label = "Trim / Feature Quality"
Attribute 2 Label = "Paint / Finish Quality"
Attribute 3 Label = "Price" // not editable

Weights:
Attribute 1 = 50%
Attribute 2 = 43%
Attribute 3 Price = 7%

Firm Scores:
Attribute 1 = 1.00
Attribute 2 = 0.90
Attribute 3 Price = 0.40

Competitor Scores:
Attribute 1 = 0.50
Attribute 2 = 0.60
Attribute 3 Price = 0.70

Firm Price = 3.00
Competitor Price = 1.50
Price Step = 0.50

CORE CALCULATIONS
Total Value Score =
sum(attribute score * attribute weight as decimal)

Firm Value Score =
firm attr1 score * weight1 +
firm attr2 score * weight2 +
firm price score * price weight

Competitor Value Score =
competitor attr1 score * weight1 +
competitor attr2 score * weight2 +
competitor price score * price weight

Value Advantage =
Firm Value Score - Competitor Value Score

Percent Value Advantage =
Value Advantage / Competitor Value Score * 100

VERDICT LOGIC
If Firm Value Score > Competitor Value Score:
  verdict = VALUE ADVANTAGE
  badge = green
Else:
  verdict = VALUE DEFICIENCY
  badge = red

WEIGHT SLIDER LOGIC
- Three sliders must always sum to 100%.
- Attribute 3 is always Price and cannot be renamed.
- When one slider changes, automatically adjust the other two proportionally so total remains 100%.
- Allow Custom state when user changes sliders manually.

VP STRATEGY TABLE
Create five VP columns: VP1 through VP5.
Use price points from Competitor Price - Price Step through Firm Price + Price Step.
With defaults, table should include five price points spaced by Price Step.

For each VP point display:
- VP Label
- Company Price
- Competitor Price
- Price Premium
- Percent Price Premium
- Adjusted Value Score
- Value Advantage
- Percent Value Advantage

PRICE SCORE INTERPOLATION
Adjusted firm price score at each VP price:
score = max_score - ((price - competitor_price) / (firm_price - competitor_price)) * (max_score - min_score)

Use:
max_score = competitor price score
min_score = firm price score

Then recompute adjusted firm value score using the adjusted price score while keeping non-price scores and weights unchanged.

TABLE HIGHLIGHTING
Value Advantage:
- green if >= 0.10
- red if < 0

Percent Value Advantage:
- green if >= 15%
- amber if 5% to 14%
- red if < 5%

VALUE MAP VISUALIZATION
Create a scatter-style value map:
- X-axis = price
- Y-axis = total value score
- Firm shown as one marker
- Competitor shown as another marker
- Include a diagonal fair value line
- Chart title: "Value Map — [Active Segment Name]"
- Axes labeled "Price" and "Total Value Score"

PRESETS
1. Quality-Conscious default
Weights: 50 / 43 / 7
Expected:
Firm score ≈ 0.915
Competitor score ≈ 0.557
Percent advantage ≈ 64.3%
Verdict = VALUE ADVANTAGE

2. Balanced Segment
Weights: 40 / 40 / 20
Firm still has advantage, but smaller.

3. Price-Influenced
Weights: 30 / 30 / 40
Value advantage shrinks further.

4. Price-Sensitive
Weights: 15 / 15 / 70
Expected:
Firm score ≈ 0.565
Competitor score ≈ 0.655
Verdict = VALUE DEFICIENCY
This is the cognitive trap: same product, same price, opposite strategic conclusion.

5. Custom
Activated when user changes weights manually.

6. Reset
Return to Quality-Conscious default.

ACCEPTANCE TESTS
- Quality-Conscious: firm ≈ 0.915; competitor ≈ 0.557; advantage ≈ 64.3%; badge VALUE ADVANTAGE.
- Price-Sensitive: firm ≈ 0.565; competitor ≈ 0.655; badge VALUE DEFICIENCY.
- Weight sliders always sum to 100%.
- VP table recalculates adjusted value at each price point.
- No Vantara case numbers may appear in presets.
*/

(function initPerformanceValuePricingSimulator() {
  const ATTRS = ["a1", "a2", "price"];

  const DEFAULT_STATE = {
    segmentName: "Quality-Conscious",
    labels: {
      a1: "Trim / Feature Quality",
      a2: "Paint / Finish Quality",
      price: "Price"
    },
    weights: {
      a1: 50,
      a2: 43,
      price: 7
    },
    firmScores: {
      a1: 1.0,
      a2: 0.9,
      price: 0.4
    },
    compScores: {
      a1: 0.5,
      a2: 0.6,
      price: 0.7
    },
    firmPrice: 3.0,
    compPrice: 1.5,
    priceStep: 0.5
  };

  const PRESETS = {
    quality: {
      segmentName: "Quality-Conscious",
      weights: { a1: 50, a2: 43, price: 7 }
    },
    balanced: {
      segmentName: "Balanced Segment",
      weights: { a1: 40, a2: 40, price: 20 }
    },
    influenced: {
      segmentName: "Price-Influenced",
      weights: { a1: 30, a2: 30, price: 40 }
    },
    sensitive: {
      segmentName: "Price-Sensitive",
      weights: { a1: 15, a2: 15, price: 70 }
    }
  };

  const ui = {
    focusModeBtn: document.querySelector("#focusModeBtn"),
    activeSegment: document.querySelector("#active-segment"),
    attr1Label: document.querySelector("#attr1-label"),
    attr2Label: document.querySelector("#attr2-label"),
    a1ScoreLabel: document.querySelector("#a1-score-label"),
    a2ScoreLabel: document.querySelector("#a2-score-label"),
    weightTotal: document.querySelector("#weight-total"),
    w1Slider: document.querySelector("#w1-slider"),
    w2Slider: document.querySelector("#w2-slider"),
    w3Slider: document.querySelector("#w3-slider"),
    w1Number: document.querySelector("#w1-number"),
    w2Number: document.querySelector("#w2-number"),
    w3Number: document.querySelector("#w3-number"),
    firmA1: document.querySelector("#firm-a1"),
    firmA2: document.querySelector("#firm-a2"),
    firmPriceScore: document.querySelector("#firm-price-score"),
    compA1: document.querySelector("#comp-a1"),
    compA2: document.querySelector("#comp-a2"),
    compPriceScore: document.querySelector("#comp-price-score"),
    firmPrice: document.querySelector("#firm-price"),
    compPrice: document.querySelector("#comp-price"),
    priceStep: document.querySelector("#price-step"),
    summaryList: document.querySelector("#summary-list"),
    verdictBadge: document.querySelector("#verdict-badge"),
    verdictText: document.querySelector("#verdict-text"),
    vpTableBody: document.querySelector("#vp-table-body"),
    mapTitle: document.querySelector("#map-title"),
    mapLayer: document.querySelector("#map-layer"),
    presetButtons: document.querySelectorAll("button[data-preset]"),
    resetBtn: document.querySelector("#reset-btn")
  };

  let activeSegmentName = DEFAULT_STATE.segmentName;
  let applyingPreset = false;

  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function money(value) {
    return "$" + value.toFixed(2);
  }

  function pct(value) {
    return value.toFixed(1) + "%";
  }

  function setLabelFields(state) {
    ui.attr1Label.value = state.labels.a1;
    ui.attr2Label.value = state.labels.a2;
    ui.a1ScoreLabel.textContent = state.labels.a1;
    ui.a2ScoreLabel.textContent = state.labels.a2;
  }

  function setWeightFields(weights) {
    ui.w1Slider.value = String(weights.a1);
    ui.w2Slider.value = String(weights.a2);
    ui.w3Slider.value = String(weights.price);
    ui.w1Number.value = String(weights.a1);
    ui.w2Number.value = String(weights.a2);
    ui.w3Number.value = String(weights.price);
    ui.weightTotal.textContent = String(weights.a1 + weights.a2 + weights.price) + "%";
  }

  function setScoreAndPriceFields(state) {
    ui.firmA1.value = state.firmScores.a1.toFixed(2);
    ui.firmA2.value = state.firmScores.a2.toFixed(2);
    ui.firmPriceScore.value = state.firmScores.price.toFixed(2);
    ui.compA1.value = state.compScores.a1.toFixed(2);
    ui.compA2.value = state.compScores.a2.toFixed(2);
    ui.compPriceScore.value = state.compScores.price.toFixed(2);
    ui.firmPrice.value = state.firmPrice.toFixed(2);
    ui.compPrice.value = state.compPrice.toFixed(2);
    ui.priceStep.value = state.priceStep.toFixed(2);
  }

  function readWeights() {
    return {
      a1: clamp(Math.round(num(ui.w1Slider.value, 0)), 0, 100),
      a2: clamp(Math.round(num(ui.w2Slider.value, 0)), 0, 100),
      price: clamp(Math.round(num(ui.w3Slider.value, 0)), 0, 100)
    };
  }

  function readState() {
    const weights = readWeights();
    return {
      segmentName: activeSegmentName,
      labels: {
        a1: ui.attr1Label.value.trim() || "Attribute 1",
        a2: ui.attr2Label.value.trim() || "Attribute 2",
        price: "Price"
      },
      weights,
      firmScores: {
        a1: clamp(num(ui.firmA1.value, 0), 0, 1),
        a2: clamp(num(ui.firmA2.value, 0), 0, 1),
        price: clamp(num(ui.firmPriceScore.value, 0), 0, 1)
      },
      compScores: {
        a1: clamp(num(ui.compA1.value, 0), 0, 1),
        a2: clamp(num(ui.compA2.value, 0), 0, 1),
        price: clamp(num(ui.compPriceScore.value, 0), 0, 1)
      },
      firmPrice: Math.max(0, num(ui.firmPrice.value, 0)),
      compPrice: Math.max(0, num(ui.compPrice.value, 0)),
      priceStep: Math.max(0.01, num(ui.priceStep.value, 0.5))
    };
  }

  function toDecimals(weights) {
    return {
      a1: weights.a1 / 100,
      a2: weights.a2 / 100,
      price: weights.price / 100
    };
  }

  function totalValueScore(scores, weightDec) {
    return (
      scores.a1 * weightDec.a1 +
      scores.a2 * weightDec.a2 +
      scores.price * weightDec.price
    );
  }

  function computeCore(state) {
    const weightDec = toDecimals(state.weights);
    const firmValue = totalValueScore(state.firmScores, weightDec);
    const compValue = totalValueScore(state.compScores, weightDec);
    const valueAdv = firmValue - compValue;
    const pctValueAdv = compValue === 0 ? 0 : (valueAdv / compValue) * 100;

    return {
      firmValue,
      compValue,
      valueAdv,
      pctValueAdv,
      verdict: firmValue > compValue ? "VALUE ADVANTAGE" : "VALUE DEFICIENCY"
    };
  }

  function pricePoints(state) {
    const start = state.compPrice - state.priceStep;
    const points = [];
    for (let i = 0; i < 5; i += 1) {
      points.push(start + i * state.priceStep);
    }
    return points;
  }

  function adjustedFirmPriceScore(state, candidatePrice) {
    const maxScore = state.compScores.price;
    const minScore = state.firmScores.price;
    const denom = state.firmPrice - state.compPrice;
    if (denom === 0) {
      return clamp(minScore, 0, 1);
    }
    const score =
      maxScore -
      ((candidatePrice - state.compPrice) / denom) * (maxScore - minScore);
    return clamp(score, 0, 1);
  }

  function buildVpRows(state, core) {
    const weightDec = toDecimals(state.weights);
    const rows = [];

    pricePoints(state).forEach(function each(price, idx) {
      const adjustedScore = adjustedFirmPriceScore(state, price);
      const adjustedFirmValue =
        state.firmScores.a1 * weightDec.a1 +
        state.firmScores.a2 * weightDec.a2 +
        adjustedScore * weightDec.price;
      const valueAdv = adjustedFirmValue - core.compValue;
      const pctValueAdv = core.compValue === 0 ? 0 : (valueAdv / core.compValue) * 100;
      const premium = price - state.compPrice;
      const pctPremium = state.compPrice === 0 ? 0 : (premium / state.compPrice) * 100;

      rows.push({
        label: "VP" + String(idx + 1),
        companyPrice: price,
        competitorPrice: state.compPrice,
        premium,
        pctPremium,
        adjustedFirmValue,
        valueAdv,
        pctValueAdv
      });
    });

    return rows;
  }

  function classForValueAdv(value) {
    if (value >= 0.1) {
      return "hi-good";
    }
    if (value < 0) {
      return "hi-bad";
    }
    return "";
  }

  function classForPctValueAdv(value) {
    if (value >= 15) {
      return "hi-good";
    }
    if (value >= 5) {
      return "hi-amber";
    }
    return "hi-bad";
  }

  function renderSummary(state, core) {
    const rows = [
      ["Firm Value Score", core.firmValue.toFixed(3)],
      ["Competitor Value Score", core.compValue.toFixed(3)],
      ["Value Advantage", core.valueAdv.toFixed(3)],
      ["Percent Value Advantage", pct(core.pctValueAdv)],
      ["Firm Price", money(state.firmPrice)],
      ["Competitor Price", money(state.compPrice)],
      ["Price Step", money(state.priceStep)]
    ];

    ui.summaryList.innerHTML = "";
    rows.forEach(function each(entry) {
      const dt = document.createElement("dt");
      dt.textContent = entry[0];
      const dd = document.createElement("dd");
      dd.textContent = entry[1];
      ui.summaryList.appendChild(dt);
      ui.summaryList.appendChild(dd);
    });

    ui.verdictBadge.textContent = core.verdict;
    if (core.verdict === "VALUE ADVANTAGE") {
      ui.verdictBadge.className = "badge good";
      ui.verdictText.textContent = "Firm offers higher weighted customer value at current assumptions.";
    } else {
      ui.verdictBadge.className = "badge bad";
      ui.verdictText.textContent = "Competitor offers higher weighted customer value under this segment weighting.";
    }
  }

  function renderVpTable(rows) {
    ui.vpTableBody.innerHTML = "";

    rows.forEach(function each(row) {
      const tr = document.createElement("tr");

      const valueAdvClass = classForValueAdv(row.valueAdv);
      const pctAdvClass = classForPctValueAdv(row.pctValueAdv);

      tr.innerHTML = [
        "<td>" + row.label + "</td>",
        "<td>" + money(row.companyPrice) + "</td>",
        "<td>" + money(row.competitorPrice) + "</td>",
        "<td>" + money(row.premium) + "</td>",
        "<td>" + pct(row.pctPremium) + "</td>",
        "<td>" + row.adjustedFirmValue.toFixed(3) + "</td>",
        "<td class=\"" + valueAdvClass + "\">" + row.valueAdv.toFixed(3) + "</td>",
        "<td class=\"" + pctAdvClass + "\">" + pct(row.pctValueAdv) + "</td>"
      ].join("");

      ui.vpTableBody.appendChild(tr);
    });
  }

  function svgEl(name, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs).forEach(function each(key) {
      el.setAttribute(key, String(attrs[key]));
    });
    return el;
  }

  function renderMap(state, core) {
    ui.mapTitle.textContent = "Value Map - " + state.segmentName;
    ui.mapLayer.innerHTML = "";

    const width = 460;
    const height = 300;
    const pad = { top: 20, right: 22, bottom: 44, left: 52 };
    const plotW = width - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    const xMin = Math.min(state.compPrice, state.firmPrice) - state.priceStep;
    const xMax = Math.max(state.compPrice, state.firmPrice) + state.priceStep;
    const yMin = Math.max(0, Math.min(core.compValue, core.firmValue) - 0.12);
    const yMax = Math.min(1.05, Math.max(core.compValue, core.firmValue) + 0.12);

    const xScale = function scaleX(x) {
      if (xMax === xMin) {
        return pad.left + plotW / 2;
      }
      return pad.left + ((x - xMin) / (xMax - xMin)) * plotW;
    };
    const yScale = function scaleY(y) {
      if (yMax === yMin) {
        return pad.top + plotH / 2;
      }
      return pad.top + (1 - (y - yMin) / (yMax - yMin)) * plotH;
    };

    ui.mapLayer.appendChild(svgEl("line", {
      x1: pad.left,
      y1: pad.top + plotH,
      x2: pad.left + plotW,
      y2: pad.top + plotH,
      stroke: "#8ea0ad",
      "stroke-width": 1
    }));
    ui.mapLayer.appendChild(svgEl("line", {
      x1: pad.left,
      y1: pad.top,
      x2: pad.left,
      y2: pad.top + plotH,
      stroke: "#8ea0ad",
      "stroke-width": 1
    }));

    ui.mapLayer.appendChild(svgEl("line", {
      x1: xScale(xMin),
      y1: yScale(yMin),
      x2: xScale(xMax),
      y2: yScale(yMax),
      stroke: "#c98f12",
      "stroke-width": 1.5,
      "stroke-dasharray": "6 4"
    }));

    const compX = xScale(state.compPrice);
    const compY = yScale(core.compValue);
    const firmX = xScale(state.firmPrice);
    const firmY = yScale(core.firmValue);

    ui.mapLayer.appendChild(svgEl("circle", {
      cx: compX,
      cy: compY,
      r: 6,
      fill: "#355c7d"
    }));
    ui.mapLayer.appendChild(svgEl("circle", {
      cx: firmX,
      cy: firmY,
      r: 6,
      fill: "#0b8f79"
    }));

    const compLabel = svgEl("text", {
      x: compX + 8,
      y: compY - 6,
      fill: "#1f3647",
      "font-size": 12
    });
    compLabel.textContent = "Competitor";
    ui.mapLayer.appendChild(compLabel);

    const firmLabel = svgEl("text", {
      x: firmX + 8,
      y: firmY - 6,
      fill: "#0a5f51",
      "font-size": 12
    });
    firmLabel.textContent = "Firm";
    ui.mapLayer.appendChild(firmLabel);

    const xLabel = svgEl("text", {
      x: pad.left + plotW / 2,
      y: height - 10,
      "text-anchor": "middle",
      fill: "#3a4c58",
      "font-size": 12
    });
    xLabel.textContent = "Price";
    ui.mapLayer.appendChild(xLabel);

    const yLabel = svgEl("text", {
      x: 14,
      y: pad.top + plotH / 2,
      transform: "rotate(-90 14 " + String(pad.top + plotH / 2) + ")",
      "text-anchor": "middle",
      fill: "#3a4c58",
      "font-size": 12
    });
    yLabel.textContent = "Total Value Score";
    ui.mapLayer.appendChild(yLabel);
  }

  function recomputeAndRender() {
    const state = readState();
    state.segmentName = activeSegmentName;
    const core = computeCore(state);
    const vpRows = buildVpRows(state, core);

    ui.a1ScoreLabel.textContent = state.labels.a1;
    ui.a2ScoreLabel.textContent = state.labels.a2;
    ui.activeSegment.textContent = state.segmentName;
    ui.weightTotal.textContent = String(state.weights.a1 + state.weights.a2 + state.weights.price) + "%";

    renderSummary(state, core);
    renderVpTable(vpRows);
    renderMap(state, core);
  }

  function setWeightsWithProportionalAdjustment(changedKey, newValue) {
    const current = readWeights();
    const constrained = clamp(Math.round(newValue), 0, 100);
    const otherKeys = ATTRS.filter(function each(key) {
      return key !== changedKey;
    });
    const remaining = 100 - constrained;
    const otherSum = current[otherKeys[0]] + current[otherKeys[1]];

    current[changedKey] = constrained;

    if (otherSum <= 0) {
      const first = Math.round(remaining / 2);
      current[otherKeys[0]] = first;
      current[otherKeys[1]] = remaining - first;
    } else {
      const first = Math.round((remaining * current[otherKeys[0]]) / otherSum);
      current[otherKeys[0]] = first;
      current[otherKeys[1]] = remaining - first;
    }

    setWeightFields(current);
  }

  function applyPreset(key) {
    const preset = PRESETS[key];
    if (!preset) {
      return;
    }

    applyingPreset = true;
    activeSegmentName = preset.segmentName;
    setWeightFields(preset.weights);
    applyingPreset = false;
    recomputeAndRender();
  }

  function resetAll() {
    applyingPreset = true;
    activeSegmentName = DEFAULT_STATE.segmentName;
    setLabelFields(DEFAULT_STATE);
    setWeightFields(DEFAULT_STATE.weights);
    setScoreAndPriceFields(DEFAULT_STATE);
    applyingPreset = false;
    recomputeAndRender();
  }

  function bindWeightControl(slider, numberInput, key) {
    slider.addEventListener("input", function onSlider() {
      setWeightsWithProportionalAdjustment(key, num(slider.value, 0));
      if (!applyingPreset) {
        activeSegmentName = "Custom";
      }
      recomputeAndRender();
    });

    numberInput.addEventListener("input", function onNumber() {
      setWeightsWithProportionalAdjustment(key, num(numberInput.value, 0));
      if (!applyingPreset) {
        activeSegmentName = "Custom";
      }
      recomputeAndRender();
    });
  }

  function wireEvents() {
    ui.presetButtons.forEach(function each(btn) {
      btn.addEventListener("click", function onPresetClick() {
        applyPreset(btn.dataset.preset);
      });
    });

    ui.resetBtn.addEventListener("click", function onReset() {
      resetAll();
    });

    bindWeightControl(ui.w1Slider, ui.w1Number, "a1");
    bindWeightControl(ui.w2Slider, ui.w2Number, "a2");
    bindWeightControl(ui.w3Slider, ui.w3Number, "price");

    [
      ui.attr1Label,
      ui.attr2Label,
      ui.firmA1,
      ui.firmA2,
      ui.firmPriceScore,
      ui.compA1,
      ui.compA2,
      ui.compPriceScore,
      ui.firmPrice,
      ui.compPrice,
      ui.priceStep
    ].forEach(function each(el) {
      el.addEventListener("input", function onInput() {
        recomputeAndRender();
      });
      el.addEventListener("change", function onChange() {
        recomputeAndRender();
      });
    });

    if (ui.focusModeBtn) {
      ui.focusModeBtn.addEventListener("click", function onFocusToggle() {
        const enabled = document.body.classList.toggle("focus-mode");
        ui.focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
        ui.focusModeBtn.setAttribute("aria-pressed", String(enabled));
      });
    }
  }

  resetAll();
  wireEvents();
})();