"use client";

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config";

export interface TrafficHour {
  hour: number;
  transaction_count: number;
  total_income: number;
}

export function useTrafficHourly() {
  const { token } = useAuth();
  const [data, setData] = useState<TrafficHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrafficHourly = useCallback(
    async (from: string, to: string) => {
      if (!token) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${config.apiUrl}/reports/traffic-hourly?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.message || "Failed to fetch traffic hourly");
        }

        setData(
          response.status === "success" && Array.isArray(response.data)
            ? response.data
            : [],
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching traffic hourly", err);
        setError(
          err instanceof Error && err.message
            ? err.message
            : "Failed to fetch traffic hourly",
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
    fetchTrafficHourly,
  };
}
