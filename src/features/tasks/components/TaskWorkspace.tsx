type TaskWorkspaceProps = {
  description: string | null | undefined;
  onUseTools: () => void;
};

export default function TaskWorkspace({
  description,
  onUseTools,
}: TaskWorkspaceProps) {
  return (
    <section className="cybrez-task-workspace cybrez-card">
      <div className="cybrez-task-workspace-main">
        <div>
          <span className="cybrez-badge">Workspace</span>

          <h2>Work execution</h2>

          <p>
            {description ||
              "This workspace is the execution surface for this piece of work."}
          </p>
        </div>

        <div className="cybrez-task-workspace-status">
          <span className="cybrez-info-label">
            Ready for work
          </span>

          <p>
            Use the available tools and APIs to move this work
            forward.
          </p>
        </div>
      </div>

      <div className="cybrez-task-workspace-actions">
        <button
          type="button"
          className="cybrez-button cybrez-button-primary"
          onClick={onUseTools}
        >
          Use tools
        </button>
      </div>
    </section>
  );
}