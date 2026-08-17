import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  Organization,
  CreateOrganizationRequest,
} from "@/types/organization";

import OrganizationForm from "../components/OrganizationForm";

import {
  useOrganizations,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
} from "../hooks";

export default function OrganizationsPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useOrganizations();

  const createOrganization =
    useCreateOrganization();

  const updateOrganization =
    useUpdateOrganization();

  const deleteOrganization =
    useDeleteOrganization();

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingOrganization, setEditingOrganization] =
    useState<Organization | undefined>();

  if (isLoading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Unable to load organizations</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }

  function handleEdit(
    organization: Organization
  ) {
    setEditingId(organization.public_id);
    setEditingOrganization(organization);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingOrganization(undefined);
  }

  async function handleDelete(
    organization: Organization
  ) {
    const confirmed = window.confirm(
      `Delete "${organization.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    await deleteOrganization.mutateAsync(
      organization.public_id
    );
  }

  async function handleSubmit(
    formData: CreateOrganizationRequest
  ) {
    if (editingId) {
      await updateOrganization.mutateAsync({
        id: editingId,
        data: formData,
      });

      cancelEdit();
      return;
    }

    await createOrganization.mutateAsync(
      formData
    );
  }

  const isSaving =
    createOrganization.isPending ||
    updateOrganization.isPending;

  return (
    <div className="cybrez-page">
      <div className="cybrez-organizations-page">

        {/* PAGE HEADER */}

        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              Workspace management
            </span>

            <h1>Organizations</h1>

            <p>
              Create and manage the organizations
              connected to your account.
            </p>
          </div>

          <div className="cybrez-page-header-stat">
            <span>Total organizations</span>

            <strong>
              {data?.length ?? 0}
            </strong>
          </div>
        </header>

        {/* CREATE / EDIT FORM */}

        <section>
          <OrganizationForm
            initialData={editingOrganization}
            loading={isSaving}
            onSubmit={handleSubmit}
          />

          {editingOrganization && (
            <div
              style={{
                marginTop: "0.75rem",
              }}
            >
              <button
                type="button"
                className="cybrez-button cybrez-button-ghost"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Cancel editing
              </button>
            </div>
          )}
        </section>

        {/* ORGANIZATION LIST */}

        <section className="cybrez-organizations-section">
          <div className="cybrez-section-header">
            <div>
              <h2>Your organizations</h2>

              <p>
                Select an organization to manage
                its projects, members, and
                activity.
              </p>
            </div>
          </div>

          {data && data.length > 0 ? (
            <div className="cybrez-organizations-grid">
              {data.map((organization) => (
                <article
                  key={organization.public_id}
                  className="cybrez-organization-card cybrez-card"
                >
                  <div className="cybrez-organization-card-header">
                    <div className="cybrez-organization-card-icon">
                      {organization.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3>
                        {organization.name}
                      </h3>

                      <span className="cybrez-badge">
                        Organization
                      </span>
                    </div>
                  </div>

                  <p className="cybrez-organization-card-description">
                    {organization.description ||
                      "No description provided."}
                  </p>

                  <div className="cybrez-organization-card-id">
                    <span>Public ID</span>

                    <code>
                      {organization.public_id}
                    </code>
                  </div>

                  <div className="cybrez-organization-card-actions">
                    <button
                      className="cybrez-button cybrez-button-primary"
                      onClick={() =>
                        navigate(
                          `/organizations/${organization.public_id}`
                        )
                      }
                    >
                      Open
                    </button>

                    <button
                      className="cybrez-button cybrez-button-secondary"
                      onClick={() =>
                        handleEdit(organization)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="cybrez-button cybrez-button-danger"
                      onClick={() =>
                        handleDelete(organization)
                      }
                      disabled={
                        deleteOrganization.isPending
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="cybrez-empty-state cybrez-card">
              <div className="cybrez-empty-state-icon">
                O
              </div>

              <h3>No organizations yet</h3>

              <p>
                Create your first organization
                using the form above.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}