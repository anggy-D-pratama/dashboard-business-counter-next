"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "../contexts/LocaleContext";
import {
  useTransactions,
  type TransactionFilters,
} from "../hooks/useTransactions";
import "./TransactionsPage.css";

function interpolate(text: string, vars: Record<string, string | number>) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.split(`{${key}}`).join(String(value)),
    text,
  );
}

function formatRupiah(value: number) {
  const rounded = Math.round(value);
  return `Rp ${new Intl.NumberFormat("id-ID").format(rounded)}`;
}

export function TransactionsPage() {
  const { locale, t } = useLocale();
  const {
    data,
    isLoading,
    error,
    page,
    setPage,
    applyFilters,
    resetFilters,
  } = useTransactions();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [category, setCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const buildFilters = (): TransactionFilters => ({
    from: from || undefined,
    to: to || undefined,
    category: category || undefined,
    payment_method: paymentMethod || undefined,
    search: search || undefined,
    min_amount: minAmount || undefined,
    max_amount: maxAmount || undefined,
  });

  const applyCurrentFilters = () => {
    applyFilters(buildFilters());
  };

  const handleApply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyCurrentFilters();
  };

  const handleReset = () => {
    setFrom("");
    setTo("");
    setCategory("");
    setPaymentMethod("");
    setSearch("");
    setMinAmount("");
    setMaxAmount("");
    resetFilters();
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(locale === "id" ? "id-ID" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const methodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "qris":
        return t.transactions.paymentQris;
      case "cash":
        return t.transactions.paymentCash;
      case "va":
        return t.transactions.paymentVa;
      default:
        return method || "-";
    }
  };

  const isEmpty = !isLoading && !error && transactions.length === 0;

  return (
    <div className="transactions-view">
      <header className="transactions-header animate-fade-in">
        <h1>{t.transactions.title}</h1>
        <p className="lead">{t.transactions.subtitle}</p>
      </header>

      <form className="card filter-bar animate-fade-in" onSubmit={handleApply}>
        <div className="filter-grid">
          <div className="field">
            <label htmlFor="tx-from">{t.transactions.filterFrom}</label>
            <input
              id="tx-from"
              type="date"
              className="input"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-to">{t.transactions.filterTo}</label>
            <input
              id="tx-to"
              type="date"
              className="input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-payment">{t.transactions.filterPayment}</label>
            <select
              id="tx-payment"
              className="input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">{t.transactions.filterAllPayments}</option>
              <option value="qris">{t.transactions.paymentQris}</option>
              <option value="cash">{t.transactions.paymentCash}</option>
              <option value="va">{t.transactions.paymentVa}</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="tx-category">{t.transactions.filterCategory}</label>
            <input
              id="tx-category"
              type="text"
              className="input"
              placeholder={t.transactions.filterCategoryPlaceholder}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-search">{t.transactions.filterSearch}</label>
            <input
              id="tx-search"
              type="search"
              className="input"
              placeholder={t.transactions.filterSearchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-min">{t.transactions.filterMinAmount}</label>
            <input
              id="tx-min"
              type="number"
              min="0"
              className="input"
              placeholder="0"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-max">{t.transactions.filterMaxAmount}</label>
            <input
              id="tx-max"
              type="number"
              min="0"
              className="input"
              placeholder="0"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            {t.transactions.apply}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            {t.transactions.reset}
          </button>
        </div>
      </form>

      <section
        className="card transactions-card animate-fade-in"
        style={{ animationDelay: "0.08s" }}
      >
        {isLoading ? (
          <div
            className="transactions-skeleton"
            aria-busy="true"
            aria-label={t.transactions.loading}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton skeleton-row" />
            ))}
          </div>
        ) : error ? (
          <div className="transactions-state">
            <div className="transactions-state-icon" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3>{t.transactions.errorTitle}</h3>
            <p>{t.transactions.errorHint}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={applyCurrentFilters}
            >
              {t.transactions.retry}
            </button>
          </div>
        ) : isEmpty ? (
          <div className="transactions-state">
            <div className="transactions-state-icon" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
              </svg>
            </div>
            <h3>{t.transactions.empty}</h3>
            <p>{t.transactions.emptyHint}</p>
          </div>
        ) : (
          <>
            <div className="transactions-table-wrap">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th scope="col">{t.transactions.colTime}</th>
                    <th scope="col">{t.transactions.colInvoice}</th>
                    <th scope="col">{t.transactions.colItem}</th>
                    <th scope="col">{t.transactions.colType}</th>
                    <th scope="col">{t.transactions.colQty}</th>
                    <th scope="col">{t.transactions.colUnitValue}</th>
                    <th scope="col">{t.transactions.colMethod}</th>
                    <th scope="col">{t.transactions.colCategory}</th>
                    <th scope="col">{t.transactions.colAmount}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const isIncome = tx.income > 0;
                    const amount = tx.income + tx.outcome;

                    return (
                      <tr key={tx.id}>
                        <td data-label={t.transactions.colTime}>
                          {formatTime(tx.transaction_time)}
                        </td>
                        <td data-label={t.transactions.colInvoice}>
                          {tx.invoice_number || "-"}
                        </td>
                        <td data-label={t.transactions.colItem}>
                          {tx.item_name || "-"}
                        </td>
                        <td data-label={t.transactions.colType}>
                          <span
                            className={`type-badge ${isIncome ? "income" : "outcome"}`}
                          >
                            {isIncome
                              ? t.transactions.typeIncome
                              : t.transactions.typeOutcome}
                          </span>
                        </td>
                        <td data-label={t.transactions.colQty}>{tx.qty}</td>
                        <td data-label={t.transactions.colUnitValue}>
                          {formatRupiah(tx.item_value)}
                        </td>
                        <td data-label={t.transactions.colMethod}>
                          {methodLabel(tx.payment_method)}
                        </td>
                        <td data-label={t.transactions.colCategory}>
                          {tx.category || "-"}
                        </td>
                        <td
                          data-label={t.transactions.colAmount}
                          className="num"
                        >
                          {formatRupiah(amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="transactions-pagination">
              <p className="pagination-info">
                {interpolate(t.transactions.showing, {
                  from: start,
                  to: end,
                  total,
                })}
              </p>
              <div className="pagination-buttons">
                <button
                  type="button"
                  className="btn btn-secondary pagination-btn"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  {t.transactions.prev}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary pagination-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  {t.transactions.next}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
