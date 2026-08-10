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
      <div style={{ padding: "2rem" }}>
        <h1>Projects</h1>
        <p>Organization not selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem" }}>
        Loading projects...
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Projects</h1>
        <p>{String(error)}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Projects</h1>

      <PermissionGate minimumRole={PERMISSIONS.manageProjects}>
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
      </PermissionGate>

      <hr />

      <h2>Total: {data?.length ?? 0}</h2>

      {data && data.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
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
        <p>No projects found.</p>
      )}
    </div>
  );
}