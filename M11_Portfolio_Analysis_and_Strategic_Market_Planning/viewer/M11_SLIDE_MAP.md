# M11 — SLIDE MAP
## Portfolio Analysis & Strategic Market Planning
### Internal Planning Document · Governs S01–S21 HTML Build

---

## GOVERNING RULES (from slide-pattern-library.md + slide-style-rules.md)

- Every slide maps to ONE approved pattern — no exceptions
- No paragraph-heavy slides — max 2 lines per bullet
- Analytical tone only — no textbook language
- Every slide must DO work: teach, force, reveal, or calculate
- Worked examples MUST be split: setup slide → solution slide, never combined
- Titles must be functional — state what the slide does, not the topic
- Tables must support a decision or insight — no decorative tables
- Chapter-only content must be flagged explicitly
- Diagnostic slides create tension — do NOT interpret on the diagnostic slide
- Reveal slides resolve — must deliver a strong insight

---

## DECK ARCHITECTURE OVERVIEW

| Zone | Slides | Function |
|---|---|---|
| **Entry** | S01–S03 | Launch · Objectives · Chapter-Only Gate |
| **Foundation** | S04–S06 | Planning process · Performance criteria · Portfolio types |
| **Portfolio Visualization** | S07–S10 | Diagnostic/Reveal pair · Single-factor diagnostic/Reveal pair |
| **Multi-Factor Bridge** | S11 | Why single-factor fails |
| **Index Construction** | S12–S17 | MAI factors · MAI setup/solution · CPI factors · CPI setup/solution |
| **Strategy Selection** | S18–S19 | 9-cell grid · Practice placement |
| **Strategic Distinction** | S20–S21 | Strategic plan vs. mix · Offensive/defensive taxonomy |

**Total: 21 slides**
**Worked example pairs: 2 (S13/S14 = MAI · S16/S17 = CPI)**
**Diagnostic/Reveal pairs: 2 (S07/S08 = portfolio balance · S09/S10 = single-factor)**
**Practice slide: 1 (S19)**
**Misconception slide: 1 (S11)**

---

## SLIDE-BY-SLIDE MAP

---

### S01 — Title / Module Launch

| Field | Value |
|---|---|
| **File** | `s01-title.html` |
| **Pattern** | #1 — Title / Module Launch |
| **LO** | None (orientation only) |
| **Content source** | Standard template |
| **Chapter flag** | No |

**Slide content spec:**
```
MKT 472
Portfolio Analysis & Strategic Market Planning
Module 11 · Chapter 11
Read Chapter 11 before viewing this deck
```

**Rules check:**
- No extra content beyond template ✓
- Clean and minimal ✓
- Do NOT add subtitle, agenda, or preview text ✓

**Build notes:**
Standard title pattern. No variation from template. Functional title, module number, chapter number, reading directive.

---

### S02 — Learning Objectives

| Field | Value |
|---|---|
| **File** | `s02-objectives.html` |
| **Pattern** | #2 — Learning Objectives |
| **LO** | All (LO1–LO6) |
| **Content source** | M11 architecture Section 2 |
| **Chapter flag** | Yes — "Ch. 11 covers more than this deck" |

**Slide content spec:**
```
Learning Objectives

LO1  ANALYSIS
     Evaluate portfolio balance across life-cycle stages; identify
     long-run risk from mature-market concentration

LO2  ANALYSIS
     Distinguish GE/McKinsey multi-factor model from single-factor
     analysis; classify strategic plan vs. marketing mix actions

LO3  APPLICATION
     Calculate Market Attractiveness Index using 5-step weighted
     scoring method; interpret investment priority

LO4  APPLICATION
     Calculate Competitive Position Index; compute Share Development
     Index from market share and share potential inputs

LO5  EVALUATION
     Place a product on the 9-cell grid using MAI/CPI scores and
     0/33/67/100 thresholds; select and defend the appropriate strategy

LO6  EVALUATION
     Assess 3-year NMC, ROS, and ROI trade-offs between offensive
     and defensive strategies; explain the efficiency paradox

Ch. 11 covers more than this deck
```

**Rules check:**
- Action verbs at Bloom's level ✓
- Measurable and specific ✓
- Analytical tone ✓
- "Ch. 11 covers more" line present ✓

**Build notes:**
Six LOs is at the upper limit for one slide. Keep LO text tight — one line of action verb + one line of precise capability. Do not spill into paragraph form.

---

### S03 — Chapter-Only / Gate Content

| Field | Value |
|---|---|
| **File** | `s03-chapter-gate.html` |
| **Pattern** | #3 — Chapter-Only / Gate Content |
| **LO** | LO2, LO4, LO5, LO6, LO1 |
| **Content source** | Chapter 11 confirmed chapter-exclusive content |
| **Chapter flag** | Yes — this IS the flag slide |

