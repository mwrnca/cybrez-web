import { NavLink, useNavigate } from "react-router-dom";

import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/contexts/useAuth";
import { ROUTES } from "@/routes/routes";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { organization } = useOrganization();
  const navigate = useNavigate();

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
    <aside className="cybrez-sidebar">
      <div className="cybrez-sidebar-brand">
        <NavLink to={ROUTES.DASHBOARD}>
          CYBREZ
        </NavLink>
      </div>

      <nav className="cybrez-sidebar-nav">
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            `cybrez-nav-item ${isActive ? "active" : ""}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to={ROUTES.ORGANIZATIONS}
          className={({ isActive }) =>
            `cybrez-nav-item ${isActive ? "active" : ""}`
          }
        >
          Organizations
        </NavLink>

        {organization && (
          <>
            <div className="cybrez-sidebar-section">
              <span>Organization</span>
              <strong>{organization.name}</strong>
            </div>

            {organizationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `cybrez-nav-item cybrez-nav-item-nested ${
                    isActive ? "active" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </>
        )}

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `cybrez-nav-item ${isActive ? "active" : ""}`
          }
        >
          Notifications
        </NavLink>
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
          Logout
        </button>
      </div>
    </aside>
  );
}

