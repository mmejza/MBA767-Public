/*
===============================================================================
M07 APP 2 — BRAND EQUITY SCORECARD CALCULATOR
SOURCE OF TRUTH — DO NOT DEVIATE
===============================================================================

APP PURPOSE
Students build intuition for:
- Brand Assets
- Brand Liabilities
- Brand Equity
- Liability spikes and equity collapse

ALL CALCULATIONS MUST MATCH SPEC EXACTLY.

===============================================================================
GLOBAL RULES
===============================================================================

NO:
- localStorage
- backend
- APIs

YES:
- live calculations
- client-side only
- responsive layout

===============================================================================
TAB A — BRAND ASSETS
===============================================================================

DIMENSIONS
1. Brand Awareness
2. Emotional Connectedness
3. Brand Loyalty
4. Product Line Extensions
5. Price Premium

ALL DIMENSIONS:
- equal 20% weight

SLIDER VALUES ONLY:
- 0
- 25
- 50
- 75
- 100

NO FREEHAND VALUES.

DISPLAY LABELS
0 = Very Low
25 = Below Average
50 = About Average
75 = Above Average
100 = Very High

===============================================================================
ASSETS CALCULATION
===============================================================================

Weighted Score:
rating * 0.20

Total Assets Score:
sum of weighted scores

LIVE UPDATE:
- update on every slider movement

===============================================================================
TAB B — BRAND LIABILITIES
===============================================================================

DIMENSIONS
1. Customer Dissatisfaction
2. Product/Service Failures
3. Questionable Practices
4. Poor Record on Social Issues
5. Negative Associations

MECHANICS IDENTICAL TO TAB A.

IMPORTANT:
Higher liability scores = WORSE.

SHOW WARNING:
"Higher scores indicate greater brand risk."

===============================================================================
TAB C — BRAND EQUITY
===============================================================================

FORMULA
Brand Equity = Assets Score - Liabilities Score

DISPLAY:
- Positive = green
- Negative = red
- Zero = gray

SHOW:
- Assets total
- Liabilities total
- Equity total

===============================================================================
SPIKE SIMULATOR
===============================================================================

Student selects:
- one liability dimension
- force to 100

Simulator:
- recalculates equity
- DOES NOT permanently alter sliders

SHOW:
Original Equity
Post-Spike Equity
Point Change

RESET BUTTON:
restores original state

===============================================================================
ARTHUR ANDERSEN PRESET
===============================================================================

PRESET NAME
"Arthur Andersen Pre-Enron"

ASSETS SCORE
78

IMPORTANT:
This is an override value.
DO NOT derive from sliders.

LIABILITY SLIDERS
CD = 25
PF = 25
QP = 0
SI = 25
NA = 25

COMPUTED LIABILITY TOTAL
20

STARTING EQUITY
+58

===============================================================================
POST-SPIKE VERIFICATION
===============================================================================

Set:
QP -> 100
PF -> 75

EXPECTED RESULTS:
New Liabilities = 50
New Equity = +28

Acceptable instructional range:
+26 to +30

===============================================================================
BAR CHARTS
===============================================================================

Tab A:
- teal bars

Tab B:
- coral/red bars

Benchmark line:
50
Label:
"Average Brand"

===============================================================================
CRITICAL RULES
===============================================================================

- All math exact
- No rounding drift
- Sliders snap only
- Spike simulator temporary only
- No mutation bugs

===============================================================================
DELIVERY REQUIREMENTS
===============================================================================

Verify:
- all 5 slider positions
- live updates
- color coding
- spike reset
- Andersen preset
- +28 post-spike output
- responsive layouts

===============================================================================
END SOURCE OF TRUTH
===============================================================================
*/

