import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type { DirectoryListing, DirectoryOrganization, DirectoryService } from "../types/directory";

export async function getDirectory(): Promise<DirectoryListing> {
  const response = await api.get<DirectoryListing>(
    ENDPOINTS.directory.list
  );

  return response.data;
}

export async function getDirectoryService(id: string): Promise<DirectoryService> {
  const response = await api.get<DirectoryService>(`/services/${id}`);
  return response.data;
}

export async function getDirectoryOrganization(id: string): Promise<DirectoryOrganization> {
  const response = await api.get<DirectoryOrganization>(`/directory/organizations/${id}`);
  return response.data;
}