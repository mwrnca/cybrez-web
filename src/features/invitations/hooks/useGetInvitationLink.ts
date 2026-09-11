import { useMutation } from "@tanstack/react-query";

import { getInvitationLink } from "../api/invitationsApi";

export function useGetInvitationLink() {
  return useMutation({
    mutationFn: getInvitationLink,
  });
}