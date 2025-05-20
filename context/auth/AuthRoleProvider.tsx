"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";

interface AuthRoleContextType {
  role: string | null;
  loading: boolean;
  error: Error | null;
}

const AuthRoleContext = createContext<AuthRoleContextType>({
  role: null,
  loading: true,
  error: null
});

export const useAuthRole = () => {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider');
  }
  return context;
};

interface AuthRoleProviderProps {
  children: ReactNode;
}

export const AuthRoleProvider: React.FC<AuthRoleProviderProps> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }

        if (!user) {
          setRole(null);
          return;
        }

        const response = await fetch(`/api/profile/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profile = await response.json();
        const userRole = profile.roles?.[0]?.name || null;
        setRole(userRole);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch role'));
      } finally {
        setLoading(false);
      }
    };

    fetchRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchRole();
      } else if (event === 'SIGNED_OUT') {
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthRoleContext.Provider value={{ role, loading, error }}>
      {children}
    </AuthRoleContext.Provider>
  );
};