import api from "@/lib/axios";

export interface ServiceOffering {
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
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceOfferingForm {
  persona_public_id: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  rate_description: string;
  is_published: boolean;
}

export async function getMyServices(): Promise<ServiceOffering[]> {
  const response = await api.get<ServiceOffering[]>("/services/me");
  return response.data;
}

export async function createService(data: ServiceOfferingForm): Promise<ServiceOffering> {
  const response = await api.post<ServiceOffering>("/services", data);
  return response.data;
}

export async function updateService(
  id: string,
  data: Omit<ServiceOfferingForm, "persona_public_id">,
): Promise<ServiceOffering> {
  const response = await api.patch<ServiceOffering>(`/services/${id}`, data);
  return response.data;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}