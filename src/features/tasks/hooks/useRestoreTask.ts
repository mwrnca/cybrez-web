import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreTask } from "../api/tasksApi";

export function useRestoreTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}