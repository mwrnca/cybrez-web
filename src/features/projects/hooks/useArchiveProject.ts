import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { archiveProject } from "../api/projectsApi";

export function useArchiveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}