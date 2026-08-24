import { useQuery } from "@tanstack/react-query";

import { getInvitations } from "../api/invitationsApi";

export function useInvitations(
  organizationId: string
) {
  return useQuery({
    queryKey: ["invitations", organizationId],
    queryFn: () =>
      getInvitations(organizationId),
    enabled: !!organizationId,
  });
}