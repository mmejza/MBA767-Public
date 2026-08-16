/*
M05 APP 1 SOURCE OF TRUTH — NEEDS-BASED SEGMENTATION BUILDER

Build this app exactly from the M05 App Data Spec.

CORE PURPOSE:
Students learn that meaningful market segments are built around customer needs, benefits sought,
lifestyle/psychographic identifiers, and usage behaviors — not demographics alone.

APP TYPE:
Qualitative drag-and-drop segmentation builder.
No locked numerical presets are required.

CORE PANELS:
- Panel A: Select product category / customer problem
- Panel B: Sort benefit cards into segment buckets
- Panel C: Build a segment profile using:
  - Core need
  - Demographic identifiers
  - Lifestyle/psychographic identifiers
  - Usage behavior identifiers

COMPLETENESS SCORE:
Total possible = 100 points.

Scoring:
- Core need stated = 20 points
- Demographic identifiers = 5 points each, max 3 characteristics = 15 points
- Lifestyle/psychographic identifiers = 5 points each, max 3 characteristics = 15 points
- Usage behavior identifiers = 10 points each, max 3 characteristics = 30 points

IMPORTANT CAP RULE:
- If the profile uses only demographics and does NOT include lifestyle/psychographic or usage behavior identifiers,
  the completeness score must cap at 60 maximum.
- This cap is intentional and must not be removed.

CONTRADICTION FLAGS:
Flag when these incompatible benefits are placed in the same segment bucket:
- "Maximum performance" + "Best value"
- "Fastest possible delivery" + "Restaurant-quality experience"

PRODUCT CATEGORY PRELOADS:
Athletic footwear:
- Maximum performance
- Injury prevention
- Style and brand
- Best value
- Comfort for all-day wear
- Specialized surface traction

Financial planning:
- Maximize growth
- Minimize tax burden
- Safety with modest return
- Income for retirement
- Growth with acceptable risk
- Simplicity and low fees

Meal delivery:
- Fastest possible delivery
- Healthy and nutritious
- Lowest cost per meal
- Restaurant-quality experience
- Dietary restriction compliance
- Family portion sizing

Project management software:
- Reduce missed deadlines
- Minimize team communication overhead
- Integrate with existing tools
- Lowest cost
- Easiest onboarding
- Executive visibility and reporting

GLOBAL:
- All score updates must happen live.
- Do not allow demographics-only profiles to appear complete.
- Color must not be the only feedback indicator; use text labels.
- All logic must be client-side only.
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