# AI Assistant Guide — UPI Transaction Intelligence 2024

Use this file as grounding context when asking an AI assistant (for example IBM Bob) questions about the dataset. It lists the schema, the metric definitions, and the interpretation rules that keep answers accurate.

## Data
File `upi_transactions_2024_clean.csv`, 89,019 rows, one row per transaction.

| Column | Meaning |
|---|---|
| transaction_id | Unique ID (TXN + 10 digits) |
| timestamp, date, month, month_name, quarter, year_month | When the transaction happened (2024-01-01 to 2024-12-30) |
| hour_of_day, day_of_week, is_weekend | Derived from timestamp (is_weekend is 0/1) |
| transaction_type | P2P, P2M, Bill Payment, Recharge |
| merchant_category | Grocery, Food, Shopping, Fuel, Other, Utilities, Entertainment, Transport, Healthcare, Education |
| amount_inr | Amount in rupees (10 to 34,304) |
| transaction_status | SUCCESS or FAILED |
| sender_age_group, receiver_age_group | 18-25, 26-35, 36-45, 46-55, 56+ |
| sender_state | 10 Indian states |
| sender_bank, receiver_bank | 8 banks (SBI, HDFC, ICICI, Axis, Kotak, PNB, IndusInd, Yes Bank) |
| device_type, network_type | Android, iOS, Web; 3G, 4G, 5G, WiFi |
| fraud_flag | 1 if the dataset marks the transaction as flagged, else 0 |

## Metric definitions
- Success rate = SUCCESS / all transactions. Failure rate = FAILED / all transactions.
- Fraud-flag rate = sum(fraud_flag) / transactions in the group.
- Value = sum of amount_inr (failed transactions are included in the dataset totals).

## Interpretation rules
1. Say "fraud-flagged", never "fraud". `fraud_flag` is not independently confirmed.
2. Before calling a group "highest" or "riskiest", give its count and a confidence interval or p-value. With 165 flags in total, most group differences are noise.
3. Do not claim causes. The data is observational.
4. Anomaly screens (rolling z-score, IQR) are screens, not detectors.
5. Cite the source table (`analysis_outputs/*.csv`) for any figure.

## Example questions
- What was the monthly failure rate, and is it changing over time?
- Which merchant categories drive the most value?
- Is the fraud-flag rate different between Android and iOS, and is the difference significant?
- What happens to fraud-flag rate as the amount increases?
- On which days was volume unusual compared with the previous week?
