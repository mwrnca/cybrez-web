import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";

import type {
  Membership,
  CreateMembershipRequest,
  UpdateMembershipRoleRequest,
} from "../types/membership";

export async function getMembers(
  organizationId: string
) {
  const response = await api.get<Membership[]>(
    ENDPOINTS.memberships.list(
      organizationId
    )
  );

  return response.data;
}

export async function addMember(
  organizationId: string,
  data: CreateMembershipRequest
) {
  const response = await api.post<Membership>(
    ENDPOINTS.memberships.create(
      organizationId
    ),
    data
  );

  return response.data;
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  data: UpdateMembershipRoleRequest
) {
  const response = await api.patch<Membership>(
    ENDPOINTS.memberships.update(
      organizationId,
      userId
    ),
    data
  );

  return response.data;
}

export async function removeMember(
  organizationId: string,
  userId: string
) {
  await api.delete(
    ENDPOINTS.memberships.delete(
      organizationId,
      userId
    )
  );
}

export async function leaveOrganization(
  organizationId: string
) {
  await api.delete(
    ENDPOINTS.memberships.leave(
      organizationId
    )
  );
}