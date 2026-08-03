import { useQuery } from "@tanstack/react-query";

import { getActivityLogs } from "../api/activityLogApi";

export function useActivityLogs(
  organizationId: string
) {
  return useQuery({
    queryKey: [
      "activity-logs",
      organizationId,
    ],

    queryFn: () =>
      getActivityLogs(
        organizationId
      ),
  });
}