**Slide content spec:**
```
WHAT CHAPTER 11 COVERS BEYOND THIS DECK

Gate 1 tests these topics. They do not appear on slides.

1. GE/McKinsey model — who developed it and what limitation
   it addresses — p. 385

2. Share Development Index formula — SDI = (MSI ÷ SPI) × 100;
   full derivation using market share performance tree — Fig. 11-5,
   pp. 380–381

3. Relative market share — definition, formula, and distinction
   from SDI — pp. 378–379

4. Offensive vs. defensive 3-year NMC/ROS/ROI comparison —
   consumer electronics data — Fig. 11-14, p. 393

5. Portfolio diversification — two levels (product + market);
   variance reduction data — Fig. 11-16, pp. 395–397
```

**Rules check:**
- Explicitly numbered ✓
- Precise page/figure references ✓
- No explanatory paragraphs ✓
- Gate 1 flag clearly stated ✓

**Build notes:**
This slide performs a critical function: it makes Gate 1 feel fair, not punitive. Students who read this slide before reading the chapter know exactly what to look for. The five items match the five Gate 1 question targets precisely.

---

### S04 — Strategic Market Planning Process

| Field | Value |
|---|---|
| **File** | `s04-planning-process.html` |
| **Pattern** | #4 — Concept Definition |
| **LO** | LO2 |
| **Content source** | Chapter 11 Fig. 11-3; Script Slide 3 |
| **Chapter flag** | No |

**Slide content spec:**
```
Strategic Market Planning

A process in which firms develop marketing strategies for sustaining
and improving short- and long-run portfolio performance.

Process flow:
Current Performance → Portfolio Analysis → Strategy & Performance Plan
                      [Market Attractiveness + Competitive Position]

Output:
Offensive strategies — grow sales, improve position, enter new markets
Defensive strategies — protect, optimize, monetize, or harvest position

Why it matters:
Without this process, resource allocation is intuition — not analysis.
```

**Rules check:**
- 1–2 sentence definition ✓
- Example via process flow (not narrative) ✓
- Why it matters is strategic, not textbook ✓
- No paragraph blocks ✓

**Build notes:**
Keep the process flow visual — three boxes with arrows, not a list. The key distinction (offensive vs. defensive outputs) must appear here to anchor the rest of the deck. Do not reproduce the full Fig. 11-3 diagram — compress to the essential logic.

---

### S05 — Business Performance Criteria

| Field | Value |
|---|---|
| **File** | `s05-performance-criteria.html` |
| **Pattern** | #14 — Classification / Typology |
| **LO** | LO1 |
| **Content source** | Chapter 11 p. 378; Script Slide 4; PPTX Slide 4 |
| **Chapter flag** | No |

**Slide content spec:**
```
Business Performance Criteria

What must be assessed before portfolio analysis begins:

Market Performance          Marketing Profitability
─────────────────           ──────────────────────
Market share position       Net Marketing Contribution
Sales growth (units)        Marketing ROS
Sales growth (dollars)      Marketing ROI

+ Traditional financial metrics (revenues, gross profit, operating profit)

Rule:
Financial metrics alone are backward-looking.
Market + marketing profitability metrics reveal competitive trajectory.
```

**Rules check:**
- Clean list structure ✓
- No long descriptions ✓
- Ends with a decision rule ✓
- Connects to prior modules (NMC, ROS, ROI already known) ✓

**Build notes:**
Students have seen NMC, ROS, ROMI in earlier modules. Frame this as "what you already know applied to a new context." The rule at the bottom is the analytical payoff — backward vs. forward-looking distinction sets up the portfolio rationale.

---

### S06 — Portfolio Visualization Approaches

| Field | Value |
|---|---|
| **File** | `s06-portfolio-types.html` |
| **Pattern** | #14 — Classification / Typology |
| **LO** | LO1 |
| **Content source** | Chapter 11 Figs. 11-1, 11-2; Script Slides 5–6; PPTX Slides 5–6 |
| **Chapter flag** | No |

**Slide content spec:**
```
Two Approaches to Portfolio Visualization

Price-Quality Portfolio          Product Life Cycle Portfolio
────────────────────             ───────────────────────────
Maps products by price and       Maps products by PLC stage
quality/brand status             and market growth rate

Example: Toyota — 3 models       Circle size = sales volume
(1960s) → 18 models/3 brands
(2010)                           Balanced: mix of emerging,
                                 growth, and mature markets
Reveals: competitive white       
space and positioning gaps       Unbalanced: all products
                                 concentrated in mature stage

Bottom takeaway:
Both models are input to portfolio analysis —
neither alone determines strategy.
```

**Rules check:**
- Side-by-side structure — adapted from Classification to Contrast since two distinct types ✓
- Concrete examples per type ✓
- Takeaway forces the "both are inputs, neither is complete" logic ✓
- No paragraph blocks ✓

