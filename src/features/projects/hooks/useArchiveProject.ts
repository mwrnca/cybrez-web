import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { archiveProject } from "../api/projectsApi";

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveProject,

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