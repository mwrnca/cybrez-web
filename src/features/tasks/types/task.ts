export type TaskStatus =
  | "todo"
  | "in_progress"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  public_id: string;
  project_public_id: string;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  assignee_id: string | null;
  due_date: string | null;

  created_at: string;
  updated_at: string;

  is_archived: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id?: string | null;
  due_date?: string | null;
}