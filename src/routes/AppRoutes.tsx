import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import OrganizationsPage from "@/features/organizations/pages/OrganizationsPage";
import OrganizationPage from "@/features/organizations/pages/OrganizationPage";

import { LoginPage, RegisterPage } from "@/features/auth/pages";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import ProjectPage from "@/features/projects/pages/ProjectPage";

import TasksPage from "@/features/tasks/pages/TasksPage";
import TaskPage from "@/features/tasks/pages/TaskPage";

import InvitationsPage from "@/features/invitations/pages/InvitationsPage";
import AcceptInvitationPage from "@/features/invitations/pages/AcceptInvitationPage";

import MembershipsPage from "@/features/memberships/pages/MembershipsPage";

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
      <Route
  path="/organizations/:organizationId/projects"
  element={
    <ProtectedRoute>
      <ProjectsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/projects/:id"
  element={
    <ProtectedRoute>
      <ProjectPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/projects/:projectId/tasks"
  element={<TasksPage />}
/>

<Route
  path="/tasks/:taskId"
  element={<TaskPage />}
/>

<Route
  path="/organizations/:organizationId/invitations"
  element={<InvitationsPage />}
/>

<Route
  path="/invitations/accept/:token"
  element={<AcceptInvitationPage />}
/>

<Route
  path="/organizations/:organizationId/members"
  element={<MembershipsPage />}
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}