import { useParams } from "react-router-dom";

import InvitationForm from "../components/InvitationForm";

import {
  useCreateInvitation,
} from "../hooks";

export default function InvitationsPage() {
  const { organizationId } = useParams();

  const createInvitation =
    useCreateInvitation();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Invitations</h1>

      <InvitationForm
        loading={createInvitation.isPending}
        onSubmit={async (data) => {
          await createInvitation.mutateAsync({
            organizationId:
              organizationId!,
            data,
          });
        }}
      />
    </div>
  );
}