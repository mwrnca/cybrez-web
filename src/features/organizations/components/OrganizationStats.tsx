import type { OrganizationStats as Stats } from "../types/organizationOverview";

type Props = {
  stats: Stats;
};

export default function OrganizationStats({
  stats,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill, minmax(220px,1fr))",
        gap: "1rem",
      }}
    >
      <Card title="Projects" value={stats.projects} />

      <Card
        title="Active Projects"
        value={stats.active_projects}
      />

      <Card
        title="Archived Projects"
        value={stats.archived_projects}
      />

      <Card
        title="Tasks"
        value={stats.tasks}
      />

      <Card
        title="Completed Tasks"
        value={stats.completed_tasks}
      />

      <Card
        title="Pending Tasks"
        value={stats.pending_tasks}
      />

      <Card
        title="Members"
        value={stats.members}
      />

      <Card
        title="Invitations"
        value={stats.invitations}
      />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <h3>{title}</h3>

      <h2>{value}</h2>
    </div>
  );
}