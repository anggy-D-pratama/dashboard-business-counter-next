"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { useReportRange } from "../hooks/useReportRange";
import { Skeleton } from "./ui/skeleton";
import "./ReportsPage.css";

const MAX_RANGE_DAYS = 92;

type ValidationError = "required" | "fromAfterTo" | "maxRange" | null;

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysAgoISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toISODate(date);
}

function inclusiveDayCount(from: string, to: string): number {
  const fromDate = new Date(`${from}T00:00:00Z`);
  const toDate = new Date(`${to}T00:00:00Z`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
}

function formatReportDate(value: string, locale: string): string {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function ReportTableSkeleton() {
  return (
    <div className="reports-skeleton" aria-hidden="true">
      <Skeleton className="reports-skeleton-header" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="reports-skeleton-row" key={index}>
          <Skeleton className="reports-skeleton-cell reports-skeleton-cell-date" />
          <Skeleton className="reports-skeleton-cell reports-skeleton-cell-num" />
          <Skeleton className="reports-skeleton-cell reports-skeleton-cell-num" />
          <Skeleton className="reports-skeleton-cell reports-skeleton-cell-num" />
          <Skeleton className="reports-skeleton-cell reports-skeleton-cell-num" />
        </div>
      ))}
    </div>
  );
}

