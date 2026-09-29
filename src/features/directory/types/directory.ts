export interface DirectoryOrganization {
  public_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  role: string;
}

export interface DirectoryPerson {
  public_id: string;
  full_name: string;
  organizations: DirectoryOrganization[];
}