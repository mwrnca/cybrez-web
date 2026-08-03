import { useQuery } from "@tanstack/react-query";

import { getTasks } from "../api/tasksApi";
import type { Task } from "../types/task";

export function useTasks(projectId: string) {
  return useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
  });
}