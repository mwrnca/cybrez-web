import { useParams, useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "../hooks";
import PermissionGate from "@/components/permissions/PermissionGate";
import { PERMISSIONS } from "@/permissions/permissions";
import ProjectCard from "../components/ProjectCard";

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
  <ProjectCard
    key={project.public_id}
    project={project}
    onDelete={(id) =>
      deleteProject.mutate(id)
    }
  />
))}
    </div>
  );
}