export interface Membership {
  public_id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface CreateMembershipRequest {
  user_id: string;
  role: string;
}

export interface UpdateMembershipRoleRequest {
  role: string;
}