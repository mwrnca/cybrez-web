import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteOrganization } from "../api/organizationsApi";

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
}