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

export interface TransactionFilters {
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState(1);
  const [filters, setFiltersState] = useState<TransactionFilters>({});

  const fetchTransactions = useCallback(
    async (nextPage: number, nextFilters: TransactionFilters) => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", String(nextPage));
        params.set("limit", "20");
        if (nextFilters.from) params.set("from", nextFilters.from);
        if (nextFilters.to) params.set("to", nextFilters.to);
        if (nextFilters.category) params.set("category", nextFilters.category);
        if (nextFilters.payment_method) {
          params.set("payment_method", nextFilters.payment_method);
        }
        if (nextFilters.search) params.set("search", nextFilters.search);
        if (nextFilters.min_amount) params.set("min_amount", nextFilters.min_amount);
        if (nextFilters.max_amount) params.set("max_amount", nextFilters.max_amount);

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
        if (response.status !== "success") {
          throw new Error(response.message || "Failed to fetch transactions");
        }

        setData(response.data);
        setPageState(nextPage);
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
    [token],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setPageState(nextPage);
      fetchTransactions(nextPage, filters);
    },
    [fetchTransactions, filters],
  );

  const applyFilters = useCallback(
    (nextFilters: TransactionFilters) => {
      setFiltersState(nextFilters);
      setPageState(1);
      fetchTransactions(1, nextFilters);
    },
    [fetchTransactions],
  );

  const resetFilters = useCallback(() => {
    applyFilters({});
  }, [applyFilters]);

  useEffect(() => {
    if (token) {
      fetchTransactions(1, {});
    }
  }, [token, fetchTransactions]);

  return {
    data,
    isLoading,
    error,
    fetchTransactions,
    page,
    setPage,
    applyFilters,
    resetFilters,
  };
}
