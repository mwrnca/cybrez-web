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
  const [logoUrl, setLogoUrl] = useState("");
  const [directoryVisible, setDirectoryVisible] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description ?? "");
      setLogoUrl(initialData.logo_url ?? "");
      setDirectoryVisible(initialData.is_directory_visible);
    } else {
      setName("");
      setDescription("");
      setLogoUrl("");
      setDirectoryVisible(false);
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit({
      name,
      description,
      logo_url: logoUrl || null,
      is_directory_visible: directoryVisible,
    });

    if (!initialData) {
      setName("");
      setDescription("");
      setLogoUrl("");
      setDirectoryVisible(false);
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
          htmlFor="organization-logo-url"
          style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600 }}
        >
          Logo URL
        </label>
        <input
          id="organization-logo-url"
          className="cybrez-input"
          type="url"
          placeholder="https://example.com/logo.png"
          value={logoUrl}
          onChange={(event) => setLogoUrl(event.target.value)}
        />
      </div>

      <label className="cybrez-organization-directory-toggle">
        <input
          type="checkbox"
          checked={directoryVisible}
          onChange={(event) => setDirectoryVisible(event.target.checked)}
        />
        <span>Show organization profile in the directory</span>
      </label>

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