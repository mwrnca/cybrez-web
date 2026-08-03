import PageState from "@/components/PageState";
import { NotificationsList } from "../components";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks";

export default function NotificationsPage() {
  const { data, isLoading, isError, error } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

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

        <NotificationsList
          notifications={data ?? []}
          onRead={(id) => markRead.mutate(id)}
          onDelete={(id) => deleteNotification.mutate(id)}
        />
      </div>
    </PageState>
  );
}
