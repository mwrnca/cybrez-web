import { useParams } from "react-router-dom";

import MembershipList from "../components/MembershipList";

import {
  useMembers,
  useRemoveMember,
  useLeaveOrganization,
} from "../hooks";

export default function MembershipsPage() {
  const { organizationId } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useMembers(organizationId!);

  const removeMember =
    useRemoveMember();

  const leaveOrganization =
    useLeaveOrganization();

  if (isLoading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Unable to load members</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }

  async function handleRemove(
    userId: string
  ) {
    const confirmed = window.confirm(
      "Remove this member from the organization?"
    );

    if (!confirmed) {
      return;
    }

    await removeMember.mutateAsync({
      organizationId: organizationId!,
      userId,
    });
  }

  async function handleLeave() {
    const confirmed = window.confirm(
      "Are you sure you want to leave this organization?"
    );

    if (!confirmed) {
      return;
    }

    await leaveOrganization.mutateAsync(
      organizationId!
    );
  }

  return (
    <div className="cybrez-page">
      <div className="cybrez-members-page">

        {/* HEADER */}

        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              Organization
            </span>

            <h1>Members</h1>

            <p>
              Manage the people who belong to
              this organization.
            </p>
          </div>

          <div className="cybrez-page-header-stat">
            <span>Total members</span>

            <strong>
              {data?.length ?? 0}
            </strong>
          </div>
        </header>

        {/* MEMBER LIST */}

        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>Organization members</h2>

              <p>
                Members and their assigned
                organization roles.
              </p>
            </div>
          </div>

          <MembershipList
            members={data ?? []}
            onRemove={handleRemove}
            removing={
              removeMember.isPending
            }
          />
        </section>

        {/* LEAVE ORGANIZATION */}

        <section className="cybrez-members-danger-zone cybrez-card">
          <div>
            <h2>Leave organization</h2>

            <p>
              Remove yourself from this
              organization.
            </p>
          </div>

          <button
            className="cybrez-button cybrez-button-danger"
            onClick={handleLeave}
            disabled={
              leaveOrganization.isPending
            }
          >
            {leaveOrganization.isPending
              ? "Leaving..."
              : "Leave Organization"}
          </button>
        </section>
      </div>
    </div>
  );
}