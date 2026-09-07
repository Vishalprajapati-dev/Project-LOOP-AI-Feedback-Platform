const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
async function request(endpoint, options = {}, retry = true) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",

    headers: {
      "Content-Type": "application/json",

      ...(options.headers || {}),
    },

    ...options,
  });

  const data = await response.json().catch(() => ({}));

  /*
   * Access token expired.
   *
   * Try refreshing once.
   */
  if (
    response.status === 401 &&
    retry &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/register") &&
    !endpoint.includes("/auth/refresh")
  ) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        return request(endpoint, options, false);
      }
    } catch {
      // Continue to original error
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

/* =========================
   AUTH API
========================= */

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  me: () =>
    request("/auth/me", {
      method: "GET",
    }),
};

export const dashboardApi = {
  overview: () =>
    request("/dashboard/overview", {
      method: "GET",
    }),
};

export const analyticsApi = {
  overview: (range = "Last 30 Days") =>
    request(`/analytics/overview?range=${encodeURIComponent(range)}`, {
      method: "GET",
    }),
};

/* =========================
   REPORT API
========================= */

export const reportApi = {
  list: () =>
    request("/feedbacks/reports", {
      method: "GET",
    }),

  generate: (periodStart, periodEnd) =>
    request("/feedbacks/reports", {
      method: "POST",
      body: JSON.stringify({
        periodStart,
        periodEnd,
      }),
    }),
};

/* =========================
   FEEDBACK API
========================= */

export const feedbackApi = {
  list: (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, value);
      }
    });

    const queryString = query.toString();

    return request(`/feedbacks${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  create: (payload) =>
    request("/feedbacks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getById: (feedbackId) =>
    request(`/feedbacks/${feedbackId}`, {
      method: "GET",
    }),

  analyze: (feedbackId) =>
    request(`/feedbacks/${feedbackId}/analyze`, {
      method: "POST",
    }),

  update: (feedbackId, payload) =>
    request(`/feedbacks/${feedbackId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (feedbackId) =>
    request(`/feedbacks/${feedbackId}`, {
      method: "DELETE",
    }),
};

export const workspaceApi = {
  members: () =>
    request("/workspace/members", {
      method: "GET",
    }),

  createMember: (payload) =>
    request("/workspace/members", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMember: (memberId, payload) =>
    request(`/workspace/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteMember: (memberId) =>
    request(`/workspace/members/${memberId}`, {
      method: "DELETE",
    }),
};

export default request;
