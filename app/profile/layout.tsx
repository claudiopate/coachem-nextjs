import { redirect } from "next/navigation";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientLayout from './ClientLayout';

interface RoleResponse {
  role: {
    name: string;
  };
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      redirect("/auth/signin");
    }

    console.log('User found:', user.id); // Debug log

    // Fetch user role with more detailed error handling
    let userRole: string | undefined = undefined;
    const authProfileId = user.id;

    try {
      const { data: profileRole, error: roleError } = await supabase
        .from('profile_role')
        .select(`
          role:role (
            name
          )
        `)
        .eq('profile_id', user.id)
        .single<RoleResponse>();

      if (roleError) {
        console.error('Role fetch error details:', {
          error: roleError,
          userId: user.id,
          query: 'profile_role with role.name',
        });
      } else if (!profileRole) {
        console.error('No role found for user:', user.id);
      } else {
        userRole = profileRole.role?.name;
        console.log('Role found:', userRole); // Debug log
      }
    } catch (roleError) {
      console.error('Role fetch exception:', roleError);
    }

    // Continue even if role fetch fails
    return (
      <ClientLayout
        authProfileId={authProfileId}
        userRole={userRole}
      >
        {children}
      </ClientLayout>
    );
  } catch (error) {
    console.error('Layout error:', error);
    redirect("/auth/signin");
  }
}
