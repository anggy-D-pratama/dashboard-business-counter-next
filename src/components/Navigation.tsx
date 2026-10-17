"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useLocale } from "../contexts/LocaleContext";
import { Sidebar, useSidebar } from "./ui/sidebar";
import "./Navigation.css";

const NAV_ICONS = {
  dashboard: (
    <svg
      className="sidebar-link-icon"
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
  ),
  reports: (
    <svg
      className="sidebar-link-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  upload: (
    <svg
      className="sidebar-link-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  settings: (
    <svg
      className="sidebar-link-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
};

export function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const { t } = useLocale();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderLink = (
    href: string,
    label: string,
    icon: ReactNode
  ) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        title={isCollapsed ? label : undefined}
        aria-current={isActive ? "page" : undefined}
        className={`sidebar-link ${isActive ? "active" : ""} ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        {icon}
        <span className="sidebar-link-label">{label}</span>
      </Link>
    );
  };

  return (
    <Sidebar className="navigation-sidebar">
      <div
        className={`sidebar-header ${
          isCollapsed ? "sidebar-header-collapsed" : ""
        }`}
      >
        <Link href="/" className="sidebar-logo" aria-label="NotaKita">
          <span className="sidebar-logo-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M7 5h10v14H7z"></path>
              <path d="M10 9h4M10 13h4M10 17h2"></path>
            </svg>
          </span>
          {!isCollapsed && (
            <span className="sidebar-logo-copy">
              <span className="sidebar-logo-wordmark">NotaKita</span>
            </span>
          )}
        </Link>
      </div>

      <div className="sidebar-content">
        {isAuthenticated && (
          <nav className="nav-menu" aria-label={t.nav.mainMenu}>
            {!isCollapsed && (
              <div className="menu-label">{t.nav.mainMenu}</div>
            )}

            {renderLink("/", t.nav.dashboard, NAV_ICONS.dashboard)}
            {renderLink("/reports", t.nav.reports, NAV_ICONS.reports)}
            {renderLink("/upload", t.nav.importData, NAV_ICONS.upload)}

            {!isCollapsed && (
              <div className="menu-label menu-label-spaced">
                {t.nav.preferences}
              </div>
            )}

            {renderLink("/settings", t.nav.settings, NAV_ICONS.settings)}
          </nav>
        )}
      </div>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div
            className={`sidebar-user ${
              isCollapsed ? "sidebar-user-collapsed" : ""
            }`}
          >
            <div className="sidebar-user-main">
              <span className="sidebar-avatar">
                {user ? getInitials(user.name) : "??"}
              </span>
              {!isCollapsed && (
                <span className="sidebar-user-meta">
                  <span className="sidebar-user-name">{user?.name}</span>
                  <span className="sidebar-user-role">{t.nav.admin}</span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={logout}
              className={`sidebar-logout ${
                isCollapsed ? "sidebar-logout-hidden" : ""
              }`}
              title={t.nav.logout}
            >
              <svg
                className="sidebar-logout-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M10 17l5-5-5-5M15 12H3M21 3v18" />
              </svg>
              <span className="sidebar-logout-label">{t.nav.logout}</span>
            </button>
          </div>
        ) : (
          <div className="auth-group">
            {!isCollapsed ? (
              <>
                <Link
                  href="/login"
                  className="btn btn-secondary sidebar-auth-btn"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary sidebar-auth-btn"
                >
                  {t.nav.tryFree}
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="sidebar-link collapsed"
                title={t.nav.login}
              >
                <svg
                  className="sidebar-link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                <span className="sidebar-link-label">{t.nav.login}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
