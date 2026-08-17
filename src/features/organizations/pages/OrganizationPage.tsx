import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import PageState from "@/components/PageState";
import { useOrganization } from "@/hooks/useOrganization";

import { getOrganization } from "../api/organizationsApi";

export default function OrganizationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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

            <p>
              {organization?.description ||
                "No description provided."}
            </p>
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
          <div>
            <span className="cybrez-info-label">
              Organization ID
            </span>

            <code className="cybrez-info-value">
              {organization?.public_id}
            </code>
          </div>

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