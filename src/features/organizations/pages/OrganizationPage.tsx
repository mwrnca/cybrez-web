import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "../api/organizationsApi";

export default function OrganizationPage() {
  const { id } = useParams();

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

  if (isLoading) {
    return <h2>Loading organization...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  if (!organization) {
    return <h2>Organization not found.</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{organization.name}</h1>

      <p>{organization.description}</p>

      <hr />

      <h3>Public ID</h3>

      <p>{organization.public_id}</p>

      <hr />

      <h3>Next Features</h3>

      <ul>
        <li>Projects</li>
        <li>Members</li>
        <li>Invitations</li>
        <li>Activity Log</li>
      </ul>
    </div>
  );
}