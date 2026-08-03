import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../api/notificationsApi";
import type { Notification } from "../types/notification";

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
}
