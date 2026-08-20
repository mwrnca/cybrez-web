import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import {
  useTasks,
  useCreateTask,
  useDeleteTask,
} from "../hooks";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

export default function TasksPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, error } =
    useTasks(projectId!);

  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  if (isLoading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>Loading project tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Unable to load tasks</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cybrez-page">
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {/* PAGE HEADER */}
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">Task Management</span>
            <h1>Project Tasks</h1>
            <p>Track, manage, and deliver work items for this project.</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
            <PermissionGate minimumRole={PERMISSIONS.manageTasks}>
              <button
                className="cybrez-button cybrez-button-primary"
                onClick={() => setShowCreate(!showCreate)}
              >
                {showCreate ? "Close Form" : "+ Create Task"}
              </button>
            </PermissionGate>

            <div className="cybrez-page-header-stat">
              <span>Total tasks</span>
              <strong>{data?.length ?? 0}</strong>
            </div>
          </div>
        </header>

        {/* CREATE TASK SECTION */}
        {showCreate && (
          <section>
            <TaskForm
              loading={createTask.isPending}
              onSubmit={async (formData) => {
                const task = await createTask.mutateAsync({
                  projectId: projectId!,
                  data: formData,
                });
                setShowCreate(false);
                navigate(`/tasks/${task.public_id}`);
              }}
            />
          </section>
        )}

        {/* TASKS LIST */}
        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>Tasks ({data?.length ?? 0})</h2>
              <p>Active and completed tasks for this project.</p>
            </div>
          </div>

          {data && data.length > 0 ? (
            <div className="cybrez-organizations-grid">
              {data.map((task) => (
                <TaskCard
                  key={task.public_id}
                  task={task}
                  onDelete={(id) => {
                    if (window.confirm("Are you sure you want to delete this task?")) {
                      deleteTask.mutate({
                        projectId: projectId!,
                        taskId: id,
                      });
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="cybrez-empty-state cybrez-card">
              <div className="cybrez-empty-state-icon">✓</div>
              <h3>No tasks found</h3>
              <p>Get started by creating your first task for this project.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}