import { useQuery } from "@tanstack/react-query";

import { getProject } from "../api/projectsApi";
import type { Project } from "@/types/project";

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}