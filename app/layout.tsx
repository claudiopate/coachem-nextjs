'use client';

import '@/app/globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import DefaultPage from './default';

function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.navigator.userAgent.includes('Coachem iOS App');
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Se siamo sulla home page e è un dispositivo mobile, mostra la pagina di default
  const content = (isHomePage && isMobile) ? <DefaultPage /> : children;

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className="bg-white dark:bg-gray-900 tracking-tight" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {content}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}