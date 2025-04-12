import { Outfit } from 'next/font/google';
import '@/app/globals.css';

import Header from '@/layout/Header';
import Hero from '@/components/hero';
import Feature from '@/components/feature';
import JoinUs from '@/components/join_us';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <main className="relative overflow-hidden">
      <Hero />
      <Feature />
      <JoinUs />
      </main>
      {children}
    </div>
  );
}
