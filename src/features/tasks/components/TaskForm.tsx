import { useEffect, useState } from "react";

import type {
  CreateTaskRequest,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types/task";

type TaskOrganizationUnit = {
  public_id: string;
  name: string;
};

type Props = {
  initialData?: Task;
  organizationUnits?: TaskOrganizationUnit[];
  loading?: boolean;
  onSubmit: (
    data: CreateTaskRequest
  ) => Promise<void>;
};

export default function TaskForm({
  initialData,
  organizationUnits = [],
  loading = false,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<TaskStatus>("todo");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [organizationUnitId, setOrganizationUnitId] =
    useState<string>("");

  useEffect(() => {
    if (!initialData) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setOrganizationUnitId("");
      return;
    }

    setTitle(initialData.title);
    setDescription(initialData.description ?? "");
    setStatus(initialData.status);
    setPriority(initialData.priority);
    setOrganizationUnitId(
      initialData.organization_unit_id ?? ""
    );
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
      organization_unit_id:
        organizationUnitId || null,
    });

    if (!initialData) {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setOrganizationUnitId("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="cybrez-organization-form cybrez-card"
    >
      <div className="cybrez-form-header">
        <span className="cybrez-badge">
          {initialData
            ? "Task Configuration"
            : "New Task"}
        </span>

        <h2>
          {initialData
            ? "Edit Task"
            : "Create New Task"}
        </h2>

        <p>
          Define the task, its workflow state, priority,
          and organizational context.
        </p>
      </div>

      <div className="cybrez-form-fields">
        <div className="cybrez-form-field">
          <span>Task Title</span>

          <input
            type="text"
            className="cybrez-input"
            placeholder="e.g. Implement API rate limiting"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />
        </div>

        <div className="cybrez-form-field">
          <span>Description</span>

          <textarea
            className="cybrez-textarea"
            placeholder="Provide task details and acceptance criteria..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={4}
          />
        </div>

        <div className="cybrez-form-field">
          <span>Organization Unit</span>

          <select
            className="cybrez-select"
            value={organizationUnitId}
            onChange={(e) =>
              setOrganizationUnitId(e.target.value)
            }
          >
            <option value="">
              No organizational unit
            </option>

            {organizationUnits.map((unit) => (
              <option
                key={unit.public_id}
                value={unit.public_id}
              >
                {unit.name}
              </option>
            ))}
          </select>

          {organizationUnits.length === 0 && (
            <small>
              No organization units have been configured
              for this organization.
            </small>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--space-4)",
          }}
        >
          <div className="cybrez-form-field">
            <span>Status</span>

            <select
              className="cybrez-select"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as TaskStatus
                )
              }
            >
              <option value="todo">
                To Do
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="review">
                Review
              </option>

              <option value="done">
                Done
              </option>

              <option value="blocked">
                Blocked
              </option>
            </select>
          </div>

          <div className="cybrez-form-field">
            <span>Priority</span>

            <select
              className="cybrez-select"
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as TaskPriority
                )
              }
            >
              <option value="low">
                Low Priority
              </option>

              <option value="medium">
                Medium Priority
              </option>

              <option value="high">
                High Priority
              </option>

              <option value="urgent">
                Urgent
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="cybrez-form-actions">
        <button
          type="submit"
          className="cybrez-button cybrez-button-primary"
          disabled={loading || !title.trim()}
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Task"
              : "Create Task"}
        </button>
      </div>
    </form>
  );
}
