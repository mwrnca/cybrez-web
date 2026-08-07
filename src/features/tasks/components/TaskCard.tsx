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

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h3>{task.title}</h3>

      <p>{task.description ?? "No description."}</p>

      <p>
        <strong>Status:</strong> {task.status}
      </p>

      <p>
        <strong>Priority:</strong> {task.priority}
      </p>

      <p>
        <strong>Archived:</strong>{" "}
        {task.is_archived ? "Yes" : "No"}
      </p>

      <small>{task.public_id}</small>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={() =>
            navigate(`/tasks/${task.public_id}`)
          }
        >
          View
        </button>

        <PermissionGate minimumRole={PERMISSIONS.deleteTasks}>
          <button
            onClick={() =>
              onDelete(task.public_id)
            }
          >
            Delete
          </button>
        </PermissionGate>
      </div>
    </div>
  );
}