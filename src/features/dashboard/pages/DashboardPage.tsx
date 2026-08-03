import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";
import PageState from "@/components/PageState";

import {
  useDashboardStats,
} from "../hooks";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useDashboardStats();

  return (
    <PageState
      loading={isLoading}
      error={isError ? error : undefined}
      empty={!data}
      loadingMessage="Loading dashboard..."
      emptyMessage="No dashboard data available yet."
    >
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: "#6b7280", marginTop: "0.35rem" }}>
            Keep your workspace moving from a single view.
          </p>
        </div>

        <DashboardStats stats={data!} />

        <RecentActivity />
      </div>
    </PageState>
  );
}