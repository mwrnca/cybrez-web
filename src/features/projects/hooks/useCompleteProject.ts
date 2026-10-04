import { useMutation, useQueryClient } from "@tanstack/react-query";

import { completeProject } from "../api/projectsApi";
import type { ProjectWorkspaceSnapshotEntry } from "@/types/project";

export function useCompleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      workspaces,
    }: {
      projectId: string;
      workspaces: ProjectWorkspaceSnapshotEntry[];
    }) => completeProject(projectId, workspaces),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", project.public_id] });
      queryClient.invalidateQueries({ queryKey: ["tasks", project.public_id] });
      queryClient.invalidateQueries({ queryKey: ["task-workspace"] });
    },
  });
}