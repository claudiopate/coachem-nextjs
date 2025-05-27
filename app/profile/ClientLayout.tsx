'use client';

import { SidebarProvider } from "@/context/SidebarContext";
import { AuthRoleProvider } from "@/context/auth/AuthRoleProvider";
import { ProfileProvider } from "@/context/profile/ProfileProvider";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import DashboardHeaderClient from "@/components/header/DashboardHeaderClient";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
  authProfileId: string;
  userRole?: string;
}

function ClientLayoutContent({ children, authProfileId, userRole }: ClientLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gray-50 dark:bg-zinc-900">
      <DashboardHeaderClient />
      
      <div className="flex relative">
        {authProfileId && (
          <>
            <AppSidebar authProfileId={authProfileId} userRole={userRole} />
            <Backdrop />
          </>
        )}
        
        <main className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          <div className="h-full p-3 sm:p-4 md:p-6 max-w-[1920px] mx-auto">
            {children}
          </div>
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