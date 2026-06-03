// Every backend response uses the envelope: { success, data, error }.

export const BASE_URL = "http://localhost:3000";

// Auth headers the backend expects for protected routes (see middleware/auth.js).
// The logged-in user (returned by POST /auth/login) is kept in localStorage.
export function getAuthHeaders() {
  try {
    const stored = JSON.parse(localStorage.getItem("pawtrait_user"));
    if (!stored) return {};
    const headers = {};
    if (stored.userId != null) headers["x-user-id"] = String(stored.userId);
    if (stored.userRole) headers["x-user-role"] = stored.userRole;
    return headers;
  } catch {
    return {};
  }
}

// Turn browser network errors into a clearer message for the UI.
export function getErrorMessage(err) {
  const msg = err?.message || String(err);
  if (
    msg === "Failed to fetch" ||
    /networkerror|failed to fetch|load failed|network request failed/i.test(msg)
  ) {
    return "Connection problem with the server. Make sure the backend is running :)";
  }
  return msg;
}

// auth headers, and unwraps the { success, data, error } envelope (throws on error).
export async function apiRequest(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(auth ? getAuthHeaders() : {}),
        ...headers,
      },
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // response had no body
  }

  if (!res.ok || (payload && payload.success === false)) {
    const message = payload?.error?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.details = payload?.error?.details;
    throw err;
  }

  return payload ? payload.data : null;
}
