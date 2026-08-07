import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type { ActivityLog } from "../types/activityLog";

export async function getActivityLogs(
  organizationId: string
) {
  console.log("API organizationId:", organizationId);

  console.log(
    ENDPOINTS.activityLogs.list(organizationId)
  );

  const response =
    await api.get<ActivityLog[]>(
      ENDPOINTS.activityLogs.list(organizationId)
    );

  return response.data;
}