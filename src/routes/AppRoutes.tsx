import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import OrganizationsPage from "@/features/organizations/pages/OrganizationsPage";
import OrganizationPage from "@/features/organizations/pages/OrganizationPage";
import { LoginPage, RegisterPage } from "@/features/auth/pages";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="/" element={<Navigate to="/organizations" replace />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
  path="/organizations"
  element={
    <ProtectedRoute>
      <OrganizationsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/organizations/:id"
  element={
    <ProtectedRoute>
      <OrganizationPage />
    </ProtectedRoute>
  }
/>

      <Route
    path="/organizations"
    element={
        <ProtectedRoute>
            <OrganizationsPage />
        </ProtectedRoute>
    }
/>

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}