export interface Notification {
  public_id: string;
  user_public_id: string;
  title: string;
  message: string;
  type?: string | null;
  reference_id?: string | null;
  is_read: boolean;
  created_at: string;
}