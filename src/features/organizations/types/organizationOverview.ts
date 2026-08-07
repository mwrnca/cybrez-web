import type { ActivityLog } from "@/features/activity-log/types/activityLog";
import type { Organization } from "@/types/organization";

export interface OrganizationStats {
  projects: number;
  active_projects: number;
  archived_projects: number;
  tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  members: number;
  invitations: number;
}

export interface OrganizationOverview {
  organization: Organization;
  stats: OrganizationStats;
  recent_activity: ActivityLog[];
}