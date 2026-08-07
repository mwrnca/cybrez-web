// useComment.ts
import { useQuery } from "@tanstack/react-query";
import { getComment } from "../api/commentsApi";
import type { Comment } from "../types/comment";

export function useComment(commentId: string) {
  return useQuery<Comment>({
    queryKey: ["comment", commentId],
    queryFn: () => getComment(commentId),
    enabled: !!commentId,
  });
}