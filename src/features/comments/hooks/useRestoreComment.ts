import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreComment } from "../api/commentsApi";

export function useRestoreComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreComment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
}
