import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createComment } from "../api/commentsApi";
import type { CreateCommentRequest } from "../types/comment";

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: CreateCommentRequest;
    }) => createComment(taskId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });
    },
  });
}
