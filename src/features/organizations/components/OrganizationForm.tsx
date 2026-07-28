import { useEffect, useState } from "react";

import type {
  CreateOrganizationRequest,
  Organization,
} from "@/types/organization";

type Props = {
  initialData?: Organization;
  loading?: boolean;
  onSubmit: (
    data: CreateOrganizationRequest
  ) => Promise<void>;
};

export default function OrganizationForm({
  initialData,
  loading,
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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Organization name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        {initialData ? "Update" : "Create"}
      </button>
    </form>
  );
}