import PageState from "@/components/PageState";

import {
  DashboardStats,
  RecentActivity,
  TasksByStatusCard,
  ProjectCountsCard,
  TasksPerMonthCard,
} from "../components";

import {
  useDashboardStats,
  useTasksByStatus,
  useProjectCounts,
  useTasksPerMonth,
} from "../hooks";

export default function DashboardPage() {
  const stats = useDashboardStats();

  const tasksByStatus =
    useTasksByStatus();

  const projectCounts =
    useProjectCounts();

  const tasksPerMonth =
    useTasksPerMonth();

  return (
    <PageState
      loading={stats.isLoading}
      error={
        stats.isError
          ? stats.error
          : undefined
      }
      empty={!stats.data}
      loadingMessage="Loading dashboard..."
      emptyMessage="No dashboard data available yet."
    >
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <div>
          <h1>Dashboard</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "0.35rem",
            }}
          >
            Keep your workspace moving from a single view.
          </p>
        </div>

        <DashboardStats
          stats={stats.data!}
        />

        <TasksByStatusCard
          data={
            tasksByStatus.data ?? []
          }
        />

        <ProjectCountsCard
          data={
            projectCounts.data ?? []
          }
        />

        <TasksPerMonthCard
          data={
            tasksPerMonth.data ?? []
          }
        />

        <RecentActivity />
      </div>
    </PageState>
  );
}