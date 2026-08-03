import { useMutation } from "@tanstack/react-query";

import { deleteInvitation } from "../api/invitationsApi";

export function useDeleteInvitation() {
  return useMutation({
    mutationFn: deleteInvitation,
  });
}