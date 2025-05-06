"use client";

import React, { useState } from "react";
import DashboardHeaderToggleMenu from "./DashboardHeaderToggleMenu";
import DashboardHeaderUserSettings from "./DashboardHeaderUserSettings";

const DashboardHeaderClient: React.FC = () => {
  
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
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
  );
};

export default DashboardHeaderClient;
