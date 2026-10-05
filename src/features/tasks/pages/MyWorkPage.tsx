import TaskCard from "../components/TaskCard";
import { useTasks } from "../hooks";

export default function MyWorkPage() {
  

  const {
    data,
    isLoading,
    isError,
    error,
  } = useTasks();

  if (isLoading) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state">
          <div className="cybrez-loading-indicator" />
          <p>Loading your work...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cybrez-page">
        <div className="cybrez-page-state cybrez-page-state-error">
          <h2>Unable to load your work</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cybrez-page">
      <div
        style={{
          display: "grid",
          gap: "var(--space-6)",
        }}
      >
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              My Work
            </span>

            <h1>My Work</h1>

            <p>
              Tasks assigned to you across CYBREZ.
            </p>
          </div>

          <div className="cybrez-page-header-stat">
            <span>Assigned tasks</span>
            <strong>{data?.length ?? 0}</strong>
          </div>
        </header>

        <section>
          <div className="cybrez-section-header">
            <div>
              <h2>
                Assigned to me ({data?.length ?? 0})
              </h2>

              <p>
                Work that currently requires your
                attention.
              </p>
            </div>
          </div>

          {data && data.length > 0 ? (
            <div className="cybrez-organizations-grid">
              {data.map((task) => (
                <TaskCard
                  key={task.public_id}
                  task={task}
                  onDelete={() => undefined}
                />
              ))}
            </div>
          ) : (
            <div className="cybrez-empty-state cybrez-card">
              <div className="cybrez-empty-state-icon">
                ✓
              </div>

              <h3>No assigned tasks</h3>

              <p>
                Tasks assigned to you will appear
                here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}