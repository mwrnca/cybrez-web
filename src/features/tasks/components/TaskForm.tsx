import { useEffect, useState } from "react";

import type {
  CreateTaskRequest,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types/task";

type Props = {
  initialData?: Task;
  loading?: boolean;
  onSubmit: (
    data: CreateTaskRequest
  ) => Promise<void>;
};

export default function TaskForm({
  initialData,
  loading = false,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<TaskStatus>("todo");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");

  useEffect(() => {
    if (!initialData) {
      return;
    }

    setTitle(initialData.title);
    setDescription(
      initialData.description ?? ""
    );
    setStatus(initialData.status);
    setPriority(initialData.priority);
  }, [initialData]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await onSubmit({
      title,
      description,
      status,
      priority,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Title
          <br />
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
        </label>
      </div>

      <br />

      <div>
        <label>
          Description
          <br />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </label>
      </div>

      <br />

      <div>
        <label>
          Status
          <br />
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as TaskStatus
              )
            }
          >
            <option value="todo">Todo</option>
            <option value="in_progress">
              In Progress
            </option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>

      <br />

      <div>
        <label>
          Priority
          <br />
          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value as TaskPriority
              )
            }
          >
            <option value="low">Low</option>
            <option value="medium">
              Medium
            </option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <br />

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : initialData
            ? "Update Task"
            : "Create Task"}
      </button>
    </form>
  );
}