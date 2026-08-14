import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { ROUTES } from "@/routes/routes";

export default function Topbar() {
  const { user } = useAuth();
  const { organization } = useOrganization();

  return (
    <header className="cybrez-topbar">
      <div>
        <span className="cybrez-topbar-context">
          {organization?.name ?? "Workspace"}
        </span>
      </div>

      <div className="cybrez-topbar-user">
        <Link to={ROUTES.DASHBOARD}>
          Dashboard
        </Link>

        <span className="cybrez-topbar-divider">•</span>

        <span>
          {user?.full_name ?? "User"}
        </span>
      </div>
    </header>
  );
}

