/*
===============================================================================
MKT 472 · MODULE 04 · APP 3
CONJOINT ANALYSIS CVI SIMULATOR
===============================================================================

PURPOSE
Build a client-side interactive app that helps students calculate Customer Value
Index (CVI) scores from conjoint preference values and compare customer-value
ranking against firm-profitability ranking.

PEDAGOGICAL GOAL
Students develop fluency with conjoint preference curves and CVI scoring.
The app must surface the paradox that the higher-CVI strategy is not always the
more profitable strategy.

SYSTEM REQUIREMENTS
- Vanilla HTML, CSS, and JavaScript.
- Chart.js via CDN is acceptable.
- Fully client-side.
- No localStorage.
- No cookies.
- No server calls.
- No Canvas API.
- Must embed cleanly in Canvas iframe.
- Responsive down to 320px.
- Keyboard accessible.
- ARIA labels on all controls, alerts, and charts where appropriate.

CORE FORMULA
CVI = sum of selected preference values across all attributes.

For each strategy:
CVI_A = selected preference value for Attribute 1
      + selected preference value for Attribute 2
      + selected preference value for Attribute 3
      + selected preference value for Attribute 4

CVI_B calculated the same way.

DEFAULT ATTRIBUTES
1. Labor Savings
2. Product Warranty
3. Price Premium
4. Customer Callbacks

DEFAULT LEVELS AND VALUES — SILENT FLOOR PRESET

Labor Savings:
- None = 0.17
- 20% = 0.33
- 40% = 1.00

Product Warranty:
- None = 0.25
- 5 years = 0.42
- 10 years = 0.83

Price Premium:
- Competitive = 1.00
- +20% = 0.50
- +40% = 0.00
- Also support +30% = 0.25 for Worksheet Q2 interpolation.

Customer Callbacks:
- None = 0.83
- Some = 0.42
- Frequent = 0.25

DEFAULT STRATEGY A — SILENT FLOOR
- Labor Savings: 40% → 1.00
- Product Warranty: 10 years → 0.83
- Price Premium: +40% → 0.00
- Customer Callbacks: None → 0.83
Expected CVI_A = 2.66
Price premium = +40%

DEFAULT STRATEGY B — SILENT FLOOR
- Labor Savings: 40% → 1.00
- Product Warranty: 5 years → 0.42
- Price Premium: +20% → 0.50
- Customer Callbacks: None → 0.83
Expected CVI_B = 2.75
Price premium = +20%

DEFAULT STRATEGIC RESULT
- Strategy B has higher CVI: 2.75 > 2.66.
- Strategy A is more profitable because it has the higher price premium:
  +40% vs +20%.
- The app must clearly explain that customer value and firm profitability are
  related but not identical.

INPUTS
- Editable attribute labels, max 30 characters.
- Editable level labels, max 20 characters.
- Editable preference values from 0.00 to 1.00, step 0.01.
- Strategy A level selection dropdown for each attribute.
- Strategy B level selection dropdown for each attribute.
- Strategy A price premium input, 0% to 100%, step 5%.
- Strategy B price premium input, 0% to 100%, step 5%.
- Preset selector: Silent Floor / Reset.

OUTPUTS
1. Four preference-curve charts:
   - One chart per attribute.
   - X-axis = attribute levels.
   - Y-axis = preference value from 0 to 1.
   - Update live when labels or values change.

2. CVI outputs:
   - CVI_A displayed to two decimals.
   - CVI_B displayed to two decimals.
   - Higher-CVI strategy identified clearly.

3. CVI comparison chart:
   - Side-by-side horizontal bars for Strategy A and Strategy B.
   - Label the higher-CVI strategy:
     "This strategy delivers more customer value."

4. Profitability flag:
   Always display after price premiums are entered:
   "Higher CVI strategy is highlighted above. But which generates more margin
   for the firm? Compare price premiums: Strategy A: [X]% Strategy B: [Y]% →
   The strategy with the higher price premium generates more revenue per unit.
   Are these the same strategy?"

5. Value-driver display:
   For each strategy, identify the selected attribute level contributing the
   largest preference value.
   Format:
   "Value driver: [attribute name] → [level label] → [preference value]"

6. Strategic interpretation panel:
   Explain whether the higher-CVI strategy and higher-profitability strategy
   are the same or different.

WORKSHEET Q1 EXPECTED DEFAULTS
- CVI_A = 2.66
- CVI_B = 2.75
- Strategy B delivers more customer value.
- Strategy A is more profitable due to higher price premium.
- They are not the same strategy.

WORKSHEET Q2 SUPPORT
Starting from Silent Floor:
- Modify Strategy B price premium from +20% to +30%.
- Modify Strategy B warranty from 5 years to 10 years.
- Use interpolated +30% preference value = 0.25.
Expected modified CVI_B:
1.00 + 0.83 + 0.25 + 0.83 = 2.91
Strategy B still has higher CVI than Strategy A.
Strategy A still has higher price premium, +40% vs +30%.

ROUNDING
- CVI values to two decimals.
- Preference values to two decimals.
- Percentages to one decimal if needed.

VALIDATION
- Preference values must stay between 0.00 and 1.00.
- Price premiums must stay between 0% and 100%.
- Empty labels should fallback to generic labels.
- CVI must update live after any change.

DO NOT
- Do not include worksheet answer keys as hidden panels.
- Do not persist student data.
- Do not call Canvas APIs.
- Do not use external frameworks.
- Do not require server access.

FILES
- index.html
- styles.css
- script.js

===============================================================================
*/

