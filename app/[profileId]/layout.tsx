import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLayout from "@/layout/PageLayout";
import DashboardHeader from "./dashboard/Header/DashboardHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
          <Backdrop />
          <PageLayout>
            {children}
          </PageLayout>
        </SidebarProvider>
      </ThemeProvider>
  );
}
