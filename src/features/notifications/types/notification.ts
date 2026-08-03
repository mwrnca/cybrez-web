export interface Notification {
  public_id: string;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
