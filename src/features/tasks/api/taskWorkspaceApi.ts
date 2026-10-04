import api from "@/lib/axios";

export interface WorkspaceOrganization {
  public_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

export interface WorkspaceProject {
  public_id: string;
  name: string;
  description: string | null;
}

export interface WorkspaceUnit {
  public_id: string;
  name: string;
  description: string | null;
  parent_unit_id: string | null;
}

export interface WorkspacePerson {
  public_id: string;
  full_name: string;
}

export interface WorkspaceActivity {
  public_id: string;
  organization_public_id: string;
  user_public_id: string | null;
  action: string;
  target_type: string;
  target_public_id: string | null;
  description: string;
  created_at: string;
}

export interface TaskWorkspace {
  task_public_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  is_archived: boolean;
  project: WorkspaceProject;
  organization: WorkspaceOrganization;
  project_completed: boolean;
  workspace_blocks: Record<string, unknown>[] | null;
  organization_unit: WorkspaceUnit | null;
  organization_units: WorkspaceUnit[];
  assignee: WorkspacePerson | null;
  tools: Record<string, unknown>[];
  activity: WorkspaceActivity[];
}

export async function getTaskWorkspace(
  taskId: string
): Promise<TaskWorkspace> {
  const response = await api.get<TaskWorkspace>(
    `/tasks/${taskId}/workspace`
  );

  return response.data;
}