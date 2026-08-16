import PageState from "@/components/PageState";

import {
  DashboardStats,
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

  const tasksByStatus = useTasksByStatus();
  const projectCounts = useProjectCounts();
  const tasksPerMonth = useTasksPerMonth();

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
      <div className="cybrez-dashboard">
        <header className="cybrez-dashboard-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Keep your workspace moving from a
              single view.
            </p>
          </div>
        </header>

        <DashboardStats
          stats={stats.data!}
        />

        <div
          className="cybrez-dashboard-grid"
        >
          <TasksByStatusCard
            data={tasksByStatus.data ?? []}
          />

          <ProjectCountsCard
            data={projectCounts.data ?? []}
          />
        </div>

        <TasksPerMonthCard
          data={tasksPerMonth.data ?? []}
        />
      </div>
    </PageState>
  );
}