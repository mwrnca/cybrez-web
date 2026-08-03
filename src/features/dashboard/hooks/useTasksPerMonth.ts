import { useQuery } from "@tanstack/react-query";

import { getTasksPerMonth } from "../api/dashboardApi";

export function useTasksPerMonth() {
  return useQuery({
    queryKey: [
      "dashboard",
      "tasks-per-month",
    ],

    queryFn: getTasksPerMonth,
  });
}