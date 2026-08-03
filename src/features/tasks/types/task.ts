export interface Task {
  public_id: string;
  project_public_id: string;

  title: string;
  description: string | null;

  status: string;
  priority: string;

  assignee_id: number | null;
  due_date: string | null;

  created_at: string;
  updated_at: string;

  is_archived: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;

  status: string;
  priority: string;

  assignee_id?: number | null;
  due_date?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;

  status?: string;
  priority?: string;

  assignee_id?: number | null;
  due_date?: string | null;
}