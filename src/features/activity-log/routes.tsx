import { Route } from "react-router-dom";

import ActivityLogPage from "./pages/ActivityLogPage";

export const activityLogRoutes = (
  <Route
    path="/organizations/:organizationId/activity-log"
    element={<ActivityLogPage />}
  />
);