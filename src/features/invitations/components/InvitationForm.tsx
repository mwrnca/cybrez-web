import { useState } from "react";

import type { CreateInvitationRequest } from "../types/invitation";

type Props = {
  loading?: boolean;

  onSubmit: (
    data: CreateInvitationRequest
  ) => Promise<void>;
};

export default function InvitationForm({
  loading,
  onSubmit,
}: Props) {
  const [email, setEmail] = useState("");

  const [role, setRole] = useState("member");

  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setSuccess(false);

    await onSubmit({
      email,
      role,
    });

    setEmail("");
    setRole("member");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <form onSubmit={handleSubmit} className="cybrez-organization-form cybrez-card">
      <div className="cybrez-form-header">
        <span className="cybrez-badge">New invitation</span>
        <h2>Invite Team Member</h2>
        <p>Send an invitation to join your organization with an assigned role.</p>
      </div>

      {success && (
        <div
          style={{
            padding: "var(--space-3)",
            background: "var(--color-success-soft)",
            color: "var(--color-success)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          Invitation sent successfully!
        </div>
      )}

      <div className="cybrez-form-fields">
        <div className="cybrez-form-field">
          <span>Email Address</span>
          <input
            className="cybrez-input"
            placeholder="colleague@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="cybrez-form-field">
          <span>Organization Role</span>
          <select
            className="cybrez-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer (Read-only)</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="cybrez-form-actions">
        <button
          type="submit"
          className="cybrez-button cybrez-button-primary"
          disabled={loading || !email.trim()}
        >
          {loading ? "Sending..." : "Send Invitation"}
        </button>
      </div>
    </form>
  );
}