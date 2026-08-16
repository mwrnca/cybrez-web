import type {
  TasksByStatus,
} from "../types/dashboard";

type Props = {
  data: TasksByStatus[];
};

export default function TasksByStatusCard({
  data,
}: Props) {
  const total = data.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <section className="cybrez-dashboard-card">
      <div className="cybrez-dashboard-card-header">
        <div>
          <h2>Tasks by Status</h2>
          <p>Current task distribution</p>
        </div>

        <span className="cybrez-badge">
          {total} total
        </span>
      </div>

      <div className="cybrez-dashboard-list">
        {data.length === 0 ? (
          <p className="cybrez-muted">
            No task data available.
          </p>
        ) : (
          data.map((item) => {
            const percentage =
              total > 0
                ? (item.count / total) * 100
                : 0;

            return (
              <div
                key={item.status}
                className="cybrez-metric-row"
              >
                <div className="cybrez-metric-top">
                  <span>
                    {formatStatus(item.status)}
                  </span>

                  <strong>{item.count}</strong>
                </div>

                <div className="cybrez-progress">
                  <div
                    className="cybrez-progress-value"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}