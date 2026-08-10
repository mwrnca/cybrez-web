import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteProject } from "../api/projectsApi";

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

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