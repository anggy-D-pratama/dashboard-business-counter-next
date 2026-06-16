"use client";

import { useEffect } from "react";
import { useReport } from "../hooks/useReport";
import "./DashboardOverview.css";

export function DashboardOverview() {
  const { fetchDailyReport, reportData, isLoading } = useReport();
  useEffect(() => {
    fetchDailyReport();
  }, [fetchDailyReport]);

  const stats = [
    {
      label: "Total Pemasukan",
      value: reportData?.total_income ?? 0,
      trend: "+12.5%",
      type: "primary",
    },
    {
      label: "Biaya Operasional",
      value: reportData?.total_outcome ?? 0,
      trend: "-2.4%",
      type: "danger",
    },
    {
      label: "Keuntungan Bersih",
      value: reportData?.net_profit ?? 0,
      trend: "+8.1%",
      type: "success",
    },
  ];

  return (
    <div className="dashboard-overview">
      <header className="dashboard-header animate-fade-in">
        <div className="header-info">
          <h1>Dasbor Eksekutif</h1>
          <p>Wawasan strategis untuk performa bisnis Anda</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchDailyReport}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Sinkronkan Data
          </button>
        </div>
      </header>

      <section className="metrics-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card metric-card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="metric-header">
              <span className="label">{stat.label}</span>
              <span className={`trend ${stat.type}`}>{stat.trend}</span>
            </div>
            <div className="metric-body">
              <h3
                className={`metric-value ${stat.type === "primary" ? "metric-glow-blue" : ""}`}
              >
                {isLoading ? "..." : stat.value}
              </h3>
            </div>
            <div className="metric-footer">
              <div className="mini-chart">
                <div className="bar" style={{ height: `40%` }}></div>
                <div className="bar" style={{ height: `60%` }}></div>
                <div className="bar" style={{ height: `45%` }}></div>
                <div className="bar" style={{ height: `80%` }}></div>
                <div className="bar" style={{ height: `55%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="insights-row">
        <div
          className="card main-insight animate-fade-in"
          style={{ animationDelay: `0.3s` }}
        >
          <div className="insight-header">
            <h3>Volume Transaksi</h3>
            <span className="badge">Langsung</span>
          </div>
          <div className="volume-display">
            <div className="volume-number">
              {isLoading
                ? "..."
                : (reportData?.transaction_count || 0).toLocaleString()}
              <span>TRX</span>
            </div>
            <div className="volume-visual">
              <svg viewBox="0 0 100 20" className="sparkline">
                <path
                  d="M0,15 Q25,5 50,15 T100,5"
                  fill="none"
                  stroke="var(--accent-cyan)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          <p className="insight-desc">
            Frekuensi transaksi naik 15% dibanding periode sebelumnya.
          </p>
        </div>

        <div
          className="card side-insight animate-fade-in"
          style={{ animationDelay: `0.4s` }}
        >
          <h3>Status Sistem</h3>
          <div className="health-grid">
            <div className="health-item">
              <div className="dot success"></div>
              <span>Status API: Operasional</span>
            </div>
            <div className="health-item">
              <div className="dot success"></div>
              <span>Mesin WA: Siap</span>
            </div>
            <div className="health-item">
              <div className="dot warning"></div>
              <span>Antrean Pekerja: 2 Tertunda</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
