'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { XMarkIcon as XIcon, Bars3Icon as MenuIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/profile/dashboard' },
  { name: 'Calendar', href: '/profile/calendar' },
  { name: 'Students', href: '/profile/students' },
];

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Safe area spacer */}
      <div className="bg-white dark:bg-gray-900 h-[48px] ios:h-[64px]" />
      
      {/* Header content */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center"
            >
              <Image
                src="/images/logo/logo.svg"
                alt="Logo"
                width={120}
                height={32}
                className="h-6 w-auto md:h-8"
              />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname?.startsWith(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile navigation */}
          <div 
            className={`
              fixed inset-x-0 top-[112px] ios:top-[128px] bottom-0
              bg-white dark:bg-gray-900 shadow-lg md:hidden
              transform transition-transform duration-200 ease-in-out
              ${isOpen ? 'translate-y-0' : '-translate-y-full'}
            `}
          >
            <div className="px-4 py-3 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    pathname?.startsWith(item.href)
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
} 