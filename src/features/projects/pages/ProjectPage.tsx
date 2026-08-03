import { useParams } from "react-router-dom";

import { useProject } from "../hooks";

export default function ProjectPage() {
  const { id } = useParams();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProject(id!);

  if (isLoading) {
    return <h2>Loading project...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  if (!project) {
    return <h2>Project not found.</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{project.name}</h1>

      <p>{project.description}</p>

      <hr />

      <h3>Public ID</h3>

      <p>{project.public_id}</p>

      <hr />

      <h3>Status</h3>

      <p>
        {project.is_archived
          ? "Archived"
          : "Active"}
      </p>

      <hr />

      <h3>Next Features</h3>

      <ul>
        <li>Tasks</li>
        <li>Members</li>
        <li>Activity Log</li>
      </ul>
    </div>
  );
}