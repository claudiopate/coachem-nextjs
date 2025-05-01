"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import menuData from "./menuData";
import { usePathname } from "next/navigation";
import UserDropdown from "@/components/header/UserDropdown";
import { createClient } from "@/utils/supabase/client";

const HomeHeader: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [dropdownToggler, setDropdownToggler] = useState(false);

  const supabase = createClient();

  const pathUrl = usePathname();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return console.error("User not found");
        }

        const response = await fetch(`/api/profile/${user.id}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    getProfile();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 py-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            width={154}
            height={32}
            className="dark:hidden"
            src="/images/logo/logo.svg"
            alt="Logo"
          />
          <Image
            width={154}
            height={32}
            className="hidden dark:block"
            src="/images/logo/logo-dark.svg"
            alt="Logo"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden xl:flex flex-1 justify-center">
          <ul className="flex items-center gap-8">
            {menuData.map((menuItem, key) => (
              <li key={key} className={`relative ${menuItem.submenu ? "group" : ""}`}>
                {menuItem.submenu ? (
                  <>
                    <button
                      onClick={() => setDropdownToggler(!dropdownToggler)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    >
                      {menuItem.title}
                      <svg
                        className="h-3 w-3 fill-current"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    </button>
                    <ul className={`absolute left-0 mt-2 w-40 rounded-md bg-white p-2 shadow-lg dark:bg-gray-800 ${dropdownToggler ? "block" : "hidden"}`}>
                      {menuItem.submenu.map((item, subKey) => (
                        <li key={subKey}>
                          <Link
                            href={item.path || "#"}
                            className="block px-3 py-2 text-sm text-gray-700 hover:text-primary dark:text-gray-200 dark:hover:text-primary"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={menuItem.path}
                    className={`text-sm font-medium hover:text-primary ${
                      pathUrl === menuItem.path
                        ? "text-primary"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {menuItem.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!profile ? (
            <>
              <button className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10">
                  <Link
                    className="text-black hover:text-primary dark:text-white dark:hover:text-primary"
                    href="/auth/signin"
                  >
                    Sign In
                  </Link>
              </button>
              <button className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10">
                <Link href="/auth/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    Sign Up
                </Link>
              </button>
            </>
          ) : (
            <>
              <UserDropdown /> 
            </>
          )}
        </div>
      </div>
    </header>

  );
};

export default HomeHeader;
