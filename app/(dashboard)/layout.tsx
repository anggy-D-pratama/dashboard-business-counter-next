"use client";

import { Navigation } from "@/src/components/Navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-page">
      <Navigation />

      <div className="main-wrapper">
        <main className="container main-content">{children}</main>

        {/* <footer className="footer container">
          <p>&copy; 2024 NotaKita. Powered by Antigravity Design.</p>
        </footer> */}
      </div>
    </div>
  );
}
