/*
M03 App 2 — Product Life-Cycle Stage Diagnostor

Purpose:
Students diagnose PLC stage from observable market indicators and see that NMC peaks in late growth before demand peaks in maturity.

TECH:
- Vanilla HTML/CSS/JS only.
- No persistence.
- Must run in Canvas iframe.

INPUTS:
- growthRatePct: slider -20 to +60
- competitors: slider 1 to 50
- triersPct: slider 0 to 100
- grossMarginTrend: dropdown Rising / Stable / Declining
- marketingExpenseTrend: dropdown Rising / Stable / Declining
- priceTrend: dropdown Rising / Stable / Declining / Steep decline

LOCKED PRESETS:
1. Introduction:
   growth +35; competitors 2; triers 90; margin Rising; mktgExp Rising; price Rising

2. Early Growth:
   growth +25; competitors 5; triers 65; margin Stable; mktgExp Rising; price Stable

3. Late Growth:
   growth +10; competitors 12; triers 40; margin Declining; mktgExp Rising; price Declining

4. Maturity:
   growth +2; competitors 22; triers 20; margin Declining; mktgExp Stable; price Stable

5. Decline:
   growth -8; competitors 8; triers 10; margin Declining; mktgExp Declining; price Steep decline

DIAGNOSIS ALGORITHM:
Use weighted scoring against five stage profiles:
- Demand growth rate weight: 35%
- Trier percentage weight: 25%
- Competitor count weight: 20%
- Margin + marketing expense trends combined: 20%
Winning stage = highest weighted score.
Confidence = winning score as 0–100%.
If confidence < 60%, display “Ambiguous — adjust inputs.”

OUTPUTS:
- PLC stage diagnosis badge: Introduction / Early Growth / Late Growth / Maturity / Decline.
- Confidence bar.
- Strategy card matching Slide 17 categories:
  Marketing Objective, Competitors, Product, Price, Promotion, Place.
- NMC trajectory chart always visible.
- Optional GP vs NMC overlay toggle.
- Stage indicator summary table with green/amber/red consistency indicators.

NMC TIMING TRAP:
- NMC line must peak in Late Growth.
- Demand line must peak in Maturity.
- Label “NMC peak (late growth)” and “Demand peak (maturity).”
- Do not render NMC and demand as peaking at same point.

WORKSHEET EXPECTED LOGIC:
Q1:
- Late Growth preset.
- Correct answer: NMC does NOT peak at same time as demand.
- Explanation must cite declining gross margins and rising marketing expenses.

Q2:
- Flat demand growth, 20+ competitors, low trier % should diagnose Maturity.
- Strategy card should prescribe reminder-oriented promotion and defend share/profit pricing.
- Heavy acquisition campaign should be critiqued as inconsistent with maturity-stage strategy.

NON-NEGOTIABLES:
- Do not add a sixth PLC stage.
- Do not let NMC peak in maturity.
- Do not use generic strategy text; use stage-specific card text.
- Do not add external libraries.
*/

const WEIGHTS = {
   growthRatePct: 35.0,
   triersPct: 25.0,
   competitors: 20.0,
   grossMarginTrend: 6.67,
   marketingExpenseTrend: 6.67,
   priceTrend: 6.66,
};

const STAGE_ORDER = [
   "Introduction",
   "Early Growth",
   "Late Growth",
   "Maturity",
   "Decline",
];

const PRESETS = {
   introduction: {
      label: "Introduction",
      growthRatePct: 35,
      competitors: 2,
      triersPct: 90,
      grossMarginTrend: "Rising",
      marketingExpenseTrend: "Rising",
      priceTrend: "Rising",
   },
   earlyGrowth: {
      label: "Early Growth",
      growthRatePct: 25,
      competitors: 5,
      triersPct: 65,
      grossMarginTrend: "Stable",
      marketingExpenseTrend: "Rising",
      priceTrend: "Stable",
   },
   lateGrowth: {
      label: "Late Growth",
      growthRatePct: 10,
      competitors: 12,
      triersPct: 40,
      grossMarginTrend: "Declining",
      marketingExpenseTrend: "Rising",
      priceTrend: "Declining",
   },
   maturity: {
      label: "Maturity",
      growthRatePct: 2,
      competitors: 22,
      triersPct: 20,
      grossMarginTrend: "Declining",
      marketingExpenseTrend: "Stable",
      priceTrend: "Stable",
   },
   decline: {
      label: "Decline",
      growthRatePct: -8,
      competitors: 8,
      triersPct: 10,
      grossMarginTrend: "Declining",
      marketingExpenseTrend: "Declining",
      priceTrend: "Steep decline",
   },
};

