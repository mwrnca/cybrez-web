export interface DirectoryOrganization {
  public_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

export interface DirectoryService {
  public_id: string;
  persona_public_id: string;
  provider_user_id: string;
  provider_name: string;
  provider_slug: string;
  provider_type: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  rate_description: string | null;
}

export interface DirectoryListing {
  services: DirectoryService[];
  organizations: DirectoryOrganization[];
}