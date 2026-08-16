/*
===============================================================================
M07 APP 1 — POSITIONING MAPPER
SOURCE OF TRUTH — DO NOT DEVIATE FROM THIS SPEC
===============================================================================

APP PURPOSE
This app teaches operational fluency with:
1. Customer Value Hierarchy (CVH)
2. Points of Parity / Points of Differentiation (POPs/PODs)

The app is embedded in Canvas via iframe and runs entirely client-side.
No external APIs.
No localStorage.
Vanilla HTML/CSS/JS preferred.

===============================================================================
GLOBAL UI RULES
===============================================================================

COLOR TOKENS
- Teal: #0D9B87
- Navy: #0F2027
- Amber: #E6A800
- Light Gray: #F2F4F5

FONT
- system-ui or Barlow

RESPONSIVE TARGETS
- 800px
- 1024px
- 1280px

TAB SYSTEM
- Horizontal tabs
- Active tab has teal underline
- Inactive tabs gray
- JS-controlled state

ERROR HANDLING
- Never expose raw JS errors
- Graceful inline messages only

===============================================================================
TAB A — CUSTOMER VALUE HIERARCHY CLASSIFIER
===============================================================================

PURPOSE
Students classify attributes into the 5 CVH levels.

CVH LEVELS
1. Core Benefit
2. Generic Product
3. Expected Product
4. Augmented Product
5. Potential Product

PREFERRED UI
- Drag-and-drop pyramid

FALLBACK UI
- Radio button classification groups

VALIDATION
- Validation occurs ONLY after clicking:
  "Check My Classification"

DO NOT validate during dragging.

===============================================================================
PRODUCT PRESETS
===============================================================================

DROPDOWN OPTIONS
- Electric Vehicle
- Athletic Shoe
- Streaming Service
- Smartphone
- Coffee Shop
- Raincoat Instructor Example

Each preset pre-populates 5 attributes.

===============================================================================
ELECTRIC VEHICLE PRESET — HARDLOCKED ANSWER KEY
===============================================================================

ATTRIBUTE 1
Text:
"Transportation from A to B"

Correct Level:
Core Benefit

Explanation:
"The fundamental need the product serves. An EV without this is not a product."

-------------------------------------------------------------------------------

ATTRIBUTE 2
Text:
"Electric drivetrain (no gas)"

Correct Level:
Expected Product

Explanation:
"Customers purchasing an EV expect this by definition. Not a differentiator in this category."

-------------------------------------------------------------------------------

ATTRIBUTE 3
Text:
"Over-the-air software updates"

Correct Level:
Augmented Product

Explanation:
"Beyond baseline expectations — adds value and loyalty, but not required for purchase satisfaction."

-------------------------------------------------------------------------------

ATTRIBUTE 4
Text:
"Vehicle-to-grid energy export"

Correct Level:
Potential Product

Explanation:
"Not yet standard or expected. Future value if technology and infrastructure develop."

-------------------------------------------------------------------------------

ATTRIBUTE 5
Text:
"300+ mile range"

SPECIAL CASE:
Accept BOTH:
- Expected Product
- Augmented Product

Explanation:
"Currently augmented but trending toward expected by 2026-27."

THIS IS AN INTENTIONAL AMBIGUITY.
DO NOT mark one as wrong if the other is selected.

===============================================================================
RAINCOAT INSTRUCTOR EXAMPLE
===============================================================================

PRELOAD THESE:
- Core = protection from rain
- Expected = waterproof seams
- Augmented = breathable lining
- Potential = solar-charging panel

===============================================================================
TAB B — POPs / PODs ANALYZER
===============================================================================

PURPOSE
Students compare two brands and identify:
- POPs (shared attributes)
- PODs (unique attributes)

INPUTS
- Brand A name
- Brand B name
- 3 attributes for Brand A
- 3 attributes for Brand B

NO VALIDATION ON BRAND NAMES.

===============================================================================
CLASSIFICATION LOGIC
===============================================================================

POPs
- Exact matches
- Near-exact matches
- Shared concepts

PODs
- Unique to one brand only

IMPLEMENT:
- Basic normalization
- Lowercase comparison
- Trim whitespace

OPTIONAL:
- Simple fuzzy similarity

===============================================================================
OUTPUT — VENN DIAGRAM
===============================================================================

Render:
- Left circle = Brand A PODs
- Overlap = POPs
- Right circle = Brand B PODs

SVG preferred.

===============================================================================
POSITIONING GAP OUTPUT
===============================================================================

Generate editable summary text:

"Brand A differentiates on [X]. Brand B differentiates on [Y].
Both share [Z] as category requirements."

Student may edit before copying.

===============================================================================
CRITICAL RULES
===============================================================================

- No auto-grading logic in Tab B
- No hidden scoring
- No external libraries required
- No backend
- All logic local

===============================================================================
DELIVERY REQUIREMENTS
===============================================================================

Verify:
- EV preset loads exact text
- Attribute 5 accepts two answers
- Raincoat example works
- Venn renders correctly
- No layout overflow at target widths
- Canvas iframe compatible

===============================================================================
END SOURCE OF TRUTH
===============================================================================
*/

