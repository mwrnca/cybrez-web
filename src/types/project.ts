export interface Project {
  public_id: string;
  organization_public_id: string;

  name: string;
  description: string | null;

  created_at: string;
  updated_at: string;

  is_archived: boolean;
  is_completed: boolean;
  completed_at: string | null;
}

export interface ProjectWorkspaceSnapshotEntry {
  task_public_id: string;
  blocks: Record<string, unknown>[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}