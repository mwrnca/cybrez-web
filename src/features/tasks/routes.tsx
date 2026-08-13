import type { RouteObject } from "react-router-dom";

import {
  TasksPage,
  TaskPage,
  TasksSettingsPage,
} from "./pages";

export const tasksRoutes: RouteObject[] = [
  {
    path: "projects/:projectId/tasks",
    element: <TasksPage />,
  },
  {
    path: "tasks/:taskId",
    element: <TaskPage />,
  },
  {
    path: "tasks/settings",
    element: <TasksSettingsPage />,
  },
];