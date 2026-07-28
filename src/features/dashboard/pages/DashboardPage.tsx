import { useAuth } from "@/contexts/useAuth";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>

      <p>Welcome {user?.username}</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}