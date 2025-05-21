import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server';
import { prismaClient } from '@/utils/prisma/client';
import ClientLayout from './ClientLayout';

interface RoleResponse {
  roles: {
    id: string;
    name: string;
    description: string | null;
  }[];
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      redirect("/auth/signin");
    }

    console.log('User found:', user.id); // Debug log

    // Fetch user role using Prisma
    let userRole: string | undefined = undefined;
    const authProfileId = user.id;

    try {
      const profile = await prismaClient.profile.findUnique({
        where: { id: user.id },
        include: {
          profileRole: {
            include: {
              role: true
            }
          }
        }
      });

      if (!profile) {
        console.error('No profile found for user:', user.id);
      } else {
        const allRoles = profile.profileRole.map(pr => pr.role.name);
        console.log('All available roles:', allRoles);
        
        // Check if user has any of the required roles for Students menu
        const allowedRoles = ['coach', 'admin', 'staff'];
        const matchingRole = allRoles.find(role => allowedRoles.includes(role));
        
        userRole = matchingRole || profile.profileRole[0]?.role.name;
        console.log('Assigned role:', userRole);
      }
    } catch (roleError) {
      console.error('Role fetch error:', roleError);
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
