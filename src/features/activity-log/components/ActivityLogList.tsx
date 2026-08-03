import type { ActivityLog } from "../types/activityLog";

type Props = {
  logs: ActivityLog[];
};

export default function ActivityLogList({
  logs,
}: Props) {
  if (logs.length === 0) {
    return <p>No activity yet.</p>;
  }

  return (
    <div>
      {logs.map((log) => (
        <div
          key={log.public_id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong>{log.action}</strong>

          <p>{log.description}</p>

          <small>
            Target: {log.target_type}
          </small>

          <br />

          <small>
            {new Date(
              log.created_at
            ).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}