export interface Project {
  public_id: string;
  organization_public_id: string;

  name: string;
  description: string | null;

  created_at: string;
  updated_at: string;

  is_archived: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}