/*
M11 APP 2 — STRATEGY PERFORMANCE PROJECTOR
Source of truth: M11_App_Specification.docx
Build exactly as a single self-contained HTML file:
M11_App2_Strategy_Projector.html

PURPOSE
Students compare offensive vs. defensive 3-year projections for a product line. The app must show the efficiency paradox: offensive plan produces higher NMC but lower ROS and ROI.

NON-NEGOTIABLE TECH RULES
- Single HTML file with embedded CSS and JS.
- No external dependencies except Google Fonts CSS import.
- No localStorage/sessionStorage.
- No external API calls/fetch().
- No <form> tags.
- No alert()/confirm().
- Must work inside Canvas iframe and at 360px viewport width.
- All inputs update calculations live.

DESIGN SYSTEM
Use same tokens as App 1:
--navy:#0F2027; --teal:#0D9B87; --teal-dk:#0D7A6B;
--teal-lt:#E5F5F3; --teal-bd:#C8E8E4; --amber:#E6A800;
--amb-lt:#FFF8E6; --amb-bd:#F5D78A; --red:#C0392B;
--red-lt:#FEF5F5; --red-bd:#F5BFBF; --text:#1A2E2C;
--muted:#7A9896; --off:#F7FDFC; --bg:#F0F4F3;
--white:#FFFFFF; --border:#E8F5F3.

Header:
- Navy bar.
- Left: “MKT 472 · Module 11”
- Center/title: “Strategy Performance Projector”
- Right: buttons “Vantage Beta” and “Reset”

LAYOUT
Three panels:
1. Base-Year Inputs
2. Offensive Plan Assumptions
3. Defensive Plan Assumptions

Below panels:
- Full-width projection output table.

INPUTS

Base-Year Inputs:
- Base-Year Market Demand ($M)
- Market Growth Rate (%/yr)
- Current Market Share (%)
- Base-Year Gross Margin (%)
- Base-Year Mktg & Sales Exp (%)

Offensive Plan:
- Year-3 Target Share (%)
- Annual Margin Erosion (%/yr)
- Annual Mktg Exp Increase (pp/yr)

Defensive Plan:
- Hold Share at base rate, display only
- Annual Margin Erosion (%/yr)
- Mktg Exp Adjustment (pp/yr)

FORMULAS

Years:
Y0 = Base Year
Y1 = Year 1
Y2 = Year 2
Y3 = Year 3

Market Demand:
Demand(Y) = BaseDemand * (1 + growthRate)^Y

Offensive Share:
Linearly interpolate from base share to target share:
Share(Y) = baseShare + ((targetShare - baseShare) / 3) * Y

Defensive Share:
Share(Y) = baseShare

Sales:
Sales(Y) = Demand(Y) * Share(Y)

Offensive Gross Margin:
Margin(Y) = baseMargin - offensiveMarginErosion * Y

Defensive Gross Margin:
Margin(Y) = baseMargin - defensiveMarginErosion * Y

Offensive Marketing Expense %:
MktgExpPct(Y) = baseMktgExpPct + offensiveMktgIncrease * Y

Defensive Marketing Expense %:
MktgExpPct(Y) = baseMktgExpPct + defensiveMktgAdjustment * Y

Marketing Expense Dollars:
MktgExp$(Y) = Sales(Y) * MktgExpPct(Y)

NMC:
NMC(Y) = Sales(Y) * Margin(Y) - MktgExp$(Y)

Marketing ROS:
ROS(Y) = NMC(Y) / Sales(Y) * 100

Marketing ROI:
ROI(Y) = NMC(Y) / MktgExp$(Y) * 100

OUTPUT TABLE
Show side-by-side Offensive and Defensive columns:
Metric | Base Year | Year 1 | Year 2 | Year 3 for each plan.

Rows:
1. Market Demand
2. Market Share
3. Sales Revenue
4. Gross Margin %
5. Mktg & Sales Exp % / ($M)
6. NMC
7. Marketing ROS
8. Marketing ROI

Formatting:
- Dollars: $XX.X M where appropriate.
- Percentages: XX.X% where appropriate.
- Market demand may show $400, $460, $529, $608.35 for preset.
- Highlight higher NMC plan per year with teal-lt.
- Highlight lower ROS and lower ROI plan per year with red-lt.
- Year 3 columns should have slightly darker headers.

EFFICIENCY PARADOX
If Year 3:
Offensive NMC > Defensive NMC
AND Offensive ROS < Defensive ROS
THEN show amber banner:

“Efficiency Paradox Active: The offensive plan generates more total profit (NMC +$2.3M at Year 3) but lower marketing efficiency (ROS 21.5% vs 30.5%, ROI 134% vs 305%). This is the expected trade-off for an Improve Position strategy in a growing market.”

PRESET: VANTAGE BETA
Base-Year Market Demand = 400
Market Growth Rate = 15
Current Market Share = 10
Base-Year Gross Margin = 42
Base-Year Mktg & Sales Exp = 10

Offensive:
Year-3 Target Share = 16
Annual Margin Erosion = 1.5
Annual Mktg Exp Increase = 2.0

Defensive:
Hold Share = 10
Annual Margin Erosion = 0.5
Mktg Exp Adjustment = 0.0

EXPECTED OUTPUT — BETA PRESET
Market Demand:
Y0 $400
Y1 $460
Y2 $529
Y3 $608.35

Offensive:
Share: 10%, 11.3%, 13.7%, 16%
Sales: $40.0M, $52.2M, $72.5M, $97.3M
Gross Margin: 42%, 40.5%, 39%, 37.5%
Mktg Exp: 10%/$4.0M, 12%/$6.3M, 14%/$10.1M, 16%/$15.6M
NMC: $12.8M, $14.9M, $18.2M, $20.9M
ROS: 32%, 28.6%, 25.1%, 21.5%
ROI: 320%, 238%, 181%, 134%

Defensive:
Share: 10%, 10%, 10%, 10%
Sales: $40.0M, $46.0M, $52.9M, $60.8M
Gross Margin: 42%, 41.5%, 41%, 40.5%
Mktg Exp: 10%/$4.0M, 10%/$4.6M, 10%/$5.3M, 10%/$6.1M
NMC: $12.8M, $14.5M, $16.4M, $18.6M
ROS: 32%, 31.5%, 31%, 30.5%
ROI: 320%, 315%, 309%, 305%

ACCEPTANCE TESTS
- Year-3 Offensive NMC = $20.9M ±$0.2M
- Year-3 Defensive NMC = $18.6M ±$0.2M
- Year-3 Offensive ROS = 21.5% ±0.3pp
- Year-3 Defensive ROS = 30.5% ±0.3pp
- NMC higher plan highlighted teal.
- Lower ROS/ROI highlighted red.
- Efficiency paradox banner displays for Beta preset.
- Market demand uses compound growth.
- Offensive share interpolates linearly.
- No localStorage.
- One self-contained HTML file.
*/