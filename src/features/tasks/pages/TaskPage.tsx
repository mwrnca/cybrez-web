import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

import {
  useTask,
  useUpdateTask,
  useArchiveTask,
  useUnarchiveTask,
  useRestoreTask,
} from "../hooks";

import TaskForm from "../components/TaskForm";

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useTask(taskId ?? "");

  const updateTask = useUpdateTask();
  const archiveTask = useArchiveTask();
  const unarchiveTask = useUnarchiveTask();
  const restoreTask = useRestoreTask();

  const statusColor =
    task?.status === "done"
      ? "var(--color-success)"
      : task?.status === "in_progress"
        ? "var(--color-primary)"
        : "var(--color-text-muted)";

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!task}
      loadingMessage="Loading task..."
      emptyMessage="Task not found."
    >
      {task && (
        <div className="cybrez-page">
          <div style={{ display: "grid", gap: "var(--space-6)" }}>
            {/* HEADER */}
            <header className="cybrez-page-header">
              <div>
                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-2)" }}>
                  <span className="cybrez-badge" style={{ borderColor: statusColor, color: statusColor }}>
                    {task.status.replace("_", " ")}
                  </span>
                  <span className="cybrez-badge">
                    {task.priority} priority
                  </span>
                  {task.is_archived && (
                    <span className="cybrez-badge" style={{ color: "var(--color-warning)", borderColor: "var(--color-warning)" }}>
                      Archived
                    </span>
                  )}
                </div>

                <h1>{task.title}</h1>
                <p>{task.description || "No description provided."}</p>
              </div>

              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                <button
                  className="cybrez-button cybrez-button-secondary"
                  onClick={() => navigate(`/tasks/${task.public_id}/comments`)}
                >
                  💬 View Comments
                </button>

                <button
                  className="cybrez-button cybrez-button-ghost"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>
            </header>

            {/* TASK DETAILS INFO */}
            <section className="cybrez-organization-info cybrez-card">
              <div>
                <span className="cybrez-info-label">Task Public ID</span>
                <code className="cybrez-info-value">{task.public_id}</code>
              </div>

              <div>
                <span className="cybrez-info-label">Status & Priority</span>
                <p className="cybrez-info-value" style={{ textTransform: "capitalize" }}>
                  {task.status.replace("_", " ")} • {task.priority} Priority
                </p>
              </div>
            </section>

            {/* EDIT TASK FORM */}
            <section>
              <TaskForm
                initialData={task}
                loading={updateTask.isPending}
                onSubmit={async (data) => {
                  await updateTask.mutateAsync({
                    taskId: task.public_id,
                    data,
                  });
                }}
              />
            </section>

            {/* ACTIONS BAR */}
            <section className="cybrez-card" style={{ padding: "var(--space-5)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-4)" }}>
              <div>
                <h3 style={{ fontSize: "var(--font-size-md)", margin: 0 }}>Task Actions</h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-xs)", margin: "4px 0 0" }}>
                  Archive, restore, or manage lifecycle state.
                </p>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <PermissionGate minimumRole={PERMISSIONS.manageTasks}>
                  {!task.is_archived ? (
                    <button
                      className="cybrez-button cybrez-button-secondary"
                      disabled={archiveTask.isPending}
                      onClick={() => archiveTask.mutate(task.public_id)}
                    >
                      {archiveTask.isPending ? "Archiving..." : "Archive Task"}
                    </button>
                  ) : (
                    <button
                      className="cybrez-button cybrez-button-secondary"
                      disabled={unarchiveTask.isPending}
                      onClick={() => unarchiveTask.mutate(task.public_id)}
                    >
                      {unarchiveTask.isPending ? "Unarchiving..." : "Unarchive Task"}
                    </button>
                  )}
                </PermissionGate>

                <PermissionGate minimumRole={PERMISSIONS.manageTasks}>
                  <button
                    className="cybrez-button cybrez-button-secondary"
                    disabled={restoreTask.isPending}
                    onClick={() => restoreTask.mutate(task.public_id)}
                  >
                    {restoreTask.isPending ? "Restoring..." : "Restore Task"}
                  </button>
                </PermissionGate>
              </div>
            </section>
          </div>
        </div>
      )}
    </PageState>
  );
}