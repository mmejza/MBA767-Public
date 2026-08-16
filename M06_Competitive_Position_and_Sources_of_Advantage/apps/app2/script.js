/*
M06 APP 2 SOURCE OF TRUTH — INDUSTRY ATTRACTIVENESS SCORER

Build this app exactly from the M06 App Specifications document.

CORE PURPOSE:
Students score the six Porter forces and learn that force direction matters. Higher scores must always mean more favorable industry conditions in the final IAI.

IAI FORMULA:
- IAI = (Entry Barriers + Exit Barriers + Customer Buying Power + Supplier Selling Power + Product Substitutes + Competitive Rivalry) / 6
- Display IAI to 1 decimal place.

IMPORTANT SCORING INTERPRETATION:
The slider score itself represents attractiveness contribution, not raw force intensity.

DIRECTION RULES:
- Entry Barriers:
  Higher score = more attractive
  High entry barriers protect incumbents from new entrants.

- Exit Barriers:
  Higher raw exit barriers are less attractive.
  Therefore positive attractiveness scores should represent LOW exit barriers.
  High exit barriers trap weak competitors and suppress margins.

- Customer Buying Power:
  Higher raw buyer power is less attractive.
  Positive attractiveness scores represent LOW buyer power.

- Supplier Selling Power:
  Higher raw supplier power is less attractive.
  Positive attractiveness scores represent LOW supplier power.

- Product Substitutes:
  More substitutes are less attractive.
  Positive attractiveness scores represent FEW substitutes.

- Competitive Rivalry:
  More rivalry is less attractive.
  Positive attractiveness scores represent LOW rivalry.

CLASSIFICATION RULES:
- IAI > 50 = Attractive
- IAI 0 to 50 = Above Average
- IAI -25 to less than 0 = Below Average
- IAI < -25 = Unattractive
BOUNDARIES:
- IAI = 0 is Above Average
- IAI = -25 is Below Average, not Unattractive

INVESTMENT RECOMMENDATIONS:
- Attractive: INVEST
- Above Average: HOLD / SELECTIVELY INVEST
- Below Average: HARVEST
- Unattractive: EXIT / DIVEST

REQUIRED PRESET VALIDATION:
- Pharmaceutical:
  Entry +80, Exit -10, Buyer -15, Supplier +20, Substitutes +70, Rivalry +10
  IAI = 25.8
  Classification = Above Average

- Personal Computer:
  Entry -40, Exit -20, Buyer -60, Supplier -30, Substitutes -50, Rivalry -70
  IAI = -45.0
  Classification = Unattractive

EDGE CASES:
- All forces at 0:
  IAI = 0
  Classification = Above Average
  But show no investment recommendation until at least one slider has moved.
- Industry B may calculate before being named, but prompt user to name it before comparison.
- Exit barriers positive warning:
  Show warning that high exit barriers reduce attractiveness and that positive score should mean low exit barriers.

GLOBAL:
- All outputs update live on input change.
- All calculations are client-side only.
- No external API calls.
- If app behavior conflicts with the spec, the spec wins.
*/

