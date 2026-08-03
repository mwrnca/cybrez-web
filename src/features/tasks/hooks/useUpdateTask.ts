import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTask } from "../api/tasksApi";
import type { UpdateTaskRequest } from "../types/task";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskRequest;
    }) => updateTask(taskId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}