import { useEffect, useState } from "react";

import type {
  CreateTaskRequest,
  Task,
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
  loading,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("todo");

  const [priority, setPriority] =
    useState("medium");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(
        initialData.description ?? ""
      );
      setStatus(initialData.status);
      setPriority(initialData.priority);
    }
  }, [initialData]);

  async function handleSubmit(
    e: React.FormEvent
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
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option value="todo">Todo</option>
        <option value="in_progress">
          In Progress
        </option>
        <option value="done">Done</option>
      </select>

      <br />
      <br />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="low">Low</option>
        <option value="medium">
          Medium
        </option>
        <option value="high">High</option>
      </select>

      <br />
      <br />

      <button
        type="submit"
        disabled={loading}
      >
        {initialData ? "Update" : "Create"}
      </button>
    </form>
  );
}