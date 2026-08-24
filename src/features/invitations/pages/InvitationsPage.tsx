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

function inviteStatus(invitation: Invitation) {
  if (invitation.accepted) {
    return "Accepted";
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return "Expired";
  }

  return "Pending";
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

  function copyInviteLink(invitation: Invitation) {
    const link = `${window.location.origin}/invitations/accept/${invitation.token}`;

    navigator.clipboard.writeText(link);

    setCopiedId(invitation.public_id);

    setTimeout(() => setCopiedId(null), 2000);
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
        </header>

        {/* INVITATION FORM */}
        <section>
          <InvitationForm
            loading={createInvitation.isPending}
            onSubmit={async (formData) => {
              await createInvitation.mutateAsync({
                organizationId: organizationId!,
                data: formData,
              });

              refetch();
            }}
          />
        </section>

        {/* PENDING / SENT INVITATIONS */}
        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>Sent invitations</h2>
              <p>
                There's no email delivery yet, so copy the link and share
                it directly with the person you're inviting.
              </p>
            </div>
          </div>

          <PageState
            loading={isLoading}
            error={isError ? error : undefined}
            empty={!isLoading && !isError && (data?.length ?? 0) === 0}
            loadingMessage="Loading invitations..."
            emptyMessage="No invitations sent yet."
          >
            <div style={{ display: "grid", gap: "var(--space-3)" }}>
              {data?.map((invitation) => {
                const status = inviteStatus(invitation);

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
                        }}
                      >
                        <span>{invitation.role}</span>
                        <span>•</span>
                        <span>{status}</span>
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
                          disabled={resendInvitation.isPending}
                          onClick={async () => {
                            await resendInvitation.mutateAsync(
                              invitation.public_id
                            );
                            refetch();
                          }}
                        >
                          {resendInvitation.isPending
                            ? "Resending..."
                            : "Resend"}
                        </button>
                      )}

                      <button
                        className="cybrez-button cybrez-button-danger"
                        disabled={deleteInvitation.isPending}
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Cancel the invitation for ${invitation.email}?`
                            )
                          ) {
                            await deleteInvitation.mutateAsync(
                              invitation.public_id
                            );
                            refetch();
                          }
                        }}
                      >
                        {deleteInvitation.isPending
                          ? "Cancelling..."
                          : "Cancel"}
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