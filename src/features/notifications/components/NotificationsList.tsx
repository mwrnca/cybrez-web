import { useState } from "react";

import type { Notification } from "../types/notification";

type Props = {
  notifications: Notification[];
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAcceptInvitation?: (invitationId: string, notificationId: string) => void;
  acceptingToken?: string;
  acceptedTokens?: string[];
};

const TYPE_ICONS: Record<string, string> = {
  invitation: "📨",
};

const DEFAULT_ICON = "🔔";

const TRUNCATE_LENGTH = 160;

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
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

export default function NotificationsList({
  notifications,
  onRead,
  onDelete,
  onAcceptInvitation,
  acceptingToken,
  acceptedTokens = [],
}: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (!notifications.length) {
    return <p style={{ color: "var(--color-text-muted)" }}>No notifications yet.</p>;
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {notifications.map((notification) => {
        const isInvitation =
          notification.type === "invitation" && !!notification.reference_id;
        const invitationId = notification.reference_id ?? "";
        const alreadyAccepted = acceptedTokens.includes(invitationId);
        const isAccepting = acceptingToken === invitationId;

        const icon = TYPE_ICONS[notification.type ?? ""] ?? DEFAULT_ICON;

        const rawMessage = notification.message ?? "";
        // Clean legacy or raw invitation acceptance URLs/tokens from message text
        const cleanedMessage = rawMessage
          .replace(/\s*Accept it here:\s*https?:\/\/[^\s]+/i, "")
          .replace(/https?:\/\/[^\s]+/gi, "")
          .trim();

        const finalMessage = cleanedMessage || notification.title || "Notification";
        const isLong = finalMessage.length > TRUNCATE_LENGTH;
        const isExpanded = expanded.has(notification.public_id);
        const displayMessage =
          isLong && !isExpanded
            ? `${finalMessage.slice(0, TRUNCATE_LENGTH)}…`
            : finalMessage;

        return (
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
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span aria-hidden style={{ fontSize: "1.1rem" }}>{icon}</span>
                <strong>{notification.title}</strong>
                {!notification.is_read && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--color-primary)",
                      display: "inline-block",
                    }}
                  />
                )}
              </div>

              <small
                title={new Date(notification.created_at).toLocaleString()}
                style={{ color: "var(--color-text-muted)" }}
              >
                {formatRelativeTime(notification.created_at)}
              </small>
            </div>

            <p
              style={{
                margin: "0.5rem 0",
                color: "var(--color-text-muted)",
                wordBreak: "break-word",
              }}
            >
              {displayMessage}
              {isLong && (
                <button
                  onClick={() => toggleExpanded(notification.public_id)}
                  style={{
                    marginLeft: "0.4rem",
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "inherit",
                  }}
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {isInvitation && onAcceptInvitation && (
                <button
                  className="cybrez-button cybrez-button-primary"
                  disabled={alreadyAccepted || isAccepting}
                  onClick={() =>
                    onAcceptInvitation(invitationId, notification.public_id)
                  }
                >
                  {alreadyAccepted
                    ? "Accepted ✓"
                    : isAccepting
                      ? "Accepting..."
                      : "Accept Invitation"}
                </button>
              )}

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
        );
      })}
    </div>
  );
}