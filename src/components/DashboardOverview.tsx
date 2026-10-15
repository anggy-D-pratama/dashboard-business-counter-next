"use client";

import { useEffect } from "react";
import { useReport } from "../hooks/useReport";
import { useLocale } from "../contexts/LocaleContext";
import "./DashboardOverview.css";

const METRIC_KEYS = {
  INCOME: "income",
  OUTCOME: "outcome",
  NET_PROFIT: "net_profit",
  TRANSACTION_COUNT: "transaction_count",
  PRODUCTION_COST: "production_cost",
  HPP: "hpp",
  FOOD_COST_PERCENTAGE: "food_cost_percentage",
} as const;

type ReportMetric = {
  key: string;
  label?: string;
  value?: number;
  available: boolean;
  reason?: string;
};

const TEMPLATE_BAR_HEIGHTS = [44, 62, 48, 76, 68, 35, 52];

export function DashboardOverview() {
  const { fetchDailyReport, reportData, isLoading } = useReport();
  const { t } = useLocale();

  useEffect(() => {
    fetchDailyReport();
  }, [fetchDailyReport]);

  const stats: ReportMetric[] = reportData?.summary_data?.metrics ?? (reportData
    ? [
        { key: METRIC_KEYS.INCOME, label: t.dashboard.metricIncome, value: reportData.total_income, available: true },
        { key: METRIC_KEYS.OUTCOME, label: t.dashboard.metricOutcome, value: reportData.total_outcome, available: true },
        { key: METRIC_KEYS.NET_PROFIT, label: t.dashboard.metricNetProfit, value: reportData.net_profit, available: true },
        { key: METRIC_KEYS.TRANSACTION_COUNT, label: t.dashboard.metricTransactions, value: reportData.transaction_count, available: true },
      ]
    : []);

  const metricDefs = [
    { key: METRIC_KEYS.INCOME, label: t.dashboard.metricIncome, unit: "IDR" },
    { key: METRIC_KEYS.OUTCOME, label: t.dashboard.metricOutcome, unit: "IDR" },
    { key: METRIC_KEYS.NET_PROFIT, label: t.dashboard.metricNetProfit, unit: "IDR" },
    { key: METRIC_KEYS.TRANSACTION_COUNT, label: t.dashboard.metricTransactions, unit: t.dashboard.transactionUnit },
  ];

  const resolveMetric = (key: string) => stats.find((stat) => stat.key === key);

  const formatMetricValue = (key: string, stat?: ReportMetric) => {
    if (isLoading) return "...";
    if (!stat?.available) return "—";
    const value = stat.value ?? 0;
    if (key === METRIC_KEYS.TRANSACTION_COUNT) return value.toLocaleString();
    if (key === METRIC_KEYS.FOOD_COST_PERCENTAGE) return `${value.toFixed(1)}%`;
    return `Rp ${value.toLocaleString()}`;
  };

  const transactionCount = reportData?.transaction_count ?? 0;
  const hasData = transactionCount > 0;

  return (
    <div className="dashboard-overview stack">
      <header className="row-between dashboard-title">
        <div className="stack title-copy">
          <p className="eyebrow">{t.dashboard.eyebrow}</p>
          <h1>{t.dashboard.title}</h1>
          <p className="lead">{t.dashboard.subtitle}</p>
        </div>

        <div className="row dashboard-controls">
          <button
            type="button"
            className="btn btn-filter"
            onClick={fetchDailyReport}
            disabled={isLoading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isLoading ? t.dashboard.loadingStatus : t.dashboard.syncButton}
          </button>
        </div>
      </header>

      <section className="grid-4" aria-label="Key metrics">
        {metricDefs.map((def) => {
          const stat = resolveMetric(def.key);
          return (
            <article key={def.key} className="card">
              <span className="meta">{def.label}</span>
              <div className="metric-value">
                <strong className="num">{formatMetricValue(def.key, stat)}</strong>
                <span className="metric-delta">
                  {isLoading ? "—" : stat?.available ? def.unit : t.dashboard.noData}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid-2-1" aria-label={t.dashboard.chartTitle}>
        <article className="card">
          <div className="row-between panel-head">
            <div className="stack">
              <h2>{t.dashboard.chartTitle}</h2>
              <p className="meta">{t.dashboard.chartCaption}</p>
            </div>
            <span className="pill">{t.dashboard.live}</span>
          </div>

          <div className="chart" aria-label={t.dashboard.chartTitle}>
            {t.dashboard.weekdayShort.map((day, index) => (
              <div className="bar-wrap" key={day}>
                <div
                  className={`bar${index === 3 ? " active" : ""}`}
                  style={{ height: hasData ? `${TEMPLATE_BAR_HEIGHTS[index]}%` : "0%" }}
                />
                <span className="bar-label">{day}</span>
              </div>
            ))}
          </div>
        </article>

        <aside className="card">
          <div className="row-between panel-head">
            <h2>{t.dashboard.statusSystem}</h2>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-dot" aria-hidden="true" />
              <div>
                <strong>{t.dashboard.apiStatus}</strong>
                <p>{isLoading ? t.dashboard.loadingStatus : t.dashboard.operational}</p>
              </div>
              <span className={`status ${isLoading ? "pending" : "shipped"}`}>
                {isLoading ? "—" : t.dashboard.operational}
              </span>
            </div>

            <div className="activity-item">
              <span className="activity-dot" aria-hidden="true" />
              <div>
                <strong>{t.dashboard.waEngine}</strong>
                <p>—</p>
              </div>
              <span className="status pending">—</span>
            </div>

            <div className="activity-item">
              <span className="activity-dot" aria-hidden="true" />
              <div>
                <strong>{t.dashboard.workerQueue}</strong>
                <p>—</p>
              </div>
              <span className="status pending">—</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
