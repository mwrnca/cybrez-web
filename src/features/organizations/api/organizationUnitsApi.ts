import api from "@/lib/axios";

export interface OrganizationUnit {
  public_id: string;
  organization_id: string;
  parent_unit_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export async function getOrganizationUnits(
  organizationId: string
): Promise<OrganizationUnit[]> {
  const response = await api.get<OrganizationUnit[]>(
    `/organizations/${organizationId}/units`
  );

  return response.data;
}