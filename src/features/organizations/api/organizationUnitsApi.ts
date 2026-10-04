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

export interface OrganizationUnitMember {
  public_id: string;
  user_id: string;
  user_full_name: string;
  user_email: string;
  created_at: string;
}

export interface OrganizationUnitPayload {
  name?: string;
  description?: string | null;
  parent_unit_id?: string | null;
}

export async function createOrganizationUnit(
  organizationId: string,
  data: Required<Pick<OrganizationUnitPayload, "name">> & OrganizationUnitPayload,
) {
  const response = await api.post<OrganizationUnit>(
    `/organizations/${organizationId}/units`,
    data,
  );

  return response.data;
}

export async function updateOrganizationUnit(
  organizationId: string,
  unitId: string,
  data: OrganizationUnitPayload,
) {
  const response = await api.put<OrganizationUnit>(
    `/organizations/${organizationId}/units/${unitId}`,
    data,
  );

  return response.data;
}

export async function deleteOrganizationUnit(
  organizationId: string,
  unitId: string,
) {
  await api.delete(`/organizations/${organizationId}/units/${unitId}`);
}

export async function getOrganizationUnitMembers(
  organizationId: string,
  unitId: string,
) {
  const response = await api.get<OrganizationUnitMember[]>(
    `/organizations/${organizationId}/units/${unitId}/members`,
  );

  return response.data;
}

export async function addOrganizationUnitMember(
  organizationId: string,
  unitId: string,
  userId: string,
) {
  const response = await api.post<OrganizationUnitMember>(
    `/organizations/${organizationId}/units/${unitId}/members`,
    { user_id: userId },
  );

  return response.data;
}

export async function removeOrganizationUnitMember(
  organizationId: string,
  unitId: string,
  userId: string,
) {
  await api.delete(
    `/organizations/${organizationId}/units/${unitId}/members/${userId}`,
  );
}