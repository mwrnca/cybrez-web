import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTask } from "../api/tasksApi";
import type { CreateTaskRequest } from "../types/task";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateTaskRequest;
    }) => createTask(projectId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.projectId],
      });
    },
  });
}