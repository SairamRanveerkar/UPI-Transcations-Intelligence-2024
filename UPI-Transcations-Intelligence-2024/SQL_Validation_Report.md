# SQL Validation Report

Source: `upi_transactions_2024_clean.csv` loaded into in-memory SQLite (89,019 rows); queries in `UPI_Analysis.sql`.

| Check | SQL result | pandas result | Match |
|---|---:|---:|:---:|
| Total transactions | 89,019.00 | 89,019.00 | PASS |
| Total value (INR) | 116,495,487.00 | 116,495,487.00 | PASS |
| Failed transactions | 4,379.00 | 4,379.00 | PASS |
| Fraud-flagged transactions | 165.00 | 165.00 | PASS |
| Fraud-flagged amount (INR) | 276,959.00 | 276,959.00 | PASS |
| Peak month volume | 7,674.00 | 7,674.00 | PASS |
| Top state value (INR) | 17,019,090.00 | 17,019,090.00 | PASS |
| Top merchant volume | 17,675.00 | 17,675.00 | PASS |
| 5k+ band flags | 16.00 | 16.00 | PASS |
| Daily rows | 365.00 | 365.00 | PASS |

**10 of 10 checks passed.**

Q1 to Q10 all executed without error. SQL and the notebook agree on every headline metric.
