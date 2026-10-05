"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { useLocale } from "../contexts/LocaleContext";
import { Sidebar, useSidebar } from "./ui/sidebar";
import "./Navigation.css";

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

  return (
    <Sidebar className="navigation-sidebar">
      <div className={`sidebar-header flex items-center w-full ${isCollapsed ? "justify-center px-1" : "px-4"}`}>
        <Link href="/" className="logo flex items-center justify-center">
          {isCollapsed ? (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-lg">
              N
            </div>
          ) : (
            <img src="/logo.png" alt="NotaKita Logo" className="brand-logo max-h-10 object-contain" />
          )}
        </Link>
      </div>

      <div className="sidebar-content flex-1 overflow-y-auto px-2 py-4">
        {isAuthenticated && (
          <nav className="nav-menu flex flex-col gap-1">
            {!isCollapsed && <div className="menu-label px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t.nav.mainMenu}</div>}

            <Link
              href="/"
              title={isCollapsed ? t.nav.dashboard : undefined}
              className={`flex items-center rounded-lg p-2.5 text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
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
              {!isCollapsed && <span>{t.nav.dashboard}</span>}
            </Link>

            <Link
              href="/upload"
              title={isCollapsed ? t.nav.importData : undefined}
              className={`flex items-center rounded-lg p-2.5 text-sm font-medium transition-colors ${
                pathname === "/upload"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {!isCollapsed && <span>{t.nav.importData}</span>}
            </Link>

            {!isCollapsed && <div className="menu-label px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4">{t.nav.preferences}</div>}
            
            <Link
              href="/settings"
              title={isCollapsed ? t.nav.settings : undefined}
              className={`flex items-center rounded-lg p-2.5 text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              {!isCollapsed && <span>{t.nav.settings}</span>}
            </Link>
          </nav>
        )}
      </div>

      <div className="sidebar-footer border-t border-gray-200 p-3 bg-white">
        {isAuthenticated ? (
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs shrink-0">
                {user ? getInitials(user.name) : "??"}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">{user?.name}</span>
                  <span className="text-xs text-gray-500 truncate">{t.nav.admin}</span>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className={`text-gray-400 hover:text-red-600 transition-colors ${isCollapsed ? "hidden" : "p-1.5"}`}
              title={t.nav.logout}
            >
              <svg
                className="w-5 h-5"
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
          <div className="auth-group flex flex-col gap-2">
            {!isCollapsed ? (
              <>
                <Link href="/login" className="btn btn-secondary w-full text-center text-xs py-2">
                  {t.nav.login}
                </Link>
                <Link href="/register" className="btn btn-primary w-full text-center text-xs py-2">
                  {t.nav.tryFree}
                </Link>
              </>
            ) : (
              <Link href="/login" className="flex justify-center p-2 text-indigo-600 hover:bg-gray-100 rounded-lg" title={t.nav.login}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
