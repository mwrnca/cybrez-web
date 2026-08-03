import { useMutation, useQueryClient } from "@tanstack/react-query";

import { archiveTask } from "../api/tasksApi";

export function useArchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}