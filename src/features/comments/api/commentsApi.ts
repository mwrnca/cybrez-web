import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../types/comment";

export async function getComments(taskId: string) {
  const response = await api.get<Comment[]>(
    ENDPOINTS.comments.list(taskId)
  );

  return response.data;
}

export async function createComment(
  taskId: string,
  data: CreateCommentRequest
) {
  const response = await api.post<Comment>(
    ENDPOINTS.comments.create(taskId),
    data
  );

  return response.data;
}

export async function updateComment(
  commentId: string,
  data: UpdateCommentRequest
) {
  const response = await api.put<Comment>(
    ENDPOINTS.comments.update(commentId),
    data
  );

  return response.data;
}

export async function deleteComment(commentId: string) {
  await api.delete(ENDPOINTS.comments.delete(commentId));
}

export async function restoreComment(commentId: string) {
  const response = await api.post<Comment>(
    ENDPOINTS.comments.restore(commentId)
  );

  return response.data;
}
