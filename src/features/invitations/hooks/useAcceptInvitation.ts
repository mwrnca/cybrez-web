import { useMutation } from "@tanstack/react-query";

import { acceptInvitation } from "../api/invitationsApi";

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: acceptInvitation,
  });
}