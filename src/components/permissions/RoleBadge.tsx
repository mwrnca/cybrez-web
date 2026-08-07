type Props = {
  role: string;
};

export default function RoleBadge({
  role,
}: Props) {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        background: "#eef2ff",
        color: "#3730a3",
        fontSize: "0.8rem",
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {role}
    </span>
  );
}