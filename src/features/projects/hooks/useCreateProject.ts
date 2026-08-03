import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createProject } from "../api/projectsApi";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: any;
    }) =>
      createProject(
        organizationId,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "projects",
          variables.organizationId,
        ],
      });
    },
  });
}