export function ReportsPage() {
  const { t, locale } = useLocale();
  const { data, isLoading, error, fetchRange } = useReportRange();

  const [from, setFrom] = useState<string>(() => daysAgoISO(7));
  const [to, setTo] = useState<string>(() => toISODate(new Date()));
  const [submittedFrom, setSubmittedFrom] = useState<string>(from);
  const [submittedTo, setSubmittedTo] = useState<string>(to);
  const [validationError, setValidationError] = useState<ValidationError>(null);

  useEffect(() => {
    fetchRange(submittedFrom, submittedTo);
  }, [fetchRange, submittedFrom, submittedTo]);

  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        income: acc.income + item.total_income,
        outcome: acc.outcome + item.total_outcome,
        netProfit: acc.netProfit + item.net_profit,
        transactions: acc.transactions + item.transaction_count,
      }),
      { income: 0, outcome: 0, netProfit: 0, transactions: 0 },
    );
  }, [data]);

  const validationMessages: Record<Exclude<ValidationError, null>, string> = {
    required: t.reports.errorRequired,
    fromAfterTo: t.reports.errorFromAfterTo,
    maxRange: t.reports.errorMaxRange,
  };

  const validate = (): boolean => {
    if (!from || !to) {
      setValidationError("required");
      return false;
    }
    if (from > to) {
      setValidationError("fromAfterTo");
      return false;
    }
    if (inclusiveDayCount(from, to) > MAX_RANGE_DAYS) {
      setValidationError("maxRange");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmittedFrom(from);
    setSubmittedTo(to);
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const handleDownloadCsv = () => {
    const header = [
      t.reports.tableDate,
      t.reports.tableIncome,
      t.reports.tableOutcome,
      t.reports.tableNetProfit,
      t.reports.tableTransactions,
    ];
    const rows = data.map((item) => [
      item.report_date.slice(0, 10),
      item.total_income,
      item.total_outcome,
      item.net_profit,
      item.transaction_count,
    ]);
    const totalRow = [
      t.reports.total,
      totals.income,
      totals.outcome,
      totals.netProfit,
      totals.transactions,
    ];
    const lines = [header, ...rows, totalRow]
      .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
      .join("\n");

    const blob = new Blob([`\uFEFF${lines}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `notakita-laporan-${submittedFrom}-${submittedTo}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const hasData = data.length > 0;
  const showLoading = isLoading;
  const showError = !isLoading && error !== null;
  const showEmpty = !isLoading && error === null && !hasData;
  const showData = !isLoading && error === null && hasData;

  return (
    <div className="reports-page" aria-busy={isLoading}>
      <header className="reports-page-header reports-no-print">
        <p className="eyebrow">{t.reports.eyebrow}</p>
        <h1>{t.reports.title}</h1>
        <p className="lead">{t.reports.subtitle}</p>
      </header>

      <section
        className="card reports-form-card reports-no-print"
        aria-label={t.reports.eyebrow}
      >
        <form className="reports-form" onSubmit={handleSubmit} noValidate>
          <div className="reports-field">
            <label htmlFor="reports-from">{t.reports.fromLabel}</label>
            <input
              id="reports-from"
              type="date"
              className="input"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setValidationError(null);
              }}
            />
          </div>

          <div className="reports-field">
            <label htmlFor="reports-to">{t.reports.toLabel}</label>
            <input
              id="reports-to"
              type="date"
              className="input"
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setValidationError(null);
              }}
            />
          </div>

          <div className="reports-form-actions">
            <button type="submit" className="btn btn-primary">
              {t.reports.apply}
            </button>
          </div>

          {validationError ? (
            <p className="reports-validation" role="alert">
              {validationMessages[validationError]}
            </p>
          ) : null}
        </form>
      </section>

      {showLoading ? (
        <section
          className="card reports-state-card"
          aria-label={t.reports.loading}
        >
          <ReportTableSkeleton />
        </section>
      ) : showError ? (
        <section className="card reports-state-card" role="alert">
          <div className="reports-state-icon reports-error-icon" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2>{t.reports.errorTitle}</h2>
          <p>{t.reports.errorDescription}</p>
          {error ? (
            <p className="reports-error-reason" role="status">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fetchRange(submittedFrom, submittedTo)}
          >
            {t.reports.retryButton}
          </button>
        </section>
      ) : showEmpty ? (
        <section className="card reports-state-card">
          <div className="reports-state-icon" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          </div>
          <h2>{t.reports.emptyTitle}</h2>
          <p>{t.reports.emptyDescription}</p>
        </section>
      ) : showData ? (
        <>
          <section className="reports-export-bar reports-no-print">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownloadCsv}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t.reports.downloadCsv}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownloadPdf}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              {t.reports.downloadPdf}
            </button>
          </section>

          <section
            className="card reports-print-area"
            aria-label={t.reports.tableCaption}
          >
            <h2 className="reports-print-title">{t.reports.title}</h2>
            <p className="reports-range-line">
              {t.reports.printRange}: {submittedFrom} – {submittedTo}
            </p>
            <div className="reports-table-wrap">
              <table className="reports-table">
                <caption className="reports-table-caption">
                  {t.reports.tableCaption}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t.reports.tableDate}</th>
                    <th scope="col" className="align-right">
                      {t.reports.tableIncome}
                    </th>
                    <th scope="col" className="align-right">
                      {t.reports.tableOutcome}
                    </th>
                    <th scope="col" className="align-right">
                      {t.reports.tableNetProfit}
                    </th>
                    <th scope="col" className="align-right">
                      {t.reports.tableTransactions}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.report_date}>
                      <td>{formatReportDate(item.report_date, locale)}</td>
                      <td className="align-right num">
                        {formatRupiah(item.total_income)}
                      </td>
                      <td className="align-right num">
                        {formatRupiah(item.total_outcome)}
                      </td>
                      <td
                        className={`align-right num ${
                          item.net_profit < 0 ? "reports-num-negative" : ""
                        }`}
                      >
                        {formatRupiah(item.net_profit)}
                      </td>
                      <td className="align-right num">
                        {item.transaction_count.toLocaleString(
                          locale === "id" ? "id-ID" : "en-US",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>{t.reports.total}</td>
                    <td className="align-right num">
                      {formatRupiah(totals.income)}
                    </td>
                    <td className="align-right num">
                      {formatRupiah(totals.outcome)}
                    </td>
                    <td
                      className={`align-right num ${
                        totals.netProfit < 0 ? "reports-num-negative" : ""
                      }`}
                    >
                      {formatRupiah(totals.netProfit)}
                    </td>
                    <td className="align-right num">
                      {totals.transactions.toLocaleString(
                        locale === "id" ? "id-ID" : "en-US",
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
