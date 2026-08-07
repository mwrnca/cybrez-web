import { useNavigate, useParams } from "react-router-dom";

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

  const { data, isLoading, isError, error } =
    useTasks(projectId!);

  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  if (isLoading) {
    return <h2>Loading tasks...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tasks</h1>

    <PermissionGate minimumRole={PERMISSIONS.manageTasks}>
      <button
        onClick={async () => {
          const task =
            await createTask.mutateAsync({
              projectId: projectId!,
              data: {
                title: "New Task",
                description: "",
                status: "todo",
                priority: "medium",
              },
            });

          navigate(`/tasks/${task.public_id}`);
        }}
      >
        Create Task
      </button>
    </PermissionGate>
      

      <hr />

      <h2>Total: {data?.length ?? 0}</h2>

      {data?.map((task) => (
        <div
          key={task.public_id}
          style={{
            border: "1px solid gray",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>Status: {task.status}</p>

          <p>Priority: {task.priority}</p>

          <small>{task.public_id}</small>

          <br />
          <br />

          <button
            onClick={() =>
              navigate(`/tasks/${task.public_id}`)
            }
          >
            View
          </button>

      <PermissionGate minimumRole={PERMISSIONS.deleteTasks}>
        <button
            style={{ marginLeft: "8px" }}
            onClick={() =>
              deleteTask.mutate({
                projectId: projectId!,
                taskId: task.public_id,
              })
            }
          >
            Delete
          </button>
      </PermissionGate>
          
        </div>
      ))}
    </div>
  );
}