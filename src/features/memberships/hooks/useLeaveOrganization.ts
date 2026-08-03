import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { leaveOrganization } from "../api/membershipsApi";

export function useLeaveOrganization() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      organizationId: string
    ) =>
      leaveOrganization(
        organizationId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "memberships",
        ],
      });
    },
  });
}