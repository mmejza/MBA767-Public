/*
M11 APP 1 — PORTFOLIO INDEX CALCULATOR
Source of truth: M11_App_Specification.docx
Build exactly as a single self-contained HTML file:
M11_App1_Portfolio_Index_Calculator.html

PURPOSE
Students compute Market Attractiveness Index (MAI) and Competitive Position Index (CPI), then plot the result on the GE/McKinsey 9-cell portfolio grid.

NON-NEGOTIABLE TECH RULES
- Single HTML file with embedded CSS and JS.
- No external dependencies except Google Fonts CSS import.
- No localStorage/sessionStorage.
- No external API calls/fetch().
- No <form> tags.
- No alert()/confirm().
- Must work inside Canvas iframe and at 360px viewport width.
- All state stored only in JS variables.

DESIGN SYSTEM
Use these CSS variables exactly:
--navy:#0F2027; --teal:#0D9B87; --teal-dk:#0D7A6B;
--teal-lt:#E5F5F3; --teal-bd:#C8E8E4; --amber:#E6A800;
--amb-lt:#FFF8E6; --amb-bd:#F5D78A; --red:#C0392B;
--red-lt:#FEF5F5; --red-bd:#F5BFBF; --text:#1A2E2C;
--muted:#7A9896; --off:#F7FDFC; --bg:#F0F4F3;
--white:#FFFFFF; --border:#E8F5F3.

Import fonts:
Barlow 400/500/600 and Barlow Condensed 600/700/800.

LAYOUT
Header:
- Navy bar.
- Left: “MKT 472 · Module 11” in teal, uppercase, 10px.
- Center/title: “Portfolio Index Calculator” in white, Barlow Condensed 800, 20px.
- Right: preset buttons: “Vantage Alpha”, “Vantage Beta”, “Reset”.

Tabs:
1. MAI Calculator
2. CPI Calculator
3. Portfolio Grid

Active tab uses teal text and teal bottom border.

Responsive:
- Desktop ≥768px: two-column layout, inputs left, computed outputs right.
- Mobile: single column.

APP STRUCTURE
Tab A: MAI Calculator
Dimension weights are fixed:
- Market Forces = 30%
- Competitive Environment = 40%
- Market Access = 30%

MAI metrics and default editable relative importance:
Market Forces:
- Market Size: 40%
- Growth Rate: 30%
- Buyer Power: 30%

Competitive Environment:
- Price Rivalry: 50%
- Ease of Entry: 30%
- # of Competitors: 20%

Market Access:
- Customer Familiarity: 40%
- Channel Access: 40%
- Sales Requirements: 20%

Each metric has editable:
- Relative importance %
- Rating 0–100

Formula:
metricScore = relativeImportanceDecimal * rating
dimensionScore = sum(metricScores within dimension)
weightedContribution = dimensionWeightDecimal * dimensionScore
MAI = sum(weightedContributions)

Validation:
If relative importance values within any dimension do not sum to 100%, show amber warning:
“Metric weights must sum to 100%”
Disable MAI output until resolved.

MAI banner:
- Navy background.
- Label “MAI =”
- Value amber, 28px, Barlow Condensed 800.
- Zone badge:
  <=33 Low
  34–67 Medium
  >=68 High

Sensitivity table:
Show MAI at:
- −20% ratings
- −10% ratings
- Current
- +10% ratings
- +20% ratings
Apply variation to all 9 ratings simultaneously.
Clamp ratings to 0–100.
Highlight Current row in teal.

Button:
“Plot on Grid →” switches to Tab C and plots current MAI.

Tab B: CPI Calculator
Same structure as MAI, but with permanent amber warning:
“CPI Rating Scale: 0 = Considerably Behind Competitors · 100 = Considerably Ahead. This is DIFFERENT from the MAI scale.”

Dimension weights:
- Differentiation Advantage = 40%
- Cost Advantage = 40%
- Marketing Advantage = 20%

Metrics and default editable relative importance:
Differentiation Advantage:
- Product Quality: 40%
- Service Quality: 30%
- Brand Image / Reputation: 30%

Cost Advantage:
- Cost of Goods Sold: 70%
- Marketing & Sales Expenses: 20%
- Overhead Expenses: 10%

Marketing Advantage:
- Market Share: 40%
- Brand Awareness: 30%
- Distribution: 30%

Formula:
metricScore = relativeImportanceDecimal * rating
dimensionScore = sum(metricScores)
weightedContribution = dimensionWeightDecimal * dimensionScore
CPI = sum(weightedContributions)

CPI banner:
Same as MAI but label “CPI =”.

Tab C: Portfolio Grid
Create 3x3 CSS grid.
Y-axis = MAI:
- High top
- Medium middle
- Low bottom

X-axis = CPI:
- Low left
- Medium center
- High right

Thresholds:
- Low: 0–33
- Medium: 34–67
- High: 68–100

Cell strategies:
High MAI / High CPI: Invest to Grow / Protect Position / Offensive
High MAI / Medium CPI: Invest to Grow / Improve Position / Offensive
High MAI / Low CPI: New Market Entry / Improve Position / Offensive
Medium MAI / High CPI: Protect Position / Optimize Position / Defensive
Medium MAI / Medium CPI: Improve Position / Optimize Position / Judgment
Medium MAI / Low CPI: Improve Position / Optimize Position / Judgment
Low MAI / High CPI: Optimize Position / Monetize / Defensive
Low MAI / Medium CPI: Monetize / Harvest-Divest / Defensive
Low MAI / Low CPI: Harvest / Divest / Defensive

Grid requirements:
- Active cell gets amber 2px border and box shadow.
- Plot coordinate dot proportionally using CPI as x-position and MAI as y-position.
- Dot: 12px, navy fill, teal border 2px.
- Below grid show: MAI: [value] ([zone]) | CPI: [value] ([zone]).
- Recommendation box: navy background, teal label, amber strategy name, type badge.

PRESETS

Vantage Alpha MAI:
Market Size 40%, rating 70
Growth Rate 30%, rating 40
Buyer Power 30%, rating 60
Price Rivalry 50%, rating 50
Ease of Entry 30%, rating 60
# Competitors 20%, rating 50
Customer Familiarity 40%, rating 80
Channel Access 40%, rating 90
Sales Requirements 20%, rating 70
Expected MAI = 63.2, Medium

Vantage Alpha CPI:
Product Quality 40%, rating 85
Service Quality 30%, rating 75
Brand Image / Reputation 30%, rating 80
Cost of Goods Sold 70%, rating 70
Marketing & Sales Expenses 20%, rating 75
Overhead Expenses 10%, rating 65
Market Share 40%, rating 80
Brand Awareness 30%, rating 75
Distribution 30%, rating 70
Expected CPI = 75.5, High
Grid = Medium MAI / High CPI
Recommended = Protect Position / Optimize Position
Type = Defensive

Vantage Beta MAI:
Market Size 40%, rating 60
Growth Rate 30%, rating 90
Buyer Power 30%, rating 50
Price Rivalry 50%, rating 40
Ease of Entry 30%, rating 30
# Competitors 20%, rating 50
Customer Familiarity 40%, rating 50
Channel Access 40%, rating 60
Sales Requirements 20%, rating 40
Expected MAI = 51.0, Medium

Vantage Beta CPI:
Product Quality 40%, rating 50
Service Quality 30%, rating 55
Brand Image / Reputation 30%, rating 40
Cost of Goods Sold 70%, rating 55
Marketing & Sales Expenses 20%, rating 60
Overhead Expenses 10%, rating 50
Market Share 40%, rating 35
Brand Awareness 30%, rating 40
Distribution 30%, rating 45
Expected CPI = 49.5, Medium
Grid = Medium MAI / Medium CPI
Recommended = Improve Position / Optimize Position
Type = Judgment

ACCEPTANCE TESTS
- Alpha MAI = 63.2 ±0.1
- Alpha CPI = 75.5 ±0.1
- Beta MAI = 51.0 ±0.1
- Beta CPI = 49.5 ±0.1
- Alpha grid = Medium MAI / High CPI
- Beta grid = Medium MAI / Medium CPI
- CPI warning permanently visible.
- Sensitivity table has 5 rows.
- No localStorage.
- One self-contained HTML file.
*/