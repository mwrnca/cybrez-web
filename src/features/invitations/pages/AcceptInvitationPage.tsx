import { Link, useParams } from "react-router-dom";

import {
  useAcceptInvitation,
} from "../hooks";

export default function AcceptInvitationPage() {
  const { token } = useParams();

  const acceptInvitation =
    useAcceptInvitation();

  return (
    <div
      className="cybrez-app-shell"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--space-4)",
      }}
    >
      <div
        className="cybrez-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "var(--space-8)",
          textAlign: "center",
        }}
      >
        <span className="cybrez-badge" style={{ marginBottom: "var(--space-2)" }}>
          Workspace Invitation
        </span>

        <h1 style={{ fontSize: "var(--font-size-2xl)", marginTop: "var(--space-2)" }}>
          Join Organization
        </h1>

        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", marginTop: "var(--space-2)", marginBottom: "var(--space-6)" }}>
          You have been invited to collaborate on a workspace in <span className="cybrez-gold">CYBREZ</span>. Click below to accept the invitation and activate your membership.
        </p>

        {acceptInvitation.isSuccess ? (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            <div
              style={{
                padding: "var(--space-4)",
                background: "var(--color-success-soft)",
                color: "var(--color-success)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              🎉 Invitation accepted successfully! You are now a member.
            </div>

            <Link
              to="/login"
              className="cybrez-button cybrez-button-primary"
              style={{ textDecoration: "none" }}
            >
              Proceed to Login
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
            {acceptInvitation.isError && (
              <div
                style={{
                  padding: "var(--space-3)",
                  background: "var(--color-danger-soft)",
                  color: "var(--color-danger)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                Failed to accept invitation. The invitation link may have expired or is invalid.
              </div>
            )}

            <button
              className="cybrez-button cybrez-button-primary"
              onClick={() => acceptInvitation.mutate(token!)}
              disabled={acceptInvitation.isPending || !token}
              style={{ width: "100%" }}
            >
              {acceptInvitation.isPending ? "Accepting..." : "Accept Invitation"}
            </button>

            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-subtle)", marginTop: "var(--space-2)" }}>
              Already registered? <Link to="/login" style={{ color: "var(--color-primary)" }}>Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}