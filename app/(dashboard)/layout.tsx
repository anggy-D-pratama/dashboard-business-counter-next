"use client";

import { Navigation } from "@/src/components/Navigation";
import { TopMenu } from "@/src/components/TopMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-page flex pl-[260px]">
      <Navigation />

      <div className="main-wrapper flex-1 flex flex-col min-w-0">
        <TopMenu />
        
        <main className="container main-content">{children}</main>

        {/* <footer className="footer container">
          <p>&copy; 2024 NotaKita. Powered by Antigravity Design.</p>
        </footer> */}
      </div>
    </div>
  );
}
