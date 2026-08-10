import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { unarchiveProject } from "../api/projectsApi";

export function useUnarchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveProject,

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