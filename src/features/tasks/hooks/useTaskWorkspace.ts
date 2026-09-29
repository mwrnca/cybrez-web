import { useQuery } from "@tanstack/react-query";

import {
  getTaskWorkspace,
} from "../api/taskWorkspaceApi";

export function useTaskWorkspace(taskId: string) {
  return useQuery({
    queryKey: ["task-workspace", taskId],
    queryFn: () => getTaskWorkspace(taskId),
    enabled: !!taskId,
  });
}