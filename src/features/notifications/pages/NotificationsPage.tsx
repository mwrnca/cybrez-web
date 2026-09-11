import { useState } from "react";
import PageState from "@/components/PageState";
import { NotificationsList } from "../components";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks";
import { useAcceptInvitation } from "@/features/invitations/hooks";
import { getInvitationLink } from "@/features/invitations/api/invitationsApi";
import {
  formatUserFacingError,
  getNotificationErrorMessage,
} from "@/utils/errorUtils";

export default function NotificationsPage() {
  const { data, isLoading, isError, error, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const acceptInvitation = useAcceptInvitation();

  const [acceptedTokens, setAcceptedTokens] = useState<string[]>([]);
  const [acceptingInvitationId, setAcceptingInvitationId] = useState<string>();
  const [acceptError, setAcceptError] = useState<string | null>(null);

  async function handleAcceptInvitation(
    invitationId: string,
    notificationId: string
  ) {
    setAcceptError(null);
    setAcceptingInvitationId(invitationId);

    try {
      const { acceptance_url } = await getInvitationLink(invitationId);
      const token = new URL(acceptance_url).pathname.split("/").pop();
      if (!token) {
        throw new Error("Invitation link is invalid.");
      }
      await acceptInvitation.mutateAsync(token);
      setAcceptedTokens((prev) => [...prev, invitationId]);
      markRead.mutate(notificationId);
    } catch (err) {
      setAcceptError(
        formatUserFacingError(err, "Failed to accept the invitation.")
      );
    } finally {
      setAcceptingInvitationId(undefined);
    }
  }

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!data || data.length === 0}
      loadingMessage="Loading notifications..."
      emptyTitle="You’re all caught up."
      emptyMessage="No new notifications right now."
      errorTitle="Unable to load notifications."
      errorMessage={getNotificationErrorMessage(error)}
      onRetry={() => refetch()}
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h1>Notifications</h1>
            <p style={{ color: "#6b7280", marginTop: "0.35rem" }}>Stay on top of important updates.</p>
          </div>
          <button onClick={() => markAllRead.mutate()}>Mark all as read</button>
        </div>

        {acceptError && (
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
            {acceptError}
          </div>
        )}

        <NotificationsList
          notifications={data ?? []}
          onRead={(id) => markRead.mutate(id)}
          onDelete={(id) => deleteNotification.mutate(id)}
          onAcceptInvitation={handleAcceptInvitation}
          acceptingToken={acceptingInvitationId}
          acceptedTokens={acceptedTokens}
        />
      </div>
    </PageState>
  );
}