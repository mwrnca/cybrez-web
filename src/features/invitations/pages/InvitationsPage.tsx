import { useParams } from "react-router-dom";
import { useState } from "react";

import PageState from "@/components/PageState";
import InvitationForm from "../components/InvitationForm";

import {
  useCreateInvitation,
  useDeleteInvitation,
  useResendInvitation,
} from "../hooks";
import { useInvitations } from "../hooks/useInvitations";

import type { Invitation } from "../types/invitation";
import {
  getInvitationActionErrorMessage,
  getInvitationsLoadErrorMessage,
} from "@/utils/errorUtils";

function inviteStatus(invitation: Invitation) {
  if (invitation.accepted) {
    return "Accepted";
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return "Expired";
  }

  return "Pending";
}

function formatRelativeTime(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString();
}

function formatExpiration(expiresAt?: string, accepted?: boolean) {
  if (accepted) return null;
  if (!expiresAt) return null;
  const expDate = new Date(expiresAt);
  if (isNaN(expDate.getTime())) return null;
  const now = new Date();
  if (expDate < now) {
    return "Expired";
  }
  const diffDays = Math.ceil(
    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return `Expires in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

export default function InvitationsPage() {
  const { organizationId } = useParams();

  const createInvitation = useCreateInvitation();
  const deleteInvitation = useDeleteInvitation();
  const resendInvitation = useResendInvitation();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useInvitations(organizationId ?? "");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  async function copyInviteLink(invitation: Invitation) {
    const link = `${window.location.origin}/invitations/accept/${invitation.token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(invitation.public_id);
      setActionSuccess("Invitation link copied to clipboard.");
      setTimeout(() => {
        setCopiedId(null);
        setActionSuccess(null);
      }, 3000);
    } catch {
      setActionError("Unable to copy link to clipboard.");
    }
  }

  return (
    <div className="cybrez-page">
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {/* HEADER */}
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">Team Growth</span>
            <h1>Invitations</h1>
            <p>Invite new members and collaborators to this organization.</p>
          </div>

          <button
            className="cybrez-button cybrez-button-primary"
            onClick={() => {
              setActionError(null);
              setActionSuccess(null);
              setShowForm((v) => !v);
            }}
          >
            {showForm ? "Close Form" : "+ Invite Member"}
          </button>
        </header>

        {actionSuccess && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--color-success-soft)",
              color: "var(--color-success)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
            }}
          >
            {actionSuccess}
          </div>
        )}

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

        {/* INVITATION FORM */}
        {showForm && (
          <section>
            <InvitationForm
              loading={createInvitation.isPending}
              onSubmit={async (formData) => {
                setActionError(null);
                setActionSuccess(null);

                try {
                  await createInvitation.mutateAsync({
                    organizationId: organizationId!,
                    data: formData,
                  });

                  setShowForm(false);
                  setActionSuccess("Invitation sent successfully.");
                  refetch();
                } catch (err) {
                  setActionError(
                    getInvitationActionErrorMessage(err, "create")
                  );
                }
              }}
            />
          </section>
        )}

        {/* PENDING / SENT INVITATIONS */}
        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>Sent invitations</h2>
              <p>
                Share the acceptance link directly with the person you are inviting.
              </p>
            </div>
          </div>

          <PageState
            loading={isLoading}
            error={isError ? error : undefined}
            empty={!isLoading && !isError && (data?.length ?? 0) === 0}
            loadingMessage="Loading invitations..."
            emptyTitle="No invitations sent yet"
            emptyMessage="Create an invitation above to add collaborators to your workspace."
            errorTitle="Unable to load invitations"
            errorMessage={getInvitationsLoadErrorMessage(error)}
            onRetry={() => refetch()}
          >
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {data?.map((invitation) => {
                const status = inviteStatus(invitation);
                const sentTime = formatRelativeTime(invitation.created_at);
                const expState = formatExpiration(
                  invitation.expires_at,
                  invitation.accepted
                );
                const isResending = resendingId === invitation.public_id;
                const isCancelling = cancellingId === invitation.public_id;

                return (
                  <div
                    key={invitation.public_id}
                    className="cybrez-card"
                    style={{
                      padding: "var(--space-4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "var(--space-3)",
                    }}
                  >
                    <div>
                      <strong>{invitation.email}</strong>

                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-2)",
                          marginTop: "4px",
                          fontSize: "var(--font-size-xs)",
                          color: "var(--color-text-muted)",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ textTransform: "capitalize" }}>
                          {invitation.role}
                        </span>
                        <span>•</span>
                        <span>{status}</span>
                        {sentTime && (
                          <>
                            <span>•</span>
                            <span>Sent {sentTime}</span>
                          </>
                        )}
                        {expState && status === "Pending" && (
                          <>
                            <span>•</span>
                            <span>{expState}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-2)",
                        flexWrap: "wrap",
                      }}
                    >
                      {status === "Pending" && (
                        <button
                          className="cybrez-button cybrez-button-secondary"
                          onClick={() => copyInviteLink(invitation)}
                        >
                          {copiedId === invitation.public_id
                            ? "Copied!"
                            : "Copy Link"}
                        </button>
                      )}

                      {status !== "Accepted" && (
                        <button
                          className="cybrez-button cybrez-button-secondary"
                          disabled={isResending || isCancelling}
                          onClick={async () => {
                            setActionError(null);
                            setActionSuccess(null);
                            setResendingId(invitation.public_id);

                            try {
                              await resendInvitation.mutateAsync(
                                invitation.public_id
                              );
                              setActionSuccess(
                                `Invitation resent to ${invitation.email}.`
                              );
                              refetch();
                            } catch (err) {
                              setActionError(
                                getInvitationActionErrorMessage(err, "resend")
                              );
                            } finally {
                              setResendingId(null);
                            }
                          }}
                        >
                          {isResending ? "Resending..." : "Resend"}
                        </button>
                      )}

                      <button
                        className="cybrez-button cybrez-button-danger"
                        disabled={isCancelling || isResending}
                        onClick={async () => {
                          if (
                            !window.confirm(
                              `Cancel the invitation for ${invitation.email}?`
                            )
                          ) {
                            return;
                          }

                          setActionError(null);
                          setActionSuccess(null);
                          setCancellingId(invitation.public_id);

                          try {
                            await deleteInvitation.mutateAsync(
                              invitation.public_id
                            );
                            setActionSuccess(
                              `Invitation for ${invitation.email} was cancelled.`
                            );
                            refetch();
                          } catch (err) {
                            setActionError(
                              getInvitationActionErrorMessage(err, "cancel")
                            );
                          } finally {
                            setCancellingId(null);
                          }
                        }}
                      >
                        {isCancelling ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </PageState>
        </section>
      </div>
    </div>
  );
}