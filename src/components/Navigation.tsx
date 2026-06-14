"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import "./Navigation.css";

interface NavigationProps {
  activeTab?: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { isAuthenticated, user, logout } = useAuth();

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
      <div className="sidebar-header">
        <Link href="/" className="logo">
          <div className="logo-mark">
            <div className="mark-inner"></div>
          </div>
          <span className="logo-text">
            Sisense<span>Analytics</span>
          </span>
        </Link>
      </div>

      <div className="sidebar-content">
        {isAuthenticated && (
          <div className="nav-menu">
            <div className="menu-label">Main Menu</div>

            {activeTab && (
              <>
                <button
                  className={activeTab === "overview" ? "active" : ""}
                  onClick={() => onTabChange("overview")}
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
                  Dashboard
                </button>

                <button
                  className={activeTab === "upload" ? "active" : ""}
                  onClick={() => onTabChange("upload")}
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
                  Data Import
                </button>

                <div className="menu-label mt-4">Preferences</div>
                <button
                  className={activeTab === "settings" ? "active" : ""}
                  onClick={() => onTabChange("settings")}
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
                  Settings
                </button>
              </>
            )}
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
              <span className="user-role">Admin</span>
            </div>
            <button
              onClick={logout}
              className="icon-btn logout-btn"
              title="Logout"
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
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary w-full">
              Try Free
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
