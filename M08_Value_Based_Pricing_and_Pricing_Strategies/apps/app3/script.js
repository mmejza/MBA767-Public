/*
M08 APP 3 — BREAK-EVEN PRICING CALCULATOR
SOURCE OF TRUTH FOR COPILOT BUILD

Build App 3 only. This app helps students calculate break-even volume change after a price change, compare it with expected volume change from elasticity, and judge whether the pricing strategy improves gross profit.

TECHNICAL REQUIREMENTS
- Vanilla HTML/CSS/JS preferred.
- Single-page app, client-side only.
- No backend, no persistence, no login, no external API calls.
- Designed for Canvas iframe desktop use.
- Real-time recalculation on every input change.
- Include preset buttons and Reset.
- Reset returns to Price Cut Scenario defaults.
- Use accessible labels and verdict text; do not rely only on color.

LAYOUT
Tabbed interface:
Tab A: "Break-Even % Calculator"
Tab B: "Elasticity Check"
Comparison panel below tabs:
"What volume do you need? vs. What volume will you get?"

TAB A DEFAULT INPUTS — PRICE CUT SCENARIO
Current Price = 100
Variable Cost per Unit = 60
Current Unit Sales Volume = 200000
Percent Price Change = -10%
Variable Cost Change = disabled, 0%
Fixed Cost Change = disabled, $0
Optional Market Demand field may be blank unless preset uses it.

TAB A CORE CALCULATIONS
Current Contribution Margin =
Current Price - Variable Cost

New Price =
Current Price * (1 + Percent Price Change)

New Variable Cost =
Variable Cost * (1 + Percent Variable Cost Change) if enabled,
otherwise Variable Cost

New Contribution Margin =
New Price - New Variable Cost

Change in Contribution Margin =
New Contribution Margin - Current Contribution Margin

BE% Required, price/VC change only =
-Change in Contribution Margin / New Contribution Margin

If fixed cost change is enabled:
BE% Required =
(-Change in Contribution Margin / New Contribution Margin) +
(-Fixed Cost Change / (New Contribution Margin * Current Volume))

Interpretation:
If BE% positive:
"Volume must INCREASE by XX.X% to maintain gross profit."
If BE% negative:
"Volume may DECREASE by up to XX.X% while maintaining gross profit."

Current Gross Profit =
Current Contribution Margin * Current Volume

Gross Profit at BE% =
Current Gross Profit

If Market Demand entered:
Current Market Share =
Current Volume / Market Demand

Required Market Share at BE% =
Current Volume * (1 + BE%) / Market Demand

If Required Market Share > 50%:
show warning "Implausible share gain required."

TAB B INPUTS
Price Elasticity Estimate = -1.5 default
Percent Price Change = linked from Tab A

TAB B CALCULATIONS
Expected Percent Volume Change =
Elasticity * Percent Price Change

Elasticity Classification:
- Inelastic if elasticity is greater than -1 and less than 0
- Unit Elastic if elasticity equals -1.0
- Elastic if elasticity is less than -1.0

Profit Direction Verdict:
If inelastic and price change positive:
"RAISE price → gross profit INCREASES"
green

If inelastic and price change negative:
"CUT price → gross profit DECREASES"
red

If elastic and price change positive:
"RAISE price → gross profit may decrease"
amber

If elastic and price change negative:
"CUT price → gross profit depends on margin"
amber

If unit elastic:
"Revenue unchanged; gross profit depends on VC"
amber

Break-Even Elasticity Needed:
BE Elasticity Needed = BE% / abs(Percent Price Change)
Display as a negative value.

Reality Check:
If abs(actual elasticity) < abs(BE elasticity needed):
"Market is not elastic enough. This strategy loses money."
red

If abs(actual elasticity) >= abs(BE elasticity needed):
"Market is elastic enough. Strategy may work."
green

COMPARISON PANEL
Show after both Tab A and Tab B have valid calculations.

Display:
Break-even volume change = BE%
Expected volume change = Expected Percent Volume Change
Gap = Expected Percent Volume Change - BE%

If gap >= 0:
"Strategy clears the bar."
green

If gap < 0:
"Strategy falls short by XX.X percentage points."
red

GAUGE / VISUAL OUTPUT
Create horizontal gauge or progress bar:
- Target marker = required BE% volume change
- Projected marker = expected volume change from elasticity
- Green if projected >= required
- Red if projected < required

PRESETS
1. Price Cut Scenario default
Current Price = 100
Variable Cost = 60
Volume = 200000
Price Change = -10%
Elasticity = -1.5
Expected:
BE% = 20.0%
Expected volume gain = 15.0%
Gap = -5.0 percentage points
Verdict = Strategy fails

2. Price Increase — Inelastic
Current Price = 100
Variable Cost = 50
Volume = 1000000
Price Change = +10%
Elasticity = -0.7
Expected:
BE% = -16.7%
Expected volume change = -7.0%
Gap = +9.7 percentage points
Verdict = Strategy works

3. Price Increase — Elastic
Current Price = 100
Variable Cost = 50
Volume = 1000000
Price Change = +10%
Elasticity = -1.5
Shows that even some elastic price increases may still improve gross profit depending on margin.

4. Implausible Share
Current Price = 100
Variable Cost = 80
Volume = 5000
Market Demand = 1000000
Price Change = -15%
Trigger warning if required market share is implausible.

5. Reset
Return to Price Cut Scenario defaults.

ACCEPTANCE TESTS
- Price Cut Scenario: BE% = 20.0%; expected = 15.0%; gap = -5.0; verdict Strategy fails.
- Price Increase — Inelastic: BE% = -16.7%; expected loss = -7.0%; gap = +9.7; verdict Strategy works.
- Lowering price in the inelastic scenario should show gross profit falls.
- Optional VC and FC changes should only affect calculations when enabled.
- No Vantara case numbers may appear in presets.
*/

