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
    <div className="cybrez-page">
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {/* HEADER */}
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">Team Growth</span>
            <h1>Invitations</h1>
            <p>Invite new members and collaborators to this organization.</p>
          </div>
        </header>

        {/* INVITATION FORM */}
        <section>
          <InvitationForm
            loading={createInvitation.isPending}
            onSubmit={async (data) => {
              await createInvitation.mutateAsync({
                organizationId: organizationId!,
                data,
              });
            }}
          />
        </section>

        {/* INVITATION INFO / NOTICE */}
        <section className="cybrez-card" style={{ padding: "var(--space-5)" }}>
          <h3 style={{ fontSize: "var(--font-size-md)", marginBottom: "var(--space-2)" }}>
            About Organization Invitations
          </h3>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", lineHeight: 1.6 }}>
            Invited users will receive a link to join this workspace. Only organization owners and administrators can invite new members. Once accepted, new members can view and collaborate on organization projects according to their assigned role.
          </p>
        </section>
      </div>
    </div>
  );
}