const STAGE_PROFILES = {
   Introduction: PRESETS.introduction,
   "Early Growth": PRESETS.earlyGrowth,
   "Late Growth": PRESETS.lateGrowth,
   Maturity: PRESETS.maturity,
   Decline: PRESETS.decline,
};

const STRATEGY_CARD_TEXT = {
   Introduction: {
      "Marketing Objective": "Build primary demand and awareness.",
      Competitors: "Few direct competitors; establish first-position advantage.",
      Product: "Core offering; clarify value proposition and use case.",
      Price: "Support trial with value framing and selective introductory pricing.",
      Promotion: "Education-heavy promotion to drive first purchase.",
      Place: "Build initial channel access and reduce trial friction.",
   },
   "Early Growth": {
      "Marketing Objective": "Accelerate adoption and build preference.",
      Competitors: "New competitors enter; differentiate on benefits.",
      Product: "Improve quality and add features for broader appeal.",
      Price: "Maintain disciplined pricing while scaling volume.",
      Promotion: "Balance acquisition with preference-building messages.",
      Place: "Expand distribution to capture rising demand.",
   },
   "Late Growth": {
      "Marketing Objective": "Maximize NMC before maturity compression.",
      Competitors: "Competitive density increases and imitation rises.",
      Product: "Refine line architecture and defend core differentiators.",
      Price: "Manage growing price pressure without eroding value.",
      Promotion: "Prioritize profitable segments as acquisition cost rises.",
      Place: "Optimize channel productivity and shelf economics.",
   },
   Maturity: {
      "Marketing Objective": "Defend share and profit in a saturated market.",
      Competitors: "Many entrenched competitors with parity claims.",
      Product: "Incremental improvements and lifecycle management.",
      Price: "Defend share/profit pricing and avoid margin-destructive wars.",
      Promotion: "Reminder-oriented promotion to protect loyalty.",
      Place: "Protect coverage efficiency and channel relationships.",
   },
   Decline: {
      "Marketing Objective": "Harvest value or reposition selectively.",
      Competitors: "Some competitors exit; survivors compete on economics.",
      Product: "Rationalize assortment and retire weak variants.",
      Price: "Use disciplined markdown strategy where needed.",
      Promotion: "Reduce broad acquisition spend; target profitable pockets.",
      Place: "Concentrate on profitable channels and segments.",
   },
};

const TRAJECTORY_DATA = {
   demand: [22, 58, 82, 100, 64],
   nmc: [10, 56, 100, 78, 24],
   gp: [14, 62, 88, 72, 28],
};

const state = {
   activePresetKey: "introduction",
};

function clamp(value, min, max) {
   return Math.max(min, Math.min(max, value));
}

function scoreNumeric(value, target, rangeSpan) {
   const distance = Math.abs(value - target);
   const similarity = 1 - distance / rangeSpan;
   return clamp(similarity, 0, 1) * 100;
}

function trendScore(inputTrend, targetTrend) {
   const order = {
      "Steep decline": 0,
      Declining: 1,
      Stable: 2,
      Rising: 3,
   };
   const diff = Math.abs(order[inputTrend] - order[targetTrend]);
   if (diff === 0) {
      return 100;
   }
   if (diff === 1) {
      return 60;
   }
   if (diff === 2) {
      return 20;
   }
   return 0;
}

function readInputs() {
   return {
      growthRatePct: parseFloat(document.getElementById("growthRatePct").value),
      competitors: parseFloat(document.getElementById("competitors").value),
      triersPct: parseFloat(document.getElementById("triersPct").value),
      grossMarginTrend: document.getElementById("grossMarginTrend").value,
      marketingExpenseTrend: document.getElementById("marketingExpenseTrend").value,
      priceTrend: document.getElementById("priceTrend").value,
   };
}

