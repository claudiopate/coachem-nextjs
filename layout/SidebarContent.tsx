'use client';

import React, { ReactElement } from "react";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GripHorizontal, LayoutDashboard, Calendar, Users } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: ReactElement;
  roles?: string[];
}

interface SidebarContentProps {
  authProfileId: string;
  userRole?: string;
}

const SidebarContent = ({ authProfileId, userRole }: SidebarContentProps) => {
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      path: "dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      name: "Calendar",
      path: "calendar",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      name: "Students",
      path: "students",
      icon: <Users className="w-6 h-6" />,
      roles: ["coach"],
    },
  ];

  const renderMenuItems = (navItems: NavItem[]) => {
    return (
      <ul className="flex flex-col gap-6 pl-8">
        {navItems.map((nav) => {
          const hasRequiredRole = !nav.roles || (userRole && nav.roles.includes(userRole));
          
          if (!hasRequiredRole) return null;

          return (
            <li key={nav.name}>
              <Link
                href={`/profile/${authProfileId}/${nav.path}`}
                className={`menu-item group flex items-center ${
                  pathname === `/profile/${authProfileId}/${nav.path}`
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <span className="flex items-center justify-center">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-6 text-base">
                    {nav.name}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div
      className="h-full"
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex items-center ${!isExpanded && !isHovered ? "justify-center" : "px-8"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={154}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={154}
                height={32}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav>
          <div className="flex flex-col">
            <div>
              <h2 className={`mb-6 text-sm uppercase flex leading-[20px] text-gray-500 ${
                !isExpanded && !isHovered ? "justify-center" : "pl-8"
              }`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <GripHorizontal className="w-6 h-6" />}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SidebarContent; 