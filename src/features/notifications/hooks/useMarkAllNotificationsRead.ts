import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAllNotificationsRead } from "../api/notificationsApi";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
