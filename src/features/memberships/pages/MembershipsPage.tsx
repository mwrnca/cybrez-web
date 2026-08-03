import { useParams } from "react-router-dom";

import MembershipList from "../components/MembershipList";

import {
  useMembers,
  useAddMember,
  useRemoveMember,
  useLeaveOrganization,
} from "../hooks";

export default function MembershipsPage() {
  const { organizationId } =
    useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useMembers(organizationId!);

  const addMember =
    useAddMember();

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