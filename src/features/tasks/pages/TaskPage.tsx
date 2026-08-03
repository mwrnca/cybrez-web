import { useNavigate, useParams } from "react-router-dom";

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

  if (isLoading) {
    return <h2>Loading task...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  if (!task) {
    return <h2>Task not found.</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{task.title}</h1>

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

      <hr />

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

      <br />

      {!task.is_archived ? (
        <button
          onClick={() =>
            archiveTask.mutate(task.public_id)
          }
        >
          Archive
        </button>
      ) : (
        <button
          onClick={() =>
            unarchiveTask.mutate(task.public_id)
          }
        >
          Unarchive
        </button>
      )}

      <button
        style={{ marginLeft: "8px" }}
        onClick={() =>
          restoreTask.mutate(task.public_id)
        }
      >
        Restore
      </button>

      <button
        style={{ marginLeft: "8px" }}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
}