import { useParams } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "@/contexts/useAuth";

import MembershipList from "../components/MembershipList";

import {
  useMembers,
  useRemoveMember,
  useLeaveOrganization,
} from "../hooks";

function getErrorDetail(err: unknown, fallback: string) {
  const detail =
    typeof err === "object" && err !== null && "response" in err
      ? (err as { response?: { data?: { detail?: string } } }).response
          ?.data?.detail
      : undefined;

  return detail ?? fallback;
}

export default function MembershipsPage() {
  const { organizationId } = useParams();
  const { user } = useAuth();

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

  const [actionError, setActionError] = useState<string | null>(null);

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

  const myMembership = data?.find(
    (member) => member.user_id === user?.public_id
  );
  const isOwner = myMembership?.role === "owner";

  async function handleRemove(
    userId: string
  ) {
    const confirmed = window.confirm(
      "Remove this member from the organization?"
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);

    try {
      await removeMember.mutateAsync({
        organizationId: organizationId!,
        userId,
      });
    } catch (err) {
      setActionError(
        getErrorDetail(
          err,
          "You don't have permission to remove this member. Only the organization owner can do that."
        )
      );
    }
  }

  async function handleLeave() {
    const confirmed = window.confirm(
      "Are you sure you want to leave this organization?"
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);

    try {
      await leaveOrganization.mutateAsync(
        organizationId!
      );
    } catch (err) {
      setActionError(
        getErrorDetail(
          err,
          "Unable to leave the organization."
        )
      );
    }
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

        {actionError && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--color-danger-soft)",
              color: "var(--color-danger)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
            }}
          >
            {actionError}
          </div>
        )}

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
            canRemove={isOwner}
          />
        </section>

        {/* LEAVE ORGANIZATION */}

        {!isOwner && (
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
        )}
      </div>
    </div>
  );
}