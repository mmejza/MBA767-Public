/*
M10 APP 1 — CRI & MEDIA PLANNER
File: m10_app1_cri_media_planner.html

Build one self-contained HTML file with inline CSS and JS.

NON-NEGOTIABLES
- Canvas iframe-safe.
- No server calls.
- No localStorage, sessionStorage, cookies, database, or API.
- Google Fonts import acceptable; no other dependencies.
- State is in-memory only.
- Presets must populate Tab A and Tab B simultaneously.
- Manual Tab A slider changes must NOT affect Tab B values.

PEDAGOGICAL PURPOSE
Students discover that higher GRP does not guarantee higher CRI.
The “High GRP / Low Comprehension” preset must show:
- CRI = 3.80%, down from baseline 4.41%
- GRP = 375, up from baseline 240
The persistent comparison banner must always show both CRI and GRP.

VISUAL SYSTEM
Use clean analytical styling matching slide viewer:
- Navy: #0F2A4A
- Accent blue: #1D6FA4
- Gold: #C8932A
- IBM Plex Sans preferred; system-ui fallback
- No horizontal scroll at 900px iframe width

APP STRUCTURE
Two tabs:
1. Tab A — CRI Calculator
2. Tab B — Media Mix Calculator

Persistent comparison banner above tabs:
CRI = [current Tab A CRI]% | GRP = [current Tab B GRP]

PRESETS
Preset options:
- Baseline Campaign
- High GRP / Low Comprehension
- Reset = Baseline Campaign

Preset selection updates both tabs at once.

TAB A — CRI CALCULATOR

Inputs:
- Exposure %, slider, 0–100, default 75, step 1
- Awareness %, slider, 0–100, default 68, step 1
- Comprehension %, slider, 0–100, default 43, step 1
- Intention %, slider, 0–100, default 33, step 1
- Purchase %, slider, 0–100, default 61, step 1
- Target Market fixed display = 500,000 households

Formula:
CRI = Exposure × Awareness × Comprehension × Intention × Purchase
Use decimal form for calculation.

Outputs:
- CRI, format X.XX%, large, minimum 32px
- Estimated Buyers = Target Market × CRI, integer comma-formatted
- Weakest Stage = argmin of the five stage percentages
- Weakest Rate = minimum stage percentage
- Horizontal stage bar chart for all five stages
- Weakest stage bar highlighted gold/amber; others navy

CRI color:
- Green if above 4%
- Amber if 2%–4%
- Red if below 2%

TAB B — MEDIA MIX CALCULATOR

Inputs:
- Reach %, number input or slider, default 60, range 1–100, whole numbers
- Frequency, number input, default 4.0, range 0.5–10.0, step 0.5
- CPM Rate, number input, default 18.00, range 1.00–200.00
- Target Market fixed display = 500,000 households

Formulas:
GRP = Reach × Frequency
Total Impressions = Target Market × (Reach / 100) × Frequency
Total Media Cost = (Total Impressions / 1000) × CPM Rate
Cost per GRP = Total Media Cost / GRP
Reach Households = Target Market × (Reach / 100)

Outputs:
- GRP, large, minimum 32px
- Total Impressions, integer comma-formatted
- Total Media Cost, dollar-formatted, 0 decimals
- Cost per GRP, $XX.XX
- Reach households, comma-formatted
- Static benchmark reference:
  “Industry CPM benchmark: $5–$25 consumer media; $50–$150 B2B media.”

PRESET DATA

Baseline Campaign:
Tab A:
Exposure 75
Awareness 68
Comprehension 43
Intention 33
Purchase 61

Tab B:
Reach 60
Frequency 4.0
CPM 18.00

Expected outputs:
CRI = 4.41%
Estimated Buyers = 22,072
Weakest Stage = Intention
Weakest Rate = 33%
GRP = 240
Total Impressions = 1,200,000
Media Cost = $21,600
Cost per GRP = $90.00

High GRP / Low Comprehension:
Tab A:
Exposure 90
Awareness 75
Comprehension 28
Intention 33
Purchase 61

Tab B:
Reach 75
Frequency 5.0
CPM 18.00

Expected outputs:
CRI = 3.80%
Estimated Buyers = 19,022
Weakest Stage = Comprehension
Weakest Rate = 28%
GRP = 375
Total Impressions = 1,875,000
Media Cost = $33,750
Cost per GRP = $90.00

ACCEPTANCE TESTS
- Baseline CRI = 4.41%
- Baseline GRP = 240
- High GRP / Low Comprehension CRI = 3.80%
- High GRP / Low Comprehension GRP = 375
- Persistent banner always displays current CRI and GRP
- Presets update both tabs simultaneously
- Manual Tab A changes do not overwrite Tab B inputs
- Reset restores Baseline Campaign
*/