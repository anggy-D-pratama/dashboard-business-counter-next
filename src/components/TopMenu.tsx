"use client";

import React, { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "../contexts/LocaleContext";

export function TopMenu() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");

  const placeholderText = locale === "id" ? "Cari sesuatu..." : "Search...";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Dummy search, no DB/backend hit
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center shrink-0">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
