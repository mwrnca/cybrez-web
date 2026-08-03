import { useMutation } from "@tanstack/react-query";

import { createInvitation } from "../api/invitationsApi";

export function useCreateInvitation() {
  return useMutation({
    mutationFn: ({
      organizationId,
      data,
    }: {
      organizationId: string;
      data: {
        email: string;
        role: string;
      };
    }) =>
      createInvitation(
        organizationId,
        data
      ),
  });
}