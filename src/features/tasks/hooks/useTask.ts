import { useQuery } from "@tanstack/react-query";

import { getTask } from "../api/tasksApi";
import type { Task } from "../types/task";

export function useTask(taskId: string) {
  return useQuery<Task>({
    queryKey: ["tasks", taskId],
    queryFn: () => getTask(taskId),
    enabled: !!taskId,
  });
}