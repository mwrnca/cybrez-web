import { useQuery } from "@tanstack/react-query";

import { getOrganizationUnits } from "../api/organizationUnitsApi";

export function useOrganizationUnits(organizationId: string) {
  return useQuery({
    queryKey: ["organization-units", organizationId],
    queryFn: () => getOrganizationUnits(organizationId),
    enabled: !!organizationId,
  });
}