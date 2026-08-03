export interface Membership {
  public_id: string;

  organization_id: number;

  user_id: number;

  role: string;

  created_at: string;
}

export interface CreateMembershipRequest {
  user_id: number;

  role: string;
}

export interface UpdateMembershipRoleRequest {
  role: string;
}