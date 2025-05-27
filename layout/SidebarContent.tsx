'use client';

import React, { ReactElement } from "react";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { GripHorizontal } from "lucide-react";

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
      icon: <GripHorizontal className="w-6 h-6" />,
    },
    {
      name: "Calendar",
      path: "calendar",
      icon: <GripHorizontal className="w-6 h-6" />,
    },
    {
      name: "Students",
      path: "students",
      icon: <GripHorizontal className="w-6 h-6" />,
      roles: ["COACH"],
    },
  ];

  const renderMenuItems = (navItems: NavItem[]) => {
    return (
      <ul className="flex flex-col gap-4">
        {navItems.map((nav) => {
          const hasRequiredRole = !nav.roles || (userRole && nav.roles.includes(userRole));
          
          if (!hasRequiredRole) return null;

          return (
            <li key={nav.name}>
              <Link
                href={`/profile/${authProfileId}/${nav.path}`}
                className={`menu-item group ${
                  pathname === `/profile/${authProfileId}/${nav.path}`
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span className={pathname === `/profile/${authProfileId}/${nav.path}`
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                }>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
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
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "justify-center" : "justify-start"} px-5`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
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

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-5">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "justify-center" : "justify-start"
              }`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <GripHorizontal />}
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