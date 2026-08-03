import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "@/types/project";

export async function getProjects(
  organizationId: string
) {
  const response = await api.get<Project[]>(
    ENDPOINTS.projects.list(organizationId)
  );

  return response.data;
}

export async function getProject(
  projectId: string
) {
  const response = await api.get<Project>(
    ENDPOINTS.projects.detail(projectId)
  );

  return response.data;
}

export async function createProject(
  organizationId: string,
  data: CreateProjectRequest
) {
  const response = await api.post<Project>(
    ENDPOINTS.projects.create(organizationId),
    data
  );

  return response.data;
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectRequest
) {
  const response = await api.put<Project>(
    ENDPOINTS.projects.update(projectId),
    data
  );

  return response.data;
}

export async function deleteProject(
  projectId: string
) {
  await api.delete(
    ENDPOINTS.projects.delete(projectId)
  );
}

export async function restoreProject(
  projectId: string
) {
  const response = await api.post<Project>(
    ENDPOINTS.projects.restore(projectId)
  );

  return response.data;
}

export async function archiveProject(
  projectId: string
) {
  const response = await api.post<Project>(
    ENDPOINTS.projects.archive(projectId)
  );

  return response.data;
}

export async function unarchiveProject(
  projectId: string
) {
  const response = await api.post<Project>(
    ENDPOINTS.projects.unarchive(projectId)
  );

  return response.data;
}