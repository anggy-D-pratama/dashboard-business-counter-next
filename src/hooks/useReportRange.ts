"use client";

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config";

export interface DailyReportRangeItem {
  report_date: string;
  total_income: number;
  total_outcome: number;
  net_profit: number;
  transaction_count: number;
}

export function useReportRange() {
  const { token } = useAuth();
  const [data, setData] = useState<DailyReportRangeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(
    async (from: string, to: string) => {
      if (!token) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${config.apiUrl}/reports/range?from=${from}&to=${to}`,
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

        if (response.status === "success") {
          setData(Array.isArray(response.data) ? response.data : []);
        } else {
          setData([]);
        }
        setError(null);
      } catch (err) {
        // Graceful fallback for the trend chart only. The daily dashboard
        // must keep working, so this error is never logged to the console.
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

  return { data, isLoading, error, fetchRange };
}
