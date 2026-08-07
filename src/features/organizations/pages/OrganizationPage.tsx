import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PageState from "@/components/PageState";
import { getOrganization } from "../api/organizationsApi";
import { useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";

export default function OrganizationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setOrganization } = useOrganization();

  const {
    data: organization,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id!),
    enabled: !!id,
  });

  useEffect(() => {
  if (organization) {
    setOrganization({
      public_id: organization.public_id,
      name: organization.name,
    });
  }
}, [organization]);

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!organization}
      loadingMessage="Loading organization..."
      emptyMessage="Organization not found."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <h1>{organization?.name}</h1>
          <p>{organization?.description}</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => navigate(`/organizations/${organization!.public_id}/projects`)}>View Projects</button>
          <button onClick={() => navigate(`/organizations/${organization!.public_id}/members`)}>View Members</button>
          <button onClick={() => navigate(`/organizations/${organization!.public_id}/invitations`)}>View Invitations</button>
          <button onClick={() => navigate(`/organizations/${organization!.public_id}/activity-log`)}>View Activity Log</button>
        </div>

        <div>
          <h3>Public ID</h3>
          <p>{organization?.public_id}</p>
        </div>
      </div>
    </PageState>
  );
}