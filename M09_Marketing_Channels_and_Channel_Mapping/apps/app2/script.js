/*
MKT 472 · M09 · App 2
Channel Strategy Comparator

SOURCE OF TRUTH:
Build this app exactly from this comment block. App 2 must be standalone. Do not import App 1 logic except where formulas are identical. Do not use NovaTech case data.

APP GOAL:
Students compare Indirect, Mixed, and Direct channel strategies at different market shares. The app shows NMC, Marketing ROI, Marketing ROS, break-even volume, and break-even share. Students should see that switching to Direct can increase NMC while reducing ROI because Direct has a much larger M&S expense base.

DELIVERY:
Single-file Canvas iframe app using vanilla HTML/CSS/JS.
Chart.js may be loaded by CDN only.
No persistence required.

DEFAULT INPUTS:
marketDemand = 1000000
currentMarketShare = 20
targetMarketShare = 20
selectedStrategy = Indirect
msExpenseOverride = blank/null unless entered by user

STRATEGIES:
Indirect:
- label = Indirect (Retailer-Wholesale)
- endUserPrice = 1000
- retailerDiscount = 20
- distributorDiscount = 15
- agentCommission = 0
- transactionCost = 1
- pocketPrice = 673
- cogs = 500
- percentMargin = 25.7
- defaultMSExpenseDollars = 7840000
- defaultMSExpensePct = 5.0

Mixed:
- label = Mixed (Agent-Distributor)
- endUserPrice = 3000
- retailerDiscount = 0
- distributorDiscount = 15
- agentCommission = 5
- transactionCost = 2
- pocketPrice = 2352
- cogs = 1500
- percentMargin = 36.2
- defaultMSExpenseDollars = 4680000
- defaultMSExpensePct = 8.0

Direct:
- label = Direct (Sales Force)
- endUserPrice = 1000
- retailerDiscount = 0
- distributorDiscount = 0
- agentCommission = 0
- transactionCost = 5
- pocketPrice = 950
- cogs = 650
- percentMargin = 31.6
- defaultMSExpenseDollars = 30000000
- defaultMSExpensePct = 19.4

IMPORTANT:
Use locked pocket prices above directly. Do not recalculate them differently unless using the exact matching waterfall. These values must match the specification.

CALCULATIONS:
volumeCurrent = marketDemand * (currentMarketShare / 100)
volumeTarget = marketDemand * (targetMarketShare / 100)

msExpenseDollars = msExpenseOverride if entered, otherwise strategy.defaultMSExpenseDollars

channelRevenueCurrent = strategy.pocketPrice * volumeCurrent
grossContributionCurrent = (strategy.pocketPrice - strategy.cogs) * volumeCurrent
nmcCurrent = grossContributionCurrent - msExpenseDollars
marketingROS = nmcCurrent / channelRevenueCurrent * 100
marketingROI = nmcCurrent / msExpenseDollars * 100

grossContributionTarget = (strategy.pocketPrice - strategy.cogs) * volumeTarget
nmcTarget = grossContributionTarget - msExpenseDollars

breakEvenVolume = msExpenseDollars / (strategy.pocketPrice - strategy.cogs)
breakEvenShare = breakEvenVolume / marketDemand * 100
marginOfSafety = currentMarketShare - breakEvenShare

DECISION ZONE:
If currentMarketShare < breakEvenShare:
- status = Unprofitable
- red zone
If currentMarketShare >= breakEvenShare and marginOfSafety <= 5:
- status = Marginal
- yellow zone
If marginOfSafety > 5:
- status = Safe
- green zone

REFERENCE STRATEGY:
When user switches strategy, previous strategy metrics remain visible in a Reference column.
Reference column includes:
- strategy name
- NMC
- Marketing ROI
- Marketing ROS
- break-even share
User can clear reference with Clear Reference button.

CHART:
NMC vs. Market Share chart.
- Render all three strategies simultaneously.
- X-axis = market share from 0% to 40%.
- Y-axis = NMC dollars.
- Vertical dashed line at current market share.
- Mark break-even crossing points for each strategy.
- Legend must show Indirect, Mixed, Direct.

For chart line values:
For share from 0 to 40:
volume = marketDemand * (share / 100)
nmc = (pocketPrice - cogs) * volume - defaultMSExpenseDollars
Use default M&S expense for all three strategy lines unless override is active for selected strategy; override affects selected strategy only.

UI LAYOUT:
Header:
- Title: Channel Strategy Comparator
- Module tag: MKT 472 · M09 · App 2
- Note: Complete App 1 before using App 2.

Control panel:
- Strategy dropdown
- Market demand input
- Current market share slider with numeric display
- Target market share slider with numeric display
- M&S expense override field, collapsed by default behind + Override toggle
- Clear Reference button

Primary metrics:
- Large NMC card
- Large Marketing ROI card
- Marketing ROS
- Strategy name
- Pocket price
- Reference column beside current strategy metrics

Break-even panel:
- Horizontal 0–60% share bar
- Break-even marker
- Current share marker
- Target share marker
- Margin of safety label
- Decision zone label: safe / marginal / unprofitable

Calculation detail:
Collapsible section showing:
- Volume
- Revenue
- Gross contribution
- M&S expense
- NMC
- ROS
- ROI
- Break-even volume
- Break-even share

VALIDATION:
- marketDemand > 0
- currentMarketShare between 1 and 60
- targetMarketShare between 1 and 60
- msExpenseOverride > 0 if entered
- If breakEvenShare > 100, display: Not achievable at any market share

EXPECTED VERIFICATION VALUES:
Indirect at 20% share and 1,000,000 market demand:
- volume = 200,000
- NMC = $18,960,000
- Marketing ROS ≈ 12.1%
- Marketing ROI ≈ 242%

Direct at 20% share and 1,000,000 market demand:
- volume = 200,000
- NMC = $36,000,000
- Marketing ROS ≈ 18.4%
- Marketing ROI = 120%

Direct break-even share:
- BE volume = 100,000
- BE share = 10.0%
- margin of safety at 20% share = 10 percentage points

FORMATTING:
- Currency: nearest dollar or compact millions for large outputs.
- Percentages: 1 decimal.
- Volumes: whole units.
- Internal calculations use full precision.
*/