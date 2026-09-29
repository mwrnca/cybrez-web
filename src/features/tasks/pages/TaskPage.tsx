import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

import TaskWorkspace from "../components/TaskWorkspace";

import {
  useTaskWorkspace,
  useUpdateTask,
  useArchiveTask,
  useUnarchiveTask,
  useRestoreTask,
} from "../hooks";

import TaskForm from "../components/TaskForm";

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

  const [showDetails, setShowDetails] =
    useState(false);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const statusLabel = workspace?.status
    ? workspace.status.replace("_", " ")
    : "";

  const statusColor =
    workspace?.status === "done"
      ? "var(--color-success)"
      : workspace?.status === "in_progress"
        ? "var(--color-primary)"
        : workspace?.status === "blocked"
          ? "var(--color-danger)"
          : "var(--color-text-muted)";

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

    const path: (typeof workspace.organization_unit)[] =
      [];

    let current:
      | typeof workspace.organization_unit
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

      current = unitMap.get(
        current.parent_unit_id
      );
    }

    return path;
  }, [workspace, unitMap]);

  async function refreshWorkspace() {
    await refetch();
  }

  function handleUseTools() {
    /*
     * This is the workspace execution entry point.
     *
     * The actual tool/API execution endpoint does not yet
     * exist in the current task workspace API, so we do not
     * invent one here.
     *
     * The button is intentionally wired as the future
     * execution boundary.
     */
  }

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!workspace}
      loadingMessage="Loading work workspace..."
      emptyMessage="Task workspace not found."
    >
      {workspace && (
        <div className="cybrez-page">
          <div
            style={{
              display: "grid",
              gap: "var(--space-6)",
            }}
          >
            {/* WORKSPACE HEADER */}
            <header className="cybrez-page-header cybrez-task-page-header">
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <span
                    className="cybrez-badge"
                    style={{
                      borderColor: statusColor,
                      color: statusColor,
                      textTransform: "capitalize",
                    }}
                  >
                    {statusLabel}
                  </span>

                  <span className="cybrez-badge">
                    {workspace.priority} priority
                  </span>

                  {workspace.is_archived && (
                    <span
                      className="cybrez-badge"
                      style={{
                        color: "var(--color-warning)",
                        borderColor:
                          "var(--color-warning)",
                      }}
                    >
                      Archived
                    </span>
                  )}
                </div>

                <span className="cybrez-badge">
                  Work
                </span>

                <h1>{workspace.title}</h1>

                <p>
                  {workspace.description ||
                    "No description provided."}
                </p>
              </div>

              <div className="cybrez-task-page-actions">
                <button
                  type="button"
                  className="cybrez-button cybrez-button-secondary"
                  onClick={() =>
                    setShowDetails((current) => !current)
                  }
                >
                  {showDetails
                    ? "Workspace"
                    : "Task details"}
                </button>

                <button
                  type="button"
                  className="cybrez-button cybrez-button-secondary"
                  onClick={() =>
                    navigate(
                      `/tasks/${workspace.task_public_id}/comments`
                    )
                  }
                >
                  View Comments
                </button>

                <button
                  type="button"
                  className="cybrez-button cybrez-button-ghost"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>
            </header>

            {/* DEFAULT WORKSPACE */}
            {!showDetails && (
              <TaskWorkspace
                description={workspace.description}
                onUseTools={handleUseTools}
              />
            )}

            {/* TASK DETAILS */}
            {showDetails && (
              <div
                className="cybrez-task-details"
                style={{
                  display: "grid",
                  gap: "var(--space-6)",
                }}
              >
                {/* CONTEXT */}
                <section>
                  <div className="cybrez-section-header">
                    <div>
                      <span className="cybrez-badge">
                        Context
                      </span>

                      <h2>Where this work belongs</h2>

                      <p>
                        The organization and work context
                        surrounding this task.
                      </p>
                    </div>
                  </div>

                  <div className="cybrez-task-context-grid">
                    {/* ORGANIZATION */}
                    <article className="cybrez-task-context-card cybrez-card">
                      <span className="cybrez-info-label">
                        Organization
                      </span>

                      <h3>
                        {workspace.organization.name}
                      </h3>

                      <p>
                        {workspace.organization.description ||
                          "No organization description."}
                      </p>
                    </article>

                    {/* PROJECT */}
                    <article className="cybrez-task-context-card cybrez-card">
                      <span className="cybrez-info-label">
                        Project
                      </span>

                      <h3>
                        {workspace.project.name}
                      </h3>

                      <p>
                        {workspace.project.description ||
                          "No project description."}
                      </p>
                    </article>

                    {/* ORGANIZATION UNIT */}
                    <article className="cybrez-task-context-card cybrez-card">
                      <span className="cybrez-info-label">
                        Organizational Layer
                      </span>

                      {unitPath.length > 0 ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "var(--space-2)",
                              marginTop: "var(--space-3)",
                            }}
                          >
                            {unitPath.map(
                              (unit, index) => (
                                <div
                                  key={unit.public_id}
                                  style={{
                                    paddingLeft:
                                      `calc(${index} * var(--space-4))`,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems:
                                        "center",
                                      gap: "var(--space-2)",
                                    }}
                                  >
                                    {index > 0 && (
                                      <span
                                        style={{
                                          color:
                                            "var(--color-text-muted)",
                                        }}
                                      >
                                        ↳
                                      </span>
                                    )}

                                    <strong>
                                      {unit.name}
                                    </strong>
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          {workspace.organization_unit
                            ?.description && (
                            <p
                              style={{
                                marginTop:
                                  "var(--space-3)",
                              }}
                            >
                              {
                                workspace
                                  .organization_unit
                                  .description
                              }
                            </p>
                          )}
                        </>
                      ) : (
                        <p>
                          This task is not assigned to an
                          organizational unit.
                        </p>
                      )}
                    </article>
                  </div>
                </section>

                {/* WORK DETAILS */}
                <section className="cybrez-task-section cybrez-card">
                  <div className="cybrez-section-header">
                    <div>
                      <span className="cybrez-badge">
                        Work
                      </span>

                      <h2>Task details</h2>

                      <p>
                        The current state of this piece of
                        work.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "var(--space-5)",
                    }}
                  >
                    <div>
                      <span className="cybrez-info-label">
                        Status
                      </span>

                      <p
                        className="cybrez-info-value"
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        {statusLabel}
                      </p>
                    </div>

                    <div>
                      <span className="cybrez-info-label">
                        Priority
                      </span>

                      <p
                        className="cybrez-info-value"
                        style={{
                          textTransform: "capitalize",
                        }}
                      >
                        {workspace.priority}
                      </p>
                    </div>

                    <div>
                      <span className="cybrez-info-label">
                        Due Date
                      </span>

                      <p className="cybrez-info-value">
                        {workspace.due_date
                          ? new Date(
                              workspace.due_date
                            ).toLocaleDateString()
                          : "No due date"}
                      </p>
                    </div>

                    <div>
                      <span className="cybrez-info-label">
                        Assignee
                      </span>

                      <p className="cybrez-info-value">
                        {workspace.assignee
                          ? workspace.assignee.full_name
                          : "Unassigned"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* PEOPLE */}
                <section className="cybrez-task-section cybrez-card">
                  <div className="cybrez-section-header">
                    <div>
                      <span className="cybrez-badge">
                        People
                      </span>

                      <h2>People involved</h2>

                      <p>
                        People currently associated with
                        this work.
                      </p>
                    </div>
                  </div>

                  {workspace.assignee ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                      }}
                    >
                      <div
                        className="cybrez-avatar"
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      >
                        {workspace.assignee.full_name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {workspace.assignee.full_name}
                        </strong>

                        <p
                          style={{
                            margin: "2px 0 0",
                            color:
                              "var(--color-text-muted)",
                            fontSize:
                              "var(--font-size-xs)",
                          }}
                        >
                          Assignee
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p
                      style={{
                        color:
                          "var(--color-text-muted)",
                      }}
                    >
                      No one is currently assigned to
                      this task.
                    </p>
                  )}
                </section>

                {/* TOOLS */}
                <section className="cybrez-task-section cybrez-card">
                  <div className="cybrez-section-header">
                    <div>
                      <span className="cybrez-badge">
                        Tools
                      </span>

                      <h2>Work tools</h2>

                      <p>
                        Tools and API actions available to
                        this workspace.
                      </p>
                    </div>
                  </div>

                  {workspace.tools.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "var(--space-3)",
                      }}
                    >
                      {workspace.tools.map(
                        (tool, index) => (
                          <div
                            key={index}
                            className="cybrez-task-item cybrez-card"
                            style={{
                              padding:
                                "var(--space-4)",
                            }}
                          >
                            <pre
                              style={{
                                margin: 0,
                                whiteSpace:
                                  "pre-wrap",
                                fontSize:
                                  "var(--font-size-xs)",
                              }}
                            >
                              {JSON.stringify(
                                tool,
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="cybrez-empty-state">
                      <h3>No tools connected</h3>

                      <p>
                        Tools and API capabilities will
                        appear here when they become
                        available to this workspace.
                      </p>
                    </div>
                  )}
                </section>

                {/* AI */}
                <section className="cybrez-task-section cybrez-card">
                  <div className="cybrez-section-header">
                    <div>
                      <span className="cybrez-badge">
                        AI Assistance
                      </span>

                      <h2>Work with CYBREZ</h2>

                      <p>
                        AI assistance will use this
                        workspace's task, organization,
                        people, tools, and context.
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: "var(--space-3)",
                    }}
                  >
                    <div>
                      <strong>
                        Proposal-first execution
                      </strong>

                      <p
                        style={{
                          color:
                            "var(--color-text-muted)",
                          marginTop: "4px",
                        }}
                      >
                        CYBREZ will propose actions,
                        explain the relevant context,
                        and wait for human approval before
                        executing meaningful changes.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cybrez-button cybrez-button-secondary"
                      disabled
                    >
                      AI assistance coming next
                    </button>
                  </div>
                </section>

                {/* ACTIVITY */}
                <section className="cybrez-task-section cybrez-card">
                  <div className="cybrez-section-header">
                    <div>
                      <span className="cybrez-badge">
                        Activity
                      </span>

                      <h2>Work history</h2>

                      <p>
                        Activity and changes associated
                        with this workspace.
                      </p>
                    </div>
                  </div>

                  {workspace.activity.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gap: "var(--space-3)",
                      }}
                    >
                      {workspace.activity.map(
                        (event, index) => (
                          <div
                            key={index}
                            className="cybrez-task-item cybrez-card"
                            style={{
                              padding:
                                "var(--space-4)",
                            }}
                          >
                            <pre
                              style={{
                                margin: 0,
                                whiteSpace:
                                  "pre-wrap",
                                fontSize:
                                  "var(--font-size-xs)",
                              }}
                            >
                              {JSON.stringify(
                                event,
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="cybrez-empty-state">
                      <h3>No activity yet</h3>

                      <p>
                        Workspace activity will appear
                        here as work progresses.
                      </p>
                    </div>
                  )}
                </section>

                {/* EDIT */}
                <section className="cybrez-task-section cybrez-card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      gap: "var(--space-4)",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <span className="cybrez-info-label">
                        Configuration
                      </span>

                      <h3
                        style={{
                          fontSize:
                            "var(--font-size-md)",
                          margin: "4px 0 0",
                        }}
                      >
                        Edit task
                      </h3>

                      <p
                        style={{
                          color:
                            "var(--color-text-muted)",
                          fontSize:
                            "var(--font-size-xs)",
                          margin: "4px 0 0",
                        }}
                      >
                        Update the task's details and
                        organizational context.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="cybrez-button cybrez-button-secondary"
                      onClick={() =>
                        setShowEditForm((value) => !value)
                      }
                    >
                      {showEditForm
                        ? "Close"
                        : "Edit Task"}
                    </button>
                  </div>

                  {showEditForm && (
                    <div
                      style={{
                        marginTop: "var(--space-5)",
                      }}
                    >
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
                          due_date:
                            workspace.due_date,
                          created_at: "",
                          updated_at: "",
                          is_archived:
                            workspace.is_archived,
                        }}
                        organizationUnits={
                          workspace.organization_units
                        }
                        loading={
                          updateTask.isPending
                        }
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

                {/* LIFECYCLE ACTIONS */}
                <section className="cybrez-task-section cybrez-card">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      flexWrap: "wrap",
                      gap: "var(--space-4)",
                    }}
                  >
                    <div>
                      <span className="cybrez-info-label">
                        Lifecycle
                      </span>

                      <h3
                        style={{
                          fontSize:
                            "var(--font-size-md)",
                          margin: "4px 0 0",
                        }}
                      >
                        Task Actions
                      </h3>

                      <p
                        style={{
                          color:
                            "var(--color-text-muted)",
                          fontSize:
                            "var(--font-size-xs)",
                          margin: "4px 0 0",
                        }}
                      >
                        Manage the lifecycle state of
                        this work.
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-3)",
                        flexWrap: "wrap",
                      }}
                    >
                      <PermissionGate
                        minimumRole={
                          PERMISSIONS.manageTasks
                        }
                      >
                        {!workspace.is_archived ? (
                          <button
                            type="button"
                            className="cybrez-button cybrez-button-secondary"
                            disabled={
                              archiveTask.isPending
                            }
                            onClick={async () => {
                              await archiveTask.mutateAsync(
                                workspace.task_public_id
                              );

                              await refreshWorkspace();
                            }}
                          >
                            {archiveTask.isPending
                              ? "Archiving..."
                              : "Archive Task"}
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
                              : "Unarchive Task"}
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
                          disabled={
                            restoreTask.isPending
                          }
                          onClick={async () => {
                            await restoreTask.mutateAsync(
                              workspace.task_public_id
                            );

                            await refreshWorkspace();
                          }}
                        >
                          {restoreTask.isPending
                            ? "Restoring..."
                            : "Restore Task"}
                        </button>
                      </PermissionGate>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </PageState>
  );
}