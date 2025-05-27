"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { createClient } from "@/utils/supabase/client";
import {
  BoxIcon,
  Calendar,
  ChevronDown,
  GridIcon,
  GripHorizontal,
  ListIcon,
  LucidePackage,
  PieChartIcon,
  LucidePlug,
  TableIcon,
  UserCircle,
  Users,
} from "lucide-react"
import { useParams } from 'next/navigation';
import SidebarContent from "./SidebarContent";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "dashboard",
  },
  {
    icon: <Calendar />,
    name: "Calendar",
    path: "calendar",
  },
  {
    icon: <Users />,
    name: "Students",
    path: "students",
    roles: ["coach", "admin", "staff"]
  }
];

interface AppSidebarProps {
  authProfileId: string;
  userRole?: string;
}

const AppSidebar = ({ authProfileId, userRole }: AppSidebarProps) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const sidebarWidth = isExpanded || isHovered ? "w-[290px]" : "w-[90px]";
  const mobileClasses = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={`
        fixed left-0 bottom-0 z-[99998]
        bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800
        transition-all duration-300 ease-in-out overflow-hidden
        w-[280px] sm:w-[290px]
        lg:w-auto lg:sticky lg:top-[calc(env(safe-area-inset-top)+4rem)] lg:h-[calc(100vh-env(safe-area-inset-top)-4rem)]
        ${mobileClasses} ${sidebarWidth}
      `}
      style={{ top: 'calc(env(safe-area-inset-top) + 3.5rem)' }}
    >
      <SidebarContent authProfileId={authProfileId} userRole={userRole} />
    </aside>
  );
};

export default AppSidebar;
