"use client";

import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { config } from "../config";

interface ReportData {
  report_date: string;
  total_income: number;
  total_outcome: number;
  net_profit: number;
  transaction_count: number;
}

export function useReport() {
  const { token } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDailyReport = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(`${config.apiUrl}/reports/daily?date=${today}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response.message || "Failed to fetch report");
      }

      if (response.status === "success") {
        setReportData(response.data);
      }
    } catch (err) {
      console.error("Error fetching daily report", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  return {
    reportData,
    isLoading,
    fetchDailyReport,
  };
}
