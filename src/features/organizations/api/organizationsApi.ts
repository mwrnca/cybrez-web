import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
} from "@/types/organization";

export async function getOrganizations() {
  console.log("GET", ENDPOINTS.organizations.list);

  const response = await api.get(
    ENDPOINTS.organizations.list
  );

  return response.data;
}

export async function getOrganization(id: string) {
  const response = await api.get<Organization>(
    ENDPOINTS.organizations.detail(id)
  );

  return response.data;
}

export async function createOrganization(
  data: CreateOrganizationRequest
) {
  console.log("CREATE", data);

  const response = await api.post<Organization>(
    ENDPOINTS.organizations.create,
    data
  );

  console.log("CREATE RESPONSE", response);

  return response.data;
}

export async function updateOrganization(
  id: string,
  data: UpdateOrganizationRequest
) {
  console.log("UPDATE", id, data);

  const response = await api.put<Organization>(
    ENDPOINTS.organizations.update(id),
    data
  );

  console.log("UPDATE RESPONSE", response);

  return response.data;
}

export async function deleteOrganization(id: string) {
  await api.delete(
    ENDPOINTS.organizations.delete(id)
  );
}

export async function restoreOrganization(id: string) {
  const response = await api.post(
    `${ENDPOINTS.organizations.detail(id)}/restore`
  );

  return response.data;
}