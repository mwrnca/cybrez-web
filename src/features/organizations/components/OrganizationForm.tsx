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

  async function handleSubmit(e: React.FormEvent) {
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
      className="cybrez-card"
      style={{
        padding: "1.5rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div>
        <h2>
          {initialData
            ? "Edit Organization"
            : "Create Organization"}
        </h2>

        <p
          className="cybrez-muted"
          style={{ marginTop: "0.35rem" }}
        >
          {initialData
            ? "Update your organization details."
            : "Create a workspace for your team."}
        </p>
      </div>

      <div>
        <label
          htmlFor="organization-name"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontWeight: 600,
          }}
        >
          Name
        </label>

        <input
          id="organization-name"
          className="cybrez-input"
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label
          htmlFor="organization-description"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontWeight: 600,
          }}
        >
          Description
        </label>

        <textarea
          id="organization-description"
          className="cybrez-textarea"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      <div>
        <button
          type="submit"
          className="cybrez-button cybrez-button-primary"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Organization"
              : "Create Organization"}
        </button>
      </div>
    </form>
  );
}