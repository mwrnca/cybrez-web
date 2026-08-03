import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateMemberRole } from "../api/membershipsApi";

export function useUpdateMemberRole() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
      data,
    }: {
      organizationId: string;

      userId: number;

      data: {
        role: string;
      };
    }) =>
      updateMemberRole(
        organizationId,
        userId,
        data
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