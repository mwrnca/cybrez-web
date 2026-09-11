export interface ActivityLog {
  public_id: string;

  organization_id: number;

  user_id: number | null;

  action: string;

  target_type: string;

  target_public_id: string | null;

  description: string;

  created_at: string;
}