import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLayout from "@/layout/PageLayout";
import DashboardHeader from "./dashboard/Header/DashboardHeader";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <PageLayout>
          <DashboardHeader  />
          {children}
          </PageLayout>
      </SidebarProvider>
    </ThemeProvider>
  );
}
