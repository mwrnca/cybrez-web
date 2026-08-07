import { Link, NavLink, useNavigate } from "react-router-dom";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/useAuth";
import { ROUTES } from "@/routes/routes";

type Props = {
  children: React.ReactNode;
};




export default function AppShell({ children }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
const { organization } = useOrganization();

const navItems = [
  {
    to: ROUTES.DASHBOARD,
    label: "Dashboard",
  },
  {
    to: ROUTES.ORGANIZATIONS,
    label: "Organizations",
  },
  ...(organization
    ? [
        {
          to: `/organizations/${organization.public_id}/projects`,
          label: "Projects",
        },
        {
          to: `/organizations/${organization.public_id}/members`,
          label: "Members",
        },
        {
          to: `/organizations/${organization.public_id}/invitations`,
          label: "Invitations",
        },
        {
          to: `/organizations/${organization.public_id}/activity-log`,
          label: "Activity Log",
        },
      ]
    : []),
  {
    to: "/notifications",
    label: "Notifications",
  },
];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f8" }}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: 260,
            background: "#111827",
            color: "white",
            padding: "1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            CYBREZ
          </div>

          <nav style={{ display: "grid", gap: "0.5rem" }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  color: isActive ? "#f9fafb" : "#d1d5db",
                  textDecoration: "none",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "8px",
                  background: isActive ? "#374151" : "transparent",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ marginTop: "auto" }}>
            <div style={{ fontSize: "0.9rem", color: "#d1d5db" }}>
              {user?.email ?? "Signed in"}
            </div>
            <button onClick={handleLogout} style={{ marginTop: "0.75rem" }}>
              Logout
            </button>
          </div>
        </aside>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <header
            style={{
              background: "white",
              borderBottom: "1px solid #e5e7eb",
              padding: "1rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 600 }}>Workspace</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
              <span style={{ color: "#6b7280" }}>•</span>
              <span>{user?.username ?? "User"}</span>
            </div>
          </header>

          <main style={{ padding: "1.5rem" }}>{children}</main>
        </div>
      </div>
    </div>
  );
}
