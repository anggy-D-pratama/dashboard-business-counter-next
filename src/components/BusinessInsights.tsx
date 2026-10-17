"use client";

import { useEffect, useMemo } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { useReportRange } from "../hooks/useReportRange";
import { useTrafficHourly, TrafficHour } from "../hooks/useTrafficHourly";
import { Skeleton } from "./ui/skeleton";
import "./BusinessInsights.css";

type InsightMetric = {
  key?: string;
  label?: string;
  value?: number;
  available?: boolean;
};

export type BusinessDailyReport = {
  report_date?: string;
  total_income?: number;
  total_outcome?: number;
  net_profit?: number;
  transaction_count?: number;
  payment_breakdown?: unknown;
  summary_data?: {
    model?: string;
    metrics?: InsightMetric[];
  };
};

interface BusinessInsightsProps {
  dailyReport?: BusinessDailyReport | null;
}

const INCOME_KEYS = ["total_income", "income", "pemasukan"];
const OUTCOME_KEYS = ["total_outcome", "outcome", "pengeluaran"];
const NET_PROFIT_KEYS = ["net_profit", "profit", "laba_bersih"];
const TRANSACTION_KEYS = [
  "transaction_count",
  "total_transactions",
  "jumlah_transaksi",
];
const DATE_KEYS = ["report_date", "date", "tanggal"];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function pickNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = toNumber(record[key]);
    if (value !== null) {
      return value;
    }
  }
  return null;
}

