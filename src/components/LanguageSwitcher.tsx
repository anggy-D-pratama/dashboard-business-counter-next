"use client";

import React from "react";
import { useLocale } from "../contexts/LocaleContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium ${className}`}>
      <button
        type="button"
        onClick={() => setLocale("id")}
        className={`px-2.5 py-1 rounded transition-colors ${
          locale === "id"
            ? "bg-white text-blue-600 shadow-xs font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1 rounded transition-colors ${
          locale === "en"
            ? "bg-white text-blue-600 shadow-xs font-semibold"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}
