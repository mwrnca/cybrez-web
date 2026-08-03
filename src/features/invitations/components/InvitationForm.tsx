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

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await onSubmit({
      email,
      role,
    });

    setEmail("");
    setRole("member");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
      >
        <option value="member">
          Member
        </option>

        <option value="manager">
          Manager
        </option>
      </select>

      <br />
      <br />

      <button
        type="submit"
        disabled={loading}
      >
        Send Invitation
      </button>
    </form>
  );
}