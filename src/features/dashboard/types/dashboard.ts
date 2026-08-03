export interface DashboardStats {
  organizations: number;

  projects: number;

  active_projects: number;

  archived_projects: number;

  tasks: number;

  completed_tasks: number;

  pending_tasks: number;

  members: number;
}

export interface TasksByStatus {
  status: string;

  count: number;
}

export interface ProjectCount {
  name: string;

  count: number;
}

export interface TasksPerMonth {
  month: string;

  count: number;
}