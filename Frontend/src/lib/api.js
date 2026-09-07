const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const apiRequest = async (endpoint, options = {}, retry = true) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  /*
   * If the access token has expired, use the refresh-token
   * cookie to obtain a fresh access token and retry once.
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
        return apiRequest(endpoint, options, false);
      }
    } catch (refreshError) {
      console.error("Session refresh failed:", refreshError);
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
