'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

interface ProfileRole {
  role_id: string;
  role: {
    name: string;
  };
}

export function RoleBasedAccess({ children, allowedRoles }: RoleBasedAccessProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push('/auth/signin');
          return;
        }

        // Fetch user role with proper join
        const { data: profileRole, error: roleError } = await supabase
          .from('profile_role')
          .select(`
            role_id,
            role (
              name
            )
          `)
          .eq('profile_id', user.id)
          .single<ProfileRole>();

        if (roleError) {
          console.error('Error fetching role:', roleError);
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        if (!profileRole || !profileRole.role) {
          console.error('No role found for user');
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        const userRole = profileRole.role.name;
        const hasPermission = allowedRoles.includes(userRole);
        setHasAccess(hasPermission);

        if (!hasPermission) {
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [allowedRoles, supabase, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return hasAccess ? children : null;
}
