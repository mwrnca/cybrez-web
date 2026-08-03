import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "../types/task";

export async function getTasks(projectId: string) {
  const response = await api.get<Task[]>(
    ENDPOINTS.tasks.list(projectId)
  );

  return response.data;
}

export async function getTask(taskId: string) {
  const response = await api.get<Task>(
    ENDPOINTS.tasks.detail(taskId)
  );

  return response.data;
}

export async function createTask(
  projectId: string,
  data: CreateTaskRequest
) {
  const response = await api.post<Task>(
    ENDPOINTS.tasks.create(projectId),
    data
  );

  return response.data;
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskRequest
) {
  const response = await api.put<Task>(
    ENDPOINTS.tasks.update(taskId),
    data
  );

  return response.data;
}

export async function deleteTask(
  projectId: string,
  taskId: string
) {
  await api.delete(
    ENDPOINTS.tasks.delete(projectId, taskId)
  );
}

export async function restoreTask(taskId: string) {
  const response = await api.post<Task>(
    ENDPOINTS.tasks.restore(taskId)
  );

  return response.data;
}

export async function archiveTask(taskId: string) {
  const response = await api.post<Task>(
    ENDPOINTS.tasks.archive(taskId)
  );

  return response.data;
}

export async function unarchiveTask(taskId: string) {
  const response = await api.post<Task>(
    ENDPOINTS.tasks.unarchive(taskId)
  );

  return response.data;
}