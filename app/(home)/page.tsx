import Hero from '@/components/hero';
import Feature from '@/components/feature';
import JoinUs from '@/components/join_us';

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Hero />
      <Feature />
      <JoinUs />
    </main>
  );
}
