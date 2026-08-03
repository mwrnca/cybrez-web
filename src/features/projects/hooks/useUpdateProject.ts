import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateProject } from "../api/projectsApi";

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) => updateProject(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}