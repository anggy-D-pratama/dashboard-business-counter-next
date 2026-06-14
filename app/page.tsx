"use client";

import { DashboardOverview } from "@/src/components/DashboardOverview";
import { Navigation } from "@/src/components/Navigation";
import { SettingsPage } from "@/src/components/SettingsPage";
import { UploadData } from "@/src/components/UploadData";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="dashboard-page">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="main-wrapper">
        <main className="container main-content">
          {activeTab === "overview" ? <DashboardOverview /> : null}
          {activeTab === "settings" ? <SettingsPage /> : null}
          {activeTab === "upload" ? <UploadData /> : null}
        </main>

        <footer className="footer container">
          <p>&copy; 2024 Busniss Counter. Powered by Antigravity Design.</p>
        </footer>
      </div>
    </div>
  );
}
