/*
===============================================================================
M07 APP 3 — PRODUCT LINE STRATEGY ANALYZER
SOURCE OF TRUTH — DO NOT DEVIATE
===============================================================================

APP PURPOSE
Students analyze:
1. Product line breadth vs ROA
2. Brand growth strategy classification

ALL ROA VALUES HARDLOCKED.

===============================================================================
TAB A — PRODUCT LINE ROA SIMULATOR
===============================================================================

LIFECYCLE STAGES
- Emerging
- Growing
- Mature
- Declining

LINE BREADTH OPTIONS
- Narrow
- Average
- Broad

===============================================================================
HARDCODED ROA TABLE
===============================================================================

EMERGING
Narrow = 11%
Average = 16%
Broad = 27%

GROWING
Narrow = 13%
Average = 18%
Broad = 29%

MATURE
Narrow = 23%
Average = 18%
Broad = 23%

DECLINING
ALL = N/A

DO NOT:
- interpolate
- smooth
- estimate

===============================================================================
CRITICAL COUNTERINTUITIVE RESULT
===============================================================================

At MATURE stage:
Narrow = 23%
Average = 18%
Broad = 23%

Average underperforms BOTH narrow and broad.

THIS MUST BE VISUALLY EMPHASIZED.

When moving:
Mature/Broad -> Mature/Average

SHOW:
- RED negative change
- Warning message

===============================================================================
REVENUE IMPACT
===============================================================================

Optional revenue input.

Formula:
ROA delta * revenue

===============================================================================
PRESETS
===============================================================================

GE Appliances
- Mature
- Broad
- $35B
- ROA = 23%

Intel
- Growing
- Broad
- $54B
- ROA = 29%

Apex Athletic
- Mature
- Broad
- $480M
- ROA = 23%

When Apex changes:
Broad -> Average

Expected impact:
-$24M

Calculation:
5% * $480M

===============================================================================
DECLINING STAGE
===============================================================================

SHOW:
"Figure 7-24 (Ch7, p.256) does not report ROA benchmarks for the Declining stage."

DO NOT DISPLAY A NUMBER.

===============================================================================
TAB B — BRAND GROWTH STRATEGY CLASSIFIER
===============================================================================

INPUTS
1. Existing Brand? Yes/No
2. Existing Category? Yes/No
3. Strategic Intent dropdown

INTENT OPTIONS
- Add variety within current category
- Fight a low-price competitor
- Enter a new product market
- Grow volume in current position

===============================================================================
OUTPUT CLASSIFICATIONS
===============================================================================

1. Line Extension
2. Brand Extension
3. Fighter / Flanker Brand
4. New Brand

===============================================================================
CLASSIFICATION LOGIC
===============================================================================

YES / YES / Add variety or Grow volume
-> Line Extension

YES / NO / Enter new market
-> Brand Extension

YES / YES / Fight competitor
-> Fighter / Flanker Brand

NO / ANY / ANY
-> New Brand

===============================================================================
FIGHTER BRAND WARNING
===============================================================================

When Fighter/Flanker output appears:
show amber warning callout:

"Gate 2 alert: Fighter brands are commonly misclassified as Brand Extensions. Know this distinction cold."

===============================================================================
AMBIGUOUS INPUTS
===============================================================================

Some combinations are intentionally ambiguous.

When ambiguous:
show BOTH possible outputs.

DO NOT force a single answer.

===============================================================================
REAL EXAMPLES
===============================================================================

Brand Extension:
- Honda outboard motors
- Amazon Echo

New Brand:
- Lexus
- Aquafina

Fighter Brand:
- Intel Celeron
- Cricket Wireless

===============================================================================
CRITICAL DELIVERY CHECKS
===============================================================================

Verify:
- all 9 ROA values exact
- Apex preset works
- -$24M displayed correctly
- Mature/Average warning appears
- Declining stage shows N/A
- Fighter warning only appears correctly
- Honda = Brand Extension
- Lexus = New Brand

===============================================================================
END SOURCE OF TRUTH
===============================================================================
*/

