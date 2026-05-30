import { apiRequest } from "./api";

// POST /auth/register — body: { firstName, lastName, email, phone_number, password }.
export function register({ firstName, lastName, email, phone_number, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { firstName, lastName, email, phone_number, password },
  });
}

// POST /auth/login — body: { email, password }. Returns the user object.
export function login({ email, password }) {
  return apiRequest("/auth/login", { method: "POST", body: { email, password } });
}

// Local session helpers (the backend has no token; we store the returned user).
export function saveCurrentUser(user) {
  localStorage.setItem("pawtrait_user", JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("pawtrait_user"));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("pawtrait_user");
}
