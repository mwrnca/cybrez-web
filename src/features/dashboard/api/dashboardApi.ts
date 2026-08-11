import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  DashboardStats,
  TasksByStatus,
  ProjectCount,
  TasksPerMonth,
} from "../types/dashboard";

export async function getDashboardStats() {
  const response =
    await api.get<DashboardStats>(
      ENDPOINTS.dashboard.stats
    );

  return response.data;
}

export async function getTasksByStatus() {
  const response =
    await api.get<TasksByStatus[]>(
      ENDPOINTS.dashboard.tasksByStatus
    );

  return response.data;
}

export async function getProjectCounts() {
  const response =
    await api.get<ProjectCount[]>(
      ENDPOINTS.dashboard.projectCounts
    );

  return response.data;
}

export async function getTasksPerMonth() {
  const response =
    await api.get<TasksPerMonth[]>(
      ENDPOINTS.dashboard.tasksPerMonth
    );

  return response.data;
}