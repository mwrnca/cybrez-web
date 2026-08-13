export interface Project {
  public_id: string;
  organization_public_id: string;

  name: string;
  description: string | null;

  is_archived: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}