/*
M03 App 3 — Market Share Performance Tree Builder

Purpose:
Students build the MSI -> leakage -> SPI -> SDI chain, then use SDI plus manually entered MDI from App 1 to place a product in the Growth Opportunity Portfolio.

TECH:
- Vanilla HTML/CSS/JS only.
- No persistence.
- Two tabs: Tab A MSI Tree Builder; Tab B SDI & Growth Opportunity Portfolio.
- Must run in Canvas iframe.

TAB A INPUTS:
Current performance sliders, 0–100:
- awarenessPct
- attractivenessPct
- priceAcceptablePct
- intentionsPct
- purchasePct

-----------------------------------------
TAB B INPUTS
-----------------------------------------

// MDI must be manually entered from App 1
// Example from App 1 Narrow preset:
// MDI = 34.2 (NOT 80 — corrected value)
// Students may enter different MDI values depending on scenario
// Do NOT auto-import MDI from App 1 — must be entered manually

- mdiValue (manual user input)
- sdiValue (auto-populated from Tab A)
- productLabel (user text input)

Desired performance sliders, 0–100:
- desiredAwarenessPct
- desiredAttractivenessPct
- desiredPriceAcceptablePct
- desiredIntentionsPct
- desiredPurchasePct

TAB A CORE FORMULAS:
- msi = awareness * attractiveness * priceAcceptable * intentions * purchase
  where each input is used as a decimal.
- spi = desiredAwareness * desiredAttractiveness * desiredPriceAcceptable * desiredIntentions * desiredPurchase
- sdi = (msi / spi) * 100
- leakage at awareness = 100 - awarenessPct
- leakage at later nodes should represent lost percentage points from the prior remaining pool:
  awareness exit = 100 - awareness
  attractiveness exit = awareness * (1 - attractiveness)
  price exit = awareness * attractiveness * (1 - priceAcceptable)
  intentions exit = awareness * attractiveness * priceAcceptable * (1 - intentions)
  purchase exit = awareness * attractiveness * priceAcceptable * intentions * (1 - purchase)

LOCKED PRESETS:
1. Textbook Example:
   current: Aware 45, Attract 75, Price 50, Intend 79, Purchase 75
   desired: Aware 80, Attract 80, Price 60, Intend 80, Purchase 80
   MDI for Tab B: 50
   expected MSI ≈ 10.0%; SPI ≈ 24.6%; SDI ≈ 41

2. Share Growth Scenario:
   current: 55, 80, 60, 83, 80
   desired: 80, 88, 75, 87, 85
   MDI: 65
   quadrant: Share Growth Opportunity

3. Very High Growth Scenario:
   current: 40, 75, 52, 80, 78
   desired: 75, 85, 68, 85, 83
   MDI: 32
   quadrant: Very High Growth

4. Vantara Outdoors:
   current: Aware 38, Attract 82, Price 44, Intend 76, Purchase 78
   desired: Aware 70, Attract 88, Price 56, Intend 80, Purchase 82
   MDI: 66.7
   expected MSI ≈ 10.4%; SDI ≈ 41
   expected largest leakage: Awareness, 62% if using 100 - 38
   NOTE: Spec worksheet text says 52% leakage, but 100 - 38 = 62. Flag this mismatch during QA; do not silently alter math.

TAB A OUTPUTS:
- Live share tree diagram with five nodes and exit paths.
- Running MSI product display.
- Leakage bar chart, sorted largest to smallest, largest highlighted.
- Largest leakage callout.
- MSI badge: green >15%, amber 8–15%, red <8%.
- SPI result after desired inputs.
- SDI gauge 0–100: red <33, amber 33–67, green >67.
- Label: “Record this SDI for Tab B.”

TAB B INPUTS:
- mdiValue: numeric entry manually carried from App 1.
- sdiValue: auto-populated from Tab A, override allowed for scenario testing.
- productLabel: text field.

CROSS-APP DEPENDENCY:
- Do not auto-populate or store MDI from App 1.
- If MDI is blank or zero, show: “Please enter the MDI from App 1 to plot your portfolio position.”

PORTFOLIO QUADRANTS:
Use MDI as y-axis, SDI as x-axis, both 0–100.
Thresholds:
- MDI >= 50 and SDI >= 50: Mature / Selective Growth or defend position.
- MDI >= 50 and SDI < 50: Share Growth Opportunity.
- MDI < 50 and SDI < 50: Very High Growth Opportunity.
- MDI < 50 and SDI >= 50: Market Development Opportunity.
For Vantara: MDI 66.7, SDI ≈ 41 -> Share Growth Opportunity.

TAB B OUTPUTS:
- Growth Opportunity Portfolio plot.
- Product dot at (SDI, MDI).
- Strategy prescription text tied to quadrant and largest leakage node.
- Performance gap table: current vs desired for all five nodes.
- Optional SDI trajectory estimate with advanced toggle.

WORKSHEET EXPECTED LOGIC:
Q1 Vantara:
- report MSI ≈ 10.4%.
- report leakage at all five nodes.
- identify largest leakage node: Awareness.
- recommend action focused on improving awareness.

Q2 Vantara:
- desired performance produces SDI ≈ 41.
- with MDI 66.7, quadrant = Share Growth Opportunity.
- prescription should prioritize share development and connect to awareness leakage.

NON-NEGOTIABLES:
- Do not auto-store MDI from App 1.
- Do not break MSI -> SPI -> SDI dependency.
- Do not change Vantara preset values.
- Flag spec inconsistency: Vantara awareness leakage is listed as 52%, but 100 - 38 = 62%.
- Do not add external libraries.
*/

