import type {
  ProjectCount,
} from "../types/dashboard";

type Props = {
  data: ProjectCount[];
};

export default function ProjectCountsCard({
  data,
}: Props) {
  const total = data.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const maximum = Math.max(
    ...data.map((item) => item.count),
    1
  );

  return (
    <section className="cybrez-dashboard-card">
      <div className="cybrez-dashboard-card-header">
        <div>
          <h2>Projects</h2>
          <p>Project distribution by status</p>
        </div>

        <span className="cybrez-badge">
          {total} total
        </span>
      </div>

      <div className="cybrez-dashboard-list">
        {data.length === 0 ? (
          <p className="cybrez-muted">
            No project data available.
          </p>
        ) : (
          data.map((item) => {
            const percentage =
              (item.count / maximum) * 100;

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