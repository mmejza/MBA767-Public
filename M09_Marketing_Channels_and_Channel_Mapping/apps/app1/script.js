/*
MKT 472 · M09 · App 1
Channel Pocket Price & Profitability Calculator

SOURCE OF TRUTH:
Build this app exactly from this comment block. Do not use App 2 data. Do not use NovaTech case data. App 1 uses the Electronic Components Chapter 9 Fig. 9-4 / 9-5 structure only.

APP GOAL:
Students compare Direct, Mixed, and Indirect channel profitability side-by-side and discover that the channel with the highest NMC can have lower Marketing ROI because ROI depends on the M&S expense base.

DELIVERY:
Single-file Canvas iframe app using vanilla HTML/CSS/JS.
Inline CSS and JS are acceptable.
Chart.js may be loaded by CDN only.
No persistence. Reset state on reload.

GLOBAL INPUT:
marketDemand = 1000000

CHANNELS:
Direct, Mixed, Indirect

BASE CASE DEFAULTS:
Direct:
- endUserPrice = 10000
- retailerDiscount = 0
- distributorDiscount = 0
- agentCommission = 0
- transactionCost = 5
- cogs = 6000
- volume = 40000
- msExpensePct = 15

Mixed:
- endUserPrice = 3000
- retailerDiscount = 0
- distributorDiscount = 15
- agentCommission = 5
- transactionCost = 2
- cogs = 1500
- volume = 20000
- msExpensePct = 8

Indirect:
- endUserPrice = 1000
- retailerDiscount = 20
- distributorDiscount = 15
- agentCommission = 0
- transactionCost = 1
- cogs = 500
- volume = 40000
- msExpensePct = 5

SHIFT TO DIRECT PRESET:
Same as Base Case except:
- Direct volume = 55000
- Mixed volume = 20000
- Indirect volume = 25000
- Direct msExpensePct = 19.4
All other inputs unchanged.

PRESET BUTTONS:
- Base Case
- Shift to Direct
- Reset
Reset returns all inputs to Base Case.

CALCULATION ORDER:
Percent inputs are stored as whole numbers but converted to decimals in calculations.

step1_wholesale = endUserPrice * (1 - retailerDiscount / 100)
step2_postAgent = step1_wholesale * (1 - agentCommission / 100)
step3_postDist = step2_postAgent * (1 - distributorDiscount / 100)
step4_pocketPrice = step3_postDist * (1 - transactionCost / 100)

pocketPrice = step4_pocketPrice
percentMargin = (pocketPrice - cogs) / pocketPrice * 100
channelRevenue = pocketPrice * volume
grossContribution = (pocketPrice - cogs) * volume
msExpenseDollars = channelRevenue * (msExpensePct / 100)
nmc = grossContribution - msExpenseDollars
marketingROS = nmc / channelRevenue * 100
marketingROI = nmc / msExpenseDollars * 100
breakEvenVolume = msExpenseDollars / (pocketPrice - cogs)
breakEvenShare = breakEvenVolume / marketDemand * 100
currentShare = volume / marketDemand * 100
marginOfSafety = currentShare - breakEvenShare

AGGREGATE OUTPUTS:
totalVolume = sum volumes
weightedAvgPocketPrice = sum(pocketPrice * volume) / totalVolume
totalNMC = sum nmc
totalMSExpense = sum msExpenseDollars
blendedMarketingROI = totalNMC / totalMSExpense * 100

BASE CASE EXPECTED CHECKS:
Pocket prices:
- Direct = 9500
- Mixed ≈ 2352
- Indirect ≈ 673

Marketing ROI:
- Direct ≈ 146%
- Mixed ≈ 353%
- Indirect ≈ 415%

NMC per transaction:
- Direct ≈ 2075
- Mixed ≈ 664
- Indirect ≈ 140

UI LAYOUT:
Header:
- Title: Channel Pocket Price & Profitability Calculator
- Module tag: MKT 472 · M09 · App 1
- Preset buttons: Base Case | Shift to Direct | Reset

Input panel:
- Three columns: Direct, Mixed, Indirect
- Each column includes all 8 inputs:
  end-user price, retailer discount, distributor discount, agent commission,
  transaction cost, COGS, volume, M&S expense %
- Sliders update live.
- Numeric labels visible beside sliders.
- COGS must be less than pocket price; show live warning if invalid.

Waterfall table:
- Rows:
  End-user price
  Retailer discount
  Wholesale price
  Agent commission
  Distributor discount
  Transaction cost
  Pocket price
- Three columns for Direct, Mixed, Indirect
- Highlight pocket price row.

Profitability panel:
Display per channel:
- Pocket Price
- Margin %
- Channel Revenue
- NMC
- Marketing ROS
- Marketing ROI
- Break-even market share

Highlight:
- Highest NMC in blue/bold
- Highest Marketing ROI in green/bold

Chart:
- Scatter chart titled: ROI vs. NMC — Are They the Same Channel?
- X-axis = Marketing ROI %
- Y-axis = NMC $
- Three labeled points: Direct, Mixed, Indirect
- Tooltip shows pocket price, NMC, ROI, ROS, and M&S expense.

Break-even panel:
- Market demand input above bars
- Three horizontal bars showing current share, break-even share, and margin of safety.
- Label: Margin of safety = X pts

Formatting:
- Currency: round to nearest dollar or nearest $1,000 for large NMC values.
- Pocket price: 2 decimals.
- Percentages: 1 decimal.
- Internal calculations must use full precision.
*/