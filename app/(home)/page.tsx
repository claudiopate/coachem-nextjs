import { Outfit } from 'next/font/google';

import Header from '@/layout/Header';
import Hero from '@/components/hero';
import Feature from '@/components/feature';
import JoinUs from '@/components/join_us';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <Header />
      <main className="relative overflow-hidden">
      <Hero />
      <Feature />
      <JoinUs />
      </main>
    </div>
  );
}
