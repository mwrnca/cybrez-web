import { RouteObject } from "react-router-dom";

import { CommentsPage, CommentPage, CommentsSettingsPage } from "./pages";

export const commentsRoutes: RouteObject[] = [
  {
    path: "comments",
    element: <CommentsPage />,
  },
  {
    path: "comments/:commentId",
    element: <CommentPage />,
  },
  {
    path: "comments/settings",
    element: <CommentsSettingsPage />,
  },
];
