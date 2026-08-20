import { useNavigate, useParams } from "react-router-dom";

import PageState from "@/components/PageState";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

import ProjectForm from "../components/ProjectForm";

import {
  useProject,
  useUpdateProject,
  useDeleteProject,
  useArchiveProject,
  useUnarchiveProject,
  useRestoreProject,
} from "../hooks";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useProject(id ?? "");

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const archiveProject = useArchiveProject();
  const unarchiveProject = useUnarchiveProject();
  const restoreProject = useRestoreProject();

  if (!project && !isLoading && !isError) {
    return (
      <PageState
        loading={false}
        empty={true}
        loadingMessage="Loading project..."
        emptyMessage="Project not found."
      >
        <></>
      </PageState>
    );
  }

  return (
  <PageState
    loading={isLoading}
    error={isError ? error : undefined}
    empty={!project}
    loadingMessage="Loading project..."
    emptyMessage="Project not found."
  >
    {project && (
      <div className="cybrez-page">
        <div className="cybrez-project-page">

          {/* HEADER */}
          <header className="cybrez-page-header">
            <div>
              <span className="cybrez-badge">
                Project
              </span>

              <h1>{project.name}</h1>

              <p>
                {project.description ||
                  "Manage this project and its associated tasks."}
              </p>
            </div>

            <div className="cybrez-page-header-stat">
              <span>Status</span>

              <strong
                className={
                  project.is_archived
                    ? "cybrez-project-status-archived"
                    : "cybrez-project-status-active"
                }
              >
                {project.is_archived
                  ? "Archived"
                  : "Active"}
              </strong>
            </div>
          </header>

          {/* PROJECT INFORMATION */}
          <section className="cybrez-project-info cybrez-card">
            <div className="cybrez-project-info-header">
              <div>
                <h2>Project information</h2>

                <p>
                  Details and identifiers for this project.
                </p>
              </div>
            </div>

            <div className="cybrez-project-info-grid">
              <div>
                <span className="cybrez-info-label">
                  Project name
                </span>

                <p className="cybrez-info-value">
                  {project.name}
                </p>
              </div>

              <div>
                <span className="cybrez-info-label">
                  Status
                </span>

                <p className="cybrez-info-value">
                  <span
                    className={
                      project.is_archived
                        ? "cybrez-project-status-badge cybrez-project-status-badge-archived"
                        : "cybrez-project-status-badge cybrez-project-status-badge-active"
                    }
                  >
                    {project.is_archived
                      ? "Archived"
                      : "Active"}
                  </span>
                </p>
              </div>

              <div>
                <span className="cybrez-info-label">
                  Public ID
                </span>

                <code className="cybrez-project-id">
                  {project.public_id}
                </code>
              </div>

              <div>
                <span className="cybrez-info-label">
                  Organization ID
                </span>

                <code className="cybrez-project-id">
                  {project.organization_public_id}
                </code>
              </div>
            </div>
          </section>

          {/* EDIT PROJECT */}
          <section className="cybrez-card cybrez-project-form-card">
            <div className="cybrez-section-header">
              <h2>Edit project</h2>

              <p>
                Update the project's name and description.
              </p>
            </div>

            <ProjectForm
              initialData={project}
              loading={updateProject.isPending}
              onSubmit={async (data) => {
                await updateProject.mutateAsync({
                  id: project.public_id,
                  data,
                });
              }}
            />
          </section>

          {/* PROJECT ACTIONS */}
          <section>
            <div className="cybrez-section-header">
              <h2>Project actions</h2>

              <p>
                Manage the project and access its related resources.
              </p>
            </div>

            <div className="cybrez-project-actions">

              {/* TASKS */}
              <button
                className="cybrez-project-action cybrez-card"
                onClick={() =>
                  navigate(
                    `/projects/${project.public_id}/tasks`
                  )
                }
              >
                <div className="cybrez-action-icon">
                  T
                </div>

                <div>
                  <h3>Tasks</h3>

                  <p>
                    View and manage tasks belonging to this project.
                  </p>
                </div>
              </button>

              {/* ACTIVITY */}
              <button
                className="cybrez-project-action cybrez-card"
                onClick={() =>
                  navigate(
                    `/organizations/${project.organization_public_id}/activity-log`
                  )
                }
              >
                <div className="cybrez-action-icon">
                  A
                </div>

                <div>
                  <h3>Activity log</h3>

                  <p>
                    View activity and changes made within the organization.
                  </p>
                </div>
              </button>

            </div>
          </section>

          {/* PROJECT MANAGEMENT */}
          <section>
            <div className="cybrez-section-header">
              <h2>Project management</h2>

              <p>
                Administrative actions for this project.
              </p>
            </div>

            <div className="cybrez-project-management cybrez-card">

              {/* ARCHIVE / UNARCHIVE */}
              <PermissionGate
                minimumRole={PERMISSIONS.manageProjects}
              >
                <div className="cybrez-project-management-row">
                  <div>
                    <h3>
                      {project.is_archived
                        ? "Unarchive project"
                        : "Archive project"}
                    </h3>

                    <p>
                      {project.is_archived
                        ? "Return this project to active status."
                        : "Hide this project from active project workflows without deleting it."}
                    </p>
                  </div>

                  {!project.is_archived ? (
                    <button
                      className="cybrez-button cybrez-button-secondary"
                      disabled={archiveProject.isPending}
                      onClick={() =>
                        archiveProject.mutate(
                          project.public_id
                        )
                      }
                    >
                      {archiveProject.isPending
                        ? "Archiving..."
                        : "Archive"}
                    </button>
                  ) : (
                    <button
                      className="cybrez-button cybrez-button-primary"
                      disabled={unarchiveProject.isPending}
                      onClick={() =>
                        unarchiveProject.mutate(
                          project.public_id
                        )
                      }
                    >
                      {unarchiveProject.isPending
                        ? "Unarchiving..."
                        : "Unarchive"}
                    </button>
                  )}
                </div>
              </PermissionGate>

              {/* RESTORE */}
              <PermissionGate
                minimumRole={PERMISSIONS.manageProjects}
              >
                <div className="cybrez-project-management-row">
                  <div>
                    <h3>Restore project</h3>

                    <p>
                      Restore this project if it has been soft deleted.
                    </p>
                  </div>

                  <button
                    className="cybrez-button cybrez-button-secondary"
                    disabled={restoreProject.isPending}
                    onClick={() =>
                      restoreProject.mutate(
                        project.public_id
                      )
                    }
                  >
                    {restoreProject.isPending
                      ? "Restoring..."
                      : "Restore"}
                  </button>
                </div>
              </PermissionGate>

            </div>
          </section>

          {/* DANGER ZONE */}
          <section className="cybrez-project-danger-zone cybrez-card">
            <div>
              <h2>Delete project</h2>

              <p>
                Permanently remove this project from the organization.
              </p>
            </div>

            <PermissionGate
              minimumRole={PERMISSIONS.deleteProjects}
            >
              <button
                className="cybrez-button cybrez-button-danger"
                disabled={deleteProject.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this project?"
                    )
                  ) {
                    deleteProject.mutate(
                      project.public_id,
                      {
                        onSuccess: () =>
                          navigate(-1),
                      }
                    );
                  }
                }}
              >
                {deleteProject.isPending
                  ? "Deleting..."
                  : "Delete Project"}
              </button>
            </PermissionGate>
          </section>

          {/* BACK */}
          <div className="cybrez-project-back">
            <button
              className="cybrez-button cybrez-button-ghost"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>

               </div>
      </div>
    )}
  </PageState>
);
}