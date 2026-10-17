"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useLocale } from "../contexts/LocaleContext";
import { useAuth } from "../hooks/useAuth";
import {
  Transaction,
  useTransactionDetail,
} from "../hooks/useTransactions";
import { Modal } from "./Modal";
import "./TransactionDetailModal.css";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

interface TransactionDetailModalProps {
  transactionId: string | null;
  onClose: () => void;
}

function DetailRows({ transaction }: { transaction: Transaction }) {
  const { t } = useLocale();
  const isIncome = transaction.income > 0;
  const amount = transaction.income + transaction.outcome;
  const subtotal = transaction.qty * transaction.item_value;
  const total = Math.max(0, subtotal - transaction.discount);

  const rows = [
    { label: t.transactionDetail.dateTime, value: formatDateTime(transaction.transaction_time) },
    { label: t.transactionDetail.invoice, value: transaction.invoice_number || "—" },
    { label: t.transactionDetail.item, value: transaction.item_name || "—" },
    { label: t.transactionDetail.qty, value: String(transaction.qty) },
    { label: t.transactionDetail.unitValue, value: formatRupiah(transaction.item_value) },
    { label: t.transactionDetail.subtotal, value: formatRupiah(subtotal) },
    { label: t.transactionDetail.discount, value: formatRupiah(transaction.discount) },
    { label: t.transactionDetail.total, value: formatRupiah(total) },
    { label: t.transactionDetail.paymentMethod, value: transaction.payment_method || "—" },
    {
      label: t.transactionDetail.type,
      value: isIncome ? t.transactionDetail.income : t.transactionDetail.expense,
    },
    { label: t.transactionDetail.category, value: transaction.category || "—" },
    { label: t.transactionDetail.status, value: t.transactionDetail.statusPaid },
  ];

  return (
    <div className="transaction-detail-summary">
      {rows.map((row) => (
        <div className="field" key={row.label}>
          <span className="field-label">{row.label}</span>
          <span className="field-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function Receipt({ transaction }: { transaction: Transaction }) {
  const { t } = useLocale();
  const { user } = useAuth();
  const businessName = user?.name?.trim() || t.common.appName;
  const businessPhone = user?.phone?.trim() || "";
  const isIncome = transaction.income > 0;
  const amount = transaction.income + transaction.outcome;
  const subtotal = transaction.qty * transaction.item_value;
  const total = Math.max(0, subtotal - transaction.discount);

  return (
    <div className="receipt-print" role="document" aria-label={t.transactionDetail.printReceipt}>
      <div className="receipt-header">
        <div className="receipt-business-name">{businessName}</div>
        {businessPhone ? <div>{businessPhone}</div> : null}
        <div>{formatDateTime(transaction.transaction_time)}</div>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-row">
        <span>{t.receipt.invoice}</span>
        <span>{transaction.invoice_number || "—"}</span>
      </div>
      <div className="receipt-row">
        <span>{t.receipt.type}</span>
        <span>{isIncome ? t.receipt.income : t.receipt.expense}</span>
      </div>
      <div className="receipt-row">
        <span>{t.receipt.item}</span>
        <span className="receipt-item-name">{transaction.item_name || "—"}</span>
      </div>
      <div className="receipt-row">
        <span>{t.receipt.qty}</span>
        <span>{transaction.qty}</span>
      </div>
      <div className="receipt-row">
        <span>{t.receipt.unitValue}</span>
        <span>{formatRupiah(transaction.item_value)}</span>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-row">
        <span>{t.receipt.subtotal}</span>
        <span>{formatRupiah(subtotal)}</span>
      </div>
      <div className="receipt-row">
        <span>{t.receipt.discount}</span>
        <span>{formatRupiah(transaction.discount)}</span>
      </div>
      <div className="receipt-row receipt-total">
        <span>{t.receipt.total}</span>
        <span>{formatRupiah(total)}</span>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-row">
        <span>{t.receipt.paymentMethod}</span>
        <span>{transaction.payment_method || "—"}</span>
      </div>
      <div className="receipt-row">
        <span>{t.receipt.status}</span>
        <span>{t.receipt.statusPaid}</span>
      </div>

      <hr className="receipt-divider" />

      <div className="receipt-footer">{t.receipt.footer}</div>
      <div className="receipt-footer">— {t.receipt.appName} —</div>
    </div>
  );
}

export function TransactionDetailModal({
  transactionId,
  onClose,
}: TransactionDetailModalProps) {
  const { t } = useLocale();
  const { data, isLoading, error, fetchTransaction } = useTransactionDetail();

  useEffect(() => {
    if (transactionId) {
      fetchTransaction(transactionId);
    }
  }, [transactionId, fetchTransaction]);

  const showReceipt = Boolean(transactionId && !isLoading && !error && data);

  return (
    <Modal
      isOpen={transactionId !== null}
      onClose={onClose}
      title={t.transactionDetail.title}
      icon="material-symbols:receipt-long"
      iconColor="#6366f1"
      maxWidth="680px"
    >
      <div className="transaction-detail-modal">
        {isLoading ? (
          <div className="transaction-detail-loading" role="status">
            {t.transactionDetail.loading}
          </div>
        ) : error ? (
          <div className="transaction-detail-error" role="alert">
            <strong>{t.transactionDetail.errorTitle}</strong>
            <p>{t.transactionDetail.errorDescription}</p>
            {error ? <p className="error-reason">{error}</p> : null}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fetchTransaction(transactionId as string)}
            >
              {t.transactionDetail.retry}
            </button>
          </div>
        ) : data ? (
          <div className="transaction-detail-body">
            <DetailRows transaction={data} />

            <table className="transaction-detail-items">
              <caption className="sr-only">{t.transactionDetail.item}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.transactionDetail.item}</th>
                  <th scope="col" className="num-cell">
                    {t.transactionDetail.qty}
                  </th>
                  <th scope="col" className="num-cell">
                    {t.transactionDetail.unitValue}
                  </th>
                  <th scope="col" className="num-cell">
                    {t.transactionDetail.total}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.item_name || "—"}</td>
                  <td className="num-cell">{data.qty}</td>
                  <td className="num-cell">{formatRupiah(data.item_value)}</td>
                  <td className="num-cell">
                    {formatRupiah(
                      Math.max(0, data.qty * data.item_value - data.discount),
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="transaction-detail-total">
              <div className="transaction-detail-total-row">
                <span>{t.transactionDetail.subtotal}</span>
                <span>{formatRupiah(data.qty * data.item_value)}</span>
              </div>
              <div className="transaction-detail-total-row">
                <span>{t.transactionDetail.discount}</span>
                <span>{formatRupiah(data.discount)}</span>
              </div>
              <div className="transaction-detail-total-row grand-total">
                <span>{t.transactionDetail.total}</span>
                <span>
                  {formatRupiah(
                    Math.max(0, data.qty * data.item_value - data.discount),
                  )}
                </span>
              </div>
            </div>

            <div className="transaction-detail-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                <Icon icon="material-symbols:print" width="20" height="20" />
                {t.transactionDetail.printReceipt}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                {t.transactionDetail.close}
              </button>
            </div>

            <Receipt transaction={data} />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