function weightedStageScore(inputs, stageProfile) {
   const growthScore = scoreNumeric(inputs.growthRatePct, stageProfile.growthRatePct, 80);
   const trierScore = scoreNumeric(inputs.triersPct, stageProfile.triersPct, 100);
   const compScore = scoreNumeric(inputs.competitors, stageProfile.competitors, 49);

   const marginScore = trendScore(inputs.grossMarginTrend, stageProfile.grossMarginTrend);
   const marketingScore = trendScore(inputs.marketingExpenseTrend, stageProfile.marketingExpenseTrend);
   const priceScore = trendScore(inputs.priceTrend, stageProfile.priceTrend);

   return (
      (growthScore * WEIGHTS.growthRatePct) / 100 +
      (trierScore * WEIGHTS.triersPct) / 100 +
      (compScore * WEIGHTS.competitors) / 100 +
      (marginScore * WEIGHTS.grossMarginTrend) / 100 +
      (marketingScore * WEIGHTS.marketingExpenseTrend) / 100 +
      (priceScore * WEIGHTS.priceTrend) / 100
   );
}

function diagnose(inputs) {
   const scored = STAGE_ORDER.map((stage) => {
      return {
         stage,
         score: weightedStageScore(inputs, STAGE_PROFILES[stage]),
      };
   }).sort((a, b) => b.score - a.score);

   const winner = scored[0];
   const confidence = clamp(winner.score, 0, 100);

   return {
      stage: winner.stage,
      confidence,
      ranked: scored,
   };
}

function setSliderReadout(id, formatter) {
   const input = document.getElementById(id);
   const output = document.getElementById(`${id}Val`);
   output.textContent = formatter(parseFloat(input.value));
}

function renderDiagnosis(result) {
   const badge = document.getElementById("stageBadge");
   const note = document.getElementById("diagnosisNote");
   const confidenceText = document.getElementById("confidenceText");
   const confidenceBar = document.getElementById("confidenceBar");

   badge.textContent = result.stage;
   confidenceText.textContent = `${result.confidence.toFixed(1)}%`;
   confidenceBar.style.width = `${result.confidence.toFixed(1)}%`;

   if (result.confidence < 60) {
      note.textContent = "Ambiguous - adjust inputs.";
   } else {
      note.textContent = "Stage pattern is internally consistent.";
   }
}

function renderStrategyCard(stage) {
   const strategy = STRATEGY_CARD_TEXT[stage];
   const title = document.getElementById("strategyStageTitle");
   const list = document.getElementById("strategyList");

   title.textContent = `${stage} Strategy Card`;
   list.innerHTML = "";

   Object.entries(strategy).forEach(([label, value]) => {
      const li = document.createElement("li");
      li.textContent = `${label}: ${value}`;
      list.appendChild(li);
   });

   if (stage === "Maturity") {
      const li = document.createElement("li");
      li.textContent = "Consistency Check: Heavy acquisition campaigns are inconsistent with maturity-stage economics.";
      list.appendChild(li);
   }
}

function consistencyStatusNumeric(value, target, span) {
   const ratio = Math.abs(value - target) / span;
   if (ratio <= 0.12) {
      return { label: "Green", className: "status-green" };
   }
   if (ratio <= 0.28) {
      return { label: "Amber", className: "status-amber" };
   }
   return { label: "Red", className: "status-red" };
}

function consistencyStatusTrend(inputTrend, targetTrend) {
   const score = trendScore(inputTrend, targetTrend);
   if (score === 100) {
      return { label: "Green", className: "status-green" };
   }
   if (score === 60) {
      return { label: "Amber", className: "status-amber" };
   }
   return { label: "Red", className: "status-red" };
}

function addSummaryRow(tbody, indicator, current, target, status) {
   const tr = document.createElement("tr");
   tr.innerHTML =
      `<td>${indicator}</td>` +
      `<td>${current}</td>` +
      `<td>${target}</td>` +
      `<td class="${status.className}">${status.label}</td>`;
   tbody.appendChild(tr);
}