(function initIndustryAttractivenessScorer() {
  const FORCES = [
    {
      key: "entry",
      name: "Entry Barriers",
      leftLabel: "Low barriers = less attractive",
      rightLabel: "High barriers = more attractive"
    },
    {
      key: "exit",
      name: "Exit Barriers",
      leftLabel: "High barriers = less attractive",
      rightLabel: "Low barriers = more attractive"
    },
    {
      key: "buyer",
      name: "Customer Buying Power",
      leftLabel: "High power = less attractive",
      rightLabel: "Low power = more attractive"
    },
    {
      key: "supplier",
      name: "Supplier Selling Power",
      leftLabel: "High power = less attractive",
      rightLabel: "Low power = more attractive"
    },
    {
      key: "substitutes",
      name: "Product Substitutes",
      leftLabel: "Many substitutes = less attractive",
      rightLabel: "Few substitutes = more attractive"
    },
    {
      key: "rivalry",
      name: "Competitive Rivalry",
      leftLabel: "High rivalry = less attractive",
      rightLabel: "Low rivalry = more attractive"
    }
  ];

  const PRESETS = {
    pharmaceutical: {
      entry: 80,
      exit: -10,
      buyer: -15,
      supplier: 20,
      substitutes: 70,
      rivalry: 10
    },
    "personal-computer": {
      entry: -40,
      exit: -20,
      buyer: -60,
      supplier: -30,
      substitutes: -50,
      rivalry: -70
    }
  };

  const state = {
    movedA: false,
    movedB: false
  };

  const els = {
    focusModeBtn: document.querySelector("#focusModeBtn"),
    inputsA: document.querySelector("#inputs-a"),
    inputsB: document.querySelector("#inputs-b"),
    enableB: document.querySelector("#enable-b"),
    industryBCard: document.querySelector("#industry-b-card"),
    resultB: document.querySelector("#result-b"),
    comparisonRow: document.querySelector("#comparison-row"),
    nameA: document.querySelector("#name-a"),
    nameB: document.querySelector("#name-b"),
    nameBPrompt: document.querySelector("#name-b-prompt"),
    titleA: document.querySelector("#title-a"),
    titleB: document.querySelector("#title-b"),
    iaiA: document.querySelector("#iai-a"),
    iaiB: document.querySelector("#iai-b"),
    classA: document.querySelector("#class-a"),
    classB: document.querySelector("#class-b"),
    sumA: document.querySelector("#sum-a"),
    sumB: document.querySelector("#sum-b"),
    recA: document.querySelector("#rec-a"),
    recB: document.querySelector("#rec-b"),
    compareLine: document.querySelector("#compare-line"),
    presetA: document.querySelector("#preset-a"),
    presetB: document.querySelector("#preset-b"),
    radarA: document.querySelector("#radar-a"),
    radarB: document.querySelector("#radar-b")
  };

  function round1(value) {
    return Math.round(value * 10) / 10;
  }

  function fmt(value) {
    return round1(value).toFixed(1);
  }

  function forceToken(force, value) {
    const short = {
      entry: "Entry",
      exit: "Exit",
      buyer: "Buyer",
      supplier: "Supplier",
      substitutes: "Substitutes",
      rivalry: "Rivalry"
    };
    const sign = value >= 0 ? "+" : "";
    return short[force.key] + " " + sign + value;
  }

  function classifyIAI(iai) {
    if (iai > 50) {
      return "Attractive";
    }
    if (iai >= 0) {
      return "Above Average";
    }
    if (iai >= -25) {
      return "Below Average";
    }
    return "Unattractive";
  }

  function recommendationFor(classification, hasMoved) {
    if (!hasMoved) {
      return "Move at least one slider to generate an investment recommendation.";
    }

    if (classification === "Attractive") {
      return "INVEST";
    }
    if (classification === "Above Average") {
      return "HOLD / SELECTIVELY INVEST";
    }
    if (classification === "Below Average") {
      return "HARVEST";
    }
    return "EXIT / DIVEST";
  }

  function iaiClassName(classification) {
    if (classification === "Attractive") {
      return "iai-attractive";
    }
    if (classification === "Above Average") {
      return "iai-above";
    }
    if (classification === "Below Average") {
      return "iai-below";
    }
    return "iai-unattractive";
  }

  function createForceItem(force, group) {
    const row = document.createElement("div");
    row.className = "force-item";

    const top = document.createElement("div");
    top.className = "force-top";

    const name = document.createElement("h3");
    name.className = "force-name";
    name.textContent = force.name;

    const value = document.createElement("span");
    value.className = "force-value";
    value.id = force.key + "-value-" + group;
    value.textContent = "+0";

    top.appendChild(name);
    top.appendChild(value);

    const direction = document.createElement("div");
    direction.className = "direction-row";

    const left = document.createElement("span");
    left.className = "direction-left active";
    left.id = force.key + "-left-" + group;
    left.textContent = force.leftLabel;

    const mid = document.createElement("span");
    mid.className = "direction-mid";
    mid.textContent = "0";

    const right = document.createElement("span");
    right.className = "direction-right";
    right.id = force.key + "-right-" + group;
    right.textContent = force.rightLabel;

    direction.appendChild(left);
    direction.appendChild(mid);
    direction.appendChild(right);

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "-100";
    slider.max = "100";
    slider.step = "1";
    slider.value = "0";
    slider.id = force.key + "-" + group;
    slider.dataset.forceKey = force.key;
    slider.dataset.group = group;

    row.appendChild(top);
    row.appendChild(direction);
    row.appendChild(slider);

    if (force.key === "exit") {
      const warning = document.createElement("p");
      warning.className = "exit-warning";
      warning.textContent = "High exit barriers trap money-losing competitors and reduce attractiveness. Positive exit scores should represent LOW exit barriers.";
      row.appendChild(warning);
    }

    return row;
  }

  function buildInputs() {
    FORCES.forEach(function addForce(force) {
      els.inputsA.appendChild(createForceItem(force, "a"));
      els.inputsB.appendChild(createForceItem(force, "b"));
    });
  }

  function sliderValue(forceKey, group) {
    const node = document.querySelector("#" + forceKey + "-" + group);
    return Number(node.value);
  }

  function setDirectionActive(forceKey, group, value) {
    const left = document.querySelector("#" + forceKey + "-left-" + group);
    const right = document.querySelector("#" + forceKey + "-right-" + group);
    if (!left || !right) {
      return;
    }

    if (value < 0) {
      left.classList.add("active");
      right.classList.remove("active");
    } else if (value > 0) {
      left.classList.remove("active");
      right.classList.add("active");
    } else {
      left.classList.add("active");
      right.classList.add("active");
    }
  }

  function readIndustry(group) {
    const values = FORCES.map(function mapForce(force) {
      return {
        ...force,
        value: sliderValue(force.key, group)
      };
    });

    const sum = values.reduce(function reduceTotal(total, item) {
      return total + item.value;
    }, 0);
    const iai = round1(sum / 6);
    const classification = classifyIAI(iai);
    const moved = group === "a" ? state.movedA : state.movedB;

    return {
      values,
      sum,
      iai,
      classification,
      recommendation: recommendationFor(classification, moved),
      moved
    };
  }

  function renderIndustry(group, result) {
    const nameValue = group === "a" ? els.nameA.value.trim() : els.nameB.value.trim();
    const displayName = nameValue || (group === "a" ? "Industry A" : "Industry B");

    const title = group === "a" ? els.titleA : els.titleB;
    const iaiNode = group === "a" ? els.iaiA : els.iaiB;
    const classNode = group === "a" ? els.classA : els.classB;
    const sumNode = group === "a" ? els.sumA : els.sumB;
    const recNode = group === "a" ? els.recA : els.recB;

    title.textContent = displayName;
    iaiNode.textContent = fmt(result.iai);
    iaiNode.className = "iai-value " + iaiClassName(result.classification);
    classNode.textContent = result.classification;

    sumNode.textContent = "Running sum: " + result.values.map(function mapToken(item) {
      return forceToken(item, item.value);
    }).join(", ");

    recNode.textContent = "Recommendation: " + result.recommendation;
    recNode.classList.toggle("pending", !result.moved);

    if (group === "b") {
      els.nameBPrompt.textContent = nameValue
        ? ""
        : "Industry B is unnamed. Add a name for clearer comparison, but scoring is active.";
    }

    result.values.forEach(function setDisplayValue(item) {
      const valueNode = document.querySelector("#" + item.key + "-value-" + group);
      const sign = item.value >= 0 ? "+" : "";
      valueNode.textContent = sign + item.value;
      setDirectionActive(item.key, group, item.value);
    });
  }

  function drawRadar(canvas, values) {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const outer = Math.min(w, h) * 0.38;
    const axes = values.length;

    ctx.clearRect(0, 0, w, h);

    function levelRadius(levelFromNegativeToPositive) {
      const normalized = (levelFromNegativeToPositive + 100) / 200;
      return normalized * outer;
    }

    function drawPolygon(level, color, lineWidth) {
      ctx.beginPath();
      for (let i = 0; i < axes; i += 1) {
        const angle = (-Math.PI / 2) + (i * 2 * Math.PI / axes);
        const x = cx + Math.cos(angle) * levelRadius(level);
        const y = cy + Math.sin(angle) * levelRadius(level);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    [-100, -50, 0, 50, 100].forEach(function drawScaleRing(level) {
      const isZero = level === 0;
      drawPolygon(level, isZero ? "#7d93a1" : "#c7d9e4", isZero ? 2 : 1);
    });

    for (let i = 0; i < axes; i += 1) {
      const angle = (-Math.PI / 2) + (i * 2 * Math.PI / axes);
      const x = cx + Math.cos(angle) * outer;
      const y = cy + Math.sin(angle) * outer;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#c3d5e0";
      ctx.lineWidth = 1;
      ctx.stroke();

      const labelX = cx + Math.cos(angle) * (outer + 16);
      const labelY = cy + Math.sin(angle) * (outer + 16);
      ctx.fillStyle = "#3b5563";
      ctx.font = "12px Avenir Next";
      ctx.textAlign = labelX < cx - 6 ? "right" : (labelX > cx + 6 ? "left" : "center");
      ctx.textBaseline = labelY < cy - 4 ? "bottom" : (labelY > cy + 4 ? "top" : "middle");
      ctx.fillText(values[i].name.split(" ")[0], labelX, labelY);
    }

    ctx.beginPath();
    for (let i = 0; i < axes; i += 1) {
      const angle = (-Math.PI / 2) + (i * 2 * Math.PI / axes);
      const scaled = levelRadius(values[i].value);
      const x = cx + Math.cos(angle) * scaled;
      const y = cy + Math.sin(angle) * scaled;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(32, 123, 174, 0.20)";
    ctx.strokeStyle = "#207bae";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
  }

  function renderComparison(resultA, resultB) {
    const enabled = els.enableB.checked;
    els.industryBCard.hidden = !enabled;
    els.resultB.hidden = !enabled;
    els.comparisonRow.hidden = !enabled;

    if (!enabled) {
      return;
    }

    const nameA = els.nameA.value.trim() || "Industry A";
    const nameB = els.nameB.value.trim() || "Industry B (unnamed)";
    els.compareLine.textContent = nameA + ": " + fmt(resultA.iai) + " (" + resultA.classification + ", " +
      resultA.recommendation + ") vs " + nameB + ": " + fmt(resultB.iai) + " (" +
      resultB.classification + ", " + resultB.recommendation + ")";
  }

  function applyPreset(group, presetName) {
    const preset = PRESETS[presetName];
    if (!preset) {
      return;
    }

    FORCES.forEach(function setForce(force) {
      const slider = document.querySelector("#" + force.key + "-" + group);
      slider.value = String(preset[force.key]);
    });

    if (group === "a") {
      state.movedA = true;
    } else {
      state.movedB = true;
    }

    updateAll();
  }

  function updateAll() {
    const resultA = readIndustry("a");
    const resultB = readIndustry("b");

    renderIndustry("a", resultA);
    renderIndustry("b", resultB);

    drawRadar(els.radarA, resultA.values);
    if (els.enableB.checked) {
      drawRadar(els.radarB, resultB.values);
    }

    renderComparison(resultA, resultB);
  }

  function wireEvents() {
    document.querySelectorAll("input[type='range']").forEach(function wireSlider(slider) {
      slider.addEventListener("input", function onSlide(event) {
        if (event.target.dataset.group === "a") {
          state.movedA = true;
        } else {
          state.movedB = true;
        }
        updateAll();
      });
    });

    [els.nameA, els.nameB, els.enableB].forEach(function wireCommon(node) {
      node.addEventListener("input", updateAll);
      node.addEventListener("change", updateAll);
    });

    els.presetA.addEventListener("change", function onPresetA(event) {
      applyPreset("a", event.target.value);
    });

    els.presetB.addEventListener("change", function onPresetB(event) {
      applyPreset("b", event.target.value);
    });

    if (els.focusModeBtn) {
      els.focusModeBtn.addEventListener("click", function onFocusToggle() {
        const enabled = document.body.classList.toggle("focus-mode");
        els.focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
        els.focusModeBtn.setAttribute("aria-pressed", String(enabled));
      });
    }
  }

  buildInputs();
  wireEvents();
  updateAll();
})();