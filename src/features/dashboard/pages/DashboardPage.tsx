import DashboardStats from "../components/DashboardStats";
import RecentActivity from "../components/RecentActivity";

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

  if (isLoading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (isError) {
    return <pre>{String(error)}</pre>;
  }

  if (!data) {
    return <h2>No data.</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      <DashboardStats
        stats={data}
      />

      <RecentActivity />
    </div>
  );
}