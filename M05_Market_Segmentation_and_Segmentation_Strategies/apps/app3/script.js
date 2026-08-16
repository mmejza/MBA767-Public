/*
M05 APP 3 SOURCE OF TRUTH — SEGMENT PORTFOLIO OPTIMIZER

Build this app exactly from the M05 App Data Spec.

CORE PURPOSE:
Students compare segment portfolio choices using NMC, Marketing ROS, and Marketing ROI.
The app must show that the segment with the highest absolute NMC is not always the best choice under resource constraints.

FORMULAS:
Unit Volume = Market Demand × Company Share
Revenue = Unit Volume × Net Price
Gross Profit = Revenue × Percent Margin
M&S Expense = Revenue × M&S as % of Sales
NMC = Gross Profit − M&S Expense
Marketing ROS = NMC / Revenue
Marketing ROI = NMC / M&S Expense

PRESET 1 — SILICON SEALANTS:
Segments:
- Engineered Solution
- Service Solution
- Price Solution

Inputs:
Engineered:
- Market demand = 100 M lbs/yr
- Company share = 20%
- Net price = 10.00
- Percent margin = 60%
- M&S as % of sales = 20%

Service:
- Market demand = 300 M lbs/yr
- Company share = 15%
- Net price = 6.00
- Percent margin = 40%
- M&S as % of sales = 15%

Price:
- Market demand = 800 M lbs/yr
- Company share = 5%
- Net price = 4.00
- Percent margin = 20%
- M&S as % of sales = 7%

Verified outputs:
Engineered:
- Unit volume = 20
- Revenue = $200M
- Gross Profit = $120M
- M&S Expense = $40M
- NMC = $80M
- Marketing ROS = 40%
- Marketing ROI = 200%

Service:
- Unit volume = 45
- Revenue = $270M
- Gross Profit = $108M
- M&S Expense = $41M
- NMC = $68M
- Marketing ROS = 25%
- Marketing ROI = 167%

Price:
- Unit volume = 40
- Revenue = $160M
- Gross Profit = $32M
- M&S Expense = $11M
- NMC = $21M
- Marketing ROS = 13%
- Marketing ROI = 186%

Silicon Sealants portfolio outputs at $50M budget:
- Engineered only: NMC $80M, ROI 200%, Best single-segment ROI
- Service only: NMC $68M, ROI 167%
- Price only: NMC $21M, ROI 186%
- Engineered + Service: NMC $148M, ROI 184%, Best 2-segment absolute NMC
- Engineered + Price: NMC $101M, ROI 193%, Best 2-segment avg ROI
- Service + Price: NMC $89M, ROI 174%
- All three: NMC $169M, ROI 185%, Best absolute NMC overall

PRESET 2 — APEX ATHLETIC PARALLEL:
Segments:
- Seg P Premium
- Seg Q Mid-Market
- Seg R Budget

Inputs:
Seg P:
- Market demand = 1,500,000
- Company share = 15%
- Net price = 210
- Percent margin = 61%
- M&S as % of sales = 17%

Seg Q:
- Market demand = 7,000,000
- Company share = 10%
- Net price = 105
- Percent margin = 46%
- M&S as % of sales = 13%

Seg R:
- Market demand = 12,000,000
- Company share = 3%
- Net price = 38
- Percent margin = 24%
- M&S as % of sales = 8%

Verified outputs:
Seg P:
- Unit volume = 225,000
- Revenue = $47.25M
- Gross Profit = $28.82M
- M&S Expense = $8.03M
- NMC = $20.79M
- Marketing ROS = 44.0%
- Marketing ROI = 259%

Seg Q:
- Unit volume = 700,000
- Revenue = $73.50M
- Gross Profit = $33.81M
- M&S Expense = $9.55M
- NMC = $24.25M
- Marketing ROS = 33.0%
- Marketing ROI = 254%

Seg R:
- Unit volume = 360,000
- Revenue = $13.68M
- Gross Profit = $3.28M
- M&S Expense = $1.09M
- NMC = $2.19M
- Marketing ROS = 16.0%
- Marketing ROI = 200%

CRITICAL ROI INVERSION:
- Seg Q has higher NMC than Seg P.
- Seg P has higher Marketing ROI than Seg Q.
- This inversion must be clearly displayed.

CHART REQUIREMENT:
The bar chart comparing NMC and ROI must use dual Y-axes so the NMC/ROI inversion is visually obvious.

PORTFOLIO OPTIMIZER:
Show all 7 combinations:
- 3 single-segment combinations
- 3 two-segment combinations
- 1 all-three combination

GLOBAL:
- All calculations must match verified outputs.
- Display monetary outputs in $M where appropriate.
- Display Marketing ROS and ROI as percentages.
- Use live recalculation when inputs change.
- All logic client-side only.
- No external APIs.
- If behavior conflicts with the spec, the spec wins.
*/

document.addEventListener("DOMContentLoaded", () => {
	const focusModeBtn = document.getElementById("focusModeBtn");
	if (!focusModeBtn) {
		return;
	}

	focusModeBtn.addEventListener("click", () => {
		const enabled = document.body.classList.toggle("focus-mode");
		focusModeBtn.textContent = enabled ? "Exit Focus Mode" : "Focus Mode";
		focusModeBtn.setAttribute("aria-pressed", String(enabled));
	});
});