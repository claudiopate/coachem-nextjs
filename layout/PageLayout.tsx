"use client";

import DashboardHeader from "@/app/[profileId]/dashboard/Header/DashboardHeader";
import DashboardHeaderClient from "@/app/[profileId]/dashboard/Header/DashboardHeaderClient";
import { AuthRoleProvider } from "@/context/auth/AuthRoleProvider";
import { useSidebar } from "@/context/SidebarContext";
import React from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AuthRoleProvider>
        <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
          <DashboardHeaderClient  />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </div>
      </AuthRoleProvider>
    </div>
  );
}
