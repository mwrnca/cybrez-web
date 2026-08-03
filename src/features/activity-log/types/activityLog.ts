export interface ActivityLog {
  public_id: string;

  organization_id: number;

  user_id: number | null;

  action: string;

  target_type: string;

  target_id: number | null;

  description: string;

  created_at: string;
}