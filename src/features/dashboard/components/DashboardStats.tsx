import type { DashboardStats as DashboardStatsType } from "../types/dashboard";

type Props = {
  stats: DashboardStatsType;
};

export default function DashboardStats({
  stats,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.25rem",
      }}
    >
      <StatCard
        title="Organizations"
        value={stats.organizations}
        accent="gold"
      />

      <StatCard
        title="Projects"
        value={stats.projects}
        accent="gold"
      />

      <StatCard
        title="Active Projects"
        value={stats.active_projects}
        accent="green"
      />

      <StatCard
        title="Archived Projects"
        value={stats.archived_projects}
        accent="muted"
      />

      <StatCard
        title="Tasks"
        value={stats.tasks}
        accent="gold"
      />

      <StatCard
        title="Completed Tasks"
        value={stats.completed_tasks}
        accent="green"
      />

      <StatCard
        title="Pending Tasks"
        value={stats.pending_tasks}
        accent="orange"
      />

      <StatCard
        title="Members"
        value={stats.members}
        accent="gold"
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  accent: "gold" | "green" | "orange" | "muted";
};

function StatCard({
  title,
  value,
  accent,
}: StatCardProps) {
  const accentColor = {
    gold: "#d4af37",
    green: "#22c55e",
    orange: "#f59e0b",
    muted: "#6b7280",
  }[accent];

  return (
    <div
      style={{
        position: "relative",

        padding: "1.5rem",

        background:
          "linear-gradient(145deg, #15181e 0%, #101217 100%)",

        border: "1px solid #d4af37",

        borderRadius: "12px",

        boxShadow:
          "0 0 0 1px rgba(212, 175, 55, 0.08), 0 0 18px rgba(212, 175, 55, 0.06)",

        transition:
          "border-color 180ms ease, box-shadow 180ms ease, background 180ms ease, transform 180ms ease",

        overflow: "hidden",
      }}
      onMouseEnter={(event) => {
        const card = event.currentTarget;

        card.style.borderColor = accentColor;

        card.style.background =
          `linear-gradient(145deg, ${accentColor}12 0%, #101217 55%, #15181e 100%)`;

        card.style.boxShadow =
          `0 0 0 1px ${accentColor}22, 0 0 24px ${accentColor}22, inset 0 0 24px ${accentColor}08`;

        card.style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(event) => {
        const card = event.currentTarget;

        card.style.borderColor =
          "#d4af37";

        card.style.background =
          "linear-gradient(145deg, #15181e 0%, #101217 100%)";

        card.style.boxShadow =
          "0 0 0 1px rgba(212, 175, 55, 0.08), 0 0 18px rgba(212, 175, 55, 0.06)";

        card.style.transform =
          "translateY(0)";
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,

            color: "#a7afbd",

            fontSize: "1rem",

            fontWeight: 600,

            letterSpacing: "0.01em",
          }}
        >
          {title}
        </h3>

        <div
          style={{
            marginTop: "1.75rem",

            color: "#ffffff",

            fontSize: "2.5rem",

            lineHeight: 1,

            fontWeight: 700,

            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

