import { useQuery } from "@tanstack/react-query";

import { getProjects } from "../api/projectsApi";
import type { Project } from "@/types/project";

export function useProjects(
  organizationId: string
) {
  return useQuery<Project[]>({
    queryKey: ["projects", organizationId],
    queryFn: () => getProjects(organizationId),
    enabled: !!organizationId,
  });
}