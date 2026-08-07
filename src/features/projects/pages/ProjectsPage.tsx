import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
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

  const { data, isLoading, isError, error } =
    useProjects(organizationId!);

  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  if (isLoading) {
    return <h2>Loading projects...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Projects</h1>

    <PermissionGate minimumRole={PERMISSIONS.manageProjects}>
      <ProjectForm
        loading={createProject.isPending}
        onSubmit={async (data) => {
          const project =
           await createProject.mutateAsync({
             organizationId: organizationId!,
             data,
      });

    navigate(`/projects/${project.public_id}`);
  }}
/>
    </PermissionGate>
      

      <hr />

      <h2>Total: {data?.length ?? 0}</h2>

      {data?.map((project) => (
        <div
          key={project.public_id}
          style={{
            border: "1px solid gray",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3>{project.name}</h3>

          <p>{project.description}</p>

          <small>{project.public_id}</small>

          <br />
          <br />

          <button
            onClick={() =>
              navigate(
                `/projects/${project.public_id}`
              )
            }
          >
            View
          </button>

          <PermissionGate minimumRole={PERMISSIONS.deleteProjects}>
  <button
    style={{ marginLeft: "8px" }}
    onClick={() =>
      deleteProject.mutate(project.public_id)
    }
  >
    Delete
  </button>
</PermissionGate>
        </div>
      ))}
    </div>
  );
}