**Build notes:**
Pattern adapted: uses Contrast/Distinction (#5) structure within a Classification frame. Two columns, concrete examples, one-line takeaway. Toyota and PLC examples are already in the script and PPTX — do not invent new examples.

---

### S07 — Unbalanced Portfolio Diagnostic

| Field | Value |
|---|---|
| **File** | `s07-unbalanced-diagnostic.html` |
| **Pattern** | #6 — Diagnostic Data Table |
| **LO** | LO1 |
| **Content source** | Chapter 11 Fig. 11-2 Portfolio A; Script Slide 6 |
| **Chapter flag** | No |

**Slide content spec:**
```
Meridian Industrial — Product Portfolio Snapshot

What conclusions can we draw from this data alone?

Product    Market Stage      Sales ($M)    % of Total Revenue
───────    ────────────      ──────────    ──────────────────
Alpha      Mature            $180          45%
Beta       Mature            $120          30%
Gamma      Late Growth       $60           15%
Delta      Mature            $30           8%
Epsilon    Mature/Declining  $10           2%

Total                        $400          100%

Prompt:
Based on this distribution alone → what would you predict about
this company's revenue 5 years from now?
```

**Rules check:**
- Do NOT interpret yet ✓
- Creates cognitive tension (all products in mature/declining) ✓
- Table is clean and labeled ✓
- Prompt is specific and forward-looking ✓

**Build notes:**
Meridian Industrial is a fictional diagnostic company used only for S07/S08 — distinct from the Vantage Sound Systems case company. The deliberate trap: all products in mature/declining stages looks like "stability" to students who don't yet understand portfolio balance. The reveal (S08) will confront this. Do NOT add interpretation or hint language on S07.

---

### S08 — Balanced Portfolio Reveal

| Field | Value |
|---|---|
| **File** | `s08-balanced-reveal.html` |
| **Pattern** | #7 — Reveal / Insight Slide |
| **LO** | LO1 |
| **Content source** | Chapter 11 Fig. 11-2 Portfolio B; Script Slide 7 |
| **Chapter flag** | Yes — sidebar note re: diversification variance data |

**Slide content spec:**
```
Meridian Industrial — Adding the Life Cycle Changes Everything

A portfolio weighted to mature markets looks stable today.
It is a revenue cliff in 3–5 years.

Product    Market Stage      Sales ($M)    Strategic Reality
───────    ────────────      ──────────    ─────────────────
Alpha      Mature            $180          45% of revenue — declining
Beta       Mature            $120          Shrinking market, no growth
Gamma      Late Growth       $60           Future profits, but needs investment
Delta      Mature            $30           Harvest candidate
Epsilon    Mature/Declining  $10           Exit candidate

Key reveal:
No products in Emerging or Early Growth stages.
When Alpha and Beta decline, nothing replaces them.

Takeaway:
A balanced portfolio requires products at multiple life-cycle stages —
not just profitable ones today.

⚑ Chapter-only: Diversification variance data (42%/17%/57% → 6%)
  quantifies stability benefit — see Fig. 11-16, pp. 395–397
```

**Rules check:**
- Resolves S07 cognitive tension ✓
- Strong insight delivered (revenue cliff framing) ✓
- Chapter-only flag for diversification data ✓
- Takeaway is a decision rule, not description ✓

**Build notes:**
The "revenue cliff" framing is the rhetorical punch of this slide. Students who answered "this looks stable" on S07 now see why that was wrong. The chapter-only sidebar flag is important — variance data is Gate 1 material. Keep the flag subtle (small callout box) so it doesn't dominate the slide.

---

### S09 — Single-Factor Portfolio: Diagnostic

| Field | Value |
|---|---|
| **File** | `s09-single-factor-diagnostic.html` |
| **Pattern** | #6 — Diagnostic Data Table |
| **LO** | LO2, LO3 |
| **Content source** | Chapter 11 Figs. 11-6, 11-7; Script Slides 9–10; PPTX Slides 12–15 |
| **Chapter flag** | No |

**Slide content spec:**
```
Five Product Lines — Single-Factor Analysis

Attractiveness measure: Market Growth Rate
Competitive position measure: Share Development Index (SDI)

Product    Market Growth    SDI    Sales (relative)
───────    ─────────────    ───    ────────────────
A          5%               84     ████████  Large
B          0%               65     ████      Medium
C          10%              50     ████████  Large
D          20%              32     ██        Small
E          23%              90     ██        Small

Prompt:
Before advancing → write a strategy recommendation
for each product line. Use only the data above.
```

**Rules check:**
- Do NOT interpret ✓
- Creates genuine tension — two factors pulling in different directions for some products ✓
- Prompt forces student attempt before reveal ✓
- Table is clean ✓

**Build notes:**
The diagnostic/reveal pair here (S09/S10) mimics the structure used in M01. Students are forced to commit to a recommendation before seeing the answer. The SDI column is critical — students who only read growth rate (E=23%, attractive) will miss that E is near share ceiling (SDI=90). That tension is the pedagogical engine of S10.

---

### S10 — Single-Factor Portfolio: Strategy Reveal

| Field | Value |
|---|---|
| **File** | `s10-single-factor-reveal.html` |
| **Pattern** | #7 — Reveal / Insight Slide |
| **LO** | LO2, LO3 |
| **Content source** | Chapter 11 Fig. 11-7; Script Slide 10; PPTX Slide 16 |
| **Chapter flag** | No |

**Slide content spec:**
```
Five Product Lines — Recommended Strategies

Adding strategy logic to both dimensions changes the answer.

Product    Growth    SDI    Strategy              Rationale
───────    ──────    ───    ────────              ─────────
A          5%        84     Protect Position      Near share ceiling; manage margin
B          0%        65     Harvest Share         No growth; extract profit, then exit
C          10%       50     Grow Share            Growth stage + untapped share potential
D          20%       32     Grow Share            High growth + large share gap = invest now
E          23%       90     Hold Share            High growth BUT near share ceiling

Key reveal:
E (fastest growth) → Hold Share, not Grow Share.
SDI of 90 means share potential is nearly exhausted —
investing to grow beyond this point yields diminishing returns.

Takeaway:
Two factors, not one, determine strategy.
Growth rate alone would misclassify E.
```

**Rules check:**
- Resolves S09 tension ✓
- Strong insight: E's counterintuitive strategy ✓
- Rationale column shows the analytical logic ✓
- Takeaway is a transferable rule ✓

**Build notes:**
Product E is this slide's cognitive trap resolution. Students who wrote "Invest to Grow" for E on S09 now see why that's wrong. The SDI = 90 logic (near-ceiling → diminishing returns) is the key idea. Make the E row visually distinct — bold or highlight — so it anchors the takeaway.

---

### S11 — Why Single-Factor Misleads

| Field | Value |
|---|---|
| **File** | `s11-single-factor-trap.html` |
| **Pattern** | #13 — Misconception / Trap |
| **LO** | LO2 |
| **Content source** | Chapter 11 p. 385; Script Slide 11 |
| **Chapter flag** | Yes — GE/McKinsey name is chapter-only |

**Slide content spec:**
```
"High market growth rate = attractive market"

Why it seems correct:
Growth means rising demand → more sales opportunity → easier to gain share
Product D (20% growth) clearly warrants more investment than Product B (0%)

Why it is wrong:
Growth rate alone ignores:
  · Market size — a 20% growth market of $10M is less attractive
    than a 5% growth market of $5B
  · Competitive intensity — high growth attracts more entrants,
    eroding margin
  · Market access — growth means nothing if distribution is blocked

Correct rule:
Market attractiveness requires a multi-factor index.
Growth rate is one input — not the answer.

⚑ Chapter-only: The GE/McKinsey model (p. 385) formalizes this.
  Gate 1 tests who developed it and why.
```

**Rules check:**
- Explicitly confronts the error ✓
- "Why it seems correct" is a real argument, not a straw man ✓
- "Why it is wrong" gives specific counter-evidence ✓
- Correct rule replaces the misconception with a decision rule ✓
- Chapter-only flag for GE/McKinsey name ✓

**Build notes:**
The chapter-only callout on this slide does double duty: it flags Gate 1 content AND motivates reading (students who want to know "who developed it" have a reason to open the chapter). Keep the flag as a small callout — this is not a content delivery slide, it is a misconception correction slide.

---

### S12 — Market Attractiveness Factors

| Field | Value |
|---|---|
| **File** | `s12-mai-factors.html` |
| **Pattern** | #14 — Classification / Typology |
| **LO** | LO3 |
| **Content source** | Chapter 11 Fig. 11-9, p. 387; Script Slide 12 |
| **Chapter flag** | No |

**Slide content spec:**
```
Market Attractiveness — Three Dimensions, Nine Factors

Market Forces (30%)          Competitive Environment (40%)    Market Access (30%)
───────────────              ──────────────────────           ──────────────────
Market Size                  Price Rivalry                    Customer Familiarity
Growth Rate                  Ease of Competitor Entry         Channel Access
Buyer Power                  Number of Competitors            Sales Requirements

Dimension importance weights must sum to 100%
Metric importance weights within each dimension must sum to 100%
Attractiveness ratings: 0 (Very Unattractive) → 100 (Very Attractive)

Note: Example weights shown. Actual weights vary by industry and firm context.
```

**Rules check:**
- Clean three-column classification ✓
- Weights stated explicitly (required for S13 setup) ✓
- Rating scale labeled ✓
- No long descriptions ✓

**Build notes:**
This is a reference/setup slide for S13. The three-column layout mirrors Fig. 11-9. The example weights (30/40/30) are the chapter's worked example — state them as "example weights" not as universal constants. Students need these numbers to follow S13's worked example.

---

### S13 — MAI Calculation: Setup

| Field | Value |
|---|---|
| **File** | `s13-mai-setup.html` |
| **Pattern** | #9 — Worked Example — Setup |
| **LO** | LO3 |
| **Content source** | Chapter 11 Fig. 11-10, p. 387 |
| **Chapter flag** | No |

**Slide content spec:**
```
Market Attractiveness Index — Attempt Before Advancing

PROBLEM SETUP (Chapter 11, Fig. 11-10)

Market Forces (Dimension weight: 30%)
  Metric              Rel. Importance    Attractiveness Rating    Score
  ──────              ───────────────    ─────────────────────    ─────
  Market Size         40%                80                       ?
  Growth Rate         30%                60                       ?
  Buyer Power         30%                40                       ?
                                         Dimension Score →        ?

Competitive Environment (Dimension weight: 40%)
  Price Rivalry       50%                40                       ?
  Ease of Entry       30%                40                       ?
  # of Competitors    20%                60                       ?
                                         Dimension Score →        ?

Market Access (Dimension weight: 30%)
  Customer Fam.       40%                80                       ?
  Channel Access      40%                100                      ?
  Sales Req.          20%                60                       ?
                                         Dimension Score →        ?

Q1: Calculate each metric's attractiveness score (Rel. Importance × Rating)
Q2: Calculate each dimension score (sum of metric scores)
Q3: Calculate the overall MAI (sum of weighted dimension scores)

FORMULA:
MAI = Σ (Dimension Weight × Dimension Score)

Your working space:
```

**Rules check:**
- Invites student attempt ("Attempt Before Advancing") ✓
- All inputs provided — no solution content ✓
- Questions are specific and sequential ✓
- Formula stated ✓
- Working space note included ✓

**Build notes:**
The ? values in the Score column are the key visual signal — they tell students exactly what to compute. All inputs (weights, ratings) are provided. The three-section table structure mirrors Fig. 11-10 exactly. This is a dense slide by necessity — it is a calculation table. Maintain readability with clear column alignment and horizontal rules between dimensions.

---

### S14 — MAI Calculation: Solution

| Field | Value |
|---|---|
| **File** | `s14-mai-solution.html` |
| **Pattern** | #10 — Worked Example — Solution |
| **LO** | LO3 |
| **Content source** | Chapter 11 Fig. 11-10, p. 387 |
| **Chapter flag** | No |

**Slide content spec:**
```
Market Attractiveness Index — Solution

Market Forces (30%)
  Market Size:    40% × 80 = 32
  Growth Rate:    30% × 60 = 18
  Buyer Power:    30% × 40 = 12
  Dimension Score = 62    →    Weighted: 30% × 62 = 18.6

Competitive Environment (40%)
  Price Rivalry:  50% × 40 = 20
  Ease of Entry:  30% × 40 = 12
  # Competitors:  20% × 60 = 12
  Dimension Score = 44    →    Weighted: 40% × 44 = 17.6

Market Access (30%)
  Cust. Fam.:     40% × 80 = 32
  Channel:        40% × 100 = 40
  Sales Req.:     20% × 60 = 12
  Dimension Score = 84    →    Weighted: 30% × 84 = 25.2

MAI = 18.6 + 17.6 + 25.2 = 61

Answer: MAI = 61 → Moderate attractiveness zone (34–67)

Key takeaway:
Competitive environment (score = 44) drags the index down
despite strong market access (84). A manager reading only
growth rate would miss the pricing and entry threat entirely.
```

**Rules check:**
- Clear step-by-step calculation ✓
- Answer explicitly stated with zone classification ✓
- Key takeaway is analytical interpretation, not description ✓
- No new inputs introduced ✓

**Build notes:**
The key takeaway must do interpretive work — not just "MAI = 61." The insight is that competitive environment (44) is the drag factor, and growth rate alone would have missed it. This is the payoff that justifies the multi-factor approach introduced in S11. Connect back explicitly.

---

### S15 — Competitive Position Factors

| Field | Value |
|---|---|
| **File** | `s15-cpi-factors.html` |
| **Pattern** | #14 — Classification / Typology |
| **LO** | LO4 |
| **Content source** | Chapter 11 Fig. 11-11, p. 388; Script Slide 14 |
| **Chapter flag** | No |

**Slide content spec:**
```
Competitive Position — Three Dimensions, Nine Factors

Differentiation Advantage (40%)    Cost Advantage (40%)    Marketing Advantage (20%)
──────────────────────────         ─────────────────       ─────────────────────────
Product Quality                    Cost of Goods Sold      Market Share
Service Quality                    Mktg & Sales Expenses   Brand Awareness
Brand Image / Reputation           Overhead Expenses       Distribution

Rating scale: 0 (Considerably Behind) → 100 (Considerably Ahead)

⚠ Rating scale differs from MAI:
  MAI = market quality (0 = unattractive market)
  CPI = relative standing vs. competitors (0 = considerably behind)
  Same 0–100 range — different anchors — different meaning
```

**Rules check:**
- Clean three-column classification ✓
- Rating scale explicitly labeled ✓
- Scale difference from MAI flagged — critical distinction ✓
- No long descriptions ✓

**Build notes:**
The warning callout (⚠) is mandatory. Students will confuse MAI and CPI ratings if this distinction is not stated explicitly. A rating of 40 in MAI means "somewhat unattractive market." A rating of 40 in CPI means "somewhat behind competitors." Same number, completely different meaning. This is the #1 calculation error in the case.

---

### S16 — CPI Calculation: Setup

| Field | Value |
|---|---|
| **File** | `s16-cpi-setup.html` |
| **Pattern** | #9 — Worked Example — Setup |
| **LO** | LO4 |
| **Content source** | Chapter 11 Fig. 11-12, p. 389 |
| **Chapter flag** | No |

**Slide content spec:**
```
Competitive Position Index — Attempt Before Advancing

PROBLEM SETUP (Chapter 11, Fig. 11-12)

Differentiation Advantage (Dimension weight: 40%)
  Metric              Rel. Importance    Rating    Score
  ──────              ───────────────    ──────    ─────
  Product Quality     40%                80        ?
  Service Quality     30%                60        ?
  Brand Image         30%                80        ?
                                         Dim. Score →    ?

Cost Advantage (Dimension weight: 40%)
  COGS                70%                40        ?
  Mktg Expenses       20%                60        ?
  Overhead            10%                60        ?
                                         Dim. Score →    ?

Marketing Advantage (Dimension weight: 20%)
  Market Share        40%                40        ?
  Brand Awareness     30%                40        ?
  Distribution        30%                20        ?
                                         Dim. Score →    ?

Q1: Calculate each metric score
Q2: Calculate each dimension score
Q3: Calculate the overall CPI

FORMULA:
CPI = Σ (Dimension Weight × Dimension Score)

Your working space:
```

**Rules check:**
- Parallel structure to S13 — students recognize the pattern ✓
- All inputs provided — no solution content ✓
- Rating scale is 0=behind/100=ahead (from S15) — students should recall ✓
- Working space note ✓

**Build notes:**
Intentionally parallel to S13 in structure. Students who understood S13 should be able to navigate S16 independently. The Marketing Advantage dimension has low scores (40, 40, 20) — this will produce a low weighted contribution (CPI drag point), mirroring what Competitive Environment did to MAI. S17's takeaway will exploit this parallel.

---

### S17 — CPI Calculation: Solution

| Field | Value |
|---|---|
| **File** | `s17-cpi-solution.html` |
| **Pattern** | #10 — Worked Example — Solution |
| **LO** | LO4 |
| **Content source** | Chapter 11 Fig. 11-12, p. 389 |
| **Chapter flag** | No |

**Slide content spec:**
```
Competitive Position Index — Solution

Differentiation Advantage (40%)
  Product Quality:   40% × 80 = 32
  Service Quality:   30% × 60 = 18
  Brand Image:       30% × 80 = 24
  Dimension Score = 74    →    Weighted: 40% × 74 = 29.6

Cost Advantage (40%)
  COGS:              70% × 40 = 28
  Mktg Expenses:     20% × 60 = 12
  Overhead:          10% × 60 = 6
  Dimension Score = 46    →    Weighted: 40% × 46 = 18.4

Marketing Advantage (20%)
  Market Share:      40% × 40 = 16
  Brand Awareness:   30% × 40 = 12
  Distribution:      30% × 20 = 6
  Dimension Score = 34    →    Weighted: 20% × 34 = 6.8

CPI = 29.6 + 18.4 + 6.8 = 55

Answer: CPI = 55 → Moderate competitive position (34–67)

Key takeaway:
Strong differentiation (74) is almost entirely offset by weak
marketing advantage (34). Distribution score of 20 is the
single largest drag. Improving distribution = highest CPI
leverage point for this brand.
```

**Rules check:**
- Step-by-step calculation ✓
- Answer with zone classification ✓
- Key takeaway identifies the specific drag factor and strategic implication ✓
- "Highest leverage point" framing connects to decision-making ✓

**Build notes:**
The key takeaway should go one step further than "CPI = 55." The insight that distribution (score = 20) is the single largest drag, and therefore the highest-leverage improvement target, is the kind of analytical move students need to replicate in the case. Make this explicit.

---

### S18 — 9-Cell Grid and Strategy Zones

| Field | Value |
|---|---|
| **File** | `s18-portfolio-grid.html` |
| **Pattern** | #15 — Portfolio / Matrix |
| **LO** | LO5 |
| **Content source** | Chapter 11 Fig. 11-13, p. 390 |
| **Chapter flag** | No |

**Slide content spec:**
```
GE/McKinsey Portfolio Grid — Strategy Selection

                    Competitive Position
                    Low (0–33)        Med (34–67)       High (68–100)
                    ──────────        ───────────       ────────────
Market    High      New Market        Invest to Grow    Invest to Grow
Attrac-   (68–100)  Entry /           Improve Position  Protect Position
tiveness            Improve Pos.
          ─────────────────────────────────────────────────────────
          Med       Improve Pos.      Improve Pos.      Protect Pos.
          (34–67)   Optimize Pos.     Optimize Pos.     Optimize Pos.
          ─────────────────────────────────────────────────────────
          Low       Monetize /        Monetize /        Optimize Pos.
          (0–33)    Harvest /         Harvest /         Monetize /
                    Divest            Divest            Harvest

Thresholds: Low = 0–33 · Medium = 34–67 · High = 68–100 (both axes)

Bottom rule:
Offensive strategies occupy top/right zones.
Defensive strategies occupy bottom/left zones.
Center cell = judgment call based on life-cycle stage and trend.
```

**Rules check:**
- Threshold numbers stated explicitly (0/33/67/100) — chapter-exclusive ✓
- Must guide action, not just describe zones ✓
- Bottom rule is a decision rule ✓
- 7 strategies mapped to grid positions ✓

**Build notes:**
The threshold numbers (0/33/67/100) are chapter-exclusive content — they appear in Zi-Tech's Fig. 11-18 gridlines. They are Gate 2 material (G2-Q3). State them visibly on this slide. The grid table layout needs careful HTML construction — 3×3 with MAI on Y-axis and CPI on X-axis, matching chapter orientation.

---

### S19 — Grid Placement: Practice

| Field | Value |
|---|---|
| **File** | `s19-grid-practice.html` |
| **Pattern** | #12 — Practice / Missing Values |
| **LO** | LO5 |
| **Content source** | S13/S14 results (MAI=61) + S16/S17 results (CPI=55) |
| **Chapter flag** | No |

**Slide content spec:**
```
Where Does This Brand Belong?

Attempt before advancing

From your calculations:
  MAI = 61  (from the worked example, Slides 13–14)
  CPI = 55  (from the worked example, Slides 16–17)

                    Competitive Position
                    Low (0–33)    Med (34–67)    High (68–100)
Market    High      ?             ?              ?
Attrac-   (34–67)   ?             [HERE?]        ?
tiveness
          Low       ?             ?              ?

Goal:
1. Identify which cell MAI=61, CPI=55 falls in
2. Name the applicable strategies from that cell
3. Classify each as offensive or defensive
4. Identify which strategy you would recommend — and why

Your working space:
```

**Rules check:**
- Requires computation (threshold classification) ✓
- No answers given ✓
- Connects directly to preceding worked examples ✓
- Multiple sub-questions force full analysis ✓

**Build notes:**
MAI=61 and CPI=55 both fall in the medium zone (34–67), placing this brand in the center cell. The applicable strategies are Improve Position and Optimize Position. The practice question forces students to (a) correctly apply thresholds, (b) retrieve strategy names from S18, and (c) make a judgment call between improve vs. optimize based on context. The "why" question sets up the case. Do not hint at the answer.

---

### S20 — Strategic Plan vs. Marketing Mix

| Field | Value |
|---|---|
| **File** | `s20-strategic-vs-mix.html` |
| **Pattern** | #5 — Contrast / Distinction |
| **LO** | LO2 |
| **Content source** | Chapter 11 pp. 397–398; Script Slide 17; PPTX Slide 25 |
| **Chapter flag** | No |

**Slide content spec:**
```
Strategic Market Plan vs. Marketing Mix Strategy

Strategic Market Plan            Marketing Mix Strategy
─────────────────────            ──────────────────────
Time horizon: 3–5 years          Time horizon: 1 year

Sets objectives for:             Specifies tactics for:
· Market share position          · Product positioning
· Sales growth target            · Pricing approach
· Long-run profit (NMC)          · Marketing communications
                                 · Channel / distribution

Reviewed: annually against       Reviewed: quarterly; adjusted
long-run trajectory              when market conditions shift

Example: "Grow Beta's share      Example: "Reduce Beta's price
from 10% to 16% in 3 years"     5% and increase digital ad
                                 spend by $400K this quarter"

Bottom takeaway:
Strategy sets the destination.
Marketing mix is how you navigate to it — adjusted along the way.
```

**Rules check:**
- Side-by-side structure ✓
- Concrete examples per column ✓
- Takeaway is a decision rule (not just a description) ✓
- No paragraph blocks ✓

**Build notes:**
The examples column is critical — abstract definitions without examples do not pass the style rules. Use Beta (from the case) as the example to maintain coherence across the deck. The "destination vs. navigation" metaphor (echoing the chapter's cruise-ship analogy) is acceptable as a bridge but must not dominate — examples do the real work.

---

### S21 — Offensive and Defensive Strategy Taxonomy

| Field | Value |
|---|---|
| **File** | `s21-strategy-taxonomy.html` |
| **Pattern** | #14 — Classification / Typology |
| **LO** | LO5, LO6 |
| **Content source** | Chapter 11 Fig. 11-15, pp. 391–392; Script Slides 19–21 |
| **Chapter flag** | Yes — Monetize/Harvest/Divest operational detail |

**Slide content spec:**
```
Strategic Market Plans — Seven Strategies

OFFENSIVE (attractive markets / strong or improvable position)
────────────────────────────────────────────────────────────
Invest to Grow        Grow market demand or grow market share
Improve Position      Strengthen competitive position in attractive segment
New Market Entry      Enter new attractive markets or develop new product-markets

DEFENSIVE (mature markets / established position)
─────────────────────────────────────────────────
Protect Position      Protect market share and competitive advantage
Optimize Position     Maximize profit at late-growth / mature stage
Monetize              Manage for maximum cash flow; limit investment
Harvest / Divest      Extract short-run profit; prepare to exit

⚑ Chapter-only: Operational detail of Monetize, Harvest, and Divest
  (pricing mechanics, payment terms, exit conditions) — pp. 391–392
  Gate 1 may test Zi-Tech's harvest mechanism
```

**Rules check:**
- Clean list structure with one-line objective per strategy ✓
- Offensive/defensive grouping mirrors Fig. 11-15 ✓
- Chapter-only flag for operational detail ✓
- No long descriptions ✓

**Build notes:**
Seven strategies, one line each. The chapter-only flag serves students who want more — specifically the Monetize/Harvest/Divest mechanics tested in Gate 1 V4. Keep this slide as a clean reference taxonomy. The case will require students to apply these labels — this slide is the lookup table they need.

---

## SELF-AUDIT — PRE-BUILD CHECKLIST

| Check | Status | Notes |
|---|---|---|
| Every slide maps to an approved pattern | ✓ | All 15 patterns used: #1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 — patterns 8 and 11 unused (no standalone formula or strategy comparison slides — both content types embedded in worked examples and typology slides) |
| No paragraph-heavy slides | ✓ | All slides use bullets, tables, or structured lists |
| LO tags consistent | ✓ | LO1=S05-S08; LO2=S04,S06,S09-S11,S20-S21; LO3=S12-S14; LO4=S15-S17; LO5=S18-S19,S21; LO6=S21 |
| Tables are clean and readable | ✓ | S07,S08,S09,S10,S13,S14,S16,S17,S18,S19 all contain tables — each supports a decision or calculation |
| Examples split into setup/solution | ✓ | S13/S14 = MAI pair; S16/S17 = CPI pair |
| Tone is analytical, not explanatory | ✓ | No "this shows that" language in any spec |
| Diagnostic slides create tension without interpreting | ✓ | S07, S09 — both end with a prompt, no answer |
| Reveal slides deliver strong insight | ✓ | S08: revenue cliff; S10: Product E counterintuitive strategy |
| Chapter-only flags present where required | ✓ | S03 (full gate slide), S08, S11, S15, S21 |
| Titles are functional | ✓ | All 21 titles state what the slide does |
| Patterns 8 and 11 not used | NOTED | Pattern 8 (Formula) not needed as standalone — MAI/CPI formulas embedded in S13/S16 setup slides. Pattern 11 (Strategy Comparison) not needed — offensive vs. defensive comparison handled as Classification (S21) + Contrast (S20). No content forced to fit unused patterns. |

---

## PATTERN USAGE SUMMARY

| Pattern | Slides | Count |
|---|---|---|
| #1 Title | S01 | 1 |
| #2 Learning Objectives | S02 | 1 |
| #3 Chapter-Only Gate | S03 | 1 |
| #4 Concept Definition | S04 | 1 |
| #5 Contrast / Distinction | S06, S20 | 2 |
| #6 Diagnostic Data Table | S07, S09 | 2 |
| #7 Reveal / Insight | S08, S10 | 2 |
| #8 Formula / Equation | — | 0 |
| #9 Worked Example Setup | S13, S16 | 2 |
| #10 Worked Example Solution | S14, S17 | 2 |
| #11 Strategy Comparison Table | — | 0 |
| #12 Practice / Missing Values | S19 | 1 |
| #13 Misconception / Trap | S11 | 1 |
| #14 Classification / Typology | S05, S12, S15, S21 | 4 |
| #15 Portfolio / Matrix | S18 | 1 |
| **Total** | | **21** |

---

## LO COVERAGE MAP

| LO | Slides | Gate coverage |
|---|---|---|
| LO1 | S05, S07, S08 | G1-Q5; G2-Q8 |
| LO2 | S04, S06, S09, S10, S11, S20, S21 | G1-Q1; G2-Q7 |
| LO3 | S09, S10, S12, S13, S14 | G1-Q2,Q3; G2-Q1,Q5 |
| LO4 | S15, S16, S17 | G1-Q2,Q3; G2-Q2 |
| LO5 | S18, S19, S21 | G2-Q3,Q4,Q6 |
| LO6 | S21 | G1-Q4; G2-Q4,Q6 |

All 6 LOs covered in slides. All 6 LOs covered in gates. ✓

---

## CHAPTER FLAG SUMMARY

| Slide | Flag content | Gate target |
|---|---|---|
| S03 | Full gate slide — all 5 chapter-exclusive topics | Gate 1 Q1–Q5 |
| S08 | Diversification variance data — Fig. 11-16 | Gate 1 Q5 |
| S11 | GE/McKinsey model name | Gate 1 Q1 |
| S15 | CPI vs MAI rating scale distinction | Gate 2 Q2 |
| S21 | Monetize/Harvest/Divest operational detail | Gate 1 V4 Q4 |

---

## DEPENDENCY NOTES FOR HTML BUILD (#3)

The following slides have specific construction requirements that the builder must respect:

| Slide | Requirement |
|---|---|
| S07/S08 | Fictional company "Meridian Industrial" — distinct from case company "Vantage Sound Systems." Do not use Vantage data here. |
| S09/S10 | Product A–E data from chapter Figs. 11-6/11-7 — use exact values (growth rates, SDI scores) from triangulation |
| S13/S14 | Chapter Fig. 11-10 data exactly — MAI=61 is the answer; do not alter inputs |
| S16/S17 | Chapter Fig. 11-12 data exactly — CPI=55 is the answer; do not alter inputs |
| S18 | Grid must orient MAI on Y-axis (vertical), CPI on X-axis (horizontal) — matches chapter Fig. 11-13 |
| S19 | Uses MAI=61 and CPI=55 from S13/S14 and S16/S17 — must explicitly reference those slides |
| S03 | Page references must match chapter PDF confirmed in triangulation |
| S15 | ⚠ callout for rating scale difference is mandatory — highest-risk student error |
