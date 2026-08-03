import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { restoreProject } from "../api/projectsApi";

export function useRestoreProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}