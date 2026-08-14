import { useQuery } from "@tanstack/react-query";

import { getOrganizations } from "../api/organizationsApi";
import type { Organization } from "@/types/organization";
import { useAuth } from "@/contexts/useAuth";

export function useOrganizations() {
  const { user } = useAuth();

  return useQuery<Organization[]>({
    queryKey: ["organizations", user?.public_id],
    queryFn: getOrganizations,
    enabled: !!user,
  });
}