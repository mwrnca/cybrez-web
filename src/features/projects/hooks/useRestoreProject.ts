import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { restoreProject } from "../api/projectsApi";

export function useRestoreProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreProject,

    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
    },
  });
}