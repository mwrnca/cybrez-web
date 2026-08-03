import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unarchiveTask } from "../api/tasksApi";

export function useUnarchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}