import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateComment } from "../api/commentsApi";
import type { UpdateCommentRequest } from "../types/comment";

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: UpdateCommentRequest;
    }) => updateComment(commentId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
}
