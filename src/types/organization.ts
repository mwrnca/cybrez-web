export interface Organization {
  public_id: string;
  owner_id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  is_directory_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  logo_url?: string | null;
  is_directory_visible?: boolean;
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  logo_url?: string | null;
  is_directory_visible?: boolean;
}