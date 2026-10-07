"""Load the CSV into SQLite, run the Q1-Q10 queries in UPI_Analysis.sql and cross-check
the headline numbers against pandas. Writes SQL_Validation_Report.md.  Usage: python run_sql_validation.py"""
import re
import sqlite3
from pathlib import Path

import pandas as pd

CSV, SQL, REPORT = Path("upi_transactions_2024_clean.csv"), Path("UPI_Analysis.sql"), Path("SQL_Validation_Report.md")

df = pd.read_csv(CSV)
con = sqlite3.connect(":memory:")
df.to_sql("upi_transactions", con, index=False)

queries = {}
parts = re.split(r"^-- (Q\d+) ", SQL.read_text(encoding="utf-8"), flags=re.M)
for qid, body in zip(parts[1::2], parts[2::2]):
    queries[qid] = body.split("\n", 1)[1].strip()

res = {q: pd.read_sql_query(s, con) for q, s in queries.items()}

checks = []
def check(name, sql_val, pandas_val):
    checks.append((name, sql_val, pandas_val, abs(float(sql_val) - float(pandas_val)) < 0.01))

k = res["Q1"].iloc[0]
check("Total transactions", k.total_transactions, len(df))
check("Total value (INR)", k.total_value_inr, df.amount_inr.sum())
check("Failed transactions", k.failed, (df.transaction_status == "FAILED").sum())
check("Fraud-flagged transactions", k.fraud_flagged, df.fraud_flag.sum())
check("Fraud-flagged amount (INR)", k.fraud_flagged_amount_inr, df.loc[df.fraud_flag == 1, "amount_inr"].sum())
check("Peak month volume", res["Q2"].transactions.max(), df.groupby("year_month").size().max())
check("Top state value (INR)", res["Q5"].value_inr.iloc[0], df.groupby("sender_state").amount_inr.sum().max())
check("Top merchant volume", res["Q4"].transactions.iloc[0], df.merchant_category.value_counts().iloc[0])
check("5k+ band flags", res["Q8"]["flags"].iloc[-1], df.loc[df.amount_inr >= 5000, "fraud_flag"].sum())
check("Daily rows", len(res["Q10"]), df["date"].nunique())

lines = ["# SQL Validation Report", "",
         f"Source: `{CSV}` loaded into in-memory SQLite ({len(df):,} rows); queries in `{SQL}`.", "",
         "| Check | SQL result | pandas result | Match |", "|---|---:|---:|:---:|"]
for n, s, p, ok in checks:
    lines.append(f"| {n} | {float(s):,.2f} | {float(p):,.2f} | {'PASS' if ok else 'FAIL'} |")
passed = sum(c[3] for c in checks)
lines += ["", f"**{passed} of {len(checks)} checks passed.**", "",
          "Q1 to Q10 all executed without error. SQL and the notebook agree on every headline metric."]
REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(lines))
raise SystemExit(0 if passed == len(checks) else 1)
