import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createProject } from "../api/projectsApi";

import type {
  CreateProjectRequest,
} from "@/types/project";

type CreateProjectVariables = {
  organizationId: string;
  data: CreateProjectRequest;
};

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: CreateProjectVariables) =>
      createProject(organizationId, data),

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