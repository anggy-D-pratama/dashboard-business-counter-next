"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale } from "../contexts/LocaleContext";
import "./Navigation.css";

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const { t } = useLocale();

  // Helper function
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header flex items-center w-full px-2">
        <Link href="/" className="logo">
          <img src="/logo.png" alt="NotaKita Logo" className="brand-logo" />
        </Link>
      </div>

      <div className="sidebar-content">
        {isAuthenticated && (
          <div className="nav-menu">
            <div className="menu-label">{t.nav.mainMenu}</div>

            <Link
              href="/"
              className={pathname === "/" ? "active" : ""}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
              {t.nav.dashboard}
            </Link>

            <Link
              href="/upload"
              className={pathname === "/upload" ? "active" : ""}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {t.nav.importData}
            </Link>

            <div className="menu-label mt-4">{t.nav.preferences}</div>
            <Link
              href="/settings"
              className={pathname === "/settings" ? "active" : ""}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              {t.nav.settings}
            </Link>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div className="user-control">
            <div className="user-avatar">
              {user ? getInitials(user.name) : "??"}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{t.nav.admin}</span>
            </div>
            <button
              onClick={logout}
              className="icon-btn logout-btn"
              title={t.nav.logout}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="auth-group">
            <Link href="/login" className="btn btn-secondary w-full">
              {t.nav.login}
            </Link>
            <Link href="/register" className="btn btn-primary w-full">
              {t.nav.tryFree}
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
