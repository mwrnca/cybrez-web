import { NavLink, useNavigate } from "react-router-dom";

import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/useAuth";
import { ROUTES } from "@/routes/routes";
import { useUiStore } from "@/store/uiStore";

type IconName =
  | "activity"
  | "bell"
  | "briefcase"
  | "building"
  | "chevron"
  | "dashboard"
  | "log-out"
  | "mail"
  | "users";

function SidebarIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    activity: "M3 12h4l2-7 4 14 2-7h6",
    bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
    briefcase: "M4 7h16v13H4zM9 7V4h6v3M4 12h16",
    building: "M4 21V5l8-3 8 3v16M8 9h1M15 9h1M8 13h1M15 13h1M11 21v-4h2v4",
    chevron: "m9 18 6-6-6-6",
    dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    "log-out": "M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6",
    mail: "M3 5h18v14H3zM3 7l9 6 9-6",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  };

  return (
    <svg
      aria-hidden="true"
      className="cybrez-nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function NavItem({
  to,
  label,
  icon,
  nested = false,
}: {
  to: string;
  label: string;
  icon: IconName;
  nested?: boolean;
}) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      data-tooltip={label}
      className={({ isActive }) =>
        `cybrez-nav-item ${nested ? "cybrez-nav-item-nested" : ""} ${
          isActive ? "active" : ""
        }`
      }
    >
      <SidebarIcon name={icon} />
      <span className="cybrez-nav-label">{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useUiStore(
    (state) => state.setSidebarCollapsed,
  );

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const organizationItems = organization
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
    : [];

  return (
    <aside
      className={`cybrez-sidebar ${sidebarCollapsed ? "is-collapsed" : ""}`}
      data-collapsed={sidebarCollapsed}
    >
      <div className="cybrez-sidebar-brand">
        <NavLink to={ROUTES.DASHBOARD}>
          <span className="cybrez-brand-full">CYBREZ</span>
          <span className="cybrez-brand-mark">C</span>
        </NavLink>
        <button
          type="button"
          className="cybrez-sidebar-toggle"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={sidebarCollapsed}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <SidebarIcon name="chevron" />
        </button>
      </div>

      <nav className="cybrez-sidebar-nav">
        <NavItem to={ROUTES.DASHBOARD} label="Dashboard" icon="dashboard" />
        <NavItem
          to={ROUTES.ORGANIZATIONS}
          label="Organizations"
          icon="building"
        />

        {organization && (
          <>
            <div className="cybrez-sidebar-section">
              <span>Organization</span>
              <strong>{organization.name}</strong>
            </div>

            {organizationItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={
                  item.label === "Projects"
                    ? "briefcase"
                    : item.label === "Members"
                      ? "users"
                      : item.label === "Invitations"
                        ? "mail"
                        : "activity"
                }
                nested
              />
            ))}
          </>
        )}

        <NavItem to="/notifications" label="Notifications" icon="bell" />
      </nav>

      <div className="cybrez-sidebar-footer">
        <div className="cybrez-user">
          <div className="cybrez-user-name">
            {user?.full_name ?? "User"}
          </div>

          <div className="cybrez-user-email">
            {user?.email ?? ""}
          </div>
        </div>

        <button
          type="button"
          className="cybrez-logout-button"
          onClick={handleLogout}
        >
          <SidebarIcon name="log-out" />
          <span className="cybrez-logout-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

