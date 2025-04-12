export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className="bg-white dark:bg-gray-900 tracking-tight">
        {children}
      </body>
    </html>
  );
}