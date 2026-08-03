import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type { Notification } from "../types/notification";

export async function getNotifications() {
  const response = await api.get<Notification[]>(ENDPOINTS.notifications.list);
  return response.data;
}

export async function markNotificationRead(notificationId: string) {
  const response = await api.post<Notification>(ENDPOINTS.notifications.read(notificationId));
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.post<Notification[]>(ENDPOINTS.notifications.readAll);
  return response.data;
}

export async function deleteNotification(notificationId: string) {
  await api.delete(ENDPOINTS.notifications.delete(notificationId));
}
