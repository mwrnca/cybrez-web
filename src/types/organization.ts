export interface Organization {
  id: number;
  public_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
}