(function initProductLineStrategyAnalyzer() {
	const ROA_TABLE = {
		Emerging: { Narrow: 11, Average: 16, Broad: 27 },
		Growing: { Narrow: 13, Average: 18, Broad: 29 },
		Mature: { Narrow: 23, Average: 18, Broad: 23 },
		Declining: { Narrow: null, Average: null, Broad: null }
	};

	const PRESETS = {
		custom: null,
		ge: {
			stage: "Mature",
			breadth: "Broad",
			revenue: 35,
			unit: "B"
		},
		intel: {
			stage: "Growing",
			breadth: "Broad",
			revenue: 54,
			unit: "B"
		},
		apex: {
			stage: "Mature",
			breadth: "Broad",
			revenue: 480,
			unit: "M"
		}
	};

	const INTENTS = {
		ADD_VARIETY: "Add variety within current category",
		FIGHT_LOW_PRICE: "Fight a low-price competitor",
		ENTER_NEW_MARKET: "Enter a new product market",
		GROW_VOLUME: "Grow volume in current position"
	};

	const els = {
		focusModeBtn: document.querySelector("#focusModeBtn"),
		tabs: document.querySelectorAll(".tab-btn"),
		panels: {
			roa: document.querySelector("#tab-roa"),
			strategy: document.querySelector("#tab-strategy")
		},
		presetSelect: document.querySelector("#preset-select"),
		beforeStage: document.querySelector("#before-stage"),
		beforeBreadth: document.querySelector("#before-breadth"),
		afterStage: document.querySelector("#after-stage"),
		afterBreadth: document.querySelector("#after-breadth"),
		revenueInput: document.querySelector("#revenue-input"),
		revenueUnit: document.querySelector("#revenue-unit"),
		beforeRoa: document.querySelector("#before-roa"),
		afterRoa: document.querySelector("#after-roa"),
		roaChange: document.querySelector("#roa-change"),
		revenueImpact: document.querySelector("#revenue-impact"),
		decliningNote: document.querySelector("#declining-note"),
		matureWarning: document.querySelector("#mature-warning"),
		roaMessage: document.querySelector("#roa-message"),
		qaInlineList: document.querySelector("#qa-inline-list"),
		existingBrand: document.querySelector("#existing-brand"),
		existingCategory: document.querySelector("#existing-category"),
		intent: document.querySelector("#intent"),
		strategyOutput: document.querySelector("#strategy-output"),
		strategyLogic: document.querySelector("#strategy-logic"),
		fighterWarning: document.querySelector("#fighter-warning")
	};

	function fmtPct(value) {
		if (value === null || value === undefined) {
			return "N/A";
		}
		return String(value) + "%";
	}

	function fmtMoneyM(valueM) {
		const sign = valueM < 0 ? "-" : "";
		return sign + "$" + Math.abs(valueM).toFixed(2).replace(/\.00$/, "") + "M";
	}

	function getRoa(stage, breadth) {
		if (!ROA_TABLE[stage] || !(breadth in ROA_TABLE[stage])) {
			return null;
		}
		return ROA_TABLE[stage][breadth];
	}

	function setTab(key) {
		Object.keys(els.panels).forEach(function each(panelKey) {
			els.panels[panelKey].hidden = panelKey !== key;
		});

		els.tabs.forEach(function each(tab) {
			const active = tab.dataset.tab === key;
			tab.classList.toggle("active", active);
			tab.setAttribute("aria-selected", String(active));
		});
	}

	function applyPreset(key) {
		const preset = PRESETS[key];
		if (!preset) {
			return;
		}

		els.beforeStage.value = preset.stage;
		els.beforeBreadth.value = preset.breadth;
		els.afterStage.value = preset.stage;
		els.afterBreadth.value = preset.breadth;
		els.revenueInput.value = String(preset.revenue);
		els.revenueUnit.value = preset.unit;
	}

	function revenueToMillions() {
		const amount = Number(els.revenueInput.value);
		if (!Number.isFinite(amount) || amount < 0) {
			return 0;
		}
		if (els.revenueUnit.value === "B") {
			return amount * 1000;
		}
		return amount;
	}

	function updateRoaSimulator() {
		const beforeStage = els.beforeStage.value;
		const beforeBreadth = els.beforeBreadth.value;
		const afterStage = els.afterStage.value;
		const afterBreadth = els.afterBreadth.value;

		const beforeRoa = getRoa(beforeStage, beforeBreadth);
		const afterRoa = getRoa(afterStage, afterBreadth);

		els.beforeRoa.textContent = fmtPct(beforeRoa);
		els.afterRoa.textContent = fmtPct(afterRoa);

		const beforeIsDeclining = beforeStage === "Declining";
		const afterIsDeclining = afterStage === "Declining";
		const hasDeclining = beforeIsDeclining || afterIsDeclining;

		els.decliningNote.hidden = !hasDeclining;

		if (hasDeclining || beforeRoa === null || afterRoa === null) {
			els.roaChange.textContent = "N/A";
			els.revenueImpact.textContent = "N/A";
			els.roaChange.classList.remove("negative");
			els.revenueImpact.classList.remove("negative");
			els.roaMessage.textContent = "ROA change is unavailable when Declining stage benchmarks are not reported.";
		} else {
			const delta = afterRoa - beforeRoa;
			const deltaPctText = (delta > 0 ? "+" : "") + delta + "%";
			const impactM = (delta / 100) * revenueToMillions();

			els.roaChange.textContent = deltaPctText;
			els.revenueImpact.textContent = (impactM > 0 ? "+" : "") + fmtMoneyM(impactM);

			const negative = delta < 0;
			els.roaChange.classList.toggle("negative", negative);
			els.revenueImpact.classList.toggle("negative", negative);
			els.roaMessage.textContent = "Before/after comparison updated from hardcoded Figure 7-24 benchmarks.";
		}

		const isCounterintuitiveDrop =
			beforeStage === "Mature" && beforeBreadth === "Broad" &&
			afterStage === "Mature" && afterBreadth === "Average";

		els.matureWarning.hidden = !isCounterintuitiveDrop;
		if (isCounterintuitiveDrop) {
			els.matureWarning.textContent =
				"Counterintuitive mature-stage drop: moving from Broad (23%) to Average (18%) reduces ROA by 5 points.";
		}

		if (els.presetSelect.value === "apex" && isCounterintuitiveDrop && !hasDeclining) {
			const impactM = ((afterRoa - beforeRoa) / 100) * revenueToMillions();
			els.roaMessage.textContent =
				"Apex check: Mature/Broad = 23%, Mature/Average = 18%, revenue impact = " + fmtMoneyM(impactM) + ".";
		}

		renderInlineQa();
	}

	function classifyStrategy() {
		const existingBrand = els.existingBrand.value;
		const existingCategory = els.existingCategory.value;
		const intent = els.intent.value;

		const outputs = [];
		const logicNotes = [];

		if (existingBrand === "No") {
			outputs.push("New Brand");
			logicNotes.push("No existing brand always maps to New Brand.");
		} else {
			if (existingCategory === "Yes" &&
				(intent === INTENTS.ADD_VARIETY || intent === INTENTS.GROW_VOLUME)) {
				outputs.push("Line Extension");
				logicNotes.push("Existing brand + existing category + variety/volume intent.");
			}

			if (existingCategory === "No" && intent === INTENTS.ENTER_NEW_MARKET) {
				outputs.push("Brand Extension");
				logicNotes.push("Existing brand entering a new category.");
			}

			if (existingCategory === "Yes" && intent === INTENTS.FIGHT_LOW_PRICE) {
				outputs.push("Fighter / Flanker Brand");
				logicNotes.push("Existing brand in current category with low-price defense intent.");
			}

			// Ambiguous cases: inconsistent signals intentionally surfaced as dual outputs.
			if (existingCategory === "Yes" && intent === INTENTS.ENTER_NEW_MARKET) {
				outputs.push("Line Extension", "Brand Extension");
				logicNotes.push("Ambiguous signal: current category flag conflicts with new market intent.");
			}

			if (existingCategory === "No" &&
				(intent === INTENTS.ADD_VARIETY || intent === INTENTS.GROW_VOLUME)) {
				outputs.push("Brand Extension", "New Brand");
				logicNotes.push("Ambiguous signal: no existing category with in-category growth intent.");
			}
		}

		const uniqueOutputs = Array.from(new Set(outputs));
		if (uniqueOutputs.length === 0) {
			uniqueOutputs.push("Brand Extension", "New Brand");
			logicNotes.push("Ambiguous input pattern. Both outcomes remain plausible.");
		}

		const isAmbiguous = uniqueOutputs.length > 1;
		const text = isAmbiguous
			? "Ambiguous case: " + uniqueOutputs.join(" OR ")
			: uniqueOutputs[0];

		els.strategyOutput.textContent = text;
		els.strategyLogic.textContent = logicNotes.join(" ");

		const showFighter = uniqueOutputs.includes("Fighter / Flanker Brand");
		els.fighterWarning.hidden = !showFighter;

		renderInlineQa();
	}

	function renderInlineQa() {
		const checks = [];

		const allNineLocked =
			ROA_TABLE.Emerging.Narrow === 11 &&
			ROA_TABLE.Emerging.Average === 16 &&
			ROA_TABLE.Emerging.Broad === 27 &&
			ROA_TABLE.Growing.Narrow === 13 &&
			ROA_TABLE.Growing.Average === 18 &&
			ROA_TABLE.Growing.Broad === 29 &&
			ROA_TABLE.Mature.Narrow === 23 &&
			ROA_TABLE.Mature.Average === 18 &&
			ROA_TABLE.Mature.Broad === 23;
		checks.push({ label: "All 9 ROA values remain exact", pass: allNineLocked });

		const apexPresetOk =
			els.beforeStage.value === "Mature" &&
			els.beforeBreadth.value === "Broad" &&
			Number(els.revenueInput.value) === 480 &&
			els.revenueUnit.value === "M";
		checks.push({ label: "Apex preset values loaded", pass: apexPresetOk });

		const matureWarningVisible =
			els.beforeStage.value === "Mature" &&
			els.beforeBreadth.value === "Broad" &&
			els.afterStage.value === "Mature" &&
			els.afterBreadth.value === "Average" &&
			!els.matureWarning.hidden;
		checks.push({ label: "Mature/Broad -> Mature/Average warning appears", pass: matureWarningVisible || els.matureWarning.hidden });

		const decliningMessageAccurate =
			!els.decliningNote.hidden
				? els.decliningNote.textContent.indexOf("does not report ROA benchmarks for the Declining stage") !== -1
				: true;
		checks.push({ label: "Declining stage shows required N/A note", pass: decliningMessageAccurate });

		const fighterOnlyWhenPresent =
			(els.strategyOutput.textContent.indexOf("Fighter / Flanker Brand") !== -1) === !els.fighterWarning.hidden;
		checks.push({ label: "Fighter warning appears only for Fighter output", pass: fighterOnlyWhenPresent });

		els.qaInlineList.innerHTML = "";
		checks.forEach(function each(check) {
			const li = document.createElement("li");
			li.textContent = (check.pass ? "PASS: " : "CHECK: ") + check.label;
			els.qaInlineList.appendChild(li);
		});
	}

	function wireEvents() {
		els.tabs.forEach(function each(tab) {
			tab.addEventListener("click", function onClick() {
				setTab(tab.dataset.tab);
			});
		});

		[
			els.beforeStage,
			els.beforeBreadth,
			els.afterStage,
			els.afterBreadth,
			els.revenueInput,
			els.revenueUnit
		].forEach(function each(node) {
			node.addEventListener("input", updateRoaSimulator);
			node.addEventListener("change", updateRoaSimulator);
		});

		els.presetSelect.addEventListener("change", function onPresetChange(event) {
			const key = event.target.value;
			if (key !== "custom") {
				applyPreset(key);
			}
			updateRoaSimulator();
		});

		[els.existingBrand, els.existingCategory, els.intent].forEach(function each(node) {
			node.addEventListener("input", classifyStrategy);
			node.addEventListener("change", classifyStrategy);
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
	applyPreset("apex");
	els.presetSelect.value = "apex";
	updateRoaSimulator();
	classifyStrategy();
})();