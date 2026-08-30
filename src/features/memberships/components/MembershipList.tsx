import type { Membership } from "../types/membership";

type Props = {
  members: Membership[];
  onRemove: (userId: string) => void;
  removing?: boolean;
  canRemove?: boolean;
};

function getAvatarInitial(name?: string | null, email?: string | null): string {
  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim().charAt(0).toUpperCase();
  }
  if (typeof email === "string" && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  return "?";
}

function getDisplayName(name?: string | null, email?: string | null): string {
  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }
  if (typeof email === "string" && email.trim().length > 0) {
    return email.trim();
  }
  return "Team Member";
}

export default function MembershipList({
  members,
  onRemove,
  removing,
  canRemove = false,
}: Props) {
  if (members.length === 0) {
    return (
      <div className="cybrez-empty-state cybrez-card">
        <div className="cybrez-empty-state-icon">
          M
        </div>

        <h3>No members yet</h3>

        <p>
          This organization currently has no
          members.
        </p>
      </div>
    );
  }

  return (
    <div className="cybrez-members-list">
      {members.map((member) => {
        const initial = getAvatarInitial(
          member.user_full_name,
          member.user_email
        );
        const displayName = getDisplayName(
          member.user_full_name,
          member.user_email
        );

        return (
          <article
            key={member.public_id}
            className="cybrez-member-card cybrez-card"
          >
            <div className="cybrez-member-info">
              <div className="cybrez-member-avatar">{initial}</div>

              <div>
                <h3>{displayName}</h3>
                <p>{member.user_email || "No email available"}</p>
              </div>
            </div>

            <div className="cybrez-member-role">
              <span>Role</span>

              <strong>
                {member.role}
              </strong>
            </div>

            {canRemove && member.role !== "owner" && (
              <button
                className="cybrez-button cybrez-button-danger"
                onClick={() =>
                  onRemove(member.user_id)
                }
                disabled={removing}
              >
                {removing
                  ? "Removing..."
                  : "Remove"}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}