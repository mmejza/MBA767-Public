"use strict";

(function () {
  var state = {
    activeTab: "A",
    focusMode: false,
    signAcknowledged: false,
    weights: {
      product: 0.6,
      service: 0.3,
      brand: 0.1
    },
    data: {},
    results: {
      A: null,
      B: null,
      C: null,
      D: null,
      opi: null,
      cpi: null,
      pcv: null,
      zone: null,
      inference: null
    },
    validity: {
      A: false,
      B: false,
      C: false,
      D: false,
      OPIWeights: true
    },
    chart: null
  };

  var defaults = {
    A: [
      { name: "Machine Uptime", importance: 40, business: 8, compA: 7, compB: 5, compC: 6 },
      { name: "Print Speed", importance: 30, business: 9, compA: 8, compB: 5, compC: 5 },
      { name: "Image Quality", importance: 20, business: 7, compA: 7, compB: 7, compC: 6 },
      { name: "Ease of Use", importance: 10, business: 4, compA: 6, compB: 7, compC: 6 }
    ],
    B: [
      { name: "Responsiveness", importance: 40, business: 5, compA: 7, compB: 5, compC: 4 },
      { name: "Technical Support", importance: 30, business: 8, compA: 6, compB: 8, compC: 9 },
      { name: "Resolution Quality", importance: 20, business: 6, compA: 8, compB: 6, compC: 5 },
      { name: "Availability", importance: 10, business: 7, compA: 7, compB: 8, compC: 6 }
    ],
    C: [
      { name: "Trustworthiness", importance: 40, business: 9, compA: 7, compB: 6, compC: 8 },
      { name: "Innovation", importance: 30, business: 8, compA: 6, compB: 6, compC: 7 },
      { name: "Social Responsibility", importance: 20, business: 5, compA: 7, compB: 5, compC: 4 },
      { name: "Market Visibility", importance: 10, business: 7, compA: 7, compB: 8, compC: 6 }
    ],
    D: [
      { name: "Purchase Price", importance: 40, business: 7, compA: 8, compB: 5, compC: 5 },
      { name: "Service & Repair", importance: 30, business: 5, compA: 6, compB: 7, compC: 6 },
      { name: "Toner", importance: 20, business: 5, compA: 8, compB: 7, compC: 5 },
      { name: "Paper", importance: 10, business: 6, compA: 6, compB: 5, compC: 5 }
    ]
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    state.data = {
      A: cloneRows(defaults.A),
      B: cloneRows(defaults.B),
      C: cloneRows(defaults.C),
      D: cloneRows(defaults.D)
    };

    buildTable("A", "tbody-a");
    buildTable("B", "tbody-b");
    buildTable("C", "tbody-c");
    buildTable("D", "tbody-d");

    bindTabEvents();
    bindWeightEvents();
    bindSignCheckButton();
    bindFocusMode();
    initChart();

    recalculateAll();
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

  function cloneRows(rows) {
    return rows.map(function (row) {
      return {
        name: row.name,
        importance: row.importance,
        business: row.business,
        compA: row.compA,
        compB: row.compB,
        compC: row.compC
      };
    });
  }

  function buildTable(tabKey, tbodyId) {
    var tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    state.data[tabKey].forEach(function (row, rowIndex) {
      var tr = document.createElement("tr");

      var attrCell = document.createElement("td");
      attrCell.textContent = row.name;
      tr.appendChild(attrCell);

      tr.appendChild(createInputCell(tabKey, rowIndex, "importance", row.importance, "Importance", 0, 100, 0.1));
      tr.appendChild(createInputCell(tabKey, rowIndex, "business", row.business, "Business rating", 0, 10, 0.1));
      tr.appendChild(createInputCell(tabKey, rowIndex, "compA", row.compA, "Competitor A rating", 0, 10, 0.1));
      tr.appendChild(createInputCell(tabKey, rowIndex, "compB", row.compB, "Competitor B rating", 0, 10, 0.1));
      tr.appendChild(createInputCell(tabKey, rowIndex, "compC", row.compC, "Competitor C rating", 0, 10, 0.1));

      var raCell = document.createElement("td");
      raCell.className = "ra-cell";
      raCell.id = tabKey + "-ra-" + rowIndex;
      raCell.textContent = "-";
      tr.appendChild(raCell);

      tbody.appendChild(tr);
    });
  }

  function createInputCell(tabKey, rowIndex, field, value, label, min, max, step) {
    var td = document.createElement("td");
    var input = document.createElement("input");

    input.type = "number";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    input.setAttribute("aria-label", tabKey + " row " + (rowIndex + 1) + " " + label);
    input.addEventListener("input", function (event) {
      var parsed = parseNumber(event.target.value);
      state.data[tabKey][rowIndex][field] = parsed;
      if (tabKey === "D") {
        state.signAcknowledged = false;
      }
      recalculateAll();
    });

    td.appendChild(input);
    return td;
  }

  function bindTabEvents() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".tab-button"));
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (!button.disabled) {
          activateTab(button.getAttribute("data-tab"));
        }
      });

      button.addEventListener("keydown", function (event) {
        var enabledButtons = buttons.filter(function (btn) {
          return !btn.disabled;
        });

        if (enabledButtons.length === 0) {
          return;
        }

        var currentIndex = enabledButtons.indexOf(document.activeElement);
        if (currentIndex < 0) {
          currentIndex = 0;
        }

        var handled = true;
        var nextIndex = currentIndex;

        if (event.key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % enabledButtons.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + enabledButtons.length) % enabledButtons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = enabledButtons.length - 1;
        } else if (event.key === "Enter" || event.key === " ") {
          activateTab(button.getAttribute("data-tab"));
          return;
        } else {
          handled = false;
        }

        if (handled) {
          event.preventDefault();
          enabledButtons[nextIndex].focus();
        }
      });
    });
  }

  function activateTab(tabKey) {
    state.activeTab = tabKey;

    var panels = Array.prototype.slice.call(document.querySelectorAll(".tabpanel"));
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".tab-button"));

    panels.forEach(function (panel) {
      panel.classList.add("hidden");
      panel.hidden = true;
    });

    buttons.forEach(function (btn) {
      btn.classList.remove("is-active");
      btn.setAttribute("aria-selected", "false");
      btn.setAttribute("tabindex", "-1");
    });

    var activePanel = document.getElementById("panel-" + tabKey.toLowerCase());
    var activeButton = document.querySelector('.tab-button[data-tab="' + tabKey + '"]');

    if (activePanel && activeButton) {
      activePanel.classList.remove("hidden");
      activePanel.hidden = false;
      activeButton.classList.add("is-active");
      activeButton.setAttribute("aria-selected", "true");
      activeButton.setAttribute("tabindex", "0");
      activeButton.focus();
    }
  }

  function bindWeightEvents() {
    var productInput = document.getElementById("weight-product");
    var serviceInput = document.getElementById("weight-service");
    var brandInput = document.getElementById("weight-brand");

    productInput.addEventListener("input", function (event) {
      state.weights.product = parseNumber(event.target.value);
      recalculateAll();
    });

    serviceInput.addEventListener("input", function (event) {
      state.weights.service = parseNumber(event.target.value);
      recalculateAll();
    });

    brandInput.addEventListener("input", function (event) {
      state.weights.brand = parseNumber(event.target.value);
      recalculateAll();
    });
  }

  function bindSignCheckButton() {
    var button = document.getElementById("ack-sign-btn");
    button.addEventListener("click", function () {
      state.signAcknowledged = true;
      recalculateAll();
    });
  }

  function parseNumber(value) {
    if (value === null || value === undefined || value === "") {
      return NaN;
    }
    var n = Number(value);
    return Number.isFinite(n) ? n : NaN;
  }

  function isFiniteRow(row) {
    return (
      Number.isFinite(row.importance) &&
      Number.isFinite(row.business) &&
      Number.isFinite(row.compA) &&
      Number.isFinite(row.compB) &&
      Number.isFinite(row.compC)
    );
  }

  function comparisonPoints(importance, difference) {
    if (difference >= 2) {
      return importance;
    }
    if (difference <= -2) {
      return -importance;
    }
    if (Math.abs(difference) <= 1) {
      return 0;
    }
    return 0;
  }

  function formatValue(value) {
    if (!Number.isFinite(value)) {
      return "-";
    }
    var nearestInt = Math.round(value);
    if (Math.abs(value - nearestInt) < 1e-9) {
      return String(nearestInt);
    }
    return value.toFixed(1);
  }

  function calculateTable(tabKey) {
    var rows = state.data[tabKey];
    var totalImportance = 0;
    var allRowsComplete = true;
    var rowRAs = [];

    rows.forEach(function (row) {
      if (!isFiniteRow(row)) {
        allRowsComplete = false;
        rowRAs.push(NaN);
        return;
      }

      totalImportance += row.importance;

      var scoreA = comparisonPoints(row.importance, row.business - row.compA);
      var scoreB = comparisonPoints(row.importance, row.business - row.compB);
      var scoreC = comparisonPoints(row.importance, row.business - row.compC);

      var rawRA = (scoreA + scoreB + scoreC) / 3;
      rowRAs.push(rawRA);
    });

    var importanceValid = allRowsComplete && Math.abs(totalImportance - 100) < 1e-9;
    var subindex = null;

    if (importanceValid) {
      var totalRA = rowRAs.reduce(function (sum, val) {
        return sum + val;
      }, 0);
      subindex = 100 + totalRA;
    }

    return {
      totalImportance: totalImportance,
      allRowsComplete: allRowsComplete,
      importanceValid: importanceValid,
      rowRAs: rowRAs,
      subindex: subindex
    };
  }

  function updateTableUI(tabKey, result, ids) {
    var totalEl = document.getElementById(ids.totalId);
    var validationEl = document.getElementById(ids.validationId);
    var valueEl = document.getElementById(ids.valueId);
    var cardEl = document.getElementById(ids.cardId);

    totalEl.textContent = formatValue(result.totalImportance);

    state.data[tabKey].forEach(function (_row, index) {
      var raEl = document.getElementById(tabKey + "-ra-" + index);
      raEl.textContent = Number.isFinite(result.rowRAs[index]) ? formatValue(result.rowRAs[index]) : "-";
    });

    if (!result.allRowsComplete) {
      validationEl.textContent = "Enter numeric values in all fields.";
      validationEl.classList.remove("hidden");
      valueEl.textContent = "-";
      cardEl.setAttribute("aria-disabled", "true");
    } else if (!result.importanceValid) {
      validationEl.textContent = "Importance weights must sum to 100. Current total: " + formatValue(result.totalImportance) + ".";
      validationEl.classList.remove("hidden");
      valueEl.textContent = "-";
      cardEl.setAttribute("aria-disabled", "true");
    } else {
      validationEl.textContent = "";
      validationEl.classList.add("hidden");
      valueEl.textContent = formatValue(result.subindex);
      cardEl.setAttribute("aria-disabled", "false");
    }

    state.validity[tabKey] = result.importanceValid;
    state.results[tabKey] = result.subindex;
  }

  function validateOPIWeights() {
    var validationEl = document.getElementById("opi-validation");
    var opiCard = document.getElementById("opi-card");
    var opiValueEl = document.getElementById("opi-value");

    var product = state.weights.product;
    var service = state.weights.service;
    var brand = state.weights.brand;

    var allFinite = Number.isFinite(product) && Number.isFinite(service) && Number.isFinite(brand);
    var sum = allFinite ? product + service + brand : NaN;
    var valid = allFinite && Math.abs(sum - 1) < 1e-9;

    state.validity.OPIWeights = valid;

    if (!allFinite) {
      validationEl.textContent = "Enter numeric values for all OPI weights.";
      validationEl.classList.remove("hidden");
      opiCard.setAttribute("aria-disabled", "true");
      opiValueEl.textContent = "-";
      state.results.opi = null;
      return;
    }

    if (!valid) {
      validationEl.textContent = "OPI weights must sum to 1.0. Current total: " + sum.toFixed(2) + ".";
      validationEl.classList.remove("hidden");
      opiCard.setAttribute("aria-disabled", "true");
      opiValueEl.textContent = "-";
      state.results.opi = null;
      return;
    }

    validationEl.textContent = "";
    validationEl.classList.add("hidden");

    if (Number.isFinite(state.results.A) && Number.isFinite(state.results.B) && Number.isFinite(state.results.C)) {
      var opi = state.results.A * product + state.results.B * service + state.results.C * brand;
      state.results.opi = opi;
      opiValueEl.textContent = formatValue(opi);
      opiCard.setAttribute("aria-disabled", "false");
    } else {
      state.results.opi = null;
      opiValueEl.textContent = "-";
      opiCard.setAttribute("aria-disabled", "true");
    }
  }

  function updateTabLocks() {
    var tabB = document.getElementById("tab-b");
    var tabC = document.getElementById("tab-c");
    var tabD = document.getElementById("tab-d");
    var lockMessage = document.getElementById("tab-lock-message");

    var lockNotes = [];

    var bUnlocked = state.validity.A;
    tabB.disabled = !bUnlocked;
    tabB.setAttribute("aria-disabled", String(!bUnlocked));
    if (!bUnlocked) {
      lockNotes.push("Tab B locked: complete Tab A with importance weights totaling 100.");
    }

    var cUnlocked = state.validity.B;
    tabC.disabled = !cUnlocked;
    tabC.setAttribute("aria-disabled", String(!cUnlocked));
    if (!cUnlocked) {
      lockNotes.push("Tab C locked: complete Tab B with importance weights totaling 100.");
    }

    var dUnlocked = state.validity.C && state.validity.OPIWeights;
    tabD.disabled = !dUnlocked;
    tabD.setAttribute("aria-disabled", String(!dUnlocked));
    if (!dUnlocked) {
      lockNotes.push("Tab D locked: complete Tab C and ensure OPI weights sum to 1.0.");
    }

    lockMessage.textContent = lockNotes.length ? lockNotes.join(" ") : "All tabs unlocked.";

    if (state.activeTab === "B" && !bUnlocked) {
      activateTab("A");
    } else if (state.activeTab === "C" && !cUnlocked) {
      activateTab("B");
    } else if (state.activeTab === "D" && !dUnlocked) {
      activateTab("C");
    }
  }

  function updateTabDOutputs(resultD) {
    var signPanel = document.getElementById("sign-check-panel");
    var signBadge = document.getElementById("sign-badge");
    var outputRow = document.getElementById("tabd-output-row");
    var cpiEl = document.getElementById("cpi-value");
    var pcvEl = document.getElementById("pcv-value");

    var dValid = state.validity.D;
    var opi = state.results.opi;
    var cpi = Number.isFinite(state.results.D) ? state.results.D : null;

    var hasPositiveCostRA = false;
    if (dValid) {
      hasPositiveCostRA = resultD.rowRAs.some(function (val) {
        return Number.isFinite(val) && val > 0;
      });
    }

    if (!dValid || !Number.isFinite(opi) || !Number.isFinite(cpi)) {
      signPanel.classList.add("hidden");
      signBadge.classList.add("hidden");
      outputRow.classList.remove("hidden");
      cpiEl.textContent = Number.isFinite(cpi) ? formatValue(cpi) : "-";
      pcvEl.textContent = "-";
      state.results.cpi = Number.isFinite(cpi) ? cpi : null;
      state.results.pcv = null;
      state.results.zone = null;
      state.results.inference = null;
      return;
    }

    state.results.cpi = cpi;

    if (hasPositiveCostRA && !state.signAcknowledged) {
      signPanel.classList.remove("hidden");
      outputRow.classList.add("hidden");
      signBadge.classList.add("hidden");
      state.results.pcv = null;
      state.results.zone = null;
      state.results.inference = null;
      return;
    }

    signPanel.classList.add("hidden");
    outputRow.classList.remove("hidden");
    if (hasPositiveCostRA && state.signAcknowledged) {
      signBadge.classList.remove("hidden");
    } else {
      signBadge.classList.add("hidden");
    }

    var pcv = opi - cpi;
    state.results.pcv = pcv;
    state.results.zone = classifyZone(pcv);
    state.results.inference = buildInference(pcv, state.results.zone);

    cpiEl.textContent = formatValue(cpi);
    pcvEl.textContent = formatValue(pcv);
  }

  function classifyZone(pcv) {
    if (!Number.isFinite(pcv)) {
      return null;
    }
    if (pcv > 0) {
      return "Superior";
    }
    if (pcv < 0) {
      return "Inferior";
    }
    return "Fair";
  }

  function buildInference(pcv, zone) {
    if (!Number.isFinite(pcv) || !zone) {
      return "PCV Index of - -> - value zone -> - average profitability expected.";
    }

    var profitabilityWord = "equal";
    if (zone === "Superior") {
      profitabilityWord = "above";
    } else if (zone === "Inferior") {
      profitabilityWord = "below";
    }

    return (
      "PCV Index of " +
      formatValue(pcv) +
      " -> " +
      zone +
      " value zone -> " +
      profitabilityWord +
      " average profitability expected."
    );
  }

  function updateSummary() {
    setText("sum-ppi", state.results.A);
    setText("sum-sqi", state.results.B);
    setText("sum-bri", state.results.C);
    setText("sum-opi", state.results.opi);
    setText("sum-cpi", state.results.cpi);
    setText("sum-pcv", state.results.pcv);

    var zoneEl = document.getElementById("zone-value");
    var inferenceEl = document.getElementById("inference-text");

    zoneEl.textContent = state.results.zone ? state.results.zone : "-";
    inferenceEl.textContent = state.results.inference
      ? state.results.inference
      : "PCV Index of - -> - value zone -> - average profitability expected.";
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    el.textContent = Number.isFinite(value) ? formatValue(value) : "-";
  }

  function recalculateAll() {
    var resultA = calculateTable("A");
    var resultB = calculateTable("B");
    var resultC = calculateTable("C");
    var resultD = calculateTable("D");

    updateTableUI("A", resultA, {
      totalId: "a-total",
      validationId: "a-validation",
      valueId: "ppi-value",
      cardId: "ppi-card"
    });

    updateTableUI("B", resultB, {
      totalId: "b-total",
      validationId: "b-validation",
      valueId: "sqi-value",
      cardId: "sqi-card"
    });

    updateTableUI("C", resultC, {
      totalId: "c-total",
      validationId: "c-validation",
      valueId: "bri-value",
      cardId: "bri-card"
    });

    updateTableUI("D", resultD, {
      totalId: "d-total",
      validationId: "d-validation",
      valueId: "cpi-value",
      cardId: "cpi-card"
    });

    validateOPIWeights();
    updateTabLocks();
    updateTabDOutputs(resultD);
    updateSummary();
    updateChart();
  }

  function initChart() {
    var canvas = document.getElementById("value-map-chart");
    var ctx = canvas.getContext("2d");

    state.chart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            type: "line",
            label: "Fair Value Reference (OPI = CPI)",
            data: [{ x: 0, y: 0 }, { x: 200, y: 200 }],
            borderColor: "#0c4a6e",
            borderDash: [6, 6],
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: "Company",
            data: [],
            borderColor: "#166534",
            backgroundColor: "#16a34a",
            pointRadius: 6,
            pointHoverRadius: 7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        plugins: {
          legend: {
            position: "top"
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return "CPI: " + formatValue(ctx.raw.x) + ", OPI: " + formatValue(ctx.raw.y);
              }
            }
          }
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: 200,
            title: {
              display: true,
              text: "CPI"
            },
            ticks: {
              stepSize: 20
            }
          },
          y: {
            min: 0,
            max: 200,
            title: {
              display: true,
              text: "OPI"
            },
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });
  }

  function updateChart() {
    if (!state.chart) {
      return;
    }

    var opi = state.results.opi;
    var cpi = state.results.cpi;
    var showPoint = Number.isFinite(opi) && Number.isFinite(cpi) && Number.isFinite(state.results.pcv);

    if (showPoint) {
      var maxBase = Math.max(160, opi, cpi);
      var minBase = Math.min(40, opi, cpi);
      var padding = 15;
      var min = Math.max(0, Math.floor(minBase - padding));
      var max = Math.ceil(maxBase + padding);

      state.chart.data.datasets[0].data = [{ x: min, y: min }, { x: max, y: max }];
      state.chart.data.datasets[1].data = [{ x: cpi, y: opi }];
      state.chart.options.scales.x.min = min;
      state.chart.options.scales.x.max = max;
      state.chart.options.scales.y.min = min;
      state.chart.options.scales.y.max = max;
    } else {
      state.chart.data.datasets[0].data = [{ x: 0, y: 0 }, { x: 200, y: 200 }];
      state.chart.data.datasets[1].data = [];
      state.chart.options.scales.x.min = 0;
      state.chart.options.scales.x.max = 200;
      state.chart.options.scales.y.min = 0;
      state.chart.options.scales.y.max = 200;
    }

    state.chart.update();
  }
})();
