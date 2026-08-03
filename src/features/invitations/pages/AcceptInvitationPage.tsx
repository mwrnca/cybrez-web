import { useParams } from "react-router-dom";

import {
  useAcceptInvitation,
} from "../hooks";

export default function AcceptInvitationPage() {
  const { token } = useParams();

  const acceptInvitation =
    useAcceptInvitation();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Accept Invitation</h1>

      <button
        onClick={() =>
          acceptInvitation.mutate(
            token!
          )
        }
      >
        Accept Invitation
      </button>

      {acceptInvitation.isSuccess && (
        <p>Invitation accepted.</p>
      )}
    </div>
  );
}