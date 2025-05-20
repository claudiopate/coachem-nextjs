'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleBasedAccess({ children, allowedRoles }: RoleBasedAccessProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkAccess() {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setHasAccess(false);
          return;
        }

        // Fetch user role
        const { data: profileRole, error: roleError } = await supabase
          .from('profile_role')
          .select(`
            role:role (
              name
            )
          `)
          .eq('profile_id', user.id)
          .single<{ role: { name: string } }>();

        if (roleError || !profileRole) {
          setHasAccess(false);
          return;
        }

        const userRole = profileRole.role.name;
        setHasAccess(allowedRoles.includes(userRole));
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      }
    }

    checkAccess();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [allowedRoles, supabase]);

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
