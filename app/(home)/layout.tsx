import HomeHeader from "@/components/header/HomeHeader";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeHeader />
      {children}
    </>
  );
}
