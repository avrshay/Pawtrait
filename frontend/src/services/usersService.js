import { apiRequest } from "./api";

// GET /users — admin/manager: all users.
export function getAllUsers() {
  return apiRequest("/users", { auth: true });
}

// GET /users/:id — a single user (self or staff).
export function getUserById(id) {
  return apiRequest(`/users/${id}`, { auth: true });
}

// POST /users — admin/manager: create a user.
export function createUser(user) {
  return apiRequest("/users", { method: "POST", body: user, auth: true });
}

// PUT /users/:id — admin/manager: update a user.
export function updateUser(id, user) {
  return apiRequest(`/users/${id}`, { method: "PUT", body: user, auth: true });
}

// PUT /users/profile/:id — the logged-in user updating their own details.
export function updateProfile(id, details) {
  return apiRequest(`/users/profile/${id}`, { method: "PUT", body: details, auth: true });
}

// DELETE /users/:id — admin only.
export function deleteUser(id) {
  return apiRequest(`/users/${id}`, { method: "DELETE", auth: true });
}
