"use client";

import React, { useState } from "react";
import DashboardHeaderToggleMenu from "./DashboardHeaderToggleMenu";
import DashboardHeaderUserSettings from "./DashboardHeaderUserSettings";

const DashboardHeaderClient: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  return (
    <>
      {/* Spacer per i controlli iOS */}
      <div className="h-[env(safe-area-inset-top)] w-full" />
      
      {/* Header fisso sotto i controlli iOS */}
      <div className="fixed left-0 right-0 z-[99999] bg-white dark:bg-zinc-900" style={{ top: 'env(safe-area-inset-top)' }}>
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

      {/* Spacer per il contenuto sotto l'header */}
      <div className="h-14 sm:h-16" />
    </>
  );
};

export default DashboardHeaderClient;