"use strict";

(function () {
  var MAX_ATTR_LABEL = 30;
  var MAX_LEVEL_LABEL = 20;

  var state = {
    attributes: [],
    focusMode: false,
    strategyA: {
      selections: [],
      pricePremium: 40
    },
    strategyB: {
      selections: [],
      pricePremium: 20
    },
    charts: {
      pref: [],
      cvi: null
    }
  };

  var silentFloorPreset = {
    attributes: [
      {
        id: "labor",
        defaultLabel: "Labor Savings",
        label: "Labor Savings",
        levels: [
          { defaultLabel: "None", label: "None", value: 0.17 },
          { defaultLabel: "20%", label: "20%", value: 0.33 },
          { defaultLabel: "40%", label: "40%", value: 1.0 }
        ]
      },
      {
        id: "warranty",
        defaultLabel: "Product Warranty",
        label: "Product Warranty",
        levels: [
          { defaultLabel: "None", label: "None", value: 0.25 },
          { defaultLabel: "5 years", label: "5 years", value: 0.42 },
          { defaultLabel: "10 years", label: "10 years", value: 0.83 }
        ]
      },
      {
        id: "price",
        defaultLabel: "Price Premium",
        label: "Price Premium",
        levels: [
          { defaultLabel: "Competitive", label: "Competitive", value: 1.0 },
          { defaultLabel: "+20%", label: "+20%", value: 0.5 },
          { defaultLabel: "+30%", label: "+30%", value: 0.25 },
          { defaultLabel: "+40%", label: "+40%", value: 0.0 }
        ]
      },
      {
        id: "callbacks",
        defaultLabel: "Customer Callbacks",
        label: "Customer Callbacks",
        levels: [
          { defaultLabel: "None", label: "None", value: 0.83 },
          { defaultLabel: "Some", label: "Some", value: 0.42 },
          { defaultLabel: "Frequent", label: "Frequent", value: 0.25 }
        ]
      }
    ],
    strategyASelections: [2, 2, 3, 0],
    strategyBSelections: [2, 1, 1, 0],
    strategyAPrice: 40,
    strategyBPrice: 20
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyPreset();
    bindPresetControls();
    bindFocusMode();
    buildEditor();
    buildStrategyControls();
    initCharts();
    updateAll();
  }

  function bindFocusMode() {
    var focusBtn = document.getElementById("focus-mode-btn");
    var status = document.getElementById("focus-mode-status");

    if (!focusBtn || !status) {
      return;
    }

    focusBtn.addEventListener("click", function () {
      state.focusMode = !state.focusMode;
      document.body.classList.toggle("focus-mode", state.focusMode);
      focusBtn.textContent = state.focusMode ? "Exit Focus Mode" : "Focus Mode";
      focusBtn.setAttribute("aria-label", state.focusMode ? "Exit focus mode" : "Enter focus mode");
      status.textContent = state.focusMode ? "Focus mode on" : "Focus mode off";
    });
  }

  function deepCopyPresetAttributes() {
    return silentFloorPreset.attributes.map(function (attr) {
      return {
        id: attr.id,
        defaultLabel: attr.defaultLabel,
        label: attr.label,
        levels: attr.levels.map(function (lvl) {
          return {
            defaultLabel: lvl.defaultLabel,
            label: lvl.label,
            value: lvl.value
          };
        })
      };
    });
  }

  function applyPreset() {
    state.attributes = deepCopyPresetAttributes();
    state.strategyA.selections = silentFloorPreset.strategyASelections.slice();
    state.strategyB.selections = silentFloorPreset.strategyBSelections.slice();
    state.strategyA.pricePremium = silentFloorPreset.strategyAPrice;
    state.strategyB.pricePremium = silentFloorPreset.strategyBPrice;
  }

  function bindPresetControls() {
    var applyBtn = document.getElementById("apply-preset-btn");
    var resetBtn = document.getElementById("reset-btn");

    applyBtn.addEventListener("click", function () {
      applyPreset();
      buildEditor();
      buildStrategyControls();
      resetCharts();
      updateAll();
    });

    resetBtn.addEventListener("click", function () {
      applyPreset();
      buildEditor();
      buildStrategyControls();
      resetCharts();
      updateAll();
    });
  }

  function buildEditor() {
    var container = document.getElementById("attribute-editor");
    container.innerHTML = "";

    state.attributes.forEach(function (attr, attrIndex) {
      var card = document.createElement("article");
      card.className = "attribute-card";

      var header = document.createElement("div");
      header.className = "attribute-header";

      var heading = document.createElement("h3");
      heading.textContent = "Attribute " + (attrIndex + 1);
      header.appendChild(heading);

      var attrLabelInput = document.createElement("input");
      attrLabelInput.type = "text";
      attrLabelInput.maxLength = MAX_ATTR_LABEL;
      attrLabelInput.value = attr.label;
      attrLabelInput.setAttribute("aria-label", "Attribute " + (attrIndex + 1) + " label");
      attrLabelInput.addEventListener("input", function (event) {
        state.attributes[attrIndex].label = event.target.value;
        buildStrategyControls();
        updateAll();
      });
      header.appendChild(attrLabelInput);

      card.appendChild(header);

      var tableWrap = document.createElement("div");
      tableWrap.className = "levels-table-wrap";

      var table = document.createElement("table");
      table.className = "levels-table";

      var thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>Level Label</th><th>Preference Value (0-1)</th></tr>";
      table.appendChild(thead);

      var tbody = document.createElement("tbody");

      attr.levels.forEach(function (lvl, levelIndex) {
        var row = document.createElement("tr");

        var labelCell = document.createElement("td");
        var labelInput = document.createElement("input");
        labelInput.type = "text";
        labelInput.maxLength = MAX_LEVEL_LABEL;
        labelInput.value = lvl.label;
        labelInput.setAttribute(
          "aria-label",
          getDisplayAttributeLabel(attr, attrIndex) + " level " + (levelIndex + 1) + " label"
        );
        labelInput.addEventListener("input", function (event) {
          state.attributes[attrIndex].levels[levelIndex].label = event.target.value;
          buildStrategyControls();
          updateAll();
        });
        labelCell.appendChild(labelInput);

        var valueCell = document.createElement("td");
        var valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.min = "0";
        valueInput.max = "1";
        valueInput.step = "0.01";
        valueInput.value = toTwo(lvl.value);
        valueInput.setAttribute(
          "aria-label",
          getDisplayAttributeLabel(attr, attrIndex) + " level " + (levelIndex + 1) + " preference value"
        );
        valueInput.addEventListener("input", function (event) {
          var bounded = clampNumber(parseFloat(event.target.value), 0, 1);
          state.attributes[attrIndex].levels[levelIndex].value = bounded;
          event.target.value = Number.isFinite(bounded) ? toTwo(bounded) : "0.00";
          updateAll();
        });
        valueCell.appendChild(valueInput);

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      tableWrap.appendChild(table);
      card.appendChild(tableWrap);
      container.appendChild(card);
    });
  }

  function buildStrategyControls() {
    var containerA = document.getElementById("strategy-a-controls");
    var containerB = document.getElementById("strategy-b-controls");
    containerA.innerHTML = "";
    containerB.innerHTML = "";

    state.attributes.forEach(function (attr, attrIndex) {
      containerA.appendChild(createStrategyRow("A", attr, attrIndex));
      containerB.appendChild(createStrategyRow("B", attr, attrIndex));
    });

    var priceA = document.getElementById("strategy-a-price");
    var priceB = document.getElementById("strategy-b-price");

    priceA.value = String(state.strategyA.pricePremium);
    priceB.value = String(state.strategyB.pricePremium);

    priceA.oninput = function (event) {
      var bounded = clampNumber(parseFloat(event.target.value), 0, 100);
      state.strategyA.pricePremium = bounded;
      event.target.value = Number.isFinite(bounded) ? String(bounded) : "0";
      updateAll();
    };

    priceB.oninput = function (event) {
      var bounded = clampNumber(parseFloat(event.target.value), 0, 100);
      state.strategyB.pricePremium = bounded;
      event.target.value = Number.isFinite(bounded) ? String(bounded) : "0";
      updateAll();
    };
  }

  function createStrategyRow(strategyKey, attr, attrIndex) {
    var row = document.createElement("div");
    row.className = "strategy-row";

    var label = document.createElement("label");
    var attrName = getDisplayAttributeLabel(attr, attrIndex);
    label.textContent = attrName;

    var select = document.createElement("select");
    select.setAttribute("aria-label", "Strategy " + strategyKey + " level selection for " + attrName);

    attr.levels.forEach(function (lvl, levelIndex) {
      var option = document.createElement("option");
      option.value = String(levelIndex);
      option.textContent = getDisplayLevelLabel(lvl, levelIndex);
      select.appendChild(option);
    });

    var selectionArray = strategyKey === "A" ? state.strategyA.selections : state.strategyB.selections;
    if (!Number.isInteger(selectionArray[attrIndex])) {
      selectionArray[attrIndex] = 0;
    }
    if (selectionArray[attrIndex] > attr.levels.length - 1) {
      selectionArray[attrIndex] = 0;
    }
    select.value = String(selectionArray[attrIndex]);

    select.addEventListener("change", function (event) {
      selectionArray[attrIndex] = parseInt(event.target.value, 10);
      updateAll();
    });

    row.appendChild(label);
    row.appendChild(select);
    return row;
  }

  function initCharts() {
    var prefGrid = document.getElementById("pref-chart-grid");
    prefGrid.innerHTML = "";
    state.charts.pref = [];

    state.attributes.forEach(function (attr, attrIndex) {
      var chartCard = document.createElement("article");
      chartCard.className = "chart-card";

      var title = document.createElement("h3");
      title.id = "pref-title-" + attr.id;
      title.textContent = getDisplayAttributeLabel(attr, attrIndex);
      chartCard.appendChild(title);

      var wrap = document.createElement("div");
      wrap.className = "chart-wrap";
      var canvas = document.createElement("canvas");
      canvas.id = "pref-chart-" + attr.id;
      canvas.setAttribute("aria-label", "Preference curve chart for " + getDisplayAttributeLabel(attr, attrIndex));
      canvas.setAttribute("role", "img");
      wrap.appendChild(canvas);
      chartCard.appendChild(wrap);

      var summary = document.createElement("p");
      summary.id = "pref-summary-" + attr.id;
      summary.className = "chart-summary";
      summary.setAttribute("aria-live", "polite");
      chartCard.appendChild(summary);

      prefGrid.appendChild(chartCard);

      var ctx = canvas.getContext("2d");
      var prefChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: attr.levels.map(function (lvl, levelIndex) {
            return getDisplayLevelLabel(lvl, levelIndex);
          }),
          datasets: [
            {
              label: "Preference",
              data: attr.levels.map(function (lvl) {
                return lvl.value;
              }),
              borderColor: "#0f4c81",
              backgroundColor: "#bfdbfe",
              tension: 0.2,
              fill: false,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 1,
              title: {
                display: true,
                text: "Preference"
              }
            },
            x: {
              title: {
                display: true,
                text: "Level"
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      state.charts.pref.push(prefChart);
    });

    var cviCtx = document.getElementById("cvi-chart").getContext("2d");
    state.charts.cvi = new Chart(cviCtx, {
      type: "bar",
      data: {
        labels: ["Strategy A", "Strategy B"],
        datasets: [
          {
            label: "CVI",
            data: [0, 0],
            backgroundColor: ["#93c5fd", "#86efac"],
            borderColor: ["#1d4ed8", "#15803d"],
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: 0,
            max: 4,
            title: {
              display: true,
              text: "CVI"
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  function resetCharts() {
    state.charts.pref.forEach(function (chart) {
      chart.destroy();
    });
    if (state.charts.cvi) {
      state.charts.cvi.destroy();
    }
    initCharts();
  }

  function updateAll() {
    var cviA = calculateCVI("A");
    var cviB = calculateCVI("B");

    setText("cvi-a", toTwo(cviA));
    setText("cvi-b", toTwo(cviB));

    var higherCVI = getHigherStrategy(cviA, cviB);
    var higherPrice = getHigherStrategy(state.strategyA.pricePremium, state.strategyB.pricePremium);
    var rankingMatch = higherCVI === higherPrice && higherCVI !== "Tie";

    setText("higher-cvi", higherCVI === "Tie" ? "Tie" : "Strategy " + higherCVI);
    setText("higher-price", higherPrice === "Tie" ? "Tie" : "Strategy " + higherPrice);
    setText("ranking-match", rankingMatch ? "Yes" : "No");

    updateValueDrivers();
    updateProfitabilityFlag(higherCVI);
    updateInterpretation(higherCVI, higherPrice);
    updatePreferenceCharts();
    updateCviChart(cviA, cviB, higherCVI);
  }

  function calculateCVI(strategyKey) {
    var selections = strategyKey === "A" ? state.strategyA.selections : state.strategyB.selections;
    var total = 0;

    state.attributes.forEach(function (attr, attrIndex) {
      var levelIdx = selections[attrIndex] || 0;
      var level = attr.levels[levelIdx];
      total += Number.isFinite(level.value) ? level.value : 0;
    });

    return total;
  }

  function getHigherStrategy(a, b) {
    if (Math.abs(a - b) < 1e-9) {
      return "Tie";
    }
    return a > b ? "A" : "B";
  }

  function updateValueDrivers() {
    var bestA = getValueDriver("A");
    var bestB = getValueDriver("B");

    setText(
      "value-driver-a",
      "Value driver: " + bestA.attribute + " -> " + bestA.level + " -> " + toTwo(bestA.value)
    );
    setText(
      "value-driver-b",
      "Value driver: " + bestB.attribute + " -> " + bestB.level + " -> " + toTwo(bestB.value)
    );
  }

  function getValueDriver(strategyKey) {
    var selections = strategyKey === "A" ? state.strategyA.selections : state.strategyB.selections;
    var best = {
      attribute: "-",
      level: "-",
      value: -1
    };

    state.attributes.forEach(function (attr, attrIndex) {
      var levelIdx = selections[attrIndex] || 0;
      var level = attr.levels[levelIdx];
      var val = Number.isFinite(level.value) ? level.value : 0;
      if (val > best.value) {
        best = {
          attribute: getDisplayAttributeLabel(attr, attrIndex),
          level: getDisplayLevelLabel(level, levelIdx),
          value: val
        };
      }
    });

    return best;
  }

  function updateProfitabilityFlag(higherCVI) {
    var priceA = formatPercent(state.strategyA.pricePremium);
    var priceB = formatPercent(state.strategyB.pricePremium);

    var text =
      "Higher CVI strategy is highlighted above. But which generates more margin for the firm? Compare price premiums: Strategy A: " +
      priceA +
      "% Strategy B: " +
      priceB +
      "% -> The strategy with the higher price premium generates more revenue per unit. Are these the same strategy?";

    if (higherCVI === "A" || higherCVI === "B") {
      text = "Strategy " + higherCVI + " has the higher CVI. " + text;
    }

    setText("profitability-flag", text);
  }

  function updateInterpretation(higherCVI, higherPrice) {
    var panel = document.getElementById("interpretation");
    var text;

    if (higherCVI === "Tie" && higherPrice === "Tie") {
      text =
        "Both strategies are tied on customer value and price premium. There is no current paradox between value ranking and profitability ranking.";
    } else if (higherCVI === higherPrice && higherCVI !== "Tie") {
      text =
        "Strategy " +
        higherCVI +
        " leads on both customer value (CVI) and price premium. In this setup, value leadership and profitability leadership are aligned.";
    } else {
      if (higherCVI === "B" && higherPrice === "A") {
        text =
          "Strategy B delivers more customer value, but Strategy A is more profitable because it carries the higher price premium. This is the core conjoint paradox: the strategy customers value most is not always the strategy that produces the highest margin per unit.";
      } else if (higherCVI === "A" && higherPrice === "B") {
        text =
          "Strategy A delivers more customer value, but Strategy B has the higher price premium. This indicates a gap between perceived value leadership and per-unit revenue capture.";
      } else {
        text =
          "Customer-value ranking and price-premium ranking are not the same. This signals a strategic tradeoff between perceived value and per-unit revenue.";
      }
    }

    panel.textContent = text;
  }

  function updatePreferenceCharts() {
    state.attributes.forEach(function (attr, attrIndex) {
      var chart = state.charts.pref[attrIndex];
      if (!chart) {
        return;
      }

      chart.data.labels = attr.levels.map(function (lvl, levelIndex) {
        return getDisplayLevelLabel(lvl, levelIndex);
      });
      chart.data.datasets[0].data = attr.levels.map(function (lvl) {
        return lvl.value;
      });
      chart.options.plugins.title = {
        display: true,
        text: getDisplayAttributeLabel(attr, attrIndex)
      };
      chart.update();

      var summary = document.getElementById("pref-summary-" + attr.id);
      var parts = attr.levels.map(function (lvl, levelIndex) {
        return getDisplayLevelLabel(lvl, levelIndex) + ": " + toTwo(lvl.value);
      });
      summary.textContent = getDisplayAttributeLabel(attr, attrIndex) + " preference values -> " + parts.join(", ");

      var titleEl = document.getElementById("pref-title-" + attr.id);
      titleEl.textContent = getDisplayAttributeLabel(attr, attrIndex);
    });
  }

  function updateCviChart(cviA, cviB, higherCVI) {
    if (!state.charts.cvi) {
      return;
    }

    var cviChart = state.charts.cvi;
    cviChart.data.datasets[0].data = [cviA, cviB];

    var barColors = ["#93c5fd", "#86efac"];
    if (higherCVI === "A") {
      barColors = ["#2563eb", "#bbf7d0"];
    } else if (higherCVI === "B") {
      barColors = ["#bfdbfe", "#16a34a"];
    }
    cviChart.data.datasets[0].backgroundColor = barColors;
    cviChart.update();

    var note = document.getElementById("cvi-chart-note");
    if (higherCVI === "Tie") {
      note.textContent = "Both strategies are tied on customer value.";
    } else {
      note.textContent = "Strategy " + higherCVI + ": This strategy delivers more customer value.";
    }

    setText(
      "cvi-chart-summary",
      "CVI chart summary -> Strategy A: " +
        toTwo(cviA) +
        ", Strategy B: " +
        toTwo(cviB) +
        "."
    );
  }

  function getDisplayAttributeLabel(attr, attrIndex) {
    var candidate = sanitizeLabel(attr.label, MAX_ATTR_LABEL);
    if (candidate) {
      return candidate;
    }
    if (attr.defaultLabel) {
      return attr.defaultLabel;
    }
    return "Attribute " + (attrIndex + 1);
  }

  function getDisplayLevelLabel(level, levelIndex) {
    var candidate = sanitizeLabel(level.label, MAX_LEVEL_LABEL);
    if (candidate) {
      return candidate;
    }
    if (level.defaultLabel) {
      return level.defaultLabel;
    }
    return "Level " + (levelIndex + 1);
  }

  function sanitizeLabel(value, maxLength) {
    if (typeof value !== "string") {
      return "";
    }
    var trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    return trimmed.slice(0, maxLength);
  }

  function clampNumber(value, min, max) {
    if (!Number.isFinite(value)) {
      return min;
    }
    if (value < min) {
      return min;
    }
    if (value > max) {
      return max;
    }
    return value;
  }

  function toTwo(value) {
    return Number(value).toFixed(2);
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) {
      return "0";
    }
    var rounded = Math.round(value * 10) / 10;
    if (Math.abs(rounded - Math.round(rounded)) < 1e-9) {
      return String(Math.round(rounded));
    }
    return rounded.toFixed(1);
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    el.textContent = text;
  }
})();
