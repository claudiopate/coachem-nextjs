import RoleBasedAccess from "../auth/RoleBasedAccess";

// components/AddEventButton.tsx
type AddEventButtonProps = {
    onClick: () => void;
  };
  
  export const AddEventButton = ({ onClick }: AddEventButtonProps) => {
    return (
      <RoleBasedAccess allowedRoles={["coach"]}>
        <button onClick={onClick} className="custom-fc-button">
          Add Event +
        </button>
      </RoleBasedAccess>
    );
  };
  