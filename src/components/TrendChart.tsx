"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../contexts/LocaleContext";
import { useReportRange } from "../hooks/useReportRange";
import { Skeleton } from "./ui/skeleton";
import "./TrendChart.css";

type RangeDays = 7 | 30;

interface TrendPoint {
  key: string;
  date: Date;
  income: number;
  outcome: number;
}

const VIEWBOX_WIDTH = 720;
const VIEWBOX_HEIGHT = 240;
const PADDING_X = 16;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 30;

const SKELETON_BAR_HEIGHTS = [46, 62, 50, 82, 72, 38, 56];

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function TrendChart() {
  const { t } = useLocale();
  const { data, isLoading, error, fetchRange } = useReportRange();
  const [days, setDays] = useState<RangeDays>(7);

  useEffect(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - (days - 1));
    fetchRange(toLocalDateKey(from), toLocalDateKey(today));
  }, [days, fetchRange]);

  const points = useMemo<TrendPoint[]>(() => {
    const today = new Date();
    const reportsByDate = new Map<string, { income: number; outcome: number }>();

    for (const report of data) {
      reportsByDate.set(report.report_date, {
        income: report.total_income ?? 0,
        outcome: report.total_outcome ?? 0,
      });
    }

    return Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - index));
      const key = toLocalDateKey(date);
      const report = reportsByDate.get(key);

      return {
        key,
        date,
        income: report?.income ?? 0,
        outcome: report?.outcome ?? 0,
      };
    });
  }, [data, days]);

  const maxValue = useMemo(() => {
    const values = points.flatMap((point) => [point.income, point.outcome]);
    return Math.max(1, ...values);
  }, [points]);

  const chartWidth = VIEWBOX_WIDTH - PADDING_X * 2;
  const chartHeight = VIEWBOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const slotWidth = chartWidth / points.length;
  const barWidth = Math.max(3, Math.min(16, slotWidth * 0.3));
  const baselineY = PADDING_TOP + chartHeight;
  const axisLabelFontSize = days === 30 ? 8 : 10;

  const showEmptyState = !isLoading && (error !== null || data.length === 0);

  const weekdayIndexFor = (date: Date) =>
    date.getDay() === 0 ? 6 : date.getDay() - 1;

  return (
    <div className="trend-chart" aria-busy={isLoading}>
      <div
        className="trend-toolbar"
        role="group"
        aria-label={t.dashboard.trend.periodLabel}
      >
        <button
          type="button"
          className="btn btn-filter"
          aria-pressed={days === 7}
          onClick={() => setDays(7)}
        >
          {t.dashboard.trend.period7}
        </button>
        <button
          type="button"
          className="btn btn-filter"
          aria-pressed={days === 30}
          onClick={() => setDays(30)}
        >
          {t.dashboard.trend.period30}
        </button>
      </div>

      {isLoading ? (
        <div className="trend-skeleton" aria-hidden="true">
          {SKELETON_BAR_HEIGHTS.map((height, index) => (
            <div className="trend-skeleton-col" key={`trend-skeleton-${index}`}>
              <Skeleton
                className="trend-skeleton-bar"
                style={{ height: `${height}%` }}
              />
              <Skeleton className="trend-skeleton-label" />
            </div>
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="trend-empty" role="status">
          {t.dashboard.trend.empty}
        </div>
      ) : (
        <>
          <div className="trend-legend">
            <span className="trend-legend-item">
              <span
                className="trend-legend-dot trend-legend-dot-income"
                aria-hidden="true"
              />
              {t.dashboard.trend.legendIncome}
            </span>
            <span className="trend-legend-item">
              <span
                className="trend-legend-dot trend-legend-dot-outcome"
                aria-hidden="true"
              />
              {t.dashboard.trend.legendOutcome}
            </span>
          </div>

          <svg
            className="trend-svg"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            role="img"
            aria-label={t.dashboard.trend.chartAria}
          >
            <line
              className="trend-gridline"
              x1={PADDING_X}
              x2={VIEWBOX_WIDTH - PADDING_X}
              y1={PADDING_TOP}
              y2={PADDING_TOP}
            />
            <line
              className="trend-gridline"
              x1={PADDING_X}
              x2={VIEWBOX_WIDTH - PADDING_X}
              y1={PADDING_TOP + chartHeight / 2}
              y2={PADDING_TOP + chartHeight / 2}
            />
            <line
              className="trend-axis"
              x1={PADDING_X}
              x2={VIEWBOX_WIDTH - PADDING_X}
              y1={baselineY}
              y2={baselineY}
            />

            {points.map((point, index) => {
              const centerX = PADDING_X + slotWidth * index + slotWidth / 2;
              const gap = Math.min(4, barWidth / 3);
              const incomeX = centerX - barWidth - gap / 2;
              const outcomeX = centerX + gap / 2;
              const incomeHeight = (point.income / maxValue) * chartHeight;
              const outcomeHeight = (point.outcome / maxValue) * chartHeight;
              const dayLabel = t.dashboard.weekdayShort[weekdayIndexFor(point.date)];
              const incomeLabel = `${t.dashboard.trend.legendIncome} ${dayLabel}: ${formatRupiah(point.income)}`;
              const outcomeLabel = `${t.dashboard.trend.legendOutcome} ${dayLabel}: ${formatRupiah(point.outcome)}`;

              return (
                <g key={point.key}>
                  <rect
                    className="trend-bar trend-bar-income"
                    x={incomeX}
                    y={baselineY - incomeHeight}
                    width={barWidth}
                    height={incomeHeight}
                    rx={Math.min(3, barWidth / 2)}
                    aria-label={incomeLabel}
                  >
                    <title>{incomeLabel}</title>
                  </rect>
                  <rect
                    className="trend-bar trend-bar-outcome"
                    x={outcomeX}
                    y={baselineY - outcomeHeight}
                    width={barWidth}
                    height={outcomeHeight}
                    rx={Math.min(3, barWidth / 2)}
                    aria-label={outcomeLabel}
                  >
                    <title>{outcomeLabel}</title>
                  </rect>
                  <text
                    className="trend-axis-label"
                    x={centerX}
                    y={VIEWBOX_HEIGHT - 10}
                    textAnchor="middle"
                    fontSize={axisLabelFontSize}
                  >
                    {dayLabel}
                  </text>
                </g>
              );
            })}
          </svg>

          <ul className="trend-a11y-list">
            {points.map((point) => {
              const dayLabel = t.dashboard.weekdayShort[weekdayIndexFor(point.date)];
              return (
                <li key={point.key}>
                  {`${t.dashboard.trend.legendIncome}: ${formatRupiah(point.income)}; ${t.dashboard.trend.legendOutcome}: ${formatRupiah(point.outcome)} (${dayLabel})`}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
