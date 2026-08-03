import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Invitation,
  CreateInvitationRequest,
} from "../types/invitation";

export async function createInvitation(
  organizationId: string,
  data: CreateInvitationRequest
) {
  const response = await api.post<Invitation>(
    ENDPOINTS.invitations.create(
      organizationId
    ),
    data
  );

  return response.data;
}

export async function acceptInvitation(
  token: string
) {
  const response = await api.post(
    ENDPOINTS.invitations.accept(token)
  );

  return response.data;
}

export async function deleteInvitation(
  invitationId: string
) {
  await api.delete(
    ENDPOINTS.invitations.delete(
      invitationId
    )
  );
}

export async function resendInvitation(
  invitationId: string
) {
  const response = await api.post<Invitation>(
    ENDPOINTS.invitations.resend(
      invitationId
    )
  );

  return response.data;
}