(function initBreakEvenPricingCalculator() {
	const PRESETS = {
		cut: {
			name: "Price Cut Scenario",
			currentPrice: 100,
			variableCost: 60,
			currentVolume: 200000,
			priceChangePct: -10,
			elasticity: -1.5,
			enableVc: false,
			vcChangePct: 0,
			enableFc: false,
			fcChangeAmt: 0,
			marketDemand: ""
		},
		inc_inelastic: {
			name: "Price Increase - Inelastic",
			currentPrice: 100,
			variableCost: 50,
			currentVolume: 1000000,
			priceChangePct: 10,
			elasticity: -0.7,
			enableVc: false,
			vcChangePct: 0,
			enableFc: false,
			fcChangeAmt: 0,
			marketDemand: ""
		},
		inc_elastic: {
			name: "Price Increase - Elastic",
			currentPrice: 100,
			variableCost: 50,
			currentVolume: 1000000,
			priceChangePct: 10,
			elasticity: -1.5,
			enableVc: false,
			vcChangePct: 0,
			enableFc: false,
			fcChangeAmt: 0,
			marketDemand: ""
		},
		implausible: {
			name: "Implausible Share",
			currentPrice: 100,
			variableCost: 80,
			currentVolume: 5000,
			priceChangePct: -15,
			elasticity: -1.5,
			enableVc: false,
			vcChangePct: 0,
			enableFc: false,
			fcChangeAmt: 0,
			marketDemand: 1000000
		}
	};

	const ui = {
		focusModeBtn: document.querySelector("#focusModeBtn"),
		activeScenario: document.querySelector("#active-scenario"),
		presetButtons: document.querySelectorAll("button[data-preset]"),
		resetBtn: document.querySelector("#reset-btn"),
		tabABtn: document.querySelector("#tab-a-btn"),
		tabBBtn: document.querySelector("#tab-b-btn"),
		tabAPanel: document.querySelector("#tab-a-panel"),
		tabBPanel: document.querySelector("#tab-b-panel"),
		currentPrice: document.querySelector("#current-price"),
		variableCost: document.querySelector("#variable-cost"),
		currentVolume: document.querySelector("#current-volume"),
		priceChangePct: document.querySelector("#price-change-pct"),
		enableVcChange: document.querySelector("#enable-vc-change"),
		vcChangePct: document.querySelector("#vc-change-pct"),
		enableFcChange: document.querySelector("#enable-fc-change"),
		fcChangeAmt: document.querySelector("#fc-change-amt"),
		marketDemand: document.querySelector("#market-demand"),
		tabAResults: document.querySelector("#tab-a-results"),
		beInterpretation: document.querySelector("#be-interpretation"),
		shareWarning: document.querySelector("#share-warning"),
		beBadge: document.querySelector("#be-badge"),
		elasticity: document.querySelector("#elasticity"),
		linkedPriceChange: document.querySelector("#linked-price-change"),
		tabBResults: document.querySelector("#tab-b-results"),
		elasticityClass: document.querySelector("#elasticity-class"),
		profitDirection: document.querySelector("#profit-direction"),
		realityCheck: document.querySelector("#reality-check"),
		elasticityBadge: document.querySelector("#elasticity-badge"),
		comparisonResults: document.querySelector("#comparison-results"),
		comparisonText: document.querySelector("#comparison-text"),
		comparisonBadge: document.querySelector("#comparison-badge"),
		gaugeTrack: document.querySelector("#gauge-track"),
		targetMarker: document.querySelector("#target-marker"),
		projectedMarker: document.querySelector("#projected-marker"),
		targetLabel: document.querySelector("#target-label"),
		projectedLabel: document.querySelector("#projected-label")
	};

	let activePresetName = PRESETS.cut.name;

	function n(value, fallback) {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	function pct(value) {
		return (value * 100).toFixed(1) + "%";
	}

	function pctPoints(value) {
		return value.toFixed(1) + " percentage points";
	}

	function money(value) {
		return "$" + value.toFixed(2);
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}

	function setBadge(el, text, tone) {
		el.textContent = text;
		el.className = "badge " + tone;
	}

	function setTab(which) {
		const showA = which === "a";
		ui.tabABtn.classList.toggle("active", showA);
		ui.tabBBtn.classList.toggle("active", !showA);
		ui.tabABtn.setAttribute("aria-selected", showA ? "true" : "false");
		ui.tabBBtn.setAttribute("aria-selected", showA ? "false" : "true");
		ui.tabAPanel.classList.toggle("active", showA);
		ui.tabBPanel.classList.toggle("active", !showA);
	}

	function setPresetValues(preset) {
		ui.currentPrice.value = String(preset.currentPrice);
		ui.variableCost.value = String(preset.variableCost);
		ui.currentVolume.value = String(preset.currentVolume);
		ui.priceChangePct.value = String(preset.priceChangePct);
		ui.elasticity.value = String(preset.elasticity);
		ui.enableVcChange.checked = Boolean(preset.enableVc);
		ui.vcChangePct.value = String(preset.vcChangePct);
		ui.enableFcChange.checked = Boolean(preset.enableFc);
		ui.fcChangeAmt.value = String(preset.fcChangeAmt);
		ui.marketDemand.value = preset.marketDemand === "" ? "" : String(preset.marketDemand);
		ui.vcChangePct.disabled = !ui.enableVcChange.checked;
		ui.fcChangeAmt.disabled = !ui.enableFcChange.checked;
		ui.activeScenario.textContent = preset.name;
	}

	function readInputs() {
		const priceChangeDecimal = n(ui.priceChangePct.value, 0) / 100;
		const vcChangeDecimal = n(ui.vcChangePct.value, 0) / 100;

		return {
			currentPrice: Math.max(0, n(ui.currentPrice.value, 0)),
			variableCost: Math.max(0, n(ui.variableCost.value, 0)),
			currentVolume: Math.max(0, n(ui.currentVolume.value, 0)),
			priceChangePctUi: n(ui.priceChangePct.value, 0),
			priceChange: priceChangeDecimal,
			enableVcChange: ui.enableVcChange.checked,
			vcChangePctUi: n(ui.vcChangePct.value, 0),
			vcChange: vcChangeDecimal,
			enableFcChange: ui.enableFcChange.checked,
			fixedCostChange: n(ui.fcChangeAmt.value, 0),
			marketDemandRaw: ui.marketDemand.value.trim(),
			elasticity: n(ui.elasticity.value, -1.5)
		};
	}

	function computeTabA(input) {
		const currentCm = input.currentPrice - input.variableCost;
		const newPrice = input.currentPrice * (1 + input.priceChange);
		const newVc = input.enableVcChange
			? input.variableCost * (1 + input.vcChange)
			: input.variableCost;
		const newCm = newPrice - newVc;
		const deltaCm = newCm - currentCm;

		let bePct = NaN;
		if (newCm !== 0) {
			bePct = -deltaCm / newCm;
			if (input.enableFcChange) {
				bePct += -input.fixedCostChange / (newCm * input.currentVolume);
			}
		}

		const currentGrossProfit = currentCm * input.currentVolume;

		let marketShare = null;
		let requiredMarketShare = null;
		const marketDemand = input.marketDemandRaw === "" ? null : Math.max(0, n(input.marketDemandRaw, 0));
		if (marketDemand && marketDemand > 0 && Number.isFinite(bePct)) {
			marketShare = input.currentVolume / marketDemand;
			requiredMarketShare = (input.currentVolume * (1 + bePct)) / marketDemand;
		}

		return {
			currentCm,
			newPrice,
			newVc,
			newCm,
			deltaCm,
			bePct,
			currentGrossProfit,
			grossProfitAtBe: currentGrossProfit,
			marketShare,
			requiredMarketShare
		};
	}

	function elasticityClass(elasticity) {
		if (elasticity === -1) {
			return "Unit Elastic";
		}
		if (elasticity > -1 && elasticity < 0) {
			return "Inelastic";
		}
		if (elasticity < -1) {
			return "Elastic";
		}
		return "Out of expected range";
	}

	function computeTabB(input, a) {
		const expectedPctVolChange = input.elasticity * input.priceChange;
		const cls = elasticityClass(input.elasticity);

		let profitDirectionText = "";
		let profitTone = "amber";
		if (cls === "Inelastic" && input.priceChange > 0) {
			profitDirectionText = "RAISE price -> gross profit INCREASES";
			profitTone = "good";
		} else if (cls === "Inelastic" && input.priceChange < 0) {
			profitDirectionText = "CUT price -> gross profit DECREASES";
			profitTone = "bad";
		} else if (cls === "Elastic" && input.priceChange > 0) {
			profitDirectionText = "RAISE price -> gross profit may decrease";
			profitTone = "amber";
		} else if (cls === "Elastic" && input.priceChange < 0) {
			profitDirectionText = "CUT price -> gross profit depends on margin";
			profitTone = "amber";
		} else if (cls === "Unit Elastic") {
			profitDirectionText = "Revenue unchanged; gross profit depends on VC";
			profitTone = "amber";
		} else {
			profitDirectionText = "Elasticity value should usually be between 0 and -3 for this model.";
			profitTone = "amber";
		}

		const absPriceChange = Math.abs(input.priceChange);
		let beElasticityNeeded = NaN;
		if (absPriceChange > 0 && Number.isFinite(a.bePct)) {
			beElasticityNeeded = a.bePct / absPriceChange;
			if (beElasticityNeeded > 0) {
				beElasticityNeeded = -beElasticityNeeded;
			}
		}

		let realityText = "Need a non-zero price change to compute break-even elasticity needed.";
		let realityTone = "amber";
		if (Number.isFinite(beElasticityNeeded)) {
			if (Math.abs(input.elasticity) < Math.abs(beElasticityNeeded)) {
				realityText = "Market is not elastic enough. This strategy loses money.";
				realityTone = "bad";
			} else {
				realityText = "Market is elastic enough. Strategy may work.";
				realityTone = "good";
			}
		}

		return {
			expectedPctVolChange,
			cls,
			profitDirectionText,
			profitTone,
			beElasticityNeeded,
			realityText,
			realityTone
		};
	}

	function drawList(dl, rows) {
		dl.innerHTML = "";
		rows.forEach(function each(row) {
			const dt = document.createElement("dt");
			dt.textContent = row[0];
			const dd = document.createElement("dd");
			dd.textContent = row[1];
			dl.appendChild(dt);
			dl.appendChild(dd);
		});
	}

	function renderTabA(input, a) {
		const rows = [
			["Current Contribution Margin", money(a.currentCm)],
			["New Price", money(a.newPrice)],
			["New Variable Cost", money(a.newVc)],
			["New Contribution Margin", money(a.newCm)],
			["Change in Contribution Margin", money(a.deltaCm)],
			["BE% Required", Number.isFinite(a.bePct) ? pct(a.bePct) : "N/A"],
			["Current Gross Profit", money(a.currentGrossProfit)],
			["Gross Profit at BE%", money(a.grossProfitAtBe)]
		];
		if (a.marketShare !== null && a.requiredMarketShare !== null) {
			rows.push(["Current Market Share", pct(a.marketShare)]);
			rows.push(["Required Market Share at BE%", pct(a.requiredMarketShare)]);
		}
		drawList(ui.tabAResults, rows);

		if (Number.isFinite(a.bePct)) {
			if (a.bePct >= 0) {
				ui.beInterpretation.textContent = "Volume must INCREASE by " + pct(a.bePct) + " to maintain gross profit.";
			} else {
				ui.beInterpretation.textContent = "Volume may DECREASE by up to " + pct(Math.abs(a.bePct)) + " while maintaining gross profit.";
			}
		} else {
			ui.beInterpretation.textContent = "Break-even percent unavailable because new contribution margin is zero.";
		}

		if (a.requiredMarketShare !== null && a.requiredMarketShare > 0.5) {
			ui.shareWarning.textContent = "Implausible share gain required.";
		} else {
			ui.shareWarning.textContent = "";
		}

		setBadge(ui.beBadge, "NEEDS ELASTICITY CHECK", "neutral");
		ui.linkedPriceChange.value = input.priceChangePctUi.toFixed(1);
	}

	function renderTabB(input, b) {
		const rows = [
			["Expected Percent Volume Change", pct(b.expectedPctVolChange)],
			["Break-Even Elasticity Needed", Number.isFinite(b.beElasticityNeeded) ? b.beElasticityNeeded.toFixed(3) : "N/A"]
		];
		drawList(ui.tabBResults, rows);

		ui.elasticityClass.textContent = "Elasticity Classification: " + b.cls;
		ui.profitDirection.textContent = b.profitDirectionText;
		ui.realityCheck.textContent = b.realityText;
		setBadge(ui.elasticityBadge, b.cls.toUpperCase(), b.profitTone);
	}

	function renderComparison(a, b) {
		const hasBoth = Number.isFinite(a.bePct) && Number.isFinite(b.expectedPctVolChange);
		if (!hasBoth) {
			drawList(ui.comparisonResults, []);
			ui.comparisonText.textContent = "Need valid results from both tabs to compare.";
			setBadge(ui.comparisonBadge, "COMPARE RESULTS", "neutral");
			return;
		}

		const gap = b.expectedPctVolChange - a.bePct;
		drawList(ui.comparisonResults, [
			["Break-even volume change", pct(a.bePct)],
			["Expected volume change", pct(b.expectedPctVolChange)],
			["Gap", pct(gap)]
		]);

		if (gap >= 0) {
			ui.comparisonText.textContent = "Strategy clears the bar.";
			setBadge(ui.comparisonBadge, "STRATEGY WORKS", "good");
		} else {
			ui.comparisonText.textContent = "Strategy falls short by " + pctPoints(Math.abs(gap * 100)) + ".";
			setBadge(ui.comparisonBadge, "STRATEGY FAILS", "bad");
		}

		renderGauge(a.bePct, b.expectedPctVolChange);
	}

	function renderGauge(requiredBePct, projectedPct) {
		const minV = Math.min(requiredBePct, projectedPct, -0.4);
		const maxV = Math.max(requiredBePct, projectedPct, 0.4);
		const span = maxV - minV || 1;

		function pos(value) {
			return clamp(((value - minV) / span) * 100, 0, 100);
		}

		const targetPos = pos(requiredBePct);
		const projectedPos = pos(projectedPct);

		ui.targetMarker.style.left = targetPos + "%";
		ui.projectedMarker.style.left = projectedPos + "%";
		ui.projectedMarker.style.background = projectedPct >= requiredBePct ? "#167343" : "#ab2c2c";

		ui.targetLabel.textContent = "Target: " + pct(requiredBePct);
		ui.projectedLabel.textContent = "Projected: " + pct(projectedPct);
	}

	function recompute() {
		const input = readInputs();
		const a = computeTabA(input);
		const b = computeTabB(input, a);

		ui.activeScenario.textContent = activePresetName;
		renderTabA(input, a);
		renderTabB(input, b);
		renderComparison(a, b);
	}

	function markCustomScenario() {
		activePresetName = "Custom";
		ui.activeScenario.textContent = activePresetName;
	}

	function applyPreset(key) {
		const preset = PRESETS[key];
		if (!preset) {
			return;
		}
		activePresetName = preset.name;
		setPresetValues(preset);
		recompute();
	}

	function wireEvents() {
		ui.tabABtn.addEventListener("click", function onTabA() {
			setTab("a");
		});
		ui.tabBBtn.addEventListener("click", function onTabB() {
			setTab("b");
		});

		ui.presetButtons.forEach(function each(btn) {
			btn.addEventListener("click", function onPreset() {
				applyPreset(btn.dataset.preset);
			});
		});

		ui.resetBtn.addEventListener("click", function onReset() {
			applyPreset("cut");
		});

		ui.enableVcChange.addEventListener("change", function onVcToggle() {
			ui.vcChangePct.disabled = !ui.enableVcChange.checked;
			markCustomScenario();
			recompute();
		});

		ui.enableFcChange.addEventListener("change", function onFcToggle() {
			ui.fcChangeAmt.disabled = !ui.enableFcChange.checked;
			markCustomScenario();
			recompute();
		});

		[
			ui.currentPrice,
			ui.variableCost,
			ui.currentVolume,
			ui.priceChangePct,
			ui.vcChangePct,
			ui.fcChangeAmt,
			ui.marketDemand,
			ui.elasticity
		].forEach(function each(el) {
			el.addEventListener("input", function onInput() {
				markCustomScenario();
				recompute();
			});
			el.addEventListener("change", function onChange() {
				markCustomScenario();
				recompute();
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

	setTab("a");
	wireEvents();
	applyPreset("cut");
})();