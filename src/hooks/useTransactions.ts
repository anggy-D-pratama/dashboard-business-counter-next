"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config";

export interface Transaction {
  id: string;
  user_id: string;
  upload_id: string;
  invoice_number: string;
  transaction_time: string;
  item_name: string;
  qty: number;
  item_value: number;
  discount: number;
  income: number;
  outcome: number;
  payment_method: string;
  category: string;
  raw_data?: unknown;
  created_at: string;
}

export interface TransactionsFilter {
  from?: string;
  to?: string;
  category?: string;
  payment_method?: string;
  search?: string;
  min_amount?: string;
  max_amount?: string;
}

export interface TransactionsData {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export function useTransactions() {
  const { token } = useAuth();
  const [data, setData] = useState<TransactionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TransactionsFilter>({});

  const fetchTransactions = useCallback(
    async (nextPage?: number, nextFilters?: TransactionsFilter) => {
      if (!token) return;

      const targetPage = nextPage ?? page;
      const targetFilters = nextFilters ?? filters;

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(targetPage));
        params.set("limit", "20");
        if (targetFilters.from) params.set("from", targetFilters.from);
        if (targetFilters.to) params.set("to", targetFilters.to);
        if (targetFilters.category) {
          params.set("category", targetFilters.category);
        }
        if (targetFilters.payment_method) {
          params.set("payment_method", targetFilters.payment_method);
        }
        if (targetFilters.search) params.set("search", targetFilters.search);
        if (targetFilters.min_amount) {
          params.set("min_amount", targetFilters.min_amount);
        }
        if (targetFilters.max_amount) {
          params.set("max_amount", targetFilters.max_amount);
        }

        const res = await fetch(
          `${config.apiUrl}/transactions?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const response = await res.json();

        if (!res.ok) {
          throw new Error(response.message || "Failed to fetch transactions");
        }

        if (response.status === "success") {
          setData(response.data);
          setPage(response.data.page ?? targetPage);
        }
      } catch (err) {
        console.error("Error fetching transactions", err);
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Failed to fetch transactions",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token, page, filters],
  );

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    data,
    isLoading,
    error,
    fetchTransactions,
    page,
    setPage,
    filters,
    setFilters,
  };
}

export function useTransactionDetail() {
  const { token } = useAuth();
  const [data, setData] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(
    async (id: string) => {
      if (!token || !id) return;

      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(`${config.apiUrl}/transactions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await res.json();

        if (!res.ok) {
          throw new Error(response.message || "Failed to fetch transaction");
        }

        if (response.status === "success") {
          setData(response.data);
        }
      } catch (err) {
        console.error("Error fetching transaction detail", err);
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Failed to fetch transaction",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token],
  );

  return {
    data,
    isLoading,
    error,
    fetchTransaction,
  };
}
