import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

import TaskWorkspace from "../components/TaskWorkspace";
import type { WorkBlock } from "@/utils/taskWorkspaceStorage";
import TaskForm from "../components/TaskForm";

import {
  useTaskWorkspace,
  useUpdateTask,
  useArchiveTask,
  useUnarchiveTask,
  useRestoreTask,
} from "../hooks";

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const {
    data: workspace,
    isLoading,
    isError,
    error,
    refetch,
  } = useTaskWorkspace(taskId ?? "");

  const updateTask = useUpdateTask();
  const archiveTask = useArchiveTask();
  const unarchiveTask = useUnarchiveTask();
  const restoreTask = useRestoreTask();

  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const unitMap = useMemo(() => {
    const map = new Map<
      string,
      NonNullable<typeof workspace>["organization_units"][number]
    >();

    workspace?.organization_units.forEach((unit) => {
      map.set(unit.public_id, unit);
    });

    return map;
  }, [workspace]);

  const unitPath = useMemo(() => {
    if (!workspace?.organization_unit) {
      return [];
    }

    const path: NonNullable<
      NonNullable<typeof workspace>["organization_unit"]
    >[] = [];

    let current:
      | NonNullable<typeof workspace>["organization_unit"]
      | undefined = workspace.organization_unit;

    const visited = new Set<string>();

    while (current) {
      if (visited.has(current.public_id)) {
        break;
      }

      visited.add(current.public_id);
      path.unshift(current);

      if (!current.parent_unit_id) {
        break;
      }

      current = unitMap.get(current.parent_unit_id) ?? undefined;
    }

    return path;
  }, [workspace, unitMap]);

  async function refreshWorkspace() {
    await refetch();
  }

  if (!workspace) {
    return (
      <PageState
        loading={isLoading}
        error={isError ? error : undefined}
        empty
        loadingMessage="Loading work workspace..."
        emptyMessage="Task workspace not found."
      >
        <></>
      </PageState>
    );
  }

  const statusLabel = workspace.status.replace("_", " ");

  return (
    <PageState
      loading={false}
      error={isError ? error : undefined}
      empty={false}
    >
      <div className="cybrez-work-surface-page">
        {/* HEADER */}
        <header className="cybrez-work-surface-header">
          <div className="cybrez-work-surface-header-left">
            <button
              type="button"
              className="cybrez-work-surface-back"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              ←
            </button>

            <div className="cybrez-work-surface-title-group">
              <div className="cybrez-work-surface-context">
                <span>
                  {workspace.organization.name}
                </span>

                <span className="cybrez-work-surface-context-separator">
                  /
                </span>

                <span>{workspace.project.name}</span>

                {workspace.organization_unit && (
                  <>
                    <span className="cybrez-work-surface-context-separator">
                      /
                    </span>

                    <span>
                      {workspace.organization_unit.name}
                    </span>
                  </>
                )}
              </div>

              <h1>{workspace.title}</h1>
            </div>
          </div>

          <div className="cybrez-work-surface-header-actions">
            <span
              className={`cybrez-work-surface-status is-${workspace.status}`}
            >
              {statusLabel}
            </span>

            {!workspace.project_completed && (
              <button
                type="button"
                className="cybrez-button cybrez-button-primary"
                onClick={() => {
                  setShowDetails(true);
                  setShowEditForm(true);
                }}
              >
                Save
              </button>
            )}

            <button
              type="button"
              className="cybrez-work-surface-menu-button"
              onClick={() => {
                setShowDetails(true);
                setShowEditForm(false);
              }}
              aria-label="Open task details"
            >
              ⋮
            </button>
          </div>
        </header>

        {/* WORK SURFACE */}
        {!showDetails && (
          <TaskWorkspace
            taskId={workspace.task_public_id}
            title={workspace.title}
            description={workspace.description}
            isReadOnly={workspace.project_completed}
            archivedBlocks={workspace.workspace_blocks as WorkBlock[] | null}
          />
        )}

        {/* DETAILS */}
        {showDetails && (
          <section className="cybrez-work-surface-details">
            <div className="cybrez-work-surface-details-header">
              <div>
                <span className="cybrez-work-surface-kicker">
                  Task context
                </span>

                <h2>Work details</h2>

                <p>
                  Supporting information around this piece
                  of work.
                </p>
              </div>

              <button
                type="button"
                className="cybrez-button cybrez-button-ghost"
                onClick={() => setShowDetails(false)}
              >
                Back to work
              </button>
            </div>

            <div className="cybrez-work-surface-info">
              <div className="cybrez-work-surface-info-group">
                <span>Organization</span>

                <strong>
                  {workspace.organization.name}
                </strong>

                {workspace.organization.description && (
                  <p>
                    {workspace.organization.description}
                  </p>
                )}
              </div>

              <div className="cybrez-work-surface-info-group">
                <span>Project</span>

                <strong>
                  {workspace.project.name}
                </strong>

                {workspace.project.description && (
                  <p>{workspace.project.description}</p>
                )}
              </div>

              <div className="cybrez-work-surface-info-group">
                <span>Status</span>

                <strong className="capitalize">
                  {statusLabel}
                </strong>
              </div>

              <div className="cybrez-work-surface-info-group">
                <span>Priority</span>

                <strong className="capitalize">
                  {workspace.priority}
                </strong>
              </div>

              <div className="cybrez-work-surface-info-group">
                <span>Due date</span>

                <strong>
                  {workspace.due_date
                    ? new Date(
                        workspace.due_date
                      ).toLocaleDateString()
                    : "No due date"}
                </strong>
              </div>

              <div className="cybrez-work-surface-info-group">
                <span>Assignee</span>

                <strong>
                  {workspace.assignee
                    ? workspace.assignee.full_name
                    : "Unassigned"}
                </strong>
              </div>

              <div className="cybrez-work-surface-info-group cybrez-work-surface-info-wide">
                <span>Organization path</span>

                {unitPath.length > 0 ? (
                  <div className="cybrez-work-surface-unit-path">
                    {unitPath.map((unit, index) => (
                      <span key={unit.public_id}>
                        {index > 0 && (
                          <span className="cybrez-work-surface-context-separator">
                            /
                          </span>
                        )}

                        {unit.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <strong>No organizational unit</strong>
                )}
              </div>
            </div>

            <section className="cybrez-work-surface-panel">
              <div className="cybrez-work-surface-panel-header">
                <div>
                  <span className="cybrez-work-surface-kicker">
                    History
                  </span>

                  <h3>Activity</h3>
                </div>
              </div>

              {workspace.activity.length > 0 ? (
                <ol className="cybrez-work-surface-activity-list">
                  {workspace.activity.map((activity) => (
                    <li key={activity.public_id}>
                      <strong>
                        {activity.description ||
                          activity.action.replaceAll("_", " ")}
                      </strong>

                      <time dateTime={activity.created_at}>
                        {new Date(activity.created_at).toLocaleString()}
                      </time>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="cybrez-work-surface-activity-empty">
                  No activity recorded.
                </p>
              )}
            </section>

            {/* EDIT */}
            <section className="cybrez-work-surface-panel">
              <div className="cybrez-work-surface-panel-header">
                <div>
                  <span className="cybrez-work-surface-kicker">
                    Configuration
                  </span>

                  <h3>Edit task</h3>
                </div>

                {!workspace.project_completed && (
                  <button
                    type="button"
                    className="cybrez-button cybrez-button-secondary"
                    onClick={() => setShowEditForm((value) => !value)}
                  >
                    {showEditForm ? "Close" : "Edit"}
                  </button>
                )}
              </div>

              {showEditForm && (
                <div className="cybrez-work-surface-form">
                  <TaskForm
                    initialData={{
                      public_id:
                        workspace.task_public_id,
                      project_public_id:
                        workspace.project.public_id,
                      title: workspace.title,
                      description:
                        workspace.description,
                      status:
                        workspace.status as
                          | "todo"
                          | "in_progress"
                          | "review"
                          | "done"
                          | "blocked",
                      priority:
                        workspace.priority as
                          | "low"
                          | "medium"
                          | "high"
                          | "urgent",
                      assignee_id:
                        workspace.assignee
                          ?.public_id ?? null,
                      organization_unit_id:
                        workspace.organization_unit
                          ?.public_id ?? null,
                      due_date: workspace.due_date,
                      created_at: "",
                      updated_at: "",
                      is_archived:
                        workspace.is_archived,
                    }}
                    organizationUnits={
                      workspace.organization_units
                    }
                    loading={updateTask.isPending}
                    onSubmit={async (data) => {
                      await updateTask.mutateAsync({
                        taskId:
                          workspace.task_public_id,
                        data,
                      });

                      setShowEditForm(false);
                      await refreshWorkspace();
                    }}
                  />
                </div>
              )}
            </section>

            {/* LIFECYCLE */}
            <section className="cybrez-work-surface-panel">
              <div className="cybrez-work-surface-panel-header">
                <div>
                  <span className="cybrez-work-surface-kicker">
                    Lifecycle
                  </span>

                  <h3>Work state</h3>
                </div>

                <div className="cybrez-work-surface-panel-actions">
                  <PermissionGate
                    minimumRole={
                      PERMISSIONS.manageTasks
                    }
                  >
                    {!workspace.is_archived ? (
                      <button
                        type="button"
                        className="cybrez-button cybrez-button-secondary"
                        disabled={archiveTask.isPending}
                        onClick={async () => {
                          await archiveTask.mutateAsync(
                            workspace.task_public_id
                          );

                          await refreshWorkspace();
                        }}
                      >
                        {archiveTask.isPending
                          ? "Archiving..."
                          : "Archive"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="cybrez-button cybrez-button-secondary"
                        disabled={
                          unarchiveTask.isPending
                        }
                        onClick={async () => {
                          await unarchiveTask.mutateAsync(
                            workspace.task_public_id
                          );

                          await refreshWorkspace();
                        }}
                      >
                        {unarchiveTask.isPending
                          ? "Unarchiving..."
                          : "Unarchive"}
                      </button>
                    )}
                  </PermissionGate>

                  <PermissionGate
                    minimumRole={
                      PERMISSIONS.manageTasks
                    }
                  >
                    <button
                      type="button"
                      className="cybrez-button cybrez-button-secondary"
                      disabled={restoreTask.isPending}
                      onClick={async () => {
                        await restoreTask.mutateAsync(
                          workspace.task_public_id
                        );

                        await refreshWorkspace();
                      }}
                    >
                      {restoreTask.isPending
                        ? "Restoring..."
                        : "Restore"}
                    </button>
                  </PermissionGate>
                </div>
              </div>
            </section>
          </section>
        )}

        {/* BOTTOM ACTION BAR */}
        <nav className="cybrez-work-surface-toolbar">
          <button
            type="button"
            className="cybrez-work-surface-tool is-primary"
          >
            <span>+</span>
            <span>Add</span>
          </button>

          <button
            type="button"
            className="cybrez-work-surface-tool"
          >
            <span>↥</span>
            <span>Import</span>
          </button>

          <button
            type="button"
            className="cybrez-work-surface-tool"
          >
            <span>✦</span>
            <span>AI</span>
          </button>

          <button
            type="button"
            className="cybrez-work-surface-tool"
            onClick={() =>
              navigate(
                `/tasks/${workspace.task_public_id}/comments`
              )
            }
          >
            <span>○</span>
            <span>Comments</span>
          </button>

          <button
            type="button"
            className="cybrez-work-surface-tool"
            onClick={() => setShowDetails(true)}
          >
            <span>◷</span>
            <span>Activity</span>
          </button>

          <div className="cybrez-work-surface-toolbar-spacer" />

          <button
            type="button"
            className="cybrez-work-surface-tool"
            onClick={() => setShowDetails(true)}
          >
            <span>⋯</span>
            <span>More</span>
          </button>
        </nav>
      </div>
    </PageState>
  );
}
