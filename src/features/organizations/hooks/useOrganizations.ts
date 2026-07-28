import { useQuery } from "@tanstack/react-query";

import { getOrganizations } from "../api/organizationsApi";
import type { Organization } from "@/types/organization";

export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
}