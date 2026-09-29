import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type { SearchResult } from "../types/search";

export async function search(query: string): Promise<SearchResult[]> {
  const response = await api.get<SearchResult[]>(
    ENDPOINTS.search.query,
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
}