import { useQuery } from "@tanstack/react-query";

import { getOrganizationOverview } from "../api/organizationsApi";

export function useOrganizationOverview(
  organizationId: string
) {
  return useQuery({
    queryKey: [
      "organization-overview",
      organizationId,
    ],

    queryFn: () =>
      getOrganizationOverview(
        organizationId
      ),

    enabled: !!organizationId,
  });
}