function renderSummaryTable(inputs, diagnosedStage) {
   const profile = STAGE_PROFILES[diagnosedStage];
   const tbody = document.getElementById("summaryTableBody");
   tbody.innerHTML = "";

   addSummaryRow(
      tbody,
      "Demand Growth Rate",
      `${inputs.growthRatePct > 0 ? "+" : ""}${inputs.growthRatePct}%`,
      `${profile.growthRatePct > 0 ? "+" : ""}${profile.growthRatePct}%`,
      consistencyStatusNumeric(inputs.growthRatePct, profile.growthRatePct, 80)
   );
   addSummaryRow(
      tbody,
      "Trier Percentage",
      `${inputs.triersPct}%`,
      `${profile.triersPct}%`,
      consistencyStatusNumeric(inputs.triersPct, profile.triersPct, 100)
   );
   addSummaryRow(
      tbody,
      "Competitor Count",
      `${inputs.competitors}`,
      `${profile.competitors}`,
      consistencyStatusNumeric(inputs.competitors, profile.competitors, 49)
   );
   addSummaryRow(
      tbody,
      "Gross Margin Trend",
      inputs.grossMarginTrend,
      profile.grossMarginTrend,
      consistencyStatusTrend(inputs.grossMarginTrend, profile.grossMarginTrend)
   );
   addSummaryRow(
      tbody,
      "Marketing Expense Trend",
      inputs.marketingExpenseTrend,
      profile.marketingExpenseTrend,
      consistencyStatusTrend(inputs.marketingExpenseTrend, profile.marketingExpenseTrend)
   );
   addSummaryRow(
      tbody,
      "Price Trend",
      inputs.priceTrend,
      profile.priceTrend,
      consistencyStatusTrend(inputs.priceTrend, profile.priceTrend)
   );
}

function pointsFromSeries(values, chartWidth, chartHeight, leftPad, topPad) {
   const innerW = chartWidth - leftPad - 20;
   const innerH = chartHeight - topPad - 30;
   const stepX = innerW / (values.length - 1);

   return values.map((v, i) => {
      const x = leftPad + i * stepX;
      const y = topPad + innerH - (v / 100) * innerH;
      return { x, y, v };
   });
}

