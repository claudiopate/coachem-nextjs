import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import PageLayout from "@/layout/PageLayout";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {us
  children: React.ReactNode;
}) {
  const supabase = await createClient(); // <- await qui, perché è async!
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not found");
    // Puoi eventualmente fare redirect o renderizzare qualcosa
  }

  const authProfileId = user?.id;

  return (
    <ThemeProvider>
      <SidebarProvider>
        {authProfileId && <AppSidebar authProfileId={authProfileId} />}
        <Backdrop />
        <PageLayout>
          {children}
        </PageLayout>
      </SidebarProvider>
    </ThemeProvider>
  );
}
