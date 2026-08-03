import { useQuery } from "@tanstack/react-query";

import { getTasksByStatus } from "../api/dashboardApi";

export function useTasksByStatus() {
  return useQuery({
    queryKey: [
      "dashboard",
      "tasks-by-status",
    ],

    queryFn: getTasksByStatus,
  });
}