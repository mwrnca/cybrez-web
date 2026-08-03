import { useMutation } from "@tanstack/react-query";

import { resendInvitation } from "../api/invitationsApi";

export function useResendInvitation() {
  return useMutation({
    mutationFn: resendInvitation,
  });
}