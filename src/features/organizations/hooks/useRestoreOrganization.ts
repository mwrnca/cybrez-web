import { useMutation, useQueryClient } from "@tanstack/react-query";

import { restoreOrganization } from "../api/organizationsApi";

export function useRestoreOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreOrganization,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
}