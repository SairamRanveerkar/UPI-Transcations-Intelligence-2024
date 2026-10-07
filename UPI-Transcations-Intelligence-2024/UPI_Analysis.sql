-- UPI Transaction Intelligence 2024 : SQLite analysis queries
-- Table: upi_transactions (loaded from upi_transactions_2024_clean.csv by run_sql_validation.py)
-- Run all queries:  python run_sql_validation.py

-- Q1 KPI summary
SELECT COUNT(*) AS total_transactions,
       SUM(amount_inr) AS total_value_inr,
       ROUND(AVG(amount_inr), 2) AS avg_amount_inr,
       SUM(transaction_status = 'SUCCESS') AS successful,
       SUM(transaction_status = 'FAILED')  AS failed,
       ROUND(100.0 * SUM(transaction_status = 'SUCCESS') / COUNT(*), 2) AS success_rate_pct,
       SUM(fraud_flag) AS fraud_flagged,
       SUM(CASE WHEN fraud_flag = 1 THEN amount_inr END) AS fraud_flagged_amount_inr
FROM upi_transactions;

-- Q2 Monthly volume, value and failure rate
SELECT year_month,
       COUNT(*) AS transactions,
       SUM(amount_inr) AS value_inr,
       ROUND(100.0 * SUM(transaction_status = 'FAILED') / COUNT(*), 2) AS failure_rate_pct
FROM upi_transactions GROUP BY year_month ORDER BY year_month;

-- Q3 Transaction type mix
SELECT transaction_type, COUNT(*) AS transactions, SUM(amount_inr) AS value_inr,
       ROUND(AVG(amount_inr), 2) AS avg_amount_inr
FROM upi_transactions GROUP BY transaction_type ORDER BY transactions DESC;

-- Q4 Merchant category ranking by volume
SELECT merchant_category, COUNT(*) AS transactions, SUM(amount_inr) AS value_inr
FROM upi_transactions GROUP BY merchant_category ORDER BY transactions DESC;

-- Q5 Top states by value
SELECT sender_state, COUNT(*) AS transactions, SUM(amount_inr) AS value_inr
FROM upi_transactions GROUP BY sender_state ORDER BY value_inr DESC;

-- Q6 Sender bank value and failure rate
SELECT sender_bank, SUM(amount_inr) AS value_inr,
       ROUND(100.0 * SUM(transaction_status = 'FAILED') / COUNT(*), 2) AS failure_rate_pct
FROM upi_transactions GROUP BY sender_bank ORDER BY value_inr DESC;

-- Q7 Fraud-flag rate by device (counts are small: see the significance tests in the notebook)
SELECT device_type, SUM(fraud_flag) AS flags, COUNT(*) AS transactions,
       ROUND(100.0 * SUM(fraud_flag) / COUNT(*), 3) AS fraud_flag_rate_pct
FROM upi_transactions GROUP BY device_type ORDER BY fraud_flag_rate_pct DESC;

-- Q8 Fraud-flag rate by amount band
SELECT CASE WHEN amount_inr < 250 THEN '1 <250'
            WHEN amount_inr < 500 THEN '2 250-500'
            WHEN amount_inr < 1000 THEN '3 500-1k'
            WHEN amount_inr < 2500 THEN '4 1k-2.5k'
            WHEN amount_inr < 5000 THEN '5 2.5k-5k'
            ELSE '6 5k+' END AS amount_band,
       COUNT(*) AS transactions, SUM(fraud_flag) AS flags,
       ROUND(100.0 * SUM(fraud_flag) / COUNT(*), 3) AS fraud_flag_rate_pct
FROM upi_transactions GROUP BY amount_band ORDER BY amount_band;

-- Q9 Hourly activity
SELECT hour_of_day, COUNT(*) AS transactions, SUM(fraud_flag) AS flags
FROM upi_transactions GROUP BY hour_of_day ORDER BY hour_of_day;

-- Q10 Daily volume with a 7-day rolling mean (window function)
WITH daily AS (SELECT date, COUNT(*) AS n FROM upi_transactions GROUP BY date)
SELECT date, n,
       ROUND(AVG(n) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 1) AS rolling_7d_mean
FROM daily ORDER BY date;
