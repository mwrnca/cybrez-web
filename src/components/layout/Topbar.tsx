import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { ROUTES } from "@/routes/routes";

import BackBtn from "../common/backBtn";
import { useUiStore, type Density } from "@/store/uiStore";

export default function Topbar() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const density = useUiStore((state) => state.density);
  const setDensity = useUiStore((state) => state.setDensity);

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

        <label className="cybrez-density-control">
          <span className="cybrez-density-label">Density</span>
          <select
            aria-label="Interface density"
            value={density}
            onChange={(event) => setDensity(event.target.value as Density)}
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </label>

        <BackBtn />
      </div>
    </header>
  );
}