function polylinePoints(points) {
   return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function findPeakIndex(series) {
   let idx = 0;
   for (let i = 1; i < series.length; i += 1) {
      if (series[i] > series[idx]) {
         idx = i;
      }
   }
   return idx;
}

function renderTrajectoryChart(showGp) {
   const chart = document.getElementById("trajectoryChart");
   const width = 920;
   const height = 320;
   const leftPad = 80;
   const topPad = 24;

   const stages = STAGE_ORDER;
   const demandPts = pointsFromSeries(TRAJECTORY_DATA.demand, width, height, leftPad, topPad);
   const nmcPts = pointsFromSeries(TRAJECTORY_DATA.nmc, width, height, leftPad, topPad);
   const gpPts = pointsFromSeries(TRAJECTORY_DATA.gp, width, height, leftPad, topPad);

   const demandPeak = findPeakIndex(TRAJECTORY_DATA.demand);
   const nmcPeak = findPeakIndex(TRAJECTORY_DATA.nmc);

   const axisY = height - 30;
   const lastX = width - 20;

   let svg = "";
   svg += `<svg viewBox=\"0 0 ${width} ${height}\" width=\"100%\" height=\"320\" role=\"img\" aria-label=\"PLC demand and NMC trajectory\">`;
   svg += `<rect x=\"0\" y=\"0\" width=\"${width}\" height=\"${height}\" fill=\"#ffffff\" />`;

   svg += `<line x1=\"${leftPad}\" y1=\"${topPad}\" x2=\"${leftPad}\" y2=\"${axisY}\" stroke=\"#94a3b8\" />`;
   svg += `<line x1=\"${leftPad}\" y1=\"${axisY}\" x2=\"${lastX}\" y2=\"${axisY}\" stroke=\"#94a3b8\" />`;

   [0, 25, 50, 75, 100].forEach((tick) => {
      const y = topPad + (1 - tick / 100) * (axisY - topPad);
      svg += `<line x1=\"${leftPad}\" y1=\"${y}\" x2=\"${lastX}\" y2=\"${y}\" stroke=\"#e2e8f0\" />`;
      svg += `<text x=\"${leftPad - 10}\" y=\"${y + 4}\" text-anchor=\"end\" font-size=\"11\" fill=\"#64748b\">${tick}</text>`;
   });

   stages.forEach((stage, idx) => {
      const x = demandPts[idx].x;
      svg += `<text x=\"${x}\" y=\"${axisY + 16}\" text-anchor=\"middle\" font-size=\"11\" fill=\"#334155\">${stage}</text>`;
   });

   svg += `<polyline fill=\"none\" stroke=\"#334155\" stroke-width=\"3\" points=\"${polylinePoints(demandPts)}\" />`;
   svg += `<polyline fill=\"none\" stroke=\"#0ea5e9\" stroke-width=\"3\" points=\"${polylinePoints(nmcPts)}\" />`;

   if (showGp) {
      svg += `<polyline fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"3\" points=\"${polylinePoints(gpPts)}\" />`;
   }

   svg += `<circle cx=\"${demandPts[demandPeak].x}\" cy=\"${demandPts[demandPeak].y}\" r=\"4\" fill=\"#334155\" />`;
   svg += `<circle cx=\"${nmcPts[nmcPeak].x}\" cy=\"${nmcPts[nmcPeak].y}\" r=\"4\" fill=\"#0ea5e9\" />`;

   svg += `<text x=\"${nmcPts[nmcPeak].x + 8}\" y=\"${nmcPts[nmcPeak].y - 10}\" font-size=\"12\" fill=\"#0284c7\">NMC peak (late growth)</text>`;
   svg += `<text x=\"${demandPts[demandPeak].x + 8}\" y=\"${demandPts[demandPeak].y - 10}\" font-size=\"12\" fill=\"#334155\">Demand peak (maturity)</text>`;
   svg += `</svg>`;

   const legend = `
      <div class="legend">
         <span class="legend-key"><span class="swatch swatch-demand"></span>Demand</span>
         <span class="legend-key"><span class="swatch swatch-nmc"></span>NMC</span>
         <span class="legend-key"><span class="swatch swatch-gp"></span>GP (toggle)</span>
      </div>
   `;

   chart.innerHTML = svg + legend;
}

function updatePresetButtons() {
   document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.preset === state.activePresetKey);
   });
}

function updatePresetInfo() {
   const preset = PRESETS[state.activePresetKey];
   const el = document.getElementById("presetInfo");
   el.textContent = `${preset.label} preset loaded`;
}

function applyPreset(presetKey) {
   const preset = PRESETS[presetKey];
   if (!preset) {
      return;
   }
   state.activePresetKey = presetKey;

   document.getElementById("growthRatePct").value = preset.growthRatePct;
   document.getElementById("competitors").value = preset.competitors;
   document.getElementById("triersPct").value = preset.triersPct;
   document.getElementById("grossMarginTrend").value = preset.grossMarginTrend;
   document.getElementById("marketingExpenseTrend").value = preset.marketingExpenseTrend;
   document.getElementById("priceTrend").value = preset.priceTrend;

   updatePresetButtons();
   updatePresetInfo();
   runDiagnosis();
}

function runDiagnosis() {
   setSliderReadout("growthRatePct", (v) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`);
   setSliderReadout("competitors", (v) => `${v.toFixed(0)}`);
   setSliderReadout("triersPct", (v) => `${v.toFixed(0)}%`);

   const inputs = readInputs();
   const result = diagnose(inputs);

   renderDiagnosis(result);
   renderStrategyCard(result.stage);
   renderSummaryTable(inputs, result.stage);
   renderTrajectoryChart(document.getElementById("showGpOverlay").checked);
}

function bindEvents() {
   document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
   });

   [
      "growthRatePct",
      "competitors",
      "triersPct",
      "grossMarginTrend",
      "marketingExpenseTrend",
      "priceTrend",
   ].forEach((id) => {
      document.getElementById(id).addEventListener("input", runDiagnosis);
      document.getElementById(id).addEventListener("change", runDiagnosis);
   });

   document.getElementById("showGpOverlay").addEventListener("change", runDiagnosis);
   document.getElementById("resetBtn").addEventListener("click", () => applyPreset("introduction"));

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
   applyPreset("introduction");
}

document.addEventListener("DOMContentLoaded", init);