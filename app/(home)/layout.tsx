import HomeHeader from '@/layout/Header';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
