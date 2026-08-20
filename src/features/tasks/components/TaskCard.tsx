import { useNavigate } from "react-router-dom";

import type { Task } from "../types/task";

import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

type Props = {
  task: Task;
  onDelete: (taskId: string) => void;
};

export default function TaskCard({
  task,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  const statusColor =
    task.status === "done"
      ? "var(--color-success)"
      : task.status === "in_progress"
        ? "var(--color-primary)"
        : "var(--color-text-muted)";

  return (
    <article className="cybrez-organization-card cybrez-card">
      <div className="cybrez-organization-card-header">
        <div
          className="cybrez-organization-card-icon"
          style={{ fontSize: "var(--font-size-md)" }}
        >
          ✓
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {task.title}
          </h3>

          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)", flexWrap: "wrap" }}>
            <span
              className="cybrez-badge"
              style={{ borderColor: statusColor, color: statusColor }}
            >
              {task.status.replace("_", " ")}
            </span>

            <span className="cybrez-badge">
              Priority: {task.priority}
            </span>

            {task.is_archived && (
              <span className="cybrez-badge" style={{ color: "var(--color-warning)", borderColor: "var(--color-warning)" }}>
                Archived
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="cybrez-organization-card-description">
        {task.description || "No description provided."}
      </p>

      <div className="cybrez-organization-card-id">
        <span>Task Public ID</span>
        <code>{task.public_id}</code>
      </div>

      <div className="cybrez-organization-card-actions">
        <button
          className="cybrez-button cybrez-button-primary"
          onClick={() => navigate(`/tasks/${task.public_id}`)}
        >
          View Details
        </button>

        <button
          className="cybrez-button cybrez-button-secondary"
          onClick={() => navigate(`/tasks/${task.public_id}/comments`)}
        >
          Comments
        </button>

        <PermissionGate minimumRole={PERMISSIONS.deleteTasks}>
          <button
            className="cybrez-button cybrez-button-danger"
            onClick={() => onDelete(task.public_id)}
          >
            Delete
          </button>
        </PermissionGate>
      </div>
    </article>
  );
}