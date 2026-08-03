import { useQuery } from "@tanstack/react-query";

import { getComments } from "../api/commentsApi";
import type { Comment } from "../types/comment";

export function useComments(taskId: string) {
  return useQuery<Comment[]>({
    queryKey: ["comments", taskId],
    queryFn: () => getComments(taskId),
    enabled: !!taskId,
  });
}
