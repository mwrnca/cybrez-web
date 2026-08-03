import { useQuery } from "@tanstack/react-query";

import { getProjectCounts } from "../api/dashboardApi";

export function useProjectCounts() {
  return useQuery({
    queryKey: [
      "dashboard",
      "project-counts",
    ],

    queryFn: getProjectCounts,
  });
}