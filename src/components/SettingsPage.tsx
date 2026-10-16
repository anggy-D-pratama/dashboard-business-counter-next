"use client";

import React, { useState } from "react";
import "./SettingsPage.css";
import { ChangePasswordForm } from "./settings/ChangePasswordForm";
import { BusinessModelSettings } from "./settings/BusinessModelSettings";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  return (
    <div className="settings-page">
      <header className="settings-header animate-fade-in">
        <h1>Pengaturan Akun</h1>
        <p className="lead">Kelola keamanan dan preferensi akun Anda</p>
      </header>

      <div className="tabs-nav" role="tablist" aria-label="Pengaturan">
        <button
          className="tab-button"
          role="tab"
          id="tab-profile"
          aria-selected={activeTab === "profile"}
          aria-controls="panel-profile"
          onClick={() => setActiveTab("profile")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="tab-icon"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profil Bisnis
        </button>
        <button
          className="tab-button"
          role="tab"
          id="tab-security"
          aria-selected={activeTab === "security"}
          aria-controls="panel-security"
          onClick={() => setActiveTab("security")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="tab-icon"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Keamanan
        </button>
      </div>

      <div className="tab-panels">
        <div
          className="tab-panel"
          role="tabpanel"
          id="panel-profile"
          aria-labelledby="tab-profile"
          hidden={activeTab !== "profile"}
        >
          <BusinessModelSettings />
        </div>
        <div
          className="tab-panel"
          role="tabpanel"
          id="panel-security"
          aria-labelledby="tab-security"
          hidden={activeTab !== "security"}
        >
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
