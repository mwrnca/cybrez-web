import { useEffect, useState } from "react";

import type {
  CreateProjectRequest,
  Project,
} from "@/types/project";

type Props = {
  initialData?: Project;
  loading?: boolean;
  onSubmit: (
    data: CreateProjectRequest
  ) => Promise<void>;
};

export default function ProjectForm({
  initialData,
  loading = false,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description ?? "");
    }
  }, [initialData]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await onSubmit({
      name,
      description,
    });

    if (!initialData) {
      setName("");
      setDescription("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="cybrez-project-form"
    >
      <div className="cybrez-form-fields">
        <div className="cybrez-form-field">
          <span>Project Name</span>

          <input
            className="cybrez-input"
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="cybrez-form-field">
          <span>Description</span>

          <textarea
            className="cybrez-textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
        </div>
      </div>

      <div className="cybrez-form-actions">
        <button
          type="submit"
          className="cybrez-button cybrez-button-primary"
          disabled={loading || !name.trim()}
        >
          {loading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update"
              : "Create"}
        </button>
      </div>
    </form>
  );
}