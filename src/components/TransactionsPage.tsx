"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useLocale } from "../contexts/LocaleContext";
import {
  TransactionsFilter,
  useTransactions,
} from "../hooks/useTransactions";
import { Skeleton } from "./ui/skeleton";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { useAuth } from "../hooks/useAuth";
import { config } from "../config";
import { UserCategory, useCategories } from "../hooks/useCategories";
import { CategoryManagerModal } from "./CategoryManagerModal";
import "./TransactionsPage.css";

const EMPTY_FILTERS: TransactionsFilter = {
  from: "",
  to: "",
  payment_method: "",
  search: "",
  min_amount: "",
  max_amount: "",
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildCategoryOptions(
  categories: UserCategory[],
  currentCategory: string,
): string[] {
  const names = categories.map((category) => category.name);
  const current = currentCategory.trim();

  if (
    current &&
    !names.some((name) => name.toLowerCase() === current.toLowerCase())
  ) {
    names.unshift(current);
  }

  return names;
}

function TransactionsSkeleton() {
  return (
    <div className="transactions-table-wrap" aria-hidden="true">
      <table className="transactions-table">
        <thead>
          <tr>
            {Array.from({ length: 10 }).map((_, index) => (
              <th key={index}>
                <Skeleton className="skeleton-head" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: 10 }).map((_, cellIndex) => (
                <td key={cellIndex}>
                  <Skeleton className="skeleton-cell" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TransactionsPage() {
  const { t } = useLocale();
  const { token } = useAuth();
  const {
    data,
    isLoading,
    error,
    fetchTransactions,
    page,
    setPage,
  } = useTransactions();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    createCategory,
    renameCategory,
    deleteCategory,
  } = useCategories();

  const [form, setForm] = useState<TransactionsFilter>(EMPTY_FILTERS);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 20;

  const updateField = (field: keyof TransactionsFilter, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchTransactions(1, form);
  };

  const resetFilters = () => {
    setForm(EMPTY_FILTERS);
    setPage(1);
    fetchTransactions(1, EMPTY_FILTERS);
  };

  const handleCategoryChange = async (
    transactionId: string,
    category: string,
  ) => {
    if (!token || updatingId) return;

    setUpdatingId(transactionId);
    setCategoryError(null);

    try {
      const res = await fetch(`${config.apiUrl}/transactions/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category }),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(
          response.message || "Failed to update transaction category",
        );
      }

      await fetchTransactions();
    } catch (err) {
      setCategoryError(
        err instanceof Error && err.message
          ? err.message
          : "Failed to update transaction category",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const startEntry = total === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);
  const hasPrevious = page > 1;
  const hasNext = endEntry < total;

  const showingText = useMemo(() => {
    return t.transactions.showing
      .replace("{start}", String(startEntry))
      .replace("{end}", String(endEntry))
      .replace("{total}", String(total));
  }, [t.transactions.showing, startEntry, endEntry, total]);

  const showErrorState = !isLoading && error !== null;
  const showEmptyState =
    !isLoading && error === null && transactions.length === 0;
  const showTable = !isLoading && error === null && transactions.length > 0;

  return (
    <div className="transactions-page stack" aria-busy={isLoading}>
      <header className="transactions-header animate-fade-in">
        <div className="stack title-copy">
          <p className="eyebrow">{t.transactions.filterTitle}</p>
          <h1>{t.transactions.title}</h1>
          <p className="lead">{t.transactions.subtitle}</p>
        </div>

        <button
          type="button"
          className="btn btn-secondary transactions-manage-btn"
          onClick={() => setIsManageOpen(true)}
        >
          {t.categories.manageTitle}
        </button>
      </header>

      <section className="card transactions-filter" aria-label={t.transactions.filterTitle}>
        <div className="transactions-filter-grid">
          <div className="field">
            <label htmlFor="tx-from">{t.transactions.from}</label>
            <input
              id="tx-from"
              className="input"
              type="date"
              value={form.from}
              onChange={(event) => updateField("from", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-to">{t.transactions.to}</label>
            <input
              id="tx-to"
              className="input"
              type="date"
              value={form.to}
              onChange={(event) => updateField("to", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-payment-method">
              {t.transactions.paymentMethod}
            </label>
            <select
              id="tx-payment-method"
              className="input"
              value={form.payment_method}
              onChange={(event) =>
                updateField("payment_method", event.target.value)
              }
            >
              <option value="">{t.transactions.allPaymentMethods}</option>
              <option value="qris">QRIS</option>
              <option value="cash">Cash</option>
              <option value="va">VA</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="tx-search">{t.transactions.searchLabel}</label>
            <input
              id="tx-search"
              className="input"
              type="search"
              placeholder={t.transactions.searchPlaceholder}
              value={form.search}
              onChange={(event) => updateField("search", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tx-min-amount">{t.transactions.minAmount}</label>
            <input
              id="tx-min-amount"
              className="input"
              type="number"
              min="0"
              placeholder="0"
              value={form.min_amount}
              onChange={(event) =>
                updateField("min_amount", event.target.value)
              }
            />
          </div>

          <div className="field">
            <label htmlFor="tx-max-amount">{t.transactions.maxAmount}</label>
            <input
              id="tx-max-amount"
              className="input"
              type="number"
              min="0"
              placeholder="0"
              value={form.max_amount}
              onChange={(event) =>
                updateField("max_amount", event.target.value)
              }
            />
          </div>
        </div>

        <div className="transactions-filter-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={applyFilters}
            disabled={isLoading}
          >
            {t.transactions.apply}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetFilters}
            disabled={isLoading}
          >
            {t.transactions.reset}
          </button>
        </div>
      </section>

      {categoryError ? (
        <div className="category-inline-error" role="alert">
          {categoryError}
        </div>
      ) : null}

      {showErrorState ? (
        <section
          className="card empty-state error-state"
          aria-label={t.transactions.errorTitle}
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
          <h2>{t.transactions.errorTitle}</h2>
          <p>{t.transactions.errorDescription}</p>
          {error ? (
            <p className="error-state-reason" role="status">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fetchTransactions()}
          >
            {t.transactions.retry}
          </button>
        </section>
      ) : showEmptyState ? (
        <section
          className="card empty-state"
          aria-label={t.transactions.emptyTitle}
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
          <h2>{t.transactions.emptyTitle}</h2>
          <p>{t.transactions.emptyDescription}</p>
        </section>
      ) : (
        <>
          <section className="card transactions-table-card">
            {isLoading ? (
              <TransactionsSkeleton />
            ) : showTable ? (
              <div className="transactions-table-wrap">
                <table className="transactions-table">
                  <caption className="sr-only">
                    {t.transactions.tableCaption}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">{t.transactions.time}</th>
                      <th scope="col">{t.transactions.invoice}</th>
                      <th scope="col">{t.transactions.item}</th>
                      <th scope="col">{t.transactions.type}</th>
                      <th scope="col" className="num-cell">
                        {t.transactions.qty}
                      </th>
                      <th scope="col" className="num-cell">
                        {t.transactions.unitValue}
                      </th>
                      <th scope="col">{t.transactions.method}</th>
                      <th scope="col">{t.transactions.category}</th>
                      <th scope="col" className="num-cell">
                        {t.transactions.amount}
                      </th>
                      <th scope="col" className="transactions-action-cell">
                        {t.transactions.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      const isIncome = transaction.income > 0;
                      const amount = transaction.income + transaction.outcome;
                      const categoryOptions = buildCategoryOptions(
                        categories,
                        transaction.category,
                      );

                      return (
                        <tr key={transaction.id}>
                          <td data-label={t.transactions.time}>
                            {formatDateTime(transaction.transaction_time)}
                          </td>
                          <td data-label={t.transactions.invoice}>
                            {transaction.invoice_number || "—"}
                          </td>
                          <td data-label={t.transactions.item}>
                            {transaction.item_name || "—"}
                          </td>
                          <td data-label={t.transactions.type}>
                            <span
                              className={`transaction-badge ${
                                isIncome
                                  ? "transaction-badge-income"
                                  : "transaction-badge-expense"
                              }`}
                            >
                              {isIncome
                                ? t.transactions.income
                                : t.transactions.expense}
                            </span>
                          </td>
                          <td
                            data-label={t.transactions.qty}
                            className="num-cell"
                          >
                            {transaction.qty}
                          </td>
                          <td
                            data-label={t.transactions.unitValue}
                            className="num-cell"
                          >
                            {formatRupiah(transaction.item_value)}
                          </td>
                          <td data-label={t.transactions.method}>
                            {transaction.payment_method || "—"}
                          </td>
                          <td data-label={t.transactions.category}>
                            <select
                              className="input transaction-category-select"
                              value={transaction.category || ""}
                              disabled={updatingId === transaction.id}
                              aria-label={`${t.transactions.category}: ${
                                transaction.invoice_number ||
                                transaction.item_name ||
                                transaction.id
                              }`}
                              onChange={(event) =>
                                handleCategoryChange(
                                  transaction.id,
                                  event.target.value,
                                )
                              }
                            >
                              <option value="">
                                {t.transactions.categoryUnset}
                              </option>
                              {categoryOptions.map((categoryName) => (
                                <option key={categoryName} value={categoryName}>
                                  {categoryName}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td
                            data-label={t.transactions.amount}
                            className="num-cell transaction-amount"
                          >
                            {formatRupiah(amount)}
                          </td>
                          <td
                            data-label={t.transactions.actions}
                            className="transactions-action-cell"
                          >
                            <button
                              type="button"
                              className="transaction-action"
                              aria-label={t.transactions.viewDetailAria.replace(
                                "{invoice}",
                                transaction.invoice_number ||
                                  transaction.item_name ||
                                  transaction.id,
                              )}
                              title={t.transactions.viewDetail}
                              onClick={() =>
                                setSelectedTransactionId(transaction.id)
                              }
                            >
                              <Icon
                                icon="material-symbols:receipt-long"
                                width="20"
                                height="20"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>

          <footer className="transactions-pagination">
            <p className="meta" role="status">
              {showingText}
            </p>
            <div className="transactions-pagination-actions">
              <button
                type="button"
                className="btn btn-filter"
                onClick={() => {
                  if (hasPrevious) {
                    const nextPage = page - 1;
                    setPage(nextPage);
                    fetchTransactions(nextPage, form);
                  }
                }}
                disabled={!hasPrevious || isLoading}
              >
                {t.transactions.previous}
              </button>
              <button
                type="button"
                className="btn btn-filter"
                onClick={() => {
                  if (hasNext) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    fetchTransactions(nextPage, form);
                  }
                }}
                disabled={!hasNext || isLoading}
              >
                {t.transactions.next}
              </button>
            </div>
          </footer>
        </>
      )}

      <TransactionDetailModal
        transactionId={selectedTransactionId}
        onClose={() => setSelectedTransactionId(null)}
      />

      <CategoryManagerModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        categories={categories}
        isLoading={categoriesLoading}
        error={categoriesError}
        onCreate={createCategory}
        onRename={renameCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
