export interface Comment {
  public_id: string;
  task_public_id: string;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}
