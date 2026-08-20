import { useNavigate, useParams } from "react-router-dom";

import ProjectForm from "../components/ProjectForm";
import ProjectCard from "../components/ProjectCard";

import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "../hooks";

import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";

export default function ProjectsPage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProjects(organizationId ?? "");

  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  if (!organizationId) {
    return (
      <div className="cybrez-page-state">
        <h2>Projects</h2>
        <p>Organization not selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="cybrez-page-state">
        <div className="cybrez-loading-indicator" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="cybrez-page-state cybrez-page-state-error">
        <h2>Projects</h2>
        <p>{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="cybrez-project-page">
      <header className="cybrez-page-header">
        <div>
          <h1>Projects</h1>
          <p>
            Create and manage projects within this organization.
          </p>
        </div>

        <div className="cybrez-page-header-stat">
          <span>Total Projects</span>
          <strong>{data?.length ?? 0}</strong>
        </div>
      </header>

      <PermissionGate minimumRole={PERMISSIONS.manageProjects}>
        <section className="cybrez-card cybrez-project-form-card">
          <div className="cybrez-section-header">
            <h2>Create Project</h2>
            <p>
              Add a new project to this organization.
            </p>
          </div>

          <ProjectForm
            loading={createProject.isPending}
            onSubmit={async (data) => {
              const project = await createProject.mutateAsync({
                organizationId,
                data,
              });

              navigate(`/projects/${project.public_id}`);
            }}
          />
        </section>
      </PermissionGate>

      <section>
        <div className="cybrez-section-header">
          <h2>Projects</h2>
          <p>
            {data?.length ?? 0} project
            {(data?.length ?? 0) === 1 ? "" : "s"} in this organization.
          </p>
        </div>

        {data && data.length > 0 ? (
          <div className="cybrez-projects-grid">
            {data.map((project) => (
              <ProjectCard
                key={project.public_id}
                project={project}
                onDelete={(id) => {
                  if (window.confirm("Delete this project?")) {
                    deleteProject.mutate(id);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="cybrez-card cybrez-empty-state">
            <div className="cybrez-empty-state-icon">
              P
            </div>

            <h3>No projects found</h3>

            <p>
              Create your first project to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}