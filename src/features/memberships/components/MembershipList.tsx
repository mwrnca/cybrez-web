import type { Membership } from "../types/membership";

type Props = {
  members: Membership[];

  onRemove: (userId: string) => void;
};

export default function MembershipList({
  members,
  onRemove,
}: Props) {
  if (members.length === 0) {
    return <p>No members.</p>;
  }

  return (
    <>
      {members.map((member) => (
        <div
          key={member.public_id}
          style={{
            border: "1px solid gray",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p>
            <strong>User ID:</strong>{" "}
            {member.user_id}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {member.role}
          </p>

          <button
            onClick={() =>
              onRemove(member.user_id)
            }
          >
            Remove
          </button>
        </div>
      ))}
    </>
  );
}