const NODE_CONFIG = [
   { key: "awarenessPct", label: "Awareness" },
   { key: "attractivenessPct", label: "Attractiveness" },
   { key: "priceAcceptablePct", label: "Price Acceptable" },
   { key: "intentionsPct", label: "Intentions" },
   { key: "purchasePct", label: "Purchase" },
];

const PRESETS = {
   textbook: {
      label: "Textbook Example",
      current: {
         awarenessPct: 45,
         attractivenessPct: 75,
         priceAcceptablePct: 50,
         intentionsPct: 79,
         purchasePct: 75,
      },
      desired: {
         desiredAwarenessPct: 80,
         desiredAttractivenessPct: 80,
         desiredPriceAcceptablePct: 60,
         desiredIntentionsPct: 80,
         desiredPurchasePct: 80,
      },
      mdi: 50,
      productLabel: "Textbook Product",
   },
   shareGrowth: {
      label: "Share Growth Scenario",
      current: {
         awarenessPct: 55,
         attractivenessPct: 80,
         priceAcceptablePct: 60,
         intentionsPct: 83,
         purchasePct: 80,
      },
      desired: {
         desiredAwarenessPct: 80,
         desiredAttractivenessPct: 88,
         desiredPriceAcceptablePct: 75,
         desiredIntentionsPct: 87,
         desiredPurchasePct: 85,
      },
      mdi: 65,
      productLabel: "Share Growth Product",
   },
   veryHighGrowth: {
      label: "Very High Growth Scenario",
      current: {
         awarenessPct: 40,
         attractivenessPct: 75,
         priceAcceptablePct: 52,
         intentionsPct: 80,
         purchasePct: 78,
      },
      desired: {
         desiredAwarenessPct: 75,
         desiredAttractivenessPct: 85,
         desiredPriceAcceptablePct: 68,
         desiredIntentionsPct: 85,
         desiredPurchasePct: 83,
      },
      mdi: 32,
      productLabel: "Very High Growth Product",
   },
   vantara: {
      label: "Vantara Outdoors",
      current: {
         awarenessPct: 38,
         attractivenessPct: 82,
         priceAcceptablePct: 44,
         intentionsPct: 76,
         purchasePct: 78,
      },
      desired: {
         desiredAwarenessPct: 70,
         desiredAttractivenessPct: 88,
         desiredPriceAcceptablePct: 56,
         desiredIntentionsPct: 80,
         desiredPurchasePct: 82,
      },
      mdi: 66.7,
      productLabel: "Vantara Outdoors",
   },
};

const state = {
   activeTab: "tabA",
   activePreset: "textbook",
   manualSdiOverride: false,
   largestLeakageKey: "awarenessPct",
   latestSdi: 0,
};

