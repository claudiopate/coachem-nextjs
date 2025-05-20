import { Metadata } from "next";
import CalendarPage from "./CalendarPage";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lessons Calendar"
};

interface PageProps {
  params: {
    profileId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/auth/signin");
  }

  return <CalendarPage params={params} />;
}
