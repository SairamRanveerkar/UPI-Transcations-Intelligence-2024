# UPI Transaction Intelligence & Fraud Analytics — 2024

## Project Overview
This project analyzes a 2024 UPI transaction dataset to understand digital-payment behavior, transaction performance, regional and banking patterns, merchant activity, fraud-flagged transactions, and unusual transaction-volume patterns.

The solution combines **Python-based data analytics, SQL/SQLite analysis, interactive visualization, anomaly screening, and IBM Bob AI-assisted analytics**.

## Dataset
- Records: **89,019**
- Columns in the cleaned analysis file: **22**
- Date range: **2024-01-01 to 2024-12-30**
- Dataset file used by the notebook: `upi_transactions_2024_clean.csv`
- Dataset source: 2024 UPI transaction CSV supplied for the academic internship. No public dataset URL was supplied with the project.

## Business Problem
UPI transaction systems generate large volumes of digital-payment activity. Analysts need to monitor transaction performance, understand user and merchant behavior, compare banking and regional activity, and identify transaction patterns that may require operational or risk review.

## Objectives
1. Measure transaction volume and monetary value.
2. Analyze payment success and failure.
3. Identify monthly, daily, hourly and weekly trends.
4. Compare transaction types and merchant categories.
5. Analyze state and banking activity.
6. Study device, network and age-group behavior.
7. Analyze fraud-flagged transaction patterns.
8. Screen for unusual transaction-volume and amount patterns.
9. Provide business-oriented insights and recommendations.
10. Enable natural-language analytics through IBM Bob.

## Key Results
| Metric | Result |
|---|---:|
| Total transactions | 89,019 |
| Total transaction value | ₹116,495,487 |
| Average transaction | ₹1,308.66 |
| Median transaction | ₹628 |
| Successful transactions | 84,640 |
| Failed transactions | 4,379 |
| Success rate | 95.08% |
| Failure rate | 4.92% |
| Fraud-flagged transactions | 165 |
| Fraud-flag rate | 0.185% |
| Fraud-flagged amount | ₹276,959 |

## Selected Findings
- **Highest monthly transaction volume:** 2024-01 with 7,674 transactions.
- **Highest monthly transaction value:** 2024-08 with ₹9,963,909.
- **Highest state transaction value:** Maharashtra with ₹17,019,090.
- **Highest merchant-category transaction volume:** Grocery with 17,675 transactions.
- **Highest sender-bank transaction value:** SBI with ₹29,048,869.
- **Highest average amount by transaction type:** P2P at ₹1,314.12.
- **Highest device fraud-flag rate:** Web at 0.222%.
- **Highest network fraud-flag rate:** WiFi at 0.258%.
- **Hour with most fraud flags:** 12:00 with 17 flagged transactions.
- Daily volume screening identified **3 potential volume-anomaly days** using an absolute rolling z-score threshold of 2.

## Methodology
### Data preparation
- Loaded CSV using Pandas.
- Parsed transaction timestamps.
- Checked missing values and duplicate transaction IDs.
- Used the supplied `fraud_flag` field as a dataset-provided label.

### Exploratory analysis
- KPI analysis
- Monthly trends
- Transaction type analysis
- Merchant analysis
- State and bank analysis
- Age-group analysis
- Device and network analysis
- Hour/day/weekend analysis

### Fraud analytics
Fraud analysis reports **fraud-flagged transactions**. A `fraud_flag = 1` value is not treated as independently confirmed fraud.

### Anomaly screening
Daily transaction volume is compared with a 7-day rolling mean and standard deviation. The amount analysis also includes an optional IQR-based anomaly screen. These methods identify unusual patterns; they do not prove fraud.

## Technologies
- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Jupyter Notebook
- SQL / SQLite
- HTML/CSS/JavaScript dashboard
- IBM Bob

## How to Run
1. Install Python 3.10+.
2. Put `upi_transactions_2024_clean.csv` in the same directory as the notebook.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start Jupyter:

```bash
jupyter notebook
```

5. Open:
`SairamRanveerkar_UPITransactionIntelligence2024.ipynb`

6. Run the notebook from top to bottom.

## Project Structure
```text
UPI-Transaction-Intelligence-2024/
├── SairamRanveerkar_UPITransactionIntelligence2024.ipynb
├── requirements.txt
├── README.md
├── upi_transactions_2024_clean.csv
├── UPI_Analysis.sql
├── EDA_Report.md
├── SQL_Validation_Report.md
├── AI_ASSISTANT_GUIDE.md
├── dashboard/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── TEST_REPORT.md
└── charts/
```

## Limitations
- The dataset is observational; relationships should not be interpreted as causal.
- `fraud_flag` is a supplied dataset field and is not independently verified.
- The anomaly methods are screening techniques rather than production fraud-detection models.
- No real-time payment gateway or bank system is connected.
- The project does not expose or process real customer credentials or payment secrets.

## Future Scope
- Add real-time streaming transaction monitoring.
- Build a production anomaly-detection service.
- Add model explainability for risk scores.
- Add role-based dashboard access.
- Integrate alerts for unusual payment activity.
- Evaluate models using precision, recall, F1-score and business-cost metrics if confirmed fraud labels become available.

## Author
**Sairam Ranveerkar**  
Computer Science & Engineering Graduate  
Hyderabad, India
