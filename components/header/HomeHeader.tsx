"use client";

import React from 'react';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import NotificationDropdown from '@/components/header/NotificationDropdown';
import UserDropdown from '@/components/header/UserDropdown';

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 flex w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="container">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
} 