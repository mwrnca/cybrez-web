import { useQuery } from "@tanstack/react-query";

import { getOrganization } from "../api/organizationsApi";

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: () => getOrganization(id),
    enabled: !!id,
  });
}