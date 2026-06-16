"use client";

import React, { useState } from "react";
import "./SettingsPage.css";
import { ChangePasswordForm } from "./settings/ChangePasswordForm";
import { BusinessModelSettings } from "./settings/BusinessModelSettings";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="settings-page">
      <div className="header">
        <h2>Pengaturan Akun</h2>
        <p>Kelola keamanan dan preferensi akun Anda</p>
      </div>

      <div className="tabs-nav" role="tablist" aria-label="Pengaturan">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "profile"}
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
          className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
          role="tab"
          aria-selected={activeTab === "security"}
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
        {activeTab === "profile" && <BusinessModelSettings />}

        {activeTab === "security" && <ChangePasswordForm />}
      </div>
    </div>
  );
}
