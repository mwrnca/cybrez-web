import { useQuery } from "@tanstack/react-query";

import { getActivityLogs } from "../api/activityLogApi";

export function useRecentActivity(organizationId: string) {
  console.log("useRecentActivity:", organizationId);

  return useQuery({
    queryKey: ["recent-activity", organizationId],
    queryFn: () => getActivityLogs(organizationId),
  });
}