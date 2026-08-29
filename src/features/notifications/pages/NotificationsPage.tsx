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

export default function NotificationsPage() {
  const { data, isLoading, isError, error } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const acceptInvitation = useAcceptInvitation();

  const [acceptedTokens, setAcceptedTokens] = useState<string[]>([]);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  async function handleAcceptInvitation(
    token: string,
    notificationId: string
  ) {
    setAcceptError(null);

    try {
      await acceptInvitation.mutateAsync(token);
      setAcceptedTokens((prev) => [...prev, token]);
      markRead.mutate(notificationId);
    } catch (err) {
      const detail =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { detail?: string } } })
              .response?.data?.detail
          : undefined;

      setAcceptError(detail ?? "Failed to accept the invitation.");
    }
  }

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!data || data.length === 0}
      loadingMessage="Loading notifications..."
      emptyMessage="No notifications yet."
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
          acceptingToken={
            acceptInvitation.isPending
              ? (acceptInvitation.variables as string | undefined)
              : undefined
          }
          acceptedTokens={acceptedTokens}
        />
      </div>
    </PageState>
  );
}