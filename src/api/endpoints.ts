const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },

  organizations: {
    list: "/organizations/",
    create: "/organizations/",
    detail: (id: string) => `/organizations/${id}`,
    update: (id: string) => `/organizations/${id}`,
    delete: (id: string) => `/organizations/${id}`,
  },

  projects: {
    list: (organizationId: string) =>
      `/projects/organization/${organizationId}`,

    create: (organizationId: string) =>
      `/projects/${organizationId}`,

    detail: (id: string) =>
      `/projects/${id}`,

    update: (id: string) =>
      `/projects/${id}`,

    delete: (id: string) =>
      `/projects/${id}`,

    restore: (id: string) =>
      `/projects/${id}/restore`,

    archive: (id: string) =>
      `/projects/${id}/archive`,

    unarchive: (id: string) =>
      `/projects/${id}/unarchive`,
  },

  tasks: {
    list: (projectId: string) =>
      `/projects/${projectId}/tasks`,

    create: (projectId: string) =>
      `/projects/${projectId}/tasks`,

    detail: (taskId: string) =>
      `/projects/tasks/${taskId}`,

    update: (taskId: string) =>
      `/projects/tasks/${taskId}`,

    delete: (
      projectId: string,
      taskId: string
    ) =>
      `/projects/${projectId}/tasks/${taskId}`,

    restore: (taskId: string) =>
      `/projects/tasks/${taskId}/restore`,

    archive: (taskId: string) =>
      `/projects/tasks/${taskId}/archive`,

    unarchive: (taskId: string) =>
      `/projects/tasks/${taskId}/unarchive`,
  },

  invitations: {
    create: (organizationId: string) =>
      `/invitations/${organizationId}/invite`,

    accept: (token: string) =>
      `/invitations/accept/${token}`,

    delete: (id: string) =>
      `/invitations/${id}`,

    resend: (id: string) =>
      `/invitations/${id}/resend`,
  },

  memberships: {
    list: (organizationId: string) =>
      `/organizations/${organizationId}/members`,

    create: (organizationId: string) =>
      `/organizations/${organizationId}/members`,

    update: (
      organizationId: string,
      userId: number
    ) =>
      `/organizations/${organizationId}/members/${userId}`,

    delete: (
      organizationId: string,
      userId: number
    ) =>
      `/organizations/${organizationId}/members/${userId}`,

    leave: (organizationId: string) =>
      `/organizations/${organizationId}/leave`,
  },

  dashboard: {
    stats: "/dashboard/stats",

    tasksByStatus:
      "/dashboard/tasks-by-status",

    projectCounts:
      "/dashboard/project-counts",

    tasksPerMonth:
      "/dashboard/tasks-per-month",
  },

  users: {
    me: "/users/me",
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
  },
};

export default ENDPOINTS;