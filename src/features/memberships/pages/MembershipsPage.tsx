import { useParams } from "react-router-dom";

import MembershipList from "../components/MembershipList";

import {
  useMembers,
  // useAddMember,
  useRemoveMember,
  useLeaveOrganization,
} from "../hooks";
// import PermissionGate from "@/components/permissions/PermissionGate";
// import { PERMISSIONS } from "@/permissions/permissions";

export default function MembershipsPage() {
  const { organizationId } =
    useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useMembers(organizationId!);

  // const addMember =
  //   useAddMember();

  const removeMember =
    useRemoveMember();

  const leaveOrganization =
    useLeaveOrganization();

  if (isLoading) {
    return <h2>Loading members...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Members</h1>

    {/* <PermissionGate minimumRole={PERMISSIONS.manageMembers}>
      <button
        onClick={() =>
          addMember.mutate({
            organizationId:
              organizationId!,
            data: {
              user_id: 1,
              role: "viewer",
            },
          })
        }
      >
        Add Demo Member
      </button>
    </PermissionGate> */}
      
    
      <button
        style={{ marginLeft: "10px" }}
        onClick={() =>
          leaveOrganization.mutate(
            organizationId!
          )
        }
      >
        Leave Organization
      </button>
    
      

      <hr />

      <MembershipList
        members={data ?? []}
        onRemove={(userId) =>
          removeMember.mutate({
            organizationId:
              organizationId!,
            userId,
          })
        }
      />
    </div>
  );
}
