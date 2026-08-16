/*
M10 APP 2 — ADVERTISING CARRYOVER CALCULATOR
File: m10_app2_carryover_calculator.html

Build one self-contained HTML file with inline CSS and JS.

NON-NEGOTIABLES
- Canvas iframe-safe.
- No server calls.
- No localStorage, sessionStorage, cookies, database, or API.
- Google Fonts import acceptable; no other dependencies.
- State is in-memory only.
- Single-panel layout; no tabs.
- All inputs and outputs visible together.
- Sliders and number inputs must stay synchronized.

PEDAGOGICAL PURPOSE
Students see why current-period ROI understates advertising value when carryover exists.
The app must show short-run ROI and total-impact ROI side by side and explain the missing future sales value.

DEFAULT VALUES
These intentionally match the Hart Schaffner Marx chapter example, not the Apex Audio case:
- Ad Spend = $20M
- Ad-to-Sales Multiplier = 12
- Carryover Coefficient c = 0.50
- Contribution Margin = 45%
- Periods to Project = 8

VISUAL SYSTEM
Match App 1 and slide viewer:
- Navy: #0F2A4A
- Accent blue: #1D6FA4
- Gold: #C8932A
- IBM Plex Sans preferred; system-ui fallback
- Current and Total Impact displayed in 36px+ numerals
- Clean table, alternating rows, navy header
- Bar chart with period 1 navy and later bars lighter blue

INPUTS
Each input uses synchronized slider + number input:
- Ad Spend ($M): default 20, range 1–100, step 1
- Ad-to-Sales Multiplier: default 12, range 1–20, step 1
- Carryover Coefficient c: default 0.50, range 0.00–0.90, step 0.05
- Contribution Margin %: default 45, range 10–80, step 1
- Periods to Project: default 8, range 2–12, step 1

Important:
Carryover coefficient label displays decimal format, e.g., 0.50, not 50%.

FORMULAS
Current-Period Sales Impact = Multiplier × Ad Spend
Total Multi-Period Impact = Current / (1 - c)
Total Profit Impact = Total Multi-Period Impact × Contribution Margin
Short-Run ROI = (Current × Contribution Margin) / Ad Spend
Total-Impact ROI = Total Profit Impact / Ad Spend
Current Period as % of Total = Current / Total × 100
ROI Gap = Total-Impact ROI / Short-Run ROI
Missing Future Sales = Total Multi-Period Impact - Current

PERIOD TABLE
Rows = Periods to Project.
Columns:
- Period
- Carryover Factor
- Sales Impact
- Profit Impact
- Cumulative Impact

Carryover Factor:
- Period 1 = 1.000
- Period n = c^(n - 1)

Sales Impact:
Current × Carryover Factor

Profit Impact:
Sales Impact × Contribution Margin

Cumulative Impact:
Running sum of Sales Impact

Important:
The finite table cumulative will approach but not equal the formula total. Display both:
- Table cumulative impact
- Formula total impact

BAR CHART
Show Sales Impact by period.
Bars diminish geometrically.
Period 1 navy; later periods lighter blue.
No legend required.

DEFAULT EXPECTED OUTPUTS
At defaults:
- Current-Period Sales Impact = $240M
- Total Multi-Period Impact = $480M
- Total Profit Impact = $216M
- Short-Run ROI = 5.40x
- Total-Impact ROI = 10.80x
- Current Period as % of Total = 50%
- Gap Indicator = Total ROI is 2.00x higher than short-run alone
- Missing Future Sales = $240M

Default period table, 8 periods, c = 0.50:
Period 1: factor 1.000, sales $240.0M, profit $108.0M, cumulative $240.0M
Period 2: factor 0.500, sales $120.0M, profit $54.0M, cumulative $360.0M
Period 3: factor 0.250, sales $60.0M, profit $27.0M, cumulative $420.0M
Period 4: factor 0.125, sales $30.0M, profit $13.5M, cumulative $450.0M
Period 5: factor 0.063, sales $15.0M, profit $6.8M, cumulative $465.0M
Period 6: factor 0.031, sales $7.5M, profit $3.4M, cumulative $472.5M
Period 7: factor 0.016, sales $3.8M, profit $1.7M, cumulative $476.3M
Period 8: factor 0.008, sales $1.9M, profit $0.8M, cumulative $478.1M
Formula total = $480.0M

ROI COMPARISON PANEL
Show side by side:
- Current Period Only: Short-Run ROI
- All Periods Carryover: Total-Impact ROI
- Gap indicator
- Context line:
“A manager using short-run ROI alone is missing $XXXM in future sales.”

ACCEPTANCE TESTS
- Current-period sales impact = $240M
- Total multi-period impact = $480M
- Total profit impact = $216M
- Short-run ROI = 5.40x
- Total-impact ROI = 10.80x
- Current period as % of total = 50%
- Missing future sales = $240M
- If c changes to 0.30, total impact = approximately $343M and missing future sales = approximately $103M
- Period table row count updates when Periods to Project changes
- Total formula remains independent of Periods to Project
*/