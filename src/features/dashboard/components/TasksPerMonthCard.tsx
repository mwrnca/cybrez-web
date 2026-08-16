import type {
  TasksPerMonth,
} from "../types/dashboard";

type Props = {
  data: TasksPerMonth[];
};

export default function TasksPerMonthCard({
  data,
}: Props) {
  const maximum = Math.max(
    ...data.map((item) => item.count),
    1
  );

  return (
    <section className="cybrez-dashboard-card cybrez-dashboard-card-wide">
      <div className="cybrez-dashboard-card-header">
        <div>
          <h2>Tasks per Month</h2>
          <p>Task activity over time</p>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="cybrez-muted">
          No monthly task data available.
        </p>
      ) : (
        <div className="cybrez-month-chart">
          {data.map((item) => {
            const height =
              (item.count / maximum) * 100;

            return (
              <div
                key={item.month}
                className="cybrez-month-column"
              >
                <div className="cybrez-month-value">
                  {item.count}
                </div>

                <div className="cybrez-month-bar-container">
                  <div
                    className="cybrez-month-bar"
                    style={{
                      height: `${Math.max(
                        height,
                        item.count > 0 ? 6 : 0
                      )}%`,
                    }}
                  />
                </div>

                <span className="cybrez-month-label">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}