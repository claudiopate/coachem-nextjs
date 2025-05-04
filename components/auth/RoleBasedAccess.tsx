import { useAuthRole } from "@/context/auth/AuthRoleProvider";

type RoleBasedAccessProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

const RoleBasedAccess = ({ allowedRoles, children }: RoleBasedAccessProps) => {
  const { role } = useAuthRole();

  if (!allowedRoles.includes(role)) {
    return null; // Non mostrare i figli se il ruolo non è consentito
  }

  return <>{children}</>; // Mostra i figli se il ruolo è consentito
};

export default RoleBasedAccess;