function toDecimal(pct) {
   return pct / 100;
}

function readCurrentValues() {
   return {
      awarenessPct: parseFloat(document.getElementById("awarenessPct").value),
      attractivenessPct: parseFloat(document.getElementById("attractivenessPct").value),
      priceAcceptablePct: parseFloat(document.getElementById("priceAcceptablePct").value),
      intentionsPct: parseFloat(document.getElementById("intentionsPct").value),
      purchasePct: parseFloat(document.getElementById("purchasePct").value),
   };
}

function readDesiredValues() {
   return {
      desiredAwarenessPct: parseFloat(document.getElementById("desiredAwarenessPct").value),
      desiredAttractivenessPct: parseFloat(document.getElementById("desiredAttractivenessPct").value),
      desiredPriceAcceptablePct: parseFloat(document.getElementById("desiredPriceAcceptablePct").value),
      desiredIntentionsPct: parseFloat(document.getElementById("desiredIntentionsPct").value),
      desiredPurchasePct: parseFloat(document.getElementById("desiredPurchasePct").value),
   };
}

function calculateMsi(current) {
   return (
      toDecimal(current.awarenessPct) *
      toDecimal(current.attractivenessPct) *
      toDecimal(current.priceAcceptablePct) *
      toDecimal(current.intentionsPct) *
      toDecimal(current.purchasePct)
   );
}

function calculateSpi(desired) {
   return (
      toDecimal(desired.desiredAwarenessPct) *
      toDecimal(desired.desiredAttractivenessPct) *
      toDecimal(desired.desiredPriceAcceptablePct) *
      toDecimal(desired.desiredIntentionsPct) *
      toDecimal(desired.desiredPurchasePct)
   );
}

function calculateSdi(msi, spi) {
   if (spi <= 0) {
      return 0;
   }
   return (msi / spi) * 100;
}

function calculateLeakages(current) {
   const a = toDecimal(current.awarenessPct);
   const t = toDecimal(current.attractivenessPct);
   const p = toDecimal(current.priceAcceptablePct);
   const i = toDecimal(current.intentionsPct);
   const u = toDecimal(current.purchasePct);

   return [
      { key: "awarenessPct", label: "Awareness", value: (1 - a) * 100 },
      { key: "attractivenessPct", label: "Attractiveness", value: a * (1 - t) * 100 },
      { key: "priceAcceptablePct", label: "Price Acceptable", value: a * t * (1 - p) * 100 },
      { key: "intentionsPct", label: "Intentions", value: a * t * p * (1 - i) * 100 },
      { key: "purchasePct", label: "Purchase", value: a * t * p * i * (1 - u) * 100 },
   ];
}

function setSliderReadout(id, formatter = (v) => `${v.toFixed(0)}%`) {
   const input = document.getElementById(id);
   const out = document.getElementById(`${id}Value`);
   out.textContent = formatter(parseFloat(input.value));
}

function setAllReadouts() {
   [
      "awarenessPct",
      "attractivenessPct",
      "priceAcceptablePct",
      "intentionsPct",
      "purchasePct",
      "desiredAwarenessPct",
      "desiredAttractivenessPct",
      "desiredPriceAcceptablePct",
      "desiredIntentionsPct",
      "desiredPurchasePct",
   ].forEach((id) => setSliderReadout(id));
}

function renderMsiProduct(current, msi) {
   const calc = document.getElementById("msiProductCalc");
   calc.textContent =
      `${current.awarenessPct}% x ${current.attractivenessPct}% x ${current.priceAcceptablePct}% x ` +
      `${current.intentionsPct}% x ${current.purchasePct}% = ${(msi * 100).toFixed(1)}%`;
}

