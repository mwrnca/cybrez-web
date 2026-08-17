export interface Invitation {
  public_id: string;

  organization_id: string;

  email: string;

  role: string;

  token: string;

  accepted: boolean;

  expires_at: string;

  created_at: string;
}

export interface CreateInvitationRequest {
  email: string;

  role: string;
}