'use client';

import { SidebarProvider } from "@/context/SidebarContext";
import { AuthRoleProvider } from "@/context/auth/AuthRoleProvider";
import { ProfileProvider } from "@/context/profile/ProfileProvider";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import DashboardHeaderClient from "@/components/header/DashboardHeaderClient";
import { useSidebar } from "@/context/SidebarContext";

interface ClientLayoutProps {
  children: React.ReactNode;
  authProfileId: string;
  userRole?: string;
}

function ClientLayoutContent({ children, authProfileId, userRole }: ClientLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {authProfileId && <AppSidebar authProfileId={authProfileId} userRole={userRole} />}
      <Backdrop />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
        <DashboardHeaderClient />
        <main className="p-4 md:p-6 max-w-[1920px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ClientLayout(props: ClientLayoutProps) {
  return (
    <SidebarProvider>
      <AuthRoleProvider>
        <ProfileProvider profileId={props.authProfileId}>
          <ClientLayoutContent {...props} />
        </ProfileProvider>
      </AuthRoleProvider>
    </SidebarProvider>
  );
} 