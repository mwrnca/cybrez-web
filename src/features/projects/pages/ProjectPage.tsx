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
        <div style={{ display: "grid", gap: "1rem" }}>
          <h1>{project.name}</h1>

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

          <p>{project.description}</p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() =>
                navigate(`/projects/${project.public_id}/tasks`)
              }
            >
              View Tasks
            </button>

            <button
              onClick={() =>
                navigate(
                  `/organizations/${project.organization_public_id}/activity-log`
                )
              }
            >
              View Activity Log
            </button>
          </div>

          <div>
            <h3>Public ID</h3>
            <p>{project.public_id}</p>
          </div>

          <div>
            <h3>Status</h3>
            <p>
              {project.is_archived
                ? "Archived"
                : "Active"}
            </p>
          </div>

          <PermissionGate
            minimumRole={PERMISSIONS.manageProjects}
          >
            {!project.is_archived ? (
              <button
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
          </PermissionGate>

          <PermissionGate
            minimumRole={PERMISSIONS.manageProjects}
          >
            <button
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
          </PermissionGate>

          <PermissionGate
            minimumRole={PERMISSIONS.deleteProjects}
          >
            <button
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
                : "Delete"}
            </button>
          </PermissionGate>

          <button onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      )}
    </PageState>
  );
}