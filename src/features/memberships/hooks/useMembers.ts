import { useQuery } from "@tanstack/react-query";

import { getMembers } from "../api/membershipsApi";

export function useMembers(
  organizationId: string
) {
  return useQuery({
    queryKey: [
      "memberships",
      organizationId,
    ],

    queryFn: () =>
      getMembers(organizationId),

    enabled: !!organizationId,
  });
}