function renderMsiSpiSdi(msi, spi, sdi) {
   const msiPct = msi * 100;
   document.getElementById("msiValue").textContent = `${msiPct.toFixed(1)}%`;
   document.getElementById("spiValue").textContent = `${(spi * 100).toFixed(1)}%`;
   document.getElementById("sdiValueTabA").textContent = `${sdi.toFixed(1)}`;

   const msiBadge = document.getElementById("msiBadge");
   msiBadge.className = "metric-badge";
   if (msiPct > 15) {
      msiBadge.classList.add("badge-green");
      msiBadge.textContent = "MSI: Strong";
   } else if (msiPct >= 8) {
      msiBadge.classList.add("badge-amber");
      msiBadge.textContent = "MSI: Moderate";
   } else {
      msiBadge.classList.add("badge-red");
      msiBadge.textContent = "MSI: Weak";
   }

   const gaugeFill = document.getElementById("sdiGaugeFill");
   gaugeFill.style.width = `${Math.max(0, Math.min(100, sdi)).toFixed(1)}%`;
   gaugeFill.className = "gauge-fill";
   if (sdi < 33) {
      gaugeFill.classList.add("gauge-red");
   } else if (sdi <= 67) {
      gaugeFill.classList.add("gauge-amber");
   } else {
      gaugeFill.classList.add("gauge-green");
   }
}

function renderShareTree(current, leakages) {
   const tree = document.getElementById("shareTree");
   const a = current.awarenessPct;
   const b = (a * current.attractivenessPct) / 100;
   const c = (b * current.priceAcceptablePct) / 100;
   const d = (c * current.intentionsPct) / 100;
   const e = (d * current.purchasePct) / 100;

   const leakMap = Object.fromEntries(leakages.map((l) => [l.key, l]));

   tree.innerHTML = `
      <div class="tree-row"><span>Awareness pool</span><span>${a.toFixed(1)}%</span><span>Exit ${leakMap.awarenessPct.value.toFixed(1)}%</span></div>
      <div class="tree-row"><span>Attractiveness pool</span><span>${b.toFixed(1)}%</span><span>Exit ${leakMap.attractivenessPct.value.toFixed(1)}%</span></div>
      <div class="tree-row"><span>Price acceptable pool</span><span>${c.toFixed(1)}%</span><span>Exit ${leakMap.priceAcceptablePct.value.toFixed(1)}%</span></div>
      <div class="tree-row"><span>Intentions pool</span><span>${d.toFixed(1)}%</span><span>Exit ${leakMap.intentionsPct.value.toFixed(1)}%</span></div>
      <div class="tree-row"><span>Purchase pool</span><span>${e.toFixed(1)}%</span><span>Exit ${leakMap.purchasePct.value.toFixed(1)}%</span></div>
   `;
}

function renderLeakageChart(leakages) {
   const sorted = [...leakages].sort((x, y) => y.value - x.value);
   const maxVal = sorted[0]?.value || 1;
   const wrap = document.getElementById("leakageBars");
   wrap.innerHTML = "";

   sorted.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = `leak-row${index === 0 ? " leak-max" : ""}`;
      row.innerHTML = `
         <span class="leak-label">${item.label}</span>
         <div class="leak-track"><div class="leak-fill" style="width:${(item.value / maxVal) * 100}%"></div></div>
         <span class="leak-val">${item.value.toFixed(1)}%</span>
      `;
      wrap.appendChild(row);
   });

   const largest = sorted[0];
   state.largestLeakageKey = largest.key;
   document.getElementById("largestLeakageCallout").textContent =
      `Largest leakage: ${largest.label} (${largest.value.toFixed(1)}%).`;
}

function keyToShortLabel(key) {
   const found = NODE_CONFIG.find((n) => n.key === key);
   return found ? found.label : "Awareness";
}

