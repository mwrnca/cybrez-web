import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type { DirectoryPerson } from "../types/directory";

export async function getDirectory(): Promise<DirectoryPerson[]> {
  const response = await api.get<DirectoryPerson[]>(
    ENDPOINTS.directory.list
  );

  return response.data;
}