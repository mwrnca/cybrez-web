import { useQuery } from "@tanstack/react-query";

import {
  getTasks,
  getMyTasks,
} from "../api/tasksApi";

import type { Task } from "../types/task";

export function useTasks(projectId?: string) {
  return useQuery<Task[]>({
    queryKey: projectId
      ? ["tasks", projectId]
      : ["tasks", "me"],

    queryFn: () =>
      projectId
        ? getTasks(projectId)
        : getMyTasks(),

    enabled: true,
  });
}