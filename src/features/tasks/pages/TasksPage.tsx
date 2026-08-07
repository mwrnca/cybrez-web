import { useNavigate, useParams } from "react-router-dom";
import TaskCard from "../components/TaskCard";
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
  <TaskCard
    key={task.public_id}
    task={task}
    onDelete={(id) =>
      deleteTask.mutate({
        projectId: projectId!,
        taskId: id,
      })
    }
  />
))}
    </div>
  );
}