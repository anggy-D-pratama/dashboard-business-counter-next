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
      <div className="dashboard-page flex w-full">
        <Navigation />

        <SidebarInset>
          <div className="main-wrapper flex flex-col flex-1 min-w-0 min-h-screen">
            <TopMenu />
            
            <main className="container main-content flex-1 p-4 md:p-6">{children}</main>

            <footer className="footer-container border-t border-gray-200 py-4 px-6 mt-auto text-sm text-gray-500 bg-white">
              <div className="container mx-auto">
                {/* Footer siap disisipi konten/teks di task mendatang */}
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
