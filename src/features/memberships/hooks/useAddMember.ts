import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { addMember } from "../api/membershipsApi";

export function useAddMember() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;

      data: {
        user_id: string;
        role: string;
      };
    }) =>
      addMember(
        organizationId,
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