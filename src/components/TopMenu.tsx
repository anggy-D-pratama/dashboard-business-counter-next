"use client";

import React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useLocale } from "../contexts/LocaleContext";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";
import "./TopMenu.css";

export function TopMenu() {
  const { t } = useLocale();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Inert search: placeholder only, no backend/route action.
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-start">
        <SidebarTrigger
          className="topbar-trigger"
          aria-label={t.shell.toggleSidebar}
        />
        <div className="topbar-search">
          <span className="topbar-search-icon" aria-hidden="true">
            <svg
              className="topbar-search-svg"
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
          <Input
            type="text"
            readOnly
            aria-label={t.shell.searchAriaLabel}
            placeholder={t.shell.searchPlaceholder}
            onKeyDown={handleKeyDown}
            className="topbar-search-input"
          />
        </div>
      </div>

      <div className="topbar-actions">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
