import type { Notification } from "../types/notification";

type Props = {
  notifications: Notification[];
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function NotificationsList({ notifications, onRead, onDelete }: Props) {
  if (!notifications.length) {
    return <p>No notifications yet.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {notifications.map((notification) => (
        <div
          key={notification.public_id}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "1rem",
            background: notification.is_read ? "#f9fafb" : "#ffffff",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
            <strong>{notification.title}</strong>
            <small>{new Date(notification.created_at).toLocaleString()}</small>
          </div>
          <p style={{ margin: "0.5rem 0" }}>{notification.message}</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {!notification.is_read && (
              <button onClick={() => onRead(notification.public_id)}>Mark read</button>
            )}
            <button onClick={() => onDelete(notification.public_id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
