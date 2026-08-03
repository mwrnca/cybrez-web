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
  loading,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(
        initialData.description ?? ""
      );
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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Project name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
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

      <button
        type="submit"
        disabled={loading}
      >
        {initialData
          ? "Update"
          : "Create"}
      </button>
    </form>
  );
}