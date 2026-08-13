import type { RouteObject } from "react-router-dom";

import {
  CommentsPage,
  CommentPage,
  CommentsSettingsPage,
} from "./pages";

export const commentsRoutes: RouteObject[] = [
  {
    path: "tasks/:taskId/comments",
    element: <CommentsPage />,
  },
  {
    path: "comments/settings",
    element: <CommentsSettingsPage />,
  },
  {
    path: "comments/:commentId",
    element: <CommentPage />,
  },
];