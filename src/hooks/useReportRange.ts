"use client";

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config";

export interface ReportRangeItem {
  report_date: string;
  total_income: number;
  total_outcome: number;
  net_profit: number;
  transaction_count: number;
}

export function useReportRange() {
  const { token } = useAuth();
  const [data, setData] = useState<ReportRangeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(
    async (from: string, to: string) => {
      if (!token) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${config.apiUrl}/reports/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.message || "Failed to fetch report range");
        }

        setData(
          response.status === "success" && Array.isArray(response.data)
            ? response.data
            : [],
        );
        setError(null);
      } catch (err) {
        // EAT-171: fallback tanpa console error. Dashboard trend chart
        // menampilkan empty-state; dashboard harian tetap berfungsi.
        setData([]);
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Failed to fetch report range",
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
    fetchRange,
  };
}
