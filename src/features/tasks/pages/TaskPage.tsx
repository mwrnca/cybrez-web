import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
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
  } = useTask(taskId!);

  const updateTask = useUpdateTask();
  const archiveTask = useArchiveTask();
  const unarchiveTask = useUnarchiveTask();
  const restoreTask = useRestoreTask();

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!task}
      loadingMessage="Loading task..."
      emptyMessage="Task not found."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <h1>{task?.title}</h1>

        <TaskForm
          initialData={task}
          loading={updateTask.isPending}
          onSubmit={async (data) => {
            await updateTask.mutateAsync({
              taskId: task!.public_id,
              data,
            });
          }}
        />

        <div>
          <p><strong>Status:</strong> {task?.status}</p>
          <p><strong>Priority:</strong> {task?.priority}</p>
          <p><strong>Archived:</strong> {task?.is_archived ? "Yes" : "No"}</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {!task?.is_archived ? (
            <button onClick={() => archiveTask.mutate(task!.public_id)}>Archive</button>
          ) : (
            <button onClick={() => unarchiveTask.mutate(task!.public_id)}>Unarchive</button>
          )}

          <button onClick={() => restoreTask.mutate(task!.public_id)}>Restore</button>
          <button onClick={() => navigate(`/tasks/${task!.public_id}/comments`)}>View Comments</button>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </PageState>
  );
}