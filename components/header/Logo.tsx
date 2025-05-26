"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <Image
          src="/images/logo/logo.svg"
          alt="Coachem Logo"
          width={120}
          height={32}
          className="h-6 w-auto md:h-8"
          priority
        />
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <Image
        src={resolvedTheme === 'dark' ? '/images/logo/logo-dark.svg' : '/images/logo/logo.svg'}
        alt="Coachem Logo"
        width={120}
        height={32}
        className="h-6 w-auto md:h-8"
        priority
      />
    </div>
  );
} 