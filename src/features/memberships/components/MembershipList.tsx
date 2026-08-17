import type { Membership } from "../types/membership";

type Props = {
  members: Membership[];
  onRemove: (userId: string) => void;
  removing?: boolean;
};

export default function MembershipList({
  members,
  onRemove,
  removing,
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
      {members.map((member) => (
        <article
          key={member.public_id}
          className="cybrez-member-card cybrez-card"
        >
          <div className="cybrez-member-info">
            <div className="cybrez-member-avatar">
              {member.user_id
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3>
                User {member.user_id}
              </h3>

              <p>
                Member ID:{" "}
                {member.public_id}
              </p>
            </div>
          </div>

          <div className="cybrez-member-role">
            <span>Role</span>

            <strong>
              {member.role}
            </strong>
          </div>

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
        </article>
      ))}
    </div>
  );
}