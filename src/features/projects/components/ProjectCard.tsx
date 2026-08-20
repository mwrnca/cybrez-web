import { useNavigate } from "react-router-dom";

import type { Project } from "@/types/project";

import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

type Props = {
  project: Project;
  onDelete: (projectId: string) => void;
};

export default function ProjectCard({
  project,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  return (
    <article className="cybrez-project-card">
      <div className="cybrez-project-card-header">
        <div>
          <h3>{project.name}</h3>

          <span
            className={
              project.is_archived
                ? "cybrez-project-status-badge cybrez-project-status-badge-archived"
                : "cybrez-project-status-badge cybrez-project-status-badge-active"
            }
          >
            {project.is_archived ? "Archived" : "Active"}
          </span>
        </div>
      </div>

      <p className="cybrez-project-card-description">
        {project.description ?? "No description."}
      </p>

      <div className="cybrez-project-card-id">
        <span>Project ID</span>

        <code>{project.public_id}</code>
      </div>

      <div className="cybrez-project-card-actions">
        <button
          type="button"
          className="cybrez-button cybrez-button-primary"
          onClick={() =>
            navigate(`/projects/${project.public_id}`)
          }
        >
          View
        </button>

        <PermissionGate
          minimumRole={PERMISSIONS.deleteProjects}
        >
          <button
            type="button"
            className="cybrez-button cybrez-button-danger"
            onClick={() =>
              onDelete(project.public_id)
            }
          >
            Delete
          </button>
        </PermissionGate>
      </div>
    </article>
  );
}