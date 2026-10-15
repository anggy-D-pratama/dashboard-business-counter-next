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
          {isCollapsed ? (
            <span className="sidebar-logo-mark">N</span>
          ) : (
            <img
              src="/logo.png"
              alt="NotaKita Logo"
              className="sidebar-logo-image"
            />
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
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
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