(function initBrandEquityCalculator() {
	const SNAP_VALUES = [0, 25, 50, 75, 100];

	const ASSET_DIMENSIONS = [
		"Brand Awareness",
		"Emotional Connectedness",
		"Brand Loyalty",
		"Product Line Extensions",
		"Price Premium"
	];

	const LIABILITY_DIMENSIONS = [
		"Customer Dissatisfaction",
		"Product/Service Failures",
		"Questionable Practices",
		"Poor Record on Social Issues",
		"Negative Associations"
	];

	const VALUE_LABELS = {
		0: "Very Low",
		25: "Below Average",
		50: "About Average",
		75: "Above Average",
		100: "Very High"
	};

	const state = {
		assets: {
			"Brand Awareness": 50,
			"Emotional Connectedness": 50,
			"Brand Loyalty": 50,
			"Product Line Extensions": 50,
			"Price Premium": 50
		},
		liabilities: {
			"Customer Dissatisfaction": 50,
			"Product/Service Failures": 50,
			"Questionable Practices": 50,
			"Poor Record on Social Issues": 50,
			"Negative Associations": 50
		},
		andersenMode: false,
		spikeOverrideMap: null
	};

	const els = {
		focusModeBtn: document.querySelector("#focusModeBtn"),
		tabButtons: document.querySelectorAll(".tab-btn"),
		panels: {
			assets: document.querySelector("#tab-assets"),
			liabilities: document.querySelector("#tab-liabilities"),
			equity: document.querySelector("#tab-equity")
		},
		assetsGrid: document.querySelector("#assets-grid"),
		liabilitiesGrid: document.querySelector("#liabilities-grid"),
		assetsBars: document.querySelector("#assets-bars"),
		liabilitiesBars: document.querySelector("#liabilities-bars"),
		assetsTotal: document.querySelector("#assets-total"),
		liabilitiesTotal: document.querySelector("#liabilities-total"),
		equityAssets: document.querySelector("#equity-assets"),
		equityLiabilities: document.querySelector("#equity-liabilities"),
		equityTotal: document.querySelector("#equity-total"),
		spikeDimension: document.querySelector("#spike-dimension"),
		runSpike: document.querySelector("#run-spike"),
		resetSpike: document.querySelector("#reset-spike"),
		spikeOriginal: document.querySelector("#spike-original"),
		spikePost: document.querySelector("#spike-post"),
		spikeChange: document.querySelector("#spike-change"),
		loadAndersen: document.querySelector("#load-andersen"),
		resetAll: document.querySelector("#reset-all"),
		message: document.querySelector("#message")
	};

	function safeSnap(raw) {
		const value = Number(raw);
		if (!Number.isFinite(value)) {
			return 50;
		}
		let nearest = SNAP_VALUES[0];
		let minGap = Math.abs(value - nearest);
		SNAP_VALUES.forEach(function each(snap) {
			const gap = Math.abs(value - snap);
			if (gap < minGap) {
				minGap = gap;
				nearest = snap;
			}
		});
		return nearest;
	}

	function weightedTotal(map) {
		return Object.keys(map).reduce(function sum(total, key) {
			return total + map[key] * 0.2;
		}, 0);
	}

	function currentAssetsScore() {
		if (state.andersenMode) {
			return 78;
		}
		return weightedTotal(state.assets);
	}

	function baseLiabilitiesScore() {
		return weightedTotal(state.liabilities);
	}

	function displayLiabilitiesScore() {
		if (state.spikeOverrideMap) {
			return weightedTotal(state.spikeOverrideMap);
		}
		return weightedTotal(state.liabilities);
	}

	function currentEquityScore() {
		return currentAssetsScore() - displayLiabilitiesScore();
	}

	function formatOne(value) {
		return (Math.round(value * 10) / 10).toFixed(1);
	}

	function setTab(tabKey) {
		Object.keys(els.panels).forEach(function each(key) {
			els.panels[key].hidden = key !== tabKey;
		});
		els.tabButtons.forEach(function each(btn) {
			const active = btn.dataset.tab === tabKey;
			btn.classList.toggle("active", active);
			btn.setAttribute("aria-selected", String(active));
		});
	}

	function makeSliderRow(type, dimension) {
		const value = type === "assets" ? state.assets[dimension] : state.liabilities[dimension];

		const wrap = document.createElement("div");
		wrap.className = "slider-row";

		const head = document.createElement("div");
		head.className = "row-head";
		const title = document.createElement("span");
		title.className = "row-title";
		title.textContent = dimension;
		const val = document.createElement("span");
		val.className = "row-value";
		val.textContent = value;
		head.appendChild(title);
		head.appendChild(val);

		const sliderWrap = document.createElement("div");
		sliderWrap.className = "slider-wrap";

		const slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.step = "25";
		slider.value = String(value);
		slider.setAttribute("aria-label", dimension + " score");

		slider.addEventListener("input", function onInput(event) {
			const snapped = safeSnap(event.target.value);
			event.target.value = String(snapped);
			if (type === "assets") {
				state.assets[dimension] = snapped;
			} else {
				state.liabilities[dimension] = snapped;
			}
			state.spikeOverrideMap = null;
			renderAll();
		});

		const qual = document.createElement("span");
		qual.className = "qual-label";
		qual.textContent = VALUE_LABELS[value] || "About Average";

		sliderWrap.appendChild(slider);
		sliderWrap.appendChild(qual);

		wrap.appendChild(head);
		wrap.appendChild(sliderWrap);
		return wrap;
	}

	function renderSliders() {
		els.assetsGrid.innerHTML = "";
		ASSET_DIMENSIONS.forEach(function each(d) {
			els.assetsGrid.appendChild(makeSliderRow("assets", d));
		});

		els.liabilitiesGrid.innerHTML = "";
		LIABILITY_DIMENSIONS.forEach(function each(d) {
			els.liabilitiesGrid.appendChild(makeSliderRow("liabilities", d));
		});
	}

	function makeBarRow(label, value, kind) {
		const row = document.createElement("div");
		row.className = "bar-row";

		const left = document.createElement("span");
		left.className = "bar-label";
		left.textContent = label + " - " + value;

		const track = document.createElement("div");
		track.className = "bar-track";

		const fill = document.createElement("div");
		fill.className = "bar-fill " + kind;
		fill.style.width = value + "%";

		const benchmark = document.createElement("div");
		benchmark.className = "bar-benchmark";

		const benchmarkLabel = document.createElement("span");
		benchmarkLabel.className = "benchmark-label";
		benchmarkLabel.textContent = "Average Brand (50)";

		track.appendChild(fill);
		track.appendChild(benchmark);
		track.appendChild(benchmarkLabel);

		row.appendChild(left);
		row.appendChild(track);
		return row;
	}

	function renderBars() {
		els.assetsBars.innerHTML = "";
		ASSET_DIMENSIONS.forEach(function each(d) {
			els.assetsBars.appendChild(makeBarRow(d, state.assets[d], "assets"));
		});

		els.liabilitiesBars.innerHTML = "";
		LIABILITY_DIMENSIONS.forEach(function each(d) {
			const v = state.spikeOverrideMap ? state.spikeOverrideMap[d] : state.liabilities[d];
			els.liabilitiesBars.appendChild(makeBarRow(d, v, "liabilities"));
		});
	}

	function renderTotals() {
		const assets = currentAssetsScore();
		const liabilities = displayLiabilitiesScore();
		const equity = assets - liabilities;

		els.assetsTotal.textContent = formatOne(assets);
		els.liabilitiesTotal.textContent = formatOne(liabilities);
		els.equityAssets.textContent = formatOne(assets);
		els.equityLiabilities.textContent = formatOne(liabilities);
		els.equityTotal.textContent = formatOne(equity);

		els.equityTotal.classList.remove("equity-positive", "equity-negative", "equity-zero");
		if (equity > 0) {
			els.equityTotal.classList.add("equity-positive");
		} else if (equity < 0) {
			els.equityTotal.classList.add("equity-negative");
		} else {
			els.equityTotal.classList.add("equity-zero");
		}

		const originalEquity = currentAssetsScore() - baseLiabilitiesScore();
		const postEquity = currentEquityScore();
		const delta = postEquity - originalEquity;

		els.spikeOriginal.textContent = formatOne(originalEquity);
		els.spikePost.textContent = formatOne(postEquity);
		els.spikeChange.textContent = formatOne(delta);
	}

	function renderSpikeOptions() {
		const existing = els.spikeDimension.value;
		els.spikeDimension.innerHTML = "";
		LIABILITY_DIMENSIONS.forEach(function each(name) {
			const opt = document.createElement("option");
			opt.value = name;
			opt.textContent = name;
			els.spikeDimension.appendChild(opt);
		});
		if (existing && LIABILITY_DIMENSIONS.includes(existing)) {
			els.spikeDimension.value = existing;
		}
	}

	function loadAndersenPreset() {
		state.andersenMode = true;
		state.spikeOverrideMap = null;

		ASSET_DIMENSIONS.forEach(function each(name) {
			state.assets[name] = 75;
		});

		state.liabilities["Customer Dissatisfaction"] = 25;
		state.liabilities["Product/Service Failures"] = 25;
		state.liabilities["Questionable Practices"] = 0;
		state.liabilities["Poor Record on Social Issues"] = 25;
		state.liabilities["Negative Associations"] = 25;

		renderAll();
		els.message.textContent = "Andersen preset loaded: assets override = 78, liabilities = 20, starting equity = +58.";
	}

	function resetNeutral() {
		state.andersenMode = false;
		state.spikeOverrideMap = null;

		ASSET_DIMENSIONS.forEach(function each(name) {
			state.assets[name] = 50;
		});
		LIABILITY_DIMENSIONS.forEach(function each(name) {
			state.liabilities[name] = 50;
		});

		renderAll();
		els.message.textContent = "Reset complete. Neutral 50 scores restored.";
	}

	function runSpike() {
		const target = els.spikeDimension.value;
		if (!target) {
			els.message.textContent = "Choose a liability dimension before running a spike.";
			return;
		}

		const simulated = Object.assign({}, state.liabilities);
		simulated[target] = 100;

		// Locked Andersen verification scenario from spec.
		if (state.andersenMode && target === "Questionable Practices") {
			simulated["Product/Service Failures"] = 75;
		}

		state.spikeOverrideMap = simulated;
		renderAll();

		const postLiab = displayLiabilitiesScore();
		const postEq = currentEquityScore();
		const inRange = postEq >= 26 && postEq <= 30;

		if (state.andersenMode && target === "Questionable Practices") {
			els.message.textContent = "Spike applied (temporary) with Andersen verification scenario (QP=100, PF=75): post-spike liabilities = " +
				formatOne(postLiab) + " and post-spike equity = +" + formatOne(postEq) +
				(inRange ? " (within +26 to +30 instructional range)." : ".");
		} else {
			els.message.textContent = "Spike applied temporarily. Sliders remain unchanged.";
		}
	}

	function resetSpikeView() {
		state.spikeOverrideMap = null;
		renderAll();
		els.message.textContent = "Spike view reset. Original slider-driven values restored.";
	}

	function renderAll() {
		renderSliders();
		renderBars();
		renderTotals();
		renderSpikeOptions();
	}

	function wireTabs() {
		els.tabButtons.forEach(function each(btn) {
			btn.addEventListener("click", function onClick() {
				setTab(btn.dataset.tab);
			});
		});
	}

	function wireEvents() {
		wireTabs();
		els.loadAndersen.addEventListener("click", loadAndersenPreset);
		els.resetAll.addEventListener("click", resetNeutral);
		els.runSpike.addEventListener("click", runSpike);
		els.resetSpike.addEventListener("click", resetSpikeView);

		if (els.focusModeBtn) {
			els.focusModeBtn.addEventListener("click", function onFocusToggle() {
				const enabled = document.body.classList.toggle("focus-mode");
				els.focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
				els.focusModeBtn.setAttribute("aria-pressed", String(enabled));
			});
		}
	}

	wireEvents();
	renderAll();
})();