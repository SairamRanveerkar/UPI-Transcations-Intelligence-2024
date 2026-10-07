# EDA Report — UPI Transaction Intelligence 2024

Data: 89,019 transactions, 2024-01-01 to 2024-12-30, 22 columns. No missing values, no duplicate transaction IDs, all amounts positive (₹10 to ₹34,304).

## 1. Scale and performance
| Measure | Value |
|---|---:|
| Total value | ₹116,495,487 |
| Mean / median amount | ₹1,308.66 / ₹628 |
| Success rate | 95.08% (4,379 failures) |
| Fraud-flagged | 165 transactions, ₹276,959 |

Amounts are right-skewed (mean about twice the median), so medians and rank-based tests are used for comparisons. See `charts/amount_distribution.png`.

## 2. Time patterns
- **Monthly:** 6,953 (Feb) to 7,674 (Jan). Day-adjusted, the variation is within chance (p = 0.80).
- **Hourly:** a midday peak at 12:00 (6,173), a dip at 14:00 (4,018), then the main peak at 19:00 (7,481). The trough is 04:00 (442).
- **Weekday:** all seven days fall between 12,577 and 12,994 transactions. The weekday-by-hour shape is the same every day (`charts/hour_weekday_heatmap.png`).

## 3. Mix and geography
- **Type:** P2P 40,191; P2M 31,095; Bill Payment 13,351; Recharge 4,382. Average amounts are within ₹32 of each other.
- **Merchant:** Grocery 17,675; Food 13,367; Shopping 10,474; Fuel 9,032; Education is smallest at 2,675.
- **State value:** Maharashtra ₹17.0M, Uttar Pradesh ₹14.3M, Karnataka ₹14.0M.
- **Sender bank value:** SBI ₹29.0M, HDFC ₹17.6M, ICICI ₹13.8M. Rankings track transaction counts.
- **Device:** Android 75%, iOS 20%, Web 5%. **Network:** 4G 60%, 5G 25%, WiFi 10%, 3G 5%.

## 4. Failure analysis
Across states, banks, devices, networks and transaction types, failure rates sit between about 4.4% and 5.5%. The largest gaps (Web 5.5% vs Android 4.9%; Recharge 5.5% vs P2P 4.8%) are not statistically significant (p = 0.12 and 0.14). There is no evidence that network quality, bank or hour drives failures.

## 5. Fraud-flag analysis
- Overall rate 0.185%. The 18 chi-square tests (9 dimensions x fraud flag and failure) found **no significant association** (smallest p = 0.054, sender state).
- Group rates and 95% intervals: `charts/fraud_rate_confidence_intervals.png`. All intervals contain the overall rate.
- Flagged transactions have a higher median amount (₹754 vs ₹628), but the difference is not significant (Mann-Whitney p = 0.11).
- **Amount lead:** flag rate is 0.41% at ₹5,000+ versus 0.17% below (OR 2.34, p = 0.003). Exploratory and post hoc, so it needs confirmation.

## 6. Anomaly screening
- Daily volume vs 7-day baseline: 3 days at |z| >= 2 (2024-01-24 low at 209; 2024-04-10 high at 292; 2024-05-09 high at 268). Consistent with chance over 365 days.
- IQR amount screen: 7,626 transactions (8.57%) lie above ₹3,543; this reflects the skewed amount distribution and does not predict fraud flags.

## 7. Recommendations
1. Track failure rate and flag rate with confidence intervals, not raw rankings, to avoid reacting to noise.
2. Review large payments (₹5,000+) first when triaging flags, and test the pattern again on new data.
3. Request confirmed fraud outcomes so a supervised model can be built and judged on precision and recall.
4. Staff and capacity planning can rely on the stable evening peak (17:00 to 21:00).
