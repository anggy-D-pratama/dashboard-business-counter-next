"use client";

import React from "react";
import { useLocale } from "../contexts/LocaleContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`lang-switcher ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("id")}
        aria-pressed={locale === "id"}
        className={`lang-switcher-btn ${locale === "id" ? "lang-switcher-btn-active" : ""}`}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`lang-switcher-btn ${locale === "en" ? "lang-switcher-btn-active" : ""}`}
      >
        EN
      </button>
    </div>
  );
}
