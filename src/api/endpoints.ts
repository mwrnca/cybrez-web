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
    list: "/projects",
    create: "/projects",
    detail: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },

  tasks: {
    list: "/tasks",
    create: "/tasks",
    detail: (id: string) => `/tasks/${id}`,
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
  },

  invitations: {
    list: "/invitations",
    create: "/invitations",
    detail: (id: string) => `/invitations/${id}`,
    accept: (id: string) => `/invitations/${id}/accept`,
    decline: (id: string) => `/invitations/${id}/decline`,
    delete: (id: string) => `/invitations/${id}`,
  },

  memberships: {
    list: "/memberships",
    detail: (id: string) => `/memberships/${id}`,
    update: (id: string) => `/memberships/${id}`,
    delete: (id: string) => `/memberships/${id}`,
  },

  users: {
    me: "/users/me",
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
  },
};

export default ENDPOINTS;