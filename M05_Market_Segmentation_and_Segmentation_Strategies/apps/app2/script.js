/*
M05 APP 2 SOURCE OF TRUTH — SEGMENT ATTRACTIVENESS SCORER

Build this app exactly from the M05 App Data Spec.

CORE PURPOSE:
Students score two market segments and discover that the largest segment is not always the most attractive.

CORE METRIC:
Attractiveness = (Demand average × Demand weight)
               + (Competitive Intensity average × Intensity weight)
               + (Market Access average × Access weight)

DEFAULT WEIGHTS:
- Market Demand = 33%
- Competitive Intensity = 33%
- Market Access = 34%

SUB-FACTORS:
Market Demand:
- Market size/current
- Growth rate
- Market potential

Competitive Intensity:
- Number of competitors
- Ease of entry
- Number of substitutes

Market Access:
- Customer familiarity
- Channel access
- Company fit

SCORE RANGE:
Each sub-factor score = 1–10.

CRITICAL DIRECTION RULE:
For Competitive Intensity sub-factors, higher score means MORE attractive:
- Number of competitors: 10 = fewest competitors, 1 = many competitors
- Ease of entry: 10 = highest barriers / hardest entry, 1 = low barriers / easy entry
- Number of substitutes: 10 = fewest substitutes, 1 = many substitutes

Do NOT treat more competitors, easier entry, or more substitutes as attractive.

PRESET 1 — BASE CASE / HEALTH INSURANCE PARALLEL:
Segment I:
- Market size 8
- Growth rate 3
- Market potential 3
- Number of competitors 4
- Ease of entry 3
- Number of substitutes 4
- Customer familiarity 8
- Channel access 7
- Company fit 6
Expected overall score: about 5.1

Segment III:
- Market size 4
- Growth rate 7
- Market potential 8
- Number of competitors 7
- Ease of entry 7
- Number of substitutes 6
- Customer familiarity 4
- Channel access 5
- Company fit 5
Expected overall score: about 5.9

Expected winner: Segment III.

PRESET 2 — REVERSAL CASE / SIZE TRAP:
Segment A:
- Market size 9
- Growth rate 2
- Market potential 2
- Number of competitors 2
- Ease of entry 2
- Number of substitutes 3
- Customer familiarity 6
- Channel access 7
- Company fit 5
Expected overall score: about 4.2

Segment B:
- Market size 3
- Growth rate 9
- Market potential 8
- Number of competitors 8
- Ease of entry 9
- Number of substitutes 7
- Customer familiarity 4
- Channel access 6
- Company fit 7
Expected overall score: about 6.8

Expected winner: Segment B by large margin.

KEY TEACHING POINT:
The larger segment can lose because growth, potential, competitive intensity, and fit can outweigh size.

GLOBAL:
- Use live scoring.
- Display category averages and weighted total.
- Show which segment wins and why.
- Use 1 decimal place for final scores.
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