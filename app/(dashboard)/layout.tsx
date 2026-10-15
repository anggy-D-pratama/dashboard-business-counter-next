"use client";

import { Navigation } from "@/src/components/Navigation";
import { TopMenu } from "@/src/components/TopMenu";

import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="app-shell">
        <Navigation />

        <SidebarInset>
          <TopMenu />

          <main className="main-content">
            <div className="container">{children}</div>
          </main>

          <footer className="app-footer">
            <div className="container">
              {/* Footer siap disisipi konten/teks di task mendatang */}
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
