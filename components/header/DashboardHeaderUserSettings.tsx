"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import React from "react";

interface Props {
  isApplicationMenuOpen: boolean;
  setApplicationMenuOpen: (open: boolean) => void;
}

const DashboardHeaderUserSettings: React.FC<Props> = ({
  isApplicationMenuOpen,
  setApplicationMenuOpen,
}) => {
  return (
    <div
      className={`${
        isApplicationMenuOpen ? "flex" : "hidden"
      } fixed top-[calc(env(safe-area-inset-top)+3.5rem)] right-0 left-0 flex-col w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 lg:relative lg:flex lg:flex-row lg:w-auto lg:border-none lg:top-auto lg:bg-transparent`}
    >
      <div className="flex items-center justify-end gap-2 p-4 lg:p-0">
        <ThemeToggleButton />
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </div>
  );
};

export default DashboardHeaderUserSettings;