function renderGapTable(current, desired) {
   const body = document.getElementById("gapTableBody");
   body.innerHTML = "";

   const mapDesiredKey = {
      awarenessPct: "desiredAwarenessPct",
      attractivenessPct: "desiredAttractivenessPct",
      priceAcceptablePct: "desiredPriceAcceptablePct",
      intentionsPct: "desiredIntentionsPct",
      purchasePct: "desiredPurchasePct",
   };

   NODE_CONFIG.forEach((node) => {
      const cur = current[node.key];
      const des = desired[mapDesiredKey[node.key]];
      const gap = des - cur;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${node.label}</td><td>${cur.toFixed(1)}%</td><td>${des.toFixed(1)}%</td><td>${gap >= 0 ? "+" : ""}${gap.toFixed(1)} pts</td>`;
      body.appendChild(tr);
   });
}

function evaluateQuadrant(sdi, mdi) {
   if (mdi >= 50 && sdi >= 50) {
      return "Mature / Selective Growth";
   }
   if (mdi >= 50 && sdi < 50) {
      return "Share Growth Opportunity";
   }
   if (mdi < 50 && sdi < 50) {
      return "Very High Growth Opportunity";
   }
   return "Market Development Opportunity";
}

function strategyTextForQuadrant(quadrant, largestLeakageLabel) {
   if (quadrant === "Mature / Selective Growth") {
      return `Defend position and pursue selective growth. Prioritize fixing ${largestLeakageLabel} leakage while protecting profitability.`;
   }
   if (quadrant === "Share Growth Opportunity") {
      return `Prioritize share development in an established market. Focus execution on ${largestLeakageLabel} to convert more of the existing market.`;
   }
   if (quadrant === "Very High Growth Opportunity") {
      return `Growth potential is high but execution is weak. Concentrate on ${largestLeakageLabel} first, then sequence improvements through the tree.`;
   }
   return `Market development is attractive. Expand category participation while improving ${largestLeakageLabel} conversion efficiency.`;
}

function renderPortfolioPlot(sdi, mdi, productLabel) {
   const plot = document.getElementById("portfolioPlot");
   const warning = document.getElementById("mdiWarning");

   if (!mdi || mdi <= 0) {
      warning.textContent = "Please enter the MDI from App 1 to plot your portfolio position.";
      plot.innerHTML = "";
      document.getElementById("quadrantText").textContent = "";
      document.getElementById("prescriptionText").textContent = "";
      return;
   }

   warning.textContent = "";

   const x = Math.max(0, Math.min(100, sdi));
   const y = Math.max(0, Math.min(100, mdi));
   const svgSize = 320;
   const pad = 34;
   const inner = svgSize - pad * 2;
   const px = pad + (x / 100) * inner;
   const py = pad + (1 - y / 100) * inner;

   plot.innerHTML = `
      <svg viewBox="0 0 ${svgSize} ${svgSize}" width="100%" height="320" role="img" aria-label="SDI MDI portfolio plot">
         <rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" fill="#fff" stroke="#cbd5e1" />
         <line x1="${pad + inner / 2}" y1="${pad}" x2="${pad + inner / 2}" y2="${pad + inner}" stroke="#94a3b8" stroke-dasharray="4 4" />
         <line x1="${pad}" y1="${pad + inner / 2}" x2="${pad + inner}" y2="${pad + inner / 2}" stroke="#94a3b8" stroke-dasharray="4 4" />

         <text x="${pad + 6}" y="${pad + 16}" font-size="11" fill="#334155">Market Development</text>
         <text x="${pad + inner / 2 + 6}" y="${pad + 16}" font-size="11" fill="#334155">Mature/Selective</text>
         <text x="${pad + 6}" y="${pad + inner - 8}" font-size="11" fill="#334155">Very High Growth</text>
         <text x="${pad + inner / 2 + 6}" y="${pad + inner - 8}" font-size="11" fill="#334155">Share Growth</text>

         <circle cx="${px}" cy="${py}" r="7" fill="#0f4c81" />
         <text x="${px + 10}" y="${py - 8}" font-size="12" fill="#0f172a">${productLabel}</text>
         <text x="${px + 10}" y="${py + 10}" font-size="11" fill="#334155">(SDI ${x.toFixed(1)}, MDI ${y.toFixed(1)})</text>

         <text x="${svgSize / 2}" y="${svgSize - 6}" text-anchor="middle" font-size="12" fill="#334155">SDI (x-axis)</text>
         <text x="12" y="${svgSize / 2}" transform="rotate(-90 12 ${svgSize / 2})" text-anchor="middle" font-size="12" fill="#334155">MDI (y-axis)</text>
      </svg>
   `;

   const quadrant = evaluateQuadrant(x, y);
   const largestLeakageLabel = keyToShortLabel(state.largestLeakageKey);
   document.getElementById("quadrantText").textContent = `Quadrant: ${quadrant}`;
   document.getElementById("prescriptionText").textContent = strategyTextForQuadrant(quadrant, largestLeakageLabel);
}

function renderSdiTrajectoryEstimate(sdi) {
   const enabled = document.getElementById("showSdiTrajectory").checked;
   const panel = document.getElementById("sdiTrajectoryPanel");
   if (!enabled) {
      panel.innerHTML = "";
      return;
   }

   const y1 = sdi;
   const y2 = Math.min(100, sdi + 8);
   const y3 = Math.min(100, sdi + 14);
   panel.innerHTML = `
      <table class="mini-table">
         <thead><tr><th>Period</th><th>SDI Estimate</th></tr></thead>
         <tbody>
            <tr><td>Current</td><td>${y1.toFixed(1)}</td></tr>
            <tr><td>+1 cycle</td><td>${y2.toFixed(1)}</td></tr>
            <tr><td>+2 cycles</td><td>${y3.toFixed(1)}</td></tr>
         </tbody>
      </table>
   `;
}

function syncTabB() {
   const mdi = parseFloat(document.getElementById("mdiValue").value) || 0;
   const sdiInput = document.getElementById("sdiValue");
   const sdi = parseFloat(sdiInput.value) || 0;
   const productLabel = (document.getElementById("productLabel").value || "Product").trim() || "Product";

   renderPortfolioPlot(sdi, mdi, productLabel);
   renderSdiTrajectoryEstimate(sdi);
}

function runCalculations() {
   setAllReadouts();

   const current = readCurrentValues();
   const desired = readDesiredValues();

   const msi = calculateMsi(current);
   const spi = calculateSpi(desired);
   const sdi = calculateSdi(msi, spi);
   state.latestSdi = sdi;

   const leakages = calculateLeakages(current);

   renderMsiProduct(current, msi);
   renderMsiSpiSdi(msi, spi, sdi);
   renderShareTree(current, leakages);
   renderLeakageChart(leakages);
   renderGapTable(current, desired);

   if (!state.manualSdiOverride) {
      document.getElementById("sdiValue").value = sdi.toFixed(1);
   }

   syncTabB();
}

function applyPreset(key) {
   const preset = PRESETS[key];
   if (!preset) {
      return;
   }
   state.activePreset = key;
   state.manualSdiOverride = false;

   Object.entries(preset.current).forEach(([id, value]) => {
      document.getElementById(id).value = value;
   });
   Object.entries(preset.desired).forEach(([id, value]) => {
      document.getElementById(id).value = value;
   });

   document.getElementById("mdiValue").value = preset.mdi;
   document.getElementById("productLabel").value = preset.productLabel;

   document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.preset === key);
   });
   document.getElementById("presetInfo").textContent = `${preset.label} preset loaded.`;

   runCalculations();
}

function setActiveTab(tabId) {
   state.activeTab = tabId;
   document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
   });
   document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === tabId);
   });
}

function bindEvents() {
   document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
   });

   document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyPreset(btn.dataset.preset));
   });

   [
      "awarenessPct",
      "attractivenessPct",
      "priceAcceptablePct",
      "intentionsPct",
      "purchasePct",
      "desiredAwarenessPct",
      "desiredAttractivenessPct",
      "desiredPriceAcceptablePct",
      "desiredIntentionsPct",
      "desiredPurchasePct",
   ].forEach((id) => {
      document.getElementById(id).addEventListener("input", runCalculations);
   });

   document.getElementById("mdiValue").addEventListener("input", syncTabB);
   document.getElementById("productLabel").addEventListener("input", syncTabB);
   document.getElementById("sdiValue").addEventListener("input", () => {
      state.manualSdiOverride = true;
      syncTabB();
   });
   document.getElementById("syncSdiBtn").addEventListener("click", () => {
      state.manualSdiOverride = false;
      document.getElementById("sdiValue").value = state.latestSdi.toFixed(1);
      syncTabB();
   });
   document.getElementById("showSdiTrajectory").addEventListener("change", syncTabB);

   document.getElementById("resetBtn").addEventListener("click", () => applyPreset("textbook"));

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
   setActiveTab("tabA");
   applyPreset("textbook");

   // Developer note: Earlier worksheet notes listing Vantara MSI ~10.4, SDI ~45.9, or awareness leakage 52%
   // are superseded by locked formulas + locked preset values; current calculation is authoritative.
}

document.addEventListener("DOMContentLoaded", init);