"use client";

import React, { useState } from "react";
import DashboardHeaderToggleMenu from "./DashboardHeaderToggleMenu";
import DashboardHeaderUserSettings from "./DashboardHeaderUserSettings";

const DashboardHeaderClient: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[99999] w-full">
      <div className="fixed inset-x-0 top-0 z-[99999] bg-white dark:bg-zinc-900">
        <div className="h-[env(safe-area-inset-top)]" />
        <header className="border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
            <DashboardHeaderToggleMenu
              isApplicationMenuOpen={isApplicationMenuOpen}
              setApplicationMenuOpen={setApplicationMenuOpen}
            />
            <DashboardHeaderUserSettings
              isApplicationMenuOpen={isApplicationMenuOpen}
              setApplicationMenuOpen={setApplicationMenuOpen}
            />
          </div>
        </header>
      </div>
      <div className="h-[calc(env(safe-area-inset-top)+3.5rem)] sm:h-[calc(env(safe-area-inset-top)+4rem)]" />
    </div>
  );
};

export default DashboardHeaderClient;
