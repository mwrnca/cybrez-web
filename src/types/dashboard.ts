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

export interface StatusCount {
  status: string;
  count: number;
}

export interface ProjectCount {
  status: string;
  count: number;
}

export interface TasksPerMonth {
  month: string;
  count: number;
}