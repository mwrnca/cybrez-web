import { Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";

export default function DashboardRoutes() {
  return (
    <Route
      path="/dashboard"
      element={<DashboardPage />}
    />
  );
}