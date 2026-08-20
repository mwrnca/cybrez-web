import type { ActivityLog } from "../types/activityLog";

type Props = {
  logs: ActivityLog[];
};

export default function ActivityLogList({
  logs,
}: Props) {
  if (logs.length === 0) {
    return (
      <div className="cybrez-empty-state cybrez-card">
        <div className="cybrez-empty-state-icon">📋</div>
        <h3>No activity recorded</h3>
        <p>Actions performed in this workspace will be logged here chronologically.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      {logs.map((log) => {
        const actionLabel = log.action.replace(/_/g, " ");
        const isDelete = log.action.includes("delete");
        const isCreate = log.action.includes("create");
        const isArchive = log.action.includes("archive");

        const badgeColor = isDelete
          ? "var(--color-danger)"
          : isCreate
            ? "var(--color-success)"
            : isArchive
              ? "var(--color-warning)"
              : "var(--color-primary)";

        return (
          <div
            key={log.public_id}
            className="cybrez-card"
            style={{
              padding: "var(--space-4)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-primary-soft)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--font-size-sm)",
                  flexShrink: 0,
                  fontWeight: 600,
                }}
              >
                ⚡
              </div>

              <div>
                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
                  <strong style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text)" }}>
                    {log.description}
                  </strong>

                  <span
                    className="cybrez-badge"
                    style={{ borderColor: badgeColor, color: badgeColor, textTransform: "capitalize" }}
                  >
                    {actionLabel}
                  </span>

                  <span className="cybrez-badge" style={{ color: "var(--color-text-subtle)" }}>
                    {log.target_type}
                  </span>
                </div>

                <div style={{ marginTop: "4px", fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                  ID: <code style={{ color: "var(--color-primary)" }}>{log.public_id}</code>
                </div>
              </div>
            </div>

            <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
              {new Date(log.created_at).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}