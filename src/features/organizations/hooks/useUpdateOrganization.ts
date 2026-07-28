import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrganization } from "../api/organizationsApi";

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) => updateOrganization(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
}