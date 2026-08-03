import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "@/components/AppShell";

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

import ActivityLogPage from "@/features/activity-log/pages/ActivityLogPage";
import { CommentsPage, CommentPage } from "@/features/comments/pages";
import NotificationsPage from "@/features/notifications/pages";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
            <AppShell>
              <OrganizationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizations/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <OrganizationPage />
            </AppShell>
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
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="/projects" element={<Navigate to="/organizations" replace />} />
      <Route path="/tasks" element={<Navigate to="/dashboard" replace />} />
      <Route path="/comments" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppShell>
              <NotificationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizations/:organizationId/projects"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProjectsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProjectPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/tasks"
        element={
          <ProtectedRoute>
            <AppShell>
              <TasksPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:taskId"
        element={
          <ProtectedRoute>
            <AppShell>
              <TaskPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizations/:organizationId/invitations"
        element={
          <ProtectedRoute>
            <AppShell>
              <InvitationsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/invitations/accept/:token"
        element={
          <GuestRoute>
            <AcceptInvitationPage />
          </GuestRoute>
        }
      />

      <Route
        path="/organizations/:organizationId/members"
        element={
          <ProtectedRoute>
            <AppShell>
              <MembershipsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizations/:organizationId/activity-log"
        element={
          <ProtectedRoute>
            <AppShell>
              <ActivityLogPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/:taskId/comments"
        element={
          <ProtectedRoute>
            <AppShell>
              <CommentsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/comments/:commentId"
        element={
          <ProtectedRoute>
            <AppShell>
              <CommentPage />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}