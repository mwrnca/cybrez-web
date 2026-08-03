import { useParams, useNavigate } from "react-router-dom";

import PageState from "@/components/PageState";
import { useProject } from "../hooks";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProject(id!);

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!project}
      loadingMessage="Loading project..."
      emptyMessage="Project not found."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <h1>{project?.name}</h1>
          <p>{project?.description}</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => navigate(`/projects/${project!.public_id}/tasks`)}>View Tasks</button>
          <button onClick={() => navigate(`/organizations/${project!.organization_public_id}/activity-log`)}>View Activity Log</button>
        </div>

        <div>
          <h3>Public ID</h3>
          <p>{project?.public_id}</p>
        </div>

        <div>
          <h3>Status</h3>
          <p>{project?.is_archived ? "Archived" : "Active"}</p>
        </div>
      </div>
    </PageState>
  );
}