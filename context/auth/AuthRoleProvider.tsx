// /context/AuthRoleContext.tsx
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { createClient } from "@/utils/supabase/client";
import { Role } from '@/types/auth/Role';
import { AuthRoleContextType } from '@/types/auth/AuthRoleContext';
import { SupabaseJWTClaims } from '@/types/auth/SupabaseJWTClaims';


const AuthRoleContext = createContext<AuthRoleContextType | undefined>(undefined);

export const AuthRoleProvider = ({ children }: { children: React.ReactNode }) => {
  
  const supabase = createClient();
  
  const [role, setRole] = useState<Role>();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          const jwt = jwtDecode<SupabaseJWTClaims>(session.access_token);
          const profileRole = jwt.profile_role;

          if (!profileRole) {
            throw new Error("Missing 'profile_role' claim in JWT");
          }

          // Cast esplicito (solo se sei sicuro che sarà sempre uno di questi valori)
          setRole(profileRole as Role);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!role) {
    // puoi mostrare un loading spinner o lanciare un errore globale
    return <div>Loading role...</div>;
  }

  return (
    <AuthRoleContext.Provider value={{ role }}>
      {children}
    </AuthRoleContext.Provider>
  );
};

export const useAuthRole = () => {
  const context = useContext(AuthRoleContext);
  if (!context) {
    throw new Error('useAuthRole must be used within an AuthRoleProvider');
  }
  return context;
};