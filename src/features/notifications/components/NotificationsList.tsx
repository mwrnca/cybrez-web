import type { Notification } from "../types/notification";

type Props = {
  notifications: Notification[];
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function NotificationsList({ notifications, onRead, onDelete }: Props) {
  if (!notifications.length) {
    return <p style={{ color: "var(--color-text-muted)" }}>No notifications yet.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {notifications.map((notification) => (
        <div
          key={notification.public_id}
          className="cybrez-card"
          style={{
            padding: "var(--space-4)",
            opacity: notification.is_read ? 0.65 : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <strong>{notification.title}</strong>
            <small style={{ color: "var(--color-text-muted)" }}>
              {new Date(notification.created_at).toLocaleString()}
            </small>
          </div>

          <p
            style={{
              margin: "0.5rem 0",
              color: "var(--color-text-muted)",
              wordBreak: "break-word",
            }}
          >
            {notification.message}
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {!notification.is_read && (
              <button
                className="cybrez-button cybrez-button-secondary"
                onClick={() => onRead(notification.public_id)}
              >
                Mark read
              </button>
            )}
            <button
              className="cybrez-button cybrez-button-danger"
              onClick={() => onDelete(notification.public_id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}