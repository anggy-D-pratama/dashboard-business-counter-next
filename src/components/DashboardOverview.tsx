"use client";

import { useEffect } from "react";
import { useReport } from "../hooks/useReport";
import { useLocale } from "../contexts/LocaleContext";
import { Skeleton } from "./ui/skeleton";
import { TrendChart } from "./TrendChart";
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

function MetricCardSkeleton() {
  return (
    <article className="card skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-meta" />
      <div className="skeleton-metric-row">
        <Skeleton className="skeleton-value" />
        <Skeleton className="skeleton-unit" />
      </div>
    </article>
  );
}

function StatusRowSkeleton() {
  return (
    <div className="activity-item skeleton-activity-item" aria-hidden="true">
      <span className="activity-dot" />
      <div className="skeleton-activity-copy">
        <Skeleton className="skeleton-activity-title" />
        <Skeleton className="skeleton-activity-caption" />
      </div>
      <Skeleton className="skeleton-activity-status" />
    </div>
  );
}

export function DashboardOverview() {
  const { fetchDailyReport, reportData, isLoading, error } = useReport();
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
    if (!stat?.available) return "—";
    const value = stat.value ?? 0;
    if (key === METRIC_KEYS.TRANSACTION_COUNT) return value.toLocaleString();
    if (key === METRIC_KEYS.FOOD_COST_PERCENTAGE) return `${value.toFixed(1)}%`;
    return `Rp ${value.toLocaleString()}`;
  };

  const hasAvailableMetrics = stats.some((stat) => stat.available);
  const hasTransactionData = (reportData?.transaction_count ?? 0) > 0;
  const hasData = hasAvailableMetrics || hasTransactionData;
  const showErrorState = !isLoading && error !== null;
  const showEmptyState = !isLoading && error === null && !hasData;

  return (
    <div
      className="dashboard-overview stack"
      aria-busy={isLoading}
    >
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
            aria-busy={isLoading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {isLoading ? t.dashboard.syncLoading : t.dashboard.syncButton}
          </button>
        </div>
      </header>

      {showErrorState ? (
        <section
          className="card empty-state error-state"
          aria-label={t.dashboard.errorState.title}
        >
          <div className="empty-state-icon error-state-icon" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2>{t.dashboard.errorState.title}</h2>
          <p>{t.dashboard.errorState.description}</p>
          {error ? (
            <p className="error-state-reason" role="status">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchDailyReport}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {t.dashboard.errorState.retryButton}
          </button>
        </section>
      ) : showEmptyState ? (
        <section
          className="card empty-state"
          aria-label={t.dashboard.emptyState.title}
        >
          <div className="empty-state-icon" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          </div>
          <h2>{t.dashboard.emptyState.title}</h2>
          <p>{t.dashboard.emptyState.description}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchDailyReport}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {t.dashboard.emptyState.retryButton}
          </button>
        </section>
      ) : (
        <>
          <section
            className="grid-4"
            aria-label={t.dashboard.metricsLabel}
            aria-busy={isLoading}
          >
            {isLoading
              ? metricDefs.map((def) => <MetricCardSkeleton key={def.key} />)
              : metricDefs.map((def) => {
                  const stat = resolveMetric(def.key);
                  return (
                    <article key={def.key} className="card">
                      <span className="meta">{def.label}</span>
                      <div className="metric-value">
                        <strong className="num">{formatMetricValue(def.key, stat)}</strong>
                        <span className="metric-delta">
                          {stat?.available ? def.unit : t.dashboard.noData}
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
                  <h2>{t.dashboard.trend.title}</h2>
                  <p className="meta">{t.dashboard.trend.caption}</p>
                </div>
                <span className="pill">{t.dashboard.live}</span>
              </div>

              <TrendChart />
            </article>

            <aside className="card">
              <div className="row-between panel-head">
                <h2>{t.dashboard.statusSystem}</h2>
              </div>

              <div
                className="activity-list"
                role="status"
                aria-live="polite"
                aria-label={t.dashboard.statusSystem}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <StatusRowSkeleton />
                    <StatusRowSkeleton />
                    <StatusRowSkeleton />
                  </>
                ) : (
                  <>
                    <div className="activity-item">
                      <span className="activity-dot" aria-hidden="true" />
                      <div>
                        <strong>{t.dashboard.apiStatus}</strong>
                        <p>{t.dashboard.operational}</p>
                      </div>
                      <span className="status shipped">
                        {t.dashboard.operational}
                      </span>
                    </div>

                    <div className="activity-item">
                      <span className="activity-dot" aria-hidden="true" />
                      <div>
                        <strong>{t.dashboard.waEngine}</strong>
                        <p>{t.dashboard.dataUnavailable}</p>
                      </div>
                      <span className="status pending">
                        {t.dashboard.dataUnavailable}
                      </span>
                    </div>

                    <div className="activity-item">
                      <span className="activity-dot" aria-hidden="true" />
                      <div>
                        <strong>{t.dashboard.workerQueue}</strong>
                        <p>{t.dashboard.dataUnavailable}</p>
                      </div>
                      <span className="status pending">
                        {t.dashboard.dataUnavailable}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}
