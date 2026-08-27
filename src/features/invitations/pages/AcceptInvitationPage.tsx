import { useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import { useAcceptInvitation } from "../hooks";

export default function AcceptInvitationPage() {
  const { token } = useParams();
  const { authenticated, loading } = useAuth();

  const acceptInvitation = useAcceptInvitation();

  const attempted = useRef(false);

  useEffect(() => {
    if (
      authenticated &&
      token &&
      !attempted.current &&
      acceptInvitation.isIdle
    ) {
      attempted.current = true;
      acceptInvitation.mutate(token);
    }
  }, [authenticated, token, acceptInvitation]);

  const redirectParam = `?redirect=${encodeURIComponent(
    `/invitations/accept/${token}`
  )}`;

  if (loading) {
    return (
      <div
        className="cybrez-app-shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div className="cybrez-loading-indicator" />
      </div>
    );
  }

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
        <span
          className="cybrez-badge"
          style={{ marginBottom: "var(--space-2)" }}
        >
          Workspace Invitation
        </span>

        <h1
          style={{
            fontSize: "var(--font-size-2xl)",
            marginTop: "var(--space-2)",
          }}
        >
          Join Organization
        </h1>

        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--font-size-sm)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-6)",
          }}
        >
          You have been invited to collaborate on a workspace in{" "}
          <span className="cybrez-gold">CYBREZ</span>.
          {authenticated
            ? " Accepting the invitation now..."
            : " Create an account or sign in to accept."}
        </p>

        {!authenticated && (
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Link
              to={`/register${redirectParam}`}
              className="cybrez-button cybrez-button-primary"
              style={{ textDecoration: "none" }}
            >
              Create Account &amp; Join
            </Link>

            <Link
              to={`/login${redirectParam}`}
              className="cybrez-button cybrez-button-secondary"
              style={{ textDecoration: "none" }}
            >
              Already have an account? Sign in
            </Link>
          </div>
        )}

        {authenticated && acceptInvitation.isPending && (
          <div
            className="cybrez-loading-indicator"
            style={{ margin: "0 auto" }}
          />
        )}

        {authenticated && acceptInvitation.isSuccess && (
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
              to="/dashboard"
              className="cybrez-button cybrez-button-primary"
              style={{ textDecoration: "none" }}
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {authenticated && acceptInvitation.isError && (
          <div style={{ display: "grid", gap: "var(--space-4)" }}>
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
              {(() => {
                const err = acceptInvitation.error as
                  | { response?: { data?: { detail?: string } } }
                  | undefined;

                return (
                  err?.response?.data?.detail ??
                  "Failed to accept invitation. The invitation link may have expired or is invalid."
                );
              })()}
            </div>

            <button
              className="cybrez-button cybrez-button-secondary"
              onClick={() => {
                attempted.current = false;
                acceptInvitation.reset();
              }}
            >
              Try Again
            </button>

            <p
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--color-text-subtle)",
                marginTop: "var(--space-2)",
              }}
            >
              <Link to="/login" style={{ color: "var(--color-primary)" }}>
                Sign in with a different account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}