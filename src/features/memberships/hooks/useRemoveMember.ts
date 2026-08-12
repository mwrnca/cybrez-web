import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { removeMember } from "../api/membershipsApi";

export function useRemoveMember() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
    }: {
      organizationId: string;

      userId: string;
    }) =>
      removeMember(
        organizationId,
        userId
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "memberships",
          variables.organizationId,
        ],
      });
    },
  });
}