(function initPositioningMapper() {
  const CVH_LEVELS = [
    "Core Benefit",
    "Generic Product",
    "Expected Product",
    "Augmented Product",
    "Potential Product"
  ];

  const PRESETS = {
    "electric-vehicle": {
      name: "Electric Vehicle",
      attributes: [
        {
          id: "ev-1",
          text: "Transportation from A to B",
          acceptedLevels: ["Core Benefit"],
          explanation: "The fundamental need the product serves. An EV without this is not a product."
        },
        {
          id: "ev-2",
          text: "Electric drivetrain (no gas)",
          acceptedLevels: ["Expected Product"],
          explanation: "Customers purchasing an EV expect this by definition. Not a differentiator in this category."
        },
        {
          id: "ev-3",
          text: "Over-the-air software updates",
          acceptedLevels: ["Augmented Product"],
          explanation: "Beyond baseline expectations - adds value and loyalty, but not required for purchase satisfaction."
        },
        {
          id: "ev-4",
          text: "Vehicle-to-grid energy export",
          acceptedLevels: ["Potential Product"],
          explanation: "Not yet standard or expected. Future value if technology and infrastructure develop."
        },
        {
          id: "ev-5",
          text: "300+ mile range",
          acceptedLevels: ["Expected Product", "Augmented Product"],
          explanation: "Currently augmented but trending toward expected by 2026-27."
        }
      ]
    },
    "athletic-shoe": {
      name: "Athletic Shoe",
      attributes: [
        { id: "shoe-1", text: "Foot protection during movement", acceptedLevels: ["Core Benefit"] },
        { id: "shoe-2", text: "Sole, upper, and laces", acceptedLevels: ["Generic Product"] },
        { id: "shoe-3", text: "Durable cushioning for training", acceptedLevels: ["Expected Product"] },
        { id: "shoe-4", text: "Personalized fit and gait analytics", acceptedLevels: ["Augmented Product"] },
        { id: "shoe-5", text: "Adaptive smart materials", acceptedLevels: ["Potential Product"] }
      ]
    },
    "streaming-service": {
      name: "Streaming Service",
      attributes: [
        { id: "str-1", text: "Access to entertainment content", acceptedLevels: ["Core Benefit"] },
        { id: "str-2", text: "App-based video streaming", acceptedLevels: ["Generic Product"] },
        { id: "str-3", text: "Reliable playback on common devices", acceptedLevels: ["Expected Product"] },
        { id: "str-4", text: "Personalized recommendations", acceptedLevels: ["Augmented Product"] },
        { id: "str-5", text: "Interactive mixed-reality viewing", acceptedLevels: ["Potential Product"] }
      ]
    },
    smartphone: {
      name: "Smartphone",
      attributes: [
        { id: "ph-1", text: "Portable communication", acceptedLevels: ["Core Benefit"] },
        { id: "ph-2", text: "Touchscreen handset with OS", acceptedLevels: ["Generic Product"] },
        { id: "ph-3", text: "High-speed connectivity and battery day life", acceptedLevels: ["Expected Product"] },
        { id: "ph-4", text: "AI-assisted camera workflow", acceptedLevels: ["Augmented Product"] },
        { id: "ph-5", text: "Ambient computing integration", acceptedLevels: ["Potential Product"] }
      ]
    },
    "coffee-shop": {
      name: "Coffee Shop",
      attributes: [
        { id: "cof-1", text: "Caffeine and refreshment", acceptedLevels: ["Core Benefit"] },
        { id: "cof-2", text: "Prepared coffee beverages", acceptedLevels: ["Generic Product"] },
        { id: "cof-3", text: "Fast, consistent drink quality", acceptedLevels: ["Expected Product"] },
        { id: "cof-4", text: "Loyalty rewards and customization", acceptedLevels: ["Augmented Product"] },
        { id: "cof-5", text: "Fully personalized smart ordering", acceptedLevels: ["Potential Product"] }
      ]
    },
    raincoat: {
      name: "Raincoat Instructor Example",
      attributes: [
        {
          id: "rain-1",
          text: "protection from rain",
          acceptedLevels: ["Core Benefit"],
          explanation: "Instructor example: core functional need."
        },
        {
          id: "rain-2",
          text: "waterproof seams",
          acceptedLevels: ["Expected Product"],
          explanation: "Instructor example: expected baseline requirement."
        },
        {
          id: "rain-3",
          text: "breathable lining",
          acceptedLevels: ["Augmented Product"],
          explanation: "Instructor example: comfort enhancement above baseline."
        },
        {
          id: "rain-4",
          text: "solar-charging panel",
          acceptedLevels: ["Potential Product"],
          explanation: "Instructor example: forward-looking potential feature."
        },
        {
          id: "rain-5",
          text: "jacket shell and hood",
          acceptedLevels: ["Generic Product"],
          explanation: "Physical product form that delivers the category function."
        }
      ]
    }
  };

  const state = {
    presetKey: "electric-vehicle",
    assignments: {},
    draggedId: null
  };

  const els = {
    focusModeBtn: document.querySelector("#focusModeBtn"),
    tabButtons: document.querySelectorAll(".tab-btn"),
    tabPanels: {
      cvh: document.querySelector("#tab-cvh"),
      pops: document.querySelector("#tab-pops")
    },
    presetSelect: document.querySelector("#preset-select"),
    attributeCards: document.querySelector("#attribute-cards"),
    checkCvh: document.querySelector("#check-cvh"),
    resetCvh: document.querySelector("#reset-cvh"),
    cvhMessage: document.querySelector("#cvh-message"),
    cvhResults: document.querySelector("#cvh-results"),
    drops: document.querySelectorAll(".drop-zone"),
    listByLevel: {
      "Core Benefit": document.querySelector("#list-core"),
      "Generic Product": document.querySelector("#list-generic"),
      "Expected Product": document.querySelector("#list-expected"),
      "Augmented Product": document.querySelector("#list-augmented"),
      "Potential Product": document.querySelector("#list-potential")
    },
    brandAName: document.querySelector("#brand-a-name"),
    brandBName: document.querySelector("#brand-b-name"),
    brandAInputs: [
      document.querySelector("#brand-a-1"),
      document.querySelector("#brand-a-2"),
      document.querySelector("#brand-a-3")
    ],
    brandBInputs: [
      document.querySelector("#brand-b-1"),
      document.querySelector("#brand-b-2"),
      document.querySelector("#brand-b-3")
    ],
    analyzePop: document.querySelector("#analyze-pop"),
    popsMessage: document.querySelector("#pops-message"),
    vennLabelA: document.querySelector("#label-a"),
    vennLabelB: document.querySelector("#label-b"),
    popText: document.querySelector("#pop-text"),
    podAText: document.querySelector("#pod-a-text"),
    podBText: document.querySelector("#pod-b-text"),
    gapSummary: document.querySelector("#gap-summary")
  };

  function safeText(value) {
    return (value || "").trim();
  }

  function normalize(text) {
    return safeText(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenSet(text) {
    return new Set(normalize(text).split(" ").filter(Boolean));
  }

  function conceptKey(text) {
    const n = normalize(text);
    if (/afford|cost|value|price|budget/.test(n)) {
      return "value";
    }
    if (/quick|fast|speed/.test(n)) {
      return "speed";
    }
    if (/premium|quality|craft/.test(n)) {
      return "quality";
    }
    if (/convenien|easy|seamless/.test(n)) {
      return "convenience";
    }
    if (/healthy|nutrition|wellness/.test(n)) {
      return "health";
    }
    return n;
  }

  function similarity(a, b) {
    const aSet = tokenSet(a);
    const bSet = tokenSet(b);
    if (aSet.size === 0 || bSet.size === 0) {
      return 0;
    }
    let overlap = 0;
    aSet.forEach(function each(tok) {
      if (bSet.has(tok)) {
        overlap += 1;
      }
    });
    return overlap / Math.max(aSet.size, bSet.size);
  }

  function setTab(tabKey) {
    Object.keys(els.tabPanels).forEach(function each(key) {
      const isActive = key === tabKey;
      els.tabPanels[key].hidden = !isActive;
    });

    els.tabButtons.forEach(function each(btn) {
      const active = btn.dataset.tab === tabKey;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  }

  function loadPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) {
      els.cvhMessage.textContent = "Unable to load preset. Please choose a valid product preset.";
      return;
    }

    state.presetKey = presetKey;
    state.assignments = {};
    preset.attributes.forEach(function each(attr) {
      state.assignments[attr.id] = "";
    });

    renderAttributeCards();
    renderAssignedLists();
    els.cvhResults.innerHTML = "";
    els.cvhMessage.textContent = "Preset loaded: " + preset.name + ". Drag attributes or assign levels, then click Check My Classification.";
  }

  function renderAttributeCards() {
    const preset = PRESETS[state.presetKey];
    els.attributeCards.innerHTML = "";

    preset.attributes.forEach(function each(attr) {
      const card = document.createElement("article");
      card.className = "attr-card";
      card.draggable = true;
      card.dataset.attrId = attr.id;

      const p = document.createElement("p");
      p.textContent = attr.text;

      const label = document.createElement("label");
      label.textContent = "Assign level";
      const select = document.createElement("select");
      select.setAttribute("aria-label", "Assign CVH level for " + attr.text);
      select.innerHTML = [
        '<option value="">Unassigned</option>'
      ].concat(CVH_LEVELS.map(function map(level) {
        return '<option value="' + level + '">' + level + "</option>";
      })).join("");
      select.value = state.assignments[attr.id] || "";
      select.addEventListener("change", function onChange(event) {
        state.assignments[attr.id] = event.target.value;
        renderAssignedLists();
      });

      card.addEventListener("dragstart", function onDragStart() {
        state.draggedId = attr.id;
      });
      card.addEventListener("dragend", function onDragEnd() {
        state.draggedId = null;
      });

      label.appendChild(select);
      card.appendChild(p);
      card.appendChild(label);
      els.attributeCards.appendChild(card);
    });
  }

  function renderAssignedLists() {
    Object.keys(els.listByLevel).forEach(function each(level) {
      els.listByLevel[level].innerHTML = "";
    });

    const preset = PRESETS[state.presetKey];
    preset.attributes.forEach(function each(attr) {
      const assigned = state.assignments[attr.id];
      if (!assigned || !els.listByLevel[assigned]) {
        return;
      }
      const li = document.createElement("li");
      li.textContent = attr.text;
      els.listByLevel[assigned].appendChild(li);
    });

    els.attributeCards.querySelectorAll(".attr-card").forEach(function each(card) {
      const id = card.dataset.attrId;
      const select = card.querySelector("select");
      if (select) {
        select.value = state.assignments[id] || "";
      }
    });
  }

  function checkClassification() {
    const preset = PRESETS[state.presetKey];
    const resultItems = [];
    let correctCount = 0;

    preset.attributes.forEach(function each(attr) {
      const selected = state.assignments[attr.id] || "Unassigned";
      const isCorrect = attr.acceptedLevels.includes(selected);
      if (isCorrect) {
        correctCount += 1;
      }

      const explanation = attr.explanation || "Review the CVH logic and compare with category expectations.";
      const acceptedDisplay = attr.acceptedLevels.join(" or ");
      resultItems.push({
        text: attr.text,
        selected,
        acceptedDisplay,
        isCorrect,
        explanation
      });
    });

    els.cvhResults.innerHTML = "";
    resultItems.forEach(function each(item) {
      const article = document.createElement("article");
      article.className = "result-item";
      article.innerHTML =
        "<strong>Attribute:</strong> " + item.text + "<br>" +
        "<strong>Your level:</strong> " + item.selected + "<br>" +
        "<strong>Accepted level(s):</strong> " + item.acceptedDisplay + "<br>" +
        '<span class="result-state">' + (item.isCorrect ? "Classification accepted" : "Needs revision") + "</span><br>" +
        "<span>" + item.explanation + "</span>";
      els.cvhResults.appendChild(article);
    });

    els.cvhMessage.textContent = "You matched " + correctCount + " out of " + preset.attributes.length + " attributes.";
  }

  function multilineText(lines, x, y, node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    lines.forEach(function each(line, idx) {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", String(x));
      tspan.setAttribute("dy", idx === 0 ? "0" : "18");
      tspan.textContent = line;
      node.appendChild(tspan);
    });
  }

  function analyzePopsPods() {
    try {
      const brandA = safeText(els.brandAName.value) || "Brand A";
      const brandB = safeText(els.brandBName.value) || "Brand B";
      const attrsA = els.brandAInputs.map(function map(node) { return safeText(node.value); }).filter(Boolean);
      const attrsB = els.brandBInputs.map(function map(node) { return safeText(node.value); }).filter(Boolean);

      if (attrsA.length === 0 || attrsB.length === 0) {
        els.popsMessage.textContent = "Enter at least one attribute for each brand to analyze POPs and PODs.";
        return;
      }

      const matchedA = new Set();
      const matchedB = new Set();
      const pops = [];

      attrsA.forEach(function eachA(a, i) {
        attrsB.forEach(function eachB(b, j) {
          if (matchedA.has(i) || matchedB.has(j)) {
            return;
          }
          const exact = normalize(a) === normalize(b);
          const near = similarity(a, b) >= 0.6;
          const shared = conceptKey(a) === conceptKey(b);
          if (exact || near || shared) {
            matchedA.add(i);
            matchedB.add(j);
            pops.push(a + " / " + b);
          }
        });
      });

      const podA = attrsA.filter(function filterA(_, i) { return !matchedA.has(i); });
      const podB = attrsB.filter(function filterB(_, i) { return !matchedB.has(i); });

      els.vennLabelA.textContent = brandA + " PODs";
      els.vennLabelB.textContent = brandB + " PODs";

      multilineText(podA.length ? podA : ["None"], 170, 110, els.podAText);
      multilineText(podB.length ? podB : ["None"], 450, 110, els.podBText);
      multilineText(pops.length ? pops : ["No clear POPs"], 330, 120, els.popText);

      const summary =
        "" + brandA + " differentiates on " + (podA.length ? podA.join(", ") : "no clear unique attribute") + ". " +
        brandB + " differentiates on " + (podB.length ? podB.join(", ") : "no clear unique attribute") + ". " +
        "Both share " + (pops.length ? pops.join(", ") : "limited category requirements") + " as category requirements.";
      els.gapSummary.value = summary;

      els.popsMessage.textContent = "Analysis complete. Review the Venn output and edit the positioning-gap summary as needed.";
    } catch (_error) {
      els.popsMessage.textContent = "Unable to analyze attributes right now. Please review entries and try again.";
    }
  }

  function wireTabs() {
    els.tabButtons.forEach(function each(btn) {
      btn.addEventListener("click", function onClick() {
        setTab(btn.dataset.tab);
      });
    });
  }

  function wireCvhDnD() {
    els.drops.forEach(function each(drop) {
      drop.addEventListener("dragover", function onDragOver(event) {
        event.preventDefault();
        drop.classList.add("over");
      });
      drop.addEventListener("dragleave", function onDragLeave() {
        drop.classList.remove("over");
      });
      drop.addEventListener("drop", function onDrop(event) {
        event.preventDefault();
        drop.classList.remove("over");
        if (!state.draggedId) {
          return;
        }
        state.assignments[state.draggedId] = drop.dataset.level;
        renderAssignedLists();
      });
    });
  }

  function wireEvents() {
    wireTabs();
    wireCvhDnD();

    els.presetSelect.addEventListener("change", function onPresetChange(event) {
      loadPreset(event.target.value);
    });

    els.checkCvh.addEventListener("click", checkClassification);

    els.resetCvh.addEventListener("click", function onReset() {
      loadPreset(state.presetKey);
    });

    els.analyzePop.addEventListener("click", analyzePopsPods);

    if (els.focusModeBtn) {
      els.focusModeBtn.addEventListener("click", function onFocusToggle() {
        const enabled = document.body.classList.toggle("focus-mode");
        els.focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
        els.focusModeBtn.setAttribute("aria-pressed", String(enabled));
      });
    }
  }

  wireEvents();
  loadPreset(state.presetKey);
})();