function pickDate(record: Record<string, unknown>): string | null {
  for (const key of DATE_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }
  return null;
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}Rp ${Math.abs(Math.round(value)).toLocaleString("id-ID")}`;
}

function formatDecimal(value: number, locale: string): string {
  return value.toLocaleString(locale === "id" ? "id-ID" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatDate(date: string, locale: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTopPayment(
  paymentBreakdown: unknown,
): { name: string; amount: number | null } | null {
  const record = asRecord(paymentBreakdown);

  if (record) {
    let bestName: string | null = null;
    let bestAmount: number | null = null;

    for (const [name, raw] of Object.entries(record)) {
      const amount =
        pickNumber(asRecord(raw) ?? {}, [
          "total",
          "amount",
          "value",
          "nominal",
          "count",
        ]) ?? toNumber(raw);

      if (amount !== null && (bestAmount === null || amount > bestAmount)) {
        bestAmount = amount;
        bestName = name;
      }
    }

    if (bestName !== null) {
      return { name: bestName, amount: bestAmount };
    }
  }

  if (Array.isArray(paymentBreakdown)) {
    let best: { name: string; amount: number | null } | null = null;

    for (const item of paymentBreakdown) {
      const rec = asRecord(item);
      if (!rec) {
        continue;
      }

      const name =
        rec["method"] ?? rec["name"] ?? rec["label"] ?? rec["payment_method"];
      if (typeof name !== "string" || name.trim() === "") {
        continue;
      }

      const amount =
        pickNumber(rec, ["total", "amount", "value", "nominal"]) ??
        pickNumber(rec, ["count"]);

      if (amount !== null && (!best || amount > (best.amount ?? -Infinity))) {
        best = { name, amount };
      }
    }

    if (best) {
      return best;
    }
  }

  return null;
}

function isExpenseMetric(key: string): boolean {
  const normalized = key.toLowerCase();
  const excluded = [
    "income",
    "revenue",
    "net_profit",
    "net profit",
    "profit",
    "transaction",
    "percentage",
  ];
  return !excluded.some((fragment) => normalized.includes(fragment));
}

function getTopExpense(
  dailyReport: BusinessDailyReport | null | undefined,
  fallbackLabel: string,
): { label: string; value: number } | null {
  const metrics = dailyReport?.summary_data?.metrics;

  if (Array.isArray(metrics)) {
    let best: { label: string; value: number } | null = null;

    for (const metric of metrics) {
      const value = toNumber(metric?.value);
      if (value === null || metric?.available === false) {
        continue;
      }

      const key = typeof metric?.key === "string" ? metric.key : "";
      if (!key || !isExpenseMetric(key)) {
        continue;
      }

      const label =
        typeof metric?.label === "string" && metric.label.trim() !== ""
          ? metric.label
          : key;

      if (!best || value > best.value) {
        best = { label, value };
      }
    }

    if (best) {
      return best;
    }
  }

  const totalOutcome = toNumber(dailyReport?.total_outcome);
  if (totalOutcome !== null) {
    return { label: fallbackLabel, value: totalOutcome };
  }

  return null;
}

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getTopBusyHours(
  traffic: TrafficHour[],
  limit = 3,
): TrafficHour[] {
  return [...traffic]
    .sort((a, b) => {
      if (b.transaction_count !== a.transaction_count) {
        return b.transaction_count - a.transaction_count;
      }
      return b.total_income - a.total_income;
    })
    .slice(0, limit);
}

export function BusinessInsights({
  dailyReport = null,
}: BusinessInsightsProps) {
  const { t, locale } = useLocale();
  const {
    data: rangeData,
    isLoading: rangeLoading,
    fetchRange,
  } = useReportRange();
  const {
    data: trafficData,
    isLoading: trafficLoading,
    fetchTrafficHourly,
  } = useTrafficHourly();

  useEffect(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 6);
    const fromString = toLocalDateString(from);
    const toString = toLocalDateString(to);
    fetchRange(fromString, toString);
    fetchTrafficHourly(fromString, toString);
  }, [fetchRange, fetchTrafficHourly]);

  const summary = useMemo(() => {
    const reports = Array.isArray(rangeData) ? rangeData : [];

    let totalIncome = 0;
    let totalOutcome = 0;
    let totalNetProfit = 0;
    let totalTransactions = 0;
    let daysWithTransactions = 0;
    let hasNetProfit = false;
    let hasAnyNumeric = false;
    let bestDay: { date: string; value: number } | null = null;

    for (const report of reports) {
      const record = asRecord(report);
      if (!record) {
        continue;
      }

      const income = pickNumber(record, INCOME_KEYS);
      const outcome = pickNumber(record, OUTCOME_KEYS);
      const netProfit = pickNumber(record, NET_PROFIT_KEYS);
      const transactions = pickNumber(record, TRANSACTION_KEYS);
      const date = pickDate(record);

      if (income !== null) {
        totalIncome += income;
        hasAnyNumeric = true;
      }
      if (outcome !== null) {
        totalOutcome += outcome;
        hasAnyNumeric = true;
      }
      if (netProfit !== null) {
        totalNetProfit += netProfit;
        hasNetProfit = true;
        hasAnyNumeric = true;
      }
      if (transactions !== null) {
        totalTransactions += transactions;
        daysWithTransactions += 1;
        hasAnyNumeric = true;
      }

      if (income !== null && date !== null) {
        if (!bestDay || income > bestDay.value) {
          bestDay = { date, value: income };
        }
      }
    }

    if (!hasNetProfit) {
      totalNetProfit = totalIncome - totalOutcome;
    }

    return {
      hasData: reports.length > 0 && hasAnyNumeric,
      totalIncome,
      totalOutcome,
      totalNetProfit,
      avgTransactions:
        daysWithTransactions > 0
          ? totalTransactions / daysWithTransactions
          : null,
      bestDay,
    };
  }, [rangeData]);

  const topPayment = useMemo(
    () => getTopPayment(dailyReport?.payment_breakdown),
    [dailyReport],
  );

  const topExpense = useMemo(
    () => getTopExpense(dailyReport, t.dashboard.metricOutcome),
    [dailyReport, t],
  );

  const topBusyHours = useMemo(
    () => getTopBusyHours(Array.isArray(trafficData) ? trafficData : []),
    [trafficData],
  );

  return (
    <section
      className="card bi-card"
      aria-label={t.dashboard.insights.title}
      aria-busy={rangeLoading}
    >
      <div className="bi-head">
        <div>
          <h2>{t.dashboard.insights.title}</h2>
          <p className="bi-caption">{t.dashboard.insights.caption}</p>
        </div>
        <span className="bi-period">{t.dashboard.insights.period}</span>
      </div>

      {rangeLoading ? (
        <div className="bi-skeleton" aria-hidden="true">
          <div className="bi-skeleton-totals">
            <Skeleton className="bi-skeleton-total" />
            <Skeleton className="bi-skeleton-total" />
            <Skeleton className="bi-skeleton-total" />
          </div>
          <Skeleton className="bi-skeleton-row" />
          <Skeleton className="bi-skeleton-row" />
          <Skeleton className="bi-skeleton-row" />
          <Skeleton className="bi-skeleton-row" />
        </div>
      ) : !summary.hasData ? (
        <div className="bi-empty">
          <p>{t.dashboard.insights.emptyState}</p>
        </div>
      ) : (
        <>
          <div className="bi-totals">
            <div className="bi-total">
              <span className="bi-label">
                {t.dashboard.insights.totalIncome}
              </span>
              <strong className="bi-value">
                {formatCurrency(summary.totalIncome)}
              </strong>
            </div>
            <div className="bi-total">
              <span className="bi-label">
                {t.dashboard.insights.totalOutcome}
              </span>
              <strong className="bi-value">
                {formatCurrency(summary.totalOutcome)}
              </strong>
            </div>
            <div className="bi-total bi-total-profit">
              <span className="bi-label">
                {t.dashboard.insights.netProfit}
              </span>
              <strong className="bi-value">
                {formatCurrency(summary.totalNetProfit)}
              </strong>
            </div>
          </div>

          <dl className="bi-list">
            <div className="bi-row">
              <dt>{t.dashboard.insights.avgTransactions}</dt>
              <dd>
                {summary.avgTransactions !== null
                  ? formatDecimal(summary.avgTransactions, locale)
                  : t.dashboard.insights.noData}
              </dd>
            </div>
            <div className="bi-row">
              <dt>{t.dashboard.insights.bestDay}</dt>
              <dd>
                {summary.bestDay
                  ? `${formatDate(summary.bestDay.date, locale)} · ${formatCurrency(summary.bestDay.value)}`
                  : t.dashboard.insights.noData}
              </dd>
            </div>
            <div className="bi-row">
              <dt>{t.dashboard.insights.topPayment}</dt>
              <dd>
                {topPayment ? topPayment.name : t.dashboard.insights.noData}
              </dd>
            </div>
            <div className="bi-row">
              <dt>{t.dashboard.insights.topExpense}</dt>
              <dd>
                {topExpense
                  ? `${topExpense.label} · ${formatCurrency(topExpense.value)}`
                  : t.dashboard.insights.noData}
              </dd>
            </div>
          </dl>

          <section className="bi-busy" aria-label={t.dashboard.insights.busyHours}>
            <div className="bi-busy-head">
              <h3>{t.dashboard.insights.busyHours}</h3>
              <p>{t.dashboard.insights.busyHoursCaption}</p>
            </div>

            {trafficLoading ? (
              <Skeleton className="bi-skeleton-row" aria-hidden="true" />
            ) : topBusyHours.length === 0 ? (
              <p className="bi-busy-empty">
                {t.dashboard.insights.busyHoursEmpty}
              </p>
            ) : (
              <ol className="bi-busy-list">
                {topBusyHours.map((hour) => (
                  <li key={hour.hour} className="bi-busy-row">
                    <strong className="bi-busy-hour">
                      {formatHour(hour.hour)}
                    </strong>
                    <span className="bi-busy-meta">
                      {hour.transaction_count} {t.dashboard.insights.busyHoursCount} ·{" "}
                      {formatCurrency(hour.total_income)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </>
      )}
    </section>
  );
}
