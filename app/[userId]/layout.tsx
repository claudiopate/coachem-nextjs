"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLayout from "@/layout/PageLayout";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <PageLayout>{children}</PageLayout>
      </SidebarProvider>
    </ThemeProvider>
  );
}
