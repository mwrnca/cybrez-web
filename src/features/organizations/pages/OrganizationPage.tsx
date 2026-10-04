import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import PageState from "@/components/PageState";
import { useOrganization } from "@/hooks/useOrganization";

import { getOrganization } from "../api/organizationsApi";
import { updateOrganization } from "../api/organizationsApi";
import OrganizationForm from "../components/OrganizationForm";
import { useAuth } from "@/contexts/useAuth";
import type { UpdateOrganizationRequest } from "@/types/organization";

export default function OrganizationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);

  const { setOrganization } = useOrganization();

  const {
    data: organization,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrganizationRequest) =>
      updateOrganization(id!, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organization", id] });
      setEditingProfile(false);
    },
  });

  const isOwner = organization?.owner_id === user?.public_id;

  useEffect(() => {
    if (organization) {
      setOrganization({
        public_id: organization.public_id,
        name: organization.name,
      });
    }
  }, [organization, setOrganization]);

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!organization}
      loadingMessage="Loading organization..."
      emptyMessage="Organization not found."
    >
      <div className="cybrez-organization-page">
        {/* HEADER */}

        <header className="cybrez-organization-header">
          <div>
            <span className="cybrez-badge">
              Organization
            </span>

            <h1>
              {organization?.name}
            </h1>

            {/* <p>
              {organization?.description ||
                "No description provided."}
            </p> */}
          </div>

          <button
            className="cybrez-button cybrez-button-secondary"
            onClick={() =>
              navigate("/organizations")
            }
          >
            Back to Organizations
          </button>
        </header>

        {/* ORGANIZATION INFORMATION */}

        <section className="cybrez-organization-info cybrez-card">
          {/* <div>
            <span className="cybrez-info-label">
              Organization ID
            </span>

            <code className="cybrez-info-value">
              {organization?.public_id}
            </code>
          </div> */}

          <div>
            <span className="cybrez-info-label">
              Description
            </span>

            <p className="cybrez-info-value">
              {organization?.description ||
                "No description provided."}
            </p>
          </div>
        </section>

        {isOwner && (
          <section className="cybrez-organization-profile-settings">
            <div className="cybrez-section-header">
              <div>
                <h2>Public appearance</h2>
                <p>{organization?.is_directory_visible ? "Listed in the organization directory." : "Hidden from the organization directory."}</p>
              </div>
              <button
                type="button"
                className="cybrez-button cybrez-button-secondary"
                onClick={() => setEditingProfile((current) => !current)}
              >
                {editingProfile ? "Close" : "Edit profile"}
              </button>
            </div>
            {editingProfile && organization && (
              <OrganizationForm
                initialData={organization}
                loading={updateMutation.isPending}
                onSubmit={async (data) => {
                  await updateMutation.mutateAsync(data);
                }}
              />
            )}
            {updateMutation.isError && (
              <p className="cybrez-service-error" role="alert">
                Unable to update organization profile.
              </p>
            )}
          </section>
        )}

        {/* ORGANIZATION MANAGEMENT */}

        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>Manage organization</h2>

              <p>
                Manage the resources and people
                connected to this organization.
              </p>
            </div>
          </div>

          <div className="cybrez-organization-actions">
            <button
              className="cybrez-organization-action cybrez-card"
              onClick={() =>
                navigate(
                  `/organizations/${organization!.public_id}/projects`
                )
              }
            >
              <span className="cybrez-action-icon">
                P
              </span>

              <div>
                <h3>Projects</h3>

                <p>
                  View and manage organization
                  projects.
                </p>
              </div>
            </button>

            <button
              className="cybrez-organization-action cybrez-card"
              onClick={() =>
                navigate(
                  `/organizations/${organization!.public_id}/members`
                )
              }
            >
              <span className="cybrez-action-icon">
                M
              </span>

              <div>
                <h3>Members</h3>

                <p>
                  Manage organization members
                  and roles.
                </p>
              </div>
            </button>

            <button
              className="cybrez-organization-action cybrez-card"
              onClick={() =>
                navigate(
                  `/organizations/${organization!.public_id}/units`
                )
              }
            >
              <span className="cybrez-action-icon">U</span>
              <div>
                <h3>Organization units</h3>
                <p>Manage the organization structure and unit members.</p>
              </div>
            </button>

            <button
              className="cybrez-organization-action cybrez-card"
              onClick={() =>
                navigate(
                  `/organizations/${organization!.public_id}/invitations`
                )
              }
            >
              <span className="cybrez-action-icon">
                I
              </span>

              <div>
                <h3>Invitations</h3>

                <p>
                  Invite people to join the
                  organization.
                </p>
              </div>
            </button>

            <button
              className="cybrez-organization-action cybrez-card"
              onClick={() =>
                navigate(
                  `/organizations/${organization!.public_id}/activity-log`
                )
              }
            >
              <span className="cybrez-action-icon">
                A
              </span>

              <div>
                <h3>Activity Log</h3>

                <p>
                  Review activity within the
                  organization.
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </PageState>
  );
}