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
    <header className="fixed top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-sm">
      <nav className="container mx-auto px-2 sm:px-4 h-[var(--header-height)] flex items-center justify-between">
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
          className="md:hidden inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Toggle menu</span>
          {isOpen ? (
            <XIcon className="block h-5 w-5" />
          ) : (
            <MenuIcon className="block h-5 w-5" />
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
            fixed top-[var(--header-height)] left-0 w-full h-[calc(100vh-var(--header-height))]
            bg-white dark:bg-gray-900 shadow-lg md:hidden
            transform transition-transform duration-200 ease-in-out overflow-y-auto
            ${isOpen ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full text-left block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
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
    </header>
  );
} 