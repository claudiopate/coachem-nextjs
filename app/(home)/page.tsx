import { Outfit } from 'next/font/google';

import HomeHeader from '@/layout/Header';
import Hero from '@/components/hero';
import Feature from '@/components/feature';
import JoinUs from '@/components/join_us';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <HomeHeader />
      <main className="relative overflow-hidden">
      <Hero />
      <Feature />
      <JoinUs />
      </main>
    </div>
  );
}
