type Props = {
  role: string;
};

export default function RoleBadge({
  role,
}: Props) {
  return (
    <span className="cybrez-badge" style={{ textTransform: "capitalize" }}>
      {role}
    </span>
  );
}